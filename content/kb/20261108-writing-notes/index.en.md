---
title: "How to add a knowledge note"
slug: writing-notes
date: 2026-11-08
lastmod: 2026-11-08
lang: en
topic: "Knowledge management"
summary: "Add a Markdown file; topics, navigation and search update when the site builds."
takeaway: "Keep one note per Markdown file, use topic to organize it, and preserve its slug."
tags: [Markdown]
---

## Add a note

Create `content/kb/20261108-my-note.md` and begin with:

```yaml
---
title: "A small question to answer"
slug: my-note
date: 2026-11-08
lastmod: 2026-11-08
lang: zh
topic: "Engineering"
summary: "What this note helps you do."
takeaway: "The main idea, optional."
tags: [Debugging]
draft: false
---
```

Use your actual writing date. The topic automatically appears in the directory. The slug creates a stable URL such as `/kb/my-note/`.

For an English translation, use a matching `.en.md` file or `index.en.md` in the same bundle and set `lang: en`. Both translations should keep the same slug.

## Write and revise

Use normal Markdown. Second- and third-level headings generate the table of contents. When revising a note, update `lastmod` and keep the slug unchanged.

For notes with images, put `index.md` and its images in the same note directory and use relative image links.

## Preview and publish

Run `./serve.sh` and open `/kb/` or `/en/kb/`. Drafts are visible in the development server. Set `draft: false` when a note is ready; a push to `main` uses the existing deployment workflow.
