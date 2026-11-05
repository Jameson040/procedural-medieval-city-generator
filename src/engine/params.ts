import type { WardType } from './types';
import { RNG } from './rng';

export type IdentityId =
  | 'capital'
  | 'merchant'
  | 'riverport'
  | 'coastal'
  | 'hilltop'
  | 'royal'
  | 'industrial'
  | 'religious'
  | 'mountain'
  | 'ancient';

export type Geo = 'plains' | 'hills' | 'coast' | 'mountain';

export interface Params {
  seed: string;
  population: number; // target inhabitants
  name: string; // '' => generated
  identity: IdentityId;
  geography: 'auto' | Geo;
  river: 'auto' | 'none' | 'river';
  riverWidth: number; // 10..30
  harbour: 'auto' | 'yes' | 'no';
  cityDensity: number; // 0..1  : number of blocks inside the city
  buildingDensity: number; // 0..1 : plot size / fill
  roadComplexity: number; // 0..1
  districtCount: number; // 4..12
  walls: 'auto' | 'none' | 'outer' | 'double';
  moat: 'auto' | 'yes' | 'no';
  terrain: number; // 0..1 variation
}

export interface Resolved {
  geo: Geo;
  river: boolean;
  harbour: boolean;
  walls: 'none' | 'outer' | 'double';
  moat: boolean;
  gates: number;
  bastions: boolean;
  squareTowers: boolean;
  style: string;
}

export interface Identity {
  id: IdentityId;
  label: string;
  blurb: string;
  geo: Geo;
  river: boolean;
  harbour: boolean;
  walls: 'outer' | 'double';
  moat: boolean;
  gates: number;
  bastions: boolean;
  squareTowers: boolean;
  style: 'tile' | 'slate' | 'terracotta' | 'timber' | 'stone';
  /** seed weights for district types */
  ward: Partial<Record<WardType, number>>;
  densityBonus: number;
  windmills: number;
  citadel: 'edge' | 'high' | 'centre' | 'water';
  sacred: 'cathedral' | 'temple';
  poor: number;
}

export const IDENTITIES: Identity[] = [
  {
    id: 'capital', label: 'Dense Medieval Capital', blurb: 'Crowded, double-walled heart of a kingdom.',
    geo: 'plains', river: true, harbour: false, walls: 'double', moat: false, gates: 5, bastions: false, squareTowers: false, style: 'tile',
    ward: { residential: 5, merchant: 3, noble: 3, artisan: 3, religious: 2, scholar: 1.5, military: 1.5, poor: 2, industrial: 1 },
    densityBonus: 0.15, windmills: 2, citadel: 'edge', sacred: 'cathedral', poor: 0.5,
  },
  {
    id: 'merchant', label: 'Walled Merchant City', blurb: 'Warehouses, guilds and a great market square.',
    geo: 'plains', river: true, harbour: true, walls: 'outer', moat: false, gates: 5, bastions: false, squareTowers: false, style: 'timber',
    ward: { merchant: 5, residential: 4, artisan: 3, noble: 1.5, religious: 1.5, poor: 1.5, industrial: 1.5, military: 1 },
    densityBonus: 0.05, windmills: 2, citadel: 'edge', sacred: 'cathedral', poor: 0.4,
  },
  {
    id: 'riverport', label: 'River-Port City', blurb: 'Quays and warehouses on a navigable river.',
    geo: 'plains', river: true, harbour: true, walls: 'outer', moat: false, gates: 4, bastions: false, squareTowers: false, style: 'timber',
    ward: { merchant: 4, harbour: 3, residential: 4, artisan: 3, industrial: 2, religious: 1.5, poor: 2, noble: 1, military: 1 },
    densityBonus: 0.05, windmills: 1, citadel: 'water', sacred: 'cathedral', poor: 0.45,
  },
  {
    id: 'coastal', label: 'Coastal Trading City', blurb: 'A bay harbour with piers, fleets and sea walls.',
    geo: 'coast', river: false, harbour: true, walls: 'outer', moat: false, gates: 4, bastions: false, squareTowers: false, style: 'terracotta',
    ward: { merchant: 4, residential: 4, harbour: 3, artisan: 2, noble: 1.5, religious: 1.5, poor: 2, military: 1.5 },
    densityBonus: 0.05, windmills: 1, citadel: 'water', sacred: 'cathedral', poor: 0.45,
  },
  {
    id: 'hilltop', label: 'Hilltop Fortress City', blurb: 'A citadel crowning the highest ground.',
    geo: 'hills', river: false, harbour: false, walls: 'outer', moat: false, gates: 3, bastions: true, squareTowers: true, style: 'slate',
    ward: { military: 4, residential: 4, noble: 2, artisan: 2, religious: 1.5, poor: 2, merchant: 1.5 },
    densityBonus: 0.0, windmills: 1, citadel: 'high', sacred: 'cathedral', poor: 0.5,
  },
  {
    id: 'royal', label: 'Royal Administrative City', blurb: 'Palaces, scholars and orderly noble quarters.',
    geo: 'plains', river: true, harbour: false, walls: 'outer', moat: false, gates: 4, bastions: false, squareTowers: false, style: 'stone',
    ward: { noble: 5, scholar: 3, merchant: 2.5, residential: 4, religious: 2, military: 2, artisan: 2, poor: 1 },
    densityBonus: 0.0, windmills: 1, citadel: 'centre', sacred: 'cathedral', poor: 0.3,
  },
  {
    id: 'industrial', label: 'Industrial Medieval City', blurb: 'Mills, forges and tanneries along the water.',
    geo: 'plains', river: true, harbour: false, walls: 'outer', moat: false, gates: 4, bastions: false, squareTowers: false, style: 'slate',
    ward: { industrial: 5, artisan: 4, residential: 4, poor: 3, merchant: 2, religious: 1, military: 1 },
    densityBonus: 0.1, windmills: 3, citadel: 'edge', sacred: 'cathedral', poor: 0.6,
  },
  {
    id: 'religious', label: 'Religious City', blurb: 'A great cathedral, monasteries and pilgrims.',
    geo: 'plains', river: true, harbour: false, walls: 'outer', moat: false, gates: 4, bastions: false, squareTowers: false, style: 'stone',
    ward: { religious: 6, residential: 4, scholar: 2.5, artisan: 2, merchant: 2, noble: 1.5, poor: 1.5 },
    densityBonus: 0.0, windmills: 1, citadel: 'edge', sacred: 'cathedral', poor: 0.3,
  },
  {
    id: 'mountain', label: 'Mountain-Pass City', blurb: 'A tight walled town guarding a high pass.',
    geo: 'mountain', river: true, harbour: false, walls: 'outer', moat: false, gates: 2, bastions: true, squareTowers: true, style: 'slate',
    ward: { military: 3.5, residential: 4, artisan: 2.5, merchant: 2, poor: 2.5, religious: 1.5, noble: 1 },
    densityBonus: 0.05, windmills: 0, citadel: 'high', sacred: 'cathedral', poor: 0.55,
  },
  {
    id: 'ancient', label: 'Ancient Fortified City', blurb: 'Old double walls, a moat, temples and bastions.',
    geo: 'plains', river: true, harbour: false, walls: 'double', moat: true, gates: 4, bastions: true, squareTowers: true, style: 'terracotta',
    ward: { military: 3, residential: 4, religious: 3, noble: 2, artisan: 2, merchant: 2, poor: 1.5, scholar: 1 },
    densityBonus: 0.05, windmills: 0, citadel: 'high', sacred: 'temple', poor: 0.4,
  },
];

export const identityOf = (id: IdentityId) => IDENTITIES.find((i) => i.id === id) ?? IDENTITIES[0];

export const WARD_LABEL: Record<WardType, string> = {
  citadel: 'Royal Citadel',
  market: 'Grand Market',
  noble: 'Noble Quarter',
  merchant: 'Merchant Quarter',
  residential: 'Residential Quarter',
  artisan: 'Artisan Quarter',
  industrial: 'Industrial Quarter',
  religious: 'Religious Quarter',
  harbour: 'Harbour District',
  military: 'Military Quarter',
  poor: 'Poor Quarter',
  scholar: 'University Quarter',
};

export const DEFAULT_PARAMS: Params = {
  seed: 'Aldermoor',
  population: 6500,
  name: '',
  identity: 'merchant',
  geography: 'auto',
  river: 'auto',
  riverWidth: 18,
  harbour: 'auto',
  cityDensity: 0.55,
  buildingDensity: 0.55,
  roadComplexity: 0.5,
  districtCount: 8,
  walls: 'auto',
  moat: 'auto',
  terrain: 0.5,
};

export function resolveParams(p: Params): Resolved {
  const id = identityOf(p.identity);
  const geo: Geo = p.geography === 'auto' ? id.geo : p.geography;
  const walls = p.walls === 'auto' ? id.walls : p.walls;
  return {
    geo,
    river: false,
    harbour: false,
    walls,
    moat: false,
    gates: id.gates,
    bastions: id.bastions,
    squareTowers: id.squareTowers,
    style: id.style,
  };
}

const PRE = ['Ald', 'Bran', 'Cael', 'Dor', 'Eld', 'Fal', 'Gar', 'Hal', 'Iron', 'Kor', 'Lor', 'Mar', 'Nor', 'Os', 'Pel', 'Rav', 'Stor', 'Thorn', 'Val', 'Wyn', 'Ash', 'Brook', 'Crow', 'Dun', 'Elm', 'Frost', 'Gold', 'High', 'Lion', 'Oak', 'Salt', 'Silver', 'Stone', 'Wolf'];
const SUF = ['ford', 'haven', 'mere', 'wick', 'burg', 'stead', 'gate', 'bridge', 'crest', 'hold', 'port', 'minster', 'moor', 'watch', 'vale', 'wall', 'ton', 'brook'];

export function cityName(rng: RNG): string {
  return rng.pick(PRE) + rng.pick(SUF);
}
export function placeWord(rng: RNG): string {
  return rng.pick(PRE) + (rng.chance(0.5) ? rng.pick(SUF) : '');
}
export const SAINTS = ['Aldric', 'Brigid', 'Cuthbert', 'Edmund', 'Giles', 'Hilda', 'Martin', 'Odo', 'Swithin', 'Wulfstan', 'Ansgar', 'Clement', 'Eadburh', 'Leofric'];
export const GODS = ['Aurelia', 'Tharos', 'Vesper', 'Solenne', 'Karun'];
