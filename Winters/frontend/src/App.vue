<template>
  <div class="app" :class="{ 'no-padding': $route.meta.fullWidth }">
    <Header />
    <main
      id="main-content"
      role="main"
      :class="{ 'full-width': $route.meta.fullWidth }"
    >
      <router-view v-slot="{ Component }">
        <transition
          name="fade"
          mode="out-in"
        >
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <Footer v-if="!$route.meta.fullWidth" />
    <BackToTop v-if="!$route.meta.fullWidth" />
    <ToastNotification />
    <div
      v-if="settingsPanelOpen"
      class="settings-overlay"
      @click="closeSettingsPanel"
    />
    <SettingsPanel
      :is-open="settingsPanelOpen"
      @close="closeSettingsPanel"
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import BackToTop from './components/BackToTop.vue';
import ToastNotification from './components/ToastNotification.vue';
import SettingsPanel from './components/SettingsPanel.vue';

const route = useRoute();
const settingsPanelOpen = ref(false);

const openSettingsPanel = () => {
  settingsPanelOpen.value = true;
  console.log('Settings panel opened');
};

const closeSettingsPanel = () => {
  settingsPanelOpen.value = false;
};

const handleOpenSettings = () => {
  openSettingsPanel();
  console.log('Open settings event handled');
};

onMounted(() => {
  window.openSettingsPanel = openSettingsPanel;
  window.addEventListener('openSettings', handleOpenSettings);
});

onUnmounted(() => {
  window.removeEventListener('openSettings', handleOpenSettings);
  delete window.openSettingsPanel;
});

watch(() => route.meta.fullWidth, (isFullWidth) => {
  if (isFullWidth) {
    document.body.classList.add('full-screen');
  } else {
    document.body.classList.remove('full-screen');
  }
}, { immediate: true });
</script>

<style>
/* 全局样式修复 body 边距 */
body.full-screen {
  padding-top: 0 !important;
  overflow: hidden;
}
</style>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
  width: 100%;
  max-width: 1420px;
  min-width: 320px;
  margin: 0 auto 40px;
  padding: 0 24px;
  box-sizing: border-box;
}

main.full-width {
  max-width: none;
  margin: 0;
  padding: 0;
}

@media (max-width: 768px) {
  main {
    padding: 0 16px;
    margin: 0 auto 24px;
  }

  main.full-width {
    padding: 0;
    margin: 0;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.settings-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1999;
}
</style>