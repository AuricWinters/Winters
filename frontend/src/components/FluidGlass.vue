<template>
  <div ref="containerRef" class="fluid-glass-container" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

const props = withDefaults(defineProps<{
  ior?: number
  thickness?: number
  chromaticAberration?: number
  color?: string
}>(), {
  ior: 1.15,
  thickness: 5,
  chromaticAberration: 0.1,
  color: '#ffffff'
})

const containerRef = ref<HTMLDivElement>()

let renderer: THREE.WebGLRenderer | null = null
let animationId = 0

const vertexShader = `
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

void main() {
  vUv = uv;
  vPosition = position;
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragmentShader = `
precision highp float;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

uniform float uTime;
uniform float uIor;
uniform float uChromaticAberration;
uniform vec3 uColor;
uniform vec2 uResolution;
uniform vec2 uMouse;

void main() {
  vec2 uv = vUv;
  vec3 normal = normalize(vNormal);

  vec3 viewDir = normalize(cameraPosition - vPosition);
  float fresnel = 1.0 - abs(dot(viewDir, normal));
  fresnel = pow(fresnel, 3.0);

  vec2 distortion = normal.xy * (0.02 + fresnel * 0.05);
  vec2 refractUv = uv + distortion;

  float time = uTime * 0.3;
  float wave1 = sin(refractUv.x * 10.0 + time) * cos(refractUv.y * 8.0 + time * 0.7) * 0.03;
  float wave2 = sin(refractUv.y * 12.0 - time * 0.5) * cos(refractUv.x * 6.0 + time * 0.3) * 0.02;
  vec2 waveOffset = vec2(wave1, wave2);

  vec2 finalUv = uv + distortion + waveOffset;
  finalUv += (uMouse - 0.5) * 0.02;

  vec3 chromaticOffset = vec3(
    texture2D(uv + distortion * uChromaticAberration + waveOffset).r,
    texture2D(uv + waveOffset).g,
    texture2D(uv - distortion * uChromaticAberration + waveOffset).b
  );

  vec3 refractedColor = uColor * (0.6 + fresnel * 0.4);

  float alpha = 0.3 + fresnel * 0.7;
  alpha *= smoothstep(0.0, 0.2, abs(finalUv.x - 0.5) * 2.0);
  alpha *= smoothstep(0.0, 0.2, abs(finalUv.y - 0.5) * 2.0);

  gl_FragColor = vec4(refractedColor, alpha);
}
`

function createSphereGeometry(radius: number, widthSegments: number, heightSegments: number): THREE.BufferGeometry {
  return new THREE.SphereGeometry(radius, widthSegments, heightSegments)
}

onMounted(() => {
  const container = containerRef.value
  if (!container) return

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
  const gl = renderer.getContext()
  gl.clearColor(0, 0, 0, 0)
  gl.enable(gl.BLEND)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
  renderer.setSize(container.clientWidth, container.clientHeight)
  container.appendChild(renderer.domElement)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100)
  camera.position.set(0, 0, 5)

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)

  const dirLight = new THREE.DirectionalLight(0xffffff, 1)
  dirLight.position.set(5, 5, 5)
  scene.add(dirLight)

  const pointLight = new THREE.PointLight(0x4488ff, 2, 10)
  pointLight.position.set(-2, 1, 3)
  scene.add(pointLight)

  const mousePos = { x: 0.5, y: 0.5 }

  const geometry = createSphereGeometry(1.5, 64, 64)
  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uIor: { value: props.ior },
      uChromaticAberration: { value: props.chromaticAberration },
      uColor: { value: new THREE.Color(props.color) },
      uResolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) }
    },
    transparent: true,
    side: THREE.DoubleSide
  })

  const mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)

  const handleResize = () => {
    const w = container.clientWidth
    const h = container.clientHeight
    renderer!.setSize(w, h)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    material.uniforms.uResolution.value.set(w, h)
  }
  window.addEventListener('resize', handleResize)

  const handleMouseMove = (e: MouseEvent) => {
    const rect = container.getBoundingClientRect()
    mousePos.x = (e.clientX - rect.left) / rect.width
    mousePos.y = 1.0 - (e.clientY - rect.top) / rect.height
    material.uniforms.uMouse.value.set(mousePos.x, mousePos.y)
  }
  container.addEventListener('mousemove', handleMouseMove)

  const animate = (time: number) => {
    animationId = requestAnimationFrame(animate)
    material.uniforms.uTime.value = time * 0.001
    mesh.rotation.y += 0.005
    renderer!.render(scene, camera)
  }
  animationId = requestAnimationFrame(animate)
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
.fluid-glass-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
