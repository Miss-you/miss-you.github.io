# 知识库维护指南

入口：`/kb/`，英文入口：`/en/kb/`。正文放在 `content/kb/`，与博客共用 Hugo 和 GitHub Pages。

## 最简单的新增方式

新增 `content/kb/YYYYMMDD-my-note.md`，填好 front matter，再写普通 Markdown：

```yaml
---
title: "这条知识回答什么问题"
slug: my-note
date: 2026-11-08
lastmod: 2026-11-08
lang: zh
topic: "工程实践"
summary: "在列表里显示的一句话简介。"
takeaway: "最值得记住的一句话，可省略。"
tags: [排查]
draft: false
---
```

把日期改成实际日期。也可以运行：

```bash
hugo new content --kind kb kb/20261108-my-note.md
```

这条命令默认生成草稿，发布前把 `draft: true` 改成 `false`。开发服务器包含草稿；生产构建不包含草稿。

## 字段与目录规则

- `title`：显示标题，可以随时修改。
- `slug`：稳定的短地址。上例生成 `/kb/my-note/`；标题改了，保留 slug 即可保持链接。避免与其他条目重复。
- `date`：首次写作日期。
- `lastmod`：最后修订日期。更新正文时一起修改，列表按这个字段从新到旧排列。
- `lang`：必须填写。中文 `zh`，英文 `en`。
- `topic`：左侧主题目录，直接填文字。相同值自动聚合，新值自动成为新主题；省略时归入「未分类」。不用手动维护 JSON 或主题清单。
- `summary`：列表摘要；省略时由正文自动提取。
- `takeaway`：阅读页开头的一句话结论，可省略。
- `tags`：可选关键词，参与知识库搜索。
- `draft`：未完成内容保持 `true`。

## 图片、链接和翻译

带图片的笔记改用 `content/kb/YYYYMMDD-my-note/index.md`，图片放在同一目录，使用 `![说明](image.png)`。从单文件改成目录时，保留 slug，且保持父目录层级即可维持地址。

正文的二级、三级标题自动生成本页目录。用正常 Markdown 链接关联文章、知识或实验室：`[标题](/kb/my-note/)`。同主题条目还会自动出现在阅读页的相关知识中。

英文翻译用同目录下的 `index.en.md`（或单文件的 `YYYYMMDD-my-note.en.md`），设置 `lang: en` 并保留相同 slug；它会出现在 `/en/kb/`。只写中文也可以，不必准备英文副本。

支持主题文件夹；嵌套笔记会自动收录。不过父目录会进入 URL，已经分享的条目不要随意改变目录层级。主题分类优先通过 `topic` 修改。

## 预览、验证和发布

```bash
./serve.sh
# 打开 http://localhost:1313/kb/

python3 -m unittest discover -s tests -p 'test_knowledge_base.py'
node --check assets/js/kb.js
hugo --minify --buildFuture
```

提交 Markdown 和附件到 `main` 后，现有 GitHub Actions 会发布整个站点。不要提交生成的 `public/`。

博客首页、归档及主 RSS 只列博客文章；知识库单独提供 `/kb/index.xml`。已有全站 JSON 索引也会自动包含知识条目，知识库内的搜索仅检索当前语言的知识正文。
