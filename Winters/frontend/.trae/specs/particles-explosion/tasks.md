# 粒子系统爆炸效果 - 实现计划

## [x] Task 1: 修复边界反弹效果
- **Priority**: P0
- **Depends On**: None
- **Description**:
  - 修复 `src/utils/particles.js` 中的边界反弹逻辑
  - 确保粒子在碰到页面边界时能够正确反弹
  - 处理 `position: fixed` 元素的尺寸计算问题
- **Acceptance Criteria Addressed**: AC-1
- **Test Requirements**:
  - `human-judgment` TR-1.1: 粒子碰到边界时应当正确反弹，改变运动方向
  - `human-judgment` TR-1.2: 反弹效果应当自然，符合物理规律
- **Notes**: 重点关注 `offsetParent === null` 时的尺寸计算

## [x] Task 2: 实现爆炸效果基础功能
- **Priority**: P0
- **Depends On**: Task 1
- **Description**:
  - 在 `src/utils/particles.js` 中添加爆炸效果的核心逻辑
  - 实现 `explode()` 方法，用于触发爆炸效果
  - 为粒子添加爆炸相关的属性
- **Acceptance Criteria Addressed**: AC-2
- **Test Requirements**:
  - `human-judgment` TR-2.1: 点击页面时，粒子应当从点击位置向外飞散
  - `human-judgment` TR-2.2: 爆炸效果应当明显，粒子应当向各个方向飞散
- **Notes**: 确保爆炸效果与现有的粒子系统集成良好

## [x] Task 3: 增强爆炸效果
- **Priority**: P1
- **Depends On**: Task 2
- **Description**:
  - 调整爆炸效果的参数，使其更剧烈、速度更快、范围更大
  - 优化爆炸动画的视觉效果
  - 确保爆炸效果的持续时间和速度参数合理
- **Acceptance Criteria Addressed**: AC-3
- **Test Requirements**:
  - `human-judgment` TR-3.1: 爆炸效果应当剧烈，粒子速度快
  - `human-judgment` TR-3.2: 爆炸效果的范围应当大，覆盖较大区域
- **Notes**: 根据实际效果调整参数，确保视觉效果震撼

## [x] Task 4: 确保不同屏幕尺寸兼容性
- **Priority**: P1
- **Depends On**: Task 3
- **Description**:
  - 测试爆炸效果在不同屏幕尺寸下的表现
  - 确保爆炸效果能够适应不同的屏幕尺寸
  - 修复可能的尺寸计算问题
- **Acceptance Criteria Addressed**: AC-4
- **Test Requirements**:
  - `human-judgment` TR-4.1: 爆炸效果在不同屏幕尺寸下都能正常工作
  - `human-judgment` TR-4.2: 爆炸效果应当适应不同的屏幕尺寸
- **Notes**: 测试响应式布局下的爆炸效果

## [x] Task 5: 集成到登录页面
- **Priority**: P0
- **Depends On**: Task 4
- **Description**:
  - 在 `src/views/Login.vue` 中添加点击事件监听器
  - 存储粒子实例，以便触发爆炸效果
  - 确保登录页面能够正确触发爆炸效果
- **Acceptance Criteria Addressed**: AC-2, AC-3, AC-4
- **Test Requirements**:
  - `human-judgment` TR-5.1: 点击登录页面时应当触发爆炸效果
  - `human-judgment` TR-5.2: 爆炸效果应当从点击位置向外飞散
- **Notes**: 确保事件监听器正确绑定，粒子实例正确存储