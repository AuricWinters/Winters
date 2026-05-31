<template>
  <div class="projects-page">
    <!-- 粒子背景 -->
    <canvas class="particles-background" />

    <div
      class="hero-section"
      style="grid-template-columns: 1fr"
    >
      <div class="content-container">
        <div class="section-card scroll-reveal">
          <h3>项目作品集</h3>
          <div
            class="projects-grid"
            style="
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
              gap: 20px;
              padding-top: 20px;
            "
          >
            <router-link
              v-for="project in projects"
              :key="project.id"
              :to="'/projects/' + project.id"
              class="project-card"
              tabindex="0"
            >
              <!-- 状态标签 -->
              <div
                class="project-status"
                :class="project.status || 'completed'"
              >
                {{ project.status === 'in-progress' ? '进行中' : '已完成' }}
              </div>

              <!-- 项目内容 -->
              <div class="project-content">
                <h4 class="project-name">
                  {{ project.title }}
                </h4>
                <p class="project-desc">
                  {{ project.desc }}
                </p>

                <!-- 技术栈标签 -->
                <div class="tech-stack">
                  <span
                    v-for="tech in project.tech"
                    :key="tech"
                    class="tech-tag"
                  >
                    {{ tech }}
                  </span>
                </div>
              </div>

              <!-- 操作按钮 -->
              <div class="project-actions">
                <span class="project-btn primary">
                  查看详情
                </span>
                <a
                  v-if="project.github"
                  :href="project.github"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="project-btn secondary"
                  @click.stop
                >
                  GitHub
                </a>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useParticles } from '../composables/useParticles.js';
import { useScrollReveal } from '../composables/useScrollReveal.js';
import { useDataStore } from '../stores/data.js';

useParticles();
useScrollReveal();

const dataStore = useDataStore();
const projects = computed(() => dataStore.projects);
</script>

<style scoped>
/* Projects页面样式 */

/* 粒子背景 */
.projects-page {
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

/* 项目卡片 */
.project-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 16px;
  padding: 20px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  /* 修复：去除下划线和蓝色 */
  text-decoration: none;
  color: inherit;
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(236, 72, 153, 0.15);
  background: rgba(255, 255, 255, 0.85);
}

.project-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--primary), var(--secondary));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.project-card:hover::before {
  opacity: 1;
}

/* 状态标签 */
.project-status {
  position: absolute;
  top: 12px;
  right: 12px;
  font-size: 10px;
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: 600;
}

.project-status.completed {
  background: rgba(34, 197, 94, 0.15);
  color: #16a34a;
}

.project-status.in-progress {
  background: rgba(236, 72, 153, 0.15);
  color: var(--primary);
}

/* 项目内容 */
.project-content {
  flex: 1;
  margin-top: 8px;
}

.project-name {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 10px;
}

.project-desc {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 15px;
}

/* 技术栈标签 */
.tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 15px;
}

.tech-tag {
  font-size: 11px;
  background: rgba(236, 72, 153, 0.1);
  padding: 4px 10px;
  border-radius: 20px;
  color: var(--primary);
  font-weight: 500;
}

/* 操作按钮 - 渐变 + 白色光晕 */
.project-actions {
  display: flex;
  gap: 10px;
  margin-top: auto;
}

.project-btn {
  flex: 1;
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  transition: all 0.3s ease;
}

/* 主按钮 - 强渐变 + 强光晕 */
.project-btn.primary {
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: white;
  border: none;
  cursor: pointer;
  box-shadow:
    0 4px 15px rgba(var(--primary-rgb), 0.4),
    0 2px 8px rgba(0, 0, 0, 0.1);
}

.project-btn.primary:hover {
  transform: translateY(-2px) scale(1.02);
  background: linear-gradient(135deg, var(--accent), var(--primary-light));
  box-shadow:
    0 0 25px rgba(255, 255, 255, 0.6),
    0 0 50px rgba(var(--primary-rgb), 0.4),
    0 8px 25px rgba(236, 72, 153, 0.5);
}

/* 次按钮 - 玻璃态 + 中等光晕 */
.project-btn.secondary {
  background: rgba(236, 72, 153, 0.1);
  color: var(--primary);
  border: 1px solid rgba(236, 72, 153, 0.25);
  backdrop-filter: blur(8px);
}

.project-btn.secondary:hover {
  transform: translateY(-2px);
  background: rgba(236, 72, 153, 0.2);
  box-shadow:
    0 0 20px rgba(255, 255, 255, 0.4),
    0 0 35px rgba(236, 72, 153, 0.25);
}
</style>
