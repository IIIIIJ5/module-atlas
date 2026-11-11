# Module Atlas · 视觉模型结构图谱

![Module Atlas cover](assets/hero.svg)

[中文](#中文简介) · [English](#english-introduction)

## 中文简介

**从结构中寻找灵感，再回到论文核对出处。** Module Atlas 是一个以来源追溯为核心的计算机视觉与生成模型论文图谱，重点整理首页引导图、概念对照图、整体框架图和模块细节图。它帮助研究者查找设计思路，而不是提供无来源、可任意复用的图片素材。

`已核验 1,131 张图` · `近一年 1,008 张` · `首页引导图 26 张`

> **数据快照：2026 年 11 月 11 日。** “近一年”指 2025 年 11 月 11 日至 2026 年 11 月 11 日（含首尾）。[精选 1000 条目录](catalog/recent-1000.json)均经过视觉检查，其中 561 条来自期刊。这些数字表示已建立索引的图，**不表示图片已获得公开再分发许可**。

[浏览公开图谱](https://iiiiij5.github.io/module-atlas/) · [下载来源目录](catalog/recent-1000.csv) · [查看分类标准](docs/taxonomy.md)

| 分类 | 数量 | 主要内容 |
| --- | ---: | --- |
| 首页引导图 | 26 | 论文第一页的紧凑视觉引导 |
| 概念与结构对照 | 199 | 研究动机、问题设定和方案对比 |
| 整体框架 | 619 | 输入、分支、主干、输出和训练流程 |
| 模块细节 | 287 | 注意力、融合、条件控制等局部机制 |

目录记录论文链接、期刊或会议、图号，以及可获得的页码和裁剪坐标。公开网页和 GitHub 仓库**只提供目录与来源链接，不托管论文图片或缩略图**。如果你已合法取得对应 PNG，可按下方的 [Local gallery](#local-gallery) 指令在自己电脑上查看。转载、裁剪或改编论文图片前，请核实**该张图**的授权或取得许可；论文可免费阅读并不代表图片可自由再分发。详见 [图片权利说明](RIGHTS.md)。

代码及原创项目视觉素材采用 [MIT](LICENSE)；目录元数据采用 [CC0 1.0](DATA_LICENSE.md)。**这两项许可均不覆盖论文图片。** 欢迎按 [贡献指南](CONTRIBUTING.md) 补充有来源依据的条目。

---

## English Introduction

**A provenance-first index of computer-vision and generative-model diagrams.** Find inspiration in structure, then verify it at the source. This is a research reference, not an uncredited stock-image library.

`1,131 indexed diagrams` · `1,008 in the last 12 months` · `26 first-page intro diagrams`

> **Snapshot: 11 November 2026.** The recent window is **11 November 2025–11 November 2026**, inclusive. The curated [recent-1000 catalog](catalog/recent-1000.json) contains exactly 1,000 visually reviewed entries, including 561 journal entries. Counts describe indexed diagrams, not images licensed for public redistribution.

## Explore

[Open the public metadata gallery](https://iiiiij5.github.io/module-atlas/) · [Browse the recent-1000 catalog](catalog/recent-1000.json)

| Collection | Indexed | What to look for |
| --- | ---: | --- |
| [First-page Intro](docs/taxonomy.md#first-page-intro) | 26 | Compact visual openings on a paper's first page |
| [Concept & comparison](docs/taxonomy.md#concept--comparison) | 199 | Before/after, motivation, and structural contrast |
| [Frameworks](docs/taxonomy.md#frameworks) | 619 | Inputs, branches, backbone, outputs, and training flows |
| [Module details](docs/taxonomy.md#module-details) | 287 | Attention, fusion, conditioning, and local mechanisms |

The [catalog](catalog/recent-1000.json) links each entry to its paper, venue, figure number, and (where available) page and crop coordinates. The archive was assembled from official proceedings and publisher or author sources; every included crop passed a diagram-only visual check. See [selection and provenance](docs/provenance.md).

The [`site/`](site/) directory is a metadata-only gallery with the same editorial visual language as the private full-image atlas. The [GitHub Pages gallery](https://iiiiij5.github.io/module-atlas/) is published by the included workflow, which uploads only `site/` and contains no third-party images.

## Local gallery

The public repository intentionally contains **no third-party figure files or thumbnails**. If you have access to a local collection of the corresponding PNGs, you can build the gallery on your own computer:

```bash
python3 -m pip install -r requirements.txt
python3 tools/build_local_gallery.py --images /path/to/extracted-PNG-folder --output /path/to/module-atlas-gallery
cd /path/to/module-atlas-gallery && python3 -m http.server 8000
```

Open `http://localhost:8000`. The gallery scans the image folder recursively for files named `<figure-id>.png`, generates lightweight thumbnails, and links each card back to the original paper. Missing images remain source-linked catalog entries; the script does not fetch or rehost papers.

To validate the public index without images:

```bash
python3 tools/validate_catalog.py
```

## How to use a diagram responsibly

1. Follow the paper link in the catalog and verify the source and figure number.
2. Treat a diagram as visual inspiration or scholarly reference, not as an asset with a blanket reuse license.
3. Before reposting a crop, thumbnail, or adaptation, verify **that specific figure's** license or obtain permission. Credit the authors, source, license, and any crop or format change.

Open access to a paper does **not** automatically grant permission to redistribute its figures. [Rights and licensing](RIGHTS.md) explains why code and catalog metadata can be public while the image archive remains private.

## Contribute

New entries should include a stable paper URL, venue, publication date evidence, figure number, diagram role, and a clean crop reviewed at full size. Never add third-party image binaries without a recorded redistribution basis. See [CONTRIBUTING.md](CONTRIBUTING.md) and the [crop standard](docs/crop-standard.md).

## License

Repository code and original project artwork: [MIT](LICENSE). Catalog metadata: [CC0 1.0](DATA_LICENSE.md). **Neither license covers third-party paper figures.**
