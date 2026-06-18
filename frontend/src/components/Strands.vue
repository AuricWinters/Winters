<template>
  <canvas ref="canvasRef" :class="['strands-container', className]" :style="style"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, reactive } from 'vue'

const props = defineProps({
  colors: { type: Array, default: () => ['#FF4242', '#7C3AED', '#06B6D4', '#EAB308'] },
  count: { type: Number, default: 3 },
  speed: { type: Number, default: 0.5 },
  amplitude: { type: Number, default: 1 },
  waviness: { type: Number, default: 1 },
  thickness: { type: Number, default: 0.7 },
  glow: { type: Number, default: 2.6 },
  taper: { type: Number, default: 3 },
  spread: { type: Number, default: 1 },
  hueShift: { type: Number, default: 0 },
  intensity: { type: Number, default: 0.6 },
  saturation: { type: Number, default: 1.5 },
  opacity: { type: Number, default: 1 },
  scale: { type: Number, default: 1.5 },
  className: { type: String, default: '' },
  style: { type: Object, default: () => ({}) },
})

const canvasRef = ref(null)
let rafId = null

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? { r: parseInt(result[1], 16) / 255, g: parseInt(result[2], 16) / 255, b: parseInt(result[3], 16) / 255 } : { r: 1, g: 1, b: 1 }
}

function lerpColor(c1, c2, t) {
  return { r: c1.r + (c2.r - c1.r) * t, g: c1.g + (c2.g - c1.g) * t, b: c1.b + (c2.b - c1.b) * t }
}

onMounted(async () => {
  await nextTick()
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect()
    const dpr = Math.min(devicePixelRatio, 2)
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    canvas.style.width = rect.width + 'px'
    canvas.style.height = rect.height + 'px'
  }
  resize()
  window.addEventListener('resize', resize)

  const rgbColors = props.colors.map(hexToRgb)
  const strandCount = Math.min(Math.max(1, Math.round(props.count)), 12)

  function animate(t) {
    const w = canvas.width
    const h = canvas.height
    const time = (t / 1000) * props.speed

    ctx.clearRect(0, 0, w, h)

    const scale = Math.max(props.scale, 0.0001)
    const env = 0.06 + props.intensity * 0.94

    for (let i = 0; i < strandCount; i++) {
      const fi = i
      const ph = fi * 1.7 * props.spread
      const freq = (2.0 + fi * 0.35) * props.waviness
      const spd = 1.4 + fi * 1.2

      ctx.beginPath()
      let first = true

      for (let px = 0; px <= w; px += 2) {
        const uvx = (px / w) * 2 - 1
        const uvx_scaled = uvx / scale

        const wave = Math.sin(uvx_scaled * freq + time * spd + ph) * 0.60
                   + Math.sin(uvx_scaled * freq * 1.1 - time * spd * 0.7 + ph * 1.7) * 0.40

        const amp = (0.1 + 0.02 * env) * Math.pow(Math.max(Math.cos(uvx * Math.PI * 1.3), 0), props.taper) * props.amplitude
        const yPos = h / 2 + wave * amp * (h / 2) * 0.2

        if (first) {
          ctx.moveTo(px, yPos)
          first = false
        } else {
          ctx.lineTo(px, yPos)
        }
      }

      const hue = fi / strandCount + props.hueShift + time * 0.04
      const colorIdx = (hue % 1) * rgbColors.length
      const ci = Math.floor(colorIdx)
      const cf = colorIdx - ci
      const c1 = rgbColors[ci % rgbColors.length]
      const c2 = rgbColors[(ci + 1) % rgbColors.length]
      const col = lerpColor(c1, c2, cf)

      const gray = col.r * 0.2126 + col.g * 0.7152 + col.b * 0.0722
      const satR = gray + (col.r - gray) * props.saturation
      const satG = gray + (col.g - gray) * props.saturation
      const satB = gray + (col.b - gray) * props.saturation

      ctx.strokeStyle = `rgba(${satR * 255}, ${satG * 255}, ${satB * 255}, ${props.opacity})`
      ctx.lineWidth = (0.001 + 0.05 * env) * props.thickness * scale * 30
      ctx.lineCap = 'round'
      ctx.stroke()
    }

    rafId = requestAnimationFrame(animate)
  }
  rafId = requestAnimationFrame(animate)
})

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<style scoped>
.strands-container {
  display: block;
}
</style>
