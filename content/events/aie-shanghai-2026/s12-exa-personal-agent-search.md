---
title: "Powering open source personal agents with Exa search"
slug: "s12-exa-personal-agent-search"
date: 2026-11-05T15:35:00+08:00
lang: zh
session: "S12"
speaker: "Jakub Hojsan"
org: "Exa"
stage: "主舞台"
summary: "用 mem0、browser-use、OpenRouter 和 Exa 搭一个可检查的开源个人 agent：先用搜索高亮拿最少 token，不够再开浏览器；记忆按人区分，主动提醒要条件全满足才打扰。"
video: ""
source: "user-recording"
draft: false
---

据作者现场录音整理，按讲者脉络转述，不是逐字稿。讲者是 Exa 的 FDE Lead，英文演讲，约 12 分钟，以 demo 为主，无问答环节。录音缺开头约 2 分钟，自我介绍和开场没有录到。

## 一句话

用开源组件（mem0 做记忆、browser-use 做浏览、OpenRouter 接开源模型、Exa 做搜索）就能搭一个可检查的个人 agent。他强调的设计是先用搜索高亮拿最少的 token，不够再升级到浏览器；记忆要按人区分；主动提醒要所有条件都满足才打扰用户。

## 论断

### 1. 个人 agent 多出来的是连续性和主动性

他把 agent 的演进分成几步：问一句得一个答案，再到把任务委派给能搜索、浏览、写代码的云端 agent（点名了 OpenAI、Anthropic、Cursor），再到个人 agent。个人 agent 能把预算、偏好、已经开始的计划从一次请求带到下一次，也能从上次停下的地方接着做。

> "The building blocks are context, search tools, and persistence." ——积木是上下文、搜索工具和持久化。

- 演示请求是"在上海找个好地方过一晚"，贯穿全场：找店、看店内照片、考虑朋友偏好、变成计划。结尾他回到"this all started with one request"。

### 2. 个人 agent 应该开源、可检查

他说不是每个人都愿意把自己的全部信息发给闭源系统；他希望能检查系统记住了什么，看到它为什么被调用、为什么失败、什么时候失败，这样能自己改进系统，而不是依赖别人的。

> "not everyone is super comfortable with sending all their information to these closed source systems." ——不是每个人都愿意把自己的全部信息发给这些闭源系统。

- 记忆：mem0，开源库。
- 浏览：browser-use 库，对搜索拿到的上下文做浏览器操作。
- 模型：通过 OpenRouter 接开源模型。
- 搜索：Exa，提供带高亮片段的网页搜索。
- 接口层可替换，他提到 iMessage 接入，也说"可能有微信的 API"。每个组件只做一件事。

### 3. 先搜索读高亮，不够才开浏览器

指导原则是先搜索、读页面高亮，再判断任务还缺什么，让每次工具调用都很聚焦。他认为要让 agent 快，就只取下一步决策所需的最少 token。

> "For a fast agent, you should be retrieving the minimal amount of tokens possible for the next decision." ——要让 agent 快，应该只取下一步决策所需的最少 token。

- 餐厅网页里有导航、品牌故事、旧公告、订阅框、目录，有用的只是描述环境、价格、地址、营业时间的几段。高亮按查询抽取原文，不改写页面，整页不进模型上下文。
- 整页塞进去会增加输入 token、处理变慢；对小模型可能撑爆上下文、增加幻觉。省下的空间留给对话、图片和更多结果。
- 高亮够就直接回答；用户要照片或缺关键细节，才升级到浏览器。demo 里找照片时，他拉起 browser-use 打开带照片的网页，图片保留来源链接。
- 他说 highlights 大概是 Exa 除搜索之外最重要的功能；收益只说处理的文本少得多，没给数字和比较对象。
- 他认为闭源个人 agent 大多也是这么设计的，依据是自己用过 iMessage 上的个人 agent，属他的推测。

### 4. 记忆要区分是谁的偏好、影响哪个计划

他说记忆对开发者有用，是因为它帮着构造任务，比如预算直接变成搜索条件的一部分。个人 agent 里不是所有东西都归到用户本人，生活里还有别人。

> "The system should keep track of who the preference belongs to and which plan it affects." ——系统要记录偏好属于谁、影响哪个计划。

- agent 事先存了人均预算，以及"氛围和房间跟食物一样重要"的偏好，都从记忆里取出拼进搜索。
- 朋友不吃辣，写回记忆；agent 随后给出可以问服务员的问题：这些菜能不能做成不辣的。
- 最后餐厅、预算、照片、饮食偏好都存下，下次能回到这个"晚上"。记忆按需注入，由模型决定什么时候调用记忆工具。

### 5. 主动提醒要所有条件都满足才打扰

> "The email alone is not like a reason [to] interrupt me." ——光来一封邮件不是打扰我的理由。

- agent 记得他喜欢爵士，收到上海一家爵士场地放出两个座位的邮件。它核对三个条件：那晚日历空不空、票价在不在票务预算内、是不是真有两个座。只有都满足才通知，否则保持安静。
- 另一个例子：饭后去外滩散步，Exa 的索引里有天气，demo 那天预报下雨，agent 建议改做别的。
- 实现方式是用 Exa 的 Monitors 产品，或用普通搜索加定期用 browser-use 看网页。他认为闭源服务商也是这么做的，属他的推测。

### 6. Exa 的索引已经不只是网页

> "recently, due to this large group of personal agents, we've actually indexed over 200 million points of interest." ——最近因为个人 agent 这一大波需求，我们索引了 2 亿多个地点。

- 1000 亿网页索引，新闻源 15 分钟内入索引。
- SEC 文件和财报电话会，300 多万档播客的完整转录，还有事件和天气。
- 地点：可以搜旧金山所有披萨店及价格、菜单，他说中国的地点也不少。demo 在上海找到 43 家卖蟹黄面（疑为此词）的店，再按氛围好、有景、不是传统面馆、人均 300 元以下逐步收窄，agent 逐个看地点实体和菜单，必要时升级到浏览器。
- 这些都是 Exa 自报的规模，没有和其他搜索 API 或自建爬取比较。

## 存疑

- 开头提到的云端 agent 产品里，OpenAI、Anthropic、Cursor 之后还有一个名字没听清。
- demo 里的预算数字没听准，疑为人均 300、两人 600；后面收窄条件里说的是人均 300 元以下。
- 他提到两个作为设计参考的闭源个人 agent 产品，名字没听清。
- 候选餐厅名没听清；爵士场地的名称也不确定。
- "1000 亿网页索引"的数量级需对照回放确认。
