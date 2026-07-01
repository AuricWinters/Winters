<template>
  <span class="shiny-text">{{ text }}<slot /></span>
</template>

<script setup lang="ts">
defineProps({
  text: { type: String, default: '' },
  speed: { type: Number, default: 4 },
})
</script>

<style scoped>
.shiny-text {
  font-weight: inherit;
  font-size: inherit;
  background: linear-gradient(110deg,
    var(--text-main) 20%,
    rgba(var(--primary-rgb), 0.8) 38%,
    rgba(var(--primary-rgb), 0.8) 46%,
    var(--text-main) 64%
  );
  background-size: 300% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shine calc(var(--speed, 4) * 1s) linear infinite;
  display: inline-block;
}

@keyframes shine {
  0%   { background-position: 200% 0; }
  100% { background-position: -100% 0; }
}
</style>
