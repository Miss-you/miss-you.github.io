"""Build real pages to check Markdown discovery and blog/knowledge compatibility."""

import json
from html import unescape
import os
from pathlib import Path
import re
import shutil
import subprocess
import tempfile
import unittest
import xml.etree.ElementTree as ET


REPO = Path(__file__).resolve().parents[1]


class KnowledgeBaseAcceptance(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.workspace = tempfile.TemporaryDirectory(prefix="ydd-kb-acceptance-")
        cls.addClassCleanup(cls.workspace.cleanup)
        cls.root = Path(cls.workspace.name)
        content = cls.root / "content"
        shutil.copytree(REPO / "content", content)
        kb = content / "kb"
        kb.mkdir(exist_ok=True)
        for suffix, lang, title in [("", "zh", "知识库"), (".en", "en", "Knowledge base")]:
            index = kb / f"_index{suffix}.md"
            if not index.exists():
                index.write_text(f'---\ntitle: "{title}"\nlang: {lang}\n---\n', encoding="utf-8")
        fixture = kb / "nested" / "20261108-acceptance-probe"
        fixture.mkdir(parents=True)
        fixture.joinpath("index.md").write_text(
            '---\ntitle: "独立知识验收条目"\nslug: acceptance-probe\n'
            'date: 2026-11-08\nlastmod: 2030-01-02\nlang: zh\n'
            'topic: "排障 & 修复"\nsummary: "列表摘要"\n'
            'takeaway: "可重复验证的一句话"\ntags: [验收]\n---\n\n'
            '## 复现步骤\n\n正文专用检索词。\n\n## 适用条件\n\n只用于构建验收。\n',
            encoding="utf-8",
        )
        fixture.joinpath("index.en.md").write_text(
            '---\ntitle: "Independent knowledge acceptance entry"\nslug: acceptance-probe\n'
            'date: 2026-11-08\nlastmod: 2030-01-02\nlang: en\n'
            'topic: Engineering\nsummary: "English acceptance summary"\n---\n\n'
            '## Reproduce\n\nEnglish body-only query.\n', encoding="utf-8",
        )
        kb.joinpath("acceptance-draft.md").write_text(
            '---\ntitle: "UNPUBLISHED_KB_DRAFT"\nlang: zh\ndraft: true\n---\nDraft.\n',
            encoding="utf-8",
        )
        cls.output = cls.root / "public"
        subprocess.run(
            [os.environ.get("HUGO_BIN", "hugo"), "--source", str(REPO), "--contentDir", str(content),
             "--destination", str(cls.output), "--cacheDir", str(cls.root / "cache"),
             "--buildFuture", "--minify"],
            check=True, capture_output=True, text=True,
        )

    def read(self, path):
        return (self.output / path).read_text(encoding="utf-8")

    def test_directory_discovers_nested_notes_and_full_text_without_manual_index(self):
        page = self.read("kb/index.html")
        self.assertIn('id=kb-search', page)
        self.assertIn("独立知识验收条目", page)
        self.assertTrue("排障 & 修复" in unescape(page), "topic labels must survive HTML escaping and minification")
        payload = re.search(r'<script[^>]*id=["\']?kb-search-data["\']?[^>]*>(.*?)</script>', page, re.S)
        self.assertIsNotNone(payload, "knowledge search data must be generated from Markdown")
        entries = json.loads(payload.group(1))
        entry = next(item for item in entries if item["title"] == "独立知识验收条目")
        self.assertIn("正文专用检索词", entry["content"])
        self.assertEqual("排障 & 修复", entry["topic"])
        self.assertNotIn("UNPUBLISHED_KB_DRAFT", page)

    def test_reader_keeps_site_shell_and_generates_contents_and_sidebar(self):
        page = self.read("kb/nested/acceptance-probe/index.html")
        for text in ["Yousa Driven Development", "知识目录", "本页目录", "复现步骤", "可重复验证的一句话", "2030-01-02"]:
            self.assertIn(text, page)
        self.assertIn('id=theme-toggle', page)
        self.assertIn('aria-current=page', page)
        self.assertIn("kb-main", page)

    def test_blog_home_archive_and_main_feed_exclude_knowledge_notes(self):
        for path in ["index.html", "archives/index.html", "index.xml"]:
            with self.subTest(path=path):
                self.assertNotIn("独立知识验收条目", self.read(path))
        links = [item.findtext("link") for item in ET.fromstring(self.read("index.xml")).findall("channel/item")]
        self.assertTrue(links)
        self.assertTrue(all("/posts/" in link for link in links))

    def test_knowledge_feed_contains_nested_entries(self):
        feed = ET.fromstring(self.read("kb/index.xml"))
        titles = [item.findtext("title") for item in feed.findall("channel/item")]
        self.assertIn("独立知识验收条目", titles)
        self.assertNotIn("UNPUBLISHED_KB_DRAFT", titles)

    def test_english_route_uses_english_controls_and_language_local_notes(self):
        page = self.read("en/kb/index.html")
        self.assertIn("Search knowledge base", page)
        self.assertIn("Independent knowledge acceptance entry", page)
        self.assertNotIn("独立知识验收条目", page)

    def test_lab_stays_available_and_animations_are_copied_verbatim(self):
        self.assertIn("Lab", self.read("lab/index.html"))
        path = "lab/risk-lessons/lesson1-ruin.html"
        self.assertEqual((REPO / "static" / path).read_bytes(), (self.output / path).read_bytes())

    def test_authoring_command_creates_a_draft_with_a_stable_slug(self):
        content = self.root / "new-content"
        content.mkdir(exist_ok=True)
        subprocess.run(
            [os.environ.get("HUGO_BIN", "hugo"), "new", "content", "--source", str(REPO),
             "--contentDir", str(content), "--kind", "kb", "kb/20261108-my-note.md"],
            check=True, capture_output=True, text=True,
        )
        note = (content / "kb/20261108-my-note.md").read_text(encoding="utf-8")
        self.assertIn('slug: "my-note"', note)
        self.assertIn("lang: zh", note)
        self.assertIn("draft: true", note)


if __name__ == "__main__":
    unittest.main()
