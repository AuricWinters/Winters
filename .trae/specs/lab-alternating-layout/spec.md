# 实验室页面交替卡片布局规格

## Why
当前实验室（Lab.vue）页面的bento-grid采用等宽的2列田字形布局（`grid-template-columns: 1fr 1fr`），视觉上较为单调。需要改为交替的长方形+正方形布局以增加视觉层次感和设计美感，符合用户提供的截图效果。

## What Changes
- **修改Lab.vue的Grid布局**：从等宽网格改为交替的2列布局
  - 奇数行：第1个卡片占2/3宽度（长方形），第2个卡片占1/3宽度（正方形）
  - 偶数行：第1个卡片占1/3宽度（正方形），第2个卡片占2/3宽度（长方形）
- **保持响应式设计**：在小屏幕上回退为单列布局
- **优化卡片内容展示**：根据卡片大小调整内边距和字体大小

## Impact
- Affected specs: 无
- Affected code:
  - `frontend/src/views/Lab.vue` - 修改.bento-grid布局和相关样式

## ADDED Requirements

### Requirement: 实验室交替卡片网格布局
系统 SHALL 在实验室页面提供交替的长方形-正方形卡片网格布局。

#### Scenario: 桌面端显示
- **WHEN** 用户在桌面端（宽度 >= 1100px）查看实验室页面
- **THEN** 卡片应以2列交替布局显示：
  - 第1、3、5...行：左侧卡片较宽（约66.67%），右侧卡片较窄（约33.33%）
  - 第2、4、6...行：左侧卡片较窄（约33.33%），右侧卡片较宽（约66.67%）

#### Scenario: 移动端显示
- **WHEN** 用户在移动端（宽度 < 1100px）查看实验室页面
- **THEN** 所有卡片应以单列全宽显示（保持现有的响应式逻辑）

## MODIFIED Requirements

### Requirement: Bento卡片组件
Bento卡片组件 SHALL 支持不同的尺寸模式：
- **宽卡片模式**（wide）：显示完整的项目描述和标准内边距
- **窄卡片模式**（compact）：精简内容展示，减小内边距和字体

## REMOVED Requirements
无
