---
name: publish-to-ai-coding-wiki
description: Use when a post from this repository should be published as a new child page under the fixed Feishu wiki node `AI Coding 分享`, especially when the user says 上传到知识库、发到飞书知识库、新建一篇知识库文章、或要把某篇 content/posts 文章发到 AI Coding 分享。
---

# publish-to-ai-coding-wiki

把本仓库里的文章发布到固定的飞书知识库节点 `AI Coding 分享`，作为一篇新的子文档。

**REQUIRED SUB-SKILL:** Use `$publishing-markdown-to-lark-docs` for the actual upload workflow.

## Fixed Target

- Feishu wiki node: `https://my.feishu.cn/wiki/FQAvwXINfi2mV7k8q4jccLjEnne`
- action: `create`

## When To Use

- 用户说“把这篇发到知识库”“上传到 AI Coding 分享”“新建一篇飞书知识库文章”
- 文章来源是本仓库里的 `content/posts/.../index.md`
- 目标就是固定知识库节点，不需要用户每次重复给 target

不要用于：

- 追加到已有飞书文档
- 覆盖已有飞书文档
- 上传到别的 wiki node / wiki space

这些场景改用 `$publishing-markdown-to-lark-docs` 或本仓库里更合适的 skill。

## Workflow

### 1. Resolve Input

- 如果用户给了完整文章路径，直接使用
- 如果用户只给了文章 slug、目录名或标题片段，先在 `content/posts/` 下定位唯一的 `index.md`
- 如果匹配出多篇，再问用户，不要猜

### 2. Run The Underlying Skill

默认执行语义：

```text
使用 $publishing-markdown-to-lark-docs 帮我把本地文章上传到飞书知识库。

本次参数：
- input: <resolved post path>
- target: https://my.feishu.cn/wiki/FQAvwXINfi2mV7k8q4jccLjEnne
- action: create

先 dry-run，确认无误后正式执行。长文请分段上传，并在每次写入后 fetch 回读确认。
```

### 3. Report Result

完成后至少返回：

- 文章路径
- 固定目标 wiki node
- 新建文档标题
- 新建后的 wiki/doc 链接

## Common Mistakes

- 把这个 skill 用在“修改已有文档”的场景
- 用户没给完整路径时直接猜文章
- 忘了先 dry-run
- 把目标改成别的 wiki 节点却还声称是本 skill 的默认流程
