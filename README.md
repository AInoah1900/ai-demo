# AI导航器 (AI-Navigator)

AI导航器是一个集合了各类AI工具和资源的导航网站，帮助用户快速找到并使用各种AI相关工具、服务和资讯。

## 项目概述

本项目是一个基于Next.js和React构建的现代化Web应用，提供了一个直观的界面来浏览和搜索各种AI工具和资源。项目采用了响应式设计，确保在不同设备上都能提供良好的用户体验。

## 功能特点

- **分类导航**：按照不同类别（如AI对话聊天、AI绘画、AI编程工具等）组织AI工具
- **搜索功能**：支持按名称搜索AI工具
- **响应式设计**：适配不同屏幕尺寸的设备
- **卡片式布局**：直观展示每个工具的名称、描述和图标
- **外部链接**：直接跳转到各AI工具的官方网站
- **内置AI助手**：集成DeepSeek R1满血版AI聊天助手，提供实时交互

## 技术栈

- **前端框架**：Next.js 15.1.7
- **UI库**：React 19.0.0
- **样式**：Tailwind CSS
- **UI组件**：Material UI (MUI)
- **AI集成**：Vercel AI SDK 4.2.6, OpenAI Stream
- **语言**：TypeScript

## 项目结构

```
ai-navigator/
├── public/             # 静态资源文件夹
│   └── img/            # 工具图标图片
├── src/                # 源代码
│   └── app/            # Next.js应用目录
│       ├── components/ # 可复用组件
│       │   ├── Navbar.tsx      # 导航栏组件
│       │   └── ChatbotButton.tsx  # DeepSeek R1聊天组件
│       ├── api/        # API路由
│       │   └── chat/   # 聊天API
│       │       └── route.ts  # 聊天API路由
│       ├── types.d.ts  # 类型声明文件
│       ├── card/       # 卡片详情页面
│       ├── globals.css # 全局样式
│       ├── layout.tsx  # 应用布局
│       └── page.tsx    # 主页面
├── data.json           # 工具数据
├── tailwind.config.ts  # Tailwind配置
├── tsconfig.json       # TypeScript配置
└── package.json        # 项目依赖
```

## 数据结构

项目使用 `data.json`文件存储所有AI工具的信息，按照不同类别组织。每个工具包含以下信息：

- **id**：唯一标识符
- **name**：工具名称
- **description**：工具描述
- **img**：工具图标（存储在public/img/目录）
- **link**：工具官方网站链接

## DeepSeek AI助手

本项目集成了DeepSeek AI助手，作为一个悬浮式聊天组件，提供以下特性：

- **思考过程可视化**：展示AI的推理过程，让用户了解答案背后的思考
- **智能提示**：针对复杂问题提供深度思考和详细解析
- **悬浮设计**：不干扰主界面使用，随时可用
- **响应式体验**：提供流畅的对话体验
- **灵活的模型选择**：自动在不同模型之间切换以保证最佳体验

### 配置真实的DeepSeek模型

要使用真实的DeepSeek模型而非模拟版本，请按照以下步骤操作：

1. 注册DeepSeek平台账号：访问 [DeepSeek平台](https://platform.deepseek.com) 并创建账号
2. 获取API密钥：在个人账户设置中创建API密钥
3. 配置环境变量：
   - 将项目根目录下的`.env.local.example`文件复制为`.env.local`
   - 用你的真实API密钥替换`your_deepseek_api_key_here`
4. 重启开发服务器

如果没有配置API密钥，系统将自动回退到使用模拟模式。

> **注意**: 本应用现已更新为使用最新的DeepSeek API模型。系统会首先尝试使用`deepseek-reasoner`模型（推理专家），如果不可用则会回退到`deepseek-chat`模型。如果您遇到API错误，系统将自动使用模拟模式。

### 模拟模式vs真实模式

- **模拟模式**：使用预设的回复模板，无需API密钥，但功能有限
- **真实模式**：调用官方DeepSeek API，需要API密钥和互联网连接，提供完整的AI能力
  - **deepseek-reasoner模型**：专为复杂推理设计，能够展示详细的思考过程
  - **deepseek-chat模型**：通用对话模型，作为备用选项

系统会自动检测环境变量中是否存在有效的API密钥，并相应地切换模式。聊天界面会显示当前正在使用的模式和模型，让用户随时了解AI助手的运行状态。

### 消息格式兼容性

不同的DeepSeek模型可能有不同的消息格式要求。本项目在发送消息时会自动处理消息序列，确保符合各个模型的要求，为用户提供无缝的体验。

AI助手的实现基于以下技术：

- **Vercel AI SDK**：提供与AI模型的交互能力
- **OpenAI Stream API**：实现流式文本生成，提供更自然的对话体验
- **React Hooks**：管理聊天状态和用户交互
- **边缘计算**：使用Edge Runtime以支持流式响应

要使用真实的AI功能，需要配置环境变量：

```
OPENAI_API_KEY=your-openai-api-key
```

如果未配置API密钥，系统将使用内置的模拟数据提供基本体验。

## 安装与运行

### 前提条件

- Node.js 18.0.0或更高版本
- npm或yarn包管理器

### 安装步骤

1. 克隆仓库

```bash
git clone https://github.com/yourusername/ai-navigator.git
cd ai-navigator
```

2. 安装依赖

```bash
npm install --legacy-peer-deps
# 或
yarn install --legacy-peer-deps
```

3. 运行开发服务器

```bash
npm run dev
# 或
yarn dev
```

4. 打开浏览器访问 http://localhost:3000

### 构建生产版本

```bash
npm run build
npm run start
# 或
yarn build
yarn start
```

## 自定义与扩展

### 添加新工具

要添加新的AI工具，只需在 `data.json`文件中相应的类别下添加新的工具信息：

```json
{
  "id": "新ID",
  "name": "工具名称",
  "description": "工具描述",
  "img": "图标文件名.jpg",
  "link": "https://工具官网链接"
}
```

并将对应的图标文件放在 `public/img/`目录下。

### 添加新类别

要添加新的工具类别，在 `data.json`文件中添加新的类别对象：

```json
{
  "title": "新类别名称",
  "cards": [
    // 该类别下的工具列表
  ]
}
```

### 自定义DeepSeek R1助手

可以通过以下方式自定义内置的DeepSeek R1助手：

1. 修改`src/app/api/chat/route.ts`中的系统提示，以调整AI的回复风格
2. 更改`src/app/components/ChatbotButton.tsx`中的UI设计
3. 调整推理展示的样式和格式
4. 配置真实的DeepSeek API（当官方API可用时）

## 未来计划

- 添加用户评分和评论功能
- 实现工具使用统计和推荐系统
- 增加更多AI工具分类和资源
- 优化移动端体验
- 添加暗黑模式支持
- 集成实际的DeepSeek R1 API
- 增强AI助手的交互能力和个性化功能

## 贡献指南

欢迎对本项目做出贡献！请遵循以下步骤：

1. Fork本仓库
2. 创建您的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启一个Pull Request

## 许可证

本项目采用MIT许可证 - 详情请参阅LICENSE文件

## 联系方式

如有任何问题或建议，请通过以下方式联系我们：

- 项目GitHub: [https://github.com/AInoah1900/ai-navigator](https://github.com/yourusername/ai-navigator)
- 电子邮件: lxxc521@gmail.com
