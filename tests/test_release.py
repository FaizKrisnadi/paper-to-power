import json
from pathlib import Path
from pipeline.build_frontend_exports import build_payload,csv_text,render_ts_module
from pipeline.validate_release import validate
ROOT=Path(__file__).resolve().parents[1]


def test_release_semantics_and_cross_output_consistency():
    assert validate()==[]


def test_frontend_is_a_deterministic_rebuild_of_reviewed_inputs():
    payload=build_payload()
    assert payload==json.loads((ROOT/'data/processed/frontend_dataset.json').read_text())
    assert render_ts_module(payload)==(ROOT/'src/data/generated.ts').read_text()


def test_downloads_keep_null_capacity_unknown_and_do_not_repeat_legacy_verdicts():
    data=build_payload()
    assert len(data['registryMapProjects'])==5136
    assert all(p['observedCapacityMw'] is None for p in data['registryMapProjects'])
    assert all(p['paperToPowerLabel'] not in {'claimed_not_observed','observed_on_schedule','observed_delayed','observed_smaller_than_claimed'} for p in data['registryMapProjects'])
    assert data['releaseMetadata']['notDetectedShare'] is None


def test_csv_protects_formula_like_source_fields():
    text=csv_text([{'projectId':'id','projectName':'=malicious()'}])
    assert "'=malicious()" in text


def test_soft_404_is_not_a_verified_claim():
    rows=build_payload()['registryMapProjects']
    assert all(p['claimReviewStatus']!='reviewed' for p in rows if p.get('sourceAccessResult')=='soft_404')


def test_geoparquet_registry_and_context_follow_the_active_population():
    import geopandas as gpd
    expected={p['projectId'] for p in build_payload()['registryMapProjects']}
    for name in ('project_registry_points','site_context_features'):
        frame=gpd.read_parquet(ROOT/f'data/processed/geospatial/{name}.parquet')
        assert set(frame.projectId)==expected
        assert len(frame)==len(expected)
    for name,count in [('matched_assets',30),('matched_projects',2),('match_links',30)]:
        assert len(gpd.read_parquet(ROOT/f'data/processed/geospatial/{name}.parquet'))==count


def test_warehouse_cannot_retain_old_scores_or_a_different_project_population():
    import duckdb
    with duckdb.connect(str(ROOT/'data/processed/geospatial/paper_to_power.duckdb'),read_only=True) as con:
        expected={p['projectId'] for p in build_payload()['registryMapProjects']}
        assert {r[0] for r in con.execute('SELECT projectId FROM marts.site_audit').fetchall()}==expected
        assert con.execute('SELECT count(*) FROM core.project_registry').fetchone()[0]==len(expected)
        assert con.execute('SELECT count(*) FROM core.observed_assets').fetchone()[0]==2311
        assert con.execute("SELECT count(*) FROM marts.site_audit WHERE observedCapacityMw IS NOT NULL OR scheduleAssessment != 'not_assessable'").fetchone()[0]==0


def test_pilot_partial_attributions_keep_capacity_and_missing_geometry_unknown():
    rows={p['projectId']:p for p in build_payload()['registryMapProjects']}
    solar,wind=rows['SGP-S-001'],rows['IDN-W-001']
    assert solar['observedAssetCount']==3
    assert solar['observedAreaHectares']==10.4361
    assert wind['observedAssetCount']==27
    assert wind['observedAreaHectares'] is None
    assert solar['observedCapacityMw'] is wind['observedCapacityMw'] is None
    assert all(p['observationExtent']=='partial' and not p['nonDetectionEligible'] for p in (solar,wind))
    assert all(p['scheduleAssessment']=='not_assessable' for p in (solar,wind))


def test_tengeh_earlier_polygon_cannot_substitute_for_the_commercial_phase():
    reviews=json.loads((ROOT/'data/manual/match_reviews.json').read_text())['reviews']
    older=next(r for r in reviews if r['projectId']=='SGP-S-001' and r['spatialCheck']['sourceFeatureIndex']==5)
    assert older['status']=='rejected'
    assert older['spatialCheck']['boundaryOverlapFraction']==0
    assert older['spatialCheck']['firstSeen']=='2018 Q3'


def test_sidrap_attributions_are_distinct_and_corroborated_at_turbine_scale():
    reviews=json.loads((ROOT/'data/manual/match_reviews.json').read_text())['reviews']
    checks=[r['spatialCheck'] for r in reviews if r['projectId']=='IDN-W-001' and r['status']=='approved']
    assert len(checks)==len({c['nearestOsmNodeId'] for c in checks})==27
    assert max(c['distanceM'] for c in checks)<60
    assert {'19','24','27'}.isdisjoint({c['turbineRef'] for c in checks})
    assert any(c['firstSeen']>'2018 Q2' for c in checks)


def test_spatial_evidence_can_be_recomputed_from_preserved_reference_geometry():
    import geopandas as gpd
    from shapely.geometry import shape
    from pipeline.geo import haversine_km
    reference=json.loads((ROOT/'data/manual/pilot_reference_features.geojson').read_text())
    refs={f['id']:f for f in reference['features']}
    assets={a['siteId']:a for a in json.loads((ROOT/'data/processed/observed_assets.json').read_text())['records']}
    reviews=json.loads((ROOT/'data/manual/match_reviews.json').read_text())['reviews']
    for r in reviews:
        if r['status']!='approved':continue
        a=assets[r['siteId']];f=refs[r['referenceFeatureId']];check=r['spatialCheck']
        if f['geometry']['type']=='Point':
            lon,lat=f['geometry']['coordinates']
            distance=haversine_km(lat,lon,a['centroidLatitude'],a['centroidLongitude'])*1000
            assert abs(distance-check['distanceM'])<0.1
        else:
            geometry=gpd.GeoSeries([shape(a['geometry']),shape(f['geometry'])],crs='EPSG:4326').to_crs('EPSG:32648')
            fraction=geometry[0].intersection(geometry[1]).area/geometry[0].area
            assert fraction>0.98
            assert abs(fraction-check['boundaryOverlapFraction'])<0.0001


def test_reviewed_candidates_do_not_remain_in_the_pending_queue():
    rows=build_payload()['registryMapProjects']
    assert sum(p['approvedMatchCount'] for p in rows)==30
    assert sum(p['rejectedCandidateCount'] for p in rows)==5
    legacy_ids={r['projectId'] for r in json.loads((ROOT/'data/manual/registry_baseline.json').read_text())['records']}
    assert sum(p['pendingCandidateCount'] for p in rows if p['projectId'] in legacy_ids)==279
    candidates=json.loads((ROOT/'data/processed/match_candidates.json').read_text())['candidates']
    assert sum(p['pendingCandidateCount'] for p in rows)==len(candidates)-35
    assert all(p['candidateCount']==p['approvedMatchCount']+p['rejectedCandidateCount']+p['pendingCandidateCount'] for p in rows)
