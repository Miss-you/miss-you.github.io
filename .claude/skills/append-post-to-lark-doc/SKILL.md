---
name: append-post-to-lark-doc
description: Use when a post from this repository should be appended to an existing Feishu doc or wiki page, especially when the user provides a target wiki/doc URL and wants update semantics with append as the default rather than creating a new child page.
---

# append-post-to-lark-doc

把本仓库里的文章追加到一个已经存在的飞书文档或 wiki 页面。

**REQUIRED SUB-SKILL:** Use `$publishing-markdown-to-lark-docs` for the actual upload workflow.

## When To Use

- 用户说“追加到已有文档”“发到这个飞书页面里”“更新这篇存量文档”
- 来源是本仓库里的 `content/posts/.../index.md`
- 目标是用户指定的 doc URL、doc token、wiki URL 或 wiki token

不要用于：

- 新建知识库子页
- 用户没有给目标文档且也不想指定
- 用户要求精确替换某一小段内容

## Required Inputs

1. 文章路径或可唯一定位到文章的 slug / 目录名
2. 目标飞书文档或 wiki 页面

## Workflow

### 1. Resolve Input

- 完整路径直接使用
- 只有 slug、目录名或标题片段时，在 `content/posts/` 下先定位唯一文章
- 结果不唯一时问用户

### 2. Resolve Target

- 接受 wiki URL、wiki token、doc URL、doc token
- 默认 `action: update`
- 默认 `update_mode: append`
- 只有用户明确说“覆盖”“整篇替换”时，才改成 `overwrite`

### 3. Run The Underlying Skill

默认执行语义：

```text
使用 $publishing-markdown-to-lark-docs 帮我把本地文章追加到已有飞书文档。

本次参数：
- input: <resolved post path>
- target: <user-provided doc/wiki target>
- action: update
- update_mode: append

先 dry-run，确认解析出的真实 doc token 和更新方式，再正式执行。每次写入后 fetch 回读确认。
```

### 4. Report Result

完成后至少返回：

- 文章路径
- 用户给的目标
- 解析出的真实 doc token
- 最终使用的 `update_mode`

## Common Mistakes

- 把追加场景错误地走成 `create`
- 用户没有明确要求时使用 `overwrite`
- 没有确认 wiki URL 最终解析出来的 doc token
- 忘了 fetch 回读确认内容真正落库
