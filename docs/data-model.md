# Data Model

## Core Record Types

### Project Registry Record

Represents a claimed project from public project metadata.

Fields:

- `projectId`
- `sourceDataset`
- `sourceFile`
- `sourceRowNumber`
- `projectName`
- `countryCode`
- `technology`
- `developer`
- `owner`
- `status`
- `claimedCapacityMw`
- `claimedStatus`
- `claimedCod`
- `locationText`
- `latitude`
- `longitude`
- `sourceUrls`

### Observed Asset Record

Represents an observed solar or wind site from satellite-derived data.

Fields:

- `siteId`
- `sourceDataset`
- `sourceFile`
- `sourceFeatureIndex`
- `countryCode`
- `technology`
- `observedFirstSeenQuarter`
- `observedLatestQuarter`
- `observedAreaHectares`
- `centroidLatitude`
- `centroidLongitude`
- `geometryType`
- `geometry`
- `estimatedCapacityProxyMw`
- `geometryRef`
- `precedingLandUse`

### Match Record

Represents the relationship between a claimed project and an observed site.

Fields:

- `matchId`
- `projectId`
- `siteId`
- `matchConfidence`
- `matchingSignals`
- `paperToPowerLabel`
- `distanceKm`
- `scheduleVarianceMonths`
- `capacityVarianceMw`

### Deliverability Record

Represents spatial readiness signals for a built site.

Fields:

- `siteId`
- `transmissionProximityScore`
- `substationAccessScore`
- `demandCenterAccessScore`
- `terrainPenalty`
- `islandFragmentationPenalty`
- `crossBorderCorridorRelevance`
- `deliverabilityReadinessScore`

## Frontend Summary Types

### Country Comparison Summary

- `countryCode`
- `role`
- `claimedCapacityGw`
- `observedCapacityGw`
- `gapShare`
- `medianLagMonths`
- `readinessScore`

### Case Study

- `id`
- `title`
- `countryCode`
- `summary`
- `paperToPowerLabel`
- `whyItMatters`

## Status Labels

The initial label vocabulary is intentionally small:

- `claimed_not_observed`
- `observed_on_schedule`
- `observed_delayed`
- `observed_smaller_than_claimed`
- `observed_unmatched`
- `built_but_low_deliverability`
- `built_and_corridor_ready`
