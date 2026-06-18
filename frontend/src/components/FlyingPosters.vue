<template>
  <div ref="containerRef" class="posters-container">
    <canvas ref="canvasRef" class="posters-canvas" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

const props = withDefaults(defineProps<{
  items?: string[]
  planeWidth?: number
  planeHeight?: number
  distortion?: number
  scrollEase?: number
  cameraFov?: number
  cameraZ?: number
}>(), {
  items: () => [],
  planeWidth: 320,
  planeHeight: 320,
  distortion: 3,
  scrollEase: 0.01,
  cameraFov: 45,
  cameraZ: 20
})

const containerRef = ref<HTMLDivElement>()
const canvasRef = ref<HTMLCanvasElement>()

const posterVertexShader = `
precision highp float;

attribute vec3 position;
attribute vec2 uv;
attribute vec3 normal;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

uniform float uPosition;
uniform float uTime;
uniform float uSpeed;
uniform vec3 distortionAxis;
uniform vec3 rotationAxis;
uniform float uDistortion;

varying vec2 vUv;
varying vec3 vNormal;

float PI = 3.141592653589793238;
mat4 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    return mat4(
      oc * axis.x * axis.x + c,         oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
      oc * axis.x * axis.y + axis.z * s,oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
      oc * axis.z * axis.x - axis.y * s,oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
      0.0,                              0.0,                                0.0,                                1.0
    );
}

vec3 rotate(vec3 v, vec3 axis, float angle) {
  mat4 m = rotationMatrix(axis, angle);
  return (m * vec4(v, 1.0)).xyz;
}

float qinticInOut(float t) {
  return t < 0.5
    ? 16.0 * pow(t, 5.0)
    : -0.5 * abs(pow(2.0 * t - 2.0, 5.0)) + 1.0;
}

void main() {
  vUv = uv;

  float norm = 0.5;
  vec3 newpos = position;
  float offset = (dot(distortionAxis, position) + norm / 2.) / norm;
  float localprogress = clamp(
    (fract(uPosition * 5.0 * 0.01) - 0.01 * uDistortion * offset) / (1. - 0.01 * uDistortion),
    0.,
    2.
  );
  localprogress = qinticInOut(localprogress) * PI;
  newpos = rotate(newpos, rotationAxis, localprogress);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newpos, 1.0);
}
`

const posterFragmentShader = `
precision highp float;

uniform vec2 uImageSize;
uniform vec2 uPlaneSize;
uniform sampler2D tMap;

varying vec2 vUv;

void main() {
  vec2 imageSize = uImageSize;
  vec2 planeSize = uPlaneSize;

  float imageAspect = imageSize.x / imageSize.y;
  float planeAspect = planeSize.x / planeSize.y;
  vec2 scale = vec2(1.0, 1.0);

  if (planeAspect > imageAspect) {
      scale.x = imageAspect / planeAspect;
  } else {
      scale.y = planeAspect / imageAspect;
  }

  vec2 uv = vUv * scale + (1.0 - scale) * 0.5;

  gl_FragColor = texture2D(tMap, uv);
}
`

let renderer: THREE.WebGLRenderer | null = null
let animationId = 0
let scene: THREE.Scene | null = null
let camera: THREE.PerspectiveCamera | null = null
let posters: THREE.Mesh[] = []
let scroll = { current: 0, target: 0 }

onMounted(() => {
  const container = containerRef.value
  const canvas = canvasRef.value
  if (!container || !canvas) return

  renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(props.cameraFov, container.clientWidth / container.clientHeight, 0.1, 100)
  camera.position.z = props.cameraZ

  const rect = container.getBoundingClientRect()
  const screen = { width: rect.width, height: rect.height }
  renderer.setSize(screen.width, screen.height)

  const fovRad = (props.cameraFov * Math.PI) / 180
  const viewH = 2 * Math.tan(fovRad / 2) * props.cameraZ
  const viewW = viewH * camera.aspect
  const viewport = { width: viewW, height: viewH }

  const planeGeo = new THREE.PlaneGeometry(1, 1, 100, 1)

  props.items.forEach((src, index) => {
    const texture = new THREE.Texture()
    const material = new THREE.ShaderMaterial({
      vertexShader: posterVertexShader,
      fragmentShader: posterFragmentShader,
      uniforms: {
        tMap: { value: texture },
        uPosition: { value: 0 },
        uPlaneSize: { value: [0, 0] },
        uImageSize: { value: [0, 0] },
        uSpeed: { value: 0 },
        rotationAxis: { value: new THREE.Vector3(0, 1, 0) },
        distortionAxis: { value: new THREE.Vector3(1, 1, 0) },
        uDistortion: { value: props.distortion },
        uTime: { value: 0 }
      },
      depthTest: false,
      depthWrite: false
    })

    const mesh = new THREE.Mesh(planeGeo, material)
    scene!.add(mesh)
    posters.push(mesh)

    const scaleX = (viewport.width * props.planeWidth) / screen.width
    const scaleY = (viewport.height * props.planeHeight) / screen.height
    mesh.scale.set(scaleX, scaleY, 1)
    material.uniforms.uPlaneSize.value = [scaleX, scaleY]

    const padding = 5
    const height = scaleY + padding
    const heightTotal = height * props.items.length
    const y = -heightTotal / 2 + (index + 0.5) * height
    mesh.position.y = y

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = src
    img.onload = () => {
      texture.image = img
      texture.needsUpdate = true
      material.uniforms.uImageSize.value = [img.naturalWidth, img.naturalHeight]
    }
  })

  const handleResize = () => {
    const r = container!.getBoundingClientRect()
    renderer!.setSize(r.width, r.height)
    camera!.aspect = r.width / r.height
    camera!.updateProjectionMatrix()
  }
  window.addEventListener('resize', handleResize)

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault()
    scroll.target += e.deltaY * 0.005
  }
  canvas.addEventListener('wheel', handleWheel, { passive: false })

  const animate = () => {
    animationId = requestAnimationFrame(animate)
    scroll.current += (scroll.target - scroll.current) * props.scrollEase

    posters.forEach((mesh, i) => {
      const mat = mesh.material as THREE.ShaderMaterial
      const y = mesh.position.y
      mat.uniforms.uPosition.value = y
      mat.uniforms.uTime.value += 0.04
      mat.uniforms.uSpeed.value = scroll.current

      if (camera) {
        const viewH = 2 * Math.tan(((props.cameraFov * Math.PI) / 180) / 2) * props.cameraZ
        const planeH = mesh.scale.y
        const topEdge = mesh.position.y + scroll.current + planeH / 2
        const bottomEdge = mesh.position.y + scroll.current - planeH / 2

        if (topEdge < -viewH / 2) {
          mesh.position.y += planeH * props.items.length
        } else if (bottomEdge > viewH / 2) {
          mesh.position.y -= planeH * props.items.length
        }
      }
    })

    renderer!.render(scene!, camera!)
  }
  animationId = requestAnimationFrame(animate)
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  if (renderer) {
    renderer.dispose()
    renderer.forceContextLoss()
  }
  posters = []
})
</script>

<style scoped>
.posters-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}
.posters-canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
