---
name: publish-post
description: 从用户在对话中提供的文本创建 Hugo 博客文章，自动生成 front matter、运行 check-posts.py 检查、git commit 并 push。当用户贴一段文字并要求发博客、创建文章、发布文章、帮我发到博客、把这段文字变成博客、commit and push 这篇文章时使用。
user_invocable: true
---

# publish-post

用户在对话中贴出的文本即为文章正文。从中提取元信息，创建 Hugo 博客文章，完成检查、commit、push 全流程。

## 执行流程

### Step 1：分析内容

从用户对话中提供的文本提取：
- **标题**：取一级标题（`# ...`），没有则用 AskUserQuestion 询问
- **语言**：根据正文主体语言判断 `zh` 或 `en`
- **slug**：从标题提炼简洁英文 kebab-case slug（不超过 5 个词）
- **tags / categories**：从内容语义推断，中文文章用中文标签，英文用英文
- **description**：提炼 1-2 句摘要

### Step 2：确认信息

用 AskUserQuestion 向用户确认 slug、tags、categories、description（合并为一次提问）。

跳过条件：用户已明确指定这些信息。

### Step 3：创建文章

1. 创建目录 `content/posts/YYYYMMDD-slug/`（YYYYMMDD 为当天日期）
2. 写入 `index.md`，front matter 模板：

```yaml
---
title: "文章标题"
date: YYYY-MM-DDTHH:MM:SS+08:00
draft: false
lang: zh  # 或 en
tags: ["标签1", "标签2"]
categories: ["分类"]
description: "文章摘要"
---
```

3. 正文：用户提供的文本（去掉一级标题，Hugo 从 title 渲染）

**必须遵守**：
- `lang` 参数不可省略——中文 `zh`，英文 `en`
- front matter key 全部小写 kebab-case
- date 使用 `+08:00` 时区
- 不要修改用户的正文内容

### Step 4：运行检查

```bash
python3 check-posts.py
```

确认新文章 `lang` 正确、字数估算合理。不通过则修复后再继续。

### Step 5：Commit

```bash
git add content/posts/YYYYMMDD-slug/index.md
git commit -m "$(cat <<'EOF'
add post: 文章标题简述

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

commit message 前缀 `add post:`，保持与仓库历史风格一致。

### Step 6：Push

```bash
git push
```

### Step 7：确认完成

输出文章路径、预估字数、线上 URL `https://yousali.com/posts/YYYYMMDD-slug/`。

## 用户指令变体

| 用户说 | 行为 |
|--------|------|
| "不要 push" / "只 commit" | 跳过 Step 6 |
| "draft" / "草稿" | 设 `draft: true` |
| 指定了 tags/slug/description | 直接使用，跳过 Step 2 确认 |
| 正文没有标题 | AskUserQuestion 询问标题 |
