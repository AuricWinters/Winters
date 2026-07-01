<template>
  <ShinyText
    v-if="slot === 'shinyText'"
    :text="text"
  />
  <GradientText
    v-else-if="slot === 'gradientText'"
    :text="text"
  />
  <GlitchText
    v-else-if="slot === 'glitchText'"
    :text="text"
  />
  <span v-else>{{ text }}</span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useEffectStore } from '../stores/effects.ts'
import ShinyText from './ShinyText.vue'
import GradientText from './GradientText.vue'
import GlitchText from './GlitchText.vue'

const props = defineProps({ text: String })
const store = useEffectStore()
const slot = computed(() => store.slots.heading)
</script>
