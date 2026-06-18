<template>
  <div ref="containerRef" class="plasma-container" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

const props = withDefaults(defineProps<{
  color?: string
  speed?: number
  direction?: 'forward' | 'reverse' | 'pingpong'
  scale?: number
  opacity?: number
  mouseInteractive?: boolean
}>(), {
  color: '#ffffff',
  speed: 1,
  direction: 'forward',
  scale: 1,
  opacity: 1,
  mouseInteractive: true
})

const containerRef = ref<HTMLDivElement>()

const vertex = `#version 300 es
precision highp float;
in vec2 position;
in vec2 uv;
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const fragment = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform vec3 uCustomColor;
uniform float uUseCustomColor;
uniform float uSpeed;
uniform float uDirection;
uniform float uScale;
uniform float uOpacity;
uniform vec2 uMouse;
uniform float uMouseInteractive;
out vec4 fragColor;

void mainImage(out vec4 o, vec2 C) {
  vec2 center = iResolution.xy * 0.5;
  C = (C - center) / uScale + center;

  vec2 mouseOffset = (uMouse - center) * 0.0002;
  C += mouseOffset * length(C - center) * step(0.5, uMouseInteractive);

  float i, d, z, T = iTime * uSpeed * uDirection;
  vec3 O, p, S;

  for (vec2 r = iResolution.xy, Q; ++i < 60.; O += o.w/d*o.xyz) {
    p = z*normalize(vec3(C-.5*r,r.y));
    p.z -= 4.;
    S = p;
    d = p.y-T;

    p.x += .4*(1.+p.y)*sin(d + p.x*0.1)*cos(.34*d + p.x*0.05);
    Q = p.xz *= mat2(cos(p.y+vec4(0,11,33,0)-T));
    z+= d = abs(sqrt(length(Q*Q)) - .25*(5.+S.y))/3.+8e-4;
    o = 1.+sin(S.y+p.z*.5+S.z-length(S-p)+vec4(2,1,0,8));
  }

  o.xyz = tanh(O/1e4);
}

bool finite1(float x){ return !(isnan(x) || isinf(x)); }
vec3 sanitize(vec3 c){
  return vec3(
    finite1(c.r) ? c.r : 0.0,
    finite1(c.g) ? c.g : 0.0,
    finite1(c.b) ? c.b : 0.0
  );
}

void main() {
  vec4 o = vec4(0.0);
  mainImage(o, gl_FragCoord.xy);
  vec3 rgb = sanitize(o.rgb);

  float intensity = (rgb.r + rgb.g + rgb.b) / 3.0;
  vec3 customColor = intensity * uCustomColor;
  vec3 finalColor = mix(rgb, customColor, step(0.5, uUseCustomColor));

  float alpha = length(rgb) * uOpacity;
  fragColor = vec4(finalColor, alpha);
}`

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return [1, 0.5, 0.2]
  return [parseInt(result[1], 16) / 255, parseInt(result[2], 16) / 255, parseInt(result[3], 16) / 255]
}

let renderer: THREE.WebGLRenderer | null = null
let material: THREE.ShaderMaterial | null = null
let animationId = 0

onMounted(() => {
  const container = containerRef.value
  if (!container) return

  const useCustomColor = props.color ? 1.0 : 0.0
  const customColorRgb = props.color ? hexToRgb(props.color) : [1, 1, 1]
  const directionMultiplier = props.direction === 'reverse' ? -1.0 : 1.0

  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false })
  } catch {
    return
  }
  const gl = renderer.getContext()
  if (!gl) return
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  const canvas = renderer.domElement
  canvas.style.display = 'block'
  canvas.style.width = '100%'
  canvas.style.height = '100%'
  container.appendChild(canvas)

  const scene = new THREE.Scene()
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

  const geo = new THREE.BufferGeometry()
  const vertices = new Float32Array([-1, -1, 3, -1, -1, 3])
  geo.setAttribute('position', new THREE.BufferAttribute(vertices, 2))
  const uvs = new Float32Array([0, 0, 2, 0, 0, 2])
  geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))

  const mousePos = { x: 0, y: 0 }

  material = new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    uniforms: {
      iTime: { value: 0 },
      iResolution: { value: new THREE.Vector2(1, 1) },
      uCustomColor: { value: new THREE.Vector3(...customColorRgb) },
      uUseCustomColor: { value: useCustomColor },
      uSpeed: { value: props.speed * 0.4 },
      uDirection: { value: directionMultiplier },
      uScale: { value: props.scale },
      uOpacity: { value: props.opacity },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uMouseInteractive: { value: props.mouseInteractive ? 1.0 : 0.0 }
    }
  })

  const mesh = new THREE.Mesh(geo, material)
  scene.add(mesh)

  const handleMouseMove = (e: MouseEvent) => {
    if (!props.mouseInteractive || !material) return
    const rect = container.getBoundingClientRect()
    mousePos.x = e.clientX - rect.left
    mousePos.y = e.clientY - rect.top
    const mouseUniform = material.uniforms.uMouse.value as THREE.Vector2
    mouseUniform.x = mousePos.x
    mouseUniform.y = mousePos.y
  }

  if (props.mouseInteractive) {
    container.addEventListener('mousemove', handleMouseMove)
  }

  const setSize = () => {
    const rect = container.getBoundingClientRect()
    const w = Math.max(1, Math.floor(rect.width))
    const h = Math.max(1, Math.floor(rect.height))
    renderer!.setSize(w, h)
    if (material) {
      const res = material.uniforms.iResolution.value as THREE.Vector2
      res.set(renderer!.domElement.width, renderer!.domElement.height)
    }
  }

  setSize()
  window.addEventListener('resize', setSize)

  let contextLost = false
  let isVisible = true
  const t0 = performance.now()

  const loop = (t: number) => {
    if (contextLost || !isVisible) return
    let timeValue = (t - t0) * 0.001
    if (props.direction === 'pingpong') {
      const pingpongDuration = 10
      const segmentTime = timeValue % pingpongDuration
      const isForward = Math.floor(timeValue / pingpongDuration) % 2 === 0
      const u = segmentTime / pingpongDuration
      const smooth = u * u * (3 - 2 * u)
      const pingpongTime = isForward ? smooth * pingpongDuration : (1 - smooth) * pingpongDuration
      material!.uniforms.uDirection.value = 1.0
      material!.uniforms.iTime.value = pingpongTime
    } else {
      material!.uniforms.iTime.value = timeValue
    }
    renderer!.render(scene, camera)
    animationId = requestAnimationFrame(loop)
  }

  canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); contextLost = true; cancelAnimationFrame(animationId) })
  canvas.addEventListener('webglcontextrestored', () => { contextLost = false; if (isVisible) { cancelAnimationFrame(animationId); animationId = requestAnimationFrame(loop) } })

  const io = new IntersectionObserver(([entry]) => {
    const wasVisible = isVisible
    isVisible = entry.isIntersecting
    if (isVisible && !wasVisible && !contextLost) {
      cancelAnimationFrame(animationId)
      animationId = requestAnimationFrame(loop)
    }
  }, { threshold: 0 })
  io.observe(container)

  animationId = requestAnimationFrame(loop)
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
.plasma-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
