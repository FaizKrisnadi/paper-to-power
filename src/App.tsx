import { useState } from 'react'

import { AuditSidebar } from './components/AuditSidebar'
import { EvidenceTable } from './components/EvidenceTable'
import { RegionalMap } from './components/RegionalMap'
import { SignalBoard } from './components/SignalBoard'
import { registryMapProjects } from './data/generated'
import type { CountryCode, GridEvidenceClass, PaperToPowerLabel, Technology } from './types/domain'

type CountryFilter = CountryCode | 'all'
type TechnologyFilter = Technology | 'all'
type LabelFilter = PaperToPowerLabel | 'all'
type GridFilter = GridEvidenceClass | 'all'

const countryOptions: Array<{ value: CountryFilter; label: string }> = [
  { value: 'all', label: 'All countries' },
  { value: 'IDN', label: 'Indonesia' },
  { value: 'MYS', label: 'Malaysia' },
  { value: 'PHL', label: 'Philippines' },
  { value: 'SGP', label: 'Singapore' },
  { value: 'VNM', label: 'Vietnam' },
]

const technologyOptions: Array<{ value: TechnologyFilter; label: string }> = [
  { value: 'all', label: 'All technologies' },
  { value: 'solar', label: 'Solar' },
  { value: 'wind', label: 'Wind' },
]

const labelOptions: Array<{ value: LabelFilter; label: string }> = [
  { value: 'all', label: 'All labels' },
  { value: 'observed_on_schedule', label: 'On schedule' },
  { value: 'observed_smaller_than_claimed', label: 'Smaller than claimed' },
  { value: 'observed_delayed', label: 'Delayed' },
  { value: 'claimed_not_observed', label: 'Not observed' },
  { value: 'built_and_corridor_ready', label: 'Corridor ready' },
  { value: 'built_but_low_deliverability', label: 'Low deliverability' },
  { value: 'observed_unmatched', label: 'Observed unmatched' },
]

const gridOptions: Array<{ value: GridFilter; label: string }> = [
  { value: 'all', label: 'All grid classes' },
  { value: 'transmission_grade_connected', label: 'Transmission-grade' },
  { value: 'power_infrastructure_nearby_but_ambiguous', label: 'Ambiguous' },
  { value: 'distribution_only_nearby', label: 'Distribution only' },
  { value: 'transmission_corridor_only', label: 'Corridor only' },
  { value: 'no_credible_grid_evidence', label: 'No credible evidence' },
]

function App() {
  const [countryFilter, setCountryFilter] = useState<CountryFilter>('all')
  const [technologyFilter, setTechnologyFilter] = useState<TechnologyFilter>('all')
  const [labelFilter, setLabelFilter] = useState<LabelFilter>('all')
  const [gridFilter, setGridFilter] = useState<GridFilter>('all')
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    registryMapProjects[0]?.projectId ?? '',
  )

  const filteredProjects = registryMapProjects.filter((project) => {
    if (countryFilter !== 'all' && project.countryCode !== countryFilter) {
      return false
    }
    if (technologyFilter !== 'all' && project.technology !== technologyFilter) {
      return false
    }
    if (labelFilter !== 'all' && project.paperToPowerLabel !== labelFilter) {
      return false
    }
    if (gridFilter !== 'all' && project.gridEvidenceClass !== gridFilter) {
      return false
    }
    return true
  })

  const activeProjectId = filteredProjects.some((project) => project.projectId === selectedProjectId)
    ? selectedProjectId
    : (filteredProjects[0]?.projectId ?? '')

  return (
    <div className="audit-app">
      <header className="audit-header">
        <div className="audit-header__brand">
          <span className="audit-header__eyebrow">Paper to Power</span>
          <h1>Analyst workspace for claimed versus observed renewable build-out.</h1>
        </div>
        <div className="audit-header__meta">
          <span>{registryMapProjects.length} reviewed sites</span>
          <a href="#map-layer" className="button button--primary">
            Jump to map
          </a>
        </div>
      </header>

      <main className="audit-workspace">
        <div className="audit-main">
          <section className="workspace-panel workspace-toolbar">
            <div className="panel-header panel-header--tight">
              <div>
                <span className="panel-eyebrow">Scope Controls</span>
                <h2>Filter the live audit surface in one place.</h2>
              </div>
              <p className="panel-copy">
                The board, map, queue, and evidence table stay on the same project scope.
              </p>
            </div>

            <div className="workspace-toolbar__controls">
              <label className="control-field">
                <span>Country</span>
                <select value={countryFilter} onChange={(event) => setCountryFilter(event.target.value as CountryFilter)}>
                  {countryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="control-field">
                <span>Technology</span>
                <select
                  value={technologyFilter}
                  onChange={(event) => setTechnologyFilter(event.target.value as TechnologyFilter)}
                >
                  {technologyOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="control-field">
                <span>Paper-to-power</span>
                <select value={labelFilter} onChange={(event) => setLabelFilter(event.target.value as LabelFilter)}>
                  {labelOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="control-field">
                <span>Grid evidence</span>
                <select value={gridFilter} onChange={(event) => setGridFilter(event.target.value as GridFilter)}>
                  {gridOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <div className="workspace-toolbar__summary">
                <strong>{filteredProjects.length}</strong>
                <span>sites in scope</span>
              </div>

              <button
                type="button"
                className="button button--secondary"
                onClick={() => {
                  setCountryFilter('all')
                  setTechnologyFilter('all')
                  setLabelFilter('all')
                  setGridFilter('all')
                }}
              >
                Reset filters
              </button>
            </div>
          </section>

          <SignalBoard projects={filteredProjects} />
          <div id="map-layer">
            <RegionalMap
              projects={filteredProjects}
              selectedProjectId={activeProjectId}
              onSelectProject={setSelectedProjectId}
            />
          </div>
          <div id="evidence-layer">
            <EvidenceTable
              projects={filteredProjects}
              selectedProjectId={activeProjectId}
              onSelectProject={setSelectedProjectId}
            />
          </div>
        </div>
        <AuditSidebar projects={filteredProjects} />
      </main>
    </div>
  )
}

export default App
