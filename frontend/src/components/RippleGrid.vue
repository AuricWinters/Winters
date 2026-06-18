<template>
  <div ref="containerRef" class="ripple-grid-container">
    <canvas ref="canvasRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// ── Props ──────────────────────────────────────────────────
const props = withDefaults(defineProps<{
  enableRainbow?: boolean
  gridColor?: string
  rippleIntensity?: number
  gridSize?: number
  gridThickness?: number
  fadeDistance?: number
  vignetteStrength?: number
  glowIntensity?: number
  opacity?: number
  gridRotation?: number
  mouseInteraction?: boolean
  mouseInteractionRadius?: number
}>(), {
  enableRainbow: false,
  gridColor: '#ffffff',
  rippleIntensity: 0.05,
  gridSize: 10,
  gridThickness: 15,
  fadeDistance: 1.5,
  vignetteStrength: 2.0,
  glowIntensity: 0.1,
  opacity: 1.0,
  gridRotation: 0,
  mouseInteraction: true,
  mouseInteractionRadius: 1,
})

// ── Refs ───────────────────────────────────────────────────
const containerRef = ref<HTMLDivElement>()
const canvasRef = ref<HTMLCanvasElement>()

// ── Module-level state (avoid reactivity overhead per frame) ──
let rafId = 0
let resizeObserver: ResizeObserver | null = null
const mouse = {
  current: { x: 0.5, y: 0.5 },
  target: { x: 0.5, y: 0.5 },
  influence: 0,
  targetInfluence: 0,
}
// Stored so onUnmounted can remove them
let storedContainer: HTMLDivElement | null = null
let storedOnMouseMove: ((e: MouseEvent) => void) | null = null
let storedOnMouseEnter: (() => void) | null = null
let storedOnMouseLeave: (() => void) | null = null

// ── Helpers ────────────────────────────────────────────────
function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? [
        parseInt(result[1], 16) / 255,
        parseInt(result[2], 16) / 255,
        parseInt(result[3], 16) / 255,
      ]
    : [1, 1, 1]
}

function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v
}

function getRainbowColor(u: number, v: number, t: number): [number, number, number] {
  return [
    clamp01(u * 0.5 + 0.5 * Math.sin(t) + 0.5),
    clamp01(v * 0.5 + 0.5 * Math.cos(t) + 0.5),
    clamp01(Math.pow(Math.cos(t), 4) + 0.5),
  ]
}

// ── Lifecycle ──────────────────────────────────────────────
onMounted(() => {
  const container = containerRef.value
  const canvas = canvasRef.value
  if (!container || !canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // ── ResizeObserver ──
  const handleResize = () => {
    const { width, height } = container.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio, 2)
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = width + 'px'
    canvas.style.height = height + 'px'
  }
  resizeObserver = new ResizeObserver(handleResize)
  resizeObserver.observe(container)

  // ── Mouse events ──
  storedContainer = container
  storedOnMouseMove = (e: MouseEvent) => {
    if (!props.mouseInteraction) return
    const rect = container.getBoundingClientRect()
    mouse.target.x = (e.clientX - rect.left) / rect.width
    mouse.target.y = 1.0 - (e.clientY - rect.top) / rect.height
  }
  storedOnMouseEnter = () => {
    mouse.targetInfluence = 1.0
  }
  storedOnMouseLeave = () => {
    mouse.targetInfluence = 0.0
  }

  if (props.mouseInteraction) {
    container.addEventListener('mousemove', storedOnMouseMove)
    container.addEventListener('mouseenter', storedOnMouseEnter)
    container.addEventListener('mouseleave', storedOnMouseLeave)
  }

  // ── Rendering ──
  const render = (now: number) => {
    const { width: w, height: h } = container.getBoundingClientRect()
    if (w === 0 || h === 0) {
      rafId = requestAnimationFrame(render)
      return
    }

    // Sync canvas pixel size to match CSS size * devicePixelRatio
    const dpr = Math.min(window.devicePixelRatio, 2)
    const cssW = w
    const cssH = h
    // Only reallocate if size actually changed
    if (canvas.width !== cssW * dpr || canvas.height !== cssH * dpr) {
      canvas.width = cssW * dpr
      canvas.height = cssH * dpr
      canvas.style.width = cssW + 'px'
      canvas.style.height = cssH + 'px'
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, cssW, cssH)

    const t = now * 0.001

    // Smoothed mouse
    mouse.current.x += (mouse.target.x - mouse.current.x) * 0.1
    mouse.current.y += (mouse.target.y - mouse.current.y) * 0.1
    mouse.influence += (mouse.targetInfluence - mouse.influence) * 0.05

    const numLines = Math.max(1, Math.round(props.gridSize))
    const samples = 100
    const rgb = hexToRgb(props.gridColor)

    // Mouse data in UV space (aspect-corrected)
    const mouseData = {
      active: props.mouseInteraction,
      mx: (mouse.current.x * 2 - 1) * (cssW / cssH),
      my: mouse.current.y * 2 - 1,
      influence: mouse.influence,
      radius: props.mouseInteractionRadius,
    }

    // Inverse-deform: given a point (k, l) in deformed UV space,
    // find its screen-space position by approximately inverting the ripple.
    function sampleDeformed(k: number, l: number): { x: number; y: number } {
      const d = Math.sqrt(k * k + l * l)
      const func = Math.sin(Math.PI * (t - d))
      const denom = 1 + func * props.rippleIntensity

      let u = k / denom
      let v = l / denom

      // Mouse interaction displacement (computed at original uv approx)
      if (mouseData.active && mouseData.influence > 0.01) {
        const dx = u - mouseData.mx
        const dy = v - mouseData.my
        const md = Math.sqrt(dx * dx + dy * dy)
        const inf = mouseData.influence * Math.exp(-(md * md) / (mouseData.radius * mouseData.radius))
        const mw = Math.sin(Math.PI * (t * 2.0 - md * 3.0)) * inf
        const len = Math.max(md, 0.0001)
        u += (dx / len) * mw * props.rippleIntensity * 0.3
        v += (dy / len) * mw * props.rippleIntensity * 0.3
      }

      // Inverse rotation
      if (props.gridRotation !== 0) {
        const a = (-props.gridRotation * Math.PI) / 180
        const c = Math.cos(a)
        const s = Math.sin(a)
        const ru = u * c - v * s
        const rv = u * s + v * c
        u = ru
        v = rv
      }

      // UV -> CSS pixel space
      const sx = (u / (cssW / cssH) + 1) / 2 * cssW
      const sy = (v + 1) / 2 * cssH
      return { x: sx, y: sy }
    }

    // ── Draw vertical grid lines ──
    // Vertical lines pulse: 0.8 + 0.5 * sin(pi * t)
    const vPulse = 0.8 + 0.5 * Math.sin(Math.PI * t)

    for (let i = 0; i < numLines; i++) {
      // Grid line position in deformed UV space
      const k = (2 * i - numLines + 1) / numLines

      ctx.beginPath()
      for (let s = 0; s <= samples; s++) {
        const l = -1 + (2 * s) / samples
        const p = sampleDeformed(k, l)
        s === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)
      }

      const col = props.enableRainbow ? getRainbowColor(k, 0, t) : rgb
      const alpha = clamp01(props.opacity * vPulse)
      ctx.strokeStyle = `rgba(${col[0] * 255 | 0},${col[1] * 255 | 0},${col[2] * 255 | 0},${alpha.toFixed(3)})`
      ctx.lineWidth = Math.max(0.5, props.gridThickness * vPulse)
      ctx.stroke()

      // Glow pass
      if (props.glowIntensity > 0) {
        ctx.save()
        ctx.shadowColor = ctx.strokeStyle
        ctx.shadowBlur = props.glowIntensity * 20
        ctx.strokeStyle = 'rgba(0,0,0,0)' // invisible stroke, just shadow
        ctx.lineWidth = Math.max(0.5, props.gridThickness * vPulse * 0.5)
        ctx.beginPath()
        for (let s = 0; s <= samples; s++) {
          const l = -1 + (2 * s) / samples
          const p = sampleDeformed(k, l)
          s === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)
        }
        ctx.stroke()
        ctx.restore()
      }
    }

    // ── Draw horizontal grid lines ──
    for (let i = 0; i < numLines; i++) {
      const l = (2 * i - numLines + 1) / numLines

      ctx.beginPath()
      for (let s = 0; s <= samples; s++) {
        const k = -1 + (2 * s) / samples
        const p = sampleDeformed(k, l)
        s === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)
      }

      const col = props.enableRainbow ? getRainbowColor(0, l, t) : rgb
      const alpha = clamp01(props.opacity)
      ctx.strokeStyle = `rgba(${col[0] * 255 | 0},${col[1] * 255 | 0},${col[2] * 255 | 0},${alpha.toFixed(3)})`
      ctx.lineWidth = Math.max(0.5, props.gridThickness)
      ctx.stroke()

      // Glow pass
      if (props.glowIntensity > 0) {
        ctx.save()
        ctx.shadowColor = ctx.strokeStyle
        ctx.shadowBlur = props.glowIntensity * 20
        ctx.strokeStyle = 'rgba(0,0,0,0)'
        ctx.lineWidth = Math.max(0.5, props.gridThickness * 0.5)
        ctx.beginPath()
        for (let s = 0; s <= samples; s++) {
          const k = -1 + (2 * s) / samples
          const p = sampleDeformed(k, l)
          s === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)
        }
        ctx.stroke()
        ctx.restore()
      }
    }

    // ── Vignette + fade overlay ──
    const cx = cssW / 2
    const cy = cssH / 2
    const maxR = Math.sqrt(cx * cx + cy * cy)

    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR)
    const stops = 24
    for (let i = 0; i <= stops; i++) {
      const frac = i / stops
      // Sample at this fraction along the diagonal (center -> corner)
      const px = frac * cx
      const py = frac * cy

      // Fade: based on UV-space distance from center (aspect-corrected)
      let uu = (px / cssW) * 2 - 1
      let vv = (py / cssH) * 2 - 1
      uu *= cssW / cssH
      const uvDist = Math.sqrt(uu * uu + vv * vv)
      const ddd = Math.exp(-2.0 * Math.min(Math.pow(uvDist, props.fadeDistance), 1.0))

      // Vignette: based on screen-space distance from center
      const vDist = Math.sqrt((px / cssW - 0.5) ** 2 + (py / cssH - 0.5) ** 2) * 2
      const vig = clamp01(1.0 - Math.pow(vDist, props.vignetteStrength))

      const combinedFade = ddd * vig
      grad.addColorStop(frac, `rgba(0,0,0,${(1 - combinedFade).toFixed(4)})`)
    }
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, cssW, cssH)

    rafId = requestAnimationFrame(render)
  }

  rafId = requestAnimationFrame(render)
})

onUnmounted(() => {
  cancelAnimationFrame(rafId)
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
  if (storedContainer && props.mouseInteraction) {
    if (storedOnMouseMove) storedContainer.removeEventListener('mousemove', storedOnMouseMove)
    if (storedOnMouseEnter) storedContainer.removeEventListener('mouseenter', storedOnMouseEnter)
    if (storedOnMouseLeave) storedContainer.removeEventListener('mouseleave', storedOnMouseLeave)
  }
  storedContainer = null
  storedOnMouseMove = null
  storedOnMouseEnter = null
  storedOnMouseLeave = null
})
</script>

<style scoped>
.ripple-grid-container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}
.ripple-grid-container canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
