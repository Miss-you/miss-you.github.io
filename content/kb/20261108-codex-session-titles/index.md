---
title: "给 Claude Code 和 Codex 的新会话统一命名"
slug: codex-session-titles
date: 2026-11-08
lastmod: 2026-11-08
lang: zh
topic: "AI 协作"
summary: "把命名规则写进各自的全局指令文件；能否自动改名，取决于当前客户端提供的工具。"
takeaway: "用分类、事项和日期命名会话，回头找任务时就能先看懂列表。"
tags: [Claude Code, Codex, Agent, 工作流]
draft: false
---
## 给会话贴一张容易辨认的标签

工具用久了，会话列表里会混着默认标题、半句话和项目路径。过几天想找之前的任务，常常得逐个点开，看完上下文才能认出来。

![命名前的会话列表：标题和项目路径混在一起](images/before.png)

可以把标题当成文件夹上的标签，用分类、事项和日期，帮自己快速浏览。比如 `[设计] 个人知识库原型｜261108`，一眼就能看出这是 2026 年 11 月 8 日发起的设计任务。日期按北京时间填写。

![命名后的会话列表：标题包含分类、事项和日期](images/after.png)

这条规则只在新主会话首次明确任务时使用，标题确定一次即可。它帮你记住会话是做什么的；想了解任务进展，可以点进去查看上下文。规则本身只负责命名，任务的完成状态仍留在会话内容里。

Claude Code 和 Codex 都可以使用这个技巧：把规则放进各自的全局指令文件，让新会话读取。其他 Code Agent 如果支持读取全局指令，也可以按它的配置方式尝试；自动改名还需要当前客户端提供相应工具。

## 把规则写进全局指令

全局指令像一张随项目携带的使用说明，新建会话时，Agent 会根据工具的加载规则读取它。你可以自己编辑文件，也可以把下面这段话交给 Claude Code 或 Codex，让它检查并配置。

```text
请检查当前工具实际加载的全局指令文件，保留其中已有的所有内容。
Claude Code 默认为 ~/.claude/CLAUDE.md，Codex 默认为 ~/.codex/AGENTS.md。
如果已经有下面这条规则，就不要重复添加；否则追加进去。
完成后告诉我配置文件路径，并验证新会话能读取到这条规则。
请分别说明规则是否已写入、当前会话是否有可调用的改名工具，不要把配置完成当成自动改名已生效。

仅在新主会话首次明确任务时，用改名工具设标题为「[分类] 简短事项｜YYMMDD」，日期取北京时间的发起日期。只命名一次，尊重用户指定标题；不检查完成状态、不自动增删状态标签。改名不可用时继续任务。
```

Claude Code 的个人全局指令通常放在 `~/.claude/CLAUDE.md`，见 [Claude Code 的记忆与指令文档](https://code.claude.com/docs/en/memory#choose-where-to-put-claudemd-files)。Codex 默认使用 `~/.codex/AGENTS.md`；设置了 `CODEX_HOME` 时，全局指令位于对应目录。

Codex 加载全局指令时，会先找同一目录里的 `AGENTS.override.md`。如果它存在且非空，Codex 就以它作为该目录的指令文件；否则再读取 `AGENTS.md`。例如，已经有一份非空的 `~/.codex/AGENTS.override.md` 时，把规则加到那份文件里，才能让全局配置被读取。项目中更具体的指令也会影响最终行为，详见 [OpenAI 的 AGENTS.md 文档](https://learn.chatgpt.com/docs/agent-configuration/agents-md)。

配置后可以新开一个会话，给出明确任务，检查规则是否加载以及标题是否改变。已有的指令内容应当保留。

## 改名能力取决于当前工具

指令告诉 Agent 怎么命名，改名工具负责把标题写进会话列表。就像写好了标签内容，还需要有办法把标签贴上去。不同客户端提供的能力可能不同，有改名工具的环境可以尝试自动执行。

在本次使用的 Codex 桌面环境中，Agent 可以调用 `set_thread_title`。Codex CLI 也支持用户输入 `/rename <标题>`，见 [Codex 的改名命令](https://learn.chatgpt.com/docs/developer-commands?surface=cli#rename-the-current-chat-with-rename)。

Claude Code 支持用户在会话中输入 `/rename <标题>`，也可以在启动时用 `claude -n "标题"` 命名，见 [Claude Code 的会话命名文档](https://code.claude.com/docs/en/sessions#name-your-sessions)。这些命令可供用户手动使用；Agent 能否自动调用改名工具，要看所在客户端提供了什么。遇到暂时没有自动改名工具的环境，可以让 Agent 按规则拟一个标题，再手动输入 `/rename`。
