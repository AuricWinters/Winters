<template>
  <div ref="containerRef" class="prism-container" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

const props = withDefaults(defineProps<{
  height?: number
  baseWidth?: number
  animationType?: 'rotate' | 'hover' | '3drotate'
  glow?: number
  offset?: { x?: number; y?: number }
  noise?: number
  transparent?: boolean
  scale?: number
  hueShift?: number
  colorFrequency?: number
  hoverStrength?: number
  inertia?: number
  bloom?: number
  suspendWhenOffscreen?: boolean
  timeScale?: number
}>(), {
  height: 3.5,
  baseWidth: 5.5,
  animationType: 'rotate',
  glow: 1,
  offset: () => ({ x: 0, y: 0 }),
  noise: 0.5,
  transparent: true,
  scale: 3.6,
  hueShift: 0,
  colorFrequency: 1,
  hoverStrength: 2,
  inertia: 0.05,
  bloom: 1,
  suspendWhenOffscreen: false,
  timeScale: 0.5
})

const containerRef = ref<HTMLDivElement>()

const vertex = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const fragment = `
precision highp float;

uniform vec2  iResolution;
uniform float iTime;

uniform float uHeight;
uniform float uBaseHalf;
uniform mat3  uRot;
uniform int   uUseBaseWobble;
uniform float uGlow;
uniform vec2  uOffsetPx;
uniform float uNoise;
uniform float uSaturation;
uniform float uScale;
uniform float uHueShift;
uniform float uColorFreq;
uniform float uBloom;
uniform float uCenterShift;
uniform float uInvBaseHalf;
uniform float uInvHeight;
uniform float uMinAxis;
uniform float uPxScale;
uniform float uTimeScale;

vec4 tanh4(vec4 x){
  vec4 e2x = exp(2.0*x);
  return (e2x - 1.0) / (e2x + 1.0);
}

float rand(vec2 co){
  return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453123);
}

float sdOctaAnisoInv(vec3 p){
  vec3 q = vec3(abs(p.x) * uInvBaseHalf, abs(p.y) * uInvHeight, abs(p.z) * uInvBaseHalf);
  float m = q.x + q.y + q.z - 1.0;
  return m * uMinAxis * 0.5773502691896258;
}

float sdPyramidUpInv(vec3 p){
  float oct = sdOctaAnisoInv(p);
  float halfSpace = -p.y;
  return max(oct, halfSpace);
}

mat3 hueRotation(float a){
  float c = cos(a), s = sin(a);
  mat3 W = mat3(
    0.299, 0.587, 0.114,
    0.299, 0.587, 0.114,
    0.299, 0.587, 0.114
  );
  mat3 U = mat3(
     0.701, -0.587, -0.114,
    -0.299,  0.413, -0.114,
    -0.300, -0.588,  0.886
  );
  mat3 V = mat3(
     0.168, -0.331,  0.500,
     0.328,  0.035, -0.500,
    -0.497,  0.296,  0.201
  );
  return W + U * c + V * s;
}

void main(){
  vec2 f = (gl_FragCoord.xy - 0.5 * iResolution.xy - uOffsetPx) * uPxScale;

  float z = 5.0;
  float d = 0.0;

  vec3 p;
  vec4 o = vec4(0.0);

  float centerShift = uCenterShift;
  float cf = uColorFreq;

  mat2 wob = mat2(1.0);
  if (uUseBaseWobble == 1) {
    float t = iTime * uTimeScale;
    float c0 = cos(t + 0.0);
    float c1 = cos(t + 33.0);
    float c2 = cos(t + 11.0);
    wob = mat2(c0, c1, c2, c0);
  }

  const int STEPS = 100;
  for (int i = 0; i < STEPS; i++) {
    p = vec3(f, z);
    p.xz = p.xz * wob;
    p = uRot * p;
    vec3 q = p;
    q.y += centerShift;
    d = 0.1 + 0.2 * abs(sdPyramidUpInv(q));
    z -= d;
    o += (sin((p.y + z) * cf + vec4(0.0, 1.0, 2.0, 3.0)) + 1.0) / d;
  }

  o = tanh4(o * o * (uGlow * uBloom) / 1e5);

  vec3 col = o.rgb;
  float n = rand(gl_FragCoord.xy + vec2(iTime));
  col += (n - 0.5) * uNoise;
  col = clamp(col, 0.0, 1.0);

  float L = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col = clamp(mix(vec3(L), col, uSaturation), 0.0, 1.0);

  if(abs(uHueShift) > 0.0001){
    col = clamp(hueRotation(uHueShift) * col, 0.0, 1.0);
  }

  gl_FragColor = vec4(col, o.a);
}
`

let renderer: THREE.WebGLRenderer | null = null
let material: THREE.ShaderMaterial | null = null
let animationId = 0

onMounted(() => {
  const container = containerRef.value
  if (!container) return

  const H = Math.max(0.001, props.height)
  const BW = Math.max(0.001, props.baseWidth)
  const BASE_HALF = BW * 0.5
  const GLOW = Math.max(0.0, props.glow)
  const NOISE = Math.max(0.0, props.noise)
  const offX = props.offset?.x ?? 0
  const offY = props.offset?.y ?? 0
  const SAT = props.transparent ? 1.5 : 1
  const SCALE = Math.max(0.001, props.scale)
  const HUE = props.hueShift || 0
  const CFREQ = Math.max(0.0, props.colorFrequency || 1)
  const BLOOM = Math.max(0.0, props.bloom || 1)
  const TS = Math.max(0, props.timeScale || 1)
  const HOVSTR = Math.max(0, props.hoverStrength || 1)
  const INERT = Math.max(0, Math.min(1, props.inertia || 0.12))

  const dpr = Math.min(2, window.devicePixelRatio || 1)

  renderer = new THREE.WebGLRenderer({
    alpha: props.transparent,
    antialias: false
  })
  const gl = renderer.getContext()
  gl.disable(gl.DEPTH_TEST)
  gl.disable(gl.CULL_FACE)
  gl.disable(gl.BLEND)

  Object.assign(renderer.domElement.style, {
    position: 'absolute',
    inset: '0',
    width: '100%',
    height: '100%',
    display: 'block'
  } as Partial<CSSStyleDeclaration>)
  container.appendChild(renderer.domElement)

  const scene = new THREE.Scene()
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

  const geo = new THREE.BufferGeometry()
  const vertices = new Float32Array([-1, -1, 3, -1, -1, 3])
  geo.setAttribute('position', new THREE.BufferAttribute(vertices, 2))

  const iResBuf = new Float32Array(2)
  const offsetPxBuf = new Float32Array(2)
  const rotBuf = new Float32Array(9)
  const identityMat = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1])
  rotBuf.set(identityMat)

  material = new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    uniforms: {
      iResolution: { value: iResBuf },
      iTime: { value: 0 },
      uHeight: { value: H },
      uBaseHalf: { value: BASE_HALF },
      uUseBaseWobble: { value: 1 },
      uRot: { value: rotBuf },
      uGlow: { value: GLOW },
      uOffsetPx: { value: offsetPxBuf },
      uNoise: { value: NOISE },
      uSaturation: { value: SAT },
      uScale: { value: SCALE },
      uHueShift: { value: HUE },
      uColorFreq: { value: CFREQ },
      uBloom: { value: BLOOM },
      uCenterShift: { value: H * 0.25 },
      uInvBaseHalf: { value: 1 / BASE_HALF },
      uInvHeight: { value: 1 / H },
      uMinAxis: { value: Math.min(BASE_HALF, H) },
      uPxScale: { value: 1 / ((gl.drawingBufferHeight || 1) * 0.1 * SCALE) },
      uTimeScale: { value: TS }
    }
  })

  const mesh = new THREE.Mesh(geo, material)
  scene.add(mesh)

  const resize = () => {
    const w = container.clientWidth || 1
    const h = container.clientHeight || 1
    renderer!.setSize(w, h)
    iResBuf[0] = gl.drawingBufferWidth
    iResBuf[1] = gl.drawingBufferHeight
    offsetPxBuf[0] = offX * dpr
    offsetPxBuf[1] = offY * dpr
    material!.uniforms.uPxScale.value = 1 / ((gl.drawingBufferHeight || 1) * 0.1 * SCALE)
  }

  const ro = new ResizeObserver(resize)
  ro.observe(container)
  resize()

  const setMat3FromEuler = (yawY: number, pitchX: number, rollZ: number, out: Float32Array) => {
    const cy = Math.cos(yawY), sy = Math.sin(yawY)
    const cx = Math.cos(pitchX), sx = Math.sin(pitchX)
    const cz = Math.cos(rollZ), sz = Math.sin(rollZ)
    out[0] = cy * cz + sy * sx * sz
    out[1] = cx * sz
    out[2] = -sy * cz + cy * sx * sz
    out[3] = -cy * sz + sy * sx * cz
    out[4] = cx * cz
    out[5] = sy * sz + cy * sx * cz
    out[6] = sy * cx
    out[7] = -sx
    out[8] = cy * cx
    return out
  }

  const NOISE_IS_ZERO = NOISE < 1e-6
  const t0 = performance.now()

  const rnd = () => Math.random()
  const wX = (0.3 + rnd() * 0.6)
  const wY = (0.2 + rnd() * 0.7)
  const wZ = (0.1 + rnd() * 0.5)
  const phX = rnd() * Math.PI * 2
  const phZ = rnd() * Math.PI * 2

  let yaw = 0, pitch = 0, roll = 0
  let targetYaw = 0, targetPitch = 0
  const lerpFn = (a: number, b: number, t: number) => a + (b - a) * t

  const pointer = { x: 0, y: 0, inside: true }
  let startRAF: () => void
  let stopRAF: () => void

  if (props.animationType === 'hover') {
    material.uniforms.uUseBaseWobble.value = 0
    const onMove = (e: PointerEvent) => {
      const ww = Math.max(1, window.innerWidth)
      const wh = Math.max(1, window.innerHeight)
      const cx = ww * 0.5
      const cy = wh * 0.5
      const nx = (e.clientX - cx) / (ww * 0.5)
      const ny = (e.clientY - cy) / (wh * 0.5)
      pointer.x = Math.max(-1, Math.min(1, nx))
      pointer.y = Math.max(-1, Math.min(1, ny))
      pointer.inside = true
      startRAF && startRAF()
    }
    const onLeave = () => { pointer.inside = false }
    const onBlur = () => { pointer.inside = false }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('mouseleave', onLeave)
    window.addEventListener('blur', onBlur)
  } else if (props.animationType === '3drotate') {
    material.uniforms.uUseBaseWobble.value = 0
  } else {
    material.uniforms.uUseBaseWobble.value = 1
  }

  const render = (t: number) => {
    const time = (t - t0) * 0.001
    material!.uniforms.iTime.value = time

    let continueRAF = true

    if (props.animationType === 'hover') {
      const maxPitch = 0.6 * HOVSTR
      const maxYaw = 0.6 * HOVSTR
      targetYaw = (pointer.inside ? -pointer.x : 0) * maxYaw
      targetPitch = (pointer.inside ? pointer.y : 0) * maxPitch
      yaw = lerpFn(yaw, targetYaw, INERT)
      pitch = lerpFn(pitch, targetPitch, INERT)
      roll = lerpFn(roll, 0, 0.1)
      material!.uniforms.uRot.value = setMat3FromEuler(yaw, pitch, roll, rotBuf)
      if (NOISE_IS_ZERO) {
        const settled = Math.abs(yaw - targetYaw) < 1e-4 && Math.abs(pitch - targetPitch) < 1e-4 && Math.abs(roll) < 1e-4
        if (settled) continueRAF = false
      }
    } else if (props.animationType === '3drotate') {
      const tScaled = time * TS
      yaw = tScaled * wY
      pitch = Math.sin(tScaled * wX + phX) * 0.6
      roll = Math.sin(tScaled * wZ + phZ) * 0.5
      material!.uniforms.uRot.value = setMat3FromEuler(yaw, pitch, roll, rotBuf)
      if (TS < 1e-6) continueRAF = false
    } else {
      rotBuf.set(identityMat)
      material!.uniforms.uRot.value = rotBuf
      if (TS < 1e-6) continueRAF = false
    }

    renderer!.render(scene, camera)
    if (continueRAF) {
      animationId = requestAnimationFrame(render)
    } else {
      animationId = 0
    }
  }

  startRAF = () => {
    if (animationId) return
    animationId = requestAnimationFrame(render)
  }
  stopRAF = () => {
    if (!animationId) return
    cancelAnimationFrame(animationId)
    animationId = 0
  }

  if (props.suspendWhenOffscreen) {
    const io = new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting)) startRAF()
      else stopRAF()
    })
    io.observe(container)
    startRAF()
  } else {
    startRAF()
  }
})

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId)
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
.prism-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}
</style>
