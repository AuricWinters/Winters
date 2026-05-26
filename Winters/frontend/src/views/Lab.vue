<template>
  <div class="lab-page">
    <canvas class="particles-background" />

    <div class="lab-container">
      <header class="lab-header scroll-reveal">
        <h1 class="display-title">
          The <span class="highlight">Lab</span>.
          <span class="badge">Experimental</span>
        </h1>
        <p class="subtitle">
          一个用于探索创意编程、交互设计与前沿 Web 技术的游乐场。
        </p>
      </header>

      <div class="bento-grid">
      <!-- Canvas Particles -->
      <article 
        class="bento-card card-particles scroll-reveal" 
        @click="goToParticleLab"
        style="--delay: 1;"
      >
        <div class="card-bg">
          <div class="mesh-gradient"></div>
          <div class="dot-pattern"></div>
        </div>
        <div class="card-content">
          <div class="card-top">
            <span class="tag">Interactive</span>
            <div class="icon-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M5 19L19 5M19 5v10M19 5H9" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
          <div class="card-bottom">
            <h2>Canvas 粒子动画</h2>
            <p>基于原生 Canvas API 构建的高性能粒子交互系统，支持万级粒子渲染与鼠标排斥物理模拟。</p>
          </div>
        </div>
      </article>

      <!-- Web Audio -->
      <article 
        class="bento-card card-audio scroll-reveal" 
        @click="goToPianoLab"
        style="--delay: 2;"
      >
        <div class="card-bg">
          <div class="mesh-gradient"></div>
        </div>
        <div class="card-content">
          <div class="card-top">
            <!-- <span class="tag">Audio API</span> -->
            <span class="tag wip">开发中</span>
            <div class="icon-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M5 19L19 5M19 5v10M19 5H9" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
          <div class="card-bottom">
            <h2>Web Audio 钢琴</h2>
            <p>利用浏览器底层 AudioContext 开发的虚拟合成器，包含实时音频波形分析与按键发声交互。</p>
          </div>
        </div>
      </article>

      <!-- 2D Physics -->
      <article 
        class="bento-card card-physics disabled scroll-reveal" 
        @click="showDevelopingToast"
        style="--delay: 3;"
      >
        <div class="card-bg"></div>
        <div class="card-content">
          <div class="card-top">
            <span class="tag wip">开发中</span>
            <!-- <div class="icon-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M5 19L19 5M19 5v10M19 5H9" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div> -->
          </div>
          <div class="card-bottom">
            <h2>2D 物理引擎</h2>
            <p>使用 Matter.js 实现的基础物理碰撞模拟器，用于测试重力、摩擦与刚体碰撞效果。</p>
          </div>
        </div>
      </article>

      <!-- 编程学习 -->
      <article 
        class="bento-card card-code scroll-reveal" 
        @click="goToCodeLab"
        style="--delay: 3;"
      >
        <div class="card-bg">
          <div class="mesh-gradient"></div>
        </div>
        <div class="card-content">
          <div class="card-top">
            <!-- <span class="tag">Code Lab</span> -->
            <span class="tag wip">开发中</span>
            <div class="icon-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M5 19L19 5M19 5v10M19 5H9" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
          <div class="card-bottom">
            <h2>编程学习实验室</h2>
            <p>学习C、Python、JavaScript等多种编程语言的基础知识，通过交互式教程和示例代码快速掌握编程技能。</p>
          </div>
        </div>
      </article>

      <!-- Regex Visualizer -->
      <article 
        class="bento-card card-regex disabled scroll-reveal" 
        @click="showDevelopingToast"
        style="--delay: 4;"
      >
        <div class="card-bg"></div>
        <div class="card-content">
          <div class="card-top">
            <span class="tag wip">开发中</span>
            <!-- <div class="icon-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M5 19L19 5M19 5v10M19 5H9" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div> -->
          </div>
          <div class="card-bottom">
            <h2>正则表达式可视化</h2>
            <p>将复杂的正则表达式逻辑结构图形化，支持在线编辑与实时语法树生成，极大提升调试效率。</p>
          </div>
        </div>
      </article>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useParticles } from '../composables/useParticles.js';
import { useScrollReveal } from '../composables/useScrollReveal.js';
import { useToast } from '../composables/useToast.js';

const router = useRouter();
const { showToast } = useToast();

useParticles();
useScrollReveal();

function goToParticleLab() {
  router.push('/lab/particles');
}

function goToPianoLab() {
  router.push('/lab/piano');
}

function goToCodeLab() {
  router.push('/lab/code');
}

function showDevelopingToast() {
  showToast('该实验项目正在构建中，敬请期待', 'info');
}
</script>

<style scoped>
.lab-page {
  position: relative;
  min-height: 100vh;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.lab-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  box-sizing: border-box;
}

.particles-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
}

/* 头部排版 */
.lab-header {
  margin-top: 120px;
  margin-bottom: 60px;
  padding: 0;
  position: relative;
  z-index: 1;
  width: 100%;
}

.display-title {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.04em;
  color: var(--text-main);
  margin: 0 0 16px 0;
  text-align: left;
}

.display-title .highlight {
  color: var(--primary);
  position: relative;
}

.badge {
  background: var(--text-main);
  color: #fff;
  padding: 6px 14px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  height: fit-content;
}

.subtitle {
  font-size: clamp(1.1rem, 2vw, 1.3rem);
  color: var(--text-secondary);
  max-width: 600px;
  line-height: 1.6;
  font-weight: 400;
}

/* 便当盒网格系统 - 使用3列等宽实现真正的左右交替 */
.bento-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 24px;
}

/* ========================================
 * 交替卡片布局（长方形-正方形交替）
 * 布局逻辑（使用grid-column: span控制宽度）：
 *   - 第1行: 左侧宽(span 2) + 右侧窄(span 1)
 *   - 第2行: 左侧窄(span 1) + 右侧宽(span 2)  ← 真正交换！
 *   - 第3行: 宽(span 2)
 ======================================== */

/* 第1个卡片（第1行左侧）：宽 - 跨2列 */
.bento-card:nth-child(1) {
  grid-column: span 2;
}

/* 第2个卡片（第1行右侧）：窄 - 占1列 */
.bento-card:nth-child(2) {
  grid-column: span 1;
}

/* 第3个卡片（第2行左侧）：窄 - 占1列（交换！）*/
.bento-card:nth-child(3) {
  grid-column: span 1;
}

/* 第4个卡片（第2行右侧）：宽 - 跨2列（交换！）*/
.bento-card:nth-child(4) {
  grid-column: span 2;
}

/* 第5个及以后的卡片：默认宽 - 跨2列 */
.bento-card:nth-child(5),
.bento-card:nth-child(6),
.bento-card:nth-child(7),
.bento-card:nth-child(n+5) {
  grid-column: span 2;
}

/* 窄卡片紧凑样式（第2、3个卡片）*/
.bento-card:nth-child(2),
.bento-card:nth-child(3) {
}

.bento-card:nth-child(2) .card-content,
.bento-card:nth-child(3) .card-content {
  padding: 28px;
}

.bento-card:nth-child(2) .card-bottom h2,
.bento-card:nth-child(3) .card-bottom h2 {
  font-size: 1.8rem;
}

.bento-card:nth-child(2) .card-bottom p,
.bento-card:nth-child(3) .card-bottom p {
  font-size: 1rem;
}

.bento-card {
  position: relative;
  border-radius: 32px;
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 
    0 12px 32px -10px rgba(0,0,0,0.05),
    inset 0 1px 0 rgba(255,255,255,1),
    inset 0 -1px 0 rgba(255,255,255,0.4);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
  animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) backwards;
  animation-delay: calc(var(--delay) * 0.1s);
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.bento-card:hover {
  transform: translateY(-6px) scale(1.01);
  box-shadow: 
    0 24px 48px -12px rgba(0,0,0,0.1),
    0 0 0 1px rgba(236, 72, 153, 0.15),
    inset 0 1px 0 rgba(255,255,255,1);
}

/* 尺寸分配 */
.card-particles { min-height: 450px; }
.card-audio { min-height: 450px; }
.card-code { min-height: 450px; }
.card-physics { min-height: 400px; }
.card-regex { min-height: 400px; }

/* 背景视觉 */
.card-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  opacity: 0.5;
  transition: opacity 0.5s ease;
}

.bento-card:hover .card-bg {
  opacity: 0.8;
}

.mesh-gradient {
  position: absolute;
  inset: 0;
  transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.bento-card:hover .mesh-gradient {
  transform: scale(1.1);
}

.card-particles .mesh-gradient {
  background: 
    radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.25) 0%, transparent 60%),
    radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 60%);
}

.card-audio .mesh-gradient {
  background: 
    radial-gradient(circle at 80% 80%, rgba(244, 63, 94, 0.15) 0%, transparent 60%),
    radial-gradient(circle at 20% 20%, rgba(251, 146, 60, 0.2) 0%, transparent 60%);
}

.card-code .mesh-gradient {
  background: 
    radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.2) 0%, transparent 60%),
    radial-gradient(circle at 20% 80%, rgba(236, 72, 153, 0.15) 0%, transparent 60%);
}

.card-particles .dot-pattern {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(236, 72, 153, 0.1) 1px, transparent 1px);
  background-size: 24px 24px;
  opacity: 0.6;
}

/* 卡片内容 */
.card-content {
  position: relative;
  z-index: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  box-sizing: border-box;
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.tag {
  background: rgba(255, 255, 255, 0.85);
  padding: 8px 18px;
  border-radius: 100px;
  font-size: 13px;
  font-weight: 700;
  color: var(--text-main);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
}

.tag.wip {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
  border: 1px solid rgba(245, 158, 11, 0.2);
  box-shadow: none;
}

/* 图标按钮 - 白色光晕 */
.icon-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--text-main);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.icon-btn svg {
  width: 20px;
  height: 20px;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.bento-card:hover .icon-btn {
  transform: scale(1.08);
  background: var(--primary);
  /* 白色光晕效果 */
  box-shadow:
    0 0 20px rgba(255, 255, 255, 0.5),
    0 0 40px rgba(236, 72, 153, 0.4),
    0 12px 30px rgba(236, 72, 153, 0.3);
}

.bento-card:hover .icon-btn svg {
  transform: translate(2px, -2px);
}

/* 底部文本 */
.card-bottom h2 {
  font-size: 2.2rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  margin-bottom: 12px;
  color: var(--text-main);
}

.card-bottom p {
  font-size: 1.15rem;
  color: var(--text-secondary);
  line-height: 1.6;
  max-width: 100%;
  font-weight: 400;
  word-wrap: break-word;
}

/* 锁定状态 */
.bento-card.disabled {
  cursor: not-allowed;
}

.bento-card.disabled:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 12px 32px -10px rgba(0,0,0,0.05),
    inset 0 1px 0 rgba(255,255,255,1);
}

.bento-card.disabled .card-bg {
  filter: grayscale(100%);
  opacity: 0.1;
}

/* 响应式适配 */
@media (max-width: 1100px) {
  .display-title {
    font-size: 4rem;
  }
  .bento-grid {
    grid-template-columns: 1fr;  /* 改为单列 */
  }

  /* 移动端所有卡片占满整行（重置span）*/
  .bento-card:nth-child(1),
  .bento-card:nth-child(2),
  .bento-card:nth-child(3),
  .bento-card:nth-child(4),
  .bento-card:nth-child(n) {
    grid-column: span 1;  /* 或直接 auto */
  }

  /* 移动端恢复标准内边距（第2、3个窄卡片）*/
  .bento-card:nth-child(2) .card-content,
  .bento-card:nth-child(3) .card-content {
    padding: 32px;  /* 与现有响应式一致 */
  }

  .bento-card:nth-child(2) .card-bottom h2,
  .bento-card:nth-child(3) .card-bottom h2 {
    font-size: 2rem;  /* 恢复为现有值 */
  }

  .bento-card:nth-child(2) .card-bottom p,
  .bento-card:nth-child(3) .card-bottom p {
    font-size: 1.15rem;  /* 恢复原始值 */
  }
  .card-particles, .card-audio, .card-physics, .card-regex {
    min-height: 350px;
  }
  .card-bottom p { max-width: 100%; }
}

@media (max-width: 992px) {
  .display-title {
    font-size: 3.5rem;
  }
  .bento-grid {
    gap: 20px;
  }
  .card-content {
    padding: 32px;
  }
  .card-bottom h2 {
    font-size: 2rem;
  }
}

@media (max-width: 768px) {
  .display-title {
    font-size: 3rem;
  }
  .title-row {
    flex-direction: column;
    gap: 12px;
  }
  .badge {
    margin-top: 0;
  }
  .bento-grid {
    gap: 16px;
  }
  .bento-card {
    border-radius: 24px;
  }
  .card-content {
    padding: 28px;
  }
  .card-bottom h2 {
    font-size: 1.75rem;
  }
  .card-bottom p {
    font-size: 1rem;
  }
}
</style>
