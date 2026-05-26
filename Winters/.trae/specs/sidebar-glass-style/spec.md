# 侧边栏玻璃拟态与面板背景修复 Spec

## Why
当前CodeLab页面的侧边栏是纯白实心背景（`var(--bg-card)`），与顶部导航栏的玻璃拟态风格不一致，视觉上显得突兀。同时主内容区域的背景存在显示异常。

## What Changes
- 将侧边栏改为与导航栏一致的玻璃拟态风格：半透明背景 + 模糊滤镜 + 圆角 + 边框 + 阴影
- 修复主内容区域（`.main-content`）的背景问题

## Impact
- Affected code: `d:\web\Winters\frontend\src\views\lab\CodeLab.vue`

## ADDED Requirements
### Requirement: 侧边栏玻璃拟态样式
侧边栏 SHALL 使用与导航栏 `.main-header` 一致的视觉风格：
- 背景：`var(--bg-glass)` 即 `rgba(255, 255, 255, 0.7)`
- 模糊：`backdrop-filter: blur(12px)`
- 边框：`border: 1px solid rgba(255, 255, 255, 0.3)`
- 圆角：`border-radius: 20px`
- 阴影：`box-shadow: var(--shadow-lg)`

#### Scenario: 展开状态侧边栏
- **WHEN** 用户查看展开状态的侧边栏
- **THEN** 侧边栏呈现玻璃拟态效果，与导航栏视觉统一

#### Scenario: 折叠状态侧边栏
- **WHEN** 用户点击收起按钮切换到折叠状态
- **THEN** 折叠后的侧边栏同样保持玻璃拟态风格

### Requirement: 主内容区域背景修复
主内容区域 SHALL 正确继承页面背景色，无异常显示。

#### Scenario: 背景正常
- **WHEN** 用户打开CodeLab页面
- **THEN** 主内容区域背景为 `var(--bg-main)` 或正确透明继承父级背景

## MODIFIED Requirements
### Requirement: 侧边栏基础样式
修改 `.sidebar` 样式：
- `background`: 从 `var(--bg-card)` 改为 `var(--bg-glass)`
- 新增 `backdrop-filter: blur(12px)` 和 `-webkit-backdrop-filter: blur(12px)`
- `border-right` 改为 `border: 1px solid rgba(255, 255, 255, 0.3)`
- 新增 `border-radius: 20px`
- 确保有 `box-shadow: var(--shadow-lg)`
- 由于有了圆角和边框，需要调整 `margin` 和 `padding` 使其不贴边
