// Seeded randomness + value noise. Same seed + settings => same city.

export function hashStr(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  h ^= h >>> 13;
  h = Math.imul(h, 0x5bd1e995);
  h ^= h >>> 15;
  return h >>> 0;
}

export class RNG {
  private s: number;
  constructor(seed: number | string) {
    this.s = (typeof seed === 'string' ? hashStr(seed) : seed >>> 0) || 0x9e3779b9;
    for (let i = 0; i < 4; i++) this.next();
  }
  next(): number {
    this.s = (this.s + 0x6d2b79f5) >>> 0;
    let t = this.s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  range(a: number, b: number): number {
    return a + (b - a) * this.next();
  }
  int(a: number, b: number): number {
    return Math.floor(this.range(a, b));
  }
  chance(p: number): boolean {
    return this.next() < p;
  }
  pick<T>(arr: readonly T[]): T {
    return arr[Math.floor(this.next() * arr.length) % arr.length];
  }
  normal(): number {
    // approx N(0,1)
    return (this.next() + this.next() + this.next() + this.next() - 2) * 1.732;
  }
  weighted<T>(items: readonly (readonly [T, number])[]): T {
    let tot = 0;
    for (const it of items) tot += Math.max(0, it[1]);
    if (tot <= 0) return items[0][0];
    let r = this.next() * tot;
    for (const it of items) {
      r -= Math.max(0, it[1]);
      if (r <= 0) return it[0];
    }
    return items[items.length - 1][0];
  }
  fork(label: string | number): RNG {
    return new RNG(hashStr(this.s + ':' + label));
  }
}

export class Noise {
  private seed: number;
  constructor(seed: number) {
    this.seed = seed | 0;
  }
  private h(ix: number, iy: number): number {
    let h = Math.imul(ix, 374761393) + Math.imul(iy, 668265263) + Math.imul(this.seed, 1442695041);
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  }
  get(x: number, y: number): number {
    const ix = Math.floor(x),
      iy = Math.floor(y);
    const fx = x - ix,
      fy = y - iy;
    const u = fx * fx * (3 - 2 * fx),
      v = fy * fy * (3 - 2 * fy);
    const a = this.h(ix, iy),
      b = this.h(ix + 1, iy),
      c = this.h(ix, iy + 1),
      d = this.h(ix + 1, iy + 1);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  }
  fbm(x: number, y: number, oct = 4): number {
    let s = 0,
      a = 0.5,
      f = 1,
      n = 0;
    for (let i = 0; i < oct; i++) {
      s += a * this.get(x * f, y * f);
      n += a;
      a *= 0.5;
      f *= 2.03;
    }
    return s / n;
  }
}

export const hash01 = (s: string) => hashStr(s) / 4294967296;
