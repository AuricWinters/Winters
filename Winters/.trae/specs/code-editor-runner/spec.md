# 教程弹窗添加在线代码编辑器和运行器 Spec

## Why
当前教程弹窗只展示静态内容，用户希望增加交互式学习体验。通过在右侧添加一个**在线代码编辑器+运行器**，让用户能够直接在阅读教程的同时编写和运行代码，实现"学以致用"的学习效果。

## What Changes
- 将教程弹窗从单栏布局改为**左右分栏布局**
- 左侧：保持现有的教程文档内容（代码示例、说明）
- 右侧：新增**在线代码编辑器**，支持：
  - 代码编辑功能（语法高亮、行号、自动补全提示）
  - 代码运行功能（调用后端API或使用Web端编译器）
  - 运行结果显示区域（stdout/stderr输出）
- 添加"运行"、"清空"、"重置为示例代码"等操作按钮
- 支持多种编程语言（C, Java, Python, JavaScript, PHP, TypeScript）

## Impact
- Affected specs: professional-code-block（基于现有代码块样式扩展）
- Affected code: `d:\web\Winters\frontend\src\views\lab\CodeLab.vue`
- 可能需要：后端API支持代码执行 / 或集成前端编译方案（如 Monaco Editor + WebAssembly编译器）

## ADDED Requirements

### Requirement: 左右分栏布局
系统 SHALL 在教程弹窗中使用左右分栏布局。

#### Scenario: 分栏显示
- **WHEN** 用户打开教程详情弹窗
- **THEN** 弹窗应分为左右两个区域：左侧显示教程内容，右侧显示代码编辑器

### Requirement: 代码编辑器
系统 SHALL 提供功能完善的在线代码编辑器。

#### Scenario: 编辑代码
- **WHEN** 用户在右侧编辑器中输入或修改代码
- **THEN** 编辑器应提供语法高亮、行号显示、自动缩进等功能
- **AND** 编辑器应自动检测当前教程对应的编程语言

#### Scenario: 预填充示例代码
- **WHEN** 用户打开某个教程示例
- **THEN** 右侧编辑器应预填充该示例的代码内容
- **OR** 提供按钮将左侧示例代码复制到编辑器

### Requirement: 代码运行功能
系统 SHALL 支持运行用户编写的代码并显示结果。

#### Scenario: 运行代码
- **WHEN** 用户点击"运行"按钮
- **THEN** 系统应执行用户输入的代码
- **AND** 在输出区域显示运行结果（标准输出、错误信息等）
- **AND** 显示执行时间/状态信息

#### Scenario: 运行失败处理
- **WHEN** 代码执行出错
- **THEN** 输出区域应清晰显示错误类型和错误信息
- **AND** 用红色/警告色标识错误输出

### Requirement: 编辑器工具栏
系统 SHALL 提供便捷的操作按钮。

#### Scenario: 工具栏按钮
- **WHEN** 用户查看编辑器顶部
- **THEN** 应看到以下按钮：
  - "运行代码" (▶) - 执行当前编辑器中的代码
  - "清空" (🗑️) - 清空编辑器内容
  - "重置" (↺) - 重置为初始示例代码
  - 语言选择下拉框（可选）

## MODIFIED Requirements

### Requirement: 弹窗尺寸
修改 `.modal-content` 的尺寸以适应分栏布局：
- 增大最大宽度（从900px增加到1400px或更大）
- 增大最大高度（适应更大的内容区）
- 移动端改为上下堆叠布局（响应式设计）

### Requirement: 左侧教程区域
调整左侧教程内容的样式：
- 最大宽度限制（约50-55%）
- 保持原有的MD文档风格
- 可独立滚动

## REMOVED Requirements

无
