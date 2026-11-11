"""Validate the public catalog and guard against accidental image publication."""

import csv
import json
import subprocess
from datetime import date
from pathlib import Path
from urllib.parse import urlparse


ROOT = Path(__file__).resolve().parents[1]
CATALOG = ROOT / "catalog/recent-1000.json"
ALLOWED_KEYS = {
    "id", "title", "venue", "year", "publication_date", "publication_month",
    "publication_type", "category", "figure_number", "page", "paper_url",
    "pdf_url", "source_image_url", "doi", "width_px", "height_px",
    "bbox_pdf_points", "sha256", "visual_checked", "rights_status",
}
IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp", ".pdf", ".zip"}


def main():
    document = json.loads(CATALOG.read_text())
    rows = document["figures"]
    assert document["figure_count"] == 1000 == len(rows)
    assert document["snapshot_date"] == document["window_end"] == "2026-11-11"
    assert document["window_start"] == "2025-11-11"
    assert len({row["id"] for row in rows}) == len(rows)
    for row in rows:
        assert set(row) <= ALLOWED_KEYS, row["id"]
        assert row["visual_checked"] is True, row["id"]
        assert row["rights_status"] == "not_verified_for_redistribution", row["id"]
        assert row["category"] in {"intro", "framework", "detail", "half_intro"}, row["id"]
        assert row["publication_type"] in {"journal", "conference"}, row["id"]
        assert row["width_px"] > 0 and row["height_px"] > 0, row["id"]
        assert len(row["sha256"]) == 64, row["id"]
        assert urlparse(row["paper_url"]).scheme == "https", row["id"]
        for key in ("pdf_url", "source_image_url"):
            if row.get(key):
                assert urlparse(row[key]).scheme == "https", row["id"]
        if row.get("publication_date"):
            assert date(2025, 11, 11) <= date.fromisoformat(row["publication_date"]) <= date(2026, 11, 11), row["id"]
        else:
            assert row["year"] == 2026 and row["venue"] in {"CVPR", "ICLR", "ICML"}, row["id"]

    with (ROOT / "catalog/recent-1000.csv").open(newline="") as handle:
        csv_rows = list(csv.DictReader(handle))
    assert [row["id"] for row in csv_rows] == [row["id"] for row in rows]
    tracked = subprocess.run(["git", "ls-files", "-z"], cwd=ROOT, capture_output=True, check=True).stdout
    illegal = [name.decode() for name in tracked.split(b"\0") if name and Path(name.decode()).suffix.lower() in IMAGE_EXTENSIONS]
    assert not illegal, f"Third-party image/PDF/archive file tracked: {illegal[:5]}"
    print(f"PASS: {len(rows)} unique metadata-only records; no tracked image/PDF/archive files")


if __name__ == "__main__":
    main()
