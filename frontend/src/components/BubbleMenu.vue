<template>
  <nav :class="containerClassName" :style="style" aria-label="Main navigation">
    <div class="bubble logo-bubble" aria-label="Logo" :style="{ background: menuBg }">
      <span class="logo-content">
        <img v-if="typeof logo === 'string'" :src="logo" alt="Logo" class="bubble-logo" />
        <component :is="logo" v-else />
      </span>
    </div>

    <button
      type="button"
      :class="['bubble toggle-bubble menu-btn', { open: isMenuOpen }]"
      @click="handleToggle"
      :aria-label="menuAriaLabel"
      :aria-pressed="isMenuOpen"
      :style="{ background: menuBg }"
    >
      <span class="menu-line" :style="{ background: menuContentColor }" />
      <span class="menu-line short" :style="{ background: menuContentColor }" />
    </button>
  </nav>

  <div v-if="showOverlay" :class="['bubble-menu-items', useFixedPosition ? 'fixed' : 'absolute']" :aria-hidden="!isMenuOpen" ref="overlayRef">
    <ul class="pill-list" role="menu" aria-label="Menu links">
      <li v-for="(item, idx) in menuItems" :key="idx" role="none" class="pill-col">
        <a
          role="menuitem"
          :href="item.href"
          :aria-label="item.ariaLabel || item.label"
          class="pill-link"
          :style="getPillStyle(item)"
          :ref="el => { if (el) bubblesRef[idx] = el }"
        >
          <span class="pill-label" :ref="el => { if (el) labelRefs[idx] = el }">
            {{ item.label }}
          </span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'

const props = defineProps({
  logo: { type: [String, Object], default: '' },
  className: { type: String, default: '' },
  style: { type: Object, default: () => ({}) },
  menuAriaLabel: { type: String, default: 'Toggle menu' },
  menuBg: { type: String, default: '#fff' },
  menuContentColor: { type: String, default: '#111' },
  useFixedPosition: { type: Boolean, default: false },
  items: { type: Array, default: null },
  animationEase: { type: String, default: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
  animationDuration: { type: Number, default: 500 },
  staggerDelay: { type: Number, default: 120 },
})

const emit = defineEmits(['menuClick'])

const isMenuOpen = ref(false)
const showOverlay = ref(false)
const overlayRef = ref(null)
const bubblesRef = reactive([])
const labelRefs = reactive([])

const defaultItems = [
  { label: 'home', href: '#', rotation: -8, hoverStyles: { bgColor: '#3b82f6', textColor: '#ffffff' } },
  { label: 'about', href: '#', rotation: 8, hoverStyles: { bgColor: '#10b981', textColor: '#ffffff' } },
  { label: 'projects', href: '#', rotation: 8, hoverStyles: { bgColor: '#f59e0b', textColor: '#ffffff' } },
  { label: 'blog', href: '#', rotation: 8, hoverStyles: { bgColor: '#ef4444', textColor: '#ffffff' } },
  { label: 'contact', href: '#', rotation: -8, hoverStyles: { bgColor: '#8b5cf6', textColor: '#ffffff' } },
]

const menuItems = computed(() => (props.items && props.items.length) ? props.items : defaultItems)

const containerClassName = computed(() => {
  return ['bubble-menu', props.useFixedPosition ? 'fixed' : 'absolute', props.className].filter(Boolean).join(' ')
})

function getPillStyle(item) {
  return {
    '--item-rot': (item.rotation ?? 0) + 'deg',
    '--pill-bg': props.menuBg,
    '--pill-color': props.menuContentColor,
    '--hover-bg': item.hoverStyles?.bgColor || '#f3f4f6',
    '--hover-color': item.hoverStyles?.textColor || props.menuContentColor,
  }
}

function handleToggle() {
  const nextState = !isMenuOpen.value
  if (nextState) showOverlay.value = true
  isMenuOpen.value = nextState
  emit('menuClick', nextState)
}

watch(isMenuOpen, (open) => {
  if (!showOverlay.value) return

  const bubbles = bubblesRef.filter(Boolean)
  const labels = labelRefs.filter(Boolean)

  if (open) {
    bubbles.forEach((bubble, i) => {
      const delay = i * props.staggerDelay + (Math.random() - 0.5) * 50
      bubble.style.transition = `transform ${props.animationDuration}ms ${props.animationEase} ${delay}ms`
      bubble.style.transform = 'scale(1) rotate(var(--item-rot, 0deg))'

      if (labels[i]) {
        labels[i].style.transition = `transform ${props.animationDuration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, opacity ${props.animationDuration}ms ease ${delay}ms`
        labels[i].style.transform = 'translateY(0)'
        labels[i].style.opacity = '1'
      }
    })
  } else {
    labels.forEach(label => {
      label.style.transition = 'transform 200ms cubic-bezier(0.55, 0, 1, 0.45), opacity 200ms ease'
      label.style.transform = 'translateY(24px)'
      label.style.opacity = '0'
    })
    bubbles.forEach((bubble, i) => {
      bubble.style.transition = `transform 200ms cubic-bezier(0.55, 0, 1, 0.45) ${i * 30}ms`
      bubble.style.transform = 'scale(0)'
    })

    setTimeout(() => {
      showOverlay.value = false
    }, 300)
  }
})

// Handle resize to update rotation
function handleResize() {
  if (!isMenuOpen.value) return
  const isDesktop = window.innerWidth >= 900
  bubblesRef.filter(Boolean).forEach((bubble, i) => {
    const item = menuItems.value[i]
    if (bubble && item) {
      const rot = isDesktop ? (item.rotation ?? 0) : 0
      bubble.style.setProperty('--item-rot', rot + 'deg')
    }
  })
}

onMounted(async () => {
  await nextTick()
  // Set initial state - all bubbles hidden
  bubblesRef.filter(Boolean).forEach(bubble => {
    bubble.style.transform = 'scale(0)'
    bubble.style.transition = 'none'
  })
  labelRefs.filter(Boolean).forEach(label => {
    label.style.transform = 'translateY(24px)'
    label.style.opacity = '0'
  })

  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.bubble-menu {
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 100;
}
.bubble-menu.absolute { position: absolute; top: 20px; right: 20px; }
.bubble-menu.fixed { position: fixed; top: 20px; right: 20px; }
.bubble {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: background 0.3s;
}
.logo-bubble { pointer-events: none; }
.logo-content { display: flex; align-items: center; justify-content: center; }
.bubble-logo { width: 24px; height: 24px; border-radius: 50%; }
.toggle-bubble {
  border: none;
  flex-direction: column;
  gap: 4px;
}
.menu-line {
  display: block;
  width: 16px;
  height: 2px;
  border-radius: 1px;
  transition: transform 0.3s;
}
.menu-line.short { width: 10px; align-self: center; }
.bubble-menu-items {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99;
  background: rgba(0,0,0,0.3);
  backdrop-filter: blur(4px);
}
.bubble-menu-items.absolute {
  position: absolute;
}
.pill-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.pill-col {
  display: flex;
  align-items: center;
  justify-content: center;
}
.pill-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 32px;
  border-radius: 999px;
  background: var(--pill-bg);
  color: var(--pill-color);
  text-decoration: none;
  font-size: 18px;
  font-weight: 600;
  transform: scale(0);
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.3s, color 0.3s;
  cursor: pointer;
  rotate: var(--item-rot, 0deg);
}
.pill-link:hover {
  background: var(--hover-bg);
  color: var(--hover-color);
}
.pill-label {
  display: block;
  transform: translateY(24px);
  opacity: 0;
  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease;
}
@media (max-width: 899px) {
  .pill-link {
    font-size: 16px;
    padding: 10px 24px;
    --item-rot: 0deg !important;
  }
}
</style>
