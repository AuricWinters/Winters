<template>
  <div
    class="ribbons"
    :style="containerVars"
  >
    <div class="ribbons__bg">
      <div
        v-for="(color, i) in resolvedColors"
        :key="i"
        class="ribbons__ribbon"
        :class="`ribbons__ribbon--${i % ANIMATION_COUNT}`"
        :style="ribbonVars(i, color)"
      />
    </div>

    <div
      v-if="$slots.default"
      class="ribbons__overlay"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Ribbons.vue
 *
 * CSS-only animated ribbon background effect.
 * Replicates the visual feel of the original react-bits Ribbons (WebGL + ogl)
 * using pure CSS keyframe animations, gradients, and backdrop blur.
 *
 * Each ribbon is a soft, blurred shape that follows a unique looping path.
 * Multiple ribbons overlap to create a flowing fabric-like aesthetic.
 *
 * Usage:
 *   <Ribbons :colors="['#ff6b6b', '#ffd93d', '#6bcb77']">
 *     <MyContent />
 *   </Ribbons>
 */

import { computed, useSlots } from 'vue'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ANIMATION_COUNT = 6

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface RibbonsProps {
  /** Hex color strings for each ribbon. Defaults to a warm/neon palette. */
  colors?: string[]
  /** Animation duration in seconds — lower is faster. Default: 24 */
  speed?: number
  /** Gaussian blur radius in px. Controls how soft/smoky the ribbons look. Default: 60 */
  blur?: number
  /** Base opacity for each ribbon (0-1). Default: 0.55 */
  opacity?: number
  /** Mix blend mode: 'screen', 'normal', 'overlay', etc. Default: 'screen' */
  blendMode?: string
  /** Z-index of the container. Default: 0 */
  zIndex?: number
}

const props = withDefaults(defineProps<RibbonsProps>(), {
  colors: () => ['#ff9346', '#7cff67', '#ffee51', '#5227FF'],
  speed: 24,
  blur: 60,
  opacity: 0.55,
  blendMode: 'screen',
  zIndex: 0,
})

const slots = useSlots()

// ---------------------------------------------------------------------------
// Computed
// ---------------------------------------------------------------------------

const containerVars = computed(() => ({
  '--ribbon-z': props.zIndex,
  '--ribbon-blur': `${props.blur}px`,
  '--ribbon-opacity': props.opacity,
  '--ribbon-blend': props.blendMode,
  '--ribbon-speed': `${props.speed}s`,
}))

/**
 * Ensure we always have at least ANIMATION_COUNT ribbons so every animation
 * slot is filled.  Repeat the palette cyclically if fewer colors are given.
 */
const resolvedColors = computed<string[]>(() => {
  const given = props.colors.length > 0 ? [...props.colors] : ['#ff9346', '#7cff67', '#ffee51', '#5227FF']
  while (given.length < ANIMATION_COUNT) {
    given.push(given[given.length % given.length])
  }
  return given
})

// ---------------------------------------------------------------------------
// Per-ribbon variable helpers
// ---------------------------------------------------------------------------

function ribbonVars(index: number, color: string) {
  return {
    '--c': color,
    '--delay': `${index * 0.6}s`,
    // Distribute ribbons across the viewport so they don't all bunch up
    '--origin-x': `${(index * 17 + 5) % 100}%`,
    '--origin-y': `${(index * 23 + 10) % 100}%`,
    // Slightly vary ribbon sizes for organic feel
    '--size': `${360 + (index % 3) * 80}px`,
  }
}
</script>

<style scoped>
/* ============================================================
   Container
   ============================================================ */
.ribbons {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: var(--ribbon-z);
  background: transparent;
  isolation: isolate;
}

.ribbons__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

/* ============================================================
   Ribbon base
   ============================================================ */
.ribbons__ribbon {
  position: absolute;
  width: var(--size);
  height: var(--size);
  border-radius: 50%;
  background: radial-gradient(
    circle at 40% 40%,
    var(--c) 0%,
    color-mix(in srgb, var(--c) 40%, transparent) 50%,
    transparent 70%
  );
  filter: blur(var(--ribbon-blur));
  opacity: var(--ribbon-opacity);
  mix-blend-mode: var(--ribbon-blend);
  will-change: transform;
  transform: translate(
    calc(var(--origin-x) - 50%),
    calc(var(--origin-y) - 50%)
  );
  animation-delay: var(--delay);
  animation-fill-mode: both;
}

/* ============================================================
   Keyframe animations — each slot has a unique looping path
   to create an organic, ribbon-like flow across the viewport.
   ============================================================ */

/* --- 0: Wide horizontal sweep ------------------------------------ */
@keyframes ribbon-0 {
  0%   { transform: translate(-10vw, 20vh) scale(1);    }
  25%  { transform: translate(60vw,  5vh) scale(1.2);   }
  50%  { transform: translate(90vw,  40vh) scale(0.85);  }
  75%  { transform: translate(40vw,  70vh) scale(1.15);  }
  100% { transform: translate(-10vw, 20vh) scale(1);    }
}
.ribbons__ribbon--0 {
  animation: ribbon-0 var(--ribbon-speed) ease-in-out infinite;
}

/* --- 1: Vertical lazy loop -------------------------------------- */
@keyframes ribbon-1 {
  0%   { transform: translate(60vw, -10vh) scale(1);    }
  25%  { transform: translate(30vw,  40vh) scale(1.1);   }
  50%  { transform: translate(70vw,  80vh) scale(0.9);   }
  75%  { transform: translate(90vw,  40vh) scale(1.2);   }
  100% { transform: translate(60vw, -10vh) scale(1);    }
}
.ribbons__ribbon--1 {
  animation: ribbon-1 var(--ribbon-speed) ease-in-out infinite;
}

/* --- 2: Diagonal figure-8 --------------------------------------- */
@keyframes ribbon-2 {
  0%   { transform: translate(80vw, 80vh) scale(1);    }
  33%  { transform: translate(20vw, 20vh) scale(1.3);  }
  66%  { transform: translate(70vw, 10vh) scale(0.8);  }
  100% { transform: translate(80vw, 80vh) scale(1);    }
}
.ribbons__ribbon--2 {
  animation: ribbon-2 calc(var(--ribbon-speed) * 1.1) ease-in-out infinite;
}

/* --- 3: Wide undulating wave ------------------------------------ */
@keyframes ribbon-3 {
  0%   { transform: translate(-5vw,  50vh) scale(1);     }
  20%  { transform: translate(25vw,  10vh) scale(0.9);   }
  40%  { transform: translate(50vw,  60vh) scale(1.25);  }
  60%  { transform: translate(75vw,  20vh) scale(0.85);  }
  80%  { transform: translate(95vw,  70vh) scale(1.15);  }
  100% { transform: translate(-5vw,  50vh) scale(1);     }
}
.ribbons__ribbon--3 {
  animation: ribbon-3 var(--ribbon-speed) ease-in-out infinite;
}

/* --- 4: Central spiral-ish drift -------------------------------- */
@keyframes ribbon-4 {
  0%   { transform: translate(40vw,  30vh) scale(1);    }
  25%  { transform: translate(60vw,  50vh) scale(1.15); }
  50%  { transform: translate(30vw,  70vh) scale(0.85); }
  75%  { transform: translate(50vw,  20vh) scale(1.2);  }
  100% { transform: translate(40vw,  30vh) scale(1);    }
}
.ribbons__ribbon--4 {
  animation: ribbon-4 calc(var(--ribbon-speed) * 0.9) ease-in-out infinite;
}

/* --- 5: Edge-to-edge sweep -------------------------------------- */
@keyframes ribbon-5 {
  0%   { transform: translate(100vw, 60vh) scale(1);     }
  25%  { transform: translate(60vw,  90vh) scale(1.1);   }
  50%  { transform: translate(10vw,  50vh) scale(0.8);   }
  75%  { transform: translate(50vw,   5vh) scale(1.3);   }
  100% { transform: translate(100vw, 60vh) scale(1);     }
}
.ribbons__ribbon--5 {
  animation: ribbon-5 calc(var(--ribbon-speed) * 1.05) ease-in-out infinite;
}

/* ============================================================
   Overlay slot — sits on top of the ribbons
   ============================================================ */
.ribbons__overlay {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  pointer-events: auto;
}
</style>
