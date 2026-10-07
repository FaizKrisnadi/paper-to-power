import type { PaperToPowerLabel, RegistryMapProject } from '../types/domain';
export const OBSERVATION_LABELS: Record<PaperToPowerLabel, string> = {
 observed_footprint: 'Reviewed footprint',
 not_detected_by_cutoff: 'Not detected by cutoff',
 coverage_unavailable: 'Coverage unavailable',
 method_not_applicable: 'Method not applicable',
 not_yet_due_at_cutoff: 'Not due at cutoff',
 review_pending: 'Review pending',
};
export function observationText(p: RegistryMapProject) {
 if (p.observedAssetCount !== null) {
  return `${p.observedAssetCount} reviewed ${p.technology === 'wind' ? 'points' : 'footprints'}${p.observedAreaHectares ? ` · ${p.observedAreaHectares.toFixed(1)} ha` : ''}${p.observationExtent === 'partial' ? ' · partial coverage' : ''}`;
 }
 return OBSERVATION_LABELS[p.observationStatus];
}
export function claimReviewCategory(p: RegistryMapProject): 'reviewed' | 'provider' | 'pending' {
 return p.claimReviewStatus === 'reviewed' ? 'reviewed' : p.registryOrigin === 'gem_map' ? 'provider' : 'pending';
}
export function capacityText(p: RegistryMapProject) {
 if (p.claimedCapacityMw === null) return 'Unspecified';
 return `${p.claimedCapacityMw.toLocaleString('en-US', { maximumFractionDigits: 3 })} ${p.capacityBasis === 'unspecified' ? 'MW (basis unresolved)' : p.capacityBasis}`;
}
export function downloadFilteredCsv(projects: readonly RegistryMapProject[]) {
 const fields: (keyof RegistryMapProject)[] = ['projectId','projectName','countryCode','technology','registryOrigin','registryRelease','providerUnitId','providerPlantId','providerSnapshot','recordScope','projectStage','projectStageRaw','projectStageSource','projectStageSourceUrl','reconciliation','relatedProviderRecords','providerDiscrepancies','phaseName','claimedCapacityMw','capacityBasis','claimedStatus','expectedOperatingDate','reportedOperatingDate','claimReviewStatus','claimCheckedAt','sourcePublishedAt','sourcePrimaryUrl','coordinateAccuracy','observationStatus','observationExtent','observedAssetCount','observedAreaHectares','observationCutoff','nonDetectionEligible','eligibilityReasons','matchReviewStatus','candidateCount','approvedMatchCount','rejectedCandidateCount','pendingCandidateCount','scheduleAssessment','gridEvidenceClass','conflicts','reviewNotes'];
 const quote = (value: unknown) => {
  let s = value == null ? '' : typeof value === 'object' ? JSON.stringify(value) : String(value);
  if (/^[=+@-]/.test(s)) s = `'${s}`;
  return `"${s.replaceAll('"','""')}"`;
 };
 const content = [fields.join(','), ...projects.map(p => fields.map(k => quote(p[k])).join(','))].join('\r\n');
 const url = URL.createObjectURL(new Blob([content], { type: 'text/csv;charset=utf-8' }));
 const a = document.createElement('a'); a.href = url; a.download = 'paper-to-power-filtered-evidence.csv'; a.click();
 window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
