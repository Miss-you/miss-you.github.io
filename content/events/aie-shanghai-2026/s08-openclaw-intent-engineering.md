---
title: "Dark Factory to Lobsterville: Intent Engineering for Persistent Multiplayer Agents"
slug: "s08-openclaw-intent-engineering"
date: 2026-11-05T14:05:00+08:00
lang: zh
session: "S08"
speaker: "Vincent Koc"
org: "OpenClaw Foundation"
stage: "主舞台"
summary: "用 agent 大规模并行开发 OpenClaw 后，瓶颈从写得多快变成怎么证明改对了；工程师要先定义可验证的结果，再让 agent 爬坡，并把 CI 做便宜做快。"
video: ""
source: "user-recording"
draft: false
---

据作者现场录音整理，按讲者脉络转述，不是逐字稿。讲者是 OpenClaw Foundation 首席架构师，他说基金会是非营利组织，工程师五六个人。英文演讲，约 20 分钟，无问答环节；讲 CI 耗时图时有一小段录音缺失。

## 一句话

用 agent 大规模并行开发 OpenClaw 之后，瓶颈从"写得多快"变成"怎么证明改对了"，所以他认为工程师要从"工厂管理者"转成"proof engineer"：先把可验证的结果定义出来，再让 agent 去爬坡，并且把验证本身（CI）做便宜、做快。

## 论断

### 1. 工程师在变成工厂管理者

他借用"暗工厂"（机器人造机器人）的说法，他们这里是 OpenClaw 造 OpenClaw，"harness to build the harness"这句他说了三次。在伦敦 AI Engineer 讲这个话题时，他认为瓶颈是 taste，也就是工程师把模型往正确方向引的能力。

> "I think last I checked yesterday, I was running over 300 agents in parallel." —— 昨天看，我同时并行跑着超过 300 个 agent。

- 并行 agent 数从 15 到 60，再到 300 多，只和他自己以前比。
- 这些是在酒店房间用一台笔记本做的，其中一半是用手机发起的。
- 他说演讲时笔记本在台下，它现在大概正在 ship 代码。

### 2. 速度上来后，瓶颈是 proof

先撞上的是 token 限流、内存、算力、CI 这类资源瓶颈，每家供应商的限流都撞到过。更深一层是验证：人写测试、人验证都可以，但太慢，一台机器能同时验证并合入多少 PR 有理论上限。

> "My agents are working, but they're waiting for proof." —— 我的 agent 都在干活，但都在等 proof。

- 等待有成本：改动合得越快，其他 agent 越早用上，因为 harness 在同时造 harness。
- 等验证的空档，他就再派一个 agent 出去。

### 3. 从 intent engineering 走到 proof engineering

他讲的演进顺序是：loop engineering（循环跑、检查、改进）；intent engineering（循环能跑但结果不合意图，于是想办法把意图注入 harness 或模型）；proof engineering。他们有开源的 review agent 跑在每个 PR 和 issue 上，仍然会出回归、发布出问题，这是他转向 proof 的原因。

> "So essentially I've gone from factory manager to what I'm calling proof engineer" —— 我从工厂管理者变成了我所说的 proof engineer。

- background work 目标清楚，交给传统的循环跑、查、改；foreground work 是需要大量注意力的功能开发，做法是开工前先定义结果的 proof。
- 他说 proof 可以写成代码，告诉机器什么是可验证的理想结果；proof engineering 很大一部分就是 eval，叫 RL 还是叫 looping 都行。
- proof 定清楚后，问题变成怎么让 agent 最快、最便宜地到达结果，"choose a hill and we want to make the climb into that hill cheaper"（选一座山，把爬山的成本降下来）。
- 他给的边界：新颖的、模型没见过的任务不适用；UX 改进、产品提速这类有快速反馈的适用。

### 4. 让 agent 像用户一样用产品来产生 proof

proof 不只是单元测试。他们用 computer use 让模型像用户一样去用产品，看是不是真能用，再让它从 proof 里学，下次遇到类似情况能用上；学习可以来自别的 PR。

> "we teach models now using computer use ... actually go in and behave like a user and use the product and see if it actually works to kind of generate that proof." —— 让模型用 computer use 像用户一样用产品，看它是否真的能用，以此产生 proof。

- Doom 例子：9 月发布的 OpenClaw 第二版是多人环境，要改进 computer use。他们把 Doom 放进去让 agent 玩，找到让它变慢的地方就改快；游戏跑得越快，agent 打得越好，延迟下降带来更好的产品结果。
- 他说看这个例子要看 agent 能不能玩这个游戏，而不是某个 benchmark 的分数。

### 5. 工厂速度取决于 CI

峰值时一个月光测试就花了约 127 万美元，大部分是各家公司赞助的算力，他说"free money and free compute never lasts"。他更担心的是 agent 会不断加测试，删又不能删，删了就没法验证 agent 是否真的做了事。

> "If the factory slows down, the factory can't fix itself." —— 工厂一慢，工厂就修不了自己。

- 指标借用 DORA 的 cycle time，定义为 PR 从打开到合入的时间。测试太慢时每个 PR 要等 30 分钟。
- 成本和速度一般不能兼得：CI job 数降了，单个 job 价格却上升。
- 大约一个月前，commit 量大到本身成了瓶颈。

### 6. main 上关掉 CI，改成定时跑

> "we turned off CI checks on main entirely." —— 我们把 main 上的 CI 检查整个关了。

- PR 上只做有限检查，agent 走 review；合入后 main 不跑 CI，改为每 30 分钟到 1 小时跑一次；更全面的测试放进发布流程。
- 结果：每 100 次 CI 运行从一千多美元降到两百多美元；PR 过 CI 不再有 20–30 分钟的尖峰，从打开到合入约 1–2 小时。比较对象是他们自己优化前，时间窗没说。
- adaptive testing：根据改动和执行到的代码，用分类器预测哪里可能回归，只测那部分，他说能用很小的子集达到同样的发现率。拿过去 2–3 个月的历史数据做模拟来训练。这部分两天前才合入，算力下周到位后才完全启用。
- 他预期总 CI 成本能降 95% 到 98%，这是预期，不是实测。

### 7. 用贴近真实使用的 benchmark 测整个产品

他们和多个合作方花 2–3 个月做了个人 AI agent 基准，135 个任务，小部分公开，希望这几天发布。任务由人设计，比如报税、两个人对结果有分歧怎么办，刻意带模糊性。

> "that level of ambiguity enabled us to test things like the harness, the memory, the messaging." —— 这种模糊性让我们能测 harness、记忆、消息这些部分。

- 用来看产品整体变好还是变差，跑的频率可以低于每天每小时的单元测试。
- 会覆盖多种 harness 与模型组合，包括编码 agent 和个人用途的非编码 agent。
- 他观察到很多公司在做自己的 benchmark，从合成数据转向真实数据集。
- 后续实验是用 CI 里的小模型找出高回归区域，再驱动 agent 回去改，稳定后开源。

收尾时他说，工厂一开始运转很好，后来慢了下来，"The factory couldn't build other factories, which is our biggest change."；从 factory 到 Lobsterville，就是走进 proof engineering，让模型知道自己做的事是否可验证、是否有真实影响。

## 存疑

- 他说的单日产出（一天一千多到三千左右）单位没听清，可能是 PR 或 commit。
- "一半从手机发起"推测是通过 Telegram，需回放。
- 开源 review agent 和个人 AI agent 基准的名称都没听清，需对照 OpenClaw 公开资料。
- 127 万美元是"峰值"也是"一个月"，两处是否指同一个月需看幻灯片。
