<template>
  <div
    ref="containerRef"
    class="focus-container"
    tabindex="0"
    :style="{
      '--border-color': borderColor,
      '--glow-color': glowColor,
    }"
  >
    <!-- Generated words from sentence prop -->
    <span
      v-for="(word, index) in words"
      :key="`word-${index}`"
      :ref="(el) => setWordRef(el, index)"
      class="focus-word"
      :class="{
        active: !manualMode && index === currentIndex,
        manual: manualMode,
      }"
      :style="getWordStyle(index)"
      @mouseenter="handleMouseEnter(index)"
      @mouseleave="handleMouseLeave"
    >
      {{ word }}
    </span>

    <!-- Slot: additional content rendered after words -->
    <slot />

    <!-- Animated focus frame -->
    <div
      class="focus-frame"
      :style="focusFrameStyle"
    >
      <span class="corner top-left" />
      <span class="corner top-right" />
      <span class="corner bottom-left" />
      <span class="corner bottom-right" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from 'vue'

interface FocusRect {
  x: number
  y: number
  width: number
  height: number
}

const props = withDefaults(
  defineProps<{
    /** Sentence to animate, split by separator into focusable words */
    sentence?: string
    /** Character used to split sentence into words */
    separator?: string
    /** When true, focus follows hover instead of auto-cycling */
    manualMode?: boolean
    /** Blur radius (px) applied to non-focused words */
    blurAmount?: number
    /** Color of the focus frame border corners */
    borderColor?: string
    /** Drop-shadow glow color of the focus frame corners */
    glowColor?: string
    /** Duration (seconds) of the focus frame transition animation */
    animationDuration?: number
    /** Pause (seconds) between auto-cycle steps */
    pauseBetweenAnimations?: number
  }>(),
  {
    sentence: 'True Focus',
    separator: ' ',
    manualMode: false,
    blurAmount: 5,
    borderColor: 'green',
    glowColor: 'rgba(0, 255, 0, 0.6)',
    animationDuration: 0.5,
    pauseBetweenAnimations: 1,
  },
)

// ---------------------------------------------------------------------------
// Computed
// ---------------------------------------------------------------------------

const words = computed(() => props.sentence!.split(props.separator!))

// ---------------------------------------------------------------------------
// Reactive state
// ---------------------------------------------------------------------------

const currentIndex = ref(0)
const lastActiveIndex = ref<number | null>(null)
const containerRef = ref<HTMLElement | null>(null)
const wordRefs = ref<(HTMLElement | null)[]>([])
const focusRect = ref<FocusRect>({ x: 0, y: 0, width: 0, height: 0 })
const hasInitialized = ref(false)

// ---------------------------------------------------------------------------
// Template ref collector (v-for function ref)
// ---------------------------------------------------------------------------

function setWordRef(el: unknown, index: number) {
  if (el) {
    wordRefs.value[index] = el as HTMLElement
  }
}

// ---------------------------------------------------------------------------
// Focus frame position updater
// ---------------------------------------------------------------------------

function updateFocusRect() {
  if (!containerRef.value || !wordRefs.value[currentIndex.value]) return

  const parentRect = containerRef.value.getBoundingClientRect()
  const activeEl = wordRefs.value[currentIndex.value]!
  const activeRect = activeEl.getBoundingClientRect()

  focusRect.value = {
    x: activeRect.left - parentRect.left,
    y: activeRect.top - parentRect.top,
    width: activeRect.width,
    height: activeRect.height,
  }
}

// Recalculate when the active index changes
watch(
  [currentIndex, words],
  () => {
    // Use requestAnimationFrame to ensure layout is settled
    requestAnimationFrame(() => {
      updateFocusRect()
      hasInitialized.value = true
    })
  },
  { immediate: true },
)

// Recalculate on resize (container or word dimensions may shift)
let resizeObserver: ResizeObserver | undefined

watch(containerRef, (el) => {
  resizeObserver?.disconnect()
  if (el) {
    resizeObserver = new ResizeObserver(() => {
      if (hasInitialized.value) updateFocusRect()
    })
    resizeObserver.observe(el)
  }
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  clearInterval(intervalId)
})

// ---------------------------------------------------------------------------
// Auto-cycling interval
// ---------------------------------------------------------------------------

let intervalId: ReturnType<typeof setInterval> | undefined

function startAutoCycle() {
  clearInterval(intervalId)
  if (props.manualMode) return

  intervalId = setInterval(
    () => {
      currentIndex.value = (currentIndex.value + 1) % words.value.length
    },
    (props.animationDuration + props.pauseBetweenAnimations) * 1000,
  )
}

watch(
  () => [props.manualMode, props.animationDuration, props.pauseBetweenAnimations, words.value.length] as const,
  () => startAutoCycle(),
  { immediate: true },
)

// ---------------------------------------------------------------------------
// Manual mode handlers
// ---------------------------------------------------------------------------

function handleMouseEnter(index: number) {
  if (!props.manualMode) return
  lastActiveIndex.value = index
  currentIndex.value = index
}

function handleMouseLeave() {
  if (!props.manualMode) return
  currentIndex.value = lastActiveIndex.value ?? 0
}

// ---------------------------------------------------------------------------
// Computed styles
// ---------------------------------------------------------------------------

const focusFrameStyle = computed(() => {
  const r = focusRect.value
  const dur = props.animationDuration

  return {
    left: `${r.x}px`,
    top: `${r.y}px`,
    width: `${r.width}px`,
    height: `${r.height}px`,
    opacity: currentIndex.value >= 0 ? 1 : 0,
    // Skip transition on the very first paint to avoid (0,0) flash
    transition: hasInitialized.value
      ? [
          `left ${dur}s ease`,
          `top ${dur}s ease`,
          `width ${dur}s ease`,
          `height ${dur}s ease`,
          `opacity ${dur}s ease`,
        ].join(', ')
      : 'none',
  }
})

function getWordStyle(index: number) {
  const isActive = index === currentIndex.value
  return {
    filter: `blur(${isActive ? 0 : props.blurAmount}px)`,
    transition: `filter ${props.animationDuration}s ease`,
  }
}
</script>

<style scoped>
.focus-container {
  position: relative;
  display: flex;
  gap: 1em;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  outline: none;
  user-select: none;
}

.focus-word {
  position: relative;
  font-size: 3rem;
  font-weight: 900;
  cursor: pointer;
  transition:
    filter 0.3s ease,
    color 0.3s ease;
  outline: none;
  user-select: none;
}

.focus-word.active {
  filter: blur(0);
}

.focus-frame {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  box-sizing: content-box;
  border: none;
}

.corner {
  position: absolute;
  width: 1rem;
  height: 1rem;
  border: 3px solid var(--border-color, #fff);
  filter: drop-shadow(0px 0px 4px var(--border-color, #fff));
  border-radius: 3px;
  transition: none;
}

.top-left {
  top: -10px;
  left: -10px;
  border-right: none;
  border-bottom: none;
}

.top-right {
  top: -10px;
  right: -10px;
  border-left: none;
  border-bottom: none;
}

.bottom-left {
  bottom: -10px;
  left: -10px;
  border-right: none;
  border-top: none;
}

.bottom-right {
  bottom: -10px;
  right: -10px;
  border-left: none;
  border-top: none;
}
</style>
