// Stage 12: validation of the finished layout (spatial, topological and planning rules).
import { Pt, segDist, satOverlap, pointInConvex, pointInPoly, nearestOn, area, dist } from './geom';
import { City, Report, edgeKey } from './types';
import { partPoly } from './buildings';
import { poly } from './plan';

export function validateCity(city: City, stats: { repaired: number; dropped: number }, attempts: number): Report {
  const errors: string[] = [];
  const warnings: string[] = [];
  const info: string[] = [];
  const cells = city.cells;
  const st = city.settlement;
  const cityCells = cells.filter((c) => c.kind === 'city');
  if (cityCells.length < Math.max(3, st.blocks * 0.5)) errors.push(`Settlement too small (${cityCells.length} blocks)`);
  if (st.river && !city.river) errors.push('River requested but not generated');
  if (st.river && city.river && city.bridges.length === 0 && st.tierIndex >= 2) errors.push('River crosses the settlement without a bridge');
  const mainGates = city.gates.filter((g) => g.kind === 'main');
  if (st.wall !== 'none' && mainGates.length < 2) errors.push('Fewer than two city gates');

  // --- connectivity: blocks are linked through shared street edges (ring roads / quays connect the rest), bridges and inner gates
  const gateEdges = new Set(city.gates.map((g) => g.edge).filter(Boolean) as string[]);
  const bridgeLinks = new Map<number, number[]>();
  for (const b of city.bridges) {
    const [x, y] = b.cells;
    bridgeLinks.set(x, [...(bridgeLinks.get(x) ?? []), y]);
    bridgeLinks.set(y, [...(bridgeLinks.get(y) ?? []), x]);
  }
  const hub = city.marketCell >= 0 ? city.marketCell : cityCells.slice().sort((a, b) => b.vids.length - a.vids.length)[0].id;
  const reached = new Set<number>([hub]);
  const q: number[] = [hub];
  while (q.length) {
    const u = q.pop()!;
    const cu = cells[u];
    const next: number[] = [...(bridgeLinks.get(u) ?? [])];
    for (let i = 0; i < cu.nbrs.length; i++) {
      const n = cu.nbrs[i];
      if (n < 0 || cells[n].kind !== 'city') continue;
      const k = edgeKey(cu.vids[i], cu.vids[(i + 1) % cu.vids.length]);
      const c = city.edges[k];
      if (c === 'minor' || c === 'secondary' || c === 'arterial' || (c === 'wallI' && gateEdges.has(k))) next.push(n);
    }
    for (const n of next) if (!reached.has(n)) (reached.add(n), q.push(n));
  }
  let badGates = 0;
  for (const g of mainGates) if (!cityCells.some((c) => c.vids.includes(g.vid) && reached.has(c.id))) badGates++;
  if (badGates) errors.push(`${badGates} gate(s) not connected to the market by streets`);
  const isolated = cityCells.filter((c) => !reached.has(c.id)).length;
  if (isolated) errors.push(`${isolated} block(s) have no street access`);
  let noRoad = 0;
  for (const g of mainGates) if (!city.roads.some((r) => r.gate === g.vid)) noRoad++;
  if (noRoad) errors.push(`${noRoad} gate(s) lack an outer road`);
  if (st.market && city.marketCell >= 0 && !reached.has(city.marketCell)) errors.push('The market square is not reachable');
  if (!st.market && city.marketCell >= 0) errors.push('A market square was placed in a settlement without one');
  for (const [name, id] of [['Citadel', city.citadelCell], ['Cathedral', city.cathedralCell]] as [string, number][]) {
    if (id < 0) {
      if ((name === 'Citadel' && st.citadel) || (name === 'Cathedral' && st.cathedral)) warnings.push(`${name} could not be placed`);
    } else if (!reached.has(id)) errors.push(`${name} is not accessible`);
  }

  // --- spatial checks
  const grid = new Map<string, number[]>();
  const GS = 60;
  city.buildings.forEach((b, i) => {
    for (let x = Math.floor(b.bb[0] / GS); x <= Math.floor(b.bb[2] / GS); x++)
      for (let y = Math.floor(b.bb[1] / GS); y <= Math.floor(b.bb[3] / GS); y++) {
        const k = x + ',' + y;
        if (!grid.has(k)) grid.set(k, []);
        grid.get(k)!.push(i);
      }
  });
  const polys = city.buildings.map((b) => b.parts.map(partPoly));
  let overlaps = 0;
  const checked = new Set<string>();
  for (const list of grid.values())
    for (let i = 0; i < list.length; i++)
      for (let j = i + 1; j < list.length; j++) {
        const a = list[i],
          b = list[j];
        const key = a < b ? a + '_' + b : b + '_' + a;
        if (checked.has(key)) continue;
        checked.add(key);
        const A = city.buildings[a].bb,
          B = city.buildings[b].bb;
        if (A[2] < B[0] || B[2] < A[0] || A[3] < B[1] || B[3] < A[1]) continue;
        let hit = false;
        for (const pa of polys[a]) {
          for (const pb of polys[b]) if (satOverlap(pa, pb, 0.2)) hit = true;
          if (hit) break;
        }
        if (hit) overlaps++;
      }
  if (overlaps) errors.push(`${overlaps} overlapping building pair(s)`);

  let roadHits = 0,
    riverHits = 0,
    outside = 0;
  const byCell = new Map<number, number[]>();
  city.buildings.forEach((b, i) => {
    if (!byCell.has(b.cell)) byCell.set(b.cell, []);
    byCell.get(b.cell)!.push(i);
  });
  for (const [ci, list] of byCell) {
    const cell = cells[ci];
    const pl = poly(city, cell);
    const n = cell.vids.length;
    const segs: [Pt, Pt, number][] = [];
    for (let i = 0; i < n; i++) {
      const k = edgeKey(cell.vids[i], cell.vids[(i + 1) % n]);
      const c = city.edges[k];
      if (c === 'minor' || c === 'secondary' || c === 'arterial') segs.push([pl[i], pl[(i + 1) % n], (city.ew[k] ?? 4) / 2 - 0.4]);
      else if (c === 'wallO' || c === 'wallI') segs.push([pl[i], pl[(i + 1) % n], 2]);
    }
    for (const cut of cell.cuts) segs.push([cut.a, cut.b, cut.w / 2 - 0.4]);
    for (const bi of list) {
      const b = city.buildings[bi];
      if (b.manual) continue;
      let bad = false,
        wet = false,
        out = false;
      for (const p of b.parts) {
        const pts: Pt[] = [];
        if (p.k === 'c') pts.push([p.p[0], p.p[1]]);
        else for (let i = 0; i < 8; i += 2) pts.push([p.p[i], p.p[i + 1]]);
        for (const pt of pts) {
          for (const [a, c, w] of segs) if (segDist(pt, a, c) < w - (p.k === 'c' ? p.p[2] * 0 : 0)) bad = true;
          if (!pointInPoly(pt, pl) && !pointInConvex(pt, pl, 0.05)) out = true;
          if (city.river) {
            const nn = nearestOn(city.river.pts, pt);
            if (nn.d < city.river.w[Math.min(city.river.w.length - 1, nn.i)] / 2 + 0.2) wet = true;
          }
        }
      }
      if (bad) roadHits++;
      if (wet) riverHits++;
      if (out) outside++;
    }
  }
  if (roadHits) errors.push(`${roadHits} building(s) touch roads or walls`);
  if (riverHits) errors.push(`${riverHits} building(s) in the river`);
  if (outside) errors.push(`${outside} building(s) outside their block`);

  // --- planning rules
  for (const c of cells) if (c.layout === 'market' && st.market) {
    const pz = c.open.find((o) => o.kind === 'plaza');
    if (!pz) warnings.push('Market has no open plaza');
    else {
      const pts: Pt[] = [];
      for (let i = 0; i < pz.poly.length; i += 2) pts.push([pz.poly[i], pz.poly[i + 1]]);
      if (area(pts) < 700) warnings.push('Market square is small');
    }
  }
  const wh = city.buildings.filter((b) => b.type === 'warehouse');
  if (wh.length) {
    let good = 0;
    for (const b of wh) {
      const c: Pt = [(b.bb[0] + b.bb[2]) / 2, (b.bb[1] + b.bb[3]) / 2];
      const dr = city.river ? nearestOn(city.river.pts, c).d : 999;
      const dg = Math.min(...city.gates.map((g) => dist(g.p, c)), 999);
      const cell = cells[b.cell];
      const cn = cell.nbrs.some((n) => n >= 0 && cells[n].kind === 'sea');
      if (dr < 120 || dg < 160 || cn || cell.ward === 'harbour' || cell.ward === 'industrial') good++;
    }
    info.push(`${Math.round((100 * good) / wh.length)}% of warehouses sit near trade routes/water`);
  }
  info.push(`${st.label}: target ${st.population} souls, ${city.buildings.length} dwellings${city.settlement.suburbs ? ' (incl. suburbs)' : ''}`);
  if (city.citadelCell >= 0) {
    const c = cells[city.citadelCell];
    info.push(`Citadel at depth ${c.depth}, ground ${c.elev.toFixed(2)}`);
  }
  if (stats.repaired) info.push(`${stats.repaired} footprint(s) auto-repaired (shrunk to clear water)`);
  if (stats.dropped) info.push(`${stats.dropped} unrepairable footprint(s) skipped`);
  return {
    errors, warnings, info, attempts,
    stats: {
      cells: cityCells.length, buildings: city.buildings.length, districts: city.districts.length, gates: city.gates.length,
      bridges: city.bridges.length, towers: city.towers.length, repaired: stats.repaired, dropped: stats.dropped,
    },
  };
}
