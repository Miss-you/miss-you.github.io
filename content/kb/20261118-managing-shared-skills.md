---
title: "Claude Code 与 Codex 的 Skills 如何长期维护"
slug: "managing-shared-skills"
date: "2026-11-18"
lastmod: "2026-11-18"
lang: "zh"
topic: "工程实践"
summary: "按来源、入口、宿主适配与升级责任管理 Skills，比较链接、复制、安装器和插件的适用条件。"
tags: ["Skills", "Claude Code", "Codex", "工程实践"]
draft: false
---

在同时使用 Claude Code 与 Codex 的项目中长期维护 skill（封装了指令、脚本与参考资料的可复用任务流程），可以先按团队当前的技能来源、改动频率与组包需求选一个起点：

- **少量自研技能为主、日常改动频繁且开发环境可控**：先采用“单源目录 + 逐技能入口”，维护一份公共技能源，再按技能粒度向 `.claude/skills` 与 `.agents/skills` 建立符号链接或同步入口。
- **主要消费外部开源技能**：优先固定安装器版本与上游来源，将外部安装快照与自有代码隔离，再按需向宿主目录暴露。
- **需要在本地、团队内把技能连同配置组包复用，或将单个、整组技能独立打包对外分发**：在此基础上引入插件机制。

单源链接、复制生成、宿主适配、安装器管理与插件封装属于可按需叠加的工程维度，不必五选一。若还不清楚仓库里已经混用了哪些入口与维护方式，可先在仓库根目录运行下面这段只读提示词盘点现状（仅做静态方法盘点，不自动安装或迁移技能），再根据盘点出的来源归属、重复入口与适配差异对照后文选择方案：

```text
请以只读方式盘点当前仓库的技能现状（不修改文件、不执行安装或迁移命令、不扫描仓库外的未知个人目录，不输出 SKILL.md 私密正文或疑似凭证）：
1. 扫描 `.claude/skills`、`.agents/skills` 两个原生入口，以及由这两处符号链接、锁文件、插件清单（`plugin.json` 或 `.codex-plugin`）或仓库内同步脚本明确指向的仓库内维护源；无法从仓库内链接或声明确认来源的标为“未知”。
2. 按技能列出：来源归属与记录的版本/commit；目标工具与生效范围（含 `SKILL.md` front matter 中的 `disable-model-invocation`、`allowed-tools`、`context`，是否存在 `agents/openai.yaml`，以及引用的 `scripts/`、`references/`、`assets/` 路径）；可编辑维护源与安装产物路径；同名或重复入口；升级、补丁回写与删除清理责任，以及仅凭静态文件无法确认的待核实项。
```

## 双端发现与执行语义：同文件不证明同行为

跨客户端复用技能时，需先区分通用规范与宿主扩展。Agent Skills 规范定义了技能目录结构、`SKILL.md` 格式、front matter（文件开头的元数据区）字段及验证约束，但不定义统一的发现路径、运行权限或依赖锁，`allowed-tools` 在规范中也仅列为实验字段（见 [Agent Skills 规范说明](https://agentskills.io/specification)）。因此，磁盘上的技能文件完全相同，并不代表它们在两个客户端中的发现规则与执行语义自动等价。

两端的发现路径、同名优先级与调用开关各自独立。Codex 推荐项目路径 `.agents/skills`，加载时从当前工作目录向仓库根逐级查找祖先目录；支持技能目录符号链接，同名技能不合并、可并列显示；隐式调用开关 `policy.allow_implicit_invocation` 位于技能目录下的 `agents/openai.yaml`，普通技能可按路径或名称禁用，配置变更后需重启生效（见 [Codex 技能构建文档](https://learn.chatgpt.com/docs/build-skills)）。Claude Code 的项目路径为 `.claude/skills`，支持单技能目录符号链接，当前没有官方默认读取 `.agents/skills` 的承诺；同名技能按“企业 > 个人 > 项目”的优先级覆盖；`disable-model-invocation` 写在 `SKILL.md` 的 front matter 中，`context: fork`（独立子上下文）和动态 shell 均属其专属扩展；`allowed-tools` 在 Claude Code 中仅代表调用该技能当轮的临时免审批授权，下一条用户消息后即清除，并非禁止调用其他工具或提供操作系统级沙箱（见 [Claude Code 技能文档](https://code.claude.com/docs/en/skills)）。

落到维护分工上，公共核心与宿主配置如何分置取决于技能是否触及客户端专有语义：当纯文本说明和任务规则同时满足两端约束时，可直接共享同一个完整技能目录并向两端逐项暴露，仅在需要调整调用开关时按各客户端规则补充配置（如共存 `agents/openai.yaml`），但不能靠简单复制某个字段来保证双端语义等价。当两端确有不同工具名、专有执行方式或正文语法差异时，则应把公共业务规则、`scripts/` 与 `references/` 留在单一维护源中，为两个客户端分别保留薄入口 `SKILL.md`（或由脚本从共同源生成不同入口）。无论采用哪种方式，Agent Skills 规范未定义统一的宿主 import 机制，本轮亦未核实两端存在通用的跨端 import 语法；`references/` 等参考资料与脚本由模型在运行时按需读取，不能假设 Markdown 链接会在技能激活时自动导入或全文展开，需在 `SKILL.md` 正文中写清读取条件与相对路径。

## 链接、复制与安装器：看清落盘路径与锁恢复边界

自研技能采用单源符号链接时，需先区分路径配置错误与跨平台限制。例如社区 `Codex #11314`（环境为 `0.98.0` / macOS）首帖曾称根目录符号链接不受支持，经贡献者先验证指向正确的有效链接可正常加载并追问路径后，参与者确认报错源于创建链接时相对路径写错（见 [Codex Issue #11314 排查评论](https://github.com/openai/codex/issues/11314#issuecomment-3881466510)）。跨平台协作真正需要注意的是，当 Git 配置 `core.symlinks=false` 时，符号链接会被检出为仅含目标路径字符串的普通文本文件（见 [Git core.symlinks 配置文档](https://git-scm.com/docs/git-config#Documentation/git-config.txt-coresymlinks)）。若需覆盖无法保留符号链接的环境，可在仓库中提交普通文件产物；但一次性复制不会自动提供长期同步，源目录发生修改、删除或改名时，需通过脚本同步更新整个受管集合与关联资源。

主要消费外部开源技能时，以 Vercel Skills `1.9.0` 为例，需看清其落盘机制：`skills add` 默认的 `symlink` 模式是先把技能复制到统一的本地安装快照目录，再从宿主目录向该快照建链接，并非把宿主直接连向本地开发源做实时共享；若采用复制模式落地，上游更新后产物也需再次同步（见 [Vercel Skills 安装器实现源码](https://github.com/vercel-labs/skills/blob/50894c1d98bc45ca1ab127213e59d6525065b5e7/src/installer.ts#L374-L475)）。

在依赖锁定与恢复上，Vercel Skills `1.9.0` 提供了项目级 lock v2、固定 commit 与恢复安装（restore）机制（仍标注为 Experimental）。锁定时需同时固定技能内容与安装器版本，直接执行 `npx skills` 本身并未固定 CLI 版本。执行按锁恢复可能覆盖安装副本上的本地修改；`--frozen-lockfile` 除限制锁文件记录不被改写外还会核对内容 hash，但它并非只读检查，恢复过程仍可能修改安装副本（如覆盖修改过的副本）或补建缺失的宿主入口（hash 匹配且入口已存在时可能不改安装树），且不保证失败时的事务回滚（见 [Vercel Skills 按锁恢复源码](https://github.com/vercel-labs/skills/blob/50894c1d98bc45ca1ab127213e59d6525065b5e7/src/install.ts#L95-L155) 与 [Vercel Skills 本地锁校验源码](https://github.com/vercel-labs/skills/blob/50894c1d98bc45ca1ab127213e59d6525065b5e7/src/local-lock.ts#L24-L94)）。因此，日常维护应将自研源、外部快照和本地补丁分开：升级前先看差异，需长期保留的补丁回写自有源，删除或改名时按受管集合整体检查并清理双端入口与资源。若项目已用 npm 管理依赖，可补充考察实验性的 `sync`，由 npm 锁定包版本并从已安装的 npm 包中选择、清理受管技能入口；若仅需单次试用外部技能而不写入固定入口，`use` 可临时下载资源落盘并交付给 prompt，但因未走原生安装注册，不能保证与宿主原生加载的触发及权限语义等价（见 [Vercel Skills 命令说明文档](https://github.com/vercel-labs/skills/blob/50894c1d98bc45ca1ab127213e59d6525065b5e7/docs/commands.md#L298-L390) 与 [Vercel Skills 临时加载源码](https://github.com/vercel-labs/skills/blob/50894c1d98bc45ca1ab127213e59d6525065b5e7/src/use.ts#L115-L158)）。

## 插件分发、选择性暴露与项目参照

当需要将单个或多个技能连同配置在本地目录、会话级（如 Claude Code 的 `--plugin-dir`）或团队内部组包复用，或作为独立包对外分发时，均可引入插件，对外整组发布并非必要条件（见 [Claude Code 插件加载文档](https://code.claude.com/docs/en/plugins/loading) 与 [OpenAI 插件构建文档](https://developers.openai.com/plugins/build/plugins)）。不过，双端的插件规范与可见性控制粒度并不一致：Codex 支持根目录 `plugin.json` 的可移植形式与 `.codex-plugin` 兼容形式并存，但不能据此认为 Claude Code 接受同样的可移植插件语义。在暴露控制上，需区分“增删目录入口”与“客户端原生可见性配置”：Claude Code 的 `skillOverrides` 可管理普通技能的可见性，但官方明确说明它不适用于插件技能；通过 `enabledPlugins` 整插件启停不同于逐个技能的选择性暴露，且在项目中提交 `enabledPlugins` 配置也不证明每个克隆环境都已安装该插件（见 [Claude Code skillOverrides 配置文档](https://code.claude.com/docs/en/settings-reference#skilloverrides) 与 [Claude Code 插件安装文档](https://code.claude.com/docs/en/plugins/install)）。

三个真实项目可分别作为不同管理职责的参照（不作排行）：`JimLiu/baoyu-skills`（作者 Jim Liu / 宝玉）在单一仓库（monorepo）中维护多技能共用的共享 npm 包，通过脚本检查共享包依赖版本、拒绝多个技能脚本所依赖的共享工作区包的 `file:` 依赖（不限相对路径）与相应的工作区包私有副本（vendor），并配有按技能执行的[发布守卫](https://github.com/JimLiu/baoyu-skills/blob/ca703c2d7c2c4399a1dc0cf82224f8551e05a96d/scripts/lib/skill-release-guard.mjs)，可作为作者侧多技能源码维护与发布规则的参照（见 [baoyu-skills 共享依赖校验脚本](https://github.com/JimLiu/baoyu-skills/blob/ca703c2d7c2c4399a1dc0cf82224f8551e05a96d/scripts/verify-shared-package-deps.mjs)）。`Superpowers` `7.0.2` 维护公共 `skills`，Claude Code 与 Codex 各有工具说明及插件清单（manifest），Codex 另有单独打包脚本，可作为公共流程、宿主适配与分发包分开维护的参照，但不构成两个渠道同步发布的证明（见 [Superpowers 技能说明文件](https://github.com/obra/superpowers/blob/22f0b463e7a5e579904dd6211a520321035526f7/skills/using-superpowers/SKILL.md#L56-L72) 与 [Superpowers Codex 插件打包脚本](https://github.com/obra/superpowers/blob/22f0b463e7a5e579904dd6211a520321035526f7/scripts/package-codex-plugin.sh)）。前述 Vercel Skills 则作为消费侧外部依赖快照与入口管理的参照，不替代两个客户端的语义适配。

结合盘点结果，可按以下三列条件表确定目录落地、外部锁定与组包方式（其中“宿主薄入口与配置适配”可按需与其余各行组合）：

| 可组合维度 | 适用前提与双端接入方式 | 维护边界与代价 |
| :--- | :--- | :--- |
| 单源 + 逐技能链接 | 少量自研、常改、开发环境可控；向 `.claude/skills` 与 `.agents/skills` 逐技能建链，可按入口增删或用各客户端原生配置控制可见性 | `core.symlinks=false` 会检出为路径文本；两端同名优先级与调用开关各自独立 |
| 单源 + 复制生成 | 需兼容禁用符号链接的环境或提交普通文件；由脚本生成双端普通目录，按各宿主规则加载与覆盖 | 一次性复制不自动同步；修改、删除或改名需同步清理整个受管集合与关联资源 |
| 宿主薄入口与配置适配 | 技能含双端不同工具名、专属字段或正文语法差异；公共规则、`scripts/`、`references/` 单源维护，薄入口或配置文件按宿主分置 | 引用文件需写明按需读取路径；不能靠简单复制字段假定双端触发或权限语义等价 |
| 安装器 + 锁与按需暴露 | 主要消费外部仓库或 npm 随包技能；先复制到快照再建宿主链接，或用 `sync` 从已装 npm 包选择并清理受管项 | 需同时固定 CLI 版本与技能来源；按锁恢复可能改安装树或覆盖本地修改（hash 匹配且入口已存在时可能不改），`--frozen-lockfile` 并非只读或事务回滚 |
| 插件封装与组包分发 | 需在本地、团队内将单技能或多技能连同配置组包复用，或独立打包对外发布；公共流程可与双端清单及打包脚本分离 | 不能假定同一插件清单在双端语义等价；`skillOverrides` 不管插件技能，`enabledPlugins` 为整插件启停且不自动替克隆环境安装插件 |

## 最小验证与核实边界

缩小选择后可按两步做最小验证：单机接入时，先核对两个客户端的实际加载路径、`references/` 与 `scripts/` 的相对路径定位，以及关键任务流程是否走通；采用锁文件恢复或插件分发后，再补充核对旧版本恢复、技能改名或删除后的残留清理，以及实际安装包内的资源完整性。需注意，固定技能文件与锁记录不等于固定模型的运行时行为。本文梳理的机制基于截至 `2026-11-18` 的官方文档与固定 commit 源码只读核对（在线滚动文档不构成对旧版本客户端的兼容保证），未执行安装器运行、双端实际交互或跨平台实测，文中的工程选型与维护成本比较均为基于已核事实的条件建议。
