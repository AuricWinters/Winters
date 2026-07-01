interface CountUpOptions {
  target: number;
  duration?: number;
}

export function useCountUp(elRef: any, { target, duration = 1800 }: CountUpOptions = {} as CountUpOptions): void {
  const el: HTMLElement | null = elRef.value || elRef;
  if (!el) return;

  function easeOutExpo(t: number): number {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  const start: number = performance.now();
  function tick(ts: number): void {
    const elapsed: number = ts - start;
    const progress: number = Math.min(elapsed / duration, 1);
    const eased: number = easeOutExpo(progress);
    el.textContent = Math.floor(eased * target).toLocaleString();
    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = target.toLocaleString();
    }
  }
  requestAnimationFrame(tick);
}
