from __future__ import annotations

import csv
import sys
from pathlib import Path
from typing import Any

from .io import read_json, write_json

ROOT = Path(__file__).resolve().parent.parent
COUNTRY_MAP_PATH = ROOT / "data" / "manual" / "country_name_to_code.json"
DEFAULT_INPUT = Path("/Users/faizkrisnadi/Downloads/asean_registry_draft_import.csv")
INTERIM_OUTPUT = ROOT / "data" / "interim" / "deep_research_projects.json"
SUMMARY_OUTPUT = ROOT / "data" / "processed" / "asean_registry_import_summary.json"

TECHNOLOGY_MAP = {
    "solar": "solar",
    "floating_solar": "solar",
    "floating solar": "solar",
    "solar_battery": "mixed",
    "solar + battery": "mixed",
    "solar+battery": "mixed",
    "onshore_wind": "wind",
    "onshore wind": "wind",
    "offshore_wind": "wind",
    "offshore wind": "wind",
    "wind": "wind",
    "mixed": "mixed",
}
STATUS_MAP = {
    "announced": "announced",
    "pre_construction": "pre-construction",
    "pre-construction": "pre-construction",
    "under_construction": "construction",
    "construction": "construction",
    "operational": "operating",
    "operating": "operating",
    "completed": "operating",
    "shelved": "shelved",
    "cancelled": "cancelled",
    "canceled": "cancelled",
}


def clean_text(value: Any) -> str:
    if value is None:
        return ""
    return " ".join(str(value).split()).strip()


def normalize_key(value: str) -> str:
    return clean_text(value).lower().replace(" ", "_")


def read_input_path() -> Path:
    if len(sys.argv) > 1 and sys.argv[1].strip():
        return Path(sys.argv[1]).expanduser().resolve()
    return DEFAULT_INPUT


def read_csv_rows(path: Path) -> list[dict[str, str]]:
    with path.open("r", encoding="utf-8-sig", newline="") as handle:
        sample = handle.read(2048)
        handle.seek(0)
        try:
            dialect = csv.Sniffer().sniff(sample) if sample.strip() else csv.excel
        except csv.Error:
            dialect = csv.excel
        reader = csv.DictReader(handle, dialect=dialect)
        return [dict(row) for row in reader]


def load_country_map() -> dict[str, str]:
    raw = read_json(COUNTRY_MAP_PATH)
    if not isinstance(raw, dict):
        raise ValueError("country_name_to_code.json must contain an object")
    return {normalize_key(key): clean_text(value) for key, value in raw.items()}


def pick(row: dict[str, str], *keys: str) -> str:
    for key in keys:
        value = clean_text(row.get(key, ""))
        if value:
            return value
    return ""


def parse_capacity(value: str) -> str:
    cleaned = clean_text(value).replace(",", "")
    return cleaned


def normalize_technology(value: str) -> str:
    technology = normalize_key(value).replace("__", "_")
    return TECHNOLOGY_MAP.get(technology, "mixed")


def normalize_status(value: str) -> str:
    status = normalize_key(value).replace("__", "_")
    return STATUS_MAP.get(status, "unknown")


def infer_confidence(source_type: str, source_url: str) -> str:
    source_type_lower = clean_text(source_type).lower()
    source_url_lower = clean_text(source_url).lower()
    if any(token in source_type_lower for token in ("government", "developer", "stock exchange", "multilateral")):
        return "high"
    if any(token in source_url_lower for token in (".gov", ".gov.", "adb.org", "worldbank.org")):
        return "high"
    return "medium"


def build_quality_flags(row: dict[str, str], source_type: str) -> str:
    flags: list[str] = []
    if not pick(row, "latitude"):
        flags.append("Missing coordinates")
    if not pick(row, "target_completion_text", "claimed_cod"):
        flags.append("Missing exact COD")
    if source_type == "Secondary Source":
        flags.append("Needs primary source validation")
    return ", ".join(flags)


def build_evidence_notes(row: dict[str, str]) -> str:
    notes = []
    for key in ("notes", "developer", "owner", "offtaker", "export_destination"):
        value = clean_text(row.get(key, ""))
        if value:
            notes.append(value)
    return " | ".join(notes)


def make_project_id(country_code: str, technology: str, counters: dict[tuple[str, str], int]) -> str:
    key = (country_code, technology)
    counters[key] = counters.get(key, 0) + 1
    suffix = technology[:1].upper() if technology else "X"
    return f"{country_code}-{suffix}-ASEAN-{counters[key]:03d}"


def normalize_records(rows: list[dict[str, str]], country_map: dict[str, str]) -> list[dict[str, Any]]:
    normalized_rows: list[dict[str, Any]] = []
    counters: dict[tuple[str, str], int] = {}

    for row in rows:
        country_name = pick(row, "country", "country_name")
        country_code = country_map.get(normalize_key(country_name), "")
        if not country_code:
            continue

        technology = normalize_technology(pick(row, "technology", "raw_technology"))
        source_type = pick(row, "source_primary_type")
        if not source_type:
            source_type = "Secondary Source"

        project_id = pick(row, "project_id")
        if not project_id:
            project_id = make_project_id(country_code, technology, counters)

        normalized_rows.append(
            {
                "project_id": project_id,
                "project_name": pick(row, "project_name"),
                "phase_name": "",
                "country_code": country_code,
                "country_name": country_name,
                "technology": technology,
                "project_status": normalize_status(pick(row, "status", "project_status")),
                "claimed_capacity_mw": parse_capacity(
                    pick(row, "capacity_mw", "claimed_capacity_mw")
                ),
                "claimed_cod": pick(row, "target_completion_text", "claimed_cod"),
                "developer": pick(row, "developer"),
                "owner_operator": pick(row, "owner", "owner_operator", "developer_owner"),
                "location_text": pick(row, "subnational_area", "location_text"),
                "province_state_region": pick(row, "subnational_area", "province_state_region"),
                "latitude": pick(row, "latitude"),
                "longitude": pick(row, "longitude"),
                "source_primary_url": pick(row, "source_url", "source_primary_url"),
                "source_secondary_urls": "",
                "source_primary_type": source_type,
                "source_primary_date": pick(row, "source_date", "source_primary_date"),
                "source_confidence": infer_confidence(
                    source_type,
                    pick(row, "source_url", "source_primary_url"),
                ).title(),
                "evidence_notes": build_evidence_notes(row),
                "duplicate_group_hint": "",
                "data_quality_flags": build_quality_flags(row, source_type),
            }
        )
    return normalized_rows


def summarize(records: list[dict[str, Any]]) -> dict[str, Any]:
    country_counts: dict[str, int] = {}
    technology_counts: dict[str, int] = {}
    missing_coordinates = 0
    for record in records:
        country_code = clean_text(record.get("country_code"))
        technology = clean_text(record.get("technology"))
        country_counts[country_code] = country_counts.get(country_code, 0) + 1
        technology_counts[technology] = technology_counts.get(technology, 0) + 1
        if not clean_text(record.get("latitude")) or not clean_text(record.get("longitude")):
            missing_coordinates += 1
    return {
        "recordCount": len(records),
        "countryCounts": country_counts,
        "technologyCounts": technology_counts,
        "missingCoordinates": missing_coordinates,
    }


def main() -> None:
    input_path = read_input_path()
    if not input_path.exists():
        raise FileNotFoundError(f"Input file not found: {input_path}")

    country_map = load_country_map()
    rows = read_csv_rows(input_path)
    records = normalize_records(rows, country_map)
    payload = {
        "sourceFile": str(input_path),
        "recordCount": len(records),
        "countryCounts": summarize(records)["countryCounts"],
        "records": records,
    }

    write_json(INTERIM_OUTPUT, payload)
    write_json(
        SUMMARY_OUTPUT,
        {
            "sourceFile": str(input_path),
            **summarize(records),
        },
    )

    print(f"Wrote {INTERIM_OUTPUT.relative_to(ROOT)}")
    print(f"Wrote {SUMMARY_OUTPUT.relative_to(ROOT)}")
    print(f"Imported {len(records)} registry rows from {input_path.name}")


if __name__ == "__main__":
    main()
