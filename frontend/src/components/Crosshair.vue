<template>
  <div
    ref="wrapperRef"
    class="crosshair-wrapper"
    :class="{ 'crosshair-wrapper--container': container }"
  >
    <div
      class="crosshair-overlay"
      :class="{ 'crosshair-overlay--fixed': !container }"
      :style="{ zIndex }"
      aria-hidden="true"
    >
      <!-- SVG filter definitions for the noise/glitch effect on link hover -->
      <svg
        class="crosshair-svg"
        aria-hidden="true"
      >
        <defs>
          <filter :id="`${uid}-noise-x`">
            <feTurbulence
              ref="filterXRef"
              type="fractalNoise"
              baseFrequency="0.000001"
              numOctaves="1"
            />
            <feDisplacementMap
              in="SourceGraphic"
              scale="40"
            />
          </filter>
          <filter :id="`${uid}-noise-y`">
            <feTurbulence
              ref="filterYRef"
              type="fractalNoise"
              baseFrequency="0.000001"
              numOctaves="1"
            />
            <feDisplacementMap
              in="SourceGraphic"
              scale="40"
            />
          </filter>
        </defs>
      </svg>

      <!-- Crosshair lines -->
      <div
        ref="lineHRef"
        class="crosshair-line crosshair-line--h"
        :style="{ background: color }"
      />
      <div
        ref="lineVRef"
        class="crosshair-line crosshair-line--v"
        :style="{ background: color }"
      />
    </div>

    <!-- Wrapped page content -->
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  /** Line color. Accepts any CSS color value or CSS variable (e.g. `var(--primary)`) */
  color: { type: String, default: '#ffffff' },
  /** When true, the crosshair is scoped to the wrapper element instead of the full viewport */
  container: { type: Boolean, default: false },
  /** Smooth-follow interpolation factor (0-1). Lower = slower/smoother */
  lerpSpeed: { type: Number, default: 0.15 },
  /** Z-index of the crosshair overlay */
  zIndex: { type: Number, default: 10000 },
})

// Unique ID per instance so SVG filters do not collide when used multiple times on the same page
const uid = `crosshair-${Math.random().toString(36).slice(2, 8)}`

// Template refs
const wrapperRef = ref(null)
const lineHRef = ref(null)
const lineVRef = ref(null)
const filterXRef = ref(null)
const filterYRef = ref(null)

// Animation state
let mouseX = 0
let mouseY = 0
let posX = 0
let posY = 0
let rafId = null
let turbulenceRafId = null
let isActive = false
let isInside = false
let hoverStartTime = 0

// Linear interpolation
const lerp = (a, b, t) => (1 - t) * a + t * b

// ---------------------------------------------------------------------------
// Crosshair line visibility helpers
// ---------------------------------------------------------------------------

function showLines() {
  lineHRef.value?.classList.add('crosshair-line--active')
  lineVRef.value?.classList.add('crosshair-line--active')
}

function hideLines() {
  lineHRef.value?.classList.remove('crosshair-line--active')
  lineVRef.value?.classList.remove('crosshair-line--active')
}

// ---------------------------------------------------------------------------
// Render loop — smooth lerped following
// ---------------------------------------------------------------------------

function render() {
  posX = lerp(posX, mouseX, props.lerpSpeed)
  posY = lerp(posY, mouseY, props.lerpSpeed)

  if (lineHRef.value) lineHRef.value.style.transform = `translateY(${posY}px)`
  if (lineVRef.value) lineVRef.value.style.transform = `translateX(${posX}px)`

  rafId = requestAnimationFrame(render)
}

function startRender() {
  if (rafId) return
  posX = mouseX
  posY = mouseY
  rafId = requestAnimationFrame(render)
}

function stopRender() {
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
}

// ---------------------------------------------------------------------------
// Turbulence noise animation — plays on link hover
// ---------------------------------------------------------------------------

function startTurbulence() {
  if (turbulenceRafId !== null) cancelAnimationFrame(turbulenceRafId)

  // Apply SVG noise filter to the crosshair lines
  if (lineHRef.value) lineHRef.value.style.filter = `url(#${uid}-noise-x)`
  if (lineVRef.value) lineVRef.value.style.filter = `url(#${uid}-noise-y)`

  hoverStartTime = performance.now()

  function tick(now) {
    const elapsed = (now - hoverStartTime) / 500 // 500 ms settle duration
    const t = Math.min(elapsed, 1)
    const freq = t >= 1 ? '0.000001' : String(1 - t)

    filterXRef.value?.setAttribute('baseFrequency', freq)
    filterYRef.value?.setAttribute('baseFrequency', freq)

    if (t < 1) {
      turbulenceRafId = requestAnimationFrame(tick)
    } else {
      // Animation complete — remove filter
      if (lineHRef.value) lineHRef.value.style.filter = 'none'
      if (lineVRef.value) lineVRef.value.style.filter = 'none'
      filterXRef.value?.setAttribute('baseFrequency', '0.000001')
      filterYRef.value?.setAttribute('baseFrequency', '0.000001')
      turbulenceRafId = null
    }
  }

  turbulenceRafId = requestAnimationFrame(tick)
}

function stopTurbulence() {
  if (turbulenceRafId !== null) {
    cancelAnimationFrame(turbulenceRafId)
    turbulenceRafId = null
  }
  if (lineHRef.value) lineHRef.value.style.filter = 'none'
  if (lineVRef.value) lineVRef.value.style.filter = 'none'
  filterXRef.value?.setAttribute('baseFrequency', '0.000001')
  filterYRef.value?.setAttribute('baseFrequency', '0.000001')
}

// ---------------------------------------------------------------------------
// Link hover listeners
// ---------------------------------------------------------------------------

function setupLinkListeners(container) {
  const links = container.querySelectorAll('a')
  links.forEach((el) => {
    el.addEventListener('mouseenter', startTurbulence)
    el.addEventListener('mouseleave', stopTurbulence)
  })
}

function teardownLinkListeners() {
  if (!wrapperRef.value) return
  const links = wrapperRef.value.querySelectorAll('a')
  links.forEach((el) => {
    el.removeEventListener('mouseenter', startTurbulence)
    el.removeEventListener('mouseleave', stopTurbulence)
  })
}

// ---------------------------------------------------------------------------
// Main mouse move handler
// ---------------------------------------------------------------------------

function onMouseMove(e) {
  if (!wrapperRef.value) return

  const rect = wrapperRef.value.getBoundingClientRect()

  // Container-mode: hide lines when mouse leaves the wrapper
  if (props.container) {
    const inside =
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom

    if (!inside) {
      if (isActive) hideLines()
      isInside = false
      return
    }

    // Re-entered the container while crosshair was already active
    if (!isInside && isActive) showLines()
    isInside = true
  }

  // Calculate mouse position (relative to wrapper in container mode, absolute otherwise)
  mouseX = props.container ? e.clientX - rect.left : e.clientX
  mouseY = props.container ? e.clientY - rect.top : e.clientY

  // First mouse move activates the crosshair
  if (!isActive) {
    isActive = true
    showLines()
    startRender()
    setupLinkListeners(wrapperRef.value)
  }
}

// ---------------------------------------------------------------------------
// Lifecycle
// ---------------------------------------------------------------------------

onMounted(() => {
  document.addEventListener('mousemove', onMouseMove)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', onMouseMove)
  stopRender()
  stopTurbulence()
  teardownLinkListeners()
})
</script>

<style scoped>
.crosshair-wrapper {
  min-height: 1px;
}

.crosshair-wrapper--container {
  position: relative;
}

/* Overlay — sits on top of wrapped content */
.crosshair-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.crosshair-overlay--fixed {
  position: fixed;
}

/* SVG occupies the full overlay so filter references resolve */
.crosshair-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* Crosshair lines — positioned via JS transform on each frame */
.crosshair-line {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  opacity: 0;
  will-change: transform, opacity;
}

.crosshair-line--active {
  opacity: 1;
  /* Approximates GSAP Power3.easeOut */
  transition: opacity 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.crosshair-line--h {
  width: 100%;
  height: 1px;
}

.crosshair-line--v {
  width: 1px;
  height: 100%;
}
</style>
