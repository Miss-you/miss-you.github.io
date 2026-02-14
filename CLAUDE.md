# Claude Code Guide

本指南供 AI 助手（Claude、Claude Code 等）处理本项目时参考。

## 创建新文章时的必要步骤

### 1. 文章目录结构
```
content/posts/YYYYMMDD-slug/
└── index.md
```

- 目录名格式：`YYYYMMDD-slug`（日期前缀 + 短横线分隔的 slug）
- permalink 由目录名决定，保持简洁稳定

### 2. Front Matter 模板（必须包含 lang）

```yaml
---
title: "文章标题"
date: 2026-02-14T12:30:00+08:00
draft: false
lang: zh                      # ← 必须！zh 或 en
tags: ["标签1", "标签2"]
categories: ["分类"]
description: "文章摘要"
cover:
    image: ""
    alt: ""
    caption: ""
    relative: true
---
```

**⚠️ 重要：lang 参数**
- 中文文章：`lang: zh`
- 英文文章：`lang: en`
- **不要省略** —— 省略会导致 Hugo 默认按英文分词统计字数，中文 6000 字可能只显示 "131 words"

### 3. 字数统计验证

发布后检查文章列表页的字数显示：
- 正确示例：`14 min · 6500 字`（中文）
- 正确示例：`8 min · 1200 words`（英文）
- 错误示例：`1 min · 131 words`（中文文章被错误统计）

如果看到错误示例，检查 front matter 是否缺少 `lang` 参数。

## 项目技术栈

- **静态生成器**: Hugo (v0.148.1)
- **主题**: PaperMod (子模块)
- **部署**: GitHub Pages (通过 GitHub Actions)

## 常用命令

```bash
# 本地预览
hugo server -D

# 生产构建
hugo --minify

# 部署（如果有 deploy.sh 权限）
./deploy.sh "commit message"
```

## 覆盖的文件

- `layouts/partials/post_meta.html` — 覆盖主题默认，使用 `.CountWords` 优化 CJK 字数统计

## 注意事项

1. 不要在 front matter 中使用驼峰命名，使用小写 kebab-case
2. 图片资源放在文章目录的 `images/` 子目录中
3. 运行 `hugo server` 前确保子模块已初始化：`git submodule update --init --recursive`
4. 不要提交 `public/` 目录（已在 .gitignore 中）

## 参考

- [AGENTS.md](./AGENTS.md) — 更详细的项目规范
- [PaperMod 文档](https://github.com/adityatelange/hugo-PaperMod/wiki)
