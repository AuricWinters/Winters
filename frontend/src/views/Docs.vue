<template>
  <div class="docs-page">
    <canvas class="particles-background" />

    <div class="docs-container">
      <header class="docs-hero scroll-reveal">
        <div class="doc-tabs">
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'readme' }"
            @click="activeTab = 'readme'"
          >
            📘 README
          </button>
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'changelog' }"
            @click="activeTab = 'changelog'"
          >
            📋 CHANGELOG
          </button>
        </div>
      </header>

      <section class="docs-content scroll-reveal">
        <div v-if="activeTab === 'readme'" class="md-body" v-html="readmeHtml" />
        <div v-else class="md-body" v-html="changelogHtml" />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useParticles } from '../composables/useParticles.ts';
import { useScrollReveal } from '../composables/useScrollReveal.ts';

useParticles('.particles-background');
useScrollReveal();

const activeTab = ref<string>('readme');
const readmeHtml = ref<string>('');
const changelogHtml = ref<string>('');

onMounted(async () => {
  try {
    const [readmeRes, changelogRes] = await Promise.all([
      fetch('/api/docs/readme'),
      fetch('/api/docs/changelog'),
    ]);
    if (readmeRes.ok) {
      const data = await readmeRes.json();
      readmeHtml.value = data.content || '';
    }
    if (changelogRes.ok) {
      const data = await changelogRes.json();
      changelogHtml.value = data.content || '';
    }
  } catch {
    readmeHtml.value = '<p>文档加载失败，请查看项目根目录的 README.md 和 CHANGELOG.md</p>';
  }
});
</script>

<style scoped>
.docs-page { position: relative; min-height: 100vh; }

.docs-container {
  position: relative; z-index: 10;
  max-width: 900px; margin: 0 auto;
  padding: 60px 24px 40px;
}

/* Hero */
.docs-hero { text-align: center; margin-bottom: 48px; }
.hero-badge {
  display: inline-block; padding: 6px 18px;
  background: rgba(var(--primary-rgb), 0.1);
  color: var(--primary); border-radius: 20px;
  font-size: 13px; font-weight: 600; margin-bottom: 20px;
}
.hero-title {
  font-size: 48px; font-weight: 900; margin: 0 0 16px;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
.hero-sub { font-size: 16px; color: var(--text-secondary); max-width: 600px; margin: 0 auto 28px; line-height: 1.6; }

/* Tabs */
.doc-tabs { display: flex; gap: 12px; justify-content: center; }
.tab-btn {
  padding: 10px 28px; border-radius: 12px; border: 2px solid var(--border-color);
  background: var(--bg-card); color: var(--text-secondary);
  font-size: 15px; font-weight: 600; cursor: pointer;
  transition: all 0.2s;
}
.tab-btn:hover { border-color: var(--primary); color: var(--primary); }
.tab-btn.active {
  background: var(--primary); border-color: var(--primary); color: #fff;
}

/* Markdown body */
.md-body {
  background: var(--bg-card); border-radius: var(--radius);
  padding: 40px 48px; box-shadow: var(--shadow-md);
  font-size: 15px; line-height: 1.8; color: var(--text-main);
}
.md-body :deep(h1) { font-size: 32px; font-weight: 900; margin: 32px 0 16px; color: var(--text-main); border-bottom: 2px solid var(--border-color); padding-bottom: 8px; }
.md-body :deep(h1:first-child) { margin-top: 0; }
.md-body :deep(h2) { font-size: 24px; font-weight: 800; margin: 28px 0 12px; color: var(--text-main); }
.md-body :deep(h3) { font-size: 19px; font-weight: 700; margin: 24px 0 10px; color: var(--text-main); }
.md-body :deep(h4) { font-size: 16px; font-weight: 700; margin: 20px 0 8px; color: var(--primary); }
.md-body :deep(p) { margin: 0 0 14px; }
.md-body :deep(ul) { margin: 0 0 14px; padding-left: 24px; }
.md-body :deep(li) { margin-bottom: 4px; }
.md-body :deep(strong) { color: var(--text-main); font-weight: 700; }
.md-body :deep(a) { color: var(--primary); text-decoration: none; }
.md-body :deep(a:hover) { text-decoration: underline; }
.md-body :deep(pre) {
  background: rgba(var(--primary-rgb), 0.06); border-radius: 10px;
  padding: 18px 22px; overflow-x: auto; margin: 16px 0;
  font-family: 'JetBrains Mono', 'Fira Code', monospace; font-size: 13px;
  line-height: 1.6; border-left: 3px solid var(--primary);
}
.md-body :deep(pre code) { background: none; padding: 0; border-radius: 0; font-size: inherit; }
.md-body :deep(code) {
  background: rgba(var(--primary-rgb), 0.06); padding: 2px 8px;
  border-radius: 5px; font-family: 'JetBrains Mono', monospace; font-size: 13px;
  color: var(--primary);
}
.md-body :deep(hr) { border: none; border-top: 1px solid var(--border-color); margin: 24px 0; }
.md-body :deep(table) {
  width: 100%; border-collapse: collapse; margin: 16px 0;
  font-size: 14px;
}
.md-body :deep(thead) { border-bottom: 2px solid var(--border-color); }
.md-body :deep(th) {
  text-align: left; padding: 10px 14px;
  background: rgba(var(--primary-rgb), 0.06); font-weight: 700;
}
.md-body :deep(td) { padding: 10px 14px; border-bottom: 1px solid var(--border-color); }
.md-body :deep(blockquote) {
  border-left: 4px solid var(--primary); margin: 16px 0; padding: 8px 18px;
  background: rgba(var(--primary-rgb), 0.04); border-radius: 0 8px 8px 0;
  color: var(--text-secondary);
}
.md-body :deep(ol) { margin: 0 0 14px; padding-left: 24px; }
.md-body :deep(ol li) { margin-bottom: 4px; }

@media (max-width: 768px) {
  .hero-title { font-size: 34px; }
  .md-body { padding: 24px 20px; }
}
</style>
