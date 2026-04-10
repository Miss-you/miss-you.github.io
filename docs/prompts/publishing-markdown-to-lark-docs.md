# Publishing Markdown To Lark Docs Prompts

下面两段是给 `$publishing-markdown-to-lark-docs` 的常用 prompt 模板，直接复制后替换参数即可。

## 新建到知识库节点下

```text
使用 $publishing-markdown-to-lark-docs 帮我把本地文章上传到飞书知识库。

本次参数：
- input: /Users/lihui/Documents/GitHub/miss-you.github.io/content/posts/20260405-harness-engineering-guide/index.md
- target: https://my.feishu.cn/wiki/FQAvwXINfi2mV7k8q4jccLjEnne
- action: create

先 dry-run，确认无误后正式执行。长文请分段上传，并在每次写入后 fetch 回读确认。
```

## 追加到已有文档

```text
使用 $publishing-markdown-to-lark-docs 帮我把本地文章追加到已有飞书文档。

本次参数：
- input: /path/to/article.md
- target: https://my.feishu.cn/wiki/xxxxxxxx
- action: update
- update_mode: append

先 dry-run，确认解析出的真实 doc token 和更新方式，再正式执行。每次写入后 fetch 回读确认。
```

## 使用建议

- `target` 可以填 wiki URL、wiki node token、doc URL 或 doc token
- `action: create` 用于新增一篇子文档
- `action: update` 用于修改已有文档
- 只有明确要整篇覆盖时，才把 `update_mode` 改成 `overwrite`
