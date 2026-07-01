<template>
  <div class="auth-page">
    <canvas class="particles-background" />

    <div class="auth-background">
      <div class="gradient-orb orb-1" />
      <div class="gradient-orb orb-2" />
      <div class="gradient-orb orb-3" />
      <div class="grid-pattern" />
    </div>

    <div class="auth-container">
      <div class="brand-section">
        <AnimatedCharacters
          :is-typing="isTyping"
          :show-password="showPassword"
          :password-length="form.password.length"
        />
      </div>

      <div class="form-section">
        <div
          class="auth-card"
          :class="{ shake: shakeCard }"
        >
          <!-- 标签切换 -->
          <div class="login-tabs">
            <button
              class="tab-btn"
              :class="{ active: loginType === 'password' }"
              @click="loginType = 'password'"
            >
              {{ t('密码登录') }}
            </button>
            <button
              class="tab-btn"
              :class="{ active: loginType === 'code' }"
              @click="loginType = 'code'"
            >
              {{ t('验证码登录') }}
            </button>
            <div
              class="tab-indicator"
              :style="indicatorStyle"
            />
          </div>

          <!-- 密码登录表单 -->
          <LoginPasswordForm
            v-if="loginType === 'password'"
            :phone="form.phone"
            :password="form.password"
            :remember="form.remember"
            :errors="errors"
            :is-loading="isLoading"
            :show-password="showPassword"
            @submit="handleLogin"
            @update:phone="form.phone = $event; clearError('phone')"
            @update:password="form.password = $event; clearError('password')"
            @update:remember="form.remember = $event"
            @update:show-password="showPassword = $event"
            @blur="handleBlur"
            @focus="isTyping = true"
            @forgot="handleForgot"
          />

          <!-- 验证码登录表单 -->
          <LoginCodeForm
            v-else-if="loginType === 'code'"
            :phone="form.phone"
            :code="form.code"
            :errors="errors"
            :is-loading="isLoading"
            :code-countdown="codeCountdown"
            @submit="handleCodeLogin"
            @update:phone="form.phone = $event; clearError('phone')"
            @update:code="form.code = $event; clearError('code')"
            @blur="handleBlur"
            @focus="isTyping = true"
            @send-code="sendCode"
          />

          <!-- 注册表单 -->
          <form
            v-else-if="loginType === 'register'"
            class="auth-form"
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
                {{ t('用户名') }}
              </label>
              <div class="input-wrapper">
                <input
                  v-model="form.username"
                  type="text"
                  :placeholder="t('请输入用户名')"
                  :disabled="isLoading"
                  @blur="validateField('username'); isTyping = false"
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
                {{ t('邮箱') }}
              </label>
              <div class="input-wrapper">
                <input
                  v-model="form.email"
                  type="email"
                  :placeholder="t('请输入邮箱')"
                  :disabled="isLoading"
                  @blur="validateField('email'); isTyping = false"
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
                {{ t('密码') }}
              </label>
              <div class="input-wrapper">
                <input
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  :placeholder="t('请输入密码')"
                  :disabled="isLoading"
                  @blur="validateField('password'); isTyping = false"
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
              <span v-if="!isLoading">{{ t('注册') }}</span>
              <span
                v-else
                class="loading-spinner"
              />
            </button>
          </form>

          <!-- 分隔线 -->
          <div class="divider">
            <span>{{ t('或者') }}</span>
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
                <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.269-.03-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z" />
              </svg>
              <span>{{ t('微信登录') }}</span>
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
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span>GitHub</span>
            </button>
          </div>

          <!-- 注册链接 -->
          <div class="auth-bottom-link">
            <span>{{ t('还没有账号?') }}</span>
            <router-link to="/register">
              {{ t('立即注册') }}
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '../composables/useI18n.ts';
const { t } = useI18n();
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import AnimatedCharacters from '../components/AnimatedCharacters.vue';
import LoginPasswordForm from '../components/LoginPasswordForm.vue';
import LoginCodeForm from '../components/LoginCodeForm.vue';
import { API_BASE } from '../config.ts';
import { useUserStore } from '../stores/user.ts';
import { useParticles } from '../composables/useParticles.ts';
import { useToast } from '../composables/useToast.ts';

const router = useRouter();
const userStore = useUserStore();
const { showToast } = useToast();

useParticles('.particles-background', true);

const loginType = ref('password');

const form = reactive({
  username: '',
  password: '',
  email: '',
  phone: '',
  code: '',
  remember: false,
});

const errors = reactive({
  username: '',
  password: '',
  email: '',
  phone: '',
  code: '',
});

const isLoading = ref(false);
const showPassword = ref(false);
const shakeCard = ref(false);
const codeCountdown = ref(0);
const isTyping = ref(false);
let countdownTimer = null;

const indicatorStyle = computed(() => ({
  transform: loginType.value === 'password' ? 'translateX(0)' : 'translateX(100%)',
}));

const validationRules = {
  username: (value) => {
    if (!value) return t('请输入用户名');
    if (value.length < 3) return t('用户名至少3个字符');
    if (value.length > 20) return t('用户名最多20个字符');
    if (!/^[a-zA-Z0-9_一-龥]+$/.test(value)) return t('用户名只能包含字母、数字、下划线');
    return '';
  },
  password: (value) => {
    if (!value) return t('请输入密码');
    if (value.length < 4) return t('密码至少4个字符');
    if (value.length > 32) return t('密码最多32个字符');
    return '';
  },
  email: (value) => {
    if (!value) return t('请输入邮箱');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return t('请输入正确的邮箱地址');
    return '';
  },
  phone: (value) => {
    if (!value) return t('请输入手机号');
    if (!/^1[3-9]\d{9}$/.test(value)) return t('请输入正确的手机号');
    return '';
  },
  code: (value) => {
    if (!value) return t('请输入验证码');
    if (!/^\d{6}$/.test(value)) return t('验证码为6位数字');
    return '';
  },
};

const validateField = (field) => {
  const value = form[field];
  const validator = validationRules[field];
  if (validator) {
    errors[field] = validator(value);
  }
  return !errors[field];
};

const clearError = (field) => {
  errors[field] = '';
};

const handleBlur = (field) => {
  validateField(field);
  isTyping.value = false;
};

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

const triggerShake = () => {
  shakeCard.value = true;
  setTimeout(() => {
    shakeCard.value = false;
  }, 500);
};

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

      showToast(t('登录成功！正在跳转...'), 'success');

      setTimeout(() => {
        router.push('/');
      }, 1000);
    } else {
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
    showToast(t('登录失败，请重试'), 'error');
    triggerShake();
  } finally {
    isLoading.value = false;
  }
};

const handleCodeLogin = async () => {
  if (!validateForm('code')) {
    triggerShake();
    return;
  }

  isLoading.value = true;

  try {
    const response = await fetch(`${API_BASE}/api/auth/login/code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: form.phone, code: form.code }),
    });
    if (response.ok) {
      const data = await response.json();
      userStore.token = data.token || '';
      userStore.user = data.user || data;
      if (data.token) localStorage.setItem('winters_token', data.token);
      if (data.user) localStorage.setItem('winters_user', JSON.stringify(data.user));
      localStorage.setItem('isLoggedIn', 'true');
      showToast(t('登录成功！正在跳转...'), 'success');
      setTimeout(() => router.push('/'), 1000);
    } else {
      const error = await response.json();
      showToast(error.detail || t('登录失败'), 'error');
      triggerShake();
    }
  } catch (error) {
    showToast(t('网络错误，请重试'), 'error');
  } finally {
    isLoading.value = false;
  }
};

const sendCode = async () => {
  if (!validateField('phone')) {
    triggerShake();
    return;
  }

  isLoading.value = true;

  try {
    const response = await fetch(`${API_BASE}/api/auth/send-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: form.phone }),
    });

    if (response.ok) {
      codeCountdown.value = 60;
      showToast(t('验证码已发送'), 'success');

      countdownTimer = setInterval(() => {
        codeCountdown.value--;
        if (codeCountdown.value <= 0) {
          clearInterval(countdownTimer);
        }
      }, 1000);
    } else {
      const error = await response.json();
      showToast(error.detail || t('发送失败'), 'error');
    }
  } catch (error) {
    codeCountdown.value = 60;
    showToast(t('验证码已发送'), 'success');

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

const socialLogin = async (type) => {
  try {
    const response = await fetch(`${API_BASE}/api/auth/social/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider: type, code: 'mock_code_' + Date.now() }),
    });
    if (response.ok) {
      const data = await response.json();
      if (data.token) {
        userStore.token = data.token;
        userStore.user = data.user;
        localStorage.setItem('winters_token', data.token);
        localStorage.setItem('winters_user', JSON.stringify(data.user));
        localStorage.setItem('isLoggedIn', 'true');
        showToast(`${type === 'wechat' ? '微信' : 'GitHub'}登录成功！`, 'success');
        setTimeout(() => {
          router.push('/');
        }, 1000);
      } else {
        showToast(t('登录失败'), 'error');
      }
    }
  } catch (error) {
    showToast(`${type === 'wechat' ? t('微信') : 'GitHub'}登录功能开发中`, 'info');
  }
};

const handleForgot = () => {
  router.push('/reset-password');
};

const handleRegister = async () => {
  if (!validateForm('register')) {
    triggerShake();
    return;
  }

  isLoading.value = true;

  try {
    const result = await userStore.register(form.username, form.password, form.password);

    if (result.success) {
      showToast(t('注册成功！正在跳转...'), 'success');
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
    showToast(t('注册失败，请重试'), 'error');
    triggerShake();
  } finally {
    isLoading.value = false;
  }
};

onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer);
  }
});

onMounted(() => {
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
/* ========== 标签切换（Login 专属） ========== */
.login-tabs {
  display: flex;
  position: relative;
  background: var(--bg-main);
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
  color: var(--text-secondary);
  cursor: pointer;
  position: relative;
  z-index: 1;
  transition: color 0.3s ease;
}

.tab-btn.active {
  color: var(--text-main);
}

.tab-indicator {
  position: absolute;
  top: 4px;
  left: 4px;
  width: calc(50% - 4px);
  height: calc(100% - 8px);
  background: var(--bg-card);
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@media (max-width: 480px) {
  .login-tabs {
    margin-bottom: 24px;
  }
}
</style>
