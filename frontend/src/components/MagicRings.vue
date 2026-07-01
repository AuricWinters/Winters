<template>
  <canvas
    ref="canvasRef"
    :style="{ filter: blur > 0 ? `blur(${blur}px)` : 'none', width: '100%', height: '100%', display: 'block' }"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  color: { type: String, default: '#fc42ff' },
  colorTwo: { type: String, default: '#42fcff' },
  speed: { type: Number, default: 1 },
  ringCount: { type: Number, default: 6 },
  attenuation: { type: Number, default: 10 },
  lineThickness: { type: Number, default: 2 },
  baseRadius: { type: Number, default: 40 },
  radiusStep: { type: Number, default: 20 },
  scaleRate: { type: Number, default: 0.1 },
  opacity: { type: Number, default: 1 },
  blur: { type: Number, default: 0 },
  noiseAmount: { type: Number, default: 0.1 },
  rotation: { type: Number, default: 0 },
  ringGap: { type: Number, default: 1.5 },
  fadeIn: { type: Number, default: 0.7 },
  fadeOut: { type: Number, default: 0.5 },
  followMouse: { type: Boolean, default: false },
  mouseInfluence: { type: Number, default: 0.2 },
  hoverScale: { type: Number, default: 1.2 },
  parallax: { type: Number, default: 0.05 },
})

const canvasRef = ref(null)
let rafId = null
let mouseX = 0
let mouseY = 0
let smoothMX = 0
let smoothMY = 0
let isHovered = false
let hoverAmount = 0

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
  const ro = new ResizeObserver(resize)
  ro.observe(canvas.parentElement)

  const onMouseMove = (e) => {
    const rect = canvas.getBoundingClientRect()
    mouseX = (e.clientX - rect.left) / rect.width - 0.5
    mouseY = -((e.clientY - rect.top) / rect.height - 0.5)
  }
  const onEnter = () => isHovered = true
  const onLeave = () => { isHovered = false; mouseX = 0; mouseY = 0 }
  canvas.addEventListener('mousemove', onMouseMove)
  canvas.addEventListener('mouseenter', onEnter)
  canvas.addEventListener('mouseleave', onLeave)

  function animate(t) {
    const w = canvas.width
    const h = canvas.height
    const dpr = Math.min(devicePixelRatio, 2)

    smoothMX += (mouseX - smoothMX) * 0.08
    smoothMY += (mouseY - smoothMY) * 0.08
    hoverAmount += ((isHovered ? 1 : 0) - hoverAmount) * 0.08

    ctx.clearRect(0, 0, w, h)
    ctx.save()

    const rotationRad = (props.rotation * Math.PI) / 180
    const cx = w / 2
    const cy = h / 2
    const sc = 1 + (props.hoverScale - 1) * hoverAmount
    const infl = props.followMouse ? props.mouseInfluence : 0
    const mx = smoothMX * infl
    const my = smoothMY * infl

    ctx.translate(cx, cy)
    ctx.rotate(rotationRad)
    ctx.translate(-cx, -cy)

    const cycle = 3.45
    const time = (t / 1000) * props.speed

    for (let i = 0; i < props.ringCount; i++) {
      const fi = i
      const ti = i === 0 ? 0 : 2.95 * fi
      const ringTime = (time + ti) % cycle
      const baseR = (props.baseRadius + fi * props.radiusStep) * (w / 1000)
      const r = baseR + (ringTime / cycle) * props.scaleRate * (w / 1000)
      const fade = ringTime < props.fadeIn
        ? ringTime / props.fadeIn
        : 1 - Math.max(0, ringTime - (cycle - props.fadeOut)) / props.fadeOut
      if (fade <= 0) continue

      const col = i === 0 ? props.color :
        i === props.ringCount - 1 ? props.colorTwo :
        lerpColor(props.color, props.colorTwo, fi / (props.ringCount - 1))

      // Draw ring
      ctx.beginPath()
      ctx.arc(cx + mx * (1 - fi * props.parallax), cy + my * (1 - fi * props.parallax), r * sc, 0, Math.PI * 2)
      ctx.strokeStyle = col
      ctx.lineWidth = props.lineThickness * (w / 1000)
      ctx.globalAlpha = fade * props.opacity
      ctx.stroke()
    }

    // Noise overlay
    if (props.noiseAmount > 0) {
      const imageData = ctx.getImageData(0, 0, w, h)
      const data = imageData.data
      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] > 0) {
          const n = (Math.random() - 0.5) * props.noiseAmount * 255
          data[i] = Math.max(0, Math.min(255, data[i] + n))
          data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + n))
          data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + n))
        }
      }
      ctx.putImageData(imageData, 0, 0)
    }

    ctx.restore()
    rafId = requestAnimationFrame(animate)
  }
  rafId = requestAnimationFrame(animate)
})

function lerpColor(a, b, t) {
  const ah = parseInt(a.replace('#', ''), 16)
  const bh = parseInt(b.replace('#', ''), 16)
  const ar = (ah >> 16) & 0xff, ag = (ah >> 8) & 0xff, ab = ah & 0xff
  const br = (bh >> 16) & 0xff, bg = (bh >> 8) & 0xff, bb = bh & 0xff
  const r = Math.round(ar + (br - ar) * t)
  const g = Math.round(ag + (bg - ag) * t)
  const bv = Math.round(ab + (bb - ab) * t)
  return `rgb(${r},${g},${bv})`
}

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId)
})
</script>
