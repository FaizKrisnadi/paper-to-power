import { useState, useEffect, type Dispatch, type SetStateAction } from 'react';
import type { ExplorerFilters } from './ExplorerSection';
import type { RegistryMapProject } from '../types/domain';
import { stageText, PROJECT_STAGE_COLORS, PROJECT_STAGE_LABELS } from '../lib/projectStages';
import { COUNTRY_LABELS, COUNTRY_OPTIONS, TECHNOLOGY_LABELS } from '../lib/countries';
import { capacityText, observationText, OBSERVATION_LABELS } from '../lib/evidence';
interface DataTableProps { projects: readonly RegistryMapProject[]; onRowClick:(id:string)=>void; selectedId:string|null; filters:ExplorerFilters; setFilters:Dispatch<SetStateAction<ExplorerFilters>> }
export function DataTable({projects,onRowClick,selectedId,filters,setFilters}:DataTableProps) {
 const columns: {title:string;key?:'country'|'tech'|'stage'|'status'|'claim';options?:[string,string][]}[]=[
  {title:'Project'},
  {title:'Country',key:'country',options:COUNTRY_OPTIONS.map(c=>[c.code,c.label])},
  {title:'Technology',key:'tech',options:Object.entries(TECHNOLOGY_LABELS)},
  {title:'Reported stage',key:'stage',options:Object.entries(PROJECT_STAGE_LABELS)},
  {title:'Documentary capacity'},
  {title:'Physical evidence',key:'status',options:Object.entries(OBSERVATION_LABELS)},
  {title:'Claim review',key:'claim',options:[['reviewed','Reviewed claims'],['provider','Provider records'],['pending','Review pending']]},
 ];
 const [pageSize,setPageSize]=useState(()=>window.innerWidth<600?10:50);
 useEffect(()=>{const resize=()=>setPageSize(window.innerWidth<600?10:50);window.addEventListener('resize',resize);return()=>window.removeEventListener('resize',resize)},[]);
 const [paging,setPaging]=useState({population:projects,page:0});
 const page=paging.population===projects?Math.min(paging.page,Math.max(0,Math.ceil(projects.length/pageSize)-1)):0;
 const visible=projects.slice(page*pageSize,(page+1)*pageSize);
 return <div className="data-table"><table className="evidence-table"><caption className="sr-only">Selected project claims and observation evidence. Open a project for sources and review details.</caption>
  <thead><tr>{columns.map(c=><th scope="col" key={c.title}><span>{c.title}</span>{c.key&&<select className="table-column-filter" aria-label={`Table ${c.title.toLowerCase()}`} value={filters[c.key]} onChange={e=>setFilters(current=>({...current,[c.key!]:e.target.value}))}><option value="all">All</option>{c.options?.map(([value,label])=><option key={value} value={value}>{label}</option>)}</select>}</th>)}</tr></thead>
  <tbody>{visible.map(p=><tr key={p.projectId} className={selectedId===p.projectId?'is-selected':''}>
   <td><button className="project-link" onClick={()=>onRowClick(p.projectId)} aria-expanded={selectedId===p.projectId}>{p.projectName}</button>{p.recordScope==='project_overview'&&<small className="record-scope-label">Project overview · linked phases</small>}</td>
   <td>{COUNTRY_LABELS[p.countryCode]}</td><td>{TECHNOLOGY_LABELS[p.technology]}</td>
   <td><span className="project-stage-badge" style={{color:PROJECT_STAGE_COLORS[p.projectStage]}}>{stageText(p)}</span></td><td>{capacityText(p)}</td><td>{observationText(p)}</td>
   <td>{p.claimReviewStatus==='reviewed' ? `Reviewed ${p.claimCheckedAt}` : p.registryOrigin==='gem_map' ? 'Provider record' : 'Review pending'}</td>

  </tr>)}{!projects.length && <tr><td colSpan={7}>No projects match these filters.</td></tr>}</tbody>
 </table>{projects.length>pageSize&&<nav className="table-pagination" aria-label="Project table pages"><button className="btn btn-outline" disabled={page===0} onClick={()=>setPaging({population:projects,page:page-1})}>Previous</button><span>{page*pageSize+1}–{Math.min((page+1)*pageSize,projects.length)} of {projects.length.toLocaleString()} records</span><button className="btn btn-outline" disabled={(page+1)*pageSize>=projects.length} onClick={()=>setPaging({population:projects,page:page+1})}>Next</button></nav>}</div>;
}
