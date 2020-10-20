# 使用 Github Pages 和 Hugo 搭建个人博客教程


十一假期宅家无事，发现自己过去写了很多文章，却没有一个自己的博客，系统得管理自己的文章，所以准备将自己过去以及未来的文章都放到博客，以饷读者。另一方面，经过对 Serverless 博客、TCB 建站、虚拟机建站等一系列建站方式对比后，个人认为基于 Github Pages 最适合搭建个人技术博客，最重要的当然是免费，其次网上教程众多，可以快速建站，第三则是所有的博客直接托管在 github，也更符合个人习惯，最后则是自建个人博客可玩性和可扩展性好。

当然，这个方案并不是完美无缺，缺点也比较明显，比如需要考虑到安全信息泄漏问题（比如可能会泄露公司内的机密信息或者秘钥到 Github，所以需要准备安全扫描方案，这个我们会在另一篇文章谈）；另一方面，读者需要能够翻墙才可以访问 Github Pages；最后，则是没有 CDN 加速，如果访问者众多或者网站图片众多，加载速度很慢。

## 为什么要写技术文章？

其实，个人写文章最初是兴趣使然以及工作需要。众所周知，IT 是一个技术革新很快的行业，新的概念、新的语言、新的框架层出不穷，程序员需要持续学习，我有对每一个新的知识有做笔记的习惯，笔记攒多了便需要回顾总结整理，便形成了一篇篇的文章。

以前笔记的图找不到了，差不多在习惯使用电子笔记之前有十几本笔记，后来我习惯性使用思维导图 processon 等一系列工具记录笔记，比如这张图便是我做的思维导图笔记的冰山一角：

![图片](https://cdn.jsdelivr.net/gh/Miss-you/img@1.0/how-to-create-blog/20201020131829.png)

那么，写技术文章有何价值？个人认为写技术文章的价值主要有三方面：个人价值、企业价值和社会价值、企业价值。从个人角度来说，技术写作是树立个人技术影响力，提升自我价值的最快路径，没有之一；从公司角度，坚持长线的写作，对于公司的技术品牌，技术文化，有着巨大的推动作用；从更高的维度来说，技术写作也是提升整个社会技术水平，推动技术不断进步的源动力。

## hugo 初探

### hugo 是什么？

Hugo 是由 Go 语言实现的静态网站生成器。简单、易用、高效、易扩展、快速部署。

[hugo 中文官方文档](https://www.gohugo.org/)

[hugo 英文官方文档](https://gohugo.io/documentation/)

### 安装 hugo

在 windows 下，你可以在此处下载

[windows 版本下载链接](https://github.com/gohugoio/hugo/releases/download/v0.63.2/hugo_0.63.2_Windows-64bit.zip)

如果你是 mac 系统，则可以通过如下命令安装（需要先安装 homebrew）

```plain
brew install hugo
```

### 确认 hugo 安装是否成功

通过检查版本号的方式，确认 hugo 安装是否成功

```plain
hugo version
Hugo Static Site Generator v0.73.0/extended darwin/amd64 BuildDate: unknown # 输出结果
```
### 初始化网站目录

安装好之后，便可以初始化一个 hugo 项目，

```plain
hugo new site demosite # 命令格式，hugo new site <项目名称>
```
### 下载一个 hugo 主题

hugo 主题可以理解为是一种网站样式，你可以在该页面选择自己心仪的 [hugo 主题](https://www.gohugo.org/theme/)。我当前使用的是 LoveIt 这个主题，集成了很多插件，很好用很方便的一个中文博客模板。

进入该目录，初始化 git 项目，并下载 hugo 主题

```plain
cd demosite
git init #初始化 git 项目
git submodule add https://github.com/dillonzq/LoveIt.git themes/LoveIt #下载主题
```
1. 博客会采用 git 项目方式管理，所以需要初始化 git 项目
2. 采用 submodule 的方式管理主题库 theme，方便及时更新和管理

### 配置主题

使用 LoveIt 的标准配置文件模板

```plain
cp themes/LoveIt/exampleSite/config.toml .
```
需要修改一下主题路径 themesDir 配置，将其注释掉

![图片](https://cdn.jsdelivr.net/gh/Miss-you/img@1.0/how-to-create-blog/20201020132241.png)

### 创建文章

创建一篇空文章

```plain
hugo new posts/demo.md
```
另外，需要将生成文章头部的`draft=true`修改为`draft=false`，否则并不会生成草稿页面
![图片](https://cdn.jsdelivr.net/gh/Miss-you/img@1.0/how-to-create-blog/20201020132227.png)

### 启动 hugo 服务器

启动 hugo 服务器，进入 [http://localhost:1313/](http://localhost:1313/) 预览页面

```plain
hugo server -D
```
页面预览如下
![图片](https://cdn.jsdelivr.net/gh/Miss-you/img@1.0/how-to-create-blog/20201020132216.png)

### 构建静态页面

若要将博客托管在 github 上，需要上传静态页面。所以，需要使用 hugo 构建静态页面，构建命令如下：

```plain
hugo -D
```

## 使用 Github Pages 搭建个人博客

### 个人博客整体架构

一个静态博客数据有两部分，一部分是静态页面（体积小），另一部分是图片或者大文件（文件体积大），通常来讲一个网站整体结构是静态页面放在服务器上（比如可以使用虚拟机、自己的服务器、github pages 项目），而对于大文件或者图片则通常会使用对象存储服务（比如对象存储或者 github 项目），它们前端使用一个 CDN 进行加速（比如云厂商的 CDN 服务或者 cloudinary），当然，在 HTTPS 已经普及的时代，一个 HTTPS 服务也是必不可少的。

整体架构图如下：

![图片](https://cdn.jsdelivr.net/gh/Miss-you/img@1.1/how-to-create-blog/arch.jpg)

经过综合考量，个人建站选用组件如下：

- 静态网站服务器：Github Pages
- 图片上传工具：picgo
- 图片存储服务：Github 项目 + jsdelivr 加速
- 域名服务商/域名购买：NameCheap
- HTTPS/CDN 服务提供商：Cloudfare

> 腾讯云服务中的 TCB 一键建站也挺好用的。但是因为个人图省钱和喜欢折腾，还是选择自己建站自己选择组件，一方面免费，另一方面可以对网络有更加深刻的理解。

### Github Pages 是什么？

GitHub Pages 是一项静态站点托管服务，它直接从 GitHub 上的仓库获取 index.html、HTML、CSS 和 JavaScript 文件，也可以通过构建过程运行文件，然后发布网站。

GitHub Pages 可以识别指定分支根目录或者/docs 目录下的静态站点，具体可以在个人站点的 setting 中配置。

![图片](https://cdn.jsdelivr.net/gh/Miss-you/img@1.0/how-to-create-blog/20201020132202.png)

Github Pages 建站有两种类型：

* 个人/组织站点，其域名格式形如`https://<USERNAME|ORGANIZATION>.github.io/`
* 项目站点，其域名格式形如`https://<USERNAME|ORGANIZATION>.github.io/<PROJECT>/`

你需要看清楚你的 Github Pages 建站类型，不同的建站类型的建站方法也不同，具体可以参考 [官方手册](https://docs.github.com/en/free-pro-team@latest/github/working-with-github-pages)

这里我们以个人站点（User Pages）为例

### 创建 Github Pages 项目

创建一个新的 github 项目，项目名称需要是`<username.github.io>`格式，如下图样例

![图片](https://cdn.jsdelivr.net/gh/Miss-you/img@1.0/how-to-create-blog/20201020132156.png)

### 配置 pages 项目

点击进入 setting，搜索 github pages 关键字，找到相关配置：当前 github 默认分支已经是 main 分支，需要调整下；配置好之后即可通过`用户名。github.io`最初的 github 页面。

![图片](https://cdn.jsdelivr.net/gh/Miss-you/img@1.0/how-to-create-blog/20201020132138.png)

### hugo 生成静态页面

生成静态页面之前需要修改 config.toml 文件中的 baseURL 配置，将其修改为个人站点，比如我的就是 `miss-you.github.io`

前面我们知道`hugo -D`可以生成静态页面，但该命令会默认将静态页面生成到 public 目录下，而 Github Pages 仅支持根目录/或者/docs 目录，所以我们需要将静态页面生成到 docs 目录下

```plain
hugo -d docs
```
### 上传 github pages 项目

静态页面生成完成后，便可以将整个静态页面以及本项目其他文件上传到 github 项目中。先使用`git remote`命令添加远端仓库，将文件提交（git add+git commit），最后推送到 Github Pages 项目中

```plain
git remote add origin git@github.com:Miss-you/miss-you.github.io.git # 将本地 git 项目与 github 项目相关联
git fetch origin # 拉取 github 项目
git checkout main #切换到主分支 main
git add . 
git commit -m "init github pages"
git push origin
```
当然，这里也可以采用`git clone <YOUR-PROJECT-URL> && cd <YOUR-PROJECT>`拉取项目、上传文件（git add/commit/push) 的方式，上传 github 项目，这里不作过多演示
### 发布脚本

虽然我们已经打通了基于 Github Pages 搭建个人博客的流程，但每次博客有修改都需要执行多条命令才能将博客发布，重复劳动且浪费时间，而程序员的天性是追求效率，应当用自动化（脚本）解决重复的工作。

如下是一个常用脚本，会自动构建静态页面，然后提交构建出来的 docs 静态页面目录，将其推送到对应 Github Pages 项目中

```plain
#!/bin/sh
# If a command fails then the deploy stops
set -e
printf "\033[0;32mDeploying updates to GitHub...\033[0m\n"
# Build the project.
hugo -d docs # if using a theme, replace with `hugo -t <YOURTHEME>`
# Add changes to git.
git add docs
# Commit changes.
msg="rebuilding site $(date)"
if [ -n "$*" ]; then
	msg="$*"
fi
git commit -m "$msg"
# Push source and build repos.
git push origin main
```
## FAQ

### 常见操作

TODO

#### 文章插入图片

图片上传问题

图片存储问题

TODO

#### 修改模板

TODO

#### 创建友链

TODO

#### 创建联系方式

TODO

### 常见问题

#### Github Pages 项目报错：The submodule registered for ./themes/xxx could not be cloned.

原因是 Github Pages 项目，若要使用 submodule 应用第三方主题，需要使用 https 的地址而不是 git 地址

![图片](https://cdn.jsdelivr.net/gh/Miss-you/img@1.0/how-to-create-blog/20201020132108.png)

#### [TOC] 符号不生效

toc 是 markdown 的一种进阶语法，用于自动生成目录，但是 hugo 并没有支持该语法。目录建议采用主题自带的目录功能，比如本文示例中的 LoveIt 主题。

![图片](https://cdn.jsdelivr.net/gh/Miss-you/img@1.0/how-to-create-blog/20201020132119.png)

使用 loveit 或者切换到 loveit 主题入门教程：

[LoveIt 入门教程](https://hugoloveit.com/zh-cn/theme-documentation-basics/#basic-configuration)

#### 找不到主题，Error: module "LoveIt" not found

原因是由于 LoveIt 示例主题中的 config.toml 文件，其主题路径为"../.."，该目录下并不会有 LoveIt 主题，将其注释掉即可，或者修改 LoveIt 主题所在的相对路径

![图片](https://cdn.jsdelivr.net/gh/Miss-you/img@1.0/how-to-create-blog/20201020132035.png)

#### github 搜索不到 LoveIt 主题

LoveIt 英文小写是 loveit，不是 lovelt，因为不注意的话 I 和 l 难以区分，容易混淆

![图片](https://cdn.jsdelivr.net/gh/Miss-you/img@1.0/how-to-create-blog/20201020131946.png)

## 参考链接

- [hugo 中文官方文档](https://www.gohugo.org/)
- [hugo 英文官方文档](https://gohugo.io/documentation/)
- [hugo 主题站](https://www.gohugo.org/theme/)
- [github pages 官方手册](https://docs.github.com/en/free-pro-team@latest/github/working-with-github-pages)
- [hugo loveit 主题使用教程](https://hugoloveit.com/zh-cn/theme-documentation-basics/#basic-configuration)
- [cloudfare 配置教程](https://www.vps234.com/cloudflare-cdn-setting-tutorials/)
- [picgo 官方教程](https://picgo.github.io/PicGo-Doc/zh/guide/)
