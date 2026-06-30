<template>
  <div style="position:relative;width:100%;height:100%">
    <canvas
      id="infinite-grid-menu-canvas"
      ref="canvasRef"
    />
    <div
      v-if="activeItem"
      class="infinite-menu-ui"
    >
      <h2 :class="['face-title', { inactive: isMoving, active: !isMoving }]">
        {{ activeItem.title }}
      </h2>
      <p :class="['face-description', { inactive: isMoving, active: !isMoving }]">
        {{ activeItem.description }}
      </p>
      <div
        :class="['action-button', { inactive: isMoving, active: !isMoving }]"
        @click="handleButtonClick"
      >
        <p class="action-button-icon">
          &#x2197;
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  items: { type: Array, default: () => [] },
  scale: { type: Number, default: 1.0 },
})

const canvasRef = ref(null)
const activeItem = ref(null)
const isMoving = ref(false)

let rafId = null
let discs = []
let targetRotation = { x: 0, y: 0 }
let currentRotation = { x: 0, y: 0 }
let dragStart = null
let isDragging = false

onMounted(async () => {
  await nextTick()
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  const menuItems = props.items.length ? props.items : [{ image: 'https://picsum.photos/900/900?grayscale', link: '#', title: '', description: '' }]

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

  // Load images
  const loadedImages = []
  menuItems.forEach((item, i) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = item.image
    loadedImages.push({ img, item, angle: (i / menuItems.length) * Math.PI * 2 })
  })

  const sphereRadius = Math.min(canvas.width, canvas.height) * 0.35 * props.scale

  function animate(t) {
    const w = canvas.width
    const h = canvas.height
    const cx = w / 2
    const cy = h / 2

    ctx.clearRect(0, 0, w, h)

    // Smooth rotation
    if (isDragging) {
      // controlled by drag
    } else {
      currentRotation.x += (targetRotation.x - currentRotation.x) * 0.05
      currentRotation.y += (targetRotation.y - currentRotation.y) * 0.05
    }

    // Sort discs by z for depth
    const sorted = loadedImages.map((item, i) => {
      const theta = item.angle + currentRotation.y
      const phi = Math.PI / 2 + currentRotation.x
      const x3d = sphereRadius * Math.sin(theta) * Math.cos(phi)
      const y3d = sphereRadius * Math.cos(theta)
      const z3d = sphereRadius * Math.sin(theta) * Math.sin(phi)
      return { ...item, sx: cx + x3d, sy: cy + y3d * 0.6, z: z3d, idx: i }
    }).sort((a, b) => a.z - b.z)

    sorted.forEach((item) => {
      const scale = 0.5 + (item.z + sphereRadius) / (sphereRadius * 2)
      const size = 60 * scale * props.scale

      ctx.save()
      ctx.globalAlpha = Math.max(0.1, scale)
      ctx.translate(item.sx, item.sy)
      ctx.scale(size / 60, size / 60)

      // Draw disc
      ctx.beginPath()
      ctx.arc(0, 0, 30, 0, Math.PI * 2)
      ctx.clip()

      if (item.img.complete) {
        ctx.drawImage(item.img, -30, -30, 60, 60)
      }
      ctx.restore()
    })

    rafId = requestAnimationFrame(animate)
  }
  rafId = requestAnimationFrame(animate)

  // Pointer events
  canvas.addEventListener('pointerdown', (e) => {
    isDragging = true
    dragStart = { x: e.clientX, y: e.clientY }
  })

  window.addEventListener('pointermove', (e) => {
    if (!isDragging || !dragStart) return
    const dx = e.clientX - dragStart.x
    const dy = e.clientY - dragStart.y
    targetRotation.y += dx * 0.01
    targetRotation.x += dy * 0.005
    targetRotation.x = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, targetRotation.x))
    dragStart = { x: e.clientX, y: e.clientY }

    isMoving.value = true

    // Find nearest item
    const nearest = loadedImages.reduce((best, item, i) => {
      const dist = Math.abs(item.angle + targetRotation.y)
      return dist < best.dist ? { dist, idx: i } : best
    }, { dist: Infinity, idx: 0 })
    activeItem.value = menuItems[nearest.idx]
  })

  window.addEventListener('pointerup', () => {
    isDragging = false
    setTimeout(() => { isMoving.value = false }, 500)
  })

  // Wheel
  canvas.addEventListener('wheel', (e) => {
    e.preventDefault()
    targetRotation.y += e.deltaX * 0.01
  }, { passive: false })
})

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId)
})

function handleButtonClick() {
  if (!activeItem.value?.link) return
  if (activeItem.value.link.startsWith('http')) {
    window.open(activeItem.value.link, '_blank')
  }
}
</script>

<style scoped>
canvas {
  display: block;
  touch-action: none;
}
.infinite-menu-ui {
  position: absolute;
  bottom: 30px;
  left: 30px;
  pointer-events: none;
}
.face-title, .face-description, .action-button {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.inactive {
  opacity: 0;
  transform: translateY(10px);
  pointer-events: none;
}
.active {
  opacity: 1;
  transform: translateY(0);
}
.action-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #5227FF;
  color: white;
  cursor: pointer;
  pointer-events: auto;
  border: none;
}
.action-button-icon {
  margin: 0;
  font-size: 20px;
}
</style>
