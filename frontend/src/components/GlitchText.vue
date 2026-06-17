<template>
  <span class="glitch-text" :data-text="text">{{ text }}<slot /></span>
</template>

<script setup>
defineProps({
  text: { type: String, default: '' },
})
</script>

<style scoped>
.glitch-text {
  position: relative;
  display: inline-block;
  letter-spacing: 2px;
  animation: glitch-skew 4s infinite linear alternate-reverse;
}
.glitch-text::before,
.glitch-text::after {
  content: attr(data-text);
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  opacity: 0.8;
}
.glitch-text::before {
  color: #f472b6;
  z-index: -1;
  animation: glitch-clip1 3s infinite linear alternate-reverse;
}
.glitch-text::after {
  color: #60a5fa;
  z-index: -2;
  animation: glitch-clip2 2s infinite linear alternate-reverse;
}
@keyframes glitch-skew {
  0%,100%{transform:skew(0)}
  5%{transform:skew(0.5deg)}
  10%{transform:skew(-0.3deg)}
  15%{transform:skew(0)}
}
@keyframes glitch-clip1 {
  0%,100%{clip-path:inset(0 0 80% 0)}
  20%{clip-path:inset(20% 0 60% 0)}
  40%{clip-path:inset(60% 0 20% 0)}
  60%{clip-path:inset(40% 0 40% 0)}
  80%{clip-path:inset(80% 0 0 0)}
}
@keyframes glitch-clip2 {
  0%,100%{clip-path:inset(80% 0 0 0)}
  20%{clip-path:inset(10% 0 70% 0)}
  40%{clip-path:inset(50% 0 30% 0)}
  60%{clip-path:inset(30% 0 50% 0)}
  80%{clip-path:inset(70% 0 10% 0)}
}
</style>
