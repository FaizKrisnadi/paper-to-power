# Deep Research Curation

## Goal

Turn imported Gemini Deep Research rows into a more useful seed layer by:

- normalizing simple field types
- excluding rows that are clearly outside the geospatial project scope
- separating promising rows from rows that still require manual validation

## Command

```bash
npm run curate:deepresearch
```

## Input

```text
data/interim/deep_research_projects.json
```

## Outputs

```text
data/interim/deep_research_seed_curated.json
data/processed/deep_research_seed_projects.json
```

## Buckets

### accepted

Rows that are useful as provisional project seeds for later manual validation or enrichment.

### review_required

Rows that may still be useful but have major gaps such as vague location, weaker sources, or conflict-heavy records.

### excluded

Rows that are poor fits for the current project scope, for example:

- distributed / aggregated Singapore programs
- records with no location signal at all
- rows that are too vague to support asset-level work

## Important

This curation step does not certify truth. It only improves usability.
The resulting seed file is still not a canonical registry.
