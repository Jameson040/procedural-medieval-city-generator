import { generateCity } from '../src/engine/generate';
import { DEFAULT_PARAMS, IDENTITIES } from '../src/engine/params';
let bad = 0, n = 0;
for (const idn of IDENTITIES) for (const s of ['omega', 'kappa', 'zeta']) for (const k of [5, 8, 11]) {
  const c = generateCity({ ...DEFAULT_PARAMS, seed: s, identity: idn.id, districtCount: k });
  const free = c.districts.filter((d) => !(d.cells.length === 1 && [c.marketCell, c.citadelCell, c.cathedralCell].includes(d.cells[0]))).length;
  const cit = c.cells[c.citadelCell];
  const mc = c.cells[c.marketCell];
  const dm = cit ? Math.hypot(cit.center[0] - mc.center[0], cit.center[1] - mc.center[1]) : -1;
  n++;
  if (c.report.errors.length) bad++;
  if (k === 8) console.log(idn.id.padEnd(11), s.padEnd(6), `want ${k} got ${free}`, `citadel depth=${cit?.depth} dMarket=${Math.round(dm)}`, `posterns=${c.gates.filter(g=>g.kind==='postern').length}`, `quays=${c.quays?.length ?? 0}`, c.report.errors.join('|'));
  else if (Math.abs(free - k) > 1) console.log('  count off', idn.id, s, k, free);
}
console.log('cities', n, 'with errors', bad);
