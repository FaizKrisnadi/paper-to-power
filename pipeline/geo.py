from __future__ import annotations

import math
from typing import Any


def haversine_km(
    latitude_a: float,
    longitude_a: float,
    latitude_b: float,
    longitude_b: float,
) -> float:
    radius_km = 6371.0088
    lat1 = math.radians(latitude_a)
    lon1 = math.radians(longitude_a)
    lat2 = math.radians(latitude_b)
    lon2 = math.radians(longitude_b)
    delta_lat = lat2 - lat1
    delta_lon = lon2 - lon1

    hav = (
        math.sin(delta_lat / 2) ** 2
        + math.cos(lat1) * math.cos(lat2) * math.sin(delta_lon / 2) ** 2
    )
    return radius_km * (2 * math.atan2(math.sqrt(hav), math.sqrt(1 - hav)))


def extract_geometry_points(geometry: dict[str, Any]) -> list[tuple[float, float]]:
    geometry_type = geometry.get("type")
    coordinates = geometry.get("coordinates")
    if not isinstance(geometry_type, str):
        return []

    if geometry_type == "Point" and _is_position(coordinates):
        lon, lat = coordinates[0], coordinates[1]
        return [(float(lat), float(lon))]

    points: list[tuple[float, float]] = []

    def walk(node: Any) -> None:
        if _is_position(node):
            lon, lat = node[0], node[1]
            points.append((float(lat), float(lon)))
            return
        if isinstance(node, list):
            for child in node:
                walk(child)

    walk(coordinates)
    return points


def centroid_from_geometry(geometry: dict[str, Any]) -> tuple[float, float] | None:
    points = extract_geometry_points(geometry)
    if not points:
        return None
    lat = sum(point[0] for point in points) / len(points)
    lon = sum(point[1] for point in points) / len(points)
    return (round(lat, 7), round(lon, 7))


def _is_position(node: Any) -> bool:
    return (
        isinstance(node, list)
        and len(node) >= 2
        and isinstance(node[0], int | float)
        and isinstance(node[1], int | float)
    )
