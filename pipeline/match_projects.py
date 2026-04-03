from __future__ import annotations
import re
from dataclasses import dataclass
from datetime import date
from pathlib import Path
from typing import Any, Literal

from .geo import haversine_km
from .io import read_json, write_json

ROOT = Path(__file__).resolve().parent.parent
PROJECT_REGISTRY_PATH = ROOT / "data" / "processed" / "project_registry.json"
OBSERVED_ASSETS_PATH = ROOT / "data" / "processed" / "observed_assets.json"
INTERIM_MATCHES_PATH = ROOT / "data" / "interim" / "project_asset_matches.json"
PROCESSED_MATCHES_PATH = ROOT / "data" / "processed" / "project_asset_matches.json"
PROCESSED_LABELS_PATH = ROOT / "data" / "processed" / "paper_to_power_labels.json"

PaperToPowerLabel = Literal[
    "claimed_not_observed",
    "observed_on_schedule",
    "observed_delayed",
    "observed_smaller_than_claimed",
    "observed_unmatched",
]


@dataclass(frozen=True)
class MatchCandidate:
    projectId: str
    siteId: str
    matchConfidence: float
    distanceKm: float
    distanceScore: float
    timeScore: float
    capacityScore: float
    scheduleVarianceMonths: int | None
    capacityVarianceMw: float | None


def load_records(path: Path, key: str) -> list[dict[str, Any]]:
    payload = read_json(path)
    if not isinstance(payload, dict):
        raise ValueError(f"{path.name} must contain an object")
    records = payload.get(key)
    if not isinstance(records, list):
        raise ValueError(f"{path.name} must contain a list at '{key}'")
    return [record for record in records if isinstance(record, dict)]


def parse_quarter_index(value: str | None) -> int | None:
    if value is None:
        return None
    text = value.strip()
    if not text:
        return None

    quarter_match = re.search(r"(\d{4})\s*[Qq]([1-4])", text)
    if quarter_match:
        year = int(quarter_match.group(1))
        quarter = int(quarter_match.group(2))
        return year * 4 + (quarter - 1)

    date_match = re.search(r"(\d{4})-(\d{2})-(\d{2})", text)
    if date_match:
        year = int(date_match.group(1))
        month = int(date_match.group(2))
        quarter = ((month - 1) // 3) + 1
        return year * 4 + (quarter - 1)

    year_match = re.search(r"\b(19|20)\d{2}\b", text)
    if year_match:
        year = int(year_match.group(0))
        return year * 4 + 3

    return None


def quarter_delta_to_months(delta_quarters: int | None) -> int | None:
    if delta_quarters is None:
        return None
    return delta_quarters * 3


def distance_score(distance_km: float) -> float:
    if distance_km <= 5:
        return 1.0
    if distance_km <= 15:
        return 0.85
    if distance_km <= 30:
        return 0.7
    if distance_km <= 80:
        return 0.45
    if distance_km <= 150:
        return 0.2
    return 0.0


def time_score(claimed_cod: str | None, observed_first_seen: str | None) -> tuple[float, int | None]:
    claimed_index = parse_quarter_index(claimed_cod)
    observed_index = parse_quarter_index(observed_first_seen)
    if claimed_index is None or observed_index is None:
        return (0.5, None)

    delta = observed_index - claimed_index
    absolute_delta = abs(delta)
    if absolute_delta <= 2:
        return (1.0, delta)
    if absolute_delta <= 4:
        return (0.75, delta)
    if absolute_delta <= 8:
        return (0.45, delta)
    return (0.15, delta)


def capacity_score(
    claimed_capacity_mw: float | None,
    observed_capacity_proxy_mw: float | None,
) -> tuple[float, float | None]:
    if claimed_capacity_mw is None or observed_capacity_proxy_mw is None:
        return (0.5, None)
    if claimed_capacity_mw <= 0:
        return (0.5, None)

    ratio = observed_capacity_proxy_mw / claimed_capacity_mw
    variance = observed_capacity_proxy_mw - claimed_capacity_mw
    if 0.8 <= ratio <= 1.25:
        return (1.0, variance)
    if 0.65 <= ratio <= 1.4:
        return (0.7, variance)
    if 0.45 <= ratio <= 1.7:
        return (0.4, variance)
    return (0.15, variance)


def build_candidate(
    project: dict[str, Any],
    asset: dict[str, Any],
) -> MatchCandidate | None:
    if project.get("countryCode") != asset.get("countryCode"):
        return None
    if project.get("technology") != asset.get("technology"):
        return None

    project_lat = project.get("latitude")
    project_lon = project.get("longitude")
    asset_lat = asset.get("centroidLatitude")
    asset_lon = asset.get("centroidLongitude")
    if not isinstance(project_lat, int | float) or not isinstance(project_lon, int | float):
        return None
    if not isinstance(asset_lat, int | float) or not isinstance(asset_lon, int | float):
        return None

    distance_km = haversine_km(
        float(project_lat),
        float(project_lon),
        float(asset_lat),
        float(asset_lon),
    )
    geo_score = distance_score(distance_km)
    if geo_score <= 0:
        return None

    temporal_score, quarter_delta = time_score(
        project.get("claimedCod"),
        asset.get("observedFirstSeenQuarter"),
    )
    size_score, capacity_variance = capacity_score(
        project.get("claimedCapacityMw"),
        asset.get("estimatedCapacityProxyMw"),
    )

    confidence = round((geo_score * 0.6) + (temporal_score * 0.25) + (size_score * 0.15), 4)
    if confidence < 0.55:
        return None

    return MatchCandidate(
        projectId=str(project["projectId"]),
        siteId=str(asset["siteId"]),
        matchConfidence=confidence,
        distanceKm=round(distance_km, 3),
        distanceScore=geo_score,
        timeScore=temporal_score,
        capacityScore=size_score,
        scheduleVarianceMonths=quarter_delta_to_months(quarter_delta),
        capacityVarianceMw=round(capacity_variance, 3) if capacity_variance is not None else None,
    )


def classify_match(
    project: dict[str, Any],
    asset: dict[str, Any],
    candidate: MatchCandidate,
) -> PaperToPowerLabel:
    claimed_capacity = project.get("claimedCapacityMw")
    observed_capacity = asset.get("estimatedCapacityProxyMw")
    if (
        isinstance(claimed_capacity, int | float)
        and isinstance(observed_capacity, int | float)
        and claimed_capacity > 0
        and observed_capacity / claimed_capacity < 0.65
    ):
        return "observed_smaller_than_claimed"

    if candidate.scheduleVarianceMonths is not None and abs(candidate.scheduleVarianceMonths) > 6:
        return "observed_delayed"

    return "observed_on_schedule"


def greedy_match(
    projects: list[dict[str, Any]],
    assets: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    project_lookup = {str(project["projectId"]): project for project in projects}
    asset_lookup = {str(asset["siteId"]): asset for asset in assets}

    candidates: list[MatchCandidate] = []
    for project in projects:
        for asset in assets:
            candidate = build_candidate(project, asset)
            if candidate is not None:
                candidates.append(candidate)

    candidates.sort(
        key=lambda item: (item.matchConfidence, -item.distanceKm),
        reverse=True,
    )

    matched_project_ids: set[str] = set()
    matched_site_ids: set[str] = set()
    matches: list[dict[str, Any]] = []

    for candidate in candidates:
        if candidate.projectId in matched_project_ids or candidate.siteId in matched_site_ids:
            continue

        project = project_lookup[candidate.projectId]
        asset = asset_lookup[candidate.siteId]
        label = classify_match(project, asset, candidate)
        matches.append(
            {
                "matchId": f"{candidate.projectId}::{candidate.siteId}",
                "projectId": candidate.projectId,
                "siteId": candidate.siteId,
                "matchConfidence": candidate.matchConfidence,
                "matchingSignals": {
                    "distanceScore": candidate.distanceScore,
                    "timeScore": candidate.timeScore,
                    "capacityScore": candidate.capacityScore,
                },
                "paperToPowerLabel": label,
                "distanceKm": candidate.distanceKm,
                "scheduleVarianceMonths": candidate.scheduleVarianceMonths,
                "capacityVarianceMw": candidate.capacityVarianceMw,
            }
        )
        matched_project_ids.add(candidate.projectId)
        matched_site_ids.add(candidate.siteId)

    return matches


def build_labels(
    projects: list[dict[str, Any]],
    assets: list[dict[str, Any]],
    matches: list[dict[str, Any]],
) -> dict[str, Any]:
    matched_site_ids = {match["siteId"] for match in matches}

    project_labels = [
        {
            "projectId": project["projectId"],
            "countryCode": project["countryCode"],
            "technology": project["technology"],
            "paperToPowerLabel": next(
                (
                    match["paperToPowerLabel"]
                    for match in matches
                    if match["projectId"] == project["projectId"]
                ),
                "claimed_not_observed",
            ),
        }
        for project in projects
    ]

    asset_labels = [
        {
            "siteId": asset["siteId"],
            "countryCode": asset["countryCode"],
            "technology": asset["technology"],
            "paperToPowerLabel": (
                "observed_unmatched"
                if asset["siteId"] not in matched_site_ids
                else next(
                    match["paperToPowerLabel"]
                    for match in matches
                    if match["siteId"] == asset["siteId"]
                )
            ),
        }
        for asset in assets
    ]

    summary = summarize_labels(project_labels, asset_labels)
    return {
        "summary": summary,
        "projectLabels": project_labels,
        "assetLabels": asset_labels,
    }


def summarize_labels(
    project_labels: list[dict[str, Any]],
    asset_labels: list[dict[str, Any]],
) -> dict[str, Any]:
    project_counts: dict[str, int] = {}
    asset_counts: dict[str, int] = {}

    for label in project_labels:
        key = str(label["paperToPowerLabel"])
        project_counts[key] = project_counts.get(key, 0) + 1
    for label in asset_labels:
        key = str(label["paperToPowerLabel"])
        asset_counts[key] = asset_counts.get(key, 0) + 1

    return {
        "generatedAt": date.today().isoformat(),
        "projectCounts": project_counts,
        "assetCounts": asset_counts,
    }


def load_inputs() -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    if not PROJECT_REGISTRY_PATH.exists():
        raise FileNotFoundError(
            "Missing data/processed/project_registry.json. Run npm run ingest:gem first."
        )
    if not OBSERVED_ASSETS_PATH.exists():
        raise FileNotFoundError(
            "Missing data/processed/observed_assets.json. Run npm run ingest:grw first."
        )
    return (
        load_records(PROJECT_REGISTRY_PATH, "records"),
        load_records(OBSERVED_ASSETS_PATH, "records"),
    )


def main() -> None:
    try:
        projects, assets = load_inputs()
    except FileNotFoundError as exc:
        print(str(exc))
        return

    matches = greedy_match(projects, assets)
    labels = build_labels(projects, assets, matches)

    match_payload = {
        "summary": {
            "projectCount": len(projects),
            "assetCount": len(assets),
            "matchCount": len(matches),
        },
        "matches": matches,
    }

    write_json(INTERIM_MATCHES_PATH, match_payload)
    write_json(PROCESSED_MATCHES_PATH, match_payload)
    write_json(PROCESSED_LABELS_PATH, labels)

    print(f"Wrote {INTERIM_MATCHES_PATH.relative_to(ROOT)}")
    print(f"Wrote {PROCESSED_MATCHES_PATH.relative_to(ROOT)}")
    print(f"Wrote {PROCESSED_LABELS_PATH.relative_to(ROOT)}")
    print(
        f"Matched {len(matches)} project-to-asset pairs from "
        f"{len(projects)} projects and {len(assets)} observed assets"
    )


if __name__ == "__main__":
    main()
