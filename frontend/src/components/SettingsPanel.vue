<template>
  <div
    class="settings-panel show"
    @click.stop
  >
    <!-- ═══ 顶部栏 ═══ -->
    <div class="settings-header">
      <button
        v-if="currentView !== 'main'"
        class="back-btn"
        @click="currentView = 'main'"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        ><path
          d="M15 18l-6-6 6-6"
          stroke-width="2"
          stroke-linecap="round"
        /></svg>
      </button>
      <div class="header-content">
        <h3 class="settings-title">
          {{ currentView === 'theme' ? t('主题') : t('设置') }}
        </h3>
        <p
          v-if="currentView === 'main'"
          class="settings-subtitle"
        >
          自定义您的网页体验
        </p>
      </div>
      <button
        class="close-btn"
        @click="closePanel"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        ><path
          d="M18 6L6 18M6 6l12 12"
          stroke-width="2"
          stroke-linecap="round"
        /></svg>
      </button>
    </div>

    <!-- ═══ 主页 ═══ -->
    <div
      v-if="currentView === 'main'"
      class="settings-content"
    >
      <div
        class="nav-item"
        @click="currentView = 'theme'"
      >
        <span class="nav-icon">🎨</span>
        <div class="nav-info">
          <span class="nav-label">{{ t('主题') }}</span>
          <span class="nav-hint">{{ t(themeStyleOptions.find(o=>o.value===themeStyle)?.label) }} · {{ t(themeOptions.find(o=>o.value===theme)?.label) }}</span>
        </div>
        <svg
          class="nav-arrow"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        ><path
          d="m9 18 6-6-6-6"
          stroke-width="2"
          stroke-linecap="round"
        /></svg>
      </div>

      <div class="settings-card">
        <div class="card-header">
          <h4 class="card-title">
            ✨ {{ t('外观') }}
          </h4>
        </div>
        <div class="card-body">
          <div class="setting-item">
            <div class="item-info">
              <span class="item-label">{{ t('字体大小') }}</span>
            </div>
            <div class="font-size-options">
              <button
                v-for="o in fontSizeOptions"
                :key="o.value"
                class="font-size-btn"
                :class="{ active: fontSize === o.value }"
                @click="handleFontSizeChange(o.value)"
              >
                {{ t(o.label) }}
              </button>
            </div>
          </div>
          <div class="setting-item">
            <div class="item-info">
              <span class="item-label">{{ t('动画效果') }}</span>
            </div>
            <button
              class="switch-btn"
              :class="{ active: animationEnabled }"
              @click="toggleAnimation"
            >
              <span class="switch-slider" />
            </button>
          </div>
        </div>
      </div>

      <div class="settings-card">
        <div class="card-header">
          <h4 class="card-title">
            🌐 {{ t('语言') }}
          </h4>
        </div>
        <div class="card-body">
          <div class="language-options">
            <button
              v-for="o in languageOptions"
              :key="o.value"
              class="language-btn"
              :class="{ active: language === o.value }"
              @click="handleLanguageChange(o.value)"
            >
              {{ t(o.label) }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══ 主题子页 ═══ -->
    <div
      v-if="currentView === 'theme'"
      class="settings-content"
    >
      <div class="settings-card sub-card">
        <div class="card-header">
          <h4 class="card-title">
            {{ t('主题样式') }}
          </h4>
        </div>
        <div class="card-body">
          <div class="style-grid">
            <button
              v-for="o in themeStyleOptions"
              :key="o.value"
              class="style-btn"
              :class="{ active: themeStyle === o.value }"
              @click="handleThemeStyleChange(o.value)"
            >
              <span class="style-label">{{ t(o.label) }}</span>
            </button>
          </div>
        </div>
      </div>

      <div class="settings-card sub-card">
        <div class="card-header">
          <h4 class="card-title">
            {{ t('圆角样式') }}
          </h4>
        </div>
        <div class="card-body">
          <div class="style-grid">
            <button
              v-for="o in cornerStyleOptions"
              :key="o.value"
              class="style-btn"
              :class="{ active: cornerStyle === o.value }"
              @click="handleCornerStyleChange(o.value)"
            >
              <span class="style-label">{{ t(o.label) }}</span>
            </button>
          </div>
        </div>
      </div>

      <div class="settings-card sub-card">
        <div class="card-header">
          <h4 class="card-title">
            {{ t('主题颜色') }}
          </h4>
        </div>
        <div class="card-body">
          <div class="theme-grid">
            <button
              v-for="o in themeOptions"
              :key="o.value"
              class="theme-btn"
              :class="{ active: theme === o.value }"
              @click="handleThemeChange(o.value)"
            >
              <div
                class="theme-preview"
                :style="getThemePreview(o.value)"
              />
              <span class="theme-label">{{ t(o.label) }}</span>
            </button>
          </div>
          <div
            v-if="theme === 'custom'"
            class="custom-theme-settings"
          >
            <div class="collapse-header">
              <h5 class="collapse-title">
                {{ t('自定义配色') }}
              </h5>
              <button
                class="collapse-btn"
                :class="{ active: isCustomThemeExpanded }"
                @click="isCustomThemeExpanded = !isCustomThemeExpanded"
              >
                <svg
                  class="collapse-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                ><path d="m6 9 6 6 6-6" /></svg>
              </button>
            </div>
            <div
              v-if="isCustomThemeExpanded"
              class="collapse-content"
            >
              <div class="setting-item">
                <div class="item-info">
                  <span class="item-label">{{ t('配色模式') }}</span>
                </div>
                <div class="custom-mode-options">
                  <button
                    v-for="m in customModeOptions"
                    :key="m.value"
                    class="mode-btn"
                    :class="{ active: customTheme.mode === m.value }"
                    @click="handleCustomModeChange(m.value)"
                  >
                    {{ m.label }}
                  </button>
                </div>
              </div>
              <div class="setting-item">
                <div class="color-input-group">
                  <input
                    v-model="customColors.primary"
                    type="color"
                    class="color-picker"
                    @change="handleColorChange('primary', customColors.primary)"
                  >
                  <input
                    v-model="customColors.primary"
                    type="text"
                    class="color-input"
                    placeholder="#C4737A"
                    @input="handleColorChange('primary', customColors.primary)"
                  >
                </div>
              </div>
              <div
                v-if="customTheme.mode !== 'single'"
                class="setting-item"
              >
                <div class="color-input-group">
                  <input
                    v-model="customColors.secondary"
                    type="color"
                    class="color-picker"
                    @change="handleColorChange('secondary', customColors.secondary)"
                  >
                  <input
                    v-model="customColors.secondary"
                    type="text"
                    class="color-input"
                    placeholder="#B8956A"
                    @input="handleColorChange('secondary', customColors.secondary)"
                  >
                </div>
              </div>
              <div
                v-if="customTheme.mode === 'triple'"
                class="setting-item"
              >
                <div class="color-input-group">
                  <input
                    v-model="customColors.accent"
                    type="color"
                    class="color-picker"
                    @change="handleColorChange('accent', customColors.accent)"
                  >
                  <input
                    v-model="customColors.accent"
                    type="text"
                    class="color-input"
                    placeholder="#D4A0A7"
                    @input="handleColorChange('accent', customColors.accent)"
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="settings-card sub-card">
        <div class="card-header">
          <h4 class="card-title">
            {{ t('深浅模式') }}
          </h4>
        </div>
        <div class="card-body">
          <div class="dark-mode-options">
            <button
              v-for="o in darkModeOptions"
              :key="o.value"
              class="dark-mode-btn"
              :class="{ active: darkMode === o.value }"
              @click="handleDarkModeChange(o.value)"
            >
              <span class="dark-mode-icon">{{ o.icon === 'sun' ? '☀️' : o.icon === 'moon' ? '🌙' : '🔄' }}</span>
              <span class="dark-mode-label">{{ t(o.label) }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══ 底部 ═══ -->
    <div class="settings-footer">
      <button
        class="reset-btn"
        @click="handleReset"
      >
        {{ t('重置所有设置') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useSettings } from '../composables/useSettings.ts';
import { useI18n } from '../composables/useI18n.ts';

const { t } = useI18n();
const emit = defineEmits(['close']);

const {
    language, theme, themeStyle, cornerStyle, darkMode, animationEnabled, fontSize,
    customTheme, languageOptions, themeOptions, themeStyleOptions, cornerStyleOptions,
    darkModeOptions, fontSizeOptions,
    setLanguage, setTheme, setThemeStyle, setCornerStyle, setDarkMode,
    setAnimationEnabled, setFontSize, setCustomThemeMode, setCustomThemeColor,
    resetSettings
} = useSettings();

const currentView = ref('main');
const isCustomThemeExpanded = ref(false);

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

watch(() => customTheme.value, (newTheme) => {
  customColors.value = {
    primary: newTheme.colors.primary,
    secondary: newTheme.colors.secondary,
    accent: newTheme.colors.accent
  };
}, { deep: true });

const closePanel = () => emit('close');
const handleThemeChange = (v) => setTheme(v);
const handleThemeStyleChange = (v) => setThemeStyle(v);
const handleCornerStyleChange = (v) => setCornerStyle(v);
const handleDarkModeChange = (v) => setDarkMode(v);
const handleFontSizeChange = (v) => setFontSize(v);
const handleLanguageChange = (v) => setLanguage(v);
const handleCustomModeChange = (v) => setCustomThemeMode(v);
const handleColorChange = (type, val) => setCustomThemeColor(type, val);
const toggleAnimation = () => setAnimationEnabled(!animationEnabled.value);
const handleReset = () => { if (confirm(`确定要${t('重置所有设置')}吗？`)) { resetSettings(); currentView.value = 'main'; } };

const getThemePreview = (themeValue) => {
  const map = {
    'journal':  { background: 'linear-gradient(135deg, #C4737A 0%, #B8956A 100%)' },
    'ink':      { background: 'linear-gradient(135deg, #3A3A3A 0%, #C8493A 100%)' },
    'aurora':   { background: 'linear-gradient(135deg, #0D9488 0%, #7C3AED 100%)' },
    'sakura':   { background: 'linear-gradient(135deg, #E890A0 0%, #8FA88A 100%)' },
    'forest':   { background: 'linear-gradient(135deg, #7A8A60 0%, #8B735A 100%)' },
    'midnight': { background: 'linear-gradient(135deg, #1E3A5F 0%, #C89840 100%)' },
    'twilight': { background: 'linear-gradient(135deg, #E87A5E 0%, #7A5E8B 100%)' },
    'minimal':  { background: 'linear-gradient(135deg, #2A2A2A 0%, #4A7A9A 100%)' },
    'custom':   { background: `linear-gradient(135deg, ${customColors.value.primary}, ${customColors.value.secondary})` }
  };
  return map[themeValue] || map.journal;
};
</script>

<style scoped>
.settings-panel { position: fixed; top: 0; right: 0; width: 380px; height: 100vh; background: var(--bg-glass); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); box-shadow: -10px 0 40px rgba(0,0,0,0.1); z-index: 10001; display: flex; flex-direction: column; overflow: hidden; }

/* header */
.settings-header { display: flex; align-items: center; gap: 12px; padding: 24px; border-bottom: 1px solid var(--border-color); background: var(--bg-glass); backdrop-filter: blur(10px); }
.header-content { flex: 1; }
.settings-title { font-size: 22px; font-weight: 800; color: var(--text-main); margin: 0; }
.settings-subtitle { font-size: 13px; color: var(--text-light); margin: 4px 0 0; }
.back-btn { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border: none; background: var(--border-color); border-radius: 10px; cursor: pointer; color: var(--text-secondary); transition: all 0.2s; flex-shrink: 0; }
.back-btn:hover { background: rgba(var(--primary-rgb), 0.1); color: var(--primary); }
.back-btn svg { width: 20px; height: 20px; }
.close-btn { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border: none; background: var(--border-color); border-radius: 10px; cursor: pointer; color: var(--text-secondary); transition: all 0.2s; flex-shrink: 0; }
.close-btn:hover { background: rgba(var(--primary-rgb), 0.1); color: var(--primary); transform: rotate(90deg); }
.close-btn svg { width: 20px; height: 20px; }

/* content */
.settings-content { flex: 1; overflow-y: auto; padding: 16px 20px; background: var(--bg-main); }

/* nav item (main page) */
.nav-item { display: flex; align-items: center; gap: 14px; padding: 18px 20px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 14px; cursor: pointer; transition: all 0.2s; margin-bottom: 12px; }
.nav-item:hover { border-color: var(--primary); box-shadow: 0 2px 12px rgba(var(--primary-rgb), 0.1); }
.nav-icon { font-size: 28px; flex-shrink: 0; }
.nav-info { flex: 1; display: flex; flex-direction: column; gap: 3px; min-width: 0; }
.nav-label { font-size: 16px; font-weight: 700; color: var(--text-main); }
.nav-hint { font-size: 12px; color: var(--text-light); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.nav-arrow { width: 20px; height: 20px; flex-shrink: 0; color: var(--text-light); }

/* cards */
.settings-card { background: var(--bg-card); border-radius: var(--radius); box-shadow: var(--shadow-sm); margin-bottom: 12px; overflow: hidden; }
.sub-card { border: 1px solid var(--border-color); box-shadow: none; }
.card-header { padding: 16px 20px 12px; border-bottom: 1px solid var(--border-color); }
.card-title { font-size: 15px; font-weight: 700; color: var(--text-main); margin: 0; }
.card-body { padding: 16px 20px; }

.setting-item { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid var(--border-color); }
.setting-item:last-child { border-bottom: none; padding-bottom: 0; }
.item-info { flex: 1; margin-right: 16px; }
.item-label { font-size: 14px; font-weight: 600; color: var(--text-main); }

/* theme grid */
.theme-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
.theme-btn { display: flex; align-items: center; gap: 10px; padding: 10px 12px; background: var(--bg-card); border: 2px solid var(--border-color); border-radius: 12px; cursor: pointer; transition: all 0.2s; }
.theme-btn:hover { border-color: var(--primary); transform: translateY(-1px); }
.theme-btn.active { border-color: var(--primary); background: rgba(var(--primary-rgb), 0.08); }
.theme-preview { width: 30px; height: 30px; min-width: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
.theme-label { font-size: 13px; font-weight: 700; color: var(--text-main); }
.theme-btn.active .theme-label { color: var(--primary); }

/* style grid */
.style-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
.style-btn { display: flex; align-items: center; justify-content: center; padding: 14px; background: var(--bg-card); border: 2px solid var(--border-color); border-radius: 12px; cursor: pointer; transition: all 0.2s; }
.style-btn:hover { border-color: var(--primary); }
.style-btn.active { border-color: var(--primary); background: rgba(var(--primary-rgb), 0.08); }
.style-label { font-size: 14px; font-weight: 700; color: var(--text-main); }
.style-btn.active .style-label { color: var(--primary); }

/* dark mode */
.dark-mode-options { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.dark-mode-btn { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 14px 8px; background: var(--bg-card); border: 2px solid var(--border-color); border-radius: 12px; font-size: 12px; font-weight: 600; color: var(--text-secondary); cursor: pointer; transition: all 0.2s; }
.dark-mode-btn:hover { border-color: var(--primary); }
.dark-mode-btn.active { border-color: var(--primary); background: rgba(var(--primary-rgb), 0.08); color: var(--primary); }
.dark-mode-icon { font-size: 18px; }

/* language */
.language-options { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
.language-btn { padding: 14px; background: var(--bg-card); border: 2px solid var(--border-color); border-radius: 12px; font-size: 14px; font-weight: 600; color: var(--text-secondary); cursor: pointer; transition: all 0.2s; text-align: center; }
.language-btn:hover { border-color: var(--primary); }
.language-btn.active { border-color: var(--primary); background: rgba(var(--primary-rgb), 0.08); color: var(--primary); }

/* font size */
.font-size-options { display: flex; gap: 6px; }
.font-size-btn { padding: 8px 14px; background: var(--bg-card); border: 2px solid var(--border-color); border-radius: 8px; font-size: 13px; font-weight: 600; color: var(--text-secondary); cursor: pointer; transition: all 0.2s; }
.font-size-btn:hover { border-color: var(--primary); }
.font-size-btn.active { border-color: var(--primary); background: rgba(var(--primary-rgb), 0.08); color: var(--primary); }

/* switch */
.switch-btn { width: 48px; height: 28px; background: var(--border-color); border: none; border-radius: 14px; position: relative; cursor: pointer; transition: background 0.3s; flex-shrink: 0; }
.switch-btn.active { background: var(--primary); }
.switch-slider { position: absolute; top: 3px; left: 3px; width: 22px; height: 22px; background: var(--bg-card); border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: transform 0.3s; }
.switch-btn.active .switch-slider { transform: translateX(20px); }

/* custom theme */
.custom-theme-settings { margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--border-color); }
.collapse-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.collapse-title { font-size: 14px; font-weight: 700; color: var(--text-main); margin: 0; }
.collapse-btn { width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border: none; background: var(--border-color); border-radius: 6px; cursor: pointer; transition: all 0.2s; }
.collapse-btn.active { transform: rotate(180deg); }
.collapse-btn:hover { background: rgba(var(--primary-rgb), 0.15); }
.collapse-icon { width: 14px; height: 14px; color: var(--text-secondary); }
.collapse-content { animation: slideDown 0.25s ease; }
@keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
.custom-mode-options { display: flex; gap: 6px; }
.mode-btn { padding: 7px 14px; background: var(--bg-card); border: 2px solid var(--border-color); border-radius: 8px; font-size: 12px; font-weight: 600; color: var(--text-secondary); cursor: pointer; transition: all 0.2s; }
.mode-btn:hover { border-color: var(--primary); }
.mode-btn.active { border-color: var(--primary); background: rgba(var(--primary-rgb), 0.08); color: var(--primary); }
.color-input-group { display: flex; gap: 8px; align-items: center; }
.color-picker { width: 30px; height: 30px; border: none; border-radius: 6px; cursor: pointer; padding: 0; }
.color-input { flex: 1; min-width: 80px; padding: 6px 10px; border: 2px solid var(--border-color); border-radius: 6px; font-size: 12px; font-weight: 600; color: var(--text-main); background: var(--bg-main); transition: all 0.2s; }
.color-input:focus { outline: none; border-color: var(--primary); }

/* footer */
.settings-footer { padding: 16px 24px; border-top: 1px solid var(--border-color); background: var(--bg-glass); }
.reset-btn { width: 100%; padding: 12px; background: var(--danger-light); border: none; border-radius: 10px; font-size: 13px; font-weight: 600; color: var(--danger-text); cursor: pointer; transition: all 0.2s; }
.reset-btn:hover { background: rgba(var(--primary-rgb), 0.08); }

/* scrollbar */
.settings-content::-webkit-scrollbar { width: 4px; }
.settings-content::-webkit-scrollbar-track { background: transparent; }
.settings-content::-webkit-scrollbar-thumb { background: rgba(var(--primary-rgb), 0.2); border-radius: 2px; }

@media (max-width: 480px) {
  .settings-panel { width: 100%; }
  .settings-header { padding: 18px; }
  .settings-content { padding: 12px 14px; }
}
</style>
