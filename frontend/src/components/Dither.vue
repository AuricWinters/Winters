<template>
  <div
    ref="containerRef"
    class="dither-container"
    @pointermove="onPointerMove"
    @pointerleave="onPointerLeave"
  >
    <canvas ref="canvasRef" class="dither-canvas" />
    <div v-if="$slots.default" class="dither-overlay">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Dither.vue
 *
 * Animated organic wave pattern with Bayer dithering + pixelation.
 * Ported from react-bits Dither (Three.js + GLSL) to pure Canvas 2D + CSS.
 *
 * Renders a noise-driven wave field at reduced resolution (controlled by
 * pixelSize), applies Bayer ordered dithering to quantise the color palette,
 * and scales the result up with nearest-neighbour interpolation for a retro
 * pixelated look.
 *
 * No external animation libraries are used — the animation loop runs through
 * requestAnimationFrame and all rendering is done via the Canvas 2D API.
 */

import { ref, onMounted, onUnmounted, watch } from 'vue'

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
const props = withDefaults(defineProps<{
  /** Speed of the wave animation (default 0.05) */
  waveSpeed?: number
  /** Base frequency of the noise octaves (default 3) */
  waveFrequency?: number
  /** Amplitude decay per octave — lower values give smoother waves (default 0.3) */
  waveAmplitude?: number
  /** RGB colour of the wave on a black background (default [0.5, 0.5, 0.5]) */
  waveColor?: [number, number, number]
  /** Number of colour levels for posterisation — higher = more detail (default 4, min 2) */
  colorNum?: number
  /** Pixel size in CSS pixels — larger = chunkier retro look (default 2, min 1) */
  pixelSize?: number
  /** Pause the animation (default false) */
  disableAnimation?: boolean
  /** Allow mouse movement to distort the wave field (default true) */
  enableMouseInteraction?: boolean
  /** Radius of the mouse distortion effect in normalised units (default 1) */
  mouseRadius?: number
}>(), {
  waveSpeed: 0.05,
  waveFrequency: 3,
  waveAmplitude: 0.3,
  waveColor: () => [0.5, 0.5, 0.5] as [number, number, number],
  colorNum: 4,
  pixelSize: 2,
  disableAnimation: false,
  enableMouseInteraction: true,
  mouseRadius: 1,
})

// ---------------------------------------------------------------------------
// Refs
// ---------------------------------------------------------------------------
const containerRef = ref<HTMLDivElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

// ---------------------------------------------------------------------------
// Animation state
// ---------------------------------------------------------------------------
let animationId: number | null = null
let startTime = 0
let mouseX = 0
let mouseY = 0
let mouseInside = false

// Reusable offscreen canvas (avoid GC churn)
let offscreen: HTMLCanvasElement | null = null

// ---------------------------------------------------------------------------
// 2D Simplex noise — verbatim port of the Ashima Arts GLSL implementation
// used in the original react-bits shader.
// ---------------------------------------------------------------------------

function mod289(x: number): number {
  return x - Math.floor(x * (1.0 / 289.0)) * 289.0
}

function permute(x: number): number {
  return mod289(((x * 34.0) + 1.0) * x)
}

function taylorInvSqrt(r: number): number {
  return 1.79284291400159 - 0.85373472095314 * r
}

function fade(t: number): number {
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0)
}

/** 2D simplex noise returning values roughly in [-1, 1] */
function cnoise(px: number, py: number): number {
  // ---- corners ----
  const Pi0 = Math.floor(px)
  const Pi1 = Math.floor(py)
  const Pi2 = Pi0 + 1.0
  const Pi3 = Pi1 + 1.0

  const Pf0 = px - Pi0
  const Pf1 = py - Pi1
  const Pf2 = Pf0 - 1.0
  const Pf3 = Pf1 - 1.0

  // ---- permutation ----
  const mPi0 = mod289(Pi0)
  const mPi1 = mod289(Pi1)
  const mPi2 = mod289(Pi2)
  const mPi3 = mod289(Pi3)

  const ix0 = mPi0; const ix1 = mPi2; const ix2 = mPi0; const ix3 = mPi2
  const iy0 = mPi1; const iy1 = mPi1; const iy2 = mPi3; const iy3 = mPi3

  const i0 = permute(permute(ix0) + iy0)
  const i1 = permute(permute(ix1) + iy1)
  const i2 = permute(permute(ix2) + iy2)
  const i3 = permute(permute(ix3) + iy3)

  // ---- gradient vectors ----
  const gx0 = ((i0 * (1.0 / 41.0)) % 1.0) * 2.0 - 1.0
  const gx1 = ((i1 * (1.0 / 41.0)) % 1.0) * 2.0 - 1.0
  const gx2 = ((i2 * (1.0 / 41.0)) % 1.0) * 2.0 - 1.0
  const gx3 = ((i3 * (1.0 / 41.0)) % 1.0) * 2.0 - 1.0

  const gy0 = Math.abs(gx0) - 0.5
  const gy1 = Math.abs(gx1) - 0.5
  const gy2 = Math.abs(gx2) - 0.5
  const gy3 = Math.abs(gx3) - 0.5

  const tx0 = Math.floor(gx0 + 0.5)
  const tx1 = Math.floor(gx1 + 0.5)
  const tx2 = Math.floor(gx2 + 0.5)
  const tx3 = Math.floor(gx3 + 0.5)

  const gx0f = gx0 - tx0
  const gx1f = gx1 - tx1
  const gx2f = gx2 - tx2
  const gx3f = gx3 - tx3

  // ---- corner gradients ----
  const g00x = gx0f; const g00y = gy0
  const g10x = gx1f; const g10y = gy1
  const g01x = gx2f; const g01y = gy2
  const g11x = gx3f; const g11y = gy3

  const n00 = taylorInvSqrt(g00x * g00x + g00y * g00y)
  const n01 = taylorInvSqrt(g01x * g01x + g01y * g01y)
  const n10 = taylorInvSqrt(g10x * g10x + g10y * g10y)
  const n11 = taylorInvSqrt(g11x * g11x + g11y * g11y)

  const g00sx = g00x * n00; const g00sy = g00y * n00
  const g01sx = g01x * n01; const g01sy = g01y * n01
  const g10sx = g10x * n10; const g10sy = g10y * n10
  const g11sx = g11x * n11; const g11sy = g11y * n11

  // ---- dot products ----
  const fx0 = Pf0; const fx1 = Pf2; const fx2 = Pf0; const fx3 = Pf2
  const fy0 = Pf1; const fy1 = Pf1; const fy2 = Pf3; const fy3 = Pf3

  const dot00 = g00sx * fx0 + g00sy * fy0
  const dot10 = g10sx * fx1 + g10sy * fy1
  const dot01 = g01sx * fx2 + g01sy * fy2
  const dot11 = g11sx * fx3 + g11sy * fy3

  // ---- interpolation ----
  const fadeX = fade(Pf0)
  const fadeY = fade(Pf1)

  const nx0 = dot00 + (dot10 - dot00) * fadeX
  const nx1 = dot01 + (dot11 - dot01) * fadeX

  return 2.3 * (nx0 + (nx1 - nx0) * fadeY)
}

// ---------------------------------------------------------------------------
// Fractal Brownian Motion (4 octaves, matching the original)
// ---------------------------------------------------------------------------

function fbm(px: number, py: number, freq: number, amp: number): number {
  let value = 0.0
  let amplitude = 1.0
  let frequency = freq

  for (let i = 0; i < 4; i++) {
    value += amplitude * Math.abs(cnoise(px * frequency, py * frequency))
    frequency *= freq
    amplitude *= amp
  }
  return value
}

/** Domain-warped noise pattern — the core visual driver. */
function pattern(
  px: number,
  py: number,
  time: number,
  speed: number,
  freq: number,
  amp: number,
): number {
  const dx = px - time * speed
  const dy = py - time * speed
  const n = fbm(dx, dy, freq, amp)
  return fbm(px + n, py + n, freq, amp)
}

// ---------------------------------------------------------------------------
// Bayer ordered dithering (8x8 matrix, identical to the original GLSL)
// ---------------------------------------------------------------------------

const bayerMatrix = [
  0 / 64, 48 / 64, 12 / 64, 60 / 64,  3 / 64, 51 / 64, 15 / 64, 63 / 64,
  32 / 64, 16 / 64, 44 / 64, 28 / 64, 35 / 64, 19 / 64, 47 / 64, 31 / 64,
   8 / 64, 56 / 64,  4 / 64, 52 / 64, 11 / 64, 59 / 64,  7 / 64, 55 / 64,
  40 / 64, 24 / 64, 36 / 64, 20 / 64, 43 / 64, 27 / 64, 39 / 64, 23 / 64,
   2 / 64, 50 / 64, 14 / 64, 62 / 64,  1 / 64, 49 / 64, 13 / 64, 61 / 64,
  34 / 64, 18 / 64, 46 / 64, 30 / 64, 33 / 64, 17 / 64, 45 / 64, 29 / 64,
  10 / 64, 58 / 64,  6 / 64, 54 / 64,  9 / 64, 57 / 64,  5 / 64, 53 / 64,
  42 / 64, 26 / 64, 38 / 64, 22 / 64, 41 / 64, 25 / 64, 37 / 64, 21 / 64,
]

function bayerIdx(x: number, y: number): number {
  return ((y & 7) << 3) | (x & 7)
}

/**
 * Quantise a single colour channel using Bayer thresholding.
 * Matches the original GLSL dither() function exactly.
 */
function quantize(value: number, numLevels: number, threshold: number): number {
  const step = 1.0 / (numLevels - 1.0)
  value += threshold * step
  const bias = 0.2
  value = Math.max(0, Math.min(1, value - bias))
  return Math.floor(value * (numLevels - 1.0) + 0.5) / (numLevels - 1.0)
}

// ---------------------------------------------------------------------------
// Sizing
// ---------------------------------------------------------------------------

function resize(): void {
  const canvas = canvasRef.value
  const container = containerRef.value
  if (!canvas || !container) return

  const rect = container.getBoundingClientRect()
  const dpr = window.devicePixelRatio || 1
  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr
  canvas.style.width = `${rect.width}px`
  canvas.style.height = `${rect.height}px`
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

function render(): void {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const cssWidth = canvas.clientWidth
  const cssHeight = canvas.clientHeight
  if (cssWidth === 0 || cssHeight === 0) return

  const ps = Math.max(1, Math.round(props.pixelSize))
  const cn = Math.max(2, Math.round(props.colorNum))

  // Offscreen canvas at reduced resolution (the pixelation step)
  const cellW = Math.ceil(cssWidth / ps)
  const cellH = Math.ceil(cssHeight / ps)

  // Reuse offscreen canvas, resizing only when necessary
  if (!offscreen || offscreen.width !== cellW || offscreen.height !== cellH) {
    offscreen = document.createElement('canvas')
    offscreen.width = cellW
    offscreen.height = cellH
  }
  const offCtx = offscreen.getContext('2d')
  if (!offCtx) return

  // ---- Wave rendering ----
  const aspect = cssWidth / cssHeight
  const [cr, cg, cb] = props.waveColor
  const t = props.disableAnimation
    ? 0
    : (performance.now() - startTime) / 1000

  // Pre-extract for hot loop
  const sp = props.waveSpeed
  const fr = props.waveFrequency
  const am = props.waveAmplitude
  const mouseOn = props.enableMouseInteraction && mouseInside
  const mr = props.mouseRadius

  const imageData = offCtx.createImageData(cellW, cellH)
  const data = imageData.data

  for (let row = 0; row < cellH; row++) {
    for (let col = 0; col < cellW; col++) {
      // UV in shader convention: (-0.5 .. 0.5), y-up
      const u = (col * ps / cssWidth) - 0.5
      const v = 0.5 - (row * ps / cssHeight)  // flip: canvas-y-up → shader-y-up
      const uAdj = u * aspect

      // Noise-driven wave field
      let f = pattern(uAdj, v, t, sp, fr, am)

      // Mouse distortion (same math as the GLSL version)
      if (mouseOn) {
        const mu = (mouseX / cssWidth) - 0.5
        const mv = 0.5 - (mouseY / cssHeight)
        const muAdj = mu * aspect
        const dist = Math.sqrt((uAdj - muAdj) ** 2 + (v - mv) ** 2)
        const effect = 1.0 - Math.min(1, dist / mr)
        if (effect > 0) {
          f -= 0.5 * effect
        }
      }

      // Clamp to [0, 1]
      const clamped = Math.max(0, Math.min(1, f))

      // Bayer dithering + posterisation
      const thresh = bayerMatrix[bayerIdx(col, row)] - 0.25
      const q = quantize(clamped, cn, thresh)

      const idx = (row * cellW + col) * 4
      data[idx + 0] = Math.round(q * cr * 255)
      data[idx + 1] = Math.round(q * cg * 255)
      data[idx + 2] = Math.round(q * cb * 255)
      data[idx + 3] = 255
    }
  }

  offCtx.putImageData(imageData, 0, 0)

  // ---- Scale up with nearest-neighbour (retro pixelation) ----
  ctx.imageSmoothingEnabled = false
  ctx.drawImage(offscreen, 0, 0, canvas.width, canvas.height)
}

// ---------------------------------------------------------------------------
// Animation loop
// ---------------------------------------------------------------------------

function frame(): void {
  render()
  if (!props.disableAnimation) {
    animationId = requestAnimationFrame(frame)
  }
}

function startLoop(): void {
  if (animationId !== null) return
  animationId = requestAnimationFrame(frame)
}

function stopLoop(): void {
  if (animationId !== null) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
}

// ---------------------------------------------------------------------------
// Mouse handlers
// ---------------------------------------------------------------------------

function onPointerMove(e: PointerEvent): void {
  if (!props.enableMouseInteraction || !canvasRef.value) return
  const rect = canvasRef.value.getBoundingClientRect()
  mouseX = e.clientX - rect.left
  mouseY = e.clientY - rect.top
  mouseInside = true
}

function onPointerLeave(): void {
  mouseInside = false
}

// ---------------------------------------------------------------------------
// Resize observer
// ---------------------------------------------------------------------------

const resizeObserver = new ResizeObserver(() => {
  resize()
})

// ---------------------------------------------------------------------------
// Watchers
// ---------------------------------------------------------------------------

watch(() => props.disableAnimation, (disabled) => {
  if (disabled) {
    stopLoop()
  } else {
    startLoop()
  }
})

// ---------------------------------------------------------------------------
// Lifecycle
// ---------------------------------------------------------------------------

onMounted(() => {
  startTime = performance.now()
  resize()

  if (containerRef.value) {
    resizeObserver.observe(containerRef.value)
  }

  startLoop()
})

onUnmounted(() => {
  stopLoop()
  if (containerRef.value) {
    resizeObserver.unobserve(containerRef.value)
  }
})
</script>

<style scoped>
.dither-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.dither-canvas {
  display: block;
  width: 100%;
  height: 100%;
  /* Reinforce nearest-neighbour upscaling for the retro pixel look */
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}

.dither-overlay {
  position: absolute;
  inset: 0;
  /* Let pointer events pass through so mouse interaction on the canvas
     beneath is still received; overlay child elements can set their own
     pointer-events if they need interaction. */
  pointer-events: none;
}
</style>
