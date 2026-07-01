<template>
  <div class="docs-page">
    <canvas class="particles-background" />

    <div class="docs-container">
      <header class="docs-hero scroll-reveal">
        <div class="hero-badge">📖 Winters</div>
        <h1 class="hero-title">官方文档</h1>
        <p class="hero-sub">
          项目说明书——功能列表、启动方式、API 端点、版本记录。像产品手册一样清晰。
        </p>
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

<script setup>
import { ref, onMounted } from 'vue';
import { useParticles } from '../composables/useParticles.js';
import { useScrollReveal } from '../composables/useScrollReveal.js';

useParticles('.particles-background');
useScrollReveal();

const activeTab = ref('readme');
const readmeHtml = ref('');
const changelogHtml = ref('');

// 简单的 Markdown → HTML 转换
function simpleMdToHtml(md) {
  return md
    // 代码块 (```)
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="code-block"><code>$2</code></pre>')
    // 内联代码
    .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
    // 标题
    .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // 粗体 + 斜体
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // 链接
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
    // 水平线
    .replace(/^---$/gm, '<hr>')
    // 无序列表
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
    // 有序列表
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    // 表格 (简化：检测 | 开头的行)
    .replace(/^\|(.+)\|$/gm, (match) => {
      const cells = match.split('|').filter(c => c.trim());
      if (match.includes('---')) return '';
      return '<tr>' + cells.map(c => {
        const trimmed = c.trim();
        return trimmed.startsWith('**') && trimmed.endsWith('**')
          ? `<th>${trimmed.slice(2, -2)}</th>`
          : `<td>${trimmed}</td>`;
      }).join('') + '</tr>';
    })
    // 包裹表格行
    .replace(/(<tr>.*<\/tr>\n?)+/g, '<table>$&</table>')
    // 段落
    .replace(/^(?!<[a-z]|$)(.+)$/gm, '<p>$1</p>')
    // 清理多余空行
    .replace(/\n{3,}/g, '\n\n');
}

onMounted(async () => {
  try {
    const [readmeRes, changelogRes] = await Promise.all([
      fetch('/api/docs/readme'),
      fetch('/api/docs/changelog'),
    ]);
    if (readmeRes.ok) {
      const data = await readmeRes.json();
      readmeHtml.value = simpleMdToHtml(data.content || '');
    }
    if (changelogRes.ok) {
      const data = await changelogRes.json();
      changelogHtml.value = simpleMdToHtml(data.content || '');
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
.md-body :deep(.code-block) {
  background: rgba(var(--primary-rgb), 0.06); border-radius: 10px;
  padding: 18px 22px; overflow-x: auto; margin: 16px 0;
  font-family: 'JetBrains Mono', 'Fira Code', monospace; font-size: 13px;
  line-height: 1.6; border-left: 3px solid var(--primary);
}
.md-body :deep(.inline-code) {
  background: rgba(var(--primary-rgb), 0.06); padding: 2px 8px;
  border-radius: 5px; font-family: 'JetBrains Mono', monospace; font-size: 13px;
  color: var(--primary);
}
.md-body :deep(hr) { border: none; border-top: 1px solid var(--border-color); margin: 24px 0; }
.md-body :deep(table) {
  width: 100%; border-collapse: collapse; margin: 16px 0;
  font-size: 14px;
}
.md-body :deep(th) {
  text-align: left; padding: 10px 14px;
  background: rgba(var(--primary-rgb), 0.06); font-weight: 700;
}
.md-body :deep(td) { padding: 10px 14px; border-bottom: 1px solid var(--border-color); }

@media (max-width: 768px) {
  .hero-title { font-size: 34px; }
  .md-body { padding: 24px 20px; }
}
</style>
