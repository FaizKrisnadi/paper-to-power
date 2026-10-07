# Paper to Power repair checkpoint — 5 October 2026

The core evidence pipeline and public interface have been repaired locally. The review preserves the existing visual identity and prior research files, while replacing unsupported delivery metrics with source, coverage and review information. This is a validated local replacement; it has not been deployed or presented as a completed research census.

## Changes completed

- Preserved the 52-row baseline and resolved two duplicate aliases, producing 50 unique projects across ten countries.
- Completed 14 project-specific documentary reviews. Dates, phases and capacity bases now remain distinct; the other 36 records are flagged for reconciliation.
- Replaced greedy match publication with 314 reviewable candidates and explicit, fingerprinted approvals. No candidate was promoted without attribution review.
- Removed the area-to-MW capacity proxy, unsupported smaller-than-claimed and schedule verdicts, and the invalid non-detection percentage. Unknown capacity remains null.
- Introduced six observation states, with separate documentary review, commissioning, expected dates, schedule assessment and grid context.
- Rebuilt the JSON, TypeScript, CSV, GeoJSON, Parquet, DuckDB and audit outputs against one canonical registry. Cached infrastructure proximity was reconciled for 15 records; it does not establish connection.
- Reworked the narrative, country summaries, explorer, drawers and methodology. Added working filtered exports, public evidence downloads, input hashes, focus styles and reduced-motion support.
- Updated vulnerable JavaScript dependencies, fixed MapLibre worker bundling, removed an unsuitable external elevation source and added locked Python dependencies, regression tests and a CI workflow.

## Selected documentary corrections

[Tengeh's opening announcement](https://www.pub.gov.sg/Resources/News-Room/PressReleases/2021/07/SEMBCORP-AND-PUB-OFFICIALLY-OPEN-THE-SEMBCORP-TENGEH-FLOATING-SOLAR-FARM) supports 60 MWp and operation in July 2021. Earlier nearby GRW polygons must not be assigned automatically to this later phase.

[UPC's Sidrap project record](https://upcrenewables.com/projects/sidrap) describes 75 MW and 30 turbines. Nearby candidate points need a complete, phase-aware attribution review; a single point cannot establish whole-project capacity.

[The Philippine DOE's indicative project list as of June 2025](https://prod-cms.doe.gov.ph/documents/d/guest/06-luzon-indicative-1-pdf) identifies the 1,600 MW Claveria offshore proposal with an April 2032 commercial target. It must not be assessed as missing from a June 2024 onshore observation extract or confused with a differently sized project sharing locality names.

## Validation

The local run passed 32 Python regression tests, ESLint, the TypeScript/Vite production build, research export rebuild, release semantic/hash validation and an npm audit with zero reported vulnerabilities. Additional tests verify the active project population in Parquet and DuckDB, preventing the earlier split between registry and geospatial counts.

Headless Chrome checks passed at 1440×1000 and 390×844. They exercised both maps, country/technology/observation filters, empty states, Singapore's four-row CSV export, source and date details, Escape/close controls, Claveria's offshore/date exclusions and all three download endpoints. The run recorded no page errors, console errors or HTTP failure responses. Screenshots were inspected for desktop and mobile layout. This is browser and keyboard smoke validation, not a formal accessibility conformance certification.

Validated commands:

```bash
npm run build:research
npm test
npm run lint
npm run build
npm run validate:data
npm audit --audit-level=high
CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" uv run --extra test python tests/browser_smoke.py
```

The committed GitHub Actions workflow is prepared; a hosted run has not been claimed. The build still reports a large MapLibre chunk warning, although its library and worker are loaded as separate assets.

## Research and publication still open

There are 36 documentary reconciliations, 314 unapproved asset candidates and no completed eligible site reviews. Therefore zero approved footprints and a null non-detection percentage describe the review state, not the physical absence of these projects.

The next research step is to verify Tengeh and Sidrap site/phase geometry and review their candidate bundles, then work through the source reconciliation queue. The February 2026 downloadable GEM tracker is not fully reconciled. No new satellite inference, raw imagery acquisition or paid service was used. Additional observation work should follow eligibility screening rather than automatically processing future, offshore or uncovered projects.

Source-rights documentation is provided, but the owner has not selected a code license. Deployment, release tagging and live verification remain open. The local replacement is ready to inspect before deciding on publication.
