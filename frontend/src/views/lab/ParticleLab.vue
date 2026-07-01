<template>
  <div class="particle-lab-page">
    <canvas
      ref="canvasRef"
      class="particle-canvas"
    />

    <div class="control-panel">
      <h3>{{ t('粒子控制面板') }}</h3>

      <div class="control-group">
        <label>{{ t('粒子数量') }}: {{ config.maxParticles }}</label>
        <input
          v-model.number="config.maxParticles"
          type="range"
          min="50"
          max="500"
          step="10"
          @change="updateParticles"
        >
      </div>

      <div class="control-group">
        <label>{{ t('连线距离') }}: {{ config.minDistance }}px</label>
        <input
          v-model.number="config.minDistance"
          type="range"
          min="0"
          max="300"
          step="10"
          @change="updateParticles"
        >
      </div>

      <div class="control-group">
        <label>{{ t('粒子速度') }}: {{ config.speed }}</label>
        <input
          v-model.number="config.speed"
          type="range"
          min="0.1"
          max="2"
          step="0.1"
          @change="updateParticles"
        >
      </div>

      <div class="control-group">
        <label>{{ t('粒子颜色') }}</label>
        <div class="color-picker">
          <button
            v-for="color in colorPresets"
            :key="color"
            class="color-btn"
            :style="{ background: color }"
            :class="{ active: config.color.includes(color) }"
            @click="toggleColor(color)"
          />
        </div>
      </div>

      <div class="control-group">
        <label>{{ t('鼠标交互模式') }}</label>
        <div class="mode-buttons">
          <button
            class="mode-btn"
            :class="{ active: config.mouseMode === 'attract' }"
            @click="config.mouseMode = 'attract'"
          >
            {{ t('吸引') }}
          </button>
          <button
            class="mode-btn"
            :class="{ active: config.mouseMode === 'repel' }"
            @click="config.mouseMode = 'repel'"
          >
            {{ t('排斥') }}
          </button>
          <button
            class="mode-btn"
            :class="{ active: config.mouseMode === 'none' }"
            @click="config.mouseMode = 'none'"
          >
            {{ t('无') }}
          </button>
        </div>
      </div>

      <div class="control-group">
        <label class="checkbox-label">
          <input
            v-model="config.connectParticles"
            type="checkbox"
            @change="updateParticles"
          >
          {{ t('显示连线') }}
        </label>
      </div>

      <button
        class="reset-btn"
        @click="resetConfig"
      >
        {{ t('重置配置') }}
      </button>
    </div>

    <button
      class="back-btn"
      @click="$router.push('/lab')"
    >
      ← {{ t('返回实验室') }}
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from '../../composables/useI18n.ts';
const { t } = useI18n();

const router = useRouter();
const canvasRef = ref(null);
let animationId = null;
let particles = [];
let mouse = { x: null, y: null };

const colorPresets = ['#EC4899', '#DB2777', '#F472B6', '#F9A8D4', '#ec4899', '#10b981', '#f59e0b'];

const defaultConfig = {
  maxParticles: 150,
  sizeVariations: 5,
  speed: 0.5,
  color: ['#EC4899', '#DB2777', '#F472B6'],
  minDistance: 120,
  connectParticles: true,
  mouseMode: 'attract',
  attractRadius: 200,
  attractStrength: 0.02,
};

const config = reactive({ ...defaultConfig });

function hexToRgb(hex) {
  const cleanHex = String(hex).replace('#', '');
  if (cleanHex.length === 3) {
    const r = parseInt(cleanHex[0] + cleanHex[0], 16);
    const g = parseInt(cleanHex[1] + cleanHex[1], 16);
    const b = parseInt(cleanHex[2] + cleanHex[2], 16);
    return { r, g, b };
  }
  if (cleanHex.length === 6) {
    const r = parseInt(cleanHex.slice(0, 2), 16);
    const g = parseInt(cleanHex.slice(2, 4), 16);
    const b = parseInt(cleanHex.slice(4, 6), 16);
    return { r, g, b };
  }
  return null;
}

function getRandomColor() {
  return config.color[Math.floor(Math.random() * config.color.length)];
}

class Particle {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * config.speed * 2;
    this.vy = (Math.random() - 0.5) * config.speed * 2;
    this.radius = Math.random() * config.sizeVariations + 2;
    this.color = getRandomColor();
  }

  update() {
    // 鼠标交互
    if (config.mouseMode !== 'none' && mouse.x !== null && mouse.y !== null) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < config.attractRadius) {
        const force = (config.attractRadius - distance) / config.attractRadius;
        const strength = config.mouseMode === 'attract' ? config.attractStrength : -config.attractStrength;
        this.vx += (dx / distance) * force * strength * 5;
        this.vy += (dy / distance) * force * strength * 5;
      }
    }

    // 更新位置
    this.x += this.vx;
    this.y += this.vy;

    // 边界反弹
    if (this.x < this.radius || this.x > this.canvas.width - this.radius) {
      this.vx = -this.vx;
      this.x = Math.max(this.radius, Math.min(this.x, this.canvas.width - this.radius));
    }
    if (this.y < this.radius || this.y > this.canvas.height - this.radius) {
      this.vy = -this.vy;
      this.y = Math.max(this.radius, Math.min(this.y, this.canvas.height - this.radius));
    }

    // 速度限制
    const maxSpeed = config.speed * 3;
    const currentSpeed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (currentSpeed > maxSpeed) {
      this.vx = (this.vx / currentSpeed) * maxSpeed;
      this.vy = (this.vy / currentSpeed) * maxSpeed;
    }
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
  }
}

function initParticles() {
  const canvas = canvasRef.value;
  if (!canvas) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  particles = [];
  for (let i = 0; i < config.maxParticles; i++) {
    particles.push(new Particle(canvas, canvas.getContext('2d')));
  }
}

function drawConnections(ctx) {
  if (!config.connectParticles || config.minDistance <= 0) return;

  const base = hexToRgb(config.color[0]) ?? { r: 139, g: 92, b: 246 };
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < config.minDistance) {
        const opacity = 1 - distance / config.minDistance;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${base.r}, ${base.g}, ${base.b}, ${opacity * 0.5})`;
        ctx.lineWidth = 1;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

function animate() {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 更新和绘制粒子
  particles.forEach(particle => {
    particle.update();
    particle.draw();
  });

  // 绘制连线
  drawConnections(ctx);

  animationId = requestAnimationFrame(animate);
}

function updateParticles() {
  const refreshColors = Boolean(arguments[0]?.refreshColors);

  // 调整粒子数量
  const canvas = canvasRef.value;
  if (!canvas) return;

  const currentCount = particles.length;
  const targetCount = config.maxParticles;

  if (targetCount > currentCount) {
    // 添加粒子
    for (let i = currentCount; i < targetCount; i++) {
      particles.push(new Particle(canvas, canvas.getContext('2d')));
    }
  } else if (targetCount < currentCount) {
    // 移除粒子
    particles.splice(targetCount);
  }

  // 更新现有粒子的速度
  particles.forEach(particle => {
    const currentSpeed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
    if (currentSpeed > 0) {
      particle.vx = (particle.vx / currentSpeed) * config.speed;
      particle.vy = (particle.vy / currentSpeed) * config.speed;
    }
    if (refreshColors) {
      particle.color = getRandomColor();
    }
  });
}

function toggleColor(color) {
  const index = config.color.indexOf(color);
  if (index > -1) {
    if (config.color.length > 1) {
      config.color.splice(index, 1);
    }
  } else {
    config.color.push(color);
  }
  updateParticles({ refreshColors: true });
}

function resetConfig() {
  Object.assign(config, defaultConfig);
  updateParticles({ refreshColors: true });
}

function handleMouseMove(e) {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
}

function handleMouseLeave() {
  mouse.x = null;
  mouse.y = null;
}

function handleResize() {
  const canvas = canvasRef.value;
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

onMounted(() => {
  initParticles();
  animate();

  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('resize', handleResize);
  canvasRef.value?.addEventListener('mouseleave', handleMouseLeave);
});

onUnmounted(() => {
  cancelAnimationFrame(animationId);
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
.particle-lab-page {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
}

.particle-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.control-panel {
  position: absolute;
  top: 100px;
  right: 20px;
  width: 280px;
  height: 700px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(236, 72, 153, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.5);
  max-height: calc(100vh - 40px);
  overflow-y: auto;
}

.control-panel h3 {
  margin: 0 0 20px 0;
  font-size: 16px;
  color: var(--text-primary);
  text-align: center;
}

.control-group {
  margin-bottom: 20px;
}

.control-group label {
  display: block;
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.control-group input[type="range"] {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #e2e8f0;
  outline: none;
  -webkit-appearance: none;
}

.control-group input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--primary);
  cursor: pointer;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: var(--primary);
}

.color-picker {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.color-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
}

.color-btn.active {
  border-color: var(--text-primary);
  transform: scale(1.1);
}

.mode-buttons {
  display: flex;
  gap: 8px;
}

.mode-btn {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mode-btn.active {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

.reset-btn {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: white;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.reset-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
}

.back-btn {
  position: absolute;
  top: 100px;
  left: 20px;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  color: var(--text-primary);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.back-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

@media (max-width: 768px) {
  .control-panel {
    width: calc(100% - 40px);
    max-height: 50vh;
    top: auto;
    bottom: 20px;
  }
}
</style>
