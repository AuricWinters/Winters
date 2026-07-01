<template>
  <div
    ref="containerRef"
    class="content"
  >
    <div
      v-for="(url, i) in items"
      :key="i"
      class="content__img"
    >
      <div
        class="content__img-inner"
        :style="{ backgroundImage: `url(${url})` }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  items: { type: Array, default: () => [] },
  variant: { type: Number, default: 1 },
})

const containerRef = ref<HTMLDivElement | null>(null)
let rafId = null
let images = []
let imgPosition = 0
let zIndexVal = 1
let activeCount = 0
let isIdle = true
const threshold = 80
let mousePos = { x: 0, y: 0 }
let lastMousePos = { x: 0, y: 0 }
let cacheMousePos = { x: 0, y: 0 }

function lerp(a, b, n) {
  return (1 - n) * a + n * b
}

function getMouseDistance(p1, p2) {
  const dx = p1.x - p2.x
  const dy = p1.y - p2.y
  return Math.hypot(dx, dy)
}

function render() {
  const distance = getMouseDistance(mousePos, lastMousePos)
  cacheMousePos.x = lerp(cacheMousePos.x, mousePos.x, 0.1)
  cacheMousePos.y = lerp(cacheMousePos.y, mousePos.y, 0.1)

  if (distance > threshold) {
    showNextImage()
    lastMousePos = { ...mousePos }
  }
  if (isIdle && zIndexVal !== 1) zIndexVal = 1
  rafId = requestAnimationFrame(render)
}

function showNextImage() {
  ++zIndexVal
  imgPosition = imgPosition < images.length - 1 ? imgPosition + 1 : 0
  const img = images[imgPosition]
  if (!img) return

  activeCount++
  isIdle = false

  const el = img.el
  const rect = img.rect
  if (!rect) return
  const startX = cacheMousePos.x - rect.width / 2
  const startY = cacheMousePos.y - rect.height / 2
  const endX = mousePos.x - rect.width / 2
  const endY = mousePos.y - rect.height / 2

  el.style.zIndex = zIndexVal
  el.style.opacity = '1'
  el.style.transform = `translate3d(${startX}px, ${startY}px, 0) scale(1)`

  requestAnimationFrame(() => {
    el.style.transition = 'transform 0.4s ease, opacity 0.4s ease'
    el.style.transform = `translate3d(${endX}px, ${endY}px, 0) scale(1)`
    setTimeout(() => {
      el.style.opacity = '0'
      el.style.transform = `translate3d(${endX}px, ${endY}px, 0) scale(0.2)`
      setTimeout(() => {
        activeCount--
        if (activeCount === 0) isIdle = true
      }, 400)
    }, 400)
  })
}

function getLocalPointerPos(e, rect) {
  let clientX = 0, clientY = 0
  if ('touches' in e && e.touches.length > 0) {
    clientX = e.touches[0].clientX
    clientY = e.touches[0].clientY
  } else if ('clientX' in e) {
    clientX = e.clientX
    clientY = e.clientY
  }
  return { x: clientX - rect.left, y: clientY - rect.top }
}

onMounted(async () => {
  await nextTick()
  const container = containerRef.value
  if (!container) return

  const imgEls = container.querySelectorAll('.content__img')
  images = Array.from(imgEls).map(el => ({
    el,
    inner: el.querySelector('.content__img-inner'),
    rect: el.getBoundingClientRect()
  }))

  const handlePointerMove = (ev) => {
    const rect = container.getBoundingClientRect()
    mousePos = getLocalPointerPos(ev, rect)
  }
  container.addEventListener('mousemove', handlePointerMove)
  container.addEventListener('touchmove', handlePointerMove)

  const initRender = (ev) => {
    const rect = container.getBoundingClientRect()
    mousePos = getLocalPointerPos(ev, rect)
    cacheMousePos = { ...mousePos }
    rafId = requestAnimationFrame(render)
    container.removeEventListener('mousemove', initRender)
    container.removeEventListener('touchmove', initRender)
  }
  container.addEventListener('mousemove', initRender)
  container.addEventListener('touchmove', initRender)
})

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<style scoped>
.content {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.content__img {
  position: absolute;
  width: 150px;
  height: 150px;
  pointer-events: none;
  opacity: 0;
  will-change: transform, opacity;
}
.content__img-inner {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  border-radius: 8px;
}
</style>
