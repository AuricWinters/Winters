<template>
  <div class="carousel-container scroll-reveal">
    <div
      ref="carouselWrapper"
      class="carousel-wrapper"
    >
      <div
        class="carousel-slides"
        :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
      >
        <div
          v-for="(slide, index) in slidesData"
          :key="index"
          class="carousel-slide"
        >
          <div class="carousel-content">
            <h3 class="carousel-title">
              {{ t(slide.title) }}
            </h3>
            <p class="carousel-description">
              {{ t(slide.description) }}
            </p>
            <div class="carousel-actions">
              <a
                v-if="slide.link"
                :href="slide.link"
                class="carousel-button"
              >{{ t('查看详情') }}</a>
            </div>
          </div>
          <div class="carousel-image-container">
            <div
              class="carousel-image"
              :style="{ backgroundImage: `url(${slide.image})` }"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 导航按钮 -->
    <button
      class="carousel-nav carousel-nav-left"
      :aria-label="t('上一张')"
      @click="prevSlide"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
      </svg>
    </button>
    <button
      class="carousel-nav carousel-nav-right"
      :aria-label="t('下一张')"
      @click="nextSlide"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
      </svg>
    </button>

    <!-- 指示器 -->
    <div class="carousel-indicators">
      <button
        v-for="(slide, index) in slidesData"
        :key="index"
        class="carousel-indicator"
        :class="{ active: currentSlide === index }"
        :aria-label="`${t('第')} ${index + 1} ${t('张')}`"
        @click="goToSlide(index)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useI18n } from '../composables/useI18n.ts';
const { t } = useI18n();

const props = defineProps({
  slides: {
    type: Array,
    default: () => [
      {
        title: 'Personal Website',
        description: '基于 Glassmorphism 风格的个人展示空间，包含个人信息、项目展示和技能介绍。',
        image:
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20personal%20website%20with%20glassmorphism%20design%20showing%20portfolio%20and%20skills&image_size=landscape_16_9',
        link: '#',
      },
      {
        title: 'Chemistry Manager',
        description: '一套轻量级的化学药品库存管理系统，帮助实验室高效管理化学品。',
        image:
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chemistry%20inventory%20management%20system%20interface%20with%20modern%20design&image_size=landscape_16_9',
        link: '#',
      },
      {
        title: 'Todo List App',
        description: '简洁高效的待办事项管理工具，支持任务分类和进度跟踪。',
        image:
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=todo%20list%20application%20with%20modern%20UI%20design&image_size=landscape_16_9',
        link: '#',
      },
      {
        title: 'AI 对话系统',
        description: '基于现代AI技术的智能对话系统，支持多种场景的交互。',
        image:
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=AI%20chat%20interface%20with%20modern%20design%20and%20purple%20accent%20colors&image_size=landscape_16_9',
        link: '/ai',
      },
    ],
  },
  autoplay: {
    type: Boolean,
    default: true,
  },
  interval: {
    type: Number,
    default: 5000,
  },
});

const currentSlide = ref(0);
const carouselWrapper = ref(null);
const slidesData = computed(() => props.slides as any[]);
let autoplayTimer = null;

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % props.slides.length;
  resetAutoplay();
};

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + props.slides.length) % props.slides.length;
  resetAutoplay();
};

const goToSlide = (index) => {
  currentSlide.value = index;
  resetAutoplay();
};

const startAutoplay = () => {
  if (props.autoplay && props.slides.length > 1) {
    autoplayTimer = setInterval(nextSlide, props.interval);
  }
};

const stopAutoplay = () => {
  if (autoplayTimer) {
    clearInterval(autoplayTimer);
    autoplayTimer = null;
  }
};

const resetAutoplay = () => {
  stopAutoplay();
  startAutoplay();
};

onMounted(() => {
  startAutoplay();
});

onUnmounted(() => {
  stopAutoplay();
});

watch(
  () => props.slides,
  () => {
    currentSlide.value = 0;
    resetAutoplay();
  },
  { deep: true }
);
</script>

<style scoped>
.carousel-container {
  position: relative;
  background: var(--bg-card);
  border-radius: var(--radius);
  padding: 30px;
  box-shadow: var(--shadow-md);
  overflow: hidden;
}

.carousel-wrapper {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
}

.carousel-slides {
  display: flex;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
}

.carousel-slide {
  flex: 0 0 100%;
  display: flex;
  align-items: center;
  gap: 30px;
  min-height: 300px;
  padding: 20px;
  background: var(--bg-main);
  border-radius: 12px;
}

.carousel-content {
  flex: 1;
  max-width: 50%;
}

.carousel-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 12px;
  line-height: 1.3;
}

.carousel-description {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 20px;
}

.carousel-actions {
  display: flex;
  gap: 10px;
}

.carousel-button {
  padding: 10px 24px;
  background: var(--primary);
  color: white;
  border-radius: 12px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  transition: var(--transition);
  box-shadow: var(--shadow-purple);
}

.carousel-button:hover {
  background: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 15px 30px -10px rgba(236, 72, 153, 0.4);
}

.carousel-image-container {
  flex: 1;
  max-width: 50%;
  height: 200px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--shadow-md);
}

.carousel-image {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transition: transform 0.3s ease;
}

.carousel-slide:hover .carousel-image {
  transform: scale(1.05);
}

.carousel-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  background: var(--bg-glass);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: var(--shadow-md);
  color: var(--text-main);
  z-index: 10;
}

.carousel-nav:hover {
  background: white;
  transform: translateY(-50%) scale(1.1);
  box-shadow: var(--shadow-lg);
  color: var(--primary);
}

.carousel-nav-left {
  left: 20px;
}

.carousel-nav-right {
  right: 20px;
}

.carousel-indicators {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 10;
}

.carousel-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
  background: var(--border-color);
  cursor: pointer;
  transition: var(--transition);
  box-shadow: var(--shadow-sm);
}

.carousel-indicator:hover {
  background: var(--bg-glass);
  transform: scale(1.2);
}

.carousel-indicator.active {
  background: var(--primary);
  transform: scale(1.2);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .carousel-container {
    padding: 20px;
  }

  .carousel-slide {
    flex-direction: column;
    text-align: center;
    gap: 20px;
    min-height: 400px;
  }

  .carousel-content {
    max-width: 100%;
  }

  .carousel-image-container {
    max-width: 100%;
    width: 100%;
  }

  .carousel-title {
    font-size: 20px;
  }

  .carousel-nav {
    width: 36px;
    height: 36px;
  }

  .carousel-nav-left {
    left: 10px;
  }

  .carousel-nav-right {
    right: 10px;
  }
}
</style>
