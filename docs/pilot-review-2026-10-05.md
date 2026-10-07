# Paper to Power: Tengeh and Sidrap evidence pilot

The local release now includes two reviewed partial project footprints and an interactive view of their attribution evidence. Thirty saved GRW assets have been approved: three commercial-phase Tengeh polygons and 27 Sidrap turbine points. Five Tengeh candidates are excluded, while 279 candidates remain pending elsewhere. These findings describe the saved observation extract, not measured generating capacity or complete construction.

## What the pilot found

| Project | Documentary record | Reviewed physical evidence | Interpretation limit |
| --- | --- | --- | --- |
| Tengeh commercial farm | 60 MWp; PUB reports opening and operation on 14 July 2021 | Three 2021 GRW polygons; about 10.4 ha combined, each approximately 99% within the mapped commercial boundary | A partial footprint. The earlier 2018 polygon is not attributed to the later commercial phase; mapped area cannot establish MWp or a capacity shortfall. |
| Sidrap phase 1 | 75 MW and 30 turbines; UPC reports grid supply from March 2018 and completion on 5 April 2018 | 27 GRW points correspond to 27 distinct numbered reference turbines, at roughly 8–56 m offsets | A partial footprint. Reference turbines 19, 24 and 27 lack corresponding saved GRW points; their physical absence is not established. Detection dates are not commissioning dates. |

PUB's [floating solar history](https://www.pub.gov.sg/public/waterloop/sustainability/solar/floating) distinguishes the 2016 testbed from the later commercial installation. Its [commercial opening announcement](https://www.pub.gov.sg/Resources/News-Room/PressReleases/2021/07/SEMBCORP-AND-PUB-OFFICIALLY-OPEN-THE-SEMBCORP-TENGEH-FLOATING-SOLAR-FARM) dates construction from August 2020 and operation from July 2021. The separately mapped commercial boundary excludes the 2018 GRW polygon, while the three 2021 polygons lie almost entirely within it. This resolves a concrete failure mode of nearest-point matching without claiming an exact identification of the older polygon from location alone.

[UPC's Sidrap project record](https://upcrenewables.com/projects/sidrap) documents the 30-turbine phase and its distinct operating and completion milestones. [ESDM's September 2017 report](https://www.esdm.go.id/id/berita-unit/direktorat-jenderal-ebtke/pltb-sidrap-pembangkit-listrik-angin-terbesar-di-indonesia) provides a pre-operation target of early 2018, retained at quarter precision. The GRW extract nevertheless gives several points first detections after the documented operating period. This supports withholding a construction-delay inference from the dataset's first-seen field.

## Attribution method and remaining uncertainty

The review compares the saved GRW geometries with bounded OpenStreetMap reference features. Sidrap has 30 numbered mapped turbine positions; every approved point corresponds to a distinct reference, rather than sharing a nearest position with another detection. Tests recompute these distances from the preserved coordinates. Tests also recompute Tengeh overlap in UTM zone 48N, avoiding geographic-degree area measurements.

The reference was fetched on 5 October 2026. Sidrap turbine elements have April 2020 version timestamps. The [Tengeh boundary](https://www.openstreetmap.org/way/979479451) was updated in April 2026 and explicitly calls for refinement when imagery becomes available. It is an approximate community map, used to corroborate attribution rather than establish an as-built survey or a new satellite observation. The [Sidrap site reference](https://www.openstreetmap.org/way/604841861) supports the named project layout. Source element IDs, versions, URLs and update dates are preserved in the downloaded reference GeoJSON.

Both project footprints remain partial. No new imagery was acquired, no new model inference was run, and no point count or area was converted into MW. Reported operation and satellite observation remain separate. Neither pilot is promoted into the non-detection denominator, because incomplete observation reviews cannot support a negative delivery verdict. The non-detection percentage therefore remains unavailable.

## Product changes

The new pilot section lets readers switch between the projects, move through GRW first-detection quarters, select individual geometries, hide the excluded older Tengeh polygon and inspect attribution reasons. It shows documentary capacity alongside reviewed geometry and explicit limitations, with source milestones and an attribution download.

The main explorer now draws the reviewed asset bundles, fits selection to all matched geometries and distinguishes approved, excluded and pending candidates. Wind area remains null rather than becoming zero. Both project drawers carry the attribution reviews, and country summaries count two projects with reviewed footprints.

Every approval records the project, asset and reference fingerprints. A changed project, asset or reference invalidates its approval instead of silently reusing the decision. The input manifest now also hashes the preserved baseline and raw regional GRW files.

## Validation

The final local run passes 38 Python regression tests, lint, the TypeScript/Vite production build and release validation. The browser smoke suite checks desktop 1440×1000 and mobile 390×844: project switching, keyboard-controlled quarter sliders, selected-asset review details, excluded-polygon toggling, both map workers, filtering, CSV export, source drawers and all five download endpoints. Screenshots were inspected for both pilot views and mobile layout. The run records no page errors, console errors or failed HTTP responses.

The checked commands are `npm test`, `npm run lint`, `npm run build`, `npm run validate:data`, `npm run build:research` and `CHROME_PATH=/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome uv run --extra test python tests/browser_smoke.py`.

The remaining work is 36 documentary reconciliations, 279 candidate decisions and any justified observation updates after June 2024. No public deployment has been performed. The pilot is a reproducible local finding with explicit bounds, ready for review before publication.
