<template>
  <div class="journal-page">
    <canvas class="particles-background" />
    <div class="journal-bg">
      <div class="gradient-orb orb-1" />
      <div class="gradient-orb orb-2" />
      <div class="gradient-orb orb-3" />
    </div>

    <div class="journal-container">
      <!-- 日期头 -->
      <div class="journal-date">
        <span class="date-day">{{ today.day }}</span>
        <span class="date-divider">·</span>
        <span class="date-month">{{ today.month }}</span>
        <span class="date-divider">·</span>
        <span class="date-emoji">{{ today.emoji }}</span>
      </div>

      <!-- 顶部档案卡（始终可见） -->
      <div class="sticky sticky-profile">
        <div class="sticky-fold" />
        <div class="sticky-tape" />
        <div class="profile-card-inner">
          <!-- 头像 + 信息 -->
          <div class="profile-main">
            <div class="avatar-upload" @click="triggerAvatarUpload" :title="t('点击更换头像')">
              <div class="avatar-ring">
                <div v-if="user.avatar" class="avatar-img" :style="{ backgroundImage: `url(${user.avatar})` }" />
                <svg v-else class="avatar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke-width="2" stroke-linecap="round"/>
                  <circle cx="12" cy="7" r="4" stroke-width="2"/>
                </svg>
                <div class="avatar-overlay"><span>📷</span></div>
              </div>
            </div>
            <input ref="avatarInput" type="file" accept="image/*" hidden @change="handleAvatarChange" />
            <div class="profile-info">
              <h2 class="j-name">{{ user.nickname || user.username || t('用户') }}</h2>
              <p class="j-bio">{{ user.bio || t('还没有写简介，点击档案标签添加吧 ✍️') }}</p>
              <p class="j-meta">{{ user.email || user.phone || t('未设置联系方式') }}</p>
            </div>
          </div>
          <!-- 统计 -->
          <div class="profile-stats">
            <div class="stat-chip"><span class="chip-num">{{ stats.days }}</span><span class="chip-label">{{ t('天') }}</span></div>
            <div class="stat-chip"><span class="chip-num">{{ stats.projects }}</span><span class="chip-label">{{ t('项目') }}</span></div>
            <div class="stat-chip"><span class="chip-num">{{ stats.active }}</span><span class="chip-label">{{ t('活跃') }}</span></div>
          </div>
        </div>
      </div>

      <!-- 标签导航 -->
      <div class="journal-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          :class="{ active: activeTab === tab.key }"
          @click="activeTab = tab.key"
        >{{ t(tab.label) }}</button>
      </div>

      <!-- 内容便利贴 -->
      <div class="sticky sticky-content" :key="activeTab">
        <div class="sticky-fold" />
        <div class="sticky-tape tape-2" />

        <!-- ===== 📋 档案 ===== -->
        <div v-if="activeTab === 'profile'" class="tab-profile">
          <h3 class="sticky-title">{{ t('📋 个人信息') }}</h3>
          <form @submit.prevent="handleUpdateProfile" class="j-form">
            <div class="field-row">
              <span class="field-emoji">📝</span>
              <input v-model="form.nickname" :placeholder="t('昵称')" :disabled="saving"
                @blur="validateField('nickname')" @input="clearError('nickname')" />
            </div>
            <p v-if="errors.nickname" class="field-error">{{ errors.nickname }}</p>

            <div class="field-row">
              <span class="field-emoji">💬</span>
              <textarea v-model="form.bio" :placeholder="t('写一句自我介绍…')" :disabled="saving"
                maxlength="200" rows="2"
                @blur="validateField('bio')" @input="clearError('bio')" />
            </div>
            <p v-if="errors.bio" class="field-error">{{ errors.bio }}</p>
            <div class="bio-count">{{ form.bio.length }}/200</div>

            <div class="field-row">
              <span class="field-emoji">📱</span>
              <input v-model="form.phone" :placeholder="t('手机号')" :disabled="saving"
                @blur="validateField('phone')" @input="clearError('phone')" />
              <span v-if="user.phone" class="field-badge ok">{{ t('已绑定') }}</span>
            </div>
            <p v-if="errors.phone" class="field-error">{{ errors.phone }}</p>

            <div class="field-row">
              <span class="field-emoji">📧</span>
              <input v-model="form.email" :placeholder="t('邮箱')" :disabled="saving"
                @blur="validateField('email')" @input="clearError('email')" />
              <span v-if="user.email" class="field-badge ok">{{ t('已绑定') }}</span>
            </div>
            <p v-if="errors.email" class="field-error">{{ errors.email }}</p>

            <div class="form-actions">
              <button type="button" class="j-btn-cancel" @click="resetForm" :disabled="saving">{{ t('撤销 ✗') }}</button>
              <button type="submit" class="j-btn" :disabled="saving">
                {{ saving ? t('保存中…') : t('记下来 ✍️') }}
              </button>
            </div>
          </form>
        </div>

        <!-- ===== 🔐 安全 ===== -->
        <div v-if="activeTab === 'security'" class="tab-security">
          <div class="sec-grid-2">
            <!-- 左栏：密码修改 -->
            <div class="sec-column">
              <div class="sec-section">
                <h3 class="sticky-title">{{ t('🔑 修改密码') }}</h3>
                <form @submit.prevent="handleChangePassword" class="j-form">
                  <div class="field-row">
                    <span class="field-emoji">🔒</span>
                    <input v-model="pwdForm.current" type="password" autocomplete="current-password" :placeholder="t('当前密码')" :disabled="saving" />
                  </div>
                  <div class="field-row">
                    <span class="field-emoji">🆕</span>
                    <input v-model="pwdForm.newPwd" type="password" autocomplete="new-password" :placeholder="t('新密码（至少6位）')" :disabled="saving" />
                  </div>
                  <div class="field-row">
                    <span class="field-emoji">✅</span>
                    <input v-model="pwdForm.confirm" type="password" autocomplete="new-password" :placeholder="t('确认新密码')" :disabled="saving" />
                  </div>
                  <p v-if="pwdError" class="field-error">{{ pwdError }}</p>
                  <button type="submit" class="j-btn-sm" :disabled="saving">
                    {{ saving ? '…' : t('更新密码 🔒') }}
                  </button>
                </form>
              </div>
            </div>

            <!-- 右栏：手机 + 邮箱绑定 -->
            <div class="sec-column">
              <div class="sec-section">
                <h3 class="sticky-title">{{ t('📱 手机管理') }}</h3>
                <div class="sec-row-display">
                  <span>{{ user.phone ? maskPhone(user.phone) : t('未绑定手机号') }}</span>
                  <button class="sec-link" @click="toggleBind('phone')">
                    {{ bindPanel.phoneOpen ? t('收起') : user.phone ? t('换绑') : t('绑定') }}
                  </button>
                </div>
                <div v-if="bindPanel.phoneOpen" class="bind-inline">
                  <div class="field-row">
                    <span class="field-emoji">📱</span>
                    <input v-model="bindPanel.phone" :placeholder="t('输入新手机号')" :disabled="saving" />
                  </div>
                  <div class="field-row">
                    <span class="field-emoji">📨</span>
                    <input v-model="bindPanel.phoneCode" :placeholder="t('验证码')" :disabled="saving" />
                    <button type="button" class="code-btn-inline" @click="sendCode('phone')" :disabled="codeSending">
                      {{ codeCountdown > 0 ? codeCountdown + 's' : t('发送') }}
                    </button>
                  </div>
                  <button class="j-btn-sm" @click="handleBindPhone" :disabled="saving">{{ t('确认绑定') }}</button>
                </div>
              </div>

              <div class="sec-divider" />

              <div class="sec-section">
                <h3 class="sticky-title">{{ t('📧 邮箱管理') }}</h3>
                <div class="sec-row-display">
                  <span>{{ user.email || t('未绑定邮箱') }}</span>
                  <button class="sec-link" @click="toggleBind('email')">
                    {{ bindPanel.emailOpen ? t('收起') : user.email ? t('换绑') : t('绑定') }}
                  </button>
                </div>
                <div v-if="bindPanel.emailOpen" class="bind-inline">
                  <div class="field-row">
                    <span class="field-emoji">📧</span>
                    <input v-model="bindPanel.email" :placeholder="t('输入新邮箱')" :disabled="saving" />
                  </div>
                  <div class="field-row">
                    <span class="field-emoji">📨</span>
                    <input v-model="bindPanel.emailCode" :placeholder="t('验证码')" :disabled="saving" />
                    <button type="button" class="code-btn-inline" @click="sendCode('email')" :disabled="codeSending">
                      {{ codeCountdown > 0 ? codeCountdown + 's' : t('发送') }}
                    </button>
                  </div>
                  <button class="j-btn-sm" @click="handleBindEmail" :disabled="saving">{{ t('确认绑定') }}</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ===== 🎨 偏好 ===== -->
        <div v-if="activeTab === 'preferences'" class="tab-preferences">
          <div class="pref-grid-2">
            <div class="pref-section">
              <h3 class="sticky-title">{{ t('🎨 主题色') }}</h3>
              <div class="theme-grid">
                <button
                  v-for="t in themeOptions"
                  :key="t.value"
                  :class="['theme-dot', { active: settingsStore.theme === t.value }]"
                  :style="{ background: t.color }"
                  :title="t(t.label)"
                  @click="settingsStore.setTheme(t.value)"
                />
              </div>
            </div>

            <div class="pref-section">
              <h3 class="sticky-title">{{ t('🌗 深色模式') }}</h3>
              <div class="option-row">
                <button
                  v-for="dm in darkModeOptions"
                  :key="dm.value"
                  :class="['opt-btn', { active: settingsStore.darkMode === dm.value }]"
                  @click="settingsStore.setDarkMode(dm.value)"
                >{{ t(dm.label) }}</button>
              </div>
            </div>

            <div class="pref-section">
              <h3 class="sticky-title">{{ t('🔤 字体大小') }}</h3>
              <div class="option-row">
                <button
                  v-for="fs in fontSizeOptions"
                  :key="fs.value"
                  :class="['opt-btn', { active: settingsStore.fontSize === fs.value }]"
                  @click="settingsStore.setFontSize(fs.value)"
                >{{ t(fs.label) }}</button>
              </div>
            </div>

            <div class="pref-section">
              <h3 class="sticky-title">{{ t('✨ 动画效果') }}</h3>
              <div class="toggle-row">
                <span>{{ settingsStore.animationEnabled ? t('已开启') : t('已关闭') }}</span>
                <button
                  :class="['toggle-switch', { on: settingsStore.animationEnabled }]"
                  @click="settingsStore.setAnimationEnabled(!settingsStore.animationEnabled)"
                ><span class="toggle-knob" /></button>
              </div>
            </div>

            <div class="pref-section pref-full">
              <h3 class="sticky-title">{{ t('🌐 语言') }}</h3>
              <div class="option-row">
                <button
                  v-for="lang in languageOptions"
                  :key="lang.value"
                  :class="['opt-btn', { active: settingsStore.language === lang.value }]"
                  @click="settingsStore.setLanguage(lang.value)"
                >{{ t(lang.label) }}</button>
              </div>
            </div>
          </div>
        </div>

        <!-- ===== 📊 数据 ===== -->
        <div v-if="activeTab === 'data'" class="tab-data">
          <!-- 活动热力图（全宽） -->
          <div class="data-section data-full">
            <h3 class="sticky-title">{{ t('🔥 活动热力图') }}</h3>
            <ContributionHeatmap :embedded="true" />
          </div>

          <div class="sec-divider" />

          <!-- 桌面双栏：项目 + 存储 -->
          <div class="data-grid-2">
            <div class="data-section">
              <h3 class="sticky-title">{{ t('📂 我的项目') }}</h3>
              <div class="project-minilist">
                <router-link
                  v-for="p in dataStore.projects.slice(0, 3)"
                  :key="p.id"
                  :to="'/projects/' + p.id"
                  class="proj-mini"
                >
                  <span class="proj-dot" /> {{ p.title }}
                </router-link>
              </div>
              <router-link to="/projects" class="view-all">{{ t('查看全部项目 →') }}</router-link>
            </div>

            <div class="data-section">
              <h3 class="sticky-title">{{ t('💾 存储概览') }}</h3>
              <div class="storage-bar-container">
                <div class="storage-bar">
                  <div class="storage-seg seg-avatar" :style="{ width: '15%' }" :title="t('头像')" />
                  <div class="storage-seg seg-files" :style="{ width: '25%' }" :title="t('文件')" />
                  <div class="storage-seg seg-cache" :style="{ width: '8%' }" :title="t('缓存')" />
                </div>
              </div>
              <div class="storage-legend">
                <span>{{ t('🖼️ 头像 1.5MB') }}</span>
                <span>{{ t('📄 文件 2.5MB') }}</span>
                <span>{{ t('🗑️ 缓存 0.8MB') }}</span>
                <span class="storage-free">{{ t('剩余 95.2MB') }}</span>
              </div>
            </div>
          </div>

          <div class="sec-divider" />

          <!-- 数据操作（全宽） -->
          <div class="data-section data-full">
            <h3 class="sticky-title">{{ t('⚙️ 数据管理') }}</h3>
            <div class="data-actions">
              <button class="j-btn-sm" @click="exportData">{{ t('📥 导出我的数据') }}</button>
              <button class="j-btn-sm danger" @click="confirmClearCache">{{ t('🗑️ 清除本地缓存') }}</button>
            </div>
            <div v-if="showClearConfirm" class="confirm-inline">
              <p>{{ t('确定要清除本地缓存吗？主题设置将保留。') }}</p>
              <div class="confirm-buttons">
                <button class="j-btn-cancel" @click="showClearConfirm = false">{{ t('取消') }}</button>
                <button class="j-btn-sm danger" @click="clearCache">{{ t('确认清除') }}</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部操作 -->
      <div class="sticky sticky-actions">
        <div class="sticky-fold" />
        <div class="action-grid">
          <div class="action-row">
            <button
              :class="['action-btn', 'logout-btn', { confirming: showLogoutConfirm }]"
              @click="triggerLogout"
            >
              {{ showLogoutConfirm ? t('再次点击确认退出') : t('🚪 退出登录') }}
            </button>
            <button v-if="showLogoutConfirm" class="action-cancel" @click="showLogoutConfirm = false">{{ t('取消') }}</button>
          </div>
          <div class="action-row">
            <button
              :class="['action-btn', 'delete-btn', { confirming: showDeleteConfirm }]"
              @click="triggerDelete"
            >
              {{ showDeleteConfirm ? t('⚠️ 此操作不可撤销，再次点击确认') : t('⚠️ 注销账户') }}
            </button>
          </div>
        </div>
        <div v-if="showDeleteConfirm" class="delete-verify">
          <div class="field-row">
            <span class="field-emoji">🔑</span>
            <input v-model="deletePassword" type="password" :placeholder="t('输入密码确认注销')" />
          </div>
          <div class="confirm-buttons">
            <button class="j-btn-cancel" @click="showDeleteConfirm = false; deletePassword = ''">{{ t('取消') }}</button>
            <button class="j-btn-sm danger" @click="handleDeleteAccount" :disabled="saving">{{ t('确认注销') }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from '../composables/useI18n.js';
const { t } = useI18n();
import { useUserStore } from '../stores/user.js';
import { useSettingsStore } from '../stores/settings.js';
import { useDataStore } from '../stores/data.js';
import { useParticles } from '../composables/useParticles.js';
import { useToast } from '../composables/useToast.js';
import ContributionHeatmap from '../components/ContributionHeatmap.vue';

const router = useRouter();
const userStore = useUserStore();
const settingsStore = useSettingsStore();
const dataStore = useDataStore();
const { showToast } = useToast();
useParticles('.particles-background');

const user = reactive({ username: '', nickname: '', phone: '', email: '', avatar: '', bio: '' });
const form = reactive({ nickname: '', phone: '', email: '', bio: '' });
const errors = reactive({ nickname: '', phone: '', email: '', bio: '' });
const saving = ref(false);
const activeTab = ref('profile');

const tabs = [
  { key: 'profile', label: '📋 档案' },
  { key: 'security', label: '🔐 安全' },
  { key: 'preferences', label: '🎨 偏好' },
  { key: 'data', label: '📊 数据' },
];

const themeOptions = [
  { value: 'journal',  label: '手账', color: 'linear-gradient(135deg, #C4737A, #B8956A)' },
  { value: 'ink',      label: '墨韵', color: 'linear-gradient(135deg, #3A3A3A, #C8493A)' },
  { value: 'aurora',   label: '极光', color: 'linear-gradient(135deg, #0D9488, #7C3AED)' },
  { value: 'sakura',   label: '樱吹雪', color: 'linear-gradient(135deg, #E890A0, #8FA88A)' },
  { value: 'forest',   label: '森语', color: 'linear-gradient(135deg, #7A8A60, #8B735A)' },
  { value: 'midnight', label: '午夜', color: 'linear-gradient(135deg, #1E3A5F, #C89840)' },
  { value: 'twilight', label: '暮光', color: 'linear-gradient(135deg, #E87A5E, #7A5E8B)' },
  { value: 'minimal',  label: '极简', color: 'linear-gradient(135deg, #2A2A2A, #4A7A9A)' },
  { value: 'custom',   label: '自定义', color: 'linear-gradient(135deg, #6366F1, #EC4899, #F59E0B)' },
];

const darkModeOptions = [
  { value: 'light', label: '☀️ 浅色' },
  { value: 'dark', label: '🌙 深色' },
  { value: 'auto', label: '💻 跟随系统' },
];

const fontSizeOptions = [
  { value: 'small', label: '小' },
  { value: 'medium', label: '中' },
  { value: 'large', label: '大' },
];

const languageOptions = [
  { value: 'zh-CN', label: '🇨🇳 中文' },
  { value: 'en-US', label: '🇺🇸 English' },
];

const validationRules = {
  nickname: (v) => (!v ? '' : v.length < 2 ? t('昵称至少2个字符') : v.length > 20 ? t('昵称最多20个字符') : ''),
  phone: (v) => (!v ? '' : !/^1[3-9]\d{9}$/.test(v) ? t('请输入正确的手机号') : ''),
  email: (v) => (!v ? '' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? t('请输入正确的邮箱地址') : ''),
  bio: (v) => (!v ? '' : v.length > 200 ? t('简介不能超过200字') : ''),
};

const validateField = (field) => { const v = form[field]; const validator = validationRules[field]; if (validator) errors[field] = validator(v); return !errors[field]; };
const clearError = (field) => { errors[field] = ''; };
const validateForm = () => { let ok = true; Object.keys(validationRules).forEach(f => { if (!validateField(f)) ok = false; }); return ok; };

const stats = computed(() => {
  const created = userStore.user?.createdAt ? new Date(userStore.user.createdAt) : new Date();
  const daysSince = Math.max(1, Math.floor((Date.now() - created.getTime()) / (1000 * 60 * 60 * 24)));
  const projectCount = dataStore.projects.length;
  let activeDays = 0;
  try { const cached = localStorage.getItem('winters_active_days'); if (cached) activeDays = parseInt(cached) || 0; } catch { /* ignore */ }
  const hasActiveDays = localStorage.getItem('winters_active_days') !== null;
  return { days: daysSince, projects: projectCount, active: hasActiveDays ? activeDays : Math.floor(daysSince * 0.6) };
});

const avatarInput = ref(null);
const triggerAvatarUpload = () => { avatarInput.value?.click(); };
const handleAvatarChange = (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  if (file.size > 1 * 1024 * 1024) { showToast(t('图片不能超过 1MB'), 'warning'); return; }
  const reader = new FileReader();
  reader.onload = (ev) => { user.avatar = ev.target.result; showToast(t('头像已更新 ✨'), 'success'); persistUser(); };
  reader.readAsDataURL(file);
  e.target.value = '';
};

const loadUserProfile = async () => {
  saving.value = true;
  try {
    await new Promise(r => setTimeout(r, 300));
    const info = userStore.user;
    if (info) {
      user.username = info.username || info.phone || t('用户');
      user.nickname = info.nickname || ''; user.phone = info.phone || ''; user.email = info.email || '';
      user.avatar = info.avatar || ''; user.bio = info.bio || '';
      form.nickname = user.nickname; form.phone = user.phone; form.email = user.email; form.bio = user.bio;
    }
  } catch { showToast(t('加载用户信息失败'), 'error'); }
  finally { saving.value = false; }
};

const persistUser = () => {
  const updated = { ...userStore.user, nickname: user.nickname, phone: user.phone, email: user.email, avatar: user.avatar, bio: user.bio };
  userStore.user = updated;
  localStorage.setItem('winters_user', JSON.stringify(updated));
};

const handleUpdateProfile = async () => {
  if (!validateForm()) { showToast(t('请检查表单信息'), 'warning'); return; }
  saving.value = true;
  try {
    await new Promise(r => setTimeout(r, 500));
    user.nickname = form.nickname; user.phone = form.phone; user.email = form.email; user.bio = form.bio;
    persistUser();
    showToast(t('个人信息更新成功 ✨'), 'success');
  } catch { showToast(t('更新失败，请重试'), 'error'); }
  finally { saving.value = false; }
};

const resetForm = () => {
  form.nickname = user.nickname; form.phone = user.phone; form.email = user.email; form.bio = user.bio;
  Object.keys(errors).forEach(f => { errors[f] = ''; });
};

const pwdForm = reactive({ current: '', newPwd: '', confirm: '' });
const pwdError = ref('');
const handleChangePassword = async () => {
  pwdError.value = '';
  if (!pwdForm.current) { pwdError.value = t('请输入当前密码'); return; }
  if (pwdForm.newPwd.length < 6) { pwdError.value = t('新密码至少6个字符'); return; }
  if (pwdForm.newPwd !== pwdForm.confirm) { pwdError.value = t('两次输入的密码不一致'); return; }
  saving.value = true;
  try {
    const token = localStorage.getItem('winters_token') || '';
    const res = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ old_password: pwdForm.current, new_password: pwdForm.newPwd })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || '修改失败');
    pwdForm.current = ''; pwdForm.newPwd = ''; pwdForm.confirm = '';
    showToast(t('密码修改成功 🔒'), 'success');
  } catch (e) { pwdError.value = e.message; }
  finally { saving.value = false; }
};

const bindPanel = reactive({ phoneOpen: false, emailOpen: false, phone: '', phoneCode: '', email: '', emailCode: '' });
const codeSending = ref(false);
const codeCountdown = ref(0);
let codeTimer = null;

const toggleBind = (type) => { if (type === 'phone') bindPanel.phoneOpen = !bindPanel.phoneOpen; else bindPanel.emailOpen = !bindPanel.emailOpen; };

const sendCode = async (type) => {
  if (codeCountdown.value > 0) return;
  codeSending.value = true;
  try {
    await new Promise(r => setTimeout(r, 300));
    codeCountdown.value = 60;
    codeTimer = setInterval(() => { codeCountdown.value--; if (codeCountdown.value <= 0) { clearInterval(codeTimer); codeTimer = null; } }, 1000);
    showToast(t('验证码已发送 📨'), 'success');
  } catch { showToast(t('发送失败，请重试'), 'error'); }
  finally { codeSending.value = false; }
};

const maskPhone = (phone) => { if (!phone || phone.length < 7) return phone; return phone.slice(0, 3) + '****' + phone.slice(-4); };

const handleBindPhone = async () => {
  if (!bindPanel.phone || !bindPanel.phoneCode) { showToast(t('请填写手机号和验证码'), 'warning'); return; }
  saving.value = true;
  try {
    await new Promise(r => setTimeout(r, 500));
    user.phone = bindPanel.phone; form.phone = bindPanel.phone;
    bindPanel.phone = ''; bindPanel.phoneCode = ''; bindPanel.phoneOpen = false;
    persistUser();
    showToast(t('手机号绑定成功 📱'), 'success');
  } catch { showToast(t('绑定失败，请重试'), 'error'); }
  finally { saving.value = false; }
};

const handleBindEmail = async () => {
  if (!bindPanel.email || !bindPanel.emailCode) { showToast(t('请填写邮箱和验证码'), 'warning'); return; }
  saving.value = true;
  try {
    await new Promise(r => setTimeout(r, 500));
    user.email = bindPanel.email; form.email = bindPanel.email;
    bindPanel.email = ''; bindPanel.emailCode = ''; bindPanel.emailOpen = false;
    persistUser();
    showToast(t('邮箱绑定成功 📧'), 'success');
  } catch { showToast(t('绑定失败，请重试'), 'error'); }
  finally { saving.value = false; }
};

const showClearConfirm = ref(false);
const exportData = () => {
  const data = { user: userStore.user, settings: JSON.parse(localStorage.getItem('winters_settings') || '{}'), exportedAt: new Date().toISOString() };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'winters-data-export.json'; a.click();
  URL.revokeObjectURL(url);
  showToast(t('数据导出成功 📥'), 'success');
};

const confirmClearCache = () => { showClearConfirm.value = true; };
const clearCache = () => {
  // 仅移除缓存类 key，保留用户/设置/认证数据
  const preserveKeys = ['winters_user', 'winters_settings', 'winters_token', 'winters_refresh_token', 'isLoggedIn', 'username'];
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && !preserveKeys.includes(key)) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(k => localStorage.removeItem(k));
  showClearConfirm.value = false;
  showToast(t('缓存已清除 🧹'), 'success');
  localStorage.setItem('winters_active_days', '0');
  localStorage.removeItem('winters_last_active');
};

const showLogoutConfirm = ref(false);
const triggerLogout = () => {
  if (!showLogoutConfirm.value) { showLogoutConfirm.value = true; return; }
  userStore.logout();
  showToast(t('已安全退出 👋'), 'success');
  setTimeout(() => router.push('/'), 500);
};

const showDeleteConfirm = ref(false);
const deletePassword = ref('');
const triggerDelete = () => { if (!showDeleteConfirm.value) { showDeleteConfirm.value = true; return; } };
const handleDeleteAccount = async () => {
  if (!deletePassword.value) { showToast(t('请输入密码确认'), 'warning'); return; }
  saving.value = true;
  try {
    await new Promise(r => setTimeout(r, 800));
    // 清除所有本地用户数据，模拟账户注销
    userStore.logout();
    localStorage.removeItem('winters_active_days');
    localStorage.removeItem('winters_last_active');
    showToast(t('本地账户数据已清除 💔'), 'info');
    setTimeout(() => router.push('/'), 500);
  } catch { showToast(t('注销失败，请重试'), 'error'); }
  finally { saving.value = false; }
};

const today = computed(() => {
  const d = new Date();
  const emojis = ['☀️', '🌈', '✨', '💫', '🌟', '🍀', '🎈'];
  return { day: d.getDate(), month: `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}`, emoji: emojis[d.getDay()] };
});

onMounted(async () => {
  if (!userStore.isLoggedIn) { router.push('/login'); return; }
  await loadUserProfile();
  try {
    const cached = parseInt(localStorage.getItem('winters_active_days') || '0');
    const todayKey = new Date().toISOString().slice(0, 10);
    const lastKey = localStorage.getItem('winters_last_active');
    if (lastKey !== todayKey) { localStorage.setItem('winters_active_days', String(cached + 1)); localStorage.setItem('winters_last_active', todayKey); }
  } catch { /* ignore */ }
});

onUnmounted(() => {
  if (codeTimer) { clearInterval(codeTimer); codeTimer = null; }
});
</script>

<style scoped>
/* ============================================================
   桌面优先 (Desktop-First) 响应式策略
   基准: 1920×1080 → 最大内容宽度 900px
   断点: ≤900px 平板 / ≤480px 手机
   颜色: 全部使用 CSS 主题变量，跟随全局主题
   ============================================================ */

/* ===== 页面基底 ===== */
.journal-page { min-height: 100vh; position: relative; overflow-x: hidden; padding: 80px 40px 60px; display: flex; justify-content: center; }
.particles-background { position: fixed; inset: 0; z-index: 1; pointer-events: none; }
.journal-bg { position: fixed; inset: 0; z-index: 0; background: var(--bg-main); }
.gradient-orb { position: absolute; border-radius: 50%; filter: blur(120px); opacity: 0.35; animation: float 22s ease-in-out infinite; }
.orb-1 { width: 500px; height: 500px; background: radial-gradient(circle, rgba(var(--primary-rgb), 0.15), transparent); top: -120px; left: -120px; }
.orb-2 { width: 450px; height: 450px; background: radial-gradient(circle, rgba(var(--secondary-rgb), 0.12), transparent); bottom: -100px; right: -100px; animation-delay: -8s; }
.orb-3 { width: 350px; height: 350px; background: radial-gradient(circle, rgba(var(--primary-rgb), 0.08), transparent); top: 55%; right: 25%; animation-delay: -15s; }

@keyframes float {
  0%,100% { transform: translate(0,0) scale(1); }
  33% { transform: translate(30px,-30px) scale(1.05); }
  66% { transform: translate(-20px,20px) scale(0.95); }
}

/* 桌面端容器：900px 最大宽度 */
.journal-container { position: relative; z-index: 2; max-width: 900px; width: 100%; display: flex; flex-direction: column; gap: 24px; animation: slideUp 0.8s cubic-bezier(0.16,1,0.3,1); }
@keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }

/* ===== 日期头 ===== */
.journal-date { text-align: center; font-family: 'Georgia', 'Noto Serif SC', serif; margin-bottom: 0; }
.date-day { font-size: 56px; font-weight: 700; color: var(--primary); line-height: 1; }
.date-divider { font-size: 36px; color: var(--text-secondary); margin: 0 8px; }
.date-month { font-size: 22px; color: var(--text-secondary); letter-spacing: 3px; }
.date-emoji { font-size: 40px; }

/* ===== 便利贴基底 ===== */
.sticky { position: relative; background: var(--bg-card); border-radius: 4px 20px 4px 20px; padding: 28px 32px 24px; box-shadow: var(--shadow-md); transition: transform 0.3s ease, box-shadow 0.3s ease; }
.sticky:hover { transform: rotate(0.2deg); box-shadow: var(--shadow-lg); }
.sticky-fold { position: absolute; top: 0; right: 0; width: 0; height: 0; border-style: solid; border-width: 0 28px 28px 0; border-color: transparent var(--border-color) transparent transparent; }
.sticky-tape { position: absolute; top: -12px; left: 50%; transform: translateX(-50%) rotate(-2deg); width: 70px; height: 22px; background: rgba(var(--primary-rgb), 0.15); border-radius: 2px; }
.tape-2 { transform: translateX(-50%) rotate(3deg); width: 55px; left: 45%; }
.sticky-title { font-size: 16px; font-weight: 700; color: var(--text-main); margin: 0 0 16px; font-family: 'Georgia','Noto Serif SC',serif; }

/* ===== 顶部档案卡 — 桌面横向布局 ===== */
.sticky-profile { padding: 24px 32px 20px; }
.profile-card-inner { display: flex; align-items: center; gap: 32px; }
.profile-main { display: flex; align-items: center; gap: 20px; flex: 1; min-width: 0; }

.avatar-upload { cursor: pointer; flex-shrink: 0; }
.avatar-ring { width: 88px; height: 88px; border-radius: 50%; padding: 3px; background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.7), rgba(var(--secondary-rgb), 0.7)); position: relative; }
.avatar-img, .avatar-icon { width: 100%; height: 100%; border-radius: 50%; color: var(--primary); }
.avatar-img { background-size: cover; background-position: center; }
.avatar-icon { padding: 14px; box-sizing: border-box; background: var(--bg-card); display: block; }
.avatar-overlay { position: absolute; inset: 3px; border-radius: 50%; background: rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.2s; font-size: 22px; }
.avatar-ring:hover .avatar-overlay { opacity: 1; }

.profile-info { flex: 1; min-width: 0; }
.j-name { font-size: 24px; font-weight: 700; color: var(--text-main); margin: 0 0 4px; font-family: 'Georgia','Noto Serif SC',serif; }
.j-bio { font-size: 14px; color: var(--text-secondary); margin: 0 0 4px; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.j-meta { font-size: 12px; color: var(--text-secondary); margin: 0; opacity: 0.7; }

/* 统计 — 桌面端放在档案卡右侧 */
.profile-stats { display: flex; gap: 14px; flex-shrink: 0; }
.stat-chip { width: 80px; text-align: center; background: rgba(var(--primary-rgb), 0.08); border-radius: 14px; padding: 12px 8px; }
.chip-num { display: block; font-size: 26px; font-weight: 700; color: var(--primary); }
.chip-label { font-size: 11px; color: var(--text-secondary); }

/* ===== 标签导航 ===== */
.journal-tabs { display: flex; gap: 8px; }
.journal-tabs button { flex: 1; padding: 12px 20px; border: none; background: rgba(var(--primary-rgb), 0.06); border-radius: 14px; font-size: 15px; color: var(--text-secondary); cursor: pointer; transition: all 0.25s; font-family: inherit; backdrop-filter: blur(4px); }
.journal-tabs button:hover { background: rgba(var(--primary-rgb), 0.12); color: var(--text-main); }
.journal-tabs button.active { background: linear-gradient(135deg, var(--primary), var(--primary-dark)); color: #fff; box-shadow: 0 4px 14px rgba(var(--primary-rgb), 0.3); }

/* ===== 内容便利贴 ===== */
.sticky-content { padding: 32px 36px 28px; min-height: 320px; }

/* ===== 表单 ===== */
.j-form { display: flex; flex-direction: column; gap: 10px; }
.field-row { display: flex; align-items: center; gap: 12px; border-bottom: 1.5px dashed var(--border-color); padding-bottom: 6px; }
.field-emoji { font-size: 20px; flex-shrink: 0; }
.field-row input, .field-row textarea { flex: 1; border: none; background: transparent; padding: 12px 0; font-size: 15px; color: var(--text-main); outline: none; font-family: inherit; resize: none; caret-color: var(--primary); }
.field-row input::placeholder, .field-row textarea::placeholder { color: var(--text-secondary); opacity: 0.6; }
.field-badge { font-size: 11px; padding: 2px 10px; border-radius: 10px; flex-shrink: 0; }
.field-badge.ok { background: var(--success-light); color: var(--success-text); }
.field-error { font-size: 12px; color: var(--danger-text); margin: -4px 0 0 32px; }
.bio-count { text-align: right; font-size: 11px; color: var(--text-secondary); margin-top: -4px; }
.form-actions { display: flex; gap: 12px; margin-top: 8px; }

/* 按钮 */
.j-btn { flex: 1; padding: 14px; border: none; background: linear-gradient(135deg, var(--primary), var(--primary-dark)); color: #fff; border-radius: 12px; font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: inherit; }
.j-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(var(--primary-rgb), 0.35); }
.j-btn:disabled { opacity: 0.6; }
.j-btn-cancel { flex: 1; padding: 14px; border: 1px solid var(--border-color); background: transparent; color: var(--text-secondary); border-radius: 12px; font-size: 14px; cursor: pointer; transition: all 0.2s; font-family: inherit; }
.j-btn-cancel:hover { background: rgba(var(--primary-rgb), 0.05); }
.j-btn-sm { padding: 11px 22px; border: none; background: linear-gradient(135deg, var(--primary), var(--primary-dark)); color: #fff; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: inherit; align-self: flex-start; }
.j-btn-sm:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(var(--primary-rgb), 0.3); }
.j-btn-sm:disabled { opacity: 0.6; }
.j-btn-sm.danger { background: linear-gradient(135deg, var(--danger), var(--danger-text)); }
.j-btn-sm.danger:hover:not(:disabled) { box-shadow: 0 4px 14px rgba(220,80,80,0.35); }

/* ===== 安全 — 桌面双栏 ===== */
.sec-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0 32px; }
.sec-column { display: flex; flex-direction: column; }
.sec-section { margin-bottom: 4px; }
.sec-divider { height: 1px; border: none; border-top: 1.5px dashed var(--border-color); margin: 18px 0; }
.sec-row-display { display: flex; align-items: center; justify-content: space-between; padding: 8px 0; font-size: 14px; color: var(--text-main); }
.sec-link { background: none; border: 1px solid var(--border-color); border-radius: 6px; padding: 5px 14px; font-size: 12px; color: var(--text-secondary); cursor: pointer; transition: all 0.2s; font-family: inherit; }
.sec-link:hover { background: rgba(var(--primary-rgb), 0.05); }
.bind-inline { margin-top: 14px; padding: 16px; background: rgba(var(--primary-rgb), 0.04); border-radius: 10px; display: flex; flex-direction: column; gap: 10px; }
.code-btn-inline { background: none; border: 1px solid var(--border-color); border-radius: 6px; padding: 6px 14px; font-size: 12px; color: var(--text-secondary); cursor: pointer; flex-shrink: 0; white-space: nowrap; font-family: inherit; transition: all 0.2s; }
.code-btn-inline:hover:not(:disabled) { background: rgba(var(--primary-rgb), 0.05); }
.code-btn-inline:disabled { opacity: 0.5; }

/* ===== 偏好 — 桌面双栏网格 ===== */
.pref-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 32px; }
.pref-section { margin-bottom: 16px; }
.pref-section.pref-full { grid-column: 1 / -1; }
.pref-section:last-child { margin-bottom: 0; }
.theme-grid { display: flex; gap: 10px; flex-wrap: wrap; }
.theme-dot { width: 38px; height: 38px; border-radius: 10px; border: 2px solid transparent; cursor: pointer; transition: all 0.2s; padding: 0; flex-shrink: 0; }
.theme-dot:hover { transform: scale(1.15); }
.theme-dot.active { border-color: var(--text-main); box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.25); }

.option-row { display: flex; gap: 8px; }
.opt-btn { flex: 1; padding: 11px 8px; border: 1.5px solid var(--border-color); background: transparent; border-radius: 10px; font-size: 13px; color: var(--text-secondary); cursor: pointer; transition: all 0.2s; font-family: inherit; }
.opt-btn:hover { border-color: var(--primary); color: var(--text-main); }
.opt-btn.active { background: linear-gradient(135deg, var(--primary), var(--primary-dark)); color: #fff; border-color: transparent; }

.toggle-row { display: flex; align-items: center; justify-content: space-between; font-size: 14px; color: var(--text-main); }
.toggle-switch { width: 50px; height: 28px; border-radius: 14px; border: none; background: var(--border-color); cursor: pointer; position: relative; transition: background 0.2s; }
.toggle-switch.on { background: var(--success); }
.toggle-knob { position: absolute; top: 3px; left: 3px; width: 22px; height: 22px; border-radius: 50%; background: #fff; transition: transform 0.2s; }
.toggle-switch.on .toggle-knob { transform: translateX(22px); }

/* ===== 数据 — 桌面双栏 ===== */
.data-section { margin-bottom: 4px; }
.data-full { grid-column: 1 / -1; }
.data-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0 32px; }
.project-minilist { display: flex; flex-direction: column; gap: 8px; }
.proj-mini { display: flex; align-items: center; gap: 10px; font-size: 14px; color: var(--text-main); text-decoration: none; padding: 10px 14px; border-radius: 8px; background: rgba(var(--primary-rgb), 0.05); transition: all 0.2s; }
.proj-mini:hover { background: rgba(var(--primary-rgb), 0.1); }
.proj-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--primary); flex-shrink: 0; }
.view-all { display: block; margin-top: 12px; font-size: 13px; color: var(--text-secondary); text-decoration: none; text-align: right; }
.view-all:hover { color: var(--primary); }

.storage-bar-container { margin: 10px 0; }
.storage-bar { height: 10px; border-radius: 5px; background: var(--border-color); display: flex; overflow: hidden; }
.storage-seg { height: 100%; }
.seg-avatar { background: var(--primary); }
.seg-files { background: rgba(var(--primary-rgb), 0.6); }
.seg-cache { background: rgba(var(--primary-rgb), 0.3); }
.storage-legend { display: flex; flex-wrap: wrap; gap: 8px 20px; font-size: 12px; color: var(--text-secondary); }
.storage-free { color: var(--success-text); }

.data-actions { display: flex; gap: 12px; flex-wrap: wrap; }

.confirm-inline { margin-top: 14px; padding: 16px; background: rgba(220,80,80,0.05); border-radius: 10px; border: 1px dashed rgba(220,80,80,0.3); }
.confirm-inline p { font-size: 13px; color: var(--text-secondary); margin: 0 0 12px; }
.confirm-buttons { display: flex; gap: 8px; }

/* ===== 底部操作 — 桌面横向 ===== */
.sticky-actions { padding: 18px 32px; }
.action-grid { display: flex; gap: 16px; }
.action-row { display: flex; align-items: center; gap: 10px; flex: 1; }
.action-btn { flex: 1; padding: 12px; border: none; border-radius: 10px; font-size: 14px; cursor: pointer; transition: all 0.2s; font-family: inherit; font-weight: 600; }
.logout-btn { background: var(--danger-light); color: var(--danger-text); }
.logout-btn:hover { background: rgba(var(--primary-rgb), 0.1); }
.logout-btn.confirming { background: var(--danger); color: #fff; animation: pulse 0.8s ease-in-out infinite; }
.action-cancel { background: none; border: 1px solid var(--border-color); border-radius: 6px; padding: 8px 14px; font-size: 12px; color: var(--text-secondary); cursor: pointer; font-family: inherit; }
.delete-btn { background: transparent; color: var(--text-secondary); font-weight: 400; font-size: 13px; opacity: 0.7; }
.delete-btn:hover { color: var(--text-main); opacity: 1; }
.delete-btn.confirming { color: var(--danger); opacity: 1; }
.delete-verify { margin-top: 12px; padding: 16px; background: rgba(220,80,80,0.04); border-radius: 10px; border: 1px dashed rgba(220,80,80,0.3); display: flex; flex-direction: column; gap: 10px; }

@keyframes pulse {
  0%,100% { opacity: 1; }
  50% { opacity: 0.85; }
}

@media (prefers-reduced-motion: reduce) {
  .gradient-orb { animation: none; }
  .journal-container { animation: none; opacity: 1; transform: none; }
}

/* ============================================================
   响应式：平板 (≤900px) — 部分双栏折叠为单栏
   ============================================================ */
@media (max-width: 900px) {
  .journal-page { padding: 70px 20px 50px; }
  .journal-container { max-width: 600px; gap: 20px; }
  .profile-card-inner { flex-direction: column; align-items: stretch; gap: 18px; }
  .profile-stats { justify-content: center; }
  .stat-chip { flex: 1; width: auto; }
  .sec-grid-2, .pref-grid-2, .data-grid-2 { grid-template-columns: 1fr; gap: 0; }
  .sec-grid-2 .sec-divider { display: block; }
  .sticky { padding: 24px 24px 20px; }
  .sticky-content { padding: 28px 24px 24px; min-height: 260px; }
  .date-day { font-size: 48px; }
  .action-grid { flex-direction: column; gap: 8px; }
}

/* ============================================================
   响应式：手机 (≤480px) — 全单栏紧凑
   ============================================================ */
@media (max-width: 480px) {
  .journal-page { padding: 60px 10px 36px; }
  .journal-container { max-width: 100%; gap: 16px; }
  .date-day { font-size: 40px; }
  .date-divider { font-size: 26px; margin: 0 4px; }
  .date-month { font-size: 17px; letter-spacing: 1px; }
  .date-emoji { font-size: 30px; }
  .sticky { padding: 18px 14px 14px; border-radius: 4px 14px 4px 14px; }
  .sticky-profile { padding: 16px 16px 14px; }
  .sticky-content { padding: 22px 16px 18px; min-height: auto; }
  .sticky-actions { padding: 14px 16px; }
  .avatar-ring { width: 68px; height: 68px; }
  .j-name { font-size: 20px; }
  .stat-chip { padding: 8px 4px; }
  .chip-num { font-size: 20px; }
  .journal-tabs button { font-size: 12px; padding: 9px 6px; }
  .theme-grid { gap: 8px; }
  .theme-dot { width: 32px; height: 32px; }
  .profile-card-inner { gap: 14px; }
  .profile-main { gap: 12px; }
}
</style>
