import { onMounted, onUnmounted } from 'vue';
import Particles from '../utils/particles.js';

/**
 * 粒子背景 composable
 * 提取各页面中重复的粒子初始化逻辑
 * @param {string} selector - canvas 选择器
 * @param {boolean} isLoginPage - 是否登录页面（登录页使用特殊效果）
 */
export function useParticles(selector = '.particles-background', isLoginPage = false) {
  let particlesInstance = null;
  let themeObserver = null;

  const getThemeColors = () => {
    const styles = getComputedStyle(document.documentElement);
    return [
      styles.getPropertyValue('--primary').trim() || '#EC4899',
      styles.getPropertyValue('--primary-dark').trim() || '#DB2777',
      styles.getPropertyValue('--accent').trim() || '#F472B6',
      styles.getPropertyValue('--primary-light').trim() || '#F9A8D4',
    ];
  };

  const buildConfig = () => ({
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

  const initParticles = () => {
    particlesInstance = Particles.init(buildConfig());
  };

  // 点击爆炸效果处理函数
  const handleClick = (e) => {
    if (!particlesInstance) return;

    const particlesCanvas = document.querySelector(selector);
    if (particlesCanvas) {
      const rect = particlesCanvas.getBoundingClientRect();
      const canvasWidth = particlesCanvas.width / window.devicePixelRatio;
      const canvasHeight = particlesCanvas.height / window.devicePixelRatio;
      const x = (e.clientX - rect.left) * (canvasWidth / rect.width);
      const y = (e.clientY - rect.top) * (canvasHeight / rect.height);
      particlesInstance.explode(x, y);
    }
  };

  onMounted(() => {
    initParticles();

    // 登录页面绑定点击爆炸效果
    if (isLoginPage) {
      document.addEventListener('click', handleClick);
    }

    // 监听主题变化，重建粒子
    themeObserver = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'attributes' && m.attributeName === 'data-color-theme') {
          // 保存父元素引用后销毁（destroy 会移除 canvas）
          const oldCanvas = document.querySelector(selector);
          const parent = oldCanvas?.parentElement;
          Particles.destroy();
          // 重新创建 canvas 元素
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

  onUnmounted(() => {
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
