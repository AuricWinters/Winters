# Checklist

- [x] 5 个 backend/test_ws*.py 文件已删除
- [x] 后端 `python main.py` 仍能正常启动
- [x] [models.py](file:///d:/project/Winters/backend/models.py) `UserCreate` 不再重复定义 `nickname/phone/email`
- [x] `/api/auth/register` 注册请求验证通过
- [x] 前端所有 token 操作统一使用 `winters_token` 键名
- [x] `/profile` 路由守卫使用 `winters_token` 判断登录状态
- [x] 前端调试用 `console.log` 已清理
- [x] `npm run lint:check` 无 `no-console` errors
- [x] `JWT_SECRET` 从环境变量 `WINTERS_JWT_SECRET` 读取
- [x] CORS `allow_origins` 从环境变量 `WINTERS_CORS_ORIGINS` 读取
- [x] `.trae/specs/` 中已完成/过期/重复 spec 已归档或合并
- [x] [README.md](file:///d:/project/Winters/README.md) 中的路由数、store 数、组件数、版本号与真实代码一致
- [x] [CLAUDE.md](file:///d:/project/Winters/CLAUDE.md) 中的项目结构、版本号、路由表、store 表与真实代码一致
- [x] 前端 `npm run build` 成功
- [x] 注册/登录/获取 profile 流程走通（通过 `GET /api/user/me`）
