import { generateCity } from '../src/engine/generate';
import { DEFAULT_PARAMS } from '../src/engine/params';
import { estimatePopulation } from '../src/engine/settlement';
for (const pop of [40, 300, 1500, 6000, 25000]) {
  const t = Date.now();
  const c = generateCity({ ...DEFAULT_PARAMS, seed: 'set' + pop, population: pop });
  const est = estimatePopulation(c.buildings);
  console.log(
    'pop', String(pop).padStart(6),
    'tier', c.settlement.tier.padEnd(9),
    'blocks', String(c.cells.filter(x=>x.kind==='city').length).padStart(4),
    'bldgs', String(c.buildings.length).padStart(5),
    'est', String(est).padStart(6),
    'districts', String(c.districts.length).padStart(2),
    'gates', String(c.gates.length).padStart(2),
    'wall', c.settlement.wall.padEnd(6),
    'ms', String(Date.now() - t).padStart(5),
    c.report.errors.join(' | '),
  );
}
