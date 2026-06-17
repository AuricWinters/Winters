/**
 * useTilt — 3D 透视倾斜
 * 来源: React Bits TiltedCard
 * 用法: useTilt(elRef, options?)
 * CSS: 元素需有 transform-style: preserve-3d; perspective
 */
import { onMounted, onUnmounted } from 'vue'

export function useTilt(elRef, { maxDeg = 15, perspective = 800 } = {}) {
  let el = null

  function onMove(e) {
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = (e.clientX - cx) / (rect.width / 2)
    const dy = (e.clientY - cy) / (rect.height / 2)
    el.style.transform = `perspective(${perspective}px) rotateY(${dx * maxDeg}deg) rotateX(${-dy * maxDeg}deg)`
  }

  function onLeave() {
    el.style.transform = `perspective(${perspective}px) rotateY(0deg) rotateX(0deg)`
  }

  onMounted(() => {
    el = elRef.value || elRef
    if (!el) return
    el.style.transformStyle = 'preserve-3d'
    el.style.willChange = 'transform'
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
  })

  onUnmounted(() => {
    if (!el) return
    el.removeEventListener('mousemove', onMove)
    el.removeEventListener('mouseleave', onLeave)
  })
}
