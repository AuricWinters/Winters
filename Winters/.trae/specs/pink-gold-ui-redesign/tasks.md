# Tasks

## Phase 1: 核心变量与基础样式
- [x] Task 1: 更新 CSS 变量定义文件 (variables.css)
  - [x] 1.1 将 --primary 从 #8b5cf6 改为 #EC4899
  - [x] 1.2 将 --primary-light 改为 #F9A8D4
  - [x] 1.3 将 --primary-dark 改为 #DB2777
  - [x] 1.4 将 --secondary 从 #3b82f6 改为 #F59E0B
  - [x] 1.5 更新 --shadow-purple 为 --shadow-pink
  - [x] 1.6 添加新的金色系列变量（--gold, --gold-light, --gold-dark）

- [x] Task 2: 更新基础样式文件 (base.css)
  - [x] 2.1 修改 body 背景渐变为粉色系
  - [x] 2.2 更新 radial-gradient 的颜色值

## Phase 2: 组件样式模块
- [x] Task 3: 更新全局按钮系统 (main.css)
  - [x] 3.1 修改 .btn-primary 渐变为粉金配色
  - [x] 3.2 更新所有 box-shadow 的 rgba 值
  - [x] 3.3 修改 .btn-ghost 的默认颜色
  - [x] 3.4 更新 .btn-secondary 的 hover 效果

- [x] Task 4: 更新头部导航样式 (header.css)
  - [x] 4.1 修改 .login-btn 渐变色
  - [x] 4.2 更新 navbar-title 渐变方向（粉色→金色）
  - [x] 4.3 更新所有 hover 光晕效果

- [x] Task 5: 更新功能组件样式 (features.css)
  - [x] 5.1 修改 .submit-btn 渐变和阴影
  - [x] 5.2 更新聊天界面相关颜色（.chat-send-btn, .chat-message.user）
  - [x] 5.3 修改表单 focus 状态的 border-color 和 box-shadow
  - [x] 5.4 更新联系表单图标背景色

## Phase 3: 页面级 Vue 组件
- [x] Task 6: 更新实验室页面 (Lab.vue)
  - [x] 6.1 替换卡片样式的 rgba(139, 92, 246, ...) 为粉色值
  - [x] 6.2 修改背景装饰渐变
  - [x] 6.3 更新 hover 光晕效果

- [x] Task 7: 更新项目展示页面 (Projects.vue)
  - [x] 7.1 修改卡片阴影和背景色
  - [x] 7.2 更新标签和按钮的渐变色
  - [x] 7.3 替换所有硬编码的紫色值

- [x] Task 8: 更新认证页面 (Login.vue & Register.vue)
  - [x] 8.1 修改登录/注册页背景渐变
  - [x] 8.2 更新表单输入框 focus 样式
  - [x] 8.3 修改按钮和链接颜色
  - [x] 8.4 更新社交登录按钮样式

- [x] Task 9: 更新其他页面组件
  - [x] 9.1 AI.vue - 修改 AI 功能区的颜色
  - [x] 9.2 ProjectDetail.vue - 更新详情页装饰色
  - [x] 9.3 Drive.vue - 修改网盘界面高亮色
  - [x] 9.4 Header.vue - 更新组件内联样式
  - [x] 9.5 ToastNotification.vue - 修改通知颜色
  - [x] 9.6 ContributionHeatmap.vue - 更新热力图配色

## Phase 4: 实验室特效组件
- [x] Task 10: 更新实验室特效 (PianoLab, ParticleLab, useParticles)
  - [x] 10.1 PianoLab.vue - 修改钢琴键渐变和阴影
  - [x] 10.2 ParticleLab.vue - 更新粒子预设颜色数组
  - [x] 10.3 useParticles.js - 修改粒子动画颜色配置

## Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 1]
- [Task 4] depends on [Task 1]
- [Task 5] depends on [Task 1]
- [Task 6, 7, 8, 9] depend on [Task 3, 4, 5]
- [Task 10] can run in parallel with [Task 6-9]
