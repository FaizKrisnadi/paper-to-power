from __future__ import annotations

def ensure_modules(modules: list[str], module_name: str | None = None) -> None:
    try:
        for module in modules:
            __import__(module)
    except ModuleNotFoundError as exc:
        raise ModuleNotFoundError("Geospatial dependencies are missing. Run uv sync --extra geo, then uv run python -m " + (module_name or "pipeline.sync_data")) from exc
