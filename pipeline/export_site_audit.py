from __future__ import annotations

from pathlib import Path
from typing import Any

from .geospatial_runtime import ensure_modules
from .io import write_csv_records, write_json

ROOT = Path(__file__).resolve().parent.parent
GEOSPATIAL_DIR = ROOT / "data" / "processed" / "geospatial"
WAREHOUSE_PATH = GEOSPATIAL_DIR / "paper_to_power.duckdb"
CSV_PATH = GEOSPATIAL_DIR / "site_audit_review.csv"
JSON_PATH = GEOSPATIAL_DIR / "site_audit_review.json"


def json_safe_value(value: Any) -> Any:
    if hasattr(value, "item"):
        return value.item()
    return value


def main() -> None:
    ensure_modules(["duckdb"], module_name="pipeline.export_site_audit")

    import duckdb

    if not WAREHOUSE_PATH.exists():
        raise FileNotFoundError(f"Warehouse not found at {WAREHOUSE_PATH}")

    con = duckdb.connect(str(WAREHOUSE_PATH), read_only=True)
    query = """
        SELECT
          projectId,
          projectName,
          countryCode,
          technology,
          paperToPowerLabel,
          claimedStatus,
          claimedCod,
          claimedCapacityMw,
          observedCapacityProxyMw,
          observedFirstSeenQuarter,
          matchConfidence,
          distanceKm,
          contextScore,
          graphContextScore,
          gridMetadataScore,
          gridEvidenceClass,
          gridEvidenceReason,
          directConnectedSubstationCount,
          directConnectedTransmissionCount,
          nearestSiteSideGridDistanceKm,
          connectedSubstationCount30km,
          connectedTransmissionCount20km,
          metadataRichSubstationCount30km,
          metadataRichTransmissionCount20km,
          metadataRichBridgeCount,
          distributionSubstationCount30km,
          maxNearbyGridVoltageKv
        FROM marts.site_audit
        ORDER BY
          COALESCE(gridEvidenceClass, 'zzz'),
          countryCode,
          technology,
          projectName
    """
    cursor = con.execute(query)
    columns = [item[0] for item in cursor.description]
    rows = cursor.fetchall()
    records = [
        {column: json_safe_value(value) for column, value in zip(columns, row, strict=True)}
        for row in rows
    ]
    summary_rows = con.execute(
        """
        SELECT
          COALESCE(gridEvidenceClass, 'unclassified') AS gridEvidenceClass,
          COUNT(*) AS projectCount
        FROM marts.site_audit
        GROUP BY 1
        ORDER BY 1
        """
    ).fetchall()
    con.close()

    write_csv_records(CSV_PATH, records)
    write_json(
        JSON_PATH,
        {
            "summary": {
                "recordCount": len(records),
                "gridEvidenceClassCounts": [
                    {
                        "gridEvidenceClass": json_safe_value(grid_evidence_class),
                        "projectCount": json_safe_value(project_count),
                    }
                    for grid_evidence_class, project_count in summary_rows
                ],
            },
            "records": records,
        },
    )
    print(f"Wrote {CSV_PATH.relative_to(ROOT)}")
    print(f"Wrote {JSON_PATH.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
