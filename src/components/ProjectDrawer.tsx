import React from 'react';
import type { RegistryMapProject } from '../types/domain';
import { StatusBadge } from './shared/StatusBadge';
import { Accordion } from './shared/Accordion';
import { StatCard } from './shared/StatCard';

interface ProjectDrawerProps {
  project: RegistryMapProject | null;
  onClose: () => void;
}

export function ProjectDrawer({ project, onClose }: ProjectDrawerProps) {
  if (!project) return null;

  // Formatting helpers
  const formatMW = (val: number) => `${val.toFixed(1)} MW`;
  
  const techCapitalized = project.technology.charAt(0).toUpperCase() + project.technology.slice(1);
  
  // Format grid evidence nicely
  const humanGridLabels: Record<string, string> = {
    transmission_grade_connected: "Connected to transmission grid",
    transmission_corridor_only: "Transmission corridor nearby",
    distribution_only_nearby: "Distribution grid nearby only",
    power_infrastructure_nearby_but_ambiguous: "Grid nearby, unclear connection",
    no_credible_grid_evidence: "No grid connection found"
  };
  const gridLabel = project.gridEvidenceClass ? humanGridLabels[project.gridEvidenceClass] || "Unknown coverage" : "Unknown coverage";

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: 'var(--bg-surface)',
      borderLeft: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '-4px 0 16px rgba(0,0,0,0.05)',
      overflowY: 'auto'
    }}>
      {/* Header */}
      <div style={{
        padding: '24px',
        borderBottom: '1px solid var(--border)',
        position: 'relative'
      }}>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            color: 'var(--text-tertiary)',
            fontSize: '1.25rem',
            lineHeight: 1
          }}
        >
          ✕
        </button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span style={{ fontSize: '1.25rem' }}>
            {project.countryCode === 'IDN' && '🇮🇩'}
            {project.countryCode === 'PHL' && '🇵🇭'}
            {project.countryCode === 'VNM' && '🇻🇳'}
            {project.countryCode === 'MYS' && '🇲🇾'}
            {project.countryCode === 'SGP' && '🇸🇬'}
          </span>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {project.countryCode} • {techCapitalized}
          </span>
        </div>
        
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '8px 0 16px 0', lineHeight: 1.2 }}>
          {project.projectName}
        </h2>
        
        <StatusBadge status={project.paperToPowerLabel} />
      </div>

      {/* Primary Metrics Grid */}
      <div style={{ padding: '24px', flex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <StatCard 
            label="Claimed Target" 
            value={project.claimedCapacityMw ? formatMW(project.claimedCapacityMw) : 'N/A'} 
          />
          <StatCard 
            label="Observed Build" 
            value={project.observedCapacityMw ? formatMW(project.observedCapacityMw) : '0 MW'}
            comparisonValue={project.observedCapacityMw || 0}
            comparisonTotal={project.claimedCapacityMw || 1}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '24px' }}>
          <div className="card" style={{ padding: '16px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Timeline</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600 }}>{project.claimedCod || 'Unspecified'}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>Target Completion</div>
              </div>
              <div style={{ width: '1px', height: '30px', background: 'var(--border)' }} />
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 600 }}>{project.observedFirstSeenQuarter || 'None'}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>First Observed</div>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '16px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Grid Connection</div>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
              {gridLabel}
            </div>
          </div>
        </div>

        {/* Technical Details Accordion */}
        <Accordion title="Technical Details">
          <div style={{ display: 'grid', gap: '12px', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-tertiary)' }}>Audit ID</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>{project.projectId}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-tertiary)' }}>Grid Context Score</span>
              <span>{project.gridContextScore ? project.gridContextScore.toFixed(2) : 'N/A'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-tertiary)' }}>Nearest Path (km)</span>
              <span>{project.distanceKm !== null ? `${project.distanceKm.toFixed(1)} km` : 'N/A'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-tertiary)' }}>Match Confidence</span>
              <span style={{ color: (project.matchConfidence || 0) > 0.8 ? 'var(--status-on-schedule)' : 'var(--text-primary)' }}>
                {project.matchConfidence ? `${(project.matchConfidence * 100).toFixed(0)}%` : 'N/A'}
              </span>
            </div>
          </div>
        </Accordion>
      </div>

      <div style={{ padding: '24px', borderTop: '1px solid var(--border)', background: 'var(--bg-surface-muted)' }}>
         <a 
          href={project.sourcePrimaryUrl || '#'} 
          target="_blank" 
          rel="noreferrer"
          className="btn btn-outline"
          style={{ width: '100%', justifyContent: 'center', pointerEvents: project.sourcePrimaryUrl ? 'auto' : 'none', opacity: project.sourcePrimaryUrl ? 1 : 0.5 }}
        >
          View public source filing ↗
        </a>
      </div>
    </div>
  );
}
