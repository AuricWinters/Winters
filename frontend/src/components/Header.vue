<template>
  <header
    class="main-header"
    role="banner"
  >
    <h1 id="navbar-title">
      WINTERS
    </h1>
    <nav
      role="navigation"
      :aria-label="t('主导航')"
    >
      <div
        ref="navGroup"
        class="glass-radio-group"
        role="tablist"
        @mouseleave="moveGliderToActive"
        @focusout="handleFocusOut"
      >
        <router-link
          to="/"
          class="nav-item"
          :class="{ active: $route.path === '/' }"
          role="tab"
          :aria-selected="$route.path === '/'"
          @mouseenter="moveGliderTo($event)"
          @focus="moveGliderTo($event)"
        >
          {{ t('首页') }}
        </router-link>
        <router-link
          to="/blog"
          class="nav-item"
          :class="{ active: $route.path === '/blog' }"
          role="tab"
          :aria-selected="$route.path === '/blog'"
          @mouseenter="moveGliderTo($event)"
          @focus="moveGliderTo($event)"
        >
          {{ t('动态') }}
        </router-link>
        <router-link
          to="/community"
          class="nav-item"
          :class="{ active: $route.path.startsWith('/community') }"
          role="tab"
          :aria-selected="$route.path.startsWith('/community')"
          @mouseenter="moveGliderTo($event)"
          @focus="moveGliderTo($event)"
        >
          {{ t('社区') }}
        </router-link>
        <router-link
          to="/drive"
          class="nav-item"
          :class="{ active: $route.path === '/drive' }"
          role="tab"
          :aria-selected="$route.path === '/drive'"
          @mouseenter="moveGliderTo($event)"
          @focus="moveGliderTo($event)"
        >
          {{ t('云盘') }}
        </router-link>
        <router-link
          to="/lab"
          class="nav-item"
          :class="{ active: $route.path.startsWith('/lab') }"
          role="tab"
          :aria-selected="$route.path.startsWith('/lab')"
          @mouseenter="moveGliderTo($event)"
          @focus="moveGliderTo($event)"
        >
          {{ t('实验室') }}
        </router-link>
        <router-link
          to="/ai"
          class="nav-item"
          :class="{ active: $route.path === '/ai' }"
          role="tab"
          :aria-selected="$route.path === '/ai'"
          @mouseenter="moveGliderTo($event)"
          @focus="moveGliderTo($event)"
        >
          {{ t('AI 聊天') }}
        </router-link>
        <router-link
          to="/projects"
          class="nav-item"
          :class="{ active: $route.path.startsWith('/projects') }"
          role="tab"
          :aria-selected="$route.path.startsWith('/projects')"
          @mouseenter="moveGliderTo($event)"
          @focus="moveGliderTo($event)"
        >
          {{ t('项目') }}
        </router-link>

        <router-link
          to="/contact"
          class="nav-item"
          :class="{ active: $route.path === '/contact' }"
          role="tab"
          :aria-selected="$route.path === '/contact'"
          @mouseenter="moveGliderTo($event)"
          @focus="moveGliderTo($event)"
        >
          {{ t('联系我') }}
        </router-link>
        <div
          class="glass-glider"
          aria-hidden="true"
          :style="gliderStyle"
        />
      </div>
    </nav>
    <div
      id="auth-button-container"
      role="region"
      aria-label="用户认证"
      style="position: relative; z-index: 10000;"
    >
      <button
        v-if="!userStore.isLoggedIn"
        class="login-btn"
        @click="goToLogin"
      >
        {{ t('登录') }}
      </button>
      <div
        v-else
        class="user-menu"
        style="position: relative; z-index: 10000;"
      >
        <button
          class="user-avatar"
          :class="{ active: userMenuOpen }"
          style="cursor: pointer; z-index: 10001; position: relative;"
          @click="toggleUserMenu"
        >
          <img
            v-if="userStore.user?.avatar"
            :src="userStore.user.avatar"
            :alt="userStore.username"
            class="avatar-img"
          >
          <div
            v-else
            class="avatar-placeholder"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <circle
                cx="12"
                cy="7"
                r="4"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <span class="username">{{ userStore.username }}</span>
          <span
            class="menu-arrow"
            :class="{ active: userMenuOpen }"
          />
        </button>
        <div
          class="user-dropdown"
          :class="{ show: userMenuOpen }"
        >
          <button
            class="dropdown-item"
            @click="openSettings"
          >
            <svg
              class="item-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle
                cx="12"
                cy="12"
                r="3"
              />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            {{ t('设置') }}
          </button>
          <router-link
            to="/profile"
            class="dropdown-item"
            @click="closeUserMenu"
          >
            <svg
              class="item-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <circle
                cx="12"
                cy="7"
                r="4"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            {{ t('个人中心') }}
          </router-link>
          <div class="dropdown-divider" />
          <button
            class="dropdown-item logout"
            @click="logout"
          >
            <svg
              class="item-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <polyline
                points="16 17 21 12 16 7"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <line
                x1="21"
                y1="12"
                x2="9"
                y2="12"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            {{ t('退出登录') }}
          </button>
        </div>
      </div>
    </div>
    <button
      class="mobile-menu-toggle"
      :aria-label="t('打开菜单')"
      :aria-expanded="mobileMenuOpen"
      aria-controls="mobile-nav"
      @click="toggleMobileMenu"
    >
      <span
        class="hamburger-icon"
        :class="{ active: mobileMenuOpen }"
      >
        <span />
        <span />
        <span />
      </span>
    </button>
  </header>

  <div
    class="mobile-nav-overlay"
    :class="{ show: mobileMenuOpen }"
    aria-hidden="!mobileMenuOpen"
    @click="closeMobileMenu"
  />
  <nav
    id="mobile-nav"
    class="mobile-nav"
    role="navigation"
    :aria-label="t('移动端导航')"
    :class="{ show: mobileMenuOpen }"
  >
    <router-link
      to="/"
      class="nav-item"
      :class="{ active: $route.path === '/' }"
      @click="closeMobileMenu"
    >
      {{ t('首页') }}
    </router-link>
    <router-link
      to="/blog"
      class="nav-item"
      :class="{ active: $route.path === '/blog' }"
      @click="closeMobileMenu"
    >
      {{ t('动态') }}
    </router-link>
    <router-link
      to="/drive"
      class="nav-item"
      :class="{ active: $route.path === '/drive' }"
      @click="closeMobileMenu"
    >
      {{ t('云盘') }}
    </router-link>
    <router-link
      to="/lab"
      class="nav-item"
      :class="{ active: $route.path.startsWith('/lab') }"
      @click="closeMobileMenu"
    >
      {{ t('实验室') }}
    </router-link>
    <router-link
      to="/ai"
      class="nav-item"
      :class="{ active: $route.path === '/ai' }"
      @click="closeMobileMenu"
    >
      {{ t('AI 聊天') }}
    </router-link>
    <router-link
      to="/projects"
      class="nav-item"
      :class="{ active: $route.path.startsWith('/projects') }"
      @click="closeMobileMenu"
    >
      {{ t('项目') }}
    </router-link>

    <router-link
      to="/contact"
      class="nav-item"
      :class="{ active: $route.path === '/contact' }"
      @click="closeMobileMenu"
    >
      {{ t('联系我') }}
    </router-link>
  </nav>
</template>

<script setup>
import { ref, reactive, onMounted, watch, onUnmounted, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '../stores/user.js';
import { useToast } from '../composables/useToast.js';
import { useI18n } from '../composables/useI18n.js';
const { t } = useI18n();

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const { showToast } = useToast();
const mobileMenuOpen = ref(false);
const userMenuOpen = ref(false);
const navGroup = ref(null);

// Glider 响应式状态
const gliderStyle = reactive({
  width: '0px',
  transform: 'translateX(0px)',
});

// 导航栏动画激活状态 - 用于控制雪花加速
const isNavAnimating = ref(false);
let navAnimationTimer = null;

// 设置导航栏动画状态
const setNavAnimating = (value) => {
  isNavAnimating.value = value;

  if (navAnimationTimer) {
    clearTimeout(navAnimationTimer);
  }

  if (value) {
    navAnimationTimer = setTimeout(() => {
      isNavAnimating.value = false;
    }, 1000);
  }
};

// 将 glider 移动到指定元素
const moveGliderToEl = (el) => {
  if (!el) return;
  setNavAnimating(true);
  requestAnimationFrame(() => {
    gliderStyle.width = `${el.offsetWidth}px`;
    gliderStyle.transform = `translateX(${el.offsetLeft - 5}px)`;
  });
};

// 事件处理器：鼠标进入/聚焦导航项
const moveGliderTo = (event) => {
  moveGliderToEl(event.currentTarget);
};

// 鼠标离开导航组时回到当前激活项
const moveGliderToActive = () => {
  if (!navGroup.value) return;
  const activeItem = navGroup.value.querySelector('.nav-item.active');
  moveGliderToEl(activeItem);
};

// focusout 处理器
const handleFocusOut = (e) => {
  if (!navGroup.value.contains(e.relatedTarget)) {
    moveGliderToActive();
  }
};

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
};

const goToLogin = () => {
  router.push('/login');
};

const toggleUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value;

};

const openSettings = () => {
  closeUserMenu();
  if (window.openSettingsPanel) {
    window.openSettingsPanel();
  } else {
    console.error('window.openSettingsPanel is not defined');
    // 尝试触发自定义事件作为备选方案
    window.dispatchEvent(new Event('openSettings'));
  }
};

const closeUserMenu = () => {
  userMenuOpen.value = false;
};

const logout = () => {
  userStore.logout();
  showToast(t('已成功登出'), 'success');
  closeUserMenu();
  setTimeout(() => {
    router.push('/');
  }, 500);
};

// 全局点击事件处理器，用于关闭用户菜单
const handleGlobalClick = (event) => {
  const userMenu = document.querySelector('.user-menu');
  if (userMenu && !userMenu.contains(event.target)) {
    closeUserMenu();
  }
};

// 初始化导航滑块位置
const initNavGlider = () => {
  nextTick(() => {
    if (!navGroup.value) return;
    const activeItem = navGroup.value.querySelector('.nav-item.active');
    moveGliderToEl(activeItem);
  });
};

onMounted(() => {
  // 监听全局鼠标移动，用于更新雪花背景的鼠标坐标
  document.addEventListener('mousemove', (e) => {
    if (!window.mouse) window.mouse = { x: null, y: null };
    window.mouse.x = e.clientX;
    window.mouse.y = e.clientY;
  });

  // 添加全局点击事件监听器，用于关闭用户菜单
  document.addEventListener('click', handleGlobalClick);

  initNavGlider();
});

// 清理资源
onUnmounted(() => {
  if (navAnimationTimer) {
    clearTimeout(navAnimationTimer);
    navAnimationTimer = null;
  }
  // 移除全局点击事件监听器
  document.removeEventListener('click', handleGlobalClick);
});

// 监听路由变化，更新导航状态
watch(
  () => route.path,
  () => {
    setTimeout(() => {
      initNavGlider();
    }, 100);
  }
);
</script>

<style scoped>
/* 头部样式已在main.css中定义 */

/* 用户菜单样式 */
.user-menu {
  position: relative;
  z-index: 10000;
}

.user-avatar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--bg-glass);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid var(--border-color);
  position: relative;
  z-index: 10001;
  min-width: 100px;
}

.user-avatar:hover {
  background: rgba(var(--primary-rgb), 0.12);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.user-avatar.active {
  background: rgba(var(--primary-rgb), 0.12);
  border-color: rgba(var(--primary-rgb), 0.3);
}

.avatar-img {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(135deg, #EC4899, #F59E0B);
}

.avatar-placeholder svg {
  width: 16px;
  height: 16px;
  color: white;
  stroke: currentColor;
  fill: none;
}

.user-avatar .username {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100px;
}

.menu-arrow {
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid #64748b;
  transition: transform 0.3s ease;
}

.menu-arrow.active {
  transform: rotate(180deg);
}

/* 下拉菜单样式 */
.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  width: 200px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(236, 72, 153, 0.1);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 10000;
}

.user-dropdown.show {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  box-sizing: border-box;
}

.dropdown-item:hover {
  background: rgba(236, 72, 153, 0.05);
  color: #EC4899;
}

.dropdown-item.logout:hover {
  background: rgba(239, 68, 68, 0.05);
  color: #ef4444;
}

.item-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.dropdown-divider {
  height: 1px;
  background: rgba(226, 232, 240, 1);
  margin: 8px 16px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .user-avatar .username {
    display: none;
  }

  .user-avatar {
    padding: 8px;
  }

  .user-dropdown {
    right: 0;
    width: 180px;
  }
}

</style>