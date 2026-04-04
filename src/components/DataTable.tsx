import React from 'react';
import type { RegistryMapProject } from '../types/domain';
import { StatusBadge } from './shared/StatusBadge';

interface DataTableProps {
  projects: readonly RegistryMapProject[];
  onRowClick: (id: string) => void;
  selectedId: string | null;
}

export function DataTable({ projects, onRowClick, selectedId }: DataTableProps) {
  return (
      <div className="data-table">
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        textAlign: 'left',
        fontSize: '0.875rem',
      }}>
        <thead>
          <tr>
            <th style={{
              padding: '14px 24px',
              color: 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.8rem',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              background: 'var(--bg-surface-muted)',
              borderBottom: '2px solid var(--border)',
              position: 'sticky',
              top: 0,
              zIndex: 2,
            }}>Project Name</th>
            <th style={{
              padding: '14px 24px',
              color: 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.8rem',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              background: 'var(--bg-surface-muted)',
              borderBottom: '2px solid var(--border)',
              position: 'sticky',
              top: 0,
              zIndex: 2,
            }}>Ctry</th>
            <th style={{
              padding: '14px 24px',
              color: 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.8rem',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              background: 'var(--bg-surface-muted)',
              borderBottom: '2px solid var(--border)',
              position: 'sticky',
              top: 0,
              zIndex: 2,
            }}>Tech</th>
            <th style={{
              padding: '14px 24px',
              color: 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.8rem',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              background: 'var(--bg-surface-muted)',
              borderBottom: '2px solid var(--border)',
              position: 'sticky',
              top: 0,
              zIndex: 2,
            }}>Claimed Target</th>
            <th style={{
              padding: '14px 24px',
              color: 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.8rem',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              background: 'var(--bg-surface-muted)',
              borderBottom: '2px solid var(--border)',
              position: 'sticky',
              top: 0,
              zIndex: 2,
            }}>Observed Build</th>
            <th style={{
              padding: '14px 24px',
              color: 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.8rem',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              background: 'var(--bg-surface-muted)',
              borderBottom: '2px solid var(--border)',
              position: 'sticky',
              top: 0,
              zIndex: 2,
            }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr 
              key={project.projectId}
              onClick={() => onRowClick(project.projectId)}
              style={{
                borderBottom: '1px solid var(--border)',
                cursor: 'pointer',
                background: selectedId === project.projectId ? 'var(--status-on-schedule-soft)' : 'transparent',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => {
                if (selectedId !== project.projectId) {
                    e.currentTarget.style.background = 'var(--bg-surface-muted)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedId !== project.projectId) {
                    e.currentTarget.style.background = 'transparent';
                } else {
                    e.currentTarget.style.background = 'var(--status-on-schedule-soft)';
                }
              }}
            >
              <td style={{ padding: '14px 24px', fontWeight: 500, color: 'var(--text-primary)' }}>
                {project.projectName}
              </td>
              <td style={{ padding: '14px 24px' }}>{project.countryCode}</td>
              <td style={{ padding: '14px 24px', textTransform: 'capitalize' }}>{project.technology}</td>
              <td style={{ padding: '14px 24px' }}>
                <span style={{ fontFamily: 'var(--font-mono)'}}>{project.claimedCapacityMw ? project.claimedCapacityMw.toFixed(1) : 'N/A'}</span> MW
              </td>
              <td style={{ padding: '14px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
                    {project.observedCapacityMw ? project.observedCapacityMw.toFixed(1) : '0.0'}
                  </span>
                  
                  {/* Mini comparison bar inline */}
                  <div style={{ width: '40px', height: '4px', background: 'var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${Math.min(100, ((project.observedCapacityMw || 0) / (project.claimedCapacityMw || 1)) * 100)}%`,
                      background: 'var(--accent)'
                    }} />
                  </div>
                </div>
              </td>
              <td style={{ padding: '14px 24px' }}>
                <StatusBadge status={project.paperToPowerLabel} />
              </td>
            </tr>
          ))}
          {projects.length === 0 && (
             <tr>
               <td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                 No projects match the current filters.
               </td>
             </tr>
          )}
        </tbody>
      </table>
      </div>
  );
}
