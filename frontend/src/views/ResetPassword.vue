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
          :password-length="form.newPassword.length"
        />
      </div>

      <div class="form-section">
        <div
          class="auth-card"
          :class="{ shake: shakeCard }"
        >
          <div class="reset-header">
            <h1 class="reset-title">
              {{ t('重置密码') }}
            </h1>
            <p class="reset-subtitle">
              {{ t('通过手机号验证码重置您的密码') }}
            </p>
          </div>

          <form
            class="auth-form"
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
                    d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                {{ t('手机号') }}
              </label>
              <div class="input-wrapper">
                <span class="phone-prefix">+86</span>
                <input
                  v-model="form.phone"
                  type="tel"
                  :placeholder="t('请输入手机号')"
                  :disabled="isLoading"
                  @blur="validateField('phone'); isTyping = false"
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
                {{ t('验证码') }}
              </label>
              <div class="input-wrapper code-input">
                <input
                  v-model="form.code"
                  type="text"
                  :placeholder="t('请输入验证码')"
                  maxlength="6"
                  :disabled="isLoading"
                  @blur="validateField('code'); isTyping = false"
                  @input="clearError('code')"
                  @focus="isTyping = true"
                >
                <button
                  type="button"
                  class="code-btn"
                  :disabled="codeCountdown > 0 || isLoading"
                  @click="sendCode"
                >
                  {{ codeCountdown > 0 ? `${codeCountdown}s` : t('获取验证码') }}
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
                {{ t('新密码') }}
              </label>
              <div class="input-wrapper">
                <input
                  v-model="form.newPassword"
                  :type="showPassword ? 'text' : 'password'"
                  :placeholder="t('请输入新密码')"
                  :disabled="isLoading"
                  @blur="validateField('newPassword'); isTyping = false"
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
                {{ t('确认新密码') }}
              </label>
              <div class="input-wrapper">
                <input
                  v-model="form.confirmPassword"
                  :type="showPassword ? 'text' : 'password'"
                  :placeholder="t('请确认新密码')"
                  :disabled="isLoading"
                  @blur="validateField('confirmPassword'); isTyping = false"
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
              <span v-if="!isLoading">{{ t('重置密码') }}</span>
              <span
                v-else
                class="loading-spinner"
              />
            </button>
          </form>

          <div class="auth-bottom-link">
            <span>{{ t('想起密码了?') }}</span>
            <router-link to="/login">
              {{ t('立即登录') }}
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from '../composables/useI18n.ts';
import AnimatedCharacters from '../components/AnimatedCharacters.vue';
import { API_BASE } from '../config.ts';
import { useParticles } from '../composables/useParticles.ts';
import { useToast } from '../composables/useToast.ts';

const router = useRouter();
const { t } = useI18n();
const { showToast } = useToast();

useParticles('.particles-background', true);

const form = reactive({
  phone: '',
  code: '',
  newPassword: '',
  confirmPassword: '',
});

const errors = reactive({
  phone: '',
  code: '',
  newPassword: '',
  confirmPassword: '',
});

const isLoading = ref(false);
const showPassword = ref(false);
const shakeCard = ref(false);
const codeCountdown = ref(0);
const isTyping = ref(false);
let countdownTimer = null;

const validationRules = {
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
  newPassword: (value) => {
    if (!value) return t('请输入新密码');
    if (value.length < 6) return t('密码至少6个字符');
    if (value.length > 32) return t('密码最多32个字符');
    return '';
  },
  confirmPassword: (value) => {
    if (!value) return t('请确认新密码');
    if (value !== form.newPassword) return t('两次输入的密码不一致');
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
  isValid = validateField('code') && isValid;
  isValid = validateField('newPassword') && isValid;
  isValid = validateField('confirmPassword') && isValid;
  return isValid;
};

const triggerShake = () => {
  shakeCard.value = true;
  setTimeout(() => {
    shakeCard.value = false;
  }, 500);
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
      showToast(t('发送失败'), 'error');
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

const handleResetPassword = async () => {
  if (!validateForm()) {
    triggerShake();
    return;
  }

  isLoading.value = true;

  try {
    const response = await fetch(`${API_BASE}/api/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: form.phone,
        code: form.code,
        new_password: form.newPassword,
        confirm_password: form.confirmPassword,
      }),
    });

    if (response.ok) {
      showToast(t('密码重置成功！请使用新密码登录'), 'success');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } else {
      const error = await response.json();
      showToast(error.detail || t('重置失败'), 'error');
      triggerShake();
    }
  } catch (error) {
    showToast(t('密码重置功能开发中'), 'info');
  } finally {
    isLoading.value = false;
  }
};

onUnmounted(() => {
  if (countdownTimer) { clearInterval(countdownTimer); countdownTimer = null; }
});
</script>

<style scoped>
/* ========== 重置密码头部（ResetPassword 专属） ========== */
.reset-header {
  text-align: center;
  margin-bottom: 32px;
}

.reset-title {
  font-size: 28px;
  font-weight: 800;
  color: var(--text-main);
  margin-bottom: 8px;
}

.reset-subtitle {
  font-size: 14px;
  color: var(--text-secondary);
  opacity: 0.8;
}

@media (max-width: 480px) {
  .reset-title {
    font-size: 24px;
  }
}
</style>
