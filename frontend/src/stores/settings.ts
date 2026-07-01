import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { useUserStore } from './user';

type ThemeMigration = Record<string, string>;

interface CustomTheme {
  mode: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

interface Settings {
  language: string;
  theme: string;
  themeStyle: string;
  cornerStyle: string;
  darkMode: string;
  animationEnabled: boolean;
  fontSize: string;
  customTheme: CustomTheme;
}

const deepClone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

export const useSettingsStore = defineStore('settings', () => {
  const STORAGE_KEY = 'winters_settings';

  const themeMigration: ThemeMigration = {
    'default': 'journal',
    'pink-gold': 'sakura',
    'blue-purple': 'aurora',
    'green-teal': 'forest',
    'orange-red': 'twilight',
    'purple-pink': 'sakura'
  };

  // 公共基础默认值
  const baseDefaults = {
    language: 'zh-CN',
    cornerStyle: 'sharp' as const,
    darkMode: 'auto' as const,
    animationEnabled: true,
    fontSize: 'medium' as const,
    customTheme: {
      mode: 'single' as const,
      colors: {
        primary: '#C4737A',
        secondary: '#B8956A',
        accent: '#D4A0A7'
      }
    }
  };

  // 访客默认（未登录时展示）
  const guestDefaults: Settings = { ...baseDefaults, theme: 'journal', themeStyle: 'journal' };

  // 用户默认（已登录时展示）
  const userDefaults: Settings = { ...baseDefaults, theme: 'sakura', themeStyle: 'standard' };

  const resolveDefaults = (): Settings => {
    const userStore = useUserStore();
    return userStore.isLoggedIn ? userDefaults : guestDefaults;
  };

  const loadSettings = (): Settings => {
    const userStore = useUserStore();

    // 未登录 → 永远使用访客默认
    if (!userStore.isLoggedIn) {
      return deepClone(guestDefaults);
    }

    // 已登录 → 读取保存的设置，没有则用用户默认
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Settings;
        if (parsed.theme && themeMigration[parsed.theme]) {
          parsed.theme = themeMigration[parsed.theme];
        }
        for (const key of Object.keys(userDefaults)) {
          if (!(key in parsed)) {
            (parsed as any)[key] = deepClone((userDefaults as any)[key]);
          }
        }
        return parsed;
      }
    } catch (error) {
      console.warn('Failed to load settings:', error);
    }
    return deepClone(userDefaults);
  };

  const settings = loadSettings();
  const language = ref<string>(settings.language);
  const theme = ref<string>(settings.theme);
  const themeStyle = ref<string>(settings.themeStyle);
  const cornerStyle = ref<string>(settings.cornerStyle);
  const darkMode = ref<string>(settings.darkMode);
  const animationEnabled = ref<boolean>(settings.animationEnabled);
  const fontSize = ref<string>(settings.fontSize);
  const customTheme = ref<CustomTheme>(settings.customTheme);

  let saveTimer: ReturnType<typeof setTimeout> | null = null;
  const saveSettings = (): void => {
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          language: language.value,
          theme: theme.value,
          themeStyle: themeStyle.value,
          cornerStyle: cornerStyle.value,
          darkMode: darkMode.value,
          animationEnabled: animationEnabled.value,
          fontSize: fontSize.value,
          customTheme: customTheme.value
        }));
      } catch (error) {
        console.warn('Failed to save settings:', error);
      }
    }, 300);
  };

  const applyTheme = (): void => {
    let effectiveDarkMode: string = darkMode.value;
    if (darkMode.value === 'auto') {
      effectiveDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    const effectiveTheme: string = theme.value;

    document.documentElement.setAttribute('data-theme', effectiveDarkMode);
    document.documentElement.setAttribute('data-color-theme', effectiveTheme);

    document.documentElement.classList.remove(
      'light', 'dark',
      'journal', 'ink', 'aurora', 'sakura', 'forest', 'midnight', 'twilight', 'minimal', 'custom-theme'
    );

    if (effectiveDarkMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.add('light');
    }

    if (effectiveTheme !== 'journal') {
      const cls = effectiveTheme === 'custom' ? 'custom-theme' : effectiveTheme;
      document.documentElement.classList.add(cls);
    }
    if (effectiveTheme === 'custom') applyCustomTheme();
  };

  const applyCustomTheme = (): void => {
    const colors = customTheme.value.colors;
    document.documentElement.style.setProperty('--primary', colors.primary);
    document.documentElement.style.setProperty('--secondary', colors.secondary);
    document.documentElement.style.setProperty('--accent', colors.accent);
    document.documentElement.style.setProperty('--gold', colors.secondary);
  };

  const applyThemeStyle = (): void => {
    document.documentElement.setAttribute('data-theme-style', themeStyle.value);
    document.documentElement.setAttribute('data-corner-style', cornerStyle.value);
  };

  const applyAnimation = (): void => {
    if (animationEnabled.value) {
      document.documentElement.classList.remove('no-animation');
    } else {
      document.documentElement.classList.add('no-animation');
    }
  };

  const applyFontSize = (): void => {
    document.documentElement.setAttribute('data-font-size', fontSize.value);
    document.documentElement.classList.remove('font-small', 'font-medium', 'font-large');
    document.documentElement.classList.add(`font-${fontSize.value}`);
  };

  const applyAll = (): void => {
    applyTheme();
    applyThemeStyle();
    applyAnimation();
    applyFontSize();
  };

  watch([language, theme, themeStyle, cornerStyle, darkMode, animationEnabled, fontSize, customTheme], () => {
    saveSettings();
    applyAll();
  }, { immediate: true, deep: true });

  // 监听登录状态变化，自动切换访客/用户主题
  const userStore = useUserStore();
  watch(() => userStore.isLoggedIn, (loggedIn) => {
    const defaults = loggedIn ? userDefaults : guestDefaults;
    language.value = defaults.language;
    theme.value = defaults.theme;
    themeStyle.value = defaults.themeStyle;
    cornerStyle.value = defaults.cornerStyle;
    darkMode.value = defaults.darkMode;
    animationEnabled.value = defaults.animationEnabled;
    fontSize.value = defaults.fontSize;
    customTheme.value = deepClone(defaults.customTheme);
  });

  const setLanguage = (newLanguage: string): void => { language.value = newLanguage; };
  const setTheme = (newTheme: string): void => { theme.value = newTheme; };

  const setThemeStyle = (newStyle: string): void => {
    themeStyle.value = newStyle;
    cornerStyle.value = newStyle === 'journal' ? 'sharp' : 'rounded';
  };

  const setCornerStyle = (newStyle: string): void => { cornerStyle.value = newStyle; };
  const setDarkMode = (newDarkMode: string): void => { darkMode.value = newDarkMode; };
  const setAnimationEnabled = (enabled: boolean): void => { animationEnabled.value = enabled; };
  const setFontSize = (size: string): void => { fontSize.value = size; };
  const setCustomThemeMode = (mode: string): void => { customTheme.value.mode = mode; };

  const setCustomThemeColor = (colorType: string, colorValue: string): void => {
    customTheme.value.colors[colorType] = colorValue;
  };

  const resetToDefaults = (): void => {
    const fallback = resolveDefaults();
    language.value = fallback.language;
    theme.value = fallback.theme;
    themeStyle.value = fallback.themeStyle;
    cornerStyle.value = fallback.cornerStyle;
    darkMode.value = fallback.darkMode;
    animationEnabled.value = fallback.animationEnabled;
    fontSize.value = fallback.fontSize;
    customTheme.value = deepClone(fallback.customTheme);
  };

  const initThemeListener = (): (() => void) => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (): void => {
      if (darkMode.value === 'auto') applyTheme();
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  };

  return {
    language, theme, themeStyle, cornerStyle, darkMode, animationEnabled, fontSize, customTheme,
    setLanguage, setTheme, setThemeStyle, setCornerStyle, setDarkMode,
    setAnimationEnabled, setFontSize, setCustomThemeMode, setCustomThemeColor,
    resetToDefaults, applyTheme, applyThemeStyle, applyAnimation, applyFontSize, applyCustomTheme,
    initThemeListener
  };
});
