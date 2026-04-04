import React from 'react';
import type { CountryCode, Technology, PaperToPowerLabel } from '../types/domain';

interface FilterBarProps {
  filters: {
    country: CountryCode | 'all';
    tech: Technology | 'all';
    status: PaperToPowerLabel | 'all';
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    country: CountryCode | 'all';
    tech: Technology | 'all';
    status: PaperToPowerLabel | 'all';
  }>>;
  resultCount: number;
}

export function FilterBar({ filters, setFilters, resultCount }: FilterBarProps) {
  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleClearAll = () => {
    setFilters({
      country: 'all',
      tech: 'all',
      status: 'all'
    });
  };

  const hasActiveFilters = filters.country !== 'all' || filters.tech !== 'all' || filters.status !== 'all';

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      alignItems: 'end',
      padding: '18px 24px',
      background: 'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(247,248,245,0.88))',
      borderBottom: '1px solid var(--border)',
      gap: '16px 24px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        
        {/* Country Filter */}
        <select 
          value={filters.country} 
          onChange={(e) => handleFilterChange('country', e.target.value)}
          style={{
            padding: '10px 16px',
            borderRadius: '20px',
            border: '1px solid var(--border)',
            background: 'rgba(255,255,255,0.92)',
            fontSize: '0.875rem',
            color: 'var(--text-primary)',
            outline: 'none',
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          <option value="all">All Countries</option>
          <option value="IDN">Indonesia</option>
          <option value="VNM">Vietnam</option>
          <option value="PHL">Philippines</option>
          <option value="MYS">Malaysia</option>
          <option value="SGP">Singapore</option>
        </select>

        {/* Technology Filter */}
        <select 
          value={filters.tech} 
          onChange={(e) => handleFilterChange('tech', e.target.value)}
          style={{
            padding: '10px 16px',
            borderRadius: '20px',
            border: '1px solid var(--border)',
            background: 'rgba(255,255,255,0.92)',
            fontSize: '0.875rem',
            color: 'var(--text-primary)',
            outline: 'none',
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          <option value="all">All Technologies</option>
          <option value="solar">Solar</option>
          <option value="wind">Wind</option>
        </select>

        {/* Status Filter */}
        <select 
          value={filters.status} 
          onChange={(e) => handleFilterChange('status', e.target.value)}
          style={{
            padding: '10px 16px',
            borderRadius: '20px',
            border: '1px solid var(--border)',
            background: 'rgba(255,255,255,0.92)',
            fontSize: '0.875rem',
            color: 'var(--text-primary)',
            outline: 'none',
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          <option value="all">All Statuses</option>
          <option value="observed_on_schedule">On Schedule</option>
          <option value="observed_smaller_than_claimed">Smaller Than Claimed</option>
          <option value="observed_delayed">Delayed</option>
          <option value="claimed_not_observed">Not Yet Observed</option>
          <option value="built_and_corridor_ready">Built & Grid Ready</option>
          <option value="built_but_low_deliverability">Built, Low Connectivity</option>
          <option value="observed_unmatched">Unmatched</option>
        </select>

        {hasActiveFilters && (
          <button 
            onClick={handleClearAll}
            style={{
              fontSize: '0.875rem',
              color: 'var(--accent)',
              padding: '8px 10px',
              fontWeight: 700
            }}
          >
            Clear filters
          </button>
        )}
      </div>

      <div style={{
        fontSize: '0.875rem',
        color: 'var(--text-secondary)',
        fontWeight: 700,
        justifySelf: 'end',
        whiteSpace: 'nowrap'
      }}>
        Showing {resultCount} projects
      </div>
    </div>
  );
}
