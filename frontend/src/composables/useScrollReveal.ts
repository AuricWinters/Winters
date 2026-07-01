import { onMounted } from 'vue';

export function useScrollReveal(): void {
  onMounted(() => {
    const elements: NodeListOf<Element> = document.querySelectorAll('.scroll-reveal');
    if (!elements.length) return;

    const observer: IntersectionObserver = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
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

    elements.forEach((el: Element) => {
      observer.observe(el);
    });
  });
}
