---
mode: plan
task: Paper to Power evidence refinement
created_at: 2026-08-04T10:48:23+08:00
complexity: complex
---

# Plan: Paper to Power Evidence Refinement

## Goal
- Turn the existing product into a transparent, reproducible, and methodologically defensible geospatial audit.
- Recheck every retained project against current 2026 claim and status sources.
- Separate project claims, observed footprints, schedule assessment, and grid context.
- Preserve the strong interface while replacing misleading metrics and labels.
- Minimize storage and computation while maximizing defensible evidentiary value.

## Scope
- In:
  - Current Paper to Power countries and projects only.
  - Complete registry refresh and deduplication.
  - February 2026 GEM solar and wind data.
  - Current national, regulator, developer, and financing sources.
  - GRW evidence through 2024 Q2.
  - Targeted recent imagery validation only where it could change a public conclusion.
  - Matching, classification, methodology, frontend, documentation, testing, and deployment improvements.
  - Licensing and source-attribution review.
- Out:
  - Adding countries.
  - Claiming comprehensive ASEAN coverage.
  - Treating infrastructure proximity as proof of grid connection.
  - Presenting estimated footprint capacity as verified generation capacity.
  - Automatically treating non-matches as failed or abandoned projects.
  - Paid APIs, imagery, cloud compute, storage, software, or datasets without explicit user approval.

## Assumptions / Dependencies
- The live site remains available while refinement occurs.
- Deduplication may reduce the public project count below 52.
- GEM downloads may require a form and dataset-specific attribution.
- GRW remains the reproducible observation baseline through 2024 Q2.
- Every project receives a current documentary review, but satellite inference is reserved for eligible unresolved cases.
- Representative coordinates are not treated as exact project boundaries.
- A project is eligible for `not_detected_by_cutoff` only when coverage exists, its expected operating date precedes the observation cutoff, its location is sufficiently accurate, and the technology is detectable by the method.
- Work proceeds one phase at a time, with a user-visible checkpoint before the next phase begins.

## Phases
1. Preserve and diagnose the current version.
   - Record the deployed version, metrics, input hashes, evidence cutoffs, and generated outputs.
   - Build a baseline audit of every current registry row.
   - Identify duplicates, ineligible comparisons, stale artifacts, and contradictions.
2. Refresh and deduplicate the claim registry.
   - Reconcile February 2026 GEM releases and current authoritative project sources.
   - Add checked dates, source dates, source identifiers, archive links, stable project IDs, and phase IDs.
3. Replace the overloaded status model.
   - Separate claim status, observation status, schedule assessment, grid context, and review status.
   - Add observation-source, time-window, method-version, and eligibility fields.
4. Rebuild the observation layer using a cheapest-reliable-evidence-first cascade.
   - Reuse GRW vectors without reprocessing existing imagery.
   - Exclude duplicates, ineligible projects, unsuitable technologies, and imprecise locations before imagery work.
   - Inspect cloud-hosted previews before downloading imagery.
   - Pilot targeted inference on Tengeh, Sidrap, and Claveria only.
   - Scale only if the pilot produces reliable, decision-relevant evidence.
   - Keep raw imagery out of Git and retain only compact derived artifacts and provenance.
5. Replace greedy matching with reviewed evidence bundles.
   - Generate candidates rather than final matches.
   - Support multiple geometries and project phases.
   - Add onshore/offshore, technology, timing, coordinate-accuracy, and geometry constraints.
   - Require manual approval for every published match.
6. Reframe grid evidence.
   - Rename Grid Readiness to Grid Context.
   - Treat OSM infrastructure as proximity evidence only.
   - Reserve connection and delivery language for project-specific authoritative evidence.
7. Redesign the public narrative and interface.
   - Replace the 46 percent headline with a cutoff-aware, denominator-valid statement.
   - Display claim-check dates, observation cutoffs, eligibility, coverage gaps, and review status.
   - Add evidence timelines, methodology, limitations, downloads, citations, and accessibility improvements.
8. Make the repository reproducible.
   - Declare and lock Python dependencies with uv.
   - Remove hard-coded runtime discovery.
   - Add deterministic Node installation, tests, CI, documentation, and licensing.
9. Review and deploy.
   - Conduct row-level review, preview deployment, regression checks, and live verification.
   - Tag dataset and application releases separately.

## Tests & Verification
- Every retained project is unique -> normalized-name, identifier, and spatial-near-duplicate tests.
- Every claim has provenance -> schema validation requiring source ID and checked date.
- Observation labels respect evidence dates -> temporal-eligibility tests.
- Uncovered or not-yet-due projects never enter non-detection metrics -> aggregation tests.
- Estimated capacity is never displayed as observed capacity -> schema and UI tests.
- Offshore projects cannot match onshore assets -> matching constraint tests.
- Missing commissioning dates cannot produce schedule conclusions -> classification tests.
- Multi-feature projects aggregate valid geometries -> matching fixture tests.
- Tengeh, Sidrap, and Claveria are manually verified -> golden-case regression tests.
- Generated artifacts agree on project and match counts -> cross-output consistency tests.
- Installation is reproducible -> clean uv sync, npm ci, tests, lint, and production build.
- Public content states cutoffs and uncertainty -> content assertions and manual review.
- Live release matches the reviewed preview -> deployed dataset and asset smoke tests.
- Imagery work is resource-efficient -> per-job reason, downloaded bytes, runtime, cache reuse, and retained-storage audit.

## Issue CSV
- Path: issues/2026-08-04_10-48-23-paper-to-power-evidence-refinement.csv
- Must share the same timestamp and slug as this plan.

## Tools / MCP
- Local repository inspection and Git for code and data lineage.
- Official-source web research for GEM, GRW, and project-status verification.
- Python 3.11 with uv for registry, geospatial processing, and validation.
- Node/npm for the React application.
- GeoPandas, DuckDB, and MapLibre for geospatial exports and presentation.
- Copernicus/Sentinel-2 and GRW inference only after the resource-gated validation step.
- No external messaging or submission tools.

## Acceptance Checklist
- [ ] No additional countries are added.
- [ ] Every retained project is rechecked against current sources.
- [ ] Duplicates and project-phase ambiguities are resolved or explicitly flagged.
- [ ] Claim dates and observation dates are stored separately.
- [ ] Every public metric has an eligible denominator.
- [ ] No coverage-unavailable or not-yet-due project is called unmaterialized.
- [ ] Placeholder capacity estimates are removed from observed-build claims.
- [ ] Every published match is manually reviewed.
- [ ] Grid proximity is not presented as proof of connection.
- [ ] Limitations are visible in the interface.
- [ ] Generated artifacts are internally consistent.
- [ ] Tests, lint, and production build pass from a clean installation.
- [ ] Licensing and attribution are documented.
- [ ] No paid service or dataset is used without explicit approval.
- [ ] Every imagery job has a documented decision-changing reason.
- [ ] Raw imagery is not committed or retained unnecessarily.
- [ ] Preview and live deployment are verified.

## Risks / Blockers
- GRW's reproducible observation cutoff remains 2024 Q2.
- Recent imagery may be cloud-obscured or insufficient for small and floating installations.
- GEM access and licensing requirements must be followed.
- Project-versus-phase identity may remain ambiguous.
- Offshore leases and representative coordinates are vulnerable to false matches.
- Some apparent under-delivery findings may disappear after correct aggregation.
- A more credible headline may be less dramatic.

## Rollback / Recovery
- Preserve current inputs, generated datasets, and deployed-build identifiers as a versioned baseline.
- Implement schema changes through migration scripts rather than destructive rewriting.
- Commit each phase independently.
- Keep the existing public release active until the revised preview passes review.
- If recent-imagery inference is unreliable, retain the GRW 2024 Q2 cutoff and publish the limitation.

## Checkpoints
- Commit after: baseline audit and source manifest.
- Commit after: registry refresh and deduplication.
- Commit after: schema migration.
- Commit after: observation and matching validation.
- Commit after: frontend reframing.
- Commit after: reproducibility and CI.
- Commit after: final reviewed data release.
- Commit after: verified deployment.

## References
- src/components/HeroSection.tsx:4
- pipeline/ingest_grw.py:81
- pipeline/match_projects.py:84
- pipeline/match_projects.py:98
- pipeline/match_projects.py:263
- src/components/MethodologySection.tsx:21
- pyproject.toml:1
- README.md:42
- https://github.com/microsoft/global-renewables-watch
- https://globalenergymonitor.org/projects/global-solar-power-tracker
- https://globalenergymonitor.org/projects/global-wind-power-tracker
