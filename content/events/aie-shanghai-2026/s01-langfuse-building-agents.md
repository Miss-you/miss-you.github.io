---
title: "Building Agents: Yesterday, Today, Tomorrow"
slug: "s01-langfuse-building-agents"
date: 2026-11-05T10:10:00+08:00
lang: zh
session: "S01"
speaker: "Clemens Rawert"
org: "Langfuse by ClickHouse"
stage: "主舞台"
summary: "agent 架构正在收敛到 coding agent 的样子，trace 多到人读不过来，改进循环要交给后台 agent 跑，人只保留对什么算好、发不发的判断。"
video: ""
source: "user-recording"
draft: false
---

据作者现场录音整理，按讲者脉络转述，不是逐字稿。讲者是 Langfuse 联合创始人（Langfuse 年初被 ClickHouse 收购），英文演讲，无问答环节。讲到后段时间不够，他跳过了一页幻灯片。

## 一句话

agent 架构正在收敛到 coding agent 的样子：模型加工具循环，再加 skill 和沙箱、文件系统。它产生的 trace 已经多到人读不过来，所以"找失败、写 eval、改、回测、上线"这个改进循环要交给后台 agent 跑，人只保留对"什么算好"和"发不发"的判断。

## 论断

### 1. agent 是上线后一轮轮修出来的

他说 agent 不像传统软件那样先写验收标准、先想好测试再开发，而是迭代改进出来的，业界已经收敛到一个固定的改进循环：跑 agent（不一定在生产，内部用户、外部用户都行），看哪里坏，看 trace，发修复，补一条测试，重复。

> "building agents is much more artisanal than this scientific, it's not a scientific process you do at your desktop. It's you need to get your hands dirty and ship many iterations." —— 造 agent 更像手艺活而不是科学流程，不是坐在桌前推出来的，得亲自上手、发很多轮。

- 例子：Langfuse 自己的 agent，读用户使用的 trace 时发现大量 tool call 错误，原因是 agent 传的参数名和工具期望的参数名词序颠倒（sum 和 total cost 的前后顺序）。他说这个例子很简单，但唯一的办法就是去看 trace。

### 2. 架构绕回到"模型加工具循环"

演进顺序是：3–4 年前直接调模型，然后是把上一个模型的输出喂给下一个的 chaining；2023–2024 年上下文窗口小，于是有 RAG；tools in a loop 很早就出现了，但当时模型不够好用不起来，于是有了 agent graph / workflow，按模型能力边界把问题切成小块，代价是得手工设计，还要事先懂 agent 可能走的所有路径。2025 年起，特别是 2026 年，模型变好，又回到工具循环。

> "Agent architectures are very much converging on the coding agent pattern is what we see." —— 我们看到 agent 架构正在强烈收敛到 coding agent 模式。

- 往上可以扩展成 sub-agent：顶层一个 orchestrator，扇出任务再汇总。
- 再往后是 ambient agents：常驻，由邮件、定时等外部事件触发，跑得比以前久得多，能把活交给别的 agent。

### 3. agent 循环跑在后端 worker 里，沙箱只是一个工具

Langfuse 内部的改进 agent 像 coding agent，一个循环带很多工具，其中一个工具是带文件系统的沙箱；再配一个 skill，写 Langfuse 怎么工作、agent 可用哪些动作。他说这不是唯一可行的设计，但在用户群和他们自己内部反复看到，一般会推荐这样做。

> "this loop actually runs in our back end workers, which might be interesting and not in a sandbox. A sandbox is just one tool that's available to it." —— 这个循环其实跑在我们的后端 worker 里，不在沙箱里。沙箱只是它能用的一个工具。

- 理由是只在真需要时才用沙箱，能省下大量沙箱计算时间成本。只是定性说法，没给数字。

### 4. 改进循环今天全靠人，得先整形数据再交给 coding agent

细化后的循环是：找失败，为失败写 eval，改应用，拿 eval 回测，上线，重来。人要判断哪些失败值得管、哪些要变成 eval、eval 长什么样。他说这套流程有效，但又慢又贵，因为用的是组织里最难扩的资源，也就是工程师。trace 量起来以后，agent 的上下文装不下几百万条 trace，得先整形数据。

> "how we see this play out in industry right now is basically progressive disclosure, but for data" —— 业界现在的做法，基本就是"对数据做渐进披露"。

- 第一步，把 trace 压成 trajectory，即 trace 的简短文本表示。
- 第二步，用更小、更便宜的模型沿你关心的维度做摘要。维度来自领域知识：agent 擅长什么、你在意什么、预计在哪失败、用户怎么用。
- 第三步，摘要做 embedding、聚类，给簇打标签。
- 第四步，再用模型给簇排序，比如 tool call 失败这一类，只挑最严重的。
- 第五步，把这些失败的完整 trace 交回 coding agent。
- 接入方式：应用数据和 trace 要能通过 MCP、API 或 CLI 接给 coding agent。

### 5. 后台 agent 接管循环，人保留质量

他预测团队会用后台 agent 接收灌进系统的数据、长期运行，找失败、提修复、回测改动。理由是应用里的 agent 本身也在常驻运行，持续产生 trace、持续冒出新失败，评估和改进也得持续。

> "once agents take over this loop, what remains for you humans to do? In our view, that's mostly quality. So you need to own the outcome." —— agent 接管这个循环后，人还剩什么？我们看主要是质量。你得对结果负责。

- 人保留的三件事：什么算好；用哪些反馈信号判断（显式或隐式的用户反馈）；是否真的发布修复。

### 6. 常规任务交给 agent，标签数据能拿来训模型

他把这一节明确称为预测和下注。他认为前沿模型的智能已经很接近能解决其中很多问题，agent 的可靠性通常才是更大的问题。任务形状常规的，把 agent 放进循环后改进差不多是自动化的；任务特殊或超出模型能力的，还得人跑循环，手动改写 skill，写清操作手册，再跑回测。

> "the next step that we see the best team starting to do right now is to do basically build their own reinforcement learning environments" —— 我们看到最好的团队正在做的下一步，是自建强化学习环境。

- 跑循环、写 eval、打标签时攒下的是应用专属的数据集，他说 "incredibly valuable"。这些标签可以用来造任务、造 verifier，最后训出在自己需要的任务质量上饱和的开源模型。
- "best teams" 没点名是谁，也没有数字。

## 存疑

- Langfuse 内部那个改进 agent 的名字没听清，需查 Langfuse 公开资料确认。
- 参数名的例子里，哪个是 agent 传的、哪个是工具期望的，他说得也含糊。
- 交给 coding agent 的 trace 量级，他说的是 "hundreds, dozens, thousands of traces"，看单条大小而定，顺序有些乱，原意可能是几十、几百到几千条。
- 他跳过的那一页幻灯片内容缺失。
