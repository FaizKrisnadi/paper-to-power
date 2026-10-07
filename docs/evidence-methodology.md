# Evidence methodology — version 2.0.0

## Scope and provenance

This is a curated project sample, not a complete national renewable-energy census. The 5 October 2026 review preserves the old registry as a baseline and records explicit documentary overrides, conflicts and two duplicate resolutions. A source publication date, access attempt and substantive claim review are different fields. HTTP 200 responses and search hits do not establish project identity; soft-404 pages remain unverified.

The current GEM source pages were checked as research leads where accessible. The February 2026 downloadable tracker has not been fully imported or reconciled, so this release does not claim a complete GEM refresh. A source that describes a phase, tender, groundbreaking or proposed expansion is not converted into evidence of whole-project operation.

## Observation eligibility and status

The saved regional GRW extract covers Indonesia, Malaysia, the Philippines, Singapore and Vietnam through 30 June 2024. Registry projects in the other five countries receive `coverage_unavailable`; this is a statement about the saved extract rather than the global dataset. Offshore and hybrid projects receive `method_not_applicable`. A reviewed expected date after the observation cutoff receives `not_yet_due_at_cutoff`.

An eligible non-detection review additionally requires site-accurate coordinates, a reviewed documentary claim, an expected date whose complete precision interval ends before the cutoff, and a completed site observation review. Year, month, quarter and range dates retain their precision. Missing, invalid or ambiguous dates remain unresolved. Remaining cases receive `review_pending`.

An approved attribution yields `observed_footprint`, which does not establish capacity, commissioning or electricity production. The percentage denominator is the number of eligible reviewed projects. If that number is zero, the result is null and the interface explains why a percentage is unavailable.

## Candidate matching and decisions

Candidates use country, technology, installation type and distance. Verified site points use a 10 km search radius and unverified or representative points use 30 km; a wider search is a review aid, not confidence. Offshore and hybrid claims are excluded. Candidate distance cannot settle identity, phase or shared ownership.

Approvals in `data/manual/match_reviews.json` must include project ID, asset ID, project and asset fingerprints, reviewer, review date, decision reason and evidence URLs. They may associate multiple assets with one project. Changed input records invalidate old approvals, and conflicting attribution across projects raises an error. Rejected decisions remain in the review log. The pilot approves three Tengeh polygons and 27 distinct Sidrap turbine points as partial project attributions, with five Tengeh candidates excluded. Tengeh phase attribution combines PUB chronology with approximately 99% overlap against the separately mapped commercial boundary. Sidrap attribution combines the documented 30-turbine project with 27 unique mapped positions, at approximately 8–56 m offsets. The preserved reference features and review decisions allow the comparisons to be recomputed.

Reference geometry was fetched from OpenStreetMap on 5 October 2026. Sidrap turbine element timestamps are April 2020; the Tengeh boundary was updated in April 2026 and carries an explicit refinement caution. A newer reference is used to corroborate project identity, not to create a 2024 observation or claim full as-built precision. The earlier Tengeh polygon is excluded from the commercial phase because it predates construction and lies outside the mapped boundary. Its precise testbed identity is not asserted solely from geometry.

## Capacity and schedules

Reported capacity retains its basis and source. AC capacity, DC/MWp capacity and unspecified or hybrid capacity are not silently treated as equivalent. No area-to-MW multiplier or assumed per-turbine MW conversion is used. Observed capacity is unknown, not zero.

Reported operation and expected operation are separate. Satellite first appearance is not commercial operation. All schedule comparisons remain `not_assessable` until an independent baseline and completion evidence support them.

## Infrastructure context

The cached OSM extract is used only for nearest mapped infrastructure proximity. It does not establish an electrical interconnection, available capacity, readiness or project commissioning. Context follows the current project coordinates, with fingerprints preventing stale reuse. Fifteen records have proximity evidence; snapshot publication dates are unavailable. No nearby feature in this partial extract is not proof that infrastructure is absent.

## Release consistency

The JSON, generated TypeScript, CSV and map layers use the same 50-project population. The manifest hashes the manual inputs, processed evidence inputs and public outputs. Validation rejects unsupported capacities, schedule claims, unreviewed matches, missing reviewed-claim provenance and population mismatches. GeoJSON and Parquet include empty approved-match layers explicitly rather than retaining old matches.
