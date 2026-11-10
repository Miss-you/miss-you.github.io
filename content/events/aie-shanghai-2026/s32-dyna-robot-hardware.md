---
title: "Building Robot Hardware for Rapidly Evolving Models"
slug: "s32-dyna-robot-hardware"
date: 2026-11-06T16:05:00+08:00
lang: zh
session: "S32"
speaker: "Zhong Shen"
org: "DYNA"
stage: "主舞台"
summary: "通用机器人硬件跟不上模型每周一次的迭代，所以硬件不该追模型，而应做成可预测的稳定接口；DYNA 新机器人弃谐波、改用行星减速器就是按这条原则选的。"
video: ""
source: "user-recording"
draft: false
---

据作者现场录音整理，按讲者脉络转述，不是逐字稿。讲者是 DYNA 的硬件负责人，英文演讲，约 14 分钟，无问答环节。演讲大量依赖幻灯片上的曲线图，这里只有口头描述，图上的数值看不到；总结页开头约 20 秒没有记下来。

## 一句话

讲者认为通用机器人的硬件跟不上模型每周一次的迭代，所以硬件不该追模型，而应该做成可预测的稳定接口：动起来模型能预测，传感反馈模型能信。他用 DYNA 新机器人放弃谐波减速器、改用行星减速器的选型来说明这条原则。

## 论断

### 1. 通用机器人夹在两类传统机器人中间

传统上机器人有两种用途。工业机器人为精度、耐用和定义清楚的生产任务而造，机械设计偏重刚度，负载自重比低。研究平台优先追求突破，其次才是鲁棒性和成本。

> "So one side, we do need to enable new capabilities, so that we could unlock new applications and also deployments. And on the other side, we do need to care a lot about the durability and also the cost of the robots"

——一方面要解锁新能力，才能打开新应用和部署；另一方面要非常在意耐用性和成本。

- 工业侧的例子是研究界常用的某款机械臂，他说它的负载自重比比现在的人形机器人手臂低，没给人形手臂的数。
- 研究侧的例子是 NASA 2016 年前后造的一款人形机器人，据报道成本约 200 万美元。他说现在机器人成本已大幅下降，但研究平台"先突破、后成本"的假设仍然成立。

### 2. 模型每周迭代，硬件半年只能改一两次

传统产品的软硬件节奏也不一样，但通常在项目开工前就能在一份定义清楚的需求上对齐。通用机器人目标场景太多，很难定义一份长期不变的需求。

> "If we assume we have a weekly updated model for 24 weeks. And that means we have ... at least 24 opportunities to change that model set up to try new ideas. But at the same time, I think we can only afford one or two major hardware revisions."

——假设模型每周更新一次，24 周就是至少 24 次试新想法的机会；同一时间里硬件只付得起一到两次大改版。

- 他设了一个情形：模型团队在第 12 周验证了一个好点子，想让硬件配合改，这基本不可能。这是假设情形，不是实测。
- 所以硬件需求必须足够清楚，又能跨几年的模型迭代保持有效。

### 3. 答案是可预测的硬件设计

他说的可预测有两层：硬件的行为模型能预测，同时兼顾鲁棒性和成本；硬件平台是一个稳定的接口，让快速演进的模型都能用。落到具体问题上也是两个：运动，硬件的动作和响应要能被模型预测；传感，反馈要可靠地反映真实物理状态。传动同时影响运动和传感，所以他拿传动选型举例。

> "So in short, we want to design a hardware to narrow the sim-to-real gap so that hardware can actually last long enough for fast evolving models."

——简单说，我们要设计能缩小 sim-to-real 差距的硬件，让硬件撑得够久，跟得上快速演进的模型。

### 4. 运动侧：弃谐波，用行星

DYNA 刚发布了新一代机器人，他说看过 demo 的人可能没注意到，用的是行星执行器而不是谐波减速器。理由两条：尽量降低传动内阻，让执行器模型更简单直接。

> "we actually use planetary actuators over harmonic drives."

——我们用的是行星执行器，而不是谐波减速器。

- 他引用已发表的研究说，同样的电机、相近减速比下，谐波减速器的内阻约为行星的两倍，没说出处。
- 谐波难建模有两个原因：一是迟滞，里面有柔性齿轮，变形不只取决于当前扭矩，还取决于之前的加载历史；二是内阻随动态负载和温度变化。
- 内部测试：同一个 RL 策略走一个简单的圆形轨迹，分别在仿真和实机上跑，比较左右手的位置。他特意强调，从仿真到实机，跟踪均方根误差只增加了 1.3 毫米。没给谐波方案的对照数，所以这个数字说明行星方案的 sim-to-real 差距小，并不直接说明比谐波好。

### 5. 传感侧：用好建模的传动估力，不加关节力矩传感器

大多数机器人应用是接触密集的操作，手臂和末端是和物理世界交互的核心，需要力反馈引导行为。可以给机器人加关节传感器，但他说为什么选了另一条路超出本次范围，只讲扭矩透明度。

> "by having a very simple and easier to model ... transmission, we can actually have a accurate enough actuator model to give us a very accurate joint torque estimation and thus to give us a very good external force estimation."

——传动简单好建模，执行器模型就够准，关节力矩估得准，外力估计也就好。

- 仿真测试：在手腕和肘部各施加 y 轴 15 N 外力，估计的均方根误差手腕约 1.39、肘部约 8。作为参照，他给了一个最新文献基线约 1.05，基线是什么方法没听清。
- 他两次强调这只是仿真结果。

## 存疑

- 新一代机器人的产品名没听清，需对照 DYNA 公开资料。
- 工业机械臂的型号和它的负载自重比数值没听清。
- NASA 那款人形机器人的型号和年份需回放确认。
- 力估计误差的单位按语境应为牛顿；肘部的"8"可能是 0.8 或别的数；文献基线可能和六轴力传感器方案有关。总结页开头那段没记下来，可能漏了这组对比的结论。
