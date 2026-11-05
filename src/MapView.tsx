import { useEffect, useRef, useState } from 'react';
import { City, BType, Feature, Building } from './engine/types';
import { drawMap, drawFrame, RenderOpts } from './engine/render';
import { THEMES } from './engine/theme';
import { cityBounds } from './engine/export';
import { Pt, dist } from './engine/geom';
import {
  findBuildingAt, cellAt, placeBuilding, moveBuilding, deleteBuilding, addFeature, nearestFeature, removeFeature, moveVertex, vertexMovable,
  nearestWallVertex, toggleGate, revalidate,
} from './engine/edit';

export type Tool = 'select' | 'pan' | 'move' | 'add' | 'delete' | 'road' | 'gate' | 'landmark';
export interface Selection {
  kind: 'none' | 'building' | 'district' | 'feature';
  id: number;
}

interface Props {
  city: City;
  version: number;
  opts: RenderOpts;
  tool: Tool;
  buildType: BType;
  featType: Feature['type'];
  sel: Selection;
  setSel: (s: Selection) => void;
  onEdit: () => void;
  toast: (s: string) => void;
  fit: number;
  frame: boolean;
  legend?: boolean;
}

export default function MapView(p: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const view = useRef({ cx: 0, cy: 0, s: 0.6 });
  const dirty = useRef(true);
  const props = useRef(p);
  props.current = p;
  const drag = useRef<any>(null);
  const [hover, setHover] = useState('');
  const vertSel = useRef(-1);

  // layer cache: the last full render is kept as a bitmap; while panning/zooming it is re-projected (cheap)
  // and the full vector redraw happens once the interaction goes idle.
  const snap = useRef<{ cv: HTMLCanvasElement; cx: number; cy: number; s: number } | null>(null);
  const idle = useRef(0);
  const request = (fast = false) => {
    if (fast && snap.current) {
      if (!(dirty as any).fraf)
        (dirty as any).fraf = requestAnimationFrame(() => {
          (dirty as any).fraf = 0;
          drawFast();
        });
      window.clearTimeout(idle.current);
      idle.current = window.setTimeout(() => request(false), 140);
      return;
    }
    if (dirty.current && (dirty as any).raf) return;
    dirty.current = true;
    (dirty as any).raf = requestAnimationFrame(() => {
      (dirty as any).raf = 0;
      draw();
    });
  };

  const drawFast = () => {
    const cv = ref.current, w = wrap.current, sn = snap.current;
    if (!cv || !w || !sn) return;
    const dpr = window.devicePixelRatio || 1;
    const W = w.clientWidth, H = w.clientHeight;
    const v = view.current;
    const k = v.s / sn.s;
    const g = cv.getContext('2d')!;
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.fillStyle = THEMES[props.current.opts.theme].bg;
    g.fillRect(0, 0, cv.width, cv.height);
    const dx = (W / 2 + (sn.cx - v.cx) * v.s - (W / 2) * k) * dpr;
    const dy = (H / 2 + (sn.cy - v.cy) * v.s - (H / 2) * k) * dpr;
    g.drawImage(sn.cv, dx, dy, sn.cv.width * k, sn.cv.height * k);
    if (props.current.frame) {
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawFrame(g, props.current.city, 0, 0, W, H, Math.max(0.7, Math.min(1.1, W / 1300)), 1 / v.s, props.current.opts.theme, !!props.current.legend);
    }
  };

  const draw = () => {
    const cv = ref.current,
      w = wrap.current;
    if (!cv || !w) return;
    const { city, opts, sel, tool, frame } = props.current;
    const dpr = window.devicePixelRatio || 1;
    const W = w.clientWidth,
      H = w.clientHeight;
    if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(H * dpr)) {
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
    }
    const g = cv.getContext('2d')!;
    const v = view.current;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, W, H);
    g.setTransform(dpr * v.s, 0, 0, dpr * v.s, dpr * (W / 2 - v.cx * v.s), dpr * (H / 2 - v.cy * v.s));
    const vb: [number, number, number, number] = [v.cx - W / 2 / v.s, v.cy - H / 2 / v.s, v.cx + W / 2 / v.s, v.cy + H / 2 / v.s];
    const bs = new Set<number>();
    if (sel.kind === 'building') bs.add(sel.id);
    drawMap(g, city, {
      ...opts,
      scale: v.s,
      view: vb,
      selection: { buildings: bs, district: sel.kind === 'district' ? sel.id : undefined, feature: sel.kind === 'feature' ? sel.id : undefined, vert: vertSel.current },
    });
    if (tool === 'road' && v.s > 0.35) {
      g.fillStyle = 'rgba(138,59,42,0.85)';
      g.strokeStyle = '#fff';
      g.lineWidth = 1 / v.s;
      for (let i = 0; i < city.verts.length; i++) {
        const q = city.verts[i];
        if (q[0] < vb[0] || q[0] > vb[2] || q[1] < vb[1] || q[1] > vb[3]) continue;
        if (!vertexMovable(city, i)) continue;
        g.beginPath();
        g.arc(q[0], q[1], 3.6 / v.s, 0, Math.PI * 2);
        g.fill();
        g.stroke();
      }
    }
    if (tool === 'gate' && v.s > 0.3) {
      g.strokeStyle = '#ffb300';
      g.lineWidth = 2 / v.s;
      for (const wl of city.walls) if (wl.kind === 'outer') for (const id of wl.vids) {
        const q = city.verts[id];
        g.beginPath();
        g.arc(q[0], q[1], 7 / v.s, 0, Math.PI * 2);
        g.stroke();
      }
    }
    // keep a copy of the map layer (without the frame) for fast re-projection during interaction
    let sc = snap.current?.cv;
    if (!sc || sc.width !== cv.width || sc.height !== cv.height) {
      sc = document.createElement('canvas');
      sc.width = cv.width;
      sc.height = cv.height;
    }
    const sg = sc.getContext('2d')!;
    sg.setTransform(1, 0, 0, 1, 0, 0);
    sg.clearRect(0, 0, sc.width, sc.height);
    sg.drawImage(cv, 0, 0);
    snap.current = { cv: sc, cx: v.cx, cy: v.cy, s: v.s };
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (frame) drawFrame(g, city, 0, 0, W, H, Math.max(0.7, Math.min(1.1, W / 1300)), 1 / v.s, opts.theme, !!props.current.legend);
  };

  const fitView = () => {
    const w = wrap.current;
    if (!w) return;
    const [x0, y0, x1, y1] = cityBounds(props.current.city, 60);
    view.current = { cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, s: Math.min(w.clientWidth / (x1 - x0), w.clientHeight / (y1 - y0)) };
  };

  useEffect(() => {
    fitView();
    request();
  }, [p.fit]);
  useEffect(() => {
    request();
  });
  useEffect(() => {
    const w = wrap.current!;
    const ro = new ResizeObserver(() => request());
    ro.observe(w);
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      const r = ref.current!.getBoundingClientRect();
      const v = view.current;
      const mx = e.clientX - r.left,
        my = e.clientY - r.top;
      const wx = v.cx + (mx - r.width / 2) / v.s,
        wy = v.cy + (my - r.height / 2) / v.s;
      const ns = Math.min(14, Math.max(0.12, v.s * Math.exp(-e.deltaY * 0.0015)));
      v.s = ns;
      v.cx = wx - (mx - r.width / 2) / ns;
      v.cy = wy - (my - r.height / 2) / ns;
      request(true);
    };
    ref.current!.addEventListener('wheel', wheel, { passive: false });
    return () => {
      ro.disconnect();
      ref.current?.removeEventListener('wheel', wheel);
    };
  }, []);

  const toWorld = (e: React.PointerEvent): Pt => {
    const r = ref.current!.getBoundingClientRect();
    const v = view.current;
    return [v.cx + (e.clientX - r.left - r.width / 2) / v.s, v.cy + (e.clientY - r.top - r.height / 2) / v.s];
  };

  const down = (e: React.PointerEvent) => {
    const { city, tool, buildType, featType, setSel, onEdit, toast } = props.current;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    const wp = toWorld(e);
    const s = view.current.s;
    const startPan = () => (drag.current = { mode: 'pan', x: e.clientX, y: e.clientY, cx: view.current.cx, cy: view.current.cy });
    if (e.button === 1 || e.button === 2 || tool === 'pan') return startPan();
    if (tool === 'select') {
      const b = findBuildingAt(city, wp);
      if (b) return setSel({ kind: 'building', id: b.id });
      const f = nearestFeature(city, wp, 9 / s + 4);
      if (f) return setSel({ kind: 'feature', id: f.id });
      const c = cellAt(city, wp);
      if (c && c.district >= 0) return setSel({ kind: 'district', id: c.district });
      setSel({ kind: 'none', id: -1 });
      return startPan();
    }
    if (tool === 'move') {
      const b = findBuildingAt(city, wp);
      if (!b) return startPan();
      setSel({ kind: 'building', id: b.id });
      drag.current = { mode: 'move', b, orig: b.parts, start: wp, err: null as string | null, moved: false };
      return;
    }
    if (tool === 'add') {
      const r = placeBuilding(city, buildType, wp);
      if (typeof r === 'string') toast(r);
      else {
        setSel({ kind: 'building', id: r.id });
        onEdit();
      }
      return;
    }
    if (tool === 'delete') {
      const b = findBuildingAt(city, wp);
      if (b) {
        deleteBuilding(city, b.id);
        setSel({ kind: 'none', id: -1 });
        onEdit();
        return;
      }
      const f = nearestFeature(city, wp, 9 / s + 4);
      if (f) {
        removeFeature(city, f.id);
        onEdit();
      }
      return;
    }
    if (tool === 'landmark') {
      const f = nearestFeature(city, wp, 6);
      if (f) return setSel({ kind: 'feature', id: f.id });
      const r = addFeature(city, featType, wp);
      if (typeof r === 'string') toast(r);
      else {
        setSel({ kind: 'feature', id: r.id });
        onEdit();
      }
      return;
    }
    if (tool === 'gate') {
      const v = nearestWallVertex(city, wp, 16 / s + 4);
      if (v < 0) return toast('Click close to a vertex of the outer wall');
      toast(toggleGate(city, v));
      onEdit();
      return;
    }
    if (tool === 'road') {
      let best = -1,
        bd = 14 / s + 2;
      for (let i = 0; i < city.verts.length; i++) {
        const d = dist(city.verts[i], wp);
        if (d < bd && vertexMovable(city, i)) (bd = d), (best = i);
      }
      if (best < 0) return startPan();
      vertSel.current = best;
      drag.current = { mode: 'vert', v: best };
      request();
    }
  };

  const move = (e: React.PointerEvent) => {
    const d = drag.current;
    const { city, toast } = props.current;
    if (d) {
      if (d.mode === 'pan') {
        const s = view.current.s;
        view.current.cx = d.cx - (e.clientX - d.x) / s;
        view.current.cy = d.cy - (e.clientY - d.y) / s;
        request(true);
      } else if (d.mode === 'move') {
        const wp = toWorld(e);
        const err = moveBuilding(city, d.b as Building, d.orig, wp[0] - d.start[0], wp[1] - d.start[1]);
        d.err = err;
        if (!err) d.moved = true;
        request();
      } else if (d.mode === 'vert') {
        moveVertex(city, d.v, toWorld(e));
        request();
      }
      return;
    }
    const wp = toWorld(e);
    const b = findBuildingAt(city, wp);
    const t = b ? `${b.name ?? b.type.replace('_', ' ')}${b.manual ? ' (manual)' : ''}` : (() => {
      const c = cellAt(city, wp);
      return c && c.district >= 0 ? city.districts[c.district].name : '';
    })();
    setHover((h) => (h === t ? h : t));
    void toast;
  };

  const up = () => {
    const d = drag.current;
    drag.current = null;
    const { city, onEdit, toast } = props.current;
    if (!d) return;
    if (d.mode === 'pan') request(false);
    if (d.mode === 'move') {
      if (d.err) toast(d.err);
      revalidate(city);
      onEdit();
    } else if (d.mode === 'vert') {
      vertSel.current = -1;
      onEdit();
    }
  };

  const cursor = { select: 'default', pan: 'grab', move: 'move', add: 'copy', delete: 'not-allowed', road: 'crosshair', gate: 'crosshair', landmark: 'copy' }[p.tool];

  return (
    <div ref={wrap} className="relative h-full w-full overflow-hidden bg-[#c9d3a0]" onContextMenu={(e) => e.preventDefault()}>
      <canvas ref={ref} className="absolute inset-0 h-full w-full touch-none" style={{ cursor }} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} />
      {hover && <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded bg-[#3b2a1a]/85 px-3 py-1 text-xs text-[#f4ecda]">{hover}</div>}
    </div>
  );
}
