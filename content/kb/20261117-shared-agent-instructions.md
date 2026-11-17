---
title: "多工具共用 AGENTS.md 与 CLAUDE.md 的防漂移配置"
slug: "shared-agent-instructions"
date: "2026-11-17"
lastmod: "2026-11-17"
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

## 三种方案怎么选？

Codex 和 Cursor 原生读取 `AGENTS.md`。

| 方案 | 实际做法 | 优势与适用场景 | 典型漏读场景 |
| --- | --- | --- | --- |
| 同目录 `CLAUDE.md` 导入 | `AGENTS.md` 存公共规则，同目录 `CLAUDE.md` 写裸 `@AGENTS.md` | 跨平台稳定，Claude 专属说明可独立追加 | `@AGENTS.md` 被反引号或代码围栏包裹会让导入失效。相对路径按 `CLAUDE.md` 所在目录计算 |
| 原生兜底 | 仓库只放一份 `AGENTS.md`，靠新版 Claude Code 自动兜底读取 | 仅维护单文件，适合全员新版且无专属配置的新项目 | 依赖版本与默认模式，协作者本机未提交的 `CLAUDE.local.md` 会直接遮蔽兜底 |
| 符号链接 | `AGENTS.md` 为真文件，执行 `ln -s AGENTS.md CLAUDE.md` | 不复制正文，适合统一开启符号链接的环境 | `core.symlinks=false` 检出成普通文件（临时仓复现仅含 9 字节目标文件名 `AGENTS.md`），专属说明也无法写在链接上独立维护 |

默认模式下，启动目录或任一上级目录存在 `CLAUDE.md`、`.claude/CLAUDE.md` 或 `CLAUDE.local.md`，Claude Code 就会跳过原生 `AGENTS.md` 兜底。用户全局 `~/.claude/CLAUDE.md` 不触发跳过。[Claude Code 规则文档](https://code.claude.com/docs/en/memory#agentsmd) 与 [Git 配置文档](https://git-scm.com/docs/git-config#Documentation/git-config.txt-coresymlinks)。

若存量老项目暂时只留 `CLAUDE.md` 且只需打通 Codex，可在受信任项目的 `.codex/config.toml` 或个人 `~/.codex/config.toml` 顶层加上回退文件名。

```toml
project_doc_fallback_filenames = ["CLAUDE.md"]
```

同一目录内 `AGENTS.override.md` 与 `AGENTS.md` 优先级仍高于回退文件。常见踩坑是把这行误塞进 `[project]` 等表下导致失效。[Codex 指令文件文档](https://learn.chatgpt.com/docs/agent-configuration/agents-md) 与 [配置说明](https://learn.chatgpt.com/docs/config-file/config-reference)。

官方更新日志记录 2025 年 5 月 9 日 v0.2.107 加入 `CLAUDE.md` 通用的 `@path/to/file.md` 导入语法，此后便能借它引入 `AGENTS.md`。在官方仓库 issue #6235 中，2025 年 8 月 24 日已有用户贴出在 `CLAUDE.md` 里直接写 `@AGENTS.md` 的配置实例。Claude Code 直接发现 `AGENTS.md` 的原生兜底，则是在 2026 年 9 月 18 日发布的 v2.1.277 才正式新增。参考 [v0.2.107 更新记录](https://code.claude.com/docs/en/changelog#0-2-107)、[2025 年的使用记录](https://github.com/anthropics/claude-code/issues/6235#issuecomment-3217884068) 与 [v2.1.277 发布说明](https://github.com/anthropics/claude-code/releases/tag/v2.1.277)。

## 多包仓库如何按目录加载与验收？

Claude Code 启动会从当前工作目录向上加载符合条件的规则，后续在会话中访问更深目录才可能按需加载那里的规则，并不笼统保证自动加载所有后代目录的文件。根目录的 `@AGENTS.md` 只导入根目录那一份文件，子包如 `repo/packages/api` 有自己的共享规则，就需要把 `AGENTS.md` 和含 `@AGENTS.md` 导入行的 `CLAUDE.md` 放在该子包同目录。

Codex 的读取方向相反，启动会从项目根到当前启动目录逐层向下读取，每层最多取一份规则文件。Cursor 则按当前工作文件所属的作用域加载嵌套的 `AGENTS.md`。[Cursor 规则文档](https://cursor.com/docs/rules)

写完规则后，分别从根目录 `repo` 和子目录 `repo/packages/api` 启动新会话验收。Claude Code 可从根启动并访问子目录文件，再从子目录直接启动，期间运行 `/memory` 或 `/context all` 确认实际加载列表。Codex 可在两个目录下查会话日志，或运行 `codex debug prompt-input` 查看实际拼入的提示词。Cursor 可分别打开根目录和子目录的文件，检查各自命中的规则作用域。
