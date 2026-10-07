"""Guard the larger provider population and preserve independent research decisions."""
import csv,json
import pytest
from collections import Counter
from pathlib import Path
from pipeline.import_gipt import combine,RAW,META
from pipeline.refresh_registry import build_registry
from pipeline.evidence import assess_project
from pipeline.match_projects import project_fingerprint
ROOT=Path(__file__).resolve().parents[1]
def load(p):return json.loads((ROOT/p).read_text())

def test_provider_population_is_complete_and_pumped_storage_separate():
    rows=list(csv.DictReader(RAW.open()))
    assert len(rows)==load('data/raw/gem/gipt-sea-map-2026-09.provenance.json')['rowCount']==5118
    assert len({r['unit-id'] for r in rows})==5118
    legacy=build_registry(load('data/manual/registry_baseline.json')['records'],load('data/manual/registry_reviews.json'))['records']
    active,report=combine(legacy)
    assert len(active)==5136 and len({p['projectId'] for p in active})==5136
    assert len({p['countryCode'] for p in active})==11
    assert Counter(p['technology'] for p in active)['pumped_storage']==36
    assert report['linkedLegacyRecords']==32
    assert sum(p['claimReviewStatus']=='reviewed' for p in active)==14
    assert all(p['claimReviewStatus']=='pending' and not p['claimSources'] for p in active if p['registryOrigin']=='gem_map')
    assert all(p['coordinateAccuracy']!='site' for p in active if p['registryOrigin']=='gem_map')

def test_legacy_claims_and_attribution_fingerprints_are_preserved():
    old=build_registry(load('data/manual/registry_baseline.json')['records'],load('data/manual/registry_reviews.json'))['records']
    active,_=combine(old);lookup={p['projectId']:p for p in active}
    for p in old:
        current=lookup[p['projectId']]
        assert project_fingerprint(current)==project_fingerprint(p)
        for key in ('claimSources','claimedCapacityMw','capacityBasis','claimedStatus','claimReviewStatus','claimCheckedAt','expectedOperatingDate','reportedOperatingDate'):
            assert current[key]==p[key]

def test_new_technologies_cannot_be_classified_as_missing_solar_or_wind():
    for technology in ('hydro','pumped_storage','geothermal','bioenergy'):
        p={'technology':technology,'countryCode':'IDN','claimReviewStatus':'reviewed','coordinateAccuracy':'site','observationReviewComplete':True,'expectedOperatingDate':'2020'}
        verdict=assess_project(p,[])
        assert verdict['observationStatus']=='method_not_applicable'
        assert not verdict['nonDetectionEligible']


def test_browser_compaction_restores_the_exact_evidence_contract():
    from pipeline.build_frontend_exports import compact_frontend,build_payload
    full=build_payload();compact=compact_frontend(full)
    assert compact==load('src/data/generated.json')
    restored=[{**compact['registryDefaults'],**r} for r in compact['registryMapProjects']]
    assert restored==full['registryMapProjects']


def test_identity_decisions_preserve_grain_and_do_not_promote_claim_reviews():
    from pipeline.build_frontend_exports import build_payload
    rows=build_payload()['registryMapProjects'];lookup={p['projectId']:p for p in rows}
    decisions=load('data/manual/gipt_reconciliation.json')['decisions']
    assert len(decisions)==32
    assert Counter(d['outcome'] for d in decisions)=={'same_unit':14,'phase_group':8,'unresolved':10}
    provider_ids=[p['providerUnitId'] for p in rows if p.get('providerUnitId')]
    assert len(provider_ids)==len(set(provider_ids))==5118
    for d in decisions:
        p=lookup[d['projectId']]
        if d['outcome']=='same_unit':
            assert p['providerUnitId']==d['providerUnitIds'][0]
            assert 'GEM-'+p['providerUnitId'] not in lookup
        elif d['outcome']=='phase_group':
            assert not p.get('providerUnitId')
            assert p['recordScope']=='project_overview'
            assert {r['unitId'] for r in p['relatedProviderRecords']}==set(d['providerUnitIds'])
            assert all(r['projectId'] in lookup for r in p['relatedProviderRecords'])
        else:
            assert p['recordScope']=='unresolved_research'
            assert not p.get('providerUnitId') and not p.get('relatedProviderRecords')
    assert lookup['LAO-W-ASEAN-003']['projectStage']=='mixed_stage'
    assert lookup['PHL-S-004']['projectStage']=='operating'
    assert lookup['PHL-S-004']['claimedStatus']=='construction'
    assert lookup['SGP-S-ASEAN-002']['projectStage']=='shelved'
    assert lookup['SGP-S-ASEAN-002']['claimedStatus']=='potential development'
    assert lookup['SGP-S-ASEAN-003']['claimedCapacityMw']==86
    assert lookup['SGP-S-ASEAN-003']['providerSnapshot']['capacityMw']==55


def test_stage_normalization_never_guesses_a_legacy_stage():
    from pipeline.project_stages import normalize_stage,stage_evidence
    assert normalize_stage(' OPERATING ')=='operating'
    assert normalize_stage('shortlisted')=='other'
    assert normalize_stage('construction announced')=='other'
    assert stage_evidence({'claimedStatus':'shortlisted'})['projectStage']=='other'


@pytest.mark.parametrize('failure', ['country', 'duplicate', 'unresolved'])
def test_invalid_identity_links_fail_before_export(monkeypatch,tmp_path,failure):
    import pipeline.import_gipt as importer
    decisions=load('data/manual/gipt_reconciliation.json')
    group=next(d for d in decisions['decisions'] if d['outcome']=='phase_group')
    if failure=='country':
        group['providerUnitIds'][0]='G100000901159'
    elif failure=='duplicate':
        group['providerUnitIds'].append(group['providerUnitIds'][0])
    else:
        group['outcome']='unresolved'
    target=tmp_path/'invalid.json';target.write_text(json.dumps(decisions))
    monkeypatch.setattr(importer,'RECONCILIATION',target)
    old=build_registry(load('data/manual/registry_baseline.json')['records'],load('data/manual/registry_reviews.json'))['records']
    with pytest.raises(ValueError,match={'country':'country mismatch','duplicate':'Duplicate unit','unresolved':'Unresolved identity'}[failure]):
        importer.combine(old)
