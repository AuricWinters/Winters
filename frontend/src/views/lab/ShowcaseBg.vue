<template>
  <div class="showcase-page">
    <header class="showcase-header">
      <router-link to="/lab/showcase" class="back-link">← 组件实验室</router-link>
      <h1>🌈 背景装饰</h1>
    </header>
    <div class="showcase-grid">
      <ShowcaseCard v-for="comp in components" :key="comp.name" :comp="comp" />
    </div>
  </div>
</template>

<script setup>
import { markRaw } from 'vue'
import ShowcaseCard from '../../components/ShowcaseCard.vue'
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

const components = [
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
