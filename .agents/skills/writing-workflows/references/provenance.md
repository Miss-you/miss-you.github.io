# 项目依赖来源

本目录的 `SKILL.md`、project-workflow 和 author-voice 是本项目维护的入口与适配层，2026-11-18 抽取自作者的写作规则和本次实际链路。它们明确替换上游环境默认项，未声称逐字执行上游所有约束。

| 本地材料 | 来源与版本 | 用途 |
| --- | --- | --- |
| `resources/qu-ai-wei/` | LifelongLazyLearner/qu-ai-wei，`1d32e803f091ec90808a69683ebf49e8a970a5e7` | 文本及必要 references 的固定快照，保留原许可证 |
| `resources/fatigue_scan.py`、`fatigue-catalog.md` | 本知识库的 `.agents/skills/reducing-reading-fatigue/`，2026-11-18 工作树快照 | 只读扫描与人读检查目录 |
| 项目配置所指的 `writing_skill` | grapeot/writing-skill，本知识库 `写作/vendor/writing-skill` 的 2026-11-18 工作树快照 | 本次只执行 prose lint；MIT 许可证随副本保留 |

参考方法来自 [writing-skill 固定根入口](https://github.com/grapeot/writing-skill/blob/3016e4eeece3ade0dcda34550747041c766106c4/skills/writing_workflows.md)。原仓库的 vendor 后续发生过本地更新，不能把当前快照的每个字节都声称属于该旧 commit。博客侧只复制实际运行的 lint 源码及许可证，不把上游缺失的 sibling CLI skill 当成项目依赖。

更新固定第三方快照时，先检查上游变更、许可证和引用文件，再更新此版本记录。只取纯文本，不执行第三方安装器。两个仓库中的同名项目技能是独立快照，变更共享流程时应对照同步，不以跨仓库绝对链接维持运行。

2026-11-18 核查 lieflat-less-ai-tone 的 `fe77df00a27cf94428632ad449a4aecdcb83db41`，当前 LICENSE 为 CC BY-NC 4.0，且技能要求额外脚本检测和确认交互。为保持本链路的独立性与既有 Argon 成文方式，没有将它的文本或脚本纳入运行依赖；最终清理由本项目作者表达约定与阅读检查完成。
