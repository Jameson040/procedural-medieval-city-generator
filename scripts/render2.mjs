// scripts/render2.ts
import { writeFileSync } from "fs";

// src/engine/params.ts
var IDENTITIES = [
  {
    id: "capital",
    label: "Dense Medieval Capital",
    blurb: "Crowded, double-walled heart of a kingdom.",
    geo: "plains",
    river: true,
    harbour: false,
    walls: "double",
    moat: false,
    gates: 5,
    bastions: false,
    squareTowers: false,
    style: "tile",
    ward: { residential: 5, merchant: 3, noble: 3, artisan: 3, religious: 2, scholar: 1.5, military: 1.5, poor: 2, industrial: 1 },
    densityBonus: 0.15,
    windmills: 2,
    citadel: "edge",
    sacred: "cathedral",
    poor: 0.5
  },
  {
    id: "merchant",
    label: "Walled Merchant City",
    blurb: "Warehouses, guilds and a great market square.",
    geo: "plains",
    river: true,
    harbour: true,
    walls: "outer",
    moat: false,
    gates: 5,
    bastions: false,
    squareTowers: false,
    style: "timber",
    ward: { merchant: 5, residential: 4, artisan: 3, noble: 1.5, religious: 1.5, poor: 1.5, industrial: 1.5, military: 1 },
    densityBonus: 0.05,
    windmills: 2,
    citadel: "edge",
    sacred: "cathedral",
    poor: 0.4
  },
  {
    id: "riverport",
    label: "River-Port City",
    blurb: "Quays and warehouses on a navigable river.",
    geo: "plains",
    river: true,
    harbour: true,
    walls: "outer",
    moat: false,
    gates: 4,
    bastions: false,
    squareTowers: false,
    style: "timber",
    ward: { merchant: 4, harbour: 3, residential: 4, artisan: 3, industrial: 2, religious: 1.5, poor: 2, noble: 1, military: 1 },
    densityBonus: 0.05,
    windmills: 1,
    citadel: "water",
    sacred: "cathedral",
    poor: 0.45
  },
  {
    id: "coastal",
    label: "Coastal Trading City",
    blurb: "A bay harbour with piers, fleets and sea walls.",
    geo: "coast",
    river: false,
    harbour: true,
    walls: "outer",
    moat: false,
    gates: 4,
    bastions: false,
    squareTowers: false,
    style: "terracotta",
    ward: { merchant: 4, residential: 4, harbour: 3, artisan: 2, noble: 1.5, religious: 1.5, poor: 2, military: 1.5 },
    densityBonus: 0.05,
    windmills: 1,
    citadel: "water",
    sacred: "cathedral",
    poor: 0.45
  },
  {
    id: "hilltop",
    label: "Hilltop Fortress City",
    blurb: "A citadel crowning the highest ground.",
    geo: "hills",
    river: false,
    harbour: false,
    walls: "outer",
    moat: false,
    gates: 3,
    bastions: true,
    squareTowers: true,
    style: "slate",
    ward: { military: 4, residential: 4, noble: 2, artisan: 2, religious: 1.5, poor: 2, merchant: 1.5 },
    densityBonus: 0,
    windmills: 1,
    citadel: "high",
    sacred: "cathedral",
    poor: 0.5
  },
  {
    id: "royal",
    label: "Royal Administrative City",
    blurb: "Palaces, scholars and orderly noble quarters.",
    geo: "plains",
    river: true,
    harbour: false,
    walls: "outer",
    moat: false,
    gates: 4,
    bastions: false,
    squareTowers: false,
    style: "stone",
    ward: { noble: 5, scholar: 3, merchant: 2.5, residential: 4, religious: 2, military: 2, artisan: 2, poor: 1 },
    densityBonus: 0,
    windmills: 1,
    citadel: "centre",
    sacred: "cathedral",
    poor: 0.3
  },
  {
    id: "industrial",
    label: "Industrial Medieval City",
    blurb: "Mills, forges and tanneries along the water.",
    geo: "plains",
    river: true,
    harbour: false,
    walls: "outer",
    moat: false,
    gates: 4,
    bastions: false,
    squareTowers: false,
    style: "slate",
    ward: { industrial: 5, artisan: 4, residential: 4, poor: 3, merchant: 2, religious: 1, military: 1 },
    densityBonus: 0.1,
    windmills: 3,
    citadel: "edge",
    sacred: "cathedral",
    poor: 0.6
  },
  {
    id: "religious",
    label: "Religious City",
    blurb: "A great cathedral, monasteries and pilgrims.",
    geo: "plains",
    river: true,
    harbour: false,
    walls: "outer",
    moat: false,
    gates: 4,
    bastions: false,
    squareTowers: false,
    style: "stone",
    ward: { religious: 6, residential: 4, scholar: 2.5, artisan: 2, merchant: 2, noble: 1.5, poor: 1.5 },
    densityBonus: 0,
    windmills: 1,
    citadel: "edge",
    sacred: "cathedral",
    poor: 0.3
  },
  {
    id: "mountain",
    label: "Mountain-Pass City",
    blurb: "A tight walled town guarding a high pass.",
    geo: "mountain",
    river: true,
    harbour: false,
    walls: "outer",
    moat: false,
    gates: 2,
    bastions: true,
    squareTowers: true,
    style: "slate",
    ward: { military: 3.5, residential: 4, artisan: 2.5, merchant: 2, poor: 2.5, religious: 1.5, noble: 1 },
    densityBonus: 0.05,
    windmills: 0,
    citadel: "high",
    sacred: "cathedral",
    poor: 0.55
  },
  {
    id: "ancient",
    label: "Ancient Fortified City",
    blurb: "Old double walls, a moat, temples and bastions.",
    geo: "plains",
    river: true,
    harbour: false,
    walls: "double",
    moat: true,
    gates: 4,
    bastions: true,
    squareTowers: true,
    style: "terracotta",
    ward: { military: 3, residential: 4, religious: 3, noble: 2, artisan: 2, merchant: 2, poor: 1.5, scholar: 1 },
    densityBonus: 0.05,
    windmills: 0,
    citadel: "high",
    sacred: "temple",
    poor: 0.4
  }
];
var identityOf = (id) => IDENTITIES.find((i) => i.id === id) ?? IDENTITIES[0];
var WARD_LABEL = {
  citadel: "Royal Citadel",
  market: "Grand Market",
  noble: "Noble Quarter",
  merchant: "Merchant Quarter",
  residential: "Residential Quarter",
  artisan: "Artisan Quarter",
  industrial: "Industrial Quarter",
  religious: "Religious Quarter",
  harbour: "Harbour District",
  military: "Military Quarter",
  poor: "Poor Quarter",
  scholar: "University Quarter"
};
var DEFAULT_PARAMS = {
  seed: "Aldermoor",
  population: 6500,
  name: "",
  identity: "merchant",
  geography: "auto",
  river: "auto",
  riverWidth: 18,
  harbour: "auto",
  cityDensity: 0.55,
  buildingDensity: 0.55,
  roadComplexity: 0.5,
  districtCount: 8,
  walls: "auto",
  moat: "auto",
  terrain: 0.5
};
function resolveParams(p) {
  const id = identityOf(p.identity);
  const geo = p.geography === "auto" ? id.geo : p.geography;
  const walls = p.walls === "auto" ? id.walls : p.walls;
  return {
    geo,
    river: false,
    harbour: false,
    walls,
    moat: false,
    gates: id.gates,
    bastions: id.bastions,
    squareTowers: id.squareTowers,
    style: id.style
  };
}
var PRE = ["Ald", "Bran", "Cael", "Dor", "Eld", "Fal", "Gar", "Hal", "Iron", "Kor", "Lor", "Mar", "Nor", "Os", "Pel", "Rav", "Stor", "Thorn", "Val", "Wyn", "Ash", "Brook", "Crow", "Dun", "Elm", "Frost", "Gold", "High", "Lion", "Oak", "Salt", "Silver", "Stone", "Wolf"];
var SUF = ["ford", "haven", "mere", "wick", "burg", "stead", "gate", "bridge", "crest", "hold", "port", "minster", "moor", "watch", "vale", "wall", "ton", "brook"];
function cityName(rng) {
  return rng.pick(PRE) + rng.pick(SUF);
}
function placeWord(rng) {
  return rng.pick(PRE) + (rng.chance(0.5) ? rng.pick(SUF) : "");
}
var SAINTS = ["Aldric", "Brigid", "Cuthbert", "Edmund", "Giles", "Hilda", "Martin", "Odo", "Swithin", "Wulfstan", "Ansgar", "Clement", "Eadburh", "Leofric"];
var GODS = ["Aurelia", "Tharos", "Vesper", "Solenne", "Karun"];

// src/engine/rng.ts
function hashStr(s) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  h ^= h >>> 13;
  h = Math.imul(h, 1540483477);
  h ^= h >>> 15;
  return h >>> 0;
}
var RNG = class _RNG {
  s;
  constructor(seed2) {
    this.s = (typeof seed2 === "string" ? hashStr(seed2) : seed2 >>> 0) || 2654435769;
    for (let i = 0; i < 4; i++) this.next();
  }
  next() {
    this.s = this.s + 1831565813 >>> 0;
    let t = this.s;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
  range(a, b) {
    return a + (b - a) * this.next();
  }
  int(a, b) {
    return Math.floor(this.range(a, b));
  }
  chance(p) {
    return this.next() < p;
  }
  pick(arr) {
    return arr[Math.floor(this.next() * arr.length) % arr.length];
  }
  normal() {
    return (this.next() + this.next() + this.next() + this.next() - 2) * 1.732;
  }
  weighted(items) {
    let tot = 0;
    for (const it of items) tot += Math.max(0, it[1]);
    if (tot <= 0) return items[0][0];
    let r2 = this.next() * tot;
    for (const it of items) {
      r2 -= Math.max(0, it[1]);
      if (r2 <= 0) return it[0];
    }
    return items[items.length - 1][0];
  }
  fork(label) {
    return new _RNG(hashStr(this.s + ":" + label));
  }
};
var Noise = class {
  seed;
  constructor(seed2) {
    this.seed = seed2 | 0;
  }
  h(ix, iy) {
    let h = Math.imul(ix, 374761393) + Math.imul(iy, 668265263) + Math.imul(this.seed, 1442695041);
    h = Math.imul(h ^ h >>> 13, 1274126177);
    return ((h ^ h >>> 16) >>> 0) / 4294967296;
  }
  get(x, y) {
    const ix = Math.floor(x), iy = Math.floor(y);
    const fx = x - ix, fy = y - iy;
    const u4 = fx * fx * (3 - 2 * fx), v2 = fy * fy * (3 - 2 * fy);
    const a = this.h(ix, iy), b = this.h(ix + 1, iy), c = this.h(ix, iy + 1), d = this.h(ix + 1, iy + 1);
    return a + (b - a) * u4 + (c - a) * v2 + (a - b - c + d) * u4 * v2;
  }
  fbm(x, y, oct = 4) {
    let s = 0, a = 0.5, f2 = 1, n = 0;
    for (let i = 0; i < oct; i++) {
      s += a * this.get(x * f2, y * f2);
      n += a;
      a *= 0.5;
      f2 *= 2.03;
    }
    return s / n;
  }
};
var hash01 = (s) => hashStr(s) / 4294967296;

// src/engine/geom.ts
var clamp = (v2, a, b) => Math.max(a, Math.min(b, v2));
var lerp = (a, b, t) => a + (b - a) * t;
var smooth = (a, b, v2) => {
  const t = clamp((v2 - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
var dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
var sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
var add = (a, b) => [a[0] + b[0], a[1] + b[1]];
var mul = (a, k) => [a[0] * k, a[1] * k];
var mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
var unit = (a) => {
  const l = Math.hypot(a[0], a[1]) || 1;
  return [a[0] / l, a[1] / l];
};
function area(poly2) {
  let s = 0;
  for (let i = 0, n = poly2.length; i < n; i++) {
    const a = poly2[i], b = poly2[(i + 1) % n];
    s += a[0] * b[1] - b[0] * a[1];
  }
  return s / 2;
}
function centroid(poly2) {
  let a = 0, cx = 0, cy = 0;
  const n = poly2.length;
  for (let i = 0; i < n; i++) {
    const p = poly2[i], q = poly2[(i + 1) % n];
    const f2 = p[0] * q[1] - q[0] * p[1];
    a += f2;
    cx += (p[0] + q[0]) * f2;
    cy += (p[1] + q[1]) * f2;
  }
  if (Math.abs(a) < 1e-9) {
    let mx = 0, my = 0;
    for (const p of poly2) {
      mx += p[0];
      my += p[1];
    }
    return [mx / (n || 1), my / (n || 1)];
  }
  return [cx / (3 * a), cy / (3 * a)];
}
function bbox(poly2, flat2 = false) {
  let x02 = Infinity, y02 = Infinity, x12 = -Infinity, y12 = -Infinity;
  if (flat2) {
    const f2 = poly2;
    for (let i = 0; i < f2.length; i += 2) {
      x02 = Math.min(x02, f2[i]);
      x12 = Math.max(x12, f2[i]);
      y02 = Math.min(y02, f2[i + 1]);
      y12 = Math.max(y12, f2[i + 1]);
    }
  } else {
    for (let i = 0; i < poly2.length; i++) {
      const p = poly2[i];
      x02 = Math.min(x02, p[0]);
      x12 = Math.max(x12, p[0]);
      y02 = Math.min(y02, p[1]);
      y12 = Math.max(y12, p[1]);
    }
  }
  return [x02, y02, x12, y12];
}
function pointInPoly(p, poly2) {
  let inside = false;
  for (let i = 0, j = poly2.length - 1; i < poly2.length; j = i++) {
    const a = poly2[i], b = poly2[j];
    if (a[1] > p[1] !== b[1] > p[1] && p[0] < (b[0] - a[0]) * (p[1] - a[1]) / (b[1] - a[1]) + a[0]) inside = !inside;
  }
  return inside;
}
function pointInConvex(p, poly2, eps = 0) {
  for (let i = 0, n = poly2.length; i < n; i++) {
    const a = poly2[i], b = poly2[(i + 1) % n];
    const cr = (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]);
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    if (cr / l < -eps) return false;
  }
  return true;
}
function cleanPoly(poly2, eps = 1e-3) {
  const out2 = [];
  for (const p of poly2) {
    const q = out2[out2.length - 1];
    if (!q || Math.abs(q[0] - p[0]) > eps || Math.abs(q[1] - p[1]) > eps) out2.push(p);
  }
  while (out2.length > 1 && Math.abs(out2[0][0] - out2[out2.length - 1][0]) <= eps && Math.abs(out2[0][1] - out2[out2.length - 1][1]) <= eps) out2.pop();
  return out2;
}
function clipPlane(poly2, nx, ny, c) {
  const out2 = [];
  const n = poly2.length;
  for (let i = 0; i < n; i++) {
    const a = poly2[i], b = poly2[(i + 1) % n];
    const da2 = nx * a[0] + ny * a[1] - c, db = nx * b[0] + ny * b[1] - c;
    if (da2 >= 0) out2.push(a);
    if (da2 >= 0 !== db >= 0) {
      const t = da2 / (da2 - db);
      out2.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
    }
  }
  return cleanPoly(out2);
}
function insetConvex(poly2, d) {
  let out2 = poly2;
  const n = poly2.length;
  for (let i = 0; i < n; i++) {
    const dd = typeof d === "number" ? d : d[i];
    if (!dd) continue;
    const a = poly2[i], b = poly2[(i + 1) % n];
    const ex = b[0] - a[0], ey = b[1] - a[1];
    const L2 = Math.hypot(ex, ey);
    if (L2 < 1e-9) continue;
    const nx = -ey / L2, ny = ex / L2;
    out2 = clipPlane(out2, nx, ny, nx * a[0] + ny * a[1] + dd);
    if (out2.length < 3) return [];
  }
  return out2.length >= 3 ? out2 : [];
}
function splitConvex(poly2, p, d, gap) {
  const nx = -d[1], ny = d[0];
  const c = nx * p[0] + ny * p[1];
  const A = clipPlane(poly2, nx, ny, c + gap / 2);
  const B2 = clipPlane(poly2, -nx, -ny, -c + gap / 2);
  return [A.length >= 3 ? A : [], B2.length >= 3 ? B2 : []];
}
function rayHit(poly2, o, d) {
  let best = null;
  const n = poly2.length;
  for (let i = 0; i < n; i++) {
    const a = poly2[i], b = poly2[(i + 1) % n];
    const ex = b[0] - a[0], ey = b[1] - a[1];
    const den = d[0] * ey - d[1] * ex;
    if (Math.abs(den) < 1e-12) continue;
    const ox = a[0] - o[0], oy = a[1] - o[1];
    const t = (ox * ey - oy * ex) / den;
    const s = (ox * d[1] - oy * d[0]) / den;
    if (t > 1e-3 && s >= -1e-9 && s <= 1 + 1e-9 && (!best || t < best.t)) best = { t, i, s, p: [o[0] + d[0] * t, o[1] + d[1] * t] };
  }
  return best;
}
function clipLineConvex(poly2, o, d) {
  let t0 = -1e9, t1 = 1e9;
  const n = poly2.length;
  for (let i = 0; i < n; i++) {
    const a = poly2[i], b = poly2[(i + 1) % n];
    const nx = -(b[1] - a[1]), ny = b[0] - a[0];
    const num = nx * (o[0] - a[0]) + ny * (o[1] - a[1]);
    const den = nx * d[0] + ny * d[1];
    if (Math.abs(den) < 1e-12) {
      if (num < 0) return null;
    } else {
      const t = -num / den;
      if (den > 0) t0 = Math.max(t0, t);
      else t1 = Math.min(t1, t);
    }
  }
  return t0 < t1 ? [t0, t1] : null;
}
function homothety(poly2, c, k) {
  return poly2.map((p) => [c[0] + (p[0] - c[0]) * k, c[1] + (p[1] - c[1]) * k]);
}
function rectPts(cx, cy, w, h, a) {
  const c = Math.cos(a), s = Math.sin(a);
  const hw = w / 2, hh = h / 2;
  const pts = [];
  for (const [u4, v2] of [
    [-hw, -hh],
    [hw, -hh],
    [hw, hh],
    [-hw, hh]
  ]) {
    pts.push(cx + u4 * c - v2 * s, cy + u4 * s + v2 * c);
  }
  return pts;
}
function obb(poly2) {
  let best = null;
  let bestA = Infinity;
  const n = poly2.length;
  for (let i = 0; i < n; i++) {
    const a = poly2[i], b = poly2[(i + 1) % n];
    const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
    const c = Math.cos(ang), s = Math.sin(ang);
    let u0 = Infinity, u1 = -Infinity, v0 = Infinity, v1 = -Infinity;
    for (const p of poly2) {
      const u4 = p[0] * c + p[1] * s, v2 = -p[0] * s + p[1] * c;
      u0 = Math.min(u0, u4);
      u1 = Math.max(u1, u4);
      v0 = Math.min(v0, v2);
      v1 = Math.max(v1, v2);
    }
    const ar = (u1 - u0) * (v1 - v0);
    if (ar < bestA) {
      bestA = ar;
      const um = (u0 + u1) / 2, vm = (v0 + v1) / 2;
      best = { cx: um * c - vm * s, cy: um * s + vm * c, w: u1 - u0, h: v1 - v0, a: ang };
    }
  }
  return best ?? { cx: 0, cy: 0, w: 0, h: 0, a: 0 };
}
function fitRect(poly2, fill = 0.94, wFrac = 1, hFrac = 1) {
  const o = obb(poly2);
  let cen = [o.cx, o.cy];
  if (!pointInConvex(cen, poly2)) cen = centroid(poly2);
  const c = Math.cos(o.a), s = Math.sin(o.a);
  const ok = (k2) => {
    for (const [su, sv] of [
      [-1, -1],
      [1, -1],
      [1, 1],
      [-1, 1]
    ]) {
      const du = su * o.w * wFrac * k2 / 2, dv = sv * o.h * hFrac * k2 / 2;
      const p = [cen[0] + du * c - dv * s, cen[1] + du * s + dv * c];
      if (!pointInConvex(p, poly2, 0.02)) return false;
    }
    return true;
  };
  let k = 1;
  if (!ok(1)) {
    let lo = 0.04, hi = 1;
    if (!ok(lo)) return null;
    for (let i = 0; i < 14; i++) {
      const m2 = (lo + hi) / 2;
      if (ok(m2)) lo = m2;
      else hi = m2;
    }
    k = lo;
  }
  return { cx: cen[0], cy: cen[1], w: o.w * wFrac * k * fill, h: o.h * hFrac * k * fill, a: o.a };
}
function fitFrontageRect(plot, f0, f1, targetDepth, sideMargin = 0.45, setback = 0.35, maxWidth = 0) {
  const fl = dist(f0, f1);
  if (fl < 4) return null;
  const ex = f1[0] - f0[0], ey = f1[1] - f0[1];
  const T = [ex / fl, ey / fl];
  const N = [-T[1], T[0]];
  const ang = Math.atan2(T[1], T[0]);
  const fMid = [(f0[0] + f1[0]) / 2, (f0[1] + f1[1]) / 2];
  let bw = Math.max(3.2, fl - 2 * sideMargin);
  if (maxWidth > 0 && bw > maxWidth) bw = maxWidth;
  let hw = bw / 2;
  const okFront = (cur_hw) => {
    const fl_pt = [fMid[0] - T[0] * cur_hw + N[0] * setback, fMid[1] - T[1] * cur_hw + N[1] * setback];
    const fr_pt = [fMid[0] + T[0] * cur_hw + N[0] * setback, fMid[1] + T[1] * cur_hw + N[1] * setback];
    return pointInConvex(fl_pt, plot, 0.04) && pointInConvex(fr_pt, plot, 0.04);
  };
  if (!okFront(hw)) {
    hw = hw * 0.85;
    if (!okFront(hw)) {
      hw = hw * 0.82;
      if (!okFront(hw)) return null;
    }
  }
  const okDepth = (d, cur_hw) => {
    const bl = [fMid[0] - T[0] * cur_hw + N[0] * (setback + d), fMid[1] - T[1] * cur_hw + N[1] * (setback + d)];
    const br = [fMid[0] + T[0] * cur_hw + N[0] * (setback + d), fMid[1] + T[1] * cur_hw + N[1] * (setback + d)];
    return pointInConvex(bl, plot, 0.02) && pointInConvex(br, plot, 0.02);
  };
  if (!okDepth(3.2, hw)) {
    hw = hw * 0.82;
    if (!okDepth(3.2, hw)) return null;
  }
  let lo = 3.2, hi = Math.max(3.2, targetDepth);
  if (!okDepth(hi, hw)) {
    for (let it = 0; it < 12; it++) {
      const m2 = (lo + hi) / 2;
      if (okDepth(m2, hw)) lo = m2;
      else hi = m2;
    }
  } else {
    lo = hi;
  }
  const bd2 = lo;
  if (bd2 < 3.2) return null;
  const actual_w = hw * 2;
  const cx = fMid[0] + N[0] * (setback + bd2 / 2);
  const cy = fMid[1] + N[1] * (setback + bd2 / 2);
  const backC = N[0] * (fMid[0] + N[0] * (setback + bd2 + 0.25)) + N[1] * (fMid[1] + N[1] * (setback + bd2 + 0.25));
  const backyard = cleanPoly(clipPlane(plot, N[0], N[1], backC));
  return {
    cx,
    cy,
    w: actual_w,
    h: bd2,
    a: ang,
    frontageEdge: [f0, f1],
    backyard: backyard.length >= 3 && area(backyard) > 16 ? backyard : void 0
  };
}
function octagon(x, y, r2) {
  const out2 = [];
  for (let i = 0; i < 8; i++) {
    const a = i / 8 * Math.PI * 2 + Math.PI / 8;
    out2.push(x + Math.cos(a) * r2, y + Math.sin(a) * r2);
  }
  return out2;
}
function satOverlap(A, B2, eps = 0.05) {
  for (const P of [A, B2]) {
    const n = P.length / 2;
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      const ex = P[j * 2] - P[i * 2], ey = P[j * 2 + 1] - P[i * 2 + 1];
      const l = Math.hypot(ex, ey) || 1;
      const nx = -ey / l, ny = ex / l;
      let a0 = Infinity, a1 = -Infinity, b0 = Infinity, b1 = -Infinity;
      for (let k = 0; k < A.length; k += 2) {
        const v2 = A[k] * nx + A[k + 1] * ny;
        a0 = Math.min(a0, v2);
        a1 = Math.max(a1, v2);
      }
      for (let k = 0; k < B2.length; k += 2) {
        const v2 = B2[k] * nx + B2[k + 1] * ny;
        b0 = Math.min(b0, v2);
        b1 = Math.max(b1, v2);
      }
      if (a1 <= b0 + eps || b1 <= a0 + eps) return false;
    }
  }
  return true;
}
function segDist(p, a, b) {
  const ex = b[0] - a[0], ey = b[1] - a[1];
  const l2 = ex * ex + ey * ey;
  let t = l2 > 0 ? ((p[0] - a[0]) * ex + (p[1] - a[1]) * ey) / l2 : 0;
  t = clamp(t, 0, 1);
  return Math.hypot(p[0] - (a[0] + ex * t), p[1] - (a[1] + ey * t));
}
function polylineNearest(p, pts) {
  let best = { d: Infinity, i: 0, q: [0, 0] };
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1];
    const ex = b[0] - a[0], ey = b[1] - a[1];
    const l2 = ex * ex + ey * ey;
    const t = l2 > 0 ? clamp(((p[0] - a[0]) * ex + (p[1] - a[1]) * ey) / l2, 0, 1) : 0;
    const q = [a[0] + ex * t, a[1] + ey * t];
    const d = Math.hypot(p[0] - q[0], p[1] - q[1]);
    if (d < best.d) best = { d, i, q };
  }
  return best;
}
function chaikin(pts, iter, q = 0.25) {
  let cur = pts;
  for (let it = 0; it < iter; it++) {
    if (cur.length < 3) break;
    const out2 = [cur[0]];
    for (let i = 0; i < cur.length - 1; i++) {
      const a = cur[i], b = cur[i + 1];
      out2.push([a[0] + (b[0] - a[0]) * q, a[1] + (b[1] - a[1]) * q]);
      out2.push([a[0] + (b[0] - a[0]) * (1 - q), a[1] + (b[1] - a[1]) * (1 - q)]);
    }
    out2.push(cur[cur.length - 1]);
    cur = out2;
  }
  return cur;
}
function isConvex(poly2) {
  const n = poly2.length;
  for (let i = 0; i < n; i++) {
    const a = poly2[i], b = poly2[(i + 1) % n], c = poly2[(i + 2) % n];
    if ((b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0]) < -1e-6) return false;
  }
  return true;
}
var flat = (poly2) => {
  const o = [];
  for (const p of poly2) o.push(p[0], p[1]);
  return o;
};
var unflat = (f2) => {
  const o = [];
  for (let i = 0; i < f2.length; i += 2) o.push([f2[i], f2[i + 1]]);
  return o;
};
var PolyIndex = class {
  constructor(pts) {
    this.pts = pts;
    const cs = this.cs;
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i], b = pts[i + 1];
      for (let x = Math.floor(Math.min(a[0], b[0]) / cs); x <= Math.floor(Math.max(a[0], b[0]) / cs); x++)
        for (let y = Math.floor(Math.min(a[1], b[1]) / cs); y <= Math.floor(Math.max(a[1], b[1]) / cs); y++) {
          const k = (x + 2e3) * 8192 + (y + 2e3);
          const l = this.grid.get(k);
          if (l) l.push(i);
          else this.grid.set(k, [i]);
        }
    }
  }
  pts;
  grid = /* @__PURE__ */ new Map();
  cs = 40;
  nearest(p) {
    const cs = this.cs, pts = this.pts;
    const gx = Math.floor(p[0] / cs), gy = Math.floor(p[1] / cs);
    let best = { d: Infinity, i: 0, q: [0, 0] };
    for (let r2 = 0; r2 <= 5; r2++) {
      for (let dx = -r2; dx <= r2; dx++)
        for (let dy = -r2; dy <= r2; dy++) {
          if (Math.max(Math.abs(dx), Math.abs(dy)) !== r2) continue;
          const l = this.grid.get((gx + dx + 2e3) * 8192 + (gy + dy + 2e3));
          if (!l) continue;
          for (const i of l) {
            const a = pts[i], b = pts[i + 1];
            const ex = b[0] - a[0], ey = b[1] - a[1];
            const l2 = ex * ex + ey * ey;
            const t = l2 > 0 ? clamp(((p[0] - a[0]) * ex + (p[1] - a[1]) * ey) / l2, 0, 1) : 0;
            const qx = a[0] + ex * t, qy = a[1] + ey * t;
            const d = Math.hypot(p[0] - qx, p[1] - qy);
            if (d < best.d) best = { d, i, q: [qx, qy] };
          }
        }
      if (best.d <= r2 * cs) break;
    }
    return best;
  }
};
var polyIdx = /* @__PURE__ */ new WeakMap();
function nearestOn(pts, p) {
  let ix = polyIdx.get(pts);
  if (!ix) polyIdx.set(pts, ix = new PolyIndex(pts));
  return ix.nearest(p);
}
function fitRectAngle(poly2, ang, fill = 0.94) {
  const c = Math.cos(ang), s = Math.sin(ang);
  const cen = centroid(poly2);
  let u0 = Infinity, u1 = -Infinity, v0 = Infinity, v1 = -Infinity;
  for (const p of poly2) {
    const dx = p[0] - cen[0], dy = p[1] - cen[1];
    const u4 = dx * c + dy * s, v2 = -dx * s + dy * c;
    u0 = Math.min(u0, u4);
    u1 = Math.max(u1, u4);
    v0 = Math.min(v0, v2);
    v1 = Math.max(v1, v2);
  }
  const W2 = 2 * Math.min(-u0, u1), H2 = 2 * Math.min(-v0, v1);
  const ok = (k) => {
    for (const [su, sv] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
      const du = su * W2 * k / 2, dv = sv * H2 * k / 2;
      if (!pointInConvex([cen[0] + du * c - dv * s, cen[1] + du * s + dv * c], poly2, 0.02)) return false;
    }
    return true;
  };
  if (!ok(0.05)) return null;
  let lo = 0.05, hi = 1;
  if (ok(1)) lo = 1;
  else for (let i = 0; i < 14; i++) {
    const m2 = (lo + hi) / 2;
    if (ok(m2)) lo = m2;
    else hi = m2;
  }
  return { cx: cen[0], cy: cen[1], w: W2 * lo * fill, h: H2 * lo * fill, a: ang };
}

// src/engine/settlement.ts
var TIERS = [
  {
    tier: "hamlet",
    label: "Hamlet",
    max: 150,
    plotArea: 1500,
    cellArea: 6e3,
    bpb: 3,
    wall: "none",
    market: false,
    marketCells: 0,
    cathedral: false,
    citadel: false,
    church: false,
    university: false,
    districts: 1,
    peoplePerBuilding: 3.5,
    suburbs: false,
    blurb: "A few farmsteads around a well or a crossroads."
  },
  {
    tier: "village",
    label: "Village",
    max: 900,
    plotArea: 700,
    cellArea: 8e3,
    bpb: 8.9,
    wall: "none",
    market: false,
    marketCells: 0,
    cathedral: false,
    citadel: false,
    church: true,
    university: false,
    districts: 2,
    peoplePerBuilding: 3.6,
    suburbs: false,
    blurb: "A church, a mill and a handful of hamlets around it."
  },
  {
    tier: "town",
    label: "Town",
    max: 4500,
    plotArea: 400,
    cellArea: 8e3,
    bpb: 14.5,
    wall: "outer",
    market: true,
    marketCells: 1,
    cathedral: false,
    citadel: false,
    church: true,
    university: false,
    districts: 3,
    peoplePerBuilding: 5,
    suburbs: true,
    blurb: "A market town: one square, guild houses, a church and town walls."
  },
  {
    tier: "city",
    label: "City",
    max: 18e3,
    plotArea: 300,
    cellArea: 11e3,
    bpb: 29,
    wall: "outer",
    market: true,
    marketCells: 1,
    cathedral: true,
    citadel: true,
    church: true,
    university: true,
    districts: -1,
    peoplePerBuilding: 4.8,
    suburbs: true,
    blurb: "A walled city with a cathedral, a citadel and busy quarters."
  },
  {
    tier: "megacity",
    label: "Megacity",
    max: Infinity,
    plotArea: 240,
    cellArea: 15e3,
    bpb: 50,
    wall: "double",
    market: true,
    marketCells: 2,
    cathedral: true,
    citadel: true,
    church: true,
    university: true,
    districts: -2,
    peoplePerBuilding: 4.6,
    suburbs: true,
    blurb: "A great city of many quarters, two markets and ring walls."
  }
];
var tierOf = (pop2) => {
  for (const t of TIERS) if (pop2 < t.max) return t;
  return TIERS[TIERS.length - 1];
};
var BASE_RESIDENTIAL_MIN = 86;
var PLOT_FACTOR = 0.95;
var CALIBRATION = {};
function settlementFor(p) {
  const pop2 = Math.max(8, Math.round(p.population));
  const spec = tierOf(pop2);
  const idn = identityOf(p.identity);
  const tierIndex = TIERS.indexOf(spec);
  const grain = lerp(0.72, 1.55, clamp(p.cityDensity, 0, 1));
  const cellArea2 = spec.cellArea * grain;
  const targetBuildings = Math.max(3, Math.round(pop2 / spec.peoplePerBuilding));
  const bpb = cellArea2 / spec.plotArea;
  const blocks = clamp(Math.round(targetBuildings / bpb), 3, 330);
  const radius = Math.sqrt(blocks * cellArea2 / Math.PI) * 1.06;
  const dens = lerp(1.3, 0.82, clamp(p.buildingDensity, 0, 1));
  const plotScale = spec.plotArea / (BASE_RESIDENTIAL_MIN * PLOT_FACTOR) * dens;
  let wall = spec.wall;
  if (p.walls !== "auto") wall = p.walls;
  else if (tierIndex >= 3 && idn.walls === "double") wall = "double";
  if (tierIndex <= 1 && p.walls === "auto") wall = "none";
  const geoCoast = p.geography === "coast" || p.geography === "auto" && idn.geo === "coast";
  let river = p.river === "auto" ? idn.river && !geoCoast : p.river === "river";
  if (tierIndex <= 1 && p.river === "auto") river = false;
  const harbour = tierIndex >= 2 && (p.harbour === "yes" || p.harbour === "auto" && idn.harbour && (river || geoCoast));
  const districts = spec.districts === -1 ? clamp(p.districtCount, 4, 12) : spec.districts === -2 ? clamp(p.districtCount + 5, 12, 18) : spec.districts;
  const gates = wall === "none" ? 0 : tierIndex <= 2 ? 2 : tierIndex === 3 ? idn.gates : idn.gates + 1;
  return {
    tier: spec.tier,
    label: spec.label,
    blurb: spec.blurb,
    population: pop2,
    blocks,
    plotScale: CALIBRATION.plotScale ?? plotScale,
    cellArea: cellArea2,
    wall,
    moat: p.moat === "yes" || p.moat === "auto" && idn.moat && tierIndex >= 3 && wall !== "none",
    market: spec.market,
    marketCells: spec.marketCells,
    cathedral: spec.cathedral,
    citadel: spec.citadel,
    church: spec.church,
    university: spec.university && tierIndex >= 3,
    harbour,
    river,
    riverWidth: Math.max(5, Math.round(p.riverWidth * (tierIndex === 0 ? 0.4 : tierIndex === 1 ? 0.65 : 1))),
    districts,
    gates,
    suburbs: spec.suburbs,
    peoplePerBuilding: spec.peoplePerBuilding,
    targetBuildings,
    radius,
    tierIndex
  };
}
var PEOPLE_BY_TYPE = {
  house: 4.2,
  hovel: 3.4,
  house_l: 6.5,
  merchant: 5.2,
  workshop: 3.4,
  warehouse: 2.2,
  inn: 6,
  tavern: 7,
  market_hall: 2.5,
  church: 1,
  cathedral: 2,
  temple: 1,
  guildhall: 3,
  barracks: 22,
  stable: 2,
  mill: 3,
  smithy: 3,
  bakery: 4,
  townhall: 4,
  palace: 26,
  keep: 18,
  granary: 1,
  hospital: 14,
  university: 18,
  monastery: 24,
  manor: 12,
  chapel: 1,
  barn: 1.5
};
function estimatePopulation(buildings) {
  let n = 0;
  for (const b of buildings) n += PEOPLE_BY_TYPE[b.type] ?? 4;
  return Math.round(n);
}

// node_modules/robust-predicates/esm/util.js
var epsilon = 11102230246251565e-32;
var splitter = 134217729;
var resulterrbound = (3 + 8 * epsilon) * epsilon;
function sum(elen, e, flen, f2, h) {
  let Q, Qnew, hh, bvirt;
  let enow = e[0];
  let fnow = f2[0];
  let eindex = 0;
  let findex = 0;
  if (fnow > enow === fnow > -enow) {
    Q = enow;
    enow = e[++eindex];
  } else {
    Q = fnow;
    fnow = f2[++findex];
  }
  let hindex = 0;
  if (eindex < elen && findex < flen) {
    if (fnow > enow === fnow > -enow) {
      Qnew = enow + Q;
      hh = Q - (Qnew - enow);
      enow = e[++eindex];
    } else {
      Qnew = fnow + Q;
      hh = Q - (Qnew - fnow);
      fnow = f2[++findex];
    }
    Q = Qnew;
    if (hh !== 0) {
      h[hindex++] = hh;
    }
    while (eindex < elen && findex < flen) {
      if (fnow > enow === fnow > -enow) {
        Qnew = Q + enow;
        bvirt = Qnew - Q;
        hh = Q - (Qnew - bvirt) + (enow - bvirt);
        enow = e[++eindex];
      } else {
        Qnew = Q + fnow;
        bvirt = Qnew - Q;
        hh = Q - (Qnew - bvirt) + (fnow - bvirt);
        fnow = f2[++findex];
      }
      Q = Qnew;
      if (hh !== 0) {
        h[hindex++] = hh;
      }
    }
  }
  while (eindex < elen) {
    Qnew = Q + enow;
    bvirt = Qnew - Q;
    hh = Q - (Qnew - bvirt) + (enow - bvirt);
    enow = e[++eindex];
    Q = Qnew;
    if (hh !== 0) {
      h[hindex++] = hh;
    }
  }
  while (findex < flen) {
    Qnew = Q + fnow;
    bvirt = Qnew - Q;
    hh = Q - (Qnew - bvirt) + (fnow - bvirt);
    fnow = f2[++findex];
    Q = Qnew;
    if (hh !== 0) {
      h[hindex++] = hh;
    }
  }
  if (Q !== 0 || hindex === 0) {
    h[hindex++] = Q;
  }
  return hindex;
}
function estimate(elen, e) {
  let Q = e[0];
  for (let i = 1; i < elen; i++) Q += e[i];
  return Q;
}
function vec(n) {
  return new Float64Array(n);
}

// node_modules/robust-predicates/esm/orient2d.js
var ccwerrboundA = (3 + 16 * epsilon) * epsilon;
var ccwerrboundB = (2 + 12 * epsilon) * epsilon;
var ccwerrboundC = (9 + 64 * epsilon) * epsilon * epsilon;
var B = vec(4);
var C1 = vec(8);
var C2 = vec(12);
var D = vec(16);
var u = vec(4);
function orient2dadapt(ax, ay, bx, by, cx, cy, detsum) {
  let acxtail, acytail, bcxtail, bcytail;
  let bvirt, c, ahi, alo, bhi, blo, _i, _j, _0, s1, s0, t1, t0, u32;
  const acx = ax - cx;
  const bcx = bx - cx;
  const acy = ay - cy;
  const bcy = by - cy;
  s1 = acx * bcy;
  c = splitter * acx;
  ahi = c - (c - acx);
  alo = acx - ahi;
  c = splitter * bcy;
  bhi = c - (c - bcy);
  blo = bcy - bhi;
  s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
  t1 = acy * bcx;
  c = splitter * acy;
  ahi = c - (c - acy);
  alo = acy - ahi;
  c = splitter * bcx;
  bhi = c - (c - bcx);
  blo = bcx - bhi;
  t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
  _i = s0 - t0;
  bvirt = s0 - _i;
  B[0] = s0 - (_i + bvirt) + (bvirt - t0);
  _j = s1 + _i;
  bvirt = _j - s1;
  _0 = s1 - (_j - bvirt) + (_i - bvirt);
  _i = _0 - t1;
  bvirt = _0 - _i;
  B[1] = _0 - (_i + bvirt) + (bvirt - t1);
  u32 = _j + _i;
  bvirt = u32 - _j;
  B[2] = _j - (u32 - bvirt) + (_i - bvirt);
  B[3] = u32;
  let det = estimate(4, B);
  let errbound = ccwerrboundB * detsum;
  if (det >= errbound || -det >= errbound) {
    return det;
  }
  bvirt = ax - acx;
  acxtail = ax - (acx + bvirt) + (bvirt - cx);
  bvirt = bx - bcx;
  bcxtail = bx - (bcx + bvirt) + (bvirt - cx);
  bvirt = ay - acy;
  acytail = ay - (acy + bvirt) + (bvirt - cy);
  bvirt = by - bcy;
  bcytail = by - (bcy + bvirt) + (bvirt - cy);
  if (acxtail === 0 && acytail === 0 && bcxtail === 0 && bcytail === 0) {
    return det;
  }
  errbound = ccwerrboundC * detsum + resulterrbound * Math.abs(det);
  det += acx * bcytail + bcy * acxtail - (acy * bcxtail + bcx * acytail);
  if (det >= errbound || -det >= errbound) return det;
  s1 = acxtail * bcy;
  c = splitter * acxtail;
  ahi = c - (c - acxtail);
  alo = acxtail - ahi;
  c = splitter * bcy;
  bhi = c - (c - bcy);
  blo = bcy - bhi;
  s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
  t1 = acytail * bcx;
  c = splitter * acytail;
  ahi = c - (c - acytail);
  alo = acytail - ahi;
  c = splitter * bcx;
  bhi = c - (c - bcx);
  blo = bcx - bhi;
  t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
  _i = s0 - t0;
  bvirt = s0 - _i;
  u[0] = s0 - (_i + bvirt) + (bvirt - t0);
  _j = s1 + _i;
  bvirt = _j - s1;
  _0 = s1 - (_j - bvirt) + (_i - bvirt);
  _i = _0 - t1;
  bvirt = _0 - _i;
  u[1] = _0 - (_i + bvirt) + (bvirt - t1);
  u32 = _j + _i;
  bvirt = u32 - _j;
  u[2] = _j - (u32 - bvirt) + (_i - bvirt);
  u[3] = u32;
  const C1len = sum(4, B, 4, u, C1);
  s1 = acx * bcytail;
  c = splitter * acx;
  ahi = c - (c - acx);
  alo = acx - ahi;
  c = splitter * bcytail;
  bhi = c - (c - bcytail);
  blo = bcytail - bhi;
  s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
  t1 = acy * bcxtail;
  c = splitter * acy;
  ahi = c - (c - acy);
  alo = acy - ahi;
  c = splitter * bcxtail;
  bhi = c - (c - bcxtail);
  blo = bcxtail - bhi;
  t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
  _i = s0 - t0;
  bvirt = s0 - _i;
  u[0] = s0 - (_i + bvirt) + (bvirt - t0);
  _j = s1 + _i;
  bvirt = _j - s1;
  _0 = s1 - (_j - bvirt) + (_i - bvirt);
  _i = _0 - t1;
  bvirt = _0 - _i;
  u[1] = _0 - (_i + bvirt) + (bvirt - t1);
  u32 = _j + _i;
  bvirt = u32 - _j;
  u[2] = _j - (u32 - bvirt) + (_i - bvirt);
  u[3] = u32;
  const C2len = sum(C1len, C1, 4, u, C2);
  s1 = acxtail * bcytail;
  c = splitter * acxtail;
  ahi = c - (c - acxtail);
  alo = acxtail - ahi;
  c = splitter * bcytail;
  bhi = c - (c - bcytail);
  blo = bcytail - bhi;
  s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
  t1 = acytail * bcxtail;
  c = splitter * acytail;
  ahi = c - (c - acytail);
  alo = acytail - ahi;
  c = splitter * bcxtail;
  bhi = c - (c - bcxtail);
  blo = bcxtail - bhi;
  t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
  _i = s0 - t0;
  bvirt = s0 - _i;
  u[0] = s0 - (_i + bvirt) + (bvirt - t0);
  _j = s1 + _i;
  bvirt = _j - s1;
  _0 = s1 - (_j - bvirt) + (_i - bvirt);
  _i = _0 - t1;
  bvirt = _0 - _i;
  u[1] = _0 - (_i + bvirt) + (bvirt - t1);
  u32 = _j + _i;
  bvirt = u32 - _j;
  u[2] = _j - (u32 - bvirt) + (_i - bvirt);
  u[3] = u32;
  const Dlen = sum(C2len, C2, 4, u, D);
  return D[Dlen - 1];
}
function orient2d(ax, ay, bx, by, cx, cy) {
  const detleft = (ay - cy) * (bx - cx);
  const detright = (ax - cx) * (by - cy);
  const det = detleft - detright;
  const detsum = Math.abs(detleft + detright);
  if (Math.abs(det) >= ccwerrboundA * detsum) return det;
  return -orient2dadapt(ax, ay, bx, by, cx, cy, detsum);
}

// node_modules/robust-predicates/esm/orient3d.js
var o3derrboundA = (7 + 56 * epsilon) * epsilon;
var o3derrboundB = (3 + 28 * epsilon) * epsilon;
var o3derrboundC = (26 + 288 * epsilon) * epsilon * epsilon;
var bc = vec(4);
var ca = vec(4);
var ab = vec(4);
var at_b = vec(4);
var at_c = vec(4);
var bt_c = vec(4);
var bt_a = vec(4);
var ct_a = vec(4);
var ct_b = vec(4);
var bct = vec(8);
var cat = vec(8);
var abt = vec(8);
var u2 = vec(4);
var _8 = vec(8);
var _8b = vec(8);
var _16 = vec(16);
var _12 = vec(12);
var fin = vec(192);
var fin2 = vec(192);

// node_modules/robust-predicates/esm/incircle.js
var iccerrboundA = (10 + 96 * epsilon) * epsilon;
var iccerrboundB = (4 + 48 * epsilon) * epsilon;
var iccerrboundC = (44 + 576 * epsilon) * epsilon * epsilon;
var bc2 = vec(4);
var ca2 = vec(4);
var ab2 = vec(4);
var aa = vec(4);
var bb = vec(4);
var cc = vec(4);
var u3 = vec(4);
var v = vec(4);
var axtbc = vec(8);
var aytbc = vec(8);
var bxtca = vec(8);
var bytca = vec(8);
var cxtab = vec(8);
var cytab = vec(8);
var abt2 = vec(8);
var bct2 = vec(8);
var cat2 = vec(8);
var abtt = vec(4);
var bctt = vec(4);
var catt = vec(4);
var _82 = vec(8);
var _162 = vec(16);
var _16b = vec(16);
var _16c = vec(16);
var _32 = vec(32);
var _32b = vec(32);
var _48 = vec(48);
var _64 = vec(64);
var fin3 = vec(1152);
var fin22 = vec(1152);

// node_modules/robust-predicates/esm/insphere.js
var isperrboundA = (16 + 224 * epsilon) * epsilon;
var isperrboundB = (5 + 72 * epsilon) * epsilon;
var isperrboundC = (71 + 1408 * epsilon) * epsilon * epsilon;
var ab3 = vec(4);
var bc3 = vec(4);
var cd = vec(4);
var de = vec(4);
var ea = vec(4);
var ac = vec(4);
var bd = vec(4);
var ce = vec(4);
var da = vec(4);
var eb = vec(4);
var abc = vec(24);
var bcd = vec(24);
var cde = vec(24);
var dea = vec(24);
var eab = vec(24);
var abd = vec(24);
var bce = vec(24);
var cda = vec(24);
var deb = vec(24);
var eac = vec(24);
var adet = vec(1152);
var bdet = vec(1152);
var cdet = vec(1152);
var ddet = vec(1152);
var edet = vec(1152);
var abdet = vec(2304);
var cddet = vec(2304);
var cdedet = vec(3456);
var deter = vec(5760);
var _83 = vec(8);
var _8b2 = vec(8);
var _8c = vec(8);
var _163 = vec(16);
var _24 = vec(24);
var _482 = vec(48);
var _48b = vec(48);
var _96 = vec(96);
var _192 = vec(192);
var _384x = vec(384);
var _384y = vec(384);
var _384z = vec(384);
var _768 = vec(768);
var xdet = vec(96);
var ydet = vec(96);
var zdet = vec(96);
var fin4 = vec(1152);

// node_modules/delaunator/index.js
var EPSILON = Math.pow(2, -52);
var EDGE_STACK = new Uint32Array(512);
var Delaunator = class _Delaunator {
  /**
   * Constructs a delaunay triangulation object given an array of points (`[x, y]` by default).
   * `getX` and `getY` are optional functions of the form `(point) => value` for custom point formats.
   *
   * @template P
   * @param {P[]} points
   * @param {(p: P) => number} [getX]
   * @param {(p: P) => number} [getY]
   */
  // @ts-expect-error TS2322
  static from(points, getX = defaultGetX, getY = defaultGetY) {
    const n = points.length;
    const coords = new Float64Array(n * 2);
    for (let i = 0; i < n; i++) {
      const p = points[i];
      coords[2 * i] = getX(p);
      coords[2 * i + 1] = getY(p);
    }
    return new _Delaunator(coords);
  }
  /**
   * Constructs a delaunay triangulation object given an array of point coordinates of the form:
   * `[x0, y0, x1, y1, ...]` (use a typed array for best performance). Duplicate points are skipped.
   *
   * @param {T} coords
   */
  constructor(coords) {
    const n = coords.length >> 1;
    if (n > 0 && typeof coords[0] !== "number") throw new Error("Expected coords to contain numbers.");
    this.coords = coords;
    const maxTriangles = Math.max(2 * n - 5, 0);
    this._triangles = new Uint32Array(maxTriangles * 3);
    this._halfedges = new Int32Array(maxTriangles * 3);
    this._hashSize = Math.ceil(Math.sqrt(n));
    this._hullPrev = new Uint32Array(n);
    this._hullNext = new Uint32Array(n);
    this._hullTri = new Uint32Array(n);
    this._hullHash = new Int32Array(this._hashSize);
    this._ids = new Uint32Array(n);
    this._dists = new Float64Array(n);
    this.trianglesLen = 0;
    this._cx = 0;
    this._cy = 0;
    this._hullStart = 0;
    this.hull = this._triangles;
    this.triangles = this._triangles;
    this.halfedges = this._halfedges;
    this.update();
  }
  /**
   * Updates the triangulation if you modified `delaunay.coords` values in place, avoiding expensive memory allocations.
   * Useful for iterative relaxation algorithms such as Lloyd's.
   */
  update() {
    const { coords, _hullPrev: hullPrev, _hullNext: hullNext, _hullTri: hullTri, _hullHash: hullHash } = this;
    const n = coords.length >> 1;
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (let i = 0; i < n; i++) {
      const x = coords[2 * i];
      const y = coords[2 * i + 1];
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
      this._ids[i] = i;
    }
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    let i0 = 0, i1 = 0, i2 = 0;
    for (let i = 0, minDist = Infinity; i < n; i++) {
      const d = dist2(cx, cy, coords[2 * i], coords[2 * i + 1]);
      if (d < minDist) {
        i0 = i;
        minDist = d;
      }
    }
    const i0x = coords[2 * i0];
    const i0y = coords[2 * i0 + 1];
    for (let i = 0, minDist = Infinity; i < n; i++) {
      if (i === i0) continue;
      const d = dist2(i0x, i0y, coords[2 * i], coords[2 * i + 1]);
      if (d < minDist && d > 0) {
        i1 = i;
        minDist = d;
      }
    }
    let i1x = coords[2 * i1];
    let i1y = coords[2 * i1 + 1];
    let minRadius = Infinity;
    for (let i = 0; i < n; i++) {
      if (i === i0 || i === i1) continue;
      const r2 = circumradius(i0x, i0y, i1x, i1y, coords[2 * i], coords[2 * i + 1]);
      if (r2 < minRadius) {
        i2 = i;
        minRadius = r2;
      }
    }
    let i2x = coords[2 * i2];
    let i2y = coords[2 * i2 + 1];
    if (minRadius === Infinity) {
      for (let i = 0; i < n; i++) {
        this._dists[i] = coords[2 * i] - coords[0] || coords[2 * i + 1] - coords[1];
      }
      quicksort(this._ids, this._dists, 0, n - 1);
      const hull = new Uint32Array(n);
      let j = 0;
      for (let i = 0, d0 = -Infinity; i < n; i++) {
        const id = this._ids[i];
        const d = this._dists[id];
        if (d > d0) {
          hull[j++] = id;
          d0 = d;
        }
      }
      this.hull = hull.subarray(0, j);
      this.triangles = new Uint32Array(0);
      this.halfedges = new Int32Array(0);
      return;
    }
    if (orient2d(i0x, i0y, i1x, i1y, i2x, i2y) < 0) {
      const i = i1;
      const x = i1x;
      const y = i1y;
      i1 = i2;
      i1x = i2x;
      i1y = i2y;
      i2 = i;
      i2x = x;
      i2y = y;
    }
    const center = circumcenter(i0x, i0y, i1x, i1y, i2x, i2y);
    this._cx = center.x;
    this._cy = center.y;
    for (let i = 0; i < n; i++) {
      this._dists[i] = dist2(coords[2 * i], coords[2 * i + 1], center.x, center.y);
    }
    quicksort(this._ids, this._dists, 0, n - 1);
    this._hullStart = i0;
    let hullSize = 3;
    hullNext[i0] = hullPrev[i2] = i1;
    hullNext[i1] = hullPrev[i0] = i2;
    hullNext[i2] = hullPrev[i1] = i0;
    hullTri[i0] = 0;
    hullTri[i1] = 1;
    hullTri[i2] = 2;
    hullHash.fill(-1);
    hullHash[this._hashKey(i0x, i0y)] = i0;
    hullHash[this._hashKey(i1x, i1y)] = i1;
    hullHash[this._hashKey(i2x, i2y)] = i2;
    this.trianglesLen = 0;
    this._addTriangle(i0, i1, i2, -1, -1, -1);
    for (let k = 0, xp = 0, yp = 0; k < this._ids.length; k++) {
      const i = this._ids[k];
      const x = coords[2 * i];
      const y = coords[2 * i + 1];
      if (k > 0 && Math.abs(x - xp) <= EPSILON && Math.abs(y - yp) <= EPSILON) continue;
      xp = x;
      yp = y;
      if (i === i0 || i === i1 || i === i2) continue;
      let start = 0;
      for (let j = 0, key = this._hashKey(x, y); j < this._hashSize; j++) {
        start = hullHash[(key + j) % this._hashSize];
        if (start !== -1 && start !== hullNext[start]) break;
      }
      start = hullPrev[start];
      let e = start, q;
      while (q = hullNext[e], orient2d(x, y, coords[2 * e], coords[2 * e + 1], coords[2 * q], coords[2 * q + 1]) >= 0) {
        e = q;
        if (e === start) {
          e = -1;
          break;
        }
      }
      if (e === -1) continue;
      let t = this._addTriangle(e, i, hullNext[e], -1, -1, hullTri[e]);
      hullTri[i] = this._legalize(t + 2);
      hullTri[e] = t;
      hullSize++;
      let n2 = hullNext[e];
      while (q = hullNext[n2], orient2d(x, y, coords[2 * n2], coords[2 * n2 + 1], coords[2 * q], coords[2 * q + 1]) < 0) {
        t = this._addTriangle(n2, i, q, hullTri[i], -1, hullTri[n2]);
        hullTri[i] = this._legalize(t + 2);
        hullNext[n2] = n2;
        hullSize--;
        n2 = q;
      }
      if (e === start) {
        while (q = hullPrev[e], orient2d(x, y, coords[2 * q], coords[2 * q + 1], coords[2 * e], coords[2 * e + 1]) < 0) {
          t = this._addTriangle(q, i, e, -1, hullTri[e], hullTri[q]);
          this._legalize(t + 2);
          hullTri[q] = t;
          hullNext[e] = e;
          hullSize--;
          e = q;
        }
      }
      this._hullStart = hullPrev[i] = e;
      hullNext[e] = hullPrev[n2] = i;
      hullNext[i] = n2;
      hullHash[this._hashKey(x, y)] = i;
      hullHash[this._hashKey(coords[2 * e], coords[2 * e + 1])] = e;
    }
    this.hull = new Uint32Array(hullSize);
    for (let i = 0, e = this._hullStart; i < hullSize; i++) {
      this.hull[i] = e;
      e = hullNext[e];
    }
    this.triangles = this._triangles.subarray(0, this.trianglesLen);
    this.halfedges = this._halfedges.subarray(0, this.trianglesLen);
  }
  /**
   * Calculate an angle-based key for the edge hash used for advancing convex hull.
   *
   * @param {number} x
   * @param {number} y
   * @private
   */
  _hashKey(x, y) {
    return Math.floor(pseudoAngle(x - this._cx, y - this._cy) * this._hashSize) % this._hashSize;
  }
  /**
   * Flip an edge in a pair of triangles if it doesn't satisfy the Delaunay condition.
   *
   * @param {number} a
   * @private
   */
  _legalize(a) {
    const { _triangles: triangles, _halfedges: halfedges, coords } = this;
    let i = 0;
    let ar = 0;
    while (true) {
      const b = halfedges[a];
      const a0 = a - a % 3;
      ar = a0 + (a + 2) % 3;
      if (b === -1) {
        if (i === 0) break;
        a = EDGE_STACK[--i];
        continue;
      }
      const b0 = b - b % 3;
      const al = a0 + (a + 1) % 3;
      const bl = b0 + (b + 2) % 3;
      const p0 = triangles[ar];
      const pr = triangles[a];
      const pl = triangles[al];
      const p1 = triangles[bl];
      const illegal = inCircle(
        coords[2 * p0],
        coords[2 * p0 + 1],
        coords[2 * pr],
        coords[2 * pr + 1],
        coords[2 * pl],
        coords[2 * pl + 1],
        coords[2 * p1],
        coords[2 * p1 + 1]
      );
      if (illegal) {
        triangles[a] = p1;
        triangles[b] = p0;
        const hbl = halfedges[bl];
        if (hbl === -1) {
          let e = this._hullStart;
          do {
            if (this._hullTri[e] === bl) {
              this._hullTri[e] = a;
              break;
            }
            e = this._hullPrev[e];
          } while (e !== this._hullStart);
        }
        this._link(a, hbl);
        this._link(b, halfedges[ar]);
        this._link(ar, bl);
        const br = b0 + (b + 1) % 3;
        if (i < EDGE_STACK.length) {
          EDGE_STACK[i++] = br;
        }
      } else {
        if (i === 0) break;
        a = EDGE_STACK[--i];
      }
    }
    return ar;
  }
  /**
   * Link two half-edges to each other.
   * @param {number} a
   * @param {number} b
   * @private
   */
  _link(a, b) {
    this._halfedges[a] = b;
    if (b !== -1) this._halfedges[b] = a;
  }
  /**
   * Add a new triangle given vertex indices and adjacent half-edge ids.
   *
   * @param {number} i0
   * @param {number} i1
   * @param {number} i2
   * @param {number} a
   * @param {number} b
   * @param {number} c
   * @private
   */
  _addTriangle(i0, i1, i2, a, b, c) {
    const t = this.trianglesLen;
    this._triangles[t] = i0;
    this._triangles[t + 1] = i1;
    this._triangles[t + 2] = i2;
    this._link(t, a);
    this._link(t + 1, b);
    this._link(t + 2, c);
    this.trianglesLen += 3;
    return t;
  }
};
function pseudoAngle(dx, dy) {
  const p = dx / (Math.abs(dx) + Math.abs(dy));
  return (dy > 0 ? 3 - p : 1 + p) / 4;
}
function dist2(ax, ay, bx, by) {
  const dx = ax - bx;
  const dy = ay - by;
  return dx * dx + dy * dy;
}
function inCircle(ax, ay, bx, by, cx, cy, px2, py) {
  const dx = ax - px2;
  const dy = ay - py;
  const ex = bx - px2;
  const ey = by - py;
  const fx = cx - px2;
  const fy = cy - py;
  const ap = dx * dx + dy * dy;
  const bp = ex * ex + ey * ey;
  const cp = fx * fx + fy * fy;
  return dx * (ey * cp - bp * fy) - dy * (ex * cp - bp * fx) + ap * (ex * fy - ey * fx) < 0;
}
function circumradius(ax, ay, bx, by, cx, cy) {
  const dx = bx - ax;
  const dy = by - ay;
  const ex = cx - ax;
  const ey = cy - ay;
  const bl = dx * dx + dy * dy;
  const cl = ex * ex + ey * ey;
  const d = 0.5 / (dx * ey - dy * ex);
  const x = (ey * bl - dy * cl) * d;
  const y = (dx * cl - ex * bl) * d;
  return x * x + y * y;
}
function circumcenter(ax, ay, bx, by, cx, cy) {
  const dx = bx - ax;
  const dy = by - ay;
  const ex = cx - ax;
  const ey = cy - ay;
  const bl = dx * dx + dy * dy;
  const cl = ex * ex + ey * ey;
  const d = 0.5 / (dx * ey - dy * ex);
  const x = ax + (ey * bl - dy * cl) * d;
  const y = ay + (dx * cl - ex * bl) * d;
  return { x, y };
}
function quicksort(ids, dists, left, right) {
  if (right - left <= 20) {
    for (let i = left + 1; i <= right; i++) {
      const temp = ids[i];
      const tempDist = dists[temp];
      let j = i - 1;
      while (j >= left && dists[ids[j]] > tempDist) ids[j + 1] = ids[j--];
      ids[j + 1] = temp;
    }
  } else {
    const median = left + right >> 1;
    let i = left + 1;
    let j = right;
    swap(ids, median, i);
    if (dists[ids[left]] > dists[ids[right]]) swap(ids, left, right);
    if (dists[ids[i]] > dists[ids[right]]) swap(ids, i, right);
    if (dists[ids[left]] > dists[ids[i]]) swap(ids, left, i);
    const temp = ids[i];
    const tempDist = dists[temp];
    while (true) {
      do
        i++;
      while (dists[ids[i]] < tempDist);
      do
        j--;
      while (dists[ids[j]] > tempDist);
      if (j < i) break;
      swap(ids, i, j);
    }
    ids[left + 1] = ids[j];
    ids[j] = temp;
    if (right - i + 1 >= j - left) {
      quicksort(ids, dists, i, right);
      quicksort(ids, dists, left, j - 1);
    } else {
      quicksort(ids, dists, left, j - 1);
      quicksort(ids, dists, i, right);
    }
  }
}
function swap(arr, i, j) {
  const tmp = arr[i];
  arr[i] = arr[j];
  arr[j] = tmp;
}
function defaultGetX(p) {
  return p[0];
}
function defaultGetY(p) {
  return p[1];
}

// node_modules/d3-delaunay/src/path.js
var epsilon2 = 1e-6;
var Path = class {
  constructor() {
    this._x0 = this._y0 = // start of current subpath
    this._x1 = this._y1 = null;
    this._ = "";
  }
  moveTo(x, y) {
    this._ += `M${this._x0 = this._x1 = +x},${this._y0 = this._y1 = +y}`;
  }
  closePath() {
    if (this._x1 !== null) {
      this._x1 = this._x0, this._y1 = this._y0;
      this._ += "Z";
    }
  }
  lineTo(x, y) {
    this._ += `L${this._x1 = +x},${this._y1 = +y}`;
  }
  arc(x, y, r2) {
    x = +x, y = +y, r2 = +r2;
    const x02 = x + r2;
    const y02 = y;
    if (r2 < 0) throw new Error("negative radius");
    if (this._x1 === null) this._ += `M${x02},${y02}`;
    else if (Math.abs(this._x1 - x02) > epsilon2 || Math.abs(this._y1 - y02) > epsilon2) this._ += "L" + x02 + "," + y02;
    if (!r2) return;
    this._ += `A${r2},${r2},0,1,1,${x - r2},${y}A${r2},${r2},0,1,1,${this._x1 = x02},${this._y1 = y02}`;
  }
  rect(x, y, w, h) {
    this._ += `M${this._x0 = this._x1 = +x},${this._y0 = this._y1 = +y}h${+w}v${+h}h${-w}Z`;
  }
  value() {
    return this._ || null;
  }
};

// node_modules/d3-delaunay/src/polygon.js
var Polygon = class {
  constructor() {
    this._ = [];
  }
  moveTo(x, y) {
    this._.push([x, y]);
  }
  closePath() {
    this._.push(this._[0].slice());
  }
  lineTo(x, y) {
    this._.push([x, y]);
  }
  value() {
    return this._.length ? this._ : null;
  }
};

// node_modules/d3-delaunay/src/voronoi.js
var Voronoi = class {
  constructor(delaunay, [xmin, ymin, xmax, ymax] = [0, 0, 960, 500]) {
    if (!((xmax = +xmax) >= (xmin = +xmin)) || !((ymax = +ymax) >= (ymin = +ymin))) throw new Error("invalid bounds");
    this.delaunay = delaunay;
    this._circumcenters = new Float64Array(delaunay.points.length * 2);
    this.vectors = new Float64Array(delaunay.points.length * 2);
    this.xmax = xmax, this.xmin = xmin;
    this.ymax = ymax, this.ymin = ymin;
    this._init();
  }
  update() {
    this.delaunay.update();
    this._init();
    return this;
  }
  _init() {
    const { delaunay: { points, hull, triangles }, vectors } = this;
    let bx, by;
    const circumcenters = this.circumcenters = this._circumcenters.subarray(0, triangles.length / 3 * 2);
    for (let i = 0, j = 0, n = triangles.length, x, y; i < n; i += 3, j += 2) {
      const t1 = triangles[i] * 2;
      const t2 = triangles[i + 1] * 2;
      const t3 = triangles[i + 2] * 2;
      const x13 = points[t1];
      const y13 = points[t1 + 1];
      const x2 = points[t2];
      const y2 = points[t2 + 1];
      const x3 = points[t3];
      const y3 = points[t3 + 1];
      const dx = x2 - x13;
      const dy = y2 - y13;
      const ex = x3 - x13;
      const ey = y3 - y13;
      const ab4 = (dx * ey - dy * ex) * 2;
      if (Math.abs(ab4) < 1e-9) {
        if (bx === void 0) {
          bx = by = 0;
          for (const i2 of hull) bx += points[i2 * 2], by += points[i2 * 2 + 1];
          bx /= hull.length, by /= hull.length;
        }
        const a = 1e9 * Math.sign((bx - x13) * ey - (by - y13) * ex);
        x = (x13 + x3) / 2 - a * ey;
        y = (y13 + y3) / 2 + a * ex;
      } else {
        const d = 1 / ab4;
        const bl = dx * dx + dy * dy;
        const cl = ex * ex + ey * ey;
        x = x13 + (ey * bl - dy * cl) * d;
        y = y13 + (dx * cl - ex * bl) * d;
      }
      circumcenters[j] = x;
      circumcenters[j + 1] = y;
    }
    let h = hull[hull.length - 1];
    let p0, p1 = h * 4;
    let x02, x12 = points[2 * h];
    let y02, y12 = points[2 * h + 1];
    vectors.fill(0);
    for (let i = 0; i < hull.length; ++i) {
      h = hull[i];
      p0 = p1, x02 = x12, y02 = y12;
      p1 = h * 4, x12 = points[2 * h], y12 = points[2 * h + 1];
      vectors[p0 + 2] = vectors[p1] = y02 - y12;
      vectors[p0 + 3] = vectors[p1 + 1] = x12 - x02;
    }
  }
  render(context) {
    const buffer = context == null ? context = new Path() : void 0;
    const { delaunay: { halfedges, inedges, hull }, circumcenters, vectors } = this;
    if (hull.length <= 1) return null;
    for (let i = 0, n = halfedges.length; i < n; ++i) {
      const j = halfedges[i];
      if (j < i) continue;
      const ti = Math.floor(i / 3) * 2;
      const tj = Math.floor(j / 3) * 2;
      const xi = circumcenters[ti];
      const yi = circumcenters[ti + 1];
      const xj = circumcenters[tj];
      const yj = circumcenters[tj + 1];
      this._renderSegment(xi, yi, xj, yj, context);
    }
    let h0, h1 = hull[hull.length - 1];
    for (let i = 0; i < hull.length; ++i) {
      h0 = h1, h1 = hull[i];
      const t = Math.floor(inedges[h1] / 3) * 2;
      const x = circumcenters[t];
      const y = circumcenters[t + 1];
      const v2 = h0 * 4;
      const p = this._project(x, y, vectors[v2 + 2], vectors[v2 + 3]);
      if (p) this._renderSegment(x, y, p[0], p[1], context);
    }
    return buffer && buffer.value();
  }
  renderBounds(context) {
    const buffer = context == null ? context = new Path() : void 0;
    context.rect(this.xmin, this.ymin, this.xmax - this.xmin, this.ymax - this.ymin);
    return buffer && buffer.value();
  }
  renderCell(i, context) {
    const buffer = context == null ? context = new Path() : void 0;
    const points = this._clip(i);
    if (points === null || !points.length) return;
    context.moveTo(points[0], points[1]);
    let n = points.length;
    while (points[0] === points[n - 2] && points[1] === points[n - 1] && n > 1) n -= 2;
    for (let i2 = 2; i2 < n; i2 += 2) {
      if (points[i2] !== points[i2 - 2] || points[i2 + 1] !== points[i2 - 1])
        context.lineTo(points[i2], points[i2 + 1]);
    }
    context.closePath();
    return buffer && buffer.value();
  }
  *cellPolygons() {
    const { delaunay: { points } } = this;
    for (let i = 0, n = points.length / 2; i < n; ++i) {
      const cell = this.cellPolygon(i);
      if (cell) cell.index = i, yield cell;
    }
  }
  cellPolygon(i) {
    const polygon = new Polygon();
    this.renderCell(i, polygon);
    return polygon.value();
  }
  _renderSegment(x02, y02, x12, y12, context) {
    let S;
    const c0 = this._regioncode(x02, y02);
    const c1 = this._regioncode(x12, y12);
    if (c0 === 0 && c1 === 0) {
      context.moveTo(x02, y02);
      context.lineTo(x12, y12);
    } else if (S = this._clipSegment(x02, y02, x12, y12, c0, c1)) {
      context.moveTo(S[0], S[1]);
      context.lineTo(S[2], S[3]);
    }
  }
  contains(i, x, y) {
    if ((x = +x, x !== x) || (y = +y, y !== y)) return false;
    return this.delaunay._step(i, x, y) === i;
  }
  *neighbors(i) {
    const ci = this._clip(i);
    if (ci) for (const j of this.delaunay.neighbors(i)) {
      const cj = this._clip(j);
      if (cj) loop: for (let ai = 0, li = ci.length; ai < li; ai += 2) {
        for (let aj = 0, lj = cj.length; aj < lj; aj += 2) {
          if (ci[ai] === cj[aj] && ci[ai + 1] === cj[aj + 1] && ci[(ai + 2) % li] === cj[(aj + lj - 2) % lj] && ci[(ai + 3) % li] === cj[(aj + lj - 1) % lj]) {
            yield j;
            break loop;
          }
        }
      }
    }
  }
  _cell(i) {
    const { circumcenters, delaunay: { inedges, halfedges, triangles } } = this;
    const e0 = inedges[i];
    if (e0 === -1) return null;
    const points = [];
    let e = e0;
    do {
      const t = Math.floor(e / 3);
      points.push(circumcenters[t * 2], circumcenters[t * 2 + 1]);
      e = e % 3 === 2 ? e - 2 : e + 1;
      if (triangles[e] !== i) break;
      e = halfedges[e];
    } while (e !== e0 && e !== -1);
    return points;
  }
  _clip(i) {
    if (i === 0 && this.delaunay.hull.length === 1) {
      return [this.xmax, this.ymin, this.xmax, this.ymax, this.xmin, this.ymax, this.xmin, this.ymin];
    }
    const points = this._cell(i);
    if (points === null) return null;
    const { vectors: V } = this;
    const v2 = i * 4;
    return this._simplify(V[v2] || V[v2 + 1] ? this._clipInfinite(i, points, V[v2], V[v2 + 1], V[v2 + 2], V[v2 + 3]) : this._clipFinite(i, points));
  }
  _clipFinite(i, points) {
    const n = points.length;
    let P = null;
    let x02, y02, x12 = points[n - 2], y12 = points[n - 1];
    let c0, c1 = this._regioncode(x12, y12);
    let e0, e1 = 0;
    for (let j = 0; j < n; j += 2) {
      x02 = x12, y02 = y12, x12 = points[j], y12 = points[j + 1];
      c0 = c1, c1 = this._regioncode(x12, y12);
      if (c0 === 0 && c1 === 0) {
        e0 = e1, e1 = 0;
        if (P) P.push(x12, y12);
        else P = [x12, y12];
      } else {
        let S, sx0, sy0, sx1, sy1;
        if (c0 === 0) {
          if ((S = this._clipSegment(x02, y02, x12, y12, c0, c1)) === null) continue;
          [sx0, sy0, sx1, sy1] = S;
        } else {
          if ((S = this._clipSegment(x12, y12, x02, y02, c1, c0)) === null) continue;
          [sx1, sy1, sx0, sy0] = S;
          e0 = e1, e1 = this._edgecode(sx0, sy0);
          if (e0 && e1) this._edge(i, e0, e1, P, P.length);
          if (P) P.push(sx0, sy0);
          else P = [sx0, sy0];
        }
        e0 = e1, e1 = this._edgecode(sx1, sy1);
        if (e0 && e1) this._edge(i, e0, e1, P, P.length);
        if (P) P.push(sx1, sy1);
        else P = [sx1, sy1];
      }
    }
    if (P) {
      e0 = e1, e1 = this._edgecode(P[0], P[1]);
      if (e0 && e1) this._edge(i, e0, e1, P, P.length);
    } else if (this.contains(i, (this.xmin + this.xmax) / 2, (this.ymin + this.ymax) / 2)) {
      return [this.xmax, this.ymin, this.xmax, this.ymax, this.xmin, this.ymax, this.xmin, this.ymin];
    }
    return P;
  }
  _clipSegment(x02, y02, x12, y12, c0, c1) {
    const flip = c0 < c1;
    if (flip) [x02, y02, x12, y12, c0, c1] = [x12, y12, x02, y02, c1, c0];
    while (true) {
      if (c0 === 0 && c1 === 0) return flip ? [x12, y12, x02, y02] : [x02, y02, x12, y12];
      if (c0 & c1) return null;
      let x, y, c = c0 || c1;
      if (c & 8) x = x02 + (x12 - x02) * (this.ymax - y02) / (y12 - y02), y = this.ymax;
      else if (c & 4) x = x02 + (x12 - x02) * (this.ymin - y02) / (y12 - y02), y = this.ymin;
      else if (c & 2) y = y02 + (y12 - y02) * (this.xmax - x02) / (x12 - x02), x = this.xmax;
      else y = y02 + (y12 - y02) * (this.xmin - x02) / (x12 - x02), x = this.xmin;
      if (c0) x02 = x, y02 = y, c0 = this._regioncode(x02, y02);
      else x12 = x, y12 = y, c1 = this._regioncode(x12, y12);
    }
  }
  _clipInfinite(i, points, vx0, vy0, vxn, vyn) {
    let P = Array.from(points), p;
    if (p = this._project(P[0], P[1], vx0, vy0)) P.unshift(p[0], p[1]);
    if (p = this._project(P[P.length - 2], P[P.length - 1], vxn, vyn)) P.push(p[0], p[1]);
    if (P = this._clipFinite(i, P)) {
      for (let j = 0, n = P.length, c0, c1 = this._edgecode(P[n - 2], P[n - 1]); j < n; j += 2) {
        c0 = c1, c1 = this._edgecode(P[j], P[j + 1]);
        if (c0 && c1) j = this._edge(i, c0, c1, P, j), n = P.length;
      }
    } else if (this.contains(i, (this.xmin + this.xmax) / 2, (this.ymin + this.ymax) / 2)) {
      P = [this.xmin, this.ymin, this.xmax, this.ymin, this.xmax, this.ymax, this.xmin, this.ymax];
    }
    return P;
  }
  _edge(i, e0, e1, P, j) {
    while (e0 !== e1) {
      let x, y;
      switch (e0) {
        case 5:
          e0 = 4;
          continue;
        // top-left
        case 4:
          e0 = 6, x = this.xmax, y = this.ymin;
          break;
        // top
        case 6:
          e0 = 2;
          continue;
        // top-right
        case 2:
          e0 = 10, x = this.xmax, y = this.ymax;
          break;
        // right
        case 10:
          e0 = 8;
          continue;
        // bottom-right
        case 8:
          e0 = 9, x = this.xmin, y = this.ymax;
          break;
        // bottom
        case 9:
          e0 = 1;
          continue;
        // bottom-left
        case 1:
          e0 = 5, x = this.xmin, y = this.ymin;
          break;
      }
      if ((P[j] !== x || P[j + 1] !== y) && this.contains(i, x, y)) {
        P.splice(j, 0, x, y), j += 2;
      }
    }
    return j;
  }
  _project(x02, y02, vx, vy) {
    let t = Infinity, c, x, y;
    if (vy < 0) {
      if (y02 <= this.ymin) return null;
      if ((c = (this.ymin - y02) / vy) < t) y = this.ymin, x = x02 + (t = c) * vx;
    } else if (vy > 0) {
      if (y02 >= this.ymax) return null;
      if ((c = (this.ymax - y02) / vy) < t) y = this.ymax, x = x02 + (t = c) * vx;
    }
    if (vx > 0) {
      if (x02 >= this.xmax) return null;
      if ((c = (this.xmax - x02) / vx) < t) x = this.xmax, y = y02 + (t = c) * vy;
    } else if (vx < 0) {
      if (x02 <= this.xmin) return null;
      if ((c = (this.xmin - x02) / vx) < t) x = this.xmin, y = y02 + (t = c) * vy;
    }
    return [x, y];
  }
  _edgecode(x, y) {
    return (x === this.xmin ? 1 : x === this.xmax ? 2 : 0) | (y === this.ymin ? 4 : y === this.ymax ? 8 : 0);
  }
  _regioncode(x, y) {
    return (x < this.xmin ? 1 : x > this.xmax ? 2 : 0) | (y < this.ymin ? 4 : y > this.ymax ? 8 : 0);
  }
  _simplify(P) {
    if (P && P.length > 4) {
      for (let i = 0; i < P.length; i += 2) {
        const j = (i + 2) % P.length, k = (i + 4) % P.length;
        if (P[i] === P[j] && P[j] === P[k] || P[i + 1] === P[j + 1] && P[j + 1] === P[k + 1]) {
          P.splice(j, 2), i -= 2;
        }
      }
      if (!P.length) P = null;
    }
    return P;
  }
};

// node_modules/d3-delaunay/src/delaunay.js
var tau = 2 * Math.PI;
var pow = Math.pow;
function pointX(p) {
  return p[0];
}
function pointY(p) {
  return p[1];
}
function collinear(d) {
  const { triangles, coords } = d;
  for (let i = 0; i < triangles.length; i += 3) {
    const a = 2 * triangles[i], b = 2 * triangles[i + 1], c = 2 * triangles[i + 2], cross = (coords[c] - coords[a]) * (coords[b + 1] - coords[a + 1]) - (coords[b] - coords[a]) * (coords[c + 1] - coords[a + 1]);
    if (cross > 1e-10) return false;
  }
  return true;
}
function jitter(x, y, r2) {
  return [x + Math.sin(x + y) * r2, y + Math.cos(x - y) * r2];
}
var Delaunay = class _Delaunay {
  static from(points, fx = pointX, fy = pointY, that) {
    return new _Delaunay("length" in points ? flatArray(points, fx, fy, that) : Float64Array.from(flatIterable(points, fx, fy, that)));
  }
  constructor(points) {
    this._delaunator = new Delaunator(points);
    this.inedges = new Int32Array(points.length / 2);
    this._hullIndex = new Int32Array(points.length / 2);
    this.points = this._delaunator.coords;
    this._init();
  }
  update() {
    this._delaunator.update();
    this._init();
    return this;
  }
  _init() {
    const d = this._delaunator, points = this.points;
    if (d.hull && d.hull.length > 2 && collinear(d)) {
      this.collinear = Int32Array.from({ length: points.length / 2 }, (_, i) => i).sort((i, j) => points[2 * i] - points[2 * j] || points[2 * i + 1] - points[2 * j + 1]);
      const e = this.collinear[0], f2 = this.collinear[this.collinear.length - 1], bounds = [points[2 * e], points[2 * e + 1], points[2 * f2], points[2 * f2 + 1]], r2 = 1e-8 * Math.hypot(bounds[3] - bounds[1], bounds[2] - bounds[0]);
      for (let i = 0, n = points.length / 2; i < n; ++i) {
        const p = jitter(points[2 * i], points[2 * i + 1], r2);
        points[2 * i] = p[0];
        points[2 * i + 1] = p[1];
      }
      this._delaunator = new Delaunator(points);
    } else {
      delete this.collinear;
    }
    const halfedges = this.halfedges = this._delaunator.halfedges;
    const hull = this.hull = this._delaunator.hull;
    const triangles = this.triangles = this._delaunator.triangles;
    const inedges = this.inedges.fill(-1);
    const hullIndex = this._hullIndex.fill(-1);
    for (let e = 0, n = halfedges.length; e < n; ++e) {
      const p = triangles[e % 3 === 2 ? e - 2 : e + 1];
      if (halfedges[e] === -1 || inedges[p] === -1) inedges[p] = e;
    }
    for (let i = 0, n = hull.length; i < n; ++i) {
      hullIndex[hull[i]] = i;
    }
    if (hull.length <= 2 && hull.length > 0) {
      this.triangles = new Int32Array(3).fill(-1);
      this.halfedges = new Int32Array(3).fill(-1);
      this.triangles[0] = hull[0];
      inedges[hull[0]] = 1;
      if (hull.length === 2) {
        inedges[hull[1]] = 0;
        this.triangles[1] = hull[1];
        this.triangles[2] = hull[1];
      }
    }
  }
  voronoi(bounds) {
    return new Voronoi(this, bounds);
  }
  *neighbors(i) {
    const { inedges, hull, _hullIndex, halfedges, triangles, collinear: collinear2 } = this;
    if (collinear2) {
      const l = collinear2.indexOf(i);
      if (l > 0) yield collinear2[l - 1];
      if (l < collinear2.length - 1) yield collinear2[l + 1];
      return;
    }
    const e0 = inedges[i];
    if (e0 === -1) return;
    let e = e0, p0 = -1;
    do {
      yield p0 = triangles[e];
      e = e % 3 === 2 ? e - 2 : e + 1;
      if (triangles[e] !== i) return;
      e = halfedges[e];
      if (e === -1) {
        const p = hull[(_hullIndex[i] + 1) % hull.length];
        if (p !== p0) yield p;
        return;
      }
    } while (e !== e0);
  }
  find(x, y, i = 0) {
    if ((x = +x, x !== x) || (y = +y, y !== y)) return -1;
    const i0 = i;
    let c;
    while ((c = this._step(i, x, y)) >= 0 && c !== i && c !== i0) i = c;
    return c;
  }
  _step(i, x, y) {
    const { inedges, hull, _hullIndex, halfedges, triangles, points } = this;
    if (inedges[i] === -1 || !points.length) return (i + 1) % (points.length >> 1);
    let c = i;
    let dc = pow(x - points[i * 2], 2) + pow(y - points[i * 2 + 1], 2);
    const e0 = inedges[i];
    let e = e0;
    do {
      let t = triangles[e];
      const dt = pow(x - points[t * 2], 2) + pow(y - points[t * 2 + 1], 2);
      if (dt < dc) dc = dt, c = t;
      e = e % 3 === 2 ? e - 2 : e + 1;
      if (triangles[e] !== i) break;
      e = halfedges[e];
      if (e === -1) {
        e = hull[(_hullIndex[i] + 1) % hull.length];
        if (e !== t) {
          if (pow(x - points[e * 2], 2) + pow(y - points[e * 2 + 1], 2) < dc) return e;
        }
        break;
      }
    } while (e !== e0);
    return c;
  }
  render(context) {
    const buffer = context == null ? context = new Path() : void 0;
    const { points, halfedges, triangles } = this;
    for (let i = 0, n = halfedges.length; i < n; ++i) {
      const j = halfedges[i];
      if (j < i) continue;
      const ti = triangles[i] * 2;
      const tj = triangles[j] * 2;
      context.moveTo(points[ti], points[ti + 1]);
      context.lineTo(points[tj], points[tj + 1]);
    }
    this.renderHull(context);
    return buffer && buffer.value();
  }
  renderPoints(context, r2) {
    if (r2 === void 0 && (!context || typeof context.moveTo !== "function")) r2 = context, context = null;
    r2 = r2 == void 0 ? 2 : +r2;
    const buffer = context == null ? context = new Path() : void 0;
    const { points } = this;
    for (let i = 0, n = points.length; i < n; i += 2) {
      const x = points[i], y = points[i + 1];
      context.moveTo(x + r2, y);
      context.arc(x, y, r2, 0, tau);
    }
    return buffer && buffer.value();
  }
  renderHull(context) {
    const buffer = context == null ? context = new Path() : void 0;
    const { hull, points } = this;
    const h = hull[0] * 2, n = hull.length;
    context.moveTo(points[h], points[h + 1]);
    for (let i = 1; i < n; ++i) {
      const h2 = 2 * hull[i];
      context.lineTo(points[h2], points[h2 + 1]);
    }
    context.closePath();
    return buffer && buffer.value();
  }
  hullPolygon() {
    const polygon = new Polygon();
    this.renderHull(polygon);
    return polygon.value();
  }
  renderTriangle(i, context) {
    const buffer = context == null ? context = new Path() : void 0;
    const { points, triangles } = this;
    const t0 = triangles[i *= 3] * 2;
    const t1 = triangles[i + 1] * 2;
    const t2 = triangles[i + 2] * 2;
    context.moveTo(points[t0], points[t0 + 1]);
    context.lineTo(points[t1], points[t1 + 1]);
    context.lineTo(points[t2], points[t2 + 1]);
    context.closePath();
    return buffer && buffer.value();
  }
  *trianglePolygons() {
    const { triangles } = this;
    for (let i = 0, n = triangles.length / 3; i < n; ++i) {
      yield this.trianglePolygon(i);
    }
  }
  trianglePolygon(i) {
    const polygon = new Polygon();
    this.renderTriangle(i, polygon);
    return polygon.value();
  }
};
function flatArray(points, fx, fy, that) {
  const n = points.length;
  const array = new Float64Array(n * 2);
  for (let i = 0; i < n; ++i) {
    const p = points[i];
    array[i * 2] = fx.call(that, p, i, points);
    array[i * 2 + 1] = fy.call(that, p, i, points);
  }
  return array;
}
function* flatIterable(points, fx, fy, that) {
  let i = 0;
  for (const p of points) {
    yield fx.call(that, p, i, points);
    yield fy.call(that, p, i, points);
    ++i;
  }
}

// src/engine/graph.ts
var MinHeap = class {
  k = [];
  v = [];
  get size() {
    return this.k.length;
  }
  push(key, val) {
    const k = this.k, v2 = this.v;
    let i = k.length;
    k.push(key);
    v2.push(val);
    while (i > 0) {
      const p = i - 1 >> 1;
      if (k[p] <= k[i]) break;
      [k[p], k[i]] = [k[i], k[p]];
      [v2[p], v2[i]] = [v2[i], v2[p]];
      i = p;
    }
  }
  pop() {
    const k = this.k, v2 = this.v;
    const rk = k[0], rv = v2[0];
    const lk = k.pop(), lv = v2.pop();
    if (k.length) {
      k[0] = lk;
      v2[0] = lv;
      let i = 0;
      const n = k.length;
      for (; ; ) {
        const l = i * 2 + 1, r2 = l + 1;
        let m2 = i;
        if (l < n && k[l] < k[m2]) m2 = l;
        if (r2 < n && k[r2] < k[m2]) m2 = r2;
        if (m2 === i) break;
        [k[m2], k[i]] = [k[i], k[m2]];
        [v2[m2], v2[i]] = [v2[i], v2[m2]];
        i = m2;
      }
    }
    return [rk, rv];
  }
};
function dijkstra(n, adj, sources) {
  const dist3 = new Array(n).fill(Infinity);
  const prev = new Array(n).fill(-1);
  const h = new MinHeap();
  for (const s of sources) {
    dist3[s] = 0;
    h.push(0, s);
  }
  while (h.size) {
    const [d, u4] = h.pop();
    if (d > dist3[u4]) continue;
    for (const [v2, c] of adj[u4]) {
      const nd = d + c;
      if (nd < dist3[v2]) {
        dist3[v2] = nd;
        prev[v2] = u4;
        h.push(nd, v2);
      }
    }
  }
  return { dist: dist3, prev };
}
function tracePath(prev, from) {
  const out2 = [from];
  let u4 = from;
  let guard = 0;
  while (prev[u4] >= 0 && guard++ < 1e5) {
    u4 = prev[u4];
    out2.push(u4);
  }
  return out2;
}

// src/engine/types.ts
var edgeKey = (a, b) => a < b ? a + "_" + b : b + "_" + a;

// src/engine/plan.ts
function makeElev(t) {
  const n1 = new Noise(t.seed), n2 = new Noise(t.seed + 77);
  const c = Math.cos(t.ang), s = Math.sin(t.ang);
  return (x, y) => {
    let e = t.amt * (0.55 * n1.fbm(x / 520 + 3, y / 520 + 9, 4) + 0.14 * n2.fbm(x / 140, y / 140, 2));
    if (t.geo === "hills") e += 0.8 * Math.exp(-(((x + 30) ** 2 + (y - 20) ** 2) / (2 * 300 * 300)));
    if (t.geo === "mountain") {
      const v2 = Math.abs(-x * s + y * c);
      e += 1 * smooth(110, 720, v2) + 0.12 * n2.fbm(x / 90, y / 90, 3);
    }
    return e;
  };
}
function createCtx(params, seed2) {
  const rng = new RNG(seed2);
  const resolved = resolveParams(params);
  const st = settlementFor(params);
  const R2 = st.radius;
  const N = st.blocks;
  const seaAng = rng.range(0, Math.PI * 2);
  const terrain = {
    seed: rng.int(1, 1e6),
    amt: 0.2 + 1.1 * params.terrain,
    geo: resolved.geo,
    ang: resolved.geo === "coast" ? seaAng : rng.range(0, Math.PI * 2)
  };
  const BR = Math.max(430, R2 * 2.3);
  const noise = new Noise(rng.int(1, 1e6));
  const seaOff = R2 * 0.62;
  let sea = (_x, _y) => false;
  if (resolved.geo === "coast") {
    const nx = Math.cos(seaAng), ny = Math.sin(seaAng);
    sea = (x, y) => {
      const u4 = x * nx + y * ny, v2 = -x * ny + y * nx;
      return u4 > seaOff + 11e-4 * v2 * v2 + (noise.fbm(x / (R2 * 0.55) + 11, y / (R2 * 0.55) + 7, 3) - 0.5) * R2 * 0.19;
    };
  }
  const city2 = {
    version: 3,
    params,
    settlement: st,
    resolved,
    name: "",
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
    seedUsed: seed2
  };
  return {
    ctx: { city: city2, rng, N, R: R2, ei: /* @__PURE__ */ new Map(), sea, elev: makeElev(terrain), noise, riverVids: /* @__PURE__ */ new Set(), seaAng, seaOff, harbourEdges: /* @__PURE__ */ new Set() },
    resolved
  };
}
function blankCell(id, vids, center) {
  return {
    id,
    vids,
    nbrs: [],
    kind: "outside",
    center,
    elev: 0,
    district: -1,
    layout: "blocks",
    variant: 0,
    inner: false,
    depth: 99,
    ground: [],
    blocks: [],
    open: [],
    cuts: [],
    yards: [],
    trees: [],
    stalls: [],
    graves: []
  };
}
function buildMesh(ctx) {
  const { city: city2, rng, N, R: R2 } = ctx;
  const B2 = city2.bounds;
  const sites = [];
  const c = R2 / Math.sqrt(N * 0.9);
  const nIn = Math.max(14, Math.round(N * 2.2));
  const sa = rng.range(0, Math.PI * 2);
  let rMax = 0;
  for (let i = 0; i < nIn; i++) {
    const a = sa + i * 2.39996 + rng.range(-0.05, 0.05);
    const r2 = c * Math.sqrt(i + 0.5) * (0.78 + 0.3 * Math.min(1, i / N)) * rng.range(0.96, 1.04);
    rMax = Math.max(rMax, r2);
    sites.push([Math.cos(a) * r2, Math.sin(a) * r2]);
  }
  const sp = Math.max(70, R2 * 0.37);
  for (let x = B2[0] + sp / 2; x < B2[2]; x += sp)
    for (let y = B2[1] + sp / 2; y < B2[3]; y += sp) {
      const p = [x + rng.range(-0.38, 0.38) * sp, y + rng.range(-0.38, 0.38) * sp];
      if (Math.hypot(p[0], p[1]) > R2 * 1.04) sites.push(p);
    }
  for (let it = 0; it < 2; it++) {
    const vor2 = Delaunay.from(sites).voronoi(B2);
    for (let i = 0; i < nIn; i++) {
      const poly2 = vor2.cellPolygon(i);
      if (poly2) sites[i] = centroid(poly2.slice(0, -1));
    }
  }
  const vor = Delaunay.from(sites).voronoi(B2);
  const snap = /* @__PURE__ */ new Map();
  const verts = [];
  const vid = (p) => {
    const k = Math.round(p[0] / 2.4) + "," + Math.round(p[1] / 2.4);
    let id = snap.get(k);
    if (id === void 0) {
      id = verts.length;
      verts.push([p[0], p[1]]);
      snap.set(k, id);
    }
    return id;
  };
  const cells = [];
  for (let i = 0; i < sites.length; i++) {
    const poly2 = vor.cellPolygon(i);
    let vids = [];
    if (poly2) {
      for (const p of poly2.slice(0, -1)) {
        const id = vid(p);
        if (vids[vids.length - 1] !== id) vids.push(id);
      }
      if (vids.length > 1 && vids[0] === vids[vids.length - 1]) vids.pop();
    }
    if (vids.length >= 3 && area(vids.map((v2) => verts[v2])) < 0) vids.reverse();
    const pts = vids.map((v2) => verts[v2]);
    const cell = blankCell(i, vids, vids.length >= 3 ? centroid(pts) : sites[i]);
    cells.push(cell);
  }
  city2.verts = verts;
  city2.cells = cells;
  const ei = /* @__PURE__ */ new Map();
  for (const cell of cells) {
    const n = cell.vids.length;
    for (let i = 0; i < n; i++) {
      const a = cell.vids[i], b = cell.vids[(i + 1) % n];
      if (a === b) continue;
      const k = edgeKey(a, b);
      let e = ei.get(k);
      if (!e) ei.set(k, e = { a: Math.min(a, b), b: Math.max(a, b), cells: [] });
      e.cells.push(cell.id);
    }
  }
  for (const cell of cells) {
    const n = cell.vids.length;
    cell.nbrs = [];
    for (let i = 0; i < n; i++) {
      const e = ei.get(edgeKey(cell.vids[i], cell.vids[(i + 1) % n]));
      cell.nbrs.push(e ? e.cells.find((x) => x !== cell.id) ?? -1 : -1);
    }
    cell.elev = ctx.elev(cell.center[0], cell.center[1]);
    cell.kind = cell.vids.length >= 3 && ctx.sea(cell.center[0], cell.center[1]) ? "sea" : "outside";
  }
  ctx.ei = ei;
}
var poly = (city2, cell) => cell.vids.map((v2) => city2.verts[v2]);
function makeRiver(ctx) {
  const { city: city2, rng, R: R2 } = ctx;
  const res = city2.resolved;
  if (!city2.settlement.river) return true;
  const B2 = city2.bounds;
  const nV = city2.verts.length;
  const coast = res.geo === "coast";
  const off = rng.range(0.08, 0.28) * R2 * (rng.chance(0.5) ? 1 : -1);
  let dx, dy;
  if (coast) {
    dx = Math.cos(ctx.seaAng);
    dy = Math.sin(ctx.seaAng);
  } else {
    const a = rng.range(0, Math.PI * 2);
    dx = Math.cos(a);
    dy = Math.sin(a);
  }
  const px2 = -dy, py = dx;
  const FAR = R2 * 2.9;
  const start = [-dx * FAR + px2 * off, -dy * FAR + py * off];
  const end = coast ? [dx * (ctx.seaOff + 11e-4 * off * off) + px2 * off, dy * (ctx.seaOff + 11e-4 * off * off) + py * off] : [dx * FAR + px2 * rng.range(-0.25, 0.25) * R2, dy * FAR + py * rng.range(-0.25, 0.25) * R2];
  const A = rng.range(R2 * 0.12, R2 * 0.27), f2 = rng.range(0.9, 1.7), ph = rng.range(0, 6.28);
  const guide = [];
  const GN = 140;
  for (let i = 0; i <= GN; i++) {
    const t = i / GN;
    const w = A * Math.sin(Math.PI * 2 * f2 * t + ph) * (coast ? 1 - t * 0.5 : 1);
    guide.push([lerp(start[0], end[0], t) + px2 * w, lerp(start[1], end[1], t) + py * w]);
  }
  const gd = (p) => {
    let best = Infinity;
    for (const g2 of guide) best = Math.min(best, Math.hypot(p[0] - g2[0], p[1] - g2[1]));
    return best;
  };
  const adj = Array.from({ length: nV }, () => []);
  for (const e of ctx.ei.values()) {
    if (e.cells.some((c) => city2.cells[c].kind === "sea")) continue;
    const a = city2.verts[e.a], b = city2.verts[e.b];
    let cost = dist(a, b) * (1 + (gd(mid(a, b)) / (R2 * 0.12)) ** 2);
    if (e.cells.length < 2) cost *= 8;
    adj[e.a].push([e.b, cost]);
    adj[e.b].push([e.a, cost]);
  }
  const border = (p) => p[0] <= B2[0] + 1 || p[0] >= B2[2] - 1 || p[1] <= B2[1] + 1 || p[1] >= B2[3] - 1;
  const seaVert = /* @__PURE__ */ new Set(), landVert = /* @__PURE__ */ new Set();
  for (const c of city2.cells) for (const v2 of c.vids) (c.kind === "sea" ? seaVert : landVert).add(v2);
  let sv = -1, ev = -1, sd = Infinity, ed = Infinity;
  for (let v2 = 0; v2 < nV; v2++) {
    const p = city2.verts[v2];
    if (adj[v2].length === 0) continue;
    if (border(p) && !seaVert.has(v2)) {
      const d = dist(p, start);
      if (d < sd) sd = d, sv = v2;
      if (!coast) {
        const d2 = dist(p, end);
        if (d2 < ed) ed = d2, ev = v2;
      }
    }
    if (coast && seaVert.has(v2) && landVert.has(v2)) {
      const d2 = dist(p, end);
      if (d2 < ed) ed = d2, ev = v2;
    }
  }
  if (sv < 0 || ev < 0) return false;
  const { dist: dd, prev } = dijkstra(nV, adj, [sv]);
  if (!isFinite(dd[ev])) return false;
  const vids = tracePath(prev, ev).reverse();
  if (vids.length < 6) return false;
  const base = city2.settlement.riverWidth;
  const n = vids.length;
  const ws = vids.map((_, k) => base * (coast ? 0.7 + 0.9 * (k / (n - 1)) ** 2 : 0.8 + 0.4 * (k / (n - 1))));
  const raw = vids.map((v2) => city2.verts[v2]);
  const sm = chaikin(raw, 2, 0.22);
  const sw = chaikin(ws.map((w) => [w, 0]), 2, 0.22).map((p) => p[0]);
  const ew = {};
  for (let k = 0; k < n - 1; k++) ew[edgeKey(vids[k], vids[k + 1])] = (ws[k] + ws[k + 1]) / 2;
  city2.river = { vids, pts: sm, w: sw, ew };
  ctx.riverVids = new Set(vids);
  return true;
}
function selectCity(ctx) {
  const { city: city2, rng, N } = ctx;
  const cells = city2.cells;
  const nz = new Noise(rng.int(1, 1e6));
  const land = cells.filter((c) => c.kind !== "sea" && c.vids.length >= 3);
  const key = (c) => {
    const a = Math.atan2(c.center[1], c.center[0]);
    const w = 0.84 + 0.32 * nz.fbm(Math.cos(a) * 1.3 + 5, Math.sin(a) * 1.3 + 5, 2);
    return Math.hypot(c.center[0], c.center[1]) / w;
  };
  land.sort((a, b) => key(a) - key(b));
  for (const c of land.slice(0, N)) c.kind = "city";
  const isCity = (id) => id >= 0 && cells[id].kind === "city";
  const root = land[0];
  const seen = /* @__PURE__ */ new Set([root.id]);
  const q = [root.id];
  while (q.length) {
    const u4 = q.pop();
    for (const n of cells[u4].nbrs) if (isCity(n) && !seen.has(n)) seen.add(n), q.push(n);
  }
  for (const c of cells) if (c.kind === "city" && !seen.has(c.id)) c.kind = "outside";
  const addable = (c) => c.kind === "outside" && c.vids.length >= 3;
  for (let pass = 0; pass < 3; pass++) {
    for (const c of cells) {
      if (!addable(c)) continue;
      const ns = c.nbrs.filter((n) => n >= 0);
      const cn = ns.filter((n) => isCity(n)).length;
      if (ns.length && cn / ns.length >= 0.6 && cn >= 2) c.kind = "city";
    }
  }
  {
    const comp2 = /* @__PURE__ */ new Map();
    const sizes = [];
    for (const c of cells) {
      if (c.kind !== "city" || comp2.has(c.id)) continue;
      const id = sizes.length;
      let n = 0;
      const st = [c.id];
      comp2.set(c.id, id);
      while (st.length) {
        const u4 = st.pop();
        n++;
        const cu = cells[u4];
        for (let i = 0; i < cu.nbrs.length; i++) {
          const nb = cu.nbrs[i];
          if (nb < 0 || cells[nb].kind !== "city" || comp2.has(nb)) continue;
          if (city2.river && edgeKey(cu.vids[i], cu.vids[(i + 1) % cu.vids.length]) in city2.river.ew) continue;
          comp2.set(nb, id);
          st.push(nb);
        }
      }
      sizes.push(n);
    }
    let biggest = 0;
    for (const sz of sizes) biggest = Math.max(biggest, sz);
    const minKeep = Math.max(2, Math.round(city2.settlement.blocks * 0.08));
    for (const c of cells)
      if (c.kind === "city") {
        const sz = sizes[comp2.get(c.id)];
        if (sz < minKeep && sz < biggest) c.kind = "outside";
      }
  }
  const depth = /* @__PURE__ */ new Map();
  let frontier = [];
  for (const c of cells)
    if (c.kind === "city" && c.nbrs.some((n) => !isCity(n))) {
      depth.set(c.id, 0);
      frontier.push(c.id);
    }
  while (frontier.length) {
    const nx = [];
    for (const u4 of frontier)
      for (const n of cells[u4].nbrs)
        if (isCity(n) && !depth.has(n)) {
          depth.set(n, depth.get(u4) + 1);
          nx.push(n);
        }
    frontier = nx;
  }
  for (const c of cells) if (c.kind === "city") c.depth = depth.get(c.id) ?? 0;
}
function classifyEdges(ctx) {
  const { city: city2 } = ctx;
  const walls = city2.settlement.wall !== "none";
  const edges = {};
  for (const [k, e] of ctx.ei) {
    const ks = e.cells.map((c) => city2.cells[c].kind);
    const nCity = ks.filter((x) => x === "city").length;
    const isRiver = !!city2.river && k in city2.river.ew;
    if (nCity === 0) {
      if (isRiver) edges[k] = "river";
      continue;
    }
    if (nCity === 2) edges[k] = isRiver ? "river" : "minor";
    else if (ks.includes("sea")) edges[k] = "coast";
    else if (isRiver) edges[k] = "river";
    else edges[k] = walls ? "wallO" : "open";
  }
  city2.edges = edges;
}
function outlineLoops(city2, inSet) {
  const next = /* @__PURE__ */ new Map();
  for (const c of city2.cells) {
    if (!inSet(c.id)) continue;
    const n = c.vids.length;
    for (let i = 0; i < n; i++) {
      if (!inSet(c.nbrs[i])) {
        const a = c.vids[i], b = c.vids[(i + 1) % n];
        if (!next.has(a)) next.set(a, []);
        next.get(a).push(b);
      }
    }
  }
  const loops = [];
  for (const [s] of next) {
    while (next.get(s)?.length) {
      const loop = [s];
      let u4 = s;
      let guard = 0;
      for (; ; ) {
        const l = next.get(u4);
        if (!l || !l.length || guard++ > 5e3) break;
        const v2 = l.shift();
        if (v2 === s) break;
        loop.push(v2);
        u4 = v2;
      }
      if (loop.length >= 3) loops.push(loop);
    }
  }
  return loops.filter((l) => area(cleanPoly(l.map((v2) => city2.verts[v2]))) > 0);
}

// src/engine/roads.ts
var STREET_CLS = /* @__PURE__ */ new Set(["minor", "secondary", "arterial"]);
var RANK = { minor: 0, secondary: 1, arterial: 2 };
function vertexEdges(ei) {
  const m2 = /* @__PURE__ */ new Map();
  for (const [k, e] of ei)
    for (const v2 of [e.a, e.b]) {
      let l = m2.get(v2);
      if (!l) m2.set(v2, l = []);
      l.push(k);
    }
  return m2;
}
function chooseMarket(ctx) {
  const { city: city2, rng } = ctx;
  if (!city2.settlement.market) return;
  const cc2 = city2.cells.filter((c) => c.kind === "city");
  let tx = 0, ty = 0;
  for (const c of cc2) tx += c.center[0], ty += c.center[1];
  tx /= cc2.length;
  ty /= cc2.length;
  let best = null, bs = Infinity;
  for (const c of cc2) {
    const pts = c.vids.map((v2) => city2.verts[v2]);
    const a = area(pts);
    let s = Math.hypot(c.center[0] - tx, c.center[1] - ty);
    if (a < 2600) s += 300;
    if (c.vids.length < 5) s += 80;
    if (c.nbrs.some((n) => n >= 0 && city2.cells[n].kind === "sea")) s += 200;
    if (s < bs) bs = s, best = c;
  }
  best.layout = "market";
  best.ward = "market";
  city2.marketCell = best.id;
  if (city2.settlement.marketCells > 1) {
    const cc3 = city2.cells.filter((c) => c.kind === "city" && c.layout === "blocks");
    let second = null, ss = -Infinity;
    for (const c of cc3) {
      const d = dist(c.center, best.center);
      const s = d + rng.range(0, 200) - (d < 160 ? 400 : 0);
      if (s > ss) ss = s, second = c;
    }
    if (second) {
      second.layout = "market";
      second.ward = "market";
      second.variant = 1;
      city2.secondMarketCell = second.id;
    }
  }
}
function buildInnerWall(ctx) {
  const { city: city2 } = ctx;
  if (city2.settlement.wall !== "double") return;
  const cells = city2.cells;
  const market = cells[city2.marketCell];
  const nCity = cells.filter((c) => c.kind === "city").length;
  const target = Math.max(7, Math.round(nCity * 0.34));
  const inner = /* @__PURE__ */ new Set([market.id]);
  while (inner.size < target) {
    let best = -1, bd2 = Infinity;
    for (const id of inner)
      for (const n of cells[id].nbrs) {
        if (n < 0 || inner.has(n) || cells[n].kind !== "city") continue;
        const c = cells[n];
        const d = dist(c.center, market.center) + (c.depth === 0 ? 500 : 0);
        if (d < bd2) bd2 = d, best = n;
      }
    if (best < 0) break;
    inner.add(best);
  }
  for (let pass = 0; pass < 3; pass++) {
    for (const c of cells) {
      if (c.kind !== "city" || inner.has(c.id)) continue;
      const ns = c.nbrs.filter((n) => n >= 0);
      const k = ns.filter((n) => inner.has(n)).length;
      if (k >= 2 && k / ns.length >= 0.6) inner.add(c.id);
    }
  }
  for (const id of inner) cells[id].inner = true;
  for (const [k, e] of ctx.ei) {
    if (e.cells.length !== 2 || city2.edges[k] !== "minor") continue;
    const [a, b] = e.cells;
    if (cells[a].inner !== cells[b].inner) city2.edges[k] = "wallI";
  }
}
var angDiff = (a, b) => Math.abs((a - b + 3 * Math.PI) % (2 * Math.PI) - Math.PI);
function makeOuterRoad(city2, ei, rng, g2, dir) {
  const P = city2.verts[g2];
  const cityV = /* @__PURE__ */ new Set();
  for (const c of city2.cells) if (c.kind === "city") for (const v2 of c.vids) cityV.add(v2);
  const X = city2.cells.find((c) => c.kind === "outside" && c.vids.includes(g2));
  if (!X) return null;
  let w = -1, bs = -Infinity;
  for (const v2 of X.vids) {
    if (cityV.has(v2)) continue;
    const q = city2.verts[v2];
    const dd2 = (q[0] - P[0]) * dir[0] + (q[1] - P[1]) * dir[1];
    if (dd2 > bs) bs = dd2, w = v2;
  }
  if (w < 0 || bs < 12) return null;
  const nV = city2.verts.length;
  const adj = Array.from({ length: nV }, () => []);
  for (const [k, e] of ei) {
    if (e.cells.some((c2) => city2.cells[c2].kind !== "outside")) continue;
    if (city2.river && k in city2.river.ew) continue;
    const c = dist(city2.verts[e.a], city2.verts[e.b]) * rng.range(0.85, 1.25);
    adj[e.a].push([e.b, c]);
    adj[e.b].push([e.a, c]);
  }
  const { dist: dd, prev } = dijkstra(nV, adj, [w]);
  const B2 = city2.bounds;
  const far = [P[0] + dir[0] * 3e3, P[1] + dir[1] * 3e3];
  let tv = -1, ts = Infinity;
  for (let v2 = 0; v2 < nV; v2++) {
    if (!isFinite(dd[v2])) continue;
    const p = city2.verts[v2];
    if (!(p[0] <= B2[0] + 1 || p[0] >= B2[2] - 1 || p[1] <= B2[1] + 1 || p[1] >= B2[3] - 1)) continue;
    const s = dist(p, far) + 0.25 * dd[v2];
    if (s < ts) ts = s, tv = v2;
  }
  if (tv < 0) return null;
  const path = tracePath(prev, tv).reverse();
  const pts = [P, ...path.map((v2) => city2.verts[v2])];
  return { pts: chaikin(pts, 2, 0.25), w: 5.5, gate: g2 };
}
function planGates(ctx) {
  const { city: city2, rng } = ctx;
  if (city2.settlement.wall === "none") return;
  const loops = outlineLoops(city2, (id) => id >= 0 && city2.cells[id].kind === "city");
  if (!loops.length) return;
  loops.sort((a, b) => area(b.map((v2) => city2.verts[v2])) - area(a.map((v2) => city2.verts[v2])));
  const loop = loops[0];
  const vE = vertexEdges(ctx.ei);
  const cc2 = city2.cells.filter((c) => c.kind === "city");
  const cen = [cc2.reduce((s, c) => s + c.center[0], 0) / cc2.length, cc2.reduce((s, c) => s + c.center[1], 0) / cc2.length];
  const n = loop.length;
  const pool = [];
  for (let i = 0; i < n; i++) {
    const v2 = loop[i], pv = loop[(i - 1 + n) % n], nv = loop[(i + 1) % n];
    const c1 = city2.edges[edgeKey(pv, v2)], c2 = city2.edges[edgeKey(v2, nv)];
    if (!(c1 === "wallO" || c1 === "open") || !(c2 === "wallO" || c2 === "open")) continue;
    if (ctx.riverVids.has(v2)) continue;
    if (!(vE.get(v2) ?? []).some((k) => city2.edges[k] === "minor")) continue;
    const tan = unit(sub(city2.verts[nv], city2.verts[pv]));
    pool.push({ v: v2, tan, dir: [tan[1], -tan[0]], ang: Math.atan2(city2.verts[v2][1] - cen[1], city2.verts[v2][0] - cen[0]) });
  }
  const chosen = [];
  const want = Math.min(city2.settlement.gates, pool.length);
  while (chosen.length < want && pool.length) {
    let best = -1, bs = -1;
    for (let i = 0; i < pool.length; i++) {
      const sep = chosen.length ? Math.min(...chosen.map((c2) => angDiff(c2.ang, pool[i].ang))) : Math.PI;
      const s = sep + rng.range(0, 0.4);
      if (s > bs) bs = s, best = i;
    }
    const c = pool.splice(best, 1)[0];
    if (chosen.length && Math.min(...chosen.map((x) => angDiff(x.ang, c.ang))) < 0.5) continue;
    const road = makeOuterRoad(city2, ctx.ei, rng, c.v, c.dir);
    if (!road) continue;
    chosen.push(c);
    city2.roads.push(road);
    city2.gates.push({ vid: c.v, p: city2.verts[c.v], kind: "main", wall: "outer", tan: c.tan, dir: c.dir });
  }
  const nPost = city2.settlement.gates >= 4 ? 2 : 1;
  let made = 0;
  const cand = pool.filter((c) => chosen.every((x) => angDiff(x.ang, c.ang) > 0.75)).sort(() => rng.next() - 0.5);
  for (const c of cand) {
    if (made >= nPost) break;
    if (city2.gates.some((g2) => g2.kind === "postern" && angDiff(Math.atan2(g2.p[1] - cen[1], g2.p[0] - cen[0]), c.ang) < 0.9)) continue;
    const road = makeOuterRoad(city2, ctx.ei, rng, c.v, c.dir);
    if (!road) continue;
    road.w = 2.6;
    city2.roads.push(road);
    city2.gates.push({ vid: c.v, p: city2.verts[c.v], kind: "postern", wall: "outer", tan: c.tan, dir: c.dir });
    made++;
  }
}
function inwardNormal(city2, cell, a, b) {
  const n = cell.vids.length;
  for (let i = 0; i < n; i++) {
    const u4 = cell.vids[i], w = cell.vids[(i + 1) % n];
    if (u4 === a && w === b || u4 === b && w === a) {
      const P = city2.verts[u4], Q = city2.verts[w];
      return unit([-(Q[1] - P[1]), Q[0] - P[0]]);
    }
  }
  return null;
}
function planBridges(ctx) {
  const { city: city2, rng } = ctx;
  if (!city2.river || !city2.settlement.river) return [];
  const cells = city2.cells;
  const market = cells[city2.marketCell];
  const street = (c) => c === "minor" || c === "secondary" || c === "arterial";
  const comp2 = /* @__PURE__ */ new Map();
  let nc = 0;
  for (const c of cells) {
    if (c.kind !== "city" || comp2.has(c.id)) continue;
    const st = [c.id];
    comp2.set(c.id, nc);
    while (st.length) {
      const u4 = st.pop();
      const cu = cells[u4];
      for (let i = 0; i < cu.nbrs.length; i++) {
        const n = cu.nbrs[i];
        if (n < 0 || cells[n].kind !== "city" || comp2.has(n)) continue;
        if (city2.edges[edgeKey(cu.vids[i], cu.vids[(i + 1) % cu.vids.length])] === "river") continue;
        comp2.set(n, nc);
        st.push(n);
      }
    }
    nc++;
  }
  const parent = Array.from({ length: nc }, (_, i) => i);
  const find = (x) => parent[x] === x ? x : parent[x] = find(parent[x]);
  let inLen = 0;
  const gather = (minL, minT, sLo, minHitL) => {
    const cands = [];
    inLen = 0;
    for (const [k, rw] of Object.entries(city2.river.ew)) {
      const e = ctx.ei.get(k);
      if (!e || e.cells.length < 2) continue;
      const ca3 = cells[e.cells[0]], cb = cells[e.cells[1]];
      if (ca3.kind !== "city" || cb.kind !== "city") continue;
      const A = city2.verts[e.a], B2 = city2.verts[e.b];
      const L2 = dist(A, B2);
      inLen += L2;
      if (L2 < minL || ca3.layout !== "blocks" || cb.layout !== "blocks") continue;
      const m2 = mid(A, B2);
      const dA = inwardNormal(city2, ca3, e.a, e.b);
      if (!dA) continue;
      const dB = [-dA[0], -dA[1]];
      const hits = [];
      let ok = true;
      for (const [cell, d] of [[ca3, dA], [cb, dB]]) {
        const pl = cell.vids.map((v2) => city2.verts[v2]);
        const h = rayHit(pl, m2, d);
        if (!h || h.t < minT || h.s < sLo || h.s > 1 - sLo) {
          ok = false;
          break;
        }
        const u4 = cell.vids[h.i], w = cell.vids[(h.i + 1) % cell.vids.length];
        if (!street(city2.edges[edgeKey(u4, w)]) || dist(city2.verts[u4], city2.verts[w]) < minHitL) {
          ok = false;
          break;
        }
        hits.push({ p: h.p, e: [u4, w] });
      }
      if (!ok) continue;
      cands.push({
        b: { id: 0, m: m2, dir: dA, cells: [ca3.id, cb.id], w: 5, len: rw + 11, main: false, tower: false, edge: [e.a, e.b] },
        hits
      });
    }
    cands.sort((a, b) => dist(a.b.m, market.center) - dist(b.b.m, market.center));
    return cands;
  };
  const chosen = [];
  const used = /* @__PURE__ */ new Set();
  const take = (c) => {
    chosen.push(c);
    c.b.cells.forEach((x) => used.add(x));
  };
  const spanning = (cands) => {
    for (const c of cands) {
      if (c.b.cells.some((x) => used.has(x))) continue;
      const a = find(comp2.get(c.b.cells[0])), b = find(comp2.get(c.b.cells[1]));
      if (a === b) continue;
      parent[a] = b;
      take(c);
    }
  };
  const strict = gather(22, 22, 0.22, 14);
  const nb = clamp(Math.round(inLen / 230), 1, 4);
  spanning(strict);
  const roots = () => new Set([...comp2.values()].map(find)).size;
  if (roots() > 1) spanning(gather(12, 11, 0.14, 9));
  const extra = strict.map((c) => ({ c, k: rng.range(0, 90) })).sort((a, b) => a.k - b.k).map((x) => x.c);
  for (const c of extra) {
    if (chosen.length >= nb) break;
    if (chosen.includes(c) || c.b.cells.some((x) => used.has(x))) continue;
    if (chosen.some((o) => dist(o.b.m, c.b.m) < 120)) continue;
    take(c);
  }
  chosen.forEach((c, i) => c.b.id = i + 1);
  for (const pl of chosen) {
    city2.bridges.push(pl.b);
    const [a, b] = pl.b.cells;
    cells[a].cuts.push({ p: pl.b.m, d: pl.b.dir, w: 5, a: pl.b.m, b: pl.hits[0].p, kind: "bridge" });
    cells[b].cuts.push({ p: pl.b.m, d: [-pl.b.dir[0], -pl.b.dir[1]], w: 5, a: pl.b.m, b: pl.hits[1].p, kind: "bridge" });
    cells[a].locked = cells[b].locked = true;
  }
  return chosen;
}
var STREET_WORDS = ["Street", "Road", "Way", "Row", "Lane"];
function routeStreets(ctx, plans, hubs) {
  const { city: city2, rng } = ctx;
  const V = city2.verts.length;
  const market = city2.marketCell >= 0 ? city2.cells[city2.marketCell] : city2.cells.filter((c) => c.kind === "city").sort((a, b) => b.vids.length - a.vids.length)[0];
  const host = /* @__PURE__ */ new Map();
  const mkAdj = (costFn, withBridges) => {
    const adj2 = Array.from({ length: V + plans.length * 2 }, () => []);
    for (const [k, e] of ctx.ei) {
      const cls = city2.edges[k];
      const ring2 = withBridges && cls === "wallO" && !ctx.riverVids.has(e.a) && !ctx.riverVids.has(e.b);
      if (cls !== "minor" && !(withBridges && cls === "wallI") && !ring2) continue;
      const c = costFn(e.a, e.b, k, cls);
      adj2[e.a].push([e.b, c]);
      adj2[e.b].push([e.a, c]);
    }
    return adj2;
  };
  const base = mkAdj((a, b, _k, c) => dist(city2.verts[a], city2.verts[b]) * (c === "wallI" ? 0 : 1), true);
  const rf = /* @__PURE__ */ new Map();
  for (const k of ctx.ei.keys()) rf.set(k, rng.range(0.8, 1.3));
  const adj = mkAdj((a, b, k, c) => {
    const l = dist(city2.verts[a], city2.verts[b]);
    return c === "wallI" ? l * 2.4 + 16 : c === "wallO" ? l * 3.2 + 26 : l * rf.get(k);
  }, true);
  void base;
  const nodePts = [...city2.verts];
  plans.forEach((pl, i) => {
    for (let s = 0; s < 2; s++) {
      const node = V + i * 2 + s;
      const h = pl.hits[s];
      nodePts[node] = h.p;
      host.set(node, h.e);
      for (const v2 of h.e) {
        const c2 = dist(h.p, city2.verts[v2]);
        adj[node].push([v2, c2]);
        adj[v2].push([node, c2]);
      }
    }
    const c = (dist(pl.hits[0].p, pl.b.m) + dist(pl.b.m, pl.hits[1].p)) * 0.55;
    adj[V + i * 2].push([V + i * 2 + 1, c]);
    adj[V + i * 2 + 1].push([V + i * 2, c]);
  });
  const { dist: dd, prev } = dijkstra(adj.length, adj, market.vids);
  const innerKeys = /* @__PURE__ */ new Set();
  const addInnerGate = (k) => {
    if (innerKeys.has(k)) return;
    innerKeys.add(k);
    const e = ctx.ei.get(k);
    const A = city2.verts[e.a], B2 = city2.verts[e.b];
    const tan = unit(sub(B2, A));
    const p = mid(A, B2);
    const ic = city2.cells[e.cells.find((c) => city2.cells[c].inner) ?? e.cells[0]];
    let nrm = [-tan[1], tan[0]];
    if ((ic.center[0] - p[0]) * nrm[0] + (ic.center[1] - p[1]) * nrm[1] > 0) nrm = [-nrm[0], -nrm[1]];
    city2.gates.push({ vid: -1, p, kind: "inner", wall: "inner", tan, dir: nrm, edge: k });
  };
  const mark = (path, cls) => {
    for (let i = 0; i < path.length - 1; i++) {
      const x = path[i], y = path[i + 1];
      const xh = x >= V, yh = y >= V;
      let k = null;
      if (!xh && !yh) k = edgeKey(x, y);
      else if (xh && yh) {
        if (cls === "arterial") plans[Math.floor((x - V) / 2)].b.main = true;
      } else {
        const [u4, w] = host.get(xh ? x : y);
        k = edgeKey(u4, w);
      }
      if (!k) continue;
      const c = city2.edges[k];
      if (c === "wallI") addInnerGate(k);
      else if (c && RANK[c] !== void 0 && RANK[c] < RANK[cls]) city2.edges[k] = cls;
    }
  };
  const streets = [];
  const names = /* @__PURE__ */ new Set();
  const nameFor2 = (i) => {
    let nm = i === 0 ? "High Street" : i === 1 ? "Market Street" : placeWord(rng) + " " + rng.pick(STREET_WORDS);
    while (names.has(nm)) nm = placeWord(rng) + " " + rng.pick(STREET_WORDS);
    names.add(nm);
    return nm;
  };
  const addStreet = (path, kind) => {
    mark(path, kind);
    const vids = path.filter((x) => x < V);
    if (vids.length >= 3) streets.push({ name: nameFor2(streets.length), vids, kind });
  };
  const gates = city2.gates.filter((g2) => g2.wall === "outer");
  gates.forEach((g2) => {
    if (isFinite(dd[g2.vid])) addStreet(tracePath(prev, g2.vid), "arterial");
  });
  for (const h of hubs) {
    const c = city2.cells[h];
    let bv = -1, bd2 = Infinity;
    for (const v2 of c.vids) if (dd[v2] < bd2 && dd[v2] > 0) bd2 = dd[v2], bv = v2;
    if (bv >= 0) addStreet(tracePath(prev, bv), "secondary");
  }
  const R2 = ctx.R;
  const interior = [];
  const vE = vertexEdges(ctx.ei);
  for (let v2 = 0; v2 < V; v2++) {
    const es = vE.get(v2) ?? [];
    if (es.length >= 3 && es.every((k) => city2.edges[k] === "minor" || city2.edges[k] === "secondary" || city2.edges[k] === "arterial")) interior.push(v2);
  }
  const nRad = Math.round(1 + city2.params.roadComplexity * 4);
  for (let i = 0; i < nRad; i++) {
    const far = interior.filter((v2) => Math.hypot(city2.verts[v2][0] - market.center[0], city2.verts[v2][1] - market.center[1]) > 0.4 * R2 && isFinite(dd[v2]));
    if (!far.length) break;
    addStreet(tracePath(prev, rng.pick(far)), "secondary");
  }
  const nRing = Math.round(city2.params.roadComplexity * 2.4);
  for (let i = 0; i < nRing; i++) {
    const rho = R2 * rng.range(0.32, 0.52), th = rng.range(0, Math.PI * 2);
    const near = (a) => {
      const q = [market.center[0] + Math.cos(a) * rho, market.center[1] + Math.sin(a) * rho];
      let b = -1, bd2 = Infinity;
      for (const v2 of interior) {
        const d = dist(city2.verts[v2], q);
        if (d < bd2) bd2 = d, b = v2;
      }
      return b;
    };
    const s = near(th), t = near(th + rng.range(1.5, 2.6));
    if (s < 0 || t < 0 || s === t) continue;
    const ring2 = mkAdj((a, b) => {
      const A = city2.verts[a], B2 = city2.verts[b];
      const r2 = Math.hypot((A[0] + B2[0]) / 2 - market.center[0], (A[1] + B2[1]) / 2 - market.center[1]);
      return dist(A, B2) * (1 + 2.8 * Math.abs(r2 - rho) / rho);
    }, false);
    const res = dijkstra(V, ring2, [s]);
    if (isFinite(res.dist[t])) addStreet(tracePath(res.prev, t).reverse(), "secondary");
  }
  for (const pl of plans) {
    pl.b.w = pl.b.main ? 8 : 5.2;
    for (const ci of pl.b.cells) for (const cut of city2.cells[ci].cuts) if (cut.kind === "bridge" && Math.abs(cut.p[0] - pl.b.m[0]) < 1e-6) cut.w = pl.b.w;
    pl.b.tower = pl.b.main && (city2.params.identity === "ancient" || city2.params.identity === "hilltop" || city2.params.identity === "royal");
  }
  city2.streets = streets;
}
var WARD_W = { poor: 0.78, residential: 0.95, noble: 1.12, merchant: 1.05, market: 1.1, industrial: 1.1, artisan: 0.97, harbour: 1.08, military: 1.05 };
function assignWidths(ctx) {
  const { city: city2 } = ctx;
  for (const [k, e] of ctx.ei) {
    const cls = city2.edges[k];
    if (!cls || !STREET_CLS.has(cls)) continue;
    const t = city2.settlement.tierIndex;
    const wk = t === 0 ? 0.5 : t === 1 ? 0.66 : t === 2 ? 0.85 : 1;
    const base = (cls === "arterial" ? 9.6 : cls === "secondary" ? 6.6 : 4.4) * wk;
    const jit = 0.88 + 0.26 * hash01(k + city2.seedUsed);
    const f2 = e.cells.reduce((s, c) => s + (WARD_W[city2.cells[c].ward ?? ""] ?? 1), 0) / e.cells.length;
    city2.ew[k] = base * jit * f2;
  }
}
function planPlazas(ctx) {
  const { city: city2, rng } = ctx;
  const vE = vertexEdges(ctx.ei);
  const out2 = [];
  const cand = [];
  for (const [v2, es] of vE) {
    if (es.length < 3) continue;
    if (!es.every((k) => STREET_CLS.has(city2.edges[k] ?? ""))) continue;
    const big = es.filter((k) => city2.edges[k] === "arterial" || city2.edges[k] === "secondary").length;
    if (big < 2) continue;
    const pts = es.map((k) => {
      const e = ctx.ei.get(k);
      return dist(city2.verts[e.a], city2.verts[e.b]);
    });
    if (Math.min(...pts) < 26) continue;
    if (city2.cells.some((c) => c.vids.includes(v2) && (c.layout !== "blocks" || c.locked))) continue;
    cand.push(v2);
  }
  for (let i = cand.length - 1; i > 0; i--) {
    const j = rng.int(0, i + 1);
    [cand[i], cand[j]] = [cand[j], cand[i]];
  }
  const maxN = 3 + Math.round(city2.params.roadComplexity * 4);
  for (const v2 of cand) {
    if (out2.length >= maxN) break;
    if (out2.some((o) => dist(city2.verts[o.vid], city2.verts[v2]) < 110)) continue;
    out2.push({ vid: v2, r: rng.range(6.5, 9.5) });
  }
  city2.plazas = out2;
  for (const p of out2) {
    const kind = rng.weighted([["well", 5], ["statue", 2.5], ["fountain", 2.5]]);
    city2.features.push({ id: city2.nextId++, type: kind, p: city2.verts[p.vid] });
  }
}

// src/engine/districts.ts
var cellArea = (ctx, c) => area(poly(ctx.city, c));
function coastAdj(ctx, c) {
  return c.nbrs.some((n) => n >= 0 && ctx.city.cells[n].kind === "sea");
}
function riverAdj(ctx, c) {
  const r2 = ctx.city.river;
  if (!r2) return false;
  const n = c.vids.length;
  for (let i = 0; i < n; i++) if (edgeKey(c.vids[i], c.vids[(i + 1) % n]) in r2.ew) return true;
  return false;
}
function blankRef(cells) {
  return cells[0];
}
function chooseAnchors(ctx) {
  const { city: city2, rng } = ctx;
  const st = city2.settlement;
  const cells = city2.cells;
  const idn = identityOf(city2.params.identity);
  const cc2 = cells.filter((c) => c.kind === "city");
  const market = city2.marketCell >= 0 ? cells[city2.marketCell] : {
    ...cc2[0] ?? blankRef(cells),
    center: [cc2.reduce((s, c) => s + c.center[0], 0) / Math.max(1, cc2.length), cc2.reduce((s, c) => s + c.center[1], 0) / Math.max(1, cc2.length)]
  };
  const elevs = cc2.map((c) => c.elev);
  const emin = Math.min(...elevs), emax = Math.max(...elevs);
  const en = (c) => emax > emin ? (c.elev - emin) / (emax - emin) : 0.5;
  const free = () => cells.filter((c) => c.kind === "city" && c.layout === "blocks" && !c.locked && c.vids.length >= 4);
  let best = null, bs = -Infinity;
  for (const c of free()) {
    const a = cellArea(ctx, c);
    let s = a / 140 + rng.range(0, 10) - (a < 3600 ? 200 : 0);
    const dm = market ? dist(c.center, market.center) : dist(c.center, c.center);
    const outsideN = c.nbrs.filter((n) => n < 0 || cells[n].kind !== "city").length;
    const water = coastAdj(ctx, c) || riverAdj(ctx, c);
    const gateNear = city2.gates.some((g2) => g2.kind === "main" && dist(g2.p, c.center) < 150);
    let def = 45 * en(c) + (c.depth === 0 ? 18 : 0) + (water ? 14 : 0) + (outsideN >= 2 ? 10 : 0) + (gateNear ? 8 : 0);
    if (idn.citadel !== "centre" && dm < 0.3 * ctx.R) def -= 70;
    s += def;
    switch (idn.citadel) {
      case "edge":
        s += (c.depth === 0 ? 26 : 0) - (coastAdj(ctx, c) ? 18 : 0);
        break;
      case "high":
        s += 120 * en(c) + (c.depth <= 1 ? 10 : 0);
        break;
      case "centre":
        s += 70 - dm / 5 + (c.nbrs.includes(market.id) ? 30 : 0) - def * 0.6;
        break;
      case "water":
        s += (water ? 45 : 0) + (c.depth === 0 ? 14 : 0);
        break;
    }
    if (s > bs) bs = s, best = c;
  }
  if (best && st.citadel) {
    best.layout = "castle";
    best.ward = "citadel";
    city2.citadelCell = best.id;
  }
  best = null;
  bs = -Infinity;
  for (const c of free()) {
    const a = cellArea(ctx, c);
    const dm = market ? dist(c.center, market.center) : dist(c.center, c.center);
    let s = a / 150 + rng.range(0, 12) - (a < 3200 ? 150 : 0);
    s += market && c.nbrs.includes(market.id) ? 55 : dm < 0.34 * ctx.R ? 28 : 0;
    s -= c.depth === 0 ? 30 : 0;
    if (c.nbrs.includes(city2.citadelCell)) s -= 25;
    if (s > bs) bs = s, best = c;
  }
  if (best && st.cathedral) {
    best.layout = "cathedral";
    best.ward = "religious";
    city2.cathedralCell = best.id;
  } else if (best && st.church) {
    best.layout = "church";
    best.ward = "religious";
    city2.cathedralCell = best.id;
  }
}
function assignDistricts(ctx) {
  const { city: city2, rng } = ctx;
  const cells = city2.cells;
  const idn = identityOf(city2.params.identity);
  const res = city2.resolved;
  const cityCells = cells.filter((c) => c.kind === "city");
  const market = city2.marketCell >= 0 ? cells[city2.marketCell] : void 0;
  const citadel = city2.citadelCell >= 0 ? cells[city2.citadelCell] : void 0;
  const cath = city2.cathedralCell >= 0 ? cells[city2.cathedralCell] : void 0;
  const gatePts = city2.gates.filter((g2) => g2.wall === "outer").map((g2) => g2.p);
  const gateDist = (c) => gatePts.length ? Math.min(...gatePts.map((p) => dist(p, c.center))) : 999;
  const arterialTouch = (c) => {
    let n = 0;
    for (let i = 0; i < c.vids.length; i++) if (city2.edges[edgeKey(c.vids[i], c.vids[(i + 1) % c.vids.length])] === "arterial") n++;
    return n;
  };
  const harbourCells = /* @__PURE__ */ new Set();
  if (res.harbour) {
    if (res.geo === "coast") {
      let anchor = null, bd2 = Infinity;
      const coastEdges = [];
      for (const c of cityCells)
        for (let i = 0; i < c.vids.length; i++) {
          const a = c.vids[i], b = c.vids[(i + 1) % c.vids.length];
          const k = edgeKey(a, b);
          if (city2.edges[k] === "coast") {
            const m2 = mid(city2.verts[a], city2.verts[b]);
            coastEdges.push({ k, m: m2, cell: c });
            const d = market ? dist(m2, market.center) : dist(m2, c.center);
            if (d < bd2) bd2 = d, anchor = m2;
          }
        }
      if (anchor) {
        for (const e of coastEdges) if (dist(e.m, anchor) < 210) ctx.harbourEdges.add(e.k), harbourCells.add(e.cell.id);
      }
    } else if (city2.river) {
      let anchor = null, bd2 = Infinity;
      for (const k of Object.keys(city2.river.ew)) {
        const e = ctx.ei.get(k);
        if (!e || e.cells.length < 2 || e.cells.some((c) => cells[c].kind !== "city")) continue;
        const m2 = mid(city2.verts[e.a], city2.verts[e.b]);
        const d = market ? dist(m2, market.center) : dist(m2, cells[e.cells[0]].center);
        if (d < bd2) bd2 = d, anchor = m2;
      }
      if (anchor)
        for (const k of Object.keys(city2.river.ew)) {
          const e = ctx.ei.get(k);
          if (!e || e.cells.length < 2 || e.cells.some((c) => cells[c].kind !== "city")) continue;
          if (dist(mid(city2.verts[e.a], city2.verts[e.b]), anchor) < 170) {
            ctx.harbourEdges.add(k);
            for (const c of e.cells) harbourCells.add(c);
          }
        }
    }
  }
  const anchors = /* @__PURE__ */ new Set([market?.id ?? -1, citadel?.id ?? -1, cath?.id ?? -1]);
  anchors.delete(-1);
  const K = Math.max(1, city2.settlement.districts);
  const wts = Object.entries(idn.ward).filter(([t]) => t !== "harbour" || res.harbour).map(([t, w]) => [t, w]);
  const seedTypes = [];
  const need = Math.max(1, K - 3);
  const hasHarbour = harbourCells.size > 0;
  if (hasHarbour) seedTypes.push("residential");
  while (seedTypes.length < need) {
    const t = rng.weighted(wts);
    seedTypes.push(t);
    const e = wts.find((x) => x[0] === t);
    e[1] *= 0.5;
  }
  const suit = (t, c) => {
    const dm = market ? dist(c.center, market.center) : dist(c.center, c.center);
    const R2 = ctx.R;
    switch (t) {
      case "noble":
        return 60 * c.elev - Math.abs(dm - 0.3 * R2) / 9 - (c.depth === 0 ? 18 : 0) + (citadel && c.nbrs.includes(citadel.id) ? 20 : 0);
      case "merchant":
        return -dm / 9 + (riverAdj(ctx, c) ? 22 : 0) + arterialTouch(c) * 9;
      case "residential":
        return 10 - Math.abs(dm - 0.5 * R2) / 18;
      case "artisan":
        return -Math.abs(dm - 0.5 * R2) / 14 + arterialTouch(c) * 5;
      case "industrial":
        return (riverAdj(ctx, c) ? 45 : 0) + (c.depth === 0 ? 14 : 0) - dm / 25;
      case "religious":
        return -dm / 10;
      case "harbour":
        return coastAdj(ctx, c) || riverAdj(ctx, c) ? 40 : -20;
      case "military":
        return (gateDist(c) < 120 ? 32 : 0) + (citadel && c.nbrs.includes(citadel.id) ? 30 : 0) + (c.depth === 0 ? 10 : 0);
      case "poor":
        return (c.depth === 0 ? 34 : 0) + dm / 22 - 14 * c.elev + (riverAdj(ctx, c) ? 8 : 0);
      case "scholar":
        return -dist(c.center, (cath ?? market ?? c).center) / 9 + 8;
      default:
        return 0;
    }
  };
  const hop = (a, b) => dist(cells[a].center, cells[b].center);
  const seeds = [];
  if (cath) seeds.push({ cell: cath, type: "religious", str: 0.55 });
  const taken = new Set(anchors);
  for (const t of seedTypes) {
    let best = null, bs = -Infinity;
    for (const c of cityCells) {
      if (taken.has(c.id) || c.locked && false) continue;
      let s = suit(t, c) + rng.range(0, 14);
      for (const sd of seeds) if (hop(sd.cell.id, c.id) < 110) s -= 25;
      if (s > bs) bs = s, best = c;
    }
    if (best) {
      taken.add(best.id);
      seeds.push({ cell: best, type: t, str: rng.range(0.8, 1.3) });
    }
  }
  const owner = /* @__PURE__ */ new Map();
  const bestD = /* @__PURE__ */ new Map();
  const heap = new MinHeap();
  seeds.forEach((s, i) => {
    owner.set(s.cell.id, i);
    bestD.set(s.cell.id, 0);
    heap.push(0, s.cell.id);
  });
  while (heap.size) {
    const [d, u4] = heap.pop();
    if (d > (bestD.get(u4) ?? Infinity)) continue;
    const o = owner.get(u4);
    for (const n of cells[u4].nbrs) {
      if (n < 0 || cells[n].kind !== "city" || anchors.has(n)) continue;
      const nd = d + hop(u4, n) / seeds[o].str;
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
    c.ward = owner.has(c.id) ? seeds[owner.get(c.id)].type : "residential";
    if (c.ward === "harbour" && !harbourCells.has(c.id)) c.ward = "residential";
  }
  for (const id of harbourCells) if (!anchors.has(id)) cells[id].ward = "harbour";
  for (const c of cityCells) {
    if (anchors.has(c.id) || c.ward === "harbour") continue;
    const adjA = c.nbrs.some((n) => n >= 0 && (n === citadel?.id || n === market?.id));
    if (c.depth === 0 && !adjA && (c.ward === "residential" || c.ward === "artisan") && rng.chance(idn.poor * 0.75)) c.ward = "poor";
    else if (c.depth === 1 && c.ward === "residential" && rng.chance(idn.poor * 0.15)) c.ward = "poor";
  }
  if ((idn.ward.military ?? 0) >= 1) {
    for (const g2 of city2.gates.filter((g3) => g3.wall === "outer"))
      for (const c of cityCells)
        if (c.vids.includes(g2.vid) && !anchors.has(c.id) && (c.ward === "residential" || c.ward === "poor" || c.ward === "artisan") && rng.chance(0.4)) c.ward = "military";
  }
  let scholarFirst = true;
  for (const c of cityCells) {
    if (c.layout !== "blocks" || c.locked || c.vids.length < 4) continue;
    const a = cellArea(ctx, c);
    if (a < 3400) continue;
    if (c.ward === "scholar" && (scholarFirst || rng.chance(0.4))) c.layout = "ring", scholarFirst = false;
    else if (c.ward === "military" && rng.chance(0.25)) c.layout = "ring";
    else if (c.ward === "religious" && rng.chance(0.4)) c.layout = "ring";
    else if (c.ward === "noble" && a > 4500 && rng.chance(0.3)) c.layout = "ring";
  }
  const SHORT = {
    citadel: ["Citadel"],
    market: ["Market"],
    noble: ["Quarter", "Heights", "Court"],
    merchant: ["Quarter", "Exchange", "Mercantile"],
    residential: ["Ward", "Quarter", "Hill", "End"],
    artisan: ["Craft Quarter", "Guild Row", "Wrights"],
    industrial: ["Works", "Millside", "Forge Quarter"],
    religious: ["Close", "Minster Quarter", "Abbey Ward"],
    harbour: ["Docks", "Quay", "Harbour"],
    military: ["Garrison", "Barracks Ward"],
    poor: ["Rookery", "Shambles", "Low Ward"],
    scholar: ["University Quarter", "Scholars' Row"]
  };
  let groups = [];
  {
    const done = /* @__PURE__ */ new Set();
    for (const c of cityCells) {
      if (done.has(c.id) || !c.ward) continue;
      const comp2 = [];
      const st = [c.id];
      done.add(c.id);
      while (st.length) {
        const u4 = st.pop();
        comp2.push(u4);
        for (const n of cells[u4].nbrs)
          if (n >= 0 && cells[n].kind === "city" && !done.has(n) && cells[n].ward === c.ward) done.add(n), st.push(n);
      }
      groups.push(comp2);
    }
  }
  const fixed = (g2) => g2.some((id) => id === market?.id || id === citadel?.id || id === cath?.id) && g2.length === 1;
  const target = Math.max(1, city2.settlement.districts) + groups.filter(fixed).length;
  const groupOf = () => {
    const m2 = /* @__PURE__ */ new Map();
    groups.forEach((g2, i) => g2.forEach((id) => m2.set(id, i)));
    return m2;
  };
  let guard = 0;
  while (groups.length > target && guard++ < 200) {
    const gm = groupOf();
    const order = groups.map((g2, i) => [i, g2.length]).filter(([i]) => !fixed(groups[i])).sort((a, b) => a[1] - b[1]);
    let merged = false;
    for (const [gi] of order) {
      const cnt = /* @__PURE__ */ new Map();
      for (const id of groups[gi]) for (const n of cells[id].nbrs) {
        const o = gm.get(n);
        if (o === void 0 || o === gi || fixed(groups[o])) continue;
        cnt.set(o, (cnt.get(o) ?? 0) + 1);
      }
      if (!cnt.size) continue;
      const into = [...cnt.entries()].sort((a, b) => b[1] - a[1])[0][0];
      const t = cells[groups[into][0]].ward;
      for (const id of groups[gi]) {
        if (cells[id].ward === "harbour" && t !== "harbour") continue;
        cells[id].ward = t;
        if (cells[id].layout === "ring" && t !== "scholar" && t !== "military" && t !== "religious" && t !== "noble") cells[id].layout = "blocks";
      }
      groups[into] = groups[into].concat(groups[gi]);
      groups.splice(gi, 1);
      merged = true;
      break;
    }
    if (!merged) break;
  }
  guard = 0;
  while (groups.length < target && guard++ < 40) {
    let gi = -1;
    for (let i = 0; i < groups.length; i++) if (!fixed(groups[i]) && groups[i].length >= 6 && (gi < 0 || groups[i].length > groups[gi].length)) gi = i;
    if (gi < 0) break;
    const g2 = groups[gi];
    let a = g2[0], b = g2[0], bd2 = -1;
    for (const x of g2) for (const y of g2) {
      const d = dist(cells[x].center, cells[y].center);
      if (d > bd2) bd2 = d, a = x, b = y;
    }
    const A = [], Bc = [];
    for (const id of g2) (dist(cells[id].center, cells[a].center) <= dist(cells[id].center, cells[b].center) ? A : Bc).push(id);
    const connected = (part) => {
      const set = new Set(part), seen = /* @__PURE__ */ new Set([part[0]]), st = [part[0]];
      while (st.length) {
        const u4 = st.pop();
        for (const n of cells[u4].nbrs) if (set.has(n) && !seen.has(n)) seen.add(n), st.push(n);
      }
      return seen.size === part.length;
    };
    if (A.length < 3 || Bc.length < 3 || !connected(A) || !connected(Bc)) break;
    groups.splice(gi, 1, A, Bc);
  }
  groups = groups.filter((g2) => g2.length);
  const districts = [];
  const nameSeen = /* @__PURE__ */ new Set();
  for (const comp2 of groups) {
    const ward = cells[comp2[0]].ward;
    let nm = "";
    for (let tries = 0; tries < 10; tries++) {
      const w = placeWord(rng);
      const sh = SHORT[ward][rng.int(0, SHORT[ward].length)];
      nm = ward === "market" ? "Grand Market" : ward === "citadel" ? `${w} Citadel` : `${w} ${sh}`;
      if (!nameSeen.has(nm)) break;
    }
    nameSeen.add(nm);
    const id = districts.length;
    let cx = 0, cy = 0;
    for (const u4 of comp2) {
      cells[u4].district = id;
      cx += cells[u4].center[0];
      cy += cells[u4].center[1];
    }
    districts.push({ id, type: ward, name: nm, cells: comp2, center: [cx / comp2.length, cy / comp2.length] });
  }
  city2.districts = districts;
  void WARD_LABEL;
}

// src/engine/fortify.ts
var WALL_T = { outer: 4.4, inner: 3.4, sea: 2.6 };
function runsFromLoop(loop, pred, edges) {
  const n = loop.length;
  const ok = [];
  for (let i = 0; i < n; i++) ok.push(pred(edges[edgeKey(loop[i], loop[(i + 1) % n])] ?? ""));
  if (ok.every(Boolean)) return [{ vids: loop.slice(), closed: true }];
  const runs = [];
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
function buildWalls(ctx) {
  const { city: city2 } = ctx;
  const res = city2.resolved;
  const walls = [];
  const towers = [];
  const vE = vertexEdges(ctx.ei);
  city2.walls = walls;
  city2.towers = towers;
  if (city2.settlement.wall === "none") return;
  const edges = city2.edges;
  const loops = outlineLoops(city2, (id) => id >= 0 && city2.cells[id].kind === "city");
  loops.sort((a, b) => area(b.map((v2) => city2.verts[v2])) - area(a.map((v2) => city2.verts[v2])));
  const outer = loops[0] ?? [];
  const mk = (kind, loop, pred) => {
    for (const r2 of runsFromLoop(loop, pred, edges)) walls.push({ kind, vids: r2.vids, closed: r2.closed, t: WALL_T[kind] });
  };
  mk("outer", outer, (c) => c === "wallO");
  mk("sea", outer, (c) => c === "coast");
  for (let i = walls.length - 1; i >= 0; i--) {
    const w = walls[i];
    if (w.kind !== "sea") continue;
    walls.splice(i, 1);
    let cur = [];
    for (let j = 0; j < w.vids.length - 1; j++) {
      const k = edgeKey(w.vids[j], w.vids[j + 1]);
      if (ctx.harbourEdges.has(k)) {
        if (cur.length > 1) walls.push({ kind: "sea", vids: cur, closed: false, t: WALL_T.sea });
        cur = [];
      } else {
        if (!cur.length) cur.push(w.vids[j]);
        cur.push(w.vids[j + 1]);
      }
    }
    if (cur.length > 1) walls.push({ kind: "sea", vids: cur, closed: false, t: WALL_T.sea });
  }
  if (city2.settlement.wall === "double") {
    for (const l of outlineLoops(city2, (id) => id >= 0 && city2.cells[id].inner)) mk("inner", l, (c) => c === "wallI");
  }
  const gatePts = () => city2.gates.map((g2) => g2.p);
  const near = (p, r2) => towers.some((t) => dist(t.p, p) < r2) || gatePts().some((q) => dist(q, p) < r2 + 3);
  const addTower = (p, r2, kind, wall, dir) => towers.push({ p, r: r2, kind, wall, dir });
  for (const g2 of city2.gates) {
    if (g2.kind === "inner") {
      const d = 8;
      for (const s of [-1, 1]) addTower(add(g2.p, mul(g2.tan, s * d)), 4.4, "round", "inner", g2.dir);
    } else if (g2.kind === "postern") {
      const es = (vE.get(g2.vid) ?? []).filter((k) => edges[k] === "wallO");
      if (es.length) {
        const e = ctx.ei.get(es[0]);
        const o = city2.verts[e.a === g2.vid ? e.b : e.a];
        addTower(add(g2.p, mul(unit(sub(o, g2.p)), Math.min(7, dist(o, g2.p) * 0.35))), 3.6, "square", "outer", g2.dir);
      }
    } else if (g2.vid >= 0) {
      const es = (vE.get(g2.vid) ?? []).filter((k) => edges[k] === "wallO");
      for (const k of es) {
        const e = ctx.ei.get(k);
        const o = city2.verts[e.a === g2.vid ? e.b : e.a];
        const L2 = dist(o, g2.p);
        addTower(add(g2.p, mul(unit(sub(o, g2.p)), Math.min(8.5, L2 * 0.4))), 5.2, "round", "outer", g2.dir);
      }
    }
  }
  if (city2.river) {
    for (const w of walls) {
      if (w.kind === "sea") continue;
      for (let i = 0; i < w.vids.length; i++) {
        const v2 = w.vids[i];
        if (!ctx.riverVids.has(v2)) continue;
        if (!w.closed && (i === 0 || i === w.vids.length - 1)) continue;
        const n = w.vids.length;
        const pv = w.vids[(i - 1 + n) % n], nv = w.vids[(i + 1) % n];
        const P = city2.verts[v2];
        const tan = unit(sub(city2.verts[nv], city2.verts[pv]));
        const rw = city2.river.w[Math.round(city2.river.vids.indexOf(v2) / city2.river.vids.length * (city2.river.w.length - 1))] ?? 16;
        city2.gates.push({ vid: v2, p: P, kind: "water", wall: w.kind === "inner" ? "inner" : "outer", tan, dir: [tan[1], -tan[0]] });
        for (const o of [pv, nv]) {
          const Q = city2.verts[o];
          addTower(add(P, mul(unit(sub(Q, P)), Math.min(rw / 2 + 7.5, dist(P, Q) * 0.45))), 4.6, "round", w.kind === "inner" ? "inner" : "outer", [tan[1], -tan[0]]);
        }
      }
    }
  }
  for (const w of walls) {
    const n = w.vids.length;
    const pts = w.vids.map((v2) => city2.verts[v2]);
    const R2 = w.kind === "outer" ? 5.6 : w.kind === "inner" ? 4.6 : 3.8;
    for (let i = 0; i < n; i++) {
      const P = pts[i];
      const end = !w.closed && (i === 0 || i === n - 1);
      const A = w.closed ? pts[(i - 1 + n) % n] : pts[Math.max(0, i - 1)];
      const B2 = w.closed ? pts[(i + 1) % n] : pts[Math.min(n - 1, i + 1)];
      const e1 = unit(sub(P, A)), e2 = unit(sub(B2, P));
      const cr = e1[0] * e2[1] - e1[1] * e2[0];
      const dt = e1[0] * e2[0] + e1[1] * e2[1];
      const turn = Math.atan2(cr, dt);
      const dir = unit([e1[1] + e2[1], -e1[0] - e2[0]]);
      if ((end || Math.abs(turn) > 0.38) && !near(P, 12)) {
        const kind = res.bastions && cr > 0 && Math.abs(turn) > 0.45 && w.kind === "outer" ? "bastion" : res.squareTowers ? "square" : "round";
        addTower(P, kind === "bastion" ? 6.4 : R2, kind, w.kind, dir);
      }
      if (i < n - 1 || w.closed) {
        const Q = pts[(i + 1) % n];
        const L2 = dist(P, Q);
        if (L2 > 80) {
          const k = Math.floor(L2 / 62);
          for (let j = 1; j <= k; j++) {
            const q = add(P, mul(sub(Q, P), j / (k + 1)));
            const t = unit(sub(Q, P));
            if (!near(q, 16)) addTower(q, R2 * 0.82, res.squareTowers ? "square" : "round", w.kind, [t[1], -t[0]]);
          }
        }
      }
    }
  }
  if (outer.length && ctx.harbourEdges.size) {
    const n = outer.length;
    const cat3 = (k) => edges[k] === "coast" ? ctx.harbourEdges.has(k) ? "h" : "s" : "o";
    for (let i = 0; i < n; i++) {
      const v2 = outer[i];
      const c1 = cat3(edgeKey(outer[(i - 1 + n) % n], v2)), c2 = cat3(edgeKey(v2, outer[(i + 1) % n]));
      if (c1 === "h" !== (c2 === "h")) {
        const t = unit(sub(city2.verts[outer[(i + 1) % n]], city2.verts[outer[(i - 1 + n) % n]]));
        const idx = towers.findIndex((x) => dist(x.p, city2.verts[v2]) < 9);
        if (idx >= 0) towers.splice(idx, 1);
        addTower(city2.verts[v2], 6.6, "harbour", "sea", [t[1], -t[0]]);
      }
    }
  }
  city2.moat = city2.settlement.moat ? Math.max(9, city2.settlement.radius * 0.028) : 0;
}
function buildHarbour(ctx) {
  const { city: city2, rng } = ctx;
  if (!ctx.harbourEdges.size) return;
  const piers = [];
  const boats = [];
  const coast = city2.resolved.geo === "coast";
  const keys = [...ctx.harbourEdges];
  let idx = 0;
  for (const k of keys) {
    const e = ctx.ei.get(k);
    const A = city2.verts[e.a], B2 = city2.verts[e.b];
    const L2 = dist(A, B2);
    if (L2 < (coast ? 20 : 24)) continue;
    const m2 = mid(A, B2);
    if (piers.some((p2) => dist(p2.b, m2) < (coast ? 38 : 50))) continue;
    let cell;
    if (coast) cell = city2.cells.find((c) => e.cells.includes(c.id) && c.kind === "city");
    else cell = city2.cells[e.cells[idx++ % 2]];
    const inN = inwardNormal(city2, cell, e.a, e.b);
    if (!inN) continue;
    const out2 = [-inN[0], -inN[1]];
    let len = coast ? rng.range(16, 28) : rng.range(2.5, 4.5);
    if (coast) {
      while (len > 9 && !ctx.sea(m2[0] + out2[0] * len, m2[1] + out2[1] * len)) len -= 3;
      if (!ctx.sea(m2[0] + out2[0] * len, m2[1] + out2[1] * len)) continue;
    }
    const hw = (city2.river?.ew[k] ?? 16) / 2;
    const p = coast ? { a: add(m2, mul(out2, -3.5)), b: add(m2, mul(out2, len)), w: 3.8 } : { a: add(m2, mul(out2, -hw - 1.5)), b: add(m2, mul(out2, -hw + len)), w: 2.4 };
    piers.push(p);
    if (coast || rng.chance(0.6)) {
      const side = rng.chance(0.5) ? 1 : -1;
      const perp = [-out2[1], out2[0]];
      const bp = add(add(p.b, mul(perp, side * (coast ? 6.2 : 4.4))), mul(out2, -2));
      boats.push(bp[0], bp[1], Math.atan2(out2[1], out2[0]) + rng.range(-0.15, 0.15), coast ? rng.range(8, 11) : rng.range(6, 8), coast ? 3.2 : 2.4);
    }
    if (coast && rng.chance(0.7)) {
      const q = add(add(p.b, mul(out2, rng.range(12, 30))), mul([-out2[1], out2[0]], rng.range(-22, 22)));
      if (ctx.sea(q[0], q[1]) && ctx.sea(q[0] + out2[0] * 12, q[1] + out2[1] * 12))
        boats.push(q[0], q[1], Math.atan2(out2[1], out2[0]) + rng.range(-0.6, 0.6), rng.range(12, 17), 4.4);
    }
  }
  city2.piers = piers;
  city2.quays = keys;
  city2.boats = boats;
  const ht = city2.towers.find((t) => t.kind === "harbour");
  if (ht && coast) city2.features.push({ id: city2.nextId++, type: "lighthouse", p: add(ht.p, mul(ht.dir, 8)) });
}
function finalizeGround(ctx) {
  const { city: city2 } = ctx;
  for (const c of city2.cells) {
    if (c.vids.length < 3) continue;
    const pl = poly(city2, c);
    if (c.kind === "city") c.ground = flat(pl);
    else if (c.kind === "sea") {
      const d = c.nbrs.map((n) => n >= 0 && city2.cells[n].kind !== "sea" ? 7 : 0);
      c.ground = flat(insetConvex(pl, d));
    }
  }
}
function buildSuburbs(ctx) {
  const { city: city2, rng } = ctx;
  const st = city2.settlement;
  if (!st.suburbs || !city2.roads.length) return;
  const cityCells = city2.cells.filter((c) => c.kind === "city");
  const inCity = (p) => cityCells.some((c) => pointInConvex(p, poly(city2, c), 2));
  const clusters = Math.max(1, Math.round(st.tierIndex * 1.6 + 1));
  const perCluster = Math.max(2, Math.round(2 + st.tierIndex * 0.8));
  let made = 0;
  for (const road of city2.roads) {
    if (made >= clusters) break;
    const n = road.pts.length;
    for (let i = 1; i < n - 1 && made < clusters; i++) {
      const p = road.pts[i];
      if (inCity(p)) continue;
      if (riverDistOf(city2, p) < 14) continue;
      if (rng.next() > 0.45) continue;
      const tan = unit(sub(road.pts[i + 1], road.pts[i - 1]));
      const side = rng.chance(0.5) ? 1 : -1;
      const nrm = [-tan[1] * side, tan[0] * side];
      const base = add(p, mul(nrm, road.w / 2 + 7));
      let ok = true;
      const placed = [];
      for (let k = 0; k < perCluster; k++) {
        const along = (k - perCluster / 2) * (7 + rng.range(0, 3)) * (rng.chance(0.5) ? 1 : -1);
        const back = rng.range(0, 12);
        const c2 = add(add(base, mul(tan, along)), mul(nrm, back));
        const w = rng.range(5.5, 8.5), h = rng.range(7, 11);
        const a = Math.atan2(tan[1], tan[0]) + (rng.next() - 0.5) * 0.25;
        if (inCity(c2)) {
          ok = false;
          break;
        }
        if (placed.some((q) => Math.hypot(q.x - c2[0], q.y - c2[1]) < 11)) continue;
        placed.push({ x: c2[0], y: c2[1], w, h, a, t: rng.chance(0.22) ? "barn" : "house" });
      }
      if (!ok || placed.length < 2) continue;
      const cell = city2.cells.find((c) => c.kind === "outside" && pointInConvex(p, poly(city2, c), 4));
      for (const q of placed) {
        const parts = [];
        const bb3 = [];
        const co = Math.cos(q.a), si = Math.sin(q.a);
        const hw = q.w / 2, hh = q.h / 2;
        for (const [u4, v2] of [[-hw, -hh], [hw, -hh], [hw, hh], [-hw, hh]]) bb3.push(q.x + u4 * co - v2 * si, q.y + u4 * si + v2 * co);
        parts.push({ k: "r", p: bb3, roof: q.t === "barn" ? "gable" : rng.chance(0.6) ? "thatch" : "gable", along: 0 });
        city2.buildings.push({
          id: city2.nextId++,
          type: q.t,
          cell: cell ? cell.id : 0,
          parts,
          pal: q.t === "barn" ? "timber" : "thatch",
          ci: rng.int(0, 4),
          h: 0,
          bb: [Math.min(...bb3.filter((_, i2) => i2 % 2 === 0)), Math.min(...bb3.filter((_, i2) => i2 % 2 === 1)), Math.max(...bb3.filter((_, i2) => i2 % 2 === 0)), Math.max(...bb3.filter((_, i2) => i2 % 2 === 1))],
          manual: true
        });
      }
      made++;
    }
  }
}
function riverDistOf(city2, p) {
  return city2.river ? polylineNearest(p, city2.river.pts).d : Infinity;
}
function buildFeaturesAndDecor(ctx) {
  const { city: city2, rng } = ctx;
  const idn = identityOf(city2.params.identity);
  const cells = city2.cells;
  const roads = city2.roads;
  const roadDist = (p) => {
    let d = Infinity;
    for (const r2 of roads) d = Math.min(d, polylineNearest(p, r2.pts).d);
    return d;
  };
  const riverDist = (p) => city2.river ? nearestOn(city2.river.pts, p).d : Infinity;
  const hop = /* @__PURE__ */ new Map();
  let fr = [];
  for (const c of cells)
    if (c.kind === "outside" && c.nbrs.some((n) => n >= 0 && cells[n].kind === "city")) hop.set(c.id, 1), fr.push(c.id);
  while (fr.length) {
    const nx = [];
    for (const u4 of fr)
      for (const n of cells[u4].nbrs)
        if (n >= 0 && cells[n].kind === "outside" && !hop.has(n)) hop.set(n, hop.get(u4) + 1), nx.push(n);
    fr = nx;
  }
  const mills = cells.filter((c) => c.kind === "outside" && (hop.get(c.id) ?? 9) <= 2 && c.vids.length >= 4 && riverDist(c.center) > 80 && roadDist(c.center) > 30);
  for (let i = 0; i < idn.windmills && mills.length; i++) {
    const c = mills.splice(rng.int(0, mills.length), 1)[0];
    city2.features.push({ id: city2.nextId++, type: "windmill", p: c.center });
  }
  const og = city2.gates.filter((g2) => g2.kind === "main");
  if (og.length && rng.chance(0.6)) {
    const g2 = rng.pick(og);
    const p = add(add(g2.p, mul(g2.dir, 70)), mul(g2.tan, rng.pick([-1, 1]) * 34));
    if (roadDist(p) > 14 && riverDist(p) > 40 && !ctx.sea(p[0], p[1])) city2.features.push({ id: city2.nextId++, type: "gallows", p });
  }
  const treeAreas = [];
  city2.fields = [];
  for (const c of cells) {
    if (c.kind !== "outside" || c.vids.length < 3) continue;
    const h = hop.get(c.id) ?? 9;
    const pl = poly(city2, c);
    const d = c.nbrs.map((n, i) => {
      if (n >= 0 && cells[n].kind === "city") return 11;
      if (n >= 0 && cells[n].kind === "sea") return 7;
      const k = edgeKey(c.vids[i], c.vids[(i + 1) % c.vids.length]);
      if (city2.river && k in city2.river.ew) return city2.river.ew[k] / 2 + 6;
      return 2.5;
    });
    const ip = insetConvex(pl, d);
    if (ip.length < 3 || area(ip) < 1500) continue;
    const nf = ctx.noise.fbm(c.center[0] / 380 + 20, c.center[1] / 380 + 30, 3);
    const high = c.elev > (city2.resolved.geo === "mountain" ? 0.75 : 1);
    const mountain = city2.resolved.geo === "mountain";
    const farm = !high && h <= 3 && nf < 0.62 && rng.chance(0.82 - 0.12 * h) && roadDist(c.center) < 900;
    if (farm) {
      const parts = [];
      const split = (p, depth) => {
        if (area(p) < 7500 || depth > 3) return parts.push(p);
        const cc2 = centroid(p);
        const a = rng.range(0, Math.PI);
        const [A, B2] = splitConvex(p, [cc2[0] + rng.range(-12, 12), cc2[1] + rng.range(-12, 12)], [Math.cos(a), Math.sin(a)], 3.2);
        if (A.length < 3 || B2.length < 3) return parts.push(p);
        split(A, depth + 1);
        split(B2, depth + 1);
      };
      split(ip, 0);
      for (const p of parts) {
        if (area(p) < 900) continue;
        const ang = rng.range(0, Math.PI), dd = [Math.cos(ang), Math.sin(ang)], nn = [-dd[1], dd[0]];
        const cc2 = centroid(p);
        const bb3 = bbox(p);
        const rad = Math.hypot(bb3[2] - bb3[0], bb3[3] - bb3[1]) / 2;
        const f2 = [];
        for (let off = -rad; off <= rad; off += 4.4) {
          const o = [cc2[0] + nn[0] * off, cc2[1] + nn[1] * off];
          const tr = clipLineConvex(p, o, dd);
          if (tr && tr[1] - tr[0] > 6) f2.push(o[0] + dd[0] * (tr[0] + 1), o[1] + dd[1] * (tr[0] + 1), o[0] + dd[0] * (tr[1] - 1), o[1] + dd[1] * (tr[1] - 1));
        }
        city2.fields.push({ p: flat(p), f: f2, tone: rng.int(0, 4) });
      }
    } else if (nf > 0.5 || mountain || h > 3 && rng.chance(0.5)) treeAreas.push({ pl: ip, dens: 1 });
    else treeAreas.push({ pl: ip, dens: 0.25 });
  }
  let tot = 0;
  for (const t of treeAreas) tot += area(t.pl) * t.dens;
  const sp = clamp(Math.sqrt(tot / 4200), 8.5, 20);
  const forest = [];
  for (const t of treeAreas) {
    const s = sp / Math.sqrt(t.dens);
    const bb3 = bbox(t.pl);
    for (let x = bb3[0]; x < bb3[2]; x += s)
      for (let y = bb3[1]; y < bb3[3]; y += s) {
        const p = [x + rng.range(0, s), y + rng.range(0, s)];
        const r2 = rng.range(3.4, 5.6);
        if (!pointInConvex(p, t.pl, -r2 * 0.6)) continue;
        if (t.dens < 1 && rng.chance(0.55)) continue;
        if (roadDist(p) < 8 + r2 || riverDist(p) < 16 + r2) continue;
        forest.push(p[0], p[1], r2, rng.int(0, 3));
      }
  }
  city2.forest = forest;
  const waves = [];
  for (const c of cells) {
    if (c.kind !== "sea" || c.ground.length < 6) continue;
    const g2 = c.ground;
    const bb3 = bbox(g2, true);
    const n = clamp(Math.round((bb3[2] - bb3[0]) * (bb3[3] - bb3[1]) / 14e3), 0, 24);
    for (let i = 0; i < n; i++) {
      const p = [rng.range(bb3[0], bb3[2]), rng.range(bb3[1], bb3[3])];
      if (Math.hypot(p[0], p[1]) > 900) continue;
      let inside = true;
      const poly2 = [];
      for (let j = 0; j < g2.length; j += 2) poly2.push([g2[j], g2[j + 1]]);
      inside = pointInConvex(p, poly2, -6);
      if (inside) waves.push(p[0], p[1], rng.range(8, 16));
    }
  }
  city2.waves = waves;
}

// src/engine/buildings.ts
var STYLE = {
  residential: { min: 86, var: 0.5, lane: 3.2, laneArea: 640, gap: 0.7, keep: 0.96, fill: 0.93, spread: 0.28 },
  poor: { min: 60, var: 0.7, lane: 2.4, laneArea: 460, gap: 0.5, keep: 0.93, fill: 0.9, spread: 0.5 },
  merchant: { min: 140, var: 0.45, lane: 3.4, laneArea: 820, gap: 0.9, keep: 0.96, fill: 0.93, spread: 0.22 },
  noble: { min: 380, var: 0.35, lane: 4, laneArea: 1500, gap: 2.2, keep: 0.9, fill: 0.7, spread: 0.2 },
  artisan: { min: 115, var: 0.5, lane: 3.2, laneArea: 720, gap: 0.8, keep: 0.95, fill: 0.94, spread: 0.3 },
  industrial: { min: 230, var: 0.5, lane: 4, laneArea: 1e3, gap: 1.4, keep: 0.9, fill: 0.92, spread: 0.25 },
  harbour: { min: 215, var: 0.4, lane: 4, laneArea: 900, gap: 1.2, keep: 0.95, fill: 0.95, spread: 0.2 },
  military: { min: 260, var: 0.3, lane: 4, laneArea: 1100, gap: 1.4, keep: 0.92, fill: 0.92, spread: 0.12 },
  religious: { min: 190, var: 0.4, lane: 3.4, laneArea: 850, gap: 1.2, keep: 0.9, fill: 0.9, spread: 0.2 },
  scholar: { min: 300, var: 0.35, lane: 3.6, laneArea: 1300, gap: 1.6, keep: 0.92, fill: 0.92, spread: 0.15 },
  market: { min: 110, var: 0.3, lane: 3, laneArea: 99999, gap: 0.5, keep: 1, fill: 0.96, spread: 0.08 },
  citadel: { min: 260, var: 0.3, lane: 3, laneArea: 99999, gap: 1, keep: 1, fill: 0.94, spread: 0.1 }
};
function styleFor(city2, ward) {
  const base = STYLE[ward];
  const k = city2.settlement.plotScale;
  return { ...base, min: base.min * k, laneArea: base.laneArea * k };
}
function insetDists(city2, cell) {
  const n = cell.vids.length;
  const out2 = [];
  for (let i = 0; i < n; i++) {
    const k = edgeKey(cell.vids[i], cell.vids[(i + 1) % n]);
    const cls = city2.edges[k];
    let d = 3;
    switch (cls) {
      case "minor":
      case "secondary":
      case "arterial":
        d = (city2.ew[k] ?? 4.4) / 2;
        break;
      case "wallO":
        d = WALL_T.outer / 2 + 3.2;
        break;
      case "wallI":
        d = WALL_T.inner / 2 + 2.6;
        break;
      case "river":
        d = (city2.river?.ew[k] ?? 14) / 2 + 4.2;
        break;
      case "coast":
        d = 4.6;
        break;
      case "open":
        d = 3.2;
        break;
    }
    out2.push(d);
  }
  return out2;
}
function decomposeConvex(pts, d, cutD, depth = 0) {
  const n = pts.length;
  if (n < 3) return [];
  if (isConvex(pts) || depth > 5) return [{ p: pts, d }];
  for (let i = 0; i < n; i++) {
    const prev = pts[(i - 1 + n) % n], P = pts[i], next = pts[(i + 1) % n];
    const cr = (P[0] - prev[0]) * (next[1] - P[1]) - (P[1] - prev[1]) * (next[0] - P[0]);
    if (cr >= -1e-6) continue;
    const a = unit(sub(P, prev)), b = unit(sub(next, P));
    const dir = unit([a[0] - b[0], a[1] - b[1]]);
    let best = null;
    for (let j2 = 0; j2 < n; j2++) {
      if (j2 === i || (j2 + 1) % n === i) continue;
      const A = pts[j2], B2 = pts[(j2 + 1) % n];
      const ex = B2[0] - A[0], ey = B2[1] - A[1];
      const den = dir[0] * ey - dir[1] * ex;
      if (Math.abs(den) < 1e-9) continue;
      const ox = A[0] - P[0], oy = A[1] - P[1];
      const t = (ox * ey - oy * ex) / den;
      const u4 = (ox * dir[1] - oy * dir[0]) / den;
      if (t > 1e-3 && u4 > 0.02 && u4 < 0.98 && (!best || t < best.t)) best = { j: j2, t, q: [P[0] + dir[0] * t, P[1] + dir[1] * t] };
    }
    if (!best) continue;
    const { j, q } = best;
    const cd2 = Math.max(cutD, d[(i - 1 + n) % n], d[i]);
    const p1 = [], d1 = [], p2 = [], d2 = [];
    for (let k = i; k !== (j + 1) % n; k = (k + 1) % n) {
      p1.push(pts[k]);
      d1.push(d[k]);
    }
    p1.push(q);
    d1[d1.length - 1] = d[j];
    d1.push(cd2);
    p2.push(q);
    d2.push(d[j]);
    for (let k = (j + 1) % n; k !== i; k = (k + 1) % n) {
      p2.push(pts[k]);
      d2.push(d[k]);
    }
    p2.push(P);
    d2.push(cd2);
    return [...decomposeConvex(p1, d1, cutD, depth + 1), ...decomposeConvex(p2, d2, cutD, depth + 1)];
  }
  return [{ p: pts, d }];
}
function cellPieces(city2, cell) {
  const pl = poly(city2, cell);
  const n = pl.length;
  const parts = decomposeConvex(pl, insetDists(city2, cell), 1.6);
  let ps = [];
  for (const part of parts) {
    let reg = insetConvex(part.p, part.d);
    if (reg.length < 3) continue;
    for (const pz of city2.plazas) {
      const i = cell.vids.indexOf(pz.vid);
      if (i < 0) continue;
      const P = pl[i], A = pl[(i - 1 + n) % n], B2 = pl[(i + 1) % n];
      const bis = unit(add(unit(sub(A, P)), unit(sub(B2, P))));
      reg = clipPlane(reg, bis[0], bis[1], bis[0] * P[0] + bis[1] * P[1] + pz.r);
      if (reg.length < 3) break;
    }
    if (reg.length >= 3 && area(reg) > 25) ps.push(reg);
  }
  if (!ps.length) return [];
  for (const cut of cell.cuts) {
    const next = [];
    for (const p of ps) {
      const [A, B2] = splitConvex(p, cut.p, cut.d, cut.w);
      if (A.length >= 3 && area(A) > 25) next.push(A);
      if (B2.length >= 3 && area(B2) > 25) next.push(B2);
    }
    ps = next;
  }
  return ps;
}
var partPoly = (p) => p.k === "r" ? p.p : octagon(p.p[0], p.p[1], p.p[2]);
function bbOf(parts) {
  let x02 = Infinity, y02 = Infinity, x12 = -Infinity, y12 = -Infinity;
  for (const p of parts) {
    if (p.k === "c") {
      x02 = Math.min(x02, p.p[0] - p.p[2]);
      x12 = Math.max(x12, p.p[0] + p.p[2]);
      y02 = Math.min(y02, p.p[1] - p.p[2]);
      y12 = Math.max(y12, p.p[1] + p.p[2]);
    } else {
      const b = bbox(p.p, true);
      x02 = Math.min(x02, b[0]);
      y02 = Math.min(y02, b[1]);
      x12 = Math.max(x12, b[2]);
      y12 = Math.max(y12, b[3]);
    }
  }
  return [x02, y02, x12, y12];
}
var TYPE_DIMS = {
  house: [5.5, 9.5, 6.5, 11],
  hovel: [4, 6.5, 4.5, 7],
  house_l: [7, 12, 8, 14],
  merchant: [7, 13, 9, 16],
  workshop: [5.5, 10, 6.5, 12],
  warehouse: [8, 14, 11, 22],
  inn: [8, 12.5, 9, 14],
  tavern: [7, 11, 8, 13],
  barn: [7, 12, 11, 20],
  manor: [11, 18, 11, 19],
  palace: [22, 34, 18, 30],
  church: [15, 24, 8, 13],
  cathedral: [36, 60, 24, 38],
  temple: [28, 44, 18, 26],
  chapel: [9, 15, 5.5, 9],
  guildhall: [12, 20, 14, 22],
  townhall: [16, 26, 13, 22],
  barracks: [20, 30, 8, 13],
  stable: [13, 22, 6.5, 10],
  mill: [7.5, 11, 8.5, 13],
  smithy: [5.5, 9, 6.5, 10],
  bakery: [5.5, 9, 6.5, 11],
  granary: [9, 14, 10, 18],
  hospital: [16, 26, 14, 24],
  university: [22, 34, 18, 28],
  monastery: [18, 28, 16, 24],
  market_hall: [11, 20, 16, 26],
  keep: [18, 30, 18, 30]
};
function clampRect(rc, type) {
  const d = TYPE_DIMS[type];
  if (!d) return rc;
  const [minW, maxW, minD, maxD] = d;
  let w = clamp(rc.w, minW, maxW);
  let h = clamp(rc.h, minD, maxD);
  if (w / h > 1.3 && h < maxD * 0.95) {
    const k = Math.min(maxD / h, maxW / w);
    w = rc.w * k;
    h = rc.h * k;
  }
  return { cx: rc.cx, cy: rc.cy, w, h, a: rc.a };
}
function R(rc, u4, v2, w, h, roof, forcedAlong) {
  const c = Math.cos(rc.a), s = Math.sin(rc.a);
  return {
    k: "r",
    p: rectPts(rc.cx + u4 * c - v2 * s, rc.cy + u4 * s + v2 * c, w, h, rc.a),
    roof,
    along: forcedAlong !== void 0 ? forcedAlong : w >= h ? 0 : 1
  };
}
function C(rc, u4, v2, r2, roof) {
  const c = Math.cos(rc.a), s = Math.sin(rc.a);
  return { k: "c", p: [rc.cx + u4 * c - v2 * s, rc.cy + u4 * s + v2 * c, r2], roof, along: 0 };
}
var norm = (r2) => r2.h > r2.w ? { cx: r2.cx, cy: r2.cy, w: r2.h, h: r2.w, a: r2.a + Math.PI / 2 } : r2;
function shapeL(rc, rng, roof, tee = false) {
  const h1 = rc.h * rng.range(0.48, 0.6);
  const w2 = rc.w * rng.range(0.38, 0.52);
  const h2 = rc.h - h1 + 0.4;
  const side = tee ? 0 : rng.chance(0.5) ? 1 : -1;
  return [
    R(rc, 0, -rc.h / 2 + h1 / 2, rc.w, h1, roof, 0),
    R(rc, side * (rc.w / 2 - w2 / 2), rc.h / 2 - h2 / 2, w2, h2, roof, 1)
  ];
}
function shapeU(rc, rng, closed, roof) {
  const t = clamp(Math.min(rc.w, rc.h) * rng.range(0.3, 0.38), 3, 7.5);
  const parts = [R(rc, 0, -rc.h / 2 + t / 2, rc.w, t, roof)];
  const hh = closed ? rc.h - 2 * t : rc.h - t;
  const vc = closed ? 0 : t / 2;
  parts.push(R(rc, -rc.w / 2 + t / 2, vc, t, hh, roof), R(rc, rc.w / 2 - t / 2, vc, t, hh, roof));
  if (closed) parts.push(R(rc, 0, rc.h / 2 - t / 2, rc.w, t, roof));
  return parts;
}
function cathedralParts(rc, temple, variant = 0) {
  const L2 = rc.w, W2 = rc.h;
  if (temple) {
    const parts2 = [R(rc, 0, 0, L2 * 0.88, W2 * 0.52, "flat"), R(rc, 0, 0, L2 * 0.7, W2 * 0.3, "gable")];
    const n = Math.max(4, Math.floor(L2 * 0.88 / 5.2));
    for (let i = 0; i < n; i++) {
      const u4 = -L2 * 0.44 + 1.6 + i * (L2 * 0.88 - 3.2) / (n - 1);
      parts2.push(C(rc, u4, W2 * 0.26 - 1.4, 1.15, "flat"), C(rc, u4, -W2 * 0.26 + 1.4, 1.15, "flat"));
    }
    return parts2;
  }
  const nw = Math.min(W2 * 0.4, L2 * 0.2);
  const ra = nw / 2;
  const ln = L2 - ra * 0.9;
  const u0 = -L2 / 2 + ln / 2;
  const ut = -L2 / 2 + ln * 0.6;
  const tw = Math.min(W2 * 0.96, ln * 0.7);
  const parts = [
    R(rc, u0, 0, ln, nw, "gable", 0),
    R(rc, ut, 0, nw * 0.96, tw, "gable", 1),
    C(rc, L2 / 2 - ra, 0, ra, "cone")
  ];
  const aisle = nw * 0.32;
  const aLen = ut - nw * 0.5 - (-L2 / 2 + nw * 0.55);
  if (aLen > 4) {
    const ac2 = (-L2 / 2 + nw * 0.55 + ut - nw * 0.5) / 2;
    parts.splice(0, 0, R(rc, ac2, nw / 2 + aisle / 2 - 0.2, aLen, aisle, "flat", 0), R(rc, ac2, -nw / 2 - aisle / 2 + 0.2, aLen, aisle, "flat", 0));
  }
  if (variant % 3 === 1) {
    const t = nw * 0.86;
    parts.push(R(rc, -L2 / 2 + t / 2, 0, t, t, "hip"));
    for (let i = -2; i <= 2; i++) {
      const a = i / 2 * 1.1;
      parts.push(C(rc, L2 / 2 - ra + Math.cos(a) * ra * 1.02, Math.sin(a) * ra * 1.02, ra * 0.34, "cone"));
    }
    parts.push(R(rc, ut, 0, nw * 0.58, nw * 0.58, "hip"));
  } else if (variant % 3 === 2) {
    const tws = nw * 0.6;
    parts.push(
      R(rc, -L2 / 2 + tws / 2, nw / 2 - tws / 2 + 0.9, tws, tws, "hip"),
      R(rc, -L2 / 2 + tws / 2, -nw / 2 + tws / 2 - 0.9, tws, tws, "hip"),
      C(rc, ut, 0, nw * 0.34, "cone")
    );
  } else {
    const tws = nw * 0.46;
    parts.push(
      R(rc, -L2 / 2 + tws / 2, nw / 2 + tws / 2 - 0.4, tws, tws, "hip"),
      R(rc, -L2 / 2 + tws / 2, -nw / 2 - tws / 2 + 0.4, tws, tws, "hip"),
      R(rc, ut, 0, nw * 0.62, nw * 0.62, "hip")
    );
  }
  return parts;
}
function smallChurch(rc) {
  const L2 = rc.w, W2 = rc.h;
  const nw = Math.min(W2 * 0.46, L2 * 0.34);
  const ln = L2 * 0.84;
  return [
    R(rc, -L2 / 2 + ln / 2, 0, ln, nw, "gable"),
    R(rc, L2 / 2 - nw * 0.4, 0, nw * 0.8, nw * 0.8, "hip"),
    R(rc, -L2 / 2 + ln * 0.55, 0, nw * 0.9, Math.min(W2, nw * 1.9), "gable"),
    C(rc, -L2 / 2 + nw * 0.35, 0, nw * 0.36, "cone")
  ];
}
var NAMED = {
  cathedral: true,
  temple: true,
  church: true,
  townhall: true,
  guildhall: true,
  palace: true,
  keep: true,
  hospital: true,
  university: true,
  market_hall: true,
  barracks: true,
  monastery: true,
  granary: true,
  mill: true,
  inn: true,
  tavern: true
};
var LABEL = {
  townhall: "Town Hall",
  guildhall: "Guildhall",
  palace: "Palace",
  keep: "Keep",
  hospital: "Hospital",
  university: "University",
  market_hall: "Market Hall",
  barracks: "Barracks",
  monastery: "Monastery",
  granary: "Granary",
  mill: "Mill",
  smithy: "Smithy",
  bakery: "Bakery"
};
var ANIMALS = ["Stag", "Hart", "Lion", "Raven", "Swan", "Boar", "Falcon", "Fox", "Bear", "Crown", "Anchor", "Barrel"];
var ADJ = ["Gilded", "Silver", "Red", "Black", "White", "Golden", "Laughing", "Crooked", "Old", "Merry"];
function nameFor(type, rng) {
  if (!NAMED[type]) return void 0;
  switch (type) {
    case "cathedral":
      return `St. ${rng.pick(SAINTS)}'s Cathedral`;
    case "church":
      return `St. ${rng.pick(SAINTS)}`;
    case "temple":
      return `Temple of ${rng.pick(GODS)}`;
    case "inn":
      return `The ${rng.pick(ADJ)} ${rng.pick(ANIMALS)} Inn`;
    case "tavern":
      return `The ${rng.pick(ADJ)} ${rng.pick(ANIMALS)}`;
    case "guildhall":
      return `${rng.pick(["Mercers", "Weavers", "Smiths", "Brewers", "Masons", "Goldsmiths"])}' Guildhall`;
    case "university":
      return `${placeWord(rng)} College`;
    default:
      return LABEL[type];
  }
}
var PALS = {
  tile: [["tile", 6], ["timber", 2], ["slate", 1], ["thatch", 1]],
  terracotta: [["terracotta", 7], ["tile", 2], ["timber", 1]],
  slate: [["slate", 6], ["timber", 2], ["stone", 1]],
  timber: [["timber", 5], ["tile", 4], ["slate", 1]],
  stone: [["stone", 4], ["slate", 3], ["tile", 3]]
};
function paletteFor(city2, type, ward, rng) {
  const ci = rng.int(0, 4);
  const st = city2.resolved.style;
  switch (type) {
    case "hovel":
      return [rng.chance(0.65) ? "thatch" : "timber", ci];
    case "cathedral":
    case "church":
    case "chapel":
    case "monastery":
      return [rng.chance(0.75) ? "slate" : "stone", ci];
    case "temple":
      return ["stone", ci];
    case "warehouse":
    case "granary":
      return [rng.pick(["dark", "timber", "slate"]), ci];
    case "barracks":
    case "keep":
    case "stable":
      return [type === "stable" ? "timber" : rng.pick(["stone", "slate"]), ci];
    case "smithy":
    case "workshop":
      return [rng.pick(["dark", "timber", "slate"]), ci];
    case "palace":
    case "townhall":
    case "university":
    case "hospital":
      return [rng.pick(["slate", "tile", "stone"]), ci];
    case "mill":
      return ["timber", ci];
    case "barn":
      return [rng.chance(0.55) ? "thatch" : "timber", ci];
    default:
      break;
  }
  if (ward === "poor") return [rng.chance(0.6) ? "thatch" : "timber", ci];
  if (ward === "noble") return [rng.weighted([["slate", 4], ["tile", 3], ["stone", 2]]), ci];
  if (ward === "industrial") return [rng.weighted([["dark", 3], ["slate", 3], ["timber", 3]]), ci];
  return [rng.weighted(PALS[st] ?? PALS.tile), ci];
}
function addBuilding(B2, type, parts, ward, h, extra) {
  const [pal, ci] = paletteFor(B2.city, type, ward, B2.rng);
  let name = nameFor(type, B2.rng);
  if (name) {
    const used = /* @__PURE__ */ new Set();
    for (const b2 of B2.city.buildings) if (b2.name) used.add(b2.name);
    for (const b2 of B2.made) if (b2.name) used.add(b2.name);
    if (used.has(name)) {
      const base = name;
      for (let i = 0; i < 14 && used.has(name); i++) {
        const cand = nameFor(type, B2.rng);
        if (cand) name = cand;
      }
      if (used.has(name)) name = base.replace(/(\s(Inn|Tavern))?$/, "") + " " + ["Lower", "Upper", "Little", "Great", "Old", "New", "East", "West", "North", "South"][B2.rng.int(0, 10)] + "/" + (base.split(" ").pop() ?? "House");
    }
  }
  const b = { id: B2.city.nextId++, type, cell: B2.cell.id, parts, pal, ci, h, bb: bbOf(parts), name, ...extra };
  B2.made.push(b);
  return b;
}
function clearanceOK(segs, parts, margin = 0.35) {
  for (const p of parts) {
    const pts = [];
    if (p.k === "c") pts.push([p.p[0], p.p[1]]);
    else for (let i = 0; i < 8; i += 2) pts.push([p.p[i], p.p[i + 1]]);
    for (const q of pts) {
      for (const [a, c, w] of segs) {
        if (segDist(q, a, c) < w + margin - (p.k === "c" ? p.p[2] : 0)) return false;
      }
    }
  }
  return true;
}
function riverOK(city2, parts, margin = 1.2) {
  const r2 = city2.river;
  if (!r2) return true;
  for (const p of parts) {
    const pts = [];
    if (p.k === "c") pts.push([p.p[0], p.p[1]]);
    else for (let i = 0; i < 8; i += 2) pts.push([p.p[i], p.p[i + 1]]);
    for (const q of pts) {
      const n = nearestOn(r2.pts, q);
      const w = r2.w[Math.min(r2.w.length - 1, n.i)];
      if (n.d < w / 2 + margin + (p.k === "c" ? p.p[2] : 0)) return false;
    }
  }
  return true;
}
function scaleParts(parts, f2) {
  const bb3 = bbOf(parts);
  const cx = (bb3[0] + bb3[2]) / 2, cy = (bb3[1] + bb3[3]) / 2;
  return parts.map((p) => {
    if (p.k === "c") return { ...p, p: [cx + (p.p[0] - cx) * f2, cy + (p.p[1] - cy) * f2, p.p[2] * f2] };
    const q = p.p.slice();
    for (let i = 0; i < 8; i += 2) {
      q[i] = cx + (q[i] - cx) * f2;
      q[i + 1] = cy + (q[i + 1] - cy) * f2;
    }
    return { ...p, p: q };
  });
}
function commit(B2, type, parts, ward, h, extra) {
  let ps = parts;
  const fits = (p) => riverOK(B2.city, p) && clearanceOK(B2.segs, p);
  if (!fits(ps)) {
    let ok = false;
    for (let i = 0; i < 6 && !ok; i++) {
      ps = scaleParts(ps, 0.88);
      ok = fits(ps);
    }
    if (!ok) {
      B2.stats.dropped++;
      return null;
    }
    B2.stats.repaired++;
  }
  return addBuilding(B2, type, ps, ward, h, extra);
}
function subdivide(p, o, rng, out2, depth = 0) {
  const a = area(p);
  const thr = o.min * (0.75 + rng.next() * o.var * 1.4);
  if (a < thr * 1.15 || depth > 10) return void out2.push(p);
  let bi = 0, bl = -1;
  const n = p.length;
  for (let i = 0; i < n; i++) {
    const l = dist(p[i], p[(i + 1) % n]);
    if (l > bl) bl = l, bi = i;
  }
  const A = p[bi], Bp = p[(bi + 1) % n];
  const t = 0.5 + (rng.next() - 0.5) * 0.36;
  const pt = [A[0] + (Bp[0] - A[0]) * t, A[1] + (Bp[1] - A[1]) * t];
  let d = unit([-(Bp[1] - A[1]), Bp[0] - A[0]]);
  const ang = (rng.next() - 0.5) * o.spread * Math.PI;
  const c = Math.cos(ang), s = Math.sin(ang);
  d = [d[0] * c - d[1] * s, d[0] * s + d[1] * c];
  const gap = a > o.laneArea ? o.lane : 0;
  const [P1, P2] = splitConvex(p, pt, d, gap);
  if (P1.length < 3 || P2.length < 3 || area(P1) < 8 || area(P2) < 8) return void out2.push(p);
  subdivide(P1, o, rng, out2, depth + 1);
  subdivide(P2, o, rng, out2, depth + 1);
}
function pickType(B2, ward, a, dArt, dRiver, dWater, dGate) {
  const w = [];
  const add2 = (t, wt, minA = 0) => {
    if (a >= minA && wt > 0) w.push([t, wt]);
  };
  const tier = B2.city.settlement.tierIndex;
  if (tier <= 1) {
    add2("house", 40);
    add2("hovel", 18);
    add2("barn", 16);
    add2("workshop", 7);
    add2("bakery", 3, 90);
    add2("tavern", 3, 110);
    add2("chapel", 2, 150);
    add2("stable", 4, 120);
    if (ward === "artisan") add2("workshop", 26), add2("smithy", 6, 100);
    if (ward === "religious") add2("chapel", 30), add2("house_l", 12, 140);
    if (ward === "merchant") add2("merchant", 22, 140), add2("house_l", 10, 140);
    return B2.rng.weighted(w.length ? w : [["house", 1]]);
  }
  switch (ward) {
    case "residential":
      add2("house", 60);
      add2("house_l", 12, 150);
      add2("workshop", 5);
      add2("bakery", 2.5, 90);
      add2("tavern", 1.6, 110);
      add2("smithy", 1.2, 90);
      add2("chapel", 0.5, 170);
      add2("stable", 0.7, 130);
      break;
    case "poor":
      add2("hovel", 70);
      add2("house", 20);
      add2("workshop", 3);
      add2("tavern", 1, 100);
      break;
    case "merchant":
      add2("merchant", 45, 140);
      add2("house_l", 15, 140);
      add2("house", 10);
      add2("warehouse", 6, 220);
      add2("inn", 3, 180);
      add2("guildhall", 2.5, 320);
      add2("bakery", 2);
      add2("tavern", 2);
      break;
    case "noble":
      add2("manor", 50, 300);
      add2("house_l", 16, 160);
      add2("palace", 2.2, 520);
      add2("chapel", 3, 200);
      add2("house", 6);
      break;
    case "artisan":
      add2("workshop", 34);
      add2("house", 28);
      add2("smithy", 6, 100);
      add2("bakery", 4, 90);
      add2("house_l", 8, 150);
      add2("tavern", 2, 120);
      add2("guildhall", 1.2, 300);
      add2("stable", 2, 130);
      break;
    case "industrial":
      add2("workshop", 28);
      add2("warehouse", 16, 200);
      add2("smithy", 9, 110);
      add2("granary", 4, 260);
      add2("house", 14);
      add2("hovel", 6);
      add2("stable", 2, 130);
      if (dRiver < 30 && B2.mills < 2) add2("mill", 40, 140);
      break;
    case "harbour":
      add2("warehouse", 32, 180);
      add2("house", 14);
      add2("tavern", 6, 110);
      add2("workshop", 7);
      add2("granary", 5, 240);
      add2("merchant", 6, 160);
      add2("inn", 2.5, 170);
      break;
    case "military":
      add2("barracks", 22, 260);
      add2("stable", 10, 150);
      add2("smithy", 7, 110);
      add2("granary", 6, 220);
      add2("house", 12);
      add2("workshop", 5);
      add2("tavern", 3, 110);
      break;
    case "religious":
      add2("house_l", 20, 150);
      add2("chapel", 8, 170);
      add2("hospital", 2, 380);
      add2("monastery", 1.4, 420);
      add2("house", 18);
      add2("church", 3, 260);
      break;
    case "scholar":
      add2("university", 25, 380);
      add2("house_l", 24, 150);
      add2("house", 12);
      add2("guildhall", 4, 300);
      add2("chapel", 3, 170);
      break;
    case "market":
      add2("merchant", 50, 120);
      add2("inn", 5, 170);
      add2("tavern", 6, 110);
      add2("bakery", 4, 90);
      add2("house_l", 10, 130);
      break;
    case "citadel":
      add2("barracks", 22, 240);
      add2("stable", 12, 140);
      add2("smithy", 8, 100);
      add2("granary", 8, 200);
      add2("chapel", 4, 160);
      add2("workshop", 6);
      break;
  }
  if (!w.length) return "house";
  for (const e of w) {
    if (dGate < 80 && (e[0] === "inn" || e[0] === "stable" || e[0] === "tavern" || e[0] === "barracks")) e[1] *= 3;
    if (dArt < 18 && (e[0] === "merchant" || e[0] === "inn" || e[0] === "tavern" || e[0] === "bakery" || e[0] === "workshop")) e[1] *= 1.6;
    if (dWater < 30 && e[0] === "warehouse") e[1] *= 3;
    if (dArt > 40 && (e[0] === "inn" || e[0] === "guildhall")) e[1] *= 0.3;
  }
  return B2.rng.weighted(w);
}
function footprint(B2, type, shrunk, a, fillBase, frontage) {
  const rng = B2.rng;
  let rc;
  if (frontage) {
    rc = frontage;
  } else {
    let wf = 1, hf = 1, fill = fillBase;
    switch (type) {
      case "house":
        wf = rng.range(0.93, 1);
        hf = rng.range(0.9, 1);
        break;
      case "hovel":
        wf = rng.range(0.7, 0.95);
        hf = rng.range(0.7, 0.95);
        break;
      case "barracks":
      case "stable":
        hf = type === "stable" ? 0.62 : 0.72;
        fill = 0.96;
        break;
      case "warehouse":
      case "granary":
        fill = 0.97;
        hf = rng.range(0.8, 0.95);
        break;
      case "manor":
        fill = 0.62;
        break;
      case "palace":
        fill = 0.72;
        break;
      default:
        break;
    }
    const fr = fitRect(shrunk, fill, wf, hf);
    if (!fr || fr.w < 3.2 || fr.h < 3) return null;
    rc = clampRect(norm(fr), type);
    if (type === "hovel" || type === "house") {
      const jit = (rng.next() - 0.5) * (type === "hovel" ? 0.3 : 0.07);
      const rr = { ...rc, a: rc.a + jit, w: rc.w * 0.95, h: rc.h * 0.95 };
      const pts = rectPts(rr.cx, rr.cy, rr.w, rr.h, rr.a);
      if ([0, 2, 4, 6].every((i) => pointInConvex([pts[i], pts[i + 1]], shrunk, 0.02))) rc = rr;
    }
  }
  const roof = rng.chance(0.72) ? "gable" : "hip";
  const minD = Math.min(rc.w, rc.h);
  const tall = a > 200 ? 1 : 0;
  const streetGable = frontage && rc.w <= 12.5 ? 1 : void 0;
  switch (type) {
    case "house": {
      const r2 = rng.next();
      if (minD > 7.5 && rc.h > 10 && r2 > 0.68) return { parts: shapeL(rc, rng, roof, r2 > 0.92), h: rng.int(0, 2) };
      return { parts: [R(rc, 0, 0, rc.w, rc.h, roof, streetGable)], h: rng.int(0, 2) };
    }
    case "hovel":
      return { parts: [R(rc, 0, 0, rc.w, rc.h, "gable", streetGable)], h: 0 };
    case "house_l": {
      const r2 = rng.next();
      if (minD > 12 && r2 > 0.85) return { parts: shapeU(rc, rng, false, roof), h: 1 + tall };
      if (minD > 7 && r2 > 0.35) return { parts: shapeL(rc, rng, roof, r2 > 0.75), h: 1 + tall };
      return { parts: [R(rc, 0, 0, rc.w, rc.h, roof, streetGable)], h: 1 + tall };
    }
    case "merchant": {
      if (minD > 15 && rng.chance(0.4)) return { parts: shapeU(rc, rng, true, "gable"), h: 2 };
      if (minD > 7 && rng.chance(0.65)) return { parts: shapeL(rc, rng, roof), h: 1 + tall };
      return { parts: [R(rc, 0, 0, rc.w, rc.h, roof, streetGable)], h: 1 + tall };
    }
    case "manor": {
      if (minD > 14 && rng.chance(0.45)) return { parts: shapeU(rc, rng, false, "hip"), h: 2 };
      return { parts: shapeL(rc, rng, "hip", rng.chance(0.3)), h: 2 };
    }
    case "palace": {
      const parts = minD > 16 ? shapeU(rc, rng, false, "hip") : [R(rc, 0, 0, rc.w, rc.h, "hip")];
      parts.push(C(rc, -rc.w / 2 + 3, -rc.h / 2 + 3, 3.2, "cone"), C(rc, rc.w / 2 - 3, -rc.h / 2 + 3, 3.2, "cone"));
      return { parts, h: 2 };
    }
    case "workshop":
      return { parts: minD > 8 && rng.chance(0.3) ? shapeL(rc, rng, "gable") : [R(rc, 0, 0, rc.w, rc.h, "gable", streetGable)], h: rng.int(0, 2) };
    case "warehouse":
      return { parts: [R(rc, 0, 0, rc.w, rc.h, "gable")], h: 1 };
    case "granary":
      return { parts: [R(rc, 0, 0, rc.w, rc.h, "flat")], h: 2 };
    case "inn":
    case "tavern":
      return { parts: minD > 7 ? shapeL(rc, rng, "gable") : [R(rc, 0, 0, rc.w, rc.h, "gable", streetGable)], h: 1 + tall };
    case "bakery":
    case "smithy":
    case "stable":
    case "barracks":
      return { parts: [R(rc, 0, 0, rc.w, rc.h, type === "barracks" ? "hip" : "gable", streetGable)], h: type === "barracks" ? 1 : 0 };
    case "chapel":
      return { parts: smallChurch(rc), h: 1 };
    case "church":
      return { parts: smallChurch(rc), h: 2 };
    case "guildhall":
      return { parts: [R(rc, 0, 0, rc.w, rc.h, "hip"), C(rc, rc.w / 2 - 3, -rc.h / 2 + 3, 2.6, "cone")], h: 2 };
    case "townhall": {
      const bt = clamp(Math.min(rc.w, rc.h) * 0.42, 4.5, 8);
      return { parts: [R(rc, 0, rc.h * 0.08, rc.w, rc.h * 0.84, "hip", 0), R(rc, 0, -rc.h / 2 + rc.h * 0.12, rc.w * 0.84, rc.h * 0.24, "flat", 0), R(rc, 0, -rc.h / 2 + bt / 2, bt, bt, "hip"), C(rc, -rc.w / 2 + 2.6, rc.h / 2 - 2.6, 2.4, "cone"), C(rc, rc.w / 2 - 2.6, rc.h / 2 - 2.6, 2.4, "cone")], h: 2 };
    }
    case "hospital":
      return { parts: minD > 12 ? shapeU(rc, rng, true, "hip") : [R(rc, 0, 0, rc.w, rc.h, "hip")], h: 1 };
    case "university":
      return { parts: minD > 14 ? shapeU(rc, rng, true, "hip") : shapeL(rc, rng, "hip"), h: 2 };
    case "monastery":
      return { parts: minD > 13 ? shapeU(rc, rng, rng.chance(0.5), "gable") : [R(rc, 0, 0, rc.w, rc.h, "gable")], h: 1 };
    case "market_hall":
      return { parts: [R(rc, 0, 0, rc.w, rc.h, "hip")], h: 1 };
    case "barn": {
      const parts = [R(rc, 0, 0, rc.w, rc.h, "gable", 0)];
      if (rc.w > 6) parts.push(R(rc, -rc.w / 2 + 1.2, 0, 2.4, rc.h * 0.42, "flat", 1));
      return { parts, h: 1 };
    }
    case "mill": {
      const parts = [R(rc, 0, 0, rc.w, rc.h, "gable")];
      const r2 = B2.city.river;
      if (r2) {
        const n = nearestOn(r2.pts, [rc.cx, rc.cy]);
        const d = unit(sub(n.q, [rc.cx, rc.cy]));
        const ext = Math.abs(d[0] * Math.cos(rc.a) + d[1] * Math.sin(rc.a)) * rc.w / 2 + Math.abs(-d[0] * Math.sin(rc.a) + d[1] * Math.cos(rc.a)) * rc.h / 2;
        return { parts, h: 1, wheel: [rc.cx + d[0] * (ext + 1.2), rc.cy + d[1] * (ext + 1.2), Math.atan2(d[1], d[0])] };
      }
      return { parts, h: 1 };
    }
    default:
      return { parts: [R(rc, 0, 0, rc.w, rc.h, roof, streetGable)], h: 1 };
  }
}
function findFrontageEdge(plot, parentEdges) {
  if (!parentEdges || !parentEdges.length) return null;
  let bestEdge = null;
  let maxL = 0;
  const n = plot.length;
  for (let i = 0; i < n; i++) {
    const p0 = plot[i], p1 = plot[(i + 1) % n];
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
function processPlots(B2, plots, ward, forced = [], parentEdges) {
  const { rng, cell, city: city2 } = B2;
  const st = styleFor(city2, ward);
  const order = forced.length ? plots.map((p, i) => ({ p, i, a: area(p) })).sort((x, y) => y.a - x.a) : plots.map((p, i) => ({ p, i, a: 0 }));
  order.forEach((o, rank) => {
    const plot = o.p;
    const a = area(plot);
    if (a < 26) return;
    const f2 = forced[rank];
    if (!f2 && !rng.chance(st.keep)) {
      const y = insetConvex(plot, 0.7);
      if (y.length >= 3 && a > 40) {
        const k = rng.chance(0.55) ? 1 : 0;
        cell.yards.push({ p: flat(y), k });
        if (k && a > 70 && rng.chance(0.5)) {
          const c2 = centroid(y);
          cell.trees.push(c2[0], c2[1], rng.range(2.2, 3.6));
        }
      }
      return;
    }
    const c = centroid(plot);
    let dArt = 999;
    for (const [p, q] of B2.fronts) dArt = Math.min(dArt, segDist(c, p, q));
    let dWater = 999;
    for (const [p, q] of B2.coast) dWater = Math.min(dWater, segDist(c, p, q));
    let dRiver = 999;
    if (city2.river) {
      const n = nearestOn(city2.river.pts, c);
      dRiver = n.d - city2.river.w[Math.min(city2.river.w.length - 1, n.i)] / 2;
      dWater = Math.min(dWater, dRiver);
    }
    let dGate = 999;
    for (const g2 of B2.gates) dGate = Math.min(dGate, dist(g2, c));
    let type = f2 ?? pickType(B2, ward, a, dArt, dRiver, dWater, dGate);
    if (type === "mill") B2.mills++;
    let fp = null;
    let backyardPoly = void 0;
    const frontage = findFrontageEdge(plot, parentEdges);
    if (frontage) {
      const targetDepth = type === "merchant" ? rng.range(11, 18) : type === "warehouse" ? rng.range(12, 22) : type === "hovel" ? rng.range(6, 11) : type === "manor" || type === "palace" ? rng.range(14, 24) : rng.range(8, 14);
      const sm = ward === "merchant" || ward === "market" || ward === "artisan" ? rng.range(0.22, 0.45) : ward === "poor" ? rng.range(0.18, 0.38) : rng.range(0.32, 0.55);
      const dims = TYPE_DIMS[type] ?? [6, 12, 8, 16];
      const depth = clamp(targetDepth, dims[2], dims[3]);
      const fr = fitFrontageRect(plot, frontage[0], frontage[1], depth, sm, 0.32, dims[1]);
      if (fr) {
        fp = footprint(B2, type, plot, a, st.fill, fr);
        backyardPoly = fr.backyard;
      }
    }
    if (!fp && parentEdges && parentEdges.length && type !== "manor" && type !== "palace") {
      const pc = centroid(plot);
      let be = null, bd2 = Infinity;
      for (const e of parentEdges) {
        if (dist(e[0], e[1]) < 3) continue;
        const d2 = segDist(pc, e[0], e[1]);
        if (d2 < bd2) bd2 = d2, be = e;
      }
      const shrunk = insetConvex(plot, st.gap * 0.8);
      if (be && shrunk.length >= 3 && area(shrunk) >= 22) {
        const ang = Math.atan2(be[1][1] - be[0][1], be[1][0] - be[0][0]);
        const fr = fitRectAngle(shrunk, ang, st.fill);
        if (fr && fr.w >= 3.4 && fr.h >= 3.2 && fr.w * fr.h > 0.45 * area(shrunk)) fp = footprint(B2, type, shrunk, area(shrunk), st.fill, fr);
      }
    }
    if (!fp) {
      const shrunk = insetConvex(plot, st.gap * rng.range(0.6, 1.4));
      if (shrunk.length >= 3 && area(shrunk) >= 22) {
        const sa = area(shrunk);
        fp = footprint(B2, type, shrunk, sa, st.fill * rng.range(0.93, 1));
        if (!fp && type !== "house" && type !== "hovel") {
          type = ward === "poor" ? "hovel" : "house";
          fp = footprint(B2, type, shrunk, sa, st.fill);
        }
      }
    }
    if (!fp) return;
    if (backyardPoly && area(backyardPoly) > 75 && (ward === "artisan" || ward === "industrial" || ward === "merchant" || ward === "residential" || ward === "harbour") && rng.chance(0.32)) {
      const yb = insetConvex(backyardPoly, 1.1);
      if (yb.length >= 3) {
        const sr = fitRect(yb, 0.86, rng.range(0.45, 0.65), rng.range(0.4, 0.6));
        if (sr && sr.w > 3 && sr.h > 2.8) {
          const n2 = norm(sr);
          const kind = ward === "industrial" || ward === "artisan" ? "workshop" : ward === "harbour" ? "warehouse" : "stable";
          const shed = commit(B2, kind, [R(n2, 0, 0, n2.w, n2.h, "gable")], ward, 0);
          if (shed) shed.name = void 0;
          backyardPoly = yb;
        }
      }
    }
    if (backyardPoly && area(backyardPoly) > 26) {
      const greens = ward === "noble" || ward === "scholar" || ward === "residential" && rng.chance(0.3);
      cell.yards.push({ p: flat(backyardPoly), k: greens ? 1 : 0 });
      if (greens && area(backyardPoly) > 55 && rng.chance(0.35)) {
        const bc4 = centroid(backyardPoly);
        cell.trees.push(bc4[0], bc4[1], rng.range(2, 2.9));
      }
    } else if (ward === "noble" || type === "manor" || type === "palace") {
      const shrunk = insetConvex(plot, st.gap * 0.8);
      if (shrunk.length >= 3) cell.yards.push({ p: flat(shrunk), k: 1 });
    }
    const b = commit(B2, type, fp.parts, ward, fp.h, fp.wheel ? { wheel: fp.wheel } : void 0);
    if (b && (type === "manor" || type === "palace") && rng.chance(0.7)) {
      const bb3 = b.bb;
      cell.trees.push(bb3[0] - 2.2, bb3[1] - 2.2, rng.range(2.2, 3.2));
    }
  });
}
function ring(B2, region, inner, ward, forced = [], skip) {
  const st = styleFor(B2.city, ward);
  const plots = [];
  const n = region.length;
  const o = { min: st.min * B2.mult, lane: 0, laneArea: 1e9, spread: st.spread, var: st.var };
  const forcedQueue = [...forced];
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    const quad = [region[i], region[j], inner[j], inner[i]];
    if (area(quad) < 40) continue;
    if (skip && skip([(region[i][0] + region[j][0]) / 2, (region[i][1] + region[j][1]) / 2])) continue;
    B2.cell.blocks.push(flat(quad));
    const parentEdges = [
      [region[i], region[j]],
      [inner[j], inner[i]]
    ];
    subdivide(quad, o, B2.rng, plots);
    const quadForced = [];
    if (forcedQueue.length) quadForced.push(forcedQueue.shift());
    processPlots(B2, plots, ward, quadForced, parentEdges);
    plots.length = 0;
  }
}
function graves(B2, inner, avoid) {
  const bb3 = bbox(inner);
  for (let i = 0; i < 90; i++) {
    const p = [B2.rng.range(bb3[0], bb3[2]), B2.rng.range(bb3[1], bb3[3])];
    if (!pointInConvex(p, inner, -3.5)) continue;
    if (p[0] > avoid[0] - 3 && p[0] < avoid[2] + 3 && p[1] > avoid[1] - 3 && p[1] < avoid[3] + 3) continue;
    B2.cell.graves.push(p[0], p[1]);
  }
  for (let i = 0; i < 14; i++) {
    const p = [B2.rng.range(bb3[0], bb3[2]), B2.rng.range(bb3[1], bb3[3])];
    if (!pointInConvex(p, inner, -4)) continue;
    if (p[0] > avoid[0] - 6 && p[0] < avoid[2] + 6 && p[1] > avoid[1] - 6 && p[1] < avoid[3] + 6) continue;
    B2.cell.trees.push(p[0], p[1], B2.rng.range(2.4, 3.8));
  }
}
function centralBuilding(B2, inner, type, ward, scale3 = 0.62) {
  const c = centroid(inner);
  const fr = fitRect(homothety(inner, c, scale3), 0.96);
  if (!fr) return null;
  const rc = clampRect(norm(fr), type);
  let parts;
  let h = 2;
  if (type === "cathedral" || type === "temple") parts = cathedralParts(rc, type === "temple", B2.rng.int(0, 3));
  else if (type === "church") parts = smallChurch(rc);
  else if (type === "keep") {
    const s = Math.min(rc.w, rc.h, 34);
    const kr = { ...rc, w: s, h: s * 0.92 };
    const kv = B2.city.resolved.squareTowers ? 0 : B2.rng.int(0, 3);
    if (kv === 1) {
      parts = [C(kr, 0, 0, s * 0.5, "flat"), C(kr, 0, 0, s * 0.3, "cone")];
    } else if (kv === 2) {
      parts = [R(kr, -s * 0.12, 0, s * 1.05, s * 0.52, "hip", 0), R(kr, s * 0.32, 0, s * 0.48, s * 0.48, "flat"), R(kr, s * 0.32, 0, s * 0.26, s * 0.26, "hip")];
    } else {
      parts = [R(kr, 0, 0, kr.w, kr.h, "flat"), R(kr, 0, 0, kr.w * 0.52, kr.h * 0.52, "hip")];
      for (const [su, sv] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) parts.push(C(kr, su * kr.w / 2, sv * kr.h / 2, s * 0.15, "cone"));
    }
  } else if (type === "palace") parts = shapeU(rc, B2.rng, false, "hip").concat([C(rc, -rc.w / 2 + 3, -rc.h / 2 + 3, 3.4, "cone"), C(rc, rc.w / 2 - 3, -rc.h / 2 + 3, 3.4, "cone")]);
  else if (type === "manor") parts = shapeL(rc, B2.rng, "hip");
  else {
    parts = [R(rc, 0, 0, rc.w, rc.h, "hip")];
    h = 1;
  }
  return commit(B2, type, parts, ward, h);
}
function layoutMarket(B2, region) {
  const { cell, rng, city: city2 } = B2;
  const c = centroid(region);
  const inner = homothety(region, c, area(region) > 5e3 ? 0.58 : 0.5);
  cell.open.push({ poly: flat(inner), kind: "plaza" });
  ring(B2, region, inner, "market", ["townhall", "guildhall", "inn"]);
  let hall = null;
  if (rng.chance(0.5) && area(inner) > 1100) hall = centralBuilding(B2, inner, "market_hall", "market", 0.4);
  if (!hall) city2.features.push({ id: city2.nextId++, type: "fountain", p: c, cell: cell.id });
  const bb3 = bbox(inner);
  const axis = bb3[2] - bb3[0] >= bb3[3] - bb3[1] ? 0 : 1;
  const sp = homothety(inner, c, 0.86);
  const rows = 2 + (area(inner) > 2400 ? 1 : 0);
  const across = axis === 0 ? bb3[3] - bb3[1] : bb3[2] - bb3[0];
  for (let r2 = 0; r2 < rows; r2++) {
    const off = ((r2 + 0.5) / rows - 0.5) * across * 0.66;
    for (let k = -8; k <= 8; k++) {
      const along = k * (axis === 0 ? bb3[2] - bb3[0] : bb3[3] - bb3[1]) * 0.062;
      if (!along) continue;
      const p = axis === 0 ? [c[0] + along, c[1] + off] : [c[0] + off, c[1] + along];
      if (!pointInConvex(p, sp, 4)) continue;
      if (dist(p, c) < 11) continue;
      if (hall && p[0] > hall.bb[0] - 5 && p[0] < hall.bb[2] + 5 && p[1] > hall.bb[1] - 5 && p[1] < hall.bb[3] + 5) continue;
      cell.stalls.push(p[0], p[1], 5.2, 3.2, axis === 0 ? Math.PI / 2 : 0, rng.int(0, 6));
    }
  }
}
function layoutCathedral(B2, region) {
  const { cell, city: city2 } = B2;
  const c = centroid(region);
  const inner = homothety(region, c, 0.72);
  cell.open.push({ poly: flat(inner), kind: "yard" });
  ring(B2, region, inner, "religious");
  const b = centralBuilding(B2, inner, city2.params.identity === "ancient" ? "temple" : "cathedral", "religious", 0.84);
  if (b) {
    b.name = nameFor(b.type, B2.rng);
    graves(B2, inner, b.bb);
    const bb3 = b.bb;
    const along = bb3[2] - bb3[0] >= bb3[3] - bb3[1] ? [1, 0] : [0, 1];
    const perp = [-along[1], along[0]];
    const cc2 = [(bb3[0] + bb3[2]) / 2, (bb3[1] + bb3[3]) / 2];
    const half = (Math.abs(perp[0]) * (bb3[2] - bb3[0]) + Math.abs(perp[1]) * (bb3[3] - bb3[1])) / 2;
    for (const side of [-1, 1]) {
      const off = half + 15;
      const q = [cc2[0] + perp[0] * off * side, cc2[1] + perp[1] * off * side];
      if (!pointInConvex(q, inner, 8)) continue;
      const ring2 = unflat(octagon(q[0], q[1], 8.5));
      const cloister = centralBuilding(B2, ring2, side > 0 ? "monastery" : "hospital", "religious", 0.82);
      if (cloister) B2.cell.yards.push({ p: octagon(q[0], q[1], 10), k: 1 });
      for (let t = -1; t <= 1; t++) {
        const tp = [q[0] + along[0] * t * 12, q[1] + along[1] * t * 12];
        if (t && pointInConvex(tp, inner, 6)) B2.cell.trees.push(tp[0], tp[1], 2.2);
      }
    }
  }
}
function layoutChurch(B2, region) {
  const { cell, rng } = B2;
  const c = centroid(region);
  const inner = homothety(region, c, rng.range(0.5, 0.62));
  cell.open.push({ poly: flat(inner), kind: "yard" });
  ring(B2, region, inner, "religious", ["church"]);
  const b = centralBuilding(B2, inner, "church", "religious", 0.5);
  if (b) {
    b.name = nameFor("church", rng);
    graves(B2, inner, b.bb);
  }
}
function layoutCastle(B2, region) {
  const { cell, city: city2, rng } = B2;
  const wall = insetConvex(region, 3.6);
  const bailey = wall.length >= 3 ? insetConvex(wall, 3.4) : [];
  if (bailey.length < 3) return false;
  const mc = city2.cells[city2.marketCell].center;
  let gi = -1, gd = Infinity;
  for (let i = 0; i < wall.length; i++) {
    const a = wall[i], b = wall[(i + 1) % wall.length];
    const L2 = dist(a, b);
    if (L2 < 20) continue;
    const m2 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    const d = dist(m2, mc);
    if (d < gd) gd = d, gi = i;
  }
  if (gi < 0) gi = 0;
  const ga = wall[gi], gb = wall[(gi + 1) % wall.length];
  const gl = dist(ga, gb) || 1;
  const gm = [(ga[0] + gb[0]) / 2, (ga[1] + gb[1]) / 2];
  const towers = [];
  for (const p of wall) towers.push(p[0], p[1], 6.2);
  cell.fort = { wall: flat(wall), towers, gate: [gm[0], gm[1], (gb[1] - ga[1]) / gl, -(gb[0] - ga[0]) / gl] };
  cell.open.push({ poly: flat(bailey), kind: "bailey" });
  const c = centroid(bailey);
  const inner = homothety(bailey, c, 0.6);
  if (area(bailey) > 1500) ring(B2, bailey, inner, "citadel", [], (m2) => dist(m2, gm) < 26);
  const kr = homothety(inner, centroid(inner), 0.55);
  const keep = centralBuilding(B2, kr, "keep", "citadel", 0.95);
  if (keep) keep.name = "Keep";
  void rng;
  return true;
}
function layoutRing(B2, region) {
  const { cell, rng, city: city2 } = B2;
  const ward = cell.ward ?? "residential";
  const c = centroid(region);
  const inner = homothety(region, c, ward === "military" ? rng.range(0.62, 0.7) : rng.range(0.68, 0.74));
  const kind = ward === "scholar" ? "lawn" : ward === "military" ? "parade" : ward === "religious" ? "cloister" : "garden";
  cell.open.push({ poly: flat(inner), kind });
  ring(B2, region, inner, ward);
  if (ward === "religious") {
    const b = centralBuilding(B2, inner, "church", ward, 0.55);
    if (b) b.name = nameFor("church", rng);
  } else if (ward === "noble") {
    centralBuilding(B2, inner, city2.params.identity === "royal" ? "palace" : "manor", ward, 0.52);
  } else if (ward === "scholar") {
    city2.features.push({ id: city2.nextId++, type: rng.chance(0.5) ? "statue" : "fountain", p: c, cell: cell.id });
  }
}
function dedupe(B2) {
  const list = B2.made;
  const polys = list.map((b) => b.parts.map(partPoly));
  const dead = /* @__PURE__ */ new Set();
  for (let i = 0; i < list.length; i++) {
    if (dead.has(i)) continue;
    for (let j = i + 1; j < list.length; j++) {
      if (dead.has(j)) continue;
      const a = list[i].bb, b = list[j].bb;
      if (a[2] < b[0] || b[2] < a[0] || a[3] < b[1] || b[3] < a[1]) continue;
      let hit = false;
      for (const pa of polys[i]) {
        for (const pb of polys[j]) if (satOverlap(pa, pb, 0.15)) hit = true;
        if (hit) break;
      }
      if (hit) {
        dead.add(j);
        B2.stats.dropped++;
      }
    }
  }
  B2.made = list.filter((_, i) => !dead.has(i));
}
function buildCell(city2, cell, stats) {
  city2.buildings = city2.buildings.filter((b) => b.cell !== cell.id || b.manual);
  city2.features = city2.features.filter((f2) => f2.cell !== cell.id);
  cell.blocks = [];
  cell.open = [];
  cell.yards = [];
  cell.trees = [];
  cell.stalls = [];
  cell.graves = [];
  cell.fort = void 0;
  if (cell.kind !== "city" || cell.vids.length < 3) return;
  const rng = new RNG(`${city2.seedUsed}|cell${cell.id}|v${cell.variant}`);
  const ward = cell.ward ?? "residential";
  const n = cell.vids.length;
  const fronts = [];
  const coast = [];
  for (let i = 0; i < n; i++) {
    const a = city2.verts[cell.vids[i]], b = city2.verts[cell.vids[(i + 1) % n]];
    const cls = city2.edges[edgeKey(cell.vids[i], cell.vids[(i + 1) % n])];
    if (cls === "arterial" || cls === "secondary") fronts.push([a, b]);
    if (cls === "coast") coast.push([a, b]);
  }
  for (const c of cell.cuts) fronts.push([c.a, c.b]);
  const segs = [];
  for (let i = 0; i < n; i++) {
    const a = city2.verts[cell.vids[i]], b2 = city2.verts[cell.vids[(i + 1) % n]];
    const cls = city2.edges[edgeKey(cell.vids[i], cell.vids[(i + 1) % n])];
    if (cls === "minor" || cls === "secondary" || cls === "arterial") segs.push([a, b2, (city2.ew[edgeKey(cell.vids[i], cell.vids[(i + 1) % n])] ?? 4) / 2]);
    else if (cls === "wallO") segs.push([a, b2, WALL_T.outer / 2]);
    else if (cls === "wallI") segs.push([a, b2, WALL_T.inner / 2]);
  }
  const bd2 = city2.params.buildingDensity;
  const B2 = {
    city: city2,
    cell,
    rng,
    stats,
    fronts,
    coast,
    made: [],
    mills: 0,
    segs,
    mult: lerp(1.05, 0.45, bd2),
    gates: city2.gates.map((g2) => g2.p)
  };
  const pieces = cellPieces(city2, cell);
  if (pieces.length) {
    let done = false;
    if (pieces.length === 1) {
      const reg = pieces[0];
      if (cell.layout === "market") layoutMarket(B2, reg), done = true;
      else if (cell.layout === "cathedral") layoutCathedral(B2, reg), done = true;
      else if (cell.layout === "church") layoutChurch(B2, reg), done = true;
      else if (cell.layout === "castle") done = layoutCastle(B2, reg);
      else if (cell.layout === "ring" && area(reg) > 2400) layoutRing(B2, reg), done = true;
    }
    if (!done) {
      const st = styleFor(city2, ward);
      const o = { min: st.min * B2.mult, lane: 0, laneArea: 1e9, spread: st.spread, var: st.var };
      for (const p of pieces) {
        cell.blocks.push(flat(p));
        const plots = [];
        subdivide(p, o, rng, plots);
        const parentEdges = p.map((v2, i) => [v2, p[(i + 1) % p.length]]);
        processPlots(B2, plots, ward, [], parentEdges);
      }
    }
  }
  dedupe(B2);
  city2.buildings.push(...B2.made);
}

// src/engine/validate.ts
function validateCity(city2, stats, attempts) {
  const errors = [];
  const warnings = [];
  const info = [];
  const cells = city2.cells;
  const st = city2.settlement;
  const cityCells = cells.filter((c) => c.kind === "city");
  if (cityCells.length < Math.max(3, st.blocks * 0.5)) errors.push(`Settlement too small (${cityCells.length} blocks)`);
  if (st.river && !city2.river) errors.push("River requested but not generated");
  if (st.river && city2.river && city2.bridges.length === 0 && st.tierIndex >= 2) errors.push("River crosses the settlement without a bridge");
  const mainGates = city2.gates.filter((g2) => g2.kind === "main");
  if (st.wall !== "none" && mainGates.length < 2) errors.push("Fewer than two city gates");
  const gateEdges = new Set(city2.gates.map((g2) => g2.edge).filter(Boolean));
  const bridgeLinks = /* @__PURE__ */ new Map();
  for (const b of city2.bridges) {
    const [x, y] = b.cells;
    bridgeLinks.set(x, [...bridgeLinks.get(x) ?? [], y]);
    bridgeLinks.set(y, [...bridgeLinks.get(y) ?? [], x]);
  }
  const hub = city2.marketCell >= 0 ? city2.marketCell : cityCells.slice().sort((a, b) => b.vids.length - a.vids.length)[0].id;
  const reached = /* @__PURE__ */ new Set([hub]);
  const q = [hub];
  while (q.length) {
    const u4 = q.pop();
    const cu = cells[u4];
    const next = [...bridgeLinks.get(u4) ?? []];
    for (let i = 0; i < cu.nbrs.length; i++) {
      const n = cu.nbrs[i];
      if (n < 0 || cells[n].kind !== "city") continue;
      const k = edgeKey(cu.vids[i], cu.vids[(i + 1) % cu.vids.length]);
      const c = city2.edges[k];
      if (c === "minor" || c === "secondary" || c === "arterial" || c === "wallI" && gateEdges.has(k)) next.push(n);
    }
    for (const n of next) if (!reached.has(n)) reached.add(n), q.push(n);
  }
  let badGates = 0;
  for (const g2 of mainGates) if (!cityCells.some((c) => c.vids.includes(g2.vid) && reached.has(c.id))) badGates++;
  if (badGates) errors.push(`${badGates} gate(s) not connected to the market by streets`);
  const isolated = cityCells.filter((c) => !reached.has(c.id)).length;
  if (isolated) errors.push(`${isolated} block(s) have no street access`);
  let noRoad = 0;
  for (const g2 of mainGates) if (!city2.roads.some((r2) => r2.gate === g2.vid)) noRoad++;
  if (noRoad) errors.push(`${noRoad} gate(s) lack an outer road`);
  if (st.market && city2.marketCell >= 0 && !reached.has(city2.marketCell)) errors.push("The market square is not reachable");
  if (!st.market && city2.marketCell >= 0) errors.push("A market square was placed in a settlement without one");
  for (const [name, id] of [["Citadel", city2.citadelCell], ["Cathedral", city2.cathedralCell]]) {
    if (id < 0) {
      if (name === "Citadel" && st.citadel || name === "Cathedral" && st.cathedral) warnings.push(`${name} could not be placed`);
    } else if (!reached.has(id)) errors.push(`${name} is not accessible`);
  }
  const grid = /* @__PURE__ */ new Map();
  const GS = 60;
  city2.buildings.forEach((b, i) => {
    for (let x = Math.floor(b.bb[0] / GS); x <= Math.floor(b.bb[2] / GS); x++)
      for (let y = Math.floor(b.bb[1] / GS); y <= Math.floor(b.bb[3] / GS); y++) {
        const k = x + "," + y;
        if (!grid.has(k)) grid.set(k, []);
        grid.get(k).push(i);
      }
  });
  const polys = city2.buildings.map((b) => b.parts.map(partPoly));
  let overlaps = 0;
  const checked = /* @__PURE__ */ new Set();
  for (const list of grid.values())
    for (let i = 0; i < list.length; i++)
      for (let j = i + 1; j < list.length; j++) {
        const a = list[i], b = list[j];
        const key = a < b ? a + "_" + b : b + "_" + a;
        if (checked.has(key)) continue;
        checked.add(key);
        const A = city2.buildings[a].bb, B2 = city2.buildings[b].bb;
        if (A[2] < B2[0] || B2[2] < A[0] || A[3] < B2[1] || B2[3] < A[1]) continue;
        let hit = false;
        for (const pa of polys[a]) {
          for (const pb of polys[b]) if (satOverlap(pa, pb, 0.2)) hit = true;
          if (hit) break;
        }
        if (hit) overlaps++;
      }
  if (overlaps) errors.push(`${overlaps} overlapping building pair(s)`);
  let roadHits = 0, riverHits = 0, outside = 0;
  const byCell = /* @__PURE__ */ new Map();
  city2.buildings.forEach((b, i) => {
    if (!byCell.has(b.cell)) byCell.set(b.cell, []);
    byCell.get(b.cell).push(i);
  });
  for (const [ci, list] of byCell) {
    const cell = cells[ci];
    const pl = poly(city2, cell);
    const n = cell.vids.length;
    const segs = [];
    for (let i = 0; i < n; i++) {
      const k = edgeKey(cell.vids[i], cell.vids[(i + 1) % n]);
      const c = city2.edges[k];
      if (c === "minor" || c === "secondary" || c === "arterial") segs.push([pl[i], pl[(i + 1) % n], (city2.ew[k] ?? 4) / 2 - 0.4]);
      else if (c === "wallO" || c === "wallI") segs.push([pl[i], pl[(i + 1) % n], 2]);
    }
    for (const cut of cell.cuts) segs.push([cut.a, cut.b, cut.w / 2 - 0.4]);
    for (const bi of list) {
      const b = city2.buildings[bi];
      if (b.manual) continue;
      let bad = false, wet = false, out2 = false;
      for (const p of b.parts) {
        const pts = [];
        if (p.k === "c") pts.push([p.p[0], p.p[1]]);
        else for (let i = 0; i < 8; i += 2) pts.push([p.p[i], p.p[i + 1]]);
        for (const pt of pts) {
          for (const [a, c, w] of segs) if (segDist(pt, a, c) < w - (p.k === "c" ? p.p[2] * 0 : 0)) bad = true;
          if (!pointInPoly(pt, pl) && !pointInConvex(pt, pl, 0.05)) out2 = true;
          if (city2.river) {
            const nn = nearestOn(city2.river.pts, pt);
            if (nn.d < city2.river.w[Math.min(city2.river.w.length - 1, nn.i)] / 2 + 0.2) wet = true;
          }
        }
      }
      if (bad) roadHits++;
      if (wet) riverHits++;
      if (out2) outside++;
    }
  }
  if (roadHits) errors.push(`${roadHits} building(s) touch roads or walls`);
  if (riverHits) errors.push(`${riverHits} building(s) in the river`);
  if (outside) errors.push(`${outside} building(s) outside their block`);
  for (const c of cells) if (c.layout === "market" && st.market) {
    const pz = c.open.find((o) => o.kind === "plaza");
    if (!pz) warnings.push("Market has no open plaza");
    else {
      const pts = [];
      for (let i = 0; i < pz.poly.length; i += 2) pts.push([pz.poly[i], pz.poly[i + 1]]);
      if (area(pts) < 700) warnings.push("Market square is small");
    }
  }
  const wh = city2.buildings.filter((b) => b.type === "warehouse");
  if (wh.length) {
    let good = 0;
    for (const b of wh) {
      const c = [(b.bb[0] + b.bb[2]) / 2, (b.bb[1] + b.bb[3]) / 2];
      const dr = city2.river ? nearestOn(city2.river.pts, c).d : 999;
      const dg = Math.min(...city2.gates.map((g2) => dist(g2.p, c)), 999);
      const cell = cells[b.cell];
      const cn = cell.nbrs.some((n) => n >= 0 && cells[n].kind === "sea");
      if (dr < 120 || dg < 160 || cn || cell.ward === "harbour" || cell.ward === "industrial") good++;
    }
    info.push(`${Math.round(100 * good / wh.length)}% of warehouses sit near trade routes/water`);
  }
  info.push(`Target ${st.population} souls, estimated ${st.population} inhabitants in ${city2.buildings.length} buildings`);
  if (city2.citadelCell >= 0) {
    const c = cells[city2.citadelCell];
    info.push(`Citadel at depth ${c.depth}, ground ${c.elev.toFixed(2)}`);
  }
  if (stats.repaired) info.push(`${stats.repaired} footprint(s) auto-repaired (shrunk to clear water)`);
  if (stats.dropped) info.push(`${stats.dropped} unrepairable footprint(s) skipped`);
  return {
    errors,
    warnings,
    info,
    attempts,
    stats: {
      cells: cityCells.length,
      buildings: city2.buildings.length,
      districts: city2.districts.length,
      gates: city2.gates.length,
      bridges: city2.bridges.length,
      towers: city2.towers.length,
      repaired: stats.repaired,
      dropped: stats.dropped
    }
  };
}

// src/engine/generate.ts
function generateOnce(params, seed2, attempt) {
  const { ctx } = createCtx(params, seed2);
  const city2 = ctx.city;
  buildMesh(ctx);
  if (!makeRiver(ctx)) throw new Error("river routing failed");
  selectCity(ctx);
  classifyEdges(ctx);
  chooseMarket(ctx);
  buildInnerWall(ctx);
  planGates(ctx);
  const plans = planBridges(ctx);
  chooseAnchors(ctx);
  routeStreets(ctx, plans, [city2.citadelCell, city2.cathedralCell].filter((x) => x >= 0));
  assignDistricts(ctx);
  assignWidths(ctx);
  planPlazas(ctx);
  buildWalls(ctx);
  buildHarbour(ctx);
  finalizeGround(ctx);
  const stats = { repaired: 0, dropped: 0 };
  for (const c of city2.cells) if (c.kind === "city") buildCell(city2, c, stats);
  buildSuburbs(ctx);
  buildFeaturesAndDecor(ctx);
  city2.name = params.name.trim() || cityName(new RNG(params.seed + "#name"));
  city2.settlement.population = estimatePopulation(city2.buildings);
  city2.report = validateCity(city2, stats, attempt);
  return city2;
}
function generateCity(params = DEFAULT_PARAMS) {
  let best = null;
  let lastErr = null;
  const MAX = 10;
  for (let attempt = 0; attempt < MAX; attempt++) {
    const seed2 = attempt === 0 ? params.seed : `${params.seed}~${attempt}`;
    try {
      const c = generateOnce(params, seed2, attempt + 1);
      if (!best || c.report.errors.length < best.report.errors.length) best = c;
      if (c.report.errors.length === 0) return c;
    } catch (e) {
      lastErr = e;
    }
  }
  if (best) return best;
  throw lastErr ?? new Error("generation failed");
}

// src/engine/svgctx.ts
var esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
var f = (n) => {
  const s = n.toFixed(2);
  return s.indexOf(".") >= 0 ? s.replace(/0+$/, "").replace(/\.$/, "") : s;
};
function parseColor(c) {
  const m2 = c.match(/^rgba\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)$/);
  if (m2) return { col: `rgb(${Math.round(+m2[1])},${Math.round(+m2[2])},${Math.round(+m2[3])})`, op: +m2[4] };
  return { col: c, op: 1 };
}
var SvgContext = class {
  constructor(x, y, w, h, bg) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.bg = bg;
  }
  x;
  y;
  w;
  h;
  bg;
  fillStyle = "#000";
  strokeStyle = "#000";
  lineWidth = 1;
  lineCap = "butt";
  lineJoin = "miter";
  globalAlpha = 1;
  font = "10px serif";
  textAlign = "left";
  textBaseline = "alphabetic";
  out = [];
  m = [1, 0, 0, 1, 0, 0];
  stack = [];
  d = [];
  dash = [];
  tp(x, y) {
    const m2 = this.m;
    return [m2[0] * x + m2[2] * y + m2[4], m2[1] * x + m2[3] * y + m2[5]];
  }
  sc() {
    return Math.sqrt(Math.abs(this.m[0] * this.m[3] - this.m[1] * this.m[2]));
  }
  save() {
    this.stack.push({ m: [...this.m], fs: this.fillStyle, ss: this.strokeStyle, lw: this.lineWidth, lc: this.lineCap, lj: this.lineJoin, ga: this.globalAlpha, font: this.font, ta: this.textAlign, dash: this.dash });
  }
  restore() {
    const s = this.stack.pop();
    if (!s) return;
    this.m = s.m;
    this.fillStyle = s.fs;
    this.strokeStyle = s.ss;
    this.lineWidth = s.lw;
    this.lineCap = s.lc;
    this.lineJoin = s.lj;
    this.globalAlpha = s.ga;
    this.font = s.font;
    this.textAlign = s.ta;
    this.dash = s.dash;
  }
  mul(n) {
    const m2 = this.m;
    this.m = [
      m2[0] * n[0] + m2[2] * n[1],
      m2[1] * n[0] + m2[3] * n[1],
      m2[0] * n[2] + m2[2] * n[3],
      m2[1] * n[2] + m2[3] * n[3],
      m2[0] * n[4] + m2[2] * n[5] + m2[4],
      m2[1] * n[4] + m2[3] * n[5] + m2[5]
    ];
  }
  translate(x, y) {
    this.mul([1, 0, 0, 1, x, y]);
  }
  scale(x, y) {
    this.mul([x, 0, 0, y, 0, 0]);
  }
  rotate(a) {
    const c = Math.cos(a), s = Math.sin(a);
    this.mul([c, s, -s, c, 0, 0]);
  }
  setTransform() {
  }
  setLineDash(d) {
    this.dash = d;
  }
  beginPath() {
    this.d = [];
  }
  closePath() {
    this.d.push("Z");
  }
  moveTo(x, y) {
    const p = this.tp(x, y);
    this.d.push(`M${f(p[0])} ${f(p[1])}`);
  }
  lineTo(x, y) {
    const p = this.tp(x, y);
    this.d.push(`L${f(p[0])} ${f(p[1])}`);
  }
  rect(x, y, w, h) {
    this.moveTo(x, y);
    this.lineTo(x + w, y);
    this.lineTo(x + w, y + h);
    this.lineTo(x, y + h);
    this.closePath();
  }
  arc(x, y, r2, a0, a1) {
    const sc = this.sc();
    if (Math.abs(a1 - a0) >= Math.PI * 2 - 1e-6) {
      const s = this.tp(x + r2, y);
      const e = this.tp(x - r2, y);
      const rr = r2 * sc;
      this.d.push(`M${f(s[0])} ${f(s[1])}A${f(rr)} ${f(rr)} 0 1 0 ${f(e[0])} ${f(e[1])}A${f(rr)} ${f(rr)} 0 1 0 ${f(s[0])} ${f(s[1])}Z`);
      return;
    }
    const n = Math.max(3, Math.ceil(Math.abs(a1 - a0) / 0.3));
    for (let i = 0; i <= n; i++) {
      const a = a0 + (a1 - a0) * i / n;
      if (i === 0 && this.d.length === 0) this.moveTo(x + Math.cos(a) * r2, y + Math.sin(a) * r2);
      else this.lineTo(x + Math.cos(a) * r2, y + Math.sin(a) * r2);
    }
  }
  ellipse(x, y, rx, ry, rot, a0, a1) {
    const n = Math.max(8, Math.ceil(Math.abs(a1 - a0) / 0.4));
    const c = Math.cos(rot), s = Math.sin(rot);
    for (let i = 0; i <= n; i++) {
      const a = a0 + (a1 - a0) * i / n;
      const ex = Math.cos(a) * rx, ey = Math.sin(a) * ry;
      const px2 = x + ex * c - ey * s, py = y + ex * s + ey * c;
      if (i === 0) this.moveTo(px2, py);
      else this.lineTo(px2, py);
    }
    this.closePath();
  }
  fill() {
    if (!this.d.length) return;
    const { col, op } = parseColor(this.fillStyle);
    const o = op * this.globalAlpha;
    this.out.push(`<path d="${this.d.join("")}" fill="${col}"${o < 1 ? ` fill-opacity="${f(o)}"` : ""}/>`);
  }
  stroke() {
    if (!this.d.length) return;
    const { col, op } = parseColor(this.strokeStyle);
    const o = op * this.globalAlpha;
    const sc = this.sc();
    const dash = this.dash.length ? ` stroke-dasharray="${this.dash.map((x) => f(x * sc)).join(" ")}"` : "";
    this.out.push(
      `<path d="${this.d.join("")}" fill="none" stroke="${col}" stroke-width="${f(this.lineWidth * sc)}" stroke-linecap="${this.lineCap === "butt" ? "butt" : this.lineCap}" stroke-linejoin="${this.lineJoin === "miter" ? "miter" : this.lineJoin}"${o < 1 ? ` stroke-opacity="${f(o)}"` : ""}${dash}/>`
    );
  }
  strokeRect(x, y, w, h) {
    const keep = this.d;
    this.beginPath();
    this.rect(x, y, w, h);
    this.stroke();
    this.d = keep;
  }
  fillRect(x, y, w, h) {
    const keep = this.d;
    this.beginPath();
    this.rect(x, y, w, h);
    this.fill();
    this.d = keep;
  }
  textEl(t, x, y, stroke) {
    const m2 = this.m;
    const size = parseFloat(this.font.match(/([\d.]+)px/)?.[1] ?? "10");
    const fam = this.font.replace(/^.*?[\d.]+px\s*/, "").replace(/"/g, "'");
    const bold = /bold/.test(this.font) ? ' font-weight="bold"' : "";
    const italic = /italic/.test(this.font) ? ' font-style="italic"' : "";
    const anchor = this.textAlign === "center" ? "middle" : this.textAlign === "right" ? "end" : "start";
    const { col, op } = parseColor(stroke ? this.strokeStyle : this.fillStyle);
    const o = op * this.globalAlpha;
    const sc = this.sc();
    const attrs = stroke ? `fill="none" stroke="${col}" stroke-width="${f(this.lineWidth * sc)}" stroke-linejoin="round"${o < 1 ? ` stroke-opacity="${f(o)}"` : ""}` : `fill="${col}"${o < 1 ? ` fill-opacity="${f(o)}"` : ""}`;
    this.out.push(
      `<text transform="matrix(${f(m2[0])} ${f(m2[1])} ${f(m2[2])} ${f(m2[3])} ${f(m2[4])} ${f(m2[5])})" x="${f(x)}" y="${f(y)}" font-family="${esc(fam)}" font-size="${f(size)}"${bold}${italic} text-anchor="${anchor}" ${attrs}>${esc(t)}</text>`
    );
  }
  fillText(t, x, y) {
    this.textEl(t, x, y, false);
  }
  strokeText(t, x, y) {
    this.textEl(t, x, y, true);
  }
  drawImage(img, x, y, w, h) {
    const p = this.tp(x, y);
    const sc = this.sc();
    this.out.push(`<image x="${f(p[0])}" y="${f(p[1])}" width="${f(w * sc)}" height="${f(h * sc)}" preserveAspectRatio="none"${this.globalAlpha < 1 ? ` opacity="${f(this.globalAlpha)}"` : ""} href="${img.toDataURL("image/jpeg", 0.88)}"/>`);
  }
  toString() {
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${f(this.w)}" height="${f(this.h)}" viewBox="${f(this.x)} ${f(this.y)} ${f(this.w)} ${f(this.h)}">
` + (this.bg ? `<rect x="${f(this.x)}" y="${f(this.y)}" width="${f(this.w)}" height="${f(this.h)}" fill="${this.bg}"/>
` : "") + this.out.join("\n") + "\n</svg>";
  }
};

// src/engine/theme.ts
var THEMES = {
  daylight: {
    name: "daylight",
    bg: "#c9d3a0",
    grassLo: [170, 192, 124],
    grassHi: [208, 214, 156],
    rock: [150, 146, 132],
    seaShallow: "#93c6cc",
    seaDeep: "#6fa9ba",
    seaShore: "#d9e8d2",
    wave: "rgba(235,248,250,0.55)",
    riverBank: "#5f98a6",
    river: "#86bcc8",
    riverHi: "#a9d3dc",
    road: "#f0e7d2",
    roadMain: "#f3ecd9",
    roadEdge: "rgba(120,100,70,0.35)",
    outerRoad: "#e0d3ac",
    outerRoadEdge: "#b9a678",
    yard: "#cdbf9b",
    rural: "#bcc78d",
    ruralPad: "#c9b98e",
    plaza: "#f3ead4",
    lawn: "#b3c887",
    garden: "#a6c07a",
    gardenDirt: "#cdbf99",
    parade: "#d8c79d",
    bailey: "#ddd2b6",
    wall: "#a8a295",
    wallEdge: "#4e473f",
    wallTop: "#cfc9ba",
    shadow: "rgba(48,36,24,0.27)",
    outline: "rgba(54,38,28,0.6)",
    ink: "#3d2c1c",
    halo: "rgba(250,244,228,0.92)",
    contour: "rgba(120,100,70,0.22)",
    field: ["#dccf8c", "#b0c47c", "#c0a672", "#cdc890"],
    furrow: "rgba(110,90,50,0.28)",
    forest: ["#6c9a58", "#5b8a4c", "#7aa863"],
    forestDark: "rgba(40,70,36,0.35)",
    pal: {
      tile: [[9, 50, 52], [5, 46, 47], [13, 52, 56], [7, 42, 43]],
      terracotta: [[18, 62, 57], [22, 64, 53], [13, 56, 49], [26, 60, 60]],
      slate: [[214, 13, 50], [208, 11, 43], [220, 15, 54], [204, 12, 39]],
      thatch: [[42, 48, 58], [38, 42, 52], [46, 50, 62], [34, 40, 47]],
      timber: [[27, 40, 42], [23, 36, 37], [32, 42, 47], [19, 32, 35]],
      stone: [[40, 9, 67], [37, 11, 61], [42, 7, 73], [35, 10, 57]],
      dark: [[25, 11, 31], [218, 9, 33], [30, 13, 37], [208, 9, 28]]
    },
    ward: {
      citadel: "#9a7fb0",
      market: "#e0a050",
      noble: "#b67aa6",
      merchant: "#d98a4a",
      residential: "#c9b36a",
      artisan: "#7fa8c8",
      industrial: "#8a8a8a",
      religious: "#e6d86a",
      harbour: "#5aa7bd",
      military: "#c25a4e",
      poor: "#8f6e4c",
      scholar: "#6fbf9a"
    },
    stall: ["#c8503c", "#e8e0c8", "#d2a23c", "#4c7aa8", "#7a9a4c", "#b05a8c"],
    wood: "#8b6a44",
    frame: "#5b4630",
    paper: false
  },
  parchment: {
    name: "parchment",
    bg: "#e6d7ad",
    grassLo: [226, 212, 168],
    grassHi: [238, 227, 187],
    rock: [190, 170, 135],
    seaShallow: "#c7cfb9",
    seaDeep: "#b3c0ae",
    seaShore: "#efe3bf",
    wave: "rgba(90,75,50,0.35)",
    riverBank: "#8a8f78",
    river: "#bfc8b0",
    riverHi: "#d3d9c3",
    road: "#f6ecd2",
    roadMain: "#f7efd6",
    roadEdge: "rgba(90,65,35,0.35)",
    outerRoad: "#eadfba",
    outerRoadEdge: "#bba980",
    yard: "#d8c69c",
    rural: "#c6c69a",
    ruralPad: "#d2c09a",
    plaza: "#f4ebcf",
    lawn: "#d4d29a",
    garden: "#cdcb92",
    gardenDirt: "#dccb9c",
    parade: "#e0cd9c",
    bailey: "#eadcb6",
    wall: "#bfae8c",
    wallEdge: "#4a3523",
    wallTop: "#dccfae",
    shadow: "rgba(70,45,20,0.25)",
    outline: "rgba(66,42,22,0.62)",
    ink: "#3a2615",
    halo: "rgba(244,234,205,0.92)",
    contour: "rgba(110,80,40,0.25)",
    field: ["#e5d49a", "#d8d29c", "#dcc794", "#e0d6a6"],
    furrow: "rgba(110,80,40,0.28)",
    forest: ["#a8a870", "#9a9c66", "#b2b17a"],
    forestDark: "rgba(80,70,40,0.3)",
    pal: {
      tile: [[12, 36, 54], [8, 33, 50], [15, 38, 58], [10, 30, 46]],
      terracotta: [[18, 44, 58], [22, 46, 55], [14, 40, 52], [26, 42, 60]],
      slate: [[30, 8, 52], [28, 8, 46], [34, 9, 56], [26, 7, 42]],
      thatch: [[42, 38, 62], [38, 34, 56], [46, 40, 66], [34, 32, 51]],
      timber: [[26, 30, 44], [22, 28, 40], [30, 32, 49], [18, 26, 37]],
      stone: [[38, 10, 70], [35, 12, 64], [40, 8, 76], [33, 11, 60]],
      dark: [[25, 12, 36], [28, 10, 38], [30, 13, 42], [24, 9, 32]]
    },
    ward: {
      citadel: "#9a6aa0",
      market: "#e09a40",
      noble: "#b0607a",
      merchant: "#d07a3a",
      residential: "#c2a850",
      artisan: "#6a98b8",
      industrial: "#7a7468",
      religious: "#e0c850",
      harbour: "#5a9aa0",
      military: "#b84a40",
      poor: "#8a6240",
      scholar: "#6ab090"
    },
    stall: ["#b8503a", "#eadfc0", "#c89a38", "#6a7a8a", "#8a9448", "#a45c78"],
    wood: "#8a6540",
    frame: "#4a3523",
    paper: true
  }
};
var hslCache = /* @__PURE__ */ new Map();
function hsl(c, dl) {
  const key = c[0] + "," + c[1] + "," + c[2] + "," + dl;
  let s = hslCache.get(key);
  if (!s) {
    s = `hsl(${c[0]},${c[1]}%,${Math.max(8, Math.min(92, c[2] + dl)).toFixed(1)}%)`;
    hslCache.set(key, s);
  }
  return s;
}

// src/engine/terrain.ts
function terrainCanvas(city2, theme2) {
  if (typeof document === "undefined") return null;
  const cache = city2._terr ??= {};
  if (cache[theme2.name]) return cache[theme2.name];
  const N = 320;
  const cv = document.createElement("canvas");
  cv.width = cv.height = N;
  const g2 = cv.getContext("2d");
  const img = g2.createImageData(N, N);
  const elev = makeElev(city2.terrain);
  const nz = new Noise(city2.terrain.seed + 5);
  const [x02, y02, x12] = city2.bounds;
  const sx = (x12 - x02) / N;
  const k = 7 + city2.terrain.amt * 5;
  for (let j = 0; j < N; j++)
    for (let i = 0; i < N; i++) {
      const wx = x02 + (i + 0.5) * sx, wy = y02 + (j + 0.5) * sx;
      const e = elev(wx, wy);
      const dx = elev(wx + sx, wy) - elev(wx - sx, wy), dy = elev(wx, wy + sx) - elev(wx, wy - sx);
      const shade = clamp((dx + dy) * k, -0.35, 0.35);
      const patch = nz.fbm(wx / 180 + 40, wy / 180 + 12, 3);
      const rock = smooth(0.95, 1.5, e) * (city2.resolved.geo === "mountain" ? 1 : 0.5);
      const t = clamp(patch * 1.1 + e * 0.12, 0, 1);
      const o = (j * N + i) * 4;
      for (let c = 0; c < 3; c++) {
        let v2 = theme2.grassLo[c] + (theme2.grassHi[c] - theme2.grassLo[c]) * t;
        v2 = v2 + (theme2.rock[c] - v2) * rock;
        v2 *= 1 + shade * 0.8;
        v2 += (nz.get(wx / 7, wy / 7) - 0.5) * 5;
        img.data[o + c] = clamp(v2, 0, 255);
      }
      img.data[o + 3] = 255;
    }
  g2.putImageData(img, 0, 0);
  cache[theme2.name] = cv;
  return cv;
}
function contours(city2) {
  const c = city2._contour ??= (() => {
    const elev = makeElev(city2.terrain);
    const [x02, y02, x12] = city2.bounds;
    const N = 110;
    const s = (x12 - x02) / N;
    const grid = [];
    for (let j = 0; j <= N; j++) {
      const row = [];
      for (let i = 0; i <= N; i++) row.push(elev(x02 + i * s, y02 + j * s));
      grid.push(row);
    }
    const out2 = [];
    const step = 0.09;
    for (let j = 0; j < N; j++)
      for (let i = 0; i < N; i++) {
        const v2 = [grid[j][i], grid[j][i + 1], grid[j + 1][i + 1], grid[j + 1][i]];
        const P = [[i, j], [i + 1, j], [i + 1, j + 1], [i, j + 1]];
        const mn = Math.min(...v2), mx = Math.max(...v2);
        for (let L2 = Math.ceil(mn / step) * step; L2 < mx; L2 += step) {
          const pts = [];
          for (let e = 0; e < 4; e++) {
            const a = v2[e], b = v2[(e + 1) % 4];
            if (a < L2 !== b < L2) {
              const t = (L2 - a) / (b - a);
              const pa = P[e], pb = P[(e + 1) % 4];
              pts.push(x02 + (pa[0] + (pb[0] - pa[0]) * t) * s, y02 + (pa[1] + (pb[1] - pa[1]) * t) * s);
            }
          }
          if (pts.length === 4) out2.push(...pts);
          else if (pts.length === 8) out2.push(pts[0], pts[1], pts[2], pts[3], pts[4], pts[5], pts[6], pts[7]);
        }
      }
    return out2;
  })();
  return c;
}
function cityShadeCanvas(city2) {
  if (typeof document === "undefined") return null;
  const cache = city2._terr ??= {};
  if (cache.cityShade) return cache.cityShade;
  const N = 400;
  const cv = document.createElement("canvas");
  cv.width = cv.height = N;
  const g2 = cv.getContext("2d");
  const img = g2.createImageData(N, N);
  const elev = makeElev(city2.terrain);
  const [x02, y02, x12] = city2.bounds;
  const sx = (x12 - x02) / N;
  const k = 9 + city2.terrain.amt * 6;
  for (let j = 0; j < N; j++)
    for (let i = 0; i < N; i++) {
      const wx = x02 + (i + 0.5) * sx, wy = y02 + (j + 0.5) * sx;
      const dx = elev(wx + sx, wy) - elev(wx - sx, wy), dy = elev(wx, wy + sx) - elev(wx, wy - sx);
      const shade = clamp((dx + dy) * k, -0.5, 0.5);
      const o = (j * N + i) * 4;
      const lit = shade < 0;
      img.data[o] = lit ? 255 : 40;
      img.data[o + 1] = lit ? 250 : 28;
      img.data[o + 2] = lit ? 235 : 16;
      img.data[o + 3] = Math.round(Math.abs(shade) * 255);
    }
  g2.putImageData(img, 0, 0);
  g2.globalCompositeOperation = "destination-in";
  g2.fillStyle = "#000";
  g2.beginPath();
  for (const c of city2.cells) {
    if (c.kind !== "city" || c.vids.length < 3) continue;
    c.vids.forEach((v2, n) => {
      const p = city2.verts[v2];
      const X = (p[0] - x02) / sx, Y = (p[1] - y02) / sx;
      if (n === 0) g2.moveTo(X, Y);
      else g2.lineTo(X, Y);
    });
    g2.closePath();
  }
  g2.fill();
  g2.globalCompositeOperation = "source-over";
  cache.cityShade = cv;
  return cv;
}

// src/engine/render.ts
var DEFAULT_OPTS = {
  districts: false,
  labels: true,
  roadLabels: true,
  districtLabels: true,
  walls: true,
  terrain: true,
  decor: true,
  buildings: true,
  footprints: false,
  theme: "daylight",
  scale: 1
};
var FONT = 'Cinzel, "Trajan Pro", Georgia, "Times New Roman", serif';
var BODY = '"Crimson Text", Georgia, "Times New Roman", serif';
var L = [-0.62, -0.78];
var CHIMNEY = /* @__PURE__ */ new Set(["house", "house_l", "merchant", "inn", "tavern", "bakery", "smithy", "manor", "hovel", "workshop"]);
var shadeKey = (b, s) => b.pal + "|" + b.ci + "|" + Math.round((s * 5.5 + (b.h - 1) * 2.2) * 2) / 2;
function compile(b) {
  const c = { faces: [], circ: [], ridge: [], inner: [], outl: [], oc: [], shadow: [], shc: [], plan: [], hatch: [], chim: [] };
  const dx = 1.2 + 0.9 * b.h, dy = 1.5 + 1.1 * b.h;
  b.parts.forEach((part, pi) => {
    const layer = Math.min(pi, 2);
    if (part.k === "c") {
      const [x, y, r2] = part.p;
      c.circ.push({ layer, x, y, r: r2, cone: part.roof === "cone", k0: shadeKey(b, -0.6), k1: shadeKey(b, 1.5) });
      c.oc.push([x, y, r2]);
      c.shc.push([x + dx, y + dy, r2]);
      return;
    }
    const p = part.p;
    c.plan.push(p);
    c.outl.push(p);
    c.shadow.push(p.map((v2, i) => v2 + (i % 2 ? dy : dx)));
    const pts = part.along === 0 ? [[p[0], p[1]], [p[2], p[3]], [p[4], p[5]], [p[6], p[7]]] : [[p[2], p[3]], [p[4], p[5]], [p[6], p[7]], [p[0], p[1]]];
    const [A0, A1, A2, A3] = pts;
    const W2 = dist(A0, A1), H2 = dist(A1, A2);
    const cen = [(A0[0] + A2[0]) / 2, (A0[1] + A2[1]) / 2];
    const fl = (...q) => q.flatMap((z) => z);
    const face = (q) => {
      const cc2 = centroid(q);
      const n = unit(sub(cc2, cen));
      const s = (n[0] * L[0] + n[1] * L[1]) * 2;
      c.faces.push({ layer, key: shadeKey(b, s), pts: fl(...q) });
    };
    if (part.roof === "flat") {
      c.faces.push({ layer, key: shadeKey(b, 0.3), pts: fl(A0, A1, A2, A3) });
      const k = Math.max(0.2, 1 - 2.4 / Math.max(2.5, Math.min(W2, H2)));
      c.inner.push(fl(...pts.map((q) => [cen[0] + (q[0] - cen[0]) * k, cen[1] + (q[1] - cen[1]) * k])));
    } else if (part.roof === "hip" && W2 > H2 * 1.05) {
      const rl = (W2 - H2) / 2;
      const ax = unit(sub(A1, A0));
      const R0 = sub(cen, mul(ax, rl)), R1 = add(cen, mul(ax, rl));
      face([A0, A1, R1, R0]);
      face([A2, A3, R0, R1]);
      face([A3, A0, R0]);
      face([A1, A2, R1]);
      c.hatch.push([...A0, ...A1, ...R0, ...R1], [...A2, ...A3, ...R1, ...R0], [...A3, ...A0, ...R0, ...R0], [...A1, ...A2, ...R1, ...R1]);
      c.ridge.push(R0[0], R0[1], R1[0], R1[1], A0[0], A0[1], R0[0], R0[1], A3[0], A3[1], R0[0], R0[1], A1[0], A1[1], R1[0], R1[1], A2[0], A2[1], R1[0], R1[1]);
    } else if (part.roof === "hip") {
      face([A0, A1, cen]);
      face([A1, A2, cen]);
      face([A2, A3, cen]);
      face([A3, A0, cen]);
      for (const [p0, p1] of [[A0, A1], [A1, A2], [A2, A3], [A3, A0]]) c.hatch.push([...p0, ...p1, ...cen, ...cen]);
      c.ridge.push(A0[0], A0[1], cen[0], cen[1], A1[0], A1[1], cen[0], cen[1], A2[0], A2[1], cen[0], cen[1], A3[0], A3[1], cen[0], cen[1]);
    } else {
      const R0 = mid(A3, A0), R1 = mid(A1, A2);
      face([A0, A1, R1, R0]);
      face([R0, R1, A2, A3]);
      c.ridge.push(R0[0], R0[1], R1[0], R1[1]);
      c.hatch.push([...A0, ...A1, ...R0, ...R1], [...A3, ...A2, ...R0, ...R1]);
      if (pi === 0 && CHIMNEY.has(b.type) && b.id * 2654435761 % 7 < 5 && W2 > 4.5) {
        const t = 0.2 + b.id * 40503 % 100 / 100 * 0.6;
        const side = (b.id % 2 ? 1 : -1) * 0.22;
        c.chim.push(R0[0] + (R1[0] - R0[0]) * t + (A0[0] - R0[0]) * side, R0[1] + (R1[1] - R0[1]) * t + (A0[1] - R0[1]) * side, b.type === "smithy" || b.type === "bakery" ? 0.85 : 0.55);
      }
    }
  });
  return c;
}
var comp = (b) => b._c ??= compile(b);
function pf(g2, f2, close = true) {
  g2.moveTo(f2[0], f2[1]);
  for (let i = 2; i < f2.length; i += 2) g2.lineTo(f2[i], f2[i + 1]);
  if (close) g2.closePath();
}
function pp(g2, pts, close = true) {
  g2.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) g2.lineTo(pts[i][0], pts[i][1]);
  if (close) g2.closePath();
}
function circle(g2, x, y, r2) {
  g2.moveTo(x + r2, y);
  g2.arc(x, y, r2, 0, Math.PI * 2);
}
var vis = (v2, b) => !v2 || !(b[2] < v2[0] || b[0] > v2[2] || b[3] < v2[1] || b[1] > v2[3]);
function cellBB(city2, c) {
  return c._bb ??= bbox(poly(city2, c));
}
function textW(s, size) {
  return s.length * size * 0.56;
}
function drawMap(g2, city2, o) {
  const T = THEMES[o.theme];
  const view = o.view;
  const S = o.scale;
  const detail = S > 0.42;
  const B2 = city2.bounds;
  g2.lineJoin = "round";
  g2.lineCap = "round";
  g2.fillStyle = T.bg;
  g2.fillRect(B2[0] - 600, B2[1] - 600, B2[2] - B2[0] + 1200, B2[3] - B2[1] + 1200);
  if (o.terrain) {
    const tc = terrainCanvas(city2, T);
    if (tc) {
      g2.imageSmoothingEnabled = true;
      g2.drawImage(tc, B2[0], B2[1], B2[2] - B2[0], B2[3] - B2[1]);
    }
  }
  if (T.paper && o.decor) drawBlotches(g2, city2, T, view);
  if (o.terrain) {
    for (const f2 of city2.fields) {
      const bb3 = bbox(f2.p, true);
      if (!vis(view, bb3)) continue;
      g2.fillStyle = T.field[f2.tone % T.field.length];
      g2.beginPath();
      pf(g2, f2.p);
      g2.fill();
      g2.strokeStyle = T.forestDark;
      g2.lineWidth = 1.5;
      g2.stroke();
      if (detail) {
        g2.strokeStyle = T.furrow;
        g2.lineWidth = 0.7;
        g2.lineCap = "butt";
        g2.beginPath();
        for (let i = 0; i < f2.f.length; i += 4) {
          g2.moveTo(f2.f[i], f2.f[i + 1]);
          g2.lineTo(f2.f[i + 2], f2.f[i + 3]);
        }
        g2.stroke();
        g2.lineCap = "round";
      }
    }
    if (city2.terrain.amt > 0.35) {
      const cl = contours(city2);
      g2.strokeStyle = T.contour;
      g2.lineWidth = 0.8;
      g2.beginPath();
      for (let i = 0; i < cl.length; i += 4) {
        if (view && (cl[i] < view[0] - 30 || cl[i] > view[2] + 30 || cl[i + 1] < view[1] - 30 || cl[i + 1] > view[3] + 30)) continue;
        g2.moveTo(cl[i], cl[i + 1]);
        g2.lineTo(cl[i + 2], cl[i + 3]);
      }
      g2.stroke();
    }
  }
  for (const c of city2.cells) {
    if (c.kind !== "sea" || c.vids.length < 3) continue;
    if (!vis(view, cellBB(city2, c))) continue;
    g2.fillStyle = T.seaShallow;
    g2.strokeStyle = T.seaShallow;
    g2.lineWidth = 0.8;
    g2.beginPath();
    pp(g2, poly(city2, c));
    g2.fill();
    g2.stroke();
  }
  for (const c of city2.cells) {
    if (c.kind !== "sea" || c.ground.length < 6) continue;
    if (!vis(view, cellBB(city2, c))) continue;
    g2.fillStyle = T.seaDeep;
    g2.strokeStyle = T.seaDeep;
    g2.lineWidth = 0.8;
    g2.beginPath();
    pf(g2, c.ground);
    g2.fill();
    g2.stroke();
  }
  if (o.decor && city2.waves.length) {
    g2.strokeStyle = T.wave;
    g2.lineWidth = 0.9;
    g2.beginPath();
    for (let i = 0; i < city2.waves.length; i += 3) {
      const x = city2.waves[i], y = city2.waves[i + 1], l = city2.waves[i + 2];
      g2.moveTo(x - l / 2, y);
      g2.lineTo(x - l / 4, y - 1.8);
      g2.lineTo(x, y);
      g2.lineTo(x + l / 4, y - 1.8);
      g2.lineTo(x + l / 2, y);
    }
    g2.stroke();
  }
  g2.strokeStyle = T.seaShore;
  g2.lineWidth = 1.6;
  g2.beginPath();
  for (const k in city2.edges) {
    if (city2.edges[k] !== "coast") continue;
    const [a, b] = k.split("_").map(Number);
    g2.moveTo(city2.verts[a][0], city2.verts[a][1]);
    g2.lineTo(city2.verts[b][0], city2.verts[b][1]);
  }
  g2.stroke();
  if (city2.moat > 0 && o.walls) {
    for (const w of city2.walls) {
      if (w.kind !== "outer") continue;
      for (const [col, wd] of [[T.riverBank, city2.moat * 2 + 3.4], [T.river, city2.moat * 2]]) {
        g2.strokeStyle = col;
        g2.lineWidth = wd;
        g2.lineCap = "butt";
        g2.lineJoin = "round";
        g2.beginPath();
        pp(g2, w.vids.map((v2) => city2.verts[v2]), w.closed);
        g2.stroke();
      }
    }
    g2.lineCap = "round";
  }
  for (const r2 of city2.roads) {
    for (const [col, wd] of [[T.outerRoadEdge, r2.w + 1.6], [T.outerRoad, r2.w]]) {
      g2.strokeStyle = col;
      g2.lineWidth = wd;
      g2.beginPath();
      pp(g2, r2.pts, false);
      g2.stroke();
    }
    if (detail && r2.w > 4) {
      g2.strokeStyle = T.outerRoadEdge;
      g2.globalAlpha = 0.45;
      g2.lineWidth = 0.5;
      g2.setLineDash([4, 2.5]);
      for (const off of [-r2.w * 0.22, r2.w * 0.22]) {
        g2.beginPath();
        for (let i = 0; i < r2.pts.length - 1; i++) {
          const a = r2.pts[i], b = r2.pts[i + 1];
          const nn = unit([-(b[1] - a[1]), b[0] - a[0]]);
          if (i === 0) g2.moveTo(a[0] + nn[0] * off, a[1] + nn[1] * off);
          g2.lineTo(b[0] + nn[0] * off, b[1] + nn[1] * off);
        }
        g2.stroke();
      }
      g2.setLineDash([]);
      g2.globalAlpha = 1;
    }
  }
  if (o.decor && city2.forest.length) {
    const f2 = city2.forest;
    const cull = (x, y) => !view || x > view[0] - 8 && x < view[2] + 8 && y > view[1] - 8 && y < view[3] + 8;
    g2.fillStyle = T.forestDark;
    g2.beginPath();
    for (let i = 0; i < f2.length; i += 4) if (cull(f2[i], f2[i + 1])) circle(g2, f2[i] + 1.1, f2[i + 1] + 1.4, f2[i + 2]);
    g2.fill();
    for (let t = 0; t < 3; t++) {
      g2.fillStyle = T.forest[t];
      g2.beginPath();
      for (let i = 0; i < f2.length; i += 4) {
        if (f2[i + 3] !== t || !cull(f2[i], f2[i + 1])) continue;
        const x = f2[i], y = f2[i + 1], rr = f2[i + 2];
        if (detail) {
          const ph = (x * 0.37 + y * 0.61) % 6.28;
          for (let k = 0; k < 3; k++) {
            const a = ph + k * Math.PI * 2 / 3;
            circle(g2, x + Math.cos(a) * rr * 0.32, y + Math.sin(a) * rr * 0.32, rr * 0.74);
          }
        } else circle(g2, x, y, rr);
      }
      g2.fill();
    }
    if (detail) {
      g2.fillStyle = "rgba(255,255,230,0.18)";
      g2.beginPath();
      for (let i = 0; i < f2.length; i += 4) if (cull(f2[i], f2[i + 1])) circle(g2, f2[i] - f2[i + 2] * 0.25, f2[i + 1] - f2[i + 2] * 0.25, f2[i + 2] * 0.5);
      g2.fill();
    }
  }
  const rural = city2.settlement.tierIndex <= 1;
  g2.fillStyle = rural ? T.rural : T.road;
  g2.strokeStyle = rural ? T.rural : T.road;
  g2.lineWidth = 0.8;
  g2.beginPath();
  for (const c of city2.cells) if (c.kind === "city" && c.ground.length && vis(view, cellBB(city2, c))) pf(g2, c.ground);
  g2.fill();
  g2.stroke();
  if (rural) {
    g2.strokeStyle = T.forestDark;
    g2.lineWidth = 1.6;
    g2.beginPath();
    for (const c of city2.cells) {
      if (c.kind !== "city" || !c.ground.length || !vis(view, cellBB(city2, c))) continue;
      const pl = poly(city2, c);
      for (let i = 0; i < pl.length; i++) {
        const a = pl[i], b = pl[(i + 1) % pl.length];
        g2.moveTo(a[0], a[1]);
        g2.lineTo(b[0], b[1]);
      }
    }
    g2.stroke();
  }
  if (o.districts) {
    for (const d of city2.districts) {
      g2.fillStyle = d.color ?? T.ward[d.type];
      g2.globalAlpha = 0.38;
      g2.beginPath();
      for (const id of d.cells) {
        const c = city2.cells[id];
        if (c.ground.length && vis(view, cellBB(city2, c))) pf(g2, c.ground);
      }
      g2.fill();
      g2.globalAlpha = 1;
    }
  }
  if (city2.river) {
    const r2 = city2.river;
    for (const pass of [0, 1, 2]) {
      g2.strokeStyle = pass === 0 ? T.riverBank : pass === 1 ? T.river : T.riverHi;
      if (pass === 2) g2.globalAlpha = 0.55;
      for (let i = 0; i < r2.pts.length - 1; i++) {
        const a = r2.pts[i], b = r2.pts[i + 1];
        if (view && (Math.max(a[0], b[0]) < view[0] - 40 || Math.min(a[0], b[0]) > view[2] + 40 || Math.max(a[1], b[1]) < view[1] - 40 || Math.min(a[1], b[1]) > view[3] + 40)) continue;
        const w = (r2.w[i] + r2.w[i + 1]) / 2;
        g2.lineWidth = pass === 0 ? w + 3.2 : pass === 1 ? w : w * 0.28;
        g2.beginPath();
        g2.moveTo(a[0], a[1]);
        g2.lineTo(b[0], b[1]);
        g2.stroke();
      }
    }
    g2.globalAlpha = 1;
    if (detail && o.decor) {
      g2.strokeStyle = T.riverHi;
      g2.lineWidth = 0.6;
      g2.setLineDash([3, 7]);
      for (const off of [-0.25, 0.25]) {
        g2.beginPath();
        for (let i = 0; i < r2.pts.length - 1; i++) {
          const a = r2.pts[i], b = r2.pts[i + 1];
          const n = unit([-(b[1] - a[1]), b[0] - a[0]]);
          const w = r2.w[i] * off;
          if (i === 0) g2.moveTo(a[0] + n[0] * w, a[1] + n[1] * w);
          g2.lineTo(b[0] + n[0] * w, b[1] + n[1] * w);
        }
        g2.stroke();
      }
      g2.setLineDash([]);
    }
  }
  if (city2.quays && city2.quays.length) {
    const segs = [];
    for (const k of city2.quays) {
      const [a, b] = k.split("_").map(Number);
      const A = city2.verts[a], Bv = city2.verts[b];
      if (!A || !Bv) continue;
      const rw = city2.river?.ew[k];
      if (rw && city2.river) {
        const rp = city2.river.pts, ww = city2.river.w;
        const ex = Bv[0] - A[0], ey = Bv[1] - A[1], l2 = ex * ex + ey * ey || 1;
        const idx = [];
        for (let i = 0; i < rp.length; i++) {
          const t = ((rp[i][0] - A[0]) * ex + (rp[i][1] - A[1]) * ey) / l2;
          if (t < 0.04 || t > 0.96) continue;
          if (Math.abs((rp[i][0] - A[0]) * ey - (rp[i][1] - A[1]) * ex) / Math.sqrt(l2) > 14) continue;
          idx.push(i);
        }
        for (let j = 0; j < idx.length - 1; j++) {
          const i0 = idx[j], i1 = idx[j + 1];
          if (i1 !== i0 + 1) continue;
          const a2 = rp[i0], b2 = rp[i1];
          const n = unit([-(b2[1] - a2[1]), b2[0] - a2[0]]);
          for (const s of [-1, 1]) {
            const oa = (ww[i0] / 2 + 0.6) * s, ob = (ww[i1] / 2 + 0.6) * s;
            segs.push([[a2[0] + n[0] * oa, a2[1] + n[1] * oa], [b2[0] + n[0] * ob, b2[1] + n[1] * ob]]);
          }
        }
      } else segs.push([A, Bv]);
    }
    g2.lineCap = "butt";
    for (const [col, w] of [[T.wallEdge, 2.6], [T.wall, 1.8], [T.wallTop, 0.6]]) {
      g2.strokeStyle = col;
      g2.lineWidth = w;
      g2.beginPath();
      for (const [a, b] of segs) g2.moveTo(a[0], a[1]), g2.lineTo(b[0], b[1]);
      g2.stroke();
    }
    g2.lineCap = "round";
    if (detail) {
      g2.fillStyle = T.wallEdge;
      g2.beginPath();
      for (const [a, b] of segs) {
        const L2 = dist(a, b);
        const n = Math.floor(L2 / 6);
        for (let i = 1; i < n; i++) circle(g2, a[0] + (b[0] - a[0]) * i / n, a[1] + (b[1] - a[1]) * i / n, 0.42);
      }
      g2.fill();
    }
  }
  if (detail) {
    const buckets = /* @__PURE__ */ new Map();
    for (const k in city2.edges) {
      const cls = city2.edges[k];
      if (cls !== "minor" && cls !== "secondary" && cls !== "arterial") continue;
      const w = Math.round((city2.ew[k] ?? (cls === "arterial" ? 9.6 : cls === "secondary" ? 6.6 : 4.4)) * 2) / 2;
      const [a, b] = k.split("_").map(Number);
      const A = city2.verts[a], Bv = city2.verts[b];
      if (view && (Math.max(A[0], Bv[0]) < view[0] - 10 || Math.min(A[0], Bv[0]) > view[2] + 10 || Math.max(A[1], Bv[1]) < view[1] - 10 || Math.min(A[1], Bv[1]) > view[3] + 10)) continue;
      let l = buckets.get(w);
      if (!l) buckets.set(w, l = []);
      l.push(A[0], A[1], Bv[0], Bv[1]);
    }
    g2.lineCap = "round";
    for (const [pass, col] of [[0, T.roadEdge], [1, T.roadMain]]) {
      g2.strokeStyle = col;
      for (const [w, segs] of buckets) {
        if (pass === 0 && w < 3.5) continue;
        g2.lineWidth = pass === 0 ? w + 0.8 : w - 0.15;
        if (pass === 1) g2.globalAlpha = 0.85;
        g2.beginPath();
        for (let i = 0; i < segs.length; i += 4) {
          g2.moveTo(segs[i], segs[i + 1]);
          g2.lineTo(segs[i + 2], segs[i + 3]);
        }
        g2.stroke();
      }
    }
    g2.globalAlpha = 1;
    g2.fillStyle = T.roadMain;
    g2.globalAlpha = 0.85;
    const capR = /* @__PURE__ */ new Map();
    for (const [w] of buckets) capR.set(w, w / 2);
    void capR;
    g2.globalAlpha = 1;
    for (const pz of city2.plazas) {
      const p = city2.verts[pz.vid];
      const r2 = pz.r * 0.9;
      g2.fillStyle = T.plaza;
      g2.strokeStyle = T.roadEdge;
      g2.lineWidth = 0.7;
      g2.beginPath();
      circle(g2, p[0], p[1], r2);
      g2.fill();
      g2.stroke();
      g2.strokeStyle = T.roadEdge;
      g2.lineWidth = 0.45;
      g2.beginPath();
      circle(g2, p[0], p[1], r2 * 0.6);
      circle(g2, p[0], p[1], r2 * 0.2);
      for (let i = 0; i < 10; i++) {
        const a = i / 10 * Math.PI * 2;
        g2.moveTo(p[0] + Math.cos(a) * r2 * 0.2, p[1] + Math.sin(a) * r2 * 0.2);
        g2.lineTo(p[0] + Math.cos(a) * r2 * 0.6, p[1] + Math.sin(a) * r2 * 0.6);
      }
      g2.stroke();
    }
  }
  for (const c of city2.cells)
    for (const cut of c.cuts) {
      g2.strokeStyle = T.roadMain;
      g2.lineWidth = cut.w - 0.2;
      g2.lineCap = "butt";
      g2.beginPath();
      g2.moveTo(cut.a[0], cut.a[1]);
      g2.lineTo(cut.b[0], cut.b[1]);
      g2.stroke();
      g2.lineCap = "round";
    }
  g2.fillStyle = rural ? T.rural : T.yard;
  g2.strokeStyle = rural ? T.rural : T.yard;
  g2.lineWidth = 0.6;
  g2.beginPath();
  for (const c of city2.cells) if (c.kind === "city" && vis(view, cellBB(city2, c))) for (const b of c.blocks) pf(g2, b);
  g2.fill();
  g2.stroke();
  const openCol = { plaza: T.plaza, lawn: T.lawn, yard: T.lawn, parade: T.parade, cloister: T.lawn, garden: T.garden, bailey: T.bailey };
  for (const kind of Object.keys(openCol)) {
    g2.fillStyle = openCol[kind];
    g2.beginPath();
    for (const c of city2.cells) if (c.kind === "city" && vis(view, cellBB(city2, c))) {
      for (const a of c.open) if (a.kind === kind) pf(g2, a.poly);
    }
    g2.fill();
  }
  if (detail) {
    g2.strokeStyle = T.roadEdge;
    g2.lineWidth = 0.5;
    for (const c of city2.cells) {
      if (c.kind !== "city" || !vis(view, cellBB(city2, c))) continue;
      for (const a of c.open) {
        if (a.kind === "cloister" || a.kind === "lawn") {
          const cc2 = centroid(unflatPts(a.poly));
          g2.strokeStyle = T.gardenDirt;
          g2.lineWidth = 1.6;
          g2.beginPath();
          const bb3 = bbox(a.poly, true);
          g2.moveTo(bb3[0] + 3, cc2[1]);
          g2.lineTo(bb3[2] - 3, cc2[1]);
          g2.moveTo(cc2[0], bb3[1] + 3);
          g2.lineTo(cc2[0], bb3[3] - 3);
          g2.stroke();
        }
        g2.strokeStyle = T.roadEdge;
        g2.lineWidth = 0.5;
        g2.beginPath();
        pf(g2, a.poly);
        g2.stroke();
      }
    }
  }
  for (const k of [1, 0]) {
    g2.fillStyle = k ? T.garden : T.gardenDirt;
    g2.beginPath();
    for (const c of city2.cells) if (c.kind === "city" && vis(view, cellBB(city2, c))) {
      for (const y of c.yards) if (y.k === k) pf(g2, y.p);
    }
    g2.fill();
  }
  if (detail && o.decor) {
    g2.strokeStyle = "rgba(70,100,50,0.45)";
    g2.lineWidth = 0.7;
    g2.beginPath();
    for (const c of city2.cells) if (c.kind === "city" && vis(view, cellBB(city2, c))) {
      for (const y of c.yards) if (y.k === 1 && c.ward === "noble") pf(g2, y.p);
    }
    g2.stroke();
  }
  if (o.terrain && (city2.resolved.geo === "hills" || city2.resolved.geo === "mountain" || city2.terrain.amt > 1)) {
    const sc = cityShadeCanvas(city2);
    if (sc) {
      g2.globalAlpha = 0.55;
      g2.drawImage(sc, B2[0], B2[1], B2[2] - B2[0], B2[3] - B2[1]);
      g2.globalAlpha = 1;
    }
  }
  if (o.decor) drawCellDecor(g2, city2, T, view, detail);
  if (rural && city2.settlement.tierIndex <= 1 && detail) {
    g2.fillStyle = T.ruralPad;
    g2.beginPath();
    for (const b of city2.buildings) {
      if (!vis(view, b.bb)) continue;
      const pad = 2.4 + Math.min(5, (b.bb[2] - b.bb[0]) * 0.12);
      g2.rect(b.bb[0] - pad, b.bb[1] - pad, b.bb[2] - b.bb[0] + pad * 2, b.bb[3] - b.bb[1] + pad * 2);
    }
    g2.fill();
  }
  if (o.walls) drawDefences(g2, city2, T, view, S);
  drawBridges(g2, city2, T);
  drawPiers(g2, city2, T);
  if (o.buildings) drawBuildings(g2, city2, T, o, detail);
  if (o.decor) drawFeatures(g2, city2, T, view, S);
  drawSelection(g2, city2, o);
  drawLabels(g2, city2, T, o);
}
function unflatPts(f2) {
  const o = [];
  for (let i = 0; i < f2.length; i += 2) o.push([f2[i], f2[i + 1]]);
  return o;
}
function drawBlotches(g2, city2, T, view) {
  let s = city2.terrain.seed;
  const rnd = () => (s = Math.imul(s, 1664525) + 1013904223 >>> 0) / 4294967296;
  g2.fillStyle = "rgba(140,100,50,0.045)";
  g2.beginPath();
  for (let i = 0; i < 160; i++) {
    const x = city2.bounds[0] + rnd() * (city2.bounds[2] - city2.bounds[0]), y = city2.bounds[1] + rnd() * (city2.bounds[3] - city2.bounds[1]), r2 = 40 + rnd() * 140;
    if (view && (x + r2 < view[0] || x - r2 > view[2] || y + r2 < view[1] || y - r2 > view[3])) continue;
    circle(g2, x, y, r2);
  }
  g2.fill();
  void T;
}
function drawCellDecor(g2, city2, T, view, detail) {
  g2.lineWidth = 0.4;
  for (const c of city2.cells) {
    if (c.kind !== "city" || !vis(view, cellBB(city2, c))) continue;
    const s = c.stalls;
    for (let i = 0; i < s.length; i += 6) {
      const x = s[i], y = s[i + 1], w = s[i + 2], h = s[i + 3], a = s[i + 4];
      const co = Math.cos(a), si = Math.sin(a);
      const pts = [];
      for (const [u4, v2] of [[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]]) pts.push(x + u4 * co - v2 * si, y + u4 * si + v2 * co);
      g2.fillStyle = "rgba(40,30,20,0.25)";
      g2.beginPath();
      pf(g2, pts.map((v2, j) => v2 + (j % 2 ? 0.9 : 0.7)));
      g2.fill();
      g2.fillStyle = T.stall[s[i + 5] % T.stall.length];
      g2.strokeStyle = T.outline;
      g2.beginPath();
      pf(g2, pts);
      g2.fill();
      if (detail) {
        g2.stroke();
        g2.strokeStyle = "rgba(255,250,235,0.55)";
        g2.lineWidth = 0.45;
        g2.beginPath();
        for (const t of [0.25, 0.5, 0.75]) {
          g2.moveTo(pts[0] + (pts[2] - pts[0]) * t, pts[1] + (pts[3] - pts[1]) * t);
          g2.lineTo(pts[6] + (pts[4] - pts[6]) * t, pts[7] + (pts[5] - pts[7]) * t);
        }
        g2.stroke();
        g2.lineWidth = 0.4;
      }
    }
  }
  g2.fillStyle = "rgba(95,90,80,0.7)";
  g2.beginPath();
  for (const c of city2.cells) {
    if (c.kind !== "city" || !c.graves.length || !vis(view, cellBB(city2, c))) continue;
    for (let i = 0; i < c.graves.length; i += 2) g2.rect(c.graves[i] - 0.6, c.graves[i + 1] - 0.9, 1.2, 1.8);
  }
  g2.fill();
  const trees = [];
  for (const c of city2.cells) if (c.kind === "city" && c.trees.length && vis(view, cellBB(city2, c))) trees.push(...c.trees);
  if (trees.length) {
    g2.fillStyle = T.forestDark;
    g2.beginPath();
    for (let i = 0; i < trees.length; i += 3) circle(g2, trees[i] + 0.9, trees[i + 1] + 1.1, trees[i + 2]);
    g2.fill();
    g2.fillStyle = T.forest[0];
    g2.beginPath();
    for (let i = 0; i < trees.length; i += 3) circle(g2, trees[i], trees[i + 1], trees[i + 2]);
    g2.fill();
    if (detail) {
      g2.fillStyle = "rgba(255,255,230,0.2)";
      g2.beginPath();
      for (let i = 0; i < trees.length; i += 3) circle(g2, trees[i] - trees[i + 2] * 0.25, trees[i + 1] - trees[i + 2] * 0.25, trees[i + 2] * 0.5);
      g2.fill();
    }
  }
}
function strokeWallRun(g2, T, pts, closed, t) {
  g2.lineCap = "butt";
  g2.lineJoin = "round";
  g2.strokeStyle = T.shadow;
  g2.lineWidth = t + 2.2;
  g2.beginPath();
  pp(g2, pts.map((p) => [p[0] + 1.3, p[1] + 1.7]), closed);
  g2.stroke();
  g2.strokeStyle = T.wallEdge;
  g2.lineWidth = t + 1.5;
  g2.beginPath();
  pp(g2, pts, closed);
  g2.stroke();
  g2.strokeStyle = T.wall;
  g2.lineWidth = t;
  g2.beginPath();
  pp(g2, pts, closed);
  g2.stroke();
  g2.strokeStyle = T.wallTop;
  g2.lineWidth = t * 0.42;
  g2.beginPath();
  pp(g2, pts, closed);
  g2.stroke();
  g2.strokeStyle = "rgba(60,50,40,0.45)";
  g2.lineWidth = t * 0.42;
  g2.setLineDash([1.1, 1.1]);
  g2.beginPath();
  pp(g2, pts, closed);
  g2.stroke();
  g2.setLineDash([]);
  g2.lineCap = "round";
}
function tower(g2, T, p, r2, kind, dir) {
  g2.fillStyle = "rgba(40,30,20,0.28)";
  g2.beginPath();
  if (kind === "square") {
    const a = Math.atan2(dir[1], dir[0]);
    sq(g2, p[0] + 1.2, p[1] + 1.5, r2 * 1.75, a);
  } else circle(g2, p[0] + 1.2, p[1] + 1.5, r2);
  g2.fill();
  g2.strokeStyle = T.wallEdge;
  g2.lineWidth = 0.9;
  if (kind === "bastion") {
    const n = [-dir[1], dir[0]];
    g2.fillStyle = T.wall;
    g2.beginPath();
    g2.moveTo(p[0] + n[0] * r2 * 0.95, p[1] + n[1] * r2 * 0.95);
    g2.lineTo(p[0] + dir[0] * r2 * 1.7, p[1] + dir[1] * r2 * 1.7);
    g2.lineTo(p[0] - n[0] * r2 * 0.95, p[1] - n[1] * r2 * 0.95);
    g2.closePath();
    g2.fill();
    g2.stroke();
    g2.fillStyle = hsl(T.pal.slate[0], 6);
    g2.beginPath();
    g2.moveTo(p[0] + n[0] * r2 * 0.6, p[1] + n[1] * r2 * 0.6);
    g2.lineTo(p[0] + dir[0] * r2 * 1.15, p[1] + dir[1] * r2 * 1.15);
    g2.lineTo(p[0] - n[0] * r2 * 0.6, p[1] - n[1] * r2 * 0.6);
    g2.closePath();
    g2.fill();
    return;
  }
  g2.fillStyle = T.wall;
  g2.beginPath();
  const ang = Math.atan2(dir[1], dir[0]);
  if (kind === "square") sq(g2, p[0], p[1], r2 * 1.75, ang);
  else circle(g2, p[0], p[1], r2);
  g2.fill();
  g2.stroke();
  if (kind === "square") {
    g2.strokeStyle = "rgba(60,50,40,0.55)";
    g2.lineWidth = 0.5;
    g2.setLineDash([0.8, 0.7]);
    g2.beginPath();
    sq(g2, p[0], p[1], r2 * 1.45, ang);
    g2.stroke();
    g2.setLineDash([]);
    const s = r2 * 1.05;
    const c = Math.cos(ang), si = Math.sin(ang);
    const corner = (u4, v2) => [p[0] + u4 * c - v2 * si, p[1] + u4 * si + v2 * c];
    const cs = [corner(-s / 2, -s / 2), corner(s / 2, -s / 2), corner(s / 2, s / 2), corner(-s / 2, s / 2)];
    for (let i = 0; i < 4; i++) {
      const a = cs[i], b = cs[(i + 1) % 4];
      const m2 = [(a[0] + b[0]) / 2 - p[0], (a[1] + b[1]) / 2 - p[1]];
      const lit = (m2[0] * L[0] + m2[1] * L[1]) / (Math.hypot(m2[0], m2[1]) || 1);
      g2.fillStyle = hsl(T.pal.slate[0], lit * 12);
      g2.beginPath();
      pp(g2, [a, b, p]);
      g2.fill();
    }
    return;
  }
  g2.strokeStyle = "rgba(60,50,40,0.55)";
  g2.lineWidth = 0.5;
  g2.setLineDash([0.9, 0.8]);
  g2.beginPath();
  circle(g2, p[0], p[1], r2 * 0.84);
  g2.stroke();
  g2.setLineDash([]);
  const cr = r2 * (kind === "harbour" ? 0.66 : 0.7);
  const la = Math.atan2(L[1], L[0]);
  g2.fillStyle = hsl(T.pal.slate[0], kind === "harbour" ? 6 : -6);
  g2.beginPath();
  circle(g2, p[0], p[1], cr);
  g2.fill();
  g2.fillStyle = hsl(T.pal.slate[0], kind === "harbour" ? 18 : 10);
  g2.beginPath();
  g2.moveTo(p[0], p[1]);
  g2.arc(p[0], p[1], cr, la - Math.PI / 2, la + Math.PI / 2);
  g2.closePath();
  g2.fill();
  g2.fillStyle = "rgba(30,25,20,0.55)";
  g2.beginPath();
  circle(g2, p[0], p[1], Math.max(0.35, r2 * 0.09));
  g2.fill();
}
function sq(g2, x, y, s, a) {
  const c = Math.cos(a), si = Math.sin(a), h = s / 2;
  const pts = [];
  for (const [u4, v2] of [[-h, -h], [h, -h], [h, h], [-h, h]]) pts.push(x + u4 * c - v2 * si, y + u4 * si + v2 * c);
  pf(g2, pts);
}
function gatehouse(g2, T, p, tan, dir, len, depth, road) {
  const pts = [];
  for (const [u4, v2] of [[-len / 2, -depth / 2], [len / 2, -depth / 2], [len / 2, depth / 2], [-len / 2, depth / 2]]) pts.push(p[0] + tan[0] * u4 + dir[0] * v2, p[1] + tan[1] * u4 + dir[1] * v2);
  g2.fillStyle = "rgba(40,30,20,0.28)";
  g2.beginPath();
  pf(g2, pts.map((v2, i) => v2 + (i % 2 ? 1.5 : 1.2)));
  g2.fill();
  g2.fillStyle = T.wall;
  g2.strokeStyle = T.wallEdge;
  g2.lineWidth = 0.9;
  g2.beginPath();
  pf(g2, pts);
  g2.fill();
  g2.stroke();
  const pw = len * 0.3;
  const q = [];
  for (const [u4, v2] of [[-pw / 2, -depth / 2 - 0.3], [pw / 2, -depth / 2 - 0.3], [pw / 2, depth / 2 + 0.3], [-pw / 2, depth / 2 + 0.3]]) q.push(p[0] + tan[0] * u4 + dir[0] * v2, p[1] + tan[1] * u4 + dir[1] * v2);
  g2.fillStyle = road;
  g2.beginPath();
  pf(g2, q);
  g2.fill();
  g2.fillStyle = hsl(T.pal.slate[1], 8);
  const roofPts = [];
  for (const [u4, v2] of [[-len / 2 + 1.5, -depth / 2 + 1.2], [-pw / 2 - 0.8, -depth / 2 + 1.2], [-pw / 2 - 0.8, depth / 2 - 1.2], [-len / 2 + 1.5, depth / 2 - 1.2]]) roofPts.push(p[0] + tan[0] * u4 + dir[0] * v2, p[1] + tan[1] * u4 + dir[1] * v2);
  g2.beginPath();
  pf(g2, roofPts);
  const roofPts2 = [];
  for (const [u4, v2] of [[len / 2 - 1.5, -depth / 2 + 1.2], [pw / 2 + 0.8, -depth / 2 + 1.2], [pw / 2 + 0.8, depth / 2 - 1.2], [len / 2 - 1.5, depth / 2 - 1.2]]) roofPts2.push(p[0] + tan[0] * u4 + dir[0] * v2, p[1] + tan[1] * u4 + dir[1] * v2);
  pf(g2, roofPts2);
  g2.fill();
}
function drawDefences(g2, city2, T, view, S) {
  if (city2.moat > 0) {
    for (const gt of city2.gates) {
      if (gt.kind !== "main") continue;
      g2.fillStyle = T.wood;
      g2.strokeStyle = T.wallEdge;
      g2.lineWidth = 0.6;
      const a = gt.p, b = add(gt.p, mul(gt.dir, city2.moat + 5));
      const n = [-gt.dir[1], gt.dir[0]];
      g2.beginPath();
      pf(g2, [a[0] + n[0] * 3.2, a[1] + n[1] * 3.2, b[0] + n[0] * 3.2, b[1] + n[1] * 3.2, b[0] - n[0] * 3.2, b[1] - n[1] * 3.2, a[0] - n[0] * 3.2, a[1] - n[1] * 3.2]);
      g2.fill();
      g2.stroke();
    }
  }
  for (const w of city2.walls) {
    if (w.kind !== "sea") strokeWallRun(g2, T, w.vids.map((v2) => city2.verts[v2]), w.closed, w.t);
  }
  for (const w of city2.walls) if (w.kind === "sea") strokeWallRun(g2, T, w.vids.map((v2) => city2.verts[v2]), w.closed, w.t);
  for (const c of city2.cells) {
    if (!c.fort || !vis(view, cellBB(city2, c))) continue;
    const wp = unflatPts(c.fort.wall);
    strokeWallRun(g2, T, wp, true, 3.4);
    const gt = c.fort.gate;
    gatehouse(g2, T, [gt[0], gt[1]], [-gt[3], gt[2]], [gt[2], gt[3]], 15, 7.5, T.bailey);
    for (let i = 0; i < c.fort.towers.length; i += 3) tower(g2, T, [c.fort.towers[i], c.fort.towers[i + 1]], c.fort.towers[i + 2], "round", [1, 0]);
  }
  for (const t of city2.towers) {
    if (view && (t.p[0] < view[0] - 20 || t.p[0] > view[2] + 20 || t.p[1] < view[1] - 20 || t.p[1] > view[3] + 20)) continue;
    tower(g2, T, t.p, t.r, t.kind, t.dir);
  }
  for (const gt of city2.gates) {
    if (view && (gt.p[0] < view[0] - 20 || gt.p[0] > view[2] + 20 || gt.p[1] < view[1] - 20 || gt.p[1] > view[3] + 20)) continue;
    if (gt.kind === "water") {
      const w = WALL_T[gt.wall];
      g2.fillStyle = T.river;
      g2.strokeStyle = T.wallEdge;
      g2.lineWidth = 0.8;
      g2.beginPath();
      pf(g2, [gt.p[0] - gt.tan[0] * 3 - gt.dir[0] * (w / 2 + 1), gt.p[1] - gt.tan[1] * 3 - gt.dir[1] * (w / 2 + 1), gt.p[0] + gt.tan[0] * 3 - gt.dir[0] * (w / 2 + 1), gt.p[1] + gt.tan[1] * 3 - gt.dir[1] * (w / 2 + 1), gt.p[0] + gt.tan[0] * 3 + gt.dir[0] * (w / 2 + 1), gt.p[1] + gt.tan[1] * 3 + gt.dir[1] * (w / 2 + 1), gt.p[0] - gt.tan[0] * 3 + gt.dir[0] * (w / 2 + 1), gt.p[1] - gt.tan[1] * 3 + gt.dir[1] * (w / 2 + 1)]);
      g2.fill();
      g2.stroke();
      continue;
    }
    if (gt.kind === "inner") gatehouse(g2, T, gt.p, gt.tan, gt.dir, 11, WALL_T.inner + 3, T.road);
    else if (gt.kind === "postern") gatehouse(g2, T, gt.p, gt.tan, gt.dir, 6.5, WALL_T.outer + 1.6, T.outerRoad);
    else if (city2.resolved.walls !== "none") {
      const barb = city2.resolved.walls === "double" || city2.resolved.bastions;
      if (barb) {
        const bp = add(gt.p, mul(gt.dir, city2.moat > 0 ? city2.moat + 6 : WALL_T.outer / 2 + 6.5));
        const pts = [];
        for (const [u4, v2] of [[-7, -4.5], [7, -4.5], [6, 4.5], [-6, 4.5]]) pts.push(bp[0] + gt.tan[0] * u4 + gt.dir[0] * v2, bp[1] + gt.tan[1] * u4 + gt.dir[1] * v2);
        g2.fillStyle = T.shadow;
        g2.beginPath();
        pf(g2, pts.map((v2, i) => v2 + (i % 2 ? 1.6 : 1.3)));
        g2.fill();
        g2.fillStyle = T.wall;
        g2.strokeStyle = T.wallEdge;
        g2.lineWidth = 0.9;
        g2.beginPath();
        pf(g2, pts);
        g2.fill();
        g2.stroke();
        g2.fillStyle = T.bailey;
        const ip = [];
        for (const [u4, v2] of [[-4.6, -2.6], [4.6, -2.6], [4, 2.6], [-4, 2.6]]) ip.push(bp[0] + gt.tan[0] * u4 + gt.dir[0] * v2, bp[1] + gt.tan[1] * u4 + gt.dir[1] * v2);
        g2.beginPath();
        pf(g2, ip);
        g2.fill();
        g2.fillStyle = T.road;
        g2.beginPath();
        const op = [];
        for (const [u4, v2] of [[-1.8, 2.4], [1.8, 2.4], [1.8, 4.9], [-1.8, 4.9]]) op.push(bp[0] + gt.tan[0] * u4 + gt.dir[0] * v2, bp[1] + gt.tan[1] * u4 + gt.dir[1] * v2);
        pf(g2, op);
        g2.fill();
      }
      gatehouse(g2, T, gt.p, gt.tan, gt.dir, 16, WALL_T.outer + 4, T.road);
    }
  }
  void S;
}
function drawBridges(g2, city2, T) {
  for (const b of city2.bridges) {
    const a = add(b.m, mul(b.dir, -b.len / 2)), c = add(b.m, mul(b.dir, b.len / 2));
    const n = [-b.dir[1], b.dir[0]];
    const hw = b.w / 2;
    const np = Math.max(1, Math.round(b.len / 9) - 1);
    for (let i = 1; i <= np; i++) {
      const q = add(a, mul(sub(c, a), i / (np + 1)));
      for (const s of [-1, 1]) {
        const base1 = add(q, add(mul(n, s * hw), mul(b.dir, -1.3)));
        const base2 = add(q, add(mul(n, s * hw), mul(b.dir, 1.3)));
        const tip = add(q, mul(n, s * (hw + 2.4)));
        g2.fillStyle = T.wall;
        g2.strokeStyle = T.wallEdge;
        g2.lineWidth = 0.6;
        g2.beginPath();
        pp(g2, [base1, tip, base2]);
        g2.fill();
        g2.stroke();
      }
    }
    g2.fillStyle = "rgba(30,40,40,0.25)";
    g2.beginPath();
    pf(g2, [a[0] + n[0] * hw + 1, a[1] + n[1] * hw + 1.4, c[0] + n[0] * hw + 1, c[1] + n[1] * hw + 1.4, c[0] - n[0] * hw + 1, c[1] - n[1] * hw + 1.4, a[0] - n[0] * hw + 1, a[1] - n[1] * hw + 1.4]);
    g2.fill();
    g2.fillStyle = T.roadMain;
    g2.strokeStyle = T.wallEdge;
    g2.lineWidth = 0.9;
    g2.lineCap = "butt";
    g2.beginPath();
    pf(g2, [a[0] + n[0] * hw, a[1] + n[1] * hw, c[0] + n[0] * hw, c[1] + n[1] * hw, c[0] - n[0] * hw, c[1] - n[1] * hw, a[0] - n[0] * hw, a[1] - n[1] * hw]);
    g2.fill();
    g2.beginPath();
    g2.moveTo(a[0] + n[0] * hw, a[1] + n[1] * hw);
    g2.lineTo(c[0] + n[0] * hw, c[1] + n[1] * hw);
    g2.moveTo(a[0] - n[0] * hw, a[1] - n[1] * hw);
    g2.lineTo(c[0] - n[0] * hw, c[1] - n[1] * hw);
    g2.stroke();
    g2.strokeStyle = T.roadEdge;
    g2.lineWidth = 0.5;
    g2.beginPath();
    for (let i = 1; i < 6; i++) {
      const p = add(a, mul(sub(c, a), i / 6));
      g2.moveTo(p[0] + n[0] * hw, p[1] + n[1] * hw);
      g2.lineTo(p[0] - n[0] * hw, p[1] - n[1] * hw);
    }
    g2.stroke();
    g2.lineCap = "round";
    if (b.tower) gatehouse(g2, T, b.m, n, b.dir, b.w + 7, 8, T.roadMain);
  }
}
function drawPiers(g2, city2, T) {
  for (const p of city2.piers) {
    g2.strokeStyle = "rgba(30,40,40,0.28)";
    g2.lineWidth = p.w;
    g2.lineCap = "butt";
    g2.beginPath();
    g2.moveTo(p.a[0] + 1, p.a[1] + 1.4);
    g2.lineTo(p.b[0] + 1, p.b[1] + 1.4);
    g2.stroke();
    g2.strokeStyle = T.wallEdge;
    g2.lineWidth = p.w + 0.9;
    g2.beginPath();
    g2.moveTo(p.a[0], p.a[1]);
    g2.lineTo(p.b[0], p.b[1]);
    g2.stroke();
    g2.strokeStyle = T.wood;
    g2.lineWidth = p.w;
    g2.stroke();
    g2.lineCap = "round";
  }
  const bt = city2.boats;
  for (let i = 0; i < bt.length; i += 5) {
    const x = bt[i], y = bt[i + 1], a = bt[i + 2], len = bt[i + 3], w = bt[i + 4];
    const co = Math.cos(a), si = Math.sin(a);
    const hull = [];
    for (let k = 0; k <= 12; k++) {
      const u4 = -1 + 2 * k / 12;
      const hw = w / 2 * Math.pow(Math.max(0, 1 - u4 * u4), 0.65);
      hull.push(x + u4 * len / 2 * co - hw * si, y + u4 * len / 2 * si + hw * co);
    }
    for (let k = 12; k >= 0; k--) {
      const u4 = -1 + 2 * k / 12;
      const hw = -(w / 2) * Math.pow(Math.max(0, 1 - u4 * u4), 0.65);
      hull.push(x + u4 * len / 2 * co - hw * si, y + u4 * len / 2 * si + hw * co);
    }
    g2.fillStyle = "rgba(30,50,60,0.25)";
    g2.beginPath();
    pf(g2, hull.map((v2, j) => v2 + (j % 2 ? 1.1 : 0.8)));
    g2.fill();
    g2.fillStyle = T.wood;
    g2.strokeStyle = T.wallEdge;
    g2.lineWidth = 0.5;
    g2.beginPath();
    pf(g2, hull);
    g2.fill();
    g2.stroke();
    g2.strokeStyle = "rgba(240,225,190,0.7)";
    g2.lineWidth = 0.6;
    g2.beginPath();
    g2.moveTo(x - len * 0.34 * co, y - len * 0.34 * si);
    g2.lineTo(x + len * 0.34 * co, y + len * 0.34 * si);
    g2.stroke();
    if (len > 11) {
      g2.fillStyle = "rgba(245,238,220,0.92)";
      g2.beginPath();
      pf(g2, [x - si * w * 0.1, y + co * w * 0.1, x + co * len * 0.2 - si * w * 0.9, y + si * len * 0.2 + co * w * 0.9, x - co * len * 0.2 - si * w * 0.9, y - si * len * 0.2 + co * w * 0.9]);
      g2.fill();
    }
  }
}
function drawBuildings(g2, city2, T, o, detail) {
  const view = o.view;
  const list = [];
  for (const b of city2.buildings) if (vis(view, b.bb)) list.push(b);
  const cs = list.map(comp);
  g2.fillStyle = T.shadow;
  g2.beginPath();
  for (const c of cs) {
    for (const s of c.shadow) pf(g2, s);
    for (const s of c.shc) circle(g2, s[0], s[1], s[2]);
  }
  g2.fill();
  if (o.footprints) {
    const buckets = /* @__PURE__ */ new Map();
    list.forEach((b, i) => {
      const k = b.pal + "|" + b.ci;
      let l = buckets.get(k);
      if (!l) buckets.set(k, l = []);
      for (const p of cs[i].plan) l.push(p);
    });
    for (const [k, polys] of buckets) {
      const [pal, ci] = k.split("|");
      g2.fillStyle = hsl(T.pal[pal][+ci], 8);
      g2.beginPath();
      for (const p of polys) pf(g2, p);
      g2.fill();
    }
    g2.fillStyle = hsl(T.pal.stone[0], 0);
    g2.beginPath();
    for (const c of cs) for (const x of c.circ) circle(g2, x.x, x.y, x.r);
    g2.fill();
  } else {
    for (let layer = 0; layer < 3; layer++) {
      const buckets = /* @__PURE__ */ new Map();
      for (const c of cs) for (const f2 of c.faces) if (f2.layer === layer) {
        let l = buckets.get(f2.key);
        if (!l) buckets.set(f2.key, l = []);
        l.push(f2.pts);
      }
      for (const [key, polys] of buckets) {
        g2.fillStyle = roofColor(T, key);
        g2.strokeStyle = g2.fillStyle;
        g2.lineWidth = 0.35;
        g2.beginPath();
        for (const p of polys) pf(g2, p);
        g2.fill();
        g2.stroke();
      }
      const cb = /* @__PURE__ */ new Map();
      const hi = /* @__PURE__ */ new Map();
      for (const c of cs) for (const x of c.circ) if (x.layer === layer) {
        let l = cb.get(x.k0);
        if (!l) cb.set(x.k0, l = []);
        l.push(x);
        if (x.cone) {
          let h = hi.get(x.k1);
          if (!h) hi.set(x.k1, h = []);
          h.push(x);
        }
      }
      for (const [k, arr] of cb) {
        g2.fillStyle = roofColor(T, k);
        g2.beginPath();
        for (const x of arr) circle(g2, x.x, x.y, x.r);
        g2.fill();
      }
      for (const [k, arr] of hi) {
        g2.fillStyle = roofColor(T, k);
        g2.beginPath();
        for (const x of arr) circle(g2, x.x - x.r * 0.18, x.y - x.r * 0.2, x.r * 0.66);
        g2.fill();
      }
    }
    if (detail) {
      g2.strokeStyle = "rgba(255,248,230,0.3)";
      g2.lineWidth = 0.4;
      g2.lineCap = "butt";
      g2.beginPath();
      for (const c of cs) for (let i = 0; i < c.ridge.length; i += 4) {
        g2.moveTo(c.ridge[i], c.ridge[i + 1]);
        g2.lineTo(c.ridge[i + 2], c.ridge[i + 3]);
      }
      g2.stroke();
      g2.strokeStyle = "rgba(40,30,20,0.4)";
      g2.beginPath();
      for (const c of cs) for (const p of c.inner) pf(g2, p);
      g2.stroke();
      g2.lineCap = "round";
      if (o.scale > 2.2) {
        g2.strokeStyle = "rgba(45,28,16,0.16)";
        g2.lineWidth = 0.22;
        g2.beginPath();
        for (const c of cs)
          for (const h of c.hatch) {
            const d0 = Math.hypot((h[0] + h[2]) / 2 - (h[4] + h[6]) / 2, (h[1] + h[3]) / 2 - (h[5] + h[7]) / 2);
            const n = Math.min(14, Math.floor(d0 / 0.95));
            for (let i = 1; i < n; i++) {
              const t = i / n;
              g2.moveTo(h[0] + (h[4] - h[0]) * t, h[1] + (h[5] - h[1]) * t);
              g2.lineTo(h[2] + (h[6] - h[2]) * t, h[3] + (h[7] - h[3]) * t);
            }
          }
        g2.stroke();
      }
      if (o.scale > 1.4) {
        g2.fillStyle = "rgba(40,28,20,0.35)";
        g2.beginPath();
        for (const c of cs) for (let i = 0; i < c.chim.length; i += 3) g2.rect(c.chim[i] - c.chim[i + 2] + 0.5, c.chim[i + 1] - c.chim[i + 2] + 0.7, c.chim[i + 2] * 2, c.chim[i + 2] * 2);
        g2.fill();
        g2.fillStyle = "#8a6a5a";
        g2.strokeStyle = "rgba(40,28,20,0.7)";
        g2.lineWidth = 0.25;
        g2.beginPath();
        for (const c of cs) for (let i = 0; i < c.chim.length; i += 3) g2.rect(c.chim[i] - c.chim[i + 2], c.chim[i + 1] - c.chim[i + 2], c.chim[i + 2] * 2, c.chim[i + 2] * 2);
        g2.fill();
        g2.stroke();
      }
    }
  }
  if (detail || o.footprints) {
    g2.strokeStyle = T.outline;
    g2.lineWidth = o.footprints ? 0.7 : 0.45;
    g2.beginPath();
    for (const c of cs) {
      for (const p of c.outl) pf(g2, p);
      for (const p of c.oc) circle(g2, p[0], p[1], p[2]);
    }
    g2.stroke();
  }
  for (const b of list) {
    if (!b.wheel) continue;
    const [x, y, a] = b.wheel;
    const co = Math.cos(a), si = Math.sin(a);
    const pts = [];
    for (const [u4, v2] of [[-1.3, -3], [1.3, -3], [1.3, 3], [-1.3, 3]]) pts.push(x + u4 * co - v2 * si, y + u4 * si + v2 * co);
    g2.fillStyle = T.wood;
    g2.strokeStyle = T.wallEdge;
    g2.lineWidth = 0.5;
    g2.beginPath();
    pf(g2, pts);
    g2.fill();
    g2.stroke();
  }
}
function roofColor(T, key) {
  const [pal, ci, d] = key.split("|");
  const base = T.pal[pal] ?? T.pal.tile;
  return hsl(base[+ci % base.length], +d);
}
function drawFeatures(g2, city2, T, view, S) {
  for (const f2 of city2.features) {
    const [x, y] = f2.p;
    if (view && (x < view[0] - 30 || x > view[2] + 30 || y < view[1] - 30 || y > view[3] + 30)) continue;
    g2.lineWidth = 0.7;
    g2.strokeStyle = T.wallEdge;
    switch (f2.type) {
      case "fountain":
        g2.fillStyle = T.wallTop;
        g2.beginPath();
        circle(g2, x, y, 5.2);
        g2.fill();
        g2.stroke();
        g2.fillStyle = T.river;
        g2.beginPath();
        circle(g2, x, y, 3.8);
        g2.fill();
        g2.fillStyle = T.riverHi;
        g2.beginPath();
        circle(g2, x, y, 1.4);
        g2.fill();
        break;
      case "well":
        g2.fillStyle = T.wall;
        g2.beginPath();
        circle(g2, x, y, 2.4);
        g2.fill();
        g2.stroke();
        g2.fillStyle = "#4a5a62";
        g2.beginPath();
        circle(g2, x, y, 1.2);
        g2.fill();
        break;
      case "statue":
        g2.fillStyle = "rgba(40,30,20,0.28)";
        g2.beginPath();
        circle(g2, x + 1, y + 1.2, 2.4);
        g2.fill();
        g2.fillStyle = T.wallTop;
        g2.beginPath();
        circle(g2, x, y, 2.6);
        g2.fill();
        g2.stroke();
        g2.fillStyle = T.wall;
        g2.beginPath();
        circle(g2, x, y, 1.1);
        g2.fill();
        break;
      case "obelisk":
        g2.fillStyle = T.wallTop;
        g2.beginPath();
        sq(g2, x, y, 3.4, Math.PI / 4);
        g2.fill();
        g2.stroke();
        break;
      case "shrine":
        g2.fillStyle = T.wallTop;
        g2.beginPath();
        sq(g2, x, y, 3, 0);
        g2.fill();
        g2.stroke();
        g2.beginPath();
        g2.moveTo(x, y - 1.2);
        g2.lineTo(x, y + 1.2);
        g2.moveTo(x - 1, y - 0.3);
        g2.lineTo(x + 1, y - 0.3);
        g2.stroke();
        break;
      case "gallows":
        g2.strokeStyle = T.ink;
        g2.lineWidth = 1;
        g2.beginPath();
        g2.moveTo(x - 3, y + 3);
        g2.lineTo(x - 3, y - 3);
        g2.lineTo(x + 3, y - 3);
        g2.moveTo(x - 3, y - 1);
        g2.lineTo(x - 1, y - 3);
        g2.stroke();
        break;
      case "watchtower":
        g2.fillStyle = T.wall;
        g2.beginPath();
        sq(g2, x, y, 6, 0);
        g2.fill();
        g2.stroke();
        break;
      case "lighthouse":
        g2.fillStyle = "rgba(40,30,20,0.28)";
        g2.beginPath();
        circle(g2, x + 1.4, y + 1.8, 5);
        g2.fill();
        g2.fillStyle = T.wallTop;
        g2.beginPath();
        circle(g2, x, y, 5);
        g2.fill();
        g2.stroke();
        g2.fillStyle = hsl(T.pal.tile[0], 4);
        g2.beginPath();
        circle(g2, x, y, 3.2);
        g2.fill();
        g2.fillStyle = "#f4e6a0";
        g2.beginPath();
        circle(g2, x, y, 1.4);
        g2.fill();
        break;
      case "windmill": {
        const rot = f2.id * 0.7 % 1.5;
        g2.fillStyle = "rgba(40,30,20,0.25)";
        g2.beginPath();
        circle(g2, x + 1.2, y + 1.6, 4);
        g2.fill();
        g2.strokeStyle = T.ink;
        g2.lineWidth = 0.9;
        g2.beginPath();
        for (let k = 0; k < 4; k++) {
          const a = rot + k * Math.PI / 2;
          g2.moveTo(x, y);
          g2.lineTo(x + Math.cos(a) * 13, y + Math.sin(a) * 13);
        }
        g2.stroke();
        g2.fillStyle = "rgba(240,232,210,0.9)";
        g2.strokeStyle = T.wallEdge;
        g2.lineWidth = 0.4;
        for (let k = 0; k < 4; k++) {
          const a = rot + k * Math.PI / 2;
          const nx = -Math.sin(a), ny = Math.cos(a);
          g2.beginPath();
          pf(g2, [x + Math.cos(a) * 4 + nx * 0, y + Math.sin(a) * 4, x + Math.cos(a) * 13, y + Math.sin(a) * 13, x + Math.cos(a) * 13 + nx * 3.2, y + Math.sin(a) * 13 + ny * 3.2, x + Math.cos(a) * 4 + nx * 3.2, y + Math.sin(a) * 4 + ny * 3.2]);
          g2.fill();
          g2.stroke();
        }
        g2.fillStyle = T.wood;
        g2.strokeStyle = T.wallEdge;
        g2.lineWidth = 0.6;
        g2.beginPath();
        circle(g2, x, y, 3.4);
        g2.fill();
        g2.stroke();
        break;
      }
    }
  }
  void S;
}
function drawSelection(g2, city2, o) {
  const sel = o.selection;
  if (!sel) return;
  const S = o.scale;
  g2.strokeStyle = "#ffb300";
  g2.lineWidth = 2 / S;
  if (sel.buildings && sel.buildings.size) {
    g2.beginPath();
    for (const b of city2.buildings) {
      if (!sel.buildings.has(b.id)) continue;
      for (const p of b.parts) {
        if (p.k === "r") pf(g2, p.p);
        else circle(g2, p.p[0], p.p[1], p.p[2]);
      }
    }
    g2.stroke();
  }
  if (sel.district !== void 0 && sel.district >= 0) {
    const d = city2.districts[sel.district];
    if (d) {
      g2.lineWidth = 2.6 / S;
      g2.setLineDash([6 / S, 4 / S]);
      g2.beginPath();
      for (const id of d.cells) {
        const c = city2.cells[id];
        const n = c.vids.length;
        for (let i = 0; i < n; i++) {
          if (c.nbrs[i] >= 0 && city2.cells[c.nbrs[i]].district === d.id) continue;
          const a = city2.verts[c.vids[i]], b = city2.verts[c.vids[(i + 1) % n]];
          g2.moveTo(a[0], a[1]);
          g2.lineTo(b[0], b[1]);
        }
      }
      g2.stroke();
      g2.setLineDash([]);
    }
  }
  if (sel.vert !== void 0 && sel.vert >= 0) {
    const p = city2.verts[sel.vert];
    g2.fillStyle = "#ffb300";
    g2.strokeStyle = "#5a3a00";
    g2.lineWidth = 1.2 / S;
    g2.beginPath();
    circle(g2, p[0], p[1], 5 / S);
    g2.fill();
    g2.stroke();
  }
  if (sel.feature !== void 0) {
    const f2 = city2.features.find((x) => x.id === sel.feature);
    if (f2) {
      g2.beginPath();
      circle(g2, f2.p[0], f2.p[1], 9);
      g2.stroke();
    }
  }
}
function drawLabels(g2, city2, T, o) {
  const S = o.scale;
  const view = o.view;
  const labels = [];
  const majorList = [];
  let innList = 0;
  if (o.labels) {
    for (const b of city2.buildings) {
      if (!b.name || !vis(view, b.bb)) continue;
      const major = b.type === "cathedral" || b.type === "temple" || b.type === "keep" || b.type === "townhall" || b.type === "palace" || b.type === "university";
      const mid2 = b.type === "church" || b.type === "guildhall" || b.type === "market_hall";
      const inn = b.type === "inn";
      if (!major && !mid2 && !inn) continue;
      if (major && S < 0.3) continue;
      if (mid2 && S < 0.85) continue;
      if (inn && S < 1.8) continue;
      if (!major && (b.bb[2] - b.bb[0]) * S < 24) continue;
      if (majorList.length >= 26) continue;
      if (!major && !mid2 && innList >= 8) continue;
      const size = major ? Math.min(13, Math.max(5.2, 9.6 / S)) : mid2 ? Math.min(7, Math.max(4.1, 8 / S)) : 3.5;
      if (major) majorList.push(b.id);
      if (inn) innList++;
      labels.push({ text: b.name, x: (b.bb[0] + b.bb[2]) / 2, y: (b.bb[1] + b.bb[3]) / 2 + size * 0.34, size, rot: 0, prio: major ? 0 : mid2 ? 2 : 5, font: BODY, halo: true, alpha: major ? 1 : mid2 ? 0.82 : 0.6 });
    }
    if (S > 0.9) {
      for (const f2 of city2.features)
        if (f2.type === "lighthouse") labels.push({ text: "Lighthouse", x: f2.p[0], y: f2.p[1] + 11, size: 4.4, rot: 0, prio: 3, font: BODY, halo: true });
        else if (f2.type === "windmill") labels.push({ text: "Windmill", x: f2.p[0], y: f2.p[1] + 16, size: 4.4, rot: 0, prio: 5, font: BODY, halo: true });
    }
  }
  if (o.districtLabels && S < 1.7) {
    for (const d of city2.districts) {
      if (d.type === "market") continue;
      let best = city2.cells[d.cells[0]], bd2 = Infinity;
      for (const id of d.cells) {
        const c = city2.cells[id];
        const dd = dist(c.center, d.center);
        if (dd < bd2) bd2 = dd, best = c;
      }
      const size = Math.min(22, Math.max(9, 12 / S + 2)) * (d.cells.length > 4 ? 1.1 : 0.9);
      const text = d.name.toUpperCase().split("").join(d.name.length < 16 ? "\u200A" : "");
      labels.push({ text, x: best.center[0], y: best.center[1] + size * 0.3, size, rot: 0, prio: 1, font: FONT, alpha: 0.62, halo: false, color: d.color ?? void 0 });
    }
  }
  if (o.roadLabels && S > 0.55) {
    for (const st of city2.streets) {
      if (st.kind !== "arterial") continue;
      let best = null, bl = 0;
      for (let i = 0; i < st.vids.length - 1; i++) {
        const k = edgeKey(st.vids[i], st.vids[i + 1]);
        if (!city2.edges[k] || city2.edges[k] !== "arterial" && city2.edges[k] !== "secondary") continue;
        const a2 = city2.verts[st.vids[i]], b2 = city2.verts[st.vids[i + 1]];
        const l = dist(a2, b2);
        if (l > bl) bl = l, best = [a2, b2];
      }
      const size = 4.6;
      if (!best || bl < textW(st.name, size) + 6) continue;
      let [a, b] = best;
      let ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
      if (Math.abs(ang) > Math.PI / 2) {
        ang += Math.PI;
        [a, b] = [b, a];
      }
      const m2 = mid(a, b);
      if (!vis(view, [m2[0], m2[1], m2[0], m2[1]])) continue;
      labels.push({ text: st.name, x: m2[0], y: m2[1], size, rot: ang, prio: 6, font: BODY, halo: false, color: T.ink, alpha: 0.78 });
    }
  }
  labels.sort((a, b) => a.prio - b.prio);
  const placed = [];
  g2.textAlign = "center";
  g2.textBaseline = "alphabetic";
  for (const l of labels) {
    const w = textW(l.text, l.size) * (l.font === FONT ? 1.12 : 1), h = l.size * 1.1;
    const bb3 = l.rot === 0 ? [l.x - w / 2, l.y - h, l.x + w / 2, l.y + h * 0.3] : [l.x - w / 2 * 0.8, l.y - w / 2 * 0.5, l.x + w / 2 * 0.8, l.y + w / 2 * 0.5];
    if (l.rot !== 0) {
      const c = Math.abs(Math.cos(l.rot)), s = Math.abs(Math.sin(l.rot));
      const hw = (w * c + h * s) / 2, hh = (w * s + h * c) / 2;
      bb3[0] = l.x - hw;
      bb3[2] = l.x + hw;
      bb3[1] = l.y - hh;
      bb3[3] = l.y + hh;
    }
    if (placed.some((p) => !(bb3[2] < p[0] || bb3[0] > p[2] || bb3[3] < p[1] || bb3[1] > p[3]))) continue;
    placed.push(bb3);
    g2.save();
    g2.translate(l.x, l.y);
    if (l.rot) g2.rotate(l.rot);
    g2.font = `${l.font === FONT ? "bold " : ""}${l.size.toFixed(2)}px ${l.font}`;
    g2.globalAlpha = l.alpha ?? 1;
    if (l.halo !== false) {
      g2.strokeStyle = T.halo;
      g2.lineWidth = l.size * 0.28;
      g2.lineJoin = "round";
      g2.strokeText(l.text, 0, 0);
    } else if (l.font === FONT) {
      g2.strokeStyle = T.halo;
      g2.lineWidth = l.size * 0.16;
      g2.strokeText(l.text, 0, 0);
    }
    g2.fillStyle = l.color ? l.font === FONT ? T.ink : l.color : T.ink;
    g2.fillText(l.text, 0, 0);
    g2.restore();
  }
  g2.globalAlpha = 1;
}
function drawFrame(g2, city2, x, y, w, h, u4, worldPerUnit, themeName, legend = false) {
  const T = THEMES[themeName];
  if (legend) drawLegend(g2, city2, x, y, w, h, u4, T);
  g2.save();
  g2.lineJoin = "miter";
  g2.lineCap = "butt";
  g2.strokeStyle = T.frame;
  g2.lineWidth = 3 * u4;
  g2.strokeRect?.(x + 6 * u4, y + 6 * u4, w - 12 * u4, h - 12 * u4);
  g2.lineWidth = 1 * u4;
  g2.strokeRect?.(x + 11 * u4, y + 11 * u4, w - 22 * u4, h - 22 * u4);
  const st = city2.settlement;
  const flavour = { plains: "the open country", hills: "the hills", coast: "the coast", mountain: "the high passes" };
  const idn = st.tierIndex >= 2 ? identityOf(city2.params.identity).label : `${st.label} of ${flavour[city2.resolved.geo] ?? "the realm"}`;
  g2.font = `bold ${26 * u4}px ${FONT}`;
  const tw = Math.max(textW(city2.name, 26 * u4) * 1.18, textW(idn, 11 * u4) * 1.3) + 36 * u4;
  const bx = x + 24 * u4, by = y + 24 * u4, bh = 62 * u4;
  g2.fillStyle = themeName === "parchment" ? "rgba(244,234,205,0.92)" : "rgba(250,246,232,0.92)";
  g2.strokeStyle = T.frame;
  g2.lineWidth = 1.6 * u4;
  g2.beginPath();
  g2.rect(bx, by, tw, bh);
  g2.fill();
  g2.stroke();
  g2.lineWidth = 0.7 * u4;
  g2.beginPath();
  g2.rect(bx + 3 * u4, by + 3 * u4, tw - 6 * u4, bh - 6 * u4);
  g2.stroke();
  g2.textAlign = "center";
  g2.fillStyle = T.ink;
  g2.fillText(city2.name, bx + tw / 2, by + 33 * u4);
  g2.font = `italic ${11 * u4}px ${BODY}`;
  g2.fillText(idn, bx + tw / 2, by + 50 * u4);
  const cx = x + w - 62 * u4, cy = y + h - 62 * u4, r2 = 32 * u4;
  g2.fillStyle = "rgba(244,236,214,0.7)";
  g2.strokeStyle = T.frame;
  g2.lineWidth = 1.2 * u4;
  g2.beginPath();
  g2.arc(cx, cy, r2 + 4 * u4, 0, Math.PI * 2);
  g2.fill();
  g2.stroke();
  for (let i = 0; i < 4; i++) {
    const a = i * Math.PI / 2 - Math.PI / 2;
    const rr = i === 0 ? r2 : r2 * 0.8;
    g2.fillStyle = i === 0 ? "#9c3b2e" : T.frame;
    g2.beginPath();
    g2.moveTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr);
    g2.lineTo(cx + Math.cos(a + 0.35) * r2 * 0.22, cy + Math.sin(a + 0.35) * r2 * 0.22);
    g2.lineTo(cx, cy);
    g2.closePath();
    g2.fill();
    g2.fillStyle = T.frame;
    g2.beginPath();
    g2.moveTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr);
    g2.lineTo(cx + Math.cos(a - 0.35) * r2 * 0.22, cy + Math.sin(a - 0.35) * r2 * 0.22);
    g2.lineTo(cx, cy);
    g2.closePath();
    g2.fill();
  }
  g2.font = `bold ${12 * u4}px ${FONT}`;
  g2.fillStyle = T.ink;
  g2.textAlign = "center";
  g2.fillText("N", cx, cy - r2 - 8 * u4);
  const target = 130 * u4 * worldPerUnit;
  const nice = [10, 20, 25, 50, 100, 200, 250, 500, 1e3].reduce((p, c) => Math.abs(c - target) < Math.abs(p - target) ? c : p);
  const bw = nice / worldPerUnit;
  const sx = x + 26 * u4, sy = y + h - 34 * u4;
  g2.fillStyle = "rgba(244,236,214,0.75)";
  g2.beginPath();
  g2.rect(sx - 8 * u4, sy - 18 * u4, bw + 16 * u4, 34 * u4);
  g2.fill();
  g2.strokeStyle = T.frame;
  g2.lineWidth = 1.4 * u4;
  g2.beginPath();
  g2.rect(sx, sy - 3 * u4, bw, 6 * u4);
  g2.stroke();
  g2.fillStyle = T.frame;
  g2.beginPath();
  g2.rect(sx, sy - 3 * u4, bw / 2, 6 * u4);
  g2.rect(sx + bw / 2, sy - 3 * u4, bw / 4, 6 * u4);
  g2.fill();
  g2.font = `${10 * u4}px ${BODY}`;
  g2.textAlign = "left";
  g2.fillStyle = T.ink;
  g2.fillText("0", sx - 2 * u4, sy + 14 * u4);
  g2.textAlign = "right";
  g2.fillText(`${nice} m`, sx + bw + 2 * u4, sy + 14 * u4);
  g2.restore();
}
function drawLegend(g2, city2, x, y, w, h, u4, T) {
  const ds = city2.districts.filter((d) => d.type !== "market");
  const rowH = 13 * u4;
  const keys = [
    ["City gate", (cx, cy2) => {
      g2.fillStyle = T.wall;
      g2.strokeStyle = T.wallEdge;
      g2.lineWidth = 0.8 * u4;
      g2.beginPath();
      g2.rect(cx - 6 * u4, cy2 - 3 * u4, 12 * u4, 6 * u4);
      g2.fill();
      g2.stroke();
      g2.fillStyle = T.road;
      g2.fillRect(cx - 1.6 * u4, cy2 - 3 * u4, 3.2 * u4, 6 * u4);
    }],
    ["Postern", (cx, cy2) => {
      g2.fillStyle = T.wall;
      g2.strokeStyle = T.wallEdge;
      g2.lineWidth = 0.8 * u4;
      g2.beginPath();
      g2.rect(cx - 3.5 * u4, cy2 - 3.5 * u4, 7 * u4, 7 * u4);
      g2.fill();
      g2.stroke();
    }],
    ["Tower", (cx, cy2) => {
      g2.fillStyle = T.wall;
      g2.strokeStyle = T.wallEdge;
      g2.lineWidth = 0.8 * u4;
      g2.beginPath();
      g2.arc(cx, cy2, 4 * u4, 0, Math.PI * 2);
      g2.fill();
      g2.stroke();
    }],
    ["Bridge", (cx, cy2) => {
      g2.fillStyle = T.river;
      g2.fillRect(cx - 7 * u4, cy2 - 4 * u4, 14 * u4, 8 * u4);
      g2.fillStyle = T.roadMain;
      g2.strokeStyle = T.wallEdge;
      g2.lineWidth = 0.7 * u4;
      g2.beginPath();
      g2.rect(cx - 2.5 * u4, cy2 - 5 * u4, 5 * u4, 10 * u4);
      g2.fill();
      g2.stroke();
    }],
    ["Market / square", (cx, cy2) => {
      g2.fillStyle = T.plaza;
      g2.strokeStyle = T.roadEdge;
      g2.lineWidth = 0.7 * u4;
      g2.beginPath();
      g2.rect(cx - 6 * u4, cy2 - 4 * u4, 12 * u4, 8 * u4);
      g2.fill();
      g2.stroke();
      g2.fillStyle = T.stall[0];
      g2.fillRect(cx - 3 * u4, cy2 - 1.5 * u4, 2.5 * u4, 3 * u4);
      g2.fillStyle = T.stall[2];
      g2.fillRect(cx + 0.8 * u4, cy2 - 1.5 * u4, 2.5 * u4, 3 * u4);
    }],
    ["Garden / green", (cx, cy2) => {
      g2.fillStyle = T.garden;
      g2.fillRect(cx - 6 * u4, cy2 - 4 * u4, 12 * u4, 8 * u4);
      g2.fillStyle = T.forest[0];
      g2.beginPath();
      g2.arc(cx + 2 * u4, cy2, 2.6 * u4, 0, Math.PI * 2);
      g2.fill();
    }]
  ];
  const bw = 178 * u4;
  const bh = (ds.length + keys.length) * rowH + 54 * u4;
  const bx = x + w - bw - 24 * u4, by = y + 24 * u4;
  if (bh > h - 140 * u4) return;
  g2.save();
  g2.lineJoin = "miter";
  g2.fillStyle = T.paper ? "rgba(244,234,205,0.93)" : "rgba(250,246,232,0.93)";
  g2.strokeStyle = T.frame;
  g2.lineWidth = 1.4 * u4;
  g2.beginPath();
  g2.rect(bx, by, bw, bh);
  g2.fill();
  g2.stroke();
  g2.fillStyle = T.ink;
  g2.textAlign = "left";
  g2.font = `bold ${10.5 * u4}px ${FONT}`;
  g2.fillText("DISTRICTS", bx + 10 * u4, by + 16 * u4);
  let cy = by + 30 * u4;
  g2.font = `${10 * u4}px ${BODY}`;
  ds.forEach((d, i) => {
    g2.fillStyle = d.color ?? T.ward[d.type];
    g2.strokeStyle = "rgba(60,40,20,0.5)";
    g2.lineWidth = 0.6 * u4;
    g2.beginPath();
    g2.rect(bx + 10 * u4, cy - 7.5 * u4, 9 * u4, 9 * u4);
    g2.fill();
    g2.stroke();
    g2.fillStyle = T.ink;
    const name = d.name.length > 24 ? d.name.slice(0, 23) + "\u2026" : d.name;
    g2.fillText(`${i + 1}. ${name}`, bx + 25 * u4, cy);
    cy += rowH;
  });
  cy += 6 * u4;
  g2.font = `bold ${10.5 * u4}px ${FONT}`;
  g2.fillStyle = T.ink;
  g2.fillText("KEY", bx + 10 * u4, cy);
  cy += 14 * u4;
  g2.font = `${10 * u4}px ${BODY}`;
  for (const [label, sym] of keys) {
    g2.save();
    sym(bx + 17 * u4, cy - 3.5 * u4);
    g2.restore();
    g2.fillStyle = T.ink;
    g2.textAlign = "left";
    g2.fillText(label, bx + 32 * u4, cy);
    cy += rowH;
  }
  g2.restore();
}

// scripts/render2.ts
import { Resvg } from "@resvg/resvg-js";
var [, , seed = "x", identity = "merchant", theme = "daylight", pop = "6000", out = "/tmp/city"] = process.argv;
var city = generateCity({ ...DEFAULT_PARAMS, seed, identity, population: +pop });
console.log(city.name, city.settlement.tier, "pop", city.settlement.population, "blocks", city.settlement.blocks, "bldgs", city.buildings.length, city.report.errors);
var bb2 = [Infinity, Infinity, -Infinity, -Infinity];
for (const c of city.cells) if (c.kind === "city") for (const v2 of c.vids) {
  const p = city.verts[v2];
  bb2 = [Math.min(bb2[0], p[0]), Math.min(bb2[1], p[1]), Math.max(bb2[2], p[0]), Math.max(bb2[3], p[1])];
}
var m = Math.max(60, (bb2[2] - bb2[0]) * 0.12);
var x0 = bb2[0] - m;
var y0 = bb2[1] - m;
var x1 = bb2[2] + m;
var y1 = bb2[3] + m;
var W = x1 - x0;
var H = y1 - y0;
var px = 1500;
var scale2 = px / W;
var g = new SvgContext(x0, y0, W, H);
drawMap(g, city, { ...DEFAULT_OPTS, theme, scale: scale2, view: [x0, y0, x1, y1], terrain: true });
drawFrame(g, city, x0, y0, W, H, W / 1200, 1, theme, true);
var svg = g.toString();
writeFileSync(out + ".svg", svg);
var r = new Resvg(svg, { fitTo: { mode: "width", value: px }, font: { loadSystemFonts: true } });
writeFileSync(out + ".png", r.render().asPng());
