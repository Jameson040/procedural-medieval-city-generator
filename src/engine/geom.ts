// Geometry kernel. Polygons are arrays of [x,y], CCW (positive signed area) unless noted.
export type Pt = [number, number];

export const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const smooth = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
export const dist = (a: Pt, b: Pt) => Math.hypot(a[0] - b[0], a[1] - b[1]);
export const sub = (a: Pt, b: Pt): Pt => [a[0] - b[0], a[1] - b[1]];
export const add = (a: Pt, b: Pt): Pt => [a[0] + b[0], a[1] + b[1]];
export const mul = (a: Pt, k: number): Pt => [a[0] * k, a[1] * k];
export const mid = (a: Pt, b: Pt): Pt => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
export const unit = (a: Pt): Pt => {
  const l = Math.hypot(a[0], a[1]) || 1;
  return [a[0] / l, a[1] / l];
};
export const rot = (a: Pt, ang: number): Pt => {
  const c = Math.cos(ang),
    s = Math.sin(ang);
  return [a[0] * c - a[1] * s, a[0] * s + a[1] * c];
};

export function area(poly: Pt[]): number {
  let s = 0;
  for (let i = 0, n = poly.length; i < n; i++) {
    const a = poly[i],
      b = poly[(i + 1) % n];
    s += a[0] * b[1] - b[0] * a[1];
  }
  return s / 2;
}

export function centroid(poly: Pt[]): Pt {
  let a = 0,
    cx = 0,
    cy = 0;
  const n = poly.length;
  for (let i = 0; i < n; i++) {
    const p = poly[i],
      q = poly[(i + 1) % n];
    const f = p[0] * q[1] - q[0] * p[1];
    a += f;
    cx += (p[0] + q[0]) * f;
    cy += (p[1] + q[1]) * f;
  }
  if (Math.abs(a) < 1e-9) {
    let mx = 0,
      my = 0;
    for (const p of poly) {
      mx += p[0];
      my += p[1];
    }
    return [mx / (n || 1), my / (n || 1)];
  }
  return [cx / (3 * a), cy / (3 * a)];
}

export function bbox(poly: ArrayLike<Pt> | number[], flat = false): [number, number, number, number] {
  let x0 = Infinity,
    y0 = Infinity,
    x1 = -Infinity,
    y1 = -Infinity;
  if (flat) {
    const f = poly as number[];
    for (let i = 0; i < f.length; i += 2) {
      x0 = Math.min(x0, f[i]);
      x1 = Math.max(x1, f[i]);
      y0 = Math.min(y0, f[i + 1]);
      y1 = Math.max(y1, f[i + 1]);
    }
  } else {
    for (let i = 0; i < (poly as Pt[]).length; i++) {
      const p = (poly as Pt[])[i];
      x0 = Math.min(x0, p[0]);
      x1 = Math.max(x1, p[0]);
      y0 = Math.min(y0, p[1]);
      y1 = Math.max(y1, p[1]);
    }
  }
  return [x0, y0, x1, y1];
}

export function pointInPoly(p: Pt, poly: Pt[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i],
      b = poly[j];
    if (a[1] > p[1] !== b[1] > p[1] && p[0] < ((b[0] - a[0]) * (p[1] - a[1])) / (b[1] - a[1]) + a[0]) inside = !inside;
  }
  return inside;
}

export function pointInFlat(x: number, y: number, f: number[]): boolean {
  let inside = false;
  const n = f.length / 2;
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const ax = f[i * 2],
      ay = f[i * 2 + 1],
      bx = f[j * 2],
      by = f[j * 2 + 1];
    if (ay > y !== by > y && x < ((bx - ax) * (y - ay)) / (by - ay) + ax) inside = !inside;
  }
  return inside;
}

/** inside test for convex CCW polygon with tolerance (eps>0 permits slight outside) */
export function pointInConvex(p: Pt, poly: Pt[], eps = 0): boolean {
  for (let i = 0, n = poly.length; i < n; i++) {
    const a = poly[i],
      b = poly[(i + 1) % n];
    const cr = (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]);
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    if (cr / l < -eps) return false;
  }
  return true;
}

export function cleanPoly(poly: Pt[], eps = 1e-3): Pt[] {
  const out: Pt[] = [];
  for (const p of poly) {
    const q = out[out.length - 1];
    if (!q || Math.abs(q[0] - p[0]) > eps || Math.abs(q[1] - p[1]) > eps) out.push(p);
  }
  while (out.length > 1 && Math.abs(out[0][0] - out[out.length - 1][0]) <= eps && Math.abs(out[0][1] - out[out.length - 1][1]) <= eps) out.pop();
  return out;
}

/** keep the half-plane  nx*x+ny*y >= c  */
export function clipPlane(poly: Pt[], nx: number, ny: number, c: number): Pt[] {
  const out: Pt[] = [];
  const n = poly.length;
  for (let i = 0; i < n; i++) {
    const a = poly[i],
      b = poly[(i + 1) % n];
    const da = nx * a[0] + ny * a[1] - c,
      db = nx * b[0] + ny * b[1] - c;
    if (da >= 0) out.push(a);
    if (da >= 0 !== db >= 0) {
      const t = da / (da - db);
      out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
    }
  }
  return cleanPoly(out);
}

/** Inset a (convex) CCW polygon by a per-edge distance. */
export function insetConvex(poly: Pt[], d: number[] | number): Pt[] {
  let out = poly;
  const n = poly.length;
  for (let i = 0; i < n; i++) {
    const dd = typeof d === 'number' ? d : d[i];
    if (!dd) continue;
    const a = poly[i],
      b = poly[(i + 1) % n];
    const ex = b[0] - a[0],
      ey = b[1] - a[1];
    const L = Math.hypot(ex, ey);
    if (L < 1e-9) continue;
    const nx = -ey / L,
      ny = ex / L;
    out = clipPlane(out, nx, ny, nx * a[0] + ny * a[1] + dd);
    if (out.length < 3) return [];
  }
  return out.length >= 3 ? out : [];
}

/** Split convex polygon with a line through p (dir d), leaving a gap of `gap` between the halves. */
export function splitConvex(poly: Pt[], p: Pt, d: Pt, gap: number): [Pt[], Pt[]] {
  const nx = -d[1],
    ny = d[0];
  const c = nx * p[0] + ny * p[1];
  const A = clipPlane(poly, nx, ny, c + gap / 2);
  const B = clipPlane(poly, -nx, -ny, -c + gap / 2);
  return [A.length >= 3 ? A : [], B.length >= 3 ? B : []];
}

export function rayHit(poly: Pt[], o: Pt, d: Pt): { t: number; i: number; s: number; p: Pt } | null {
  let best: { t: number; i: number; s: number; p: Pt } | null = null;
  const n = poly.length;
  for (let i = 0; i < n; i++) {
    const a = poly[i],
      b = poly[(i + 1) % n];
    const ex = b[0] - a[0],
      ey = b[1] - a[1];
    const den = d[0] * ey - d[1] * ex;
    if (Math.abs(den) < 1e-12) continue;
    const ox = a[0] - o[0],
      oy = a[1] - o[1];
    const t = (ox * ey - oy * ex) / den;
    const s = (ox * d[1] - oy * d[0]) / den;
    if (t > 1e-3 && s >= -1e-9 && s <= 1 + 1e-9 && (!best || t < best.t)) best = { t, i, s, p: [o[0] + d[0] * t, o[1] + d[1] * t] };
  }
  return best;
}

/** parametric range [t0,t1] of the line o+t*d inside a convex CCW polygon */
export function clipLineConvex(poly: Pt[], o: Pt, d: Pt): [number, number] | null {
  let t0 = -1e9,
    t1 = 1e9;
  const n = poly.length;
  for (let i = 0; i < n; i++) {
    const a = poly[i],
      b = poly[(i + 1) % n];
    const nx = -(b[1] - a[1]),
      ny = b[0] - a[0];
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

export function homothety(poly: Pt[], c: Pt, k: number): Pt[] {
  return poly.map((p) => [c[0] + (p[0] - c[0]) * k, c[1] + (p[1] - c[1]) * k] as Pt);
}

export function rectPts(cx: number, cy: number, w: number, h: number, a: number): number[] {
  const c = Math.cos(a),
    s = Math.sin(a);
  const hw = w / 2,
    hh = h / 2;
  const pts: number[] = [];
  for (const [u, v] of [
    [-hw, -hh],
    [hw, -hh],
    [hw, hh],
    [-hw, hh],
  ]) {
    pts.push(cx + u * c - v * s, cy + u * s + v * c);
  }
  return pts;
}

export interface Rect {
  cx: number;
  cy: number;
  w: number;
  h: number;
  a: number;
}

export function obb(poly: Pt[]): Rect {
  let best: Rect | null = null;
  let bestA = Infinity;
  const n = poly.length;
  for (let i = 0; i < n; i++) {
    const a = poly[i],
      b = poly[(i + 1) % n];
    const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
    const c = Math.cos(ang),
      s = Math.sin(ang);
    let u0 = Infinity,
      u1 = -Infinity,
      v0 = Infinity,
      v1 = -Infinity;
    for (const p of poly) {
      const u = p[0] * c + p[1] * s,
        v = -p[0] * s + p[1] * c;
      u0 = Math.min(u0, u);
      u1 = Math.max(u1, u);
      v0 = Math.min(v0, v);
      v1 = Math.max(v1, v);
    }
    const ar = (u1 - u0) * (v1 - v0);
    if (ar < bestA) {
      bestA = ar;
      const um = (u0 + u1) / 2,
        vm = (v0 + v1) / 2;
      best = { cx: um * c - vm * s, cy: um * s + vm * c, w: u1 - u0, h: v1 - v0, a: ang };
    }
  }
  return best ?? { cx: 0, cy: 0, w: 0, h: 0, a: 0 };
}

/** Largest OBB-aligned rectangle (scaled about the box centre) that fits entirely in a convex polygon. */
export function fitRect(poly: Pt[], fill = 0.94, wFrac = 1, hFrac = 1): Rect | null {
  const o = obb(poly);
  let cen: Pt = [o.cx, o.cy];
  if (!pointInConvex(cen, poly)) cen = centroid(poly);
  const c = Math.cos(o.a),
    s = Math.sin(o.a);
  const ok = (k: number) => {
    for (const [su, sv] of [
      [-1, -1],
      [1, -1],
      [1, 1],
      [-1, 1],
    ]) {
      const du = (su * o.w * wFrac * k) / 2,
        dv = (sv * o.h * hFrac * k) / 2;
      const p: Pt = [cen[0] + du * c - dv * s, cen[1] + du * s + dv * c];
      if (!pointInConvex(p, poly, 0.02)) return false;
    }
    return true;
  };
  let k = 1;
  if (!ok(1)) {
    let lo = 0.04,
      hi = 1;
    if (!ok(lo)) return null;
    for (let i = 0; i < 14; i++) {
      const m = (lo + hi) / 2;
      if (ok(m)) lo = m;
      else hi = m;
    }
    k = lo;
  }
  return { cx: cen[0], cy: cen[1], w: o.w * wFrac * k * fill, h: o.h * hFrac * k * fill, a: o.a };
}

export interface FrontageResult extends Rect {
  frontageEdge: [Pt, Pt];
  backyard?: Pt[];
}

/**
 * Fits a street-frontage anchored burgage footprint inside a convex CCW plot.
 * Anchored against the street frontage edge [f0, f1], width spans along frontage,
 * and depth extends into the plot, leaving the rear as a private backyard.
 */
export function fitFrontageRect(
  plot: Pt[],
  f0: Pt,
  f1: Pt,
  targetDepth: number,
  sideMargin = 0.45,
  setback = 0.35,
  maxWidth = 0
): FrontageResult | null {
  const fl = dist(f0, f1);
  if (fl < 4.0) return null;

  const ex = f1[0] - f0[0],
    ey = f1[1] - f0[1];
  const T: Pt = [ex / fl, ey / fl];
  // Inward normal for CCW polygon: (-ey, ex)
  const N: Pt = [-T[1], T[0]];
  const ang = Math.atan2(T[1], T[0]);
  const fMid: Pt = [(f0[0] + f1[0]) / 2, (f0[1] + f1[1]) / 2];

  let bw = Math.max(3.2, fl - 2 * sideMargin);
  if (maxWidth > 0 && bw > maxWidth) bw = maxWidth;
  let hw = bw / 2;

  // Verify front corners inside plot
  const okFront = (cur_hw: number) => {
    const fl_pt: Pt = [fMid[0] - T[0] * cur_hw + N[0] * setback, fMid[1] - T[1] * cur_hw + N[1] * setback];
    const fr_pt: Pt = [fMid[0] + T[0] * cur_hw + N[0] * setback, fMid[1] + T[1] * cur_hw + N[1] * setback];
    return pointInConvex(fl_pt, plot, 0.04) && pointInConvex(fr_pt, plot, 0.04);
  };

  if (!okFront(hw)) {
    hw = hw * 0.85;
    if (!okFront(hw)) {
      hw = hw * 0.82;
      if (!okFront(hw)) return null;
    }
  }

  // Check if depth fits
  const okDepth = (d: number, cur_hw: number) => {
    const bl: Pt = [fMid[0] - T[0] * cur_hw + N[0] * (setback + d), fMid[1] - T[1] * cur_hw + N[1] * (setback + d)];
    const br: Pt = [fMid[0] + T[0] * cur_hw + N[0] * (setback + d), fMid[1] + T[1] * cur_hw + N[1] * (setback + d)];
    return pointInConvex(bl, plot, 0.02) && pointInConvex(br, plot, 0.02);
  };

  if (!okDepth(3.2, hw)) {
    hw = hw * 0.82;
    if (!okDepth(3.2, hw)) return null;
  }

  let lo = 3.2,
    hi = Math.max(3.2, targetDepth);
  if (!okDepth(hi, hw)) {
    for (let it = 0; it < 12; it++) {
      const m = (lo + hi) / 2;
      if (okDepth(m, hw)) lo = m;
      else hi = m;
    }
  } else {
    lo = hi;
  }

  const bd = lo;
  if (bd < 3.2) return null;

  const actual_w = hw * 2;
  const cx = fMid[0] + N[0] * (setback + bd / 2);
  const cy = fMid[1] + N[1] * (setback + bd / 2);

  // Remaining backyard polygon behind building
  const backC = N[0] * (fMid[0] + N[0] * (setback + bd + 0.25)) + N[1] * (fMid[1] + N[1] * (setback + bd + 0.25));
  const backyard = cleanPoly(clipPlane(plot, N[0], N[1], backC));

  return {
    cx,
    cy,
    w: actual_w,
    h: bd,
    a: ang,
    frontageEdge: [f0, f1],
    backyard: backyard.length >= 3 && area(backyard) > 16 ? backyard : undefined,
  };
}

export function octagon(x: number, y: number, r: number): number[] {
  const out: number[] = [];
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
    out.push(x + Math.cos(a) * r, y + Math.sin(a) * r);
  }
  return out;
}

/** SAT overlap of two convex flat polygons. Returns penetration > eps. */
export function satOverlap(A: number[], B: number[], eps = 0.05): boolean {
  for (const P of [A, B]) {
    const n = P.length / 2;
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      const ex = P[j * 2] - P[i * 2],
        ey = P[j * 2 + 1] - P[i * 2 + 1];
      const l = Math.hypot(ex, ey) || 1;
      const nx = -ey / l,
        ny = ex / l;
      let a0 = Infinity,
        a1 = -Infinity,
        b0 = Infinity,
        b1 = -Infinity;
      for (let k = 0; k < A.length; k += 2) {
        const v = A[k] * nx + A[k + 1] * ny;
        a0 = Math.min(a0, v);
        a1 = Math.max(a1, v);
      }
      for (let k = 0; k < B.length; k += 2) {
        const v = B[k] * nx + B[k + 1] * ny;
        b0 = Math.min(b0, v);
        b1 = Math.max(b1, v);
      }
      if (a1 <= b0 + eps || b1 <= a0 + eps) return false;
    }
  }
  return true;
}

export function segDist(p: Pt, a: Pt, b: Pt): number {
  const ex = b[0] - a[0],
    ey = b[1] - a[1];
  const l2 = ex * ex + ey * ey;
  let t = l2 > 0 ? ((p[0] - a[0]) * ex + (p[1] - a[1]) * ey) / l2 : 0;
  t = clamp(t, 0, 1);
  return Math.hypot(p[0] - (a[0] + ex * t), p[1] - (a[1] + ey * t));
}

export function polylineNearest(p: Pt, pts: Pt[]): { d: number; i: number; q: Pt } {
  let best = { d: Infinity, i: 0, q: [0, 0] as Pt };
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i],
      b = pts[i + 1];
    const ex = b[0] - a[0],
      ey = b[1] - a[1];
    const l2 = ex * ex + ey * ey;
    const t = l2 > 0 ? clamp(((p[0] - a[0]) * ex + (p[1] - a[1]) * ey) / l2, 0, 1) : 0;
    const q: Pt = [a[0] + ex * t, a[1] + ey * t];
    const d = Math.hypot(p[0] - q[0], p[1] - q[1]);
    if (d < best.d) best = { d, i, q };
  }
  return best;
}

export function chaikin(pts: Pt[], iter: number, q = 0.25): Pt[] {
  let cur = pts;
  for (let it = 0; it < iter; it++) {
    if (cur.length < 3) break;
    const out: Pt[] = [cur[0]];
    for (let i = 0; i < cur.length - 1; i++) {
      const a = cur[i],
        b = cur[i + 1];
      out.push([a[0] + (b[0] - a[0]) * q, a[1] + (b[1] - a[1]) * q]);
      out.push([a[0] + (b[0] - a[0]) * (1 - q), a[1] + (b[1] - a[1]) * (1 - q)]);
    }
    out.push(cur[cur.length - 1]);
    cur = out;
  }
  return cur;
}

export function isConvex(poly: Pt[]): boolean {
  const n = poly.length;
  for (let i = 0; i < n; i++) {
    const a = poly[i],
      b = poly[(i + 1) % n],
      c = poly[(i + 2) % n];
    if ((b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0]) < -1e-6) return false;
  }
  return true;
}

export const flat = (poly: Pt[]): number[] => {
  const o: number[] = [];
  for (const p of poly) o.push(p[0], p[1]);
  return o;
};
export const unflat = (f: number[]): Pt[] => {
  const o: Pt[] = [];
  for (let i = 0; i < f.length; i += 2) o.push([f[i], f[i + 1]]);
  return o;
};

/** Spatially-indexed nearest-point queries on a polyline (cached per array). */
class PolyIndex {
  private grid = new Map<number, number[]>();
  private cs = 40;
  constructor(private pts: Pt[]) {
    const cs = this.cs;
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i],
        b = pts[i + 1];
      for (let x = Math.floor(Math.min(a[0], b[0]) / cs); x <= Math.floor(Math.max(a[0], b[0]) / cs); x++)
        for (let y = Math.floor(Math.min(a[1], b[1]) / cs); y <= Math.floor(Math.max(a[1], b[1]) / cs); y++) {
          const k = (x + 2000) * 8192 + (y + 2000);
          const l = this.grid.get(k);
          if (l) l.push(i);
          else this.grid.set(k, [i]);
        }
    }
  }
  nearest(p: Pt): { d: number; i: number; q: Pt } {
    const cs = this.cs,
      pts = this.pts;
    const gx = Math.floor(p[0] / cs),
      gy = Math.floor(p[1] / cs);
    let best = { d: Infinity, i: 0, q: [0, 0] as Pt };
    for (let r = 0; r <= 5; r++) {
      for (let dx = -r; dx <= r; dx++)
        for (let dy = -r; dy <= r; dy++) {
          if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
          const l = this.grid.get((gx + dx + 2000) * 8192 + (gy + dy + 2000));
          if (!l) continue;
          for (const i of l) {
            const a = pts[i],
              b = pts[i + 1];
            const ex = b[0] - a[0],
              ey = b[1] - a[1];
            const l2 = ex * ex + ey * ey;
            const t = l2 > 0 ? clamp(((p[0] - a[0]) * ex + (p[1] - a[1]) * ey) / l2, 0, 1) : 0;
            const qx = a[0] + ex * t,
              qy = a[1] + ey * t;
            const d = Math.hypot(p[0] - qx, p[1] - qy);
            if (d < best.d) best = { d, i, q: [qx, qy] };
          }
        }
      if (best.d <= r * cs) break;
    }
    return best;
  }
}
const polyIdx = new WeakMap<Pt[], PolyIndex>();
export function nearestOn(pts: Pt[], p: Pt) {
  let ix = polyIdx.get(pts);
  if (!ix) polyIdx.set(pts, (ix = new PolyIndex(pts)));
  return ix.nearest(p);
}

/** Largest rectangle with a given orientation (scaled about the centroid) that fits inside a convex polygon. */
export function fitRectAngle(poly: Pt[], ang: number, fill = 0.94): Rect | null {
  const c = Math.cos(ang), s = Math.sin(ang);
  const cen = centroid(poly);
  let u0 = Infinity, u1 = -Infinity, v0 = Infinity, v1 = -Infinity;
  for (const p of poly) {
    const dx = p[0] - cen[0], dy = p[1] - cen[1];
    const u = dx * c + dy * s, v = -dx * s + dy * c;
    u0 = Math.min(u0, u); u1 = Math.max(u1, u); v0 = Math.min(v0, v); v1 = Math.max(v1, v);
  }
  const W = 2 * Math.min(-u0, u1), H = 2 * Math.min(-v0, v1);
  const ok = (k: number) => {
    for (const [su, sv] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
      const du = (su * W * k) / 2, dv = (sv * H * k) / 2;
      if (!pointInConvex([cen[0] + du * c - dv * s, cen[1] + du * s + dv * c], poly, 0.02)) return false;
    }
    return true;
  };
  if (!ok(0.05)) return null;
  let lo = 0.05, hi = 1;
  if (ok(1)) lo = 1;
  else for (let i = 0; i < 14; i++) { const m = (lo + hi) / 2; if (ok(m)) lo = m; else hi = m; }
  return { cx: cen[0], cy: cen[1], w: W * lo * fill, h: H * lo * fill, a: ang };
}
