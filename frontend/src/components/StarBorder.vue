<template>
  <div class="star-border">
    <div class="star-border-inner">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  speed: { type: Number, default: 4 },
})
</script>

<style scoped>
.star-border {
  position: relative;
  border-radius: inherit;
  overflow: hidden;
  z-index: 0;
}
.star-border::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: inherit;
  background: conic-gradient(
    from 0deg,
    transparent 0%,
    var(--primary) 10%,
    transparent 20%,
    var(--secondary) 35%,
    transparent 45%,
    var(--accent) 60%,
    transparent 70%,
    var(--primary) 85%,
    transparent 100%
  );
  animation: star-spin calc(var(--sb-speed, 4) * 1s) linear infinite;
  z-index: -1;
  opacity: 0.5;
}
.star-border-inner {
  position: relative;
  z-index: 1;
  border-radius: inherit;
}
@keyframes star-spin {
  to { transform: rotate(360deg); }
}
</style>
