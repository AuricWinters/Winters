<template>
  <div
    ref="eyeRef"
    class="eye-ball"
    :style="{
      width: size + 'px',
      height: isBlinking ? '2px' : size + 'px',
      backgroundColor: eyeColor,
      overflow: 'hidden',
    }"
  >
    <div
      v-if="!isBlinking"
      class="pupil"
      :style="{
        width: pupilSize + 'px',
        height: pupilSize + 'px',
        backgroundColor: pupilColor,
        transform: 'translate(' + pupilPosition.x + 'px, ' + pupilPosition.y + 'px)',
        transition: 'transform 0.1s ease-out',
      }"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  size: {
    type: Number,
    default: 48,
  },
  pupilSize: {
    type: Number,
    default: 16,
  },
  maxDistance: {
    type: Number,
    default: 10,
  },
  eyeColor: {
    type: String,
    default: 'white',
  },
  pupilColor: {
    type: String,
    default: 'black',
  },
  isBlinking: {
    type: Boolean,
    default: false,
  },
  forceLookX: {
    type: Number,
    default: undefined,
  },
  forceLookY: {
    type: Number,
    default: undefined,
  },
});

const mouseX = ref(0);
const mouseY = ref(0);
const eyeRef = ref(null);

const handleMouseMove = (e) => {
  mouseX.value = e.clientX;
  mouseY.value = e.clientY;
};

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove);
});

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove);
});

const pupilPosition = computed(() => {
  if (!eyeRef.value) return { x: 0, y: 0 };

  // If forced look direction is provided, use that instead of mouse tracking
  if (props.forceLookX !== undefined && props.forceLookY !== undefined) {
    return { x: props.forceLookX, y: props.forceLookY };
  }

  const eye = eyeRef.value.getBoundingClientRect();
  const eyeCenterX = eye.left + eye.width / 2;
  const eyeCenterY = eye.top + eye.height / 2;

  const deltaX = mouseX.value - eyeCenterX;
  const deltaY = mouseY.value - eyeCenterY;
  const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), props.maxDistance);

  const angle = Math.atan2(deltaY, deltaX);
  const x = Math.cos(angle) * distance;
  const y = Math.sin(angle) * distance;

  return { x, y };
});
</script>

<style scoped>
.eye-ball {
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.pupil {
  border-radius: 50%;
}
</style>
