<template>
  <div class="home-page">
    <!-- 粒子背景 -->
    <canvas class="particles-background" />

    <div class="hero-section">
      <!-- 左侧：个人信息与时间线 -->
      <div class="profile-container">
        <div ref="profileCardRef" class="profile-header card-spotlight scroll-reveal" v-spotlight>
          <img
            src="/img/tx.jpg"
            :alt="t('AuricWinters头像')"
            class="avatar"
            loading="lazy"
          >
          <div class="profile-info">
            <h1><GradientText :text="profile.name" /></h1>
            <p class="title">
              {{ profile.bio }}
            </p>
            <div class="motto">
              <span class="motto-visible">{{ t('珍妮机的出现引起了纺织工人的不满。') }}</span>
              <div
                class="motto-hidden"
                :class="{ show: isMottoExpanded }"
                :style="{ maxHeight: isMottoExpanded ? '500px' : '0' }"
              >
                <br>{{ t('目前就读于广州信息技术职业学校') }} <br>{{ t('计算机应用专业') }}
                <br>{{ t('喜欢听歌、骑车、羽毛球') }} <br>{{ t('喜欢与不同的人交流不同的经历') }}
              </div>
              <button
                type="button"
                class="more-btn"
                :aria-expanded="isMottoExpanded"
                @click="toggleMotto"
              >
                {{ isMottoExpanded ? t('收起') : t('更多') }}
              </button>
            </div>
            <div class="location">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                />
              </svg>
              <span>{{ t('中国 广东 广州') }}</span>
            </div>
          </div>
          <CircularText text="WINTERS" :size="100" />
        </div>

        <div class="timeline-container scroll-reveal">
          <h3>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
              />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {{ t('时间线') }}
          </h3>
          <div
            v-if="loadingTimeline"
            class="timeline-loading"
          >
            <div
              class="skeleton"
              style="height: 60px; margin-bottom: 12px"
            />
            <div
              class="skeleton"
              style="height: 60px; margin-bottom: 12px"
            />
            <div
              class="skeleton"
              style="height: 60px"
            />
          </div>
          <div
            v-else
            class="timeline"
          >
            <div
              v-for="(item, index) in timelineData"
              :key="index"
              class="timeline-item"
            >
              <div class="timeline-date">
                {{ item.date }}
              </div>
              <div class="timeline-content">
                <h4>{{ item.title }}</h4>
                <p>{{ item.content }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 中间：活动情况与快速导航 -->
      <div class="content-container">
        <Carousel class="scroll-reveal" />

        <ContributionHeatmap
          :workday-goal-percentage="80"
          class="scroll-reveal"
        />

        <div class="skills-split-section card-spotlight scroll-reveal" v-spotlight>
          <div class="skills-left">
            <h3>{{ t('技能专长') }}</h3>
            <div class="skill-bars">
              <div class="skill-bar-item">
                <div class="skill-bar-header">
                  <span class="skill-name">{{ t('前端开发') }}</span>
                  <span class="skill-percent">85%</span>
                </div>
                <div class="skill-bar-track">
                  <div
                    class="skill-bar-fill"
                    style="width: 85%"
                  />
                </div>
              </div>
              <div class="skill-bar-item">
                <div class="skill-bar-header">
                  <span class="skill-name">{{ t('UI/UX 设计') }}</span>
                  <span class="skill-percent">75%</span>
                </div>
                <div class="skill-bar-track">
                  <div
                    class="skill-bar-fill"
                    style="width: 75%"
                  />
                </div>
              </div>
              <div class="skill-bar-item">
                <div class="skill-bar-header">
                  <span class="skill-name">{{ t('Python 脚本') }}</span>
                  <span class="skill-percent">70%</span>
                </div>
                <div class="skill-bar-track">
                  <div
                    class="skill-bar-fill"
                    style="width: 70%"
                  />
                </div>
              </div>
              <div class="skill-bar-item">
                <div class="skill-bar-header">
                  <span class="skill-name">{{ t('AI 应用') }}</span>
                  <span class="skill-percent">80%</span>
                </div>
                <div class="skill-bar-track">
                  <div
                    class="skill-bar-fill"
                    style="width: 80%"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="skills-right">
            <MasonryGrid>
              <AnimatedList :items="skills" class="skills-grid">
                <template #item="{ item }">
                  <div class="skill-item">{{ item }}</div>
                </template>
              </AnimatedList>
            </MasonryGrid>
          </div>
        </div>
      </div>

      <!-- 右侧：技能专长、项目与兴趣 -->
      <div class="sidebar-container">
        <div class="section-card card-spotlight scroll-reveal" v-spotlight>
          <h3>{{ t('我的项目') }}</h3>
          <div class="projects-grid">
            <router-link
              v-for="project in projects"
              :key="project.id"
              :to="'/projects/' + project.id"
              class="project-item"
            >
              <div class="project-name">{{ project.title }}</div>
              <div class="project-desc">{{ project.desc }}</div>
            </router-link>
          </div>
        </div>

        <div class="section-card card-spotlight scroll-reveal" v-spotlight>
          <h3>{{ t('兴趣爱好') }}</h3>
          <div class="skills-grid">
            <div class="skill-item">
              🎵 {{ t('听歌') }}
            </div>
            <div class="skill-item">
              🚲 {{ t('骑车') }}
            </div>
            <div class="skill-item">
              🏸 {{ t('羽毛球') }}
            </div>
            <div class="skill-item">
              💬 {{ t('交流') }}
            </div>
          </div>
        </div>

        <div class="section-card card-spotlight scroll-reveal" v-spotlight>
          <h3>{{ t('网站数据') }}</h3>
          <div class="stats-grid">
            <div style="font-size: 13px; color: var(--text-secondary)">
              <p>
                {{ t('安全运行:') }}
                <span
                  id="stat-safe-days"
                  style="color: var(--primary); font-weight: 700"
                >{{
                  safeDays
                }}</span>
                {{ t('天') }}
              </p>
              <p>
                {{ t('访客总量:') }}
                <span
                  id="stat-views"
                  style="color: var(--primary); font-weight: 700"
                >{{
                  formattedViews
                }}</span>
                {{ t('次') }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from '../composables/useI18n.js';
import { ref, onMounted, computed } from 'vue';
import ContributionHeatmap from '../components/ContributionHeatmap.vue';
import Carousel from '../components/Carousel.vue';
import GradientText from '../components/GradientText.vue';
import AnimatedList from '../components/AnimatedList.vue';
import CircularText from '../components/CircularText.vue';
import MasonryGrid from '../components/MasonryGrid.vue';
import { useParticles } from '../composables/useParticles.js';
import { useScrollReveal } from '../composables/useScrollReveal.js';
import { useSpotlight } from '../composables/useSpotlight.js';
import { useTilt } from '../composables/useTilt.js';
import { useToast } from '../composables/useToast.js';
import { useDataStore } from '../stores/data.js';

useParticles();
useScrollReveal();
const { t } = useI18n();
const { showToast } = useToast();
const dataStore = useDataStore();

const isMottoExpanded = ref(false);
const safeDays = ref(0);
const views = ref(0);
const formattedViews = ref('0');
const timelineData = ref([]);
const loadingTimeline = ref(true);

// 使用全局数据
const projects = computed(() => dataStore.featuredProjects);
const skills = computed(() => dataStore.profile.skills);
const profile = computed(() => dataStore.profile);

const toggleMotto = () => {
  isMottoExpanded.value = !isMottoExpanded.value;
};

// 从 API 加载时间线数据
const loadTimeline = async () => {
  try {
    const response = await fetch('/api/blog/timelines');
    const data = await response.json();
    if (data.timelines) {
      timelineData.value = data.timelines;
    }
  } catch (error) {
    // 使用默认数据
    timelineData.value = [
      {
        date: '2026-03-26',
        title: '项目重构完成',
        content: '完成了 Winters 项目的全新视觉升级与结构优化。',
      },
      { date: '2026-03-09', title: '最后学期：第二周', content: '新的学期，新的挑战，继续加油！' },
      { date: '2023-09-01', title: '梦开始的时间', content: '入读计算机应用专业，开启技术探索之旅。' },
    ];
  } finally {
    loadingTimeline.value = false;
  }
};

const handleStats = () => {
  const startDate = new Date('2026-01-01');
  const today = new Date();
  safeDays.value = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));

  // 使用 localStorage 作为临时方案
  views.value = parseInt(localStorage.getItem('websiteViews') || 0) + 1;
  localStorage.setItem('websiteViews', views.value);

  formattedViews.value =
    views.value >= 1000 ? (views.value / 1000).toFixed(1) + 'k' : views.value.toString();
};

const profileCardRef = ref(null)

useSpotlight(profileCardRef)
useTilt(profileCardRef, { maxDeg: 8 })

onMounted(() => {
  handleStats();
  loadTimeline();
});
</script>

<style scoped>
/* 首页样式已在main.css中定义 */

/* 粒子背景 */
.home-page {
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
  /* Bento 瀑布流布局 override */
  display: grid !important;
  grid-template-columns: repeat(4, 1fr) !important;
  gap: 16px !important;
  max-width: 1800px !important;
  margin: 40px auto 0 !important;
  padding: 0 24px !important;
}

/* 有机卡片跨越 */
.profile-container {
  grid-column: span 2;
  grid-row: span 2;
}
.content-container {
  grid-column: span 2;
  grid-row: span 2;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.sidebar-container {
  grid-column: span 4;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.sidebar-container .section-card {
  grid-column: span 1;
}

@media (max-width: 1024px) {
  .hero-section {
    grid-template-columns: repeat(2, 1fr) !important;
  }
  .profile-container { grid-column: span 2; grid-row: span 1; }
  .content-container { grid-column: span 2; grid-row: span 1; }
  .sidebar-container { grid-column: span 2; grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 768px) {
  .hero-section {
    grid-template-columns: 1fr !important;
  }
  .profile-container, .content-container, .sidebar-container {
    grid-column: span 1;
    grid-row: span 1;
  }
  .sidebar-container { grid-template-columns: 1fr; }
}
</style>
