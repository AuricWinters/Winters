<template>
  <div class="register-page">
    <!-- 粒子背景 -->
    <canvas class="particles-background" />

    <!-- 动态背景 -->
    <div class="register-background">
      <div class="gradient-orb orb-1" />
      <div class="gradient-orb orb-2" />
      <div class="gradient-orb orb-3" />
      <div class="grid-pattern" />
    </div>

    <!-- 主容器 -->
    <div class="register-container">
      <!-- 左侧动画区域 -->
      <div class="brand-section">
        <AnimatedCharacters
          :is-typing="isTyping"
          :show-password="showPassword"
          :password-length="form.password.length"
        />
      </div>

      <!-- 右侧注册表单 -->
      <div class="form-section">
        <div
          class="register-card"
          :class="{ shake: shakeCard }"
        >
          <!-- 标题 -->
          <div class="register-header">
            <h2 class="register-title">
              创建账号
            </h2>
            <p class="register-subtitle">
              加入 Winters 社区，开启您的数字之旅
            </p>
          </div>

          <!-- 注册表单 -->
          <form
            class="register-form"
            @submit.prevent="handleRegister"
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
                    d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                手机号
              </label>
              <div class="input-wrapper">
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
                <div
                  v-if="form.phone"
                  class="input-clear"
                  @click="form.phone = ''"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke-width="2"
                    />
                    <path
                      d="M15 9l-6 6M9 9l6 6"
                      stroke-width="2"
                      stroke-linecap="round"
                    />
                  </svg>
                </div>
              </div>
              <span
                v-if="errors.phone"
                class="error-message"
              >{{ errors.phone }}</span>
            </div>

            <div
              class="form-group"
              :class="{ 'has-error': errors.email }"
            >
              <label class="form-label">
                <svg
                  class="label-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                    stroke-width="2"
                  />
                  <polyline
                    points="22,6 12,13 2,6"
                    stroke-width="2"
                  />
                </svg>
                邮箱
              </label>
              <div class="input-wrapper">
                <input
                  v-model="form.email"
                  type="email"
                  placeholder="请输入邮箱"
                  :disabled="isLoading"
                  @blur="
                    validateField('email');
                    isTyping = false;
                  "
                  @input="clearError('email')"
                  @focus="isTyping = true"
                >
                <div
                  v-if="form.email"
                  class="input-clear"
                  @click="form.email = ''"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke-width="2"
                    />
                    <path
                      d="M15 9l-6 6M9 9l6 6"
                      stroke-width="2"
                      stroke-linecap="round"
                    />
                  </svg>
                </div>
              </div>
              <span
                v-if="errors.email"
                class="error-message"
              >{{ errors.email }}</span>
            </div>

            <div
              class="form-group"
              :class="{ 'has-error': errors.password }"
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
                密码
              </label>
              <div class="input-wrapper">
                <input
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="请输入密码"
                  :disabled="isLoading"
                  @blur="
                    validateField('password');
                    isTyping = false;
                  "
                  @input="clearError('password')"
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
                v-if="errors.password"
                class="error-message"
              >{{ errors.password }}</span>
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
                确认密码
              </label>
              <div class="input-wrapper">
                <input
                  v-model="form.confirmPassword"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="请再次输入密码"
                  :disabled="isLoading"
                  @blur="
                    validateField('confirmPassword');
                    isTyping = false;
                  "
                  @input="clearError('confirmPassword')"
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
                v-if="errors.confirmPassword"
                class="error-message"
              >{{
                errors.confirmPassword
              }}</span>
            </div>

            <button
              type="submit"
              class="submit-btn"
              :disabled="isLoading"
            >
              <span v-if="!isLoading">注册</span>
              <span
                v-else
                class="loading-spinner"
              />
            </button>
          </form>

          <!-- 分隔线 -->
          <div class="divider">
            <span>或者</span>
          </div>

          <!-- 第三方注册 -->
          <div class="social-register">
            <button
              type="button"
              class="social-btn wechat"
              @click="socialRegister('wechat')"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.269-.03-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z"
                />
              </svg>
              <span>微信登录</span>
            </button>
            <button
              type="button"
              class="social-btn github"
              @click="socialRegister('github')"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                />
              </svg>
              <span>GitHub</span>
            </button>
          </div>

          <!-- 登录链接 -->
          <div class="login-section">
            <span>已有账号?</span>
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
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AnimatedCharacters from '../components/AnimatedCharacters.vue';
import { useUserStore } from '../stores/user.js';
import { useParticles } from '../composables/useParticles.js';
import { useToast } from '../composables/useToast.js';

const router = useRouter();
const userStore = useUserStore();
const { showToast } = useToast();
useParticles('.particles-background', true);

// 表单数据
const form = reactive({
  phone: '',
  email: '',
  password: '',
  confirmPassword: '',
});

// 错误信息
const errors = reactive({
  phone: '',
  email: '',
  password: '',
  confirmPassword: '',
});

// 状态
const isLoading = ref(false);
const showPassword = ref(false);
const shakeCard = ref(false);
const isTyping = ref(false);

// 验证规则
const validationRules = {
  phone: (value) => {
    if (!value) return '请输入手机号';
    if (!/^1[3-9]\d{9}$/.test(value)) return '请输入正确的手机号';
    return '';
  },
  email: (value) => {
    if (!value) return '请输入邮箱';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return '请输入正确的邮箱地址';
    return '';
  },
  password: (value) => {
    if (!value) return '请输入密码';
    if (value.length < 4) return '密码至少4个字符';
    if (value.length > 32) return '密码最多32个字符';
    return '';
  },
  confirmPassword: (value) => {
    if (!value) return '请确认密码';
    if (value !== form.password) return '两次输入的密码不一致';
    return '';
  },
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
  isValid = validateField('email') && isValid;
  isValid = validateField('password') && isValid;
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

// 注册 - 使用 Pinia store
const handleRegister = async () => {
  if (!validateForm()) {
    triggerShake();
    return;
  }

  isLoading.value = true;

  try {
    const result = await userStore.register(form.phone, form.email, form.password);

    if (result.success) {
      showToast('注册成功！正在跳转...', 'success');
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } else {
      const errorMsg = result.error;
      if (errorMsg.includes('手机号')) {
        errors.phone = errorMsg;
      } else if (errorMsg.includes('邮箱')) {
        errors.email = errorMsg;
      } else {
        showToast(errorMsg, 'error');
      }
      triggerShake();
    }
  } catch {
    showToast('注册失败，请重试', 'error');
    triggerShake();
  } finally {
    isLoading.value = false;
  }
};

// 第三方注册
const socialRegister = (type) => {
  showToast(`${type === 'wechat' ? '微信' : 'GitHub'}注册功能开发中`, 'info');
};
</script>

<style scoped>
/* ========== 页面基础样式 ========== */
.register-page {
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
.register-background {
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
.register-container {
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

.register-card {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.register-card.shake {
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

/* ========== 注册头部 ========== */
.register-header {
  margin-bottom: 32px;
  text-align: center;
}

.register-title {
  font-size: 28px;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 8px;
}

.register-subtitle {
  font-size: 16px;
  color: #64748b;
}

/* ========== 表单样式 ========== */
.register-form {
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

.register-form .form-group .input-wrapper {
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

.register-form .form-group .input-wrapper:focus-within {
  border-color: #EC4899;
  box-shadow: 0 0 0 4px rgba(236, 72, 153, 0.1);
  outline: none;
}

.register-form .form-group .input-wrapper input {
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

.register-form .form-group .input-wrapper * {
  box-sizing: border-box;
}

.register-form .form-group .input-wrapper input {
  flex: 1;
  padding: 14px 16px;
  border: none;
  background: transparent;
  font-size: 15px;
  color: #1e293b;
  outline: none;
}

.register-form .form-group .input-wrapper input:focus-visible {
  outline: none;
}

.register-form .form-group .input-wrapper input::placeholder {
  color: #94a3b8;
}

.input-clear,
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

.input-clear:hover,
.password-toggle:hover {
  color: #64748b;
}

.input-clear svg,
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

/* ========== 提交按钮 - 渐变 + 白色光晕 ========== */
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
}

.submit-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  background: linear-gradient(135deg, #9D6FFF, #7C7FFF);
  box-shadow:
    0 0 25px rgba(255, 255, 255, 0.6),
    0 0 50px rgba(236, 72, 153, 0.4),
    0 8px 25px rgba(236, 72, 153, 0.5);
}

.submit-btn:hover:not(:disabled)::before {
  opacity: 1;
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
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

/* ========== 分隔线 ========== */
.divider {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 28px 0;
  color: #94a3b8;
  font-size: 13px;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
}

/* ========== 第三方注册 ========== */
.social-register {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 20px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s ease;
}

.social-btn:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
  transform: translateY(-1px);
}

.social-btn svg {
  width: 20px;
  height: 20px;
}

.social-btn.wechat {
  color: #07c160;
}

.social-btn.wechat:hover {
  background: #f0fdf4;
  border-color: #86efac;
}

.social-btn.github {
  color: #1f2937;
}

.social-btn.github:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

/* ========== 登录链接 ========== */
.login-section {
  text-align: center;
  margin-top: 28px;
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
  .register-container {
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
  .register-page {
    padding: 0;
    background: white;
  }

  .register-background {
    display: none;
  }

  .register-container {
    border-radius: 0;
    min-height: 100vh;
    box-shadow: none;
  }

  .form-section {
    padding: 32px 24px;
  }

  .social-register {
    grid-template-columns: 1fr;
  }
}

/* ========== 减少动画偏好 ========== */
@media (prefers-reduced-motion: reduce) {
  .gradient-orb,
  .register-container,
  .submit-btn::before {
    animation: none;
  }

  .register-container {
    opacity: 1;
    transform: none;
  }
}
</style>
