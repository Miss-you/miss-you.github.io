---
title: "聊一聊 JSON 和 JSON 转义的那些事"
date: 2020-12-28T01:21:26+08:00
draft: true
---

# 聊一聊 JSON 和 JSON 转义的那些事

## 要点

写一下前情提要

> 思维导图

![](https://cdn.jsdelivr.net/gh/Miss-you/img/picgo/jsonescape.jpg)

> 适合人群：入门级

## JSON 转义

### 为什么需要 JSON 转义？

json 形如xxx

json 字符串构造方法通常使用序列化等接口构造

有人也会疑问，直接使用字符串拼接/字符串格式化的方法会有什么问题呢？

缺少json 转义流程，会导致json结构异常

例子


### json 转义是什么？

简而言之

一张图

![](https://cdn.jsdelivr.net/gh/Miss-you/img/picgo/20201228022357.png)

具体机制

1. a
2. b
3. c

> 在展开讲之前，复习一下json语法，忘记的可以查看，比较熟悉的可以直接跳过

## JSON 语法简介

> JSON我觉得很多人用，所以就仅仅介绍一下简单的语法，以供理解

### JSON是什么？

- JSON 指的是 JavaScript 对象表示法（JavaScript Object Notation）
- JSON 是轻量级的文本数据交换格式
- JSON 独立于语言 
- JSON 具有自我描述性，更易理解

JSON 使用 JavaScript 语法来描述数据对象，但是 JSON 仍然独立于语言和平台。JSON 解析器和 JSON 库支持许多不同的编程语言。

### JSON 应用领域

JSON最开始被广泛的应用于WEB应用的开发

RESTFUL API

相对于传统的关系型数据库，一些基于文档存储的NoSQL非关系型数据库选择JSON作为其数据存储格式，比较出名的产品有：MongoDB、CouchDB、RavenDB等。

### JSON语法规则

JSON语法简单来说就是四条：

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

### JSON名称/值对

JSON数据的书写格式是：名称：值，这样的一对。即名称在前，该名称的值在冒号后面。例如：

`"virteNBName":"virt1"`

这里的名称是**"virteNBName"**，值是**"virt1"**，他们均是字符串

名称和值得类型可以有以下几种：

- 数字（整数或浮点数）
- 字符串（在双引号中）
- 逻辑值（true 或 false）
- 数组（在方括号中）
- 对象（在花括号中）
- null

### JSON数据由逗号分隔

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

### JSON花括号保存对象

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

### JSON方括号保存数组

数组可包含多个对象：

```
	"eRAN":[
        {"eRANName":"eNB1", "eRANID":3002, "ctlPort":36412, "dataPort":2152},
        {"eRANName":"eNB2", "eRANID":10000, "ctlPort":36412, "dataPort":2152}
    ]
```
在上面的例子中，对象 "eRAN" 是包含2个对象的数组。每个对象代表一条基站的记录。

### JSON 转义

JSON交换时必须编码为UTF-8。[1]转义序列可以为：“\\”、“\"”、“\/”、“\b”、“\f”、“\n”、“\r”、“\t”，或Unicode16进制转义字符序列（\u后面跟随4位16进制数字）。对于不在基本多文种平面上的码位，必须用UTF-16代理对（surrogate pair）表示，例如对于Emoji字符—喜极而泣的表情U+1F602 😂 face with tears of joy在JSON中应表示为：

{ "face": "😂" }
// or
{ "face": "\uD83D\uDE02" }

### JSON 格式化工具

JSON格式取代了XML给网络传输带来了很大的便利，但是却没有了XML的一目了然，尤其是JSON数据很长的时候，会让人陷入繁琐复杂的数据节点查找中。开发者可以通过在线JSON格式化工具，来更方便的对JSON数据进行节点查找和解析。

### JSON 与其他格式的比较

#### vs XML

JSON与XML最大的不同在于XML是一个完整的标记语言，而JSON不是。这使得XML在程序判读上需要比较多的功夫。主要的原因在于XML的设计理念与JSON不同。XML利用标记语言的特性提供了绝佳的延展性（如XPath），在数据存储，扩展及高级检索方面具备对JSON的优势，而JSON则由于比XML更加小巧，以及浏览器的内建快速解析支持，使得其更适用于网络数据传输领域。

#### vs YAML


## 案例

## 拓展阅读和参考

https://www.json.org/json-en.html
https://en.wikipedia.org/wiki/JSON
