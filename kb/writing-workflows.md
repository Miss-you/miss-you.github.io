# 项目写作配置

公开知识条目的执行入口是 [.agents/skills/writing-workflows/SKILL.md](../.agents/skills/writing-workflows/SKILL.md)，从讨论到双知识库的编排入口是 [thinking-to-knowledge](../.agents/skills/thinking-to-knowledge/SKILL.md)。两个技能及规则资源均随本仓库保存。

正文、Prompt、练习题、解析和语言改写用 Antigravity CLI 的 Argon。调用方式、超时和输出核对见项目技能的 runtime.md。事实审查和冷读交给宿主的独立会话，不能用起草会话自评。作者表达约定和固定第三方规则在本仓库 writing-workflows 技能内，无需全局安装。

每次分析必须实际查询 lizheng MCP 并读到相关原文，写作必须实际通过 agy 完成。两个步骤都不能静默跳过或替换。工具不可用则报告该环节未完成，替代来源或写作方式须经用户明确同意。此要求来自用户 2026-11-18 的明确说明。

从仓库根目录运行，Python 需 3.10+，以下以本机可用的 3.12 为例。

```sh
PYTHONPATH=kb/vendor/writing-skill/src python3.12 -B -m writing_skill.external_prose_lint_cli <稿件路径>
python3.12 -B .agents/skills/writing-workflows/resources/fatigue_scan.py <稿件路径>
```

先检查所选 Python 的版本。脚本会提示值得核查的位置，人工记录引用、误报、篇幅适配和每个未修正提示的理由。短知识条目不因长文默认阈值而扩写。无需安装全局 writing_skill 包。

私人知识库的位置由用户提供，或记在忽略提交的 `kb/knowledge-pipeline.local.md`。公开条目不引用该文件、不写本机路径。只有整理本地副本需要这个映射，单独编辑博客时可直接使用本项目技能。

依赖固定文本的版本及许可证在技能的 references/provenance.md 和 `kb/vendor/writing-skill/PROVENANCE.md`。构建按 [维护指南](README.md) 和当前 CI；文稿检查与 Hugo 构建是两件事，都完成再发布。
