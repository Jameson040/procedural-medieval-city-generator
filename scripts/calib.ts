import { generateCity } from '../src/engine/generate';
import { DEFAULT_PARAMS } from '../src/engine/params';
import { CALIBRATION } from '../src/engine/settlement';
const pops: [number, number][] = [[40, 3], [300, 8.9], [1500, 14.5], [6000, 29], [25000, 50]];
for (const [pop, target] of pops) {
  const out: string[] = [];
  for (const k of [1.5, 2, 2.6, 3.2, 4, 5, 6.5, 8, 10, 14]) {
    CALIBRATION.plotScale = k;
    const c = generateCity({ ...DEFAULT_PARAMS, seed: 'cal' + pop, population: pop });
    const cells = c.cells.filter((x) => x.kind === 'city').length;
    out.push(`${k}:${(c.buildings.length / Math.max(1, cells)).toFixed(1)}`);
  }
  console.log('pop', String(pop).padStart(6), 'target', target, out.join(' '));
}
CALIBRATION.plotScale = undefined;
