import type { Map as MapLibreMap } from 'maplibre-gl';

type MapThemeVariant = 'story' | 'explorer';

const TERRAIN_SOURCE_ID = 'ppt-terrain-dem';
const HILLSHADE_SOURCE_ID = 'ppt-hillshade-dem';
const HILLSHADE_LAYER_ID = 'ppt-hillshade';
const TERRAIN_TILE_URL = 'https://demotiles.maplibre.org/terrain-tiles/{z}/{x}/{y}.png';

const FILL_LAYERS = [
  'park',
  'landuse_residential',
  'landcover_wood',
  'landcover_grass',
  'landcover_ice',
  'landcover_wetland',
  'landuse_pitch',
  'landuse_track',
  'landuse_cemetery',
  'landuse_hospital',
  'landuse_school',
  'landcover_sand',
  'aeroway_fill',
  'road_area_pattern',
] as const;

const MINOR_ROAD_LAYERS = [
  'road_service_track',
  'road_link',
  'road_minor',
  'road_path_pedestrian',
  'bridge_service_track',
  'bridge_link',
  'bridge_street',
  'bridge_path_pedestrian',
  'tunnel_service_track',
  'tunnel_link',
  'tunnel_minor',
  'tunnel_path_pedestrian',
] as const;

const MAJOR_ROAD_LAYERS = [
  'road_secondary_tertiary',
  'road_trunk_primary',
  'road_motorway',
  'road_motorway_link',
  'bridge_secondary_tertiary',
  'bridge_trunk_primary',
  'bridge_motorway',
  'bridge_motorway_link',
  'tunnel_secondary_tertiary',
  'tunnel_trunk_primary',
  'tunnel_motorway',
  'tunnel_motorway_link',
] as const;

const RAIL_LAYERS = [
  'road_major_rail',
  'road_major_rail_hatching',
  'road_transit_rail',
  'road_transit_rail_hatching',
  'bridge_major_rail',
  'bridge_major_rail_hatching',
  'bridge_transit_rail',
  'bridge_transit_rail_hatching',
  'tunnel_major_rail',
  'tunnel_major_rail_hatching',
  'tunnel_transit_rail',
  'tunnel_transit_rail_hatching',
] as const;

const BOUNDARY_LAYERS = ['boundary_3', 'boundary_2', 'boundary_disputed'] as const;
const WATERWAY_LAYERS = ['waterway_river', 'waterway_other', 'waterway_tunnel'] as const;

const LABEL_LAYERS = [
  'waterway_line_label',
  'water_name_point_label',
  'water_name_line_label',
  'poi_r20',
  'poi_r7',
  'poi_r1',
  'poi_transit',
  'highway-name-path',
  'highway-name-minor',
  'highway-name-major',
  'highway-shield-non-us',
  'highway-shield-us-interstate',
  'road_shield_us',
  'airport',
  'label_other',
  'label_village',
  'label_town',
  'label_state',
  'label_city',
  'label_city_capital',
  'label_country_3',
  'label_country_2',
  'label_country_1',
] as const;

const STRONG_LABEL_LAYERS = [
  'label_city',
  'label_city_capital',
  'label_country_3',
  'label_country_2',
  'label_country_1',
  'label_state',
  'airport',
] as const;

const MAP_THEMES: Record<
  MapThemeVariant,
  {
    terrainExaggeration: number;
    colors: {
      background: string;
      water: string;
      waterOutline: string;
      fill: string;
      park: string;
      wood: string;
      grass: string;
      sand: string;
      roadMinor: string;
      roadMajor: string;
      rail: string;
      boundary: string;
      building: string;
      buildingExtrusion: string;
      label: string;
      labelStrong: string;
      labelHalo: string;
    };
    hillshade: {
      accent: string;
      shadow: string;
      highlight: string;
      exaggeration: number;
    };
    sky: {
      'sky-color': string;
      'horizon-color': string;
      'fog-color': string;
      'fog-ground-blend': number;
      'horizon-fog-blend': number;
      'sky-horizon-blend': number;
      'atmosphere-blend': number;
    };
    light: {
      anchor: 'viewport';
      color: string;
      intensity: number;
      position: [number, number, number];
    };
  }
> = {
  story: {
    terrainExaggeration: 1.38,
    colors: {
      background: '#ede7d9',
      water: '#c9dde8',
      waterOutline: '#93b6ca',
      fill: '#ded9cb',
      park: '#c7d7c1',
      wood: '#bbcdb4',
      grass: '#d1d8c0',
      sand: '#ddd0b0',
      roadMinor: 'rgba(255, 255, 255, 0.54)',
      roadMajor: 'rgba(139, 163, 177, 0.44)',
      rail: 'rgba(123, 131, 140, 0.28)',
      boundary: 'rgba(101, 112, 119, 0.28)',
      building: '#b9c3c8',
      buildingExtrusion: '#90a6b1',
      label: 'rgba(76, 86, 92, 0.7)',
      labelStrong: 'rgba(33, 39, 43, 0.9)',
      labelHalo: 'rgba(246, 241, 232, 0.82)',
    },
    hillshade: {
      accent: 'rgba(182, 166, 132, 0.2)',
      shadow: 'rgba(120, 101, 74, 0.24)',
      highlight: 'rgba(255, 249, 234, 0.56)',
      exaggeration: 0.44,
    },
    sky: {
      'sky-color': '#dceaf3',
      'horizon-color': '#f5e7d7',
      'fog-color': '#efe6d8',
      'fog-ground-blend': 0.84,
      'horizon-fog-blend': 0.68,
      'sky-horizon-blend': 0.64,
      'atmosphere-blend': 0.3,
    },
    light: {
      anchor: 'viewport',
      color: '#fff5df',
      intensity: 0.28,
      position: [1.2, 186, 44],
    },
  },
  explorer: {
    terrainExaggeration: 1.16,
    colors: {
      background: '#ece5d8',
      water: '#c6dce8',
      waterOutline: '#8caebf',
      fill: '#ddd7c9',
      park: '#c6d4c2',
      wood: '#b7c8b1',
      grass: '#d3d8c0',
      sand: '#d9cfb3',
      roadMinor: 'rgba(255, 255, 255, 0.5)',
      roadMajor: 'rgba(132, 158, 172, 0.4)',
      rail: 'rgba(118, 128, 136, 0.26)',
      boundary: 'rgba(96, 108, 115, 0.26)',
      building: '#b4bec3',
      buildingExtrusion: '#889ea8',
      label: 'rgba(70, 79, 85, 0.7)',
      labelStrong: 'rgba(26, 32, 36, 0.92)',
      labelHalo: 'rgba(247, 242, 234, 0.82)',
    },
    hillshade: {
      accent: 'rgba(176, 158, 126, 0.18)',
      shadow: 'rgba(122, 102, 76, 0.2)',
      highlight: 'rgba(255, 248, 233, 0.48)',
      exaggeration: 0.36,
    },
    sky: {
      'sky-color': '#d8e8f1',
      'horizon-color': '#f3e5d7',
      'fog-color': '#efe5d6',
      'fog-ground-blend': 0.82,
      'horizon-fog-blend': 0.65,
      'sky-horizon-blend': 0.62,
      'atmosphere-blend': 0.26,
    },
    light: {
      anchor: 'viewport',
      color: '#fff2d9',
      intensity: 0.24,
      position: [1.14, 186, 40],
    },
  },
};

function setPaint(map: MapLibreMap, layerId: string, property: string, value: unknown) {
  if (map.getLayer(layerId)) {
    map.setPaintProperty(layerId, property, value as never);
  }
}

function setLayout(map: MapLibreMap, layerId: string, property: string, value: unknown) {
  if (map.getLayer(layerId)) {
    map.setLayoutProperty(layerId, property, value as never);
  }
}

function firstSymbolLayerId(map: MapLibreMap) {
  return map.getStyle().layers?.find((layer) => layer.type === 'symbol')?.id;
}

function addTerrain(map: MapLibreMap, variant: MapThemeVariant) {
  if (!map.getSource(TERRAIN_SOURCE_ID)) {
    map.addSource(TERRAIN_SOURCE_ID, {
      type: 'raster-dem',
      encoding: 'mapbox',
      tiles: [TERRAIN_TILE_URL],
      tileSize: 256,
      maxzoom: 12,
    });
  }

  if (!map.getSource(HILLSHADE_SOURCE_ID)) {
    map.addSource(HILLSHADE_SOURCE_ID, {
      type: 'raster-dem',
      encoding: 'mapbox',
      tiles: [TERRAIN_TILE_URL],
      tileSize: 256,
      maxzoom: 12,
    });
  }

  if (!map.getLayer(HILLSHADE_LAYER_ID)) {
    const beforeId = firstSymbolLayerId(map);
    map.addLayer(
      {
        id: HILLSHADE_LAYER_ID,
        type: 'hillshade',
        source: HILLSHADE_SOURCE_ID,
        paint: {},
      },
      beforeId,
    );
  }

  const theme = MAP_THEMES[variant];
  map.setTerrain({
    source: TERRAIN_SOURCE_ID,
    exaggeration: theme.terrainExaggeration,
  });
  map.setSky(theme.sky);
  map.setLight(theme.light);
  setPaint(map, HILLSHADE_LAYER_ID, 'hillshade-exaggeration', theme.hillshade.exaggeration);
  setPaint(map, HILLSHADE_LAYER_ID, 'hillshade-highlight-color', theme.hillshade.highlight);
  setPaint(map, HILLSHADE_LAYER_ID, 'hillshade-shadow-color', theme.hillshade.shadow);
  setPaint(map, HILLSHADE_LAYER_ID, 'hillshade-accent-color', theme.hillshade.accent);
}

export function applyCinematicMapTheme(map: MapLibreMap, variant: MapThemeVariant) {
  const theme = MAP_THEMES[variant];
  addTerrain(map, variant);

  setPaint(map, 'background', 'background-color', theme.colors.background);

  setPaint(map, 'natural_earth', 'raster-opacity', variant === 'story' ? 0.22 : 0.26);
  setPaint(map, 'natural_earth', 'raster-saturation', -0.55);
  setPaint(map, 'natural_earth', 'raster-contrast', -0.08);
  setPaint(map, 'natural_earth', 'raster-brightness-max', 0.84);
  setPaint(map, 'natural_earth', 'raster-brightness-min', 0.32);

  FILL_LAYERS.forEach((layerId) => setPaint(map, layerId, 'fill-color', theme.colors.fill));
  setPaint(map, 'park', 'fill-color', theme.colors.park);
  setPaint(map, 'park_outline', 'line-color', theme.colors.park);
  setPaint(map, 'park_outline', 'line-opacity', 0.45);
  setPaint(map, 'landcover_wood', 'fill-color', theme.colors.wood);
  setPaint(map, 'landcover_grass', 'fill-color', theme.colors.grass);
  setPaint(map, 'landcover_sand', 'fill-color', theme.colors.sand);
  setPaint(map, 'water', 'fill-color', theme.colors.water);
  setPaint(map, 'water', 'fill-outline-color', theme.colors.waterOutline);
  WATERWAY_LAYERS.forEach((layerId) => {
    setPaint(map, layerId, 'line-color', theme.colors.waterOutline);
    setPaint(map, layerId, 'line-opacity', 0.72);
  });

  MINOR_ROAD_LAYERS.forEach((layerId) => {
    setPaint(map, layerId, 'line-color', theme.colors.roadMinor);
    setPaint(map, layerId, 'line-opacity', 0.9);
  });
  MAJOR_ROAD_LAYERS.forEach((layerId) => {
    setPaint(map, layerId, 'line-color', theme.colors.roadMajor);
    setPaint(map, layerId, 'line-opacity', 0.96);
  });
  RAIL_LAYERS.forEach((layerId) => {
    setPaint(map, layerId, 'line-color', theme.colors.rail);
    setPaint(map, layerId, 'line-opacity', 0.76);
  });
  BOUNDARY_LAYERS.forEach((layerId) => {
    setPaint(map, layerId, 'line-color', theme.colors.boundary);
    setPaint(map, layerId, 'line-opacity', 0.7);
  });

  setPaint(map, 'building', 'fill-color', theme.colors.building);
  setPaint(map, 'building', 'fill-outline-color', theme.colors.buildingExtrusion);
  setPaint(map, 'building-3d', 'fill-extrusion-color', theme.colors.buildingExtrusion);
  setPaint(map, 'building-3d', 'fill-extrusion-opacity', variant === 'story' ? 0.74 : 0.7);

  LABEL_LAYERS.forEach((layerId) => {
    setPaint(map, layerId, 'text-color', theme.colors.label);
    setPaint(map, layerId, 'text-halo-color', theme.colors.labelHalo);
    setPaint(map, layerId, 'text-halo-width', 1.25);
    setPaint(map, layerId, 'text-halo-blur', 0.55);
  });

  STRONG_LABEL_LAYERS.forEach((layerId) => {
    setPaint(map, layerId, 'text-color', theme.colors.labelStrong);
    setPaint(map, layerId, 'text-halo-width', 1.2);
  });

  setLayout(map, 'road_one_way_arrow', 'visibility', 'none');
  setLayout(map, 'road_one_way_arrow_opposite', 'visibility', 'none');
}
