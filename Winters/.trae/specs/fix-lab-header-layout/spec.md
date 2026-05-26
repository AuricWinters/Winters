# 修复Lab页面头部布局问题 Spec

## Why
Lab页面的头部标题"The Lab"显示位置不正确，出现在导航栏的位置，覆盖了导航栏的搜索框部分。用户多次反馈"还是不行"，表明之前的修复尝试未能彻底解决问题。

## What Changes
- 修复Lab.vue中.lab-header的布局问题，确保标题正确显示在页面内容区域
- 调整CSS样式，解决导航栏标题样式泄漏到Lab页面标题的问题
- 确保Lab页面与其他页面布局保持一致

## Impact
- 受影响的功能：Lab页面头部显示
- 受影响的代码：
  - frontend/src/views/Lab.vue
  - frontend/src/styles/modules/header.css
  - frontend/src/styles/modules/layout.css

## ADDED Requirements
### Requirement: 正确的Lab页面头部布局
系统SHALL确保Lab页面的头部标题"The Lab"正确显示在页面内容区域，不会出现在导航栏位置，且与其他页面布局保持一致。

#### Scenario: Lab页面头部正确显示
- **WHEN** 用户访问Lab页面
- **THEN** 头部标题"The Lab"应显示在页面内容区域的顶部，与导航栏有适当间距
- **AND** 标题应左侧对齐，与其他页面布局一致
- **AND** 导航栏标题"WINTERS"应正常显示，不被Lab页面标题覆盖

## MODIFIED Requirements
### Requirement: 导航栏标题样式
导航栏标题样式应仅影响导航栏的标题，不应影响其他页面的标题元素。

### Requirement: 页面内容容器布局
Lab页面的内容容器应与其他页面保持一致，具有相同的padding和布局规则。

## REMOVED Requirements
无