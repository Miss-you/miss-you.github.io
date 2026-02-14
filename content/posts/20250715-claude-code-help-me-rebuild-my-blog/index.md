---
title: "20250715 Claude Code Help Me Rebuild My Blog"
date: 2025-07-15T20:25:02+08:00
draft: true
lang: en
tags: []
categories: []
description: ""
cover:
    image: ""
    alt: ""
    caption: ""
    relative: true
---

# 20250715 Claude Code Help Me Rebuild My Blog

开始写作吧...

## 📁 目录结构

这篇文章位于：`content/posts/20250715-claude-code-help-me-rebuild-my-blog/`

推荐的目录结构：
```
20250715-claude-code-help-me-rebuild-my-blog/
├── index.md          # 文章主内容
├── images/           # 图片资源
│   ├── cover.jpg
│   └── diagram.png
└── assets/           # 其他资源
    ├── data.json
    └── document.pdf
```

## 🖼️ 使用图片

引用同目录下的图片：

```markdown
![图片描述](./images/example.jpg)
```

## 📎 使用资源文件

引用同目录下的资源：

```markdown
[下载PDF](./assets/document.pdf)
```

## 🎨 封面图片配置

```yaml
cover:
    image: "./images/cover.jpg"
    alt: "封面图片描述"
    caption: "图片说明"
    relative: true
```

## 📝 Front Matter 说明

- `title`: 文章标题
- `date`: 发布日期 (格式: YYYY-MM-DDTHH:MM:SS+08:00)
- `draft`: 是否为草稿 (true/false)
- `tags`: 标签数组 ["tag1", "tag2"]
- `categories`: 分类数组 ["category1"]
- `description`: 文章描述 (用于SEO和摘要)
- `cover`: 封面图片配置