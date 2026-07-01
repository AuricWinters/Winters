<template>
  <section class="dot-grid">
    <div ref="wrapperRef" class="dot-grid__wrap">
      <canvas ref="canvasRef" class="dot-grid__canvas" />
      <div v-if="$slots.default" class="dot-grid__slot">
        <slot />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * DotGrid.vue — 可交互点阵背景组件
 *
 * 在 Canvas 上绘制网格点阵，支持：
 * - 鼠标滑过时点阵颜色渐变 (proximity 感应)
 * - 快速甩动鼠标时点阵被推开 (速度触发惯性)
 * - 点击时产生冲击波效果 (点击冲击)
 * - 阻尼弹簧自动回弹
 *
 * 纯 CSS + Canvas 实现，不依赖任何外部动画库。
 */

import { ref, computed, onMounted, onUnmounted } from 'vue'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Dot {
  cx: number
  cy: number
  xOffset: number
  yOffset: number
  vx: number
  vy: number
  phase: 'idle' | 'inertia' | 'returning'
}

interface PointerState {
  x: number
  y: number
  vx: number
  vy: number
  speed: number
  lastTime: number
  lastX: number
  lastY: number
}

interface RGB {
  r: number
  g: number
  b: number
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

const props = withDefaults(defineProps<{
  /** 点直径 (px) */
  dotSize?: number
  /** 点间距 (px) */
  gap?: number
  /** 静止颜色 */
  baseColor?: string
  /** 鼠标靠近时高亮颜色 */
  activeColor?: string
  /** 颜色变化感应半径 (px) */
  proximity?: number
  /** 触发惯性推开的鼠标速度阈值 (px/s) */
  speedTrigger?: number
  /** 点击冲击波半径 (px) */
  shockRadius?: number
  /** 点击冲击强度 */
  shockStrength?: number
  /** 鼠标速度上限 (px/s) */
  maxSpeed?: number
  /** 惯性阻力 (越大停止越快) */
  resistance?: number
  /** 弹性回弹持续时间 (s) */
  returnDuration?: number
  /** 层级 */
  zIndex?: number
}>(), {
  dotSize: 16,
  gap: 32,
  baseColor: '#5227FF',
  activeColor: '#5227FF',
  proximity: 150,
  speedTrigger: 100,
  shockRadius: 250,
  shockStrength: 5,
  maxSpeed: 5000,
  resistance: 750,
  returnDuration: 1.5,
  zIndex: 0,
})

// ---------------------------------------------------------------------------
// Refs & reactive state
// ---------------------------------------------------------------------------

const wrapperRef = ref<HTMLDivElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

/** 所有点的数组 */
const dots: Dot[] = []

/** 指针状态 (mousemove 实时更新) */
const pointer: PointerState = {
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  speed: 0,
  lastTime: 0,
  lastX: 0,
  lastY: 0,
}

/** 缓存圆形 Path2D，避免每帧重建 */
let circlePath: Path2D | null = null

/** requestAnimationFrame ID */
let rafId = 0

/** 上一帧时间戳 (用于 dt 计算) */
let prevTime = 0

// ---------------------------------------------------------------------------
// Color helpers
// ---------------------------------------------------------------------------

function hexToRgb(hex: string): RGB {
  const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i)
  if (!m) return { r: 0, g: 0, b: 0 }
  return {
    r: parseInt(m[1], 16),
    g: parseInt(m[2], 16),
    b: parseInt(m[3], 16),
  }
}

const baseRgb = computed(() => hexToRgb(props.baseColor))
const activeRgb = computed(() => hexToRgb(props.activeColor))
const proxSq = computed(() => props.proximity * props.proximity)

// ---------------------------------------------------------------------------
// Grid builder
// ---------------------------------------------------------------------------

/**
 * 根据容器尺寸重新构建网格点阵。
 * 在高 DPI 屏幕上自动缩放 Canvas 以确保清晰度。
 */
function buildGrid() {
  const wrap = wrapperRef.value
  const canvas = canvasRef.value
  if (!wrap || !canvas) return

  const { width, height } = wrap.getBoundingClientRect()
  const dpr = window.devicePixelRatio || 1

  canvas.width = width * dpr
  canvas.height = height * dpr
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`

  const ctx = canvas.getContext('2d')
  if (ctx) ctx.scale(dpr, dpr)

  const cell = props.dotSize + props.gap
  const cols = Math.floor((width + props.gap) / cell)
  const rows = Math.floor((height + props.gap) / cell)
  const gridW = cell * cols - props.gap
  const gridH = cell * rows - props.gap
  const startX = (width - gridW) / 2 + props.dotSize / 2
  const startY = (height - gridH) / 2 + props.dotSize / 2

  dots.length = 0
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      dots.push({
        cx: startX + x * cell,
        cy: startY + y * cell,
        xOffset: 0,
        yOffset: 0,
        vx: 0,
        vy: 0,
        phase: 'idle',
      })
    }
  }
}

// ---------------------------------------------------------------------------
// Physics simulation
// ---------------------------------------------------------------------------

/**
 * 一帧物理更新。
 *
 * 惯性阶段 (inertia) —— 纯粹阻力减速，模拟抛出惯性。
 * 回弹阶段 (returning) —— 欠阻尼弹簧，产生弹性 bounce 效果。
 */
function updatePhysics(dt: number) {
  const drag = Math.exp(-(props.resistance / 80) * dt)

  for (const dot of dots) {
    if (dot.phase === 'idle') continue

    if (dot.phase === 'inertia') {
      // 阻力减速
      dot.vx *= drag
      dot.vy *= drag
      dot.xOffset += dot.vx * dt
      dot.yOffset += dot.vy * dt

      // 速度足够小 → 切换回弹阶段
      if (Math.hypot(dot.vx, dot.vy) < 1) {
        dot.phase = 'returning'
        dot.vx = 0
        dot.vy = 0
      }
    }

    if (dot.phase === 'returning') {
      // 欠阻尼弹簧: a = -k*x - b*v
      const k = 100  // 刚度
      const b = 14   // 阻尼系数 (b < 2*sqrt(k) 时欠阻尼 → 有弹跳)
      const ax = -k * dot.xOffset - b * dot.vx
      const ay = -k * dot.yOffset - b * dot.vy
      dot.vx += ax * dt
      dot.vy += ay * dt
      dot.xOffset += dot.vx * dt
      dot.yOffset += dot.vy * dt

      // 判断是否回到原位
      if (
        Math.abs(dot.xOffset) < 0.3 &&
        Math.abs(dot.yOffset) < 0.3 &&
        Math.abs(dot.vx) < 0.3 &&
        Math.abs(dot.vy) < 0.3
      ) {
        dot.xOffset = 0
        dot.yOffset = 0
        dot.vx = 0
        dot.vy = 0
        dot.phase = 'idle'
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Render loop
// ---------------------------------------------------------------------------

function draw() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const now = performance.now()
  const dt = Math.min((now - prevTime) / 1000, 0.05) // 限制 dt 防止物理爆炸
  prevTime = now

  // 先更新物理再绘制
  updatePhysics(dt)

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const px = pointer.x
  const py = pointer.y
  const { baseColor, activeColor, proximity } = props

  for (const dot of dots) {
    const ox = dot.cx + dot.xOffset
    const oy = dot.cy + dot.yOffset
    const dx = dot.cx - px
    const dy = dot.cy - py
    const dsq = dx * dx + dy * dy

    // 颜色插值：靠近指针时从 baseColor 渐变到 activeColor
    let color = baseColor
    if (dsq <= proxSq.value) {
      const dist = Math.sqrt(dsq)
      const t = 1 - dist / proximity
      const r = Math.round(baseRgb.value.r + (activeRgb.value.r - baseRgb.value.r) * t)
      const g = Math.round(baseRgb.value.g + (activeRgb.value.g - baseRgb.value.g) * t)
      const b = Math.round(baseRgb.value.b + (activeRgb.value.b - baseRgb.value.b) * t)
      color = `rgb(${r},${g},${b})`
    }

    ctx.save()
    ctx.translate(ox, oy)
    ctx.fillStyle = color
    if (circlePath) ctx.fill(circlePath)
    ctx.restore()
  }

  rafId = requestAnimationFrame(draw)
}

// ---------------------------------------------------------------------------
// Event handlers
// ---------------------------------------------------------------------------

/**
 * mousemove 处理：
 * - 实时更新指针位置 (给 render loop 用于颜色插值)
 * - 当移动速度超过 speedTrigger 时，推开感应范围内的点
 */
function onMove(e: MouseEvent) {
  const now = performance.now()
  const dt = pointer.lastTime ? now - pointer.lastTime : 16
  const dx = e.clientX - pointer.lastX
  const dy = e.clientY - pointer.lastY

  let vx = (dx / dt) * 1000
  let vy = (dy / dt) * 1000
  let speed = Math.hypot(vx, vy)

  if (speed > props.maxSpeed) {
    const scale = props.maxSpeed / speed
    vx *= scale
    vy *= scale
    speed = props.maxSpeed
  }

  pointer.lastTime = now
  pointer.lastX = e.clientX
  pointer.lastY = e.clientY
  pointer.vx = vx
  pointer.vy = vy
  pointer.speed = speed

  const rect = canvasRef.value!.getBoundingClientRect()
  pointer.x = e.clientX - rect.left
  pointer.y = e.clientY - rect.top

  // 对足够近且空闲的点施加惯性脉冲
  if (speed > props.speedTrigger) {
    for (const dot of dots) {
      const dist = Math.hypot(dot.cx - pointer.x, dot.cy - pointer.y)
      if (dist < props.proximity && dot.phase === 'idle') {
        dot.phase = 'inertia'
        // 脉冲方向 = 离心方向 + 鼠标移动方向分量
        dot.vx += ((dot.cx - pointer.x) + vx * 0.005) * 5
        dot.vy += ((dot.cy - pointer.y) + vy * 0.005) * 5
      }
    }
  }
}

/**
 * click 处理：以点击位置为中心产生径向冲击波。
 */
function onClick(e: MouseEvent) {
  const rect = canvasRef.value!.getBoundingClientRect()
  const cx = e.clientX - rect.left
  const cy = e.clientY - rect.top

  for (const dot of dots) {
    if (dot.phase !== 'idle') continue
    const dist = Math.hypot(dot.cx - cx, dot.cy - cy)
    if (dist < props.shockRadius) {
      dot.phase = 'inertia'
      const falloff = Math.max(0, 1 - dist / props.shockRadius)
      dot.vx += (dot.cx - cx) * props.shockStrength * falloff * 3
      dot.vy += (dot.cy - cy) * props.shockStrength * falloff * 3
    }
  }
}

// ---------------------------------------------------------------------------
// Throttle
// ---------------------------------------------------------------------------

function throttle<T extends (...args: any[]) => void>(fn: T, limit: number): T {
  let lastCall = 0
  return function (this: any, ...args: any[]) {
    const now = performance.now()
    if (now - lastCall >= limit) {
      lastCall = now
      fn.apply(this, args)
    }
  } as T
}

// ---------------------------------------------------------------------------
// Lifecycle
// ---------------------------------------------------------------------------

let throttledMove: ((e: MouseEvent) => void) | null = null
let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  // 创建 Path2D 缓存
  if (typeof Path2D !== 'undefined') {
    circlePath = new Path2D()
    circlePath.arc(0, 0, props.dotSize / 2, 0, Math.PI * 2)
  }

  buildGrid()

  // 监听容器尺寸变化 → 重构网格
  if ('ResizeObserver' in window) {
    resizeObserver = new ResizeObserver(() => buildGrid())
    if (wrapperRef.value) resizeObserver.observe(wrapperRef.value)
  } else {
    (window as any).addEventListener('resize', buildGrid)
  }

  // 启动渲染循环
  prevTime = performance.now()
  rafId = requestAnimationFrame(draw)

  // 绑定事件 (mousemove 节流到 ~30fps 以避免过多 dot 遍历)
  throttledMove = throttle(onMove, 32)
  window.addEventListener('mousemove', throttledMove, { passive: true })
  window.addEventListener('click', onClick)
})

onUnmounted(() => {
  cancelAnimationFrame(rafId)
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  } else {
    window.removeEventListener('resize', buildGrid)
  }
  if (throttledMove) {
    window.removeEventListener('mousemove', throttledMove)
  }
  window.removeEventListener('click', onClick)
  dots.length = 0
})
</script>

<style scoped>
.dot-grid {
  padding: 1em;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  position: relative;
}

.dot-grid__wrap {
  width: 100%;
  height: 100%;
  position: relative;
}

.dot-grid__canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.dot-grid__slot {
  position: relative;
  z-index: 1;
  pointer-events: auto;
}
</style>
