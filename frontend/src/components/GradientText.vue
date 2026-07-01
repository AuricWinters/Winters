<template>
  <span class="gradient-text">{{ text }}<slot /></span>
</template>

<script setup lang="ts">
defineProps({
  text: { type: String, default: '' },
})
</script>

<style scoped>
.gradient-text {
  font-weight: inherit;
  font-size: inherit;
  background: linear-gradient(270deg,
    var(--primary),
    var(--secondary),
    var(--accent),
    var(--primary)
  );
  background-size: 300% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradient-flow 5s linear infinite;
  display: inline-block;
}

@keyframes gradient-flow {
  0%   { background-position: 0% 0; }
  100% { background-position: 300% 0; }
}
</style>
