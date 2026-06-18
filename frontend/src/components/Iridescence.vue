<template>
  <div ref="containerRef" class="iridescence-container" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

const props = withDefaults(defineProps<{
  color?: [number, number, number]
  speed?: number
  amplitude?: number
  mouseReact?: boolean
}>(), {
  color: () => [1, 1, 1],
  speed: 1.0,
  amplitude: 0.1,
  mouseReact: true
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
uniform vec3 uColor;
uniform vec3 uResolution;
uniform vec2 uMouse;
uniform float uAmplitude;
uniform float uSpeed;

varying vec2 vUv;

void main() {
  float mr = min(uResolution.x, uResolution.y);
  vec2 uv = (vUv.xy * 2.0 - 1.0) * uResolution.xy / mr;

  uv += (uMouse - vec2(0.5)) * uAmplitude;

  float d = -uTime * 0.5 * uSpeed;
  float a = 0.0;
  for (float i = 0.0; i < 8.0; ++i) {
    a += cos(i - d - a * uv.x);
    d += sin(uv.y * i + a);
  }
  d += uTime * 0.5 * uSpeed;
  vec3 col = vec3(cos(uv * vec2(d, a)) * 0.6 + 0.4, cos(a + d) * 0.5 + 0.5);
  col = cos(col * cos(vec3(d, a, 2.5)) * 0.5 + 0.5) * uColor;
  gl_FragColor = vec4(col, 1.0);
}
`

let renderer: THREE.WebGLRenderer | null = null
let material: THREE.ShaderMaterial | null = null
let animationId = 0

onMounted(() => {
  const container = containerRef.value
  if (!container) return

  renderer = new THREE.WebGLRenderer()
  const gl = renderer.getContext()
  gl.clearColor(1, 1, 1, 1)
  renderer.setSize(container.clientWidth, container.clientHeight)
  container.appendChild(renderer.domElement)

  const scene = new THREE.Scene()
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

  const geo = new THREE.BufferGeometry()
  const vertices = new Float32Array([-1, -1, 3, -1, -1, 3])
  geo.setAttribute('position', new THREE.BufferAttribute(vertices, 2))
  const uvs = new Float32Array([0, 0, 2, 0, 0, 2])
  geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))

  const mousePos = { x: 0.5, y: 0.5 }

  material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(...props.color) },
      uResolution: { value: new THREE.Vector3(renderer.domElement.width, renderer.domElement.height, renderer.domElement.width / renderer.domElement.height) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uAmplitude: { value: props.amplitude },
      uSpeed: { value: props.speed }
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
    material!.uniforms.uTime.value = t * 0.001
    renderer!.render(scene, camera)
  }
  animationId = requestAnimationFrame(update)

  function handleMouseMove(e: MouseEvent) {
    if (!material) return
    const rect = container.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = 1.0 - (e.clientY - rect.top) / rect.height
    mousePos.x = x
    mousePos.y = y
    const uMouse = material.uniforms.uMouse.value as THREE.Vector2
    uMouse.x = x
    uMouse.y = y
  }

  if (props.mouseReact) {
    container.addEventListener('mousemove', handleMouseMove)
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
.iridescence-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
