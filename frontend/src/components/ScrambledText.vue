<template>
  <div
    ref="rootRef"
    class="scrambled-text"
    :style="containerStyle"
    @pointermove="onPointerMove"
  >
    <p v-if="text">
      <span
        v-for="(char, index) in charStates"
        :key="index"
        :ref="(el) => setCharEl(index, el)"
        class="char"
      >{{ char.display }}</span>
    </p>
    <slot v-else />
  </div>
</template>

<script setup lang="ts">
/**
 * ScrambledText.vue
 *
 * Replicates the GSAP ScrambleTextPlugin pointer-proximity effect
 * using pure CSS and the Vue 3 Composition API.
 *
 * When the pointer moves within `radius` pixels of a character, that
 * character cycles through random glyphs and gradually settles back
 * to its original letter.  The closer the pointer, the shorter the
 * scramble duration.
 *
 * Two usage modes:
 *   1. <ScrambledText text="Hello" />
 *      -- text is split into individual characters and scrambled.
 *   2. <ScrambledText>…</ScrambledText>  (slot)
 *      -- arbitrary content is rendered as-is inside the wrapper.
 *
 * Imported animation libraries: none.
 */

import { ref, computed, reactive, watch, onBeforeUnmount } from 'vue'

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface ScrambledTextProps {
  /** The text to split into characters and scramble. */
  text?: string
  /** Distance (px) within which the pointer triggers scrambling. */
  radius?: number
  /** Base duration (s) for the scramble animation at distance 0. */
  duration?: number
  /** Scramble character refresh rate (higher = more flickering). */
  speed?: number
  /** Character pool used when scrambling (shuffled randomly). */
  scrambleChars?: string
  /** Text colour. */
  color?: string
  /** Additional class name forwarded to the root element. */
  className?: string
}

const props = withDefaults(defineProps<ScrambledTextProps>(), {
  text: '',
  radius: 100,
  duration: 1.2,
  speed: 0.5,
  scrambleChars: '.:/\\#@%&*+~<>',
  color: '#ffffff',
  className: '',
})

/* ------------------------------------------------------------------ */
/*  Internal state                                                     */
/* ------------------------------------------------------------------ */

interface CharState {
  original: string
  display: string
}

const rootRef = ref<HTMLDivElement | null>(null)
const charEls: (HTMLElement | null)[] = []
const charStates = reactive<CharState[]>([])

// Maps character index -> pending requestAnimationFrame id
const animFrames = new Map<number, number>()
// Maps character index -> timestamp of the last scrambled update
const lastUpdates = new Map<number, number>()

/* ------------------------------------------------------------------ */
/*  Computed                                                           */
/* ------------------------------------------------------------------ */

const containerStyle = computed(() => ({
  color: props.color,
  fontFamily: 'monospace',
  fontSize: 'clamp(14px, 4vw, 32px)',
  maxWidth: '800px',
}))

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getRandomChar(): string {
  const pool = props.scrambleChars
  return pool[Math.floor(Math.random() * pool.length)]
}

function setCharEl(index: number, el: unknown) {
  charEls[index] = el as HTMLElement | null
}

function buildCharStates() {
  charStates.length = 0
  for (const c of props.text) {
    charStates.push({ original: c, display: c })
  }
}

function cancelAllAnimations() {
  for (const id of animFrames.values()) {
    cancelAnimationFrame(id)
  }
  animFrames.clear()
  lastUpdates.clear()
}

/* ------------------------------------------------------------------ */
/*  Scramble animation (GSAP-free)                                     */
/* ------------------------------------------------------------------ */

function startScramble(index: number, dist: number) {
  const state = charStates[index]
  if (!state || state.original === ' ' || state.original === '') return

  // Cancel any running animation for this character
  const existingId = animFrames.get(index)
  if (existingId !== undefined) {
    cancelAnimationFrame(existingId)
  }

  const durationMs = Math.max(props.duration * (1 - dist / props.radius) * 1000, 50)
  const startTime = performance.now()

  function frame(now: number) {
    const elapsed = now - startTime

    if (elapsed >= durationMs) {
      state.display = state.original
      animFrames.delete(index)
      lastUpdates.delete(index)
      return
    }

    const progress = elapsed / durationMs

    // Higher speed = more frequent character changes.
    // As progress increases the interval grows slightly so the
    // flickering naturally slows down toward the end.
    const changeInterval = Math.max(
      16, // floor at ~60 fps
      80 / (props.speed * (1 - progress * 0.5 + 0.5)),
    )

    const lastTime = lastUpdates.get(index) ?? 0
    if (now - lastTime >= changeInterval) {
      // Near progress=0 the char almost always scrambles;
      // near progress=1 it always shows the original.
      state.display = Math.random() < 1 - progress ? getRandomChar() : state.original
      lastUpdates.set(index, now)
    }

    animFrames.set(index, requestAnimationFrame(frame))
  }

  animFrames.set(index, requestAnimationFrame(frame))
}

/* ------------------------------------------------------------------ */
/*  Event handler                                                      */
/* ------------------------------------------------------------------ */

function onPointerMove(e: PointerEvent) {
  for (let i = 0; i < charEls.length; i++) {
    const el = charEls[i]
    if (!el) continue

    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = e.clientX - cx
    const dy = e.clientY - cy
    const dist = Math.hypot(dx, dy)

    if (dist < props.radius) {
      startScramble(i, dist)
    }
  }
}

/* ------------------------------------------------------------------ */
/*  Lifecycle                                                          */
/* ------------------------------------------------------------------ */

watch(
  () => props.text,
  () => {
    cancelAllAnimations()
    buildCharStates()
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  cancelAllAnimations()
})
</script>

<style scoped>
/* ------------------------------------------------------------------ */
/*  Root container                                                     */
/* ------------------------------------------------------------------ */
.scrambled-text {
  margin: 7vw;
  max-width: 800px;
  font-family: monospace;
  font-size: clamp(14px, 4vw, 32px);
}

/* ------------------------------------------------------------------ */
/*  Individual character span                                          */
/* ------------------------------------------------------------------ */
.char {
  display: inline-block;
  will-change: transform;
}
</style>
