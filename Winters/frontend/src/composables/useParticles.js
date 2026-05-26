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

  const defaultConfig = {
    selector,
    maxParticles: 250,
    sizeVariations: 5,
    speed: 0.3,
    color: ['#EC4899', '#DB2777', '#F472B6', '#F9A8D4'],
    minDistance: 150,
    connectParticles: true,
    mouseAttract: true,
    attractRadius: 250,
    attractStrength: 0.1,
    attractEase: 0.15,
    isLoginPage,
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
    particlesInstance = Particles.init(defaultConfig);

    // 登录页面绑定点击爆炸效果
    if (isLoginPage) {
      document.addEventListener('click', handleClick);
    }
  });

  onUnmounted(() => {
    if (isLoginPage) {
      document.removeEventListener('click', handleClick);
    }
    Particles.destroy();
  });
}
