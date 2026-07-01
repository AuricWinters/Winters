import { onMounted, onUnmounted } from 'vue';

interface TiltOptions {
  maxDeg?: number;
  perspective?: number;
}

export function useTilt(elRef: any, { maxDeg = 15, perspective = 800 }: TiltOptions = {}): void {
  let el: HTMLElement | null = null;

  function onMove(e: MouseEvent): void {
    if (!el) return;
    const rect: DOMRect = el.getBoundingClientRect();
    const cx: number = rect.left + rect.width / 2;
    const cy: number = rect.top + rect.height / 2;
    const dx: number = (e.clientX - cx) / (rect.width / 2);
    const dy: number = (e.clientY - cy) / (rect.height / 2);
    el.style.transform = `perspective(${perspective}px) rotateY(${dx * maxDeg}deg) rotateX(${-dy * maxDeg}deg)`;
  }

  function onLeave(): void {
    if (!el) return;
    el.style.transform = `perspective(${perspective}px) rotateY(0deg) rotateX(0deg)`;
  }

  onMounted((): void => {
    el = elRef.value || elRef;
    if (!el) return;
    el.style.transformStyle = 'preserve-3d';
    el.style.willChange = 'transform';
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
  });

  onUnmounted((): void => {
    if (!el) return;
    el.removeEventListener('mousemove', onMove);
    el.removeEventListener('mouseleave', onLeave);
  });
}
