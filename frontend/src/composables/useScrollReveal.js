import { onMounted } from 'vue';

/**
 * 滚动显示动画 composable
 * 提取各页面中重复的 IntersectionObserver 逻辑
 */
export function useScrollReveal() {
  onMounted(() => {
    const elements = document.querySelectorAll('.scroll-reveal');
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    elements.forEach((el) => {
      observer.observe(el);
    });
  });
}
