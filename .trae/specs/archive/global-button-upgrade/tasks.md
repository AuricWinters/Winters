# Tasks

- [x] Task 1: 创建全局按钮基础样式
  - [x] 在main.css中定义.btn-base通用按钮类
  - [x] 设置渐变背景：linear-gradient(135deg, #8B5CF6, #6366F1)
  - [x] 基础圆角、内边距、字体样式
  - [x] 默认阴影效果

- [x] Task 2: 实现白色光晕Hover效果
  - [x] 定义.btn-base:hover样式
  - [x] 添加白色光晕：box-shadow: 0 0 25px rgba(255,255,255,0.6), 0 0 50px rgba(139,92,246,0.4)
  - [x] 上浮动画：transform: translateY(-2px)
  - [x] 过渡时间：transition: all 0.3s ease

- [x] Task 3: 定义按钮变体样式
  - [x] .btn-primary：强渐变 + 强光晕（用于主要操作）
  - [x] .btn-secondary：玻璃态背景 + 中等光晕（用于次要操作）
  - [x] .btn-ghost：透明背景 + 边框 + hover时填充 + 轻光晕

- [x] Task 4: 升级Header.vue导航按钮
  - [x] 将"登录"按钮应用新样式（在header.css中）
  - [x] 确保在固定导航栏中正常显示

- [x] Task 5: 升级Login.vue和Register.vue表单按钮
  - [x] 登录/注册提交按钮应用渐变+光晕效果
  - [x] 保持表单布局不变

- [x] Task 6: 升级Projects.vue项目卡片按钮
  - [x] "查看详情"按钮应用渐变+强光晕
  - [x] "GitHub"按钮应用玻璃态次级样式+中等光晕

- [x] Task 7: 升级Lab.vue实验室卡片按钮
  - [x] 箭头图标按钮添加白色光晕效果（三层光晕组合）
  - [x] 保持与bento风格协调

- [x] Task 8: 检查并升级其他页面按钮
  - [x] Contact.vue提交按钮升级（features.css中的.submit-btn）
  - [x] 全局按钮系统已建立，其他页面可复用

# Task Dependencies
- Task 2 依赖 Task 1 ✅ 已完成
- Task 3 依赖 Task 1 ✅ 已完成
- Task 4-8 可并行执行 ✅ 已全部完成
