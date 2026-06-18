<template>
  <h2 ref="containerRef" :class="['scroll-reveal', containerClassName]">
    <p :class="['scroll-reveal-text', textClassName]">
      <span v-for="(part, idx) in splitWords" :key="idx" :class="{ word: !part.isSpace }" :style="part.isSpace ? {} : { opacity: baseOpacity, filter: enableBlur ? `blur(${blurStrength}px)` : 'none' }">
        {{ part.text }}<template v-if="part.isSpace && idx < splitWords.length - 1">&nbsp;</template>
      </span>
    </p>
  </h2>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  children: { type: String, default: '' },
  enableBlur: { type: Boolean, default: true },
  baseOpacity: { type: Number, default: 0.1 },
  baseRotation: { type: Number, default: 3 },
  blurStrength: { type: Number, default: 4 },
  containerClassName: { type: String, default: '' },
  textClassName: { type: String, default: '' },
  rotationEnd: { type: String, default: 'bottom bottom' },
  wordAnimationEnd: { type: String, default: 'bottom bottom' },
})

const containerRef = ref(null)
let animFrame = null

const splitWords = computed(() => {
  return props.children.split(/(\s+)/).map((word, idx) => {
    if (word.match(/^\s+$/)) return { text: word, isSpace: true }
    return { text: word, isSpace: false }
  })
})

onMounted(async () => {
  await nextTick()
  if (!containerRef.value) return

  const el = containerRef.value
  const words = el.querySelectorAll('.word')
  const totalScrollHeight = document.documentElement.scrollHeight - window.innerHeight

  function update() {
    const scrollY = window.scrollY
    const rect = el.getBoundingClientRect()
    const windowH = window.innerHeight

    // Rotation
    const rotStart = rect.top + scrollY - windowH
    const rotEnd = rect.top + scrollY + rect.height
    const rotProgress = Math.max(0, Math.min(1, (scrollY - rotStart) / (rotEnd - rotStart)))
    const rot = props.baseRotation * (1 - rotProgress)
    el.style.transform = `rotate(${rot}deg)`
    el.style.transformOrigin = '0% 50%'

    // Word opacity
    const opStart = rotStart
    const opEnd = rotEnd
    const opProgress = Math.max(0, Math.min(1, (scrollY - opStart) / (opEnd - opStart)))
    words.forEach((w, i) => {
      const p = Math.max(0, Math.min(1, opProgress + i * 0.05))
      w.style.opacity = String(props.baseOpacity + (1 - props.baseOpacity) * p)
      if (props.enableBlur) {
        w.style.filter = `blur(${props.blurStrength * (1 - p)}px)`
      }
    })

    animFrame = requestAnimationFrame(update)
  }
  animFrame = requestAnimationFrame(update)
})

onUnmounted(() => {
  if (animFrame) cancelAnimationFrame(animFrame)
})
</script>

<style scoped>
.scroll-reveal {
  will-change: transform;
}
.scroll-reveal-text {
  display: inline;
}
.word {
  display: inline-block;
  transition: opacity 0.3s ease, filter 0.3s ease;
}
</style>
