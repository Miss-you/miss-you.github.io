---
title: "Beyond the Pilot: Managing Your 500th AI Agent"
slug: "b03-dify-managing-500th-agent"
date: 2026-11-05T14:20:00+08:00
lang: zh
session: "B03"
speaker: "Andy Wang"
org: "Dify"
stage: "AI 应用分会场"
summary: "企业 agent 到几百上千个以后，难点从怎么造 agent 变成运营、治理和优化；这个规模来得比人们想的快，要提前规划。"
video: ""
source: "external-recording"
draft: false
---

据现场外部录音整理，未与本人录音对照。讲者是 Dify 首席营销官，负责全球 go-to-market；开头用中文交代几句后改用英文演讲，无问答环节。幻灯片内容只能从口述还原，"构建"一节有一段缺失。

## 一句话

企业从试点走到几百上千个 agent 以后，难点不再是"怎么造 agent"，而是运营（变更管理）、治理（审计和护栏，且要覆盖第三方 agent）、优化（成本和准确率）。他认为这个规模来得比人们想的快，所以要提前规划。

## 论断

### 1. 难题在上线之后的规模化

一个 agent 出问题，问开发它的人就行；500 个 agent 时，底层模型一更新、某个知识库一变，没人可问。这个对比他在开头说了一次，讲运营时又说了一次。

> "When you have 500 agents, and one of your knowledge base changes because one of the underlying LLMs you use had an update, who do you even ask? That capability is not a human one." —— 500 个 agent 时，底层某个 LLM 更新导致某个知识库变了，你该问谁？这不是靠人能解决的。

- 他说到上海两天半，见了几家在中国的跨国客户，粗算每家平均 agent 数在 2000 个以上。样本是这两天见的客户，家数没给。
- Dify 自报：GitHub 15 万星，全球约 200 万个 agent 和 workflow 部署，50 多家财富 500 强企业在用。没给口径。
- 发展史：2023 年做 RAG，2024 年给客户造 agent，一年到一年半前靠 agentic workflow 编排出名，现在定位 agent management。
- 他说 Gartner 上周发布了首份 AI agent management platform 魔力象限，Dify 入选，是唯一入选的中国背景厂商、仅有的三家生成式 AI 初创公司之一。

### 2. 四项能力：构建、运营、治理、优化

他用这四项当全场骨架。现在行业谈 agent 几乎只谈构建，另外三项一样重要。

> "When you have 500 agents, do you care that much about the speed that you build your number 501 agent? No, not really." —— 有了 500 个，你还在乎第 501 个造得多快吗？不在乎。

- 他说第 501 个 agent 很可能根本不是新场景。
- 预算五千、一万美元时没人在乎优化；预算大了，他认为优化比另外三项加起来还重要。没给依据。

### 3. 运营的关键是变更管理

规模大了，没人知道哪个 agent 用哪个知识库、跑在哪里、谁负责，开发它的人可能早已离职。

> "There's no owner of a certain agent. … your developer that built it might not even work for you anymore. That's just the brutal truth." —— 没有负责人，开发它的人可能已经不在公司了，这是残酷的现实。

- 案例（客户未点名）：一个业务覆盖 50 个国家的客户，其中一国修改数据隐私法，要求知识库和数据换一种处理方式。几千个 agent 里看不到哪个用了哪个知识库、跑在哪里，客户不知道从哪里着手。他说 Dify 六个月前做了相应功能，具体是什么没说。

### 4. 治理要有审计链和护栏，并覆盖所有 agent

> "We need a system where we are able to at minimum—at minimum—have an audit trail with exactly what the agent was asked, what was sent to the LLM, what was the response back, but even better is you need to put in the guardrails." —— 至少要有审计记录：用户问了什么、发给 LLM 的是什么、返回了什么；更好的是加护栏。

- 案例：美国一家大型县立公共图书馆（未点名）做了一个 7×24 的 AI 图书管理员，按你想读的书、想看的电影做推荐。图书馆自己做了 tracing 和审计检查，发现 90% 按预期运行，10% 是坏搜索、坏结果，其中有"How do you murder somebody?"这类查询。90/10 是客户私下说的，没给统计口径。他设想的风险是：在美国上法庭，要解释为什么 AI 图书管理员给下一个连环杀手推荐了资料。
- Dify 以前把四项能力都围着自家 agent 做，觉得在 Dify 里自建最好；客户让他们接受了这不会发生，企业里总会有别的平台、别的应用自带的 agent。

> "no customer is going to accept a governance strategy that only covers 80% of the risk areas." —— 没有客户会接受只覆盖 80% 风险领域的治理。

### 5. 预算到七八位数美元时，优化变得关键

他说规模化客户开始为这个领域单列七位数到八位数美元的 AI 预算。优化有三个方向：准确率、成本、响应时间。前 10 个、20 个 agent 时，这些没那么重要。

> "So there was Dify, there's Gemini, and then there is labor … both LLM and agent orchestration solutions were able to beat labor. … But then accuracy was completely different."

- 案例：他前一天拜访的客户（未点名）最初把 Dify、Gemini、人工三方并行跑，像三匹马赛跑。成本上两种 AI 方案都低于人工；准确率"完全不同"，但没说谁高谁低、差多少，也没说是什么任务。

### 6. 欧洲用户论坛的三条收获

两周前 Dify 在德国办了第一次欧洲用户论坛，欧洲最大的客户都来了。他们说这些问题在试点阶段一个都没想过。三条收获是：提前规划、兼容性、重做流程。

> "if you just use old flows and add AI to them, it's not going to work." —— 只在旧流程上加 AI 行不通。

- 提前规划：他推算，2000 到 5000 人的公司约 10 个业务部门，每个部门第 1 个月 1 个、第 3 个月 5 个、第 6 个月 10 个 agent，就是 100 个；之后到 200、500 比人们想的快得多。这是假设推算，不是实测。
- 他说快到 2027 年，很多人已经部署失败过一两次，付过代价。
- 重做流程：一家中国的全球消费电子公司（未点名），旧流程收不上来客户反馈，改用 7 个 agent 串起来，收集反馈、翻译、分发到各团队、重排优先级。他只列了这几种角色。

## 存疑

- "构建"一节说到第 501 个 agent 很可能不是新场景后，录音直接跳到下一部分，后面的内容缺失；四项能力的讲解顺序可能也被打乱，需对照幻灯片。
- 数字都是讲者口述，没给出处：GitHub 15 万星、约 200 万个 agent 和 workflow、50 多家财富 500 强、每家客户 2000 个以上 agent、七八位数美元预算、90/10。
- Gartner 魔力象限的发布时间和 Dify 的定位描述需核对报告原文。
- 他说"Dify today operates more like an SOP"，原意大概是为 agent 提供标准作业流程，措辞可能有误。
