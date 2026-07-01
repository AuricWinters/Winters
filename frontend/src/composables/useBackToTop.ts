import { ref, Ref, onMounted, onUnmounted } from 'vue';
import { throttle } from '../utils/throttle.js';

export function useBackToTop(threshold: number = 300, throttleDelay: number = 100): { isVisible: Ref<boolean>; scrollToTop: () => void } {
  const isVisible: Ref<boolean> = ref(false);

  const checkVisibility = (): void => {
    isVisible.value = window.scrollY > threshold;
  };

  const throttledCheckVisibility: (...args: any[]) => void = throttle(checkVisibility, throttleDelay);

  const scrollToTop = (): void => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  onMounted((): void => {
    window.addEventListener('scroll', throttledCheckVisibility);
    checkVisibility();
  });

  onUnmounted((): void => {
    window.removeEventListener('scroll', throttledCheckVisibility);
  });

  return {
    isVisible,
    scrollToTop,
  };
}
