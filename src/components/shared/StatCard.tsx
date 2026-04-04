import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  comparisonValue?: number;
  comparisonTotal?: number;
  className?: string;
}

export function StatCard({ 
  label, 
  value, 
  subtitle, 
  comparisonValue, 
  comparisonTotal,
  className = '' 
}: StatCardProps) {
  return (
    <div className={`stat-card ${className}`} style={{
      padding: '20px',
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <h3 style={{
        fontSize: '0.875rem',
        color: 'var(--text-secondary)',
        fontWeight: 500,
        marginBottom: '8px',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}>
        {label}
      </h3>
      
      <div style={{
        fontSize: '2rem',
        fontWeight: 700,
        color: 'var(--text-primary)',
        lineHeight: 1.1,
        marginBottom: '8px'
      }}>
        {value}
      </div>

      {typeof comparisonValue === 'number' && typeof comparisonTotal === 'number' && (
        <div style={{
          height: '4px',
          background: 'var(--bg-surface-muted)',
          borderRadius: '2px',
          overflow: 'hidden',
          marginBottom: '8px',
          display: 'flex'
        }}>
          <div style={{
            height: '100%',
            width: `${(comparisonValue / comparisonTotal) * 100}%`,
            background: 'var(--accent)'
          }} />
        </div>
      )}

      {subtitle && (
        <p style={{
          fontSize: '0.875rem',
          color: 'var(--text-tertiary)',
          margin: 0
        }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
