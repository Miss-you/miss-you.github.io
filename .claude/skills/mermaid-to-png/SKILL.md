---
name: replace-mermaid-with-img
description: >
  将 Markdown 文件中的 mermaid 代码块替换为同目录 img/ 下对应的图片引用。
  用户已手工将 mermaid 图导出为图片（png/gif/jpeg/webp/svg 等）放入 img/ 目录，
  需要自动匹配并替换。
  当 markdown 文件中同时存在 mermaid 代码块和 img/ 目录下的图片文件时使用。
---

# Replace Mermaid Blocks with Images

## Workflow

### 1. Inventory

1. Read the target markdown file. Extract all ` ```mermaid ` blocks — record each block's line range and a short semantic summary.
2. List all files in the sibling `img/` directory.
3. Identify which `img/` files are **not yet referenced** anywhere in the markdown (`![...](img/...)` pattern). These are the candidates for matching.

### 2. Match

If unused images outnumber mermaid blocks, that is expected — extra images serve non-mermaid content. Only match images to mermaid blocks; ignore the rest silently.

**Matching strategy:**
- Descriptive filenames (e.g. `sdlc-bottleneck.png`): match by name similarity first.
- Opaque hash filenames: use Read tool to view each candidate image visually, match by content.

Present a confirmation table before editing:

```
| Mermaid (lines) | Summary         | Matched image              |
|-----------------|-----------------|-----------------------------|
| 41-60           | SDLC bottleneck | fa9fd959...e1.png           |
```

If the user rejects a row, ask them to identify the correct image. Accepted rows can proceed immediately; rejected rows wait for resolution.

### 3. Replace

For each matched pair, replace the **entire mermaid fence** (` ```mermaid ` through closing ` ``` `) with:

```markdown
![<alt text>](img/<filename>)
```

Rules:
- `<filename>` = exact filename from `img/` listing including its actual extension (`.png`, `.gif`, `.jpeg`, `.webp`, `.svg`, etc.).
- Alt text: concise description derived from the mermaid content, matching the article's language (`lang` in front matter), max 30 chars.
- Preserve any `> blockquote` caption immediately after the mermaid block.
- Do NOT re-insert already-referenced images or modify non-mermaid content.
- Path is always `img/<filename>` relative to the markdown file (never `../img/`).

### 4. Verify

- Grep for ` ```mermaid ` — confirm zero remaining.
- Grep for `](img/` — confirm count matches expected total (prior refs + new replacements).
- Report: "N mermaid blocks replaced, 0 remaining."
