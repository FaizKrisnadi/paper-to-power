# Architecture

## System Shape

The project is intentionally split into two layers:

1. `Analytic layer`
   Ingestion, matching, scoring, and export of project and site records.
2. `Interface layer`
   Regional comparison, evidence browsing, and case-study presentation.

## Planned Data Flow

```text
Public project metadata
  + country-specific project lists
  + Global Energy Monitor
        |
        v
Harmonized project registry
        |
        +----> matching engine <---- Global Renewables Watch observed assets
        |               |
        |               v
        |        paper-to-power labels
        |
        +----> deliverability feature builder
                        |
                        v
               scored site records
                        |
                        v
                frontend-ready exports
```

## Frontend Architecture

The frontend should stay simple:

- `src/types`
  Domain contracts
- `src/data`
  mocked and later generated frontend datasets
- `src/components`
  presentational sections with explicit responsibilities
- `src/lib`
  formatting and shared helpers

The app will evolve from mocked data to exported analytic artifacts without forcing a rewrite of the UI structure.

## Planned Backend / Analysis Modules

These are not implemented yet, but the contracts below are the intended shape:

- `ingest_projects`
  normalize public project metadata into one registry
- `ingest_observed_assets`
  bring in GRW solar and wind detections
- `match_projects_to_assets`
  use name, geography, timing, and size signals
- `score_deliverability`
  compute interpretable spatial readiness metrics
- `publish_frontend_exports`
  emit GeoJSON, GeoParquet, and summarized JSON

## Design Principles

- low-complexity, inspectable scoring
- no black-box matching claims
- keep the frontend narrative-first
- separate observed evidence from inferred readiness
- preserve room for manual review and case-study annotation
