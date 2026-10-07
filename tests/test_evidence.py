from datetime import date
import pytest
from pipeline.evidence import assess_project, date_interval, eligibility_reasons, summarize
from pipeline.match_projects import build_candidate, reviewed_matches, project_fingerprint, asset_fingerprint
from pipeline.refresh_registry import build_registry


def project(**overrides):
    return {'projectId':'p1','projectName':'Solar phase 1','countryCode':'IDN','technology':'solar',
            'latitude':-6.7,'longitude':107.3,'installationType':'onshore','coordinateAccuracy':'site',
            'expectedOperatingDate':'2020-06','claimReviewStatus':'reviewed','observationReviewComplete':True,
            **overrides}


def asset(**overrides):
    return {'siteId':'a1','countryCode':'IDN','technology':'solar','centroidLatitude':-6.7,'centroidLongitude':107.3,
            'observedFirstSeenQuarter':'2020 Q2','observedLatestQuarter':'2024 Q2','geometry':{'type':'Point','coordinates':[107.3,-6.7]},**overrides}


@pytest.mark.parametrize('value', ['2024-02-30','2024-13','2024 Q5','2025-2020','2024-06 junk','unknown'])
def test_invalid_dates_never_become_schedule_baselines(value):
    assert date_interval(value) is None


def test_imprecise_date_preserves_latest_possible_completion():
    assert date_interval('2024')==(date(2024,1,1),date(2024,12,31))
    assert date_interval('2025-2030')[1]==date(2030,12,31)
    assert any('after the observation cutoff' in r for r in eligibility_reasons(project(expectedOperatingDate='2024')))


@pytest.mark.parametrize('overrides,status', [({'countryCode':'LAO'},'coverage_unavailable'),
    ({'installationType':'offshore'},'method_not_applicable'),({'technology':'mixed'},'method_not_applicable'),
    ({'expectedOperatingDate':'2032-04'},'not_yet_due_at_cutoff'),({'coordinateAccuracy':'representative'},'review_pending'),
    ({'expectedOperatingDate':None},'review_pending'),({'claimReviewStatus':'pending'},'review_pending'),
    ({'observationReviewComplete':False},'review_pending')])
def test_ineligible_projects_never_enter_non_detection_denominator(overrides,status):
    result=assess_project(project(**overrides),[])
    assert result['observationStatus']==status
    assert result['nonDetectionEligible'] is False


def test_missing_schedule_data_remains_unknown_even_with_approved_footprint():
    result=assess_project(project(expectedOperatingDate=None),[{'siteId':'a1'}])
    assert result['observationStatus']=='observed_footprint'
    assert result['scheduleAssessment']=='not_assessable'


def test_zero_eligible_denominator_is_null_not_zero_percent():
    p=project(countryCode='LAO');row={**p,**assess_project(p,[])}
    assert summarize([row])['notDetectedShare'] is None


def test_denominator_counts_eligible_projects_only():
    rows=[]
    for p in [project(),project(projectId='p2',countryCode='LAO')]:rows.append({**p,**assess_project(p,[])})
    result=summarize(rows)
    assert result['eligibleProjectCount']==1 and result['notDetectedCount']==1
    assert result['notDetectedShare']==1


def test_offshore_cannot_match_onshore_assets():
    assert build_candidate(project(installationType='offshore'),asset()) is None


def test_capacity_proxy_does_not_change_candidate_or_create_a_verdict():
    assert build_candidate(project(),asset(estimatedCapacityProxyMw=0.1))==build_candidate(project(),asset(estimatedCapacityProxyMw=1000))


def review(p,a,status='approved'):
    return {'projectId':p['projectId'],'siteId':a['siteId'],'status':status,'reviewer':'fixture',
            'reviewedAt':'2026-10-05','reason':'Fixture known geometry','evidenceUrls':['https://example.org/source'],
            'projectFingerprint':project_fingerprint(p),'assetFingerprint':asset_fingerprint(a)}


def test_candidates_are_unpublished_until_reviewed_and_can_bundle_multiple_assets():
    p=project();assets=[asset(),asset(siteId='a2')]
    candidates=[{'projectId':'p1','siteId':a['siteId'],'distanceKm':0} for a in assets]
    assert reviewed_matches([p],assets,candidates,[])==[]
    matches=reviewed_matches([p],assets,candidates,[review(p,a) for a in assets])
    assert len(matches)==2 and all(m['reviewStatus']=='approved' for m in matches)


def test_rejected_candidate_remains_rejected():
    p=project();a=asset();cs=[{'projectId':'p1','siteId':'a1'}]
    assert reviewed_matches([p],[a],cs,[review(p,a,'rejected')])==[]


def test_stale_review_cannot_survive_location_change():
    p=project();a=asset();r=review(p,a)
    with pytest.raises(ValueError,match='stale'):
        reviewed_matches([project(longitude=107.31)],[a],[{'projectId':'p1','siteId':'a1'}],[r])


def test_one_asset_cannot_be_silently_double_counted():
    p=project();q=project(projectId='p2');a=asset()
    cs=[{'projectId':x['projectId'],'siteId':'a1'} for x in [p,q]]
    with pytest.raises(ValueError,match='multiple project phases'):
        reviewed_matches([p,q],[a],cs,[review(p,a),review(q,a)])


def test_duplicate_resolution_preserves_alias_without_inflating_population():
    rows=[project(),project(projectId='alias')]
    data=build_registry(rows,{'duplicateAliases':{'alias':{'canonicalProjectId':'p1','reason':'same plant'}}})
    assert len(data['records'])==1
    assert data['records'][0]['aliasProjectIds']==['alias']


def test_changed_attribution_reference_invalidates_an_approved_match():
    from pipeline.match_projects import reference_fingerprint
    p=project();a=asset();r=review(p,a)
    f={'id':'ref','geometry':a['geometry'],'properties':{'sourceUrl':'https://example.org/source'}}
    r.update(referenceFeatureId='ref',referenceFingerprint=reference_fingerprint(f))
    assert reviewed_matches([p],[a],[{'projectId':'p1','siteId':'a1'}],[r],[f])
    changed={**f,'geometry':{'type':'Point','coordinates':[107.31,-6.7]}}
    with pytest.raises(ValueError,match='reference is stale'):
        reviewed_matches([p],[a],[{'projectId':'p1','siteId':'a1'}],[r],[changed])
