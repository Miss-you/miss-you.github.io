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

## 为什么不用单文件或符号链接？

Codex 和 Cursor 原生读取 `AGENTS.md`。Claude Code 从 v2.1.277 起也支持原生读取 `AGENTS.md`，默认采用 `claude-md-or-agents-md` 模式。在此默认模式下，只要启动目录或任一上级目录存在 `CLAUDE.md`、`.claude/CLAUDE.md` 或本地未提交的 `CLAUDE.local.md`，Claude Code 就会跳过原生 `AGENTS.md` 兜底。用户全局 `~/.claude/CLAUDE.md` 不触发跳过。

如果仓库只留 `AGENTS.md`，协作者一旦在本机放了 `CLAUDE.local.md` 记录个人配置，Claude Code 就会直接漏读仓库里的 `AGENTS.md`。在 `AGENTS.md` 同目录放一份写有 `@AGENTS.md` 的 `CLAUDE.md`，能让 Claude Code 显式导入公共规则，避开本地文件触发的跳过机制。[Claude Code 文档](https://code.claude.com/docs/en/memory#agentsmd)

如果存量仓库只留 `CLAUDE.md`，可以让 Codex 配置回退读取。需要仓库共享就写入受信任项目的 `.codex/config.toml` 顶层，仅个人使用就写入 `~/.codex/config.toml` 顶层。该配置键必须放在 TOML 顶层，放进 `[project]` 表会失效。同一目录一旦存在标准文件 `AGENTS.override.md` 或 `AGENTS.md`，Codex 仍会优先读取它们，不再回退读取 `CLAUDE.md`。[Codex AGENTS.md 文档](https://learn.chatgpt.com/docs/agent-configuration/agents-md)、[Codex 配置参考](https://learn.chatgpt.com/docs/config-file/config-reference)、[Codex Issue #22454](https://github.com/openai/codex/issues/22454)

```toml
project_doc_fallback_filenames = ["CLAUDE.md"]
```

如果改用 Git 符号链接 `CLAUDE.md -> AGENTS.md`，就无法单独追加 Claude Code 专属说明，还会受 `core.symlinks=false` 限制。在临时仓用 `git clone -c core.symlinks=false` 模拟检出，软链会退化成只有 9 字节 `AGENTS.md` 文本的普通文件。[Git 配置文档](https://git-scm.com/docs/git-config#Documentation/git-config.txt-coresymlinks)、[Claude Code 文档](https://code.claude.com/docs/en/memory#agentsmd)

## 多包仓库如何按目录加载与验收？

Claude Code 启动会从当前工作目录向上加载符合条件的规则，后续在会话中访问更深目录才可能按需加载那里的规则，并不笼统保证自动加载所有后代目录的文件。根目录的 `@AGENTS.md` 只导入根目录那一份文件，子包如 `repo/packages/api` 有自己的共享规则，就需要把 `AGENTS.md` 和含 `@AGENTS.md` 导入行的 `CLAUDE.md` 放在该子包同目录。

Codex 的读取方向相反，启动会从项目根到当前启动目录逐层向下读取，每层最多取一份规则文件。Cursor 则按当前工作文件所属的作用域加载嵌套的 `AGENTS.md`。[Cursor 规则文档](https://cursor.com/docs/rules)

写完规则后，分别从根目录 `repo` 和子目录 `repo/packages/api` 启动新会话验收。Claude Code 可从根启动并访问子目录文件，再从子目录直接启动，期间运行 `/memory` 或 `/context all` 确认实际加载列表。Codex 可在两个目录下查会话日志，或运行 `codex debug prompt-input` 查看实际拼入的提示词。Cursor 可分别打开根目录和子目录的文件，检查各自命中的规则作用域。
