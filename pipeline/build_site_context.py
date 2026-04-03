from __future__ import annotations

from pathlib import Path
from typing import Any
import re

from .geospatial_runtime import ensure_modules
from .io import read_json, write_json

ROOT = Path(__file__).resolve().parent.parent
PROJECT_REGISTRY_PATH = ROOT / "data" / "processed" / "project_registry.json"
OBSERVED_ASSETS_PATH = ROOT / "data" / "processed" / "observed_assets.json"
MATCHES_PATH = ROOT / "data" / "processed" / "project_asset_matches.json"
OUTPUT_DIR = ROOT / "data" / "processed" / "geospatial"
CONTEXT_LAYER_NAMES = [
    "roads",
    "settlements",
    "substations",
    "transmission",
    "landuse",
]


def load_records(path: Path, key: str) -> list[dict[str, Any]]:
    payload = read_json(path)
    if not isinstance(payload, dict):
        raise ValueError(f"{path.name} must contain an object")
    records = payload.get(key)
    if not isinstance(records, list):
        raise ValueError(f"{path.name} must contain a list at '{key}'")
    return [record for record in records if isinstance(record, dict)]


def cluster_score(count: int, technology: str) -> float:
    saturation = 10 if technology == "solar" else 24
    return round(min(count / saturation, 1.0), 3)


def proximity_score(distance_km: float | None, bands: list[tuple[float, float]]) -> float | None:
    if distance_km is None:
        return None
    for threshold, score in bands:
        if distance_km <= threshold:
            return score
    return 0.0


def landuse_score(landuse: str | None, distance_km: float | None) -> float | None:
    if landuse is None or distance_km is None:
        return None
    favorable = {"industrial", "brownfield", "quarry", "construction", "commercial", "farmyard", "landfill"}
    neutral = {"farmland", "orchard", "plant_nursery", "meadow", "grass"}
    constrained = {"residential", "forest", "recreation_ground", "cemetery", "village_green"}
    if landuse in favorable:
        return proximity_score(distance_km, [(1.0, 1.0), (3.0, 0.8), (5.0, 0.6)])
    if landuse in neutral:
        return proximity_score(distance_km, [(1.0, 0.65), (3.0, 0.55), (5.0, 0.45)])
    if landuse in constrained:
        return proximity_score(distance_km, [(1.0, 0.2), (3.0, 0.15), (5.0, 0.1)])
    return proximity_score(distance_km, [(1.0, 0.5), (3.0, 0.4), (5.0, 0.3)])


def weighted_score(parts: list[tuple[float | None, float]]) -> float:
    numerator = 0.0
    denominator = 0.0
    for value, weight in parts:
        if value is None:
            continue
        numerator += value * weight
        denominator += weight
    if denominator == 0:
        return 0.0
    return round(numerator / denominator, 3)


def write_outputs(name: str, gdf, records: list[dict[str, Any]]) -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    geojson_path = OUTPUT_DIR / f"{name}.geojson"
    parquet_path = OUTPUT_DIR / f"{name}.parquet"
    json_path = OUTPUT_DIR / f"{name}.json"
    gdf.to_file(geojson_path, driver="GeoJSON")
    gdf.to_parquet(parquet_path, index=False)
    write_json(
        json_path,
        {
            "summary": {"recordCount": len(records)},
            "records": [json_safe_record(record) for record in records],
        },
    )


def json_safe_value(value: Any) -> Any:
    if hasattr(value, "item"):
        return value.item()
    return value


def json_safe_record(record: dict[str, Any]) -> dict[str, Any]:
    return {key: json_safe_value(value) for key, value in record.items()}


def records_to_gdf(records: list[dict[str, Any]]):
    import geopandas as gpd

    if records:
        return gpd.GeoDataFrame(records, geometry="geometry", crs="EPSG:4326")
    return gpd.GeoDataFrame({"geometry": []}, geometry="geometry", crs="EPSG:4326")


def load_context_layers():
    import geopandas as gpd

    layers: dict[str, Any] = {}
    for name in CONTEXT_LAYER_NAMES:
        path = OUTPUT_DIR / f"context_{name}.parquet"
        if path.exists():
            layers[name] = gpd.read_parquet(path)
        else:
            layers[name] = None
    return layers


def dedupe_project_layer(layer, project_id: str):
    if layer is None:
        return None
    subset = layer[layer["projectId"] == project_id].copy()
    if subset.empty:
        return subset
    subset["featureKey"] = subset.apply(
        lambda row: f"{row.get('countryCode') or ''}:{row.get('osmType') or ''}:{row.get('osmId') or ''}",
        axis=1,
    )
    return subset.drop_duplicates(subset=["featureKey"]).copy()


def representative_point(geometry):
    if geometry is None or geometry.is_empty:
        return None
    return geometry.representative_point()


def geometry_distance_km(center_geometry, geometry, use_representative: bool = False) -> float | None:
    if geometry is None or geometry.is_empty:
        return None
    metric_geometry = representative_point(geometry) if use_representative else geometry
    if metric_geometry is None or metric_geometry.is_empty:
        return None
    return round(float(metric_geometry.distance(center_geometry)) / 1000.0, 3)


def ranked_candidates(subset, center_geometry, max_distance_km: float, use_representative: bool = False):
    if subset is None or subset.empty:
        return []
    candidates: list[dict[str, Any]] = []
    for _, row in subset.iterrows():
        distance_km = geometry_distance_km(
            center_geometry,
            row.geometry,
            use_representative=use_representative,
        )
        if distance_km is None or distance_km > max_distance_km:
            continue
        candidates.append({"row": row, "distanceKm": distance_km})
    candidates.sort(key=lambda candidate: candidate["distanceKm"])
    return candidates


def make_edge_geometry(source_geometry, target_geometry):
    from shapely.geometry import LineString

    source_point = representative_point(source_geometry)
    target_point = representative_point(target_geometry)
    if source_point is None or target_point is None:
        return None
    return LineString([source_point, target_point])


def path_step_score(path_steps: int | None) -> float | None:
    if path_steps is None:
        return None
    if path_steps <= 1:
        return 1.0
    if path_steps == 2:
        return 0.85
    if path_steps == 3:
        return 0.65
    return 0.4


def parse_numeric_tokens(value: Any) -> list[float]:
    if value is None:
        return []
    text = str(value).strip()
    if not text:
        return []
    parts = re.split(r"[;,/ ]+", text)
    numbers: list[float] = []
    for part in parts:
        token = part.strip()
        if not token:
            continue
        try:
            numbers.append(float(token))
        except ValueError:
            continue
    return numbers


def max_voltage_kv(value: Any) -> float | None:
    numbers = parse_numeric_tokens(value)
    if not numbers:
        return None
    volts = max(numbers)
    if volts <= 0:
        return None
    return round(volts / 1000.0 if volts > 1000 else volts, 3)


def max_int_value(value: Any) -> int | None:
    numbers = parse_numeric_tokens(value)
    if not numbers:
        return None
    return int(max(numbers))


def substation_metadata_score(row: dict[str, Any]) -> float:
    voltage_kv = max_voltage_kv(row.get("voltage"))
    substation_tag = str(row.get("substationTag") or "").lower()
    score = 0.1
    if substation_tag == "transmission":
        score += 0.55
    elif substation_tag in {"distribution", "minor_distribution"}:
        score += 0.15
    elif substation_tag == "yes":
        score += 0.25
    if voltage_kv is not None:
        if voltage_kv >= 220:
            score += 0.35
        elif voltage_kv >= 110:
            score += 0.3
        elif voltage_kv >= 66:
            score += 0.2
        elif voltage_kv >= 33:
            score += 0.1
    if row.get("operator"):
        score += 0.05
    if str(row.get("location") or "").lower() == "outdoor":
        score += 0.03
    return round(min(score, 1.0), 3)


def transmission_metadata_score(row: dict[str, Any]) -> float:
    voltage_kv = max_voltage_kv(row.get("voltage"))
    circuits = max_int_value(row.get("circuits"))
    cables = max_int_value(row.get("cables"))
    line_tag = str(row.get("lineTag") or "").lower()
    score = 0.1
    if voltage_kv is not None:
        if voltage_kv >= 220:
            score += 0.45
        elif voltage_kv >= 110:
            score += 0.38
        elif voltage_kv >= 66:
            score += 0.26
        elif voltage_kv >= 33:
            score += 0.12
    if circuits is not None:
        score += min(circuits, 4) * 0.05
    if cables is not None:
        score += min(cables, 6) * 0.02
    if line_tag in {"busbar", "bay"}:
        score -= 0.15
    if row.get("operator"):
        score += 0.03
    return round(min(max(score, 0.0), 1.0), 3)


def is_transmission_grade_substation(row: dict[str, Any]) -> bool:
    voltage_kv = max_voltage_kv(row.get("voltage"))
    substation_tag = str(row.get("substationTag") or "").lower()
    return bool(
        substation_tag == "transmission"
        or (voltage_kv is not None and voltage_kv >= 66)
    )


def is_transmission_grade_line(row: dict[str, Any]) -> bool:
    voltage_kv = max_voltage_kv(row.get("voltage"))
    line_tag = str(row.get("lineTag") or "").lower()
    if line_tag in {"busbar", "bay"}:
        return False
    return bool(voltage_kv is not None and voltage_kv >= 66)


def voltage_compatibility_score(substation_row: dict[str, Any], transmission_row: dict[str, Any]) -> float:
    substation_kv = max_voltage_kv(substation_row.get("voltage"))
    transmission_kv = max_voltage_kv(transmission_row.get("voltage"))
    if substation_kv is None or transmission_kv is None:
        return 0.55
    ratio = max(substation_kv, transmission_kv) / max(min(substation_kv, transmission_kv), 1.0)
    if ratio <= 1.1:
        return 1.0
    if ratio <= 1.5:
        return 0.8
    if ratio <= 2.5:
        return 0.55
    return 0.25


def classify_grid_evidence(
    *,
    has_connected_grid_candidate: bool,
    grid_metadata_score: float,
    metadata_rich_substation_count: int,
    metadata_rich_transmission_count: int,
    metadata_rich_bridge_count: int,
    distribution_substation_count: int,
    max_nearby_grid_voltage_kv: float | None,
    direct_connected_substation_count: int,
    direct_connected_transmission_count: int,
    nearest_site_side_grid_distance_km: float | None,
) -> tuple[str, str]:
    if (
        direct_connected_substation_count > 0
        and grid_metadata_score >= 0.65
        and isinstance(nearest_site_side_grid_distance_km, float)
        and nearest_site_side_grid_distance_km <= 10.0
    ):
        voltage_text = (
            f"max mapped voltage {max_nearby_grid_voltage_kv:.0f} kV"
            if isinstance(max_nearby_grid_voltage_kv, float)
            else "mapped transmission-grade power features"
        )
        return (
            "transmission_grade_connected",
            (
                f"{direct_connected_substation_count} direct connected substations within {nearest_site_side_grid_distance_km:.1f} km, "
                f"{metadata_rich_transmission_count} transmission lines, "
                f"{metadata_rich_bridge_count} credible substation-line bridges; {voltage_text}."
            ),
        )
    if (
        direct_connected_substation_count == 0
        and direct_connected_transmission_count > 0
        and has_connected_grid_candidate
        and grid_metadata_score >= 0.55
    ):
        voltage_text = (
            f"max mapped voltage {max_nearby_grid_voltage_kv:.0f} kV"
            if isinstance(max_nearby_grid_voltage_kv, float)
            else "mapped transmission corridor"
        )
        return (
            "transmission_corridor_only",
            (
                f"{direct_connected_transmission_count} site-side transmission corridor links but no direct connected substation candidate; "
                f"{metadata_rich_bridge_count} credible bridges; {voltage_text}."
            ),
        )
    if distribution_substation_count > 0 and metadata_rich_substation_count == 0 and metadata_rich_transmission_count == 0:
        return (
            "distribution_only_nearby",
            f"{distribution_substation_count} mapped distribution substations nearby, but no credible transmission-grade connection evidence.",
        )
    if (
        metadata_rich_substation_count > 0
        or metadata_rich_transmission_count > 0
        or (isinstance(max_nearby_grid_voltage_kv, float) and max_nearby_grid_voltage_kv >= 66)
    ):
        voltage_text = (
            f"max mapped voltage {max_nearby_grid_voltage_kv:.0f} kV"
            if isinstance(max_nearby_grid_voltage_kv, float)
            else "power infrastructure mapped nearby"
        )
        return (
            "power_infrastructure_nearby_but_ambiguous",
            (
                f"{voltage_text}; "
                f"{metadata_rich_substation_count} substations, "
                f"{metadata_rich_transmission_count} transmission lines, "
                f"{metadata_rich_bridge_count} credible bridges, but no confirmed site-side connected candidate."
            ),
        )
    return (
        "no_credible_grid_evidence",
        "No transmission-grade substation-line topology found in the local free-source context layers.",
    )


def main() -> None:
    ensure_modules(
        ["geopandas", "networkx", "pyarrow", "shapely"],
        module_name="pipeline.build_site_context",
    )

    import geopandas as gpd
    import networkx as nx
    from shapely.geometry import Point

    projects = load_records(PROJECT_REGISTRY_PATH, "records")
    assets = load_records(OBSERVED_ASSETS_PATH, "records")
    matches = load_records(MATCHES_PATH, "matches")
    context_layers = load_context_layers()

    asset_by_id = {str(asset.get("siteId")): asset for asset in assets}
    match_by_project = {str(match.get("projectId")): match for match in matches}

    asset_rows: list[dict[str, Any]] = []
    for asset in assets:
        latitude = asset.get("centroidLatitude")
        longitude = asset.get("centroidLongitude")
        if not isinstance(latitude, int | float) or not isinstance(longitude, int | float):
            continue
        row = dict(asset)
        row["geometry"] = Point(float(longitude), float(latitude))
        asset_rows.append(row)

    assets_gdf = gpd.GeoDataFrame(asset_rows, geometry="geometry", crs="EPSG:4326")
    records: list[dict[str, Any]] = []
    graph_nodes: list[dict[str, Any]] = []
    graph_edges: list[dict[str, Any]] = []

    for project in projects:
        latitude = project.get("latitude")
        longitude = project.get("longitude")
        technology = str(project.get("technology") or "")
        country_code = str(project.get("countryCode") or "")
        project_id = str(project.get("projectId") or "")
        if not (
            isinstance(latitude, int | float)
            and isinstance(longitude, int | float)
            and technology in {"solar", "wind"}
            and project_id
        ):
            continue

        match = match_by_project.get(project_id)
        matched_asset = asset_by_id.get(str(match.get("siteId"))) if isinstance(match, dict) else None
        center_lat = (
            float(matched_asset["centroidLatitude"])
            if isinstance(matched_asset, dict) and isinstance(matched_asset.get("centroidLatitude"), int | float)
            else float(latitude)
        )
        center_lon = (
            float(matched_asset["centroidLongitude"])
            if isinstance(matched_asset, dict) and isinstance(matched_asset.get("centroidLongitude"), int | float)
            else float(longitude)
        )

        center_gdf = gpd.GeoDataFrame(
            [{"geometry": Point(center_lon, center_lat)}],
            geometry="geometry",
            crs="EPSG:4326",
        ).to_crs(3857)
        center_geometry = center_gdf.iloc[0].geometry
        nearby = assets_gdf[
            (assets_gdf["countryCode"] == country_code)
            & (assets_gdf.geometry.to_crs(3857).distance(center_geometry) <= 5000)
        ]
        nearby_same_tech = nearby[nearby["technology"] == technology]

        nearest_distance_km = None
        if not nearby_same_tech.empty:
            distances = nearby_same_tech.geometry.to_crs(3857).distance(center_geometry)
            nearest_distance_km = round(float(distances.min()) / 1000.0, 3)

        roads = context_layers["roads"]
        settlements = context_layers["settlements"]
        substations = context_layers["substations"]
        transmission = context_layers["transmission"]
        landuse = context_layers["landuse"]

        roads_project = dedupe_project_layer(roads, project_id)
        settlements_project = dedupe_project_layer(settlements, project_id)
        substations_project = dedupe_project_layer(substations, project_id)
        transmission_project = dedupe_project_layer(transmission, project_id)
        landuse_project = dedupe_project_layer(landuse, project_id)
        roads_metric = roads_project.to_crs(3857) if roads_project is not None and not roads_project.empty else roads_project
        settlements_metric = (
            settlements_project.to_crs(3857)
            if settlements_project is not None and not settlements_project.empty
            else settlements_project
        )
        substations_metric = (
            substations_project.to_crs(3857)
            if substations_project is not None and not substations_project.empty
            else substations_project
        )
        transmission_metric = (
            transmission_project.to_crs(3857)
            if transmission_project is not None and not transmission_project.empty
            else transmission_project
        )

        def nearest_distance(layer, predicate=None):
            if layer is None:
                return None
            subset = dedupe_project_layer(layer, project_id)
            if predicate is not None:
                subset = subset[subset.apply(predicate, axis=1)]
            if subset.empty:
                return None
            distances = subset.geometry.to_crs(3857).distance(center_geometry)
            return round(float(distances.min()) / 1000.0, 3)

        road_distance_km = nearest_distance(roads)
        settlement_distance_km = nearest_distance(settlements)
        substation_distance_km = nearest_distance(substations)
        transmission_distance_km = nearest_distance(transmission)

        nearest_landuse_type = None
        landuse_distance_km = None
        if landuse_project is not None:
            subset = landuse_project
            if not subset.empty:
                distances = subset.geometry.to_crs(3857).distance(center_geometry)
                nearest_index = distances.idxmin()
                landuse_distance_km = round(float(distances.loc[nearest_index]) / 1000.0, 3)
                nearest_landuse_type = subset.loc[nearest_index].get("landuse")

        cluster_density_score = cluster_score(len(nearby_same_tech), technology)
        road_access_score = proximity_score(road_distance_km, [(1.0, 1.0), (3.0, 0.8), (7.0, 0.55), (15.0, 0.25)])
        settlement_proximity_score = proximity_score(settlement_distance_km, [(5.0, 1.0), (15.0, 0.8), (30.0, 0.5)])
        substation_access_score = proximity_score(substation_distance_km, [(3.0, 1.0), (8.0, 0.75), (15.0, 0.5), (30.0, 0.2)])
        transmission_proxy_score = proximity_score(transmission_distance_km, [(2.0, 1.0), (5.0, 0.8), (10.0, 0.5), (20.0, 0.2)])
        land_use_adjacency_score = landuse_score(
            nearest_landuse_type if isinstance(nearest_landuse_type, str) else None,
            landuse_distance_km,
        )
        proximity_context_score = weighted_score(
            [
                (cluster_density_score, 0.15),
                (road_access_score, 0.2),
                (settlement_proximity_score, 0.1),
                (land_use_adjacency_score, 0.15),
                (substation_access_score, 0.2),
                (transmission_proxy_score, 0.2),
            ]
        )

        graph = nx.Graph()
        site_node_id = f"{project_id}:site"
        site_geometry = Point(float(longitude), float(latitude))
        graph.add_node(site_node_id, nodeType="project_site")
        graph_nodes.append(
            {
                "nodeId": site_node_id,
                "nodeType": "project_site",
                "countryCode": country_code,
                "osmType": None,
                "osmId": None,
                "projectId": project_id,
                "projectName": project.get("projectName"),
                "distanceKm": 0.0,
                "geometry": site_geometry,
            }
        )

        graph_node_ids: set[str] = {site_node_id}

        def add_graph_node(node_type: str, row, distance_km: float):
            node_id = f"{project_id}:{node_type}:{row.get('osmType') or 'unknown'}:{row.get('osmId') or row.name}"
            if node_id in graph_node_ids:
                return node_id
            geometry = representative_point(row.geometry) if node_type == "settlement" else row.geometry
            metadata_score = None
            voltage_kv = max_voltage_kv(row.get("voltage"))
            if node_type == "substation":
                metadata_score = substation_metadata_score(row)
            elif node_type == "transmission_segment":
                metadata_score = transmission_metadata_score(row)
            graph.add_node(node_id, nodeType=node_type)
            graph_nodes.append(
                {
                    "nodeId": node_id,
                    "nodeType": node_type,
                    "countryCode": country_code,
                    "osmType": row.get("osmType"),
                    "osmId": row.get("osmId"),
                    "projectId": project_id,
                    "projectName": project.get("projectName"),
                    "distanceKm": distance_km,
                    "voltageKvMax": voltage_kv,
                    "circuits": max_int_value(row.get("circuits")),
                    "cables": max_int_value(row.get("cables")),
                    "operator": row.get("operator"),
                    "substationTag": row.get("substationTag"),
                    "lineTag": row.get("lineTag"),
                    "gridMetadataScore": metadata_score,
                    "geometry": geometry,
                }
            )
            graph_node_ids.add(node_id)
            return node_id

        def add_graph_edge(
            source_id: str,
            target_id: str,
            edge_type: str,
            distance_km: float,
            rank: int | None,
            source_geometry,
            target_geometry,
            metadata_score: float | None = None,
            voltage_compatible: bool | None = None,
        ) -> None:
            edge_id = f"{source_id}->{target_id}:{edge_type}"
            if graph.has_edge(source_id, target_id):
                return
            graph.add_edge(
                source_id,
                target_id,
                edgeType=edge_type,
                distanceKm=distance_km,
                rank=rank,
                metadataScore=metadata_score,
                voltageCompatible=voltage_compatible,
            )
            geometry = make_edge_geometry(source_geometry, target_geometry)
            if geometry is None:
                return
            graph_edges.append(
                {
                    "edgeId": edge_id,
                    "sourceNodeId": source_id,
                    "targetNodeId": target_id,
                    "edgeType": edge_type,
                    "distanceKm": distance_km,
                    "rank": rank,
                    "withinThreshold": True,
                    "metadataScore": metadata_score,
                    "voltageCompatible": voltage_compatible,
                    "projectId": project_id,
                    "countryCode": country_code,
                    "geometry": geometry,
                }
            )

        road_candidates = ranked_candidates(
            roads_metric,
            center_geometry,
            max_distance_km=15.0,
        )
        settlement_candidates = ranked_candidates(
            settlements_metric,
            center_geometry,
            max_distance_km=30.0,
            use_representative=True,
        )
        substation_candidates = ranked_candidates(
            substations_metric,
            center_geometry,
            max_distance_km=30.0,
        )
        transmission_candidates = ranked_candidates(
            transmission_metric,
            center_geometry,
            max_distance_km=20.0,
        )

        all_substation_nodes: list[dict[str, Any]] = []
        all_transmission_nodes: list[dict[str, Any]] = []

        for candidate in road_candidates[:1]:
            row_4326 = roads_project.loc[candidate["row"].name]
            road_node_id = add_graph_node("road_segment", row_4326, candidate["distanceKm"])
            add_graph_edge(
                site_node_id,
                road_node_id,
                "site_to_road",
                candidate["distanceKm"],
                1,
                site_geometry,
                row_4326.geometry,
            )

        for candidate in settlement_candidates[:1]:
            row_4326 = settlements_project.loc[candidate["row"].name]
            settlement_node_id = add_graph_node("settlement", row_4326, candidate["distanceKm"])
            add_graph_edge(
                site_node_id,
                settlement_node_id,
                "site_to_settlement",
                candidate["distanceKm"],
                1,
                site_geometry,
                row_4326.geometry,
            )

        for rank, candidate in enumerate(substation_candidates, start=1):
            row_4326 = substations_project.loc[candidate["row"].name]
            substation_node_id = add_graph_node("substation", row_4326, candidate["distanceKm"])
            substation_score = substation_metadata_score(row_4326)
            all_substation_nodes.append(
                {
                    "nodeId": substation_node_id,
                    "distanceKm": candidate["distanceKm"],
                    "row": row_4326,
                    "metadataScore": substation_score,
                    "voltageKvMax": max_voltage_kv(row_4326.get("voltage")),
                    "isTransmissionGrade": is_transmission_grade_substation(row_4326),
                }
            )
            if rank <= 3:
                site_substation_metadata_score = weighted_score(
                    [
                        (substation_score, 0.7),
                        (proximity_score(candidate["distanceKm"], [(3.0, 1.0), (8.0, 0.8), (15.0, 0.5), (30.0, 0.2)]), 0.3),
                    ]
                )
                add_graph_edge(
                    site_node_id,
                    substation_node_id,
                    "site_to_substation",
                    candidate["distanceKm"],
                    rank,
                    site_geometry,
                    row_4326.geometry,
                    metadata_score=site_substation_metadata_score,
                )

        for rank, candidate in enumerate(transmission_candidates, start=1):
            row_4326 = transmission_project.loc[candidate["row"].name]
            transmission_node_id = add_graph_node("transmission_segment", row_4326, candidate["distanceKm"])
            transmission_score = transmission_metadata_score(row_4326)
            all_transmission_nodes.append(
                {
                    "nodeId": transmission_node_id,
                    "distanceKm": candidate["distanceKm"],
                    "row": row_4326,
                    "metadataScore": transmission_score,
                    "voltageKvMax": max_voltage_kv(row_4326.get("voltage")),
                    "isTransmissionGrade": is_transmission_grade_line(row_4326),
                }
            )
            if rank <= 3:
                site_transmission_metadata_score = weighted_score(
                    [
                        (transmission_score, 0.7),
                        (proximity_score(candidate["distanceKm"], [(2.0, 1.0), (5.0, 0.8), (10.0, 0.5), (20.0, 0.2)]), 0.3),
                    ]
                )
                add_graph_edge(
                    site_node_id,
                    transmission_node_id,
                    "site_to_transmission",
                    candidate["distanceKm"],
                    rank,
                    site_geometry,
                    row_4326.geometry,
                    metadata_score=site_transmission_metadata_score,
                )

        bridge_count = 0
        metadata_rich_bridge_count = 0
        qualified_substation_nodes: set[str] = set()
        qualified_transmission_nodes: set[str] = set()
        for substation in all_substation_nodes:
            substation_node_id = substation["nodeId"]
            substation_row = substation["row"]
            substation_metric_geometry = substations_metric.loc[substation_row.name].geometry
            for transmission_feature in all_transmission_nodes:
                transmission_node_id = transmission_feature["nodeId"]
                transmission_row = transmission_feature["row"]
                transmission_metric_geometry = transmission_metric.loc[transmission_row.name].geometry
                bridge_distance_km = round(float(substation_metric_geometry.distance(transmission_metric_geometry)) / 1000.0, 3)
                if bridge_distance_km > 0.25:
                    continue
                compatibility_score = voltage_compatibility_score(substation_row, transmission_row)
                bridge_metadata_score = weighted_score(
                    [
                        (substation["metadataScore"], 0.35),
                        (transmission_feature["metadataScore"], 0.35),
                        (compatibility_score, 0.2),
                        (proximity_score(bridge_distance_km, [(0.02, 1.0), (0.05, 0.9), (0.1, 0.75), (0.25, 0.55)]), 0.1),
                    ]
                )
                voltage_compatible = compatibility_score >= 0.55
                add_graph_edge(
                    substation_node_id,
                    transmission_node_id,
                    "substation_to_transmission",
                    bridge_distance_km,
                    None,
                    substation_row.geometry,
                    transmission_row.geometry,
                    metadata_score=bridge_metadata_score,
                    voltage_compatible=voltage_compatible,
                )
                bridge_count += 1
                if (
                    substation["isTransmissionGrade"]
                    and transmission_feature["isTransmissionGrade"]
                    and bridge_metadata_score >= 0.6
                    and voltage_compatible
                ):
                    metadata_rich_bridge_count += 1
                    qualified_substation_nodes.add(substation_node_id)
                    qualified_transmission_nodes.add(transmission_node_id)

        connected_substation_nodes = {
            substation["nodeId"]
            for substation in all_substation_nodes
            if substation["nodeId"] in qualified_substation_nodes and substation["metadataScore"] >= 0.45
        }
        connected_transmission_nodes = {
            transmission_feature["nodeId"]
            for transmission_feature in all_transmission_nodes
            if transmission_feature["nodeId"] in qualified_transmission_nodes
            and transmission_feature["metadataScore"] >= 0.45
        }

        grid_candidate_nodes = set()
        for neighbor in graph.neighbors(site_node_id):
            edge_type = graph.edges[site_node_id, neighbor]["edgeType"]
            if edge_type not in {"site_to_substation", "site_to_transmission"}:
                continue
            if (graph.edges[site_node_id, neighbor].get("metadataScore") or 0.0) < 0.45:
                continue
            if neighbor in connected_substation_nodes or neighbor in connected_transmission_nodes:
                grid_candidate_nodes.add(neighbor)

        direct_connected_substation_nodes = {
            node_id for node_id in connected_substation_nodes if graph.has_edge(site_node_id, node_id)
        }
        direct_connected_transmission_nodes = {
            node_id for node_id in connected_transmission_nodes if graph.has_edge(site_node_id, node_id)
        }

        graph_grid_path_steps = None
        reachable_grid_nodes = connected_substation_nodes | connected_transmission_nodes
        if reachable_grid_nodes:
            path_lengths = [
                nx.shortest_path_length(graph, site_node_id, node_id)
                for node_id in reachable_grid_nodes
                if nx.has_path(graph, site_node_id, node_id)
            ]
            if path_lengths:
                graph_grid_path_steps = int(min(path_lengths))

        nearest_connected_substation_distance_km = None
        connected_substation_distances = [
            graph.edges[site_node_id, node_id]["distanceKm"]
            for node_id in connected_substation_nodes
            if graph.has_edge(site_node_id, node_id)
        ]
        if connected_substation_distances:
            nearest_connected_substation_distance_km = round(min(connected_substation_distances), 3)

        site_side_grid_distances = [
            graph.edges[site_node_id, node_id]["distanceKm"]
            for node_id in (direct_connected_substation_nodes | direct_connected_transmission_nodes)
            if graph.has_edge(site_node_id, node_id)
        ]
        nearest_site_side_grid_distance_km = (
            round(min(site_side_grid_distances), 3) if site_side_grid_distances else None
        )

        road_settlement_support_flag = int(
            isinstance(road_distance_km, float)
            and road_distance_km <= 7.0
            and isinstance(settlement_distance_km, float)
            and settlement_distance_km <= 15.0
        )
        metadata_rich_substation_count = sum(
            1 for substation in all_substation_nodes if substation["metadataScore"] >= 0.45
        )
        distribution_substation_count = sum(
            1
            for substation in all_substation_nodes
            if str(substation["row"].get("substationTag") or "").lower() in {"distribution", "minor_distribution"}
        )
        metadata_rich_transmission_count = sum(
            1 for transmission_feature in all_transmission_nodes if transmission_feature["metadataScore"] >= 0.45
        )
        max_nearby_grid_voltage_kv = None
        voltage_values = [
            value
            for feature in all_substation_nodes + all_transmission_nodes
            for value in [feature["voltageKvMax"]]
            if value is not None
        ]
        if voltage_values:
            max_nearby_grid_voltage_kv = round(max(voltage_values), 3)
        grid_metadata_score = weighted_score(
            [
                (min(metadata_rich_substation_count / 5.0, 1.0), 0.3),
                (min(metadata_rich_transmission_count / 8.0, 1.0), 0.25),
                (min(metadata_rich_bridge_count / 10.0, 1.0), 0.25),
                (
                    proximity_score(
                        nearest_connected_substation_distance_km,
                        [(3.0, 1.0), (8.0, 0.8), (15.0, 0.5), (30.0, 0.2)],
                    ),
                    0.2,
                ),
            ]
        )
        grid_candidate_score = round(min(len(grid_candidate_nodes) / 6.0, 1.0), 3)
        connected_substation_count_score = round(min(len(connected_substation_nodes) / 8.0, 1.0), 3)
        bridge_density_score = round(min(metadata_rich_bridge_count / 12.0, 1.0), 3)
        nearest_connected_substation_score = (
            proximity_score(nearest_connected_substation_distance_km, [(3.0, 1.0), (8.0, 0.75), (15.0, 0.5), (30.0, 0.2)])
            if nearest_connected_substation_distance_km is not None
            else (0.55 if grid_candidate_nodes else 0.0)
        )
        site_side_grid_reach_score = (
            proximity_score(
                nearest_site_side_grid_distance_km,
                [(2.0, 1.0), (5.0, 0.75), (8.0, 0.45), (12.0, 0.2), (20.0, 0.05)],
            )
            if nearest_site_side_grid_distance_km is not None
            else 0.0
        )
        direct_substation_presence_score = min(len(direct_connected_substation_nodes) / 2.0, 1.0)
        direct_transmission_presence_score = min(len(direct_connected_transmission_nodes) / 3.0, 1.0)
        graph_context_score = weighted_score(
            [
                (grid_candidate_score, 0.1),
                (connected_substation_count_score, 0.15),
                (bridge_density_score, 0.15),
                (nearest_connected_substation_score, 0.1),
                (site_side_grid_reach_score, 0.2),
                (direct_substation_presence_score, 0.15),
                (direct_transmission_presence_score, 0.1),
                (grid_metadata_score, 0.15),
                (1.0 if road_settlement_support_flag else 0.0, 0.05),
            ]
        )
        grid_evidence_class, grid_evidence_reason = classify_grid_evidence(
            has_connected_grid_candidate=bool(grid_candidate_nodes),
            grid_metadata_score=grid_metadata_score,
            metadata_rich_substation_count=metadata_rich_substation_count,
            metadata_rich_transmission_count=metadata_rich_transmission_count,
            metadata_rich_bridge_count=metadata_rich_bridge_count,
            distribution_substation_count=distribution_substation_count,
            max_nearby_grid_voltage_kv=max_nearby_grid_voltage_kv,
            direct_connected_substation_count=len(direct_connected_substation_nodes),
            direct_connected_transmission_count=len(direct_connected_transmission_nodes),
            nearest_site_side_grid_distance_km=nearest_site_side_grid_distance_km,
        )
        context_score = weighted_score(
            [
                (proximity_context_score, 0.7),
                (graph_context_score, 0.3),
            ]
        )

        record = {
            "projectId": project_id,
            "projectName": project.get("projectName"),
            "countryCode": country_code,
            "technology": technology,
            "paperToPowerLabel": match.get("paperToPowerLabel") if isinstance(match, dict) else "claimed_not_observed",
            "contextScoreVersion": "v2-local-graph",
            "contextScore": context_score,
            "partialContextScore": cluster_density_score,
            "proximityContextScore": proximity_context_score,
            "graphContextScoreVersion": "v2-local-graph",
            "graphContextScore": graph_context_score,
            "nearbyObservedAssetCount5km": int(len(nearby)),
            "nearbySameTechAssetCount5km": int(len(nearby_same_tech)),
            "nearestSameTechObservedDistanceKm": nearest_distance_km,
            "matchedLandCoverClass": (
                matched_asset.get("precedingLandUse") if isinstance(matched_asset, dict) else None
            ),
            "roadDistanceKm": road_distance_km,
            "settlementDistanceKm": settlement_distance_km,
            "landUseDistanceKm": landuse_distance_km,
            "substationDistanceKm": substation_distance_km,
            "transmissionDistanceKm": transmission_distance_km,
            "nearestLandUse": nearest_landuse_type,
            "roadAccessScore": road_access_score,
            "settlementProximityScore": settlement_proximity_score,
            "landUseAdjacencyScore": land_use_adjacency_score,
            "substationAccessScore": substation_access_score,
            "transmissionProxyScore": transmission_proxy_score,
            "graphNodeCount": graph.number_of_nodes(),
            "graphEdgeCount": graph.number_of_edges(),
            "connectedSubstationCount30km": len(connected_substation_nodes),
            "connectedTransmissionCount20km": len(connected_transmission_nodes),
            "directConnectedSubstationCount": len(direct_connected_substation_nodes),
            "directConnectedTransmissionCount": len(direct_connected_transmission_nodes),
            "metadataRichSubstationCount30km": metadata_rich_substation_count,
            "metadataRichTransmissionCount20km": metadata_rich_transmission_count,
            "distributionSubstationCount30km": distribution_substation_count,
            "gridConnectionCandidateCount": len(grid_candidate_nodes),
            "hasConnectedGridCandidate": bool(grid_candidate_nodes),
            "roadSettlementSupportFlag": road_settlement_support_flag,
            "graphGridPathSteps": graph_grid_path_steps,
            "nearestConnectedSubstationDistanceKm": nearest_connected_substation_distance_km,
            "nearestSiteSideGridDistanceKm": nearest_site_side_grid_distance_km,
            "substationTransmissionBridgeCount": bridge_count,
            "metadataRichBridgeCount": metadata_rich_bridge_count,
            "maxNearbyGridVoltageKv": max_nearby_grid_voltage_kv,
            "gridMetadataScore": grid_metadata_score,
            "gridEvidenceClass": grid_evidence_class,
            "gridEvidenceReason": grid_evidence_reason,
            "pendingSignals": [],
            "geometry": Point(float(longitude), float(latitude)),
        }
        records.append(record)

    context_gdf = records_to_gdf(records)
    write_outputs(
        "site_context_features",
        context_gdf,
        [
            {
                key: value
                for key, value in record.items()
                if key != "geometry"
            }
            for record in records
        ],
    )
    graph_nodes_gdf = records_to_gdf(graph_nodes)
    write_outputs(
        "context_graph_nodes",
        graph_nodes_gdf,
        [{key: value for key, value in record.items() if key != "geometry"} for record in graph_nodes],
    )
    graph_edges_gdf = records_to_gdf(graph_edges)
    write_outputs(
        "context_graph_edges",
        graph_edges_gdf,
        [{key: value for key, value in record.items() if key != "geometry"} for record in graph_edges],
    )
    print(f"Wrote {(OUTPUT_DIR / 'site_context_features.json').relative_to(ROOT)}")


if __name__ == "__main__":
    main()
