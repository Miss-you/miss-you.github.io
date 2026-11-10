---
title: "Communication Among Sovereign Agents: The Foundation of Agent Economy"
slug: "s29-masons-sovereign-agents"
date: 2026-11-06T15:05:00+08:00
lang: zh
session: "S29"
speaker: "Mingke Luo"
org: "masons.ai"
stage: "主舞台"
summary: "agent 的关键在行动，行动要改别人的环境；品牌不愿被降格成 API，所以 agent 经济需要一层让保有主权的 agent 互相通信、交换意图的基础层。"
video: ""
source: "user-recording"
draft: false
---

据作者现场录音整理，按讲者脉络转述，不是逐字稿。讲者是 masons.ai 创始人兼 CEO，自述一半时间在旧金山、一半在上海，做了八年企业 agent。英文演讲，无问答环节；现场录音质量较差，个别段落听不清，幻灯片内容只能从口述推断。

## 一句话

他认为 agent 和聊天机器人的区别在于行动，而行动要改的是别人的环境。十年前卡住他的履约问题今天还在，因为品牌不愿被降格成 API；所以 agent 经济需要一层让各自保有主权的 agent 互相通信、交换意图的基础层，而不是一个中心化的超级 agent 把意图分派给各家。

## 论断

### 1. 十年前做 agent 卡在履约

他 2016 年就在做 agent，场景是订餐厅、买机票。当时要解决三个问题：多轮上下文对话、理解口语表达（含否定）、领域逻辑。他说前两个今天已被 LLM 解决，但到真去订餐厅时没有 API 可调，只好雇了 20 个人当"人肉 API"：前端是 AI 接收需求，后端是人去对接餐厅和航空公司，完全不可扩展。他当时追问由谁来完成任务：自己去和所有商家谈 BD 拿接口，还是交给一个已经接入所有服务商接口的中国平台。他想要的是技术方案，于是停掉了。

> "but for us, we think the third problem which stopped my startup 10 years ago, still remains. That is a problem of fulfillment."

——但我们认为，十年前让我的创业停下来的第三个问题今天还在，那就是履约问题。

### 2. agent 的定义是行动

他向投资人解释"这不是聊天机器人"时用的是这套区分：目标加操作等于行动，目标是期望状态，行动是把当前状态转到期望状态。能有效行动，意味着 agent 能改变环境的状态；而你只能在别人允许的地方改别人的环境，他认为缺的正是这一层。他提到亚马逊最近封禁了某个对象作为例子。

> "There's a goal plus operation equals actions."

——目标加操作等于行动。

### 3. 企业里的 agent 问题也是环境问题

2017 年他给 Visa 做了第一个 AI concierge：Visa 有现成的 API，他们只补语言理解这一层，本质是自然语言到 API。后来做企业 agent 时遇到另一个问题：同一个组织里不同部门用不同供应商、不同框架或 harness 做 agent，彼此不通。

- BMW 的销售、金融服务、售后维修是不同部门，客户提一个"查一下我这辆车的贷款合同"这样的跨部门请求就办不成。
- 他说 2019 年他们解决了组织内不同部门 agent 互相通信的问题，但那是企业愿景，来得太早：当时训练一个 agent 只有跨国公司负担得起，agent 不会多。

### 4. 品牌不愿被降格成 API

大模型公司设想的变现路径是一个超级 agent 接住用户意图，再分派给各家系统。他说这不新鲜，十年前的数字助手时代就这样做过，结果没多少品牌愿意加入，因为它们想保住和客户之间的直接沟通。他把这叫主权，主权的问题在于制造隔离。

> "They don't want to be reduced into API. They want to still hold the direct communication between their service and their customers."

——它们不想被降格成一个 API，想保住和客户之间的直接沟通。

- 他说未来可能有两种：一种是竞争性的中心化，中心化本身没问题，只要能给所有参与方一个公平的局；另一种是去中心化，那就得找到让隔离的部分连起来的办法。他用人类文明靠语言沟通、建市场交换来类比。

### 5. 个人 agent 的委托代理问题

需求侧的问题是：个人 agent 到底替你还是替平台的利益说话，怎么保证它的推荐不是为了从服务商那里拿佣金。他认为主权 agent 可以成为保证个人身份和个人主权的基础层。供给侧的问题是：服务方是让别人或别人的 agent 直接碰自己的后端，还是自己设一个接口让客户和他们的 agent 通过它交互；他认为这个接口不久后会以 agent 的形式出现。

> "rather it could take the commission from the service providers like what Ad Exchange has been doing for years."

——它可能会从服务商那里拿佣金，就像广告交易平台这些年做的那样。

### 6. 下一层是 agent 之间的交换市场

他引用"网络就是计算机"这个说法：你不需要拥有一切，可以通过网络访问别人设备上的内容。他认为会出现一整层新应用，各种交易所和市场，只是用户换成了 agent。

- 大组织：设一个治理层，各团队可以继续用不同的模型、不同的 harness，员工可以用不同的 coding agent，只要能拿到权限和访问，同时保住各自的主权。
- 小组织：用他所说的"意图交换"，把自己履约不了的意图，以 agent 对 agent 的方式广播给已经合作的 B2B 伙伴，采购寻源是一个场景。

> "And this is not something in the far future. This is today."

——这不是遥远的未来，是今天。

- 他没有给 demo 画面、用户数或交易量。

## 存疑

- 亚马逊最近封禁的对象没听清。
- 2016 年那家创业公司的名字、他考虑过的那个"已接入所有服务商接口"的中国平台名字，都没听清。
- "超级 agent 分派意图"那一段讲得很乱，是按上下文概括的，需回放。
- 讲交换市场之前有一段像是在讲某个开放协议，几乎听不清。
- 讲个人 agent 时他点了几个产品名，大多没听清，只能辨出 Hermes。
