// Stage 5: anchors (citadel, cathedral), district seeding & growth, geography overrides, naming.
import { Pt, area, dist, mid } from './geom';
import { MinHeap } from './graph';
import { Cell, WardType, District, edgeKey } from './types';
import { Ctx, poly } from './plan';
import { identityOf, WARD_LABEL, placeWord } from './params';

const cellArea = (ctx: Ctx, c: Cell) => area(poly(ctx.city, c));

function coastAdj(ctx: Ctx, c: Cell) {
  return c.nbrs.some((n) => n >= 0 && ctx.city.cells[n].kind === 'sea');
}
function riverAdj(ctx: Ctx, c: Cell) {
  const r = ctx.city.river;
  if (!r) return false;
  const n = c.vids.length;
  for (let i = 0; i < n; i++) if (edgeKey(c.vids[i], c.vids[(i + 1) % n]) in r.ew) return true;
  return false;
}

function blankRef(cells: Cell[]): Cell {
  return cells[0];
}

export function chooseAnchors(ctx: Ctx) {
  const { city, rng } = ctx;
  const st = city.settlement;
  const cells = city.cells;
  const idn = identityOf(city.params.identity);
  const cc = cells.filter((c) => c.kind === 'city');
  // a settlement without a market still needs a reference point (the civic centre)
  const market: Cell =
    city.marketCell >= 0
      ? cells[city.marketCell]
      : {
          ...(cc[0] ?? blankRef(cells)),
          center: [cc.reduce((s, c) => s + c.center[0], 0) / Math.max(1, cc.length), cc.reduce((s, c) => s + c.center[1], 0) / Math.max(1, cc.length)],
        };
  const elevs = cc.map((c) => c.elev);
  const emin = Math.min(...elevs),
    emax = Math.max(...elevs);
  const en = (c: Cell) => (emax > emin ? (c.elev - emin) / (emax - emin) : 0.5);
  const free = () => cells.filter((c) => c.kind === 'city' && c.layout === 'blocks' && !c.locked && c.vids.length >= 4);
  let best: Cell | null = null,
    bs = -Infinity;
  for (const c of free()) {
    const a = cellArea(ctx, c);
    let s = a / 140 + rng.range(0, 10) - (a < 3600 ? 200 : 0);
    const dm = market ? dist(c.center, market.center) : dist(c.center, c.center);
    // generic defensibility: high ground, on the curtain wall, protected by water, a salient corner, overlooking a gate
    const outsideN = c.nbrs.filter((n) => n < 0 || cells[n].kind !== 'city').length;
    const water = coastAdj(ctx, c) || riverAdj(ctx, c);
    const gateNear = city.gates.some((g) => g.kind === 'main' && dist(g.p, c.center) < 150);
    let def = 45 * en(c) + (c.depth === 0 ? 18 : 0) + (water ? 14 : 0) + (outsideN >= 2 ? 10 : 0) + (gateNear ? 8 : 0);
    // a castle in the middle of the town is only plausible for a royal residence
    if (idn.citadel !== 'centre' && dm < 0.3 * ctx.R) def -= 70;
    s += def;
    switch (idn.citadel) {
      case 'edge': s += (c.depth === 0 ? 26 : 0) - (coastAdj(ctx, c) ? 18 : 0); break;
      case 'high': s += 120 * en(c) + (c.depth <= 1 ? 10 : 0); break;
      case 'centre': s += 70 - dm / 5 + (c.nbrs.includes(market.id) ? 30 : 0) - def * 0.6; break;
      case 'water': s += (water ? 45 : 0) + (c.depth === 0 ? 14 : 0); break;
    }
    if (s > bs) (bs = s), (best = c);
  }
  if (best && st.citadel) {
    best.layout = 'castle';
    best.ward = 'citadel';
    city.citadelCell = best.id;
  }
  best = null;
  bs = -Infinity;
  for (const c of free()) {
    const a = cellArea(ctx, c);
    const dm = market ? dist(c.center, market.center) : dist(c.center, c.center);
    let s = a / 150 + rng.range(0, 12) - (a < 3200 ? 150 : 0);
    s += market && c.nbrs.includes(market.id) ? 55 : dm < 0.34 * ctx.R ? 28 : 0;
    s -= c.depth === 0 ? 30 : 0;
    if (c.nbrs.includes(city.citadelCell)) s -= 25;
    if (s > bs) (bs = s), (best = c);
  }
  if (best && st.cathedral) {
    best.layout = 'cathedral';
    best.ward = 'religious';
    city.cathedralCell = best.id;
  } else if (best && st.church) {
    // a village or small town gets a parish church with a churchyard instead of a cathedral
    best.layout = 'church';
    best.ward = 'religious';
    city.cathedralCell = best.id;
  }
}

export function assignDistricts(ctx: Ctx) {
  const { city, rng } = ctx;
  const cells = city.cells;
  const idn = identityOf(city.params.identity);
  const res = city.resolved;
  const cityCells = cells.filter((c) => c.kind === 'city');
  const market: Cell | undefined = city.marketCell >= 0 ? cells[city.marketCell] : undefined;
  const citadel = city.citadelCell >= 0 ? (cells[city.citadelCell] as Cell | undefined) : undefined;
  const cath = city.cathedralCell >= 0 ? (cells[city.cathedralCell] as Cell | undefined) : undefined;
  const gatePts = city.gates.filter((g) => g.wall === 'outer').map((g) => g.p);
  const gateDist = (c: Cell) => (gatePts.length ? Math.min(...gatePts.map((p) => dist(p, c.center))) : 999);
  const arterialTouch = (c: Cell) => {
    let n = 0;
    for (let i = 0; i < c.vids.length; i++) if (city.edges[edgeKey(c.vids[i], c.vids[(i + 1) % c.vids.length])] === 'arterial') n++;
    return n;
  };
  // geography overrides first: harbour zone
  const harbourCells = new Set<number>();
  if (res.harbour) {
    if (res.geo === 'coast') {
      let anchor: Pt | null = null,
        bd = Infinity;
      const coastEdges: { k: string; m: Pt; cell: Cell }[] = [];
      for (const c of cityCells)
        for (let i = 0; i < c.vids.length; i++) {
          const a = c.vids[i],
            b = c.vids[(i + 1) % c.vids.length];
          const k = edgeKey(a, b);
          if (city.edges[k] === 'coast') {
            const m = mid(city.verts[a], city.verts[b]);
            coastEdges.push({ k, m, cell: c });
            const d = market ? dist(m, market.center) : dist(m, c.center);
            if (d < bd) (bd = d), (anchor = m);
          }
        }
      if (anchor) for (const e of coastEdges) if (dist(e.m, anchor) < 210) (ctx.harbourEdges.add(e.k), harbourCells.add(e.cell.id));
    } else if (city.river) {
      let anchor: Pt | null = null,
        bd = Infinity;
      for (const k of Object.keys(city.river.ew)) {
        const e = ctx.ei.get(k);
        if (!e || e.cells.length < 2 || e.cells.some((c) => cells[c].kind !== 'city')) continue;
        const m = mid(city.verts[e.a], city.verts[e.b]);
        const d = market ? dist(m, market.center) : dist(m, cells[e.cells[0]].center);
        if (d < bd) (bd = d), (anchor = m);
      }
      if (anchor)
        for (const k of Object.keys(city.river.ew)) {
          const e = ctx.ei.get(k);
          if (!e || e.cells.length < 2 || e.cells.some((c) => cells[c].kind !== 'city')) continue;
          if (dist(mid(city.verts[e.a], city.verts[e.b]), anchor) < 170) {
            ctx.harbourEdges.add(k);
            for (const c of e.cells) harbourCells.add(c);
          }
        }
    }
  }
  const anchors = new Set<number>([market?.id ?? -1, citadel?.id ?? -1, cath?.id ?? -1]);
  anchors.delete(-1);
  // pick seed types
  const K = Math.max(1, city.settlement.districts);
  const wts: [WardType, number][] = Object.entries(idn.ward)
    .filter(([t]) => t !== 'harbour' || res.harbour)
    .map(([t, w]) => [t as WardType, w as number]);
  const seedTypes: WardType[] = [];
  const need = Math.max(1, K - 3);
  const hasHarbour = harbourCells.size > 0;
  if (hasHarbour) seedTypes.push('residential');
  while (seedTypes.length < need) {
    const t = rng.weighted(wts);
    seedTypes.push(t);
    const e = wts.find((x) => x[0] === t)!;
    e[1] *= 0.5;
  }
  // suitability
  const suit = (t: WardType, c: Cell) => {
    const dm = market ? dist(c.center, market.center) : dist(c.center, c.center);
    const R = ctx.R;
    switch (t) {
      case 'noble': return 60 * c.elev - Math.abs(dm - 0.3 * R) / 9 - (c.depth === 0 ? 18 : 0) + (citadel && c.nbrs.includes(citadel.id) ? 20 : 0);
      case 'merchant': return -dm / 9 + (riverAdj(ctx, c) ? 22 : 0) + arterialTouch(c) * 9;
      case 'residential': return 10 - Math.abs(dm - 0.5 * R) / 18;
      case 'artisan': return -Math.abs(dm - 0.5 * R) / 14 + arterialTouch(c) * 5;
      case 'industrial': return (riverAdj(ctx, c) ? 45 : 0) + (c.depth === 0 ? 14 : 0) - dm / 25;
      case 'religious': return -dm / 10;
      case 'harbour': return (coastAdj(ctx, c) || riverAdj(ctx, c) ? 40 : -20);
      case 'military': return (gateDist(c) < 120 ? 32 : 0) + (citadel && c.nbrs.includes(citadel.id) ? 30 : 0) + (c.depth === 0 ? 10 : 0);
      case 'poor': return (c.depth === 0 ? 34 : 0) + dm / 22 - 14 * c.elev + (riverAdj(ctx, c) ? 8 : 0);
      case 'scholar': return -dist(c.center, (cath ?? market ?? c).center) / 9 + 8;
      default: return 0;
    }
  };
  const hop = (a: number, b: number) => dist(cells[a].center, cells[b].center);
  const seeds: { cell: Cell; type: WardType; str: number }[] = [];
  if (cath) seeds.push({ cell: cath, type: 'religious', str: 0.55 });
  const taken = new Set<number>(anchors);
  for (const t of seedTypes) {
    let best: Cell | null = null,
      bs = -Infinity;
    for (const c of cityCells) {
      if (taken.has(c.id) || c.locked && false) continue;
      let s = suit(t, c) + rng.range(0, 14);
      for (const sd of seeds) if (hop(sd.cell.id, c.id) < 110) s -= 25;
      if (s > bs) (bs = s), (best = c);
    }
    if (best) {
      taken.add(best.id);
      seeds.push({ cell: best, type: t, str: rng.range(0.8, 1.3) });
    }
  }
  // growth: strength-weighted multi-source flood over cell adjacency
  const owner = new Map<number, number>();
  const bestD = new Map<number, number>();
  const heap = new MinHeap();
  seeds.forEach((s, i) => {
    owner.set(s.cell.id, i);
    bestD.set(s.cell.id, 0);
    heap.push(0, s.cell.id);
  });
  while (heap.size) {
    const [d, u] = heap.pop();
    if (d > (bestD.get(u) ?? Infinity)) continue;
    const o = owner.get(u)!;
    for (const n of cells[u].nbrs) {
      if (n < 0 || cells[n].kind !== 'city' || anchors.has(n)) continue;
      const nd = d + hop(u, n) / seeds[o].str;
      if (nd < (bestD.get(n) ?? Infinity)) {
        bestD.set(n, nd);
        owner.set(n, o);
        heap.push(nd, n);
      }
    }
  }
  for (const c of cityCells) {
    if (c.id === market?.id || c.id === citadel?.id) continue;
    if (c.id === cath?.id) continue;
    c.ward = owner.has(c.id) ? seeds[owner.get(c.id)!].type : 'residential';
    if (c.ward === 'harbour' && !harbourCells.has(c.id)) c.ward = 'residential';
  }
  for (const id of harbourCells) if (!anchors.has(id)) cells[id].ward = 'harbour';
  for (const c of cityCells) {
    if (anchors.has(c.id) || c.ward === 'harbour') continue;
    const adjA = c.nbrs.some((n) => n >= 0 && (n === citadel?.id || n === market?.id));
    if (c.depth === 0 && !adjA && (c.ward === 'residential' || c.ward === 'artisan') && rng.chance(idn.poor * 0.75)) c.ward = 'poor';
    else if (c.depth === 1 && c.ward === 'residential' && rng.chance(idn.poor * 0.15)) c.ward = 'poor';
  }
  if ((idn.ward.military ?? 0) >= 1)
    for (const g of city.gates.filter((g) => g.wall === 'outer'))
      for (const c of cityCells)
        if (c.vids.includes(g.vid) && !anchors.has(c.id) && (c.ward === 'residential' || c.ward === 'poor' || c.ward === 'artisan') && rng.chance(0.4)) c.ward = 'military';
  // layouts
  let scholarFirst = true;
  for (const c of cityCells) {
    if (c.layout !== 'blocks' || c.locked || c.vids.length < 4) continue;
    const a = cellArea(ctx, c);
    if (a < 3400) continue;
    if (c.ward === 'scholar' && (scholarFirst || rng.chance(0.4))) (c.layout = 'ring'), (scholarFirst = false);
    else if (c.ward === 'military' && rng.chance(0.25)) c.layout = 'ring';
    else if (c.ward === 'religious' && rng.chance(0.4)) c.layout = 'ring';
    else if (c.ward === 'noble' && a > 4500 && rng.chance(0.3)) c.layout = 'ring';
  }
  // districts = connected components of identical ward, then merged / split to honour the requested count
  const SHORT: Record<WardType, string[]> = {
    citadel: ['Citadel'], market: ['Market'], noble: ['Quarter', 'Heights', 'Court'], merchant: ['Quarter', 'Exchange', 'Mercantile'],
    residential: ['Ward', 'Quarter', 'Hill', 'End'], artisan: ['Craft Quarter', 'Guild Row', 'Wrights'], industrial: ['Works', 'Millside', 'Forge Quarter'],
    religious: ['Close', 'Minster Quarter', 'Abbey Ward'], harbour: ['Docks', 'Quay', 'Harbour'], military: ['Garrison', 'Barracks Ward'],
    poor: ['Rookery', 'Shambles', 'Low Ward'], scholar: ['University Quarter', "Scholars' Row"],
  };
  let groups: number[][] = [];
  {
    const done = new Set<number>();
    for (const c of cityCells) {
      if (done.has(c.id) || !c.ward) continue;
      const comp: number[] = [];
      const st = [c.id];
      done.add(c.id);
      while (st.length) {
        const u = st.pop()!;
        comp.push(u);
        for (const n of cells[u].nbrs)
          if (n >= 0 && cells[n].kind === 'city' && !done.has(n) && cells[n].ward === c.ward) (done.add(n), st.push(n));
      }
      groups.push(comp);
    }
  }
  const fixed = (g: number[]) => g.some((id) => id === market?.id || id === citadel?.id || id === cath?.id) && g.length === 1;
  const target = Math.max(1, city.settlement.districts) + groups.filter(fixed).length;
  const groupOf = () => {
    const m = new Map<number, number>();
    groups.forEach((g, i) => g.forEach((id) => m.set(id, i)));
    return m;
  };
  // merge: smallest free district joins the neighbour it shares most edges with (takes its character)
  let guard = 0;
  while (groups.length > target && guard++ < 200) {
    const gm = groupOf();
    const order = groups.map((g, i) => [i, g.length] as [number, number]).filter(([i]) => !fixed(groups[i])).sort((a, b) => a[1] - b[1]);
    let merged = false;
    for (const [gi] of order) {
      const cnt = new Map<number, number>();
      for (const id of groups[gi]) for (const n of cells[id].nbrs) {
        const o = gm.get(n);
        if (o === undefined || o === gi || fixed(groups[o])) continue;
        cnt.set(o, (cnt.get(o) ?? 0) + 1);
      }
      if (!cnt.size) continue;
      const into = [...cnt.entries()].sort((a, b) => b[1] - a[1])[0][0];
      const t = cells[groups[into][0]].ward!;
      for (const id of groups[gi]) {
        if (cells[id].ward === 'harbour' && t !== 'harbour') continue;
        cells[id].ward = t;
        if (cells[id].layout === 'ring' && t !== 'scholar' && t !== 'military' && t !== 'religious' && t !== 'noble') cells[id].layout = 'blocks';
      }
      groups[into] = groups[into].concat(groups[gi]);
      groups.splice(gi, 1);
      merged = true;
      break;
    }
    if (!merged) break;
  }
  // split: the largest district is cut in two along its long axis (same character, distinct names)
  guard = 0;
  while (groups.length < target && guard++ < 40) {
    let gi = -1;
    for (let i = 0; i < groups.length; i++) if (!fixed(groups[i]) && groups[i].length >= 6 && (gi < 0 || groups[i].length > groups[gi].length)) gi = i;
    if (gi < 0) break;
    const g = groups[gi];
    let a = g[0], b = g[0], bd = -1;
    for (const x of g) for (const y of g) {
      const d = dist(cells[x].center, cells[y].center);
      if (d > bd) (bd = d), (a = x), (b = y);
    }
    const A: number[] = [], Bc: number[] = [];
    for (const id of g) (dist(cells[id].center, cells[a].center) <= dist(cells[id].center, cells[b].center) ? A : Bc).push(id);
    const connected = (part: number[]) => {
      const set = new Set(part), seen = new Set([part[0]]), st = [part[0]];
      while (st.length) { const u = st.pop()!; for (const n of cells[u].nbrs) if (set.has(n) && !seen.has(n)) (seen.add(n), st.push(n)); }
      return seen.size === part.length;
    };
    if (A.length < 3 || Bc.length < 3 || !connected(A) || !connected(Bc)) break;
    groups.splice(gi, 1, A, Bc);
  }
  groups = groups.filter((g) => g.length);
  const districts: District[] = [];
  const nameSeen = new Set<string>();
  for (const comp of groups) {
    const ward = cells[comp[0]].ward!;
    let nm = '';
    for (let tries = 0; tries < 10; tries++) {
      const w = placeWord(rng);
      const sh = SHORT[ward][rng.int(0, SHORT[ward].length)];
      nm = ward === 'market' ? 'Grand Market' : ward === 'citadel' ? `${w} Citadel` : `${w} ${sh}`;
      if (!nameSeen.has(nm)) break;
    }
    nameSeen.add(nm);
    const id = districts.length;
    let cx = 0, cy = 0;
    for (const u of comp) {
      cells[u].district = id;
      cx += cells[u].center[0];
      cy += cells[u].center[1];
    }
    districts.push({ id, type: ward, name: nm, cells: comp, center: [cx / comp.length, cy / comp.length] });
  }
  city.districts = districts;
  void WARD_LABEL;
}
