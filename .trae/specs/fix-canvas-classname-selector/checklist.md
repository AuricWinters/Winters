# Checklist

- [x] 验证 `document.querySelector('.particles-background')` 能匹配 `class="particles-background"` 的元素
- [x] 验证 `className` 属性值不应包含 CSS 选择器前缀 `.`
- [x] 验证 `Particles.destroy()` 正确移除旧 canvas 元素
- [x] 验证重建流程：销毁 → 创建新 canvas → 设置 className → 添加 DOM → 重新初始化
- [x] 确认无需代码修改