import { onMounted, onUnmounted } from 'vue';
import Particles from '../utils/particles.js';

export function useParticles(selector: string = '.particles-background', isLoginPage: boolean = false): void {
  let particlesInstance: any = null;
  let themeObserver: MutationObserver | null = null;

  const getThemeColors = (): string[] => {
    const styles = getComputedStyle(document.documentElement);
    return [
      styles.getPropertyValue('--primary').trim() || '#EC4899',
      styles.getPropertyValue('--primary-dark').trim() || '#DB2777',
      styles.getPropertyValue('--accent').trim() || '#F472B6',
      styles.getPropertyValue('--primary-light').trim() || '#F9A8D4',
    ];
  };

  const buildConfig = (): Record<string, any> => ({
    selector,
    maxParticles: 250,
    sizeVariations: 5,
    speed: 0.3,
    color: getThemeColors(),
    minDistance: 150,
    connectParticles: true,
    mouseAttract: true,
    attractRadius: 250,
    attractStrength: 0.1,
    attractEase: 0.15,
    isLoginPage,
  });

  const initParticles = (): void => {
    particlesInstance = Particles.init(buildConfig());
  };

  const handleClick = (e: MouseEvent): void => {
    if (!particlesInstance) return;

    const particlesCanvas = document.querySelector(selector);
    if (particlesCanvas) {
      const rect = particlesCanvas.getBoundingClientRect();
      const canvasEl = particlesCanvas as HTMLCanvasElement;
      const canvasWidth = canvasEl.width / window.devicePixelRatio;
      const canvasHeight = canvasEl.height / window.devicePixelRatio;
      const x = (e.clientX - rect.left) * (canvasWidth / rect.width);
      const y = (e.clientY - rect.top) * (canvasHeight / rect.height);
      particlesInstance.explode(x, y);
    }
  };

  onMounted((): void => {
    initParticles();

    if (isLoginPage) {
      document.addEventListener('click', handleClick);
    }

    themeObserver = new MutationObserver((mutations: MutationRecord[]) => {
      for (const m of mutations) {
        if (m.type === 'attributes' && m.attributeName === 'data-color-theme') {
          const oldCanvas = document.querySelector(selector);
          const parent = oldCanvas?.parentElement;
          Particles.destroy();
          if (parent) {
            const newCanvas = document.createElement('canvas');
            newCanvas.className = selector.replace(/\./g, '');
            parent.appendChild(newCanvas);
          }
          initParticles();
          break;
        }
      }
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-color-theme'] });
  });

  onUnmounted((): void => {
    if (isLoginPage) {
      document.removeEventListener('click', handleClick);
    }
    if (themeObserver) {
      themeObserver.disconnect();
      themeObserver = null;
    }
    Particles.destroy();
  });
}
