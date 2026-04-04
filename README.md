# Paper to Power

<p align="center">
  <strong>SEA Renewable Energy Map</strong><br/>
  A public geospatial audit of announced renewable energy projects across Southeast Asia.
</p>

<p align="center">
  <a href="https://energy.faizkrisnadi.com">Live site</a>
  ·
  <a href="https://github.com/FaizKrisnadi/paper-to-power">Repository</a>
</p>

<p align="center">
  <img alt="Projects" src="https://img.shields.io/badge/Featured%20Projects-52-1f2937?style=flat-square">
  <img alt="Countries" src="https://img.shields.io/badge/Countries-10-1f2937?style=flat-square">
  <img alt="Not Yet Observed" src="https://img.shields.io/badge/Not%20Yet%20Observed-46%25-b7791f?style=flat-square">
</p>

## What This Is

Paper to Power compares public project claims with observed build evidence.

The site tracks utility-scale renewable projects across Southeast Asia and asks a simple question: how much of what has been announced is actually visible on the ground?

The result is a public-facing map, evidence explorer, and country comparison built from a registry pipeline that combines project-level claims, geospatial matching, and manual review.

## Live Product

- Public site: [energy.faizkrisnadi.com](https://energy.faizkrisnadi.com)
- Stack: `React` + `Vite` + `TypeScript` + `MapLibre GL`
- Data pipeline: Python modules in [`pipeline/`](./pipeline)

## What The Site Shows

- A curated registry of `52` featured utility-scale projects
- Coverage across `10` Southeast Asian markets
- Project-level status labels such as `claimed_not_observed`
- Country summaries that distinguish announced capacity from observed evidence coverage
- A scroll-based story layer, map explorer, evidence table, and project drawer

## Method

The project runs in three broad layers:

1. Build a project registry from structured sources, manual curation, and deep-research imports.
2. Ingest observed geospatial evidence and contextual layers.
3. Match claims to observed assets, export frontend datasets, and review edge cases manually.

This is not a pure “scrape and publish” project. The workflow is deliberately opinionated:

- claims can be imported before they are promoted
- location and coordinate quality can be staged and enriched
- reviewed seed projects are promoted into the active registry only after validation
- frontend exports are generated from processed data, not hand-maintained page content

## Repository Layout

```text
src/                         React frontend
pipeline/                    Python data pipeline and export scripts
data/manual/                 Manual overrides and enrichment files
data/interim/                Staging outputs
data/processed/              Generated registry and frontend datasets
public/                      Static public assets
docs/                        Supporting documentation
```

Key pipeline entry points:

- [`pipeline/import_registry_csv.py`](./pipeline/import_registry_csv.py)
- [`pipeline/curate_deep_research_seed.py`](./pipeline/curate_deep_research_seed.py)
- [`pipeline/prepare_seed_enrichment.py`](./pipeline/prepare_seed_enrichment.py)
- [`pipeline/apply_seed_enrichment.py`](./pipeline/apply_seed_enrichment.py)
- [`pipeline/promote_reviewed_seed.py`](./pipeline/promote_reviewed_seed.py)
- [`pipeline/match_projects.py`](./pipeline/match_projects.py)
- [`pipeline/build_frontend_exports.py`](./pipeline/build_frontend_exports.py)

## Running It Locally

Requirements:

- `Node.js`
- `Python 3`

Install and run:

```bash
git clone https://github.com/FaizKrisnadi/paper-to-power.git
cd paper-to-power
npm install
npm run dev
```

Useful commands:

```bash
npm run build
npm run lint
npm run build:data
npm run import:registry-csv
npm run curate:deepresearch
npm run prepare:seed-enrichment
npm run apply:seed-enrichment
npm run promote:reviewed-seed
npm run match:firstpass
```

## Data Outputs

The frontend is driven by generated data artifacts, especially:

- [`data/processed/frontend_dataset.json`](./data/processed/frontend_dataset.json)
- [`src/data/generated.ts`](./src/data/generated.ts)
- [`data/processed/project_registry.json`](./data/processed/project_registry.json)

That means UI updates and data updates are intentionally separate:

- frontend components live in `src/`
- registry logic and evidence exports live in `pipeline/`
- processed outputs live in `data/processed/`

## Why This Repo Exists

Energy project announcements are easy to publish. Ground truth is harder.

This repo exists to make that gap legible, inspectable, and publicly explorable.

## Status

Current public build:

- ASEAN-wide registry scope
- hybrid projects supported in the public dataset
- mobile/desktop landing page with animated hero background
- Cloudflare Pages deployment on [energy.faizkrisnadi.com](https://energy.faizkrisnadi.com)

## License

No license file is currently included in this repository. Treat reuse as restricted until a project license is added.
