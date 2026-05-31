# Tasks

- [x] Task 1: 调整弹窗位置避免被导航栏遮挡
  - [x] 修改 `.tutorial-modal` 的定位方式，使用 flexbox 居中并调整 padding-top
  - [x] 或改用 calc() 计算合适的 top 值，考虑导航栏高度
  - [x] 测试不同屏幕尺寸下的弹窗位置

- [x] Task 2: 实现弹窗打开/关闭动画
  - [x] 使用 Vue 的 `<Transition>` 组件包裹弹窗
  - [x] 定义弹窗进入动画（scale + fade-in）
  - [x] 定义弹窗退出动画（scale + fade-out）
  - [x] 定义背景遮罩的淡入淡出动画
  - [x] 调整动画时长和缓动函数确保流畅性

- [x] Task 3: 实现教程切换动画
  - [x] 为教程内容区域添加 `<Transition>` 组件
  - [x] 定义向左/向右滑动的 CSS 动画类
  - [x] 使用状态变量跟踪切换方向（prev/next）
  - [x] 在 prevTutorial/nextTutorial 方法中设置切换方向
  - [x] 确保 key 值变化触发 Transition 重新渲染

- [x] Task 4: 优化动画性能和细节
  - [x] 为动画元素添加 will-change 属性优化性能
  - [x] 确保动画期间禁止用户重复点击
  - [x] 测试动画在不同浏览器中的兼容性
  - [x] 验证移动端触摸设备的动画流畅度

# Task Dependencies
- [Task 2] 和 [Task 3] 可并行执行，但都依赖于 [Task 1] 完成 ✓
- [Task 4] 必须在 [Task 2] 和 [Task 3] 之后执行 ✓
