<template>
  <div
    ref="containerRef"
    class="logoloop"
    :class="rootClasses"
    :style="containerStyle"
    role="region"
    :aria-label="ariaLabel"
  >
    <div
      ref="trackRef"
      class="logoloop__track"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <ul
        v-for="(_, copyIndex) in copyCount"
        :key="`copy-${copyIndex}`"
        class="logoloop__list"
        :aria-hidden="copyIndex > 0"
        :ref="copyIndex === 0 ? setSeqRef : undefined"
        role="list"
      >
        <li
          v-for="(item, itemIndex) in logos"
          :key="`${copyIndex}-${itemIndex}`"
          class="logoloop__item"
          role="listitem"
        >
          <slot name="item" :item="item" :index="itemIndex">
            <template v-if="item.src">
              <a
                v-if="item.href"
                :href="item.href"
                class="logoloop__link"
                :aria-label="getItemAriaLabel(item)"
                target="_blank"
                rel="noreferrer noopener"
              >
                <img
                  :src="item.src"
                  :alt="item.alt ?? ''"
                  :title="item.title"
                  :srcset="item.srcSet"
                  :sizes="item.sizes"
                  :width="item.width"
                  :height="item.height"
                  loading="lazy"
                  decoding="async"
                  draggable="false"
                />
              </a>
              <template v-else>
                <img
                  :src="item.src"
                  :alt="item.alt ?? ''"
                  :title="item.title"
                  :srcset="item.srcSet"
                  :sizes="item.sizes"
                  :width="item.width"
                  :height="item.height"
                  loading="lazy"
                  decoding="async"
                  draggable="false"
                />
              </template>
            </template>
          </slot>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, useSlots } from 'vue'

// ---- Types ----
export interface LogoItem {
  src?: string
  alt?: string
  href?: string
  title?: string
  srcSet?: string
  sizes?: string
  width?: number
  height?: number
  ariaLabel?: string
}

export interface LogoloopProps {
  logos: LogoItem[]
  speed?: number
  direction?: 'left' | 'right' | 'up' | 'down'
  width?: string | number
  logoHeight?: number
  gap?: number
  pauseOnHover?: boolean
  hoverSpeed?: number
  fadeOut?: boolean
  fadeOutColor?: string
  scaleOnHover?: boolean
  ariaLabel?: string
}

// ---- Props with defaults ----
const props = withDefaults(defineProps<LogoloopProps>(), {
  speed: 120,
  direction: 'left',
  width: '100%',
  logoHeight: 28,
  gap: 32,
  fadeOut: false,
  scaleOnHover: false,
  ariaLabel: 'Partner logos',
})

// ---- Constants ----
const ANIMATION_CONFIG = {
  SMOOTH_TAU: 0.25,
  MIN_COPIES: 2,
  COPY_HEADROOM: 2,
} as const

// ---- Refs ----
const containerRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const seqRef = ref<HTMLElement | null>(null)

const seqWidth = ref(0)
const seqHeight = ref(0)
const copyCount = ref<number>(ANIMATION_CONFIG.MIN_COPIES)
const isHovered = ref(false)

// ---- Computed ----
const isVertical = computed(() => props.direction === 'up' || props.direction === 'down')

const effectiveHoverSpeed = computed<number | undefined>(() => {
  if (props.hoverSpeed !== undefined) return props.hoverSpeed
  if (props.pauseOnHover === true) return 0
  if (props.pauseOnHover === false) return undefined
  return 0
})

const targetVelocity = computed(() => {
  const magnitude = Math.abs(props.speed)
  const dirMultiplier = isVertical.value
    ? (props.direction === 'up' ? 1 : -1)
    : (props.direction === 'left' ? 1 : -1)
  const speedMultiplier = props.speed < 0 ? -1 : 1
  return magnitude * dirMultiplier * speedMultiplier
})

const rootClasses = computed(() => [
  'logoloop',
  isVertical.value ? 'logoloop--vertical' : 'logoloop--horizontal',
  props.fadeOut && 'logoloop--fade',
  props.scaleOnHover && 'logoloop--scale-hover',
])

const cssVariables = computed(() => ({
  '--logoloop-gap': `${props.gap}px`,
  '--logoloop-logoHeight': `${props.logoHeight}px`,
  ...(props.fadeOutColor ? { '--logoloop-fadeColor': props.fadeOutColor } : {}),
}))

const containerStyle = computed(() => {
  const widthVal = typeof props.width === 'number' ? `${props.width}px` : props.width
  return {
    width: isVertical.value
      ? widthVal === '100%'
        ? undefined
        : widthVal
      : widthVal ?? '100%',
    ...cssVariables.value,
  }
})

// ---- Slot check ----
const slots = useSlots()
const hasItemSlot = computed(() => !!slots.item)

// ---- Handlers ----
function handleMouseEnter() {
  if (effectiveHoverSpeed.value !== undefined) isHovered.value = true
}
function handleMouseLeave() {
  if (effectiveHoverSpeed.value !== undefined) isHovered.value = false
}

function getItemAriaLabel(item: LogoItem): string {
  return item.ariaLabel || item.alt || item.title || 'logo link'
}

// ---- Dimension update ----
function updateDimensions() {
  const container = containerRef.value
  const seq = seqRef.value
  if (!container || !seq) return

  const containerWidth = container.clientWidth
  const seqRect = seq.getBoundingClientRect()
  const sw = seqRect.width
  const sh = seqRect.height

  if (isVertical.value) {
    const parentHeight = container.parentElement?.clientHeight ?? 0
    if (parentHeight > 0) {
      container.style.height = `${Math.ceil(parentHeight)}px`
    }
    if (sh > 0) {
      seqHeight.value = Math.ceil(sh)
      const viewport = container.clientHeight || parentHeight || sh
      seqHeight.value = Math.ceil(sh)
      const needed = Math.ceil(viewport / sh) + ANIMATION_CONFIG.COPY_HEADROOM
      copyCount.value = Math.max(ANIMATION_CONFIG.MIN_COPIES, needed)
    }
  } else if (sw > 0) {
    seqWidth.value = Math.ceil(sw)
    const needed = Math.ceil(containerWidth / sw) + ANIMATION_CONFIG.COPY_HEADROOM
    copyCount.value = Math.max(ANIMATION_CONFIG.MIN_COPIES, needed)
  }
}

// ---- Animation ----
let rafId: number | null = null
let lastTimestamp: number | null = null
let isAnimating = false
const offset = ref(0)
const velocity = ref(0)

function animate(timestamp: number) {
  if (!isAnimating) return

  if (lastTimestamp === null) {
    lastTimestamp = timestamp
    rafId = requestAnimationFrame(animate)
    return
  }

  const deltaTime = Math.max(0, timestamp - lastTimestamp) / 1000
  lastTimestamp = timestamp

  const target =
    isHovered.value && effectiveHoverSpeed.value !== undefined
      ? effectiveHoverSpeed.value
      : targetVelocity.value

  const easingFactor = 1 - Math.exp(-deltaTime / ANIMATION_CONFIG.SMOOTH_TAU)
  velocity.value += (target - velocity.value) * easingFactor

  const seqSize = isVertical.value ? seqHeight.value : seqWidth.value
  const trackEl = trackRef.value

  if (seqSize > 0 && trackEl) {
    let nextOffset = offset.value + velocity.value * deltaTime
    nextOffset = ((nextOffset % seqSize) + seqSize) % seqSize
    offset.value = nextOffset

    trackEl.style.transform = isVertical.value
      ? `translate3d(0, ${-offset.value}px, 0)`
      : `translate3d(${-offset.value}px, 0, 0)`
  }

  rafId = requestAnimationFrame(animate)
}

function setSeqRef(el: Element | null) {
  seqRef.value = el as HTMLElement | null
}

// ---- Lifecycle ----
let resizeObserver: ResizeObserver | null = null
let imageCleanupFns: Array<() => void> = []

onMounted(() => {
  // --- ResizeObserver ---
  if (window.ResizeObserver && containerRef.value) {
    const ro = new ResizeObserver(updateDimensions)
    resizeObserver = ro
    ro.observe(containerRef.value)
  } else {
    window.addEventListener('resize', updateDimensions)
  }
  // seqRef may need a microtask to be set (v-for ref function)
  // Use a small delay for the observer to be safe
  const seqReady = setInterval(() => {
    if (seqRef.value) {
      resizeObserver?.observe(seqRef.value)
      clearInterval(seqReady)
    }
  }, 16)

  // --- Image loading ---
  const checkImages = () => {
    const images = seqRef.value?.querySelectorAll('img') ?? []
    if (images.length === 0) {
      updateDimensions()
      return
    }

    let remaining = images.length
    const handler = () => {
      remaining -= 1
      if (remaining === 0) updateDimensions()
    }

    images.forEach((img) => {
      const htmlImg = img as HTMLImageElement
      if (htmlImg.complete) {
        handler()
      } else {
        htmlImg.addEventListener('load', handler, { once: true })
        htmlImg.addEventListener('error', handler, { once: true })
        imageCleanupFns.push(() => {
          htmlImg.removeEventListener('load', handler)
          htmlImg.removeEventListener('error', handler)
        })
      }
    })
  }

  // Give the DOM a tick to settle, then check images
  setTimeout(checkImages, 0)

  // --- Start animation ---
  isAnimating = true
  rafId = requestAnimationFrame(animate)
})

onUnmounted(() => {
  isAnimating = false
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
  lastTimestamp = null

  resizeObserver?.disconnect()
  resizeObserver = null
  window.removeEventListener('resize', updateDimensions)

  imageCleanupFns.forEach((fn) => fn())
  imageCleanupFns = []
})
</script>

<style scoped>
.logoloop {
  position: relative;
  overflow-x: hidden;

  --logoloop-gap: 32px;
  --logoloop-logoHeight: 28px;
  --logoloop-fadeColorAuto: #ffffff;
}

.logoloop--vertical {
  overflow: hidden;
  height: 100%;
  display: inline-block;
}

.logoloop--scale-hover {
  padding-top: calc(var(--logoloop-logoHeight) * 0.1);
  padding-bottom: calc(var(--logoloop-logoHeight) * 0.1);
}

@media (prefers-color-scheme: dark) {
  .logoloop {
    --logoloop-fadeColorAuto: #0b0b0b;
  }
}

.logoloop__track {
  display: flex;
  width: max-content;
  will-change: transform;
  user-select: none;
  position: relative;
  z-index: 0;
}

.logoloop--vertical .logoloop__track {
  flex-direction: column;
  height: max-content;
  width: 100%;
}

.logoloop__list {
  display: flex;
  align-items: center;
}

.logoloop--vertical .logoloop__list {
  flex-direction: column;
}

.logoloop__item {
  flex: 0 0 auto;
  margin-right: var(--logoloop-gap);
  font-size: var(--logoloop-logoHeight);
  line-height: 1;
}

.logoloop--vertical .logoloop__item {
  margin-right: 0;
  margin-bottom: var(--logoloop-gap);
}

.logoloop__item:last-child {
  margin-right: var(--logoloop-gap);
}

.logoloop--vertical .logoloop__item:last-child {
  margin-right: 0;
  margin-bottom: var(--logoloop-gap);
}

.logoloop__node {
  display: inline-flex;
  align-items: center;
}

.logoloop__item img {
  height: var(--logoloop-logoHeight);
  width: auto;
  display: block;
  object-fit: contain;
  image-rendering: -webkit-optimize-contrast;
  -webkit-user-drag: none;
  pointer-events: none;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.logoloop--scale-hover .logoloop__item {
  overflow: visible;
}

.logoloop--scale-hover .logoloop__item:hover img,
.logoloop--scale-hover .logoloop__item:hover .logoloop__node {
  transform: scale(1.2);
  transform-origin: center center;
}

.logoloop--scale-hover .logoloop__node {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.logoloop__link {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  border-radius: 4px;
  transition: opacity 0.2s ease;
}

.logoloop__link:hover {
  opacity: 0.8;
}

.logoloop__link:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

.logoloop--fade::before,
.logoloop--fade::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: clamp(24px, 8%, 120px);
  pointer-events: none;
  z-index: 10;
}

.logoloop--fade::before {
  left: 0;
  background: linear-gradient(
    to right,
    var(--logoloop-fadeColor, var(--logoloop-fadeColorAuto)) 0%,
    rgba(0, 0, 0, 0) 100%
  );
}

.logoloop--fade::after {
  right: 0;
  background: linear-gradient(
    to left,
    var(--logoloop-fadeColor, var(--logoloop-fadeColorAuto)) 0%,
    rgba(0, 0, 0, 0) 100%
  );
}

.logoloop--vertical.logoloop--fade::before,
.logoloop--vertical.logoloop--fade::after {
  left: 0;
  right: 0;
  width: 100%;
  height: clamp(24px, 8%, 120px);
}

.logoloop--vertical.logoloop--fade::before {
  top: 0;
  bottom: auto;
  background: linear-gradient(
    to bottom,
    var(--logoloop-fadeColor, var(--logoloop-fadeColorAuto)) 0%,
    rgba(0, 0, 0, 0) 100%
  );
}

.logoloop--vertical.logoloop--fade::after {
  bottom: 0;
  top: auto;
  background: linear-gradient(
    to top,
    var(--logoloop-fadeColor, var(--logoloop-fadeColorAuto)) 0%,
    rgba(0, 0, 0, 0) 100%
  );
}

@media (prefers-reduced-motion: reduce) {
  .logoloop__track {
    transform: translate3d(0, 0, 0) !important;
  }

  .logoloop__item img,
  .logoloop__node {
    transition: none !important;
  }
}
</style>
