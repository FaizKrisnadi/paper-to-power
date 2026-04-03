import type { RegistryMapProject } from '../types/domain'

function formatCapacity(value: number | null) {
  if (typeof value !== 'number') {
    return 'n/a'
  }
  return value.toLocaleString()
}

function formatObserved(project: RegistryMapProject) {
  if (typeof project.observedCapacityMw === 'number') {
    return project.observedCapacityMw.toLocaleString()
  }
  if (typeof project.observedAssetCount === 'number' && project.observedAssetCount > 0) {
    return `${project.observedAssetCount} points`
  }
  return 'n/a'
}

interface EvidenceTableProps {
  projects: readonly RegistryMapProject[]
  selectedProjectId: string
  onSelectProject: (projectId: string) => void
}

export function EvidenceTable({
  projects,
  selectedProjectId,
  onSelectProject,
}: EvidenceTableProps) {
  return (
    <section className="workspace-panel evidence-panel">
      <div className="panel-header">
        <div>
          <span className="panel-eyebrow">Evidence Table</span>
          <h2>Read the live audit row by row.</h2>
        </div>
        <p className="panel-copy">
          This is the dense review surface: portfolio label, claim size, observed signal, direct
          grid support, and timing in one table.
        </p>
      </div>

      <div className="evidence-table-wrap">
        <table className="evidence-table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Country</th>
              <th>Tech</th>
              <th>Claimed MW</th>
              <th>Observed MW</th>
              <th>Label</th>
              <th>Grid</th>
              <th>Grid reach</th>
              <th>First seen</th>
              <th>Match</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((row) => (
              <tr
                key={row.projectId}
                className={row.projectId === selectedProjectId ? 'evidence-table__row--active' : ''}
                onClick={() => onSelectProject(row.projectId)}
              >
                <td>{row.projectName}</td>
                <td>{row.countryCode}</td>
                <td>{row.technology}</td>
                <td>{formatCapacity(row.claimedCapacityMw)}</td>
                <td>{formatObserved(row)}</td>
                <td>
                  <span className={`status-chip status-chip--${row.paperToPowerLabel}`}>
                    {row.paperToPowerLabel.replaceAll('_', ' ')}
                  </span>
                </td>
                <td>{row.gridEvidenceClass ? row.gridEvidenceClass.replaceAll('_', ' ') : 'n/a'}</td>
                <td>
                  {typeof row.nearestSiteSideGridDistanceKm === 'number'
                    ? `${row.nearestSiteSideGridDistanceKm.toFixed(2)} km`
                    : 'n/a'}
                </td>
                <td>{row.observedFirstSeenQuarter ?? 'not seen'}</td>
                <td>
                  {typeof row.matchConfidence === 'number'
                    ? `${Math.round(row.matchConfidence * 100)}%`
                    : 'n/a'}
                </td>
              </tr>
            ))}
            {projects.length === 0 ? (
              <tr>
                <td colSpan={10} className="evidence-table__empty">
                  No projects match the current filters.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  )
}
