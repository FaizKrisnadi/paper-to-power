# Deep Research Import

## Goal

Convert a markdown document produced by Gemini Deep Research into structured JSON files that can be reviewed and selectively folded into the repo.

This is not treated as a canonical registry. It is a provisional, manually collected seed dataset.

## Command

```bash
npm run import:deepresearch -- "/absolute/path/to/file.md"
```

If no path is provided, the importer defaults to:

```text
/Users/faizkrisnadi/Downloads/Southeast Asia Renewable Project Data Collection.md
```

## Output Files

```text
data/interim/deep_research_projects.json
data/interim/deep_research_sources.json
data/interim/deep_research_unresolved.json
```

## What It Parses

- `OUTPUT A` normalized project registry table
- `OUTPUT B` source audit log
- `OUTPUT C` unresolved / missing-data list

## Current Caveats

- markdown-table parsing is heuristic
- link fields are flattened to URLs or raw text
- this import does not yet merge with GEM or country validators
- row quality still needs manual review before promotion into the main registry

## Recommended Use

Use this import to:

1. inspect coverage gaps
2. extract useful source URLs
3. seed hand-curated case-study candidates

Do not treat it as the final project registry without further validation.
