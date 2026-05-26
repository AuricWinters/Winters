# 粒子脱离倒计时功能 - 实现计划

## [x] Task 1: 分析当前粒子系统的倒计时逻辑
- **Priority**: P0
- **Depends On**: None
- **Description**:
  - 分析 `src/utils/particles.js` 中的当前倒计时逻辑
  - 确定当前倒计时开始的时机和条件
  - 识别需要修改的代码部分
- **Acceptance Criteria Addressed**: AC-1
- **Test Requirements**:
  - `human-judgment` TR-1.1: 理解当前粒子系统的倒计时逻辑
  - `human-judgment` TR-1.2: 识别需要修改的代码部分
- **Notes**: 重点关注粒子吸引和倒计时相关的代码

## [x] Task 2: 实现粒子到达光标中心的检测逻辑
- **Priority**: P0
- **Depends On**: Task 1
- **Description**:
  - 在 `src/utils/particles.js` 中添加粒子到达光标中心的检测逻辑
  - 定义光标最中心点的检测阈值
  - 确保只有当粒子真正到达光标中心时才触发倒计时
- **Acceptance Criteria Addressed**: AC-1
- **Test Requirements**:
  - `human-judgment` TR-2.1: 粒子到达光标中心时应当正确检测
  - `human-judgment` TR-2.2: 检测逻辑应当准确可靠
- **Notes**: 检测阈值应当合理，避免过于严格或宽松

## [x] Task 3: 修改脱离倒计时的开始时机
- **Priority**: P0
- **Depends On**: Task 2
- **Description**:
  - 修改 `src/utils/particles.js` 中的倒计时开始逻辑
  - 确保粒子只有在到达光标最中心点后才开始倒计时
  - 保持倒计时的持续时间和其他参数不变
- **Acceptance Criteria Addressed**: AC-1, AC-2
- **Test Requirements**:
  - `human-judgment` TR-3.1: 粒子只有在到达光标中心后才开始倒计时
  - `human-judgment` TR-3.2: 倒计时功能应当正常工作
- **Notes**: 确保修改不会影响其他粒子行为

## [x] Task 4: 测试和优化
- **Priority**: P1
- **Depends On**: Task 3
- **Description**:
  - 测试粒子的吸引、倒计时和脱离行为
  - 优化检测阈值和倒计时逻辑
  - 确保功能在不同屏幕尺寸下都能正常工作
- **Acceptance Criteria Addressed**: AC-2, AC-3
- **Test Requirements**:
  - `human-judgment` TR-4.1: 粒子的吸引和脱离行为应当自然流畅
  - `human-judgment` TR-4.2: 功能在不同屏幕尺寸下应当正常工作
- **Notes**: 测试不同屏幕尺寸和鼠标移动速度的情况

## [x] Task 5: 与现有功能集成
- **Priority**: P1
- **Depends On**: Task 4
- **Description**:
  - 确保新功能与现有的粒子爆炸效果集成
  - 确保新功能与边界反弹效果集成
  - 测试整体粒子系统的性能和稳定性
- **Acceptance Criteria Addressed**: AC-3
- **Test Requirements**:
  - `human-judgment` TR-5.1: 新功能应当与爆炸效果集成
  - `human-judgment` TR-5.2: 新功能应当与边界反弹效果集成
- **Notes**: 确保集成后的粒子系统整体表现良好