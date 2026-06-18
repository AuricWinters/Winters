<template>
  <section>
    <div v-for="(text, index) in texts" :key="index" :class="parallaxClassName" :style="parallaxStyle">
      <div :class="scrollerClassName" :style="{ transform: `translateX(${xValues[index]}px)`, ...scrollerStyle }">
        <span v-for="n in numCopies" :key="n" :class="className">{{ text }}&nbsp;</span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

const props = defineProps({
  texts: { type: Array, default: () => [] },
  velocity: { type: Number, default: 100 },
  className: { type: String, default: '' },
  damping: { type: Number, default: 50 },
  stiffness: { type: Number, default: 400 },
  numCopies: { type: Number, default: 6 },
  velocityMapping: { type: Object, default: () => ({ input: [0, 1000], output: [0, 5] }) },
  parallaxClassName: { type: String, default: 'parallax' },
  scrollerClassName: { type: String, default: 'scroller' },
  parallaxStyle: { type: Object, default: () => ({}) },
  scrollerStyle: { type: Object, default: () => ({}) },
})

const xValues = ref([])
let lastScrollY = 0
let smoothVelocities = []
let rafId = null

function wrap(min, max, v) {
  const range = max - min
  const mod = (((v - min) % range) + range) % range
  return mod + min
}

onMounted(() => {
  xValues.value = props.texts.map(() => 0)
  smoothVelocities = props.texts.map(() => 0)
  lastScrollY = window.scrollY

  function step() {
    const scrollY = window.scrollY
    const rawVel = scrollY - lastScrollY
    lastScrollY = scrollY

    xValues.value = xValues.value.map((x, i) => {
      const vel = Math.max(props.velocityMapping.input[0], Math.min(rawVel, props.velocityMapping.input[1]))
      const norm = props.velocityMapping.output[0] + (vel / props.velocityMapping.input[1]) * props.velocityMapping.output[1]
      smoothVelocities[i] += (norm - smoothVelocities[i]) * 0.1
      const base = i % 2 !== 0 ? -props.velocity : props.velocity
      const dir = smoothVelocities[i] < 0 ? -1 : 1
      let newX = x + (dir * base + dir * base * Math.abs(smoothVelocities[i])) * 0.016
      return wrap(-300, 0, newX)
    })

    rafId = requestAnimationFrame(step)
  }
  rafId = requestAnimationFrame(step)
})

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<style scoped>
.parallax {
  overflow: hidden;
  white-space: nowrap;
}
.scroller {
  display: inline-flex;
  will-change: transform;
}
</style>
