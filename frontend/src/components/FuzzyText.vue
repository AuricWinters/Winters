<template>
  <div class="fuzzy-text">
    <canvas ref="canvasRef" class="fuzzy-text__canvas" />
    <div v-if="$slots.default" class="fuzzy-text__source" aria-hidden="true">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, useSlots, nextTick } from 'vue'

interface FuzzyTextProps {
  /** Text to render with the fuzzy effect. Falls back to slot text content. */
  text?: string
  /** CSS font-size value or pixel number */
  fontSize?: number | string
  /** CSS font-weight */
  fontWeight?: string | number
  /** CSS font-family; "inherit" reads from parent */
  fontFamily?: string
  /** Text color (ignored when gradient is set) */
  color?: string
  /** Enable hover-based intensity increase */
  enableHover?: boolean
  /** Intensity of the fuzz effect at rest (0-1) */
  baseIntensity?: number
  /** Intensity of the fuzz effect on hover (0-1) */
  hoverIntensity?: number
  /** Maximum pixel displacement range */
  fuzzRange?: number
  /** Target frames per second */
  fps?: number
  /** Direction of the displacement effect */
  direction?: 'horizontal' | 'vertical' | 'both'
  /** Frames over which intensity smooths between state changes (0 = instant) */
  transitionDuration?: number
  /** Whether clicking briefly spikes intensity to 1 */
  clickEffect?: boolean
  /** Enable periodic full-intensity glitch bursts */
  glitchMode?: boolean
  /** Milliseconds between glitch bursts */
  glitchInterval?: number
  /** Duration of each glitch burst in ms */
  glitchDuration?: number
  /** Array of CSS color strings for linear gradient (e.g. ['#f00', '#00f']) */
  gradient?: string[] | null
  /** Additional pixel spacing between characters */
  letterSpacing?: number
}

const props = withDefaults(defineProps<FuzzyTextProps>(), {
  text: '',
  fontSize: 'clamp(2rem, 8vw, 8rem)',
  fontWeight: 900,
  fontFamily: 'inherit',
  color: '#fff',
  enableHover: true,
  baseIntensity: 0.18,
  hoverIntensity: 0.5,
  fuzzRange: 30,
  fps: 60,
  direction: 'horizontal',
  transitionDuration: 0,
  clickEffect: false,
  glitchMode: false,
  glitchInterval: 2000,
  glitchDuration: 200,
  gradient: null,
  letterSpacing: 0,
})

const slots = useSlots()
const canvasRef = ref<HTMLCanvasElement | null>(null)

// ---- Helpers ----

/** Recursively extract plain text from an array of VNodes. */
function extractTextFromVNodes(vnodes: any[]): string {
  return (vnodes || [])
    .map((vn: any) => {
      if (typeof vn.children === 'string') return vn.children
      if (typeof vn.children === 'number') return String(vn.children)
      if (Array.isArray(vn.children)) return extractTextFromVNodes(vn.children)
      return ''
    })
    .join('')
}

/** Return the text to render on canvas -- prop first, slot content as fallback. */
function resolveText(): string {
  if (props.text) return props.text
  return extractTextFromVNodes(slots.default?.() ?? [])
}

// ---- Canvas lifecycle ----

let cleanupFns: (() => void)[] = []

function initCanvas(): void {
  // Tear down any previous instance
  cleanupFns.forEach((fn) => fn())
  cleanupFns = []

  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    console.warn('[FuzzyText] Could not get 2D context.')
    return
  }

  const text = resolveText()
  if (!text) return

  // ---- Resolve font ----
  const computedFontFamily =
    props.fontFamily === 'inherit'
      ? window.getComputedStyle(canvas).fontFamily || 'sans-serif'
      : props.fontFamily

  const fontSizeStr = typeof props.fontSize === 'number' ? `${props.fontSize}px` : props.fontSize
  const fontString = `${props.fontWeight} ${fontSizeStr} ${computedFontFamily}`

  // ---- Resolve numeric font size (needed for metrics fallback) ----
  let numericFontSize: number
  if (typeof props.fontSize === 'number') {
    numericFontSize = props.fontSize
  } else {
    const temp = document.createElement('span')
    temp.style.fontSize = props.fontSize
    temp.style.position = 'absolute'
    temp.style.visibility = 'hidden'
    document.body.appendChild(temp)
    numericFontSize = parseFloat(window.getComputedStyle(temp).fontSize) || 64
    document.body.removeChild(temp)
  }

  // ---- Offscreen canvas for the clean (undisplaced) text ----
  const offscreen = document.createElement('canvas')
  const offCtx = offscreen.getContext('2d')
  if (!offCtx) return

  offCtx.font = `${props.fontWeight} ${fontSizeStr} ${computedFontFamily}`
  offCtx.textBaseline = 'alphabetic'

  // Measure text width
  let totalWidth = 0
  if (props.letterSpacing !== 0) {
    for (const char of text) {
      totalWidth += offCtx.measureText(char).width + props.letterSpacing
    }
    totalWidth -= props.letterSpacing
  } else {
    totalWidth = offCtx.measureText(text).width
  }

  const metrics = offCtx.measureText(text)
  const actualLeft = metrics.actualBoundingBoxLeft || 0
  const actualRight =
    props.letterSpacing !== 0
      ? totalWidth
      : metrics.actualBoundingBoxRight || metrics.width
  const actualAscent = metrics.actualBoundingBoxAscent || numericFontSize
  const actualDescent = metrics.actualBoundingBoxDescent || numericFontSize * 0.2

  const textBoundingWidth = Math.ceil(props.letterSpacing !== 0 ? totalWidth : actualLeft + actualRight)
  const tightHeight = Math.ceil(actualAscent + actualDescent)

  const extraBuffer = 10
  const offscreenWidth = textBoundingWidth + extraBuffer
  offscreen.width = offscreenWidth
  offscreen.height = tightHeight

  const xOffset = extraBuffer / 2
  offCtx.font = `${props.fontWeight} ${fontSizeStr} ${computedFontFamily}`
  offCtx.textBaseline = 'alphabetic'

  // Fill style
  if (props.gradient && Array.isArray(props.gradient) && props.gradient.length >= 2) {
    const grad = offCtx.createLinearGradient(0, 0, offscreenWidth, 0)
    props.gradient.forEach((c, i) => grad.addColorStop(i / (props.gradient!.length - 1), c))
    offCtx.fillStyle = grad
  } else {
    offCtx.fillStyle = props.color
  }

  // Draw text onto offscreen canvas
  if (props.letterSpacing !== 0) {
    let xPos = xOffset
    for (const char of text) {
      offCtx.fillText(char, xPos, actualAscent)
      xPos += offCtx.measureText(char).width + props.letterSpacing
    }
  } else {
    offCtx.fillText(text, xOffset - actualLeft, actualAscent)
  }

  // ---- Main canvas sizing ----
  const hMargin = props.fuzzRange + 20
  const vMargin =
    props.direction === 'vertical' || props.direction === 'both'
      ? props.fuzzRange + 10
      : 0
  canvas.width = offscreenWidth + hMargin * 2
  canvas.height = tightHeight + vMargin * 2

  // Translate so drawing origin is at the text position
  ctx.translate(hMargin, vMargin)

  // Interactive area (in untranslated canvas coords)
  const iLeft = hMargin + xOffset
  const iTop = vMargin
  const iRight = iLeft + textBoundingWidth
  const iBottom = iTop + tightHeight

  // ---- Animation state ----
  let isCancelled = false
  let animationFrameId = 0
  let glitchTimeoutId = 0
  let glitchEndTimeoutId = 0
  let clickTimeoutId = 0

  let isHovering = false
  let isClicking = false
  let isGlitching = false
  let currentIntensity = props.baseIntensity
  let targetIntensity = props.baseIntensity
  let lastFrameTime = 0
  const frameDuration = 1000 / props.fps

  // Glitch scheduler
  const startGlitchLoop = (): void => {
    if (!props.glitchMode || isCancelled) return
    glitchTimeoutId = window.setTimeout(() => {
      if (isCancelled) return
      isGlitching = true
      glitchEndTimeoutId = window.setTimeout(() => {
        isGlitching = false
        startGlitchLoop()
      }, props.glitchDuration)
    }, props.glitchInterval)
  }
  if (props.glitchMode) startGlitchLoop()

  // Render loop
  const run = (timestamp: number): void => {
    if (isCancelled) return
    if (timestamp - lastFrameTime < frameDuration) {
      animationFrameId = window.requestAnimationFrame(run)
      return
    }
    lastFrameTime = timestamp

    ctx.save()
    ctx.setTransform(1, 0, 0, 1, 0, 0) // reset transform for clear
    ctx.clearRect(
      -props.fuzzRange - 20 + hMargin,
      -props.fuzzRange - 10 + vMargin,
      offscreenWidth + 2 * (props.fuzzRange + 20),
      tightHeight + 2 * (props.fuzzRange + 10),
    )
    ctx.restore() // restore translate

    // Resolve target intensity
    if (isClicking || isGlitching) {
      targetIntensity = 1
    } else if (isHovering) {
      targetIntensity = props.hoverIntensity
    } else {
      targetIntensity = props.baseIntensity
    }

    // Smooth transition
    if (props.transitionDuration > 0) {
      const step = 1 / (props.transitionDuration / frameDuration)
      if (currentIntensity < targetIntensity) {
        currentIntensity = Math.min(currentIntensity + step, targetIntensity)
      } else if (currentIntensity > targetIntensity) {
        currentIntensity = Math.max(currentIntensity - step, targetIntensity)
      }
    } else {
      currentIntensity = targetIntensity
    }

    // Draw scanlines with displacement
    const doVertical = props.direction === 'vertical' || props.direction === 'both'
    const doHorizontal = props.direction === 'horizontal' || props.direction === 'both'

    for (let j = 0; j < tightHeight; j++) {
      let dx = 0
      let dy = 0
      if (doHorizontal) {
        dx = Math.floor(currentIntensity * (Math.random() - 0.5) * props.fuzzRange)
      }
      if (doVertical) {
        dy = Math.floor(currentIntensity * (Math.random() - 0.5) * props.fuzzRange * 0.5)
      }
      ctx.drawImage(offscreen, 0, j, offscreenWidth, 1, dx, j + dy, offscreenWidth, 1)
    }

    animationFrameId = window.requestAnimationFrame(run)
  }

  animationFrameId = window.requestAnimationFrame(run)

  // ---- Interaction ----

  const isInsideText = (x: number, y: number): boolean =>
    x >= iLeft && x <= iRight && y >= iTop && y <= iBottom

  const handleMouseMove = (e: MouseEvent): void => {
    if (!props.enableHover) return
    const rect = canvas.getBoundingClientRect()
    isHovering = isInsideText(e.clientX - rect.left, e.clientY - rect.top)
  }

  const handleMouseLeave = (): void => {
    isHovering = false
  }

  const handleClick = (): void => {
    if (!props.clickEffect) return
    isClicking = true
    clearTimeout(clickTimeoutId)
    clickTimeoutId = window.setTimeout(() => {
      isClicking = false
    }, 150)
  }

  const handleTouchMove = (e: TouchEvent): void => {
    if (!props.enableHover) return
    e.preventDefault()
    const rect = canvas.getBoundingClientRect()
    const touch = e.touches[0]
    isHovering = isInsideText(touch.clientX - rect.left, touch.clientY - rect.top)
  }

  const handleTouchEnd = (): void => {
    isHovering = false
  }

  if (props.enableHover) {
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', handleMouseLeave)
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false })
    canvas.addEventListener('touchend', handleTouchEnd)
  }

  if (props.clickEffect) {
    canvas.addEventListener('click', handleClick)
  }

  // ---- Cleanup registration ----
  const cleanup = (): void => {
    isCancelled = true
    window.cancelAnimationFrame(animationFrameId)
    clearTimeout(glitchTimeoutId)
    clearTimeout(glitchEndTimeoutId)
    clearTimeout(clickTimeoutId)

    if (props.enableHover) {
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
      canvas.removeEventListener('touchmove', handleTouchMove)
      canvas.removeEventListener('touchend', handleTouchEnd)
    }
    if (props.clickEffect) {
      canvas.removeEventListener('click', handleClick)
    }
  }

  cleanupFns.push(cleanup)
}

// Boot on mount
onMounted(() => {
  nextTick(() => {
    // Wait for fonts to be ready
    const fontSizeStr = typeof props.fontSize === 'number' ? `${props.fontSize}px` : props.fontSize
    const fontFamily =
      props.fontFamily === 'inherit'
        ? window.getComputedStyle(canvasRef.value!).fontFamily || 'sans-serif'
        : props.fontFamily
    const fontString = `${props.fontWeight} ${fontSizeStr} ${fontFamily}`

    document.fonts
      .load(fontString)
      .catch(() => document.fonts.ready)
      .then(() => {
        if (canvasRef.value) initCanvas()
      })
  })
})

onUnmounted(() => {
  cleanupFns.forEach((fn) => fn())
  cleanupFns = []
})

// Re-init on prop changes
watch(
  () => [
    props.text,
    props.fontSize,
    props.fontWeight,
    props.fontFamily,
    props.color,
    props.enableHover,
    props.baseIntensity,
    props.hoverIntensity,
    props.fuzzRange,
    props.fps,
    props.direction,
    props.transitionDuration,
    props.clickEffect,
    props.glitchMode,
    props.glitchInterval,
    props.glitchDuration,
    props.gradient,
    props.letterSpacing,
  ],
  () => {
    nextTick(() => {
      // Font may have changed -- wait for load
      const fontSizeStr = typeof props.fontSize === 'number' ? `${props.fontSize}px` : props.fontSize
      const fontFamily =
        props.fontFamily === 'inherit'
          ? window.getComputedStyle(canvasRef.value ?? document.body).fontFamily || 'sans-serif'
          : props.fontFamily
      const fontString = `${props.fontWeight} ${fontSizeStr} ${fontFamily}`

      document.fonts
        .load(fontString)
        .catch(() => document.fonts.ready)
        .then(() => {
          initCanvas()
        })
    })
  },
  { deep: true },
)
</script>

<style scoped>
.fuzzy-text {
  position: relative;
  display: inline-block;
  line-height: 1;
}
.fuzzy-text__canvas {
  display: block;
  /* Prevent unwanted user interactions with the canvas area itself */
  user-select: none;
  -webkit-user-select: none;
}
.fuzzy-text__source {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
