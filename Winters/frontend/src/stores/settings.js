import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const useSettingsStore = defineStore('settings', () => {
  const STORAGE_KEY = 'winters_settings';

  const defaultSettings = {
    language: 'zh-CN',
    theme: 'default',
    darkMode: 'auto',
    animationEnabled: true,
    fontSize: 'medium',
    customTheme: {
      mode: 'single', // single, dual, triple
      colors: {
        primary: '#EC4899',
        secondary: '#F59E0B',
        accent: '#F472B6'
      }
    }
  };

  const loadSettings = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.warn('Failed to load settings:', error);
    }
    return { ...defaultSettings };
  };

  const settings = loadSettings();
  const language = ref(settings.language);
  const theme = ref(settings.theme);
  const darkMode = ref(settings.darkMode || defaultSettings.darkMode);
  const animationEnabled = ref(settings.animationEnabled);
  const fontSize = ref(settings.fontSize);
  const customTheme = ref(settings.customTheme || defaultSettings.customTheme);

  const saveSettings = () => {
    try {
      const settings = {
        language: language.value,
        theme: theme.value,
        darkMode: darkMode.value,
        animationEnabled: animationEnabled.value,
        fontSize: fontSize.value,
        customTheme: customTheme.value
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.warn('Failed to save settings:', error);
    }
  };

  const applyTheme = () => {
    // 确定深浅色模式
    let effectiveDarkMode = darkMode.value;
    if (darkMode.value === 'auto') {
      effectiveDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    // 确定主题颜色
    let effectiveTheme = theme.value;

    document.documentElement.setAttribute('data-theme', effectiveDarkMode);
    document.documentElement.setAttribute('data-color-theme', effectiveTheme);

    // 移除所有主题类
    document.documentElement.classList.remove('light', 'dark', 'pink-gold', 'blue-purple', 'green-teal', 'orange-red', 'purple-pink', 'custom-theme');
    
    // 添加深浅色模式类
    if (effectiveDarkMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.add('light');
    }

    // 添加主题颜色类
    if (effectiveTheme === 'default') {
      // 默认主题，不添加额外的主题类
    } else if (effectiveTheme === 'pink-gold') {
      document.documentElement.classList.add('pink-gold');
    } else if (effectiveTheme === 'blue-purple') {
      document.documentElement.classList.add('blue-purple');
    } else if (effectiveTheme === 'green-teal') {
      document.documentElement.classList.add('green-teal');
    } else if (effectiveTheme === 'orange-red') {
      document.documentElement.classList.add('orange-red');
    } else if (effectiveTheme === 'purple-pink') {
      document.documentElement.classList.add('purple-pink');
    } else if (effectiveTheme === 'custom') {
      document.documentElement.classList.add('custom-theme');
      // 应用自定义主题颜色
      applyCustomTheme();
    }
  };

  const applyCustomTheme = () => {
    const colors = customTheme.value.colors;
    document.documentElement.style.setProperty('--primary', colors.primary);
    document.documentElement.style.setProperty('--secondary', colors.secondary);
    document.documentElement.style.setProperty('--accent', colors.accent);
    document.documentElement.style.setProperty('--gold', colors.secondary);
  };

  const applyAnimation = () => {
    if (animationEnabled.value) {
      document.documentElement.classList.remove('no-animation');
    } else {
      document.documentElement.classList.add('no-animation');
    }
  };

  const applyFontSize = () => {
    document.documentElement.setAttribute('data-font-size', fontSize.value);
    
    document.documentElement.classList.remove('font-small', 'font-medium', 'font-large');
    document.documentElement.classList.add(`font-${fontSize.value}`);
  };

  watch([language, theme, darkMode, animationEnabled, fontSize, customTheme], () => {
    saveSettings();
    applyTheme();
    applyAnimation();
    applyFontSize();
  }, { immediate: true, deep: true });

  const setLanguage = (newLanguage) => {
    language.value = newLanguage;
  };

  const setTheme = (newTheme) => {
    theme.value = newTheme;
  };

  const setDarkMode = (newDarkMode) => {
    darkMode.value = newDarkMode;
  };

  const setAnimationEnabled = (enabled) => {
    animationEnabled.value = enabled;
  };

  const setFontSize = (size) => {
    fontSize.value = size;
  };

  const setCustomThemeMode = (mode) => {
    customTheme.value.mode = mode;
  };

  const setCustomThemeColor = (colorType, colorValue) => {
    customTheme.value.colors[colorType] = colorValue;
  };

  const resetToDefaults = () => {
    language.value = defaultSettings.language;
    theme.value = defaultSettings.theme;
    darkMode.value = defaultSettings.darkMode;
    animationEnabled.value = defaultSettings.animationEnabled;
    fontSize.value = defaultSettings.fontSize;
    customTheme.value = { ...defaultSettings.customTheme };
  };

  const initThemeListener = () => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme.value === 'auto') {
        applyTheme();
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  };

  return {
    language,
    theme,
    darkMode,
    animationEnabled,
    fontSize,
    customTheme,
    setLanguage,
    setTheme,
    setDarkMode,
    setAnimationEnabled,
    setFontSize,
    setCustomThemeMode,
    setCustomThemeColor,
    resetToDefaults,
    applyTheme,
    applyAnimation,
    applyFontSize,
    applyCustomTheme,
    initThemeListener
  };
});