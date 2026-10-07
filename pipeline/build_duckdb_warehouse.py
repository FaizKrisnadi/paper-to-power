"""Warehouse the active evidence release without stale geospatial joins or inferred readiness."""
from pathlib import Path
from .geospatial_runtime import ensure_modules
ROOT=Path(__file__).resolve().parent.parent
WAREHOUSE_PATH=ROOT/'data/processed/geospatial/paper_to_power.duckdb'

def main():
    ensure_modules(['duckdb'],module_name='pipeline.build_duckdb_warehouse')
    import duckdb
    con=duckdb.connect(str(WAREHOUSE_PATH))
    # Rebuild derived core tables, so legacy scores cannot be confused with active evidence.
    con.execute('DROP SCHEMA IF EXISTS core CASCADE')
    con.execute('CREATE SCHEMA core')
    con.execute('CREATE TABLE core.project_registry AS SELECT unnest(records) AS project FROM read_json_auto(?)',[str(ROOT/'data/processed/project_registry.json')])
    con.execute('CREATE TABLE core.observed_assets AS SELECT unnest(records) AS asset FROM read_json_auto(?)',[str(ROOT/'data/processed/observed_assets.json')])
    con.execute('CREATE TABLE core.match_candidates AS SELECT unnest(candidates) AS candidate FROM read_json_auto(?)',[str(ROOT/'data/processed/match_candidates.json')])
    con.execute('CREATE SCHEMA IF NOT EXISTS marts')
    con.execute('CREATE OR REPLACE TABLE evidence_release AS SELECT unnest(registryMapProjects) AS project FROM read_json_auto(?)',[str(ROOT/'data/processed/frontend_dataset.json')])
    con.execute('CREATE OR REPLACE VIEW marts.site_audit AS SELECT project.* FROM evidence_release')
    con.execute("""CREATE OR REPLACE VIEW marts.country_summary AS SELECT countryCode,COUNT(*) projectCount,
      SUM(CASE WHEN claimReviewStatus='reviewed' THEN 1 ELSE 0 END) documentaryReviewedCount,
      SUM(CASE WHEN observationStatus='observed_footprint' THEN 1 ELSE 0 END) approvedFootprintCount,
      SUM(CASE WHEN nonDetectionEligible THEN 1 ELSE 0 END) eligibleProjectCount,
      SUM(CASE WHEN observationStatus='not_detected_by_cutoff' THEN 1 ELSE 0 END) notDetectedCount
      FROM marts.site_audit GROUP BY countryCode ORDER BY countryCode""")
    n=con.execute('SELECT count(*) FROM marts.site_audit').fetchone()[0];con.close()
    print(f'Warehouse v2: {n} project records')
if __name__=='__main__':main()
