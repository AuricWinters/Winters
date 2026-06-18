<template>
  <div ref="containerRef" :class="['carousel-container', { round }]" :style="containerStyle">
    <div
      class="carousel-track"
      :style="trackStyle"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointerleave="onPointerUp"
    >
      <div
        v-for="(item, index) in itemsForRender"
        :key="`${item?.id ?? index}-${index}`"
        :class="['carousel-item', { round }]"
        :style="getItemStyle(index)"
      >
        <div class="carousel-item-header">
          <span class="carousel-icon-container" v-html="item.icon"></span>
        </div>
        <div class="carousel-item-content">
          <div class="carousel-item-title">{{ item.title }}</div>
          <p class="carousel-item-description">{{ item.description }}</p>
        </div>
      </div>
    </div>
    <div :class="['carousel-indicators-container', { round }]">
      <div class="carousel-indicators">
        <button
          v-for="(_, index) in items"
          :key="index"
          type="button"
          :class="['carousel-indicator', activeIndex === index ? 'active' : 'inactive']"
          :aria-label="`Go to slide ${index + 1}`"
          :aria-current="activeIndex === index"
          @click="goTo(index)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  items: { type: Array, default: () => [] },
  baseWidth: { type: Number, default: 300 },
  autoplay: { type: Boolean, default: false },
  autoplayDelay: { type: Number, default: 3000 },
  pauseOnHover: { type: Boolean, default: false },
  loop: { type: Boolean, default: false },
  round: { type: Boolean, default: false },
})

const containerPadding = 16
const gap = 16
const itemWidth = computed(() => props.baseWidth - containerPadding * 2)
const trackItemOffset = computed(() => itemWidth.value + gap)

const itemsForRender = computed(() => {
  if (!props.loop) return props.items
  if (props.items.length === 0) return []
  return [props.items[props.items.length - 1], ...props.items, props.items[0]]
})

const containerRef = ref(null)
const position = ref(props.loop ? 1 : 0)
const isHovered = ref(false)
let isDragging = false
let startX = 0
let offsetX = 0
let hasMoved = false
let autoplayTimer = null

const activeIndex = computed(() => {
  if (props.items.length === 0) return 0
  if (props.loop) return (position.value - 1 + props.items.length) % props.items.length
  return Math.min(position.value, props.items.length - 1)
})

const containerStyle = computed(() => ({
  width: props.baseWidth + 'px',
  ...(props.round ? { height: props.baseWidth + 'px', borderRadius: '50%' } : {}),
}))

const trackStyle = computed(() => {
  const x = -(position.value * trackItemOffset.value) + offsetX
  return {
    width: itemWidth.value + 'px',
    gap: gap + 'px',
    transform: `translateX(${x}px)`,
    transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
    perspective: '1000px',
    perspectiveOrigin: `${position.value * trackItemOffset.value + itemWidth.value / 2}px 50%`,
  }
})

function getItemStyle(index) {
  const range = [-(index + 1) * trackItemOffset.value, -index * trackItemOffset.value, -(index - 1) * trackItemOffset.value]
  const x = -(position.value * trackItemOffset.value) + offsetX
  let rotateY = 0
  if (x <= range[1] && x >= range[0]) {
    rotateY = 90 - ((x - range[0]) / (range[1] - range[0])) * 90
  } else if (x <= range[2] && x >= range[1]) {
    rotateY = 0 - ((x - range[1]) / (range[2] - range[1])) * 90
  } else {
    rotateY = 90
  }
  return {
    width: itemWidth.value + 'px',
    height: props.round ? itemWidth.value + 'px' : '100%',
    transform: `rotateY(${rotateY}deg)`,
    ...(props.round ? { borderRadius: '50%' } : {}),
  }
}

const defaultItems = [
  { title: 'Text Animations', description: 'Cool text animations', id: 1, icon: '&#x1F4C4;' },
  { title: 'Animations', description: 'Smooth animations', id: 2, icon: '&#x25CB;' },
  { title: 'Components', description: 'Reusable components', id: 3, icon: '&#x2B1C;' },
  { title: 'Backgrounds', description: 'Beautiful patterns', id: 4, icon: '&#x2B1B;' },
  { title: 'Common UI', description: 'Common components', id: 5, icon: '&#x2714;' },
]

const items = computed(() => props.items.length ? props.items : defaultItems)

function onPointerDown(e) {
  isDragging = true
  hasMoved = false
  startX = e.clientX
  offsetX = 0
}

function onPointerMove(e) {
  if (!isDragging) return
  const dx = e.clientX - startX
  if (Math.abs(dx) > 5) hasMoved = true
  offsetX = dx
}

function onPointerUp() {
  if (!isDragging) return
  isDragging = false
  if (!hasMoved) return
  const direction = offsetX < 0 ? 1 : -1
  if (Math.abs(offsetX) > 30) {
    position.value = Math.max(0, Math.min(position.value + direction, itemsForRender.value.length - 1))
  }
  offsetX = 0

  if (props.loop && itemsForRender.value.length > 1) {
    if (position.value === itemsForRender.value.length - 1) {
      setTimeout(() => { position.value = 1 }, 500)
    }
    if (position.value === 0) {
      setTimeout(() => { position.value = items.value.length }, 500)
    }
  }
}

function goTo(index) {
  position.value = props.loop ? index + 1 : index
}

function startAutoplay() {
  if (props.autoplay && itemsForRender.value.length > 1) {
    autoplayTimer = setInterval(() => {
      if (!isHovered.value) {
        position.value = Math.min(position.value + 1, itemsForRender.value.length - 1)
        if (props.loop && position.value === itemsForRender.value.length - 1) {
          setTimeout(() => { position.value = 1 }, 500)
        }
      }
    }, props.autoplayDelay)
  }
}

onMounted(async () => {
  await nextTick()
  if (props.pauseOnHover && containerRef.value) {
    containerRef.value.addEventListener('mouseenter', () => { isHovered.value = true })
    containerRef.value.addEventListener('mouseleave', () => { isHovered.value = false })
  }
  startAutoplay()
})

onUnmounted(() => {
  if (autoplayTimer) clearInterval(autoplayTimer)
})
</script>

<style scoped>
.carousel-container {
  position: relative;
  overflow: hidden;
  user-select: none;
}
.carousel-track {
  display: flex;
  align-items: center;
  margin: 0 auto;
  will-change: transform;
  touch-action: pan-y;
}
.carousel-item {
  flex-shrink: 0;
  background: #1a1a2e;
  border-radius: 12px;
  padding: 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 8px;
  backface-visibility: hidden;
}
.carousel-item.round {
  align-items: center;
  justify-content: center;
}
.carousel-icon-container { font-size: 24px; }
.carousel-item-title { font-weight: 600; font-size: 16px; color: #fff; }
.carousel-item-description { font-size: 13px; color: #999; margin: 0; }
.carousel-indicators-container {
  display: flex;
  justify-content: center;
  padding: 12px 0;
}
.carousel-indicators { display: flex; gap: 6px; }
.carousel-indicator {
  width: 8px; height: 8px; border-radius: 50%;
  border: none; padding: 0; cursor: pointer;
  transition: transform 0.15s, background 0.3s;
}
.carousel-indicator.active { background: #5227FF; transform: scale(1.2); }
.carousel-indicator.inactive { background: #333; }
</style>
