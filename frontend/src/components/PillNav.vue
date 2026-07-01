<template>
  <div class="pill-nav-container">
    <nav
      :class="['pill-nav', className]"
      aria-label="Primary"
      :style="cssVars"
    >
      <a
        class="pill-logo"
        href="#"
        aria-label="Home"
        @mouseenter="handleLogoEnter"
      >
        <img
          ref="logoImgRef"
          :src="logo"
          :alt="logoAlt"
        >
      </a>

      <div
        ref="navItemsRef"
        class="pill-nav-items desktop-only"
      >
        <ul
          class="pill-list"
          role="menubar"
        >
          <li
            v-for="(item, i) in items"
            :key="(item as any).href"
            role="none"
          >
            <a
              role="menuitem"
              :href="(item as any).href"
              :class="['pill', { 'is-active': activeHref === (item as any).href }]"
              :aria-label="(item as any).ariaLabel || (item as any).label"
              @mouseenter="handleEnter(i)"
              @mouseleave="handleLeave(i)"
            >
              <span
                :ref="el => { if (el) circleRefs[i] = el }"
                class="hover-circle"
                aria-hidden="true"
              />
              <span class="label-stack">
                <span class="pill-label">{{ (item as any).label }}</span>
                <span
                  class="pill-label-hover"
                  aria-hidden="true"
                >{{ (item as any).label }}</span>
              </span>
            </a>
          </li>
        </ul>
      </div>

      <button
        ref="hamburgerRef"
        class="mobile-menu-button mobile-only"
        aria-label="Toggle menu"
        @click="toggleMobileMenu"
      >
        <span class="hamburger-line" />
        <span class="hamburger-line" />
      </button>
    </nav>

    <div
      v-show="isMobileMenuOpen"
      ref="mobileMenuRef"
      class="mobile-menu-popover mobile-only"
      :style="cssVars"
    >
      <ul class="mobile-menu-list">
        <li
          v-for="item in items"
          :key="(item as any).href"
        >
          <a
            :href="(item as any).href"
            :class="['mobile-menu-link', { 'is-active': activeHref === (item as any).href }]"
            @click="isMobileMenuOpen = false"
          >
            {{ (item as any).label }}
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  logo: { type: String, default: '' },
  logoAlt: { type: String, default: 'Logo' },
  items: { type: Array, default: () => [] },
  activeHref: { type: String, default: '' },
  className: { type: String, default: '' },
  baseColor: { type: String, default: '#fff' },
  pillColor: { type: String, default: '#120F17' },
  hoveredPillTextColor: { type: String, default: '#120F17' },
  pillTextColor: { type: String, default: '' },
})

const emit = defineEmits(['mobileMenuClick'])
const isMobileMenuOpen = ref(false)
const logoImgRef = ref(null)
const hamburgerRef = ref(null)
const mobileMenuRef = ref(null)
const navItemsRef = ref(null)
const circleRefs = reactive([])

const resolvedPillTextColor = computed(() => props.pillTextColor || props.baseColor)

const cssVars = computed(() => ({
  '--base': props.baseColor,
  '--pill-bg': props.pillColor,
  '--hover-text': props.hoveredPillTextColor,
  '--pill-text': resolvedPillTextColor.value,
}))

function handleEnter(i) {
  const circle = circleRefs[i]
  if (!circle) return
  const pill = circle.parentElement
  if (!pill) return

  const rect = pill.getBoundingClientRect()
  const w = rect.width
  const h = rect.height
  const R = ((w * w) / 4 + h * h) / (2 * h)
  const D = Math.ceil(2 * R) + 2
  const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1

  circle.style.width = D + 'px'
  circle.style.height = D + 'px'
  circle.style.bottom = -delta + 'px'
  circle.style.transition = 'none'
  circle.style.transform = 'translateX(-50%) scale(0)'

  requestAnimationFrame(() => {
    circle.style.transition = 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)'
    circle.style.transform = 'translateX(-50%) scale(1.2)'
  })

  const label = pill.querySelector('.pill-label')
  const hoverLabel = pill.querySelector('.pill-label-hover')
  if (label) {
    label.style.transition = 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)'
    label.style.transform = `translateY(${-(h + 8)}px)`
  }
  if (hoverLabel) {
    hoverLabel.style.transition = 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.6s ease'
    hoverLabel.style.transform = 'translateY(0)'
    hoverLabel.style.opacity = '1'
  }
}

function handleLeave(i) {
  const circle = circleRefs[i]
  if (!circle) return
  circle.style.transition = 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)'
  circle.style.transform = 'translateX(-50%) scale(0)'

  const pill = circle.parentElement
  if (!pill) return
  const h = pill.getBoundingClientRect().height
  const label = pill.querySelector('.pill-label')
  const hoverLabel = pill.querySelector('.pill-label-hover')
  if (label) {
    label.style.transition = 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)'
    label.style.transform = 'translateY(0)'
  }
  if (hoverLabel) {
    hoverLabel.style.transition = 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease'
    hoverLabel.style.transform = `translateY(${h + 12}px)`
    hoverLabel.style.opacity = '0'
  }
}

function handleLogoEnter() {
  const img = logoImgRef.value
  if (!img) return
  img.style.transition = 'transform 0.2s ease'
  img.style.transform = 'rotate(360deg)'
}

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  const hamburger = hamburgerRef.value
  if (hamburger) {
    const lines = hamburger.querySelectorAll('.hamburger-line')
    if (isMobileMenuOpen.value) {
      lines[0].style.transform = 'rotate(45deg) translateY(3px)'
      lines[1].style.transform = 'rotate(-45deg) translateY(-3px)'
    } else {
      lines[0].style.transform = 'none'
      lines[1].style.transform = 'none'
    }
  }
  emit('mobileMenuClick')
}
</script>

<style scoped>
.pill-nav-container {
  position: relative;
  font-family: inherit;
}
.pill-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  height: 64px;
}
.pill-logo {
  display: flex;
  align-items: center;
  color: var(--base);
  text-decoration: none;
}
.pill-logo img {
  height: 28px;
  width: auto;
}
.pill-nav-items {
  display: flex;
}
.pill-list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 4px;
}
.pill {
  position: relative;
  display: inline-flex;
  align-items: center;
  padding: 8px 20px;
  border-radius: 999px;
  color: var(--pill-text);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  overflow: hidden;
  transition: color 0.3s;
  cursor: pointer;
}
.pill:hover {
  color: var(--hover-text);
}
.hover-circle {
  position: absolute;
  left: 50%;
  border-radius: 50%;
  background: var(--pill-bg);
  z-index: 0;
  transform: translateX(-50%) scale(0);
  transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  pointer-events: none;
}
.label-stack {
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
  overflow: hidden;
}
.pill-label, .pill-label-hover {
  display: block;
  transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s;
}
.pill-label-hover {
  opacity: 0;
  transform: translateY(100%);
  position: absolute;
  left: 0;
}
.mobile-menu-button {
  display: none;
  flex-direction: column;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
}
.hamburger-line {
  display: block;
  width: 24px;
  height: 2px;
  background: var(--base);
  transition: transform 0.3s;
}
.mobile-menu-popover {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--pill-bg);
  padding: 16px;
  z-index: 100;
  border-radius: 0 0 12px 12px;
}
.mobile-menu-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.mobile-menu-link {
  display: block;
  padding: 12px 16px;
  color: var(--base);
  text-decoration: none;
  border-radius: 8px;
}
.mobile-menu-link.is-active {
  background: rgba(255,255,255,0.1);
}
@media (max-width: 768px) {
  .desktop-only { display: none; }
  .mobile-only { display: flex; }
  .mobile-menu-button { display: flex; }
}
@media (min-width: 769px) {
  .mobile-only { display: none; }
  .desktop-only { display: flex; }
}
</style>
