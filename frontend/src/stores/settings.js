import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const useSettingsStore = defineStore('settings', () => {
  const STORAGE_KEY = 'winters_settings';

  // 旧主题名 → 新主题名迁移映射
  const themeMigration = {
    'default': 'journal',
    'pink-gold': 'sakura',
    'blue-purple': 'aurora',
    'green-teal': 'forest',
    'orange-red': 'twilight',
    'purple-pink': 'sakura'
  };

  const defaultSettings = {
    language: 'zh-CN',
    theme: 'journal',
    themeStyle: 'journal',
    cornerStyle: 'sharp',
    darkMode: 'auto',
    animationEnabled: true,
    fontSize: 'medium',
    customTheme: {
      mode: 'single',
      colors: {
        primary: '#C4737A',
        secondary: '#B8956A',
        accent: '#D4A0A7'
      }
    }
  };

  const loadSettings = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // 迁移旧主题名到新主题名
        if (parsed.theme && themeMigration[parsed.theme]) {
          parsed.theme = themeMigration[parsed.theme];
        }
        // 补全缺失字段（旧版本数据兼容）
        for (const key of Object.keys(defaultSettings)) {
          if (!(key in parsed)) {
            parsed[key] = JSON.parse(JSON.stringify(defaultSettings[key]));
          }
        }
        return parsed;
      }
    } catch (error) {
      console.warn('Failed to load settings:', error);
    }
    // 深拷贝默认值，避免引用污染
    return JSON.parse(JSON.stringify(defaultSettings));
  };

  const settings = loadSettings();
  const language = ref(settings.language);
  const theme = ref(settings.theme);
  const themeStyle = ref(settings.themeStyle || defaultSettings.themeStyle);
  const cornerStyle = ref(settings.cornerStyle || defaultSettings.cornerStyle);
  const darkMode = ref(settings.darkMode || defaultSettings.darkMode);
  const animationEnabled = ref(settings.animationEnabled);
  const fontSize = ref(settings.fontSize);
  const customTheme = ref(settings.customTheme || defaultSettings.customTheme);

  const saveSettings = () => {
    try {
      const settings = {
        language: language.value,
        theme: theme.value,
        themeStyle: themeStyle.value,
        cornerStyle: cornerStyle.value,
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
    document.documentElement.classList.remove(
      'light', 'dark',
      'journal', 'ink', 'aurora', 'sakura', 'forest', 'midnight', 'twilight', 'minimal', 'custom-theme'
    );

    // 添加深浅色模式类
    if (effectiveDarkMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.add('light');
    }

    // 添加主题颜色类
    if (effectiveTheme !== 'journal') {
      const cls = effectiveTheme === 'custom' ? 'custom-theme' : effectiveTheme;
      document.documentElement.classList.add(cls);
    }
    if (effectiveTheme === 'custom') applyCustomTheme();
  };

  const applyCustomTheme = () => {
    const colors = customTheme.value.colors;
    document.documentElement.style.setProperty('--primary', colors.primary);
    document.documentElement.style.setProperty('--secondary', colors.secondary);
    document.documentElement.style.setProperty('--accent', colors.accent);
    document.documentElement.style.setProperty('--gold', colors.secondary);
  };

  const applyThemeStyle = () => {
    document.documentElement.setAttribute('data-theme-style', themeStyle.value);
    document.documentElement.setAttribute('data-corner-style', cornerStyle.value);
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

  watch([language, theme, themeStyle, cornerStyle, darkMode, animationEnabled, fontSize, customTheme], () => {
    saveSettings();
    applyTheme();
    applyThemeStyle();
    applyAnimation();
    applyFontSize();
  }, { immediate: true, deep: true });

  const setLanguage = (newLanguage) => {
    language.value = newLanguage;
  };

  const setTheme = (newTheme) => {
    theme.value = newTheme;
  };

  const setThemeStyle = (newStyle) => {
    themeStyle.value = newStyle;
    // 手账默认直角，普通默认圆角
    cornerStyle.value = newStyle === 'journal' ? 'sharp' : 'rounded';
  };

  const setCornerStyle = (newStyle) => {
    cornerStyle.value = newStyle;
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
    themeStyle.value = defaultSettings.themeStyle;
    cornerStyle.value = defaultSettings.cornerStyle;
    darkMode.value = defaultSettings.darkMode;
    animationEnabled.value = defaultSettings.animationEnabled;
    fontSize.value = defaultSettings.fontSize;
    customTheme.value = { ...defaultSettings.customTheme };
  };

  const initThemeListener = () => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (darkMode.value === 'auto') {
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
    themeStyle,
    cornerStyle,
    darkMode,
    animationEnabled,
    fontSize,
    customTheme,
    setLanguage,
    setTheme,
    setThemeStyle,
    setCornerStyle,
    setDarkMode,
    setAnimationEnabled,
    setFontSize,
    setCustomThemeMode,
    setCustomThemeColor,
    resetToDefaults,
    applyTheme,
    applyThemeStyle,
    applyAnimation,
    applyFontSize,
    applyCustomTheme,
    initThemeListener
  };
});