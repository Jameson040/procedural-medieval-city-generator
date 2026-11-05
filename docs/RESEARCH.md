# Research notes — procedural medieval city generation

Reviewed (source level, not just READMEs): Watabou TownGeneratorOS (`Model.hx`, `Ward.hx`, `Cutter`, `CurtainWall`, `Topology`),
Magna Urbis, cityGen, EPITA Mapcraft and ProbableTrain MapGenerator. Everything below is **re-implemented from scratch** — no code is copied.

## What each project teaches

| Project | Mechanism | Strength | Pitfall |
|---|---|---|---|
| Watabou | Spiral sites → Voronoi → Lloyd-relaxed centre → N nearest patches = city. Wall = outline of the patch union (edges not shared with another city patch). Gates = outline vertices. Streets = A* over the *patch-vertex graph* from gate to plaza. Wards fill patches by recursive longest-edge bisection (`createAlleys`) with a gap (alley) and an "empty probability". | Fully coherent: roads, blocks and walls all live on the same planar graph, so nothing can cross. | Throws and retries on bad topology; all junctions are degree-3; buildings ignore frontage; rivers are a late add-on. |
| Magna Urbis | Road growth from seeds with tensor/attractor-like influence, blocks from faces of the road graph. | Organic, historically plausible irregularity. | Face extraction is fragile (dangling edges, slivers). |
| cityGen | Voronoi districts + Blender buildings, per-district density, road widths from graph. | Per-district parameters. | Buildings mostly placed independent of road class. |
| EPITA Mapcraft | Noise-based terrain & biomes drive placement. | Terrain-aware. | Terrain is decorative rather than structural. |
| ProbableTrain | Tensor fields (grid + radial) streamlines, integrate with separation tests; polygons from road graph cycles; buildings by lot subdivision. | Good road hierarchy (major/minor/path) and variable widths. | Streamline termination → dead ends; needs polygon-finding step that fails on near-parallel roads. |

## Design decisions for this project

1. **One planar graph for everything.** A relaxed Voronoi diagram (spiral sites, denser at the centre) is the city's skeleton.
   Cell edges are streets / walls / river banks / quays; cell interiors are blocks. Roads, walls, blocks and water therefore can't intersect by construction.
2. **Rivers follow graph edges** (least-cost path along a meandering guide curve), so water is also on the same graph; banks are quay-inset.
   The coast is a noisy bay function that marks Voronoi cells as sea.
3. **Hierarchy by cost-routing.** Gates sit on outline vertices that have an inward street; arterials = Dijkstra from each gate to the market cell;
   secondary roads = routes between landmarks; everything else is a lane. Bridges are cut-through streets across two bank cells, represented as extra graph edges
   so the router can really cross the river.
4. **Per-edge inset widths** (convex half-plane clipping): wall ring-road, quay, arterial, lane. Junction plazas are corner chamfers (buildings are kept out by geometry, not by deletion).
5. **Districts** are seeded by suitability (centre, water, wall, height, gates) and grown over the cell graph; harbour/poor/military overrides come from geography.
6. **Blocks → plots → buildings** with per-cell seeded RNG, so a single district can be regenerated without touching the rest.
   Special layouts: market (frontage ring around plaza), cathedral close, castle bailey, cloister / quad / parade ring.
7. **Buildings are unions of oriented rectangles/circles** (L, T, U, cross, courtyard), fitted inside plots (corners-inside-convex-plot test) — compact, SAT-checkable, and cheap to render in batched paths.
8. **Validation & repair** (not deletion): overlap SAT, road/river/wall clearance (shrink-to-fit first), graph connectivity gate→market, gates have outer roads, bridges cross real river edges, landmark access.
   Critical failures regenerate with a derived sub-seed (attempt counter shown in the UI).
9. **Rendering** through a tiny Canvas-2D subset, so the same code paints the screen, hi-res PNG and a structured **SVG** (via an SVG context implementing that subset).

## Licensing
All reference projects were studied for *ideas* only (planar-graph skeleton, A* streets, recursive cuts, tensor-field hierarchies). No source is reproduced.
