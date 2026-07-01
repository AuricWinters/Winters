<template>
  <div
    class="heatmap-container"
    :class="{ embedded: embedded }"
  >
    <div class="heatmap-header">
      <h4>{{ t('活动情况') }}</h4>
      <span class="heatmap-subtitle">{{ currentMonthName }} · {{ totalContributions }}{{ t('次活动') }}</span>
    </div>

    <div class="heatmap-calendar">
      <div class="heatmap-months">
        <div
          v-for="(month, index) in monthsData"
          :key="index"
          class="heatmap-month-row"
        >
          <span class="month-label">{{ month.name }}</span>
          <div class="month-cells">
            <div
              v-for="(day, dayIndex) in month.days"
              :key="dayIndex"
              class="heatmap-cell"
              :class="getIntensityClass(day.count)"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="heatmap-legend">
      <span>{{ t('少') }}</span>
      <div class="legend-cells">
        <div class="legend-cell level-0" />
        <div class="legend-cell level-1" />
        <div class="legend-cell level-2" />
        <div class="legend-cell level-3" />
        <div class="legend-cell level-4" />
      </div>
      <span>{{ t('多') }}</span>
    </div>

    <div class="heatmap-progress">
      <div class="progress-header">
        <span>{{ t('半年活跃度') }}</span>
        <span class="progress-percentage">{{ progressPercentage }}%</span>
      </div>
      <div class="progress-bar-container">
        <div
          class="progress-bar"
          :style="{ width: progressPercentage + '%' }"
        />
      </div>
      <div class="progress-stats">
        <span>{{ t(`活跃 ${activeWorkdays} 个工作日 / 目标 ${workdayGoal} 个`) }}</span>
        <span>{{ t(`共 ${totalWorkdays} 个工作日`) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useI18n } from '../composables/useI18n.ts';
const { t } = useI18n();

const props = defineProps({
  workdayGoalPercentage: {
    type: Number,
    default: 80, // 目标工作日活跃百分比（80%）
  },
  embedded: {
    type: Boolean,
    default: false, // 嵌入模式：去掉外层卡片样式，适合嵌入手账便利贴
  },
});

const contributionData = ref([]);

// 获取北京时间
const getBeijingTime = () => {
  const now = new Date();
  const beijingOffset = 8 * 60; // 北京时间偏移量（分钟）
  const localOffset = now.getTimezoneOffset(); // 本地时区偏移量（分钟）
  const offsetDiff = (beijingOffset + localOffset) * 60 * 1000; // 转换为毫秒
  return new Date(now.getTime() + offsetDiff);
};

const generateSampleData = () => {
  const data = [];
  const today = getBeijingTime();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  // 生成最近 6 个月的数据
  for (let monthOffset = 5; monthOffset >= 0; monthOffset--) {
    const targetMonth = currentMonth - monthOffset;
    const targetYear = currentYear + Math.floor(targetMonth / 12);
    const actualMonth = ((targetMonth % 12) + 12) % 12;

    const daysInMonth = new Date(targetYear, actualMonth + 1, 0).getDate();
    const monthDays = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(targetYear, actualMonth, day);
      const randomCount = Math.random();
      let count = 0;
      if (randomCount > 0.5) count = Math.floor(Math.random() * 3) + 1;
      if (randomCount > 0.75) count = Math.floor(Math.random() * 5) + 3;
      if (randomCount > 0.9) count = Math.floor(Math.random() * 8) + 8;

      monthDays.push({
        date: date,
        count: count,
      });
    }

    data.push({
      year: targetYear,
      month: actualMonth,
      days: monthDays,
    });
  }

  return data;
};

const monthsData = computed(() => {
  const monthNames = [
    '1 月', '2 月', '3 月', '4 月',
    '5 月', '6 月', '7 月', '8 月',
    '9 月', '10 月', '11 月', '12 月',
  ];
  return contributionData.value.map((m) => ({
    name: t(monthNames[m.month]),
    days: m.days,
  }));
});

const currentMonthName = computed(() => {
  return monthsData.value.map((m) => m.name).join('、');
});

const totalContributions = computed(() => {
  return contributionData.value.reduce((sum, month) => {
    return sum + month.days.reduce((daySum, day) => daySum + day.count, 0);
  }, 0);
});

// 判断是否为工作日（周一到周五）
const isWorkday = (date) => {
  const day = date.getDay();
  return day >= 1 && day <= 5; // 周一到周五
};

// 计算有活动的工作日天数
const activeWorkdays = computed(() => {
  return contributionData.value.reduce((sum, month) => {
    return sum + month.days.filter((day) => day.count > 0 && isWorkday(day.date)).length;
  }, 0);
});

// 计算总工作日天数
const totalWorkdays = computed(() => {
  return contributionData.value.reduce((sum, month) => {
    return sum + month.days.filter((day) => isWorkday(day.date)).length;
  }, 0);
});

// 计算目标工作日天数（总工作日的 80%）
const workdayGoal = computed(() => {
  return Math.round((totalWorkdays.value * props.workdayGoalPercentage) / 100);
});

// 计算平均活动强度
const averageIntensity = computed(() => {
  const activeDaysList = contributionData.value.flatMap((m) =>
    m.days.filter((day) => day.count > 0)
  );
  if (activeDaysList.length === 0) return 0;
  const total = activeDaysList.reduce((sum, day) => sum + day.count, 0);
  return Math.round((total / activeDaysList.length) * 10) / 10;
});

const progressPercentage = computed(() => {
  const percentage = Math.min(100, Math.round((activeWorkdays.value / workdayGoal.value) * 100));
  return percentage;
});

const getIntensityClass = (count) => {
  if (count === 0) return 'level-0';
  if (count <= 2) return 'level-1';
  if (count <= 5) return 'level-2';
  if (count <= 10) return 'level-3';
  return 'level-4';
};

onMounted(() => {
  contributionData.value = generateSampleData();
});
</script>

<style scoped>
.heatmap-container {
  background: var(--bg-card);
  border-radius: var(--radius);
  padding: 30px;
  box-shadow: var(--shadow-md);
  position: relative;
  z-index: 100;
  overflow: visible;
}

.heatmap-container.embedded {
  background: transparent;
  border-radius: 0;
  padding: 0;
  box-shadow: none;
}

.heatmap-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.heatmap-header h4 {
  font-size: 14px;
  font-weight: 700;
  margin: 0;
}

.heatmap-subtitle {
  font-size: 12px;
  color: var(--text-secondary);
}

.heatmap-calendar {
  padding-bottom: 8px;
  overflow-x: auto;
  position: relative;
  z-index: 200;
  overflow: visible;
}

.heatmap-months {
  display: flex;
  flex-direction: column;
  gap: 4px;
  position: relative;
  z-index: 300;
  overflow: visible;
}

.heatmap-month-row {
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  z-index: 400;
  overflow: visible;
}

.month-label {
  font-size: 11px;
  color: var(--text-secondary);
  width: 32px;
  flex-shrink: 0;
  text-align: right;
  position: relative;
  z-index: 2;
}

.month-cells {
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
  flex: 1;
  position: relative;
  z-index: 500;
  overflow: visible;
}

.heatmap-cell {
  width: 15px;
  height: 15px;
  border-radius: 3px;
  background: var(--border-color);
  transition: all 0.2s ease;
  cursor: pointer;
  flex-shrink: 0;
  position: relative;
  z-index: 600;
}

.heatmap-cell:hover {
  transform: scale(1.5);
  box-shadow: 0 0 0 2px rgba(var(--primary-rgb), 0.3);
  z-index: 999999 !important;
  position: relative;
  overflow: visible;
}

.heatmap-cell.level-0 {
  background: var(--border-color);
}

.heatmap-cell.level-1 {
  background: rgba(var(--primary-rgb), 0.2);
}
.heatmap-cell.level-2 {
  background: rgba(var(--primary-rgb), 0.45);
}
.heatmap-cell.level-3 {
  background: var(--primary);
}
.heatmap-cell.level-4 {
  background: var(--primary-dark);
}

.heatmap-legend {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
  font-size: 11px;
  color: var(--text-secondary);
  position: relative;
  z-index: 1;
}

.legend-cells {
  display: flex;
  gap: 3px;
}

.legend-cell {
  width: 10px;
  height: 10px;
  border-radius: 2px;
}

/* 与 .heatmap-cell.level-* 共用相同的背景色 */
.legend-cell.level-0 { background: var(--border-color); }
.legend-cell.level-1 { background: rgba(var(--primary-rgb), 0.2); }
.legend-cell.level-2 { background: rgba(var(--primary-rgb), 0.45); }
.legend-cell.level-3 { background: var(--primary); }
.legend-cell.level-4 { background: var(--primary-dark); }

.heatmap-progress {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 1;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 12px;
}

.progress-percentage {
  font-weight: 700;
  color: var(--primary);
}

.progress-bar-container {
  height: 8px;
  background: var(--border-color);
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-light), var(--primary));
  border-radius: 4px;
  transition: width 0.6s ease;
}

.progress-stats {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 11px;
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .heatmap-container {
    padding: 20px;
  }

  .month-label {
    font-size: 10px;
    width: 28px;
  }

  .legend-cell {
    width: 8px;
    height: 8px;
  }

  .heatmap-tooltip {
    font-size: 10px;
    padding: 4px 8px;
  }
}
</style>
