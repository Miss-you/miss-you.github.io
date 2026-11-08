---
name: writing-wiki-from-practice
description: Use when a user wants to turn rough notes, a personal experience, or a practical tip into a new or updated entry in this Hugo knowledge base.
---

# 将实践整理为知识条目

把用户的原话整理为围绕一个具体事项、以后容易查回的知识条目。阅读仓库 `AGENTS.md` 中的 Knowledge-base Writing Workflow，以及 `content/kb/` 的现有结构和相关条目；更新旧文优先保留原 slug、资源和已有事实。

## 从原话到条目

1. 从用户材料中提取具体事项、当时的情况、做过的动作、观察到的结果与适用条件。用户描述的感受按个人体验归因；可核实的资料、截图或操作记录可作为依据。区分亲身实践、示例、建议和待验证推测，查证必要的技术事实。
2. 有影响理解或会造成事实杜撰的缺口时，集中问一两个具体问题，同时先做不依赖答案的工作。没有实际验证信息时明确标记待补充，并在用户要求已验证实践时将未验证的新内容保留为草稿，直到取得依据；已发布页面保持上线，避免为此擅自撤下；不编造日期、环境、效果、数字或个人经历。
3. 新建或更新 `content/kb/` 下的 Markdown，遵循仓库现有 Hugo front matter、`lang`、slug、topic、图片及 draft 约定。正文建议自然交代「当时的情况 → 我怎么做 → 观察到什么 / 依据」，日期和环境有用且已知时写明。标题和段落按内容灵活调整，导航或维护说明可采用更合适的形式。
4. 按仓库 AGENTS.md 的知识库写作流程依次使用指定的去 AI 味及阅读负担检查，保护原始规则、代码、链接、事实与作者口吻。第三方 skill 只读取文本；有不可用的技能或材料时说明，切勿假称已使用。
5. 检查内容、front matter、链接和 Hugo 构建；对实践记录核对每项事实来源与结论范围。按用户当前授权决定提交、推送或发布，公开前检查可能不宜披露的具体细节，尊重用户已有授权；不把创建条目当作自动发布授权。
