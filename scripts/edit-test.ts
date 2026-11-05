import { generateCity } from '../src/engine/generate';
import { DEFAULT_PARAMS } from '../src/engine/params';
import * as E from '../src/engine/edit';
import { exportJSON, importJSON, exportSVG } from '../src/engine/export';
import { DEFAULT_OPTS } from '../src/engine/render';
const c = generateCity({ ...DEFAULT_PARAMS, seed: 'edit', identity: 'merchant' });
console.log('base', c.buildings.length, c.report.errors);
// regenerate district
const before = new Map(c.buildings.map(b=>[b.id,b.bb.join()]));
const d = c.districts.find(x=>x.type==='residential')!;
E.regenerateDistrict(c, d.id);
const other = c.buildings.filter(b=>!d.cells.includes(b.cell));
console.log('district regen: untouched others', other.every(b=>before.get(b.id)===b.bb.join()), 'errors', c.report.errors);
E.setDistrictType(c, d.id, 'scholar'); console.log('type change', d.name, c.report.errors);
// vertex move
let moved=0; for (let v=0; v<c.verts.length && moved<5; v++) if (E.vertexMovable(c,v)) { const p=c.verts[v]; if (E.moveVertex(c,v,[p[0]+6,p[1]-5])) moved++; }
console.log('moved verts', moved, c.report.errors);
// add / move / delete building
const cell = c.cells.find(x=>x.kind==='city' && x.layout==='blocks' && x.ward==='residential')!;
let placed=0; for (const cc of [cell]) for (let i=0;i<30;i++){ const r = E.placeBuilding(c,'house',[cc.center[0]+Math.cos(i)*20, cc.center[1]+Math.sin(i)*20]); if (typeof r!=='string') placed++; }
console.log('placed', placed);
const g = c.gates.find(g=>g.kind==='main')!; console.log(E.toggleGate(c, g.vid), E.toggleGate(c, g.vid));
const j = importJSON(exportJSON(c)); console.log('roundtrip', j.buildings.length===c.buildings.length, j.name);
const svg = exportSVG(j, DEFAULT_OPTS); console.log('svg', svg.length);
console.log(c.report.errors, c.report.warnings);
