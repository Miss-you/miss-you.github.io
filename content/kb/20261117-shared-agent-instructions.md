---
title: "多工具共用 AGENTS.md 与 CLAUDE.md 的防漂移配置"
slug: "shared-agent-instructions"
date: "2026-11-17"
lastmod: "2026-11-18"
lang: "zh"
topic: "工程实践"
summary: "介绍在同一仓库中用 @AGENTS.md 薄壳同步 Claude Code、Codex 与 Cursor 规则的做法、四种方案取舍及子目录加载核对步骤。"
tags: ["AGENTS.md", "CLAUDE.md", "Claude Code", "Codex", "Cursor"]
draft: false
---

假定团队把项目的单测命令从 `pytest` 改成了 `uv run pytest`。如果仓库里为 Claude Code 和 Codex 分别维护两份规则文件，改完一处很容易漏掉另一处，切换客户端就会跑错命令。`CLAUDE.md` 可以负责导入同目录的 `AGENTS.md`，并在下方保留 Claude Code 专属说明。把共享的构建、测试脚本与模块职责统一写进 `AGENTS.md` 后，每次修改公共规则就只需改动一个文件。

```markdown
@AGENTS.md
```

编写 `CLAUDE.md` 要把 `@AGENTS.md` 当作普通正文原样写出，不要加引号、反引号或代码块，否则导入会失效。这行导入通常放在文件开头，下方可以继续追加仅对 Claude Code 生效的说明。此外，规则文档只负责提供上下文，代码规范与红线仍靠测试和 CI 拦截，`hooks` 与 `subagents` 也在各工具原生配置里单独设置。

立正 Yuzheng Sun 在[《AI User 与 AI Builder 的 5 个差距》](https://www.superlinear.academy/c/ai-resources/ai-mastery)第 4 节建议分别明确规则存放处和工具读取路径，上述双文件结构正是把存放位置与读取入口拆开处理。

## 可复制的项目规范化 Prompt

```text
请直接规范化以下项目中的 AGENTS.md 和 CLAUDE.md，中文交流，完成实际调整，不要只交报告。

项目：
- /path/to/project-a
- /path/to/project-b

目标：公共规则在对应层级的 AGENTS.md 中唯一维护；同目录 CLAUDE.md 使用裸 @AGENTS.md 导入，之后仅保留必要的 Claude 专属说明。

递归检查根目录及有实际作用的子目录，按以下情况处理：
- 只有 AGENTS.md：补同目录 CLAUDE.md，写入裸 @AGENTS.md。
- 只有 CLAUDE.md：公共规则迁入同目录 AGENTS.md，CLAUDE.md 改为导入及必要的专属说明。
- 两者都有：合并公共规则、消除重复和漂移，保留全部有效要求。
- 已符合目标：保持不变，不额外格式化。
- 存在符号链接或跨文件引用：确认真实目标、作用域和有效性，再按需调整。
- 没有实际规则的目录：不新增空文件。

执行要求：
1. 先读适用的项目规则、WORKSPACE.md 路由及相关技能，检查 Git、远端和未提交工作。
2. 保留规则原意、层级、优先级及私密边界。根导入不能替代子目录入口；原文搬移优先逐字保留，无法判断的冲突不要擅自取舍。
3. 个人说明和凭证留在被忽略的本地文件或用户级配置，不搬入公共规则；保留现有工具配置。
4. 排除第三方依赖、vendor、主题、生成物、其他 worktree 和历史示例。检查断链、循环引用及含空格路径。
5. 内容目录新增规则时，确认不会被 Hugo 等工具当作文章或公开资源收录。
6. 用实际 Claude 客户端验证根规则加载及子目录按需加载，可使用 /context all 等证据；如有信任确认或认证限制，如实说明，不放宽安全设置。
7. 精确限定修改，保留其他用户工作；远端有并发变化先比较。提交、推送及发布沿用本次已有授权，未授权则只做本地调整；提交前扫描凭证。

常规可逆操作直接完成。最后简要说明修改前后、验证结果、提交记录及未完成项。
```

## 三种方案怎么选？

Codex 和 Cursor 原生读取 `AGENTS.md`。

| 方案 | 实际做法 | 优势与适用场景 | 典型漏读场景 |
| --- | --- | --- | --- |
| 同目录 `CLAUDE.md` 导入 | `AGENTS.md` 存公共规则，同目录 `CLAUDE.md` 写裸 `@AGENTS.md` | 跨平台稳定，Claude 专属说明可独立追加 | `@AGENTS.md` 被反引号或代码围栏包裹会让导入失效。相对路径按 `CLAUDE.md` 所在目录计算 |
| 原生兜底 | 仓库只放一份 `AGENTS.md`，靠新版 Claude Code 自动兜底读取 | 仅维护单文件，适合全员新版且无专属配置的新项目 | 依赖版本与默认模式，协作者本机未提交的 `CLAUDE.local.md` 会直接遮蔽兜底 |
| 符号链接 | `AGENTS.md` 为真文件，执行 `ln -s AGENTS.md CLAUDE.md` | 不复制正文，适合统一开启符号链接的环境 | `core.symlinks=false` 检出成普通文件，专属说明也无法写在链接上独立维护 |

在临时仓复现 `core.symlinks=false` 检出时，`CLAUDE.md` 会检出成普通文件，仅含 9 字节目标文件名 `AGENTS.md`。

默认模式下，启动目录或任一上级目录存在 `CLAUDE.md`、`.claude/CLAUDE.md` 或 `CLAUDE.local.md`，Claude Code 就会跳过原生 `AGENTS.md` 兜底。用户全局 `~/.claude/CLAUDE.md` 不触发跳过。[Claude Code 规则文档](https://code.claude.com/docs/en/memory#agentsmd) 与 [Git 配置文档](https://git-scm.com/docs/git-config#Documentation/git-config.txt-coresymlinks)。

若存量老项目暂时只留 `CLAUDE.md` 且只需打通 Codex，可在受信任项目的 `.codex/config.toml` 或个人 `~/.codex/config.toml` 顶层加上回退文件名。

```toml
project_doc_fallback_filenames = ["CLAUDE.md"]
```

同一目录内 `AGENTS.override.md` 与 `AGENTS.md` 优先级仍高于回退文件。常见踩坑是把这行误塞进 `[project]` 等表下导致失效。[Codex 指令文件文档](https://learn.chatgpt.com/docs/agent-configuration/agents-md) 与 [配置说明](https://learn.chatgpt.com/docs/config-file/config-reference)。

### 为什么长期维护更倾向导入？

多平台长期维护时，优先用 `CLAUDE.md` 首行裸 `@AGENTS.md` [导入](https://code.claude.com/docs/en/memory#share-one-file-with-other-coding-tools)复用 `AGENTS.md`：它是普通文本，环境兼容和追加专属说明都更直接。

| 比较项 | 导入 | 符号链接 |
| :--- | :--- | :--- |
| 检出 | 按普通文本检出，内容即引用指令。 | [`core.symlinks=false`](https://git-scm.com/docs/git-config#Documentation/git-config.txt-coresymlinks) 时检出为纯文本，不再指向正文。 |
| 保存 | 各文件独立读写，互不影响。 | 取决于工具实现：覆盖写入可保留，临时文件替换可能断链（见 [Vim `backupcopy`](https://vimhelp.org/options.txt.html#%27backupcopy%27)）。 |
| 专属说明 | 可在 `@AGENTS.md` 下方直接追加。 | 不能单独追加，但可另用 [`.claude/rules/`](https://code.claude.com/docs/en/memory#organize-rules-with-clauderules) 等原生配置。 |

可选在 pre-commit 或 CI 中检查两点：`CLAUDE.md` 首行是否为裸 `@AGENTS.md`，同目录是否存在 `AGENTS.md`。这只查结构，不保证语义不漂移或实际加载成功；加载情况仍以 `/context all` 核对。

### Claude Code 何时支持这些功能？

| 时间 | 版本或记录 | 支持变化 | 来源 |
| --- | --- | --- | --- |
| 2025年5月9日 | v0.2.107 | `CLAUDE.md` 加入通用的 `@path/to/file.md` 文件导入机制。写入 `@AGENTS.md` 属于复用该通用导入能力，当时尚未推出专门的 `AGENTS.md` 支持。 | [官方更新日志](https://code.claude.com/docs/en/changelog#0-2-107) |
| 2025年8月24日 | Issue #6235 用户评论 | 用户 coygeek 展示了在 `CLAUDE.md` 中写入 `@AGENTS.md` 的实例。此日期属于已查到的社区使用记录，有别于官方功能发布日期。 | [原始评论](https://github.com/anthropics/claude-code/issues/6235#issuecomment-3217884068) |
| 2026年9月18日 | v2.1.277 | 新增原生的 `AGENTS.md` 兜底支持。满足默认加载条件时可直接读取该文件。 | [官方发布说明](https://github.com/anthropics/claude-code/releases/tag/v2.1.277) |

## 多包仓库如何按目录加载与验收？

根目录的 `@AGENTS.md` 只导入根目录那一份文件，子包如 `repo/packages/api` 有自己的共享规则，就需要把 `AGENTS.md` 和含 `@AGENTS.md` 导入行的 `CLAUDE.md` 放在该子包同目录。写完规则后，分别从根目录 `repo` 和子目录 `repo/packages/api` 启动新会话验收。

| 工具 | 加载范围 | 验收办法 |
| --- | --- | --- |
| Claude Code | 启动从当前工作目录向上加载符合条件的规则；后续在会话中访问更深目录才可能按需加载那里的规则，并不笼统保证自动加载所有后代目录的文件 | 从根启动并访问子目录文件，再从子目录直接启动，期间运行 `/memory`或 `/context all`确认实际加载列表 |
| Codex | 读取方向相反，启动从项目根到当前启动目录逐层向下读取，每层最多取一份规则文件 | 在两个目录下查会话日志，或运行`codex debug prompt-input`查看实际拼入的提示词 |
| Cursor | 按当前工作文件所属的作用域加载嵌套的 `AGENTS.md` | 分别打开根目录和子目录的文件，检查各自命中的规则作用域 |

参考：[Cursor 规则文档](https://cursor.com/docs/rules)
## 什么时候可以只留 AGENTS.md？

如果项目只服务于 Claude Code，直接维护 `CLAUDE.md` 也是可行选择。另一方面，Claude Code [v2.1.277](https://github.com/anthropics/claude-code/releases/tag/v2.1.277) 已在 2026 年 9 月加入[原生 `AGENTS.md` 支持](https://code.claude.com/docs/en/memory#agentsmd)。

按我自己的使用习惯，现阶段仍会保留 `@AGENTS.md` 薄壳，不会仅凭日期到了就自动删除。我的个人计划是等原生支持推出约半年、到 2027 年 3 月之后，再复查所用版本、读取模式以及根目录和子目录的实际加载结果，确认通过后再切成只留 `AGENTS.md`。
