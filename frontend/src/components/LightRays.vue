<template>
  <div ref="containerRef" class="light-rays-container">
    <canvas ref="canvasRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

// ─── Types ──────────────────────────────────────────────────────────

type RaysOrigin =
  | 'top-center'
  | 'top-left'
  | 'top-right'
  | 'right'
  | 'left'
  | 'bottom-center'
  | 'bottom-right'
  | 'bottom-left';

interface Props {
  /** Where the rays emanate from. */
  raysOrigin?: RaysOrigin;
  /** Tint color applied to the rays (hex). */
  raysColor?: string;
  /** Speed multiplier for the animation. */
  raysSpeed?: number;
  /** Spread of the light cone (1 = normal, lower = narrower, higher = wider). */
  lightSpread?: number;
  /** Length of the rays relative to canvas width. */
  rayLength?: number;
  /** Whether the rays pulse in intensity. */
  pulsating?: boolean;
  /** Distance over which rays fade out (1 = normal). */
  fadeDistance?: number;
  /** Color saturation (0 = grayscale, 1 = full color). */
  saturation?: number;
  /** Whether mouse position influences ray direction. */
  followMouse?: boolean;
  /** How strongly the mouse affects ray direction (0-1). */
  mouseInfluence?: number;
  /** Amount of noise/grain applied (0-1). */
  noiseAmount?: number;
  /** Amount of angular distortion in the rays (0-1). */
  distortion?: number;
  /**
   * Internal render resolution scale.
   * Lower values improve performance at the cost of pixelation.
   * The offscreen result is bilinearly upscaled to the canvas size.
   */
  resolutionScale?: number;
}

const props = withDefaults(defineProps<Props>(), {
  raysOrigin: 'top-center',
  raysColor: '#ffffff',
  raysSpeed: 1,
  lightSpread: 1,
  rayLength: 2,
  pulsating: false,
  fadeDistance: 1.0,
  saturation: 1.0,
  followMouse: true,
  mouseInfluence: 0.1,
  noiseAmount: 0.0,
  distortion: 0.0,
  resolutionScale: 0.5,
});

// ─── Template refs ──────────────────────────────────────────────────

const containerRef = ref<HTMLDivElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);

// ─── Internal animation state (not reactive, for perf) ──────────────

let animFrameId: number | null = null;
let resizeObserver: ResizeObserver | null = null;
let intersectionObserver: IntersectionObserver | null = null;
let isVisible = false;

let offscreenCanvas: HTMLCanvasElement | null = null;
let offscreenCtx: CanvasRenderingContext2D | null = null;

const mouse = { x: 0.5, y: 0.5 };
const smoothMouse = { x: 0.5, y: 0.5 };

// ─── GLSL-style math utilities ──────────────────────────────────────

const fract = (v: number): number => v - Math.floor(v);

const mix = (a: number, b: number, t: number): number =>
  a * (1 - t) + b * t;

const clamp = (v: number, lo: number, hi: number): number =>
  Math.max(lo, Math.min(hi, v));

const normalize2 = (x: number, y: number): [number, number] => {
  const len = Math.sqrt(x * x + y * y);
  if (len < 1e-8) return [0, 0];
  return [x / len, y / len];
};

const hexToRgb = (hex: string): [number, number, number] => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m
    ? [
        parseInt(m[1], 16) / 255,
        parseInt(m[2], 16) / 255,
        parseInt(m[3], 16) / 255,
      ]
    : [1, 1, 1];
};

// Port of the GLSL noise function: fract(sin(dot(st, vec2(12.9898, 78.233))) * 43758.5453123)
const gnoise = (x: number, y: number): number =>
  fract(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453123);

// ─── Ray origin & direction ─────────────────────────────────────────

const getAnchorAndDir = (
  origin: RaysOrigin,
  w: number,
  h: number,
): { anchor: [number, number]; dir: [number, number] } => {
  const outside = 0.2;
  switch (origin) {
    case 'top-left':
      return { anchor: [0, -outside * h], dir: [0, 1] };
    case 'top-right':
      return { anchor: [w, -outside * h], dir: [0, 1] };
    case 'left':
      return { anchor: [-outside * w, 0.5 * h], dir: [1, 0] };
    case 'right':
      return { anchor: [(1 + outside) * w, 0.5 * h], dir: [-1, 0] };
    case 'bottom-left':
      return { anchor: [0, (1 + outside) * h], dir: [0, -1] };
    case 'bottom-center':
      return { anchor: [0.5 * w, (1 + outside) * h], dir: [0, -1] };
    case 'bottom-right':
      return { anchor: [w, (1 + outside) * h], dir: [0, -1] };
    default:
      // top-center
      return { anchor: [0.5 * w, -outside * h], dir: [0, 1] };
  }
};

// ─── Ray strength (direct port of the GLSL rayStrength function) ────

const rayStrength = (
  raySX: number,
  raySY: number,
  rayDX: number,
  rayDY: number,
  coordX: number,
  coordY: number,
  seedA: number,
  seedB: number,
  speed: number,
  iTime: number,
  iResX: number,
  lightSpread: number,
  rayLength: number,
  fadeDist: number,
  distortion: number,
  pulsating: number,
): number => {
  const scX = coordX - raySX;
  const scY = coordY - raySY;
  const len = Math.sqrt(scX * scX + scY * scY);

  // Avoid division by zero
  if (len < 1) return 0;

  const dirNX = scX / len;
  const dirNY = scY / len;
  const cosAngle = dirNX * rayDX + dirNY * rayDY;

  const distortedAngle =
    cosAngle + distortion * Math.sin(iTime * 2.0 + len * 0.01) * 0.2;

  const spreadFactor = Math.pow(
    Math.max(distortedAngle, 0.0),
    1.0 / Math.max(lightSpread, 0.001),
  );

  const maxDistance = iResX * rayLength;
  const lengthFalloff = clamp((maxDistance - len) / maxDistance, 0.0, 1.0);

  const fadeFalloff = clamp(
    (iResX * fadeDist - len) / (iResX * fadeDist),
    0.5,
    1.0,
  );

  const pulse =
    pulsating > 0.5
      ? 0.8 + 0.2 * Math.sin(iTime * speed * 3.0)
      : 1.0;

  const baseStrength = clamp(
    0.45 +
      0.15 * Math.sin(distortedAngle * seedA + iTime * speed) +
      0.3 +
      0.2 * Math.cos(-distortedAngle * seedB + iTime * speed),
    0.0,
    1.0,
  );

  return baseStrength * lengthFalloff * fadeFalloff * spreadFactor * pulse;
};

// ─── Render a single frame ──────────────────────────────────────────

const renderFrame = (iTime: number): void => {
  const container = containerRef.value;
  const canvas = canvasRef.value;
  if (!container || !canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Read all props once per frame (reactive proxy always returns current values)
  const {
    raysOrigin,
    raysColor,
    raysSpeed,
    lightSpread,
    rayLength,
    pulsating,
    fadeDistance,
    saturation,
    followMouse,
    mouseInfluence,
    noiseAmount,
    distortion,
    resolutionScale,
  } = props;

  const colorRgb = hexToRgb(raysColor);
  const dpr = Math.min(window.devicePixelRatio, 2);
  const cssW = container.clientWidth;
  const cssH = container.clientHeight;

  // Skip rendering if container has no size
  if (cssW === 0 || cssH === 0) return;

  const physW = Math.round(cssW * dpr);
  const physH = Math.round(cssH * dpr);

  // Resize main canvas if needed
  if (canvas.width !== physW || canvas.height !== physH) {
    canvas.width = physW;
    canvas.height = physH;

    // Recreate offscreen canvas at scaled resolution
    const rsW = Math.max(1, Math.ceil(physW * resolutionScale));
    const rsH = Math.max(1, Math.ceil(physH * resolutionScale));
    offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = rsW;
    offscreenCanvas.height = rsH;
    offscreenCtx = offscreenCanvas.getContext('2d');
  }

  if (!offscreenCanvas || !offscreenCtx) return;

  const rsW = offscreenCanvas.width;
  const rsH = offscreenCanvas.height;

  // Smooth mouse tracking
  if (followMouse && mouseInfluence > 0) {
    const smoothing = 0.92;
    smoothMouse.x =
      smoothMouse.x * smoothing + mouse.x * (1 - smoothing);
    smoothMouse.y =
      smoothMouse.y * smoothing + mouse.y * (1 - smoothing);
  }

  // Ray anchor and direction in physical pixel space (Y-down, top-left origin)
  const { anchor, dir } = getAnchorAndDir(raysOrigin, physW, physH);

  // ─── Pixel render via ImageData ──────────────────────────────────
  const imageData = offscreenCtx.createImageData(rsW, rsH);
  const pixels = imageData.data;
  const scaleX = physW / rsW;
  const scaleY = physH / rsH;

  for (let py = 0; py < rsH; py++) {
    for (let px = 0; px < rsW; px++) {
      // Map offscreen pixel to physical pixel center
      const physX = (px + 0.5) * scaleX;
      const physY = (py + 0.5) * scaleY;

      // Mouse-influenced ray direction
      let finalDirX = dir[0];
      let finalDirY = dir[1];
      if (mouseInfluence > 0) {
        const msX = smoothMouse.x * physW;
        const msY = smoothMouse.y * physH;
        const mDir = normalize2(msX - anchor[0], msY - anchor[1]);
        const blendedX = mix(dir[0], mDir[0], mouseInfluence);
        const blendedY = mix(dir[1], mDir[1], mouseInfluence);
        const norm = normalize2(blendedX, blendedY);
        finalDirX = norm[0];
        finalDirY = norm[1];
      }

      // Two overlapping ray layers (same seeds as the original shader)
      const pulsatingFlag = pulsating ? 1.0 : 0.0;

      const r1 = rayStrength(
        anchor[0], anchor[1], finalDirX, finalDirY,
        physX, physY,
        36.2214, 21.11349, 1.5 * raysSpeed,
        iTime, physW, lightSpread, rayLength,
        fadeDistance, distortion, pulsatingFlag,
      );

      const r2 = rayStrength(
        anchor[0], anchor[1], finalDirX, finalDirY,
        physX, physY,
        22.3991, 18.0234, 1.1 * raysSpeed,
        iTime, physW, lightSpread, rayLength,
        fadeDistance, distortion, pulsatingFlag,
      );

      // Combined base intensity (used for both color and alpha)
      const raw = r1 * 0.5 + r2 * 0.4;
      const alpha = clamp(raw, 0.0, 1.0);

      let r = raw;
      let g = raw;
      let b = raw;

      // Noise overlay
      if (noiseAmount > 0) {
        const n = gnoise(physX * 0.01 + iTime * 0.1, physY * 0.01 + iTime * 0.1);
        const noiseFactor = 1.0 - noiseAmount + noiseAmount * n;
        r *= noiseFactor;
        g *= noiseFactor;
        b *= noiseFactor;
      }

      // Vertical brightness gradient and chroma shift
      // (matches the GLSL: 1 - coord.y / iResolution.y)
      const brightness = 1.0 - physY / physH;
      r *= 0.1 + brightness * 0.8;
      g *= 0.3 + brightness * 0.6;
      b *= 0.5 + brightness * 0.5;

      // Saturation
      if (saturation !== 1.0) {
        const gray = r * 0.299 + g * 0.587 + b * 0.114;
        r = mix(gray, r, saturation);
        g = mix(gray, g, saturation);
        b = mix(gray, b, saturation);
      }

      // Color tint
      r *= colorRgb[0];
      g *= colorRgb[1];
      b *= colorRgb[2];

      const idx = (py * rsW + px) * 4;
      pixels[idx] = Math.round(clamp(r, 0, 1) * 255);
      pixels[idx + 1] = Math.round(clamp(g, 0, 1) * 255);
      pixels[idx + 2] = Math.round(clamp(b, 0, 1) * 255);
      pixels[idx + 3] = Math.round(alpha * 255);
    }
  }

  offscreenCtx.putImageData(imageData, 0, 0);

  // Upscale offscreen render to the main canvas with bilinear filtering
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.clearRect(0, 0, physW, physH);
  ctx.drawImage(offscreenCanvas, 0, 0, physW, physH);
};

// ─── Animation loop (requestAnimationFrame) ─────────────────────────

const loop = (time: number): void => {
  if (isVisible) {
    renderFrame(time * 0.001);
  }
  animFrameId = requestAnimationFrame(loop);
};

// ─── Mouse move handler ─────────────────────────────────────────────

const onMouseMove = (e: MouseEvent): void => {
  const container = containerRef.value;
  if (!container) return;
  const rect = container.getBoundingClientRect();
  mouse.x = (e.clientX - rect.left) / rect.width;
  mouse.y = (e.clientY - rect.top) / rect.height;
};

// ─── Lifecycle ──────────────────────────────────────────────────────

onMounted(() => {
  const container = containerRef.value;
  if (!container) return;

  // Visibility tracking — avoid rendering when scrolled out of view
  intersectionObserver = new IntersectionObserver(
    ([entry]) => {
      isVisible = entry.isIntersecting;
    },
    { threshold: 0.1 },
  );
  intersectionObserver.observe(container);

  // Size tracking — render reads clientWidth/clientHeight reactively
  resizeObserver = new ResizeObserver(() => {
    /* handled in renderFrame */
  });
  resizeObserver.observe(container);

  // Mouse tracking (always track, only apply when followMouse is true)
  window.addEventListener('mousemove', onMouseMove);

  // Start the render loop
  animFrameId = requestAnimationFrame(loop);
});

onBeforeUnmount(() => {
  if (animFrameId !== null) {
    cancelAnimationFrame(animFrameId);
    animFrameId = null;
  }
  if (intersectionObserver) {
    intersectionObserver.disconnect();
    intersectionObserver = null;
  }
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
  window.removeEventListener('mousemove', onMouseMove);
});
</script>

<style scoped>
.light-rays-container {
  width: 100%;
  height: 100%;
  position: relative;
  pointer-events: none;
  z-index: 3;
  overflow: hidden;
}

.light-rays-container canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
