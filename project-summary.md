# 📁 项目全景总结

```
d:\project\
├── Winters/                       # 🔥 主项目：AuricWinters 个人网站（全栈）
│   ├── backend/                   # FastAPI 后端
│   ├── frontend/                  # Vue 3 前端
│   └── .trae/                     # 项目规范 & 技能
├── klkk/                          # 🎁 独立小项目（暖心弹窗互动页）
└── ai-learning-plan.html          # 📝 AI全栈开发学习路线页
```

---

## 🔥 主项目：Winters（AuricWinters 个人网站）

### 一、技术栈总览

| 层级 | 技术 | 说明 |
|------|------|------|
| 前端框架 | Vue 3 (Composition API) | 15 个页面，模块化组件架构 |
| 构建工具 | Vite 5 | HMR 热更新、代码分割、路径别名 `@` |
| 状态管理 | Pinia | 4 个 store（settings / user / ai / data） |
| 路由 | Vue Router 4 | 14 条路由 + 懒加载 + 登录守卫 |
| 样式 | 原生 CSS（CSS Variables） | 6 套主题色 + 玻璃拟态 + 全响应式 |
| 代码规范 | ESLint + Prettier | 自动格式化与修复 |
| 后端框架 | FastAPI | RESTful API + WebSocket |
| 数据库 | SQLite（原生 sqlite3） | 用户表，无 ORM 依赖 |
| 代码执行 | subprocess | 支持 6 种语言，子进程隔离 |
| 在线编辑器 | Monaco Editor + xterm.js | 在线 IDE + 交互式终端 |
| 代码高亮 | highlight.js | 教程/博客代码块渲染 |

### 二、后端架构（`backend/`）

#### 文件结构

| 文件 | 职责 |
|------|------|
| `main.py` | 应用入口，FastAPI + CORS 中间件，挂载 4 个路由模块，lifespan 生命周期管理 |
| `models.py` | 12 个 Pydantic v2 数据模型（用户、代码请求、验证码、第三方登录） |
| `database.py` | SQLite 连接管理，上下文管理器自动 commit/rollback，PRAGMA 外键约束 |
| `crud.py` | 10 个数据操作函数（用户 CRUD、密码验证、按手机号查询等） |
| `executor.py` | 代码执行引擎（758 行），支持 JS/TS/ArkTS/Python/C/Java/PHP |
| `utils.py` | 验证码生成/存储/校验（内存字典、5分钟过期），微信/GitHub 模拟登录 |
| `routes/auth.py` | 8 个认证端点（注册/登录/验证码/密码重置/第三方登录） |
| `routes/code.py` | 代码执行 API（提交执行、语言列表） |
| `routes/user.py` | 用户资料查询/更新 |
| `routes/websocket.py` | WebSocket 交互式终端执行，后台线程异步转发 stdout/stderr |

#### API 端点一览

```
GET  /                              # 健康检查
POST /api/auth/register             # 用户注册
POST /api/auth/login                # 账号密码登录
POST /api/auth/send-code            # 发送短信验证码
POST /api/auth/login/code           # 验证码登录
POST /api/auth/reset-password       # 验证码重置密码
POST /api/auth/social/login         # 第三方登录（模拟）
GET  /api/auth/social/callback/{p}  # 第三方登录回调
POST /api/code/execute              # 代码执行
GET  /api/code/languages            # 支持的语言列表
GET  /api/user/profile              # 获取用户资料
PUT  /api/user/profile              # 更新用户资料
WS   /ws/code/execute               # WebSocket 交互式终端
```

#### 架构特点
- 分层清晰：路由层 → 业务逻辑层 → 数据层
- 无 ORM 依赖，原生 sqlite3 通过 `contextmanager` 管理事务
- 代码执行在隔离临时目录中运行，`shell=False` 防注入
- 超时控制（默认 10 秒），临时文件自动清理

---

### 三、前端架构（`frontend/`）

#### 目录结构

```
src/
├── main.js                     # 应用入口：Pinia + Router + 全局样式
├── App.vue                     # 根组件：Header + router-view + Footer + 全局组件
├── router/index.js             # 14 条路由 + beforeEach 守卫 + 滚动行为
├── stores/                     # Pinia 状态管理
│   ├── settings.js             # 主题/语言/深色模式/字体/动画（localStorage 持久化）
│   ├── user.js                 # 用户认证（本地模拟模式）
│   ├── ai.js                   # AI 聊天状态 + API 调用（Ollama / OpenAI）
│   └── data.js                 # 静态数据导入（个人资料/项目/博客 JSON）
├── composables/                # 组合式函数
│   ├── useSettings.js          # 设置逻辑封装
│   ├── useToast.js             # 全局 Toast 通知
│   ├── useScrollReveal.js      # 滚动入场动画
│   ├── useBackToTop.js         # 返回顶部逻辑
│   └── useParticles.js         # 粒子背景封装
├── components/                 # 全局组件
│   ├── Header.vue              # 导航栏（玻璃拟态 + Glider 滑块 + 移动端汉堡菜单）
│   ├── Footer.vue              # 极简页脚（版权信息）
│   ├── SettingsPanel.vue       # 右侧滑出设置面板（1200 行）
│   ├── ToastNotification.vue   # Toast 消息通知
│   ├── BackToTop.vue           # 返回顶部按钮
│   ├── Carousel.vue            # 轮播组件
│   ├── ContributionHeatmap.vue # 贡献热力图
│   ├── AnimatedCharacters.vue  # 字符动画
│   ├── EyeBall.vue / Pupil.vue # 眼球跟随效果
│   └── ...
├── views/                      # 页面视图（15 个）
│   ├── Home.vue                # 首页（三栏布局）
│   ├── Blog.vue                # 博客（时间线 + 分类筛选）
│   ├── Projects.vue            # 项目作品集（响应式网格）
│   ├── ProjectDetail.vue       # 项目详情
│   ├── Lab.vue                 # 实验室入口（Bento Grid）
│   ├── AI.vue                  # AI 聊天页
│   ├── Contact.vue             # 联系表单
│   ├── Drive.vue               # 云盘文件管理
│   ├── Login.vue               # 登录（密码/验证码双模式）
│   ├── Register.vue            # 注册
│   ├── ResetPassword.vue       # 密码重置
│   ├── Profile.vue             # 个人中心（需登录）
│   └── lab/                    # Lab 子页面
│       ├── ParticleLab.vue     # Canvas 粒子交互实验室
│       ├── PianoLab.vue        # Web Audio 钢琴实验室
│       └── CodeLab.vue         # 编程学习实验室（Monaco + xterm + WebSocket）
├── data/                       # 静态数据
│   ├── profile.json            # 个人资料
│   ├── projects.json           # 项目列表
│   └── blogs.json              # 博客文章
├── utils/
│   ├── particles.js            # 完整 Canvas 粒子系统（1132 行）
│   └── throttle.js             # 节流/防抖工具
└── styles/
    ├── main.css                # 主样式 + 全局按钮设计系统
    └── modules/
        ├── variables.css       # CSS 变量 + 6 套主题色 + 深色模式
        ├── base.css            # 全局重置 + 径向渐变背景 + 字体栈
        ├── header.css          # 导航栏玻璃拟态样式
        ├── layout.css          # 三栏网格 + 6 个响应式断点
        ├── components.css      # 组件样式（卡片/技能条/时间线/热力图）
        ├── features.css        # 功能页样式（聊天/表单）
        └── utilities.css       # 工具类（骨架屏/滚动动画/无障碍/字体缩放）
```

#### 路由全景（14 条）

| 路径 | 页面 | 说明 | 特殊 meta |
|------|------|------|-----------|
| `/` | Home | 三栏个人主页（资料 + 动态 + 项目/技能） | — |
| `/blog` | Blog | 时间线博客（全部/项目/学习/生活分类） | — |
| `/projects` | Projects | 项目作品集响应式网格 | — |
| `/projects/:id` | ProjectDetail | 项目详情（介绍 + 功能列表 + 链接） | — |
| `/lab` | Lab | 实验室入口（5 个 Bento Grid 卡片） | — |
| `/lab/particles` | ParticleLab | 全屏 Canvas 粒子交互 | `fullWidth: true` |
| `/lab/piano` | PianoLab | Web Audio 可弹奏钢琴 | `fullWidth: true` |
| `/lab/code` | CodeLab | 编程学习 IDE（Monaco + xterm + WS） | — |
| `/ai` | AI | AI 聊天（Ollama/OpenAI 切换） | — |
| `/drive` | Drive | 云盘文件管理（上传/下载/删除） | — |
| `/contact` | Contact | 联系表单 | — |
| `/login` | Login | 登录页（密码/验证码双模式 + 第三方） | — |
| `/register` | Register | 注册页 | — |
| `/reset-password` | ResetPassword | 密码重置 | — |
| `/profile` | Profile | 个人中心 | `requiresAuth: true` |

#### 设计系统

**6 套主题色：**
- Dark（暗色系）— 默认
- Pink-Gold（粉金系）
- Blue-Purple（蓝紫系）
- Green-Teal（绿青系）
- Orange-Red（橙红系）
- Purple-Pink（紫粉系）
- Custom（自定义单色/双拼/三色）

**全局按钮系统：**
- `.btn-primary` — 粉红渐变 + 白色光晕 + hover 上浮
- `.btn-secondary` — 玻璃态毛玻璃效果
- `.btn-ghost` — 透明边框幽灵按钮

**6 个响应式断点：** 1440px / 1200px / 1100px / 992px / 768px / 480px

**粒子系统（`utils/particles.js`）：**
- 登录页模式：粒子被鼠标吸引 + 圆周运动 + 2 秒后脱离 + 点击爆炸特效
- 普通页模式：三种雪花（六边形/星形/树枝形）持续从顶部生成飘落
- 以 1920px 为基准等比缩放适配各分辨率

**通用视觉特色：**
- 玻璃拟态 (`backdrop-filter: blur()`)
- 滚动揭示动画 (`scroll-reveal`)
- 骨架屏加载态 (shimmer 动画)
- 全局 Toast 通知系统
- 渐变动态背景

---

### 四、后端开发服务器

```bash
cd Winters/backend
pip install -r requirements.txt
python main.py        # 启动在 0.0.0.0:8000，开启热重载
```

### 五、前端开发服务器

```bash
cd Winters/frontend
npm install
npm run dev           # 启动在 0.0.0.0:3000，API 代理到 8000
npm run build         # 生产构建
npm run lint          # ESLint 自动修复
npm run format        # Prettier 格式化
```

---

## 📋 项目规范管理（`.trae/`）

25 个功能规范目录，每个包含 `spec.md`（需求文档）+ `checklist.md`（检查清单）+ `tasks.md`（任务分解）：

- `auth-profile-system` — 登录注册 + 个人详情
- `fastapi-backend-system` — FastAPI 后端系统
- `sidebar-glass-style` — 侧边栏玻璃拟态
- `pink-gold-ui-redesign` — 粉金 UI 重设计
- `global-button-upgrade` — 全局按钮升级
- `code-editor-runner` — 代码编辑器与运行器
- `interactive-terminal` — 交互式终端
- `programming-learning-integration` — 编程学习集成
- `home-carousel` — 首页轮播
- `particles-countdown` / `particles-explosion` — 粒子特效
- 以及更多 UI/布局/响应式修复规范

---

## 🎁 独立小项目：klkk/

一个温馨互动页面（4 个文件）：

| 文件 | 说明 |
|------|------|
| `index.html` | 入口，包含"开始"按钮 |
| `style.css` | 玻璃拟态弹窗样式，响应式适配 |
| `script.js` | 核心逻辑：206 条关心话语，每 200ms 随机弹出 |
| `background.jpg` | 背景图片 |

点击"开始"后，带彩色渐变文字的玻璃拟态弹窗在随机位置不断冒出，5 秒自动消失。

---

## 🛠️ 特殊技能：ex-skill

开源项目（`Winters/.trae/skills/ex-skill/`），功能是将聊天记录、照片、社交媒体数据蒸馏成 AI Skill，让 AI 能以某人的口吻、性格和记忆对话。

**核心架构：**
- SKILL.md + 5 步创建流程（录入 → 导入 → 分析 → 预览 → 输出）
- 输出：memories.md（共同记忆）+ persona.md（五层性格模型）+ meta.json

**Python 工具链：**
- `wechat_parser.py` — 微信聊天记录解析（txt/html/csv）
- `imessage_parser.py` — iMessage 聊天记录解析（macOS chat.db）
- `sms_parser.py` — 短信解析
- `social_media_parser.py` — 微博/豆瓣/小红书/Instagram 解析
- `photo_analyzer.py` — 照片 EXIF 分析
- `skill_writer.py` — Skill 文件管理与版本控制

**示例数据（小美）：**
- 完整共同记忆文档：关系概览、10 个重要时刻、共同爱好、专属暗号、情感模式
- 五层性格模型：核心性格 → 身份（ENFP） → 表达风格 → 情感逻辑 → 关系行为 → 边界与雷区

---

## 📝 ai-learning-plan.html

独立的 AI 全栈开发学习路线 / 任务追踪页面，紫色渐变配色，HarmonyOS Sans + Microsoft YaHei 字体。包含自定义 CSS 变量（primary 紫色 / success 绿色 / warning 橙色 / danger 红色）。
