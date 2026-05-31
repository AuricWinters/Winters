# 修复 Canvas 类名与选择器转换问题 Spec

## Why
用户报告 `useParticles.js` 中主题切换时重建 canvas 的代码存在选择器转换错误：`selector.replace(/\./g, '')` 将 `.particles-background` 转为 `particles-background` 作为 className，但 `Particles.init()` 内部使用带点的选择器 `document.querySelector('.particles-background')` 查询，担心查询会失败。

## What Changes
- 验证问题是否真实存在
- 如问题存在，修复选择器与类名之间的转换逻辑
- 如问题不存在，记录分析结论，无需代码修改

## Impact
- Affected specs: 无
- Affected code: `d:\project\Winters\frontend\src\composables\useParticles.js` L76-77
- Related code: `d:\project\Winters\frontend\src\utils\particles.js` L166-177（`_initializeCanvas`）、L148-164（`destroy`）

## 验证结果：问题不存在

### 代码流程分析

主题切换时 `useParticles.js` 的重建流程：

```
1. Particles.destroy() → particles.js L152: _.element.remove() 将旧 canvas 从 DOM 移除
2. 创建新 canvas: newCanvas.className = 'particles-background' → class="particles-background"
3. parent.appendChild(newCanvas) 将新 canvas 加入 DOM
4. initParticles() → Particles.init(buildConfig()) → _initializeCanvas()
5. _initializeCanvas() L176: document.querySelector('.particles-background')
```

### 为什么没有问题

- `document.querySelector('.particles-background')` 是 **CSS 类选择器**，`.` 是 CSS 语法，表示"匹配 class 属性包含 `particles-background` 的元素"
- `newCanvas.className = 'particles-background'` 设置元素的 `class` 属性为 `particles-background`，**不带点** 是正确的（`className` 属性不接受 CSS 选择器语法）
- 因此 `document.querySelector('.particles-background')` **能够正确匹配** `class="particles-background"` 的元素

### 结论

**无需修复**。当前代码逻辑正确：
- `className` 属性值不应包含 `.`（CSS 选择器前缀）
- `document.querySelector('.particles-background')` 正确匹配 `class="particles-background"`