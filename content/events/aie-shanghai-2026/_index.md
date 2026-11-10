---
title: "AIE 上海 2026"
description: "AI Engineer 上海 2026（2026-11-05 至 11-06）逐场记录。"
lang: zh
---

AI Engineer 大会 2026 年 11 月 5 日至 6 日在上海举行。这里每场一页，记讲者的主要论断、关键原话、例子与数字，以及没听清或需要核对的地方。

S 编号的场次据作者现场录音整理。M、B 编号的场次（主舞台部分场次和 11-05 下午的 AI 应用分会场）据现场外部录音整理，未与本人录音对照。

官方录像由 AI Engineer 在 YouTube 陆续放出，见 [AI Engineer Shanghai 播放列表](https://www.youtube.com/playlist?list=PLJOBv2QjD2Xc)。截至 2026-11-10 只放出 1 场（S02），已放出的场次在页首「视频」一栏给出链接。

## 知识地图

这张地图把 52 场演讲的论断按两条轴归位。横轴是 9 个工程环节，从模型、基础设施一直到市场和社区；纵轴是三层：E 事件（新发布、demo、数字）、S 结构（范式、分工、成本曲线变了）、X 解释（改变我们怎么理解 AI 的基础认识）。先在总览表里找你关心的那一列，格子里是场次编号；再到下面同名的小节读论断，每条一句，后面链到场次页。时间不多的话，先读 X 这一行。

两场以上在同一格说法冲突的，用 ⚔️ 标出，并写明分歧在哪；看着相反、其实讲的是不同问题的，标为「对照」。每格只挑最有分量的几条，不求把每场都放进来；X 层宁缺毋滥，格子是「—」的就是没有够分量的论断。Physical AI 离软件工程最远，单列一张小表；最后一张副表把各场的产品案例定到 L0–L6 六层，看大会的重心落在哪几层。

### 总览

<div class="aie-map-table">

| 层 \ 列 | C1 模型 | C2 基础设施 | C3 上下文记忆 | C4 Harness | C5 评估验证 | C6 组织 | C7 产品与人 | C8 安全经济 | C9 市场社区 |
|---|---|---|---|---|---|---|---|---|---|
| X 解释 | [S07]({{< relref "s07-stepfun-agent-harness.md" >}}) [S03]({{< relref "s03-youcom-post-training-search.md" >}}) [S28]({{< relref "s28-liquid-ai-decision-models.md" >}}) | — | [S19]({{< relref "s19-heygen-html-is-all-your-agents-need.md" >}}) [B08]({{< relref "b08-datahub-trusted-context.md" >}}) | ⚔️ [S25]({{< relref "s25-minimax-leaner-harnesses.md" >}}) [S07]({{< relref "s07-stepfun-agent-harness.md" >}}) | [S08]({{< relref "s08-openclaw-intent-engineering.md" >}}) [S22]({{< relref "s22-daily-trusting-evals-i-cant-read.md" >}}) [S01]({{< relref "s01-langfuse-building-agents.md" >}}) | [S11]({{< relref "s11-manus-ai-native-work.md" >}}) [S36]({{< relref "s36-nowledge-memory-engineering.md" >}}) [S17]({{< relref "s17-kimi-game-dev-in-ai-era.md" >}}) | ⚔️ [S02]({{< relref "s02-ryo-lu-what-we-want.md" >}}) [S20]({{< relref "s20-chiling-encoding-is-the-moat.md" >}}) [S21]({{< relref "s21-hicap-ai-in-manufacturing.md" >}}) [B01]({{< relref "b01-youmind-personal-agent-for-growth.md" >}}) [S24]({{< relref "s24-panel-ai-startups-vc.md" >}}) | [S29]({{< relref "s29-masons-sovereign-agents.md" >}}) [S33]({{< relref "s33-1password-agent-intent-check.md" >}}) [M02]({{< relref "m02-microsoft-enterprise-agents.md" >}}) | ⚔️ [S24]({{< relref "s24-panel-ai-startups-vc.md" >}}) [S06]({{< relref "s06-panel-community-ai-era.md" >}}) |
| S 结构 | ⚔️ [S03]({{< relref "s03-youcom-post-training-search.md" >}}) [S07]({{< relref "s07-stepfun-agent-harness.md" >}}) [S28]({{< relref "s28-liquid-ai-decision-models.md" >}}) [S09]({{< relref "s09-autoark-on-device-ai.md" >}}) [S01]({{< relref "s01-langfuse-building-agents.md" >}}) [B06]({{< relref "b06-cookiy-agentic-harness.md" >}}) [S36]({{< relref "s36-nowledge-memory-engineering.md" >}}) | [S04]({{< relref "s04-baseten-full-stack-inference.md" >}}) [S14]({{< relref "s14-tidb-nobody-planned-ai-infra.md" >}}) [S15]({{< relref "s15-techcombank-inference-cost.md" >}}) [S09]({{< relref "s09-autoark-on-device-ai.md" >}}) [S10]({{< relref "s10-daytona-k8s-is-not-your-sandbox.md" >}}) [S16]({{< relref "s16-google-rl-sandboxes-at-scale.md" >}}) [M03]({{< relref "m03-optiver-multi-region-llm-gateway.md" >}}) [B08]({{< relref "b08-datahub-trusted-context.md" >}}) | [S03]({{< relref "s03-youcom-post-training-search.md" >}}) [S12]({{< relref "s12-exa-personal-agent-search.md" >}}) [B08]({{< relref "b08-datahub-trusted-context.md" >}}) [B10]({{< relref "b10-datusai-executable-ontologies.md" >}}) [S37]({{< relref "s37-jina-reading-the-web.md" >}}) [S13]({{< relref "s13-zilliz-memory-is-training-data.md" >}}) [S25]({{< relref "s25-minimax-leaner-harnesses.md" >}}) [S36]({{< relref "s36-nowledge-memory-engineering.md" >}}) | [S01]({{< relref "s01-langfuse-building-agents.md" >}}) [S07]({{< relref "s07-stepfun-agent-harness.md" >}}) [S25]({{< relref "s25-minimax-leaner-harnesses.md" >}}) [M02]({{< relref "m02-microsoft-enterprise-agents.md" >}}) [B03]({{< relref "b03-dify-managing-500th-agent.md" >}}) [B06]({{< relref "b06-cookiy-agentic-harness.md" >}}) | ⚔️ [S05]({{< relref "s05-arena-measure-the-frontier.md" >}}) [B02]({{< relref "b02-harvey-trust-your-own-evals.md" >}}) [B07]({{< relref "b07-agoda-your-repo-your-benchmark.md" >}}) [S23]({{< relref "s23-nus-streaming-stt.md" >}}) [S22]({{< relref "s22-daily-trusting-evals-i-cant-read.md" >}}) [B09]({{< relref "b09-data4life-harness-is-first-reviewer.md" >}}) [B05]({{< relref "b05-meta-beyond-screenshots.md" >}}) [S08]({{< relref "s08-openclaw-intent-engineering.md" >}}) [S14]({{< relref "s14-tidb-nobody-planned-ai-infra.md" >}}) | [S11]({{< relref "s11-manus-ai-native-work.md" >}}) [S08]({{< relref "s08-openclaw-intent-engineering.md" >}}) [S17]({{< relref "s17-kimi-game-dev-in-ai-era.md" >}}) [S21]({{< relref "s21-hicap-ai-in-manufacturing.md" >}}) [B12]({{< relref "b12-ahacreator-matching-to-delivery.md" >}}) | [S02]({{< relref "s02-ryo-lu-what-we-want.md" >}}) [S20]({{< relref "s20-chiling-encoding-is-the-moat.md" >}}) [B01]({{< relref "b01-youmind-personal-agent-for-growth.md" >}}) [S21]({{< relref "s21-hicap-ai-in-manufacturing.md" >}}) [B11]({{< relref "b11-sac-idea-to-viral-launch.md" >}}) [B12]({{< relref "b12-ahacreator-matching-to-delivery.md" >}}) | ⚔️ [M02]({{< relref "m02-microsoft-enterprise-agents.md" >}}) [S33]({{< relref "s33-1password-agent-intent-check.md" >}}) [B04]({{< relref "b04-visa-infra-for-agents-that-act.md" >}}) [S29]({{< relref "s29-masons-sovereign-agents.md" >}}) [S37]({{< relref "s37-jina-reading-the-web.md" >}}) | [S24]({{< relref "s24-panel-ai-startups-vc.md" >}}) [S06]({{< relref "s06-panel-community-ai-era.md" >}}) |
| E 事件 | [S03]({{< relref "s03-youcom-post-training-search.md" >}}) [S09]({{< relref "s09-autoark-on-device-ai.md" >}}) [S28]({{< relref "s28-liquid-ai-decision-models.md" >}}) | [S16]({{< relref "s16-google-rl-sandboxes-at-scale.md" >}}) [S10]({{< relref "s10-daytona-k8s-is-not-your-sandbox.md" >}}) [M03]({{< relref "m03-optiver-multi-region-llm-gateway.md" >}}) [S15]({{< relref "s15-techcombank-inference-cost.md" >}}) | [S12]({{< relref "s12-exa-personal-agent-search.md" >}}) [S37]({{< relref "s37-jina-reading-the-web.md" >}}) [B08]({{< relref "b08-datahub-trusted-context.md" >}}) [S13]({{< relref "s13-zilliz-memory-is-training-data.md" >}}) | [S25]({{< relref "s25-minimax-leaner-harnesses.md" >}}) [B06]({{< relref "b06-cookiy-agentic-harness.md" >}}) | [S05]({{< relref "s05-arena-measure-the-frontier.md" >}}) [B02]({{< relref "b02-harvey-trust-your-own-evals.md" >}}) [B05]({{< relref "b05-meta-beyond-screenshots.md" >}}) [S23]({{< relref "s23-nus-streaming-stt.md" >}}) [B06]({{< relref "b06-cookiy-agentic-harness.md" >}}) | [S17]({{< relref "s17-kimi-game-dev-in-ai-era.md" >}}) [S11]({{< relref "s11-manus-ai-native-work.md" >}}) | [B01]({{< relref "b01-youmind-personal-agent-for-growth.md" >}}) [B11]({{< relref "b11-sac-idea-to-viral-launch.md" >}}) [B12]({{< relref "b12-ahacreator-matching-to-delivery.md" >}}) | [M02]({{< relref "m02-microsoft-enterprise-agents.md" >}}) [B04]({{< relref "b04-visa-infra-for-agents-that-act.md" >}}) [S37]({{< relref "s37-jina-reading-the-web.md" >}}) | [M01]({{< relref "m01-swyx-opening.md" >}}) [S06]({{< relref "s06-panel-community-ai-era.md" >}}) |

</div>

### Physical AI 小表

<div class="aie-map-table">

| 层 | 场次 |
|---|---|
| X 解释 | [S18]({{< relref "s18-world-labs-taxonomy-of-world-models.md" >}}) [S32]({{< relref "s32-dyna-robot-hardware.md" >}}) [S31]({{< relref "s31-noematrix-noe-0.md" >}}) [S26]({{< relref "s26-aimoga-beyond-vla.md" >}}) |
| S 结构 | ⚔️ [S18]({{< relref "s18-world-labs-taxonomy-of-world-models.md" >}}) [S34]({{< relref "s34-futuring-robot-home-service-robots.md" >}}) [S31]({{< relref "s31-noematrix-noe-0.md" >}}) [S27]({{< relref "s27-vast-3d-to-world-models.md" >}}) [S30]({{< relref "s30-quantsparkle-real2real.md" >}}) [S26]({{< relref "s26-aimoga-beyond-vla.md" >}}) [S35]({{< relref "s35-lancedb-robot-data-build-system.md" >}}) [S32]({{< relref "s32-dyna-robot-hardware.md" >}}) |
| E 事件 | [S34]({{< relref "s34-futuring-robot-home-service-robots.md" >}}) [S31]({{< relref "s31-noematrix-noe-0.md" >}}) [S30]({{< relref "s30-quantsparkle-real2real.md" >}}) [S35]({{< relref "s35-lancedb-robot-data-build-system.md" >}}) [S26]({{< relref "s26-aimoga-beyond-vla.md" >}}) |

</div>

### 分格内容

#### C1 模型与后训练 · X 解释

- 有些能力做了就有、没做就没有：模型在某个任务上表现好，是因为专门做了数据和评测，不能只等泛化。 — [S07]({{< relref "s07-stepfun-agent-harness.md" >}})
- 只奖励答对，模型也会顺带学会什么时候该停：一道多跳题从 150 次搜索、130 万 token 降到 3 次搜索、7 万 token。 — [S03]({{< relref "s03-youcom-post-training-search.md" >}})
- agent 里很多 LLM 调用只是在做小决策，没必要逐 token 生成；一次前向给出答案和置信度就够。 — [S28]({{< relref "s28-liquid-ai-decision-models.md" >}})

#### C1 模型与后训练 · S 结构

- 做搜索 agent 的后训练，RL 数据集比训练框架和环境更重要：题源选中等热度的网页，按 pass@8 丢掉全对和全错的题。 — [S03]({{< relref "s03-youcom-post-training-search.md" >}})
- 为长程 agent 选模型，看四项工程能力：激活参数（单步成本）、长上下文、原生视觉、工具调用。 — [S07]({{< relref "s07-stepfun-agent-harness.md" >}})
- 决策模型的做法：把分类任务改成统一模板做 LoRA 微调、去掉因果掩码；置信度校准用温度缩放，不需要强化学习。 — [S28]({{< relref "s28-liquid-ai-decision-models.md" >}})
- 端侧的内存墙从“总参数”变成“活跃参数加预加载”：35B MoE 只加载活跃专家，再预测下一步要用的专家，在 iPhone 上用约 2G 内存跑。 — [S09]({{< relref "s09-autoark-on-device-ai.md" >}})
- ⚔️ **自己训还是不训。** Langfuse 预测最好的团队下一步会用改进循环里攒下的标签造 RL 环境、训自己的开源模型；Cookiy 坚持不做后训练，认为未来一年 harness 还有大量空间；Nowledge 试过把团队上下文训进参数，9 个实验只有 3 个有收益，转而把团队知识做成 harness 直接用的上下文层。分歧在现阶段应用公司的改进空间是在权重里，还是在 harness 里。 — [S01]({{< relref "s01-langfuse-building-agents.md" >}}) · [B06]({{< relref "b06-cookiy-agentic-harness.md" >}}) · [S36]({{< relref "s36-nowledge-memory-engineering.md" >}})

#### C1 模型与后训练 · E 事件

- You.com 用约 5000 条 SFT 轨迹加 1500 个 RL 任务、8 小时 RL，让开源 30B 模型的 BrowseComp 从 37 分升到约 45.5 分。 — [S03]({{< relref "s03-youcom-post-training-search.md" >}})
- AutoArk 发布 150B 端侧 MoE 多模态模型预览，最低 18–24G 内存，瞄准本机跑编码 agent。 — [S09]({{< relref "s09-autoark-on-device-ai.md" >}})
- Liquid AI 上周做出两个端侧决策模型，一个纯文本、一个带视觉。 — [S28]({{< relref "s28-liquid-ai-decision-models.md" >}})

#### C2 基础设施 · S 结构

- 推理优化每一层都必要但都不充分：单 GPU 上的技术本质是少算、少搬数据、把硬件用满，再叠上集群层的调度；讲者引社区数据说，全部叠起来比不做优化的基线高出几个数量级，所以要做全栈。 — [S04]({{< relref "s04-baseten-full-stack-inference.md" >}})
- 没人计划过 AI infra：数据库被 agent 构建者的需求推着长出 trace 分析、状态快照和文件层，价值是让团队把注意力留给 agent 的下一次迭代。 — [S14]({{< relref "s14-tidb-nobody-planned-ai-infra.md" >}})
- 从按 token 付费切到自建部署有一个可算的临界点：月 token 量 = 部署月成本 ÷ 每百万 token 有效单价；自建以后仍要在网关上保留按 token 付费做兜底。 — [S15]({{< relref "s15-techcombank-inference-cost.md" >}})
- 智能硬件全靠云端 API 会越卖越赔；端侧做意图分流、只把开放问答送上云，耳机案例省掉 92% 以上的 token 成本。 — [S09]({{< relref "s09-autoark-on-device-ai.md" >}})
- agent 沙箱要的是短命但有状态，和 K8s 为长期运行、出错自愈的服务设计的目标相反；在 K8s 上硬做有状态，坑在外挂存储。 — [S10]({{< relref "s10-daytona-k8s-is-not-your-sandbox.md" >}})
- RL 后训练卡在沙箱调度上，基础设施故障还会变成错误的 reward 信号混进训练。 — [S16]({{< relref "s16-google-rl-sandboxes-at-scale.md" >}})
- LLM 网关的 HTTP 200 不等于成功：同一会话要粘在一家 provider，同一模型只暴露两家都支持的功能，跨区域要身份全局、推理本地。 — [M03]({{< relref "m03-optiver-multi-region-llm-gateway.md" >}})
- **对照：自建还是外采。** Techcombank 算出用量过线就该从按 token 付费转为自租 GPU 部署，Optiver 因为协议翻译会弄坏东西，最后自建只含所需功能的精简网关；Daytona 主张沙箱别自己造，DataHub 主张底层设施外采、只把业务定义握在自己手里。四家讲的是不同组件，没有正面交锋：用量算得清、现成方案出过错的倾向自建，安全面大、团队会换人的倾向外采；后两家本身就卖这类服务。 — [S15]({{< relref "s15-techcombank-inference-cost.md" >}}) · [M03]({{< relref "m03-optiver-multi-region-llm-gateway.md" >}}) · [S10]({{< relref "s10-daytona-k8s-is-not-your-sandbox.md" >}}) · [B08]({{< relref "b08-datahub-trusted-context.md" >}})

#### C2 基础设施 · E 事件

- Google 开源 RL 沙箱方案，讲者自报百万级同时并发、首条指令 P99 1 秒内、12 分钟填满 100 万个沙箱，没给对照测试。 — [S16]({{< relref "s16-google-rl-sandboxes-at-scale.md" >}})
- Daytona 自测：同样负载耗时少 36%，波峰型负载成本低 2.7 倍（厂商自测）。 — [S10]({{< relref "s10-daytona-k8s-is-not-your-sandbox.md" >}})
- Optiver 把提示词日志改为直写各区 S3、鉴权用本地副本后，鉴权延迟从 2 秒降到 20 毫秒。 — [M03]({{< relref "m03-optiver-multi-region-llm-gateway.md" >}})
- Techcombank 的例子里临界点约 830 亿 token/月，过线后估计能省 30–50%。 — [S15]({{< relref "s15-techcombank-inference-cost.md" >}})

#### C3 上下文、记忆与数据 · X 解释

- 上下文工程先问上下文是什么形状：私有格式 agent 写得出来，却没法在里面推理；换成它最擅长的代码，模型变强，产品就跟着变强。 — [S19]({{< relref "s19-heygen-html-is-all-your-agents-need.md" >}})
- 企业数据的老问题没变，只是犯错的主体从人换成了 agent：人会在数字进 PPT 前复核，agent 不会，而且规模更大、更自信。 — [B08]({{< relref "b08-datahub-trusted-context.md" >}})

#### C3 上下文、记忆与数据 · S 结构

- agent 需要专门给机器用的搜索引擎；搜索网页的 AI agent 已经多过人。 — [S03]({{< relref "s03-youcom-post-training-search.md" >}})
- 个人 agent 的检索预算：先搜索读高亮，不够才开浏览器，每一步只拿下一步决策需要的最少 token；记忆要区分是谁的偏好、影响哪个计划。 — [S12]({{< relref "s12-exa-personal-agent-search.md" >}})
- 企业数据和 agent 之间要有一层上下文层：采集、自动提炼、专家验证、再分发，每条上下文带可信度等级。 — [B08]({{< relref "b08-datahub-trusted-context.md" >}})
- 数据 agent 的瓶颈不在写 SQL，在数字能不能信：本体建在现有语义层上，再用编译器把规范编成确定性 SQL、拒绝错误查询。 — [B10]({{< relref "b10-datusai-executable-ontologies.md" >}})
- 网页转 Markdown 不是最后一步：把整页原文喂给主流模型，每千个页面的成本已和广告每千次浏览的收入同一量级，还得再压缩。 — [S37]({{< relref "s37-jina-reading-the-web.md" >}})
- 数据涨十倍以内靠单机优化，涨百倍千倍只能重构架构：容量假设从有限换成无限，围绕对象存储做热温冷三层，每层成本差一个数量级，任何一层都能直接查。 — [S13]({{< relref "s13-zilliz-memory-is-training-data.md" >}})
- 像珍惜内存一样珍惜 context：放进去的每样东西都要算信噪比，问一句不放能不能达到同样效果。 — [S25]({{< relref "s25-minimax-leaner-harnesses.md" >}})
- **对照：记忆的存与用。** Zilliz 把 agent 的记忆看作下季度的训练数据，同一份数据既服务线上召回、也供离线挖掘；Nowledge 同样把原始轨迹全存成 episodic memory，但给 agent 用时要管脉络和衰减，知识衰减是 feature，做得差的记忆不如没有。两边讲的是不同层：底层留全，交给 agent 的上下文要会忘。 — [S13]({{< relref "s13-zilliz-memory-is-training-data.md" >}}) · [S36]({{< relref "s36-nowledge-memory-engineering.md" >}})

#### C3 上下文、记忆与数据 · E 事件

- Exa 的索引已不只是网页：新闻 15 分钟入索引、300 万档播客全文，还为个人 agent 新加了 2 亿多个地点。 — [S12]({{< relref "s12-exa-personal-agent-search.md" >}})
- 经 Jina Reader 处理后，网页 token 数中位数约 4.5K–5K，呈对数正态分布；原始 HTML 约 30K。 — [S37]({{< relref "s37-jina-reading-the-web.md" >}})
- DataHub 的客户数字：Miro 的 agent 准确率约从 50% 到 90%。 — [B08]({{< relref "b08-datahub-trusted-context.md" >}})
- Zilliz：客户里最大的单一业务，数据条目每年涨一个数量级，今年已到千亿条。 — [S13]({{< relref "s13-zilliz-memory-is-training-data.md" >}})

#### C4 Harness 与 Agent 架构 · X 解释

- harness 工程是实验科学：先写假设和验证方式，再让 AI 执行实验；能扩大实验数量，就能扩大迭代效率。 — [S25]({{< relref "s25-minimax-leaner-harnesses.md" >}})
- ⚔️ **harness 该加还是该减。** StepFun 认为模型能力要真正用进工作流，harness 得补上保存目标和进度、挑选上下文、写验收条件、云端持续执行这些环节；MiniMax 认为模型变强后，提示词、subagent、todo/plan 都该拿评测逐项检验、能删就删。两边都留下了验证，也都要跨上下文接上进度；分歧在进度和拆分该由 harness 管（StepFun 用任务树记进度，subagent 只回结论），还是已经可以交给模型自己（MiniMax 让模型把任务写进本地文件交接，克制开 subagent）。 — [S07]({{< relref "s07-stepfun-agent-harness.md" >}}) · [S25]({{< relref "s25-minimax-leaner-harnesses.md" >}})

#### C4 Harness 与 Agent 架构 · S 结构

- agent 架构绕了一圈回到“模型加工具循环”，正在收敛到 coding agent 的样子；Langfuse 推荐把 agent 循环放在后端 worker 里，沙箱只是它按需调用的一个工具。 — [S01]({{< relref "s01-langfuse-building-agents.md" >}})
- 云端 harness 是脑，管计划、上下文和选工具；本地电脑和远端 sandbox 是手。 — [S07]({{< relref "s07-stepfun-agent-harness.md" >}})
- harness 要决定四件事：模型看到什么、能做什么、怎么持续、怎么验证，其中验证最重要；新功能进 harness 前先交评测流程。 — [S25]({{< relref "s25-minimax-leaner-harnesses.md" >}})
- 讲者预测：agent 有了独立身份，会不经事先编排地互相协作，人只在审批点出现。 — [M02]({{< relref "m02-microsoft-enterprise-agents.md" >}})
- 管到第 500 个 agent，难点从构建转到运营、治理和优化：底层模型一更新、知识库一变，已经没有作者可问。 — [B03]({{< relref "b03-dify-managing-500th-agent.md" >}})
- **对照：两种“拆 agent”。** MiniMax 说最近的 benchmark 显示多开 subagent 常常只是白耗 token，主张克制开启；Cookiy 的实时访谈最后走通的，是把判断、动作、回复拆成三类子 agent 级联。两者拆的不是一回事：前者是 coding 任务里分派子任务，后者是实时对话里把一次回复拆成流水线，为的是压延迟、防串信息。 — [S25]({{< relref "s25-minimax-leaner-harnesses.md" >}}) · [B06]({{< relref "b06-cookiy-agentic-harness.md" >}})

#### C4 Harness 与 Agent 架构 · E 事件

- MiniMax 举 Claude Code 的几次调整：砍掉大部分系统提示词，承认单个强 agent 胜过多 subagent，先后去掉 todo 和 plan mode；推测下一个被去掉的是 /goal。 — [S25]({{< relref "s25-minimax-leaner-harnesses.md" >}})
- MiniMax Code 围绕前缀缓存和 token 效率的做法：工具放进 CLI 按需发现、用代码脚本批量调工具（PTC）、长命令自动转后台。 — [S25]({{< relref "s25-minimax-leaner-harnesses.md" >}})
- Cookiy 把 8000 字的中文 system prompt 砍到约 1/3，更快也更好；最笨的提速办法是同一请求并发调多次、取最快的。 — [B06]({{< relref "b06-cookiy-agentic-harness.md" >}})

#### C5 评估与验证 · X 解释

- 速度上来以后，瓶颈从生成移到 proof：工程师要从 intent engineering 走到 proof engineering，先把可验证的结果定义好，再让 agent 爬坡。 — [S08]({{< relref "s08-openclaw-intent-engineering.md" >}})
- 写东西变便宜以后没人读得过来，所以不再检查产出本身，改为检查“检查者”。 — [S22]({{< relref "s22-daily-trusting-evals-i-cant-read.md" >}})
- 讲者预测改进循环会交给后台 agent 常驻跑，人只保留“质量”：定义什么算好、信哪些反馈信号、决定发不发。 — [S01]({{< relref "s01-langfuse-building-agents.md" >}})

#### C5 评估与验证 · S 结构

- Arena 评 agent 用随机对照实验：自己做一个通用 agent 产品，每个会话随机分配底层模型，再从真实轨迹里挖成功率、用户褒贬、纠偏程度等信号。 — [S05]({{< relref "s05-arena-measure-the-frontier.md" >}})
- ⚔️ **通用榜单还能不能指导选模型。** Arena 认为静态题库会被刷，真实流量上的随机对照能给出可比的排名，同时建议按自己的成本和耗时在帕累托曲线上取舍；Harvey 认为别人的 context 和 harness 跟你不同，选模型只信自己 PR 上的回放；Agoda 发现同一个上下文工具换个仓库，结果就反过来；NUS 实测公开基准的错误率搬到自家音频上差 4 到 20 倍。分歧在通用排名能在多大程度上迁移到你的任务上。 — [S05]({{< relref "s05-arena-measure-the-frontier.md" >}}) · [B02]({{< relref "b02-harvey-trust-your-own-evals.md" >}}) · [B07]({{< relref "b07-agoda-your-repo-your-benchmark.md" >}}) · [S23]({{< relref "s23-nus-streaming-stt.md" >}})
- 能写成确定性检查的就别交给 LLM：Data4Life 先跑测试，让 agent 截图、由 LLM 解读只做兜底；Meta 的验证智能体把构建、安装、登录写死以省 token，只让 LLM 把任务翻译成 CLI 调用；Daily 的语音对话没有确定答案，才让 LLM 当 judge 和模拟用户，人只审 judge 的标准。 — [S22]({{< relref "s22-daily-trusting-evals-i-cant-read.md" >}}) · [B09]({{< relref "b09-data4life-harness-is-first-reviewer.md" >}}) · [B05]({{< relref "b05-meta-beyond-screenshots.md" >}})
- agent 写的测试要再检验：一个组件覆盖率近 90%，变异测试只抓到不到 15%；有旧系统时，拿它当 oracle 跑真实样本。 — [B09]({{< relref "b09-data4life-harness-is-first-reviewer.md" >}})
- 手机上的验证智能体光靠截图不够：要让 app 可观测、提供语义化操作，编码 agent 才能自测，CI 才能对每个变更跑验证。 — [B05]({{< relref "b05-meta-beyond-screenshots.md" >}})
- agent 的产量上来以后，工厂速度取决于 CI：main 上关掉 CI 改成定时跑，再按影响范围做 adaptive testing。 — [S08]({{< relref "s08-openclaw-intent-engineering.md" >}})
- 做了评测才发现，要改的常常不是模型和 harness，而是喂给模型的数据和流程里的小 bug。 — [B02]({{< relref "b02-harvey-trust-your-own-evals.md" >}})
- 判断一次改动是否真的变好，要从同一个保存下来的现场开分支比较；只看 trace 不够，trace 只记录发生过什么。 — [S14]({{< relref "s14-tidb-nobody-planned-ai-infra.md" >}})

#### C5 评估与验证 · E 事件

- Agent Arena 排名：美国前沿实验室领先，中国开源权重模型在第二梯队，但在性能-成本帕累托前沿上占了好几个位置。 — [S05]({{< relref "s05-arena-measure-the-frontier.md" >}})
- Harvey 的内部实验：code review 上 DeepSeek V4.1 Flash 接近 Opus；修 CI 各模型质量差不多，差在耗时；整次实验约 7 小时、约 7000 美元。 — [B02]({{< relref "b02-harvey-trust-your-own-evals.md" >}})
- Meta 的验证智能体靠扫自己的失败记录改进，一个月内有结论的验证比例从约 10% 升到约 55%。 — [B05]({{< relref "b05-meta-beyond-screenshots.md" >}})
- NUS：从实时切段到整段录音，转写准确率从 62% 升到 82%，指定语言就补回 11 个点。 — [S23]({{< relref "s23-nus-streaming-stt.md" >}})
- Cookiy 用几千条历史坏案例（精确到某场访谈的第几分第几秒）做 benchmark。 — [B06]({{< relref "b06-cookiy-agentic-harness.md" >}})

#### C6 组织与工作方式 · X 解释

- 自动化越多，人的决策越关键：自动接单 bot 几天就积下几十个没人审、没人定优先级的 PR；注意力是不可再生资源，常规决策要沉淀成 skill 和 memory。 — [S11]({{< relref "s11-manus-ai-native-work.md" >}})
- AI native 团队有大量“Dark Office”产出，其中半闭环的自我改进已经跑起来，卡点在人的验证环节。 — [S36]({{< relref "s36-nowledge-memory-engineering.md" >}})
- 这一轮变化的核心原因是 AI 独立做长程任务的能力：讲者说周围很多工程师已经不再手写代码，也读不过来 AI 写的代码。 — [S17]({{< relref "s17-kimi-game-dev-in-ai-era.md" >}})

#### C6 组织与工作方式 · S 结构

- Mono 解决“AI 看不全上下文”，任务公开解决“人看不全上下文”：全公司的代码、知识、内部工具进一个仓库，每个人的 agent 任务全公司可见、可加入。 — [S11]({{< relref "s11-manus-ai-native-work.md" >}})
- 为了让更多人参与 AI-native 研发：技术架构改成精简内核加插件，组织按事分人，产品和设计也直接提 PR。 — [S11]({{< relref "s11-manus-ai-native-work.md" >}})
- 工程师在变成工厂管理者：用 harness 造 harness，一个人并行跑几百个 agent。 — [S08]({{< relref "s08-openclaw-intent-engineering.md" >}})
- 原型变快以后，人管验证和决定，开发和执行交给模型。 — [S17]({{< relref "s17-kimi-game-dev-in-ai-era.md" >}})
- 大集团做不了 AI native 式的快速颠覆，能做的是先把几百个流程梳理进台账，让组织行为变成模型能用的数据。 — [S21]({{< relref "s21-hicap-ai-in-manufacturing.md" >}})
- 整条链路好比 1000 件事，AI 做掉 800 件，人只管四步：定交付要求、审带报价的达人名单、审脚本和终稿、复盘数据。 — [B12]({{< relref "b12-ahacreator-matching-to-delivery.md" >}})

#### C6 组织与工作方式 · E 事件

- 一个人约 4 天、约 3000 元 token 做出一个可玩的游戏；一段视频一周内被社区做成可玩游戏。 — [S17]({{< relref "s17-kimi-game-dev-in-ai-era.md" >}})
- Manus 讲者称，产品和设计直接提 PR 以来，没有因代码质量出过线上事故（没给观察期）。 — [S11]({{< relref "s11-manus-ai-native-work.md" >}})

#### C7 产品、设计与人 · X 解释

- 答案完整不代表我想过：被完整答案盖住的，是还没来得及形成的问题。 — [S02]({{< relref "s02-ryo-lu-what-we-want.md" >}})
- AGI 是最强的解码器，编码清晰的“显性大陆”会被吞没；垂直 AI 该去一部分编码清楚、四周是隐性知识的“群岛”。 — [S20]({{< relref "s20-chiling-encoding-is-the-moat.md" >}})
- 企业级 AI 的护城河在没有 API 的地方：词、没沉淀的数据、老设备、人；语义不统一时，模型越强，错得越漂亮。 — [S21]({{< relref "s21-hicap-ai-in-manufacturing.md" >}})
- ⚔️ **省时间还是花时间。** YouMind 说现有 Personal Agent 都在替人解决烦恼、满足欲望，省下的时间并不会花在想做的事上，所以要转向创作；圆桌上的投资人则认为帮人省时间的 personal agent 天花板有限，让需求扩张、帮人消耗时间的产品才做得大。分歧在“好产品”的尺子：一边看人有没有变好，一边看需求能不能扩张。Ryo Lu 站在使用者一侧补了一句：省下的时间不必重新填满。 — [S02]({{< relref "s02-ryo-lu-what-we-want.md" >}}) · [B01]({{< relref "b01-youmind-personal-agent-for-growth.md" >}}) · [S24]({{< relref "s24-panel-ai-startups-vc.md" >}})

#### C7 产品、设计与人 · S 结构

- 工具应该是工作台而不是服务窗口：区别不在按钮多少，在人能不能碰到正在改的东西、只改一部分、把方向拿回来。 — [S02]({{< relref "s02-ryo-lu-what-we-want.md" >}})
- 选软性经验多、交易成本高的行业（美妆），从消费者端切入，用消费者需求数据换品牌的知识和数据。 — [S20]({{< relref "s20-chiling-encoding-is-the-moat.md" >}})
- 内容从消费侧走向创作侧；“做给自己看”是 ToB、ToC 之外的一个大市场；通用 Personal Agent 交给大厂，创业者做创作型 Studio。 — [B01]({{< relref "b01-youmind-personal-agent-for-growth.md" >}})
- 制造业 AI 先做当季见效的“土”项目，真正要做的是瓶颈上的提效；排产难在每个环节都没有自己的规则。 — [S21]({{< relref "s21-hicap-ai-in-manufacturing.md" >}})
- 不懂建模的人也能做出 3D 游戏，靠的是先摸清新模型的能力边界、有审美、懂社媒传播；讲者说最重要的是想法。 — [B11]({{< relref "b11-sac-idea-to-viral-launch.md" >}})
- 参考图先行、俯视图最关键；再用“多机位截图对参考图盲审”这类 loop 让 agent 自己迭代，人及时纠偏。 — [B11]({{< relref "b11-sac-idea-to-viral-launch.md" >}})
- 海外达人营销的 KOC/UGC 做不起来，卡在代理商的经济账；平台带着品牌的真实订单找达人，让 AI 打通从匹配到复投的链路。 — [B12]({{< relref "b12-ahacreator-matching-to-delivery.md" >}})

#### C7 产品、设计与人 · E 事件

- YouMind 的 Max 档付费用户人均每月做约 15 个 PPT，只有一两个给别人看（自家数据，没给口径）。 — [B01]({{< relref "b01-youmind-personal-agent-for-growth.md" >}})
- 独立开发者 16 天做出 3D《小王子》游戏，发布前一天预测能在 X 上跑 300 万流量。 — [B11]({{< relref "b11-sac-idea-to-viral-launch.md" >}})
- AhaCreator 的 3C 品牌案例：两天筛出三四百个持有设备的达人，最终 CPM 4 美金。 — [B12]({{< relref "b12-ahacreator-matching-to-delivery.md" >}})

#### C8 安全、权限与 Agent 经济 · X 解释

- agent 的定义是行动；有效的行动要改别人的环境，就必须经过别人允许。 — [S29]({{< relref "s29-masons-sovereign-agents.md" >}})
- agent 的意图落在每一次工具调用上，它自己给的理由不能当证据。 — [S33]({{< relref "s33-1password-agent-intent-check.md" >}})
- 让 agent 冒用用户身份很危险：它继承你的全部权限，在 harness 里关掉某个工具也挡不住，它会换条路达成目的。 — [M02]({{< relref "m02-microsoft-enterprise-agents.md" >}})

#### C8 安全、权限与 Agent 经济 · S 结构

- 给 agent 独立身份是为了最小权限：权限在身份层由管理员按 agent 类别授予，agent 无论写 shell 还是写 Python 都越不过去。 — [M02]({{< relref "m02-microsoft-enterprise-agents.md" >}})
- 运行时意图裁判要本地跑、低延迟、看得到调用前的上下文；约 4 亿参数的判别类小模型除一个外准确率在 91%–93%，生成式小模型只有 70%；低置信要转给人，阈值逐个模型定。 — [S33]({{< relref "s33-1password-agent-intent-check.md" >}})
- agent 代人花钱，现有基础设施在三处挡住它：网站反爬、银行风控、用户不知道该授权什么；做法是卡不直接给 agent，给带范围和时效的 token，先每笔确认，再放开小额预算。 — [B04]({{< relref "b04-visa-infra-for-agents-that-act.md" >}})
- 品牌不愿被降格成 API，这就是主权；agent 经济需要各自保有主权的 agent 互相交换意图，而不是一个中心化的超级 agent 来分派。 — [S29]({{< relref "s29-masons-sovereign-agents.md" >}})
- 讲者的设想：沿用早期互联网的广告模式，让 agent 复述一段广告口播，或替别人做可自动验证的公开任务，来换免费访问。 — [S37]({{< relref "s37-jina-reading-the-web.md" >}})
- ⚔️ **agent 该不该按次付费。** Visa 拿开发者让 agent 通宵干活当实验场景（讲者承认是小众场景），单笔几分钱几块钱的数字服务不能每次叫醒人确认，所以要做小额支付；Jina 不看好 agent 按请求给网站付费（价格锚定就高、全球南方付不起），只同意访问控制要放在网关。两边讲的不全是一回事：Visa 管 agent 替人买东西怎么付，Jina 管 agent 读网页怎么计价；交叉处在于付费内容该按交易收钱，还是沿用广告换免费。 — [B04]({{< relref "b04-visa-infra-for-agents-that-act.md" >}}) · [S37]({{< relref "s37-jina-reading-the-web.md" >}})

#### C8 安全、权限与 Agent 经济 · E 事件

- Microsoft 的 agent 拿到和员工一样的一整套身份：Entra ID、邮箱、Teams、OneDrive，在组织架构里向人汇报。 — [M02]({{< relref "m02-microsoft-enterprise-agents.md" >}})
- Visa Intelligent Commerce 用 Trusted Agent Protocol 让认证过的 agent 和商户握手，并给商户的“agent 友好度”打分。 — [B04]({{< relref "b04-visa-infra-for-agents-that-act.md" >}})
- Jina Reader 的匿名访问占比半年里从 20% 涨到 36.9%，免费部分可能保不住。 — [S37]({{< relref "s37-jina-reading-the-web.md" >}})

#### C9 市场、投资与社区 · X 解释

- ⚔️ **模型变强，对应用是福是祸。** 戴雨森认为吞掉小应用的不是模型本身，而是模型公司补贴了 token 的第一方应用，整体上模型变强变便宜利好应用公司，他在美国看到垂直应用靠 context、数据或部署筑起壁垒；Patrick 认为早期跑出来的公司吃的是“最新模型套利”，空间会随模型延伸到应用而变小（他也说这个判断今天未必完全成立）。另一场圆桌上，Koji 把基础模型比作迎面开来的坦克，说站在路中间的应用创业者今年最难。分歧在应用的利润来自模型能力差，还是来自模型之外。 — [S24]({{< relref "s24-panel-ai-startups-vc.md" >}}) · [S06]({{< relref "s06-panel-community-ai-era.md" >}})

#### C9 市场、投资与社区 · S 结构

- AI native 的方向已经出来了：情绪价值、能积累数据效应的强数据行业、以短剧为代表的内容生产。（Patrick） — [S24]({{< relref "s24-panel-ai-startups-vc.md" >}})
- 中国的模型公司没有边界，纯软应用容易被吃掉，所以往软硬结合挪；除了 coding，其他领域的长程训练数据远远不够。（Harry） — [S24]({{< relref "s24-panel-ai-startups-vc.md" >}})
- 社区可以当产品首发渠道；嘉宾上播客最多是为了招人；对外发声要保持势能，攒够了再讲。 — [S06]({{< relref "s06-panel-community-ai-era.md" >}})
- 内容和社群公司最终由商业模式决定：只有交易和广告两条变现路，42章经选了高客单的交易。 — [S06]({{< relref "s06-panel-community-ai-era.md" >}})
- 信息差和产品差异都在缩小，线下见面带来的信任反而更值钱；创业者要提高表达能力，go to market 和产品同等重要。 — [S06]({{< relref "s06-panel-community-ai-era.md" >}})

#### C9 市场、投资与社区 · E 事件

- AIE 第一次来中国，也是第一场不做直播的 AIE。 — [M01]({{< relref "m01-swyx-opening.md" >}})
- WaytoAGI 从各城市伙伴长成线下实体空间：亦庄一栋 8 层小楼，成都园区 8000 平方米已开业。 — [S06]({{< relref "s06-panel-community-ai-era.md" >}})
- 一个短漫剧工具在社区直播一场，当天新增 200 用户。 — [S06]({{< relref "s06-panel-community-ai-era.md" >}})

#### Physical AI · X 解释

- 按“它做什么”给世界模型分类（渲染、模拟、规划），再看领域、尺度与分辨率、覆盖度；世界模型是抽象推理和感知/行动之间的接口。 — [S18]({{< relref "s18-world-labs-taxonomy-of-world-models.md" >}})
- 硬件跟不上模型每周一次的迭代，所以硬件不该追模型，而该做成可预测的稳定接口：动作模型能预测，反馈模型能信。 — [S32]({{< relref "s32-dyna-robot-hardware.md" >}})
- 具身落地的关键是获取一个新能力的成本；力觉是操作的第一性输入。 — [S31]({{< relref "s31-noematrix-noe-0.md" >}})
- 只看图像看不全物理状态：接触力、滑动、有没有抓稳都看不见，任务要等物理结果验证过才算完成。 — [S26]({{< relref "s26-aimoga-beyond-vla.md" >}})

#### Physical AI · S 结构

- 上层通用 agent 做 System 2，下层各领域模型做 System 1：World Labs 从世界模型的角色推出这种组织方式，未来不远的下一代家庭机器人也这样分。 — [S18]({{< relref "s18-world-labs-taxonomy-of-world-models.md" >}}) · [S34]({{< relref "s34-futuring-robot-home-service-robots.md" >}})
- ⚔️ **数据从哪来。** Noematrix 靠人类穿戴的无本体采集，后训练也不用遥操作；未来不远在第一人称数据之外，让机器人在真实家庭里的执行数据自动回流成下一代模型的训练数据；VAST 让程序管世界状态、模型管画面，造可交互的世界，并试着从真实演示里生成机器人数据的视觉变体（对机器人学习有没有用还要测）；数耀量生的自我改进循环只用真实数据、不经过仿真。四家没有互相回应，是四条路线的取舍：采集规模和与真机分布一致，更看重哪一头。 — [S31]({{< relref "s31-noematrix-noe-0.md" >}}) · [S34]({{< relref "s34-futuring-robot-home-service-robots.md" >}}) · [S27]({{< relref "s27-vast-3d-to-world-models.md" >}}) · [S30]({{< relref "s30-quantsparkle-real2real.md" >}})
- 能描述清楚的交给 agent 写代码，只能认出来、说不清的细节交给模型学。 — [S27]({{< relref "s27-vast-3d-to-world-models.md" >}})
- 高斯分布表示不了多峰动作；讲者主张用玻尔兹曼能量地形表示，把求最低能量点交给光量子相干伊辛机。 — [S30]({{< relref "s30-quantsparkle-real2real.md" >}})
- 工业机器人的安全监督要独立于模型，用 PLC 或人工写的安全策略兜底。 — [S26]({{< relref "s26-aimoga-beyond-vla.md" >}})
- 机器人数据采集一次、加工无数次，要的是构建系统，不只是存储。 — [S35]({{< relref "s35-lancedb-robot-data-build-system.md" >}})
- 机器人数据表要让“加一列”几乎零开销、cell 带状态，用户写一个 Python 函数绑到列上，系统做增量计算。 — [S35]({{< relref "s35-lancedb-robot-data-build-system.md" >}})
- 部件选型为可建模性让路：弃谐波减速器、用行星减速器，靠好建模的传动和执行器模型估力，不加关节力矩传感器。 — [S32]({{< relref "s32-dyna-robot-hardware.md" >}})

#### Physical AI · E 事件

- 未来不远：四个家务任务经 30 轮自进化，平均成功率从 45.4% 到 86.6%；机器人已在 500 多个家庭累计工作超 5 万小时。 — [S34]({{< relref "s34-futuring-robot-home-service-robots.md" >}})
- Noematrix：不建数采工厂，近 100 个城市、约 30 万小时自采数据。 — [S31]({{< relref "s31-noematrix-noe-0.md" >}})
- 数耀量生宣称成功率从 93.7% 提到 98%（讲者宣称，未见第三方数据）。 — [S30]({{< relref "s30-quantsparkle-real2real.md" >}})
- LanceDB：讲者说 LeRobot（疑为此名）已原生支持用 Lance 做数据摄入和训练。 — [S35]({{< relref "s35-lancedb-robot-data-build-system.md" >}})
- AiMoga 工业场景选轮式平台（“轮式”录音不清），任务从 MES 进出。 — [S26]({{< relref "s26-aimoga-beyond-vla.md" >}})

### 副表：案例按 L0–L6 分层

L0 AI 辅助构建，L1 Prompt Wrapper，L2 RAG，L3 会用工具的 AI，L4 固定 workflow，L5 Agentic Core，L6 AI-native 系统。不是 AI 产品、或硬套分层不合适的场次没有列入。

<div class="aie-map-table">

| 层 | 案例（场次） |
|---|---|
| L0 AI 辅助构建 | Kimi 一个人用模型做可玩游戏（[S17]({{< relref "s17-kimi-game-dev-in-ai-era.md" >}})）；独立开发者做 3D《小王子》（[B11]({{< relref "b11-sac-idea-to-viral-launch.md" >}})）；Data4Life 用 agent 重写 Atlas（开发方式）（[B09]({{< relref "b09-data4life-harness-is-first-reviewer.md" >}})） |
| L1 Prompt Wrapper | （无） |
| L2 RAG | Dify 客户的图书馆 AI librarian（[B03]({{< relref "b03-dify-managing-500th-agent.md" >}})）；DataHub 上下文平台，接近 RAG 的数据底座（[B08]({{< relref "b08-datahub-trusted-context.md" >}})）；把知识图谱塞进 prompt（被讲者当作不够的做法）（[B10]({{< relref "b10-datusai-executable-ontologies.md" >}})） |
| L3 会用工具 | Optiver LLM 网关（[M03]({{< relref "m03-optiver-multi-region-llm-gateway.md" >}})）；Jina Reader 网页读取工具（[S37]({{< relref "s37-jina-reading-the-web.md" >}})）；You.com 案例里后训练出来的、会用搜索和浏览工具的模型（[S03]({{< relref "s03-youcom-post-training-search.md" >}})）；MiniMax Code 的 CLI 工具发现和 PTC（[S25]({{< relref "s25-minimax-leaner-harnesses.md" >}})）；Meta 给验证智能体补的可观测和语义化操作（[B05]({{< relref "b05-meta-beyond-screenshots.md" >}})）；DatusAI 语义运行时（[B10]({{< relref "b10-datusai-executable-ontologies.md" >}})）；企业里查数用的 text-to-SQL agent（[B08]({{< relref "b08-datahub-trusted-context.md" >}})）；Buy for Me 等购物 agent（L3–L5）（[B04]({{< relref "b04-visa-infra-for-agents-that-act.md" >}})） |
| L4 固定 workflow | AhaCreator 达人链路（[B12]({{< relref "b12-ahacreator-matching-to-delivery.md" >}})）；Harvey 的 PR 描述生成（[B02]({{< relref "b02-harvey-trust-your-own-evals.md" >}})）；消费电子公司 7 个 agent 串联（[B03]({{< relref "b03-dify-managing-500th-agent.md" >}})）；Agoda 修上下文的 skill（[B07]({{< relref "b07-agoda-your-repo-your-benchmark.md" >}})）；Data4Life 每日扫社区 issue（[B09]({{< relref "b09-data4life-harness-is-first-reviewer.md" >}})）；Meta 验证智能体（L4 流程包着一段 L5）（[B05]({{< relref "b05-meta-beyond-screenshots.md" >}})）；Daily 点奶茶语音 agent，固定管道，接近 L4（[S22]({{< relref "s22-daily-trusting-evals-i-cant-read.md" >}})） |
| L5 Agentic Core | Claude Code、MiniMax Code（[S25]({{< relref "s25-minimax-leaner-harnesses.md" >}})）；StepFun 长程 agent（[S07]({{< relref "s07-stepfun-agent-harness.md" >}})）；Kimi 跑长程任务（[S17]({{< relref "s17-kimi-game-dev-in-ai-era.md" >}})）；Microsoft 的企业 agent（[M02]({{< relref "m02-microsoft-enterprise-agents.md" >}})）；YouMind（[B01]({{< relref "b01-youmind-personal-agent-for-growth.md" >}})）；Harvey Specter、修 CI agent（[B02]({{< relref "b02-harvey-trust-your-own-evals.md" >}})）；Cookiy 实时访谈 agent（[B06]({{< relref "b06-cookiy-agentic-harness.md" >}})）；DatusAI 数据 agent（[B10]({{< relref "b10-datusai-executable-ontologies.md" >}})）；Exa 开源个人 agent（[S12]({{< relref "s12-exa-personal-agent-search.md" >}})）；Arena 的通用 agent（[S05]({{< relref "s05-arena-measure-the-frontier.md" >}})）；Manus 用作 coding agent（[S11]({{< relref "s11-manus-ai-native-work.md" >}})）；OpenClaw 个人 agent harness（[S08]({{< relref "s08-openclaw-intent-engineering.md" >}})）；Langfuse 内部的改进 agent（[S01]({{< relref "s01-langfuse-building-agents.md" >}})）；HeyGen 写 HTML 的视频 agent（[S19]({{< relref "s19-heygen-html-is-all-your-agents-need.md" >}})） |
| L6 AI-native 系统 | agent 不经编排地互相协作（讲者预测）（[M02]({{< relref "m02-microsoft-enterprise-agents.md" >}})）；验证智能体靠失败记录改进自己（倾向，人仍在评审）（[B05]({{< relref "b05-meta-beyond-screenshots.md" >}})）；OpenClaw 讲者描述的开发工厂，agent 写、审、验证、发布（接近）（[S08]({{< relref "s08-openclaw-intent-engineering.md" >}})）；Manus 内部的 AI-native 研发系统（接近）（[S11]({{< relref "s11-manus-ai-native-work.md" >}})）；Nowledge 团队的半闭环 RSI（[S36]({{< relref "s36-nowledge-memory-engineering.md" >}})）；未来不远的自进化机器人（硬套最接近）（[S34]({{< relref "s34-futuring-robot-home-service-robots.md" >}})） |

</div>

重心落在 L3 的工具（网关、读网页、语义运行时）和 L5 的 agent；L1 没有案例；L6 只有预测、倾向和“接近”的系统，还没有跑起来、人完全退出评审的完整案例。沙箱、推理、存储这类 agent 底下的基础设施不算 AI 产品，没有列入。

## 场次

### 11-05 周四 · 主舞台

- 09:35 M01 [Opening with swyx]({{< relref "m01-swyx-opening.md" >}})：Shawn "swyx" Wang（视频） · AI Engineer / Latent Space
- 09:45 M02 [From Models to Working Enterprise Agents]({{< relref "m02-microsoft-enterprise-agents.md" >}})：Marco Casalaina · Microsoft
- 10:10 S01 [Building Agents: Yesterday, Today, Tomorrow]({{< relref "s01-langfuse-building-agents.md" >}})：Clemens Rawert · Langfuse by ClickHouse
- 10:25 S02 [When we can do anything, do we still know what we want?]({{< relref "s02-ryo-lu-what-we-want.md" >}})：Ryo Lu · ex-Cursor
- 10:50 S03 [Post-Training at the Frontier: Teaching Open Models to Search and Browse the Web]({{< relref "s03-youcom-post-training-search.md" >}})：David Li、Alex Triplett · You.com
- 11:10 S04 [Full-Stack Inference Engineering: Latency, Throughput and Cost]({{< relref "s04-baseten-full-stack-inference.md" >}})：Chen Wang · Baseten
- 11:25 S05 [Measure the frontier of AI for real world use]({{< relref "s05-arena-measure-the-frontier.md" >}})：Chen Peng · Arena
- 13:00 S06 [圆桌：Community in the AI era]({{< relref "s06-panel-community-ai-era.md" >}})：AJ、Koji、Kai Qu；主持 高宁 · WaytoAGI、Crossing / 真格、42 Chapters、Linkloud
- 13:45 S07 [From Model Intelligence to Agent Harness: Enabling Long-Horizon Agents]({{< relref "s07-stepfun-agent-harness.md" >}})：Ailing Teng · StepFun（阶跃星辰）
- 14:05 S08 [Dark Factory to Lobsterville: Intent Engineering for Persistent Multiplayer Agents]({{< relref "s08-openclaw-intent-engineering.md" >}})：Vincent Koc · OpenClaw Foundation
- 14:30 S09 [On-Device AI: Bringing Intelligence Closer to Everyone]({{< relref "s09-autoark-on-device-ai.md" >}})：Alex · AutoArk
- 14:50 S10 [Kubernetes Is Not Your Sandbox]({{< relref "s10-daytona-k8s-is-not-your-sandbox.md" >}})：Mislav Ivanda · Daytona
- 15:10 S11 [AI-Native Work at Manus: One Monorepo, Open Tasks]({{< relref "s11-manus-ai-native-work.md" >}})：范斌（Fan Bin） · Manus AI
- 15:35 S12 [Powering open source personal agents with Exa search]({{< relref "s12-exa-personal-agent-search.md" >}})：Jakub Hojsan · Exa
- 15:55 S13 [Your Agent's Memory Is Next Quarter's Training Data]({{< relref "s13-zilliz-memory-is-training-data.md" >}})：郭人通（Rentong Guo） · Zilliz
- 16:15 M03 [Building a reliable, multi-region LLM gateway]({{< relref "m03-optiver-multi-region-llm-gateway.md" >}})：Xinghong Fang · Optiver
- 16:40 S14 [Nobody Planned AI Infra: How AI Builders Pushed a Database Beyond the Database]({{< relref "s14-tidb-nobody-planned-ai-infra.md" >}})：Lux Li · TiDB / PingCAP
- 17:10 S15 [Optimizing Organization-Wide LLM Inference Cost: Seat License, Pay-per-Token, or Provisioned, and Beyond]({{< relref "s15-techcombank-inference-cost.md" >}})：Do Tuan Anh · Techcombank
- 17:25 S16 [Reinforcement Learning at Scale on Agent Substrate: Orchestrating Millions of Sandboxes]({{< relref "s16-google-rl-sandboxes-at-scale.md" >}})：Tinsley Shi · Google
- 17:35 S17 [Life of a Game Developer in AI era]({{< relref "s17-kimi-game-dev-in-ai-era.md" >}})：唐飞虎（小岛老师） · Kimi / Moonshot AI

### 11-05 周四 · AI 应用分会场（下午，与主舞台并行）

- 13:45 B01 [Building a Personal Agent for Growth with YouMind]({{< relref "b01-youmind-personal-agent-for-growth.md" >}})：Baoping Wang（Yubo） · YouMind
- 14:05 B02 [Trust Your Own Evals, Not the Leaderboard: What 10k+ Internal Agent PRs Taught Us About Adopting Open Models]({{< relref "b02-harvey-trust-your-own-evals.md" >}})：Joey Wang · Harvey
- 14:20 B03 [Beyond the Pilot: Managing Your 500th AI Agent]({{< relref "b03-dify-managing-500th-agent.md" >}})：Andy Wang · Dify
- 14:40 B04 [Beyond Reasoning: Building Infrastructure for AI Agents That Act]({{< relref "b04-visa-infra-for-agents-that-act.md" >}})：Robert Pei · Visa
- 14:55 B05 [Beyond Screenshots: Building Agent-Native Verification for Mobile Apps]({{< relref "b05-meta-beyond-screenshots.md" >}})：Peng Gong · Meta / Instagram
- 15:10 B06 [Agentic Harness: Real-Time Audio and Video AI Interviews]({{< relref "b06-cookiy-agentic-harness.md" >}})：Davin YC Dong · Cookiy Labs
- 15:30 B07 [Your Repo. Your Benchmark.]({{< relref "b07-agoda-your-repo-your-benchmark.md" >}})：Roman Shirochenko · Agoda
- 15:40 B08 [Trusted Context: Building the Layer Between Enterprise Data and AI Agents]({{< relref "b08-datahub-trusted-context.md" >}})：Alyssa Lee · DataHub
- 15:50 B09 [The Harness Is the First Reviewer]({{< relref "b09-data4life-harness-is-first-reviewer.md" >}})：Peter Hoffmann · Data4Life Asia
- 16:15 B10 [Your Data Agent Needs More Than a Knowledge Graph: From Semantic Layers to Executable Ontologies with Apache Ossie]({{< relref "b10-datusai-executable-ontologies.md" >}})：Harrison Zhao · DatusAI
- 16:35 B11 [From Idea to Viral Launch: How I Built a 3D Little Prince Game with AI]({{< relref "b11-sac-idea-to-viral-launch.md" >}})：Sac · 独立开发者
- 16:45 B12 [From Matching to Delivery: Scaling Creator Partnerships with AI]({{< relref "b12-ahacreator-matching-to-delivery.md" >}})：Susan Peng · AhaCreator

### 11-06 周五 · 主舞台

- 10:05 S18 [Taxonomy of World Models]({{< relref "s18-world-labs-taxonomy-of-world-models.md" >}})：Christoph Lassner · World Labs
- 10:25 S19 [HTML is all your agents need: Redefining Context Engineering]({{< relref "s19-heygen-html-is-all-your-agents-need.md" >}})：Bin Liu · HeyGen
- 10:45 S20 [AGI is decoding. Encoding is the moat.]({{< relref "s20-chiling-encoding-is-the-moat.md" >}})：杨颖（Ying Yang） · 驰领传悦
- 11:10 S21 [AI in Manufacturing: The Last Mile Is Half the Journey]({{< relref "s21-hicap-ai-in-manufacturing.md" >}})：Shihui Zhu · 海维软件（HICAP Group）
- 11:25 S22 [Trusting Evals I Can't Read]({{< relref "s22-daily-trusting-evals-i-cant-read.md" >}})：James Hush · Daily.co
- 11:40 S23 [The Good, the Bad and the Ugly: What 3,000 live sessions taught us about streaming speech-to-text]({{< relref "s23-nus-streaming-stt.md" >}})：Satvik Sinha · AICET, NUS
- 13:15 S24 [圆桌：AI startups: products, markets & what comes next]({{< relref "s24-panel-ai-startups-vc.md" >}})：戴雨森、王怀南、Patrick Liu；主持 Bibi · 真格、线性资本、TaoZ Capital、第二次用火
- 13:55 S25 [Stronger Models, Leaner Harnesses: What to Control and What to Let Go]({{< relref "s25-minimax-leaner-harnesses.md" >}})：Ronny He · MiniMax
- 14:15 S26 [Beyond Vision-Language-Action: First Principles for Building Physical AI]({{< relref "s26-aimoga-beyond-vla.md" >}})：何文智 · AiMoga Robotics
- 14:35 S27 [From 3D Generation to World Models: Building Persistent Interactive Worlds for Physical AI]({{< relref "s27-vast-3d-to-world-models.md" >}})：Gavin Luo · VAST / Tripo AI
- 14:50 S28 [How We're Building Open Decision Models for On-Device Agents]({{< relref "s28-liquid-ai-decision-models.md" >}})：Leonie Monigatti · Liquid AI
- 15:05 S29 [Communication Among Sovereign Agents: The Foundation of Agent Economy]({{< relref "s29-masons-sovereign-agents.md" >}})：Mingke Luo · masons.ai
- 15:30 S30 [Real2Real: A Quantum Embodied AI Paradigm for Optimal Behaviors Generation]({{< relref "s30-quantsparkle-real2real.md" >}})：Dicong "David" Qiu · 数耀量生（QuantSparkle.ai）
- 15:50 S31 [Noe-0: A World Action Model Built on Real-World Human Experience]({{< relref "s31-noematrix-noe-0.md" >}})：吕俊（Jun Lv） · Noematrix
- 16:05 S32 [Building Robot Hardware for Rapidly Evolving Models]({{< relref "s32-dyna-robot-hardware.md" >}})：Zhong Shen · DYNA
- 16:25 S33 [Should This Agent Be Allowed to Do That?]({{< relref "s33-1password-agent-intent-check.md" >}})：Grace Li · 1Password
- 16:40 S34 [From Hardware to Intelligence: Home Service Robots]({{< relref "s34-futuring-robot-home-service-robots.md" >}})：郑浩（Hao Zheng） · 未来不远（Futuring Robot）
- 17:00 S35 [Robot Data Needs a Build System]({{< relref "s35-lancedb-robot-data-build-system.md" >}})：丁皓（Xuanwo） · LanceDB
- 17:10 S36 [Memory Engineering, RSI and Team Knowledge Layer]({{< relref "s36-nowledge-memory-engineering.md" >}})：Siwei Gu · Nowledge Labs
- 17:20 S37 [Reading the Web at Trillion-Token Scale]({{< relref "s37-jina-reading-the-web.md" >}})：王延龙（Yanlong Wang） · Jina AI by Elastic
