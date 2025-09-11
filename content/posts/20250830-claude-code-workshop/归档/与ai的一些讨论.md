好问题。短答：不是拍脑袋。这 5 个能力背后有**可迁移的工程共识 + 具体研究**做支撑；我把每一条对应的“证据链”给你对上号（并标注强弱）。

### 能力 → 证据（要点）

1. **任务框架/清晰约束（Role/Rules/Resources/Request/Checks）**

* 厂商与工程指南都强调“结构化提示 + 明确产出标准”。Anthropic 的 Claude Code 官方最佳实践建议在仓库内放清晰说明（如 *CLAUDE.md*）、明确工具与目标；这正是把“角色/规则/资源/请求/校验”外化。([Anthropic][1])
* 企业级文档也把结构化提示作为稳定做法（如何给约束、示例、评估标准）。([Palantir][2])
  **强度：中（实践共识 + 官方指南）。**

2. **最小足够上下文（别一股脑全贴）**

* 长上下文并不总是被模型有效利用；经典研究“**Lost in the Middle**”表明关键信息在超长上下文的中间位置时，模型检索/推理显著下降。因此“聚焦必要片段 + 指路标”更可靠。([arXiv][3], [Computer Science][4])
  **强度：强（独立学术研究，多次复现）。**

3. **迭代—验证回路（先测后码 / 小步快跑 / 让模型自检）**

* 让模型在**可执行环境+测试**里反复尝试，显著提升代码任务成功率（如 SWE-bench/SWE-agent 在“运行→看测试→再修”的循环中远超一次性生成）。([arXiv][5], [OpenReview][6])
* “自反思/自改进”范式（Reflexion、Self-Refine）在多任务上显著提升效果，说明“生成→检查→修订”的流程普适有效。([arXiv][7])
  **强度：强（基准测试 + 多篇论文）。**

4. **读码与重构——小改动、保持行为不变**

* 这是计算机软件工程的老共识：Refactoring 的定义就是**不改外部行为**地改善内部结构；建议用细粒度、可回滚的改动。([refactoring.com][8], [martinfowler.com][9])
* 业界评审规范鼓励**小 CL/小 PR**：更快审、更少引入缺陷、更容易回滚。([Google GitHub][10])
  **强度：强（长期工程实践 + 官方评审规范）。**

5. **风险与治理（别盲信；关注安全与合规）**

* LLM 应用有特定风险（提示注入、输出处理不当、供应链等），OWASP 已列入 **LLM Top 10**。([OWASP Foundation][11])
* 多项研究/报告提示：AI 辅助能提速，但**安全缺陷密度可能上升**，需要更强的人审与自动化安全检查（如 Apiiro 2025 的大规模仓库研究；以及针对 Copilot 生成代码安全性的实证分析）。([Apiiro][12], [arXiv][13])
  **强度：中到强（行业与学术并存，数据持续更新）。**

---

### 旁证：为什么这些做法“可迁移”

* **生产力提升**：随机对照试验证明 AI 结对编码能显著提速（Copilot RCT：特定任务 55.8% 更快），说明“把任务说清 + 提供必要上下文”确实能换来效率。([arXiv][14])
* **但不可迷信一次性生成**：安全与正确性在“一步到位”时最脆弱，研究与基准都显示**多轮约束+测试驱动**更稳。([arXiv][5])

如果你愿意，我们可以把上面 5 点落成**可复用清单 + 提示模板**，并在一个小练习里对比“全量上下文一把梭”vs“最小足够上下文 + 迭代验证”的差异。

先选一个你最想验证的点：
要不要从 **“最小足够上下文”** 开个 15 分钟小实验（同一问题两种喂法，量化失败率/修复步数）？或者你更想先做 **“迭代—验证回路”** 的测试驱动小练习？只选一个，我们一步来。

[1]: https://www.anthropic.com/engineering/claude-code-best-practices?utm_source=chatgpt.com "Claude Code: Best practices for agentic coding"
[2]: https://palantir.com/docs/foundry/aip/best-practices-prompt-engineering/?utm_source=chatgpt.com "Best practices for LLM prompt engineering"
[3]: https://arxiv.org/abs/2307.03172?utm_source=chatgpt.com "Lost in the Middle: How Language Models Use Long Contexts"
[4]: https://cs.stanford.edu/~nfliu/papers/lost-in-the-middle.arxiv2023.pdf?utm_source=chatgpt.com "Lost in the Middle: How Language Models Use Long ..."
[5]: https://arxiv.org/abs/2405.15793?utm_source=chatgpt.com "SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering"
[6]: https://openreview.net/pdf?id=VTF8yNQM66&utm_source=chatgpt.com "SWE-BENCH: CAN LANGUAGE MODELS RESOLVE ..."
[7]: https://arxiv.org/html/2303.11366v4?utm_source=chatgpt.com "Reflexion: Language Agents with Verbal Reinforcement Learning"
[8]: https://refactoring.com/?utm_source=chatgpt.com "Refactoring"
[9]: https://martinfowler.com/bliki/DefinitionOfRefactoring.html?utm_source=chatgpt.com "Definition Of Refactoring"
[10]: https://google.github.io/eng-practices/review/developer/small-cls.html?utm_source=chatgpt.com "Small CLs | eng-practices - Google"
[11]: https://owasp.org/www-project-top-10-for-large-language-model-applications/?utm_source=chatgpt.com "OWASP Top 10 for Large Language Model Applications"
[12]: https://apiiro.com/blog/4x-velocity-10x-vulnerabilities-ai-coding-assistants-are-shipping-more-risks/?utm_source=chatgpt.com "4x Velocity, 10x Vulnerabilities: AI Coding Assistants Are ..."
[13]: https://arxiv.org/html/2310.02059v3?utm_source=chatgpt.com "Security Weaknesses of Copilot-Generated Code in GitHub ..."
[14]: https://arxiv.org/abs/2302.06590?utm_source=chatgpt.com "The Impact of AI on Developer Productivity: Evidence from GitHub Copilot"
