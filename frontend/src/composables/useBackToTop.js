import { ref, onMounted, onUnmounted } from 'vue';
import { throttle } from '../utils/throttle.js';

/**
 * 回到顶部 composable
 * 封装滚动监听 + 节流逻辑（复用 utils/throttle.js）
 * @param {number} threshold - 显示按钮的滚动阈值（px）
 * @param {number} throttleDelay - 节流延迟（ms）
 */
export function useBackToTop(threshold = 300, throttleDelay = 100) {
  const isVisible = ref(false);

  const checkVisibility = () => {
    isVisible.value = window.scrollY > threshold;
  };

  const throttledCheckVisibility = throttle(checkVisibility, throttleDelay);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  onMounted(() => {
    window.addEventListener('scroll', throttledCheckVisibility);
    checkVisibility();
  });

  onUnmounted(() => {
    window.removeEventListener('scroll', throttledCheckVisibility);
  });

  return {
    isVisible,
    scrollToTop,
  };
}
