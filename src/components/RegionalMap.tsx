import { useState } from 'react'

import { countrySummaries } from '../data/generated'
import type { CountryCode, GridEvidenceClass, PaperToPowerLabel, RegistryMapProject } from '../types/domain'

const LON_MIN = 95
const LON_MAX = 130
const LAT_MIN = -6
const LAT_MAX = 24

const countryLabelPositions: Record<CountryCode, { x: number; y: number }> = {
  IDN: { x: 30, y: 75 },
  PHL: { x: 77, y: 42 },
  SGP: { x: 49, y: 71 },
  VNM: { x: 61, y: 31 },
  MYS: { x: 44, y: 56 },
}

function projectPoint(latitude: number, longitude: number) {
  return {
    x: ((longitude - LON_MIN) / (LON_MAX - LON_MIN)) * 100,
    y: 100 - ((latitude - LAT_MIN) / (LAT_MAX - LAT_MIN)) * 100,
  }
}

function formatCapacity(value: number | null) {
  if (typeof value !== 'number') {
    return 'n/a'
  }
  return `${value.toLocaleString()} MW`
}

function formatObservedMetric(project: RegistryMapProject) {
  if (typeof project.observedCapacityMw === 'number') {
    return `${project.observedCapacityMw.toLocaleString()} MW`
  }
  if (typeof project.observedAssetCount === 'number' && project.observedAssetCount > 0) {
    return `${project.observedAssetCount} wind points`
  }
  return 'n/a'
}

function formatConfidence(value: number | null) {
  if (typeof value !== 'number') {
    return 'n/a'
  }
  return `${Math.round(value * 100)}%`
}

function formatDistance(value: number | null) {
  if (typeof value !== 'number') {
    return 'n/a'
  }
  return `${value.toFixed(value < 10 ? 2 : 1)} km`
}

function formatLabel(label: PaperToPowerLabel) {
  return label.replaceAll('_', ' ')
}

function formatGridEvidenceClass(value: GridEvidenceClass | null) {
  if (!value) {
    return 'grid evidence unavailable'
  }
  return value.replaceAll('_', ' ')
}

function markerClassName(project: RegistryMapProject, selectedId: string) {
  const techClass = project.technology === 'wind' ? 'map-marker--wind' : 'map-marker--solar'
  const labelClass = ` map-marker--${project.paperToPowerLabel}`
  const activeClass = project.projectId === selectedId ? ' map-marker--active' : ''
  return `map-marker ${techClass}${labelClass}${activeClass}`
}

interface RegionalMapProps {
  projects: readonly RegistryMapProject[]
  selectedProjectId: string
  onSelectProject: (projectId: string) => void
}

export function RegionalMap({
  projects,
  selectedProjectId,
  onSelectProject,
}: RegionalMapProps) {
  const [hoveredId, setHoveredId] = useState<string>('')
  const selectedProject =
    projects.find((project) => project.projectId === selectedProjectId) ??
    projects[0] ??
    null

  return (
    <section className="workspace-panel regional-map regional-map-panel">
      <div className="panel-header">
        <div>
          <span className="panel-eyebrow">Geospatial Surface</span>
          <h2>Map the registry against observed assets and local grid evidence.</h2>
        </div>
        <p className="panel-copy">
          Select a site to inspect claim status, observed build-out, and the current grid evidence
          class without leaving the workspace.
        </p>
      </div>

      <div className="map-shell">
        <div className="map-canvas">
          <div className="map-graticule" aria-hidden="true" />

          <svg className="map-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {[100, 105, 110, 115, 120, 125].map((longitude) => {
              const x = ((longitude - LON_MIN) / (LON_MAX - LON_MIN)) * 100
              return <line key={`lon-${longitude}`} className="map-guide" x1={x} x2={x} y1={0} y2={100} />
            })}

            {[0, 5, 10, 15, 20].map((latitude) => {
              const y = 100 - ((latitude - LAT_MIN) / (LAT_MAX - LAT_MIN)) * 100
              return <line key={`lat-${latitude}`} className="map-guide" x1={0} x2={100} y1={y} y2={y} />
            })}
          </svg>

          {countrySummaries.map((country) => (
            <div
              key={country.code}
              className={`map-country-label map-country-label--${country.role}`}
              style={{
                left: `${countryLabelPositions[country.code].x}%`,
                top: `${countryLabelPositions[country.code].y}%`,
              }}
            >
              <span>{country.shortLabel}</span>
              <strong>{country.name}</strong>
            </div>
          ))}

          {projects.map((project) => {
            const point = projectPoint(project.latitude, project.longitude)
            return (
              <button
                key={project.projectId}
                type="button"
                className={markerClassName(project, hoveredId || selectedProject?.projectId || '')}
                style={{ left: `${point.x}%`, top: `${point.y}%` }}
                onClick={() => onSelectProject(project.projectId)}
                onMouseEnter={() => setHoveredId(project.projectId)}
                onMouseLeave={() => setHoveredId('')}
                title={`${project.projectName} (${project.countryCode})`}
              >
                <span className="sr-only">{project.projectName}</span>
              </button>
            )
          })}

          {projects.length === 0 ? (
            <div className="map-empty-state">
              <strong>No sites in scope</strong>
              <p>Change the filters to bring projects back into the map.</p>
            </div>
          ) : null}

          <div className="map-legend">
            <span><i className="legend-dot legend-dot--solar" /> Solar</span>
            <span><i className="legend-dot legend-dot--wind" /> Wind</span>
            <span><i className="legend-dot legend-dot--positive" /> On schedule</span>
            <span><i className="legend-dot legend-dot--warning" /> Smaller than claimed</span>
            <span><i className="legend-dot legend-dot--missing" /> Not observed</span>
          </div>
        </div>

        <aside className="map-detail">
          {selectedProject ? (
            <>
              <div className="map-detail__topline">
                <span>{selectedProject.countryCode}</span>
                <span>{selectedProject.technology}</span>
              </div>
              <h3>{selectedProject.projectName}</h3>
              <div className="map-detail__chips">
                <span className={`status-chip status-chip--${selectedProject.paperToPowerLabel}`}>
                  {formatLabel(selectedProject.paperToPowerLabel)}
                </span>
                {selectedProject.gridEvidenceClass ? (
                  <span className="status-chip status-chip--grid">
                    {formatGridEvidenceClass(selectedProject.gridEvidenceClass)}
                  </span>
                ) : null}
              </div>
              <p className="map-detail__location">
                {selectedProject.locationText ?? 'Location unavailable'}
                {selectedProject.provinceStateRegion
                  ? `, ${selectedProject.provinceStateRegion}`
                  : ''}
              </p>
              <dl className="map-detail__stats">
                <div>
                  <dt>Claimed</dt>
                  <dd>{formatCapacity(selectedProject.claimedCapacityMw)}</dd>
                </div>
                <div>
                  <dt>Observed</dt>
                  <dd>{formatObservedMetric(selectedProject)}</dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd>{selectedProject.claimedStatus ?? 'n/a'}</dd>
                </div>
                <div>
                  <dt>COD</dt>
                  <dd>{selectedProject.claimedCod ?? 'n/a'}</dd>
                </div>
                <div>
                  <dt>First seen</dt>
                  <dd>{selectedProject.observedFirstSeenQuarter ?? 'not seen'}</dd>
                </div>
                <div>
                  <dt>Match confidence</dt>
                  <dd>{formatConfidence(selectedProject.matchConfidence)}</dd>
                </div>
                <div>
                  <dt>Distance</dt>
                  <dd>{formatDistance(selectedProject.distanceKm)}</dd>
                </div>
                <div>
                  <dt>Coords</dt>
                  <dd>{selectedProject.latitude.toFixed(4)}, {selectedProject.longitude.toFixed(4)}</dd>
                </div>
                <div>
                  <dt>Grid score</dt>
                  <dd>
                    {typeof selectedProject.gridContextScore === 'number'
                      ? selectedProject.gridContextScore.toFixed(3)
                      : 'n/a'}
                  </dd>
                </div>
                <div>
                  <dt>Grid metadata</dt>
                  <dd>
                    {typeof selectedProject.gridMetadataScore === 'number'
                      ? selectedProject.gridMetadataScore.toFixed(3)
                      : 'n/a'}
                  </dd>
                </div>
                <div>
                  <dt>Max grid kV</dt>
                  <dd>
                    {typeof selectedProject.maxNearbyGridVoltageKv === 'number'
                      ? `${selectedProject.maxNearbyGridVoltageKv.toFixed(0)} kV`
                      : 'n/a'}
                  </dd>
                </div>
                <div>
                  <dt>Grid reach</dt>
                  <dd>{formatDistance(selectedProject.nearestSiteSideGridDistanceKm)}</dd>
                </div>
                <div>
                  <dt>Direct substations</dt>
                  <dd>{selectedProject.directConnectedSubstationCount ?? 'n/a'}</dd>
                </div>
                <div>
                  <dt>Direct transmission</dt>
                  <dd>{selectedProject.directConnectedTransmissionCount ?? 'n/a'}</dd>
                </div>
              </dl>
              {selectedProject.gridEvidenceReason ? (
                <p className="map-detail__grid-note">{selectedProject.gridEvidenceReason}</p>
              ) : null}
              <p className="map-detail__note">
                {selectedProject.dataQualityFlags ?? 'No additional caveats.'}
              </p>
              {selectedProject.sourcePrimaryUrl ? (
                <a
                  className="map-detail__link"
                  href={selectedProject.sourcePrimaryUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open primary source
                </a>
              ) : null}
            </>
          ) : (
            <div className="map-detail__empty">
              <strong>No project selected</strong>
              <p>The current filters returned no map points.</p>
            </div>
          )}
        </aside>
      </div>
    </section>
  )
}
