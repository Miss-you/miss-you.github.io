### **大纲：两步修复 Cursor“地区不可用”的网络问题**

**标题建议**：`两步解决 Cursor“模型地区不可用”：路由规则与代理设置实战`

**目标读者**：有代理使用经验、遇到 Cursor 网络问题的程序员。

**核心思路**：文章分为两大步，完全对应您提供的两个解决方案。读者可以按顺序操作，快速解决问题。然后，为有兴趣的读者提供原理解释和额外资源。

---

#### **1. 引言：问题所在与解决之道**

*   **钩子**：还在被 Cursor 的 “Model not available” 或 “This model provider doesn’t serve your region” 困扰吗？别担心，这并非你的网络问题，而是 Cursor 策略调整后的必然结果。
*   **点明核心**：问题根源有两个：
    1.  **IP 封锁**：Cursor 开始像 Claude/GPT 一样，限制部分地区 IP 的访问。
    2.  **应用直连**：Cursor 应用本身不会自动走系统代理，需要手动“指路”。
*   **承诺**：本文提供两步走的解决方案，只需复制粘贴一些配置，即可一劳永逸。

#### **2. Part 1: 快速修复指南 (The Actionable Fix)**

*   **第一步：配置代理路由规则，让流量“走对路”**
    *   **做什么**：在你的代理工具（以 Clash 为例）中，添加一系列域名规则，确保所有 Cursor 相关的请求都通过代理服务器转发。
    *   **为什么**：这是为了绕开 Cursor 对你本地 IP 的封锁。
    *   **具体操作（可直接复制）**：
        *   给出您提供的 Clash 规则列表：
          ```yaml
          # --- Cursor.sh Start ---
          # 核心 API (模型调用)
          - DOMAIN,api2.cursor.sh,PROXY
          - DOMAIN-SUFFIX,api2.cursor.sh,PROXY
          # 代码补全 & 其他 API
          - DOMAIN,api3.cursor.sh,PROXY
          - DOMAIN,api4.cursor.sh,PROXY
          # 代码库索引
          - DOMAIN-SUFFIX,repo42.cursor.sh,PROXY
          # 全球加速节点
          - DOMAIN-SUFFIX,gcpp.cursor.sh,PROXY
          # 扩展市场 & CDN
          - DOMAIN-SUFFIX,marketplace.cursorapi.com,PROXY
          - DOMAIN-SUFFIX,cursor-cdn.com,PROXY
          # 客户端自动更新
          - DOMAIN-SUFFIX,download.todesktop.com,PROXY
          # 通配符兜底 (关键)
          - DOMAIN-SUFFIX,cursor.sh,PROXY
          # --- Cursor.sh End ---
          ```
        *   *(注：这里的 `PROXY` 是示意，读者需换成自己的策略组名，如 `Claude`)*

*   **第二步：修改 Cursor 内部设置，强制应用“走代理”**
    *   **做什么**：打开 Cursor 的 `settings.json` 文件，添加三行关键配置。
    *   **为什么**：这是为了告诉 Cursor 应用：“嘿，你所有的网络请求，都必须经过我指定的这个本地代理端口！”
    *   **具体操作（可直接复制）**：
        1.  在 Cursor 中按 `Ctrl/⌘ + Shift + P`，搜索并打开 `Preferences: Open User Settings (JSON)`。
        2.  将以下三行代码粘贴进去：
            ```jsonc
            {
              // ... 你其他的设置
              "http.proxy": "http://127.0.0.1:7890",
              "http.proxySupport": "override",
              "cursor.general.disableHttp2": true
            }
            ```
        *   *(注：`7890` 是 Clash 默认端口，请根据自己的代理软件修改)*
    *   **关键提醒**：完成以上两步后，**彻底重启 Cursor**，问题即可解决。

#### **3. Part 2: 原理深挖 (The "Why")**

*   **为什么这三行设置缺一不可？**
    *   `"http.proxy"`：这是基础，告诉 Cursor 代理服务器的地址。
    *   `"http.proxySupport": "override"`：这是**强制命令**。标准 VS Code/Cursor 中，不是所有功能（特别是扩展）都会默认遵循代理。`override` 确保了包括 AI 功能在内的所有组件都被强制通过代理，防止“泄露”。
    *   `"cursor.general.disableHttp2": true"`：这是**最关键的“坑”**。Cursor (基于 Electron) 在处理 HTTP/2 请求时，存在一个 BUG，可能导致它绕过上面配置的代理，直接进行网络连接。禁用 HTTP/2，让所有请求回退到更稳定、更能被代理捕获的 HTTP/1.1，是保证不出问题的核心。

#### **4. 附录：资源与进阶**

*   **附录 A：我的完整 Clash 路由配置分享**
    *   在这里可以贴出您完整的、可以直接使用的 Clash 配置文件或片段，作为给读者的“福利”。
*   **附录 B：如何快速找到 `settings.json`**
    *   提供多种方法：UI 按钮、命令面板、各操作系统下的文件路径。

#### **5. 总结**

*   **回顾核心**：解决 Cursor 网络问题，只需两步——**外部加路由，内部改设置**。
*   **点睛之笔**：问题的关键在于，不仅要让流量走代理，还要通过特定设置（`override` 和 `disableHttp2`）确保 Cursor 这款应用“听话”，不耍花招。