"""Export versioned geometries and parquet from the same active registry and approved matches."""
from __future__ import annotations
import json
from pathlib import Path
from .io import read_json,write_json
from .geospatial_runtime import ensure_modules
ROOT=Path(__file__).resolve().parent.parent
OUTPUT_DIR=ROOT/'data/processed/geospatial'

def main():
    ensure_modules(['geopandas','pyarrow','shapely'],module_name='pipeline.export_geospatial_layers')
    import geopandas as gpd
    from shapely.geometry import shape
    registry=read_json(ROOT/'data/processed/frontend_dataset.json')['registryMapProjects']
    assets=read_json(ROOT/'data/processed/observed_assets.json')['records']
    matches=read_json(ROOT/'data/processed/project_asset_matches.json')['matches']
    by_asset={a['siteId']:a for a in assets};by_project={p['projectId']:p for p in registry}
    def feature(geometry,properties):return {'type':'Feature','geometry':geometry,'properties':properties}
    points=[feature({'type':'Point','coordinates':[p['longitude'],p['latitude']]},p) for p in registry]
    observed=[feature(a['geometry'],{k:v for k,v in a.items() if k!='geometry'}) for a in assets]
    linked_assets=[];links=[]
    for m in matches:
        a=by_asset[m['siteId']];p=by_project[m['projectId']]
        linked_assets.append(feature(a['geometry'],{**m,'projectName':p['projectName']}))
        links.append(feature({'type':'LineString','coordinates':[[p['longitude'],p['latitude']],[a['centroidLongitude'],a['centroidLatitude']]]},m))
    matched_projects=[f for f in points if f['properties']['matchedAssetSiteIds']]
    layers={'project_registry_points':points,'observed_assets':observed,'matched_projects':matched_projects,'matched_assets':linked_assets,'match_links':links}
    summary=[]
    for name,features in layers.items():
        (OUTPUT_DIR/f'{name}.geojson').write_text(json.dumps({'type':'FeatureCollection','features':features},separators=(',',':'),ensure_ascii=True)+'\n')
        rows=[]
        for f in features:
            props={k:(json.dumps(v,sort_keys=True) if isinstance(v,(list,dict)) else v) for k,v in f['properties'].items() if k not in ('geometry','matchedAssetGeometry','matchedAssetGeometries')}
            rows.append({**props,'geometry':shape(f['geometry'])})
        gdf=gpd.GeoDataFrame(rows,geometry='geometry',crs='EPSG:4326') if rows else gpd.GeoDataFrame({'geometry':[]},geometry='geometry',crs='EPSG:4326')
        gdf.to_parquet(OUTPUT_DIR/f'{name}.parquet',index=False)
        summary.append({'name':name,'recordCount':len(features),'geojson':f'data/processed/geospatial/{name}.geojson','parquet':f'data/processed/geospatial/{name}.parquet'})
    write_json(OUTPUT_DIR/'summary.json',{'datasetVersion':read_json(ROOT/'data/processed/frontend_dataset.json')['releaseMetadata']['datasetVersion'],'layers':summary})
    print('Geospatial exports rebuilt from active reviewed evidence')
if __name__=='__main__':main()
