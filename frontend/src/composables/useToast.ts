import { ref, Ref } from 'vue';

export interface ToastItem {
  id: number;
  message: string;
  type: string;
}

interface UseToastReturn {
  toasts: Ref<ToastItem[]>;
  showToast: (message: string, type?: string, duration?: number) => void;
  removeToast: (id: number) => void;
  clearAll: () => void;
}

const toasts: Ref<ToastItem[]> = ref([]);
let toastId: number = 0;

export function useToast(): UseToastReturn {
  const showToast = (message: string, type: string = 'info', duration: number = 4000): void => {
    const id: number = ++toastId;
    toasts.value.push({ id, message, type });
    setTimeout((): void => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id: number): void => {
    const index: number = toasts.value.findIndex((t: ToastItem) => t.id === id);
    if (index > -1) {
      toasts.value.splice(index, 1);
    }
  };

  const clearAll = (): void => {
    toasts.value = [];
  };

  return {
    toasts,
    showToast,
    removeToast,
    clearAll,
  };
}
