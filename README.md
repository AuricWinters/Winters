# 🌐 AuricWinters 个人网站

一个基于 **Vue 3 + FastAPI** 的全栈个人网站，包含博客、项目展示、在线 IDE、AI 聊天、粒子特效实验室等功能。

## ✨ 功能亮点

- **个人主页** — 三栏布局，展示个人资料、技能、项目、贡献热力图
- **博客系统** — 时间线风格，分类筛选（全部/项目/学习/生活）
- **项目展示** — 响应式网格，技术栈标签，详情页
- **暖心关怀** — 200+ 条暖心话语弹窗，液态玻璃拟态，温暖每一天
- **AI 学习路线** — 6 阶段 21 周完整学习计划，进度跟踪 + 本地持久化
- **自驱工作站** — Claude Code 完整架构文档，精美可视化展示
- **实验室** — 多个子实验室：
  - 🎨 **粒子实验室** — Canvas 粒子系统，鼠标交互，实时参数调节
  - 🎹 **钢琴实验室** — Web Audio API 合成器，键盘映射，频率可视化
  - 💻 **CodeLab** — Monaco Editor + xterm.js 在线 IDE，支持 7 种编程语言
  - 🎮 **2048 / 扫雷** — 小游戏实验室
  - 🧩 **组件展示实验室** — 文字 / 悬停 / 入场 / 背景 / UI / 3D 特效
- **AI 聊天** — 支持 Ollama / OpenAI 双后端切换
- **云盘** — 文件上传/下载/删除管理
- **认证系统** — 密码登录 / 验证码登录 / 第三方登录（微信、GitHub），密码重置
- **主题系统** — 8 套设计师主题 + 自定义配色（单色/双拼/三色），深色模式；手账 / 普通两种视觉风格；圆角 / 直角独立切换
- **动效槽位** — 9 个动效槽位（标题/卡片/按钮/背景/文字/点击/页面/导航），Pinia + localStorage 持久化，实时自定义
- **全站 i18n** — 中文简体 / 中文繁體 / English 三语切换，24+ 文件接入
- **全响应式** — 桌面优先，适配手机/平板/桌面

## 🛠️ 技术栈

### 前端

| 技术 | 说明 |
|------|------|
| Vue 3 | Composition API (`<script setup>`) |
| Vite 5 | 构建工具，HMR 热更新 |
| Vue Router 4 | 30 条路由，懒加载，路由守卫 |
| Pinia 3 | 状态管理（6 个 store） |
| Monaco Editor | 在线代码编辑器 |
| xterm.js | WebSocket 交互式终端 |
| highlight.js | 代码语法高亮（8 种语言） |
| 原生 CSS | CSS Variables + 8 套主题 + 玻璃拟态 |

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
cd backend
pip install -r requirements.txt
python main.py
# 服务运行在 http://localhost:8000
# API 文档: http://localhost:8000/docs
```

### 前端启动

```bash
cd frontend
npm install
npm run dev
# 开发服务器运行在 http://localhost:3000
# API 请求自动代理到 localhost:8000
```

### 生产构建

```bash
cd frontend
npm run build
# 构建产物在 dist/ 目录
```

## 📡 API 端点

```
GET  /                              # 健康检查

# 认证（9 端点）
GET  /api/auth/status               # 认证服务状态
POST /api/auth/register             # 用户注册
POST /api/auth/login                # 密码登录
POST /api/auth/send-code            # 发送短信验证码
POST /api/auth/login/code           # 验证码登录
POST /api/auth/reset-password       # 验证码重置密码
POST /api/auth/change-password      # 修改密码（需登录）
POST /api/auth/social/login         # 第三方登录
GET  /api/auth/social/callback/{provider}  # 第三方登录回调

# 社区
GET  /api/posts                     # 动态列表
GET  /api/posts/{id}                # 动态详情
POST /api/posts                     # 发布动态（需登录）
PUT  /api/posts/{id}                # 更新动态（需登录）
DELETE /api/posts/{id}              # 删除动态（需登录）
POST /api/posts/{id}/like           # 点赞 / 取消点赞（需登录）
GET  /api/posts/{id}/comments       # 评论列表
POST /api/posts/{id}/comments       # 发表评论（需登录）
GET  /api/tags                      # 热门标签

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
│       ├── auth.py                 # 认证 API (9 端点)
│       ├── code.py                 # 代码执行 API
│       ├── community.py            # AI 社区 API
│       ├── user.py                 # 用户资料 API
│       └── websocket.py           # WS 交互式终端
│
├── frontend/                       # Vue 3 前端
│   └── src/
│       ├── main.js                 # 应用入口
│       ├── App.vue                 # 根组件
│       ├── router/index.js         # 路由配置 (30 条)
│       ├── stores/                 # Pinia 状态管理 (6 个)
│       ├── components/             # 全局组件 (91 个)
│       ├── views/                  # 页面视图 (30 个)
│       │   └── lab/
│       │       ├── ParticleLab.vue # Canvas 粒子实验室
│       │       ├── PianoLab.vue    # Web Audio 钢琴
│       │       ├── CodeLab.vue     # 在线 IDE
│       │       ├── Game2048Lab.vue # 2048 小游戏
│       │       ├── MinesweeperLab.vue # 扫雷小游戏
│       │       ├── ShowcaseIndex.vue  # 组件实验室首页
│       │       ├── ShowcaseText.vue   # 文字特效展示
│       │       ├── ShowcaseHover.vue  # 悬停交互展示
│       │       ├── ShowcaseEntry.vue  # 入场动画展示
│       │       ├── ShowcaseBg.vue     # 背景装饰展示
│       │       ├── ShowcaseUi.vue     # UI 组件展示
│       │       └── Showcase3d.vue     # 3D / 工具展示
│       ├── composables/            # 组合式函数 (15 个)
│       ├── utils/                  # 工具函数 (2 个)
│       ├── data/                   # 静态 JSON 数据 (4 个)
│       └── styles/                 # CSS 样式
│           └── modules/            # 9 个样式模块
│
└── .trae/                          # 项目规范文档
```

## 🎨 主题系统

支持 8 套主题色，通过 CSS Variables 动态切换：

- **手账 (Journal)** — 温暖纸质 · 怀旧手账
- **墨韵 (Ink)** — 中式水墨 · 典雅沉静
- **极光 (Aurora)** — 北境极光 · 空灵迷幻
- **樱吹雪 (Sakura)** — 落樱缤纷 · 温柔轻盈
- **森语 (Forest)** — 深林大地 · 沉稳自然
- **午夜 (Midnight)** — 深海午夜 · 专业锐利
- **暮光 (Twilight)** — 日落微光 · 温暖浓郁
- **极简 (Minimal)** — 纯粹设计 · 字体驱动
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
