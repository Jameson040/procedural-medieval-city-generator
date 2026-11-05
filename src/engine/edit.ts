// Local editing operations. Each one rebuilds only the cells it touches.
import { RNG } from './rng';
import { Pt, flat, area, pointInPoly, pointInConvex, satOverlap, obb, nearestOn, centroid, unit, sub, add, mul, dist, unflat, octagon } from './geom';
import { City, Cell, Building, BType, WardType, Feature, Gate, edgeKey } from './types';
import { buildCell, cellPieces, manualParts, TYPE_SIZE, bbOf, partPoly, repairOverlaps, Stats } from './buildings';
import { poly } from './plan';
import { buildEi, makeOuterRoad, vertexEdges } from './roads';
import { validateCity } from './validate';
import { invalidate } from './render';
import { WARD_LABEL } from './params';

const stats = (): Stats => ({ repaired: 0, dropped: 0 });
const touch = (city: City) => {
  delete (city as any)._grid;
};

export function revalidate(city: City) {
  const att = city.report.attempts;
  city.report = validateCity(city, { repaired: city.report.stats.repaired ?? 0, dropped: city.report.stats.dropped ?? 0 }, att);
}

function refreshCell(city: City, c: Cell) {
  delete (c as any)._bb;
  if (c.kind === 'city') c.ground = flat(poly(city, c));
}

export function rebuildCells(city: City, ids: number[]) {
  const st = stats();
  for (const id of ids) {
    const c = city.cells[id];
    refreshCell(city, c);
    buildCell(city, c, st);
  }
  repairOverlaps(city, st);
  for (const b of city.buildings) invalidate(b);
  touch(city);
  revalidate(city);
}

export function regenerateDistrict(city: City, did: number) {
  const d = city.districts[did];
  if (!d) return;
  for (const id of d.cells) city.cells[id].variant++;
  rebuildCells(city, d.cells);
}

export function regenerateAll(city: City) {
  const ids = city.cells.filter((c) => c.kind === 'city').map((c) => c.id);
  for (const id of ids) city.cells[id].variant++;
  rebuildCells(city, ids);
}

export function setDistrictType(city: City, did: number, type: WardType) {
  const d = city.districts[did];
  if (!d) return;
  d.type = type;
  const rng = new RNG(city.seedUsed + 'dt' + did + type);
  for (const id of d.cells) {
    const c = city.cells[id];
    if (c.layout === 'market' || c.layout === 'castle' || c.layout === 'cathedral') continue;
    c.ward = type;
    c.variant++;
    const a = area(poly(city, c));
    c.layout = !c.locked && a > 3400 && ((type === 'scholar' && rng.chance(0.5)) || (type === 'military' && rng.chance(0.3)) || (type === 'religious' && rng.chance(0.4)) || (type === 'noble' && rng.chance(0.3))) ? 'ring' : 'blocks';
  }
  if (!/^[A-Z]/.test(d.name) || true) d.name = d.name.replace(/\s\S+(\s\S+)?$/, '') + ' ' + (WARD_LABEL[type].split(' ')[1] ?? WARD_LABEL[type]);
  rebuildCells(city, d.cells);
}

/* ---------- roads: move a street junction ---------- */
export function vertexMovable(city: City, vid: number): boolean {
  if (city.river?.vids.includes(vid)) return false;
  const inc = city.cells.filter((c) => c.vids.includes(vid));
  if (inc.length < 3) return false;
  for (const c of inc) {
    if (c.kind !== 'city' || c.locked) return false;
    const n = c.vids.length;
    for (let i = 0; i < n; i++) {
      if (c.vids[i] !== vid) continue;
      for (const j of [i, (i - 1 + n) % n]) {
        const cls = city.edges[edgeKey(c.vids[j], c.vids[(j + 1) % n])];
        if (cls !== 'minor' && cls !== 'secondary' && cls !== 'arterial') return false;
      }
    }
  }
  return !city.gates.some((g) => g.vid === vid);
}

export function moveVertex(city: City, vid: number, p: Pt): boolean {
  if (!vertexMovable(city, vid)) return false;
  const old = city.verts[vid];
  const inc = city.cells.filter((c) => c.vids.includes(vid));
  city.verts[vid] = [p[0], p[1]];
  for (const c of inc) {
    const pl = poly(city, c);
    // concave blocks are allowed (they are decomposed into convex sub-blocks); reject tiny,
    // self-intersecting or inverted ones
    if (area(pl) < 1200 || area(pl) <= 0 || !simplePoly(pl)) {
      city.verts[vid] = old;
      return false;
    }
  }
  const pz = city.plazas.find((x) => x.vid === vid);
  for (const f of city.features) if (pz && f.p === old) f.p = city.verts[vid];
  for (const c of inc) c.center = centroid(poly(city, c));
  rebuildCells(city, inc.map((c) => c.id));
  return true;
}

function segX(a: Pt, b: Pt, c: Pt, d: Pt) {
  const o = (p: Pt, q: Pt, r: Pt) => Math.sign((q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]));
  return o(a, b, c) * o(a, b, d) < 0 && o(c, d, a) * o(c, d, b) < 0;
}
function simplePoly(pl: Pt[]) {
  const n = pl.length;
  for (let i = 0; i < n; i++)
    for (let j = i + 2; j < n; j++) {
      if (i === 0 && j === n - 1) continue;
      if (segX(pl[i], pl[(i + 1) % n], pl[j], pl[(j + 1) % n])) return false;
    }
  return true;
}

/* ---------- buildings ---------- */
export function cellAt(city: City, p: Pt): Cell | null {
  for (const c of city.cells) {
    if (c.kind !== 'city') continue;
    const bb = ((c as any)._bb ??= (() => {
      const pl = poly(city, c);
      return [Math.min(...pl.map((q) => q[0])), Math.min(...pl.map((q) => q[1])), Math.max(...pl.map((q) => q[0])), Math.max(...pl.map((q) => q[1]))];
    })());
    if (p[0] < bb[0] || p[0] > bb[2] || p[1] < bb[1] || p[1] > bb[3]) continue;
    if (pointInPoly(p, poly(city, c))) return c;
  }
  return null;
}

function grid(city: City): Map<number, Building[]> {
  let g = (city as any)._grid as Map<number, Building[]> | undefined;
  if (g) return g;
  g = new Map();
  const S = 50;
  for (const b of city.buildings)
    for (let x = Math.floor(b.bb[0] / S); x <= Math.floor(b.bb[2] / S); x++)
      for (let y = Math.floor(b.bb[1] / S); y <= Math.floor(b.bb[3] / S); y++) {
        const k = (x + 1000) * 4096 + (y + 1000);
        const l = g.get(k);
        if (l) l.push(b);
        else g.set(k, [b]);
      }
  (city as any)._grid = g;
  return g;
}

export function findBuildingAt(city: City, p: Pt): Building | null {
  const l = grid(city).get((Math.floor(p[0] / 50) + 1000) * 4096 + (Math.floor(p[1] / 50) + 1000));
  if (!l) return null;
  for (let i = l.length - 1; i >= 0; i--) {
    const b = l[i];
    if (p[0] < b.bb[0] || p[0] > b.bb[2] || p[1] < b.bb[1] || p[1] > b.bb[3]) continue;
    for (const part of b.parts) {
      if (part.k === 'c' ? Math.hypot(p[0] - part.p[0], p[1] - part.p[1]) <= part.p[2] : pointInConvex(p, unflat(part.p), 0)) return b;
    }
  }
  return null;
}

export function checkPlacement(city: City, parts: Building['parts'], ignore = -1): string | null {
  const bb = bbOf(parts);
  const c0: Pt = [(bb[0] + bb[2]) / 2, (bb[1] + bb[3]) / 2];
  const cell = cellAt(city, c0);
  if (!cell) return 'Outside the city blocks';
  const pieces = cellPieces(city, cell);
  const polys = parts.map(partPoly);
  const pts: Pt[] = [];
  for (const f of polys) for (let i = 0; i < f.length; i += 2) pts.push([f[i], f[i + 1]]);
  const piece = pieces.find((pc) => pointInConvex(c0, pc, 0.01)) ?? pieces.find((pc) => pts.every((q) => pointInConvex(q, pc, 0.3)));
  if (!piece) return 'Not on a building block (roads, walls and water stay free)';
  if (!pts.every((q) => pointInConvex(q, piece, 0.15))) return 'Does not fit inside the block';
  for (const o of cell.open) {
    if (o.kind === 'bailey' || o.kind === 'yard') continue;
    const op = unflat(o.poly);
    if (pts.some((q) => pointInConvex(q, op, -0.2))) return 'Blocked by an open square';
  }
  if (city.river) {
    for (const q of pts) {
      const n = nearestOn(city.river.pts, q);
      if (n.d < city.river.w[Math.min(city.river.w.length - 1, n.i)] / 2 + 1) return 'Too close to the river';
    }
  }
  for (const b of city.buildings) {
    if (b.id === ignore || b.bb[2] < bb[0] || b.bb[0] > bb[2] || b.bb[3] < bb[1] || b.bb[1] > bb[3]) continue;
    for (const pa of b.parts.map(partPoly)) for (const pb of polys) if (satOverlap(pa, pb, 0.1)) return 'Overlaps another building';
  }
  return null;
}

export function placeBuilding(city: City, type: BType, p: Pt): string | Building {
  const cell = cellAt(city, p);
  if (!cell) return 'Click inside the city';
  const pieces = cellPieces(city, cell);
  const piece = pieces.find((pc) => pointInConvex(p, pc, 0));
  if (!piece) return 'Not on a building block';
  const o = obb(piece);
  const [w, h] = TYPE_SIZE[type] ?? [10, 12];
  const rng = new RNG(city.seedUsed + 'm' + city.nextId);
  let best: string | null = 'Does not fit';
  for (const s of [1, 0.85, 0.7, 0.55]) {
    const parts = manualParts(type, { cx: p[0], cy: p[1], w: w * s, h: h * s, a: o.a }, rng);
    const err = checkPlacement(city, parts);
    if (!err) {
      const b: Building = { id: city.nextId++, type, cell: cell.id, parts, pal: type === 'hovel' ? 'thatch' : type === 'church' || type === 'cathedral' ? 'slate' : 'tile', ci: rng.int(0, 4), h: 1, bb: bbOf(parts), manual: true };
      city.buildings.push(b);
      touch(city);
      revalidate(city);
      return b;
    }
    best = err;
  }
  return best ?? 'Does not fit';
}

export function moveBuilding(city: City, b: Building, orig: Building['parts'], dx: number, dy: number): string | null {
  const parts = orig.map((p) => (p.k === 'c' ? { ...p, p: [p.p[0] + dx, p.p[1] + dy, p.p[2]] } : { ...p, p: p.p.map((v, i) => v + (i % 2 ? dy : dx)) }));
  const err = checkPlacement(city, parts, b.id);
  if (err) return err;
  b.parts = parts;
  b.bb = bbOf(parts);
  const cell = cellAt(city, [(b.bb[0] + b.bb[2]) / 2, (b.bb[1] + b.bb[3]) / 2]);
  if (cell) b.cell = cell.id;
  b.manual = true;
  invalidate(b);
  touch(city);
  return null;
}

export function deleteBuilding(city: City, id: number) {
  city.buildings = city.buildings.filter((b) => b.id !== id);
  touch(city);
  revalidate(city);
}

/* ---------- landmarks ---------- */
export function addFeature(city: City, type: Feature['type'], p: Pt): string | Feature {
  const cell = cellAt(city, p);
  if (cell) {
    const pieces = cellPieces(city, cell);
    if (pieces.some((pc) => pointInConvex(p, pc, -1)) && findBuildingAt(city, p)) return 'Occupied by a building';
  }
  const f: Feature = { id: city.nextId++, type, p };
  city.features.push(f);
  return f;
}
export function nearestFeature(city: City, p: Pt, r: number): Feature | null {
  let best: Feature | null = null,
    bd = r;
  for (const f of city.features) {
    const d = dist(f.p, p);
    if (d < bd) (bd = d), (best = f);
  }
  return best;
}
export function removeFeature(city: City, id: number) {
  city.features = city.features.filter((f) => f.id !== id);
}

/* ---------- gates ---------- */
export function nearestWallVertex(city: City, p: Pt, r: number): number {
  let best = -1,
    bd = r;
  for (const w of city.walls) {
    if (w.kind !== 'outer') continue;
    for (const v of w.vids) {
      const d = dist(city.verts[v], p);
      if (d < bd) (bd = d), (best = v);
    }
  }
  return best;
}

export function toggleGate(city: City, vid: number): string {
  const idx = city.gates.findIndex((g) => g.vid === vid && g.wall === 'outer' && g.kind !== 'water');
  if (idx >= 0) {
    const g = city.gates[idx];
    city.gates.splice(idx, 1);
    city.roads = city.roads.filter((r) => r.gate !== vid);
    city.towers = city.towers.filter((t) => !(t.wall === 'outer' && ((t.r < 5.5 && t.r > 5) || (t.kind === 'square' && t.r < 4)) && dist(t.p, g.p) < 9.5));
    revalidate(city);
    return 'Gate walled up';
  }
  const run = city.walls.find((w) => w.kind === 'outer' && w.vids.includes(vid));
  if (!run) return 'Pick a vertex of the outer wall';
  const n = run.vids.length;
  const i = run.vids.indexOf(vid);
  if (!run.closed && (i === 0 || i === n - 1)) return 'Cannot place a gate at the end of a wall run';
  const pv = city.verts[run.vids[(i - 1 + n) % n]],
    nv = city.verts[run.vids[(i + 1) % n]];
  const tan = unit(sub(nv, pv));
  const dir: Pt = [tan[1], -tan[0]];
  if (city.river?.vids.includes(vid)) return 'Gates cannot sit on the river';
  const vE = vertexEdges(buildEi(city));
  if (!(vE.get(vid) ?? []).some((k) => city.edges[k] === 'minor' || city.edges[k] === 'secondary' || city.edges[k] === 'arterial')) return 'No inward street at this vertex';
  const road = makeOuterRoad(city, buildEi(city), new RNG(city.seedUsed + 'g' + vid), vid, dir);
  if (!road) return 'No open country beyond this wall segment';
  const P = city.verts[vid];
  const g: Gate = { vid, p: P, kind: 'postern', wall: 'outer', tan, dir };
  city.gates.push(g);
  city.roads.push(road);
  road.w = 2.6;
  city.towers.push({ p: add(P, mul(unit(sub(pv, P)), Math.min(7, dist(pv, P) * 0.35))), r: 3.6, kind: 'square', wall: 'outer', dir });
  revalidate(city);
  return 'Postern gate added with an outer road';
}

export const octa = octagon;
