"""Inspect the real Hugo output, including security boundaries and navigation."""
from html.parser import HTMLParser
from pathlib import Path
import re
import subprocess
import tempfile
import unittest

REPO = Path(__file__).resolve().parents[1]


class Tags(HTMLParser):
    def __init__(self, html):
        super().__init__()
        self.tags = []
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        self.tags.append((tag, dict(attrs)))


class TextDiffPage(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.temp = tempfile.TemporaryDirectory(prefix='ydd-diff-')
        cls.addClassCleanup(cls.temp.cleanup)
        cls.output = Path(cls.temp.name) / 'public'
        subprocess.run(['hugo', '--minify', '--buildFuture', '--destination', str(cls.output)],
                       cwd=REPO, check=True, capture_output=True, text=True)

    def test_tools_pages_link_to_the_corresponding_comparator(self):
        for prefix, title in [('', '文本对比'), ('en/', 'Text diff')]:
            with self.subTest(prefix=prefix):
                html = (self.output / prefix / 'tools/index.html').read_text()
                self.assertIn(f'/{prefix}tools/text-diff/', html)
                self.assertIn(title, html)
        self.assertIn('unixInput', (self.output / 'tools/index.html').read_text())

    def test_isolated_comparator_has_strict_policy_and_local_assets_only(self):
        for prefix in ['', 'en/']:
            with self.subTest(prefix=prefix):
                path = self.output / prefix / 'tools/text-diff/index.html'
                self.assertTrue(path.is_file(), 'comparator must exist at the tool route')
                html = path.read_text()
                tags = Tags(html).tags
                policy = next(attrs['content'] for tag, attrs in tags
                              if tag == 'meta' and attrs.get('http-equiv', '').lower() == 'content-security-policy')
                for directive in ["default-src 'none'", "connect-src 'none'", "object-src 'none'",
                                  "base-uri 'none'", "form-action 'none'", "worker-src 'self'"]:
                    self.assertIn(directive, policy)
                self.assertNotIn('unsafe-inline', policy)
                self.assertNotIn('unsafe-eval', policy)
                self.assertLess(html.index('Content-Security-Policy'), html.index('<script'))
                scripts = [attrs for tag, attrs in tags if tag == 'script']
                self.assertEqual(len(scripts), 2)
                header_scripts = [attrs for attrs in scripts if 'data-site-header' in attrs]
                self.assertEqual(len(header_scripts), 1)
                self.assertIn('/site-header.', header_scripts[0]['src'])
                self.assertEqual(header_scripts[0]['data-isolated'], 'true')
                for attrs in scripts:
                    self.assertTrue(attrs['src'].startswith('/'))
                    self.assertIn('integrity', attrs)
                    if 'data-site-header' not in attrs:
                        self.assertEqual(attrs['type'], 'module')
                worker = next(attrs['data-worker'] for tag, attrs in tags if attrs.get('id') == 'workspace')
                self.assertTrue(worker.startswith('/assets/js/text-diff-worker.'))
                self.assertTrue((self.output / worker.lstrip('/')).is_file())
                for tag, attrs in tags:
                    for name in attrs:
                        self.assertFalse(name.startswith('on'), 'no inline event handlers')
                    if tag in ['script', 'iframe', 'img', 'link'] and ('src' in attrs or attrs.get('rel') == 'stylesheet'):
                        url = attrs.get('src', attrs.get('href'))
                        self.assertTrue(url.startswith('/'), url)
                        self.assertTrue((self.output / url.lstrip('/')).is_file(), url)
                self.assertNotIn('giscus', html)
                self.assertNotIn('mermaid', html)
                self.assertNotIn('fonts.googleapis', html)
                self.assertIn('spellcheck=false', html)
                self.assertIn('autocomplete=off', html)

    def test_no_html_sinks_or_text_transmission_apis_in_comparator_sources(self):
        source = '\n'.join(path.read_text() for path in (REPO / 'assets/js/text-diff').glob('*.mjs'))
        for pattern in [r'\.innerHTML\s*=', r'\.outerHTML\s*=', r'insertAdjacentHTML', r'\beval\s*\(',
                        r'\bfetch\s*\(', r'XMLHttpRequest', r'sendBeacon', r'WebSocket',
                        r'localStorage', r'sessionStorage', r'indexedDB', r'document\.cookie']:
            self.assertIsNone(re.search(pattern, source), pattern)

    def test_shared_header_only_persists_appearance_and_never_collects_text(self):
        source = (REPO / 'assets/js/site-header.js').read_text()
        for pattern in [r'\bfetch\s*\(', r'XMLHttpRequest', r'sendBeacon', r'WebSocket', r'\.value\b',
                        r'innerHTML', r'textContent', r'textarea', r'left-input', r'right-input', r'document\.cookie']:
            self.assertIsNone(re.search(pattern, source), pattern)
        keys = re.findall(r'localStorage\.(?:getItem|setItem)\([\'\"]([^\'\"]+)', source)
        self.assertEqual(keys, ['pref-theme', 'pref-theme'])


if __name__ == '__main__':
    unittest.main()
