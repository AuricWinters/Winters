<template>
  <div
    class="animated-characters-simple"
    style="width: 550px; height: 400px; position: relative"
  >
    <!-- Purple tall rectangle character - Back layer -->
    <div
      ref="purpleRef"
      class="character purple"
      :style="purpleStyle"
    >
      <!-- Eyes -->
      <div
        class="eyes"
        :style="purpleEyesStyle"
      >
        <div
          class="eye-ball"
          :style="{
            width: '18px',
            height: state.isPurpleBlinking ? '2px' : '18px',
            backgroundColor: 'white',
            overflow: 'hidden',
          }"
        >
          <div
            v-if="!state.isPurpleBlinking"
            class="pupil"
            :style="purplePupilStyle"
          />
        </div>
        <div
          class="eye-ball"
          :style="{
            width: '18px',
            height: state.isPurpleBlinking ? '2px' : '18px',
            backgroundColor: 'white',
            overflow: 'hidden',
          }"
        >
          <div
            v-if="!state.isPurpleBlinking"
            class="pupil"
            :style="purplePupilStyle"
          />
        </div>
      </div>
    </div>

    <!-- Black tall rectangle character - Middle layer -->
    <div
      ref="blackRef"
      class="character black"
      :style="blackStyle"
    >
      <!-- Eyes -->
      <div
        class="eyes"
        :style="blackEyesStyle"
      >
        <div
          class="eye-ball"
          :style="{
            width: '16px',
            height: state.isBlackBlinking ? '2px' : '16px',
            backgroundColor: 'white',
            overflow: 'hidden',
          }"
        >
          <div
            v-if="!state.isBlackBlinking"
            class="pupil"
            :style="blackPupilStyle"
          />
        </div>
        <div
          class="eye-ball"
          :style="{
            width: '16px',
            height: state.isBlackBlinking ? '2px' : '16px',
            backgroundColor: 'white',
            overflow: 'hidden',
          }"
        >
          <div
            v-if="!state.isBlackBlinking"
            class="pupil"
            :style="blackPupilStyle"
          />
        </div>
      </div>
    </div>

    <!-- Orange semi-circle character - Front left -->
    <div
      ref="orangeRef"
      class="character orange"
      :style="orangeStyle"
    >
      <!-- Eyes - just pupils, no white -->
      <div
        class="pupils"
        :style="orangeEyesStyle"
      >
        <div
          class="pupil"
          :style="orangePupilStyle"
        />
        <div
          class="pupil"
          :style="orangePupilStyle"
        />
      </div>
    </div>

    <!-- Yellow tall rectangle character - Front right -->
    <div
      ref="yellowRef"
      class="character yellow"
      :style="yellowStyle"
    >
      <!-- Eyes - just pupils, no white -->
      <div
        class="pupils"
        :style="yellowEyesStyle"
      >
        <div
          class="pupil"
          :style="yellowPupilStyle"
        />
        <div
          class="pupil"
          :style="yellowPupilStyle"
        />
      </div>
      <!-- Horizontal line for mouth -->
      <div
        class="mouth"
        :style="yellowMouthStyle"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';

// Refs
const purpleRef = ref(null);
const blackRef = ref(null);
const yellowRef = ref(null);
const orangeRef = ref(null);

// State
const state = reactive({
  mouseX: 0,
  mouseY: 0,
  isPurpleBlinking: false,
  isBlackBlinking: false,
});

// Mouse move handler
const handleMouseMove = (e) => {
  state.mouseX = e.clientX;
  state.mouseY = e.clientY;
};

// Calculate character positions
const calculatePosition = (ref) => {
  if (!ref.value) return { faceX: 0, faceY: 0, bodySkew: 0 };

  const rect = ref.value.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 3;

  const deltaX = state.mouseX - centerX;
  const deltaY = state.mouseY - centerY;

  const faceX = Math.max(-15, Math.min(15, deltaX / 20));
  const faceY = Math.max(-10, Math.min(10, deltaY / 30));
  const bodySkew = Math.max(-6, Math.min(6, -deltaX / 120));

  return { faceX, faceY, bodySkew };
};

// Calculate pupil position
const calculatePupilPosition = (ref, maxDistance) => {
  if (!ref.value) return { x: 0, y: 0 };

  const rect = ref.value.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 3;

  const deltaX = state.mouseX - centerX;
  const deltaY = state.mouseY - centerY;
  const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), maxDistance);

  const angle = Math.atan2(deltaY, deltaX);
  const x = Math.cos(angle) * distance;
  const y = Math.sin(angle) * distance;

  return { x, y };
};

// Character positions
const purplePos = computed(() => calculatePosition(purpleRef));
const blackPos = computed(() => calculatePosition(blackRef));
const yellowPos = computed(() => calculatePosition(yellowRef));
const orangePos = computed(() => calculatePosition(orangeRef));

// Pupil styles
const purplePupilStyle = computed(() => {
  const pos = calculatePupilPosition(purpleRef, 5);
  return {
    width: '7px',
    height: '7px',
    backgroundColor: '#2D2D2D',
    transform: `translate(${pos.x}px, ${pos.y}px)`,
    transition: 'transform 0.1s ease-out',
  };
});

const blackPupilStyle = computed(() => {
  const pos = calculatePupilPosition(blackRef, 4);
  return {
    width: '6px',
    height: '6px',
    backgroundColor: '#2D2D2D',
    transform: `translate(${pos.x}px, ${pos.y}px)`,
    transition: 'transform 0.1s ease-out',
  };
});

const orangePupilStyle = computed(() => {
  const pos = calculatePupilPosition(orangeRef, 5);
  return {
    width: '12px',
    height: '12px',
    backgroundColor: '#2D2D2D',
    transform: `translate(${pos.x}px, ${pos.y}px)`,
    transition: 'transform 0.1s ease-out',
  };
});

const yellowPupilStyle = computed(() => {
  const pos = calculatePupilPosition(yellowRef, 5);
  return {
    width: '12px',
    height: '12px',
    backgroundColor: '#2D2D2D',
    transform: `translate(${pos.x}px, ${pos.y}px)`,
    transition: 'transform 0.1s ease-out',
  };
});

// Character styles
const purpleStyle = computed(() => ({
  left: '70px',
  width: '180px',
  height: '400px',
  backgroundColor: '#6C3FF5',
  borderRadius: '10px 10px 0 0',
  zIndex: 1,
  transform: `skewX(${purplePos.value.bodySkew || 0}deg)`,
  transformOrigin: 'bottom center',
  transition: 'all 0.7s ease-in-out',
}));

const blackStyle = computed(() => ({
  left: '240px',
  width: '120px',
  height: '310px',
  backgroundColor: '#2D2D2D',
  borderRadius: '8px 8px 0 0',
  zIndex: 2,
  transform: `skewX(${blackPos.value.bodySkew || 0}deg)`,
  transformOrigin: 'bottom center',
  transition: 'all 0.7s ease-in-out',
}));

const orangeStyle = computed(() => ({
  left: '0px',
  width: '240px',
  height: '200px',
  zIndex: 3,
  backgroundColor: '#FF9B6B',
  borderRadius: '120px 120px 0 0',
  transform: `skewX(${orangePos.value.bodySkew || 0}deg)`,
  transformOrigin: 'bottom center',
  transition: 'all 0.7s ease-in-out',
}));

const yellowStyle = computed(() => ({
  left: '310px',
  width: '140px',
  height: '230px',
  backgroundColor: '#E8D754',
  borderRadius: '70px 70px 0 0',
  zIndex: 4,
  transform: `skewX(${yellowPos.value.bodySkew || 0}deg)`,
  transformOrigin: 'bottom center',
  transition: 'all 0.7s ease-in-out',
}));

// Eyes styles
const purpleEyesStyle = computed(() => ({
  left: `${45 + purplePos.value.faceX}px`,
  top: `${40 + purplePos.value.faceY}px`,
  transition: 'all 0.7s ease-in-out',
}));

const blackEyesStyle = computed(() => ({
  left: `${26 + blackPos.value.faceX}px`,
  top: `${32 + blackPos.value.faceY}px`,
  transition: 'all 0.7s ease-in-out',
}));

const orangeEyesStyle = computed(() => ({
  left: `${82 + (orangePos.value.faceX || 0)}px`,
  top: `${90 + (orangePos.value.faceY || 0)}px`,
  transition: 'all 0.2s ease-out',
}));

const yellowEyesStyle = computed(() => ({
  left: `${52 + (yellowPos.value.faceX || 0)}px`,
  top: `${40 + (yellowPos.value.faceY || 0)}px`,
  transition: 'all 0.2s ease-out',
}));

const yellowMouthStyle = computed(() => ({
  left: `${40 + (yellowPos.value.faceX || 0)}px`,
  top: `${88 + (yellowPos.value.faceY || 0)}px`,
  transition: 'all 0.2s ease-out',
}));

// Blinking effects
let purpleBlinkTimeout = null;
let blackBlinkTimeout = null;

const schedulePurpleBlink = () => {
  const getRandomBlinkInterval = () => Math.random() * 4000 + 3000;

  purpleBlinkTimeout = setTimeout(() => {
    state.isPurpleBlinking = true;
    setTimeout(() => {
      state.isPurpleBlinking = false;
      schedulePurpleBlink();
    }, 150);
  }, getRandomBlinkInterval());
};

const scheduleBlackBlink = () => {
  const getRandomBlinkInterval = () => Math.random() * 4000 + 3000;

  blackBlinkTimeout = setTimeout(() => {
    state.isBlackBlinking = true;
    setTimeout(() => {
      state.isBlackBlinking = false;
      scheduleBlackBlink();
    }, 150);
  }, getRandomBlinkInterval());
};

// Lifecycle
onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove);
  schedulePurpleBlink();
  scheduleBlackBlink();
});

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove);
  if (purpleBlinkTimeout) clearTimeout(purpleBlinkTimeout);
  if (blackBlinkTimeout) clearTimeout(blackBlinkTimeout);
});
</script>

<style scoped>
.animated-characters-simple {
  position: relative;
  width: 100%;
  height: 100%;
}

.character {
  position: absolute;
  bottom: 0;
  transition: all 0.7s ease-in-out;
}

.eyes {
  position: absolute;
  display: flex;
  gap: 8px;
  transition: all 0.7s ease-in-out;
}

.pupils {
  position: absolute;
  display: flex;
  gap: 8px;
  transition: all 0.2s ease-out;
}

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

.mouth {
  position: absolute;
  width: 20px;
  height: 4px;
  background: #2d2d2d;
  border-radius: 2px;
  transition: all 0.2s ease-out;
}
</style>
