interface BounceEntryOptions {
  staggerMs?: number;
}

export function useBounceEntry(selector: string, { staggerMs = 100 }: BounceEntryOptions = {}): void {
  const observer: IntersectionObserver = new IntersectionObserver(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el: HTMLElement = entry.target as HTMLElement;
        el.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
        el.style.transform = 'scale(1)';
        observer.unobserve(el);
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll(selector).forEach((el: Element, i: number) => {
    (el as HTMLElement).style.transform = 'scale(0)';
    setTimeout((): void => observer.observe(el), i * staggerMs);
  });
}
