import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

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

export const useSettingsStore = defineStore('settings', () => {
  const STORAGE_KEY = 'winters_settings';

  // 旧主题名 → 新主题名迁移映射
  const themeMigration: ThemeMigration = {
    'default': 'journal',
    'pink-gold': 'sakura',
    'blue-purple': 'aurora',
    'green-teal': 'forest',
    'orange-red': 'twilight',
    'purple-pink': 'sakura'
  };

  const defaultSettings: Settings = {
    language: 'zh-CN',
    theme: 'sakura',
    themeStyle: 'standard',
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

  const loadSettings = (): Settings => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Settings;
        // 迁移旧主题名到新主题名
        if (parsed.theme && themeMigration[parsed.theme]) {
          parsed.theme = themeMigration[parsed.theme];
        }
        // 补全缺失字段（旧版本数据兼容）
        for (const key of Object.keys(defaultSettings)) {
          if (!(key in parsed)) {
            (parsed as any)[key] = JSON.parse(JSON.stringify((defaultSettings as any)[key]));
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
  const language = ref<string>(settings.language);
  const theme = ref<string>(settings.theme);
  const themeStyle = ref<string>(settings.themeStyle || defaultSettings.themeStyle);
  const cornerStyle = ref<string>(settings.cornerStyle || defaultSettings.cornerStyle);
  const darkMode = ref<string>(settings.darkMode || defaultSettings.darkMode);
  const animationEnabled = ref<boolean>(settings.animationEnabled);
  const fontSize = ref<string>(settings.fontSize);
  const customTheme = ref<CustomTheme>(settings.customTheme || defaultSettings.customTheme);

  const saveSettings = (): void => {
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

  const applyTheme = (): void => {
    // 确定深浅色模式
    let effectiveDarkMode: string = darkMode.value;
    if (darkMode.value === 'auto') {
      effectiveDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    // 确定主题颜色
    let effectiveTheme: string = theme.value;

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

  watch([language, theme, themeStyle, cornerStyle, darkMode, animationEnabled, fontSize, customTheme], () => {
    saveSettings();
    applyTheme();
    applyThemeStyle();
    applyAnimation();
    applyFontSize();
  }, { immediate: true, deep: true });

  const setLanguage = (newLanguage: string): void => {
    language.value = newLanguage;
  };

  const setTheme = (newTheme: string): void => {
    theme.value = newTheme;
  };

  const setThemeStyle = (newStyle: string): void => {
    themeStyle.value = newStyle;
    // 手账默认直角，普通默认圆角
    cornerStyle.value = newStyle === 'journal' ? 'sharp' : 'rounded';
  };

  const setCornerStyle = (newStyle: string): void => {
    cornerStyle.value = newStyle;
  };

  const setDarkMode = (newDarkMode: string): void => {
    darkMode.value = newDarkMode;
  };

  const setAnimationEnabled = (enabled: boolean): void => {
    animationEnabled.value = enabled;
  };

  const setFontSize = (size: string): void => {
    fontSize.value = size;
  };

  const setCustomThemeMode = (mode: string): void => {
    customTheme.value.mode = mode;
  };

  const setCustomThemeColor = (colorType: string, colorValue: string): void => {
    customTheme.value.colors[colorType] = colorValue;
  };

  const resetToDefaults = (): void => {
    language.value = defaultSettings.language;
    theme.value = defaultSettings.theme;
    themeStyle.value = defaultSettings.themeStyle;
    cornerStyle.value = defaultSettings.cornerStyle;
    darkMode.value = defaultSettings.darkMode;
    animationEnabled.value = defaultSettings.animationEnabled;
    fontSize.value = defaultSettings.fontSize;
    customTheme.value = { ...defaultSettings.customTheme };
  };

  const initThemeListener = (): (() => void) => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (): void => {
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
