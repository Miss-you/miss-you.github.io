---
title: "Measure the frontier of AI for real world use"
slug: "s05-arena-measure-the-frontier"
date: 2026-11-05T11:25:00+08:00
lang: zh
session: "S05"
speaker: "Chen Peng"
org: "Arena"
stage: "主舞台"
summary: "Arena 自己做通用 agent 产品吸引真实使用，每个会话随机分配底层模型，从真实轨迹里挖信号合成排行榜；按这个榜，美国前沿实验室领先，中国开源权重模型在第二梯队但处在性价比前沿。"
video: ""
source: "user-recording"
draft: false
---

据作者现场录音整理，按讲者脉络转述，不是逐字稿。讲者是 Arena（原 Chatbot Arena）的 Head of Data & Applied ML，团队负责 Arena 大部分数据和评测产品。主体英文讲，夹几句中文，无问答环节。排行榜的具体分数在幻灯片上，录音里没念。

## 一句话

agent 评测不能只靠用户投票。Arena 的做法是自己做一个通用 agent 产品吸引真实使用，在每个会话里随机分配底层模型（类似 A/B 实验），再从海量真实轨迹里挖出成功率、用户褒贬、需纠偏程度等信号，合成排行榜。按这个榜，美国前沿实验室领先，中国开源权重模型在第二梯队，但落在性能-成本的帕累托前沿上。

## 论断

### 1. 评测底子是真实用户的真实任务

他说静态 benchmark 用预先定义的题目评模型，很容易被刷分；Arena 靠数百万用户在 arena.ai 上用模型做真实的个人和工作任务，贡献反馈信号。

> "unlike many of the static benchmarks, which uses a predefined problem ... To evaluate the model performance, which is very easy to. Game" —— 静态 benchmark 用预先定义的题目评模型，很容易被刷分。

- 2023 年起于 UC Berkeley 的开源研究项目，原名 Chatbot Arena，约一年半前成立公司。
- 月访问超过 1500 万，按流量是全球前 30 的 AI web 应用；累计超过 10 亿条用户 prompt、6000 万次投票、500 万个 agent 会话。"前 30" 没说按哪家统计。
- 中国大陆用户可以直接访问排行榜，消费级产品需要 VPN。

### 2. 简单场景用对战投票，agent 要另起炉灶

聊天、生图、生视频、web dev 这类简单场景，用户提交 prompt，随机抽两个模型 PK，两两投票，收集数百万票后用统计模型算结果。agent 系统涉及模型、harness 和环境之间的复杂交互，评测目标要换成复杂、长程、真实的 agent 任务。

> "the human feedback, although it's still a very important elements in the measurement for agents, but it's only one piece. It's not the whole story." —— 人类反馈仍很重要，但只是一块，不是全部。

### 3. Arena 自己做了一个通用 agent 产品

为了评 agent，他们开发并上线了一个和 Manus、Genspark 很像的完整 agent 产品，即 Arena Agent Mode，把它当成真实轨迹的来源。

> "Arena Agent Mode becomes an endless source of very high quality data based on real world agent use" —— Agent Mode 成了基于真实 agent 使用的高质量数据的无尽来源。

- 任务覆盖写代码、生图生视频、调研、写文档、规划、头脑风暴、工作流自动化。
- 工具有文件编辑、bash、web 搜索、GitHub、Google Drive / Docs、Notion，computer use 即将上线。
- 很多会话有几十甚至上百次工具调用。他举了一个金融研究任务的真实会话：84 轮、676 次工具调用。

### 4. 用随机对照实验评 agent

用户开一个 agent 会话时，从平台上几百个模型里随机抽一个当编排模型。在百万量级的会话上，这能保证每个模型面对的任务分布有代表性且可比。他用中文重复了一遍"随机对照实验"。

> "we basically leverage randomized control trial ... Very similar to AB testing" —— 用随机对照实验，类似 A/B 测试。

- 从每条轨迹里抽五个信号：confirmed success（是否完成用户交代的任务）；praise versus complaint（用户夸多还是抱怨多）；steerability（需要用户纠偏多少次）；bash reliability（用 bash 的可靠性）；tool hallucination（对自己在用的工具有多少幻觉）。
- 信号由 LLM judge 加人工精细校对抽取，五个信号汇总成每个模型的能力分。权重怎么定、confirmed success 由谁确认，他没说。

### 5. 美国实验室领先，中国开源模型在性价比前沿

按 Agent Arena，Anthropic 第一，Google 最近强势回归拿到第二。月之暗面的 Kimi 是排名最高的中国实验室。他说不少中国开源权重模型按能力不一定排最前，但处在性能-成本的有效前沿上。

> "The Chinese open weight models are in the second tier catching up. However, there is still a significant gap." —— 中国开源权重模型在第二梯队追赶，但差距仍然明显。

- 前沿上点名的中国模型有小米 MiMo、DeepSeek 等。
- 他建议选模型时看帕累托曲线，在性能、成本、时间和 token 消耗之间有意识地取舍。
- 排名的比较对象是同一套随机分配机制下的其他模型，具体分数和差距录音里没念。

### 6. 正在做的四件事

- 对齐指数（Alignment Index）：一个月前上线，第一版三个信号是 unauthorized action（做了用户没授权的事）、false attribution（给用户安上用户没有的意图）、false completion（声称完成实际没完成）。下一步加 harmful compliance 等安全信号。他说腾讯在对齐行为上是排名靠前的实验室之一。
- harness 随机化：下一步在不同 harness 之间也做随机化，先从 Claude Code、Codex、OpenCode 这些开始，之后允许模型实验室带自己的 harness 进来，测模型和 harness 的组合。
- Agent Auto Eval：用 Agent Mode 上数百万会话训练了一个用户模拟器。真实流量要等几天到一周才攒够评测所需的几万个会话，用模拟器几小时内就能出结果。
- 后训练数据：把 agent 轨迹变成 rubric 和 RL 环境，提供给实验室做后训练，目标是评测、可执行的洞察、后训练产品、帮实验室提升模型的闭环。

> "We trained a user simulator based on the millions of sessions that happened on Arena's Agent mode." —— 用 Agent Mode 上数百万会话训练了一个用户模拟器。

- 商业面：客户是 frontier labs 和 neo labs，服务包括新模型联合发布、联合营销、上线前对 checkpoint 做产品测试和评测、后训练数据产品。

## 存疑

- Kimi 的版本号没听清，需看幻灯片。
- 帕累托前沿上还点了一个中国模型，名字没听清，疑为腾讯混元。
- harness 列表里 Codex 之后可能还有一个 Pi，也可能指 Codex CLI，没听清。
- 金融研究那个任务的具体名称没听清。
