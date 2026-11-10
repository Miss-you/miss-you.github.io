---
title: "Taxonomy of World Models"
slug: "s18-world-labs-taxonomy-of-world-models"
date: 2026-11-06T10:05:00+08:00
lang: zh
session: "S18"
speaker: "Christoph Lassner"
org: "World Labs"
stage: "主舞台"
summary: "「世界模型」一词已被用滥，应按功能、领域、尺度与分辨率、覆盖度来归类；讲者认为世界模型会成为 agent 抽象推理与感知/行动之间的接口。"
video: ""
source: "user-recording"
draft: false
---

据作者现场录音整理，按讲者脉络转述，不是逐字稿。讲者是 World Labs 的 Advisor、联合创始人，英文演讲，无问答环节。录音缺开头约 3 分钟，RL 意义上世界模型的定义和 agent 循环示意图那部分没有录到。

## 一句话

讲者认为"世界模型"这个词已经被用滥了，应该按功能（渲染、模拟、规划）、领域、尺度与分辨率、覆盖度几个维度来归类。他的论点是，世界模型会成为 agent 的抽象推理和感知/行动之间的接口，未来的 agent 是一个 System 2 推理核心加上多个各带世界模型的领域模块。

## 论断

### 1. 按"它做什么"给世界模型分类

渲染给出观测，模拟给出可能的世界状态，规划给出动作。他说这是他在 World Labs 的朋友们今年夏天写的一套功能分类法，是一张可扩展的能力表，三种操作并没有穷尽能问的问题。贯穿的例子是桌上的杯子：从这里看过去会看到什么，推一下会怎样，怎么把它拿起来。

> "Only because a model supports one of these functions does not mean that it is a world model." —— 一个模型支持其中某个功能，不代表它就是世界模型。

- 一个世界模型可以实现这些功能的全部或任意子集；这几种操作可以共用一个底层模型，也可以分散在多个模型里。

### 2. 宽口径下，LLM、SLAM、Google Maps 都算

他用"乐观口径"判定：只要有一种实现能做到某个操作就打勾。一张幻灯片逐个检查候选：LLM、SLAM、David Ha 与 Schmidhuber 的 World Models、3D Gaussian splatting（疑为此词）、视频生成、Google Maps、JEPA。

> "I would very much argue that an LLM absolutely can qualify as a model of how world behaves, right?" —— 我非常坚持地认为 LLM 完全可以算描述世界如何运转的模型。

- 现场问"谁觉得 LLM 算"，只有几只手；问 SLAM 时手多一些。
- LLM 不能渲染，因为不是视觉模型，但能模拟、推进它对世界的认识，也能帮你规划。
- Google Maps 算，是因为它聚合多个组件的数据，调和成一个"信念"，可以用来规划行程、提前预估。
- 他也承认这样还是把很不一样的东西放在一锅里，比如 Google Maps 和 SLAM 这种算法。

### 3. 还要看领域、尺度与分辨率、覆盖度

领域上，空间世界、数字世界、人体细胞模型这类专门领域差别巨大。尺度上，一个房间和一整个星球是完全不同的问题。覆盖度问的是模型维护了哪些相关变量，包括当前没观测到的东西。

> "A single room and a whole planet pose very different problems." —— 一个房间和一整个星球，是完全不同的问题。

- 尺度的例子：一个覆盖全球的实时模型，画面中心是上海，从卫星一直建模到天气；对比单条河流的局部模型。
- 覆盖度的例子：他自己用视频生成模型做的路口视频，四个方向都是红灯。关键是模型能不能对其他视角的红绿灯做出正确推理并持续更新；单帧局部一致的画面，对有的应用只是需求的一部分，对另一些应用已经完全够用。
- 他给出全场唯一的定义句：世界模型是关于世界如何运转的预测模型，带有一组功能，作用于某个领域，有特定的尺度、分辨率和覆盖度。他说用这几个维度再看前面那张图，就能把各候选分得很清楚。
- 他把描述性模型（如数据库）和预测性模型分开，说社区里有些"world model"的用法属于纯描述性，这次不展开。

### 4. 世界模型是推理和感知/行动之间的接口

他的论点是世界模型会定义智能如何与世界交互，这句在结尾又重复了一遍。从操作上说，agent 可以查询世界模型、拿到预测；在观测、状态估计、规划、动作的循环里，世界模型不是单独一个框，而是隐含在状态估计和规划里。

> "Operationally, a world model is an interface between the abstract reasoning and the action and perception space." —— 从操作上说，世界模型是抽象推理和行动/感知空间之间的接口。

### 5. 一种 agent 组织方式：System 2 加多个领域模块

agent 的长期身份、目标和推理放在 System 2；下层成为 System 1 模块，可以按领域划分，每个模块用自己的世界模型维护对局面的估计、指导该领域的动作。比如一个模块管物理交互（视觉、触觉、运动），另一个管数字工作流（语言和工具）。

> "The connection between the two matters just as much." —— 两层之间的连接同样重要。

- 上层推理要吸收 System 1 当前的信念，包括不确定性和失败的动作，再创建或修改实时运行的策略。
- 领域模块承担信念、状态估计、策略这些职责，不只是世界模型本身。跨领域推理和冲突消解交给 System 2，协调机制他没展开。
- System 0/1/2 的说法借自认知心理学，System 0 是控制器。
- 他也主动降调：这些框主要描述职责，在学习出来的系统里可能共享参数、在同一个网络里；这是一种建议的组织方式，不是必须的架构。

### 6. 更有意思的领域还在后面

他举的例子是"心智的世界模型"：一个人相信什么、需要什么，我们怎么借此更好地沟通、互相支持。他认为这会带来深层的对齐。结尾邀请对这些问题感兴趣的人来聊。

> "what would a world model of mind look like?" —— 心智的世界模型会是什么样？

## 存疑

- 讲者提到一个全球实时地球模型，名称没听清，"from this last Tuesday" 指的是哪天的发布或数据也不确定。
- 生成路口视频所用的视频模型名称没听清，可能是 Kling 某版本，未确认。
- 候选列表中的 David Ha 与 Schmidhuber 的 World Models、3D Gaussian splatting 都是按发音推断，需对照幻灯片。
- 录音中段有约 15 秒空白，前后句不连，可能漏掉一段。
- 他称 World Labs 的同事为"my friends at World Labs"，和议程上联合创始人的身份之间是什么关系，不确定。
- 全场没有给任何性能、收益或成本数字。
