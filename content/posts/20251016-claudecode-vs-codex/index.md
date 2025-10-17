---
title: "Claude Code 还是 Codex？贵但强 vs 便宜但稳"
date: 2025-10-16T13:34:27+08:00
draft: false
tags: ["AI编程工具", "Claude Code", "GPT-5 Codex", "成本对比", "开发效率"]
categories: ["开发实践", "工具评测"]
description: "Claude Code 每次任务花 $10，Codex 只要 $2.5——但贵4倍能换来什么？基于同一仓库的端到端实测：14维度对比、10项基准测试、真实项目成本拆解，看清每一分钱花在哪。"
cover:
    image: ""
    alt: "Claude Code vs GPT-5 Codex 成本与性能对比"
    caption: "端到端实测：从 UI 克隆到推荐管线的完整对比"
    relative: true
---

纠结 Claude Code 还是 Codex？一个贵 4 倍但 SWE-bench 高 3%，一个便宜但社区说"更稳定"。这里有最短路径：同一仓库、同一任务的端到端实测——从 UI 克隆到推荐管线，看清每一分钱花在哪。 

# 摘要

* **同样预算写更多代码** → **Codex**
* **更完整不敷衍** → **Codex**，更倾向完成整个 PR 并补测试
* **数据分析与快速原型** → **Codex**，更便宜，开发循环更稳定
* **代码质量** → **Codex**，代码质量和规范性更好
* **前端 UI 还原度** → **Claude Code**，UI 保真度更高
* **大规模重构** → **Claude Code**，更擅长大规模架构调整
* **复杂任务与系统操作** → **Claude Code**，SWE-bench 77.2，OSWorld 61.4
* **首字响应速度** → **Claude Code**，Vertex TTFT ≈1.67s
* **超长上下文支持** → **Claude Code**，多云部署可达 1M 上下文
* **成本控制与调优** → **Codex**，可调推理深度，灵活控制速度和费用
* **端到端项目成本** → **Codex**，约 $2.50 vs Claude 约 $10.26
* **表现稳定性** → **Codex**，运行稳定，调试循环更可靠
* **文档写作** → **Claude Code**，文档生成质量更高
* **图表生成（XML/PlantUML）** → **Claude Code**，结构化图表生成更擅长

# 端到端开发成本对比

Composio 在同一仓库、同一 MCP 环境下做了实测对比，汇总了不同场景的 Token 与成本差异：

| 场景/维度 | Claude Code（Sonnet 4.5） | Codex（GPT‑5‑codex） | 结论 |
|:--|:--|:--|:--|
| UI 克隆（Figma 参考）Token | ~5,000,000 | ~250,000 | Codex 更省 Token；Claude UI 保真更高 |
| Lint/Schema 修复 Token | ~4,000,000 | ~100,000 | Codex 修复更高效、更省 |
| 推荐管线（Schema+API+UI）Token/用时 | ~1,189,670；约 10 分钟 | ~309,000；约 25 分钟（未做 Expo UI） | Claude 更快但后续出现 Schema/API 问题；Codex 更稳 |
| 整体验证成本 | 约 $10.26（18M 输入 + 117k 输出） | 约 $2.50（600k 输入 + 103k 输出） | Codex 总体更省钱 |
| 计价假设（用于 Codex 估算） | — | 输入 $1.25/M，输出 $10/M | 引文用于估算的单价 |
| 成本趋势 | 长会话、UI 工作量大时更贵 | 大型编码任务更省 Token | “实现与修复”选 Codex，“设计/UI”选 Claude |

数据来自 Composio 的实测文章 [Claude Sonnet 4.5 vs. GPT-5 Codex: Best model for agentic coding](https://composio.dev/blog/claude-sonnet-4-5-vs-gpt-5-codex-best-model-for-agentic-coding)

# API 与规格

| 特性 | OpenAI GPT-5 Codex | Anthropic Claude Sonnet 4.5 | 优势方 |
|:-----|:------------------|:---------------------------|:------|
| **模型定位** | 专为代理式编程优化的 GPT-5 版本 | 复杂代理和编程任务的最佳模型 | - |
| **发布时间** | 2025 年 9 月 23 日 | 2025 年 9 月 29 日 | Claude（更新） |
| **上下文窗口** | 400K tokens | 200K （标准） | **GPT-5 Codex** |
| **最大输出** | **128K tokens** | 64K tokens | **GPT-5 Codex** |
| **知识截止** | **2024 年 9 月 30 日** | 2024 年 4 月 | **GPT-5 Codex** |
| **多模态支持** | 文本、图像（输入） | 文本、图像（输入） | 平手 |
| **输入定价** | **$1.25/M** | $3.00/M | **GPT-5 Codex (2.4x)** |
| **输出定价** | **$10.00/M** | $15.00/M | **GPT-5 Codex (1.5x)** |
| **缓存折扣** | 90% ($0.125/M) | 90% | 平手 |

数据来自官方文档：
- [OpenAI Platform Documentation](https://platform.openai.com/docs/models/gpt-5-codex)
- [Anthropic Claude Documentation](https://docs.claude.com/en/docs/about-claude/models/overview)

# API 详细基准测试对比

两款模型在 10 个权威基准测试中的表现对比：

| 基准测试 | 测试内容 | GPT-5 Codex | Claude Sonnet 4.5 | 优势方 |
|:--------|:--------|:-----------|:-----------------|:------|
| **Terminal-Bench Hard** | 代理编程与终端使用 | **36%** | 33% | GPT-5 Codex |
| **τ²-Bench Telecom** | 代理工具使用 | **87%** | 78% | **GPT-5 Codex** |
| **AA-LCR** | 长上下文推理 | **69%** | 66% | GPT-5 Codex |
| **Humanity's Last Exam** | 推理与知识 | **25.6%** | 17.3% | **GPT-5 Codex** |
| **MMLU-Pro** | 推理与知识 | 87% | **88%** | Claude Sonnet 4.5 |
| **GPQA Diamond** | 科学推理 | **84%** | 83% | GPT-5 Codex |
| **LiveCodeBench** | 编程能力 | **84%** | 71% | **GPT-5 Codex** |
| **SciCode** | 科学编程 | 41% | **45%** | Claude Sonnet 4.5 |
| **IFBench** | 指令遵循 | **74%** | 57% | **GPT-5 Codex** |
| **AIME 2025** | 竞赛数学 | **99%** | 88% | **GPT-5 Codex** |

**胜负统计**：GPT-5 Codex 在 8/10 项测试中领先。

数据来自 [Artificial Analysis - Intelligence Evaluations](https://artificialanalysis.ai/models/comparisons/claude-4-5-sonnet-thinking-vs-gpt-5-codex)

# 社区反馈与真实用户体验

## Reddit 和 Hacker News 讨论总结

通过浏览 Reddit 的 r/ChatGPTCoding、r/ClaudeAI 板块和 Hacker News 上数百条真实用户反馈，整理出以下关键观点：

### 支持 GPT-5 Codex 的观点

> "GPT-5 Codex 在复杂问题和项目级理解上表现更好。" - Reddit 用户

> "更易控制，执行精确，适合有经验的开发者。" - Hacker News 讨论

> "在大规模重构上表现更好，而且成本低得多。" - Reddit r/ChatGPTCoding

### 支持 Claude Sonnet 4.5 的观点

> "Claude 的规划和架构能力更强，UI 保真度更高。" - Reddit 用户

> "多工具工作流处理更好，对于绿地项目更友好。" - Hacker News 讨论

> "代码输出更易读，虽然有时会过于'热情'地扩展请求。" - Reddit r/ClaudeAI

### 混合观点

> "两者各有优势，取决于具体任务类型。对于快速原型，我用 Claude；对于生产代码，我用 GPT-5 Codex。" - Reddit 用户

> "Claude 在前端任务上更好，GPT-5 Codex 在后端逻辑上更强。" - Hacker News 讨论

# SWE-bench Verified 对比

## 用户提供的数据

| 模型 | 得分 | 备注 |
|:-----|:----|:-----|
| **Claude Sonnet 4.5** | **77.2% - 82.0%** | 标准运行 77.2%，并行测试 82.0% |
| **GPT-5 Codex** | 74.5% - 77% | - |

## Anthropic 官方数据（2025 年 9 月 29 日）

| 模型 | SWE-bench Verified 得分 | 备注 |
|:-----|:---------------------|:-----|
| **Claude Sonnet 4.5** | **77.2%** （标准运行） | ✅ 与用户数据匹配 |
| **Claude Sonnet 4.5** | **82.0%** （并行测试） | ✅ 与用户数据匹配 |
| **GPT-5 Codex** | **74.5%** | ✅ 与用户数据匹配 |
| GPT-5 | 72.8% | - |
| Gemini 2.5 Pro | 67.2% | - |

**验证结果**：用户提供的 SWE-bench Verified 数据与官方数据基本一致

### 数据来源

- [Reddit - Codex CLI + GPT-5-codex discussion](https://www.reddit.com/r/ChatGPTCoding/comments/1o174kr/codex_cli_gpt5codex_still_a_more_effective_duo/)
- [Reddit - After using Sonnet 4.5](https://www.reddit.com/r/ChatGPTPro/comments/1nxtswp/after_using_sonnet_45_im_convinced_gpt5codex_is/)
- [Hacker News - Claude Sonnet 4.5 discussion](https://news.ycombinator.com/item?id=45415962)

# 为什么最近社交媒体都在夸 Codex？

最近浏览社交媒体时，发现一个明显转折。大家都在夸 Codex 好用，为什么会这样？关键在于 OpenAI 在 2025 年 9 月 发布了 GPT-5-Codex，把 AI 编程工具从代码补全器升级成了能独立完成复杂任务的 AI 工程师。

## 风评变化过程

**2025 年 9 月之前**，大家更推崇 Claude。尤其是 OpenAI 停掉旧版 Codex API 之后，Claude 3 Opus 和 Claude 3.5 Sonnet 在编程能力上获得了更多好评。当时开发者普遍认为，Claude 更擅长理解代码、处理大项目，准确性也更高。

**2025 年 9 月之后**，风向明显变了。通过浏览大 V 观点、翻阅 Reddit 帖子，也用了 Deep Research 功能搜索验证后，发现大家的说法主要集中在三点：

1. **Codex 变成了专业选手** - OpenAI 把 GPT-5 专门优化成了软件工程版本。它不只是写代码，还能自己重构、调试、跑长期任务。相比之下，Claude Code 在使用过程中经常会卡住，或者假装自己完成了任务，实际上并没有做完。

2. **会动态调整效率** - OpenAI 的数据显示，Codex 处理复杂任务时会花两倍时间深度思考，遇到简单任务又能快速搞定。这种智能调节让它应对各种难度都游刃有余。

3. **产品形态大升级** - Codex 不再只是个 API 接口，而是演变成包含命令行工具、IDE 插件、云端环境的完整系统，更适合大团队使用。

## 实际使用 Codex 和 Claude Code 后的感受

**9 月前**：Claude Code 在代码理解深度、处理大项目和代码可靠性上表现更好，适合个人或小团队精细开发。

**9 月后**：真正尝试后发现，Codex 可以完成那些更复杂、更耗时的任务。比如爬取多个网页数据，按规则写代码分析，套用公式计算，最后整理成一篇像样的研究报告，这种需要几个小时的复杂流程，Codex 都能稳定完成。而之前想让 Claude Code 做的一些长时间任务，它总是中途卡住或者没做完就说完成了，但 Codex 却能真正把活干完。

**总结**：Codex 更像个能独立干活的 AI 工程师，可以放心交给它长时间复杂任务。Claude Code 更像个能力强的编程助手，适合 Copilot 模式的实时协作。


# 使用场景矩阵

根据个人经验，我总结了一个使用场景矩阵：

| 场景 | 项目规模 | 预算 | 推荐工具 | 理由 |
|:-----|:--------|:----|:--------|:-----|
| **原型开发** | 小型 | 低 | **Codex** | 成本低，快速迭代 |
| **MVP 开发** | 中型 | 中 | **Claude Code** | 规划能力强，UI 好 |
| **生产环境** | 大型 | 高 | **Codex** | 成本效益，代码可靠 |
| **前端项目** | 任意 | 任意 | **Claude Code** | UI 保真度高 |
| **后端/算法** | 任意 | 任意 | **Codex** | 逻辑清晰，性能好 |
| **代理应用** | 任意 | 高 | **Claude Code** | 代理能力更强 |


# 数据来源

本文数据来自以下高可信度来源：

**官方文档**
- [OpenAI Platform Documentation](https://platform.openai.com/docs/models/gpt-5-codex)
- [Anthropic Claude Documentation](https://docs.claude.com/en/docs/about-claude/models/overview)
- [Anthropic Official News](https://www.anthropic.com/news/claude-sonnet-4-5)

**权威第三方评测**
- [Artificial Analysis](https://artificialanalysis.ai) 专业 LLM 性能评测平台
- [Surge AI](https://www.surgehq.ai/blog/sonnet-4-5-coding-model-evaluation) AI 评估专业机构
- [SonarSource](https://www.sonarsource.com/blog/the-coding-personalities-of-leading-llms-gpt-5-update/) 代码质量分析权威

**API 提供商实测**
- [OpenRouter](https://openrouter.ai) 多提供商 API 聚合平台

**社区讨论**
- Reddit 的 r/ChatGPTCoding 和 r/ClaudeAI 板块
- Hacker News
- 技术博客如 Composio、BinaryVerseAI
