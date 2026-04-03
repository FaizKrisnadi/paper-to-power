from __future__ import annotations

import json
import time
from pathlib import Path
from typing import Any

from .geospatial_runtime import ensure_modules
from .io import read_json, write_json

ROOT = Path(__file__).resolve().parent.parent
PROJECT_REGISTRY_PATH = ROOT / "data" / "processed" / "project_registry.json"
RAW_CONTEXT_DIR = ROOT / "data" / "raw" / "context" / "osm"
GEOSPATIAL_DIR = ROOT / "data" / "processed" / "geospatial"
OVERPASS_ENDPOINTS = [
    "https://lambert.openstreetmap.de/api/interpreter",
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
]

ROAD_VALUES = {"motorway", "trunk", "primary", "secondary", "tertiary"}
SETTLEMENT_VALUES = {"city", "town", "village", "hamlet", "suburb", "neighbourhood"}
TRANSMISSION_VALUES = {"line", "minor_line", "cable"}
DISTANCE_METERS = {
    "roads": 8000,
    "settlements": 12000,
    "power": 12000,
    "landuse": 4000,
}
FALLBACK_DISTANCE_METERS = {
    "roads": 5000,
    "settlements": 8000,
    "power": 8000,
    "landuse": 2000,
}


def load_projects() -> list[dict[str, Any]]:
    payload = read_json(PROJECT_REGISTRY_PATH)
    if not isinstance(payload, dict):
        raise ValueError("project_registry.json must contain an object")
    records = payload.get("records")
    if not isinstance(records, list):
        raise ValueError("project_registry.json must contain a records list")
    return [record for record in records if isinstance(record, dict)]


def build_query(latitude: float, longitude: float, distances: dict[str, int], include_landuse: bool = True) -> str:
    landuse_block = (
        f"""
  way(around:{distances["landuse"]},{latitude},{longitude})[landuse];
  relation(around:{distances["landuse"]},{latitude},{longitude})[landuse];
""".rstrip()
        if include_landuse
        else ""
    )
    return f"""
[out:json][timeout:90];
(
  way(around:{distances["roads"]},{latitude},{longitude})[highway~"{'|'.join(sorted(ROAD_VALUES))}"];
  node(around:{distances["settlements"]},{latitude},{longitude})[place~"{'|'.join(sorted(SETTLEMENT_VALUES))}"];
  nwr(around:{distances["power"]},{latitude},{longitude})[power=substation];
  nwr(around:{distances["power"]},{latitude},{longitude})[power~"{'|'.join(sorted(TRANSMISSION_VALUES))}"];
  {landuse_block}
);
out geom;
""".strip()


def fetch_project_context(project: dict[str, Any]) -> dict[str, Any]:
    import requests

    project_id = str(project.get("projectId") or "")
    latitude = project.get("latitude")
    longitude = project.get("longitude")
    if not project_id or not isinstance(latitude, int | float) or not isinstance(longitude, int | float):
        raise ValueError("Project record is missing projectId or coordinates")

    RAW_CONTEXT_DIR.mkdir(parents=True, exist_ok=True)
    cache_path = RAW_CONTEXT_DIR / f"{project_id}.json"
    if cache_path.exists():
        return read_json(cache_path)

    query_profiles = [
        build_query(float(latitude), float(longitude), DISTANCE_METERS, include_landuse=True),
        build_query(float(latitude), float(longitude), FALLBACK_DISTANCE_METERS, include_landuse=False),
    ]
    last_error: Exception | None = None
    for query in query_profiles:
        for endpoint in OVERPASS_ENDPOINTS:
            for attempt in range(3):
                try:
                    response = requests.post(
                        endpoint,
                        data={"data": query},
                        timeout=120,
                    )
                    response.raise_for_status()
                    payload = response.json()
                    write_json(cache_path, payload)
                    time.sleep(1.0)
                    return payload
                except Exception as exc:  # noqa: BLE001
                    last_error = exc
                    time.sleep(2.0 + attempt)
                    continue

    if last_error is not None:
        raise last_error
    raise RuntimeError(f"Failed to fetch OSM context for {project_id}")


def load_cached_project_context(project_id: str) -> dict[str, Any] | None:
    cache_path = RAW_CONTEXT_DIR / f"{project_id}.json"
    if not cache_path.exists():
        return None
    return read_json(cache_path)


def geometry_from_element(element: dict[str, Any], feature_class: str):
    from shapely.geometry import LineString, Point, Polygon

    if element.get("type") == "node":
        lat = element.get("lat")
        lon = element.get("lon")
        if isinstance(lat, int | float) and isinstance(lon, int | float):
            return Point(float(lon), float(lat))
        return None

    geometry = element.get("geometry")
    if not isinstance(geometry, list) or len(geometry) < 2:
        return None
    coords = [
        (float(point["lon"]), float(point["lat"]))
        for point in geometry
        if isinstance(point, dict)
        and isinstance(point.get("lon"), int | float)
        and isinstance(point.get("lat"), int | float)
    ]
    if len(coords) < 2:
        return None
    if feature_class in {"landuse", "substations"} and coords[0] == coords[-1] and len(coords) >= 4:
        return Polygon(coords)
    return LineString(coords)


def classify_element(tags: dict[str, Any]) -> str | None:
    highway = tags.get("highway")
    place = tags.get("place")
    power = tags.get("power")
    landuse = tags.get("landuse")

    if isinstance(highway, str) and highway in ROAD_VALUES:
        return "roads"
    if isinstance(place, str) and place in SETTLEMENT_VALUES:
        return "settlements"
    if power == "substation":
        return "substations"
    if isinstance(power, str) and power in TRANSMISSION_VALUES:
        return "transmission"
    if isinstance(landuse, str) and landuse.strip():
        return "landuse"
    return None


def build_layer_rows(project: dict[str, Any], payload: dict[str, Any]) -> dict[str, list[dict[str, Any]]]:
    rows_by_layer: dict[str, list[dict[str, Any]]] = {
        "roads": [],
        "settlements": [],
        "substations": [],
        "transmission": [],
        "landuse": [],
    }
    elements = payload.get("elements")
    if not isinstance(elements, list):
        return rows_by_layer

    project_id = str(project.get("projectId") or "")
    project_name = str(project.get("projectName") or project_id)
    country_code = str(project.get("countryCode") or "")

    for element in elements:
        if not isinstance(element, dict):
            continue
        tags = element.get("tags")
        if not isinstance(tags, dict):
            continue
        layer = classify_element(tags)
        if layer is None:
            continue
        geometry = geometry_from_element(element, layer)
        if geometry is None:
            continue

        rows_by_layer[layer].append(
            {
                "contextFeatureId": f"{project_id}::{layer}::{element.get('type')}::{element.get('id')}",
                "projectId": project_id,
                "projectName": project_name,
                "countryCode": country_code,
                "osmType": element.get("type"),
                "osmId": element.get("id"),
                "highway": tags.get("highway"),
                "place": tags.get("place"),
                "power": tags.get("power"),
                "landuse": tags.get("landuse"),
                "name": tags.get("name"),
                "voltage": tags.get("voltage"),
                "circuits": tags.get("circuits"),
                "cables": tags.get("cables"),
                "frequency": tags.get("frequency"),
                "substationTag": tags.get("substation"),
                "lineTag": tags.get("line"),
                "operator": tags.get("operator"),
                "location": tags.get("location"),
                "geometry": geometry,
            }
        )

    return rows_by_layer


def write_layer_outputs(name: str, rows: list[dict[str, Any]]) -> None:
    import geopandas as gpd

    gdf = gpd.GeoDataFrame(rows, geometry="geometry", crs="EPSG:4326")
    GEOSPATIAL_DIR.mkdir(parents=True, exist_ok=True)
    gdf.to_file(GEOSPATIAL_DIR / f"context_{name}.geojson", driver="GeoJSON")
    gdf.to_parquet(GEOSPATIAL_DIR / f"context_{name}.parquet", index=False)


def compile_cached_context_layers(
    projects: list[dict[str, Any]],
    failures: list[dict[str, str]] | None = None,
) -> dict[str, Any]:
    aggregated: dict[str, list[dict[str, Any]]] = {
        "roads": [],
        "settlements": [],
        "substations": [],
        "transmission": [],
        "landuse": [],
    }
    missing_projects: list[str] = []

    for project in projects:
        project_id = str(project.get("projectId") or "")
        payload = load_cached_project_context(project_id)
        if payload is None:
            missing_projects.append(project_id)
            continue
        rows_by_layer = build_layer_rows(project, payload)
        for layer_name, rows in rows_by_layer.items():
            aggregated[layer_name].extend(rows)

    for layer_name, rows in aggregated.items():
        write_layer_outputs(layer_name, rows)

    summary = {
        "layers": [
            {"name": layer_name, "recordCount": len(rows)}
            for layer_name, rows in aggregated.items()
        ],
        "missingProjects": missing_projects,
        "failures": failures or [],
    }
    write_json(GEOSPATIAL_DIR / "context_layers_summary.json", summary)
    return summary


def main() -> None:
    ensure_modules(
        ["geopandas", "pyarrow", "shapely", "requests"],
        module_name="pipeline.fetch_osm_context",
    )

    projects = load_projects()
    failures: list[dict[str, str]] = []

    for project in projects:
        try:
            fetch_project_context(project)
        except Exception as exc:  # noqa: BLE001
            failures.append(
                {
                    "projectId": str(project.get("projectId") or ""),
                    "error": str(exc),
                }
            )
            continue

    compile_cached_context_layers(projects, failures)
    print(f"Wrote {(GEOSPATIAL_DIR / 'context_layers_summary.json').relative_to(ROOT)}")


if __name__ == "__main__":
    main()
