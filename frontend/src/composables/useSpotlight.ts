import { onMounted, onUnmounted } from 'vue';

export function useSpotlight(elRef: any): void {
  let el: HTMLElement | null = null;

  function onMove(e: MouseEvent): void {
    if (!el) return;
    const rect: DOMRect = el.getBoundingClientRect();
    const x: number = ((e.clientX - rect.left) / rect.width) * 100;
    const y: number = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty('--mx', x + '%');
    el.style.setProperty('--my', y + '%');
  }

  onMounted((): void => {
    el = elRef.value || elRef;
    if (el) el.addEventListener('mousemove', onMove);
  });

  onUnmounted((): void => {
    if (el) el.removeEventListener('mousemove', onMove);
  });
}
