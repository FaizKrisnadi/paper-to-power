from __future__ import annotations

from pathlib import Path
from typing import Any

from .geospatial_runtime import ensure_modules
from .io import read_json, write_json

ROOT = Path(__file__).resolve().parent.parent
PROJECT_REGISTRY_PATH = ROOT / "data" / "processed" / "project_registry.json"
OBSERVED_ASSETS_PATH = ROOT / "data" / "processed" / "observed_assets.json"
MATCHES_PATH = ROOT / "data" / "processed" / "project_asset_matches.json"
LABELS_PATH = ROOT / "data" / "processed" / "paper_to_power_labels.json"
OUTPUT_DIR = ROOT / "data" / "processed" / "geospatial"


def load_records(path: Path, key: str) -> list[dict[str, Any]]:
    payload = read_json(path)
    if not isinstance(payload, dict):
        raise ValueError(f"{path.name} must contain an object")
    records = payload.get(key)
    if not isinstance(records, list):
        raise ValueError(f"{path.name} must contain a list at '{key}'")
    return [record for record in records if isinstance(record, dict)]


def build_project_points_gdf(projects: list[dict[str, Any]]):
    import geopandas as gpd
    from shapely.geometry import Point

    rows: list[dict[str, Any]] = []
    for project in projects:
        latitude = project.get("latitude")
        longitude = project.get("longitude")
        if not isinstance(latitude, int | float) or not isinstance(longitude, int | float):
            continue
        row = dict(project)
        row["geometry"] = Point(float(longitude), float(latitude))
        rows.append(row)
    return gpd.GeoDataFrame(rows, geometry="geometry", crs="EPSG:4326")


def build_observed_assets_gdf(assets: list[dict[str, Any]]):
    import geopandas as gpd
    from shapely.geometry import shape

    rows: list[dict[str, Any]] = []
    for asset in assets:
        geometry = asset.get("geometry")
        if not isinstance(geometry, dict):
            continue
        row = dict(asset)
        row["geometry"] = shape(geometry)
        rows.append(row)
    return gpd.GeoDataFrame(rows, geometry="geometry", crs="EPSG:4326")


def build_match_layers(
    projects: list[dict[str, Any]],
    assets: list[dict[str, Any]],
    matches: list[dict[str, Any]],
    labels: list[dict[str, Any]],
):
    import geopandas as gpd
    from shapely.geometry import LineString, Point, shape

    project_by_id = {str(project.get("projectId")): project for project in projects}
    asset_by_id = {str(asset.get("siteId")): asset for asset in assets}
    label_by_project = {
        str(label.get("projectId")): str(label.get("paperToPowerLabel"))
        for label in labels
        if label.get("projectId") is not None and label.get("paperToPowerLabel") is not None
    }

    matched_project_rows: list[dict[str, Any]] = []
    matched_asset_rows: list[dict[str, Any]] = []
    match_link_rows: list[dict[str, Any]] = []

    for match in matches:
        project_id = str(match.get("projectId") or "")
        site_id = str(match.get("siteId") or "")
        project = project_by_id.get(project_id)
        asset = asset_by_id.get(site_id)
        if project is None or asset is None:
            continue

        project_lat = project.get("latitude")
        project_lon = project.get("longitude")
        asset_lat = asset.get("centroidLatitude")
        asset_lon = asset.get("centroidLongitude")
        asset_geometry = asset.get("geometry")
        if not (
            isinstance(project_lat, int | float)
            and isinstance(project_lon, int | float)
            and isinstance(asset_lat, int | float)
            and isinstance(asset_lon, int | float)
            and isinstance(asset_geometry, dict)
        ):
            continue

        label = label_by_project.get(project_id, str(match.get("paperToPowerLabel") or "claimed_not_observed"))

        matched_project_rows.append(
            {
                "projectId": project_id,
                "projectName": project.get("projectName"),
                "countryCode": project.get("countryCode"),
                "technology": project.get("technology"),
                "paperToPowerLabel": label,
                "matchConfidence": match.get("matchConfidence"),
                "distanceKm": match.get("distanceKm"),
                "geometry": Point(float(project_lon), float(project_lat)),
            }
        )

        matched_asset_rows.append(
            {
                "siteId": site_id,
                "projectId": project_id,
                "projectName": project.get("projectName"),
                "countryCode": asset.get("countryCode"),
                "technology": asset.get("technology"),
                "paperToPowerLabel": label,
                "matchConfidence": match.get("matchConfidence"),
                "distanceKm": match.get("distanceKm"),
                "observedFirstSeenQuarter": asset.get("observedFirstSeenQuarter"),
                "estimatedCapacityProxyMw": asset.get("estimatedCapacityProxyMw"),
                "geometry": shape(asset_geometry),
            }
        )

        match_link_rows.append(
            {
                "matchId": match.get("matchId"),
                "projectId": project_id,
                "siteId": site_id,
                "projectName": project.get("projectName"),
                "paperToPowerLabel": label,
                "matchConfidence": match.get("matchConfidence"),
                "distanceKm": match.get("distanceKm"),
                "geometry": LineString(
                    [
                        (float(project_lon), float(project_lat)),
                        (float(asset_lon), float(asset_lat)),
                    ]
                ),
            }
        )

    return (
        gpd.GeoDataFrame(matched_project_rows, geometry="geometry", crs="EPSG:4326"),
        gpd.GeoDataFrame(matched_asset_rows, geometry="geometry", crs="EPSG:4326"),
        gpd.GeoDataFrame(match_link_rows, geometry="geometry", crs="EPSG:4326"),
    )


def write_geospatial_outputs(name: str, gdf) -> dict[str, Any]:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    geojson_path = OUTPUT_DIR / f"{name}.geojson"
    parquet_path = OUTPUT_DIR / f"{name}.parquet"
    gdf.to_file(geojson_path, driver="GeoJSON")
    gdf.to_parquet(parquet_path, index=False)
    return {
        "name": name,
        "recordCount": int(len(gdf)),
        "geojson": str(geojson_path.relative_to(ROOT)),
        "parquet": str(parquet_path.relative_to(ROOT)),
    }


def main() -> None:
    ensure_modules(
        ["geopandas", "pyarrow", "shapely"],
        module_name="pipeline.export_geospatial_layers",
    )

    projects = load_records(PROJECT_REGISTRY_PATH, "records")
    assets = load_records(OBSERVED_ASSETS_PATH, "records")
    matches = load_records(MATCHES_PATH, "matches")
    labels = load_records(LABELS_PATH, "projectLabels")

    project_points = build_project_points_gdf(projects)
    observed_assets = build_observed_assets_gdf(assets)
    matched_projects, matched_assets, match_links = build_match_layers(
        projects=projects,
        assets=assets,
        matches=matches,
        labels=labels,
    )

    summary = {
        "layers": [
            write_geospatial_outputs("project_registry_points", project_points),
            write_geospatial_outputs("observed_assets", observed_assets),
            write_geospatial_outputs("matched_projects", matched_projects),
            write_geospatial_outputs("matched_assets", matched_assets),
            write_geospatial_outputs("match_links", match_links),
        ]
    }
    write_json(OUTPUT_DIR / "summary.json", summary)
    print(f"Wrote {OUTPUT_DIR.relative_to(ROOT) / 'summary.json'}")


if __name__ == "__main__":
    main()
