---
title: "Hugo 文章目录管理教程"
date: 2025-07-15T19:55:00+08:00
draft: false
lang: en
tags: ["hugo", "blog", "tutorial"]
categories: ["技术"]
description: "演示如何为每个Hugo文章创建独立目录，便于管理文章相关的图片和资源"
---

# Hugo 文章目录管理教程

这篇文章演示了如何为每个Hugo文章创建独立的目录结构。

## 优势

1. **便于管理**：每个文章有自己的目录
2. **资源整理**：图片、附件等资源放在同一目录
3. **版本控制**：便于跟踪文章的变更历史
4. **SEO友好**：目录名可以作为URL的一部分

## 目录结构

```
content/posts/
├── 20250715-hugo-tutorial/
│   ├── index.md          # 文章内容
│   ├── cover.jpg         # 封面图片
│   └── images/           # 文章图片
│       └── diagram.png
└── another-post/
    ├── index.md
    └── assets/
        └── file.pdf
```

## 使用方法

### 1. 创建文章目录
```bash
hugo new posts/文章名称/index.md
```

### 2. 或者手动创建
```bash
mkdir -p content/posts/20250715-my-article
touch content/posts/20250715-my-article/index.md
```

这样每个文章都有自己的独立空间了！