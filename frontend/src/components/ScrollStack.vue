<template>
  <div
    :ref="useWindowScroll ? undefined : scrollerRef"
    :class="['scroll-stack-scroller', className]"
  >
    <div class="scroll-stack-inner">
      <slot />
      <div class="scroll-stack-end" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  className: { type: String, default: '' },
  itemDistance: { type: Number, default: 100 },
  itemScale: { type: Number, default: 0.03 },
  itemStackDistance: { type: Number, default: 30 },
  stackPosition: { type: String, default: '20%' },
  scaleEndPosition: { type: String, default: '10%' },
  baseScale: { type: Number, default: 0.85 },
  rotationAmount: { type: Number, default: 0 },
  blurAmount: { type: Number, default: 0 },
  useWindowScroll: { type: Boolean, default: false },
})

const emit = defineEmits(['stackComplete'])
const scrollerRef = ref(null)
let rafId = null
let stackCompleted = false
let cards = []

function parsePercentage(value, containerHeight) {
  if (typeof value === 'string' && value.includes('%')) {
    return (parseFloat(value) / 100) * containerHeight
  }
  return parseFloat(value)
}

function calculateProgress(scrollTop, start, end) {
  if (scrollTop < start) return 0
  if (scrollTop > end) return 1
  return (scrollTop - start) / (end - start)
}

function getScrollData() {
  if (props.useWindowScroll) {
    return { scrollTop: window.scrollY, containerHeight: window.innerHeight }
  }
  const scroller = scrollerRef.value
  return { scrollTop: scroller.scrollTop, containerHeight: scroller.clientHeight }
}

function getElementOffset(element) {
  if (props.useWindowScroll) {
    const rect = element.getBoundingClientRect()
    return rect.top + window.scrollY
  }
  return element.offsetTop
}

function update() {
  if (!cards.length) return
  const { scrollTop, containerHeight } = getScrollData()
  const stackPositionPx = parsePercentage(props.stackPosition, containerHeight)
  const scaleEndPositionPx = parsePercentage(props.scaleEndPosition, containerHeight)

  const endEl = document.querySelector('.scroll-stack-end')
  const endTop = endEl ? getElementOffset(endEl) : 0

  cards.forEach((card, i) => {
    const cardTop = getElementOffset(card)
    const triggerStart = cardTop - stackPositionPx - props.itemStackDistance * i
    const triggerEnd = cardTop - scaleEndPositionPx
    const pinStart = cardTop - stackPositionPx - props.itemStackDistance * i
    const pinEnd = endTop - containerHeight / 2

    const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd)
    const targetScale = props.baseScale + i * props.itemScale
    const scale = 1 - scaleProgress * (1 - targetScale)
    const rotation = props.rotationAmount ? i * props.rotationAmount * scaleProgress : 0

    let translateY = 0
    const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd
    if (isPinned) {
      translateY = scrollTop - cardTop + stackPositionPx + props.itemStackDistance * i
    } else if (scrollTop > pinEnd) {
      translateY = pinEnd - cardTop + stackPositionPx + props.itemStackDistance * i
    }

    card.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale}) rotate(${rotation}deg)`

    let blur = 0
    if (props.blurAmount) {
      let topCardIndex = 0
      for (let j = 0; j < cards.length; j++) {
        const jTop = getElementOffset(cards[j])
        const jStart = jTop - stackPositionPx - props.itemStackDistance * j
        if (scrollTop >= jStart) topCardIndex = j
      }
      if (i < topCardIndex) {
        blur = Math.max(0, (topCardIndex - i) * props.blurAmount)
      }
    }
    card.style.filter = blur > 0 ? `blur(${blur}px)` : 'none'

    // Emit stack complete for last card
    if (i === cards.length - 1) {
      const inView = scrollTop >= pinStart && scrollTop <= pinEnd
      if (inView && !stackCompleted) {
        stackCompleted = true
        emit('stackComplete')
      } else if (!inView && stackCompleted) {
        stackCompleted = false
      }
    }
  })
}

onMounted(async () => {
  await nextTick()
  const scroller = props.useWindowScroll ? document.documentElement : scrollerRef.value
  if (!scroller) return

  cards = Array.from((props.useWindowScroll ? document : scroller).querySelectorAll('.scroll-stack-card'))
  cards.forEach(card => {
    card.style.willChange = 'transform, filter'
    card.style.transformOrigin = 'top center'
    card.style.backfaceVisibility = 'hidden'
  })

  update()

  if (props.useWindowScroll) {
    window.addEventListener('scroll', update, { passive: true })
  } else {
    scroller.addEventListener('scroll', update, { passive: true })
  }

  rafId = requestAnimationFrame(function loop() {
    rafId = requestAnimationFrame(loop)
  })
})

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId)
  if (props.useWindowScroll) {
    window.removeEventListener('scroll', update)
  }
})
</script>

<style scoped>
.scroll-stack-scroller {
  position: relative;
  overflow: auto;
  height: 100%;
}
.scroll-stack-inner {
  position: relative;
}
.scroll-stack-end {
  height: 1px;
}
</style>
