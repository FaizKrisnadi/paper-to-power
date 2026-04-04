import React from 'react';
import { registryMapProjects } from '../data/generated';

const totalProjects = registryMapProjects.length;
const distinctCountryCount = new Set(registryMapProjects.map((project) => project.countryCode)).size;
const notObservedShare =
  totalProjects > 0
    ? registryMapProjects.filter((project) => project.paperToPowerLabel === 'claimed_not_observed').length /
      totalProjects
    : 0;
const notObservedPct = Math.round(notObservedShare * 100);

export function HeroSection() {
  const handleExploreClick = () => {
    document.getElementById('story-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #FAFAF8 0%, #F0EFEB 30%, #E8E6E0 100%)',
    }}>
      {/* Soft geometric accents */}
      <div style={{
        position: 'absolute',
        top: '-15%',
        right: '-10%',
        width: '700px',
        height: '700px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(14, 124, 107, 0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-20%',
        left: '-8%',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(212, 136, 46, 0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Fine grid texture */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(0,0,0,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,0,0,0.025) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '900px',
        width: '90%',
        paddingTop: '120px',
        paddingBottom: '120px',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontSize: 'clamp(2.8rem, 6vw, 5.25rem)',
          fontWeight: 800,
          color: 'var(--text-primary)',
          lineHeight: 0.96,
          letterSpacing: '-0.05em',
          marginBottom: '22px',
        }}>
          Paper to Power
        </h1>

        <p style={{
          fontSize: 'clamp(1.05rem, 2vw, 1.28rem)',
          color: 'var(--text-secondary)',
          lineHeight: 1.75,
          marginBottom: '48px',
          maxWidth: '700px',
          marginInline: 'auto',
        }}>
          Satellite imagery shows that <strong style={{ color: 'var(--text-primary)' }}>{notObservedPct}%</strong> of the currently featured Southeast Asian utility-scale renewable projects have yet to materialize on the ground.
        </p>

        <div className="metric-strip" style={{ marginBottom: '52px', maxWidth: '560px', marginInline: 'auto' }}>
          {[
            { value: totalProjects.toLocaleString(), label: 'Featured Projects', color: 'var(--text-primary)' },
            { value: distinctCountryCount.toLocaleString(), label: 'Countries', color: 'var(--text-primary)' },
            { value: `${notObservedPct}%`, label: 'Not Yet Observed', color: 'var(--status-smaller)' },
          ].map((stat) => (
            <div key={stat.label} className="metric-strip__cell">
              <div className="metric-strip__value" style={{ color: stat.color }}>{stat.value}</div>
              <div className="metric-strip__label">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={handleExploreClick}
          className="btn btn-primary"
          style={{
            fontSize: '1rem',
            padding: '16px 34px',
            boxShadow: '0 10px 26px rgba(19, 32, 37, 0.14)',
            gap: '8px',
          }}
        >
          Explore the evidence
          <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>↓</span>
        </button>
      </div>

      {/* Bottom fade to content */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '120px',
        background: 'linear-gradient(to bottom, transparent, var(--bg-primary))',
        pointerEvents: 'none',
      }} />
    </div>
  );
}
