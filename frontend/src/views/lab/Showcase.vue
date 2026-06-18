<template>
  <div class="showcase-page">
    <header class="showcase-header">
      <h1>🧪 组件实验室</h1>
      <p>84 个 React Bits 组件 · Vue 3 移植 · 悬停交互查看效果</p>
      <div class="category-nav">
        <button v-for="cat in categories" :key="cat.key"
          class="cat-btn" :class="{ active: activeCat === cat.key }"
          @click="activeCat = cat.key">{{ cat.icon }} {{ cat.label }}</button>
      </div>
    </header>

    <section v-for="cat in visibleCategories" :key="cat.key" class="showcase-section">
      <h2 class="section-head">{{ cat.icon }} {{ cat.label }} <span class="count">{{ cat.components.length }}</span></h2>
      <div class="showcase-grid">
        <div v-for="comp in cat.components" :key="comp.name" class="showcase-card">
          <div class="comp-header">
            <span class="comp-name">{{ comp.name }}</span>
            <span :class="['comp-tag', comp.level]">{{ comp.level }}</span>
          </div>
          <div class="comp-demo">
            <SafeDemo>
              <template v-if="comp.component">
                <component :is="comp.component" v-bind="comp.props || {}" />
              </template>
            <template v-else-if="comp.showDirective">
              <div class="directive-demo" v-spotlight>
                <span>{{ comp.name }}</span>
              </div>
            </template>
            <template v-else>
              <span style="color:var(--text-secondary)">{{ comp.name }}</span>
            </template>
            </SafeDemo>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, markRaw } from 'vue'
import SafeDemo from '../../components/SafeDemo.vue'

// ====== 🔤 文字特效 ======
import ShinyText from '../../components/ShinyText.vue'
import GradientText from '../../components/GradientText.vue'
import GlitchText from '../../components/GlitchText.vue'
import RotatingText from '../../components/RotatingText.vue'
import FallingText from '../../components/FallingText.vue'
import FuzzyText from '../../components/FuzzyText.vue'
import ScrambledText from '../../components/ScrambledText.vue'
import ASCIIText from '../../components/ASCIIText.vue'
import TextCursor from '../../components/TextCursor.vue'
import TrueFocus from '../../components/TrueFocus.vue'
import SplitText from '../../components/SplitText.vue'
import DecryptedText from '../../components/DecryptedText.vue'
import Shuffle from '../../components/Shuffle.vue'
import TextPressure from '../../components/TextPressure.vue'
import VariableProximity from '../../components/VariableProximity.vue'
import ScrollVelocity from '../../components/ScrollVelocity.vue'
import CurvedLoop from '../../components/CurvedLoop.vue'

// ====== 🖱️ 悬停交互 ======
import GlareHover from '../../components/GlareHover.vue'
import StarBorder from '../../components/StarBorder.vue'
import StickerPeel from '../../components/StickerPeel.vue'
import Crosshair from '../../components/Crosshair.vue'
import LogoLoop from '../../components/LogoLoop.vue'
import MagicRings from '../../components/MagicRings.vue'

// ====== 🎬 入场动画 ======
import BounceCards from '../../components/BounceCards.vue'
import AnimatedList from '../../components/AnimatedList.vue'
import DecayCard from '../../components/DecayCard.vue'
import ScrollReveal from '../../components/ScrollReveal.vue'
import CardSwap from '../../components/CardSwap.vue'

// ====== 🌈 背景装饰 ======
import DotField from '../../components/DotField.vue'
import WavesBg from '../../components/WavesBg.vue'
import LightRays from '../../components/LightRays.vue'
import PixelSnow from '../../components/PixelSnow.vue'
import GradientBlinds from '../../components/GradientBlinds.vue'
import Dither from '../../components/Dither.vue'
import DotGrid from '../../components/DotGrid.vue'
import Radar from '../../components/Radar.vue'
import RippleGrid from '../../components/RippleGrid.vue'
import Lightfall from '../../components/Lightfall.vue'
import Lightning from '../../components/Lightning.vue'
import ColorBends from '../../components/ColorBends.vue'

// ====== 🧩 UI 组件 ======
import MasonryGrid from '../../components/MasonryGrid.vue'
import CircularText from '../../components/CircularText.vue'
import Ribbons from '../../components/Ribbons.vue'
import PillNav from '../../components/PillNav.vue'
import Stepper from '../../components/Stepper.vue'
import Carousel from '../../components/Carousel.vue'
import Stack from '../../components/Stack.vue'
import BubbleMenu from '../../components/BubbleMenu.vue'
import StaggeredMenu from '../../components/StaggeredMenu.vue'
import FlowingMenu from '../../components/FlowingMenu.vue'
import InfiniteMenu from '../../components/InfiniteMenu.vue'
import CircularGallery from '../../components/CircularGallery.vue'
import DomeGallery from '../../components/DomeGallery.vue'
import ScrollStack from '../../components/ScrollStack.vue'
import Lanyard from '../../components/Lanyard.vue'

// ====== 🔧 3D / 工具 ======
import Antigravity from '../../components/Antigravity.vue'
import Aurora from '../../components/Aurora.vue'
import Beams from '../../components/Beams.vue'
import FloatingLines from '../../components/FloatingLines.vue'
import Galaxy from '../../components/Galaxy.vue'
import Hyperspeed from '../../components/Hyperspeed.vue'
import Iridescence from '../../components/Iridescence.vue'
import LiquidChrome from '../../components/LiquidChrome.vue'
import Orb from '../../components/Orb.vue'
import Plasma from '../../components/Plasma.vue'
import Prism from '../../components/Prism.vue'
import Threads from '../../components/Threads.vue'
import FluidGlass from '../../components/FluidGlass.vue'
import FlyingPosters from '../../components/FlyingPosters.vue'
import ModelViewer from '../../components/ModelViewer.vue'
import ImageTrail from '../../components/ImageTrail.vue'
import OrbitImages from '../../components/OrbitImages.vue'
import Strands from '../../components/Strands.vue'
// PixelCard & MetallicPaint not created

const categories = [
  {
    key: 'text', icon: '🔤', label: '文字特效',
    components: [
      { name: 'ShinyText', component: markRaw(ShinyText), props: { text: 'Shiny Text' }, level: 'Easy' },
      { name: 'GradientText', component: markRaw(GradientText), props: { text: 'Gradient' }, level: 'Easy' },
      { name: 'GlitchText', component: markRaw(GlitchText), props: { text: 'GLITCH' }, level: 'Easy' },
      { name: 'RotatingText', component: markRaw(RotatingText), props: { texts: ['Hello','World','Vue'] }, level: 'Easy' },
      { name: 'FallingText', component: markRaw(FallingText), props: { text: 'Falling' }, level: 'Medium' },
      { name: 'FuzzyText', component: markRaw(FuzzyText), props: { text: 'Fuzzy' }, level: 'Medium' },
      { name: 'ScrambledText', component: markRaw(ScrambledText), props: { text: 'Scramble' }, level: 'Medium' },
      { name: 'ASCIIText', component: markRaw(ASCIIText), props: { text: 'ASCII' }, level: 'Easy' },
      { name: 'TextCursor', component: markRaw(TextCursor), props: { text: 'Cursor|' }, level: 'Easy' },
      { name: 'TrueFocus', component: markRaw(TrueFocus), props: { text: 'Focus' }, level: 'Medium' },
      { name: 'SplitText', component: markRaw(SplitText), props: { text: 'Split' }, level: 'Hard' },
      { name: 'DecryptedText', component: markRaw(DecryptedText), props: { text: 'Decrypt' }, level: 'Hard' },
      { name: 'Shuffle', component: markRaw(Shuffle), props: { text: 'Shuffle' }, level: 'Medium' },
      { name: 'TextPressure', component: markRaw(TextPressure), props: { text: 'Press' }, level: 'Hard' },
      { name: 'VariableProximity', component: markRaw(VariableProximity), props: { text: 'Proximity' }, level: 'Hard' },
      { name: 'ScrollVelocity', component: markRaw(ScrollVelocity), props: { text: 'Velocity' }, level: 'Medium' },
      { name: 'CurvedLoop', component: markRaw(CurvedLoop), props: { text: 'Curved' }, level: 'Medium' },
    ]
  },
  {
    key: 'hover', icon: '🖱️', label: '悬停交互',
    components: [
      { name: 'v-spotlight', showDirective: true, level: 'Easy' },
      { name: 'v-tilt', showDirective: false, level: 'Easy' },
      { name: 'v-magnet', showDirective: false, level: 'Easy' },
      { name: 'GlareHover', component: markRaw(GlareHover), slot: '✨ Hover me', level: 'Easy' },
      { name: 'StarBorder', component: markRaw(StarBorder), slot: '★ Star', level: 'Easy' },
      { name: 'StickerPeel', component: markRaw(StickerPeel), slot: '📌 Peel', level: 'Easy' },
      { name: 'Crosshair', component: markRaw(Crosshair), level: 'Easy' },
      { name: 'LogoLoop', component: markRaw(LogoLoop), level: 'Easy' },
      { name: 'MagicRings', component: markRaw(MagicRings), level: 'Medium' },
    ]
  },
  {
    key: 'entry', icon: '🎬', label: '入场动画',
    components: [
      { name: 'BounceCards', component: markRaw(BounceCards), props: { items: ['A','B','C'] }, slot: '{{ item }}', level: 'Medium' },
      { name: 'AnimatedList', component: markRaw(AnimatedList), props: { items: ['Item 1','Item 2','Item 3'] }, level: 'Medium' },
      { name: 'DecayCard', component: markRaw(DecayCard), slot: '🌀 Hover', level: 'Medium' },
      { name: 'ScrollReveal', component: markRaw(ScrollReveal), slot: 'Scroll', level: 'Hard' },
      { name: 'CardSwap', component: markRaw(CardSwap), level: 'Hard' },
    ]
  },
  {
    key: 'bg', icon: '🌈', label: '背景装饰',
    components: [
      { name: 'DotField', component: markRaw(DotField), level: 'Medium' },
      { name: 'WavesBg', component: markRaw(WavesBg), level: 'Medium' },
      { name: 'LightRays', component: markRaw(LightRays), level: 'Medium' },
      { name: 'PixelSnow', component: markRaw(PixelSnow), level: 'Easy' },
      { name: 'GradientBlinds', component: markRaw(GradientBlinds), level: 'Medium' },
      { name: 'Dither', component: markRaw(Dither), level: 'Easy' },
      { name: 'DotGrid', component: markRaw(DotGrid), level: 'Easy' },
      { name: 'Radar', component: markRaw(Radar), level: 'Medium' },
      { name: 'RippleGrid', component: markRaw(RippleGrid), level: 'Medium' },
      { name: 'Lightfall', component: markRaw(Lightfall), level: 'Medium' },
      { name: 'Lightning', component: markRaw(Lightning), level: 'Medium' },
      { name: 'ColorBends', component: markRaw(ColorBends), level: 'Medium' },
    ]
  },
  {
    key: 'ui', icon: '🧩', label: 'UI 组件',
    components: [
      { name: 'MasonryGrid', component: markRaw(MasonryGrid), props: { items: ['A','B','C','D'] }, level: 'Medium' },
      { name: 'CircularText', component: markRaw(CircularText), props: { text: 'COMPONENTS' }, level: 'Medium' },
      { name: 'Ribbons', component: markRaw(Ribbons), level: 'Medium' },
      { name: 'PillNav', component: markRaw(PillNav), level: 'Hard' },
      { name: 'Stepper', component: markRaw(Stepper), level: 'Medium' },
      { name: 'Carousel', component: markRaw(Carousel), level: 'Hard' },
      { name: 'Stack', component: markRaw(Stack), level: 'Medium' },
      { name: 'BubbleMenu', component: markRaw(BubbleMenu), level: 'Medium' },
      { name: 'StaggeredMenu', component: markRaw(StaggeredMenu), level: 'Hard' },
      { name: 'FlowingMenu', component: markRaw(FlowingMenu), level: 'Medium' },
      { name: 'InfiniteMenu', component: markRaw(InfiniteMenu), level: 'Hard' },
      { name: 'CircularGallery', component: markRaw(CircularGallery), level: 'Hard' },
      { name: 'DomeGallery', component: markRaw(DomeGallery), level: 'Hard' },
      { name: 'ScrollStack', component: markRaw(ScrollStack), level: 'Hard' },
      { name: 'Lanyard', component: markRaw(Lanyard), level: 'Hard' },
    ]
  },
  {
    key: '3d', icon: '🔧', label: '3D / 工具',
    components: [
      { name: 'Antigravity', component: markRaw(Antigravity), level: 'Medium' },
      { name: 'Aurora', component: markRaw(Aurora), level: 'WebGL' },
      { name: 'Beams', component: markRaw(Beams), level: 'WebGL' },
      { name: 'FloatingLines', component: markRaw(FloatingLines), level: 'WebGL' },
      { name: 'Galaxy', component: markRaw(Galaxy), level: 'WebGL' },
      { name: 'Hyperspeed', component: markRaw(Hyperspeed), level: 'WebGL' },
      { name: 'Iridescence', component: markRaw(Iridescence), level: 'WebGL' },
      { name: 'LiquidChrome', component: markRaw(LiquidChrome), level: 'WebGL' },
      { name: 'Orb', component: markRaw(Orb), level: 'WebGL' },
      { name: 'Plasma', component: markRaw(Plasma), level: 'WebGL' },
      { name: 'Prism', component: markRaw(Prism), level: 'WebGL' },
      { name: 'Threads', component: markRaw(Threads), level: 'WebGL' },
      { name: 'FluidGlass', component: markRaw(FluidGlass), level: 'WebGL' },
      { name: 'FlyingPosters', component: markRaw(FlyingPosters), level: 'WebGL' },
      { name: 'ModelViewer', component: markRaw(ModelViewer), level: 'WebGL' },
      { name: 'ImageTrail', component: markRaw(ImageTrail), level: 'Hard' },
      { name: 'OrbitImages', component: markRaw(OrbitImages), level: 'Hard' },
      { name: 'Strands', component: markRaw(Strands), level: 'Medium' },
      // MetallicPaint & PixelCard not created
    ]
  },
]

const activeCat = ref('all')
const visibleCategories = computed(() => {
  if (activeCat.value === 'all') return categories
  return categories.filter(c => c.key === activeCat.value)
})
</script>

<style scoped>
.showcase-page {
  min-height: 100vh;
  padding: 100px 40px 60px;
  max-width: 1600px;
  margin: 0 auto;
}
.showcase-header {
  text-align: center;
  margin-bottom: 48px;
}
.showcase-header h1 {
  font-size: 40px;
  font-weight: 900;
  margin-bottom: 8px;
  color: var(--text-main);
}
.showcase-header p {
  color: var(--text-secondary);
  margin-bottom: 24px;
}
.category-nav {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
}
.cat-btn {
  padding: 8px 18px;
  border-radius: 100px;
  border: 1px solid var(--border-color);
  background: var(--bg-card);
  color: var(--text-secondary);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}
.cat-btn:hover, .cat-btn.active {
  border-color: var(--primary);
  color: var(--text-main);
}
.cat-btn.active {
  background: rgba(var(--primary-rgb), 0.1);
}
.section-head {
  font-size: 22px;
  font-weight: 800;
  margin: 48px 0 20px;
  color: var(--text-main);
}
.section-head .count {
  font-size: 14px;
  color: var(--text-secondary);
  font-weight: 400;
}
.showcase-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}
.showcase-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s;
}
.showcase-card:hover {
  border-color: rgba(var(--primary-rgb), 0.3);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
.comp-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
}
.comp-name {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-main);
}
.comp-tag {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 600;
}
.comp-tag.Easy { background: rgba(52,211,153,0.12); color: #34d399; }
.comp-tag.Medium { background: rgba(251,191,36,0.12); color: #fbbf24; }
.comp-tag.Hard { background: rgba(239,68,68,0.12); color: #f87171; }
.comp-tag.WebGL { background: rgba(167,139,250,0.12); color: #a78bfa; }
.comp-demo {
  padding: 16px;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}
.comp-demo :deep(.card-hover-slot) {
  min-height: 40px;
  min-width: 100px;
}
.directive-demo {
  width: 120px;
  height: 60px;
  background: rgba(var(--primary-rgb), 0.05);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: var(--text-secondary);
}
@media (max-width: 768px) {
  .showcase-page { padding: 80px 16px 40px; }
  .showcase-grid { grid-template-columns: 1fr 1fr; }
}
</style>
