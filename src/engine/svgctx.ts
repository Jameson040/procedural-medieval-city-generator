// Minimal Canvas2D-compatible context that emits SVG. Implements just the subset used by render.ts.
type M = [number, number, number, number, number, number];

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const f = (n: number) => {
  const s = n.toFixed(2);
  return s.indexOf('.') >= 0 ? s.replace(/0+$/, '').replace(/\.$/, '') : s;
};

function parseColor(c: string): { col: string; op: number } {
  const m = c.match(/^rgba\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)$/);
  if (m) return { col: `rgb(${Math.round(+m[1])},${Math.round(+m[2])},${Math.round(+m[3])})`, op: +m[4] };
  return { col: c, op: 1 };
}

export class SvgContext {
  fillStyle: string = '#000';
  strokeStyle: string = '#000';
  lineWidth = 1;
  lineCap: string = 'butt';
  lineJoin: string = 'miter';
  globalAlpha = 1;
  font = '10px serif';
  textAlign: string = 'left';
  textBaseline: string = 'alphabetic';
  private out: string[] = [];
  private m: M = [1, 0, 0, 1, 0, 0];
  private stack: { m: M; fs: string; ss: string; lw: number; lc: string; lj: string; ga: number; font: string; ta: string; dash: number[] }[] = [];
  private d: string[] = [];
  private dash: number[] = [];
  constructor(public x: number, public y: number, public w: number, public h: number, private bg?: string) {}

  private tp(x: number, y: number): [number, number] {
    const m = this.m;
    return [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
  }
  private sc() {
    return Math.sqrt(Math.abs(this.m[0] * this.m[3] - this.m[1] * this.m[2]));
  }
  save() {
    this.stack.push({ m: [...this.m] as M, fs: this.fillStyle, ss: this.strokeStyle, lw: this.lineWidth, lc: this.lineCap, lj: this.lineJoin, ga: this.globalAlpha, font: this.font, ta: this.textAlign, dash: this.dash });
  }
  restore() {
    const s = this.stack.pop();
    if (!s) return;
    this.m = s.m;
    this.fillStyle = s.fs;
    this.strokeStyle = s.ss;
    this.lineWidth = s.lw;
    this.lineCap = s.lc;
    this.lineJoin = s.lj;
    this.globalAlpha = s.ga;
    this.font = s.font;
    this.textAlign = s.ta;
    this.dash = s.dash;
  }
  private mul(n: M) {
    const m = this.m;
    this.m = [
      m[0] * n[0] + m[2] * n[1], m[1] * n[0] + m[3] * n[1],
      m[0] * n[2] + m[2] * n[3], m[1] * n[2] + m[3] * n[3],
      m[0] * n[4] + m[2] * n[5] + m[4], m[1] * n[4] + m[3] * n[5] + m[5],
    ];
  }
  translate(x: number, y: number) { this.mul([1, 0, 0, 1, x, y]); }
  scale(x: number, y: number) { this.mul([x, 0, 0, y, 0, 0]); }
  rotate(a: number) { const c = Math.cos(a), s = Math.sin(a); this.mul([c, s, -s, c, 0, 0]); }
  setTransform() {}
  setLineDash(d: number[]) { this.dash = d; }
  beginPath() { this.d = []; }
  closePath() { this.d.push('Z'); }
  moveTo(x: number, y: number) { const p = this.tp(x, y); this.d.push(`M${f(p[0])} ${f(p[1])}`); }
  lineTo(x: number, y: number) { const p = this.tp(x, y); this.d.push(`L${f(p[0])} ${f(p[1])}`); }
  rect(x: number, y: number, w: number, h: number) {
    this.moveTo(x, y); this.lineTo(x + w, y); this.lineTo(x + w, y + h); this.lineTo(x, y + h); this.closePath();
  }
  arc(x: number, y: number, r: number, a0: number, a1: number) {
    const sc = this.sc();
    if (Math.abs(a1 - a0) >= Math.PI * 2 - 1e-6) {
      const s = this.tp(x + r, y);
      const e = this.tp(x - r, y);
      const rr = r * sc;
      this.d.push(`M${f(s[0])} ${f(s[1])}A${f(rr)} ${f(rr)} 0 1 0 ${f(e[0])} ${f(e[1])}A${f(rr)} ${f(rr)} 0 1 0 ${f(s[0])} ${f(s[1])}Z`);
      return;
    }
    const n = Math.max(3, Math.ceil(Math.abs(a1 - a0) / 0.3));
    for (let i = 0; i <= n; i++) {
      const a = a0 + ((a1 - a0) * i) / n;
      if (i === 0 && this.d.length === 0) this.moveTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
      else this.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
    }
  }
  ellipse(x: number, y: number, rx: number, ry: number, rot: number, a0: number, a1: number) {
    const n = Math.max(8, Math.ceil(Math.abs(a1 - a0) / 0.4));
    const c = Math.cos(rot), s = Math.sin(rot);
    for (let i = 0; i <= n; i++) {
      const a = a0 + ((a1 - a0) * i) / n;
      const ex = Math.cos(a) * rx, ey = Math.sin(a) * ry;
      const px = x + ex * c - ey * s, py = y + ex * s + ey * c;
      if (i === 0) this.moveTo(px, py); else this.lineTo(px, py);
    }
    this.closePath();
  }
  fill() {
    if (!this.d.length) return;
    const { col, op } = parseColor(this.fillStyle);
    const o = op * this.globalAlpha;
    this.out.push(`<path d="${this.d.join('')}" fill="${col}"${o < 1 ? ` fill-opacity="${f(o)}"` : ''}/>`);
  }
  stroke() {
    if (!this.d.length) return;
    const { col, op } = parseColor(this.strokeStyle);
    const o = op * this.globalAlpha;
    const sc = this.sc();
    const dash = this.dash.length ? ` stroke-dasharray="${this.dash.map((x) => f(x * sc)).join(' ')}"` : '';
    this.out.push(
      `<path d="${this.d.join('')}" fill="none" stroke="${col}" stroke-width="${f(this.lineWidth * sc)}" stroke-linecap="${this.lineCap === 'butt' ? 'butt' : this.lineCap}" stroke-linejoin="${this.lineJoin === 'miter' ? 'miter' : this.lineJoin}"${o < 1 ? ` stroke-opacity="${f(o)}"` : ''}${dash}/>`,
    );
  }
  strokeRect(x: number, y: number, w: number, h: number) {
    const keep = this.d;
    this.beginPath(); this.rect(x, y, w, h); this.stroke(); this.d = keep;
  }
  fillRect(x: number, y: number, w: number, h: number) {
    const keep = this.d;
    this.beginPath(); this.rect(x, y, w, h); this.fill(); this.d = keep;
  }
  private textEl(t: string, x: number, y: number, stroke: boolean) {
    const m = this.m;
    const size = parseFloat(this.font.match(/([\d.]+)px/)?.[1] ?? '10');
    const fam = this.font.replace(/^.*?[\d.]+px\s*/, '').replace(/"/g, "'");
    const bold = /bold/.test(this.font) ? ' font-weight="bold"' : '';
    const italic = /italic/.test(this.font) ? ' font-style="italic"' : '';
    const anchor = this.textAlign === 'center' ? 'middle' : this.textAlign === 'right' ? 'end' : 'start';
    const { col, op } = parseColor(stroke ? this.strokeStyle : this.fillStyle);
    const o = op * this.globalAlpha;
    const sc = this.sc();
    const attrs = stroke
      ? `fill="none" stroke="${col}" stroke-width="${f(this.lineWidth * sc)}" stroke-linejoin="round"${o < 1 ? ` stroke-opacity="${f(o)}"` : ''}`
      : `fill="${col}"${o < 1 ? ` fill-opacity="${f(o)}"` : ''}`;
    this.out.push(
      `<text transform="matrix(${f(m[0])} ${f(m[1])} ${f(m[2])} ${f(m[3])} ${f(m[4])} ${f(m[5])})" x="${f(x)}" y="${f(y)}" font-family="${esc(fam)}" font-size="${f(size)}"${bold}${italic} text-anchor="${anchor}" ${attrs}>${esc(t)}</text>`,
    );
  }
  fillText(t: string, x: number, y: number) { this.textEl(t, x, y, false); }
  strokeText(t: string, x: number, y: number) { this.textEl(t, x, y, true); }
  drawImage(img: { toDataURL: (t?: string, q?: number) => string }, x: number, y: number, w: number, h: number) {
    const p = this.tp(x, y);
    const sc = this.sc();
    this.out.push(`<image x="${f(p[0])}" y="${f(p[1])}" width="${f(w * sc)}" height="${f(h * sc)}" preserveAspectRatio="none"${this.globalAlpha < 1 ? ` opacity="${f(this.globalAlpha)}"` : ''} href="${img.toDataURL('image/jpeg', 0.88)}"/>`);
  }
  toString(): string {
    return (
      `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${f(this.w)}" height="${f(this.h)}" viewBox="${f(this.x)} ${f(this.y)} ${f(this.w)} ${f(this.h)}">\n` +
      (this.bg ? `<rect x="${f(this.x)}" y="${f(this.y)}" width="${f(this.w)}" height="${f(this.h)}" fill="${this.bg}"/>\n` : '') +
      this.out.join('\n') +
      '\n</svg>'
    );
  }
}
