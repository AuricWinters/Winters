<template>
  <div ref="containerRef" class="circular-gallery" tabindex="0" role="region" aria-label="Circular image gallery">
    <canvas ref="canvasRef" style="width:100%;height:100%;display:block"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  items: { type: Array, default: null },
  bend: { type: Number, default: 1 },
  textColor: { type: String, default: '#ffffff' },
  borderRadius: { type: Number, default: 0.05 },
  font: { type: String, default: 'bold 30px sans-serif' },
  scrollSpeed: { type: Number, default: 2 },
  scrollEase: { type: Number, default: 0.05 },
})

const containerRef = ref(null)
const canvasRef = ref(null)
let rafId = null
let images = []
let scrollTarget = 0
let scrollCurrent = 0
let scrollLast = 0
let isDown = false
let startX = 0
let scrollPos = 0

onMounted(async () => {
  await nextTick()
  const canvas = canvasRef.value
  const container = containerRef.value
  if (!canvas || !container) return
  const ctx = canvas.getContext('2d')

  const defaultItems = [
    { image: 'https://picsum.photos/seed/1/800/600?grayscale', text: 'Bridge' },
    { image: 'https://picsum.photos/seed/2/800/600?grayscale', text: 'Desk Setup' },
    { image: 'https://picsum.photos/seed/3/800/600?grayscale', text: 'Waterfall' },
    { image: 'https://picsum.photos/seed/4/800/600?grayscale', text: 'Strawberries' },
    { image: 'https://picsum.photos/seed/5/800/600?grayscale', text: 'Deep Diving' },
    { image: 'https://picsum.photos/seed/16/800/600?grayscale', text: 'Train Track' },
    { image: 'https://picsum.photos/seed/17/800/600?grayscale', text: 'Santorini' },
    { image: 'https://picsum.photos/seed/8/800/600?grayscale', text: 'Blurry Lights' },
  ]
  const galleryItems = (props.items && props.items.length) ? props.items : defaultItems
  const allItems = [...galleryItems, ...galleryItems]
  const loadedImages = []

  function resize() {
    const rect = container.getBoundingClientRect()
    const dpr = Math.min(devicePixelRatio, 2)
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    canvas.style.width = rect.width + 'px'
    canvas.style.height = rect.height + 'px'
  }
  resize()
  window.addEventListener('resize', resize)

  // Load images
  let loaded = 0
  allItems.forEach((item, i) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      loaded++
      if (loaded === allItems.length) startRender()
    }
    img.onerror = () => {
      loaded++
      if (loaded === allItems.length) startRender()
    }
    img.src = item.image
    loadedImages.push({ img, text: item.text, x: 0, speed: 0 })
  })

  function startRender() {
    const w = canvas.width
    const h = canvas.height
    const itemCount = allItems.length
    let itemWidth = w * 0.3
    let itemHeight = h * 0.4
    const totalWidth = itemWidth * itemCount

    loadedImages.forEach((item, i) => {
      item.x = i * itemWidth - totalWidth / 2
    })

    function render() {
      const width = container.clientWidth
      const height = container.clientHeight

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      scrollCurrent += (scrollTarget - scrollCurrent) * props.scrollEase
      const direction = scrollCurrent > scrollLast ? 'right' : 'left'
      scrollLast = scrollCurrent

      loadedImages.forEach((item, i) => {
        const displayX = item.x - scrollCurrent
        const halfW = width / 2

        // Bend effect
        const bendFactor = props.bend * 20
        const normX = displayX / halfW
        const bendY = bendFactor * (1 - Math.cos(normX * Math.PI / 2))
        const rotZ = -normX * props.bend * 5

        // Draw image
        const cx = displayX + width / 2
        const cy = height / 2 + (normX > -1 && normX < 1 ? bendY * Math.sign(normX) : 0)

        // Visibility culling
        if (cx < -itemWidth || cx > width + itemWidth) {
          // Wrap around
          if (direction === 'right' && cx < -itemWidth) item.x += totalWidth
          if (direction === 'left' && cx > width + itemWidth) item.x -= totalWidth
          return
        }

        ctx.save()
        ctx.translate(cx, cy)
        ctx.rotate(rotZ * Math.PI / 180)

        const aspect = item.img.naturalWidth / item.img.naturalHeight || 1
        const imgW = itemHeight * aspect
        const imgH = itemHeight
        const drawW = Math.min(imgW, itemWidth)
        const drawH = drawW / aspect

        ctx.beginPath()
        const rad = props.borderRadius * drawW
        roundRect(ctx, -drawW / 2, -drawH / 2, drawW, drawH, Math.max(0.1, rad))
        ctx.clip()

        ctx.drawImage(item.img, -drawW / 2, -drawH / 2, drawW, drawH)
        ctx.restore()

        // Text
        ctx.save()
        ctx.translate(cx, cy + drawH / 2 + 20)
        ctx.fillStyle = props.textColor
        ctx.font = props.font
        ctx.textAlign = 'center'
        ctx.fillText(item.text, 0, 0)
        ctx.restore()
      })

      rafId = requestAnimationFrame(render)
    }

    function roundRect(ctx, x, y, w, h, r) {
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

    rafId = requestAnimationFrame(render)
  }

  // Mouse/wheel events
  const onWheel = (e) => {
    e.preventDefault()
    scrollTarget += (e.deltaY > 0 ? props.scrollSpeed : -props.scrollSpeed) * 2
  }
  const onMouseDown = (e) => {
    isDown = true
    scrollPos = scrollCurrent
    startX = e.clientX
  }
  const onMouseMove = (e) => {
    if (!isDown) return
    const dist = startX - e.clientX
    scrollTarget = scrollPos + dist * 0.5
  }
  const onMouseUp = () => { isDown = false }
  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') scrollTarget += props.scrollSpeed * 20
    if (e.key === 'ArrowLeft') scrollTarget -= props.scrollSpeed * 20
  }

  container.addEventListener('wheel', onWheel, { passive: false })
  container.addEventListener('mousedown', onMouseDown)
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
  container.addEventListener('keydown', onKeyDown)
})

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<style scoped>
.circular-gallery {
  position: relative;
  overflow: hidden;
  cursor: grab;
  outline: none;
}
.circular-gallery:active {
  cursor: grabbing;
}
</style>
