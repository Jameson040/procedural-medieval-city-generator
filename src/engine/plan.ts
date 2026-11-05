// Stage 1-2: geography, planar mesh (Voronoi), river, city extent, edge classes.
import { Delaunay } from 'd3-delaunay';
import { RNG, Noise } from './rng';
import {
  Pt, lerp, smooth, dist, mid, area, centroid, chaikin, cleanPoly,
} from './geom';
import { dijkstra, tracePath, Adj } from './graph';
import { Params, Resolved, resolveParams } from './params';
import { settlementFor } from './settlement';
import { City, Cell, edgeKey, EdgeCls } from './types';

export interface EdgeInfo {
  a: number;
  b: number;
  cells: number[];
}

export interface Ctx {
  city: City;
  rng: RNG;
  N: number;
  R: number;
  ei: Map<string, EdgeInfo>;
  sea: (x: number, y: number) => boolean;
  elev: (x: number, y: number) => number;
  noise: Noise;
  riverVids: Set<number>;
  seaAng: number;
  seaOff: number;
  harbourEdges: Set<string>;
}

export function makeElev(t: { seed: number; amt: number; geo: string; ang: number }) {
  const n1 = new Noise(t.seed),
    n2 = new Noise(t.seed + 77);
  const c = Math.cos(t.ang),
    s = Math.sin(t.ang);
  return (x: number, y: number) => {
    let e = t.amt * (0.55 * n1.fbm(x / 520 + 3, y / 520 + 9, 4) + 0.14 * n2.fbm(x / 140, y / 140, 2));
    if (t.geo === 'hills') e += 0.8 * Math.exp(-(((x + 30) ** 2 + (y - 20) ** 2) / (2 * 300 * 300)));
    if (t.geo === 'mountain') {
      const v = Math.abs(-x * s + y * c);
      e += 1.0 * smooth(110, 720, v) + 0.12 * n2.fbm(x / 90, y / 90, 3);
    }
    return e;
  };
}

export function createCtx(params: Params, seed: string): { ctx: Ctx; resolved: Resolved } {
  const rng = new RNG(seed);
  const resolved = resolveParams(params);
  const st = settlementFor(params);
  const R = st.radius;
  const N = st.blocks;
  const seaAng = rng.range(0, Math.PI * 2);
  const terrain = {
    seed: rng.int(1, 1e6),
    amt: 0.2 + 1.1 * params.terrain,
    geo: resolved.geo as string,
    ang: resolved.geo === 'coast' ? seaAng : rng.range(0, Math.PI * 2),
  };
  const BR = Math.max(430, R * 2.3);
  const noise = new Noise(rng.int(1, 1e6));
  const seaOff = R * 0.62;
  let sea = (_x: number, _y: number) => false;
  if (resolved.geo === 'coast') {
    const nx = Math.cos(seaAng),
      ny = Math.sin(seaAng);
    sea = (x, y) => {
      const u = x * nx + y * ny,
        v = -x * ny + y * nx;
      return u > seaOff + 0.0011 * v * v + (noise.fbm(x / (R * 0.55) + 11, y / (R * 0.55) + 7, 3) - 0.5) * R * 0.19;
    };
  }
  const city: City = {
    version: 3,
    params,
    settlement: st,
    resolved,
    name: '',
    bounds: [-BR, -BR, BR, BR],
    verts: [],
    cells: [],
    edges: {},
    ew: {},
    river: null,
    walls: [],
    gates: [],
    towers: [],
    moat: 0,
    bridges: [],
    streets: [],
    roads: [],
    plazas: [],
    features: [],
    districts: [],
    buildings: [],
    piers: [],
    boats: [],
    waves: [],
    fields: [],
    forest: [],
    terrain,
    marketCell: -1,
    citadelCell: -1,
    cathedralCell: -1,
    nextId: 1,
    report: { errors: [], warnings: [], info: [], stats: {}, attempts: 1 },
    seedUsed: seed,
  };
  return {
    ctx: { city, rng, N, R, ei: new Map(), sea, elev: makeElev(terrain), noise, riverVids: new Set(), seaAng, seaOff, harbourEdges: new Set() },
    resolved,
  };
}

function blankCell(id: number, vids: number[], center: Pt): Cell {
  return {
    id, vids, nbrs: [], kind: 'outside', center, elev: 0, district: -1, layout: 'blocks', variant: 0, inner: false, depth: 99,
    ground: [], blocks: [], open: [], cuts: [], yards: [], trees: [], stalls: [], graves: [],
  };
}

/** Spiral sites (dense centre) + loose outer grid -> relaxed Voronoi -> shared-vertex planar mesh */
export function buildMesh(ctx: Ctx) {
  const { city, rng, N, R } = ctx;
  const B = city.bounds;
  const sites: Pt[] = [];
  const c = R / Math.sqrt(N * 0.9);
  const nIn = Math.max(14, Math.round(N * 2.2));
  const sa = rng.range(0, Math.PI * 2);
  let rMax = 0;
  for (let i = 0; i < nIn; i++) {
    const a = sa + i * 2.39996 + rng.range(-0.05, 0.05);
    const r = c * Math.sqrt(i + 0.5) * (0.78 + 0.3 * Math.min(1, i / N)) * rng.range(0.96, 1.04);
    rMax = Math.max(rMax, r);
    sites.push([Math.cos(a) * r, Math.sin(a) * r]);
  }
  const sp = Math.max(70, R * 0.37);
  for (let x = B[0] + sp / 2; x < B[2]; x += sp)
    for (let y = B[1] + sp / 2; y < B[3]; y += sp) {
      const p: Pt = [x + rng.range(-0.38, 0.38) * sp, y + rng.range(-0.38, 0.38) * sp];
      // the countryside grid must never intrude into the settlement disc
      if (Math.hypot(p[0], p[1]) > R * 1.04) sites.push(p);
    }
  for (let it = 0; it < 2; it++) {
    const vor = Delaunay.from(sites).voronoi(B);
    for (let i = 0; i < nIn; i++) {
      const poly = vor.cellPolygon(i);
      if (poly) sites[i] = centroid(poly.slice(0, -1) as unknown as Pt[]);
    }
  }
  const vor = Delaunay.from(sites).voronoi(B);
  const snap = new Map<string, number>();
  const verts: Pt[] = [];
  const vid = (p: Pt) => {
    const k = Math.round(p[0] / 2.4) + ',' + Math.round(p[1] / 2.4);
    let id = snap.get(k);
    if (id === undefined) {
      id = verts.length;
      verts.push([p[0], p[1]]);
      snap.set(k, id);
    }
    return id;
  };
  const cells: Cell[] = [];
  for (let i = 0; i < sites.length; i++) {
    const poly = vor.cellPolygon(i) as unknown as Pt[] | null;
    let vids: number[] = [];
    if (poly) {
      for (const p of poly.slice(0, -1)) {
        const id = vid(p);
        if (vids[vids.length - 1] !== id) vids.push(id);
      }
      if (vids.length > 1 && vids[0] === vids[vids.length - 1]) vids.pop();
    }
    if (vids.length >= 3 && area(vids.map((v) => verts[v])) < 0) vids.reverse();
    const pts = vids.map((v) => verts[v]);
    const cell = blankCell(i, vids, vids.length >= 3 ? centroid(pts) : sites[i]);
    cells.push(cell);
  }
  city.verts = verts;
  city.cells = cells;
  const ei = new Map<string, EdgeInfo>();
  for (const cell of cells) {
    const n = cell.vids.length;
    for (let i = 0; i < n; i++) {
      const a = cell.vids[i],
        b = cell.vids[(i + 1) % n];
      if (a === b) continue;
      const k = edgeKey(a, b);
      let e = ei.get(k);
      if (!e) ei.set(k, (e = { a: Math.min(a, b), b: Math.max(a, b), cells: [] }));
      e.cells.push(cell.id);
    }
  }
  for (const cell of cells) {
    const n = cell.vids.length;
    cell.nbrs = [];
    for (let i = 0; i < n; i++) {
      const e = ei.get(edgeKey(cell.vids[i], cell.vids[(i + 1) % n]));
      cell.nbrs.push(e ? (e.cells.find((x) => x !== cell.id) ?? -1) : -1);
    }
    cell.elev = ctx.elev(cell.center[0], cell.center[1]);
    cell.kind = cell.vids.length >= 3 && ctx.sea(cell.center[0], cell.center[1]) ? 'sea' : 'outside';
  }
  ctx.ei = ei;
}

export const poly = (city: City, cell: Cell): Pt[] => cell.vids.map((v) => city.verts[v]);

/** Meandering river routed along mesh edges (so it is on the same planar graph as streets and blocks). */
export function makeRiver(ctx: Ctx): boolean {
  const { city, rng, R } = ctx;
  const res = city.resolved;
  if (!city.settlement.river) return true;
  const B = city.bounds;
  const nV = city.verts.length;
  const coast = res.geo === 'coast';
  const off = rng.range(0.08, 0.28) * R * (rng.chance(0.5) ? 1 : -1);
  let dx: number, dy: number;
  if (coast) {
    dx = Math.cos(ctx.seaAng);
    dy = Math.sin(ctx.seaAng);
  } else {
    const a = rng.range(0, Math.PI * 2);
    dx = Math.cos(a);
    dy = Math.sin(a);
  }
  const px = -dy,
    py = dx;
  const FAR = R * 2.9;
  const start: Pt = [-dx * FAR + px * off, -dy * FAR + py * off];
  const end: Pt = coast
    ? [dx * (ctx.seaOff + 0.0011 * off * off) + px * off, dy * (ctx.seaOff + 0.0011 * off * off) + py * off]
    : [dx * FAR + px * rng.range(-0.25, 0.25) * R, dy * FAR + py * rng.range(-0.25, 0.25) * R];
  const A = rng.range(R * 0.12, R * 0.27),
    f = rng.range(0.9, 1.7),
    ph = rng.range(0, 6.28);
  const guide: Pt[] = [];
  const GN = 140;
  for (let i = 0; i <= GN; i++) {
    const t = i / GN;
    const w = A * Math.sin(Math.PI * 2 * f * t + ph) * (coast ? 1 - t * 0.5 : 1);
    guide.push([lerp(start[0], end[0], t) + px * w, lerp(start[1], end[1], t) + py * w]);
  }
  const gd = (p: Pt) => {
    let best = Infinity;
    for (const g of guide) best = Math.min(best, Math.hypot(p[0] - g[0], p[1] - g[1]));
    return best;
  };
  const adj: Adj = Array.from({ length: nV }, () => []);
  for (const e of ctx.ei.values()) {
    if (e.cells.some((c) => city.cells[c].kind === 'sea')) continue;
    const a = city.verts[e.a],
      b = city.verts[e.b];
    let cost = dist(a, b) * (1 + (gd(mid(a, b)) / (R * 0.12)) ** 2);
    if (e.cells.length < 2) cost *= 8;
    adj[e.a].push([e.b, cost]);
    adj[e.b].push([e.a, cost]);
  }
  const border = (p: Pt) => p[0] <= B[0] + 1 || p[0] >= B[2] - 1 || p[1] <= B[1] + 1 || p[1] >= B[3] - 1;
  const seaVert = new Set<number>(),
    landVert = new Set<number>();
  for (const c of city.cells) for (const v of c.vids) (c.kind === 'sea' ? seaVert : landVert).add(v);
  let sv = -1,
    ev = -1,
    sd = Infinity,
    ed = Infinity;
  for (let v = 0; v < nV; v++) {
    const p = city.verts[v];
    if (adj[v].length === 0) continue;
    if (border(p) && !seaVert.has(v)) {
      const d = dist(p, start);
      if (d < sd) (sd = d), (sv = v);
      if (!coast) {
        const d2 = dist(p, end);
        if (d2 < ed) (ed = d2), (ev = v);
      }
    }
    if (coast && seaVert.has(v) && landVert.has(v)) {
      const d2 = dist(p, end);
      if (d2 < ed) (ed = d2), (ev = v);
    }
  }
  if (sv < 0 || ev < 0) return false;
  const { dist: dd, prev } = dijkstra(nV, adj, [sv]);
  if (!isFinite(dd[ev])) return false;
  const vids = tracePath(prev, ev).reverse();
  if (vids.length < 6) return false;
  const base = city.settlement.riverWidth;
  const n = vids.length;
  const ws = vids.map((_, k) => base * (coast ? 0.7 + 0.9 * (k / (n - 1)) ** 2 : 0.8 + 0.4 * (k / (n - 1))));
  const raw = vids.map((v) => city.verts[v]);
  const sm = chaikin(raw, 2, 0.22);
  const sw = chaikin(ws.map((w) => [w, 0] as Pt), 2, 0.22).map((p) => p[0]);
  const ew: Record<string, number> = {};
  for (let k = 0; k < n - 1; k++) ew[edgeKey(vids[k], vids[k + 1])] = (ws[k] + ws[k + 1]) / 2;
  city.river = { vids, pts: sm, w: sw, ew };
  ctx.riverVids = new Set(vids);
  return true;
}

/** City extent: nearest N land cells (wobbly radius), connected, no holes, river never forms the outline. */
export function selectCity(ctx: Ctx) {
  const { city, rng, N } = ctx;
  const cells = city.cells;
  const nz = new Noise(rng.int(1, 1e6));
  const land = cells.filter((c) => c.kind !== 'sea' && c.vids.length >= 3);
  const key = (c: Cell) => {
    const a = Math.atan2(c.center[1], c.center[0]);
    const w = 0.84 + 0.32 * nz.fbm(Math.cos(a) * 1.3 + 5, Math.sin(a) * 1.3 + 5, 2);
    return Math.hypot(c.center[0], c.center[1]) / w;
  };
  land.sort((a, b) => key(a) - key(b));
  for (const c of land.slice(0, N)) c.kind = 'city';
  const isCity = (id: number) => id >= 0 && cells[id].kind === 'city';
  // connectivity from the central cell
  const root = land[0];
  const seen = new Set<number>([root.id]);
  const q = [root.id];
  while (q.length) {
    const u = q.pop()!;
    for (const n of cells[u].nbrs) if (isCity(n) && !seen.has(n)) (seen.add(n), q.push(n));
  }
  for (const c of cells) if (c.kind === 'city' && !seen.has(c.id)) c.kind = 'outside';
  const addable = (c: Cell) => c.kind === 'outside' && c.vids.length >= 3;
  for (let pass = 0; pass < 3; pass++) {
    // fill notches and holes
    for (const c of cells) {
      if (!addable(c)) continue;
      const ns = c.nbrs.filter((n) => n >= 0);
      const cn = ns.filter((n) => isCity(n)).length;
      if (ns.length && cn / ns.length >= 0.6 && cn >= 2) c.kind = 'city';
    }
  }
  // tiny pockets cut off by the river (fewer than 4 blocks) are returned to the countryside
  {
    const comp = new Map<number, number>();
    const sizes: number[] = [];
    for (const c of cells) {
      if (c.kind !== 'city' || comp.has(c.id)) continue;
      const id = sizes.length;
      let n = 0;
      const st = [c.id];
      comp.set(c.id, id);
      while (st.length) {
        const u = st.pop()!;
        n++;
        const cu = cells[u];
        for (let i = 0; i < cu.nbrs.length; i++) {
          const nb = cu.nbrs[i];
          if (nb < 0 || cells[nb].kind !== 'city' || comp.has(nb)) continue;
          if (city.river && edgeKey(cu.vids[i], cu.vids[(i + 1) % cu.vids.length]) in city.river.ew) continue;
          comp.set(nb, id);
          st.push(nb);
        }
      }
      sizes.push(n);
    }
    // keep the main body; drop only tiny pockets (never the whole settlement)
    let biggest = 0;
    for (const sz of sizes) biggest = Math.max(biggest, sz);
    const minKeep = Math.max(2, Math.round(city.settlement.blocks * 0.08));
    for (const c of cells)
      if (c.kind === 'city') {
        const sz = sizes[comp.get(c.id)!];
        if (sz < minKeep && sz < biggest) c.kind = 'outside';
      }
  }
  // depth from the boundary (0 = touches non-city)
  const depth = new Map<number, number>();
  let frontier: number[] = [];
  for (const c of cells)
    if (c.kind === 'city' && c.nbrs.some((n) => !isCity(n))) {
      depth.set(c.id, 0);
      frontier.push(c.id);
    }
  while (frontier.length) {
    const nx: number[] = [];
    for (const u of frontier)
      for (const n of cells[u].nbrs)
        if (isCity(n) && !depth.has(n)) {
          depth.set(n, depth.get(u)! + 1);
          nx.push(n);
        }
    frontier = nx;
  }
  for (const c of cells) if (c.kind === 'city') c.depth = depth.get(c.id) ?? 0;
}

export function classifyEdges(ctx: Ctx) {
  const { city } = ctx;
  const walls = city.settlement.wall !== 'none';
  const edges: Record<string, EdgeCls> = {};
  for (const [k, e] of ctx.ei) {
    const ks = e.cells.map((c) => city.cells[c].kind);
    const nCity = ks.filter((x) => x === 'city').length;
    const isRiver = !!city.river && k in city.river.ew;
    if (nCity === 0) {
      if (isRiver) edges[k] = 'river';
      continue;
    }
    if (nCity === 2) edges[k] = isRiver ? 'river' : 'minor';
    else if (ks.includes('sea')) edges[k] = 'coast';
    else if (isRiver) edges[k] = 'river';
    else edges[k] = walls ? 'wallO' : 'open';
  }
  city.edges = edges;
}

/** Boundary loops (CCW) of a cell set, as vertex id lists. */
export function outlineLoops(city: City, inSet: (id: number) => boolean): number[][] {
  const next = new Map<number, number[]>();
  for (const c of city.cells) {
    if (!inSet(c.id)) continue;
    const n = c.vids.length;
    for (let i = 0; i < n; i++) {
      if (!inSet(c.nbrs[i])) {
        const a = c.vids[i],
          b = c.vids[(i + 1) % n];
        if (!next.has(a)) next.set(a, []);
        next.get(a)!.push(b);
      }
    }
  }
  const loops: number[][] = [];
  for (const [s] of next) {
    while (next.get(s)?.length) {
      const loop = [s];
      let u = s;
      let guard = 0;
      for (;;) {
        const l = next.get(u);
        if (!l || !l.length || guard++ > 5000) break;
        const v = l.shift()!;
        if (v === s) break;
        loop.push(v);
        u = v;
      }
      if (loop.length >= 3) loops.push(loop);
    }
  }
  return loops.filter((l) => area(cleanPoly(l.map((v) => city.verts[v]))) > 0);
}
