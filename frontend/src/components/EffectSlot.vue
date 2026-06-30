<template>
  <component
    :is="componentName"
    v-bind="props"
  >
    <slot />
  </component>
</template>

<script setup>
import { computed } from 'vue'
import { useEffectStore } from '../stores/effects.js'

// -- 已经存在的组件 imports --
import ShinyText from './ShinyText.vue'
import GlitchText from './GlitchText.vue'
import GradientText from './GradientText.vue'
import StarBorder from './StarBorder.vue'
import GlareHover from './GlareHover.vue'
import DecayCard from './DecayCard.vue'
import BounceCards from './BounceCards.vue'
import AnimatedList from './AnimatedList.vue'
import CircularText from './CircularText.vue'

const props = defineProps({
  slot: { type: String, required: true }, // 槽位名
})

const store = useEffectStore()

const componentMap = {
  // heading
  shinyText: ShinyText,
  glitchText: GlitchText,
  gradientText: GradientText,
  // cardHover
  spotlight: { template: '<div v-spotlight><slot/></div>' },
  tilt: { template: '<div v-tilt><slot/></div>' },
  borderGlow: { template: '<div class="card-spotlight"><slot/></div>' },
  glareHover: GlareHover,
  // cardEntry
  bounceCards: BounceCards,
  blurReveal: { template: '<div class="blur-reveal-entry"><slot/></div>' },
  animatedList: AnimatedList,
  // buttonHover
  magnet: { template: '<div v-magnet><slot/></div>' },
  starBorder: StarBorder,
  // bgDecor - handled by dedicated components
  // textDecor
  circularText: CircularText,
  // Others return standard wrapper
}

const componentName = computed(() => {
  const value = store.slots[props.slot]
  const comp = componentMap[value]
  if (comp) return comp
  // Fallback: transparent wrapper
  return { template: '<slot/>' }
})
</script>
