import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useSettingsStore } from '../stores/settings.js';

export function useSettings() {
  const settingsStore = useSettingsStore();

  const language = computed(() => settingsStore.language);
  const theme = computed(() => settingsStore.theme);
  const darkMode = computed(() => settingsStore.darkMode);
  const animationEnabled = computed(() => settingsStore.animationEnabled);
  const fontSize = computed(() => settingsStore.fontSize);
  const customTheme = computed(() => settingsStore.customTheme);

  const isDarkMode = computed(() => {
    if (darkMode.value === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return darkMode.value === 'dark';
  });

  const isCustomTheme = computed(() => {
    return theme.value === 'pink-gold' || theme.value === 'blue-purple' || theme.value === 'custom';
  });

  const currentDarkMode = computed(() => {
    if (darkMode.value === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return darkMode.value;
  });

  const languageOptions = [
    { value: 'zh-CN', label: '中文' },
    { value: 'en-US', label: 'English' }
  ];

  const themeOptions = [
    { value: 'default', label: '默认', icon: 'system' },
    { value: 'pink-gold', label: '金粉色', icon: 'system' },
    { value: 'blue-purple', label: '蓝紫色', icon: 'system' },
    { value: 'green-teal', label: '青绿色', icon: 'system' },
    { value: 'orange-red', label: '橙红色', icon: 'system' },
    { value: 'purple-pink', label: '紫粉色', icon: 'system' },
    { value: 'custom', label: '自定义', icon: 'system' }
  ];

  const darkModeOptions = [
    { value: 'light', label: '浅色模式', icon: 'sun' },
    { value: 'dark', label: '深色模式', icon: 'moon' },
    { value: 'auto', label: '跟随系统', icon: 'system' }
  ];

  const fontSizeOptions = [
    { value: 'small', label: '小' },
    { value: 'medium', label: '中' },
    { value: 'large', label: '大' }
  ];

  let mediaQuery = null;

  const initSystemThemeListener = () => {
    mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (darkMode.value === 'auto') {
        settingsStore.applyTheme();
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  };

  let cleanupListener = null;

  onMounted(() => {
    cleanupListener = initSystemThemeListener();
  });

  onUnmounted(() => {
    if (cleanupListener) {
      cleanupListener();
    }
  });

  const setLanguage = (newLanguage) => {
    settingsStore.setLanguage(newLanguage);
  };

  const setTheme = (newTheme) => {
    settingsStore.setTheme(newTheme);
  };

  const setDarkMode = (newDarkMode) => {
    settingsStore.setDarkMode(newDarkMode);
  };

  const setAnimationEnabled = (enabled) => {
    settingsStore.setAnimationEnabled(enabled);
  };

  const setFontSize = (size) => {
    settingsStore.setFontSize(size);
  };

  const setCustomThemeMode = (mode) => {
    settingsStore.setCustomThemeMode(mode);
  };

  const setCustomThemeColor = (colorType, colorValue) => {
    settingsStore.setCustomThemeColor(colorType, colorValue);
  };

  const resetSettings = () => {
    settingsStore.resetToDefaults();
  };

  const toggleTheme = () => {
    const currentDarkModeValue = currentDarkMode.value;
    if (currentDarkModeValue === 'light') {
      setDarkMode('dark');
    } else if (currentDarkModeValue === 'dark') {
      setDarkMode('auto');
    } else {
      setDarkMode('light');
    }
  };

  return {
    language,
    theme,
    darkMode,
    animationEnabled,
    fontSize,
    isDarkMode,
    isCustomTheme,
    currentDarkMode,
    customTheme,
    languageOptions,
    themeOptions,
    darkModeOptions,
    fontSizeOptions,
    setLanguage,
    setTheme,
    setDarkMode,
    setAnimationEnabled,
    setFontSize,
    setCustomThemeMode,
    setCustomThemeColor,
    resetSettings,
    toggleTheme,
    initSystemThemeListener
  };
}