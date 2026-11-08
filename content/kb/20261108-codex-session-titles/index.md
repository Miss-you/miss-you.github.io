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

## 会话一多，就要反复点进去辨认

工具用多了，会话也越开越多。回头翻列表，有的是默认标题，有的只剩半句话，还有的显示项目路径。想找之前做过的事，只能逐个点开，看一遍上下文。

![命名前的会话列表：标题和项目路径混在一起](images/before.png)

给新会话加上分类、事项和日期，扫一眼列表就更容易认出来。

![命名后的会话列表：标题包含分类、事项和日期](images/after.png)

比如 `[设计] 个人知识库原型｜261108`，分类和事项都写在标题里，`261108` 是北京时间的发起日期。

Claude Code 和 Codex 都可以保存这条命名规则。能否让 Agent 自动改名，还要看当前会话有没有提供改名工具。

## 写进各自的全局指令文件

Claude Code 的个人全局指令文件默认为 `~/.claude/CLAUDE.md`，适用于这台机器上的各个项目，见 [Claude Code 的记忆与指令文档](https://code.claude.com/docs/en/memory#choose-where-to-put-claudemd-files)。

Codex 默认为 `~/.codex/AGENTS.md`。如果设置了 `CODEX_HOME`，则使用对应目录中的指令文件。Codex 优先读取全局目录里非空的 `AGENTS.override.md`，这时同目录的 `AGENTS.md` 不会生效。项目里更具体的指令也可能影响行为，读取顺序见 [OpenAI 的 AGENTS.md 文档](https://learn.chatgpt.com/docs/agent-configuration/agents-md)。

可以自己编辑对应文件，也可以把下面这段话交给正在使用的 Claude Code 或 Codex 检查并配置。

```text
请检查当前工具实际加载的全局指令文件，保留其中已有的所有内容。
Claude Code 默认为 ~/.claude/CLAUDE.md，Codex 默认为 ~/.codex/AGENTS.md。
如果已经有下面这条规则，就不要重复添加；否则追加进去。
完成后告诉我配置文件路径，并验证新会话能读取到这条规则。
请分别说明规则是否已写入、当前会话是否有可调用的改名工具，不要把配置完成当成自动改名已生效。

仅在新主会话首次明确任务时，用改名工具设标题为「[分类] 简短事项｜YYMMDD」，日期取北京时间的发起日期。只命名一次，尊重用户指定标题；不检查完成状态、不自动增删状态标签。改名不可用时继续任务。
```

自己配置的话，把最后一段规则追加到对应文件，保留已有内容。再新开一个会话，给出明确任务，检查规则是否加载、标题是否按约定改变。

## 有改名命令，还要看 Agent 能否调用

Codex 在本次使用的桌面环境中提供了 `set_thread_title` 改名工具，Agent 可以按规则调用。Codex CLI 的官方文档也支持用户输入 `/rename <标题>`，见 [Codex 的改名命令](https://learn.chatgpt.com/docs/developer-commands?surface=cli#rename-the-current-chat-with-rename)。CLI 有这个命令，并不能说明所有客户端都会向 Agent 开放同样的工具。

Claude Code 官方支持用户在会话中输入 `/rename <标题>`，也支持启动时用 `claude -n "标题"` 命名，见 [Claude Code 的会话命名文档](https://code.claude.com/docs/en/sessions#name-your-sessions)。这些是用户可用的命名入口，不能据此保证 Claude 会按 `CLAUDE.md` 自动改名。当前会话没有向 Agent 开放改名工具时，可以让它按规则拟好标题，再自己输入 `/rename` 命令。

标题能帮你找回会话，想起当时在做什么。任务是否完成，仍要看会话内容。规则只在新主会话首次明确任务时命名，不会检查完成状态，也不会自动增删「已完成」之类的标签。客户端自带的标题生成功能，也不代表它会遵守这条自定义规则。
