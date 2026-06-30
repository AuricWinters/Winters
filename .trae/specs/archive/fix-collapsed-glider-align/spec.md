# 折叠侧边栏Glider对齐修复 Spec

## Why
折叠状态下侧边栏的glider（紫色竖条）位置与实际选中的语言项不对齐。从截图可见：选中"<?"时竖条却在"JS"旁边。

**根本原因**：glider使用 `height: calc(100% / var(--total-radio))` 和 `translateY(N * 100%)` 定位，假设所有语言项等高。但折叠态下各语言项内容不同（A/C/J/JS/<?/Py/TS），实际渲染高度不均等，导致百分比定位偏移。

## What Changes
- 修复折叠态下glider竖条与选中语言项的对齐问题
- 确保展开态和折叠态的glider动画都正常工作
- 保持竖条滑动动画效果

## Impact
- Affected code: `d:\web\Winters\frontend\src\views\lab\CodeLab.vue`

## MODIFIED Requirements

### Requirement: Glider对齐
折叠态侧边栏中，glider紫色竖条必须精确对齐到当前选中的语言项左侧：
- **WHEN** 用户在折叠态侧边栏切换语言
- **THEN** glider竖条平滑滑动到对应语言项位置，且位置完全对齐
- **WHEN** 页面初始加载
- **THEN** glider竖条在正确选中的语言项位置

### Requirement: 展开态不受影响
- **WHEN** 侧边栏处于展开状态
- **THEN** glider光效动画正常工作，不受折叠态修改影响
