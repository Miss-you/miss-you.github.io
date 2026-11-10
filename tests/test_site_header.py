"""Build real routes to verify the shared header contract and navigable links."""
from html.parser import HTMLParser
from pathlib import Path
import re
import shutil
import subprocess
import tempfile
import unittest
from urllib.parse import urlparse

REPO = Path(__file__).resolve().parents[1]


class Header(HTMLParser):
    def __init__(self, html):
        super().__init__()
        self.in_header = False
        self.links = []
        self.current = None
        self.buttons = []
        self.assets = []
        self.scripts = []
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'header' and 'site-header' in attrs.get('class', '').split():
            self.in_header = True
        if tag == 'link' and attrs.get('rel') == 'stylesheet':
            self.assets.append(attrs)
        if tag == 'script':
            self.scripts.append(attrs)
        if self.in_header and tag == 'a':
            self.current = dict(attrs, text='')
            self.links.append(self.current)
        if self.in_header and tag == 'button':
            self.buttons.append(attrs)

    def handle_endtag(self, tag):
        if tag == 'a':
            self.current = None
        if tag == 'header':
            self.in_header = False

    def handle_data(self, data):
        if self.current is not None:
            self.current['text'] += data

    @property
    def menu(self):
        return [link for link in self.links if 'site-menu-link' in link.get('class', '').split()]


class SiteHeaderAcceptance(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.temp = tempfile.TemporaryDirectory(prefix='ydd-header-')
        cls.addClassCleanup(cls.temp.cleanup)
        cls.root = Path(cls.temp.name)
        content = cls.root / 'content'
        shutil.copytree(REPO / 'content', content)
        probe = content / 'posts/20261109-header-probe'
        probe.mkdir()
        for suffix, lang in [('', 'zh'), ('.en', 'en')]:
            (probe / f'index{suffix}.md').write_text(f'---\ntitle: Header probe\nlang: {lang}\n---\nProbe.\n')
        (content / 'posts/header-no-translation.md').write_text('---\ntitle: No translation\nlang: zh\n---\nProbe.\n')
        cls.output = cls.root / 'public'
        subprocess.run(['hugo', '--minify', '--buildFuture', '--contentDir', str(content),
                        '--destination', str(cls.output)], cwd=REPO, capture_output=True, text=True, check=True)
        cls.subpath = cls.root / 'subpath'
        subprocess.run(['hugo', '--minify', '--buildFuture', '--contentDir', str(content),
                        '--baseURL', 'https://example.test/preview/', '--destination', str(cls.subpath)],
                       cwd=REPO, capture_output=True, text=True, check=True)

    def page(self, path):
        return Header((self.output / path / 'index.html').read_text())

    def test_same_navigation_and_brand_across_every_site_section(self):
        routes = ['', 'tools', 'tools/text-diff', 'tools/text-diff-preview', 'kb', 'kb/writing-notes',
                  'posts/20261109-header-probe', 'archives', 'tags', 'categories', 'lab']
        expected = ['归档', '标签', '知识库', '实验室', '会议', '工具', '分类', 'RSS', 'GitHub']
        for route in routes:
            with self.subTest(route=route):
                header = self.page(route)
                self.assertEqual([link['text'].strip() for link in header.menu], expected)
                self.assertTrue(any(link['text'].strip() == 'Yousa Driven Development | YDD' for link in header.links))
                self.assertEqual([b['id'] for b in header.buttons], ['theme-toggle'])

    def test_parent_section_remains_highlighted_on_nested_pages(self):
        for route, section in [('tools/text-diff', '/tools/'), ('kb/writing-notes', '/kb/')]:
            with self.subTest(route=route):
                active = [link for link in self.page(route).menu if link.get('aria-current')]
                self.assertEqual(len(active), 1)
                self.assertEqual(urlparse(active[0]['href']).path, section)
                self.assertEqual(active[0]['aria-current'], 'location')
        active = [link for link in self.page('tools').menu if link.get('aria-current')]
        self.assertEqual(active[0]['aria-current'], 'page')

    def test_language_switch_preserves_translation_or_falls_back_to_home(self):
        for route, target in [('tools/text-diff', '/en/tools/text-diff/'),
                              ('en/tools/text-diff', '/tools/text-diff/'),
                              ('kb/writing-notes', '/en/kb/writing-notes/'),
                              ('posts/20261109-header-probe', '/en/posts/20261109-header-probe/'),
                              ('posts/header-no-translation', '/en/')]:
            with self.subTest(route=route):
                language = [link for link in self.page(route).links if 'site-language-link' in link.get('class', '').split()]
                self.assertEqual(len(language), 1)
                self.assertEqual(urlparse(language[0]['href']).path, target)

    def test_english_menu_is_translated_and_all_internal_links_resolve(self):
        expected = ['Archives', 'Tags', 'Knowledge', 'Lab', 'Events', 'Tools', 'Categories', 'RSS', 'GitHub']
        for prefix in ['', 'en/']:
            header = self.page(prefix + 'tools/text-diff')
            if prefix:
                self.assertEqual([link['text'].strip() for link in header.menu], expected)
            for link in header.menu:
                url = urlparse(link['href'])
                if url.netloc and url.netloc != 'yousali.com':
                    continue
                path = self.output / url.path.lstrip('/')
                target = path if path.suffix else path / 'index.html'
                self.assertTrue(target.is_file(), f'{prefix}: {link["href"]}')

    def test_all_hosts_load_the_same_local_header_assets_with_integrity(self):
        css = set()
        scripts = set()
        for route in ['', 'kb', 'tools', 'tools/text-diff', 'en/tools/text-diff']:
            header = self.page(route)
            styles = [item for item in header.assets if '/site-header.' in item.get('href', '')]
            bootstraps = [item for item in header.scripts if 'data-site-header' in item]
            self.assertEqual(len(styles), 1, route)
            self.assertEqual(len(bootstraps), 1, route)
            for item, key, group in [(styles[0], 'href', css), (bootstraps[0], 'src', scripts)]:
                self.assertTrue(item[key].startswith('/'))
                self.assertIn('integrity', item)
                self.assertTrue((self.output / item[key].lstrip('/')).is_file())
                group.add(item[key])
        self.assertEqual(len(css), 1)
        self.assertEqual(len(scripts), 1)

    def test_shared_header_markup_contains_no_inline_script_or_handlers(self):
        for route in ['', 'tools/text-diff']:
            html = (self.output / route / 'index.html').read_text()
            header = re.search(r'<header class=["\']?site-header["\']?[^>]*>.*?</header>', html, re.S)
            self.assertIsNotNone(header, route)
            self.assertNotIn('<script', header.group())
            self.assertIsNone(re.search(r'\son[a-z]+=', header.group()))

    def test_subpath_deployment_keeps_menu_and_rss_under_the_base_path(self):
        for prefix in ['', 'en/']:
            html = (self.subpath / prefix / 'tools/text-diff/index.html').read_text()
            header = Header(html)
            rss = next(link for link in header.menu if link['text'] == 'RSS')
            self.assertEqual(urlparse(rss['href']).path, f'/preview/{prefix}index.xml')
            for link in header.links:
                url = urlparse(link['href'])
                if url.netloc and url.netloc != 'example.test':
                    continue
                self.assertTrue(url.path.startswith('/preview/'), link['href'])


if __name__ == '__main__':
    unittest.main()
