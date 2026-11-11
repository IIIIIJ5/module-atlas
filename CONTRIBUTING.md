# Contributing

## Add or correct a catalog entry

Open an issue or pull request with the paper URL, venue, verified publication date, figure number, and the proposed diagram role. Include the paper's figure location and a short explanation of why it is a method/concept diagram rather than a result plot. Do not attach copyrighted figure binaries unless redistribution permission is documented.

## Review standard

- The crop contains the complete relevant diagram, including semantic labels and arrows.
- It excludes article body text, external captions, page furniture, tables, pure performance plots, and result galleries.
- If only a subpanel qualifies, identify that subpanel and avoid counting the whole composite again.
- First-page Intro placement and approximate width are checked against the paper page, not inferred from a thumbnail.
- Publication recency is based on a verifiable date, not merely an arXiv upload date or year in a title.

See [the crop standard](docs/crop-standard.md). The public catalog is generated from a private reviewed source; proposed changes are checked before the next snapshot. Run `python3 tools/validate_catalog.py` before opening a pull request.
