---
title: "Trusted Context: Building the Layer Between Enterprise Data and AI Agents"
slug: "b08-datahub-trusted-context"
date: 2026-11-05T15:40:00+08:00
lang: zh
session: "B08"
speaker: "Alyssa Lee"
org: "DataHub"
stage: "AI 应用分会场"
summary: "企业里 agent 答错多半是缺上下文而非模型不行，所以要在企业数据和 agent 之间建一层上下文层：采集、生成、专家验证，再带着可信度分发给 agent。"
video: ""
source: "external-recording"
draft: false
---

据现场外部录音整理，未与本人录音对照。讲者是 DataHub 的 chief of staff，兼开源社区负责人，英文演讲，无问答环节。议程排在 15:40，实际是分会场当天最后一场；幻灯片未见，数字和客户名按口述记。

## 一句话

企业里 agent 答错，多数是缺上下文而不是模型不行，所以企业数据和 agent 之间要有一层上下文层，把散落各处的业务定义采集、生成、交给专家验证后，带着可信度分发给 agent。业务定义要企业自己掌握、存成不绑定厂商的格式，底层设施则该买现成的。

## 论断

### 1. 老问题没变，犯错的主体从人换成了 agent

以前是人对着没完全搞懂的数据跑草率的查询，现在换成 agent，规模大得多，也自信得多。区别在于人会复核，agent 不会。

> "People double check a weird number before it goes into a deck. Agents don't."——人看到怪数字会先复核再放进 PPT，agent 不会。

- 她引了 VentureBeat 的一项调查：57% 的企业把 agent 的错误回答追溯到缺上下文，31% 说会反复出现，只有 17% 认为 AI 结果一贯可靠。没给样本量和时间。
- 她还引了 Gartner 今年春天的研究，说稳健的上下文层是 AI 成功的基础，没给报告名。
- 她据此认为这不是模型问题，而是上下文问题；调查本身只说追溯到缺上下文。

### 2. 上下文层是"生成、验证、激活"的循环

上下文从数仓、BI、非结构化文档、Slack、Google Docs 以及元数据图本身采集；机器从查询日志、BI 仪表板、文档里持续自动提炼语义，生成候选定义；领域专家在一个专门的工作区里验证和补充；最后分发给 agent。

> "So the loop is generate validate and activate. Every piece that comes out of that carries a trust grade."——循环是生成、验证、激活，产出的每一条都带可信度等级。

- 生命周期四段：ingest、understand、validate、activate。
- 分发渠道：MCP、skills、API SDK、个性化 UX。
- 她说这个产品刚结束 3 个月的私测和公测，进入 GA，和 30 多家客户一起做。

### 3. 没有业务定义，agent 会自己挑一个"听起来合理"的阈值

演示里，信贷员问 Snowflake Cortex agent "高风险商业地产贷款有多少"。没有上下文时，agent 选了 80% 的贷款价值比（LTV）阈值，算出只有 900 万美元。接入 DataHub 上下文后，它检索到术语表里的正式定义，阈值其实是 76%，对应 6 笔、共 3300 万美元。

> "This was confidently stated and completely wrong."——说得很肯定，完全错了。

- 比较对象是同一个 agent 有无 DataHub 上下文；她没说这是真实客户数据还是演示数据。

### 4. 生产环境的客户数字

- Miro：接入 DataHub 上下文后，agent 准确率从约 50% 提到 90%。没说测评集、题量和判对方式。
- Pinterest：分析 agent 的用量是内部第二常用 agent 的 10 倍，比的是用量不是准确率。
- 拿到可信答案只要几分钟而不是几小时，人工文档工作少了约 70%。这句紧跟 Pinterest 之后，没说清是不是 Pinterest 的数字。
- Block：agent 通过 MCP 即时回答元数据问题，没给数字。
- 一家没点名的"全球前三"银行在用 DataHub 做对话式 text-to-SQL 手机银行 agent。

> "at a Miro... agent accuracy actually went from roughly 50% to 90% once grounded in DataHub context."

### 5. 业务定义自己持有，底层设施外采

她说每个大数据平台都在做自己的上下文平台，点名了 AWS、Snowflake Cortex / Horizon、Databricks Unity / Genie、Microsoft Fabric / IQ、Google 的 knowledge catalog。她反问企业的数据有没有哪天全在一个系统里，自答不会，所以定义要存成厂商中立的格式。

> "Nobody else should own what high-risk means at your own company."——你公司里"高风险"是什么意思，不该由别人掌握。

底层的上下文基础设施她建议买，理由是自己拼凑的团队过几个季度就会变动，上下文却要留下来。

> "Buy the context infrastructure underneath it because teams that cobble that together themselves tend to move in a couple of quarters, and the context doesn't."

### 6. DataHub 像数据世界的 Google Maps

她的类比是：数据资产像分布在 Snowflake、Databricks、Oracle 和非结构化数据里的城市街道，Google Maps 的路况告诉人走哪条路、避开哪条路，DataHub 提供的可信度信号让 agent 在分散的数据环境里找到该用的数据集。

- 她的愿景是数据工程师和分析师的工作很快能由自主 agent 完成。
- 结尾介绍 DataHub 是最大的开源上下文管理和元数据管理项目，Slack 社区超过 1.6 万活跃成员。

## 存疑

- 可信度等级怎么计算，她没讲。
- 客户名 Miro 按口述记录，未核对。
- "几分钟而不是几小时"和"少约 70% 人工文档工作"归属哪个客户，需对照幻灯片。
- "teams … tend to move in a couple of quarters" 里的 move 指团队成员换岗离职，还是团队转向别的工作，口述不明。
- 贷款演示的原句语法较乱，80%、76%、900 万、6 笔、3300 万这几个数字需对照幻灯片。
