<template>
  <component
    :is="tag"
    ref="elRef"
    :class="['shuffle-parent', { 'is-ready': ready }, className]"
    :style="{ textAlign, ...style }"
  >
    {{ text }}
  </component>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'

const props = defineProps({
  text: { type: String, default: '' },
  className: { type: String, default: '' },
  style: { type: Object, default: () => ({}) },
  shuffleDirection: { type: String, default: 'right' },
  duration: { type: Number, default: 350 },
  maxDelay: { type: Number, default: 0 },
  threshold: { type: Number, default: 0.1 },
  rootMargin: { type: String, default: '-100px' },
  tag: { type: String, default: 'p' },
  textAlign: { type: String, default: 'center' },
  shuffleTimes: { type: Number, default: 1 },
  animationMode: { type: String, default: 'evenodd' },
  loop: { type: Boolean, default: false },
  loopDelay: { type: Number, default: 0 },
  stagger: { type: Number, default: 30 },
  scrambleCharset: { type: String, default: '' },
  colorFrom: { type: String, default: '' },
  colorTo: { type: String, default: '' },
  triggerOnce: { type: Boolean, default: true },
  respectReducedMotion: { type: Boolean, default: true },
  triggerOnHover: { type: Boolean, default: true },
})

const emit = defineEmits(['shuffleComplete'])
const elRef = ref<HTMLElement | null>(null)
const ready = ref(false)

let observer = null
let hasPlayed = false
let currentTimeline = null
let wrappers: any[] = []
let animFrame = null

const scrollTriggerStart = computed(() => {
  const startPct = (1 - props.threshold) * 100
  const mm = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(props.rootMargin || '')
  const mv = mm ? parseFloat(mm[1]) : 0
  const mu = mm ? (mm[2] || 'px') : 'px'
  const sign = mv === 0 ? '' : mv < 0 ? `-=${Math.abs(mv)}${mu}` : `+=${mv}${mu}`
  return `top ${startPct}%${sign}`
})

function buildShuffle() {
  const el = elRef.value
  if (!el) return
  wrappers = []

  const chars = Array.from(el.childNodes)
    .filter(n => n.nodeType === 3)
    .reduce((acc, node) => {
      const text = node.textContent || ''
      node.textContent = ''
      return acc.concat(text.split(''))
    }, [] as string[])

  if (!chars.length) return

  const rolls = Math.max(1, Math.floor(props.shuffleTimes))
  const rand = (set) => set.charAt(Math.floor(Math.random() * set.length)) || ''

  const isVertical = props.shuffleDirection === 'up' || props.shuffleDirection === 'down'

  chars.forEach((ch) => {
    if (ch === ' ') {
      el.appendChild(document.createTextNode(' '))
      return
    }
    const wrap = document.createElement('span')
    wrap.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:bottom;position:relative'

    const inner = document.createElement('span')
    inner.style.cssText = `display:inline-block;white-space:${isVertical ? 'normal' : 'nowrap'};transition:transform ${props.duration}ms ease;will-change:transform`

    const orig = document.createElement('span')
    orig.style.cssText = 'display:inline-block'
    orig.textContent = ch
    inner.appendChild(orig)

    for (let k = 0; k < rolls; k++) {
      const c = document.createElement('span')
      c.style.cssText = 'display:inline-block'
      c.textContent = props.scrambleCharset ? rand(props.scrambleCharset) : ch
      inner.appendChild(c)
    }

    const final = document.createElement('span')
    final.style.cssText = 'display:inline-block'
    final.textContent = ch
    inner.appendChild(final)

    wrap.appendChild(inner)
    el.appendChild(wrap)
    wrappers.push({ wrap, inner, chars: [orig, ...Array(rolls).fill(0).map(() => document.createElement('span')), final] })
  })
}

function playShuffle() {
  if (!wrappers.length) return
  const isVertical = props.shuffleDirection === 'up' || props.shuffleDirection === 'down'

  wrappers.forEach((w, i) => {
    const steps = props.shuffleTimes + 1
    const offset = i * props.stagger
    const delay = props.animationMode === 'random' ? Math.random() * props.maxDelay : offset

    setTimeout(() => {
      const tx = props.shuffleDirection === 'right' ? -steps * 50 : props.shuffleDirection === 'left' ? steps * 50 : 0
      const ty = props.shuffleDirection === 'down' ? -steps * 20 : props.shuffleDirection === 'up' ? steps * 20 : 0
      w.inner.style.transform = `translate3d(${tx}px, ${ty}px, 0)`
      setTimeout(() => {
        w.inner.style.transition = 'none'
        w.inner.style.transform = 'translate3d(0,0,0)'
        if (props.colorTo) w.inner.style.color = props.colorTo
      }, props.duration)
    }, delay)

    if (props.colorFrom) w.wrap.style.color = props.colorFrom
  })

  const totalTime = wrappers.length * props.stagger + props.duration + 100
  setTimeout(() => {
    emit('shuffleComplete')
    if (props.loop) {
      setTimeout(() => {
        wrappers.forEach(w => {
          w.inner.style.transition = ''
          w.inner.style.transform = ''
        })
        setTimeout(() => playShuffle(), 50)
      }, props.loopDelay)
    }
  }, totalTime)
}

function startAnimation() {
  if (hasPlayed && props.triggerOnce) return
  if (props.respectReducedMotion && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    emit('shuffleComplete')
    return
  }
  elRef.value.innerHTML = props.text
  buildShuffle()
  requestAnimationFrame(() => {
    // force reflow
    requestAnimationFrame(() => {
      playShuffle()
      ready.value = true
      hasPlayed = true
    })
  })
}

onMounted(async () => {
  await nextTick()
  if (!elRef.value || !props.text) return

  observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startAnimation()
        if (props.triggerOnce && observer) observer.disconnect()
      }
    })
  }, { threshold: props.threshold })

  observer.observe(elRef.value)

  if (props.triggerOnHover && !props.triggerOnce) {
    elRef.value.addEventListener('mouseenter', startAnimation)
  }
})

onUnmounted(() => {
  if (observer) observer.disconnect()
  if (animFrame) cancelAnimationFrame(animFrame)
})
</script>

<style scoped>
.shuffle-parent {
  display: inline-block;
}
</style>
