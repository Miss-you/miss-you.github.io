---
title: "Your Data Agent Needs More Than a Knowledge Graph: From Semantic Layers to Executable Ontologies with Apache Ossie"
slug: "b10-datusai-executable-ontologies"
date: 2026-11-05T16:15:00+08:00
lang: zh
session: "B10"
speaker: "Harrison Zhao"
org: "DatusAI"
stage: "AI 应用分会场"
summary: "数据 agent 的瓶颈是数字和决策能不能信；知识图谱只说明事物是什么，要算对数，得在语义层上加本体，并用引擎把规范编译成确定性 SQL、拒绝错误查询。"
video: ""
source: "external-recording"
draft: false
---

据现场外部录音整理，未与本人录音对照。讲者是 DatusAI 联合创始人兼工程师，做开源数据 agent 和语义层一年半多，英文演讲，无问答环节；幻灯片未见，图示内容只能从口述还原，他自己也说演示图有点难看清。

## 一句话

数据 agent 的瓶颈不是写 SQL，而是数字能不能信、决策能不能信。知识图谱只说明"事物是什么"，要让数字算对，得在现有语义层上加一层本体，并配一个把语义层规范编译成确定性 SQL、能拒绝错误查询的引擎。在他看来，本体因此是可执行的确定性框架，而不是又一份塞进 prompt 的上下文。

## 论断

### 1. 问题不在大模型，在我们自己

他开场拿 AI 解数学难题作对照：AI 都能解很难的题了，我们凭什么相信数据 agent 生成的数字？第一次问 Q3 营收给一个数，稍微改点上下文就给另一个数。

> "But that's not the problem of the larger model. It's our problem, right?"——这不是大模型的问题，是我们的问题。

他把数据 agent 的发展分三段：

- 写 SQL：经过预训练和后训练，大模型在 text-to-SQL benchmark 上已经相当好。没给具体 benchmark 和分数。
- 让数字可信：这是定义问题，公司里的"收入"到底指什么、怎么算才对。
- 让 agent 做决策：不满足于回答问题，要推动 AI native organization。他说这正是本体要解决的。

### 2. 本体不是新概念，也不等于知识图谱

本体 20 年前就有了，建在 OWL、RDF/RDFS 之上，再加规则推理。他认为手工推理器已经不重要，比如"Alice 是 Bob 的家长，所以 Bob 是 Alice 的孩子"这种推理大模型自己就能做；但关系和概念对数据 agent 仍然有用。

- 他展示了 Palantir 和 Apache Ossie 网站上的航班、机场、航线示例图，说这种图放进图数据库或直接塞进 prompt 帮助很大。
- 但碰到底层数据就不够：一趟航班 120 名乘客，再 join 一张延误航班表，可能被算成两三倍，变成 330，因为它不了解关系库的细节。这是讲解用的例子，他说真实场景更复杂，大模型常在多表 join 和复杂关系上出错。

> "we need a deterministic engine. Underneath the knowledge graph to make sure the number that can calculate correctly."

- 动作这一层，他说把 API 暴露成 MCP 工具、接进 agent 循环很容易，难的是这个决策能不能信。他描述的信任链是：原始数据、指标、分析、业务规则、绑定动作，动作可以是告警，也可以是真的 CRM 操作。

### 3. 本体建在现有语义层上，Apache Ossie 统一规范

他说自己在大数据领域工作多年，每家公司的数据建设都建在维度模型上，也就是语义层。所以本体不用像 Palantir 那样从零建，它只是现有语义层上面的一层，也可以基于已有的 SQL 和上下文先生成语义层。

> "ontology is just a top layer. On top of existing semantic layer"

- 过去两年 Snowflake、Databricks、dbt 等都推出了语义层方案，但各家规范不互通，BI 工具和 agent 没法共享。这是 Apache Ossie 的由来。
- 他说 2025 年 9 月 Snowflake、Salesforce、dbt 发起这个项目，原名 Open Semantic Interchange，就是文件系统里的纯 YAML 文件，今年捐给了 Apache 基金会。
- Ossie 分四层：SQL 层，统一各数据库方言的表达式；BI 接口层，供 Tableau、Superset 等直接访问；指标层，他说最重要，agent 通过宽表查询接口拿指标，不用自己想怎么 join；本体层，放实体关系和知识图谱相关内容。

> "Most of the data agent just access this metrics using a wide table query interface because it can reduce the complexity of the data agent to, to figure out how to join many table together."

### 4. Ossie 只是规范，所以他们写了编译器

他的类比是：大模型今年能解数学和代码题，是因为强化学习有验证器可学，数学里有 Lean，代码里有 GCC、rustc 这类编译器。Ossie 只是规范，没有编译器。

> "because Apache Ossie is just a spec, not a compiler engine. So we build one."

- 他们用 Rust 写了一个语义运行时，只做一件事：把 Ossie 的 YAML 规范翻译成各方言的确定性 SQL。他说支持 20 多种方言，比之前的方案快 10 到 100 倍，没给测试条件和数据量。
- 他说最重要的是能为已建好的语义层生成确定性查询，并拒绝 fan-out 和错误聚合这类查询。
- 他们还在做原生归因，让 agent 能快速回答"数据为什么变了"。

### 5. 本体在语义层之上只加三样：映射、规则、关系

他说本体更像一个框架，不靠向量搜索去找该用哪张表、哪个指标，而是用一张按业务形状画的地图给检索建索引。

> "It's just using a business shaped, uh, map to, uh, accelerate or, uh, index the whole, uh, retrieval."

- 映射：同一术语在不同业务里叫法不同。销售、财务、供应链各有语义模型，用一张本体映射把它们连起来跨域使用。
- 规则：业务上 status 可能只有 open 和 resolved 两种，库里却有 5 到 10 种取值。给它设值域，引擎就能拒绝错误答案或错误的函数调用。
- 关系：不止 join，还可以是线性回归这类指标间的关系。只提了一句，没展开。

### 6. 数据 agent 的产出是决策回路

示例设定是电商，北极星指标是复购率，已有订单、营收、客户、营销、退货率等指标，组织成指标树。问题是怎么提高复购率，比如设计新促销政策。agent 用本体选出人群分层，例如至少 5 单、消费至少 1000 美元、营销贡献至少 500 美元、退货率低于 20% 的客户。这是示例规则，没给上线效果。

> "It's not just another better SQL or better dashboard. It's, uh, become a better decision based on, uh, trusted metrics"

回路是：从北极星指标出发，agent 探索数据和可能的规则，人工验证规则后上线。

收尾时他给三层各一句分工：知识图谱告诉 agent 事物是什么，语义层告诉它数怎么算，本体是语义层的地图，让 agent 了解你的业务。

## 存疑

- 开场提到 OpenAI 上个月初发布了一批 AI 数学相关论文、解了 Navier-Stokes 问题和指数时间假设等，论文数量前后说法不一致，出处未给。
- 他们的语义运行时产品名没听清，需对照幻灯片或官网。
- 性能对比的对象没听清，疑为 dbt MetricFlow 和 Cube。
- Ossie 的发起时间和发起方按讲者口述记录。
- Ossie 四层名称和本体三组件按口述还原，需对照幻灯片。
