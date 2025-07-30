# AI Development Discussions Extract - 2025-05-24 to 2025-05-26

## Overview
This document contains extracted chat discussions from 2025-05-24 to 2025-05-26 focusing on AI development, Claude Code best practices, and coding assistant usage. This period is particularly significant for API functionality analysis and AI-assisted development discussions.

## Key Discussion Threads

### 1. Medical AI and LLM Applications (2025-05-24)

**Context**: Discussion about LLM applications in medical field and data challenges

**Participants**: 鸭哥-LLM群友, 谷雨, JEROME, 十方水土, 空明流转, 晓奕喵, Adrian

**Key Messages**:
- **鸭哥-LLM群友** (2025-05-24 12:19:04 AM): "大多数的医学知识都写在指南和教科书里"
- **谷雨** (2025-05-24 12:30:21 AM): "我说的是初级中级的医生，不是指那种高级医生。"
- **JEROME** (2025-05-24 01:18:14 AM): "这个我就不懂了，但是之前IBM Waston失败的一个重要原因就是真实就诊数据很难获得，包括之前一些用视觉识别看X光/核磁共振的，都是因为没有足够高质量的数据"
- **十方水土** (2025-05-24 04:03:09 AM): "现在LLM提升在哪呢？对医疗应用来说。inference更强？"
- **空明流转** (2025-05-24 05:01:08 AM): "诊疗指南是公开的但是当年watson需要高度结构化的数据"
- **晓奕喵** (2025-05-24 01:43:43 PM): "没错，是的，医疗的数据逻辑性是很强的，但是不一定有高度结构化。"

**AI Development Insights**: 
- Discussion of data quality challenges in AI applications
- Comparison between traditional structured approaches vs modern LLM capabilities
- Exploration of inference improvements in specialized domains

### 2. Knowledge Graphs vs LLM Approaches (2025-05-25)

**Context**: Debate about knowledge graphs effectiveness and LLM alternatives

**Participants**: GeniusVczh, 空明流转, AX, JEROME

**Key Messages**:
- **GeniusVczh** (2025-05-25 05:55:10 AM): "不仅仅是医疗不行，一切需要知识图谱的，就没有行过的 [撇嘴]"
- **空明流转** (2025-05-25 05:58:37 AM): "知识图谱看上去是一条假路径。"
- **AX** (2025-05-25 06:21:23 AM): "但是国际象棋、中国象棋这种的是不是也是知识图谱，当年是搞的很火的，这个好像可以，因为它的变量没那么多？"
- **JEROME** (2025-05-25 06:23:10 AM): "知识图谱其实就很像用本轮均轮模型来做宇宙模型"
- **JEROME** (2025-05-25 06:38:30 AM): "它用的那个"像"，复杂且不准，那还玩个毛 [撇嘴]"

**AI Development Insights**:
- Critical evaluation of knowledge graph approaches
- Discussion of domain-specific AI model effectiveness
- Comparison of different AI paradigms and their limitations

### 3. Computer Vision and LLM Evolution (2025-05-25)

**Context**: Discussion about computer vision progress compared to NLP models

**Participants**: 鸭哥-LLM群友, Dr.W

**Key Messages**:
- **鸭哥-LLM群友** (2025-05-25 10:03:39 AM): "其实也不至于，医学影像的识别一直都是在做的。但是现在医生毕竟还在嘛，让医生来做标注就行了 [旺柴]"
- **鸭哥-LLM群友** (2025-05-25 10:03:47 AM): "我倒是很好奇，现在计算机视觉识图也是自然语言模型同样的进化速度吗？还是说"

**AI Development Insights**:
- Comparison of progress rates between CV and NLP
- Discussion of human-in-the-loop approaches for AI training
- Evolution of multimodal AI capabilities

### 4. Cursor Agent Usage and Best Practices (2025-05-26)

**Context**: Practical discussion about using Cursor for coding and development

**Participants**: GeniusVczh, Oversea, 鸭哥-LLM群友

**Key Messages**:
- **GeniusVczh** (2025-05-26 03:02:08 AM): "问下cursor的agent有quota限制吗？在哪查看"
- **GeniusVczh** (2025-05-26 03:02:33 AM): "找到了"
- **谷雨** (2025-05-26 03:05:24 AM): "还是有点智障的感觉"
- **Oversea** (2025-05-26 12:37:39 PM): "与cursor陷入奇怪的拉锯"
- **鸭哥-LLM群友** (2025-05-26 12:38:26 PM): "我让它写个东西 它基本写的都对 有一丢丢小错 我手动给他改正"
- **鸭哥-LLM群友** (2025-05-26 12:38:57 PM): "然后我让它写下一步的时候它又会给我改回去。。。"

**Claude Code Best Practices Identified**:
- Understanding quota limitations and monitoring usage
- Managing context and avoiding circular corrections
- Handling AI assistant "pull-back" behaviors

### 5. AI Assistant Interaction Best Practices (2025-05-26)

**Context**: Core discussion about effective collaboration with AI coding assistants

**Participants**: Oversea, 鸭哥-LLM群友

**Key Messages**:
- **Oversea** (2025-05-26 12:39:28 PM): "最好不要自己动手改代码，你可以告诉它哪一行有什么问题然后让它来改，让它学习到"
- **Oversea** (2025-05-26 12:39:44 PM): "想想看好比你带一个intern，一般你不会直接上手就改ta的代码而是告诉ta某个地方有错应该需要怎么改"
- **鸭哥-LLM群友** (2025-05-26 12:40:57 PM): "我有时候也会产生拉锯然后手动改了，就好像我有时候带intern烦了就自己干了，我猜新开一个chat把之前的都忘掉可能会好一点"
- **Oversea** (2025-05-26 12:41:55 PM): "有没有用cursor写C# 的朋友，为啥它一直跟这个过不去[破涕为笑]"

**Claude Code Best Practices Identified**:
- **Don't manually edit code**: Let the AI learn by explaining what's wrong rather than fixing it yourself
- **Treat AI like an intern**: Guide rather than directly intervene
- **Reset context when stuck**: Start new conversations to break out of loops
- **Language-specific challenges**: Some programming languages may be more challenging for AI assistants

### 6. AI Cost Economics and Infrastructure Discussion (2025-05-26)

**Context**: Discussion about AI computational costs and economic trends

**Participants**: Oversea, 鸭哥-LLM群友, 鲶鱼, 陈潮Chao, NOMAD, Surprise

**Key Messages**:
- **Oversea** (2025-05-26 01:07:50 PM): "我们一直说AI的cost不用担心，同样智能的LLM的价格在指数下降。这个图生动地表现了这一点。"
- **Oversea** (2025-05-26 01:09:50 PM): "来源：https://www.bain.com/insights/deepseek-a-game-changer-in-ai-efficiency/"
- **鸭哥-LLM群友** (2025-05-26 01:12:12 PM): "歌词大意是未来计算边际成本趋近于0的时候，AI能干的事情会很多"
- **鸭哥-LLM群友** (2025-05-26 01:18:08 PM): "尤其是transformer出现以后，基本上统一了模型的架构，transformer本身就很高效，让大家以前很多没想到能用DNN做的事情都能够实现了，相当于计算机又被重新发明了一次"
- **陈潮Chao** (2025-05-26 01:22:39 PM): "而且因为模型架构的统一很多人愿意去在针对硬件架构的机制优化，释放出来很多新老设备的潜力"
- **NOMAD** (2025-05-26 01:23:02 PM): "就好像fsd从11升级到12，以前几十万行c++代码你一个模块一个模块的优化玩到猴年马月"
- **Surprise** (2025-05-26 01:24:26 PM): "现在就一个模型，深度优化就很简单"

**AI Development Insights**:
- Cost reduction trends in AI inference
- Impact of transformer architecture standardization
- Hardware optimization benefits from unified model architectures
- Paradigm shift from modular code optimization to model-based approaches

### 7. API Usage and O1 Pro Discussion (2025-05-26)

**Context**: Technical discussion about OpenAI API capabilities and O1 Pro access

**Participants**: Oversea, 鸭哥-LLM群友

**Key Messages**:
- **Oversea** (2025-05-26 01:28:14 PM): "草我在用GPT-4.5写demo script，感觉太牛逼了… "
- **Oversea** (2025-05-26 01:31:02 PM): "o1 pro 目前是不是还没有api呀？"
- **鸭哥-LLM群友** (2025-05-26 01:31:47 PM): "有API的，在o1 API里面有一个参数叫做Reasoning Effort。你把它打到High，一定程度上可以模拟o1 Pro。但是我们没有严格比较过二者是不是完全一样的，但它确实也会思考挺长时间的，给你一个挺好的答案。"
- **鸭哥-LLM群友** (2025-05-26 01:32:50 PM): "Deep Research API 需要等满血O3先上"

**API Best Practices Identified**:
- **O1 Pro simulation**: Use `Reasoning Effort: High` parameter in O1 API for enhanced reasoning
- **API availability**: Understanding feature rollout timelines and current limitations
- **Demo script generation**: GPT-4.5 showing strong performance for prototype development

### 8. Model Evaluation and Agent Development (2025-05-26)

**Context**: Discussion about model comparison and agent development frameworks

**Participants**: Oversea, Surprise, 迦南, 鸭哥-LLM群友, yousa, 缺之

**Key Messages**:
- **Oversea** (2025-05-26 01:25:14 PM): "大家都都是怎么evaluate各种不同的模型的啊？有啥工具可以用吗？"
- **Surprise** (2025-05-26 01:25:45 PM): "O3， deepseek他们打的什么榜"
- **Oversea** (2025-05-26 01:25:55 PM): "现在连tokenize的方法都没统一"
- **迦南** (2025-05-26 01:59:21 PM): "我用下来deepseek真的是最好用的 比grok的deep research和o1都强"
- **鸭哥-LLM群友** (2025-05-26 02:00:09 PM): "用英语沟通的，之前只知道dpsk写中文厉害，没想到英文学术论文也这么强"
- **yousa** (2025-05-26 07:21:11 PM): "agent开发框架大家都用哪个啊？"
- **缺之** (2025-05-26 09:30:31 PM): "R1满血版思考6分钟一次给出正确答案"

**AI Development Insights**:
- Model evaluation challenges and lack of standardized tools
- Tokenization inconsistencies across models
- DeepSeek showing strong performance across multiple languages and tasks
- Agent development framework selection considerations
- R1 model's extended reasoning capabilities

## Summary of Claude Code Best Practices Identified

Based on these discussions, several key best practices for AI-assisted development emerged:

### 1. **Human-AI Collaboration Principles**
- Treat AI assistants like interns - guide rather than directly fix their work
- Explain problems rather than making manual corrections to help AI learn
- Avoid directly editing AI-generated code when possible

### 2. **Context Management**
- Reset conversations when getting stuck in loops
- Be aware of quota limitations and monitor usage
- Understand model-specific strengths and limitations

### 3. **API Optimization**
- Use appropriate reasoning effort parameters for enhanced performance
- Understand feature availability and rollout timelines
- Consider cost trends and efficiency improvements

### 4. **Model Selection and Evaluation**
- Consider task-specific model strengths (e.g., DeepSeek for multilingual tasks)
- Be aware of benchmarking limitations and real-world performance differences
- Evaluate based on actual use cases rather than just benchmark scores

### 5. **Technical Architecture Considerations**
- Leverage unified model architectures for optimization benefits
- Consider the paradigm shift from traditional code to model-based approaches
- Understand the implications of cost reduction trends in AI inference

## Historical Context

These discussions occurred during a critical period (2025-05-25) for API functionality analysis, capturing real-world experiences with:
- Cursor agent usage and limitations
- O1 Pro API capabilities and workarounds
- Cross-model performance comparisons
- Practical AI development workflows

The conversations provide valuable insights into the evolving landscape of AI-assisted development tools and best practices that were emerging during this timeframe.