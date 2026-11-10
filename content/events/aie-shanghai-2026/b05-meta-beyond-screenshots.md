---
title: "Beyond Screenshots: Building Agent-Native Verification for Mobile Apps"
slug: "b05-meta-beyond-screenshots"
date: 2026-11-05T14:55:00+08:00
lang: zh
session: "B05"
speaker: "Peng Gong"
org: "Meta / Instagram"
stage: "AI 应用分会场"
summary: "手机验证智能体只靠截图点屏幕不够用，要让 app 对智能体可观测、提供语义化操作，再用确定性流程加 LLM 搭验证智能体，接进编码内循环和 CI。"
video: ""
source: "external-recording"
draft: false
---

据现场外部录音整理，未与本人录音对照。讲者来自 Meta 的 Instagram Edits 团队（Edits 是一款视频剪辑 app），英文演讲，无问答环节。他因时间原因被叫停，最后一页没讲完；幻灯片内容只能从口述还原。

## 一句话

手机上的验证智能体光靠截图、像用户一样点屏幕不够用。要把 app 改造成对智能体可观测（暴露语义和内部状态），并提供语义化操作（CLI 一步完成复合手势），再用"确定性流程 + LLM"搭成验证智能体，它才能接进编码内循环和 CI 外循环，并靠自己的失败记录持续改进。

## 论断

### 1. 截图式操作只够做简单任务

智能体已经能操作手机：打开显示设置这类简单任务，它截图、找元素、点击、看反馈、决定下一步，做得很好。但视频剪辑 app 有三类东西靠截图做不了。

> "And agent is pretty bad at gestures, especially especially like the multi-finger gestures or a combination of gestures." —— 智能体很不擅长手势，尤其是多指手势和组合手势。

- 手势：比如双指缩放贴纸。
- 组合手势：拖放要先长按某个组件约一秒，再拖动、移动、在指定位置放下；智能体不知道怎么把这些动作串起来，每一步都要同步。
- 隐藏状态：点了导出按钮，界面上看不出导出是否完成、文件是不是 1080p 30fps、有没有内部错误。

### 2. 第一招：让 app 可观测

要让智能体做真正的工程工作，得给它一个工程视角：在界面之上提供无障碍树、组件语义，暴露 app 状态和输出文件的配置，开放日志。验证导出时，查 app 状态判断是否完成，去存储里检查文件规格，查日志看有没有内部错误。

> "by making the app observable we providing an engineer's view to the agent so agent can operate the app much more efficiently more like a developer instead of a normal user" —— 让 app 可观测，智能体就能像开发者而不是普通用户那样操作。

- 真实案例：把视频调成 2 倍速。用户拖一下滑块就行，智能体不知道滑块百分比和速度值怎么对应，只能左右反复试，大约 10 次工具调用，耗大量 token 和截图。在 Android Jetpack Compose 的滑块上声明 semantics，告诉它哪个百分比对应哪个速度，之后一两次调用就能完成。
- 他说据他们的评估，工具调用平均从 38 降到 9，token 减少 90% 以上。评估集和任务数量没给。

### 3. 第二招：语义化操作

有些情况光有可观测性不够。重排片段需要长按、拖拽、放下，即使有测试 ID 和无障碍树也帮不上多少。他们最后做了一个 CLI，传入片段 ID 和目标位置索引，智能体一次工具调用就完成重排，并通过 CLI 的返回确认操作是否完成。

> "And it can verify if the action has finished by the CLI response here" —— 它还能通过 CLI 返回确认操作是否完成。

### 4. 验证智能体由确定性流程和 LLM 组成

构建、安装、登录、准备测试素材、确认功能开关正常，这些是确定性的，不用 LLM，以免浪费 token；结束后的清理也是确定性的，保证每次验证相互隔离。LLM 只负责把自然语言任务翻译成 CLI 调用，并逐步检查返回。

> "those setups we do not need LM because those are deterministic and we don't want to waste the tokens here" —— 这些准备步骤是确定性的，不需要 LLM，不想浪费 token。

- 例子：任务是"用两个 1080p 片段创建剪辑项目，以 1080p 30fps 导出"，LLM 把它拆成创建项目、选两个视频、设导出参数、开始导出几个 CLI 动作，每步检查返回。

### 5. 内循环、外循环和大规模测试

有了验证智能体，编码智能体写代码时由它检查产出，就能自己修（内循环）；每个符合条件的变更都在 CI 上跑验证（外循环）。它还能做原本人力做不了的大规模测试和审核。

> "the agent is actually being able to run 70 hours continuously and making around 2,000 screenshots and have over 200 findings with evidence" —— 智能体连续跑 70 小时，约 2,000 张截图，200 多条带证据的发现。

- 视频特效：过去 QA 人力有限，每周只能测 15 个特效。现在用 for 循环脚本逐个调用验证智能体，再由一个 validator 检查输出，原本大约八周的测试压到约三小时。
- 印地语审核：约 4% 的用户用印地语，他自己不懂印地语。让智能体遍历 app 各页面和流程，对照英文和印地语界面检查，产出报告，由工程师和内容设计师复核。原本估计要一个季度，现在约两周。上面 70 小时、200 多条发现就是这项工作；多少条复核成立没说。

### 6. 验证智能体能自我改进

智能体能读自己过去的遥测，找出缺了什么，比如缺某个测试 ID 或某个语义操作。另一个智能体每天扫失败记录，提出改进的 diff，由人审后合入。他把这叫作 flywheel。

> "we have the another agent basically scanning all those failures every day and then proposing those diffs those commits to improve the agent and the human will review those those diffs"

- 一个月内，他说的 conclusive（疑指能给出明确结论）的验证比例从约 10% 升到约 55%，比较对象是刚上线时。
- 现在每天跑 1,000 到 2,000 次验证。

### 7. 闭环之后人的角色（未讲完）

他说过去你一停，工作就停，项目进度受你自己的执行速度限制。验证闭环以后，人负责验证、给智能体排障和做计划，智能体持续执行。他放了一段用 Claude Code 做的视频，展示引入智能体之前一天的线性日程：调研、开会、写码、午饭、测试、修 bug、一对一。讲到下一页时被叫停。

> "Now responsible for doing the verification and unblock the agent and doing the planning and the agent will keep doing those execution"

## 存疑

- "工具调用平均从 38 降到 9"的原话含糊，也可能是"平均减少 38%"之类，评估集也没说明。
- 第 6 条的"明确结论比例"原词疑为 conclusive verdict rate，讲者没有定义。
- 重排片段的 CLI 名称没听清，疑为 edits。
- 第 7 条没讲完，最后一页的观点缺失。
