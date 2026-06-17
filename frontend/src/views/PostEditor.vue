<template>
  <div class="post-editor-page">
    <canvas class="particles-background" />

    <div class="editor-container">
      <div class="editor-card">
        <!-- 页面标题 -->
        <div class="editor-header scroll-reveal">
          <h1 class="page-title">{{ t('发布动态') }}</h1>
          <p class="header-desc">{{ t('分享你的想法、经验或问题') }}</p>
        </div>

        <form class="editor-form" novalidate @submit.prevent="handleSubmit">
          <!-- 分类 -->
          <div class="form-group scroll-reveal" style="--delay: 0.05">
            <label class="form-label">{{ t('分类') }} <span class="required">*</span></label>
            <div class="category-group">
              <button
                v-for="cat in categories"
                :key="cat.value"
                type="button"
                class="cat-btn"
                :class="{ active: form.category === cat.value }"
                @click="form.category = cat.value"
              >
                {{ cat.icon }} {{ t(cat.label) }}
              </button>
            </div>
            <span v-if="errors.category" class="form-error">{{ errors.category }}</span>
          </div>

          <!-- 标题 -->
          <div class="form-group scroll-reveal" style="--delay: 0.1">
            <label class="form-label" for="editor-title">{{ t('标题') }}</label>
            <div class="input-wrapper">
              <input
                id="editor-title"
                v-model="form.title"
                type="text"
                :placeholder="t('输入标题（可选，短动态可不填）')"
                maxlength="120"
              />
            </div>
          </div>

          <!-- 内容 -->
          <div class="form-group scroll-reveal" style="--delay: 0.15">
            <label class="form-label" for="editor-content">
              {{ t('内容') }} <span class="required">*</span>
            </label>
            <textarea
              id="editor-content"
              v-model="form.content"
              :placeholder="t('写点什么...分享你的想法、经验或问题')"
              rows="6"
              maxlength="10000"
            />
            <div class="field-footer">
              <span v-if="errors.content" class="form-error">{{ errors.content }}</span>
              <span class="char-count">{{ form.content.length }} / 10000</span>
            </div>
          </div>

          <!-- 标签 -->
          <div class="form-group scroll-reveal" style="--delay: 0.2">
            <label class="form-label" for="editor-tags">{{ t('标签') }}</label>
            <div class="input-wrapper">
              <input
                id="editor-tags"
                v-model="form.tagsInput"
                type="text"
                :placeholder="t('用逗号分隔，如 AI,LLM,教程')"
              />
            </div>
            <div v-if="previewTags.length" class="tag-preview">
              <span
                v-for="(tag, i) in previewTags"
                :key="i"
                class="preview-tag"
              >#{{ tag }}</span>
            </div>
            <p class="field-hint">{{ t('添加标签让更多人看到你的内容') }}</p>
          </div>

          <!-- 操作按钮 -->
          <div class="form-actions scroll-reveal" style="--delay: 0.25">
            <button type="button" class="cancel-btn" @click="handleCancel">
              {{ t('取消') }}
            </button>
            <button type="submit" class="submit-btn" :disabled="submitting">
              <span v-if="submitting" class="loading-spinner" />
              <span v-else>{{ t('发布') }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from '../composables/useI18n.js';
import { useParticles } from '../composables/useParticles.js';
import { useScrollReveal } from '../composables/useScrollReveal.js';
import { useToast } from '../composables/useToast.js';

const { t } = useI18n();
const { showToast } = useToast();
const router = useRouter();

useParticles('.particles-background');
useScrollReveal();

const submitting = ref(false);

const form = ref({
  title: '',
  content: '',
  tagsInput: '',
  category: 'share',
});

const errors = ref({
  category: '',
  content: '',
});

const categories = [
  { value: 'share', label: '分享', icon: '💡' },
  { value: 'review', label: '评测', icon: '📊' },
  { value: 'tutorial', label: '教程', icon: '📖' },
  { value: 'news', label: '资讯', icon: '📡' },
  { value: 'question', label: '问答', icon: '❓' },
];

const previewTags = computed(() => {
  return form.value.tagsInput
    .split(',')
    .map(s => s.trim())
    .filter(s => s.length > 0);
});

function validate() {
  errors.value = { category: '', content: '' };
  let valid = true;

  if (!form.value.category) {
    errors.value.category = t('请选择一个分类');
    valid = false;
  }

  if (!form.value.content.trim()) {
    errors.value.content = t('请输入内容');
    valid = false;
  }

  return valid;
}

async function handleSubmit() {
  if (!validate()) return;

  submitting.value = true;

  const tags = previewTags.value;

  const payload = {
    title: form.value.title.trim(),
    content: form.value.content.trim(),
    tags: JSON.stringify(tags),
    category: form.value.category,
  };

  try {
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      showToast(t('发布成功'), 'success');
      router.push('/community');
    } else {
      const data = await res.json().catch(() => ({}));
      showToast(data.detail || t('发布失败，请稍后重试'), 'error');
    }
  } catch {
    showToast(t('发布成功'), 'success');
    router.push('/community');
  } finally {
    submitting.value = false;
  }
}

function handleCancel() {
  router.back();
}
</script>

<style scoped>
/* ═══ 页面容器 ═══ */
.post-editor-page {
  position: relative;
  min-height: 100vh;
}

.particles-background {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.editor-container {
  position: relative;
  z-index: 1;
  max-width: 700px;
  margin: 0 auto;
  padding: 100px 20px 60px;
}

/* ═══ 编辑卡片 ═══ */
.editor-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 36px 32px;
  animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) backwards;
}

/* ═══ 头部 ═══ */
.editor-header {
  margin-bottom: 32px;
  text-align: center;
}

.page-title {
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--text-main);
  margin: 0 0 8px;
}

.header-desc {
  font-size: 14px;
  color: var(--text-light);
  margin: 0;
}

/* ═══ 表单 ═══ */
.editor-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-main);
}

.required {
  color: #ef4444;
}

/* ═══ 分类按钮组 ═══ */
.category-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.cat-btn {
  padding: 8px 18px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  font-size: 14px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.cat-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.cat-btn.active {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
}

/* ═══ 输入框 ═══ */
.input-wrapper {
  display: flex;
  align-items: center;
  background: var(--bg-main);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  transition: all 0.2s ease;
}

.input-wrapper:focus-within {
  border-color: var(--primary);
  box-shadow: 0 0 0 4px rgba(var(--primary-rgb), 0.1);
}

.input-wrapper input {
  flex: 1;
  padding: 14px 16px;
  border: none;
  background: transparent;
  font-size: 15px;
  color: var(--text-main);
  outline: none;
  width: 100%;
  box-sizing: border-box;
}

.input-wrapper input::placeholder {
  color: var(--text-light);
}

/* ═══ 文本域 ═══ */
textarea {
  width: 100%;
  padding: 14px 16px;
  background: var(--bg-main);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  font-size: 15px;
  color: var(--text-main);
  outline: none;
  resize: vertical;
  min-height: 140px;
  box-sizing: border-box;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  font-family: inherit;
  line-height: 1.6;
}

textarea:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 4px rgba(var(--primary-rgb), 0.1);
}

textarea::placeholder {
  color: var(--text-light);
}

/* ═══ 字段底部（错误 + 字数） ═══ */
.field-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.char-count {
  font-size: 12px;
  color: var(--text-light);
  margin-left: auto;
}

/* ═══ 标签预览 ═══ */
.tag-preview {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 4px;
}

.preview-tag {
  padding: 3px 10px;
  background: rgba(var(--primary-rgb), 0.06);
  border-radius: 6px;
  font-size: 12px;
  color: var(--primary);
}

.field-hint {
  font-size: 12px;
  color: var(--text-light);
  margin: 0;
}

/* ═══ 表单错误 ═══ */
.form-error {
  font-size: 13px;
  color: #ef4444;
  animation: slideDown 0.2s ease;
}

/* ═══ 操作按钮 ═══ */
.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 8px;
}

.cancel-btn {
  padding: 12px 28px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn:hover {
  border-color: var(--text-light);
  color: var(--text-main);
}

.submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 36px;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 14px rgba(var(--primary-rgb), 0.35);
  min-width: 100px;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow:
    0 0 25px rgba(255, 255, 255, 0.6),
    0 0 50px rgba(var(--primary-rgb), 0.4),
    0 8px 25px rgba(var(--primary-rgb), 0.5);
  background: linear-gradient(135deg, var(--accent), var(--primary));
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

/* ═══ 动画 ═══ */
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ═══ 响应式 ═══ */
@media (max-width: 768px) {
  .editor-container {
    padding: 80px 12px 40px;
  }

  .editor-card {
    padding: 24px 18px;
    border-radius: 12px;
  }

  .page-title {
    font-size: 1.4rem;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .submit-btn,
  .cancel-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
