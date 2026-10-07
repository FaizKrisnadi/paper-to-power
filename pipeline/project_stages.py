"""Reported development stage, independent of observation review eligibility."""
STAGES={'operating','construction','pre-construction','announced','shelved','cancelled','mothballed','retired'}
def normalize_stage(value):
    raw=str(value or '').strip().lower()
    return raw if raw in STAGES else 'other'

def stage_evidence(record):
    provider=record.get('providerSnapshot')
    related=record.get('relatedProviderRecords',[]) if record.get('reconciliation',{}).get('outcome')=='phase_group' else []
    if provider:
        return {'projectStage':normalize_stage(provider['status']),'projectStageRaw':provider['status'],'projectStageSource':'GEM September 2026 map','projectStageSourceUrl':provider['url']}
    if related:
        stages={normalize_stage(p['status']) for p in related}
        return {'projectStage':next(iter(stages)) if len(stages)==1 else 'mixed_stage','projectStageRaw':' / '.join(sorted({p['status'] for p in related})),'projectStageSource':'GEM September 2026 related phases','projectStageSourceUrl':related[0]['url']}
    return {'projectStage':normalize_stage(record.get('claimedStatus')),'projectStageRaw':record.get('claimedStatus'),'projectStageSource':'Retained research claim; provider identity unresolved','projectStageSourceUrl':record.get('sourcePrimaryUrl')}
