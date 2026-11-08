# Repository Guidelines

## Project Structure & Module Organization
- `config.yaml` drives multilingual settings, menus, and home hero content. Update this file before adding new sections.
- Markdown sources live under `content/` (`posts/`, `tools/`, `zh/`, etc.); assets referenced by posts sit alongside each post directory.
- Custom layouts belong in `layouts/partials/` (e.g., `home_info.html`), and shared styling overrides live in `assets/css/extended/`.
- **Note on word counting**: `layouts/partials/post_meta.html` overrides the theme default to use `.CountWords` instead of `.WordCount`, providing better CJK (Chinese/Japanese/Korean) character counting.
- The PaperMod theme is vendored inside `themes/` via submodules; run `git submodule update --init --recursive` after cloning.

## Build, Test, and Development Commands

### Quick Start
```bash
./serve.sh          # Start local dev server with drafts and future posts (recommended)
```

### Manual Commands
- `hugo server -D --buildFuture` — local preview with drafts and future-dated posts; watches `content/`, `layouts/`, and assets for hot reload.
- `hugo --minify --buildFuture` — production build into `public/`; matches the CI workflow output.
- `./deploy.sh "msg"` — optional helper that runs `hugo --minify --buildFuture`, stages content/config/theme updates, commits, and pushes `main`.

**Note on `--buildFuture`:** Hugo by default does not build pages with future dates (date > now). Since this blog may have posts dated in the future (e.g., 2026), both local development and CI builds include `--buildFuture` to ensure all posts are rendered.

### Pre-deployment Checks
Before pushing changes, run the following checks to ensure correct configuration:

```bash
# Check all posts have correct lang parameter and word count estimates
python3 check-posts.py

# Verify Hugo can build and display correct word counts (requires hugo installed)
./check-wordcount.sh
```

These scripts help catch common issues like missing `lang` parameters which cause incorrect word count display (e.g., showing "131 words" for a 6000-character Chinese article).

## Coding Style & Naming Conventions
- Follow Hugo/PaperMod conventions: partials use Go templates with two-space indentation; SCSS/CSS files prefer 2-space indents and kebab-case class names (e.g., `.ydd-hero`).
- Keep front matter keys lowercase kebab-case (`title`, `date`, `tags`), and name post directories `YYYYMMDD-slug/` so permalinks remain stable.
- **Required: Always include `lang` in front matter** (`lang: zh` or `lang: en`). This ensures correct word count and reading time for Chinese/English content. Without it, Hugo defaults to English tokenization, causing incorrect stats (e.g., "131 words" for a 6000-character Chinese article).
- Ensure bilingual copies live under matching paths inside `content/en/` and `content/zh/` when applicable.

## Knowledge-base Writing Workflow
- For prose under `content/kb/`, use the recommendations in the personal knowledge base's [`2026-10-26-现成写作skill评估.md`](../my-obsidian/docs/research/2026-10-26-现成写作skill评估.md): apply [qu-ai-wei](https://github.com/LifelongLazyLearner/qu-ai-wei/blob/HEAD/SKILL.md) for structure and language, then finish with [lieflat-less-ai-tone](https://github.com/larashero3-dotcom/lieflat-less-ai-tone/blob/HEAD/SKILL.md). Read the current official skill and necessary references; the research note is guidance, not a substitute for current source files.
- Between those two passes, apply the existing local `essay-phase3` workflow in order: `writing-5-no-preach`, `writing-6-style`, `writing-7-trim`, and `writing-8-rhythm` (under `~/.codex/skills/`).
- Also apply the personal knowledge base's [`reducing-reading-fatigue`](../my-obsidian/.agents/skills/reducing-reading-fatigue/SKILL.md), including its local `scripts/fatigue_scan.py` and `references/catalog.md`, before final cleanup. Define the reader and check the whole text as well as individual sentences; reducing reading burden is distinct from removing AI writing patterns. Do not impose a report outline on a short tutorial.
- Keep quoted prompts and rules, code, front matter, URLs, image references, facts, and technical instructions accurate; preserve user-specified wording verbatim. Adapt trimming and punctuation to the content, and do not invent personal experience.
- Prefer factual accuracy and readability over deletion quotas, blanket punctuation bans, artificial rhythm, or AI detector scores. For third-party skills, read source text only; do not run third-party scripts or permanently install skills without explicit user authorization. If a skill, reference, or local path is unavailable, report the gap and use the available local workflow without claiming to have used the missing source.

## Testing Guidelines
- No automated test suite exists; validate changes with `hugo server` for visual QA and `hugo --minify` before committing.
- When editing templates or CSS, test both light/dark modes and EN/ZH routes to avoid regressions.
- **Verify word count**: After adding a new post, check that the meta line shows reasonable numbers (e.g., "14 min · 6500 字" for Chinese, not "1 min · 131 words"). If incorrect, ensure `lang` is set in front matter.

## Commit & Pull Request Guidelines
- Keep commits focused; message format observed in history is `short imperative summary` (e.g., `add tool page`, `set CNAME and CI deploy`).
- For pull requests, describe the change, note any new content sections, and include screenshots or local URLs if UI changes are involved. Link related issues and mention whether `hugo --minify` was run.

## Deployment Notes
- GitHub Actions (.github/workflows/deploy.yml) builds on each `main` push and publishes `public/` to `gh-pages`. Do not commit `public/` or `docs/`; both are ignored.
- Custom domain is handled through CNAME on `gh-pages`; verify `yousali.com` after major releases.
