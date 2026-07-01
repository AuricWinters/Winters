import { onMounted, onUnmounted } from 'vue';

export function useBorderGlow(elRef: any): void {
  let el: HTMLElement | null = null;

  function onMove(e: MouseEvent): void {
    if (!el) return;
    const rect: DOMRect = el.getBoundingClientRect();
    const x: number = e.clientX - rect.left;
    const y: number = e.clientY - rect.top;
    const angle: number = Math.atan2(y - rect.height / 2, x - rect.width / 2) * (180 / Math.PI);
    el.style.setProperty('--glow-angle', angle + 'deg');
  }

  function onLeave(): void {
    if (!el) return;
    el.style.setProperty('--glow-angle', '0deg');
  }

  onMounted((): void => {
    el = elRef.value || elRef;
    if (!el) return;
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
  });

  onUnmounted((): void => {
    if (!el) return;
    el.removeEventListener('mousemove', onMove);
    el.removeEventListener('mouseleave', onLeave);
  });
}
