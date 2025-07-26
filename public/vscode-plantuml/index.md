# 使用 VS CODE+PlantUML 高效画图


#使用 VS CODE+PlantUML 高效画图

> 自从发现了 plantuml 写脚本画图的方式之后，爱上了画图~

> 环境：MAC

##前言

本文多数内容引用自官网文档和其他人的教程，并非本人原创，也谈不上翻译，只是把自己 理解的东西用中文写出来。

##什么是 PLANTUML

PlantUML 是一个快速创建 UML 图形的组件，官网上之所以称它是一个组件，我想主要是因为多数情况下我们都是在 Eclipse、NetBenas、Intellijidea、 Emacs、Word、VS CODE、Sublime 等软件里来使用 PlantUML（参看各软件相关配置）。

PlantUML 支持的图形有：

- sequence diagram,
- use case diagram,
- class diagram,
- activity diagram (here is the new syntax),
- component diagram,
- state diagram,
- object diagram,
- wireframe graphical interface

PlantUML 通过简单和直观的语言来定义图形，它可以生成 PNG、SVG 和二进制 图片。下面是一个简单的示例：

```
@startuml

Bob -> Alice : Hello, how are you
Alice -> Bob : Fine, thank you, and you?

@enduml
```

![这里写图片描述](https://img-blog.csdnimg.cn/img_convert/b62e13cc25c6d0cac5cbc21c362a6c79.png)

##安装 plantuml

plantuml 实际上是安装的插件（VS CODE 插件），需要 graphviz 渲染画图，以及需要安装 java 支撑 plantuml 运行

1. 首先你需要安装 VS CODE，一般都有
2. 安装 plantuml 插件
3. 去 [graphviz 官网](http://graphviz.org/) 下载其安装包
4. 安装 java

安装好之后，新建一个文件，使用上面的示例，拷贝之后，在 win32 下是 alt+d，mac 下是 command+d 即可生成相关 uml 图

##将脚本导出成图片

在脚本处右键，即有导出图片的选项

##语法

语法可以参照这篇文章，非常详细

http://archive.3zso.com/archives/plantuml-quickstart.html#sec-5-1

或者想快速用可以参考这篇，比较简略

http://www.jianshu.com/p/e92a52770832
