<template>
  <div
    ref="gridRef"
    class="masonry-grid"
    :style="{ columns: cols }"
  >
    <div
      v-for="(item, i) in items"
      :key="i"
      class="masonry-item"
      :style="itemStyle(i)"
    >
      <slot
        name="item"
        :item="item"
        :index="i"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  items: { type: Array, default: () => [] },
  cols: { type: Number, default: 4 },
  gap: { type: Number, default: 16 },
})

const gridRef = ref(null)
const heights = ref([])

function itemStyle(i) {
  return {} // Masonry positioning handled by CSS grid fallback
}

// Simplified: uses CSS grid with auto-rows for now
// Full absolute-positioning masonry deferred to later optimization
</script>

<style scoped>
.masonry-grid {
  display: grid;
  grid-template-columns: repeat(var(--masonry-cols, 4), 1fr);
  grid-auto-rows: auto;
  gap: v-bind(gap + 'px');
}
@media (max-width: 1024px) {
  .masonry-grid { --masonry-cols: 3; }
}
@media (max-width: 768px) {
  .masonry-grid { --masonry-cols: 2; }
}
@media (max-width: 480px) {
  .masonry-grid { --masonry-cols: 1; }
}
.masonry-item {
  break-inside: avoid;
}
</style>
