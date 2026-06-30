<template>
  <form
    class="auth-form"
    @submit.prevent="$emit('submit')"
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
          :value="code"
          type="text"
          :placeholder="t('请输入验证码')"
          maxlength="6"
          :disabled="isLoading"
          @blur="$emit('blur', 'code')"
          @input="$emit('update:code', $event.target.value)"
          @focus="$emit('focus')"
        >
        <button
          type="button"
          class="code-btn"
          :disabled="codeCountdown > 0 || isLoading"
          @click="$emit('sendCode')"
        >
          {{ codeCountdown > 0 ? `${codeCountdown}s` : t('获取验证码') }}
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
      <span v-if="!isLoading">{{ t('登录') }}</span>
      <span
        v-else
        class="loading-spinner"
      />
    </button>
  </form>
</template>

<script setup>
import { useI18n } from '../composables/useI18n.js';
const { t } = useI18n();

defineProps({
  phone: { type: String, default: '' },
  code: { type: String, default: '' },
  errors: { type: Object, required: true },
  isLoading: { type: Boolean, default: false },
  codeCountdown: { type: Number, default: 0 },
});

defineEmits(['submit', 'update:phone', 'update:code', 'blur', 'focus', 'sendCode']);
</script>
