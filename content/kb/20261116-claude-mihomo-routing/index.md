---
title: Claude 分流规则：Mihomo 配置与验收
slug: claude-mihomo-routing
date: 2026-11-16
lastmod: 2026-11-18
lang: zh
outputs: [HTML, Markdown]
topic: "工程实践"
summary: 适用于 Mihomo（原 Clash.Meta）的 24 条 Claude 分流规则，涵盖官方核心域名、可选共享主机边界、入站 CIDR 方向及静态与实网验证方法。
tags: [Claude, Mihomo, 网络排查]
draft: false
---

在 Mihomo（原 Clash.Meta）配置文件中核对或部署 Claude 分流前，请先确认配置里已有名为 `Claude` 的策略组。随后，在 `rules:` 下按已有缩进逐字粘贴以下包含可选辅助主机的完整 24 条启用规则示例，置于可能先命中的通用规则及 `MATCH` 之前；后文会区分官方要求和可选共享主机。

## 完整规则（YAML）

```yaml
# ===== Claude 核心域名 =====
- 'DOMAIN-SUFFIX,anthropic.com,Claude'
- 'DOMAIN-SUFFIX,claude.ai,Claude'
- 'DOMAIN-SUFFIX,claude.com,Claude'
- 'DOMAIN-SUFFIX,claude.app,Claude'
- 'DOMAIN-SUFFIX,claudeusercontent.com,Claude'
- 'DOMAIN-SUFFIX,claudemcpcontent.com,Claude'
- 'DOMAIN-SUFFIX,claudemcpclient.com,Claude'
- 'DOMAIN-SUFFIX,clau.de,Claude'
- 'DOMAIN-SUFFIX,claude.dev,Claude'
# ===== Claude CDN / 认证 / 内容站 =====
- 'DOMAIN,servd-anthropic-website.b-cdn.net,Claude'
- 'DOMAIN,anthropic.com.cdn.cloudflare.net,Claude'
- 'DOMAIN,anthropic.auth0.com,Claude'
- 'DOMAIN,anthropic-com.ghost.io,Claude'
- 'DOMAIN-SUFFIX,anthropic.skilljar.com,Claude'
# ===== Claude 遥测 / 网站统计 =====
- 'DOMAIN,browser-intake-us5-datadoghq.com,Claude'
- 'DOMAIN,http-intake.logs.us5.datadoghq.com,Claude'
- 'DOMAIN,cdn.usefathom.com,Claude'
# ===== Claude Persona 身份验证 =====
- 'DOMAIN,inquiry.withpersona.com,Claude'
- 'DOMAIN,cdn.withpersona.com,Claude'
- 'DOMAIN,sdk.withpersona.com,Claude'
- 'DOMAIN,miniapp.withpersona.com,Claude'
# ===== Claude 官方入站 IP 兜底 =====
- 'IP-CIDR,160.79.104.0/23,Claude,no-resolve'
- 'IP-CIDR,153.61.224.0/22,Claude,no-resolve'
- 'IP-CIDR6,2607:6bc0::/48,Claude,no-resolve'
# - 'IP-ASN,399358,Claude,no-resolve'
```

## 官方要求与可选共享主机

根据 [Claude Desktop 网络要求](https://code.claude.com/docs/en/desktop#network-access-requirements) 与 [Claude Code 网络配置](https://code.claude.com/docs/en/network-config#network-access-requirements)，官方 Desktop 清单明确包含 `claude.app` 及动态 `livepreview` 子域；结合网络配置文档中的 `anthropic.com`、`claude.ai`、`claude.com`、`claudeusercontent.com`、`claudemcpcontent.com` 后缀，可覆盖 API、登录、下载、桥接与 MCP 小组件。

`claude.dev` 用于开发者博客，`clau.de` 与 `claudemcpclient.com` 作为扩展覆盖纳入，`anthropic.skilljar.com` 保留为辅助内容域名。GitHub 上的社区列表仅用于发现候选域名，并非独立证据，不宜将额外的社区域名全部视为必需。参考：[Claude Academy 开发者博客入口](https://academy.claude.com/products/code)、[v2fly anthropic 列表](https://raw.githubusercontent.com/v2fly/domain-list-community/master/data/anthropic)、[MetaCubeX anthropic.list](https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/anthropic.list)。

`browser-intake-us5-datadoghq.com` 与 `http-intake.logs.us5.datadoghq.com` 属于可选遥测，改用两条精确 `DOMAIN` 规则，并保留 `cdn.usefathom.com` 精确规则（参见 [Claude Code 网络要求](https://code.claude.com/docs/en/network-config#network-access-requirements)）。为避免误伤非 Claude 流量，移除 `datadog`、`sift` 关键词及 Sentry、Statsig、Intercom 共享后缀；GitHub、Google Storage、npm 等共享主机沿用原来的通用策略。

[Claude 身份验证说明](https://support.claude.com/en/articles/14328960-identity-verification-on-claude) 确认 Persona 为 Claude 的身份验证合作方。本示例从 [Persona 安全与域名清单](https://docs.withpersona.com/security) 中启用了 4 个主机（`inquiry.withpersona.com`、`cdn.withpersona.com`、`sdk.withpersona.com`、`miniapp.withpersona.com`），但它们只是通用共享主机，不能推导为 Claude 必需。

## 入站 CIDR 方向与匹配顺序

IP 兜底规则采用官方发布的入站地址段 `160.79.104.0/23`、`153.61.224.0/22` 与 `2607:6bc0::/48`（均附加 `no-resolve`），替换范围更宽的 IPv4 `/21`（实为 Anthropic 出站范围）与旧 IPv6 `/32`；`IP-ASN,399358` 默认注释，按需启用。参考：[Anthropic API IP 地址文档](https://platform.claude.com/docs/zh-CN/api/ip-addresses)。

依据 [Mihomo 规则配置文档](https://wiki.metacubex.one/en/config/rules/)，Mihomo 按自上而下的顺序匹配规则，因此整段 Claude 规则必须置于可能先命中的通用规则及兜底 `MATCH` 之前。`no-resolve` 不会主动触发 DNS 查询，但若前置规则已经触发过 DNS 解析，IP 规则仍可命中。

## 验证状态与实网排查

以下仅为本次修改的配置的静态核对记录，不代表读者自己的配置自动通过：YAML 语法可正常解析、`Claude` 策略组存在（本次仅保留一个候选，其他策略组与节点定义保持原样）、24 条启用的规则位于原规则块位置、非 Claude 配置未变。**尚未验证**运行中客户端的重新加载与实网出口。

实网验收需按顺序执行以下检查（各连接场景与本地链路排查按实际使用条件触发，不必逐项强行跑满）：

| 顺序与场景 | 动作 | 核对什么 |
| --- | --- | --- |
| 1. 重载配置 | 在运行中的 Mihomo客户端重新加载配置文件 | 确认无报错或策略组缺失提示 |
| 2a. 网页对话 | 发起网页对话，查看客户端连接日志 | 实际选中的出站节点，以及 `claude.ai`等核心域命中的规则策略 |
| 2b. 普通 CLI 请求 | 发起普通 CLI 请求，查看连接日志 | 仅能确认 API 路由的实际出站节点与命中规则策略 |
| 2c. 登录与下载（实际触发时） | 在后续实际使用中自然触发时查看日志（不建议为测试而专门退出登录） | 登录与下载链路的出站节点及规则策略 |
| 2d. Desktop 预览（如使用 Desktop） | 按需触发预览并查看连接日志 | `claude.app`及动态 `livepreview`子域的出站节点与规则策略 |
| 3. 排查本地链路（仅日志缺失时） | 若 CLI 或桌面端流量未出现在 Mihomo日志中，排查本地代理接管 | 终端代理环境变量（`HTTP_PROXY` /`HTTPS_PROXY`）或系统 TUN 模式接管状态 |
