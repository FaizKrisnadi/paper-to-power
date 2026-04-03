# Data Sources

## Current Strategy

The project uses a two-step data strategy:

1. maintain small, explicit manual source manifests and seed records
2. grow those into real ingestion pipelines for project registries and observed assets

This keeps the repo usable before the heavy geospatial ingestion work is complete.

## Source Categories

### Observed Assets

- Global Renewables Watch

### Project Registry Backbone

- Global Solar Power Tracker
- Global Wind Power Tracker

### Country Validators

- Philippines DOE
- Indonesia RUPTL planning documents
- Vietnam PDP8 implementation materials
- Malaysia LSS / energy commission sources

### Anchor Context

- Singapore EMA regional energy connectivity material

## Where This Lives

- `data/manual/public_sources.json`
- `data/manual/gem_column_aliases.json`
- `data/manual/country_name_to_code.json`
- `data/manual/seed_enrichment_overrides.csv`
- `data/manual/*.json` for current seed records
- `data/interim/grw_assets.json` for normalized GRW asset records
- `data/processed/frontend_dataset.json` for generated frontend exports
- `data/interim/gem_projects.json` for normalized GEM project records
- `data/processed/project_asset_matches.json` for first-pass matches
- `data/processed/paper_to_power_labels.json` for project and asset labels
- `data/processed/reviewed_seed_projects.json` for manually reviewed seed rows

## Next Expansion

The next pipeline stage should ingest:

1. GEM project registries
2. GRW observed assets
3. one country-specific validator source, starting with the Philippines
