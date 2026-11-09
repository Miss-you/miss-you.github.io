---
title: "Text diff"
description: "Compare text locally in your browser, with aligned lines and character highlights. No uploads or account needed."
lang: en
type: text-diff
comments: false
---

Text is processed only by this page and its local background worker. It is never sent to a server or written to URLs, browser storage, or logs. Only clicking Copy writes text to your clipboard. Leaving or refreshing this page clears the tool's text.

Each side accepts up to 200,000 UTF-16 units and 3,000 lines. CRLF and CR line endings are treated as LF. A final newline participates in comparison. “Ignore spaces and tabs” ignores spaces and tabs within each line, not line breaks.

This page loads only local static assets, with no third-party scripts, fonts or comments. HTML, code and URLs in your text are displayed literally. Large changes or long lines may receive whole-region highlights; a notice explains this. Comparisons stop after 5 seconds. Shorten the input to retry.

These measures reduce common injection and content disclosure risks; they do not guarantee absolute security. Your browser, extensions, device and website hosting remain trust boundaries. This page's CSP does not replace server response headers or site security maintenance.
