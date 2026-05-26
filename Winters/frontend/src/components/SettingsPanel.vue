<template>
  <div
    class="settings-panel"
    :class="{ show: isOpen }"
    @click.stop
  >
    <div class="settings-header">
      <div class="header-content">
        <h3 class="settings-title">设置</h3>
        <p class="settings-subtitle">自定义您的网页体验</p>
      </div>
      <button
        class="close-btn"
        @click="closePanel"
        aria-label="关闭设置"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M18 6L6 18M6 6l12 12" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
    </div>

    <div class="settings-content">
      <!-- 主题颜色设置 -->
      <div class="settings-card">
        <div class="card-header">
          <h4 class="card-title">主题颜色</h4>
          <p class="card-description">选择您喜欢的主题颜色</p>
        </div>
        <div class="card-body">
          <div class="theme-options" @wheel="handleWheel">
            <button
              v-for="option in themeOptions"
              :key="option.value"
              class="theme-btn"
              :class="{ active: theme === option.value }"
              @click="handleThemeChange(option.value)"
            >
              <div class="theme-preview" :style="getThemePreview(option.value)"></div>
              <span class="theme-label">{{ option.label }}</span>
            </button>
          </div>

          <!-- 自定义主题设置 (可折叠) -->
          <div v-if="theme === 'custom'" class="custom-theme-settings">
            <div class="collapse-header">
              <h5 class="collapse-title">自定义主题</h5>
              <button
                class="collapse-btn"
                :class="{ active: isCustomThemeExpanded }"
                @click="isCustomThemeExpanded = !isCustomThemeExpanded"
              >
                <svg class="collapse-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </button>
            </div>
            <div v-if="isCustomThemeExpanded" class="collapse-content">
              <div class="setting-item">
                <div class="item-info">
                  <div class="item-header">
                    <span class="item-label">自定义模式</span>
                    <span class="item-description">选择颜色组合模式</span>
                  </div>
                </div>
                <div class="custom-mode-options">
                  <button
                    v-for="mode in customModeOptions"
                    :key="mode.value"
                    class="mode-btn"
                    :class="{ active: customTheme.mode === mode.value }"
                    @click="handleCustomModeChange(mode.value)"
                  >
                    {{ mode.label }}
                  </button>
                </div>
              </div>

              <div class="setting-item">
                <div class="color-input-group">
                  <input
                    type="color"
                    v-model="customColors.primary"
                    @change="handleColorChange('primary', customColors.primary)"
                    class="color-picker"
                  >
                  <input
                    type="text"
                    v-model="customColors.primary"
                    @input="handleColorChange('primary', customColors.primary)"
                    class="color-input"
                    placeholder="#EC4899"
                  >
                </div>
              </div>

              <div v-if="customTheme.mode !== 'single'" class="setting-item">
                <div class="color-input-group">
                  <input
                    type="color"
                    v-model="customColors.secondary"
                    @change="handleColorChange('secondary', customColors.secondary)"
                    class="color-picker"
                  >
                  <input
                    type="text"
                    v-model="customColors.secondary"
                    @input="handleColorChange('secondary', customColors.secondary)"
                    class="color-input"
                    placeholder="#F59E0B"
                  >
                </div>
              </div>

              <div v-if="customTheme.mode === 'triple'" class="setting-item">
                <div class="color-input-group">
                  <input
                    type="color"
                    v-model="customColors.accent"
                    @change="handleColorChange('accent', customColors.accent)"
                    class="color-picker"
                  >
                  <input
                    type="text"
                    v-model="customColors.accent"
                    @input="handleColorChange('accent', customColors.accent)"
                    class="color-input"
                    placeholder="#F472B6"
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 深色模式设置 -->
      <div class="settings-card">
        <div class="card-header">
          <h4 class="card-title">深色模式</h4>
          <p class="card-description">选择显示模式</p>
        </div>
        <div class="card-body">
          <div class="dark-mode-options">
            <button
              v-for="option in darkModeOptions"
              :key="option.value"
              class="dark-mode-btn"
              :class="{ active: darkMode === option.value }"
              @click="handleDarkModeChange(option.value)"
            >
              <span class="dark-mode-label">{{ option.label }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 外观设置 -->
      <div class="settings-card">
        <div class="card-header">
          <h4 class="card-title">外观</h4>
          <p class="card-description">调整网页的视觉效果</p>
        </div>
        <div class="card-body">
          <div class="setting-item">
            <div class="item-info">
              <span class="item-label">字体大小</span>
              <span class="item-description">调整全局字体大小</span>
            </div>
            <div class="font-size-options">
              <button
                v-for="option in fontSizeOptions"
                :key="option.value"
                class="font-size-btn"
                :class="{ active: fontSize === option.value }"
                @click="handleFontSizeChange(option.value)"
              >
                {{ option.label }}
              </button>
            </div>
          </div>

          <div class="setting-item">
            <div class="item-info">
              <span class="item-label">动画效果</span>
              <span class="item-description">启用或禁用页面动画</span>
            </div>
            <button
              class="switch-btn"
              :class="{ active: animationEnabled }"
              @click="toggleAnimation"
              role="switch"
              :aria-checked="animationEnabled"
            >
              <span class="switch-slider"></span>
            </button>
          </div>
        </div>
      </div>

      <!-- 语言设置 -->
      <div class="settings-card">
        <div class="card-header">
          <h4 class="card-title">语言</h4>
          <p class="card-description">选择网页显示语言</p>
        </div>
        <div class="card-body">
          <div class="language-options">
            <button
              v-for="option in languageOptions"
              :key="option.value"
              class="language-btn"
              :class="{ active: language === option.value }"
              @click="handleLanguageChange(option.value)"
            >
              {{ option.label }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="settings-footer">
      <button
        class="reset-btn"
        @click="handleReset"
      >
        重置所有设置
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useSettings } from '../composables/useSettings.js';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close']);

const {
    language,
    theme,
    darkMode,
    animationEnabled,
    fontSize,
    isDarkMode,
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
    resetSettings
  } = useSettings();

const customModeOptions = [
  { value: 'single', label: '单色' },
  { value: 'dual', label: '双拼' },
  { value: 'triple', label: '三色' }
];

const customColors = ref({
  primary: customTheme.value.colors.primary,
  secondary: customTheme.value.colors.secondary,
  accent: customTheme.value.colors.accent
});

// 折叠状态
const isCustomThemeExpanded = ref(false);

const handleCustomModeChange = (mode) => {
  setCustomThemeMode(mode);
};

const handleColorChange = (colorType, colorValue) => {
  setCustomThemeColor(colorType, colorValue);
};

// 监听 customTheme 变化，更新 customColors
watch(() => customTheme.value, (newTheme) => {
  customColors.value = {
    primary: newTheme.colors.primary,
    secondary: newTheme.colors.secondary,
    accent: newTheme.colors.accent
  };
}, { deep: true });

const closePanel = () => {
  emit('close');
};

const handleThemeChange = (newTheme) => {
  setTheme(newTheme);
};

const handleLanguageChange = (newLanguage) => {
  setLanguage(newLanguage);
};

const toggleAnimation = () => {
  setAnimationEnabled(!animationEnabled);
};

const handleDarkModeChange = (newDarkMode) => {
  setDarkMode(newDarkMode);
};

const handleFontSizeChange = (size) => {
  setFontSize(size);
};

const handleReset = () => {
  if (confirm('确定要重置所有设置吗？')) {
    resetSettings();
  }
};

const getThemePreview = (themeValue) => {
  const themeMap = {
    'light': {
      background: 'linear-gradient(135deg, #ffffff, #f8fafc)'
    },
    'dark': {
      background: 'linear-gradient(135deg, #1e293b, #0f172a)'
    },
    'default': {
      background: 'linear-gradient(135deg, #6366f1, #EC4899)'
    },
    'pink-gold': {
      background: 'linear-gradient(135deg, #EC4899, #F59E0B)'
    },
    'blue-purple': {
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)'
    },
    'green-teal': {
      background: 'linear-gradient(135deg, #10b981, #0ea5e9)'
    },
    'orange-red': {
      background: 'linear-gradient(135deg, #f97316, #ef4444)'
    },
    'purple-pink': {
      background: 'linear-gradient(135deg, #8b5cf6, #ec4899)'
    },
    'custom': {
      background: `linear-gradient(135deg, ${customColors.value.primary}, ${customColors.value.secondary})`
    },
    'auto': {
      background: 'linear-gradient(135deg, #6366f1, #EC4899)'
    }
  };
  return themeMap[themeValue] || themeMap.default;
};

// 处理鼠标滚轮事件，实现水平滚动
const handleWheel = (event) => {
  const themeOptions = event.currentTarget;
  if (event.deltaY !== 0) {
    event.preventDefault();
    themeOptions.scrollLeft += event.deltaY;
  }
};
</script>

<style scoped>
.settings-panel {
  position: fixed;
  top: 0;
  right: -400px;
  width: 360px;
  height: 100vh;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: -10px 0 40px rgba(0, 0, 0, 0.1);
  z-index: 10001;
  display: flex;
  flex-direction: column;
  transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.settings-panel.show {
  right: 0;
}

.settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
}

.header-content {
  flex: 1;
}

.settings-title {
  font-size: 24px;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 4px 0;
  background: linear-gradient(135deg, #EC4899, #F59E0B);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.settings-subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.close-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
}

.close-btn:hover {
  background: rgba(236, 72, 153, 0.1);
  transform: rotate(90deg) scale(1.1);
}

.close-btn svg {
  width: 20px;
  height: 20px;
  color: #64748b;
  transition: color 0.2s ease;
}

.close-btn:hover svg {
  color: #EC4899;
}

.settings-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
}

.settings-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.settings-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.card-header {
  padding: 20px 20px 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.card-title {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.card-description {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.card-body {
  padding: 20px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.setting-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.item-info {
  flex: 1;
  margin-right: 16px;
  min-width: 0;
  max-width: 250px;
}

.item-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item-label {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
}

.item-description {
  font-size: 12px;
  color: #64748b;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
}

.theme-options {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 8px;
  scrollbar-width: thin;
  scrollbar-color: rgba(236, 72, 153, 0.3) rgba(0, 0, 0, 0.02);
  cursor: grab;
}

.theme-options::-webkit-scrollbar {
  height: 6px;
}

.theme-options::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.02);
  border-radius: 3px;
}

.theme-options::-webkit-scrollbar-thumb {
  background: rgba(236, 72, 153, 0.3);
  border-radius: 3px;
  transition: background 0.2s ease;
}

.theme-options::-webkit-scrollbar-thumb:hover {
  background: rgba(236, 72, 153, 0.5);
}

.theme-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 8px;
  background: rgba(0, 0, 0, 0.02);
  border: 2px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: center;
  min-height: 60px;
  justify-content: center;
  flex: 1;
  max-width: 100px;
}

.theme-btn:hover {
  background: rgba(236, 72, 153, 0.05);
  transform: translateY(-1px);
}

.theme-btn.active {
  background: rgba(236, 72, 153, 0.1);
  border-color: #EC4899;
  box-shadow: 0 4px 15px rgba(236, 72, 153, 0.2);
}

.theme-preview {
  width: 36px;
  height: 36px;
  border-radius: 6px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.theme-btn:hover .theme-preview {
  transform: scale(1.05);
}

.theme-label {
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
  transition: color 0.2s ease;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 60px;
}

.theme-btn.active .theme-label {
  color: #EC4899;
}

.language-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.dark-mode-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.dark-mode-btn {
  padding: 14px 16px;
  background: rgba(0, 0, 0, 0.02);
  border: 2px solid transparent;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: center;
}

.dark-mode-btn:hover {
  background: rgba(236, 72, 153, 0.05);
  color: #EC4899;
  transform: translateY(-1px);
}

.dark-mode-btn.active {
  background: rgba(236, 72, 153, 0.1);
  border-color: #EC4899;
  color: #EC4899;
  box-shadow: 0 4px 15px rgba(236, 72, 153, 0.2);
}

.language-btn {
  padding: 14px 16px;
  background: rgba(0, 0, 0, 0.02);
  border: 2px solid transparent;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: center;
}

.language-btn:hover {
  background: rgba(236, 72, 153, 0.05);
  color: #EC4899;
  transform: translateY(-1px);
}

.language-btn.active {
  background: rgba(236, 72, 153, 0.1);
  border-color: #EC4899;
  color: #EC4899;
  box-shadow: 0 4px 15px rgba(236, 72, 153, 0.2);
}

.switch-btn {
  width: 52px;
  height: 30px;
  background: #e2e8f0;
  border: none;
  border-radius: 15px;
  position: relative;
  cursor: pointer;
  transition: background 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
}

.switch-btn.active {
  background: #EC4899;
  box-shadow: 0 0 20px rgba(236, 72, 153, 0.4);
}

.switch-slider {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 26px;
  height: 26px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.switch-btn.active .switch-slider {
  transform: translateX(22px);
}

.font-size-options {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.font-size-btn {
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.02);
  border: 2px solid transparent;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 40px;
  text-align: center;
}

.font-size-btn:hover {
  background: rgba(236, 72, 153, 0.05);
  transform: translateY(-1px);
}

.font-size-btn.active {
  background: rgba(236, 72, 153, 0.1);
  border-color: #EC4899;
  color: #EC4899;
  box-shadow: 0 4px 15px rgba(236, 72, 153, 0.2);
}

.settings-footer {
  padding: 24px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
}

.reset-btn {
  width: 100%;
  padding: 14px 16px;
  background: rgba(239, 68, 68, 0.1);
  border: 2px solid rgba(239, 68, 68, 0.2);
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #ef4444;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.reset-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: #ef4444;
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(239, 68, 68, 0.2);
}

/* 自定义主题设置样式 */
.custom-theme-settings {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

/* 折叠面板样式 */
.collapse-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.collapse-title {
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.collapse-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.collapse-btn:hover {
  background: rgba(236, 72, 153, 0.1);
  transform: rotate(90deg);
}

.collapse-btn.active {
  transform: rotate(180deg);
}

.collapse-icon {
  width: 16px;
  height: 16px;
  color: #64748b;
  transition: color 0.2s ease;
}

.collapse-btn:hover .collapse-icon {
  color: #EC4899;
}

.collapse-content {
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.custom-mode-options {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.mode-btn {
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.02);
  border: 2px solid transparent;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 60px;
  text-align: center;
}

.mode-btn:hover {
  background: rgba(236, 72, 153, 0.05);
  transform: translateY(-1px);
}

.mode-btn.active {
  background: rgba(236, 72, 153, 0.1);
  border-color: #EC4899;
  color: #EC4899;
  box-shadow: 0 4px 15px rgba(236, 72, 153, 0.2);
}

.color-input-group {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-shrink: 0;
}

.color-picker {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background: none;
  padding: 0;
  overflow: hidden;
}

.color-picker::-webkit-color-swatch-wrapper {
  padding: 0;
}

.color-picker::-webkit-color-swatch {
  border: none;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.color-input {
  flex: 1;
  min-width: 80px;
  padding: 6px 10px;
  border: 2px solid rgba(0, 0, 0, 0.05);
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #1e293b;
  background: rgba(0, 0, 0, 0.02);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.color-input:focus {
  outline: none;
  border-color: #EC4899;
  background: white;
  box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
}

@media (max-width: 480px) {
  .custom-mode-options {
    flex-wrap: wrap;
  }
  
  .mode-btn {
    flex: 1;
    min-width: unset;
  }
  
  .color-input-group {
    flex-direction: column;
    align-items: stretch;
  }
  
  .color-picker {
    width: 100%;
    height: 50px;
  }
  
  .color-input {
    width: 100%;
  }
}

@media (prefers-color-scheme: dark) {
  .custom-theme-settings {
    border-top-color: rgba(255, 255, 255, 0.1);
  }
  
  .collapse-title {
    color: #f1f5f9;
  }
  
  .collapse-btn {
    background: rgba(255, 255, 255, 0.1);
  }
  
  .collapse-btn:hover {
    background: rgba(236, 72, 153, 0.2);
  }
  
  .collapse-icon {
    color: #94a3b8;
  }
  
  .collapse-btn:hover .collapse-icon {
    color: #EC4899;
  }
  
  .mode-btn {
    background: rgba(255, 255, 255, 0.05);
    color: #94a3b8;
  }
  
  .mode-btn:hover {
    background: rgba(236, 72, 153, 0.15);
    color: #EC4899;
  }
  
  .mode-btn.active {
    background: rgba(236, 72, 153, 0.2);
    border-color: #EC4899;
    color: #EC4899;
  }
  
  .color-input {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
    color: #f1f5f9;
  }
  
  .color-input:focus {
    border-color: #EC4899;
    background: #1e293b;
    box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.2);
  }
}

/* 滚动条样式 */
.settings-content::-webkit-scrollbar {
  width: 6px;
}

.settings-content::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.02);
  border-radius: 3px;
}

.settings-content::-webkit-scrollbar-thumb {
  background: rgba(236, 72, 153, 0.3);
  border-radius: 3px;
  transition: background 0.2s ease;
}

.settings-content::-webkit-scrollbar-thumb:hover {
  background: rgba(236, 72, 153, 0.5);
}

@media (max-width: 480px) {
  .settings-panel {
    width: 100%;
    right: -100%;
  }
  
  .settings-header {
    padding: 20px;
  }
  
  .settings-content {
    padding: 16px;
  }
  
  .settings-card {
    margin-bottom: 16px;
  }
  
  .card-header,
  .card-body {
    padding: 16px;
  }
  
  .theme-options {
    grid-template-columns: 1fr;
  }
  
  .theme-btn {
    flex-direction: row;
    justify-content: space-between;
    padding: 16px;
  }
  
  .theme-preview {
    width: 48px;
    height: 48px;
  }
  
  .settings-footer {
    padding: 20px;
  }
}

@media (prefers-color-scheme: dark) {
  .settings-panel {
    background: rgba(30, 41, 59, 0.95);
  }
  
  .settings-header {
    background: rgba(30, 41, 59, 0.9);
    border-bottom-color: rgba(255, 255, 255, 0.1);
  }
  
  .settings-title {
    color: #f1f5f9;
  }
  
  .settings-subtitle {
    color: #94a3b8;
  }
  
  .close-btn {
    background: rgba(255, 255, 255, 0.1);
  }
  
  .close-btn svg {
    color: #94a3b8;
  }
  
  .close-btn:hover {
    background: rgba(236, 72, 153, 0.2);
  }
  
  .settings-content {
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  }
  
  .settings-card {
    background: #1e293b;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }
  
  .card-header {
    border-bottom-color: rgba(255, 255, 255, 0.1);
  }
  
  .card-title {
    color: #f1f5f9;
  }
  
  .card-description {
    color: #94a3b8;
  }
  
  .setting-item {
    border-bottom-color: rgba(255, 255, 255, 0.1);
  }
  
  .item-label {
    color: #f1f5f9;
  }
  
  .item-description {
    color: #94a3b8;
  }
  
  .theme-btn,
  .language-btn,
  .dark-mode-btn,
  .font-size-btn {
    background: rgba(255, 255, 255, 0.05);
    color: #94a3b8;
  }
  
  .theme-btn:hover,
  .language-btn:hover,
  .dark-mode-btn:hover,
  .font-size-btn:hover {
    background: rgba(236, 72, 153, 0.15);
    color: #EC4899;
  }
  
  .theme-btn.active,
  .language-btn.active,
  .dark-mode-btn.active,
  .font-size-btn.active {
    background: rgba(236, 72, 153, 0.2);
    border-color: #EC4899;
    color: #EC4899;
  }
  
  .settings-footer {
    background: rgba(30, 41, 59, 0.9);
    border-top-color: rgba(255, 255, 255, 0.1);
  }
  
  .reset-btn {
    background: rgba(239, 68, 68, 0.15);
    border-color: rgba(239, 68, 68, 0.3);
    color: #fca5a5;
  }
  
  .reset-btn:hover {
    background: rgba(239, 68, 68, 0.25);
    border-color: #ef4444;
  }
  
  .settings-content::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
  }
  
  .settings-content::-webkit-scrollbar-thumb {
    background: rgba(236, 72, 153, 0.4);
  }
  
  .settings-content::-webkit-scrollbar-thumb:hover {
    background: rgba(236, 72, 153, 0.6);
  }
}
</style>