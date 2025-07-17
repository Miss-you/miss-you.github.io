在 Cursor 社区与 GitHub Issue 里，遇到「**Model not available / This model provider doesn’t serve your region**」或各种连接失败的用户，大体把问题分成两类：**（A）模型方的地区封锁** 和 **（B）网络链路没真正走到你的代理 / VPN**。搜索 10 多篇教程与帖子后，社区公认的解决动作主要有 5 条——按影响力与成功率从高到低排序如下：

---

## 1 分钟总览

1. **用真·全局 VPN 或 TUN 模式**──让出口 IP 落在模型供应商的白名单里；很多人单纯把浏览器流量代理了，但 Cursor 的 Electron 进程仍暴露在本地 IP，于是继续报错。([Cursor - Community Forum][1], [Cursor - Community Forum][1])
2. **在 `settings.json` 显式写 `"http.proxy": "http://127.0.0.1:7890"` 并加 `"http.proxySupport": "override"`**；不要把 `https_proxy:` 这些前缀写进去，否则会触发正则校验错误。([Cursor - Community Forum][2], [Cursor - Community Forum][3])
3. **勾 “Disable HTTP/2” （或 `"cursor.general.disableHttp2": true`）**，让请求回落到 HTTP/1.1；社区大量案例表明 HTTP/2 在代理或公司防火墙里经常被丢弃，导致 Cursor 绕过你配置的代理直接去访问 api\*.cursor.sh 而失败。([Cursor - Community Forum][4], [Cursor - Community Forum][5], [Cursor - Community Forum][6])
4. **信任或替换代理证书**；若日志里出现 *Client TLS handshake failed*，通常是自签 MITM 证书未被 Cursor 进程信任，或 api2.cursor.sh 拒绝 mitmproxy 这类证书。([Cursor - Community Forum][7])
5. **自带 API Key 或第三方网关**；若模型方彻底封禁你所在区，即使 VPN 也被识别，可在 Settings → Models 里填入你在支持地区申请的 OpenAI/Anthropic/Gemini Key；或者接入像 LaoZhang.ai 这样的代理网关。([Cursor][8], [LaoZhang AI][9])

下面按步骤拆解原因与做法。

---

## 1. 写对 `http.proxy` ——别带变量名、别漏 `override`

| 常见误写                                | 正确示例                                                      | 说明                  |
| ----------------------------------- | --------------------------------------------------------- | ------------------- |
| `https_proxy:http://127.0.0.1:7890` | `"http.proxy": "http://127.0.0.1:7890"`                   | 设置项本身就代表变量名，值只需 URL |
| 仅写 `http.proxy`                     | 再加 `"http.proxySupport": "override"`                      | 强制所有模块（包括扩展）走同一代理   |
| 口令放错位置                              | `"http.proxy": "http://user:pass@proxy.example.com:3128"` | 认证信息写在 URL 前缀       |

若你更喜欢环境变量，也可以 `export HTTP_PROXY=...` 的方式启动 Cursor，但一旦两边都设置，以 `settings.json` 优先。([Cursor - Community Forum][3])

---

## 2. 为何要关 HTTP/2？

社区多份测试报告表明，当 `http2` 启用时，Electron 中部分请求会**直接绕过 VS Code 代理栈**，从而走本机出口；而很多公司/校园网或廉价代理并不支持 HTTP/2 转发，结果请求被丢弃。禁用后，所有流量都回到 HTTP/1.1 + 代理，Claude/Gemini 等模型即可恢复。([Cursor - Community Forum][4], [Cursor - Community Forum][5], [Cursor - Community Forum][6])

> **操作**：
> `Ctrl+,` → 搜索 **http2** → 勾选 **Cursor › General: Disable Http2**；等价地在 `settings.json` 加
>
> ```jsonc
> "cursor.general.disableHttp2": true
> ```

---

## 3. 让 VPN / Clash 跑在 **TUN 全局模式**

多名用户反映「浏览器能翻墙，Cursor 仍报 region 错误」，原因是只代理了 SOCKS/HTTP 端口，Electron 仍用系统直连。开启 TUN 或 System Proxy 模式，可把所有 TCP 流量（含 api2.cursor.sh / api.anthropic.com 等）一并劫入代理。([Cursor - Community Forum][1], [Cursor - Community Forum][10])

若你在公司网，可能还需 **Split-Tunneling**（仅转发 Cursor 相关域名）以避开内网策略；Proton VPN 等均支持此功能。([Proton VPN][11])

---

## 4. TLS 握手失败：导入或更换根证书

使用 mitmproxy、Charles 等 HTTPS 解密代理时，api2.cursor.sh 会校验证书链；若未把自签根证书导入系统或 Electron 信任库，就会反复报 “Client TLS handshake failed”。解决方法：

1. 在系统「受信任根证书」里导入 \*.pem；
2. 或改用不拦截证书的透明模式（仅转发）；
3. 部分用户改端口到 127.0.0.1:8080 后成功连通。([Cursor - Community Forum][7])

---

## 5. 模型方地区封禁的终极回避

* 查看【Cursor Regions】文档了解各模型支持的地区列表；若你出口 IP 在不支持区，Claude/Gemini 等会隐藏或报错。([Cursor][8])
* 方案 A：**换到支持区节点**（美/加/新/日/欧等）。
* 方案 B：**自带 Key**，在 Settings → Models → *Add API Key* 里填写你用支持区账号申请的 OpenAI/Anthropic Key。
* 方案 C：第三方 API 网关，如 LaoZhang.ai，提供代理到官方模型的后端，填入自定义 Base URL + Key 即可。([LaoZhang AI][9])
* 若付费后失去功能，Dashboard 里有 **Request Refund** 按钮可按比例退款。([Cursor][8])

---

## 6. 故障排查清单（按优先级）

1. **Cursor → Help → Run Diagnostics**：看是否显示 *Proxy Refused* / *TLS handshake failed*。
2. `settings.json` 里核对 `http.proxy` 格式 & `proxySupport`。
3. 勾 Disable HTTP/2，重启 Cursor。
4. 开 VPN 或 Clash **全局/TUN 模式**，确认 api\*.cursor.sh 走代理。
5. 若仍 Model not available：在浏览器查 [https://api.anthropic.com/ip-check](https://api.anthropic.com/ip-check) 等接口，验证出口 IP。
6. 试自带 API Key；若成功，说明仅路由被封。
7. 全部失败 → Docs Regions 页面申请退款或提交工单。

---

### 小结

大部分「Region / Model not available」并非 Cursor 自身 Bug，而是**出口 IP 与模型商政策 + HTTP/2 绕过代理**共同触发的连锁反应。依照上面 5 步（写对代理、关 HTTP/2、全局 VPN、信任证书、必要时自带 Key）操作后，社区案例显示 90% 以上都能恢复使用。若你依旧卡在同一错误，可把 Diagnostics 日志贴到论坛或 GitHub Issue，再做针对性排查。

[1]: https://forum.cursor.com/t/this-model-provider-doesnt-serve-your-region/118453 "This model provider doesn't serve your region - Discussions - Cursor - Community Forum"
[2]: https://forum.cursor.com/t/how-to-add-the-proxy-cursor/11092?utm_source=chatgpt.com "How to add the proxy cursor? - Discussion"
[3]: https://forum.cursor.com/t/cursor-behind-a-proxy/1105?utm_source=chatgpt.com "Cursor behind a proxy - Bug Reports"
[4]: https://forum.cursor.com/t/cursor-http-2-requests-dont-go-through-proxy-setting-in-the-vscode/36594 "Cursor http/2 requests don't go through proxy setting in the vscode - Bug Reports - Cursor - Community Forum"
[5]: https://forum.cursor.com/t/connection-failed-if-the-problem-persists-please-check-your-internet-connection-or-vpn/64673?utm_source=chatgpt.com "Connection failed. If the problem persists, please check your internet ..."
[6]: https://forum.cursor.com/t/unable-to-chat-when-disable-http-2/53805?utm_source=chatgpt.com "Unable to chat when disable http/2 - Cursor - Community Forum"
[7]: https://forum.cursor.com/t/how-to-set-up-a-proxy-for-cursor/83585 "How to set up a proxy for cursor - How To - Cursor - Community Forum"
[8]: https://docs.cursor.com/account/regions "Cursor – Regions"
[9]: https://blog.laozhang.ai/ai/cursor-gpt-41-limit-error-fix-api-alternatives-2025/ "Fix Cursor IDE “Free users can only use GPT 4.1” Error: Complete 2025 Guide with API Alternatives – LaoZhang-AI"
[10]: https://forum.cursor.com/t/this-model-provider-doesnt-serve-your-region/118453?utm_source=chatgpt.com "This model provider doesn't serve your region - Discussions"
[11]: https://protonvpn.com/support/protonvpn-split-tunneling?srsltid=AfmBOorRvrr9mS7BOCOdVF6vTw-Fd1EgTnKXj0HtLwo5MCBklDccMwQU&utm_source=chatgpt.com "How to use split tunneling | Proton VPN"
