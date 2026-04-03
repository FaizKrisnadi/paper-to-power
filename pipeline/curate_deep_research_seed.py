from __future__ import annotations

from pathlib import Path
from typing import Any

from .io import read_json, write_json

ROOT = Path(__file__).resolve().parent.parent
INPUT_PATH = ROOT / "data" / "interim" / "deep_research_projects.json"
CURATED_INTERIM_PATH = ROOT / "data" / "interim" / "deep_research_seed_curated.json"
CURATED_PROCESSED_PATH = ROOT / "data" / "processed" / "deep_research_seed_projects.json"


def clean_text(value: Any) -> str:
    if not isinstance(value, str):
        return ""
    return " ".join(value.split()).strip()


def parse_capacity(value: str) -> float | None:
    cleaned = clean_text(value).replace(",", "")
    if not cleaned:
        return None
    try:
        return float(cleaned)
    except ValueError:
        return None


def normalize_status(value: str) -> str:
    status = clean_text(value).lower()
    allowed = {
        "announced",
        "pre-construction",
        "construction",
        "operating",
        "shelved",
        "cancelled",
        "retired",
        "unknown",
    }
    return status if status in allowed else "unknown"


def normalize_row(row: dict[str, Any]) -> dict[str, Any]:
    normalized = {key: clean_text(value) for key, value in row.items()}
    normalized["claimed_capacity_mw"] = parse_capacity(normalized.get("claimed_capacity_mw", ""))
    normalized["project_status"] = normalize_status(normalized.get("project_status", ""))
    normalized["source_confidence"] = normalized.get("source_confidence", "").lower()
    normalized["has_location_signal"] = bool(
        normalized.get("location_text") or normalized.get("province_state_region")
    )
    normalized["has_coordinates"] = bool(
        normalized.get("latitude") and normalized.get("longitude")
    )
    return normalized


def classify_row(row: dict[str, Any]) -> tuple[str, list[str]]:
    reasons: list[str] = []
    project_name = row.get("project_name", "").lower()
    notes = row.get("evidence_notes", "").lower()
    flags = row.get("data_quality_flags", "").lower()
    source_type = row.get("source_primary_type", "").lower()
    country_code = row.get("country_code", "")

    if "disaggregated distributed assets" in flags:
        reasons.append("distributed_or_aggregated_program")
        return ("excluded", reasons)

    if country_code == "SGP" and (
        "solarnova" in project_name or "solarnova" in notes or "jtc solarland" in project_name
    ):
        reasons.append("distributed_singapore_program")
        return ("excluded", reasons)

    if not row.get("has_location_signal"):
        reasons.append("no_location_signal")
        return ("excluded", reasons)

    if "vague location" in flags:
        reasons.append("vague_location")

    if "capacity conflict" in flags:
        reasons.append("capacity_conflict")

    if not row.get("claimed_cod"):
        reasons.append("missing_cod")

    if not row.get("has_coordinates"):
        reasons.append("missing_coordinates")

    if source_type in {"news report", "secondary source"}:
        reasons.append("weaker_primary_source")

    confidence = row.get("source_confidence", "")
    if confidence not in {"high", "medium"}:
        reasons.append("unclear_confidence")

    if "vague_location" in reasons or "weaker_primary_source" in reasons:
        return ("review_required", reasons)

    return ("accepted", reasons)


def build_payload(records: list[dict[str, Any]]) -> dict[str, Any]:
    accepted: list[dict[str, Any]] = []
    review_required: list[dict[str, Any]] = []
    excluded: list[dict[str, Any]] = []

    for raw_row in records:
        normalized = normalize_row(raw_row)
        bucket, reasons = classify_row(normalized)
        enriched = {
            **normalized,
            "curation_bucket": bucket,
            "curation_reasons": reasons,
        }
        if bucket == "accepted":
            accepted.append(enriched)
        elif bucket == "review_required":
            review_required.append(enriched)
        else:
            excluded.append(enriched)

    summary = {
        "totalRecords": len(records),
        "accepted": len(accepted),
        "reviewRequired": len(review_required),
        "excluded": len(excluded),
    }

    return {
        "summary": summary,
        "accepted": accepted,
        "review_required": review_required,
        "excluded": excluded,
    }


def main() -> None:
    if not INPUT_PATH.exists():
        print(
            "Missing data/interim/deep_research_projects.json. "
            "Run npm run import:deepresearch first."
        )
        return

    payload = read_json(INPUT_PATH)
    if not isinstance(payload, dict):
        raise ValueError("deep_research_projects.json must contain an object")
    records = payload.get("records")
    if not isinstance(records, list):
        raise ValueError("deep_research_projects.json must contain a records list")

    curated = build_payload([row for row in records if isinstance(row, dict)])
    write_json(CURATED_INTERIM_PATH, curated)
    write_json(CURATED_PROCESSED_PATH, curated)
    summary = curated["summary"]

    print(f"Wrote {CURATED_INTERIM_PATH.relative_to(ROOT)}")
    print(f"Wrote {CURATED_PROCESSED_PATH.relative_to(ROOT)}")
    print(
        "Curated Deep Research rows: "
        f"{summary['accepted']} accepted, "
        f"{summary['reviewRequired']} review_required, "
        f"{summary['excluded']} excluded"
    )


if __name__ == "__main__":
    main()
