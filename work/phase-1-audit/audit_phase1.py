from __future__ import annotations

import csv
import hashlib
import json
import math
import re
import subprocess
from collections import Counter, defaultdict
from datetime import date
from difflib import SequenceMatcher
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[2]
OUT = Path(__file__).resolve().parent
DATA = ROOT / "data"
TODAY = date(2026, 8, 4)


def read_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, payload: Any) -> None:
    path.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def write_csv(path: Path, rows: list[dict[str, Any]], fieldnames: list[str]) -> None:
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames, lineterminator="\n")
        writer.writeheader()
        writer.writerows(rows)


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def git_last_commit(path: Path) -> tuple[str, str]:
    relative = path.relative_to(ROOT)
    result = subprocess.run(
        ["git", "log", "-1", "--format=%H|%cI", "--", str(relative)],
        cwd=ROOT,
        check=True,
        capture_output=True,
        text=True,
    ).stdout.strip()
    if not result:
        return "untracked", "untracked"
    commit, committed_at = result.split("|", 1)
    return commit, committed_at


def normalize_name(value: str) -> str:
    text = value.lower()
    text = re.sub(r"\b(power plant|wind power plant|wind farm|solar farm|floating solar farm)\b", " ", text)
    text = re.sub(r"\b(i|1)\b", " 1 ", text)
    return re.sub(r"[^a-z0-9]+", "", text)


def haversine_km(a: dict[str, Any], b: dict[str, Any]) -> float:
    lat1, lon1 = math.radians(a["latitude"]), math.radians(a["longitude"])
    lat2, lon2 = math.radians(b["latitude"]), math.radians(b["longitude"])
    dlat, dlon = lat2 - lat1, lon2 - lon1
    value = math.sin(dlat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2
    return 6371.0088 * 2 * math.atan2(math.sqrt(value), math.sqrt(1 - value))


def coordinate_accuracy(flags: str | None) -> str:
    text = (flags or "").lower()
    if "exact" in text:
        return "exact"
    if "province" in text:
        return "province_representative"
    if "district" in text:
        return "district_representative"
    if "reservoir" in text:
        return "reservoir_representative"
    if "coastal" in text or "offshore" in text:
        return "coastal_block_representative"
    if "representative" in text:
        return "representative"
    return "unspecified"


def main() -> None:
    registry_path = DATA / "processed/project_registry.json"
    frontend_path = DATA / "processed/frontend_dataset.json"
    assets_path = DATA / "processed/observed_assets.json"
    matches_path = DATA / "processed/project_asset_matches.json"
    labels_path = DATA / "processed/paper_to_power_labels.json"
    geo_summary_path = DATA / "processed/geospatial/summary.json"
    site_context_path = DATA / "processed/geospatial/site_context_features.json"

    registry = read_json(registry_path)
    frontend = read_json(frontend_path)
    assets = read_json(assets_path)
    matches = read_json(matches_path)
    labels = read_json(labels_path)
    geo_summary = read_json(geo_summary_path)
    site_context = read_json(site_context_path)

    projects = registry["records"]
    public_projects = frontend["registryMapProjects"]
    observed_assets = assets["records"]
    match_rows = matches["matches"]
    project_labels = labels["projectLabels"]
    public_by_id = {row["projectId"]: row for row in public_projects}
    match_by_id = {row["projectId"]: row for row in match_rows}
    label_by_id = {row["projectId"]: row["paperToPowerLabel"] for row in project_labels}
    observed_countries = sorted({row["countryCode"] for row in observed_assets})

    duplicate_groups: dict[str, list[str]] = defaultdict(list)
    for index, left in enumerate(projects):
        for right in projects[index + 1 :]:
            if left["countryCode"] != right["countryCode"] or left["technology"] != right["technology"]:
                continue
            left_capacity = left.get("claimedCapacityMw")
            right_capacity = right.get("claimedCapacityMw")
            same_capacity = (
                isinstance(left_capacity, (int, float))
                and isinstance(right_capacity, (int, float))
                and abs(float(left_capacity) - float(right_capacity)) < 0.01
            )
            if not same_capacity:
                continue
            similarity = SequenceMatcher(None, normalize_name(str(left["projectName"])), normalize_name(str(right["projectName"]))).ratio()
            if similarity >= 0.72 and haversine_km(left, right) <= 20:
                group_id = f"DUP-{len(duplicate_groups) + 1:02d}"
                duplicate_groups[group_id] = [left["projectId"], right["projectId"]]

    duplicate_by_id = {project_id: group_id for group_id, ids in duplicate_groups.items() for project_id in ids}
    project_audit: list[dict[str, Any]] = []
    for project in projects:
        project_id = project["projectId"]
        public = public_by_id[project_id]
        match = match_by_id.get(project_id, {})
        label = label_by_id[project_id]
        coverage = project["countryCode"] in observed_countries
        issues: list[str] = []
        if not project.get("claimedCod"):
            issues.append("missing_claimed_cod")
        if not project.get("sourcePrimaryDate"):
            issues.append("missing_source_date")
        if not coverage:
            issues.append("observation_coverage_unavailable")
        if label == "claimed_not_observed" and not coverage:
            issues.append("negative_label_without_coverage")
        if label == "observed_on_schedule" and not project.get("claimedCod"):
            issues.append("schedule_label_without_claimed_cod")
        if label == "observed_smaller_than_claimed":
            issues.append("label_uses_capacity_proxy")
        if public.get("gridEvidenceClass") is None:
            issues.append("grid_context_unassessed")
        if project_id in duplicate_by_id:
            issues.append("probable_duplicate")
        project_audit.append({
            "project_id": project_id,
            "project_name": project["projectName"],
            "country_code": project["countryCode"],
            "technology": project["technology"],
            "claimed_status": project.get("claimedStatus") or "",
            "claimed_cod": project.get("claimedCod") or "",
            "claimed_capacity_mw": project.get("claimedCapacityMw") or "",
            "source_primary_date": project.get("sourcePrimaryDate") or "",
            "source_confidence": project.get("sourceConfidence") or "",
            "source_primary_url": project.get("sourcePrimaryUrl") or "",
            "coordinate_accuracy": coordinate_accuracy(project.get("dataQualityFlags")),
            "observation_coverage": "available" if coverage else "unavailable",
            "current_label": label,
            "matched_site_id": match.get("siteId") or "",
            "match_confidence": match.get("matchConfidence") if match else "",
            "distance_km": match.get("distanceKm") if match else "",
            "grid_context": public.get("gridEvidenceClass") or "unassessed",
            "duplicate_group": duplicate_by_id.get(project_id, ""),
            "issue_count": len(issues),
            "issues": ";".join(issues),
        })

    label_counts = Counter(row["current_label"] for row in project_audit)
    status_counts = Counter(row["claimed_status"] for row in project_audit)
    technology_counts = Counter(row["technology"] for row in project_audit)
    accuracy_counts = Counter(row["coordinate_accuracy"] for row in project_audit)
    grid_counts = Counter(row["grid_context"] for row in project_audit)
    missing_cod = sum(not row["claimed_cod"] for row in project_audit)
    missing_source_date = sum(not row["source_primary_date"] for row in project_audit)
    uncovered_negative = sum(row["current_label"] == "claimed_not_observed" and row["observation_coverage"] == "unavailable" for row in project_audit)
    schedule_without_cod = sum("schedule_label_without_claimed_cod" in row["issues"] for row in project_audit)
    unresolved_grid = grid_counts["unassessed"]

    geo_counts = {row["name"]: row["recordCount"] for row in geo_summary["layers"]}
    context_rows = site_context.get("features", site_context.get("records", []))
    artifact_rows = [
        {"artifact": "project_registry.json", "measure": "projects", "count": len(projects), "expected": len(projects), "status": "aligned"},
        {"artifact": "paper_to_power_labels.json", "measure": "project labels", "count": len(project_labels), "expected": len(projects), "status": "aligned" if len(project_labels) == len(projects) else "drift"},
        {"artifact": "project_asset_matches.json", "measure": "matches", "count": len(match_rows), "expected": len(match_rows), "status": "aligned"},
        {"artifact": "frontend_dataset.json", "measure": "frontend projects", "count": len(public_projects), "expected": len(projects), "status": "aligned" if len(public_projects) == len(projects) else "drift"},
        {"artifact": "geospatial/summary.json", "measure": "project points", "count": geo_counts.get("project_registry_points", 0), "expected": len(projects), "status": "drift" if geo_counts.get("project_registry_points", 0) != len(projects) else "aligned"},
        {"artifact": "geospatial/summary.json", "measure": "matched projects", "count": geo_counts.get("matched_projects", 0), "expected": len(match_rows), "status": "drift" if geo_counts.get("matched_projects", 0) != len(match_rows) else "aligned"},
        {"artifact": "geospatial/site_context_features.json", "measure": "site context rows", "count": len(context_rows), "expected": len(projects), "status": "review"},
    ]

    findings = [
        {"id": "F1", "severity": "critical", "finding": "Non-detection headline mixes missing coverage with non-matches", "affected": uncovered_negative, "denominator": label_counts["claimed_not_observed"], "rate": round(uncovered_negative / label_counts["claimed_not_observed"], 4), "confidence": "high", "impact": "The public percentage overstates projects for which observation evidence can answer the question.", "recommended_test": "Exclude coverage_unavailable and not_yet_due records from non-detection denominators."},
        {"id": "F2", "severity": "critical", "finding": "Smaller-than-claimed labels use placeholder capacity proxy", "affected": label_counts["observed_smaller_than_claimed"], "denominator": label_counts["observed_smaller_than_claimed"], "rate": 1.0, "confidence": "high", "impact": "The interface presents estimated partial-footprint capacity as verified observed build.", "recommended_test": "Prohibit observed-build labels from fields marked proxy or estimated."},
        {"id": "F3", "severity": "high", "finding": "Schedule labels are assigned without claimed commissioning dates", "affected": schedule_without_cod, "denominator": label_counts["observed_on_schedule"], "rate": round(schedule_without_cod / label_counts["observed_on_schedule"], 4), "confidence": "high", "impact": "On-schedule conclusions cannot be evaluated for most projects carrying that label.", "recommended_test": "Require a parseable claimed date and compatible observation date for schedule assessment."},
        {"id": "F4", "severity": "high", "finding": "Claimed commissioning dates are mostly missing", "affected": missing_cod, "denominator": len(projects), "rate": round(missing_cod / len(projects), 4), "confidence": "high", "impact": "Temporal eligibility and delay claims are not reliably computable.", "recommended_test": "Require a date or explicit not-assessable reason before schedule classification."},
        {"id": "F5", "severity": "high", "finding": "Source publication dates are mostly missing", "affected": missing_source_date, "denominator": len(projects), "rate": round(missing_source_date / len(projects), 4), "confidence": "high", "impact": "The registry has no defensible freshness measure for most project claims.", "recommended_test": "Require source_published_at or an explicit unavailable value plus claim_checked_at."},
        {"id": "F6", "severity": "high", "finding": "Probable duplicate projects remain in the registry", "affected": len(duplicate_by_id), "denominator": len(projects), "rate": round(len(duplicate_by_id) / len(projects), 4), "confidence": "high", "impact": "Counts and one-to-one matching can be inflated or distorted.", "recommended_test": "Enforce stable project-phase identifiers and near-duplicate review."},
        {"id": "F7", "severity": "high", "finding": "Geospatial exports are stale relative to the active registry", "affected": geo_counts.get("project_registry_points", 0), "denominator": len(projects), "rate": round(geo_counts.get("project_registry_points", 0) / len(projects), 4), "confidence": "high", "impact": "Different public or analytical outputs can describe different project populations.", "recommended_test": "Fail builds when generated artifact counts and input hashes disagree."},
        {"id": "F8", "severity": "high", "finding": "Grid context is unresolved for most projects", "affected": unresolved_grid, "denominator": len(projects), "rate": round(unresolved_grid / len(projects), 4), "confidence": "high", "impact": "Grid-readiness language generalizes beyond the assessed subset.", "recommended_test": "Expose not_assessed explicitly and keep it in every denominator."},
        {"id": "F9", "severity": "medium", "finding": "Live metadata and current product scope disagree", "affected": 1, "denominator": 1, "rate": 1.0, "confidence": "high", "impact": "Search and social previews describe five countries while the application and README describe ten.", "recommended_test": "Add content assertions tying metadata scope and headline metrics to generated data."},
        {"id": "F10", "severity": "medium", "finding": "Reproducibility controls are incomplete", "affected": 4, "denominator": 4, "rate": 1.0, "confidence": "high", "impact": "Python dependencies, automated tests, CI, and referenced documentation are missing.", "recommended_test": "Verify clean installation, test, lint, build, and documentation links in CI."},
    ]

    source_paths = [registry_path, frontend_path, assets_path, matches_path, labels_path, geo_summary_path, site_context_path, DATA / "raw/grw/solar_sea_2024q2_v1.geojson", DATA / "raw/grw/wind_sea_2024q2_v1.geojson", ROOT / "src/data/generated.ts", ROOT / "src/components/HeroSection.tsx", ROOT / "pipeline/ingest_grw.py", ROOT / "pipeline/match_projects.py"]
    source_manifest = []
    for path in source_paths:
        commit, committed_at = git_last_commit(path)
        source_manifest.append({"path": str(path.relative_to(ROOT)), "bytes": path.stat().st_size, "sha256": sha256(path), "git_commit": commit, "git_committed_at": committed_at})

    live_baseline = {
        "url": "https://energy.faizkrisnadi.com/",
        "retrieved_at": "2026-08-04T11:04:00+08:00",
        "html_bytes": 2464,
        "html_sha256": "2e5ee8a0a51e38257935dc0edba6c5db896a812d41b3319135fa75807c85bc99",
        "bundle_path": "/assets/index-Bn_ZyFKy.js",
        "bundle_bytes": 397269,
        "bundle_sha256": "043d6cc332e4df9020060d0ec645a78795a058dee634aef11f56806ba33cf036",
        "metadata_scope": "five countries",
        "application_scope": "ten countries",
    }
    summary = {
        "audit_date": TODAY.isoformat(),
        "repository_head": subprocess.run(["git", "rev-parse", "HEAD"], cwd=ROOT, check=True, capture_output=True, text=True).stdout.strip(),
        "grain": "one row per current registry project or project phase, though phase identity is not consistently defined",
        "registry": {"projects": len(projects), "countries": len({row["countryCode"] for row in projects}), "technologies": dict(sorted(technology_counts.items())), "claimed_statuses": dict(sorted(status_counts.items())), "coordinate_accuracy": dict(sorted(accuracy_counts.items())), "missing_claimed_cod": missing_cod, "missing_source_date": missing_source_date, "probable_duplicate_groups": duplicate_groups},
        "observation": {"source": "Global Renewables Watch v1", "through": "2024 Q2", "assets": len(observed_assets), "countries": observed_countries, "covered_projects": sum(row["observation_coverage"] == "available" for row in project_audit), "uncovered_projects": sum(row["observation_coverage"] == "unavailable" for row in project_audit)},
        "public_labels": dict(sorted(label_counts.items())),
        "grid_context": dict(sorted(grid_counts.items())),
        "critical_findings": sum(row["severity"] == "critical" for row in findings),
        "high_findings": sum(row["severity"] == "high" for row in findings),
        "medium_findings": sum(row["severity"] == "medium" for row in findings),
        "live_baseline": live_baseline,
    }
    write_csv(OUT / "project_audit.csv", project_audit, list(project_audit[0]))
    write_csv(OUT / "artifact_consistency.csv", artifact_rows, list(artifact_rows[0]))
    write_csv(OUT / "findings.csv", findings, list(findings[0]))
    write_csv(OUT / "source_manifest.csv", source_manifest, list(source_manifest[0]))
    write_json(OUT / "baseline_summary.json", summary)
    print(json.dumps(summary, indent=2))


if __name__ == "__main__":
    main()
