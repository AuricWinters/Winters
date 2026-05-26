# 项目全景总结

```
D:\project\
├── Winters/                       # 主项目：AuricWinters 个人网站（全栈）
│   ├── backend/                   # FastAPI 后端（Python）
│   ├── frontend/                  # Vue 3 前端（JavaScript）
│   └── .trae/                     # 项目规范文档 & ex-skill
├── klkk/                          # 独立小项目：暖心弹窗互动页
└── ai-learning-plan.html          # AI 全栈开发学习路线追踪页
```

---

## 一、主项目：Winters（AuricWinters 个人网站）

### 1.1 技术栈总览

| 层级 | 技术 | 版本/说明 |
|------|------|-----------|
| 前端框架 | Vue 3 (Composition API) | 15 个页面，`<script setup>` 语法 |
| 构建工具 | Vite 5 | HMR、代码分割、路径别名 `@` → `src/` |
| 状态管理 | Pinia 3 | 4 个 store（settings / user / ai / data） |
| 路由 | Vue Router 4 | 14 条路由 + 懒加载 + `beforeEach` 守卫 |
| 代码编辑器 | Monaco Editor 0.55 | `@guolao/vue-monaco-editor` |
| 终端模拟 | xterm.js 6.0 + addon-fit 0.11 | WebSocket 交互式终端 |
| 代码高亮 | highlight.js 11.11 | 注册 8 种语言（c/cpp/java/js/ts/python/php） |
| 样式 | 原生 CSS (CSS Variables) | 6 套主题色 + 玻璃拟态 + 全响应式 |
| 代码规范 | ESLint 10.2 (flat config) + Prettier 3.8 | 自动格式化 |
| 后端框架 | FastAPI | uvicorn 热重载，port 8000 |
| 数据库 | SQLite（原生 sqlite3 模块） | 上下文管理器事务，无 ORM |
| 代码执行 | subprocess | 6 种语言，临时目录隔离，shell=False |
| 数据校验 | Pydantic v2 | 12 个数据模型 |

---

## 二、后端架构（`Winters/backend/`）

### 2.1 文件结构

```
backend/
├── main.py              # 应用入口（85行）
├── models.py            # Pydantic v2 数据模型（388行）
├── database.py          # SQLite 连接管理（92行）
├── crud.py              # 数据操作函数（449行）
├── executor.py          # 代码执行引擎（759行）
├── utils.py             # 验证码/第三方登录工具（159行）
├── requirements.txt     # Python 依赖
└── routes/
    ├── auth.py          # 认证端点（432行）
    ├── code.py          # 代码执行 API（222行）
    ├── user.py          # 用户资料 API（128行）
    └── websocket.py     # WebSocket 交互终端（532行）
```

### 2.2 核心模块详解

#### main.py — 应用入口
- 使用 `@asynccontextmanager` 实现 lifespan 生命周期管理，启动时调用 `database.init_db()`
- CORS 中间件：允许所有来源（`allow_origins=["*"]`），支持 credentials
- 挂载 4 个路由模块：`auth`（`/api/auth`）、`code`（`/api/code`）、`user`（`/api/user`）、`websocket`（`/ws`）
- 健康检查端点 `GET /` 返回 status/message/version

#### models.py — 数据模型（12 个 Pydantic v2 模型）
- **UserBase**: account, password, nickname, phone, email, avatar
- **UserCreate**: account(3-30字符), password(6-32), phone(regex `^1[3-9]\d{9}$`), email(email格式), nickname(1-20)
- **UserLogin**: account + password
- **UserResponse**: 从 DB 返回的用户信息（不含密码）
- **UserProfileUpdate**: 可选更新 nickname/phone/email/avatar
- **MessageResponse**: 通用消息响应 `{message: str}`
- **CodeExecuteRequest**: code(1-50000字符), language(6种), stdin(可选), timeout(1-60s, 默认10s)
- **SendCodeRequest**: phone(regex验证)
- **CodeLoginRequest**: phone + code(regex `^\d{6}$`)
- **ResetPasswordRequest**: phone + code + new_password + confirm_password
- **SocialLoginRequest**: provider(literal "wechat"|"github") + code
- **SocialLoginResponse**: user_id, account, nickname, provider

#### database.py — 数据库管理
- `get_db()` 上下文管理器：自动 `conn.commit()` 或 `conn.rollback()`
- `row_factory = sqlite3.Row` 支持字典式访问
- `PRAGMA foreign_keys = ON` 启用外键约束
- `init_db()` 创建 users 表：id(PRIMARY KEY AUTOINCREMENT), account(UNIQUE NOT NULL), password, nickname, phone(索引), email, avatar, created_at(TIMESTAMP DEFAULT CURRENT_TIMESTAMP), updated_at
- 向后兼容 `ALTER TABLE` 迁移：添加 nickname/phone/email 列、phone 索引

#### crud.py — 数据操作（10 个函数）
- `get_user_by_account(account)` — 按账号查询，用于登录校验
- `create_user(user_data: UserCreate)` — 插入新用户，自动检查 account/phone 唯一性
- `verify_password(plain, hashed)` — 明文密码比对（生产环境应使用 bcrypt）
- `get_all_users(page, page_size)` — 分页查询，默认 page=1, page_size=20
- `delete_user(user_id)` — 按 ID 删除
- `get_user_by_id(user_id)` — 按 ID 查询
- `update_user_profile(user_id, updates)` — 动态构建 SET 子句更新
- `reset_password(account, new_password)` — 按账号重置密码
- `get_user_by_phone(phone)` — 按手机号查询
- `reset_password_by_phone(phone, new_password)` — 按手机号重置

#### executor.py — 代码执行引擎（CodeExecutor 类）
- **`_find_command(lang)`** — 路径解析：优先 Windows 环境变量，回退到 WSL/Cygwin/MinGW 路径
- **`execute(code, language, stdin, timeout)`** — 主执行逻辑：
  - JS: `node --input-type=module -e "<code>"` 或 `node <file>.js`（含 import 时）
  - TypeScript: `npx tsx <file>.ts`
  - ArkTS: Swift 编译器模拟（基本语法）
  - Python: `python <file>.py`
  - C: `gcc -o <exe> <file>.c` 编译后执行
  - Java: `javac Main.java && java Main`（要求 public class Main）
  - PHP: `php <file>.php`
- **安全措施**：`shell=False` 防注入、临时目录隔离（`tempfile.mkdtemp`）、超时控制（默认10s）、`_safe_delete_files()` 清理
- **返回** JSON 含 stdout, stderr, exit_code, truncated 标记

#### utils.py — 工具函数
- **内存验证码存储**：字典 `{phone: (code, expire_timestamp)}`，5 分钟过期
- `generate_verification_code()` — 6位随机数字
- `verify_code(phone, code)` — 校验并删除已用验证码
- `send_verification_code(phone)` — 真实环境接短信API，当前打印日志
- 模拟第三方登录：`mock_wechat_login(code)` / `mock_github_login(code)`
- `create_or_update_social_user(provider, social_id, nickname, avatar)` — 社交账号创建或更新

### 2.3 API 端点一览

```
GET  /                              # 健康检查 → {status, message, version}
POST /api/auth/register             # 用户注册 → {message, user: UserResponse}
POST /api/auth/login                # 密码登录 → {message, user: UserResponse}
POST /api/auth/send-code            # 发送验证码 → {message}
POST /api/auth/login/code           # 验证码登录 → {message, user: UserResponse}
POST /api/auth/reset-password       # 验证码重置密码 → {message}
POST /api/auth/social/login         # 第三方登录(模拟) → {message, user, provider}
GET  /api/auth/social/callback/{provider}  # OAuth 回调(模拟)
POST /api/code/execute              # 代码执行 → {stdout, stderr, exit_code, truncated}
GET  /api/code/languages            # 支持语言列表 → [{id, name, version, runtime}]
GET  /api/user/profile?user_id=N    # 获取用户资料
PUT  /api/user/profile              # 更新用户资料
WS   /ws/code/execute               # WebSocket 交互式终端
```

### 2.4 WebSocket 交互式终端（`routes/websocket.py`）

- **协议**：
  - Client → Server: `{action: "execute"|"input"|"signal", code?, language?, timeout?, data?}`
  - Server → Client: `{type: "output"|"error"|"exit", data: str}`
- 使用 `asyncio.Queue` 在线程和协程间传递数据
- `subprocess.Popen` 启动子进程，daemon 线程分别读取 stdout/stderr
- `asyncio.wait_for` 实现超时控制
- Windows 下使用 `CREATE_NO_WINDOW` 标志
- `active_processes` 字典跟踪活跃进程

---

## 三、前端架构（`Winters/frontend/`）

### 3.1 目录结构

```
src/
├── main.js                          # 应用入口
├── App.vue                          # 根组件
├── router/index.js                  # 14 条路由
├── stores/                          # Pinia 状态管理
│   ├── settings.js                  # 主题/语言/深色模式/字体
│   ├── user.js                      # 用户认证（本地模拟+后端API）
│   ├── ai.js                        # AI 聊天（Ollama/OpenAI）
│   └── data.js                      # 静态 JSON 数据
├── composables/                     # 组合式函数
│   ├── useSettings.js               # 设置逻辑封装
│   ├── useToast.js                  # 全局 Toast
│   ├── useScrollReveal.js           # 滚动入场动画
│   ├── useBackToTop.js              # 返回顶部
│   └── useParticles.js              # 粒子背景封装
├── components/                      # 全局组件
│   ├── Header.vue                   # 导航栏（695行）
│   ├── Footer.vue                   # 页脚（17行）
│   ├── SettingsPanel.vue            # 设置面板（1200行）
│   ├── ToastNotification.vue        # Toast 通知（241行）
│   ├── BackToTop.vue                # 返回顶部（30行）
│   ├── Carousel.vue                 # 轮播组件（390行）
│   ├── ContributionHeatmap.vue      # 贡献热力图（418行）
│   ├── AnimatedCharacters.vue       # 角色动画（620行）
│   ├── AnimatedCharactersSimple.vue  # 简化版角色动画
│   ├── EyeBall.vue                  # 眼球组件（118行）
│   └── Pupil.vue                    # 瞳孔组件（87行）
├── views/                           # 页面视图
│   ├── Home.vue                     # 首页: 三栏布局
│   ├── Blog.vue                     # 博客: 时间线+分类
│   ├── Projects.vue                 # 项目: 响应式网格
│   ├── ProjectDetail.vue            # 项目详情
│   ├── Lab.vue                      # 实验室入口: Bento Grid
│   ├── AI.vue                       # AI 聊天页
│   ├── Contact.vue                  # 联系表单
│   ├── Drive.vue                    # 云盘: 上传/下载
│   ├── Login.vue                    # 登录（1790行）
│   ├── Register.vue                 # 注册（1107行）
│   ├── ResetPassword.vue            # 密码重置（984行）
│   ├── Profile.vue                  # 个人中心
│   └── lab/
│       ├── ParticleLab.vue          # Canvas 粒子实验室（538行）
│       ├── PianoLab.vue             # Web Audio 钢琴（623行）
│       ├── CodeLab.vue              # 编程学习 IDE（1939行）
│       └── tutorials/               # 教程数据
│           ├── index.js             # 动态导入 MD 教程
│           ├── mdParser.js          # MD→JSON 解析器（351行）
│           ├── c.md                 # C 语言教程
│           ├── java.md              # Java 教程
│           ├── javascript.md        # JavaScript 教程
│           ├── typescript.md        # TypeScript 教程
│           ├── python.md            # Python 教程
│           ├── php.md               # PHP 教程
│           └── arkts.md             # ArkTS 教程
├── data/                            # 静态数据
│   ├── profile.json                 # 个人资料
│   ├── projects.json                # 项目列表
│   └── blogs.json                   # 博客文章（3篇）
├── utils/
│   ├── particles.js                 # 粒子系统（1133行）
│   └── throttle.js                  # 节流/防抖（24行）
└── styles/
    ├── main.css                     # 样式入口 + 按钮设计系统
    └── modules/
        ├── variables.css            # CSS 变量 + 7套主题
        ├── base.css                 # 全局重置 + 字体栈
        ├── header.css               # 导航栏玻璃拟态
        ├── layout.css               # 三栏网格 + 6断点
        ├── components.css           # 组件样式
        ├── features.css             # 聊天/表单样式
        └── utilities.css            # 工具类 + 无障碍
```

### 3.2 路由全景（14 条）

| 路径 | 页面组件 | 说明 | meta |
|------|----------|------|------|
| `/` | Home | 三栏个人主页 | — |
| `/blog` | Blog | 时间线博客（全部/项目/学习/生活） | — |
| `/projects` | Projects | 项目作品集响应式网格 | — |
| `/projects/:id` | ProjectDetail | 项目详情（介绍+功能+链接） | — |
| `/lab` | Lab | 实验室入口（5个Bento卡片） | — |
| `/lab/particles` | ParticleLab | Canvas 粒子交互 | `fullWidth: true` |
| `/lab/piano` | PianoLab | Web Audio 钢琴 | `fullWidth: true` |
| `/lab/code` | CodeLab | 编程 IDE（Monaco + xterm + WS） | — |
| `/ai` | AI | AI 聊天（Ollama/OpenAI） | — |
| `/drive` | Drive | 云盘文件管理 | — |
| `/contact` | Contact | 联系表单 | — |
| `/login` | Login | 登录（密码/验证码/第三方） | — |
| `/register` | Register | 注册 | — |
| `/reset-password` | ResetPassword | 密码重置 | — |
| `/profile` | Profile | 个人中心 | `requiresAuth: true` |

`beforeEach` 守卫检查 `localStorage.isLoggedIn`，对 `requiresAuth` 页面未登录重定向到 `/login`。

### 3.3 核心组件详解

#### App.vue（140行）
- 根组件结构：`Header` + `<router-view>` (含 fade 过渡) + 条件渲染 `Footer`/`BackToTop`
- 根据 `route.meta.fullWidth` 切换 body class（全宽模式）
- `SettingsPanel` 通过 overlay + `window.openSettingsPanel()` 全局打开
- `onMounted` 中暴露 `window.openSettingsPanel` 全局函数

#### Header.vue（695行）
- 固定定位顶部导航栏，玻璃拟态样式（`backdrop-filter: blur(12px)`）
- 桌面端：glass-radio-group + glider 滑动高亮动画（鼠标 hover 跟踪移动）
- 7个导航项：首页、博客、项目、实验室、AI、云盘、联系
- 移动端汉堡菜单：三段横线动画（旋转45度→X形），滑出式侧边导航
- 用户头像下拉菜单（设置/个人中心/退出登录）
- `window.mouse` 全局鼠标坐标跟踪（用于粒子交互）

#### SettingsPanel.vue（1200行）
- 右侧滑出面板（360px宽，`right: -400px` → `right: 0` 动画）
- **主题颜色**：9 种预设（light/dark/default/pink-gold/blue-purple/green-teal/orange-red/purple-pink/custom/auto），横向滚动 + 滚轮水平滚动
- **自定义主题**：折叠面板，3 种模式（单色/双拼/三色），原生 `<input type="color">` + 文本输入
- **深色模式**：浅色/深色/自动（`matchMedia` 系统检测）
- **外观**：字体大小（小/中/大）、动画开关
- **语言**：简体中文/English/日文（仅 UI 切换）
- 重置按钮带确认对话框
- 完整深色模式适配（`prefers-color-scheme: dark`）

#### Carousel.vue（390行）
- 4 个默认轮播项（图片+标题+描述），支持 `items` prop 自定义
- 自动播放（5s 间隔），前一张/后一张导航按钮
- 底部圆点指示器
- CSS `transform` 滑动过渡，响应式适配

#### ContributionHeatmap.vue（418行）
- 6 个月活动热力图（52 列 × 7 行网格）
- 随机样本数据生成器（加权随机，工作日概率更高）
- 北京时间时区偏移计算（`(utcHour + 8) % 24`）
- 5 级强度颜色（紫色-粉色渐变）
- 进度条显示活跃工作日百分比
- `isWorkday` 检测（周一至周五）

#### AnimatedCharacters.vue（620行）
- 4 个角色形状（紫色/黑色/橙色/黄色矩形 + CSS `border-radius`）
- 鼠标跟随瞳孔（`EyeBall`/`Pupil` 子组件，限制眼球在白框内）
- 打字动画：触发时身体 Z 形抖动（`translateY` 关键帧）
- 密码输入动画：窥视姿态（身体前倾 + 瞳孔放大）
- 随机眨眼计时器（3-7秒间隔，眨眼持续 150ms）
- 基于鼠标位置的身体倾斜（`skewX/skewY`）

#### EyeBall.vue / Pupil.vue
- 眼球组件：白底圆形 + 内部 Pupil 子组件
- 瞳孔跟踪：计算鼠标→眼球中心角度，限制在 `maxDistance` 半径内
- 支持 `forceLookX`/`forceLookY` 强制凝视方向（用于打字动画）
- 可配置大小/颜色/最大距离

#### BackToTop.vue（30行）
- 使用 `useBackToTop` composable（throttle 100ms, 阈值 300px）
- SVG 向上箭头图标，hover 上浮效果

#### ToastNotification.vue（241行）
- `TransitionGroup` 容器，底部右侧定位（`bottom: 20px; right: 20px`）
- 3 种类型：success（绿色左边框+对勾）、error（红色左边框+X）、info（主题色左边框+i）
- 自动移除（默认 3s），手动关闭按钮
- CSS slide 进入动画

### 3.4 页面视图详解

#### Home.vue（354行）— 三栏个人主页
- **左栏（300px）**：头像（110px 圆角矩形）+ 姓名/头衔 + 座右铭（展开/收起）+ 所在地（北京）+ 个人时间线
- **中栏（flex:1）**：Carousel 轮播 + ContributionHeatmap 热力图 + 技能分栏（左侧技能条百分比 + 右侧技能标签网格）
- **右栏（300px）**：精选项目卡片 + 爱好/网站图标网格 + 站点统计（安全运行天数从 2024-01-20 计算、今日访问量从 localStorage 累加）

#### Blog.vue（254行）
- 分类筛选：全部/项目/学习/生活（高亮按钮组）
- 骨架屏加载状态（shimmer 动画）
- 时间线列表展示（date + title + summary），从 `dataStore.blogs` 获取
- 空状态提示

#### Projects.vue（271行）
- 响应式网格（`grid-template-columns: repeat(auto-fill, minmax(320px, 1fr))`）
- 项目卡片：状态徽章（已完成/进行中）、技术栈标签、主次操作按钮
- 玻璃拟态 hover 效果（`translateY(-4px)` + 阴影增强）

#### ProjectDetail.vue（347行）
- 从 `route.params.id` 查找项目
- 玻璃卡片布局：头部（状态+技术标签）+ 双栏（描述+功能列表 70% / 侧边链接+GitHub 30%）
- 404 状态：项目未找到时显示错误页

#### Lab.vue（587行）— Bento Grid 实验室入口
- 3 列 Bento Grid 布局（`grid-template-columns: repeat(3, 1fr)`）
- 5 个实验卡片（粒子实验室/钢琴实验室/物理引擎/CodeLab/正则实验室），含 WIP 徽章
- 卡片交错入场动画（`animation-delay` 递增）
- 每卡片独特 mesh 渐变背景 + SVG 图标 + hover 白色光晕扩散

#### AI.vue（727行）
- 聊天界面：消息列表 + 打字指示器（3个跳动圆点）
- 提供商切换：Ollama / OpenAI 标签页
- 设置模态框：模型名称输入 + API 地址 + 连接测试按钮
- 对话历史 `localStorage` 持久化（上限 50 条）
- 消息发送通过 `aiStore.sendMessage`，含 loading 状态

#### Contact.vue（223行）
- 联系方式卡片：QQ/Email/GitHub（带图标 + hover 左移动画）
- 消息表单：姓名/邮箱/内容（含验证），提交到 `/api/contact/`
- 失败回退到本地 Toast 通知

#### Drive.vue（396行）
- 文件列表：文件名 + 类型图标（按扩展名匹配）+ 大小 + 日期
- 上传/下载/删除操作
- 存储空间进度条（已用/总共，10GB 总量）
- 骨架屏加载态 + 空状态

#### Profile.vue（929行）
- 用户头像卡片 + 信息编辑表单（昵称/手机号/邮箱）
- 密码修改区域（原密码 + 新密码 + 确认）
- 安全设置卡片
- `onMounted` 中检查 `isLoggedIn`，未登录弹 Toast + 跳转
- 字段级验证（手机号 regex、邮箱格式、密码长度）

#### Login.vue（1790行）— 登录页
- 左：粉红渐变品牌区 + AnimatedCharacters 动画角色
- 右：玻璃拟态卡片（`backdrop-filter: blur(20px)`）
- **密码登录**：手机号 + 密码 + 记住我复选框 + 忘记密码链接
- **验证码登录**：手机号 + 6位验证码 + 60s 倒计时获取按钮
- **注册表单**（内嵌于 loginType='register'）：用户名 + 邮箱 + 密码
- **第三方登录**：微信（绿色SVG）+ GitHub（黑色SVG）
- 背景：3 个浮动渐变圆球（`filter: blur(80px)` + 20s 动画）+ 网格纹理
- 表单验证（手机号 regex `^1[3-9]\d{9}$`、邮箱、密码4-32字符）
- 错误抖动动画（`translateX` 关键帧 0.5s）

#### Register.vue（1107行）— 注册页
- 与 Login 相同布局（粒子背景 + 浮动渐变 + AnimatedCharacters + 玻璃卡片）
- 表单字段：手机号 + 邮箱 + 密码 + 确认密码
- 确认密码一致性验证
- 第三方注册按钮（微信/GitHub，显示"功能开发中"）
- 底部"已有账号？立即登录"链接

#### ResetPassword.vue（984行）— 密码重置页
- 与 Login/Register 相同视觉风格
- 表单：手机号（+86前缀）+ 验证码（60s倒计时）+ 新密码 + 确认新密码
- 调用 `POST /api/auth/send-code` 和 `POST /api/auth/reset-password`
- 成功后 2s 跳转登录页

### 3.5 Lab 子页面详解

#### ParticleLab.vue（538行）
- 全屏 Canvas 粒子系统 + 右侧控制面板
- 控制参数：粒子数量(50-500)、连接距离(0-300)、速度(0.1-2)、颜色选择(7色)、鼠标模式(吸引/排斥/无)、连接开关
- Particle 类：速度向量、鼠标交互（吸引/排斥）、边界回弹
- `hexToRgb` 颜色转换工具函数
- 响应式 Canvas 尺寸

#### PianoLab.vue（623行）
- Web Audio API 钢琴：10 白键(C4-E5) + 7 黑键（标准钢琴布局）
- 键盘映射：白键 A-L，黑键 W/E/T/Y/U/O/P
- AudioContext → OscillatorNode（4种波形: sine/square/sawtooth/triangle）→ GainNode → ConvolverNode(reverb)
- 音量滑块 + 混响滑块
- 频率可视化 Canvas（实时 FFT 频谱图）
- 按键 CSS 动画（按下变暗 + 缩小）

#### CodeLab.vue（1939行）— 编程学习实验室
- **左侧栏**：语言选择（C/Java/JS/TS/Python/PHP/ArkTS），radio-button + glider 滑条动画，可折叠（280px ↔ 72px）
- **主区域**：当前语言标题 + 学习任务卡片网格（入门/进阶/高级难度标签）
- **教程弹窗**（全屏模态框，`backdrop-filter: blur(4px)`）：
  - **左侧 55%**：教程文档（MD 风格渲染）：
    - 文档标题 + 难度徽章
    - 代码块：GitHub Light 风格（`#f6f8fa` 背景），顶部语言标签 + 复制按钮（SVG 复制/对勾切换），带行号（40px 灰色右对齐），highlight.js 语法高亮（8 种覆盖样式）
    - 说明文字：左侧灰色竖线引用样式 + inline code（粉红背景）+ **加粗**
    - 上下篇导航按钮（粉红渐变 + 光泽扫过动画）
  - **右侧 45%**：代码编辑器：
    - Monaco Editor（`@guolao/vue-monaco-editor`），14px 字体，minimap 关闭，自动布局
    - 工具栏：运行(粉红渐变) / 重置 / 清空
    - xterm.js 终端（220px 高，暗色主题，13px Consolas 字体，16 色 ANSI）
    - WebSocket 连接后端 `/ws/code/execute`，支持 stdin 交互输入
    - JS 前端直接执行（`new Function()`），其他语言 WebSocket 后端执行
    - 运行状态指示器（绿色就绪/黄色运行中/红色断开）

#### 教程 MD 文件解析系统
- 7 个 MD 教程文件，各语言包含 YAML front matter（id/name/icon/version/description）
- `mdParser.js`（351行）：完整 Markdown 解析器
  - `parseTutorialMd()`: 分离 front matter + 正文 → 结构化 JSON
  - YAML 解析：`key: value` 正则匹配
  - 教程解析：`## Title <!-- tutorial-id: xxx | icon: xxx | difficulty: xxx -->`
  - 示例解析：`### Title` → 代码块(```` ``` ````) + 引用块(`>`) 或普通段落
  - `validateParsedData()`: 递归验证所有必需字段
- `index.js`: `import.meta.glob('./*.md', { as: 'raw', eager: true })` 动态导入，调用 `parseTutorialMd` 转换

### 3.6 状态管理（Pinia Stores）

#### settings.js（203行）
- State: theme(9种), darkMode(light/dark/auto), animationEnabled(bool), fontSize(small/medium/large), customTheme({mode, colors:{primary,secondary,accent}})
- 所有状态 localStorage 持久化（`$subscribe` 自动保存）
- `applyTheme()`: 设置 `data-theme`、`data-color-theme` 属性，动态注入 CSS 变量到 `:root`（7套完整主题色板 + 自定义颜色生成 `--primary`/`--primary-dark`/`--primary-light`/`--secondary`/`--bg-primary-light`）
- 系统深色模式检测：`window.matchMedia('(prefers-color-scheme: dark)')`
- Actions: setTheme/setDarkMode/setAnimationEnabled/setFontSize/setLanguage/setCustomThemeMode/setCustomThemeColor/resetSettings

#### user.js（213行）— 本地模拟 + 后端 API 混合
- State: user, token, refreshToken, isLoggedIn(从localStorage恢复)
- `login(account, password)` — 先尝试后端 API，失败回退本地模拟（mockGenerateToken/mockValidateUser）
- `loginByCode(phone, code)` — 后端验证码登录
- `register(account, email, password)` — 后端注册
- `logout()` — 清除所有 localStorage 项 + 重置 state
- `getAuthHeaders()` — 返回 `{Authorization: Bearer <token>}`
- `refreshTokenFunc()` — 无操作（占位）

#### ai.js（129行）
- State: provider(ollama/openai), model, apiUrl, messages(上限50条), isLoading
- `sendMessage(content)` — 构建请求体 → `POST /api/ai/chat/proxy`
- Provider 切换时重置对话历史
- Ollama/OpenAI 请求格式差异自动适配

#### data.js（17行）
- 静态导入 `profile.json`/`projects.json`/`blogs.json`
- Getters: `latestBlogs`(前3)、`featuredProjects`(前2)

### 3.7 组合式函数（Composables）

#### useSettings.js（154行）
- 封装 settings store 的常用操作
- 提供 themeOptions/darkModeOptions/fontSizeOptions/languageOptions 配置数组
- `toggleTheme()` 循环切换 light→dark→auto
- `systemThemeListener` 在 auto 模式下跟踪系统偏好

#### useToast.js（38行）
- 全局响应式 `toasts` 数组（各组件共享同一实例）
- `showToast(message, type, duration=3000)` — 添加 toast，自动移除
- `removeToast(id)` — 手动关闭
- `clearAll()` — 清空所有

#### useScrollReveal.js（32行）
- IntersectionObserver 监听 `.scroll-reveal` 元素
- `threshold: 0.1`（10% 可见时触发）
- 添加 `.revealed` class（opacity 0→1, translateY 30px→0）

#### useBackToTop.js（50行）
- `window.scrollY` 监听（throttle 100ms）
- `isVisible`: scrollY > 300
- `scrollToTop()`: `window.scrollTo({top:0, behavior:'smooth'})`

#### useParticles.js（59行）
- `useParticles(selector, isLoginPage)` — 初始化 particles.js
- 配置：`maxParticles: 250`（登录页）、粉色色板、点击爆炸
- 依赖全局 `Particles` 类（来自 `utils/particles.js`）

### 3.8 设计系统

#### CSS 变量系统（`variables.css` 197行）
- 7 套完整主题色板：
  1. **default** — `#6366f1`(靛蓝) / `#EC4899`(粉红)
  2. **dark** — `#1e293b`(深灰) / `#0f172a`(更深)
  3. **pink-gold** — `#EC4899` / `#F59E0B`(金)
  4. **blue-purple** — `#6366f1` / `#8b5cf6`(紫)
  5. **green-teal** — `#10b981`(绿) / `#0ea5e9`(青)
  6. **orange-red** — `#f97316`(橙) / `#ef4444`(红)
  7. **purple-pink** — `#8b5cf6` / `#ec4899`
- 公共变量：`--radius: 16px`, `--transition: all 0.3s ease`，阴影层级（sm/md/lg/purple）
- `prefers-reduced-motion` 尊重用户系统偏好
- 字体缩放 class（`.font-small` / `.font-medium` / `.font-large`）

#### 全局按钮设计系统（`main.css`）
- `.btn-primary`: 粉红渐变(`#EC4899`→`#DB2777`) + 白色光晕(`box-shadow`) + hover 上浮 + 光泽扫过(`::before`)
- `.btn-secondary`: 玻璃态毛玻璃效果（`background: var(--bg-glass)` + `backdrop-filter: blur()`）
- `.btn-ghost`: 透明背景 + 边框 hover 渐变

#### 6 个响应式断点（`layout.css`）
- 1440px: 隐藏 profile sidebar
- 1200px: 缩小字号/间距
- 1100px: 导航项紧凑排列
- 992px: sidebar 双列 → 单列，桌面导航 → 汉堡菜单
- 768px: 单列布局，Header 高度缩小到 60px
- 480px: 全宽无边距，Header border-radius 归零

#### 视觉特色
- 玻璃拟态：`background: rgba(255,255,255,0.85)` + `backdrop-filter: blur(20px)` + `border: 1px solid rgba(255,255,255,0.5)`
- 径向渐变背景：body 固定 2 个径向渐变（粉色+金色），`background-attachment: fixed`
- 滚动揭示：`.scroll-reveal` + IntersectionObserver（opacity 0→1, translateY 30→0）
- 骨架屏：shimmer 动画（`background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)`）
- 登录页浮动光球：3 个 400-600px 模糊光球（`filter: blur(80px)`），20s float 循环动画
- 网格纹理：`background-image: linear-gradient(...)` 50px 间距

#### 粒子系统（`utils/particles.js` 1133行）
- 原始 particles.js 库的增强版
- **非登录页模式（雪花）**：
  - 初始生成 50 个雪花，每 500ms 补充 1 个
  - 3 种雪花类型：六边形(`_drawHexFlake`)、星形(`_drawStarFlake`)、树枝形(`_drawBranchFlake`)
  - 匀速下降 + 轻微水平摇摆 + 旋转
  - 飘出底部后在顶部重生（随机 x + 重置速度）
  - 以 1920px 宽度为基准等比缩放
- **登录页模式（粒子+鼠标互动）**：
  - 一次性生成所有粒子（等比例缩放，最少 50，minDistance ≥ 80）
  - 中心粒子（50%概率）：被鼠标吸引聚集，2.026 秒后脱离
  - 圆周粒子（50%概率）：围绕鼠标在 `attractRadius`(200px) 圆周旋转
  - 点击爆炸：计算距离+角度，施加径向爆炸速度，1.5 次方衰减曲线，持续 2s
  - 边界回弹（反弹系数 0.6-0.8）+ 速度上限
  - 随机微扰动（5% 概率每帧）增加自然感
  - Polyfill 兼容 `requestAnimationFrame`

---

## 四、独立小项目：klkk/

4 个文件的互动页面（206 条关心话语）：

| 文件 | 行数 | 说明 |
|------|------|------|
| `index.html` | 19 | 入口 HTML，含"开始"按钮 |
| `style.css` | 192 | 玻璃拟态弹窗样式 + 响应式 |
| `script.js` | 349 | 核心逻辑 |
| `background.jpg` | — | 背景图片 |

**核心逻辑**：
- 点击"开始"按钮 → 按钮淡出 → `setInterval` 每 200ms 调用 `createPopup()`
- `createPopup()`: 随机选取话语(206条) → 随机位置(viewport 内) → 随机渐变色(10色中选2不同) → 创建弹窗 DOM
- 弹窗：白色玻璃拟态（`rgba(255,255,255,0.6)` + `blur(15px)`），渐变彩色文字（`background-clip: text`），5s 后自动关闭（淡出+移除）
- 关闭按钮点击手动移除

---

## 五、ex-skill 开源项目（`Winters/.trae/skills/ex-skill/`）

将聊天记录、照片、社交媒体数据蒸馏成 AI Skill，让 AI 以某人（如前任）的口吻、性格和记忆对话。

### 核心架构

| 文件 | 说明 |
|------|------|
| `SKILL.md` | 624 行中英双语完整 Skill 定义 |
| `README.md` / `README_EN.md` | 项目说明 |
| `INSTALL.md` | 安装指南 |
| `requirements.txt` | Python 依赖 |
| `prompts/` | 7 个分析/构建 prompt 模板 |
| `tools/` | 7 个 Python 工具脚本 |
| `exes/example_xiaomei/` | 示例输出（小美） |

### 5 步创建流程
1. **信息录入**：昵称、基本信息、性格画像（3 个问题）
2. **原材料导入**：微信/iMessage/短信/照片/社交媒体/PDF/图片/粘贴文本
3. **分析**：线路 A（共同记忆）+ 线路 B（Persona）
4. **预览**：摘要展示
5. **输出**：`memories.md` + `persona.md`（五层性格模型）+ `meta.json` + `SKILL.md`

### Python 工具链（7 个）
- `wechat_parser.py` — 微信聊天记录解析（txt/html/csv，`{时间} {发送人}: {内容}` 格式）
- `imessage_parser.py` — iMessage 聊天记录解析（macOS chat.db 直接读取或导出文件）
- `sms_parser.py` — 短信记录解析
- `social_media_parser.py` — 社交媒体解析（微博/豆瓣/小红书/Instagram/text）
- `photo_analyzer.py` — 照片 EXIF 时间线提取
- `skill_writer.py` — Skill 文件管理与列表
- `version_manager.py` — 版本备份/回滚

### 示例数据（小美）
- `memories.md`：关系概览 + 10 个重要时刻 + 共同日常 + 偏好习惯 + 专属暗号 + 冲突模式 + 情感动态
- `persona.md`：五层模型 — Layer 0: 核心性格 → Layer 1: 身份（ENFP）→ Layer 2: 表达风格 → Layer 3: 情感逻辑 → Layer 4: 关系行为
- `meta.json`：元数据（创建时间、版本、profile、tags、knowledge_sources）

### 进化模式
- 追加新文件时增量合并（不覆盖）
- 对话纠正（"她不会这样"）→ 识别纠正类型 → 追加到 Correction Log
- 版本管理：备份/回滚/删除

---

## 六、ai-learning-plan.html

独立的 AI 全栈开发学习路线 / 任务追踪页面：

- 紫色渐变配色（`--primary: #4f46e5`）
- HarmonyOS Sans + Microsoft YaHei 字体栈
- 设备选择器（NPU/GPU 按钮切换）
- 分阶段学习计划（Phase 1-4）
- 自定义 CSS 变量：`--success: #10b981` / `--warning: #f59e0b` / `--danger: #ef4444` / `--api: #3b82f6`
- 响应式设计

---

## 七、项目规范管理（`Winters/.trae/`）

25 个功能规范目录，每个含 `spec.md`（需求文档）+ `checklist.md`（检查清单）+ `tasks.md`（任务分解），覆盖 auth-profile-system、fastapi-backend-system、code-editor-runner、interactive-terminal、particles-explosion、global-button-upgrade 等所有功能模块。

---

## 八、配置文件

| 文件 | 关键配置 |
|------|----------|
| `vite.config.js` | port 3000, proxy `/api`→`localhost:8000`, `@`→`src/`, manual chunk(vendor: vue+vue-router) |
| `eslint.config.js` | Flat config, Vue 3 recommended, `vue/multi-word-component-names: off`, `no-console: warn` |
| `.prettierrc` | semicolon, singleQuote, tabWidth 2, printWidth 100, trailingComma es5, arrowParens always, LF |
| `package.json` | Vue 3.4, vue-router 4.3, pinia 3.0, monaco-editor 0.55, xterm 6.0, highlight.js 11.11, vite 5.2 |
| `.gitignore` | node_modules, __pycache__, .venv, dist, .env, .DS_Store, Thumbs.db |
| `requirements.txt` | fastapi>=0.100.0, uvicorn[standard]>=0.23.0, pydantic>=2.0.0, websockets>=12.0 |
