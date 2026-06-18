<template>
  <div
    ref="containerRef"
    class="falling-text-container"
    @click="onClick"
    @mouseenter="onMouseEnter"
  >
    <div
      ref="textRef"
      class="falling-text-target"
      :class="{ 'is-falling': isFalling }"
      :style="{ fontSize: fontSize }"
    >
      <slot>
        <span
          v-for="(word, index) in words"
          :key="index"
          class="word"
          :class="{ highlighted: word.isHighlighted }"
          :style="{
            '--rotation': `${word.rotation}deg`,
            '--delay': `${word.delay}s`,
            '--duration': `${word.duration}s`,
            '--fall-distance': typeof fallDistance === 'number' ? `${fallDistance}px` : fallDistance,
            color: word.isHighlighted ? highlightColor : color,
          }"
        >
          {{ word.text }}
        </span>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Word {
  text: string
  isHighlighted: boolean
  rotation: number
  delay: number
  duration: number
}

interface FallingTextProps {
  /** The text to split into falling words. Ignored if slot content is provided. */
  text?: string
  /** When to trigger the falling animation. */
  trigger?: 'auto' | 'scroll' | 'click' | 'hover'
  /** CSS font-size value (e.g. '1rem', '24px'). */
  fontSize?: string
  /** Base duration (seconds) each word takes to fall, per word a random 0-0.5s is added. */
  duration?: number
  /** How far each word falls (CSS length value, e.g. '400px', '50vh'). */
  fallDistance?: string | number
  /** Text color for non-highlighted words. */
  color?: string
  /** Words whose text starts with any of these strings will receive highlight styling. */
  highlightWords?: string[]
  /** CSS color value for highlighted words. */
  highlightColor?: string
  /** Delay (seconds) between each consecutive word's animation start. */
  staggerDelay?: number
}

const props = withDefaults(defineProps<FallingTextProps>(), {
  text: '',
  trigger: 'auto',
  fontSize: '1rem',
  duration: 1.5,
  fallDistance: '400px',
  color: 'inherit',
  highlightWords: () => [],
  highlightColor: '#00ffff',
  staggerDelay: 0.05,
})

const containerRef = ref<HTMLElement | null>(null)
const textRef = ref<HTMLElement | null>(null)
const isFalling = ref(false)

let observer: IntersectionObserver | null = null

/**
 * Split the text prop into word objects, each with a random rotation and
 * staggered animation delay so the words fall organically.
 */
const words = computed<Word[]>(() => {
  return props.text.split(' ').map((wordText, i) => ({
    text: wordText,
    isHighlighted: props.highlightWords.some((hw) => wordText.startsWith(hw)),
    rotation: (Math.random() - 0.5) * 30,
    delay: i * props.staggerDelay + Math.random() * 0.15,
    duration: props.duration + Math.random() * 0.5,
  }))
})

function startFalling(): void {
  isFalling.value = true
}

function onClick(): void {
  if (props.trigger === 'click') {
    startFalling()
  }
}

function onMouseEnter(): void {
  if (props.trigger === 'hover') {
    startFalling()
  }
}

onMounted(() => {
  if (props.trigger === 'auto') {
    startFalling()
    return
  }

  if (props.trigger === 'scroll' && containerRef.value) {
    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startFalling()
          observer?.disconnect()
        }
      },
      { threshold: 0.1 },
    )
    observer.observe(containerRef.value)
  }
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<style scoped>
/* ---------- container ---------- */
.falling-text-container {
  position: relative;
  z-index: 1;
  width: 100%;
  min-height: 1lh;
  cursor: pointer;
  text-align: center;
  padding-top: 2em;
  overflow: hidden;
  user-select: none;
}

/* ---------- text target ---------- */
.falling-text-target {
  display: inline-block;
  line-height: 1.4;
}

/* ---------- individual word ---------- */
.word {
  display: inline-block;
  margin: 0 2px;
  white-space: nowrap;

  /* Animation properties */
  animation-name: word-fall;
  animation-duration: var(--duration, 1.5s);
  animation-delay: var(--delay, 0s);
  animation-timing-function: ease-in;
  animation-fill-mode: forwards;
  animation-play-state: paused;
}

/* Activate animation when parent enters falling state */
.is-falling .word {
  animation-play-state: running;
}

/* ---------- highlighted words ---------- */
.highlighted {
  font-weight: bold;
}

/* ---------- keyframes ---------- */
@keyframes word-fall {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(var(--fall-distance, 400px)) rotate(var(--rotation, 0deg));
    opacity: 0.3;
  }
}
</style>
