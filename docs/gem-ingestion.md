# GEM Ingestion

## Goal

Normalize downloaded Global Energy Monitor solar and wind tracker exports into one five-country project registry for:

- Indonesia
- Philippines
- Singapore
- Vietnam
- Malaysia

## Current Approach

The ingestion step is deliberately CSV-first and alias-driven.

Why:

- GEM download access is official but form-based.
- Tracker export schemas can drift across releases.
- the project should not hardcode one fragile column layout on day one.

## Input Location

Drop raw GEM CSV files into:

```text
data/raw/gem/
```

Supported expectations:

- one or more CSV files
- file names containing `solar` or `wind`

Examples:

- `gem_global_solar_power_tracker_feb_2026.csv`
- `gem_global_wind_power_tracker_feb_2026.csv`

## Command

```bash
npm run ingest:gem
```

## Outputs

```text
data/interim/gem_projects.json
data/processed/project_registry.json
```

## What Gets Normalized

- project name
- phase name when available
- country code
- technology
- status
- claimed capacity MW
- latitude / longitude
- location text
- developer
- owner
- source file and row number

## Config Files

- `data/manual/gem_column_aliases.json`
- `data/manual/country_name_to_code.json`

These files let the ingest adapt to minor schema changes without editing code.

## Constraints

- CSV only for now
- filtered to five countries only
- no geospatial matching yet
- no observed asset merge yet

## Next Step After GEM

After GEM ingest is stable:

1. ingest Global Renewables Watch observed assets
2. implement project-to-site matching
3. add Philippines DOE validator merge
