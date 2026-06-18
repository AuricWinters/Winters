<template>
  <canvas ref="canvasRef" class="lightning-container" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

/* ========== Props ========== */

const props = withDefaults(
  defineProps<{
    hue?: number
    xOffset?: number
    speed?: number
    intensity?: number
    size?: number
    resolutionScale?: number
  }>(),
  {
    hue: 230,
    xOffset: 0,
    speed: 1,
    intensity: 1,
    size: 1,
    resolutionScale: 0.25
  }
)

/* ========== Math Utilities (ported from GLSL) ========== */

function fract(v: number): number {
  return v - Math.floor(v)
}

function mix(a: number, b: number, t: number): number {
  return a * (1 - t) + b * t
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
  const h6 = h * 6
  const wrap = (n: number) => ((n % 6) + 6) % 6
  const r = Math.max(0, Math.min(1, Math.abs(wrap(h6 + 0) - 3) - 1))
  const g = Math.max(0, Math.min(1, Math.abs(wrap(h6 + 4) - 3) - 1))
  const b = Math.max(0, Math.min(1, Math.abs(wrap(h6 + 2) - 3) - 1))
  return [v * (1 - s + s * r), v * (1 - s + s * g), v * (1 - s + s * b)]
}

function hash11(p: number): number {
  p = fract(p * 0.1031)
  p = p * (p + 33.33)
  p = p * (p + p)
  return fract(p)
}

function hash12(x: number, y: number): number {
  let p3x = fract(x * 0.1031)
  let p3y = fract(y * 0.1031)
  let p3z = fract(x * 0.1031)
  const dotVal = p3x * (p3y + 33.33) + p3y * (p3z + 33.33) + p3z * (p3x + 33.33)
  p3x += dotVal
  p3y += dotVal
  p3z += dotVal
  return fract((p3x + p3y) * p3z)
}

function noise(x: number, y: number): number {
  const ix = Math.floor(x)
  const iy = Math.floor(y)
  const fx = x - ix
  const fy = y - iy
  const a = hash12(ix, iy)
  const b = hash12(ix + 1, iy)
  const c = hash12(ix, iy + 1)
  const d = hash12(ix + 1, iy + 1)
  const tx = smoothstep(0, 1, fx)
  const ty = smoothstep(0, 1, fy)
  return mix(mix(a, b, tx), mix(c, d, tx), ty)
}

function fbm(x: number, y: number, octaves: number): number {
  let value = 0
  let amplitude = 0.5
  let px = x
  let py = y
  const cosA = Math.cos(0.45)
  const sinA = Math.sin(0.45)
  for (let i = 0; i < octaves; i++) {
    value += amplitude * noise(px, py)
    const rpx = px * cosA - py * sinA
    const rpy = px * sinA + py * cosA
    px = rpx * 2
    py = rpy * 2
    amplitude *= 0.5
  }
  return value
}

/* ========== State ========== */

const canvasRef = ref<HTMLCanvasElement | null>(null)
const OCTAVES = 6

let animationId: number | null = null
let resizeObserver: ResizeObserver | null = null
let startTime = 0

/* ========== Render ========== */

function render() {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const displayWidth = canvas.clientWidth
  const displayHeight = canvas.clientHeight
  if (displayWidth === 0 || displayHeight === 0) {
    animationId = requestAnimationFrame(render)
    return
  }

  const bufferWidth = Math.max(1, Math.round(displayWidth * props.resolutionScale))
  const bufferHeight = Math.max(1, Math.round(displayHeight * props.resolutionScale))

  // Resize drawing buffer if needed
  if (canvas.width !== bufferWidth || canvas.height !== bufferHeight) {
    canvas.width = bufferWidth
    canvas.height = bufferHeight
  }

  const imageData = ctx.createImageData(bufferWidth, bufferHeight)
  const data = imageData.data
  const time = (performance.now() - startTime) / 1000

  // Precompute per-frame constants
  const [baseR, baseG, baseB] = hsvToRgb(props.hue / 360, 0.7, 0.8)
  const hashTime = hash11(time * props.speed)
  const brightness = 0.07 * hashTime
  const invDistMax = 1 / 0.001
  const timeOffset = 0.8 * time * props.speed

  for (let y = 0; y < bufferHeight; y++) {
    for (let x = 0; x < bufferWidth; x++) {
      let uvx = x / bufferWidth
      let uvy = y / bufferHeight
      uvx = 2 * uvx - 1
      uvy = 2 * uvy - 1
      uvx *= bufferWidth / bufferHeight
      uvx += props.xOffset

      const fbmVal = fbm(
        uvx * props.size + timeOffset,
        uvy * props.size + timeOffset,
        OCTAVES
      )
      uvx += 2 * fbmVal - 1
      uvy += 2 * fbmVal - 1

      const dist = Math.max(0.001, Math.abs(uvx))

      // Original GLSL: baseColor * pow(mix(0.0, 0.07, hash11(...)) / dist, 1.0) * intensity
      // pow(x, 1.0) is identity, mix(0, b, t) = b*t
      const factor = (brightness / dist) * props.intensity

      const r = baseR * factor
      const g = baseG * factor
      const b = baseB * factor
      const alpha = Math.max(0, Math.min(1, Math.max(r, Math.max(g, b))))

      const idx = (y * bufferWidth + x) * 4
      data[idx] = Math.max(0, Math.min(255, Math.round(r * 255)))
      data[idx + 1] = Math.max(0, Math.min(255, Math.round(g * 255)))
      data[idx + 2] = Math.max(0, Math.min(255, Math.round(b * 255)))
      data[idx + 3] = Math.max(0, Math.min(255, Math.round(alpha * 255)))
    }
  }

  ctx.putImageData(imageData, 0, 0)
  animationId = requestAnimationFrame(render)
}

/* ========== Lifecycle ========== */

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return

  startTime = performance.now()

  resizeObserver = new ResizeObserver(() => {
    // Size is read from clientWidth/clientHeight each frame in render()
  })
  resizeObserver.observe(canvas.parentElement || canvas)

  animationId = requestAnimationFrame(render)
})

onUnmounted(() => {
  if (animationId !== null) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
})
</script>

<style scoped>
.lightning-container {
  display: block;
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
