# 项目作品集页面视觉升级规格

## Why
当前项目作品集页面（Projects.vue）的卡片设计较为简单平淡，缺乏视觉层次感和现代感。需要参考实验室页面（Lab.vue）的bento风格，提升整体视觉品质和用户体验。

## What Changes
- **卡片视觉重构**：采用更现代化的玻璃态（glassmorphism）设计
- **增加视觉元素**：添加渐变背景、图标装饰、动画效果
- **优化排版**：改进字体层级、间距和色彩搭配
- **增强交互**：优化hover状态和过渡动画
- **保持一致性**：与Lab页面的设计语言统一

## Impact
- Affected specs: 无
- Affected code:
  - `frontend/src/views/Projects.vue` - 全面重构样式

## ADDED Requirements

### Requirement: 现代化卡片设计
系统 SHALL 提供具有现代视觉品质的项目展示卡片。

#### Scenario: 卡片基础外观
- **WHEN** 用户查看项目列表
- **THEN** 每个卡片应具备：
  - 玻璃态背景（backdrop-filter blur + 半透明）
  - 渐变色装饰背景（类似Lab的mesh-gradient）
  - 更大的圆角（24px+）
  - 柔和的多层阴影
  - 微妙的边框高光

#### Scenario: 视觉层次
- **WHEN** 用户浏览项目信息
- **THEN** 内容应呈现清晰的视觉层级：
  - 项目名称：大字号（1.5rem+）、粗体、主色调
  - 项目描述：适中字号、次要色、良好行高
  - 技术标签：紧凑排列、圆角胶囊状、半透明背景
  - 操作按钮：明确的视觉权重区分

### Requirement: 增强交互体验
系统 SHALL 提供流畅且富有反馈性的交互动画。

#### Scenario: Hover效果
- **WHEN** 鼠标悬停在卡片上
- **THEN** 卡片应：
  - 轻微上浮（translateY -6px）
  - 阴影加深并带有色彩光晕
  - 背景透明度微调
  - 顶部出现彩色渐变条
  - 图标/箭头产生位移动画（0.3s ease）

#### Scenario: 入场动画
- **WHEN** 页面加载或滚动到可视区域
- **THEN** 卡片应：
  - 从下方淡入（fadeUp）
  - 带有交错延迟（staggered delay）

## MODIFIED Requirements

### Requirement: 响应式布局
项目卡片网格 SHALL 在不同屏幕尺寸下保持良好的可读性。
- 桌面端：auto-fill 自适应列数
- 平板端：2列布局
- 移动端：单列全宽

## REMOVED Requirements
无
