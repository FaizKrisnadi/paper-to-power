import React, { useEffect, useRef } from 'react';
import type { GeoJSONSource, Map as MapLibreMap } from 'maplibre-gl';
import type { GeoJSONGeometry, RegistryMapProject } from '../types/domain';
import { applyCinematicMapTheme } from '../lib/mapTheme';

interface ExplorerMapProps {
  projects: readonly RegistryMapProject[];
  onProjectSelect: (id: string | null) => void;
  selectedProjectId: string | null;
}

const SELECTED_CONTEXT_SOURCE_ID = 'selected-project-context';
const SELECTED_CONTEXT_FILL_LAYER_ID = 'selected-project-context-fill';
const SELECTED_CONTEXT_OUTLINE_LAYER_ID = 'selected-project-context-outline';
const SELECTED_CONTEXT_ASSET_FILL_LAYER_ID = 'selected-project-context-asset-fill';
const SELECTED_CONTEXT_ASSET_OUTLINE_LAYER_ID = 'selected-project-context-asset-outline';
const SELECTED_CONTEXT_ASSET_POINT_LAYER_ID = 'selected-project-context-asset-point';
const SELECTED_CONTEXT_CROSSHAIR_LAYER_ID = 'selected-project-context-crosshair';
const SELECTED_CONTEXT_AXIS_LAYER_ID = 'selected-project-context-axis';
const SELECTED_CONTEXT_LEADER_LAYER_ID = 'selected-project-context-leader';
const SELECTED_CONTEXT_POINT_HALO_LAYER_ID = 'selected-project-context-point-halo';
const SELECTED_CONTEXT_POINT_CORE_LAYER_ID = 'selected-project-context-point-core';
const SELECTED_CONTEXT_LABEL_LAYER_ID = 'selected-project-context-label';

interface CameraSnapshot {
  center: [number, number];
  zoom: number;
  pitch: number;
  bearing: number;
}

// Map status to color
const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'observed_on_schedule': '#2D9A6F',
    'observed_smaller_than_claimed': '#D4882E',
    'observed_delayed': '#C76A3C',
    'claimed_not_observed': '#C44536',
    'built_and_corridor_ready': '#2878B5',
    'built_but_low_deliverability': '#8B6CA7',
    'observed_unmatched': '#7A7A7A'
  };
  return colors[status] || '#7A7A7A';
};

function rotateOffset(
  center: [number, number],
  dx: number,
  dy: number,
  angleDeg: number,
): [number, number] {
  const angle = (angleDeg * Math.PI) / 180;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return [
    center[0] + dx * cos - dy * sin,
    center[1] + dx * sin + dy * cos,
  ];
}

function createRectPolygon(
  center: [number, number],
  halfWidth: number,
  halfHeight: number,
  angleDeg = 0,
) {
  const corners = [
    rotateOffset(center, -halfWidth, -halfHeight, angleDeg),
    rotateOffset(center, halfWidth, -halfHeight, angleDeg),
    rotateOffset(center, halfWidth, halfHeight, angleDeg),
    rotateOffset(center, -halfWidth, halfHeight, angleDeg),
  ];
  return [...corners, corners[0]];
}

function getGeometryBounds(geometry: GeoJSONGeometry | null) {
  if (!geometry) {
    return null;
  }

  const points: [number, number][] = [];
  if (geometry.type === 'Point') {
    points.push(geometry.coordinates);
  } else if (geometry.type === 'LineString') {
    points.push(...geometry.coordinates);
  } else if (geometry.type === 'Polygon') {
    geometry.coordinates.forEach((ring) => points.push(...ring));
  } else if (geometry.type === 'MultiPolygon') {
    geometry.coordinates.forEach((polygon) => polygon.forEach((ring) => points.push(...ring)));
  }

  if (!points.length) {
    return null;
  }

  let minLon = points[0][0];
  let maxLon = points[0][0];
  let minLat = points[0][1];
  let maxLat = points[0][1];

  points.forEach(([lon, lat]) => {
    minLon = Math.min(minLon, lon);
    maxLon = Math.max(maxLon, lon);
    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
  });

  return { minLon, maxLon, minLat, maxLat };
}

function mergeBounds(
  left: { minLon: number; maxLon: number; minLat: number; maxLat: number } | null,
  right: { minLon: number; maxLon: number; minLat: number; maxLat: number } | null,
) {
  if (!left) return right;
  if (!right) return left;

  return {
    minLon: Math.min(left.minLon, right.minLon),
    maxLon: Math.max(left.maxLon, right.maxLon),
    minLat: Math.min(left.minLat, right.minLat),
    maxLat: Math.max(left.maxLat, right.maxLat),
  };
}

function getProjectFocusBounds(project: RegistryMapProject) {
  const matchedBounds = getGeometryBounds(project.matchedAssetGeometry);
  const centerBounds = {
    minLon: project.longitude,
    maxLon: project.longitude,
    minLat: project.latitude,
    maxLat: project.latitude,
  };
  const combined = mergeBounds(centerBounds, matchedBounds) ?? centerBounds;

  const lonSpan = Math.max(0.1, combined.maxLon - combined.minLon);
  const latSpan = Math.max(0.08, combined.maxLat - combined.minLat);
  const lonPadding = Math.max(0.08, lonSpan * 0.75);
  const latPadding = Math.max(0.06, latSpan * 0.75);

  return [
    [combined.minLon - lonPadding, combined.minLat - latPadding],
    [combined.maxLon + lonPadding, combined.maxLat + latPadding],
  ] as [[number, number], [number, number]];
}

function getProjectFocusPadding() {
  if (typeof window !== 'undefined' && window.innerWidth <= 760) {
    return {
      top: 28,
      right: 28,
      bottom: 28,
      left: 28,
    };
  }

  return {
    top: 54,
    right: 436,
    bottom: 54,
    left: 54,
  };
}

function buildLabelAnchor(center: [number, number], technology: RegistryMapProject['technology']) {
  return technology === 'wind'
    ? [center[0] + 0.34, center[1] - 0.16] as [number, number]
    : [center[0] + 0.26, center[1] + 0.12] as [number, number];
}

function buildSelectedProjectContext(project: RegistryMapProject | null) {
  if (!project) {
    return { type: 'FeatureCollection' as const, features: [] };
  }

  const center: [number, number] = [project.longitude, project.latitude];
  const gridDistance = project.nearestSiteSideGridDistanceKm ?? project.distanceKm ?? 18;
  const baseRadius = Math.max(0.18, Math.min(1.25, gridDistance / 55));
  const crosshairArm = Math.max(0.08, baseRadius * 0.42);
  const color = getStatusColor(project.paperToPowerLabel);
  const labelAnchor = buildLabelAnchor(center, project.technology);
  const matchedGeometry = project.matchedAssetGeometry;
  const matchedBounds = getGeometryBounds(matchedGeometry);
  const features: Array<{
    type: 'Feature';
    geometry: GeoJSONGeometry;
    properties: Record<string, string | number>;
  }> = [];

  if (project.technology !== 'wind') {
    let parcelHint: [number, number][];
    if (matchedBounds) {
      const width = Math.max(0.06, (matchedBounds.maxLon - matchedBounds.minLon) * 0.58);
      const height = Math.max(0.045, (matchedBounds.maxLat - matchedBounds.minLat) * 0.58);
      const parcelCenter: [number, number] = [
        (matchedBounds.minLon + matchedBounds.maxLon) / 2,
        (matchedBounds.minLat + matchedBounds.maxLat) / 2,
      ];
      parcelHint = createRectPolygon(parcelCenter, width, height, 0);
    } else {
      parcelHint = createRectPolygon(center, Math.max(0.11, baseRadius * 0.72), Math.max(0.08, baseRadius * 0.48), 0);
    }

    features.push({
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [parcelHint],
      },
      properties: {
        kind: 'focus-area',
        color,
      },
    });
  } else {
    const count = Math.max(1, project.observedAssetCount ?? 1);
    const axisLength = Math.max(0.16, Math.min(0.72, 0.2 + count * 0.014));
    const axisWidth = axisLength * 0.12;
    const axisAngle = 28;

    features.push({
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [[...createRectPolygon(center, axisLength, axisWidth, axisAngle)]],
      },
      properties: {
        kind: 'focus-area',
        color,
      },
    });
    features.push({
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          rotateOffset(center, -axisLength, 0, axisAngle),
          rotateOffset(center, axisLength, 0, axisAngle),
        ],
      },
      properties: {
        kind: 'wind-axis',
        color,
      },
    });
  }

  if (matchedGeometry) {
    features.push({
      type: 'Feature',
      geometry: matchedGeometry,
      properties: {
        kind: matchedGeometry.type === 'Point' ? 'analysis-point' : 'analysis-geometry',
        color,
      },
    });
  }

  features.push(
    {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          [center[0] - crosshairArm, center[1]],
          [center[0] + crosshairArm, center[1]],
        ],
      },
      properties: {
        kind: 'crosshair',
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          [center[0], center[1] - crosshairArm],
          [center[0], center[1] + crosshairArm],
        ],
      },
      properties: {
        kind: 'crosshair',
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [center, labelAnchor],
      },
      properties: {
        kind: 'leader-line',
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: center,
      },
      properties: {
        kind: 'selected-point',
        color,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: labelAnchor,
      },
      properties: {
        kind: 'label-anchor',
        color,
        label: project.projectName.toUpperCase(),
        region: (project.provinceStateRegion ?? project.locationText ?? project.countryName).toUpperCase(),
      },
    },
  );

  return {
    type: 'FeatureCollection' as const,
    features,
  };
}

export function ExplorerMap({ projects, onProjectSelect, selectedProjectId }: ExplorerMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const projectsRef = useRef(projects);
  const previousCameraRef = useRef<CameraSnapshot | null>(null);
  const previousSelectedProjectIdRef = useRef<string | null>(null);

  useEffect(() => {
    projectsRef.current = projects;
  }, [projects]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    let cancelled = false;
    let mapInstance: MapLibreMap | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let settleResizeTimeout: number | null = null;

    const syncMapSize = () => {
      if (!mapInstance || cancelled) return;
      mapInstance.resize();
    };

    const initMap = async () => {
      const { default: maplibregl } = await import('maplibre-gl');
      if (cancelled || !mapContainerRef.current || mapRef.current) return;

      const createdMap = new maplibregl.Map({
        container: mapContainerRef.current,
        style: 'https://tiles.openfreemap.org/styles/liberty',
        center: [116.1, 7.3],
        zoom: 4.2,
        pitch: 34,
        bearing: -14,
        maxPitch: 78,
        attributionControl: false,
      });

      mapInstance = createdMap;
      mapRef.current = createdMap;
      createdMap.addControl(new maplibregl.NavigationControl(), 'top-right');
      createdMap.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');

      if (typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(() => {
          syncMapSize();
        });
        resizeObserver.observe(mapContainerRef.current);
      }

      createdMap.on('load', () => {
        if (cancelled) return;

        applyCinematicMapTheme(createdMap, 'explorer');

        const features = projectsRef.current.map((project) => ({
          type: 'Feature' as const,
          geometry: {
            type: 'Point' as const,
            coordinates: [project.longitude, project.latitude],
          },
          properties: {
            id: project.projectId,
            name: project.projectName,
            tech: project.technology,
            status: project.paperToPowerLabel,
            color: getStatusColor(project.paperToPowerLabel),
            claimed: project.claimedCapacityMw ?? 40,
          },
        }));

        createdMap.addSource('projects', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features,
          },
          generateId: true,
        });

        createdMap.addSource(SELECTED_CONTEXT_SOURCE_ID, {
          type: 'geojson',
          data: buildSelectedProjectContext(null),
        });

        createdMap.addLayer({
          id: 'projects-layer-bg',
          type: 'circle',
          source: 'projects',
          paint: {
            'circle-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              4,
              ['interpolate', ['linear'], ['coalesce', ['get', 'claimed'], 40], 40, 6, 220, 14],
              9,
              ['interpolate', ['linear'], ['coalesce', ['get', 'claimed'], 40], 40, 12, 220, 24],
            ],
            'circle-color': ['get', 'color'],
            'circle-opacity': 0.24,
            'circle-blur': 0.8,
          },
        });

        createdMap.addLayer({
          id: 'projects-layer',
          type: 'circle',
          source: 'projects',
          paint: {
            'circle-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              4,
              ['interpolate', ['linear'], ['coalesce', ['get', 'claimed'], 40], 40, 2.5, 220, 6],
              9,
              ['interpolate', ['linear'], ['coalesce', ['get', 'claimed'], 40], 40, 5.5, 220, 10],
            ],
            'circle-color': ['get', 'color'],
            'circle-stroke-width': 1.2,
            'circle-stroke-color': 'rgba(237, 244, 247, 0.94)',
            'circle-opacity': 0.94,
          },
        });

        createdMap.addLayer({
          id: SELECTED_CONTEXT_FILL_LAYER_ID,
          type: 'fill',
          source: SELECTED_CONTEXT_SOURCE_ID,
          filter: ['==', ['get', 'kind'], 'focus-area'],
          paint: {
            'fill-color': ['get', 'color'],
            'fill-opacity': 0.08,
          },
        });

        createdMap.addLayer({
          id: SELECTED_CONTEXT_OUTLINE_LAYER_ID,
          type: 'line',
          source: SELECTED_CONTEXT_SOURCE_ID,
          filter: ['==', ['get', 'kind'], 'focus-area'],
          paint: {
            'line-color': ['get', 'color'],
            'line-width': 1.4,
            'line-dasharray': [1.8, 1.4],
            'line-opacity': 0.72,
          },
        });

        createdMap.addLayer({
          id: SELECTED_CONTEXT_ASSET_FILL_LAYER_ID,
          type: 'fill',
          source: SELECTED_CONTEXT_SOURCE_ID,
          filter: ['==', ['get', 'kind'], 'analysis-geometry'],
          paint: {
            'fill-color': ['get', 'color'],
            'fill-opacity': 0.07,
          },
        });

        createdMap.addLayer({
          id: SELECTED_CONTEXT_ASSET_OUTLINE_LAYER_ID,
          type: 'line',
          source: SELECTED_CONTEXT_SOURCE_ID,
          filter: ['==', ['get', 'kind'], 'analysis-geometry'],
          paint: {
            'line-color': ['get', 'color'],
            'line-width': 1.1,
            'line-opacity': 0.92,
          },
        });

        createdMap.addLayer({
          id: SELECTED_CONTEXT_ASSET_POINT_LAYER_ID,
          type: 'circle',
          source: SELECTED_CONTEXT_SOURCE_ID,
          filter: ['==', ['get', 'kind'], 'analysis-point'],
          paint: {
            'circle-radius': ['interpolate', ['linear'], ['zoom'], 4, 3.5, 10, 5.5],
            'circle-color': ['get', 'color'],
            'circle-stroke-color': 'rgba(247, 242, 234, 0.92)',
            'circle-stroke-width': 1.4,
            'circle-opacity': 0.9,
          },
        });

        createdMap.addLayer({
          id: SELECTED_CONTEXT_CROSSHAIR_LAYER_ID,
          type: 'line',
          source: SELECTED_CONTEXT_SOURCE_ID,
          filter: ['==', ['get', 'kind'], 'crosshair'],
          paint: {
            'line-color': 'rgba(24, 35, 41, 0.66)',
            'line-width': 1.2,
            'line-dasharray': [1, 1.8],
            'line-opacity': 0.72,
          },
        });

        createdMap.addLayer({
          id: SELECTED_CONTEXT_AXIS_LAYER_ID,
          type: 'line',
          source: SELECTED_CONTEXT_SOURCE_ID,
          filter: ['==', ['get', 'kind'], 'wind-axis'],
          paint: {
            'line-color': ['get', 'color'],
            'line-width': 1.3,
            'line-opacity': 0.66,
          },
        });

        createdMap.addLayer({
          id: SELECTED_CONTEXT_LEADER_LAYER_ID,
          type: 'line',
          source: SELECTED_CONTEXT_SOURCE_ID,
          filter: ['==', ['get', 'kind'], 'leader-line'],
          paint: {
            'line-color': 'rgba(36, 44, 49, 0.42)',
            'line-width': 1,
            'line-dasharray': [1.2, 1.8],
            'line-opacity': 0.82,
          },
        });

        createdMap.addLayer({
          id: SELECTED_CONTEXT_POINT_HALO_LAYER_ID,
          type: 'circle',
          source: SELECTED_CONTEXT_SOURCE_ID,
          filter: ['==', ['get', 'kind'], 'selected-point'],
          paint: {
            'circle-radius': ['interpolate', ['linear'], ['zoom'], 4, 18, 10, 36],
            'circle-color': ['get', 'color'],
            'circle-opacity': 0.14,
            'circle-blur': 0.55,
          },
        });

        createdMap.addLayer({
          id: SELECTED_CONTEXT_POINT_CORE_LAYER_ID,
          type: 'circle',
          source: SELECTED_CONTEXT_SOURCE_ID,
          filter: ['==', ['get', 'kind'], 'selected-point'],
          paint: {
            'circle-radius': ['interpolate', ['linear'], ['zoom'], 4, 5, 10, 8],
            'circle-color': ['get', 'color'],
            'circle-stroke-color': 'rgba(247, 242, 234, 0.96)',
            'circle-stroke-width': 1.6,
            'circle-opacity': 1,
          },
        });

        createdMap.addLayer({
          id: SELECTED_CONTEXT_LABEL_LAYER_ID,
          type: 'symbol',
          source: SELECTED_CONTEXT_SOURCE_ID,
          filter: ['==', ['get', 'kind'], 'label-anchor'],
          layout: {
            'text-field': ['format', ['get', 'label'], { 'font-scale': 0.94 }, '\n', {}, ['get', 'region'], { 'font-scale': 0.72 }],
            'text-font': ['Noto Sans Regular'],
            'text-size': 11.5,
            'text-offset': [0, 0],
            'text-anchor': 'left',
            'text-letter-spacing': 0.08,
            'text-max-width': 18,
          },
          paint: {
            'text-color': 'rgba(30, 37, 41, 0.94)',
            'text-halo-color': 'rgba(248, 244, 236, 0.98)',
            'text-halo-width': 1.6,
            'text-halo-blur': 0.45,
          },
        });

        const popup = new maplibregl.Popup({
          closeButton: false,
          closeOnClick: false,
          offset: 15,
        });

        createdMap.on('mouseenter', 'projects-layer', (event) => {
          if (!event.features || event.features.length === 0) return;
          createdMap.getCanvas().style.cursor = 'pointer';

          const coordinates = (event.features[0].geometry as GeoJSON.Point).coordinates.slice();
          const description = event.features[0].properties.name;

          while (Math.abs(event.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += event.lngLat.lng > coordinates[0] ? 360 : -360;
          }

          popup
            .setLngLat(coordinates as [number, number])
            .setHTML(
              `<div style="padding: 8px 12px; font-weight: 500; font-size: 14px;">${description}</div>`,
            )
            .addTo(createdMap);
        });

        createdMap.on('mouseleave', 'projects-layer', () => {
          createdMap.getCanvas().style.cursor = '';
          popup.remove();
        });

        createdMap.on('click', 'projects-layer', (event) => {
          if (!event.features || event.features.length === 0) return;
          onProjectSelect(event.features[0].properties.id);
        });

        createdMap.on('click', (event) => {
          const featuresAtPoint = createdMap.queryRenderedFeatures(event.point, {
            layers: ['projects-layer'],
          });
          if (!featuresAtPoint.length) {
            onProjectSelect(null);
          }
        });

        requestAnimationFrame(() => {
          syncMapSize();
          requestAnimationFrame(syncMapSize);
        });
        settleResizeTimeout = window.setTimeout(syncMapSize, 320);
      });
    };

    void initMap();

    return () => {
      cancelled = true;
      if (settleResizeTimeout !== null) {
        window.clearTimeout(settleResizeTimeout);
      }
      resizeObserver?.disconnect();
      if (mapInstance) {
        mapInstance.remove();
      }
      mapRef.current = null;
    };
  }, [onProjectSelect]);

  // Update data when projects change
  useEffect(() => {
    if (!mapRef.current || !mapRef.current.isStyleLoaded()) return;

    const map = mapRef.current;
    const source = map.getSource('projects') as GeoJSONSource | undefined;
    const selectedContextSource = map.getSource(SELECTED_CONTEXT_SOURCE_ID) as GeoJSONSource | undefined;
    
    if (source) {
      const features = projects.map(p => ({
        type: 'Feature' as const,
        geometry: {
          type: 'Point' as const,
          coordinates: [p.longitude, p.latitude]
        },
        properties: {
          id: p.projectId,
          name: p.projectName,
          tech: p.technology,
          status: p.paperToPowerLabel,
          color: getStatusColor(p.paperToPowerLabel),
          claimed: p.claimedCapacityMw ?? 40,
        }
      }));

      source.setData({
        type: 'FeatureCollection',
        features
      });
    }

    if (selectedContextSource) {
      const selected = selectedProjectId
        ? projects.find((project) => project.projectId === selectedProjectId) ?? null
        : null;
      selectedContextSource.setData(buildSelectedProjectContext(selected));
    }

    const previousSelectedProjectId = previousSelectedProjectIdRef.current;
    const selected = selectedProjectId
      ? projects.find((project) => project.projectId === selectedProjectId) ?? null
      : null;

    if (selected && previousSelectedProjectId !== selected.projectId) {
      if (!previousSelectedProjectId) {
        previousCameraRef.current = {
          center: [map.getCenter().lng, map.getCenter().lat],
          zoom: map.getZoom(),
          pitch: map.getPitch(),
          bearing: map.getBearing(),
        };
      }

      map.fitBounds(getProjectFocusBounds(selected), {
        padding: getProjectFocusPadding(),
        maxZoom: selected.technology === 'wind' ? 10.8 : 11.4,
        pitch: selected.technology === 'wind' ? 52 : 48,
        bearing: selected.technology === 'wind' ? 16 : -12,
        duration: 1050,
        essential: true,
      });
    } else if (!selected && previousSelectedProjectId && previousCameraRef.current) {
      map.easeTo({
        center: previousCameraRef.current.center,
        zoom: previousCameraRef.current.zoom,
        pitch: previousCameraRef.current.pitch,
        bearing: previousCameraRef.current.bearing,
        duration: 850,
        essential: true,
      });
      previousCameraRef.current = null;
    }

    previousSelectedProjectIdRef.current = selectedProjectId;
  }, [projects, selectedProjectId]);


  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
      
      {/* Semi-transparent minimal legend overlay on the map */}
      <div style={{
        position: 'absolute',
        bottom: '24px',
        left: '16px',
        background: 'linear-gradient(180deg, rgba(248, 244, 236, 0.92), rgba(244, 239, 230, 0.84))',
        padding: '14px 14px 13px',
        borderRadius: '16px',
        border: '1px solid rgba(97, 109, 115, 0.12)',
        boxShadow: '0 24px 50px rgba(79, 70, 53, 0.14), inset 0 1px 0 rgba(255,255,255,0.46)',
        fontSize: '0.75rem',
        zIndex: 10,
        pointerEvents: 'none' /* let clicks pass through to map if needed */
      }}>
        <div style={{ fontWeight: 700, marginBottom: '10px', color: 'rgba(23, 32, 37, 0.88)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Status
        </div>
        <div style={{ display: 'grid', gap: '6px' }}>
          {[
            { label: 'On Schedule', color: '#2D9A6F' },
            { label: 'Delayed / Smaller', color: '#D4882E' },
            { label: 'Not Observed', color: '#C44536' }
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ 
                display: 'inline-block', 
                width: '10px', 
                height: '10px', 
                borderRadius: '50%', 
                background: item.color,
                boxShadow: `0 0 14px ${item.color}55` 
              }} />
              <span style={{ color: 'rgba(61, 74, 81, 0.82)' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
