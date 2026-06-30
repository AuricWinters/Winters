# 教程数据迁移到MD文件 Spec

## Why
当前教程数据使用JS文件存储，维护和编辑不够直观。用户希望将教程数据迁移到MD文档格式，以便更方便地编辑和管理教程内容。

## What Changes
- 将每个语言的教程数据从JS文件迁移到MD文件
- 设计MD文件的标准格式和结构
- 实现MD文件的解析和加载机制
- 保持与现有JS数据结构的完全兼容
- 确保CodeLab组件能够正确读取和显示MD文件中的教程数据

## Impact
- Affected specs: 无依赖其他规范
- Affected code: 
  - `d:\web\Winters\frontend\src\views\lab\tutorials\index.js`
  - `d:\web\Winters\frontend\src\views\lab\CodeLab.vue`
  - 新增MD文件解析和加载逻辑

## ADDED Requirements

### Requirement: MD文件格式设计
系统 SHALL 定义标准的MD文件格式，用于存储教程数据，包括语言信息和教程内容。

#### Scenario: MD文件结构
- **WHEN** 创建新的语言教程MD文件
- **THEN** 必须遵循预定义的MD格式，包含语言信息和教程数据

### Requirement: MD文件解析
系统 SHALL 提供MD文件解析功能，将MD格式转换为与现有JS数据结构相同的对象格式。

#### Scenario: 解析MD文件
- **WHEN** 系统加载MD文件
- **THEN** 应正确解析文件内容，生成与原JS数据结构一致的对象

### Requirement: 动态加载MD文件
系统 SHALL 支持在Vue组件中动态加载和解析MD文件，保持与原有JS文件相同的使用方式。

#### Scenario: 加载MD文件
- **WHEN** CodeLab组件初始化
- **THEN** 应从MD文件中加载教程数据，与原JS文件加载方式保持一致

## MODIFIED Requirements

### Requirement: 数据加载逻辑
修改现有的数据加载逻辑，从加载JS文件改为加载和解析MD文件。

## REMOVED Requirements

无
