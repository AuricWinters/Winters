/**
 * useSpotlight — 鼠标跟踪聚光灯
 * 来源: React Bits SpotlightCard
 * 用法: useSpotlight(elRef) → 在目标元素上绑定 mousemove
 */
import { onMounted, onUnmounted } from 'vue'

export function useSpotlight(elRef) {
  let el = null

  function onMove(e) {
    const rect = el.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    el.style.setProperty('--mx', x + '%')
    el.style.setProperty('--my', y + '%')
  }

  onMounted(() => {
    el = elRef.value || elRef
    if (el) el.addEventListener('mousemove', onMove)
  })

  onUnmounted(() => {
    if (el) el.removeEventListener('mousemove', onMove)
  })
}
