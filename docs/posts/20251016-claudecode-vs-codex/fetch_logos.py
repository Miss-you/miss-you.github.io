#!/usr/bin/env python3
"""
Download Codex and Claude Code logos into a local assets directory.
Update LOGO_SOURCES if you prefer different asset URLs.
"""
from __future__ import annotations

import argparse
from pathlib import Path
from typing import Iterable

import requests


# Centralize logo metadata so the main logic simply iterates over this table.
LOGO_SOURCES = (
    {
        "name": "codex",
        "url": "https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg",
        "filename": "codex-logo.svg",
    },
    {
        "name": "claude-code",
        "url": "https://upload.wikimedia.org/wikipedia/commons/6/6a/Anthropic_logo.svg",
        "filename": "claude-code-logo.svg",
    },
)


def download_logos(entries: Iterable[dict[str, str]], output_dir: Path) -> None:
    """Fetch each logo and persist it to output_dir."""
    output_dir.mkdir(parents=True, exist_ok=True)

    for entry in entries:
        target_path = output_dir / entry["filename"]
        response = requests.get(entry["url"], timeout=30)
        response.raise_for_status()
        target_path.write_bytes(response.content)
        print(f"Saved {entry['name']} logo -> {target_path}")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--output",
        type=Path,
        default=Path(__file__).resolve().parent / "assets",
        help="Directory to write logo files (default: ./assets next to the script).",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    download_logos(LOGO_SOURCES, args.output)


if __name__ == "__main__":
    main()
