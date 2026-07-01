# Changelog

Winters 项目更新日志。

## [v0.5.3] — 2026-07-01

### Added
- **前端全量 JS→TS 迁移** — 154 文件（122 `.vue` + 32 `.js`），vue-tsc 0 错误
- 新增 `/docs` 官方文档页面 — README + CHANGELOG 双标签渲染
- `tsconfig.json`、`vue-tsc` 类型检查
- Stop hook（会话结束自动检查 git + 文档）
- 新增 `CHANGELOG.md`
- **访客/登录主题区分** — 未登录默认手账风格(journal)，登录默认樱吹雪(sakura)+普通(standard)，登出保留设置

### Changed
- 默认外观偏好：颜色 `sakura`（樱吹雪）+ 风格 `standard`（普通）+ 圆角 `sharp`（直角）
- 版本号回退（TRAE 误标 v1.0.0）
- 项目卡片直接跳转目标页面，删除中间介绍页
- 全局工作流 7 步闭环（去 TRAE、补文档同步）
- 多 Agent 自动触发策略（重活 + 大量重复）
- 文档同步三层覆盖（全局 CLAUDE.md + 项目 CLAUDE.md + README.md）

### Fixed
- `backend/executor.py` — 3 处 dict key 缺引号（`error:` → `"error":`）
- `backend/models.py` — 正则改为 raw string；删除 `UserCreate` 重复字段
- `backend/routes/auth.py` — JWT secret 改为环境变量
- `backend/main.py` — 补充 `import os`
- `CodeLab.vue` — `(t as any)` 导致 i18n 模板变量不替换
- `ContributionHeatmap.vue` — 模板字符串导致英文翻译失效
- `useCountUp.ts` — 缺少 `target` 时显示 NaN
- `settings.ts` — 会话内登录/登出主题不切换（新增 `userStore.isLoggedIn` watcher）；`resetToDefaults` 浅拷贝 bug（改用 `deepClone`）
- `Docs.vue` — changelog 标签读错变量（`readmeRes` → `changelogRes`）；markdown 渲染从前端正则改为后端 Python 库
- `vite.config.js` — 代理端口回正 8001→8000（旧 zombie 进程已清除）
- `package.json` — 版本号 `0.0.0`→`0.5.3`，lint 脚本补 `.ts` 扩展名

### Refactored
- `settings.ts` — 提取 `baseDefaults` + spread 消除 75% 重复；`saveSettings` 加 300ms 防抖；`loadSettings` 复用 `useUserStore().isLoggedIn`
- `/docs` 渲染架构 — 前端 `marked`→后端 Python `markdown` 库，去掉浏览器端依赖
- `backend/main.py` — `/docs` API 加容错，`markdown` 库未安装时降级返回纯文本

### Removed
- 5 个遗留 `test_ws*.py` 临时调试脚本
- 30+ 过期 spec 归档到 `archive/`
- `ProjectDetail.vue` — 项目详情中间页

### Docs
- `README.md` 补全动效槽位、i18n、主题风格/圆角
- 新建 `CHANGELOG.md` — v0.1.0 ~ v0.5.3 完整记录

## [v0.5.2] — 2026-06-28

### Fixed
- `frontend/src/router/index.js` — 路由守卫由查 `isLoggedIn` flag 改为直接查 `winters_token`
- `frontend/src/views/ResetPassword.vue` — 清除模拟文案
- `frontend/src/views/Profile.vue` — 清除 setTimeout mock 数据加载
- `frontend/src/views/Login.vue` — 清除模拟 token 逻辑

### Added
- `frontend/src/components/Header.vue` — 导航栏新增「社区」入口

## [v0.5.1] — 2026-06-27

### Added
- `backend/crud.py` — 头像写入 user 表 avatar 字段
- `backend/routes/auth.py` — 社交登录自动创建 DB 用户
- `frontend/src/views/Login.vue` — 密码/验证码登录均接真 API
- `frontend/src/views/Register.vue` — 注册接真 API
- 验证码登录返回 JWT token（与密码登录统一）

### Fixed
- `frontend/src/views/Blog.vue` — posts/comments/tags 接真 API
- `frontend/src/views/Profile.vue` — 表单加 `caret-color` + `autocomplete` 属性
- `backend/routes/auth.py` — login 返回完整用户信息（nickname/phone/email），不含密码
- `frontend/src/views/Register.vue` — 参数匹配 `store.register(account, password, confirmPassword)`
- `backend/routes/auth.py` — login 返回 `dict(db_user)` 修复 Row 对象 JSON 序列化
- `backend/routes/community.py` — GET 无需认证，POST/PUT/DELETE 需登录

## [v0.5.0] — 2026-06-26

### Added
- `backend/routes/user.py` — profile 查询/更新/绑定/注销 全真 API
- `backend/routes/auth.py` — change-password 端点
- `backend/models.py` — UserCreate 新增 nickname/phone/email 可选字段
- `backend/routes/community.py` — bcrypt 密码加密 + JWT token + 社区 API 真用户认证

### Fixed
- `frontend/src/views/PostDetail.vue` — scroll-reveal 闪烁：watch 数据加载后手动 reveal()
- `frontend/src/views/Profile.vue` — 改密码接真 API

## [v0.4.4] — 2026-06-25

### Fixed
- `frontend/src/views/PostDetail.vue` — scroll-reveal 闪烁修复

## [v0.4.3] — 2026-06-25

### Added
- `frontend/src/views/Community.vue` — 发帖后自动刷新 + 空态引导

## [v0.4.2] — 2026-06-25

### Reverted
- 页面动效回退 — Home/Blog/Community 等 10 文件恢复改前状态

## [v0.4.1] — 2026-06-25

### Security
- bcrypt 密码加密 + JWT token
- 社区 API 真用户认证（非 mock）

## [v0.4.0] — 2026-06-25

### Added
- `frontend/src/views/Community.vue` — AI 社区帖子流（分页/筛选/排序）
- `frontend/src/views/PostEditor.vue` — 发帖编辑器（Markdown + 标签）
- `frontend/src/views/PostDetail.vue` — 帖子详情（评论/点赞，含 scroll-reveal 入场动效）
- `frontend/src/stores/community.js` — useCommunityStore（Pinia，后端 API 驱动）
- `backend/routes/community.py` — posts/comments/likes/tags 全 CRUD API

## [v0.3.5] — 2026-06-24

### Added
- Showcase 分页版 — 7 页面 77 组件正常渲染

## [v0.3.4] — 2026-06-24

### Fixed
- `frontend/src/components/SafeDemo.vue` — 组件隔离包裹器，单组件崩溃不影响全页
- slot 内容传入组件修复 — 61/76 组件正常渲染

## [v0.3.3] — 2026-06-24

### Fixed
- `frontend/src/components/RotatingText.vue` — props `texts` 类型由 string 改为 array，防止 showcase 白屏
- `frontend/src/components/TextPressure.vue` — 去除模板内 `<style v-html>` 错误嵌套

## [v0.3.2] — 2026-06-24

### Added
- **组件实验室** `/lab/showcase` — 84 组件画廊，7 子页面
  - `ShowcaseText.vue` — 文字特效（ShinyText/GlitchText/GradientText/DecryptedText/SplitText/TextPressure/TextType/RotatingText）
  - `ShowcaseHover.vue` — 悬停交互（GlareHover/StarBorder/useTilt/useMagnet/useSpotlight）
  - `ShowcaseEntry.vue` — 入场动画（ScrollReveal/ScrollVelocity/DecayCard/useBounceEntry/useBlurReveal/useCountUp/ScrollStack/Stepper/StaggeredMenu）
  - `ShowcaseBg.vue` — 背景装饰（DotField/Antigravity/ColorBends/Crosshair/MagicRings/Strands/CurvedLoop/Lanyard）
  - `ShowcaseUi.vue` — UI 组件（BounceCards/MasonryGrid/AnimatedList/CircularGallery/OrbitImages/DomeGallery/ImageTrail/CardSwap/InfiniteMenu/FlowingMenu/BubbleMenu/PillNav/VariableProximity/Shuffle/Stack）
  - `Showcase3d.vue` — 3D / 工具（CircularText/ContributionHeatmap）

## [v0.3.1] — 2026-06-24

### Added
- `frontend/src/components/BgDecorSlot.vue` / `CardHoverSlot.vue` / `ClickFeedbackSlot.vue` — 3 类动效槽位组件
- 全 Home 侧栏 3 卡接 CardHoverSlot + bgDecor 默认点阵

### Fixed
- 恢复原始 `Carousel.vue`（被 Workflow 错误覆盖）
- `frontend/src/stores/effects.js` — setSlot 用对象替换触发响应式，设置实时生效

## [v0.3.0] — 2026-06-24

### Added
- **动效槽位系统**
  - `frontend/src/stores/effects.js` — useEffectStore（9 槽位，localStorage 持久化）
  - `frontend/src/components/EffectSlot.vue` — 槽位组件容器
  - 9 个槽位：标题/卡片/按钮/背景/文字/点击/页面/导航/入场
  - 4 个动效槽位接通 — 设置面板可实时切换
- **全量 React Bits 搬迁** — 84 组件
- `frontend/src/views/lab/Game2048Lab.vue` — 2048 小游戏
- `frontend/src/views/lab/MinesweeperLab.vue` — 扫雷小游戏
- Lab 布局优化

### Fixed
- `frontend/src/components/HeadingEffect.vue` — import 路径全修 + 2 卡片接 CardHoverSlot
- 全站标题接入 effectStore — 标题动效可配置

## [v0.2.5] — 2026-06-23

### Added
- 14 组件全部接线 — 全站动效覆盖完成

### Changed
- Home Bento 瀑布流 + Community 双列 + Blog 卡片化布局（后回退）

## [v0.2.4] — 2026-06-23

### Added
- 标题动效实际应用 — GradientText / ShinyText 上线
- Login auth-card 加 `v-spotlight`
- `v-spotlight` / `v-tilt` / `v-magnet` 三个自定义指令注册 + 全站接线
- 动效全面铺开 — 所有卡片接入 `v-spotlight` + 聚光灯增强

## [v0.2.3] — 2026-06-23

### Added
- **Phase 4 — 全局收尾**：滚动条样式/选中文本颜色/文档同步

## [v0.2.2] — 2026-06-23

### Added
- **Phase 3 — card-spotlight 全局覆盖**
  - Pt1: App.vue / Header.vue / Home.vue
  - Pt2: Community.vue / Lab.vue
  - Pt3: Blog.vue / SettingsPanel.vue / Login.vue

## [v0.2.1] — 2026-06-23

### Added
- **Phase 2 — Medium 组件 10 件**：DotField/Antigravity/ColorBends/Crosshair/MagicRings/Strands/CurvedLoop/Lanyard（Canvas）/ ImageTrail（IO）/ CircularText（SVG）

## [v0.2.0] — 2026-06-22

### Added
- **Phase 0 — CSS 基础设施统一**：补全变量/建立 card 基类/动画提升/颜色清零
- **Phase 1 — Easy 动效 9 件套**
  - Composables: useSpotlight/useTilt/useMagnet/useClickSpark/useBlurReveal/useCountUp/useBounceEntry/useBorderGlow
  - Components: ShinyText/GlitchText
- `frontend/src/views/System.vue` — 自驱工作站架构文档页面，加入项目列表
- **React Bits 风格 UI 重设计方案书** — 24 交互 demo + 135 组件分类
- **AI 自执行施工计划** — 4 阶段 40+ 任务清单

## [v0.1.3] — 2026-06-21

### Added
- **全站 i18n** — zh-CN / zh-TW / en-US 三语，`frontend/src/locales/` 下 24+ 文件接入
- **8 套设计师主题** — journal/ink/aurora/sakura/forest/midnight/twilight/minimal + custom
  - `frontend/src/stores/settings.js` — 主题/字体/动画偏好，localStorage 持久化
  - `frontend/src/components/SettingsPanel.vue` — 三层导航
  - 主题通过 `data-color-theme` + `data-theme` 属性控制
- 手账风格纸质感 + 圆角/直角独立切换

## [v0.1.2] — 2026-06-21

### Added
- `frontend/src/views/Learning.vue` — AI 学习路线，6 阶段 21 周计划，进度本地持久化
- `frontend/src/views/Care.vue` — 200+ 条暖心话语弹窗，玻璃拟态
- `frontend/src/views/System.vue` — 自驱工作站架构文档页面

## [v0.1.1] — 2026-06-20

### Added
- **粒子特效系统** — `frontend/src/composables/useParticles.js`
  - Canvas 粒子，鼠标交互，主题自适应
  - 雪花飘落（普通页）+ 鼠标吸引/爆炸（登录页）
- **代码执行引擎** — `backend/executor.py`
  - 6 语言：C/Java/JS/TS/Python/PHP
  - xterm.js WebSocket 终端
- **认证系统骨架** — 密码登录/注册/验证码/第三方登录入口
- AI 社区功能完整实现（帖子流/发帖/详情/点赞/评论）

### Changed
- 项目结构重构 — 清理垃圾、整合功能

## [v0.1.0] — 2026-06-20

### Added
- 项目初始化 — Vue 3 + FastAPI + SQLite 全栈骨架
- `frontend/` — Vite 5 / Pinia / Vue Router 4
- `backend/` — FastAPI / Pydantic v2 / 原生 sqlite3
- 首页/动态/项目/实验室/联系/登录/注册 基础页面
- `README.md` — 项目总结 + GitHub 首页

[keepachangelog]: https://keepachangelog.com/zh-CN/1.0.0/
