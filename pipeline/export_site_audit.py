from pathlib import Path
from .build_frontend_exports import csv_text
from .io import read_json,write_json
ROOT=Path(__file__).resolve().parent.parent

def main():
    payload=read_json(ROOT/'data/processed/frontend_dataset.json')
    out=ROOT/'data/processed/geospatial'
    write_json(out/'site_audit_review.json',{'releaseMetadata':payload['releaseMetadata'],'records':payload['registryMapProjects']})
    (out/'site_audit_review.csv').write_text(csv_text(payload['registryMapProjects']))
    print('Site audit exports match the active release')
if __name__=='__main__':main()
