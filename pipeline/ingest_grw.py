from __future__ import annotations

from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Any, Literal

from .geo import centroid_from_geometry
from .io import read_geojson, read_json, write_json
from .models import COUNTRY_CODES

ROOT = Path(__file__).resolve().parent.parent
RAW_GRW_DIR = ROOT / "data" / "raw" / "grw"
INTERIM_GRW_JSON = ROOT / "data" / "interim" / "grw_assets.json"
OBSERVED_ASSETS_JSON = ROOT / "data" / "processed" / "observed_assets.json"

COUNTRY_MAP_PATH = ROOT / "data" / "manual" / "country_name_to_code.json"
Technology = Literal["solar", "wind"]


def load_country_map() -> dict[str, str]:
    raw = read_json(COUNTRY_MAP_PATH)
    if not isinstance(raw, dict):
        raise ValueError("country_name_to_code.json must contain an object")
    return {
        str(key).strip(): str(value).strip()
        for key, value in raw.items()
        if str(key).strip() and str(value).strip()
    }


@dataclass(frozen=True)
class GrwAssetRecord:
    siteId: str
    sourceDataset: str
    sourceFile: str
    sourceFeatureIndex: int
    countryCode: str
    technology: Technology
    observedFirstSeenQuarter: str | None
    observedLatestQuarter: str | None
    observedAreaHectares: float | None
    centroidLatitude: float | None
    centroidLongitude: float | None
    geometryType: str
    geometry: dict[str, Any]
    estimatedCapacityProxyMw: float | None
    precedingLandUse: str | None


def discover_grw_files() -> list[tuple[Path, Technology]]:
    if not RAW_GRW_DIR.exists():
        return []
    files: list[tuple[Path, Technology]] = []
    for path in sorted(RAW_GRW_DIR.glob("*.geojson")):
        name = path.name.lower()
        if "solar" in name:
            files.append((path, "solar"))
        elif "wind" in name:
            files.append((path, "wind"))
    return files


def parse_area_ha(value: Any) -> float | None:
    if value is None:
        return None
    if not isinstance(value, int | float):
        return None
    return round(float(value) / 10000.0, 4)


def format_observed_quarter(year: Any, quarter: Any) -> str | None:
    if not isinstance(year, int | float) or not isinstance(quarter, int | float):
        return None
    year_int = int(year)
    quarter_int = int(quarter)
    if quarter_int < 1 or quarter_int > 4:
        return None
    return f"{year_int} Q{quarter_int}"


def estimate_capacity_proxy_mw(technology: Technology, area_ha: float | None) -> float | None:
    if technology == "solar" and area_ha is not None:
        # Simple placeholder density for early portfolio-stage summaries.
        return round(area_ha * 0.6, 2)
    return None


def normalize_feature(
    feature: dict[str, Any],
    source_file: str,
    feature_index: int,
    technology: Technology,
    country_name_to_code: dict[str, str],
) -> GrwAssetRecord | None:
    if feature.get("type") != "Feature":
        return None

    properties = feature.get("properties")
    geometry = feature.get("geometry")
    if not isinstance(properties, dict) or not isinstance(geometry, dict):
        return None

    country_name = properties.get("COUNTRY")
    if not isinstance(country_name, str):
        return None
    country_code = country_name_to_code.get(country_name.strip())
    if country_code is None:
        return None
    if country_code not in COUNTRY_CODES:
        return None

    geometry_type = geometry.get("type")
    if not isinstance(geometry_type, str):
        return None

    area_ha = parse_area_ha(properties.get("area"))
    first_seen = format_observed_quarter(
        properties.get("construction_year"),
        properties.get("construction_quarter"),
    )
    preceding_land_use = properties.get("landcover_in_2018")
    centroid = centroid_from_geometry(geometry)

    return GrwAssetRecord(
        siteId=f"GRW::{technology.upper()}::{country_code}::{source_file}::{feature_index}",
        sourceDataset=f"GRW {technology}",
        sourceFile=source_file,
        sourceFeatureIndex=feature_index,
        countryCode=country_code,
        technology=technology,
        observedFirstSeenQuarter=first_seen,
        observedLatestQuarter="2024 Q2",
        observedAreaHectares=area_ha,
        centroidLatitude=centroid[0] if centroid else None,
        centroidLongitude=centroid[1] if centroid else None,
        geometryType=geometry_type,
        geometry=geometry,
        estimatedCapacityProxyMw=estimate_capacity_proxy_mw(technology, area_ha),
        precedingLandUse=(
            preceding_land_use.strip()
            if isinstance(preceding_land_use, str) and preceding_land_use.strip()
            else None
        ),
    )


def normalize_geojson_file(path: Path, technology: Technology) -> list[GrwAssetRecord]:
    payload = read_geojson(path)
    features = payload.get("features")
    if not isinstance(features, list):
        raise ValueError(f"{path.name} must contain a FeatureCollection with features")

    records: list[GrwAssetRecord] = []
    country_name_to_code = load_country_map()
    for index, feature in enumerate(features):
        if not isinstance(feature, dict):
            continue
        record = normalize_feature(
            feature=feature,
            source_file=path.name,
            feature_index=index,
            technology=technology,
            country_name_to_code=country_name_to_code,
        )
        if record is not None:
            records.append(record)
    return records


def build_observed_assets() -> list[GrwAssetRecord]:
    records: list[GrwAssetRecord] = []
    for path, technology in discover_grw_files():
        records.extend(normalize_geojson_file(path, technology))
    return records


def summarize(records: list[GrwAssetRecord]) -> dict[str, Any]:
    by_country: dict[str, dict[str, Any]] = {}
    for record in records:
        summary = by_country.setdefault(
            record.countryCode,
            {
                "countryCode": record.countryCode,
                "assetCount": 0,
                "solarAssets": 0,
                "windAssets": 0,
                "observedAreaHectares": 0.0,
            },
        )
        summary["assetCount"] += 1
        summary["observedAreaHectares"] += record.observedAreaHectares or 0.0
        if record.technology == "solar":
            summary["solarAssets"] += 1
        else:
            summary["windAssets"] += 1

    return {
        "recordCount": len(records),
        "countries": list(by_country.values()),
    }


def main() -> None:
    files = discover_grw_files()
    if not files:
        print(
            "No GRW GeoJSON files found in data/raw/grw. "
            "Add solar and/or wind exports first."
        )
        return

    records = build_observed_assets()
    payload = {
        "summary": summarize(records),
        "records": [asdict(record) for record in records],
    }
    write_json(INTERIM_GRW_JSON, payload)
    write_json(OBSERVED_ASSETS_JSON, payload)
    print(f"Wrote {INTERIM_GRW_JSON.relative_to(ROOT)}")
    print(f"Wrote {OBSERVED_ASSETS_JSON.relative_to(ROOT)}")
    print(f"Normalized {len(records)} GRW records across {len(files)} file(s)")


if __name__ == "__main__":
    main()
