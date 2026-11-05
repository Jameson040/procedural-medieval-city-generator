import { generateCity } from '../src/engine/generate';
import { DEFAULT_PARAMS } from '../src/engine/params';
const c = generateCity({ ...DEFAULT_PARAMS, seed: 'ft30000royal', identity: 'royal', population: 30000 });
console.log('attempts', c.report.attempts, JSON.stringify(c.report.errors));
