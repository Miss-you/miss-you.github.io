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
./serve.sh          # Start local dev server with drafts (recommended)
```

### Manual Commands
- `hugo server -D` — local preview with drafts; watches `content/`, `layouts/`, and assets for hot reload.
- `hugo --minify` — production build into `public/`; matches the CI workflow output.
- `./deploy.sh "msg"` — optional helper that runs `hugo --minify`, stages content/config/theme updates, commits, and pushes `main`.

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
