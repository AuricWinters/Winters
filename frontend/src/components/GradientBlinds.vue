<template>
  <div
    ref="containerRef"
    class="gradient-blinds"
    :style="rootStyles"
    @pointermove="onPointerMove"
    @pointerleave="onPointerLeave"
  >
    <!-- Layer 1: base multi-color gradient -->
    <div class="gb-layer gb-gradient" :style="gradientStyles" />

    <!-- Layer 2: blind stripe brightness ramp -->
    <div
      class="gb-layer gb-blinds"
      :style="blindsStyles"
    />

    <!-- Layer 3: mouse-driven spotlight -->
    <div class="gb-layer gb-spotlight" :style="spotlightStyles" />

    <!-- Layer 4: animated noise texture -->
    <div class="gb-layer gb-noise" :style="noiseStyles" />

    <!-- Foreground content slot -->
    <div v-if="hasContent" class="gb-content">
      <slot>
        <span v-if="text" class="gb-text">{{ text }}</span>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, useSlots } from 'vue';

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface GradientBlindsProps {
  /** Shortcut text shown inside the slot region (fallback when no slot) */
  text?: string;
  /** Gradient color stops (max 8 used) */
  gradientColors?: string[];
  /** Global rotation angle in degrees (rotates gradient + blinds) */
  angle?: number;
  /** Number of vertical blind stripes */
  blindCount?: number;
  /** Darkness of each blind's shadow edge (0-1) */
  blindDepth?: number;
  /** Spotlight radius as a fraction of the container's smaller dimension */
  spotlightRadius?: number;
  /**
   * Spotlight falloff softness.
   * 1 = linear-ish, >1 = tighter falloff, <1 = wider glow */
  spotlightSoftness?: number;
  /** Spotlight peak opacity (0-1) */
  spotlightOpacity?: number;
  /** Noise opacity multiplier (0 = no noise) */
  noise?: number;
  /** Base animation speed multiplier */
  speed?: number;
  /** Mirror the gradient from the horizontal centre outwards */
  mirrorGradient?: boolean;
  /** Within each blind, which edge appears brighter */
  shineDirection?: 'left' | 'right';
  /** Mouse-follow dampening in ms (lower = snappier) */
  mouseDampening?: number;
  /** CSS mix-blend-mode on the root element */
  mixBlendMode?: string;
}

const props = withDefaults(defineProps<GradientBlindsProps>(), {
  gradientColors: () => ['#FF9FFC', '#5227FF'],
  angle: 0,
  blindCount: 16,
  blindDepth: 0.5,
  spotlightRadius: 0.5,
  spotlightSoftness: 1,
  spotlightOpacity: 1,
  noise: 0.06,
  speed: 1,
  mirrorGradient: false,
  shineDirection: 'left',
  mouseDampening: 150,
});

const slots = useSlots();
const hasContent = computed(() => !!slots.default || !!props.text);

/* ------------------------------------------------------------------ */
/*  DOM refs & reactive state                                          */
/* ------------------------------------------------------------------ */

const containerRef = ref<HTMLDivElement | null>(null);

/* ---- spotlight position (smoothed via rAF) ----------------------- */
const sx = ref(0.5); /* 0-1 fraction of container width  */
const sy = ref(0.5); /* 0-1 fraction of container height */
const tx = ref(0.5); /* target x (pointer position)      */
const ty = ref(0.5); /* target y (pointer position)      */

let rafId: number | null = null;
let lastTime = 0;

/* ---- container dimensions for spotlight radius calc ------------- */
const cw = ref(1);
const ch = ref(1);

/* ---- noise animation timer -------------------------------------- */
const noisePhase = ref(0);
let noiseRafId: number | null = null;

/* ------------------------------------------------------------------ */
/*  Derived styles                                                     */
/* ------------------------------------------------------------------ */

/** Angle string for CSS gradients */
const gradAngle = computed(() => `${props.angle}deg`);

/**
 * Build the gradient colour-stop string.
 * Supports up to 8 colours and optional mirror mode.
 */
const buildGradientStops = (): string => {
  let colors = props.gradientColors.slice(0, 8);
  if (colors.length === 0) colors = ['#FF9FFC', '#5227FF'];
  if (colors.length === 1) colors.push(colors[0]);

  let stops = colors;
  if (props.mirrorGradient) {
    // Mirror: A,B,C -> A,B,C,B,A
    const reversed = [...colors].reverse().slice(1);
    stops = [...colors, ...reversed];
  }

  return stops
    .map((c, i) => `${c} ${(i / (stops.length - 1)) * 100}%`)
    .join(', ');
};

const gradientStyles = computed(() => ({
  backgroundImage: `linear-gradient(${gradAngle.value}, ${buildGradientStops()})`,
}));

/**
 * Repeating-linear-gradient for the blind brightness ramp.
 * Each blind repeats every `100/blindCount` percent of the container,
 * going from transparent (bright edge) to semi-transparent black (shadow edge).
 */
const blindsStyles = computed(() => {
  const bc = Math.max(1, props.blindCount);
  const repeatPct = 100 / bc;
  const depth = Math.min(1, Math.max(0, props.blindDepth));

  const fromTransparent = `repeating-linear-gradient(
    ${gradAngle.value},
    transparent 0%,
    rgba(0,0,0,${depth}) ${repeatPct}%
  )`;
  const fromDark = `repeating-linear-gradient(
    ${gradAngle.value},
    rgba(0,0,0,${depth}) 0%,
    transparent ${repeatPct}%
  )`;

  return {
    backgroundImage:
      props.shineDirection === 'right' ? fromDark : fromTransparent,
  };
});

/** Spotlight: radial gradient centred on the mouse pointer. */
const spotlightStyles = computed(() => {
  const dim = Math.min(cw.value || 1, ch.value || 1);
  const radius = Math.max(props.spotlightRadius * dim, 1);
  // Softness maps roughly to an intermediate stop
  const inner = Math.max(radius * (1 - props.spotlightSoftness * 0.4), 0);

  return {
    backgroundImage: `radial-gradient(
      circle at ${sx.value * 100}% ${sy.value * 100}%,
      rgba(255,255,255,${props.spotlightOpacity}) 0%,
      rgba(255,255,255,${props.spotlightOpacity * 0.15}) ${inner}px,
      rgba(255,255,255,0) ${radius}px
    )`,
  };
});

/** Noise: semi-transparent SVG turbulence pattern, animated. */
const noiseStyles = computed(() => {
  const op = Math.min(1, Math.max(0, props.noise));
  // Shift background-position over time to create animation
  const shift = (noisePhase.value * props.speed * 0.5) % 200;
  return {
    opacity: op,
    backgroundPosition: `${shift}px ${shift * 0.7}px`,
  };
});

const rootStyles = computed(() => ({
  ...(props.mixBlendMode ? { mixBlendMode: props.mixBlendMode } : {}),
} as any));

/* ------------------------------------------------------------------ */
/*  Spotlight animation loop (rAF with exponential smoothing)          */
/* ------------------------------------------------------------------ */

function tickSpotlight(time: number) {
  rafId = requestAnimationFrame(tickSpotlight);

  const damp = Math.max(1, props.mouseDampening); // ms
  const dt = lastTime ? time - lastTime : 16;
  lastTime = time;

  // Exponential smoothing (same approach as the original shader wrapper)
  const tau = damp;
  const factor = 1 - Math.exp(-dt / tau);
  sx.value += (tx.value - sx.value) * factor;
  sy.value += (ty.value - sy.value) * factor;
}

/* ------------------------------------------------------------------ */
/*  Noise animation (separate rAF loop so it runs even when idle)      */
/* ------------------------------------------------------------------ */

function tickNoise(time: number) {
  noiseRafId = requestAnimationFrame(tickNoise);
  noisePhase.value = time * 0.001; // seconds
}

/* ------------------------------------------------------------------ */
/*  Pointer handlers                                                   */
/* ------------------------------------------------------------------ */

function onPointerMove(e: PointerEvent) {
  const el = containerRef.value;
  if (!el) return;
  const rect = el.getBoundingClientRect();
  tx.value = (e.clientX - rect.left) / rect.width;
  ty.value = (e.clientY - rect.top) / rect.height;
  cw.value = rect.width;
  ch.value = rect.height;
}

function onPointerLeave() {
  // Slowly drift back to centre
  tx.value = 0.5;
  ty.value = 0.5;
}

/* ------------------------------------------------------------------ */
/*  Lifecycle                                                          */
/* ------------------------------------------------------------------ */

function updateContainerSize() {
  const el = containerRef.value;
  if (!el) return;
  const rect = el.getBoundingClientRect();
  cw.value = rect.width;
  ch.value = rect.height;
}

let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  updateContainerSize();
  resizeObserver = new ResizeObserver(updateContainerSize);
  if (containerRef.value) resizeObserver.observe(containerRef.value);

  rafId = requestAnimationFrame(tickSpotlight);
  noiseRafId = requestAnimationFrame(tickNoise);
});

onUnmounted(() => {
  if (rafId !== null) cancelAnimationFrame(rafId);
  if (noiseRafId !== null) cancelAnimationFrame(noiseRafId);
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
});
</script>

<style scoped>
/* ================================================================== */
/*  Root container – fills parent, clips children                     */
/* ================================================================== */
.gradient-blinds {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  isolation: isolate;
}

/* ================================================================== */
/*  Shared layer rules                                                */
/* ================================================================== */
.gb-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

/* ================================================================== */
/*  Layer 1 – base gradient                                           */
/* ================================================================== */
.gb-gradient {
  z-index: 1;
}

/* ================================================================== */
/*  Layer 2 – blind stripe shading                                    */
/* ================================================================== */
.gb-blinds {
  z-index: 2;
}

/* ================================================================== */
/*  Layer 3 – mouse spotlight                                         */
/* ================================================================== */
.gb-spotlight {
  z-index: 3;
  /* mix-blend-mode: soft-light gives a natural highlight feel */
  mix-blend-mode: soft-light;
}

/* ================================================================== */
/*  Layer 4 – animated noise (SVG turbulence background)              */
/* ================================================================== */
.gb-noise {
  z-index: 4;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 200px 200px;
  mix-blend-mode: overlay;
  will-change: background-position;
}

/* ================================================================== */
/*  Foreground content                                                */
/* ================================================================== */
.gb-content {
  position: relative;
  z-index: 5;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
}

.gb-text {
  color: #fff;
  font-size: clamp(1.25rem, 5vw, 3rem);
  font-weight: 700;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.5);
  user-select: none;
}
</style>
