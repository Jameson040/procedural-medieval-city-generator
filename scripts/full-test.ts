import { generateCity } from '../src/engine/generate';
import { DEFAULT_PARAMS, IDENTITIES } from '../src/engine/params';
import { estimatePopulation } from '../src/engine/settlement';
const pops = [40, 300, 1500, 6000, 30000];
let bad = 0, n = 0;
for (const idn of IDENTITIES) {
  const line: string[] = [];
  for (const pop of pops) {
    const t = Date.now();
    const c = generateCity({ ...DEFAULT_PARAMS, seed: 'ft' + pop + idn.id, identity: idn.id, population: pop });
    const est = estimatePopulation(c.buildings);
    const ratio = est / pop;
    const ok = c.report.errors.length === 0 && ratio > 0.55 && ratio < 1.9;
    if (!ok) bad++;
    n++;
    line.push(`${c.settlement.tier[0]}${pop}:${c.buildings.length}b/${est}p${ok ? '' : '!'}${c.report.errors.length ? 'E' : ''}${Date.now() - t}ms`);
  }
  console.log(idn.id.padEnd(11), line.join('  '));
}
console.log('generated', n, 'problems', bad);
