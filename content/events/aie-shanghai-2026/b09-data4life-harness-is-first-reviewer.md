---
title: "The Harness Is the First Reviewer"
slug: "b09-data4life-harness-is-first-reviewer"
date: 2026-11-05T15:50:00+08:00
lang: zh
session: "B09"
speaker: "Peter Hoffmann"
org: "Data4Life Asia"
stage: "AI 应用分会场"
summary: "两个人用 agent 重写十年历史的医疗研究应用 OHDSI Atlas，写出的代码审不完，靠 spec、旧系统对照、CI 关卡和截图检查先审一遍；最关键的是检验 agent 写的测试本身。"
video: ""
source: "external-recording"
draft: false
---

据现场外部录音整理，未与本人录音对照。讲者是 Data4Life Asia 的工程负责人（议程标 SVP Engineering），也是这次重写项目的发起人，英文演讲，无问答环节；幻灯片未见，只能从口述还原。

## 一句话

用 agent 重写一个约十年历史的医疗研究开源应用（OHDSI Atlas，Knockout.js 换成 Vue.js）时，两个人写不出也审不完的代码量，要靠一套围绕代码的 harness（spec、旧系统当 oracle、CI 关卡、截图视觉检查）先审一遍。其中最关键的是检验测试本身，因为 agent 写的测试会作弊，覆盖率高不等于真的在测。

## 论断

### 1. 问题是不逐行看代码时怎么知道写对了

他说这次讲的不是应用本身，而是怎么用 agent 构建应用、怎么验证它是对的。在 Atlas 这类应用里，一个 bug 会直接让研究结论不可靠。

> "how do you actually verify the generated code without basically reviewing every single line of the code."——不逐行审代码，怎么验证生成的代码？

- Atlas 是 OHDSI 的开源应用。研究人员在界面上拼筛选条件建患者队列，前端发 JSON 给 Web API，后端转成 SQL 查库。一个改了 JSON 的 bug 会立刻得到错误的患者队列。
- 旧版 Atlas 2 用 Knockout.js，用了约十年。他们用 Vue.js 从零重写，同时改视觉设计和用户流程，因为旧版对新用户难用。后端也换了技术栈，但本场只讲前端，他认为 UI 比定义明确的后端更难。
- 将近 300 个 PR，两个人做，代码多到没法逐行人工审。
- 旧版只有 5 个工具类测试，所以 harness 要和产品同步从零建，测试也让 agent 写。

### 2. harness 分两半，验证这一半要自己建

agent 一侧是指令、skill、权限、subagent，基本用现成的 Claude Code 和 skill 框架。验证一侧要围绕代码自建，由四个组件组成：spec、oracle（旧系统）、CI 关卡、截图视觉验证。

> "especially for verification, I think you need to basically have the harness around the code."

- 流程：先写 spec 交给生成代码的 agent，另外三个组件负责验证，最后人做终审。
- spec 他说没什么新鲜的。变化在于以前给 agent 很详细的上下文，现在用新模型时重点是讲清楚做成什么算完成，也就是验收测试。
- UI 改动在 spec 之前多一步：让 LLM 为具体改动出几版 mockup，选一个，按反馈再迭代一轮。一是确认样子是想要的，二是让 AI 提出易用性改进。

### 3. 拿旧系统当 oracle，跑真实样本

OHDSI 网络里有 1000 多个已发布、已验证的定义。他们把这些定义上传到新前端，做导入、导出、修改后再比对，确认 Atlas 2 和 Atlas 3 结果一致。

- 起因是转换器有个 bug，结果和旧版不一致。他们没有只修这一个，而是建起整类自动比对，之后又发现了转换器的其他 bug，以及前端表示数据结构的方式有问题。没说发现了几个。

> "instead of basically just solving, um, that specific issue, we uh, thought about, okay, how can we ensure that in the future the agents are um, detecting these kind of issues automatically."

### 4. agent 写的测试要再检验

CI 关卡包括类型检查、lint、单元测试、端到端测试。但他们发现 agent 有时会作弊，写出永远通过的测试，于是加了两层：静态检查抓恒真测试，变异测试（对源代码做小改动、故意引入 bug，看测试会不会失败）量测试到底能抓住多少问题。

> "we noticed that the agents are sometimes in a way cheating and basically creating tests which are always true."

- 一个组件的行覆盖率近 90%，变异测试发现只有不到 15% 的改动被测试抓到。
- 把变异测试结果交给 agent 去补测试后，现在整个仓库覆盖率约 98%，变异测试通过率 70% 以上。全仓库改进前的数字没给，只有那一个组件的前值。
- Vue.js 的编译器宏没法做变异测试，会单独标出来；新代码靠覆盖率报告保证一定有测试。

### 5. 截图验证兜底，能写成测试的别交给 LLM 判断

测试过了之后，他们还让 agent 实际操作应用、截图、解读截图，检查是否符合预期。做截图验证时要明确告诉 agent 怎么判断截图对不对。没举截图验证发现了什么问题的例子。

> "if you can basically do a deterministic check. So if you can do a test. I think that's always, I mean, more reliable over time than if you basically let the LLM decide is something correct and answer."

### 6. 人管意图和取舍，harness 管契约

> "So what stays human is the intent."——留给人的是意图。

- 人这边：说清要做什么、什么算完成；UI 代码里很多是审美问题，没有绝对对错，让 agent 出方案、人来选；源代码结构上 agent 的某些建议不够长远，人做了干预。
- harness 这边：lint、类型检查、和旧系统的比对、测试以及"测试有没有意义"的检查、视觉验证。

他列了三个还没解决好的缺口：

- 环境假设：遇到过时区相关的 bug、不同浏览器结果不同，CI 只在一种环境里测得比较好。
- 关卡不可靠：有环节超时，harness 没自动发现；CI 里有网站访问不到之类的基础设施故障。他说关卡要在出问题时稳定地失败，多数能再花功夫纳入 harness。
- 判断：出过计算结果错误的 bug。单问 AI "这个结果对吗"它大概能发现，但很难写成通用规则保证每次都抓住。他认为这一项可能最重要。

### 7. 这套办法的适用边界

他说，有参考实现、输入结构化、样本多、测试框架好时，用 LLM 生成代码并验证新旧一致是可控的。

> "using LLMs to, to generate the code and validate that the new implementation matches the old implementation is, is, um, quite manageable."

- 做全新产品时，关键是用合适的细节粒度说明方案长什么样；UX 有一部分是审美，更适合让人多参与。
- 只在生产环境出现的行为更难测，要额外围绕它建 harness。
- 结尾三条：spec 在合适的粒度上写清楚；agent 写的测试要再测一遍；有旧系统就拿它对照，不是重写也值得为问题的某些部分找一个参考实现。

### 附：社区 issue 也让 agent 先处理

项目收到 163 个 issue，对两个人来说已经很多。agent 每天扫描仓库里的新 issue，查知识库、起草回复，小 bug 直接开 PR，人只审回复和 PR。没给回复采纳率或 PR 合并率。

## 存疑

- 代码规模：原话里源代码和测试代码的行数读法不清，数字疑似丢位，需对照幻灯片或项目仓库。
- 1000 多个"已验证的定义"，按 OHDSI 语境疑为 cohort definitions，原话不完全清楚。
- "above 70% of the mutation tests are succeeding" 中的 succeeding，按语境理解为变异被测试抓到的比例，原话没定义。
