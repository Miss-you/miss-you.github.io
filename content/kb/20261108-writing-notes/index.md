---
title: "怎样添加一条知识笔记"
slug: writing-notes
date: 2026-11-08
lastmod: 2026-11-08
lang: zh
topic: "知识管理"
summary: "新增一个 Markdown 文件，目录、主题和搜索会在构建时自动更新。"
takeaway: "一条笔记对应一个 Markdown 文件，用 topic 归类，用 slug 保持链接稳定。"
tags: [Markdown, 知识管理]
---

## 添加笔记

在 `content/kb/` 下新建文件，比如 `20261108-my-note.md`，复制下面的开头，再写正文：

```yaml
---
title: "这里写要回答的小问题"
slug: my-note
date: 2026-11-08
lastmod: 2026-11-08
lang: zh
topic: "工程实践"
summary: "一句话说明这条笔记能解决什么问题。"
takeaway: "最值得记住的结论，可省略。"
tags: [排查]
draft: false
---
```

日期改成实际写作日期。`topic` 是左侧目录里的主题；相同主题会自动归在一起，新主题也会自动出现。`slug` 决定链接，这条示例笔记的地址是 `/kb/my-note/`。

也可以在仓库目录运行下面的命令，先生成一份草稿：

```bash
hugo new content --kind kb kb/20261108-my-note.md
```

生成的笔记默认 `draft: true`。准备发布时改成 `false`。

## 写正文

像普通 Markdown 一样写，标题、列表、代码块和链接都能使用。二级、三级标题会自动生成本页目录。

几句话能说明白，就写几句话。如果要记录一次经历，可以参考[把一次经历整理成可复用的经验](/kb/reusable-experience/)。

## 更新旧知识

直接编辑原来的文件，并把 `lastmod` 改成修订日期。目录按更新时间排列，链接保持不变。修改标题或移动分类时，保留原来的 `slug`。

## 添加图片与发布

笔记带图片时，可以使用文件夹：`content/kb/20261108-my-note/index.md`，图片也放在这个文件夹中，然后用 `![说明](image.png)` 引用。

本地运行 `./serve.sh`，打开 `/kb/` 预览。内容推送到 `main` 后，现有 GitHub Actions 会统一构建并发布博客与知识库。
