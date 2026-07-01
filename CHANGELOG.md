# Changelog

Winters 项目更新日志，遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/) 格式。

## [v0.5.3] — 2026-07-01

### Changed
- 默认外观偏好：颜色樱吹雪(sakura) + 普通风格(standard) + 直角
- 版本号修正（TRAE 误标 v1.0.0 → 回退 v0.5.3）

### Fixed
- 后端 executor.py 3 处 dict key 缺引号（`error:` → `"error":`）
- 后端 models.py 正则改为 raw string（修复 Python 3.12+ SyntaxWarning）
- 后端 UserCreate 删除与 UserBase 重复的 nickname/phone/email 字段
- 后端 JWT secret 改为环境变量 `WINTERS_JWT_SECRET`

### Removed
- 30+ 过期 spec 文档归档到 archive/
- 5 个遗留 test_ws*.py 临时调试脚本

## [v0.5.2] — 2026-06-28

### Fixed
- 路由守卫改为直接查 `winters_token`（不再依赖 `isLoggedIn` flag）
- 清除 ResetPassword 模拟文案
- 清除 Profile setTimeout + Login 模拟文案

### Added
- 导航栏加社区入口

## [v0.5.1] — 2026-06-27

### Added
- 头像真存储到数据库（user 表 avatar 字段）
- 社交登录自动创建 DB 用户
- Login/Register 接真 API
- 验证码登录返回 JWT token

### Fixed
- Blog 接真 API（posts/comments/tags）
- Profile 表单输入框 caret-color 光标显示
- 改密码表单 autocomplete 防浏览器自动填充
- login 返回完整用户信息（nickname/phone/email）不含密码
- Register.vue 参数匹配 store.register(account, password, confirmPassword)
- login 返回 db_user → dict(db_user) 修复 JSON 序列化
- GET posts/comments/tags 无需认证，POST/PUT/DELETE 需登录

## [v0.5.0] — 2026-06-26

### Added
- 用户系统全真 API（profile 查询/更新/绑定/注销/验证码）
- 改密码功能 + 后端 change-password 端点
- 注册支持 nickname/phone/email 可选字段
- 社区 API 真用户认证（JWT + bcrypt）

### Fixed
- PostDetail scroll-reveal 闪烁 — watch 数据加载后手动 reveal

## [v0.4.0] — 2026-06-25

### Added
- AI 社区完整实现（帖子流/发帖/详情/点赞/评论/标签）
- useCommunityStore（Pinia，后端 API 驱动，含分页/点赞/标签）
- 发帖后自动刷新 + 空态引导

### Fixed
- 页面动效回退 — 10 文件恢复改前状态

## [v0.3.0] — 2026-06-24

### Added
- 组件实验室 `/lab/showcase` — 84 组件画廊，7 个子页面
  - 文字特效 / 悬停交互 / 入场动画 / 背景装饰 / UI 组件 / 3D 工具
- Showcase 分页版 — 7 页面 77 组件正常渲染
- 全局动效槽位系统 — 9 个槽位（标题/卡片/按钮/背景/文字/点击/页面/导航）
  - Pinia + localStorage 持久化
  - 设置面板可实时切换
- useEffectStore — 动效槽位管理
- SafeDemo 组件隔离 — 单组件崩溃不影响全页
- 2048 游戏 + 扫雷游戏
- Lab 布局优化

### Fixed
- RotatingText props texts→array 防止 showcase 白屏
- TextPressure.vue 去除模板内 `<style v-html>`
- slot 内容传入组件修复（61/76 正常渲染）
- 恢复原始 Carousel.vue（被 Workflow 覆盖）
- setSlot 用对象替换触发响应式 — 设置实时生效
- HeadingEffect import 路径全修 + 2 卡片接 CardHoverSlot
- 全站标题接入 effectStore — HeadingEffect 组件
- 4 个动效槽位接通 — 设置面板可实时切换
- 全 Home 侧栏 3 卡接 CardHoverSlot + bgDecor 默认点阵

## [v0.2.0] — 2026-06-23

### Added
- 全站 i18n（zh-CN / zh-TW / en-US），24+ 文件接入
- 8 套设计师主题（手账/墨韵/极光/樱吹雪/森语/午夜/暮光/极简）+ 自定义配色
- SettingsPanel 三层导航（主页 → 主题子页 / 动效子页）
- 手账风格纸质感 + 圆角/直角独立切换
- `/system` 自驱工作站架构文档页面 + 加入项目列表
- 全站标题接入 HeadingEffect 组件
- 全量 React Bits 搬迁 — 84 组件 + 动效槽位系统
- 14 组件全部接线 — 全站动效覆盖完成

### Fixed
- 全站颜色清零 — 所有硬编码色值迁移 CSS 变量
- 标题动效实际应用 — GradientText/ShinyText 上线
- Login auth-card 加 v-spotlight
- v-spotlight/v-tilt/v-magnet 指令注册 + 全站接线
- 动效全面铺开 — 所有卡片接入 v-spotlight + 聚光灯增强

## [v0.1.0] — 2026-06-20 ~ 06-22

### Added
- 项目初始化 — Vue 3 + FastAPI + SQLite 全栈骨架
- 基础页面：首页/动态/项目/实验室/联系/登录/注册
- 粒子特效系统（useParticles composable，Canvas 粒子，主题自适应）
- 代码执行引擎（6 语言：C/Java/JS/TS/Python/PHP）
- 认证系统骨架（密码登录/注册/验证码/第三方登录入口）
- 暖心关怀页面 — 200+ 条暖心话语弹窗
- AI 学习路线 — 6 阶段 21 周完整学习计划
- **React Bits 风格 UI 重设计方案书**（24 交互 demo + 135 组件分类）
- **AI 自执行施工计划**（4 阶段 40+ 任务清单）
- Phase 0 — CSS 基础设施统一（补变量/建 card 基类/动画提升/颜色清零）
- Phase 1 — Easy 动效 9 件套（Vue Composables 7+ Components 2）
- Phase 2 — Medium 组件 10 件（Canvas/IO/SVG 动效）
- Phase 3 — card-spotlight 全局覆盖（App/Header/Home → Community/Lab → Blog/Settings/Login）
- Phase 4 — 全局收尾（滚动条/选中文本/文档同步）

### Changed
- 项目结构重构 — 清理垃圾、整合功能
- README 重写并补充暖心关怀 + AI 学习路线

[keepachangelog]: https://keepachangelog.com/zh-CN/1.0.0/
