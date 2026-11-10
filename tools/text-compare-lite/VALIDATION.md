# Preview acceptance — 2026-11-10

Decision: retain the original comparator and publish the complete imported application as a separately linked candidate preview in both languages. The design and implementation plan were reviewed before implementation; localization underwent specification review, followed by an independent code/runtime review. Material findings were fixed and rechecked before publication.

## Verified locally

- Application unit tests: 17 files, 91 tests passed; TypeScript no-emit check passed.
- Existing site JavaScript tests: 28 passed.
- Hugo output integration tests: 20 passed, including the preview and existing comparator.
- Browser acceptance against the actual built Hugo output: 27 passed (installed Google Chrome, `PLAYWRIGHT_CHANNEL=chrome`).
- Locked clean dependency installation and `npm audit`: 0 vulnerabilities.
- Vite assets plus `hugo --minify --buildFuture`: passed. Repeated the build/unit/type/Hugo/browser gates from a separate export containing only staged source files, without generated assets, partials or node_modules; theme reused at the repository's pinned submodule version. The clean export also passed 91 unit / 20 Hugo / 24 browser checks.
- Chinese light/dark layouts inspected in the browser; English and 390px mobile routes covered by browser acceptance. Source credit and actual modified-source link retained. Third-party license texts are generated beside runtime assets.

Browser coverage includes Chinese character highlights, both side histories across view/option changes, unified accept undo/redo while preserving later independent original-side edits, merge/fold/navigation, JSON/CSV structure, Word/Excel/PDF imports, image pixel/slider views, HTML/patch/text exports, escaped malicious input, local report printing, sharing without remote requests, default no text persistence, explicit saves, opt-in history reopening, opt-out timer cancellation, complete large-text round-trip via actual downloads, and mobile settings dismissal.

## Review fixes

1. Prevent a delayed save from restoring private text after the user disables reopening.
2. Map original-document undo/redo edits through subsequent independent edits instead of restoring an entire stale snapshot.
3. Preserve history/selection during view and comparison-option changes.
4. Use bounded non-backtracking RE2JS matching for custom patterns from controls and share links.
5. Fill localization gaps in dynamically created controls and Office/library error paths; keep user data untranslated.
6. Track the source icon outside ignored public directories so fresh CI builds contain it.
7. Repair the pre-existing macOS/noninteractive word-count checker and update stale navigation expectations for the already-published Events section.

## Existing limits

Document imports compare extracted text, not layout; PDFs have no OCR. GBK auto-detection is not provided. Large input remains limited by the browser and may use coarser highlights. Sharing puts unencrypted document text in the URL fragment. The three pre-existing post language/count warnings listed in README.ydd.md remain outside this tool change.

The first remote Chromium run did not trigger redo with the shared ControlOrMeta+Shift+z test chord. Regressions now use CodeMirror’s primary platform binding (Ctrl+Y on Linux, Command+Shift+Z on macOS), retaining the same undo/redo/content assertions, and additionally exercise an explicitly initialized Linux keymap. CI runs the unit/type/site/Hugo/browser gates again before publishing. Remote deployment and live URLs must be checked after the push; this document records local evidence, not a claim about a future workflow result.
