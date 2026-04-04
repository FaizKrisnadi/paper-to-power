import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { Map as MapLibreMap } from 'maplibre-gl';
import { registryMapProjects } from '../data/generated';
import type { RegistryMapProject } from '../types/domain';
import { applyCinematicMapTheme } from '../lib/mapTheme';
import {
  StoryChapter,
  type StoryMethod,
  type StorySignal,
  type StoryStat,
} from './StoryChapter';

const STORY_PROJECT_SOURCE_ID = 'story-projects';
const STORY_PROJECT_HALO_LAYER_ID = 'story-projects-halo';
const STORY_PROJECT_CORE_LAYER_ID = 'story-projects-core';
const STORY_CONTEXT_SOURCE_ID = 'story-context';
const STORY_CONTEXT_FILL_LAYER_ID = 'story-context-fill';
const STORY_CONTEXT_OUTLINE_LAYER_ID = 'story-context-outline';
const STORY_CONTEXT_LINE_LAYER_ID = 'story-context-line';
const STORY_OBSERVED_SOURCE_ID = 'story-observed-assets';
const STORY_OBSERVED_FILL_LAYER_ID = 'story-observed-fill';
const STORY_OBSERVED_LINE_LAYER_ID = 'story-observed-line';
const STORY_OBSERVED_POINT_LAYER_ID = 'story-observed-point';

const totalProjects = registryMapProjects.length;
const claimedCapacityMw = registryMapProjects.reduce(
  (sum, project) => sum + (project.claimedCapacityMw ?? 0),
  0,
);
const observedCapacityMw = registryMapProjects.reduce(
  (sum, project) => sum + (project.observedCapacityMw ?? 0),
  0,
);
const observedShare = claimedCapacityMw > 0 ? observedCapacityMw / claimedCapacityMw : 0;
const smallerThanClaimedCount = registryMapProjects.filter(
  (project) => project.paperToPowerLabel === 'observed_smaller_than_claimed',
).length;
const onScheduleCount = registryMapProjects.filter(
  (project) => project.paperToPowerLabel === 'observed_on_schedule',
).length;
const notObservedCount = registryMapProjects.filter(
  (project) => project.paperToPowerLabel === 'claimed_not_observed',
).length;
const transmissionGradeCount = registryMapProjects.filter(
  (project) => project.gridEvidenceClass === 'transmission_grade_connected',
).length;
const ambiguousGridCount = registryMapProjects.filter(
  (project) => project.gridEvidenceClass === 'power_infrastructure_nearby_but_ambiguous',
).length;
const noGridEvidenceCount = registryMapProjects.filter(
  (project) => project.gridEvidenceClass === 'no_credible_grid_evidence',
).length;
const matchedGeometryCount = registryMapProjects.filter((project) => project.matchedAssetGeometry).length;
const distinctCountryCount = new Set(registryMapProjects.map((project) => project.countryCode)).size;
const solarProjectCount = registryMapProjects.filter((project) => project.technology === 'solar').length;
const windProjectCount = registryMapProjects.filter((project) => project.technology === 'wind').length;
const averageMatchConfidence =
  registryMapProjects
    .filter((project) => project.matchConfidence !== null)
    .reduce((sum, project, _, source) => sum + (project.matchConfidence ?? 0) / source.length, 0) || 0;
const sortedDistancesKm = registryMapProjects
  .reduce<number[]>((distances, project) => {
    if (typeof project.distanceKm === 'number') {
      distances.push(project.distanceKm);
    }
    return distances;
  }, [])
  .sort((left, right) => left - right);
const medianDistanceKm =
  sortedDistancesKm.length === 0
    ? 0
    : sortedDistancesKm[Math.floor(sortedDistancesKm.length / 2)] ?? 0;

interface StoryChapterConfig {
  id: string;
  navLabel: string;
  eyebrow: string;
  title: string;
  description: string;
  secondaryText?: string;
  size: 'narrow' | 'regular' | 'wide';
  stats?: StoryStat[];
  signalsLabel?: string;
  signals?: StorySignal[];
  methods?: StoryMethod[];
  note?: string;
  align: 'left' | 'right' | 'center';
  view: {
    center: [number, number];
    zoom: number;
    pitch: number;
    bearing: number;
  };
}

function formatCapacityGw(valueMw: number) {
  return `${(valueMw / 1000).toFixed(2)} GW`;
}

function formatPercent(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

const CHAPTERS: StoryChapterConfig[] = [
  {
    id: 'chapter-1',
    navLabel: 'Summary',
    eyebrow: 'Executive Summary',
    title: 'Announced capacity and observed build are not moving at the same pace.',
    description: `${totalProjects} featured utility-scale sites across ${distinctCountryCount} Southeast Asian markets are tracked in this project.`,
    secondaryText: 'The sequence follows each site from public project claims to observed footprints and delivery-side infrastructure.',
    size: 'wide',
    align: 'left' as const,
    view: {
      center: [116.2, 6.8] as [number, number],
      zoom: 4.2,
      pitch: 26,
      bearing: -14,
    },
  },
  {
    id: 'chapter-2',
    navLabel: 'Capacity',
    eyebrow: 'Capacity Gap',
    title: 'The current verified build is only a fraction of the announced pipeline.',
    description: `${formatCapacityGw(claimedCapacityMw)} is claimed in the promoted registry set. ${formatCapacityGw(observedCapacityMw)} is currently resolved as observed build.`,
    secondaryText: `${formatPercent(observedShare)} of claimed capacity is visible in the available evidence.`,
    size: 'regular',
    stats: [
      {
        label: 'Announced Capacity',
        value: formatCapacityGw(claimedCapacityMw),
        detail: 'Publicly stated total',
        tone: 'blue' as const,
        barValue: 1,
      },
      {
        label: 'Observed Build',
        value: formatCapacityGw(observedCapacityMw),
        detail: `${formatPercent(observedShare)} of claimed capacity`,
        tone: 'teal' as const,
        barValue: observedShare,
      },
    ],
    signalsLabel: 'Regional Frame',
    signals: [
      {
        title: `${solarProjectCount} solar sites and ${windProjectCount} wind sites`,
        detail: 'The featured project set is still dominated by solar, which shapes the observed build pattern.',
        tone: 'slate' as const,
      },
      {
        title: `${matchedGeometryCount} sites already resolve to an observed asset geometry`,
        detail: 'The map can move from registry points to inspectable polygons, lines, or point clusters on the ground.',
        tone: 'teal' as const,
      },
    ],
    align: 'left' as const,
    view: {
      center: [116.8, 7.4] as [number, number],
      zoom: 4.95,
      pitch: 32,
      bearing: -12,
    },
  },
  {
    id: 'chapter-3',
    navLabel: 'Gap',
    eyebrow: 'Delivery Pattern',
    title: 'Most projects do not vanish. They under-deliver.',
    description: `${smallerThanClaimedCount} of the ${totalProjects} promoted sites resolve to observed assets that are smaller than their public targets.`,
    secondaryText: `${onScheduleCount} sites currently read as on schedule. ${notObservedCount} still have no matched observed asset in the available evidence.`,
    size: 'regular',
    stats: [
      {
        label: 'Smaller Than Claimed',
        value: `${smallerThanClaimedCount} sites`,
        detail: 'Dominant delivery outcome',
        tone: 'amber' as const,
        barValue: smallerThanClaimedCount / totalProjects,
      },
      {
        label: 'On Schedule',
        value: `${onScheduleCount} sites`,
        detail: 'Observed close to target',
        tone: 'teal' as const,
        barValue: onScheduleCount / totalProjects,
      },
    ],
    signalsLabel: 'Observed Pattern',
    signals: [
      {
        title: `${formatPercent(averageMatchConfidence)} average match confidence`,
        detail: 'The current location matching is already strong enough to compare claims against observed build at the site level.',
        badge: 'Confidence',
        tone: 'blue' as const,
      },
      {
        title: `${medianDistanceKm.toFixed(2)} km median project-to-asset distance`,
        detail: 'Registry points and observed assets are generally close, but not interchangeable.',
        badge: 'Distance',
        tone: 'slate' as const,
      },
    ],
    align: 'left' as const,
    view: {
      center: [121.18, 14.82] as [number, number],
      zoom: 6.35,
      pitch: 40,
      bearing: -20,
    },
  },
  {
    id: 'chapter-4',
    navLabel: 'Evidence',
    eyebrow: 'Observed Ground Truth',
    title: 'Satellite-linked footprints turn claims into inspectable sites.',
    description: 'The map stops being abstract once a project ID resolves to an observed polygon, corridor, or turbine point cluster.',
    secondaryText: 'This chapter overlays the matched GRW geometry used in the site review, making the observed build visible rather than implied.',
    size: 'regular',
    methods: [
      {
        eyebrow: 'Registry',
        title: 'Reviewed project coordinates',
        detail: 'Each site begins with source-backed locality and promoted registry coordinates.',
      },
      {
        eyebrow: 'Observation',
        title: 'GRW footprint or point geometry',
        detail: 'Observed assets are pulled in as polygons for many solar sites and point clusters for wind-heavy cases.',
      },
      {
        eyebrow: 'Match',
        title: 'Distance and confidence checks',
        detail: 'Every resolved site keeps the spatial gap and confidence score that made the match defensible.',
      },
    ],
    note: 'The pale geometry layer on the map is the observed asset itself, not a decorative emphasis ring.',
    align: 'left' as const,
    view: {
      center: [109.1558, 13.0489] as [number, number],
      zoom: 9.2,
      pitch: 46,
      bearing: 18,
    },
  },
  {
    id: 'chapter-5',
    navLabel: 'Grid',
    eyebrow: 'Grid Readiness',
    title: 'Built capacity still needs credible grid-side evidence to deliver.',
    description: `${transmissionGradeCount} sites sit near transmission-grade infrastructure in the current infrastructure read. ${ambiguousGridCount} remain ambiguous, and ${noGridEvidenceCount} show no credible grid evidence in the available open-source record.`,
    secondaryText: 'That final infrastructure check matters because observed build can still stall before system-level delivery.',
    size: 'regular',
    stats: [
      {
        label: 'Transmission-Grade',
        value: `${transmissionGradeCount} sites`,
        detail: 'Strong nearby grid support',
        tone: 'teal' as const,
        barValue: transmissionGradeCount / totalProjects,
      },
      {
        label: 'Ambiguous or Weak',
        value: `${ambiguousGridCount + noGridEvidenceCount} sites`,
        detail: 'Further review still needed',
        tone: 'coral' as const,
        barValue: (ambiguousGridCount + noGridEvidenceCount) / totalProjects,
      },
    ],
    signalsLabel: 'Connection Readout',
    signals: [
      {
        title: `${ambiguousGridCount} sites with infrastructure nearby but still ambiguous`,
        detail: 'Proximity alone is not enough; site-side connection evidence still matters.',
        tone: 'amber' as const,
      },
      {
        title: `${noGridEvidenceCount} sites with no credible grid evidence`,
        detail: 'These remain the weakest delivery cases in the current project view.',
        tone: 'coral' as const,
      },
    ],
    align: 'left' as const,
    view: {
      center: [119.711472, -3.987306] as [number, number],
      zoom: 9.6,
      pitch: 52,
      bearing: 24,
    },
  },
  {
    id: 'chapter-6',
    navLabel: 'Watchlist',
    eyebrow: 'Risk Snapshot',
    title: 'The weakest sites are the ones that still lack a clear delivery path.',
    description: `${noGridEvidenceCount} sites still show no credible grid evidence, while ${ambiguousGridCount} sit in the gray zone between nearby infrastructure and actual site-side connection.`,
    secondaryText: 'These are the cases where closer reporting, stronger infrastructure records, and finer site review matter most.',
    size: 'narrow',
    signalsLabel: 'What To Inspect Next',
    signals: [
      {
        title: 'No credible grid evidence',
        detail: 'Treat these as the highest-risk delivery cases in the current project.',
        tone: 'coral' as const,
      },
      {
        title: 'Infrastructure nearby but ambiguous',
        detail: 'These need closer site-side review before they can be counted as delivery-ready.',
        tone: 'amber' as const,
      },
    ],
    align: 'left' as const,
    view: {
      center: [103.018, 21.386] as [number, number],
      zoom: 7.5,
      pitch: 42,
      bearing: 14,
    },
  },
];

function buildStoryProjectCollection() {
  return {
    type: 'FeatureCollection' as const,
    features: registryMapProjects.map((project) => ({
      type: 'Feature' as const,
      geometry: {
        type: 'Point' as const,
        coordinates: [project.longitude, project.latitude],
      },
      properties: {
        id: project.projectId,
        name: project.projectName,
        claimed: project.claimedCapacityMw ?? 40,
        status: project.paperToPowerLabel,
        grid: project.gridEvidenceClass ?? 'unknown',
        tech: project.technology,
      },
    })),
  };
}

function buildStoryObservedCollection() {
  return {
    type: 'FeatureCollection' as const,
    features: registryMapProjects
      .filter((project) => project.matchedAssetGeometry)
      .map((project) => ({
        type: 'Feature' as const,
        geometry: project.matchedAssetGeometry as unknown as GeoJSON.Geometry,
        properties: {
          chapter: 'chapter-4',
          id: project.projectId,
          tech: project.technology,
          status: project.paperToPowerLabel,
        },
      })),
  };
}

function createEllipsePolygon(
  center: [number, number],
  radiusLon: number,
  radiusLat: number,
  steps = 40,
) {
  const coordinates: [number, number][] = [];

  for (let step = 0; step <= steps; step += 1) {
    const angle = (Math.PI * 2 * step) / steps;
    coordinates.push([
      center[0] + Math.cos(angle) * radiusLon,
      center[1] + Math.sin(angle) * radiusLat,
    ]);
  }

  return coordinates;
}

function buildStoryContextCollection() {
  const byCountry = new Map<string, RegistryMapProject[]>();
  const observedProjects = registryMapProjects.filter(
    (project) => project.paperToPowerLabel !== 'claimed_not_observed',
  );

  registryMapProjects.forEach((project) => {
    const existing = byCountry.get(project.countryCode) ?? [];
    byCountry.set(project.countryCode, [...existing, project]);
  });

  const features: Array<{
    type: 'Feature';
    geometry: GeoJSON.Geometry;
    properties: Record<string, string | number>;
  }> = [];

  byCountry.forEach((projects, countryCode) => {
    const centroidLon = projects.reduce((sum, project) => sum + project.longitude, 0) / projects.length;
    const centroidLat = projects.reduce((sum, project) => sum + project.latitude, 0) / projects.length;
    const lonSpread = Math.max(...projects.map((project) => Math.abs(project.longitude - centroidLon)));
    const latSpread = Math.max(...projects.map((project) => Math.abs(project.latitude - centroidLat)));

    features.push({
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [[
          ...createEllipsePolygon(
            [centroidLon, centroidLat],
            Math.max(1.2, lonSpread * 1.3 + 0.95),
            Math.max(0.9, latSpread * 1.35 + 0.8),
          ),
        ]],
      },
      properties: {
        chapter: 'chapter-1',
        kind: 'country-envelope',
        countryCode,
      },
    });

    features.push({
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [[
          ...createEllipsePolygon(
            [centroidLon, centroidLat],
            Math.max(1.2, lonSpread * 1.3 + 0.95),
            Math.max(0.9, latSpread * 1.35 + 0.8),
          ),
        ]],
      },
      properties: {
        chapter: 'chapter-2',
        kind: 'country-envelope',
        countryCode,
      },
    });

    if (projects.length > 1) {
      const spine = [...projects].sort((left, right) => left.longitude - right.longitude || left.latitude - right.latitude);
      features.push({
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: spine.map((project) => [project.longitude, project.latitude]),
        },
        properties: {
          chapter: 'chapter-3',
          kind: 'country-spine',
          countryCode,
        },
      });
    }
  });

  observedProjects.forEach((project) => {
    const radiiByGrid = {
      transmission_grade_connected: [0.75, 0.55],
      transmission_corridor_only: [0.62, 0.46],
      distribution_only_nearby: [0.48, 0.36],
      power_infrastructure_nearby_but_ambiguous: [0.56, 0.4],
      no_credible_grid_evidence: [0.42, 0.3],
    } as const;

    const [radiusLon, radiusLat] =
      radiiByGrid[project.gridEvidenceClass ?? 'no_credible_grid_evidence'] ?? [0.42, 0.3];

    features.push({
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [[...createEllipsePolygon([project.longitude, project.latitude], radiusLon, radiusLat, 28)]],
      },
      properties: {
        chapter: 'chapter-5',
        kind: 'readiness-halo',
        grid: project.gridEvidenceClass ?? 'unknown',
      },
    });

    features.push({
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [[...createEllipsePolygon([project.longitude, project.latitude], radiusLon, radiusLat, 28)]],
      },
      properties: {
        chapter: 'chapter-6',
        kind: 'readiness-halo',
        grid: project.gridEvidenceClass ?? 'unknown',
      },
    });
  });

  return {
    type: 'FeatureCollection' as const,
    features,
  };
}

function getChapterPadding(
  _align: 'left' | 'right' | 'center',
  size: 'narrow' | 'regular' | 'wide',
) {
  if (typeof window === 'undefined' || window.innerWidth < 900) {
    return { top: 96, right: 24, bottom: 84, left: 24 };
  }

  const panelWidth = size === 'wide' ? 420 : size === 'narrow' ? 332 : 372;
  const leftRail = 232 + panelWidth + 56;
  return { top: 88, right: 72, bottom: 92, left: leftRail };
}

function applyStoryProjectTheme(map: MapLibreMap, chapterId: string) {
  if (!map.getLayer(STORY_PROJECT_HALO_LAYER_ID) || !map.getLayer(STORY_PROJECT_CORE_LAYER_ID)) {
    return;
  }

  const sharedRadius = [
    'interpolate',
    ['linear'],
    ['zoom'],
    4,
    ['interpolate', ['linear'], ['coalesce', ['get', 'claimed'], 40], 40, 2.4, 220, 8],
    10,
    ['interpolate', ['linear'], ['coalesce', ['get', 'claimed'], 40], 40, 5.2, 220, 14],
  ];

  const statusColors = [
    'match',
    ['get', 'status'],
    'observed_on_schedule',
    '#48b78d',
    'built_and_corridor_ready',
    '#67d4ff',
    'built_but_low_deliverability',
    '#9b83d1',
    'observed_smaller_than_claimed',
    '#d99844',
    'observed_delayed',
    '#d47c4d',
    'claimed_not_observed',
    '#d86a5b',
    '#8f9ba2',
  ] as const;

  const gridColors = [
    'match',
    ['get', 'grid'],
    'transmission_grade_connected',
    '#48b78d',
    'transmission_corridor_only',
    '#5d8fe8',
    'distribution_only_nearby',
    '#c3a554',
    'power_infrastructure_nearby_but_ambiguous',
    '#d78f51',
    'no_credible_grid_evidence',
    '#d86a5b',
    '#88939a',
  ] as const;

  let haloColor: string | readonly unknown[] = '#78a7ba';
  let coreColor: string | readonly unknown[] = '#507889';
  let haloOpacity = 0.3;
  let coreStroke = 'rgba(249, 245, 236, 0.9)';

  if (chapterId === 'chapter-2') {
    haloColor = '#6a9fc4';
    coreColor = '#4e7f9f';
    haloOpacity = 0.34;
    coreStroke = 'rgba(248, 244, 236, 0.94)';
  }

  if (chapterId === 'chapter-3') {
    haloColor = statusColors;
    coreColor = statusColors;
    haloOpacity = 0.42;
    coreStroke = 'rgba(248, 244, 236, 0.94)';
  }

  if (chapterId === 'chapter-4') {
    haloColor = 'rgba(84, 160, 168, 0.45)';
    coreColor = 'rgba(30, 88, 105, 0.92)';
    haloOpacity = 0.36;
    coreStroke = 'rgba(250, 246, 238, 0.96)';
  }

  if (chapterId === 'chapter-5' || chapterId === 'chapter-6') {
    haloColor = gridColors;
    coreColor = gridColors;
    haloOpacity = 0.4;
    coreStroke = 'rgba(248, 244, 236, 0.92)';
  }

  map.setPaintProperty(STORY_PROJECT_HALO_LAYER_ID, 'circle-color', haloColor as never);
  map.setPaintProperty(STORY_PROJECT_HALO_LAYER_ID, 'circle-radius', sharedRadius as never);
  map.setPaintProperty(
    STORY_PROJECT_HALO_LAYER_ID,
    'circle-blur',
    ['interpolate', ['linear'], ['zoom'], 4, 0.9, 10, 0.62] as never,
  );
  map.setPaintProperty(STORY_PROJECT_HALO_LAYER_ID, 'circle-opacity', haloOpacity as never);

  map.setPaintProperty(STORY_PROJECT_CORE_LAYER_ID, 'circle-color', coreColor as never);
  map.setPaintProperty(
    STORY_PROJECT_CORE_LAYER_ID,
    'circle-radius',
    ['interpolate', ['linear'], ['zoom'], 4, 1.8, 10, 4.8] as never,
  );
  map.setPaintProperty(STORY_PROJECT_CORE_LAYER_ID, 'circle-stroke-color', coreStroke as never);
  map.setPaintProperty(
    STORY_PROJECT_CORE_LAYER_ID,
    'circle-stroke-width',
    ['interpolate', ['linear'], ['zoom'], 4, 0.8, 10, 1.4] as never,
  );
  map.setPaintProperty(
    STORY_PROJECT_CORE_LAYER_ID,
    'circle-opacity',
    ['interpolate', ['linear'], ['zoom'], 4, 0.88, 10, 0.96] as never,
  );

  if (map.getLayer(STORY_CONTEXT_FILL_LAYER_ID) && map.getLayer(STORY_CONTEXT_OUTLINE_LAYER_ID)) {
    const fillColorByChapter = [
      'match',
      ['get', 'chapter'],
      'chapter-1',
      'rgba(79, 136, 168, 0.18)',
      'chapter-2',
      'rgba(79, 136, 168, 0.18)',
      'chapter-5',
      [
        'match',
        ['get', 'grid'],
        'transmission_grade_connected',
        'rgba(76, 164, 132, 0.15)',
        'power_infrastructure_nearby_but_ambiguous',
        'rgba(219, 166, 95, 0.15)',
        'no_credible_grid_evidence',
        'rgba(229, 110, 88, 0.14)',
        'rgba(120, 154, 168, 0.1)',
      ],
      'rgba(0,0,0,0)',
    ] as const;

    map.setFilter(STORY_CONTEXT_FILL_LAYER_ID, [
      'all',
      ['==', ['geometry-type'], 'Polygon'],
      ['==', ['get', 'chapter'], chapterId],
    ] as never);
    map.setFilter(STORY_CONTEXT_OUTLINE_LAYER_ID, [
      'all',
      ['==', ['geometry-type'], 'Polygon'],
      ['==', ['get', 'chapter'], chapterId],
    ] as never);
    map.setPaintProperty(STORY_CONTEXT_FILL_LAYER_ID, 'fill-color', fillColorByChapter as never);
    map.setPaintProperty(
      STORY_CONTEXT_FILL_LAYER_ID,
      'fill-opacity',
      chapterId === 'chapter-1' || chapterId === 'chapter-2'
        ? 0.95
        : chapterId === 'chapter-5'
          ? 1
          : 0,
    );
    map.setPaintProperty(
      STORY_CONTEXT_OUTLINE_LAYER_ID,
      'line-color',
      chapterId === 'chapter-1' ? 'rgba(72, 114, 141, 0.56)' : 'rgba(92, 114, 124, 0.48)',
    );
    map.setPaintProperty(
      STORY_CONTEXT_OUTLINE_LAYER_ID,
      'line-width',
      chapterId === 'chapter-1' ? 1.4 : 1.1,
    );
    map.setPaintProperty(
      STORY_CONTEXT_OUTLINE_LAYER_ID,
      'line-opacity',
      chapterId === 'chapter-1' || chapterId === 'chapter-2' || chapterId === 'chapter-5' ? 0.92 : 0,
    );
  }

  if (map.getLayer(STORY_CONTEXT_LINE_LAYER_ID)) {
    map.setFilter(STORY_CONTEXT_LINE_LAYER_ID, [
      'all',
      ['==', ['geometry-type'], 'LineString'],
      ['==', ['get', 'chapter'], chapterId],
    ] as never);
    map.setPaintProperty(STORY_CONTEXT_LINE_LAYER_ID, 'line-color', 'rgba(63, 126, 160, 0.78)' as never);
    map.setPaintProperty(
      STORY_CONTEXT_LINE_LAYER_ID,
      'line-width',
      ['interpolate', ['linear'], ['zoom'], 4, 1.1, 8, 3.4] as never,
    );
    map.setPaintProperty(STORY_CONTEXT_LINE_LAYER_ID, 'line-opacity', chapterId === 'chapter-3' ? 0.82 : 0);
  }

  if (
    map.getLayer(STORY_OBSERVED_FILL_LAYER_ID) &&
    map.getLayer(STORY_OBSERVED_LINE_LAYER_ID) &&
    map.getLayer(STORY_OBSERVED_POINT_LAYER_ID)
  ) {
    const observedFill = [
      'match',
      ['get', 'tech'],
      'solar',
      'rgba(220, 177, 94, 0.2)',
      'wind',
      'rgba(91, 164, 190, 0.16)',
      'rgba(116, 148, 154, 0.12)',
    ] as const;

    const observedLine = [
      'match',
      ['get', 'tech'],
      'solar',
      'rgba(179, 132, 49, 0.92)',
      'wind',
      'rgba(60, 126, 151, 0.96)',
      'rgba(87, 110, 116, 0.8)',
    ] as const;

    const observedPoint = [
      'match',
      ['get', 'tech'],
      'solar',
      'rgba(213, 162, 79, 0.94)',
      'wind',
      'rgba(68, 142, 170, 0.94)',
      'rgba(87, 110, 116, 0.88)',
    ] as const;

    const showObserved = chapterId === 'chapter-4';
    map.setPaintProperty(STORY_OBSERVED_FILL_LAYER_ID, 'fill-color', observedFill as never);
    map.setPaintProperty(STORY_OBSERVED_FILL_LAYER_ID, 'fill-opacity', showObserved ? 1 : 0);
    map.setPaintProperty(STORY_OBSERVED_LINE_LAYER_ID, 'line-color', observedLine as never);
    map.setPaintProperty(STORY_OBSERVED_LINE_LAYER_ID, 'line-opacity', showObserved ? 0.95 : 0);
    map.setPaintProperty(STORY_OBSERVED_LINE_LAYER_ID, 'line-width', ['interpolate', ['linear'], ['zoom'], 5, 1.1, 11, 2.5] as never);
    map.setPaintProperty(STORY_OBSERVED_POINT_LAYER_ID, 'circle-color', observedPoint as never);
    map.setPaintProperty(STORY_OBSERVED_POINT_LAYER_ID, 'circle-opacity', showObserved ? 0.92 : 0);
  }
}

export function StorySection() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const [activeChapterId, setActiveChapterId] = useState<string>(CHAPTERS[0].id);
  const activeChapterIndex = useMemo(
    () => Math.max(0, CHAPTERS.findIndex((chapter) => chapter.id === activeChapterId)),
    [activeChapterId],
  );

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) {
      return;
    }

    let cancelled = false;
    let map: MapLibreMap | null = null;

    const initMap = async () => {
      const { default: maplibregl } = await import('maplibre-gl');
      if (cancelled || !mapContainerRef.current || mapRef.current) {
        return;
      }

      map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: 'https://tiles.openfreemap.org/styles/liberty',
        center: CHAPTERS[0].view.center,
        zoom: CHAPTERS[0].view.zoom,
        pitch: CHAPTERS[0].view.pitch,
        bearing: CHAPTERS[0].view.bearing,
        maxPitch: 78,
        scrollZoom: false,
        dragPan: false,
        dragRotate: false,
        doubleClickZoom: false,
        touchZoomRotate: false,
        interactive: false,
        attributionControl: false,
      });

      mapRef.current = map;
      map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');

      map.on('load', () => {
        if (!map) {
          return;
        }

        applyCinematicMapTheme(map, 'story');

        if (!map.getSource(STORY_PROJECT_SOURCE_ID)) {
          map.addSource(STORY_PROJECT_SOURCE_ID, {
            type: 'geojson',
            data: buildStoryProjectCollection(),
            generateId: true,
          });
        }

        if (!map.getSource(STORY_CONTEXT_SOURCE_ID)) {
          map.addSource(STORY_CONTEXT_SOURCE_ID, {
            type: 'geojson',
            data: buildStoryContextCollection(),
          });
        }

        if (!map.getSource(STORY_OBSERVED_SOURCE_ID)) {
          map.addSource(STORY_OBSERVED_SOURCE_ID, {
            type: 'geojson',
            data: buildStoryObservedCollection(),
          });
        }

        if (!map.getLayer(STORY_CONTEXT_FILL_LAYER_ID)) {
          map.addLayer({
            id: STORY_CONTEXT_FILL_LAYER_ID,
            type: 'fill',
            source: STORY_CONTEXT_SOURCE_ID,
            filter: ['==', ['geometry-type'], 'Polygon'],
            paint: {
              'fill-color': 'rgba(79, 136, 168, 0.18)',
              'fill-opacity': 0,
            },
          });
        }

        if (!map.getLayer(STORY_CONTEXT_OUTLINE_LAYER_ID)) {
          map.addLayer({
            id: STORY_CONTEXT_OUTLINE_LAYER_ID,
            type: 'line',
            source: STORY_CONTEXT_SOURCE_ID,
            filter: ['==', ['geometry-type'], 'Polygon'],
            paint: {
              'line-color': 'rgba(72, 114, 141, 0.56)',
              'line-width': 1.2,
              'line-opacity': 0,
            },
          });
        }

        if (!map.getLayer(STORY_CONTEXT_LINE_LAYER_ID)) {
          map.addLayer({
            id: STORY_CONTEXT_LINE_LAYER_ID,
            type: 'line',
            source: STORY_CONTEXT_SOURCE_ID,
            filter: ['==', ['geometry-type'], 'LineString'],
            paint: {
              'line-color': 'rgba(63, 126, 160, 0.76)',
              'line-width': 2,
              'line-opacity': 0,
            },
          });
        }

        if (!map.getLayer(STORY_OBSERVED_FILL_LAYER_ID)) {
          map.addLayer({
            id: STORY_OBSERVED_FILL_LAYER_ID,
            type: 'fill',
            source: STORY_OBSERVED_SOURCE_ID,
            paint: {
              'fill-color': 'rgba(220, 177, 94, 0.18)',
              'fill-opacity': 0,
            },
          });
        }

        if (!map.getLayer(STORY_OBSERVED_LINE_LAYER_ID)) {
          map.addLayer({
            id: STORY_OBSERVED_LINE_LAYER_ID,
            type: 'line',
            source: STORY_OBSERVED_SOURCE_ID,
            paint: {
              'line-color': 'rgba(179, 132, 49, 0.92)',
              'line-opacity': 0,
              'line-width': 1.4,
            },
          });
        }

        if (!map.getLayer(STORY_OBSERVED_POINT_LAYER_ID)) {
          map.addLayer({
            id: STORY_OBSERVED_POINT_LAYER_ID,
            type: 'circle',
            source: STORY_OBSERVED_SOURCE_ID,
            filter: ['==', ['geometry-type'], 'Point'],
            paint: {
              'circle-color': 'rgba(68, 142, 170, 0.94)',
              'circle-opacity': 0,
              'circle-radius': ['interpolate', ['linear'], ['zoom'], 5, 3, 11, 8],
              'circle-stroke-width': ['interpolate', ['linear'], ['zoom'], 5, 0.8, 11, 1.6],
              'circle-stroke-color': 'rgba(249, 245, 236, 0.95)',
            },
          });
        }

        if (!map.getLayer(STORY_PROJECT_HALO_LAYER_ID)) {
          map.addLayer({
            id: STORY_PROJECT_HALO_LAYER_ID,
            type: 'circle',
            source: STORY_PROJECT_SOURCE_ID,
            paint: {},
          });
        }

        if (!map.getLayer(STORY_PROJECT_CORE_LAYER_ID)) {
          map.addLayer({
            id: STORY_PROJECT_CORE_LAYER_ID,
            type: 'circle',
            source: STORY_PROJECT_SOURCE_ID,
            paint: {},
          });
        }

        applyStoryProjectTheme(map, CHAPTERS[0].id);
        map.jumpTo({
          ...CHAPTERS[0].view,
          padding: getChapterPadding(CHAPTERS[0].align, CHAPTERS[0].size),
        });
      });
    };

    void initMap();

    return () => {
      cancelled = true;
      if (map) {
        map.remove();
      }
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const chapterId = entry.target.id;
          setActiveChapterId(chapterId);

          const chapter = CHAPTERS.find((item) => item.id === chapterId);
          if (!chapter || !mapRef.current) {
            return;
          }

          applyStoryProjectTheme(mapRef.current, chapterId);
          mapRef.current.flyTo({
            ...chapter.view,
            padding: getChapterPadding(chapter.align, chapter.size),
            speed: 0.56,
            curve: 1.25,
            essential: true,
          });
        });
      },
      {
        rootMargin: '-35% 0px -35% 0px',
        threshold: 0,
      },
    );

    CHAPTERS.forEach((chapter) => {
      const element = document.getElementById(chapter.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="story-section" className="story-section-shell">
      <div className="story-stage">
        <div className="story-stage__map">
          <div ref={mapContainerRef} className="story-stage__map-canvas" />
          <div className="story-stage__scrim" />
          <div className="story-stage__grid" />
        </div>

        <div className="story-stage__overlay">
          <div className="story-stage__overlay-inner">
            <aside className="story-progress" aria-hidden="true">
              <div className="story-progress__topline">
                <span className="story-progress__eyebrow">Story Guide</span>
                <span className="story-progress__count">
                  {String(activeChapterIndex + 1).padStart(2, '0')} / {String(CHAPTERS.length).padStart(2, '0')}
                </span>
              </div>
              <div className="story-progress__list">
                {CHAPTERS.map((chapter, index) => (
                  <div
                    key={chapter.id}
                    className={`story-progress__item ${activeChapterId === chapter.id ? 'is-active' : ''}`}
                  >
                    <span className="story-progress__index">{String(index + 1).padStart(2, '0')}</span>
                    <span className="story-progress__label">{chapter.navLabel}</span>
                  </div>
                ))}
              </div>
            </aside>

            <div className="story-stage__chapters">
              <div className="story-stage__chapters-inner">
                {CHAPTERS.map((chapter, index) => (
                  <StoryChapter
                    key={chapter.id}
                    id={chapter.id}
                    chapterNumber={index + 1}
                    eyebrow={chapter.eyebrow}
                    title={chapter.title}
                    description={chapter.description}
                    secondaryText={chapter.secondaryText}
                    align={chapter.align}
                    isActive={activeChapterId === chapter.id}
                    size={chapter.size}
                    stats={chapter.stats}
                    signalsLabel={chapter.signalsLabel}
                    signals={chapter.signals}
                    methods={chapter.methods}
                    note={chapter.note}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
