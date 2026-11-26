---
title: "用 Clash / Mihomo 拦截单个域名"
slug: mihomo-block-single-domain
date: 2026-11-26
lastmod: 2026-11-26
lang: zh
topic: "工程实践"
summary: "以 play.googleapis.com 为例，添加单域名拦截规则，并在重载后通过日志确认命中。"
tags: [Clash, Mihomo, 网络排查]
draft: false
---

在兼容 Clash/Mihomo 规则语法的配置中，确认已设为 `mode: rule` 后，往原有 `rules:` 列表首位插入下面这一行，缩进沿用原列表。

```yaml {linenos=false}
- 'DOMAIN,play.googleapis.com,REJECT'
```

规则表按顺序从上往下检查，访问 `play.googleapis.com` 的连接会先命中这一条。`DOMAIN` 精确匹配完整域名，`REJECT` 直接拒绝连接。参考 Mihomo [规则优先级](https://wiki.metacubex.one/en/config/rules/#priority)、[DOMAIN](https://wiki.metacubex.one/en/config/rules/#domain) 与 [REJECT](https://wiki.metacubex.one/en/config/proxies/built-in/#reject)。

路由规则只在 `rule` 模式下生效，绕过代理的流量不受控制。参考 Mihomo [工作模式](https://wiki.metacubex.one/en/config/general/#operation-mode)。

同配置下，其他应用访问 `play.googleapis.com` 也会匹配拒绝规则，依赖该域名的功能可能受影响。

2026-11-23 这次修改只验证了配置文件本身。修改前后通过 Ruby 解析 YAML 比对，确认解析结果唯一的变化是在列表首位增加了这一项，写入后又复读确认处于 `mode: rule`、规则位于首位且只出现一次。客户端当时没有重载，也没有发起请求，实际命中情况尚未验证。

## 客户端如何确认

- 在客户端选中并重载当前生效的配置，确认处于 `rule` 模式。
- 发起一个经代理访问 `play.googleapis.com` 的新连接，查看连接日志是否显示该域名命中 `DOMAIN` 且策略为 `REJECT`（具体字段以客户端界面为准）。
- 请求报错无法单独证明命中。如果日志里查不到记录，先检查生效配置是否选对，以及流量是否真的经过代理。

如需恢复，删掉这一行并重新加载配置即可。
