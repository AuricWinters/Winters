<template>
  <div
    ref="containerRef"
    class="text-cursor-container"
    :style="{ '--exit-duration': exitDuration + 's' }"
    @mousemove="onMouseMove"
  >
    <slot />
    <div class="text-cursor-inner">
      <TransitionGroup name="cursor" tag="div" class="text-cursor-group">
        <div
          v-for="item in trail"
          :key="item.id"
          class="text-cursor-item"
          :class="{ floating: randomFloat }"
          :style="itemStyle(item)"
        >
          {{ text }}
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * TextCursor.vue
 *
 * Replicates the Framer Motion mouse-trail text effect from react-bits
 * using pure CSS and the Vue 3 Composition API — no external animation
 * library required.
 *
 * As the pointer moves across the container, copies of `text` are placed
 * along the path at `spacing`-pixel intervals.  Each item can optionally
 * rotate to follow the mouse direction and/or bob with a subtle random
 * floating animation.  Trail items fade-and-shrink out when the pointer
 * stops or when the trail exceeds `maxPoints`.
 *
 * Two usage modes:
 *   1. <TextCursor text="*" />
 *      -- renders the cursor trail characters directly.
 *   2. <TextCursor text="*">…content…</TextCursor>
 *      -- wraps arbitrary children; the trail follows the pointer across
 *         the entire container area.
 */

import { ref, onMounted, onUnmounted } from 'vue'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface TrailItem {
  id: number
  x: number
  y: number
  angle: number
  randomX?: number
  randomY?: number
  randomRotate?: number
}

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface TextCursorProps {
  /** Character(s) displayed at each trail point. */
  text?: string
  /** Minimum distance (px) between consecutive trail points. */
  spacing?: number
  /** When true, each item rotates to face the direction of mouse travel. */
  followMouseDirection?: boolean
  /** When true, each item gently bobs with a random offset. */
  randomFloat?: boolean
  /** Duration (seconds) of the exit fade-and-shrink transition. */
  exitDuration?: number
  /** Interval (ms) at which stale trail items are removed. */
  removalInterval?: number
  /** Maximum number of trail items visible at once. */
  maxPoints?: number
}

const props = withDefaults(defineProps<TextCursorProps>(), {
  text: '⚛️',
  spacing: 100,
  followMouseDirection: true,
  randomFloat: true,
  exitDuration: 0.5,
  removalInterval: 30,
  maxPoints: 5,
})

/* ------------------------------------------------------------------ */
/*  Internal state                                                     */
/* ------------------------------------------------------------------ */

const containerRef = ref<HTMLDivElement | null>(null)
const trail = ref<TrailItem[]>([])

let idCounter = 0
let lastMoveTime = Date.now()
let removalTimer: ReturnType<typeof setInterval> | null = null

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function randomOffset() {
  if (!props.randomFloat) return {}
  return {
    randomX: Math.random() * 10 - 5,
    randomY: Math.random() * 10 - 5,
    randomRotate: Math.random() * 10 - 5,
  }
}

/** Merge a new mouse position into the trail. */
function addTrailPoint(current: TrailItem[], mx: number, my: number): TrailItem[] {
  const next = [...current]

  if (next.length === 0) {
    next.push({ id: idCounter++, x: mx, y: my, angle: 0, ...randomOffset() })
    return next
  }

  const last = next[next.length - 1]
  const dx = mx - last.x
  const dy = my - last.y
  const dist = Math.hypot(dx, dy)

  if (dist < props.spacing) return next

  const rawAngle = (Math.atan2(dy, dx) * 180) / Math.PI
  const angle = props.followMouseDirection ? rawAngle : 0
  const steps = Math.floor(dist / props.spacing)

  for (let i = 1; i <= steps; i++) {
    const t = (props.spacing * i) / dist
    next.push({
      id: idCounter++,
      x: last.x + dx * t,
      y: last.y + dy * t,
      angle,
      ...randomOffset(),
    })
  }

  if (next.length > props.maxPoints) {
    return next.slice(next.length - props.maxPoints)
  }
  return next
}

/** Build inline style for a single trail item. */
function itemStyle(item: TrailItem): Record<string, string> {
  return {
    left: `${item.x}px`,
    top: `${item.y}px`,
    '--angle': `${item.angle}deg`,
    '--rx': `${item.randomX ?? 0}px`,
    '--ry': `${item.randomY ?? 0}px`,
    '--rrotate': `${item.randomRotate ?? 0}deg`,
  }
}

/* ------------------------------------------------------------------ */
/*  Event handler                                                      */
/* ------------------------------------------------------------------ */

function onMouseMove(e: MouseEvent) {
  const container = containerRef.value
  if (!container) return

  const rect = container.getBoundingClientRect()
  trail.value = addTrailPoint(trail.value, e.clientX - rect.left, e.clientY - rect.top)
  lastMoveTime = Date.now()
}

/* ------------------------------------------------------------------ */
/*  Lifecycle                                                          */
/* ------------------------------------------------------------------ */

onMounted(() => {
  removalTimer = setInterval(() => {
    if (Date.now() - lastMoveTime > 100 && trail.value.length > 0) {
      trail.value = trail.value.slice(1)
    }
  }, props.removalInterval)
})

onUnmounted(() => {
  if (removalTimer !== null) clearInterval(removalTimer)
})
</script>

<style scoped>
/* ------------------------------------------------------------------ */
/*  Container                                                          */
/* ------------------------------------------------------------------ */
.text-cursor-container {
  position: relative;
  width: 100%;
  height: 100%;
}

/* ------------------------------------------------------------------ */
/*  Inner overlay — tracks mouse but does not block interactions       */
/* ------------------------------------------------------------------ */
.text-cursor-inner {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.text-cursor-group {
  position: relative;
  width: 100%;
  height: 100%;
}

/* ------------------------------------------------------------------ */
/*  Individual trail item                                              */
/* ------------------------------------------------------------------ */
.text-cursor-item {
  position: absolute;
  user-select: none;
  white-space: nowrap;
  font-size: 1.875rem;
  transform: rotate(var(--angle));
  opacity: 1;
  will-change: transform, opacity;
}

/* ------------------------------------------------------------------ */
/*  Floating animation (optional)                                      */
/* ------------------------------------------------------------------ */
.text-cursor-item.floating {
  animation: cursor-float 2s ease-in-out infinite;
}

/* ------------------------------------------------------------------ */
/*  TransitionGroup enter / leave                                      */
/* ------------------------------------------------------------------ */
.cursor-enter-active {
  transition: opacity 0.3s ease-out;
}

.cursor-enter-from {
  opacity: 0;
}

.cursor-leave-active {
  /* Override the floating animation while leaving */
  animation: none !important;
  transition:
    opacity var(--exit-duration, 0.5s) ease-in,
    transform var(--exit-duration, 0.5s) ease-in;
}

.cursor-leave-to {
  opacity: 0;
  transform: scale(0) rotate(var(--angle));
}

/* ------------------------------------------------------------------ */
/*  Keyframes                                                          */
/* ------------------------------------------------------------------ */
@keyframes cursor-float {
  0%,
  100% {
    transform: translate(0, 0) rotate(var(--angle));
  }
  50% {
    transform: translate(var(--rx), var(--ry))
      rotate(calc(var(--angle) + var(--rrotate)));
  }
}
</style>
