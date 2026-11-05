// Stage 6-9: blocks -> plots -> buildings, plus special layouts (market, cathedral, castle, rings).
import { RNG } from './rng';
import {
  Pt, area, centroid, insetConvex, splitConvex, clipPlane, homothety, fitRect, fitFrontageRect, fitRectAngle, Rect, rectPts, flat, unit, sub, add, dist, segDist, mid, unflat,
  satOverlap, octagon, nearestOn, lerp, clamp, pointInConvex, bbox, isConvex,
} from './geom';
import { City, Cell, Building, BType, Part, Roof, WardType, edgeKey } from './types';
import { poly } from './plan';
import { invalidate } from './render';
import { WALL_T } from './fortify';
import { SAINTS, GODS, placeWord } from './params';

export interface Stats {
  repaired: number;
  dropped: number;
}

interface Style {
  min: number; var: number; lane: number; laneArea: number; gap: number; keep: number; fill: number; spread: number;
}
const STYLE: Record<WardType, Style> = {
  residential: { min: 86, var: 0.5, lane: 3.2, laneArea: 640, gap: 0.7, keep: 0.96, fill: 0.93, spread: 0.28 },
  poor: { min: 60, var: 0.7, lane: 2.4, laneArea: 460, gap: 0.5, keep: 0.93, fill: 0.9, spread: 0.5 },
  merchant: { min: 140, var: 0.45, lane: 3.4, laneArea: 820, gap: 0.9, keep: 0.96, fill: 0.93, spread: 0.22 },
  noble: { min: 380, var: 0.35, lane: 4, laneArea: 1500, gap: 2.2, keep: 0.9, fill: 0.7, spread: 0.2 },
  artisan: { min: 115, var: 0.5, lane: 3.2, laneArea: 720, gap: 0.8, keep: 0.95, fill: 0.94, spread: 0.3 },
  industrial: { min: 230, var: 0.5, lane: 4, laneArea: 1000, gap: 1.4, keep: 0.9, fill: 0.92, spread: 0.25 },
  harbour: { min: 215, var: 0.4, lane: 4, laneArea: 900, gap: 1.2, keep: 0.95, fill: 0.95, spread: 0.2 },
  military: { min: 260, var: 0.3, lane: 4, laneArea: 1100, gap: 1.4, keep: 0.92, fill: 0.92, spread: 0.12 },
  religious: { min: 190, var: 0.4, lane: 3.4, laneArea: 850, gap: 1.2, keep: 0.9, fill: 0.9, spread: 0.2 },
  scholar: { min: 300, var: 0.35, lane: 3.6, laneArea: 1300, gap: 1.6, keep: 0.92, fill: 0.92, spread: 0.15 },
  market: { min: 110, var: 0.3, lane: 3, laneArea: 99999, gap: 0.5, keep: 1, fill: 0.96, spread: 0.08 },
  citadel: { min: 260, var: 0.3, lane: 3, laneArea: 99999, gap: 1.0, keep: 1, fill: 0.94, spread: 0.1 },
};

/** Style table scaled to the settlement: plot sizes grow for small villages, shrink for megacities. */
function styleFor(city: City, ward: WardType): Style {
  const base = STYLE[ward];
  const k = city.settlement.plotScale;
  return { ...base, min: base.min * k, laneArea: base.laneArea * k };
}

export function insetDists(city: City, cell: Cell): number[] {
  const n = cell.vids.length;
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    const k = edgeKey(cell.vids[i], cell.vids[(i + 1) % n]);
    const cls = city.edges[k];
    let d = 3;
    switch (cls) {
      case 'minor':
      case 'secondary':
      case 'arterial': d = (city.ew[k] ?? 4.4) / 2; break;
      case 'wallO': d = WALL_T.outer / 2 + 3.2; break;
      case 'wallI': d = WALL_T.inner / 2 + 2.6; break;
      case 'river': d = (city.river?.ew[k] ?? 14) / 2 + 4.2; break;
      case 'coast': d = 4.6; break;
      case 'open': d = 3.2; break;
    }
    out.push(d);
  }
  return out;
}

/** Split a (possibly concave) polygon with per-edge labels into convex parts; cut edges get `cutD`. */
export function decomposeConvex(pts: Pt[], d: number[], cutD: number, depth = 0): { p: Pt[]; d: number[] }[] {
  const n = pts.length;
  if (n < 3) return [];
  if (isConvex(pts) || depth > 5) return [{ p: pts, d }];
  for (let i = 0; i < n; i++) {
    const prev = pts[(i - 1 + n) % n], P = pts[i], next = pts[(i + 1) % n];
    const cr = (P[0] - prev[0]) * (next[1] - P[1]) - (P[1] - prev[1]) * (next[0] - P[0]);
    if (cr >= -1e-6) continue; // not reflex
    const a = unit(sub(P, prev)), b = unit(sub(next, P));
    const dir = unit([a[0] - b[0], a[1] - b[1]]);
    let best: { j: number; t: number; q: Pt } | null = null;
    for (let j = 0; j < n; j++) {
      if (j === i || (j + 1) % n === i) continue;
      const A = pts[j], B2 = pts[(j + 1) % n];
      const ex = B2[0] - A[0], ey = B2[1] - A[1];
      const den = dir[0] * ey - dir[1] * ex;
      if (Math.abs(den) < 1e-9) continue;
      const ox = A[0] - P[0], oy = A[1] - P[1];
      const t = (ox * ey - oy * ex) / den;
      const u = (ox * dir[1] - oy * dir[0]) / den;
      if (t > 1e-3 && u > 0.02 && u < 0.98 && (!best || t < best.t)) best = { j, t, q: [P[0] + dir[0] * t, P[1] + dir[1] * t] };
    }
    if (!best) continue;
    const { j, q } = best;
    // the cut must keep buildings as far from the reflex corner as the adjacent streets demand
    const cd = Math.max(cutD, d[(i - 1 + n) % n], d[i]);
    const p1: Pt[] = [], d1: number[] = [], p2: Pt[] = [], d2: number[] = [];
    for (let k = i; k !== (j + 1) % n; k = (k + 1) % n) { p1.push(pts[k]); d1.push(d[k]); }
    p1.push(q); d1[d1.length - 1] = d[j]; d1.push(cd);
    p2.push(q); d2.push(d[j]);
    for (let k = (j + 1) % n; k !== i; k = (k + 1) % n) { p2.push(pts[k]); d2.push(d[k]); }
    p2.push(P); d2.push(cd);
    return [...decomposeConvex(p1, d1, cutD, depth + 1), ...decomposeConvex(p2, d2, cutD, depth + 1)];
  }
  return [{ p: pts, d }];
}

export function cellPieces(city: City, cell: Cell): Pt[][] {
  const pl = poly(city, cell);
  const n = pl.length;
  const parts = decomposeConvex(pl, insetDists(city, cell), 1.6);
  let ps: Pt[][] = [];
  for (const part of parts) {
    let reg = insetConvex(part.p, part.d);
    if (reg.length < 3) continue;
    for (const pz of city.plazas) {
      const i = cell.vids.indexOf(pz.vid);
      if (i < 0) continue;
      const P = pl[i],
        A = pl[(i - 1 + n) % n],
        B = pl[(i + 1) % n];
      const bis = unit(add(unit(sub(A, P)), unit(sub(B, P))));
      reg = clipPlane(reg, bis[0], bis[1], bis[0] * P[0] + bis[1] * P[1] + pz.r);
      if (reg.length < 3) break;
    }
    if (reg.length >= 3 && area(reg) > 25) ps.push(reg);
  }
  if (!ps.length) return [];
  for (const cut of cell.cuts) {
    const next: Pt[][] = [];
    for (const p of ps) {
      const [A, B] = splitConvex(p, cut.p, cut.d, cut.w);
      if (A.length >= 3 && area(A) > 25) next.push(A);
      if (B.length >= 3 && area(B) > 25) next.push(B);
    }
    ps = next;
  }
  return ps;
}

export const partPoly = (p: Part): number[] => {
  if (p.k === 'c') return octagon(p.p[0], p.p[1], Math.max(0.9, p.p[2]));
  // a footprint shrunk to a sliver would confuse the overlap test
  const w = Math.hypot(p.p[2] - p.p[0], p.p[3] - p.p[1]);
  const h = Math.hypot(p.p[4] - p.p[2], p.p[5] - p.p[3]);
  if (w >= 1 && h >= 1) return p.p;
  const c = centroid(unflat(p.p));
  const a = Math.atan2(p.p[3] - p.p[1], p.p[2] - p.p[0]);
  return rectPts(c[0], c[1], Math.max(1.3, w), Math.max(1.3, h), a);
};

export function bbOf(parts: Part[]): [number, number, number, number] {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const p of parts) {
    if (p.k === 'c') {
      x0 = Math.min(x0, p.p[0] - p.p[2]); x1 = Math.max(x1, p.p[0] + p.p[2]);
      y0 = Math.min(y0, p.p[1] - p.p[2]); y1 = Math.max(y1, p.p[1] + p.p[2]);
    } else {
      const b = bbox(p.p, true);
      x0 = Math.min(x0, b[0]); y0 = Math.min(y0, b[1]); x1 = Math.max(x1, b[2]); y1 = Math.max(y1, b[3]);
    }
  }
  return [x0, y0, x1, y1];
}

/** Real-world footprint ranges [minW, maxW, minD, maxD] in world units (1 unit ~ 1 m). */
export const TYPE_DIMS: Record<string, [number, number, number, number]> = {
  house: [5.5, 9.5, 6.5, 11], hovel: [4, 6.5, 4.5, 7], house_l: [7, 12, 8, 14], merchant: [7, 13, 9, 16],
  workshop: [5.5, 10, 6.5, 12], warehouse: [8, 14, 11, 22], inn: [8, 12.5, 9, 14], tavern: [7, 11, 8, 13],
  barn: [7, 12, 11, 20], manor: [11, 18, 11, 19], palace: [22, 34, 18, 30], church: [15, 24, 8, 13],
  cathedral: [36, 60, 24, 38], temple: [28, 44, 18, 26], chapel: [9, 15, 5.5, 9], guildhall: [12, 20, 14, 22],
  townhall: [16, 26, 13, 22], barracks: [20, 30, 8, 13], stable: [13, 22, 6.5, 10], mill: [7.5, 11, 8.5, 13],
  smithy: [5.5, 9, 6.5, 10], bakery: [5.5, 9, 6.5, 11], granary: [9, 14, 10, 18], hospital: [16, 26, 14, 24],
  university: [22, 34, 18, 28], monastery: [18, 28, 16, 24], market_hall: [11, 20, 16, 26], keep: [18, 30, 18, 30],
};

/** Clamp a fitted rectangle to the real-world size of its type. */
function clampRect(rc: Rect, type: BType): Rect {
  const d = TYPE_DIMS[type];
  if (!d) return rc;
  const [, maxW, , maxD] = d;
  // only ever shrink: growing a building would push it out of its plot
  let w = Math.min(rc.w, maxW);
  let h = Math.min(rc.h, maxD);
  if (w / h > 1.3 && h < maxD * 0.95) {
    const k = Math.min(maxD / h, maxW / w);
    w = rc.w * k;
    h = rc.h * k;
  }
  return { cx: rc.cx, cy: rc.cy, w, h, a: rc.a };
}

/* ---------- footprints ---------- */
function R(rc: Rect, u: number, v: number, w: number, h: number, roof: Roof, forcedAlong?: 0 | 1): Part {
  const c = Math.cos(rc.a),
    s = Math.sin(rc.a);
  return {
    k: 'r',
    p: rectPts(rc.cx + u * c - v * s, rc.cy + u * s + v * c, w, h, rc.a),
    roof,
    along: forcedAlong !== undefined ? forcedAlong : w >= h ? 0 : 1,
  };
}
function C(rc: Rect, u: number, v: number, r: number, roof: Roof): Part {
  const c = Math.cos(rc.a),
    s = Math.sin(rc.a);
  return { k: 'c', p: [rc.cx + u * c - v * s, rc.cy + u * s + v * c, r], roof, along: 0 };
}
const norm = (r: Rect): Rect => (r.h > r.w ? { cx: r.cx, cy: r.cy, w: r.h, h: r.w, a: r.a + Math.PI / 2 } : r);

function shapeL(rc: Rect, rng: RNG, roof: Roof, tee = false): Part[] {
  const h1 = rc.h * rng.range(0.48, 0.6);
  const w2 = rc.w * rng.range(0.38, 0.52);
  const h2 = rc.h - h1 + 0.4;
  const side = tee ? 0 : rng.chance(0.5) ? 1 : -1;
  return [
    R(rc, 0, -rc.h / 2 + h1 / 2, rc.w, h1, roof, 0),
    R(rc, side * (rc.w / 2 - w2 / 2), rc.h / 2 - h2 / 2, w2, h2, roof, 1),
  ];
}
function shapeU(rc: Rect, rng: RNG, closed: boolean, roof: Roof): Part[] {
  const t = clamp(Math.min(rc.w, rc.h) * rng.range(0.3, 0.38), 3, 7.5);
  const parts = [R(rc, 0, -rc.h / 2 + t / 2, rc.w, t, roof)];
  const hh = closed ? rc.h - 2 * t : rc.h - t;
  const vc = closed ? 0 : t / 2;
  parts.push(R(rc, -rc.w / 2 + t / 2, vc, t, hh, roof), R(rc, rc.w / 2 - t / 2, vc, t, hh, roof));
  if (closed) parts.push(R(rc, 0, rc.h / 2 - t / 2, rc.w, t, roof));
  return parts;
}
function cathedralParts(rc: Rect, temple: boolean, variant = 0): Part[] {
  const L = rc.w,
    W = rc.h;
  if (temple) {
    const parts: Part[] = [R(rc, 0, 0, L * 0.88, W * 0.52, 'flat'), R(rc, 0, 0, L * 0.7, W * 0.3, 'gable')];
    const n = Math.max(4, Math.floor((L * 0.88) / 5.2));
    for (let i = 0; i < n; i++) {
      const u = -L * 0.44 + 1.6 + (i * (L * 0.88 - 3.2)) / (n - 1);
      parts.push(C(rc, u, W * 0.26 - 1.4, 1.15, 'flat'), C(rc, u, -W * 0.26 + 1.4, 1.15, 'flat'));
    }
    return parts;
  }
  const nw = Math.min(W * 0.4, L * 0.2);
  const ra = nw / 2;
  const ln = L - ra * 0.9;
  const u0 = -L / 2 + ln / 2;
  const ut = -L / 2 + ln * 0.6;
  const tw = Math.min(W * 0.96, ln * 0.7);
  const parts: Part[] = [
    R(rc, u0, 0, ln, nw, 'gable', 0),
    R(rc, ut, 0, nw * 0.96, tw, 'gable', 1),
    C(rc, L / 2 - ra, 0, ra, 'cone'),
  ];
  // aisles: lower flat-roofed strips along the nave give the classic basilica silhouette
  const aisle = nw * 0.32;
  const aLen = (ut - nw * 0.5) - (-L / 2 + nw * 0.55);
  if (aLen > 4) {
    const ac = (-L / 2 + nw * 0.55 + ut - nw * 0.5) / 2;
    parts.splice(0, 0, R(rc, ac, nw / 2 + aisle / 2 - 0.2, aLen, aisle, 'flat', 0), R(rc, ac, -nw / 2 - aisle / 2 + 0.2, aLen, aisle, 'flat', 0));
  }
  if (variant % 3 === 1) {
    // single great west tower + chevet with radiating chapels
    const t = nw * 0.86;
    parts.push(R(rc, -L / 2 + t / 2, 0, t, t, 'hip'));
    for (let i = -2; i <= 2; i++) {
      const a = (i / 2) * 1.1;
      parts.push(C(rc, L / 2 - ra + Math.cos(a) * ra * 1.02, Math.sin(a) * ra * 1.02, ra * 0.34, 'cone'));
    }
    parts.push(R(rc, ut, 0, nw * 0.58, nw * 0.58, 'hip'));
  } else if (variant % 3 === 2) {
    // twin-towered west front with a spire on the crossing
    const tws = nw * 0.6;
    parts.push(
      R(rc, -L / 2 + tws / 2, nw / 2 - tws / 2 + 0.9, tws, tws, 'hip'),
      R(rc, -L / 2 + tws / 2, -nw / 2 + tws / 2 - 0.9, tws, tws, 'hip'),
      C(rc, ut, 0, nw * 0.34, 'cone'),
    );
  } else {
    const tws = nw * 0.46;
    parts.push(
      R(rc, -L / 2 + tws / 2, nw / 2 + tws / 2 - 0.4, tws, tws, 'hip'),
      R(rc, -L / 2 + tws / 2, -nw / 2 - tws / 2 + 0.4, tws, tws, 'hip'),
      R(rc, ut, 0, nw * 0.62, nw * 0.62, 'hip'),
    );
  }
  return parts;
}
function smallChurch(rc: Rect): Part[] {
  const L = rc.w,
    W = rc.h;
  const nw = Math.min(W * 0.46, L * 0.34);
  const ln = L * 0.84;
  return [
    R(rc, -L / 2 + ln / 2, 0, ln, nw, 'gable'),
    R(rc, L / 2 - nw * 0.4, 0, nw * 0.8, nw * 0.8, 'hip'),
    R(rc, -L / 2 + ln * 0.55, 0, nw * 0.9, Math.min(W, nw * 1.9), 'gable'),
    C(rc, -L / 2 + nw * 0.35, 0, nw * 0.36, 'cone'),
  ];
}

const NAMED: Partial<Record<BType, true>> = {
  cathedral: true, temple: true, church: true, townhall: true, guildhall: true, palace: true, keep: true, hospital: true, university: true,
  market_hall: true, barracks: true, monastery: true, granary: true, mill: true, inn: true, tavern: true,
};
const LABEL: Partial<Record<BType, string>> = {
  townhall: 'Town Hall', guildhall: 'Guildhall', palace: 'Palace', keep: 'Keep', hospital: 'Hospital', university: 'University',
  market_hall: 'Market Hall', barracks: 'Barracks', monastery: 'Monastery', granary: 'Granary', mill: 'Mill', smithy: 'Smithy', bakery: 'Bakery',
};
const ANIMALS = ['Stag', 'Hart', 'Lion', 'Raven', 'Swan', 'Boar', 'Falcon', 'Fox', 'Bear', 'Crown', 'Anchor', 'Barrel'];
const ADJ = ['Gilded', 'Silver', 'Red', 'Black', 'White', 'Golden', 'Laughing', 'Crooked', 'Old', 'Merry'];

export function nameFor(type: BType, rng: RNG): string | undefined {
  if (!NAMED[type]) return undefined;
  switch (type) {
    case 'cathedral': return `St. ${rng.pick(SAINTS)}'s Cathedral`;
    case 'church': return `St. ${rng.pick(SAINTS)}`;
    case 'temple': return `Temple of ${rng.pick(GODS)}`;
    case 'inn': return `The ${rng.pick(ADJ)} ${rng.pick(ANIMALS)} Inn`;
    case 'tavern': return `The ${rng.pick(ADJ)} ${rng.pick(ANIMALS)}`;
    case 'guildhall': return `${rng.pick(['Mercers', 'Weavers', 'Smiths', 'Brewers', 'Masons', 'Goldsmiths'])}' Guildhall`;
    case 'university': return `${placeWord(rng)} College`;
    default: return LABEL[type];
  }
}

const PALS: Record<string, [string, number][]> = {
  tile: [['tile', 6], ['timber', 2], ['slate', 1], ['thatch', 1]],
  terracotta: [['terracotta', 7], ['tile', 2], ['timber', 1]],
  slate: [['slate', 6], ['timber', 2], ['stone', 1]],
  timber: [['timber', 5], ['tile', 4], ['slate', 1]],
  stone: [['stone', 4], ['slate', 3], ['tile', 3]],
};
export function paletteFor(city: City, type: BType, ward: WardType, rng: RNG): [string, number] {
  const ci = rng.int(0, 4);
  const st = city.resolved.style;
  switch (type) {
    case 'hovel': return [rng.chance(0.65) ? 'thatch' : 'timber', ci];
    case 'cathedral': case 'church': case 'chapel': case 'monastery': return [rng.chance(0.75) ? 'slate' : 'stone', ci];
    case 'temple': return ['stone', ci];
    case 'warehouse': case 'granary': return [rng.pick(['dark', 'timber', 'slate']), ci];
    case 'barracks': case 'keep': case 'stable': return [type === 'stable' ? 'timber' : rng.pick(['stone', 'slate']), ci];
    case 'smithy': case 'workshop': return [rng.pick(['dark', 'timber', 'slate']), ci];
    case 'palace': case 'townhall': case 'university': case 'hospital': return [rng.pick(['slate', 'tile', 'stone']), ci];
    case 'mill': return ['timber', ci];
    case 'barn': return [rng.chance(0.55) ? 'thatch' : 'timber', ci];
    default: break;
  }
  if (ward === 'poor') return [rng.chance(0.6) ? 'thatch' : 'timber', ci];
  if (ward === 'noble') return [rng.weighted([['slate', 4], ['tile', 3], ['stone', 2]] as const), ci];
  if (ward === 'industrial') return [rng.weighted([['dark', 3], ['slate', 3], ['timber', 3]] as const), ci];
  return [rng.weighted(PALS[st] ?? PALS.tile), ci];
}

/* ---------- context ---------- */
interface BCtx {
  city: City;
  cell: Cell;
  rng: RNG;
  mult: number;
  stats: Stats;
  fronts: [Pt, Pt][];
  coast: [Pt, Pt][];
  gates: Pt[];
  made: Building[];
  mills: number;
  /** clearance segments: street and wall edges of the cell */
  segs: [Pt, Pt, number][];
}

function addBuilding(B: BCtx, type: BType, parts: Part[], ward: WardType, h: number, extra?: Partial<Building>): Building {
  const [pal, ci] = paletteFor(B.city, type, ward, B.rng);
  let name = nameFor(type, B.rng);
  if (name) {
    // names must be unique across the whole city (two "Golden Lion Inn"s read as a bug)
    const used = new Set<string>();
    for (const b of B.city.buildings) if (b.name) used.add(b.name);
    for (const b of B.made) if (b.name) used.add(b.name);
    if (used.has(name)) {
      const base: string = name;
      for (let i = 0; i < 14 && used.has(name); i++) {
        const cand = nameFor(type, B.rng);
        if (cand) name = cand;
      }
      if (used.has(name)) name = base.replace(/(\s(Inn|Tavern))?$/, '') + ' ' + ['Lower', 'Upper', 'Little', 'Great', 'Old', 'New', 'East', 'West', 'North', 'South'][B.rng.int(0, 10)] + '/' + (base.split(' ').pop() ?? 'House');
    }
  }
  const b: Building = { id: B.city.nextId++, type, cell: B.cell.id, parts, pal, ci, h, bb: bbOf(parts), name, ...extra };
  B.made.push(b);
  return b;
}

/** Minimum clearance from every part vertex to the cell's streets, walls and water. */
function clearanceOK(segs: [Pt, Pt, number][], parts: Part[], margin = 0.35): boolean {
  for (const p of parts) {
    const pts: Pt[] = [];
    if (p.k === 'c') pts.push([p.p[0], p.p[1]]);
    else for (let i = 0; i < 8; i += 2) pts.push([p.p[i], p.p[i + 1]]);
    for (const q of pts) {
      for (const [a, c, w] of segs) {
        if (segDist(q, a, c) < w + margin - (p.k === 'c' ? p.p[2] : 0)) return false;
      }
    }
  }
  return true;
}

function riverOK(city: City, parts: Part[], margin = 1.2) {
  const r = city.river;
  if (!r) return true;
  for (const p of parts) {
    const pts: Pt[] = [];
    if (p.k === 'c') pts.push([p.p[0], p.p[1]]);
    else for (let i = 0; i < 8; i += 2) pts.push([p.p[i], p.p[i + 1]]);
    for (const q of pts) {
      const n = nearestOn(r.pts, q);
      const w = r.w[Math.min(r.w.length - 1, n.i)];
      if (n.d < w / 2 + margin + (p.k === 'c' ? p.p[2] : 0)) return false;
    }
  }
  return true;
}

function scaleParts(parts: Part[], f: number): Part[] {
  const bb = bbOf(parts);
  const cx = (bb[0] + bb[2]) / 2,
    cy = (bb[1] + bb[3]) / 2;
  return parts.map((p) => {
    if (p.k === 'c') return { ...p, p: [cx + (p.p[0] - cx) * f, cy + (p.p[1] - cy) * f, p.p[2] * f] };
    const q = p.p.slice();
    for (let i = 0; i < 8; i += 2) {
      q[i] = cx + (q[i] - cx) * f;
      q[i + 1] = cy + (q[i + 1] - cy) * f;
    }
    return { ...p, p: q };
  });
}

/** place a finished footprint with validation + repair (shrink) rather than deleting */
function commit(B: BCtx, type: BType, parts: Part[], ward: WardType, h: number, extra?: Partial<Building>) {
  let ps = parts;
  const fits = (p: Part[]) => riverOK(B.city, p) && clearanceOK(B.segs, p);
  if (!fits(ps)) {
    let ok = false;
    for (let i = 0; i < 6 && !ok; i++) {
      ps = scaleParts(ps, 0.88);
      ok = fits(ps);
    }
    if (!ok) {
      B.stats.dropped++;
      return null;
    }
    B.stats.repaired++;
  }
  return addBuilding(B, type, ps, ward, h, extra);
}

/* ---------- plot subdivision ---------- */
interface SubOpts { min: number; lane: number; laneArea: number; spread: number; var: number }
function subdivide(p: Pt[], o: SubOpts, rng: RNG, out: Pt[][], depth = 0) {
  const a = area(p);
  const thr = o.min * (0.75 + rng.next() * o.var * 1.4);
  if (a < thr * 1.15 || depth > 10) return void out.push(p);
  let bi = 0,
    bl = -1;
  const n = p.length;
  for (let i = 0; i < n; i++) {
    const l = dist(p[i], p[(i + 1) % n]);
    if (l > bl) (bl = l), (bi = i);
  }
  const A = p[bi],
    Bp = p[(bi + 1) % n];
  const t = 0.5 + (rng.next() - 0.5) * 0.36;
  const pt: Pt = [A[0] + (Bp[0] - A[0]) * t, A[1] + (Bp[1] - A[1]) * t];
  let d = unit([-(Bp[1] - A[1]), Bp[0] - A[0]]);
  const ang = (rng.next() - 0.5) * o.spread * Math.PI;
  const c = Math.cos(ang),
    s = Math.sin(ang);
  d = [d[0] * c - d[1] * s, d[0] * s + d[1] * c];
  const gap = a > o.laneArea ? o.lane : 0;
  const [P1, P2] = splitConvex(p, pt, d, gap);
  if (P1.length < 3 || P2.length < 3 || area(P1) < 8 || area(P2) < 8) return void out.push(p);
  subdivide(P1, o, rng, out, depth + 1);
  subdivide(P2, o, rng, out, depth + 1);
}

/* ---------- type selection ---------- */
function pickType(B: BCtx, ward: WardType, a: number, dArt: number, dRiver: number, dWater: number, dGate: number): BType {
  const w: [BType, number][] = [];
  const add = (t: BType, wt: number, minA = 0) => {
    if (a >= minA && wt > 0) w.push([t, wt]);
  };
  const tier = B.city.settlement.tierIndex;
  // rural fabric: farmsteads, barns and cottages instead of town houses
  if (tier <= 1) {
    add('house', 40);
    add('hovel', 18);
    add('barn', 16);
    add('workshop', 7);
    add('bakery', 3, 90);
    add('tavern', 3, 110);
    add('chapel', 2, 150);
    add('stable', 4, 120);
    if (ward === 'artisan') (add('workshop', 26), add('smithy', 6, 100));
    if (ward === 'religious') (add('chapel', 30), add('house_l', 12, 140));
    if (ward === 'merchant') (add('merchant', 22, 140), add('house_l', 10, 140));
    return B.rng.weighted(w.length ? w : [['house', 1]]);
  }
  switch (ward) {
    case 'residential': add('house', 60); add('house_l', 12, 150); add('workshop', 5); add('bakery', 2.5, 90); add('tavern', 1.6, 110); add('smithy', 1.2, 90); add('chapel', 0.5, 170); add('stable', 0.7, 130); break;
    case 'poor': add('hovel', 70); add('house', 20); add('workshop', 3); add('tavern', 1, 100); break;
    case 'merchant': add('merchant', 45, 140); add('house_l', 15, 140); add('house', 10); add('warehouse', 6, 220); add('inn', 3, 180); add('guildhall', 2.5, 320); add('bakery', 2); add('tavern', 2); break;
    case 'noble': add('manor', 50, 300); add('house_l', 16, 160); add('palace', 2.2, 520); add('chapel', 3, 200); add('house', 6); break;
    case 'artisan': add('workshop', 34); add('house', 28); add('smithy', 6, 100); add('bakery', 4, 90); add('house_l', 8, 150); add('tavern', 2, 120); add('guildhall', 1.2, 300); add('stable', 2, 130); break;
    case 'industrial': add('workshop', 28); add('warehouse', 16, 200); add('smithy', 9, 110); add('granary', 4, 260); add('house', 14); add('hovel', 6); add('stable', 2, 130); if (dRiver < 30 && B.mills < 2) add('mill', 40, 140); break;
    case 'harbour': add('warehouse', 32, 180); add('house', 14); add('tavern', 6, 110); add('workshop', 7); add('granary', 5, 240); add('merchant', 6, 160); add('inn', 2.5, 170); break;
    case 'military': add('barracks', 22, 260); add('stable', 10, 150); add('smithy', 7, 110); add('granary', 6, 220); add('house', 12); add('workshop', 5); add('tavern', 3, 110); break;
    case 'religious': add('house_l', 20, 150); add('chapel', 8, 170); add('hospital', 2, 380); add('monastery', 1.4, 420); add('house', 18); add('church', 3, 260); break;
    case 'scholar': add('university', 25, 380); add('house_l', 24, 150); add('house', 12); add('guildhall', 4, 300); add('chapel', 3, 170); break;
    case 'market': add('merchant', 50, 120); add('inn', 5, 170); add('tavern', 6, 110); add('bakery', 4, 90); add('house_l', 10, 130); break;
    case 'citadel': add('barracks', 22, 240); add('stable', 12, 140); add('smithy', 8, 100); add('granary', 8, 200); add('chapel', 4, 160); add('workshop', 6); break;
  }
  if (!w.length) return 'house';
  for (const e of w) {
    if (dGate < 80 && (e[0] === 'inn' || e[0] === 'stable' || e[0] === 'tavern' || e[0] === 'barracks')) e[1] *= 3;
    if (dArt < 18 && (e[0] === 'merchant' || e[0] === 'inn' || e[0] === 'tavern' || e[0] === 'bakery' || e[0] === 'workshop')) e[1] *= 1.6;
    if (dWater < 30 && e[0] === 'warehouse') e[1] *= 3;
    if (dArt > 40 && (e[0] === 'inn' || e[0] === 'guildhall')) e[1] *= 0.3;
  }
  return B.rng.weighted(w);
}

/* ---------- footprint per type ---------- */
function footprint(
  B: BCtx,
  type: BType,
  shrunk: Pt[],
  a: number,
  fillBase: number,
  frontage?: Rect | null
): { parts: Part[]; h: number; wheel?: [number, number, number] } | null {
  const rng = B.rng;
  let rc: Rect;
  if (frontage) {
    rc = frontage;
  } else {
    let wf = 1,
      hf = 1,
      fill = fillBase;
    switch (type) {
      case 'house': wf = rng.range(0.93, 1); hf = rng.range(0.9, 1); break;
      case 'hovel': wf = rng.range(0.7, 0.95); hf = rng.range(0.7, 0.95); break;
      case 'barracks': case 'stable': hf = type === 'stable' ? 0.62 : 0.72; fill = 0.96; break;
      case 'warehouse': case 'granary': fill = 0.97; hf = rng.range(0.8, 0.95); break;
      case 'manor': fill = 0.62; break;
      case 'palace': fill = 0.72; break;
      default: break;
    }
    const fr = fitRect(shrunk, fill, wf, hf);
    if (!fr || fr.w < 3.2 || fr.h < 3) return null;
    rc = clampRect(norm(fr), type);
    if (type === 'hovel' || type === 'house') {
      // slight irregular orientation, only if it still fits
      const jit = (rng.next() - 0.5) * (type === 'hovel' ? 0.3 : 0.07);
      const rr = { ...rc, a: rc.a + jit, w: rc.w * 0.95, h: rc.h * 0.95 };
      const pts = rectPts(rr.cx, rr.cy, rr.w, rr.h, rr.a);
      if ([0, 2, 4, 6].every((i) => pointInConvex([pts[i], pts[i + 1]], shrunk, 0.02))) rc = rr;
    }
  }

  const roof: Roof = rng.chance(0.72) ? 'gable' : 'hip';
  const minD = Math.min(rc.w, rc.h);
  const tall = a > 200 ? 1 : 0;
  // If anchored to street frontage and compact width (<= 12.5m), ridge runs front-to-back so gable faces street!
  const streetGable: 0 | 1 | undefined = frontage && rc.w <= 12.5 ? 1 : undefined;

  switch (type) {
    case 'house': {
      const r = rng.next();
      if (minD > 7.5 && rc.h > 10 && r > 0.68) return { parts: shapeL(rc, rng, roof, r > 0.92), h: rng.int(0, 2) };
      return { parts: [R(rc, 0, 0, rc.w, rc.h, roof, streetGable)], h: rng.int(0, 2) };
    }
    case 'hovel': return { parts: [R(rc, 0, 0, rc.w, rc.h, 'gable', streetGable)], h: 0 };
    case 'house_l': {
      const r = rng.next();
      if (minD > 12 && r > 0.85) return { parts: shapeU(rc, rng, false, roof), h: 1 + tall };
      if (minD > 7 && r > 0.35) return { parts: shapeL(rc, rng, roof, r > 0.75), h: 1 + tall };
      return { parts: [R(rc, 0, 0, rc.w, rc.h, roof, streetGable)], h: 1 + tall };
    }
    case 'merchant': {
      if (minD > 15 && rng.chance(0.4)) return { parts: shapeU(rc, rng, true, 'gable'), h: 2 };
      if (minD > 7 && rng.chance(0.65)) return { parts: shapeL(rc, rng, roof), h: 1 + tall };
      return { parts: [R(rc, 0, 0, rc.w, rc.h, roof, streetGable)], h: 1 + tall };
    }
    case 'manor': {
      if (minD > 14 && rng.chance(0.45)) return { parts: shapeU(rc, rng, false, 'hip'), h: 2 };
      return { parts: shapeL(rc, rng, 'hip', rng.chance(0.3)), h: 2 };
    }
    case 'palace': {
      const parts = minD > 16 ? shapeU(rc, rng, false, 'hip') : [R(rc, 0, 0, rc.w, rc.h, 'hip')];
      parts.push(C(rc, -rc.w / 2 + 3, -rc.h / 2 + 3, 3.2, 'cone'), C(rc, rc.w / 2 - 3, -rc.h / 2 + 3, 3.2, 'cone'));
      return { parts, h: 2 };
    }
    case 'workshop': return { parts: minD > 8 && rng.chance(0.3) ? shapeL(rc, rng, 'gable') : [R(rc, 0, 0, rc.w, rc.h, 'gable', streetGable)], h: rng.int(0, 2) };
    case 'warehouse': return { parts: [R(rc, 0, 0, rc.w, rc.h, 'gable')], h: 1 };
    case 'granary': return { parts: [R(rc, 0, 0, rc.w, rc.h, 'flat')], h: 2 };
    case 'inn': case 'tavern': return { parts: minD > 7 ? shapeL(rc, rng, 'gable') : [R(rc, 0, 0, rc.w, rc.h, 'gable', streetGable)], h: 1 + tall };
    case 'bakery': case 'smithy': case 'stable': case 'barracks': return { parts: [R(rc, 0, 0, rc.w, rc.h, type === 'barracks' ? 'hip' : 'gable', streetGable)], h: type === 'barracks' ? 1 : 0 };
    case 'chapel': return { parts: smallChurch(rc), h: 1 };
    case 'church': return { parts: smallChurch(rc), h: 2 };
    case 'guildhall': return { parts: [R(rc, 0, 0, rc.w, rc.h, 'hip'), C(rc, rc.w / 2 - 3, -rc.h / 2 + 3, 2.6, 'cone')], h: 2 };
    case 'townhall': {
      // hall with an arcaded front wing and a square belfry facing the square
      const bt = clamp(Math.min(rc.w, rc.h) * 0.42, 4.5, 8);
      return { parts: [R(rc, 0, rc.h * 0.08, rc.w, rc.h * 0.84, 'hip', 0), R(rc, 0, -rc.h / 2 + rc.h * 0.12, rc.w * 0.84, rc.h * 0.24, 'flat', 0), R(rc, 0, -rc.h / 2 + bt / 2, bt, bt, 'hip'), C(rc, -rc.w / 2 + 2.6, rc.h / 2 - 2.6, 2.4, 'cone'), C(rc, rc.w / 2 - 2.6, rc.h / 2 - 2.6, 2.4, 'cone')], h: 2 };
    }
    case 'hospital': return { parts: minD > 12 ? shapeU(rc, rng, true, 'hip') : [R(rc, 0, 0, rc.w, rc.h, 'hip')], h: 1 };
    case 'university': return { parts: minD > 14 ? shapeU(rc, rng, true, 'hip') : shapeL(rc, rng, 'hip'), h: 2 };
    case 'monastery': return { parts: minD > 13 ? shapeU(rc, rng, rng.chance(0.5), 'gable') : [R(rc, 0, 0, rc.w, rc.h, 'gable')], h: 1 };
    case 'market_hall': return { parts: [R(rc, 0, 0, rc.w, rc.h, 'hip')], h: 1 };
    case 'barn': {
      // long gabled farm barn with big doors at the gable end
      const parts = [R(rc, 0, 0, rc.w, rc.h, 'gable', 0)];
      if (rc.w > 6) parts.push(R(rc, -rc.w / 2 + 1.2, 0, 2.4, rc.h * 0.42, 'flat', 1));
      return { parts, h: 1 };
    }
    case 'mill': {
      const parts = [R(rc, 0, 0, rc.w, rc.h, 'gable')];
      const r = B.city.river;
      if (r) {
        const n = nearestOn(r.pts, [rc.cx, rc.cy]);
        const d = unit(sub(n.q, [rc.cx, rc.cy]));
        const ext = Math.abs(d[0] * Math.cos(rc.a) + d[1] * Math.sin(rc.a)) * rc.w / 2 + Math.abs(-d[0] * Math.sin(rc.a) + d[1] * Math.cos(rc.a)) * rc.h / 2;
        return { parts, h: 1, wheel: [rc.cx + d[0] * (ext + 1.2), rc.cy + d[1] * (ext + 1.2), Math.atan2(d[1], d[0])] };
      }
      return { parts, h: 1 };
    }
    default: return { parts: [R(rc, 0, 0, rc.w, rc.h, roof, streetGable)], h: 1 };
  }
}

function findFrontageEdge(plot: Pt[], parentEdges?: [Pt, Pt][]): [Pt, Pt] | null {
  if (!parentEdges || !parentEdges.length) return null;
  let bestEdge: [Pt, Pt] | null = null;
  let maxL = 0;
  const n = plot.length;
  for (let i = 0; i < n; i++) {
    const p0 = plot[i],
      p1 = plot[(i + 1) % n];
    const el = dist(p0, p1);
    if (el < 3.8) continue;
    const pm = mid(p0, p1);
    for (const [a, b] of parentEdges) {
      if (segDist(pm, a, b) < 0.28) {
        if (el > maxL) {
          maxL = el;
          bestEdge = [p0, p1];
        }
        break;
      }
    }
  }
  return bestEdge;
}

/* ---------- plot processing ---------- */
function processPlots(B: BCtx, plots: Pt[][], ward: WardType, forced: BType[] = [], parentEdges?: [Pt, Pt][]) {
  const { rng, cell, city } = B;
  const st = styleFor(city, ward);
  const order = forced.length ? plots.map((p, i) => ({ p, i, a: area(p) })).sort((x, y) => y.a - x.a) : plots.map((p, i) => ({ p, i, a: 0 }));
  order.forEach((o, rank) => {
    const plot = o.p;
    const a = area(plot);
    if (a < 26) return;
    const f = forced[rank];
    if (!f && !rng.chance(st.keep)) {
      const y = insetConvex(plot, 0.7);
      if (y.length >= 3 && a > 40) {
        const k = rng.chance(0.55) ? 1 : 0;
        cell.yards.push({ p: flat(y), k });
        if (k && a > 70 && rng.chance(0.5)) {
          const c = centroid(y);
          cell.trees.push(c[0], c[1], rng.range(2.2, 3.6));
        }
      }
      return;
    }

    const c = centroid(plot);
    let dArt = 999;
    for (const [p, q] of B.fronts) dArt = Math.min(dArt, segDist(c, p, q));
    let dWater = 999;
    for (const [p, q] of B.coast) dWater = Math.min(dWater, segDist(c, p, q));
    let dRiver = 999;
    if (city.river) {
      const n = nearestOn(city.river.pts, c);
      dRiver = n.d - city.river.w[Math.min(city.river.w.length - 1, n.i)] / 2;
      dWater = Math.min(dWater, dRiver);
    }
    let dGate = 999;
    for (const g of B.gates) dGate = Math.min(dGate, dist(g, c));
    let type: BType = f ?? pickType(B, ward, a, dArt, dRiver, dWater, dGate);
    if (type === 'mill') B.mills++;

    // Try street-frontage burgage placement first
    let fp: { parts: Part[]; h: number; wheel?: [number, number, number] } | null = null;
    let backyardPoly: Pt[] | undefined = undefined;

    const frontage = findFrontageEdge(plot, parentEdges);
    if (frontage) {
      const targetDepth =
        type === 'merchant'
          ? rng.range(11, 18)
          : type === 'warehouse'
            ? rng.range(12, 22)
            : type === 'hovel'
              ? rng.range(6, 11)
              : type === 'manor' || type === 'palace'
                ? rng.range(14, 24)
                : rng.range(8, 14);
      const sm =
        ward === 'merchant' || ward === 'market' || ward === 'artisan'
          ? rng.range(0.22, 0.45)
          : ward === 'poor'
            ? rng.range(0.18, 0.38)
            : rng.range(0.32, 0.55);
      const dims = TYPE_DIMS[type] ?? [6, 12, 8, 16];
      const depth = clamp(targetDepth, dims[2], dims[3]);
      const fr = fitFrontageRect(plot, frontage[0], frontage[1], depth, sm, 0.32, dims[1]);
      if (fr) {
        fp = footprint(B, type, plot, a, st.fill, fr);
        backyardPoly = fr.backyard;
      }
    }

    // Fallback for awkward / interior lots: still align the building with the nearest street (no random rotations)
    if (!fp && parentEdges && parentEdges.length && type !== 'manor' && type !== 'palace') {
      const pc = centroid(plot);
      let be: [Pt, Pt] | null = null, bd2 = Infinity;
      for (const e of parentEdges) {
        if (dist(e[0], e[1]) < 3) continue;
        const d2 = segDist(pc, e[0], e[1]);
        if (d2 < bd2) (bd2 = d2), (be = e);
      }
      const shrunk = insetConvex(plot, st.gap * 0.8);
      if (be && shrunk.length >= 3 && area(shrunk) >= 22) {
        const ang = Math.atan2(be[1][1] - be[0][1], be[1][0] - be[0][0]);
        const fr = fitRectAngle(shrunk, ang, st.fill);
        if (fr && fr.w >= 3.4 && fr.h >= 3.2 && fr.w * fr.h > 0.45 * area(shrunk)) fp = footprint(B, type, shrunk, area(shrunk), st.fill, fr);
      }
    }
    // Last resort: standard centered OBB in shrunk plot
    if (!fp) {
      const shrunk = insetConvex(plot, st.gap * rng.range(0.6, 1.4));
      if (shrunk.length >= 3 && area(shrunk) >= 22) {
        const sa = area(shrunk);
        fp = footprint(B, type, shrunk, sa, st.fill * rng.range(0.93, 1.0));
        if (!fp && type !== 'house' && type !== 'hovel') {
          type = ward === 'poor' ? 'hovel' : 'house';
          fp = footprint(B, type, shrunk, sa, st.fill);
        }
      }
    }

    if (!fp) return;

    // rear outbuilding (workshop, stable, store) at the back of deep burgage plots
    if (backyardPoly && area(backyardPoly) > 75 && (ward === 'artisan' || ward === 'industrial' || ward === 'merchant' || ward === 'residential' || ward === 'harbour') && rng.chance(0.32)) {
      const yb = insetConvex(backyardPoly, 1.1);
      if (yb.length >= 3) {
        const sr = fitRect(yb, 0.86, rng.range(0.45, 0.65), rng.range(0.4, 0.6));
        if (sr && sr.w > 3 && sr.h > 2.8) {
          const n2 = norm(sr);
          const kind: BType = ward === 'industrial' || ward === 'artisan' ? 'workshop' : ward === 'harbour' ? 'warehouse' : 'stable';
          const shed = commit(B, kind, [R(n2, 0, 0, n2.w, n2.h, 'gable')], ward, 0);
          if (shed) shed.name = undefined;
          backyardPoly = yb;
        }
      }
    }
    if (backyardPoly && area(backyardPoly) > 26) {
      const greens = ward === 'noble' || ward === 'scholar' || (ward === 'residential' && rng.chance(0.3));
      cell.yards.push({ p: flat(backyardPoly), k: greens ? 1 : 0 });
      if (greens && area(backyardPoly) > 55 && rng.chance(0.35)) {
        const bc = centroid(backyardPoly);
        cell.trees.push(bc[0], bc[1], rng.range(2.0, 2.9));
      }
    } else if (ward === 'noble' || type === 'manor' || type === 'palace') {
      const shrunk = insetConvex(plot, st.gap * 0.8);
      if (shrunk.length >= 3) cell.yards.push({ p: flat(shrunk), k: 1 });
    }

    const b = commit(B, type, fp.parts, ward, fp.h, fp.wheel ? { wheel: fp.wheel } : undefined);
    if (b && (type === 'manor' || type === 'palace') && rng.chance(0.7)) {
      const bb = b.bb;
      cell.trees.push(bb[0] - 2.2, bb[1] - 2.2, rng.range(2.2, 3.2));
    }
  });
}

function ring(B: BCtx, region: Pt[], inner: Pt[], ward: WardType, forced: BType[] = [], skip?: (mid: Pt) => boolean) {
  const st = styleFor(B.city, ward);
  const plots: Pt[][] = [];
  const n = region.length;
  const o: SubOpts = { min: st.min * B.mult, lane: 0, laneArea: 1e9, spread: st.spread, var: st.var };
  const forcedQueue = [...forced];
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    const quad: Pt[] = [region[i], region[j], inner[j], inner[i]];
    if (area(quad) < 40) continue;
    if (skip && skip([(region[i][0] + region[j][0]) / 2, (region[i][1] + region[j][1]) / 2])) continue;
    B.cell.blocks.push(flat(quad));
    const parentEdges: [Pt, Pt][] = [
      [region[i], region[j]],
      [inner[j], inner[i]],
    ];
    subdivide(quad, o, B.rng, plots);
    const quadForced: BType[] = [];
    if (forcedQueue.length) quadForced.push(forcedQueue.shift()!);
    processPlots(B, plots, ward, quadForced, parentEdges);
    plots.length = 0;
  }
}

function graves(B: BCtx, inner: Pt[], avoid: [number, number, number, number]) {
  const bb = bbox(inner);
  for (let i = 0; i < 90; i++) {
    const p: Pt = [B.rng.range(bb[0], bb[2]), B.rng.range(bb[1], bb[3])];
    if (!pointInConvex(p, inner, -3.5)) continue;
    if (p[0] > avoid[0] - 3 && p[0] < avoid[2] + 3 && p[1] > avoid[1] - 3 && p[1] < avoid[3] + 3) continue;
    B.cell.graves.push(p[0], p[1]);
  }
  for (let i = 0; i < 14; i++) {
    const p: Pt = [B.rng.range(bb[0], bb[2]), B.rng.range(bb[1], bb[3])];
    if (!pointInConvex(p, inner, -4)) continue;
    if (p[0] > avoid[0] - 6 && p[0] < avoid[2] + 6 && p[1] > avoid[1] - 6 && p[1] < avoid[3] + 6) continue;
    B.cell.trees.push(p[0], p[1], B.rng.range(2.4, 3.8));
  }
}

function centralBuilding(B: BCtx, inner: Pt[], type: BType, ward: WardType, scale = 0.62) {
  const c = centroid(inner);
  const fr = fitRect(homothety(inner, c, scale), 0.96);
  if (!fr) return null;
  const rc = clampRect(norm(fr), type);
  let parts: Part[];
  let h = 2;
  if (type === 'cathedral' || type === 'temple') parts = cathedralParts(rc, type === 'temple', B.rng.int(0, 3));
  else if (type === 'church') parts = smallChurch(rc);
  else if (type === 'keep') {
    const s = Math.min(rc.w, rc.h, 34);
    const kr = { ...rc, w: s, h: s * 0.92 };
    const kv = B.city.resolved.squareTowers ? 0 : B.rng.int(0, 3);
    if (kv === 1) {
      // round shell keep with an inner tower
      parts = [C(kr, 0, 0, s * 0.5, 'flat'), C(kr, 0, 0, s * 0.3, 'cone')];
    } else if (kv === 2) {
      // hall keep: long stone hall + great tower at one end
      parts = [R(kr, -s * 0.12, 0, s * 1.05, s * 0.52, 'hip', 0), R(kr, s * 0.32, 0, s * 0.48, s * 0.48, 'flat'), R(kr, s * 0.32, 0, s * 0.26, s * 0.26, 'hip')];
    } else {
      parts = [R(kr, 0, 0, kr.w, kr.h, 'flat'), R(kr, 0, 0, kr.w * 0.52, kr.h * 0.52, 'hip')];
      for (const [su, sv] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) parts.push(C(kr, (su * kr.w) / 2, (sv * kr.h) / 2, s * 0.15, 'cone'));
    }
  } else if (type === 'palace') parts = shapeU(rc, B.rng, false, 'hip').concat([C(rc, -rc.w / 2 + 3, -rc.h / 2 + 3, 3.4, 'cone'), C(rc, rc.w / 2 - 3, -rc.h / 2 + 3, 3.4, 'cone')]);
  else if (type === 'manor') parts = shapeL(rc, B.rng, 'hip');
  else {
    parts = [R(rc, 0, 0, rc.w, rc.h, 'hip')];
    h = 1;
  }
  return commit(B, type, parts, ward, h);
}

/* ---------- layouts ---------- */
function layoutMarket(B: BCtx, region: Pt[]) {
  const { cell, rng, city } = B;
  const c = centroid(region);
  const inner = homothety(region, c, area(region) > 5000 ? 0.58 : 0.5);
  cell.open.push({ poly: flat(inner), kind: 'plaza' });
  ring(B, region, inner, 'market', ['townhall', 'guildhall', 'inn']);
  let hall: Building | null = null;
  if (rng.chance(0.5) && area(inner) > 1100) hall = centralBuilding(B, inner, 'market_hall', 'market', 0.4);
  if (!hall) city.features.push({ id: city.nextId++, type: 'fountain', p: c, cell: cell.id });
  // market stalls in tidy rows aligned to the longer axis of the square, avoiding the hall and the central monument
  const bb = bbox(inner);
  const axis = bb[2] - bb[0] >= bb[3] - bb[1] ? 0 : 1;
  const sp = homothety(inner, c, 0.86);
  const rows = 2 + (area(inner) > 2400 ? 1 : 0);
  const across = axis === 0 ? bb[3] - bb[1] : bb[2] - bb[0];
  for (let r = 0; r < rows; r++) {
    const off = ((r + 0.5) / rows - 0.5) * across * 0.66;
    for (let k = -8; k <= 8; k++) {
      const along = k * (axis === 0 ? (bb[2] - bb[0]) : bb[3] - bb[1]) * 0.062;
      if (!along) continue;
      const p: Pt = axis === 0 ? [c[0] + along, c[1] + off] : [c[0] + off, c[1] + along];
      if (!pointInConvex(p, sp, 4)) continue;
      if (dist(p, c) < 11) continue;
      if (hall && p[0] > hall.bb[0] - 5 && p[0] < hall.bb[2] + 5 && p[1] > hall.bb[1] - 5 && p[1] < hall.bb[3] + 5) continue;
      cell.stalls.push(p[0], p[1], 5.2, 3.2, axis === 0 ? Math.PI / 2 : 0, rng.int(0, 6));
    }
  }
}

function layoutCathedral(B: BCtx, region: Pt[]) {
  const { cell, city } = B;
  const c = centroid(region);
  const inner = homothety(region, c, 0.72);
  cell.open.push({ poly: flat(inner), kind: 'yard' });
  ring(B, region, inner, 'religious');
  const b = centralBuilding(B, inner, city.params.identity === 'ancient' ? 'temple' : 'cathedral', 'religious', 0.84);
  if (b) {
    b.name = nameFor(b.type, B.rng);
    graves(B, inner, b.bb);
    // precinct: cloister and hospital flanking the nave, with a walkable close around them
    const bb = b.bb;
    const along: Pt = bb[2] - bb[0] >= bb[3] - bb[1] ? [1, 0] : [0, 1];
    const perp: Pt = [-along[1], along[0]];
    const cc: Pt = [(bb[0] + bb[2]) / 2, (bb[1] + bb[3]) / 2];
    const half = (Math.abs(perp[0]) * (bb[2] - bb[0]) + Math.abs(perp[1]) * (bb[3] - bb[1])) / 2;
    for (const side of [-1, 1]) {
      const off = half + 15;
      const q: Pt = [cc[0] + perp[0] * off * side, cc[1] + perp[1] * off * side];
      if (!pointInConvex(q, inner, 8)) continue;
      const ring2: Pt[] = unflat(octagon(q[0], q[1], 8.5));
      const cloister = centralBuilding(B, ring2, side > 0 ? 'monastery' : 'hospital', 'religious', 0.82);
      if (cloister) B.cell.yards.push({ p: octagon(q[0], q[1], 10), k: 1 });
      for (let t = -1; t <= 1; t++) {
        const tp: Pt = [q[0] + along[0] * t * 12, q[1] + along[1] * t * 12];
        if (t && pointInConvex(tp, inner, 6)) B.cell.trees.push(tp[0], tp[1], 2.2);
      }
    }
  }
}

function layoutChurch(B: BCtx, region: Pt[]) {
  const { cell, rng } = B;
  const c = centroid(region);
  const inner = homothety(region, c, rng.range(0.5, 0.62));
  cell.open.push({ poly: flat(inner), kind: 'yard' });
  ring(B, region, inner, 'religious', ['church']);
  const b = centralBuilding(B, inner, 'church', 'religious', 0.5);
  if (b) {
    b.name = nameFor('church', rng);
    graves(B, inner, b.bb);
  }
}

function layoutCastle(B: BCtx, region: Pt[]) {
  const { cell, city, rng } = B;
  const wall = insetConvex(region, 3.6);
  const bailey = wall.length >= 3 ? insetConvex(wall, 3.4) : [];
  if (bailey.length < 3) return false;
  const mc = city.cells[city.marketCell].center;
  let gi = -1,
    gd = Infinity;
  for (let i = 0; i < wall.length; i++) {
    const a = wall[i],
      b = wall[(i + 1) % wall.length];
    const L = dist(a, b);
    if (L < 20) continue;
    const m: Pt = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    const d = dist(m, mc);
    if (d < gd) (gd = d), (gi = i);
  }
  if (gi < 0) gi = 0;
  const ga = wall[gi],
    gb = wall[(gi + 1) % wall.length];
  const gl = dist(ga, gb) || 1;
  const gm: Pt = [(ga[0] + gb[0]) / 2, (ga[1] + gb[1]) / 2];
  const towers: number[] = [];
  for (const p of wall) towers.push(p[0], p[1], 6.2);
  cell.fort = { wall: flat(wall), towers, gate: [gm[0], gm[1], (gb[1] - ga[1]) / gl, -(gb[0] - ga[0]) / gl] };
  cell.open.push({ poly: flat(bailey), kind: 'bailey' });
  const c = centroid(bailey);
  const inner = homothety(bailey, c, 0.6);
  if (area(bailey) > 1500) ring(B, bailey, inner, 'citadel', [], (m) => dist(m, gm) < 26);
  const kr = homothety(inner, centroid(inner), 0.55);
  const keep = centralBuilding(B, kr, 'keep', 'citadel', 0.95);
  if (keep) keep.name = 'Keep';
  void rng;
  return true;
}

function layoutRing(B: BCtx, region: Pt[]) {
  const { cell, rng, city } = B;
  const ward = cell.ward ?? 'residential';
  const c = centroid(region);
  const inner = homothety(region, c, (ward === 'military' ? rng.range(0.62, 0.7) : rng.range(0.68, 0.74)));
  const kind = ward === 'scholar' ? 'lawn' : ward === 'military' ? 'parade' : ward === 'religious' ? 'cloister' : 'garden';
  cell.open.push({ poly: flat(inner), kind });
  ring(B, region, inner, ward);
  if (ward === 'religious') {
    const b = centralBuilding(B, inner, 'church', ward, 0.55);
    if (b) b.name = nameFor('church', rng);
  } else if (ward === 'noble') {
    centralBuilding(B, inner, city.params.identity === 'royal' ? 'palace' : 'manor', ward, 0.52);
  } else if (ward === 'scholar') {
    city.features.push({ id: city.nextId++, type: rng.chance(0.5) ? 'statue' : 'fountain', p: c, cell: cell.id });
  }
}

function dedupe(B: BCtx) {
  const list = B.made;
  const polys = list.map((b) => b.parts.map(partPoly));
  const dead = new Set<number>();
  for (let i = 0; i < list.length; i++) {
    if (dead.has(i)) continue;
    for (let j = i + 1; j < list.length; j++) {
      if (dead.has(j)) continue;
      const a = list[i].bb,
        b = list[j].bb;
      if (a[2] < b[0] || b[2] < a[0] || a[3] < b[1] || b[3] < a[1]) continue;
      let hit = false;
      for (const pa of polys[i]) {
        for (const pb of polys[j]) if (satOverlap(pa, pb, 0.28)) hit = true;
        if (hit) break;
      }
      if (hit) {
        dead.add(j);
        B.stats.dropped++;
      }
    }
  }
  B.made = list.filter((_, i) => !dead.has(i));
}

/** Global safety net: any pair of overlapping buildings is repaired by shrinking, never by deleting silently. */
export function repairOverlaps(city: City, stats: Stats) {
  const polys = new Map<number, number[][]>();
  for (const bld of city.buildings) polys.set(bld.id, bld.parts.map(partPoly));
  const victims = new Set<number>();
  for (let i = 0; i < city.buildings.length; i++) {
    const a = city.buildings[i];
    for (let j = i + 1; j < city.buildings.length; j++) {
      const c = city.buildings[j];
      if (a.bb[2] < c.bb[0] || c.bb[2] < a.bb[0] || a.bb[3] < c.bb[1] || c.bb[3] < a.bb[1]) continue;
      let hit = false;
      for (const pa of polys.get(a.id)!) for (const pb of polys.get(c.id)!) if (satOverlap(pa, pb, 0.02)) hit = true;
      if (!hit) continue;
      // shrink the smaller footprint until the pair separates
      const target = (a.bb[2] - a.bb[0]) * (a.bb[3] - a.bb[1]) <= (c.bb[2] - c.bb[0]) * (c.bb[3] - c.bb[1]) ? a : c;
      const other = target === a ? c : a;
      const contained =
        target.bb[0] >= other.bb[0] - 0.5 && target.bb[1] >= other.bb[1] - 0.5 && target.bb[2] <= other.bb[2] + 0.5 && target.bb[3] <= other.bb[3] + 0.5;
      if (contained) {
        // one building sits inside the other: shrinking cannot separate them
        victims.add(target.id);
        stats.dropped++;
        continue;
      }
      for (let k = 0; k < 8; k++) {
        target.parts = scaleParts(target.parts, 0.86);
        target.bb = bbOf(target.parts);
        polys.set(target.id, target.parts.map(partPoly));
        let still = false;
        for (const pa of polys.get(a.id)!) for (const pb of polys.get(c.id)!) if (satOverlap(pa, pb, 0.02)) still = true;
        if (!still) break;
        stats.repaired++;
      }
      // last resort: drop the smaller of the two rather than ship an overlap
      let still = false;
      for (const pa of polys.get(a.id)!) for (const pb of polys.get(c.id)!) if (satOverlap(pa, pb, 0.02)) still = true;
      if (still) {
        victims.add(target.id);
        stats.dropped++;
      }
      invalidate(target);
    }
  }
  // removals happen after the sweep so the indices stay valid
  if (victims.size) {
    city.buildings = city.buildings.filter((x) => !victims.has(x.id));
    for (const id of victims) polys.delete(id);
  }
}

/** (Re)build everything inside one cell: blocks, plots, buildings, decorations. Other cells untouched. */
export function buildCell(city: City, cell: Cell, stats: Stats) {
  city.buildings = city.buildings.filter((b) => b.cell !== cell.id || b.manual);
  city.features = city.features.filter((f) => f.cell !== cell.id);
  cell.blocks = [];
  cell.open = [];
  cell.yards = [];
  cell.trees = [];
  cell.stalls = [];
  cell.graves = [];
  cell.fort = undefined;
  if (cell.kind !== 'city' || cell.vids.length < 3) return;
  const rng = new RNG(`${city.seedUsed}|cell${cell.id}|v${cell.variant}`);
  const ward = cell.ward ?? 'residential';
  const n = cell.vids.length;
  const fronts: [Pt, Pt][] = [];
  const coast: [Pt, Pt][] = [];
  for (let i = 0; i < n; i++) {
    const a = city.verts[cell.vids[i]],
      b = city.verts[cell.vids[(i + 1) % n]];
    const cls = city.edges[edgeKey(cell.vids[i], cell.vids[(i + 1) % n])];
    if (cls === 'arterial' || cls === 'secondary') fronts.push([a, b]);
    if (cls === 'coast') coast.push([a, b]);
  }
  for (const c of cell.cuts) fronts.push([c.a, c.b]);
  const segs: [Pt, Pt, number][] = [];
  for (let i = 0; i < n; i++) {
    const a = city.verts[cell.vids[i]],
      b2 = city.verts[cell.vids[(i + 1) % n]];
    const cls = city.edges[edgeKey(cell.vids[i], cell.vids[(i + 1) % n])];
    if (cls === 'minor' || cls === 'secondary' || cls === 'arterial') segs.push([a, b2, (city.ew[edgeKey(cell.vids[i], cell.vids[(i + 1) % n])] ?? 4) / 2]);
    else if (cls === 'wallO') segs.push([a, b2, WALL_T.outer / 2]);
    else if (cls === 'wallI') segs.push([a, b2, WALL_T.inner / 2]);
  }
  const bd = city.params.buildingDensity;
  const B: BCtx = {
    city, cell, rng, stats, fronts, coast, made: [], mills: 0, segs,
    mult: lerp(1.05, 0.45, bd),
    gates: city.gates.map((g) => g.p),
  };
  const pieces = cellPieces(city, cell);
  if (pieces.length) {
    let done = false;
    if (pieces.length === 1) {
      const reg = pieces[0];
      if (cell.layout === 'market') (layoutMarket(B, reg), (done = true));
      else if (cell.layout === 'cathedral') (layoutCathedral(B, reg), (done = true));
      else if (cell.layout === 'church') (layoutChurch(B, reg), (done = true));
      else if (cell.layout === 'castle') done = layoutCastle(B, reg);
      else if (cell.layout === 'ring' && area(reg) > 2400) (layoutRing(B, reg), (done = true));
    }
    if (!done) {
      const st = styleFor(city, ward);
      const o: SubOpts = { min: st.min * B.mult, lane: 0, laneArea: 1e9, spread: st.spread, var: st.var };
      for (const p of pieces) {
        cell.blocks.push(flat(p));
        const plots: Pt[][] = [];
        subdivide(p, o, rng, plots);
        const parentEdges: [Pt, Pt][] = p.map((v: Pt, i: number) => [v, p[(i + 1) % p.length]]);
        processPlots(B, plots, ward, [], parentEdges);
      }
    }
  }
  dedupe(B);
  // keep manually-placed buildings that are still in this cell (they stay as-is)
  city.buildings.push(...B.made);
}

/** Footprint for a manually placed building (rect centred at rc). */
export function manualParts(type: BType, rc: Rect, rng: RNG): Part[] {
  switch (type) {
    case 'church': case 'chapel': return smallChurch(rc);
    case 'cathedral': return cathedralParts(rc, false);
    case 'temple': return cathedralParts(rc, true);
    case 'inn': case 'tavern': case 'merchant': case 'house_l': case 'manor': return Math.min(rc.w, rc.h) > 7 ? shapeL(rc, rng, 'gable') : [R(rc, 0, 0, rc.w, rc.h, 'gable')];
    case 'palace': case 'university': case 'hospital': case 'monastery': return Math.min(rc.w, rc.h) > 14 ? shapeU(rc, rng, type !== 'palace', 'hip') : [R(rc, 0, 0, rc.w, rc.h, 'hip')];
    case 'townhall': case 'guildhall': return [R(rc, 0, 0, rc.w, rc.h, 'hip'), C(rc, rc.w / 2 - 3, -rc.h / 2 + 3, 2.6, 'cone')];
    case 'granary': return [R(rc, 0, 0, rc.w, rc.h, 'flat')];
    case 'keep': return [R(rc, 0, 0, rc.w, rc.h, 'flat'), R(rc, 0, 0, rc.w * 0.5, rc.h * 0.5, 'hip')];
    default: return [R(rc, 0, 0, rc.w, rc.h, rng.chance(0.7) ? 'gable' : 'hip')];
  }
}
export const TYPE_SIZE: Record<string, [number, number]> = {
  house: [9, 11], hovel: [7, 8], house_l: [12, 15], merchant: [13, 16], workshop: [10, 13], warehouse: [14, 24], inn: [14, 16], tavern: [12, 14],
  market_hall: [14, 24], church: [22, 12], cathedral: [60, 36], temple: [40, 22], guildhall: [18, 22], barracks: [30, 12], stable: [22, 9], mill: [11, 13],
  smithy: [9, 10], bakery: [9, 11], townhall: [24, 20], palace: [34, 30], keep: [26, 26], granary: [16, 20], hospital: [24, 22], university: [30, 28],
  monastery: [26, 22], manor: [18, 20], chapel: [14, 8],
};
