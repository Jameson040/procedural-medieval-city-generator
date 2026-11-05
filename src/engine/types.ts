import type { Pt } from './geom';
import type { Params, Resolved } from './params';
import type { Settlement } from './settlement';

export type WardType =
  | 'citadel'
  | 'market'
  | 'noble'
  | 'merchant'
  | 'residential'
  | 'artisan'
  | 'industrial'
  | 'religious'
  | 'harbour'
  | 'military'
  | 'poor'
  | 'scholar';

export type EdgeCls = 'minor' | 'secondary' | 'arterial' | 'wallO' | 'wallI' | 'river' | 'coast' | 'open';
export type Layout = 'blocks' | 'market' | 'cathedral' | 'church' | 'castle' | 'ring';
export type OpenKind = 'plaza' | 'lawn' | 'yard' | 'parade' | 'cloister' | 'garden' | 'bailey';
export type Roof = 'gable' | 'hip' | 'flat' | 'cone';

export type BType =
  | 'house'
  | 'house_l'
  | 'merchant'
  | 'workshop'
  | 'warehouse'
  | 'inn'
  | 'tavern'
  | 'market_hall'
  | 'church'
  | 'cathedral'
  | 'temple'
  | 'guildhall'
  | 'barracks'
  | 'stable'
  | 'mill'
  | 'smithy'
  | 'bakery'
  | 'townhall'
  | 'palace'
  | 'keep'
  | 'granary'
  | 'hospital'
  | 'university'
  | 'monastery'
  | 'manor'
  | 'chapel'
  | 'hovel'
  | 'barn';

/** A building part: rectangle (8 numbers, CCW corners) or circle ([x,y,r]) */
export interface Part {
  k: 'r' | 'c';
  p: number[];
  roof: Roof;
  /** rectangles: 0 => ridge runs along corner0->corner1 direction, 1 => along corner1->corner2 */
  along: 0 | 1;
}

export interface Building {
  id: number;
  type: BType;
  cell: number;
  parts: Part[];
  pal: string;
  ci: number;
  h: number;
  name?: string;
  manual?: boolean;
  bb: [number, number, number, number];
  wheel?: [number, number, number];
}

export interface Cut {
  p: Pt;
  d: Pt;
  w: number;
  a: Pt;
  b: Pt;
  kind: 'bridge' | 'lane';
}

export interface OpenArea {
  poly: number[];
  kind: OpenKind;
}

export interface Cell {
  id: number;
  vids: number[];
  nbrs: number[];
  kind: 'city' | 'outside' | 'sea';
  center: Pt;
  elev: number;
  ward?: WardType;
  district: number;
  layout: Layout;
  variant: number;
  inner: boolean;
  depth: number;
  locked?: boolean;
  // derived geometry
  ground: number[];
  blocks: number[][];
  open: OpenArea[];
  cuts: Cut[];
  yards: { p: number[]; k: number }[];
  trees: number[];
  stalls: number[];
  graves: number[];
  fort?: { wall: number[]; towers: number[]; gate: number[] };
}

export interface Tower {
  p: Pt;
  r: number;
  kind: 'round' | 'square' | 'bastion' | 'harbour';
  wall: 'outer' | 'inner' | 'sea';
  dir: Pt; // outward direction
}
export interface Gate {
  vid: number;
  p: Pt;
  kind: 'main' | 'postern' | 'inner' | 'water';
  wall: 'outer' | 'inner';
  edge?: string;
  tan: Pt; // wall tangent
  dir: Pt; // road direction (outward)
}
export interface WallRun {
  kind: 'outer' | 'inner' | 'sea';
  vids: number[];
  closed: boolean;
  t: number;
}
export interface Bridge {
  id: number;
  m: Pt;
  dir: Pt; // unit across the river
  cells: [number, number];
  w: number;
  len: number;
  main: boolean;
  tower: boolean;
  edge: [number, number];
}
export interface Street {
  name: string;
  vids: number[];
  kind: 'arterial' | 'secondary';
}
export interface Road {
  pts: Pt[];
  w: number;
  gate: number;
}
export interface Feature {
  id: number;
  type: 'fountain' | 'well' | 'statue' | 'obelisk' | 'shrine' | 'gallows' | 'windmill' | 'watchtower' | 'lighthouse';
  p: Pt;
  name?: string;
  cell?: number;
}
export interface District {
  id: number;
  type: WardType;
  name: string;
  cells: number[];
  color?: string;
  center: Pt;
}
export interface Report {
  errors: string[];
  warnings: string[];
  info: string[];
  stats: Record<string, number>;
  attempts: number;
}

export interface City {
  version: number;
  params: Params;
  settlement: Settlement;
  resolved: Resolved;
  name: string;
  bounds: [number, number, number, number];
  verts: Pt[];
  cells: Cell[];
  edges: Record<string, EdgeCls>;
  /** street width per edge key */
  ew: Record<string, number>;
  river: { vids: number[]; pts: Pt[]; w: number[]; ew: Record<string, number> } | null;
  walls: WallRun[];
  gates: Gate[];
  towers: Tower[];
  moat: number;
  bridges: Bridge[];
  streets: Street[];
  roads: Road[];
  plazas: { vid: number; r: number }[];
  features: Feature[];
  districts: District[];
  buildings: Building[];
  piers: { a: Pt; b: Pt; w: number }[];
  /** harbour edge keys lined with stone quays */
  quays?: string[];
  boats: number[];
  waves: number[];
  fields: { p: number[]; f: number[]; tone: number }[];
  forest: number[];
  terrain: { seed: number; amt: number; geo: string; ang: number };
  marketCell: number;
  citadelCell: number;
  cathedralCell: number;
  nextId: number;
  report: Report;
  seedUsed: string;
}

export const edgeKey = (a: number, b: number) => (a < b ? a + '_' + b : b + '_' + a);
