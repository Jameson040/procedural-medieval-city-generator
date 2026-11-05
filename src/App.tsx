import { useCallback, useEffect, useRef, useState } from 'react';
import MapView, { Tool, Selection } from './MapView';
import { Section, Field, Text, Select, Slider, Toggle, Btn } from './ui';
import { generateCity } from './engine/generate';
import { DEFAULT_PARAMS, IDENTITIES, Params, WARD_LABEL, identityOf } from './engine/params';
import { settlementFor } from './engine/settlement';
import { DEFAULT_OPTS, RenderOpts, invalidate } from './engine/render';
import { THEMES } from './engine/theme';
import { City, BType, Feature, WardType } from './engine/types';
import { TYPE_SIZE } from './engine/buildings';
import { regenerateAll, regenerateDistrict, setDistrictType, removeFeature, deleteBuilding, revalidate } from './engine/edit';
import { exportJSON, exportPNG, exportSVG, importJSON, download, snapshot, restore } from './engine/export';

const TOOLS: [Tool, string, string][] = [
  ['select', 'Select', 'Inspect buildings, landmarks and districts'],
  ['pan', 'Pan', 'Drag to move the map (or use right mouse button)'],
  ['move', 'Move', 'Drag a building to a new valid spot'],
  ['add', 'Add', 'Click a block to place the chosen building'],
  ['delete', 'Delete', 'Click a building or landmark to remove it'],
  ['road', 'Roads', 'Drag a street junction (red dot) — adjacent blocks are rebuilt locally'],
  ['gate', 'Gates', 'Click a wall vertex to add a postern gate or wall one up'],
  ['landmark', 'Landmarks', 'Click to add a landmark; pick one to select it'],
];
const FEATS: Feature['type'][] = ['fountain', 'well', 'statue', 'obelisk', 'shrine', 'gallows', 'windmill', 'watchtower', 'lighthouse'];
const BTYPES = Object.keys(TYPE_SIZE) as BType[];
const PALS = ['tile', 'terracotta', 'slate', 'thatch', 'timber', 'stone', 'dark'];
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).replace('_', ' ');
const randSeed = () => cap(Math.random().toString(36).slice(2, 8));
const POP_MIN = 10;
const POP_MAX = 120000;
const popToSlider = (p: number) => Math.round((100 * Math.log10(Math.max(POP_MIN, p) / POP_MIN)) / Math.log10(POP_MAX / POP_MIN));
const sliderToPop = (v: number) => Math.round(POP_MIN * Math.pow(POP_MAX / POP_MIN, v / 100));
const PRESETS: [string, number][] = [['Hamlet', 60], ['Village', 350], ['Town', 1800], ['City', 9000], ['Megacity', 45000]];
const nf = (n: number) => n.toLocaleString('en-GB');

export default function App() {
  const [params, setParams] = useState<Params>(DEFAULT_PARAMS);
  const [city, setCity] = useState<City | null>(null);
  const [version, setVersion] = useState(0);
  const [busy, setBusy] = useState(false);
  const [fit, setFit] = useState(0);
  const [tool, setTool] = useState<Tool>('select');
  const [sel, setSel] = useState<Selection>({ kind: 'none', id: -1 });
  const [buildType, setBuildType] = useState<BType>('house');
  const [featType, setFeatType] = useState<Feature['type']>('well');
  const [opts, setOpts] = useState<RenderOpts>({ ...DEFAULT_OPTS });
  const [frame, setFrame] = useState(true);
  const [msg, setMsg] = useState('');
  const [pngW, setPngW] = useState(4096);
  const [left, setLeft] = useState(true);
  const [legend, setLegend] = useState(false);
  const [autoApply, setAutoApply] = useState(true);
  const [pending, setPending] = useState(false);
  const [hist, setHist] = useState({ u: 0, r: 0 });
  const skip = useRef(true);
  const msgT = useRef<number>(0);
  // undo/redo: snapshots of the committed city state (render caches are excluded)
  const undoS = useRef<string[]>([]);
  const redoS = useRef<string[]>([]);
  const cur = useRef<string>('');
  const cityRef = useRef<City | null>(null);
  cityRef.current = city;
  const commitT = useRef(0);
  const syncHist = () => setHist({ u: undoS.current.length, r: redoS.current.length });
  const resetHistory = (c: City) => {
    undoS.current = [];
    redoS.current = [];
    cur.current = snapshot(c);
    syncHist();
  };

  const toast = useCallback((s: string) => {
    setMsg(s);
    window.clearTimeout(msgT.current);
    msgT.current = window.setTimeout(() => setMsg(''), 3800);
  }, []);
  const bump = useCallback(() => setVersion((v) => v + 1), []);
  /** record the current city as a new history step (after an edit has been applied) */
  const commit = useCallback(() => {
    window.clearTimeout(commitT.current);
    const c = cityRef.current;
    if (!c) return;
    const s = snapshot(c);
    if (s === cur.current) return bump();
    undoS.current.push(cur.current);
    if (undoS.current.length > 40) undoS.current.shift();
    redoS.current = [];
    cur.current = s;
    syncHist();
    bump();
  }, [bump]);
  /** for text fields: record after typing pauses */
  const commitSoon = useCallback(() => {
    bump();
    window.clearTimeout(commitT.current);
    commitT.current = window.setTimeout(() => commit(), 700);
  }, [bump, commit]);
  const undo = useCallback(() => {
    if (!undoS.current.length) return;
    redoS.current.push(cur.current);
    cur.current = undoS.current.pop()!;
    setCity(restore(cur.current));
    setSel({ kind: 'none', id: -1 });
    syncHist();
    bump();
  }, [bump]);
  const redo = useCallback(() => {
    if (!redoS.current.length) return;
    undoS.current.push(cur.current);
    cur.current = redoS.current.pop()!;
    setCity(restore(cur.current));
    setSel({ kind: 'none', id: -1 });
    syncHist();
    bump();
  }, [bump]);
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT' || (e.target as HTMLElement)?.tagName === 'SELECT') return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') (e.preventDefault(), e.shiftKey ? redo() : undo());
      else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') (e.preventDefault(), redo());
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [undo, redo]);

  const generate = useCallback(
    (p: Params) => {
      setBusy(true);
      setTimeout(() => {
        try {
          const c = generateCity(p);
          setCity(c);
          resetHistory(c);
          setPending(false);
          setSel({ kind: 'none', id: -1 });
          setFit((f) => f + 1);
          setVersion((v) => v + 1);
          if (c.report.attempts > 1) toast(`Layout repaired by regenerating from sub-seed #${c.report.attempts - 1}`);
        } catch (e) {
          toast('Generation failed: ' + (e as Error).message);
        }
        setBusy(false);
      }, 30);
    },
    [toast],
  );

  useEffect(() => {
    generate(params);
  }, []);
  useEffect(() => {
    if (skip.current) {
      skip.current = false;
      return;
    }
    // staged settings: never silently discard manual edits
    if (!autoApply || undoS.current.length > 0) {
      setPending(true);
      return;
    }
    const t = window.setTimeout(() => generate(params), 450);
    return () => window.clearTimeout(t);
  }, [params]);

  const P = <K extends keyof Params>(k: K, v: Params[K]) => setParams((p) => ({ ...p, [k]: v }));
  const O = <K extends keyof RenderOpts>(k: K, v: RenderOpts[K]) => setOpts((o) => ({ ...o, [k]: v }));
  const idn = identityOf(params.identity);
  const profile = settlementFor(params);

  const doExport = async (kind: 'png' | 'svg' | 'json') => {
    if (!city) return;
    const base = city.name.replace(/\s+/g, '_');
    try {
      if (kind === 'json') download(base + '.city.json', exportJSON(city), 'application/json');
      else if (kind === 'svg') download(base + '.svg', exportSVG(city, opts), 'image/svg+xml');
      else {
        toast('Rendering PNG…');
        await new Promise((r) => setTimeout(r, 30));
        download(base + '.png', await exportPNG(city, opts, pngW));
        toast('PNG exported');
      }
    } catch (e) {
      toast('Export failed: ' + (e as Error).message);
    }
  };
  const doImport = (f: File | undefined) => {
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const c = importJSON(String(r.result));
        skip.current = true;
        setParams(c.params);
        setCity(c);
        resetHistory(c);
        setPending(false);
        setSel({ kind: 'none', id: -1 });
        setFit((x) => x + 1);
        bump();
        toast(`Imported “${c.name}”`);
      } catch (e) {
        toast((e as Error).message);
      }
    };
    r.readAsText(f);
  };

  const b = city && sel.kind === 'building' ? city.buildings.find((x) => x.id === sel.id) : undefined;
  const d = city && sel.kind === 'district' ? city.districts[sel.id] : undefined;
  const ft = city && sel.kind === 'feature' ? city.features.find((x) => x.id === sel.id) : undefined;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f4ecda] font-['Crimson_Text',Georgia,serif] text-[#3b2a1a]">
      {/* ---------------- left: generation + view + export ---------------- */}
      {left && (
        <aside className="flex w-[300px] shrink-0 flex-col border-r border-[#cdb98c] bg-[#f4ecda]">
          <header className="border-b border-[#cdb98c] bg-[#e9dcb9] px-4 py-3">
            <h1 className="font-['Cinzel',Georgia,serif] text-lg font-bold leading-tight tracking-wide text-[#5b2a1a]">Medieval Settlement Generator</h1>
            <p className="text-xs italic text-[#7a6347]">Hamlets, villages, towns & great cities</p>
          </header>
          <div className="flex-1 overflow-y-auto">
            <Section title="GENERATE">
              <Field label="Seed">
                <div className="flex gap-1.5">
                  <Text value={params.seed} onChange={(v) => P('seed', v)} />
                  <Btn small title="Random seed" onClick={() => P('seed', randSeed())}>
                    ⚄
                  </Btn>
                </div>
              </Field>
              <Field label="Target population" hint={`${nf(params.population)} souls — ${profile.label.toLowerCase()}`}>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={popToSlider(params.population)}
                    onChange={(e) => P('population', sliderToPop(+e.target.value))}
                    className="h-1.5 w-full cursor-pointer accent-[#8a3b2a]"
                  />
                  <input
                    type="number"
                    min={POP_MIN}
                    max={POP_MAX}
                    step={10}
                    value={params.population}
                    onChange={(e) => P('population', Math.max(POP_MIN, Math.min(POP_MAX, +e.target.value || POP_MIN)))}
                    className="w-[74px] rounded border border-[#cdb98c] bg-[#fbf6e6] px-1.5 py-1 text-right text-sm"
                  />
                </div>
              </Field>
              <div className="grid grid-cols-5 gap-1">
                {PRESETS.map(([l, p]) => (
                  <button
                    key={l}
                    onClick={() => P('population', p)}
                    title={`${l}: ${nf(p)} souls`}
                    className={`rounded border px-1 py-1 text-[10px] font-bold ${profile.tier === l.toLowerCase() ? 'border-[#6b2a1d] bg-[#8a3b2a] text-[#fbf1dc]' : 'border-[#cdb98c] bg-[#f6eed7] text-[#5b3a22] hover:bg-[#ede2c6]'}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
              <Field label="City name" hint="Leave empty for a generated name">
                <Text value={params.name} onChange={(v) => P('name', v)} placeholder="auto" />
              </Field>
              <div className="grid grid-cols-3 gap-1.5">
                <Btn primary small disabled={busy} onClick={() => generate(params)}>
                  Generate
                </Btn>
                <Btn small disabled={busy} onClick={() => P('seed', randSeed())}>
                  Random
                </Btn>
                <Btn small disabled={busy || !city} title="New plots & buildings everywhere, same roads/walls" onClick={() => city && (regenerateAll(city), commit())}>
                  Regenerate
                </Btn>
              </div>
              <Toggle label="Auto-apply settings (when no edits)" value={autoApply} onChange={setAutoApply} />
              {pending && (
                <div className="rounded border border-[#c9a25a] bg-[#fbefcf] p-2 text-[12px] text-[#6b4a1a]">
                  Settings changed{hist.u ? ` — applying discards ${hist.u} manual edit${hist.u > 1 ? 's' : ''}` : ''}.
                  <div className="mt-1.5 flex gap-1.5">
                    <Btn small primary onClick={() => generate(params)}>Apply settings</Btn>
                    <Btn small onClick={() => setPending(false)}>Later</Btn>
                  </div>
                </div>
              )}
            </Section>
            <Section title="CITY CHARACTER">
              <Field label="Architectural character" hint={idn.blurb + (profile.tierIndex < 2 ? " — small settlements stay rural." : "")}>
                <Select value={params.identity} onChange={(v) => P('identity', v)} options={IDENTITIES.map((i) => [i.id, i.label])} />
              </Field>
              <Field label="Geography">
                <Select value={params.geography} onChange={(v) => P('geography', v)} options={[['auto', 'By identity'], ['plains', 'Open plains'], ['hills', 'Hilltop'], ['coast', 'Coastal bay'], ['mountain', 'Mountain pass']]} />
              </Field>
              <Slider label="Block size (urban grain)" value={params.cityDensity} min={0} max={1} step={0.01} onChange={(v) => P('cityDensity', v)} fmt={() => `${profile.blocks} blocks`} />
              <Slider label="Building density" value={params.buildingDensity} min={0} max={1} step={0.01} onChange={(v) => P('buildingDensity', v)} fmt={(v) => `${Math.round(v * 100)}%`} />
              <Slider label="Road complexity" value={params.roadComplexity} min={0} max={1} step={0.01} onChange={(v) => P('roadComplexity', v)} fmt={(v) => `${Math.round(v * 100)}%`} />
              <Slider label="District count" value={params.districtCount} min={4} max={12} onChange={(v) => P('districtCount', v)} fmt={() => `${profile.districts} used`} />
              <Slider label="Terrain variation" value={params.terrain} min={0} max={1} step={0.01} onChange={(v) => P('terrain', v)} fmt={(v) => `${Math.round(v * 100)}%`} />
            </Section>
            <Section title="WALLS & WATER" open={false}>
              <Field label="Wall configuration">
                <Select value={params.walls} onChange={(v) => P('walls', v)} options={[['auto', 'By identity'], ['none', 'No walls'], ['outer', 'Outer wall'], ['double', 'Outer + inner (old town)']]} />
              </Field>
              <Field label="Moat">
                <Select value={params.moat} onChange={(v) => P('moat', v)} options={[['auto', 'By identity'], ['yes', 'Yes'], ['no', 'No']]} />
              </Field>
              <Field label="River">
                <Select value={params.river} onChange={(v) => P('river', v)} options={[['auto', 'By identity'], ['river', 'River crosses city'], ['none', 'No river']]} />
              </Field>
              <Slider label="River width" value={params.riverWidth} min={10} max={30} onChange={(v) => P('riverWidth', v)} />
              <Field label="Harbour">
                <Select value={params.harbour} onChange={(v) => P('harbour', v)} options={[['auto', 'By identity'], ['yes', 'Piers & quays'], ['no', 'None']]} />
              </Field>
            </Section>
            <Section title="MAP VIEW" open={false}>
              <Field label="Theme">
                <Select value={opts.theme} onChange={(v) => O('theme', v)} options={Object.keys(THEMES).map((t) => [t as keyof typeof THEMES, t === 'daylight' ? 'Daylight' : 'Parchment'])} />
              </Field>
              <div className="grid grid-cols-1 gap-1.5">
                <Toggle label="District colours" value={opts.districts} onChange={(v) => O('districts', v)} />
                <Toggle label="District names" value={opts.districtLabels} onChange={(v) => O('districtLabels', v)} />
                <Toggle label="Building labels" value={opts.labels} onChange={(v) => O('labels', v)} />
                <Toggle label="Road labels" value={opts.roadLabels} onChange={(v) => O('roadLabels', v)} />
                <Toggle label="Walls & towers" value={opts.walls} onChange={(v) => O('walls', v)} />
                <Toggle label="Terrain & fields" value={opts.terrain} onChange={(v) => O('terrain', v)} />
                <Toggle label="Decorative elements" value={opts.decor} onChange={(v) => O('decor', v)} />
                <Toggle label="Buildings" value={opts.buildings} onChange={(v) => O('buildings', v)} />
                <Toggle label="Plain footprints (no roofs)" value={opts.footprints} onChange={(v) => O('footprints', v)} />
                <Toggle label="Map frame, title & compass" value={frame} onChange={setFrame} />
                <Toggle label="Legend & district index" value={legend} onChange={setLegend} />
              </div>
              <Btn small onClick={() => setFit((f) => f + 1)}>
                Fit city to view
              </Btn>
            </Section>
            <Section title="EXPORT / IMPORT" open={false}>
              <div className="flex items-end gap-1.5">
                <Field label="PNG width">
                  <select className="w-full rounded border border-[#cdb98c] bg-[#fbf6e6] px-2 py-1.5 text-sm" value={pngW} onChange={(e) => setPngW(+e.target.value)}>
                    {[2048, 4096, 8192].map((w) => (
                      <option key={w} value={w}>
                        {w}px
                      </option>
                    ))}
                  </select>
                </Field>
                <Btn small onClick={() => doExport('png')}>
                  PNG
                </Btn>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <Btn small onClick={() => doExport('svg')}>
                  SVG (vector)
                </Btn>
                <Btn small onClick={() => doExport('json')}>
                  JSON project
                </Btn>
              </div>
              <label className="block">
                <span className="inline-block w-full cursor-pointer rounded border border-[#cdb98c] bg-[#f6eed7] px-2 py-1 text-center text-xs font-semibold text-[#5b3a22] hover:bg-[#ede2c6]">Import JSON project…</span>
                <input type="file" accept="application/json,.json" className="hidden" onChange={(e) => (doImport(e.target.files?.[0]), (e.target.value = ''))} />
              </label>
            </Section>
          </div>
        </aside>
      )}

      {/* ---------------- centre: map ---------------- */}
      <main className="relative min-w-0 flex-1">
        {city && <MapView city={city} version={version} opts={opts} tool={tool} buildType={buildType} featType={featType} sel={sel} setSel={setSel} onEdit={commit} toast={toast} fit={fit} frame={frame} legend={legend} />}
        <button onClick={() => setLeft(!left)} className="absolute left-2 top-2 z-10 rounded border border-[#cdb98c] bg-[#f4ecda]/95 px-2 py-1 text-xs font-bold text-[#5b3a22] shadow">
          {left ? '◀' : '▶ Settings'}
        </button>
        <div className="absolute left-1/2 top-2 z-10 flex -translate-x-1/2 flex-wrap justify-center gap-1 rounded-lg border border-[#cdb98c] bg-[#f4ecda]/95 p-1 shadow-md">
          <button title="Undo (Ctrl+Z)" disabled={!hist.u} onClick={undo} className="rounded px-2 py-1 text-xs font-bold text-[#5b3a22] hover:bg-[#e9dcb9] disabled:opacity-35">↶</button>
          <button title="Redo (Ctrl+Shift+Z)" disabled={!hist.r} onClick={redo} className="rounded px-2 py-1 text-xs font-bold text-[#5b3a22] hover:bg-[#e9dcb9] disabled:opacity-35">↷</button>
          <span className="mx-0.5 w-px self-stretch bg-[#cdb98c]" />
          {TOOLS.map(([t, l, h]) => (
            <button key={t} title={h} onClick={() => setTool(t)} className={`rounded px-2.5 py-1 text-xs font-bold ${tool === t ? 'bg-[#8a3b2a] text-[#fbf1dc]' : 'text-[#5b3a22] hover:bg-[#e9dcb9]'}`}>
              {l}
            </button>
          ))}
        </div>
        <div className="absolute left-1/2 top-[46px] z-10 flex -translate-x-1/2 items-center gap-2 rounded bg-[#3b2a1a]/85 px-3 py-1 text-[11px] text-[#f4ecda]">
          {TOOLS.find((t) => t[0] === tool)![2]}
          {tool === 'add' && (
            <select className="rounded bg-[#f4ecda] px-1 text-[#3b2a1a]" value={buildType} onChange={(e) => setBuildType(e.target.value as BType)}>
              {BTYPES.map((t) => (
                <option key={t} value={t}>
                  {cap(t)}
                </option>
              ))}
            </select>
          )}
          {tool === 'landmark' && (
            <select className="rounded bg-[#f4ecda] px-1 text-[#3b2a1a]" value={featType} onChange={(e) => setFeatType(e.target.value as Feature['type'])}>
              {FEATS.map((t) => (
                <option key={t} value={t}>
                  {cap(t)}
                </option>
              ))}
            </select>
          )}
        </div>
        {busy && <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#f4ecda]/60 font-['Cinzel',Georgia,serif] text-lg font-bold text-[#5b2a1a]">Surveying the land…</div>}
        {msg && <div className="absolute bottom-12 left-1/2 z-20 -translate-x-1/2 rounded-md bg-[#8a3b2a] px-4 py-2 text-sm text-[#fbf1dc] shadow-lg">{msg}</div>}
      </main>

      {/* ---------------- right: inspector ---------------- */}
      <aside className="flex w-[290px] shrink-0 flex-col overflow-y-auto border-l border-[#cdb98c] bg-[#f4ecda]">
        <header className="border-b border-[#cdb98c] bg-[#e9dcb9] px-4 py-3">
          <h2 className="font-['Cinzel',Georgia,serif] text-base font-bold text-[#5b2a1a]">{city?.name ?? '…'}</h2>
          <p className="text-xs italic text-[#7a6347]">
            {city ? `${city.settlement.label} · ${nf(city.settlement.population)} souls` : idn.label}
          </p>
        </header>
        {city && b && (
          <Section title="BUILDING">
            <Field label="Type">
              <Select value={b.type} onChange={(v) => ((b.type = v), (b.manual = true), invalidate(b), commit())} options={BTYPES.map((t) => [t, cap(t)])} />
            </Field>
            <Field label="Name">
              <Text value={b.name ?? ''} onChange={(v) => ((b.name = v || undefined), commitSoon())} placeholder="unnamed" />
            </Field>
            <Field label="Roof">
              <Select value={b.pal} onChange={(v) => ((b.pal = v), invalidate(b), commit())} options={PALS.map((t) => [t, cap(t)])} />
            </Field>
            <Slider label="Storeys (shade)" value={b.h} min={0} max={2} onChange={(v) => ((b.h = v), invalidate(b), commitSoon())} />
            <p className="text-xs text-[#7a6347]">
              Parts: {b.parts.length} · Block {b.cell} · {city.districts[city.cells[b.cell].district]?.name ?? ''}
              {b.manual ? ' · manually edited' : ''}
            </p>
            <Btn small onClick={() => (deleteBuilding(city, b.id), setSel({ kind: 'none', id: -1 }), commit())}>
              Delete building
            </Btn>
          </Section>
        )}
        {city && d && (
          <Section title="DISTRICT">
            <Field label="Name">
              <Text value={d.name} onChange={(v) => ((d.name = v), commitSoon())} />
            </Field>
            <Field label="Character">
              <Select value={d.type} onChange={(v: WardType) => (setDistrictType(city, d.id, v), commit())} options={(Object.keys(WARD_LABEL) as WardType[]).map((t) => [t, WARD_LABEL[t]])} />
            </Field>
            <Field label="Colour (district overlay)">
              <div className="flex items-center gap-2">
                <input type="color" value={d.color ?? THEMES[opts.theme].ward[d.type]} onChange={(e) => ((d.color = e.target.value), commitSoon())} className="h-8 w-12 cursor-pointer rounded border border-[#cdb98c]" />
                <Btn small onClick={() => ((d.color = undefined), commit())}>
                  Reset
                </Btn>
              </div>
            </Field>
            <p className="text-xs text-[#7a6347]">
              {d.cells.length} blocks · {city.buildings.filter((x) => d.cells.includes(x.cell)).length} buildings
            </p>
            <Btn small primary onClick={() => (regenerateDistrict(city, d.id), commit(), toast('District rebuilt — the rest of the map is untouched'))}>
              Regenerate this district
            </Btn>
          </Section>
        )}
        {city && ft && (
          <Section title="LANDMARK">
            <Field label="Type">
              <Select value={ft.type} onChange={(v) => ((ft.type = v), commit())} options={FEATS.map((t) => [t, cap(t)])} />
            </Field>
            <Field label="Name">
              <Text value={ft.name ?? ''} onChange={(v) => ((ft.name = v || undefined), commitSoon())} />
            </Field>
            <Btn small onClick={() => (removeFeature(city, ft.id), setSel({ kind: 'none', id: -1 }), commit())}>
              Remove landmark
            </Btn>
          </Section>
        )}
        {city && (
          <>
            <Section title="VALIDATION">
              <div className="grid grid-cols-3 gap-1 text-center text-[11px]">
                {Object.entries(city.report.stats).slice(0, 6).map(([k, v]) => (
                  <div key={k} className="rounded bg-[#ebe0c2] px-1 py-1">
                    <div className="text-sm font-bold text-[#5b2a1a]">{v}</div>
                    <div className="text-[#7a6347]">{k}</div>
                  </div>
                ))}
              </div>
              {city && (
                <p className="text-xs text-[#5b4a34]">
                  {city.settlement.label}: {nf(city.settlement.population)} souls targeted · {nf(city.buildings.length)} dwellings ·{' '}
                  {nf(city.settlement.blocks)} blocks
                </p>
              )}
              {city.report.errors.length === 0 && <p className="text-xs font-semibold text-[#3f6b34]">✓ No spatial or connectivity errors{city.report.attempts > 1 ? ` (attempt ${city.report.attempts})` : ''}</p>}
              {city.report.errors.map((e, i) => (
                <p key={i} className="text-xs text-[#a02a1a]">✗ {e}</p>
              ))}
              {city.report.warnings.map((e, i) => (
                <p key={i} className="text-xs text-[#9a6a1a]">⚠ {e}</p>
              ))}
              {city.report.info.map((e, i) => (
                <p key={i} className="text-xs text-[#7a6347]">• {e}</p>
              ))}
              <Btn small onClick={() => (revalidate(city), bump())}>
                Re-validate
              </Btn>
            </Section>
            <Section title="DISTRICTS">
              <div className="space-y-1">
                {city.districts.map((x) => (
                  <button key={x.id} onClick={() => setSel({ kind: 'district', id: x.id })} className={`flex w-full items-center gap-2 rounded px-1.5 py-1 text-left text-xs hover:bg-[#ebe0c2] ${sel.kind === 'district' && sel.id === x.id ? 'bg-[#e4d4a8]' : ''}`}>
                    <span className="h-3 w-3 shrink-0 rounded-sm border border-[#5b3a22]/40" style={{ background: x.color ?? THEMES[opts.theme].ward[x.type] }} />
                    <span className="flex-1 truncate">{x.name}</span>
                    <span className="text-[#8a7556]">{x.cells.length}</span>
                  </button>
                ))}
              </div>
            </Section>
            <Section title="HELP" open={false}>
              <ul className="list-disc space-y-1 pl-4 text-xs text-[#5b4a34]">
                <li>Wheel zooms, drag pans (or right mouse button).</li>
                <li>Select a district to rename, recolour, change its character or rebuild only it.</li>
                <li>Roads tool: drag red junctions — only the touching blocks regenerate.</li>
                <li>Walls, rivers and quays stay free: buildings can’t be placed on them.</li>
                <li>Export SVG for structured vector geometry, JSON for a re-importable project.</li>
              </ul>
            </Section>
          </>
        )}
      </aside>
    </div>
  );
}
