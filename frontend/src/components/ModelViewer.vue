<template>
  <div ref="containerRef" class="model-viewer-container" :style="{ width: typeof width === 'number' ? width + 'px' : width, height: typeof height === 'number' ? height + 'px' : height }">
    <canvas ref="canvasRef" class="model-viewer-canvas" />
    <button v-if="showScreenshotButton" class="model-viewer-screenshot" @click="takeScreenshot">Take Screenshot</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'

const props = withDefaults(defineProps<{
  url: string
  width?: number | string
  height?: number | string
  modelXOffset?: number
  modelYOffset?: number
  defaultRotationX?: number
  defaultRotationY?: number
  defaultZoom?: number
  minZoomDistance?: number
  maxZoomDistance?: number
  enableMouseParallax?: boolean
  enableManualRotation?: boolean
  enableHoverRotation?: boolean
  enableManualZoom?: boolean
  ambientIntensity?: number
  keyLightIntensity?: number
  fillLightIntensity?: number
  rimLightIntensity?: number
  autoRotate?: boolean
  autoRotateSpeed?: number
  showScreenshotButton?: boolean
}>(), {
  width: 400,
  height: 400,
  modelXOffset: 0,
  modelYOffset: 0,
  defaultRotationX: -50,
  defaultRotationY: 20,
  defaultZoom: 0.5,
  minZoomDistance: 0.5,
  maxZoomDistance: 10,
  enableMouseParallax: true,
  enableManualRotation: true,
  enableHoverRotation: true,
  enableManualZoom: true,
  ambientIntensity: 0.3,
  keyLightIntensity: 1,
  fillLightIntensity: 0.5,
  rimLightIntensity: 0.8,
  autoRotate: false,
  autoRotateSpeed: 0.35,
  showScreenshotButton: true
})

const containerRef = ref<HTMLDivElement>()
const canvasRef = ref<HTMLCanvasElement>()

let renderer: THREE.WebGLRenderer | null = null
let animationId = 0
let scene: THREE.Scene | null = null
let camera: THREE.PerspectiveCamera | null = null
let modelGroup: THREE.Group | null = null
let isLoading = true

function deg2rad(d: number) { return (d * Math.PI) / 180 }

onMounted(() => {
  const container = containerRef.value
  const canvas = canvasRef.value
  if (!container || !canvas) return

  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    preserveDrawingBuffer: true
  })
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.shadowMap.enabled = true

  const w = container.clientWidth
  const h = container.clientHeight
  renderer.setSize(w, h)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  scene = new THREE.Scene()
  scene.background = null

  camera = new THREE.PerspectiveCamera(50, w / h, 0.01, 100)
  const camZ = Math.min(Math.max(props.defaultZoom, props.minZoomDistance), props.maxZoomDistance)
  camera.position.set(0, 0, camZ)

  const ambientLight = new THREE.AmbientLight(0xffffff, props.ambientIntensity)
  scene.add(ambientLight)

  const keyLight = new THREE.DirectionalLight(0xffffff, props.keyLightIntensity)
  keyLight.position.set(5, 5, 5)
  keyLight.castShadow = true
  scene.add(keyLight)

  const fillLight = new THREE.DirectionalLight(0xffffff, props.fillLightIntensity)
  fillLight.position.set(-5, 2, 5)
  scene.add(fillLight)

  const rimLight = new THREE.DirectionalLight(0xffffff, props.rimLightIntensity)
  rimLight.position.set(0, 4, -5)
  scene.add(rimLight)

  modelGroup = new THREE.Group()
  scene.add(modelGroup)

  // Load model
  const ext = props.url.split('.').pop()?.toLowerCase() || ''

  let loader: THREE.Loader | null = null
  if (ext === 'glb' || ext === 'gltf') loader = new GLTFLoader()
  else if (ext === 'fbx') loader = new FBXLoader()
  else if (ext === 'obj') loader = new OBJLoader()

  if (loader) {
    const loadFn = (loader instanceof GLTFLoader)
      ? () => new Promise<THREE.Object3D>((resolve, reject) => {
          ;(loader as GLTFLoader).load(props.url, (gltf) => resolve(gltf.scene), undefined, reject)
        })
      : () => new Promise<THREE.Object3D>((resolve, reject) => {
          if (loader instanceof OBJLoader) {
            ;(loader as OBJLoader).load(props.url, resolve, undefined, reject)
          } else {
            ;(loader as FBXLoader).load(props.url, resolve, undefined, reject)
          }
        })

    loadFn().then((object) => {
      if (!modelGroup) return
      modelGroup.add(object)

      // Auto-frame
      const box = new THREE.Box3().setFromObject(modelGroup)
      const center = box.getCenter(new THREE.Vector3())
      const size = box.getSize(new THREE.Vector3())
      const maxDim = Math.max(size.x, size.y, size.z)
      const scale = 1 / (maxDim || 1)

      modelGroup.position.set(-center.x * scale, -center.y * scale, -center.z * scale)
      modelGroup.scale.setScalar(scale)

      modelGroup.rotation.x = deg2rad(props.defaultRotationX)
      modelGroup.rotation.y = deg2rad(props.defaultRotationY)

      object.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true
          child.receiveShadow = true
        }
      })

      isLoading = false
    }).catch((err) => {
      console.error('Failed to load model:', err)
      isLoading = false
    })
  }

  // Mouse interaction
  let isDragging = false
  let prevMouse = { x: 0, y: 0 }
  const ROTATE_SPEED = 0.005
  const INERTIA = 0.925
  let velocity = { x: 0, y: 0 }
  const PARALLAX_MAG = 0.05
  const PARALLAX_EASE = 0.12
  const HOVER_MAG = deg2rad(6)
  const HOVER_EASE = 0.15
  let targetParallax = { x: 0, y: 0 }
  let currentParallax = { x: 0, y: 0 }
  let targetHover = { x: 0, y: 0 }
  let currentHover = { x: 0, y: 0 }

  const handlePointerDown = (e: PointerEvent) => {
    isDragging = true
    prevMouse.x = e.clientX
    prevMouse.y = e.clientY
  }

  const handlePointerMove = (e: PointerEvent) => {
    if (isDragging && props.enableManualRotation && modelGroup) {
      const dx = e.clientX - prevMouse.x
      const dy = e.clientY - prevMouse.y
      prevMouse.x = e.clientX
      prevMouse.y = e.clientY
      modelGroup.rotation.y += dx * ROTATE_SPEED
      modelGroup.rotation.x += dy * ROTATE_SPEED
      velocity.x = dx * ROTATE_SPEED
      velocity.y = dy * ROTATE_SPEED
    }

    if (props.enableMouseParallax && modelGroup) {
      const nx = (e.clientX / window.innerWidth) * 2 - 1
      const ny = (e.clientY / window.innerHeight) * 2 - 1
      targetParallax.x = -nx * PARALLAX_MAG
      targetParallax.y = -ny * PARALLAX_MAG
    }

    if (props.enableHoverRotation && modelGroup) {
      const nx = (e.clientX / window.innerWidth) * 2 - 1
      const ny = (e.clientY / window.innerHeight) * 2 - 1
      targetHover.x = ny * HOVER_MAG
      targetHover.y = nx * HOVER_MAG
    }
  }

  const handlePointerUp = () => {
    isDragging = false
  }

  const handleWheel = (e: WheelEvent) => {
    if (!props.enableManualZoom || !camera) return
    e.preventDefault()
    const zoom = camera.position.z + e.deltaY * 0.01
    camera.position.z = THREE.MathUtils.clamp(zoom, props.minZoomDistance, props.maxZoomDistance)
  }

  canvas.addEventListener('pointerdown', handlePointerDown)
  window.addEventListener('pointermove', handlePointerMove)
  window.addEventListener('pointerup', handlePointerUp)
  canvas.addEventListener('wheel', handleWheel, { passive: false })

  const handleResize = () => {
    const cw = container.clientWidth
    const ch = container.clientHeight
    renderer!.setSize(cw, ch)
    if (camera) {
      camera.aspect = cw / ch
      camera.updateProjectionMatrix()
    }
  }
  window.addEventListener('resize', handleResize)

  const animate = (time: number) => {
    animationId = requestAnimationFrame(animate)

    if (modelGroup) {
      if (props.autoRotate) {
        modelGroup.rotation.y += props.autoRotateSpeed * 0.016
      }

      // Inertia
      modelGroup.rotation.y += velocity.x
      modelGroup.rotation.x += velocity.y
      velocity.x *= INERTIA
      velocity.y *= INERTIA

      // Parallax
      currentParallax.x += (targetParallax.x - currentParallax.x) * PARALLAX_EASE
      currentParallax.y += (targetParallax.y - currentParallax.y) * PARALLAX_EASE

      // Hover rotation
      const prevHovX = currentHover.x
      const prevHovY = currentHover.y
      currentHover.x += (targetHover.x - currentHover.x) * HOVER_EASE
      currentHover.y += (targetHover.y - currentHover.y) * HOVER_EASE
      modelGroup.rotation.x += currentHover.x - prevHovX
      modelGroup.rotation.y += currentHover.y - prevHovY

      // Parallax offset
      modelGroup.position.x = props.modelXOffset + currentParallax.x
      modelGroup.position.y = props.modelYOffset + currentParallax.y
    }

    renderer!.render(scene!, camera!)
  }
  animationId = requestAnimationFrame(animate)
})

function takeScreenshot() {
  if (!renderer || !scene || !camera) return
  renderer.render(scene, camera)
  const link = document.createElement('a')
  link.download = 'model.png'
  link.href = renderer.domElement.toDataURL('image/png')
  link.click()
}

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  if (renderer) {
    renderer.dispose()
    renderer.forceContextLoss()
  }
})
</script>

<style scoped>
.model-viewer-container {
  position: relative;
  overflow: hidden;
  touch-action: pan-y pinch-zoom;
}
.model-viewer-canvas {
  display: block;
  width: 100%;
  height: 100%;
}
.model-viewer-screenshot {
  position: absolute;
  border: 1px solid #fff;
  right: 16px;
  top: 16px;
  z-index: 10;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 10px;
  background: rgba(0,0,0,0.3);
  color: white;
}
</style>
