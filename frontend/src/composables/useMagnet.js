/**
 * useMagnet — 磁性吸附
 * 来源: React Bits Magnet
 * 用法: useMagnet(elRef, { maxDist?: 120, strength?: 20 })
 * 元素需有 transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1)
 */
import { onMounted, onUnmounted } from 'vue'

export function useMagnet(elRef, { maxDist = 120, strength = 20 } = {}) {
  let el = null

  function onMove(e) {
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = e.clientX - cx
    const dy = e.clientY - cy
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist < maxDist) {
      const s = (1 - dist / maxDist) * strength
      el.style.transform = `translate(${(dx / dist) * s}px, ${(dy / dist) * s}px)`
    } else {
      el.style.transform = 'translate(0, 0)'
    }
  }

  function onLeave() {
    el.style.transform = 'translate(0, 0)'
  }

  onMounted(() => {
    el = elRef.value || elRef
    if (!el) return
    window.addEventListener('mousemove', onMove)
  })

  onUnmounted(() => {
    window.removeEventListener('mousemove', onMove)
  })
}
