<template>
  <div
    ref="wrapRef"
    class="dotfield-wrap"
  >
    <canvas
      ref="canvasRef"
      class="dotfield-canvas"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

defineProps({
  dotColor: { type: String, default: '' },
  spacing: { type: Number, default: 22 },
  maxDist: { type: Number, default: 80 },
})

const wrapRef = ref(null)
const canvasRef = ref(null)
let ctx, dots, w, h, mx = -1000, my = -1000, animId

function initDots() {
  dots = []
  const spacing = 22
  for (let x = spacing; x < w; x += spacing) {
    for (let y = spacing; y < h; y += spacing) {
      dots.push({ ox: x, oy: y, x, y, r: 1.5 + Math.random() * 2 })
    }
  }
}

function resize() {
  const canvas = canvasRef.value
  if (!canvas) return
  const parent = wrapRef.value
  const width = parent.clientWidth
  canvas.width = width
  canvas.height = width * (9 / 16)
  w = canvas.width; h = canvas.height
  initDots()
}

function onMove(e) {
  const rect = canvasRef.value.getBoundingClientRect()
  mx = e.clientX - rect.left
  my = e.clientY - rect.top
}

function onLeave() { mx = -1000; my = -1000 }

function draw() {
  ctx.clearRect(0, 0, w, h)
  dots.forEach(d => {
    const dx = mx - d.ox; const dy = my - d.oy
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist < 80) {
      const force = (1 - dist / 80) * 18
      d.x = d.ox - (dx / dist) * force
      d.y = d.oy - (dy / dist) * force
    } else {
      d.x += (d.ox - d.x) * 0.08
      d.y += (d.oy - d.y) * 0.08
    }
    ctx.beginPath()
    ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(167,139,250,0.4)'
    ctx.fill()
  })
  animId = requestAnimationFrame(draw)
}

onMounted(() => {
  ctx = canvasRef.value.getContext('2d')
  resize()
  draw()
  window.addEventListener('resize', resize)
  canvasRef.value.addEventListener('mousemove', onMove)
  canvasRef.value.addEventListener('mouseleave', onLeave)
})

onUnmounted(() => {
  if (animId) cancelAnimationFrame(animId)
  window.removeEventListener('resize', resize)
})
</script>

<style scoped>
.dotfield-wrap {
  width: 100%;
  border-radius: inherit;
  overflow: hidden;
}
.dotfield-canvas {
  display: block;
  width: 100%;
  background: var(--bg-card);
  border-radius: inherit;
  cursor: crosshair;
}
</style>
