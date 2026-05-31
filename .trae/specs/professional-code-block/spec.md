# 专业代码块渲染 Spec

## Why
用户希望教程弹窗中的代码块呈现**专业的IDE/文档风格**，类似GitHub README或VS Code的浅色主题效果。当前代码块使用深色背景且无行号和语法高亮，不够专业。

## What Changes
- 将代码块从深色背景改为**浅色背景**（类似GitHub/VS Code Light主题）
- 添加**行号显示**功能
- 添加**语言标签**（如 "c", "python", "javascript"）
- 实现**语法高亮**（关键字、字符串、注释等不同颜色）
- 优化复制按钮样式
- 保持说明文字的简洁引用样式

## Impact
- Affected specs: tutorial-md-migration（基于现有MD文档风格改进）
- Affected code: `d:\web\Winters\frontend\src\views\lab\CodeLab.vue`
- 可能需要引入代码高亮库（highlight.js 或 Prism.js）

## ADDED Requirements

### Requirement: 浅色主题代码块
系统 SHALL 使用浅色背景渲染代码块，提供舒适的阅读体验。

#### Scenario: 代码块显示
- **WHEN** 用户查看教程中的代码示例
- **THEN** 代码块应显示为浅色背景（#f6f8fa 或类似），带有细微边框

### Requirement: 行号显示
系统 SHALL 在代码块左侧显示行号，便于引用和阅读。

#### Scenario: 行号显示
- **WHEN** 代码块包含多行代码
- **THEN** 左侧应显示连续的行号（1, 2, 3...），与代码对齐

### Requirement: 语言标签
系统 SHALL 在代码块顶部显示编程语言标识。

#### Scenario: 语言标签显示
- **WHEN** 显示代码块时
- **THEN** 右上角或左上角应显示语言名称标签（如 "c", "python"）

### Requirement: 语法高亮
系统 SHALL 对代码进行语法高亮显示，提升可读性。

#### Scenario: 语法高亮
- **WHEN** 显示代码内容
- **THEN** 关键字、字符串、注释、函数名等应有不同颜色区分

### Requirement: 复制按钮优化
系统 SHALL 提供美观且易用的代码复制功能。

#### Scenario: 复制代码
- **WHEN** 用户点击复制按钮
- **THEN** 代码应被复制到剪贴板，按钮状态更新为"已复制"

## MODIFIED Requirements

### Requirement: 代码块容器样式
修改现有的 `.code-figure` 和相关样式类，实现新的专业外观：
- 背景色：浅灰色系（#f6f8fa）
- 边框：细边框（#e1e4e8）
- 圆角：6px
- 阴影：轻微阴影

### Requirement: 说明文字样式
保持现有的简洁引用样式（左侧灰色边线），无需大幅修改。

## REMOVED Requirements

### Requirement: 深色主题代码块
**原因**: 用户明确要求改为浅色主题
**Migration**: 移除深色背景相关样式（#1e293b 背景）
