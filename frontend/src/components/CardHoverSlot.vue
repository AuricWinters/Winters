<template>
  <div
    v-if="effect === 'spotlight'"
    v-spotlight
    class="card-hover-slot"
  >
    <slot />
  </div>
  <div
    v-else-if="effect === 'tilt'"
    v-tilt
    class="card-hover-slot"
  >
    <slot />
  </div>
  <div
    v-else-if="effect === 'borderGlow'"
    ref="borderGlowRef"
    data-border-glow
    class="card-hover-slot"
  >
    <slot />
  </div>
  <GlareHover v-else-if="effect === 'glareHover'" class="card-hover-slot">
    <slot />
  </GlareHover>
  <div v-else class="card-hover-slot">
    <slot />
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onUnmounted } from 'vue'
import { useEffectStore } from '../stores/effects.js'
import GlareHover from './GlareHover.vue'

const store = useEffectStore()
const borderGlowRef = ref(null)

// 直接读 store，不用 computed 包裹
const effect = computed(() => store.slots.cardHover)

// --- borderGlow 鼠标追踪 ---
// 由于 v-if 切换会导致 ref 在不同分支间变化，手动管理事件绑定
let glowEl = null

function onGlowMove(e) {
  if (!glowEl) return
  const rect = glowEl.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const angle = Math.atan2(y - rect.height / 2, x - rect.width / 2) * (180 / Math.PI)
  glowEl.style.setProperty('--glow-angle', angle + 'deg')
}

function onGlowLeave() {
  if (!glowEl) return
  glowEl.style.setProperty('--glow-angle', '0deg')
}

function attachGlowListeners() {
  glowEl = borderGlowRef.value
  if (glowEl) {
    glowEl.style.position = 'relative'
    glowEl.addEventListener('mousemove', onGlowMove)
    glowEl.addEventListener('mouseleave', onGlowLeave)
  }
}

function detachGlowListeners() {
  if (glowEl) {
    glowEl.removeEventListener('mousemove', onGlowMove)
    glowEl.removeEventListener('mouseleave', onGlowLeave)
    glowEl = null
  }
}

watch(effect, async (val) => {
  detachGlowListeners()
  if (val === 'borderGlow') {
    await nextTick()
    attachGlowListeners()
  }
}, { immediate: true })

onUnmounted(() => {
  detachGlowListeners()
})
</script>

<style scoped>
.card-hover-slot {
  position: relative;
  overflow: hidden;
  border-radius: inherit;
}
</style>
