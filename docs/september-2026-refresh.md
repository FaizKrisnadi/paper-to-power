# September 2026 regional source update

This report describes the initial import. For the current population and follow-up decisions, see [stage and identity reconciliation](stage-and-identity-reconciliation.md).

Imported on 7 October 2026 from Global Energy Monitor's official public Integrated Power Tracker map CSV. This is the map derivative, not the full workbook. The harmonized release date does not establish that every individual project was checked in September.

## Population and grain

The regional extract contains **5,118 provider units/phases**, across eleven Southeast Asian countries, associated with **4,630 provider plant IDs**. Eighteen explicit one-to-one links preserve existing research record IDs; thirty-two unlinked research records remain as supplements. The application therefore displays **5,150 records**, not 5,150 unique power plants. Supplements can overlap provider records, while provider plant IDs can group multiple phases. No regional MW total is published.

| Technology | Provider records |
|---|---:|
| Solar | 3,193 |
| Wind | 990 |
| Conventional hydropower | 461 |
| Geothermal | 191 |
| Bioenergy | 247 |
| Pumped storage (separate) | 36 |

All eleven countries are included; Timor-Leste has two provider solar records. Imported coordinates are present and within legal latitude/longitude ranges, but provider exact coordinates are not independently verified site locations.

## What remains reviewed

The fourteen independently checked documentary claims, their capacity bases, sources and dates, and all thirty approved geometry attributions remain unchanged. The two mapped examples retain their original project fingerprints. Provider capacity/status disagreements are kept in the separate September provider record, rather than overwriting checked evidence. All imported records remain pending independent documentary/site review.

GRW remains the saved five-country solar/onshore-wind extract through June 2024. Hydro, geothermal, bioenergy and pumped storage cannot be judged as missing by this method. There are no completed eligible non-detection reviews and no defensible regional non-detection percentage.

## Scope and capacity

GEM's stated thresholds: operating utility solar above 1 MW; announced, pre-construction, construction and shelved solar above 20 MW; wind 10 MW and above; hydropower 30 MW and above; geothermal 1 MW and above; bioenergy units 20 MW. The imported rows are preserved as published, including source exceptions; these thresholds are not applied as a second destructive filter. Small/distributed projects are not exhaustively represented.

Pumped storage is energy storage, displayed separately from conventional hydro. Bioenergy rows can include multiple fuels, waste, conversions and co-firing; full unit capacity is not asserted to be renewable capacity. Solar map MW does not supply a row-level original AC/DC basis, so its provider definition is retained separately from independently checked DC/peak claims. Start year is retained at year precision for operating records; publication date is not fabricated.

## Reproduction and source lineage

Public source: https://publicgemdata.nyc3.cdn.digitaloceanspaces.com/Current_maps/integrated-power/2026-09/integrated_map_2026-09.csv

Source page and methodology: https://globalenergymonitor.org/projects/global-integrated-power-tracker

Source last-modified header: 24 September 2026, 11:20:47 UTC. Full source SHA-256 and regional extract SHA-256 are in `data/raw/gem/gipt-sea-map-2026-09.provenance.json`. The source download is retained in `work/phase-2-refresh/`; the bounded regional CSV is the committed input. Explicit identity links are in `data/manual/gipt_crosswalk.json`; unresolved supplements are listed in `data/processed/registry_refresh_report.json`.

```sh
uv run python -m pipeline.import_gipt --extract work/phase-2-refresh/gipt-map-2026-09.csv
npm run build
npm run build:research
npm test
npm run lint
npm run validate:data
```

Review changes to the CSV and explicit crosswalk before replacing this pinned snapshot with a future release. The importer rejects missing/duplicate unit IDs, invalid coordinates/capacities, broken crosswalk IDs and cross-country links. Normal builds are deterministic and offline; they do not fetch or silently advance source dates.

## Interface

The regional map retains the animated story and video. Technology filters now include the new generation categories and separate pumped storage. Numbered map clusters, search and a table page with fifty desktop rows or ten phone rows keep the larger population usable. Click a cluster to zoom into its members. Full filtered exports contain all matching records, not just the current table page. Provider details retain unit IDs, technology/fuel composition and source links. Repeated browser defaults are factored out of the bundle while downloadable records retain the complete contract.

## Validation

The full data/application build, research exports, release hash/semantic validation and lint passed. Forty-two Python regression tests passed. Browser smoke checks passed at desktop, tablet and phone widths, covering video autoplay, filters, map controls, downloads, unchanged pilot reviews and keyboard interaction. Expanded-coverage checks verified hydro, geothermal, bioenergy, pumped storage, Timor-Leste, pagination reset, full filtered exports and cluster expansion. Existing public deployment has not been changed.
