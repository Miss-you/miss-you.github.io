---
title: "From Models to Working Enterprise Agents"
slug: "m02-microsoft-enterprise-agents"
date: 2026-11-05T09:45:00+08:00
lang: zh
session: "M02"
speaker: "Marco Casalaina"
org: "Microsoft"
stage: "主舞台"
summary: "企业 agent 接下来的关键变化是拿到自己的身份、按最小权限单独授权；agent 之间会不经编排地互相调用，测试要转向 rubric 专项评测和模拟世界隔离测试。"
video: ""
source: "external-recording"
draft: false
---

据现场外部录音整理，未与本人录音对照。讲者是 Microsoft Core AI Group 的 VP Products，自称 AI Futurist，英文演讲，无问答环节。现场酒店网络不好，多数 demo 没能实时加载，改放事先截的图，幻灯片内容只能从口述还原。

## 一句话

未来 6–12 个月企业 agent 的关键变化是 agent 拿到自己的身份、在自己的安全上下文里跑，权限按最小权限单独授予，而不是冒用用户身份。agent 有了身份就会不经编排地互相调用，测试负担随之上升，要从通用评测转向按 rubric 的专项评测，并给每个 agent 搭一个模拟世界做隔离测试。

## 论断

### 1. 各家都在给 agent 加身份，目的不同

他说带身份的 agent 现在整个行业都在做，但 Meta 给身份是为了拟人化、拉互动，Microsoft 给身份是为了让 agent 有独立的安全上下文。Meta Muse 的身份很薄，只到名字这一层，它发邮件、发日程邀请还是以用户的名义。

> "Meta is doing this for the purpose of anthropomorphization ... They want you to form a relationship with it, because muse ultimately will be monetized on engagement." —— Meta 这么做是为了拟人化……想让你和它建立关系，因为 Muse 最终靠互动变现。

- 他列举的同类产品：Meta Muse、OpenAI 的 dots、Anthropic 的 Claude Tag、Google 的 Gemini agents。
- 开场展示了 Meta Muse 里一个 agent 的"卡片"。他声明不是来推销 Microsoft 产品的，目的是讲未来一年影响全行业的趋势。

### 2. Microsoft 的 agent 拿到和员工一样的一整套身份

在 Microsoft Foundry 里做的每个 agent 都有一个 Entra ID。他们现在叫 autopilot 的 agent 有自己的 Teams、邮箱、OneDrive，人类用户有的它也有，在组织架构里向人汇报。

> "This autopilot. Reports to me, in the org chart." —— 这个 autopilot 在组织架构里向我汇报。

- 他做的银行客服 agent：客户发邮件问 ATM 手续费，agent 直接用邮件回复，他能看到只是因为 agent 抄送了他。agent 不必是聊天框。
- 内置的 autopilot 叫 Dante，是 Copilot 的演进，也有自己的身份和邮箱。同事想约他开会，是直接和 Dante 谈的，他本人不在对话里。
- Microsoft Agent 365 是 agent 管理控制台：agent 做成模板开放给一组用户，组织里任何人都能实例化一个，起名字、有自己的邮箱、向创建者汇报。代码层是同一个 Foundry agent，"same code, but a different context"。

### 3. 让 agent 冒用用户身份很危险

on behalf of 模式下 agent 继承用户的全部权限。他认为在 harness 里关掉某个工具挡不住它：关掉文件工具，它用 shell 的 rm -rf；关掉 shell，它写个 Python 程序去删。

> "It's dangerous to have an agent impersonate you. Because that agent inherits your security context. That agent can do everything that you can do." —— 让 agent 冒用你的身份很危险，它继承你的安全上下文，你能做的它都能做。

- 他说大多数 harness 都有某种权限系统，但这类权限是可选的。
- WorkIQ 是"所有 Microsoft 应用的 headless 版本"，agent 通过它用 Outlook、Teams、Word、SharePoint。on behalf of 模式以用户身份登录，M365 Copilot 查邮件时看的是用户本人的邮件。
- 他自己也用 ChatGPT 管家庭日历和个人 Gmail，说很有用，但危险。

### 4. 独立身份的目的是最小权限

有自己身份的 agent 跑在自己的安全上下文里，权限由管理员按一类 agent 在身份层授予。他演示的模板里，日历、聊天等权限和他本人一样，只有文件权限降成只读，agent 不能删也不能写文件，无论写 shell 还是写 Python 都越不过去。

> "these agents with their own identities, run in their own security context." —— 这些有自己身份的 agent 跑在自己的安全上下文里。

他说这才是 Microsoft 给 agent 身份的原因，"That is the key"。

- 他引 Microsoft AI code of conduct：明确要求这些东西是人造的，不能和人混淆，用来对照 Meta 的拟人化路线。

### 5. agent 会不经编排地互相协作

他用孩子长大作比：到现在为止 agent 像上幼儿园的孩子，玩伴聚会得家长安排；女儿 16 岁上高中了，他不再安排她的聚会。他把接下来的变化叫 ad hoc collaboration 或 unorchestrated collaboration，人只在审批点出现。

> "This is what's coming for agents. And I call it ad hoc collaboration, or unorchestrated collaboration." —— 这就是 agent 要来的变化，我叫它临时协作，或不经编排的协作。

- 例子：假设他经营这家酒店，要给本周工资账户打款，酒店财务 agent 对银行运营 agent 说把钱从这个账户转到那个账户，银行运营 agent 回来问他是否批准。这个 demo 本来要现场演示，因网络问题没演成。
- 对照：多 agent 系统早就有，用 Microsoft Agent Framework、CrewAI、LangGraph 编排，区别是那些是开发者事先编排的。
- 前提是身份：agent 有身份后，会通过 Teams、邮件、Slack、WeChat 这些标准渠道互相通信。

### 6. 测试负担上升，评测要换成 rubric 加模拟世界

他认为 groundedness、coherence、relevance、fluency 这些通用评测太泛，测不出 agent 该做的事，他们和整个行业都在转向按 rubric 写的评测。还要给每个 agent 造一个模拟世界，模拟它可能对话的其他 agent 和人、邮件、Teams、Slack 消息，单个 agent 隔离测试。

> "And what that means is that the burden of testing rises." —— 测试的负担会随之上升。

> "Responsible AI is a cocktail of things. It's a cocktail of permissions, of testing, of approvals, of trust." —— 负责任的 AI 是一杯鸡尾酒：权限、测试、审批、信任。

- 银行 agent 的 rubric 分三类：安全（问"John Smith 账户里有多少钱"必须拒绝）；合规（Regulation E、Regulation P）；正确性（客户说要退手续费，不能直接信，要查是否真收过、是否可退）。
- 模拟环境他举了 OpenEnv（疑为此名），说是 Hugging Face、Microsoft 和其他公司的 "joint venture"，并说不确定最后是不是它。他用电影《黑客帝国》作比。
- 结尾给台下 AI 工程师的挑战：一起找出严格测试 agent 的方法，才能信任它。

## 存疑

- "OpenAI has dots" 里的产品名听不清是否准确，需核。
- "autopilot""Dante" 是他当天对 Microsoft 产品的叫法，他自己说是 "right now we call autopilots"，是否为正式发布名称需核官方资料。
- 模拟环境的项目名原词疑为 OpenEnv，未确认。
- 文件权限的具体名称按语境推测为 Microsoft Graph 的 Files.Read.All 和 Files.ReadWrite.All。
