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

## 一个 iOS 项目的配置实践

北京时间 2026 年 11 月 18 日，一个 iOS 项目在一次 PR 中为 GitHub Copilot Code Review 接入了三份指令文件：一份全仓审查规则，以及两份分别面向 iOS 和房间模块的路径指令。项目原本已经用根和模块 `AGENTS.md` 以及模块文档保存知识，这次没有把完整契约再抄一遍，而是只在新文件里写明审查重点和知识入口。以下文件树使用通用示意路径和示意文件名说明这一分层结构，仅作示例，不冒充具体项目的实际文件：

```text
.github/copilot-instructions.md             全仓审查原则和知识入口
.github/instructions/ios.instructions.md  Swift、扩展、测试和本地化（示意路径）
.github/instructions/feature.instructions.md 房间模块 UI 和状态管理（示意路径）
AGENTS.md                                  项目地图
docs/feature-contract.md                       房间模块运行契约（示意文件）
```

两份路径指令都在 YAML frontmatter 中通过 `applyTo` 声明了适用文件。下面以 `feature.instructions.md` 为例展示通用示意写法，其中的目录与文件名均为示例，不代表项目实际文件；应用到具体仓库前请先确认实际路径：

```markdown
---
applyTo: "App/Rooms/**/*.swift"
---
审查房间相关改动时，重点核对状态同步、边界条件与调用方契约是否一致；具体运行约束可参考 `docs/feature-contract.md`（该路径仅为示意，应用到具体仓库前请先确认实际文件路径）。
```

这类配置只表示改动落入这些路径时满足匹配条件，并不代表模型会自动加载或执行里面的规则。

同一套改动里还同步更新了项目既有的作者侧本地审查流程。它的用途是让作者在本地先核实审查意见并完成修复，再把可复用的事实和边界沉淀回现有文档或窄范围指令。这套流程仅用于作者本地工作流，不会由 GitHub 上的 reviewer 自动运行。

这个 PR 创建后自动请求了 Copilot 审查，耗时 4 分 26 秒完成 `Balanced` 强度的审查，结果没有产生行内评论或审查讨论串。在 PR 时间线中打开可访问的 `review session` 或相关运行日志并查找文件读取记录，可以看到全仓指令已被读取；而实际日志同时存在内容排除规则查询失败和网络请求受限，具体对审查覆盖的影响尚未确定。PR 随后合并进主分支；合并前检查了 frontmatter 格式、路径匹配正反例、链接和密钥扫描，因为没有业务代码变动，没有跑完整 Xcode 验证。

这里能确认的边界很有限。由于 PR 里没有 Swift 或 Room 的业务代码，**这次日志证实全仓指令被读取，没有验证路径指令是否加载，也不能因为零评论就推导出审查准确率。** 路径入口和真实代码审查的效果，需要等后续实际的业务 PR 再观察。

配置合入主分支，也不等于团队全员已经开启自动审查。单个 PR 自动触发了审查，不能说明所有协作者的 PR 都会触发，管理员侧的统一自动触发规则与自定义指令开关状态仍有待确认。

## 可复用的关键规则

### 1. 把触发条件和审查内容分开看

个人设置、仓库 branch ruleset 以及组织 ruleset 都可以各自触发自动审查（通常在 PR 创建或转为 Ready 时请求，draft 和每次 push 为可选项）。正因为个人开关和仓库、组织规则互不覆盖，单看某一次 PR 自动触发了，无法反推整个仓库的覆盖范围，必须核对实际生效的仓库或组织配置。

仓库管理员可以在 `Settings → Rules → Rulesets` 为目标分支新建或检查 branch ruleset，开启自动请求，同时检查组织层可能适用的 ruleset 或规则配置，再到 `Settings → Copilot → Code review` 确认自定义指令开关，最后用指向目标分支的真实 PR 核对时间线是否如期触发。适用条件与入口细节见 [GitHub 配置文档](https://docs.github.com/en/copilot/how-tos/copilot-on-github/set-up-copilot/configure-code-review)。

### 2. 全仓写通用政策，路径文件只补模块重点

把上下文分成两层维护会更省心：`.github/copilot-instructions.md` 放全仓通用的审查要求和知识路由，`.github/instructions/*.instructions.md` 通过 `applyTo` 针对特定目录补充检查点；根 `AGENTS.md` 负责指路，详细契约仍留在模块文档里，不要把全文复制进每一份指令。比如全仓文件里可以这样引导（其中 `docs/feature-contract.md` 为示意路径，应用到具体仓库前请先确认实际文件位置）：

```text
审查改动时追踪受影响的调用方和契约，报告位置、触发条件与影响；房间模块运行契约请参考 `docs/feature-contract.md`。
```

Copilot 审查读取指令时所用的版本来自 PR head 分支，所以在新增指令的同一个 PR 里就能观察到读取情况；不过命中路径并不意味着全部匹配文件都会被读取，运行日志可帮助确认指令是否被读取，至于模型是否遵守对应规则，仍需结合实际审查行为判断。更多机制见 [GitHub 使用文档](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/use-code-review?tool=xcode)。

### 3. 要证据充分的发现，不要人为压低评论数

写审查提示时，要求它顺着改动追踪受影响的调用方、契约以及代码或状态的所有权（即由哪一端负责维护和变更），每条评论都写清具体位置、触发条件、实际影响以及支撑判断的调用链或契约依据。输出按影响程度排序，同一根因的问题合并处理，不同严重级别只要有依据都保留。

不要在指令里限制评论数量上限、规定只报 P0/P1，或者要求达到 95% 置信度才准发言；遇到高影响但暂时没法坐实的疑点，让它直接标明不确定性和建议的验证方法。

### 4. 只把核实过的反馈写回规则

收到审查意见后，先由人核实评论和修复方案，再决定要不要把新发现的契约细节、漏报模式或误报边界写回主文档或窄范围指令。补充规则时，顺手记下关联 PR、具体评论、修复提交、适用条件、验证依据，以及哪些例外情况下仍然应该报错。按实际需要更新即可，不用每个 PR 都攒一条 FAQ，也不要把未经核实的猜测或个人偏好写进仓库规则。

### 5. 用真实审查验证加载和效果

这个项目先以 `Balanced` 强度作为观测基线，后续代码出现较大风险变化时再按需重新请求审查，并记录每次的 PR head、实际 effort、耗时与结果。要确认全仓或路径指令是否真被读到，用户可以在 PR 时间线打开可访问的 review session 或相关运行日志，查找实际的文件读取记录。前文案例就是从可访问运行日志的文件读取记录中确认全仓文件已读取；日志里必须有具体的读取证据，不能只因为出现了文件路径就认定已经读取。受权限和日志可见性限制，并不是每次审查都能看到完整日志；如果无法获取读取记录，就应明确写明无法验证。

另外要注意区分“指令加载”和评论上的 attribution。attribution 只记录某条评论关联到的 MCP 或 skill，单凭它不能证明自定义指令已经加载，零评论或没有 attribution 同样不能证明指令没加载。审查跑完不等于规则全被读过，零评论更不代表准确率变高。关于 review session 与 attribution 的说明见 [GitHub 审查文档](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/copilot-code-review)。

顺带区分一下工具边界：当前案例没有额外引入 MCP 或 runner，也没有新增 reviewer 侧 skill，打算等后续真实评审里暴露出明确的知识或工具缺口时再评估。GitHub reviewer 本身支持配置 MCP（默认带有 GitHub 和 Playwright MCP）和 GitHub agent skills，这与前面提到的作者侧本地审查流程不是一回事，GitHub 不会自动执行作者本地流程；仓库里实际启用和调用了什么，仍以仓库设置和 review session 记录为准。

---

接下来这个项目需要跟进的事项是：完成管理员侧统一自动触发规则与自定义指令开关的确认，并在下一次真实 Swift 或 Room 业务 PR 中核对路径指令是否读取以及评论是否落地。

延伸阅读：Yuzheng Sun 在 2026-04-10 发布的[《AI User 与 AI Builder 的 5 个差距》](https://www.superlinear.academy/c/ai-resources/ai-mastery)「差距 4」一节提出，应当把验证过的经验留成团队资产，并分层提供上下文。这有助于理解为什么要把契约和规则分层放好，但它属于经验思路，不能当作 Copilot 的技术事实或本次配置效果的证明。
