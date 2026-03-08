# International Collaboration Dashboard

A data-driven dashboard scoring international telecom collaboration potential across ~195 countries. Combines 10 published external indexes (70%) with internal assessment criteria (30%).

## Features

- 🗺 **World choropleth map** — D3 Natural Earth projection, countries coloured by collaboration score
- 📊 **Ranked country table** — sortable, filterable, with score bars and index coverage
- ⚙️ **Editable internal assessments** — per-country 1–5 scoring on 3 criteria
- 📚 **Data sources** — full documentation of all 10 external indexes
- 📐 **Methodology** — scoring formula, tier definitions, N/A handling

## Scoring

| Component | Weight |
|-----------|--------|
| 10 external indexes (GDP, Digital Maturity, AI Readiness, etc.) | 70% |
| Leadership Interest | 10% |
| Internal Stakeholder Interest | 10% |
| Foreign Stakeholder Interest | 10% |

**Score tiers:** Strategic (≥80) · High (65–79) · Medium (50–64) · Low (35–49) · Minimal (<35)

## Getting Started

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
```

Output goes to `dist/`.

## Deploy to Vercel

### Option 1 — Vercel CLI
```bash
npm install -g vercel
vercel
```

### Option 2 — GitHub Integration
1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project**
3. Import your GitHub repo
4. Vercel auto-detects Vite — click **Deploy**

Your dashboard will be live at `https://your-project.vercel.app` in ~30 seconds.

## Tech Stack

- [React 18](https://react.dev)
- [D3 v7](https://d3js.org) — map rendering
- [world-atlas](https://github.com/topojson/world-atlas) — Natural Earth topojson
- [topojson-client](https://github.com/topojson/topojson-client) — topology decoding
- [Vite](https://vitejs.dev) — build tool
