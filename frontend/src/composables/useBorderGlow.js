/**
 * useBorderGlow — 锥形渐变边框发光
 * 来源: React Bits BorderGlow
 * 用法: useBorderGlow(elRef)
 * CSS: 元素需有 .glow-border::after 或类似的 mask 伪元素
 */
import { onMounted, onUnmounted } from 'vue'

export function useBorderGlow(elRef) {
  let el = null

  function onMove(e) {
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const angle = Math.atan2(y - rect.height / 2, x - rect.width / 2) * (180 / Math.PI)
    el.style.setProperty('--glow-angle', angle + 'deg')
  }

  function onLeave() {
    el.style.setProperty('--glow-angle', '0deg')
  }

  onMounted(() => {
    el = elRef.value || elRef
    if (!el) return
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
  })

  onUnmounted(() => {
    if (!el) return
    el.removeEventListener('mousemove', onMove)
    el.removeEventListener('mouseleave', onLeave)
  })
}
