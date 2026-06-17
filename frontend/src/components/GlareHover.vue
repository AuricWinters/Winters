<template>
  <div class="glare-hover">
    <div class="glare-content">
      <slot />
    </div>
  </div>
</template>

<script setup>
// Pure CSS — no JS needed
</script>

<style scoped>
.glare-hover {
  position: relative;
  overflow: hidden;
  border-radius: inherit;
}
.glare-hover::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 60%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
  transform: skewX(-15deg);
  transition: left 0.6s ease;
  pointer-events: none;
}
.glare-hover:hover::after {
  left: 120%;
}
.glare-content {
  position: relative;
  z-index: 1;
}
</style>
