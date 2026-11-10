---
title: "Optimizing Organization-Wide LLM Inference Cost: Seat License, Pay-per-Token, or Provisioned, and Beyond"
slug: "s15-techcombank-inference-cost"
date: 2026-11-05T17:10:00+08:00
lang: zh
session: "S15"
speaker: "Do Tuan Anh"
org: "Techcombank"
stage: "主舞台"
summary: "按「每百万 token 有效成本」算出月用量临界点（他们的例子约 830 亿 token），超过就从按 token 付费转自租 GPU 部署，预计省 30–50%，但要留按 token 付费兜底。"
video: ""
source: "user-recording"
draft: false
---

据作者现场录音整理，按讲者脉络转述，不是逐字稿。讲者是 Techcombank（越南科技商业银行）Data & AI Engineering 高级经理，负责行内的数据和 AI 平台，英文演讲，约 12 分钟，无问答环节。介绍几种付费方式全景的那部分没有录清，细节缺失。

## 一句话

一个组织的 LLM 账单可以按"每百万 token 有效成本"算出一个月用量临界点，他们的例子是约 830 亿 token/月；超过它就该从按 token 付费转成自租 GPU 部署，他认为能省 30–50%，但要保留按 token 付费做兜底。

## 论断

### 1. 规模化之后只盯一个指标

他说缓存命中率、输入输出比也是好指标，但他们花最多精力压的是全组织输入加输出的有效混合单价（每百万 token）。这个成本时不时会大幅上涨，因为大家总想用最好的模型。

> "from time to time, it's actually going up quite exponentially because usually later we tend to want to use the best model out there, such as Opus." ——这个成本时不时会大幅上涨，因为大家后来总想用最好的模型，比如 Opus。

- 他说现在不怎么用 Sonnet 或 Haiku 了。
- adoption 分三阶段：pilot、adoption、scale，到 scale 阶段 token 消耗和 AI 总拥有成本一起涨。涨了多少没给数。

### 2. 切换到自建部署有一个可计算的临界点

月 token 临界量 = 部署月成本 ÷ 按 token 付费的每百万 token 有效单价。他把这个点叫 efficiency point。

> "So the efficiency point is around 83 billion." ——效率点大约是 830 亿。

- 按 token 付费一侧：有效混合单价约 2 美元/百万 token，拆开是输入约 1 美元、输出约 5 美元。没说是哪家、哪个模型的报价。
- 输入输出比：通用场景约 4:1；工具调用和评测这类重场景 10:1 到 50:1。
- 部署一侧：2 个节点 × 8 张 B200，共 16 张，约 16.6 万美元/月。
- 16.6 万美元 ÷ 2 美元/百万 token，约 830 亿 token/月。月消耗超过这个量就该考虑切换；低于它是亏的，GPU 吃不满，整机的钱照付。
- 他说这是"the whole presentation in just one slide"，收尾回顾里排第一。

### 3. 付费方式是一条阶梯

先从按席位或额度的套餐换到按 token 付费，用量过了临界点再换到自建部署。

> "it's quite a no brainer for you to switch from credit base to pay-per-token, right?" ——从额度制换到按 token 付费几乎不用想。

- 他说他们多数人用的是 200 美元的额度套餐，根本不够，一超额费用就很高，直接按 token 付费划算得多。超额费用没给具体数。

### 4. 过了临界点能省 30–50%

> "we expected and we strongly believe that 30 to 50% cost efficiency is quite achievable" ——我们认为省 30–50% 很可能做到。

- 比较对象是同等用量下按 token 付费的账单。他举的例子是月 3000 亿 token，按 token 付费要 50 万美元，自建部署 20 万，省 58%。
- GPU 从 AWS EC2、Azure 这类云厂商租，多年节省计划和企业谈判折扣能让降幅超过 50%。
- 维护自动扩缩容的运维成本也要算进去。

### 5. 自建后要保留按 token 付费做兜底

他列了切换前要考虑的三个问题：GPU 稀缺（这半句没录清，按上下文推测），他说是现在最大的障碍；保留兜底；数字受企业谈判影响很大。

> "so, we best to keep the pay-per-token as a fallback, rather than removing it completely." ——最好保留按 token 付费当兜底，不要整个砍掉。

- 他们做了自动扩缩容，见过要从 5 扩到 15 的情况（单位没听清）。
- 在 AI 网关里把自建部署的 GLM 设为主模型，按 token 付费的 GLM 设为兜底。试运行时大约 10% 的时间走的是兜底那一路，用户感觉不到差别。
- 他还提到部署模型受并发单元（CCU）限制。

### 6. 按语义和语言路由也能省 40–50%

换付费方式不是唯一的省法。他们在用语义路由和语言路由，他提到他们一篇关于"localization tax"（本地化税）的新研究，结论是这两种路由也能省 40–50%。

> "some model is not as efficient in Japanese and Chinese as the other model." ——有的模型处理日文、中文不如别的模型高效。

- 40–50% 没给比较基线，这部分放在最后，没有展开。

## 存疑

- 3000 亿 token、50 万对 20 万、省 58% 这组数彼此对不上（50 万到 20 万是省 60%；按 2 美元/百万算，3000 亿约 60 万美元），需对照幻灯片。
- 他提到的 GPU 价格"每小时约 140 美元"，没听清是单卡、单节点还是两个节点。
- 他还举了一个"不该切"的例子，月用量数字没听准（疑为 670 亿）。
- 他推荐的单节点 8 张 B200 部署配置里跑的是哪个模型，没听清。
- 额度套餐那句提到的工具名没听清，可能是 Cursor 或 Claude Code 的 200 美元套餐。
- "localization tax"那篇论文的标题和发表处不清。
- 兜底约 10% 是按时间还是按请求算，需回放确认。
