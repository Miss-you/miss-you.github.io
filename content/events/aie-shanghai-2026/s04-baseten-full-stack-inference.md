---
title: "Full-Stack Inference Engineering: Latency, Throughput and Cost"
slug: "s04-baseten-full-stack-inference"
date: 2026-11-05T11:10:00+08:00
lang: zh
session: "S04"
speaker: "Chen Wang"
org: "Baseten"
stage: "主舞台"
summary: "做好开放模型推理要先定延迟、吞吐、成本的取舍，再把单 GPU 引擎优化和跨云集群调度叠起来，每一层都必要但单靠哪一层都不够。"
video: ""
source: "user-recording"
draft: false
---

据作者现场录音整理，按讲者脉络转述，不是逐字稿。讲者是 Baseten 的 Head of Partner Engineering，开场用中文寒暄，正文英文，无问答环节。全场用 Joseph Campbell 的"英雄之旅"做故事框架，中间插了一段讲开放生态的"side quest"，结尾把 token 比作英雄。

## 一句话

做好开放模型推理要先定延迟、吞吐、成本之间的取舍，再把单 GPU 的引擎优化和跨云的集群调度叠起来。每一层都必要，但单靠哪一层都不够，所以讲者主张做全栈。

## 论断

### 1. 企业用三种方式上开放模型

在意成本的，先用开放模型的 API 服务替代闭源 API；推理量大的，用独占部署满足吞吐和延迟要求；客户数据很值钱的，会在自己的任务上微调。他说微调最重要的价值是不再把客户信号交给模型厂商。

> "and most importantly, the longer handing their most valuable assets, which is their customer signal on the silver platter to the model providers" —— 更重要的是不再把最值钱的资产，也就是客户信号，拱手交给模型厂商。

- Baseten 三种都提供：service API、dedicated deployment、model training。
- 他说从年初起，OpenRouter 上开放模型的 token 消耗量已经超过闭源模型，差距还在拉大。
- 微调后质量高于前沿模型，他没给数字，也没说是哪类任务。

### 2. 开放模型推理是"使命级"的事

他专门停下主线插了一段，说常见叙事漏掉了这一点：让人类牢牢控制 AI 的路径，是建一个繁荣的开放生态来分散权力集中，在每一层都给出更多选择。开放模型把大洋两岸的模型厂商、推理平台、芯片厂商聚到了一起。

> "The gist is that open model inference is mission critical" —— 要点是开放模型推理是使命级的。

### 3. 先定目标，在帕累托前沿上选点

他说第一件事是想清楚目标。延迟、吞吐、成本之间有取舍，他放了一张某个模型在不同 GPU 型号上的帕累托前沿图：纵轴是聚合输出吞吐，横轴是单请求输出速度，基本就是 inter-token latency 的倒数。

> "In the case you have very high traffic volume and limited number of GPU, optimizing for high throughput with a tolerable end-to-end latency could be a right choice." —— 流量很大、GPU 有限时，在可接受的端到端延迟下优化吞吐可能是对的选择。

- 以 B200 为例：同一硬件按不同并发部署，会落在这条线的不同点上。低并发时每个请求更快、总吞吐更低；高并发时总吞吐高，但每个用户等得更久。
- 图上的具体数值他没念。

### 4. 单 GPU 优化都是少算、少搬数据、把硬件用满

vLLM、SGLang 这类推理引擎主要是为单节点上部署一个模型做优化的。推理分 prefill 和 decode 两个阶段：prefill 产出 KV cache 和第一个 token，决定 TTFT，主要是矩阵乘，受算力限制；decode 读 KV cache 逐个生成 token，决定 inter-token latency，瓶颈是显存带宽。两阶段需求差别很大，放到不同副本上跑能提升 GPU 利用率，这就是 PD 分离。

> "all these inference techniques are really about reducing repeated compute, remove unnecessary operations, minimize data movements, and maximize the hardware utilization" —— 这些技术的核心都是减少重复计算、去掉不必要的操作、尽量少搬数据、把硬件利用率拉满。

- chunked prefill、FlashAttention、paged KV cache：都是把大块计算或内存切小来提效率。
- 量化：可用于权重，也可用于激活和 KV cache，他说做得好能保住原全精度模型的质量。
- 并行：重点讲专家并行，把不同专家放到不同 GPU 上。
- 投机解码：用小的草稿模型或 MTP heads（疑为此词）快速出多个草稿 token，大模型一次前向验证。

### 5. 集群层的路由要看 KV cache 命中

他说推理负载不是跑在谁桌子底下的一堆机器上，而是跑在跨云、跨区域的分布式 GPU 集群上，这是一个系统层的运维问题。请求路由不只看距离和容量，还要看 KV cache 能不能匹配上。

> "User requests are routed not only by your proximity and capacity availability, but also by matching KV cache." —— 请求路由不只看距离和容量，还看 KV cache 能不能匹配上。

- 如果请求的一大块已经缓存在某处，把请求路由过去，出首 token 快得多，对用户也便宜得多。为提高命中率，把 KV cache 卸载到不同存储层级，存下更多前缀缓存。
- 负载超过现有副本时，系统要早发现、早扩容；常常还有数据驻留要求，要在不同云和区域里找到可用集群、尽快热起实例，还要能在单个集群故障时切换。
- 他说不做这些，P90 延迟会飙升。
- 他还说今天推理服务商一小时就要处理数万亿 token，没给出处。

### 6. 每一层都必要但都不充分

比较对象是从 Hugging Face 下载权重、不做任何优化直接跑的基线实现。他说按社区公开的性能数据，所有技术叠在一起，提升能高出几个数量级，具体数字没念。

> "So for a highly performance inference platform, each of this layer is necessary but not sufficient by themselves." —— 对高性能推理平台，每一层都必要，但单独哪一层都不够。

- Baseten 自称覆盖从编排层到基础设施的整个栈，以此达到很高的输出速度，同时保持四个 9 的可靠性。
- 他还说在高度集成的栈上，给开发者合适的抽象层、让他们保有控制和可见性也很关键。

## 存疑

- 帕累托前沿图用的模型没听清，可能是 DeepSeek 的某个版本，需看幻灯片。
- "一小时数万亿 token" 数字偏大，可能是"一天"或口误。
- OpenRouter 上开放模型 token 消耗超过闭源，是讲者的说法，未核。
