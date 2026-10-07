# Paper to Power

Paper to Power is a public evidence explorer for renewable-energy project claims across Southeast Asia. It separates documentary claims, observed physical footprints, commissioning dates, source review and nearby infrastructure so that missing information cannot become a verdict about project delivery.

The local release dated **7 October 2026** contains **5,136 records across 11 Southeast Asian countries**: 5,118 provider units or phases from GEM's September 2026 public map, eight research overviews linked to provider phases, and ten research records with unresolved provider identities. These are record counts, not unique plants. The preserved research baseline has 50 unique projects, including 14 documentary reviews; importing or linking a provider record does not create an independent review. See [the current stage and identity reconciliation](docs/stage-and-identity-reconciliation.md) and [the initial provider refresh](docs/september-2026-refresh.md).

The saved Global Renewables Watch extract still ends in **2024 Q2**, covers five countries and contains 2,311 assets. **30 approved partial asset attributions across Tengeh and Sidrap** and five excluded candidates are preserved. These reviews establish partial footprints, without establishing capacity or completion. There are currently zero fully eligible site reviews, so no non-detection percentage is published.

[Public site](https://energy.faizkrisnadi.com) · [Repository](https://github.com/FaizKrisnadi/paper-to-power)

The public site may still serve the earlier release. This repair has been built and checked locally; it has not been deployed.

## Local setup

For Cloudflare Pages Git deployments, use production branch `main`, build command `npm run build:web`, output directory `dist`, and repository root `/`. `build:web` compiles the committed, validated frontend data snapshot without fetching sources or requiring the Python research runtime. Data changes must still pass the full local release workflow below before being committed.

Use Node.js 22.12 or later, Python 3.11–3.13 and [uv](https://docs.astral.sh/uv/). Both JavaScript and Python dependency resolutions are committed.

```bash
npm ci
uv sync --locked --all-extras --python 3.11
npm run build:data
npm run build:research
npm test
npm run lint
npm run build
npm run validate:data
npm run dev
```

`build:data` reconstructs the canonical registry, saved observation assets, candidate matches, evidence labels and frontend exports without network requests. `build:research` also rebuilds cached infrastructure proximity, GeoJSON/Parquet exports, the DuckDB warehouse and site-audit downloads. Fetching new sources is a separate research operation, because a successful download does not establish identity, phase, coverage or claim validity.

## Evidence rules

- Documentary capacity retains its reported AC, DC/MWp, unspecified or hybrid basis. Incompatible bases are not summed into a delivery gap.
- Observed polygons and turbine points establish geometry only after explicit attribution review. Area and turbine counts are not converted into generation capacity.
- Non-detection requires suitable technology, included observation coverage, verified site coordinates, a reviewed expected operating date before the cutoff and a completed site review. A missing candidate is insufficient.
- First-seen imagery dates do not establish commissioning dates or schedule compliance.
- Infrastructure proximity describes the saved open-map extract, not a grid connection or evacuation capacity. Unknown snapshot dates and coverage remain visible.
- Each candidate approval requires a reviewer, date, reason, supporting URLs and fingerprints of both the project and asset. Stale approvals fail validation. Multiple assets may belong to one project, but one asset cannot silently be allocated to multiple phases.

See [the methodology](docs/evidence-methodology.md), [repair checkpoint](docs/repair-checkpoint-2026-10-05.md) and [source and reuse notes](docs/data-rights.md).

## Editable sources and generated outputs

Edit `data/manual/registry_reviews.json` for sourced documentary corrections and `data/manual/match_reviews.json` for asset decisions. `registry_baseline.json` preserves the original registry, including legacy values. Do not edit generated frontend data as a substitute for reviewing source records.

The current release pipeline is `refresh_registry` → `ingest_grw` → `match_projects` → `build_frontend_exports`, followed by optional geospatial and warehouse exports. Earlier import/enrichment/promote scripts are staging tools; their outputs must be reconciled into the explicit review inputs before entering this release. `npm run build:data` restores the canonical release from those inputs.

| Output | Purpose |
| --- | --- |
| `data/processed/project_registry.json` | Canonical projects, reviews and resolved aliases |
| `data/processed/match_candidates.json` | Unapproved spatial research candidates |
| `data/processed/project_asset_matches.json` | Explicitly approved attributions only |
| `data/processed/frontend_dataset.json`, `src/data/generated.ts` | Shared frontend evidence contract |
| `public/downloads/project-evidence.json`, `.csv` | Public evidence downloads |
| `data/processed/release_manifest.json` | Input and public-output SHA-256 hashes |
| `data/processed/geospatial/` | Active-release geometry, warehouse and audit exports |

The interface opens with a cinematic video hero and fixed section navigation, followed by the four-chapter animated regional map story. The explorer leads with country, technology and reported project stage; observation review filters expand on demand. Research overviews link to individual provider phases. The country index follows the explorer, and Tengeh and Sidrap close the regional story with geographic basemaps, reviewed GRW geometry, a detection timeline and keyboard-accessible asset selection. Manrope is used consistently across interface headings, body text and controls.

## Interactive evidence pilot

The Tengeh/Sidrap section shows attributed solar polygons and turbine points against bounded OpenStreetMap references. A quarter slider reveals first detections while retaining the distinction between detection and commissioning. Readers can select geometry, inspect phase reasoning and download all 35 decisions plus the attributed reference GeoJSON. The reference is community-mapped geometry, not an engineering survey. Its retrieval date and ODbL attribution are explicit.

## Validation and remaining research

Optional interactive smoke checks use `uv run --extra test python tests/browser_smoke.py` against a preview on port 4173. Install Playwright Chromium with `uv run --extra test playwright install chromium`, or set `CHROME_PATH` to an existing Chrome binary. `PREVIEW_URL` and `BROWSER_ARTIFACTS` can override the preview address and screenshot directory.

The test suite covers date precision, temporal and technology exclusions, unknown-versus-zero behavior, reviewed matching, stale approvals, duplicate resolution, deterministic exports, source-review provenance and CSV formula protection. GitHub Actions runs locked installation, rebuilds, tests, lint, production build, release validation and the dependency audit. The workflow has been added; a hosted CI run is not claimed until the change is pushed.

The remaining research queue consists of 36 documentary reconciliations, verification of project coordinates, review of 279 remaining spatial candidates and any justified observation updates after June 2024. Tengeh and Sidrap now have reviewed partial asset bundles; Claveria's offshore proposal is outside the current method and its reviewed commercial target is April 2032. No new satellite inference or imagery acquisition has been performed in this repair.

## Reuse

No project code license has been granted here. Treat reuse as restricted until the owner chooses a license. External data and maps have their own terms and attribution requirements; see `docs/data-rights.md`. A source citation does not grant redistribution rights to a full report or dataset.
