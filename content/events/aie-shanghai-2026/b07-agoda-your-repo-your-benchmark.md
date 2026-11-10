---
title: "Your Repo. Your Benchmark."
slug: "b07-agoda-your-repo-your-benchmark"
date: 2026-11-05T15:30:00+08:00
lang: zh
session: "B07"
speaker: "Roman Shirochenko"
org: "Agoda"
stage: "AI 应用分会场"
summary: "评估和改进 coding agent 的上下文，要拿自己仓库里已合并的 MR 回放当基准；别人的工具和经验换个仓库结果可能反过来，一次做不成的地方要变成修上下文的 MR。"
video: ""
source: "external-recording"
draft: false
---

据现场外部录音整理，未与本人录音对照。讲者是 Agoda（Booking Holdings 旗下）的工程经理，英文演讲，约 10 分钟的短讲，无问答环节；幻灯片未见，数字只能按口述记。

## 一句话

评估和改进 coding agent 的上下文，要拿自己仓库里已经合并的 MR 回放当基准；别人的工具和经验换个仓库结果就可能反过来，一次做不成的地方要变成修上下文的 MR。

## 论断

### 1. 已合并的 MR 就是现成的 benchmark

他开场提了两个问题：怎么评估上下文，怎么提高一次成功率。他们的做法是从 GitLab 拿已合并 MR 的工单和描述生成提示词，让 agent 重做一遍，再用原 MR 里已有的 golden tests 判对错，不另外造题。

> "let's take our merge MRs replay it again and let's learn something from it."——把已合并的 MR 重放一遍，从中学东西。

- 他说他们的大组织每年产出超过 10 万个 MR，没说是 Agoda 全公司还是某个部门。

### 2. 同一个工具换个仓库，结果可能反过来

前三轮实验都在服务 A 上做 A/B。服务 A 是一个生产服务，团队在上下文上投入很多：agent 配置、skills、架构文档。

> "we run the test against another repository this time we have completely opposite results 30% higher cost."——换一个仓库，结果完全相反，成本高了 30%。

- 第一轮：10 个 MR，A 组去掉全部上下文，B 组保留。完成率相同，带上下文的 B 组成本反而高 8%。
- 第二轮：上下文压缩工具 Headroom（GitHub 热门项目）。每任务成本降 50%，通过率也降了 30%，他说 agent 笨了三成，团队判断不值得。样本数未说。
- 第三轮：一个 AST 类工具（名称没听清），服务 A 上成本降 24%，没说通过率变没变。
- 第四轮：同一工具换另一个仓库，成本高了 30%。

他的结论是模型、工具、仓库规模、上下文一直在变，变量太多，只能专注自己的仓库。

> "there is too many changing factors models tools repository size context change all the time so we should focus on our own repositories"

### 3. 一次做不成的原因，产出成修上下文的 MR

找一次做不成的原因时，他们看三类评估：人工 review、测试、LLM 评委生成的行为检查。这些都封装进一个 skill，输出是一个 "context MR"，也就是逐步改进上下文的补丁。

- 唯一讲到的具体案例：agent 的 MD 文件写着新 contract 放 command 文件夹，agent 照做，开发者提 MR，reviewer 打回说应该放 core 文件夹，要求重做。

> "So exact case happens over the three times over the three MRs."——同样的事在三个 MR 上发生了三次。

- 没给总共找到多少处冲突，也没给改完后一次成功率提升多少。

### 4. 三条经验

- 评估框架别从零搭。他们一开始自己搭，后来发现 Harbor，是 Terminal-Bench 作者的开源项目。
- 专注自己的仓库，做渐进改进。
- 用已合并的 MR 训练你的 agent。他说这是这次演讲最想留给大家的一点。

> "you should start to use your merge MRs to train your agent."

## 存疑

- 第三轮的工具名没听清，疑为 ast-grep，也可能是某个代码图工具。
- 第二轮原话是 "Time cost per task dropped by 50%"，从上下文（这一轮目标是优化成本）看更可能指成本，不确定是否指耗时。
- 各轮的 30%、50%、24% 是相对值还是百分点没说；除首轮 10 个 MR 外，其他轮样本数没说。
- 服务 A 的上下文清单里有一个词没听清，可能是 agents.md。
