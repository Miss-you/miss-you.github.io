---
title: "HTML is all your agents need: Redefining Context Engineering"
slug: "s19-heygen-html-is-all-your-agents-need"
date: 2026-11-06T10:25:00+08:00
lang: zh
session: "S19"
speaker: "Bin Liu"
org: "HeyGen"
stage: "主舞台"
summary: "上下文的「形状」比记忆、工具、RAG 更根本；HeyGen 把视频编辑器底下的私有 JSON 换成让 agent 直接写 HTML/CSS/JS，模型变强产品就跟着变强。"
video: ""
source: "user-recording"
draft: false
---

据作者现场录音整理，按讲者脉络转述，不是逐字稿。讲者是 HeyGen 的 VP of Engineering，负责 agentic 视频业务，英文演讲，无问答环节。中间播放了一段宣传片，宣传片旁白里的说法下文单独标出。

## 一句话

agent 的上下文该用什么"形状"，比记忆、工具、RAG 这些技巧更根本。HeyGen 把视频编辑器底下 2000 行的私有 JSON 换成让 agent 直接写 HTML/CSS/JS（开源框架 HyperFrames），因为模型最擅长、也会越来越擅长的是写代码；讲者认为产品形状顺着这个方向，模型变强产品就自动变强。

## 论断

### 1. 先问上下文是什么形状

他开场说今天不讲记忆、工具、RAG 循环这些常见的上下文工程话题，而是请大家退一步，想想 agent 的上下文应该是什么形状。整场只用 HeyGen 做 video agent 的经历当案例。

> "And think about what should be the shape of your agents context." —— 想一想你的 agent 的上下文应该是什么形状。

- 开场举手调查，台下多数人做过上下文工程。

### 2. agent 写得出私有格式，但没法在里面推理

HeyGen 最初是在已有视频编辑器上加 agent，编辑器左边是脚本，有颜色、贴纸、场景，底层至少是 2000 行 JSON。他说除非自己训模型，大多数 agent 被训练的是写 JSON，而不是写"你的" JSON。

> "Agents are really good at writing JSON, but agents actually cannot reason within your JSON, at least not to the extent that we would want it to." —— agent 很会写 JSON，但没法在你的 JSON 里推理，至少达不到我们想要的程度。

- 两段各 4 行的 JSON，对 agent 来说都没问题，渲染出来一段排版正常，另一段文字根本看不见；agent 只看那几行，不知道自己错了。
- 当时的补救是把渲染图喂回给 agent，让它发现错了再改数字。
- 团队内部的比喻：像让莎士比亚写中文诗，给他一堆例子，他也能写出看起来像诗的东西，但不会是好诗。

### 3. 把上下文换成代码和文件系统

前沿实验室的大模型写代码都很强，而且会一直强下去，所以他们把 JSON 整个扔掉，让 agent 直接写 HTML。HyperFrames 是他们今年 4 月开源的框架，agent 写纯 HTML、CSS、JavaScript，框架把它渲染成 MP4 视频。

> "So what if our entire context is built on top of code and file systems?" —— 如果我们整个上下文都建在代码和文件系统上呢？

- 心智模型：想象一个落地页，文字不停飞入飞出、翻转，有视频进场、全屏、回到中间，还有声音。你在看落地页，它也可以是视频。
- 讲者现场给的数据：约 80,000 个 GitHub star，全球安装量第 2 的 skill，日产视频约 700,000 条，一周前是 50 万条。他自己说"I actually think"，并不确定。
- 宣传片旁白给的数据不同：10 月底 HyperFrames skill 全球第 3，日产超 500,000 条，每月 15,000,000 条。

### 4. 模型本来就知道好看的代码长什么样

他回到莎士比亚的比喻：莎士比亚写剧本时就知道这是好剧本，不需要写完再读一遍（随后他自己补了一句其实也会这么做）。他列了几个正在往 HTML 和代码上迁的领域。

> "agents are really good at writing code and knows what a good looking code looks like and knows how to write it." —— agent 很会写代码，知道好看的代码长什么样，也知道怎么写。

- 文档：很多公司包括前沿实验室在用 HTML 替代文档，Claude 的 artifacts 和 GPT 的很多输出其实是代码。
- 设计：他喜欢的 AI 工具 Paper 在 HTML 上做了一个类似 Figma 的东西。
- 幻灯片：这场的整套 slides 全是 HTML，Manus、Genspark 等也用 HTML 做 slides。
- 游戏：以前靠 Unity、Unreal，现在很多人用 Three.js、JavaScript 做。
- 他说 HyperFrames 开源 22 天后 Anthropic 发了观点类似的文章，没有提 HeyGen。

### 5. 产品要顺着模型变强的方向长

他认为要问自己的是模型会在什么上持续变强，产品是乘着这股浪还是在跟它对着干。他承认自家视频被叫作 slop，"They were and they still are."，但每次模型变好，产品就跟着变好。

> "even if the team didn't do anything for the last four weeks, we will still grow because our product just got better and the models got better." —— 就算团队过去四周什么都没做，我们也会增长，因为模型变好了，产品就跟着变好了。

- 宣传片是讲者本人用 agent 做的，他没学过 After Effects、Premiere、Final Cut，也不会 CapCut。
- 结尾他借了硅谷流行的问题：模型变强 10 倍时，你的产品是变好还是被摧毁？他说答案在上下文的形状里。
- "四周什么都不做也增长"是讲者的说法，没给增长数字的比较口径。

## 存疑

- 规模数字口径不一：讲者现场说 skill 全球第 2、约 70 万条/天，宣传片说全球第 3、50 万条/天，用前需核对。
- 宣传片旁白称 Claude Opus 5.5 在 code-to-video、HyperFrames 类任务上有大量训练，这是宣传片的说法，没有来源。
- 他提到的 Anthropic 那篇 HTML 文章标题没听全，"22 天后""没提 HeyGen"是讲者的说法，未核。
- 讲者举例做短剧、电影类视频的公司时提到 MiniMax 和另一家，后者名字没听清（可能是 Seedance）；列举用 HTML 做 slides 的公司时还有一家没听清。
- 换成 HTML 之后，原来"渲染后回喂截图"的纠错回路是否还保留，他没说。
