# hexo-ai-summary-liushen

使用 AI 自动为 Hexo 文章生成摘要，支持腾讯混元（或兼容 OpenAI 协议的模型接口），支持并发处理、摘要字段自定义、调试输出、可选覆盖重建等功能。

## ✨ 功能特点

- 支持文章首次生成摘要或重新生成（可控是否覆盖）
- 自定义摘要字段名称，避免与主题冲突
- 内容清洗规则可定制，默认清理 HTML、链接、代码等无关内容
- 多文章并发处理，支持接口速率保护
- 控制台输出处理日志，方便排查

## 📦 安装

```bash
npm install hexo-ai-summary-liushen --save
```

## 🛠 配置项（添加到 `_config.yml` 或主题配置文件中）

```yaml
aisummary:
  # 全局控制
  enable: true            # 是否启用插件
  cover_all: false        # 是否覆盖所有文章的摘要（默认仅生成缺失摘要的文章）
  summary_field: summary  # 摘要写入的字段名，建议保持默认
  logger: true            # 是否输出日志信息

  # AI 接口及参数
  api: https://api.openai.com/v1/chat/completions
  token: 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'  # 你的 OpenAI API 密钥
  model: "gpt-3.5-turbo"
  prompt: >
    你是一个博客文章摘要生成工具，你需要解释我发送给你的内容，不要换行！
    不要超过250字，不不少于150字，只需要介绍文章的内容，不需要提出建议和缺少的东西。
    请用中文回答，不要带特殊字符，输出的内容开头为“这里是清羽AI，这篇文章”

  # 内容处理规则
  ignoreRules: # 预留规则，可通过正则表达式进一步清洗内容
    # - "/---([\\s\\S]*?)---/g"
    # - "\\{%.*?%\\}"
    # - "!\\[.*?\\]\\(.*?\\)"

  max_token: 5000     # 传递给API的最大token数
  concurrency: 2      # 并发请求数，建议不要过高以防接口限流
```

### 🧹 默认处理内容包括：

- 删除 HTML 标签、占位符、空行、换行符
- 删除 Markdown 中的图片、链接等格式标记
- 删除代码块（inline 和多行）

## 📁 插件包含的文件

- `index.js`: 主插件逻辑，注册 `before_generate` 钩子处理 `_posts` 文章
- `ai.js`: 封装的 AI 请求逻辑（基于 `axios`）
- `strip.js`: 内容清洗模块，用于移除摘要无关内容
- `package.json`: 包含依赖信息

## 🧩 依赖项

本插件依赖以下库：

- [`axios`](https://www.npmjs.com/package/axios)：发送 HTTP 请求
- [`p-limit`](https://www.npmjs.com/package/p-limit)：并发请求控制
- [`hexo-front-matter`](https://www.npmjs.com/package/hexo-front-matter)：读取与写入 Markdown 的 Front-Matter 区块

你可以在安装前手动添加依赖：

```bash
npm install axios p-limit hexo-front-matter
```

## 📝 示例

```markdown
---
title: 如何使用hexo-ai-summary-liushen
date: 2024-04-25
categories: 教程
tags:
  - hexo
  - AI
---

这里是博客的正文内容...
```

生成后：

```markdown
---
title: 如何使用hexo-ai-summary-liushen
summary: 这里是清羽AI，这篇文章介绍了如何为 Hexo 博客自动生成摘要，包括插件的配置方式、运行原理以及如何连接到 OpenAI 或混元模型等内容。
---
```

## 📜 License

[MIT](./LICENSE)
