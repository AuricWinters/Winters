<template>
  <span
    class="rt"
    :class="[mainClassName, { 'rt--lines': splitBy === 'lines' }]"
    :aria-label="texts[currentIdx]"
  >
    <!-- Screen-reader only: always announces current text -->
    <span class="rt__sr">{{ texts[currentIdx] }}</span>

    <!-- Visual rotating text -->
    <span
      class="rt__viewport"
      :class="phase === 'exiting' ? 'rt__viewport--exit' : phase === 'entering' ? 'rt__viewport--enter' : ''"
    >
      <template v-if="phase === 'exiting'">
        <template v-for="(word, wi) in oldWords" :key="'ex-' + wi">
          <span class="rt__word" :class="splitLevelClassName">
            <span
              v-for="(ch, ci) in word.chars"
              :key="'ex-' + wi + '-' + ci"
              class="rt__char"
              :class="elementLevelClassName"
              :style="{ animationDelay: calcDelay(wi, ci, oldWords) + 'ms' }"
            >{{ ch }}</span>
          </span>
          <span v-if="word.space" class="rt__space"> </span>
        </template>
      </template>
      <template v-else>
        <template v-for="(word, wi) in currentWords" :key="'en-' + wi">
          <span class="rt__word" :class="splitLevelClassName">
            <span
              v-for="(ch, ci) in word.chars"
              :key="'en-' + wi + '-' + ci"
              class="rt__char"
              :class="elementLevelClassName"
              :style="phase === 'entering' ? { animationDelay: calcDelay(wi, ci, currentWords) + 'ms' } : undefined"
            >{{ ch }}</span>
          </span>
          <span v-if="word.space" class="rt__space"> </span>
        </template>
      </template>
    </span>

    <!-- Slot for wrapping content (prefix, suffix, or decorative elements) -->
    <slot />
  </span>
</template>

<script setup lang="ts">
/**
 * RotatingText.vue
 *
 * A Vue 3 port of the react-bits RotatingText component.
 * Rotates through an array of text strings with character-level enter/exit animations.
 *
 * Pure CSS -- no GSAP, Framer Motion, or other external animation libraries.
 */
import { ref, computed, onMounted, onUnmounted } from 'vue'

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */
interface WordInfo {
  chars: string[]
  space: boolean
}

const props = withDefaults(
  defineProps<{
    /** Array of text strings to rotate through */
    texts: string[]
    /** Interval (ms) between auto-rotations */
    rotationInterval?: number
    /** Whether to loop back to the start */
    loop?: boolean
    /** Whether to auto-rotate on mount */
    auto?: boolean
    /** Split strategy: 'characters' | 'words' | 'lines' | '<delimiter>' */
    splitBy?: string
    /** Stagger delay (ms) between each character */
    staggerDuration?: number
    /** Stagger origin: 'first' | 'last' | 'center' | 'random' | <number> */
    staggerFrom?: 'first' | 'last' | 'center' | 'random' | number
    /** Duration (ms) of a single character enter/exit animation */
    duration?: number
    /** Additional class on the root element */
    mainClassName?: string
    /** Additional class on each word-level span */
    splitLevelClassName?: string
    /** Additional class on each character-level span */
    elementLevelClassName?: string
  }>(),
  {
    rotationInterval: 2000,
    loop: true,
    auto: true,
    splitBy: 'characters',
    staggerDuration: 0,
    staggerFrom: 'first',
    duration: 300,
  }
)

/* ------------------------------------------------------------------ */
/*  Emits                                                              */
/* ------------------------------------------------------------------ */
const emit = defineEmits<{
  (e: 'next', index: number): void
}>()

/* ------------------------------------------------------------------ */
/*  State                                                              */
/* ------------------------------------------------------------------ */
const currentIdx = ref(0)
const phase = ref<'idle' | 'exiting' | 'entering'>('idle')
const oldText = ref('')

let autoTimer: ReturnType<typeof setInterval> | null = null
let exitTimer: ReturnType<typeof setTimeout> | null = null
let enterTimer: ReturnType<typeof setTimeout> | null = null

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Split string into grapheme clusters (characters visible to the user). */
function splitGraphemes(text: string): string[] {
  if (typeof Intl !== 'undefined' && (Intl as any).Segmenter) {
    const segmenter = new (Intl as any).Segmenter('en', { granularity: 'grapheme' })
    return Array.from(segmenter.segment(text), (s: any) => s.segment)
  }
  return Array.from(text)
}

/** Convert a text string into an array of word/chunk descriptors. */
function tokenize(text: string): WordInfo[] {
  const { splitBy } = props

  if (splitBy === 'characters') {
    const words = text.split(' ')
    return words.map((w, i, arr) => ({
      chars: splitGraphemes(w),
      space: i !== arr.length - 1,
    }))
  }

  if (splitBy === 'words') {
    const words = text.split(' ')
    return words.map((w, i, arr) => ({
      chars: [w],
      space: i !== arr.length - 1,
    }))
  }

  if (splitBy === 'lines') {
    const lines = text.split('\n')
    return lines.map((l, i, arr) => ({
      chars: [l],
      space: i !== arr.length - 1,
    }))
  }

  // Custom delimiter
  const parts = text.split(splitBy)
  return parts.map((p, i, arr) => ({
    chars: [p],
    space: i !== arr.length - 1,
  }))
}

/** Compute the global character index within the word list. */
function globalCharIndex(wordIdx: number, charIdx: number, words: WordInfo[]): number {
  let offset = 0
  for (let w = 0; w < wordIdx; w++) {
    offset += words[w].chars.length
  }
  return offset + charIdx
}

/* ------------------------------------------------------------------ */
/*  Computed                                                           */
/* ------------------------------------------------------------------ */
const currentWords = computed(() => tokenize(props.texts[currentIdx.value]))
const oldWords = computed(() => tokenize(oldText.value))

/* ------------------------------------------------------------------ */
/*  Stagger delay                                                      */
/* ------------------------------------------------------------------ */
function calcDelay(wordIdx: number, charIdx: number, words: WordInfo[]): number {
  if (props.staggerDuration === 0) return 0

  const total = words.reduce((s, w) => s + w.chars.length, 0)
  const idx = globalCharIndex(wordIdx, charIdx, words)
  const { staggerFrom } = props

  if (staggerFrom === 'first') return idx * props.staggerDuration
  if (staggerFrom === 'last') return (total - 1 - idx) * props.staggerDuration
  if (staggerFrom === 'center') {
    const center = Math.floor(total / 2)
    return Math.abs(center - idx) * props.staggerDuration
  }
  if (staggerFrom === 'random') {
    const ri = Math.floor(Math.random() * total)
    return Math.abs(ri - idx) * props.staggerDuration
  }

  // numeric index
  return Math.abs((staggerFrom as number) - idx) * props.staggerDuration
}

/* ------------------------------------------------------------------ */
/*  Animation sequence                                                 */
/* ------------------------------------------------------------------ */

/** Start the exit-then-enter animation cycle toward the given index. */
function goTo(newIdx: number): void {
  if (props.texts.length === 0) return
  if (newIdx === currentIdx.value) return
  if (phase.value !== 'idle') return // debounce: don't stack transitions

  // Snapshot the text being left behind
  oldText.value = props.texts[currentIdx.value]
  currentIdx.value = newIdx

  // --- Phase 1: exit ---
  phase.value = 'exiting'

  const maxExitDelay = calcDelay(
    oldWords.value.length - 1,
    (oldWords.value[oldWords.value.length - 1]?.chars.length ?? 1) - 1,
    oldWords.value
  )
  const exitMs = props.duration + maxExitDelay

  exitTimer = setTimeout(() => {
    // --- Phase 2: enter ---
    phase.value = 'entering'

    const maxEnterDelay = calcDelay(
      currentWords.value.length - 1,
      (currentWords.value[currentWords.value.length - 1]?.chars.length ?? 1) - 1,
      currentWords.value
    )
    const enterMs = props.duration + maxEnterDelay

    enterTimer = setTimeout(() => {
      phase.value = 'idle'
    }, enterMs)
  }, exitMs)

  emit('next', newIdx)
}

/* ------------------------------------------------------------------ */
/*  Public API (exposed)                                               */
/* ------------------------------------------------------------------ */

function next(): void {
  if (props.texts.length === 0) return
  const isLast = currentIdx.value >= props.texts.length - 1
  if (isLast && !props.loop) return
  goTo(isLast ? 0 : currentIdx.value + 1)
}

function prev(): void {
  if (props.texts.length === 0) return
  const isFirst = currentIdx.value === 0
  if (isFirst && !props.loop) return
  goTo(isFirst ? props.texts.length - 1 : currentIdx.value - 1)
}

function jumpTo(index: number): void {
  if (props.texts.length === 0) return
  const valid = Math.max(0, Math.min(index, props.texts.length - 1))
  if (valid === currentIdx.value) return
  goTo(valid)
}

function reset(): void {
  jumpTo(0)
}

defineExpose({ next, prev, jumpTo, reset })

/* ------------------------------------------------------------------ */
/*  Auto-rotation                                                      */
/* ------------------------------------------------------------------ */

function startAuto(): void {
  stopAuto()
  if (!props.auto || props.texts.length < 2) return
  autoTimer = setInterval(next, props.rotationInterval)
}

function stopAuto(): void {
  if (autoTimer !== null) {
    clearInterval(autoTimer)
    autoTimer = null
  }
}

/* ------------------------------------------------------------------ */
/*  Lifecycle                                                          */
/* ------------------------------------------------------------------ */
onMounted(startAuto)

onUnmounted(() => {
  stopAuto()
  if (exitTimer !== null) clearTimeout(exitTimer)
  if (enterTimer !== null) clearTimeout(enterTimer)
})
</script>

<style scoped>
/* ===================================================================
   RotatingText -- pure-CSS character-level text rotation animation
   =================================================================== */

/* --- Root container ------------------------------------------------ */
.rt {
  display: inline-flex;
  flex-wrap: wrap;
  white-space: pre-wrap;
  position: relative;
  align-items: baseline;
}

/* Line mode: stack vertically */
.rt--lines {
  display: inline-flex;
  flex-direction: column;
}

/* --- Screen-reader only (hidden visually) -------------------------- */
.rt__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* --- Viewport wrapper ---------------------------------------------- */
.rt__viewport {
  display: inline-flex;
  flex-wrap: wrap;
}

/* --- Word wrapper -------------------------------------------------- */
.rt__word {
  display: inline-flex;
  white-space: nowrap;
}

/* --- Individual character ------------------------------------------ */
.rt__char {
  display: inline-block;
  white-space: pre;
}

/* --- Exit animation ---------------------------------------------------
     Characters slide upward and fade out.                             */
.rt__viewport--exit .rt__char {
  animation: rt-exit-char var(--rt-dur, 300ms) ease-in both;
}

/* --- Enter animation ---------------------------------------------------
     Characters slide upward from below and fade in.                  */
.rt__viewport--enter .rt__char {
  animation: rt-enter-char var(--rt-dur, 300ms) ease-out both;
}

/* --- Space between words ------------------------------------------- */
.rt__space {
  white-space: pre;
}

/* ===================================================================
   Keyframes
   =================================================================== */

@keyframes rt-exit-char {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-60%);
  }
}

@keyframes rt-enter-char {
  0% {
    opacity: 0;
    transform: translateY(60%);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
