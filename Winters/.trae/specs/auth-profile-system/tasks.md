# 登录注册系统与个人详情页面完善 - 实现计划

## [ ] Task 1: 后端 API 完善 - 用户信息管理
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 扩展用户模型，添加昵称、手机号、邮箱等字段
  - 添加个人信息获取 API
  - 添加个人信息更新 API
  - 添加密码重置 API
- **Acceptance Criteria Addressed**: AC-4, AC-5, AC-6
- **Test Requirements**:
  - `programmatic` TR-1.1: GET /api/user/profile 返回用户信息
  - `programmatic` TR-1.2: PUT /api/user/profile 成功更新用户信息
  - `programmatic` TR-1.3: POST /api/auth/reset-password 成功重置密码
- **Notes**: 需要修改 models.py, crud.py 和添加新的路由

## [ ] Task 2: 后端 API 完善 - 验证码系统
- **Priority**: P0
- **Depends On**: None
- **Description**:
  - 添加验证码发送 API（模拟）
  - 添加验证码验证 API
  - 实现验证码登录 API
- **Acceptance Criteria Addressed**: AC-2
- **Test Requirements**:
  - `programmatic` TR-2.1: POST /api/auth/send-code 成功发送验证码
  - `programmatic` TR-2.2: POST /api/auth/login/code 成功验证码登录
- **Notes**: 使用内存存储验证码，实际项目中应使用 Redis

## [ ] Task 3: 后端 API 完善 - 第三方登录
- **Priority**: P1
- **Depends On**: None
- **Description**:
  - 添加第三方登录回调 API
  - 实现微信和 GitHub 登录模拟
- **Acceptance Criteria Addressed**: AC-3
- **Test Requirements**:
  - `human-judgment` TR-3.1: 第三方登录流程完整
- **Notes**: 使用模拟回调，实际项目中需要配置真实的 OAuth 应用

## [ ] Task 4: 前端 - 个人详情页面开发
- **Priority**: P0
- **Depends On**: Task 1
- **Description**:
  - 创建 Profile.vue 页面
  - 实现用户信息展示
  - 实现信息编辑表单
  - 实现密码修改功能
- **Acceptance Criteria Addressed**: AC-4, AC-5
- **Test Requirements**:
  - `human-judgment` TR-4.1: 页面布局美观，响应式
  - `programmatic` TR-4.2: 信息编辑功能正常
- **Notes**: 使用现有粉金色 UI 风格

## [ ] Task 5: 前端 - 登录页面功能完善
- **Priority**: P0
- **Depends On**: Task 2, Task 3
- **Description**:
  - 完善手机号/邮箱登录验证
  - 实现验证码登录功能
  - 实现第三方登录按钮功能
  - 实现忘记密码流程
- **Acceptance Criteria Addressed**: AC-1, AC-2, AC-3, AC-6
- **Test Requirements**:
  - `programmatic` TR-5.1: 手机号登录功能正常
  - `programmatic` TR-5.2: 验证码登录功能正常
  - `human-judgment` TR-5.3: 第三方登录按钮可点击
- **Notes**: 保持现有登录页面 UI，仅添加功能

## [ ] Task 6: 前端 - 用户状态管理完善
- **Priority**: P0
- **Depends On**: Task 1
- **Description**:
  - 完善 Pinia user store
  - 添加用户信息持久化
  - 实现自动登录功能
  - 添加登录状态检查
- **Acceptance Criteria Addressed**: AC-7
- **Test Requirements**:
  - `programmatic` TR-6.1: 页面刷新后保持登录状态
  - `programmatic` TR-6.2: 未登录用户自动跳转到登录页
- **Notes**: 使用 localStorage 存储用户信息

## [ ] Task 7: 前端 - 导航栏用户信息展示
- **Priority**: P1
- **Depends On**: Task 6
- **Description**:
  - 修改 Header.vue，显示当前登录用户信息
  - 添加用户下拉菜单
  - 添加个人中心和退出登录链接
- **Acceptance Criteria Addressed**: AC-7
- **Test Requirements**:
  - `human-judgment` TR-7.1: 导航栏显示用户信息
  - `human-judgment` TR-7.2: 下拉菜单功能正常
- **Notes**: 保持现有粉金色 UI 风格

## [ ] Task 8: 路由配置和权限控制
- **Priority**: P0
- **Depends On**: Task 6
- **Description**:
  - 配置个人详情页面路由
  - 添加路由守卫，实现未登录跳转
  - 配置第三方登录回调路由
- **Acceptance Criteria Addressed**: AC-7
- **Test Requirements**:
  - `programmatic` TR-8.1: 未登录用户访问个人页面自动跳转登录
  - `programmatic` TR-8.2: 路由配置正确
- **Notes**: 使用 Vue Router 的导航守卫

## [ ] Task 9: 测试和验证
- **Priority**: P0
- **Depends On**: All
- **Description**:
  - 测试所有登录方式
  - 测试个人信息编辑功能
  - 测试密码重置功能
  - 测试响应式布局
- **Acceptance Criteria Addressed**: All
- **Test Requirements**:
  - `programmatic` TR-9.1: 所有 API 测试通过
  - `human-judgment` TR-9.2: UI 测试通过
- **Notes**: 确保所有功能正常工作

## [ ] Task 10: 文档和优化
- **Priority**: P2
- **Depends On**: All
- **Description**:
  - 更新 API 文档
  - 优化代码结构
  - 性能优化
  - 安全性检查
- **Acceptance Criteria Addressed**: All
- **Test Requirements**:
  - `human-judgment` TR-10.1: 代码结构清晰
  - `programmatic` TR-10.2: 性能测试通过
- **Notes**: 确保代码质量和可维护性