import { Noise } from './rng';
import { clamp, smooth } from './geom';
import { City } from './types';
import { Theme } from './theme';
import { makeElev } from './plan';

/** Soft hill-shaded ground bitmap (browser only). */
export function terrainCanvas(city: City, theme: Theme): HTMLCanvasElement | null {
  if (typeof document === 'undefined') return null;
  const cache = ((city as any)._terr ??= {}) as Record<string, HTMLCanvasElement>;
  if (cache[theme.name]) return cache[theme.name];
  const N = 320;
  const cv = document.createElement('canvas');
  cv.width = cv.height = N;
  const g = cv.getContext('2d')!;
  const img = g.createImageData(N, N);
  const elev = makeElev(city.terrain);
  const nz = new Noise(city.terrain.seed + 5);
  const [x0, y0, x1] = city.bounds;
  const sx = (x1 - x0) / N;
  const k = 7 + city.terrain.amt * 5;
  for (let j = 0; j < N; j++)
    for (let i = 0; i < N; i++) {
      const wx = x0 + (i + 0.5) * sx,
        wy = y0 + (j + 0.5) * sx;
      const e = elev(wx, wy);
      const dx = elev(wx + sx, wy) - elev(wx - sx, wy),
        dy = elev(wx, wy + sx) - elev(wx, wy - sx);
      const shade = clamp((dx + dy) * k, -0.35, 0.35);
      const patch = nz.fbm(wx / 180 + 40, wy / 180 + 12, 3);
      const rock = smooth(0.95, 1.5, e) * (city.resolved.geo === 'mountain' ? 1 : 0.5);
      const t = clamp(patch * 1.1 + e * 0.12, 0, 1);
      const o = (j * N + i) * 4;
      for (let c = 0; c < 3; c++) {
        let v = theme.grassLo[c] + (theme.grassHi[c] - theme.grassLo[c]) * t;
        v = v + (theme.rock[c] - v) * rock;
        v *= 1 + shade * 0.8;
        v += (nz.get(wx / 7, wy / 7) - 0.5) * 5;
        img.data[o + c] = clamp(v, 0, 255);
      }
      img.data[o + 3] = 255;
    }
  g.putImageData(img, 0, 0);
  cache[theme.name] = cv;
  return cv;
}

/** marching-squares contour segments, flat [x0,y0,x1,y1,...] */
export function contours(city: City): number[] {
  const c = ((city as any)._contour ??= (() => {
    const elev = makeElev(city.terrain);
    const [x0, y0, x1] = city.bounds;
    const N = 110;
    const s = (x1 - x0) / N;
    const grid: number[][] = [];
    for (let j = 0; j <= N; j++) {
      const row: number[] = [];
      for (let i = 0; i <= N; i++) row.push(elev(x0 + i * s, y0 + j * s));
      grid.push(row);
    }
    const out: number[] = [];
    const step = 0.09;
    for (let j = 0; j < N; j++)
      for (let i = 0; i < N; i++) {
        const v = [grid[j][i], grid[j][i + 1], grid[j + 1][i + 1], grid[j + 1][i]];
        const P = [[i, j], [i + 1, j], [i + 1, j + 1], [i, j + 1]];
        const mn = Math.min(...v),
          mx = Math.max(...v);
        for (let L = Math.ceil(mn / step) * step; L < mx; L += step) {
          const pts: number[] = [];
          for (let e = 0; e < 4; e++) {
            const a = v[e],
              b = v[(e + 1) % 4];
            if (a < L !== b < L) {
              const t = (L - a) / (b - a);
              const pa = P[e],
                pb = P[(e + 1) % 4];
              pts.push(x0 + (pa[0] + (pb[0] - pa[0]) * t) * s, y0 + (pa[1] + (pb[1] - pa[1]) * t) * s);
            }
          }
          if (pts.length === 4) out.push(...pts);
          else if (pts.length === 8) out.push(pts[0], pts[1], pts[2], pts[3], pts[4], pts[5], pts[6], pts[7]);
        }
      }
    return out;
  })()) as number[];
  return c;
}

/** Hill-shading overlay masked to the city ground: relief stays legible inside the walls without tinting streets. */
export function cityShadeCanvas(city: City): HTMLCanvasElement | null {
  if (typeof document === 'undefined') return null;
  const cache = ((city as any)._terr ??= {}) as Record<string, HTMLCanvasElement>;
  if (cache.cityShade) return cache.cityShade;
  const N = 400;
  const cv = document.createElement('canvas');
  cv.width = cv.height = N;
  const g = cv.getContext('2d')!;
  const img = g.createImageData(N, N);
  const elev = makeElev(city.terrain);
  const [x0, y0, x1] = city.bounds;
  const sx = (x1 - x0) / N;
  const k = 9 + city.terrain.amt * 6;
  for (let j = 0; j < N; j++)
    for (let i = 0; i < N; i++) {
      const wx = x0 + (i + 0.5) * sx,
        wy = y0 + (j + 0.5) * sx;
      const dx = elev(wx + sx, wy) - elev(wx - sx, wy),
        dy = elev(wx, wy + sx) - elev(wx, wy - sx);
      const shade = clamp((dx + dy) * k, -0.5, 0.5);
      const o = (j * N + i) * 4;
      const lit = shade < 0;
      img.data[o] = lit ? 255 : 40;
      img.data[o + 1] = lit ? 250 : 28;
      img.data[o + 2] = lit ? 235 : 16;
      img.data[o + 3] = Math.round(Math.abs(shade) * 255);
    }
  g.putImageData(img, 0, 0);
  // mask to city cells
  g.globalCompositeOperation = 'destination-in';
  g.fillStyle = '#000';
  g.beginPath();
  for (const c of city.cells) {
    if (c.kind !== 'city' || c.vids.length < 3) continue;
    c.vids.forEach((v, n) => {
      const p = city.verts[v];
      const X = (p[0] - x0) / sx, Y = (p[1] - y0) / sx;
      if (n === 0) g.moveTo(X, Y);
      else g.lineTo(X, Y);
    });
    g.closePath();
  }
  g.fill();
  g.globalCompositeOperation = 'source-over';
  cache.cityShade = cv;
  return cv;
}
