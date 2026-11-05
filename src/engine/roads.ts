// Stage 3-4: market, inner wall, gates, bridges, arterial/secondary routing, outer roads, plazas.
import { RNG, hash01 } from './rng';
import { Pt, dist, mid, unit, sub, area, centroid, chaikin, rayHit, clamp } from './geom';
import { dijkstra, tracePath, Adj } from './graph';
import { City, Cell, Bridge, Road, edgeKey, Street } from './types';
import { Ctx, EdgeInfo, outlineLoops } from './plan';
import { placeWord } from './params';

export const STREET_CLS = new Set(['minor', 'secondary', 'arterial']);
const RANK: Record<string, number> = { minor: 0, secondary: 1, arterial: 2 };

export function vertexEdges(ei: Map<string, EdgeInfo>) {
  const m = new Map<number, string[]>();
  for (const [k, e] of ei)
    for (const v of [e.a, e.b]) {
      let l = m.get(v);
      if (!l) m.set(v, (l = []));
      l.push(k);
    }
  return m;
}

export function buildEi(city: City) {
  const ei = new Map<string, EdgeInfo>();
  for (const cell of city.cells) {
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
  return ei;
}

export function chooseMarket(ctx: Ctx) {
  const { city, rng } = ctx;
  if (!city.settlement.market) return;
  const cc = city.cells.filter((c) => c.kind === 'city');
  let tx = 0,
    ty = 0;
  for (const c of cc) (tx += c.center[0]), (ty += c.center[1]);
  tx /= cc.length;
  ty /= cc.length;
  let best: Cell | null = null,
    bs = Infinity;
  for (const c of cc) {
    const pts = c.vids.map((v) => city.verts[v]);
    const a = area(pts);
    let s = Math.hypot(c.center[0] - tx, c.center[1] - ty);
    if (a < 2600) s += 300;
    if (c.vids.length < 5) s += 80;
    if (c.nbrs.some((n) => n >= 0 && city.cells[n].kind === 'sea')) s += 200;
    if (s < bs) (bs = s), (best = c);
  }
  best!.layout = 'market';
  best!.ward = 'market';
  city.marketCell = best!.id;
  // a megacity has a second, lesser market away from the great square
  if (city.settlement.marketCells > 1) {
    const cc = city.cells.filter((c) => c.kind === 'city' && c.layout === 'blocks');
    let second: Cell | null = null,
      ss = -Infinity;
    for (const c of cc) {
      const d = dist(c.center, best!.center);
      const s = d + rng.range(0, 200) - (d < 160 ? 400 : 0);
      if (s > ss) (ss = s), (second = c);
    }
    if (second) {
      second.layout = 'market';
      second.ward = 'market';
      second.variant = 1;
      (city as any).secondMarketCell = second.id;
    }
  }
}

export function buildInnerWall(ctx: Ctx) {
  const { city } = ctx;
  if (city.settlement.wall !== 'double') return;
  const cells = city.cells;
  const market = cells[city.marketCell];
  const nCity = cells.filter((c) => c.kind === 'city').length;
  const target = Math.max(7, Math.round(nCity * 0.34));
  const inner = new Set<number>([market.id]);
  while (inner.size < target) {
    let best = -1,
      bd = Infinity;
    for (const id of inner)
      for (const n of cells[id].nbrs) {
        if (n < 0 || inner.has(n) || cells[n].kind !== 'city') continue;
        const c = cells[n];
        const d = dist(c.center, market.center) + (c.depth === 0 ? 500 : 0);
        if (d < bd) (bd = d), (best = n);
      }
    if (best < 0) break;
    inner.add(best);
  }
  for (let pass = 0; pass < 3; pass++) {
    for (const c of cells) {
      if (c.kind !== 'city' || inner.has(c.id)) continue;
      const ns = c.nbrs.filter((n) => n >= 0);
      const k = ns.filter((n) => inner.has(n)).length;
      if (k >= 2 && k / ns.length >= 0.6) inner.add(c.id);
    }
  }
  for (const id of inner) cells[id].inner = true;
  for (const [k, e] of ctx.ei) {
    if (e.cells.length !== 2 || city.edges[k] !== 'minor') continue;
    const [a, b] = e.cells;
    if (cells[a].inner !== cells[b].inner) city.edges[k] = 'wallI';
  }
}

const angDiff = (a: number, b: number) => Math.abs(((a - b + 3 * Math.PI) % (2 * Math.PI)) - Math.PI);

/** Country road leaving a gate: straight leg across the outside cell, then along outside mesh edges to the map border. */
export function makeOuterRoad(city: City, ei: Map<string, EdgeInfo>, rng: RNG, g: number, dir: Pt): Road | null {
  const P = city.verts[g];
  const cityV = new Set<number>();
  for (const c of city.cells) if (c.kind === 'city') for (const v of c.vids) cityV.add(v);
  const X = city.cells.find((c) => c.kind === 'outside' && c.vids.includes(g));
  if (!X) return null;
  let w = -1,
    bs = -Infinity;
  for (const v of X.vids) {
    if (cityV.has(v)) continue;
    const q = city.verts[v];
    const dd = (q[0] - P[0]) * dir[0] + (q[1] - P[1]) * dir[1];
    if (dd > bs) (bs = dd), (w = v);
  }
  if (w < 0 || bs < 12) return null;
  const nV = city.verts.length;
  const adj: Adj = Array.from({ length: nV }, () => []);
  for (const [k, e] of ei) {
    if (e.cells.some((c) => city.cells[c].kind !== 'outside')) continue;
    if (city.river && k in city.river.ew) continue;
    const c = dist(city.verts[e.a], city.verts[e.b]) * rng.range(0.85, 1.25);
    adj[e.a].push([e.b, c]);
    adj[e.b].push([e.a, c]);
  }
  const { dist: dd, prev } = dijkstra(nV, adj, [w]);
  const B = city.bounds;
  const far: Pt = [P[0] + dir[0] * 3000, P[1] + dir[1] * 3000];
  let tv = -1,
    ts = Infinity;
  for (let v = 0; v < nV; v++) {
    if (!isFinite(dd[v])) continue;
    const p = city.verts[v];
    if (!(p[0] <= B[0] + 1 || p[0] >= B[2] - 1 || p[1] <= B[1] + 1 || p[1] >= B[3] - 1)) continue;
    const s = dist(p, far) + 0.25 * dd[v];
    if (s < ts) (ts = s), (tv = v);
  }
  if (tv < 0) return null;
  const path = tracePath(prev, tv).reverse();
  const pts: Pt[] = [P, ...path.map((v) => city.verts[v])];
  return { pts: chaikin(pts, 2, 0.25), w: 5.5, gate: g };
}

export function planGates(ctx: Ctx) {
  const { city, rng } = ctx;
  if (city.settlement.wall === 'none') return;
  const loops = outlineLoops(city, (id) => id >= 0 && city.cells[id].kind === 'city');
  if (!loops.length) return;
  loops.sort((a, b) => area(b.map((v) => city.verts[v])) - area(a.map((v) => city.verts[v])));
  const loop = loops[0];
  const vE = vertexEdges(ctx.ei);
  const cc = city.cells.filter((c) => c.kind === 'city');
  const cen: Pt = [cc.reduce((s, c) => s + c.center[0], 0) / cc.length, cc.reduce((s, c) => s + c.center[1], 0) / cc.length];
  const n = loop.length;
  interface Cand { v: number; ang: number; dir: Pt; tan: Pt }
  const pool: Cand[] = [];
  for (let i = 0; i < n; i++) {
    const v = loop[i],
      pv = loop[(i - 1 + n) % n],
      nv = loop[(i + 1) % n];
    const c1 = city.edges[edgeKey(pv, v)],
      c2 = city.edges[edgeKey(v, nv)];
    if (!(c1 === 'wallO' || c1 === 'open') || !(c2 === 'wallO' || c2 === 'open')) continue;
    if (ctx.riverVids.has(v)) continue;
    if (!(vE.get(v) ?? []).some((k) => city.edges[k] === 'minor')) continue;
    const tan = unit(sub(city.verts[nv], city.verts[pv]));
    pool.push({ v, tan, dir: [tan[1], -tan[0]], ang: Math.atan2(city.verts[v][1] - cen[1], city.verts[v][0] - cen[0]) });
  }
  const chosen: Cand[] = [];
  const want = Math.min(city.settlement.gates, pool.length);
  while (chosen.length < want && pool.length) {
    let best = -1,
      bs = -1;
    for (let i = 0; i < pool.length; i++) {
      const sep = chosen.length ? Math.min(...chosen.map((c) => angDiff(c.ang, pool[i].ang))) : Math.PI;
      const s = sep + rng.range(0, 0.4);
      if (s > bs) (bs = s), (best = i);
    }
    const c = pool.splice(best, 1)[0];
    if (chosen.length && Math.min(...chosen.map((x) => angDiff(x.ang, c.ang))) < 0.5) continue;
    const road = makeOuterRoad(city, ctx.ei, rng, c.v, c.dir);
    if (!road) continue;
    chosen.push(c);
    city.roads.push(road);
    city.gates.push({ vid: c.v, p: city.verts[c.v], kind: 'main', wall: 'outer', tan: c.tan, dir: c.dir });
  }
  // posterns: small pedestrian gates on long wall stretches far from the main gates, served by a footpath
  const nPost = city.settlement.gates >= 4 ? 2 : 1;
  let made = 0;
  const cand = pool.filter((c) => chosen.every((x) => angDiff(x.ang, c.ang) > 0.75)).sort(() => rng.next() - 0.5);
  for (const c of cand) {
    if (made >= nPost) break;
    if (city.gates.some((g) => g.kind === 'postern' && angDiff(Math.atan2(g.p[1] - cen[1], g.p[0] - cen[0]), c.ang) < 0.9)) continue;
    const road = makeOuterRoad(city, ctx.ei, rng, c.v, c.dir);
    if (!road) continue;
    road.w = 2.6;
    city.roads.push(road);
    city.gates.push({ vid: c.v, p: city.verts[c.v], kind: 'postern', wall: 'outer', tan: c.tan, dir: c.dir });
    made++;
  }
}

export interface BridgePlan {
  b: Bridge;
  hits: [{ p: Pt; e: [number, number] }, { p: Pt; e: [number, number] }];
}

export function inwardNormal(city: City, cell: Cell, a: number, b: number): Pt | null {
  const n = cell.vids.length;
  for (let i = 0; i < n; i++) {
    const u = cell.vids[i],
      w = cell.vids[(i + 1) % n];
    if ((u === a && w === b) || (u === b && w === a)) {
      const P = city.verts[u],
        Q = city.verts[w];
      return unit([-(Q[1] - P[1]), Q[0] - P[0]]);
    }
  }
  return null;
}

export function planBridges(ctx: Ctx): BridgePlan[] {
  const { city, rng } = ctx;
  if (!city.river || !city.settlement.river) return [];
  const cells = city.cells;
  const market = cells[city.marketCell];
  const street = (c: string | undefined) => c === 'minor' || c === 'secondary' || c === 'arterial';
  // connected components of the city when the river is impassable
  const comp = new Map<number, number>();
  let nc = 0;
  for (const c of cells) {
    if (c.kind !== 'city' || comp.has(c.id)) continue;
    const st = [c.id];
    comp.set(c.id, nc);
    while (st.length) {
      const u = st.pop()!;
      const cu = cells[u];
      for (let i = 0; i < cu.nbrs.length; i++) {
        const n = cu.nbrs[i];
        if (n < 0 || cells[n].kind !== 'city' || comp.has(n)) continue;
        if (city.edges[edgeKey(cu.vids[i], cu.vids[(i + 1) % cu.vids.length])] === 'river') continue;
        comp.set(n, nc);
        st.push(n);
      }
    }
    nc++;
  }
  const parent = Array.from({ length: nc }, (_, i) => i);
  const find = (x: number): number => (parent[x] === x ? x : (parent[x] = find(parent[x])));
  let inLen = 0;
  const gather = (minL: number, minT: number, sLo: number, minHitL: number) => {
    const cands: BridgePlan[] = [];
    inLen = 0;
    for (const [k, rw] of Object.entries(city.river!.ew)) {
      const e = ctx.ei.get(k);
      if (!e || e.cells.length < 2) continue;
      const ca = cells[e.cells[0]],
        cb = cells[e.cells[1]];
      if (ca.kind !== 'city' || cb.kind !== 'city') continue;
      const A = city.verts[e.a],
        B = city.verts[e.b];
      const L = dist(A, B);
      inLen += L;
      if (L < minL || ca.layout !== 'blocks' || cb.layout !== 'blocks') continue;
      const m = mid(A, B);
      const dA = inwardNormal(city, ca, e.a, e.b);
      if (!dA) continue;
      const dB: Pt = [-dA[0], -dA[1]];
      const hits: { p: Pt; e: [number, number] }[] = [];
      let ok = true;
      for (const [cell, d] of [[ca, dA], [cb, dB]] as [Cell, Pt][]) {
        const pl = cell.vids.map((v) => city.verts[v]);
        const h = rayHit(pl, m, d);
        if (!h || h.t < minT || h.s < sLo || h.s > 1 - sLo) { ok = false; break; }
        const u = cell.vids[h.i],
          w = cell.vids[(h.i + 1) % cell.vids.length];
        if (!street(city.edges[edgeKey(u, w)]) || dist(city.verts[u], city.verts[w]) < minHitL) { ok = false; break; }
        hits.push({ p: h.p, e: [u, w] });
      }
      if (!ok) continue;
      cands.push({
        b: { id: 0, m, dir: dA, cells: [ca.id, cb.id], w: 5, len: rw + 11, main: false, tower: false, edge: [e.a, e.b] },
        hits: hits as BridgePlan['hits'],
      });
    }
    cands.sort((a, b) => dist(a.b.m, market.center) - dist(b.b.m, market.center));
    return cands;
  };
  const chosen: BridgePlan[] = [];
  const used = new Set<number>();
  const take = (c: BridgePlan) => {
    chosen.push(c);
    c.b.cells.forEach((x) => used.add(x));
  };
  const spanning = (cands: BridgePlan[]) => {
    for (const c of cands) {
      if (c.b.cells.some((x) => used.has(x))) continue;
      const a = find(comp.get(c.b.cells[0])!),
        b = find(comp.get(c.b.cells[1])!);
      if (a === b) continue;
      parent[a] = b;
      take(c);
    }
  };
  const strict = gather(22, 22, 0.22, 14);
  const nb = clamp(Math.round(inLen / 230), 1, 4);
  spanning(strict);
  const roots = () => new Set([...comp.values()].map(find)).size;
  if (roots() > 1) spanning(gather(12, 11, 0.14, 9));
  // extra bridges for a lively river crossing pattern
  const extra = strict.map((c) => ({ c, k: rng.range(0, 90) })).sort((a, b) => a.k - b.k).map((x) => x.c);
  for (const c of extra) {
    if (chosen.length >= nb) break;
    if (chosen.includes(c) || c.b.cells.some((x) => used.has(x))) continue;
    if (chosen.some((o) => dist(o.b.m, c.b.m) < 120)) continue;
    take(c);
  }
  chosen.forEach((c, i) => (c.b.id = i + 1));
  for (const pl of chosen) {
    city.bridges.push(pl.b);
    const [a, b] = pl.b.cells;
    cells[a].cuts.push({ p: pl.b.m, d: pl.b.dir, w: 5, a: pl.b.m, b: pl.hits[0].p, kind: 'bridge' });
    cells[b].cuts.push({ p: pl.b.m, d: [-pl.b.dir[0], -pl.b.dir[1]], w: 5, a: pl.b.m, b: pl.hits[1].p, kind: 'bridge' });
    cells[a].locked = cells[b].locked = true;
  }
  return chosen;
}

const STREET_WORDS = ['Street', 'Road', 'Way', 'Row', 'Lane'];

export function routeStreets(ctx: Ctx, plans: BridgePlan[], hubs: number[]) {
  const { city, rng } = ctx;
  const V = city.verts.length;
  // the hub for street routing: the market square, or the civic centre when there is none
  const market: Cell =
    city.marketCell >= 0
      ? city.cells[city.marketCell]
      : city.cells.filter((c) => c.kind === 'city').sort((a, b) => b.vids.length - a.vids.length)[0];
  const host = new Map<number, [number, number]>();
  const mkAdj = (costFn: (a: number, b: number, k: string, c: string) => number, withBridges: boolean): Adj => {
    const adj: Adj = Array.from({ length: V + plans.length * 2 }, () => []);
    for (const [k, e] of ctx.ei) {
      const cls = city.edges[k];
      const ring = withBridges && cls === 'wallO' && !ctx.riverVids.has(e.a) && !ctx.riverVids.has(e.b);
      if (cls !== 'minor' && !(withBridges && cls === 'wallI') && !ring) continue;
      const c = costFn(e.a, e.b, k, cls);
      adj[e.a].push([e.b, c]);
      adj[e.b].push([e.a, c]);
    }
    return adj;
  };
  const base = mkAdj((a, b, _k, c) => dist(city.verts[a], city.verts[b]) * (c === 'wallI' ? 0 : 1), true);
  // fixed random factors so arterials are stable
  const rf = new Map<string, number>();
  for (const k of ctx.ei.keys()) rf.set(k, rng.range(0.8, 1.3));
  const adj = mkAdj((a, b, k, c) => {
    const l = dist(city.verts[a], city.verts[b]);
    return c === 'wallI' ? l * 2.4 + 16 : c === 'wallO' ? l * 3.2 + 26 : l * rf.get(k)!;
  }, true);
  void base;
  const nodePts: Pt[] = [...city.verts];
  plans.forEach((pl, i) => {
    for (let s = 0; s < 2; s++) {
      const node = V + i * 2 + s;
      const h = pl.hits[s];
      nodePts[node] = h.p;
      host.set(node, h.e);
      for (const v of h.e) {
        const c = dist(h.p, city.verts[v]);
        adj[node].push([v, c]);
        adj[v].push([node, c]);
      }
    }
    const c = (dist(pl.hits[0].p, pl.b.m) + dist(pl.b.m, pl.hits[1].p)) * 0.55;
    adj[V + i * 2].push([V + i * 2 + 1, c]);
    adj[V + i * 2 + 1].push([V + i * 2, c]);
  });
  const { dist: dd, prev } = dijkstra(adj.length, adj, market.vids);
  const innerKeys = new Set<string>();
  const addInnerGate = (k: string) => {
    if (innerKeys.has(k)) return;
    innerKeys.add(k);
    const e = ctx.ei.get(k)!;
    const A = city.verts[e.a],
      B = city.verts[e.b];
    const tan = unit(sub(B, A));
    const p = mid(A, B);
    const ic = city.cells[e.cells.find((c) => city.cells[c].inner) ?? e.cells[0]];
    let nrm: Pt = [-tan[1], tan[0]];
    if ((ic.center[0] - p[0]) * nrm[0] + (ic.center[1] - p[1]) * nrm[1] > 0) nrm = [-nrm[0], -nrm[1]];
    city.gates.push({ vid: -1, p, kind: 'inner', wall: 'inner', tan, dir: nrm, edge: k });
  };
  const mark = (path: number[], cls: 'arterial' | 'secondary') => {
    for (let i = 0; i < path.length - 1; i++) {
      const x = path[i],
        y = path[i + 1];
      const xh = x >= V,
        yh = y >= V;
      let k: string | null = null;
      if (!xh && !yh) k = edgeKey(x, y);
      else if (xh && yh) {
        if (cls === 'arterial') plans[Math.floor((x - V) / 2)].b.main = true;
      } else {
        const [u, w] = host.get(xh ? x : y)!;
        k = edgeKey(u, w);
      }
      if (!k) continue;
      const c = city.edges[k];
      if (c === 'wallI') addInnerGate(k);
      else if (c && RANK[c] !== undefined && RANK[c] < RANK[cls]) city.edges[k] = cls;
    }
  };
  const streets: Street[] = [];
  const names = new Set<string>();
  const nameFor = (i: number) => {
    let nm = i === 0 ? 'High Street' : i === 1 ? 'Market Street' : placeWord(rng) + ' ' + rng.pick(STREET_WORDS);
    while (names.has(nm)) nm = placeWord(rng) + ' ' + rng.pick(STREET_WORDS);
    names.add(nm);
    return nm;
  };
  const addStreet = (path: number[], kind: 'arterial' | 'secondary') => {
    mark(path, kind);
    const vids = path.filter((x) => x < V);
    if (vids.length >= 3) streets.push({ name: nameFor(streets.length), vids, kind });
  };
  const gates = city.gates.filter((g) => g.wall === 'outer');
  gates.forEach((g) => {
    if (isFinite(dd[g.vid])) addStreet(tracePath(prev, g.vid), 'arterial');
  });
  for (const h of hubs) {
    const c = city.cells[h];
    let bv = -1,
      bd = Infinity;
    for (const v of c.vids) if (dd[v] < bd && dd[v] > 0) (bd = dd[v]), (bv = v);
    if (bv >= 0) addStreet(tracePath(prev, bv), 'secondary');
  }
  const R = ctx.R;
  const interior: number[] = [];
  const vE = vertexEdges(ctx.ei);
  for (let v = 0; v < V; v++) {
    const es = vE.get(v) ?? [];
    if (es.length >= 3 && es.every((k) => city.edges[k] === 'minor' || city.edges[k] === 'secondary' || city.edges[k] === 'arterial')) interior.push(v);
  }
  const nRad = Math.round(1 + city.params.roadComplexity * 4);
  for (let i = 0; i < nRad; i++) {
    const far = interior.filter((v) => Math.hypot(city.verts[v][0] - market.center[0], city.verts[v][1] - market.center[1]) > 0.4 * R && isFinite(dd[v]));
    if (!far.length) break;
    addStreet(tracePath(prev, rng.pick(far)), 'secondary');
  }
  const nRing = Math.round(city.params.roadComplexity * 2.4);
  for (let i = 0; i < nRing; i++) {
    const rho = R * rng.range(0.32, 0.52),
      th = rng.range(0, Math.PI * 2);
    const near = (a: number) => {
      const q: Pt = [market.center[0] + Math.cos(a) * rho, market.center[1] + Math.sin(a) * rho];
      let b = -1,
        bd = Infinity;
      for (const v of interior) {
        const d = dist(city.verts[v], q);
        if (d < bd) (bd = d), (b = v);
      }
      return b;
    };
    const s = near(th),
      t = near(th + rng.range(1.5, 2.6));
    if (s < 0 || t < 0 || s === t) continue;
    const ring = mkAdj((a, b) => {
      const A = city.verts[a],
        B = city.verts[b];
      const r = Math.hypot((A[0] + B[0]) / 2 - market.center[0], (A[1] + B[1]) / 2 - market.center[1]);
      return dist(A, B) * (1 + (2.8 * Math.abs(r - rho)) / rho);
    }, false);
    const res = dijkstra(V, ring, [s]);
    if (isFinite(res.dist[t])) addStreet(tracePath(res.prev, t).reverse(), 'secondary');
  }
  for (const pl of plans) {
    pl.b.w = pl.b.main ? 8 : 5.2;
    for (const ci of pl.b.cells) for (const cut of city.cells[ci].cuts) if (cut.kind === 'bridge' && Math.abs(cut.p[0] - pl.b.m[0]) < 1e-6) cut.w = pl.b.w;
    pl.b.tower = pl.b.main && (city.params.identity === 'ancient' || city.params.identity === 'hilltop' || city.params.identity === 'royal');
  }
  city.streets = streets;
}

const WARD_W: Record<string, number> = { poor: 0.78, residential: 0.95, noble: 1.12, merchant: 1.05, market: 1.1, industrial: 1.1, artisan: 0.97, harbour: 1.08, military: 1.05 };

export function assignWidths(ctx: Ctx) {
  const { city } = ctx;
  for (const [k, e] of ctx.ei) {
    const cls = city.edges[k];
    if (!cls || !STREET_CLS.has(cls)) continue;
    const t = city.settlement.tierIndex;
    const wk = t === 0 ? 0.5 : t === 1 ? 0.66 : t === 2 ? 0.85 : 1;
    const base = (cls === 'arterial' ? 9.6 : cls === 'secondary' ? 6.6 : 4.4) * wk;
    const jit = 0.88 + 0.26 * hash01(k + city.seedUsed);
    const f = e.cells.reduce((s, c) => s + (WARD_W[city.cells[c].ward ?? ''] ?? 1), 0) / e.cells.length;
    city.ew[k] = base * jit * f;
  }
}

export function planPlazas(ctx: Ctx) {
  const { city, rng } = ctx;
  const vE = vertexEdges(ctx.ei);
  const out: { vid: number; r: number }[] = [];
  const cand: number[] = [];
  for (const [v, es] of vE) {
    if (es.length < 3) continue;
    if (!es.every((k) => STREET_CLS.has(city.edges[k] ?? ''))) continue;
    const big = es.filter((k) => city.edges[k] === 'arterial' || city.edges[k] === 'secondary').length;
    if (big < 2) continue;
    const pts = es.map((k) => {
      const e = ctx.ei.get(k)!;
      return dist(city.verts[e.a], city.verts[e.b]);
    });
    if (Math.min(...pts) < 26) continue;
    if (city.cells.some((c) => c.vids.includes(v) && (c.layout !== 'blocks' || c.locked))) continue;
    cand.push(v);
  }
  for (let i = cand.length - 1; i > 0; i--) {
    const j = rng.int(0, i + 1);
    [cand[i], cand[j]] = [cand[j], cand[i]];
  }
  const maxN = 3 + Math.round(city.params.roadComplexity * 4);
  for (const v of cand) {
    if (out.length >= maxN) break;
    if (out.some((o) => dist(city.verts[o.vid], city.verts[v]) < 110)) continue;
    out.push({ vid: v, r: rng.range(6.5, 9.5) });
  }
  city.plazas = out;
  for (const p of out) {
    const kind = rng.weighted([['well', 5], ['statue', 2.5], ['fountain', 2.5]] as const);
    city.features.push({ id: city.nextId++, type: kind, p: city.verts[p.vid] });
  }
}

export { centroid };
