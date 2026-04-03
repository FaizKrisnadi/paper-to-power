from __future__ import annotations

import subprocess
import sys
from pathlib import Path

from . import (
    apply_seed_enrichment,
    build_frontend_exports,
    build_duckdb_warehouse,
    ingest_gem,
    ingest_grw,
    match_projects,
    promote_reviewed_seed,
)

ROOT = Path(__file__).resolve().parent.parent
RAW_GEM_DIR = ROOT / "data" / "raw" / "gem"
RAW_GRW_DIR = ROOT / "data" / "raw" / "grw"
PROJECT_REGISTRY_PATH = ROOT / "data" / "processed" / "project_registry.json"
OBSERVED_ASSETS_PATH = ROOT / "data" / "processed" / "observed_assets.json"


def has_files(directory: Path, pattern: str) -> bool:
    return directory.exists() and any(directory.glob(pattern))


def step(title: str) -> None:
    print(f"\n[{title}]")


def run_module(module_name: str) -> None:
    completed = subprocess.run([sys.executable, "-m", module_name], check=False)
    if completed.returncode != 0:
        raise SystemExit(completed.returncode)


def main() -> None:
    step("reviewed seed")
    apply_seed_enrichment.main()

    if has_files(RAW_GEM_DIR, "*.csv"):
        step("gem ingest")
        ingest_gem.main()
    else:
        print("Skipping GEM ingest: no CSV files found in data/raw/gem.")

    step("promote reviewed seed")
    promote_reviewed_seed.main()

    if has_files(RAW_GRW_DIR, "*.geojson"):
        step("grw ingest")
        ingest_grw.main()
    else:
        print("Skipping GRW ingest: no GeoJSON files found in data/raw/grw.")

    if PROJECT_REGISTRY_PATH.exists() and OBSERVED_ASSETS_PATH.exists():
        step("first-pass matching")
        match_projects.main()
    else:
        print("Skipping matching: project registry or observed assets are missing.")

    if PROJECT_REGISTRY_PATH.exists() and OBSERVED_ASSETS_PATH.exists():
        step("geospatial exports")
        run_module("pipeline.export_geospatial_layers")
        step("duckdb warehouse")
        run_module("pipeline.build_duckdb_warehouse")
        step("osm context")
        run_module("pipeline.fetch_osm_context")
        step("site context")
        run_module("pipeline.build_site_context")
        step("duckdb warehouse refresh")
        run_module("pipeline.build_duckdb_warehouse")
        step("site audit export")
        run_module("pipeline.export_site_audit")
    else:
        print("Skipping advanced geospatial layers: project registry or observed assets are missing.")

    step("frontend exports")
    build_frontend_exports.main()


if __name__ == "__main__":
    main()
