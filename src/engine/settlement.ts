// Settlement model: a target population plus a seed determines the whole settlement,
// from a hamlet of a dozen farmsteads to a megacity of tens of thousands of souls.
import { Params, identityOf } from './params';
import { clamp, lerp } from './geom';

export type Tier = 'hamlet' | 'village' | 'town' | 'city' | 'megacity';

export interface TierSpec {
  tier: Tier;
  label: string;
  max: number; // upper population bound of the tier
  /** area of one household plot in world units */
  plotArea: number;
  /** area of one urban block in world units */
  cellArea: number;
  /** buildings per block (derived) */
  bpb: number;
  wall: 'none' | 'outer' | 'double';
  market: boolean;
  marketCells: number;
  cathedral: boolean;
  citadel: boolean;
  church: boolean;
  university: boolean;
  districts: number; // fixed for small tiers, -1 = use the user setting
  peoplePerBuilding: number;
  suburbs: boolean;
  blurb: string;
}

export const TIERS: TierSpec[] = [
  {
    tier: 'hamlet', label: 'Hamlet', max: 150, plotArea: 1500, cellArea: 6000, bpb: 3, wall: 'none', market: false, marketCells: 0,
    cathedral: false, citadel: false, church: false, university: false, districts: 1, peoplePerBuilding: 3.5, suburbs: false,
    blurb: 'A few farmsteads around a well or a crossroads.',
  },
  {
    tier: 'village', label: 'Village', max: 900, plotArea: 700, cellArea: 8000, bpb: 8.9, wall: 'none', market: false, marketCells: 0,
    cathedral: false, citadel: false, church: true, university: false, districts: 2, peoplePerBuilding: 3.6, suburbs: false,
    blurb: 'A church, a mill and a handful of hamlets around it.',
  },
  {
    tier: 'town', label: 'Town', max: 4500, plotArea: 400, cellArea: 8000, bpb: 14.5, wall: 'outer', market: true, marketCells: 1,
    cathedral: false, citadel: false, church: true, university: false, districts: 3, peoplePerBuilding: 5.0, suburbs: true,
    blurb: 'A market town: one square, guild houses, a church and town walls.',
  },
  {
    tier: 'city', label: 'City', max: 18000, plotArea: 300, cellArea: 11000, bpb: 29, wall: 'outer', market: true, marketCells: 1,
    cathedral: true, citadel: true, church: true, university: true, districts: -1, peoplePerBuilding: 4.8, suburbs: true,
    blurb: 'A walled city with a cathedral, a citadel and busy quarters.',
  },
  {
    tier: 'megacity', label: 'Megacity', max: Infinity, plotArea: 240, cellArea: 15000, bpb: 50, wall: 'double', market: true, marketCells: 2,
    cathedral: true, citadel: true, church: true, university: true, districts: -2, peoplePerBuilding: 4.6, suburbs: true,
    blurb: 'A great city of many quarters, two markets and ring walls.',
  },
];

export const tierOf = (pop: number): TierSpec => {
  for (const t of TIERS) if (pop < t.max) return t;
  return TIERS[TIERS.length - 1];
};

export interface Settlement {
  tier: Tier;
  label: string;
  blurb: string;
  population: number;
  blocks: number;
  plotScale: number;
  cellArea: number;
  wall: 'none' | 'outer' | 'double';
  moat: boolean;
  market: boolean;
  marketCells: number;
  cathedral: boolean;
  citadel: boolean;
  church: boolean;
  university: boolean;
  harbour: boolean;
  river: boolean;
  riverWidth: number;
  districts: number;
  gates: number;
  suburbs: boolean;
  peoplePerBuilding: number;
  targetBuildings: number;
  radius: number;
  /** population band this settlement sits in (for the UI) */
  tierIndex: number;
}

/** Plot size of a household parcel, used to derive the style scale. */
const BASE_RESIDENTIAL_MIN = 86;
/** Empirical factor between a style's minimum plot area and the realised plot area. */
const PLOT_FACTOR = 0.95;

/** Calibration hook (development only): overrides the plot scale to measure density. */
export const CALIBRATION: { plotScale?: number } = {};

export function settlementFor(p: Params): Settlement {
  const pop = Math.max(8, Math.round(p.population));
  const spec = tierOf(pop);
  const idn = identityOf(p.identity);
  const tierIndex = TIERS.indexOf(spec);

  // urban grain: the city-density setting decides how large the blocks are
  const grain = lerp(0.72, 1.55, clamp(p.cityDensity, 0, 1));
  const cellArea = spec.cellArea * grain;
  const targetBuildings = Math.max(3, Math.round(pop / spec.peoplePerBuilding));
  const bpb = cellArea / spec.plotArea;
  const blocks = clamp(Math.round(targetBuildings / bpb), 3, 330);
  const radius = Math.sqrt((blocks * cellArea) / Math.PI) * 1.06;
  // building density tightens or loosens the plots
  const dens = lerp(1.3, 0.82, clamp(p.buildingDensity, 0, 1));
  const plotScale = (spec.plotArea / (BASE_RESIDENTIAL_MIN * PLOT_FACTOR)) * dens;

  // walls: the tier decides by default, the user may still override
  let wall: Settlement['wall'] = spec.wall;
  if (p.walls !== 'auto') wall = p.walls;
  else if (tierIndex >= 3 && idn.walls === 'double') wall = 'double';
  if (tierIndex <= 1 && p.walls === 'auto') wall = 'none';

  const geoCoast = p.geography === 'coast' || (p.geography === 'auto' && idn.geo === 'coast');
  let river = p.river === 'auto' ? idn.river && !geoCoast : p.river === 'river';
  if (tierIndex <= 1 && p.river === 'auto') river = false;
  const harbour =
    tierIndex >= 2 &&
    (p.harbour === 'yes' || (p.harbour === 'auto' && idn.harbour && (river || geoCoast)));

  const districts =
    spec.districts === -1
      ? clamp(p.districtCount, 4, 12)
      : spec.districts === -2
        ? clamp(p.districtCount + 5, 12, 18)
        : spec.districts;

  const gates = wall === 'none' ? 0 : tierIndex <= 2 ? 2 : tierIndex === 3 ? idn.gates : idn.gates + 1;

  return {
    tier: spec.tier,
    label: spec.label,
    blurb: spec.blurb,
    population: pop,
    blocks,
    plotScale: CALIBRATION.plotScale ?? plotScale,
    cellArea,
    wall,
    moat: p.moat === 'yes' || (p.moat === 'auto' && idn.moat && tierIndex >= 3 && wall !== 'none'),
    market: spec.market,
    marketCells: spec.marketCells,
    cathedral: spec.cathedral,
    citadel: spec.citadel,
    church: spec.church,
    university: spec.university && tierIndex >= 3,
    harbour,
    river,
    riverWidth: Math.max(5, Math.round(p.riverWidth * (tierIndex === 0 ? 0.4 : tierIndex === 1 ? 0.65 : 1))),
    districts,
    gates,
    suburbs: spec.suburbs,
    peoplePerBuilding: spec.peoplePerBuilding,
    targetBuildings,
    radius,
    tierIndex,
  };
}

/** Rough number of people living in a building of a given type (for the achieved-population readout). */
export const PEOPLE_BY_TYPE: Record<string, number> = {
  house: 4.2, hovel: 3.4, house_l: 6.5, merchant: 5.2, workshop: 3.4, warehouse: 2.2, inn: 6, tavern: 7,
  market_hall: 2.5, church: 1, cathedral: 2, temple: 1, guildhall: 3, barracks: 22, stable: 2, mill: 3,
  smithy: 3, bakery: 4, townhall: 4, palace: 26, keep: 18, granary: 1, hospital: 14, university: 18,
  monastery: 24, manor: 12, chapel: 1, barn: 1.5,
};

export function estimatePopulation(buildings: { type: string; h: number }[]): number {
  let n = 0;
  for (const b of buildings) n += PEOPLE_BY_TYPE[b.type] ?? 4;
  return Math.round(n);
}

export const lerpTier = (a: number, b: number, t: number) => lerp(a, b, clamp(t, 0, 1));
