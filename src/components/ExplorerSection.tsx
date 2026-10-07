import React, { useState, useMemo } from 'react';
import type { RegistryMapProject, CountryCode, Technology, PaperToPowerLabel, ProjectStage } from '../types/domain';
import { SectionHeader } from './shared/SectionHeader';
import { FilterBar } from './FilterBar';
import { ExplorerMap } from './ExplorerMap';
import { ProjectDrawer } from './ProjectDrawer';
import { downloadFilteredCsv } from '../lib/evidence';
import { DataTable } from './DataTable';

export interface ExplorerFilters {
  country: CountryCode | 'all';
  tech: Technology | 'all';
  status: PaperToPowerLabel | 'all';
  stage: ProjectStage | 'all';
  query: string;
}
interface ExplorerSectionProps {
  allProjects: readonly RegistryMapProject[];
  filters: ExplorerFilters;
  setFilters: React.Dispatch<React.SetStateAction<ExplorerFilters>>;
}

export function ExplorerSection({ allProjects, filters, setFilters }: ExplorerSectionProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const query=filters.query;
  // Filter projects based on current selections
  const filteredProjects = useMemo(() => {
    return allProjects.filter((p) => {
      if (query.trim() && !`${p.projectName} ${p.countryName} ${p.phaseName??''} ${p.providerSnapshot?.name??''}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())) return false;
      if (filters.country !== 'all' && p.countryCode !== filters.country) return false;
      if (filters.tech !== 'all' && p.technology !== filters.tech) return false;
      if (filters.stage !== 'all' && p.projectStage !== filters.stage) return false;
      if (filters.status !== 'all' && p.paperToPowerLabel !== filters.status) return false;
      return true;
    });
  }, [allProjects, filters, query]);

  const activeSelectedProjectId = useMemo(() => {
    if (!selectedProjectId) return null;
    return filteredProjects.some((project) => project.projectId === selectedProjectId)
      ? selectedProjectId
      : null;
  }, [filteredProjects, selectedProjectId]);

  const selectedProject = useMemo(() => {
    if (!activeSelectedProjectId) return null;
    return filteredProjects.find((project) => project.projectId === activeSelectedProjectId) || null;
  }, [activeSelectedProjectId, filteredProjects]);

  return (
    <div id="explorer-section" className="explorer-section" style={{ padding: '80px 24px 60px', maxWidth: '1400px', margin: '0 auto' }}>

      <SectionHeader
        title="Explore the regional record"
        subtitle="Find a project by country, technology or project stage, then follow its sources and dates."
        eyebrow="Project map"

      />

      <label className="project-search">Find a project<input type="search" value={query} onChange={e=>setFilters({...filters,query:e.target.value})} placeholder="Search project or country" /></label>
      {/* Filter Bar */}
      <div style={{ marginTop: '48px' }}>
        <FilterBar
          filters={filters}
          setFilters={setFilters}
          resultCount={filteredProjects.length}
        />
      </div>

      <div className="evidence-toolbar">
        <p>Zoom into a numbered group, or search for a project.</p>
        <button className="btn btn-outline" onClick={() => downloadFilteredCsv(filteredProjects)}>Export {filteredProjects.length} records (CSV)</button>
      </div>
      <div className="explorer-stage">
        <div className="explorer-map-shell">
          <ExplorerMap
            projects={filteredProjects}
            selectedProjectId={activeSelectedProjectId}
            onProjectSelect={setSelectedProjectId}
          />
        </div>

        <div className={`explorer-drawer-shell ${selectedProject ? 'is-open' : ''}`}>
          <div className="explorer-drawer-inner">
            <ProjectDrawer
              project={selectedProject}
              onClose={() => setSelectedProjectId(null)}
              onSelectProject={id=>{setFilters({...filters,stage:'all',status:'all',tech:'all',query:''});setSelectedProjectId(id)}}
            />
          </div>
        </div>
      </div>

      <div className="explorer-table-shell">
        <DataTable
          projects={filteredProjects}
          selectedId={activeSelectedProjectId}
          onRowClick={(id) => setSelectedProjectId(id)}
        />
      </div>
    </div>
  );
}
