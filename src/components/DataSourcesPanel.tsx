import React from 'react';
import { publicSources } from '../data/generated';

export function DataSourcesPanel() {
  return (
    <div style={{ padding: '40px 0 0', borderTop: '1px solid var(--border)', marginTop: '40px' }}>
      <div style={{ marginBottom: '24px' }}>
        <div className="section-label" style={{ marginBottom: '12px' }}>Data Sources</div>
        <p className="content-prose">
          Public sources, observed asset layers, and country-level references used throughout this project.
        </p>
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '16px'
      }}>
        {publicSources.map((source, i) => (
          <a 
            key={i} 
            href={source.url}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'block',
              padding: '18px',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255,255,255,0.88)',
              boxShadow: 'var(--shadow-sm)',
              color: 'inherit',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent)';
              e.currentTarget.style.backgroundColor = 'var(--bg-surface-tint)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.88)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ 
                fontSize: '0.72rem', 
                fontWeight: 800, 
                color: 'var(--accent)',
                textTransform: 'uppercase'
              }}>
                {source.category}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                {source.scope.join(', ')}
              </span>
            </div>
            <div style={{ fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
              {source.name} ↗
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
