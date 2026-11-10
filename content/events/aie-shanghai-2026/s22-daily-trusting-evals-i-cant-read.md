---
title: "Trusting Evals I Can't Read"
slug: "s22-daily-trusting-evals-i-cant-read"
date: 2026-11-06T11:25:00+08:00
lang: zh
session: "S22"
speaker: "James Hush"
org: "Daily.co"
stage: "主舞台"
summary: "写东西变便宜后谁都读不过来，开发者要从检查产出改为检查「检查者」：英文写验收标准，LLM 写代码、当裁判、扮用户，人只审裁判。"
video: ""
source: "user-recording"
draft: false
---

据作者现场录音整理，按讲者脉络转述，不是逐字稿。讲者是 Daily.co 的工程师，参与开源语音 agent 框架 Pipecat，英文演讲，约 11 分钟，无问答环节。开场中文问候和中间一小段没录全，两段演示音频的内容拿不到。

## 一句话

大模型让写东西变得很便宜，谁都读不过来，所以开发者要从"检查产出本身"改成"检查检查者"：用英文写验收标准，让 LLM 写代码、当裁判、扮演模拟用户，人只审裁判。他用一个自己看不懂中文的点奶茶语音 agent 演示了这套 eval driven development。

## 论断

### 1. 没人读得过来，要改为检查"检查者"

他开场自曝不识中文，在亚洲住了约 6 年，奶茶店菜单上百种，他只会点一种。他用这个处境类比所有人面对 AI 生成内容的处境：LLM 让写东西变得极其便宜，大家被 PR、微信私信、Slack 私信淹没，都在互相发 AI 写的东西。

> "We have to stop checking the work itself and start checking the checkers." —— 我们得停止检查工作本身，开始检查检查者。

- 他把这叫 eval driven development：他用英文写检查项，Claude 或 ChatGPT 写 Python 代码，再用 LLM 去检查别的 LLM。
- 他预测 2027 年每个应用开发者都会这样写软件，没给依据。

### 2. 点奶茶语音 agent 的三个难点

语音 agent 的管道是：Daily 传音频，STT 转文字，LLM 生成回复，TTS 转语音传回用户。Pipecat 是把这些串起来的开源、厂商无关、免费的"胶水"，STT、TTS 可以换 Deepgram、MiniMax 或中国的端侧方案。他列了三个问题：不知道该测什么，他没在奶茶店干过，上百种饮品、不同糖度冰度、顾客犹豫不决，边界情况多得难以想象；就算知道测什么，也判断不了测试本身对不对；就算看得懂，手工测语音也很慢。

> "It's because you have to do the whole conversation over and over again every time you make a small change." —— 每改一点都得把整段对话重来一遍。

- 他让 Claude 读 Pipecat 文档，约 30 分钟 vibe coding 出 V1，现场放了演示。随后他反讽说"Looks good to me"，可以直接上线了，接着说这种手工试一遍是他唯一能做的检查，远不够上线。

### 3. judge、eval、模拟器三种检查组合

他先定义 agent loop：agent 干活、检查结果，一直做到满足某个条件。他类比 TDD，只是把有明确答案的单元测试换成 LLM judge。judge 是一个 LLM，读完整段对话，回答一个是或否的问题，比如"这个语音 agent 礼不礼貌"。因为 agent 每次说的话都不一样，eval 可以跑 10 次、20 次看通过率。

> "So you could run an eval 10,20 times and see how, what percentage of time it passed a check." —— eval 可以跑 10 次、20 次，看通过率是多少。

- 脚本式 eval 像单口喜剧，笑话提前写好再背出来；模拟式 eval 像即兴表演，只给一个设定（比如"你在奶茶店柜台后面"），让它自由发挥。
- 分工：测试擅长抓问题，脚本 eval 适合查已知的具体情况，模拟用在你自己都不确定该查什么的时候。
- 他让 Claude 读 Pipecat 文档写了一个音频模拟器，模拟一个点奶茶时犹豫不决的中文顾客。生成的用例他看不懂，但成功标准可以用英文写，他只核对成功标准。

### 4. 文本模式快，音频模式才能抓到识别错误

同一套 eval 有两种跑法。文本模式不用生成音频，快得多，token 用得很少；用本地 LLM 当 judge，基本不花 token。音频模式能暴露文本模式发现不了的问题。

> "And that's an issue where a pure text mode test just would never have caught." —— 纯文本测试永远抓不到这种问题。

- 跑音频模式时他发现 STT 的 bug：他说"去冰"，有时被听成"两瓶"。
- "快得多""token 很少"是相对音频模式说的，没给具体倍数。

### 5. 机器干活，judge 查活，人查 judge

自动化之后，每做一点小改动，他可以同时跑 10、20、100 个模拟，看语音 agent 有没有变好。Claude 写检查、加功能、修 bug，又产生更多检查，形成循环。他的号召是"start thinking in loops"。

> "So machines are doing the work, judges are checking the work, and then humans check the judges." —— 机器干活，judge 查活，人查 judge。

- 他放了一段模拟对话：店员问今天想喝什么，顾客问有没有推荐，店员推荐经典奶茶、云雾乌龙奶茶等。他说这个语音 agent 做得比他自己好得多。

### 6. 适用于开发者没有领域知识的场景

同样的思路适用于任何开发者没有业务领域知识的 agent：做外呼卖保险但不懂保险，就让 LLM 扮演保险经纪；给汽修店做呼入客服但不懂车，就让 LLM 扮演修车师傅；控制机器人的语音 agent 也类似。收尾回到自己，他说现在不只会点那一种了，能点冬瓜茶，还能提冰度、糖度和外带（这几个词录音识别不清）。

> "I still can't read the whole menu, but I can order this" —— 我还是读不了整个菜单，但我能点这个了。

- 收尾句是 "build what you can't check and then check the checkers"。

## 存疑

- V1 演示音频和模拟器生成的中文用例画面没能整理出内容，需看幻灯片或视频。
- 他开场说自己只会点的那款饮品名称没听清。
