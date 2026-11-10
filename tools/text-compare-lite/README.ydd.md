# YDD text comparison preview

This is a modified copy of [text-compare-lite](https://github.com/JamesClayPatton/text-compare-lite), by James Patton, imported from commit `f61842553d4ecc58682bf31c9c1d54ed3e29526b` on 2026-11-10. It retains the complete comparison application, with its original GNU AGPL-3.0 LICENSE and NOTICE. This notice applies to the tool; it does not change the licensing of unrelated blog content.

Live routes: [中文](https://yousali.com/tools/text-diff-preview/) · [English](https://yousali.com/en/tools/text-diff-preview/). The existing basic comparator stays at `/tools/text-diff/` and its English route.

## Build and develop

From the repository root, with Node 24 and Hugo Extended:

```sh
npm --prefix tools/text-compare-lite ci --ignore-scripts
node scripts/build-text-compare.mjs
hugo --minify --buildFuture
```

`./serve.sh`, `./deploy.sh` and the GitHub deployment workflow run the application build before Hugo. Application changes require rerunning `node scripts/build-text-compare.mjs`; Hugo then reloads its generated partials and assets. No remote runtime scripts/fonts, backend, account setup or environment secrets are required.

The build script produces ignored local assets at `static/assets/text-compare/` and markup at `layouts/partials/generated/text-compare/`. Neither generated directory nor Hugo's `public/` is committed. Both language routes use the same hashed modules, styles, fonts and local PDF/analysis workers.

## Local changes

- Hugo hosts the app with shared site navigation, appearance and language routes; tool pages link back to the basic comparator.
- Chinese interface strings are translated explicitly, without translating user documents, filenames or saved titles.
- Character highlights and wrapping default on. Text history/reopening default off. Preferences and explicit saves use a YDD-specific local storage namespace. Share links contain readable text in their fragment; sharing is an explicit action and is not encryption.
- Editor view/option changes preserve undo history and selection. Unified original-document changes also participate in undo.
- Custom ignore expressions use the non-backtracking RE2JS engine; 50 patterns, at most 2048 characters each. Unsupported lookahead/backreferences are reported rather than executed by JavaScript RegExp.
- No upstream service worker, unrelated landing pages, IndexNow key, analytics, hosting manifests or donation UI is published. Required visible author attribution and links to the actual modified source remain.
- Dependencies are locked and audited. The complete original unit tests are retained. Upstream standalone-site browser tests remain under `e2e/`; `e2e-ydd/` tests the actual Hugo integration instead of assuming standalone root/SEO/PWA defaults.

## Verify

```sh
npm --prefix tools/text-compare-lite test
npm --prefix tools/text-compare-lite run typecheck
cd tools/text-compare-lite
npx playwright install chromium
npm run test:blog
cd ../..
node --test tests/*.test.mjs
python3 -m unittest discover -s tests -p 'test_*.py'
python3 check-posts.py
./check-wordcount.sh
```

The integrated browser suite builds the app and Hugo output before starting a loopback-only server. It verifies real deployed paths/resources, editor state, export/file modes, local privacy defaults and language/appearance behavior. It does not assert an unlimited input size or perfect document-layout comparison.

## Updating upstream

Keep the imported upstream commit recorded above. Review an upstream source diff, preserve LICENSE/NOTICE, reconcile the modifications listed here and run all integration gates. Do not replace the fork wholesale or publish unreviewed generated assets. Public source for this running version: https://github.com/Miss-you/miss-you.github.io/tree/main/tools/text-compare-lite .

## Acceptance notes (2026-11-10)

Review caught and fixed delayed persistence after opting out, and cross-side original-document undo erasing later independent edits. Browser regressions cover undo and redo from split and unified views. The original macOS word-count check used unsupported `grep -P` and prompted on noninteractive stdin; its portable extraction was repaired so the required check can actually run. The check still reports three pre-existing post language/count mismatches (`20250715-hugo-tutorial`, `20261026-2027-ai-compute-gw`, `20261102-ai-slop-attention-en`); this tool change does not edit those articles.

For an already installed Google Chrome, the browser suite can also run with `PLAYWRIGHT_CHANNEL=chrome npm run test:blog`. CI uses Playwright's Chromium. Full app/browser gates run before deployment.
