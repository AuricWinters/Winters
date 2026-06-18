<template>
  <component :is="tag" ref="elRef" class="split-parent" :class="className" :style="rootStyle">
    {{ text }}
  </component>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'

const props = defineProps({
  text: { type: String, default: '' },
  className: { type: String, default: '' },
  delay: { type: Number, default: 50 },
  duration: { type: Number, default: 1250 },
  splitType: { type: String, default: 'chars' },
  threshold: { type: Number, default: 0.1 },
  rootMargin: { type: String, default: '-100px' },
  tag: { type: String, default: 'p' },
  textAlign: { type: String, default: 'center' },
})

const emit = defineEmits(['letterAnimationComplete'])
const elRef = ref(null)
const ready = ref(false)
let observer = null
let animated = false

const rootStyle = computed(() => ({
  textAlign: props.textAlign,
  overflow: 'hidden',
  display: 'inline-block',
  whiteSpace: 'normal',
  wordWrap: 'break-word',
}))

function splitText(el) {
  const text = el.textContent
  if (props.splitType.includes('chars')) {
    el.innerHTML = text.split('').map(c => `<span class="split-char" style="display:inline-block;opacity:0;transform:translateY(40px);transition:opacity ${props.duration}ms ease, transform ${props.duration}ms ease">${c}</span>`).join('')
  } else if (props.splitType.includes('words')) {
    el.innerHTML = text.split(/\s+/).map(w => `<span class="split-word" style="display:inline-block;opacity:0;transform:translateY(40px);transition:opacity ${props.duration}ms ease, transform ${props.duration}ms ease">${w}&nbsp;</span>`).join('')
  } else if (props.splitType.includes('lines')) {
    const wrapper = document.createElement('div')
    text.split('\n').forEach(line => {
      const s = document.createElement('span')
      s.className = 'split-line'
      s.style.cssText = `display:block;opacity:0;transform:translateY(40px);transition:opacity ${props.duration}ms ease, transform ${props.duration}ms ease`
      s.textContent = line
      wrapper.appendChild(s)
    })
    el.innerHTML = wrapper.innerHTML
  }
  return el.querySelectorAll('.split-char, .split-word, .split-line')
}

function animate(targets) {
  targets.forEach((t, i) => {
    setTimeout(() => {
      t.style.opacity = '1'
      t.style.transform = 'translateY(0)'
    }, i * props.delay)
  })
  const total = targets.length
  setTimeout(() => {
    animated = true
    emit('letterAnimationComplete')
  }, total * props.delay + props.duration)
}

onMounted(async () => {
  await nextTick()
  if (!elRef.value || !props.text) return
  ready.value = true
  const startPct = (1 - props.threshold) * 100
  const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(props.rootMargin)
  const marginValue = marginMatch ? parseFloat(marginMatch[1]) : 0
  const marginUnit = marginMatch ? (marginMatch[2] || 'px') : 'px'
  const rootMarginVal = `${marginValue}${marginUnit}`

  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        const targets = splitText(elRef.value)
        animate(targets)
        if (observer) observer.disconnect()
      }
    })
  }, { threshold: props.threshold, rootMargin: rootMarginVal })
  observer.observe(elRef.value)
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})
</script>

<style scoped>
.split-parent {
  will-change: transform, opacity;
}
</style>
