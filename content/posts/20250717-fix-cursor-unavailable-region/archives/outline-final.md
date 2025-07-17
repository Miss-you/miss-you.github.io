# 解决Cursor网络限制问题：让AI编程助手重新工作

## 一、问题现象（5%）
- 错误提示："Model not available / This model provider doesn't serve your region"
- 背景：Cursor最近开始通过IP限制大陆和香港地区访问
- 影响：即使有VPN，Cursor仍然无法正常使用AI功能

## 二、2分钟快速解决方案（20%）
### 核心原理
- Cursor不会自动使用系统代理（与浏览器不同）
- 需要两步配置：代理路由规则 + Cursor内部设置

### 步骤1：配置代理路由规则
```yaml
# Clash配置示例
- DOMAIN,api2.cursor.sh,你的代理规则名
- DOMAIN,api3.cursor.sh,你的代理规则名
# （完整列表见下文）
```

### 步骤2：修改Cursor设置
打开 settings.json，添加三行关键配置：
```json
{
  "http.proxy": "http://127.0.0.1:7890",
  "cursor.general.disableHttp2": true,
  "http.proxySupport": "override"
}
```

### 验证是否成功
- 重启Cursor
- 测试AI对话功能
- 如未成功，查看故障排查部分

## 三、详细配置指南（40%）

### 1. 代理路由规则详解
#### 为什么需要配置这些域名？
- Cursor使用多个域名提供不同服务
- IP限制发生在这些域名的服务器端

#### 完整域名列表及说明
```yaml
# =======================
# Cursor 服务完整路由表
# =======================
# 核心 API ───────────
- DOMAIN,api2.cursor.sh,Claude        # 主要AI对话接口
- DOMAIN-SUFFIX,api2.cursor.sh,Claude

# Claude Tab (代码补全) ─
- DOMAIN,api3.cursor.sh,Claude        # 代码自动补全
- DOMAIN-SUFFIX,api3.cursor.sh,Claude
- DOMAIN,api4.cursor.sh,Claude        # 备用补全服务
- DOMAIN-SUFFIX,api4.cursor.sh,Claude

# 代码库索引 ──────────
- DOMAIN,repo42.cursor.sh,Claude      # 代码库分析服务
- DOMAIN-SUFFIX,repo42.cursor.sh,Claude

# 区域加速节点 ─────────
- DOMAIN,us-asia.gcpp.cursor.sh,Claude    # 亚洲加速节点
- DOMAIN-SUFFIX,us-asia.gcpp.cursor.sh,Claude
- DOMAIN,us-eu.gcpp.cursor.sh,Claude      # 欧洲加速节点
- DOMAIN-SUFFIX,us-eu.gcpp.cursor.sh,Claude
- DOMAIN,us-only.gcpp.cursor.sh,Claude    # 美国专用节点
- DOMAIN-SUFFIX,us-only.gcpp.cursor.sh,Claude

# 扩展市场 & CDN ───────
- DOMAIN,marketplace.cursorapi.com,Claude  # 插件市场
- DOMAIN-SUFFIX,marketplace.cursorapi.com,Claude
- DOMAIN-SUFFIX,cursor-cdn.com,Claude      # 静态资源CDN

# 客户端自动更新 ───────
- DOMAIN,download.todesktop.com,Claude     # 软件更新服务
- DOMAIN-SUFFIX,download.todesktop.com,Claude

# 通配符兜底 ──────────
- DOMAIN-SUFFIX,cursor.sh,Claude           # 覆盖所有*.cursor.sh
```

#### 其他代理软件配置方法
- Surge配置方法
- V2Ray配置方法
- 其他主流代理软件配置示例

### 2. Cursor代理设置深度解析

#### 为什么需要这三行配置？
1. **`"http.proxy": "http://127.0.0.1:7890"`**
   - 基础代理设置，指向本地代理端口
   - 7890是Clash默认端口，根据你的代理软件调整

2. **`"cursor.general.disableHttp2": true`**（关键！）
   - 禁用HTTP/2协议
   - 原因：HTTP/2在某些情况下会绕过代理设置
   - 社区验证：这是解决问题的关键配置

3. **`"http.proxySupport": "override"`**（必需！）
   - 强制所有请求使用代理
   - 确保Cursor内部所有模块都遵循代理设置

#### 如何找到并修改settings.json
- Windows: `%APPDATA%\Cursor\User\settings.json`
- macOS: `~/Library/Application Support/Cursor/User/settings.json`
- Linux: `~/.config/Cursor/User/settings.json`

#### 图文操作指南
1. 打开Cursor设置的三种方法
2. 定位到正确的配置位置
3. 正确的JSON格式示例

## 四、进阶内容与原理（35%）

### 技术原理深度解析
#### Cursor的网络架构
- 基于Electron框架
- 与浏览器的网络行为差异
- 为什么不会自动使用系统代理

#### IP限制的实现机制
- 服务端如何识别用户地区
- 为什么简单的VPN可能无效
- 代理链路的完整流程

### 故障排查指南
#### 常见问题及解决
1. 配置后仍然无法连接
   - 检查代理软件是否正常运行
   - 验证代理端口是否正确
   - 使用`curl`命令测试代理连通性

2. 部分功能可用，部分功能失效
   - 可能遗漏了某些域名
   - 检查日志定位具体失败的请求

3. 连接不稳定或速度慢
   - 代理节点选择建议
   - 优化网络延迟的技巧

#### 诊断工具使用
- Cursor内置诊断：Help → Run Diagnostics
- 网络抓包分析方法
- 日志文件位置和解读

### 举一反三：其他应用的类似问题
#### 同类Electron应用
- VS Code的网络配置
- 其他AI编程工具的代理设置

#### 通用代理配置技巧
- 如何判断应用是否使用系统代理
- 常见的代理配置模式
- 企业网络环境下的特殊处理

### 扩展阅读
#### 我的完整AI工具代理配置
- Claude官网访问配置
- ChatGPT相关域名
- 其他主流AI服务的路由规则

#### 安全性考虑
- 使用代理的隐私风险
- 如何选择可信的代理服务
- API Key的安全管理

## 五、总结与资源（5%）
### 核心要点回顾
- 两步解决：代理路由 + Cursor设置
- 三个关键配置缺一不可
- 完整域名列表可直接复制使用

### 社区资源
- Cursor官方论坛相关讨论
- GitHub Issue追踪
- 配置文件模板下载

### 更新维护
- 如何关注域名列表更新
- 加入讨论群组
- 反馈问题渠道