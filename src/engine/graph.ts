// Small binary heap + Dijkstra over adjacency lists.
export class MinHeap {
  private k: number[] = [];
  private v: number[] = [];
  get size() {
    return this.k.length;
  }
  push(key: number, val: number) {
    const k = this.k,
      v = this.v;
    let i = k.length;
    k.push(key);
    v.push(val);
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (k[p] <= k[i]) break;
      [k[p], k[i]] = [k[i], k[p]];
      [v[p], v[i]] = [v[i], v[p]];
      i = p;
    }
  }
  pop(): [number, number] {
    const k = this.k,
      v = this.v;
    const rk = k[0],
      rv = v[0];
    const lk = k.pop()!,
      lv = v.pop()!;
    if (k.length) {
      k[0] = lk;
      v[0] = lv;
      let i = 0;
      const n = k.length;
      for (;;) {
        const l = i * 2 + 1,
          r = l + 1;
        let m = i;
        if (l < n && k[l] < k[m]) m = l;
        if (r < n && k[r] < k[m]) m = r;
        if (m === i) break;
        [k[m], k[i]] = [k[i], k[m]];
        [v[m], v[i]] = [v[i], v[m]];
        i = m;
      }
    }
    return [rk, rv];
  }
}

export type Adj = [number, number][][];

export function dijkstra(n: number, adj: Adj, sources: number[]): { dist: number[]; prev: number[] } {
  const dist = new Array<number>(n).fill(Infinity);
  const prev = new Array<number>(n).fill(-1);
  const h = new MinHeap();
  for (const s of sources) {
    dist[s] = 0;
    h.push(0, s);
  }
  while (h.size) {
    const [d, u] = h.pop();
    if (d > dist[u]) continue;
    for (const [v, c] of adj[u]) {
      const nd = d + c;
      if (nd < dist[v]) {
        dist[v] = nd;
        prev[v] = u;
        h.push(nd, v);
      }
    }
  }
  return { dist, prev };
}

export function tracePath(prev: number[], from: number): number[] {
  const out = [from];
  let u = from;
  let guard = 0;
  while (prev[u] >= 0 && guard++ < 100000) {
    u = prev[u];
    out.push(u);
  }
  return out;
}
