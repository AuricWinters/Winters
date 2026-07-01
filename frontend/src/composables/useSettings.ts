import { computed, ComputedRef, onMounted, onUnmounted } from 'vue';
import { useSettingsStore } from '../stores/settings.ts';

interface OptionItem {
  value: string;
  label: string;
  desc?: string;
  icon?: string;
}

export function useSettings() {
  const settingsStore = useSettingsStore();

  const language: ComputedRef<string> = computed(() => settingsStore.language);
  const theme: ComputedRef<string> = computed(() => settingsStore.theme);
  const themeStyle: ComputedRef<string> = computed(() => settingsStore.themeStyle);
  const cornerStyle: ComputedRef<string> = computed(() => settingsStore.cornerStyle);
  const darkMode: ComputedRef<string> = computed(() => settingsStore.darkMode);
  const animationEnabled: ComputedRef<boolean> = computed(() => settingsStore.animationEnabled);
  const fontSize: ComputedRef<string> = computed(() => settingsStore.fontSize);
  const customTheme: ComputedRef<any> = computed(() => settingsStore.customTheme);

  const isDarkMode: ComputedRef<boolean> = computed((): boolean => {
    if (darkMode.value === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return darkMode.value === 'dark';
  });

  const isCustomTheme: ComputedRef<boolean> = computed((): boolean => {
    return theme.value === 'custom';
  });

  const currentDarkMode: ComputedRef<string> = computed((): string => {
    if (darkMode.value === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return darkMode.value;
  });

  const languageOptions: OptionItem[] = [
    { value: 'zh-CN', label: '简体中文' },
    { value: 'zh-TW', label: '繁體中文' },
    { value: 'en-US', label: 'English' }
  ];

  const themeOptions: OptionItem[] = [
    { value: 'journal',  label: '手账',   desc: '温暖纸质 · 怀旧手账' },
    { value: 'ink',      label: '墨韵',   desc: '中式水墨 · 典雅沉静' },
    { value: 'aurora',   label: '极光',   desc: '北境极光 · 空灵迷幻' },
    { value: 'sakura',   label: '樱吹雪', desc: '落樱缤纷 · 温柔轻盈' },
    { value: 'forest',   label: '森语',   desc: '深林大地 · 沉稳自然' },
    { value: 'midnight', label: '午夜',   desc: '深海午夜 · 专业锐利' },
    { value: 'twilight', label: '暮光',   desc: '日落微光 · 温暖浓郁' },
    { value: 'minimal',  label: '极简',   desc: '纯粹设计 · 字体驱动' },
    { value: 'custom',   label: '自定义', desc: '自由搭配颜色' }
  ];

  const themeStyleOptions: OptionItem[] = [
    { value: 'journal',  label: '手账风格', desc: '纸质质感 · 温暖怀旧' },
    { value: 'standard', label: '普通风格', desc: '简洁现代 · 干净利落' }
  ];

  const cornerStyleOptions: OptionItem[] = [
    { value: 'rounded', label: '圆角', desc: '柔和圆润' },
    { value: 'sharp',   label: '直角', desc: '锐利硬朗' }
  ];

  const darkModeOptions: OptionItem[] = [
    { value: 'light', label: '浅色模式', icon: 'sun' },
    { value: 'dark',  label: '深色模式', icon: 'moon' },
    { value: 'auto',  label: '跟随系统', icon: 'system' }
  ];

  const fontSizeOptions: OptionItem[] = [
    { value: 'small',  label: '小' },
    { value: 'medium', label: '中' },
    { value: 'large',  label: '大' }
  ];

  let mediaQuery: MediaQueryList | null = null;

  const initSystemThemeListener = (): (() => void) => {
    mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (): void => {
      if (darkMode.value === 'auto') {
        settingsStore.applyTheme();
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return (): void => {
      mediaQuery!.removeEventListener('change', handleChange);
    };
  };

  let cleanupListener: (() => void) | null = null;

  onMounted((): void => {
    cleanupListener = initSystemThemeListener();
  });

  onUnmounted((): void => {
    if (cleanupListener) {
      cleanupListener();
    }
  });

  const setLanguage = (newLanguage: string): void => {
    settingsStore.setLanguage(newLanguage);
  };

  const setTheme = (newTheme: string): void => {
    settingsStore.setTheme(newTheme);
  };

  const setThemeStyle = (newStyle: string): void => {
    settingsStore.setThemeStyle(newStyle);
  };

  const setCornerStyle = (newStyle: string): void => {
    settingsStore.setCornerStyle(newStyle);
  };

  const setDarkMode = (newDarkMode: string): void => {
    settingsStore.setDarkMode(newDarkMode);
  };

  const setAnimationEnabled = (enabled: boolean): void => {
    settingsStore.setAnimationEnabled(enabled);
  };

  const setFontSize = (size: string): void => {
    settingsStore.setFontSize(size);
  };

  const setCustomThemeMode = (mode: string): void => {
    settingsStore.setCustomThemeMode(mode);
  };

  const setCustomThemeColor = (colorType: string, colorValue: string): void => {
    settingsStore.setCustomThemeColor(colorType, colorValue);
  };

  const resetSettings = (): void => {
    settingsStore.resetToDefaults();
  };

  const toggleTheme = (): void => {
    const currentDarkModeValue: string = currentDarkMode.value;
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
    themeStyle,
    cornerStyle,
    darkMode,
    animationEnabled,
    fontSize,
    isDarkMode,
    isCustomTheme,
    currentDarkMode,
    customTheme,
    languageOptions,
    themeOptions,
    themeStyleOptions,
    cornerStyleOptions,
    darkModeOptions,
    fontSizeOptions,
    setLanguage,
    setTheme,
    setThemeStyle,
    setCornerStyle,
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
