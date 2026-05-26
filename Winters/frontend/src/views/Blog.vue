<template>
  <div class="blog-page">
    <!-- 粒子背景 -->
    <canvas class="particles-background" />

    <div
      class="hero-section"
      style="grid-template-columns: 1fr"
    >
      <div class="content-container">
        <div class="section-card scroll-reveal">
          <h3>最近动态</h3>

          <!-- 分类筛选按钮 -->
          <div class="category-filter">
            <button
              v-for="cat in categories"
              :key="cat.value"
              :class="['filter-btn', { active: activeCategory === cat.value }]"
              @click="activeCategory = cat.value"
            >
              {{ cat.label }}
            </button>
          </div>

          <!-- 加载骨架屏 -->
          <div
            v-if="loading"
            class="timeline-skeleton"
          >
            <div
              v-for="i in 3"
              :key="i"
              class="skeleton-item"
            >
              <div class="skeleton skeleton-date" />
              <div class="skeleton skeleton-content">
                <div class="skeleton skeleton-title" />
                <div class="skeleton skeleton-text" />
              </div>
            </div>
          </div>

          <!-- 博客列表 -->
          <div
            v-else
            class="timeline"
            style="padding-top: 20px"
          >
            <div
              v-for="item in filteredPosts"
              :key="item.id"
              class="timeline-item"
            >
              <div class="timeline-date">
                {{ item.created_at }}
              </div>
              <div class="timeline-content">
                <h4>{{ item.title }}</h4>
                <p>{{ item.content }}</p>
              </div>
            </div>

            <!-- 空状态 -->
            <div
              v-if="filteredPosts.length === 0"
              class="empty-state"
            >
              暂无内容
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, onMounted } from 'vue';
import { useParticles } from '../composables/useParticles.js';
import { useScrollReveal } from '../composables/useScrollReveal.js';
import { useToast } from '../composables/useToast.js';
import { useDataStore } from '../stores/data.js';

useParticles();
useScrollReveal();

const { showToast } = useToast();
const dataStore = useDataStore();

const categories = [
  { value: 'all', label: '全部' },
  { value: 'project', label: '项目' },
  { value: 'learning', label: '学习' },
  { value: 'life', label: '生活' },
];

const state = reactive({
  posts: [],
  loading: false,
  error: null,
  activeCategory: 'all',
});

const filteredPosts = computed(() => {
  if (state.activeCategory === 'all') {
    return state.posts;
  }
  return state.posts.filter((post) => post.category === state.activeCategory);
});

async function fetchPosts() {
  state.loading = true;
  state.error = null;

  try {
    // 模拟网络请求延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    state.posts = dataStore.blogs;
  } catch (err) {
    state.error = err.message;
    showToast({
      message: '加载博客数据失败，请稍后重试',
      type: 'error',
    });
  } finally {
    state.loading = false;
  }
}

onMounted(() => {
  fetchPosts();
});
</script>

<style scoped>
/* Blog页面样式已在main.css中定义 */

/* 粒子背景 */
.blog-page {
  position: relative;
  min-height: 100vh;
}

.particles-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
}

.hero-section {
  position: relative;
  z-index: 1;
}

/* 分类筛选按钮 */
.category-filter {
  display: flex;
  gap: 10px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 8px 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.filter-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.4);
}

.filter-btn.active {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.6);
}

/* 骨架屏样式 */
.timeline-skeleton {
  padding-top: 20px;
}

.skeleton-item {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  padding: 15px 0;
}

.skeleton {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.05) 25%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0.05) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 4px;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.skeleton-date {
  width: 100px;
  height: 20px;
  flex-shrink: 0;
}

.skeleton-content {
  flex: 1;
  background: transparent;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.skeleton-title {
  width: 60%;
  height: 20px;
}

.skeleton-text {
  width: 100%;
  height: 40px;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
}
</style>
