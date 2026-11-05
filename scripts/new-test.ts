import { generateCity } from '../src/engine/generate';
import { DEFAULT_PARAMS } from '../src/engine/params';
import * as E from '../src/engine/edit';
import { snapshot, restore, importJSON, exportJSON } from '../src/engine/export';
import { poly } from '../src/engine/plan';
import { isConvex } from '../src/engine/geom';
const c = generateCity({ ...DEFAULT_PARAMS, seed: 'concave', identity: 'merchant' });
const s0 = snapshot(c);
let concave = 0, tried = 0;
for (let v = 0; v < c.verts.length && concave < 4; v++) {
  if (!E.vertexMovable(c, v)) continue;
  const inc = c.cells.filter(x => x.vids.includes(v));
  const cen = inc[0].center, p = c.verts[v];
  tried++;
  // push the junction deep into one block -> makes neighbours concave
  if (E.moveVertex(c, v, [p[0] + (cen[0] - p[0]) * 0.55, p[1] + (cen[1] - p[1]) * 0.55])) {
    if (c.cells.filter(x => x.vids.includes(v)).some(x => !isConvex(poly(c, x)))) concave++;
  }
}
console.log('tried', tried, 'concave edits', concave, 'errors', c.report.errors, 'buildings', c.buildings.length);
const r = restore(s0);
console.log('undo restore buildings', r.buildings.length, 'verts equal', JSON.stringify(r.verts) === JSON.stringify(JSON.parse(s0).verts));
const j = JSON.parse(exportJSON(c)); j.version = 1; delete j.city.quays; j.city.version = 1;
const m = importJSON(JSON.stringify(j));
console.log('migrated version', m.version, 'quays', Array.isArray(m.quays));
