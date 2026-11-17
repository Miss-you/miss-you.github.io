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
- Treat each substantive Wiki entry as one concrete question or item. Prefer a brief personal-practice section that records the author's situation, action, and observed result or evidence, with date and conditions when known. This is a flexible writing convention, not a rigid heading or mechanical template; navigation and maintenance guides may adapt it to their purpose.
- Base practice details on the user's account or verifiable material. Attribute subjective impressions to the author; do not invent dates, measurements, outcomes, or claim that a proposal was tested. If essential practice details are missing, ask targeted questions or explicitly mark the gap; keep unverified new content in draft when a verified practice is required and unavailable; do not unpublish an existing page for that reason.
- For turning rough user notes into a new or updated knowledge-base entry, use the `writing-wiki-from-practice` skill in `.codex/skills/writing-wiki-from-practice/SKILL.md` when available, and follow the prose review workflow below.
- For new reader-facing entries and substantive revisions, use this repository's [writing-workflows](.agents/skills/writing-workflows/SKILL.md) and [project configuration](kb/writing-workflows.md). It includes pinned local editing rules and prose scanners. Argon via Antigravity CLI writes and revises the prose, prompts, exercises, and explanations. Use independent fresh-context reviewers for fact checking and cold reading, and report unavailable checks accurately.
- For the full discussion → local knowledge note → public blog workflow, use this repository's [thinking-to-knowledge](.agents/skills/thinking-to-knowledge/SKILL.md). Read any private repository mapping from ignored local configuration. The public repository must remain usable without a particular sibling repository or globally installed writing skills.
- Every analysis in that workflow must actually query lizheng MCP and read relevant original passages. All prose generation and revision must actually use agy. If either is unavailable, report the incomplete stage and obtain explicit user agreement before substituting another source or writer.
- Apply the pinned MIT-licensed qu-ai-wei text, author-voice guidance, reading-burden review, and final cleanup through the project workflow. Its local resources replace the unavailable global essay-phase3 steps and external voice rewrite service. The current lieflat-less-ai-tone release adds script/approval steps and a noncommercial license, so evaluate it separately only when requested. Preserve protected text and evidence strength; short tutorials should stay proportionate to the question.
- Keep quoted prompts and rules, code, front matter, URLs, image references, facts, and technical instructions accurate; preserve user-specified wording verbatim. Adapt trimming and punctuation to the content, and do not invent personal experience.
- Prefer factual accuracy and readability over deletion quotas, blanket punctuation bans, artificial rhythm, or AI detector scores. The reviewed prose scanners already vendored in this project may run as documented in kb/writing-workflows.md. For newly fetched third-party skills, read source text only; do not execute their scripts or permanently install them without user authorization. If a skill, reference, or local path is unavailable, report the gap and use the available local workflow without claiming to have used the missing source.

## Testing Guidelines
- Use the existing tests under `tests/` and the current CI workflow. Knowledge entries follow kb/README.md; validate with Hugo and inspect the rendered page before committing. UI changes also need the relevant browser checks.
- When editing templates or CSS, test both light/dark modes and EN/ZH routes to avoid regressions.
- **Verify word count**: After adding a new post, check that the meta line shows reasonable numbers (e.g., "14 min · 6500 字" for Chinese, not "1 min · 131 words"). If incorrect, ensure `lang` is set in front matter.

## Commit & Pull Request Guidelines
- Keep commits focused; message format observed in history is `short imperative summary` (e.g., `add tool page`, `set CNAME and CI deploy`).
- For pull requests, describe the change, note any new content sections, and include screenshots or local URLs if UI changes are involved. Link related issues and mention whether `hugo --minify` was run.

## Deployment Notes
- GitHub Actions (.github/workflows/deploy.yml) builds on each `main` push and publishes `public/` to `gh-pages`. Do not commit `public/` or `docs/`; both are ignored.
- Custom domain is handled through CNAME on `gh-pages`; verify `yousali.com` after major releases.
