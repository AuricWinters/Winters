<template>
  <div class="showcase-page">
    <header class="showcase-header">
      <router-link
        to="/lab"
        class="back-link"
      >
        ← 实验室
      </router-link>
      <h1>🧪 组件实验室</h1>
      <p>84 个 React Bits 组件 · 点击卡片进入分类浏览</p>
    </header>
    <div class="category-grid">
      <router-link
        v-for="cat in categories"
        :key="cat.key"
        :to="cat.link"
        class="category-card"
      >
        <span class="cat-icon">{{ cat.icon }}</span>
        <span class="cat-label">{{ cat.label }}</span>
        <span class="cat-count">{{ cat.count }}</span>
      </router-link>
    </div>
  </div>
</template>

<script setup>
const categories = [
  { key: 'text', icon: '🔤', label: '文字特效', count: 17, link: '/lab/showcase/text' },
  { key: 'hover', icon: '🖱️', label: '悬停交互', count: 9, link: '/lab/showcase/hover' },
  { key: 'entry', icon: '🎬', label: '入场动画', count: 6, link: '/lab/showcase/entry' },
  { key: 'bg', icon: '🌈', label: '背景装饰', count: 12, link: '/lab/showcase/bg' },
  { key: 'ui', icon: '🧩', label: 'UI 组件', count: 15, link: '/lab/showcase/ui' },
  { key: '3d', icon: '🔧', label: '3D / 工具', count: 18, link: '/lab/showcase/3d' },
]
</script>

<style scoped>
.showcase-page { min-height: 100vh; padding: 100px 40px 60px; max-width: 1000px; margin: 0 auto; }
.showcase-header { text-align: center; margin-bottom: 48px; }
.showcase-header h1 { font-size: 40px; font-weight: 900; color: var(--text-main); margin: 8px 0; }
.showcase-header p { color: var(--text-secondary); }
.back-link { color: var(--text-secondary); text-decoration: none; font-size: 14px; }
.back-link:hover { color: var(--primary); }
.category-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.category-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 32px;
  text-align: center;
  text-decoration: none;
  transition: all 0.3s;
  display: flex; flex-direction: column; align-items: center; gap: 12px;
}
.category-card:hover { border-color: var(--primary); transform: translateY(-4px); box-shadow: var(--shadow-lg); }
.cat-icon { font-size: 48px; }
.cat-label { font-size: 18px; font-weight: 700; color: var(--text-main); }
.cat-count { font-size: 13px; color: var(--text-secondary); background: rgba(var(--primary-rgb),0.08); padding: 2px 12px; border-radius: 10px; }
@media (max-width: 768px) { .category-grid { grid-template-columns: 1fr 1fr; } .showcase-page { padding: 80px 16px 40px; } }
</style>
