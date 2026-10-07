import type { Dispatch, SetStateAction } from 'react';
import type { ExplorerFilters } from './ExplorerSection';
import type { CountryCode, Technology, ProjectStage, PaperToPowerLabel } from '../types/domain';
import { OBSERVATION_LABELS } from '../lib/evidence';
import { COUNTRY_OPTIONS, TECHNOLOGY_LABELS } from '../lib/countries';
import { PROJECT_STAGE_LABELS } from '../lib/projectStages';
interface FilterBarProps {filters:ExplorerFilters;setFilters:Dispatch<SetStateAction<ExplorerFilters>>;resultCount:number}
export function FilterBar({filters,setFilters,resultCount}:FilterBarProps) {
 const active=filters.country!=='all'||filters.tech!=='all'||filters.stage!=='all'||filters.status!=='all'||!!filters.query;
 return <div className="filter-bar stage-filter-bar">
  <div className="filter-bar__main">
   <div className="filter-bar__controls">
    <select className="filter-bar__select" aria-label="Country" value={filters.country} onChange={e=>setFilters({...filters,country:e.target.value as CountryCode|'all'})}><option value="all">All countries</option>{COUNTRY_OPTIONS.map(c=><option key={c.code} value={c.code}>{c.label}</option>)}</select>
    <select className="filter-bar__select" aria-label="Technology" value={filters.tech} onChange={e=>setFilters({...filters,tech:e.target.value as Technology|'all'})}><option value="all">All technologies</option>{Object.entries(TECHNOLOGY_LABELS).map(([v,label])=><option key={v} value={v}>{label}</option>)}</select>
    <select className="filter-bar__select" aria-label="Project stage" value={filters.stage} onChange={e=>setFilters({...filters,stage:e.target.value as ProjectStage|'all'})}><option value="all">All project stages</option>{Object.entries(PROJECT_STAGE_LABELS).map(([v,label])=><option key={v} value={v}>{label}</option>)}</select>
    {active&&<button className="filter-bar__clear" onClick={()=>setFilters({country:'all',tech:'all',stage:'all',status:'all',query:''})}>Clear filters</button>}
   </div>
   <div className="filter-bar__count">Showing {resultCount.toLocaleString()} records</div>
  </div>
  <details className="review-filter-details"><summary>Review filters{filters.status!=='all'?' · active':''}</summary>
   <select className="filter-bar__select" aria-label="Observation status" value={filters.status} onChange={e=>setFilters({...filters,status:e.target.value as PaperToPowerLabel|'all'})}><option value="all">All observation reviews</option>{Object.entries(OBSERVATION_LABELS).map(([v,label])=><option key={v} value={v}>{label}</option>)}</select>
  </details>
 </div>;
}
