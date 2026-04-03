# Manual Seed Enrichment

## Goal

Promote curated seed rows into a more reliable reviewed registry after manual source validation.

This step is for rows where you have recovered:

- exact coordinates
- better locality text
- corrected capacity or COD
- stronger source URLs

## Inputs

```text
data/processed/deep_research_seed_projects.json
data/manual/seed_enrichment_overrides.csv
```

## Command

```bash
npm run apply:seed-enrichment
```

## Outputs

```text
data/interim/reviewed_seed_projects.json
data/processed/reviewed_seed_projects.json
data/processed/reviewed_seed_promotion_candidates.json
```

## Review Status Values

- `approved`
- `rejected`
- `pending`

## Promotion Rule

A row is considered promotion-ready when:

- review status is `approved`
- latitude and longitude are present after overrides
- country code, technology, and project name are still present

## Suggested Workflow

1. open `data/interim/seed_enrichment_queue.csv`
2. populate `data/manual/seed_enrichment_overrides.csv`
3. run `npm run apply:seed-enrichment`
4. inspect promotion candidates
5. only then merge reviewed rows into the main registry path
