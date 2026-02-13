---
title: "当浏览器自动化遇上平台风控：一次小红书发布工具的反检测实战"
date: 2026-02-13T10:00:00+08:00
draft: false
tags: ["浏览器自动化", "CDP", "反检测", "Patchright", "小红书", "Python"]
categories: ["技术实战", "自动化"]
description: "国内内容平台没有开放API，浏览器自动化是唯一出路。但平台风控会检测自动化痕迹。本文记录了一次完整的反检测实战：从 Playwright 被封到 Patchright + CDP 模式的调试全过程，踩过 7 个具体的坑，提炼出可复用的原则。"
cover:
    image: ""
    alt: "浏览器自动化反检测"
    caption: "从被风控到稳定运行的完整调试记录"
    relative: true
---

# 当浏览器自动化遇上平台风控：一次小红书发布工具的反检测实战

事情的起因很简单。我需要一个工具，自动把内容发布到小红书。

打开创作者中心，上传几张图，填标题，写正文，加话题标签，点发布。一篇两篇没问题，但每天要发几十篇的话，纯体力劳动。

自然想到浏览器自动化。写个脚本，模拟人在浏览器里的操作。

但我低估了难度。Playwright 的 API 很好用，模拟点击、填写、上传都有现成的方法，编码不难。难的是小红书的风控系统会识别出你在用自动化工具，然后封你。

下面是从被风控到稳定运行的调试记录，踩了 7 个坑。

## 为什么得用浏览器自动化

国内的内容平台，小红书、抖音、公众号，都不提供公开的发布 API。

海外不一样。Twitter、YouTube、Medium 都有 API，HTTP 请求直接发内容。国内平台对内容管控更严格，API 只给少数合作伙伴，普通开发者拿不到。

所以你想自动化发内容，只剩一条路。用代码打开浏览器，模拟人的操作。

主流工具有 Selenium、Playwright、Puppeteer，干的事情一样。启动一个浏览器实例，通过协议控制它。

但平台也不傻。

## 传统方案怎么被检测的

用 Playwright 的 `launch()` 启动浏览器，这个浏览器从出生那一刻就带着「自动化」的印记。风控脚本查几个点就够了。

最直接的是 `navigator.webdriver`。正常浏览器里这个值是 `undefined`，但 Selenium 和 Playwright 启动的浏览器是 `true`。一行 JS 就能判断。

```javascript
if (navigator.webdriver) {
    // 自动化工具，触发风控
}
```

然后是浏览器指纹。UA 字符串可能带 `HeadlessChrome`，WebGL 渲染结果不同，Canvas 指纹不同，屏幕分辨率是固定的默认值。单个差异不起眼，组合起来就是明确的信号。

还有操作节奏。机器操作太整齐了，每次点击间隔恰好 500ms，输入速度完全一致。真人会犹豫，会停顿，快慢不一。

最后是「生活痕迹」。自动化启动的浏览器是全新实例。没有浏览历史，没有书签，没有扩展，没有其他网站的 cookies。像一个刚出厂的手机。

风控不需要多精密。它只问一个问题：这个浏览器环境真实吗？

不真实就触发验证码、限制发布、标记异常。

## 小红书自动发笔记

先说我要做的事。

写一个 Python 脚本。打开小红书创作者中心，登录，上传图片，填标题正文，加话题标签，点发布。

用 Playwright 写这个流程不难。`page.click()`、`page.fill()`、`page.set_input_files()` 都能直接用。

第一次跑，成功了。

第二次，还是成功。

第三次，弹了个滑块验证码。手动过了，继续。

第四次，直接提示「操作频繁，请稍后再试」。

第五次，账号被标记异常，要手机验证。

典型的风控升级。平台不会一上来就封你，逐步加码，先软后硬。

到这一步，`launch()` 模式走不通了。得换思路。

## CDP 模式：连接真实浏览器

这是整篇文章的核心。不是前端开发者的话可能对 CDP 不熟，我尽量讲清楚。

### 什么是 CDP

CDP 全称 Chrome DevTools Protocol。

你在 Chrome 里按 F12 打开的开发者工具，Elements 面板、Console 面板、Network 面板，它们和浏览器本体之间走的就是这个协议。

具体来说，CDP 是一套 JSON 格式的消息，通过 WebSocket 传输。浏览器暴露一个 WebSocket 端口，外部程序通过这个端口发指令、收事件。

- 「帮我导航到这个 URL」→ `Page.navigate`
- 「帮我执行这段 JS」→ `Runtime.evaluate`
- 「页面加载完了没」→ `Page.loadEventFired`

Playwright 和 Puppeteer 就是 CDP 的高级封装。把底层 JSON 消息包成好用的 API。

### `launch()` vs `connect_over_cdp()`

Playwright 有两种模式。这两种模式的区别是解决反检测的关键。

**`launch()`**：Playwright 自己启动一个全新的 Chromium 实例，整个生命周期都由它控制。问题是这个浏览器从出生就带自动化标记。`--enable-automation` 启动参数，`navigator.webdriver` 设成 `true`，实例全新，没有用户数据。

**`connect_over_cdp()`**：不启动新浏览器，连接到一个已经在运行的 Chrome。可以是你日常用的浏览器，有书签、扩展、浏览历史、登录过的各种网站。Playwright 通过 CDP 协议「接管」控制权。

一个是造机器人去冒充人类。另一个是给真人装一只遥控的手。

### 为什么 CDP 模式更难被检测

因为连接的就是用户的真实浏览器。

- 指纹完全真实。UA、WebGL、Canvas、屏幕分辨率都是真实设备的数据
- 没有 `--enable-automation` 启动参数
- 有真实的浏览历史、扩展、书签
- 网络栈完全真实。DNS 解析、TLS 握手、证书链验证都是 Chrome 原生行为

风控看这个浏览器，每个维度都是「真的」。因为它确实是真的。

### Patchright：在 CDP 层做额外修补

用了 CDP 模式还有几个细微的检测点。Playwright 连接 CDP 时会发一些特定的协议命令，留下可被检测的痕迹。

[Patchright](https://github.com/Kaliiiiiiiiii-Vinyzu/patchright) 是 Playwright 的 fork，专门解决这个。修补了三个检测点。

**`Runtime.enable` leak**：Playwright 连接后会发 `Runtime.enable` 命令监听 JS 运行时事件。某些反检测脚本能检测这个命令是否被调用过。Patchright 移除了这个行为。

**`Console.enable` leak**：Playwright 会启用 Console 域来捕获 `console.log` 输出。也是检测信号。Patchright 同样移除了。

**`navigator.webdriver`**：Patchright 通过 `--disable-blink-features=AutomationControlled` 启动参数禁用自动化标记。在 CDP 模式下，连接的是用户自己启动的 Chrome，本身就没有 `--enable-automation`，这个属性天然是正常值。

前两个修补在 CDP 协议通信层完成，不注入任何 JavaScript。JS 注入本身也能被检测到（通过检查属性描述符、原型链等），协议层的修补对页面内的 JS 完全透明。

理论讲完了。下面是实战。

## 7 个坑

理论上方案很清晰。启动 Chrome 加调试端口，用 Patchright 连上去，写自动化脚本。实际操作中每一步都可能出问题。

以下 7 个坑按遇到的时间顺序排列。大部分是 AI 在「探索 → 生成代码 → 验证」的循环里自己发现的，我作为验收员确认方案可行性，同时学习风控相关的背景知识。

### 坑 1：Chrome 拒绝在默认 Profile 上开 CDP 端口

**现象**

启动 Chrome 开远程调试端口。

```bash
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --remote-debugging-port=9222
```

终端直接报错。

```
DevTools remote debugging requires a non-default data directory.
```

Chrome 启动了，但调试端口没生效。

**原因**

Chrome 136 开始不允许在默认用户数据目录「`~/Library/Application Support/Google/Chrome`」上启用远程调试端口。安全考虑。如果恶意软件偷偷给你的 Chrome 开了调试端口，它就能通过 CDP 读你所有的 cookies、密码、浏览历史。

**解决**

创建一个专用 Profile 目录。

```bash
mkdir -p ~/.config/rednote-toolkit/chrome-cdp-profile

/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --remote-debugging-port=9222 \
  --user-data-dir="$HOME/.config/rednote-toolkit/chrome-cdp-profile" \
  --no-first-run \
  --no-default-browser-check
```

`--user-data-dir` 指向非默认目录，Chrome 就允许开调试端口了。代价是新 Profile 没有原来的 cookies，不过后面可以通过代码注入。

### 坑 2：Chrome 实例合并导致调试端口不生效

**现象**

按坑 1 的方案启动 Chrome，没报错。`ps aux | grep Chrome` 也能看到进程带着 `--remote-debugging-port=9222` 参数。但是

```bash
lsof -i :9222
# 没有输出，端口没被监听
```

Patchright 连接失败。

**原因**

Chrome 在 macOS 上是单实例应用。系统上已经有一个 Chrome 在运行的话（哪怕只是后台残留进程），新的启动命令不会真的创建新进程。它把窗口请求「合并」到已有进程里，`--remote-debugging-port=9222` 参数直接被扔掉了。

这个坑最容易忽略。macOS 上关闭所有窗口不等于退出应用。你觉得 Chrome 关了，其实它还在 Dock 栏挂着。

**解决**

启动前确保 Chrome 完全退出。

```bash
# Cmd+Q 退出 Chrome，或者命令行杀进程
pkill -f "Google Chrome"
sleep 2

# 然后再启动
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --remote-debugging-port=9222 \
  --user-data-dir="$HOME/.config/rednote-toolkit/chrome-cdp-profile" \
  --no-first-run \
  --no-default-browser-check
```

脚本里我加了检测逻辑。启动后用 `lsof` 确认端口在监听，不在的话提示用户先退出 Chrome。

### 坑 3：Patchright 的 HTTP 发现机制返回 400

**现象**

Chrome 启动了，端口也确认在监听。用 Patchright 连接。

```python
browser = await pw.chromium.connect_over_cdp("http://localhost:9222")
```

报错 `Unexpected status 400`。

但 curl 请求完全正常。

```bash
curl http://localhost:9222/json/version
# 返回正常 JSON，包含 webSocketDebuggerUrl
```

**原因**

Patchright 内部做 HTTP 发现时，请求路径是 `/json/version/`，注意尾部多了一个斜杠。Chrome 144 对带尾部斜杠的 URL 返回 400。不带斜杠的 `/json/version` 正常返回 200。

Patchright 1.58 + Chrome 144 的兼容性问题。

**解决**

绕过 Patchright 的 HTTP 发现。手动请求 Chrome 的发现端点，提取 WebSocket URL，直连。

```python
import http.client
import json
from urllib.parse import urlparse

def resolve_cdp_ws_url(endpoint: str) -> str:
    """将 HTTP 端点解析为 WebSocket URL"""
    if endpoint.startswith("ws://") or endpoint.startswith("wss://"):
        return endpoint

    try:
        parsed = urlparse(endpoint)
        host = parsed.hostname or "127.0.0.1"
        port = parsed.port or 9222

        conn = http.client.HTTPConnection(host, port, timeout=5)
        conn.request("GET", "/json/version")  # 没有尾部斜杠
        resp = conn.getresponse()

        if resp.status == 200:
            data = json.loads(resp.read())
            ws_url = data.get("webSocketDebuggerUrl")
            if ws_url:
                conn.close()
                return ws_url
        conn.close()
    except Exception:
        pass

    return endpoint

# 使用
ws_url = resolve_cdp_ws_url("http://localhost:9222")
browser = await pw.chromium.connect_over_cdp(ws_url)
```

用 `http.client` 请求 `/json/version`，从 JSON 里取出 `webSocketDebuggerUrl`（形如 `ws://127.0.0.1:9222/devtools/browser/xxx`），传给 `connect_over_cdp()`。

### 坑 4：urllib.request 请求 localhost 返回 502

**现象**

写坑 3 的解决方案时，我最初用 `urllib.request.urlopen()` 请求 `/json/version`。

```python
import urllib.request
resp = urllib.request.urlopen("http://localhost:9222/json/version")
# urllib.error.HTTPError: HTTP Error 502: Bad Gateway
```

502？Bad Gateway？localhost 又没有网关。

同一时间 `curl` 正常，`http.client` 也正常。单独 `urllib` 不行。

**原因**

我 Mac 上装了 ClashX，开了系统代理。

`urllib.request` 会读系统代理设置。发现系统配了 HTTP 代理，就把所有请求（包括 localhost）转发给代理服务器。代理收到指向 `localhost:9222` 的请求，连的是代理服务器自己的 localhost。那上面当然没有 Chrome 在 9222 端口监听，所以 502。

`http.client.HTTPConnection` 是底层 HTTP 客户端，不读系统代理，直接建 TCP 连接。`curl` 默认也不走系统代理。

**解决**

用 `http.client` 代替 `urllib.request`。

```python
# 不要用这个
# urllib.request.urlopen("http://localhost:9222/json/version")

# 用这个
import http.client
conn = http.client.HTTPConnection("127.0.0.1", 9222, timeout=5)
conn.request("GET", "/json/version")
resp = conn.getresponse()
data = resp.read()
conn.close()
```

后来我养成了习惯。在 macOS 上调试 localhost 通信，同一个 URL 用 `curl` 能通但 Python 不通，先查代理。

### 坑 5：CDP 模式下 `new_context()` 导致 ERR_CONNECTION_CLOSED

**现象**

连上 Chrome 后，按 Playwright 的常规用法创建新的 BrowserContext。

```python
browser = await pw.chromium.connect_over_cdp(ws_url)
context = await browser.new_context()
page = await context.new_page()
await page.goto("https://creator.xiaohongshu.com")
```

所有 HTTPS 请求失败，控制台全是 `ERR_CONNECTION_CLOSED`。页面空白。

但不创建新 context，直接用 Chrome 已有的。

```python
browser = await pw.chromium.connect_over_cdp(ws_url)
context = browser.contexts[0]  # Chrome 已有的默认 context
page = await context.new_page()
await page.goto("https://creator.xiaohongshu.com")
```

一切正常。

**原因**

这里有个认知误区。

`launch()` 模式下 Playwright 完全控制浏览器生命周期，`new_context()` 创建的 BrowserContext 有完整的网络栈配置。CDP 模式下不是这样。`new_context()` 创建的是一个隔离的 context，有独立的网络栈。

问题出在「独立的网络栈」。新 context 缺少 Chrome 原始 context 的 DNS 配置、TLS 会话缓存、证书验证策略。HTTPS 连接建不起来。

说白了，CDP 连接不等于完全透明地操控用户浏览器。`new_context()` 会引入隔离层，而这个隔离层缺关键的网络配置。

**解决**

不建新 context。用 Chrome 已有的默认 context，通过 `add_cookies()` 注入 cookies。

```python
import json

browser = await pw.chromium.connect_over_cdp(ws_url)
ctx = browser.contexts[0]  # 使用已有 context

# 注入 cookies
storage_state_path = "storage_state.json"
with open(storage_state_path) as f:
    state = json.load(f)
await ctx.add_cookies(state["cookies"])

page = await ctx.new_page()
await page.goto("https://creator.xiaohongshu.com")
```

好处是 DNS、TLS、代理设置全部继承自 Chrome 原始配置。缺点是不能用 BrowserContext 隔离多个会话。需要多账号的话，得启动多个 Chrome 实例。

### 坑 6：CDP 模式下 `add_init_script()` 导致 ERR_CONNECTION_CLOSED

**现象**

为了双重保险，我加了一行 JS 注入覆盖 `navigator.webdriver`。

```python
ctx = browser.contexts[0]
await ctx.add_init_script("""
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
""")
page = await ctx.new_page()
await page.goto("https://creator.xiaohongshu.com")
```

又是 `ERR_CONNECTION_CLOSED`。和坑 5 一模一样。

去掉 `add_init_script()` 那一行，恢复正常。

**原因**

这是整个调试过程中最难定位的 bug。

`add_init_script()` 不报任何错误。静静地执行，返回成功。但它改了 context 的页面初始化流程。CDP 模式下，对已有 context 调用这个方法会和 Chrome 原始初始化流程冲突，后续新页面的网络栈被悄悄破坏了。

具体来说，`add_init_script()` 通过 CDP 的 `Page.addScriptToEvaluateOnNewDocument` 命令实现。`launch()` 模式下 Playwright 完全控制这个流程，没问题。CDP 模式连接到已有 context，这个命令可能和 Chrome 自身的初始化脚本冲突。

**解决**

CDP 模式下跳过 `add_init_script()`。

```python
if not cdp_endpoint:
    # 非 CDP 模式，手动覆盖 webdriver
    await ctx.add_init_script("""
        Object.defineProperty(navigator, 'webdriver', {
            get: () => undefined
        });
    """)
# CDP 模式下不需要。连接的 Chrome 本身没有 --enable-automation，navigator.webdriver 天然正常
```

CDP 模式连接的是用户自己启动的 Chrome，没有 `--enable-automation` 参数，`navigator.webdriver` 天然正常，不需要 JS 注入去覆盖。

定位这个 bug 的过程中，AI 尝试了多种方法，最后靠逐行注释代码做二分找到根因。先注释一半，看正不正常。正常就说明问题在被注释的那一半里。再二分，直到缩小到一行。看日志、猜测、搜 StackOverflow 都没用。

### 坑 7：CDP 模式不应覆盖 User-Agent

**现象**

为了进一步隐藏自动化痕迹，我传了自定义 User-Agent。

```python
page = await ctx.new_page()
await page.set_extra_http_headers({
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) ..."
})
```

又出网络异常。有些请求正常，有些返回奇怪的错误。

**原因**

CDP 连接的是用户真实的 Chrome。这个 Chrome 有自己的 UA，而且 UA 和浏览器的其他指纹（`navigator.userAgentData`、Client Hints 等）一致。

手动覆盖 UA，HTTP 请求头里的 UA 变了，但 JS 层面通过 `navigator.userAgent` 拿到的可能没变（或者变了但和 Client Hints 不一致）。风控一对比，HTTP 头和 JS 返回值不一致，反而更容易判定自动化。

覆盖 UA 还可能影响 TLS 协商。某些 CDN 会根据 UA 返回不同内容。

**解决**

CDP 模式下不碰 User-Agent。

```python
if not cdp_endpoint:
    # 非 CDP 模式，用预设 UA
    context_options["user_agent"] = CUSTOM_USER_AGENT
# CDP 模式下用 Chrome 自带的 UA
```

既然在用真实的 Chrome，就不要画蛇添足。Chrome 自己的 UA 就是最好的 UA。

## 踩完之后回头看

这 7 个坑背后有一些共通的东西。记下来，省得下次再踩。

### 风控和反风控，争的是「真实性」

平台检测的核心问题就一个：这是不是真人在用真浏览器？

所以最好的反检测不是「伪装成真的」，而是「本来就是真的」。CDP 模式连接真实 Chrome 就是这个思路。不伪装 UA，不伪装指纹，不伪装浏览历史，因为它们本来就是真的。

操作层面也一样。脚本里每次点击、每次输入都加随机延迟。不是固定 `sleep(1)`，而是 `sleep(random.uniform(0.5, 2.0))`。节奏要像真人，有快有慢，偶尔「犹豫」一下。

坑 7 也说明了这一点。覆盖 UA 导致指纹不一致，比不覆盖更容易被抓。过度伪装适得其反。

### 浏览器比你想的复杂

我之前对浏览器的认知停留在「发 HTTP 请求、渲染 HTML」。踩了坑 5 和坑 6 才意识到不是这么回事。

浏览器实例背后有一整套网络栈。DNS 解析器、TLS 会话管理器、证书验证链、代理配置、HTTP/2 连接池、HSTS 缓存。BrowserContext 不只是 cookies 的隔离容器，它隔离的是这整套网络栈。

CDP 模式下 `new_context()` 等于创建了一套新的、不完整的网络栈。`add_init_script()` 改了页面初始化流程，可能和原始 context 的初始化冲突。这些副作用在 `launch()` 模式下不存在（Playwright 完全控制环境），CDP 模式下就暴露出来了。

### 代理是隐形杀手

macOS 上 ClashX、Surge、V2Ray 这些工具设的系统代理，会影响 Python 的 `urllib.request`。你的代码访问 `localhost` 时，请求可能被莫名转发到代理服务器。

同一个 URL 用 `curl` 能通但 Python 不通，先怀疑代理。

两个选择：`http.client.HTTPConnection` 直连，不读系统代理。或者代码里设 `os.environ["no_proxy"] = "localhost,127.0.0.1"`。我选了前者，更确定。

### 「悄悄失败」的 bug 用二分法

坑 6 是典型。函数调用不报错，返回值正常，但后续网络连接被偷偷破坏了。

这类 bug 不出现在日志里，不抛异常，不触发断点。你看到的只是结果不对，不知道哪里导致的。

我试过看日志、猜原因、搜 StackOverflow，都没用。最后靠二分法。注释掉一半代码，跑一遍，看正不正常。正常就说明问题在被注释的那一半。再二分。每次只改一个变量。慢，但保证能找到。

### 版本兼容性别想当然

坑 1 是 Chrome 136 的安全策略变更。坑 3 是 Patchright 1.58 + Chrome 144 的 HTTP 发现不兼容。这些工具的行为和文档描述的（或者你以为的）不一样。

Chrome 平均 4 周发一个大版本，每个版本都可能改行为。Patchright 作为 Playwright 的 fork，更新节奏不一定跟得上。

官方方法不工作时别死磕。看版本号，搜 Changelog。兼容性问题要么降版本，要么绕过去。坑 3 我选了绕。Patchright 的 HTTP 发现不好使？自己写一个。手动用 `http.client` 请求 `/json/version`，拿到 WebSocket URL 直连。多了十几行代码，问题解决。

## 最终代码

把所有解决方案组合起来，核心连接逻辑大致长这样。

```python
import http.client
import json
from urllib.parse import urlparse
from patchright.async_api import async_playwright


def resolve_cdp_ws_url(endpoint: str) -> str:
    """手动解析 CDP WebSocket URL，绕过 Patchright 的 HTTP 发现 bug"""
    if endpoint.startswith("ws://") or endpoint.startswith("wss://"):
        return endpoint

    try:
        parsed = urlparse(endpoint)
        host = parsed.hostname or "127.0.0.1"
        port = parsed.port or 9222
        conn = http.client.HTTPConnection(host, port, timeout=5)
        conn.request("GET", "/json/version")
        resp = conn.getresponse()
        if resp.status == 200:
            data = json.loads(resp.read())
            ws_url = data.get("webSocketDebuggerUrl")
            if ws_url:
                conn.close()
                return ws_url
        conn.close()
    except Exception:
        pass
    return endpoint


async def create_browser_context(cdp_endpoint: str = None):
    pw = await async_playwright().start()

    if cdp_endpoint:
        # CDP 模式：连接已有的 Chrome
        ws_url = resolve_cdp_ws_url(cdp_endpoint)
        browser = await pw.chromium.connect_over_cdp(ws_url)
        ctx = browser.contexts[0]  # 用已有 context，不要 new_context()

        # 注入 cookies，不用 add_init_script
        storage_state_path = "storage_state.json"
        try:
            with open(storage_state_path) as f:
                state = json.load(f)
            await ctx.add_cookies(state["cookies"])
        except FileNotFoundError:
            pass  # 首次运行没有保存的状态

        # CDP 模式不覆盖 UA，不注入 init script
    else:
        # 非 CDP 模式：Patchright 自己启动浏览器
        browser = await pw.chromium.launch(headless=False)
        ctx = await browser.new_context(
            user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) ...",
        )
        # 非 CDP 模式可以安全使用 add_init_script
        await ctx.add_init_script("""
            Object.defineProperty(navigator, 'webdriver', {
                get: () => undefined
            });
        """)

    return browser, ctx, pw
```

## 写在最后

整个调试过程前后花了大概 2-3 个小时。

工作模式是这样的：我把需求描述给 AI，AI 在「探索 → 生成代码 → 验证」的循环里自主推进。它去尝试各种方案，遇到报错就分析原因，生成修复代码，再验证。我主要负责三方面：一是作为验收员，确认 AI 提出的方案是否合理；二是学习风控和反风控的背景知识，理解平台检测的原理；三是作为测试员，在关键环节做人工验证，比如登录账号看是否触发风控。

大部分问题 AI 自己能闭环解决。比如 Patchright 的 HTTP 发现机制返回 400，它自己查到是 URL 尾部斜杠的问题，写出绕过代码。比如 Chrome 实例合并导致调试端口不生效，它自己推理出是 macOS 单实例机制的原因。我需要介入的情况不多，主要是确认方向正确，以及验证最终效果。

浏览器自动化反检测这件事，技术门槛其实不高。不需要逆向工程，不需要破解加密算法。理解 CDP 协议的基本原理，知道 `launch()` 和 `connect_over_cdp()` 的区别，知道 CDP 模式下哪些 API 不能用，差不多了。

如果你也在做类似的事情，希望这 7 个坑能省你一些时间。

最后说一句合规性。我用这套方案是把同一篇原创内容分发到多个平台，省掉重复的手动操作。不是拿来刷量灌水的。工具无所谓好坏，关键看你拿它做什么。
