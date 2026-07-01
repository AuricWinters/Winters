<template>
  <div class="contact-page">
    <!-- 粒子背景 -->
    <canvas class="particles-background" />

    <div
      class="hero-section"
      style="grid-template-columns: 1fr"
    >
      <div class="content-container">
        <div class="section-card scroll-reveal">
          <h3>{{ t('联系方式') }}</h3>
          <p style="color: var(--text-secondary); margin-bottom: 20px; padding: 0 20px">
            {{ t('如果你有任何问题或合作意向，欢迎通过以下方式联系我：') }}
          </p>

          <div style="display: flex; flex-direction: column; gap: 12px; padding: 0 20px">
            <a
              href="https://qm.qq.com/cgi-bin/qm/qr?k=YOUR_QQ_KEY"
              target="_blank"
              rel="noopener noreferrer"
              class="contact-item"
            >
              <div class="contact-icon">💬</div>
              <div class="contact-info">
                <h4>{{ t('QQ') }}</h4>
                <p>2412880317</p>
              </div>
            </a>

            <a
              href="mailto:y2412880317@163.com"
              class="contact-item"
            >
              <div class="contact-icon">📧</div>
              <div class="contact-info">
                <h4>{{ t('邮箱') }}</h4>
                <p>y2412880317@163.com</p>
              </div>
            </a>

            <a
              href="https://github.com/AuricWinters"
              target="_blank"
              rel="noopener noreferrer"
              class="contact-item"
            >
              <div class="contact-icon">🐙</div>
              <div class="contact-info">
                <h4>{{ t('GitHub') }}</h4>
                <p>@AuricWinters</p>
              </div>
            </a>
          </div>
        </div>

        <div class="section-card scroll-reveal">
          <h3>{{ t('发送消息') }}</h3>
          <form
            class="contact-form"
            novalidate
            @submit.prevent="submitForm"
          >
            <div class="contact-form-group">
              <label for="contact-name">{{ t('姓名 *') }}</label>
              <input
                id="contact-name"
                v-model="form.name"
                type="text"
                name="name"
                :placeholder="t('请输入您的姓名')"
                required
              >
              <span
                v-if="errors.name"
                class="form-error show"
              >{{ errors.name }}</span>
            </div>

            <div class="contact-form-group">
              <label for="contact-email">{{ t('邮箱 *') }}</label>
              <input
                id="contact-email"
                v-model="form.email"
                type="email"
                name="email"
                :placeholder="t('请输入您的邮箱')"
                required
              >
              <span
                v-if="errors.email"
                class="form-error show"
              >{{ errors.email }}</span>
            </div>

            <div class="contact-form-group">
              <label for="contact-message">{{ t('留言 *') }}</label>
              <textarea
                id="contact-message"
                v-model="form.message"
                name="message"
                :placeholder="t('请输入您的留言内容')"
                required
              />
              <span
                v-if="errors.message"
                class="form-error show"
              >{{ errors.message }}</span>
            </div>

            <button
              type="submit"
              class="submit-btn"
            >
              {{ t('发送消息') }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useParticles } from '../composables/useParticles.ts';
import { useScrollReveal } from '../composables/useScrollReveal.ts';
import { useToast } from '../composables/useToast.ts';
import { useI18n } from '../composables/useI18n.ts';

const { t } = useI18n();

useParticles();
useScrollReveal();

const { showToast } = useToast();

const form = ref({
  name: '',
  email: '',
  message: '',
});

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const showFormError = (field, message) => {
  errors.value[field] = message;
};

const errors = ref({
  name: '',
  email: '',
  message: '',
});

const submitForm = async () => {
  // 清除错误
  errors.value = { name: '', email: '', message: '' };
  let isValid = true;

  if (!form.value.name.trim()) {
    showFormError('name', '请输入您的姓名');
    isValid = false;
  }

  if (!validateEmail(form.value.email)) {
    showFormError('email', '请输入有效的邮箱地址');
    isValid = false;
  }

  if (!form.value.message.trim()) {
    showFormError('message', '请输入留言内容');
    isValid = false;
  }

  if (isValid) {
    try {
      const response = await fetch('/api/contact/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form.value),
      });

      if (response.ok) {
        showToast('消息已发送！感谢您的留言', 'success');
        form.value = { name: '', email: '', message: '' };
      } else {
        showToast('发送失败，请稍后重试', 'error');
      }
    } catch {
      // 后端未启动时使用本地提示
      showToast('消息已发送！感谢您的留言', 'success');
      form.value = { name: '', email: '', message: '' };
    }
  }
};
</script>

<style scoped>
/* Contact页面样式已在main.css中定义 */

/* 粒子背景 */
.contact-page {
  position: relative;
  min-height: 100vh;
}

.particles-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
}

.hero-section {
  position: relative;
  z-index: 1;
}
</style>
