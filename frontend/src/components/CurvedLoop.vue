<template>
  <div
    class="curved-loop-jacket"
    :style="{ visibility: ready ? 'visible' : 'hidden', cursor: cursorStyle }"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="endDrag"
    @pointerleave="endDrag"
  >
    <svg
      class="curved-loop-svg"
      viewBox="0 0 1440 120"
    >
      <text
        ref="measureRef"
        xml:space="preserve"
        style="visibility:hidden;opacity:0;pointer-events:none"
      >{{ displayText }}</text>
      <defs>
        <path
          :id="pathId"
          :d="pathD"
          fill="none"
          stroke="transparent"
        />
      </defs>
      <text
        v-if="ready"
        font-weight="bold"
        xml:space="preserve"
        :class="className"
      >
        <textPath
          ref="textPathRef"
          :href="'#' + pathId"
          :startOffset="offset + 'px'"
          xml:space="preserve"
        >{{ totalText }}</textPath>
      </text>
    </svg>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  marqueeText: { type: String, default: '' },
  speed: { type: Number, default: 2 },
  className: { type: String, default: '' },
  curveAmount: { type: Number, default: 400 },
  direction: { type: String, default: 'left' },
  interactive: { type: Boolean, default: true },
})

const uid = computed(() => Math.random().toString(36).slice(2, 8))
const pathId = computed(() => `curve-${uid.value}`)
const pathD = computed(() => `M-100,40 Q500,${40 + props.curveAmount} 1540,40`)

const displayText = computed(() => {
  const t = props.marqueeText
  const hasTrailing = /\s| $/.test(t)
  return (hasTrailing ? t.replace(/\s+$/, '') : t) + ' '
})

const measureRef = ref(null)
const textPathRef = ref(null)
const spacing = ref(0)
const offset = ref(0)
const ready = ref(false)

const dragRef = ref(false)
const lastXRef = ref(0)
const dirRef = ref(props.direction)
const velRef = ref(0)

const totalText = computed(() => {
  if (!spacing.value) return displayText.value
  const repeatCount = Math.ceil(1800 / spacing.value) + 2
  return Array(repeatCount).fill(displayText.value).join('')
})

const cursorStyle = computed(() => {
  if (!props.interactive) return 'auto'
  return dragRef.value ? 'grabbing' : 'grab'
})

let rafId = null

onMounted(async () => {
  await nextTick()
  if (measureRef.value) {
    spacing.value = measureRef.value.getComputedTextLength()
  }
  if (spacing.value && textPathRef.value) {
    const initial = -spacing.value
    textPathRef.value.setAttribute('startOffset', initial + 'px')
    offset.value = initial
    ready.value = true
  }

  function step() {
    if (!dragRef.value && textPathRef.value && spacing.value) {
      const delta = dirRef.value === 'right' ? props.speed : -props.speed
      const currentOffset = parseFloat(textPathRef.value.getAttribute('startOffset') || '0')
      let newOffset = currentOffset + delta
      const wrapPoint = spacing.value
      if (newOffset <= -wrapPoint) newOffset += wrapPoint
      if (newOffset > 0) newOffset -= wrapPoint
      textPathRef.value.setAttribute('startOffset', newOffset + 'px')
      offset.value = newOffset
    }
    rafId = requestAnimationFrame(step)
  }
  rafId = requestAnimationFrame(step)
})

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId)
})

function onPointerDown(e) {
  if (!props.interactive) return
  dragRef.value = true
  lastXRef.value = e.clientX
  velRef.value = 0
  e.target.setPointerCapture(e.pointerId)
}

function onPointerMove(e) {
  if (!props.interactive || !dragRef.value || !textPathRef.value) return
  const dx = e.clientX - lastXRef.value
  lastXRef.value = e.clientX
  velRef.value = dx
  const currentOffset = parseFloat(textPathRef.value.getAttribute('startOffset') || '0')
  let newOffset = currentOffset + dx
  const wrapPoint = spacing.value
  if (newOffset <= -wrapPoint) newOffset += wrapPoint
  if (newOffset > 0) newOffset -= wrapPoint
  textPathRef.value.setAttribute('startOffset', newOffset + 'px')
  offset.value = newOffset
}

function endDrag() {
  if (!props.interactive) return
  dragRef.value = false
  dirRef.value = velRef.value > 0 ? 'right' : 'left'
}
</script>

<style scoped>
.curved-loop-jacket {
  width: 100%;
  overflow: hidden;
  user-select: none;
}
.curved-loop-svg {
  width: 100%;
  height: 120px;
  display: block;
}
</style>
