# Architecture

```
src/engine
  rng.ts        seeded RNG + value noise            (same seed + settings => same city)
  geom.ts       polygon kernel (convex inset/split, OBB fit, SAT, indexed polyline queries)
  params.ts     parameters, 10 city identities, name generators
  types.ts      City data model (planar mesh: verts / cells / edge classes)
  plan.ts       geography, relaxed Voronoi mesh, river routed along mesh edges, city extent, edge classes
  roads.ts      market, inner wall, gates + outer roads, bridges, arterial/secondary routing, plazas
  districts.ts  citadel/cathedral anchors, district seeding + growth, geography overrides, naming
  fortify.ts    walls, towers, gates, moat, harbour, piers, countryside decor
  buildings.ts  blocks -> plots -> footprints, market / cathedral / castle / ring layouts (per-cell, seeded)
  validate.ts   spatial + connectivity + planning validation
  generate.ts   staged pipeline with regenerate-on-critical-failure
  edit.ts       local edits (district regen, junction drag, add/move/delete, gates, landmarks)
  render.ts     Canvas2D renderer (batched paths, LOD, labels)    svgctx.ts: same code -> SVG
  export.ts     PNG / SVG / JSON export + JSON import
src/MapView.tsx interactive canvas (zoom, pan, tools)    src/App.tsx controls + inspector
scripts/        node harnesses used during development (generation sweeps, SVG->PNG preview via resvg)
```

## Iteration 3 additions
- **District count is honoured**: wards are grown, then districts are merged (smallest into its most-bordering neighbour) or split (largest along its long axis) until the requested number is reached.
- **Citadel defensibility score**: elevation, on-wall, water, salient corner, overlooking a gate; central placement is penalised except for royal identities.
- **Gate hierarchy**: main gatehouses (+ barbicans for double-walled / bastioned cities), auto-generated posterns with footpaths and a single square tower, water gates, harbour towers.
- **Harbour quays** (`city.quays`): stone quay lines following the smoothed river banks / coast, with bollards; river piers start at the bank.
- **Concave blocks**: `decomposeConvex` splits concave cells into convex sub-blocks (the cut becomes a service alley) so junction drags may create concave blocks.
- **Landmarks**: 3 cathedral plans (with aisles), 3 keep types, belfried town hall, rear outbuildings in deep burgage plots, street-aligned fallback footprints.
- **Undo/redo** (snapshot stack, Ctrl+Z / Ctrl+Shift+Z), **staged settings** (never silently discard edits), **layer cache** (bitmap re-projection during pan/zoom).
- **Export legend & district index**, **schema versioning** with migrations (`SCHEMA_VERSION`, `MIGRATIONS` in export.ts).
- Rendering: roof courses + chimneys, conical/crenellated towers, wall shadows, bridge cutwaters, river ripples, cart ruts, hedgerows, lobed tree canopies, striped stalls, city hill-shading.

## Iteration 4 — settlements of every size

`src/engine/settlement.ts` turns a **target population** into a full settlement profile. The seed plus the
population fully determine the result.

| tier | population | block area | plot area | features |
|---|---|---|---|---|
| Hamlet | 10 – 150 | 6 000 | 1 500 | farmsteads, barns, tracks; no walls, no market |
| Village | 150 – 900 | 8 000 | 700 | church + churchyard, mill, hamlets; no walls |
| Town | 900 – 4 500 | 8 000 | 400 | market square, town hall, walls + 2–3 gates, suburbs |
| City | 4 500 – 18 000 | 11 000 | 300 | cathedral, citadel, university, districts, walls, suburbs |
| Megacity | 18 000 + | 15 000 | 240 | two markets, inner wall, 12–18 districts, suburbs |

* `plotArea` sets the parcel size, which sets the plot style scale, which sets how many dwellings a block holds.
* `cellArea` sets the block size, so a hamlet is a handful of 78 m blocks while a megacity covers ~2 km.
* Building **types have real-world dimensions** (`TYPE_DIMS`), so a cottage is 6 × 8 m in a hamlet and a
  cathedral is 40 × 30 m — buildings never scale with their plot.
* Walls, market, cathedral, citadel, church, university, gates, river, harbour and suburbs are all switched on by tier.
* Rural tiers get meadow ground, hedge lines, farmyard pads and narrow dirt tracks; the title reads
  "Village of the open country" rather than "Walled Merchant City".
* `repairOverlaps` is a global safety net: overlapping footprints are shrunk first and only dropped as a last resort.
