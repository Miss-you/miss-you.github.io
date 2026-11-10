---
title: "Stronger Models, Leaner Harnesses: What to Control and What to Let Go"
slug: "s25-minimax-leaner-harnesses"
date: 2026-11-06T13:55:00+08:00
lang: zh
session: "S25"
speaker: "Ronny He"
org: "MiniMax"
stage: "主舞台"
summary: "模型变强以后，harness 里的提示词、subagent、todo/plan、压缩策略都该拿评测逐项检验，能删就删；不变的追求只有两条：更少的 token、更高的任务完成率。"
video: ""
source: "user-recording"
draft: false
---

据作者现场录音整理，按讲者脉络转述，不是逐字稿。讲者在 MiniMax 负责 MiniMax Code 的研发，中文演讲，无问答环节，幻灯片内容只能从口述还原。

## 一句话

模型变强以后，harness 里很多曾被当成必需的提示词、subagent、todo/plan、压缩策略都该逐项拿评测检验、能删就删；不变的只有两样追求：更少的 token 和更高的任务完成率。所以他把 harness 工程看成一门靠假设和对照实验推进的实验科学。

## 论断

### 1. 模型变强后，harness 要做减法

他拿 Anthropic 在 Claude Code 上的几次调整当证据：砍掉大部分系统提示词，承认单个强 agent 胜过精心设计的多 subagent 系统，先后去掉 todo 和 plan mode。他推测下一个会被去掉的是 /goal 命令，因为 MiniMax 训练模型时就要求它一直做到把最终结果交付给用户，每个任务本身就是一个目标。

> "因为拆 subagent 这个事情也是 Anthropic 先告诉我们……那为什么会到今天，这个推论又被推翻了。就是因为模型变得越来越强了"

- "砍掉 80% 系统提示词"是他转述 Anthropic 的说法，没给出处和时间。
- 现场举手调查，他说"80% 以上的人今天都用过 claude code"，是目测。

### 2. 一个 harness 要决定四件事，其中验证最重要

四件事是：模型看到什么、能做什么、怎么持续下去、怎么验证。每一项都要随模型能力重新判断该保留什么。

> "还要能够去验证这个事情到底做的怎么样，这是 harness 非常重要的一部分，而且我认为是最重要的一部分"

- 看到什么：约束行为、规定先做什么后做什么的提示词，在模型变好后很多已经没必要。他引用了下半年出现的说法 "without skills is better than with skills"：不少常用 skill 更耗 token，效果却没变好。没给测试数据。
- 怎么持续：Transformer 做不到真正的无限上下文，harness 负责给人"无限上下文"的体验，过去靠拆 subagent、上下文隔离、压缩。新做法是告诉模型上下文快满了，让它自己把任务写进本地文件交接；他说效果"可能"比精心设计的压缩更好，没给对比数据。
- 能做什么：这一项讲得最短，没给例子。

### 3. 不变的只有两条：更省 token、更高任务完成率

新功能进 harness 前要回答四个问题：删掉它会不会变坏；对模型本身有没有意义；出错了怎么撤销或重做；怎么设计评测。在 MiniMax Code 团队，答不清的一般会被他打回，先要交一个评测流程。

> "我认为不变的东西是两件事，一件事情就是对 token 效率孜孜不倦的追寻，和对工作效率或者叫任务完成率的孜孜不倦的追寻"

### 4. MiniMax Code 的几个做法都围绕前缀缓存和 token 效率

- 工具按需发现：MCP 工具动态加载，网络波动或新增 MCP 都会让工具列表变化，前缀缓存失效，agent 变得很贵。他们把这些工具收进一个 connector CLI，在 CLI 里用渐进式披露（疑为此词）让 agent 发现和调用工具。没给成本数字。
- PTC（Programmatic Tool Calling）：让模型一次输出一段脚本，在沙箱里批量调工具，省掉模型和工具之间的来回往返，也省掉中间结果占的 token，还能借代码的并发和异步跑得更快。没给速度或 token 数字。
- 长命令自动转后台：典型请求是"把这个 GitHub 仓库拉下来跑起来"，装依赖可能超过 5 分钟甚至十几分钟。要让长命令自动挂后台，agent 知道它在后台，结果出来再回传给 agent。
- subagent 克制开启：他说最近的 benchmark 显示更多 subagent 很多时候只是白耗 token。benchmark 名称和数字没给。

> "让 LLM 一次性输出一段代码的脚本……我节省了我和 LLM 之间循环往复的沟通"

### 5. 像珍惜内存一样珍惜 context

放进 context 的每样东西都要算信噪比，先问不放进去能不能达到同样效果。他用北大计算机课老师那句"对待你的内存要非常的珍惜"做类比。幻灯片上有 context 的四层（global memory、project memory、working context 等），他说不赘述。

### 6. Harness 工程是实验科学

实现变便宜以后，他认为珍贵的是好奇心、做完 1 到 100 的执行力和科学方法（对照、消融、假说演绎）。做法是在和 AI 交互之前先想好怎么验证假设，让 AI 当假设验证的执行者和调度者；没达到目的，可能是假设错了，也可能问题本身不存在。

> "执行力是说你做完 0 到 1 之后，还愿意把 1 到 100 给做了，因为 agent 做 0 到 1 真的太快了"

- 他说只要能扩大实验数量，就能提高整个产品和模型迭代的效率。

## 存疑

- 讲 PTC 时他说上个季度某个产品把默认行为改成了 PTC，产品名没听清。
- 他举了 Codex 用浏览器操作弹钢琴的例子，非 PTC 的 agent 复刻时弹得很慢；原词疑为 computer use 或 browser use。
- 四件事里后两项的英文原词按语境是 how it continues、how it verifies，需对照幻灯片。
