---
title: "The Good, the Bad and the Ugly: What 3,000 live sessions taught us about streaming speech-to-text"
slug: "s23-nus-streaming-stt"
date: 2026-11-06T11:40:00+08:00
lang: zh
session: "S23"
speaker: "Satvik Sinha"
org: "AICET, NUS"
stage: "主舞台"
summary: "流式语音 agent 转写出没人说过的字，主要不怪 STT 模型，而是 VAD 把音频切得太碎、又没告诉模型语言；指定语言、等更长停顿再切，能找回大部分准确率。"
video: ""
source: "user-recording"
draft: false
---

据作者现场录音整理，按讲者脉络转述，不是逐字稿。讲者是新加坡国立大学 AICET 的 AI Engineer，自称做 voice agent 两年多，英文演讲，约 10 分钟，无问答环节。他们的产品是语言学习 app 里的 voice agent 老师，流程是"听、想、说"，这场只讲"听"这一段。

## 一句话

流式语音 agent 里转写"凭空多出没人说过的字"，主要不怪 STT 模型本身，而是 VAD 把音频切得太碎、又没告诉模型语言。讲者的结论是，指定语言、让 VAD 等更长的停顿再切，能在不牺牲实时性的前提下把大部分准确率找回来。

## 论断

### 1. 流式场景里 STT 不是靠得住的组件

他开场播放了一位用户用他们的 voice agent 练中文的录音，转写里出现了"上海"，但用户其实没说；他调侃说模型好像知道他要来上海演讲。两句话里就出现了三类错：混入外文文字、写错字、漏掉没听清的词。

> "Almost one in four of our practice sessions contained text that no one said." —— 将近四分之一的练习会话里含有没人说过的文字。

- "约 1/4 会话"没给比较对象，也没说怎么判定"没人说过"。
- 题目里是 3,000 live sessions，演讲中他口头只说了 "thousands of real sessions"。

### 2. 基准上的错误率搬到自家音频上差 4 到 20 倍

他们在公开基准 FLEURS 上看到的错误率是 2% 到 7%，在自己的音频上跑同样的模型，错误率差 4 到 20 倍。他指出两点不同：FLEURS 是母语者朗读准备好的句子，他们的用户是非母语、边想边说；FLEURS 一次喂整段音频，他们的音频要先经 VAD 切段再进 STT。

> "Now, so this made us conclude that nothing was wrong with our speakers." —— 所以我们断定说话人没问题。

- 对照实验：同样的说话人、同样的模型，只改成把整段音频一次性喂进去，结果和基准一致，也不再出现外文文字。
- 没说具体是哪些模型，错误率是 WER 还是 CER。

### 3. 段太短，语言一猜错，后面整段都错

STT 模型由编码器和解码器组成，编码器听音频，解码器是逐 token 写文字的语言模型，写出的第一个 token 就是语言。对很短的音频段，一旦语言猜错，后面所有 token 都按猜错的语言写。每个 token 取决于前面已预测的 token 和能看到的音频段，段越大，上下文越多。

> "And the first token that it transcribes is the language." —— 它写出的第一个 token 就是语言。

- 把开场那段录音过一遍线上管线：用户不流利、停顿多，VAD 切出很多很短的段，不同 STT 模型对这些短段给出了不同语言的转写。
- 挑出用户说 "hope" 的那一小段：不告诉语言、不给上下文，人也猜不出；各模型给出的不同语言的词，发音都和原音很接近。
- 由此他提出两个关键设置：语言，以及音频段长度。

### 4. 62% 到 82%：语言补 11 个点，上下文补 9 个点

在同一批音频里改变段长，从实时切出的段一直到整段录音，准确率从 62% 升到 82%。但不能等整段录完再转写，否则对话就不再是实时的。

> "that gap is the context, and we don't need to feed in the entire context to these models." —— 那部分差距是上下文，而我们不需要把完整上下文都喂给模型。

- 告诉模型该用什么语言转写，能补回这 20 个点里的 11 个点；剩下 9 个点是上下文。
- 他指着图里 2 到 8 秒段长的区间说那里已经能看到 "a sharp"……，后半截没录清，大概是说准确率明显上升。
- 没说是哪个模型、多少条音频、准确率怎么算。

### 5. 做法：用自己的音频评测，指定语言，让 VAD 多等一会儿

不换模型，改管线上游：让 VAD 等更长的停顿再切，而不是在第一个短停顿就切，攒出更大的音频段，给模型更多上下文。他类比人在嘈杂房间里漏听一个词，会用听到的整句补上。

> "run your models on your users' audio, tell them the language they're supposed to transcribe it and let it hear more of the audio." —— 在你自己用户的音频上跑模型，告诉模型要转写成什么语言，让它多听一点音频。

- 没给调 VAD 后的实测数字，也没说停顿阈值调到多少、对延迟有多大影响。

## 存疑

- 讲者结尾提到的公司或产品网址没听清，议程上的机构是 AICET, NUS。他们 app 里 voice agent 老师的名字拼写也待确认。
- 62%、82%、11、9 个点等数字没给模型、样本量和准确率口径；"2% 到 7%""4 到 20 倍"也没说是哪些模型。
- 他说的"第一个 token 是语言"的解码方式没有点名具体模型。
