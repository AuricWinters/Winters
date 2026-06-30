# P1/P2 技术债务清理 Spec

## Why

P0 修复后项目已能构建和运行，但代码库仍积累了大量 AI 迭代留下的债务：后端遗留测试文件、重复模型字段、硬编码密钥、前后端 token 字段不一致、控制台日志未清理、spec 文档过期/重复、README 与真实代码不符。这些不影响当前构建，但会增加维护成本、带来安全隐患，并阻碍后续迭代。

## What Changes

- 清理后端 [test_ws.py](file:///d:/project/Winters/backend/test_ws.py) ~ [test_ws5.py](file:///d:/project/Winters/backend/test_ws5.py) 遗留文件
- 修复 [models.py](file:///d:/project/Winters/backend/models.py) `UserCreate` 中 `nickname/phone/email` 重复定义/类型冲突
- 统一前后端认证 token 字段名（前端 `winters_token` / 后端 JWT 签发/解析字段）
- 清理前端 21 处 `console.log/warn/error`，保留必要的改为 `console.warn`
- 将后端 JWT secret 与 CORS allow_origins 移入环境变量配置，不再硬编码
- 归档/合并 `.trae/specs` 中已完成或过期的 spec 文件夹
- 同步 [README.md](file:///d:/project/Winters/README.md) 与 [CLAUDE.md](file:///d:/project/Winters/CLAUDE.md) 中的路由数、store 数、组件数、版本号等关键数据

## Impact

- 受影响后端文件：[models.py](file:///d:/project/Winters/backend/models.py)、[routes/auth.py](file:///d:/project/Winters/backend/routes/auth.py)、[main.py](file:///d:/project/Winters/backend/main.py)、测试文件
- 受影响前端文件：含 `console.log` 的 10 个文件（stores、utils、views、components）
- 受影响文档：[README.md](file:///d:/project/Winters/README.md)、[CLAUDE.md](file:///d:/project/Winters/CLAUDE.md)、`.trae/specs/` 目录
- 无新增用户功能，无破坏性 API 变更

## ADDED Requirements

### Requirement: 后端配置外部化

系统 SHALL 支持通过环境变量读取 `JWT_SECRET` 和 `CORS_ORIGINS`，未设置时使用安全的本地默认值。

#### Scenario: 使用环境变量启动
- **WHEN** 设置 `WINTERS_JWT_SECRET=xxx` 和 `WINTERS_CORS_ORIGINS=http://localhost:3000` 后启动后端
- **THEN** `/api/auth/login` 使用指定 secret 签发 token
- **AND** CORS 只响应指定来源

#### Scenario: 本地默认启动
- **WHEN** 未设置环境变量时启动后端
- **THEN** 使用本地开发默认值（secret 为开发字符串，CORS 允许 localhost:3000）
- **AND** 服务正常运行

## MODIFIED Requirements

### Requirement: 用户注册数据模型一致

系统 SHALL 保证 `UserCreate` 不重复定义 `nickname/phone/email`，避免与 `UserBase` 冲突。

#### Scenario: 注册请求验证
- **WHEN** 发送注册请求，只包含 account、password、confirm_password
- **THEN** 请求通过验证
- **AND** nickname/phone/email 保持可选

### Requirement: 认证 Token 字段统一

系统 SHALL 统一使用 `winters_token` 作为 JWT 在 localStorage 与 HTTP Authorization 头中的字段/键名。

#### Scenario: 登录后存储
- **WHEN** 用户登录成功
- **THEN** 前端将 token 存入 `localStorage.winters_token`
- **AND** 后端从 `Authorization: Bearer <winters_token>` 解析同一 token

#### Scenario: 路由守卫检查
- **WHEN** 访问 `/profile`
- **THEN** 路由守卫检查 `localStorage.getItem('winters_token')`
- **AND** 无 token 时重定向到登录页

### Requirement: 生产构建无 console 输出

系统 SHALL 保证生产构建产物中不保留开发用 `console.log`（保留 `console.warn`/`console.error` 用于运行时告警）。

#### Scenario: Lint 检查
- **WHEN** 运行 `npm run lint:check`
- **THEN** `no-console` 相关的错误为 0
- **AND** 仅剩允许的 `warn`/`error` 级别日志

## REMOVED Requirements

### Requirement: backend/test_ws*.py 测试脚本

**Reason**：5 个 `test_ws*.py` 是调试 WebSocket 的临时脚本，无断言、无复用价值，与正式测试无关。
**Migration**：如需 WebSocket 测试，后续统一在 tests/ 目录用 pytest 编写。
