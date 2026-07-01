import { onMounted, onUnmounted } from 'vue';

interface MagnetOptions {
  maxDist?: number;
  strength?: number;
}

export function useMagnet(elRef: any, { maxDist = 120, strength = 20 }: MagnetOptions = {}): void {
  let el: HTMLElement | null = null;

  function onMove(e: MouseEvent): void {
    if (!el) return;
    const rect: DOMRect = el.getBoundingClientRect();
    const cx: number = rect.left + rect.width / 2;
    const cy: number = rect.top + rect.height / 2;
    const dx: number = e.clientX - cx;
    const dy: number = e.clientY - cy;
    const dist: number = Math.sqrt(dx * dx + dy * dy);
    if (dist < maxDist) {
      const s: number = (1 - dist / maxDist) * strength;
      el.style.transform = `translate(${(dx / dist) * s}px, ${(dy / dist) * s}px)`;
    } else {
      el.style.transform = 'translate(0, 0)';
    }
  }

  function onLeave(): void {
    if (!el) return;
    el.style.transform = 'translate(0, 0)';
  }

  onMounted((): void => {
    el = elRef.value || elRef;
    if (!el) return;
    window.addEventListener('mousemove', onMove);
  });

  onUnmounted((): void => {
    window.removeEventListener('mousemove', onMove);
  });
}
