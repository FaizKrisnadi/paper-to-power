"""Rebuild the active registry from a preserved baseline and explicit documentary reviews."""
from __future__ import annotations
from collections import Counter
from pathlib import Path
from .io import read_json, write_json
ROOT = Path(__file__).resolve().parent.parent
BASELINE = ROOT / 'data/manual/registry_baseline.json'
REVIEWS = ROOT / 'data/manual/registry_reviews.json'
OUTPUT = ROOT / 'data/processed/project_registry.json'

def build_registry(baseline: list[dict], reviews: dict) -> dict:
    exclusions = reviews.get('duplicateAliases', {})
    overrides = reviews.get('projects', {})
    records = []
    for original in baseline:
        pid = original['projectId']
        if pid in exclusions:
            continue
        row = dict(original)
        row.update(projectPhaseId=pid, legacyReviewStatus=original.get('reviewStatus'),legacySourceConfidence=original.get('sourceConfidence'),sourceConfidence=None,claimReviewAttemptedAt=reviews.get('reviewDate'),legacyClaimedCod=original.get('claimedCod'),
                   expectedOperatingDate=None, reportedOperatingDate=None,
                   claimCheckedAt=None, sourcePublishedAt=original.get('sourcePrimaryDate'),
                   claimReviewStatus='pending', coordinateAccuracy='unverified',
                   observationReviewComplete=False, reviewNotes='Legacy claim retained pending documentary verification',
                   capacityBasis='unspecified', claimSources=[], conflicts=[])
        name = str(row['projectName']).lower()
        row['installationType'] = 'offshore' if 'offshore' in name else ('hybrid' if row['technology'] == 'mixed' else ('floating' if 'floating' in name or 'fpv' in name else 'onshore'))
        row.update(overrides.get(pid, {}))
        # claimedCod remains a backward-compatible expected date; historical reporting is separate.
        row['claimedCod'] = row.get('expectedOperatingDate')
        row['reviewStatus'] = row['claimReviewStatus']
        row['sourceConfidence'] = 'documentary source reviewed' if row['claimReviewStatus']=='reviewed' else None
        row['aliasProjectIds'] = [a for a, info in exclusions.items() if info['canonicalProjectId'] == pid]
        records.append(row)
    ids = [r['projectId'] for r in records]
    if len(ids) != len(set(ids)):
        raise ValueError('Registry IDs must be unique')
    for alias, info in exclusions.items():
        if info['canonicalProjectId'] not in ids or alias in ids or not info.get('reason'):
            raise ValueError(f'Invalid duplicate resolution: {alias}')
    country_counts = Counter(r['countryCode'] for r in records)
    return {'summary': {'recordCount': len(records), 'sourceRecordCount': len(baseline),
                        'duplicateAliasCount': len(exclusions),
                        'countries': [{'countryCode': c, 'projectCount': n} for c, n in sorted(country_counts.items())],
                        'reviewedCount': sum(r['claimReviewStatus'] == 'reviewed' for r in records)},
            'duplicateAliases': exclusions, 'records': records}

def main():
    baseline=read_json(BASELINE)['records'];reviews=read_json(REVIEWS)
    payload=build_registry(baseline,reviews)
    from .import_gipt import RAW, combine
    if RAW.exists():
        records, report=combine(payload['records'])
        payload['records']=records
        payload['summary'].update(recordCount=len(records),countries=[{'countryCode':c,'projectCount':n} for c,n in sorted(Counter(p['countryCode'] for p in records).items())])
        write_json(ROOT/'data/processed/registry_refresh_report.json',report)
    write_json(OUTPUT,payload)
    print(f"Registry: {payload['summary']['recordCount']} records, {payload['summary']['duplicateAliasCount']} resolved aliases")
if __name__ == '__main__':main()
