# Ghibli AI 图片生成器

基于 Next.js 开发的吉卜力风格 AI 图片生成器。

## 功能特性

- 🎨 吉卜力风格图片生成
- �� 响应式设计
- 🔧 多种纵横比支持 (1:1, 3:4, 4:3, 16:9, 9:16)
- 💾 本地历史记录保存
- 📥 图片下载功能
- 🔄 真实进度条反馈
- 🛡️ 安全的API密钥管理

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置API密钥

1. 复制环境变量模板：
```bash
cp .env.example .env.local
```

2. 获取OpenAI API密钥：
   - 访问 [OpenAI API Keys](https://platform.openai.com/api-keys)
   - 创建新的API密钥

3. 编辑 `.env.local` 文件，替换为你的真实API密钥：
```bash
GHIBLI_API_KEY=sk-your-actual-openai-api-key-here
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 开始使用。

## 🔒 安全说明

⚠️ **重要安全提醒**：

- `.env.local` 文件包含敏感的API密钥，**已自动被git忽略**
- 永远不要将真实的API密钥提交到代码仓库
- 使用 `.env.example` 作为配置模板
- 在生产环境中使用环境变量管理API密钥

## 🛠️ 诊断工具

访问 [http://localhost:3000/debug](http://localhost:3000/debug) 进行系统诊断：

- 检查API密钥配置状态
- 测试API连接
- 查看详细错误信息

## 技术栈

- Next.js 15
- TypeScript
- Tailwind CSS
- Radix UI
- Lucide Icons
- OpenAI DALL-E 3 API

## 🎯 最新修复 (v1.2)

- ✅ 修复进度条不准确问题
- ✅ 优化Ghibli风格提示词
- ✅ 修复3:4比例图片生成
- ✅ 增强安全性和错误处理

## 部署状态

✅ 已修复合并冲突，代码构建正常

*Automatically synced with your [v0.dev](https://v0.dev) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/yanruoyi999s-projects/v0-ghibli-ai-website)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/3THldcqQNUy)

## Overview

This repository will stay in sync with your deployed chats on [v0.dev](https://v0.dev).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.dev](https://v0.dev).

## Deployment

Your project is live at:

**[https://vercel.com/yanruoyi999s-projects/v0-ghibli-ai-website](https://vercel.com/yanruoyi999s-projects/v0-ghibli-ai-website)**

## Build your app

Continue building your app on:

**[https://v0.dev/chat/projects/3THldcqQNUy](https://v0.dev/chat/projects/3THldcqQNUy)**

## How It Works

1. Create and modify your project using [v0.dev](https://v0.dev)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository