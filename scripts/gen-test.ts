import { generateCity } from '../src/engine/generate';
import { DEFAULT_PARAMS, IDENTITIES } from '../src/engine/params';
const seeds = ['omega','sigma','kappa','zeta','theta'];
let total=0;
for (const idn of IDENTITIES) {
  for (const s of seeds.slice(0, 3)) {
    const t=Date.now();
    try {
      const c = generateCity({ ...DEFAULT_PARAMS, seed: s, identity: idn.id });
      console.log(idn.id.padEnd(11), s.padEnd(8), `att=${c.report.attempts} ms=${Date.now()-t}`, JSON.stringify(c.report.stats), c.report.errors.join(' | '));
    } catch (e:any) { console.log(idn.id, s, 'THROW', e.message, e.stack?.split('\n')[1]); }
    total++;
  }
}
