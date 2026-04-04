import React from 'react';
import { registryMapProjects } from '../data/generated';
import type { GridEvidenceClass, PaperToPowerLabel, RegistryMapProject } from '../types/domain';
import { SectionHeader } from './shared/SectionHeader';

const DEEP_DIVE_IDS = [
  'IDN-W-001',
  'PHL-S-001',
  'MYS-S-002',
  'VNM-W-001',
  'SGP-S-001',
];

function formatCapacity(value: number | null) {
  if (value === null) {
    return 'n/a';
  }

  return `${value.toFixed(value >= 100 ? 0 : 2).replace(/\.00$/, '')} MW`;
}

function formatLabel(label: PaperToPowerLabel) {
  return label.replaceAll('_', ' ');
}

function formatGridClass(gridClass: GridEvidenceClass | null) {
  if (!gridClass) {
    return 'Grid context unresolved';
  }

  return gridClass.replaceAll('_', ' ');
}

function buildObservedLine(project: RegistryMapProject) {
  if (project.paperToPowerLabel === 'claimed_not_observed') {
    return 'No matched observed asset is visible in the current evidence.';
  }

  if (project.observedCapacityMw !== null) {
    const firstSeen = project.observedFirstSeenQuarter ? ` first seen ${project.observedFirstSeenQuarter}` : '';
    return `Observed build resolves to ${formatCapacity(project.observedCapacityMw)}${firstSeen}.`;
  }

  if (project.observedAssetCount !== null) {
    const firstSeen = project.observedFirstSeenQuarter ? ` first seen ${project.observedFirstSeenQuarter}` : '';
    return `Observed evidence resolves to ${project.observedAssetCount} matched wind points${firstSeen}.`;
  }

  return 'Observed evidence is present, but the current export does not expose a usable capacity proxy.';
}

function buildInterpretation(project: RegistryMapProject) {
  if (project.paperToPowerLabel === 'observed_on_schedule') {
    return 'This is the clearest alignment case: the public claim, observed footprint, and grid context line up closely enough to support the stated story.';
  }

  if (project.paperToPowerLabel === 'claimed_not_observed') {
    return 'This is the clearest paper-only case in this project: there is still a public project identity, but no matched observed asset and no credible delivery context.';
  }

  if (project.gridEvidenceClass === 'power_infrastructure_nearby_but_ambiguous') {
    return 'This is not a simple “built versus not built” story. The project is visible, but the final delivery picture is still weaker than the nearby corridor map might suggest.';
  }

  return 'This is a classic under-delivery case: the project is visible on the ground, but the observed footprint remains materially below the public target.';
}

function getBadgeStyle(label: PaperToPowerLabel) {
  if (label === 'observed_on_schedule') {
    return {
      background: 'var(--status-on-schedule-soft)',
      color: 'var(--status-on-schedule)',
    };
  }

  if (label === 'claimed_not_observed') {
    return {
      background: 'var(--status-not-observed-soft)',
      color: 'var(--status-not-observed)',
    };
  }

  return {
    background: 'var(--status-smaller-soft)',
    color: 'var(--status-smaller)',
  };
}

function getDeepDiveProjects() {
  const allProjects = registryMapProjects as readonly RegistryMapProject[];
  return DEEP_DIVE_IDS
    .map((id) => allProjects.find((project) => project.projectId === id) as RegistryMapProject | undefined)
    .filter((project): project is RegistryMapProject => project !== undefined);
}

export function CaseStudySection() {
  const projects = getDeepDiveProjects();

  if (projects.length === 0) {
    return null;
  }

  return (
    <section className="deep-dive-section" style={{ padding: '80px 24px 96px', background: 'var(--bg-primary)' }}>
      <div className="section-container" style={{ padding: 0, maxWidth: '1120px' }}>
        <SectionHeader
          title="Deep Dives"
          subtitle="Five projects where public claims, observed build, and delivery context diverge in different ways."
          eyebrow="Project Reads"
        />

        <div className="deep-dive-list" style={{ display: 'grid', gap: '22px', marginTop: '40px' }}>
          {projects.map((project, index) => {
            const badgeStyle = getBadgeStyle(project.paperToPowerLabel);

            return (
              <article
                key={project.projectId}
                className="surface-panel deep-dive-card"
                style={{
                  padding: '28px',
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(250,248,242,0.86))',
                }}
              >
                <div
                  className="deep-dive-card__layout"
                >
                  <div className="deep-dive-card__body">
                    <div
                      className="deep-dive-card__meta"
                    >
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.74rem',
                          fontWeight: 800,
                          letterSpacing: '0.14em',
                          textTransform: 'uppercase',
                          color: 'var(--text-tertiary)',
                        }}
                      >
                        {String(index + 1).padStart(2, '0')} {project.countryCode} {project.technology}
                      </span>
                      <span
                        style={{
                          padding: '6px 10px',
                          borderRadius: '999px',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          ...badgeStyle,
                        }}
                      >
                        {formatLabel(project.paperToPowerLabel)}
                      </span>
                    </div>

                    <h3
                      className="deep-dive-card__title"
                      style={{
                        fontSize: '1.65rem',
                        lineHeight: 1.02,
                        letterSpacing: '-0.05em',
                        marginBottom: '10px',
                      }}
                    >
                      {project.projectName}
                    </h3>

                    <p
                      className="deep-dive-card__copy"
                      style={{
                        color: 'var(--text-secondary)',
                        lineHeight: 1.65,
                        marginBottom: '18px',
                        maxWidth: '62ch',
                      }}
                    >
                      {project.locationText}
                      {project.provinceStateRegion ? `, ${project.provinceStateRegion}. ` : '. '}
                      {buildInterpretation(project)}
                    </p>

                    <div
                      className="deep-dive-card__details"
                    >
                      <div>
                        <strong style={{ display: 'block', marginBottom: '4px', fontSize: '0.92rem' }}>
                          Claimed target
                        </strong>
                        <span style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                          Publicly described as {formatCapacity(project.claimedCapacityMw)}.
                        </span>
                      </div>

                      <div>
                        <strong style={{ display: 'block', marginBottom: '4px', fontSize: '0.92rem' }}>
                          Observed evidence
                        </strong>
                        <span style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                          {buildObservedLine(project)}
                        </span>
                      </div>

                      <div>
                        <strong style={{ display: 'block', marginBottom: '4px', fontSize: '0.92rem' }}>
                          Delivery context
                        </strong>
                        <span style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                          {formatGridClass(project.gridEvidenceClass)}. {project.gridEvidenceReason}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div
                    className="deep-dive-card__aside"
                  >
                    <div
                      className="deep-dive-card__kpis"
                    >
                      <div>
                        <span
                          style={{
                            display: 'block',
                            fontSize: '0.68rem',
                            fontWeight: 800,
                            letterSpacing: '0.14em',
                            textTransform: 'uppercase',
                            color: 'var(--text-tertiary)',
                            marginBottom: '6px',
                          }}
                        >
                          Claimed
                        </span>
                        <strong style={{ fontSize: '1.5rem', letterSpacing: '-0.05em' }}>
                          {formatCapacity(project.claimedCapacityMw)}
                        </strong>
                      </div>

                      <div>
                        <span
                          style={{
                            display: 'block',
                            fontSize: '0.68rem',
                            fontWeight: 800,
                            letterSpacing: '0.14em',
                            textTransform: 'uppercase',
                            color: 'var(--text-tertiary)',
                            marginBottom: '6px',
                          }}
                        >
                          Observed
                        </span>
                        <strong style={{ fontSize: '1.5rem', letterSpacing: '-0.05em' }}>
                          {project.observedCapacityMw !== null
                            ? formatCapacity(project.observedCapacityMw)
                            : project.observedAssetCount !== null
                              ? `${project.observedAssetCount} pts`
                              : 'None'}
                        </strong>
                      </div>
                    </div>

                    <div className="soft-divider" />

                    <div>
                      <span
                        style={{
                          display: 'block',
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          letterSpacing: '0.14em',
                          textTransform: 'uppercase',
                          color: 'var(--text-tertiary)',
                          marginBottom: '6px',
                        }}
                      >
                        Match confidence
                      </span>
                      <span style={{ color: 'var(--text-secondary)' }}>
                        {project.matchConfidence !== null ? `${(project.matchConfidence * 100).toFixed(1)}%` : 'No matched asset'}
                        {project.distanceKm !== null ? ` at ${project.distanceKm.toFixed(2)} km` : ''}
                      </span>
                    </div>

                    <div>
                      <span
                        style={{
                          display: 'block',
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          letterSpacing: '0.14em',
                          textTransform: 'uppercase',
                          color: 'var(--text-tertiary)',
                          marginBottom: '6px',
                        }}
                      >
                        Primary source
                      </span>
                      {project.sourcePrimaryUrl ? (
                        <a
                          href={project.sourcePrimaryUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            color: 'var(--accent)',
                            fontWeight: 700,
                            lineHeight: 1.5,
                          }}
                        >
                          {project.sourcePrimaryType ?? 'Source'}
                        </a>
                      ) : (
                        <span style={{ color: 'var(--text-secondary)' }}>No linked source</span>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
