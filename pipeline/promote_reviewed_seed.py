from __future__ import annotations

from pathlib import Path
from typing import Any

from .io import read_json, write_json

ROOT = Path(__file__).resolve().parent.parent
PROMOTION_INPUT = ROOT / "data" / "processed" / "reviewed_seed_promotion_candidates.json"
PROJECT_REGISTRY_OUTPUT = ROOT / "data" / "processed" / "project_registry.json"
INTERIM_OUTPUT = ROOT / "data" / "interim" / "project_registry.json"


def clean_text(value: Any) -> str | None:
    if value is None:
        return None
    text = " ".join(str(value).split()).strip()
    return text or None


def load_promotion_candidates() -> list[dict[str, Any]]:
    if not PROMOTION_INPUT.exists():
        raise FileNotFoundError(
            "Missing data/processed/reviewed_seed_promotion_candidates.json. "
            "Run npm run apply:seed-enrichment first."
        )

    payload = read_json(PROMOTION_INPUT)
    if not isinstance(payload, dict):
        raise ValueError("reviewed_seed_promotion_candidates.json must contain an object")

    records = payload.get("records")
    if not isinstance(records, list):
        raise ValueError("reviewed_seed_promotion_candidates.json must contain a records list")

    return [record for record in records if isinstance(record, dict)]


def load_existing_registry() -> list[dict[str, Any]]:
    if not PROJECT_REGISTRY_OUTPUT.exists():
        return []

    payload = read_json(PROJECT_REGISTRY_OUTPUT)
    if not isinstance(payload, dict):
        raise ValueError("project_registry.json must contain an object")

    records = payload.get("records", [])
    if not isinstance(records, list):
        raise ValueError("project_registry.json must contain a records list")

    return [record for record in records if isinstance(record, dict)]


def normalize_record(record: dict[str, Any], row_number: int) -> dict[str, Any]:
    latitude = record.get("latitude")
    longitude = record.get("longitude")
    claimed_capacity = record.get("claimed_capacity_mw")

    return {
        "projectId": clean_text(record.get("project_id")) or f"reviewed::{row_number}",
        "sourceDataset": "Reviewed Seed Registry",
        "sourceFile": PROMOTION_INPUT.name,
        "sourceRowNumber": row_number,
        "projectName": clean_text(record.get("project_name")),
        "phaseName": clean_text(record.get("phase_name")),
        "countryCode": clean_text(record.get("country_code")),
        "countryName": clean_text(record.get("country_name")),
        "technology": clean_text(record.get("technology")),
        "claimedCapacityMw": float(claimed_capacity) if isinstance(claimed_capacity, int | float) else None,
        "claimedStatus": clean_text(record.get("project_status")),
        "claimedCod": clean_text(record.get("claimed_cod")),
        "developer": clean_text(record.get("developer")),
        "owner": clean_text(record.get("owner_operator")),
        "locationText": clean_text(record.get("location_text")),
        "provinceStateRegion": clean_text(record.get("province_state_region")),
        "latitude": float(latitude) if isinstance(latitude, int | float) else None,
        "longitude": float(longitude) if isinstance(longitude, int | float) else None,
        "gemId": None,
        "sourcePrimaryUrl": clean_text(record.get("source_primary_url")),
        "sourceSecondaryUrls": clean_text(record.get("source_secondary_urls")),
        "sourcePrimaryType": clean_text(record.get("source_primary_type")),
        "sourcePrimaryDate": clean_text(record.get("source_primary_date")),
        "sourceConfidence": clean_text(record.get("source_confidence")),
        "reviewStatus": clean_text(record.get("review_status")),
        "reviewerNotes": clean_text(record.get("reviewer_notes")),
        "dataQualityFlags": clean_text(record.get("data_quality_flags")),
    }


def summarize(records: list[dict[str, Any]]) -> dict[str, Any]:
    by_country: dict[str, dict[str, Any]] = {}
    for record in records:
        country_code = str(record.get("countryCode") or "UNK")
        summary = by_country.setdefault(
            country_code,
            {
                "countryCode": country_code,
                "projectCount": 0,
                "solarProjects": 0,
                "windProjects": 0,
                "claimedCapacityMw": 0.0,
            },
        )
        summary["projectCount"] += 1
        if record.get("technology") == "solar":
            summary["solarProjects"] += 1
        if record.get("technology") == "wind":
            summary["windProjects"] += 1
        if isinstance(record.get("claimedCapacityMw"), int | float):
            summary["claimedCapacityMw"] += float(record["claimedCapacityMw"])

    return {
        "recordCount": len(records),
        "countries": list(by_country.values()),
    }


def main() -> None:
    try:
        candidates = load_promotion_candidates()
    except FileNotFoundError as exc:
        print(str(exc))
        return

    promoted_records = [normalize_record(record, index) for index, record in enumerate(candidates, start=1)]
    existing_records = load_existing_registry()

    merged_records: dict[str, dict[str, Any]] = {}
    for record in existing_records:
        project_id = clean_text(record.get("projectId"))
        if project_id:
            merged_records[project_id] = record

    for record in promoted_records:
        project_id = clean_text(record.get("projectId"))
        if project_id:
            merged_records[project_id] = record

    records = sorted(merged_records.values(), key=lambda item: str(item.get("projectId", "")))
    payload = {
        "summary": summarize(records),
        "records": records,
    }
    write_json(INTERIM_OUTPUT, payload)
    write_json(PROJECT_REGISTRY_OUTPUT, payload)
    print(f"Wrote {INTERIM_OUTPUT.relative_to(ROOT)}")
    print(f"Wrote {PROJECT_REGISTRY_OUTPUT.relative_to(ROOT)}")
    print(
        f"Promoted {len(promoted_records)} reviewed seed records into the active project registry "
        f"({len(records)} total active records)"
    )


if __name__ == "__main__":
    main()
