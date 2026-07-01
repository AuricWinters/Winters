<template>
  <div
    ref="containerRef"
    :class="['orbit-container', className]"
    :style="containerStyle"
    aria-hidden="true"
  >
    <div
      :class="['orbit-scaling-container', { 'orbit-scaling-container--responsive': responsive }]"
      :style="scalingStyle"
    >
      <div
        class="orbit-rotation-wrapper"
        :style="{ transform: `rotate(${rotation}deg)` }"
      >
        <svg
          v-if="showPath"
          width="100%"
          height="100%"
          :viewBox="`0 0 ${baseWidth} ${baseWidth}`"
          class="orbit-path-svg"
        >
          <path
            :d="path"
            fill="none"
            :stroke="pathColor"
            :stroke-width="pathWidth"
          />
        </svg>
        <div
          v-for="(item, index) in images"
          :key="index"
          class="orbit-item"
          :style="getItemStyle(index) as any"
        >
          <img
            :src="item as string"
            :alt="`${altPrefix} ${index + 1}`"
            draggable="false"
            class="orbit-image"
          >
        </div>
      </div>
    </div>
    <div
      v-if="$slots.center"
      class="orbit-center-content"
    >
      <slot name="center" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  images: { type: Array, default: () => [] },
  altPrefix: { type: String, default: 'Orbiting image' },
  shape: { type: String, default: 'ellipse' },
  customPath: { type: String, default: '' },
  baseWidth: { type: Number, default: 1400 },
  radiusX: { type: Number, default: 700 },
  radiusY: { type: Number, default: 170 },
  radius: { type: Number, default: 300 },
  starPoints: { type: Number, default: 5 },
  starInnerRatio: { type: Number, default: 0.5 },
  rotation: { type: Number, default: -8 },
  duration: { type: Number, default: 40 },
  itemSize: { type: Number, default: 64 },
  direction: { type: String, default: 'normal' },
  fill: { type: Boolean, default: true },
  width: { type: [Number, String], default: 100 },
  height: { type: [Number, String], default: 100 },
  className: { type: String, default: '' },
  showPath: { type: Boolean, default: false },
  pathColor: { type: String, default: 'rgba(0,0,0,0.1)' },
  pathWidth: { type: Number, default: 2 },
  paused: { type: Boolean, default: false },
  responsive: { type: Boolean, default: false },
})

const containerRef = ref(null)
const progress = ref(0)
const scale = ref(1)

const designCenterX = computed(() => props.baseWidth / 2)
const designCenterY = computed(() => props.baseWidth / 2)

function generateEllipsePath(cx, cy, rx, ry) {
  return `M ${cx - rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx - rx} ${cy}`
}
function generateCirclePath(cx, cy, r) {
  return generateEllipsePath(cx, cy, r, r)
}
function generateSquarePath(cx, cy, size) {
  const h = size / 2
  return `M ${cx - h} ${cy - h} L ${cx + h} ${cy - h} L ${cx + h} ${cy + h} L ${cx - h} ${cy + h} Z`
}
function generateStarPath(cx, cy, outerR, innerR, points) {
  const step = Math.PI / points
  let path = ''
  for (let i = 0; i < 2 * points; i++) {
    const r = i % 2 === 0 ? outerR : innerR
    const angle = i * step - Math.PI / 2
    const x = cx + r * Math.cos(angle)
    const y = cy + r * Math.sin(angle)
    path += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`
  }
  return path + ' Z'
}
function generateHeartPath(cx, cy, size) {
  const s = size / 30
  return `M ${cx} ${cy + 12 * s} C ${cx - 20 * s} ${cy - 5 * s}, ${cx - 12 * s} ${cy - 18 * s}, ${cx} ${cy - 8 * s} C ${cx + 12 * s} ${cy - 18 * s}, ${cx + 20 * s} ${cy - 5 * s}, ${cx} ${cy + 12 * s}`
}

const path = computed(() => {
  const cx = designCenterX.value
  const cy = designCenterY.value
  switch (props.shape) {
    case 'circle': return generateCirclePath(cx, cy, props.radius)
    case 'ellipse': return generateEllipsePath(cx, cy, props.radiusX, props.radiusY)
    case 'square': return generateSquarePath(cx, cy, props.radius * 2)
    case 'star': return generateStarPath(cx, cy, props.radius, props.radius * props.starInnerRatio, props.starPoints)
    case 'heart': return generateHeartPath(cx, cy, props.radius * 2)
    case 'custom': return props.customPath || generateCirclePath(cx, cy, props.radius)
    default: return generateEllipsePath(cx, cy, props.radiusX, props.radiusY)
  }
})

const containerStyle = computed(() => ({
  width: props.responsive ? '100%' : (typeof props.width === 'number' ? props.width + 'px' : props.width),
  height: props.responsive ? 'auto' : (typeof props.height === 'number' ? props.height + 'px' : props.height),
  aspectRatio: props.responsive ? '1 / 1' : undefined,
}))

const scalingStyle = computed(() => ({
  width: props.responsive ? props.baseWidth + 'px' : '100%',
  height: props.responsive ? props.baseWidth + 'px' : '100%',
  transform: props.responsive ? `translate(-50%, -50%) scale(${scale.value})` : undefined,
}))

function getItemStyle(index) {
  const itemOffset = props.fill ? (index / props.images.length) * 100 : 0
  const p = ((progress.value + itemOffset) % 100 + 100) % 100
  return {
    width: props.itemSize + 'px',
    height: props.itemSize + 'px',
    offsetPath: `path("${path.value}")`,
    offsetDistance: p + '%',
    offsetRotate: '0deg',
    position: 'absolute',
  }
}

let rafId = null
let startTime = 0

onMounted(async () => {
  await nextTick()
  if (props.responsive && containerRef.value) {
    const ro = new ResizeObserver(() => {
      if (containerRef.value) {
        scale.value = containerRef.value.clientWidth / props.baseWidth
      }
    })
    ro.observe(containerRef.value)
  }

  function animate(t) {
    if (!startTime) startTime = t
    if (!props.paused) {
      const elapsed = (t - startTime) / 1000
      const totalProgress = (elapsed / props.duration) * 100
      progress.value = props.direction === 'reverse' ? -totalProgress : totalProgress
    }
    rafId = requestAnimationFrame(animate)
  }
  rafId = requestAnimationFrame(animate)
})

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<style scoped>
.orbit-container {
  position: relative;
  overflow: hidden;
}
.orbit-scaling-container {
  position: relative;
  left: 50%;
  top: 50%;
  transform-origin: center center;
}
.orbit-scaling-container--responsive {
  position: absolute;
}
.orbit-rotation-wrapper {
  position: absolute;
  inset: 0;
}
.orbit-item {
  position: absolute;
  will-change: offset-distance;
  transition: offset-distance 0.1s linear;
}
.orbit-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}
.orbit-center-content {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}
.orbit-path-svg {
  position: absolute;
  inset: 0;
}
</style>
