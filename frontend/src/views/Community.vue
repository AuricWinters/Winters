<template>
  <div class="community-page">
    <canvas class="particles-background" />

    <div class="community-container">
      <!-- 顶部 -->
      <header class="community-header scroll-reveal">
        <div class="header-top">
          <div class="header-title-row">
            <h1 class="page-title"><ShinyText :text="t('AI 社区')" /></h1>
            <span class="badge">Beta</span>
          </div>
          <button class="post-btn" @click="$router.push('/community/new')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            {{ t('发动态') }}
          </button>
        </div>
        <p class="header-desc">{{ t('AI 时代的前沿讨论 · 工具评测 · 经验分享 · 作品展示') }}</p>

        <!-- 分类 -->
        <div class="category-bar">
          <button v-for="c in categories" :key="c.value"
            class="cat-btn" :class="{ active: store.category === c.value }"
            @click="selectCategory(c.value)">
            {{ c.icon }} {{ t(c.label) }}
          </button>
        </div>

        <!-- 热门标签 -->
        <div class="tag-bar">
          <span class="tag-label">{{ t('热门话题') }}：</span>
          <button v-for="tag in hotTags" :key="tag"
            class="tag-btn" @click="selectTag(tag)"
            :class="{ active: store.tag === tag }">
            #{{ tag }}
          </button>
        </div>
      </header>

      <!-- ═══ 左侧边栏：导航区 ═══ -->
      <aside class="left-sidebar">
        <!-- 用户卡片 -->
        <div class="side-card card-spotlight user-card">
          <div class="uc-avatar">凌</div>
          <div class="uc-name">AuricWinters</div>
          <div class="uc-bio">AI 社区站长 · 全栈开发者</div>
          <div class="uc-stats">
            <span>15 动态</span><span>·</span><span>128 获赞</span>
          </div>
        </div>

        <!-- 快捷导航 -->
        <div class="side-card" v-spotlight>
          <h4 class="side-title">📂 {{ t('板块导航') }}</h4>
          <nav class="nav-list">
            <a v-for="c in categories" :key="c.value"
              class="nav-item" :class="{ active: store.category === c.value }"
              @click.prevent="selectCategory(c.value)">
              <span>{{ c.icon }}</span>
              <span>{{ t(c.label) }}</span>
            </a>
          </nav>
        </div>

        <!-- 快捷入口 -->
        <div class="side-card" v-spotlight>
          <h4 class="side-title">⚡ {{ t('快捷入口') }}</h4>
          <div class="quick-links">
            <a href="/ai" class="quick-link">{{ t('🤖 AI 聊天') }}</a>
            <a href="/learning" class="quick-link">{{ t('📖 学习路线') }}</a>
            <a href="/lab" class="quick-link">{{ t('🧪 实验室') }}</a>
            <a href="/projects" class="quick-link">{{ t('📦 项目') }}</a>
          </div>
        </div>
      </aside>

      <!-- ═══ 动态流 ═══ -->
      <div class="feed">
        <!-- 置顶 -->
        <article v-if="pinnedPost" class="post-card card-spotlight pinned scroll-reveal" v-spotlight @click="$router.push('/community/' + pinnedPost.id)">
          <div class="pin-badge">📌 {{ t('置顶') }}</div>
          <div class="post-header">
            <div class="author-avatar">{{ pinnedPost.author_name[0] }}</div>
            <div class="author-info">
              <div class="author-name">{{ pinnedPost.author_name }}</div>
              <div class="post-time">{{ pinnedPost.created_at }}</div>
            </div>
          </div>
          <h3 class="post-title">{{ pinnedPost.title }}</h3>
          <p class="post-body">{{ pinnedPost.content }}</p>
          <div class="post-tags">
            <span v-for="tag in (Array.isArray(pinnedPost.tags) ? pinnedPost.tags : JSON.parse(pinnedPost.tags || '[]'))" :key="tag" class="post-tag">#{{ tag }}</span>
          </div>
          <div class="post-actions">
            <button class="action-item" :class="{ liked: pinnedPost.liked }" @click="toggleLike(pinnedPost)">
              <svg viewBox="0 0 24 24" :fill="pinnedPost.liked ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              {{ formatCount(pinnedPost.likes_count) }}
            </button>
            <span class="action-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              {{ formatCount(pinnedPost.comments_count) }}
            </span>
            <span class="action-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              {{ formatCount(pinnedPost.views_count) }}
            </span>
          </div>
        </article>

        <!-- 动态列表 -->
        <article v-for="post in feedPosts" :key="post.id" class="post-card card-spotlight scroll-reveal" v-spotlight :style="{ '--delay': (post.id % 5) * 0.1 }" @click="$router.push('/community/' + post.id)">
          <div class="post-header">
            <div class="author-avatar">{{ post.author_name[0] }}</div>
            <div class="author-info">
              <div class="author-name">{{ post.author_name }}</div>
              <div class="post-time">{{ post.created_at }}</div>
            </div>
          </div>
          <h3 class="post-title">{{ post.title }}</h3>
          <p class="post-body">{{ post.content }}</p>
          <div class="post-tags">
            <span v-for="tag in (Array.isArray(post.tags) ? post.tags : JSON.parse(post.tags || '[]'))" :key="tag" class="post-tag">#{{ tag }}</span>
          </div>
          <div class="post-actions">
            <button class="action-item" :class="{ liked: post.liked }" @click.stop="toggleLike(post)">
              <svg viewBox="0 0 24 24" :fill="post.liked ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              {{ formatCount(post.likes_count) }}
            </button>
            <span class="action-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              {{ formatCount(post.comments_count) }}
            </span>
            <span class="action-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              {{ formatCount(post.views_count) }}
            </span>
          </div>
        </article>

        <!-- 加载更多 -->
        <div class="load-more" v-if="store.hasMore">
          <button class="load-btn" @click="loadMore">{{ t('加载更多') }}</button>
        </div>
      </div>

      <!-- ═══ 右侧边栏 ═══ -->
      <aside class="sidebar">
        <!-- 社区统计 -->
        <div class="side-card" v-spotlight>
          <h4 class="side-title">📊 {{ t('社区统计') }}</h4>
          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-num">{{ store.total }}</span>
              <span class="stat-text">{{ t('篇动态') }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-num">{{ store.tags.length }}</span>
              <span class="stat-text">{{ t('个话题') }}</span>
            </div>
          </div>
        </div>

        <!-- 热门话题 -->
        <div class="side-card" v-spotlight>
          <h4 class="side-title">🔥 {{ t('热门话题') }}</h4>
          <div class="hot-list">
            <div v-for="(topic, i) in hotTopics" :key="i" class="hot-item">
              <span class="hot-rank" :class="'rank-' + (i+1)">{{ i + 1 }}</span>
              <div class="hot-info">
                <span class="hot-name">#{{ topic.name }}</span>
                <span class="hot-count">{{ topic.count }} 篇</span>
              </div>
            </div>
          </div>
        </div>

        <!-- AI 工具排行 -->
        <div class="side-card" v-spotlight>
          <h4 class="side-title">🏆 {{ t('AI 工具热度榜') }}</h4>
          <div class="tool-list">
            <div v-for="(tool, i) in aiTools" :key="i" class="tool-item">
              <span class="tool-rank">{{ i + 1 }}</span>
              <div class="tool-info">
                <span class="tool-name">{{ tool.name }}</span>
                <div class="tool-bar"><div class="tool-fill" :style="{ width: tool.pct + '%' }"></div></div>
              </div>
              <span class="tool-score">{{ tool.score }}</span>
            </div>
          </div>
        </div>

        <!-- 活跃用户 -->
        <div class="side-card" v-spotlight>
          <h4 class="side-title">⭐ {{ t('本周活跃') }}</h4>
          <div class="user-list">
            <div v-for="u in activeUsers" :key="u.name" class="user-item">
              <div class="user-avatar-sm">{{ u.name[0] }}</div>
              <span class="user-name">{{ u.name }}</span>
              <span class="user-posts">{{ u.posts }}篇</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from '../composables/useI18n.js';
import { useParticles } from '../composables/useParticles.js';
import { useScrollReveal } from '../composables/useScrollReveal.js';
import { useToast } from '../composables/useToast.js';
import { useCommunityStore } from '../stores/community.js';
import ShinyText from '../components/ShinyText.vue';

const { t } = useI18n();
const { showToast } = useToast();
useParticles('.particles-background');
useScrollReveal();

const store = useCommunityStore();

// ═══ 分类列表（静态） ═══
const categories = [
  { value: 'all', label: '全部', icon: '🔥' },
  { value: 'review', label: '评测', icon: '📊' },
  { value: 'tutorial', label: '教程', icon: '📖' },
  { value: 'share', label: '分享', icon: '💡' },
  { value: 'news', label: '资讯', icon: '📡' },
  { value: 'question', label: '问答', icon: '❓' },
];

// ═══ 计算属性 ═══
const pinnedPost = computed(() => store.posts.find(p => p.is_pinned));
const feedPosts = computed(() => store.posts.filter(p => !p.is_pinned));
const hotTags = computed(() => store.tags.map(t => t.name));
const hotTopics = computed(() => store.tags.map(t => ({ name: t.name, count: t.post_count })));

// ═══ 侧边栏静态数据（未接入 API） ═══
const aiTools = [
  { name: 'DeepSeek V4', score: 9.2, pct: 92 },
  { name: 'Claude Code', score: 9.0, pct: 90 },
  { name: 'ChatGPT', score: 8.6, pct: 86 },
  { name: 'Midjourney', score: 8.4, pct: 84 },
  { name: 'SD3', score: 8.2, pct: 82 },
  { name: 'Copilot', score: 7.8, pct: 78 },
];

const activeUsers = [
  { name: '凌', posts: 15 },
  { name: 'AI绘画师', posts: 12 },
  { name: '小明', posts: 10 },
  { name: '全栈新手', posts: 8 },
  { name: '产品狗', posts: 7 },
];

// ═══ 操作函数 ═══
function formatCount(n) { return n >= 1000 ? (n / 1000).toFixed(1) + 'k' : n; }

const toggleLike = (post) => store.toggleLike(post);

const loadMore = () => { if (store.hasMore) store.fetchPosts(false); };

const selectCategory = (c) => { store.setCategory(c); store.fetchPosts(true); };
const selectTag = (t) => { store.setTag(t); store.fetchPosts(true); };

onMounted(() => {
  store.fetchPosts(true);
  store.fetchTags();
  // 首次加载后手动触发 scroll-reveal 渲染
  setTimeout(() => {
    document.querySelectorAll('.scroll-reveal').forEach(el => el.classList.add('revealed'));
  }, 800);
});
</script>

<style scoped>
/* ═══ 页面容器 ═══ */
.community-page { position: relative; min-height: 100vh; background: var(--bg-main); }
.particles-background { position: fixed; inset: 0; z-index: 0; pointer-events: none; }

.community-container {
  position: relative; z-index: 1;
  max-width: 1600px; margin: 0 auto;
  padding: 100px 20px 60px;
  display: grid;
  grid-template-columns: 220px 1fr 300px;
  gap: 24px;
  align-items: start;
}

.community-header { grid-column: 1 / -1; }

/* ═══ 顶部 ═══ */
.community-header { margin-bottom: 32px; }

.header-top {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 8px;
}
.header-title-row { display: flex; align-items: center; gap: 12px; }
.page-title { font-size: 2rem; font-weight: 800; color: var(--text-main); margin: 0; }
.badge {
  background: var(--primary); color: var(--text-on-primary); font-size: 11px; font-weight: 700;
  padding: 3px 10px; border-radius: 10px; letter-spacing: 1px;
}
.header-desc { font-size: 14px; color: var(--text-light); margin: 4px 0 20px; }

.post-btn {
  display: flex; align-items: center; gap: 6px;
  padding: 10px 20px; background: linear-gradient(135deg, var(--primary), var(--primary-dark)); color: var(--text-on-primary);
  border: none; border-radius: 8px; font-size: 14px; font-weight: 700;
  cursor: pointer; box-shadow: 0 4px 15px rgba(var(--primary-rgb), 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.post-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(var(--primary-rgb), 0.4); }
.post-btn svg { width: 16px; height: 16px; }

/* ═══ 分类 ═══ */
.category-bar {
  display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 12px;
}
.cat-btn {
  padding: 6px 16px; background: var(--bg-card); border: 1px solid var(--border-color);
  border-radius: 20px; font-size: 13px; color: var(--text-secondary);
  cursor: pointer; transition: all 0.2s;
}
.cat-btn:hover { border-color: var(--primary); color: var(--primary); }
.cat-btn.active { background: var(--primary); color: var(--text-on-primary); border-color: var(--primary); }

/* ═══ 标签 ═══ */
.tag-bar { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.tag-label { font-size: 12px; color: var(--text-light); }
.tag-btn {
  padding: 4px 12px; background: rgba(var(--primary-rgb), 0.06);
  border: none; border-radius: 12px; font-size: 13px; color: var(--text-secondary);
  cursor: pointer; transition: all 0.2s;
}
.tag-btn:hover { background: rgba(var(--primary-rgb), 0.12); color: var(--primary); }
.tag-btn.active { background: var(--primary); color: var(--text-on-primary); }

/* ═══ 动态卡片 — 统一 .section-card 风格 ═══ */
.feed { display: flex; flex-direction: column; gap: 24px; }

.post-card {
  background: var(--bg-card);
  border-radius: var(--radius);
  padding: 28px; cursor: pointer;
  box-shadow: var(--shadow-md);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) backwards;
  animation-delay: calc(var(--delay, 0) * 1s);
}
.post-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
.post-card.pinned {
  outline: 2px solid var(--gold);
  outline-offset: -1px;
}

.pin-badge { font-size: 12px; color: var(--gold); margin-bottom: 12px; font-weight: 600; }

/* ═══ 卡片头部：作者 ═══ */
.post-header { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
.author-avatar {
  width: 40px; height: 40px; border-radius: 50%;
  background: var(--primary);
  display: flex; align-items: center; justify-content: center;
  color: var(--text-on-primary); font-weight: 700; font-size: 16px; flex-shrink: 0;
}
.author-info { flex: 1; min-width: 0; }
.author-name { font-size: 14px; font-weight: 700; color: var(--text-main); }
.post-time { font-size: 12px; color: var(--text-light); }

/* ═══ 卡片正文 ═══ */
.post-title {
  font-size: 15px; font-weight: 700; color: var(--text-main);
  margin: 0 0 10px; line-height: 1.4;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif;
}
.post-body { font-size: 14px; color: var(--text-secondary); line-height: 1.7; margin: 0 0 16px;
  display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden; }

/* ═══ 标签 ═══ */
.post-tags { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 16px; }
.post-tag {
  padding: 3px 10px; background: rgba(var(--primary-rgb), 0.06);
  border-radius: 6px; font-size: 12px; color: var(--primary);
}

/* ═══ 互动栏 ═══ */
.post-actions {
  display: flex; gap: 24px; padding-top: 14px;
  border-top: 1px solid var(--border-color);
}
.action-item {
  display: flex; align-items: center; gap: 6px;
  font-size: 13px; color: var(--text-light); cursor: pointer;
  transition: color 0.2s; background: none; border: none; padding: 0;
}
.action-item:hover { color: var(--primary); }
.action-item.liked { color: var(--danger); }
.action-item svg { width: 18px; height: 18px; }

/* ═══ 加载更多 ═══ */
.load-more { text-align: center; padding: 24px 0; }
.load-btn {
  padding: 10px 40px; background: var(--bg-card); border: 1px solid var(--border-color);
  border-radius: var(--radius); font-size: 14px; color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.load-btn:hover { border-color: var(--primary); color: var(--primary); transform: translateY(-2px); box-shadow: var(--shadow-md); }

/* ═══ 左侧边栏 ═══ */
.left-sidebar { position: sticky; top: 110px; display: flex; flex-direction: column; gap: 16px; }

/* 用户卡片 */
.user-card { text-align: center; padding: 24px 16px; }
.uc-avatar {
  width: 56px; height: 56px; border-radius: 50%; margin: 0 auto 12px;
  background: var(--primary);
  display: flex; align-items: center; justify-content: center;
  color: var(--text-on-primary); font-weight: 800; font-size: 22px;
}
.uc-name { font-size: 15px; font-weight: 700; color: var(--text-main); margin-bottom: 4px; }
.uc-bio { font-size: 12px; color: var(--text-light); margin-bottom: 10px; }
.uc-stats { font-size: 12px; color: var(--text-secondary); }

/* 板块导航 */
.nav-list { display: flex; flex-direction: column; gap: 2px; }
.nav-item {
  display: flex; align-items: center; gap: 8px; padding: 8px 12px;
  border-radius: 8px; font-size: 13px; color: var(--text-secondary);
  text-decoration: none; cursor: pointer; transition: all 0.15s;
}
.nav-item:hover { background: rgba(var(--primary-rgb), 0.05); color: var(--primary); }
.nav-item.active { background: rgba(var(--primary-rgb), 0.08); color: var(--primary); font-weight: 600; }

/* 快捷入口 */
.quick-links { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
.quick-link {
  padding: 8px 10px; background: rgba(var(--primary-rgb), 0.04);
  border-radius: 8px; font-size: 12px; color: var(--text-secondary);
  text-decoration: none; text-align: center; transition: all 0.15s;
}
.quick-link:hover { background: rgba(var(--primary-rgb), 0.1); color: var(--primary); }

/* ═══ 右侧边栏 — 统一 .section-card 风格 ═══ */
.sidebar { position: sticky; top: 110px; display: flex; flex-direction: column; gap: 16px; }

.side-card {
  background: var(--bg-card);
  border-radius: var(--radius);
  padding: 24px;
  box-shadow: var(--shadow-md);
}
.side-title { font-size: 14px; font-weight: 700; color: var(--text-main); margin: 0 0 16px; }

/* 统计 */
.stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.stat-item { text-align: center; padding: 10px 8px; background: rgba(var(--primary-rgb), 0.04); border-radius: 8px; }
.stat-num { display: block; font-size: 20px; font-weight: 800; color: var(--primary); }
.stat-text { font-size: 11px; color: var(--text-light); }

/* 热门话题 */
.hot-list { display: flex; flex-direction: column; gap: 10px; }
.hot-item { display: flex; align-items: center; gap: 10px; }
.hot-rank {
  width: 22px; height: 22px; border-radius: 6px; display: flex; align-items: center;
  justify-content: center; font-size: 12px; font-weight: 800; background: var(--border-color);
  color: var(--text-secondary); flex-shrink: 0;
}
.hot-rank.rank-1 { background: var(--danger); color: var(--text-on-primary); }
.hot-rank.rank-2 { background: var(--secondary); color: var(--text-on-primary); }
.hot-rank.rank-3 { background: var(--gold); color: var(--text-on-primary); }
.hot-info { flex: 1; display: flex; justify-content: space-between; align-items: center; }
.hot-name { font-size: 13px; color: var(--text-main); font-weight: 600; }
.hot-count { font-size: 11px; color: var(--text-light); }

/* 工具排行 */
.tool-list { display: flex; flex-direction: column; gap: 10px; }
.tool-item { display: flex; align-items: center; gap: 10px; }
.tool-rank { width: 20px; font-size: 13px; font-weight: 800; color: var(--text-light); text-align: center; flex-shrink: 0; }
.tool-info { flex: 1; min-width: 0; }
.tool-name { font-size: 12px; color: var(--text-main); font-weight: 600; display: block; margin-bottom: 4px; }
.tool-bar { height: 4px; background: var(--border-color); border-radius: 2px; overflow: hidden; }
.tool-fill { height: 100%; background: var(--primary); border-radius: 2px; transition: width 0.5s ease; }
.tool-score { font-size: 13px; font-weight: 700; color: var(--primary); }

/* 活跃用户 */
.user-list { display: flex; flex-direction: column; gap: 8px; }
.user-item { display: flex; align-items: center; gap: 10px; }
.user-avatar-sm {
  width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
  background: var(--primary);
  display: flex; align-items: center; justify-content: center;
  color: var(--text-on-primary); font-weight: 700; font-size: 13px;
}
.user-name { flex: 1; font-size: 13px; color: var(--text-main); font-weight: 600; }
.user-posts { font-size: 11px; color: var(--text-light); }

@keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

@media (max-width: 1200px) {
  .community-container { grid-template-columns: 200px 1fr 260px; gap: 16px; }
}

@media (max-width: 1000px) {
  .community-container { grid-template-columns: 1fr 1fr; }
  .left-sidebar { display: none; }
  .feed { grid-column: 1; }
  .sidebar { grid-column: 2; position: static; }
}

@media (max-width: 768px) {
  .community-container { grid-template-columns: 1fr; padding: 80px 12px 40px; }
  .left-sidebar { display: none; }
  .feed { grid-column: 1; }
  .sidebar { grid-column: 1; position: static; grid-template-columns: 1fr 1fr; }
  .post-card { padding: 18px; }
  .post-title { font-size: 16px; }
}
</style>
