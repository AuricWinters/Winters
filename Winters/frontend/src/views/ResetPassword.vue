<template>
  <div class="reset-password-page">
    <!-- 粒子背景 -->
    <canvas class="particles-background" />

    <!-- 动态背景 -->
    <div class="reset-background">
      <div class="gradient-orb orb-1" />
      <div class="gradient-orb orb-2" />
      <div class="gradient-orb orb-3" />
      <div class="grid-pattern" />
    </div>

    <!-- 主容器 -->
    <div class="reset-container">
      <!-- 左侧动画区域 -->
      <div class="brand-section">
        <AnimatedCharacters
          :is-typing="isTyping"
          :show-password="showPassword"
          :password-length="form.newPassword.length"
        />
      </div>

      <!-- 右侧重置表单 -->
      <div class="form-section">
        <div
          class="reset-card"
          :class="{ shake: shakeCard }"
        >
          <!-- 标题 -->
          <div class="reset-header">
            <h1 class="reset-title">重置密码</h1>
            <p class="reset-subtitle">通过手机号验证码重置您的密码</p>
          </div>

          <!-- 重置表单 -->
          <form
            class="reset-form"
            @submit.prevent="handleResetPassword"
          >
            <div
              class="form-group"
              :class="{ 'has-error': errors.phone }"
            >
              <label class="form-label">
                <svg
                  class="label-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0.2 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0.7 2.81 2 2 0 0 1 2.81.7A2 2 0 0 1 22 16.92z"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                手机号
              </label>
              <div class="input-wrapper">
                <span class="phone-prefix">+86</span>
                <input
                  v-model="form.phone"
                  type="tel"
                  placeholder="请输入手机号"
                  :disabled="isLoading"
                  @blur="
                    validateField('phone');
                    isTyping = false;
                  "
                  @input="clearError('phone')"
                  @focus="isTyping = true"
                >
              </div>
              <span
                v-if="errors.phone"
                class="error-message"
              >{{ errors.phone }}</span>
            </div>

            <div
              class="form-group"
              :class="{ 'has-error': errors.code }"
            >
              <label class="form-label">
                <svg
                  class="label-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <rect
                    x="3"
                    y="11"
                    width="18"
                    height="11"
                    rx="2"
                    ry="2"
                    stroke-width="2"
                  />
                  <path
                    d="M7 11V7a5 5 0 0 1 10 0v4"
                    stroke-width="2"
                  />
                </svg>
                验证码
              </label>
              <div class="input-wrapper code-input">
                <input
                  v-model="form.code"
                  type="text"
                  placeholder="请输入验证码"
                  maxlength="6"
                  :disabled="isLoading"
                  @blur="
                    validateField('code');
                    isTyping = false;
                  "
                  @input="clearError('code')"
                  @focus="isTyping = true"
                >
                <button
                  type="button"
                  class="code-btn"
                  :disabled="codeCountdown > 0 || isLoading"
                  @click="sendCode"
                >
                  {{ codeCountdown > 0 ? `${codeCountdown}s` : '获取验证码' }}
                </button>
              </div>
              <span
                v-if="errors.code"
                class="error-message"
              >{{ errors.code }}</span>
            </div>

            <div
              class="form-group"
              :class="{ 'has-error': errors.newPassword }"
            >
              <label class="form-label">
                <svg
                  class="label-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <rect
                    x="3"
                    y="11"
                    width="18"
                    height="11"
                    rx="2"
                    ry="2"
                    stroke-width="2"
                  />
                  <circle
                    cx="12"
                    cy="16"
                    r="1"
                    fill="currentColor"
                  />
                  <path
                    d="M7 11V7a5 5 0 0 1 10 0v4"
                    stroke-width="2"
                  />
                </svg>
                新密码
              </label>
              <div class="input-wrapper">
                <input
                  v-model="form.newPassword"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="请输入新密码"
                  :disabled="isLoading"
                  @blur="
                    validateField('newPassword');
                    isTyping = false;
                  "
                  @input="clearError('newPassword')"
                  @focus="isTyping = true"
                >
                <button
                  type="button"
                  class="password-toggle"
                  @click="showPassword = !showPassword"
                >
                  <svg
                    v-if="showPassword"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                      stroke-width="2"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="3"
                      stroke-width="2"
                    />
                  </svg>
                  <svg
                    v-else
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                      stroke-width="2"
                    />
                    <line
                      x1="1"
                      y1="1"
                      x2="23"
                      y2="23"
                      stroke-width="2"
                    />
                  </svg>
                </button>
              </div>
              <span
                v-if="errors.newPassword"
                class="error-message"
              >{{ errors.newPassword }}</span>
            </div>

            <div
              class="form-group"
              :class="{ 'has-error': errors.confirmPassword }"
            >
              <label class="form-label">
                <svg
                  class="label-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <rect
                    x="3"
                    y="11"
                    width="18"
                    height="11"
                    rx="2"
                    ry="2"
                    stroke-width="2"
                  />
                  <circle
                    cx="12"
                    cy="16"
                    r="1"
                    fill="currentColor"
                  />
                  <path
                    d="M7 11V7a5 5 0 0 1 10 0v4"
                    stroke-width="2"
                  />
                </svg>
                确认新密码
              </label>
              <div class="input-wrapper">
                <input
                  v-model="form.confirmPassword"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="请确认新密码"
                  :disabled="isLoading"
                  @blur="
                    validateField('confirmPassword');
                    isTyping = false;
                  "
                  @input="clearError('confirmPassword')"
                  @focus="isTyping = true"
                >
              </div>
              <span
                v-if="errors.confirmPassword"
                class="error-message"
              >{{ errors.confirmPassword }}</span>
            </div>

            <button
              type="submit"
              class="submit-btn"
              :disabled="isLoading"
            >
              <span v-if="!isLoading">重置密码</span>
              <span
                v-else
                class="loading-spinner"
              />
            </button>
          </form>

          <!-- 登录链接 -->
          <div class="login-section">
            <span>想起密码了?</span>
            <router-link
              to="/login"
              class="login-link"
            >
              立即登录
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import AnimatedCharacters from '../components/AnimatedCharacters.vue';
import { useParticles } from '../composables/useParticles.js';
import { useToast } from '../composables/useToast.js';

const router = useRouter();
const { showToast } = useToast();

// 粒子背景
useParticles('.particles-background', true);

// 表单数据
const form = reactive({
  phone: '',
  code: '',
  newPassword: '',
  confirmPassword: ''
});

// 错误信息
const errors = reactive({
  phone: '',
  code: '',
  newPassword: '',
  confirmPassword: ''
});

// 状态
const isLoading = ref(false);
const showPassword = ref(false);
const shakeCard = ref(false);
const codeCountdown = ref(0);
const isTyping = ref(false);
let countdownTimer = null;

// 验证规则
const validationRules = {
  phone: (value) => {
    if (!value) return '请输入手机号';
    if (!/^1[3-9]\d{9}$/.test(value)) return '请输入正确的手机号';
    return '';
  },
  code: (value) => {
    if (!value) return '请输入验证码';
    if (!/^\d{6}$/.test(value)) return '验证码为6位数字';
    return '';
  },
  newPassword: (value) => {
    if (!value) return '请输入新密码';
    if (value.length < 6) return '密码至少6个字符';
    if (value.length > 32) return '密码最多32个字符';
    return '';
  },
  confirmPassword: (value) => {
    if (!value) return '请确认新密码';
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

// 验证整个表单
const validateForm = () => {
  let isValid = true;
  isValid = validateField('phone') && isValid;
  isValid = validateField('code') && isValid;
  isValid = validateField('newPassword') && isValid;
  isValid = validateField('confirmPassword') && isValid;
  return isValid;
};

// 触发卡片抖动
const triggerShake = () => {
  shakeCard.value = true;
  setTimeout(() => {
    shakeCard.value = false;
  }, 500);
};

// 发送验证码
const sendCode = async () => {
  if (!validateField('phone')) {
    triggerShake();
    return;
  }

  isLoading.value = true;

  try {
    // 调用后端 API 发送验证码
    const response = await fetch('http://localhost:8000/api/auth/send-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: form.phone
      })
    });

    if (response.ok) {
      codeCountdown.value = 60;
      showToast('验证码已发送', 'success');

      countdownTimer = setInterval(() => {
        codeCountdown.value--;
        if (codeCountdown.value <= 0) {
          clearInterval(countdownTimer);
        }
      }, 1000);
    } else {
      const error = await response.json();
      showToast(error.detail || '发送失败', 'error');
    }
  } catch (error) {
    // 模拟发送验证码
    codeCountdown.value = 60;
    showToast('验证码已发送（模拟）', 'success');

    countdownTimer = setInterval(() => {
      codeCountdown.value--;
      if (codeCountdown.value <= 0) {
        clearInterval(countdownTimer);
      }
    }, 1000);
  } finally {
    isLoading.value = false;
  }
};

// 重置密码
const handleResetPassword = async () => {
  if (!validateForm()) {
    triggerShake();
    return;
  }

  isLoading.value = true;

  try {
    // 调用后端 API 重置密码
    const response = await fetch('http://localhost:8000/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: form.phone,
        code: form.code,
        new_password: form.newPassword,
        confirm_password: form.confirmPassword
      })
    });

    if (response.ok) {
      showToast('密码重置成功！请使用新密码登录', 'success');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } else {
      const error = await response.json();
      showToast(error.detail || '重置失败', 'error');
      triggerShake();
    }
  } catch (error) {
    // 模拟重置密码
    await new Promise((resolve) => setTimeout(resolve, 1500));
    showToast('密码重置功能开发中', 'info');
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* ========== 页面基础样式 ========== */
.reset-password-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 20px;
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
.reset-background {
  position: fixed;
  inset: 0;
  z-index: 0;
  background: linear-gradient(135deg, #f5f3ff 0%, #eff6ff 50%, #f0f9ff 100%);
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
  background: linear-gradient(135deg, #c4b5fd 0%, #a78bfa 100%);
  top: -200px;
  left: -200px;
  animation-delay: 0s;
}

.orb-2 {
  width: 500px;
  height: 500px;
  background: linear-gradient(135deg, #93c5fd 0%, #60a5fa 100%);
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
.reset-container {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  max-width: 1100px;
  width: 100%;
  min-height: 600px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 32px;
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.5) inset;
  overflow: hidden;
  position: relative;
  z-index: 1;
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

/* ========== 品牌区域 ========== */
.brand-section {
  background: linear-gradient(135deg, #EC4899 0%, #DB2777 50%, #F59E0B 100%);
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  min-height: 600px;
}

.brand-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  opacity: 0.5;
}

/* ========== 表单区域 ========== */
.form-section {
  padding: 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.reset-card {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.reset-card.shake {
  animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97);
}

@keyframes shake {
  10%,
  90% {
    transform: translateX(-1px);
  }
  20%,
  80% {
    transform: translateX(2px);
  }
  30%,
  50%,
  70% {
    transform: translateX(-4px);
  }
  40%,
  60% {
    transform: translateX(4px);
  }
}

/* ========== 标题 ========== */
.reset-header {
  text-align: center;
  margin-bottom: 32px;
}

.reset-title {
  font-size: 28px;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 8px;
}

.reset-subtitle {
  font-size: 14px;
  color: #64748b;
  opacity: 0.8;
}

/* ========== 表单样式 ========== */
.reset-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group.has-error .input-wrapper {
  border-color: #ef4444;
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1);
}

.form-group.has-error .input-wrapper:focus-within {
  border-color: #ef4444;
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.15);
}

.form-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.label-icon {
  width: 18px;
  height: 18px;
  color: #EC4899;
}

.reset-form .form-group .input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  transition: all 0.2s ease;
  box-sizing: border-box;
  outline: none;
  width: 100%;
}

.reset-form .form-group .input-wrapper:focus-within {
  border-color: #EC4899;
  box-shadow: 0 0 0 4px rgba(236, 72, 153, 0.1);
  outline: none;
}

.reset-form .form-group .input-wrapper input {
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

.reset-form .form-group .input-wrapper input::placeholder {
  color: #94a3b8;
}

.phone-prefix {
  padding-left: 16px;
  font-size: 15px;
  font-weight: 600;
  color: #64748b;
  border-right: 1px solid #e2e8f0;
  padding-right: 12px;
  margin-right: 12px;
}

.code-input input {
  padding-right: 120px;
}

.code-btn {
  position: absolute;
  right: 8px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #EC4899 0%, #DB2777 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.code-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
}

.code-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.password-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  margin-right: 4px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #94a3b8;
  transition: color 0.2s ease;
}

.password-toggle:hover {
  color: #64748b;
}

.password-toggle svg {
  width: 18px;
  height: 18px;
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

/* ========== 提交按钮 ========== */
.submit-btn {
  width: 100%;
  padding: 16px 24px;
  background: linear-gradient(135deg, #EC4899 0%, #DB2777 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow:
    0 4px 14px rgba(236, 72, 153, 0.35),
    0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  margin-top: 10px;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow:
    0 0 25px rgba(255, 255, 255, 0.6),
    0 0 50px rgba(236, 72, 153, 0.4),
    0 8px 25px rgba(236, 72, 153, 0.5);
  background: linear-gradient(135deg, #F472B6, #EC4899);
}

.submit-btn:disabled {
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

/* ========== 登录链接 ========== */
.login-section {
  text-align: center;
  margin-top: 24px;
  font-size: 14px;
  color: #64748b;
}

.login-link {
  margin-left: 6px;
  font-weight: 700;
  color: #EC4899;
  text-decoration: none;
  transition: color 0.2s ease;
}

.login-link:hover {
  color: #DB2777;
}

/* ========== 响应式设计 ========== */
@media (max-width: 900px) {
  .reset-container {
    grid-template-columns: 1fr;
    max-width: 480px;
  }

  .brand-section {
    display: none;
  }

  .form-section {
    padding: 40px 32px;
  }
}

@media (max-width: 480px) {
  .reset-password-page {
    padding: 0;
    background: white;
  }

  .reset-background {
    display: none;
  }

  .reset-container {
    border-radius: 0;
    min-height: 100vh;
    box-shadow: none;
  }

  .form-section {
    padding: 32px 24px;
  }

  .reset-title {
    font-size: 24px;
  }
}

/* ========== 减少动画偏好 ========== */
@media (prefers-reduced-motion: reduce) {
  .gradient-orb,
  .reset-container,
  .loading-spinner,
  .error-message {
    animation: none;
  }

  .reset-container {
    opacity: 1;
    transform: none;
  }
}
</style>