<template>
  <TransitionGroup
    name="toast"
    tag="div"
    class="toast-container"
  >
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="toast"
      :class="toast.type"
    >
      <div class="toast-icon">
        <svg
          v-if="toast.type === 'success'"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            d="M22 11.08V12a10 10 0 1 1-5.93-9.14"
            stroke-width="2"
          />
          <polyline
            points="22 4 12 14.01 9 11.01"
            stroke-width="2"
          />
        </svg>
        <svg
          v-else-if="toast.type === 'error'"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke-width="2"
          />
          <line
            x1="15"
            y1="9"
            x2="9"
            y2="15"
            stroke-width="2"
          />
          <line
            x1="9"
            y1="9"
            x2="15"
            y2="15"
            stroke-width="2"
          />
        </svg>
        <svg
          v-else
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke-width="2"
          />
          <line
            x1="12"
            y1="16"
            x2="12"
            y2="12"
            stroke-width="2"
          />
          <line
            x1="12"
            y1="8"
            x2="12.01"
            y2="8"
            stroke-width="2"
          />
        </svg>
      </div>
      <span class="toast-message">{{ toast.message }}</span>
      <button
        class="toast-close"
        @click="removeToast(toast.id)"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <line
            x1="18"
            y1="6"
            x2="6"
            y2="18"
            stroke-width="2"
          />
          <line
            x1="6"
            y1="6"
            x2="18"
            y2="18"
            stroke-width="2"
          />
        </svg>
      </button>
    </div>
  </TransitionGroup>
</template>

<script setup>
import { useToast } from '../composables/useToast.ts';

const { toasts, removeToast } = useToast();
</script>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.toast {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: white;
  border-radius: 14px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  min-width: 300px;
  max-width: 400px;
  border-left: 4px solid;
}

.toast.success {
  border-left-color: #10b981;
}

.toast.error {
  border-left-color: #ef4444;
}

.toast.info {
  border-left-color: #EC4899;
}

.toast-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.toast-icon svg {
  width: 100%;
  height: 100%;
}

.toast.success .toast-icon {
  color: #10b981;
}

.toast.error .toast-icon {
  color: #ef4444;
}

.toast.info .toast-icon {
  color: #EC4899;
}

.toast-message {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
}

.toast-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #94a3b8;
  transition: color 0.2s ease;
  flex-shrink: 0;
}

.toast-close:hover {
  color: #64748b;
}

.toast-close svg {
  width: 16px;
  height: 16px;
}

/* Toast 动画 */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

@media (max-width: 480px) {
  .toast-container {
    left: 16px;
    right: 16px;
    bottom: 16px;
  }

  .toast {
    min-width: auto;
    max-width: none;
  }
}
</style>
