import type * as GeoJSON from 'geojson';
export type CountryCode = 'BRN' | 'KHM' | 'IDN' | 'LAO' | 'MYS' | 'MMR' | 'PHL' | 'SGP' | 'THA' | 'VNM' | 'TLS'
export type Technology = 'solar' | 'wind' | 'mixed' | 'hydro' | 'geothermal' | 'bioenergy' | 'pumped_storage'
export type ProjectStage = 'operating' | 'construction' | 'pre-construction' | 'announced' | 'shelved' | 'cancelled' | 'mothballed' | 'retired' | 'mixed_stage' | 'other'
export type PaperToPowerLabel = 'observed_footprint' | 'not_detected_by_cutoff' | 'coverage_unavailable' | 'method_not_applicable' | 'not_yet_due_at_cutoff' | 'review_pending'
export type GridEvidenceClass = 'not_assessed' | 'infrastructure_nearby' | 'proximity_not_found'
export type GeoJSONPointGeometry = {
  type: 'Point'
  coordinates: [number, number]
}

export type GeoJSONLineStringGeometry = {
  type: 'LineString'
  coordinates: [number, number][]
}

export type GeoJSONPolygonGeometry = {
  type: 'Polygon'
  coordinates: [number, number][][]
}

export type GeoJSONMultiPolygonGeometry = {
  type: 'MultiPolygon'
  coordinates: [number, number][][][]
}

export type GeoJSONGeometry =
  | GeoJSONPointGeometry
  | GeoJSONLineStringGeometry
  | GeoJSONPolygonGeometry
  | GeoJSONMultiPolygonGeometry


export interface CountrySummary {
 code: CountryCode
 name: string
 projectCount: number
 hasObservedCoverage: boolean
 documentaryReviewedCount: number
 approvedFootprintCount: number
 eligibleProjectCount: number
 notDetectedCount: number
 notDetectedShare: number | null
}
export interface PublicSource {
 id: string
 name: string
 scope: readonly CountryCode[]
 category: string
 url: string
 notes: string
}
export interface ReleaseMetadata {
 projectCount: number
 countryCount: number
 coverageCountryCount: number
 documentaryReviewedCount: number
 approvedFootprintCount: number
 eligibleProjectCount: number
 notDetectedCount: number
 notDetectedShare: number | null
 observationCounts: Readonly<Record<string, number>>
 observationCutoff: string
 methodVersion: string
 releaseDate: string
 duplicateAliasCount: number
 datasetVersion: string
 sourceRefreshStatus: string
 dataLicense: string
 inputHashes: Readonly<Record<string,string>>
 limitations: readonly string[]
}
export interface RegistryMapProject {
 projectStage: ProjectStage
 projectStageRaw: string | null
 projectStageSource: string
 projectStageSourceUrl: string | null
 recordScope: string
 reconciliation?: { projectId:string; outcome:string; providerUnitIds:string[]; assessedAt:string; reason:string; evidenceUrls:string[] }
 relatedProviderRecords?: { projectId:string; unitId:string; name:string; phase:string|null; capacityMw:number|null; status:string; url:string }[]
 providerDiscrepancies?: string[]
 registryOrigin?: string
 registryRelease?: string | null
 providerSnapshot?: { unitId: string; plantId: string; name: string; phase: string | null; capacityMw: number | null; status: string; startYear: string | null; technologyDetail: string; fuel: string; locationAccuracy: string; url: string; release: string }
 projectId: string
 projectName: string
 countryCode: CountryCode
 countryName: string
 technology: Technology
 phaseName: string | null
 claimedCapacityMw: number | null
 capacityBasis: string
 claimedStatus: string | null
 claimedCod: string | null
 expectedOperatingDate: string | null
 reportedOperatingDate: string | null
 locationText: string | null
 provinceStateRegion: string | null
 latitude: number
 longitude: number
 coordinateAccuracy: string
 sourcePrimaryUrl: string | null
 sourcePrimaryType: string | null
 sourceConfidence: string | null
 dataQualityFlags: string | null
 sourceAccessCheckedAt: string | null
 sourceAccessResult: string | null
 claimReviewStatus: string
 claimCheckedAt: string | null
 sourcePublishedAt: string | null
 claimSources: readonly { url: string; publishedAt: string | null; checkedAt: string; supports: string }[]
 reviewNotes: string
 conflicts: readonly string[]
 aliasProjectIds: readonly string[]
 paperToPowerLabel: PaperToPowerLabel
 observationExtent: string
 attributionReviews: readonly {siteId: string; reviewer: string; reviewedAt: string; reason: string; evidenceUrls: readonly string[]; [key: string]: unknown}[]
 observationStatus: PaperToPowerLabel
 observationReason: string
 observationSource: string
 observationCutoff: string
 methodVersion: string
 nonDetectionEligible: boolean
 eligibilityReasons: readonly string[]
 scheduleAssessment: string
 scheduleReason: string
 matchReviewStatus: string
 pendingCandidateCount: number
 rejectedCandidateCount: number
 approvedMatchCount: number
 candidateCount: number
 observedCapacityMw: number | null
 observedAreaHectares: number | null
 observedAssetCount: number | null
 observedFirstSeenQuarter: string | null
 matchConfidence: number | null
 distanceKm: number | null
 gridEvidenceClass: GridEvidenceClass | null
 gridEvidenceReason: string | null
 gridContextScore: number | null
 gridMetadataScore: number | null
 maxNearbyGridVoltageKv: number | null
 nearestSiteSideGridDistanceKm: number | null
 directConnectedSubstationCount: number | null
 directConnectedTransmissionCount: number | null
 matchedAssetSiteId: string | null
 matchedAssetSiteIds: readonly string[]
 matchedAssetGeometry: GeoJSONGeometry | null
 matchedAssetGeometries: readonly GeoJSONGeometry[]
 matchedAssetCentroidLatitude: number | null
 matchedAssetCentroidLongitude: number | null
 [key: string]: unknown
}

export interface PilotShape {
 geometry: GeoJSON.Geometry;
 kind: 'point' | 'polygon'
 x: number | null
 y: number | null
 path: string | null
}
export interface PilotStudy {
 projectId: string
 shortName: string
 eyebrow: string
 title: string
 finding: string
 takeaway: string
 limitations: string
 approvedAssetCount: number
 referenceCount: number
 reviewedAt: string
 reviewer: string
 attribution: string
 referenceLicense: string
 spatialSummary: string
 totalAreaHa: number | null
 milestones: readonly {date: string; title: string; detail: string}[]
 sourceLinks: readonly {label: string; url: string}[]
 referenceShapes: readonly (PilotShape & {id: string; label: string; url: string})[]
 assets: readonly (PilotShape & {siteId: string; label: string; firstSeenQuarter: string; firstSeenIndex: number; status: string; areaHa: number | null; reviewReason: string; spatialNote: string})[]
 [key: string]: unknown
}
