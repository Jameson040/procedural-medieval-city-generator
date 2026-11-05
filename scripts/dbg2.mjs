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
      const d = dist(cx, cy, coords[2 * i], coords[2 * i + 1]);
      if (d < minDist) {
        i0 = i;
        minDist = d;
      }
    }
    const i0x = coords[2 * i0];
    const i0y = coords[2 * i0 + 1];
    for (let i = 0, minDist = Infinity; i < n; i++) {
      if (i === i0) continue;
      const d = dist(i0x, i0y, coords[2 * i], coords[2 * i + 1]);
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
      const r = circumradius(i0x, i0y, i1x, i1y, coords[2 * i], coords[2 * i + 1]);
      if (r < minRadius) {
        i2 = i;
        minRadius = r;
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
      this._dists[i] = dist(coords[2 * i], coords[2 * i + 1], center.x, center.y);
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
function dist(ax, ay, bx, by) {
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
  arc(x, y, r) {
    x = +x, y = +y, r = +r;
    const x0 = x + r;
    const y0 = y;
    if (r < 0) throw new Error("negative radius");
    if (this._x1 === null) this._ += `M${x0},${y0}`;
    else if (Math.abs(this._x1 - x0) > epsilon2 || Math.abs(this._y1 - y0) > epsilon2) this._ += "L" + x0 + "," + y0;
    if (!r) return;
    this._ += `A${r},${r},0,1,1,${x - r},${y}A${r},${r},0,1,1,${this._x1 = x0},${this._y1 = y0}`;
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
      circumcenters[j] = x;
      circumcenters[j + 1] = y;
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
    let x0, y0, x1 = points[n - 2], y1 = points[n - 1];
    let c0, c1 = this._regioncode(x1, y1);
    let e0, e1 = 0;
    for (let j = 0; j < n; j += 2) {
      x0 = x1, y0 = y1, x1 = points[j], y1 = points[j + 1];
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
      let x, y, c = c0 || c1;
      if (c & 8) x = x0 + (x1 - x0) * (this.ymax - y0) / (y1 - y0), y = this.ymax;
      else if (c & 4) x = x0 + (x1 - x0) * (this.ymin - y0) / (y1 - y0), y = this.ymin;
      else if (c & 2) y = y0 + (y1 - y0) * (this.xmax - x0) / (x1 - x0), x = this.xmax;
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
  _project(x0, y0, vx, vy) {
    let t = Infinity, c, x, y;
    if (vy < 0) {
      if (y0 <= this.ymin) return null;
      if ((c = (this.ymin - y0) / vy) < t) y = this.ymin, x = x0 + (t = c) * vx;
    } else if (vy > 0) {
      if (y0 >= this.ymax) return null;
      if ((c = (this.ymax - y0) / vy) < t) y = this.ymax, x = x0 + (t = c) * vx;
    }
    if (vx > 0) {
      if (x0 >= this.xmax) return null;
      if ((c = (this.xmax - x0) / vx) < t) x = this.xmax, y = y0 + (t = c) * vy;
    } else if (vx < 0) {
      if (x0 <= this.xmin) return null;
      if ((c = (this.xmin - x0) / vx) < t) x = this.xmin, y = y0 + (t = c) * vy;
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
function jitter(x, y, r) {
  return [x + Math.sin(x + y) * r, y + Math.cos(x - y) * r];
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
      const e = this.collinear[0], f = this.collinear[this.collinear.length - 1], bounds = [points[2 * e], points[2 * e + 1], points[2 * f], points[2 * f + 1]], r = 1e-8 * Math.hypot(bounds[3] - bounds[1], bounds[2] - bounds[0]);
      for (let i = 0, n = points.length / 2; i < n; ++i) {
        const p = jitter(points[2 * i], points[2 * i + 1], r);
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
  renderPoints(context, r) {
    if (r === void 0 && (!context || typeof context.moveTo !== "function")) r = context, context = null;
    r = r == void 0 ? 2 : +r;
    const buffer = context == null ? context = new Path() : void 0;
    const { points } = this;
    for (let i = 0, n = points.length; i < n; i += 2) {
      const x = points[i], y = points[i + 1];
      context.moveTo(x + r, y);
      context.arc(x, y, r, 0, tau);
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
    let r = this.next() * tot;
    for (const it of items) {
      r -= Math.max(0, it[1]);
      if (r <= 0) return it[0];
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
    const a = this.h(ix, iy), b = this.h(ix + 1, iy), c = this.h(ix, iy + 1), d = this.h(ix + 1, iy + 1);
    return a + (b - a) * u4 + (c - a) * v2 + (a - b - c + d) * u4 * v2;
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

// src/engine/geom.ts
var clamp = (v2, a, b) => Math.max(a, Math.min(b, v2));
var lerp = (a, b, t) => a + (b - a) * t;
var smooth = (a, b, v2) => {
  const t = clamp((v2 - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
function area(poly) {
  let s = 0;
  for (let i = 0, n = poly.length; i < n; i++) {
    const a = poly[i], b = poly[(i + 1) % n];
    s += a[0] * b[1] - b[0] * a[1];
  }
  return s / 2;
}
function centroid(poly) {
  let a = 0, cx = 0, cy = 0;
  const n = poly.length;
  for (let i = 0; i < n; i++) {
    const p = poly[i], q = poly[(i + 1) % n];
    const f = p[0] * q[1] - q[0] * p[1];
    a += f;
    cx += (p[0] + q[0]) * f;
    cy += (p[1] + q[1]) * f;
  }
  if (Math.abs(a) < 1e-9) {
    let mx = 0, my = 0;
    for (const p of poly) {
      mx += p[0];
      my += p[1];
    }
    return [mx / (n || 1), my / (n || 1)];
  }
  return [cx / (3 * a), cy / (3 * a)];
}

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
  const cellArea = spec.cellArea * grain;
  const targetBuildings = Math.max(3, Math.round(pop / spec.peoplePerBuilding));
  const bpb = cellArea / spec.plotArea;
  const blocks = clamp(Math.round(targetBuildings / bpb), 3, 330);
  const radius = Math.sqrt(blocks * cellArea / Math.PI) * 1.06;
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
    cellArea,
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
function createCtx(params, seed) {
  const rng = new RNG(seed);
  const resolved = resolveParams(params);
  const st = settlementFor(params);
  const R = st.radius;
  const N = st.blocks;
  const seaAng = rng.range(0, Math.PI * 2);
  const terrain = {
    seed: rng.int(1, 1e6),
    amt: 0.2 + 1.1 * params.terrain,
    geo: resolved.geo,
    ang: resolved.geo === "coast" ? seaAng : rng.range(0, Math.PI * 2)
  };
  const BR = Math.max(430, R * 2.3);
  const noise = new Noise(rng.int(1, 1e6));
  const seaOff = R * 0.62;
  let sea = (_x, _y) => false;
  if (resolved.geo === "coast") {
    const nx = Math.cos(seaAng), ny = Math.sin(seaAng);
    sea = (x, y) => {
      const u4 = x * nx + y * ny, v2 = -x * ny + y * nx;
      return u4 > seaOff + 11e-4 * v2 * v2 + (noise.fbm(x / (R * 0.55) + 11, y / (R * 0.55) + 7, 3) - 0.5) * R * 0.19;
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
    ctx: { city, rng, N, R, ei: /* @__PURE__ */ new Map(), sea, elev: makeElev(terrain), noise, riverVids: /* @__PURE__ */ new Set(), seaAng, seaOff, harbourEdges: /* @__PURE__ */ new Set() },
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
function buildMesh(ctx2) {
  const { city, rng, N, R } = ctx2;
  const B2 = city.bounds;
  const sites = [];
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
  for (let x = B2[0] + sp / 2; x < B2[2]; x += sp)
    for (let y = B2[1] + sp / 2; y < B2[3]; y += sp) {
      const p = [x + rng.range(-0.38, 0.38) * sp, y + rng.range(-0.38, 0.38) * sp];
      if (Math.hypot(p[0], p[1]) > R * 1.04) sites.push(p);
    }
  for (let it = 0; it < 2; it++) {
    const vor2 = Delaunay.from(sites).voronoi(B2);
    for (let i = 0; i < nIn; i++) {
      const poly = vor2.cellPolygon(i);
      if (poly) sites[i] = centroid(poly.slice(0, -1));
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
    const poly = vor.cellPolygon(i);
    let vids = [];
    if (poly) {
      for (const p of poly.slice(0, -1)) {
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
    cell.elev = ctx2.elev(cell.center[0], cell.center[1]);
    cell.kind = cell.vids.length >= 3 && ctx2.sea(cell.center[0], cell.center[1]) ? "sea" : "outside";
  }
  ctx2.ei = ei;
}
function selectCity(ctx2) {
  const { city, rng, N } = ctx2;
  const cells = city.cells;
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
    const comp = /* @__PURE__ */ new Map();
    const sizes = [];
    for (const c of cells) {
      if (c.kind !== "city" || comp.has(c.id)) continue;
      const id = sizes.length;
      let n = 0;
      const st = [c.id];
      comp.set(c.id, id);
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
    for (const c of cells) if (c.kind === "city" && sizes[comp.get(c.id)] < 4) c.kind = "outside";
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

// scripts/dbg2.ts
var { ctx } = createCtx({ ...DEFAULT_PARAMS, seed: "set40", population: 40 }, "set40");
console.log("R", ctx.R, "N", ctx.N, "blocks", ctx.city.settlement.blocks, "radius", ctx.city.settlement.radius);
buildMesh(ctx);
console.log("cells", ctx.city.cells.length, "city cells before", ctx.city.cells.filter((c) => c.kind === "city").length);
selectCity(ctx);
var cc2 = ctx.city.cells.filter((c) => c.kind === "city");
console.log("city cells after", cc2.length, cc2.map((c) => c.id));
console.log("nbrs of city cells", cc2.map((c) => c.nbrs.map((n) => n >= 0 ? ctx.city.cells[n].kind : "-").join(",")).join(" | "));
