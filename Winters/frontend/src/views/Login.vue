<template>
  <div class="login-page">
    <!-- 粒子背景 -->
    <canvas class="particles-background" />

    <!-- 动态背景 -->
    <div class="login-background">
      <div class="gradient-orb orb-1" />
      <div class="gradient-orb orb-2" />
      <div class="gradient-orb orb-3" />
      <div class="grid-pattern" />
    </div>

    <!-- 主容器 -->
    <div class="login-container">
      <!-- 左侧动画区域 -->
      <div class="brand-section">
        <AnimatedCharacters
          :is-typing="isTyping"
          :show-password="showPassword"
          :password-length="form.password.length"
        />
      </div>

      <!-- 右侧登录表单 -->
      <div class="form-section">
        <div
          class="login-card"
          :class="{ shake: shakeCard }"
        >
          <!-- 标签切换 -->
          <div class="login-tabs">
            <button
              class="tab-btn"
              :class="{ active: loginType === 'password' }"
              @click="loginType = 'password'"
            >
              密码登录
            </button>
            <button
              class="tab-btn"
              :class="{ active: loginType === 'code' }"
              @click="loginType = 'code'"
            >
              验证码登录
            </button>
            <div
              class="tab-indicator"
              :style="indicatorStyle"
            />
          </div>

          <!-- 密码登录表单 -->
          <form
            v-if="loginType === 'password'"
            class="login-form"
            @submit.prevent="handleLogin"
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

            <div class="form-options">
              <label class="remember-me">
                <input
                  v-model="form.remember"
                  type="checkbox"
                >
                <span class="checkbox-custom" />
                <span class="checkbox-label">记住我</span>
              </label>
              <a
                href="#"
                class="forgot-link"
                @click.prevent="handleForgot"
              >忘记密码?</a>
            </div>

            <button
              type="submit"
              class="submit-btn"
              :disabled="isLoading"
            >
              <span v-if="!isLoading">登录</span>
              <span
                v-else
                class="loading-spinner"
              />
            </button>
          </form>

          <!-- 验证码登录表单 -->
          <form
            v-else-if="loginType === 'code'"
            class="login-form"
            @submit.prevent="handleCodeLogin"
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
                  <rect
                    x="5"
                    y="2"
                    width="14"
                    height="20"
                    rx="2"
                    ry="2"
                    stroke-width="2"
                  />
                  <line
                    x1="12"
                    y1="18"
                    x2="12.01"
                    y2="18"
                    stroke-width="2"
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

            <button
              type="submit"
              class="submit-btn"
              :disabled="isLoading"
            >
              <span v-if="!isLoading">登录</span>
              <span
                v-else
                class="loading-spinner"
              />
            </button>
          </form>

          <!-- 注册表单 -->
          <form
            v-else-if="loginType === 'register'"
            class="login-form"
            @submit.prevent="handleRegister"
          >
            <div
              class="form-group"
              :class="{ 'has-error': errors.username }"
            >
              <label class="form-label">
                <svg
                  class="label-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                  <circle
                    cx="12"
                    cy="7"
                    r="4"
                    stroke-width="2"
                  />
                </svg>
                用户名
              </label>
              <div class="input-wrapper">
                <input
                  v-model="form.username"
                  type="text"
                  placeholder="请输入用户名"
                  :disabled="isLoading"
                  @blur="
                    validateField('username');
                    isTyping = false;
                  "
                  @input="clearError('username')"
                  @focus="isTyping = true"
                >
                <div
                  v-if="form.username"
                  class="input-clear"
                  @click="form.username = ''"
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
                v-if="errors.username"
                class="error-message"
              >{{ errors.username }}</span>
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

          <!-- 第三方登录 -->
          <div class="social-login">
            <button
              type="button"
              class="social-btn wechat"
              @click="socialLogin('wechat')"
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
              @click="socialLogin('github')"
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

          <!-- 注册链接 -->
          <div class="register-section">
            <span>还没有账号?</span>
            <router-link
              to="/register"
              class="register-link"
            >
              立即注册
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import AnimatedCharacters from '../components/AnimatedCharacters.vue';
import { useUserStore } from '../stores/user.js';
import { useParticles } from '../composables/useParticles.js';
import { useToast } from '../composables/useToast.js';

const router = useRouter();
const userStore = useUserStore();
const { showToast } = useToast();

// 登录页粒子使用 isLoginPage: true
useParticles('.particles-background', true);

// 登录类型
const loginType = ref('password');

// 表单数据
const form = reactive({
  username: '',
  password: '',
  email: '',
  phone: '',
  code: '',
  remember: false,
});

// 错误信息
const errors = reactive({
  username: '',
  password: '',
  email: '',
  phone: '',
  code: '',
});

// 状态
const isLoading = ref(false);
const showPassword = ref(false);
const shakeCard = ref(false);
const codeCountdown = ref(0);
const isTyping = ref(false);
let countdownTimer = null;

// 标签指示器样式
const indicatorStyle = computed(() => ({
  transform: loginType.value === 'password' ? 'translateX(0)' : 'translateX(100%)',
}));

// 验证规则
const validationRules = {
  username: (value) => {
    if (!value) return '请输入用户名';
    if (value.length < 3) return '用户名至少3个字符';
    if (value.length > 20) return '用户名最多20个字符';
    if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(value)) return '用户名只能包含字母、数字、下划线';
    return '';
  },
  password: (value) => {
    if (!value) return '请输入密码';
    if (value.length < 4) return '密码至少4个字符';
    if (value.length > 32) return '密码最多32个字符';
    return '';
  },
  email: (value) => {
    if (!value) return '请输入邮箱';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return '请输入正确的邮箱地址';
    return '';
  },
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
const validateForm = (type) => {
  let isValid = true;
  if (type === 'password') {
    isValid = validateField('phone') && isValid;
    isValid = validateField('password') && isValid;
  } else if (type === 'code') {
    isValid = validateField('phone') && isValid;
    isValid = validateField('code') && isValid;
  } else if (type === 'register') {
    isValid = validateField('username') && isValid;
    isValid = validateField('email') && isValid;
    isValid = validateField('password') && isValid;
  }
  return isValid;
};

// 触发卡片抖动
const triggerShake = () => {
  shakeCard.value = true;
  setTimeout(() => {
    shakeCard.value = false;
  }, 500);
};

// 密码登录 - 使用 Pinia store
const handleLogin = async () => {
  if (!validateForm('password')) {
    triggerShake();
    return;
  }

  isLoading.value = true;

  try {
    const result = await userStore.login(form.phone, form.password);

    if (result.success) {
      if (form.remember) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('loginPhone', form.phone);
      } else {
        localStorage.removeItem('loginPhone');
        localStorage.removeItem('rememberMe');
      }

      showToast('登录成功！正在跳转...', 'success');

      setTimeout(() => {
        router.push('/');
      }, 1000);
    } else {
      // 处理错误
      const errorMsg = result.error;
      if (errorMsg.includes('手机号')) {
        errors.phone = errorMsg;
      } else if (errorMsg.includes('密码')) {
        errors.password = errorMsg;
      } else {
        showToast(errorMsg, 'error');
      }
      triggerShake();
    }
  } catch (error) {
    showToast('登录失败，请重试', 'error');
    triggerShake();
  } finally {
    isLoading.value = false;
  }
};

// 验证码登录
const handleCodeLogin = async () => {
  if (!validateForm('code')) {
    triggerShake();
    return;
  }

  isLoading.value = true;

  try {
    // 调用后端 API 进行验证码登录
    const response = await fetch('http://localhost:8000/api/auth/login/code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: form.phone,
        code: form.code
      })
    });

    if (response.ok) {
      const data = await response.json();
      
      // 保存用户信息到 store
      const result = await userStore.login(form.phone, form.code, true);
      
      if (result.success) {
        showToast('登录成功！正在跳转...', 'success');
        setTimeout(() => {
          router.push('/');
        }, 1000);
      } else {
        showToast(result.error, 'error');
        triggerShake();
      }
    } else {
      const error = await response.json();
      showToast(error.detail || '登录失败', 'error');
      triggerShake();
    }
  } catch (error) {
    // 模拟验证码登录
    await new Promise((resolve) => setTimeout(resolve, 1500));
    showToast('验证码登录功能开发中', 'info');
  } finally {
    isLoading.value = false;
  }
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

// 第三方登录
const socialLogin = async (type) => {
  try {
    // 模拟第三方登录
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // 调用后端 API 进行第三方登录
    const response = await fetch('http://localhost:8000/api/auth/social/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        provider: type,
        code: 'mock_code_' + Date.now()
      })
    });

    if (response.ok) {
      const data = await response.json();
      
      // 保存用户信息
      const mockUser = {
        id: Date.now(),
        username: type === 'wechat' ? '微信用户' : 'GitHub用户',
        nickname: type === 'wechat' ? '微信用户' : 'GitHub用户'
      };

      const mockData = {
        access_token: 'mock_token_' + Date.now(),
        refresh_token: 'mock_refresh_' + Date.now(),
        user: mockUser
      };

      // 保存状态
      userStore.token = mockData.access_token;
      userStore.refreshToken = mockData.refresh_token;
      userStore.user = mockData.user;

      localStorage.setItem('winters_token', mockData.access_token);
      localStorage.setItem('winters_refresh_token', mockData.refresh_token);
      localStorage.setItem('winters_user', JSON.stringify(mockData.user));
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', mockData.user.username);

      showToast(`${type === 'wechat' ? '微信' : 'GitHub'}登录成功！`, 'success');
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } else {
      showToast('登录失败', 'error');
    }
  } catch (error) {
    showToast(`${type === 'wechat' ? '微信' : 'GitHub'}登录功能开发中`, 'info');
  }
};

// 忘记密码
const handleForgot = () => {
  // 跳转到密码重置页面
  router.push('/reset-password');
};

// 注册 - 使用 Pinia store
const handleRegister = async () => {
  if (!validateForm('register')) {
    triggerShake();
    return;
  }

  isLoading.value = true;

  try {
    const result = await userStore.register(form.username, form.email, form.password);

    if (result.success) {
      showToast('注册成功！正在跳转...', 'success');
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } else {
      const errorMsg = result.error;
      if (errorMsg.includes('用户名')) {
        errors.username = errorMsg;
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

// 清理定时器
onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer);
  }
});

// 页面加载
onMounted(() => {
  // 检查是否有记住的手机号
  const remembered = localStorage.getItem('rememberMe');
  if (remembered) {
    const savedPhone = localStorage.getItem('loginPhone');
    if (savedPhone) {
      form.phone = savedPhone;
      form.remember = true;
    }
  }
});
</script>

<style scoped>
/* ========== 页面基础样式 ========== */
.login-page {
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
.login-background {
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
.login-container {
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

.brand-content {
  position: relative;
  z-index: 1;
  color: white;
}

.brand-logo {
  width: 64px;
  height: 64px;
  margin-bottom: 32px;
  animation: pulse 2s ease-in-out infinite;
}

.brand-logo svg {
  width: 100%;
  height: 100%;
  color: white;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.brand-title {
  font-size: 36px;
  font-weight: 800;
  margin-bottom: 12px;
  letter-spacing: -0.02em;
}

.brand-subtitle {
  font-size: 16px;
  opacity: 0.9;
  margin-bottom: 48px;
  line-height: 1.6;
}

.brand-features {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 15px;
  font-weight: 500;
  opacity: 0.95;
}

.feature-icon {
  font-size: 20px;
}

/* ========== 表单区域 ========== */
.form-section {
  padding: 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.login-card {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.login-card.shake {
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

/* ========== 标签切换 ========== */
.login-tabs {
  display: flex;
  position: relative;
  background: #f1f5f9;
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 32px;
}

.tab-btn {
  flex: 1;
  padding: 12px 24px;
  border: none;
  background: transparent;
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  position: relative;
  z-index: 1;
  transition: color 0.3s ease;
}

.tab-btn.active {
  color: #1e293b;
}

.tab-indicator {
  position: absolute;
  top: 4px;
  left: 4px;
  width: calc(50% - 4px);
  height: calc(100% - 8px);
  background: white;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ========== 表单样式 ========== */
.login-form {
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

.login-form .form-group .input-wrapper {
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

.login-form .form-group .input-wrapper:focus-within {
  border-color: #EC4899;
  box-shadow: 0 0 0 4px rgba(236, 72, 153, 0.1);
  outline: none;
}

.login-form .form-group .input-wrapper input {
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

.login-form .form-group .input-wrapper * {
  box-sizing: border-box;
}

.login-form .form-group .input-wrapper input {
  flex: 1;
  padding: 14px 16px;
  border: none;
  background: transparent;
  font-size: 15px;
  color: #1e293b;
  outline: none;
}

.login-form .form-group .input-wrapper input:focus-visible {
  outline: none;
}

.login-form .form-group .input-wrapper input::placeholder {
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

/* ========== 表单选项 ========== */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.remember-me input {
  display: none;
}

.checkbox-custom {
  width: 20px;
  height: 20px;
  border: 2px solid #cbd5e1;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.remember-me input:checked + .checkbox-custom {
  background: linear-gradient(135deg, #EC4899 0%, #DB2777 100%);
}

.remember-me input:checked + .checkbox-custom::after {
  content: '';
  width: 6px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg) translateY(-1px);
}

.checkbox-label {
  font-size: 14px;
  color: #475569;
}

.forgot-link {
  font-size: 14px;
  font-weight: 600;
  color: #EC4899;
  text-decoration: none;
  transition: color 0.2s ease;
}

.forgot-link:hover {
  color: #DB2777;
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

/* ========== 第三方登录 ========== */
.social-login {
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

/* ========== 注册链接 ========== */
.register-section {
  text-align: center;
  margin-top: 28px;
  font-size: 14px;
  color: #64748b;
}

.register-link {
  margin-left: 6px;
  font-weight: 700;
  color: #EC4899;
  text-decoration: none;
  transition: color 0.2s ease;
}

.register-link:hover {
  color: #DB2777;
}

/* ========== 响应式设计 ========== */
@media (max-width: 900px) {
  .login-container {
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
  .login-page {
    padding: 0;
    background: white;
  }

  .login-background {
    display: none;
  }

  .login-container {
    border-radius: 0;
    min-height: 100vh;
    box-shadow: none;
  }

  .form-section {
    padding: 32px 24px;
  }

  .login-tabs {
    margin-bottom: 24px;
  }

  .social-login {
    grid-template-columns: 1fr;
  }
}

/* ========== 减少动画偏好 ========== */
@media (prefers-reduced-motion: reduce) {
  .gradient-orb,
  .brand-logo,
  .login-container,
  .submit-btn::before {
    animation: none;
  }

  .login-container {
    opacity: 1;
    transform: none;
  }
}
</style>
