# Tasks

- [x] Task 1: 分析glider对齐问题的根因并确定修复方案
  - [x] 确认当前glider的定位机制（calc(100%/7) + translateY）
  - [x] 确认折叠态下各语言项的实际高度差异
  - [x] 选择最佳修复方案：统一折叠态语言项为固定高度36px

- [x] Task 2: 实施修复方案，确保折叠态glider对齐
  - [x] 修改CSS使折叠态下glider正确定位到选中项（固定height: 36px）
  - [x] 保持竖条滑动动画效果
  - [x] 隐藏发光背景（::before/::after display: none）

- [x] Task 3: 验证展开态不受影响
  - [x] 确认展开态glider光效动画正常
  - [x] 确认展开/折叠切换时无样式冲突

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 2]
