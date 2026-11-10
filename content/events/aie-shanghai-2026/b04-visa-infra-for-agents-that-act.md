---
title: "Beyond Reasoning: Building Infrastructure for AI Agents That Act"
slug: "b04-visa-infra-for-agents-that-act"
date: 2026-11-05T14:40:00+08:00
lang: zh
session: "B04"
speaker: "Robert Pei"
org: "Visa"
stage: "AI 应用分会场"
summary: "agent 开始替人花钱，现有支付体系处处不适配；Visa 的做法是发限范围限时效的 token、按用户授权放行、用 Trusted Agent Protocol 让认证过的 agent 与商户握手。"
video: ""
source: "external-recording"
draft: false
---

据现场外部录音整理，未与本人录音对照。讲者是 Visa 大中华区产品负责人，中文演讲，夹英文术语，无问答环节。幻灯片内容只能从口述还原，其中一页案例他跳过没讲。

## 一句话

agent 开始替人花钱，现有支付体系里有三样东西不适配：网站把 agent 当 bot 挡在门外，风控把机器的交易当盗刷，卡号不能直接交给 agent。Visa 的做法是给 agent 发带范围和时效的 token，按用户授权放行，用 Trusted Agent Protocol 让认证过的 agent 和商户握手，并给商户的"agent 友好度"打分。

## 论断

### 1. Agent 支付已经走到真正下单

他说 Visa 大概在 2025 年 5 月提出了 Visa Intelligent Commerce 的概念。Amazon 的购物 agent Buy for Me 原来只在站内搜索和下单，今年早些时候和 Visa 合作后，可以到 Amazon 以外的商户，用存在 Amazon 的卡付款，这就是 open loop 支付。

> "你的卡……是存在Amazon的，并没有存在那个商户那边。那么这个Agent就需要用这个，这张卡呢，去帮他做这个支付。"

- 开场例子：Musk 转发的视频里，用 Grokbot 全网搜一双球鞋，找到后直接付款。他说底下"可能"用的是 Visa 的 credential，没有确认。
- 他顺带提到 Grokbot 好像被 Amazon block 了。

### 2. 网站是给人设计的，行业在补协议

今天的互联网不是为 agent 打造的，agent 有时只能模仿用户点击去操作。Google 的 UCP、Stripe、Shopify、Visa 都在出协议，覆盖发现、下单 checkout、支付三段。

> "现在我们可能还是在L3的水平，就是有点像这个Tesla的这个supervised的这个……自动驾驶。那么这个很多时候需要human in the loop去确认以后才能支付"

- 他说商业模式也在变：以前从搜索跳到商品页再下单，现在 agent 有自己的计算逻辑和知识体系，衍生出"optimize for agent"。这部分没展开。

### 3. 刚需场景是开发者让 agent 通宵干活

工程师睡前让 agent 做一个 app，agent 会碰到各种 paywall：有版权的图片、域名、数字服务。用户不在乎在哪买，只要事情办成，单笔可能几分钱或几块钱，不能每次叫醒人确认。

> "这里面你的这个决策并不是一个基于商品的决策，而是一个基于任务的决策……你会给它一个……budget，但是这个budget具体怎么用，甚至可能是由agent决定的"

- 总预算 20 美元、单笔几分钱几块钱，是他举的假设数字。
- 支付通道上，Visa 做了基于卡的链路，另有 stablecoin、区块链等其他通道。
- 他承认这是一个小众场景，是 Visa 的实验场，但核心是人开始把跟钱有关的决定交给 agent，"This is a big deal"。
- 买超靠限额防住，买错和纠纷是网络要解决的问题。

### 4. 代人花钱带来三类问题

三类问题是：agent 身份与信任、意图与授权、生态成熟度。公司建的 agent 出了事有平台担责，像 robotaxi；个人自己装 harness 的 agent 拿着卡出去买错东西、甚至做了恶意行为，卡组、银行和商户怎么杜绝，是难点。他提到 OpenClaw 作为个人 agent 的例子。

> "我们的意图会越来越模糊，因为人会越来越懒，因为agent会越来越强大。"

- 生态方面，他问商户会不会被拖垮：来的都是机器人，买了就走，传统的会员忠诚度和积分怎么办。

### 5. 现有基础设施在三处挡住 agent

他沿用"工程师睡前派活"的例子，逐个检查每笔交易会碰到的问题。

- 网站：Cloudflare 这类检测先问你是不是 bot，agent 诚实地说是，连页面都拿不到。他认为基础设施层要有一个通道，让白名单里或认证过的 agent 能进网站。
- 风控：深夜银行突然收到很多笔一分钱、两分钱的交易，传统信用卡风控会判成被盗，实际是工程师去睡觉了。要先分清交易是人还是机器发生的，人和机器的作息、行为模式、上下文、执行速度都不同，很多风控规则要改。
- 消费者教育：用户不知道该给 agent 授权什么。这一项只说了一句。

> "你比如大半夜突然我们的银行收到好好好多笔一分钱、两分钱的这种交易的时候，在我们传统的信用卡的这个风控模型里面，这肯定是被盗了"

他没说 Visa 的风控具体改了什么。

### 6. Visa 的做法：token、授权、握手、打分

> "我今天是不可能直接给agent发一张卡的，因为agent它不是一个实体，它背后挂的还是一个人"

- 凭证：不给卡号，给 tokenize 过的、有范围的 token，可以设成今晚失效、设上限。
- 授权：token 消费时要匹配用户的意图和授权。现阶段每笔交易都要用户确认；之后在小额场景，比如"今晚最高 20 块钱"，用户确认一次也算明确授权。
- 握手：Trusted Agent Protocol 先对 agent 做认证，商户要有通道和 agent 握手。他说不是任何 agent 在任何商户都有同样的信任等级。
- 打分：Visa 在旧金山有个合作伙伴（未具名）给商户打分，他类比当年的 PageRank：PageRank 排相关性，这个分排的是 agent 来你这下单容不容易，分低 agent 可能就不来了。
- 其他：有面向开发者的 CLI 产品，帮开发者用 Visa 卡交易；在研发 micro payment 方案，因为传统卡交易做小额不划算，没给费率和时间表。
- 收尾三点：凭证要控制；现阶段用户控制权是核心，要让用户知情，交易链路要留痕；欢迎做安全和商户 enablement 的公司共建。

## 存疑

- 他举了几个 agent 产品作例子，有的名字没听清（有一个听起来像 Muse，疑为 Manus），未核实。
- Visa Intelligent Commerce 提出于 2025 年 5 月（他说"大概"）、Amazon 合作在"今年早些时候"，是讲者口述，未核原始来源。
