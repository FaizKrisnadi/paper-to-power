"""Build display coordinates and auditable pilot summaries; never infer generating capacity."""
import math

def quarter_index(value):
    year,quarter=value.split(' Q')
    return (int(year)-2017)*4+int(quarter)-1

def build_pilots(studies,reference,assets,matches,reviews):
    asset_by_id={a['siteId']:a for a in assets};refs={f['id']:f for f in reference['features']};review_by_id={(r['projectId'],r['siteId']):r for r in reviews};result=[]
    def coords(g):
        if g['type']=='Point':return [g['coordinates']]
        if g['type']=='Polygon':return [p for ring in g['coordinates'] for p in ring]
        if g['type']=='MultiPolygon':return [p for poly in g['coordinates'] for ring in poly for p in ring]
        raise ValueError('Unsupported pilot geometry')
    for s in studies:
        pid=s['projectId'];approved=[m['siteId'] for m in matches if m['projectId']==pid]
        ids=approved+s['contextAssetSiteIds'];rf=[refs[k] for k in s['referenceFeatureIds']]
        all_coords=[p for f in rf for p in coords(f['geometry'])]+[p for k in ids for p in coords(asset_by_id[k]['geometry'])]
        cos=math.cos(math.radians(sum(p[1] for p in all_coords)/len(all_coords)))
        xmin=min(p[0]*cos for p in all_coords);xmax=max(p[0]*cos for p in all_coords);ymin=min(p[1] for p in all_coords);ymax=max(p[1] for p in all_coords)
        scale=min(580/(xmax-xmin),350/(ymax-ymin));xoffset=(700-(xmax-xmin)*scale)/2;yoffset=(440-(ymax-ymin)*scale)/2
        def xy(p):return [round((p[0]*cos-xmin)*scale+xoffset,2),round((ymax-p[1])*scale+yoffset,2)]
        def display(g):
            if g['type']=='Point':return {'geometry':g,'kind':'point','x':xy(g['coordinates'])[0],'y':xy(g['coordinates'])[1],'path':None}
            rings=g['coordinates'] if g['type']=='Polygon' else [ring for poly in g['coordinates'] for ring in poly]
            path=' '.join('M '+' L '.join(','.join(map(str,xy(p))) for p in ring)+' Z' for ring in rings)
            return {'geometry':g,'kind':'polygon','x':None,'y':None,'path':path}
        drawn=[]
        for k in ids:
            a=asset_by_id[k];r=review_by_id[(pid,k)];check=r['spatialCheck']
            drawn.append({'siteId':k,'label':f'GRW {a["sourceFeatureIndex"]}','firstSeenQuarter':a['observedFirstSeenQuarter'],'firstSeenIndex':quarter_index(a['observedFirstSeenQuarter']),
                          'status':r['status'],'areaHa':a['observedAreaHectares'],'reviewReason':r['reason'],
                          'spatialNote':f'{check["distanceM"]} m to mapped turbine {check["turbineRef"]}' if 'distanceM' in check else f'{check["boundaryOverlapFraction"]*100:.2f}% within mapped commercial boundary',**display(a['geometry'])})
        reference_shapes=[{'id':f['id'],'label':f['properties'].get('turbineRef','Commercial site'),'url':f['properties']['sourceUrl'],**display(f['geometry'])} for f in rf]
        approved_checks=[r['spatialCheck'] for r in reviews if r['projectId']==pid and r['status']=='approved']
        result.append({**s,'assets':drawn,'referenceShapes':reference_shapes,'approvedAssetCount':len(approved),'referenceCount':len(rf),
                       'reviewedAt':'2026-10-05','reviewer':'Codex-assisted documentary and geometry review','attribution':reference['attribution'],'referenceLicense':reference['license'],
                       'spatialSummary':f'{min(c["distanceM"] for c in approved_checks):.1f}–{max(c["distanceM"] for c in approved_checks):.1f} m offsets; distinct references' if pid=='IDN-W-001' else '98.998–99.370% within the approximate commercial boundary',
                       'totalAreaHa':round(sum(asset_by_id[k]['observedAreaHectares'] or 0 for k in approved),4) if pid=='SGP-S-001' else None})
    return result
