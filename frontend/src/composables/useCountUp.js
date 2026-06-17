/**
 * useCountUp — 数字滚动计数
 * 来源: React Bits CountUp
 * 用法: useCountUp(elRef, { target: 1000, duration?: 1800 })
 */
export function useCountUp(elRef, { target, duration = 1800 } = {}) {
  const el = elRef.value || elRef
  if (!el) return

  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
  }

  const start = performance.now()
  function tick(ts) {
    const elapsed = ts - start
    const progress = Math.min(elapsed / duration, 1)
    const eased = easeOutExpo(progress)
    el.textContent = Math.floor(eased * target).toLocaleString()
    if (progress < 1) {
      requestAnimationFrame(tick)
    } else {
      el.textContent = target.toLocaleString()
    }
  }
  requestAnimationFrame(tick)
}
