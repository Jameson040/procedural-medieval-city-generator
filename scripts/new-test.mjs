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
  constructor(seed) {
    this.s = (typeof seed === "string" ? hashStr(seed) : seed >>> 0) || 2654435769;
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
  constructor(seed) {
    this.seed = seed | 0;
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
    const a = this.h(ix, iy), b = this.h(ix + 1, iy), c2 = this.h(ix, iy + 1), d = this.h(ix + 1, iy + 1);
    return a + (b - a) * u4 + (c2 - a) * v2 + (a - b - c2 + d) * u4 * v2;
  }
  fbm(x, y, oct = 4) {
    let s = 0, a = 0.5, f = 1, n = 0;
    for (let i = 0; i < oct; i++) {
      s += a * this.get(x * f, y * f);
      n += a;
      a *= 0.5;
      f *= 2.03;
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
    const f = p[0] * q[1] - q[0] * p[1];
    a += f;
    cx += (p[0] + q[0]) * f;
    cy += (p[1] + q[1]) * f;
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
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  if (flat2) {
    const f = poly2;
    for (let i = 0; i < f.length; i += 2) {
      x0 = Math.min(x0, f[i]);
      x1 = Math.max(x1, f[i]);
      y0 = Math.min(y0, f[i + 1]);
      y1 = Math.max(y1, f[i + 1]);
    }
  } else {
    for (let i = 0; i < poly2.length; i++) {
      const p = poly2[i];
      x0 = Math.min(x0, p[0]);
      x1 = Math.max(x1, p[0]);
      y0 = Math.min(y0, p[1]);
      y1 = Math.max(y1, p[1]);
    }
  }
  return [x0, y0, x1, y1];
}
function pointInPoly(p, poly2) {
  let inside = false;
  for (let i = 0, j2 = poly2.length - 1; i < poly2.length; j2 = i++) {
    const a = poly2[i], b = poly2[j2];
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
  const out = [];
  for (const p of poly2) {
    const q = out[out.length - 1];
    if (!q || Math.abs(q[0] - p[0]) > eps || Math.abs(q[1] - p[1]) > eps) out.push(p);
  }
  while (out.length > 1 && Math.abs(out[0][0] - out[out.length - 1][0]) <= eps && Math.abs(out[0][1] - out[out.length - 1][1]) <= eps) out.pop();
  return out;
}
function clipPlane(poly2, nx, ny, c2) {
  const out = [];
  const n = poly2.length;
  for (let i = 0; i < n; i++) {
    const a = poly2[i], b = poly2[(i + 1) % n];
    const da2 = nx * a[0] + ny * a[1] - c2, db = nx * b[0] + ny * b[1] - c2;
    if (da2 >= 0) out.push(a);
    if (da2 >= 0 !== db >= 0) {
      const t = da2 / (da2 - db);
      out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
    }
  }
  return cleanPoly(out);
}
function insetConvex(poly2, d) {
  let out = poly2;
  const n = poly2.length;
  for (let i = 0; i < n; i++) {
    const dd = typeof d === "number" ? d : d[i];
    if (!dd) continue;
    const a = poly2[i], b = poly2[(i + 1) % n];
    const ex = b[0] - a[0], ey = b[1] - a[1];
    const L = Math.hypot(ex, ey);
    if (L < 1e-9) continue;
    const nx = -ey / L, ny = ex / L;
    out = clipPlane(out, nx, ny, nx * a[0] + ny * a[1] + dd);
    if (out.length < 3) return [];
  }
  return out.length >= 3 ? out : [];
}
function splitConvex(poly2, p, d, gap) {
  const nx = -d[1], ny = d[0];
  const c2 = nx * p[0] + ny * p[1];
  const A = clipPlane(poly2, nx, ny, c2 + gap / 2);
  const B2 = clipPlane(poly2, -nx, -ny, -c2 + gap / 2);
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
function homothety(poly2, c2, k) {
  return poly2.map((p) => [c2[0] + (p[0] - c2[0]) * k, c2[1] + (p[1] - c2[1]) * k]);
}
function rectPts(cx, cy, w, h, a) {
  const c2 = Math.cos(a), s = Math.sin(a);
  const hw = w / 2, hh = h / 2;
  const pts = [];
  for (const [u4, v2] of [
    [-hw, -hh],
    [hw, -hh],
    [hw, hh],
    [-hw, hh]
  ]) {
    pts.push(cx + u4 * c2 - v2 * s, cy + u4 * s + v2 * c2);
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
    const c2 = Math.cos(ang), s = Math.sin(ang);
    let u0 = Infinity, u1 = -Infinity, v0 = Infinity, v1 = -Infinity;
    for (const p of poly2) {
      const u4 = p[0] * c2 + p[1] * s, v2 = -p[0] * s + p[1] * c2;
      u0 = Math.min(u0, u4);
      u1 = Math.max(u1, u4);
      v0 = Math.min(v0, v2);
      v1 = Math.max(v1, v2);
    }
    const ar = (u1 - u0) * (v1 - v0);
    if (ar < bestA) {
      bestA = ar;
      const um = (u0 + u1) / 2, vm = (v0 + v1) / 2;
      best = { cx: um * c2 - vm * s, cy: um * s + vm * c2, w: u1 - u0, h: v1 - v0, a: ang };
    }
  }
  return best ?? { cx: 0, cy: 0, w: 0, h: 0, a: 0 };
}
function fitRect(poly2, fill = 0.94, wFrac = 1, hFrac = 1) {
  const o = obb(poly2);
  let cen = [o.cx, o.cy];
  if (!pointInConvex(cen, poly2)) cen = centroid(poly2);
  const c2 = Math.cos(o.a), s = Math.sin(o.a);
  const ok = (k2) => {
    for (const [su, sv] of [
      [-1, -1],
      [1, -1],
      [1, 1],
      [-1, 1]
    ]) {
      const du = su * o.w * wFrac * k2 / 2, dv = sv * o.h * hFrac * k2 / 2;
      const p = [cen[0] + du * c2 - dv * s, cen[1] + du * s + dv * c2];
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
function fitFrontageRect(plot, f0, f1, targetDepth, sideMargin = 0.45, setback = 0.35) {
  const fl = dist(f0, f1);
  if (fl < 4) return null;
  const ex = f1[0] - f0[0], ey = f1[1] - f0[1];
  const T = [ex / fl, ey / fl];
  const N = [-T[1], T[0]];
  const ang = Math.atan2(T[1], T[0]);
  const fMid = [(f0[0] + f1[0]) / 2, (f0[1] + f1[1]) / 2];
  const bw = Math.max(3.2, fl - 2 * sideMargin);
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
  const out = [];
  for (let i = 0; i < 8; i++) {
    const a = i / 8 * Math.PI * 2 + Math.PI / 8;
    out.push(x + Math.cos(a) * r2, y + Math.sin(a) * r2);
  }
  return out;
}
function satOverlap(A, B2, eps = 0.05) {
  for (const P of [A, B2]) {
    const n = P.length / 2;
    for (let i = 0; i < n; i++) {
      const j2 = (i + 1) % n;
      const ex = P[j2 * 2] - P[i * 2], ey = P[j2 * 2 + 1] - P[i * 2 + 1];
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
    const out = [cur[0]];
    for (let i = 0; i < cur.length - 1; i++) {
      const a = cur[i], b = cur[i + 1];
      out.push([a[0] + (b[0] - a[0]) * q, a[1] + (b[1] - a[1]) * q]);
      out.push([a[0] + (b[0] - a[0]) * (1 - q), a[1] + (b[1] - a[1]) * (1 - q)]);
    }
    out.push(cur[cur.length - 1]);
    cur = out;
  }
  return cur;
}
function isConvex(poly2) {
  const n = poly2.length;
  for (let i = 0; i < n; i++) {
    const a = poly2[i], b = poly2[(i + 1) % n], c2 = poly2[(i + 2) % n];
    if ((b[0] - a[0]) * (c2[1] - b[1]) - (b[1] - a[1]) * (c2[0] - b[0]) < -1e-6) return false;
  }
  return true;
}
var flat = (poly2) => {
  const o = [];
  for (const p of poly2) o.push(p[0], p[1]);
  return o;
};
var unflat = (f) => {
  const o = [];
  for (let i = 0; i < f.length; i += 2) o.push([f[i], f[i + 1]]);
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
  const c2 = Math.cos(ang), s = Math.sin(ang);
  const cen = centroid(poly2);
  let u0 = Infinity, u1 = -Infinity, v0 = Infinity, v1 = -Infinity;
  for (const p of poly2) {
    const dx = p[0] - cen[0], dy = p[1] - cen[1];
    const u4 = dx * c2 + dy * s, v2 = -dx * s + dy * c2;
    u0 = Math.min(u0, u4);
    u1 = Math.max(u1, u4);
    v0 = Math.min(v0, v2);
    v1 = Math.max(v1, v2);
  }
  const W = 2 * Math.min(-u0, u1), H = 2 * Math.min(-v0, v1);
  const ok = (k) => {
    for (const [su, sv] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
      const du = su * W * k / 2, dv = sv * H * k / 2;
      if (!pointInConvex([cen[0] + du * c2 - dv * s, cen[1] + du * s + dv * c2], poly2, 0.02)) return false;
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
  return { cx: cen[0], cy: cen[1], w: W * lo * fill, h: H * lo * fill, a: ang };
}

// src/engine/settlement.ts
var TIERS = [
  {
    tier: "hamlet",
    label: "Hamlet",
    max: 150,
    plotArea: 2e3,
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
    plotArea: 600,
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
    plotArea: 550,
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
    plotArea: 380,
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
    plotArea: 300,
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
var tierOf = (pop) => {
  for (const t of TIERS) if (pop < t.max) return t;
  return TIERS[TIERS.length - 1];
};
var BASE_RESIDENTIAL_MIN = 86;
var PLOT_FACTOR = 0.95;
var CALIBRATION = {};
function settlementFor(p) {
  const pop = Math.max(8, Math.round(p.population));
  const spec = tierOf(pop);
  const idn = identityOf(p.identity);
  const tierIndex = TIERS.indexOf(spec);
  const grain = lerp(0.72, 1.55, clamp(p.cityDensity, 0, 1));
  const cellArea2 = spec.cellArea * grain;
  const targetBuildings = Math.max(3, Math.round(pop / spec.peoplePerBuilding));
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
    population: pop,
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
function sum(elen, e, flen, f, h) {
  let Q, Qnew, hh, bvirt;
  let enow = e[0];
  let fnow = f[0];
  let eindex = 0;
  let findex = 0;
  if (fnow > enow === fnow > -enow) {
    Q = enow;
    enow = e[++eindex];
  } else {
    Q = fnow;
    fnow = f[++findex];
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
      fnow = f[++findex];
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
        fnow = f[++findex];
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
    fnow = f[++findex];
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
  let bvirt, c2, ahi, alo, bhi, blo, _i, _j, _0, s1, s02, t1, t0, u32;
  const acx = ax - cx;
  const bcx = bx - cx;
  const acy = ay - cy;
  const bcy = by - cy;
  s1 = acx * bcy;
  c2 = splitter * acx;
  ahi = c2 - (c2 - acx);
  alo = acx - ahi;
  c2 = splitter * bcy;
  bhi = c2 - (c2 - bcy);
  blo = bcy - bhi;
  s02 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
  t1 = acy * bcx;
  c2 = splitter * acy;
  ahi = c2 - (c2 - acy);
  alo = acy - ahi;
  c2 = splitter * bcx;
  bhi = c2 - (c2 - bcx);
  blo = bcx - bhi;
  t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
  _i = s02 - t0;
  bvirt = s02 - _i;
  B[0] = s02 - (_i + bvirt) + (bvirt - t0);
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
  c2 = splitter * acxtail;
  ahi = c2 - (c2 - acxtail);
  alo = acxtail - ahi;
  c2 = splitter * bcy;
  bhi = c2 - (c2 - bcy);
  blo = bcy - bhi;
  s02 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
  t1 = acytail * bcx;
  c2 = splitter * acytail;
  ahi = c2 - (c2 - acytail);
  alo = acytail - ahi;
  c2 = splitter * bcx;
  bhi = c2 - (c2 - bcx);
  blo = bcx - bhi;
  t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
  _i = s02 - t0;
  bvirt = s02 - _i;
  u[0] = s02 - (_i + bvirt) + (bvirt - t0);
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
  c2 = splitter * acx;
  ahi = c2 - (c2 - acx);
  alo = acx - ahi;
  c2 = splitter * bcytail;
  bhi = c2 - (c2 - bcytail);
  blo = bcytail - bhi;
  s02 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
  t1 = acy * bcxtail;
  c2 = splitter * acy;
  ahi = c2 - (c2 - acy);
  alo = acy - ahi;
  c2 = splitter * bcxtail;
  bhi = c2 - (c2 - bcxtail);
  blo = bcxtail - bhi;
  t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
  _i = s02 - t0;
  bvirt = s02 - _i;
  u[0] = s02 - (_i + bvirt) + (bvirt - t0);
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
  c2 = splitter * acxtail;
  ahi = c2 - (c2 - acxtail);
  alo = acxtail - ahi;
  c2 = splitter * bcytail;
  bhi = c2 - (c2 - bcytail);
  blo = bcytail - bhi;
  s02 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
  t1 = acytail * bcxtail;
  c2 = splitter * acytail;
  ahi = c2 - (c2 - acytail);
  alo = acytail - ahi;
  c2 = splitter * bcxtail;
  bhi = c2 - (c2 - bcxtail);
  blo = bcxtail - bhi;
  t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
  _i = s02 - t0;
  bvirt = s02 - _i;
  u[0] = s02 - (_i + bvirt) + (bvirt - t0);
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
      let j2 = 0;
      for (let i = 0, d0 = -Infinity; i < n; i++) {
        const id = this._ids[i];
        const d = this._dists[id];
        if (d > d0) {
          hull[j2++] = id;
          d0 = d;
        }
      }
      this.hull = hull.subarray(0, j2);
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
      for (let j2 = 0, key = this._hashKey(x, y); j2 < this._hashSize; j2++) {
        start = hullHash[(key + j2) % this._hashSize];
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
  _addTriangle(i0, i1, i2, a, b, c2) {
    const t = this.trianglesLen;
    this._triangles[t] = i0;
    this._triangles[t + 1] = i1;
    this._triangles[t + 2] = i2;
    this._link(t, a);
    this._link(t + 1, b);
    this._link(t + 2, c2);
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
function inCircle(ax, ay, bx, by, cx, cy, px, py) {
  const dx = ax - px;
  const dy = ay - py;
  const ex = bx - px;
  const ey = by - py;
  const fx = cx - px;
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
      let j2 = i - 1;
      while (j2 >= left && dists[ids[j2]] > tempDist) ids[j2 + 1] = ids[j2--];
      ids[j2 + 1] = temp;
    }
  } else {
    const median = left + right >> 1;
    let i = left + 1;
    let j2 = right;
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
        j2--;
      while (dists[ids[j2]] > tempDist);
      if (j2 < i) break;
      swap(ids, i, j2);
    }
    ids[left + 1] = ids[j2];
    ids[j2] = temp;
    if (right - i + 1 >= j2 - left) {
      quicksort(ids, dists, i, right);
      quicksort(ids, dists, left, j2 - 1);
    } else {
      quicksort(ids, dists, left, j2 - 1);
      quicksort(ids, dists, i, right);
    }
  }
}
function swap(arr, i, j2) {
  const tmp = arr[i];
  arr[i] = arr[j2];
  arr[j2] = tmp;
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
    const x0 = x + r2;
    const y0 = y;
    if (r2 < 0) throw new Error("negative radius");
    if (this._x1 === null) this._ += `M${x0},${y0}`;
    else if (Math.abs(this._x1 - x0) > epsilon2 || Math.abs(this._y1 - y0) > epsilon2) this._ += "L" + x0 + "," + y0;
    if (!r2) return;
    this._ += `A${r2},${r2},0,1,1,${x - r2},${y}A${r2},${r2},0,1,1,${this._x1 = x0},${this._y1 = y0}`;
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
    for (let i = 0, j2 = 0, n = triangles.length, x, y; i < n; i += 3, j2 += 2) {
      const t1 = triangles[i] * 2;
      const t2 = triangles[i + 1] * 2;
      const t3 = triangles[i + 2] * 2;
      const x12 = points[t1];
      const y12 = points[t1 + 1];
      const x2 = points[t2];
      const y2 = points[t2 + 1];
      const x3 = points[t3];
      const y3 = points[t3 + 1];
      const dx = x2 - x12;
      const dy = y2 - y12;
      const ex = x3 - x12;
      const ey = y3 - y12;
      const ab4 = (dx * ey - dy * ex) * 2;
      if (Math.abs(ab4) < 1e-9) {
        if (bx === void 0) {
          bx = by = 0;
          for (const i2 of hull) bx += points[i2 * 2], by += points[i2 * 2 + 1];
          bx /= hull.length, by /= hull.length;
        }
        const a = 1e9 * Math.sign((bx - x12) * ey - (by - y12) * ex);
        x = (x12 + x3) / 2 - a * ey;
        y = (y12 + y3) / 2 + a * ex;
      } else {
        const d = 1 / ab4;
        const bl = dx * dx + dy * dy;
        const cl = ex * ex + ey * ey;
        x = x12 + (ey * bl - dy * cl) * d;
        y = y12 + (dx * cl - ex * bl) * d;
      }
      circumcenters[j2] = x;
      circumcenters[j2 + 1] = y;
    }
    let h = hull[hull.length - 1];
    let p0, p1 = h * 4;
    let x0, x1 = points[2 * h];
    let y0, y1 = points[2 * h + 1];
    vectors.fill(0);
    for (let i = 0; i < hull.length; ++i) {
      h = hull[i];
      p0 = p1, x0 = x1, y0 = y1;
      p1 = h * 4, x1 = points[2 * h], y1 = points[2 * h + 1];
      vectors[p0 + 2] = vectors[p1] = y0 - y1;
      vectors[p0 + 3] = vectors[p1 + 1] = x1 - x0;
    }
  }
  render(context) {
    const buffer = context == null ? context = new Path() : void 0;
    const { delaunay: { halfedges, inedges, hull }, circumcenters, vectors } = this;
    if (hull.length <= 1) return null;
    for (let i = 0, n = halfedges.length; i < n; ++i) {
      const j2 = halfedges[i];
      if (j2 < i) continue;
      const ti = Math.floor(i / 3) * 2;
      const tj = Math.floor(j2 / 3) * 2;
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
  _renderSegment(x0, y0, x1, y1, context) {
    let S;
    const c0 = this._regioncode(x0, y0);
    const c1 = this._regioncode(x1, y1);
    if (c0 === 0 && c1 === 0) {
      context.moveTo(x0, y0);
      context.lineTo(x1, y1);
    } else if (S = this._clipSegment(x0, y0, x1, y1, c0, c1)) {
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
    if (ci) for (const j2 of this.delaunay.neighbors(i)) {
      const cj = this._clip(j2);
      if (cj) loop: for (let ai = 0, li = ci.length; ai < li; ai += 2) {
        for (let aj = 0, lj = cj.length; aj < lj; aj += 2) {
          if (ci[ai] === cj[aj] && ci[ai + 1] === cj[aj + 1] && ci[(ai + 2) % li] === cj[(aj + lj - 2) % lj] && ci[(ai + 3) % li] === cj[(aj + lj - 1) % lj]) {
            yield j2;
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
    let x0, y0, x1 = points[n - 2], y1 = points[n - 1];
    let c0, c1 = this._regioncode(x1, y1);
    let e0, e1 = 0;
    for (let j2 = 0; j2 < n; j2 += 2) {
      x0 = x1, y0 = y1, x1 = points[j2], y1 = points[j2 + 1];
      c0 = c1, c1 = this._regioncode(x1, y1);
      if (c0 === 0 && c1 === 0) {
        e0 = e1, e1 = 0;
        if (P) P.push(x1, y1);
        else P = [x1, y1];
      } else {
        let S, sx0, sy0, sx1, sy1;
        if (c0 === 0) {
          if ((S = this._clipSegment(x0, y0, x1, y1, c0, c1)) === null) continue;
          [sx0, sy0, sx1, sy1] = S;
        } else {
          if ((S = this._clipSegment(x1, y1, x0, y0, c1, c0)) === null) continue;
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
  _clipSegment(x0, y0, x1, y1, c0, c1) {
    const flip = c0 < c1;
    if (flip) [x0, y0, x1, y1, c0, c1] = [x1, y1, x0, y0, c1, c0];
    while (true) {
      if (c0 === 0 && c1 === 0) return flip ? [x1, y1, x0, y0] : [x0, y0, x1, y1];
      if (c0 & c1) return null;
      let x, y, c2 = c0 || c1;
      if (c2 & 8) x = x0 + (x1 - x0) * (this.ymax - y0) / (y1 - y0), y = this.ymax;
      else if (c2 & 4) x = x0 + (x1 - x0) * (this.ymin - y0) / (y1 - y0), y = this.ymin;
      else if (c2 & 2) y = y0 + (y1 - y0) * (this.xmax - x0) / (x1 - x0), x = this.xmax;
      else y = y0 + (y1 - y0) * (this.xmin - x0) / (x1 - x0), x = this.xmin;
      if (c0) x0 = x, y0 = y, c0 = this._regioncode(x0, y0);
      else x1 = x, y1 = y, c1 = this._regioncode(x1, y1);
    }
  }
  _clipInfinite(i, points, vx0, vy0, vxn, vyn) {
    let P = Array.from(points), p;
    if (p = this._project(P[0], P[1], vx0, vy0)) P.unshift(p[0], p[1]);
    if (p = this._project(P[P.length - 2], P[P.length - 1], vxn, vyn)) P.push(p[0], p[1]);
    if (P = this._clipFinite(i, P)) {
      for (let j2 = 0, n = P.length, c0, c1 = this._edgecode(P[n - 2], P[n - 1]); j2 < n; j2 += 2) {
        c0 = c1, c1 = this._edgecode(P[j2], P[j2 + 1]);
        if (c0 && c1) j2 = this._edge(i, c0, c1, P, j2), n = P.length;
      }
    } else if (this.contains(i, (this.xmin + this.xmax) / 2, (this.ymin + this.ymax) / 2)) {
      P = [this.xmin, this.ymin, this.xmax, this.ymin, this.xmax, this.ymax, this.xmin, this.ymax];
    }
    return P;
  }
  _edge(i, e0, e1, P, j2) {
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
      if ((P[j2] !== x || P[j2 + 1] !== y) && this.contains(i, x, y)) {
        P.splice(j2, 0, x, y), j2 += 2;
      }
    }
    return j2;
  }
  _project(x0, y0, vx, vy) {
    let t = Infinity, c2, x, y;
    if (vy < 0) {
      if (y0 <= this.ymin) return null;
      if ((c2 = (this.ymin - y0) / vy) < t) y = this.ymin, x = x0 + (t = c2) * vx;
    } else if (vy > 0) {
      if (y0 >= this.ymax) return null;
      if ((c2 = (this.ymax - y0) / vy) < t) y = this.ymax, x = x0 + (t = c2) * vx;
    }
    if (vx > 0) {
      if (x0 >= this.xmax) return null;
      if ((c2 = (this.xmax - x0) / vx) < t) x = this.xmax, y = y0 + (t = c2) * vy;
    } else if (vx < 0) {
      if (x0 <= this.xmin) return null;
      if ((c2 = (this.xmin - x0) / vx) < t) x = this.xmin, y = y0 + (t = c2) * vy;
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
        const j2 = (i + 2) % P.length, k = (i + 4) % P.length;
        if (P[i] === P[j2] && P[j2] === P[k] || P[i + 1] === P[j2 + 1] && P[j2 + 1] === P[k + 1]) {
          P.splice(j2, 2), i -= 2;
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
    const a = 2 * triangles[i], b = 2 * triangles[i + 1], c2 = 2 * triangles[i + 2], cross = (coords[c2] - coords[a]) * (coords[b + 1] - coords[a + 1]) - (coords[b] - coords[a]) * (coords[c2 + 1] - coords[a + 1]);
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
      this.collinear = Int32Array.from({ length: points.length / 2 }, (_, i) => i).sort((i, j2) => points[2 * i] - points[2 * j2] || points[2 * i + 1] - points[2 * j2 + 1]);
      const e = this.collinear[0], f = this.collinear[this.collinear.length - 1], bounds = [points[2 * e], points[2 * e + 1], points[2 * f], points[2 * f + 1]], r2 = 1e-8 * Math.hypot(bounds[3] - bounds[1], bounds[2] - bounds[0]);
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
    let c2;
    while ((c2 = this._step(i, x, y)) >= 0 && c2 !== i && c2 !== i0) i = c2;
    return c2;
  }
  _step(i, x, y) {
    const { inedges, hull, _hullIndex, halfedges, triangles, points } = this;
    if (inedges[i] === -1 || !points.length) return (i + 1) % (points.length >> 1);
    let c2 = i;
    let dc = pow(x - points[i * 2], 2) + pow(y - points[i * 2 + 1], 2);
    const e0 = inedges[i];
    let e = e0;
    do {
      let t = triangles[e];
      const dt = pow(x - points[t * 2], 2) + pow(y - points[t * 2 + 1], 2);
      if (dt < dc) dc = dt, c2 = t;
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
    return c2;
  }
  render(context) {
    const buffer = context == null ? context = new Path() : void 0;
    const { points, halfedges, triangles } = this;
    for (let i = 0, n = halfedges.length; i < n; ++i) {
      const j2 = halfedges[i];
      if (j2 < i) continue;
      const ti = triangles[i] * 2;
      const tj = triangles[j2] * 2;
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
    for (const [v2, c2] of adj[u4]) {
      const nd = d + c2;
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
  const out = [from];
  let u4 = from;
  let guard = 0;
  while (prev[u4] >= 0 && guard++ < 1e5) {
    u4 = prev[u4];
    out.push(u4);
  }
  return out;
}

// src/engine/types.ts
var edgeKey = (a, b) => a < b ? a + "_" + b : b + "_" + a;

// src/engine/plan.ts
function makeElev(t) {
  const n1 = new Noise(t.seed), n2 = new Noise(t.seed + 77);
  const c2 = Math.cos(t.ang), s = Math.sin(t.ang);
  return (x, y) => {
    let e = t.amt * (0.55 * n1.fbm(x / 520 + 3, y / 520 + 9, 4) + 0.14 * n2.fbm(x / 140, y / 140, 2));
    if (t.geo === "hills") e += 0.8 * Math.exp(-(((x + 30) ** 2 + (y - 20) ** 2) / (2 * 300 * 300)));
    if (t.geo === "mountain") {
      const v2 = Math.abs(-x * s + y * c2);
      e += 1 * smooth(110, 720, v2) + 0.12 * n2.fbm(x / 90, y / 90, 3);
    }
    return e;
  };
}
function createCtx(params, seed) {
  const rng = new RNG(seed);
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
  const city = {
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
    seedUsed: seed
  };
  return {
    ctx: { city, rng, N, R: R2, ei: /* @__PURE__ */ new Map(), sea, elev: makeElev(terrain), noise, riverVids: /* @__PURE__ */ new Set(), seaAng, seaOff, harbourEdges: /* @__PURE__ */ new Set() },
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
  const { city, rng, N, R: R2 } = ctx;
  const B2 = city.bounds;
  const sites = [];
  const c2 = R2 / Math.sqrt(N * 0.9);
  const nIn = Math.max(14, Math.round(N * 2.2));
  const sa = rng.range(0, Math.PI * 2);
  let rMax = 0;
  for (let i = 0; i < nIn; i++) {
    const a = sa + i * 2.39996 + rng.range(-0.05, 0.05);
    const r2 = c2 * Math.sqrt(i + 0.5) * (0.78 + 0.3 * Math.min(1, i / N)) * rng.range(0.96, 1.04);
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
  city.verts = verts;
  city.cells = cells;
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
var poly = (city, cell) => cell.vids.map((v2) => city.verts[v2]);
function makeRiver(ctx) {
  const { city, rng, R: R2 } = ctx;
  const res = city.resolved;
  if (!city.settlement.river) return true;
  const B2 = city.bounds;
  const nV = city.verts.length;
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
  const px = -dy, py = dx;
  const FAR = R2 * 2.9;
  const start = [-dx * FAR + px * off, -dy * FAR + py * off];
  const end = coast ? [dx * (ctx.seaOff + 11e-4 * off * off) + px * off, dy * (ctx.seaOff + 11e-4 * off * off) + py * off] : [dx * FAR + px * rng.range(-0.25, 0.25) * R2, dy * FAR + py * rng.range(-0.25, 0.25) * R2];
  const A = rng.range(R2 * 0.12, R2 * 0.27), f = rng.range(0.9, 1.7), ph = rng.range(0, 6.28);
  const guide = [];
  const GN = 140;
  for (let i = 0; i <= GN; i++) {
    const t = i / GN;
    const w = A * Math.sin(Math.PI * 2 * f * t + ph) * (coast ? 1 - t * 0.5 : 1);
    guide.push([lerp(start[0], end[0], t) + px * w, lerp(start[1], end[1], t) + py * w]);
  }
  const gd = (p) => {
    let best = Infinity;
    for (const g of guide) best = Math.min(best, Math.hypot(p[0] - g[0], p[1] - g[1]));
    return best;
  };
  const adj = Array.from({ length: nV }, () => []);
  for (const e of ctx.ei.values()) {
    if (e.cells.some((c2) => city.cells[c2].kind === "sea")) continue;
    const a = city.verts[e.a], b = city.verts[e.b];
    let cost = dist(a, b) * (1 + (gd(mid(a, b)) / (R2 * 0.12)) ** 2);
    if (e.cells.length < 2) cost *= 8;
    adj[e.a].push([e.b, cost]);
    adj[e.b].push([e.a, cost]);
  }
  const border = (p) => p[0] <= B2[0] + 1 || p[0] >= B2[2] - 1 || p[1] <= B2[1] + 1 || p[1] >= B2[3] - 1;
  const seaVert = /* @__PURE__ */ new Set(), landVert = /* @__PURE__ */ new Set();
  for (const c2 of city.cells) for (const v2 of c2.vids) (c2.kind === "sea" ? seaVert : landVert).add(v2);
  let sv = -1, ev = -1, sd = Infinity, ed = Infinity;
  for (let v2 = 0; v2 < nV; v2++) {
    const p = city.verts[v2];
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
  const base = city.settlement.riverWidth;
  const n = vids.length;
  const ws = vids.map((_, k) => base * (coast ? 0.7 + 0.9 * (k / (n - 1)) ** 2 : 0.8 + 0.4 * (k / (n - 1))));
  const raw = vids.map((v2) => city.verts[v2]);
  const sm = chaikin(raw, 2, 0.22);
  const sw = chaikin(ws.map((w) => [w, 0]), 2, 0.22).map((p) => p[0]);
  const ew = {};
  for (let k = 0; k < n - 1; k++) ew[edgeKey(vids[k], vids[k + 1])] = (ws[k] + ws[k + 1]) / 2;
  city.river = { vids, pts: sm, w: sw, ew };
  ctx.riverVids = new Set(vids);
  return true;
}
function selectCity(ctx) {
  const { city, rng, N } = ctx;
  const cells = city.cells;
  const nz = new Noise(rng.int(1, 1e6));
  const land = cells.filter((c2) => c2.kind !== "sea" && c2.vids.length >= 3);
  const key = (c2) => {
    const a = Math.atan2(c2.center[1], c2.center[0]);
    const w = 0.84 + 0.32 * nz.fbm(Math.cos(a) * 1.3 + 5, Math.sin(a) * 1.3 + 5, 2);
    return Math.hypot(c2.center[0], c2.center[1]) / w;
  };
  land.sort((a, b) => key(a) - key(b));
  for (const c2 of land.slice(0, N)) c2.kind = "city";
  const isCity = (id) => id >= 0 && cells[id].kind === "city";
  const root = land[0];
  const seen = /* @__PURE__ */ new Set([root.id]);
  const q = [root.id];
  while (q.length) {
    const u4 = q.pop();
    for (const n of cells[u4].nbrs) if (isCity(n) && !seen.has(n)) seen.add(n), q.push(n);
  }
  for (const c2 of cells) if (c2.kind === "city" && !seen.has(c2.id)) c2.kind = "outside";
  const addable = (c2) => c2.kind === "outside" && c2.vids.length >= 3;
  for (let pass = 0; pass < 3; pass++) {
    for (const c2 of cells) {
      if (!addable(c2)) continue;
      const ns = c2.nbrs.filter((n) => n >= 0);
      const cn = ns.filter((n) => isCity(n)).length;
      if (ns.length && cn / ns.length >= 0.6 && cn >= 2) c2.kind = "city";
    }
  }
  {
    const comp = /* @__PURE__ */ new Map();
    const sizes = [];
    for (const c2 of cells) {
      if (c2.kind !== "city" || comp.has(c2.id)) continue;
      const id = sizes.length;
      let n = 0;
      const st = [c2.id];
      comp.set(c2.id, id);
      while (st.length) {
        const u4 = st.pop();
        n++;
        const cu = cells[u4];
        for (let i = 0; i < cu.nbrs.length; i++) {
          const nb = cu.nbrs[i];
          if (nb < 0 || cells[nb].kind !== "city" || comp.has(nb)) continue;
          if (city.river && edgeKey(cu.vids[i], cu.vids[(i + 1) % cu.vids.length]) in city.river.ew) continue;
          comp.set(nb, id);
          st.push(nb);
        }
      }
      sizes.push(n);
    }
    let biggest = 0;
    for (const sz of sizes) biggest = Math.max(biggest, sz);
    const minKeep = Math.max(2, Math.round(city.settlement.blocks * 0.08));
    for (const c2 of cells)
      if (c2.kind === "city") {
        const sz = sizes[comp.get(c2.id)];
        if (sz < minKeep && sz < biggest) c2.kind = "outside";
      }
  }
  const depth = /* @__PURE__ */ new Map();
  let frontier = [];
  for (const c2 of cells)
    if (c2.kind === "city" && c2.nbrs.some((n) => !isCity(n))) {
      depth.set(c2.id, 0);
      frontier.push(c2.id);
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
  for (const c2 of cells) if (c2.kind === "city") c2.depth = depth.get(c2.id) ?? 0;
}
function classifyEdges(ctx) {
  const { city } = ctx;
  const walls = city.settlement.wall !== "none";
  const edges = {};
  for (const [k, e] of ctx.ei) {
    const ks = e.cells.map((c2) => city.cells[c2].kind);
    const nCity = ks.filter((x) => x === "city").length;
    const isRiver = !!city.river && k in city.river.ew;
    if (nCity === 0) {
      if (isRiver) edges[k] = "river";
      continue;
    }
    if (nCity === 2) edges[k] = isRiver ? "river" : "minor";
    else if (ks.includes("sea")) edges[k] = "coast";
    else if (isRiver) edges[k] = "river";
    else edges[k] = walls ? "wallO" : "open";
  }
  city.edges = edges;
}
function outlineLoops(city, inSet) {
  const next = /* @__PURE__ */ new Map();
  for (const c2 of city.cells) {
    if (!inSet(c2.id)) continue;
    const n = c2.vids.length;
    for (let i = 0; i < n; i++) {
      if (!inSet(c2.nbrs[i])) {
        const a = c2.vids[i], b = c2.vids[(i + 1) % n];
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
  return loops.filter((l) => area(cleanPoly(l.map((v2) => city.verts[v2]))) > 0);
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
  const { city, rng } = ctx;
  if (!city.settlement.market) return;
  const cc2 = city.cells.filter((c2) => c2.kind === "city");
  let tx = 0, ty = 0;
  for (const c2 of cc2) tx += c2.center[0], ty += c2.center[1];
  tx /= cc2.length;
  ty /= cc2.length;
  let best = null, bs = Infinity;
  for (const c2 of cc2) {
    const pts = c2.vids.map((v2) => city.verts[v2]);
    const a = area(pts);
    let s = Math.hypot(c2.center[0] - tx, c2.center[1] - ty);
    if (a < 2600) s += 300;
    if (c2.vids.length < 5) s += 80;
    if (c2.nbrs.some((n) => n >= 0 && city.cells[n].kind === "sea")) s += 200;
    if (s < bs) bs = s, best = c2;
  }
  best.layout = "market";
  best.ward = "market";
  city.marketCell = best.id;
  if (city.settlement.marketCells > 1) {
    const cc3 = city.cells.filter((c2) => c2.kind === "city" && c2.layout === "blocks");
    let second = null, ss = -Infinity;
    for (const c2 of cc3) {
      const d = dist(c2.center, best.center);
      const s = d + rng.range(0, 200) - (d < 160 ? 400 : 0);
      if (s > ss) ss = s, second = c2;
    }
    if (second) {
      second.layout = "market";
      second.ward = "market";
      second.variant = 1;
      city.secondMarketCell = second.id;
    }
  }
}
function buildInnerWall(ctx) {
  const { city } = ctx;
  if (city.settlement.wall !== "double") return;
  const cells = city.cells;
  const market = cells[city.marketCell];
  const nCity = cells.filter((c2) => c2.kind === "city").length;
  const target = Math.max(7, Math.round(nCity * 0.34));
  const inner = /* @__PURE__ */ new Set([market.id]);
  while (inner.size < target) {
    let best = -1, bd2 = Infinity;
    for (const id of inner)
      for (const n of cells[id].nbrs) {
        if (n < 0 || inner.has(n) || cells[n].kind !== "city") continue;
        const c2 = cells[n];
        const d = dist(c2.center, market.center) + (c2.depth === 0 ? 500 : 0);
        if (d < bd2) bd2 = d, best = n;
      }
    if (best < 0) break;
    inner.add(best);
  }
  for (let pass = 0; pass < 3; pass++) {
    for (const c2 of cells) {
      if (c2.kind !== "city" || inner.has(c2.id)) continue;
      const ns = c2.nbrs.filter((n) => n >= 0);
      const k = ns.filter((n) => inner.has(n)).length;
      if (k >= 2 && k / ns.length >= 0.6) inner.add(c2.id);
    }
  }
  for (const id of inner) cells[id].inner = true;
  for (const [k, e] of ctx.ei) {
    if (e.cells.length !== 2 || city.edges[k] !== "minor") continue;
    const [a, b] = e.cells;
    if (cells[a].inner !== cells[b].inner) city.edges[k] = "wallI";
  }
}
var angDiff = (a, b) => Math.abs((a - b + 3 * Math.PI) % (2 * Math.PI) - Math.PI);
function makeOuterRoad(city, ei, rng, g, dir) {
  const P = city.verts[g];
  const cityV = /* @__PURE__ */ new Set();
  for (const c2 of city.cells) if (c2.kind === "city") for (const v2 of c2.vids) cityV.add(v2);
  const X = city.cells.find((c2) => c2.kind === "outside" && c2.vids.includes(g));
  if (!X) return null;
  let w = -1, bs = -Infinity;
  for (const v2 of X.vids) {
    if (cityV.has(v2)) continue;
    const q = city.verts[v2];
    const dd2 = (q[0] - P[0]) * dir[0] + (q[1] - P[1]) * dir[1];
    if (dd2 > bs) bs = dd2, w = v2;
  }
  if (w < 0 || bs < 12) return null;
  const nV = city.verts.length;
  const adj = Array.from({ length: nV }, () => []);
  for (const [k, e] of ei) {
    if (e.cells.some((c3) => city.cells[c3].kind !== "outside")) continue;
    if (city.river && k in city.river.ew) continue;
    const c2 = dist(city.verts[e.a], city.verts[e.b]) * rng.range(0.85, 1.25);
    adj[e.a].push([e.b, c2]);
    adj[e.b].push([e.a, c2]);
  }
  const { dist: dd, prev } = dijkstra(nV, adj, [w]);
  const B2 = city.bounds;
  const far = [P[0] + dir[0] * 3e3, P[1] + dir[1] * 3e3];
  let tv = -1, ts = Infinity;
  for (let v2 = 0; v2 < nV; v2++) {
    if (!isFinite(dd[v2])) continue;
    const p = city.verts[v2];
    if (!(p[0] <= B2[0] + 1 || p[0] >= B2[2] - 1 || p[1] <= B2[1] + 1 || p[1] >= B2[3] - 1)) continue;
    const s = dist(p, far) + 0.25 * dd[v2];
    if (s < ts) ts = s, tv = v2;
  }
  if (tv < 0) return null;
  const path = tracePath(prev, tv).reverse();
  const pts = [P, ...path.map((v2) => city.verts[v2])];
  return { pts: chaikin(pts, 2, 0.25), w: 5.5, gate: g };
}
function planGates(ctx) {
  const { city, rng } = ctx;
  if (city.settlement.wall === "none") return;
  const loops = outlineLoops(city, (id) => id >= 0 && city.cells[id].kind === "city");
  if (!loops.length) return;
  loops.sort((a, b) => area(b.map((v2) => city.verts[v2])) - area(a.map((v2) => city.verts[v2])));
  const loop = loops[0];
  const vE = vertexEdges(ctx.ei);
  const cc2 = city.cells.filter((c2) => c2.kind === "city");
  const cen = [cc2.reduce((s, c2) => s + c2.center[0], 0) / cc2.length, cc2.reduce((s, c2) => s + c2.center[1], 0) / cc2.length];
  const n = loop.length;
  const pool = [];
  for (let i = 0; i < n; i++) {
    const v2 = loop[i], pv = loop[(i - 1 + n) % n], nv = loop[(i + 1) % n];
    const c1 = city.edges[edgeKey(pv, v2)], c2 = city.edges[edgeKey(v2, nv)];
    if (!(c1 === "wallO" || c1 === "open") || !(c2 === "wallO" || c2 === "open")) continue;
    if (ctx.riverVids.has(v2)) continue;
    if (!(vE.get(v2) ?? []).some((k) => city.edges[k] === "minor")) continue;
    const tan = unit(sub(city.verts[nv], city.verts[pv]));
    pool.push({ v: v2, tan, dir: [tan[1], -tan[0]], ang: Math.atan2(city.verts[v2][1] - cen[1], city.verts[v2][0] - cen[0]) });
  }
  const chosen = [];
  const want = Math.min(city.settlement.gates, pool.length);
  while (chosen.length < want && pool.length) {
    let best = -1, bs = -1;
    for (let i = 0; i < pool.length; i++) {
      const sep = chosen.length ? Math.min(...chosen.map((c3) => angDiff(c3.ang, pool[i].ang))) : Math.PI;
      const s = sep + rng.range(0, 0.4);
      if (s > bs) bs = s, best = i;
    }
    const c2 = pool.splice(best, 1)[0];
    if (chosen.length && Math.min(...chosen.map((x) => angDiff(x.ang, c2.ang))) < 0.5) continue;
    const road = makeOuterRoad(city, ctx.ei, rng, c2.v, c2.dir);
    if (!road) continue;
    chosen.push(c2);
    city.roads.push(road);
    city.gates.push({ vid: c2.v, p: city.verts[c2.v], kind: "main", wall: "outer", tan: c2.tan, dir: c2.dir });
  }
  const nPost = city.settlement.gates >= 4 ? 2 : 1;
  let made = 0;
  const cand = pool.filter((c2) => chosen.every((x) => angDiff(x.ang, c2.ang) > 0.75)).sort(() => rng.next() - 0.5);
  for (const c2 of cand) {
    if (made >= nPost) break;
    if (city.gates.some((g) => g.kind === "postern" && angDiff(Math.atan2(g.p[1] - cen[1], g.p[0] - cen[0]), c2.ang) < 0.9)) continue;
    const road = makeOuterRoad(city, ctx.ei, rng, c2.v, c2.dir);
    if (!road) continue;
    road.w = 2.6;
    city.roads.push(road);
    city.gates.push({ vid: c2.v, p: city.verts[c2.v], kind: "postern", wall: "outer", tan: c2.tan, dir: c2.dir });
    made++;
  }
}
function inwardNormal(city, cell, a, b) {
  const n = cell.vids.length;
  for (let i = 0; i < n; i++) {
    const u4 = cell.vids[i], w = cell.vids[(i + 1) % n];
    if (u4 === a && w === b || u4 === b && w === a) {
      const P = city.verts[u4], Q = city.verts[w];
      return unit([-(Q[1] - P[1]), Q[0] - P[0]]);
    }
  }
  return null;
}
function planBridges(ctx) {
  const { city, rng } = ctx;
  if (!city.river || !city.settlement.river) return [];
  const cells = city.cells;
  const market = cells[city.marketCell];
  const street = (c2) => c2 === "minor" || c2 === "secondary" || c2 === "arterial";
  const comp = /* @__PURE__ */ new Map();
  let nc = 0;
  for (const c2 of cells) {
    if (c2.kind !== "city" || comp.has(c2.id)) continue;
    const st = [c2.id];
    comp.set(c2.id, nc);
    while (st.length) {
      const u4 = st.pop();
      const cu = cells[u4];
      for (let i = 0; i < cu.nbrs.length; i++) {
        const n = cu.nbrs[i];
        if (n < 0 || cells[n].kind !== "city" || comp.has(n)) continue;
        if (city.edges[edgeKey(cu.vids[i], cu.vids[(i + 1) % cu.vids.length])] === "river") continue;
        comp.set(n, nc);
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
    for (const [k, rw] of Object.entries(city.river.ew)) {
      const e = ctx.ei.get(k);
      if (!e || e.cells.length < 2) continue;
      const ca3 = cells[e.cells[0]], cb = cells[e.cells[1]];
      if (ca3.kind !== "city" || cb.kind !== "city") continue;
      const A = city.verts[e.a], B2 = city.verts[e.b];
      const L = dist(A, B2);
      inLen += L;
      if (L < minL || ca3.layout !== "blocks" || cb.layout !== "blocks") continue;
      const m2 = mid(A, B2);
      const dA = inwardNormal(city, ca3, e.a, e.b);
      if (!dA) continue;
      const dB = [-dA[0], -dA[1]];
      const hits = [];
      let ok = true;
      for (const [cell, d] of [[ca3, dA], [cb, dB]]) {
        const pl = cell.vids.map((v2) => city.verts[v2]);
        const h = rayHit(pl, m2, d);
        if (!h || h.t < minT || h.s < sLo || h.s > 1 - sLo) {
          ok = false;
          break;
        }
        const u4 = cell.vids[h.i], w = cell.vids[(h.i + 1) % cell.vids.length];
        if (!street(city.edges[edgeKey(u4, w)]) || dist(city.verts[u4], city.verts[w]) < minHitL) {
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
  const take = (c2) => {
    chosen.push(c2);
    c2.b.cells.forEach((x) => used.add(x));
  };
  const spanning = (cands) => {
    for (const c2 of cands) {
      if (c2.b.cells.some((x) => used.has(x))) continue;
      const a = find(comp.get(c2.b.cells[0])), b = find(comp.get(c2.b.cells[1]));
      if (a === b) continue;
      parent[a] = b;
      take(c2);
    }
  };
  const strict = gather(22, 22, 0.22, 14);
  const nb = clamp(Math.round(inLen / 230), 1, 4);
  spanning(strict);
  const roots = () => new Set([...comp.values()].map(find)).size;
  if (roots() > 1) spanning(gather(12, 11, 0.14, 9));
  const extra = strict.map((c2) => ({ c: c2, k: rng.range(0, 90) })).sort((a, b) => a.k - b.k).map((x) => x.c);
  for (const c2 of extra) {
    if (chosen.length >= nb) break;
    if (chosen.includes(c2) || c2.b.cells.some((x) => used.has(x))) continue;
    if (chosen.some((o) => dist(o.b.m, c2.b.m) < 120)) continue;
    take(c2);
  }
  chosen.forEach((c2, i) => c2.b.id = i + 1);
  for (const pl of chosen) {
    city.bridges.push(pl.b);
    const [a, b] = pl.b.cells;
    cells[a].cuts.push({ p: pl.b.m, d: pl.b.dir, w: 5, a: pl.b.m, b: pl.hits[0].p, kind: "bridge" });
    cells[b].cuts.push({ p: pl.b.m, d: [-pl.b.dir[0], -pl.b.dir[1]], w: 5, a: pl.b.m, b: pl.hits[1].p, kind: "bridge" });
    cells[a].locked = cells[b].locked = true;
  }
  return chosen;
}
var STREET_WORDS = ["Street", "Road", "Way", "Row", "Lane"];
function routeStreets(ctx, plans, hubs) {
  const { city, rng } = ctx;
  const V = city.verts.length;
  const market = city.marketCell >= 0 ? city.cells[city.marketCell] : city.cells.filter((c2) => c2.kind === "city").sort((a, b) => b.vids.length - a.vids.length)[0];
  const host = /* @__PURE__ */ new Map();
  const mkAdj = (costFn, withBridges) => {
    const adj2 = Array.from({ length: V + plans.length * 2 }, () => []);
    for (const [k, e] of ctx.ei) {
      const cls = city.edges[k];
      const ring2 = withBridges && cls === "wallO" && !ctx.riverVids.has(e.a) && !ctx.riverVids.has(e.b);
      if (cls !== "minor" && !(withBridges && cls === "wallI") && !ring2) continue;
      const c2 = costFn(e.a, e.b, k, cls);
      adj2[e.a].push([e.b, c2]);
      adj2[e.b].push([e.a, c2]);
    }
    return adj2;
  };
  const base = mkAdj((a, b, _k, c2) => dist(city.verts[a], city.verts[b]) * (c2 === "wallI" ? 0 : 1), true);
  const rf = /* @__PURE__ */ new Map();
  for (const k of ctx.ei.keys()) rf.set(k, rng.range(0.8, 1.3));
  const adj = mkAdj((a, b, k, c2) => {
    const l = dist(city.verts[a], city.verts[b]);
    return c2 === "wallI" ? l * 2.4 + 16 : c2 === "wallO" ? l * 3.2 + 26 : l * rf.get(k);
  }, true);
  void base;
  const nodePts = [...city.verts];
  plans.forEach((pl, i) => {
    for (let s = 0; s < 2; s++) {
      const node = V + i * 2 + s;
      const h = pl.hits[s];
      nodePts[node] = h.p;
      host.set(node, h.e);
      for (const v2 of h.e) {
        const c3 = dist(h.p, city.verts[v2]);
        adj[node].push([v2, c3]);
        adj[v2].push([node, c3]);
      }
    }
    const c2 = (dist(pl.hits[0].p, pl.b.m) + dist(pl.b.m, pl.hits[1].p)) * 0.55;
    adj[V + i * 2].push([V + i * 2 + 1, c2]);
    adj[V + i * 2 + 1].push([V + i * 2, c2]);
  });
  const { dist: dd, prev } = dijkstra(adj.length, adj, market.vids);
  const innerKeys = /* @__PURE__ */ new Set();
  const addInnerGate = (k) => {
    if (innerKeys.has(k)) return;
    innerKeys.add(k);
    const e = ctx.ei.get(k);
    const A = city.verts[e.a], B2 = city.verts[e.b];
    const tan = unit(sub(B2, A));
    const p = mid(A, B2);
    const ic = city.cells[e.cells.find((c2) => city.cells[c2].inner) ?? e.cells[0]];
    let nrm = [-tan[1], tan[0]];
    if ((ic.center[0] - p[0]) * nrm[0] + (ic.center[1] - p[1]) * nrm[1] > 0) nrm = [-nrm[0], -nrm[1]];
    city.gates.push({ vid: -1, p, kind: "inner", wall: "inner", tan, dir: nrm, edge: k });
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
      const c2 = city.edges[k];
      if (c2 === "wallI") addInnerGate(k);
      else if (c2 && RANK[c2] !== void 0 && RANK[c2] < RANK[cls]) city.edges[k] = cls;
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
  const gates = city.gates.filter((g) => g.wall === "outer");
  gates.forEach((g) => {
    if (isFinite(dd[g.vid])) addStreet(tracePath(prev, g.vid), "arterial");
  });
  for (const h of hubs) {
    const c2 = city.cells[h];
    let bv = -1, bd2 = Infinity;
    for (const v2 of c2.vids) if (dd[v2] < bd2 && dd[v2] > 0) bd2 = dd[v2], bv = v2;
    if (bv >= 0) addStreet(tracePath(prev, bv), "secondary");
  }
  const R2 = ctx.R;
  const interior = [];
  const vE = vertexEdges(ctx.ei);
  for (let v2 = 0; v2 < V; v2++) {
    const es = vE.get(v2) ?? [];
    if (es.length >= 3 && es.every((k) => city.edges[k] === "minor" || city.edges[k] === "secondary" || city.edges[k] === "arterial")) interior.push(v2);
  }
  const nRad = Math.round(1 + city.params.roadComplexity * 4);
  for (let i = 0; i < nRad; i++) {
    const far = interior.filter((v2) => Math.hypot(city.verts[v2][0] - market.center[0], city.verts[v2][1] - market.center[1]) > 0.4 * R2 && isFinite(dd[v2]));
    if (!far.length) break;
    addStreet(tracePath(prev, rng.pick(far)), "secondary");
  }
  const nRing = Math.round(city.params.roadComplexity * 2.4);
  for (let i = 0; i < nRing; i++) {
    const rho = R2 * rng.range(0.32, 0.52), th = rng.range(0, Math.PI * 2);
    const near = (a) => {
      const q = [market.center[0] + Math.cos(a) * rho, market.center[1] + Math.sin(a) * rho];
      let b = -1, bd2 = Infinity;
      for (const v2 of interior) {
        const d = dist(city.verts[v2], q);
        if (d < bd2) bd2 = d, b = v2;
      }
      return b;
    };
    const s = near(th), t = near(th + rng.range(1.5, 2.6));
    if (s < 0 || t < 0 || s === t) continue;
    const ring2 = mkAdj((a, b) => {
      const A = city.verts[a], B2 = city.verts[b];
      const r2 = Math.hypot((A[0] + B2[0]) / 2 - market.center[0], (A[1] + B2[1]) / 2 - market.center[1]);
      return dist(A, B2) * (1 + 2.8 * Math.abs(r2 - rho) / rho);
    }, false);
    const res = dijkstra(V, ring2, [s]);
    if (isFinite(res.dist[t])) addStreet(tracePath(res.prev, t).reverse(), "secondary");
  }
  for (const pl of plans) {
    pl.b.w = pl.b.main ? 8 : 5.2;
    for (const ci of pl.b.cells) for (const cut of city.cells[ci].cuts) if (cut.kind === "bridge" && Math.abs(cut.p[0] - pl.b.m[0]) < 1e-6) cut.w = pl.b.w;
    pl.b.tower = pl.b.main && (city.params.identity === "ancient" || city.params.identity === "hilltop" || city.params.identity === "royal");
  }
  city.streets = streets;
}
var WARD_W = { poor: 0.78, residential: 0.95, noble: 1.12, merchant: 1.05, market: 1.1, industrial: 1.1, artisan: 0.97, harbour: 1.08, military: 1.05 };
function assignWidths(ctx) {
  const { city } = ctx;
  for (const [k, e] of ctx.ei) {
    const cls = city.edges[k];
    if (!cls || !STREET_CLS.has(cls)) continue;
    const base = cls === "arterial" ? 9.6 : cls === "secondary" ? 6.6 : 4.4;
    const jit = 0.88 + 0.26 * hash01(k + city.seedUsed);
    const f = e.cells.reduce((s, c2) => s + (WARD_W[city.cells[c2].ward ?? ""] ?? 1), 0) / e.cells.length;
    city.ew[k] = base * jit * f;
  }
}
function planPlazas(ctx) {
  const { city, rng } = ctx;
  const vE = vertexEdges(ctx.ei);
  const out = [];
  const cand = [];
  for (const [v2, es] of vE) {
    if (es.length < 3) continue;
    if (!es.every((k) => STREET_CLS.has(city.edges[k] ?? ""))) continue;
    const big = es.filter((k) => city.edges[k] === "arterial" || city.edges[k] === "secondary").length;
    if (big < 2) continue;
    const pts = es.map((k) => {
      const e = ctx.ei.get(k);
      return dist(city.verts[e.a], city.verts[e.b]);
    });
    if (Math.min(...pts) < 26) continue;
    if (city.cells.some((c2) => c2.vids.includes(v2) && (c2.layout !== "blocks" || c2.locked))) continue;
    cand.push(v2);
  }
  for (let i = cand.length - 1; i > 0; i--) {
    const j2 = rng.int(0, i + 1);
    [cand[i], cand[j2]] = [cand[j2], cand[i]];
  }
  const maxN = 3 + Math.round(city.params.roadComplexity * 4);
  for (const v2 of cand) {
    if (out.length >= maxN) break;
    if (out.some((o) => dist(city.verts[o.vid], city.verts[v2]) < 110)) continue;
    out.push({ vid: v2, r: rng.range(6.5, 9.5) });
  }
  city.plazas = out;
  for (const p of out) {
    const kind = rng.weighted([["well", 5], ["statue", 2.5], ["fountain", 2.5]]);
    city.features.push({ id: city.nextId++, type: kind, p: city.verts[p.vid] });
  }
}

// src/engine/districts.ts
var cellArea = (ctx, c2) => area(poly(ctx.city, c2));
function coastAdj(ctx, c2) {
  return c2.nbrs.some((n) => n >= 0 && ctx.city.cells[n].kind === "sea");
}
function riverAdj(ctx, c2) {
  const r2 = ctx.city.river;
  if (!r2) return false;
  const n = c2.vids.length;
  for (let i = 0; i < n; i++) if (edgeKey(c2.vids[i], c2.vids[(i + 1) % n]) in r2.ew) return true;
  return false;
}
function blankRef(cells) {
  return cells[0];
}
function chooseAnchors(ctx) {
  const { city, rng } = ctx;
  const st = city.settlement;
  const cells = city.cells;
  const idn = identityOf(city.params.identity);
  const cc2 = cells.filter((c2) => c2.kind === "city");
  const market = city.marketCell >= 0 ? cells[city.marketCell] : {
    ...cc2[0] ?? blankRef(cells),
    center: [cc2.reduce((s, c2) => s + c2.center[0], 0) / Math.max(1, cc2.length), cc2.reduce((s, c2) => s + c2.center[1], 0) / Math.max(1, cc2.length)]
  };
  const elevs = cc2.map((c2) => c2.elev);
  const emin = Math.min(...elevs), emax = Math.max(...elevs);
  const en = (c2) => emax > emin ? (c2.elev - emin) / (emax - emin) : 0.5;
  const free = () => cells.filter((c2) => c2.kind === "city" && c2.layout === "blocks" && !c2.locked && c2.vids.length >= 4);
  let best = null, bs = -Infinity;
  for (const c2 of free()) {
    const a = cellArea(ctx, c2);
    let s = a / 140 + rng.range(0, 10) - (a < 3600 ? 200 : 0);
    const dm = market ? dist(c2.center, market.center) : dist(c2.center, c2.center);
    const outsideN = c2.nbrs.filter((n) => n < 0 || cells[n].kind !== "city").length;
    const water = coastAdj(ctx, c2) || riverAdj(ctx, c2);
    const gateNear = city.gates.some((g) => g.kind === "main" && dist(g.p, c2.center) < 150);
    let def = 45 * en(c2) + (c2.depth === 0 ? 18 : 0) + (water ? 14 : 0) + (outsideN >= 2 ? 10 : 0) + (gateNear ? 8 : 0);
    if (idn.citadel !== "centre" && dm < 0.3 * ctx.R) def -= 70;
    s += def;
    switch (idn.citadel) {
      case "edge":
        s += (c2.depth === 0 ? 26 : 0) - (coastAdj(ctx, c2) ? 18 : 0);
        break;
      case "high":
        s += 120 * en(c2) + (c2.depth <= 1 ? 10 : 0);
        break;
      case "centre":
        s += 70 - dm / 5 + (c2.nbrs.includes(market.id) ? 30 : 0) - def * 0.6;
        break;
      case "water":
        s += (water ? 45 : 0) + (c2.depth === 0 ? 14 : 0);
        break;
    }
    if (s > bs) bs = s, best = c2;
  }
  if (best && st.citadel) {
    best.layout = "castle";
    best.ward = "citadel";
    city.citadelCell = best.id;
  }
  best = null;
  bs = -Infinity;
  for (const c2 of free()) {
    const a = cellArea(ctx, c2);
    const dm = market ? dist(c2.center, market.center) : dist(c2.center, c2.center);
    let s = a / 150 + rng.range(0, 12) - (a < 3200 ? 150 : 0);
    s += market && c2.nbrs.includes(market.id) ? 55 : dm < 0.34 * ctx.R ? 28 : 0;
    s -= c2.depth === 0 ? 30 : 0;
    if (c2.nbrs.includes(city.citadelCell)) s -= 25;
    if (s > bs) bs = s, best = c2;
  }
  if (best && st.cathedral) {
    best.layout = "cathedral";
    best.ward = "religious";
    city.cathedralCell = best.id;
  } else if (best && st.church) {
    best.layout = "church";
    best.ward = "religious";
    city.cathedralCell = best.id;
  }
}
function assignDistricts(ctx) {
  const { city, rng } = ctx;
  const cells = city.cells;
  const idn = identityOf(city.params.identity);
  const res = city.resolved;
  const cityCells = cells.filter((c2) => c2.kind === "city");
  const market = city.marketCell >= 0 ? cells[city.marketCell] : void 0;
  const citadel = city.citadelCell >= 0 ? cells[city.citadelCell] : void 0;
  const cath = city.cathedralCell >= 0 ? cells[city.cathedralCell] : void 0;
  const gatePts = city.gates.filter((g) => g.wall === "outer").map((g) => g.p);
  const gateDist = (c2) => gatePts.length ? Math.min(...gatePts.map((p) => dist(p, c2.center))) : 999;
  const arterialTouch = (c2) => {
    let n = 0;
    for (let i = 0; i < c2.vids.length; i++) if (city.edges[edgeKey(c2.vids[i], c2.vids[(i + 1) % c2.vids.length])] === "arterial") n++;
    return n;
  };
  const harbourCells = /* @__PURE__ */ new Set();
  if (res.harbour) {
    if (res.geo === "coast") {
      let anchor = null, bd2 = Infinity;
      const coastEdges = [];
      for (const c2 of cityCells)
        for (let i = 0; i < c2.vids.length; i++) {
          const a = c2.vids[i], b = c2.vids[(i + 1) % c2.vids.length];
          const k = edgeKey(a, b);
          if (city.edges[k] === "coast") {
            const m2 = mid(city.verts[a], city.verts[b]);
            coastEdges.push({ k, m: m2, cell: c2 });
            const d = market ? dist(m2, market.center) : dist(m2, c2.center);
            if (d < bd2) bd2 = d, anchor = m2;
          }
        }
      if (anchor) {
        for (const e of coastEdges) if (dist(e.m, anchor) < 210) ctx.harbourEdges.add(e.k), harbourCells.add(e.cell.id);
      }
    } else if (city.river) {
      let anchor = null, bd2 = Infinity;
      for (const k of Object.keys(city.river.ew)) {
        const e = ctx.ei.get(k);
        if (!e || e.cells.length < 2 || e.cells.some((c2) => cells[c2].kind !== "city")) continue;
        const m2 = mid(city.verts[e.a], city.verts[e.b]);
        const d = market ? dist(m2, market.center) : dist(m2, cells[e.cells[0]].center);
        if (d < bd2) bd2 = d, anchor = m2;
      }
      if (anchor)
        for (const k of Object.keys(city.river.ew)) {
          const e = ctx.ei.get(k);
          if (!e || e.cells.length < 2 || e.cells.some((c2) => cells[c2].kind !== "city")) continue;
          if (dist(mid(city.verts[e.a], city.verts[e.b]), anchor) < 170) {
            ctx.harbourEdges.add(k);
            for (const c2 of e.cells) harbourCells.add(c2);
          }
        }
    }
  }
  const anchors = /* @__PURE__ */ new Set([market?.id ?? -1, citadel?.id ?? -1, cath?.id ?? -1]);
  anchors.delete(-1);
  const K = Math.max(1, city.settlement.districts);
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
  const suit = (t, c2) => {
    const dm = market ? dist(c2.center, market.center) : dist(c2.center, c2.center);
    const R2 = ctx.R;
    switch (t) {
      case "noble":
        return 60 * c2.elev - Math.abs(dm - 0.3 * R2) / 9 - (c2.depth === 0 ? 18 : 0) + (citadel && c2.nbrs.includes(citadel.id) ? 20 : 0);
      case "merchant":
        return -dm / 9 + (riverAdj(ctx, c2) ? 22 : 0) + arterialTouch(c2) * 9;
      case "residential":
        return 10 - Math.abs(dm - 0.5 * R2) / 18;
      case "artisan":
        return -Math.abs(dm - 0.5 * R2) / 14 + arterialTouch(c2) * 5;
      case "industrial":
        return (riverAdj(ctx, c2) ? 45 : 0) + (c2.depth === 0 ? 14 : 0) - dm / 25;
      case "religious":
        return -dm / 10;
      case "harbour":
        return coastAdj(ctx, c2) || riverAdj(ctx, c2) ? 40 : -20;
      case "military":
        return (gateDist(c2) < 120 ? 32 : 0) + (citadel && c2.nbrs.includes(citadel.id) ? 30 : 0) + (c2.depth === 0 ? 10 : 0);
      case "poor":
        return (c2.depth === 0 ? 34 : 0) + dm / 22 - 14 * c2.elev + (riverAdj(ctx, c2) ? 8 : 0);
      case "scholar":
        return -dist(c2.center, (cath ?? market ?? c2).center) / 9 + 8;
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
    for (const c2 of cityCells) {
      if (taken.has(c2.id) || c2.locked && false) continue;
      let s = suit(t, c2) + rng.range(0, 14);
      for (const sd of seeds) if (hop(sd.cell.id, c2.id) < 110) s -= 25;
      if (s > bs) bs = s, best = c2;
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
  for (const c2 of cityCells) {
    if (c2.id === market?.id || c2.id === citadel?.id) continue;
    if (c2.id === cath?.id) continue;
    c2.ward = owner.has(c2.id) ? seeds[owner.get(c2.id)].type : "residential";
    if (c2.ward === "harbour" && !harbourCells.has(c2.id)) c2.ward = "residential";
  }
  for (const id of harbourCells) if (!anchors.has(id)) cells[id].ward = "harbour";
  for (const c2 of cityCells) {
    if (anchors.has(c2.id) || c2.ward === "harbour") continue;
    const adjA = c2.nbrs.some((n) => n >= 0 && (n === citadel?.id || n === market?.id));
    if (c2.depth === 0 && !adjA && (c2.ward === "residential" || c2.ward === "artisan") && rng.chance(idn.poor * 0.75)) c2.ward = "poor";
    else if (c2.depth === 1 && c2.ward === "residential" && rng.chance(idn.poor * 0.15)) c2.ward = "poor";
  }
  if ((idn.ward.military ?? 0) >= 1) {
    for (const g of city.gates.filter((g2) => g2.wall === "outer"))
      for (const c2 of cityCells)
        if (c2.vids.includes(g.vid) && !anchors.has(c2.id) && (c2.ward === "residential" || c2.ward === "poor" || c2.ward === "artisan") && rng.chance(0.4)) c2.ward = "military";
  }
  let scholarFirst = true;
  for (const c2 of cityCells) {
    if (c2.layout !== "blocks" || c2.locked || c2.vids.length < 4) continue;
    const a = cellArea(ctx, c2);
    if (a < 3400) continue;
    if (c2.ward === "scholar" && (scholarFirst || rng.chance(0.4))) c2.layout = "ring", scholarFirst = false;
    else if (c2.ward === "military" && rng.chance(0.25)) c2.layout = "ring";
    else if (c2.ward === "religious" && rng.chance(0.4)) c2.layout = "ring";
    else if (c2.ward === "noble" && a > 4500 && rng.chance(0.3)) c2.layout = "ring";
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
    for (const c2 of cityCells) {
      if (done.has(c2.id) || !c2.ward) continue;
      const comp = [];
      const st = [c2.id];
      done.add(c2.id);
      while (st.length) {
        const u4 = st.pop();
        comp.push(u4);
        for (const n of cells[u4].nbrs)
          if (n >= 0 && cells[n].kind === "city" && !done.has(n) && cells[n].ward === c2.ward) done.add(n), st.push(n);
      }
      groups.push(comp);
    }
  }
  const fixed = (g) => g.some((id) => id === market?.id || id === citadel?.id || id === cath?.id) && g.length === 1;
  const target = Math.max(1, city.settlement.districts) + groups.filter(fixed).length;
  const groupOf = () => {
    const m2 = /* @__PURE__ */ new Map();
    groups.forEach((g, i) => g.forEach((id) => m2.set(id, i)));
    return m2;
  };
  let guard = 0;
  while (groups.length > target && guard++ < 200) {
    const gm = groupOf();
    const order = groups.map((g, i) => [i, g.length]).filter(([i]) => !fixed(groups[i])).sort((a, b) => a[1] - b[1]);
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
    const g = groups[gi];
    let a = g[0], b = g[0], bd2 = -1;
    for (const x of g) for (const y of g) {
      const d = dist(cells[x].center, cells[y].center);
      if (d > bd2) bd2 = d, a = x, b = y;
    }
    const A = [], Bc = [];
    for (const id of g) (dist(cells[id].center, cells[a].center) <= dist(cells[id].center, cells[b].center) ? A : Bc).push(id);
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
  groups = groups.filter((g) => g.length);
  const districts = [];
  const nameSeen = /* @__PURE__ */ new Set();
  for (const comp of groups) {
    const ward = cells[comp[0]].ward;
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
    for (const u4 of comp) {
      cells[u4].district = id;
      cx += cells[u4].center[0];
      cy += cells[u4].center[1];
    }
    districts.push({ id, type: ward, name: nm, cells: comp, center: [cx / comp.length, cy / comp.length] });
  }
  city.districts = districts;
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
  const { city } = ctx;
  const res = city.resolved;
  const walls = [];
  const towers = [];
  const vE = vertexEdges(ctx.ei);
  city.walls = walls;
  city.towers = towers;
  if (city.settlement.wall === "none") return;
  const edges = city.edges;
  const loops = outlineLoops(city, (id) => id >= 0 && city.cells[id].kind === "city");
  loops.sort((a, b) => area(b.map((v2) => city.verts[v2])) - area(a.map((v2) => city.verts[v2])));
  const outer = loops[0] ?? [];
  const mk = (kind, loop, pred) => {
    for (const r2 of runsFromLoop(loop, pred, edges)) walls.push({ kind, vids: r2.vids, closed: r2.closed, t: WALL_T[kind] });
  };
  mk("outer", outer, (c2) => c2 === "wallO");
  mk("sea", outer, (c2) => c2 === "coast");
  for (let i = walls.length - 1; i >= 0; i--) {
    const w = walls[i];
    if (w.kind !== "sea") continue;
    walls.splice(i, 1);
    let cur = [];
    for (let j2 = 0; j2 < w.vids.length - 1; j2++) {
      const k = edgeKey(w.vids[j2], w.vids[j2 + 1]);
      if (ctx.harbourEdges.has(k)) {
        if (cur.length > 1) walls.push({ kind: "sea", vids: cur, closed: false, t: WALL_T.sea });
        cur = [];
      } else {
        if (!cur.length) cur.push(w.vids[j2]);
        cur.push(w.vids[j2 + 1]);
      }
    }
    if (cur.length > 1) walls.push({ kind: "sea", vids: cur, closed: false, t: WALL_T.sea });
  }
  if (city.settlement.wall === "double") {
    for (const l of outlineLoops(city, (id) => id >= 0 && city.cells[id].inner)) mk("inner", l, (c2) => c2 === "wallI");
  }
  const gatePts = () => city.gates.map((g) => g.p);
  const near = (p, r2) => towers.some((t) => dist(t.p, p) < r2) || gatePts().some((q) => dist(q, p) < r2 + 3);
  const addTower = (p, r2, kind, wall, dir) => towers.push({ p, r: r2, kind, wall, dir });
  for (const g of city.gates) {
    if (g.kind === "inner") {
      const d = 8;
      for (const s of [-1, 1]) addTower(add(g.p, mul(g.tan, s * d)), 4.4, "round", "inner", g.dir);
    } else if (g.kind === "postern") {
      const es = (vE.get(g.vid) ?? []).filter((k) => edges[k] === "wallO");
      if (es.length) {
        const e = ctx.ei.get(es[0]);
        const o = city.verts[e.a === g.vid ? e.b : e.a];
        addTower(add(g.p, mul(unit(sub(o, g.p)), Math.min(7, dist(o, g.p) * 0.35))), 3.6, "square", "outer", g.dir);
      }
    } else if (g.vid >= 0) {
      const es = (vE.get(g.vid) ?? []).filter((k) => edges[k] === "wallO");
      for (const k of es) {
        const e = ctx.ei.get(k);
        const o = city.verts[e.a === g.vid ? e.b : e.a];
        const L = dist(o, g.p);
        addTower(add(g.p, mul(unit(sub(o, g.p)), Math.min(8.5, L * 0.4))), 5.2, "round", "outer", g.dir);
      }
    }
  }
  if (city.river) {
    for (const w of walls) {
      if (w.kind === "sea") continue;
      for (let i = 0; i < w.vids.length; i++) {
        const v2 = w.vids[i];
        if (!ctx.riverVids.has(v2)) continue;
        if (!w.closed && (i === 0 || i === w.vids.length - 1)) continue;
        const n = w.vids.length;
        const pv = w.vids[(i - 1 + n) % n], nv = w.vids[(i + 1) % n];
        const P = city.verts[v2];
        const tan = unit(sub(city.verts[nv], city.verts[pv]));
        const rw = city.river.w[Math.round(city.river.vids.indexOf(v2) / city.river.vids.length * (city.river.w.length - 1))] ?? 16;
        city.gates.push({ vid: v2, p: P, kind: "water", wall: w.kind === "inner" ? "inner" : "outer", tan, dir: [tan[1], -tan[0]] });
        for (const o of [pv, nv]) {
          const Q = city.verts[o];
          addTower(add(P, mul(unit(sub(Q, P)), Math.min(rw / 2 + 7.5, dist(P, Q) * 0.45))), 4.6, "round", w.kind === "inner" ? "inner" : "outer", [tan[1], -tan[0]]);
        }
      }
    }
  }
  for (const w of walls) {
    const n = w.vids.length;
    const pts = w.vids.map((v2) => city.verts[v2]);
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
        const L = dist(P, Q);
        if (L > 80) {
          const k = Math.floor(L / 62);
          for (let j2 = 1; j2 <= k; j2++) {
            const q = add(P, mul(sub(Q, P), j2 / (k + 1)));
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
        const t = unit(sub(city.verts[outer[(i + 1) % n]], city.verts[outer[(i - 1 + n) % n]]));
        const idx = towers.findIndex((x) => dist(x.p, city.verts[v2]) < 9);
        if (idx >= 0) towers.splice(idx, 1);
        addTower(city.verts[v2], 6.6, "harbour", "sea", [t[1], -t[0]]);
      }
    }
  }
  city.moat = city.settlement.moat ? Math.max(9, city.settlement.radius * 0.028) : 0;
}
function buildHarbour(ctx) {
  const { city, rng } = ctx;
  if (!ctx.harbourEdges.size) return;
  const piers = [];
  const boats = [];
  const coast = city.resolved.geo === "coast";
  const keys = [...ctx.harbourEdges];
  let idx = 0;
  for (const k of keys) {
    const e = ctx.ei.get(k);
    const A = city.verts[e.a], B2 = city.verts[e.b];
    const L = dist(A, B2);
    if (L < (coast ? 20 : 24)) continue;
    const m2 = mid(A, B2);
    if (piers.some((p2) => dist(p2.b, m2) < (coast ? 38 : 50))) continue;
    let cell;
    if (coast) cell = city.cells.find((c2) => e.cells.includes(c2.id) && c2.kind === "city");
    else cell = city.cells[e.cells[idx++ % 2]];
    const inN = inwardNormal(city, cell, e.a, e.b);
    if (!inN) continue;
    const out = [-inN[0], -inN[1]];
    let len = coast ? rng.range(16, 28) : rng.range(2.5, 4.5);
    if (coast) {
      while (len > 9 && !ctx.sea(m2[0] + out[0] * len, m2[1] + out[1] * len)) len -= 3;
      if (!ctx.sea(m2[0] + out[0] * len, m2[1] + out[1] * len)) continue;
    }
    const hw = (city.river?.ew[k] ?? 16) / 2;
    const p = coast ? { a: add(m2, mul(out, -3.5)), b: add(m2, mul(out, len)), w: 3.8 } : { a: add(m2, mul(out, -hw - 1.5)), b: add(m2, mul(out, -hw + len)), w: 2.4 };
    piers.push(p);
    if (coast || rng.chance(0.6)) {
      const side = rng.chance(0.5) ? 1 : -1;
      const perp = [-out[1], out[0]];
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
  const ht = city.towers.find((t) => t.kind === "harbour");
  if (ht && coast) city.features.push({ id: city.nextId++, type: "lighthouse", p: add(ht.p, mul(ht.dir, 8)) });
}
function finalizeGround(ctx) {
  const { city } = ctx;
  for (const c2 of city.cells) {
    if (c2.vids.length < 3) continue;
    const pl = poly(city, c2);
    if (c2.kind === "city") c2.ground = flat(pl);
    else if (c2.kind === "sea") {
      const d = c2.nbrs.map((n) => n >= 0 && city.cells[n].kind !== "sea" ? 7 : 0);
      c2.ground = flat(insetConvex(pl, d));
    }
  }
}
function buildSuburbs(ctx) {
  const { city, rng } = ctx;
  const st = city.settlement;
  if (!st.suburbs || !city.roads.length) return;
  const cityCells = city.cells.filter((c2) => c2.kind === "city");
  const inCity = (p) => cityCells.some((c2) => pointInConvex(p, poly(city, c2), 2));
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
      const cell = city.cells.find((c2) => c2.kind === "outside" && pointInConvex(p, poly(city, c2), 4));
      for (const q of placed) {
        const parts = [];
        const bb2 = [];
        const co = Math.cos(q.a), si = Math.sin(q.a);
        const hw = q.w / 2, hh = q.h / 2;
        for (const [u4, v2] of [[-hw, -hh], [hw, -hh], [hw, hh], [-hw, hh]]) bb2.push(q.x + u4 * co - v2 * si, q.y + u4 * si + v2 * co);
        parts.push({ k: "r", p: bb2, roof: q.t === "barn" ? "gable" : rng.chance(0.6) ? "thatch" : "gable", along: 0 });
        city.buildings.push({
          id: city.nextId++,
          type: q.t,
          cell: cell ? cell.id : 0,
          parts,
          pal: q.t === "barn" ? "timber" : "thatch",
          ci: rng.int(0, 4),
          h: 0,
          bb: [Math.min(...bb2.filter((_, i2) => i2 % 2 === 0)), Math.min(...bb2.filter((_, i2) => i2 % 2 === 1)), Math.max(...bb2.filter((_, i2) => i2 % 2 === 0)), Math.max(...bb2.filter((_, i2) => i2 % 2 === 1))],
          manual: true
        });
      }
      made++;
    }
  }
}
function riverDistOf(city, p) {
  return city.river ? polylineNearest(p, city.river.pts).d : Infinity;
}
function buildFeaturesAndDecor(ctx) {
  const { city, rng } = ctx;
  const idn = identityOf(city.params.identity);
  const cells = city.cells;
  const roads = city.roads;
  const roadDist = (p) => {
    let d = Infinity;
    for (const r2 of roads) d = Math.min(d, polylineNearest(p, r2.pts).d);
    return d;
  };
  const riverDist = (p) => city.river ? nearestOn(city.river.pts, p).d : Infinity;
  const hop = /* @__PURE__ */ new Map();
  let fr = [];
  for (const c2 of cells)
    if (c2.kind === "outside" && c2.nbrs.some((n) => n >= 0 && cells[n].kind === "city")) hop.set(c2.id, 1), fr.push(c2.id);
  while (fr.length) {
    const nx = [];
    for (const u4 of fr)
      for (const n of cells[u4].nbrs)
        if (n >= 0 && cells[n].kind === "outside" && !hop.has(n)) hop.set(n, hop.get(u4) + 1), nx.push(n);
    fr = nx;
  }
  const mills = cells.filter((c2) => c2.kind === "outside" && (hop.get(c2.id) ?? 9) <= 2 && c2.vids.length >= 4 && riverDist(c2.center) > 80 && roadDist(c2.center) > 30);
  for (let i = 0; i < idn.windmills && mills.length; i++) {
    const c2 = mills.splice(rng.int(0, mills.length), 1)[0];
    city.features.push({ id: city.nextId++, type: "windmill", p: c2.center });
  }
  const og = city.gates.filter((g) => g.kind === "main");
  if (og.length && rng.chance(0.6)) {
    const g = rng.pick(og);
    const p = add(add(g.p, mul(g.dir, 70)), mul(g.tan, rng.pick([-1, 1]) * 34));
    if (roadDist(p) > 14 && riverDist(p) > 40 && !ctx.sea(p[0], p[1])) city.features.push({ id: city.nextId++, type: "gallows", p });
  }
  const treeAreas = [];
  city.fields = [];
  for (const c2 of cells) {
    if (c2.kind !== "outside" || c2.vids.length < 3) continue;
    const h = hop.get(c2.id) ?? 9;
    const pl = poly(city, c2);
    const d = c2.nbrs.map((n, i) => {
      if (n >= 0 && cells[n].kind === "city") return 11;
      if (n >= 0 && cells[n].kind === "sea") return 7;
      const k = edgeKey(c2.vids[i], c2.vids[(i + 1) % c2.vids.length]);
      if (city.river && k in city.river.ew) return city.river.ew[k] / 2 + 6;
      return 2.5;
    });
    const ip = insetConvex(pl, d);
    if (ip.length < 3 || area(ip) < 1500) continue;
    const nf = ctx.noise.fbm(c2.center[0] / 380 + 20, c2.center[1] / 380 + 30, 3);
    const high = c2.elev > (city.resolved.geo === "mountain" ? 0.75 : 1);
    const mountain = city.resolved.geo === "mountain";
    const farm = !high && h <= 3 && nf < 0.62 && rng.chance(0.82 - 0.12 * h) && roadDist(c2.center) < 900;
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
        const bb2 = bbox(p);
        const rad = Math.hypot(bb2[2] - bb2[0], bb2[3] - bb2[1]) / 2;
        const f = [];
        for (let off = -rad; off <= rad; off += 4.4) {
          const o = [cc2[0] + nn[0] * off, cc2[1] + nn[1] * off];
          const tr = clipLineConvex(p, o, dd);
          if (tr && tr[1] - tr[0] > 6) f.push(o[0] + dd[0] * (tr[0] + 1), o[1] + dd[1] * (tr[0] + 1), o[0] + dd[0] * (tr[1] - 1), o[1] + dd[1] * (tr[1] - 1));
        }
        city.fields.push({ p: flat(p), f, tone: rng.int(0, 4) });
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
    const bb2 = bbox(t.pl);
    for (let x = bb2[0]; x < bb2[2]; x += s)
      for (let y = bb2[1]; y < bb2[3]; y += s) {
        const p = [x + rng.range(0, s), y + rng.range(0, s)];
        const r2 = rng.range(3.4, 5.6);
        if (!pointInConvex(p, t.pl, -r2 * 0.6)) continue;
        if (t.dens < 1 && rng.chance(0.55)) continue;
        if (roadDist(p) < 8 + r2 || riverDist(p) < 16 + r2) continue;
        forest.push(p[0], p[1], r2, rng.int(0, 3));
      }
  }
  city.forest = forest;
  const waves = [];
  for (const c2 of cells) {
    if (c2.kind !== "sea" || c2.ground.length < 6) continue;
    const g = c2.ground;
    const bb2 = bbox(g, true);
    const n = clamp(Math.round((bb2[2] - bb2[0]) * (bb2[3] - bb2[1]) / 14e3), 0, 24);
    for (let i = 0; i < n; i++) {
      const p = [rng.range(bb2[0], bb2[2]), rng.range(bb2[1], bb2[3])];
      if (Math.hypot(p[0], p[1]) > 900) continue;
      let inside = true;
      const poly2 = [];
      for (let j2 = 0; j2 < g.length; j2 += 2) poly2.push([g[j2], g[j2 + 1]]);
      inside = pointInConvex(p, poly2, -6);
      if (inside) waves.push(p[0], p[1], rng.range(8, 16));
    }
  }
  city.waves = waves;
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
function styleFor(city, ward) {
  const base = STYLE[ward];
  const k = city.settlement.plotScale;
  return { ...base, min: base.min * k, laneArea: base.laneArea * k };
}
function insetDists(city, cell) {
  const n = cell.vids.length;
  const out = [];
  for (let i = 0; i < n; i++) {
    const k = edgeKey(cell.vids[i], cell.vids[(i + 1) % n]);
    const cls = city.edges[k];
    let d = 3;
    switch (cls) {
      case "minor":
      case "secondary":
      case "arterial":
        d = (city.ew[k] ?? 4.4) / 2;
        break;
      case "wallO":
        d = WALL_T.outer / 2 + 3.2;
        break;
      case "wallI":
        d = WALL_T.inner / 2 + 2.6;
        break;
      case "river":
        d = (city.river?.ew[k] ?? 14) / 2 + 4.2;
        break;
      case "coast":
        d = 4.6;
        break;
      case "open":
        d = 3.2;
        break;
    }
    out.push(d);
  }
  return out;
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
    for (let j3 = 0; j3 < n; j3++) {
      if (j3 === i || (j3 + 1) % n === i) continue;
      const A = pts[j3], B2 = pts[(j3 + 1) % n];
      const ex = B2[0] - A[0], ey = B2[1] - A[1];
      const den = dir[0] * ey - dir[1] * ex;
      if (Math.abs(den) < 1e-9) continue;
      const ox = A[0] - P[0], oy = A[1] - P[1];
      const t = (ox * ey - oy * ex) / den;
      const u4 = (ox * dir[1] - oy * dir[0]) / den;
      if (t > 1e-3 && u4 > 0.02 && u4 < 0.98 && (!best || t < best.t)) best = { j: j3, t, q: [P[0] + dir[0] * t, P[1] + dir[1] * t] };
    }
    if (!best) continue;
    const { j: j2, q } = best;
    const cd2 = Math.max(cutD, d[(i - 1 + n) % n], d[i]);
    const p1 = [], d1 = [], p2 = [], d2 = [];
    for (let k = i; k !== (j2 + 1) % n; k = (k + 1) % n) {
      p1.push(pts[k]);
      d1.push(d[k]);
    }
    p1.push(q);
    d1[d1.length - 1] = d[j2];
    d1.push(cd2);
    p2.push(q);
    d2.push(d[j2]);
    for (let k = (j2 + 1) % n; k !== i; k = (k + 1) % n) {
      p2.push(pts[k]);
      d2.push(d[k]);
    }
    p2.push(P);
    d2.push(cd2);
    return [...decomposeConvex(p1, d1, cutD, depth + 1), ...decomposeConvex(p2, d2, cutD, depth + 1)];
  }
  return [{ p: pts, d }];
}
function cellPieces(city, cell) {
  const pl = poly(city, cell);
  const n = pl.length;
  const parts = decomposeConvex(pl, insetDists(city, cell), 1.6);
  let ps = [];
  for (const part of parts) {
    let reg = insetConvex(part.p, part.d);
    if (reg.length < 3) continue;
    for (const pz of city.plazas) {
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
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const p of parts) {
    if (p.k === "c") {
      x0 = Math.min(x0, p.p[0] - p.p[2]);
      x1 = Math.max(x1, p.p[0] + p.p[2]);
      y0 = Math.min(y0, p.p[1] - p.p[2]);
      y1 = Math.max(y1, p.p[1] + p.p[2]);
    } else {
      const b = bbox(p.p, true);
      x0 = Math.min(x0, b[0]);
      y0 = Math.min(y0, b[1]);
      x1 = Math.max(x1, b[2]);
      y1 = Math.max(y1, b[3]);
    }
  }
  return [x0, y0, x1, y1];
}
function R(rc, u4, v2, w, h, roof, forcedAlong) {
  const c2 = Math.cos(rc.a), s = Math.sin(rc.a);
  return {
    k: "r",
    p: rectPts(rc.cx + u4 * c2 - v2 * s, rc.cy + u4 * s + v2 * c2, w, h, rc.a),
    roof,
    along: forcedAlong !== void 0 ? forcedAlong : w >= h ? 0 : 1
  };
}
function C(rc, u4, v2, r2, roof) {
  const c2 = Math.cos(rc.a), s = Math.sin(rc.a);
  return { k: "c", p: [rc.cx + u4 * c2 - v2 * s, rc.cy + u4 * s + v2 * c2, r2], roof, along: 0 };
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
  const L = rc.w, W = rc.h;
  if (temple) {
    const parts2 = [R(rc, 0, 0, L * 0.88, W * 0.52, "flat"), R(rc, 0, 0, L * 0.7, W * 0.3, "gable")];
    const n = Math.max(4, Math.floor(L * 0.88 / 5.2));
    for (let i = 0; i < n; i++) {
      const u4 = -L * 0.44 + 1.6 + i * (L * 0.88 - 3.2) / (n - 1);
      parts2.push(C(rc, u4, W * 0.26 - 1.4, 1.15, "flat"), C(rc, u4, -W * 0.26 + 1.4, 1.15, "flat"));
    }
    return parts2;
  }
  const nw = Math.min(W * 0.4, L * 0.2);
  const ra = nw / 2;
  const ln = L - ra * 0.9;
  const u0 = -L / 2 + ln / 2;
  const ut = -L / 2 + ln * 0.6;
  const tw = Math.min(W * 0.96, ln * 0.7);
  const parts = [
    R(rc, u0, 0, ln, nw, "gable", 0),
    R(rc, ut, 0, nw * 0.96, tw, "gable", 1),
    C(rc, L / 2 - ra, 0, ra, "cone")
  ];
  const aisle = nw * 0.32;
  const aLen = ut - nw * 0.5 - (-L / 2 + nw * 0.55);
  if (aLen > 4) {
    const ac2 = (-L / 2 + nw * 0.55 + ut - nw * 0.5) / 2;
    parts.splice(0, 0, R(rc, ac2, nw / 2 + aisle / 2 - 0.2, aLen, aisle, "flat", 0), R(rc, ac2, -nw / 2 - aisle / 2 + 0.2, aLen, aisle, "flat", 0));
  }
  if (variant % 3 === 1) {
    const t = nw * 0.86;
    parts.push(R(rc, -L / 2 + t / 2, 0, t, t, "hip"));
    for (let i = -2; i <= 2; i++) {
      const a = i / 2 * 1.1;
      parts.push(C(rc, L / 2 - ra + Math.cos(a) * ra * 1.02, Math.sin(a) * ra * 1.02, ra * 0.34, "cone"));
    }
    parts.push(R(rc, ut, 0, nw * 0.58, nw * 0.58, "hip"));
  } else if (variant % 3 === 2) {
    const tws = nw * 0.6;
    parts.push(
      R(rc, -L / 2 + tws / 2, nw / 2 - tws / 2 + 0.9, tws, tws, "hip"),
      R(rc, -L / 2 + tws / 2, -nw / 2 + tws / 2 - 0.9, tws, tws, "hip"),
      C(rc, ut, 0, nw * 0.34, "cone")
    );
  } else {
    const tws = nw * 0.46;
    parts.push(
      R(rc, -L / 2 + tws / 2, nw / 2 + tws / 2 - 0.4, tws, tws, "hip"),
      R(rc, -L / 2 + tws / 2, -nw / 2 - tws / 2 + 0.4, tws, tws, "hip"),
      R(rc, ut, 0, nw * 0.62, nw * 0.62, "hip")
    );
  }
  return parts;
}
function smallChurch(rc) {
  const L = rc.w, W = rc.h;
  const nw = Math.min(W * 0.46, L * 0.34);
  const ln = L * 0.84;
  return [
    R(rc, -L / 2 + ln / 2, 0, ln, nw, "gable"),
    R(rc, L / 2 - nw * 0.4, 0, nw * 0.8, nw * 0.8, "hip"),
    R(rc, -L / 2 + ln * 0.55, 0, nw * 0.9, Math.min(W, nw * 1.9), "gable"),
    C(rc, -L / 2 + nw * 0.35, 0, nw * 0.36, "cone")
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
function paletteFor(city, type, ward, rng) {
  const ci = rng.int(0, 4);
  const st = city.resolved.style;
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
      for (const [a, c2, w] of segs) {
        if (segDist(q, a, c2) < w + margin - (p.k === "c" ? p.p[2] : 0)) return false;
      }
    }
  }
  return true;
}
function riverOK(city, parts, margin = 1.2) {
  const r2 = city.river;
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
function scaleParts(parts, f) {
  const bb2 = bbOf(parts);
  const cx = (bb2[0] + bb2[2]) / 2, cy = (bb2[1] + bb2[3]) / 2;
  return parts.map((p) => {
    if (p.k === "c") return { ...p, p: [cx + (p.p[0] - cx) * f, cy + (p.p[1] - cy) * f, p.p[2] * f] };
    const q = p.p.slice();
    for (let i = 0; i < 8; i += 2) {
      q[i] = cx + (q[i] - cx) * f;
      q[i + 1] = cy + (q[i + 1] - cy) * f;
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
function subdivide(p, o, rng, out, depth = 0) {
  const a = area(p);
  const thr = o.min * (0.75 + rng.next() * o.var * 1.4);
  if (a < thr * 1.15 || depth > 10) return void out.push(p);
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
  const c2 = Math.cos(ang), s = Math.sin(ang);
  d = [d[0] * c2 - d[1] * s, d[0] * s + d[1] * c2];
  const gap = a > o.laneArea ? o.lane : 0;
  const [P1, P2] = splitConvex(p, pt, d, gap);
  if (P1.length < 3 || P2.length < 3 || area(P1) < 8 || area(P2) < 8) return void out.push(p);
  subdivide(P1, o, rng, out, depth + 1);
  subdivide(P2, o, rng, out, depth + 1);
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
      add2("house_l", 18, 150);
      add2("chapel", 9, 170);
      add2("hospital", 5, 330);
      add2("monastery", 6, 320);
      add2("house", 16);
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
    rc = norm(fr);
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
  const { rng, cell, city } = B2;
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
          const c3 = centroid(y);
          cell.trees.push(c3[0], c3[1], rng.range(2.2, 3.6));
        }
      }
      return;
    }
    const c2 = centroid(plot);
    let dArt = 999;
    for (const [p, q] of B2.fronts) dArt = Math.min(dArt, segDist(c2, p, q));
    let dWater = 999;
    for (const [p, q] of B2.coast) dWater = Math.min(dWater, segDist(c2, p, q));
    let dRiver = 999;
    if (city.river) {
      const n = nearestOn(city.river.pts, c2);
      dRiver = n.d - city.river.w[Math.min(city.river.w.length - 1, n.i)] / 2;
      dWater = Math.min(dWater, dRiver);
    }
    let dGate = 999;
    for (const g of B2.gates) dGate = Math.min(dGate, dist(g, c2));
    let type = f ?? pickType(B2, ward, a, dArt, dRiver, dWater, dGate);
    if (type === "mill") B2.mills++;
    let fp = null;
    let backyardPoly = void 0;
    const frontage = findFrontageEdge(plot, parentEdges);
    if (frontage) {
      const targetDepth = type === "merchant" ? rng.range(11, 18) : type === "warehouse" ? rng.range(12, 22) : type === "hovel" ? rng.range(6, 11) : type === "manor" || type === "palace" ? rng.range(14, 24) : rng.range(8, 14);
      const sm = ward === "merchant" || ward === "market" || ward === "artisan" ? rng.range(0.22, 0.45) : ward === "poor" ? rng.range(0.18, 0.38) : rng.range(0.32, 0.55);
      const fr = fitFrontageRect(plot, frontage[0], frontage[1], targetDepth, sm, 0.32);
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
      const bb2 = b.bb;
      cell.trees.push(bb2[0] - 2.2, bb2[1] - 2.2, rng.range(2.2, 3.2));
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
    const j2 = (i + 1) % n;
    const quad = [region[i], region[j2], inner[j2], inner[i]];
    if (area(quad) < 40) continue;
    if (skip && skip([(region[i][0] + region[j2][0]) / 2, (region[i][1] + region[j2][1]) / 2])) continue;
    B2.cell.blocks.push(flat(quad));
    const parentEdges = [
      [region[i], region[j2]],
      [inner[j2], inner[i]]
    ];
    subdivide(quad, o, B2.rng, plots);
    const quadForced = [];
    if (forcedQueue.length) quadForced.push(forcedQueue.shift());
    processPlots(B2, plots, ward, quadForced, parentEdges);
    plots.length = 0;
  }
}
function graves(B2, inner, avoid) {
  const bb2 = bbox(inner);
  for (let i = 0; i < 90; i++) {
    const p = [B2.rng.range(bb2[0], bb2[2]), B2.rng.range(bb2[1], bb2[3])];
    if (!pointInConvex(p, inner, -3.5)) continue;
    if (p[0] > avoid[0] - 3 && p[0] < avoid[2] + 3 && p[1] > avoid[1] - 3 && p[1] < avoid[3] + 3) continue;
    B2.cell.graves.push(p[0], p[1]);
  }
  for (let i = 0; i < 14; i++) {
    const p = [B2.rng.range(bb2[0], bb2[2]), B2.rng.range(bb2[1], bb2[3])];
    if (!pointInConvex(p, inner, -4)) continue;
    if (p[0] > avoid[0] - 6 && p[0] < avoid[2] + 6 && p[1] > avoid[1] - 6 && p[1] < avoid[3] + 6) continue;
    B2.cell.trees.push(p[0], p[1], B2.rng.range(2.4, 3.8));
  }
}
function centralBuilding(B2, inner, type, ward, scale2 = 0.62) {
  const c2 = centroid(inner);
  const fr = fitRect(homothety(inner, c2, scale2), 0.96);
  if (!fr) return null;
  const rc = norm(fr);
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
  const { cell, rng, city } = B2;
  const c2 = centroid(region);
  const inner = homothety(region, c2, area(region) > 5e3 ? 0.58 : 0.5);
  cell.open.push({ poly: flat(inner), kind: "plaza" });
  ring(B2, region, inner, "market", ["townhall", "guildhall", "inn"]);
  let hall = null;
  if (rng.chance(0.5) && area(inner) > 1100) hall = centralBuilding(B2, inner, "market_hall", "market", 0.4);
  if (!hall) city.features.push({ id: city.nextId++, type: "fountain", p: c2, cell: cell.id });
  const bb2 = bbox(inner);
  const axis = bb2[2] - bb2[0] >= bb2[3] - bb2[1] ? 0 : 1;
  const sp = homothety(inner, c2, 0.86);
  const rows = 2 + (area(inner) > 2400 ? 1 : 0);
  const across = axis === 0 ? bb2[3] - bb2[1] : bb2[2] - bb2[0];
  for (let r2 = 0; r2 < rows; r2++) {
    const off = ((r2 + 0.5) / rows - 0.5) * across * 0.66;
    for (let k = -8; k <= 8; k++) {
      const along = k * (axis === 0 ? bb2[2] - bb2[0] : bb2[3] - bb2[1]) * 0.062;
      if (!along) continue;
      const p = axis === 0 ? [c2[0] + along, c2[1] + off] : [c2[0] + off, c2[1] + along];
      if (!pointInConvex(p, sp, 4)) continue;
      if (dist(p, c2) < 11) continue;
      if (hall && p[0] > hall.bb[0] - 5 && p[0] < hall.bb[2] + 5 && p[1] > hall.bb[1] - 5 && p[1] < hall.bb[3] + 5) continue;
      cell.stalls.push(p[0], p[1], 5.2, 3.2, axis === 0 ? Math.PI / 2 : 0, rng.int(0, 6));
    }
  }
}
function layoutCathedral(B2, region) {
  const { cell, city } = B2;
  const c2 = centroid(region);
  const inner = homothety(region, c2, 0.72);
  cell.open.push({ poly: flat(inner), kind: "yard" });
  ring(B2, region, inner, "religious");
  const b = centralBuilding(B2, inner, city.params.identity === "ancient" ? "temple" : "cathedral", "religious", 0.84);
  if (b) {
    b.name = nameFor(b.type, B2.rng);
    graves(B2, inner, b.bb);
    const bb2 = b.bb;
    const along = bb2[2] - bb2[0] >= bb2[3] - bb2[1] ? [1, 0] : [0, 1];
    const perp = [-along[1], along[0]];
    const cc2 = [(bb2[0] + bb2[2]) / 2, (bb2[1] + bb2[3]) / 2];
    const half = (Math.abs(perp[0]) * (bb2[2] - bb2[0]) + Math.abs(perp[1]) * (bb2[3] - bb2[1])) / 2;
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
  const c2 = centroid(region);
  const inner = homothety(region, c2, rng.range(0.5, 0.62));
  cell.open.push({ poly: flat(inner), kind: "yard" });
  ring(B2, region, inner, "religious", ["church"]);
  const b = centralBuilding(B2, inner, "church", "religious", 0.5);
  if (b) {
    b.name = nameFor("church", rng);
    graves(B2, inner, b.bb);
  }
}
function layoutCastle(B2, region) {
  const { cell, city, rng } = B2;
  const wall = insetConvex(region, 3.6);
  const bailey = wall.length >= 3 ? insetConvex(wall, 3.4) : [];
  if (bailey.length < 3) return false;
  const mc = city.cells[city.marketCell].center;
  let gi = -1, gd = Infinity;
  for (let i = 0; i < wall.length; i++) {
    const a = wall[i], b = wall[(i + 1) % wall.length];
    const L = dist(a, b);
    if (L < 20) continue;
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
  const c2 = centroid(bailey);
  const inner = homothety(bailey, c2, 0.6);
  if (area(bailey) > 1500) ring(B2, bailey, inner, "citadel", [], (m2) => dist(m2, gm) < 26);
  const kr = homothety(inner, centroid(inner), 0.55);
  const keep = centralBuilding(B2, kr, "keep", "citadel", 0.95);
  if (keep) keep.name = "Keep";
  void rng;
  return true;
}
function layoutRing(B2, region) {
  const { cell, rng, city } = B2;
  const ward = cell.ward ?? "residential";
  const c2 = centroid(region);
  const inner = homothety(region, c2, ward === "military" ? rng.range(0.62, 0.7) : rng.range(0.68, 0.74));
  const kind = ward === "scholar" ? "lawn" : ward === "military" ? "parade" : ward === "religious" ? "cloister" : "garden";
  cell.open.push({ poly: flat(inner), kind });
  ring(B2, region, inner, ward);
  if (ward === "religious") {
    const b = centralBuilding(B2, inner, "church", ward, 0.55);
    if (b) b.name = nameFor("church", rng);
  } else if (ward === "noble") {
    centralBuilding(B2, inner, city.params.identity === "royal" ? "palace" : "manor", ward, 0.52);
  } else if (ward === "scholar") {
    city.features.push({ id: city.nextId++, type: rng.chance(0.5) ? "statue" : "fountain", p: c2, cell: cell.id });
  }
}
function dedupe(B2) {
  const list = B2.made;
  const polys = list.map((b) => b.parts.map(partPoly));
  const dead = /* @__PURE__ */ new Set();
  for (let i = 0; i < list.length; i++) {
    if (dead.has(i)) continue;
    for (let j2 = i + 1; j2 < list.length; j2++) {
      if (dead.has(j2)) continue;
      const a = list[i].bb, b = list[j2].bb;
      if (a[2] < b[0] || b[2] < a[0] || a[3] < b[1] || b[3] < a[1]) continue;
      let hit = false;
      for (const pa of polys[i]) {
        for (const pb of polys[j2]) if (satOverlap(pa, pb, 0.15)) hit = true;
        if (hit) break;
      }
      if (hit) {
        dead.add(j2);
        B2.stats.dropped++;
      }
    }
  }
  B2.made = list.filter((_, i) => !dead.has(i));
}
function buildCell(city, cell, stats2) {
  city.buildings = city.buildings.filter((b) => b.cell !== cell.id || b.manual);
  city.features = city.features.filter((f) => f.cell !== cell.id);
  cell.blocks = [];
  cell.open = [];
  cell.yards = [];
  cell.trees = [];
  cell.stalls = [];
  cell.graves = [];
  cell.fort = void 0;
  if (cell.kind !== "city" || cell.vids.length < 3) return;
  const rng = new RNG(`${city.seedUsed}|cell${cell.id}|v${cell.variant}`);
  const ward = cell.ward ?? "residential";
  const n = cell.vids.length;
  const fronts = [];
  const coast = [];
  for (let i = 0; i < n; i++) {
    const a = city.verts[cell.vids[i]], b = city.verts[cell.vids[(i + 1) % n]];
    const cls = city.edges[edgeKey(cell.vids[i], cell.vids[(i + 1) % n])];
    if (cls === "arterial" || cls === "secondary") fronts.push([a, b]);
    if (cls === "coast") coast.push([a, b]);
  }
  for (const c2 of cell.cuts) fronts.push([c2.a, c2.b]);
  const segs = [];
  for (let i = 0; i < n; i++) {
    const a = city.verts[cell.vids[i]], b2 = city.verts[cell.vids[(i + 1) % n]];
    const cls = city.edges[edgeKey(cell.vids[i], cell.vids[(i + 1) % n])];
    if (cls === "minor" || cls === "secondary" || cls === "arterial") segs.push([a, b2, (city.ew[edgeKey(cell.vids[i], cell.vids[(i + 1) % n])] ?? 4) / 2]);
    else if (cls === "wallO") segs.push([a, b2, WALL_T.outer / 2]);
    else if (cls === "wallI") segs.push([a, b2, WALL_T.inner / 2]);
  }
  const bd2 = city.params.buildingDensity;
  const B2 = {
    city,
    cell,
    rng,
    stats: stats2,
    fronts,
    coast,
    made: [],
    mills: 0,
    segs,
    mult: lerp(1.05, 0.45, bd2),
    gates: city.gates.map((g) => g.p)
  };
  const pieces = cellPieces(city, cell);
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
      const st = styleFor(city, ward);
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
  city.buildings.push(...B2.made);
}

// src/engine/validate.ts
function validateCity(city, stats2, attempts) {
  const errors = [];
  const warnings = [];
  const info = [];
  const cells = city.cells;
  const st = city.settlement;
  const cityCells = cells.filter((c2) => c2.kind === "city");
  if (cityCells.length < Math.max(3, st.blocks * 0.5)) errors.push(`Settlement too small (${cityCells.length} blocks)`);
  if (st.river && !city.river) errors.push("River requested but not generated");
  if (st.river && city.river && city.bridges.length === 0 && st.tierIndex >= 2) errors.push("River crosses the settlement without a bridge");
  const mainGates = city.gates.filter((g) => g.kind === "main");
  if (st.wall !== "none" && mainGates.length < 2) errors.push("Fewer than two city gates");
  const gateEdges = new Set(city.gates.map((g) => g.edge).filter(Boolean));
  const bridgeLinks = /* @__PURE__ */ new Map();
  for (const b of city.bridges) {
    const [x, y] = b.cells;
    bridgeLinks.set(x, [...bridgeLinks.get(x) ?? [], y]);
    bridgeLinks.set(y, [...bridgeLinks.get(y) ?? [], x]);
  }
  const hub = city.marketCell >= 0 ? city.marketCell : cityCells.slice().sort((a, b) => b.vids.length - a.vids.length)[0].id;
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
      const c2 = city.edges[k];
      if (c2 === "minor" || c2 === "secondary" || c2 === "arterial" || c2 === "wallI" && gateEdges.has(k)) next.push(n);
    }
    for (const n of next) if (!reached.has(n)) reached.add(n), q.push(n);
  }
  let badGates = 0;
  for (const g of mainGates) if (!cityCells.some((c2) => c2.vids.includes(g.vid) && reached.has(c2.id))) badGates++;
  if (badGates) errors.push(`${badGates} gate(s) not connected to the market by streets`);
  const isolated = cityCells.filter((c2) => !reached.has(c2.id)).length;
  if (isolated) errors.push(`${isolated} block(s) have no street access`);
  let noRoad = 0;
  for (const g of mainGates) if (!city.roads.some((r2) => r2.gate === g.vid)) noRoad++;
  if (noRoad) errors.push(`${noRoad} gate(s) lack an outer road`);
  if (st.market && city.marketCell >= 0 && !reached.has(city.marketCell)) errors.push("The market square is not reachable");
  if (!st.market && city.marketCell >= 0) errors.push("A market square was placed in a settlement without one");
  for (const [name, id] of [["Citadel", city.citadelCell], ["Cathedral", city.cathedralCell]]) {
    if (id < 0) {
      if (name === "Citadel" && st.citadel || name === "Cathedral" && st.cathedral) warnings.push(`${name} could not be placed`);
    } else if (!reached.has(id)) errors.push(`${name} is not accessible`);
  }
  const grid = /* @__PURE__ */ new Map();
  const GS = 60;
  city.buildings.forEach((b, i) => {
    for (let x = Math.floor(b.bb[0] / GS); x <= Math.floor(b.bb[2] / GS); x++)
      for (let y = Math.floor(b.bb[1] / GS); y <= Math.floor(b.bb[3] / GS); y++) {
        const k = x + "," + y;
        if (!grid.has(k)) grid.set(k, []);
        grid.get(k).push(i);
      }
  });
  const polys = city.buildings.map((b) => b.parts.map(partPoly));
  let overlaps = 0;
  const checked = /* @__PURE__ */ new Set();
  for (const list of grid.values())
    for (let i = 0; i < list.length; i++)
      for (let j2 = i + 1; j2 < list.length; j2++) {
        const a = list[i], b = list[j2];
        const key = a < b ? a + "_" + b : b + "_" + a;
        if (checked.has(key)) continue;
        checked.add(key);
        const A = city.buildings[a].bb, B2 = city.buildings[b].bb;
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
  city.buildings.forEach((b, i) => {
    if (!byCell.has(b.cell)) byCell.set(b.cell, []);
    byCell.get(b.cell).push(i);
  });
  for (const [ci, list] of byCell) {
    const cell = cells[ci];
    const pl = poly(city, cell);
    const n = cell.vids.length;
    const segs = [];
    for (let i = 0; i < n; i++) {
      const k = edgeKey(cell.vids[i], cell.vids[(i + 1) % n]);
      const c2 = city.edges[k];
      if (c2 === "minor" || c2 === "secondary" || c2 === "arterial") segs.push([pl[i], pl[(i + 1) % n], (city.ew[k] ?? 4) / 2 - 0.4]);
      else if (c2 === "wallO" || c2 === "wallI") segs.push([pl[i], pl[(i + 1) % n], 2]);
    }
    for (const cut of cell.cuts) segs.push([cut.a, cut.b, cut.w / 2 - 0.4]);
    for (const bi of list) {
      const b = city.buildings[bi];
      if (b.manual) continue;
      let bad = false, wet = false, out = false;
      for (const p of b.parts) {
        const pts = [];
        if (p.k === "c") pts.push([p.p[0], p.p[1]]);
        else for (let i = 0; i < 8; i += 2) pts.push([p.p[i], p.p[i + 1]]);
        for (const pt of pts) {
          for (const [a, c2, w] of segs) if (segDist(pt, a, c2) < w - (p.k === "c" ? p.p[2] * 0 : 0)) bad = true;
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
  for (const c2 of cells) if (c2.layout === "market" && st.market) {
    const pz = c2.open.find((o) => o.kind === "plaza");
    if (!pz) warnings.push("Market has no open plaza");
    else {
      const pts = [];
      for (let i = 0; i < pz.poly.length; i += 2) pts.push([pz.poly[i], pz.poly[i + 1]]);
      if (area(pts) < 700) warnings.push("Market square is small");
    }
  }
  const wh = city.buildings.filter((b) => b.type === "warehouse");
  if (wh.length) {
    let good = 0;
    for (const b of wh) {
      const c2 = [(b.bb[0] + b.bb[2]) / 2, (b.bb[1] + b.bb[3]) / 2];
      const dr = city.river ? nearestOn(city.river.pts, c2).d : 999;
      const dg = Math.min(...city.gates.map((g) => dist(g.p, c2)), 999);
      const cell = cells[b.cell];
      const cn = cell.nbrs.some((n) => n >= 0 && cells[n].kind === "sea");
      if (dr < 120 || dg < 160 || cn || cell.ward === "harbour" || cell.ward === "industrial") good++;
    }
    info.push(`${Math.round(100 * good / wh.length)}% of warehouses sit near trade routes/water`);
  }
  info.push(`Target ${st.population} souls, estimated ${st.population} inhabitants in ${city.buildings.length} buildings`);
  if (city.citadelCell >= 0) {
    const c2 = cells[city.citadelCell];
    info.push(`Citadel at depth ${c2.depth}, ground ${c2.elev.toFixed(2)}`);
  }
  if (stats2.repaired) info.push(`${stats2.repaired} footprint(s) auto-repaired (shrunk to clear water)`);
  if (stats2.dropped) info.push(`${stats2.dropped} unrepairable footprint(s) skipped`);
  return {
    errors,
    warnings,
    info,
    attempts,
    stats: {
      cells: cityCells.length,
      buildings: city.buildings.length,
      districts: city.districts.length,
      gates: city.gates.length,
      bridges: city.bridges.length,
      towers: city.towers.length,
      repaired: stats2.repaired,
      dropped: stats2.dropped
    }
  };
}

// src/engine/generate.ts
function generateOnce(params, seed, attempt) {
  const { ctx } = createCtx(params, seed);
  const city = ctx.city;
  buildMesh(ctx);
  if (!makeRiver(ctx)) throw new Error("river routing failed");
  selectCity(ctx);
  classifyEdges(ctx);
  chooseMarket(ctx);
  buildInnerWall(ctx);
  planGates(ctx);
  const plans = planBridges(ctx);
  chooseAnchors(ctx);
  routeStreets(ctx, plans, [city.citadelCell, city.cathedralCell].filter((x) => x >= 0));
  assignDistricts(ctx);
  assignWidths(ctx);
  planPlazas(ctx);
  buildWalls(ctx);
  buildHarbour(ctx);
  finalizeGround(ctx);
  const stats2 = { repaired: 0, dropped: 0 };
  for (const c2 of city.cells) if (c2.kind === "city") buildCell(city, c2, stats2);
  buildSuburbs(ctx);
  buildFeaturesAndDecor(ctx);
  city.name = params.name.trim() || cityName(new RNG(params.seed + "#name"));
  city.settlement.population = estimatePopulation(city.buildings);
  city.report = validateCity(city, stats2, attempt);
  return city;
}
function generateCity(params = DEFAULT_PARAMS) {
  let best = null;
  let lastErr = null;
  const MAX = 10;
  for (let attempt = 0; attempt < MAX; attempt++) {
    const seed = attempt === 0 ? params.seed : `${params.seed}~${attempt}`;
    try {
      const c2 = generateOnce(params, seed, attempt + 1);
      if (!best || c2.report.errors.length < best.report.errors.length) best = c2;
      if (c2.report.errors.length === 0) return c2;
    } catch (e) {
      lastErr = e;
    }
  }
  if (best) return best;
  throw lastErr ?? new Error("generation failed");
}

// src/engine/render.ts
var invalidate = (b) => {
  delete b._c;
};

// src/engine/edit.ts
var stats = () => ({ repaired: 0, dropped: 0 });
var touch = (city) => {
  delete city._grid;
};
function revalidate(city) {
  const att = city.report.attempts;
  city.report = validateCity(city, { repaired: city.report.stats.repaired ?? 0, dropped: city.report.stats.dropped ?? 0 }, att);
}
function refreshCell(city, c2) {
  delete c2._bb;
  if (c2.kind === "city") c2.ground = flat(poly(city, c2));
}
function rebuildCells(city, ids) {
  const st = stats();
  for (const id of ids) {
    const c2 = city.cells[id];
    refreshCell(city, c2);
    buildCell(city, c2, st);
  }
  for (const b of city.buildings) invalidate(b);
  touch(city);
  revalidate(city);
}
function vertexMovable(city, vid) {
  if (city.river?.vids.includes(vid)) return false;
  const inc = city.cells.filter((c2) => c2.vids.includes(vid));
  if (inc.length < 3) return false;
  for (const c2 of inc) {
    if (c2.kind !== "city" || c2.locked) return false;
    const n = c2.vids.length;
    for (let i = 0; i < n; i++) {
      if (c2.vids[i] !== vid) continue;
      for (const j2 of [i, (i - 1 + n) % n]) {
        const cls = city.edges[edgeKey(c2.vids[j2], c2.vids[(j2 + 1) % n])];
        if (cls !== "minor" && cls !== "secondary" && cls !== "arterial") return false;
      }
    }
  }
  return !city.gates.some((g) => g.vid === vid);
}
function moveVertex(city, vid, p) {
  if (!vertexMovable(city, vid)) return false;
  const old = city.verts[vid];
  const inc = city.cells.filter((c2) => c2.vids.includes(vid));
  city.verts[vid] = [p[0], p[1]];
  for (const c2 of inc) {
    const pl = poly(city, c2);
    if (area(pl) < 1200 || area(pl) <= 0 || !simplePoly(pl)) {
      city.verts[vid] = old;
      return false;
    }
  }
  const pz = city.plazas.find((x) => x.vid === vid);
  for (const f of city.features) if (pz && f.p === old) f.p = city.verts[vid];
  for (const c2 of inc) c2.center = centroid(poly(city, c2));
  rebuildCells(city, inc.map((c2) => c2.id));
  return true;
}
function segX(a, b, c2, d) {
  const o = (p, q, r2) => Math.sign((q[0] - p[0]) * (r2[1] - p[1]) - (q[1] - p[1]) * (r2[0] - p[0]));
  return o(a, b, c2) * o(a, b, d) < 0 && o(c2, d, a) * o(c2, d, b) < 0;
}
function simplePoly(pl) {
  const n = pl.length;
  for (let i = 0; i < n; i++)
    for (let j2 = i + 2; j2 < n; j2++) {
      if (i === 0 && j2 === n - 1) continue;
      if (segX(pl[i], pl[(i + 1) % n], pl[j2], pl[(j2 + 1) % n])) return false;
    }
  return true;
}

// src/engine/export.ts
var SCHEMA_VERSION = 3;
var MIGRATIONS = {
  // v2 -> v3: settlements became population-driven
  2: (c2) => {
    c2.params = { ...DEFAULT_PARAMS, ...c2.params };
    c2.settlement = settlementFor(c2.params);
  },
  // v1 -> v2: harbour quays list, posterns introduced, cells may be concave
  1: (c2) => {
    c2.quays ??= [];
    for (const g of c2.gates ?? []) g.kind ??= "main";
    for (const cell of c2.cells ?? []) for (const k of ["blocks", "open", "cuts", "yards", "trees", "stalls", "graves"]) cell[k] ??= [];
  }
};
function migrate(c2, from) {
  for (let v2 = from; v2 < SCHEMA_VERSION; v2++) MIGRATIONS[v2]?.(c2);
  c2.version = SCHEMA_VERSION;
  return c2;
}
var strip = (k, v2) => k.startsWith("_") ? void 0 : typeof v2 === "number" ? Math.round(v2 * 100) / 100 : v2;
function exportJSON(city) {
  return JSON.stringify({ format: "medieval-city-generator", version: SCHEMA_VERSION, city }, strip);
}
function snapshot(city) {
  return JSON.stringify(city, (k, v2) => k.startsWith("_") ? void 0 : v2);
}
function restore(s) {
  return JSON.parse(s);
}
function importJSON(text) {
  const o = JSON.parse(text);
  const c2 = o?.city;
  if (o?.format !== "medieval-city-generator" || !c2 || !Array.isArray(c2.cells) || !Array.isArray(c2.verts) || !Array.isArray(c2.buildings)) throw new Error("Not a Medieval City Generator project file");
  const from = Number(o.version ?? c2.version ?? 1);
  if (from > SCHEMA_VERSION) throw new Error(`Project was saved by a newer version (schema ${from})`);
  migrate(c2, from);
  c2.params = { ...DEFAULT_PARAMS, ...c2.params };
  if (!c2.settlement) c2.settlement = settlementFor(c2.params);
  return c2;
}

// scripts/new-test.ts
var c = generateCity({ ...DEFAULT_PARAMS, seed: "concave", identity: "merchant" });
var s0 = snapshot(c);
var concave = 0;
var tried = 0;
for (let v2 = 0; v2 < c.verts.length && concave < 4; v2++) {
  if (!vertexMovable(c, v2)) continue;
  const inc = c.cells.filter((x) => x.vids.includes(v2));
  const cen = inc[0].center, p = c.verts[v2];
  tried++;
  if (moveVertex(c, v2, [p[0] + (cen[0] - p[0]) * 0.55, p[1] + (cen[1] - p[1]) * 0.55])) {
    if (c.cells.filter((x) => x.vids.includes(v2)).some((x) => !isConvex(poly(c, x)))) concave++;
  }
}
console.log("tried", tried, "concave edits", concave, "errors", c.report.errors, "buildings", c.buildings.length);
var r = restore(s0);
console.log("undo restore buildings", r.buildings.length, "verts equal", JSON.stringify(r.verts) === JSON.stringify(JSON.parse(s0).verts));
var j = JSON.parse(exportJSON(c));
j.version = 1;
delete j.city.quays;
j.city.version = 1;
var m = importJSON(JSON.stringify(j));
console.log("migrated version", m.version, "quays", Array.isArray(m.quays));
