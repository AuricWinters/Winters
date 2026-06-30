# 修复构建阻塞与运行时隐患 Spec

## Why

项目当前无法通过前端生产构建（`npm run build` 因 `Blog.vue` 双 `finally` 语法错误直接失败），且后端 `executor.py` 在代码执行异常路径下会触发 `NameError`。这两个问题导致项目无法部署、在线 IDE 等核心功能存在隐藏崩溃风险，必须先修复以恢复基线稳定性。

## What Changes

- 修复 [Blog.vue](file:///d:/project/Winters/frontend/src/views/Blog.vue) 中重复的 `finally` 块，使 `npm run build` 成功通过
- 修复 [executor.py](file:///d:/project/Winters/backend/executor.py) 三处 `error:` 为 `"error":`，消除异常处理路径的 `NameError`
- 运行 `npm run lint -- --fix` 自动修复可自动修复的 ESLint 问题
- 手动修复剩余不可自动修复的 ESLint errors（未使用变量等）
- 验证前端构建成功、后端代码执行异常路径返回正常错误信息

## Impact

- 受影响页面：[Blog.vue](file:///d:/project/Winters/frontend/src/views/Blog.vue)
- 受影响后端模块：[executor.py](file:///d:/project/Winters/backend/executor.py)
- 受影响脚本：`frontend/package.json` 中的 lint/build 流程
- 无新增功能，无破坏性变更

## MODIFIED Requirements

### Requirement: 前端构建可用

系统 SHALL 保证 `npm run build` 能够成功完成，不报错退出。

#### Scenario: 构建成功
- **WHEN** 在 `frontend/` 目录执行 `npm run build`
- **THEN** 命令以 0 退出码完成
- **AND** `frontend/dist/` 目录生成构建产物

### Requirement: 后端代码执行异常处理正确

系统 SHALL 在 `executor.py` 执行代码过程中发生异常时，返回包含 `"error"` 字段的错误响应，而不是抛出 `NameError`。

#### Scenario: Python 执行准备失败
- **WHEN** 调用 `execute_code()` 且 `_execute_python` 内部抛异常
- **THEN** 返回 `{"success": false, "output": "", "error": "..."}`
- **AND** 不抛出 `NameError: name 'error' is not defined`

#### Scenario: C 语言执行过程出错
- **WHEN** 调用 `execute_code()` 且 `_execute_c` 内部抛异常
- **THEN** 返回包含 `"error"` 字段的错误响应
- **AND** 不抛出 `NameError`

#### Scenario: PHP 执行准备失败
- **WHEN** 调用 `execute_code()` 且 `_execute_php` 内部抛异常
- **THEN** 返回包含 `"error"` 字段的错误响应
- **AND** 不抛出 `NameError`

### Requirement: ESLint 无 errors

系统 SHALL 保证 `npm run lint:check` 不存在 errors（warnings 可接受但应尽量减少）。

#### Scenario: Lint 检查通过
- **WHEN** 在 `frontend/` 目录执行 `npm run lint:check`
- **THEN** 命令以 0 退出码完成
- **AND** 输出中 `errors` 数量为 0
