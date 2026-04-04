from __future__ import annotations

import re
import sys
from pathlib import Path
from typing import Any

from .io import write_json

ROOT = Path(__file__).resolve().parent.parent
PROJECTS_OUTPUT = ROOT / "data" / "interim" / "deep_research_projects.json"
SOURCES_OUTPUT = ROOT / "data" / "interim" / "deep_research_sources.json"
UNRESOLVED_OUTPUT = ROOT / "data" / "interim" / "deep_research_unresolved.json"


def read_input_path() -> Path:
    if len(sys.argv) > 1 and sys.argv[1].strip():
        return Path(sys.argv[1]).expanduser().resolve()
    candidates = [
        ROOT / "data" / "manual" / "deep_research_import.md",
        ROOT / "data" / "manual" / "deep_research_projects.md",
    ]
    for candidate in candidates:
        if candidate.exists():
            return candidate.resolve()
    raise FileNotFoundError(
        "No input markdown provided. Pass a path explicitly, for example: "
        "`python3 -m pipeline.import_deep_research_markdown /path/to/input.md`"
    )


def extract_section(text: str, title: str, next_title: str | None) -> str:
    if next_title is None:
        pattern = rf"{re.escape(title)}(.*)$"
    else:
        pattern = rf"{re.escape(title)}(.*?){re.escape(next_title)}"
    match = re.search(pattern, text, re.S)
    if not match:
        raise ValueError(f"Could not find section starting with: {title}")
    return match.group(1)


def parse_markdown_table(block: str) -> list[dict[str, str]]:
    lines = [line.rstrip() for line in block.splitlines() if line.strip().startswith("|")]
    if len(lines) < 2:
        return []

    headers = [normalize_header(cell) for cell in split_markdown_row(lines[0])]
    records: list[dict[str, str]] = []
    for line in lines[2:]:
        cells = split_markdown_row(line)
        if len(cells) != len(headers):
            continue
        record = {
            header: normalize_cell(cell)
            for header, cell in zip(headers, cells, strict=True)
        }
        records.append(record)
    return records


def split_markdown_row(line: str) -> list[str]:
    stripped = line.strip().strip("|")
    return [part.strip() for part in stripped.split("|")]


def normalize_header(value: str) -> str:
    return value.replace("\\_", "_").strip()


def normalize_cell(value: str) -> str:
    cell = value.strip()
    cell = re.sub(r"\\_", "_", cell)
    cell = re.sub(r"\\\.", ".", cell)
    cell = re.sub(r"\\-", "-", cell)
    cell = re.sub(r"\\@", "@", cell)
    links = re.findall(r"\[([^\]]+)\]\(([^)]+)\)", cell)
    if links:
        urls = [url.strip() for _, url in links]
        if len(urls) == 1 and cell.strip() == f"[{links[0][0]}]({links[0][1]})":
            return urls[0]
        flattened = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r"\2", cell)
        return " ".join(flattened.split())
    return " ".join(cell.split())


def summarize_country_counts(records: list[dict[str, str]]) -> dict[str, int]:
    counts: dict[str, int] = {}
    for record in records:
        code = record.get("country_code", "")
        if code:
            counts[code] = counts.get(code, 0) + 1
    return counts


def main() -> None:
    input_path = read_input_path()
    if not input_path.exists():
        raise FileNotFoundError(f"Input file not found: {input_path}")

    text = input_path.read_text(encoding="utf-8")

    output_a = extract_section(
        text,
        "# **OUTPUT A: Normalized Project Registry Table**",
        "# ---\n\n**OUTPUT B: Source Audit Log**",
    )
    output_b = extract_section(
        text,
        "**OUTPUT B: Source Audit Log**",
        "# ---\n\n**OUTPUT C: Unresolved / Missing-Data List**",
    )
    output_c = extract_section(
        text,
        "**OUTPUT C: Unresolved / Missing-Data List**",
        "# ---\n\n**Data Summary**",
    )

    project_rows = parse_markdown_table(output_a)
    source_rows = parse_markdown_table(output_b)
    unresolved_rows = parse_markdown_table(output_c)

    projects_payload: dict[str, Any] = {
        "sourceFile": str(input_path),
        "recordCount": len(project_rows),
        "countryCounts": summarize_country_counts(project_rows),
        "records": project_rows,
    }
    sources_payload = {
        "sourceFile": str(input_path),
        "recordCount": len(source_rows),
        "records": source_rows,
    }
    unresolved_payload = {
        "sourceFile": str(input_path),
        "recordCount": len(unresolved_rows),
        "records": unresolved_rows,
    }

    write_json(PROJECTS_OUTPUT, projects_payload)
    write_json(SOURCES_OUTPUT, sources_payload)
    write_json(UNRESOLVED_OUTPUT, unresolved_payload)

    print(f"Wrote {PROJECTS_OUTPUT.relative_to(ROOT)}")
    print(f"Wrote {SOURCES_OUTPUT.relative_to(ROOT)}")
    print(f"Wrote {UNRESOLVED_OUTPUT.relative_to(ROOT)}")
    print(
        f"Imported {len(project_rows)} project rows, "
        f"{len(source_rows)} source rows, and {len(unresolved_rows)} unresolved rows"
    )


if __name__ == "__main__":
    main()
