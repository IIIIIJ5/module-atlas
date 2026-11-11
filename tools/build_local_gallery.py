"""Build a source-linked gallery, optionally adding locally held matching PNGs."""

import argparse
import hashlib
import json
import shutil
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
TEMPLATE = ROOT / "site"
CATALOG = ROOT / "catalog/recent-1000.json"


def matching_pngs(folder, ids):
    found = {}
    if folder is None:
        return found
    for path in folder.rglob("*.png"):
        if path.stem in ids:
            found.setdefault(path.stem, []).append(path)
    return found


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--images", type=Path, help="Extracted local PNG folder; searched recursively")
    parser.add_argument("--output", type=Path, required=True, help="Gallery destination")
    parser.add_argument("--symlink", action="store_true", help="Link full-size PNGs instead of copying them")
    args = parser.parse_args()
    output = args.output.resolve()
    if output == ROOT or output == TEMPLATE or ROOT in output.parents:
        raise SystemExit("Output must be outside the public repository")
    if args.images and not args.images.is_dir():
        raise SystemExit(f"Image folder not found: {args.images}")

    rows = json.loads(CATALOG.read_text())["figures"]
    candidates = matching_pngs(args.images, {row["id"] for row in rows})
    output.mkdir(parents=True, exist_ok=True)
    for filename in ("index.html", "style.css", "app.js"):
        shutil.copy2(TEMPLATE / filename, output / filename)

    with_images = 0
    public = []
    for row in rows:
        record = {key: row[key] for key in (
            "id", "title", "venue", "year", "paper_url", "figure_number",
            "category", "width_px", "height_px", "publication_type",
            "publication_date", "publication_month",
        ) if key in row}
        record["is_new"] = row["year"] == 2026
        record["recent_12_months"] = True
        record["image"] = None
        record["thumbnail"] = None
        for source in candidates.get(row["id"], []):
            if hashlib.sha256(source.read_bytes()).hexdigest() != row["sha256"]:
                continue
            from PIL import Image

            with Image.open(source) as image:
                image.load()
                if image.size != (row["width_px"], row["height_px"]):
                    raise ValueError(f"Unexpected dimensions: {row['id']}")
                thumb = image.convert("RGB")
                thumb.thumbnail((640, 400))
                thumb_path = output / "thumbs" / f"{row['id']}.jpg"
                thumb_path.parent.mkdir(parents=True, exist_ok=True)
                thumb.save(thumb_path, format="JPEG", quality=86, optimize=True)
            image_path = output / "images" / f"{row['id']}.png"
            image_path.parent.mkdir(parents=True, exist_ok=True)
            if image_path.exists() or image_path.is_symlink():
                image_path.unlink()
            if args.symlink:
                image_path.symlink_to(source.resolve())
            else:
                shutil.copy2(source, image_path)
            record["image"] = f"images/{row['id']}.png"
            record["thumbnail"] = f"thumbs/{row['id']}.jpg"
            with_images += 1
            break
        public.append(record)

    (output / "catalog.json").write_text(json.dumps(public, ensure_ascii=False, indent=2) + "\n")
    (output / "data.js").write_text("window.ATLAS_DATA=" + json.dumps(public, ensure_ascii=False).replace("</", "<\\/") + ";\n")
    print(f"Built {len(public)} source-linked cards ({with_images} local PNGs) in {output}")


if __name__ == "__main__":
    main()
