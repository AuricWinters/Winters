interface BlurRevealOptions {
  staggerMs?: number;
  blurFrom?: number;
}

export function useBlurReveal(selector: string, { staggerMs = 80, blurFrom = 8 }: BlurRevealOptions = {}): void {
  const observer: IntersectionObserver = new IntersectionObserver(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el: Element = entry.target;
        const words: NodeListOf<Element> = el.querySelectorAll('.blur-word');
        words.forEach((w: Element, i: number) => {
          setTimeout((): void => {
            (w as HTMLElement).style.filter = 'blur(0)';
            (w as HTMLElement).style.opacity = '1';
            (w as HTMLElement).style.transform = 'translateY(0)';
          }, i * staggerMs);
        });
        observer.unobserve(el);
      });
    },
    { threshold: 0.2 }
  );

  document.querySelectorAll(selector).forEach((el: Element) => {
    const text: string = el.textContent!.trim();
    const words: string[] = text.split(/\s+/);
    el.innerHTML = words.map((w: string) =>
      `<span class="blur-word" style="filter:blur(${blurFrom}px);opacity:0;transform:translateY(20px);transition:all 0.6s cubic-bezier(0.16,1,0.3,1);display:inline-block;margin-right:0.3em">${w}</span>`
    ).join('');
    observer.observe(el);
  });
}
