from __future__ import annotations

import json
from dataclasses import asdict
from pathlib import Path
from typing import Any, TypeVar

from .geo import haversine_km
from .models import (
    CaseStudy,
    CountrySummary,
    EvidenceRow,
    FeatureCard,
    FrontendDataset,
    PublicSource,
    RegionalLink,
)

ROOT = Path(__file__).resolve().parent.parent
MANUAL_DIR = ROOT / "data" / "manual"
PROCESSED_DIR = ROOT / "data" / "processed"
FRONTEND_DATA_DIR = ROOT / "src" / "data"
GENERATED_TS = FRONTEND_DATA_DIR / "generated.ts"
GENERATED_JSON = PROCESSED_DIR / "frontend_dataset.json"
PROJECT_REGISTRY_JSON = PROCESSED_DIR / "project_registry.json"
OBSERVED_ASSETS_JSON = PROCESSED_DIR / "observed_assets.json"
MATCHES_JSON = PROCESSED_DIR / "project_asset_matches.json"
LABELS_JSON = PROCESSED_DIR / "paper_to_power_labels.json"
SITE_CONTEXT_JSON = PROCESSED_DIR / "geospatial" / "site_context_features.json"

T = TypeVar("T")


def load_json(path: Path) -> Any:
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def load_collection(filename: str, factory: type[T]) -> list[T]:
    raw_items = load_json(MANUAL_DIR / filename)
    if not isinstance(raw_items, list):
        raise ValueError(f"{filename} must contain a list")
    if not hasattr(factory, "from_dict"):
        raise TypeError(f"{factory} must expose from_dict")
    parser = getattr(factory, "from_dict")
    return [parser(item) for item in raw_items]


def round_coordinate(value: Any, precision: int = 6) -> Any:
    if isinstance(value, int | float):
        return round(float(value), precision)
    return value


def simplify_ring(
    ring: list[list[float]],
    *,
    max_points: int = 72,
    precision: int = 6,
) -> list[list[float]]:
    if len(ring) <= 4:
        return [[round_coordinate(coord, precision) for coord in point] for point in ring]

    step = max(1, len(ring) // max_points)
    sampled = ring[::step]
    if sampled[-1] != ring[-1]:
        sampled.append(ring[-1])

    simplified = [[round_coordinate(coord, precision) for coord in point] for point in sampled]
    if simplified[0] != simplified[-1]:
        simplified.append(simplified[0])
    return simplified


def simplify_geojson_geometry(geometry: Any) -> Any:
    if not isinstance(geometry, dict):
        return None

    geometry_type = geometry.get("type")
    coordinates = geometry.get("coordinates")
    if geometry_type == "Point" and isinstance(coordinates, list) and len(coordinates) == 2:
        return {
            "type": "Point",
            "coordinates": [round_coordinate(coordinates[0]), round_coordinate(coordinates[1])],
        }
    if geometry_type == "LineString" and isinstance(coordinates, list):
        return {
            "type": "LineString",
            "coordinates": simplify_ring(coordinates, max_points=40),
        }
    if geometry_type == "Polygon" and isinstance(coordinates, list):
        return {
            "type": "Polygon",
            "coordinates": [simplify_ring(ring) for ring in coordinates if isinstance(ring, list)],
        }
    if geometry_type == "MultiPolygon" and isinstance(coordinates, list):
        return {
            "type": "MultiPolygon",
            "coordinates": [
                [simplify_ring(ring) for ring in polygon if isinstance(ring, list)]
                for polygon in coordinates
                if isinstance(polygon, list)
            ],
        }
    return None


def build_dataset() -> FrontendDataset:
    return FrontendDataset(
        featureCards=load_collection("feature_cards.json", FeatureCard),
        countrySummaries=load_collection("country_summaries.json", CountrySummary),
        regionalLinks=load_collection("regional_links.json", RegionalLink),
        evidenceRows=load_collection("evidence_rows.json", EvidenceRow),
        caseStudies=load_collection("case_studies.json", CaseStudy),
        publicSources=load_collection("public_sources.json", PublicSource),
    )


def build_evidence_rows(
    fallback_rows: list[EvidenceRow],
    country_summaries: list[CountrySummary],
) -> list[dict[str, Any]]:
    required_paths = [PROJECT_REGISTRY_JSON, OBSERVED_ASSETS_JSON, MATCHES_JSON, LABELS_JSON]
    if not all(path.exists() for path in required_paths):
        return [asdict(item) for item in fallback_rows]

    registry_payload = load_json(PROJECT_REGISTRY_JSON)
    assets_payload = load_json(OBSERVED_ASSETS_JSON)
    matches_payload = load_json(MATCHES_JSON)
    labels_payload = load_json(LABELS_JSON)

    if not all(isinstance(payload, dict) for payload in (registry_payload, assets_payload, matches_payload, labels_payload)):
        return [asdict(item) for item in fallback_rows]

    projects = registry_payload.get("records", [])
    assets = assets_payload.get("records", [])
    matches = matches_payload.get("matches", [])
    project_labels = labels_payload.get("projectLabels", [])

    if not all(isinstance(collection, list) for collection in (projects, assets, matches, project_labels)):
        return [asdict(item) for item in fallback_rows]

    readiness_by_country = {
        summary.code: summary.readinessScore for summary in country_summaries
    }
    asset_by_id = {
        str(asset.get("siteId")): asset
        for asset in assets
        if isinstance(asset, dict) and asset.get("siteId") is not None
    }
    match_by_project = {
        str(match.get("projectId")): match
        for match in matches
        if isinstance(match, dict) and match.get("projectId") is not None
    }
    label_by_project = {
        str(label.get("projectId")): str(label.get("paperToPowerLabel"))
        for label in project_labels
        if isinstance(label, dict) and label.get("projectId") is not None
    }

    evidence_rows: list[dict[str, Any]] = []
    for project in projects:
        if not isinstance(project, dict):
            continue

        project_id = str(project.get("projectId") or "")
        country_code = str(project.get("countryCode") or "")
        technology = str(project.get("technology") or "")
        if not project_id or country_code not in {"IDN", "PHL", "SGP", "VNM", "MYS"}:
            continue
        if technology not in {"solar", "wind"}:
            continue

        match = match_by_project.get(project_id)
        asset = asset_by_id.get(str(match.get("siteId"))) if isinstance(match, dict) else None
        label = label_by_project.get(project_id, "claimed_not_observed")
        observed_capacity = (
            float(asset.get("estimatedCapacityProxyMw"))
            if isinstance(asset, dict) and isinstance(asset.get("estimatedCapacityProxyMw"), int | float)
            else 0.0
        )
        first_seen = (
            str(asset.get("observedFirstSeenQuarter"))
            if isinstance(asset, dict) and asset.get("observedFirstSeenQuarter")
            else "not seen"
        )
        readiness_score = 0 if label == "claimed_not_observed" else readiness_by_country.get(country_code, 0)

        evidence_rows.append(
            {
                "id": project_id,
                "projectName": str(project.get("projectName") or project_id),
                "countryCode": country_code,
                "technology": technology,
                "claimedCapacityMw": (
                    float(project.get("claimedCapacityMw"))
                    if isinstance(project.get("claimedCapacityMw"), int | float)
                    else 0.0
                ),
                "observedCapacityMw": observed_capacity,
                "label": label,
                "firstSeenQuarter": first_seen,
                "readinessScore": readiness_score,
            }
        )

    return evidence_rows or [asdict(item) for item in fallback_rows]


def build_registry_map_projects() -> list[dict[str, Any]]:
    if not PROJECT_REGISTRY_JSON.exists():
        return []

    payload = load_json(PROJECT_REGISTRY_JSON)
    if not isinstance(payload, dict):
        raise ValueError("project_registry.json must contain an object")

    records = payload.get("records", [])
    if not isinstance(records, list):
        raise ValueError("project_registry.json must contain a records list")

    asset_by_id: dict[str, dict[str, Any]] = {}
    match_by_project: dict[str, dict[str, Any]] = {}
    label_by_project: dict[str, str] = {}
    site_context_by_project: dict[str, dict[str, Any]] = {}

    if OBSERVED_ASSETS_JSON.exists() and MATCHES_JSON.exists() and LABELS_JSON.exists():
        assets_payload = load_json(OBSERVED_ASSETS_JSON)
        matches_payload = load_json(MATCHES_JSON)
        labels_payload = load_json(LABELS_JSON)

        if isinstance(assets_payload, dict):
            assets = assets_payload.get("records", [])
            if isinstance(assets, list):
                asset_by_id = {
                    str(asset.get("siteId")): asset
                    for asset in assets
                    if isinstance(asset, dict) and asset.get("siteId") is not None
                }

        if isinstance(matches_payload, dict):
            matches = matches_payload.get("matches", [])
            if isinstance(matches, list):
                match_by_project = {
                    str(match.get("projectId")): match
                    for match in matches
                    if isinstance(match, dict) and match.get("projectId") is not None
                }

        if isinstance(labels_payload, dict):
            project_labels = labels_payload.get("projectLabels", [])
            if isinstance(project_labels, list):
                label_by_project = {
                    str(label.get("projectId")): str(label.get("paperToPowerLabel"))
                    for label in project_labels
                    if isinstance(label, dict) and label.get("projectId") is not None
                }

    if SITE_CONTEXT_JSON.exists():
        site_context_payload = load_json(SITE_CONTEXT_JSON)
        if isinstance(site_context_payload, dict):
            site_context_records = site_context_payload.get("records", [])
            if isinstance(site_context_records, list):
                site_context_by_project = {
                    str(record.get("projectId")): record
                    for record in site_context_records
                    if isinstance(record, dict) and record.get("projectId") is not None
                }

    projects: list[dict[str, Any]] = []
    for record in records:
        if not isinstance(record, dict):
            continue
        latitude = record.get("latitude")
        longitude = record.get("longitude")
        technology = record.get("technology")
        if not isinstance(latitude, int | float) or not isinstance(longitude, int | float):
            continue
        if technology not in {"solar", "wind"}:
            continue

        project_id = str(record.get("projectId") or "")
        match = match_by_project.get(project_id)
        asset = asset_by_id.get(str(match.get("siteId"))) if isinstance(match, dict) else None
        observed_asset_count = None
        if (
            technology == "wind"
            and isinstance(asset, dict)
            and isinstance(asset.get("centroidLatitude"), int | float)
            and isinstance(asset.get("centroidLongitude"), int | float)
        ):
            asset_lat = float(asset["centroidLatitude"])
            asset_lon = float(asset["centroidLongitude"])
            observed_asset_count = sum(
                1
                for candidate in asset_by_id.values()
                if candidate.get("technology") == "wind"
                and candidate.get("countryCode") == record.get("countryCode")
                and isinstance(candidate.get("centroidLatitude"), int | float)
                and isinstance(candidate.get("centroidLongitude"), int | float)
                and haversine_km(
                    asset_lat,
                    asset_lon,
                    float(candidate["centroidLatitude"]),
                    float(candidate["centroidLongitude"]),
                )
                <= 5.0
            )

        observed_capacity = (
            float(asset.get("estimatedCapacityProxyMw"))
            if isinstance(asset, dict) and isinstance(asset.get("estimatedCapacityProxyMw"), int | float)
            else None
        )
        observed_first_seen = (
            str(asset.get("observedFirstSeenQuarter"))
            if isinstance(asset, dict) and asset.get("observedFirstSeenQuarter")
            else None
        )
        match_confidence = (
            float(match.get("matchConfidence"))
            if isinstance(match, dict) and isinstance(match.get("matchConfidence"), int | float)
            else None
        )
        distance_km = (
            float(match.get("distanceKm"))
            if isinstance(match, dict) and isinstance(match.get("distanceKm"), int | float)
            else None
        )
        site_context = site_context_by_project.get(project_id, {})
        grid_context_score = (
            float(site_context.get("graphContextScore"))
            if isinstance(site_context, dict) and isinstance(site_context.get("graphContextScore"), int | float)
            else None
        )
        grid_metadata_score = (
            float(site_context.get("gridMetadataScore"))
            if isinstance(site_context, dict) and isinstance(site_context.get("gridMetadataScore"), int | float)
            else None
        )
        max_nearby_grid_voltage_kv = (
            float(site_context.get("maxNearbyGridVoltageKv"))
            if isinstance(site_context, dict) and isinstance(site_context.get("maxNearbyGridVoltageKv"), int | float)
            else None
        )
        nearest_site_side_grid_distance_km = (
            float(site_context.get("nearestSiteSideGridDistanceKm"))
            if isinstance(site_context, dict) and isinstance(site_context.get("nearestSiteSideGridDistanceKm"), int | float)
            else None
        )

        projects.append(
            {
                "projectId": project_id,
                "projectName": record.get("projectName"),
                "countryCode": record.get("countryCode"),
                "countryName": record.get("countryName"),
                "technology": technology,
                "claimedCapacityMw": record.get("claimedCapacityMw"),
                "claimedStatus": record.get("claimedStatus"),
                "claimedCod": record.get("claimedCod"),
                "locationText": record.get("locationText"),
                "provinceStateRegion": record.get("provinceStateRegion"),
                "latitude": float(latitude),
                "longitude": float(longitude),
                "sourcePrimaryUrl": record.get("sourcePrimaryUrl"),
                "sourcePrimaryType": record.get("sourcePrimaryType"),
                "sourceConfidence": record.get("sourceConfidence"),
                "dataQualityFlags": record.get("dataQualityFlags"),
                "paperToPowerLabel": label_by_project.get(project_id, "claimed_not_observed"),
                "observedCapacityMw": observed_capacity,
                "observedAssetCount": observed_asset_count,
                "observedFirstSeenQuarter": observed_first_seen,
                "matchConfidence": match_confidence,
                "distanceKm": distance_km,
                "gridEvidenceClass": (
                    str(site_context.get("gridEvidenceClass"))
                    if isinstance(site_context, dict) and site_context.get("gridEvidenceClass")
                    else None
                ),
                "gridEvidenceReason": (
                    str(site_context.get("gridEvidenceReason"))
                    if isinstance(site_context, dict) and site_context.get("gridEvidenceReason")
                    else None
                ),
                "gridContextScore": grid_context_score,
                "gridMetadataScore": grid_metadata_score,
                "maxNearbyGridVoltageKv": max_nearby_grid_voltage_kv,
                "nearestSiteSideGridDistanceKm": nearest_site_side_grid_distance_km,
                "directConnectedSubstationCount": (
                    int(site_context.get("directConnectedSubstationCount"))
                    if isinstance(site_context, dict) and isinstance(site_context.get("directConnectedSubstationCount"), int | float)
                    else None
                ),
                "directConnectedTransmissionCount": (
                    int(site_context.get("directConnectedTransmissionCount"))
                    if isinstance(site_context, dict) and isinstance(site_context.get("directConnectedTransmissionCount"), int | float)
                    else None
                ),
                "matchedAssetSiteId": (
                    str(match.get("siteId"))
                    if isinstance(match, dict) and match.get("siteId") is not None
                    else None
                ),
                "matchedAssetGeometry": (
                    simplify_geojson_geometry(asset.get("geometry"))
                    if isinstance(asset, dict)
                    else None
                ),
                "matchedAssetCentroidLatitude": (
                    float(asset.get("centroidLatitude"))
                    if isinstance(asset, dict) and isinstance(asset.get("centroidLatitude"), int | float)
                    else None
                ),
                "matchedAssetCentroidLongitude": (
                    float(asset.get("centroidLongitude"))
                    if isinstance(asset, dict) and isinstance(asset.get("centroidLongitude"), int | float)
                    else None
                ),
            }
        )

    projects.sort(key=lambda item: (str(item["countryCode"]), str(item["projectName"])))
    return projects


def dataset_to_plain(dataset: FrontendDataset) -> dict[str, Any]:
    return {
        "featureCards": [asdict(item) for item in dataset.featureCards],
        "countrySummaries": [asdict(item) for item in dataset.countrySummaries],
        "regionalLinks": [
            {
                "from": item.from_country,
                "to": item.to_country,
                "kind": item.kind,
            }
            for item in dataset.regionalLinks
        ],
        "evidenceRows": build_evidence_rows(dataset.evidenceRows, dataset.countrySummaries),
        "caseStudies": [asdict(item) for item in dataset.caseStudies],
        "publicSources": [asdict(item) for item in dataset.publicSources],
        "registryMapProjects": build_registry_map_projects(),
    }


def render_ts_module(payload: dict[str, Any]) -> str:
    serialized = json.dumps(payload, indent=2, ensure_ascii=True)
    return "\n".join(
        [
            "import type {",
            "  CaseStudy,",
            "  CountrySummary,",
            "  EvidenceRow,",
            "  FeatureCard,",
            "  PublicSource,",
            "  RegistryMapProject,",
            "  RegionalLink,",
            "} from '../types/domain'",
            "",
            "const dataset =",
            f"{serialized} as const satisfies {{",
            "  featureCards: readonly FeatureCard[]",
            "  countrySummaries: readonly CountrySummary[]",
            "  regionalLinks: readonly RegionalLink[]",
            "  evidenceRows: readonly EvidenceRow[]",
            "  caseStudies: readonly CaseStudy[]",
            "  publicSources: readonly PublicSource[]",
            "  registryMapProjects: readonly RegistryMapProject[]",
            "}",
            "",
            "export const featureCards = dataset.featureCards",
            "export const countrySummaries = dataset.countrySummaries",
            "export const regionalLinks = dataset.regionalLinks",
            "export const evidenceRows = dataset.evidenceRows",
            "export const caseStudies = dataset.caseStudies",
            "export const publicSources = dataset.publicSources",
            "export const registryMapProjects = dataset.registryMapProjects",
            "",
        ]
    )


def main() -> None:
    dataset = build_dataset()
    payload = dataset_to_plain(dataset)
    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
    FRONTEND_DATA_DIR.mkdir(parents=True, exist_ok=True)

    GENERATED_JSON.write_text(
        json.dumps(payload, indent=2, ensure_ascii=True) + "\n",
        encoding="utf-8",
    )
    GENERATED_TS.write_text(render_ts_module(payload), encoding="utf-8")
    print(f"Wrote {GENERATED_JSON.relative_to(ROOT)}")
    print(f"Wrote {GENERATED_TS.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
