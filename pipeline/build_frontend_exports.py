"""Export one evidence contract for the app, downloads and release manifest."""
from __future__ import annotations
import csv
import hashlib
import io
import json
from pathlib import Path
from typing import Any
from .evidence import COVERED_COUNTRIES, METHOD_VERSION, OBSERVATION_CUTOFF, summarize
from .io import read_json, write_json
from .match_projects import build_labels, project_fingerprint
from .pilot_exports import build_pilots
ROOT=Path(__file__).resolve().parent.parent
PROCESSED_DIR=ROOT/'data/processed'
GENERATED_JSON=PROCESSED_DIR/'frontend_dataset.json'
GENERATED_TS=ROOT/'src/data/generated.ts'
INPUTS=['data/manual/gipt_reconciliation.json','data/raw/gem/gipt-sea-map-2026-09.csv','data/raw/gem/gipt-sea-map-2026-09.provenance.json','data/manual/gipt_crosswalk.json','data/manual/registry_baseline.json','data/raw/grw/solar_sea_2024q2_v1.geojson','data/raw/grw/wind_sea_2024q2_v1.geojson','data/processed/project_registry.json','data/processed/observed_assets.json','data/processed/project_asset_matches.json',
        'data/processed/match_candidates.json','data/manual/registry_reviews.json','data/manual/match_reviews.json','data/processed/geospatial/site_context_features.json','data/manual/pilot_reference_features.geojson','data/manual/pilot_studies.json']

def digest(path: Path) -> str:return hashlib.sha256(path.read_bytes()).hexdigest()

def build_payload() -> dict[str,Any]:
    registry=read_json(PROCESSED_DIR/'project_registry.json');projects=registry['records']
    assets=read_json(PROCESSED_DIR/'observed_assets.json')['records'];asset_by_id={a['siteId']:a for a in assets}
    matches=read_json(PROCESSED_DIR/'project_asset_matches.json')['matches']
    candidates=read_json(PROCESSED_DIR/'match_candidates.json')['candidates']
    labels=build_labels(projects,assets,matches,candidates)
    project_labels={l['projectId']:l for l in labels['projectLabels']}
    contexts=read_json(PROCESSED_DIR/'geospatial/site_context_features.json')
    context_rows=contexts.get('records',[]) if isinstance(contexts,dict) else []
    contexts_by_id={c['projectId']:c for c in context_rows if 'projectFingerprint' in c}
    rows=[]
    for p in projects:
        ms=[m for m in matches if m['projectId']==p['projectId']]
        selected=[asset_by_id[m['siteId']] for m in ms]
        selected.sort(key=lambda a:a['siteId'])
        geometries=[a['geometry'] for a in selected if a.get('geometry')]
        first=min((a['observedFirstSeenQuarter'] for a in selected if a.get('observedFirstSeenQuarter')),default=None)
        # Do not collapse estimates, turbine points, or partial footprints into measured capacity.
        row={**p,**project_labels[p['projectId']],
             'observedCapacityMw':None,'observedAssetCount':len(selected) if selected else None,
             'observedAreaHectares':round(sum(a['observedAreaHectares'] for a in selected if a.get('observedAreaHectares') is not None),4) if any(a.get('observedAreaHectares') is not None for a in selected) else None,
             'observationExtent':p.get('observationExtent','unknown'),
             'attributionReviews':[m['review'] for m in ms],
             'observedFirstSeenQuarter':first,
             'matchConfidence':None,'distanceKm':min((m['distanceKm'] for m in ms),default=None),
             'matchedAssetSiteId':selected[0]['siteId'] if selected else None,
             'matchedAssetSiteIds':[a['siteId'] for a in selected],
             'matchedAssetGeometry':geometries[0] if geometries else None,'matchedAssetGeometries':geometries,
             'matchedAssetCentroidLatitude':selected[0]['centroidLatitude'] if selected else None,
             'matchedAssetCentroidLongitude':selected[0]['centroidLongitude'] if selected else None,
             'gridEvidenceClass':'not_assessed','gridEvidenceReason':'Saved OSM context has not been reconciled with this release; infrastructure proximity does not establish connection or deliverability.',
             'gridContextScore':None,'gridMetadataScore':None,'maxNearbyGridVoltageKv':None,
             'nearestSiteSideGridDistanceKm':None,'directConnectedSubstationCount':None,'directConnectedTransmissionCount':None}
        context=contexts_by_id.get(p['projectId'])
        if context and context.get('projectFingerprint')==project_fingerprint(p):
            for key in ('gridEvidenceClass','gridEvidenceReason','nearestSiteSideGridDistanceKm','contextSnapshotDate','contextFeatureCount'):
                row[key]=context[key]
        rows.append(row)
    rows.sort(key=lambda p:(p['countryCode'],p['projectName']))
    countries=[]
    for code in sorted({p['countryCode'] for p in rows}):
        group=[p for p in rows if p['countryCode']==code];s=summarize(group)
        countries.append({'code':code,'name':group[0]['countryName'],'projectCount':len(group),
                          'hasObservedCoverage':code in COVERED_COUNTRIES,
                          'documentaryReviewedCount':s['documentaryReviewedCount'],
                          'approvedFootprintCount':s['approvedFootprintCount'],
                          'eligibleProjectCount':s['eligibleProjectCount'],
                          'notDetectedCount':s['notDetectedCount'],'notDetectedShare':s['notDetectedShare']})
    review=read_json(ROOT/'data/manual/registry_reviews.json')
    meta={**summarize(rows),'releaseDate':'2026-10-07','duplicateAliasCount':registry['summary']['duplicateAliasCount'],
          'datasetVersion':'2026-10-07-stage-reconciled-v1','sourceRefreshStatus':'September 2026 GEM public map imported; independent reviews remain partial',
          'dataLicense':'Third-party terms apply; see DATA-LICENSE.md',
          'inputHashes':{p:digest(ROOT/p) for p in INPUTS},
          'limitations':['Provider units/phases plus retained research supplements; not unique plant counts or a census of all renewables.',
                         'GRW coverage here is the saved five-country extract through 2024 Q2.',
                         'September 2026 GEM public map derivative imported; technology thresholds apply. Pumped storage is separate and bioenergy may include mixed fuels.',
                         'Documentary operation and satellite observation are distinct evidence dimensions.',
                         'AC, DC/peak, unspecified MW and hybrid capacities are not aggregated into one regional total.',
                         'Schedule performance, grid connection and generation output are not established by this observation layer.']}
    sources=[{'id':'gipt','name':'GEM Integrated Power Tracker · September 2026','category':'project-registry','scope':sorted({p['countryCode'] for p in rows}),'url':'https://globalenergymonitor.org/projects/global-integrated-power-tracker','notes':'Official public map CSV, retrieved 7 October 2026. Unit/phase records across eleven Southeast Asian countries; source thresholds apply. Imported records are not independent Paper to Power reviews.'},
             {'id':'osm-pilot','name':'OpenStreetMap attribution references','category':'attribution-reference','scope':['IDN','SGP'],'url':'https://www.openstreetmap.org/copyright','notes':'Bounded site and turbine references fetched 5 October 2026. © OpenStreetMap contributors, ODbL 1.0; approximate community geometry, not a satellite observation or engineering survey.'},
             {'id':'grw','name':'Global Renewables Watch','category':'observed-assets','scope':sorted(COVERED_COUNTRIES),
              'url':'https://github.com/microsoft/global-renewables-watch','notes':'Saved regional observation extract through 2024 Q2. Footprints and turbine points are not verified generating capacity.'},
             {'id':'gem-wiki','name':'GEM Wiki project records','category':'project-registry','scope':sorted({p['countryCode'] for p in rows}),
              'url':'https://www.gem.wiki/Main_Page','notes':'Current candidate records inspected on 5 October 2026. Search hits are not automatically accepted as project identities.'}]
    pilots=build_pilots(read_json(ROOT/'data/manual/pilot_studies.json')['studies'],read_json(ROOT/'data/manual/pilot_reference_features.geojson'),assets,matches,read_json(ROOT/'data/manual/match_reviews.json')['reviews'])
    return {'releaseMetadata':meta,'registryMapProjects':rows,'countrySummaries':countries,'publicSources':sources,'pilotStudies':pilots}

def compact_frontend(payload: dict) -> dict:
    """Factor repeated defaults out of the browser bundle; downloads keep full rows."""
    from collections import Counter
    rows=payload['registryMapProjects']; defaults={}
    for key in sorted(set.intersection(*(set(r) for r in rows))):
        counts=Counter(json.dumps(r[key],sort_keys=True) for r in rows)
        value,count=counts.most_common(1)[0]
        if count>len(rows)*0.9:defaults[key]=json.loads(value)
    compact=[{k:v for k,v in r.items() if k not in defaults or v!=defaults[k]} for r in rows]
    return {**payload,'registryDefaults':defaults,'registryMapProjects':compact}

def render_ts_module(payload: dict) -> str:
    return "import type { RegistryMapProject, CountrySummary, PublicSource, ReleaseMetadata, PilotStudy } from '../types/domain'\nimport rawDataset from './generated.json'\n\nconst dataset = { ...rawDataset, registryMapProjects: rawDataset.registryMapProjects.map(row => ({...rawDataset.registryDefaults,...row})) } as {\n releaseMetadata: ReleaseMetadata\n registryMapProjects: RegistryMapProject[]\n countrySummaries: CountrySummary[]\n publicSources: PublicSource[]\n pilotStudies: PilotStudy[]\n}\n\nexport const { releaseMetadata, registryMapProjects, countrySummaries, publicSources, pilotStudies } = dataset\n"

def csv_text(rows: list[dict]) -> str:
    fields=['projectId','projectName','countryCode','technology','registryOrigin','registryRelease','providerUnitId','providerPlantId','providerSnapshot','recordScope','projectStage','projectStageRaw','projectStageSource','projectStageSourceUrl','reconciliation','relatedProviderRecords','providerDiscrepancies','phaseName','claimedCapacityMw','capacityBasis','claimedStatus',
            'expectedOperatingDate','reportedOperatingDate','claimReviewStatus','claimCheckedAt','sourcePublishedAt','sourcePrimaryUrl',
            'sourceAccessCheckedAt','sourceAccessResult','coordinateAccuracy','observationStatus','observationExtent','observationCutoff','nonDetectionEligible',
            'eligibilityReasons','scheduleAssessment','matchReviewStatus','candidateCount','approvedMatchCount','rejectedCandidateCount','pendingCandidateCount','observedAreaHectares','observedAssetCount','gridEvidenceClass','conflicts','reviewNotes']
    out=io.StringIO(newline='');writer=csv.DictWriter(out,fieldnames=fields,lineterminator='\n');writer.writeheader()
    for p in rows:
        values={k:p.get(k) for k in fields}
        for k,v in values.items():
            if isinstance(v,(list,dict)):values[k]=json.dumps(v,ensure_ascii=False)
            elif isinstance(v,str) and v.startswith(('=','+','-','@')):values[k]="'"+v
        writer.writerow(values)
    return out.getvalue()

def main():
    payload=build_payload();write_json(GENERATED_JSON,payload)
    GENERATED_TS.write_text(render_ts_module(payload))
    write_json(ROOT/'src/data/generated.json',compact_frontend(payload))
    downloads=ROOT/'public/downloads';downloads.mkdir(exist_ok=True)
    write_json(downloads/'project-evidence.json',payload)
    write_json(downloads/'registry-reconciliation.json',read_json(PROCESSED_DIR/'registry_refresh_report.json'))
    (downloads/'project-evidence.csv').write_text(csv_text(payload['registryMapProjects']))
    write_json(downloads/'pilot-attribution-reviews.json',{'reviews':read_json(ROOT/'data/manual/match_reviews.json')['reviews'],'referenceAttribution':'© OpenStreetMap contributors; ODbL 1.0','referenceLicenseUrl':'https://www.openstreetmap.org/copyright'})
    write_json(downloads/'pilot-reference-features.geojson',read_json(ROOT/'data/manual/pilot_reference_features.geojson'))
    manifest={'datasetVersion':payload['releaseMetadata']['datasetVersion'],'methodVersion':METHOD_VERSION,'observationCutoff':OBSERVATION_CUTOFF,
              'projectCount':len(payload['registryMapProjects']),'inputs':payload['releaseMetadata']['inputHashes'],
              'outputs':{str(p.relative_to(ROOT)):digest(p) for p in [GENERATED_JSON,GENERATED_TS,ROOT/'src/data/generated.json',downloads/'project-evidence.json',downloads/'project-evidence.csv',downloads/'pilot-attribution-reviews.json',downloads/'pilot-reference-features.geojson',downloads/'registry-reconciliation.json']}}
    write_json(PROCESSED_DIR/'release_manifest.json',manifest);write_json(downloads/'release-manifest.json',manifest)
    print(f"Exported {len(payload['registryMapProjects'])} projects; denominators and input hashes recorded")
if __name__=='__main__':main()
