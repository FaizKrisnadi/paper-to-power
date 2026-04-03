from __future__ import annotations

from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Any, Literal

from .io import read_csv_records, read_json, write_json

ROOT = Path(__file__).resolve().parent.parent
RAW_GEM_DIR = ROOT / "data" / "raw" / "gem"
INTERIM_GEM_JSON = ROOT / "data" / "interim" / "gem_projects.json"
PROJECT_REGISTRY_JSON = ROOT / "data" / "processed" / "project_registry.json"
ALIASES_PATH = ROOT / "data" / "manual" / "gem_column_aliases.json"
COUNTRY_MAP_PATH = ROOT / "data" / "manual" / "country_name_to_code.json"

Technology = Literal["solar", "wind"]


@dataclass(frozen=True)
class GemProjectRecord:
    projectId: str
    sourceDataset: str
    sourceFile: str
    sourceRowNumber: int
    projectName: str
    phaseName: str | None
    countryCode: str
    countryName: str
    technology: Technology
    claimedCapacityMw: float | None
    claimedStatus: str | None
    claimedCod: str | None
    developer: str | None
    owner: str | None
    locationText: str | None
    latitude: float | None
    longitude: float | None
    gemId: str | None


def normalize_column_name(value: str) -> str:
    return "_".join(value.strip().lower().split())


def load_aliases() -> dict[str, list[str]]:
    aliases = read_json(ALIASES_PATH)
    if not isinstance(aliases, dict):
        raise ValueError("gem_column_aliases.json must contain an object")
    normalized: dict[str, list[str]] = {}
    for key, values in aliases.items():
        if not isinstance(values, list):
            raise ValueError(f"Alias list for {key} must be a list")
        normalized[key] = [normalize_column_name(value) for value in values]
    return normalized


def load_country_map() -> dict[str, str]:
    raw = read_json(COUNTRY_MAP_PATH)
    if not isinstance(raw, dict):
        raise ValueError("country_name_to_code.json must contain an object")
    return {normalize_country_name(key): value for key, value in raw.items()}


def normalize_country_name(value: str) -> str:
    return " ".join(value.strip().lower().split())


def discover_gem_files() -> list[tuple[Path, Technology]]:
    if not RAW_GEM_DIR.exists():
        return []
    files: list[tuple[Path, Technology]] = []
    for path in sorted(RAW_GEM_DIR.glob("*.csv")):
        name = path.name.lower()
        if "solar" in name:
            files.append((path, "solar"))
        elif "wind" in name:
            files.append((path, "wind"))
    return files


def make_row_lookup(row: dict[str, Any]) -> dict[str, str]:
    lookup: dict[str, str] = {}
    for key, value in row.items():
        if key is None:
            continue
        lookup[normalize_column_name(key)] = str(value).strip() if value is not None else ""
    return lookup


def resolve_value(
    row_lookup: dict[str, str],
    aliases: dict[str, list[str]],
    field_name: str,
) -> str | None:
    for alias in aliases.get(field_name, []):
        value = row_lookup.get(alias, "").strip()
        if value:
            return value
    return None


def parse_float(value: str | None) -> float | None:
    if value is None:
        return None
    cleaned = value.replace(",", "").strip()
    if not cleaned:
        return None
    try:
        return float(cleaned)
    except ValueError:
        return None


def normalize_project_row(
    row: dict[str, Any],
    aliases: dict[str, list[str]],
    country_map: dict[str, str],
    source_file: str,
    row_number: int,
    technology: Technology,
) -> GemProjectRecord | None:
    lookup = make_row_lookup(row)
    country_name = resolve_value(lookup, aliases, "countryName")
    if not country_name:
        return None

    country_code = country_map.get(normalize_country_name(country_name))
    if not country_code:
        return None

    project_name = resolve_value(lookup, aliases, "projectName")
    if not project_name:
        phase_name = resolve_value(lookup, aliases, "phaseName")
        if not phase_name:
            return None
        project_name = phase_name

    gem_id = resolve_value(lookup, aliases, "gemId")
    project_id = gem_id or f"{technology.upper()}::{source_file}::{row_number}"
    claimed_capacity = parse_float(resolve_value(lookup, aliases, "capacityMw"))

    return GemProjectRecord(
        projectId=project_id,
        sourceDataset=f"GEM {technology}",
        sourceFile=source_file,
        sourceRowNumber=row_number,
        projectName=project_name,
        phaseName=resolve_value(lookup, aliases, "phaseName"),
        countryCode=country_code,
        countryName=country_name,
        technology=technology,
        claimedCapacityMw=claimed_capacity,
        claimedStatus=resolve_value(lookup, aliases, "status"),
        claimedCod=resolve_value(lookup, aliases, "claimedCod"),
        developer=resolve_value(lookup, aliases, "developer"),
        owner=resolve_value(lookup, aliases, "owner"),
        locationText=resolve_value(lookup, aliases, "locationText"),
        latitude=parse_float(resolve_value(lookup, aliases, "latitude")),
        longitude=parse_float(resolve_value(lookup, aliases, "longitude")),
        gemId=gem_id,
    )


def build_registry() -> list[GemProjectRecord]:
    aliases = load_aliases()
    country_map = load_country_map()
    records: list[GemProjectRecord] = []

    for path, technology in discover_gem_files():
        for index, row in enumerate(read_csv_records(path), start=2):
            normalized = normalize_project_row(
                row=row,
                aliases=aliases,
                country_map=country_map,
                source_file=path.name,
                row_number=index,
                technology=technology,
            )
            if normalized is not None:
                records.append(normalized)

    return records


def summarize(records: list[GemProjectRecord]) -> dict[str, Any]:
    by_country: dict[str, dict[str, Any]] = {}
    for record in records:
        summary = by_country.setdefault(
            record.countryCode,
            {
                "countryCode": record.countryCode,
                "projectCount": 0,
                "solarProjects": 0,
                "windProjects": 0,
                "claimedCapacityMw": 0.0,
            },
        )
        summary["projectCount"] += 1
        summary["claimedCapacityMw"] += record.claimedCapacityMw or 0.0
        if record.technology == "solar":
            summary["solarProjects"] += 1
        else:
            summary["windProjects"] += 1

    return {
        "recordCount": len(records),
        "countries": list(by_country.values()),
    }


def main() -> None:
    files = discover_gem_files()
    if not files:
        print(
            "No GEM CSV files found in data/raw/gem. "
            "Add solar and/or wind tracker exports first."
        )
        return

    records = build_registry()
    payload = {
        "summary": summarize(records),
        "records": [asdict(record) for record in records],
    }
    write_json(INTERIM_GEM_JSON, payload)
    write_json(PROJECT_REGISTRY_JSON, payload)
    print(f"Wrote {INTERIM_GEM_JSON.relative_to(ROOT)}")
    print(f"Wrote {PROJECT_REGISTRY_JSON.relative_to(ROOT)}")
    print(f"Normalized {len(records)} GEM records across {len(files)} file(s)")


if __name__ == "__main__":
    main()
