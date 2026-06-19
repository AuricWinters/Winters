<template>
  <div class="showcase-page">
    <header class="showcase-header">
      <router-link to="/lab/showcase" class="back-link">← 组件实验室</router-link>
      <h1>🔤 文字特效</h1>
    </header>
    <div class="showcase-grid">
      <ShowcaseCard v-for="comp in components" :key="comp.name" :comp="comp" />
    </div>
  </div>
</template>

<script setup>
import { markRaw } from 'vue'
import ShowcaseCard from '../../components/ShowcaseCard.vue'
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
import TextType from '../../components/TextType.vue'
import CircularText from '../../components/CircularText.vue'
import ScrollVelocity from '../../components/ScrollVelocity.vue'
import CurvedLoop from '../../components/CurvedLoop.vue'

const components = [
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
  { name: 'TextType', component: markRaw(TextType), level: 'Hard' },
  { name: 'CircularText', component: markRaw(CircularText), props: { text: 'COMPONENTS' }, level: 'Medium' },
  { name: 'ScrollVelocity', component: markRaw(ScrollVelocity), props: { text: 'Velocity' }, level: 'Medium' },
  { name: 'CurvedLoop', component: markRaw(CurvedLoop), props: { text: 'Curved' }, level: 'Medium' },
]
</script>

<style scoped>
.showcase-page { min-height: 100vh; padding: 100px 40px 60px; max-width: 1400px; margin: 0 auto; }
.showcase-header { margin-bottom: 32px; }
.showcase-header h1 { font-size: 32px; font-weight: 900; color: var(--text-main); margin: 8px 0 0; }
.back-link { color: var(--text-secondary); text-decoration: none; font-size: 14px; }
.back-link:hover { color: var(--primary); }
.showcase-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; }
@media (max-width: 768px) { .showcase-page { padding: 80px 16px 40px; } .showcase-grid { grid-template-columns: 1fr 1fr; } }
</style>
