---
title: "聊一聊 JSON 和 JSON 转义的那些事"
date: 2020-12-28T01:21:26+08:00
draft: false
author: "[厉辉（Yousa）](https://github.com/Miss-you)"
tags: ["code"]
---

# 聊一聊 JSON 和 JSON 转义的那些事

[TOC]

> 适合人群：入门级

## JSON 和 JSON 转义

21 世纪初，Douglas Crockford 寻找一种简便的数据交换格式，能够在服务器之间交换数据。当时通用的数据交换语言是 XML，但是 Douglas Crockford 觉得 XML 的生成和解析都太麻烦，所以他提出了一种简化格式，也就是 JSON。

JSON 其结构形如 `{"云原生":"Kubernetes"}`，可以很直观的使用字符串表示对象或数据结构。对象或数据结构使用序列化接口转换成 JSON 字符串，比如 Golang 中的`json.Marshal`接口。

你可能会有这样的疑问：既然 JSON 字符串结构简单，为什么不直接使用字符串拼接的方式，而是要使用 JSON 序列化接口呢？

结果显而易见：JSON 序列化接口会一并将数据中的特殊字符进行转义，防止其破坏 JSON 原有结构。比如数据中含有双引号`"`特殊字符，序列化接口便会对双引号进行转义，最终结果类似于`{"云原生":"\"Kubernetes\""}`，否则，该场景下直接拼接的字符串会非法。

### JSON 转义

许多程序设计语言把双引号字符`（"）`用作字符串的分界符。反斜线`（\）`转义字符提供了两种方式来把双引号字符置入字符串中，或者是使用转义序列`\"`表示单个的`"`字符本身，而不是作为字符串分界符；或者是直接开始字符`"`的 16 进制编码值的转义序列`\x22`来表示`"`，也可以使用 8 进制编码值的转义序列，如`\042`。

在 Python 中，下面的代码将会产生语法错误

```
print "Cloud Navite "Hello World!".";
```

而另一段 Python 代码则会产生符合预期的结果

```
print "Cloud Navite \"Hello World!\".";
```

在 JSON 中，也是如此：当使用 json 接口解析字符串`{"云原生":""Kubernetes""}`时会报错，而解析经过转义的 JSON 字符串`{"云原生":"\"Kubernetes\""}`则会解析成功。

JSON 转义机制如下图：

![](https://cdn.jsdelivr.net/gh/Miss-you/img/picgo/20201228022357.png)

1. JSON 中字符串针对于特殊字符需要 JSON 转义，它使用反斜杠`\`进行转义
2. JSON 序列包括`“\\、\"、\/、\b、\f、\n、\r、\t`，或者 Unicode16 进制转义字符（比如`\uD83D\uDE02`)
3. JSON 字符串为 UTF-8 编码

### JSON 语法

> 在讲具体案例之前，复习一下 JSON 语法，忘记的可以翻阅该章节。

JSON 语法简单来说就是四条：

- 数据在名称/值对中
- 数据由逗号分隔
- 花括号保存对象
- 方括号保存数组

> 声明：以下使用的对象均来自于以下内容

```
{
    "virtualeNB":[
        {"virteNBName":"virt1", "virteNBNum":5, "begineNBID":0, "beginCtlPort":6000, "beginDataPort":7000, "virtIPNum":5},
        {"virteNBName":"virt2", "virteNBNum":10, "begineNBID":10, "beginCtlPort":6000, "beginDataPort":7000, "virtIPNum":10}
    ],
    "eRAN":[
        {"eRANName":"eNB1", "eRANID":3002, "ctlPort":36412, "dataPort":2152},
        {"eRANName":"eNB2", "eRANID":10000, "ctlPort":36412, "dataPort":2152}
    ]
}
```

##### 1. JSON 名称/值对

JSON 数据的书写格式是：名称：值，这样的一对。即名称在前，该名称的值在冒号后面。例如：

```
"virteNBName":"virt1"
```

这里的名称是`"virteNBName"`，值是`"virt1"`，他们均是字符串

名称和值得类型可以有以下几种：

- 数字（整数或浮点数）
- 字符串（在双引号中）
- 逻辑值（true 或 false）
- 数组（在方括号中）
- 对象（在花括号中）
- null

#### 2. JSON 数据由逗号分隔

譬如：

`"virteNBName":"virt1", "virteNBNum":5, "begineNBID":0`这几个对象之间就是使用逗号分隔。

数组内的对象之间当然也是要用逗号分隔。只要是对象之间，分隔就是用逗号`,`。但是，要注意，对象结束的时候，不要加逗号。数组内也是，例如：

```
[
    {"eRANName":"eNB1", "eRANID":3002, "ctlPort":36412, "dataPort":2152},
    {"eRANName":"eNB2", "eRANID":10000, "ctlPort":36412, "dataPort":2152},
]
```

上面这个就是错误的，因为在数组中，两个对象之间需要逗号，但是到这个数组末尾了，不需要加逗号了。

#### 3. JSON 花括号保存对象

对象可以包含多个名称/值对，如：

```
{"eRANName":"eNB1", "eRANID":3002, "ctlPort":36412, "dataPort":2152}
```

这一点也容易理解，与这条 JavaScript 语句等价：

```
"eRANName" = "eNB1"
"eRANID" = 3002
"ctlPort" = 36412
"dataPort" = 2152
```

#### 4. JSON 方括号保存数组

数组可包含多个对象：

```
"eRAN":[
    {"eRANName":"eNB1", "eRANID":3002, "ctlPort":36412, "dataPort":2152},
    {"eRANName":"eNB2", "eRANID":10000, "ctlPort":36412, "dataPort":2152}
]
```

在上面的例子中，对象 "eRAN" 是包含 2 个对象的数组。每个对象代表一条基站的记录。

上面四条规则，就是 JSON 格式的所有内容。

## 案例

### 一个由特殊字符导致 JSON 格式的 Nginx 访问日志/日志系统的 BUG

访问日志 `access_log`：Nginx 会将每个客户端访问其本身的请求以日志的形式记录到指定的日志文件里，以供分析用户的浏览或请求行为，或者可以用于快速分析故障所在。此功能由 `ngx_http_log_module` 模块负责。

在 Nginx 文件中，访问日志 `access.log` 配置形如下文的格式：

```
log_format  main  '$remote_addr [$time_local] "$request" '
                    '$status $bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
access_log  logs/access.log  main buffer=32k;
```

- `logs/access.log` 指定访问日志路径
- `log_format` 定义访问日志格式
- `buffer=32k` 是日志缓冲区大小

访问日志 `access_log` 其通过格式化输出 `nginx` 变量以及拼接字符串的方式打印日志。

在云原生时代，Nginx 运维的最佳实践之一就是将 Nginx 访问日志采用 EFK 架构 `(Elasticsearch+Filebeat+Kibana)`，通过收集和管理访问日志，提供统一的检索功能，这样做不仅可以提高诊断效率，而且可以全面了解系统情况，避免被动事后救火。

通常，为了方便分析，会将 Nginx 访问日志输出为 JSON 字符串，其配置如下：

```
log_format  main  '{"remote_addr":"$remote_addr","time_local":"$time_local","request":"$request",'
                    '"status":"$status","bytes_sent":"$bytes_sent","http_referer":"$http_referer",'
                    '"http_user_agent":"$http_user_agent","http_x_forwarded_for":"$http_x_forwarded_for"}';
access_log  logs/access.log  main buffer=32k;
```

乍一看，这样的配置没什么问题。但再深入思考，生成 JSON 字符串的标准做法是调用 JSON 序列化接口，而 Nginx 访问日志是直接格式化拼接字符串，故一旦访问日志中出现特殊字符（比如双引号`"`），就会导致整行访问日志解析出错，影响接下来的日志分析系统对访问日志的数据查找、服务诊断和数据分析。

为了解决 JSON 转义的问题，Nginx 在 1.11.8 版本中给日志格式 `log_format` 新增了序列化配置 `escape=json`，其格式为：

```
Syntax:	log_format name [escape=default|json|none] string ...;
Default:	
log_format combined "...";
Context:	http
```

当配置为 `escape=json` 时，JSON 字符串中所有不允许的字符都将被转义：

- `"`和`/`字符被转义为`/"`和`//`
- 值小于 32 的字符被转义`“\n”, “\r”, “\t”, “\b”, “\f”, or “\u00XX”`

所以，正确的 `log_format` 配置为

```
log_format  main  escape=json '{"remote_addr":"$remote_addr","time_local":"$time_local","request":"$request",'
                    '"status":"$status","bytes_sent":"$bytes_sent","http_referer":"$http_referer",'
                    '"http_user_agent":"$http_user_agent","http_x_forwarded_for":"$http_x_forwarded_for"}';
```

当然，因为 JSON 转义导致的 BUG 不止这一个，近期遇到的另一个 BUG 也是因为前人实现的代码实现不规范，其逻辑是将收到的请求以字符串拼接的方式构造 JSON 串，导致一旦请求中带有双引号`"`或其他特殊字符，就必定出现 BUG。

## JSON 与其他格式的比较

### JSON vs XML

JSON 与 XML 最大的不同在于 XML 是一个完整的标记语言，而 JSON 不是。这使得 XML 在程序判读上需要比较多的功夫。主要的原因在于 XML 的设计理念与 JSON 不同。XML 利用标记语言的特性提供了绝佳的延展性（如 XPath），在数据存储，扩展及高级检索方面具备对 JSON 的优势，而 JSON 则由于比 XML 更加小巧，以及浏览器的内建快速解析支持，使得其更适用于网络数据传输领域。

从转义角度来看，XML 标签名不能包含任何字符`!"#$%&'()*+,/;<=>?@[\]^{|}~`，也不能包含空格字符，不能以`-`、`.`或数字数字开头，而 JSON 键可以（引号和反斜杠必须转义）。

### JSON vs YAML

JSON 格式简单易上手，但没有了 YAML 的一目了然，尤其是 JSON 数据很长的时候，会让人陷入繁琐复杂的数据节点查找中。通常我会使用在线 JSON 格式化工具，来更方便的对 JSON 数据进行节点查找和解析。

个人认为，YAML 几乎将 JSON 秒成渣渣，这里直接引用公司内部大佬的一个关于 YAML 的总结：

- YAML 的可读性好
- YAML 和脚本语言的交互性好
- YAML 使用实现语言的数据类型
- YAML 有一个一致的信息模型
- YAML 易于实现
- YAML 可以基于流来处理
- YAML 表达能力强，扩展性好
- YAML 可以写注释

## There Is One More Thing

从结构上看，不仅仅是 JSON、YAML、XML，大部分或者所有的数据（data）最终都可以分解成三种类型：

第一种类型是标量（scalar），也就是一个单独的字符串（string）或数字（numbers），比如`"云原生"`这个单独的词。

第二种类型是序列（sequence），也就是若干个相关的数据按照一定顺序并列在一起，又叫做数组（array）或列表（List），比如`["Kubernetes", "Istio"]`。

第三种类型是映射（mapping），也就是一个名/值对（Name/value），即数据有一个名称，还有一个与之相对应的值，这又称作散列（hash）或字典（dictionary），比如`"CloudNative": "Kubernetes"`。

## 参考

- [JSON 官网](https://www.json.org/json-en.html)
- [JSON 维基百科](https://en.wikipedia.org/wiki/JSON)
- [数据类型和 Json 格式--阮一峰](http://www.ruanyifeng.com/blog/2009/05/data_types_and_json.html)
- [YAML Ain’t Markup Language (YAML™) Version 1.1](https://yaml.org/spec/1.1/index.html)
- [World Wide Web Consortium](https://www.w3.org/TR/xml11/)
- [自己最初了解 JSON 时总结的一篇文章](https://blog.csdn.net/qq_15437667/article/details/50957996)