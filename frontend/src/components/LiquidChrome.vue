<template>
  <div ref="containerRef" class="liquidChrome-container" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

const props = withDefaults(defineProps<{
  baseColor?: [number, number, number]
  speed?: number
  amplitude?: number
  frequencyX?: number
  frequencyY?: number
  interactive?: boolean
}>(), {
  baseColor: () => [0.1, 0.1, 0.1],
  speed: 0.2,
  amplitude: 0.5,
  frequencyX: 3,
  frequencyY: 2,
  interactive: true
})

const containerRef = ref<HTMLDivElement>()

const vertexShader = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const fragmentShader = `
precision highp float;
uniform float uTime;
uniform vec3 uResolution;
uniform vec3 uBaseColor;
uniform float uAmplitude;
uniform float uFrequencyX;
uniform float uFrequencyY;
uniform vec2 uMouse;
varying vec2 vUv;

vec4 renderImage(vec2 uvCoord) {
    vec2 fragCoord = uvCoord * uResolution.xy;
    vec2 uv = (2.0 * fragCoord - uResolution.xy) / min(uResolution.x, uResolution.y);

    for (float i = 1.0; i < 10.0; i++){
        uv.x += uAmplitude / i * cos(i * uFrequencyX * uv.y + uTime + uMouse.x * 3.14159);
        uv.y += uAmplitude / i * cos(i * uFrequencyY * uv.x + uTime + uMouse.y * 3.14159);
    }

    vec2 diff = (uvCoord - uMouse);
    float dist = length(diff);
    float falloff = exp(-dist * 20.0);
    float ripple = sin(10.0 * dist - uTime * 2.0) * 0.03;
    uv += (diff / (dist + 0.0001)) * ripple * falloff;

    vec3 color = uBaseColor / abs(sin(uTime - uv.y - uv.x));
    return vec4(color, 1.0);
}

void main() {
    vec4 col = vec4(0.0);
    int samples = 0;
    for (int i = -1; i <= 1; i++){
        for (int j = -1; j <= 1; j++){
            vec2 offset = vec2(float(i), float(j)) * (1.0 / min(uResolution.x, uResolution.y));
            col += renderImage(vUv + offset);
            samples++;
        }
    }
    gl_FragColor = col / float(samples);
}
`

let renderer: THREE.WebGLRenderer | null = null
let material: THREE.ShaderMaterial | null = null
let animationId = 0

onMounted(() => {
  const container = containerRef.value
  if (!container) return

  renderer = new THREE.WebGLRenderer({ antialias: true })
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

  material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector3(renderer.domElement.width, renderer.domElement.height, renderer.domElement.width / renderer.domElement.height) },
      uBaseColor: { value: new THREE.Vector3(...props.baseColor) },
      uAmplitude: { value: props.amplitude },
      uFrequencyX: { value: props.frequencyX },
      uFrequencyY: { value: props.frequencyY },
      uMouse: { value: new THREE.Vector2(0, 0) }
    }
  })

  const mesh = new THREE.Mesh(geo, material)
  scene.add(mesh)

  function resize() {
    const w = container.clientWidth
    const h = container.clientHeight
    renderer!.setSize(w, h)
    if (material) {
      const resUniform = material.uniforms.uResolution.value as THREE.Vector3
      resUniform.set(renderer!.domElement.width, renderer!.domElement.height, renderer!.domElement.width / renderer!.domElement.height)
    }
  }
  window.addEventListener('resize', resize)
  resize()

  function handleMouseMove(event: MouseEvent) {
    if (!material) return
    const rect = container.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width
    const y = 1 - (event.clientY - rect.top) / rect.height
    const mouseUniform = material.uniforms.uMouse.value as THREE.Vector2
    mouseUniform.x = x
    mouseUniform.y = y
  }

  if (props.interactive) {
    container.addEventListener('mousemove', handleMouseMove)
  }

  const update = (t: number) => {
    animationId = requestAnimationFrame(update)
    material!.uniforms.uTime.value = t * 0.001 * props.speed
    renderer!.render(scene, camera)
  }
  animationId = requestAnimationFrame(update)
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
.liquidChrome-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
