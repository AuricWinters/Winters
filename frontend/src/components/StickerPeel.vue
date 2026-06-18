<template>
  <div
    class="sticker-peel"
    :style="cssVars"
    :class="{ 'sticker-peel--touch-active': isTouchActive }"
  >
    <!--
      SVG filter definitions for 3D specular lighting and drop shadow.
      Each instance gets a unique ID prefix to prevent collisions when
      multiple StickerPeel components appear on the same page.
    -->
    <svg width="0" height="0" aria-hidden="true">
      <defs>
        <filter :id="`${uid}-pointLight`">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feSpecularLighting
            result="spec"
            in="blur"
            specularExponent="100"
            :specularConstant="lightingIntensity"
            lighting-color="white"
          >
            <fePointLight x="100" y="100" z="300" />
          </feSpecularLighting>
          <feComposite in="spec" in2="SourceGraphic" result="lit" />
          <feComposite in="lit" in2="SourceAlpha" operator="in" />
        </filter>

        <filter :id="`${uid}-pointLightFlipped`">
          <feGaussianBlur stdDeviation="10" result="blur" />
          <feSpecularLighting
            result="spec"
            in="blur"
            specularExponent="100"
            :specularConstant="lightingIntensity * 7"
            lighting-color="white"
          >
            <fePointLight x="100" y="100" z="300" />
          </feSpecularLighting>
          <feComposite in="spec" in2="SourceGraphic" result="lit" />
          <feComposite in="lit" in2="SourceAlpha" operator="in" />
        </filter>

        <filter :id="`${uid}-dropShadow`">
          <feDropShadow
            dx="2"
            dy="4"
            :stdDeviation="3 * shadowIntensity"
            flood-color="black"
            :flood-opacity="shadowIntensity"
          />
        </filter>

        <filter :id="`${uid}-expandAndFill`">
          <feOffset dx="0" dy="0" in="SourceAlpha" result="shape" />
          <feFlood flood-color="rgb(179,179,179)" result="flood" />
          <feComposite operator="in" in="flood" in2="shape" />
        </filter>
      </defs>
    </svg>

    <div
      class="sticker-container"
      @touchstart="onTouchStart"
      @touchend="onTouchEnd"
      @touchcancel="onTouchEnd"
    >
      <!-- Main sticker face -->
      <div class="sticker-main">
        <div class="sticker-lighting">
          <img
            v-if="imageSrc"
            :src="imageSrc"
            alt=""
            class="sticker-image"
            draggable="false"
            @contextmenu.prevent
          />
          <slot v-else />
        </div>
      </div>

      <!-- Peeled-back flap (vertically mirrored portion) -->
      <div class="flap">
        <div class="flap-lighting">
          <img
            v-if="imageSrc"
            :src="imageSrc"
            alt=""
            class="flap-image"
            draggable="false"
            @contextmenu.prevent
          />
          <slot v-else />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface StickerPeelProps {
  /** Image URL for the sticker graphic. Falls back to <slot> when omitted. */
  imageSrc?: string
  /** Rotation angle of the sticker artwork in degrees (default: 30) */
  rotate?: number
  /** Percentage of the sticker height that peels back on hover (default: 30) */
  peelBackHoverPct?: number
  /** Percentage that peels back on active/press (default: 40) */
  peelBackActivePct?: number
  /** Sticker width in pixels (default: 200) */
  width?: number
  /** Drop shadow opacity, 0-1 (default: 0.6) */
  shadowIntensity?: number
  /** Specular highlight strength, 0-1 (default: 0.1) */
  lightingIntensity?: number
  /** Rotates the entire sticker container by this many degrees (default: 0) */
  peelDirection?: number
}

const props = withDefaults(defineProps<StickerPeelProps>(), {
  imageSrc: '',
  rotate: 30,
  peelBackHoverPct: 30,
  peelBackActivePct: 40,
  width: 200,
  shadowIntensity: 0.6,
  lightingIntensity: 0.1,
  peelDirection: 0,
})

const PADDING = 10

/**
 * Unique instance id — every StickerPeel on the page gets its own SVG
 * filter IDs so the CSS filter references never collide.
 */
const uid = `sp-${Math.random().toString(36).slice(2, 9)}`

/** Tracks touch state so we can replicate :hover on touch devices. */
const isTouchActive = ref(false)

function onTouchStart(): void {
  isTouchActive.value = true
}

function onTouchEnd(): void {
  isTouchActive.value = false
}

const cssVars = computed<Record<string, string>>(() => ({
  '--sticker-rotate': `${props.rotate}deg`,
  '--sticker-p': `${PADDING}px`,
  '--sticker-peelback-hover': `${props.peelBackHoverPct}%`,
  '--sticker-peelback-active': `${props.peelBackActivePct}%`,
  '--sticker-width': `${props.width}px`,
  '--sticker-shadow-opacity': String(props.shadowIntensity),
  '--sticker-lighting-constant': String(props.lightingIntensity),
  '--peel-direction': `${props.peelDirection}deg`,
  '--filter-drop-shadow': `url(#${uid}-dropShadow)`,
  '--filter-point-light': `url(#${uid}-pointLight)`,
  '--filter-point-light-flipped': `url(#${uid}-pointLightFlipped)`,
  '--filter-expand-fill': `url(#${uid}-expandAndFill)`,
}))
</script>

<style scoped>
/* ---- Root ---- */

.sticker-peel {
  position: relative;
  display: inline-block;
  -webkit-user-select: none;
  user-select: none;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
}

/* ---- Container ---- */

.sticker-container {
  position: relative;
  transform: rotate(var(--peel-direction, 0deg));
  transform-origin: center;
}

/* ---- Main sticker face ---- */

.sticker-main {
  clip-path: polygon(
    calc(-1 * var(--sticker-p)) calc(-1 * var(--sticker-p)),
    calc(100% + var(--sticker-p)) calc(-1 * var(--sticker-p)),
    calc(100% + var(--sticker-p)) calc(100% + var(--sticker-p)),
    calc(-1 * var(--sticker-p)) calc(100% + var(--sticker-p))
  );
  transition: clip-path 0.6s ease-out;
  filter: var(--filter-drop-shadow);
}

.sticker-main > * {
  transform: rotate(calc(-1 * var(--peel-direction, 0deg)));
}

/* Hover / touch peel-back on the main face */
.sticker-container:hover .sticker-main,
.sticker-peel--touch-active .sticker-main {
  clip-path: polygon(
    calc(-1 * var(--sticker-p)) var(--sticker-peelback-hover),
    calc(100% + var(--sticker-p)) var(--sticker-peelback-hover),
    calc(100% + var(--sticker-p)) calc(100% + var(--sticker-p)),
    calc(-1 * var(--sticker-p)) calc(100% + var(--sticker-p))
  );
}

.sticker-container:active .sticker-main {
  clip-path: polygon(
    calc(-1 * var(--sticker-p)) var(--sticker-peelback-active),
    calc(100% + var(--sticker-p)) var(--sticker-peelback-active),
    calc(100% + var(--sticker-p)) calc(100% + var(--sticker-p)),
    calc(-1 * var(--sticker-p)) calc(100% + var(--sticker-p))
  );
}

.sticker-lighting {
  filter: var(--filter-point-light);
}

.sticker-image {
  transform: rotate(var(--sticker-rotate, 30deg));
}

/* ---- Peeled flap ---- */

.flap {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: calc(-100% - var(--sticker-p) - var(--sticker-p));
  clip-path: polygon(
    calc(-1 * var(--sticker-p)) calc(-1 * var(--sticker-p)),
    calc(100% + var(--sticker-p)) calc(-1 * var(--sticker-p)),
    calc(100% + var(--sticker-p)) calc(-1 * var(--sticker-p)),
    calc(-1 * var(--sticker-p)) calc(-1 * var(--sticker-p))
  );
  transform: scaleY(-1);
  transition: all 0.6s ease-out;
}

.flap > * {
  transform: rotate(calc(-1 * var(--peel-direction, 0deg)));
}

/* Hover / touch reveal for the flap */
.sticker-container:hover .flap,
.sticker-peel--touch-active .flap {
  clip-path: polygon(
    calc(-1 * var(--sticker-p)) calc(-1 * var(--sticker-p)),
    calc(100% + var(--sticker-p)) calc(-1 * var(--sticker-p)),
    calc(100% + var(--sticker-p)) var(--sticker-peelback-hover),
    calc(-1 * var(--sticker-p)) var(--sticker-peelback-hover)
  );
  top: calc(-100% + 2 * var(--sticker-peelback-hover) - 1px);
}

.sticker-container:active .flap {
  clip-path: polygon(
    calc(-1 * var(--sticker-p)) calc(-1 * var(--sticker-p)),
    calc(100% + var(--sticker-p)) calc(-1 * var(--sticker-p)),
    calc(100% + var(--sticker-p)) var(--sticker-peelback-active),
    calc(-1 * var(--sticker-p)) var(--sticker-peelback-active)
  );
  top: calc(-100% + 2 * var(--sticker-peelback-active) - 1px);
}

.flap-lighting {
  filter: var(--filter-point-light-flipped);
}

.flap-image {
  transform: rotate(var(--sticker-rotate, 30deg));
  filter: var(--filter-expand-fill);
}

/* ---- Sizing ---- */

.sticker-image,
.flap-image {
  width: var(--sticker-width, 200px);
  display: block;
}

.sticker-main,
.flap {
  will-change: clip-path, transform;
}

/* ---- Touch-device overrides ---- */

@media (hover: none) and (pointer: coarse) {
  .sticker-container {
    touch-action: none;
  }
}
</style>
