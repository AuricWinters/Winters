/**
 * effectStore — 动效槽位状态管理
 * 所有动效通过槽位切换，用户可在设置中选择
 */
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

type SlotKey = 'heading' | 'cardHover' | 'cardEntry' | 'buttonHover' | 'bgDecor' | 'textDecor' | 'clickFeedback' | 'pageTransition' | 'navStyle'

interface EffectSlots {
  heading: string
  cardHover: string
  cardEntry: string
  buttonHover: string
  bgDecor: string
  textDecor: string
  clickFeedback: string
  pageTransition: string
  navStyle: string
}

interface SlotOption {
  value: string
  label: string
}

type SlotOptionsMap = Record<SlotKey, SlotOption[]>

const defaultSlots: EffectSlots = {
  heading: 'shinyText',         // ShinyText | GradientText | GlitchText | RotatingText
  cardHover: 'spotlight',       // Spotlight | Tilt | BorderGlow | GlareHover | None
  cardEntry: 'fadeUp',          // BounceCards | BlurReveal | AnimatedList | fadeUp | None
  buttonHover: 'magnet',        // Magnet | StarBorder | None
  bgDecor: 'dotField',          // DotField | Waves | LightRays | PixelSnow | ColorBends | None
  textDecor: 'none',            // CircularText | CountUp | TextType | FallingText | None
  clickFeedback: 'clickSpark',  // ClickSpark | Crosshair | GhostCursor | None
  pageTransition: 'fade',       // fade | BlurReveal | None
  navStyle: 'glass',            // glass | GooeyNav | FloatingNav | default
}

const slotOptions: SlotOptionsMap = {
  heading: [
    { value: 'shinyText', label: '金属光泽' },
    { value: 'gradientText', label: '渐变流动' },
    { value: 'glitchText', label: '故障抖动' },
    { value: 'rotatingText', label: '轮播切换' },
  ],
  cardHover: [
    { value: 'spotlight', label: '聚光灯' },
    { value: 'tilt', label: '3D 倾斜' },
    { value: 'borderGlow', label: '发光边框' },
    { value: 'glareHover', label: '光泽扫过' },
    { value: 'none', label: '无' },
  ],
  cardEntry: [
    { value: 'fadeUp', label: '淡入上浮' },
    { value: 'bounceCards', label: '弹性弹入' },
    { value: 'blurReveal', label: '模糊渐显' },
    { value: 'animatedList', label: '交错入场' },
    { value: 'none', label: '无' },
  ],
  buttonHover: [
    { value: 'magnet', label: '磁性吸附' },
    { value: 'starBorder', label: '星光旋转' },
    { value: 'none', label: '无' },
  ],
  bgDecor: [
    { value: 'none', label: '无' },
    { value: 'dotField', label: '点阵交互' },
    { value: 'waves', label: '波浪' },
    { value: 'lightRays', label: '光柱' },
    { value: 'pixelSnow', label: '像素雪' },
    { value: 'colorBends', label: '渐变扭动' },
  ],
  textDecor: [
    { value: 'none', label: '无' },
    { value: 'circularText', label: '环形旋转' },
    { value: 'countUp', label: '数字滚动' },
    { value: 'textType', label: '打字机' },
    { value: 'fallingText', label: '飘落文字' },
  ],
  clickFeedback: [
    { value: 'clickSpark', label: '粒子爆发' },
    { value: 'crosshair', label: '准星光标' },
    { value: 'ghostCursor', label: '拖影光标' },
    { value: 'none', label: '无' },
  ],
  pageTransition: [
    { value: 'fade', label: '淡入淡出' },
    { value: 'blurReveal', label: '模糊过渡' },
    { value: 'none', label: '无' },
  ],
  navStyle: [
    { value: 'glass', label: '玻璃拟态' },
    { value: 'gooeyNav', label: '果冻粘性' },
    { value: 'default', label: '默认扁平' },
  ],
}

export const useEffectStore = defineStore('effects', () => {
  // 从 localStorage 读取，否则用默认值
  let saved: EffectSlots | null = null
  try { saved = JSON.parse(localStorage.getItem('winters_effects') || 'null') } catch { saved = null }
  const slots = ref<EffectSlots>({ ...defaultSlots, ...saved })

  // 持久化
  watch(slots, (v: EffectSlots) => {
    localStorage.setItem('winters_effects', JSON.stringify(v))
  }, { deep: true })

  function setSlot(key: string, value: string): void {
    if (key in slots.value) {
      slots.value = { ...slots.value, [key]: value }
    }
  }

  function resetSlot(key: string): void {
    if (key in defaultSlots) {
      (slots.value as any)[key] = (defaultSlots as any)[key]
    }
  }

  function resetAll(): void {
    slots.value = { ...defaultSlots }
  }

  return { slots, setSlot, resetSlot, resetAll, slotOptions }
})
