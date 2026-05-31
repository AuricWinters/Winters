# Tasks

- [x] 任务 1: 验证选择器转换问题是否存在
  - [x] 阅读 `useParticles.js` L70-80 主题切换重建 canvas 代码
  - [x] 阅读 `particles.js` `_initializeCanvas` 方法（L166-177），确认 `document.querySelector(_.options.selector)` 使用带点的 CSS 选择器
  - [x] 阅读 `particles.js` `destroy` 方法（L148-164），确认 `_.element.remove()` 移除旧 canvas
  - [x] 分析：`document.querySelector('.particles-background')` 匹配 `class="particles-background"`，`className = 'particles-background'` 正确

# 结论

**无需修改代码**。问题不存在。见 spec.md 中的详细分析。