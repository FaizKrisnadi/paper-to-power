from __future__ import annotations

from pathlib import Path
from typing import Any

from .io import read_csv_records, read_json, write_json

ROOT = Path(__file__).resolve().parent.parent
SEED_PATH = ROOT / "data" / "processed" / "deep_research_seed_projects.json"
OVERRIDES_PATH = ROOT / "data" / "manual" / "seed_enrichment_overrides.csv"
INTERIM_OUTPUT = ROOT / "data" / "interim" / "reviewed_seed_projects.json"
PROCESSED_OUTPUT = ROOT / "data" / "processed" / "reviewed_seed_projects.json"
PROMOTION_OUTPUT = ROOT / "data" / "processed" / "reviewed_seed_promotion_candidates.json"

REVIEW_STATUSES = {"approved", "rejected", "pending"}


def clean_text(value: Any) -> str:
    if value is None:
        return ""
    return " ".join(str(value).split()).strip()


def parse_float(value: Any) -> float | None:
    text = clean_text(value).replace(",", "")
    if not text:
        return None
    try:
        return float(text)
    except ValueError:
        return None


def normalize_review_status(value: Any) -> str:
    status = clean_text(value).lower()
    return status if status in REVIEW_STATUSES else "pending"


def load_seed_rows() -> list[dict[str, Any]]:
    if not SEED_PATH.exists():
        raise FileNotFoundError(
            "Missing data/processed/deep_research_seed_projects.json. "
            "Run npm run curate:deepresearch first."
        )
    payload = read_json(SEED_PATH)
    if not isinstance(payload, dict):
        raise ValueError("deep_research_seed_projects.json must contain an object")

    rows: list[dict[str, Any]] = []
    for bucket in ("accepted", "review_required"):
        bucket_rows = payload.get(bucket, [])
        if isinstance(bucket_rows, list):
            rows.extend([row for row in bucket_rows if isinstance(row, dict)])
    return rows


def load_overrides() -> dict[str, dict[str, str]]:
    if not OVERRIDES_PATH.exists():
        raise FileNotFoundError(
            "Missing data/manual/seed_enrichment_overrides.csv. "
            "Create it before applying seed enrichment."
        )

    overrides: dict[str, dict[str, str]] = {}
    for row in read_csv_records(OVERRIDES_PATH):
        project_id = clean_text(row.get("project_id", ""))
        if not project_id:
            continue
        overrides[project_id] = {key: clean_text(value) for key, value in row.items()}
    return overrides


def apply_override_value(base_value: Any, override_value: str) -> Any:
    return override_value if override_value else base_value


def is_promotion_ready(row: dict[str, Any]) -> bool:
    return (
        row.get("review_status") == "approved"
        and clean_text(row.get("project_name", "")) != ""
        and clean_text(row.get("country_code", "")) != ""
        and clean_text(row.get("technology", "")) != ""
        and isinstance(row.get("latitude"), int | float)
        and isinstance(row.get("longitude"), int | float)
    )


def merge_row(row: dict[str, Any], override: dict[str, str] | None) -> dict[str, Any]:
    if override is None:
        return {
            **row,
            "review_status": "pending",
            "reviewer_notes": "",
            "promotion_ready": False,
            "override_applied": False,
        }

    merged = dict(row)
    text_field_pairs = {
        "project_name": "reviewed_project_name",
        "phase_name": "reviewed_phase_name",
        "location_text": "reviewed_location_text",
        "province_state_region": "reviewed_province_state_region",
        "claimed_cod": "reviewed_claimed_cod",
        "project_status": "reviewed_project_status",
        "source_primary_url": "reviewed_source_primary_url",
        "source_secondary_urls": "reviewed_source_secondary_urls",
        "source_primary_type": "reviewed_source_primary_type",
        "source_primary_date": "reviewed_source_primary_date",
        "source_confidence": "reviewed_source_confidence",
        "data_quality_flags": "reviewed_data_quality_flags",
    }

    for target_field, override_field in text_field_pairs.items():
        merged[target_field] = apply_override_value(
            merged.get(target_field, ""),
            override.get(override_field, ""),
        )

    reviewed_capacity = parse_float(override.get("reviewed_claimed_capacity_mw", ""))
    if reviewed_capacity is not None:
        merged["claimed_capacity_mw"] = reviewed_capacity

    reviewed_latitude = parse_float(override.get("reviewed_latitude", ""))
    reviewed_longitude = parse_float(override.get("reviewed_longitude", ""))
    if reviewed_latitude is not None:
        merged["latitude"] = reviewed_latitude
    if reviewed_longitude is not None:
        merged["longitude"] = reviewed_longitude

    review_status = normalize_review_status(override.get("review_status", "pending"))
    merged["has_coordinates"] = bool(
        isinstance(merged.get("latitude"), int | float)
        and isinstance(merged.get("longitude"), int | float)
    )
    merged["has_location_signal"] = bool(
        clean_text(merged.get("location_text", ""))
        or clean_text(merged.get("province_state_region", ""))
    )
    merged["review_status"] = review_status
    merged["reviewer_notes"] = clean_text(override.get("reviewer_notes", ""))
    merged["override_applied"] = True
    merged["promotion_ready"] = is_promotion_ready(merged)
    return merged


def build_payload(seed_rows: list[dict[str, Any]], overrides: dict[str, dict[str, str]]) -> dict[str, Any]:
    reviewed_rows: list[dict[str, Any]] = []
    for row in seed_rows:
        project_id = clean_text(row.get("project_id", ""))
        reviewed_rows.append(merge_row(row, overrides.get(project_id)))

    promotion_candidates = [
        row for row in reviewed_rows if row.get("promotion_ready") is True
    ]

    summary = {
        "totalRows": len(reviewed_rows),
        "approved": sum(1 for row in reviewed_rows if row.get("review_status") == "approved"),
        "pending": sum(1 for row in reviewed_rows if row.get("review_status") == "pending"),
        "rejected": sum(1 for row in reviewed_rows if row.get("review_status") == "rejected"),
        "promotionReady": len(promotion_candidates),
    }

    return {
        "summary": summary,
        "records": reviewed_rows,
        "promotionCandidates": promotion_candidates,
    }


def main() -> None:
    try:
        seed_rows = load_seed_rows()
        overrides = load_overrides()
    except FileNotFoundError as exc:
        print(str(exc))
        return

    payload = build_payload(seed_rows, overrides)
    write_json(INTERIM_OUTPUT, payload)
    write_json(PROCESSED_OUTPUT, payload)
    write_json(
        PROMOTION_OUTPUT,
        {
            "summary": payload["summary"],
            "records": payload["promotionCandidates"],
        },
    )

    summary = payload["summary"]
    print(f"Wrote {INTERIM_OUTPUT.relative_to(ROOT)}")
    print(f"Wrote {PROCESSED_OUTPUT.relative_to(ROOT)}")
    print(f"Wrote {PROMOTION_OUTPUT.relative_to(ROOT)}")
    print(
        "Reviewed seed rows: "
        f"{summary['approved']} approved, "
        f"{summary['pending']} pending, "
        f"{summary['rejected']} rejected, "
        f"{summary['promotionReady']} promotion-ready"
    )


if __name__ == "__main__":
    main()
