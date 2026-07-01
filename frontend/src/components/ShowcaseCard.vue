<template>
  <div class="showcase-card">
    <div class="comp-header">
      <span class="comp-name">{{ comp.name }}</span>
      <span :class="['comp-tag', comp.level]">{{ comp.level }}</span>
    </div>
    <div class="comp-demo">
      <SafeDemo>
        <template v-if="comp.component">
          <component
            :is="comp.component"
            v-bind="comp.props || {}"
          >
            <template #default>
              {{ comp.slot || comp.name }}
            </template>
          </component>
        </template>
        <template v-else-if="comp.showDirective">
          <div
            v-spotlight
            class="directive-demo"
          >
            <span>{{ comp.name }}</span>
          </div>
        </template>
        <template v-else>
          <span class="comp-placeholder">{{ comp.name }}</span>
        </template>
      </SafeDemo>
    </div>
  </div>
</template>

<script setup lang="ts">
import SafeDemo from './SafeDemo.vue'
defineProps({ comp: Object })
</script>

<style scoped>
.showcase-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s;
}
.showcase-card:hover {
  border-color: rgba(var(--primary-rgb), 0.3);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
.comp-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
}
.comp-name { font-size: 13px; font-weight: 700; color: var(--text-main); }
.comp-tag { font-size: 10px; padding: 2px 8px; border-radius: 4px; font-weight: 600; }
.comp-tag.Easy { background: rgba(52,211,153,0.12); color: #34d399; }
.comp-tag.Medium { background: rgba(251,191,36,0.12); color: #fbbf24; }
.comp-tag.Hard { background: rgba(239,68,68,0.12); color: #f87171; }
.comp-tag.WebGL { background: rgba(167,139,250,0.12); color: #a78bfa; }
.comp-demo { padding: 16px; min-height: 80px; display: flex; align-items: center; justify-content: center; font-size: 14px; }
.comp-placeholder { color: var(--text-secondary); }
.directive-demo {
  width: 120px; height: 60px;
  background: rgba(var(--primary-rgb), 0.05);
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; color: var(--text-secondary);
}
</style>
