<template>
  <div ref="containerRef" class="hyperspeed-container" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

const props = withDefaults(defineProps<{
  colorRoad?: string
  colorIsland?: string
  colorBackground?: string
  colorShoulderLines?: string
  colorBrokenLines?: string
  colorLeftCars?: string[]
  colorRightCars?: string[]
  colorSticks?: string
  fov?: number
  speed?: number
  distortion?: string
}>(), {
  colorRoad: '#080808',
  colorIsland: '#0a0a0a',
  colorBackground: '#000000',
  colorShoulderLines: '#ffffff',
  colorBrokenLines: '#ffffff',
  colorLeftCars: () => ['#d856bf', '#6750a2', '#c247ac'],
  colorRightCars: () => ['#03b3c3', '#0e5ea5', '#324555'],
  colorSticks: '#03b3c3',
  fov: 90,
  speed: 1,
  distortion: 'turbulent'
})

const containerRef = ref<HTMLDivElement>()

const roadVertexShader = `
varying vec2 vUv;
uniform float uTime;
uniform float uTravelLength;
uniform vec3 uRoadColor;
uniform vec3 uIslandColor;
uniform float uLanes;

void main() {
  vec3 transformed = position.xyz;
  vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  vUv = uv;
}
`

const roadFragmentShader = `
varying vec2 vUv;
uniform float uTime;
uniform vec3 uRoadColor;
uniform vec3 uIslandColor;
uniform float uLanes;
uniform vec3 uBrokenLinesColor;
uniform vec3 uShoulderLinesColor;

highp float random(vec2 co) {
  highp float a = 12.9898;
  highp float b = 78.233;
  highp float c = 43758.5453;
  highp float dt = dot(co.xy, vec2(a, b));
  highp float sn = mod(dt, 3.14);
  return fract(sin(sn) * c);
}

void main() {
  vec2 uv = vUv;
  uv.y = mod(uv.y + uTime * 0.05, 1.0);
  float laneWidth = 1.0 / uLanes;
  float brokenLineWidth = laneWidth * 0.1;
  float laneEmptySpace = 1.0 - 0.5;

  float brokenLines = step(1.0 - brokenLineWidth, fract(uv.x * 2.0)) * step(laneEmptySpace, fract(uv.y * 10.0));
  float sideLines = step(1.0 - brokenLineWidth, fract((uv.x - laneWidth * (uLanes - 1.0)) * 2.0)) + step(brokenLineWidth, uv.x);
  brokenLines = mix(brokenLines, sideLines, uv.x);

  vec3 color = uRoadColor;
  color = mix(color, uBrokenLinesColor, brokenLines * 0.5);
  color = mix(color, uShoulderLinesColor, sideLines * 0.3);

  gl_FragColor = vec4(color, 1.0);
}
`

const carLightsVertexShader = `
attribute vec3 aOffset;
attribute vec3 aMetrics;
attribute vec3 aColor;
uniform float uTravelLength;
uniform float uTime;
uniform float uFade;
varying vec3 vColor;
varying float vAlpha;

void main() {
  vec3 transformed = position.xyz;
  float radius = aMetrics.r;
  float myLength = aMetrics.g;
  float speed = aMetrics.b;

  transformed.xy *= radius;
  transformed.z *= myLength;

  transformed.z += myLength - mod(uTime * speed + aOffset.z, uTravelLength);
  transformed.xy += aOffset.xy;

  vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  vColor = aColor;
  vAlpha = smoothstep(uFade, 1.0, abs(uv.x - 0.5) * 2.0);
}
`

const carLightsFragmentShader = `
varying vec3 vColor;
varying float vAlpha;

void main() {
  gl_FragColor = vec4(vColor, vAlpha * 0.8);
}
`

let renderer: THREE.WebGLRenderer | null = null
let animationId = 0
let clock = new THREE.Clock()
let speedUp = 0

onMounted(() => {
  const container = containerRef.value
  if (!container) return

  const w = container.clientWidth
  const h = container.clientHeight

  renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true })
  renderer.setSize(w, h, false)
  renderer.setPixelRatio(window.devicePixelRatio)
  container.appendChild(renderer.domElement)

  const camera = new THREE.PerspectiveCamera(props.fov, w / h, 0.1, 10000)
  camera.position.set(0, 8, -5)
  camera.lookAt(0, 0, 0)

  const scene = new THREE.Scene()
  scene.background = new THREE.Color(props.colorBackground)

  const fog = new THREE.Fog(parseInt(props.colorBackground.replace('#', ''), 16), 80, 2000)
  scene.fog = fog

  const travelLength = 400

  // Road
  const roadGeo = new THREE.PlaneGeometry(10, travelLength, 20, 100)
  const roadMat = new THREE.ShaderMaterial({
    vertexShader: roadVertexShader,
    fragmentShader: roadFragmentShader,
    side: THREE.DoubleSide,
    uniforms: {
      uTime: { value: 0 },
      uTravelLength: { value: travelLength },
      uRoadColor: { value: new THREE.Color(props.colorRoad) },
      uIslandColor: { value: new THREE.Color(props.colorIsland) },
      uLanes: { value: 4 },
      uBrokenLinesColor: { value: new THREE.Color(props.colorBrokenLines) },
      uShoulderLinesColor: { value: new THREE.Color(props.colorShoulderLines) }
    }
  })

  const road = new THREE.Mesh(roadGeo, roadMat)
  road.rotation.x = -Math.PI / 2
  road.position.z = -travelLength / 2
  scene.add(road)

  // Island
  const islandGeo = new THREE.PlaneGeometry(2, travelLength, 20, 100)
  const islandMat = new THREE.ShaderMaterial({
    vertexShader: roadVertexShader,
    fragmentShader: `varying vec2 vUv; uniform vec3 uIslandColor; void main() { gl_FragColor = vec4(uIslandColor, 1.0); }`,
    side: THREE.DoubleSide,
    uniforms: {
      uTime: { value: 0 },
      uTravelLength: { value: travelLength },
      uIslandColor: { value: new THREE.Color(props.colorIsland) }
    }
  })
  const island = new THREE.Mesh(islandGeo, islandMat)
  island.rotation.x = -Math.PI / 2
  island.position.z = -travelLength / 2
  scene.add(island)

  // Car lights
  const curve = new THREE.LineCurve3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -1))
  const tubeGeo = new THREE.TubeGeometry(curve, 40, 1, 8, false)
  const instancedGeo = new THREE.InstancedBufferGeometry().copy(tubeGeo as any) as THREE.InstancedBufferGeometry

  const pairs = 40
  instancedGeo.instanceCount = pairs * 2

  const laneWidth = 10 / 4
  const aOffset: number[] = []
  const aMetrics: number[] = []
  const aColor: number[] = []

  const leftColors = props.colorLeftCars.map(c => new THREE.Color(c))
  const rightColors = props.colorRightCars.map(c => new THREE.Color(c))

  for (let i = 0; i < pairs; i++) {
    const radius = 0.05 + Math.random() * 0.09
    const length = 12 + Math.random() * 68
    const spd = 60 + Math.random() * 20
    const carLane = i % 4
    let laneX = carLane * laneWidth - 5 + laneWidth / 2
    const carWidth = (0.3 + Math.random() * 0.2) * laneWidth
    const carShiftX = (-0.8 + Math.random() * 1.6) * laneWidth
    laneX += carShiftX
    const offsetY = Math.random() * 5 + radius * 1.3
    const offsetZ = -Math.random() * travelLength

    aOffset.push(laneX - carWidth / 2, offsetY, offsetZ)
    aOffset.push(laneX + carWidth / 2, offsetY, offsetZ)
    aMetrics.push(radius, length, spd, radius, length, spd)
    const c1 = leftColors[Math.floor(Math.random() * leftColors.length)]
    const c2 = rightColors[Math.floor(Math.random() * rightColors.length)]
    aColor.push(c1.r, c1.g, c1.b, c2.r, c2.g, c2.b)
  }

  instancedGeo.setAttribute('aOffset', new THREE.InstancedBufferAttribute(new Float32Array(aOffset), 3, false))
  instancedGeo.setAttribute('aMetrics', new THREE.InstancedBufferAttribute(new Float32Array(aMetrics), 3, false))
  instancedGeo.setAttribute('aColor', new THREE.InstancedBufferAttribute(new Float32Array(aColor), 3, false))

  const carMat = new THREE.ShaderMaterial({
    vertexShader: carLightsVertexShader,
    fragmentShader: carLightsFragmentShader,
    transparent: true,
    uniforms: {
      uTime: { value: 0 },
      uTravelLength: { value: travelLength },
      uFade: { value: 0.6 }
    }
  })

  const carMesh = new THREE.Mesh(instancedGeo, carMat)
  carMesh.frustumCulled = false
  scene.add(carMesh)

  clock = new THREE.Clock()

  const handleResize = () => {
    const cw = container.clientWidth
    const ch = container.clientHeight
    if (cw <= 0 || ch <= 0) return
    renderer!.setSize(cw, ch)
    camera.aspect = cw / ch
    camera.updateProjectionMatrix()
  }
  window.addEventListener('resize', handleResize)

  const handlePointerDown = () => { speedUp = props.speed * 2 }
  const handlePointerUp = () => { speedUp = 0 }
  container.addEventListener('mousedown', handlePointerDown)
  container.addEventListener('mouseup', handlePointerUp)
  container.addEventListener('mouseleave', handlePointerUp)

  const animate = () => {
    animationId = requestAnimationFrame(animate)
    const delta = clock.getDelta()
    const elapsed = clock.elapsedTime + speedUp * delta

    roadMat.uniforms.uTime.value = elapsed
    islandMat.uniforms.uTime.value = elapsed
    carMat.uniforms.uTime.value = elapsed

    camera.fov = props.fov + speedUp * 30
    camera.updateProjectionMatrix()

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
.hyperspeed-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
