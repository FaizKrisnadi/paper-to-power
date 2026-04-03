# Data Workflow

## Recommended Command

```bash
npm run sync:data
```

This runs the project data flow in the correct order and skips missing raw-data steps safely.

## What It Does

1. applies reviewed seed overrides
2. ingests GEM CSV files if they exist
3. promotes reviewed seed rows into the active project registry
4. ingests GRW GeoJSON files if they exist
5. runs first-pass matching if both registry and observed assets exist
6. rebuilds frontend exports

## Raw Inputs

```text
data/raw/gem/*.csv
data/raw/grw/*.geojson
```

## Key Outputs

```text
data/processed/project_registry.json
data/processed/observed_assets.json
data/processed/project_asset_matches.json
data/processed/paper_to_power_labels.json
data/processed/frontend_dataset.json
src/data/generated.ts
```
