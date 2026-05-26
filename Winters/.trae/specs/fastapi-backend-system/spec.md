# FastAPI 后端系统规范

## Why
当前前端代码实验室只能运行 JavaScript 代码，其他语言（C、Java、Python、PHP 等）无法执行。需要一个后端服务来支持多语言代码运行，同时实现用户登录注册功能。

## What Changes
- 在 `Backend` 文件夹下创建基于 Python FastAPI 的后端服务
- 实现代码执行 API，支持多种编程语言的代码运行
- 实现用户认证系统（注册、登录）
- 前端集成后端 API 调用

## Impact
- Affected specs: code-editor-runner（扩展代码运行功能）
- Affected code:
  - `d:\web\Winters\Backend\` （新建后端项目）
  - `d:\web\Winters\frontend\src\views\lab\CodeLab.vue`（集成后端 API）

## ADDED Requirements

### Requirement: 代码执行 API
系统 SHALL 提供一个 RESTful API 端点用于执行多种编程语言的代码。

#### Scenario: 执行 JavaScript/Python 代码
- **WHEN** 前端发送 POST 请求到 `/api/code/execute` 并包含代码和语言类型
- **THEN** 后端执行代码并返回输出结果或错误信息

#### Scenario: 执行 C/Java/PHP 代码
- **WHEN** 前端发送请求执行需要编译的语言
- **THEN** 后端编译并执行代码，返回编译输出或运行结果

### Requirement: 用户注册系统
系统 SHALL 提供用户注册功能，支持手机号或邮箱注册。

#### Scenario: 成功注册新用户
- **WHEN** 用户提交注册表单（手机号/邮箱 + 密码 + 确认密码）
- **AND** 两次密码一致且账号未被注册
- **THEN** 创建用户账户并返回成功消息

#### Scenario: 注册失败 - 密码不一致
- **WHEN** 用户提交的两次密码不一致
- **THEN** 返回错误提示"两次输入的密码不一致"

#### Scenario: 注册失败 - 账号已存在
- **WHEN** 用户提交的账号已被注册
- **THEN** 返回错误提示"该账号已被注册"

### Requirement: 用户登录系统
系统 SHALL 提供用户登录功能。

#### Scenario: 成功登录
- **WHEN** 用户提交正确的账号和密码
- **THEN** 返回登录成功状态和用户信息

#### Scenario: 登录失败 - 密码错误
- **WHEN** 用户提交的密码不正确
- **THEN** 返回错误提示"密码错误"

#### Scenario: 登录失败 - 账号不存在
- **WHEN** 用户提交的账号不存在
- **THEN** 返回错误提示"该账号不存在"

## MODIFIED Requirements

### Requirement: 前端代码运行器
修改现有的前端代码运行逻辑：
- JavaScript/TypeScript：可选择前端直接运行或后端运行
- 其他语言（C、Java、Python、PHP）：统一调用后端 API 执行
- 显示后端返回的执行结果

## 技术栈要求
- **框架**: Python FastAPI
- **数据库**: SQLite（轻量级，无需额外安装）
- **数据存储**: 明文存储（用户名、密码等）
- **代码执行**: 使用 subprocess 模块执行代码
- **CORS**: 支持跨域请求
