---
title: "Memory Engineering, RSI and Team Knowledge Layer"
slug: "s36-nowledge-memory-engineering"
date: 2026-11-06T17:10:00+08:00
lang: zh
session: "S36"
speaker: "Siwei Gu"
org: "Nowledge Labs"
stage: "主舞台"
summary: "agent memory 要管记什么、时间、脉络和遗忘；今年 4 月起半闭环的自我改进在团队日常里跑通，卡点在人的验证，所以团队知识宜做成 harness 能直接用的上下文层，而不是训进参数。"
video: ""
source: "user-recording"
draft: false
---

据作者现场录音整理，按讲者脉络转述，不是逐字稿。讲者是 Nowledge Labs 联合创始人兼 CEO，中文演讲夹英文术语，无问答环节。这场是快闪，实际讲了约 21 分钟，后两部分他多次说时间关系不展开，细节较少。

## 一句话

做 agent memory 不只是存和检索，还要管记什么、时间、脉络和遗忘。今年 4 月起，模型能力让"半闭环"的自我改进（RSI-like）在他们团队的日常工作里跑了起来，而这种工作方式最卡的是人的验证环节，所以他认为团队知识要做成能被 harness 直接用的上下文层，而不是训进模型参数。

## 论断

### 1. 组织和 agent 都会遗忘

开场例子是 NASA 重返月球的 Artemis 计划：50 年后再登月，一个材料上的问题花了很多工夫，其实 50 年前已经解决过，只是忘了。在 AI 里，跨 session、跨 agent 切换时也常遇到同样的事。Nowledge 从 25 年开始做给人和 agent 用的知识层。

> "他们在 50 年之前已经完完全全的解决过这个问题，只是他们现在完全这件事情已经忘掉了，我们把这个事情如果在一个 organization 里边，我们叫组织遗忘"

- 他认为人脑和 AI 的记忆系统有对应关系，挑战类似，但比重和约束不一样。例子是 working memory：人同时做几件事时最短、最快的那层上下文，他们系统里也有类似设计。

### 2. Memory Engineering 的五个方面

他说 memory 不只是存储问题，这部分讲得很快。

> "有些系统它的 memory 做的比较差的话，其实不如没有"

- 记什么：最早的版本就决定把所有 trace 和 trajectory 原样存成 episodic memory。哪些值得蒸馏成 semantic memory 很难事先知道，他们曾用一个小模型加很克制的简单 prompt 来判断。
- 检索：memory 系统在一定程度上是 retriever，要针对 memory 的性质做结构设计、检索加权和策略调优；但只做成检索型会有大问题。
- 时间：至少有两个维度，一是记忆涉及的事件本身的时间，二是这条记录被创建和修改的时间。可以在系统内部做意图识别和过滤，也可以直接暴露给消费 memory 的 agent 自己用。另外按天维护当天聚焦的 working memory。
- 脉络：同一话题在不同时间点有演进，全存下来却不知道脉络关系，消费时就拿不到最新版本或完整脉络。
- 衰减：用了背单词软件里常见的间隔重复算法 FSRS，收集 agent 使用记忆时的反馈，做成有点像推荐系统的机制来辅助计算衰减。他说知识衰减"是feature，而不是bug"。
- 最后系统长成一张 supergraph，不同层面的上下文在一张图里；还有一张 identity graph，记录个人或组织里的 agent card、人以及它们和上下文的关系。可以按切片用，也可以把整张图的抽象交给 agent 自由探索。他说效果很好，没给指标。

### 3. memory benchmark 只能找低垂的果实

> "所有的哪怕是针对 agent 已经设计过的 memory 的benchmark，它其实都是 retrieval base 的"

他说真实场景里很多维度都不是检索型的，要精心设计不同维度的上下文结构，并和各种 harness 充分集成，所以现有 benchmark 偏差很大。基础 benchmark 分数很低时，可以借它看看丢了哪些低垂的果实。

- 今年春天之前的十几个月，他们自己维护了四五十个维度的评测，比如 memory consolidation / distillation、entity graph extraction，用真实数据和用户反馈一点点构造，很多是专家在环、用启发式方式优化。他说这件事在今年 4 月开始变了。

### 4. RSI 要分全闭环和半闭环

他说他们不是向客户提供 RSI，而是在团队日常工作里自己走到了 RSI-like 的范式。最大的区别在于任务是全闭环还是半闭环。

> "他们由于他们所有中间的trajectory，甚至他们定义的 environment 的优化和可观测性的优化，所有的工作都是 human readable，所以这两个工作变得特别不一样"

- 他对比了两张图：一张是他 2019 年在 OpenStack 上做的调优，用贝叶斯优化，把复杂系统当黑盒在多维空间里找参数，不需要领域知识；另一张是 Google AlphaEvolve 25 年在 Borg 上做的同类工作。区别在于后者的中间轨迹、环境定义、可观测性都是人能读的。
- 今年 4 月他在家庭旅行休假期间做了一个带 copilot 的终端环境，让助手理解所有 pane、tmux、SSH，以及里面嵌套的 Claude Code 这类 TUI。做的过程中自己走到了 auto research 的方法，他说 9 月 Anthropic 发了一篇方法完全一样的博客。这个项目开源，中间优化和收敛的记录也公开。
- 他说到了 4 月那一代模型之后，半闭环的复杂系统自我优化变得完全可行，这大大改变了他们做 memory 系统的方式。

### 5. Dark Office 的瓶颈在人的验证

他观察自己团队和一些 AI native 客户，夜里 12 小时和周末 48 小时的产出依然很大，他把这叫 Dark Office，类比无人的 Dark Factory。他认为其中最值得研究的是半闭环的 RSI-like 工作。

> "这种 semi loop 的核心就在于它的 verification 的环节是不能完全 decouple human 的"

- 人在环里的比例会逐步变小，但还是要用批量的方式去定方向、去验收，用自己的 taste 和判断。
- 所以他说最重要的是让团队的智慧在专家不在时也能推动工作往前走。
- 他们建了团队级的 memory 系统，定义了团队"上下文连续性"（context continuity）的四个级别，说 L3 和 L4 带来了很多 aha moment。四个级别各是什么没讲。

### 6. 团队上下文训进参数不如编译给 harness

这部分是和康奈尔大学一位年轻研究者的合作，他说是第一次公开。

> "我们做了不同的 9 个不同的实验，只有 3 个情况是有收益的"

- 第一个尝试是把团队上下文内化进模型参数，试了 9 个场景，例如人离开 loop 时工作能不能往前推一点、能不能帮你找到该找的 agent 或人。
- 改为把团队上下文编译成 harness 能更好利用的形式后，他说效果反而更好，在很多其他场景也更好。没给指标、场景明细和幅度。
- 他提到上个月 CMU 一篇叫 harness adapter 的论文（不针对团队上下文），认为思路一脉相承，所以沿用这个词：类比 model adapter，团队上下文最好以 harness adapter 的形式被使用。

## 存疑

- Artemis 例子里 50 年前已解决的材料问题具体是什么，没讲清。
- AlphaEvolve 在 Borg 上做的具体是调度优化还是别的，需核。
- 4 月那代模型他提到了 Opus 和 GPT 5.4，具体版本号需核。
- 他说的那篇 Anthropic 9 月博客没点名。
- CMU 那篇 harness adapter 论文的原题需核。
- 他提到一个开源的 context native 数据库和自己的终端项目，名字都没听清。
