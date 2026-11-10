---
title: "Trust Your Own Evals, Not the Leaderboard: What 10k+ Internal Agent PRs Taught Us About Adopting Open Models"
slug: "b02-harvey-trust-your-own-evals"
date: 2026-11-05T14:05:00+08:00
lang: zh
session: "B02"
speaker: "Joey Wang"
org: "Harvey"
stage: "AI 应用分会场"
summary: "Harvey 内部 agent 的上万个 PR 都能重放成评测集；用它测几类固定任务后发现，该改的常是数据、小 bug 和评测集本身，选模型要信自己的 eval。"
video: ""
source: "external-recording"
draft: false
---

据现场外部录音整理，未与本人录音对照。讲者是 Harvey（法律 AI 公司）的工程负责人，中文演讲，夹英文术语；末尾有一个简短问答，提问内容没录清。幻灯片和现场视频演示看不到。

## 一句话

Harvey 内部的 Slack 协作 agent 产生了上万个 PR，每个 PR 的流程都能重放，于是变成自家评测集。拿它测 PR 描述、code review、修 CI 三类固定任务后，他发现该改的往往不是模型也不是 harness，而是喂给模型的数据、代码里的小 bug 和评测集本身，所以选模型要信自己的内部 eval，不信公开榜单。

## 论断

### 1. 云端 agent 的运行过程本身就是评测集

他今年做的项目叫 Specter，是 Harvey 内部的 agent：多人在 Slack 里和同一个 agent 协作，也可以从网页、手机或自动化触发，从产品需求一路做到工程交付、测试、上线。本地跑的 agent，同事最后拿到的只是一个 PR，背后的 context 和 thinking trace 都没了；放到云端，全过程都留了下来。

> "因为harness和模型都是相当于你的可以替换，所以说从一个task最开始到最结束，呃我们这个固定的流程其实都是可以重放的。"

- 规模：他说公司可能有 500 多人在用，产生了大概上万个 PR。没说统计时间段。
- 他说做内部 agent 的前提是自己做一个东西的成本已经变得很低。

### 2. 公开 leaderboard 不能直接拿来换模型

别人的 context、agent、harness 和你不同；而且工作里一大半不是生成代码，是让代码达到上线质量。他列了促使他做实验的几个现实问题：新模型几周就出一个，是马上上还是先测；云上 agent 比本地慢，换更快的模型行不行；人人产出更多，PR review 成了瓶颈；还有成本。

> "很多时候你有一大半事情并不是说你是生成代码，而是说你怎么样让这个代码能够达到呃产品上线的这个quality"

- 方法：选 review 代码、修 CI、写 PR 描述三类固定任务，把流程拆成多步重放，用 LLM judge 打分；每次只改一个变量，判断该改模型、harness 还是别的。

### 3. 要改的常常不是模型，是喂给模型的数据

PR 描述的工作流要求人写的部分保留，agent 生成的部分随改动更新，还要附测试结果。他换了模型、换了 harness、换了 prompt 都没变化，问题出在丢给模型的数据上。

> "所以通过这个测试，我发现只要修一些bug，基本上你不用换任何的模型，或者说是prompt就可以做得非常好"

- bug 举例：PR 描述太长时，最后给模型的内容并不是真正能用的，于是漏东西。
- 他说是准备这次演讲的 slides 时才发现很多 low hanging fruit。没给修 bug 前后的分数。

### 4. 评测本身比评测结果更重要

收集了大量重放数据，真正能用的不多；判断数据能不能用，是他和做实验的 agent 聊得最多的事。

> "有可能这个code review本身有另外的人或者说Agent在上面留了更多的code review，那你重放的过程中，你这个Agent可能会受到那些后来的signal的影响"

- 两种污染：重放时看到了后来别人或 agent 留的 review；PR 之后又有人加了新的 change。
- 他说花的更多时间是研究评测集该怎么选出来。没给剔除比例。

### 5. code review 上便宜模型接近 Opus

在 prompt 调到最优、harness 是通用的前提下，DeepSeek V4.1 Flash 在 code review 上已经接近 Opus。Opus max 花钱多得多，多抓到的问题经人工审查"可能并不重要"。

> "所以说与其说我们用呃opus max不如直接用opus，与其用opus不如直接用DeepSeek的flash，所以说这个结果也是比较出乎我意料的"

- "接近"没给分数，"花非常多的钱"没给金额，人工审查的规模和 Opus 的具体版本都没说。

### 6. 修 CI 的差别在耗时，不在质量

修 CI 有明确的过与不过，把 agent 放在那里，各模型最后都能跑过，质量差不多。他说有好的验证信号的地方，是 agent harness 提效最多的地方。

> "最后会发现其实这些open weight呢，呃大部分时间都在呃就是思考的更多，它需要可能有更多的这些thinking trace才能解决这个问题"

- Opus 有时一次就过，也会减少对 CI 的重试；open weight 模型（未点名）反复尝试，耗时长，占沙盒运行时间。没给时间数字。
- 他没有因此放弃 open weight，而是看 trace 做 hill climb：发现不需要全部跑测试、也不用思考那么多，也能得到结果。

### 7. 差的往往是有没有花时间优化流程

法律侧他们 2024 年做了 Big Law Bench，今年做了针对长时间运行 agent 的 Legal Agent Bench，他说两边是同一套思路：自己设计评测集和评分方法，用自己的数据和任务。

> "它可能最后你差的不是模型，不是harness，差的就只是说你有没有花这个时间精力去把你这个流程给优化"

- 这次实验他和 agent 交流一共花了约 7 小时、约 7000 美元，预计每月能给公司省上万美元。省钱是预计，没给现在的模型和每月花费作对比。
- 他说 Harvey 也对 GLM、Kimi K3 等 open weight 模型做过 post training，但这次的结论是可能不需要训模型就能做到很好。

## 存疑

- 问答里有人追问 7000 美元的口径，他的回答涉及这次实验和 Specter 的全部运行，听不清到底只算这次实验还是都算在内。
- 新模型举例里的"千万"疑为千问（Qwen）。
- 他提到别人用的一个工具或 harness，名字听起来像 Ripple，未确认。
- "Kimi K3"按原话保留，未核对型号名。
