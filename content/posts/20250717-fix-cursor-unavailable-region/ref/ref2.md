下面一步一步教你在 **Cursor** 里找到并修改 `settings.json`，以手动加入代理、关闭 HTTP/2 等常见网络配置。整套流程与 VS Code 几乎一致，只是界面颜色和快捷键稍有不同。

---

## 快速概览

1. **打开 settings.json**：可用「齿轮 ⚙」→ **Settings**，再点右上 `{}` 图标；或直接按 `Ctrl + Shift + P`（macOS `⌘ + Shift + P`）并输入 “Open Settings (JSON)” ([Stack Overflow][1])。
2. **文件路径**：和 VS Code 相同——Windows 在 `%APPDATA%\Code\User\settings.json`，macOS 在 `~/Library/Application Support/Code/User/settings.json`，Linux 在 `~/.config/Code/User/settings.json` ([Stack Overflow][2])。
3. **写入网络相关键值**（示例见下）；**不要**把 `http_proxy:` 或 `https_proxy:` 环境变量名抄进去，只留 URL。
4. 建议同时加入 `"http.proxySupport": "override"`，并在需要时加 `"cursor.general.disableHttp2": true` 来保证请求都走代理且避开 HTTP/2 绕行问题。
5. 保存文件，**重启 Cursor**；若仍无法连通，可在 Help → Run Diagnostics 查看是否还报 *Proxy Refused* 或 *TLS handshake failed* ([Cursor - Community Forum][3])。

---

## 1 | 三种方式打开 settings.json

| 方法         | 步骤                                                                                             | 说明                             |
| ---------- | ---------------------------------------------------------------------------------------------- | ------------------------------ |
| **界面按钮**   | ① 左下角齿轮 ⚙ → **Settings** <br>② 页面右上有「{} Open Settings (JSON)」图标，点开即是                           | 最直观                            |
| **命令面板**   | `Ctrl + Shift + P`（macOS ⌘）→ 输入 `settings json` → 选 **Preferences: Open User Settings (JSON)** | 官方推荐快捷方式 ([Stack Overflow][1]) |
| **直接编辑文件** | 在系统文件管理器里定位到路径（见下一节）后用任何编辑器打开                                                                  | 适合脚本或批量部署                      |

---

## 2 | `settings.json` 所在路径

| 操作系统        | 默认位置                                                    |
| ----------- | ------------------------------------------------------- |
| **Windows** | `%APPDATA%\Code\User\settings.json`                     |
| **macOS**   | `~/Library/Application Support/Code/User/settings.json` |
| **Linux**   | `~/.config/Code/User/settings.json`                     |

> Cursor 沿用了 VS Code 的配置目录结构，所以路径完全兼容 ([Stack Overflow][2])。如果你之前在 VS Code 中已有自定义设置，首次启动 Cursor 可在 **Settings → General → Import from VS Code** 直接导入 ([Cursor][4])。

---

## 3 | 常见网络相关键值示例

```jsonc
{
  // ① 全局 HTTP/HTTPS 代理 —— 只写 URL！
  "http.proxy": "http://127.0.0.1:7890",

  // ② 强制所有扩展/请求都走上面代理
  "http.proxySupport": "override",

  // ③ 如果企业/校园网或代理不支持 HTTP/2，可加这一行
  "cursor.general.disableHttp2": true,

  // ④ 遇到自签名证书，可按需放宽
  // "http.proxyStrictSSL": false,
  // "http.systemCertificates": true
}
```

* **为何要加 `"http.proxySupport": "override"`？**
  VS Code 1.31+ 才默认让扩展遵循代理设置；为了确保 Cursor 内部 AI 连接也生效，社区经验建议写成 `override` ([Gist][5], [Visual Studio Code][6])。
* **为何要关 HTTP/2？**
  多位用户实测 Electron 会在 HTTP/2 情况下绕过代理，导致 api2.cursor.sh 直接出网而失败；关掉即可强制回到 HTTP/1.1 ([Cursor - Community Forum][7], [Cursor - Community Forum][3])。
* **不要把 `https_proxy:` 写进去**
  这会触发 Cursor/VS Code 对值的正则校验，报 “Value must match regex …”，因为设置项已经是键名，值只能是协议 URL ([Cursor - Community Forum][8], [Stack Overflow][9])。

---

## 4 | 保存‑重启‑验证

1. 保存 `settings.json` 后，**重启 Cursor**（`Ctrl + Shift + Q` → Reload Window 或直接退出再开）。
2. 点菜单 **Help → Run Diagnostics**，确认 *Proxy: OK*，并检查是否仍有 *TLS handshake failed* 或 *HTTP/2* 相关报错 ([Cursor - Community Forum][3])。
3. 仍失败 → 检查 VPN/Clash 是否在 **TUN 全局模式**，确保 `api2.cursor.sh`、`api.anthropic.com` 等域名出口 IP 位于支持地区 ([Cursor - Community Forum][10])。

---

## 5 | 进阶技巧

* **环境变量法**：若你习惯在终端里 `export HTTP_PROXY=...`，可省掉 `http.proxy`，但 `settings.json` 优先级更高。
* **多环境切换**：把不同代理配置保存成多份 `settings-*.json`，用脚本复制为正式 `settings.json` 后再启动 Cursor，实现一键换节点。
* **同步设置**：登录同一个 Cursor 账号，`settings.json` 会自动云同步；但包含明文密码的代理 URL 不会同步，需在各端重设。

---

### 一句话总结

只要**定位正确的 settings.json**、**写入干净的代理 URL**，并辅以 `"proxySupport": "override"` 和（必要时） `"disableHttp2": true`，再重启 Cursor，就能让所有模型调用稳定走你指定的代理或 VPN。若诊断日志依旧告警，多半是出口 IP 仍被模型方封锁或代理证书未被信任，按提示逐项排查即可。

[1]: https://stackoverflow.com/questions/65908987/how-to-open-visual-studio-codes-settings-json-file?utm_source=chatgpt.com "How to open Visual Studio Code's 'settings.json' file - Stack Overflow"
[2]: https://stackoverflow.com/questions/53840644/location-of-vs-code-preferences?utm_source=chatgpt.com "Location of VS Code preferences - Stack Overflow"
[3]: https://forum.cursor.com/t/unable-to-chat-when-disable-http-2/53805?utm_source=chatgpt.com "Unable to chat when disable http/2 - Cursor - Community Forum"
[4]: https://docs.cursor.com/guides/migration/vscode?utm_source=chatgpt.com "VS Code - Cursor Docs"
[5]: https://gist.github.com/tsinis/f9d4cef8da42ce2a7a21a10b7512222d?utm_source=chatgpt.com "Visual Studio Code default settings - GitHub Gist"
[6]: https://code.visualstudio.com/updates/v1_31?utm_source=chatgpt.com "January 2019 (version 1.31) - Visual Studio Code"
[7]: https://forum.cursor.com/t/cursor-tab-not-working-usage-of-http-2-despite-having-it-disabled/25455?utm_source=chatgpt.com "Cursor Tab not working. Usage of HTTP/2 despite having it disabled"
[8]: https://forum.cursor.com/t/how-to-add-the-proxy-cursor/11092?utm_source=chatgpt.com "How to add the proxy cursor? - Discussion"
[9]: https://stackoverflow.com/questions/71307949/how-do-you-fix-proxy-issue-in-visual-studio-code?utm_source=chatgpt.com "How do you fix proxy issue in Visual Studio Code? - Stack Overflow"
[10]: https://forum.cursor.com/t/how-to-set-up-a-proxy-for-cursor/83585?utm_source=chatgpt.com "How to set up a proxy for cursor"
