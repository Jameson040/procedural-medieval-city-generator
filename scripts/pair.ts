import { generateCity } from '../src/engine/generate';
import { DEFAULT_PARAMS } from '../src/engine/params';
import { satOverlap } from '../src/engine/geom';
import { partPoly } from '../src/engine/buildings';
const c = generateCity({ ...DEFAULT_PARAMS, seed: 'ft30000royal', identity: 'royal', population: 30000 });
const polys = c.buildings.map(b => b.parts.map(partPoly));
for (let i = 0; i < c.buildings.length; i++)
  for (let j = i + 1; j < c.buildings.length; j++) {
    const a = c.buildings[i], b = c.buildings[j];
    if (a.bb[2] < b.bb[0] || b.bb[2] < a.bb[0] || a.bb[3] < b.bb[1] || b.bb[3] < a.bb[1]) continue;
    let hit = false;
    for (const pa of polys[i]) for (const pb of polys[j]) if (satOverlap(pa, pb, 0.2)) hit = true;
    if (hit) console.log('PAIR', a.id, a.type, a.manual, a.bb.map(x=>Math.round(x)).join(','), '|', b.id, b.type, b.manual, b.bb.map(x=>Math.round(x)).join(','), 'cells', a.cell, b.cell);
  }
