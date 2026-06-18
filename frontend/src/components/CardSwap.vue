<template>
  <div ref="containerRef" class="card-swap-container" :style="{ width: typeof width === 'number' ? width + 'px' : width, height: typeof height === 'number' ? height + 'px' : height }">
    <slot></slot>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, useSlots, nextTick } from 'vue'

const props = defineProps({
  width: { type: [Number, String], default: 500 },
  height: { type: [Number, String], default: 400 },
  cardDistance: { type: Number, default: 60 },
  verticalDistance: { type: Number, default: 70 },
  delay: { type: Number, default: 5000 },
  pauseOnHover: { type: Boolean, default: false },
  skewAmount: { type: Number, default: 6 },
  easing: { type: String, default: 'elastic' },
})

const emit = defineEmits(['cardClick'])
const containerRef = ref(null)
const slots = useSlots()

let order = []
let intervalId = null
let isAnimating = false
let cardRefs = []

function makeSlot(i, distX, distY, total) {
  return { x: i * distX, y: -i * distY, z: -i * distX * 1.5, zIndex: total - i }
}

function placeNow(el, slot, skew) {
  el.style.transform = `translate3d(${slot.x}px, ${slot.y}px, ${slot.z}px)`
  el.style.left = '50%'
  el.style.top = '50%'
  el.style.zIndex = slot.zIndex
  el.style.position = 'absolute'
  el.style.transformOrigin = 'center center'
}

onMounted(async () => {
  await nextTick()
  const container = containerRef.value
  if (!container) return

  const cards = Array.from(container.children).filter(el => el.classList.contains('card'))
  if (cards.length < 2) return

  cardRefs = cards
  order = Array.from({ length: cards.length }, (_, i) => i)

  const config = props.easing === 'elastic'
    ? { durDrop: 2, durMove: 2, durReturn: 2, promoteOverlap: 0.9, returnDelay: 0.05 }
    : { durDrop: 0.8, durMove: 0.8, durReturn: 0.8, promoteOverlap: 0.45, returnDelay: 0.2 }

  cards.forEach((card, i) => {
    const slot = makeSlot(i, props.cardDistance, props.verticalDistance, cards.length)
    placeNow(card, slot, props.skewAmount)
    card.style.width = typeof props.width === 'number' ? props.width + 'px' : props.width
    card.style.height = typeof props.height === 'number' ? props.height + 'px' : props.height
    card.style.willChange = 'transform'
    card.style.backfaceVisibility = 'hidden'
  })

  function swap() {
    if (order.length < 2 || isAnimating) return
    isAnimating = true
    const [front, ...rest] = order
    const elFront = cards[front]

    // Drop front card down
    elFront.style.transition = `transform ${config.durDrop}s cubic-bezier(0.68, -0.55, 0.27, 1.55)`
    elFront.style.transform = elFront.style.transform.replace(/translate3d\(([^,]+),\s*([^,]+),\s*([^)]+)\)/, (_, x, y, z) => {
      return `translate3d(${x}, calc(${y} + 500px), ${z})`
    })

    setTimeout(() => {
      // Move other cards up
      rest.forEach((idx, i) => {
        const el = cards[idx]
        const slot = makeSlot(i, props.cardDistance, props.verticalDistance, cards.length)
        el.style.transition = `transform ${config.durMove}s cubic-bezier(0.68, -0.55, 0.27, 1.55), z-index 0s`
        el.style.zIndex = slot.zIndex
        el.style.transform = `translate3d(${slot.x}px, ${slot.y}px, ${slot.z}px)`
      })

      // Return front to back
      setTimeout(() => {
        const backSlot = makeSlot(cards.length - 1, props.cardDistance, props.verticalDistance, cards.length)
        elFront.style.transition = `transform ${config.durReturn}s cubic-bezier(0.68, -0.55, 0.27, 1.55), z-index 0s`
        elFront.style.zIndex = backSlot.zIndex
        elFront.style.transform = `translate3d(${backSlot.x}px, ${backSlot.y}px, ${backSlot.z}px)`

        setTimeout(() => {
          order = [...rest, front]
          isAnimating = false
        }, config.durReturn * 1000)
      }, config.durMove * 1000 * 0.1)
    }, config.durDrop * 1000 * config.promoteOverlap)
  }

  swap()
  intervalId = setInterval(swap, props.delay)

  if (props.pauseOnHover) {
    container.addEventListener('mouseenter', () => {
      clearInterval(intervalId)
    })
    container.addEventListener('mouseleave', () => {
      intervalId = setInterval(swap, props.delay)
    })
  }
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})
</script>

<style scoped>
.card-swap-container {
  position: relative;
  perspective: 1200px;
}
:slotted(.card) {
  position: absolute;
  left: 50%;
  top: 50%;
  cursor: pointer;
  will-change: transform;
  backface-visibility: hidden;
}
</style>
