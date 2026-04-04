from __future__ import annotations

import os
import subprocess
import sys
import urllib.request
from pathlib import Path

REEXEC_ENV = "PAPER_TO_POWER_FETCH_GRW_REEXEC"

try:
    import pyogrio
except ModuleNotFoundError:
    pyogrio = None

ROOT = Path(__file__).resolve().parent.parent
RAW_GRW_DIR = ROOT / "data" / "raw" / "grw"
CACHE_DIR = RAW_GRW_DIR / "cache"

TARGET_COUNTRIES = {
    "Brunei",
    "Cambodia",
    "Indonesia",
    "Laos",
    "Myanmar",
    "Thailand",
    "Philippines",
    "Singapore",
    "Vietnam",
    "Malaysia",
}
ASSETS = {
    "solar": "https://github.com/microsoft/global-renewables-watch/releases/download/v1.0/solar_all_2024q2_v1.gpkg",
    "wind": "https://github.com/microsoft/global-renewables-watch/releases/download/v1.0/wind_all_2024q2_v1.gpkg",
}
PYTHON_CANDIDATES = [
    "/opt/anaconda3/bin/python3",
    sys.executable,
    "python3",
    "python",
]


def ensure_geospatial_runtime() -> None:
    if pyogrio is not None:
        return
    if os.environ.get(REEXEC_ENV) == "1":
        raise ModuleNotFoundError(
            "pyogrio is unavailable in the current Python environment and no fallback runtime was found."
        )

    for candidate in PYTHON_CANDIDATES:
        path = Path(candidate)
        if candidate in {"python3", "python"}:
            candidate_cmd = [candidate]
        elif path.exists():
            candidate_cmd = [str(path)]
        else:
            continue

        probe = subprocess.run(
            candidate_cmd + ["-c", "import pyogrio"],
            capture_output=True,
            text=True,
        )
        if probe.returncode == 0:
            env = dict(os.environ)
            env[REEXEC_ENV] = "1"
            completed = subprocess.run(candidate_cmd + sys.argv, env=env)
            raise SystemExit(completed.returncode)

    raise ModuleNotFoundError(
        "pyogrio is unavailable and no alternative Python runtime with pyogrio was found."
    )


def download(url: str, target: Path) -> None:
    target.parent.mkdir(parents=True, exist_ok=True)
    if target.exists():
        print(f"Using cached {target.relative_to(ROOT)}")
        return

    print(f"Downloading {url}")
    urllib.request.urlretrieve(url, target)
    print(f"Saved {target.relative_to(ROOT)}")


def filter_to_geojson(source: Path, technology: str) -> Path:
    output = RAW_GRW_DIR / f"{technology}_sea_2024q2_v1.geojson"
    print(f"Reading {source.relative_to(ROOT)}")
    frame = pyogrio.read_dataframe(source)
    filtered = frame[frame["COUNTRY"].isin(TARGET_COUNTRIES)].copy()
    if filtered.crs is not None and str(filtered.crs) != "EPSG:4326":
        filtered = filtered.to_crs(4326)
    pyogrio.write_dataframe(filtered, output, driver="GeoJSON")
    print(f"Wrote {output.relative_to(ROOT)} with {len(filtered)} features")
    return output


def main() -> None:
    ensure_geospatial_runtime()
    for technology, url in ASSETS.items():
        filename = url.rsplit("/", 1)[-1]
        cached = CACHE_DIR / filename
        download(url, cached)
        filter_to_geojson(cached, technology)


if __name__ == "__main__":
    main()
