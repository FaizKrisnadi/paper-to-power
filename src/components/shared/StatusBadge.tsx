import React from 'react';
import type { PaperToPowerLabel } from '../../types/domain';

interface StatusBadgeProps {
  status: PaperToPowerLabel | 'all';
  className?: string;
  dotOnly?: boolean;
}

const statusConfig: Record<string, { label: string; colorVar: string; softColorVar: string }> = {
  observed_on_schedule: { 
    label: 'On Schedule', 
    colorVar: 'var(--status-on-schedule)',
    softColorVar: 'var(--status-on-schedule-soft)'
  },
  observed_smaller_than_claimed: { 
    label: 'Smaller Than Claimed', 
    colorVar: 'var(--status-smaller)',
    softColorVar: 'var(--status-smaller-soft)'
  },
  observed_delayed: { 
    label: 'Delayed', 
    colorVar: 'var(--status-delayed)',
    softColorVar: 'var(--status-delayed-soft)'
  },
  claimed_not_observed: { 
    label: 'Not Yet Observed', 
    colorVar: 'var(--status-not-observed)',
    softColorVar: 'var(--status-not-observed-soft)'
  },
  built_and_corridor_ready: { 
    label: 'Built & Grid Ready', 
    colorVar: 'var(--status-corridor-ready)',
    softColorVar: 'var(--status-corridor-ready-soft)'
  },
  built_but_low_deliverability: { 
    label: 'Built, Low Connectivity', 
    colorVar: 'var(--status-low-deliverability)',
    softColorVar: 'var(--status-low-deliverability-soft)'
  },
  observed_unmatched: { 
    label: 'Unmatched', 
    colorVar: 'var(--status-unmatched)',
    softColorVar: 'var(--status-unmatched-soft)'
  },
  all: {
    label: 'All Statuses',
    colorVar: 'var(--text-secondary)',
    softColorVar: 'var(--bg-surface-muted)'
  }
};

export function StatusBadge({ status, className = '', dotOnly = false }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.all;

  if (dotOnly) {
    return (
      <span 
        className={`status-dot ${className}`}
        style={{ 
          display: 'inline-block',
          width: '8px', 
          height: '8px', 
          borderRadius: '50%', 
          backgroundColor: config.colorVar 
        }}
        title={config.label}
        aria-label={config.label}
      />
    );
  }

  return (
    <span 
      className={`status-badge ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 8px',
        borderRadius: '12px',
        fontSize: '0.75rem',
        fontWeight: 600,
        color: config.colorVar,
        backgroundColor: config.softColorVar,
        whiteSpace: 'nowrap'
      }}
    >
      <span 
        style={{ 
          display: 'inline-block',
          width: '6px', 
          height: '6px', 
          borderRadius: '50%', 
          backgroundColor: config.colorVar,
          marginRight: '6px'
        }}
      />
      {config.label}
    </span>
  );
}
