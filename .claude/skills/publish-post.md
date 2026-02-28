---
name: publish-post
description: 从用户提供的文本创建博客文章，自动生成 front matter、运行检查、commit 并 push。当用户贴一段文字要求发博客/创建文章/发布文章时使用。
user_invocable: true
---

# Skill: publish-post

将用户提供的文本内容创建为 Hugo 博客文章，完成从创建到推送的全流程。

## 触发条件

用户贴了一段文字并要求：创建博客、发文章、发布、帮我发到博客、commit and push 等。

## 执行流程

### Step 1：分析内容

从用户提供的文本中提取：
- **标题**：取文章的一级标题（`# ...`），如果没有则让用户提供
- **语言**：根据内容主体语言判断 `zh` 或 `en`
- **slug**：从标题提炼简洁的英文 kebab-case slug（不超过 5 个词）
- **tags / categories**：从内容语义推断，中文文章用中文标签，英文文章用英文标签
- **description**：提炼 1-2 句摘要

### Step 2：确认信息

用 AskUserQuestion 向用户确认以下关键信息（合并为一次提问）：
- 建议的 slug、tags、categories、description
- 是否需要调整

如果用户指定了明确的标题/标签等，跳过确认直接使用。

### Step 3：创建文章

1. 目录：`content/posts/YYYYMMDD-slug/index.md`（YYYYMMDD 为当天日期）
2. Front matter 模板：

```yaml
---
title: "文章标题"
date: YYYY-MM-DDTHH:MM:SS+08:00
draft: false
lang: zh  # 或 en，根据内容判断
tags: ["标签1", "标签2"]
categories: ["分类"]
description: "文章摘要"
---
```

3. 正文：用户提供的文本内容（去掉一级标题，因为 Hugo 会从 title 渲染）

**注意事项**：
- `lang` 参数**必须包含**，中文 `zh`，英文 `en`
- front matter key 全部小写 kebab-case
- date 使用 +08:00 时区
- 不要擅自修改用户的正文内容

### Step 4：运行检查

```bash
python3 check-posts.py
```

确认：
- 新文章的 `lang` 参数正确
- 字数估算合理（中文文章应显示 "X 字"，英文应显示 "X words"）

如果检查不通过，修复后再继续。

### Step 5：Commit

```bash
git add content/posts/YYYYMMDD-slug/index.md
git commit -m "$(cat <<'EOF'
add post: 文章标题简述

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

commit message 格式：
- 前缀 `add post:`
- 后跟文章标题的简短描述
- 保持与仓库历史风格一致

### Step 6：Push

```bash
git push
```

### Step 7：确认完成

输出：
- 文章路径
- 预估字数
- 线上 URL：`https://yousali.com/posts/YYYYMMDD-slug/`

## 用户额外指令处理

- 如果用户说 **"不要 push"** 或 **"只 commit"**：跳过 Step 6
- 如果用户说 **"draft"** 或 **"草稿"**：设置 `draft: true`
- 如果用户提供了**具体的 tags/slug/description**：直接使用，不再确认
- 如果用户贴的内容中**没有明确标题**：用 AskUserQuestion 询问
