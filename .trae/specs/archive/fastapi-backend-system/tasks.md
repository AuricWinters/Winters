# Tasks

## 阶段一：后端基础架构搭建
- [x] Task 1: 初始化 FastAPI 项目结构
  - [x] 创建 Backend 目录结构
  - [x] 配置 requirements.txt（fastapi, uvicorn, sqlite3 等）
  - [x] 创建主应用入口 main.py
  - [x] 配置 CORS 中间件

## 阶段二：数据库与用户模型
- [x] Task 2: 实现数据库连接和用户模型
  - [x] 创建 database.py 配置 SQLite 连接
  - [x] 创建 models.py 定义 User 模型
  - [x] 实现 database.py 中的初始化表结构函数
  - [x] 创建用户数据访问层 crud.py

## 阶段三：用户认证 API
- [x] Task 3: 实现用户注册 API
  - [x] 创建 auth.py 路由文件
  - [x] 实现 POST /api/auth/register 端点
  - [x] 实现表单验证（密码一致性、账号格式）
  - [x] 实现账号唯一性检查

- [x] Task 4: 实现用户登录 API
  - [x] 实现 POST /api/auth/login 端点
  - [x] 实现账号密码验证逻辑
  - [x] 返回用户信息和登录状态

## 阶段四：代码执行 API
- [x] Task 5: 实现代码执行引擎
  - [x] 创建 executor.py 代码执行模块
  - [x] 实现 JavaScript/Python 代码执行（使用 subprocess）
  - [x] 实现 C 代码执行（编译+运行）
  - [x] 实现 Java 代码执行（编译+运行）
  - [x] 实现 PHP 代码执行
  - [x] 实现执行超时控制和安全沙箱
  - [x] 实现输出捕获和错误处理

- [x] Task 6: 创建代码执行 API 端点
  - [x] 创建 routes/code.py 路由文件
  - [x] 实现 POST /api/code/execute 端点
  - [x] 接收代码、语言类型参数
  - [x] 调用 executor 并返回结果

## 阶段五：前端集成
- [x] Task 7: 修改 CodeLab.vue 集成后端 API
  - [x] 修改 runCode 函数支持调用后端 API
  - [x] 根据语言类型选择执行方式（前端/后端）
  - [x] 处理 API 错误和网络异常
  - [x] 更新 UI 显示后端执行结果

## 阶段六：测试与验证
- [x] Task 8: 测试所有功能
  - [x] 启动后端服务并验证可访问性
  - [x] 测试用户注册流程
  - [x] 测试用户登录流程
  - [x] 测试各语言代码执行功能
  - [x] 验证前后端联调正常工作

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 2]
- [Task 4] depends on [Task 2]
- [Task 5] depends on [Task 1]
- [Task 6] depends on [Task 5]
- [Task 7] depends on [Task 6]
- [Task 8] depends on [Task 3, Task 4, Task 6, Task 7]
