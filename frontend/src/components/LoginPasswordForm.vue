<template>
  <form class="auth-form" @submit.prevent="$emit('submit')">
    <div class="form-group" :class="{ 'has-error': errors.phone }">
      <label class="form-label">
        <svg class="label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          />
        </svg>
        {{ t('手机号') }}
      </label>
      <div class="input-wrapper">
        <span class="phone-prefix">+86</span>
        <input
          :value="phone"
          type="tel"
          :placeholder="t('请输入手机号')"
          :disabled="isLoading"
          @blur="$emit('blur', 'phone')"
          @input="$emit('update:phone', $event.target.value)"
          @focus="$emit('focus')"
        >
        <div v-if="phone" class="input-clear" @click="$emit('update:phone', '')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" stroke-width="2" />
            <path d="M15 9l-6 6M9 9l6 6" stroke-width="2" stroke-linecap="round" />
          </svg>
        </div>
      </div>
      <span v-if="errors.phone" class="error-message">{{ errors.phone }}</span>
    </div>

    <div class="form-group" :class="{ 'has-error': errors.password }">
      <label class="form-label">
        <svg class="label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke-width="2" />
          <circle cx="12" cy="16" r="1" fill="currentColor" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke-width="2" />
        </svg>
        {{ t('密码') }}
      </label>
      <div class="input-wrapper">
        <input
          :value="password"
          :type="showPassword ? 'text' : 'password'"
          :placeholder="t('请输入密码')"
          :disabled="isLoading"
          @blur="$emit('blur', 'password')"
          @input="$emit('update:password', $event.target.value)"
          @focus="$emit('focus')"
        >
        <button type="button" class="password-toggle" @click="$emit('update:showPassword', !showPassword)">
          <svg v-if="showPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke-width="2" />
            <circle cx="12" cy="12" r="3" stroke-width="2" />
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke-width="2" />
            <line x1="1" y1="1" x2="23" y2="23" stroke-width="2" />
          </svg>
        </button>
      </div>
      <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
    </div>

    <div class="form-options">
      <label class="remember-me">
        <input :checked="remember" type="checkbox" @change="$emit('update:remember', $event.target.checked)">
        <span class="checkbox-custom" />
        <span class="checkbox-label">{{ t('记住我') }}</span>
      </label>
      <a href="#" class="forgot-link" @click.prevent="$emit('forgot')">{{ t('忘记密码?') }}</a>
    </div>

    <button type="submit" class="submit-btn" :disabled="isLoading">
      <span v-if="!isLoading">{{ t('登录') }}</span>
      <span v-else class="loading-spinner" />
    </button>
  </form>
</template>

<script setup>
import { useI18n } from '../composables/useI18n.js';
const { t } = useI18n();
defineProps({
  phone: { type: String, default: '' },
  password: { type: String, default: '' },
  remember: { type: Boolean, default: false },
  errors: { type: Object, required: true },
  isLoading: { type: Boolean, default: false },
  showPassword: { type: Boolean, default: false },
});

defineEmits([
  'submit',
  'update:phone',
  'update:password',
  'update:remember',
  'update:showPassword',
  'blur',
  'focus',
  'forgot',
]);
</script>

<style scoped>
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
  border: 2px solid var(--border-color);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.remember-me input:checked + .checkbox-custom {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
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
  color: var(--text-secondary);
}

.forgot-link {
  font-size: 14px;
  font-weight: 600;
  color: var(--primary);
  text-decoration: none;
  transition: color 0.2s ease;
}

.forgot-link:hover {
  color: var(--primary-dark);
}
</style>
