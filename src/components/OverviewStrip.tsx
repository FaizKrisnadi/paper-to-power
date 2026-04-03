import { evidenceRows, registryMapProjects } from '../data/generated'

function countByLabel(label: string) {
  return evidenceRows.filter((row) => row.label === label).length
}

export function OverviewStrip() {
  const matchedCount = evidenceRows.filter((row) => row.label !== 'claimed_not_observed').length
  const smallerCount = countByLabel('observed_smaller_than_claimed')
  const notObservedCount = countByLabel('claimed_not_observed')
  const onScheduleCount = countByLabel('observed_on_schedule')

  return (
    <section className="overview-strip section-shell">
      <div className="section-heading">
        <span className="eyebrow">Overview</span>
        <h2>Start with the portfolio state, not abstract framing.</h2>
        <p>
          These are the core counts that matter right now: how many reviewed
          projects exist, how many match observed assets, and where the largest
          divergence sits.
        </p>
      </div>

      <div className="overview-grid">
        <article className="overview-card overview-card--primary">
          <span className="overview-card__label">Reviewed registry</span>
          <strong>{registryMapProjects.length}</strong>
          <p>Promotion-ready georeferenced projects currently in the active map layer.</p>
        </article>
        <article className="overview-card">
          <span className="overview-card__label">Matched</span>
          <strong>{matchedCount}</strong>
          <p>Projects with at least one first-pass observed asset match.</p>
        </article>
        <article className="overview-card">
          <span className="overview-card__label">On schedule</span>
          <strong>{onScheduleCount}</strong>
          <p>Projects whose observed timing broadly aligns with the claimed timeline.</p>
        </article>
        <article className="overview-card">
          <span className="overview-card__label">Smaller than claimed</span>
          <strong>{smallerCount}</strong>
          <p>Observed build-out exists, but the proxy footprint is materially below the claim.</p>
        </article>
        <article className="overview-card overview-card--warning">
          <span className="overview-card__label">Not observed</span>
          <strong>{notObservedCount}</strong>
          <p>Reviewed projects that still have no observed match in the current ingest.</p>
        </article>
      </div>
    </section>
  )
}
