// Canvas-2D renderer (also drives the SVG exporter through SvgContext).
import { Pt, unit, dist, mid, centroid, sub, add, mul, bbox } from './geom';
import { City, Building, Cell, WardType, edgeKey } from './types';
import { THEMES, Theme, ThemeName, hsl } from './theme';
import { terrainCanvas, contours, cityShadeCanvas } from './terrain';
import { identityOf } from './params';
import { WALL_T } from './fortify';
import { poly } from './plan';

type G = CanvasRenderingContext2D;

export interface RenderOpts {
  districts: boolean;
  labels: boolean;
  roadLabels: boolean;
  districtLabels: boolean;
  walls: boolean;
  terrain: boolean;
  decor: boolean;
  buildings: boolean;
  footprints: boolean;
  theme: ThemeName;
  scale: number;
  view?: [number, number, number, number];
  selection?: { buildings?: Set<number>; district?: number; cell?: number; vert?: number; feature?: number };
}

export const DEFAULT_OPTS: RenderOpts = {
  districts: false, labels: true, roadLabels: true, districtLabels: true, walls: true, terrain: true, decor: true, buildings: true, footprints: false,
  theme: 'daylight', scale: 1,
};

const FONT = 'Cinzel, "Trajan Pro", Georgia, "Times New Roman", serif';
const BODY = '"Crimson Text", Georgia, "Times New Roman", serif';
const L: Pt = [-0.62, -0.78];

/* ---------- compiled roofs ---------- */
interface Compiled {
  faces: { layer: number; key: string; pts: number[] }[];
  circ: { layer: number; x: number; y: number; r: number; cone: boolean; k0: string; k1: string }[];
  ridge: number[];
  inner: number[][];
  outl: number[][];
  oc: number[][];
  shadow: number[][];
  shc: number[][];
  plan: number[][];
  /** roof-course hatching: [eave0x,eave0y,eave1x,eave1y,ridge0x,ridge0y,ridge1x,ridge1y] per face */
  hatch: number[][];
  chim: number[];
}

const CHIMNEY = new Set(['house', 'house_l', 'merchant', 'inn', 'tavern', 'bakery', 'smithy', 'manor', 'hovel', 'workshop']);
const shadeKey = (b: Building, s: number) => b.pal + '|' + b.ci + '|' + (Math.round((s * 5.5 + (b.h - 1) * 2.2) * 2) / 2);

function compile(b: Building): Compiled {
  const c: Compiled = { faces: [], circ: [], ridge: [], inner: [], outl: [], oc: [], shadow: [], shc: [], plan: [], hatch: [], chim: [] };
  const dx = 1.2 + 0.9 * b.h,
    dy = 1.5 + 1.1 * b.h;
  b.parts.forEach((part, pi) => {
    const layer = Math.min(pi, 2);
    if (part.k === 'c') {
      const [x, y, r] = part.p;
      c.circ.push({ layer, x, y, r, cone: part.roof === 'cone', k0: shadeKey(b, -0.6), k1: shadeKey(b, 1.5) });
      c.oc.push([x, y, r]);
      c.shc.push([x + dx, y + dy, r]);
      return;
    }
    const p = part.p;
    c.plan.push(p);
    c.outl.push(p);
    c.shadow.push(p.map((v, i) => v + (i % 2 ? dy : dx)));
    const pts: Pt[] =
      part.along === 0
        ? [[p[0], p[1]], [p[2], p[3]], [p[4], p[5]], [p[6], p[7]]]
        : [[p[2], p[3]], [p[4], p[5]], [p[6], p[7]], [p[0], p[1]]];
    const [A0, A1, A2, A3] = pts;
    const W = dist(A0, A1),
      H = dist(A1, A2);
    const cen: Pt = [(A0[0] + A2[0]) / 2, (A0[1] + A2[1]) / 2];
    const fl = (...q: Pt[]) => q.flatMap((z) => z);
    const face = (q: Pt[]) => {
      const cc = centroid(q);
      const n = unit(sub(cc, cen));
      const s = (n[0] * L[0] + n[1] * L[1]) * 2;
      c.faces.push({ layer, key: shadeKey(b, s), pts: fl(...q) });
    };
    if (part.roof === 'flat') {
      c.faces.push({ layer, key: shadeKey(b, 0.3), pts: fl(A0, A1, A2, A3) });
      const k = Math.max(0.2, 1 - 2.4 / Math.max(2.5, Math.min(W, H)));
      c.inner.push(fl(...pts.map((q) => [cen[0] + (q[0] - cen[0]) * k, cen[1] + (q[1] - cen[1]) * k] as Pt)));
    } else if (part.roof === 'hip' && W > H * 1.05) {
      const rl = (W - H) / 2;
      const ax = unit(sub(A1, A0));
      const R0 = sub(cen, mul(ax, rl)),
        R1 = add(cen, mul(ax, rl));
      face([A0, A1, R1, R0]);
      face([A2, A3, R0, R1]);
      face([A3, A0, R0]);
      face([A1, A2, R1]);
      c.hatch.push([...A0, ...A1, ...R0, ...R1], [...A2, ...A3, ...R1, ...R0], [...A3, ...A0, ...R0, ...R0], [...A1, ...A2, ...R1, ...R1]);
      c.ridge.push(R0[0], R0[1], R1[0], R1[1], A0[0], A0[1], R0[0], R0[1], A3[0], A3[1], R0[0], R0[1], A1[0], A1[1], R1[0], R1[1], A2[0], A2[1], R1[0], R1[1]);
    } else if (part.roof === 'hip') {
      // square-ish: pyramid
      face([A0, A1, cen]);
      face([A1, A2, cen]);
      face([A2, A3, cen]);
      face([A3, A0, cen]);
      for (const [p0, p1] of [[A0, A1], [A1, A2], [A2, A3], [A3, A0]]) c.hatch.push([...p0, ...p1, ...cen, ...cen]);
      c.ridge.push(A0[0], A0[1], cen[0], cen[1], A1[0], A1[1], cen[0], cen[1], A2[0], A2[1], cen[0], cen[1], A3[0], A3[1], cen[0], cen[1]);
    } else {
      const R0 = mid(A3, A0),
        R1 = mid(A1, A2);
      face([A0, A1, R1, R0]);
      face([R0, R1, A2, A3]);
      c.ridge.push(R0[0], R0[1], R1[0], R1[1]);
      c.hatch.push([...A0, ...A1, ...R0, ...R1], [...A3, ...A2, ...R0, ...R1]);
      // chimney stack on dwellings, deterministic per building
      if (pi === 0 && CHIMNEY.has(b.type) && (b.id * 2654435761) % 7 < 5 && W > 4.5) {
        const t = 0.2 + (((b.id * 40503) % 100) / 100) * 0.6;
        const side = (b.id % 2 ? 1 : -1) * 0.22;
        c.chim.push(R0[0] + (R1[0] - R0[0]) * t + (A0[0] - R0[0]) * side, R0[1] + (R1[1] - R0[1]) * t + (A0[1] - R0[1]) * side, b.type === 'smithy' || b.type === 'bakery' ? 0.85 : 0.55);
      }
    }
  });
  return c;
}
const comp = (b: Building): Compiled => ((b as any)._c ??= compile(b));
export const invalidate = (b: Building) => {
  delete (b as any)._c;
};

/* ---------- helpers ---------- */
function pf(g: G, f: number[], close = true) {
  g.moveTo(f[0], f[1]);
  for (let i = 2; i < f.length; i += 2) g.lineTo(f[i], f[i + 1]);
  if (close) g.closePath();
}
function pp(g: G, pts: Pt[], close = true) {
  g.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]);
  if (close) g.closePath();
}
function circle(g: G, x: number, y: number, r: number) {
  g.moveTo(x + r, y);
  g.arc(x, y, r, 0, Math.PI * 2);
}
const vis = (v: [number, number, number, number] | undefined, b: number[]) => !v || !(b[2] < v[0] || b[0] > v[2] || b[3] < v[1] || b[1] > v[3]);

function cellBB(city: City, c: Cell): [number, number, number, number] {
  return ((c as any)._bb ??= bbox(poly(city, c)));
}

function textW(s: string, size: number) {
  return s.length * size * 0.56;
}

interface Label { text: string; x: number; y: number; size: number; rot: number; prio: number; font: string; color?: string; alpha?: number; halo?: boolean }

/* ---------- main ---------- */
export function drawMap(g: G, city: City, o: RenderOpts) {
  const T = THEMES[o.theme];
  const view = o.view;
  const S = o.scale;
  const detail = S > 0.42;
  const B = city.bounds;
  g.lineJoin = 'round';
  g.lineCap = 'round';

  // 1. ground
  g.fillStyle = T.bg;
  g.fillRect(B[0] - 600, B[1] - 600, B[2] - B[0] + 1200, B[3] - B[1] + 1200);
  if (o.terrain) {
    const tc = terrainCanvas(city, T);
    if (tc) {
      (g as any).imageSmoothingEnabled = true;
      g.drawImage(tc, B[0], B[1], B[2] - B[0], B[3] - B[1]);
    }
  }
  if (T.paper && o.decor) drawBlotches(g, city, T, view);

  // 2. fields, contours
  if (o.terrain) {
    for (const f of city.fields) {
      const bb = bbox(f.p, true);
      if (!vis(view, bb)) continue;
      g.fillStyle = T.field[f.tone % T.field.length];
      g.beginPath();
      pf(g, f.p);
      g.fill();
      // hedgerow boundary
      g.strokeStyle = T.forestDark;
      g.lineWidth = 1.5;
      g.stroke();
      if (detail) {
        g.strokeStyle = T.furrow;
        g.lineWidth = 0.7;
        g.lineCap = 'butt';
        g.beginPath();
        for (let i = 0; i < f.f.length; i += 4) {
          g.moveTo(f.f[i], f.f[i + 1]);
          g.lineTo(f.f[i + 2], f.f[i + 3]);
        }
        g.stroke();
        g.lineCap = 'round';
      }
    }
    if (city.terrain.amt > 0.35) {
      const cl = contours(city);
      g.strokeStyle = T.contour;
      g.lineWidth = 0.8;
      g.beginPath();
      for (let i = 0; i < cl.length; i += 4) {
        if (view && (cl[i] < view[0] - 30 || cl[i] > view[2] + 30 || cl[i + 1] < view[1] - 30 || cl[i + 1] > view[3] + 30)) continue;
        g.moveTo(cl[i], cl[i + 1]);
        g.lineTo(cl[i + 2], cl[i + 3]);
      }
      g.stroke();
    }
  }

  // 3. sea
  for (const c of city.cells) {
    if (c.kind !== 'sea' || c.vids.length < 3) continue;
    if (!vis(view, cellBB(city, c))) continue;
    g.fillStyle = T.seaShallow;
    g.strokeStyle = T.seaShallow;
    g.lineWidth = 0.8;
    g.beginPath();
    pp(g, poly(city, c));
    g.fill();
    g.stroke();
  }
  for (const c of city.cells) {
    if (c.kind !== 'sea' || c.ground.length < 6) continue;
    if (!vis(view, cellBB(city, c))) continue;
    g.fillStyle = T.seaDeep;
    g.strokeStyle = T.seaDeep;
    g.lineWidth = 0.8;
    g.beginPath();
    pf(g, c.ground);
    g.fill();
    g.stroke();
  }
  if (o.decor && city.waves.length) {
    g.strokeStyle = T.wave;
    g.lineWidth = 0.9;
    g.beginPath();
    for (let i = 0; i < city.waves.length; i += 3) {
      const x = city.waves[i],
        y = city.waves[i + 1],
        l = city.waves[i + 2];
      g.moveTo(x - l / 2, y);
      g.lineTo(x - l / 4, y - 1.8);
      g.lineTo(x, y);
      g.lineTo(x + l / 4, y - 1.8);
      g.lineTo(x + l / 2, y);
    }
    g.stroke();
  }
  // shoreline
  g.strokeStyle = T.seaShore;
  g.lineWidth = 1.6;
  g.beginPath();
  for (const k in city.edges) {
    if (city.edges[k] !== 'coast') continue;
    const [a, b] = k.split('_').map(Number);
    g.moveTo(city.verts[a][0], city.verts[a][1]);
    g.lineTo(city.verts[b][0], city.verts[b][1]);
  }
  g.stroke();

  // 4. moat (outside half is visible; the inner half is covered by the city ground)
  if (city.moat > 0 && o.walls) {
    for (const w of city.walls) {
      if (w.kind !== 'outer') continue;
      for (const [col, wd] of [[T.riverBank, city.moat * 2 + 3.4], [T.river, city.moat * 2]] as [string, number][]) {
        g.strokeStyle = col;
        g.lineWidth = wd;
        g.lineCap = 'butt';
        g.lineJoin = 'round';
        g.beginPath();
        pp(g, w.vids.map((v) => city.verts[v]), w.closed);
        g.stroke();
      }
    }
    g.lineCap = 'round';
  }

  // 5. outer roads
  for (const r of city.roads) {
    for (const [col, wd] of [[T.outerRoadEdge, r.w + 1.6], [T.outerRoad, r.w]] as [string, number][]) {
      g.strokeStyle = col;
      g.lineWidth = wd;
      g.beginPath();
      pp(g, r.pts, false);
      g.stroke();
    }
    if (detail && r.w > 4) {
      // worn cart ruts
      g.strokeStyle = T.outerRoadEdge;
      g.globalAlpha = 0.45;
      g.lineWidth = 0.5;
      g.setLineDash([4, 2.5]);
      for (const off of [-r.w * 0.22, r.w * 0.22]) {
        g.beginPath();
        for (let i = 0; i < r.pts.length - 1; i++) {
          const a = r.pts[i], b = r.pts[i + 1];
          const nn = unit([-(b[1] - a[1]), b[0] - a[0]]);
          if (i === 0) g.moveTo(a[0] + nn[0] * off, a[1] + nn[1] * off);
          g.lineTo(b[0] + nn[0] * off, b[1] + nn[1] * off);
        }
        g.stroke();
      }
      g.setLineDash([]);
      g.globalAlpha = 1;
    }
  }

  // 6. forest trees (countryside) - drawn before the city so walls overlap them
  if (o.decor && city.forest.length) {
    const f = city.forest;
    const cull = (x: number, y: number) => !view || (x > view[0] - 8 && x < view[2] + 8 && y > view[1] - 8 && y < view[3] + 8);
    g.fillStyle = T.forestDark;
    g.beginPath();
    for (let i = 0; i < f.length; i += 4) if (cull(f[i], f[i + 1])) circle(g, f[i] + 1.1, f[i + 1] + 1.4, f[i + 2]);
    g.fill();
    for (let t = 0; t < 3; t++) {
      g.fillStyle = T.forest[t];
      g.beginPath();
      for (let i = 0; i < f.length; i += 4) {
        if (f[i + 3] !== t || !cull(f[i], f[i + 1])) continue;
        const x = f[i], y = f[i + 1], rr = f[i + 2];
        if (detail) {
          // clustered canopy: three overlapping lobes instead of a perfect disc
          const ph = (x * 0.37 + y * 0.61) % 6.28;
          for (let k = 0; k < 3; k++) {
            const a = ph + (k * Math.PI * 2) / 3;
            circle(g, x + Math.cos(a) * rr * 0.32, y + Math.sin(a) * rr * 0.32, rr * 0.74);
          }
        } else circle(g, x, y, rr);
      }
      g.fill();
    }
    if (detail) {
      g.fillStyle = 'rgba(255,255,230,0.18)';
      g.beginPath();
      for (let i = 0; i < f.length; i += 4) if (cull(f[i], f[i + 1])) circle(g, f[i] - f[i + 2] * 0.25, f[i + 1] - f[i + 2] * 0.25, f[i + 2] * 0.5);
      g.fill();
    }
  }

  // 7. city ground (streets are the empty space between blocks)
  const rural = city.settlement.tierIndex <= 1;
  g.fillStyle = rural ? T.rural : T.road;
  g.strokeStyle = rural ? T.rural : T.road;
  g.lineWidth = 0.8;
  g.beginPath();
  for (const c of city.cells) if (c.kind === 'city' && c.ground.length && vis(view, cellBB(city, c))) pf(g, c.ground);
  g.fill();
  g.stroke();
  if (rural) {
    // enclosed fields: hedge lines around each holding
    g.strokeStyle = T.forestDark;
    g.lineWidth = 1.6;
    g.beginPath();
    for (const c of city.cells) {
      if (c.kind !== 'city' || !c.ground.length || !vis(view, cellBB(city, c))) continue;
      const pl = poly(city, c);
      for (let i = 0; i < pl.length; i++) {
        const a = pl[i], b = pl[(i + 1) % pl.length];
        g.moveTo(a[0], a[1]);
        g.lineTo(b[0], b[1]);
      }
    }
    g.stroke();
  }
  if (o.districts) {
    for (const d of city.districts) {
      g.fillStyle = d.color ?? T.ward[d.type];
      g.globalAlpha = 0.38;
      g.beginPath();
      for (const id of d.cells) {
        const c = city.cells[id];
        if (c.ground.length && vis(view, cellBB(city, c))) pf(g, c.ground);
      }
      g.fill();
      g.globalAlpha = 1;
    }
  }

  // 8. river
  if (city.river) {
    const r = city.river;
    for (const pass of [0, 1, 2]) {
      g.strokeStyle = pass === 0 ? T.riverBank : pass === 1 ? T.river : T.riverHi;
      if (pass === 2) g.globalAlpha = 0.55;
      for (let i = 0; i < r.pts.length - 1; i++) {
        const a = r.pts[i],
          b = r.pts[i + 1];
        if (view && (Math.max(a[0], b[0]) < view[0] - 40 || Math.min(a[0], b[0]) > view[2] + 40 || Math.max(a[1], b[1]) < view[1] - 40 || Math.min(a[1], b[1]) > view[3] + 40)) continue;
        const w = (r.w[i] + r.w[i + 1]) / 2;
        g.lineWidth = pass === 0 ? w + 3.2 : pass === 1 ? w : w * 0.28;
        g.beginPath();
        g.moveTo(a[0], a[1]);
        g.lineTo(b[0], b[1]);
        g.stroke();
      }
    }
    g.globalAlpha = 1;
    if (detail && o.decor) {
      // current ripples: short dashes drifting along the stream
      g.strokeStyle = T.riverHi;
      g.lineWidth = 0.6;
      g.setLineDash([3, 7]);
      for (const off of [-0.25, 0.25]) {
        g.beginPath();
        for (let i = 0; i < r.pts.length - 1; i++) {
          const a = r.pts[i], b = r.pts[i + 1];
          const n = unit([-(b[1] - a[1]), b[0] - a[0]]);
          const w = r.w[i] * off;
          if (i === 0) g.moveTo(a[0] + n[0] * w, a[1] + n[1] * w);
          g.lineTo(b[0] + n[0] * w, b[1] + n[1] * w);
        }
        g.stroke();
      }
      g.setLineDash([]);
    }
  }

  // 8b. stone quays with bollards along harbour edges
  if (city.quays && city.quays.length) {
    const segs: [Pt, Pt][] = [];
    for (const k of city.quays) {
      const [a, b] = k.split('_').map(Number);
      const A = city.verts[a], Bv = city.verts[b];
      if (!A || !Bv) continue;
      const rw = city.river?.ew[k];
      if (rw && city.river) {
        // follow the smoothed river: take the stretch of the drawn polyline that belongs to this edge, offset to both banks
        const rp = city.river.pts, ww = city.river.w;
        const ex = Bv[0] - A[0], ey = Bv[1] - A[1], l2 = ex * ex + ey * ey || 1;
        const idx: number[] = [];
        for (let i = 0; i < rp.length; i++) {
          const t = ((rp[i][0] - A[0]) * ex + (rp[i][1] - A[1]) * ey) / l2;
          if (t < 0.04 || t > 0.96) continue;
          if (Math.abs((rp[i][0] - A[0]) * ey - (rp[i][1] - A[1]) * ex) / Math.sqrt(l2) > 14) continue;
          idx.push(i);
        }
        for (let j = 0; j < idx.length - 1; j++) {
          const i0 = idx[j], i1 = idx[j + 1];
          if (i1 !== i0 + 1) continue;
          const a = rp[i0], b = rp[i1];
          const n = unit([-(b[1] - a[1]), b[0] - a[0]]);
          for (const s of [-1, 1]) {
            const oa = (ww[i0] / 2 + 0.6) * s, ob = (ww[i1] / 2 + 0.6) * s;
            segs.push([[a[0] + n[0] * oa, a[1] + n[1] * oa], [b[0] + n[0] * ob, b[1] + n[1] * ob]]);
          }
        }
      } else segs.push([A, Bv]);
    }
    g.lineCap = 'butt';
    for (const [col, w] of [[T.wallEdge, 2.6], [T.wall, 1.8], [T.wallTop, 0.6]] as [string, number][]) {
      g.strokeStyle = col;
      g.lineWidth = w;
      g.beginPath();
      for (const [a, b] of segs) (g.moveTo(a[0], a[1]), g.lineTo(b[0], b[1]));
      g.stroke();
    }
    g.lineCap = 'round';
    if (detail) {
      g.fillStyle = T.wallEdge;
      g.beginPath();
      for (const [a, b] of segs) {
        const L2 = dist(a, b);
        const n = Math.floor(L2 / 6);
        for (let i = 1; i < n; i++) circle(g, a[0] + ((b[0] - a[0]) * i) / n, a[1] + ((b[1] - a[1]) * i) / n, 0.42);
      }
      g.fill();
    }
  }

  // 9. street hierarchy: real per-edge widths, kerb + surface, lanes/front streets/arterials
  if (detail) {
    const buckets = new Map<number, number[]>();
    for (const k in city.edges) {
      const cls = city.edges[k];
      if (cls !== 'minor' && cls !== 'secondary' && cls !== 'arterial') continue;
      const w = Math.round((city.ew[k] ?? (cls === 'arterial' ? 9.6 : cls === 'secondary' ? 6.6 : 4.4)) * 2) / 2;
      const [a, b] = k.split('_').map(Number);
      const A = city.verts[a],
        Bv = city.verts[b];
      if (view && (Math.max(A[0], Bv[0]) < view[0] - 10 || Math.min(A[0], Bv[0]) > view[2] + 10 || Math.max(A[1], Bv[1]) < view[1] - 10 || Math.min(A[1], Bv[1]) > view[3] + 10)) continue;
      let l = buckets.get(w);
      if (!l) buckets.set(w, (l = []));
      l.push(A[0], A[1], Bv[0], Bv[1]);
    }
    // kerb: thin darker edge, then surface slightly lighter than the blocks
    g.lineCap = 'round';
    for (const [pass, col] of [[0, T.roadEdge], [1, T.roadMain]] as [number, string][]) {
      g.strokeStyle = col;
      for (const [w, segs] of buckets) {
        if (pass === 0 && w < 3.5) continue;
        g.lineWidth = pass === 0 ? w + 0.8 : w - 0.15;
        if (pass === 1) g.globalAlpha = 0.85;
        g.beginPath();
        for (let i = 0; i < segs.length; i += 4) {
          g.moveTo(segs[i], segs[i + 1]);
          g.lineTo(segs[i + 2], segs[i + 3]);
        }
        g.stroke();
      }
    }
    g.globalAlpha = 1;
    // junction caps so intersecting streets merge cleanly
    g.fillStyle = T.roadMain;
    g.globalAlpha = 0.85;
    const capR = new Map<number, number>();
    for (const [w] of buckets) capR.set(w, w / 2);
    void capR;
    g.globalAlpha = 1;
    for (const pz of city.plazas) {
      const p = city.verts[pz.vid];
      const r = pz.r * 0.9;
      g.fillStyle = T.plaza;
      g.strokeStyle = T.roadEdge;
      g.lineWidth = 0.7;
      g.beginPath();
      circle(g, p[0], p[1], r);
      g.fill();
      g.stroke();
      // radial paving pattern reads as a designed junction square instead of a blank disc
      g.strokeStyle = T.roadEdge;
      g.lineWidth = 0.45;
      g.beginPath();
      circle(g, p[0], p[1], r * 0.6);
      circle(g, p[0], p[1], r * 0.2);
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * Math.PI * 2;
        g.moveTo(p[0] + Math.cos(a) * r * 0.2, p[1] + Math.sin(a) * r * 0.2);
        g.lineTo(p[0] + Math.cos(a) * r * 0.6, p[1] + Math.sin(a) * r * 0.6);
      }
      g.stroke();
    }
  }
  // bridge approach roads
  for (const c of city.cells)
    for (const cut of c.cuts) {
      g.strokeStyle = T.roadMain;
      g.lineWidth = cut.w - 0.2;
      g.lineCap = 'butt';
      g.beginPath();
      g.moveTo(cut.a[0], cut.a[1]);
      g.lineTo(cut.b[0], cut.b[1]);
      g.stroke();
      g.lineCap = 'round';
    }

  // 10. blocks, open areas, yards
  g.fillStyle = rural ? T.rural : T.yard;
  g.strokeStyle = rural ? T.rural : T.yard;
  g.lineWidth = 0.6;
  g.beginPath();
  for (const c of city.cells) if (c.kind === 'city' && vis(view, cellBB(city, c))) for (const b of c.blocks) pf(g, b);
  g.fill();
  g.stroke();
  const openCol: Record<string, string> = { plaza: T.plaza, lawn: T.lawn, yard: T.lawn, parade: T.parade, cloister: T.lawn, garden: T.garden, bailey: T.bailey };
  for (const kind of Object.keys(openCol)) {
    g.fillStyle = openCol[kind];
    g.beginPath();
    for (const c of city.cells) if (c.kind === 'city' && vis(view, cellBB(city, c))) for (const a of c.open) if (a.kind === kind) pf(g, a.poly);
    g.fill();
  }
  if (detail) {
    // plaza cobble hint & lawn paths
    g.strokeStyle = T.roadEdge;
    g.lineWidth = 0.5;
    for (const c of city.cells) {
      if (c.kind !== 'city' || !vis(view, cellBB(city, c))) continue;
      for (const a of c.open) {
        if (a.kind === 'cloister' || a.kind === 'lawn') {
          const cc = centroid(unflatPts(a.poly));
          g.strokeStyle = T.gardenDirt;
          g.lineWidth = 1.6;
          g.beginPath();
          const bb = bbox(a.poly, true);
          g.moveTo(bb[0] + 3, cc[1]);
          g.lineTo(bb[2] - 3, cc[1]);
          g.moveTo(cc[0], bb[1] + 3);
          g.lineTo(cc[0], bb[3] - 3);
          g.stroke();
        }
        g.strokeStyle = T.roadEdge;
        g.lineWidth = 0.5;
        g.beginPath();
        pf(g, a.poly);
        g.stroke();
      }
    }
  }
  for (const k of [1, 0]) {
    g.fillStyle = k ? T.garden : T.gardenDirt;
    g.beginPath();
    for (const c of city.cells) if (c.kind === 'city' && vis(view, cellBB(city, c))) for (const y of c.yards) if (y.k === k) pf(g, y.p);
    g.fill();
  }
  if (detail && o.decor) {
    // hedges around formal gardens
    g.strokeStyle = 'rgba(70,100,50,0.45)';
    g.lineWidth = 0.7;
    g.beginPath();
    for (const c of city.cells) if (c.kind === 'city' && vis(view, cellBB(city, c))) for (const y of c.yards) if (y.k === 1 && c.ward === 'noble') pf(g, y.p);
    g.stroke();
  }

  // 10b. relief inside the walls (hill and mountain cities, or strong terrain)
  if (o.terrain && (city.resolved.geo === 'hills' || city.resolved.geo === 'mountain' || city.terrain.amt > 1.0)) {
    const sc = cityShadeCanvas(city);
    if (sc) {
      g.globalAlpha = 0.55;
      g.drawImage(sc, B[0], B[1], B[2] - B[0], B[3] - B[1]);
      g.globalAlpha = 1;
    }
  }

  // 11. stalls, graves, garden trees
  if (o.decor) drawCellDecor(g, city, T, view, detail);

  // 11b. farmyard pads for rural settlements
  if (rural && city.settlement.tierIndex <= 1 && detail) {
    g.fillStyle = T.ruralPad;
    g.beginPath();
    for (const b of city.buildings) {
      if (!vis(view, b.bb)) continue;
      const pad = 2.4 + Math.min(5, (b.bb[2] - b.bb[0]) * 0.12);
      g.rect(b.bb[0] - pad, b.bb[1] - pad, b.bb[2] - b.bb[0] + pad * 2, b.bb[3] - b.bb[1] + pad * 2);
    }
    g.fill();
  }

  // 12. walls, towers, gates, castles, moat bridges
  if (o.walls) drawDefences(g, city, T, view, S);

  // 13. bridges and piers
  drawBridges(g, city, T);
  drawPiers(g, city, T);

  // 14. buildings
  if (o.buildings) drawBuildings(g, city, T, o, detail);

  // 15. features
  if (o.decor) drawFeatures(g, city, T, view, S);

  // 16. selection
  drawSelection(g, city, o);

  // 17. labels
  drawLabels(g, city, T, o);
}

function unflatPts(f: number[]): Pt[] {
  const o: Pt[] = [];
  for (let i = 0; i < f.length; i += 2) o.push([f[i], f[i + 1]]);
  return o;
}

function drawBlotches(g: G, city: City, T: Theme, view?: [number, number, number, number]) {
  let s = city.terrain.seed;
  const rnd = () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296);
  g.fillStyle = 'rgba(140,100,50,0.045)';
  g.beginPath();
  for (let i = 0; i < 160; i++) {
    const x = city.bounds[0] + rnd() * (city.bounds[2] - city.bounds[0]),
      y = city.bounds[1] + rnd() * (city.bounds[3] - city.bounds[1]),
      r = 40 + rnd() * 140;
    if (view && (x + r < view[0] || x - r > view[2] || y + r < view[1] || y - r > view[3])) continue;
    circle(g, x, y, r);
  }
  g.fill();
  void T;
}

function drawCellDecor(g: G, city: City, T: Theme, view: [number, number, number, number] | undefined, detail: boolean) {
  // stalls
  g.lineWidth = 0.4;
  for (const c of city.cells) {
    if (c.kind !== 'city' || !vis(view, cellBB(city, c))) continue;
    const s = c.stalls;
    for (let i = 0; i < s.length; i += 6) {
      const x = s[i],
        y = s[i + 1],
        w = s[i + 2],
        h = s[i + 3],
        a = s[i + 4];
      const co = Math.cos(a),
        si = Math.sin(a);
      const pts: number[] = [];
      for (const [u, v] of [[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]]) pts.push(x + u * co - v * si, y + u * si + v * co);
      g.fillStyle = 'rgba(40,30,20,0.25)';
      g.beginPath();
      pf(g, pts.map((v, j) => v + (j % 2 ? 0.9 : 0.7)));
      g.fill();
      g.fillStyle = T.stall[s[i + 5] % T.stall.length];
      g.strokeStyle = T.outline;
      g.beginPath();
      pf(g, pts);
      g.fill();
      if (detail) {
        g.stroke();
        // awning stripes + ridge
        g.strokeStyle = 'rgba(255,250,235,0.55)';
        g.lineWidth = 0.45;
        g.beginPath();
        for (const t of [0.25, 0.5, 0.75]) {
          g.moveTo(pts[0] + (pts[2] - pts[0]) * t, pts[1] + (pts[3] - pts[1]) * t);
          g.lineTo(pts[6] + (pts[4] - pts[6]) * t, pts[7] + (pts[5] - pts[7]) * t);
        }
        g.stroke();
        g.lineWidth = 0.4;
      }
    }
  }
  // graves
  g.fillStyle = 'rgba(95,90,80,0.7)';
  g.beginPath();
  for (const c of city.cells) {
    if (c.kind !== 'city' || !c.graves.length || !vis(view, cellBB(city, c))) continue;
    for (let i = 0; i < c.graves.length; i += 2) g.rect(c.graves[i] - 0.6, c.graves[i + 1] - 0.9, 1.2, 1.8);
  }
  g.fill();
  // garden trees
  const trees: number[] = [];
  for (const c of city.cells) if (c.kind === 'city' && c.trees.length && vis(view, cellBB(city, c))) trees.push(...c.trees);
  if (trees.length) {
    g.fillStyle = T.forestDark;
    g.beginPath();
    for (let i = 0; i < trees.length; i += 3) circle(g, trees[i] + 0.9, trees[i + 1] + 1.1, trees[i + 2]);
    g.fill();
    g.fillStyle = T.forest[0];
    g.beginPath();
    for (let i = 0; i < trees.length; i += 3) circle(g, trees[i], trees[i + 1], trees[i + 2]);
    g.fill();
    if (detail) {
      g.fillStyle = 'rgba(255,255,230,0.2)';
      g.beginPath();
      for (let i = 0; i < trees.length; i += 3) circle(g, trees[i] - trees[i + 2] * 0.25, trees[i + 1] - trees[i + 2] * 0.25, trees[i + 2] * 0.5);
      g.fill();
    }
  }
}

function strokeWallRun(g: G, T: Theme, pts: Pt[], closed: boolean, t: number) {
  g.lineCap = 'butt';
  g.lineJoin = 'round';
  // cast shadow gives the curtain wall height
  g.strokeStyle = T.shadow;
  g.lineWidth = t + 2.2;
  g.beginPath();
  pp(g, pts.map((p) => [p[0] + 1.3, p[1] + 1.7] as Pt), closed);
  g.stroke();
  g.strokeStyle = T.wallEdge;
  g.lineWidth = t + 1.5;
  g.beginPath();
  pp(g, pts, closed);
  g.stroke();
  g.strokeStyle = T.wall;
  g.lineWidth = t;
  g.beginPath();
  pp(g, pts, closed);
  g.stroke();
  g.strokeStyle = T.wallTop;
  g.lineWidth = t * 0.42;
  g.beginPath();
  pp(g, pts, closed);
  g.stroke();
  g.strokeStyle = 'rgba(60,50,40,0.45)';
  g.lineWidth = t * 0.42;
  g.setLineDash([1.1, 1.1]);
  g.beginPath();
  pp(g, pts, closed);
  g.stroke();
  g.setLineDash([]);
  g.lineCap = 'round';
}

function tower(g: G, T: Theme, p: Pt, r: number, kind: string, dir: Pt) {
  g.fillStyle = 'rgba(40,30,20,0.28)';
  g.beginPath();
  if (kind === 'square') {
    const a = Math.atan2(dir[1], dir[0]);
    sq(g, p[0] + 1.2, p[1] + 1.5, r * 1.75, a);
  } else circle(g, p[0] + 1.2, p[1] + 1.5, r);
  g.fill();
  g.strokeStyle = T.wallEdge;
  g.lineWidth = 0.9;
  if (kind === 'bastion') {
    const n: Pt = [-dir[1], dir[0]];
    g.fillStyle = T.wall;
    g.beginPath();
    g.moveTo(p[0] + n[0] * r * 0.95, p[1] + n[1] * r * 0.95);
    g.lineTo(p[0] + dir[0] * r * 1.7, p[1] + dir[1] * r * 1.7);
    g.lineTo(p[0] - n[0] * r * 0.95, p[1] - n[1] * r * 0.95);
    g.closePath();
    g.fill();
    g.stroke();
    g.fillStyle = hsl(T.pal.slate[0], 6);
    g.beginPath();
    g.moveTo(p[0] + n[0] * r * 0.6, p[1] + n[1] * r * 0.6);
    g.lineTo(p[0] + dir[0] * r * 1.15, p[1] + dir[1] * r * 1.15);
    g.lineTo(p[0] - n[0] * r * 0.6, p[1] - n[1] * r * 0.6);
    g.closePath();
    g.fill();
    return;
  }
  g.fillStyle = T.wall;
  g.beginPath();
  const ang = Math.atan2(dir[1], dir[0]);
  if (kind === 'square') sq(g, p[0], p[1], r * 1.75, ang);
  else circle(g, p[0], p[1], r);
  g.fill();
  g.stroke();
  if (kind === 'square') {
    // crenellated platform with a pyramidal cap
    g.strokeStyle = 'rgba(60,50,40,0.55)';
    g.lineWidth = 0.5;
    g.setLineDash([0.8, 0.7]);
    g.beginPath();
    sq(g, p[0], p[1], r * 1.45, ang);
    g.stroke();
    g.setLineDash([]);
    const s = r * 1.05;
    const c = Math.cos(ang), si = Math.sin(ang);
    const corner = (u: number, v: number): Pt => [p[0] + u * c - v * si, p[1] + u * si + v * c];
    const cs = [corner(-s / 2, -s / 2), corner(s / 2, -s / 2), corner(s / 2, s / 2), corner(-s / 2, s / 2)];
    for (let i = 0; i < 4; i++) {
      const a = cs[i], b = cs[(i + 1) % 4];
      const m: Pt = [(a[0] + b[0]) / 2 - p[0], (a[1] + b[1]) / 2 - p[1]];
      const lit = (m[0] * L[0] + m[1] * L[1]) / (Math.hypot(m[0], m[1]) || 1);
      g.fillStyle = hsl(T.pal.slate[0], lit * 12);
      g.beginPath();
      pp(g, [a, b, p]);
      g.fill();
    }
    return;
  }
  // round tower: crenellated parapet ring + two-tone conical roof
  g.strokeStyle = 'rgba(60,50,40,0.55)';
  g.lineWidth = 0.5;
  g.setLineDash([0.9, 0.8]);
  g.beginPath();
  circle(g, p[0], p[1], r * 0.84);
  g.stroke();
  g.setLineDash([]);
  const cr = r * (kind === 'harbour' ? 0.66 : 0.7);
  const la = Math.atan2(L[1], L[0]);
  g.fillStyle = hsl(T.pal.slate[0], kind === 'harbour' ? 6 : -6);
  g.beginPath();
  circle(g, p[0], p[1], cr);
  g.fill();
  g.fillStyle = hsl(T.pal.slate[0], kind === 'harbour' ? 18 : 10);
  g.beginPath();
  g.moveTo(p[0], p[1]);
  g.arc(p[0], p[1], cr, la - Math.PI / 2, la + Math.PI / 2);
  g.closePath();
  g.fill();
  g.fillStyle = 'rgba(30,25,20,0.55)';
  g.beginPath();
  circle(g, p[0], p[1], Math.max(0.35, r * 0.09));
  g.fill();
}
function sq(g: G, x: number, y: number, s: number, a: number) {
  const c = Math.cos(a),
    si = Math.sin(a),
    h = s / 2;
  const pts: number[] = [];
  for (const [u, v] of [[-h, -h], [h, -h], [h, h], [-h, h]]) pts.push(x + u * c - v * si, y + u * si + v * c);
  pf(g, pts);
}

function gatehouse(g: G, T: Theme, p: Pt, tan: Pt, dir: Pt, len: number, depth: number, road: string) {
  const pts: number[] = [];
  for (const [u, v] of [[-len / 2, -depth / 2], [len / 2, -depth / 2], [len / 2, depth / 2], [-len / 2, depth / 2]]) pts.push(p[0] + tan[0] * u + dir[0] * v, p[1] + tan[1] * u + dir[1] * v);
  g.fillStyle = 'rgba(40,30,20,0.28)';
  g.beginPath();
  pf(g, pts.map((v, i) => v + (i % 2 ? 1.5 : 1.2)));
  g.fill();
  g.fillStyle = T.wall;
  g.strokeStyle = T.wallEdge;
  g.lineWidth = 0.9;
  g.beginPath();
  pf(g, pts);
  g.fill();
  g.stroke();
  const pw = len * 0.3;
  const q: number[] = [];
  for (const [u, v] of [[-pw / 2, -depth / 2 - 0.3], [pw / 2, -depth / 2 - 0.3], [pw / 2, depth / 2 + 0.3], [-pw / 2, depth / 2 + 0.3]]) q.push(p[0] + tan[0] * u + dir[0] * v, p[1] + tan[1] * u + dir[1] * v);
  g.fillStyle = road;
  g.beginPath();
  pf(g, q);
  g.fill();
  g.fillStyle = hsl(T.pal.slate[1], 8);
  const roofPts: number[] = [];
  for (const [u, v] of [[-len / 2 + 1.5, -depth / 2 + 1.2], [-pw / 2 - 0.8, -depth / 2 + 1.2], [-pw / 2 - 0.8, depth / 2 - 1.2], [-len / 2 + 1.5, depth / 2 - 1.2]]) roofPts.push(p[0] + tan[0] * u + dir[0] * v, p[1] + tan[1] * u + dir[1] * v);
  g.beginPath();
  pf(g, roofPts);
  const roofPts2: number[] = [];
  for (const [u, v] of [[len / 2 - 1.5, -depth / 2 + 1.2], [pw / 2 + 0.8, -depth / 2 + 1.2], [pw / 2 + 0.8, depth / 2 - 1.2], [len / 2 - 1.5, depth / 2 - 1.2]]) roofPts2.push(p[0] + tan[0] * u + dir[0] * v, p[1] + tan[1] * u + dir[1] * v);
  pf(g, roofPts2);
  g.fill();
}

function drawDefences(g: G, city: City, T: Theme, view: [number, number, number, number] | undefined, S: number) {
  // gate causeways over the moat
  if (city.moat > 0) {
    for (const gt of city.gates) {
      if (gt.kind !== 'main') continue;
      g.fillStyle = T.wood;
      g.strokeStyle = T.wallEdge;
      g.lineWidth = 0.6;
      const a = gt.p,
        b = add(gt.p, mul(gt.dir, city.moat + 5));
      const n: Pt = [-gt.dir[1], gt.dir[0]];
      g.beginPath();
      pf(g, [a[0] + n[0] * 3.2, a[1] + n[1] * 3.2, b[0] + n[0] * 3.2, b[1] + n[1] * 3.2, b[0] - n[0] * 3.2, b[1] - n[1] * 3.2, a[0] - n[0] * 3.2, a[1] - n[1] * 3.2]);
      g.fill();
      g.stroke();
    }
  }
  for (const w of city.walls) {
    if (w.kind !== 'sea') strokeWallRun(g, T, w.vids.map((v) => city.verts[v]), w.closed, w.t);
  }
  for (const w of city.walls) if (w.kind === 'sea') strokeWallRun(g, T, w.vids.map((v) => city.verts[v]), w.closed, w.t);
  // citadel curtain walls
  for (const c of city.cells) {
    if (!c.fort || !vis(view, cellBB(city, c))) continue;
    const wp = unflatPts(c.fort.wall);
    strokeWallRun(g, T, wp, true, 3.4);
    const gt = c.fort.gate;
    gatehouse(g, T, [gt[0], gt[1]], [-gt[3], gt[2]], [gt[2], gt[3]], 15, 7.5, T.bailey);
    for (let i = 0; i < c.fort.towers.length; i += 3) tower(g, T, [c.fort.towers[i], c.fort.towers[i + 1]], c.fort.towers[i + 2], 'round', [1, 0]);
  }
  for (const t of city.towers) {
    if (view && (t.p[0] < view[0] - 20 || t.p[0] > view[2] + 20 || t.p[1] < view[1] - 20 || t.p[1] > view[3] + 20)) continue;
    tower(g, T, t.p, t.r, t.kind, t.dir);
  }
  for (const gt of city.gates) {
    if (view && (gt.p[0] < view[0] - 20 || gt.p[0] > view[2] + 20 || gt.p[1] < view[1] - 20 || gt.p[1] > view[3] + 20)) continue;
    if (gt.kind === 'water') {
      const w = WALL_T[gt.wall];
      g.fillStyle = T.river;
      g.strokeStyle = T.wallEdge;
      g.lineWidth = 0.8;
      g.beginPath();
      pf(g, [gt.p[0] - gt.tan[0] * 3 - gt.dir[0] * (w / 2 + 1), gt.p[1] - gt.tan[1] * 3 - gt.dir[1] * (w / 2 + 1), gt.p[0] + gt.tan[0] * 3 - gt.dir[0] * (w / 2 + 1), gt.p[1] + gt.tan[1] * 3 - gt.dir[1] * (w / 2 + 1), gt.p[0] + gt.tan[0] * 3 + gt.dir[0] * (w / 2 + 1), gt.p[1] + gt.tan[1] * 3 + gt.dir[1] * (w / 2 + 1), gt.p[0] - gt.tan[0] * 3 + gt.dir[0] * (w / 2 + 1), gt.p[1] - gt.tan[1] * 3 + gt.dir[1] * (w / 2 + 1)]);
      g.fill();
      g.stroke();
      continue;
    }
    if (gt.kind === 'inner') gatehouse(g, T, gt.p, gt.tan, gt.dir, 11, WALL_T.inner + 3, T.road);
    else if (gt.kind === 'postern') gatehouse(g, T, gt.p, gt.tan, gt.dir, 6.5, WALL_T.outer + 1.6, T.outerRoad);
    else if (city.resolved.walls !== 'none') {
      // great cities guard their main gates with a barbican projecting in front of the gatehouse
      const barb = city.resolved.walls === 'double' || city.resolved.bastions;
      if (barb) {
        const bp = add(gt.p, mul(gt.dir, city.moat > 0 ? city.moat + 6 : WALL_T.outer / 2 + 6.5));
        const pts: number[] = [];
        for (const [u, v] of [[-7, -4.5], [7, -4.5], [6, 4.5], [-6, 4.5]]) pts.push(bp[0] + gt.tan[0] * u + gt.dir[0] * v, bp[1] + gt.tan[1] * u + gt.dir[1] * v);
        g.fillStyle = T.shadow;
        g.beginPath();
        pf(g, pts.map((v, i) => v + (i % 2 ? 1.6 : 1.3)));
        g.fill();
        g.fillStyle = T.wall;
        g.strokeStyle = T.wallEdge;
        g.lineWidth = 0.9;
        g.beginPath();
        pf(g, pts);
        g.fill();
        g.stroke();
        g.fillStyle = T.bailey;
        const ip: number[] = [];
        for (const [u, v] of [[-4.6, -2.6], [4.6, -2.6], [4, 2.6], [-4, 2.6]]) ip.push(bp[0] + gt.tan[0] * u + gt.dir[0] * v, bp[1] + gt.tan[1] * u + gt.dir[1] * v);
        g.beginPath();
        pf(g, ip);
        g.fill();
        g.fillStyle = T.road;
        g.beginPath();
        const op: number[] = [];
        for (const [u, v] of [[-1.8, 2.4], [1.8, 2.4], [1.8, 4.9], [-1.8, 4.9]]) op.push(bp[0] + gt.tan[0] * u + gt.dir[0] * v, bp[1] + gt.tan[1] * u + gt.dir[1] * v);
        pf(g, op);
        g.fill();
      }
      gatehouse(g, T, gt.p, gt.tan, gt.dir, 16, WALL_T.outer + 4, T.road);
    }
  }
  void S;
}

function drawBridges(g: G, city: City, T: Theme) {
  for (const b of city.bridges) {
    const a = add(b.m, mul(b.dir, -b.len / 2)),
      c = add(b.m, mul(b.dir, b.len / 2));
    const n: Pt = [-b.dir[1], b.dir[0]];
    const hw = b.w / 2;
    // masonry piers with pointed cutwaters on both faces
    const np = Math.max(1, Math.round(b.len / 9) - 1);
    for (let i = 1; i <= np; i++) {
      const q = add(a, mul(sub(c, a), i / (np + 1)));
      for (const s of [-1, 1]) {
        const base1 = add(q, add(mul(n, s * hw), mul(b.dir, -1.3)));
        const base2 = add(q, add(mul(n, s * hw), mul(b.dir, 1.3)));
        const tip = add(q, mul(n, s * (hw + 2.4)));
        g.fillStyle = T.wall;
        g.strokeStyle = T.wallEdge;
        g.lineWidth = 0.6;
        g.beginPath();
        pp(g, [base1, tip, base2]);
        g.fill();
        g.stroke();
      }
    }
    g.fillStyle = 'rgba(30,40,40,0.25)';
    g.beginPath();
    pf(g, [a[0] + n[0] * hw + 1, a[1] + n[1] * hw + 1.4, c[0] + n[0] * hw + 1, c[1] + n[1] * hw + 1.4, c[0] - n[0] * hw + 1, c[1] - n[1] * hw + 1.4, a[0] - n[0] * hw + 1, a[1] - n[1] * hw + 1.4]);
    g.fill();
    g.fillStyle = T.roadMain;
    g.strokeStyle = T.wallEdge;
    g.lineWidth = 0.9;
    g.lineCap = 'butt';
    g.beginPath();
    pf(g, [a[0] + n[0] * hw, a[1] + n[1] * hw, c[0] + n[0] * hw, c[1] + n[1] * hw, c[0] - n[0] * hw, c[1] - n[1] * hw, a[0] - n[0] * hw, a[1] - n[1] * hw]);
    g.fill();
    g.beginPath();
    g.moveTo(a[0] + n[0] * hw, a[1] + n[1] * hw);
    g.lineTo(c[0] + n[0] * hw, c[1] + n[1] * hw);
    g.moveTo(a[0] - n[0] * hw, a[1] - n[1] * hw);
    g.lineTo(c[0] - n[0] * hw, c[1] - n[1] * hw);
    g.stroke();
    g.strokeStyle = T.roadEdge;
    g.lineWidth = 0.5;
    g.beginPath();
    for (let i = 1; i < 6; i++) {
      const p = add(a, mul(sub(c, a), i / 6));
      g.moveTo(p[0] + n[0] * hw, p[1] + n[1] * hw);
      g.lineTo(p[0] - n[0] * hw, p[1] - n[1] * hw);
    }
    g.stroke();
    g.lineCap = 'round';
    if (b.tower) gatehouse(g, T, b.m, n, b.dir, b.w + 7, 8, T.roadMain);
  }
}

function drawPiers(g: G, city: City, T: Theme) {
  for (const p of city.piers) {
    g.strokeStyle = 'rgba(30,40,40,0.28)';
    g.lineWidth = p.w;
    g.lineCap = 'butt';
    g.beginPath();
    g.moveTo(p.a[0] + 1, p.a[1] + 1.4);
    g.lineTo(p.b[0] + 1, p.b[1] + 1.4);
    g.stroke();
    g.strokeStyle = T.wallEdge;
    g.lineWidth = p.w + 0.9;
    g.beginPath();
    g.moveTo(p.a[0], p.a[1]);
    g.lineTo(p.b[0], p.b[1]);
    g.stroke();
    g.strokeStyle = T.wood;
    g.lineWidth = p.w;
    g.stroke();
    g.lineCap = 'round';
  }
  const bt = city.boats;
  for (let i = 0; i < bt.length; i += 5) {
    const x = bt[i],
      y = bt[i + 1],
      a = bt[i + 2],
      len = bt[i + 3],
      w = bt[i + 4];
    const co = Math.cos(a),
      si = Math.sin(a);
    const hull: number[] = [];
    for (let k = 0; k <= 12; k++) {
      const u = -1 + (2 * k) / 12;
      const hw = (w / 2) * Math.pow(Math.max(0, 1 - u * u), 0.65);
      hull.push(x + (u * len) / 2 * co - hw * si, y + (u * len) / 2 * si + hw * co);
    }
    for (let k = 12; k >= 0; k--) {
      const u = -1 + (2 * k) / 12;
      const hw = -(w / 2) * Math.pow(Math.max(0, 1 - u * u), 0.65);
      hull.push(x + (u * len) / 2 * co - hw * si, y + (u * len) / 2 * si + hw * co);
    }
    g.fillStyle = 'rgba(30,50,60,0.25)';
    g.beginPath();
    pf(g, hull.map((v, j) => v + (j % 2 ? 1.1 : 0.8)));
    g.fill();
    g.fillStyle = T.wood;
    g.strokeStyle = T.wallEdge;
    g.lineWidth = 0.5;
    g.beginPath();
    pf(g, hull);
    g.fill();
    g.stroke();
    g.strokeStyle = 'rgba(240,225,190,0.7)';
    g.lineWidth = 0.6;
    g.beginPath();
    g.moveTo(x - (len * 0.34) * co, y - (len * 0.34) * si);
    g.lineTo(x + (len * 0.34) * co, y + (len * 0.34) * si);
    g.stroke();
    if (len > 11) {
      g.fillStyle = 'rgba(245,238,220,0.92)';
      g.beginPath();
      pf(g, [x - si * w * 0.1, y + co * w * 0.1, x + co * len * 0.2 - si * w * 0.9, y + si * len * 0.2 + co * w * 0.9, x - co * len * 0.2 - si * w * 0.9, y - si * len * 0.2 + co * w * 0.9]);
      g.fill();
    }
  }
}

function drawBuildings(g: G, city: City, T: Theme, o: RenderOpts, detail: boolean) {
  const view = o.view;
  const list: Building[] = [];
  for (const b of city.buildings) if (vis(view, b.bb)) list.push(b);
  const cs = list.map(comp);
  // shadows
  g.fillStyle = T.shadow;
  g.beginPath();
  for (const c of cs) {
    for (const s of c.shadow) pf(g, s);
    for (const s of c.shc) circle(g, s[0], s[1], s[2]);
  }
  g.fill();
  if (o.footprints) {
    // plan view: flat tone per palette + clear outlines
    const buckets = new Map<string, number[][]>();
    list.forEach((b, i) => {
      const k = b.pal + '|' + b.ci;
      let l = buckets.get(k);
      if (!l) buckets.set(k, (l = []));
      for (const p of cs[i].plan) l.push(p);
    });
    for (const [k, polys] of buckets) {
      const [pal, ci] = k.split('|');
      g.fillStyle = hsl(T.pal[pal][+ci], 8);
      g.beginPath();
      for (const p of polys) pf(g, p);
      g.fill();
    }
    g.fillStyle = hsl(T.pal.stone[0], 0);
    g.beginPath();
    for (const c of cs) for (const x of c.circ) circle(g, x.x, x.y, x.r);
    g.fill();
  } else {
    for (let layer = 0; layer < 3; layer++) {
      const buckets = new Map<string, number[][]>();
      for (const c of cs) for (const f of c.faces) if (f.layer === layer) {
        let l = buckets.get(f.key);
        if (!l) buckets.set(f.key, (l = []));
        l.push(f.pts);
      }
      for (const [key, polys] of buckets) {
        g.fillStyle = roofColor(T, key);
        g.strokeStyle = g.fillStyle;
        g.lineWidth = 0.35;
        g.beginPath();
        for (const p of polys) pf(g, p);
        g.fill();
        g.stroke();
      }
      const cb = new Map<string, { x: number; y: number; r: number }[]>();
      const hi = new Map<string, { x: number; y: number; r: number }[]>();
      for (const c of cs) for (const x of c.circ) if (x.layer === layer) {
        let l = cb.get(x.k0);
        if (!l) cb.set(x.k0, (l = []));
        l.push(x);
        if (x.cone) {
          let h = hi.get(x.k1);
          if (!h) hi.set(x.k1, (h = []));
          h.push(x);
        }
      }
      for (const [k, arr] of cb) {
        g.fillStyle = roofColor(T, k);
        g.beginPath();
        for (const x of arr) circle(g, x.x, x.y, x.r);
        g.fill();
      }
      for (const [k, arr] of hi) {
        g.fillStyle = roofColor(T, k);
        g.beginPath();
        for (const x of arr) circle(g, x.x - x.r * 0.18, x.y - x.r * 0.2, x.r * 0.66);
        g.fill();
      }
    }
    if (detail) {
      g.strokeStyle = 'rgba(255,248,230,0.3)';
      g.lineWidth = 0.4;
      g.lineCap = 'butt';
      g.beginPath();
      for (const c of cs) for (let i = 0; i < c.ridge.length; i += 4) {
        g.moveTo(c.ridge[i], c.ridge[i + 1]);
        g.lineTo(c.ridge[i + 2], c.ridge[i + 3]);
      }
      g.stroke();
      g.strokeStyle = 'rgba(40,30,20,0.4)';
      g.beginPath();
      for (const c of cs) for (const p of c.inner) pf(g, p);
      g.stroke();
      g.lineCap = 'round';
      if (o.scale > 2.2) {
        // tile / thatch courses parallel to the eaves
        g.strokeStyle = 'rgba(45,28,16,0.16)';
        g.lineWidth = 0.22;
        g.beginPath();
        for (const c of cs)
          for (const h of c.hatch) {
            const d0 = Math.hypot((h[0] + h[2]) / 2 - (h[4] + h[6]) / 2, (h[1] + h[3]) / 2 - (h[5] + h[7]) / 2);
            const n = Math.min(14, Math.floor(d0 / 0.95));
            for (let i = 1; i < n; i++) {
              const t = i / n;
              g.moveTo(h[0] + (h[4] - h[0]) * t, h[1] + (h[5] - h[1]) * t);
              g.lineTo(h[2] + (h[6] - h[2]) * t, h[3] + (h[7] - h[3]) * t);
            }
          }
        g.stroke();
      }
      if (o.scale > 1.4) {
        g.fillStyle = 'rgba(40,28,20,0.35)';
        g.beginPath();
        for (const c of cs) for (let i = 0; i < c.chim.length; i += 3) g.rect(c.chim[i] - c.chim[i + 2] + 0.5, c.chim[i + 1] - c.chim[i + 2] + 0.7, c.chim[i + 2] * 2, c.chim[i + 2] * 2);
        g.fill();
        g.fillStyle = '#8a6a5a';
        g.strokeStyle = 'rgba(40,28,20,0.7)';
        g.lineWidth = 0.25;
        g.beginPath();
        for (const c of cs) for (let i = 0; i < c.chim.length; i += 3) g.rect(c.chim[i] - c.chim[i + 2], c.chim[i + 1] - c.chim[i + 2], c.chim[i + 2] * 2, c.chim[i + 2] * 2);
        g.fill();
        g.stroke();
      }
    }
  }
  if (detail || o.footprints) {
    g.strokeStyle = T.outline;
    g.lineWidth = o.footprints ? 0.7 : 0.45;
    g.beginPath();
    for (const c of cs) {
      for (const p of c.outl) pf(g, p);
      for (const p of c.oc) circle(g, p[0], p[1], p[2]);
    }
    g.stroke();
  }
  // mill wheels
  for (const b of list) {
    if (!b.wheel) continue;
    const [x, y, a] = b.wheel;
    const co = Math.cos(a),
      si = Math.sin(a);
    const pts: number[] = [];
    for (const [u, v] of [[-1.3, -3], [1.3, -3], [1.3, 3], [-1.3, 3]]) pts.push(x + u * co - v * si, y + u * si + v * co);
    g.fillStyle = T.wood;
    g.strokeStyle = T.wallEdge;
    g.lineWidth = 0.5;
    g.beginPath();
    pf(g, pts);
    g.fill();
    g.stroke();
  }
}

function roofColor(T: Theme, key: string): string {
  const [pal, ci, d] = key.split('|');
  const base = T.pal[pal] ?? T.pal.tile;
  return hsl(base[+ci % base.length], +d);
}

function drawFeatures(g: G, city: City, T: Theme, view: [number, number, number, number] | undefined, S: number) {
  for (const f of city.features) {
    const [x, y] = f.p;
    if (view && (x < view[0] - 30 || x > view[2] + 30 || y < view[1] - 30 || y > view[3] + 30)) continue;
    g.lineWidth = 0.7;
    g.strokeStyle = T.wallEdge;
    switch (f.type) {
      case 'fountain':
        g.fillStyle = T.wallTop;
        g.beginPath(); circle(g, x, y, 5.2); g.fill(); g.stroke();
        g.fillStyle = T.river;
        g.beginPath(); circle(g, x, y, 3.8); g.fill();
        g.fillStyle = T.riverHi;
        g.beginPath(); circle(g, x, y, 1.4); g.fill();
        break;
      case 'well':
        g.fillStyle = T.wall;
        g.beginPath(); circle(g, x, y, 2.4); g.fill(); g.stroke();
        g.fillStyle = '#4a5a62';
        g.beginPath(); circle(g, x, y, 1.2); g.fill();
        break;
      case 'statue':
        g.fillStyle = 'rgba(40,30,20,0.28)';
        g.beginPath(); circle(g, x + 1, y + 1.2, 2.4); g.fill();
        g.fillStyle = T.wallTop;
        g.beginPath(); circle(g, x, y, 2.6); g.fill(); g.stroke();
        g.fillStyle = T.wall;
        g.beginPath(); circle(g, x, y, 1.1); g.fill();
        break;
      case 'obelisk':
        g.fillStyle = T.wallTop;
        g.beginPath(); sq(g, x, y, 3.4, Math.PI / 4); g.fill(); g.stroke();
        break;
      case 'shrine':
        g.fillStyle = T.wallTop;
        g.beginPath(); sq(g, x, y, 3, 0); g.fill(); g.stroke();
        g.beginPath(); g.moveTo(x, y - 1.2); g.lineTo(x, y + 1.2); g.moveTo(x - 1, y - 0.3); g.lineTo(x + 1, y - 0.3); g.stroke();
        break;
      case 'gallows':
        g.strokeStyle = T.ink;
        g.lineWidth = 1;
        g.beginPath(); g.moveTo(x - 3, y + 3); g.lineTo(x - 3, y - 3); g.lineTo(x + 3, y - 3); g.moveTo(x - 3, y - 1); g.lineTo(x - 1, y - 3); g.stroke();
        break;
      case 'watchtower':
        g.fillStyle = T.wall;
        g.beginPath(); sq(g, x, y, 6, 0); g.fill(); g.stroke();
        break;
      case 'lighthouse':
        g.fillStyle = 'rgba(40,30,20,0.28)';
        g.beginPath(); circle(g, x + 1.4, y + 1.8, 5); g.fill();
        g.fillStyle = T.wallTop;
        g.beginPath(); circle(g, x, y, 5); g.fill(); g.stroke();
        g.fillStyle = hsl(T.pal.tile[0], 4);
        g.beginPath(); circle(g, x, y, 3.2); g.fill();
        g.fillStyle = '#f4e6a0';
        g.beginPath(); circle(g, x, y, 1.4); g.fill();
        break;
      case 'windmill': {
        const rot = (f.id * 0.7) % 1.5;
        g.fillStyle = 'rgba(40,30,20,0.25)';
        g.beginPath(); circle(g, x + 1.2, y + 1.6, 4); g.fill();
        g.strokeStyle = T.ink;
        g.lineWidth = 0.9;
        g.beginPath();
        for (let k = 0; k < 4; k++) {
          const a = rot + (k * Math.PI) / 2;
          g.moveTo(x, y);
          g.lineTo(x + Math.cos(a) * 13, y + Math.sin(a) * 13);
        }
        g.stroke();
        g.fillStyle = 'rgba(240,232,210,0.9)';
        g.strokeStyle = T.wallEdge;
        g.lineWidth = 0.4;
        for (let k = 0; k < 4; k++) {
          const a = rot + (k * Math.PI) / 2;
          const nx = -Math.sin(a),
            ny = Math.cos(a);
          g.beginPath();
          pf(g, [x + Math.cos(a) * 4 + nx * 0, y + Math.sin(a) * 4, x + Math.cos(a) * 13, y + Math.sin(a) * 13, x + Math.cos(a) * 13 + nx * 3.2, y + Math.sin(a) * 13 + ny * 3.2, x + Math.cos(a) * 4 + nx * 3.2, y + Math.sin(a) * 4 + ny * 3.2]);
          g.fill();
          g.stroke();
        }
        g.fillStyle = T.wood;
        g.strokeStyle = T.wallEdge;
        g.lineWidth = 0.6;
        g.beginPath(); circle(g, x, y, 3.4); g.fill(); g.stroke();
        break;
      }
    }
  }
  void S;
}

function drawSelection(g: G, city: City, o: RenderOpts) {
  const sel = o.selection;
  if (!sel) return;
  const S = o.scale;
  g.strokeStyle = '#ffb300';
  g.lineWidth = 2 / S;
  if (sel.buildings && sel.buildings.size) {
    g.beginPath();
    for (const b of city.buildings) {
      if (!sel.buildings.has(b.id)) continue;
      for (const p of b.parts) {
        if (p.k === 'r') pf(g, p.p);
        else circle(g, p.p[0], p.p[1], p.p[2]);
      }
    }
    g.stroke();
  }
  if (sel.district !== undefined && sel.district >= 0) {
    const d = city.districts[sel.district];
    if (d) {
      g.lineWidth = 2.6 / S;
      g.setLineDash([6 / S, 4 / S]);
      g.beginPath();
      for (const id of d.cells) {
        const c = city.cells[id];
        const n = c.vids.length;
        for (let i = 0; i < n; i++) {
          if (c.nbrs[i] >= 0 && city.cells[c.nbrs[i]].district === d.id) continue;
          const a = city.verts[c.vids[i]],
            b = city.verts[c.vids[(i + 1) % n]];
          g.moveTo(a[0], a[1]);
          g.lineTo(b[0], b[1]);
        }
      }
      g.stroke();
      g.setLineDash([]);
    }
  }
  if (sel.vert !== undefined && sel.vert >= 0) {
    const p = city.verts[sel.vert];
    g.fillStyle = '#ffb300';
    g.strokeStyle = '#5a3a00';
    g.lineWidth = 1.2 / S;
    g.beginPath();
    circle(g, p[0], p[1], 5 / S);
    g.fill();
    g.stroke();
  }
  if (sel.feature !== undefined) {
    const f = city.features.find((x) => x.id === sel.feature);
    if (f) {
      g.beginPath();
      circle(g, f.p[0], f.p[1], 9);
      g.stroke();
    }
  }
}

function drawLabels(g: G, city: City, T: Theme, o: RenderOpts) {
  const S = o.scale;
  const view = o.view;
  const labels: Label[] = [];
  const majorList: number[] = [];
  let innList = 0;
  if (o.labels) {
    for (const b of city.buildings) {
      if (!b.name || !vis(view, b.bb)) continue;
      const major = b.type === 'cathedral' || b.type === 'temple' || b.type === 'keep' || b.type === 'townhall' || b.type === 'palace' || b.type === 'university';
      const mid2 = b.type === 'church' || b.type === 'guildhall' || b.type === 'market_hall';
      // only notable named buildings are labelled; shops/trades never (massive label noise)
      const inn = b.type === 'inn';
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
    if (S > 0.9)
      for (const f of city.features)
        if (f.type === 'lighthouse') labels.push({ text: 'Lighthouse', x: f.p[0], y: f.p[1] + 11, size: 4.4, rot: 0, prio: 3, font: BODY, halo: true });
        else if (f.type === 'windmill') labels.push({ text: 'Windmill', x: f.p[0], y: f.p[1] + 16, size: 4.4, rot: 0, prio: 5, font: BODY, halo: true });
  }
  if (o.districtLabels && S < 1.7) {
    for (const d of city.districts) {
      if (d.type === 'market') continue;
      let best = city.cells[d.cells[0]],
        bd = Infinity;
      for (const id of d.cells) {
        const c = city.cells[id];
        const dd = dist(c.center, d.center);
        if (dd < bd) (bd = dd), (best = c);
      }
      const size = Math.min(22, Math.max(9, 12 / S + 2)) * (d.cells.length > 4 ? 1.1 : 0.9);
      const text = d.name.toUpperCase().split('').join(d.name.length < 16 ? '\u200A' : '');
      labels.push({ text, x: best.center[0], y: best.center[1] + size * 0.3, size, rot: 0, prio: 1, font: FONT, alpha: 0.62, halo: false, color: d.color ?? undefined });
    }
  }
  if (o.roadLabels && S > 0.55) {
    for (const st of city.streets) {
      if (st.kind !== 'arterial') continue;
      let best: [Pt, Pt] | null = null,
        bl = 0;
      for (let i = 0; i < st.vids.length - 1; i++) {
        const k = edgeKey(st.vids[i], st.vids[i + 1]);
        if (!city.edges[k] || (city.edges[k] !== 'arterial' && city.edges[k] !== 'secondary')) continue;
        const a = city.verts[st.vids[i]],
          b = city.verts[st.vids[i + 1]];
        const l = dist(a, b);
        if (l > bl) (bl = l), (best = [a, b]);
      }
      const size = 4.6;
      if (!best || bl < textW(st.name, size) + 6) continue;
      let [a, b] = best;
      let ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
      if (Math.abs(ang) > Math.PI / 2) {
        ang += Math.PI;
        [a, b] = [b, a];
      }
      const m = mid(a, b);
      if (!vis(view, [m[0], m[1], m[0], m[1]])) continue;
      labels.push({ text: st.name, x: m[0], y: m[1], size, rot: ang, prio: 6, font: BODY, halo: false, color: T.ink, alpha: 0.78 });
    }
  }
  labels.sort((a, b) => a.prio - b.prio);
  const placed: [number, number, number, number][] = [];
  g.textAlign = 'center';
  g.textBaseline = 'alphabetic';
  for (const l of labels) {
    const w = textW(l.text, l.size) * (l.font === FONT ? 1.12 : 1),
      h = l.size * 1.1;
    const bb: [number, number, number, number] = l.rot === 0 ? [l.x - w / 2, l.y - h, l.x + w / 2, l.y + h * 0.3] : [l.x - w / 2 * 0.8, l.y - w / 2 * 0.5, l.x + w / 2 * 0.8, l.y + w / 2 * 0.5];
    if (l.rot !== 0) {
      const c = Math.abs(Math.cos(l.rot)),
        s = Math.abs(Math.sin(l.rot));
      const hw = (w * c + h * s) / 2,
        hh = (w * s + h * c) / 2;
      bb[0] = l.x - hw; bb[2] = l.x + hw; bb[1] = l.y - hh; bb[3] = l.y + hh;
    }
    if (placed.some((p) => !(bb[2] < p[0] || bb[0] > p[2] || bb[3] < p[1] || bb[1] > p[3]))) continue;
    placed.push(bb);
    g.save();
    g.translate(l.x, l.y);
    if (l.rot) g.rotate(l.rot);
    g.font = `${l.font === FONT ? 'bold ' : ''}${l.size.toFixed(2)}px ${l.font}`;
    g.globalAlpha = l.alpha ?? 1;
    if (l.halo !== false) {
      g.strokeStyle = T.halo;
      g.lineWidth = l.size * 0.28;
      g.lineJoin = 'round';
      g.strokeText(l.text, 0, 0);
    } else if (l.font === FONT) {
      g.strokeStyle = T.halo;
      g.lineWidth = l.size * 0.16;
      g.strokeText(l.text, 0, 0);
    }
    g.fillStyle = l.color ? (l.font === FONT ? T.ink : l.color) : T.ink;
    g.fillText(l.text, 0, 0);
    g.restore();
  }
  g.globalAlpha = 1;
}

/** Title cartouche, compass and scale bar in a rectangle (x,y,w,h); u = size unit, wpp = world units per pixel-ish for the scale bar. */
export function drawFrame(g: G, city: City, x: number, y: number, w: number, h: number, u: number, worldPerUnit: number, themeName: ThemeName, legend = false) {
  const T = THEMES[themeName];
  if (legend) drawLegend(g, city, x, y, w, h, u, T);
  g.save();
  g.lineJoin = 'miter';
  g.lineCap = 'butt';
  g.strokeStyle = T.frame;
  g.lineWidth = 3 * u;
  g.strokeRect?.(x + 6 * u, y + 6 * u, w - 12 * u, h - 12 * u);
  g.lineWidth = 1 * u;
  g.strokeRect?.(x + 11 * u, y + 11 * u, w - 22 * u, h - 22 * u);
  // title
  const st = city.settlement;
  const flavour: Record<string, string> = { plains: 'the open country', hills: 'the hills', coast: 'the coast', mountain: 'the high passes' };
  const idn = st.tierIndex >= 2 ? identityOf(city.params.identity).label : `${st.label} of ${flavour[city.resolved.geo] ?? 'the realm'}`;
  g.font = `bold ${26 * u}px ${FONT}`;
  const tw = Math.max(textW(city.name, 26 * u) * 1.18, textW(idn, 11 * u) * 1.3) + 36 * u;
  const bx = x + 24 * u,
    by = y + 24 * u,
    bh = 62 * u;
  g.fillStyle = themeName === 'parchment' ? 'rgba(244,234,205,0.92)' : 'rgba(250,246,232,0.92)';
  g.strokeStyle = T.frame;
  g.lineWidth = 1.6 * u;
  g.beginPath();
  g.rect(bx, by, tw, bh);
  g.fill();
  g.stroke();
  g.lineWidth = 0.7 * u;
  g.beginPath();
  g.rect(bx + 3 * u, by + 3 * u, tw - 6 * u, bh - 6 * u);
  g.stroke();
  g.textAlign = 'center';
  g.fillStyle = T.ink;
  g.fillText(city.name, bx + tw / 2, by + 33 * u);
  g.font = `italic ${11 * u}px ${BODY}`;
  g.fillText(idn, bx + tw / 2, by + 50 * u);
  // compass rose
  const cx = x + w - 62 * u,
    cy = y + h - 62 * u,
    r = 32 * u;
  g.fillStyle = 'rgba(244,236,214,0.7)';
  g.strokeStyle = T.frame;
  g.lineWidth = 1.2 * u;
  g.beginPath();
  g.arc(cx, cy, r + 4 * u, 0, Math.PI * 2);
  g.fill();
  g.stroke();
  for (let i = 0; i < 4; i++) {
    const a = (i * Math.PI) / 2 - Math.PI / 2;
    const rr = i === 0 ? r : r * 0.8;
    g.fillStyle = i === 0 ? '#9c3b2e' : T.frame;
    g.beginPath();
    g.moveTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr);
    g.lineTo(cx + Math.cos(a + 0.35) * r * 0.22, cy + Math.sin(a + 0.35) * r * 0.22);
    g.lineTo(cx, cy);
    g.closePath();
    g.fill();
    g.fillStyle = T.frame;
    g.beginPath();
    g.moveTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr);
    g.lineTo(cx + Math.cos(a - 0.35) * r * 0.22, cy + Math.sin(a - 0.35) * r * 0.22);
    g.lineTo(cx, cy);
    g.closePath();
    g.fill();
  }
  g.font = `bold ${12 * u}px ${FONT}`;
  g.fillStyle = T.ink;
  g.textAlign = 'center';
  g.fillText('N', cx, cy - r - 8 * u);
  // scale bar
  const target = 130 * u * worldPerUnit;
  const nice = [10, 20, 25, 50, 100, 200, 250, 500, 1000].reduce((p, c) => (Math.abs(c - target) < Math.abs(p - target) ? c : p));
  const bw = nice / worldPerUnit;
  const sx = x + 26 * u,
    sy = y + h - 34 * u;
  g.fillStyle = 'rgba(244,236,214,0.75)';
  g.beginPath();
  g.rect(sx - 8 * u, sy - 18 * u, bw + 16 * u, 34 * u);
  g.fill();
  g.strokeStyle = T.frame;
  g.lineWidth = 1.4 * u;
  g.beginPath();
  g.rect(sx, sy - 3 * u, bw, 6 * u);
  g.stroke();
  g.fillStyle = T.frame;
  g.beginPath();
  g.rect(sx, sy - 3 * u, bw / 2, 6 * u);
  g.rect(sx + bw / 2, sy - 3 * u, bw / 4, 6 * u);
  g.fill();
  g.font = `${10 * u}px ${BODY}`;
  g.textAlign = 'left';
  g.fillStyle = T.ink;
  g.fillText('0', sx - 2 * u, sy + 14 * u);
  g.textAlign = 'right';
  g.fillText(`${nice} m`, sx + bw + 2 * u, sy + 14 * u);
  g.restore();
}

export const WARD_COLOR = (t: Theme, w: WardType) => t.ward[w];

/** Legend: district index (colour swatch + name + type) and a key of map symbols, top-right of the frame. */
export function drawLegend(g: G, city: City, x: number, y: number, w: number, h: number, u: number, T: Theme) {
  const ds = city.districts.filter((d) => d.type !== 'market');
  const rowH = 13 * u;
  const keys: [string, (cx: number, cy: number) => void][] = [
    ['City gate', (cx, cy) => { g.fillStyle = T.wall; g.strokeStyle = T.wallEdge; g.lineWidth = 0.8 * u; g.beginPath(); g.rect(cx - 6 * u, cy - 3 * u, 12 * u, 6 * u); g.fill(); g.stroke(); g.fillStyle = T.road; g.fillRect(cx - 1.6 * u, cy - 3 * u, 3.2 * u, 6 * u); }],
    ['Postern', (cx, cy) => { g.fillStyle = T.wall; g.strokeStyle = T.wallEdge; g.lineWidth = 0.8 * u; g.beginPath(); g.rect(cx - 3.5 * u, cy - 3.5 * u, 7 * u, 7 * u); g.fill(); g.stroke(); }],
    ['Tower', (cx, cy) => { g.fillStyle = T.wall; g.strokeStyle = T.wallEdge; g.lineWidth = 0.8 * u; g.beginPath(); g.arc(cx, cy, 4 * u, 0, Math.PI * 2); g.fill(); g.stroke(); }],
    ['Bridge', (cx, cy) => { g.fillStyle = T.river; g.fillRect(cx - 7 * u, cy - 4 * u, 14 * u, 8 * u); g.fillStyle = T.roadMain; g.strokeStyle = T.wallEdge; g.lineWidth = 0.7 * u; g.beginPath(); g.rect(cx - 2.5 * u, cy - 5 * u, 5 * u, 10 * u); g.fill(); g.stroke(); }],
    ['Market / square', (cx, cy) => { g.fillStyle = T.plaza; g.strokeStyle = T.roadEdge; g.lineWidth = 0.7 * u; g.beginPath(); g.rect(cx - 6 * u, cy - 4 * u, 12 * u, 8 * u); g.fill(); g.stroke(); g.fillStyle = T.stall[0]; g.fillRect(cx - 3 * u, cy - 1.5 * u, 2.5 * u, 3 * u); g.fillStyle = T.stall[2]; g.fillRect(cx + 0.8 * u, cy - 1.5 * u, 2.5 * u, 3 * u); }],
    ['Garden / green', (cx, cy) => { g.fillStyle = T.garden; g.fillRect(cx - 6 * u, cy - 4 * u, 12 * u, 8 * u); g.fillStyle = T.forest[0]; g.beginPath(); g.arc(cx + 2 * u, cy, 2.6 * u, 0, Math.PI * 2); g.fill(); }],
  ];
  const bw = 178 * u;
  const bh = (ds.length + keys.length) * rowH + 54 * u;
  const bx = x + w - bw - 24 * u,
    by = y + 24 * u;
  if (bh > h - 140 * u) return;
  g.save();
  g.lineJoin = 'miter';
  g.fillStyle = T.paper ? 'rgba(244,234,205,0.93)' : 'rgba(250,246,232,0.93)';
  g.strokeStyle = T.frame;
  g.lineWidth = 1.4 * u;
  g.beginPath();
  g.rect(bx, by, bw, bh);
  g.fill();
  g.stroke();
  g.fillStyle = T.ink;
  g.textAlign = 'left';
  g.font = `bold ${10.5 * u}px ${FONT}`;
  g.fillText('DISTRICTS', bx + 10 * u, by + 16 * u);
  let cy = by + 30 * u;
  g.font = `${10 * u}px ${BODY}`;
  ds.forEach((d, i) => {
    g.fillStyle = d.color ?? T.ward[d.type];
    g.strokeStyle = 'rgba(60,40,20,0.5)';
    g.lineWidth = 0.6 * u;
    g.beginPath();
    g.rect(bx + 10 * u, cy - 7.5 * u, 9 * u, 9 * u);
    g.fill();
    g.stroke();
    g.fillStyle = T.ink;
    const name = d.name.length > 24 ? d.name.slice(0, 23) + '…' : d.name;
    g.fillText(`${i + 1}. ${name}`, bx + 25 * u, cy);
    cy += rowH;
  });
  cy += 6 * u;
  g.font = `bold ${10.5 * u}px ${FONT}`;
  g.fillStyle = T.ink;
  g.fillText('KEY', bx + 10 * u, cy);
  cy += 14 * u;
  g.font = `${10 * u}px ${BODY}`;
  for (const [label, sym] of keys) {
    g.save();
    sym(bx + 17 * u, cy - 3.5 * u);
    g.restore();
    g.fillStyle = T.ink;
    g.textAlign = 'left';
    g.fillText(label, bx + 32 * u, cy);
    cy += rowH;
  }
  g.restore();
}
