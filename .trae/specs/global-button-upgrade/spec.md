# 全局按钮视觉升级规格

## Why
当前网站各页面的按钮样式不统一，且缺乏视觉吸引力（单调的纯色背景）。需要为所有按钮添加现代化的视觉效果：hover时的白色光晕和渐变色彩，提升整体用户体验和界面品质。

## What Changes
- **全局按钮样式升级**：为所有按钮添加统一的现代化设计
- **白色光晕效果**：鼠标悬停时显示柔和的白色发光效果
- **渐变色彩方案**：使用紫蓝渐变替代单调的纯色
- **保持一致性**：确保所有页面（Header、Login、Register、Projects、Lab等）的按钮风格统一

## Impact
- Affected specs: 无
- Affected code:
  - `frontend/src/assets/main.css` 或 `frontend/src/App.vue` - 全局按钮基础样式
  - `frontend/src/views/Login.vue` - 登录按钮
  - `frontend/src/views/Register.vue` - 注册按钮
  - `frontend/src/components/Header.vue` - 导航栏按钮
  - `frontend/src/views/Projects.vue` - 项目卡片按钮
  - `frontend/src/views/Lab.vue` - 实验室卡片按钮
  - 其他包含按钮的组件

## ADDED Requirements

### Requirement: 现代化按钮设计系统
系统 SHALL 提供具有白色光晕效果的渐变按钮设计。

#### Scenario: 按钮默认状态
- **WHEN** 用户查看页面中的任何按钮
- **THEN** 按钮应具备：
  - 渐变背景色（主色调到次要色调）
  - 圆角设计（8-12px）
  - 柔和阴影
  - 清晰的文字对比度

#### Scenario: 按钮Hover状态
- **WHEN** 鼠标悬停在按钮上
- **THEN** 按钮应显示：
  - 白色光晕效果（box-shadow带白色/浅色）
  - 轻微上浮动画（translateY -2px）
  - 背景渐变微微变化或亮度提升
  - 平滑过渡动画（0.3s ease）

#### Scenario: 按钮类型变体
- **WHEN** 页面展示不同类型的按钮
- **THEN** 应支持：
  - 主按钮（primary）：紫蓝渐变 + 强烈光晕
  - 次按钮（secondary）：玻璃态/描边 + 轻微光晕
  - 幽灵按钮（ghost）：透明背景 + 边框 + hover填充

## MODIFIED Requirements

### Requirement: 现有按钮兼容性
所有现有按钮 SHALL 在升级后保持原有功能不变，仅改变视觉表现。
- 登录/注册表单按钮
- 导航栏CTA按钮
- 项目卡片操作按钮
- 实验室卡片链接按钮

## REMOVED Requirements
无
