"""Generate candidate bundles; only explicit, reproducible reviews become published matches."""
from __future__ import annotations
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Any
from .evidence import assess_project, date_interval, summarize
from .geo import haversine_km
from .io import read_json, write_json
ROOT=Path(__file__).resolve().parent.parent
PROJECT_REGISTRY_PATH=ROOT/'data/processed/project_registry.json'
OBSERVED_ASSETS_PATH=ROOT/'data/processed/observed_assets.json'
PROCESSED_MATCHES_PATH=ROOT/'data/processed/project_asset_matches.json'
PROCESSED_LABELS_PATH=ROOT/'data/processed/paper_to_power_labels.json'
REVIEW_PATH=ROOT/'data/manual/match_reviews.json'

@dataclass(frozen=True)
class MatchCandidate:
    projectId: str
    siteId: str
    matchConfidence: float
    distanceKm: float
    reviewStatus: str = 'pending'

def load_records(path: Path, key: str) -> list[dict[str, Any]]:
    data=read_json(path)
    if not isinstance(data,dict) or not isinstance(data.get(key),list):raise ValueError(f'{path}: expected {key} list')
    return data[key]

def build_candidate(project: dict, asset: dict) -> MatchCandidate | None:
    if project.get('countryCode') != asset.get('countryCode') or project.get('technology') != asset.get('technology'):return None
    if project.get('installationType') in {'offshore','hybrid'}:return None
    if asset.get('installationType') == 'offshore':return None
    coords=[project.get('latitude'),project.get('longitude'),asset.get('centroidLatitude'),asset.get('centroidLongitude')]
    if not all(isinstance(v,(int,float)) for v in coords):return None
    distance=haversine_km(*map(float,coords))
    # A generous screen produces candidates, never an attribution. Regional points need a site review.
    limit=10 if project.get('coordinateAccuracy')=='site' else 30
    if distance > limit:return None
    first=date_interval(asset.get('observedFirstSeenQuarter'));latest=date_interval(asset.get('observedLatestQuarter'))
    if first and latest and first[0] > latest[1]:return None
    return MatchCandidate(project['projectId'],asset['siteId'],round(max(0,1-distance/limit),4),round(distance,3))

def reviewed_matches(projects: list[dict], assets: list[dict], candidates: list[dict], reviews: list[dict], reference_features: list[dict] | None=None) -> list[dict]:
    project_by_id={p['projectId']:p for p in projects};asset_by_id={a['siteId']:a for a in assets}
    candidate_by_key={(c['projectId'],c['siteId']):c for c in candidates}
    seen=set();asset_owners={};matches=[]
    if reference_features is None:
        path=ROOT/'data/manual/pilot_reference_features.geojson'
        reference_features=read_json(path)['features'] if path.exists() else []
    reference_by_id={f['id']:f for f in reference_features}
    for review in reviews:
        key=(review['projectId'],review['siteId'])
        if key in seen:raise ValueError(f'Duplicate match review: {key}')
        seen.add(key)
        if review.get('status') not in {'approved','rejected'}:raise ValueError('Match review must be approved or rejected')
        if not all(review.get(k) for k in ('reviewedAt','reviewer','reason','evidenceUrls')):raise ValueError('Match review requires provenance')
        if review['status']=='rejected':continue
        if key not in candidate_by_key:raise ValueError(f'Approved pair is not an eligible candidate: {key}')
        p=project_by_id[key[0]];a=asset_by_id[key[1]]
        refid=review.get('referenceFeatureId')
        if refid and (refid not in reference_by_id or review.get('referenceFingerprint')!=reference_fingerprint(reference_by_id[refid])):
            raise ValueError(f'Match reference is stale: {key}')
        if review.get('projectFingerprint') != project_fingerprint(p) or review.get('assetFingerprint') != asset_fingerprint(a):
            raise ValueError(f'Match review is stale: {key}')
        if key[1] in asset_owners and asset_owners[key[1]] != key[0]:raise ValueError('One asset cannot be silently attributed to multiple project phases')
        asset_owners[key[1]]=key[0]
        matches.append({**candidate_by_key[key],'matchId':'::'.join(key),'reviewStatus':'approved','review':review,
                        'paperToPowerLabel':'observed_footprint','scheduleVarianceMonths':None,'capacityVarianceMw':None})
    return matches

def project_fingerprint(project: dict) -> str:
    import hashlib,json
    return hashlib.sha256(json.dumps({k:project.get(k) for k in ('projectId','projectName','countryCode','technology','latitude','longitude','installationType','phaseName')},sort_keys=True).encode()).hexdigest()

def reference_fingerprint(feature: dict) -> str:
    import hashlib,json
    return hashlib.sha256(json.dumps(feature,sort_keys=True,separators=(',',':')).encode()).hexdigest()

def asset_fingerprint(asset: dict) -> str:
    import hashlib,json
    return hashlib.sha256(json.dumps({k:asset.get(k) for k in ('siteId','countryCode','technology','geometry','observedFirstSeenQuarter','observedLatestQuarter')},sort_keys=True).encode()).hexdigest()

def build_labels(projects: list[dict], assets: list[dict], matches: list[dict], candidates: list[dict] | None=None) -> dict:
    candidates=candidates or [];labels=[]
    from collections import defaultdict
    candidate_groups=defaultdict(list);match_groups=defaultdict(list)
    for c in candidates:candidate_groups[c['projectId']].append(c)
    for m in matches:match_groups[m['projectId']].append(m)
    for p in projects:
        selected=match_groups[p['projectId']]
        group=candidate_groups[p['projectId']]
        n=len(group)
        labels.append({'projectId':p['projectId'],'countryCode':p['countryCode'],'technology':p['technology'],**assess_project(p,selected,n),
                       'pendingCandidateCount':sum(c.get('reviewStatus','pending')=='pending' for c in group),
                       'rejectedCandidateCount':sum(c.get('reviewStatus')=='rejected' for c in group),'approvedMatchCount':len(selected)})
    joined=[{**p,**l} for p,l in zip(projects,labels)]
    return {'summary':summarize(joined),'projectLabels':labels,
            'assetLabels':[{'siteId':a['siteId'],'countryCode':a['countryCode'],'technology':a['technology'],
                            'paperToPowerLabel':'observed_footprint' if any(m['siteId']==a['siteId'] for m in matches) else 'observed_unmatched'} for a in assets]}

def main():
    projects=load_records(PROJECT_REGISTRY_PATH,'records');assets=load_records(OBSERVED_ASSETS_PATH,'records')
    candidates=[]
    for p in projects:
        for a in assets:
            candidate=build_candidate(p,a)
            if candidate:candidates.append(asdict(candidate))
    candidates.sort(key=lambda c:(c['projectId'],c['distanceKm'],c['siteId']))
    reviews=read_json(REVIEW_PATH).get('reviews',[]) if REVIEW_PATH.exists() else []
    decision_by_key={(r['projectId'],r['siteId']):r['status'] for r in reviews}
    for c in candidates:c['reviewStatus']=decision_by_key.get((c['projectId'],c['siteId']),'pending')
    matches=reviewed_matches(projects,assets,candidates,reviews)
    write_json(ROOT/'data/processed/match_candidates.json',{'candidates':candidates,'reviews':reviews})
    write_json(PROCESSED_MATCHES_PATH,{'summary':{'projectCount':len(projects),'assetCount':len(assets),'matchCount':len(matches)},'matches':matches})
    write_json(PROCESSED_LABELS_PATH,build_labels(projects,assets,matches,candidates))
    print(f'{len(candidates)} candidates; {len(matches)} approved asset attributions')
if __name__=='__main__':main()
