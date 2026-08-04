# Phase 1 report notes

## Audience and decision

- Audience: project owner and future research collaborators.
- Decision: whether the current public claims are sufficiently supported to remain unchanged while the registry is refreshed.
- Phase boundary: this report audits the current state only. It does not refresh individual project claims or add countries.

## Report spine

1. Executive summary and release recommendation.
2. Current evidence population and headline-denominator failure.
3. Severity distribution and mechanisms creating false certainty.
4. Generated-artifact consistency.
5. Phase 2 entry criteria.
6. Caveats and open questions.

## Chart contract and map

| Element | Contract |
|---|---|
| Question | How many Phase 1 findings fall into each severity tier? |
| Takeaway | Two critical and six high-severity findings mean the current headline and capacity-based labels should be held pending registry and method repair. |
| Chart type | Single-series bar chart. |
| Grain | One row per severity tier. |
| Encodings | Severity on x; finding count on y. No redundant colour grouping. |
| Context fields | Affected finding IDs and immediate action remain in the chart dataset for exploration. |
| Source | `findings.csv`, aggregated without weighting. |

The report also uses exact tables for the ten findings, seven artifact-consistency checks, and twelve highest-issue project records. Tables are used where exact wording and identifiers matter more than shape.

## Definitions

- `coverage unavailable`: the current observation layer does not include the project's country.
- `claimed not observed`: the current public label applied where no project-to-asset match exists, including records without observation coverage.
- `capacity proxy`: the current observed-capacity value produced from mapped area using a fixed multiplier, rather than a verified nameplate-capacity field.
- `on schedule`: the current public label assigned to a matched project; the audit tests whether a claimed commissioning date exists to support that conclusion.
- `drift`: a generated artifact's row count disagrees with the active registry or matching output.

## Sources and lineage

- `baseline_summary.json`: aggregate counts computed from the current repository at commit `93b76a85134390d7a50eeec2b9e46ab1aeb12abc`.
- `findings.csv`: deterministic issue calculations produced by `audit_phase1.py`.
- `artifact_consistency.csv`: count comparisons across active and stale generated artifacts.
- `project_audit.csv`: one row per current registry record, including triggered issue flags.
- Live deployment: HTML and JavaScript bundle retrieved from `https://energy.faizkrisnadi.com/` on 2026-08-04; hashes are recorded in `baseline_summary.json`.

## Assumptions and omissions

- This is a repository and deployment baseline, not the documentary source refresh. Current project status, capacity, and dates are not treated as newly verified.
- Probable duplicate groups are review candidates, not automatic deletions.
- The audit treats the repository's current Global Renewables Watch country list and 2024 Q2 endpoint as the operative observation boundary.
- No satellite imagery was downloaded and no machine-learning inference was run.
- The priority-project table is a deterministic top-twelve slice by issue count then project ID; it is illustrative, not a complete replacement for `project_audit.csv`.

## Report QA

- Every visible quantitative element is tied to a listed source.
- Percentages retain both numerator and denominator in the findings table.
- The report separates current observation coverage from actual non-detection.
- Recommendations stop at Phase 2 entry criteria; they do not pre-judge documentary rechecks.
