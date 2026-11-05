import { generateCity } from '../src/engine/generate';
import { DEFAULT_PARAMS } from '../src/engine/params';
for (const [idn, pop] of [['merchant', 6000], ['coastal', 6000], ['mountain', 1500], ['ancient', 6000], ['industrial', 1500]] as [string, number][]) {
  const c = generateCity({ ...DEFAULT_PARAMS, seed: 'ft' + pop + idn, identity: idn as any, population: pop });
  console.log(idn, pop, 'att', c.report.attempts, JSON.stringify(c.report.errors), JSON.stringify(c.report.warnings));
}
