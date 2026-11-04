# Lab · 动画实验室

博客上的交互动画栏目，地址 `https://yousali.com/lab/`。动画在 teardown 仓库里做好，这里只负责托管和列索引。第一批是「账户风险管理原则」三课。

## URL 结构

| 地址 | 内容 |
|---|---|
| `/lab/` | 索引页，按分组列出所有条目 |
| `/lab/#<分组 id>`、`/lab/#<条目 slug>` | 锚点，可以直接分享到某一组或某一条 |
| `/lab/<分组 id>/<slug>.html` | 动画本身，全屏单文件页面 |
| `/lab/<分组 id>/thumbs/<slug>.jpg` | 缩略图，960×540 |

现有条目：

- `/lab/risk-lessons/lesson1-ruin.html`：课一，赌徒破产 + 波动损耗 g(L)
- `/lab/risk-lessons/lesson2-theta.html`：课二，腰斩链条 → θ = 2μ/(Lσ²) − 1
- `/lab/risk-lessons/lesson3-kelly.html`：课三，1992 英镑 → N = R ÷ D → 非对称 Kelly

分组 id 和 slug 定下来后不要改，改了旧链接会失效。

## 文件放在哪

| 文件 | 作用 |
|---|---|
| `data/lab.json` | 索引的唯一数据源：分组、条目标题、一句话简介、时长、关键词、截图时刻 |
| `content/lab/_index.md` | 索引页的标题和开头说明（怎么看、按键） |
| `layouts/lab/list.html` | 索引页模板，读 `data/lab.json` 渲染分组和卡片 |
| `assets/css/extended/lab.css` | 索引页样式，PaperMod 会自动打包 |
| `static/lab/<分组 id>/` | 动画 HTML 和 `thumbs/`。Hugo 原样复制，不经过模板和 Markdown，`--minify` 也不处理 |
| `lab/sync.py` | 从 teardown 复制动画、检查、截缩略图 |

动画 HTML 放在 `static/` 而不是 `content/`，原因是这些文件有 1 MB 多，three.js 以 data URL 内联在 importmap 里；放进 `content/` 会被当成页面处理。放在 `static/` 时，构建产物和源文件逐字节相同（已用 `cmp` 核对过）。

## 索引页长什么样

- 页头沿用博客的 PaperMod 外观，顶部菜单有「实验室」入口。
- 开头一段说明：每条是离线单文件，按键是 → / 空格 / 点击下一段，← 上一段，Home 回开头，A 播到结尾，页面按 1920×1080 设计，手机建议横屏。
- 分组超过一个时，顶部出现分组导航。
- 每组一个标题、一句话说明和卡片网格。卡片包括 16:9 缩略图、标题、一句话简介、时长和章数、关键词。点缩略图或标题会在当前标签页全屏打开动画，用浏览器后退键回到索引。
- 组末尾可以有一行小字备注，比如「不构成投资建议」。
- 网格最小列宽是 `min(100%, 300px)`，手机上变成单列，页面不会横向滚动。

## 从 teardown 同步

```bash
# 先在 teardown 里构建
python3 ~/Documents/GitHub/teardown/sims/risk-lessons/build.py

# 再在博客仓库里复制，缺缩略图的会自动截一张
python3 lab/sync.py              # 全部条目
python3 lab/sync.py lesson2      # 只同步 slug 以 lesson2 开头的条目
python3 lab/sync.py --thumbs     # 同时重截已有的缩略图
python3 lab/sync.py --check      # 不复制，只检查 static/lab/ 下已有的文件
```

`sync.py` 的规则：

- 源文件：`$TEARDOWN/<teardown_dir>/<slug>.html`。`TEARDOWN` 默认是 `~/Documents/GitHub/teardown`。
- 检查一：页面里不能出现 CSOP、南方东英或合规编号。命中就跳过这个文件，脚本以失败退出。
- 检查二：不能用 `<script src=http…>` 或 `<link href=http…>` 引用远程资源，要保证页面断网能用。
- 缩略图：用系统 Chrome 无头模式（Metal，真 WebGL）打开页面，调用 `window.seek(thumb_t)` 定格，截 1920×1080，再用 `sips` 缩成 960 宽的 JPEG。截图时刻 `thumb_t` 写在 `data/lab.json` 里。Chrome 路径可以用环境变量 `CHROMIUM` 覆盖。
- 页面需要遵守 teardown `shell.js` 的约定，即提供 `window.seek(t)` 和 `#progress`。不遵守也能复制，只是截到的缩略图停在开头。

teardown 自带的 `sims/capture.mjs --still` 也能截图，但需要先在 teardown 里 `npm install` 装 playwright。`sync.py` 直接调用 Chrome，不依赖它。

## 新增一条要做哪几步

1. 在 teardown 里把动画构建成离线单文件 HTML。它需要满足：断网可用、真 3D、全屏自适应，最好提供 `window.seek`。
2. 在 `data/lab.json` 里添加条目。放进已有分组，或者新建一个分组（`id`、`title`、`summary`、`teardown_dir`，`note` 可选）。条目字段是 `slug`、`title`、`summary`、`keywords`、`length`、`thumb_t`。
3. 运行 `python3 lab/sync.py <slug>`，复制页面并截缩略图。截出来不满意，就改 `thumb_t`，再加 `--thumbs` 重跑。
4. 运行 `hugo server --buildFuture` 本地预览：打开 `/lab/` 看卡片，点进去试 → / ← / A，再用手机宽度确认没有横向滚动。
5. 提交 `data/lab.json` 和 `static/lab/<分组>/`，推到 `main` 后由 GitHub Actions 部署。

如果新条目不是来自 teardown，比如手写的单页，可以直接放到 `static/lab/<分组>/<slug>.html`，再手动放一张 `thumbs/<slug>.jpg`，然后跳过第 3 步。`teardown_dir` 只有 `sync.py` 会用到。

## 以后可以加的

- 「foundry」等 teardown 里其他系列：每个系列一个分组，`teardown_dir` 指向对应目录。
- 条目多了以后，可以给每条单独做一个说明页（`content/lab/<slug>.md`，写设计思路和来源），卡片同时链接说明页和全屏页。目前三课的出处已经写在动画页脚里，所以暂时不做。
- 英文版：`content/lab/_index.en.md`，`data/lab.json` 里的条目加上 `title_en`、`summary_en`。
