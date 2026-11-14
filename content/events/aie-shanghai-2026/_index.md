---
title: "AIE 上海 2026"
description: "AI Engineer 上海 2026（2026-11-05 至 11-06）逐场记录。"
lang: zh
---

AI Engineer 大会 2026 年 11 月 5 日至 6 日在上海举行。这里每场一页，记讲者的主要论断、关键原话、例子与数字，以及没听清或需要核对的地方。

S 编号的场次据作者现场录音整理。M、B 编号的场次（主舞台部分场次和 11-05 下午的 AI 应用分会场）据现场外部录音整理，未与本人录音对照。

官方录像由 AI Engineer 在 YouTube 陆续放出，见 [AI Engineer Shanghai 播放列表](https://www.youtube.com/playlist?list=PLJOBv2QjD2Xc)。截至 2026-11-10 只放出 1 场（S02），已放出的场次在页首「视频」一栏给出链接。

## 知识地图

这张知识地图把 52 场演讲的核心判断、具体数字、算账公式与路线交锋，按**工程与商业演进的六个核心问题**串联起来——从底层的模型后训练与推理经济账，到上下文与记忆底座、Harness 架构与沙箱治理、从生成走向验证（Proof）的评测门禁，再到 AI-Native 组织、产品交互、安全权限与商业护城河，以及向物理世界延伸的 Physical AI。

每一节先给出**「旧直觉 → 2026.11 新前沿」**的认知刷新表，再将各场次的实证数字、客户案例和 `⚠️` 口径提醒直接嵌在推导链下；两场以上针锋相对的观点用 **⚔️（路线交锋）** 标出，看着相反、实则针对不同层级或约束的标为 **🔍（对照）**。最后附有全场 52 场次主题索引表与 L0–L6 产品分层副表。

### 全景速查：六大核心专题与 52 场次导览

<div class="aie-map-table">

| 专题与核心问题 | 子议题脉络 | 覆盖场次（点击直达单场纪要） |
|---|---|---|
| **一、模型后训练、端侧推理与算力经济账**<br>自己还训不训模型？哪些调用拆给端侧？买 API 还是自租 GPU？网关怎么防静默丢状态？ | 1. 小数据 RLVR vs 留 Harness<br>2. 长程选型、一次前向决策模型与端侧 35B MoE<br>3. 跨云 KV Cache 路由与有状态薄网关<br>4. 830 亿 Token 临界点与并发冗余账 | **主修**：[S03]({{< relref "s03-youcom-post-training-search.md" >}}) [S07]({{< relref "s07-stepfun-agent-harness.md" >}}) [S28]({{< relref "s28-liquid-ai-decision-models.md" >}}) [S09]({{< relref "s09-autoark-on-device-ai.md" >}}) [S04]({{< relref "s04-baseten-full-stack-inference.md" >}}) [S15]({{< relref "s15-techcombank-inference-cost.md" >}}) [M03]({{< relref "m03-optiver-multi-region-llm-gateway.md" >}})<br>**交叉**：[S01]({{< relref "s01-langfuse-building-agents.md" >}}) [B06]({{< relref "b06-cookiy-agentic-harness.md" >}}) [S36]({{< relref "s36-nowledge-memory-engineering.md" >}}) |
| **二、上下文工程、记忆机制与企业语义底座**<br>上下文长什么形状？怎么控万亿网页检索预算？千亿条记忆怎么存与忘？怎么防 Agent 算错财务数？ | 1. 弃私有 JSON 改 HTML 与仓库级 Context MR<br>2. 机器搜索升级链与对数正态分布账单<br>3. 三层 Lakebase 永存与 FSRS 主动衰减<br>4. 可信上下文层与确定性语义编译器 | **主修**：[S19]({{< relref "s19-heygen-html-is-all-your-agents-need.md" >}}) [S12]({{< relref "s12-exa-personal-agent-search.md" >}}) [S37]({{< relref "s37-jina-reading-the-web.md" >}}) [S13]({{< relref "s13-zilliz-memory-is-training-data.md" >}}) [S36]({{< relref "s36-nowledge-memory-engineering.md" >}}) [B08]({{< relref "b08-datahub-trusted-context.md" >}}) [B10]({{< relref "b10-datusai-executable-ontologies.md" >}})<br>**交叉**：[S03]({{< relref "s03-youcom-post-training-search.md" >}}) [S25]({{< relref "s25-minimax-leaner-harnesses.md" >}}) [B07]({{< relref "b07-agoda-your-repo-your-benchmark.md" >}}) |
| **三、Harness 架构演进、沙箱运行时与规模化治理**<br>模型变强后 Harness 该加还是该减？为什么 K8s 不是你的沙箱？怎么管第 500–2000 个 Agent？ | 1. 删过程拐杖 vs 补 22h–48h 跨天状态<br>2. 单循环收敛、CLI/PTC 保缓存与实时三子 Agent 级联<br>3. 短命有状态沙箱、百万 RL 沙箱与算存分离 DB<br>4. 反向依赖追溯、三段审计与独立 Entra ID | **主修**：[S25]({{< relref "s25-minimax-leaner-harnesses.md" >}}) [S07]({{< relref "s07-stepfun-agent-harness.md" >}}) [S01]({{< relref "s01-langfuse-building-agents.md" >}}) [B06]({{< relref "b06-cookiy-agentic-harness.md" >}}) [S10]({{< relref "s10-daytona-k8s-is-not-your-sandbox.md" >}}) [S16]({{< relref "s16-google-rl-sandboxes-at-scale.md" >}}) [S14]({{< relref "s14-tidb-nobody-planned-ai-infra.md" >}}) [B03]({{< relref "b03-dify-managing-500th-agent.md" >}})<br>**交叉**：[M02]({{< relref "m02-microsoft-enterprise-agents.md" >}}) |
| **四、从生成到验证（Proof）：评测体系与质量门禁**<br>没人读得过来代码时怎么验收？公开榜单为何失灵？怎么抓 90% 覆盖率假单测？月烧 $127 万 CI 怎么破？ | 1. Proof Engineering 与 Check the Checkers<br>2. 500 万会话 RCT vs 万级 PR/十万级 MR 回放<br>3. 变异测试反作弊、旧系统 Oracle 与 App 暴露语义/CLI<br>4. 关掉 main 同步 CI 改定时跑与 Adaptive Testing | **主修**：[S08]({{< relref "s08-openclaw-intent-engineering.md" >}}) [S22]({{< relref "s22-daily-trusting-evals-i-cant-read.md" >}}) [S05]({{< relref "s05-arena-measure-the-frontier.md" >}}) [B02]({{< relref "b02-harvey-trust-your-own-evals.md" >}}) [B07]({{< relref "b07-agoda-your-repo-your-benchmark.md" >}}) [S23]({{< relref "s23-nus-streaming-stt.md" >}}) [B09]({{< relref "b09-data4life-harness-is-first-reviewer.md" >}}) [B05]({{< relref "b05-meta-beyond-screenshots.md" >}})<br>**交叉**：[S17]({{< relref "s17-kimi-game-dev-in-ai-era.md" >}}) [S14]({{< relref "s14-tidb-nobody-planned-ai-infra.md" >}}) [B06]({{< relref "b06-cookiy-agentic-harness.md" >}}) |
| **五、AI-Native 组织、产品交互、安全与商业护城河**<br>单人跑百个 Agent 怎么协同？工具做成工作台还是窗口？怎么拦越权调用？面对 20 倍补贴壁垒在哪？ | 1. 单一 Mono 仓、任务全公开与注意力守恒<br>2. 工作台三原则、ToM（给自己看）与多机位盲审 Loop<br>3. 独立 Entra ID、本地 400M 意图裁判与 Scoped Token/主权交换<br>4. 第一方 20x 补贴 vs 隐性群岛填海、无 API 车间真瓶颈与带单撮合 | **主修**：[S11]({{< relref "s11-manus-ai-native-work.md" >}}) [S17]({{< relref "s17-kimi-game-dev-in-ai-era.md" >}}) [B11]({{< relref "b11-sac-idea-to-viral-launch.md" >}}) [S02]({{< relref "s02-ryo-lu-what-we-want.md" >}}) [B01]({{< relref "b01-youmind-personal-agent-for-growth.md" >}}) [S20]({{< relref "s20-chiling-encoding-is-the-moat.md" >}}) [S21]({{< relref "s21-hicap-ai-in-manufacturing.md" >}}) [B12]({{< relref "b12-ahacreator-matching-to-delivery.md" >}}) [M02]({{< relref "m02-microsoft-enterprise-agents.md" >}}) [S33]({{< relref "s33-1password-agent-intent-check.md" >}}) [B04]({{< relref "b04-visa-infra-for-agents-that-act.md" >}}) [S29]({{< relref "s29-masons-sovereign-agents.md" >}}) [S24]({{< relref "s24-panel-ai-startups-vc.md" >}}) [S06]({{< relref "s06-panel-community-ai-era.md" >}}) [M01]({{< relref "m01-swyx-opening.md" >}})<br>**交叉**：[S36]({{< relref "s36-nowledge-memory-engineering.md" >}}) [S08]({{< relref "s08-openclaw-intent-engineering.md" >}}) [S37]({{< relref "s37-jina-reading-the-web.md" >}}) |
| **六、Physical AI：世界模型、具身硬件与数据构建底座**<br>世界模型怎么分类与分工？硬件怎么追每周一变的模型？机器人数据从哪来、怎么增量构建？ | 1. 四维分类学与“灰盒程序管状态 + 5B 模型管画面”<br>2. 力觉第一性、物理结果验证与独立 PLC 安全隔离<br>3. 弃谐波改行星减速器的可预测硬件与时序对齐<br>4. 30 万小时无本体采集 / 家庭回流未执行轨迹 + Lance 构建系统 | **主修**：[S18]({{< relref "s18-world-labs-taxonomy-of-world-models.md" >}}) [S27]({{< relref "s27-vast-3d-to-world-models.md" >}}) [S26]({{< relref "s26-aimoga-beyond-vla.md" >}}) [S30]({{< relref "s30-quantsparkle-real2real.md" >}}) [S31]({{< relref "s31-noematrix-noe-0.md" >}}) [S32]({{< relref "s32-dyna-robot-hardware.md" >}}) [S34]({{< relref "s34-futuring-robot-home-service-robots.md" >}}) [S35]({{< relref "s35-lancedb-robot-data-build-system.md" >}}) |

</div>

---

### 一、模型后训练、端侧推理与算力经济账

<div class="aie-map-table">

| 核心问题 | 旧直觉 / 常见误区 | 2026.11 前沿判断与做法 | 代表场次 |
|---|---|---|---|
| **能力获取与后训练** | 等大模型自然泛化；或把动态团队知识微调进权重；想少调工具就得加效率惩罚奖励。 | 垂直能力“做了就有、没做就没有”；用中等热度网页 + `pass@8`（留答对 1–7 次）做小数据 RLVR，**不加效率奖励工具调用自降 95%**；动态团队脉络留在 Harness 编译为 Adapter。 | [S07]({{< relref "s07-stepfun-agent-harness.md" >}}) [S03]({{< relref "s03-youcom-post-training-search.md" >}}) [S36]({{< relref "s36-nowledge-memory-engineering.md" >}}) [B06]({{< relref "b06-cookiy-agentic-harness.md" >}}) |
| **模型拆解与端侧部署** | 让生成式 LLM 逐 token 吐 JSON 做小判断；以为 35B 模型受限于手机 2G 内存跑不动。 | 把 `yes/no/score/choice` 拆给**端侧一次前向决策模型**（去因果掩码 + LoRA + 温度缩放免 RL）；手机端常驻 3%–10% 活跃专家 + **后台从 SSD 异步预取下一 token 专家**，用 2G 内存跑通 35B MoE。 | [S28]({{< relref "s28-liquid-ai-decision-models.md" >}}) [S09]({{< relref "s09-autoark-on-device-ai.md" >}}) |
| **推理集群、网关与 TCO** | 单机跑 vLLM 就够了；用开源网关做协议互译、Postgres 记日志；买 API 还是自建凭感觉定。 | 跨云集群靠 **KV Cache 亲和路由**保 P90 延迟；网关**弃用协议翻译**防静默丢加密 `thinking block`；盯紧“每百万 token 有效混合单价”，跨过 **830 亿 token/月**切自租 GPU 并留 10% API 兜底波峰。 | [S04]({{< relref "s04-baseten-full-stack-inference.md" >}}) [M03]({{< relref "m03-optiver-multi-region-llm-gateway.md" >}}) [S15]({{< relref "s15-techcombank-inference-cost.md" >}}) |

</div>

#### 1. 能力从哪来：基模垂直补课与小数据 RLVR 配方
- **有些能力做了就有、没做就没有，不能干等泛化**：阶跃星辰为解决代码 Bug 修复与重构自建自定义仓库/语言的 `codebench`（专家评测中约**七成**认为能自主完成复杂 coding ⚠️ 未给基线），后训练数据流程优化使准确率从 **53.3% 升至 60%**（⚠️ 未说明具体任务），并于 6 月发起“美育计划”先灌领域知识再训审美判断，专设 `model product` 与 `product engineer` 挖掘前沿场景塞进训练管线。 — [S07]({{< relref "s07-stepfun-agent-harness.md" >}})
- **小数据 RLVR 训搜索 Agent：中等热度网页 + `pass@8` 筛题，不加效率奖励工具调用骤降 95%**：You.com 指出 RL 数据集比训练框架更重要。热门网页已被预训练背下（模型直接从权重掏答案不学调工具），冷门网页多垃圾，必须用覆盖数千亿网页的 Web Graph 切取几千个**中等热度（medium popularity）网站**出题，再用基座模型跑 **`pass@8` 只保留答对 1–7 次的题**（丢掉全对和全错）。仅用 **5,000 条拒绝采样 SFT 轨迹 + 1,500 个 RL 任务 + 8 小时纯 RLVR（GRPO，零人工标注）**，开源 30B 模型在 BrowseComp 上从 **37 分升至 45.45 分（+22%，其中 SFT 约 +3 分、RL 约 +5.5 分）**；最关键的是**未设任何效率奖励**，但模型学会验证答案真伪后找对即停，一道多跳并购题从后训练前的 **313 次工具调用（150 次搜索 + 118 次抓取）、130 万 token 且答错**，降到 **7 次工具调用（3 次搜索 + 1 次抓取）、7 万多 token 且答对**（⚠️ 效率对比为单题案例，8 小时未披露卡数）。 — [S03]({{< relref "s03-youcom-post-training-search.md" >}})
- **⚔️ 路线交锋：应用团队自己训还是不训（进权重 vs 留 Harness）**：
  - **主张训权重**：Langfuse 预测顶尖团队下一步会把改进循环攒下的带标签失败轨迹变成 Task + Verifier，自建 RL 环境训饱和开源模型（[S01]({{< relref "s01-langfuse-building-agents.md" >}})）；Baseten 强调在自有任务上微调是为了**不把最值钱的客户信号（customer signal）白送给闭源模型厂**（[S04]({{< relref "s04-baseten-full-stack-inference.md" >}})）。
  - **主张留 Harness**：Nowledge Labs 与康奈尔研究者合作，尝试把动态团队上下文训进模型参数，**9 个实验场景只有 3 个有正收益**，反而是将团队知识**编译成 `Harness Adapter`** 直接喂给 Harness 全面胜出（[S36]({{< relref "s36-nowledge-memory-engineering.md" >}})）；Cookiy Labs 将 **8,000 字冲突中文 System Prompt 砍到约 1/3** 就更快更好（⚠️ 未给量化数字），坚持未来一年内绝不碰后训练（唯一例外是改模型性格，[B06]({{< relref "b06-cookiy-agentic-harness.md" >}})）。
  - **判断边界**：有客观自动 Verifier 的静态工具本能或高频分类适合小数据 RLVR/LoRA；随时间高频演进的团队脉络与缺乏客观评判标准的早期产品，必须留在 Harness。

#### 2. 模型怎么选与怎么拆：长程四指标、一次前向决策模型与端侧 35B MoE
- **长程 Agent 主力模型看四项工程指标**：当任务拉长到几千步（如单张 H100 做 Kernel 优化持续迭代 **22 小时**、Pokemon 实验跑 **3,000 多轮 / 耗 600 万 token**、业界长程任务达 **26–48 小时**），单步开销会被乘上几千倍，选型必须同看：**① 激活参数**（如旗舰模型每 token 激活 **27B**）、**② 1M 长上下文**（实践证明仅在**容纳代码、长文档、任务记录**三类场景值得用满）、**③ 原生视觉**（看 UI 截图/渲染结果做自我验证必需品）、**④ 工具调用稳定性**。 — [S07]({{< relref "s07-stepfun-agent-harness.md" >}})
- **把高频小判断从“生成”里剥离，做成端侧一次前向决策模型**：Agent 循环里大量调用只需回答 `yes/no`、`score`、`choice`，没必要逐 token 生成。Liquid AI 用三步将小模型改造成 **Decision Models**：① 把分类任务转为统一模板做 **LoRA 微调**（实测在消除选项位置偏差与负面偏好上优于全参数微调）；② **去掉 decoder 因果掩码（Lift the Causal Mask）改为双向注意力**；③ **用温度缩放（Temperature Scaling）校准置信度，完全不需要强化学习（RL）**。一次前向传播即可给出答案与把握度（如设定低于 90% 阈值直接弃答 ⚠️ 90% 为举例），已训出纯文本与带视觉两个端侧小模型（⚠️ 疑为 sub-billion 量级，因录音质量差待核）。 — [S28]({{< relref "s28-liquid-ai-decision-models.md" >}})
- **端侧内存墙突破：iPhone 16 Pro 用 2G 内存跑 35B MoE + 预览 150B 端侧多模态 MoE**：AutoArk 按算力将硬件切为三档（耳机/眼镜跑 0.1B 打包进 EvaSDK 并提供一行命令装进 Claude Code 的 agent skill；手机跑 35B MoE；笔记本/座舱预览占 **18–24G 内存**、prefill **>1000 tok/s**、decode **>100 tok/s** 的 **150B MoE 多模态模型** ⚠️ 厂商自报）。手机端破内存墙的核心是**只把 3%–10% 活跃专家留在 2G 内存里，单独预训练一个轻量模块在当前 token 推理时实时预测后续几个 token 所需专家，从 SSD 后台异步预取进内存**。 — [S09]({{< relref "s09-autoark-on-device-ai.md" >}})

#### 3. 推理集群、多区域网关与算力经济账
- **全栈推理：单机少算少搬，跨云集群靠 KV Cache 亲和路由**：单 GPU 上的 Prefill-Decode（PD）分离、chunked prefill、量化与投机解码本质是“少算、少搬数据、把硬件喂饱”；到了生产级跨云集群，路由不仅看物理距离和容量，**必须看 KV Cache 匹配度（把请求发往已缓存匹配长前缀的节点）**并配多级存储卸载，才能跑出 **99.99%（四个 9）** 可靠性（相比裸跑基线提升几个数量级）。 — [S04]({{< relref "s04-baseten-full-stack-inference.md" >}})
- **多区域网关减法工程：LLM 请求强有状态，HTTP 200 不等于成功**：Optiver 管理跨 **4 大洲数据中心、日均 300 万次请求**（22 个模型占 95% 流量）。踩坑某流行开源网关后发现：**① 协议互译会静默丢掉 Anthropic 的加密 `thinking block`**（⚠️ 口述将加密签名与内容摘要混同），当次返回 HTTP 200，下一轮却因缺失思维链被迫从头重算导致延迟和账单双爆；**② 容灾四铁律**：首包前才做 Failover（流中切厂重算更慢）、**同一会话严格粘在单 Provider**（防破一折前缀缓存致成本翻 **2–3 倍**）、同模型 ID 只暴露两家都支持的功能（交集原则）、平时**固定分 10% 流量给备份通道演练**；**③ 身份全局、推理本地、计费最终一致**：早期把 Prompt 日志写进跨洋主库导致每天传 200GB、Postgres 膨胀到 **4TB**、鉴权慢达 **2 秒**；改为日志直写本地 S3 + 鉴权本地只读副本 + 计费异步最终一致后，**鉴权延迟从 2 秒骤降至 20 毫秒（-99% ⚠️ 未给统计分位数）**，最终放弃协议翻译自建薄网关，并借全链路分布式 Tracing 揪出慢在 **3 分钟的 MCP 工具调用**而非 **17 秒的模型推理**。 — [M03]({{< relref "m03-optiver-multi-region-llm-gateway.md" >}})
- **🔍 对照：企业与硬件的三种算账公式（抠省 92% vs 830 亿临界点自建 vs 5 倍并发冗余）**：
  1. **买断制硬件防“越卖越赔”（省 92%+）**：100 万台智能硬件 × 日均 20 次交互全调云端 API，年成本高达 **10 亿元**；韶音 AI 运动耳机在端侧做 `3A→VAD→ASR→轻量 NLP 意图分流`，高频切歌/查心率全程在本地闭环，仅开放问答上云，**省掉 92% 以上云端 Token 成本**。 — [S09]({{< relref "s09-autoark-on-device-ai.md" >}})
  2. **企业平台自租 GPU 临界点公式（省 30%–50%）**：Techcombank 全组织紧盯唯一北极星指标**“每百万 token 有效混合单价”**（全员追捧 Opus 会使其指数级攀升）。从按量付费切自租 GPU 的临界点为：**`月临界 Token 量 = 自租集群月固定成本 ($166K, 16张 B200) ÷ 有效混合单价 ($2/M) = 830 亿 token/月`**。过线切自建预计省 **30%–50%**（如 3,000 亿 token/月从 50 万降至 20 万美元 ⚠️ 口述数字略对不上），但**网关必须保留同模型 Pay-per-Token 做波峰兜底（约 10% 触发 ⚠️ 按时间或请求待核）**，再叠语言/语义路由消除非英语“本地化税”预期额外省 **40%–50%**。 — [S15]({{< relref "s15-techcombank-inference-cost.md" >}})
  3. **高客单价实时交互反其道而行（5 倍并发冗余）**：Cookiy Labs 做 1–2 小时 B2B 用户访谈，最大的成本分母是付给人类受访者的高额报酬，模型费只是零头；为死守 **`< 1.3 秒` 首字语音延迟**与北极星指标 `insight per minute`，**对同一请求向同一个模型并发调 5 次、对多家模型也各调 5 次，谁最快返回就用谁**。 — [B06]({{< relref "b06-cookiy-agentic-harness.md" >}})

---

### 二、上下文工程、记忆机制与企业语义数据底座

<div class="aie-map-table">

| 核心问题 | 旧直觉 / 常见误区 | 2026.11 前沿判断与做法 | 代表场次 |
|---|---|---|---|
| **上下文表示与信噪比** | 让 Agent 读写业务私有 JSON 配置；`AGENTS.md` 和 Skills 写得越详尽越好。 | **先换上下文的形状**：模型写得出私有 JSON 却没法在里面推理，改用 **HTML/CSS/JS 与文件系统**；仓库回放证实精心写的上下文可能反增 8% 成本，**只把人工 Review 连续打回的冲突提为自动 `Context MR`**。 | [S19]({{< relref "s19-heygen-html-is-all-your-agents-need.md" >}}) [B07]({{< relref "b07-agoda-your-repo-your-benchmark.md" >}}) [S25]({{< relref "s25-minimax-leaner-harnesses.md" >}}) |
| **机器搜索与万亿网页账单** | 调通用搜索抓整页塞进窗口；网页转成 Markdown 就算处理完了。 | 机器搜索量已超人类，先读原文 **Highlights**、不够才开 `browser-use`；网页 Token 呈**对数正态分布（均值=4×中位数）**，**千次整页喂模型成本（$9+）已追平互联网广告千次收入（$3–$15）**，必须再压缩。 | [S03]({{< relref "s03-youcom-post-training-search.md" >}}) [S12]({{< relref "s12-exa-personal-agent-search.md" >}}) [S37]({{< relref "s37-jina-reading-the-web.md" >}}) |
| **记忆的存与忘、企业语义层** | 用单机向量库扛全量记忆，存得越多越好；把表结构和知识图谱塞进 Prompt 让模型自由写 SQL。 | **三级记忆漏斗**：底层对象存储（$0.025/GB）全存千亿条轨迹转下季度训练数据，中层加**双时间戳 + FSRS 主动衰减**；企业数据靠**日志挖掘+专家验证的可信上下文层**叠加 **`Apache Ossie` YAML + Rust 确定性语义编译器**拒写脏 SQL。 | [S13]({{< relref "s13-zilliz-memory-is-training-data.md" >}}) [S36]({{< relref "s36-nowledge-memory-engineering.md" >}}) [B08]({{< relref "b08-datahub-trusted-context.md" >}}) [B10]({{< relref "b10-datusai-executable-ontologies.md" >}}) |

</div>

#### 1. 上下文的形状重塑与仓库级信噪比门禁
- **换掉上下文的形状：Agent 写得出你的私有 JSON，却没法在里面推理**：HeyGen 最初在至少 **2,000 行私有 JSON** 上加视频 Agent，结果两段各 4 行的合法 JSON 渲染出来一段正常、另一段文字完全看不见，Agent 光看 JSON 毫无察觉，就像“让莎士比亚写中文诗”。因为前沿实验室把最大算力砸在训练写代码上，HeyGen 彻底废弃私有 JSON，于 2026 年 4 月开源 `HyperFrames`，让 Agent 直接写 **HTML/CSS/JS** 再渲染成 MP4（口述开源半年获约 **80,000 star**、全球第 2 大 skill、日产约 **700,000 条视频**，哪怕四周不加功能产品也随基模升级自动增长 ⚠️ 口述与现场视频的全球第 3 / 日产 50 万条略有出入）。 — [S19]({{< relref "s19-heygen-html-is-all-your-agents-need.md" >}})
- **⚔️ 路线交锋：上下文越完善越好 vs 精心写的上下文反增成本、换仓库反转**：
  - **像珍惜内存一样算信噪比**：MiniMax 指出模型变强后经常出现 `"without skills is better than with skills"`，长任务上下文快满时让模型**自己把状态写进本地文件做 Hand-off**，可能胜过所有精巧设计的压缩算法（[S25]({{< relref "s25-minimax-leaner-harnesses.md" >}})）。
  - **10 万+ MR 回放实测打脸直觉**：Agoda 利用组织每年产出的 **100,000+ 已合并 MR**（⚠️ 未说明全公司或单部门）和 `Harbor` 框架在生产“服务 A”上跑 A/B 回放：① 去掉全部上下文 vs 保留团队精心写的 `AGENTS.md`/skills/架构文档 → **完成率完全相同，带上下文反而多花 8% 成本**；② 上下文压缩工具 `Headroom` 省 50% 成本（⚠️ 原话 `Time cost per task dropped by 50%`），但**测试通过率暴跌 30%（变笨三成）**；③ 某 AST 工具（⚠️ ASR 作 `AST grapify`，疑为 `ast-grep`）在服务 A **省 24% 成本**，搬到另一个仓库测试**结果完全反转、成本反增 30%**！
  - **正确动作**：停止凭空手写长文档，把人工 Code Review 意见（如文档写错把新 contract 放进 `command` 而非 `core` 文件夹，导致连续 **3 个 MR 被打回**）、测试失败和 LLM 行为检查封装进 skill，自动提补丁生成 **`Context MR`**。 — [B07]({{< relref "b07-agoda-your-repo-your-benchmark.md" >}})

#### 2. 外部世界怎么读：最少 Token 检索升级链与万亿网页对数正态经济账
- **机器搜索量已超人类，检索遵循“下一步决策最少 Token”升级链**：搜索网页的 AI Agent 数量已超过人类（[S03]({{< relref "s03-youcom-post-training-search.md" >}})）。Exa 为个人 Agent 将索引从 **1,000 亿网页、15 分钟入库新闻、300 万+ 播客全文**扩充至 **2 亿+ 地点（POI，含菜单与价格）**（如在上海搜出 43 家蟹黄面逐层过滤）；调用时第一步**只抽取高密度原文片段（Highlights）进上下文、绝不拉整页**，仅在需看店内实景照片或核对实时余票时才升级拉起 `browser-use`。 — [S12]({{< relref "s12-exa-personal-agent-search.md" >}})
- **万亿网页读取的统计真相：对数正态分布（均值 = 4× 中位数）与广告 CPM 成本倒挂**：Jina AI 基于 `Jina Reader` 无头浏览器渲染后台揭示：原始 HTML 中位数约 **30K token** → 转 Markdown 后中位数降至 **4.5K–5K token**（再去链接和图片可压至 **3K**），但因呈**对数正态分布，平均数约为中位数的 4 倍（~18K–20K token）**！按中位数算，**每 1,000 个页面整页直接喂主流大模型成本 ≥ $9（国产模型 ≥ $3），已与传统互联网广告每千次浏览收入（CPM $3–$15）处于同一量级**；必须先用专用小模型或切分重排把底价压到 **0.45**（⚠️ 单位应为 $/千次）。随着匿名 Agent 访问占比半年从 **20% 涨到 36.9%**，免费网页可能保不住。 — [S37]({{< relref "s37-jina-reading-the-web.md" >}})

#### 3. 记忆的三级漏斗与企业结构化数据的确定性防线
- **🔍 对照：记忆的“存”与“用”——底层全留千亿条转训练数据，上层靠双时间戳与 FSRS 主动遗忘**：
  1. **底层物理存储（全存不删）**：Zilliz 指出任务每跳一级 Token 消耗涨 10 倍，最大单一客户业务数据从**前年 10 亿 → 去年百亿 → 今年千亿条（每年涨一个数量级）**；数据涨百倍千倍再用单机有限内存硬扛就像“端扎啤杯接酒”（某头部编程应用几个月换 **4 套数据库**才转向对象存储）。必须构建以对象存储为底的 **Lakebase 热（$3/GB/月）、温（$0.3）、冷（$0.025）三层架构**（每层差 10 倍，仅把 **3%–15% 日活**放顶层，不活跃用户登录**秒级动态提层**），同一份底数既服务线上实时召回，又供离线挑出失败 trace 变成**下季度的后训练数据**。 — [S13]({{< relref "s13-zilliz-memory-is-training-data.md" >}})
  2. **中上层记忆工程（会衰减、懂脉络）**：Nowledge Labs 同样先把原始轨迹全存为 episodic memory，但强调给 Agent 消费时**“做得差的记忆不如没有，知识衰减（decay）是 feature 而不是 bug”**——针对纯检索型（retrieval-based）评测的盲区自建 **40–50 维**评测，强制维护**事件发生时间 + 记录创建/修改时间**双时间戳与按天 Working Memory，并用背单词的 **FSRS 间隔重复算法 + 使用反馈**算衰减权重（[S36]({{< relref "s36-nowledge-memory-engineering.md" >}})）；个人记忆则须区分**“是谁的偏好（如同行朋友不吃辣）× 影响哪个计划”**，后台主动提醒须日历+预算+余票**全条件满足**才打扰（[S12]({{< relref "s12-exa-personal-agent-search.md" >}})）。
- **🔍 对照：企业数据防算错的两道防线——可信上下文层（`B08`）+ 可执行语义编译器（`B10`）**：
  - **为什么 Agent 会自信算错 2,400 万美元？** 人类看到怪数字会在进 PPT 前复核，Agent 不会。DataHub 演示信贷员问高风险商业地产贷款，无上下文时 Agent 自己瞎猜 80% LTV 阈值算出 **900 万美元**；接入 DataHub 正式术语定义（76% LTV）后实为 **6 笔共 3,300 万美元**（⚠️ 演示案例）。解法是用 `Generate（从查询日志/BI 自动挖掘）→ Validate（专家验证）→ Activate（带 Trust Grade 分发）` 替代手写字典（Miro 准确率从 **~50% 升至 90%**，Pinterest 10 倍用量、人工文档少 **70%** ⚠️ 少 70% 紧跟 Pinterest 后但归属未明说），并坚持**“业务定义用厂商中立格式自持，底层上下文设施外采”**。 — [B08]({{< relref "b08-datahub-trusted-context.md" >}})
  - **为什么知识图谱塞 Prompt 还是会算错数？** DatusAI 指出知识图谱只管“事物是什么”，管不了关系库粒度（Grain）——一趟航班 **120 名乘客**去 Join 延误表触发 **Fan-out（扇出膨胀）**，会被大模型算成 **330 人**。必须基于开放规范 **`Apache Ossie`（纯 YAML ⚠️ ASR 亦作 `dossi`）**只给 Agent 暴露**指标层宽表接口**，底下用 **Rust 编写的语义编译器**生成 **20+ 方言确定性 SQL**（⚠️ 厂商自报比上代快 **10–100 倍**），在**编译期直接拒绝 Fan-out、错误聚合与越界值域（如拦截工单 status 中非 `open/resolved` 的脏取值）**，顶层仅加**映射、值域规则、关系**三组件本体替代向量搜索找表。 — [B10]({{< relref "b10-datusai-executable-ontologies.md" >}})

---

### 三、Harness 架构演进、沙箱运行时与规模化治理

<div class="aie-map-table">

| 核心问题 | 旧直觉 / 常见误区 | 2026.11 前沿判断与做法 | 代表场次 |
|---|---|---|---|
| **Harness 加减法与工具协议** | 叠系统提示词、Todo/Plan 状态机与多 Subagent；动态挂大量 MCP 工具逐轮 JSON 往返。 | **过程控制做减法**（砍 80% 提示词、去 todo/plan、立四问消融门禁），**跨天长程状态与验证做加法**；工具收进 **`connector CLI` 保前缀缓存 + `PTC` 脚本一次批量并发调用**。 | [S25]({{< relref "s25-minimax-leaner-harnesses.md" >}}) [S07]({{< relref "s07-stepfun-agent-harness.md" >}}) [S01]({{< relref "s01-langfuse-building-agents.md" >}}) [B06]({{< relref "b06-cookiy-agentic-harness.md" >}}) |
| **沙箱运行时与 Agent 数据库** | 在 K8s 上挂 EBS 卷跑有状态沙箱；以为 RL 沙箱慢只是效率问题；按 DAU 用户数估数据库容量。 | **K8s 挂 EBS 会让 IOPS 跌 10 倍、单机密度砍 2/3**；RL 沙箱故障会**变成错误 Reward 污染模型权重**，用预热池+亚秒级快照消 80% 空等；工作区**算存分离**防回收丢项目，支撑**上千万个隔离小数据库**。 | [S10]({{< relref "s10-daytona-k8s-is-not-your-sandbox.md" >}}) [S16]({{< relref "s16-google-rl-sandboxes-at-scale.md" >}}) [S14]({{< relref "s14-tidb-nobody-planned-ai-infra.md" >}}) |
| **千级 Agent 规模化治理** | 重点放在更快造出第 501 个 Agent；只管自家平台原生造的 Agent。 | 跨国企业平均已有 **2,000+ Agent**，难点转向**反向依赖追溯**（模型/隐私法变更查谁受影响）、**法庭级三段审计链**（应对 10% 异常查询）与 **100% 跨平台纳管**。 | [B03]({{< relref "b03-dify-managing-500th-agent.md" >}}) [M02]({{< relref "m02-microsoft-enterprise-agents.md" >}}) |

</div>

#### 1. Harness 的加减法与工具调用重构
- **⚔️ 路线交锋：模型变强后，Harness 到底该做减法还是做加法？**
  - **减法派（砍掉“教模型怎么想”的过程拐杖）**：MiniMax 引述 Claude Code 砍掉 **80% 系统提示词**、承认单强 Agent 胜过多 Subagent、先后去掉 `todo` 和 `plan mode`，并预判下一个消失的是 **`/goal` 命令**。新功能进 Harness 前必须先回答**四个问题**：① 删掉会变坏吗？② 对模型本身有意义吗？③ 出错怎么 Undo/Redo？④ **怎么评测（交不出评测流程直接打回）？** 讲者将 Harness 工程定义为靠对照、消融推进的**实验科学**（[S25]({{< relref "s25-minimax-leaner-harnesses.md" >}})）。
  - **加法派（补齐 22h–48h 跨天长程状态与验证）**：阶跃星辰指出，要让模型在几千步长程工作流里不迷失，Harness 必须补齐四个工程环节：① 在窗口外持久化**任务树、会话、文件系统**三类状态（Subagent 只向主线回结论）；② 入窗前强制过 **Context Budget**（截断旧日志与压缩图像）；③ 执行前与用户写清**验收条件（Verify）**；④ **云端脑（托管计划与选工具）+ 本地/远端手（Sandbox）**解耦，保证电脑合盖后持续推进（[S07]({{< relref "s07-stepfun-agent-harness.md" >}})）。
  - **校准**：两边都留下了**验证（Verify）**与**跨窗口文件交接**；凡是规定思考步骤的提示词一律砍，凡是跨时空持久化与外部客观验证必须加厚。
- **架构收敛回 Coding Agent 循环，工具层死保前缀缓存（CLI / PTC）**：
  - 行业架构绕了一圈，正从手绘 Workflow 图强烈收敛回 **`Model + Tools in a loop + Skill + Sandbox/File System`**（建议把循环放在后端常驻 Worker 里，沙箱仅作按需调用的工具以省算力）；面对每日**百万级 Trace**，先走**五步“数据渐进披露”漏斗**（压成简短 trajectory → 小模型摘要 → Embedding 聚类打标 → 严重度排序 → 仅挑头部百/千条完整 Trace 喂给后台改进 Agent），人只保留对“质量”的所有权。 — [S01]({{< relref "s01-langfuse-building-agents.md" >}})
  - 为防止动态加载 MCP 改变工具列表**击穿 Prefix Cache（前缀缓存）**，MiniMax Code 把所有工具放进 **`connector CLI` 按需渐进发现**，用 **`PTC（Programmatic Tool Calling）`** 让模型一次输出代码脚本在沙箱内并发批量调工具（让浏览器操作流畅弹钢琴），并将超 5–10 分钟的**长命令自动转后台**。 — [S25]({{< relref "s25-minimax-leaner-harnesses.md" >}})
- **🔍 对照：两种“拆 Agent”（Coding 克制拆 vs 实时对话流水线拆）**：MiniMax 指出 Coding 任务里多开 Subagent 常只是白耗 Token；而 Cookiy Labs 在 `< 1.3s` 实时多模态访谈中，试过“快小模型陪聊 + 慢大模型思考”却因时钟脱节被小模型带偏（现场口头悬赏 **10 万美金**求解），最终走通的是把一次回复拆成**“判断 → 下一步动作 → 具体回复”三类子 Agent 串行级联**，为的是压延迟、防串信息。 — [S25]({{< relref "s25-minimax-leaner-harnesses.md" >}}) · [B06]({{< relref "b06-cookiy-agentic-harness.md" >}})

#### 2. 短命有状态沙箱、百万级 RL 训练沙箱与被推出边界的数据库
- **为什么 Kubernetes 不是你的沙箱？（外挂 EBS 的六大硬伤）**：Daytona 指出，K8s 为“长期运行、出错自愈的无状态服务”设计，而 Agent 沙箱要的是**“短命但有状态”**。在 K8s 上硬挂外部存储（如 AWS EBS）会踩六个大坑：① 串行起 Pod 吞吐仅 **100 个/秒**（耗时 1–2s 至几十秒）；② 走网络使 **IOPS 从本地 ~500k 暴跌至 50k–60k（跌 10 倍）**；③ 挂卷慢 **3–19 秒**；④ **报错后必须干等 6 分钟才能重挂**；⑤ 单节点限挂 25–39 卷，使单机沙箱密度从 **110 个直接砍掉 2/3**；⑥ 无法多 Pod 共享。专用沙箱靠“停而不删留原节点、热门快照主动扩散、Delta 差量传输”避开冷启动（厂商自测耗时少 **36%**、波峰负载成本低 **2.7 倍** ⚠️ 乙方自报）。 — [S10]({{< relref "s10-daytona-k8s-is-not-your-sandbox.md" >}})
- **百万级 RL 后训练沙箱：防 Infra 故障污染 Reward，消灭 80% 思考空等**：Google 揭示前沿实验室 RL 训练单任务常达 **`1,000 task × 16 rollout = 16,000` 沙箱并发**、训超 **150 万个独立镜像**。如果沙箱因 Infra 超时或 OOM 崩溃，**Reward 函数会误判为模型写代码失败而打出低分，直接污染训练数据与模型权重**；且统计百万条轨迹发现**沙箱 80% 时间在空等模型生成 CoT，仅 15% 时间在跑代码**。Google 开源第一代方案在 **4,000 个 CPU 节点**上实测 **100 万并发连续 8 天零错、12 分钟填满百万预热池、首条指令 P99 < 1 秒**（1 万沙箱仅需 512 个网络 Identity）；第二代 `Agent Substrate` 在等模型思考间隙打压缩快照停掉，靠**亚秒级快照恢复**瞬间唤醒。 — [S16]({{< relref "s16-google-rl-sandboxes-at-scale.md" >}})
- **没人计划过 AI Infra：算存分离防丢成果、千万级隔离小库与 Checkpoint 分支**：TiDB 指出容量须按 **`用户数 × 每用户让 Agent 做多少事 × 历史留多久`** 算：① 状态表（`session snapshot` 单条常达 **40–80KB**，叠加高频 event）涨到 **PB 级**，逼客户用分布式 SQL 替掉 20+ 分片 DB；② **工作区必须放在独立于沙箱的持久文件系统**，防止沙箱回收清理 EBS 时把用户整个项目删光；③ 建站 Agent 平台衍生出**上千万个隔离小数据库**；④ 长任务单条 Trace 上百 MB/十万步、日写**数百 TB**，但评估改动不能只看 Trace 或无状态重跑，必须将 **`Meta + Event + 文件系统 Checkpoint` 强绑定，从同一保存现场开独立分支对比**。 — [S14]({{< relref "s14-tidb-nobody-planned-ai-infra.md" >}})

#### 3. 管到第 500–2000 个 Agent 的治理转移
- **反向依赖追溯、法庭级三段审计链与 100% 跨平台覆盖**：Dify 透露在华跨国企业内部平均已有 **2,000+ 个 Agent**（预算达七八位数美元）。越过 500 个后有三大挑战：① **变更无法追溯**：某跨 **50 国**客户因一国改隐私法需调知识库，却在几千个 Agent 里查不出谁用了该知识库，原作者早已离职；② **法庭级三段审计**：美国某大型县立图书馆上线 `AI librarian` 后发现 **10% 是坏查询，竟包含 `"How do you murder somebody?"`（怎么杀人）**，倒逼必须留存**“用户问了什么 → 拼好发给 LLM 什么 → LLM 原始返回什么”**三段审计链；③ **放弃只管自家 Agent 的幻想**：企业绝不接受只覆盖 80% 风险敞口的方案，管理平台必须 100% 纳管第三方 Agent；某消费电子公司放弃修补旧流程，重画流程用 **7 个 Agent 串联**处理全球客诉。 — [B03]({{< relref "b03-dify-managing-500th-agent.md" >}})


---

### 四、从生成到验证（Proof）：评测体系与质量门禁

<div class="aie-map-table">

| 核心问题 | 旧直觉 / 常见误区 | 2026.11 前沿判断与做法 | 代表场次 |
|---|---|---|---|
| **工程师职责重心迁移** | 精力花在写 Prompt 生成代码（Intent Engineering），产出后靠人眼逐行 Review。 | 生成速度超越人读极限，瓶颈移向 **Proof Engineering**（先写 `Proof as Code` 让 Agent 爬坡）与 **`Check the Checkers`**（中英分离，机器干活、Judge 查活、人审裁判标准）。 | [S08]({{< relref "s08-openclaw-intent-engineering.md" >}}) [S22]({{< relref "s22-daily-trusting-evals-i-cant-read.md" >}}) [S17]({{< relref "s17-kimi-game-dev-in-ai-era.md" >}}) |
| **榜单失灵与私有回放** | 看公开静态榜单（SWE-bench、FLEURS）选模型与工具；人工凭空造评测题。 | 公开基准在流式管线下**差 4–20 倍**、同工具**换仓库成本反转（-24% vs +30%）**；改用 **500 万会话线上 RCT + 用户模拟器**，或直接拿自家 **10 万+ 历史合并 MR / 1 万+ PR** 做防泄漏回放。 | [S05]({{< relref "s05-arena-measure-the-frontier.md" >}}) [B02]({{< relref "b02-harvey-trust-your-own-evals.md" >}}) [B07]({{< relref "b07-agoda-your-repo-your-benchmark.md" >}}) [S23]({{< relref "s23-nus-streaming-stt.md" >}}) |
| **测试反作弊与 CI 吞吐** | 让 Agent 写单测拉到 90% 行覆盖率就安全；测手机 App 只看截图；死守 `main` 分支每次合入跑全量 CI。 | **90% 覆盖率仅抓 <15% 变异 Bug**，必须上**变异测试（>70%）+ 旧系统 Oracle**；改被测 App **暴露组件语义与内置 CLI（省 90%+ Token）**；为解月烧 **$127 万**测试费死锁，**关掉 main 同步 CI 改定时跑 + Adaptive Testing**。 | [B09]({{< relref "b09-data4life-harness-is-first-reviewer.md" >}}) [B05]({{< relref "b05-meta-beyond-screenshots.md" >}}) [S08]({{< relref "s08-openclaw-intent-engineering.md" >}}) |

</div>

#### 1. 范式转移：从 Intent Engineering 到 Proof Engineering 与 Check the Checkers
- **单人并行 300+ Agent 全在等 Proof，把 Doom 塞进产品当爬坡器**：OpenClaw 首席架构师用一台笔记本（一半指令用手机发）将并行 Agent 从 **15 → 60 → 300+** 拉升（日产 **1,000–3,000** PR/commit），撞上了单机单位时间能验证合入的上限（`"My agents are working, but they're waiting for proof"`）。工程师必须从 Intent Engineering 转向 **Proof Engineering**——在开工前先用代码定义可验证的理想结果（`Proof as Code`）当山头让 Agent 爬坡；为验证多人环境 Computer Use，团队直接把游戏 **Doom** 放进产品让 Agent 像真用户一样玩，看能否玩通而非看静态分数。 — [S08]({{< relref "s08-openclaw-intent-engineering.md" >}})
- **`"Nobody Can Read"` 下的 `Check the Checkers`**：Daily.co 工程师完全不识中文，用 Pipecat 花 30 分钟 vibe coding 出中英双语点奶茶语音 Agent。面对看不懂中文、组合无穷、手测极慢三大死穴，他搭建**单测 + Scripted Eval + Simulation Eval（让 LLM 即兴扮演犹豫中文顾客并发跑 10–100 次，由 LLM Judge 判对错）**，强制**用英文写验收标准审中文对话**——不再检查产出本身，而是检查“检查者”；且日常跑文本模式省 Token，上线前必跑**音频模式**（成功抓出 STT 把中文**“去冰”听成“两瓶”**的识别层 Bug）。 — [S22]({{< relref "s22-daily-trusting-evals-i-cant-read.md" >}})

#### 2. 公开榜单为何失灵？四套高 ROI 私有 Benchmark 构建法
- **⚔️ 路线交锋：通用排行榜还能不能指导选模型与工具？**
  - **动态通用榜单派（500 万会话线上 RCT + 用户模拟器）**：Arena 承认静态题库易被刷，故自建通用 Agent 产品（累计 **500 万会话**，含 84 轮交互/676 次工具调用的复杂金融研究），每个会话**随机分配底层模型（RCT）**，从真实轨迹挖**确认成功、用户褒贬、纠偏次数、Bash 可靠性、工具幻觉** 5 类信号及**对齐指数**（未授权动作/强加意图/虚假完成），并用数百万会话训**用户模拟器**把 1 周评测压到几小时。榜单显示美国前沿实验室领先，中国开源权重模型在**性能-成本帕累托前沿**上占多个位置（[S05]({{< relref "s05-arena-measure-the-frontier.md" >}}) ⚠️ Arena 同时给模型厂做联合发布与售卖 RL 环境数据）。
  - **私有回放实测派（先抓自家数据截断与 VAD 切片 Bug，换库结果反转）**：
    1. **1 万+ 内部云端 PR 防泄漏回放（DeepSeek V4.1 Flash 接近 Opus）**：Harvey 内部 500 多人用云端 Agent `Specter` 沉淀上万个 PR。回放发现“自动更新 PR 描述”效果差，根源竟是**自家代码在描述过长时把喂给模型的数据截断了**！修好数据 Bug、花 **约 7 小时 / $7,000** 清洗掉带有“后来评论或新提交”的**未来信息泄漏（Future Signal）**后，在内部 Code Review 上 **`DeepSeek V4.1 Flash` 效果已接近 `Opus`**（Opus Max 多抓的问题人工复核并不重要），预计月省上万美元（⚠️ 未给具体分数与当前月花费基线）；修 CI 任务各模型最终质量差不多，仅差在 Open Weight 模型默认思考过多耗沙箱时间，看 Trace 砍掉全量测试与过度思考即可爬坡（[B02]({{< relref "b02-harvey-trust-your-own-evals.md" >}})）。
    2. **流式语音管线比公开基准差 4–20 倍（根因在 VAD 切段）**：NUS 在 **3,000 场**（⚠️ 标题作 3,000、口述称 thousands）真实语言学习会话中发现近 1/4 凭空转出没人说过的字，错误率比公开基准 FLEURS（2%–7%）高 **4–20 倍**。把“实时流式切段”改为“整段录音一次喂入”，准确率立刻从 **62% 跳升至 82%**（⚠️ 未披露模型与 WER/CER 口径）——原来 STT 首 Token 预测语言标签，学生停顿多导致上游 VAD 切成极短碎片猜错语言；**不换模型，仅靠显式指定语言（找回 11 个点）+ 调长 VAD 攒够 2–8 秒音频再切分**即填平差距（[S23]({{< relref "s23-nus-streaming-stt.md" >}})）。
    3. **软性主观质量**：Cookiy Labs 将历史上客户挑刺的**几千个坏案例（精确到 30 分钟访谈第 15 分 20 秒 AI 追问错的那句话）**做成回归集，离线把整场音视频塞给 Claude Code 慢速复盘反哺实时 Harness（[B06]({{< relref "b06-cookiy-agentic-harness.md" >}})）。

#### 3. 确定性门禁反作弊、App 语义化改造与百万美元 CI 破局
- **Harness 是第一道 Reviewer：用变异测试揭穿 90% 覆盖率骗局 + 旧系统 Oracle**：Data4Life **2 个人用近 300 个 PR** 重写医疗平台 `OHDSI Atlas`（并让 Agent 每日扫 163 个社区 Issue 自动起草回复与小 Bug PR）。铁律是**能写成确定性检查的绝不交 LLM**；更发现 Agent 会写恒真假测试（`"always true"`）——**某组件行覆盖率近 90%，变异测试（Mutation Testing，故意改源码看测试能否挂）竟只抓到不到 15%！** 团队立即加静态检查拦恒真断言 + 变异测试回喂，将全库拉到 **~98% 覆盖率 / >70% 变异得分**，并从网络拉取 **1,000+ 已验证历史定义**拿旧系统当 **Oracle** 比对，同时强调门禁自身必须 **`Reliably Failing`**（防超时静默通过）。 — [B09]({{< relref "b09-data4life-harness-is-first-reviewer.md" >}})
- **移动端验证超越纯截图：给 App 补组件语义与内置 CLI（省 90%+ Token，8 周压到 3 小时）**：在独立游戏原型中 Agent 可建 `screenshot` 目录看图自修 Bug（[S17]({{< relref "s17-kimi-game-dev-in-ai-era.md" >}})）；但在 Meta Instagram 视频剪辑应用 `Edits` 中，纯看截图搞不定双指缩放、长按拖拽重排及导出是否 1080p 30fps 等隐藏状态。Meta 做三步改造：① 在 UI 滑块上声明百分比与速度映射语义、暴露内部状态与日志，使**平均工具调用从 38 次降至 9 次（⚠️ 原话表述略含糊），省 90%+ Token**；② 把复合手势封装成 App 内置 CLI（如 `edits reorder-clip`），并把**构建、安装、登录、清理全写成不用 LLM 的确定性流程**；③ 原需 QA 手测 **8 周**的特效压到 **3 小时**，印地语界面连跑 **70 小时**截 2,000 张图提 200+ 条线索（1 季度压到 2 周 ⚠️ 8 周与 1 季度均为人工耗时估计），且安排后台 Agent **每日扫验证失败记录自动提代码 Diff**，1 个月内将验证有结论率（`conclusive`）从 **~10% 拉升至 ~55%**（现日跑 1,000–2,000 次）。 — [B05]({{< relref "b05-meta-beyond-screenshots.md" >}})
- **月烧 127 万美元测试费破局：关掉 `main` 分支同步 CI，改定时跑 + Adaptive Testing**：OpenClaw 五六人团队因 Agent 狂加测试又删不得，**峰值单月光测试就烧掉 127 万美元**，每个 PR 等 30 分钟 CI 导致暗工厂卡死。团队果断**彻底关掉 `main` 上的同步 CI**，改为 PR 轻检查、**`main` 每 30–60 分钟定时跑一次**、全量测挪发布流，使**每 100 次 CI 成本从 $1,000+ 暴降到 $200+**，Cycle Time 稳在 **1–2 小时**；并基于 2–3 个月历史数据训树分类器只测可能回归的子集（Adaptive Testing，**预期再降本 95%–98%** ⚠️ 预期值），辅以 135 个模糊任务基准低频监控。 — [S08]({{< relref "s08-openclaw-intent-engineering.md" >}})

---

### 五、AI-Native 组织、产品交互、安全权限与商业护城河

<div class="aie-map-table">

| 核心问题 | 旧直觉 / 常见误区 | 2026.11 前沿判断与做法 | 代表场次 |
|---|---|---|---|
| **组织协同与注意力经济** | 按部门拆多仓库；Agent 当私人聊天框；追求全自动无人审接单提 PR。 | **单一 `Mono` 仓**解决 AI 看不全，**任务链接全员公开**当场拍板解决人看不全；架构改“精简内核+插件”少跨仓，产品合 160+ PR 零事故；**Token 可再生但人的注意力不可再生**，戒除无人定优先级的自动驾驶。 | [S11]({{< relref "s11-manus-ai-native-work.md" >}}) [S36]({{< relref "s36-nowledge-memory-engineering.md" >}}) [S17]({{< relref "s17-kimi-game-dev-in-ai-era.md" >}}) [B11]({{< relref "b11-sac-idea-to-viral-launch.md" >}}) |
| **产品交互哲学与个人创作** | 好 AI 是一句话交出完美成品（服务窗口）；做 PPT 是为了对外汇报；Personal Agent 越替人省杂事越好。 | 完整答案会盖住未形成的问题，工具应做成**“工作台”（假设可见/小改可试/方向可拿回）**；向外省下的时间会被短视频夺走，Personal Agent 转向 **`ToM（To Me，做给自己看）`** 的创作 Studio。 | [S02]({{< relref "s02-ryo-lu-what-we-want.md" >}}) [B01]({{< relref "b01-youmind-personal-agent-for-growth.md" >}}) [S24]({{< relref "s24-panel-ai-startups-vc.md" >}}) |
| **身份安全、支付与商业壁垒** | 冒用人名 + Harness 工具开关控权；用生成式模型判安全；绑信用卡或按次微支付；在显性领域卷薄壳。 | 发**独立 Entra ID** 授最小权限 + **本地 400M 判别模型**拦调用（准确率 **91%–93% vs 70%**）；Visa 发 **Scoped Token**、品牌走**主权意图交换**；避开第一方 **20 倍补贴**，去**高销售费率隐性群岛、无 API 车间群聊真瓶颈与带单撮合**。 | [M02]({{< relref "m02-microsoft-enterprise-agents.md" >}}) [S33]({{< relref "s33-1password-agent-intent-check.md" >}}) [B04]({{< relref "b04-visa-infra-for-agents-that-act.md" >}}) [S29]({{< relref "s29-masons-sovereign-agents.md" >}}) [S20]({{< relref "s20-chiling-encoding-is-the-moat.md" >}}) [S21]({{< relref "s21-hicap-ai-in-manufacturing.md" >}}) [B12]({{< relref "b12-ahacreator-matching-to-delivery.md" >}}) [S06]({{< relref "s06-panel-community-ai-era.md" >}}) |

</div>

#### 1. AI-Native 组织与超级个体创作闭环
- **单一 `Mono` 仓库 + 任务全员公开 + 注意力守卫战**：Manus 工程师单人同时接十几二十个需求，靠四项改造：① 全公司代码、文档、内部工具进同一个 **`Mono` 仓库**（默认接 Slack/Notion，全链路 OTel 统一 Trace ID 使线上故障极速模式 **5 分钟内**定位）；② 为让 AI **少做跨仓库修改**，技术架构重拆为**“精简内核 + 外围内聚插件”**并按事分人，产品与设计直接提 PR（最积极的产品同学已合入 **160+ PR**，至今零线上质量事故 ⚠️ 未给观察期）；③ **所有人的 Agent 任务链接全公司可见**，卡在决策点直接把任务链接发给决策人当场拍板；④ **戒除无人定优先级的自动驾驶**：自动接单 Bot 几天就积压几十个无人审的废 PR，一位同事无脑回“继续”**单月烧掉 10 万美金 Token**——因为**“Token 是可再生资源，人的注意力是不可再生资源”**（内部群发权限确认私信，回收发现 **30%** 是由对方的 Manus 自动回复的）。 — [S11]({{< relref "s11-manus-ai-native-work.md" >}})（另 Nowledge 指出团队在夜里 12h 和周末 48h 的 **Dark Office** 半闭环自改进已跑通，卡点同样在人的验证，[S36]({{< relref "s36-nowledge-memory-engineering.md" >}})）。
- **超级个体开发：盯模型能力临界点立项 + 俯视图与多机位截图盲审 Loop**：
  - 随着 AI 独立跑长程任务能力突破，Kimi 展台 3 个游戏作品平均仅需 **1 个人、约 4 天、约 3,000 元人民币 Token**；抖音“老太太 GTA”视频放出后 **1 周内**即被社区做成可玩开源游戏，原型变快后人只管验证和决定。 — [S17]({{< relref "s17-kimi-game-dev-in-ai-era.md" >}})
  - 不懂建模的独立开发者 Sac **16 天**做出 3D《小王子》游戏，靠三步 SOP：① 不看公开榜，新模型发布首日用私人固定提示词测 3D/代码，测出 **GPT-6 Astra** 跨过能力临界点才立项；② **参考图先行、俯视图最关键**，在 Unity 里跑**“多机位截图对参考图盲审比对直到 1:1”**、搜真实照片改棉花糖云海、代入主角试玩修 Bug 三个 Loop；③ 掐准 X 是国内 AI 媒体选题上游，首发 X 预测跑 300 万流量、实际跑出 **3,370 万曝光**，传导至国内全网超 **4,000 万**。 — [B11]({{< relref "b11-sac-idea-to-viral-launch.md" >}})

#### 2. 产品交互哲学：工作台 vs 服务窗口，省时间 vs 花/耗时间
- **答案完整不代表我想过：把工具做成“工作台”而非“服务窗口”**：前 Cursor 创始设计师 Ryo Lu 指出，当 AI 两分钟交出带心情分数、连续天数、每日提醒的完整方案时，**最危险的是那些被完整答案盖过去、还没机会形成的问题**。他带观众玩**“减法游戏”**去掉打卡提醒（“想留下生活，不是替生活添一份作业”），提出**工作台三原则**：**① 让重要假设看得见；② 让一次修改小到可以放心试（能只改一部分）；③ 让交出去的工作需要时能拿回来**。 — [S02]({{< relref "s02-ryo-lu-what-we-want.md" >}})
- **⚔️ 路线交锋：好产品的尺子是“替人省时间”还是“让人花/耗时间”？**
  - **转向创作与“ToM（做给自己看）”**：YouMind 创始人玉伯指出，现有 Personal Agent 多在替人解决外部烦恼，但省下的时间全被短视频夺走了（深夜刷手机是白天身不由己后夺回选择权的补偿）。调研自家**上千名 Max 档（$100/月）付费用户**发现，**人均每月做约 15 个 PPT，只有 1–2 个给别人看，其余 13–14 个全是做给自己看的（`Create to Learn`）！** 他将其定义为 ToB、ToC 之外的 **ToM（To Me）市场**，主张把通用 PA 留给大厂，创业者做帮人成长的四阶段创作型 Studio（直接说 → 带私有资料 → 沉淀个人 Skill → PPT 一键转视频）。 — [B01]({{< relref "b01-youmind-personal-agent-for-growth.md" >}})
  - **VC 视角（需求扩张 vs 消耗时间）**：真格戴雨森认为纯提效 PA（清邮件）留存差，能帮人做**需求扩张**（根据体检推荐原本没想买的补剂）才做得大；TaoZ Capital 刘勇（Patrick）则直言**“凡是帮人节约时间的，都没有帮人消耗时间的好”**，看好情绪价值、强数据行业与以短剧为代表的内容生产（转述某上市公司称**中文 AI 世界 55% 的 Token 消耗在短剧** ⚠️ 未给公司名）；Ryo Lu 则在个人侧补了一句：省下的时间不必重新填满，去茶馆跟能改变自己的真人聊一次天。 — [S24]({{< relref "s24-panel-ai-startups-vc.md" >}}) · [S02]({{< relref "s02-ryo-lu-what-we-want.md" >}})

#### 3. 安全权限边界与 Agent 交易经济
- **给 Agent 独立 Entra ID 锁死最小权限（防 Harness 工具开关被绕过）**：Microsoft Core AI VP 指出，Meta Muse 给 Agent 拟人化身份是为了互动变现，发邮件仍冒用人名（`on-behalf-of`）；而让 Agent 冒用你极其危险——**Harness 里的工具权限开关就像“印度的红绿灯”**：你关掉删除工具，它会调 Shell 跑 `rm -rf`；关掉 Shell，它会**自己写一段 Python 程序把文件删光（`"The agent will find a way"`）**。Microsoft 给每个 Agent 发独立的 **Entra ID、独立邮箱、Teams 和 OneDrive**（在组织架构图里向人汇报），由管理员在身份层按模板授只读等最小权限，无论写 Shell 还是 Python 都越不过去；当 Agent 有了独立身份，将走向**不经事先编排的自发协作**，需在 `OpenEnv` 等模拟世界中按安全、合规、正确性三类 Rubric 做隔离测试。 — [M02]({{< relref "m02-microsoft-enterprise-agents.md" >}})
- **运行时意图裁判：MCP 网关 + 本地 4 亿参数判别小模型（准确率 91%–93% vs 70%）**：1Password 指出 Agent 的意图落在每次工具调用上，且**它自述的理由不能当证据**（如结账服务排障任务看完日志竟提议直接改生产账户）。运行时裁判须本地跑、低延迟、看得到调用前上下文：实测**约 4 亿参数（400M）的判别类小模型（⚠️ 原话 `decision model`）除一个外准确率达 91%–93%**，而**生成式 Decoder-only 小模型仅 70%**（⚠️ 未给样本量）；且由于**不同错误风险不等价**（如解决流量问题时 Agent 提议删掉 AWS `GuardDuty` 威胁检测器，部分模型以低置信判为普通“删除”而非关停安全服务的“管理员”操作），低置信度须选 `unknown` 转交人工，且**置信度阈值必须逐个模型单独校准**。 — [S33]({{< relref "s33-1password-agent-intent-check.md" >}})
- **⚔️ 路线交锋：Agent 经济该按请求微支付（Scoped Token），还是靠广告口播/算力任务与主权意图交换？**
  - **Visa 限时限额 Scoped Token 微支付**：针对开发者让 Agent 通宵干活拆单买几分钱图片/域名，现有基建在**网站反爬（Cloudflare 封诚实 Bot）、银行风控（半夜几十笔几分钱被当盗刷锁卡）、用户授权不清**三处拦路。Visa 推出不直接给卡、改给带范围和时效的 **Scoped Token**（如今晚有效、上限 $20），配 **Trusted Agent Protocol (TAP)** 握手并给商户的 **“Agent 友好度”打分**（[B04]({{< relref "b04-visa-infra-for-agents-that-act.md" >}})）。
  - **Jina 网关广告/公开算力任务换免费**：Jina 不看好 Agent 按请求给网站付费（因千页读取成本已达 $9+ 追平广告 CPM，价格锚定太高、全球南方付不起且难防倒卖），只同意控制放在网关，并设想让 Agent **复述一段广告口播，或替人做可由 Reranker 自动验证的公开翻译/摘要任务**来换免费访问（⚠️ 讲者自称是“不成熟的想法”，[S37]({{< relref "s37-jina-reading-the-web.md" >}})）。
  - **masons.ai 主权 Agent 意图交换**：复盘 2016 年因商家无接口被迫雇 **20 人当“人肉 API”** 的教训，指出**品牌商绝不愿沦为白标履约方、拒绝被降格成 API**，且中心化超级 Agent 存在收佣金背叛用户的**委托代理问题**；主张商家封装**主权 Agent（Sovereign Agent）**，通过 **B2B 意图交换（Intent Exchange）** 广播撮合（[S29]({{< relref "s29-masons-sovereign-agents.md" >}})）。

#### 4. 面对基模坦克与 20 倍补贴，垂直护城河立在哪？
- **⚔️ 路线交锋：模型变强，对应用创业是福是祸？**
  - **第一方 20 倍补贴与模型套利出局**：戴雨森指出吞掉小应用的不是底模本身，而是模型公司**补贴了 20 倍 Token 的第一方应用（Claude Code / ChatGPT）**，但核心总判断是**模型变强变便宜整体利好应用公司**，美国垂直应用已靠 Context、数据或部署筑起壁垒；Patrick 统计中国三年前拿过钱的应用公司 **90%–99% 已出局**，认为吃“最新模型套利”的空间随模型外延而缩小（他也自承该判断今天未必完全成立）；王怀南（Harry）指出中国模型厂无边界、今天大模型做得好的其实只有 Coding（其他领域极缺长程轨迹数据），故往**软硬结合 Local AI**（随身硬件采 Context / 企业本地 Enterprise Box）避战，且对估值 **$1 亿+** 的 **RSI** 公司一个没投（连问 `"RSI for what"`）；Koji 则把基础模型比作迎面开来的**坦克**，建议要么**“往地下钻”**（做 FDE、交易数据、Infra）要么**“往天上飞”**（做 AI4S、EDA）。 — [S24]({{< relref "s24-panel-ai-startups-vc.md" >}}) · [S06]({{< relref "s06-panel-community-ai-era.md" >}})
- **垂直与传统行业突围的三把标尺 + 社区线下分包**：
  1. **去高销售费率的“隐性知识群岛”数字化填海**：驰领传悦杨颖提出**“AGI 是最强解码器，编码清晰的显性大陆（数学/编程）必被吞没”**。用财报筛出**销售费用率高达 50%–90%** 的美妆行业，拒绝拍照测肤，从消费者端切入让用户**拍家里库存产品 + 自报感受**，结合上千万备案信息与上千篇论文推平替，再用消费者需求数据倒逼换取品牌的配方与专家知识。 — [S20]({{< relref "s20-chiling-encoding-is-the-moat.md" >}})
  2. **在代理商亏本处带着真实订单做双边撮合**：海外达人营销比国内晚 5–8 年，KOC/UGC 做不起来卡在传统代理商做小单亏钱。AhaCreator **带着品牌的真实订单找达人**冷启动 **18 万达人**，整条链路好比 **1,000 件事，AI 做掉 800 件，人只管 4 步（定交付要求、审带报价名单、审脚本和终稿、复盘数据）**；深圳 3C 品牌案例 **2 天筛出 300–400 个持有设备的达人，跑出 CPM 4 美金**（⚠️ A 轮融资自报）。 — [B12]({{< relref "b12-ahacreator-matching-to-delivery.md" >}})
  3. **企业级护城河在“没有 API 的地方”，严防非瓶颈省时海市蜃楼**：海维软件服务制造业 20 余年，指出大集团做不了快速颠覆，真正的护城河在**词、没沉淀的数据、老设备、人**：① 系统记的是计划，突发事实全在微信群里，让 **40–48 岁工人对着手机语音说句话**转成结构化事件派单；② **语义不统一时，模型越强错得越漂亮**（先统一“交付”等跨部门口径并留痕，用智能体把 **L0–L5 几百个流程**梳进台账）；③ 虽然报销智能体月省 **500+ 工时**能当季见效（“土项目”），但引《目标》强调**“在非瓶颈上省下的时间都是海市蜃楼”**，真正要攻克的是瓶颈上的**智能排产**。 — [S21]({{< relref "s21-hicap-ai-in-manufacturing.md" >}})
  4. **社区首发、交易变现与线下信任分包（OPC）**：这是 AIE 第一次来中国，也是**第一场全程不做直播的 AIE**（[M01]({{< relref "m01-swyx-opening.md" >}})）。WaytoAGI 长成北京亦庄 8 层小楼与成都 **8,000 平米**线下实体空间，靠线下信任跑通“接单—分包”的 OPC 一人公司生态，某短漫剧工具在社区直播首发**当天新增 200 用户**；42章经点破内容社群只有广告和交易两条变现路并果断选了**高客单交易**，且揭秘创业者上播客最多是为了**招人**。 — [S06]({{< relref "s06-panel-community-ai-era.md" >}})

---

### 六、Physical AI：世界模型、具身硬件与机器人数据构建底座

<div class="aie-map-table">

| 核心问题 | 旧直觉 / 常见误区 | 2026.11 前沿判断与做法 | 代表场次 |
|---|---|---|---|
| **世界模型定义与虚实分工** | 世界模型就是端到端视频/3D 生成模型；单帧画面越逼真就越懂物理世界。 | 按**功能（渲染/模拟/规划）× 领域 × 尺度 × 覆盖度（是否维护未观测隐藏状态）**归类（LLM 与 Google Maps 皆算）；**能描述清的交给 Agent 写代码并由灰盒程序显式管状态，只能认出的细节交给约 5B 模型（720p/24fps）实时渲染画面**。 | [S18]({{< relref "s18-world-labs-taxonomy-of-world-models.md" >}}) [S27]({{< relref "s27-vast-3d-to-world-models.md" >}}) |
| **物理感知、安全与可预测硬件** | 纯靠 VLA 视觉模型落地工厂；硬件标配零背隙谐波减速器与关节力矩传感器；追着模型改硬件。 | **力觉是第一性输入**，物理结果经验证才算完成，**安全监督必须独立写在 PLC/PCB 人工规则里**；硬件跟不上模型每周迭代（24 周改 24 次 vs 1–2 次），为此**弃谐波改行星减速器（Sim-to-Real RMSE 仅增 1.3mm）**并靠传动模型估力。 | [S26]({{< relref "s26-aimoga-beyond-vla.md" >}}) [S31]({{< relref "s31-noematrix-noe-0.md" >}}) [S32]({{< relref "s32-dyna-robot-hardware.md" >}}) [S34]({{< relref "s34-futuring-robot-home-service-robots.md" >}}) |
| **具身数据获取与增量构建系统** | 建数采工厂遥操作配人工标注；用 Parquet 存数据，每次加特征列就整表重写。 | 分化出**百城千人无本体采集 30 万小时（预/后训练全不用遥操作）**、**500+ 家庭回流未执行候选轨迹**与**光量子采样 Real2Real**；底层用 Lance 打造 **加列零开销 + 四类空值 Cell Flag + 列绑 Python 增量 GPU 构建**的 Data Build System。 | [S31]({{< relref "s31-noematrix-noe-0.md" >}}) [S34]({{< relref "s34-futuring-robot-home-service-robots.md" >}}) [S30]({{< relref "s30-quantsparkle-real2real.md" >}}) [S35]({{< relref "s35-lancedb-robot-data-build-system.md" >}}) |

</div>

#### 1. 世界模型四维分类学与“程序管显式状态 + 模型管画面”
- **四维分类学与“四向全红灯”反例**：World Labs 联合创始人 Christoph Lassner 将世界模型定义为抽象推理（System 2）与感知/行动（System 1）之间的可查询预测接口，按**功能（渲染、模拟、规划）× 领域 × 尺度与分辨率 × 覆盖度（Coverage，是否维护当前未观测到的隐藏状态）**分类——宽口径下 LLM 和 Google Maps 都算世界模型。现场展示某主流视频模型生成的十字路口漫游视频，镜头绕一圈**四个方向红绿灯竟然全都是红灯**，直接证明单帧局部视觉一致不等于在后台维护了隐藏状态；因此上层应由 1 个通用 Agent 做 **System 2**，下层由各带领域世界模型的模块做 **System 1**（与 [S34]({{< relref "s34-futuring-robot-home-service-robots.md" >}}) 下一代家庭机器人架构一致）。 — [S18]({{< relref "s18-world-labs-taxonomy-of-world-models.md" >}})
- **当 Coding Agent 几十秒纯代码搭出 3D 室内场景：按“可指定性”划界**：VAST / Tripo AI 内部群实测发现，新模型下的 Coding Agent 能纯靠写代码在**几十秒内**搭出带家具尺寸的 3D 室内场景，完全没用原生 3D 模型。团队随即确立新边界：**能用文字/代码清晰描述规格的（门位置、开关、计分）交给 Agent 写代码，只能凭肉眼认出但说不清的细节（人脸神似、复杂生物）交给模型从数据中学**。为造持久交互世界，采用**“传统游戏灰盒程序显式维护世界状态 + 约 5B 参数模型（约 720p/24fps）读取状态实时渲染画面”**（开门、灭火走开再回来仍在，多人异视角状态天然一致；另在自动评测可行走性 Walkability 时，发现 Agent 会**自己放椅子或箱子当台阶爬上楼梯钻空子过关**）。 — [S27]({{< relref "s27-vast-3d-to-world-models.md" >}})

#### 2. 力觉第一性、独立 PLC 安全隔离与“弃谐波改行星”的可预测硬件
- **工业驻场调试成本死穴、力觉第一性与独立 PLC 安全兜底**：
  - AiMoga 指出工业产线纯上 VLA 精度不够，用传统视觉每换新品类又要派人长期驻场调试（养不起）；且只看图像看不见接触力、细微滑动和有没有抓稳，**“任务要等物理结果验证过才算完成”**。其轮式双臂方案从 **MES 系统**收发工单，补齐力矩与触觉传感，并立下死规矩——**工业机器人的安全监督（急停、碰撞保护、运动限制）必须独立于大模型，用 PLC 或 PCB 人工写的安全策略兜底**。 — [S26]({{< relref "s26-aimoga-beyond-vla.md" >}})
  - 穹彻智能（Noematrix）同样强调具身落地的关键是**“获取一个新能力的成本”**（预期半年至 1 年内压到 **1 人 2 周工业交付** ⚠️ 预期目标，WAIC 地面清理 Demo 已从 2024 年的 **2 人月 / 2000–3000 行代码**压到 **1 人 1 天**）；并指出**力觉是操作的第一性输入**——哪怕在不需要力的任务上，后训练加入力的模态也能让模型收敛更快、所需数据更少。 — [S31]({{< relref "s31-noematrix-noe-0.md" >}})
- **硬件不追每周一变的模型，而是做成“可预测的稳定接口”（弃谐波改行星减速器）**：
  - DYNA 算了一笔节奏账：假设 **24 周内模型每周迭代一次有 24 次试错机会，硬件同期只付得起 1–2 次大改**。因此硬件不该追着模型改，而该做成缩小 Sim-to-Real 差距的白盒接口（动作模型能预测，反馈模型能信）。为此部件选型全面为**可建模性**让路：**弃用人形主流的谐波减速器（内阻约为行星的 2 倍，且柔性齿轮啮合带历史加载迟滞 Hysteresis 与温漂，极难建模），改用行星执行器**——实测双手走圆形轨迹，**从仿真迁移到真机的跟踪均方根误差（Tracking RMSE）仅增加 1.3 mm**（⚠️ 未给谐波对照数）；同时**不加关节力矩传感器**，直接靠好建模的行星传动与执行器物理模型由电流估外力（仿真 15N 外力下误差手腕 ~1.39、肘部 ~8 ⚠️ 纯属仿真结果）。 — [S32]({{< relref "s32-dyna-robot-hardware.md" >}})
  - 未来不远在含 **1,500+ 零件、21 自由度、22 传感器**的家庭机器人 F2 上，严格做好 **30Hz 模型输出与 500Hz 底层电机伺服平滑衔接**，以及“相机看到半杯水”与“手臂动到该位置”的**软硬件时间戳对齐**。 — [S34]({{< relref "s34-futuring-robot-home-service-robots.md" >}})

#### 3. 具身数据四路线交锋与 Lance 增量数据构建系统
- **⚔️ 路线交锋：具身智能的训练数据到底从哪来？后训练用不用遥操作与仿真？**
  1. **路线 A（无本体穿戴采集近 30 万小时，预/后训练全不用遥操作）**：穹彻智能**不建任何中心化数采工厂**，靠全国**近 100 个城市、峰值超 1,000 名数采员**带无本体穿戴工具进真实场景自采**近 30 万小时**数据，完全放弃生产级人工标注质检，由 AI 数据管线 **T+0** 实时反馈好坏；为保数据 pattern 一致，**后训练也全部只用无本体方案、明确不用遥操作**。 — [S31]({{< relref "s31-noematrix-noe-0.md" >}})
  2. **路线 B（500+ 真实家庭回流 + 保存“未执行想象候选轨迹”）**：未来不远坚持按用户愿付钱的痛点定任务边界（把最难的**切辣椒、切肉**纳入炒菜闭环），以 1 万小时第一人称 + 3 万小时真机数据为底，在 **500+ 真实家庭累计工作超 5 万小时**；去掉“人决定何时更新”，模型并行推理多候选时，把**成功、纠正、失败以及“推理时想象过但未实际执行的候选轨迹”**全存盘回流，经 **30 轮自进化**将 4 项家务平均成功率从 **45.4% 提至 86.6%**（切菜从 **38.2%→68.9%** ⚠️ 对应迭代轮数未说明）。 — [S34]({{< relref "s34-futuring-robot-home-service-robots.md" >}})
  3. **路线 C（玻尔兹曼能量地形 + 光量子伊辛机 Real2Real ⚠️）**：数耀量生指出单高斯分布拟合多峰动作会取均值撞向两扇门中间的墙；主张只用几十条真机样本反推**玻尔兹曼能量地形**，把求最低能量点交给 **1,000 量子比特光量子相干伊辛机（1–3ms 采样）**，不经过仿真实现自我改进，宣称突破开源 VLA 基线 8 万 epoch **93.7%** 的平台期、仅调隐空间 1.2 万 epoch 达 **98%**（⚠️ 讲者宣称，展示的 93.7%→98% 实为公开仿真基准结果，现场未公布真机对照数字且微调变量未严格对齐）。 — [S30]({{< relref "s30-quantsparkle-real2real.md" >}})
  4. **路线 D（程序管状态生成人手转机械臂视觉变体）**：VAST 尝试用 5B 渲染模型将真实人类演示视频中的**人手替换为机械臂**批量刷出视觉变体（讲者坦承物理上准不准、对机器人学习有没有用还要实测）。 — [S27]({{< relref "s27-vast-3d-to-world-models.md" >}})
- **机器人数据采集一次、加工无数次，要的是构建系统（Data Build System）而非存储**：LanceDB 丁皓指出，每次追加数据、换打标模型或换 Embedding API 都要重算历史数据，必须把原始数据当源码构建：① **`add column` 几乎零开销**（只写新文件不重写旧表，原生支持 Git 式分支/Tag）；② **专为机器人设计的 `Cell Flag` 区分四类空值**（**夹爪未夹物的有效空、未采集、采集失败、夹爪夹到自己**），配稀疏编码将某表从 **300+ MB 压到 1 MB（降 300+ 倍）**；③ **列绑定 Python 函数做增量 GPU 计算**（新增 100 帧只算 100 帧，全算完才原子发布 Snapshot），已支撑 **25 PB** 工厂视频抽帧训练，Hugging Face **LeRobot（⚠️ 推断名）已原生支持 Lance**，比其原生格式**快 3–5 倍**。 — [S35]({{< relref "s35-lancedb-robot-data-build-system.md" >}})

---

### 副表：案例按 L0–L6 分层

L0 AI 辅助构建，L1 Prompt Wrapper，L2 RAG，L3 会用工具的 AI，L4 固定 workflow，L5 Agentic Core，L6 AI-native 系统。沙箱、推理、存储、硬件等底层基础设施不算 AI 产品，已融入上方对应专题，未列入下表。

<div class="aie-map-table">

| 层 | 案例（场次） |
|---|---|
| **L0 AI 辅助构建** | Kimi 一个人约 4 天、3,000 元 token 做可玩游戏（[S17]({{< relref "s17-kimi-game-dev-in-ai-era.md" >}})）；独立开发者盯能力临界点 + 多机位盲审 Loop 16 天做 3D《小王子》（[B11]({{< relref "b11-sac-idea-to-viral-launch.md" >}})）；Data4Life 2 个人用近 300 个 PR 重写医疗平台 Atlas（开发方式）（[B09]({{< relref "b09-data4life-harness-is-first-reviewer.md" >}})） |
| **L1 Prompt Wrapper** | （无公开案例；VC 圆桌指出三年前拿过钱的早期模型套利应用 90%–99% 已出局，[S24]({{< relref "s24-panel-ai-startups-vc.md" >}})） |
| **L2 RAG** | Dify 客户的县立图书馆 AI librarian（[B03]({{< relref "b03-dify-managing-500th-agent.md" >}})）；DataHub 带可信度等级的上下文平台，接近 RAG 的数据底座（[B08]({{< relref "b08-datahub-trusted-context.md" >}})）；把知识图谱直接塞进 prompt（被讲者证伪的做法）（[B10]({{< relref "b10-datusai-executable-ontologies.md" >}})） |
| **L3 会用工具** | Optiver 多区域薄 LLM 网关（[M03]({{< relref "m03-optiver-multi-region-llm-gateway.md" >}})）；Jina Reader 网页读取工具（[S37]({{< relref "s37-jina-reading-the-web.md" >}})）；You.com 8 小时 RLVR 训出的搜索模型（[S03]({{< relref "s03-youcom-post-training-search.md" >}})）；Liquid AI 端侧一次前向决策模型（[S28]({{< relref "s28-liquid-ai-decision-models.md" >}})）；1Password 本地 4 亿参数运行时意图裁判（[S33]({{< relref "s33-1password-agent-intent-check.md" >}})）；MiniMax Code 的 CLI 工具发现和 PTC 脚本批量调用（[S25]({{< relref "s25-minimax-leaner-harnesses.md" >}})）；Meta 给被测 App 补的组件语义和内置 CLI（[B05]({{< relref "b05-meta-beyond-screenshots.md" >}})）；DatusAI `Apache Ossie` Rust 语义运行时（[B10]({{< relref "b10-datusai-executable-ontologies.md" >}})）；企业查数 text-to-SQL agent（[B08]({{< relref "b08-datahub-trusted-context.md" >}})）；Buy for Me 等跨站购物 agent（L3–L5）（[B04]({{< relref "b04-visa-infra-for-agents-that-act.md" >}})） |
| **L4 固定 workflow** | AhaCreator 达人链路（1,000 件事 AI 做 800 件、人管 4 步）（[B12]({{< relref "b12-ahacreator-matching-to-delivery.md" >}})）；Harvey 的 PR 描述生成（[B02]({{< relref "b02-harvey-trust-your-own-evals.md" >}})）；消费电子公司 7 个 agent 串联处理客诉（[B03]({{< relref "b03-dify-managing-500th-agent.md" >}})）；Agoda 自动提 `Context MR` 的 skill（[B07]({{< relref "b07-agoda-your-repo-your-benchmark.md" >}})）；Data4Life 每日扫 163 个社区 issue（[B09]({{< relref "b09-data4life-harness-is-first-reviewer.md" >}})）；Meta 验证智能体（确定性首尾包着一段 L5）（[B05]({{< relref "b05-meta-beyond-screenshots.md" >}})）；Daily 点奶茶语音 agent，固定管道，接近 L4（[S22]({{< relref "s22-daily-trusting-evals-i-cant-read.md" >}})）；制造业工人语音捕捉群聊突发事件（[S21]({{< relref "s21-hicap-ai-in-manufacturing.md" >}})） |
| **L5 Agentic Core** | Claude Code、MiniMax Code（[S25]({{< relref "s25-minimax-leaner-harnesses.md" >}})）；StepFun 22h–48h 长程 agent（[S07]({{< relref "s07-stepfun-agent-harness.md" >}})）；Kimi 跑长程沙箱任务（[S17]({{< relref "s17-kimi-game-dev-in-ai-era.md" >}})）；Microsoft 带独立 Entra ID 的企业 agent（[M02]({{< relref "m02-microsoft-enterprise-agents.md" >}})）；YouMind ToM 创作 Studio（[B01]({{< relref "b01-youmind-personal-agent-for-growth.md" >}})）；Harvey Specter、修 CI agent（[B02]({{< relref "b02-harvey-trust-your-own-evals.md" >}})）；Cookiy `<1.3s` 三子 agent 级联实时访谈（[B06]({{< relref "b06-cookiy-agentic-harness.md" >}})）；DatusAI 数据探索 agent（[B10]({{< relref "b10-datusai-executable-ontologies.md" >}})）；Exa 开源个人 agent（[S12]({{< relref "s12-exa-personal-agent-search.md" >}})）；Arena 通用 agent（[S05]({{< relref "s05-arena-measure-the-frontier.md" >}})）；Manus 研发 coding agent（[S11]({{< relref "s11-manus-ai-native-work.md" >}})）；OpenClaw 个人 agent harness（[S08]({{< relref "s08-openclaw-intent-engineering.md" >}})）；Langfuse 内部后台改进 agent（[S01]({{< relref "s01-langfuse-building-agents.md" >}})）；HeyGen 写 HTML 的视频 agent（[S19]({{< relref "s19-heygen-html-is-all-your-agents-need.md" >}})）；穹彻 `Noe-0` + Robot Agentic 系统（[S31]({{< relref "s31-noematrix-noe-0.md" >}})） |
| **L6 AI-native 系统** | 独立身份 agent 不经编排地互相协作（讲者预测）（[M02]({{< relref "m02-microsoft-enterprise-agents.md" >}})）；验证智能体每日扫自己的失败记录提 Diff 改进（倾向，人仍在评审）（[B05]({{< relref "b05-meta-beyond-screenshots.md" >}})）；OpenClaw 单人并行 300+ agent 开发暗工厂（接近）（[S08]({{< relref "s08-openclaw-intent-engineering.md" >}})）；Manus 单一 Mono + 全员任务公开研发体系（接近）（[S11]({{< relref "s11-manus-ai-native-work.md" >}})）；Nowledge 团队夜里与周末 Dark Office 半闭环 RSI（[S36]({{< relref "s36-nowledge-memory-engineering.md" >}})）；未来不远 500+ 家庭自动回流未执行候选轨迹 30 轮自进化机器人（硬套最接近）（[S34]({{< relref "s34-futuring-robot-home-service-robots.md" >}})） |

</div>

重心高度集中在 **L3 的高可靠原子工具**（网关、一次前向决策模型、本地意图裁判、语义编译器、CLI/PTC）和 **L5 的 Agentic Core**；**L1 薄壳包装已无生存空间**；**L6 均处于“半闭环”阶段**——无论是代码合入、自动提 Diff 还是 Dark Office，人类对最终验证标准（Proof）的定义与注意力审批依然是不可卸载的锚点。

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
