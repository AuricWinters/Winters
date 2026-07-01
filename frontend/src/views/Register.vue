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
          <div class="register-header">
            <h2 class="register-title">
              {{ t('创建账号') }}
            </h2>
            <p class="register-subtitle">
              {{ t('加入 Winters 社区，开启您的数字之旅') }}
            </p>
          </div>

          <form
            class="auth-form"
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
                {{ t('手机号') }}
              </label>
              <div class="input-wrapper">
                <input
                  v-model="form.phone"
                  type="tel"
                  :placeholder="t('请输入手机号')"
                  :disabled="isLoading"
                  @blur="validateField('phone'); isTyping = false"
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
                {{ t('确认密码') }}
              </label>
              <div class="input-wrapper">
                <input
                  v-model="form.confirmPassword"
                  :type="showPassword ? 'text' : 'password'"
                  :placeholder="t('请再次输入密码')"
                  :disabled="isLoading"
                  @blur="validateField('confirmPassword'); isTyping = false"
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
              >{{ errors.confirmPassword }}</span>
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

          <div class="divider">
            <span>{{ t('或者') }}</span>
          </div>

          <div class="social-login">
            <button
              type="button"
              class="social-btn wechat"
              @click="socialRegister('wechat')"
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
              @click="socialRegister('github')"
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

          <div class="auth-bottom-link">
            <span>{{ t('已有账号?') }}</span>
            <router-link to="/login">
              {{ t('立即登录') }}
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
import { useI18n } from '../composables/useI18n.ts';
import AnimatedCharacters from '../components/AnimatedCharacters.vue';
import { useUserStore } from '../stores/user.ts';
import { useParticles } from '../composables/useParticles.ts';
import { useToast } from '../composables/useToast.ts';

const { t } = useI18n();
const router = useRouter();
const userStore = useUserStore();
const { showToast } = useToast();
useParticles('.particles-background', true);

const form = reactive({
  phone: '',
  email: '',
  password: '',
  confirmPassword: '',
});

const errors = reactive({
  phone: '',
  email: '',
  password: '',
  confirmPassword: '',
});

const isLoading = ref(false);
const showPassword = ref(false);
const shakeCard = ref(false);
const isTyping = ref(false);

const validationRules = {
  phone: (value) => {
    if (!value) return t('请输入手机号');
    if (!/^1[3-9]\d{9}$/.test(value)) return t('请输入正确的手机号');
    return '';
  },
  email: (value) => {
    if (!value) return t('请输入邮箱');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return t('请输入正确的邮箱地址');
    return '';
  },
  password: (value) => {
    if (!value) return t('请输入密码');
    if (value.length < 4) return t('密码至少4个字符');
    if (value.length > 32) return t('密码最多32个字符');
    return '';
  },
  confirmPassword: (value) => {
    if (!value) return t('请确认密码');
    if (value !== form.password) return t('两次输入的密码不一致');
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

const validateForm = () => {
  let isValid = true;
  isValid = validateField('phone') && isValid;
  isValid = validateField('email') && isValid;
  isValid = validateField('password') && isValid;
  isValid = validateField('confirmPassword') && isValid;
  return isValid;
};

const triggerShake = () => {
  shakeCard.value = true;
  setTimeout(() => {
    shakeCard.value = false;
  }, 500);
};

const handleRegister = async () => {
  if (!validateForm()) {
    triggerShake();
    return;
  }

  isLoading.value = true;

  try {
    const result = await userStore.register(form.phone, form.password, form.confirmPassword, { nickname: form.phone, phone: form.phone, email: form.email });

    if (result.success) {
      showToast(t('注册成功！正在跳转...'), 'success');
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } else {
      const errorMsg = result.error;
      if (errorMsg.includes(t('手机号'))) {
        errors.phone = errorMsg;
      } else if (errorMsg.includes(t('邮箱'))) {
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

const socialRegister = (type) => {
  showToast(`${type === 'wechat' ? t('微信') : 'GitHub'}${t('注册功能开发中')}`, 'info');
};
</script>

<style scoped>
/* ========== 注册头部（Register 专属） ========== */
.register-header {
  margin-bottom: 32px;
  text-align: center;
}

.register-title {
  font-size: 28px;
  font-weight: 800;
  color: var(--text-main);
  margin-bottom: 8px;
}

.register-subtitle {
  font-size: 16px;
  color: var(--text-secondary);
}
</style>
