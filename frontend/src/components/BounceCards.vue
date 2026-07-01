<template>
  <div
    ref="wrapRef"
    class="bounce-cards"
  >
    <div
      v-for="(item, i) in items"
      :key="i"
      ref="cardRefs"
      class="bounce-card-item"
      :style="{ transitionDelay: i * staggerMs + 'ms' }"
    >
      <slot
        name="card"
        :item="item"
        :index="i"
        :active="activeIndex === i"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

defineProps({
  items: { type: Array, default: () => [] },
  staggerMs: { type: Number, default: 80 },
})

const wrapRef = ref(null)
const activeIndex = ref(-1)
let observer

function onEnter(i) {
  activeIndex.value = i
  // Push siblings away
  const cards = wrapRef.value?.querySelectorAll('.bounce-card-item') as NodeListOf<HTMLElement> | undefined
  cards?.forEach((card, j) => {
    if (j === i) return
    const offset = (j - i) * 8
    card.style.transform = `translateX(${offset}px)`
  })
}

function onLeave() {
  activeIndex.value = -1
  const cards = wrapRef.value?.querySelectorAll('.bounce-card-item') as NodeListOf<HTMLElement> | undefined
  cards?.forEach(card => { card.style.transform = '' })
}

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        ;(entry.target as HTMLElement).style.transform = 'scale(1)'
        observer.unobserve(entry.target)
      })
    },
    { threshold: 0.1 }
  )

  const cards = wrapRef.value?.querySelectorAll('.bounce-card-item') as NodeListOf<HTMLElement> | undefined
  cards?.forEach((card, i) => {
    card.style.transform = 'scale(0)'
    card.addEventListener('mouseenter', () => onEnter(i))
    card.addEventListener('mouseleave', onLeave)
    setTimeout(() => observer.observe(card), i * 80)
  })
})

onUnmounted(() => {
  const cards = wrapRef.value?.querySelectorAll('.bounce-card-item') as NodeListOf<HTMLElement> | undefined
  cards?.forEach(card => {
    card.removeEventListener('mouseenter', onEnter)
    card.removeEventListener('mouseleave', onLeave)
  })
})
</script>

<style scoped>
.bounce-cards {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}
.bounce-card-item {
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  cursor: pointer;
}
.bounce-card-item:hover {
  transform: scale(1.08) !important;
  z-index: 2;
}
</style>
