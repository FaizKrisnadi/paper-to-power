"""Fail the release when evidence semantics, provenance or generated outputs drift."""
from __future__ import annotations
import csv, hashlib, json
from pathlib import Path
from .evidence import summarize
ROOT=Path(__file__).resolve().parent.parent

def validate(root: Path = ROOT) -> list[str]:
    errors=[]
    data=json.loads((root/'data/processed/frontend_dataset.json').read_text());rows=data['registryMapProjects'];meta=data['releaseMetadata']
    ids=[r['projectId'] for r in rows]
    if len(ids)!=len(set(ids)):errors.append('Duplicate registry IDs')
    if summarize(rows)['notDetectedShare']!=meta['notDetectedShare']:errors.append('Non-detection denominator mismatch')
    for p in rows:
        pid=p['projectId']
        if p['observationStatus']=='not_detected_by_cutoff' and not p['nonDetectionEligible']:errors.append(f'Ineligible non-detection: {pid}')
        if p['observedCapacityMw'] is not None:errors.append(f'Unsupported observed capacity: {pid}')
        if p['matchedAssetSiteIds'] and p['matchReviewStatus']!='approved':errors.append(f'Unreviewed attribution: {pid}')
        if p['claimReviewStatus']=='reviewed' and not (p['claimCheckedAt'] and p['claimSources']):errors.append(f'Missing reviewed-claim provenance: {pid}')
        if p['scheduleAssessment']!='not_assessable':errors.append(f'Unsupported schedule verdict: {pid}')
        if p['gridEvidenceClass'] not in {'not_assessed','infrastructure_nearby','proximity_not_found'}:errors.append(f'Unsupported grid verdict: {pid}')
    manifest=json.loads((root/'data/processed/release_manifest.json').read_text())
    for group in ('inputs','outputs'):
        for name,expected in manifest[group].items():
            path=root/name
            if not path.exists() or hashlib.sha256(path.read_bytes()).hexdigest()!=expected:errors.append(f'Stale or missing artifact: {name}')
    download=json.loads((root/'public/downloads/project-evidence.json').read_text())
    if download!=data:errors.append('JSON download differs from frontend evidence')
    csv_rows=list(csv.DictReader((root/'public/downloads/project-evidence.csv').open()))
    if [r['projectId'] for r in csv_rows]!=ids:errors.append('CSV project population differs from frontend')
    registry=json.loads((root/'data/processed/project_registry.json').read_text())['records']
    if {r['projectId'] for r in registry}!=set(ids):errors.append('Registry/frontend population mismatch')
    geopath=root/'data/processed/geospatial/summary.json'
    if geopath.exists():
        geo=json.loads(geopath.read_text())
        if geo.get('datasetVersion')!=meta['datasetVersion']:errors.append('Geospatial outputs are from a different release; run export:geospatial')
        else:
            for layer in geo['layers']:
                features=json.loads((root/layer['geojson']).read_text())['features']
                if len(features)!=layer['recordCount']:errors.append(f'Geospatial count drift: {layer["name"]}')
                if layer['name']=='project_registry_points' and {f['properties']['projectId'] for f in features}!=set(ids):errors.append('Geospatial registry differs from active registry')
    return errors

def main():
    errors=validate()
    if errors:raise SystemExit('\n'.join(errors))
    print('Release validation passed: semantics, provenance, denominators, downloads and hashes')
if __name__=='__main__':main()
