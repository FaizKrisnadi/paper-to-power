import type { RegistryMapProject, CountrySummary, PublicSource, ReleaseMetadata, PilotStudy } from '../types/domain'
import rawDataset from './generated.json'

const dataset = { ...rawDataset, registryMapProjects: rawDataset.registryMapProjects.map(row => ({...rawDataset.registryDefaults,...row})) } as {
 releaseMetadata: ReleaseMetadata
 registryMapProjects: RegistryMapProject[]
 countrySummaries: CountrySummary[]
 publicSources: PublicSource[]
 pilotStudies: PilotStudy[]
}

export const { releaseMetadata, registryMapProjects, countrySummaries, publicSources, pilotStudies } = dataset
