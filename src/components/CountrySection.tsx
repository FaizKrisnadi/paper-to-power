import React, { useMemo } from 'react';
import type { RegistryMapProject, CountryCode } from '../types/domain';
import { SectionHeader } from './shared/SectionHeader';

interface CountrySectionProps {
  allProjects: readonly RegistryMapProject[];
}

interface CountryStats {
  country: CountryCode;
  claimedMW: number;
  observedMW: number;
  observedPointCount: number;
  displayBarPct: number;
  displayBarMode: 'mw' | 'points' | 'none';
  gapPct: number;
  role: 'Source' | 'Anchor' | 'Both';
  keySignal: string;
}

const COUNTRY_INFO: Record<string, { role: 'Source' | 'Anchor' | 'Both'; keySignal: string }> = {
  'IDN': { role: 'Source', keySignal: 'Significant delays in grid connectivity for constructed projects.' },
  'SGP': { role: 'Anchor', keySignal: 'High demand driving regional export ambitions, zero domestic utility scale.' },
  'MYS': { role: 'Both', keySignal: 'Strong solar buildout but facing land constraint challenges.' },
  'VNM': { role: 'Source', keySignal: 'Massive wind capacity announced, waiting on transmission upgrades.' },
  'PHL': { role: 'Source', keySignal: 'Projects often clear land but stall before panel installation.' }
};

export function CountrySection({ allProjects }: CountrySectionProps) {

  const countryStats = useMemo(() => {
    const stats: Record<string, CountryStats> = {};
    
    // Initialize
    Object.keys(COUNTRY_INFO).forEach(code => {
      stats[code] = {
        country: code as CountryCode,
        claimedMW: 0,
        observedMW: 0,
        observedPointCount: 0,
        displayBarPct: 0,
        displayBarMode: 'none',
        gapPct: 0,
        role: COUNTRY_INFO[code].role,
        keySignal: COUNTRY_INFO[code].keySignal
      };
    });

    // Aggregate
    allProjects.forEach(p => {
      const code = p.countryCode;
      if (stats[code]) {
        stats[code].claimedMW += p.claimedCapacityMw || 0;
        stats[code].observedMW += p.observedCapacityMw || 0;
        stats[code].observedPointCount += p.observedAssetCount || 0;
      }
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
  }, [allProjects]);

  return (
    <div style={{ background: 'var(--bg-surface-muted)', padding: '100px 24px' }}>
      <div className="section-container" style={{ padding: '0', maxWidth: '1280px' }}>
        <SectionHeader 
          title="Country Comparison" 
          subtitle="How the 5 markets compare in translating announced capacity into physical assets."
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
                    {stat.country}
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>{stat.country}</h3>
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
                  {stat.observedMW > 0 ? (
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
                    background: stat.displayBarMode === 'points'
                      ? 'repeating-linear-gradient(135deg, rgba(14, 118, 101, 0.95) 0 8px, rgba(14, 118, 101, 0.55) 8px 16px)'
                      : 'var(--accent)',
                    borderRadius: '4px'
                  }} />
                </div>
                {stat.observedMW === 0 && stat.observedPointCount > 0 && (
                  <div style={{ marginTop: '8px', fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
                    Bar reflects observed point evidence, since MW is not resolved in the current export.
                  </div>
                )}
              </div>

              <div style={{ marginTop: 'auto' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--status-smaller)', marginBottom: '8px' }}>
                  {stat.observedMW > 0 ? `${stat.gapPct}% Capacity Gap` : stat.observedPointCount > 0 ? 'Observed, MW unresolved' : `${stat.gapPct}% Capacity Gap`}
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
