<template>
  <div class="learning-page">
    <canvas class="particles-background"></canvas>

    <div class="learning-content">
      <!-- 标题 -->
      <header class="learning-hero">
        <h1>{{ t('🧠 AI赋能全栈开发') }}</h1>
        <p>{{ t('从职校生到AI全栈工程师｜2026.1–2028.6') }}</p>
      </header>

      <!-- 设备选择 -->
      <div class="device-bar">
        <button
          v-for="d in devices"
          :key="d.key"
          class="device-btn"
          :class="{ active: currentDevice === d.key }"
          @click="currentDevice = d.key"
        >
          <span>{{ d.icon }} {{ t(d.name) }}</span>
        </button>
      </div>

      <!-- 进度条 -->
      <div class="progress-box">
        <div class="progress-head">
          <span>{{ t('进度') }}: {{ progressPercent }}%</span>
          <span>{{ t('已完成') }}: {{ completedSteps }}/{{ totalSteps }}</span>
          <button class="reset-btn" @click="resetProgress">{{ t('重置') }}</button>
        </div>
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
        </div>
      </div>

      <!-- 时间线 -->
      <div class="timeline">
        <section v-for="(phase, pi) in plan" :key="pi" class="phase-card">
          <h2 class="phase-head">
            {{ phase.phase }}
            <span class="phase-date">{{ phase.period }}</span>
          </h2>

          <div
            v-for="(week, wi) in phase.weeks"
            :key="wi"
            class="week-card"
          >
            <div class="week-head" @click="toggleWeek(pi, wi)">
              <div class="week-head-left">
                <span class="week-num">{{ wi + 1 }}</span>
                <span class="week-title">{{ week.title }}</span>
                <span v-if="week.period" class="week-date">{{ week.period }}</span>
              </div>
              <span class="week-arrow" :class="{ open: !weeksCollapsed[`${pi}-${wi}`] }">▼</span>
            </div>

            <ul v-show="!weeksCollapsed[`${pi}-${wi}`]" class="task-list">
              <li
                v-for="(task, ti) in week.tasks"
                :key="ti"
                class="task-item"
                :class="{ collapsed: tasksCollapsed[taskKey(pi, wi, ti)] }"
              >
                <div class="task-head" @click="toggleTask(pi, wi, ti)">
                  <div class="task-head-left">
                    <span>{{ task.title }}</span>
                  </div>
                  <div class="task-head-right">
                    <span class="task-badge" :class="{ done: isTaskDone(pi, wi, ti) }">
                      {{ isTaskDone(pi, wi, ti) ? t('已完成') : t('未完成') }}
                    </span>
                    <span v-if="task.steps?.length" class="task-arrow" :class="{ open: !tasksCollapsed[taskKey(pi, wi, ti)] }">▲</span>
                  </div>
                </div>

                <ul v-if="task.steps?.length" v-show="!tasksCollapsed[taskKey(pi, wi, ti)]" class="step-list">
                  <li
                    v-for="(step, si) in task.steps"
                    :key="si"
                    class="step-item"
                    :class="{ done: progress[stepKey(pi, wi, ti, si)] }"
                    @click="toggleStep(pi, wi, ti, si)"
                  >
                    <span class="step-num">{{ si + 1 }}</span>
                    <span class="step-text">{{ step }}</span>
                    <span class="step-badge" :class="{ done: progress[stepKey(pi, wi, ti, si)] }">
                      {{ progress[stepKey(pi, wi, ti, si)] ? t('已完成') : t('未完成') }}
                    </span>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </section>
      </div>

      <!-- 底部说明 -->
      <div class="insight-box">
        <h4>{{ t('💡 为什么这个计划能让你"不被AI取代"？') }}</h4>
        <ul>
          <li>{{ t('"会写React，但不会集成AI"→"纯手动开发社区应用，用API轻量集成AI"') }}</li>
          <li>{{ t('"用AI生成代码"→"所有代码手写，AI仅做本地测试"') }}</li>
          <li>{{ t('"项目无技术深度"→"开源社区应用+AI机器人（GitHub 500+ stars）"') }}</li>
          <li>{{ t('"简历写\'会用AI\'"→"简历写\'通过API集成本地AI模型，支持群聊机器人\'"') }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue';
import { useParticles } from '../composables/useParticles.js';
import { useI18n } from '../composables/useI18n.js';
import { plan } from '../data/learning-plan.js';

const { t } = useI18n();

useParticles('.particles-background', false);

// ---- 设备 ----
const devices = [
  { key: 'npu', name: '小新Pro (NPU)', icon: '💡', desc: 'Ryzen AI 7 H350 + 32GB' },
  { key: 'gpu', name: '游戏台式机', icon: '🔥', desc: 'RTX 6750 GRE + 5600X' },
];
const currentDevice = ref('npu');

// ---- 折叠 ----
const weeksCollapsed = reactive({});
const tasksCollapsed = reactive({});

function toggleWeek(pi, wi) {
  const k = `${pi}-${wi}`;
  weeksCollapsed[k] = !weeksCollapsed[k];
}
function toggleTask(pi, wi, ti) {
  const k = taskKey(pi, wi, ti);
  tasksCollapsed[k] = !tasksCollapsed[k];
}

// ---- 进度 ----
const STORAGE_KEY = 'aiJourneyProgress';
const progress = reactive(JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'));

// 全局 task index
function globalTaskIdx(pi, wi) {
  let idx = 0;
  for (let p = 0; p < pi; p++) {
    for (const w of plan[p].weeks) idx += w.tasks.length;
  }
  for (let w = 0; w < wi; w++) idx += plan[pi].weeks[w].tasks.length;
  return idx;
}

function taskKey(pi, wi, ti) { return `task-${globalTaskIdx(pi, wi) + ti}`; }
function stepKey(pi, wi, ti, si) { return `${taskKey(pi, wi, ti)}-step-${si}`; }

function isTaskDone(pi, wi, ti) {
  const task = plan[pi].weeks[wi].tasks[ti];
  if (!task.steps?.length) return !!progress[taskKey(pi, wi, ti)];
  return task.steps.every((_, si) => progress[stepKey(pi, wi, ti, si)]);
}

function toggleStep(pi, wi, ti, si) {
  const k = stepKey(pi, wi, ti, si);
  progress[k] = !progress[k];
  // 自动展开已完成任务、折叠未完成任务
  const tk = taskKey(pi, wi, ti);
  if (isTaskDone(pi, wi, ti)) {
    tasksCollapsed[tk] = true;
  }
}

// 自动折叠已完成任务
watch(progress, () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}, { deep: true });

// ---- 统计 ----
const totalSteps = computed(() => {
  let n = 0;
  for (const p of plan) for (const w of p.weeks) for (const t of w.tasks) {
    n += t.steps?.length || 1;
  }
  return n;
});

const completedSteps = computed(() => {
  let n = 0;
  for (const p of plan) for (const w of p.weeks) for (const t of w.tasks) {
    if (t.steps?.length) {
      for (let i = 0; i < t.steps.length; i++) {
        if (progress[stepKey(...getIndices(p, w, t, i))]) n++;
      }
    } else n++;
  }
  return n;

  function getIndices(p, w, t, si) {
    const pi = plan.indexOf(p);
    const wi = p.weeks.indexOf(w);
    const ti = w.tasks.indexOf(t);
    return [pi, wi, ti, si];
  }
});

const progressPercent = computed(() =>
  totalSteps.value ? Math.round((completedSteps.value / totalSteps.value) * 100) : 0
);

function resetProgress() {
  for (const k of Object.keys(progress)) delete progress[k];
}
</script>

<style scoped>
.learning-page {
  position: relative;
  min-height: 100vh;
}

.learning-content {
  position: relative;
  z-index: 10;
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 24px 60px;
}

/* ---- 标题 ---- */
.learning-hero {
  text-align: center;
  padding: 32px 0 24px;
}
.learning-hero h1 {
  font-size: 36px;
  font-weight: 800;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin: 0 0 8px;
}
.learning-hero p {
  font-size: 15px;
  color: var(--text-secondary);
  margin: 0;
}

/* ---- 设备选择 ---- */
.device-bar {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 12px 0 24px;
}
.device-btn {
  padding: 10px 22px;
  border: 2px solid var(--border-color);
  background: var(--bg-card);
  border-radius: 14px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--text-main);
  font-family: inherit;
}
.device-btn.active {
  border-color: var(--primary);
  background: rgba(var(--primary-rgb), 0.08);
  color: var(--primary);
}

/* ---- 进度 ---- */
.progress-box {
  background: var(--bg-card);
  border-radius: var(--radius);
  padding: 20px 24px;
  margin-bottom: 24px;
  box-shadow: var(--shadow-sm);
}
.progress-head {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-main);
}
.reset-btn {
  margin-left: auto;
  background: var(--danger);
  color: #fff;
  border: none;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;
}
.reset-btn:hover { opacity: 0.85; }
.progress-track {
  height: 12px;
  background: var(--border-color);
  border-radius: 6px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary), var(--primary-dark));
  border-radius: 6px;
  transition: width 0.4s ease;
}

/* ---- 阶段 ---- */
.phase-card {
  margin-bottom: 8px;
}
.phase-head {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-main);
  margin: 24px 0 12px;
  display: flex;
  align-items: center;
  gap: 12px;
}
.phase-date {
  background: rgba(var(--primary-rgb), 0.08);
  color: var(--primary);
  padding: 4px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
}

/* ---- 周卡片 ---- */
.week-card {
  background: var(--bg-card);
  border-radius: 12px;
  margin-bottom: 16px;
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  border-left: 4px solid var(--primary);
  transition: all 0.2s;
}
.week-card:hover {
  box-shadow: var(--shadow-md);
}
.week-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  cursor: pointer;
  user-select: none;
}
.week-head-left {
  display: flex;
  align-items: center;
  gap: 12px;
}
.week-num {
  width: 36px; height: 36px;
  border-radius: 50%;
  background: var(--primary);
  color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-weight: 700;
  font-size: 14px;
  flex-shrink: 0;
}
.week-title { font-weight: 700; font-size: 16px; color: var(--text-main); }
.week-date {
  background: rgba(var(--primary-rgb), 0.08);
  color: var(--primary);
  padding: 2px 10px; border-radius: 12px;
  font-size: 12px; font-weight: 600;
}
.week-arrow { font-size: 12px; color: var(--text-secondary); transition: transform 0.3s; }
.week-arrow.open { transform: rotate(180deg); }

/* ---- 任务 ---- */
.task-list {
  list-style: none;
  margin: 0; padding: 0 20px 16px;
}
.task-item {
  background: rgba(var(--primary-rgb), 0.04);
  border-radius: 10px;
  margin-bottom: 8px;
  overflow: hidden;
  border-left: 3px solid var(--primary);
}
.task-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  cursor: pointer;
  font-size: 14px;
  color: var(--text-main);
}
.task-head-left { flex: 1; }
.task-head-right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.task-badge {
  background: var(--danger);
  color: #fff;
  padding: 3px 10px; border-radius: 10px;
  font-size: 11px; font-weight: 600;
}
.task-badge.done { background: var(--success); }
.task-arrow { font-size: 10px; color: var(--primary); transition: transform 0.3s; }
.task-arrow.open { transform: rotate(180deg); }

/* ---- 步骤 ---- */
.step-list {
  list-style: none;
  margin: 0; padding: 0;
  background: var(--bg-card);
  border-top: 1px solid var(--border-color);
}
.step-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 14px 9px 28px;
  cursor: pointer;
  font-size: 13px;
  border-bottom: 1px solid var(--border-color);
  transition: background 0.15s;
  color: var(--text-main);
}
.step-item:last-child { border-bottom: none; }
.step-item:hover { background: rgba(var(--primary-rgb), 0.04); }
.step-item.done { opacity: 0.65; }
.step-num {
  width: 20px; height: 20px;
  border-radius: 50%;
  background: var(--primary);
  color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 700;
  flex-shrink: 0;
}
.step-text { flex: 1; line-height: 1.5; }
.step-badge {
  background: var(--danger);
  color: #fff;
  padding: 2px 8px; border-radius: 8px;
  font-size: 10px; font-weight: 600;
  flex-shrink: 0;
}
.step-badge.done { background: var(--success); }

/* ---- 底部 ---- */
.insight-box {
  background: var(--bg-card);
  border-radius: var(--radius);
  padding: 24px;
  margin-top: 32px;
  box-shadow: var(--shadow-sm);
}
.insight-box h4 { color: var(--primary); margin: 0 0 12px; font-size: 16px; }
.insight-box ul { padding-left: 20px; color: var(--text-secondary); font-size: 14px; line-height: 2; }

@media (max-width: 768px) {
  .learning-content { padding: 20px 16px 40px; }
  .learning-hero h1 { font-size: 26px; }
  .device-bar { flex-direction: column; align-items: center; }
}
</style>
