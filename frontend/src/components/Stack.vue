<template>
  <div
    class="stack-container"
    @mouseenter="pauseOnHover && (isPaused = true)"
    @mouseleave="pauseOnHover && (isPaused = false)"
  >
    <div
      v-for="(card, index) in stack"
      :key="card.id"
      class="card-rotate"
      :style="getCardStyle(card, index)"
      @pointerdown="e => onPointerDown(e, card.id)"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @click="sendToBackOnClick && sendToBack(card.id)"
    >
      <div
        class="card"
        :style="getCardInnerStyle(card, index)"
        @click="shouldEnableClick && sendToBack(card.id)"
      >
        <img
          v-if="typeof card.content === 'string'"
          :src="card.content"
          alt="card"
          class="card-image"
        >
        <component
          :is="card.content"
          v-else-if="card.content"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  randomRotation: { type: Boolean, default: false },
  sensitivity: { type: Number, default: 200 },
  cards: { type: Array, default: () => [] },
  animationConfig: { type: Object, default: () => ({ stiffness: 260, damping: 20 }) },
  sendToBackOnClick: { type: Boolean, default: false },
  autoplay: { type: Boolean, default: false },
  autoplayDelay: { type: Number, default: 3000 },
  pauseOnHover: { type: Boolean, default: false },
})

const isPaused = ref(false)
const stack = ref([])
const isDragging = ref(false)
const dragStart = ref(null)
const dragId = ref(null)
const offsets = ref(new Map())

const defaultCards = [
  { id: 1, content: 'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=500&auto=format' },
  { id: 2, content: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=500&auto=format' },
  { id: 3, content: 'https://images.unsplash.com/photo-1452626212852-811d58933cae?q=80&w=500&auto=format' },
  { id: 4, content: 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=500&auto=format' },
]

function sendToBack(id) {
  stack.value = [...stack.value]
  const idx = stack.value.findIndex(c => c.id === id)
  if (idx === -1) return
  const [card] = stack.value.splice(idx, 1)
  stack.value.unshift(card)
}

function getCardStyle(card, index) {
  const offset = offsets.value.get(card.id) || { x: 0, y: 0 }
  return {
    zIndex: index,
    transform: `translate(${offset.x}px, ${offset.y}px)`,
    transition: isDragging.value ? 'none' : `transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)`,
    touchAction: 'none',
  }
}

function getCardInnerStyle(card, index) {
  const randomRotate = props.randomRotation ? Math.random() * 10 - 5 : 0
  return {
    transform: `rotateZ(${(stack.value.length - index - 1) * 4 + randomRotate}deg)`,
    transformOrigin: '90% 90%',
    transition: `transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)`,
  }
}

function onPointerDown(e, id) {
  isDragging.value = true
  dragStart.value = { x: e.clientX, y: e.clientY }
  dragId.value = id
}

function onPointerMove(e) {
  if (!isDragging.value || !dragStart.value) return
  const dx = e.clientX - dragStart.value.x
  const dy = e.clientY - dragStart.value.y

  if (Math.abs(dx) > props.sensitivity || Math.abs(dy) > props.sensitivity) {
    isDragging.value = false
    dragStart.value = null
    if (dragId.value) sendToBack(dragId.value)
    return
  }

  offsets.value.set(dragId.value, { x: dx, y: dy })
}

function onPointerUp() {
  if (isDragging.value && dragStart.value) {
    const dx = dragStart.value ? (dragStart.value.x - (dragStart.value?.x || 0)) : 0
    if (Math.abs(dx) > 5) {
      if (dragId.value) sendToBack(dragId.value)
    }
  }
  isDragging.value = false
  dragStart.value = null
  dragId.value = null
  offsets.value.clear()
}

let autoplayTimer = null

onMounted(async () => {
  await nextTick()
  stack.value = props.cards.length
    ? props.cards.map((content, index) => ({ id: index + 1, content }))
    : defaultCards.map(c => ({ ...c }))

  if (props.autoplay && stack.value.length > 1) {
    autoplayTimer = setInterval(() => {
      if (!isPaused.value && stack.value.length > 1) {
        const topCardId = stack.value[stack.value.length - 1].id
        sendToBack(topCardId)
      }
    }, props.autoplayDelay)
  }
})

onUnmounted(() => {
  if (autoplayTimer) clearInterval(autoplayTimer)
})
</script>

<style scoped>
.stack-container {
  position: relative;
  width: 280px;
  height: 380px;
  margin: 0 auto;
}
.card-rotate {
  position: absolute;
  width: 100%;
  height: 100%;
  cursor: grab;
}
.card-rotate:active {
  cursor: grabbing;
}
.card {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  background: #1a1a2e;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
  will-change: transform;
}
.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
}
</style>
