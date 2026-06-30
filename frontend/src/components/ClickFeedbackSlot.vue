<script setup>
import { computed, onMounted } from 'vue'
import { useEffectStore } from '../stores/effects.js'
import { useClickSpark } from '../composables/useClickSpark.js'

const store = useEffectStore()
const effect = computed(() => store.slots.clickFeedback)

onMounted(() => {
  if (effect.value === 'clickSpark') {
    useClickSpark()
  }
})
</script>

<template>
  <slot />
</template>
