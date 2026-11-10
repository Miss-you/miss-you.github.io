### Hi there 👋

知识库入口：[/kb/](https://yousali.com/kb/)。新增小知识或经验只需在 `content/kb/` 添加 Markdown；写法、草稿、图片与发布说明见 [知识库维护指南](kb/README.md)。

### 本地构建与工具预览

文本对比预览版基于完整的 text-compare-lite，源码、许可、上游版本与修改记录见 [接入说明](tools/text-compare-lite/README.ydd.md)。需要 Node.js 24 和 Hugo Extended。

```sh
npm --prefix tools/text-compare-lite ci --ignore-scripts
node scripts/build-text-compare.mjs
hugo --minify --buildFuture
```

`./serve.sh` 和部署流程会先构建工具。修改工具源码后重新运行构建脚本；生成的资源和 Hugo partial 不入库。预览入口为 `/tools/text-diff-preview/` 和 `/en/tools/text-diff-preview/`，原版继续保留。

### 站点导航维护

- 菜单名称、顺序和目标只改 [config.yaml](config.yaml) 的 `languages.*.menu.main`。RSS 使用 `identifier: rss`，地址取该语言生成的订阅源。
- 所有 Hugo 页面共用 [导航模板](layouts/partials/site-header.html) 和 [导航样式](assets/css/site-header.css)。页面内不再复制菜单或覆盖导航断点；语言切换优先使用当前页译文，缺失的栏目使用默认语言页面。
- [公共资源入口](layouts/partials/site-header-assets.html) 加载本地资源。[外观脚本](assets/js/site-header.js) 只处理菜单滚动和 `pref-theme` 外观偏好。普通页面的主题点击仍由 PaperMod 页脚负责，避免绑定两次。
- 独立工具用 `dict "page" . "isolated" true` 调用导航及资源入口，由公共脚本接管主题点击；保留自己的 CSP、页面资源和计算逻辑，不引入博客的远程字体、评论或图表脚本。全屏演示等原有静态文件保持独立。

修改后运行 `node --test tests/site-header.test.mjs tests/text-diff*.test.mjs`、`python3 -m unittest discover -s tests -p 'test_*.py'` 和 `hugo --minify --buildFuture`，并检查中英文页面、明暗模式及手机菜单。

<!--
**Miss-you/miss-you** is a ✨ _special_ ✨ repository because its `README.md` (this file) appears on your GitHub profile.



Here are some ideas to get you started:

- 🌈 I’m currently working at Tencent. 😎
- 🐳 I’m currently learning Golang\K8S\OpenResty\APISIX\Istio\Envoy. 😎
- 🤔 I'm thinking changing the world more or less. 😎
- 💬 Welcomed to ask me about `API gateway or Cloud Native`. 😎
- 📫 How to reach me: [email:yousa@apache.org](yousa@apache.org)

-->

<img align="right" src="https://github-readme-stats.vercel.app/api?username=Miss-you&show_icons=true&theme=vue" alt="yousa's github stats" />

- 🌈 I’m currently working at Tencent. 😎
- 🐳 I’m currently learning Golang\K8S\OpenResty\APISIX\Istio\Envoy. 😎
- 🤔 I'm thinking changing the world more or less. 😎
- 💬 Welcomed to ask me about `API gateway or Cloud Native`. 😎
- 📫 How to reach me: [email:yousa@apache.org](yousa@apache.org)

<img src="https://github-profile-trophy.vercel.app/?username=miss-you&theme=flat&column=7&margin-w=10" alt="logo" height="160" align="center" />
