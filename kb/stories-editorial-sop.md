# 一千零一夜故事审校 SOP

本流程用于 Hugo 仓库 `content/stories/` 审校，不新增工具依赖。

## 一、五步审校流程

1. Codex 核对原始资料与事实分级
   - 通读原始材料，对齐标题、关键动作、结果、引语、数字与结尾因果。
   - 来源等级直接写进措辞：档案、本人回忆、品牌回顾、匿名传闻。
   - 仅在具备滚动累积证据时写复利结论，缺证内容直接删除、明确归因、换用已核同主题事件或暂缓，禁止用假设或事后成功补因果。
   - 返工：关键要素偏差、来源等级混淆、无累积证据写复利结论，或用假设补因果。

2. 确定切面边界与编写临时简报
   - 单篇只留一个真实事件和一个切面，用可观察动作承接叙事与寓意。
   - 常规 550–850 汉字，验收不必写满八百字，短篇允许无 H2。
   - 供应来源留可追溯链接并紧邻关键事实放置，不设链接数指标，清晰引语受保护。
   - 正文用连贯段落，不用分号、对比句、说教套话与工整排比。
   - 简报只放当前公开故事、事实清单与改稿意见，写入单独临时目录。
   - 返工：多事件拼贴、出现禁用句式或标点、误改清晰引语，或简报夹带无关信息。

3. agy 改稿与正文落盘
   - 由 `agy` 决定改稿措辞，运行 `acpx` 时将模型与 `high` 档作为两项独立配置传入，工作目录指向临时目录，输出重定向到私有 JSONL 日志。
   - 核验日志：退出码 `0`、协议模型 `gemini-4-hydrogen`、档位 `high`、`stopReason` 为 `end_turn`、正文非空、工具越权为空。
   - 仅落盘正文，正文外只有标题和摘要随内容必要时同步，保留 `slug`、日期、无关段落与其余字段。
   - 返工：运行或日志字段异常、工具越权、正文为空，或改动了 `slug`、日期与无关内容。

4. Codex 冷读与未起草人终验
   - 先由 Codex 冷读成稿和角色设定，复述事件经过、动作与读到的意思。
   - 再由另一名未参与起草的人对照原始材料验收终稿，确认事实、引语与近用链接未走样。
   - 仅在新增图表时复核桌面、手机及明暗模式。
   - 返工：冷读偏离切面或读出无据因果、润色后事实失真，或新增图表缺多端及明暗模式确认。

5. 工程校验、构建与授权发布
   - 依次运行两项文稿扫描与三项站点命令，短篇触发脚本告警时按用途人工复核并留说明。
   - Hugo 构建前按仓库 CI 生成文本对比预览资源（已有可复用），无 Git 历史的归档副本可仅在副本关闭 `GitInfo`。
   - 构建后核对 `slug` 唯一、front matter 合规与页面出处显示。
   - 默认止步待发布，获明确发布授权才做暂存区敏感扫描并推送部署，随后抽检线上页面。
   - 返工：告警未复核、构建或页面异常、敏感扫描告警，或未获授权推送部署。

## 二、操作命令

1. 模型改稿（在单独临时目录执行，仅读写临时简报与私有日志）：

```bash
acpx --cwd "/tmp/story-review" --no-fs --no-terminal --deny-all --model gemini-4-hydrogen --format json --json-strict agy exec --config-option thought_level=high --config-option mode=plan -f "/tmp/story-review/brief.md" > "/tmp/story-review/run.jsonl"
```

2. 两项文稿扫描：

```bash
PYTHONPATH=kb/vendor/writing-skill/src python3.12 -B -m writing_skill.external_prose_lint_cli "content/stories/example.md"
python3.12 -B .agents/skills/writing-workflows/resources/fatigue_scan.py "content/stories/example.md"
```

3. 三项站点命令（构建前按 CI 备好文本对比预览资源）：

```bash
python3.12 -B tests/test_site_header.py
node --check assets/js/kb.js
hugo --minify --buildFuture
```

## 三、短验收清单

- 事实与分级：要素对齐原始出处，来源等级明确，缺证与复利边界合规。
- 结构与表达：单事件单切面，550–850 汉字自然收束，近用出处与清晰引语完整。
- 改稿与落盘：`acpx` 日志指标达标且零越权，只改正文及必要的标题摘要。
- 冷读与终验：Codex 冷读一致，未起草人终验通过，新增图表已核双端明暗。
- 构建与发布：五项命令通过（含短篇复核），`slug` 唯一，获授权才推送部署。

## 四、单篇审校记录

```markdown
- 稿件与 slug："content/stories/example.md" /
- 分工：Codex（核事实与冷读）/ agy（改稿）/ 未起草人（终验）
- 来源等级与缺证处理：
- 事件、切面与可观察动作：
- 字数与出处近用核查：
- acpx 日志结果：
- 冷读与终验结论：
- 扫描、站点命令与图表核对：
- 发布授权与部署核对：
```
