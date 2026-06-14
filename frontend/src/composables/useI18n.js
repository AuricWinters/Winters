import { computed } from 'vue';
import { useSettingsStore } from '../stores/settings.js';
import zhCN from '../locales/zh-CN.js';
import zhTW from '../locales/zh-TW.js';
import enUS from '../locales/en-US.js';

const locales = { 'zh-CN': zhCN, 'zh-TW': zhTW, 'en-US': enUS };

let singleton = null;

export function useI18n() {
  if (singleton) return singleton;

  const store = useSettingsStore();
  const locale = computed(() => locales[store.language] || zhCN);

  const t = (text) => {
    const map = locale.value;
    return map[text] || text;
  };

  singleton = { t, locale };
  return singleton;
}
