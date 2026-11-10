---
title: "Kubernetes Is Not Your Sandbox"
slug: "s10-daytona-k8s-is-not-your-sandbox"
date: 2026-11-05T14:50:00+08:00
lang: zh
session: "S10"
speaker: "Mislav Ivanda"
org: "Daytona"
stage: "主舞台"
summary: "Kubernetes 为长期运行的 Web 服务设计，agent 沙箱要的是短命但有状态；在 K8s 上硬做有状态沙箱会掉进外挂存储的坑，讲者建议交给专门的沙箱服务商。"
video: ""
source: "user-recording"
draft: false
---

据作者现场录音整理，按讲者脉络转述，不是逐字稿。讲者是 Daytona 的 Developer Experience Engineer，英文演讲，约 14 分钟，无问答环节。他多次引用幻灯片上的对比表和柱状图，只念了一部分数字，没念的这里没有。

## 一句话

Kubernetes 是为长期运行、可恢复的 Web 服务设计的，agent 沙箱要的是"短命但有状态"，两者需求相反；他认为在 K8s 上硬做有状态沙箱会掉进外挂存储的坑（IOPS、挂载耗时、单节点密度都变差），所以应该用专门的沙箱服务商，而不是自己在 K8s 上搭。

## 论断

### 1. 沙箱的用途一直在变

他说做 agent 的公司迟早要一个隔离环境，跑 agent 生成的代码、给 agent shell，然后就去找基础设施团队要一个 K8s 集群。他先声明不是来骂 K8s 的，Daytona 自己的控制平面也用 K8s。他认为沙箱没有精确定义，因为变得太快，给出的演进顺序是：

- 最早 agent 只用沙箱跑生成的 Python 代码或脚本；
- 模型变强后需要 shell 访问；
- 整个 agent 搬进沙箱，沙箱成为 agent runtime；
- 大约半年多以来，同时拉起几千上万个带 agent 的沙箱，用在强化学习、benchmark、模型训练和微调上；
- 对没开放 API 的应用，出现了 computer use agent，需要整台电脑级的环境，随后同样被大规模并发跑 RL。

### 2. agent 的需求和 K8s 的设计目标相反

K8s 2014 年发布，主要目标是大规模、可靠地跑容器，出错能恢复、能不停机更新，适合长期运行的 Web 服务。agent 正好相反：第一要有状态，暂停一个 agent 两天后再接着做，沙箱里的东西要全都还在；第二大多数任务很短，按需拉起，干完就关。

> "So agents need, No. 1, statefulness to preserve their work." —— agent 第一需要的是有状态，保住它们的工作。

### 3. 沙箱服务商要做三件事

他把沙箱服务商的工作分成三根支柱：

- 基础设施：性能、吞吐、并发。
- 原语：fork、快照这类跟基础设施耦合的功能。
- 工具：给 agent 合适的工具，同时防止 agent 干蠢事，比如泄露密钥。

他说重点不只是开发体验，还有性能和成本，成本他认为是 AI 领域的第一需求。

### 4. K8s 起 pod 要走一串串行步骤

即使不考虑状态，K8s 起一个 pod 也要按顺序走一串步骤。

> "And at best, you'll get running pod of sandboxes in one or two seconds, but mostly it'll be in orders of tens of seconds." —— 最好 1–2 秒能跑起来，多数是几十秒。

- 因为串行，吞吐大约每秒 100 个沙箱；单节点能放约 110 个。
- 幻灯片上有和 Daytona 启动时间的对照，Daytona 的具体数字他没念。

### 5. Daytona 避免冷启动的三个做法

> "When the sandbox run and stop, it isn't deleted or wiped out." —— 沙箱停了不删也不清空。

- 沙箱停了留在 runner 机器或缓存存储上，下次恢复只是启动容器；调度优先选已经存了这个镜像的节点，避免从镜像仓库拉镜像。
- 某个快照被大量、频繁使用，就推到更多 runner 上；没人用的下线，从节点清掉省空间。
- 只传差量不传整个镜像，冷启动也能很快。
- 三项都没给各自的收益数字。

### 6. 有状态的陷阱在外挂存储

想在 K8s 上有状态，就得挂外部存储，所有文件系统操作都走网络。他说"this is the trap"，并逐项给了代价：

- IOPS：Daytona 上接近原生，约 50 万；K8s 挂 EBS 约 5 到 6 万。
- 外部卷挂到 pod 所在节点通常要 3 到 19 秒。
- 挂载出错后要等 6 分钟才能重挂。
- 单节点只能挂 25 到 39 个卷，而单节点能放约 110 个 pod，密度降到约三分之一。
- 一个卷只能给一个 pod 用，不能多沙箱共享。
- 要显式选择保存哪些路径，默认不保存；Daytona 默认全部保存。

### 7. 自测基准：耗时少 36%，成本低 2.7 倍

基准分三档：0 档只跑 sleep 命令，测启动时间；1 档做轻量 CPU 和文件系统操作；2 档给 agent 一个真实的 SWE 任务。

> "So running the same workload on Daytona versus these other companies options takes 36% less time." —— 同样的负载，Daytona 比其他公司的方案少用 36% 时间。

- 36% 的比较对象没在录音里点名，应在柱状图上。他说图上是单条轨迹的结果，几千上万条并发时差距会累积。
- 成本：1000 个沙箱，相当于一个月每天朝九晚五地跑，在 Daytona 上成本低 2.7 倍。他的上下文是波峰型负载自建基础设施闲时也要付钱，沙箱服务商按运行时长计费；句子在比较对象处断了。
- 这是 Daytona 自己做的基准，没给测试条件。

### 8. 沙箱别自己造

他用自建认证系统类比：自己搭沙箱没那么简单，一旦搞砸，密钥泄露，整个产品可能就完了。

> "You should trust people that are experts in this field" —— 应该交给这个领域的专家。

## 存疑

- 1000 个沙箱的总时长听成"47,176 小时"，按"一个月每天朝九晚五"算更像 176 小时，需回放。
- 2.7 倍的比较对象没说完，36% 的对手名单没念，都要对照幻灯片。
- "3 到 19 秒""25 到 39 个卷"这两个范围可能听错，需回放或对照幻灯片。
- 他描述 K8s 适合"long running web stateful services"，后文又说 K8s 是无状态的，原词疑为 stateless。
- 三个避免冷启动做法的英文名称没听清。
