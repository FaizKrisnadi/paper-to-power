# Paper to Power

An open-source geospatial audit of renewable project claims, observed build-out, and regional deliverability across Southeast Asia.

## Scope

Countries in scope:

- Indonesia
- Philippines
- Singapore
- Vietnam
- Malaysia

Role split:

- Indonesia, Philippines, Vietnam, Malaysia: source-side renewable build-out geographies
- Singapore: demand and import anchor for regional corridor relevance

## Core Question

Which announced utility-scale solar and wind projects in Southeast Asia are actually materializing on the ground, and which observed assets appear most relevant to regional electricity delivery?

## Product Direction

The project is structured around three analytic layers:

1. `Observed build-out`
   Compare public project claims against satellite-observed renewable assets.
2. `Paper-to-Power Gap`
   Label projects and sites as on-schedule, delayed, absent, downsized, or unmatched.
3. `Deliverability readiness`
   Score whether built assets appear better positioned for usable regional electricity delivery.

This is not a generic renewable-energy dashboard. It is an asset-level audit workflow.

## Current State

This repository currently includes:

- project specification and architecture docs
- a typed domain model for the five-country scope
- generated frontend exports built from manual source files
- a first-pass frontend that establishes the narrative, layout, and interaction model
- a small Python pipeline for validating and publishing frontend datasets
- a CSV-first GEM ingestion path for building the project registry
- a GeoJSON-first GRW ingestion path for building the observed asset registry
- a conservative first-pass project-to-asset matcher
- a markdown importer for Gemini Deep Research output
- a curation step that turns Deep Research rows into a stricter seed layer
- an enrichment queue generator for recovering coordinates and exact localities
- a manual review merge step for promoting enriched seed rows

## Planned Data Sources

- Global Renewables Watch
- Global Energy Monitor solar and wind trackers
- Philippines DOE project and plant lists
- Indonesia planning and project documents
- Vietnam PDP implementation documents
- Malaysia LSS / energy commission sources
- public infrastructure and context layers for transmission, substations, roads, settlements, and land cover

## Stack

- React
- TypeScript
- Vite

Planned additions later:

- MapLibre GL for mapping
- Python geospatial pipeline for matching and scoring
- GeoParquet / PostGIS-backed data flow

## Development

```bash
npm install
npm run build:data
npm run dev
```

Ingest GEM tracker CSV exports:

```bash
npm run ingest:gem
```

Ingest GRW GeoJSON exports:

```bash
npm run ingest:grw
```

Run first-pass matching:

```bash
npm run match:firstpass
```

Import Gemini Deep Research markdown:

```bash
npm run import:deepresearch -- "/absolute/path/to/file.md"
```

Curate imported Deep Research rows into accepted / review / excluded buckets:

```bash
npm run curate:deepresearch
```

Prepare the accepted and review rows for manual/source enrichment:

```bash
npm run prepare:seed-enrichment
```

Apply reviewed enrichment overrides and build a promotion-ready seed registry:

```bash
npm run apply:seed-enrichment
```

Run the full safe data refresh in the correct order:

```bash
npm run sync:data
```

This will apply reviewed overrides, optionally ingest raw GEM/GRW files, promote the reviewed seed into the active registry, run matching when possible, and rebuild frontend exports.

Build:

```bash
npm run build
```

Lint:

```bash
npm run lint
```

## Repo Layout

```text
data/
  manual/
  interim/
  processed/
docs/
  architecture.md
  data-model.md
  data-sources.md
  deep-research-curation.md
  deep-research-import.md
  manual-seed-enrichment.md
  seed-enrichment.md
  grw-ingestion.md
  gem-ingestion.md
  matching.md
  project-spec.md
pipeline/
src/
  components/
  data/
  lib/
  types/
```
