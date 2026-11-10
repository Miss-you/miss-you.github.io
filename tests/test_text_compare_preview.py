"""Inspect the deployed Hugo pages, not just the application development server."""
from html.parser import HTMLParser
from pathlib import Path
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


class TextComparePreview(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.temp = tempfile.TemporaryDirectory(prefix='ydd-compare-preview-')
        cls.addClassCleanup(cls.temp.cleanup)
        cls.output = Path(cls.temp.name)
        subprocess.run(['hugo', '--minify', '--buildFuture', '--destination', str(cls.output)],
                       cwd=REPO, check=True, capture_output=True, text=True)

    def test_complete_app_is_available_in_both_languages(self):
        for prefix, label in [('', '文本对比'), ('en/', 'Text compare')]:
            with self.subTest(prefix=prefix):
                path = self.output / prefix / 'tools/text-diff-preview/index.html'
                self.assertTrue(path.is_file(), 'new preview route must render')
                html = path.read_text()
                tags = Tags(html).tags
                ids = {attrs.get('id') for _, attrs in tags}
                self.assertTrue({'editor', 'options-btn', 'export-btn', 'library-btn', 'file-a', 'file-b',
                                 'data-panel', 'image-panel', 'theme-toggle', 'site-menu'} <= ids)
                self.assertIn(label, html)
                self.assertIn('James Patton', html)
                self.assertIn('Miss-you/miss-you.github.io/tree/main/tools/text-compare-lite', html)
                self.assertNotIn('<iframe', html)
                self.assertNotIn('giscus', html)
                for tag, attrs in tags:
                    if tag == 'script':
                        self.assertTrue(attrs.get('src', '').startswith('/'), 'no remote/inline executable scripts')
                    if tag in ('script', 'link') and (url := attrs.get('src', attrs.get('href', ''))).startswith('/assets/'):
                        self.assertTrue((self.output / url.lstrip('/')).is_file(), url)

    def test_tools_link_preview_and_keep_basic_tool(self):
        for prefix in ['', 'en/']:
            html = (self.output / prefix / 'tools/index.html').read_text()
            self.assertIn(f'/{prefix}tools/text-diff-preview/', html)
            self.assertIn(f'/{prefix}tools/text-diff/', html)
            self.assertTrue((self.output / prefix / 'tools/text-diff/index.html').is_file())


if __name__ == '__main__':
    unittest.main()
