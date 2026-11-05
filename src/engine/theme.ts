import type { WardType } from './types';

export type ThemeName = 'daylight' | 'parchment';
type HSL = [number, number, number];

export interface Theme {
  name: ThemeName;
  bg: string;
  grassLo: [number, number, number];
  grassHi: [number, number, number];
  rock: [number, number, number];
  seaShallow: string;
  seaDeep: string;
  seaShore: string;
  wave: string;
  riverBank: string;
  river: string;
  riverHi: string;
  road: string; // streets (ground inside city)
  roadMain: string;
  roadEdge: string;
  outerRoad: string;
  outerRoadEdge: string;
  yard: string;
  rural: string;
  ruralPad: string;
  plaza: string;
  lawn: string;
  garden: string;
  gardenDirt: string;
  parade: string;
  bailey: string;
  wall: string;
  wallEdge: string;
  wallTop: string;
  shadow: string;
  outline: string;
  ink: string;
  halo: string;
  contour: string;
  field: string[];
  furrow: string;
  forest: string[];
  forestDark: string;
  pal: Record<string, HSL[]>;
  ward: Record<WardType, string>;
  stall: string[];
  wood: string;
  frame: string;
  paper: boolean;
}

export const THEMES: Record<ThemeName, Theme> = {
  daylight: {
    name: 'daylight',
    bg: '#c9d3a0',
    grassLo: [170, 192, 124],
    grassHi: [208, 214, 156],
    rock: [150, 146, 132],
    seaShallow: '#93c6cc',
    seaDeep: '#6fa9ba',
    seaShore: '#d9e8d2',
    wave: 'rgba(235,248,250,0.55)',
    riverBank: '#5f98a6',
    river: '#86bcc8',
    riverHi: '#a9d3dc',
    road: '#f0e7d2',
    roadMain: '#f3ecd9',
    roadEdge: 'rgba(120,100,70,0.35)',
    outerRoad: '#e0d3ac',
    outerRoadEdge: '#b9a678',
    yard: '#cdbf9b',
    rural: '#bcc78d',
    ruralPad: '#c9b98e',
    plaza: '#f3ead4',
    lawn: '#b3c887',
    garden: '#a6c07a',
    gardenDirt: '#cdbf99',
    parade: '#d8c79d',
    bailey: '#ddd2b6',
    wall: '#a8a295',
    wallEdge: '#4e473f',
    wallTop: '#cfc9ba',
    shadow: 'rgba(48,36,24,0.27)',
    outline: 'rgba(54,38,28,0.6)',
    ink: '#3d2c1c',
    halo: 'rgba(250,244,228,0.92)',
    contour: 'rgba(120,100,70,0.22)',
    field: ['#dccf8c', '#b0c47c', '#c0a672', '#cdc890'],
    furrow: 'rgba(110,90,50,0.28)',
    forest: ['#6c9a58', '#5b8a4c', '#7aa863'],
    forestDark: 'rgba(40,70,36,0.35)',
    pal: {
      tile: [[9, 50, 52], [5, 46, 47], [13, 52, 56], [7, 42, 43]],
      terracotta: [[18, 62, 57], [22, 64, 53], [13, 56, 49], [26, 60, 60]],
      slate: [[214, 13, 50], [208, 11, 43], [220, 15, 54], [204, 12, 39]],
      thatch: [[42, 48, 58], [38, 42, 52], [46, 50, 62], [34, 40, 47]],
      timber: [[27, 40, 42], [23, 36, 37], [32, 42, 47], [19, 32, 35]],
      stone: [[40, 9, 67], [37, 11, 61], [42, 7, 73], [35, 10, 57]],
      dark: [[25, 11, 31], [218, 9, 33], [30, 13, 37], [208, 9, 28]],
    },
    ward: {
      citadel: '#9a7fb0', market: '#e0a050', noble: '#b67aa6', merchant: '#d98a4a', residential: '#c9b36a', artisan: '#7fa8c8',
      industrial: '#8a8a8a', religious: '#e6d86a', harbour: '#5aa7bd', military: '#c25a4e', poor: '#8f6e4c', scholar: '#6fbf9a',
    },
    stall: ['#c8503c', '#e8e0c8', '#d2a23c', '#4c7aa8', '#7a9a4c', '#b05a8c'],
    wood: '#8b6a44',
    frame: '#5b4630',
    paper: false,
  },
  parchment: {
    name: 'parchment',
    bg: '#e6d7ad',
    grassLo: [226, 212, 168],
    grassHi: [238, 227, 187],
    rock: [190, 170, 135],
    seaShallow: '#c7cfb9',
    seaDeep: '#b3c0ae',
    seaShore: '#efe3bf',
    wave: 'rgba(90,75,50,0.35)',
    riverBank: '#8a8f78',
    river: '#bfc8b0',
    riverHi: '#d3d9c3',
    road: '#f6ecd2',
    roadMain: '#f7efd6',
    roadEdge: 'rgba(90,65,35,0.35)',
    outerRoad: '#eadfba',
    outerRoadEdge: '#bba980',
    yard: '#d8c69c',
    rural: '#c6c69a',
    ruralPad: '#d2c09a',
    plaza: '#f4ebcf',
    lawn: '#d4d29a',
    garden: '#cdcb92',
    gardenDirt: '#dccb9c',
    parade: '#e0cd9c',
    bailey: '#eadcb6',
    wall: '#bfae8c',
    wallEdge: '#4a3523',
    wallTop: '#dccfae',
    shadow: 'rgba(70,45,20,0.25)',
    outline: 'rgba(66,42,22,0.62)',
    ink: '#3a2615',
    halo: 'rgba(244,234,205,0.92)',
    contour: 'rgba(110,80,40,0.25)',
    field: ['#e5d49a', '#d8d29c', '#dcc794', '#e0d6a6'],
    furrow: 'rgba(110,80,40,0.28)',
    forest: ['#a8a870', '#9a9c66', '#b2b17a'],
    forestDark: 'rgba(80,70,40,0.3)',
    pal: {
      tile: [[12, 36, 54], [8, 33, 50], [15, 38, 58], [10, 30, 46]],
      terracotta: [[18, 44, 58], [22, 46, 55], [14, 40, 52], [26, 42, 60]],
      slate: [[30, 8, 52], [28, 8, 46], [34, 9, 56], [26, 7, 42]],
      thatch: [[42, 38, 62], [38, 34, 56], [46, 40, 66], [34, 32, 51]],
      timber: [[26, 30, 44], [22, 28, 40], [30, 32, 49], [18, 26, 37]],
      stone: [[38, 10, 70], [35, 12, 64], [40, 8, 76], [33, 11, 60]],
      dark: [[25, 12, 36], [28, 10, 38], [30, 13, 42], [24, 9, 32]],
    },
    ward: {
      citadel: '#9a6aa0', market: '#e09a40', noble: '#b0607a', merchant: '#d07a3a', residential: '#c2a850', artisan: '#6a98b8',
      industrial: '#7a7468', religious: '#e0c850', harbour: '#5a9aa0', military: '#b84a40', poor: '#8a6240', scholar: '#6ab090',
    },
    stall: ['#b8503a', '#eadfc0', '#c89a38', '#6a7a8a', '#8a9448', '#a45c78'],
    wood: '#8a6540',
    frame: '#4a3523',
    paper: true,
  },
};

const hslCache = new Map<string, string>();
export function hsl(c: HSL, dl: number): string {
  const key = c[0] + ',' + c[1] + ',' + c[2] + ',' + dl;
  let s = hslCache.get(key);
  if (!s) {
    s = `hsl(${c[0]},${c[1]}%,${Math.max(8, Math.min(92, c[2] + dl)).toFixed(1)}%)`;
    hslCache.set(key, s);
  }
  return s;
}
