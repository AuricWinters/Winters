<template>
  <div ref="containerRef" class="color-bends-container">
    <canvas ref="canvasRef" />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const containerRef = ref(null)
const canvasRef = ref(null)

let animFrameId = null
let resizeObserver = null

const renderFrame = (time) => {
  const container = containerRef.value
  const canvas = canvasRef.value
  if (!container || !canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const w = container.clientWidth
  const h = container.clientHeight
  if (w === 0 || h === 0) return

  const dpr = Math.min(window.devicePixelRatio, 2)
  const cw = Math.round(w * dpr)
  const ch = Math.round(h * dpr)

  if (canvas.width !== cw || canvas.height !== ch) {
    canvas.width = cw
    canvas.height = ch
  }

  const t = time * 0.0003

  ctx.clearRect(0, 0, cw, ch)

  // Read CSS variable for primary color
  const style = getComputedStyle(container)
  const primaryRgb = style.getPropertyValue('--primary-rgb').trim() || '138, 92, 246'
  const secondaryRgb = style.getPropertyValue('--secondary-rgb').trim() || '0, 200, 255'

  // Draw flowing color bands
  const bandCount = 6
  for (let i = 0; i < bandCount; i++) {
    const phase = (i / bandCount) * Math.PI * 2 + t
    const offset = Math.sin(t * 0.5 + i) * 80

    for (let y = -60; y < ch + 60; y += 3) {
      const nx = (y / ch) * 2 - 1
      const wave = Math.sin(nx * 4 + phase * 2) * 0.3
                   + Math.sin(nx * 7 + phase * 1.3) * 0.15
                   + Math.sin(nx * 12 + phase * 0.7) * 0.08
      const x = (wave * 0.5 + 0.5) * cw + offset

      const alpha = Math.max(0, 0.08 - Math.abs(y - ch * 0.5) / (ch * 6))
      const mix = (i / bandCount + Math.sin(t + i) * 0.1)
      const r = Math.round(138 * (1 - mix) + 0 * mix)
      const g = Math.round(92 * (1 - mix) + 200 * mix)
      const b = Math.round(246 * (1 - mix) + 255 * mix)

      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
      ctx.fillRect(0, y, cw, 3)
    }
  }

  animFrameId = requestAnimationFrame(renderFrame)
}

onMounted(() => {
  const container = containerRef.value
  if (!container) return

  resizeObserver = new ResizeObserver(() => {})
  resizeObserver.observe(container)

  animFrameId = requestAnimationFrame(renderFrame)
})

onBeforeUnmount(() => {
  if (animFrameId !== null) {
    cancelAnimationFrame(animFrameId)
    animFrameId = null
  }
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
})
</script>

<style scoped>
.color-bends-container {
  width: 100%;
  height: 100%;
  position: relative;
  pointer-events: none;
  z-index: 3;
  overflow: hidden;
}

.color-bends-container canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
