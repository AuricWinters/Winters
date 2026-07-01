<template>
  <div
    ref="cardRef"
    class="decay-card"
  >
    <div
      class="decay-bg"
      :style="bgStyle"
    />
    <svg class="decay-svg">
      <defs>
        <filter :id="filterId">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.03"
            numOctaves="3"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            :scale="displacement"
            xChannelSelector="R"
            yChannelSelector="G"
            result="disp"
          />
        </filter>
      </defs>
      <rect
        width="100%"
        height="100%"
        :filter="`url(#${filterId})`"
        fill="none"
      />
    </svg>
    <div class="decay-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  baseFrequency: { type: Number, default: 0.03 },
  maxDisplacement: { type: Number, default: 30 },
  color: { type: String, default: '' },
})

const cardRef = ref(null)
const filterId = `decay-filter-${Math.random().toString(36).slice(2, 8)}`
const displacement = ref(0)
let animId = null
let targetDisp = 0
let currentDisp = 0

const bgStyle = computed(() =>
  props.color ? { background: props.color } : {}
)

function lerp() {
  currentDisp += (targetDisp - currentDisp) * 0.15
  displacement.value = Math.abs(currentDisp) < 0.1 ? 0 : currentDisp
  animId = requestAnimationFrame(lerp)
}

function onEnter() { targetDisp = props.maxDisplacement }
function onLeave() { targetDisp = 0 }

onMounted(() => {
  const el = cardRef.value
  if (!el) return
  el.addEventListener('mouseenter', onEnter)
  el.addEventListener('mouseleave', onLeave)
  animId = requestAnimationFrame(lerp)
})

onUnmounted(() => {
  if (animId) cancelAnimationFrame(animId)
  const el = cardRef.value
  if (el) {
    el.removeEventListener('mouseenter', onEnter)
    el.removeEventListener('mouseleave', onLeave)
  }
})
</script>

<style scoped>
.decay-card {
  position: relative;
  overflow: hidden;
  border-radius: inherit;
}
.decay-bg {
  position: absolute;
  inset: 0;
  border-radius: inherit;
}
.decay-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}
.decay-content {
  position: relative;
  z-index: 2;
}
</style>
