import { ref } from 'vue';

// 全局共享的 toast 列表
const toasts = ref([]);
let toastId = 0;

/**
 * Toast 通知 composable
 * 统一管理所有页面的 Toast 通知
 */
export function useToast() {
  const showToast = (message, type = 'info', duration = 4000) => {
    const id = ++toastId;
    toasts.value.push({ id, message, type });
    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id) => {
    const index = toasts.value.findIndex((t) => t.id === id);
    if (index > -1) {
      toasts.value.splice(index, 1);
    }
  };

  const clearAll = () => {
    toasts.value = [];
  };

  return {
    toasts,
    showToast,
    removeToast,
    clearAll,
  };
}
