import { writeFileSync } from 'fs';
import { generateCity } from '../src/engine/generate';
import { DEFAULT_PARAMS } from '../src/engine/params';
import { SvgContext } from '../src/engine/svgctx';
import { drawMap, drawFrame, DEFAULT_OPTS } from '../src/engine/render';
import { Resvg } from '@resvg/resvg-js';
const [,, seed='alpha', identity='merchant', theme='daylight', zoom='full', out='/tmp/city'] = process.argv;
const city = generateCity({ ...DEFAULT_PARAMS, seed, identity: identity as any });
console.log(city.name, city.report.errors, city.report.warnings, city.report.stats);
let bb = [Infinity,Infinity,-Infinity,-Infinity];
for (const c of city.cells) if (c.kind==='city') for (const v of c.vids) { const p=city.verts[v]; bb=[Math.min(bb[0],p[0]),Math.min(bb[1],p[1]),Math.max(bb[2],p[0]),Math.max(bb[3],p[1])]; }
const m=120; let x0=bb[0]-m,y0=bb[1]-m,x1=bb[2]+m,y1=bb[3]+m;
if (zoom==='zoom' || zoom==='close') { const mc=city.cells[city.marketCell].center; const hw = zoom==='close'?75:170, hh = zoom==='close'?52:120; x0=mc[0]-hw;x1=mc[0]+hw;y0=mc[1]-hh;y1=mc[1]+hh; }
if (zoom==='gate') { const gt=city.gates.find(g=>g.kind==='main')!; x0=gt.p[0]-90;x1=gt.p[0]+90;y0=gt.p[1]-62;y1=gt.p[1]+62; }
const W=x1-x0,H=y1-y0; const px=1600; const scale=px/W;
const g = new SvgContext(x0,y0,W,H);
drawMap(g as any, city, { ...DEFAULT_OPTS, theme: theme as any, scale, view:[x0,y0,x1,y1], terrain:false, districts: false });
if (zoom==='full') drawFrame(g as any, city, x0,y0,W,H, W/1200, 1, theme as any, true);
const svg = g.toString();
writeFileSync(out+'.svg', svg);
const r = new Resvg(svg, { fitTo: { mode: 'width', value: px }, font: { loadSystemFonts: true } });
writeFileSync(out+'.png', r.render().asPng());
console.log('svg bytes', svg.length);
