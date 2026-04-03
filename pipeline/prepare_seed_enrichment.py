from __future__ import annotations

from pathlib import Path
from typing import Any

from .io import read_json, write_csv_records, write_json

ROOT = Path(__file__).resolve().parent.parent
INPUT_PATH = ROOT / "data" / "processed" / "deep_research_seed_projects.json"
INTERIM_JSON = ROOT / "data" / "interim" / "seed_enrichment_queue.json"
INTERIM_CSV = ROOT / "data" / "interim" / "seed_enrichment_queue.csv"
PROCESSED_JSON = ROOT / "data" / "processed" / "seed_enrichment_queue.json"


def build_search_query(row: dict[str, Any]) -> str:
    parts = [
        row.get("project_name", ""),
        row.get("phase_name", ""),
        row.get("location_text", ""),
        row.get("province_state_region", ""),
        row.get("country_name", ""),
    ]
    cleaned = [str(part).strip() for part in parts if str(part).strip()]
    return " | ".join(cleaned)


def next_action(row: dict[str, Any]) -> str:
    reasons = set(row.get("curation_reasons", []))
    if "missing_coordinates" in reasons and row.get("source_primary_type") == "Government Document":
        return "Recover coordinates from official source or map appendix"
    if "missing_coordinates" in reasons:
        return "Find exact site location from source and recover coordinates"
    if "capacity_conflict" in reasons:
        return "Resolve capacity conflict against official or regulator source"
    if "weaker_primary_source" in reasons:
        return "Replace weaker source with official or regulator source"
    if "missing_cod" in reasons:
        return "Recover explicit COD or first operating date"
    return "Manual review"


def priority_score(row: dict[str, Any]) -> int:
    score = 0
    bucket = row.get("curation_bucket", "")
    confidence = row.get("source_confidence", "")
    status = row.get("project_status", "")
    reasons = set(row.get("curation_reasons", []))

    if bucket == "accepted":
        score += 50
    elif bucket == "review_required":
        score += 25

    if confidence == "high":
        score += 20
    elif confidence == "medium":
        score += 10

    if row.get("has_location_signal"):
        score += 15
    if row.get("has_coordinates"):
        score += 20

    if status in {"operating", "construction", "pre-construction"}:
        score += 10

    if "missing_coordinates" in reasons:
        score -= 5
    if "weaker_primary_source" in reasons:
        score -= 10
    if "vague_location" in reasons:
        score -= 15

    return score


def build_queue_rows(payload: dict[str, Any]) -> list[dict[str, Any]]:
    queue_source = []
    for bucket in ("accepted", "review_required"):
        queue_source.extend(payload.get(bucket, []))

    queue_rows: list[dict[str, Any]] = []
    for row in queue_source:
        if not isinstance(row, dict):
            continue
        queue_rows.append(
            {
                "project_id": row.get("project_id", ""),
                "project_name": row.get("project_name", ""),
                "country_code": row.get("country_code", ""),
                "technology": row.get("technology", ""),
                "project_status": row.get("project_status", ""),
                "curation_bucket": row.get("curation_bucket", ""),
                "priority_score": priority_score(row),
                "location_text": row.get("location_text", ""),
                "province_state_region": row.get("province_state_region", ""),
                "claimed_capacity_mw": row.get("claimed_capacity_mw", ""),
                "claimed_cod": row.get("claimed_cod", ""),
                "source_confidence": row.get("source_confidence", ""),
                "source_primary_type": row.get("source_primary_type", ""),
                "source_primary_url": row.get("source_primary_url", ""),
                "source_secondary_urls": row.get("source_secondary_urls", ""),
                "suggested_search_query": build_search_query(row),
                "next_action": next_action(row),
                "curation_reasons": "; ".join(row.get("curation_reasons", [])),
                "data_quality_flags": row.get("data_quality_flags", ""),
            }
        )

    queue_rows.sort(
        key=lambda row: (
            int(row["priority_score"]),
            row["country_code"],
            row["project_name"],
        ),
        reverse=True,
    )
    return queue_rows


def main() -> None:
    if not INPUT_PATH.exists():
        print(
            "Missing data/processed/deep_research_seed_projects.json. "
            "Run npm run curate:deepresearch first."
        )
        return

    payload = read_json(INPUT_PATH)
    if not isinstance(payload, dict):
        raise ValueError("deep_research_seed_projects.json must contain an object")

    queue_rows = build_queue_rows(payload)
    queue_payload: dict[str, Any] = {
        "summary": {
            "recordCount": len(queue_rows),
            "acceptedIncluded": len(payload.get("accepted", [])),
            "reviewIncluded": len(payload.get("review_required", [])),
        },
        "records": queue_rows,
    }

    write_json(INTERIM_JSON, queue_payload)
    write_json(PROCESSED_JSON, queue_payload)
    write_csv_records(INTERIM_CSV, queue_rows)

    print(f"Wrote {INTERIM_JSON.relative_to(ROOT)}")
    print(f"Wrote {INTERIM_CSV.relative_to(ROOT)}")
    print(f"Wrote {PROCESSED_JSON.relative_to(ROOT)}")
    print(f"Prepared {len(queue_rows)} enrichment queue rows")


if __name__ == "__main__":
    main()
