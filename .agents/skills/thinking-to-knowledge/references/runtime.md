# 运行条件

项目文档可以随仓库移动，以下运行条件仍需本机提供。先做只读检查，缺什么报告什么，不自动安装软件或改账号设置。

| 阶段 | 条件 | 如何检查或处理 |
| --- | --- | --- |
| 成文、修改与去 AI 味 | `agy`、已登录的 Antigravity、可用的 `gemini-4-hydrogen-high` 和 ACP | `command -v agy`、`agy acp --help`；实际调用检查退出码、JSON `status == SUCCESS`、`stop_reason == end_turn` 和非空正文；模型列表或登录状态不能代替请求成功 |
| 分析与来源检索 | 每次分析实际调用 lizheng MCP，并读取相关原文 | MCP 配置和请求头只存在本机，输出不包含凭证；不可用就报告未完成，用户明确同意后才能换用其他来源或快照，不冒称 MCP 结果 |
| 独立审稿 | 宿主的独立子代理或另一个无起草上下文的审稿会话 | 事实审查拿来源契约，冷读只拿最终正文及读者身份；缺少独立审稿能力就报告未完成 |
| 文稿扫描 | Python 3.10+，项目内 `writing_skill` 与阅读负担脚本 | 按 `writing-workflows` 的项目配置运行，无须 `pip install` 或全局 skill |
| 本地与博客映射 | 两个仓库的真实路径 | 放在项目本机配置里；博客侧映射文件忽略提交，公开仓库不硬编码个人知识库路径 |
| 构建 | Git、Hugo、主题子模块、Node/npm | 使用博客的锁文件和现有 CI 命令；Git 管理的主题子模块仍要初始化 |
| 提交扫描 | `gitleaks`，或项目流程中的等效变更内容扫描 | 扫描本次准备提交的内容，检查日志隐藏命中的凭证值 |
| 推送与部署 | GitHub Git 认证、`gh` 或等效 API、网络和站点工作流权限 | 不写死代理、凭证助手和个人账号；执行中区分 Git、GitHub API 与 Google API 的连接问题 |

## Hydrogen ACP 调用

正文、Prompt、练习、解析、局部修改及去 AI 味默认都使用 `agy acp --stdio` 的 `gemini-4-hydrogen-high`。在独立私有临时目录中准备 `prompt.md` 和 JSON 结果，每个阶段新会话，串行调用。把必要材料内联到 prompt，说明只输出正文、不访问文件或工具；调用外部模型前遵守当前任务的私密材料和许可边界，不把私密材料提交到公开仓库。

客户端使用 POSIX 管道与进程组，在 macOS/Linux 上运行；Windows 原生环境尚未验证。

从项目根目录运行：

```sh
python3 .agents/skills/thinking-to-knowledge/scripts/agy_acp_writer.py \
  --prompt-file /path/to/prompt.md --output-file /path/to/result.json \
  --cwd . --timeout-seconds 720
```

该客户端启动 `agy acp --stdio`，依次初始化、创建会话、请求模型 `gemini-4-hydrogen-high`、设置 plan 模式并发送文本；拼接 `agent_message_chunk`，只在 `stopReason` 为 `end_turn` 且正文非空时写 `status: SUCCESS`。工具权限请求或工具调用会使本次写作失败，不静默批准；plan 模式和事后监听不是操作系统沙箱，不能保证在通知到达前阻止工具执行。退出码、`status`、`stop_reason`、非空正文和是否对题都必须核对，再保存正文。结果保留会话 ID、请求模型和实际响应；模型切换的 ACP 成功响应表示请求被接受，不独立证明服务内部实际使用了什么模型。

超时、取消、部分输出、权限或认证错误均不是终稿。客户端结束自己启动的进程及仍在同一进程组的子进程，不能控制主动脱离该组的后台进程；重试前确认旧进程已结束，避免并发写作。认证、额度或模型不可用时如实报告；未经用户明确同意，不换模型或让编排模型代写。只有某个受控宿主无法运行此脚本时，才可使用等价 ACP 客户端执行相同协议和检查，仍须保留真实调用证据，不改用 `agy --print` 冒充 ACP。

只记录必要的可核对信息，如模型、调用时间、成功状态和修改范围。完整响应保留在私有底稿以便核查，公开页只放最终文章。

用户于 2026-11-18 明确要求分析实际使用 lizheng MCP；同日又明确指定写作默认用 agy 的 Gemini 4 Hydrogen，通过 ACP 完成正文、修改和去 AI 味。即使宿主已有相同模型，也须实际执行 MCP 和 ACP，不沿用上游按宿主跳过 CLI 的例外。
