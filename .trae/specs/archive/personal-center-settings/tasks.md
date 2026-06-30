# 个人中心 Web 设置功能 - 任务列表

## 前端任务

- [x] Task 1: 创建设置状态管理 (settings store)
  - [x] SubTask 1.1: 创建 Pinia settings store
  - [x] SubTask 1.2: 实现设置持久化到 localStorage
  - [x] SubTask 1.3: 实现设置恢复逻辑

- [x] Task 2: 创建设置组合式函数 (useSettings)
  - [x] SubTask 2.1: 创建 useSettings composable
  - [x] SubTask 2.2: 实现主题切换逻辑
  - [x] SubTask 2.3: 实现语言切换逻辑
  - [x] SubTask 2.4: 实现系统主题监听

- [x] Task 3: 重构个人中心页面 (Profile.vue)
  - [x] SubTask 3.1: 添加Web设置面板
  - [x] SubTask 3.2: 实现设置UI组件（语言选择、主题选择等）
  - [x] SubTask 3.3: 添加头像点击打开设置功能
  - [x] SubTask 3.4: 集成设置store到个人中心

- [x] Task 4: 添加设置面板组件
  - [x] SubTask 4.1: 创建 SettingsPanel.vue 组件
  - [x] SubTask 4.2: 实现语言选择器
  - [x] SubTask 4.3: 实现主题选择器（浅色/深色/跟随系统）
  - [x] SubTask 4.4: 添加其他设置选项（动画开关等）

- [x] Task 5: 应用全局主题样式
  - [x] SubTask 5.1: 定义深色主题CSS变量
  - [x] SubTask 5.2: 实现主题切换逻辑
  - [x] SubTask 5.3: 在App.vue中应用主题

## 任务依赖
- Task 2 依赖 Task 1
- Task 3 依赖 Task 1、Task 2
- Task 4 依赖 Task 1、Task 2
- Task 5 无依赖，可以并行执行

## 实施顺序
1. Task 1 (settings store) - 首先创建状态管理
2. Task 2 (useSettings) - 然后创建设置组合式函数
3. Task 4 (SettingsPanel) - 创建设置面板组件
4. Task 3 (Profile.vue) - 重构个人中心页面
5. Task 5 (全局主题) - 应用全局主题样式