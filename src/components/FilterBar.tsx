import React from 'react';
import type { CountryCode, Technology, PaperToPowerLabel } from '../types/domain';
import { COUNTRY_OPTIONS, TECHNOLOGY_LABELS } from '../lib/countries';

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
          {COUNTRY_OPTIONS.map((country) => (
            <option key={country.code} value={country.code}>
              {country.label}
            </option>
          ))}
        </select>

        {/* Technology Filter */}
        <select 
          className="filter-bar__select"
          value={filters.tech} 
          onChange={(e) => handleFilterChange('tech', e.target.value)}
        >
          <option value="all">All Technologies</option>
          <option value="solar">{TECHNOLOGY_LABELS.solar}</option>
          <option value="wind">{TECHNOLOGY_LABELS.wind}</option>
          <option value="mixed">{TECHNOLOGY_LABELS.mixed}</option>
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
