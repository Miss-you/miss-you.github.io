---
name: pdf-to-markdown
description: >
  Use when converting PDF files to markdown with embedded images extracted as separate files.
  Triggered by: "PDF转markdown", "PDF转md", "解析PDF", "提取PDF内容", "提取PDF图片",
  "convert PDF to markdown", "PDF to md", "extract PDF content".
---

# PDF to Markdown with Image Extraction

## Overview

将 PDF 文件转换为结构化 Markdown，同时提取 PDF 中的图片保存到 `img/` 目录，并在 Markdown 中用 `![alt](img/filename)` 引用。

## Prerequisites

- Python 3 with PyMuPDF (`import fitz`)
- 验证: `python3 -c "import fitz; print('OK')"`
- 若未安装: `pip3 install PyMuPDF`

## Workflow

### 1. Resolve Inputs

如果用户只提供了 PDF 路径，直接使用以下默认值，无需询问：
- **输出 Markdown 路径**: 同目录同名 `.md`
- **图片输出目录**: 同目录下 `img/`
- **图片前缀**: 从 PDF 文件名推导（如 `meeting-0314`, `report` 等）

仅在存在歧义时（如多个 PDF 未指定哪个）才使用 AskUserQuestion。

### 2. Extract Content with PyMuPDF

编写临时 Python 脚本（`/tmp/extract_pdf_{hash}.py`），执行后删除。核心实现：

```python
import fitz, os, json

doc = fitz.open(pdf_path)
img_dir = "img/"
os.makedirs(img_dir, exist_ok=True)
results = []  # [(page, y, type, content_or_imgpath)]

for page_num in range(len(doc)):
    page = doc[page_num]
    elements = []

    # ---- 文本块提取 ----
    text_dict = page.get_text("dict")
    for block in text_dict["blocks"]:
        if block["type"] == 0:  # text block
            y = block["bbox"][1]
            lines = []
            max_font_size = 0
            is_bold = False
            for line in block["lines"]:
                line_text = ""
                for span in line["spans"]:
                    line_text += span["text"]
                    max_font_size = max(max_font_size, span["size"])
                    if "Bold" in span["font"] or "bold" in span["font"]:
                        is_bold = True
                if line_text.strip():
                    lines.append(line_text.strip())
            if lines:
                elements.append({
                    "type": "text", "y": y,
                    "content": "\n".join(lines),
                    "font_size": max_font_size,
                    "bold": is_bold
                })

    # ---- 图片提取 (xref 方式，优先) ----
    # 先建立 xref -> y坐标 的映射（从 image blocks 获取位置）
    img_blocks = [b for b in text_dict["blocks"] if b["type"] == 1]
    seen_xrefs = set()  # 去重：同一图片多页出现只保存一次

    img_list = page.get_images(full=True)
    for img_idx, img_info in enumerate(img_list):
        xref = img_info[0]  # tuple: (xref, smask, width, height, bpc, cs, ...)
        if xref in seen_xrefs:
            continue
        seen_xrefs.add(xref)

        width, height = img_info[2], img_info[3]
        if width < 50 and height < 50:
            continue  # 跳过装饰小图

        base_image = doc.extract_image(xref)
        # base_image = {"image": bytes, "ext": "png"/"jpeg", "width": N, "height": N}
        img_ext = base_image["ext"]
        img_bytes = base_image["image"]
        img_name = f"{prefix}-page{page_num+1}-img{img_idx+1}.{img_ext}"
        with open(os.path.join(img_dir, img_name), "wb") as f:
            f.write(img_bytes)

        # 位置匹配: 按顺序对应 image block 的 y 坐标
        y_pos = img_blocks[img_idx]["bbox"][1] if img_idx < len(img_blocks) else 0
        elements.append({"type": "image", "y": y_pos, "path": img_name})

    # 按 y 坐标排序，统一阅读顺序
    elements.sort(key=lambda e: e["y"])
    results.extend([(page_num, e) for e in elements])

doc.close()
```

**对于复杂信息图**（文字+图形混排，提取后只有碎片），改用页面区域渲染：

```python
# 截取页面特定区域为高清图片
rect = fitz.Rect(x0, y0, x1, y1)  # 从 block bbox 获取
pix = page.get_pixmap(clip=rect, dpi=200)
pix.save(os.path.join(img_dir, f"{prefix}-page{N}-infographic.png"))
```

### 3. Generate Markdown

**标题检测启发式：**
- `span["size"] >= 18` 且在首页 → `# 标题`
- `span["size"] >= 14` 且 bold → `## 章节标题`
- 列表符号 `•/◦/▪/-` 开头 → `- ` 列表项，根据 x 坐标偏移量推断嵌套层级
- 待办 `☐` → `- [ ]`

**结构映射：**

| PDF 元素 | Markdown 格式 |
|---------|--------------|
| 文档标题 (首页大字) | `# 标题` |
| 会议/录音元信息 | `> 引用块` |
| 章节标题 | `## 章节` |
| 列表项 (•/◦/▪) | `- ` / `  - ` / `    - ` (嵌套) |
| 图片位置 | `![alt text](img/filename)` |
| 表格 | Markdown 表格 |

**Alt text:** 从图片前后文本推断简短描述，中文文章用中文，最长 30 字。

### 4. Verify

```bash
# 无残留占位符
grep -c '\[图片\]' output.md  # 应为 0
# 图片引用文件都存在
grep -oE 'img/[^)]+' output.md | while read f; do [ -f "$f" ] || echo "MISSING: $f"; done
```

## Edge Cases

| 场景 | 处理 |
|------|------|
| `page.get_text()` 返回空 | PDF 为扫描件，需 OCR，告知用户超出此 skill 范围 |
| PDF 有密码 | `fitz.open(path, password=pwd)`，需向用户索要密码 |
| 无图片的 PDF | 正常，跳过图片步骤 |
| 同一图片多页出现 | 按 xref 去重，只保存一份 |

## Common Mistakes

| 问题 | 解决 |
|------|------|
| 图片模糊/残缺 | 优先 xref 提取，复杂图用 `get_pixmap(dpi=200)` |
| 图片顺序错乱 | 文本和图片统一按 `bbox[1]` (y坐标) 排序 |
| 信息图只提取到碎片 | 对该区域用 `page.get_pixmap(clip=rect)` 整体截图 |
| 大量装饰小图 | 跳过 width < 50 且 height < 50 的图片 |
| 列表层级丢失 | 根据 x 坐标偏移量推断嵌套深度 |
