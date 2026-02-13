# 浏览器自动化反检测 SOP

## 适用场景

- 需要通过浏览器自动化操作国内内容平台（小红书、抖音、公众号等）
- 平台无公开发布 API，只能模拟浏览器操作
- 使用 `launch()` 模式已被风控识别，需要切换到 CDP 模式

## 前置依赖

| 依赖项 | 版本要求 | 安装方式 |
|--------|----------|----------|
| Python | 3.9+ | - |
| Patchright | 最新版 | `pip install patchright` |
| Google Chrome | 已安装 | 手动安装 |
| Patchright 浏览器 | - | `patchright install chromium` |

确认 Chrome 路径（macOS）：

```bash
ls /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome
```

## 操作流程

### Phase 1：环境准备

**1.1 创建专用 Chrome Profile 目录**

```bash
mkdir -p ~/.config/rednote-toolkit/chrome-cdp-profile
```

- 预期结果：目录创建成功
- 出错处理：检查磁盘空间和目录权限

**1.2 准备 cookies 文件（可选）**

如有已登录的会话状态，准备 `storage_state.json` 文件，格式：

```json
{
  "cookies": [
    {
      "name": "cookie_name",
      "value": "cookie_value",
      "domain": ".xiaohongshu.com",
      "path": "/"
    }
  ]
}
```

### Phase 2：启动 Chrome CDP

**2.1 确保 Chrome 完全退出**

```bash
pkill -f "Google Chrome"
sleep 2
```

- 预期结果：`ps aux | grep "Google Chrome"` 无输出
- 出错处理：如仍有残留进程，执行 `killall -9 "Google Chrome"`

**2.2 以调试端口启动 Chrome**

```bash
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --remote-debugging-port=9222 \
  --user-data-dir="$HOME/.config/rednote-toolkit/chrome-cdp-profile" \
  --no-first-run \
  --no-default-browser-check
```

- 必须指定 `--user-data-dir` 为非默认目录，否则 Chrome 136+ 拒绝开启调试端口
- 必须加 `--no-first-run` 和 `--no-default-browser-check` 避免弹窗干扰

**2.3 确认调试端口在监听**

```bash
lsof -i :9222
```

- 预期结果：显示 Chrome 进程占用 9222 端口
- 出错处理：无输出说明端口未生效，回到 2.1 重新执行（最常见原因：有残留 Chrome 进程导致实例合并）

**2.4 验证 CDP 端点可访问**

```bash
curl http://localhost:9222/json/version
```

- 预期结果：返回 JSON，包含 `webSocketDebuggerUrl` 字段
- 出错处理：返回空或超时，检查防火墙设置

### Phase 3：代码连接

**3.1 手动解析 WebSocket URL**

不要直接将 `http://localhost:9222` 传给 `connect_over_cdp()`，手动请求 `/json/version` 获取 WebSocket URL。

```python
import http.client
import json
from urllib.parse import urlparse

def resolve_cdp_ws_url(endpoint: str) -> str:
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
```

- 必须使用 `http.client`，不要使用 `urllib.request`（会走系统代理导致 502）
- 请求路径 `/json/version` 末尾不加斜杠

**3.2 连接 Chrome 并获取 context**

```python
from patchright.async_api import async_playwright

pw = await async_playwright().start()
ws_url = resolve_cdp_ws_url("http://localhost:9222")
browser = await pw.chromium.connect_over_cdp(ws_url)
ctx = browser.contexts[0]
```

- 必须使用 `browser.contexts[0]`，不要调用 `browser.new_context()`
- 预期结果：`ctx` 非空
- 出错处理：`browser.contexts` 为空列表时，在 Chrome 中手动打开任意页面后重试

### Phase 4：会话管理

**4.1 注入 cookies（如有保存的登录状态）**

```python
import json

storage_state_path = "storage_state.json"
try:
    with open(storage_state_path) as f:
        state = json.load(f)
    await ctx.add_cookies(state["cookies"])
except FileNotFoundError:
    pass  # 首次运行，无已保存状态
```

**4.2 保存会话状态（操作完成后）**

```python
state = await ctx.storage_state()
with open("storage_state.json", "w") as f:
    json.dump(state, f)
```

### Phase 5：执行自动化操作

**5.1 打开目标页面**

```python
page = await ctx.new_page()
await page.goto("https://creator.xiaohongshu.com")
```

**5.2 添加随机延迟**

每次点击、输入操作前加随机延迟，模拟人类操作节奏：

```python
import random
import asyncio

async def human_delay():
    await asyncio.sleep(random.uniform(0.5, 2.0))
```

**5.3 执行操作（示例：填写表单）**

```python
await human_delay()
await page.click("selector")

await human_delay()
await page.fill("selector", "内容")
```

**5.4 操作完成后关闭页面**

```python
await page.close()
```

不要调用 `browser.close()`，这会关闭用户的 Chrome。

## 关键规则（CDP 模式下的禁忌）

### DO

- 使用 `browser.contexts[0]` 获取已有 context
- 使用 `http.client` 请求本地 CDP 端点
- 使用 `ctx.add_cookies()` 注入登录状态
- 启动 Chrome 前确保所有 Chrome 进程已退出
- 指定 `--user-data-dir` 为非默认目录
- 每次操作加 `random.uniform(0.5, 2.0)` 随机延迟
- 手动解析 WebSocket URL 后传给 `connect_over_cdp()`

### DON'T

- **不要** 调用 `browser.new_context()` -- 新 context 缺少完整网络栈，导致 HTTPS 请求 `ERR_CONNECTION_CLOSED`
- **不要** 调用 `ctx.add_init_script()` -- 破坏页面初始化流程，导致后续网络栈异常
- **不要** 覆盖 User-Agent（`set_extra_http_headers` 或 `context_options["user_agent"]`）-- 与浏览器指纹不一致，反而更容易被检测
- **不要** 使用 `urllib.request` 请求 localhost -- 系统代理（ClashX/Surge/V2Ray）会导致 502
- **不要** 在默认 Chrome Profile 目录上启用调试端口 -- Chrome 136+ 拒绝此操作
- **不要** 在有残留 Chrome 进程时启动新实例 -- macOS 单实例合并会丢弃启动参数
- **不要** 调用 `browser.close()` -- 会关闭用户的真实 Chrome

## 故障排查速查表

| 现象 | 原因 | 解决 |
|------|------|------|
| 启动 Chrome 报 `DevTools remote debugging requires a non-default data directory` | Chrome 136+ 禁止在默认 Profile 上开调试端口 | 添加 `--user-data-dir` 指向非默认目录 |
| `lsof -i :9222` 无输出，端口未监听 | 已有 Chrome 进程运行，新实例被合并，启动参数被丢弃 | `pkill -f "Google Chrome"` 杀掉所有进程后重启 |
| `connect_over_cdp()` 报 `Unexpected status 400` | Patchright HTTP 发现请求 `/json/version/` 尾部多斜杠，Chrome 144 返回 400 | 手动用 `http.client` 请求 `/json/version` 获取 WebSocket URL 后直连 |
| `urllib.request` 请求 localhost 返回 502 | 系统代理（ClashX/Surge/V2Ray）拦截了 localhost 请求 | 改用 `http.client.HTTPConnection` 直连 |
| `new_context()` 后 HTTPS 请求全部 `ERR_CONNECTION_CLOSED` | 新 context 缺少 Chrome 原始网络栈配置（DNS、TLS、证书验证） | 不建新 context，使用 `browser.contexts[0]` |
| `add_init_script()` 后页面 `ERR_CONNECTION_CLOSED` | CDP 模式下该方法与 Chrome 原始初始化流程冲突，破坏网络栈 | CDP 模式下不调用 `add_init_script()`；`navigator.webdriver` 天然正常无需覆盖 |
| 覆盖 UA 后部分请求异常 | HTTP 头 UA 与 JS 层 `navigator.userAgent`/Client Hints 不一致，触发风控 | CDP 模式下不修改 User-Agent，使用 Chrome 原生 UA |
| 操作几次后被风控（验证码/频繁提示） | 操作节奏过于规律，被识别为机器行为 | 每次操作加 `random.uniform(0.5, 2.0)` 随机延迟 |
| 遇到无报错但行为异常的 bug | CDP 模式下某些 API 静默失败 | 二分法排查：注释一半代码运行，缩小范围直到定位具体行 |

## 附录：完整代码模板

```python
import asyncio
import http.client
import json
import random
from urllib.parse import urlparse

from patchright.async_api import async_playwright


# ============================================================
# CDP 连接工具
# ============================================================

def resolve_cdp_ws_url(endpoint: str) -> str:
    """手动解析 CDP WebSocket URL，绕过 Patchright 的 HTTP 发现 bug。
    使用 http.client 直连，不走系统代理。"""
    if endpoint.startswith("ws://") or endpoint.startswith("wss://"):
        return endpoint

    try:
        parsed = urlparse(endpoint)
        host = parsed.hostname or "127.0.0.1"
        port = parsed.port or 9222
        conn = http.client.HTTPConnection(host, port, timeout=5)
        conn.request("GET", "/json/version")  # 末尾不加斜杠
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


# ============================================================
# 浏览器上下文创建
# ============================================================

async def create_browser_context(
    cdp_endpoint: str = None,
    storage_state_path: str = "storage_state.json",
):
    """创建浏览器上下文。

    cdp_endpoint 非空时使用 CDP 模式连接已有 Chrome；
    为空时使用 Patchright launch() 模式启动新浏览器。
    """
    pw = await async_playwright().start()

    if cdp_endpoint:
        # ----- CDP 模式 -----
        ws_url = resolve_cdp_ws_url(cdp_endpoint)
        browser = await pw.chromium.connect_over_cdp(ws_url)
        ctx = browser.contexts[0]  # 使用已有 context，不要 new_context()

        # 注入 cookies
        try:
            with open(storage_state_path) as f:
                state = json.load(f)
            await ctx.add_cookies(state["cookies"])
        except FileNotFoundError:
            pass

        # CDP 模式禁止：
        #   - ctx.add_init_script()
        #   - 覆盖 User-Agent
        #   - browser.new_context()

    else:
        # ----- launch() 模式 -----
        browser = await pw.chromium.launch(headless=False)
        ctx = await browser.new_context(
            user_agent=(
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/144.0.0.0 Safari/537.36"
            ),
        )
        await ctx.add_init_script("""
            Object.defineProperty(navigator, 'webdriver', {
                get: () => undefined
            });
        """)

    return browser, ctx, pw


# ============================================================
# 随机延迟
# ============================================================

async def human_delay(min_sec: float = 0.5, max_sec: float = 2.0):
    """模拟人类操作的随机延迟。"""
    await asyncio.sleep(random.uniform(min_sec, max_sec))


# ============================================================
# 会话状态保存
# ============================================================

async def save_session(ctx, path: str = "storage_state.json"):
    """保存当前会话的 cookies 和 storage。"""
    state = await ctx.storage_state()
    with open(path, "w") as f:
        json.dump(state, f, ensure_ascii=False, indent=2)


# ============================================================
# 使用示例
# ============================================================

async def main():
    # 1. 连接 Chrome（确保已按 Phase 2 启动 Chrome）
    browser, ctx, pw = await create_browser_context(
        cdp_endpoint="http://localhost:9222"
    )

    # 2. 打开目标页面
    page = await ctx.new_page()
    await page.goto("https://creator.xiaohongshu.com")

    # 3. 执行自动化操作（根据实际需求编写）
    await human_delay()
    # await page.click("...")
    # await human_delay()
    # await page.fill("...", "内容")

    # 4. 保存会话状态
    await save_session(ctx)

    # 5. 关闭页面（不要调用 browser.close()）
    await page.close()

    # 6. 断开连接
    await pw.stop()


if __name__ == "__main__":
    asyncio.run(main())
```

### Chrome 启动脚本（macOS）

保存为 `start_chrome_cdp.sh`，每次运行前执行：

```bash
#!/bin/bash
set -e

PROFILE_DIR="$HOME/.config/rednote-toolkit/chrome-cdp-profile"
PORT=9222

# 1. 确保 Chrome 完全退出
if pgrep -f "Google Chrome" > /dev/null 2>&1; then
    echo "检测到 Chrome 正在运行，正在关闭..."
    pkill -f "Google Chrome"
    sleep 2
fi

# 2. 创建 Profile 目录
mkdir -p "$PROFILE_DIR"

# 3. 启动 Chrome
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --remote-debugging-port=$PORT \
  --user-data-dir="$PROFILE_DIR" \
  --no-first-run \
  --no-default-browser-check &

sleep 2

# 4. 确认端口在监听
if lsof -i :$PORT > /dev/null 2>&1; then
    echo "Chrome CDP 已启动，端口 $PORT 在监听"
    curl -s http://localhost:$PORT/json/version | python3 -m json.tool
else
    echo "错误：端口 $PORT 未监听，请检查 Chrome 是否正常启动"
    exit 1
fi
```
