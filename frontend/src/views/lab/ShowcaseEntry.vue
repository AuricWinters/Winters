<template>
  <div class="showcase-page">
    <header class="showcase-header">
      <router-link to="/lab/showcase" class="back-link">← 组件实验室</router-link>
      <h1>🎬 入场动画</h1>
    </header>
    <div class="showcase-grid">
      <ShowcaseCard v-for="comp in components" :key="comp.name" :comp="comp" />
    </div>
  </div>
</template>

<script setup>
import { markRaw } from 'vue'
import ShowcaseCard from '../../components/ShowcaseCard.vue'
import BounceCards from '../../components/BounceCards.vue'
import AnimatedList from '../../components/AnimatedList.vue'
import DecayCard from '../../components/DecayCard.vue'
import ScrollReveal from '../../components/ScrollReveal.vue'
import CardSwap from '../../components/CardSwap.vue'

const components = [
  { name: 'BounceCards', component: markRaw(BounceCards), props: { items: ['A','B','C'] }, slot: '{{item}}', level: 'Medium' },
  { name: 'AnimatedList', component: markRaw(AnimatedList), props: { items: ['Item 1','Item 2','Item 3'] }, level: 'Medium' },
  { name: 'DecayCard', component: markRaw(DecayCard), slot: '🌀', level: 'Medium' },
  { name: 'ScrollReveal', component: markRaw(ScrollReveal), slot: 'Scroll', level: 'Hard' },
  { name: 'CardSwap', component: markRaw(CardSwap), level: 'Hard' },
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
