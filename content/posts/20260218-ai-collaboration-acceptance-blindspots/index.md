---
title: "AI 协作开发的验收盲区：169 个测试全过，16 处遗漏未捕获"
date: 2026-02-18T13:12:00+08:00
draft: false
lang: zh
tags: ["AI", "Prompt Engineering", "软件工程", "测试", "代码审查", "Rust", "TypeScript"]
categories: ["技术", "工程实践"]
description: "169 个测试全过，功能却完全失效。本文解剖一个真实任务的四层验收漏斗，揭示多层架构中横向传播遗漏的本质问题——以及不同 Prompt 策略如何决定验收效率。"
---

# AI 协作开发的验收盲区：169 个测试全过，16 处遗漏未捕获

TypeScript 编译零错误，`clippy` 零 warning，CLI 返回正确数据。AI 报告「代码完成」。

submit 功能完全失效。前端校验会拒绝包含新数据源的提交请求。文档有多处与代码不一致的描述。这些问题在首轮验收中全部隐形（不是被忽略，而是现有验证手段从结构上无法触及）。

测试全绿证明不了质量，只证明了测试覆盖了多少。在多层架构中，纵向测试验证的是「这段代码做了什么」，而非「这段代码应该做什么但没做」。一个新增的枚举值需要在 26 个触点完成注册，其中只有约 8 个的缺失会触发编译错误。剩余 18 个触点即使全部遗漏，编译照过，测试照绿，功能链路静默断裂在中间层。遗漏是一种 absence——在缺乏穷尽匹配约束的代码层中，absence 不报错。

这不是理论推演。本文解剖的是一个真实任务：为 Tokscale 添加第 10 个 AI 数据源（Kimi），涉及 28 个文件修改、约 300 行新增 Rust 代码、横跨 6 个架构层（Core → Pricing → CLI → TUI → Frontend → Docs）。AI 首轮交付后，第一轮验收发现 0 个问题，第二轮发现 12 处遗漏，第三轮仍追出 3 处。每一轮使用不同的验证方法，每一层专门捕获前一层的盲区。

但这篇文章不仅仅是方法论的分类账。本文同时复盘了每一轮验收背后的 Prompt——人类如何向 AI 提问，直接决定了 AI 能暴露多少自身的盲区。同一个 AI，面对不同的提问方式，交出的答案质量天差地别。四轮验收的差异，很大程度上源于 Prompt 策略的差异（第三层除外——那一层更多依赖人工逐段追踪而非 Prompt 引导）。

---

## 多层架构中的「枚举值传播」问题

Tokscale 的架构分为 6 层，从底层的 Rust Core 解析器一直延伸到最上层的文档：

```
Layer 1: Rust Core Parser (kimi.rs)
  ↓ UnifiedMessage
Layer 2: Rust Scanner + Pipeline (scanner.rs, lib.rs)
  ↓ ParsedMessages { kimiCount }
Layer 3: TypeScript CLI (graph-types.ts, native.ts, cli.ts, submit.ts)
  ↓ SourceType = "kimi"
Layer 4: TUI Display (types, colors, Footer, useData, App)
  ↓ badge, hotkey, color
Layer 5: Frontend (types.ts, validation/submission.ts, constants.ts, SourceLogo.tsx)
  ↓ Zod schema, display config
Layer 6: Documentation (README × 4)
```

每新增一个数据源，这 6 层中总共有 26 个触点需要添加对应的逻辑。以 `scanner.rs` 中的 `ScanResult` 为例，这个结构体为每个数据源各保留了一个文件列表字段：

```rust
#[derive(Debug, Default)]
pub struct ScanResult {
    pub opencode_files: Vec<PathBuf>,
    pub opencode_db: Option<PathBuf>,
    pub claude_files: Vec<PathBuf>,
    pub codex_files: Vec<PathBuf>,
    pub gemini_files: Vec<PathBuf>,
    pub cursor_files: Vec<PathBuf>,
    pub amp_files: Vec<PathBuf>,
    pub droid_files: Vec<PathBuf>,
    pub openclaw_files: Vec<PathBuf>,
    pub pi_files: Vec<PathBuf>,
    pub kimi_files: Vec<PathBuf>,    // ← 第 10 个数据源
}
```

这种模式意味着 `kimi_files` 必须出现在 `ScanResult` 的定义、`total_files()` 的求和、`all_files()` 的遍历、`scan_all_sources()` 的扫描和聚合等多处。仅 `scanner.rs` 一个文件就占 5 个触点。

26 个触点中，只有约 8 个遗漏会导致编译失败——比如 `ScanResult` 新增字段后有代码引用它（缺失则编译失败）、`SessionType` 缺枚举值（在没有通配符的 `match` 中报 non-exhaustive）、`ParsedMessages` 缺计数字段。这些错误编译器直接拦截。但剩下的约 18 个触点，遗漏后编译通过、测试通过，功能却不完整。比如 `submit.ts` 的 `hasFilter` 逻辑不检查 `options.kimi`，结果是 `--kimi` 参数定义了但提交时不生效；又比如前端的 `z.enum` 不包含 `"kimi"`，结果是包含 Kimi 数据的提交会被校验拒绝。

AI 在首轮实现中完成了约 14 个触点——Rust Core 全部正确，CLI 大部分到位——遗漏了 12 个。自动化测试一处遗漏也没检出。

---

## 实现 Prompt 复盘：计划的覆盖范围 ≠ 实现的覆盖范围

在分析验收手段之前，先看源头：我们给 AI 的实现指令是什么，AI 交付了什么，差距出现在哪里。

实现阶段的核心 Prompt 是一条探索性指令，附带了详细的技术方案：

```
实现以下计划：为 Tokscale 添加 Kimi CLI 支持
[附带详细的技术方案、任务清单、验收标准]
```

这条 Prompt 的设计意图是充分的：它包含了 Rust Core 和 TypeScript CLI 两端的完整修改范围，列出了 6 层架构的触点清单，甚至附带了可执行的验收标准。从计划文档的角度看，覆盖范围是完整的。

但计划的覆盖范围和实现的覆盖范围是两回事。

AI 的实际交付呈现出一个清晰的模式：Rust Core 层的 8 个触点全部正确完成——`kimi.rs` 解析器、`scanner.rs` 扫描逻辑、`lib.rs` 管线集成、`aliases.rs` 定价映射，无一遗漏。而 TypeScript/Frontend/Docs 层的约 18 个触点中，只完成了 6 个，遗漏了 12 个。

这个分布不是随机的。Rust 端有编译器充当「隐形验收官」：在本项目中，`ScanResult` 的字段被其他代码引用，缺一个就编译不过；`SessionType` 的 `match` 没有使用通配符分支，少一个枚举值就报 non-exhaustive pattern。编译器迫使 AI 在实现阶段就把这些触点补齐。而 TypeScript 端的可选类型（`kimi?: boolean`）和运行时校验（`z.enum`）不会在编译期发出任何信号——遗漏了也能通过，于是 AI 就停在了「编译通过」的节点上。

这揭示了探索性 Prompt 的一个结构性局限：它给 AI 提供了「做什么」的清单，但 AI 的完成判定依赖于环境反馈。在有强类型约束的 Rust 端，环境反馈是即时且强制的——编译失败就必须修；在弱约束的 TypeScript/Frontend 端，环境反馈是静默的——编译通过就以为完成了。同一条 Prompt，在不同语言层产生了截然不同的完成度，差异不在指令本身，而在目标语言的类型系统对遗漏的容忍度。

在本案例中，AI 的实现深度更多跟着编译器走，而不是跟着计划走。计划说「修改 28 个文件」，编译器只强制其中 8 个，AI 做到了 8 + 6 = 14 个——6 个 TypeScript 触点靠 AI 自身的上下文理解完成，没有编译器兜底，这说明 AI 并非完全依赖编译器反馈。但编译器反馈的有无，仍然是 Rust 端 100% 完成 vs TypeScript 端大量遗漏的最显著区别因素。剩余 12 个触点需要人类的验收手段来发现。

---

## 第一层：自动化测试的天花板

AI 完成首轮实现后，执行了完整的自动化验证流程，6 项检查全部通过：

```
$ cargo build          ✅  无 error
$ cargo test           ✅  169 passed, 0 failed
$ cargo clippy         ✅  0 new warning
$ bun run build:cli    ✅  TypeScript 编译通过
$ bun run cli -- sources
                       ✅  显示 Kimi CLI（674 messages）
$ bun run cli -- models --kimi --json
                       ✅  返回正确数据
```

这 6 项检查为什么没有发现 12 处遗漏？

原因在于编译器和测试框架检查的是纵向的类型一致性，而非横向的传播完整性。`cargo build` 能检测到 `ScanResult` 缺 `kimi_files` 字段（其他代码会引用它，不存在则编译失败）。但 `cargo build` 无法检测到 `submit.ts` 里的 `hasFilter`（过滤条件变量）是否包含了 `options.kimi` 这一项——因为 `kimi` 在 `SubmitOptions` 中的类型是可选的：

```typescript
interface SubmitOptions {
  opencode?: boolean;
  claude?: boolean;
  codex?: boolean;
  // ... 省略其他 source
  kimi?: boolean;      // ← 可选参数，不传 = undefined
  since?: string;
}
```

当 `cli.ts` 调用 `submit({...})` 时没有传递 `kimi: options.kimi`，TypeScript 不会报错。`kimi` 本来就是可选的，不传等于 `undefined`，走到 `hasFilter` 时不触发，结果进入默认路径。功能表现为「`--kimi` 参数存在但没有任何效果」，不会有任何运行时错误。

前端的情况类似。Zod schema 中的 `z.enum` 是运行时校验，只在提交包含 `source: "kimi"` 的数据时才触发校验失败。不提交就不会发现 enum 少了一项。而我们的测试流程只验证了读取路径（`models --kimi --json`），没有走到提交路径。

```typescript
// source 字段的合法值全部硬编码在此——列表残缺即校验失败
source: z.enum(["opencode", "claude", "codex", "gemini", "cursor",
                "amp", "droid", "openclaw", "pi"]),
// ↑ 缺少 "kimi"，测试只走读取路径，从未触发这条校验
```

### SOP 自检 Prompt 的失效

在自动化测试全绿之后，验收的第一个直觉是让 AI 自我检查。使用的 Prompt 是：

```
1. 代码完成了吗？
2. 你列的验收列表这里，完成情况如何，包括存量用例运行，以及新增的单元测试等等
3. 现在还有哪些没完成呢？请你检查下
```

这是一种「元认知」策略——要求 AI 先生成自己的验收清单，再对着清单逐项核对。AI 随后启动了两个并行 Subagent 做全量验证：一个跑 `cargo test`（169 passed）+ `cargo clippy`（零新 warning），另一个执行 6 条 CLI 集成测试命令。

结果：发现 0 个结构性遗漏。

这个 Prompt 为什么失效？因为它让 AI 用自己的心智模型来审计自己的产出。AI 的自检 SOP 和它的实现逻辑共享同一个盲区——两者都沿纵向路径检查（代码能编译吗？测试能跑通吗？CLI 能返回数据吗？），而不会沿横向路径检查（`"kimi"` 是否出现在所有 26 个触点？）。让同一个 AI 既写代码又写验收清单，等价于让考生在没有标准答案的情况下批改自己的试卷——它不是不会，而是无从判断自己遗漏了什么。用工程术语说，这是一种「共模失效」（common-mode failure）：审计者和被审计者共享同一套假设，AI 在 Review 时的检查范围和它在编码时的认知范围高度重叠。但这不是 AI 能力的上限——后文会证明，换一种 Prompt（基准对比），同一个 AI 就能发现全部 12 处遗漏。问题不在 AI「看不到」，而在于没有外部参照物时，它不知道该往哪里看。

这两类遗漏——可选参数默默缺席、运行时校验从未触发——需要完全不同的检测手段。自动化测试和 AI 自检都无法触及它们，因为两者的检测原理都是纵向的：验证已有代码的行为，而非审计应有代码的存在。

---

## 第二层：基准对比法——以 Codex 为镜

核心思路是：既然 Codex 已完整实现，那么 Codex 出现的每个位置，Kimi 也应该出现。在全代码库搜索 `"codex"` 的所有出现位置：

```bash
# Rust 侧由编译器保证，遗漏集中在 TypeScript/Frontend 层
$ grep -rn '"codex"' packages/cli/src/ packages/frontend/src/
```

结果：一次性暴露 12 处遗漏。以 `validation/submission.ts` 为例，修复前后的对比：

```typescript
// 修复前——z.enum 缺少 "kimi"
source: z.enum([
  "opencode", "claude", "codex", "gemini", "cursor",
  "amp", "droid", "openclaw", "pi"
]),

// 修复后
source: z.enum([
  "opencode", "claude", "codex", "gemini", "cursor",
  "amp", "droid", "openclaw", "pi", "kimi"   // ← 修复点
]),
```

这个文件中有两处 `z.enum`——`SourceContributionSchema` 和 `DataSummarySchema`——两处都遗漏了 `"kimi"`。如果用户提交包含 Kimi 数据的使用报告，Zod 校验会在 `source` 字段处失败，请求被拦截或服务端返回 400。

`submit.ts` 中有 4 处遗漏（类型定义、过滤逻辑、数组填充），其余分布在前端的 `types.ts`、`constants.ts`、`SourceLogo.tsx` 和 README。

### 基准对比 Prompt 的设计逻辑

触发这一轮发现的 Prompt 是一条结构化的基准比对指令：

```
以 Codex 作为基准，逐项列出所有修改点：
1. Core 解析链路：模块注册、扫描、计数、汇总
2. CLI 源类型与过滤：--codex、source union、默认 source 列表
3. TUI 交互与显示：source 类型、底部来源 badge、快捷键映射
4. Submit/社交链路：提交侧 source 过滤 + 服务端 schema 验证
5. 前端展示链路：frontend source type、名称/图标/颜色映射
6. 文档：来源列表、功能描述、筛选说明、Windows 路径表

反推 Kimi 是否一一对应。
```

这条 Prompt 之所以是全流程中 ROI 最高的验收手段（一条指令发现 12 处遗漏），关键在于它绕过了 AI 自检的共模失效。上一节已经证明，让 AI 自问「完成了吗？」得不到有效答案，因为 AI 的自检逻辑和实现逻辑共享同一套假设。而这条 Prompt 引入了一个外部参照物——Codex 的已有实现——作为「应该」的标准。

区别在于问题的性质被转换了。「代码完整吗？」是一个主观判断题，AI 只能依赖自己的认知来回答。「Codex 出现在这 6 个位置，Kimi 是否也出现在这 6 个位置？」是一个客观模式匹配题，AI 只需要做字符串搜索和逐项比对，不需要依赖自身对「完整性」的主观理解。

这条 Prompt 还有一个设计细节值得注意：它预先按功能域划分了 6 个类别（Core、CLI、TUI、Submit、Frontend、Docs），而不是简单地说「搜一下 codex 和 kimi 的对比」。这个分类框架引导 AI 在每个架构层都做一遍完整比对，避免 AI 在某一层找到几处遗漏后就停止搜索。事实上，12 处遗漏分布在 Submit、Frontend、Docs 三个不同的功能域——如果没有分类框架，AI 可能在发现 Submit 的 4 处遗漏后就报告「已修复」。

基准对比的关键价值在于它检测的不是「代码对不对」，而是「代码全不全」。自动化测试不知道哪些文件「应该」包含 kimi，而基准对比通过一个已实现的参照物提供了这个「应该」。

但基准对比有一个隐含假设：如果 Kimi 在某个文件中出现了，就认为该文件的实现是完整的。下一层会打破这个假设。

---

## 第三层：端到端调用链追踪

基准对比修复了 12 处遗漏后，`submit.ts` 内部的类型定义、过滤逻辑、数组填充都已补齐。但追踪 `--kimi` 参数的完整数据流，调用链在中间断了。

`--kimi` 参数的数据流分为三段：

```
cli.ts    .option("--kimi", "Include only Kimi CLI data")     ✅ 定义正确
cli.ts    submit({ ..., kimi: options.kimi, ... })             ❌ 漏传
submit.ts if (options.kimi) sources.push("kimi")               ✅ 使用正确
```

两端各自正确，但中段传递断裂：`cli.ts` 的 action 函数调用 `submit({...})` 时未传 `kimi: options.kimi`。

```typescript
// cli.ts submit 命令的 action（修复前）
await submit({
  opencode: options.opencode,
  claude: options.claude,
  codex: options.codex,
  gemini: options.gemini,
  cursor: options.cursor,
  amp: options.amp,
  droid: options.droid,
  openclaw: options.openclaw,
  pi: options.pi,
  // kimi: options.kimi,    ← 缺失
  since: options.since,
  until: options.until,
  year: options.year,
  dryRun: options.dryRun,
});
```

TypeScript 编译器不会报错，因为 `kimi` 在 `SubmitOptions` 中是可选参数（`kimi?: boolean`）。不传就是 `undefined`。`submit` 函数内部的 `hasFilter` 检查 `options.kimi`，得到 `undefined`，不触发过滤，走默认的全量提交路径。表面上功能正常——数据能提交——但 `--kimi` 过滤完全无效。

为什么基准对比没有发现这个问题？`grep` 的输出本身是行级的，理论上可以逐行比对。但实际操作中，检查者（人或 AI）看到 `cli.ts` 中已经存在 `"kimi"` 字符串（在 `.option("--kimi", ...)` 中），就认为这个文件已覆盖，没有继续追踪同一文件内其他应出现 `kimi` 的位置。`submit.ts` 的情况类似：修复后文件内部确实有了 `kimi` 的完整逻辑，但 `cli.ts` 调用 `submit({...})` 的那一行属于 `cli.ts`，在那里被漏掉了。

这暴露的不是基准对比方法本身的固有限制，而是执行粒度的问题：当检查者将 `grep` 结果退化为文件级扫描（「这个文件有 kimi 就算过」）时，行级遗漏就会漏网。要捕获这类问题，需要沿数据从 A 点到 B 点的完整路径逐段追踪，验证每段是否连通。

---

## 第四层：质疑外部数据

前三层解决的都是代码层面的问题：遗漏、断链、类型不匹配。但还有一类问题不在代码逻辑中，而在代码引用的外部事实中。

Tokscale 需要知道每个模型的定价才能计算成本。Kimi CLI 使用 `kimi-for-coding` 作为模型标识，这个标识需要映射到一个有定价数据的模型名。AI 在 `aliases.rs` 中写下了这个映射：

```rust
// 推断值——未经官方定价文档核实
m.insert("kimi-for-coding", "kimi-k2-thinking");
```

`kimi-k2-thinking` 的 output 定价是 $2.50/M tokens。如果不追问，没有理由怀疑它。

### 一句 Prompt 切换 AI 的认知模式

追问的 Prompt 是：

```
代码修改中，像是 kimi 模型成本这种比较细节的问题，
你是如何获取的呢？你应该只能通过联网的方式获取到这个数据吧？请你自检下
```

AI 坦承这是基于模型命名的推断，而非来自官方定价文档。联网验证后发现 `kimi-for-coding` 实际对应的是 `kimi-k2.5`，output 定价为 $3.00/M tokens。两者差距 20%。

```rust
// 官方定价页核实：kimi-for-coding → kimi-k2.5，$3.00/M output
m.insert("kimi-for-coding", "kimi-k2.5");
```

改动只有一行，但如果漏过，Tokscale 对所有 Kimi 用户的成本计算都会偏低 20%。

这条 Prompt 值得单独拆解，因为它在四轮验收中单位字数的 ROI 最高——一句话就把一个隐蔽的事实性错误逼了出来。

关键在于它没有问「定价对不对？」——如果这样问，AI 会回顾自己填入的值，发现 `$2.50` 在 Kimi 系列的价格区间内属于合理范围，然后回答「对的」。这条 Prompt 问的是「你是如何获取的？」——这迫使 AI 从「给答案」模式切换到「评估答案置信度」模式。AI 不再试图辩护答案的合理性，而是被要求复盘自己的推理链条：我是从官方文档查到的，还是根据模型命名规律推断的？一旦进入这个模式，AI 会主动暴露推理过程中的不确定性，而不是把不确定性包装成确定的答案。

这条 Prompt 的后半句「你应该只能通过联网的方式获取到这个数据吧？」进一步收窄了 AI 的退路。它预设了一个判断标准：这类数据的唯一可靠来源是联网查询。AI 无法在这个前提下继续声称「我根据模型名推断的结果是可靠的」，只能承认推断并转向联网验证。

这类问题的特征是：AI 面对不确定的事实时，倾向于给出一个「合理推断」而非拒绝回答。推断出的值往往在语义上足够接近，不会触发开发者的直觉警报。`kimi-k2-thinking` 和 `kimi-k2.5` 都是 Kimi K2 系列的模型，$2.50 和 $3.00 的差距也不是数量级的错误。只有在明确追问数据来源时，这类错误才会浮出水面。对于涉及外部事实的映射关系——定价、API endpoint、版本号——追问来源，和验证「值看起来合不合理」是两件独立的事，前者无法被后者覆盖。

---

## 闭环：四层漏斗模型与 Prompt 策略

四层漏斗的核心逻辑是：每一层用不同的检测原理过滤不同类型的问题，前一层的假阴性恰好落在后一层的检测范围内。

| 层级 | 验证手段 | Prompt 策略 | 发现问题数 | 典型案例 |
|------|---------|------------|-----------|---------|
| 0 | 实现指令 | 探索性 Prompt + 详细计划 | — | Rust 100% / TS 遗漏 12 处 |
| 1 | 自动化测试 + AI 自检 | 「完成了吗？请你检查下」 | 0（假阴性） | 169 个测试全部通过 |
| 2 | 基准对比 | 以 Codex 为参照物，分 6 域逐项比对 | 12 | submit.ts、Zod schema、README |
| 3 | 端到端追踪 | 人工逐段追踪调用链 | 3 | submit 参数未传递 |
| 4 | 外部数据质疑 | 「这个数据你是如何获取的？」 | 1 | 定价别名映射错误 |

各层的检测原理不同，在实际操作中形成互补：第一层沿纵向做逻辑验证，对横向传播遗漏无感知；第二层通过字符串匹配发现了文件级遗漏，但在本次实践中未深入到行级的调用链检查；第三层追踪了数据流的完整生命周期，却不会质疑数据本身的真实性；第四层针对 AI「合理推断」的外部事实做源头验证。理论上，如果某一层的执行粒度足够细（比如基准对比逐行比对而非文件级扫描），可以覆盖下一层的部分检测范围。但在实际操作中，每层倾向于在自身的抽象粒度上工作，层间的互补关系因此成立。

复盘 Prompt 后可以看到一条规律：有效的验收 Prompt 都在做同一件事——把 AI 从「回答者」模式切换到「审计者」模式。但切换的杠杆不同：

- **自检 Prompt（失效）**：「完成了吗？」——审计者和被审计者共享同一套假设（共模失效），检出率为零。
- **基准对比 Prompt（高效）**：「Codex 有的，Kimi 也该有」——引入外部参照物，把主观判断题转换为客观匹配题，一次检出 12 处。
- **溯源 Prompt（精准）**：「这个数据你怎么来的？」——攻击 AI 的推理链条而非推理结果，迫使 AI 暴露不确定性。

每一层的盲区在下一层中有针对性的对应手段。

### 实践清单

- **自动化验证做基线**：运行全量测试和 `lint`，检查是否引入回归。绿色结果代表「已有功能未被破坏」。
- **基准对比做横向覆盖**：选一个已完整实现的同类功能作参照，用 `grep` 列出其所有出现位置，对照检查新增实现的覆盖情况。Prompt 中按功能域分类（Core / CLI / TUI / Submit / Frontend / Docs），避免 AI 在某一域发现遗漏后过早停止。
- **端到端追踪做连通性**：从用户输入沿调用链追踪到最终输出，逐段验证参数传递。可选参数是断链高发区——TypeScript 的 `?` 和 Rust 的 `Option<T>` 都让缺失静默通过。
- **外部数据追问来源**：对 AI 产出中涉及定价、API endpoint、版本号等外部事实，不问「对不对」，问「怎么来的」。前者让 AI 辩护结果的合理性，后者迫使 AI 暴露推理链条的薄弱环节。

169 个测试、0 个失败——这是本文的起点。四条 Prompt、16 处修复——这是从起点到终点之间，验收手段和提问策略共同填补的距离。
