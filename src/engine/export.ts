import { City } from './types';
import { SvgContext } from './svgctx';
import { drawMap, drawFrame, RenderOpts } from './render';
import { Pt } from './geom';
import { DEFAULT_PARAMS } from './params';
import { settlementFor } from './settlement';

export function cityBounds(city: City, margin = 110): [number, number, number, number] {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const c of city.cells)
    if (c.kind === 'city')
      for (const v of c.vids) {
        const p: Pt = city.verts[v];
        x0 = Math.min(x0, p[0]); y0 = Math.min(y0, p[1]); x1 = Math.max(x1, p[0]); y1 = Math.max(y1, p[1]);
      }
  return [x0 - margin, y0 - margin, x1 + margin, y1 + margin];
}

export function exportSVG(city: City, o: RenderOpts): string {
  const [x0, y0, x1, y1] = cityBounds(city);
  const W = x1 - x0, H = y1 - y0;
  const g = new SvgContext(x0, y0, W, H);
  const scale = 1600 / W;
  drawMap(g as any, city, { ...o, scale, view: [x0, y0, x1, y1], selection: undefined });
  drawFrame(g as any, city, x0, y0, W, H, W / 1200, 1, o.theme, true);
  return g.toString();
}

export function exportPNG(city: City, o: RenderOpts, width: number): Promise<Blob> {
  const [x0, y0, x1, y1] = cityBounds(city);
  const W = x1 - x0, H = y1 - y0;
  const scale = width / W;
  const cv = document.createElement('canvas');
  cv.width = Math.round(width);
  cv.height = Math.round(H * scale);
  const g = cv.getContext('2d')!;
  g.setTransform(scale, 0, 0, scale, -x0 * scale, -y0 * scale);
  drawMap(g, city, { ...o, scale, view: [x0, y0, x1, y1], selection: undefined });
  g.setTransform(scale, 0, 0, scale, -x0 * scale, -y0 * scale);
  drawFrame(g, city, x0, y0, W, H, W / 1200, 1, o.theme, true);
  return new Promise((res, rej) => cv.toBlob((b) => (b ? res(b) : rej(new Error('PNG export failed'))), 'image/png'));
}

/** Current project-file schema. Bump when the City data model changes and add a step to MIGRATIONS. */
export const SCHEMA_VERSION = 3;

const MIGRATIONS: Record<number, (c: any) => void> = {
  // v2 -> v3: settlements became population-driven
  2: (c) => {
    c.params = { ...DEFAULT_PARAMS, ...c.params };
    c.settlement = settlementFor(c.params);
  },
  // v1 -> v2: harbour quays list, posterns introduced, cells may be concave
  1: (c) => {
    c.quays ??= [];
    for (const g of c.gates ?? []) g.kind ??= 'main';
    for (const cell of c.cells ?? []) for (const k of ['blocks', 'open', 'cuts', 'yards', 'trees', 'stalls', 'graves']) cell[k] ??= [];
  },
};

export function migrate(c: any, from: number): City {
  for (let v = from; v < SCHEMA_VERSION; v++) MIGRATIONS[v]?.(c);
  c.version = SCHEMA_VERSION;
  return c as City;
}

const strip = (k: string, v: unknown) => (k.startsWith('_') ? undefined : typeof v === 'number' ? Math.round(v * 100) / 100 : v);

export function exportJSON(city: City): string {
  return JSON.stringify({ format: 'medieval-city-generator', version: SCHEMA_VERSION, city }, strip);
}

/** Lossless deep copy without render caches (used by undo/redo). */
export function snapshot(city: City): string {
  return JSON.stringify(city, (k, v) => (k.startsWith('_') ? undefined : v));
}
export function restore(s: string): City {
  return JSON.parse(s) as City;
}

export function importJSON(text: string): City {
  const o = JSON.parse(text);
  const c = o?.city as City | undefined;
  if (o?.format !== 'medieval-city-generator' || !c || !Array.isArray(c.cells) || !Array.isArray(c.verts) || !Array.isArray(c.buildings)) throw new Error('Not a Medieval City Generator project file');
  const from = Number(o.version ?? c.version ?? 1);
  if (from > SCHEMA_VERSION) throw new Error(`Project was saved by a newer version (schema ${from})`);
  migrate(c, from);
  c.params = { ...DEFAULT_PARAMS, ...c.params };
  if (!c.settlement) c.settlement = settlementFor(c.params);
  return c;
}

export function download(name: string, data: Blob | string, type = 'text/plain') {
  const blob = typeof data === 'string' ? new Blob([data], { type }) : data;
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}
