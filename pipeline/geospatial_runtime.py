from __future__ import annotations

import os
import subprocess
import sys
from pathlib import Path

REEXEC_ENV = "PAPER_TO_POWER_GEOSPATIAL_REEXEC"
PYTHON_CANDIDATES = [
    "/opt/anaconda3/bin/python3",
    sys.executable,
    "python3",
    "python",
]


def ensure_modules(modules: list[str], module_name: str | None = None) -> None:
    if _modules_available(modules):
        return
    if os.environ.get(REEXEC_ENV) == "1":
        raise ModuleNotFoundError(
            f"Required geospatial modules are unavailable in the active Python runtime: {modules}"
        )

    probe_code = "; ".join(f"import {module}" for module in modules)
    for candidate in PYTHON_CANDIDATES:
        path = Path(candidate)
        if candidate in {"python3", "python"}:
            command = [candidate]
        elif path.exists():
            command = [str(path)]
        else:
            continue

        probe = subprocess.run(command + ["-c", probe_code], capture_output=True, text=True)
        if probe.returncode == 0:
            env = dict(os.environ)
            env[REEXEC_ENV] = "1"
            rerun_args = (
                command + ["-m", module_name, *sys.argv[1:]]
                if module_name
                else command + sys.argv
            )
            completed = subprocess.run(rerun_args, env=env)
            raise SystemExit(completed.returncode)

    raise ModuleNotFoundError(
        f"No Python runtime with the required geospatial modules was found: {modules}"
    )


def _modules_available(modules: list[str]) -> bool:
    try:
        for module in modules:
            __import__(module)
    except ModuleNotFoundError:
        return False
    return True
