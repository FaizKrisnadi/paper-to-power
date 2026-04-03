export type CountryCode = 'IDN' | 'PHL' | 'SGP' | 'VNM' | 'MYS'

export type CountryRole = 'source' | 'anchor'

export type Technology = 'solar' | 'wind' | 'mixed'

export type PaperToPowerLabel =
  | 'claimed_not_observed'
  | 'observed_on_schedule'
  | 'observed_delayed'
  | 'observed_smaller_than_claimed'
  | 'observed_unmatched'
  | 'built_but_low_deliverability'
  | 'built_and_corridor_ready'

export type RegionalLinkKind = 'corridor' | 'comparison'

export type GridEvidenceClass =
  | 'transmission_grade_connected'
  | 'transmission_corridor_only'
  | 'distribution_only_nearby'
  | 'power_infrastructure_nearby_but_ambiguous'
  | 'no_credible_grid_evidence'

export type PublicSourceCategory =
  | 'observed-assets'
  | 'project-registry'
  | 'country-validator'
  | 'anchor-context'

export interface CountrySummary {
  code: CountryCode
  name: string
  role: CountryRole
  shortLabel: string
  description: string
  claimedCapacityGw: number
  observedCapacityGw: number
  gapShare: number
  medianLagMonths: number
  readinessScore: number
  keySignal: string
}

export interface FeatureCard {
  title: string
  eyebrow: string
  description: string
}

export interface RegionalLink {
  from: CountryCode
  to: CountryCode
  kind: RegionalLinkKind
}

export interface EvidenceRow {
  id: string
  projectName: string
  countryCode: CountryCode
  technology: Technology
  claimedCapacityMw: number
  observedCapacityMw: number
  label: PaperToPowerLabel
  firstSeenQuarter: string
  readinessScore: number
}

export interface CaseStudy {
  id: string
  countryCode: CountryCode
  title: string
  label: PaperToPowerLabel
  summary: string
  whyItMatters: string
}

export interface PublicSource {
  id: string
  name: string
  scope: CountryCode[]
  category: PublicSourceCategory
  url: string
  notes: string
}

export interface RegistryMapProject {
  projectId: string
  projectName: string
  countryCode: CountryCode
  countryName: string
  technology: 'solar' | 'wind'
  claimedCapacityMw: number | null
  claimedStatus: string | null
  claimedCod: string | null
  locationText: string | null
  provinceStateRegion: string | null
  latitude: number
  longitude: number
  sourcePrimaryUrl: string | null
  sourcePrimaryType: string | null
  sourceConfidence: string | null
  dataQualityFlags: string | null
  paperToPowerLabel: PaperToPowerLabel
  observedCapacityMw: number | null
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
}
