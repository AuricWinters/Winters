# Tasks

- [x] Task 1: 修改侧边栏为玻璃拟态风格
  - [x] 修改 `.sidebar` 的 background 为 `var(--bg-glass)`
  - [x] 添加 `backdrop-filter: blur(12px)` 和 `-webkit-backdrop-filter`
  - [x] 修改 border 为 `1px solid rgba(255, 255, 255, 0.3)`
  - [x] 添加 `border-radius: 20px`
  - [x] 确保 `box-shadow: var(--shadow-lg)`
  - [x] 调整位置使其不贴边（添加 margin: 20px 0 20px 20px）

- [x] Task 2: 修复主内容区背景问题
  - [x] 检查并确认 `.code-lab-page` 和 `.main-content` 的背景设置
  - [x] 确保背景颜色正确显示
  - [x] 调整 `.main-content` margin-left（300px/92px）配合侧边栏margin

- [x] Task 3: 验证折叠/展开两种状态的视觉效果
  - [x] 确认展开态侧边栏玻璃效果正常
  - [x] 确认折叠态侧边栏玻璃效果正常
  - [x] 确认语言选择、glider动画等功能不受影响
