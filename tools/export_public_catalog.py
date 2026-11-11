"""Whitelist-export a reviewed private manifest into a metadata-only index."""

import argparse
import csv
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
FIELDS = (
    "id", "title", "venue", "year", "publication_date", "publication_month",
    "publication_type", "category", "figure_number", "page", "paper_url",
    "pdf_url", "source_image_url", "doi", "width_px", "height_px",
    "bbox_pdf_points", "sha256", "visual_checked",
)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("manifest", type=Path, help="Private recent-1000 manifest JSON")
    args = parser.parse_args()
    source = json.loads(args.manifest.read_text())
    figures = []
    for row in source["figures"]:
        if not row["visual_checked"]:
            raise ValueError(f"Not visually checked: {row['id']}")
        public = {key: row[key] for key in FIELDS if key in row and row[key] is not None}
        public["rights_status"] = "not_verified_for_redistribution"
        figures.append(public)
    if len(figures) != 1000 or len({row["id"] for row in figures}) != 1000:
        raise ValueError("Expected exactly 1000 unique figures")

    output = {
        "schema_version": 1,
        "snapshot_date": source["end"],
        "window_start": source["start"],
        "window_end": source["end"],
        "figure_count": len(figures),
        "rights_notice": "Metadata only. Third-party figure redistribution rights are not verified.",
        "selection_rule": source["selection_rule"],
        "figures": figures,
    }
    (ROOT / "catalog/recent-1000.json").write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n")
    columns = [*FIELDS, "rights_status"]
    with (ROOT / "catalog/recent-1000.csv").open("w", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=columns)
        writer.writeheader()
        for row in figures:
            writer.writerow({key: json.dumps(row[key]) if key == "bbox_pdf_points" and key in row else row.get(key, "") for key in columns})
    print(f"Exported {len(figures)} metadata-only entries")


if __name__ == "__main__":
    main()
