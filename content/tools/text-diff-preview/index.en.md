---
title: "Text compare · Preview"
description: "Compare and edit text, code and data locally, with character highlights, merging, file imports and reports."
lang: en
type: text-compare
comments: false
---

This preview adapts text-compare-lite. Comparing happens in your browser; text and files are not uploaded. The page loads local resources and has no analytics. History and reopening text are off by default. Preferences are stored locally; text is stored only when you save explicitly or enable history or reopening. Delete saved items in the Library.

Copy link compresses both texts into the URL fragment after `#` and writes the link to your clipboard. Anyone with the complete link can read the content. This is not encrypted sharing.

Supports text, code, JSON, CSV/TSV and text extracted from Word (.docx), Excel (.xlsx) and PDF. Document mode does not compare layout, PDFs have no OCR, and image comparison works on pixels. Convert legacy Chinese encodings to UTF-8 first. Large files or extensive changes may reduce diff precision and remain subject to browser limits.

Custom ignore patterns use RE2 syntax; backreferences and lookahead are unsupported and reported. Switching views preserves text. Unsaved text is lost when the page closes or reloads, so copy or download work you need to keep.

[Upstream](https://github.com/JamesClayPatton/text-compare-lite) · [Source and build instructions for this modified version](https://github.com/Miss-you/miss-you.github.io/tree/main/tools/text-compare-lite). Tool code is under GNU AGPL-3.0, with credit to James Patton.
