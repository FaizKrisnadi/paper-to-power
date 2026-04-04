import React, { useState, useMemo } from 'react';
import type { RegistryMapProject, CountryCode, Technology, PaperToPowerLabel } from '../types/domain';
import { SectionHeader } from './shared/SectionHeader';
import { FilterBar } from './FilterBar';
import { ExplorerMap } from './ExplorerMap';
import { ProjectDrawer } from './ProjectDrawer';
import { DataTable } from './DataTable';

interface ExplorerSectionProps {
  allProjects: readonly RegistryMapProject[];
}

export function ExplorerSection({ allProjects }: ExplorerSectionProps) {
  const [filters, setFilters] = useState<{
    country: CountryCode | 'all';
    tech: Technology | 'all';
    status: PaperToPowerLabel | 'all';
  }>({
    country: 'all',
    tech: 'all',
    status: 'all'
  });

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Filter projects based on current selections
  const filteredProjects = useMemo(() => {
    return allProjects.filter((p) => {
      if (filters.country !== 'all' && p.countryCode !== filters.country) return false;
      if (filters.tech !== 'all' && p.technology !== filters.tech) return false;
      if (filters.status !== 'all' && p.paperToPowerLabel !== filters.status) return false;
      return true;
    });
  }, [allProjects, filters]);

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
        title="Project Explorer" 
        subtitle="Investigate the pipeline site by site. Use the filters to drill down into specific countries, technologies, or build statuses."
        eyebrow="Interactive Data"
      />

      {/* Filter Bar */}
      <div style={{ marginTop: '48px' }}>
        <FilterBar 
          filters={filters} 
          setFilters={setFilters} 
          resultCount={filteredProjects.length} 
        />
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
