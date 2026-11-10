---
title: "Building a reliable, multi-region LLM gateway"
slug: "m03-optiver-multi-region-llm-gateway"
date: 2026-11-05T16:15:00+08:00
lang: zh
session: "M03"
speaker: "Xinghong Fang"
org: "Optiver"
stage: "主舞台"
summary: "LLM 请求有状态，协议翻译、简单负载均衡、跨区域共享库都会出问题；Optiver 靠会话粘性、功能取交集、备份常态分流、鉴权本地化和全链路 tracing 补，最后放弃协议翻译、自建精简网关。"
video: ""
source: "external-recording"
draft: false
---

据现场外部录音整理，未与本人录音对照。讲者是 Optiver 的 AI Engineer，英文演讲，无问答环节；幻灯片上的监控图和 trace 截图只能从口述还原。

## 一句话

LLM 网关看着只是转发请求，但 LLM 请求有状态（流式、缓存、thinking 链），协议翻译、简单负载均衡、跨区域共享库都会出问题。Optiver 靠同会话粘性、功能取交集、备份常态分流、鉴权本地化、全链路 tracing 一路补，最后放弃协议翻译，自建精简网关。

## 论断

### 1. HTTP 200 不等于成功

他说网关已经像水电一样成了基础设施，一出问题所有人都知道，用户比监控还快。流中途卡住、缓存被破坏、thinking block 被静默丢掉，这些问题最后多半归到协议翻译上。

> "HTTP 200, which is the standard HTTP code for successful requests, does not always mean successful here." ——HTTP 200 在这里不一定代表成功。

- 规模：每天约 300 万次 LLM 请求，四个数据中心，22 个模型承担 95% 的请求，上游协议有 Anthropic Messages、OpenAI 兼容、Gemini 等。上游错误率约 0.4%，没说统计口径；他的意思是基数大时错误就多，单个用户碰到一次体验就坏了。
- 起点是一个开源 LLM 网关，免写代码就能支持多 provider 和协议互译，服务内部几千名用户。名字没说。
- 早上 Slack 里有人抱怨，下面的 +1 从 10、20、30 涨到 100。用户分不清是网关、上游还是工具调用坏了。
- 缓存命中通常只付约十分之一的价格，翻译出错导致缓存失效后，成本很快翻倍甚至三倍。没给具体金额。
- 静默失败：Anthropic 的 thinking block 以加密签名形式返回，某些情况下在响应里被静默丢掉。当次用户看不出，下一轮因为思维链断了，上游要重新生成，延迟和成本都上升。是一位用户的 agent 发现了异常，最后定位为从 OpenAI 兼容 harness 调 Anthropic 模型时的协议翻译 bug。他们因此告诉用户别用 OpenAI 兼容 harness 调 Anthropic 模型，反之亦然。

### 2. failover 不能当普通负载均衡做

每个重要模型至少接两家 provider 互相 failover，但因为 LLM 请求有状态，不能简单负载均衡。

> "you cannot simply load balance between them. Because the nature of LLM request is stateful." ——不能简单负载均衡，因为 LLM 请求有状态。

- 边界：上游立即返回 429（限流）或 529（服务忙），用户还没看到内容，就切第二家；流已开始后中途出错，只把错误抛给用户，由用户重试。
- 他知道已有网关能在流中途换一家 provider 续写，评估过复杂度后暂不做，选择尽早失败、让用户决定。
- 整家 provider 出问题靠熔断：按错误类型设阈值，触发后一段时间内不再给它发请求。阈值没给。

### 3. 同一会话粘在一家，功能取两家交集

> "You can have two sessions calling two different models, but never one session across the two models." ——两个会话可以走两家，一个会话绝不能跨两家。

- 两家之间随便分流，即使是同一个模型，缓存也很容易坏。
- Anthropic 一方 API 有藏在 beta flag 后的功能，比如他说能大量节省 MCP 工具 token 的 tool search，但 AWS Bedrock 当时未必支持。同一个模型 ID 后面挂两家时要对用户隐藏差异，哪家不支持的功能就关掉。省多少 token 没给数字。
- 他引了一句老话"backup always breaks when you need it"，所以平时固定分 10% 的流量或会话给备份 provider，拿到它的真实指标，不用等主路坏了才知道备份行不行。10% 怎么定的没说。

### 4. 跨区域要身份全局、推理本地

需求是权限集中管理、一套凭证全球通用，不让用户按地区管四个 API key。最初所有区域共用一个 Postgres，又因为合规要记录全部提示词和返回，就在开源网关里打开开关把提示词日志存进 Postgres。

> "Our main database is four terabytes large. This is the gateway database." ——网关主库 4TB。

- 后果：跨大西洋传输一度每天超过 200GB，网关主库 4TB，鉴权延迟（网关叠加在用户请求上的开销）到 2 秒，这个数来自幻灯片上的监控图。
- 修法一：立刻关掉数据库里的提示词日志，他说"It's the wrong storage"，改成各区域直接写 S3。
- 修法二：鉴权数据在各区域建本地副本，代价是权限变更、新建 API key 有几秒的传播延迟。鉴权延迟从 2 秒降到 20 毫秒，没说是哪个分位数。
- 计费和限额要按应用统计、超限封顶，但选最终一致：超限几分钟可以接受，只要最终能拦住。
- 他总结为：一个 key 到处可用，推理留在本地，热路径上没有远程依赖。

### 5. 要在 harness、网关、MCP 工具之间做分布式 tracing

他说指标看网关整体健康，日志管合规，缺的是 tracing。所以在所有 harness、网关和 MCP 工具上做了分布式 tracing。

> "But the actual inference time is 17 seconds" ——实际推理只有 17 秒。

- 用户在 Slack 抱怨推理慢。trace 显示推理 17 秒，对照他们的 p95 一分钟并不算慢；慢在一次超过 3 分钟的工具调用。p95 的口径没说。
- 他说没有 trace 很难判断出这一点。

### 6. 放弃协议翻译，自建精简网关

> "we learned that protocol translation is not something that we want because it breaks things." ——协议翻译会弄坏东西，所以不想要。

- 自建前已经把花费计算管线解耦，做了自己的成本控制。最后自建网关，只做他们依赖的精简功能。
- 他说不是人人都该自建，开源做得更好时会毫不犹豫切回去。
- 方向上他们更倾向协议无关的 harness，由 harness 直接说多种协议，而不是在中间翻译。
- 收尾四条：协议翻译难；failover 会破坏缓存；网关请求路径要跨区域隔离；处处开 tracing。

## 存疑

- thinking block 那段，他说返回的是加密签名，又说签名本身就是思考内容加摘要，指代不清，需对照幻灯片或 Anthropic 文档。
- 起步用的开源网关没说名字。
- 0.4% 错误率、2 秒和 20 毫秒都没给统计口径。
