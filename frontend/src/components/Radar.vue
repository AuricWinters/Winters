<template>
  <div ref="containerRef" class="radar-container">
    <canvas ref="canvasRef" class="radar-canvas" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

interface RadarProps {
  speed?: number
  scale?: number
  ringCount?: number
  spokeCount?: number
  ringThickness?: number
  spokeThickness?: number
  sweepSpeed?: number
  sweepWidth?: number
  sweepLobes?: number
  color?: string
  backgroundColor?: string
  falloff?: number
  brightness?: number
  enableMouseInteraction?: boolean
  mouseInfluence?: number
}

const props = withDefaults(defineProps<RadarProps>(), {
  speed: 1.0,
  scale: 0.5,
  ringCount: 10,
  spokeCount: 10,
  ringThickness: 0.05,
  spokeThickness: 0.01,
  sweepSpeed: 1.0,
  sweepWidth: 2.0,
  sweepLobes: 1,
  color: '#9f29ff',
  backgroundColor: '#000000',
  falloff: 2.0,
  brightness: 1.0,
  enableMouseInteraction: true,
  mouseInfluence: 0.1,
})

const containerRef = ref<HTMLDivElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

let animationId = 0
let startTime = 0
let resizeObserver: ResizeObserver | null = null

/** Current (lerped) mouse position in normalized [0,1] space */
let curMouseX = 0.5
let curMouseY = 0.5
/** Target mouse position toward which we lerp */
let tgtMouseX = 0.5
let tgtMouseY = 0.5

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ]
}

/** Hermite smoothstep — matches the GLSL built-in. */
function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

// ---------------------------------------------------------------------------
// Main render loop
// ---------------------------------------------------------------------------

function draw(timestamp: number): void {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const w = canvas.width
  const h = canvas.height
  if (w === 0 || h === 0) {
    animationId = requestAnimationFrame(draw)
    return
  }

  const [r, g, b] = hexToRgb(props.color)
  const [bgR, bgG, bgB] = hexToRgb(props.backgroundColor)
  const TAU = Math.PI * 2
  const time = ((timestamp - startTime) / 1000) * props.speed
  const half = Math.min(w, h) / 2
  const s = half * props.scale // pixel radius of the radar

  // --- Smooth mouse interpolation (exponential moving average) ---
  if (props.enableMouseInteraction) {
    curMouseX += 0.05 * (tgtMouseX - curMouseX)
    curMouseY += 0.05 * (tgtMouseY - curMouseY)
  }

  // --- Clear to background ---
  ctx.fillStyle = props.backgroundColor
  ctx.fillRect(0, 0, w, h)

  ctx.save()

  // Move origin to center
  const cx = w / 2
  const cy = h / 2
  ctx.translate(cx, cy)

  // Mouse parallax shift (applied in pixel space, matching the NDC concept)
  if (props.enableMouseInteraction) {
    const mx = (curMouseX * 2 - 1) * props.mouseInfluence * s
    const my = -(curMouseY * 2 - 1) * props.mouseInfluence * s
    ctx.translate(mx, my)
  }

  // --------------------------------------------------
  // 1. Sweep beam  (draw with additive-like blending)
  // --------------------------------------------------
  const sweepPhase = time * props.sweepSpeed
  const beamSteps = 360

  for (let i = 0; i < beamSteps; i++) {
    const a0 = (i / beamSteps) * TAU
    const a1 = ((i + 1) / beamSteps) * TAU
    const mid = ((i + 0.5) / beamSteps) * TAU

    // GLSL: pow(max(0.5 * sin(lobes * theta + phase) + 0.5, 0.0), sweepWidth)
    const beamVal = Math.pow(
      Math.max(0.5 * Math.sin(props.sweepLobes * mid + sweepPhase) + 0.5, 0),
      props.sweepWidth,
    )

    if (beamVal < 0.005) continue

    const alpha = Math.min(beamVal * props.brightness * 0.3, 1)

    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.arc(0, 0, s, a0, a1)
    ctx.closePath()
    ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`
    ctx.fill()
  }

  // --------------------------------------------------
  // 2. Spokes (radial lines with gradient along length)
  // --------------------------------------------------
  for (let i = 0; i < props.spokeCount; i++) {
    const angle = (i / props.spokeCount) * TAU
    const dx = Math.cos(angle)
    const dy = Math.sin(angle)

    // The shader peaks spoke glow at dist ~0.1 then falls off
    const grad = ctx.createLinearGradient(0, 0, dx * s, dy * s)
    grad.addColorStop(0, `rgba(${r},${g},${b},0)`)
    grad.addColorStop(0.1, `rgba(${r},${g},${b},${props.brightness * 0.5})`)
    grad.addColorStop(0.5, `rgba(${r},${g},${b},${props.brightness * 0.25})`)
    grad.addColorStop(1, `rgba(${r},${g},${b},${props.brightness * 0.08})`)

    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(dx * s, dy * s)
    ctx.strokeStyle = grad
    ctx.lineWidth = 1.5
    ctx.stroke()
  }

  // --------------------------------------------------
  // 3. Rings  (evaluate ring glow at every pixel radius
  //    with additive blending to approximate shader glow)
  // --------------------------------------------------
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'

  // Evaluate at every 2 px for good performance / quality trade-off
  for (let px = 0; px <= s; px += 2) {
    const dist = px / s
    if (dist > 1.05) break

    // GLSL: ringPhase = dist * ringCount - time
    const phase = dist * props.ringCount - time
    const fracPhase = phase - Math.floor(phase) // fract()
    const ringDist = Math.abs(fracPhase - 0.5)

    // GLSL: ringGlow = 1.0 - smoothstep(0, ringThickness, ringDist)
    const ringGlow = 1.0 - smoothstep(0, props.ringThickness, ringDist)
    if (ringGlow < 0.01) continue

    ctx.beginPath()
    ctx.arc(0, 0, px, 0, TAU)
    ctx.strokeStyle = `rgba(${r},${g},${b},${ringGlow * props.brightness})`
    ctx.lineWidth = 1
    ctx.stroke()
  }

  ctx.restore() // back to normal composite

  // --------------------------------------------------
  // 4. Edge falloff (radial gradient overlay)
  //    GLSL: fade = smoothstep(1.05, 0.85, dist) * pow(max(1-dist,0), falloff)
  // --------------------------------------------------
  const fadeR = s * 1.2 // outer radius of the fade overlay

  if (props.falloff > 0 && fadeR > 0) {
    // Approximate the power falloff with a multi-step gradient
    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, fadeR)

    // Build color stops that approximate pow(max(1-dist,0), falloff)
    // We place stops at 85%, 95%, and 100% of the fade radius
    const stops: [number, number, number, number][] = []
    for (let t = 0; t <= 1; t += 0.05) {
      const dist = t * (fadeR / s) // normalized distance
      if (dist < 0.85) {
        stops.push([t, bgR, bgG, 0])
        continue
      }
      // smoothstep(1.05, 0.85, dist) goes 1→0 from dist 0.85→1.05
      const inner = smoothstep(1.05, 0.85, dist)
      // pow(max(1-dist, 0), falloff)
      const power = Math.pow(Math.max(1 - dist, 0), props.falloff)
      const fade = inner * power
      const alpha = (1 - fade) * 1.0 // fade=1 → transparent, fade=0 → full bg
      stops.push([t, bgR, bgG, Math.round(alpha * 255)])
    }

    for (const [pos, cr, cg, ca] of stops) {
      grad.addColorStop(
        pos,
        ca === 0 ? 'transparent' : `rgba(${cr},${cg},${b},${(ca / 255).toFixed(3)})`,
      )
    }

    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.arc(0, 0, fadeR, 0, TAU)
    ctx.fill()
  }

  ctx.restore() // pop the initial center translation

  // Continue loop
  animationId = requestAnimationFrame(draw)
}

// ---------------------------------------------------------------------------
// Resize handling
// ---------------------------------------------------------------------------

function handleResize(): void {
  const canvas = canvasRef.value
  if (!canvas) return
  const parent = canvas.parentElement
  if (!parent) return
  const { width, height } = parent.getBoundingClientRect()
  canvas.width = width
  canvas.height = height
}

// ---------------------------------------------------------------------------
// Mouse handling
// ---------------------------------------------------------------------------

function handleMouseMove(e: MouseEvent): void {
  const canvas = canvasRef.value
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  tgtMouseX = (e.clientX - rect.left) / rect.width
  tgtMouseY = 1.0 - (e.clientY - rect.top) / rect.height
}

function handleMouseLeave(): void {
  tgtMouseX = 0.5
  tgtMouseY = 0.5
}

// ---------------------------------------------------------------------------
// Lifecycle
// ---------------------------------------------------------------------------

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return

  handleResize()

  const parent = canvas.parentElement
  if (parent) {
    resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(parent)
  }

  if (props.enableMouseInteraction) {
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', handleMouseLeave)
  }

  startTime = performance.now()
  animationId = requestAnimationFrame(draw)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animationId)
  resizeObserver?.disconnect()
  const canvas = canvasRef.value
  if (canvas) {
    if (props.enableMouseInteraction) {
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
    }
  }
})
</script>

<style scoped>
.radar-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.radar-canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
