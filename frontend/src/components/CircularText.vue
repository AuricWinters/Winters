<template>
  <div class="circular-text-wrap">
    <div
      class="circular-ring"
      :style="{ animationDuration: duration + 's', width: size + 'px', height: size + 'px' }"
    >
      <span
        v-for="(char, i) in chars"
        :key="i"
        class="circular-char"
        :style="{
          '--i': i,
          '--total': chars.length,
          '--radius': size / 2 + 'px',
          transform: `translate(-50%,-50%) rotate(calc(${i} * ${360 / chars.length}deg)) translateY(calc(var(--radius) * -1))`
        }"
      >{{ char }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  text: { type: String, default: '' },
  size: { type: Number, default: 120 },
  duration: { type: Number, default: 10 },
})

const chars = computed(() => props.text.split(''))
</script>

<style scoped>
.circular-text-wrap {
  display: flex;
  justify-content: center;
  padding: 16px;
}
.circular-ring {
  position: relative;
  animation: ring-spin linear infinite;
}
.circular-char {
  position: absolute;
  left: 50%; top: 50%;
  font-weight: 700;
  color: var(--text-main);
  transform-origin: 0 var(--radius);
}
@keyframes ring-spin {
  to { transform: rotate(360deg); }
}
</style>
