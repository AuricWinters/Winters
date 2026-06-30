<template>
  <div
    class="menu-wrap"
    :style="{ backgroundColor: bgColor }"
  >
    <nav class="menu">
      <div
        v-for="(item, idx) in items"
        :key="idx"
        ref="itemRefs"
        class="menu__item"
        :style="getItemStyle(idx)"
      >
        <a
          class="menu__item-link"
          :href="item.link"
          :style="{ color: textColor }"
          @mouseenter="e => handleEnter(e, idx)"
          @mouseleave="e => handleLeave(e, idx)"
        >
          {{ item.text }}
        </a>
        <div
          ref="marqueeRefs"
          class="marquee"
          :style="{ backgroundColor: marqueeBgColor }"
        >
          <div class="marquee__inner-wrap">
            <div
              :ref="el => { if (el) marqueeInnerRefs[idx] = el }"
              class="marquee__inner"
            >
              <div
                v-for="n in repetitions"
                :key="n"
                class="marquee__part"
                :style="{ color: marqueeTextColor }"
              >
                <span>{{ item.text }}</span>
                <div
                  class="marquee__img"
                  :style="{ backgroundImage: `url(${item.image})` }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  items: { type: Array, default: () => [] },
  speed: { type: Number, default: 15 },
  textColor: { type: String, default: '#fff' },
  bgColor: { type: String, default: '#120F17' },
  marqueeBgColor: { type: String, default: '#fff' },
  marqueeTextColor: { type: String, default: '#120F17' },
  borderColor: { type: String, default: '#fff' },
})

const itemRefs = reactive([])
const marqueeRefs = reactive([])
const marqueeInnerRefs = reactive([])
const repetitions = ref(4)

let marqueeAnimations = []
let rafId = null

function distMetric(x, y, x2, y2) {
  const xDiff = x - x2
  const yDiff = y - y2
  return xDiff * xDiff + yDiff * yDiff
}

function findClosestEdge(mouseX, mouseY, width, height) {
  const topEdgeDist = distMetric(mouseX, mouseY, width / 2, 0)
  const bottomEdgeDist = distMetric(mouseX, mouseY, width / 2, height)
  return topEdgeDist < bottomEdgeDist ? 'top' : 'bottom'
}

function getItemStyle(idx) {
  return {
    borderColor: props.borderColor,
    borderTop: idx === 0 ? 'none' : undefined,
  }
}

function handleEnter(ev, idx) {
  const item = itemRefs[idx]
  const marquee = marqueeRefs[idx]
  const marqueeInner = marqueeInnerRefs[idx]
  if (!item || !marquee || !marqueeInner) return

  const rect = item.getBoundingClientRect()
  const x = ev.clientX - rect.left
  const y = ev.clientY - rect.top
  const edge = findClosestEdge(x, y, rect.width, rect.height)

  marquee.style.transform = edge === 'top' ? 'translateY(-101%)' : 'translateY(101%)'
  marqueeInner.style.transform = edge === 'top' ? 'translateY(101%)' : 'translateY(-101%)'
  marquee.style.transition = 'none'
  marqueeInner.style.transition = 'none'

  requestAnimationFrame(() => {
    marquee.style.transition = 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)'
    marqueeInner.style.transition = 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)'
    marquee.style.transform = 'translateY(0%)'
    marqueeInner.style.transform = 'translateY(0%)'
  })
}

function handleLeave(ev, idx) {
  const item = itemRefs[idx]
  const marquee = marqueeRefs[idx]
  const marqueeInner = marqueeInnerRefs[idx]
  if (!item || !marquee || !marqueeInner) return

  const rect = item.getBoundingClientRect()
  const x = ev.clientX - rect.left
  const y = ev.clientY - rect.top
  const edge = findClosestEdge(x, y, rect.width, rect.height)

  marquee.style.transition = 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)'
  marqueeInner.style.transition = 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)'
  marquee.style.transform = edge === 'top' ? 'translateY(-101%)' : 'translateY(101%)'
  marqueeInner.style.transform = edge === 'top' ? 'translateY(101%)' : 'translateY(-101%)'
}

function setupMarquees() {
  marqueeInnerRefs.forEach((inner, idx) => {
    if (!inner) return
    const content = inner.querySelector('.marquee__part')
    if (!content) return
    const contentWidth = content.offsetWidth
    if (contentWidth === 0) return

    // Start marquee animation
    let pos = 0
    const animateMarquee = () => {
      pos -= 1
      const wrap = contentWidth
      if (pos <= -wrap) pos += wrap
      inner.style.transform = `translateX(${pos}px)`
    }
    const id = setInterval(animateMarquee, props.speed)
    marqueeAnimations.push(id)
  })
}

onMounted(async () => {
  await nextTick()

  // Calculate repetitions needed
  const viewportWidth = window.innerWidth
  const content = document.querySelector('.marquee__part')
  if (content) {
    const contentWidth = content.offsetWidth
    repetitions.value = Math.max(4, Math.ceil(viewportWidth / contentWidth) + 2)
  }

  setTimeout(setupMarquees, 100)

  function handleResize() {
    const content = document.querySelector('.marquee__part')
    if (content) {
      const contentWidth = content.offsetWidth
      repetitions.value = Math.max(4, Math.ceil(window.innerWidth / contentWidth) + 2)
    }
  }
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  marqueeAnimations.forEach(id => clearInterval(id))
})
</script>

<style scoped>
.menu-wrap {
  font-family: inherit;
}
.menu {
  display: flex;
  flex-direction: column;
}
.menu__item {
  position: relative;
  border-bottom: 1px solid;
  overflow: hidden;
}
.menu__item-link {
  display: block;
  padding: 24px 40px;
  font-size: 48px;
  font-weight: 700;
  text-decoration: none;
  line-height: 1.2;
  position: relative;
  z-index: 1;
  transition: color 0.3s;
}
@media (max-width: 768px) {
  .menu__item-link {
    font-size: 28px;
    padding: 16px 20px;
  }
}
.marquee {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  pointer-events: none;
  z-index: 2;
  transform: translateY(101%);
  will-change: transform;
}
.marquee__inner-wrap {
  overflow: hidden;
  width: 100%;
}
.marquee__inner {
  display: flex;
  white-space: nowrap;
  will-change: transform;
}
.marquee__part {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 8px;
  font-size: 48px;
  font-weight: 700;
}
@media (max-width: 768px) {
  .marquee__part {
    font-size: 28px;
  }
}
.marquee__img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
}
</style>
