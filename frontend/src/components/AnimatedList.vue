<template>
  <div class="animated-list">
    <div
      v-for="(item, i) in items"
      :key="i"
      class="al-item"
      :style="{ transitionDelay: i * staggerMs + 'ms' }"
    >
      <slot
        name="item"
        :item="item"
        :index="i"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

defineProps({
  items: { type: Array, default: () => [] },
  staggerMs: { type: Number, default: 100 },
})

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('show')
        observer.unobserve(entry.target)
      })
    },
    { threshold: 0.1 }
  )

  setTimeout(() => {
    document.querySelectorAll('.animated-list .al-item').forEach(el => observer.observe(el))
  }, 200)
})
</script>

<style scoped>
.animated-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.al-item {
  opacity: 0;
  transform: translateY(16px) scale(0.95);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.al-item.show {
  opacity: 1;
  transform: translateY(0) scale(1);
}
</style>
