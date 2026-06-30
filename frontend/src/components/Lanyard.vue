<template>
  <div class="lanyard-wrapper">
    <canvas
      ref="canvasRef"
      style="width:100%;height:100%;display:block"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  position: { type: Array, default: () => [0, 0, 30] },
  gravity: { type: Array, default: () => [0, -40, 0] },
  fov: { type: Number, default: 20 },
})

const canvasRef = ref(null)
let rafId = null
let particles = []
let isHovered = false
let dragPos = null

onMounted(async () => {
  await nextTick()
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect()
    const dpr = Math.min(devicePixelRatio, 2)
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    canvas.style.width = rect.width + 'px'
    canvas.style.height = rect.height + 'px'
  }
  resize()
  window.addEventListener('resize', resize)

  // Simple physics-based lanyard simulation
  const segmentCount = 12
  segments = []
  for (let i = 0; i < segmentCount; i++) {
    segments.push({
      x: canvas.width / 2,
      y: 20 + i * 15,
      vx: 0, vy: 0,
      ox: canvas.width / 2,
      oy: 20 + i * 15,
    })
  }

  segments[0].fixed = true
  const card = { x: canvas.width / 2, y: canvas.height / 2, vx: 0, vy: 0, targetX: canvas.width / 2, targetY: canvas.height / 2 }

  function animate() {
    const w = canvas.width
    const h = canvas.height
    const dt = 0.016

    ctx.clearRect(0, 0, w, h)

    // Update rope segments (simple spring physics)
    for (let i = 1; i < segments.length; i++) {
      const seg = segments[i]
      if (seg.fixed) continue

      // Gravity
      seg.vy += props.gravity[1] * dt * 10

      // Spring toward original position
      const dx = seg.ox - seg.x
      const dy = seg.oy - seg.y
      seg.vx += dx * 0.1
      seg.vy += dy * 0.1

      // Damping
      seg.vx *= 0.95
      seg.vy *= 0.95

      seg.x += seg.vx
      seg.y += seg.vy

      // Constrain to previous segment
      const prev = segments[i - 1]
      const cdx = seg.x - prev.x
      const cdy = seg.y - prev.y
      const dist = Math.sqrt(cdx * cdx + cdy * cdy)
      const targetDist = 15
      if (dist > targetDist) {
        const ratio = targetDist / dist
        seg.x = prev.x + cdx * ratio
        seg.y = prev.y + cdy * ratio
      }
    }

    // Card follows last segment and pointer
    const last = segments[segments.length - 1]
    if (dragPos) {
      card.targetX = dragPos.x
      card.targetY = dragPos.y
    } else {
      card.targetX = last.x
      card.targetY = last.y + 30
    }
    card.x += (card.targetX - card.x) * 0.1
    card.y += (card.targetY - card.y) * 0.1

    // Draw lanyard
    ctx.beginPath()
    ctx.moveTo(segments[0].x, segments[0].y)
    for (let i = 1; i < segments.length; i++) {
      ctx.lineTo(segments[i].x, segments[i].y)
    }
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 3
    ctx.stroke()

    // Draw card
    const cardW = 60
    const cardH = 80
    ctx.save()
    ctx.translate(card.x, card.y)
    ctx.fillStyle = '#1a1a2e'
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 2
    roundRect(ctx, -cardW / 2, -cardH / 2, cardW, cardH, 8)
    ctx.fill()
    ctx.stroke()

    // Card shine
    ctx.fillStyle = 'rgba(255,255,255,0.05)'
    roundRect(ctx, -cardW / 2 + 4, -cardH / 2 + 4, cardW - 8, cardH / 2 - 8, 4)
    ctx.fill()
    ctx.restore()

    rafId = requestAnimationFrame(animate)
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.quadraticCurveTo(x + w, y, x + w, y + r)
    ctx.lineTo(x + w, y + h - r)
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
    ctx.lineTo(x + r, y + h)
    ctx.quadraticCurveTo(x, y + h, x, y + h - r)
    ctx.lineTo(x, y + r)
    ctx.quadraticCurveTo(x, y, x + r, y)
    ctx.closePath()
  }

  rafId = requestAnimationFrame(animate)

  // Interaction
  canvas.addEventListener('pointermove', (e) => {
    const rect = canvas.getBoundingClientRect()
    dragPos = { x: e.clientX - rect.left, y: e.clientY - rect.top }
  })
  canvas.addEventListener('pointerleave', () => {
    dragPos = null
  })
})

let segments = []

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<style scoped>
.lanyard-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
