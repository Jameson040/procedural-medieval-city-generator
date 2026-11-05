# Procedural Medieval City Generator

A procedural medieval settlement and city generator built with **TypeScript**, **React**, and **Vite**. Generates complete, historically grounded settlements ranging from small rural hamlets to fortified imperial megacities with rivers, defensive walls, districts, road hierarchies, and realistic building footprints.

---

## ✨ Features

- **Settlement Tiers by Population**:
  - **Hamlet** (10 – 150): Farmsteads, barns, winding tracks, and open countryside.
  - **Village** (150 – 900): Parish church, churchyard, watermill, and orchards.
  - **Town** (900 – 4,500): Market squares, town halls, defensive walls, gatehouses, and extramural suburbs.
  - **City** (4,500 – 18,000): Cathedrals, citadels, universities, distinct cultural wards/districts, and complete fortifications.
  - **Megacity** (18,000+): Multiple markets, concentric inner walls, expansive districts, and dense urban sprawl.

- **Deterministic Generation**: Powered by a seeded PRNG and value noise — identical seeds and settings produce identical maps.
- **Realistic Geometry & Urban Planning**:
  - Relaxed Voronoi cell decomposition.
  - Defensibility scoring for citadel placement.
  - Organic arterial, secondary, and service road networks with bridges and plaza junctions.
  - Curvilinear river routing and harbour quays.
  - Realistic building footprint layouts (burgage plots, cathedral aisles, ring keeps, and market stalls).
- **Interactive Map Canvas**:
  - Smooth pan, zoom, and Level-of-Detail (LOD) rendering.
  - Interactive editing: drag junctions, add/move/delete gates, place landmarks, and regenerate specific districts.
  - Snapshot undo/redo (`Ctrl+Z` / `Ctrl+Shift+Z`).
- **Export & Portability**:
  - Export to high-resolution **PNG**, vector **SVG**, and structured **JSON**.
  - Re-import saved JSON city models with schema version migrations.

---

## 🛠️ Tech Stack

- **Runtime & UI**: React 19, TypeScript
- **Bundler & Build Tool**: Vite 7
- **Styling**: Tailwind CSS
- **Algorithms & Math**: D3 Delaunay / Voronoi, SAT (Separating Axis Theorem), OBB (Oriented Bounding Boxes)
- **Rendering**: HTML5 Canvas 2D with fallback SVG context generator

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Jameson040/procedural-medieval-city-generator.git
   cd procedural-medieval-city-generator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

---

## 📁 Project Structure

```text
├── docs/             # Architecture, algorithms, and historical references
│   ├── ARCHITECTURE.md
│   └── RESEARCH.md
├── scripts/          # Node preview & headless calibration harnesses
├── src/
│   ├── engine/       # Core procedural generation pipeline
│   │   ├── rng.ts         # Seeded PRNG and noise
│   │   ├── geom.ts        # Computational geometry kernel
│   │   ├── plan.ts        # Voronoi mesh, rivers, and terrain
│   │   ├── roads.ts       # Road networks, bridges, and gates
│   │   ├── districts.ts   # District seeding and growth
│   │   ├── fortify.ts     # Walls, towers, moats, and harbours
│   │   ├── buildings.ts   # Plot division and building footprints
│   │   ├── settlement.ts  # Tier parameters and scale configurations
│   │   ├── render.ts      # Canvas2D rendering and styling
│   │   ├── svgctx.ts      # Vector SVG rendering
│   │   └── export.ts      # Export/import handlers
│   ├── App.tsx       # Main UI controls and inspector panels
│   ├── MapView.tsx   # Interactive viewport and tools
│   └── main.tsx      # Application entrypoint
├── index.html
├── package.json
└── vite.config.ts
```

---

## 📜 License

This project is licensed under the MIT License.
