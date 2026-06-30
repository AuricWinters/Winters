# 恢复Projects.vue布局规格

## Why
之前错误地修改了Projects.vue（项目作品集页面），需要恢复到原来的等宽Grid布局。

## What Changes
- **恢复Projects.vue的Grid布局**：从 `2fr 1f` 改回 `repeat(auto-fill, minmax(300px, 1fr))`
- **移除交替布局CSS规则**：删除所有 `nth-child` 相关的交替样式
- **移除响应式覆盖**：删除768px媒体查询中的特殊处理

## Impact
- Affected specs: 无（这是修复性变更）
- Affected code:
  - `frontend/src/views/Projects.vue` - 恢复原始布局

## ADDED Requirements
无

## MODIFIED Requirements
无

## REMOVED Requirements
### Requirement: 交替卡片布局（错误应用）
**Reason**: 该规格被错误地应用到了Projects.vue而非Lab.vue
**Migration**: 完全移除，将在Lab.vue中重新实现
