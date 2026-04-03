# First-Pass Matching

## Goal

Create a conservative first-pass match between:

- GEM project registry records
- GRW observed asset records

This stage is meant to produce defensible candidate matches, not maximize recall.

## Command

```bash
npm run match:firstpass
```

## Input Files

```text
data/processed/project_registry.json
data/processed/observed_assets.json
```

## Output Files

```text
data/interim/project_asset_matches.json
data/processed/project_asset_matches.json
data/processed/paper_to_power_labels.json
```

## Matching Rules

Current matcher assumptions:

- same `countryCode`
- same `technology`
- project latitude and longitude must exist
- asset centroid must exist
- one project can match to at most one asset
- one asset can match to at most one project

## Scoring Components

### Distance

Highest-weight signal. Uses project coordinates versus GRW asset centroid.

### Time

Uses `claimedCod` from the project and `observedFirstSeenQuarter` from the asset when both can be parsed.

### Capacity

Uses project claimed MW versus asset estimated capacity proxy when both are available.

For wind assets, capacity is often neutral because the current GRW public shape is point-based and does not provide a robust proxy in this stage.

## Current Labels

- `claimed_not_observed`
- `observed_on_schedule`
- `observed_delayed`
- `observed_smaller_than_claimed`
- `observed_unmatched`

Deliverability labels are intentionally not assigned here. That belongs to the next stage.

## Constraints

- no fuzzy text matching yet
- no province-level geocoding fallback yet
- no many-to-one phase clustering yet
- no manual override table yet

## Next Expansion

1. add country validator merges
2. add manual review overrides
3. add better phase-aware matching for large multi-stage projects
