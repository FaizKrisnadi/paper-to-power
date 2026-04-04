import React, { useMemo } from 'react';
import type { RegistryMapProject, CountryCode } from '../types/domain';
import { SectionHeader } from './shared/SectionHeader';
import { COUNTRY_COMPARISON_INFO, COUNTRY_FLAGS, COUNTRY_LABELS } from '../lib/countries';
import { countrySummaries } from '../data/generated';

interface CountrySectionProps {
  allProjects: readonly RegistryMapProject[];
}

interface CountryStats {
  country: CountryCode;
  projectCount: number;
  claimedMW: number;
  observedMW: number;
  observedPointCount: number;
  hasObservedCoverage: boolean;
  matchedProjectCount: number;
  displayBarPct: number;
  displayBarMode: 'mw' | 'points' | 'none';
  gapPct: number;
  role: 'Source' | 'Anchor' | 'Both';
  keySignal: string;
}

export function CountrySection({ allProjects }: CountrySectionProps) {
  const summaryMeta = useMemo(
    () =>
      Object.fromEntries(
        countrySummaries.map((summary) => [
          summary.code,
          {
            hasObservedCoverage: summary.hasObservedCoverage,
            matchedProjectCount: summary.matchedProjectCount,
          },
        ]),
      ) as Record<CountryCode, { hasObservedCoverage: boolean; matchedProjectCount: number }>,
    [],
  );

  const countryStats = useMemo(() => {
    const stats: Record<string, CountryStats> = {};

    // Aggregate
    allProjects.forEach(p => {
      const code = p.countryCode;
      if (!stats[code]) {
        const info = COUNTRY_COMPARISON_INFO[code];
        stats[code] = {
          country: code,
          projectCount: 0,
          claimedMW: 0,
          observedMW: 0,
          observedPointCount: 0,
          hasObservedCoverage: summaryMeta[code]?.hasObservedCoverage ?? false,
          matchedProjectCount: summaryMeta[code]?.matchedProjectCount ?? 0,
          displayBarPct: 0,
          displayBarMode: 'none',
          gapPct: 0,
          role: info?.role || 'Source',
          keySignal: info?.keySignal || 'Country-level interpretation is not yet written for this market.',
        };
      }
      stats[code].projectCount += 1;
      stats[code].claimedMW += p.claimedCapacityMw || 0;
      stats[code].observedMW += p.observedCapacityMw || 0;
      stats[code].observedPointCount += p.observedAssetCount || 0;
    });

    // Calculate gap
    const maxObservedPointCount = Math.max(
      1,
      ...Object.values(stats).map((s) => s.observedPointCount),
    );

    Object.values(stats).forEach(s => {
      if (s.claimedMW > 0) {
        s.gapPct = Math.round(((s.claimedMW - s.observedMW) / s.claimedMW) * 100);
      }

      if (s.observedMW > 0) {
        s.displayBarMode = 'mw';
        s.displayBarPct = Math.min(100, (s.observedMW / (s.claimedMW || 1)) * 100);
      } else if (s.observedPointCount > 0) {
        s.displayBarMode = 'points';
        s.displayBarPct = Math.min(
          100,
          Math.max(24, (s.observedPointCount / maxObservedPointCount) * 56),
        );
      }
    });

    return Object.values(stats).sort((a, b) => b.claimedMW - a.claimedMW);
  }, [allProjects, summaryMeta]);

  return (
    <div style={{ background: 'var(--bg-surface-muted)', padding: '100px 24px' }}>
      <div className="section-container" style={{ padding: '0', maxWidth: '1280px' }}>
        <SectionHeader 
          title="Country Comparison" 
          subtitle="How the featured ASEAN markets compare in translating announced capacity into physical assets."
          eyebrow="Regional Overview"
        />

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginTop: '48px'
        }}>
          {countryStats.map(stat => (
            <div
              key={stat.country}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0.88))',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '42px',
                    height: '42px',
                    borderRadius: '999px',
                    background: 'var(--bg-surface-muted)',
                    border: '1px solid var(--border)',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    fontSize: '0.82rem'
                  }}>
                    {COUNTRY_FLAGS[stat.country]}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
                      {COUNTRY_LABELS[stat.country]}
                    </h3>
                    <div style={{
                      marginTop: '4px',
                      fontSize: '0.76rem',
                      color: 'var(--text-tertiary)',
                      fontFamily: 'var(--font-mono)',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase'
                    }}>
                      {stat.country} • {stat.projectCount} projects
                    </div>
                  </div>
                </div>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  padding: '6px 10px',
                  background: 'var(--bg-surface-tint)',
                  color: 'var(--text-secondary)',
                  borderRadius: '999px'
                }}>
                  {stat.role}
                </span>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Observed / Claimed</span>
                  {!stat.hasObservedCoverage ? (
                    <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                      Pending <span style={{ color: 'var(--text-tertiary)' }}>/ {stat.claimedMW.toFixed(0)} MW</span>
                    </span>
                  ) : stat.observedMW > 0 ? (
                    <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                      {stat.observedMW.toFixed(0)} <span style={{ color: 'var(--text-tertiary)' }}>/ {stat.claimedMW.toFixed(0)} MW</span>
                    </span>
                  ) : stat.observedPointCount > 0 ? (
                    <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                      {stat.observedPointCount} <span style={{ color: 'var(--text-tertiary)' }}>pts / {stat.claimedMW.toFixed(0)} MW</span>
                    </span>
                  ) : (
                    <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                      0 <span style={{ color: 'var(--text-tertiary)' }}>/ {stat.claimedMW.toFixed(0)} MW</span>
                    </span>
                  )}
                </div>
                
                <div style={{ height: '8px', background: 'var(--bg-surface-muted)', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
                  <div style={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    height: '100%', 
                    width: `${stat.displayBarPct}%`, 
                    background: 'var(--accent)',
                    borderRadius: '4px'
                  }} />
                </div>
                {!stat.hasObservedCoverage && (
                  <div style={{ marginTop: '8px', fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
                    Observed asset coverage is not yet ingested for this market in the current backend.
                  </div>
                )}
                {stat.hasObservedCoverage && stat.observedMW === 0 && stat.observedPointCount > 0 && (
                  <div style={{ marginTop: '8px', fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
                    Bar reflects observed point evidence, since MW is not resolved in the current export.
                  </div>
                )}
                {stat.hasObservedCoverage && stat.observedMW === 0 && stat.observedPointCount === 0 && stat.matchedProjectCount === 0 && (
                  <div style={{ marginTop: '8px', fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
                    Observed coverage exists, but no project has matched a visible asset yet.
                  </div>
                )}
              </div>

              <div style={{ marginTop: 'auto' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--status-smaller)', marginBottom: '8px' }}>
                  {!stat.hasObservedCoverage
                    ? 'Observed layer pending'
                    : stat.observedMW > 0
                      ? `${stat.gapPct}% Capacity Gap`
                      : stat.observedPointCount > 0
                        ? 'Observed, MW unresolved'
                        : `${stat.gapPct}% Capacity Gap`}
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  {stat.keySignal}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
