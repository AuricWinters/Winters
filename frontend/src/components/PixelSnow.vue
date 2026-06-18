<template>
  <!-- PixelSnow: pure-CSS pixel-art snow effect background -->
  <div
    class="pixel-snow-root"
  >
    <!-- Multi-depth layers for parallax -->
    <div
      v-for="layer in layers"
      :key="layer.name"
      class="pixel-snow-layer"
      :style="layer.style"
    >
      <div
        v-for="flake in layer.flakes"
        :key="flake.id"
        class="pixel-flake"
        :class="flake.variantClass"
        :style="flake.style"
      />
    </div>

    <!-- Slot for overlaid content (hero text, cards, etc.) -->
    <div v-if="$slots.default" class="pixel-snow-slot">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */
interface PixelSnowProps {
  /** Flake color (any CSS color value) */
  color?: string
  /** Base flake size in CSS px. Default 4 */
  flakeSize?: number
  /** Minimum flake size in CSS px. Default 2 */
  minFlakeSize?: number
  /** Grid-snap resolution (px). Higher = chunkier pixels. Default 16 */
  pixelResolution?: number
  /** Global speed multiplier. Default 1 */
  speed?: number
  /**
   * Depth fade ratio (0-1).
   * 0 = flakes stay fully visible for their whole fall,
   * 1 = flakes fade linearly from birth to death. Default 0.6
   */
  depthFade?: number
  /** Distance (in vh) a flake travels before respawning. Default 110 */
  farPlane?: number
  /** Overall brightness/opacity multiplier (0-1). Default 1 */
  brightness?: number
  /**
   * Density (0-1).
   * Roughly maps to probability of a flake occupying a cell.
   * Default 0.3
   */
  density?: number
  /**
   * Shape variant.
   * 'square'    — solid pixel square (default)
   * 'round'     — filled circle
   * 'snowflake' — four-point star via clip-path
   */
  variant?: 'square' | 'round' | 'snowflake'
  /**
   * Wind direction in degrees.
   * 0   = right
   * 90  = down
   * 180 = left
   * 270 = up
   * Default 185 (slightly left of straight-down)
   */
  direction?: number
}

const props = withDefaults(defineProps<PixelSnowProps>(), {
  color: '#ffffff',
  flakeSize: 4,
  minFlakeSize: 2,
  pixelResolution: 16,
  speed: 1,
  depthFade: 0.6,
  farPlane: 110,
  brightness: 1,
  density: 0.3,
  variant: 'square',
  direction: 185,
})

/* ------------------------------------------------------------------ */
/*  Slots                                                              */
/* ------------------------------------------------------------------ */
defineSlots<{
  default?: () => void
}>()

/* ------------------------------------------------------------------ */
/*  Derived constants                                                  */
/* ------------------------------------------------------------------ */

/** Grid cell size — every flake start-x snaps to multiples of this. */
const pixelSize = computed(() => Math.max(2, props.pixelResolution))

/** Unit vector derived from direction (in degrees). */
const windVector = computed(() => {
  const rad = (props.direction * Math.PI) / 180
  return { x: Math.cos(rad), y: Math.sin(rad) }
})

/* ------------------------------------------------------------------ */
/*  Layer & flake generation                                           */
/* ------------------------------------------------------------------ */

interface Flake {
  id: string
  /** Inline style object with CSS custom properties and positioning */
  style: Record<string, string | number>
  variantClass: string
}

interface Layer {
  name: string
  style: Record<string, string | number>
  flakes: Flake[]
}

const layers = computed<Layer[]>(() => {
  /* ---- layer configs: depth parallax ---- */
  const layerCfgs = [
    { name: 'far',  flakeScale: 0.5, speedScale: 0.4, zIndex: 0, weight: 0.5 },
    { name: 'mid',  flakeScale: 1.0, speedScale: 1.0, zIndex: 1, weight: 1.0 },
    { name: 'near', flakeScale: 1.8, speedScale: 2.2, zIndex: 2, weight: 0.3 },
  ]

  /* Map density (0-1) to a per-layer flake count.
     At density=0.3 we get ~15/30/9 flakes — enough for a full screen. */
  const totalTarget = Math.max(5, Math.round(props.density * 100))
  const { x: windX, y: windY } = windVector.value
  const grid = pixelSize.value

  return layerCfgs.map((cfg) => {
    const count = Math.round(totalTarget * cfg.weight)
    const flakes: Flake[] = []

    for (let i = 0; i < count; i++) {
      const size = Math.max(
        props.minFlakeSize,
        props.flakeSize * cfg.flakeScale * (0.55 + Math.random() * 0.9),
      )

      /* Snap horizontal start to the pixel grid */
      const x = Math.round(Math.random() * 100 / grid) * grid

      const duration = (7 + Math.random() * 10) / (props.speed * cfg.speedScale)
      const delay = -Math.random() * duration * 2 // staggered starts

      /* Brightness applied per-flake base opacity */
      const startOpacity = (0.25 + Math.random() * 0.75) * props.brightness

      /* Wind drift — each flake gets a slight random variance */
      const variance = 0.5 + Math.random()
      const driftX = windX * 50 * cfg.flakeScale * variance
      const driftY = windY * 50 * cfg.flakeScale * variance

      /* CSS class for the variant shape */
      let variantClass = 'flake-square'
      if (props.variant === 'round') variantClass = 'flake-round'
      else if (props.variant === 'snowflake') variantClass = 'flake-snowflake'

      const id = `px-${cfg.name}-${i}`

      flakes.push({
        id,
        variantClass,
        style: {
          left: `${x}%`,
          width: `${size}px`,
          height: `${size}px`,
          '--flake-duration': `${duration}s`,
          '--flake-delay': `${delay}s`,
          '--flake-start-opacity': startOpacity,
          '--flake-drift-x': `${driftX}px`,
          '--flake-drift-y': `${driftY}px`,
          '--flake-far-plane': props.farPlane,
          '--flake-depth-fade': props.depthFade,
        },
      })
    }

    return {
      name: cfg.name,
      style: {
        '--flake-scale': cfg.flakeScale,
        '--speed-scale': cfg.speedScale,
        '--layer-z': cfg.zIndex,
      },
      flakes,
    }
  })
})

/* All state is derived via `computed` — no imperative lifecycle required.
   The component re-generates on mount via reactive prop changes. */
</script>

<style scoped>
/* ================================================================== */
/*  CONTAINER                                                          */
/* ================================================================== */
.pixel-snow-root {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  contain: layout style paint;
}

/* ================================================================== */
/*  LAYER                                                              */
/* ================================================================== */
.pixel-snow-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: var(--layer-z, 1);
  will-change: transform;
}

/* ================================================================== */
/*  FLAKE — base styles, shared across variants                        */
/* ================================================================== */
.pixel-flake {
  position: absolute;
  top: 0;
  /* The left is set via inline style; animation moves it downward + drifts */
  background-color: v-bind('props.color');

  /*
   * "Pixel" aesthetic:
   * - image-rendering gives a crisp pixel look (belt-and-suspenders)
   * - shape-rendering for any future SVG usage
   */
  image-rendering: pixelated;
  image-rendering: crisp-edges;
  shape-rendering: crispEdges;

  /*
   * Single keyframe drives the entire fall.
   * duration / delay / drift are injected via inline custom props.
   */
  animation:
    flake-fall
    var(--flake-duration, 10s)
    linear
    var(--flake-delay, 0s)
    infinite;

  /* Compositor-friendly */
  transform: translateZ(0);
  will-change: transform, opacity;
}

/* ---------- fall keyframe ---------- */
@keyframes flake-fall {
  0% {
    transform:
      translateY(0)
      translateX(0);
    opacity: var(--flake-start-opacity, 1);
  }
  100% {
    transform:
      translateY(calc(1vh * var(--flake-far-plane, 110)))
      translateX(var(--flake-drift-x, 0px));
    opacity: calc(
      var(--flake-start-opacity, 1) *
      (1 - var(--flake-depth-fade, 0.6))
    );
  }
}

/* ================================================================== */
/*  VARIANT: square  — solid pixel                                    */
/* ================================================================== */
.flake-square {
  border-radius: 0;
}

/* ================================================================== */
/*  VARIANT: round   — pixel circle                                    */
/* ================================================================== */
.flake-round {
  border-radius: 50%;
}

/* ================================================================== */
/*  VARIANT: snowflake  — four-point star (plus-sign shape)           */
/* ================================================================== */
.flake-snowflake {
  /*
   * Build a plus-shaped snowflake using clip-path:
   * A vertical bar + horizontal bar meeting in the center.
   */
  clip-path: polygon(
    35% 0%,   65% 0%,   65% 35%,  100% 35%,
    100% 65%, 65% 65%,  65% 100%, 35% 100%,
    35% 65%,  0%  65%,  0%  35%,  35% 35%
  );
}

/* ================================================================== */
/*  FLAKE INLINE STYLES (bridged via CSS custom properties)            */
/* ================================================================== */

/*
 * Each <div class="pixel-flake"> has inline style like:
 *   left: 24%; width: 6px; height: 6px;
 *   --flake-duration: 12.5s; --flake-delay: -3.2s;
 *   --flake-start-opacity: 0.8;
 *   --flake-drift-x: 30px; --flake-drift-y: 20px;
 *   --flake-far-plane: 110;
 *   --flake-depth-fade: 0.6;
 *
 * These are all set in the template inline styles.
 */

/* ================================================================== */
/*  OVERLAY SLOT                                                       */
/* ================================================================== */
.pixel-snow-slot {
  position: relative;
  z-index: 10;
  width: 100%;
  height: 100%;
  pointer-events: auto;
}
</style>
