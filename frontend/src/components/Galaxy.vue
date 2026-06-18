<template>
  <div ref="containerRef" class="galaxy-container" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

const props = withDefaults(defineProps<{
  focal?: [number, number]
  rotation?: [number, number]
  starSpeed?: number
  density?: number
  hueShift?: number
  disableAnimation?: boolean
  speed?: number
  mouseInteraction?: boolean
  glowIntensity?: number
  saturation?: number
  mouseRepulsion?: boolean
  twinkleIntensity?: number
  rotationSpeed?: number
  repulsionStrength?: number
  autoCenterRepulsion?: number
  transparent?: boolean
}>(), {
  focal: () => [0.5, 0.5],
  rotation: () => [1.0, 0.0],
  starSpeed: 0.5,
  density: 1,
  hueShift: 140,
  disableAnimation: false,
  speed: 1.0,
  mouseInteraction: true,
  glowIntensity: 0.3,
  saturation: 0.0,
  mouseRepulsion: true,
  twinkleIntensity: 0.3,
  rotationSpeed: 0.1,
  autoCenterRepulsion: 0,
  transparent: true
})

const containerRef = ref<HTMLDivElement>()

const vertexShader = `
attribute vec2 uv;
attribute vec2 position;

varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}
`

const fragmentShader = `
precision highp float;

uniform float uTime;
uniform vec3 uResolution;
uniform vec2 uFocal;
uniform vec2 uRotation;
uniform float uStarSpeed;
uniform float uDensity;
uniform float uHueShift;
uniform float uSpeed;
uniform vec2 uMouse;
uniform float uGlowIntensity;
uniform float uSaturation;
uniform bool uMouseRepulsion;
uniform float uTwinkleIntensity;
uniform float uRotationSpeed;
uniform float uRepulsionStrength;
uniform float uMouseActiveFactor;
uniform float uAutoCenterRepulsion;
uniform bool uTransparent;

varying vec2 vUv;

#define NUM_LAYER 4.0
#define STAR_COLOR_CUTOFF 0.2
#define MAT45 mat2(0.7071, -0.7071, 0.7071, 0.7071)
#define PERIOD 3.0

float Hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float tri(float x) {
  return abs(fract(x) * 2.0 - 1.0);
}

float tris(float x) {
  float t = fract(x);
  return 1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0));
}

float trisn(float x) {
  float t = fract(x);
  return 2.0 * (1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0))) - 1.0;
}

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float Star(vec2 uv, float flare) {
  float d = length(uv);
  float m = (0.05 * uGlowIntensity) / d;
  float rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
  m += rays * flare * uGlowIntensity;
  uv *= MAT45;
  rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
  m += rays * 0.3 * flare * uGlowIntensity;
  m *= smoothstep(1.0, 0.2, d);
  return m;
}

vec3 StarLayer(vec2 uv) {
  vec3 col = vec3(0.0);

  vec2 gv = fract(uv) - 0.5;
  vec2 id = floor(uv);

  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 offset = vec2(float(x), float(y));
      vec2 si = id + vec2(float(x), float(y));
      float seed = Hash21(si);
      float size = fract(seed * 345.32);
      float glossLocal = tri(uStarSpeed / (PERIOD * seed + 1.0));
      float flareSize = smoothstep(0.9, 1.0, size) * glossLocal;

      float red = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 1.0)) + STAR_COLOR_CUTOFF;
      float blu = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 3.0)) + STAR_COLOR_CUTOFF;
      float grn = min(red, blu) * seed;
      vec3 base = vec3(red, grn, blu);

      float hue = atan(base.g - base.r, base.b - base.r) / (2.0 * 3.14159) + 0.5;
      hue = fract(hue + uHueShift / 360.0);
      float sat = length(base - vec3(dot(base, vec3(0.299, 0.587, 0.114)))) * uSaturation;
      float val = max(max(base.r, base.g), base.b);
      base = hsv2rgb(vec3(hue, sat, val));

      vec2 pad = vec2(tris(seed * 34.0 + uTime * uSpeed / 10.0), tris(seed * 38.0 + uTime * uSpeed / 30.0)) - 0.5;

      float star = Star(gv - offset - pad, flareSize);
      vec3 color = base;

      float twinkle = trisn(uTime * uSpeed + seed * 6.2831) * 0.5 + 1.0;
      twinkle = mix(1.0, twinkle, uTwinkleIntensity);
      star *= twinkle;

      col += star * size * color;
    }
  }

  return col;
}

void main() {
  vec2 focalPx = uFocal * uResolution.xy;
  vec2 uv = (vUv * uResolution.xy - focalPx) / uResolution.y;

  vec2 mouseNorm = uMouse - vec2(0.5);

  if (uAutoCenterRepulsion > 0.0) {
    vec2 centerUV = vec2(0.0, 0.0);
    float centerDist = length(uv - centerUV);
    vec2 repulsion = normalize(uv - centerUV) * (uAutoCenterRepulsion / (centerDist + 0.1));
    uv += repulsion * 0.05;
  } else if (uMouseRepulsion) {
    vec2 mousePosUV = (uMouse * uResolution.xy - focalPx) / uResolution.y;
    float mouseDist = length(uv - mousePosUV);
    vec2 repulsion = normalize(uv - mousePosUV) * (uRepulsionStrength / (mouseDist + 0.1));
    uv += repulsion * 0.05 * uMouseActiveFactor;
  } else {
    vec2 mouseOffset = mouseNorm * 0.1 * uMouseActiveFactor;
    uv += mouseOffset;
  }

  float autoRotAngle = uTime * uRotationSpeed;
  mat2 autoRot = mat2(cos(autoRotAngle), -sin(autoRotAngle), sin(autoRotAngle), cos(autoRotAngle));
  uv = autoRot * uv;

  uv = mat2(uRotation.x, -uRotation.y, uRotation.y, uRotation.x) * uv;

  vec3 col = vec3(0.0);

  for (float i = 0.0; i < 1.0; i += 1.0 / NUM_LAYER) {
    float depth = fract(i + uStarSpeed * uSpeed);
    float scale = mix(20.0 * uDensity, 0.5 * uDensity, depth);
    float fade = depth * smoothstep(1.0, 0.9, depth);
    col += StarLayer(uv * scale + i * 453.32) * fade;
  }

  if (uTransparent) {
    float alpha = length(col);
    alpha = smoothstep(0.0, 0.3, alpha);
    alpha = min(alpha, 1.0);
    gl_FragColor = vec4(col, alpha);
  } else {
    gl_FragColor = vec4(col, 1.0);
  }
}
`

let renderer: THREE.WebGLRenderer | null = null
let material: THREE.ShaderMaterial | null = null
let animationId = 0
const targetMousePos = { x: 0.5, y: 0.5 }
const smoothMousePos = { x: 0.5, y: 0.5 }
let targetMouseActive = 0.0
let smoothMouseActive = 0.0

onMounted(() => {
  const container = containerRef.value
  if (!container) return

  renderer = new THREE.WebGLRenderer({
    alpha: props.transparent,
    premultipliedAlpha: false
  })
  const gl = renderer.getContext()
  if (props.transparent) {
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    gl.clearColor(0, 0, 0, 0)
  } else {
    gl.clearColor(0, 0, 0, 1)
  }
  renderer.setSize(container.clientWidth, container.clientHeight)
  container.appendChild(renderer.domElement)

  const scene = new THREE.Scene()
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

  const geo = new THREE.BufferGeometry()
  const vertices = new Float32Array([-1, -1, 3, -1, -1, 3])
  geo.setAttribute('position', new THREE.BufferAttribute(vertices, 2))
  const uvs = new Float32Array([0, 0, 2, 0, 0, 2])
  geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))

  const focal = new Float32Array(props.focal)
  const rotation = new Float32Array(props.rotation)

  material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector3(renderer.domElement.width, renderer.domElement.height, renderer.domElement.width / renderer.domElement.height) },
      uFocal: { value: focal },
      uRotation: { value: rotation },
      uStarSpeed: { value: props.starSpeed },
      uDensity: { value: props.density },
      uHueShift: { value: props.hueShift },
      uSpeed: { value: props.speed },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uGlowIntensity: { value: props.glowIntensity },
      uSaturation: { value: props.saturation },
      uMouseRepulsion: { value: props.mouseRepulsion },
      uTwinkleIntensity: { value: props.twinkleIntensity },
      uRotationSpeed: { value: props.rotationSpeed },
      uRepulsionStrength: { value: props.repulsionStrength },
      uMouseActiveFactor: { value: 0.0 },
      uAutoCenterRepulsion: { value: props.autoCenterRepulsion },
      uTransparent: { value: props.transparent }
    }
  })

  const mesh = new THREE.Mesh(geo, material)
  scene.add(mesh)

  const resize = () => {
    const w = container.clientWidth
    const h = container.clientHeight
    renderer!.setSize(w, h)
    if (material) {
      material.uniforms.uResolution.value.set(renderer!.domElement.width, renderer!.domElement.height, renderer!.domElement.width / renderer!.domElement.height)
    }
  }
  window.addEventListener('resize', resize, false)
  resize()

  const update = (t: number) => {
    animationId = requestAnimationFrame(update)
    if (!props.disableAnimation) {
      material!.uniforms.uTime.value = t * 0.001
      material!.uniforms.uStarSpeed.value = (t * 0.001 * props.starSpeed) / 10.0
    }

    const lerpFactor = 0.05
    smoothMousePos.x += (targetMousePos.x - smoothMousePos.x) * lerpFactor
    smoothMousePos.y += (targetMousePos.y - smoothMousePos.y) * lerpFactor
    smoothMouseActive += (targetMouseActive - smoothMouseActive) * lerpFactor

    const mouseUniform = material!.uniforms.uMouse.value as THREE.Vector2
    mouseUniform.x = smoothMousePos.x
    mouseUniform.y = smoothMousePos.y
    material!.uniforms.uMouseActiveFactor.value = smoothMouseActive

    renderer!.render(scene, camera)
  }
  animationId = requestAnimationFrame(update)

  function handleMouseMove(e: MouseEvent) {
    const rect = container.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = 1.0 - (e.clientY - rect.top) / rect.height
    targetMousePos.x = x
    targetMousePos.y = y
    targetMouseActive = 1.0
  }

  function handleMouseLeave() {
    targetMouseActive = 0.0
  }

  if (props.mouseInteraction) {
    container.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('mouseleave', handleMouseLeave)
  }
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  if (renderer) {
    renderer.dispose()
    renderer.forceContextLoss()
    if (renderer.domElement.parentNode) {
      renderer.domElement.parentNode.removeChild(renderer.domElement)
    }
  }
})
</script>

<style scoped>
.galaxy-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
