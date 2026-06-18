<template>
  <div
    ref="containerRef"
    class="lightfall-container"
    :style="containerStyle"
  >
    <canvas ref="canvasRef" />
  </div>
</template>

<script setup lang="ts">
/**
 * Lightfall.vue — Vue 3 Canvas 2D port of the Lightfall shader background.
 *
 * Renders flowing, colorful light streaks on a dark glowing background with
 * mouse interaction.  Self-contained Composition API SFC using only Canvas 2D
 * (no WebGL / Three.js / OGL).
 */
import { ref, computed, onMounted, onBeforeUnmount, type CSSProperties } from 'vue'

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface RGB {
  r: number
  g: number
  b: number
}

interface StreakParticle {
  /** Normalised x [0,1] */
  x: number
  /** Normalised y [0,1]  (0 = top) */
  y: number
  /** Colour sampled from palette */
  color: RGB
  /** Hue offset for palette variation */
  hueOffset: number
  /** Vertical speed (px / sec, scaled) */
  speed: number
  /** Horizontal drift speed */
  drift: number
  /** Trail length in number of stored positions */
  trailLen: number
  /** Normalised trail width [0,1] */
  width: number
  /** Phase offset for twinkle / oscillation */
  phase: number
  /** Recent trail positions (normalised) */
  trail: { x: number; y: number }[]
}

const props = withDefaults(
  defineProps<{
    colors?: string[]
    backgroundColor?: string
    /** Master speed multiplier */
    speed?: number
    /** Number of streak groups (affects particle count) */
    streakCount?: number
    /** Base streak width multiplier */
    streakWidth?: number
    /** Trail length multiplier */
    streakLength?: number
    /** Overall glow multiplier */
    glow?: number
    /** Particle density multiplier */
    density?: number
    /** Twinkle intensity [0-1] */
    twinkle?: number
    /** Unused in Canvas 2D — kept for API compat */
    zoom?: number
    /** Background glow intensity [0-1] */
    backgroundGlow?: number
    /** Global opacity [0-1] */
    opacity?: number
    /** Enable mouse interaction */
    mouseInteraction?: boolean
    /** Strength of mouse glow */
    mouseStrength?: number
    /** Radius of mouse glow (normalised) */
    mouseRadius?: number
    /** Smoothing factor for mouse follow (seconds) */
    mouseDampening?: number
    /** CSS mix-blend-mode for the container */
    mixBlendMode?: string
  }>(),
  {
    colors: () => ['#A6C8FF', '#5227FF', '#FF9FFC'],
    backgroundColor: '#0A29FF',
    speed: 0.5,
    streakCount: 2,
    streakWidth: 1,
    streakLength: 1,
    glow: 1,
    density: 0.6,
    twinkle: 1,
    zoom: 3,
    backgroundGlow: 0.5,
    opacity: 1,
    mouseInteraction: true,
    mouseStrength: 0.5,
    mouseRadius: 1,
    mouseDampening: 0.15,
  },
)

/* ------------------------------------------------------------------ */
/*  Template refs                                                      */
/* ------------------------------------------------------------------ */

const containerRef = ref<HTMLDivElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

const containerStyle = computed<CSSProperties>(() => ({
  ...(props.mixBlendMode ? { mixBlendMode: props.mixBlendMode as CSSProperties['mixBlendMode'] } : {}),
}))

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function hexToRgb(hex: string): RGB {
  const c = hex.replace('#', '').padEnd(6, '0')
  return {
    r: parseInt(c.slice(0, 2), 16) / 255,
    g: parseInt(c.slice(2, 4), 16) / 255,
    b: parseInt(c.slice(4, 6), 16) / 255,
  }
}

/** Build a flat colour array (always 8 entries, last colour repeated) and return count. */
function prepColors(input: string[]): { arr: RGB[]; count: number } {
  const base = input.length > 0 ? input.slice(0, 8) : ['#A6C8FF', '#5227FF', '#FF9FFC']
  const count = base.length
  const arr: RGB[] = []
  for (let i = 0; i < 8; i++) {
    arr.push(hexToRgb(base[Math.min(i, base.length - 1)]))
  }
  return { arr, count }
}

/** Non-negative modulo (GLSL fract equivalent for positive numbers). */
function fract(v: number): number {
  return v - Math.floor(v)
}

/** Pseudo-random in [0,1) from a vec2 seed. */
function hash2(x: number, y: number): number {
  return fract(Math.sin(x * 127.1 + y * 311.7) * 43758.5453123)
}

/* ------------------------------------------------------------------ */
/*  State                                                              */
/* ------------------------------------------------------------------ */

let W = 0
let H = 0
let dpr = 1

/** Smooth mouse position (canvas-space pixels). */
const curMouse = { x: 0, y: 0 }
/** Raw target mouse position. */
const tgtMouse = { x: 0, y: 0 }

let particles: StreakParticle[] = []
let colorArr: RGB[] = []
let colorCount = 0
let bgRGB: RGB = { r: 0, g: 0, b: 0 }

let animId = 0
let lastTime = 0
let ro: ResizeObserver | null = null

/* ------------------------------------------------------------------ */
/*  Streak initialisation                                              */
/* ------------------------------------------------------------------ */

function rebuildParticles(): void {
  const count = Math.max(1, Math.min(16, Math.round(props.streakCount)))
  const density = Math.max(0.05, props.density)
  const partsPerGroup = Math.round(30 * density)
  const total = count * partsPerGroup

  const { arr, count: cc } = prepColors(props.colors)
  colorArr = arr
  colorCount = cc

  bgRGB = hexToRgb(props.backgroundColor)

  particles = []

  for (let g = 0; g < count; g++) {
    for (let i = 0; i < partsPerGroup; i++) {
      const idx = g % colorCount
      const color = arr[idx]
      const phase = hash2(g * 100 + i, 42) * Math.PI * 2
      const hueOffset = (g / count) * 0.5

      particles.push({
        x: hash2(g * 100 + i, 0),
        y: hash2(g * 100 + i, 99),
        color,
        hueOffset,
        speed: (0.3 + hash2(g * 100 + i, 1) * 0.7) * props.speed,
        drift: (hash2(g * 100 + i, 2) - 0.5) * 0.15 * props.speed,
        trailLen: Math.round(20 + hash2(g * 100 + i, 3) * 60 * props.streakLength),
        width: (0.3 + hash2(g * 100 + i, 4) * 0.7) * props.streakWidth,
        phase,
        trail: [],
      })
    }
  }
}

/* ------------------------------------------------------------------ */
/*  Rendering                                                          */
/* ------------------------------------------------------------------ */

function drawBackground(ctx: CanvasRenderingContext2D): void {
  // Dark base
  const bgGlow = Math.max(0, Math.min(1, props.backgroundGlow))
  const baseR = Math.round(bgRGB.r * 255 * (1 - bgGlow * 0.7))
  const baseG = Math.round(bgRGB.g * 255 * (1 - bgGlow * 0.7))
  const baseB = Math.round(bgRGB.b * 255 * (1 - bgGlow * 0.7))
  ctx.fillStyle = `rgb(${baseR},${baseG},${baseB})`
  ctx.fillRect(0, 0, W, H)

  if (bgGlow > 0.01) {
    // Central glow
    const cx = W / 2
    const cy = H / 2
    const r = Math.max(W, H) * 0.8
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
    const glowStr = Math.min(1, bgGlow * 2)
    grad.addColorStop(0, `rgba(${Math.round(bgRGB.r * 255)},${Math.round(bgRGB.g * 255)},${Math.round(bgRGB.b * 255)},${glowStr * 0.6})`)
    grad.addColorStop(0.4, `rgba(${Math.round(bgRGB.r * 255)},${Math.round(bgRGB.g * 255)},${Math.round(bgRGB.b * 255)},${glowStr * 0.2})`)
    grad.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, W, H)
  }
}

function drawMouseGlow(ctx: CanvasRenderingContext2D, t: number): void {
  if (!props.mouseInteraction || props.mouseStrength < 0.01) return

  const ms = W * props.mouseStrength * 0.15
  const mr = Math.max(W, H) * Math.max(0.05, props.mouseRadius) * 0.5

  if (ms < 0.1) return

  // Animated colourful radial glow
  const pulse = 0.85 + 0.15 * Math.sin(t * 0.5 + 1.2)
  const grad = ctx.createRadialGradient(curMouse.x, curMouse.y, 0, curMouse.x, curMouse.y, mr)
  const ci = Math.floor(t * 0.3) % colorCount
  const c = colorArr[ci >= 0 && ci < colorCount ? ci : 0]
  const alpha = Math.min(1, ms * pulse)
  grad.addColorStop(0, `rgba(${Math.round(c.r * 255)},${Math.round(c.g * 255)},${Math.round(c.b * 255)},${alpha * 0.35})`)
  grad.addColorStop(0.5, `rgba(${Math.round(c.r * 255)},${Math.round(c.g * 255)},${Math.round(c.b * 255)},${alpha * 0.1})`)
  grad.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, W, H)
}

function updateParticles(dt: number): void {
  const speedMul = props.speed * 60 // normalise to ~60 fps feel
  const twinkleMul = Math.max(0, props.twinkle)
  const glowMul = Math.max(0, props.glow)
  const partSpeed = (W / 1000) * speedMul * 0.3

  for (const p of particles) {
    // Store trail
    p.trail.push({ x: p.x, y: p.y })
    if (p.trail.length > p.trailLen) {
      p.trail.shift()
    }

    // Move
    p.y += p.speed * partSpeed * dt
    p.x += p.drift * partSpeed * dt * 0.3

    // Horizontal oscillation
    p.x += Math.sin(p.phase + lastTime * p.speed * 0.5) * 0.002 * props.speed

    // Wrap Y
    if (p.y > 1.2) {
      p.y = -0.2
      p.x = hash2(Math.round(p.x * 10000), Math.round(lastTime * 10)) // new random-ish x
      p.trail = []
    }

    // Wrap X
    if (p.x > 1.2) p.x = -0.2
    if (p.x < -0.2) p.x = 1.2
  }

  // Mouse dampening
  if (props.mouseDampening > 0.01) {
    const tau = Math.max(1e-4, props.mouseDampening)
    const factor = 1 - Math.exp(-dt / tau)
    curMouse.x += (tgtMouse.x - curMouse.x) * Math.min(1, factor)
    curMouse.y += (tgtMouse.y - curMouse.y) * Math.min(1, factor)
  } else {
    curMouse.x = tgtMouse.x
    curMouse.y = tgtMouse.y
  }
}

function drawStreaks(ctx: CanvasRenderingContext2D, t: number): void {
  const tw = Math.max(0, props.twinkle)
  const gw = Math.max(0, props.glow)
  const globAlpha = Math.max(0, Math.min(1, props.opacity))
  const mouseR = Math.max(W, H) * Math.max(0.05, props.mouseRadius) * 0.5

  ctx.save()
  ctx.globalAlpha = globAlpha

  for (const p of particles) {
    const trail = p.trail
    if (trail.length < 2) continue

    // Twinkle: brightness modulation
    const twinkleVal = 0.6 + 0.4 * (0.5 + 0.5 * Math.sin(t * props.speed * 2 + p.phase))
    const brightness = gw * (0.5 + 0.5 * twinkleVal * (1 + tw * 2))

    // Mouse distance factor
    let mouseFactor = 1
    if (props.mouseInteraction && props.mouseStrength > 0.01) {
      const mx = p.x * W
      const my = p.y * H
      const dx = mx - curMouse.x
      const dy = my - curMouse.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < mouseR) {
        mouseFactor = 1 + (1 - dist / mouseR) * props.mouseStrength * 4
      }
    }

    const finalBright = Math.min(4, brightness * mouseFactor)
    if (finalBright < 0.01) continue

    const baseW = Math.max(0.5, p.width * 4 * props.streakWidth)

    // Draw as a series of connected segments with decreasing opacity towards the tail
    const len = trail.length
    const r = Math.round(p.color.r * 255 * finalBright)
    const g = Math.round(p.color.g * 255 * finalBright)
    const b = Math.round(p.color.b * 255 * finalBright)

    ctx.beginPath()
    ctx.moveTo(trail[0].x * W, trail[0].y * H)

    for (let i = 1; i < len; i++) {
      ctx.lineTo(trail[i].x * W, trail[i].y * H)
    }

    // Fade from head to tail
    const headAlpha = Math.min(1, finalBright * 0.8)
    const tailAlpha = 0
    ctx.strokeStyle = `rgba(${r},${g},${b},${headAlpha})`
    ctx.lineWidth = baseW
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.stroke()

    // Glow layer (wider, more transparent)
    if (gw > 0.3) {
      ctx.strokeStyle = `rgba(${r},${g},${b},${headAlpha * 0.15 * gw})`
      ctx.lineWidth = baseW * 4
      ctx.stroke()
    }
  }

  ctx.restore()
}

function render(ctx: CanvasRenderingContext2D, t: number): void {
  const dt = lastTime ? (t - lastTime) / 1000 : 0.016
  lastTime = t

  W = ctx.canvas.width
  H = ctx.canvas.height

  updateParticles(dt)

  drawBackground(ctx)
  drawStreaks(ctx, t * 0.001)
  drawMouseGlow(ctx, t * 0.001)
}

/* ------------------------------------------------------------------ */
/*  Lifecycle                                                          */
/* ------------------------------------------------------------------ */

function setup(): void {
  const container = containerRef.value
  const canvas = canvasRef.value
  if (!container || !canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  dpr = window.devicePixelRatio || 1

  rebuildParticles()

  function resize(): void {
    const rect = container.getBoundingClientRect()
    W = rect.width
    H = rect.height
    canvas.width = W * dpr
    canvas.height = H * dpr
    canvas.style.width = `${W}px`
    canvas.style.height = `${H}px`
    ctx.scale(dpr, dpr)
    // Re-draw to avoid flash
    render(ctx, performance.now())
  }

  resize()
  ro = new ResizeObserver(resize)
  ro.observe(container)

  // Mouse
  const onPointer = (e: PointerEvent): void => {
    const rect = canvas.getBoundingClientRect()
    tgtMouse.x = (e.clientX - rect.left) * (W / rect.width)
    tgtMouse.y = (e.clientY - rect.top) * (H / rect.height)
  }
  if (props.mouseInteraction) {
    canvas.addEventListener('pointermove', onPointer)
  }

  // Animation loop
  function loop(now: number): void {
    animId = requestAnimationFrame(loop)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    render(ctx, now)
  }
  animId = requestAnimationFrame(loop)

  // Cleanup function returned to onBeforeUnmount
  const clean = (): void => {
    cancelAnimationFrame(animId)
    if (ro) ro.disconnect()
    canvas.removeEventListener('pointermove', onPointer)
  }
  onBeforeUnmount(clean)
}

onMounted(setup)
</script>

<style scoped>
.lightfall-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.lightfall-container canvas {
  display: block;
}
</style>
