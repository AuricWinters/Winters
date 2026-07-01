<template>
  <div
    ref="containerRef"
    style="position:relative;width:100%;height:100%;background:transparent"
  >
    <h1
      ref="titleRef"
      :class="['text-pressure-title', { flex, stroke }]"
      :style="titleStyle"
    >
      <span
        v-for="(char, i) in chars"
        :key="i"
        :ref="el => { if (el) spans[i] = el }"
        :data-char="char"
        :style="{ display: 'inline-block', color: stroke ? undefined : textColor }"
      >{{ char }}</span>
    </h1>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  text: { type: String, default: 'Compressa' },
  fontFamily: { type: String, default: 'Compressa VF' },
  fontUrl: { type: String, default: 'https://res.cloudinary.com/dr6lvwubh/raw/upload/v1529908256/CompressaPRO-GX.woff2' },
  width: { type: Boolean, default: true },
  weight: { type: Boolean, default: true },
  italic: { type: Boolean, default: true },
  alpha: { type: Boolean, default: false },
  flex: { type: Boolean, default: true },
  stroke: { type: Boolean, default: false },
  scale: { type: Boolean, default: false },
  textColor: { type: String, default: '#FFFFFF' },
  strokeColor: { type: String, default: '#FF0000' },
  className: { type: String, default: '' },
  minFontSize: { type: Number, default: 24 },
})

const containerRef = ref(null)
const titleRef = ref(null)
const spans = reactive([])

const mouse = ref({ x: 0, y: 0 })
const smoothMouse = ref({ x: 0, y: 0 })
const fontSize = ref(props.minFontSize)
const scaleY = ref(1)
const lineHeight = ref(1)

const chars = computed(() => props.text.split(''))

// font-face & stroke styles moved to <style scoped>
const fontStyle = computed(() => '')

const titleStyle = computed(() => ({
  fontFamily: props.fontFamily,
  textTransform: 'uppercase' as any,
  fontSize: fontSize.value + 'px',
  lineHeight: lineHeight.value,
  transform: `scale(1, ${scaleY.value})`,
  transformOrigin: 'center top' as any,
  margin: 0,
  textAlign: 'center' as any,
  userSelect: 'none' as any,
  whiteSpace: 'nowrap' as any,
  fontWeight: 100,
  width: '100%',
}))

function dist(a, b) {
  const dx = b.x - a.x
  const dy = b.y - a.y
  return Math.sqrt(dx * dx + dy * dy)
}

function getAttr(distance, maxDist, minVal, maxVal) {
  const val = maxVal - Math.abs((maxVal * distance) / maxDist)
  return Math.max(minVal, val + minVal)
}

function debounce(fn, delay) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

function setSize() {
  if (!containerRef.value || !titleRef.value) return
  const { width: containerW, height: containerH } = containerRef.value.getBoundingClientRect()
  let newFontSize = containerW / (chars.value.length / 2)
  newFontSize = Math.max(newFontSize, props.minFontSize)
  fontSize.value = newFontSize
  scaleY.value = 1
  lineHeight.value = 1

  requestAnimationFrame(() => {
    if (!titleRef.value) return
    const textRect = titleRef.value.getBoundingClientRect()
    if (props.scale && textRect.height > 0) {
      const yRatio = containerH / textRect.height
      scaleY.value = yRatio
      lineHeight.value = yRatio
    }
  })
}

let rafId = null
let resizeHandler = null

onMounted(async () => {
  await nextTick()
  const container = containerRef.value
  if (!container) return

  const rect = container.getBoundingClientRect()
  mouse.value = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
  smoothMouse.value = { ...mouse.value }

  const onMouseMove = (e) => {
    mouse.value.x = e.clientX
    mouse.value.y = e.clientY
  }
  const onTouchMove = (e) => {
    const t = e.touches[0]
    mouse.value.x = t.clientX
    mouse.value.y = t.clientY
  }

  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('touchmove', onTouchMove, { passive: true })

  const debouncedSetSize = debounce(setSize, 100)
  debouncedSetSize()
  resizeHandler = debouncedSetSize
  window.addEventListener('resize', debouncedSetSize)

  function animate() {
    smoothMouse.value.x += (mouse.value.x - smoothMouse.value.x) / 15
    smoothMouse.value.y += (mouse.value.y - smoothMouse.value.y) / 15

    if (titleRef.value) {
      const titleRect = titleRef.value.getBoundingClientRect()
      const maxDist = titleRect.width / 2

      spans.forEach((span, i) => {
        if (!span) return
        const rect = span.getBoundingClientRect()
        const charCenter = { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 }
        const d = dist(smoothMouse.value, charCenter)

        const wdth = props.width ? Math.floor(getAttr(d, maxDist, 5, 200)) : 100
        const wght = props.weight ? Math.floor(getAttr(d, maxDist, 100, 900)) : 400
        const italVal = props.italic ? getAttr(d, maxDist, 0, 1).toFixed(2) : '0'
        const alphaVal = props.alpha ? getAttr(d, maxDist, 0, 1).toFixed(2) : '1'
        const fvs = `'wght' ${wght}, 'wdth' ${wdth}, 'ital' ${italVal}`

        if (span.style.fontVariationSettings !== fvs) span.style.fontVariationSettings = fvs
        if (props.alpha && span.style.opacity !== alphaVal) span.style.opacity = alphaVal
      })
    }

    rafId = requestAnimationFrame(animate)
  }
  rafId = requestAnimationFrame(animate)
})

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId)
  if (resizeHandler) window.removeEventListener('resize', resizeHandler)
})
</script>
