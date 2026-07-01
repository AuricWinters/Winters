<template>
  <div
    class="animated-characters"
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

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, watch } from 'vue';

// Props
const props = defineProps({
  isTyping: {
    type: Boolean,
    default: false,
  },
  showPassword: {
    type: Boolean,
    default: false,
  },
  passwordLength: {
    type: Number,
    default: 0,
  },
});

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
  isLookingAtEachOther: false,
  isPurplePeeking: false,
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
const calculatePupilPosition = (ref, maxDistance, forceLookX, forceLookY) => {
  if (forceLookX !== undefined && forceLookY !== undefined) {
    return { x: forceLookX, y: forceLookY };
  }

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

// Derived state
const isHidingPassword = computed(() => props.passwordLength > 0 && !props.showPassword);

// Force look directions
const purpleForceLookX = computed(() => {
  if (props.passwordLength > 0 && props.showPassword) {
    return state.isPurplePeeking ? 4 : -4;
  }
  if (state.isLookingAtEachOther) {
    return 3;
  }
  return undefined;
});

const purpleForceLookY = computed(() => {
  if (props.passwordLength > 0 && props.showPassword) {
    return state.isPurplePeeking ? 5 : -4;
  }
  if (state.isLookingAtEachOther) {
    return 4;
  }
  return undefined;
});

const blackForceLookX = computed(() => {
  if (props.passwordLength > 0 && props.showPassword) {
    return -4;
  }
  if (state.isLookingAtEachOther) {
    return 0;
  }
  return undefined;
});

const blackForceLookY = computed(() => {
  if (props.passwordLength > 0 && props.showPassword) {
    return -4;
  }
  if (state.isLookingAtEachOther) {
    return -4;
  }
  return undefined;
});

const orangeForceLookX = computed(() => {
  if (props.passwordLength > 0 && props.showPassword) {
    return -5;
  }
  return undefined;
});

const orangeForceLookY = computed(() => {
  if (props.passwordLength > 0 && props.showPassword) {
    return -4;
  }
  return undefined;
});

const yellowForceLookX = computed(() => {
  if (props.passwordLength > 0 && props.showPassword) {
    return -5;
  }
  return undefined;
});

const yellowForceLookY = computed(() => {
  if (props.passwordLength > 0 && props.showPassword) {
    return -4;
  }
  return undefined;
});

// Pupil styles
const purplePupilStyle = computed(() => {
  const pos = calculatePupilPosition(purpleRef, 5, purpleForceLookX.value, purpleForceLookY.value);
  return {
    width: '7px',
    height: '7px',
    backgroundColor: '#2D2D2D',
    transform: `translate(${pos.x}px, ${pos.y}px)`,
    transition: 'transform 0.1s ease-out',
  };
});

const blackPupilStyle = computed(() => {
  const pos = calculatePupilPosition(blackRef, 4, blackForceLookX.value, blackForceLookY.value);
  return {
    width: '6px',
    height: '6px',
    backgroundColor: '#2D2D2D',
    transform: `translate(${pos.x}px, ${pos.y}px)`,
    transition: 'transform 0.1s ease-out',
  };
});

const orangePupilStyle = computed(() => {
  const pos = calculatePupilPosition(orangeRef, 5, orangeForceLookX.value, orangeForceLookY.value);
  return {
    width: '12px',
    height: '12px',
    backgroundColor: '#2D2D2D',
    transform: `translate(${pos.x}px, ${pos.y}px)`,
    transition: 'transform 0.1s ease-out',
  };
});

const yellowPupilStyle = computed(() => {
  const pos = calculatePupilPosition(yellowRef, 5, yellowForceLookX.value, yellowForceLookY.value);
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
  height: props.isTyping || isHidingPassword.value ? '440px' : '400px',
  backgroundColor: '#6C3FF5',
  borderRadius: '10px 10px 0 0',
  zIndex: 1,
  transform:
    props.passwordLength > 0 && props.showPassword
      ? `skewX(0deg)`
      : props.isTyping || isHidingPassword.value
        ? `skewX(${(purplePos.value.bodySkew || 0) - 12}deg) translateX(40px)`
        : `skewX(${purplePos.value.bodySkew || 0}deg)`,
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
  transform:
    props.passwordLength > 0 && props.showPassword
      ? `skewX(0deg)`
      : state.isLookingAtEachOther
        ? `skewX(${(blackPos.value.bodySkew || 0) * 1.5 + 10}deg) translateX(20px)`
        : props.isTyping || isHidingPassword.value
          ? `skewX(${(blackPos.value.bodySkew || 0) * 1.5}deg)`
          : `skewX(${blackPos.value.bodySkew || 0}deg)`,
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
  transform:
    props.passwordLength > 0 && props.showPassword
      ? `skewX(0deg)`
      : `skewX(${orangePos.value.bodySkew || 0}deg)`,
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
  transform:
    props.passwordLength > 0 && props.showPassword
      ? `skewX(0deg)`
      : `skewX(${yellowPos.value.bodySkew || 0}deg)`,
  transformOrigin: 'bottom center',
  transition: 'all 0.7s ease-in-out',
}));

// Eyes styles
const purpleEyesStyle = computed(() => ({
  left:
    props.passwordLength > 0 && props.showPassword
      ? `${20}px`
      : state.isLookingAtEachOther
        ? `${55}px`
        : `${45 + purplePos.value.faceX}px`,
  top:
    props.passwordLength > 0 && props.showPassword
      ? `${35}px`
      : state.isLookingAtEachOther
        ? `${65}px`
        : `${40 + purplePos.value.faceY}px`,
  transition: 'all 0.7s ease-in-out',
}));

const blackEyesStyle = computed(() => ({
  left:
    props.passwordLength > 0 && props.showPassword
      ? `${10}px`
      : state.isLookingAtEachOther
        ? `${32}px`
        : `${26 + blackPos.value.faceX}px`,
  top:
    props.passwordLength > 0 && props.showPassword
      ? `${28}px`
      : state.isLookingAtEachOther
        ? `${12}px`
        : `${32 + blackPos.value.faceY}px`,
  transition: 'all 0.7s ease-in-out',
}));

const orangeEyesStyle = computed(() => ({
  left:
    props.passwordLength > 0 && props.showPassword
      ? `${50}px`
      : `${82 + (orangePos.value.faceX || 0)}px`,
  top:
    props.passwordLength > 0 && props.showPassword
      ? `${85}px`
      : `${90 + (orangePos.value.faceY || 0)}px`,
  transition: 'all 0.2s ease-out',
}));

const yellowEyesStyle = computed(() => ({
  left:
    props.passwordLength > 0 && props.showPassword
      ? `${20}px`
      : `${52 + (yellowPos.value.faceX || 0)}px`,
  top:
    props.passwordLength > 0 && props.showPassword
      ? `${35}px`
      : `${40 + (yellowPos.value.faceY || 0)}px`,
  transition: 'all 0.2s ease-out',
}));

const yellowMouthStyle = computed(() => ({
  left:
    props.passwordLength > 0 && props.showPassword
      ? `${10}px`
      : `${40 + (yellowPos.value.faceX || 0)}px`,
  top:
    props.passwordLength > 0 && props.showPassword
      ? `${88}px`
      : `${88 + (yellowPos.value.faceY || 0)}px`,
  transition: 'all 0.2s ease-out',
}));

// Blinking effects
let purpleBlinkTimeout = null;
let blackBlinkTimeout = null;
let peekTimeout = null;

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

// Peeking effect
const schedulePeek = () => {
  if (props.passwordLength > 0 && props.showPassword) {
    peekTimeout = setTimeout(
      () => {
        state.isPurplePeeking = true;
        setTimeout(() => {
          state.isPurplePeeking = false;
        }, 800);
      },
      Math.random() * 3000 + 2000
    );
  }
};

// Watch for typing
watch(
  () => props.isTyping,
  (newVal) => {
    if (newVal) {
      state.isLookingAtEachOther = true;
      setTimeout(() => {
        state.isLookingAtEachOther = false;
      }, 800);
    } else {
      state.isLookingAtEachOther = false;
    }
  }
);

// Watch for password changes
watch([() => props.passwordLength, () => props.showPassword], () => {
  if (props.passwordLength > 0 && props.showPassword) {
    schedulePeek();
  } else {
    state.isPurplePeeking = false;
    if (peekTimeout) {
      clearTimeout(peekTimeout);
    }
  }
});

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
  if (peekTimeout) clearTimeout(peekTimeout);
});
</script>

<style scoped>
.animated-characters {
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
