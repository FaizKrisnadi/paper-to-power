"""Describe cached infrastructure proximity without assigning connection or readiness."""
from __future__ import annotations
from pathlib import Path
from .io import read_json, write_json
from .geo import haversine_km
from .match_projects import project_fingerprint
ROOT=Path(__file__).resolve().parent.parent
OUTPUT=ROOT/'data/processed/geospatial/site_context_features.json'

def build_context(projects: list[dict], layers: list[dict]) -> list[dict]:
    from shapely.geometry import Point, shape
    from shapely.ops import nearest_points
    records=[]
    for p in projects:
        features=[f for layer in layers for f in layer.get('features',[]) if f.get('properties',{}).get('projectId')==p['projectId']]
        nearest=None
        for f in features:
            g=shape(f['geometry']);_,q=nearest_points(Point(p['longitude'],p['latitude']),g)
            d=haversine_km(p['latitude'],p['longitude'],q.y,q.x)
            nearest=d if nearest is None else min(nearest,d)
        records.append({'projectId':p['projectId'],'projectFingerprint':project_fingerprint(p),'gridEvidenceClass':'infrastructure_nearby' if nearest is not None else 'not_assessed',
                        'gridEvidenceReason':f'Cached OSM infrastructure is approximately {nearest:.2f} km from the registry point. Snapshot date is unavailable; location accuracy: {p.get("coordinateAccuracy", "unverified")}. This is proximity evidence, not proof of connection or delivery.' if nearest is not None else 'No reconciled cached infrastructure features for this record. Grid connection and delivery are not assessed.',
                        'nearestSiteSideGridDistanceKm':round(nearest,3) if nearest is not None else None,
                        'contextSnapshotDate':None,'contextFeatureCount':len(features)})
    return records

def main():
    projects=read_json(ROOT/'data/processed/project_registry.json')['records']
    layers=[]
    for name in ('substations','transmission'):
        path=ROOT/f'data/processed/geospatial/context_{name}.geojson'
        if path.exists():layers.append(read_json(path))
    rows=build_context(projects,layers);write_json(OUTPUT,{'records':rows,'source':'Saved OpenStreetMap extract','snapshotDate':None})
    import geopandas as gpd
    from shapely.geometry import Point
    by_id={p['projectId']:p for p in projects}
    gdf=gpd.GeoDataFrame([{**r,'geometry':Point(by_id[r['projectId']]['longitude'],by_id[r['projectId']]['latitude'])} for r in rows],geometry='geometry',crs='EPSG:4326')
    gdf.to_parquet(OUTPUT.with_suffix('.parquet'),index=False)
    gdf.to_file(OUTPUT.with_suffix('.geojson'),driver='GeoJSON')
    print(f'Grid context: {sum(r["contextFeatureCount"]>0 for r in rows)} records with cached proximity evidence; no connection verdicts')
if __name__=='__main__':main()
