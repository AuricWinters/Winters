<script setup>
import { computed, onMounted } from 'vue'
import { useEffectStore } from '../stores/effects.ts'
import { useClickSpark } from '../composables/useClickSpark.ts'

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
