// Orchestrates the staged pipeline. Each stage consumes the output of the previous one.
import { Params, cityName, DEFAULT_PARAMS } from './params';
import { RNG } from './rng';
import { City } from './types';
import { estimatePopulation } from './settlement';
import { createCtx, buildMesh, makeRiver, selectCity, classifyEdges } from './plan';
import { chooseMarket, buildInnerWall, planGates, planBridges, routeStreets, assignWidths, planPlazas } from './roads';
import { chooseAnchors, assignDistricts } from './districts';
import { buildWalls, buildHarbour, finalizeGround, buildFeaturesAndDecor, buildSuburbs } from './fortify';
import { buildCell, repairOverlaps } from './buildings';
import { validateCity } from './validate';

function generateOnce(params: Params, seed: string, attempt: number): City {
  const { ctx } = createCtx(params, seed);
  const city = ctx.city;
  buildMesh(ctx); // 1. geography + planar mesh
  if (!makeRiver(ctx)) throw new Error('river routing failed'); // 2. water
  selectCity(ctx);
  classifyEdges(ctx);
  chooseMarket(ctx);
  buildInnerWall(ctx);
  planGates(ctx); // 3. gates + outer roads
  const plans = planBridges(ctx);
  chooseAnchors(ctx);
  routeStreets(ctx, plans, [city.citadelCell, city.cathedralCell].filter((x) => x >= 0)); // 3-4. arterials & secondary streets
  assignDistricts(ctx); // 5. districts
  assignWidths(ctx);
  planPlazas(ctx);
  buildWalls(ctx); // 10. defences
  buildHarbour(ctx);
  finalizeGround(ctx);
  const stats = { repaired: 0, dropped: 0 };
  for (const c of city.cells) if (c.kind === 'city') buildCell(city, c, stats); // 6-9. blocks, plots, buildings, landmarks
  buildSuburbs(ctx);
  buildFeaturesAndDecor(ctx); // 11. environment
  repairOverlaps(city, stats); // final safety net before validation
  city.name = params.name.trim() || cityName(new RNG(params.seed + '#name'));
  city.settlement.population = estimatePopulation(city.buildings);
  city.report = validateCity(city, stats, attempt); // 12. validation
  return city;
}

/** Generates a city; if validation finds critical problems the geometry is regenerated from a derived sub-seed. */
export function generateCity(params: Params = DEFAULT_PARAMS): City {
  let best: City | null = null;
  let lastErr: unknown = null;
  const MAX = 10;
  for (let attempt = 0; attempt < MAX; attempt++) {
    const seed = attempt === 0 ? params.seed : `${params.seed}~${attempt}`;
    try {
      const c = generateOnce(params, seed, attempt + 1);
      if (!best || c.report.errors.length < best.report.errors.length) best = c;
      if (c.report.errors.length === 0) return c;
    } catch (e) {
      lastErr = e;
    }
  }
  if (best) return best;
  throw lastErr ?? new Error('generation failed');
}
