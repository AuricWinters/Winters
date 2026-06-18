<template>
  <div
    ref="rootRef"
    class="ascii-text"
    :class="{ 'ascii-text--wave': enableWaves }"
    :style="rootVars"
    @mousemove="onPointerMove"
    @mouseleave="onPointerLeave"
  >
    <div class="ascii-text__inner">
      <!-- Slot content rendered behind the ASCII overlay -->
      <div v-if="hasSlotContent" class="ascii-text__backdrop">
        <slot />
      </div>

      <!-- ASCII text layer -->
      <pre
        ref="preRef"
        class="ascii-text__pre"
        :style="preStyle"
        aria-hidden="true"
      >{{ asciiContent }}</pre>
    </div>

    <canvas ref="canvasRef" class="ascii-text__canvas" aria-hidden="true" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, useSlots, nextTick } from 'vue'

interface ASCIITextProps {
  /** Text to convert into ASCII art */
  text?: string
  /** Font size (px) of each ASCII character in the output */
  asciiFontSize?: number
  /** Font size (px) of the source text rendered on the internal canvas */
  textFontSize?: number
  /** Color of the source text on the internal canvas */
  textColor?: string
  /** Font family for the ASCII output display */
  fontFamily?: string
  /** Character set used for mapping, ordered from dimmest to brightest */
  charset?: string
  /** Enable a subtle wave / breathing animation on the ASCII plane */
  enableWaves?: boolean
  /** Enable mouse-driven parallax tilt */
  enableTilt?: boolean
  /** Speed multiplier for the wave animation */
  speed?: number
}

const props = withDefaults(defineProps<ASCIITextProps>(), {
  text: 'Hello',
  asciiFontSize: 8,
  textFontSize: 200,
  textColor: '#ffffff',
  fontFamily: "'Courier New', 'IBM Plex Mono', monospace",
  charset: " .'`^\",:;Il!i~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$",
  enableWaves: true,
  enableTilt: true,
  speed: 1,
})

const slots = useSlots()
const hasSlotContent = computed(() => !!slots.default)

const rootRef = ref<HTMLDivElement>()
const preRef = ref<HTMLPreElement>()
const canvasRef = ref<HTMLCanvasElement>()
const asciiContent = ref('')

// Reactive transform / filter values
const tiltX = ref(0)
const tiltY = ref(0)
const hueDeg = ref(0)

// Animation state
let animFrameId = 0
let lastTime = 0
let targetHue = 0
let currentHue = 0
let waveTime = 0

// -- Computed styles -------------------------------------------------------

const preStyle = computed(() => ({
  fontSize: `${props.asciiFontSize}px`,
  fontFamily: props.fontFamily,
}))

const rootVars = computed(() => ({
  '--tilt-x': `${tiltX.value}deg`,
  '--tilt-y': `${tiltY.value}deg`,
  '--hue': `${hueDeg.value}deg`,
  '--speed': String(props.speed),
}))

// -- ASCII conversion -------------------------------------------------------

/**
 * Renders the source text onto a hidden canvas, samples pixel brightness
 * in a grid, and maps each cell to a character from the charset.
 */
function updateAscii() {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const displayFont = `600 ${props.textFontSize}px ${props.fontFamily}`
  ctx.font = displayFont

  const metrics = ctx.measureText(props.text)
  const textWidth = Math.ceil(metrics.width) + 40
  const textHeight = Math.ceil(props.textFontSize * 1.4) + 40

  canvas.width = textWidth
  canvas.height = textHeight

  // Draw the source text in the chosen colour
  ctx.fillStyle = props.textColor
  ctx.font = displayFont
  ctx.textBaseline = 'top'
  ctx.fillText(props.text, 20, 20)

  // Read pixel data
  const imageData = ctx.getImageData(0, 0, textWidth, textHeight)
  const data = imageData.data

  // Measure one character cell in the output (ASCII) font
  ctx.font = `${props.asciiFontSize}px ${props.fontFamily}`
  const charWidth = Math.max(ctx.measureText('A').width, 1)
  const cellH = props.asciiFontSize

  const cols = Math.ceil(textWidth / charWidth)
  const rows = Math.ceil(textHeight / cellH)

  let result = ''
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // Sample the centre of each cell
      const px = Math.min(Math.floor(col * charWidth + charWidth / 2), textWidth - 1)
      const py = Math.min(Math.floor(row * cellH + cellH / 2), textHeight - 1)
      const idx = (py * textWidth + px) * 4

      const r = data[idx]
      const g = data[idx + 1]
      const b = data[idx + 2]
      const a = data[idx + 3]

      // Transparent / empty cell
      if (a < 128) {
        result += ' '
        continue
      }

      // Relative luminance → charset index (dimmer → lighter char)
      const gray = 0.299 * r + 0.587 * g + 0.114 * b
      const rawIdx = Math.floor((1 - gray / 255) * (props.charset.length - 1))
      result += props.charset[Math.max(0, Math.min(rawIdx, props.charset.length - 1))]
    }
    result += '\n'
  }

  asciiContent.value = result
}

// -- Mouse / pointer handlers -----------------------------------------------

function onPointerMove(e: MouseEvent) {
  if (!props.enableTilt) return
  const rect = rootRef.value?.getBoundingClientRect()
  if (!rect) return

  const x = (e.clientX - rect.left) / rect.width   // 0..1
  const y = (e.clientY - rect.top) / rect.height    // 0..1

  // Hue derived from the angle of the mouse relative to centre
  targetHue = Math.atan2(y - 0.5, x - 0.5) * (180 / Math.PI)

  // Tilt range: roughly -5..5 deg on each axis
  tiltX.value = (y - 0.5) * 10
  tiltY.value = (x - 0.5) * -10
}

function onPointerLeave() {
  tiltX.value = 0
  tiltY.value = 0
}

// -- Animation loop ---------------------------------------------------------

function animate(now: number) {
  animFrameId = requestAnimationFrame(animate)

  const dt = lastTime ? (now - lastTime) / 1000 : 0.016
  lastTime = now
  waveTime += dt * props.speed

  // Smooth hue interpolation (low-pass filter)
  currentHue += (targetHue - currentHue) * 0.05
  hueDeg.value = currentHue

  // Expose wave time so the CSS animation can be sync-adjusted if needed
  if (rootRef.value) {
    rootRef.value.style.setProperty('--wave-time', String(waveTime))
  }
}

// -- Lifecycle --------------------------------------------------------------

onMounted(() => {
  updateAscii()
  animFrameId = requestAnimationFrame(animate)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animFrameId)
})

// -- React to prop changes --------------------------------------------------

watch(
  () => [props.text, props.textFontSize, props.textColor, props.fontFamily, props.charset, props.asciiFontSize],
  () => { nextTick(updateAscii) },
  { deep: false },
)
</script>

<style scoped>
/* ── Root ──────────────────────────────────────────────── */
.ascii-text {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  perspective: 1000px;
  background: #0a0a0f;
}

/* ── Inner 3-D layer ───────────────────────────────────── */
.ascii-text__inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transform:
    perspective(1000px)
    rotateX(var(--tilt-x, 0deg))
    rotateY(var(--tilt-y, 0deg));
  transition: transform 0.08s ease-out;
}

/* ── Backdrop (slotted content) ─────────────────────────── */
.ascii-text__backdrop {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
}

/* ── ASCII overlay ─────────────────────────────────────── */
.ascii-text__pre {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  line-height: 1em;
  text-align: center;
  z-index: 9;
  user-select: none;
  pointer-events: none;
  white-space: pre;
  overflow: hidden;
  word-break: break-all;

  /* Rainbow gradient clipped to the text glyphs */
  background-image: radial-gradient(
    circle at center,
    #ff6188 0%,
    #fc9867 50%,
    #ffd866 100%
  );
  background-attachment: fixed;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;

  /* Blend with the backdrop / root background */
  mix-blend-mode: difference;

  /* Hue rotation driven by mouse angle */
  filter: hue-rotate(var(--hue, 0deg));

  /* Crisp pixel-style rendering */
  image-rendering: pixelated;

  /* Ensure the pre itself has no background */
  background-color: transparent;
}

/* ── Wave animation ────────────────────────────────────── */
.ascii-text--wave .ascii-text__pre {
  animation: ascii-wave 6s ease-in-out infinite;
  animation-duration: calc(6s / var(--speed, 1));
}

@keyframes ascii-wave {
  0%,
  100% {
    transform:
      perspective(800px)
      rotateX(0deg)
      rotateY(0deg)
      translateZ(0);
  }
  25% {
    transform:
      perspective(800px)
      rotateX(0.8deg)
      rotateY(-0.6deg)
      translateZ(2px);
  }
  50% {
    transform:
      perspective(800px)
      rotateX(0deg)
      rotateY(0.8deg)
      translateZ(0);
  }
  75% {
    transform:
      perspective(800px)
      rotateX(-0.6deg)
      rotateY(-0.4deg)
      translateZ(-1px);
  }
}

/* ── Hidden canvas (pixel data only) ────────────────────── */
.ascii-text__canvas {
  display: none;
}
</style>
