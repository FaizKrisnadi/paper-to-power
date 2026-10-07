# Project stage and identity reconciliation

Local release: 7 October 2026. Provider snapshot: GEM September 2026 public map CSV. Deployed to the public site on 7 October 2026 through the restored Cloudflare Pages Git integration.

## What changed

Reported project stage now leads the explorer's filters, map point colours and table. Physical-evidence review remains an independent dimension under **Review filters** and in project details. Provider stage means the stage reported in the saved snapshot, without implying an independent commissioning check.

All 32 research supplements left by the initial import have been assessed:

| Decision | Records | Result |
| --- | ---: | --- |
| Same unit or phase | 14 | Research ID and original claim retained; duplicate provider entry removed; snapshot attached |
| Broader project or phase group | 8 | Research overview retained with clickable provider phases; no capacity assigned to a single phase |
| Identity unresolved | 10 | Research entry retained separately with reasoning; no speculative provider link |

The active population is **5,136 records**: **5,118 provider units/phases + eight project overviews + ten unresolved research records**. Provider rows contain **4,630 distinct plant IDs**. The total is not a count of unique plants, and overview capacities must not be added to the linked phases.

The one-to-one crosswalk now has 32 links, including 18 from the initial import and 14 from this follow-up. All original 50 research IDs remain present. Fourteen independent documentary reviews and 30 approved asset attributions remain unchanged.

## Stage and conflicting evidence

Provider-linked records use the September 2026 provider stage. Overviews use a common stage only when all linked phases agree; otherwise they show **Multiple stages**. Records without a defensible provider identity retain their research stage, and ambiguous descriptions such as “shortlisted” show **Stage unresolved**. The raw stage value, source and URL are exported.

Original research capacities, stage claims, dates, sources and attribution fingerprints are preserved. Differences remain visible in review details. The Pandan research claim remains 86 MWp while the saved provider map reports 55 MW; neither is silently replaced. Laoag's overview retains its old construction description while its linked provider phases report operating stages.

## Source access and decision boundaries

Decisions use country, names and aliases, phase scope, capacity, ownership, coordinates and cited source context. A similar name or nearby location alone is insufficient. Supporting URLs and reasons are stored in `data/manual/gipt_reconciliation.json`; populations and decisions are exported in `public/downloads/registry-reconciliation.json`.

Direct wiki retrieval remained unavailable for Brunei PV, Minbu and NOM FL1. Access failures are recorded in the decision file. A link relying on provider identity and other source context is an identity assessment, not a new independent documentary review. The ten unresolved records retain their specific conflicting or missing evidence.

Provider thresholds and source exceptions remain those described in the initial refresh report. Distributed and small projects are not exhaustively represented. GRW observations still stop in June 2024; this update does not extend observation coverage or establish a regional non-detection rate.

## Reproduction and verification

Run `npm run build:data`, `npm run build`, `npm run build:research`, `npm test`, `npm run lint` and `npm run validate:data`. The importer rejects duplicate provider IDs, non-one-to-one crosswalks, missing phase links, cross-country links and unresolved decisions that assert provider links.

Browser checks cover desktop, tablet and phone: every stage population, independent stage/review filtering, full filtered CSV exports, provider-alias search, phase-overview navigation, country shortcuts and search reset, plus existing map, drawer and pilot interactions. The hero video and scroll animation are preserved.
