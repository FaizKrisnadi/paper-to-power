import { useEffect, useRef, useState } from 'react';
import type { Map as MapLibreMap, GeoJSONSource, ExpressionSpecification } from 'maplibre-gl';
import type { FeatureCollection, Geometry } from 'geojson';
import type { PilotStudy } from '../types/domain';
import { loadMapLibre } from '../lib/maplibre';
import { applyCinematicMapTheme } from '../lib/mapTheme';

function collection(study: PilotStudy, quarter: number, showEarlier: boolean): FeatureCollection {
 return {type:'FeatureCollection',features:study.assets.filter(a=>a.firstSeenIndex<=quarter&&(a.status==='approved'||showEarlier)).map(a=>({type:'Feature',geometry:a.geometry,properties:{id:a.siteId,label:a.label,status:a.status}}))};
}
function bounds(geometries: Geometry[]): [[number,number],[number,number]] {
 const points: number[][]=[];
 const walk=(value: unknown)=>{if(!Array.isArray(value))return;if(typeof value[0]==='number')points.push(value as number[]);else value.forEach(walk);};
 for(const g of geometries)if('coordinates' in g)walk(g.coordinates);
 return [[Math.min(...points.map(p=>p[0])),Math.min(...points.map(p=>p[1]))],[Math.max(...points.map(p=>p[0])),Math.max(...points.map(p=>p[1]))]];
}
export function PilotMap({study,quarter,showEarlier,onSelect,selectedId}:{study:PilotStudy;quarter:number;showEarlier:boolean;onSelect:(id:string)=>void;selectedId:string|null}) {
 const container=useRef<HTMLDivElement>(null);const mapRef=useRef<MapLibreMap|null>(null);const callback=useRef(onSelect);const previousSelection=useRef<string|null>(null);const [ready,setReady]=useState(false);const [error,setError]=useState(false);
 useEffect(()=>{callback.current=onSelect;},[onSelect]);
 useEffect(()=>{
  let cancelled=false;let map:MapLibreMap|undefined;let resize:ResizeObserver|undefined;
  void loadMapLibre().then(lib=>{
   if(cancelled||!container.current)return;
   map=new lib.Map({container:container.current,style:'https://tiles.openfreemap.org/styles/liberty',center:study.projectId==='SGP-S-001'?[103.64,1.35]:[119.71,-3.99],zoom:12,attributionControl:false,scrollZoom:false,cooperativeGestures:true});mapRef.current=map;
   map.addControl(new lib.NavigationControl({showCompass:false}),'top-right');map.addControl(new lib.AttributionControl({compact:true}),'bottom-right');map.addControl(new lib.ScaleControl({maxWidth:90}),'bottom-left');
   resize=new ResizeObserver(()=>map?.resize());resize.observe(container.current);
   map.on('error',()=>setError(true));
   map.on('load',()=>{
    if(!map)return;applyCinematicMapTheme(map,'explorer');
    map.addSource('pilot-reference',{type:'geojson',data:{type:'FeatureCollection',features:study.referenceShapes.map(s=>({type:'Feature',geometry:s.geometry,properties:{label:s.label}}))}});
    map.addSource('pilot-assets',{type:'geojson',promoteId:'id',data:collection(study,29,true)});
    map.addLayer({id:'reference-area',type:'fill',source:'pilot-reference',filter:['==',['geometry-type'],'Polygon'],paint:{'fill-color':'#77abb3','fill-opacity':0.12}});
    map.addLayer({id:'reference-outline',type:'line',source:'pilot-reference',filter:['==',['geometry-type'],'Polygon'],paint:{'line-color':'#516b74','line-width':1.8,'line-dasharray':[3,2]}});
    map.addLayer({id:'reference-points',type:'circle',source:'pilot-reference',filter:['==',['geometry-type'],'Point'],paint:{'circle-radius':7,'circle-color':'#fff','circle-stroke-color':'#647b81','circle-stroke-width':1.5}});
    const color:ExpressionSpecification=['match',['get','status'],'approved','#087f70','#bd713b'];
    map.addLayer({id:'asset-area',type:'fill',source:'pilot-assets',filter:['==',['geometry-type'],'Polygon'],paint:{'fill-color':color,'fill-opacity':0.65}});
    map.addLayer({id:'asset-outline',type:'line',source:'pilot-assets',filter:['==',['geometry-type'],'Polygon'],paint:{'line-color':color,'line-width':['case',['boolean',['feature-state','selected'],false],4,2]}});
    map.addLayer({id:'asset-points',type:'circle',source:'pilot-assets',filter:['==',['geometry-type'],'Point'],paint:{'circle-radius':['case',['boolean',['feature-state','selected'],false],8,4.5],'circle-color':color,'circle-stroke-color':'#fff','circle-stroke-width':1}});
    for(const layer of ['asset-area','asset-points']){map.on('click',layer,e=>{const id=e.features?.[0]?.properties?.id;if(id)callback.current(String(id));});map.on('mouseenter',layer,()=>{if(map)map.getCanvas().style.cursor='pointer';});map.on('mouseleave',layer,()=>{if(map)map.getCanvas().style.cursor='';});}
    map.fitBounds(bounds([...study.referenceShapes,...study.assets].map(s=>s.geometry)),{padding:60,duration:0,maxZoom:15});setReady(true);setError(false);
   });
  }).catch(()=>setError(true));
  return()=>{cancelled=true;resize?.disconnect();map?.remove();mapRef.current=null;};
 },[study]);
 useEffect(()=>{if(ready)(mapRef.current?.getSource('pilot-assets') as GeoJSONSource|undefined)?.setData(collection(study,quarter,showEarlier));},[study,quarter,showEarlier,ready]);
 useEffect(()=>{const map=mapRef.current;if(!ready||!map)return;if(previousSelection.current)map.removeFeatureState({source:'pilot-assets',id:previousSelection.current});if(selectedId)map.setFeatureState({source:'pilot-assets',id:selectedId},{selected:true});previousSelection.current=selectedId;},[selectedId,ready]);
 return <div className="pilot-geographic-map" data-pilot-map-ready={ready} ref={container} role="region" aria-label={`${study.shortName} geographic project map`}>{error&&!ready&&<p className="pilot-map-error">Map unavailable. Asset records are available below.</p>}</div>;
}
