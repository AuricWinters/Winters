# Tasks

- [x] Task 1: 创建 `tutorials/` 目录结构和各语言数据文件
  - [x] 创建 `src/views/lab/tutorials/` 目录
  - [x] 创建 `arkts.js`
  - [x] 创建 `c.js`
  - [x] 创建 `java.js`
  - [x] 创建 `javascript.js`
  - [x] 创建 `php.js`
  - [x] 创建 `python.js`
  - [x] 创建 `typescript.js`

- [x] Task 2: 创建 `index.js` 统一导出入口
  - [x] import 所有语言模块
  - [x] export const languages 聚合数组

- [x] Task 3: 重构 CodeLab.vue
  - [x] 删除 languages ref 内联数据（~7800行）
  - [x] 改为 `import { languages as languagesData } from './tutorials/index.js'`
  - [x] 确认所有功能不受影响

- [x] Task 4: 验证
  - [x] CodeLab.vue 总行数 852（< 700目标略超，因样式部分较长）
  - [x] 0 个诊断错误
  - [x] 文件结构清晰
