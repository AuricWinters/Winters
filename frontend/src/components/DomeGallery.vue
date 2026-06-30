<template>
  <div
    ref="rootRef"
    class="sphere-root"
    :style="rootVars"
  >
    <main
      ref="mainRef"
      class="sphere-main"
    >
      <div class="stage">
        <div
          ref="sphereRef"
          class="sphere"
        >
          <div
            v-for="(it, i) in items"
            :key="i"
            class="item"
            :data-src="it.src"
            :data-offset-x="it.x"
            :data-offset-y="it.y"
            :data-size-x="it.sizeX"
            :data-size-y="it.sizeY"
            :style="getItemStyle(it)"
          >
            <div
              class="item__image"
              role="button"
              tabindex="0"
              :aria-label="it.alt"
              @click="onTileClick"
              @pointerup="onTilePointerUp"
            >
              <img
                :src="it.src"
                draggable="false"
                :alt="it.alt"
              >
            </div>
          </div>
        </div>
      </div>
      <div class="overlay" />
      <div class="overlay overlay--blur" />
      <div class="edge-fade edge-fade--top" />
      <div class="edge-fade edge-fade--bottom" />
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, reactive } from 'vue'

const props = defineProps({
  images: { type: Array, default: () => [] },
  fit: { type: Number, default: 0.5 },
  minRadius: { type: Number, default: 600 },
  segments: { type: Number, default: 35 },
  maxVerticalRotationDeg: { type: Number, default: 5 },
  dragSensitivity: { type: Number, default: 20 },
  imageBorderRadius: { type: String, default: '30px' },
  grayscale: { type: Boolean, default: true },
})

const rootRef = ref(null)
const mainRef = ref(null)
const sphereRef = ref(null)

const rotation = reactive({ x: 0, y: 0 })
let isDragging = false
let startX = 0, startY = 0
let startRotX = 0, startRotY = 0
let rafId = null
let inertiaVX = 0, inertiaVY = 0

const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1755331039789-7e5680e26e8f?q=80&w=774&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1755569309049-98410b94f66d?q=80&w=772&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1755497595318-7e5e3523854f?q=80&w=774&auto=format&fit=crop',
]

const images = computed(() => {
  const pool = props.images.length ? props.images : DEFAULT_IMAGES
  return pool.map(img => typeof img === 'string' ? { src: img, alt: '' } : img)
})

const items = computed(() => {
  const seg = props.segments
  const xCols = Array.from({ length: seg }, (_, i) => -37 + i * 2)
  const evenYs = [-4, -2, 0, 2, 4]
  const oddYs = [-3, -1, 1, 3, 5]
  const coords = xCols.flatMap((x, c) => {
    const ys = c % 2 === 0 ? evenYs : oddYs
    return ys.map(y => ({ x, y, sizeX: 2, sizeY: 2 }))
  })
  const pool = images.value
  return coords.map((c, i) => ({
    ...c,
    src: pool[i % pool.length].src,
    alt: pool[i % pool.length].alt || '',
  }))
})

const rootVars = computed(() => ({
  '--tile-radius': props.imageBorderRadius,
  '--image-filter': props.grayscale ? 'grayscale(1)' : 'none',
}))

function getItemStyle(it) {
  return {
    '--offset-x': it.x,
    '--offset-y': it.y,
    '--item-size-x': it.sizeX,
    '--item-size-y': it.sizeY,
  }
}

function applyTransform(xDeg, yDeg) {
  const el = sphereRef.value
  if (el) {
    el.style.transform = `translateZ(calc(var(--radius) * -1)) rotateX(${xDeg}deg) rotateY(${yDeg}deg)`
  }
}

function normalizeAngle(d) {
  return ((d % 360) + 360) % 360
}

function clamp(v, min, max) {
  return Math.min(Math.max(v, min), max)
}

onMounted(async () => {
  await nextTick()
  const root = rootRef.value
  const main = mainRef.value
  if (!root || !main) return

  applyTransform(0, 0)

  // Drag handlers
  main.addEventListener('pointerdown', (e) => {
    isDragging = true
    startX = e.clientX
    startY = e.clientY
    startRotX = rotation.x
    startRotY = rotation.y
    inertiaVX = 0
    inertiaVY = 0
  })

  window.addEventListener('pointermove', (e) => {
    if (!isDragging) return
    const dx = e.clientX - startX
    const dy = e.clientY - startY
    rotation.x = clamp(startRotX - dy / props.dragSensitivity, -props.maxVerticalRotationDeg, props.maxVerticalRotationDeg)
    rotation.y = startRotY + dx / props.dragSensitivity
    applyTransform(rotation.x, rotation.y)
  })

  window.addEventListener('pointerup', () => {
    if (!isDragging) return
    isDragging = false
  })

  // Wheel support
  main.addEventListener('wheel', (e) => {
    e.preventDefault()
    rotation.y += e.deltaX * 0.1
    applyTransform(rotation.x, rotation.y)
  }, { passive: false })

  // ResizeObserver for radius
  const ro = new ResizeObserver(entries => {
    const cr = entries[0].contentRect
    const minDim = Math.min(cr.width, cr.height)
    let radius = minDim * props.fit
    radius = Math.max(radius, props.minRadius)
    root.style.setProperty('--radius', `${Math.round(radius)}px`)
  })
  ro.observe(root)
})

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<style scoped>
.sphere-root {
  --radius: 600px;
  --tile-radius: 30px;
  --image-filter: grayscale(1);
  position: relative;
  width: 100%;
  height: 100%;
}
.sphere-main {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  touch-action: none;
}
.stage {
  position: absolute;
  inset: 0;
  perspective: 800px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.sphere {
  position: relative;
  width: 0;
  height: 0;
  transform-style: preserve-3d;
  transition: transform 0.1s ease;
}
.item {
  position: absolute;
  width: 80px;
  height: 80px;
  transform-style: preserve-3d;
  backface-visibility: hidden;
}
.item__image {
  width: 100%;
  height: 100%;
  cursor: pointer;
  border-radius: var(--tile-radius);
  overflow: hidden;
}
.item__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: var(--image-filter);
  pointer-events: none;
}
.overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.overlay--blur {
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}
.edge-fade {
  position: absolute;
  left: 0;
  right: 0;
  height: 60px;
  pointer-events: none;
}
.edge-fade--top {
  top: 0;
  background: linear-gradient(to bottom, rgb(18 15 23), transparent);
}
.edge-fade--bottom {
  bottom: 0;
  background: linear-gradient(to top, rgb(18 15 23), transparent);
}
</style>
