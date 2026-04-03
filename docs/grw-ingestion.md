# GRW Ingestion

## Goal

Normalize Global Renewables Watch feature exports into a five-country observed asset registry for:

- Indonesia
- Philippines
- Singapore
- Vietnam
- Malaysia

## Public Shape

The current ingest targets the public property shape documented in the GEE community catalog:

- `area_m2`
- `construction_date`
- `land_cover_2018`
- `country_code`

Dataset references:

- solar: polygons
- wind: points

## Input Location

Drop raw GRW GeoJSON exports into:

```text
data/raw/grw/
```

Expected file naming:

- names containing `solar` or `wind`

Examples:

- `grw_solar_v1.geojson`
- `grw_wind_v1.geojson`
- `indonesia_solar.geojson`

## Command

```bash
npm run ingest:grw
```

## Outputs

```text
data/interim/grw_assets.json
data/processed/observed_assets.json
```

## What Gets Normalized

- site ID
- source file and feature index
- country code
- technology
- geometry type
- raw geometry
- observed first-seen quarter
- observed latest quarter
- observed area hectares
- preceding land use

## Constraints

- GeoJSON only for now
- filtered to the five-country scope
- no spatial clustering or aggregation yet
- no project matching yet

## Next Step After GRW

After GRW ingest is stable:

1. join GEM projects to observed assets
2. score temporal discrepancy
3. compute first-pass deliverability metrics
