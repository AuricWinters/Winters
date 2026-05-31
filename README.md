# 🌐 AuricWinters 个人网站

一个基于 **Vue 3 + FastAPI** 的全栈个人网站，包含博客、项目展示、在线 IDE、AI 聊天、粒子特效实验室等功能。

## ✨ 功能亮点

- **个人主页** — 三栏布局，展示个人资料、技能、项目、贡献热力图
- **博客系统** — 时间线风格，分类筛选（全部/项目/学习/生活）
- **项目展示** — 响应式网格，技术栈标签，详情页
- **实验室** — Bento Grid 入口，包含 3 个子实验室：
  - 🎨 **粒子实验室** — Canvas 粒子系统，鼠标交互，实时参数调节
  - 🎹 **钢琴实验室** — Web Audio API 合成器，键盘映射，频率可视化
  - 💻 **CodeLab** — Monaco Editor + xterm.js 在线 IDE，支持 7 种编程语言
- **AI 聊天** — 支持 Ollama / OpenAI 双后端切换
- **云盘** — 文件上传/下载/删除管理
- **认证系统** — 密码登录 / 验证码登录 / 第三方登录（微信、GitHub），密码重置
- **主题系统** — 6 套预设主题 + 自定义配色（单色/双拼/三色），深色模式
- **粒子特效** — 雪花飘落（普通页）+ 鼠标吸引/爆炸（登录页）
- **全响应式** — 6 个断点，适配手机/平板/桌面
- **暖心关怀** — 200+ 条暖心话语弹窗，液态玻璃拟态，温暖每一天
- **AI 学习路线** — 6 阶段 21 周完整学习计划，进度跟踪 + 本地持久化

## 🛠️ 技术栈

### 前端

| 技术 | 说明 |
|------|------|
| Vue 3 | Composition API (`<script setup>`) |
| Vite 5 | 构建工具，HMR 热更新 |
| Vue Router 4 | 14 条路由，懒加载，路由守卫 |
| Pinia 3 | 状态管理（4 个 store） |
| Monaco Editor | 在线代码编辑器 |
| xterm.js | WebSocket 交互式终端 |
| highlight.js | 代码语法高亮（8 种语言） |
| 原生 CSS | CSS Variables + 7 套主题 + 玻璃拟态 |

### 后端

| 技术 | 说明 |
|------|------|
| FastAPI | RESTful API + WebSocket |
| SQLite | 原生 sqlite3，无 ORM |
| Pydantic v2 | 12 个数据模型，请求校验 |
| subprocess | 6 种语言代码执行，`shell=False` |

## 🚀 快速启动

### 环境要求

- Node.js >= 18
- Python >= 3.9
- npm 或 yarn

### 后端启动

```bash
cd Winters/backend
pip install -r requirements.txt
python main.py
# 服务运行在 http://localhost:8000
# API 文档: http://localhost:8000/docs
```

### 前端启动

```bash
cd Winters/frontend
npm install
npm run dev
# 开发服务器运行在 http://localhost:3000
# API 请求自动代理到 localhost:8000
```

### 生产构建

```bash
cd Winters/frontend
npm run build
# 构建产物在 dist/ 目录
```

## 📡 API 端点

```
GET  /                              # 健康检查
POST /api/auth/register             # 用户注册
POST /api/auth/login                # 密码登录
POST /api/auth/send-code            # 发送短信验证码
POST /api/auth/login/code           # 验证码登录
POST /api/auth/reset-password       # 验证码重置密码
POST /api/auth/social/login         # 第三方登录
POST /api/code/execute              # 代码执行（6种语言）
GET  /api/code/languages            # 支持的语言列表
GET  /api/user/profile              # 获取用户资料
PUT  /api/user/profile              # 更新用户资料
WS   /ws/code/execute               # WebSocket 交互式终端
```

## 📁 项目结构

```
├── backend/                        # FastAPI 后端
│   ├── main.py                     # 应用入口 + CORS + 路由挂载
│   ├── models.py                   # Pydantic v2 数据模型
│   ├── database.py                 # SQLite 连接管理
│   ├── crud.py                     # 用户 CRUD 操作
│   ├── executor.py                 # 代码执行引擎
│   ├── utils.py                    # 验证码 / 第三方登录
│   └── routes/
│       ├── auth.py                 # 认证 API (8 端点)
│       ├── code.py                 # 代码执行 API
│       ├── user.py                 # 用户资料 API
│       └── websocket.py           # WS 交互式终端
│
├── frontend/                       # Vue 3 前端
│   └── src/
│       ├── main.js                 # 应用入口
│       ├── App.vue                 # 根组件
│       ├── router/index.js         # 路由配置 (14 条)
│       ├── stores/                 # Pinia 状态管理
│       ├── components/             # 全局组件 (11 个)
│       ├── views/                  # 页面视图 (15 个)
│       │   └── lab/
│       │       ├── ParticleLab.vue # Canvas 粒子实验室
│       │       ├── PianoLab.vue    # Web Audio 钢琴
│       │       ├── CodeLab.vue     # 在线 IDE
│       │       └── tutorials/     # 7 个编程语言教程
│       ├── composables/            # 组合式函数 (5 个)
│       ├── utils/                  # 工具函数
│       ├── data/                   # 静态 JSON 数据
│       └── styles/                 # CSS 样式
│           └── modules/            # 7 个样式模块
│
└── .trae/                          # 项目规范文档 (25 个)
    └── skills/ex-skill/            # ex-skill 开源项目
```

## 🎨 主题系统

支持 7 套主题色，通过 CSS Variables 动态切换：

- **Default** — 靛蓝+粉红
- **Dark** — 深色模式
- **Pink-Gold** — 粉金搭配
- **Blue-Purple** — 蓝紫渐变
- **Green-Teal** — 绿青清新
- **Orange-Red** — 橙红活力
- **Purple-Pink** — 紫粉梦幻
- **Custom** — 自定义（单色/双拼/三色自由搭配）

## 🎹 PianoLab 键盘映射

```
白键: A  W  S  E  D  F  T  G  Y  H  U  J  K  L
音名: C4 C#4 D4 D#4 E4 F4 F#4 G4 G#4 A4 A#4 B4 C5
波形: 正弦波 / 方波 / 锯齿波 / 三角波
```

## 💻 CodeLab 支持语言

| 语言 | 版本 | 执行方式 |
|------|------|----------|
| C | gcc | 编译后执行 |
| Java | javac + java | 编译后执行 |
| JavaScript | Node.js | 前端直接执行 / 后端 node |
| TypeScript | tsx | npx tsx |
| Python | 3.x | 后端 python |
| PHP | 8.x | 后端 php |
| ArkTS | — | 语法高亮 |

## 📝 开发命令

```bash
# 前端
npm run dev          # 开发服务器 (port 3000)
npm run build        # 生产构建
npm run lint         # ESLint 检查并修复
npm run format       # Prettier 格式化

# 后端
python main.py       # 开发服务器 (port 8000，热重载)
```

## 📄 许可证

MIT License

---

Made with ❤️ by [AuricWinters](https://github.com/AuricWinters)
