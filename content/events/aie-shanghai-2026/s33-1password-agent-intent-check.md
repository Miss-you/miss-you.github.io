---
title: "Should This Agent Be Allowed to Do That?"
slug: "s33-1password-agent-intent-check"
date: 2026-11-06T16:25:00+08:00
lang: zh
session: "S33"
speaker: "Grace Li"
org: "1Password"
stage: "主舞台"
summary: "agent 的意图落在每次工具调用上，应在执行前用本地、低延迟的意图裁判按用户任务判定；她的实验里约 4 亿参数的判别类小模型明显准于生成式小模型，拿不准时转人工。"
video: ""
source: "user-recording"
draft: false
---

据作者现场录音整理，按讲者脉络转述，不是逐字稿。讲者是 1Password 的 Senior Principal Applied AI Engineer，英文演讲，约 12 分钟，无问答环节。录音有几处中断，开场例子的铺垫、实验数据集的描述和 demo 后半段不完整。

## 一句话

agent 的意图体现在它提出的每一次工具调用上，而 agent 自己给的理由不一定可信，所以要在调用执行前，用一个本地、低延迟的运行时意图裁判拿用户任务去判这次调用。她的实验结论是，约 4 亿参数的判别类小模型比生成式小模型准得多；拿不准时要升级给人，阈值要按模型单独校准。

## 论断

### 1. 意图落在工具调用上，agent 的理由不一定可信

她用一个排障场景开场：用户让 agent 查结账服务为什么从上周起一直失败。第一个调用是只读的，授权后执行；agent 看完日志认为资源不足，接着提出更新这个服务。任务是"查"，提出的动作却是改生产账户。她认为要在执行前高置信地判断这次调用符不符合任务，不符合就拦下。

> "Agents, their intent becomes action in the tool calls."——agent 的意图通过工具调用变成行动。

- 她说 agent 给的理由不一定可信，所以要拿用户任务去对照这次调用本身。

### 2. 运行时意图裁判的四个约束

这个组件要读得到调用之前的会话上下文和调用本身；运行时延迟要低，不给用户添堵；要能应付多条调用同时在跑；最好在本地运行。

> "Then ideally should run locally so that the context including sensitive information doesn't go off host."——最好本地运行，让包含敏感信息的上下文不出本机。

### 3. 三条常见路线各有硬伤

- 确定性规则：比如用正则抓命令或代码块内容来判断它做什么，判断太浅。
- 托管大模型：能对大量上下文做更深的推理，但上下文得送出去，更慢也更贵。
- 训练 XGBoost 这类分类器：要大量标注数据，工具调用数据一变就得重训。

> "these will require labeling lots of data, which most teams don't have, and every time the tool call data changes, we'll have to retrain."——要大量标注数据，多数团队没有，而且工具调用数据一变就得重训。

所以她转而比较两类较小的模型：一个生成式小语言模型，和一组开源的判别类模型。

### 4. 实验：判别类小模型 91%–93%，生成式小模型 70%

数据是命令行工具调用。每个模型拿到同一份提示词：上下文、任务、agent 的理由，以及一组问题（这次调用安全吗、属于哪类操作），要求输出这次调用的访问级别分类，访问级别再交给策略层执行。

> "Some models are a little bit more cautious, so when the prediction was low confidence, it would defer and pick unknown when it had the chance to do so."——有的模型更谨慎，置信度低时会选"unknown"往后推。

- 判别类模型都在 4 亿参数左右，除一个之外，准确率都在 91% 到 93% 之间。
- 其中一个模型约 50% 的时候选了 unknown。
- decoder-only 的生成式小模型准确率 70%。
- 她据此认为判别类模型是更好的选择，结论页写的是选哪个模型很重要。
- 没给样本量和类别划分，也没有和托管大模型或规则方案对比。

### 5. 错误有轻重，低置信要转人，阈值逐模型定

她举的例子：任务是解决 GuardDuty（一项威胁检测服务）给某些流量造成的问题，agent 提出的调用却是删掉这个检测器。这条调用可以归为"删除"，也可以归为"管理员"，实质是把安全服务关掉。有的模型以低置信把它判成"删除"，这并不准确。办法是定一个阈值，低于它就不做自动判定。

> "some errors are riskier than others."——有些错误比别的更危险。

- 不能所有模型共用一个阈值：对某个模型可能太高，大量调用被转给人，这个模型就没法用了。

### 6. 参考架构：网关拦截、意图裁判、策略三选一

用户提交任务后产生工具调用，调用被一个以 MCP server 形式实现的网关拦下；证据（事实和理由）交给意图裁判，她说意图裁判就是一个 harness；再由策略执行组件结合企业自己的策略规则和用户当前的授权，决定批准、拒绝或升级，结果返回给 agent。

> "the tool calls can be intercepted by a gateway implemented as an MCP server."——工具调用可以被一个以 MCP server 形式实现的网关拦下。

- demo：用户先授权只读，agent 提出的只读调用被放行并执行；后面一条请求被拒绝。

### 7. 上线经验：从便宜的改起，最后才微调

- 测整套系统，看两个指标：放过了多少危险调用，要尽量少；放过了多少安全调用，要尽量多。
- 第一次配置就给对上下文和提问的情况很少见，要逐个看错例，把输入补全。
- 评测样本的标签要无歧义；多位评审标注时，评审之间要对标签达成一致。
- 选好阈值并校准。
- 如果还有顽固错误，再考虑微调。

> "you need to be able to test the whole system."——要测整套系统。

## 存疑

- 官网未公布这场的题目，本页标题取自她开场和结尾反复提的问题，未见幻灯片确认。
- 几个判别类模型的名字没听清，哪一个是准确率的例外、哪一个约 50% 选 unknown 也就无法对应；这个 50% 是相对全部样本还是低置信样本也不清楚。
- 生成式小模型的参数量没听清，可能是 27B 或 2.7B。
- GuardDuty 例子里受影响的是哪类流量没听清。
- 她对那组小模型的叫法录音里是 "decision model"，本页译作"判别类模型"是按语境意译，具体是哪类模型要看幻灯片确认。
