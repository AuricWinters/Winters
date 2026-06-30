# 首页主体宽度调整 - 产品需求文档

## Overview
- **Summary**: 调整网站首页主体内容区域的最大宽度，从当前的1600px修改为1200px，同时确保内容保持水平居中显示，保持页面整体布局的协调性。
- **Purpose**: 优化页面布局，使内容更加紧凑集中，提升用户阅读体验，避免在较大屏幕上内容过于分散。
- **Target Users**: 网站所有访问者。

## Goals
- 将首页主体内容区域的最大宽度从1600px调整为1200px
- 确保调整后页面主体内容保持水平居中显示
- 保持页面整体布局的协调性
- 确保其他元素能够自适应新的宽度设置
- 避免出现布局错乱或内容溢出等问题

## Non-Goals (Out of Scope)
- 不修改页面的其他样式属性
- 不改变页面的响应式断点设置
- 不影响页面的其他功能模块

## Background & Context
- 当前网站首页主体内容区域的最大宽度为1600px
- 页面使用Flex布局，主体内容区域通过margin: 0 auto实现水平居中
- 页面已设置响应式布局，在不同屏幕尺寸下有相应的样式调整

## Functional Requirements
- **FR-1**: 将main元素的max-width属性从1600px修改为1200px
- **FR-2**: 确保main元素在修改后仍然保持水平居中显示
- **FR-3**: 确保页面其他元素能够自适应新的宽度设置

## Non-Functional Requirements
- **NFR-1**: 页面布局在调整后应保持美观协调
- **NFR-2**: 页面在不同屏幕尺寸下的响应式表现应正常
- **NFR-3**: 调整不应导致任何布局错乱或内容溢出

## Constraints
- **Technical**: 仅修改CSS样式，不涉及JavaScript逻辑变更
- **Dependencies**: 无外部依赖

## Assumptions
- 页面使用的是标准的CSS布局，main元素是主体内容的容器
- 页面已正确设置了响应式布局

## Acceptance Criteria

### AC-1: 主体宽度调整
- **Given**: 页面已加载完成
- **When**: 查看main元素的样式
- **Then**: main元素的max-width属性值应为1200px
- **Verification**: `programmatic`

### AC-2: 水平居中显示
- **Given**: 页面已加载完成
- **When**: 查看页面布局
- **Then**: 主体内容应保持水平居中显示
- **Verification**: `human-judgment`

### AC-3: 布局协调性
- **Given**: 页面已加载完成
- **When**: 查看页面整体布局
- **Then**: 页面布局应保持协调美观，无布局错乱或内容溢出
- **Verification**: `human-judgment`

### AC-4: 响应式表现
- **Given**: 页面在不同屏幕尺寸下加载
- **When**: 调整浏览器窗口大小
- **Then**: 页面在不同屏幕尺寸下的响应式表现应正常
- **Verification**: `human-judgment`

## Open Questions
- [ ] 无