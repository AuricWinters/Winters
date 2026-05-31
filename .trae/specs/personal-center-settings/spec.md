# 个人中心 Web 设置功能 - 产品需求文档

## Overview
- **Summary**: 完善个人中心功能，将账户设置和Web设置整合在一起，用户可以通过点击头像访问Web设置（语言、主题等）。
- **Purpose**: 提供更好的用户体验，让用户可以方便地自定义网站的语言和主题偏好。
- **Target Users**: 所有登录系统的用户。

## Why
当前个人中心页面缺少Web设置功能，用户无法自定义网站的语言和主题偏好。需要将个人中心重新设计为包含：
1. 个人信息和账户设置
2. Web设置（语言、主题等）

## What Changes
- 重构个人中心页面布局，分为"个人信息"和"Web设置"两个部分
- 点击头像打开设置面板，包含语言切换、主题切换等功能
- 账户设置保持在个人中心内部
- Web设置支持：
  - 语言切换（中/英文）
  - 主题切换（浅色/深色/跟随系统）
  - 界面缩放
  - 动画开关

## Impact
- Affected specs: auth-profile-system（扩展）
- Affected code:
  - `frontend/src/views/Profile.vue` - 个人中心页面
  - `frontend/src/stores/settings.js` - 设置状态管理
  - `frontend/src/composables/useSettings.js` - 设置组合式函数

## ADDED Requirements

### Requirement: Web 设置功能
系统 SHALL 提供 Web 设置功能，允许用户自定义网站偏好。

#### Scenario: 切换语言
- **WHEN** 用户在设置面板中选择不同语言
- **THEN** 网站界面语言立即切换为所选语言

#### Scenario: 切换主题
- **WHEN** 用户在设置面板中选择深色主题
- **THEN** 网站立即切换为深色主题，所有组件颜色相应变化

#### Scenario: 主题跟随系统
- **WHEN** 用户选择"跟随系统"主题选项
- **THEN** 网站主题自动跟随操作系统的主题设置

### Requirement: 设置持久化
系统 SHALL 将用户的设置保存到本地存储，并在下次访问时自动应用。

#### Scenario: 设置保存
- **WHEN** 用户修改任何设置（语言、主题等）
- **THEN** 设置立即保存到 localStorage

#### Scenario: 设置恢复
- **WHEN** 用户重新打开网站
- **THEN** 自动恢复上次保存的设置

## MODIFIED Requirements

### Requirement: 个人中心布局
个人中心页面 SHALL 包含两个主要区域：个人信息区和Web设置区。

#### Scenario: 查看个人中心
- **WHEN** 用户访问个人中心页面
- **THEN** 显示个人信息卡片和Web设置面板

## REMOVED Requirements
无

## Technical Approach
- 使用 Pinia 管理全局设置状态
- 使用 `prefers-color-scheme` 检测系统主题
- 使用 `localStorage` 持久化用户设置
- 支持 i18n 多语言切换（预留接口）

## Implementation Notes
- 语言切换功能预留接口，中英文支持可以后续扩展
- 主题切换支持：light、dark、auto（跟随系统）
- 所有设置更改应立即生效，无需刷新页面