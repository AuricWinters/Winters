<template>
  <div class="showcase-page">
    <header class="showcase-header">
      <router-link
        to="/lab/showcase"
        class="back-link"
      >
        ← 组件实验室
      </router-link>
      <h1>🔧 3D / 工具</h1>
    </header>
    <div class="showcase-grid">
      <ShowcaseCard
        v-for="comp in components"
        :key="comp.name"
        :comp="comp"
      />
    </div>
  </div>
</template>

<script setup>
import { markRaw } from 'vue'
import ShowcaseCard from '../../components/ShowcaseCard.vue'
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
import ImageTrail from '../../components/ImageTrail.vue'
import OrbitImages from '../../components/OrbitImages.vue'
import Strands from '../../components/Strands.vue'
import Particles from '../../components/Particles.vue'

const components = [
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
  { name: 'ImageTrail', component: markRaw(ImageTrail), level: 'Hard' },
  { name: 'OrbitImages', component: markRaw(OrbitImages), level: 'Hard' },
  { name: 'Strands', component: markRaw(Strands), level: 'Medium' },
  { name: 'Particles', component: markRaw(Particles), level: 'WebGL' },
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
