// Stage 10-11: walls, gates, towers, moat, harbour, sea, countryside decoration, landmarks.
import { Pt, dist, mid, unit, sub, add, mul, area, centroid, flat, insetConvex, splitConvex, clipLineConvex, bbox, pointInConvex, nearestOn, polylineNearest, clamp } from './geom';
import { WallRun, Tower, Cell, Building, City, Roof, edgeKey } from './types';
import { Ctx, poly, outlineLoops } from './plan';
import { identityOf } from './params';
import { vertexEdges, inwardNormal } from './roads';

export const WALL_T = { outer: 4.4, inner: 3.4, sea: 2.6 };

function runsFromLoop(loop: number[], pred: (k: string) => boolean, edges: Record<string, string>): { vids: number[]; closed: boolean }[] {
  const n = loop.length;
  const ok: boolean[] = [];
  for (let i = 0; i < n; i++) ok.push(pred(edges[edgeKey(loop[i], loop[(i + 1) % n])] ?? ''));
  if (ok.every(Boolean)) return [{ vids: loop.slice(), closed: true }];
  const runs: { vids: number[]; closed: boolean }[] = [];
  for (let s = 0; s < n; s++) {
    if (ok[s] && !ok[(s - 1 + n) % n]) {
      const vids = [loop[s]];
      let i = s;
      while (ok[i % n]) {
        vids.push(loop[(i + 1) % n]);
        i++;
        if (i - s > n) break;
      }
      runs.push({ vids, closed: false });
    }
  }
  return runs;
}

export function buildWalls(ctx: Ctx) {
  const { city } = ctx;
  const res = city.resolved;
  const walls: WallRun[] = [];
  const towers: Tower[] = [];
  const vE = vertexEdges(ctx.ei);
  city.walls = walls;
  city.towers = towers;
  if (city.settlement.wall === 'none') return;
  const edges = city.edges as Record<string, string>;
  const loops = outlineLoops(city, (id) => id >= 0 && city.cells[id].kind === 'city');
  loops.sort((a, b) => area(b.map((v) => city.verts[v])) - area(a.map((v) => city.verts[v])));
  const outer = loops[0] ?? [];
  const mk = (kind: 'outer' | 'inner' | 'sea', loop: number[], pred: (c: string) => boolean) => {
    for (const r of runsFromLoop(loop, pred, edges)) walls.push({ kind, vids: r.vids, closed: r.closed, t: WALL_T[kind] });
  };
  mk('outer', outer, (c) => c === 'wallO');
  mk('sea', outer, (c) => c === 'coast');
  // harbour segments are not walled
  for (let i = walls.length - 1; i >= 0; i--) {
    const w = walls[i];
    if (w.kind !== 'sea') continue;
    // split sea runs at harbour edges
    walls.splice(i, 1);
    let cur: number[] = [];
    for (let j = 0; j < w.vids.length - 1; j++) {
      const k = edgeKey(w.vids[j], w.vids[j + 1]);
      if (ctx.harbourEdges.has(k)) {
        if (cur.length > 1) walls.push({ kind: 'sea', vids: cur, closed: false, t: WALL_T.sea });
        cur = [];
      } else {
        if (!cur.length) cur.push(w.vids[j]);
        cur.push(w.vids[j + 1]);
      }
    }
    if (cur.length > 1) walls.push({ kind: 'sea', vids: cur, closed: false, t: WALL_T.sea });
  }
  if (city.settlement.wall === 'double') {
    for (const l of outlineLoops(city, (id) => id >= 0 && city.cells[id].inner)) mk('inner', l, (c) => c === 'wallI');
  }
  // towers
  const gatePts = () => city.gates.map((g) => g.p);
  const near = (p: Pt, r: number) => towers.some((t) => dist(t.p, p) < r) || gatePts().some((q) => dist(q, p) < r + 3);
  const addTower = (p: Pt, r: number, kind: Tower['kind'], wall: Tower['wall'], dir: Pt) => towers.push({ p, r, kind, wall, dir });
  // gates: flank towers
  for (const g of city.gates) {
    if (g.kind === 'inner') {
      const d = 8;
      for (const s of [-1, 1]) addTower(add(g.p, mul(g.tan, s * d)), 4.4, 'round', 'inner', g.dir);
    } else if (g.kind === 'postern') {
      // a single small square tower guards a postern
      const es = (vE.get(g.vid) ?? []).filter((k) => edges[k] === 'wallO');
      if (es.length) {
        const e = ctx.ei.get(es[0])!;
        const o = city.verts[e.a === g.vid ? e.b : e.a];
        addTower(add(g.p, mul(unit(sub(o, g.p)), Math.min(7, dist(o, g.p) * 0.35))), 3.6, 'square', 'outer', g.dir);
      }
    } else if (g.vid >= 0) {
      const es = (vE.get(g.vid) ?? []).filter((k) => edges[k] === 'wallO');
      for (const k of es) {
        const e = ctx.ei.get(k)!;
        const o = city.verts[e.a === g.vid ? e.b : e.a];
        const L = dist(o, g.p);
        addTower(add(g.p, mul(unit(sub(o, g.p)), Math.min(8.5, L * 0.4))), 5.2, 'round', 'outer', g.dir);
      }
    }
  }
  // water gates where the river crosses a wall
  if (city.river) {
    for (const w of walls) {
      if (w.kind === 'sea') continue;
      for (let i = 0; i < w.vids.length; i++) {
        const v = w.vids[i];
        if (!ctx.riverVids.has(v)) continue;
        if (!w.closed && (i === 0 || i === w.vids.length - 1)) continue;
        const n = w.vids.length;
        const pv = w.vids[(i - 1 + n) % n],
          nv = w.vids[(i + 1) % n];
        const P = city.verts[v];
        const tan = unit(sub(city.verts[nv], city.verts[pv]));
        const rw = city.river.w[Math.round((city.river.vids.indexOf(v) / city.river.vids.length) * (city.river.w.length - 1))] ?? 16;
        city.gates.push({ vid: v, p: P, kind: 'water', wall: w.kind === 'inner' ? 'inner' : 'outer', tan, dir: [tan[1], -tan[0]] });
        for (const o of [pv, nv]) {
          const Q = city.verts[o];
          addTower(add(P, mul(unit(sub(Q, P)), Math.min(rw / 2 + 7.5, dist(P, Q) * 0.45))), 4.6, 'round', w.kind === 'inner' ? 'inner' : 'outer', [tan[1], -tan[0]]);
        }
      }
    }
  }
  // corner & intermediate towers
  for (const w of walls) {
    const n = w.vids.length;
    const pts = w.vids.map((v) => city.verts[v]);
    const R = w.kind === 'outer' ? 5.6 : w.kind === 'inner' ? 4.6 : 3.8;
    for (let i = 0; i < n; i++) {
      const P = pts[i];
      const end = !w.closed && (i === 0 || i === n - 1);
      const A = w.closed ? pts[(i - 1 + n) % n] : pts[Math.max(0, i - 1)];
      const B = w.closed ? pts[(i + 1) % n] : pts[Math.min(n - 1, i + 1)];
      const e1 = unit(sub(P, A)),
        e2 = unit(sub(B, P));
      const cr = e1[0] * e2[1] - e1[1] * e2[0];
      const dt = e1[0] * e2[0] + e1[1] * e2[1];
      const turn = Math.atan2(cr, dt);
      const dir = unit([e1[1] + e2[1], -e1[0] - e2[0]]);
      if ((end || Math.abs(turn) > 0.38) && !near(P, 12)) {
        const kind: Tower['kind'] = res.bastions && cr > 0 && Math.abs(turn) > 0.45 && w.kind === 'outer' ? 'bastion' : res.squareTowers ? 'square' : 'round';
        addTower(P, kind === 'bastion' ? 6.4 : R, kind, w.kind, dir);
      }
      if (i < n - 1 || w.closed) {
        const Q = pts[(i + 1) % n];
        const L = dist(P, Q);
        if (L > 80) {
          const k = Math.floor(L / 62);
          for (let j = 1; j <= k; j++) {
            const q = add(P, mul(sub(Q, P), j / (k + 1)));
            const t = unit(sub(Q, P));
            if (!near(q, 16)) addTower(q, R * 0.82, res.squareTowers ? 'square' : 'round', w.kind, [t[1], -t[0]]);
          }
        }
      }
    }
  }
  // harbour towers at harbour/non-harbour transitions along the outline
  if (outer.length && ctx.harbourEdges.size) {
    const n = outer.length;
    const cat = (k: string) => (edges[k] === 'coast' ? (ctx.harbourEdges.has(k) ? 'h' : 's') : 'o');
    for (let i = 0; i < n; i++) {
      const v = outer[i];
      const c1 = cat(edgeKey(outer[(i - 1 + n) % n], v)),
        c2 = cat(edgeKey(v, outer[(i + 1) % n]));
      if ((c1 === 'h') !== (c2 === 'h')) {
        const t = unit(sub(city.verts[outer[(i + 1) % n]], city.verts[outer[(i - 1 + n) % n]]));
        const idx = towers.findIndex((x) => dist(x.p, city.verts[v]) < 9);
        if (idx >= 0) towers.splice(idx, 1);
        addTower(city.verts[v], 6.6, 'harbour', 'sea', [t[1], -t[0]]);
      }
    }
  }
  city.moat = city.settlement.moat ? Math.max(9, city.settlement.radius * 0.028) : 0;
}

export function buildHarbour(ctx: Ctx) {
  const { city, rng } = ctx;
  if (!ctx.harbourEdges.size) return;
  const piers: { a: Pt; b: Pt; w: number }[] = [];
  const boats: number[] = [];
  const coast = city.resolved.geo === 'coast';
  const keys = [...ctx.harbourEdges];
  let idx = 0;
  for (const k of keys) {
    const e = ctx.ei.get(k)!;
    const A = city.verts[e.a],
      B = city.verts[e.b];
    const L = dist(A, B);
    if (L < (coast ? 20 : 24)) continue;
    const m = mid(A, B);
    if (piers.some((p) => dist(p.b, m) < (coast ? 38 : 50))) continue;
    let cell: Cell;
    if (coast) cell = city.cells.find((c) => e.cells.includes(c.id) && c.kind === 'city')!;
    else cell = city.cells[e.cells[idx++ % 2]];
    const inN = inwardNormal(city, cell, e.a, e.b);
    if (!inN) continue;
    const out: Pt = [-inN[0], -inN[1]];
    let len = coast ? rng.range(16, 28) : rng.range(2.5, 4.5);
    if (coast) {
      while (len > 9 && !ctx.sea(m[0] + out[0] * len, m[1] + out[1] * len)) len -= 3;
      if (!ctx.sea(m[0] + out[0] * len, m[1] + out[1] * len)) continue;
    }
    const hw = (city.river?.ew[k] ?? 16) / 2;
    // river piers start at this cell's own bank (m - out*hw) and project a few metres into the stream
    const p = coast ? { a: add(m, mul(out, -3.5)), b: add(m, mul(out, len)), w: 3.8 } : { a: add(m, mul(out, -hw - 1.5)), b: add(m, mul(out, -hw + len)), w: 2.4 };
    piers.push(p);
    if (coast || rng.chance(0.6)) {
      const side = rng.chance(0.5) ? 1 : -1;
      const perp: Pt = [-out[1], out[0]];
      const bp = add(add(p.b, mul(perp, side * (coast ? 6.2 : 4.4))), mul(out, -2));
      boats.push(bp[0], bp[1], Math.atan2(out[1], out[0]) + rng.range(-0.15, 0.15), coast ? rng.range(8, 11) : rng.range(6, 8), coast ? 3.2 : 2.4);
    }
    if (coast && rng.chance(0.7)) {
      const q = add(add(p.b, mul(out, rng.range(12, 30))), mul([-out[1], out[0]], rng.range(-22, 22)));
      if (ctx.sea(q[0], q[1]) && ctx.sea(q[0] + out[0] * 12, q[1] + out[1] * 12))
        boats.push(q[0], q[1], Math.atan2(out[1], out[0]) + rng.range(-0.6, 0.6), rng.range(12, 17), 4.4);
    }
  }
  city.piers = piers;
  city.quays = keys;
  city.boats = boats;
  const ht = city.towers.find((t) => t.kind === 'harbour');
  if (ht && coast) city.features.push({ id: city.nextId++, type: 'lighthouse', p: add(ht.p, mul(ht.dir, 8)) });
}

export function finalizeGround(ctx: Ctx) {
  const { city } = ctx;
  for (const c of city.cells) {
    if (c.vids.length < 3) continue;
    const pl = poly(city, c);
    if (c.kind === 'city') c.ground = flat(pl);
    else if (c.kind === 'sea') {
      const d = c.nbrs.map((n) => (n >= 0 && city.cells[n].kind !== 'sea' ? 7 : 0));
      c.ground = flat(insetConvex(pl, d));
    }
  }
}

/** Suburban hamlets and farmsteads along the country roads outside the walls. */
export function buildSuburbs(ctx: Ctx) {
  const { city, rng } = ctx;
  const st = city.settlement;
  if (!st.suburbs || !city.roads.length) return;
  const cityCells = city.cells.filter((c) => c.kind === 'city');
  const inCity = (p: Pt) => cityCells.some((c) => pointInConvex(p, poly(city, c), 2));
  const clusters = Math.max(1, Math.round(st.tierIndex * 1.6 + 1));
  const perCluster = Math.max(2, Math.round(2 + st.tierIndex * 0.8));
  let made = 0;
  for (const road of city.roads) {
    if (made >= clusters) break;
    const n = road.pts.length;
    for (let i = 1; i < n - 1 && made < clusters; i++) {
      const p = road.pts[i];
      if (inCity(p)) continue;
      if (riverDistOf(city, p) < 14) continue;
      if (rng.next() > 0.45) continue;
      // a cluster of small farmsteads set back from the road
      const tan = unit(sub(road.pts[i + 1], road.pts[i - 1]));
      const side = rng.chance(0.5) ? 1 : -1;
      const nrm: Pt = [-tan[1] * side, tan[0] * side];
      const base = add(p, mul(nrm, road.w / 2 + 7));
      let ok = true;
      const placed: { x: number; y: number; w: number; h: number; a: number; t: string }[] = [];
      for (let k = 0; k < perCluster; k++) {
        const along = (k - perCluster / 2) * (7 + rng.range(0, 3)) * (rng.chance(0.5) ? 1 : -1);
        const back = rng.range(0, 12);
        const c2 = add(add(base, mul(tan, along)), mul(nrm, back));
        const w = rng.range(5.5, 8.5),
          h = rng.range(7, 11);
        const a = Math.atan2(tan[1], tan[0]) + (rng.next() - 0.5) * 0.25;
        if (inCity(c2)) { ok = false; break; }
        if (placed.some((q) => Math.hypot(q.x - c2[0], q.y - c2[1]) < 11)) continue;
        placed.push({ x: c2[0], y: c2[1], w, h, a, t: rng.chance(0.22) ? 'barn' : 'house' });
      }
      if (!ok || placed.length < 2) continue;
      const cell = city.cells.find((c) => c.kind === 'outside' && pointInConvex(p, poly(city, c), 4));
      for (const q of placed) {
        const parts: Building['parts'] = [];
        const bb: number[] = [];
        const co = Math.cos(q.a), si = Math.sin(q.a);
        const hw = q.w / 2, hh = q.h / 2;
        for (const [u, v] of [[-hw, -hh], [hw, -hh], [hw, hh], [-hw, hh]]) bb.push(q.x + u * co - v * si, q.y + u * si + v * co);
        parts.push({ k: 'r', p: bb, roof: (q.t === 'barn' ? 'gable' : rng.chance(0.6) ? 'thatch' : 'gable') as Roof, along: 0 });
        city.buildings.push({
          id: city.nextId++, type: q.t as any, cell: cell ? cell.id : 0, parts,
          pal: q.t === 'barn' ? 'timber' : 'thatch', ci: rng.int(0, 4), h: 0,
          bb: [Math.min(...bb.filter((_, i) => i % 2 === 0)), Math.min(...bb.filter((_, i) => i % 2 === 1)), Math.max(...bb.filter((_, i) => i % 2 === 0)), Math.max(...bb.filter((_, i) => i % 2 === 1))],
          manual: true,
        });
      }
      made++;
    }
  }
}

function riverDistOf(city: City, p: Pt) {
  return city.river ? polylineNearest(p, city.river.pts).d : Infinity;
}

export function buildFeaturesAndDecor(ctx: Ctx) {
  const { city, rng } = ctx;
  const idn = identityOf(city.params.identity);
  const cells = city.cells;
  const roads = city.roads;
  const roadDist = (p: Pt) => {
    let d = Infinity;
    for (const r of roads) d = Math.min(d, polylineNearest(p, r.pts).d);
    return d;
  };
  const riverDist = (p: Pt) => (city.river ? nearestOn(city.river.pts, p).d : Infinity);
  // outside hops from the city
  const hop = new Map<number, number>();
  let fr: number[] = [];
  for (const c of cells)
    if (c.kind === 'outside' && c.nbrs.some((n) => n >= 0 && cells[n].kind === 'city')) (hop.set(c.id, 1), fr.push(c.id));
  while (fr.length) {
    const nx: number[] = [];
    for (const u of fr)
      for (const n of cells[u].nbrs)
        if (n >= 0 && cells[n].kind === 'outside' && !hop.has(n)) (hop.set(n, hop.get(u)! + 1), nx.push(n));
    fr = nx;
  }
  // windmills & gallows
  const mills = cells.filter((c) => c.kind === 'outside' && (hop.get(c.id) ?? 9) <= 2 && c.vids.length >= 4 && riverDist(c.center) > 80 && roadDist(c.center) > 30);
  for (let i = 0; i < idn.windmills && mills.length; i++) {
    const c = mills.splice(rng.int(0, mills.length), 1)[0];
    city.features.push({ id: city.nextId++, type: 'windmill', p: c.center });
  }
  const og = city.gates.filter((g) => g.kind === 'main');
  if (og.length && rng.chance(0.6)) {
    const g = rng.pick(og);
    const p = add(add(g.p, mul(g.dir, 70)), mul(g.tan, rng.pick([-1, 1]) * 34));
    if (roadDist(p) > 14 && riverDist(p) > 40 && !ctx.sea(p[0], p[1])) city.features.push({ id: city.nextId++, type: 'gallows', p });
  }
  // fields / forests / meadows
  const treeAreas: { pl: Pt[]; dens: number }[] = [];
  city.fields = [];
  for (const c of cells) {
    if (c.kind !== 'outside' || c.vids.length < 3) continue;
    const h = hop.get(c.id) ?? 9;
    const pl = poly(city, c);
    const d = c.nbrs.map((n, i) => {
      if (n >= 0 && cells[n].kind === 'city') return 11;
      if (n >= 0 && cells[n].kind === 'sea') return 7;
      const k = edgeKey(c.vids[i], c.vids[(i + 1) % c.vids.length]);
      if (city.river && k in city.river.ew) return city.river.ew[k] / 2 + 6;
      return 2.5;
    });
    const ip = insetConvex(pl, d);
    if (ip.length < 3 || area(ip) < 1500) continue;
    const nf = ctx.noise.fbm(c.center[0] / 380 + 20, c.center[1] / 380 + 30, 3);
    const high = c.elev > (city.resolved.geo === 'mountain' ? 0.75 : 1.0);
    const mountain = city.resolved.geo === 'mountain';
    const farm = !high && h <= 3 && nf < 0.62 && rng.chance(0.82 - 0.12 * h) && roadDist(c.center) < 900;
    if (farm) {
      const parts: Pt[][] = [];
      const split = (p: Pt[], depth: number) => {
        if (area(p) < 7500 || depth > 3) return parts.push(p);
        const cc = centroid(p);
        const a = rng.range(0, Math.PI);
        const [A, B] = splitConvex(p, [cc[0] + rng.range(-12, 12), cc[1] + rng.range(-12, 12)], [Math.cos(a), Math.sin(a)], 3.2);
        if (A.length < 3 || B.length < 3) return parts.push(p);
        split(A, depth + 1);
        split(B, depth + 1);
      };
      split(ip, 0);
      for (const p of parts) {
        if (area(p) < 900) continue;
        const ang = rng.range(0, Math.PI),
          dd: Pt = [Math.cos(ang), Math.sin(ang)],
          nn: Pt = [-dd[1], dd[0]];
        const cc = centroid(p);
        const bb = bbox(p);
        const rad = Math.hypot(bb[2] - bb[0], bb[3] - bb[1]) / 2;
        const f: number[] = [];
        for (let off = -rad; off <= rad; off += 4.4) {
          const o: Pt = [cc[0] + nn[0] * off, cc[1] + nn[1] * off];
          const tr = clipLineConvex(p, o, dd);
          if (tr && tr[1] - tr[0] > 6) f.push(o[0] + dd[0] * (tr[0] + 1), o[1] + dd[1] * (tr[0] + 1), o[0] + dd[0] * (tr[1] - 1), o[1] + dd[1] * (tr[1] - 1));
        }
        city.fields.push({ p: flat(p), f, tone: rng.int(0, 4) });
      }
    } else if (nf > 0.5 || mountain || (h > 3 && rng.chance(0.5))) treeAreas.push({ pl: ip, dens: 1 });
    else treeAreas.push({ pl: ip, dens: 0.25 });
  }
  let tot = 0;
  for (const t of treeAreas) tot += area(t.pl) * t.dens;
  const sp = clamp(Math.sqrt(tot / 4200), 8.5, 20);
  const forest: number[] = [];
  for (const t of treeAreas) {
    const s = sp / Math.sqrt(t.dens);
    const bb = bbox(t.pl);
    for (let x = bb[0]; x < bb[2]; x += s)
      for (let y = bb[1]; y < bb[3]; y += s) {
        const p: Pt = [x + rng.range(0, s), y + rng.range(0, s)];
        const r = rng.range(3.4, 5.6);
        if (!pointInConvex(p, t.pl, -r * 0.6)) continue;
        if (t.dens < 1 && rng.chance(0.55)) continue;
        if (roadDist(p) < 8 + r || riverDist(p) < 16 + r) continue;
        forest.push(p[0], p[1], r, rng.int(0, 3));
      }
  }
  city.forest = forest;
  // waves
  const waves: number[] = [];
  for (const c of cells) {
    if (c.kind !== 'sea' || c.ground.length < 6) continue;
    const g = c.ground;
    const bb = bbox(g, true);
    const n = clamp(Math.round(((bb[2] - bb[0]) * (bb[3] - bb[1])) / 14000), 0, 24);
    for (let i = 0; i < n; i++) {
      const p: Pt = [rng.range(bb[0], bb[2]), rng.range(bb[1], bb[3])];
      if (Math.hypot(p[0], p[1]) > 900) continue;
      let inside = true;
      const poly2 = [] as Pt[];
      for (let j = 0; j < g.length; j += 2) poly2.push([g[j], g[j + 1]]);
      inside = pointInConvex(p, poly2, -6);
      if (inside) waves.push(p[0], p[1], rng.range(8, 16));
    }
  }
  city.waves = waves;
}
