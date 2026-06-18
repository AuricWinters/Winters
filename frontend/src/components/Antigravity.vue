<template>
  <canvas ref="canvasRef" style="width:100%;height:100%;display:block"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  count: { type: Number, default: 200 },
  magnetRadius: { type: Number, default: 100 },
  ringRadius: { type: Number, default: 80 },
  waveSpeed: { type: Number, default: 0.4 },
  waveAmplitude: { type: Number, default: 1 },
  particleSize: { type: Number, default: 2 },
  lerpSpeed: { type: Number, default: 0.1 },
  color: { type: String, default: '#FF9FFC' },
  autoAnimate: { type: Boolean, default: false },
  rotationSpeed: { type: Number, default: 0 },
  depthFactor: { type: Number, default: 1 },
  pulseSpeed: { type: Number, default: 3 },
  fieldStrength: { type: Number, default: 10 },
})

const canvasRef = ref(null)
let rafId = null
let particles = []
let mouseX = 0
let mouseY = 0
let smoothMX = 0
let smoothMY = 0
let lastMoveTime = 0
let time = 0

onMounted(async () => {
  await nextTick()
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect()
    canvas.width = rect.width * devicePixelRatio
    canvas.height = rect.height * devicePixelRatio
    canvas.style.width = rect.width + 'px'
    canvas.style.height = rect.height + 'px'
  }
  resize()
  window.addEventListener('resize', resize)

  // Init particles
  for (let i = 0; i < props.count; i++) {
    particles.push({
      x: (Math.random() - 0.5) * canvas.width,
      y: (Math.random() - 0.5) * canvas.height,
      z: (Math.random() - 0.5) * 20,
      cx: 0, cy: 0, cz: 0,
      t: Math.random() * 100,
      speed: 0.01 + Math.random() / 200,
      randomRadiusOffset: (Math.random() - 0.5) * 2,
    })
  }

  const onMouseMove = (e) => {
    const rect = canvas.getBoundingClientRect()
    mouseX = (e.clientX - rect.left) / rect.width * canvas.width - canvas.width / 2
    mouseY = (e.clientY - rect.top) / rect.height * canvas.height - canvas.height / 2
    lastMoveTime = Date.now()
  }
  window.addEventListener('mousemove', onMouseMove)

  function animate() {
    time += 0.016
    const w = canvas.width / devicePixelRatio
    const h = canvas.height / devicePixelRatio
    const w2 = canvas.width / 2
    const h2 = canvas.height / 2

    smoothMX += (mouseX - smoothMX) * 0.05
    smoothMY += (mouseY - smoothMY) * 0.05

    let targetX = smoothMX
    let targetY = smoothMY

    if (props.autoAnimate && Date.now() - lastMoveTime > 2000) {
      targetX = Math.sin(time * 0.5) * w2 / 2
      targetY = Math.cos(time * 1.0) * h2 / 2
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = props.color

    const globalRotation = time * props.rotationSpeed

    particles.forEach((p) => {
      p.t += p.speed / 2
      const projFactor = 1 - p.z / 50
      const projTargetX = targetX * projFactor
      const projTargetY = targetY * projFactor

      const dx = p.x - projTargetX
      const dy = p.y - projTargetY
      const dist = Math.sqrt(dx * dx + dy * dy)

      let targetPos = { x: p.x, y: p.y, z: p.z * props.depthFactor }

      if (dist < props.magnetRadius) {
        const angle = Math.atan2(dy, dx) + globalRotation
        const wave = Math.sin(p.t * props.waveSpeed + angle) * (0.5 * props.waveAmplitude)
        const dev = p.randomRadiusOffset * (5 / (props.fieldStrength + 0.1))
        const currentRR = props.ringRadius + wave + dev
        targetPos.x = projTargetX + currentRR * Math.cos(angle)
        targetPos.y = projTargetY + currentRR * Math.sin(angle)
        targetPos.z = p.z * props.depthFactor + Math.sin(p.t) * (1 * props.waveAmplitude * props.depthFactor)
      }

      p.cx += (targetPos.x - p.cx) * props.lerpSpeed
      p.cy += (targetPos.y - p.cy) * props.lerpSpeed
      p.cz += (targetPos.z - p.cz) * props.lerpSpeed

      const distToMouse = Math.sqrt(
        Math.pow(p.cx - projTargetX, 2) + Math.pow(p.cy - projTargetY, 2)
      )
      const distFromRing = Math.abs(distToMouse - props.ringRadius)
      let scaleFactor = 1 - distFromRing / 10
      scaleFactor = Math.max(0, Math.min(1, scaleFactor))
      const finalScale = scaleFactor * (0.8 + Math.sin(p.t * props.pulseSpeed) * 0.2) * props.particleSize

      ctx.save()
      ctx.translate(p.cx + w2, p.cy + h2)
      ctx.rotate(Math.atan2(p.cy - projTargetY, p.cx - projTargetX) + Math.PI / 2)
      ctx.beginPath()
      ctx.arc(0, 0, finalScale, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    })

    rafId = requestAnimationFrame(animate)
  }
  rafId = requestAnimationFrame(animate)
})

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId)
})
</script>
