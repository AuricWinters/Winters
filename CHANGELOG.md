# Changelog

Winters 项目更新日志，遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/) 格式。

## [v0.5.3] — 2026-07-01

### Changed
- 默认外观偏好：颜色樱吹雪(sakura) + 普通风格(standard) + 直角
- 版本号修正（TRAE 误标 v1.0.0 → 回退 v0.5.3）

### Fixed
- 后端 executor.py 3 处 dict key 缺引号
- 后端 models.py 正则改为 raw string（修复 Python 3.12+ 警告）
- 后端 UserCreate 删除与 UserBase 重复的字段
- 后端 JWT secret 改为环境变量 `WINTERS_JWT_SECRET`

### Removed
- 30+ 过期 spec 文档归档
- 5 个遗留 test_ws*.py 临时调试脚本

## [v0.5.2] — 2026-06-28

### Fixed
- 路由守卫改为直接查 `winters_token`（不再依赖 `isLoggedIn`）
- 清除 ResetPassword 模拟文案
- 清除 Profile setTimeout + Login 模拟文案

### Added
- 导航栏加社区入口

## [v0.5.1] — 2026-06-27

### Added
- 头像真存储到数据库
- 社交登录自动创建 DB 用户
- Login/Register 接真 API
- 验证码登录返回 JWT token

### Fixed
- Blog 接真 API
- Profile 表单输入框 caret-color 光标显示

## [v0.5.0] — 2026-06-26

### Added
- 用户系统全真 API（profile 查询/更新/绑定/注销/验证码）
- 改密码接真 API + 后端 change-password 端点
- 注册支持 nickname/phone/email 字段
- 社区 API 真用户认证（JWT + bcrypt）

### Fixed
- login 返回完整用户信息（不含密码）
- Register.vue 参数匹配 store
- PostDetail scroll-reveal 闪烁

## [v0.4.0] — 2026-06-25

### Added
- AI 社区（帖子流/发帖/详情/点赞/评论）
- 社区 store（useCommunityStore）后端 API 驱动

## [v0.3.0] — 2026-06-24

### Added
- 组件实验室 `/lab/showcase` — 84 组件画廊，7 个子页（文字/悬停/入场/背景/UI/3D）
- 2048 和扫雷小游戏
- 全局动效槽位系统（9 槽位，Pinia + localStorage 持久化）

## [v0.2.0] — 2026-06-23

### Added
- 全站 i18n（zh-CN / zh-TW / en-US）
- 8 套设计师主题 + 自定义配色
- SettingsPanel 三层导航
- 手账风格 + 圆角/直角切换

## [v0.1.0] — 2026-06-20

### Added
- 项目初始化 — Vue 3 + FastAPI + SQLite
- 首页/动态/项目/实验室/联系/登录/注册 基础页面
- 粒子特效系统（useParticles）
- 代码执行引擎（6 语言）
- 认证系统骨架

[keepachangelog]: https://keepachangelog.com/zh-CN/1.0.0/
