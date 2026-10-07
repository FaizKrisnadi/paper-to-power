import { loadMapLibre } from '../lib/maplibre';
import type * as GeoJSON from 'geojson';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { Map as MapLibreMap } from 'maplibre-gl';
import { registryMapProjects } from '../data/generated';
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

interface StoryChapterConfig {
 id: string; navLabel: string; eyebrow: string; title: string; description: string; secondaryText?: string;
 size: 'narrow' | 'regular' | 'wide'; stats?: StoryStat[]; signalsLabel?: string; signals?: StorySignal[];
 methods?: StoryMethod[]; note?: string; align: 'left' | 'right' | 'center';
 view: { center: [number,number]; zoom: number; pitch: number; bearing: number };
}
const CHAPTERS: StoryChapterConfig[] = [
 {id:'chapter-1',navLabel:'The region',eyebrow:'Southeast Asia',title:'A regional view of renewable energy',description:'Paper to Power aims to follow renewable energy development across Southeast Asia, from public announcements to reported operation and mapped evidence.',secondaryText:'The September 2026 baseline spans eleven countries and five renewable technologies. Explore individual units and phases, alongside the sources behind reviewed claims.',note:'Solar · Wind · Hydro · Geothermal · Bioenergy.',size:'wide',align:'left',view:{center:[116.2,6.8],zoom:4.2,pitch:26,bearing:-14}},
 {id:'chapter-2',navLabel:'Project journeys',eyebrow:'From announcement to operation',title:'Projects leave a trail of records',description:'An announcement sets out a capacity or target date. Construction and operating reports add later milestones, each with its own source.',secondaryText:'Those stages remain separate in the record, so a promise and a reported operating plant can be read in context.',size:'regular',align:'left',view:{center:[108.6,13.2],zoom:5.5,pitch:30,bearing:8}},
 {id:'chapter-3',navLabel:'Mapped evidence',eyebrow:'Another view of the project',title:'A footprint adds physical evidence',description:'Mapped arrays and turbine points can help identify a project’s physical presence. Their detection dates sit alongside the dates in public records.',secondaryText:'Generating capacity and electricity output need separate sources. The saved mapped observations run through June 2024.',size:'regular',align:'left',view:{center:[103.642,1.348],zoom:12.8,pitch:35,bearing:10}},
 {id:'chapter-4',navLabel:'Explore',eyebrow:'The regional project record',title:'Follow projects across Southeast Asia',description:'Explore the selection by country, technology or review status, then open a project’s dates, sources and mapped evidence.',secondaryText:'Detailed examples later in the page show how the records and footprints can be read together.',size:'regular',align:'left',view:{center:[116.2,6.8],zoom:4.2,pitch:20,bearing:0}},
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
        claimed: project.claimedCapacityMw ?? 0,
        status: project.paperToPowerLabel,
        grid: project.gridEvidenceClass ?? 'unknown',
        tech: project.technology,
      },
    })),
  };
}

function buildStoryObservedCollection() {
 return {type:'FeatureCollection' as const,features:registryMapProjects.flatMap(project=>project.matchedAssetGeometries.map(geometry=>({
  type:'Feature' as const,geometry:geometry as unknown as GeoJSON.Geometry,properties:{chapter:'chapter-4',id:project.projectId,tech:project.technology,status:project.observationStatus}
 })))};
}
function buildStoryContextCollection() {
 // The story uses only sourced project points and reviewed assets. No fabricated site boundaries or grid corridors.
 return {type:'FeatureCollection' as const,features:[]};
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

  const sharedRadius = ['interpolate',['linear'],['zoom'],4,5,10,10];
  const statusColors = ['match',['get','status'],'observed_footprint','#2D9A6F','review_pending','#D4882E','not_detected_by_cutoff','#C76A3C','coverage_unavailable','#7A7A7A','not_yet_due_at_cutoff','#2878B5','method_not_applicable','#8B6CA7','#8f9ba2'] as const;

  let haloColor: string | readonly unknown[] = '#78a7ba';
  let coreColor: string | readonly unknown[] = ['match',['get','tech'],'solar','#c99536','wind','#3b8ea5','hydro','#3868a6','geothermal','#ad5e42','bioenergy','#63864b','pumped_storage','#747b88','#8b6ca7'];
  let haloOpacity = 0.3;
  let coreStroke = 'rgba(249, 245, 236, 0.9)';

  if (chapterId === 'chapter-2') {
    haloColor = '#6a9fc4';
    coreColor = ['match',['get','tech'],'solar','#c99536','wind','#3b8ea5','hydro','#3868a6','geothermal','#ad5e42','bioenergy','#63864b','pumped_storage','#747b88','#8b6ca7'];
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
    coreColor = ['match',['get','tech'],'solar','#c99536','wind','#3b8ea5','hydro','#3868a6','geothermal','#ad5e42','bioenergy','#63864b','pumped_storage','#747b88','#8b6ca7'];
    haloOpacity = 0.36;
    coreStroke = 'rgba(250, 246, 238, 0.96)';
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
    ['interpolate', ['linear'], ['zoom'], 4, 4, 10, 6] as never,
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

  if (chapterId === 'chapter-3') {
    map.setPaintProperty(STORY_PROJECT_CORE_LAYER_ID, 'circle-opacity', 0);
    map.setPaintProperty(STORY_PROJECT_HALO_LAYER_ID, 'circle-opacity', 0);
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

    const showObserved = chapterId === 'chapter-3';
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
    let resizeObserver: ResizeObserver | null = null;
    let settleResizeTimeout: number | null = null;

    const syncMapSize = () => {
      if (!map || cancelled) {
        return;
      }
      map.resize();
    };

    const initMap = async () => {
      const maplibregl = await loadMapLibre();
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

      if (typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(() => {
          syncMapSize();
        });
        resizeObserver.observe(mapContainerRef.current);
      }

      map.on('load', () => {
        if (mapContainerRef.current) mapContainerRef.current.dataset.mapReady='true';
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
            duration: 2200,
            curve: 1.25,
            essential: false,
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
            <aside className="story-progress" aria-label="Story chapters">
              <div className="story-progress__topline">
                <span className="story-progress__eyebrow">Story Guide</span>
                <span className="story-progress__count">
                  {String(activeChapterIndex + 1).padStart(2, '0')} / {String(CHAPTERS.length).padStart(2, '0')}
                </span>
              </div>
              <div className="story-progress__list">
                {CHAPTERS.map((chapter, index) => (
                  <a
                    key={chapter.id}
                    href={`#${chapter.id}`}
                    aria-current={activeChapterId === chapter.id ? 'step' : undefined}
                    className={`story-progress__item ${activeChapterId === chapter.id ? 'is-active' : ''}`}
                  >
                    <span className="story-progress__index">{String(index + 1).padStart(2, '0')}</span>
                    <span className="story-progress__label">{chapter.navLabel}</span>
                  </a>
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
