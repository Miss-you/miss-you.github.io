---
title: "给 Copilot Code Review 配项目知识：一个 iOS 项目的实践"
slug: copilot-code-review-project-context
date: 2026-11-18
lastmod: 2026-11-18
lang: zh
topic: "工程实践"
summary: "全仓审查规则，以及分别面向 iOS 和 Room 模块的路径指令。"
tags: [GitHub Copilot, 代码审查, AI编程]
draft: false
---

2026 年 11 月 18 日，我们在一个 iOS 项目里通过一个 PR，为 GitHub Copilot 代码审查配置了分层指令：全仓文件 `.github/copilot-instructions.md` 约定通用审查规则，目录级文件 `.github/instructions/*.instructions.md` 补充 Room 等业务模块的路径指令；项目原有的架构地图与运行契约仍留在根目录及各模块的 `AGENTS.md` 和模块文档里，不重复抄进提示词。

下面给出全仓规则与路径指令的完整配置；其中的 `App/Rooms/**/*.swift`、`docs/feature-contract.md` 和模块检查项为示意路径与模板内容，接入时替换为项目实际目录与契约文档即可。

`.github/copilot-instructions.md`：

```markdown
开始审查前，先阅读根目录 `AGENTS.md`；如果改动目录存在对应的 `AGENTS.md` 或模块文档，也一并参考。本文件只约定通用审查要求，不重复抄写模块契约。

审查代码改动时，按以下要求执行：
1. 顺着受影响的调用链追踪状态所有权、触发时机与下游影响，对照对应模块契约判断是否越界。
2. 每条审查评论必须说明：代码位置、触发条件、实际影响，以及对应的调用链或契约文档依据。
3. 按严重程度从高到低排序，同一根因引发的问题合并说明。
4. 不设置评论数量上限，不只报 P0/P1，也不设置 95% 置信度硬门槛，不限制各级有依据的缺陷；遇到高影响但尚未坐实的疑点，标明不确定性与建议的验证方法。
```

`.github/instructions/rooms.instructions.md`：

```markdown
---
applyTo: "App/Rooms/**/*.swift"
---
审查该目录改动时，顺着调用链核查账号切换后旧请求结果是否可能覆盖当前账号状态，参考 `docs/feature-contract.md`。
```

## 触发设置

个人账号设置、仓库分支规则集与组织规则集都能独立触发 Copilot 自动审查，三层互不依赖，因此单个 PR 自动触发了审查，不代表团队全员或所有受保护分支都已启用。默认触发时机通常是 PR 创建或转为 Ready，草稿 PR 与每次 push 重新触发则属于可选项。要让目标分支稳定执行，需由仓库或组织管理员配置自动触发规则，并确认自定义指令开关已经开启，配置入口见 [GitHub 自动审查配置文档](https://docs.github.com/en/copilot/how-tos/copilot-on-github/set-up-copilot/configure-code-review)。

## 验证读取与边界

Copilot 审查时读取的是 PR head 分支上的指令版本，因此可以在新增或修改指令的同一条 PR 中尝试验证。但按照 [GitHub 代码审查使用文档](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/use-code-review?tool=xcode)的机制，`applyTo` 只负责路径匹配，命中路径并不保证 Copilot 一定会加载或遵守对应指令。想核实指令是否被读取，应在有权限时查看 PR 时间线里的审查会话或相关运行日志，确认是否存在诸如 `read_code` 这样的文件**读取记录**，不能只在日志里看到文件名就认定已读取；没有读取记录或无法访问日志时，不能下结论。即使已读取，也不证明指令被遵守，仍须结合实际审查行为观察。另外，[GitHub 代码审查说明](https://docs.github.com/en/copilot/how-tos/copilot-on-github/use-copilot-agents/copilot-code-review)指出，评论上的来源标注只代表 MCP 或 agent skill 引用，不能证明自定义指令已被加载。

## 反馈沉淀与本地流程

收到 Copilot 评论后，先由人工核实问题和建议是否成立，避免把未经核对的零散要求直接堆进全仓规则。确认属于有价值的真实反馈、误报边界或仍需报告的例外后，再按需回写到 `AGENTS.md`、模块契约或窄范围的路径指令中，并留存关联 PR、评论或修复提交 SHA、适用条件及验证方式，方便日后溯源和清理过时条目。如果项目本来就配置了作者侧的本地审查流程，仍由开发者自己在本地执行，GitHub 上的云端审查不会自动运行这一套流程。

## 这次验证到了什么

在这次接入指令的 PR 中，我们在 PR 时间线可访问的审查会话与运行日志里核对了实际记录，本次能确认的范围如下：

| 观察项 | 本次记录 | 能确认的范围 |
| --- | --- | --- |
| 审查耗时与结果 | `Balanced` 强度耗时 4 分 26 秒，没有产生行内评论或审查讨论串 | 因 PR 里没有 Swift 或 Room 的业务代码，不能因为零评论就推导出审查准确率 |
| 指令读取记录 | 运行日志中查到全仓指令已被读取 | **证实全仓指令被读取，没有验证路径指令是否加载** |
| 运行日志异常 | 部分后台请求未成功 | 具体对审查覆盖的影响尚未确定 |
| 合并前检查 | 检查了 frontmatter 格式、路径匹配正反例、链接和密钥扫描 | 因为没有业务代码变动，没有跑完整 Xcode 验证 |
| 自动审查触发 | 单个 PR 自动触发了审查，配置已合入主分支 | 不等于团队全员已开启或所有协作者的 PR 都会触发；管理员侧的统一自动触发规则与自定义指令开关状态仍有待确认 |

下一步用真实业务 PR 观察路径指令的读取与实际审查表现。

延伸阅读：关于分层维护项目上下文与沉淀核实经验的思路，可参考 Yuzheng Sun 的[《AI User 与 AI Builder 的 5 个差距》](https://www.superlinear.academy/c/ai-resources/ai-mastery)「差距 4」。
