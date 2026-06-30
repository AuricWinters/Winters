# Tasks

- [x] Task 1: 清理后端遗留测试文件
  - [x] SubTask 1.1: 检查 [backend/test_ws.py](file:///d:/project/Winters/backend/test_ws.py) ~ [test_ws5.py](file:///d:/project/Winters/backend/test_ws5.py) 内容，确认无需要保留的代码
  - [x] SubTask 1.2: 删除 5 个 test_ws*.py 文件
  - [x] SubTask 1.3: 运行 `python main.py` 验证后端仍能启动

- [x] Task 2: 修复 models.py 字段重复定义
  - [x] SubTask 2.1: 读取 [models.py](file:///d:/project/Winters/backend/models.py) 第 46-74 行
  - [x] SubTask 2.2: 移除 `UserCreate` 中重复定义的 `nickname/phone/email`，或改为 `Optional` 且不与 `UserBase` 冲突
  - [x] SubTask 2.3: 运行后端并测试 `/api/auth/register` 验证通过

- [x] Task 3: 统一前后端 token 字段名
  - [x] SubTask 3.1: 搜索前端所有 `localStorage.getItem/setItem` 中 token 相关的键名
  - [x] SubTask 3.2: 确认统一为 `winters_token`，修正不一致的地方
  - [x] SubTask 3.3: 验证登录、刷新、路由守卫 `/profile` 仍能正常工作

- [x] Task 4: 清理前端 console 日志
  - [x] SubTask 4.1: 搜索所有 `console.log/warn/error`（此前已定位 21 处 / 10 文件）
  - [x] SubTask 4.2: 删除调试用的 `console.log`，保留必要的 `warn`/`error`
  - [x] SubTask 4.3: 运行 `npm run lint:check` 确认 `no-console` 不报错

- [x] Task 5: JWT Secret 与 CORS 配置化
  - [x] SubTask 5.1: 读取 [auth.py](file:///d:/project/Winters/backend/routes/auth.py) 和 [main.py](file:///d:/project/Winters/backend/main.py)
  - [x] SubTask 5.2: 将 `JWT_SECRET` 改为从 `os.environ.get('WINTERS_JWT_SECRET', 'dev-secret')` 读取
  - [x] SubTask 5.3: 将 CORS `allow_origins` 改为从 `os.environ.get('WINTERS_CORS_ORIGINS', 'http://localhost:3000')` 读取并解析为列表
  - [x] SubTask 5.4: 验证登录与跨域请求正常

- [x] Task 6: 整理 .trae/specs 文档
  - [x] SubTask 6.1: 扫描 `.trae/specs/` 和 `frontend/.trae/specs/`，标记已完成/过期/重复的 spec
  - [x] SubTask 6.2: 将已完成的 spec 移动到 `.trae/specs/archive/`（或类似归档目录）
  - [x] SubTask 6.3: 合并主题重复的 spec（如 fix-lab-responsive-layout 与 lab-alternating-layout 如有重叠则只保留一个）

- [x] Task 7: 同步 README.md 与 CLAUDE.md
  - [x] SubTask 7.1: 统计真实代码中的路由数（router/index.js）、store 数、组件数
  - [x] SubTask 7.2: 更新 README.md 中的技术栈/功能/结构描述
  - [x] SubTask 7.3: 更新 CLAUDE.md 中的项目结构、版本号、路由表、store 表
  - [x] SubTask 7.4: 确保两份文档的关键数字一致

- [x] Task 8: 端到端验证
  - [x] SubTask 8.1: 前端 `npm run build` 成功
  - [x] SubTask 8.2: 后端 `python main.py` 启动成功
  - [x] SubTask 8.3: 注册/登录/获取 profile 流程走通（实际使用 `GET /api/user/me` 获取用户信息，`GET /api/user/profile` 未实现）
  - [x] SubTask 8.4: `npm run lint:check` 无 errors

# Task Dependencies

- Task 3 depends on Task 2
- Task 8 depends on Task 1、Task 2、Task 3、Task 4、Task 5
