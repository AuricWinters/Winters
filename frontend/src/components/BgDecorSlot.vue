<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { useEffectStore } from '../stores/effects'
import DotField from './DotField.vue'
import WavesBg from './WavesBg.vue'
import LightRays from './LightRays.vue'
import PixelSnow from './PixelSnow.vue'

const store = useEffectStore()

// ColorBends 可能尚未创建，用异步加载 + defineAsyncComponent 静默降级
const ColorBends = defineAsyncComponent(() => import('./ColorBends.vue'))

const componentMap = {
  dotField: DotField,
  waves: WavesBg,
  lightRays: LightRays,
  pixelSnow: PixelSnow,
  colorBends: ColorBends,
}

const currentComponent = computed(() => {
  const key = store.slots.bgDecor
  if (key === 'none') return null
  return componentMap[key] ?? null
})
</script>

<template>
  <div
    v-if="currentComponent"
    class="bg-decor-slot"
  >
    <component :is="currentComponent" />
  </div>
</template>

<style scoped>
.bg-decor-slot {
  position: fixed;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  overflow: hidden;
}
</style>
