import { caseStudies, countrySummaries, registryMapProjects } from '../data/generated'
import { formatGw, formatPct } from '../lib/format'
import type { RegistryMapProject } from '../types/domain'

function reviewQueue(projects: readonly RegistryMapProject[]) {
  return projects
    .filter(
      (project) =>
        project.gridEvidenceClass === 'power_infrastructure_nearby_but_ambiguous' ||
        project.paperToPowerLabel === 'claimed_not_observed' ||
        project.gridEvidenceClass === 'no_credible_grid_evidence',
    )
    .slice(0, 6)
}

interface AuditSidebarProps {
  projects: readonly RegistryMapProject[]
}

export function AuditSidebar({ projects }: AuditSidebarProps) {
  const queue = reviewQueue(projects.length ? projects : registryMapProjects)

  return (
    <aside className="audit-sidebar">
      <section className="workspace-panel sidebar-panel">
        <div className="panel-header panel-header--tight">
          <div>
            <span className="panel-eyebrow">Method Stack</span>
            <h2>Backend logic in operator language.</h2>
          </div>
        </div>
        <div className="method-list">
          <article className="method-list__item">
            <strong>GIS</strong>
            <p>Promoted projects are mapped as real georeferenced sites, not placeholder rows.</p>
          </article>
          <article className="method-list__item">
            <strong>Multimodal evidence</strong>
            <p>Claims are checked against public filings, developer records, and observed GRW assets.</p>
          </article>
          <article className="method-list__item">
            <strong>SAM</strong>
            <p>Spatial asset matching links claims to observed assets, then the local grid graph tests delivery context.</p>
          </article>
        </div>
      </section>

      <section className="workspace-panel sidebar-panel">
        <div className="panel-header panel-header--tight">
          <div>
            <span className="panel-eyebrow">Country Snapshot</span>
            <h2>Portfolio contrast by market.</h2>
          </div>
        </div>
        <div className="country-list">
          {countrySummaries.map((country) => (
            <article key={country.code} className="country-list__item">
              <div className="country-list__topline">
                <strong>{country.name}</strong>
                <span>{country.role === 'anchor' ? 'Anchor' : 'Source'}</span>
              </div>
              <div className="country-list__stats">
                <span>{formatGw(country.claimedCapacityGw)} claimed</span>
                <span>{formatGw(country.observedCapacityGw)} observed</span>
                <span>{formatPct(country.gapShare)} gap</span>
                <span>{country.medianLagMonths} mo lag</span>
              </div>
              <div className="country-list__meter" aria-hidden="true">
                <span style={{ width: `${country.readinessScore}%` }} />
              </div>
              <p>{country.keySignal}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="workspace-panel sidebar-panel">
        <div className="panel-header panel-header--tight">
          <div>
            <span className="panel-eyebrow">Review Queue</span>
            <h2>Sites that still need human judgment.</h2>
          </div>
        </div>
        <div className="queue-list">
          {queue.map((project) => (
            <article key={project.projectId} className="queue-list__item">
              <div className="queue-list__meta">
                <strong>{project.projectName}</strong>
                <span>{project.countryCode}</span>
              </div>
              <p>
                {project.gridEvidenceReason ??
                  project.dataQualityFlags ??
                  'Observed or locality evidence still needs manual review.'}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="workspace-panel sidebar-panel">
        <div className="panel-header panel-header--tight">
          <div>
            <span className="panel-eyebrow">Deep Cases</span>
            <h2>Manual checks worth keeping in view.</h2>
          </div>
        </div>
        <div className="case-list">
          {caseStudies.map((study) => (
            <article key={study.id} className="case-list__item">
              <div className="case-list__meta">
                <span>{study.countryCode}</span>
                <span>{study.label.replaceAll('_', ' ')}</span>
              </div>
              <strong>{study.title}</strong>
              <p>{study.whyItMatters}</p>
            </article>
          ))}
        </div>
      </section>
    </aside>
  )
}
