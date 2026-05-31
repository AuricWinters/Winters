# 粉金色 UI 配色方案重构 Spec

## Why
当前 Web UI 整体采用蓝紫色调（#8B5CF6, #6366F1, #3B82F6），用户希望将颜色方案改为粉金色系，提升视觉体验和品牌辨识度。

## What Changes
- **核心配色变量更新**：将主色从紫色改为粉色，辅助色从蓝色改为金色
- **全局 CSS 变量替换**：更新 `variables.css` 中的所有颜色变量
- **渐变背景调整**：修改所有使用蓝紫色的线性/径向渐变
- **按钮样式升级**：更新全局按钮的渐变色和光晕效果
- **组件级颜色同步**：确保所有 Vue 组件和 CSS 模块使用新配色
- **阴影与光效优化**：调整 box-shadow 中的颜色值以匹配新主题

## Impact
- Affected specs: global-button-upgrade（需要同步更新）
- Affected code:
  - `frontend/src/styles/modules/variables.css` - 核心变量定义
  - `frontend/src/styles/main.css` - 全局按钮系统
  - `frontend/src/styles/modules/header.css` - 导航栏
  - `frontend/src/styles/modules/base.css` - 页面背景
  - `frontend/src/styles/modules/features.css` - 表单和聊天组件
  - `frontend/src/views/Lab.vue` - 实验室页面
  - `frontend/src/views/Projects.vue` - 项目页面
  - `frontend/src/views/Login.vue` - 登录页
  - `frontend/src/views/Register.vue` - 注册页
  - `frontend/src/views/AI.vue` - AI 页面
  - `frontend/src/views/ProjectDetail.vue` - 项目详情页
  - `frontend/src/views/Drive.vue` - 网盘页面
  - `frontend/src/components/Header.vue` - 头部组件
  - `frontend/src/components/ToastNotification.vue` - 通知组件
  - `frontend/src/components/ContributionHeatmap.vue` - 贡献热力图
  - `frontend/src/composables/useParticles.js` - 粒子动画
  - `frontend/src/views/lab/PianoLab.vue` - 钢琴实验室
  - `frontend/src/views/lab/ParticleLab.vue` - 粒子实验室

## ADDED Requirements

### Requirement: 粉金色配色系统
系统 SHALL 提供完整的粉金色配色方案，包含以下色阶：

**主色调（粉色系）**：
- Primary: #EC4899（亮粉色）
- Primary-light: #F9A8D4（浅粉色）
- Primary-dark: #DB2777（深粉色）

**辅助色调（金色系）**：
- Secondary: #F59E0B（琥珀金）
- Secondary-light: #FCD34D（浅金色）
- Secondary-dark: #D97706（深金色）

**点缀色**：
- Accent: #F472B6（玫瑰粉）

#### Scenario: 颜色一致性
- **WHEN** 用户访问任何页面
- **THEN** 所有交互元素（按钮、链接、图标）使用统一的粉金配色
- **AND** 渐变效果从粉色过渡到金色而非紫色到蓝色

### Requirement: 视觉层次保持
系统 SHALL 在更换配色后保持原有的视觉层次：
- 主操作按钮使用强渐变（粉色→玫红）
- 次要元素使用玻璃态 + 金色边框
- 背景装饰使用柔和的粉色径向渐变
- hover 状态保留白色光晕效果但扩散色改为粉色

## MODIFIED Requirements

### Requirement: 全局按钮设计系统
原有的按钮系统 SHALL 更新为粉金配色：

**主按钮 (.btn-primary)**：
- 渐变：`linear-gradient(135deg, #EC4899, #DB2777)`
- 光晕：粉色核心 + 白色扩散
- hover：亮度提升 + 强化光晕

**次按钮 (.btn-secondary)**：
- 保持玻璃态
- hover 光晕改为金色调

**幽灵按钮 (.btn-ghost)**：
- 边框色：粉色
- hover 填充：粉金渐变

### Requirement: 导航栏样式
导航栏标题渐变 SHALL 从 `primary → secondary` 改为 `粉色 → 金色`
活跃状态指示器使用粉色背景

## REMOVED Requirements
无移除功能，仅替换颜色值。
