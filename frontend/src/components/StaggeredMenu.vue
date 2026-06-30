<template>
  <div
    :class="wrapperClasses"
    :style="accentColor ? { '--sm-accent': accentColor } : undefined"
    :data-position="position"
    :data-open="isOpen || undefined"
  >
    <div
      ref="preLayersRef"
      class="sm-prelayers"
      aria-hidden="true"
    >
      <div
        v-for="(c, i) in preLayerColors"
        :key="i"
        class="sm-prelayer"
        :style="{ background: c }"
      />
    </div>

    <header
      class="staggered-menu-header"
      aria-label="Main navigation header"
    >
      <div
        class="sm-logo"
        aria-label="Logo"
      >
        <img
          :src="logoUrl"
          alt="Logo"
          class="sm-logo-img"
          draggable="false"
          width="110"
          height="24"
        >
      </div>

      <button
        ref="toggleBtnRef"
        class="sm-toggle"
        :aria-label="isOpen ? 'Close menu' : 'Open menu'"
        :aria-expanded="isOpen"
        type="button"
        @click="toggleMenu"
      >
        <span
          ref="textWrapRef"
          class="sm-toggle-textWrap"
          aria-hidden="true"
        >
          <span
            ref="textInnerRef"
            class="sm-toggle-textInner"
            :style="{ transform: `translateY(${-textShift}%)` }"
          >
            <span
              v-for="(line, i) in textLines"
              :key="i"
              class="sm-toggle-line"
            >{{ line }}</span>
          </span>
        </span>
        <span
          ref="iconRef"
          class="sm-icon"
          aria-hidden="true"
          :style="{ transform: `rotate(${iconRotate}deg)` }"
        >
          <span
            ref="plusHRef"
            class="sm-icon-line"
          />
          <span
            ref="plusVRef"
            class="sm-icon-line sm-icon-line-v"
            :style="{ transform: `rotate(${plusVRotate}deg)` }"
          />
        </span>
      </button>
    </header>

    <aside
      ref="panelRef"
      class="staggered-menu-panel"
      :aria-hidden="!isOpen"
      :style="panelStyle"
    >
      <div class="sm-panel-inner">
        <ul
          class="sm-panel-list"
          role="list"
          :data-numbering="displayItemNumbering || undefined"
        >
          <li
            v-for="(it, idx) in displayItems"
            :key="it.label + idx"
            class="sm-panel-itemWrap"
          >
            <a
              class="sm-panel-item"
              :href="it.link"
              :aria-label="it.ariaLabel"
              :data-index="idx + 1"
            >
              <span
                class="sm-panel-itemLabel"
                :style="getItemLabelStyle(idx)"
              >{{ it.label }}</span>
            </a>
          </li>
        </ul>

        <div
          v-if="displaySocials && socialItems.length"
          class="sm-socials"
          aria-label="Social links"
        >
          <h3
            class="sm-socials-title"
            :style="{ opacity: socialOpacity }"
          >
            Socials
          </h3>
          <ul
            class="sm-socials-list"
            role="list"
          >
            <li
              v-for="(s, i) in socialItems"
              :key="s.label + i"
              class="sm-socials-item"
            >
              <a
                :href="s.link"
                target="_blank"
                rel="noopener noreferrer"
                class="sm-socials-link"
                :style="{ transform: `translateY(${socialLinkOffsets[i]}px)`, opacity: socialOpacities[i] }"
              >
                {{ s.label }}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  position: { type: String, default: 'right' },
  colors: { type: Array, default: () => ['#B497CF', '#5227FF'] },
  items: { type: Array, default: () => [] },
  socialItems: { type: Array, default: () => [] },
  displaySocials: { type: Boolean, default: true },
  displayItemNumbering: { type: Boolean, default: true },
  className: { type: String, default: '' },
  logoUrl: { type: String, default: '' },
  menuButtonColor: { type: String, default: '#fff' },
  openMenuButtonColor: { type: String, default: '#fff' },
  accentColor: { type: String, default: '#5227FF' },
  changeMenuColorOnOpen: { type: Boolean, default: true },
  closeOnClickAway: { type: Boolean, default: true },
  isFixed: { type: Boolean, default: false },
})

const emit = defineEmits(['menuOpen', 'menuClose'])
const isOpen = ref(false)
const panelRef = ref(null)
const toggleBtnRef = ref(null)
const preLayersRef = ref(null)
const textInnerRef = ref(null)
const iconRef = ref(null)
const textLines = ref(['Menu', 'Close'])
const textShift = ref(0)
const iconRotate = ref(0)
const plusVRotate = ref(90)
const panelOffset = ref(100)
const socialOpacity = ref(0)
const socialLinkOffsets = reactive([25, 25, 25])
const socialOpacities = reactive([0, 0, 0])
const itemOffsets = reactive([])
const itemRotations = reactive([])
const preLayerColors = computed(() => {
  const raw = props.colors && props.colors.length ? props.colors.slice(0, 4) : ['#1e1e22', '#35353c']
  let arr = [...raw]
  if (arr.length >= 3) {
    const mid = Math.floor(arr.length / 2)
    arr.splice(mid, 1)
  }
  return arr
})

const displayItems = computed(() => props.items.length ? props.items : [{ label: 'No items', ariaLabel: 'No items', link: '#' }])

const wrapperClasses = computed(() => {
  return [(props.className || ''), 'staggered-menu-wrapper', props.isFixed ? 'fixed-wrapper' : ''].filter(Boolean).join(' ')
})

const panelStyle = computed(() => ({
  transform: `translateX(${panelOffset.value}%)`,
  transition: isOpen.value ? 'transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)' : 'transform 0.32s cubic-bezier(0.55, 0, 1, 0.45)',
}))

function getItemLabelStyle(idx) {
  return {
    transform: `translateY(${itemOffsets[idx] || 140}%) rotate(${itemRotations[idx] || 10}deg)`,
    transition: isOpen.value ? 'transform 1s cubic-bezier(0.22, 1, 0.36, 1)' : 'none',
  }
}

function toggleMenu() {
  const target = !isOpen.value
  isOpen.value = target

  if (target) {
    emit('menuOpen')
    const offscreen = props.position === 'left' ? -100 : 100

    // Animate pre-layers
    const layers = preLayersRef.value?.querySelectorAll('.sm-prelayer') || []
    layers.forEach((layer, i) => {
      setTimeout(() => {
        layer.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)'
        layer.style.transform = 'translateX(0%)'
      }, i * 70)
    })

    // Animate panel
    setTimeout(() => {
      panelOffset.value = 0
    }, layers.length * 70 + 80)

    // Animate items
    setTimeout(() => {
      const count = displayItems.value.length
      displayItems.value.forEach((_, i) => {
        setTimeout(() => {
          itemOffsets[i] = 0
          itemRotations[i] = 0
        }, i * 100)
      })
    }, 500)

    // Animate socials
    setTimeout(() => {
      socialOpacity.value = 1
      socialLinkOffsets.forEach((_, i) => {
        setTimeout(() => {
          socialLinkOffsets[i] = 0
          socialOpacities[i] = 1
        }, i * 80)
      })
    }, 700)

    // Icon
    iconRotate.value = 225
    if (textInnerRef.value) {
      textShift.value = ((3 - 1) / 3) * 100
    }
    if (toggleBtnRef.value && props.changeMenuColorOnOpen) {
      toggleBtnRef.value.style.color = props.openMenuButtonColor
    }
  } else {
    emit('menuClose')
    panelOffset.value = props.position === 'left' ? -100 : 100

    const layers = preLayersRef.value?.querySelectorAll('.sm-prelayer') || []
    layers.forEach(layer => {
      layer.style.transition = 'transform 0.32s cubic-bezier(0.55, 0, 1, 0.45)'
      layer.style.transform = `translateX(${props.position === 'left' ? -100 : 100}%)`
    })

    displayItems.value.forEach((_, i) => {
      itemOffsets[i] = 140
      itemRotations[i] = 10
    })
    socialOpacity.value = 0
    socialLinkOffsets.forEach((_, i) => {
      socialLinkOffsets[i] = 25
      socialOpacities[i] = 0
    })

    iconRotate.value = 0
    if (textInnerRef.value) textShift.value = 0
    if (toggleBtnRef.value && props.changeMenuColorOnOpen) {
      toggleBtnRef.value.style.color = props.menuButtonColor
    }
  }
}

onMounted(async () => {
  await nextTick()
  const offscreen = props.position === 'left' ? -100 : 100

  // Set initial state
  const layers = preLayersRef.value?.querySelectorAll('.sm-prelayer') || []
  layers.forEach(layer => {
    layer.style.transform = `translateX(${offscreen}%)`
  })
  panelOffset.value = offscreen

  displayItems.value.forEach((_, i) => {
    itemOffsets[i] = 140
    itemRotations[i] = 10
  })

  if (toggleBtnRef.value) {
    toggleBtnRef.value.style.color = props.menuButtonColor
  }

  // Close on click outside
  if (props.closeOnClickAway) {
    const handler = (e) => {
      if (isOpen.value && panelRef.value && !panelRef.value.contains(e.target) && toggleBtnRef.value && !toggleBtnRef.value.contains(e.target)) {
        toggleMenu()
      }
    }
    document.addEventListener('mousedown', handler)
  }
})
</script>

<style scoped>
.staggered-menu-wrapper {
  position: relative;
  --sm-accent: #5227FF;
}
.fixed-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}
.sm-prelayers {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}
.sm-prelayer {
  position: absolute;
  inset: 0;
  will-change: transform;
}
.staggered-menu-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  z-index: 3;
}
.sm-logo {
  display: flex;
  align-items: center;
}
.sm-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  transition: color 0.3s;
}
.sm-toggle-textWrap {
  overflow: hidden;
  height: 20px;
  display: block;
}
.sm-toggle-textInner {
  display: block;
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}
.sm-toggle-line {
  display: block;
  height: 20px;
  line-height: 20px;
}
.sm-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
}
.sm-icon-line {
  display: block;
  width: 100%;
  height: 2px;
  background: currentColor;
  position: absolute;
  transition: transform 0.3s;
}
.sm-icon-line-v {
  transform: rotate(90deg);
}
.staggered-menu-panel {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  background: rgba(0,0,0,0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  will-change: transform;
}
.sm-panel-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
}
.sm-panel-list {
  list-style: none;
  margin: 0;
  padding: 0;
  text-align: center;
}
.sm-panel-itemLabel {
  display: inline-block;
  font-size: 48px;
  font-weight: 700;
  color: #fff;
  text-decoration: none;
  will-change: transform;
  transition: transform 1s cubic-bezier(0.22, 1, 0.36, 1);
}
@media (max-width: 768px) {
  .sm-panel-itemLabel {
    font-size: 32px;
  }
}
.sm-panel-item {
  text-decoration: none;
}
.sm-socials {
  text-align: center;
  transition: opacity 0.5s ease;
}
.sm-socials-title {
  color: #999;
  font-size: 14px;
  margin: 0 0 12px;
  font-weight: 400;
  transition: opacity 0.5s ease;
}
.sm-socials-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  gap: 16px;
}
.sm-socials-link {
  color: #666;
  text-decoration: none;
  font-size: 14px;
  transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.55s ease;
}
.sm-socials-link:hover {
  color: var(--sm-accent);
}
</style>
