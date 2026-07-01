import { computed, ComputedRef } from 'vue';
import { useSettingsStore } from '../stores/settings.ts';
import zhCN from '../locales/zh-CN.ts';
import zhTW from '../locales/zh-TW.ts';
import enUS from '../locales/en-US.ts';

const locales: Record<string, any> = { 'zh-CN': zhCN, 'zh-TW': zhTW, 'en-US': enUS };

let singleton: { t: (text: string) => string; locale: ComputedRef<Record<string, any>> } | null = null;

export function useI18n(): { t: (text: string) => string; locale: ComputedRef<Record<string, any>> } {
  if (singleton) return singleton;

  const store = useSettingsStore();
  const locale: ComputedRef<Record<string, any>> = computed(() => locales[store.language] || zhCN);

  const t = (text: string): string => {
    const map: Record<string, any> = locale.value;
    return map[text] || text;
  };

  singleton = { t, locale };
  return singleton;
}
