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
    <section className="hero-landing">
      <div className="hero-landing__media" aria-hidden="true">
        <video
          className="hero-landing__video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src="/background-video-clean-h264.mp4" type="video/mp4" />
        </video>
        <div className="hero-landing__tint" />
        <div className="hero-landing__glow hero-landing__glow--teal" />
        <div className="hero-landing__glow hero-landing__glow--amber" />
        <div className="hero-landing__grid" />
      </div>

      <div className="hero-landing__inner">
        <h1 className="hero-landing__title">
          Paper to Power
        </h1>

        <p className="hero-landing__lede">
          Satellite imagery shows that <strong style={{ color: 'var(--text-primary)' }}>{notObservedPct}%</strong> of the currently featured Southeast Asian utility-scale renewable projects have yet to materialize on the ground.
        </p>

        <div className="metric-strip hero-landing__metrics">
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
          style={{ fontSize: '1rem', gap: '8px' }}
        >
          Explore the evidence
          <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>↓</span>
        </button>
      </div>

      <div className="hero-landing__fade" aria-hidden="true" />
    </section>
  );
}
