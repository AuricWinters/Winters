<template>
  <div
    v-if="error"
    class="safe-error"
  >
    {{ error }}
  </div>
  <slot v-else />
</template>

<script setup>
import { ref, onErrorCaptured } from 'vue'
const error = ref('')
onErrorCaptured((err) => {
  error.value = err?.message?.substring(0, 40) || '渲染失败'
  return false
})
</script>

<style scoped>
.safe-error {
  font-size: 11px;
  color: #f87171;
  padding: 8px;
  text-align: center;
}
</style>
