import { useEffect } from 'react';
import type { RegistryMapProject } from '../types/domain';
import { StatusBadge } from './shared/StatusBadge';
import { Accordion } from './shared/Accordion';
import { COUNTRY_LABELS, TECHNOLOGY_LABELS } from '../lib/countries';
import { stageText, PROJECT_STAGE_LABELS } from '../lib/projectStages';
import { capacityText, observationText } from '../lib/evidence';
export function ProjectDrawer({project,onClose,onSelectProject}:{project:RegistryMapProject|null;onClose:()=>void;onSelectProject?:(id:string)=>void}) {
 useEffect(()=>{if(!project)return;const handler=(e:KeyboardEvent)=>{if(e.key==='Escape')onClose()};window.addEventListener('keydown',handler);return()=>window.removeEventListener('keydown',handler)},[project,onClose]);
 if(!project)return null;
 return <aside className="project-drawer" aria-labelledby="project-detail-title">
  <div className="project-drawer__header"><button className="project-drawer__close" aria-label="Close project details" onClick={onClose}>✕</button>
   <p>{COUNTRY_LABELS[project.countryCode]} · {TECHNOLOGY_LABELS[project.technology]}</p><h2 id="project-detail-title">{project.projectName}</h2><p className="drawer-reported-stage">{stageText(project)}</p>
  </div>
  <div className="project-drawer__body">
   <dl className="evidence-dl"><div><dt>Documentary capacity</dt><dd>{capacityText(project)}</dd></div><div><dt>Reported stage</dt><dd>{stageText(project)}</dd></div><div><dt>Physical evidence</dt><dd>{observationText(project)}</dd></div></dl>
   <p className="stage-source-note">Stage source: {project.projectStageSource}.</p>
   {project.relatedProviderRecords && <section className="related-phases" aria-label="Related project phases"><h3>Explore the phases</h3><p>This research record describes the wider project. Each phase keeps its own stage and source.</p>{project.relatedProviderRecords.map(p=><button key={p.projectId} onClick={()=>onSelectProject?.(p.projectId)}><span>{p.name}{p.phase?` · ${p.phase}`:''}</span><small>{PROJECT_STAGE_LABELS[p.status as keyof typeof PROJECT_STAGE_LABELS]??p.status} ↗</small></button>)}</section>}
   {project.providerSnapshot && <Accordion title="September 2026 provider record"><dl className="evidence-dl"><div><dt>Unit / phase</dt><dd>{project.providerSnapshot.phase || project.providerSnapshot.unitId}</dd></div><div><dt>Provider status</dt><dd>{project.providerSnapshot.status}</dd></div><div><dt>Provider capacity</dt><dd>{project.providerSnapshot.capacityMw?.toLocaleString()} MW</dd></div><div><dt>Technology</dt><dd>{project.providerSnapshot.technologyDetail}</dd></div>{project.providerSnapshot.fuel && <div><dt>Fuel</dt><dd>{project.providerSnapshot.fuel}</dd></div>}</dl><p className="evidence-note">GEM public map record, retrieved 7 October 2026. Unit capacity retains the provider definition; it is not an independently checked renewable share. Checked claim values remain separate.</p><a href={project.providerSnapshot.url} target="_blank" rel="noreferrer">Open GEM project record ↗</a></Accordion>}
   <div className="card" style={{padding:16}}><h3>Evidence timeline</h3><dl className="evidence-dl">
    <div><dt>Source publication</dt><dd>{project.sourcePublishedAt || 'Date unavailable'}</dd></div>
    <div><dt>Claim checked</dt><dd>{project.claimCheckedAt || 'Documentary review pending'}</dd></div>
    <div><dt>Expected operation</dt><dd>{project.expectedOperatingDate || 'Baseline unresolved'}</dd></div>
    <div><dt>Reported operation</dt><dd>{project.reportedOperatingDate || 'Not verified'}</dd></div>
    <div><dt>GRW observation cutoff</dt><dd>{project.observationCutoff}</dd></div>
    <div><dt>Footprint first seen</dt><dd>{project.observedFirstSeenQuarter || 'No reviewed attribution'}</dd></div>
   </dl><p className="evidence-note">Schedule: cannot assess from satellite first-seen dates.</p></div>
   <Accordion title="Review details"><StatusBadge status={project.observationStatus}/><p>Research stage description: {project.claimedStatus || 'Unspecified'}.</p>{project.reconciliation&&<p>{project.reconciliation.reason}</p>}{project.providerDiscrepancies?.map(note=><p key={note}>{note}</p>)}<p>{project.observationReason}</p><p>{project.reviewNotes}</p>
    <dl className="evidence-dl"><div><dt>Location accuracy</dt><dd>{project.coordinateAccuracy}</dd></div><div><dt>Match candidates</dt><dd>{project.approvedMatchCount} approved · {project.rejectedCandidateCount} excluded · {project.pendingCandidateCount} pending</dd></div><div><dt>Grid context</dt><dd>{project.gridEvidenceClass==='infrastructure_nearby'?'Cached proximity evidence':'Not assessed'}</dd></div></dl>
    <p className="evidence-note">{project.gridEvidenceReason}</p>
    {project.conflicts.length>0 && <ul className="evidence-conflicts">{project.conflicts.map(c=><li key={c}>{c}</li>)}</ul>}
   </Accordion>
   <Accordion title="Assessment eligibility"><p>{project.nonDetectionEligible?'Completed eligible site review.':'Excluded from the non-detection denominator.'}</p><ul>{project.eligibilityReasons.map(r=><li key={r}>{r}</li>)}</ul></Accordion>
   {project.attributionReviews.length > 0 && <Accordion title="Asset attribution decisions"><p>Partial geometry: these attributions do not establish full construction, generating capacity or commissioning.</p>{project.attributionReviews.map(r => <div className="evidence-source" key={r.siteId}><strong>{r.siteId.split('::').at(-1)}</strong><p>{r.reason}</p><p>{r.reviewer} · {r.reviewedAt}</p>{r.evidenceUrls.map(url => <a key={url} href={url} target="_blank" rel="noreferrer">Attribution evidence ↗ </a>)}</div>)}</Accordion>}
   <Accordion title="Sources and provenance"><p>Project ID: {project.projectId} · Method {project.methodVersion}</p>
    <p>Source access checked: {project.sourceAccessCheckedAt || 'Unknown'} · {project.sourceAccessResult || 'Unknown'}. Access alone does not verify a claim.</p>
    {project.claimSources.map(s=><div className="evidence-source" key={s.url}><a href={s.url} target="_blank" rel="noreferrer">Reviewed source ↗</a><p>{s.supports}</p></div>)}
    {project.aliasProjectIds.length>0 && <p>Preserved duplicate aliases: {project.aliasProjectIds.join(', ')}</p>}
   </Accordion>
  </div>
  <div className="project-drawer__footer">{project.sourcePrimaryUrl && <a href={project.sourcePrimaryUrl} target="_blank" rel="noreferrer" className="btn btn-outline">Open {project.claimReviewStatus==='reviewed'?'reviewed':project.registryOrigin==='gem_map'?'provider':'research'} source ↗</a>}</div>
 </aside>;
}
