<template>
  <div class="project-detail">
    <!-- 粒子背景 -->
    <canvas class="particles-background" />

    <div class="container" v-if="project">
      <div class="back-link">
        <router-link to="/projects" class="back-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          {{ t('返回项目列表') }}
        </router-link>
      </div>

      <div class="detail-card glass-card scroll-reveal">
        <header class="detail-header">
          <div class="header-top">
            <div class="status-badge" :class="project.status || 'completed'">
              {{ project.status === 'in-progress' ? t('进行中') : t('已完成') }}
            </div>
          </div>
          <h1>{{ project.title }}</h1>
          <p class="summary">{{ project.desc }}</p>
          
          <div class="tech-tags">
            <span v-for="tech in project.tech" :key="tech" class="tech-tag">
              {{ tech }}
            </span>
          </div>
        </header>

        <div class="detail-body">
          <section class="main-content">
            <div class="content-section">
              <h3>{{ t('项目介绍') }}</h3>
              <p>{{ project.fullDesc || project.desc }}</p>
            </div>

            <div class="content-section" v-if="project.features">
              <h3>{{ t('核心功能') }}</h3>
              <ul class="features-list">
                <li v-for="feature in project.features" :key="feature">{{ feature }}</li>
              </ul>
            </div>
          </section>

          <aside class="sidebar-section">
            <div class="content-section">
              <h3>{{ t('项目链接') }}</h3>
              <div class="project-links">
                <router-link v-if="project.link" :to="project.link" class="link-btn primary">
                  {{ t('查看项目') }}
                </router-link>
                <a v-if="project.github" :href="project.github" target="_blank" class="link-btn secondary">
                  {{ t('查看 GitHub 源码') }}
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>

    <div class="container" v-else>
      <div class="not-found">
        <h2>{{ t('未找到该项目') }}</h2>
        <router-link to="/projects">{{ t('返回列表') }}</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from '../composables/useI18n.js';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useDataStore } from '../stores/data.js';
import { useParticles } from '../composables/useParticles.js';
import { useScrollReveal } from '../composables/useScrollReveal.js';

const { t } = useI18n();

const route = useRoute();
const dataStore = useDataStore();

useParticles();
useScrollReveal();

const project = computed(() => {
  const id = parseInt(route.params.id);
  return dataStore.projects.find(p => p.id === id);
});
</script>

<style scoped>
.project-detail {
  position: relative;
  min-height: 100vh;
  padding-top: 40px;
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

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
}

.back-link {
  margin-bottom: 24px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 14px;
  transition: all 0.3s ease;
  padding: 8px 16px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.back-btn:hover {
  color: var(--primary);
  background: rgba(255, 255, 255, 0.8);
  transform: translateX(-4px);
}

.glass-card {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: var(--radius);
  padding: 48px;
  box-shadow: var(--shadow-lg);
}

.detail-header {
  margin-bottom: 40px;
  padding-bottom: 30px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.status-badge {
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 600;
}

.status-badge.completed {
  background: #dcfce7;
  color: #166534;
}

.status-badge.in-progress {
  background: #fef9c3;
  color: #854d0e;
}

h1 {
  font-size: 40px;
  color: var(--text-main);
  margin-bottom: 16px;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.summary {
  font-size: 20px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 24px;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.tech-tag {
  background: rgba(236, 72, 153, 0.08);
  color: var(--primary);
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  border: 1px solid rgba(236, 72, 153, 0.1);
}

.detail-body {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 48px;
}

.content-section {
  margin-bottom: 40px;
}

.content-section h3 {
  font-size: 22px;
  margin-bottom: 20px;
  color: var(--text-main);
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
}

.content-section h3::before {
  content: "";
  display: block;
  width: 4px;
  height: 18px;
  background: var(--primary);
  border-radius: 2px;
}

.content-section p {
  line-height: 1.8;
  color: var(--text-secondary);
  font-size: 16px;
}

.features-list {
  list-style: none;
  padding: 0;
}

.features-list li {
  position: relative;
  padding: 12px 16px 12px 32px;
  margin-bottom: 12px;
  color: var(--text-secondary);
  background: rgba(255, 255, 255, 0.4);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.features-list li:hover {
  background: rgba(255, 255, 255, 0.6);
  transform: translateX(4px);
}

.features-list li::before {
  content: "✓";
  position: absolute;
  left: 12px;
  color: var(--primary);
  font-weight: bold;
}

.sidebar-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.project-links {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.link-btn {
  padding: 14px 24px;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  text-align: center;
  font-size: 15px;
}

.link-btn.primary {
  background: var(--primary);
  color: white;
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.2);
}

.link-btn.primary:hover {
  background: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(236, 72, 153, 0.3);
}

.link-btn.secondary {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(236, 72, 153, 0.3);
  color: var(--primary);
}

.link-btn.secondary:hover {
  background: white;
  border-color: var(--primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

@media (max-width: 900px) {
  .detail-body {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  
  .glass-card {
    padding: 32px;
  }
  
  h1 {
    font-size: 32px;
  }
}

@media (max-width: 768px) {
  .project-detail {
    padding-top: 20px;
  }
  
  .glass-card {
    padding: 24px;
  }
}
</style>
