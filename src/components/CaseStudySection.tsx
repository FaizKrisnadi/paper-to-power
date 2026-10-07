import { registryMapProjects } from '../data/generated';
import { SectionHeader } from './shared/SectionHeader';
import { StatusBadge } from './shared/StatusBadge';
import { capacityText, observationText } from '../lib/evidence';
const IDS=['PHL-W-ASEAN-003','IDN-S-ASEAN-001','LAO-W-ASEAN-001'];
export function CaseStudySection(){
 return <section style={{padding:'80px 24px',background:'var(--bg-primary)'}}><div className="section-container" style={{padding:0,maxWidth:1120}}>
  <SectionHeader title="Three more projects" eyebrow="Beyond the pilot" subtitle="Read the operating dates and coverage limits alongside each project’s reported capacity."/>
  <div className="case-evidence-grid">{IDS.map(id=>registryMapProjects.find(p=>p.projectId===id)).filter(p=>p!==undefined).map(p=><article className="surface-panel" style={{padding:28}} key={p.projectId}>
   <StatusBadge status={p.observationStatus}/><h3 style={{margin:'16px 0'}}>{p.projectName}</h3><p>{p.reviewNotes}</p>
   <dl className="evidence-dl"><div><dt>Documentary capacity</dt><dd>{capacityText(p)}</dd></div><div><dt>Physical evidence</dt><dd>{observationText(p)}</dd></div><div><dt>Expected / reported operation</dt><dd>{p.expectedOperatingDate || 'Baseline unresolved'} / {p.reportedOperatingDate || 'Not verified'}</dd></div></dl>
   <p className="evidence-note">{p.observationReason}</p>{p.sourcePrimaryUrl && <a href={p.sourcePrimaryUrl} target="_blank" rel="noreferrer">Read the project source ↗</a>}
  </article>)}</div>
 </div></section>;
}
