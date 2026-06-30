<template>
  <div class="showcase-page">
    <header class="showcase-header">
      <router-link
        to="/lab/showcase"
        class="back-link"
      >
        ← 组件实验室
      </router-link>
      <h1>🧩 UI 组件</h1>
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
import MasonryGrid from '../../components/MasonryGrid.vue'
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

const components = [
  { name: 'MasonryGrid', component: markRaw(MasonryGrid), props: { items: ['A','B','C','D'] }, level: 'Medium' },
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
