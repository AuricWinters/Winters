<template>
  <span :ref="forwardRef" :class="[className, 'variable-proximity']" :style="{ display: 'inline', ...style }">
    <template v-for="(word, wordIdx) in words" :key="wordIdx">
      <span style="display:inline-block;white-space:nowrap">
        <span
          v-for="(letter, letterIdx) in word.split('')"
          :key="`${wordIdx}-${letterIdx}`"
          :ref="el => { if (el) letterRefs[globalLetterIndex++] = el }"
          style="display:inline-block"
          aria-hidden="true"
        >{{ letter }}</span>
      </span>
      <span v-if="wordIdx < words.length - 1" style="display:inline-block">&nbsp;</span>
    </template>
    <span class="sr-only" style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0">{{ label }}</span>
  </span>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'

const props = defineProps({
  label: { type: String, default: '' },
  fromFontVariationSettings: { type: String, default: '' },
  toFontVariationSettings: { type: String, default: '' },
  containerRef: { type: Object, default: null },
  radius: { type: Number, default: 50 },
  falloff: { type: String, default: 'linear' },
  className: { type: String, default: '' },
  style: { type: Object, default: () => ({}) },
})

const forwardRef = ref(null)
const letterRefs = reactive([])
let globalLetterIndex = 0

const mousePos = ref({ x: 0, y: 0 })
const lastPos = ref({ x: 0, y: 0 })

const words = computed(() => props.label.split(' '))

const parsedSettings = computed(() => {
  function parse(settingsStr) {
    return new Map(
      settingsStr.split(',').map(s => s.trim()).map(s => {
        const [name, value] = s.split(' ')
        return [name.replace(/['"]/g, ''), parseFloat(value)]
      })
    )
  }
  const from = parse(props.fromFontVariationSettings)
  const to = parse(props.toFontVariationSettings)
  return Array.from(from.entries()).map(([axis, fromValue]) => ({
    axis,
    fromValue,
    toValue: to.get(axis) ?? fromValue
  }))
})

function calculateDistance(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
}

function calculateFalloff(distance) {
  const norm = Math.max(0, Math.min(1, 1 - distance / props.radius))
  switch (props.falloff) {
    case 'exponential': return norm ** 2
    case 'gaussian': return Math.exp(-((distance / (props.radius / 2)) ** 2) / 2)
    default: return norm
  }
}

let rafId = null

onMounted(async () => {
  await nextTick()

  const container = props.containerRef?.$el || props.containerRef
  const updatePosition = (x, y) => {
    if (container) {
      const rect = container.getBoundingClientRect()
      mousePos.value = { x: x - rect.left, y: y - rect.top }
    } else {
      mousePos.value = { x, y }
    }
  }

  const onMouseMove = (e) => updatePosition(e.clientX, e.clientY)
  const onTouchMove = (e) => {
    const touch = e.touches[0]
    updatePosition(touch.clientX, touch.clientY)
  }

  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('touchmove', onTouchMove)

  function animate() {
    const { x, y } = mousePos.value
    if (lastPos.value.x === x && lastPos.value.y === y) {
      rafId = requestAnimationFrame(animate)
      return
    }
    lastPos.value = { x, y }

    let containerRect = null
    if (container) {
      containerRect = container.getBoundingClientRect()
    }

    letterRefs.forEach((letterRef) => {
      if (!letterRef) return
      const rect = letterRef.getBoundingClientRect()
      const letterCenterX = rect.left + rect.width / 2 - (containerRect ? containerRect.left : 0)
      const letterCenterY = rect.top + rect.height / 2 - (containerRect ? containerRect.top : 0)

      const distance = calculateDistance(x, y, letterCenterX, letterCenterY)

      if (distance >= props.radius) {
        letterRef.style.fontVariationSettings = props.fromFontVariationSettings
        return
      }

      const falloffValue = calculateFalloff(distance)
      const newSettings = parsedSettings.value
        .map(({ axis, fromValue, toValue }) => {
          const interpolatedValue = fromValue + (toValue - fromValue) * falloffValue
          return `'${axis}' ${interpolatedValue}`
        })
        .join(', ')

      letterRef.style.fontVariationSettings = newSettings
    })

    rafId = requestAnimationFrame(animate)
  }
  rafId = requestAnimationFrame(animate)
})

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<style scoped>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0,0,0,0);
  border: 0;
}
</style>
