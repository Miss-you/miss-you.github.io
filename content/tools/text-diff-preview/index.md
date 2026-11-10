---
title: "文本对比 · 预览版"
description: "本地比较与编辑文本、代码和数据，支持逐字高亮、合并、文件导入和报告导出。"
lang: zh
type: text-compare
comments: false
---

本页基于 text-compare-lite 改造，仍在预览阶段。比较在浏览器本地进行，不上传文本或文件；页面只加载本站资源，没有统计脚本。默认关闭历史记录和恢复文本。设置会保存在浏览器，只有主动保存或开启历史记录、恢复文本时才保存文本。可以在「本地记录」中删除保存内容。

「复制链接」会把两侧文本压缩放进网址的 `#` 后面，并写入剪贴板。获得完整链接的人可以读取内容；这不是加密分享。点击前请确认内容适合分享。

支持纯文本、代码、JSON、CSV/TSV，以及从 Word（.docx）、Excel（.xlsx）和 PDF 中提取文本后比较。文档模式不比较排版，PDF 不含 OCR，图片比较按像素进行。中文旧编码文件请先转换为 UTF-8。大文件或大幅改写可能降低精细度，仍受浏览器性能限制。

自定义忽略规则使用 RE2 语法，不支持反向引用或前瞻；不支持的规则会提示。切换视图不会清空文本。页面关闭或刷新后，未主动保存的文本会丢失；请及时复制或下载需要保留的结果。

[上游项目](https://github.com/JamesClayPatton/text-compare-lite) · [本站修改版本源码与构建说明](https://github.com/Miss-you/miss-you.github.io/tree/main/tools/text-compare-lite)。本工具代码遵循 GNU AGPL-3.0，保留原作者 James Patton 署名。
