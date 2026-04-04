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
    <div className="filter-bar">
      <div className="filter-bar__controls">
        
        {/* Country Filter */}
        <select 
          className="filter-bar__select"
          value={filters.country} 
          onChange={(e) => handleFilterChange('country', e.target.value)}
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
          className="filter-bar__select"
          value={filters.tech} 
          onChange={(e) => handleFilterChange('tech', e.target.value)}
        >
          <option value="all">All Technologies</option>
          <option value="solar">Solar</option>
          <option value="wind">Wind</option>
        </select>

        {/* Status Filter */}
        <select 
          className="filter-bar__select"
          value={filters.status} 
          onChange={(e) => handleFilterChange('status', e.target.value)}
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
            className="filter-bar__clear"
            onClick={handleClearAll}
          >
            Clear filters
          </button>
        )}
      </div>

      <div className="filter-bar__count">
        Showing {resultCount} projects
      </div>
    </div>
  );
}
