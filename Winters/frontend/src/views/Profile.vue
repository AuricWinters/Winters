<template>
  <div class="profile-page">
    <!-- 粒子背景 -->
    <canvas class="particles-background" />

    <!-- 动态背景 -->
    <div class="profile-background">
      <div class="gradient-orb orb-1" />
      <div class="gradient-orb orb-2" />
      <div class="gradient-orb orb-3" />
      <div class="grid-pattern" />
    </div>

    <!-- 主容器 -->
    <div class="profile-container">
      <!-- 页面标题 -->
      <div class="page-header">
        <h1 class="page-title">个人中心</h1>
        <p class="page-subtitle">管理您的个人信息和账户设置</p>
      </div>

      <!-- 个人信息卡片 -->
      <div class="profile-card">
        <!-- 头像区域 -->
        <div class="avatar-section">
          <button class="avatar-button" @click="openSettingsPanel" title="点击打开设置">
            <div class="avatar-container">
              <img
                v-if="user.avatar"
                :src="user.avatar"
                alt="头像"
                class="user-avatar"
              >
              <div v-else class="avatar-placeholder">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke-width="2" stroke-linecap="round"/>
                  <circle cx="12" cy="7" r="4" stroke-width="2"/>
                </svg>
              </div>
            </div>
          </button>
          <h2 class="user-name">{{ user.username || '用户' }}</h2>
          <p class="user-email">{{ user.email || '未设置邮箱' }}</p>
        </div>

        <!-- 信息编辑表单 -->
        <form class="profile-form" @submit.prevent="handleUpdateProfile">
          <div class="form-section">
            <h3 class="section-title">基本信息</h3>
            
            <div class="form-group">
              <label class="form-label">昵称</label>
              <div class="input-wrapper">
                <input
                  v-model="form.nickname"
                  type="text"
                  placeholder="请输入昵称"
                  :disabled="isLoading"
                  @blur="validateField('nickname')"
                  @input="clearError('nickname')"
                >
              </div>
              <span v-if="errors.nickname" class="error-message">{{ errors.nickname }}</span>
            </div>

            <div class="form-group">
              <label class="form-label">手机号</label>
              <div class="input-wrapper">
                <input
                  v-model="form.phone"
                  type="tel"
                  placeholder="请输入手机号"
                  :disabled="isLoading"
                  @blur="validateField('phone')"
                  @input="clearError('phone')"
                >
              </div>
              <span v-if="errors.phone" class="error-message">{{ errors.phone }}</span>
            </div>

            <div class="form-group">
              <label class="form-label">邮箱</label>
              <div class="input-wrapper">
                <input
                  v-model="form.email"
                  type="email"
                  placeholder="请输入邮箱"
                  :disabled="isLoading"
                  @blur="validateField('email')"
                  @input="clearError('email')"
                >
              </div>
              <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
            </div>
          </div>

          <div class="form-section">
            <h3 class="section-title">密码设置</h3>
            
            <div class="form-group">
              <label class="form-label">当前密码</label>
              <div class="input-wrapper">
                <input
                  v-model="form.currentPassword"
                  type="password"
                  placeholder="请输入当前密码"
                  :disabled="isLoading"
                  @blur="validateField('currentPassword')"
                  @input="clearError('currentPassword')"
                >
              </div>
              <span v-if="errors.currentPassword" class="error-message">{{ errors.currentPassword }}</span>
            </div>

            <div class="form-group">
              <label class="form-label">新密码</label>
              <div class="input-wrapper">
                <input
                  v-model="form.newPassword"
                  type="password"
                  placeholder="请输入新密码"
                  :disabled="isLoading"
                  @blur="validateField('newPassword')"
                  @input="clearError('newPassword')"
                >
              </div>
              <span v-if="errors.newPassword" class="error-message">{{ errors.newPassword }}</span>
            </div>

            <div class="form-group">
              <label class="form-label">确认新密码</label>
              <div class="input-wrapper">
                <input
                  v-model="form.confirmPassword"
                  type="password"
                  placeholder="请确认新密码"
                  :disabled="isLoading"
                  @blur="validateField('confirmPassword')"
                  @input="clearError('confirmPassword')"
                >
              </div>
              <span v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</span>
            </div>
          </div>

          <div class="form-actions">
            <button
              type="submit"
              class="btn-primary"
              :disabled="isLoading"
            >
              <span v-if="!isLoading">保存修改</span>
              <span v-else class="loading-spinner"></span>
            </button>
            <button
              type="button"
              class="btn-secondary"
              @click="resetForm"
              :disabled="isLoading"
            >
              取消
            </button>
          </div>
        </form>
      </div>

      <!-- 账户安全 -->
      <div class="security-card">
        <h3 class="section-title">账户安全</h3>
        <div class="security-item">
          <div class="security-info">
            <span class="security-label">登录密码</span>
            <span class="security-status">已设置</span>
          </div>
          <button class="security-action">修改</button>
        </div>
        <div class="security-item">
          <div class="security-info">
            <span class="security-label">手机号</span>
            <span class="security-status">{{ user.phone ? '已绑定' : '未绑定' }}</span>
          </div>
          <button class="security-action">{{ user.phone ? '修改' : '绑定' }}</button>
        </div>
        <div class="security-item">
          <div class="security-info">
            <span class="security-label">邮箱</span>
            <span class="security-status">{{ user.email ? '已绑定' : '未绑定' }}</span>
          </div>
          <button class="security-action">{{ user.email ? '修改' : '绑定' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user.js';
import { useParticles } from '../composables/useParticles.js';
import { useToast } from '../composables/useToast.js';

const router = useRouter();
const userStore = useUserStore();
const { showToast } = useToast();

// 粒子背景
useParticles('.particles-background');

// 用户信息
const user = reactive({
  username: '',
  nickname: '',
  phone: '',
  email: '',
  avatar: ''
});

// 表单数据
const form = reactive({
  nickname: '',
  phone: '',
  email: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

// 错误信息
const errors = reactive({
  nickname: '',
  phone: '',
  email: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

// 状态
const isLoading = ref(false);

// 验证规则
const validationRules = {
  nickname: (value) => {
    if (!value) return '';
    if (value.length < 2) return '昵称至少2个字符';
    if (value.length > 20) return '昵称最多20个字符';
    return '';
  },
  phone: (value) => {
    if (!value) return '';
    if (!/^1[3-9]\d{9}$/.test(value)) return '请输入正确的手机号';
    return '';
  },
  email: (value) => {
    if (!value) return '';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return '请输入正确的邮箱地址';
    return '';
  },
  currentPassword: (value) => {
    if (!value) return '';
    if (value.length < 6) return '密码至少6个字符';
    return '';
  },
  newPassword: (value) => {
    if (!value) return '';
    if (value.length < 6) return '密码至少6个字符';
    return '';
  },
  confirmPassword: (value) => {
    if (!value) return '';
    if (value !== form.newPassword) return '两次输入的密码不一致';
    return '';
  }
};

// 验证单个字段
const validateField = (field) => {
  const value = form[field];
  const validator = validationRules[field];
  if (validator) {
    errors[field] = validator(value);
  }
  return !errors[field];
};

// 清除错误
const clearError = (field) => {
  errors[field] = '';
};

// 打开设置面板
const openSettingsPanel = () => {
  if (window.openSettingsPanel) {
    window.openSettingsPanel();
  }
};

// 验证表单
const validateForm = () => {
  let isValid = true;
  Object.keys(errors).forEach(field => {
    if (form[field]) {
      isValid = validateField(field) && isValid;
    }
  });
  return isValid;
};

// 加载用户信息
const loadUserProfile = async () => {
  isLoading.value = true;
  try {
    // 模拟 API 请求
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 从 store 获取用户信息
    const userInfo = userStore.user;
    if (userInfo) {
      user.username = userInfo.username || userInfo.phone || '用户';
      user.nickname = userInfo.nickname || '';
      user.phone = userInfo.phone || '';
      user.email = userInfo.email || '';
      user.avatar = userInfo.avatar || '';
      
      // 填充表单
      form.nickname = user.nickname;
      form.phone = user.phone;
      form.email = user.email;
    }
  } catch (error) {
    showToast('加载用户信息失败', 'error');
  } finally {
    isLoading.value = false;
  }
};

// 更新个人信息
const handleUpdateProfile = async () => {
  if (!validateForm()) {
    showToast('请检查表单信息', 'warning');
    return;
  }

  isLoading.value = true;
  try {
    // 模拟 API 请求
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // 更新 store 中的用户信息
    const updatedUser = {
      ...userStore.user,
      nickname: form.nickname || userStore.user.username,
      phone: form.phone,
      email: form.email
    };
    
    // 保存到 store
    userStore.user = updatedUser;
    localStorage.setItem('winters_user', JSON.stringify(updatedUser));
    
    // 更新本地状态
    user.nickname = form.nickname;
    user.phone = form.phone;
    user.email = form.email;
    
    showToast('个人信息更新成功', 'success');
  } catch (error) {
    showToast('更新失败，请重试', 'error');
  } finally {
    isLoading.value = false;
  }
};

// 重置表单
const resetForm = () => {
  form.nickname = user.nickname;
  form.phone = user.phone;
  form.email = user.email;
  form.currentPassword = '';
  form.newPassword = '';
  form.confirmPassword = '';
  
  // 清除错误
  Object.keys(errors).forEach(field => {
    errors[field] = '';
  });
};

// 页面加载
onMounted(async () => {
  // 检查登录状态
  if (!userStore.isLoggedIn) {
    router.push('/login');
    return;
  }
  
  // 加载用户信息
  await loadUserProfile();
});
</script>

<style scoped>
/* ========== 页面基础样式 ========== */
.profile-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  padding: 80px 20px 40px;
}

/* ========== 粒子背景 ========== */
.particles-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}

/* ========== 动态背景 ========== */
.profile-background {
  position: fixed;
  inset: 0;
  z-index: 0;
  background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #fef3c7 100%);
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.6;
  animation: float 20s ease-in-out infinite;
}

.orb-1 {
  width: 600px;
  height: 600px;
  background: linear-gradient(135deg, #f9a8d4 0%, #f472b6 100%);
  top: -200px;
  left: -200px;
  animation-delay: 0s;
}

.orb-2 {
  width: 500px;
  height: 500px;
  background: linear-gradient(135deg, #fcd34d 0%, #f59e0b 100%);
  bottom: -150px;
  right: -150px;
  animation-delay: -7s;
}

.orb-3 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #fbcfe8 0%, #f9a8d4 100%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: -14s;
}

.grid-pattern {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(236, 72, 153, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(236, 72, 153, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
}

@keyframes float {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(30px, -30px) scale(1.05);
  }
  50% {
    transform: translate(-20px, 20px) scale(0.95);
  }
  75% {
    transform: translate(20px, 30px) scale(1.02);
  }
}

/* ========== 主容器 ========== */
.profile-container {
  position: relative;
  z-index: 2;
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ========== 页面标题 ========== */
.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-title {
  font-size: 32px;
  font-weight: 800;
  background: linear-gradient(135deg, #EC4899, #F59E0B);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 8px;
  letter-spacing: -0.02em;
}

.page-subtitle {
  font-size: 16px;
  color: #64748b;
  opacity: 0.8;
}

/* ========== 个人信息卡片 ========== */
.profile-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 40px;
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.5) inset;
  margin-bottom: 30px;
}

/* ========== 头像区域 ========== */
.avatar-section {
  text-align: center;
  margin-bottom: 40px;
  padding-bottom: 30px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.avatar-button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  position: relative;
  display: inline-block;
  border-radius: 50%;
  transition: transform 0.3s ease;
}

.avatar-button:hover {
  transform: scale(1.05);
}

.avatar-button::after {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  background: linear-gradient(135deg, #EC4899, #F59E0B);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.avatar-button:hover::after {
  opacity: 1;
}

.avatar-container {
  width: 120px;
  height: 120px;
  margin: 0 auto;
  position: relative;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.user-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(135deg, #EC4899, #F59E0B);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 48px;
}

.avatar-placeholder svg {
  width: 60px;
  height: 60px;
}

.user-name {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
}

.user-email {
  font-size: 14px;
  color: #64748b;
  opacity: 0.8;
}

/* ========== 表单样式 ========== */
.profile-form {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: #475569;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.input-wrapper:focus-within {
  border-color: #EC4899;
  box-shadow: 0 0 0 4px rgba(236, 72, 153, 0.1);
  outline: none;
}

.input-wrapper input {
  flex: 1;
  padding: 14px 16px;
  border: none;
  background: transparent;
  font-size: 15px;
  color: #1e293b;
  outline: none;
  width: 100%;
  box-sizing: border-box;
}

.input-wrapper input::placeholder {
  color: #94a3b8;
}

.error-message {
  font-size: 13px;
  color: #ef4444;
  animation: slideDown 0.2s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ========== 表单操作 ========== */
.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.btn-primary {
  flex: 1;
  padding: 14px 24px;
  background: linear-gradient(135deg, #EC4899, #DB2777);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow:
    0 4px 15px rgba(236, 72, 153, 0.4),
    0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow:
    0 0 25px rgba(255, 255, 255, 0.6),
    0 0 50px rgba(236, 72, 153, 0.4),
    0 8px 25px rgba(236, 72, 153, 0.5);
  background: linear-gradient(135deg, #F472B6, #EC4899);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-secondary {
  flex: 1;
  padding: 14px 24px;
  background: rgba(255, 255, 255, 0.8);
  color: #1e293b;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover:not(:disabled) {
  background: white;
  border-color: #EC4899;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.btn-secondary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.loading-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ========== 安全设置卡片 ========== */
.security-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 30px;
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.5) inset;
}

.security-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.security-item:last-child {
  border-bottom: none;
}

.security-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.security-label {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.security-status {
  font-size: 12px;
  color: #64748b;
  opacity: 0.8;
}

.security-action {
  padding: 8px 16px;
  background: rgba(236, 72, 153, 0.1);
  color: #EC4899;
  border: 1px solid rgba(236, 72, 153, 0.2);
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.security-action:hover {
  background: rgba(236, 72, 153, 0.2);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
}

/* ========== 响应式设计 ========== */
@media (max-width: 768px) {
  .profile-page {
    padding: 80px 15px 30px;
  }

  .profile-card {
    padding: 30px 24px;
  }

  .security-card {
    padding: 24px 20px;
  }

  .form-actions {
    flex-direction: column;
  }

  .page-title {
    font-size: 28px;
  }

  .user-name {
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .profile-container {
    width: 100%;
  }

  .profile-card {
    border-radius: 20px;
    padding: 24px 20px;
  }

  .security-card {
    border-radius: 20px;
    padding: 20px 16px;
  }

  .avatar-container {
    width: 100px;
    height: 100px;
  }

  .page-title {
    font-size: 24px;
  }
}

/* ========== 减少动画偏好 ========== */
@media (prefers-reduced-motion: reduce) {
  .gradient-orb,
  .profile-container,
  .loading-spinner,
  .error-message {
    animation: none;
  }

  .profile-container {
    opacity: 1;
    transform: none;
  }
}
</style>