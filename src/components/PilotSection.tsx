import { useState } from 'react';
import { pilotStudies, registryMapProjects } from '../data/generated';
import type { PilotStudy } from '../types/domain';
import { capacityText } from '../lib/evidence';
import { SectionHeader } from './shared/SectionHeader';
import { PilotMap } from './PilotMap';
function quarterLabel(index:number){return `${2017+Math.floor(index/4)} Q${index%4+1}`;}
function PilotRead({study}:{study:PilotStudy}){
 const [quarter,setQuarter]=useState(29);const [showEarlier,setShowEarlier]=useState(true);const [selectedId,setSelectedId]=useState<string|null>(null);
 const project=registryMapProjects.find(p=>p.projectId===study.projectId)!;const wind=project.technology==='wind';
 const visible=study.assets.filter(a=>a.firstSeenIndex<=quarter&&(a.status==='approved'||showEarlier));const count=visible.filter(a=>a.status==='approved').length;const selected=visible.find(a=>a.siteId===selectedId);
 return <article className="pilot-read" aria-label={`${study.shortName} evidence pilot`}>
  <div className="pilot-read__narrative"><span className="eyebrow">{study.eyebrow}</span><h3>{study.title}</h3><p className="pilot-finding">{wind?'A wind farm, turbine by turbine.':'A solar farm on the water.'}</p><p>{wind?'27 mapped detections align with Sidrap’s turbine layout.':'Three mapped solar arrays overlap the commercial site.'}</p>
   <div className="pilot-metrics"><div><strong>{capacityText(project)}</strong><span>Reported capacity</span></div><div><strong>{study.approvedAssetCount}</strong><span>{wind?'Matched turbine points':'Matched solar arrays'}</span></div><div><strong>Partial</strong><span>Mapped coverage</span></div></div>
   <ol className="pilot-milestones">{study.milestones.map(m=><li key={m.date}><time>{m.date}</time><div><strong>{m.title}</strong><p>{m.detail}</p></div></li>)}</ol>
   <details className="pilot-note"><summary>About this comparison</summary><p>{study.takeaway}</p><p>{study.limitations}</p></details>
  </div>
  <div className="pilot-read__visual"><div className="pilot-map-heading"><span>{wind?'Sidrap, South Sulawesi':'Tengeh Reservoir, Singapore'}</span><span>Explore the map ↗</span></div>
   <PilotMap study={study} quarter={quarter} showEarlier={showEarlier} onSelect={setSelectedId} selectedId={selected?.siteId||null}/>
   <div className="pilot-legend"><span><i className="pilot-key pilot-key--green"/>{wind?'Detected turbine point':'Detected solar array'}</span><span><i className="pilot-key pilot-key--reference"/>{wind?'Mapped turbine position':'Mapped site boundary'}</span>{!wind&&showEarlier&&<span><i className="pilot-key pilot-key--amber"/>Earlier array · excluded</span>}</div>
   <div className="pilot-time-control"><div className="pilot-time-top"><label htmlFor={`quarter-${study.projectId}`}>First detections</label><strong>{quarterLabel(quarter)}</strong></div><input id={`quarter-${study.projectId}`} type="range" min="0" max="29" value={quarter} onChange={e=>setQuarter(Number(e.target.value))} aria-label="Observation quarter" aria-valuetext={quarterLabel(quarter)}/><div className="pilot-time-labels"><span>2017</span><p aria-live="polite">{count} of {study.approvedAssetCount} matches</p><span>2024</span></div></div>
   {!wind&&<label className="pilot-toggle"><input type="checkbox" checked={showEarlier} onChange={e=>setShowEarlier(e.target.checked)}/>Show earlier polygon</label>}
   <div className="pilot-inspector"><label htmlFor={`asset-${study.projectId}`}>Explore an asset</label><select id={`asset-${study.projectId}`} aria-label="Mapped asset" value={selected?.siteId||''} onChange={e=>setSelectedId(e.target.value||null)}><option value="">Select on the map or choose here</option>{visible.map(a=><option key={a.siteId} value={a.siteId}>{a.label} · {a.firstSeenQuarter}{a.status==='rejected'?' · Excluded':''}</option>)}</select>{selected&&<div className="pilot-selection" aria-live="polite"><strong>{selected.label} · {selected.firstSeenQuarter}</strong><p>{selected.spatialNote}</p><details><summary>Review record</summary><p>{selected.reviewReason}</p></details></div>}</div>
   <p className="pilot-map-credit">GRW detections through June 2024 · Approximate OSM references, October 2026</p>
  </div>
  <details className="pilot-source-details"><summary>Sources & review notes <span>↗</span></summary><div className="pilot-source-links">{study.sourceLinks.map(s=><a href={s.url} target="_blank" rel="noreferrer" key={s.url}>{s.label} ↗</a>)}<a href="/downloads/pilot-attribution-reviews.json" download>Review decisions ↓</a><a href="/downloads/pilot-reference-features.geojson" download>Reference geometry ↓</a></div><p>Reviewed {study.reviewedAt} · {study.reviewer}. First detection does not establish commissioning. The approximate reference geometry is not an engineering survey. © OpenStreetMap contributors, ODbL.</p></details>
 </article>;
}
export function PilotSection(){
 const [active,setActive]=useState<string>(pilotStudies[0].projectId);const study=pilotStudies.find(s=>s.projectId===active)!;
 return <section id="pilot-studies" className="pilot-section"><div className="section-container"><SectionHeader eyebrow="Closing examples" title="Inside two project records" subtitle="Tengeh and Sidrap show how sources, dates and mapped evidence fit together."/><div className="pilot-tabs" role="group" aria-label="Select an evidence pilot">{pilotStudies.map((s,i)=><button key={s.projectId} type="button" aria-pressed={active===s.projectId} onClick={()=>setActive(s.projectId)}><span className="pilot-tab-number">0{i+1}</span>{s.shortName}<span>{i===0?'Floating solar / Singapore':'Onshore wind / Indonesia'}</span></button>)}</div><PilotRead study={study} key={study.projectId}/></div></section>;
}
