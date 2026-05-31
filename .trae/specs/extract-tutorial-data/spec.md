# CodeLab 教程数据外提重构 Spec

## Why
CodeLab.vue 当前约 **8000 行**，其中 **7800+ 行是内嵌的教程数据**（languages ref）。这导致：
- 文件臃肿，IDE 报告大量问题（~777个）
- Vue SFC 模板解析器误将代码示例中的 `</script>`、`</div>` 等当成真实标签
- 无法独立维护各语言教程
- 编辑器性能差、代码导航困难

## What Changes
- 将 `languages` 数据从 CodeLab.vue 中**提取到独立的 `.js` 文件**
- 每种语言一个文件，放在 `src/views/lab/tutorials/` 目录下
- CodeLab.vue 只保留模板（~120行）+ 脚本逻辑（~100行）+ 样式（~400行），总计 ~620行
- 用 `import` 引入教程数据

## Impact
- Affected code:
  - `d:\web\Winters\frontend\src\views\lab\CodeLab.vue` — 删除 languages 数据，改为 import
  - 新建 `d:\web\Winters\frontend\src\views\lab\tutorials\` 目录及以下文件：
    - `arkts.js`
    - `c.js`
    - `java.js`
    - `javascript.js`
    - `php.js`
    - `python.js`
    - `typescript.js`
    - `index.js`（统一导出）

## ADDED Requirements
### Requirement: 教程数据模块化
每种语言的教程数据 SHALL 导出为独立的 ES Module。

#### Scenario: 数据结构
- **WHEN** 各教程文件导出数据
- **THEN** 导出的对象结构为 `{ id, name, icon, version, description, tutorials[] }`，与原数据格式完全一致
- **AND** 每个 tutorial 包含 `{ id, title, icon, description, difficulty, examples[] }`
- **AND** 每个 example 包含 `{ title, code, explanation }`

### Requirement: 统一导出入口
- **WHEN** CodeLab.vue 引入数据
- **THEN** 通过 `import { languages } from './tutorials/index.js'` 一次性获取所有语言数据
- **AND** index.js 负责聚合所有语言模块

### Requirement: CodeLab.vue 精简
- **WHEN** 重构完成
- **THEN** CodeLab.vue 总行数 < 700 行
- **AND** 不再包含任何硬编码的教程内容
- **AND** 所有原有功能（侧边栏切换、弹窗展示、代码复制等）保持不变

## MODIFIED Requirements
### Requirement: CodeLab.vue 结构
CodeLab.vue 的 `<script setup>` 部分 SHALL：
1. 从 `./tutorials/index` import `languages`
2. 保留所有响应式状态和函数逻辑（selectedLang, showModal, toggleSidebar 等）
3. 删除原有的 `languages = ref([...])` 巨型数据块
