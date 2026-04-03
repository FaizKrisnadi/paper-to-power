# Seed Enrichment

## Goal

Turn curated Deep Research seed rows into a practical review queue for:

- recovering exact coordinates
- tightening vague locality fields
- deciding which rows deserve promotion into the main registry

## Command

```bash
npm run prepare:seed-enrichment
```

## Input

```text
data/processed/deep_research_seed_projects.json
```

## Outputs

```text
data/interim/seed_enrichment_queue.json
data/interim/seed_enrichment_queue.csv
data/processed/seed_enrichment_queue.json
```

## Queue Design

Each queue row includes:

- project identity
- country and technology
- best current location fields
- source URLs
- a suggested search query
- a priority score
- a recommended next action

## Priority Logic

Higher priority rows are generally:

- accepted by curation
- supported by high-confidence or official sources
- likely utility-scale sites with a usable locality signal
- likely to match to observed assets once coordinates are recovered

Lower priority rows are generally:

- vague and heavily conflicted
- weak-source rows
- review-only rows with poor locality detail

## Recommended Workflow

1. work through the queue from highest priority to lowest
2. recover coordinates or exact locality from official sources
3. record a stronger source if the current source is weak
4. promote only cleaned rows into the main registry path
