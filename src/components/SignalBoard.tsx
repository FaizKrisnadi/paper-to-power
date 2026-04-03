import type { RegistryMapProject } from '../types/domain'

function countByGridEvidenceClass(projects: readonly RegistryMapProject[], gridEvidenceClass: string) {
  return projects.filter((project) => project.gridEvidenceClass === gridEvidenceClass).length
}

function countByLabel(projects: readonly RegistryMapProject[], label: string) {
  return projects.filter((project) => project.paperToPowerLabel === label).length
}

interface SignalBoardProps {
  projects: readonly RegistryMapProject[]
}

export function SignalBoard({ projects }: SignalBoardProps) {
  const matchedCount = projects.filter((project) => project.matchConfidence !== null).length
  const transmissionConnectedCount = countByGridEvidenceClass(projects, 'transmission_grade_connected')
  const ambiguousGridCount = countByGridEvidenceClass(projects, 'power_infrastructure_nearby_but_ambiguous')
  const noGridEvidenceCount = countByGridEvidenceClass(projects, 'no_credible_grid_evidence')
  const smallerThanClaimedCount = countByLabel(projects, 'observed_smaller_than_claimed')
  const notObservedCount = countByLabel(projects, 'claimed_not_observed')

  const cells = [
    {
      label: 'Reviewed sites',
      value: projects.length,
      tone: 'default',
      note: 'Promotion-ready projects in scope',
    },
    {
      label: 'Matched assets',
      value: matchedCount,
      tone: 'default',
      note: 'First-pass observed matches',
    },
    {
      label: 'Transmission-grade',
      value: transmissionConnectedCount,
      tone: 'positive',
      note: 'Direct site-side grid support',
    },
    {
      label: 'Ambiguous grid',
      value: ambiguousGridCount,
      tone: 'warning',
      note: 'Power nearby, site-side link unclear',
    },
    {
      label: 'Smaller than claimed',
      value: smallerThanClaimedCount,
      tone: 'warning',
      note: 'Observed build-out trails claim',
    },
    {
      label: 'No grid evidence',
      value: noGridEvidenceCount + notObservedCount,
      tone: 'critical',
      note: 'Weak delivery context or no observed build-out',
    },
  ]

  return (
    <section className="workspace-panel signal-board">
      <div className="panel-header panel-header--tight">
        <div>
          <span className="panel-eyebrow">Portfolio State</span>
          <h2>Start with the audit signals that move the queue.</h2>
        </div>
        <p className="panel-copy">
          This board compresses registry coverage, observed build-out, and grid support into the
          working state you need before drilling into any single site.
        </p>
      </div>

      <div className="signal-board__grid">
        {cells.map((cell) => (
          <article key={cell.label} className={`signal-cell signal-cell--${cell.tone}`}>
            <span className="signal-cell__label">{cell.label}</span>
            <strong className="signal-cell__value">{cell.value}</strong>
            <p className="signal-cell__note">{cell.note}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
