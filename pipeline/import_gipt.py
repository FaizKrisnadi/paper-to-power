"""Import GEM's public September 2026 map rows, retaining provider unit/phase grain.

The map CSV is a public derivative, not the full downloadable workbook. No
provider record is promoted to a Paper to Power documentary or site review.
"""
from __future__ import annotations
import csv, hashlib, math
from collections import Counter
from pathlib import Path
from .io import read_json, write_json
ROOT=Path(__file__).resolve().parent.parent
SOURCE_URL='https://publicgemdata.nyc3.cdn.digitaloceanspaces.com/Current_maps/integrated-power/2026-09/integrated_map_2026-09.csv'
RAW=ROOT/'data/raw/gem/gipt-sea-map-2026-09.csv'
META=ROOT/'data/raw/gem/gipt-sea-map-2026-09.provenance.json'
CROSSWALK=ROOT/'data/manual/gipt_crosswalk.json'
RECONCILIATION=ROOT/'data/manual/gipt_reconciliation.json'
COUNTRIES={'Brunei':'BRN','Cambodia':'KHM','Indonesia':'IDN','Laos':'LAO','Malaysia':'MYS','Myanmar':'MMR','Philippines':'PHL','Singapore':'SGP','Thailand':'THA','Vietnam':'VNM','Timor-Leste':'TLS'}
TECH={'utility-scale solar':'solar','wind':'wind','hydropower':'hydro','geothermal':'geothermal','bioenergy':'bioenergy'}

def extract(source: Path):
    data=source.read_bytes()
    with source.open(newline='',encoding='utf-8-sig') as f:
        reader=csv.DictReader(f); fields=reader.fieldnames
        rows=[r for r in reader if r['country-area1'] in COUNTRIES and r['asset-type'] in TECH]
    RAW.parent.mkdir(parents=True,exist_ok=True)
    with RAW.open('w',newline='') as f:
        writer=csv.DictWriter(f,fieldnames=fields,lineterminator='\n');writer.writeheader();writer.writerows(rows)
    write_json(META,{'sourceUrl':SOURCE_URL,'publisher':'Global Energy Monitor','release':'2026-09','retrievedAt':'2026-10-07','sourceLastModified':'2026-09-24T11:20:47Z','sourceSha256':hashlib.sha256(data).hexdigest(),'regionalSha256':hashlib.sha256(RAW.read_bytes()).hexdigest(),'sourceKind':'Official public tracker map CSV derivative; not the full workbook','selection':'country-area1 in eleven Southeast Asian countries; solar, wind, hydropower, geothermal, bioenergy','rowCount':len(rows),'grain':'Provider unit / phase, not unique power station','license':'GEM CC BY 4.0; see DATA-LICENSE.md'})

def combine(legacy: list[dict]) -> tuple[list[dict],dict]:
    meta=read_json(META)
    if hashlib.sha256(RAW.read_bytes()).hexdigest()!=meta['regionalSha256']:raise ValueError('GIPT raw snapshot hash mismatch')
    links=read_json(CROSSWALK)['links']; by_id={p['projectId']:p for p in legacy}
    with RAW.open(newline='') as f: raw=list(csv.DictReader(f))
    ids=[r['unit-id'] for r in raw]
    if any(not i for i in ids) or len(set(ids))!=len(ids):raise ValueError('Missing or duplicate provider unit IDs')
    if len(set(links.values()))!=len(links):raise ValueError('Crosswalk must be one-to-one')
    if set(links)-set(ids) or set(links.values())-set(by_id):raise ValueError('Crosswalk points to missing record')
    decisions=read_json(RECONCILIATION)['decisions']
    raw_by_unit={r['unit-id']:r for r in raw}
    decision_by_id={d['projectId']:d for d in decisions}
    if len(decision_by_id)!=len(decisions) or set(decision_by_id)-set(by_id):raise ValueError('Invalid reconciliation project IDs')
    for d in decisions:
        if d['outcome'] not in {'same_unit','phase_group','unresolved'} or not d.get('reason') or not d.get('evidenceUrls'):raise ValueError('Incomplete reconciliation decision')
        if set(d['providerUnitIds'])-set(ids):raise ValueError('Reconciliation points to missing provider unit')
        if len(set(d['providerUnitIds']))!=len(d['providerUnitIds']):raise ValueError('Duplicate unit within reconciliation decision')
        if any(COUNTRIES[raw_by_unit[u]['country-area1']]!=by_id[d['projectId']]['countryCode'] for u in d['providerUnitIds']):raise ValueError('Reconciliation country mismatch')
        if d['outcome']=='unresolved' and d['providerUnitIds']:raise ValueError('Unresolved identity cannot assert provider links')
        if d['outcome']=='same_unit' and (len(d['providerUnitIds'])!=1 or links.get(d['providerUnitIds'][0])!=d['projectId']):raise ValueError('Crosswalk and reconciliation disagree')
        if d['outcome']=='phase_group' and len(d['providerUnitIds'])<2:raise ValueError('A phase group needs multiple phases')
    out=[]; linked=[];snapshots={}
    for n,r in enumerate(raw,2):
        latitude=float(r['Latitude']);longitude=float(r['Longitude']);cap=float(r['capacity']) if r['capacity'] else None
        if not (math.isfinite(latitude) and math.isfinite(longitude) and -90<=latitude<=90 and -180<=longitude<=180):raise ValueError('Invalid coordinates')
        if cap is not None and (not math.isfinite(cap) or cap<0):raise ValueError('Invalid capacity')
        technology=TECH[r['asset-type']]
        if technology=='hydro' and 'pumped' in r['tech-type'].lower():technology='pumped_storage'
        snapshot={'unitId':r['unit-id'],'plantId':r['project-id'],'name':r['name'],'phase':r['unit-name'] or None,'capacityMw':cap,'status':r['status'],'startYear':r['start-year'] or None,'technologyDetail':r['tech-type'],'fuel':r['fuel'],'locationAccuracy':r['location-accuracy'],'url':r['url'],'release':'2026-09'}
        snapshots[r['unit-id']]=snapshot
        if r['unit-id'] in links:
            old=dict(by_id[links[r['unit-id']]])
            if old['countryCode']!=COUNTRIES[r['country-area1']]:raise ValueError('Crosswalk country mismatch')
            old.update(providerSnapshot=snapshot,providerUnitId=r['unit-id'],providerPlantId=r['project-id'],registryOrigin='research_with_provider_link',registryRelease='2026-09')
            linked.append({'legacyId':old['projectId'],'providerUnitId':r['unit-id'],'legacyCapacityMw':old['claimedCapacityMw'],'providerCapacityMw':cap,'legacyStatus':old['claimedStatus'],'providerStatus':r['status']})
            out.append(old);continue
        pid='GEM-'+r['unit-id'];phase=r['unit-name'] or None
        out.append({'projectId':pid,'projectPhaseId':pid,'projectName':r['name']+(f' · {phase}' if phase else ''),'phaseName':phase,'countryCode':COUNTRIES[r['country-area1']],'countryName':r['country-area1'],'technology':technology,'claimedCapacityMw':cap,'capacityBasis':'MW (GEM map)','claimedStatus':r['status'],'claimedCod':None,'expectedOperatingDate':None,'reportedOperatingDate':r['start-year'] or None if r['status']=='operating' else None,'developer':None,'owner':r['owner'] or None,'locationText':r['location-display'] or None,'provinceStateRegion':r['subnational'] or None,'latitude':latitude,'longitude':longitude,'coordinateAccuracy':'provider_exact' if r['location-accuracy']=='exact' else 'representative','installationType':'offshore' if 'offshore' in r['tech-type'].lower() else 'onshore','gemId':r['unit-id'],'providerUnitId':r['unit-id'],'providerPlantId':r['project-id'],'providerSnapshot':snapshot,'registryOrigin':'gem_map','registryRelease':'2026-09','sourceDataset':'GEM GIPT public map September 2026','sourceFile':RAW.name,'sourceRowNumber':n,'sourcePrimaryUrl':r['url'] or SOURCE_URL,'sourcePrimaryType':'GEM provider record','sourcePublishedAt':None,'sourcePrimaryDate':None,'sourceConfidence':None,'sourceAccessCheckedAt':meta['retrievedAt'],'sourceAccessResult':'Provider map CSV retrieved; linked wiki not individually checked','claimReviewStatus':'pending','claimCheckedAt':None,'claimSources':[],'reviewStatus':'pending','observationReviewComplete':False,'reviewNotes':'Imported provider unit/phase. Independent documentary and site reviews pending. Start year is provider reporting; source publication date is not supplied.','conflicts':[],'aliasProjectIds':[],'dataQualityFlags':None})
    unmatched=[p for p in legacy if p['projectId'] not in links.values()]
    for p in unmatched:out.append({**p,'registryOrigin':'research_supplement','registryRelease':None})
    from .project_stages import stage_evidence
    legacy_by_unit={u:pid for u,pid in links.items()}
    for p in out:
        d=decision_by_id.get(p['projectId'])
        if d:
            p['reconciliation']=d
            if d['outcome']=='phase_group':
                p['recordScope']='project_overview'
                p['relatedProviderRecords']=[{**snapshots[u],'projectId':legacy_by_unit.get(u,'GEM-'+u)} for u in d['providerUnitIds']]
            else:p['recordScope']='unit_phase' if d['outcome']=='same_unit' else 'unresolved_research'
        else:p['recordScope']='unit_phase'
        p.update(stage_evidence(p))
        if p.get('providerSnapshot'):
            snap=p['providerSnapshot'];disagreements=[]
            if p.get('registryOrigin')=='research_with_provider_link':
                if p.get('claimedCapacityMw')!=snap['capacityMw']:disagreements.append('Research and provider capacities differ; original units and scopes must be checked before comparing MW.')
                if p.get('claimedStatus')!=snap['status']:disagreements.append('Research and provider stage descriptions differ; both are retained with their source context.')
            p['providerDiscrepancies']=disagreements
    report={'providerRelease':'2026-09','providerRows':len(raw),'providerPlantIds':len({r['project-id'] for r in raw}),'linkedLegacyRecords':len(linked),'supplementalResearchRecords':len(unmatched),'activeRecordCount':len(out),'manualClaimsReviewed':sum(p['claimReviewStatus']=='reviewed' for p in out),'countries':dict(sorted(Counter(r['country-area1'] for r in raw).items())),'technologies':dict(sorted(Counter(p['technology'] for p in out if p.get('providerUnitId')).items())),'crosswalk':linked,'unlinkedResearchIds':[p['projectId'] for p in unmatched],'reconciliationSummary':dict(sorted(Counter(d['outcome'] for d in decisions).items())),'reconciliationDecisions':decisions,'projectOverviewCount':sum(p['recordScope']=='project_overview' for p in out),'unresolvedIdentityCount':sum(p['recordScope']=='unresolved_research' for p in out),'stageCounts':dict(sorted(Counter(p['projectStage'] for p in out).items())),'notes':['Counts describe provider units/phases plus retained research supplements, not unique plants.','Unlinked research records may overlap provider records; no regional MW total is calculated.','Pumped storage is a separate technology. Bioenergy fuel composition is retained; entire unit capacity is not asserted to be renewable.','Provider exact coordinates are not promoted to independently checked site accuracy.','Imported rows are not independent documentary reviews. Existing claim values and attribution fingerprints remain unchanged.']}
    return out,report

if __name__=='__main__':
    import argparse
    p=argparse.ArgumentParser();p.add_argument('--extract',type=Path,required=True);a=p.parse_args();extract(a.extract)
