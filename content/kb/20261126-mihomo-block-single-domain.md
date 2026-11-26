---
title: "用 Antigravity 一周多代理流量暴涨约 100 GB，屏蔽 play.googleapis.com 止住"
slug: mihomo-block-single-domain
date: 2026-11-26
lastmod: 2026-11-27
lang: zh
topic: "工程实践"
summary: "使用 Google Antigravity 期间一周多代理总流量约 100 GB，在 Clash/Mihomo 屏蔽 play.googleapis.com 后没有继续飞速上涨。"
tags: [Antigravity, Clash, Mihomo, 网络排查]
draft: false
---

最近用 Google Antigravity 一周多，我的代理总流量涨到了约 100 GB。我把异常消耗指向 Antigravity 的后台遥测上报，于是在 Clash/Mihomo 里拦截了 `play.googleapis.com`。之后再看，代理流量没有再飞速上涨。

## 怎么拦截，怎么确认流量降下来

在现有 Clash/Mihomo 的规则模式配置里，把下面这行插到原有 `rules:` 列表首位，沿用原有缩进，再到客户端重载配置即可。

```yaml {linenos=false}
- 'DOMAIN,play.googleapis.com,REJECT'
```

Clash/Mihomo 规则列表按自上而下的顺序优先匹配，`DOMAIN` 负责匹配完整域名（[Mihomo 规则文档](https://wiki.metacubex.one/en/config/rules/)）。这条域名拦截也会作用于同一配置下的其他应用。

改完后，可以在客户端连接日志里查看发往 `play.googleapis.com` 的连接是否命中 `REJECT`，并在相近的使用量和时长下，对比新增代理流量是否降了下来。

官方更新日志里也有相关记录。Google Antigravity App 在 2026-11-24 发布的 v2.35.1 中，修复了后台诊断上传未压缩、没有批次大小限制的问题，这类问题会消耗额外上传带宽并导致超大批次失败（[Antigravity Changelog](https://antigravity.google/docs/changelog)）。此外，Google AI Developers Forum 上也有 Windows 用户 Hachii_kawa 报告过，Antigravity v2.33.0 的 `language_server.exe` 会向 `play.googleapis.com` 大量上传数据（[论坛原帖](https://discuss.ai.google.dev/t/excessive-background-upload-from-language-server-exe-25-gb-in-24h-10-gb-during-sleep-on-v2-33-0/202956/1)）。遇到类似消耗异常时，除了先用代理规则临时拦截，也可以留意版本更新。
