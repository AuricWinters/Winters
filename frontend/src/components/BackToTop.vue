<template>
  <button
    class="back-to-top"
    :class="{ show: isVisible }"
    :aria-label="t('回到顶部')"
    @click="scrollToTop"
  >
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
    >
      <polyline points="18 15 12 9 6 15" />
    </svg>
  </button>
</template>

<script setup lang="ts">
import { useBackToTop } from '../composables/useBackToTop.ts';
import { useI18n } from '../composables/useI18n.ts';
const { t } = useI18n();

const { isVisible, scrollToTop } = useBackToTop();
</script>

<style scoped>
/* 回到顶部按钮样式已在main.css中定义 */
</style>
