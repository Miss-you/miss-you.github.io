---
title: "Post-Training at the Frontier: Teaching Open Models to Search and Browse the Web"
slug: "s03-youcom-post-training-search"
date: 2026-11-05T10:50:00+08:00
lang: zh
session: "S03"
speaker: "David Li、Alex Triplett"
org: "You.com"
stage: "主舞台"
summary: "用中等热度网页自动出题、按难度筛过的小规模 RL 数据集，就让一个开源 30B 模型在 BrowseComp 上明显变强，效率也作为副产品变好。"
video: ""
source: "user-recording"
draft: false
---

据作者现场录音整理，按讲者脉络转述，不是逐字稿。其中开场和 Alex Triplett（COO）的公司介绍部分据现场外部录音补全，未与本人录音对照。两人之间有一位 You.com 亚太业务负责人用中文做了约 2 分钟商务介绍，这里不记。后半场由 David Li 中英混讲后训练案例，无问答环节。

## 一句话

用中等热度网页自动生成的小规模、按难度筛过的 RL 数据集（约 5000 条 SFT 轨迹加 1500 个 RL 任务，8 小时 RL），就能让一个开源 30B 模型在 BrowseComp 上明显变强，效率也作为副产品一起变好。David 认为后训练里数据集比工具和环境更重要。

## 论断

### 1. agent 需要专门给机器用的搜索引擎

Alex 开场请观众用手蒙住眼睛，说这就是 LLM 或 agent 连不上网时的处境：知识停在训练数据截止那天。他说人用百度、Google、微软搜索，agent 不是这么搜的，它们更快、吃进的信息多得多，需要另一种搜索引擎，You.com 做的就是专门给 LLM 和 agent 的搜索索引。

> "They need a whole different search engine." —— 需要另一种搜索引擎。

- 没说给机器的索引和给人的索引具体差在哪，结果格式、延迟、返回量都没展开。

### 2. 机器搜索网页已经多过人

他说创始人 Richard Socher 大约 15 年前就判断，最终访问信息、搜索网页的机器会多过人。

> "And in the last year, that's happened. More AI agents search the web than humans. And many of them use us to do it." —— 过去一年这件事已经发生了，搜索网页的 AI agent 多过人，其中很多用的是我们。

- 没给口径（按查询量、请求数还是主体数）和来源。

### 3. 产品按编排深度分层

- 搜索 API：接到 MCP 或 API 上，agent 就能访问整个网络。
- contents API：抓取整页内容。
- answers 和 research API：长时间、多路发散搜索，再用 harness 汇总。他说不同 API 对应不同的编排程度。
- 授权的结构化数据：网上找不到的信息，比如世界银行、标普、Polymarket。

### 4. 主攻企业和模型实验室

他说 You.com 每月处理数十亿次查询，重点做企业，因为企业量最大、需求最大、查询最复杂。企业常要求零数据留存（不记查询、不拿数据训练）和实时 SLA。对模型实验室，他们提供预训练数据、后训练数据和推理时的搜索。

> "We are their search lab. They are the model lab." —— 我们是他们的搜索实验室，他们是模型实验室。

- 每月查询量和投资方名单（NVIDIA、Salesforce 等）都是公司自述，没给具体数。合作的前沿模型和开源模型也没点名。

### 5. 后训练里 RL 数据集比框架和环境更重要

David 讲的案例是和 NVIDIA、CoreWeave 合作，对 NVIDIA 的一个开源 30B 模型做后训练，NVIDIA 做 SFT，RL 在 NeMo（疑为此词）和 CoreWeave 上跑。选开源模型是因为它 token 效率高，在数据中心里推理效率高。他两次说 RL 数据集是最重要的部分。理由是预训练语料已经差不多覆盖了互联网上的 token，必须找答案不在模型权重里的复杂问题，模型才会去学怎么用搜索工具，而不是直接从权重里拿答案。

> "最重要的其实就是你这个 RL 的 data set，这个 RL data set 其实是你你做这些后训的时候是比那个 tooling 或者 environment 更重要"

### 6. 基座模型做网页研究的三种失败

针对稍小、不是特别强的模型，他把失败分成三种：一遍遍搜却找不到对的信息（death loop）；不会用搜索和浏览工具；有时查到了对的答案，自己却不知道，继续搜下去、用更多 token。

- 基线：base model 在 BrowseComp（大概 1200 多个问题）上约 37 分，平均每题 168 次 tool call，用 300 万到 500 万 token。

### 7. 题源选中等热度网页

You.com 自有覆盖 "hundreds of billions of web pages" 的 web graph，有链接和反向链接，可以算类似 PageRank 的分数。太热门的网站（比如 Google 首页、一堆网站都放的 SOC 2 logo 链接）信息已经在模型权重里；太冷门的很多是长尾或垃圾。所以他们只取中间热度的网站。

> "所以我们其实就是看哪些网站其实是稍微不是特别 popular 的网站，就是 medium popularity 的网站"

- 取了差不多几千个网站，用模型从页面内容生成问答对，再混入自有数据和开源数据集的子集。

### 8. 按 pass@8 筛难度

流程是生成问题，去污染（去掉含 benchmark 答案的题），用 base model 每题跑 8 次算通过率。8 次全对的题没用，0 次全对说明模型能力不够，也丢掉，只留 1 到 7 次答对的做 RL 数据集。收尾时他又强调一次，说这对 GRPO 和 RLVR 很重要。

> "留下来的问题就是说， pass between one and seven"

### 9. 小数据、短训练拿到相当的提升

> "我们一共是有，差不多 5000 个 SFT trace，是 1500 个 RL task，一共只要花 8 个小时来做RL"

- 后训练后 BrowseComp 约 45.45 分，比同一个 base model 提升约 8.5 分，他说是 22% 的相对提升。
- 训练全是 RLVR（可验证奖励），题目由 web graph 和搜索 API 自动生成，不需要人工标注或 RLHF。
- 和其他开源数据集比，他只说对方数据集大几倍，提升差不多，没给具体分数，也没说是不是同一个基座。
- 8 小时没说用了多少卡。

### 10. 只奖励答对，效率也顺带变高

他说没有为效率给奖励，但模型更会用环境里的工具、更会解这类题，效率作为副作用提高了。他把原因归于模型第一次拿到答案后会做验证，知道自己找对了就停。

> "It actually becomes more efficient as a side effect." —— 效率作为副作用提高了。

- 例子是 BrowseComp 一道多跳题：某公司在 2013–2023 年间被收购，收购时 CEO 毕业于某所加州大学，最后问他开的是哪种车（题面细节没听清）。
- 后训练前：313 次工具调用，其中 150 次搜索、118 次网页抓取，用了 130 万 token，答案仍然错。
- 后训练后：7 次工具调用，3 次搜索、1 次网页抓取，只用了 7 万多 token。
- 这是单题案例，没给全量平均的效率变化。

### 收尾：通用流程

先有强工具（这里是强搜索）；用有代表性的数据出题并按难度过滤；在自己的轨迹上做拒绝采样 SFT，再做 GRPO；最后同时测准确率和效率，评分可用二元或多步 rubric。他说讲到这里只剩四十几秒，"这可能是最重要的"。

## 存疑

- 30B 模型的具体型号没听清，疑为 NVIDIA Nemotron 系列，需查幻灯片或 NVIDIA 公开发布。
- 开源数据集名按读音推测为 OpenSeeker、WebSailor、ASearcher，未确认。
- 相对提升他说 22%，按 37 到 45.45 算约 23%。另有一句说 8.5 分里 SFT 约 3 分、RL 约 5.5 分，未核实。
- 基线每题平均 168 次 tool call、300 万到 500 万 token，数量级偏大，需对照幻灯片。
- David 的职位有三种说法：议程写 Member of Technical Staff，亚太负责人介绍时说 founding engineer，他自述负责全球和亚洲的 field engineering。
