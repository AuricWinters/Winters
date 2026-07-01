<template>
  <div class="drive-page">
    <!-- 粒子背景 -->
    <canvas class="particles-background" />

    <div
      class="hero-section"
      style="grid-template-columns: 1fr"
    >
      <div class="content-container">
        <div class="section-card scroll-reveal">
          <div
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 20px;
            "
          >
            <h3>{{ t('我的文件') }}</h3>
            <input
              ref="fileInput"
              type="file"
              style="display: none"
              @change="handleFileUpload"
            >
            <button
              class="login-btn"
              style="padding: 8px 16px; font-size: 12px"
              :disabled="uploading"
              @click="triggerFileUpload"
            >
              {{ uploading ? t('上传中...') : t('上传文件') }}
            </button>
          </div>

          <!-- 加载状态 -->
          <div
            v-if="loading"
            class="loading-state"
          >
            <div
              class="skeleton"
              style="height: 50px; margin-bottom: 8px"
            />
            <div
              class="skeleton"
              style="height: 50px; margin-bottom: 8px"
            />
            <div
              class="skeleton"
              style="height: 50px"
            />
          </div>

          <!-- 空状态 -->
          <div
            v-else-if="files.length === 0"
            style="text-align: center; padding: 40px; color: var(--text-secondary)"
          >
            <p>{{ t('暂无文件') }}</p>
            <p style="font-size: 12px; margin-top: 8px">
              {{ t('点击"上传文件"按钮添加文件') }}
            </p>
          </div>

          <!-- 文件列表 -->
          <div
            v-else
            style="display: flex; flex-direction: column; gap: 5px"
          >
            <div
              v-for="file in files"
              :key="file.id"
              class="skill-item file-item"
              style="justify-content: space-between; padding: 10px 15px"
              tabindex="0"
              role="button"
            >
              <div style="display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0">
                <span aria-hidden="true">{{ getFileIcon(file.filename) }}</span>
                <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap">
                  {{ file.filename }}
                </span>
                <span
                  style="font-size: 11px; color: var(--text-light); flex-shrink: 0"
                >
                  ({{ file.size_str }})
                </span>
              </div>
              <div style="display: flex; align-items: center; gap: 10px; flex-shrink: 0">
                <span style="font-size: 11px; color: var(--text-light)">
                  {{ formatDate(file.created_at) }}
                </span>
                <button
                  class="file-action-btn"
                  :title="t('下载')"
                  @click.stop="downloadFile(file)"
                >
                  ⬇️
                </button>
                <button
                  class="file-action-btn delete"
                  :title="t('删除')"
                  @click.stop="deleteFile(file)"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>

          <!-- 存储空间 -->
          <div
            style="margin-top: 30px; padding: 15px; background: var(--bg-main); border-radius: 12px"
          >
            <div
              style="
                display: flex;
                justify-content: space-between;
                font-size: 12px;
                margin-bottom: 8px;
              "
            >
              <span>{{ t('存储空间') }} ({{ storageUsedStr }} / {{ storageTotalStr }})</span>
              <span>{{ storagePercent }}%</span>
            </div>
            <div
              style="height: 6px; background: #e2e8f0; border-radius: 3px; overflow: hidden"
              role="progressbar"
              :aria-valuenow="storagePercent"
              aria-valuemin="0"
              aria-valuemax="100"
            >
              <div
                :style="{
                  width: storagePercent + '%',
                  height: '100%',
                  background: storagePercent > 90 ? '#ef4444' : 'var(--primary)',
                  transition: 'width 0.3s ease'
                }"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from '../composables/useI18n.ts';
import { useParticles } from '../composables/useParticles.ts';
import { useScrollReveal } from '../composables/useScrollReveal.ts';
import { useToast } from '../composables/useToast.ts';

useParticles();
useScrollReveal();

const { t } = useI18n();
const { showToast } = useToast();

const files = ref([]);
const loading = ref(true);
const uploading = ref(false);
const storageUsed = ref(0);
const storageTotal = ref(10 * 1024 * 1024 * 1024); // 10 GB
const fileInput = ref(null);

const storageUsedStr = ref('0 B');
const storageTotalStr = ref('10 GB');
const storagePercent = ref(0);

// 获取文件图标
function getFileIcon(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  const iconMap = {
    pdf: '📄',
    doc: '📝',
    docx: '📝',
    txt: '📃',
    jpg: '🖼️',
    jpeg: '🖼️',
    png: '🖼️',
    gif: '🖼️',
    mp4: '🎬',
    mp3: '🎵',
    zip: '📦',
    rar: '📦',
    default: '📎'
  };
  return iconMap[ext] || iconMap.default;
}

// 格式化日期
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

// 加载文件列表
async function loadFiles() {
  loading.value = true;
  try {
    const response = await fetch('/api/files/');
    const data = await response.json();

    if (response.ok) {
      files.value = data.files;
      storageUsed.value = data.storage_used;
      storageUsedStr.value = data.storage_used_str;
      storageTotalStr.value = data.storage_total_str;
      storagePercent.value = data.storage_percent;
    } else {
      showToast('加载文件列表失败', 'error');
    }
  } catch (error) {
    showToast('无法连接到服务器', 'error');
  } finally {
    loading.value = false;
  }
}

// 触发文件上传
function triggerFileUpload() {
  fileInput.value.click();
}

// 处理文件上传
async function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  uploading.value = true;

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('/api/files/upload', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      showToast('文件上传成功', 'success');
      await loadFiles();
    } else {
      showToast(data.detail || '上传失败', 'error');
    }
  } catch (error) {
    showToast('上传失败，请检查网络', 'error');
  } finally {
    uploading.value = false;
    event.target.value = ''; // 清空 input
  }
}

// 下载文件
async function downloadFile(file) {
  try {
    const response = await fetch(`/api/files/${file.id}/download`);

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      showToast('开始下载', 'success');
    } else {
      showToast('下载失败', 'error');
    }
  } catch (error) {
    showToast('下载失败，请检查网络', 'error');
  }
}

// 删除文件
async function deleteFile(file) {
  if (!confirm(`确定要删除 "${file.filename}" 吗？`)) return;

  try {
    const response = await fetch(`/api/files/${file.id}`, {
      method: 'DELETE'
    });

    const data = await response.json();

    if (data.success) {
      showToast('文件已删除', 'success');
      await loadFiles();
    } else {
      showToast(data.detail || '删除失败', 'error');
    }
  } catch (error) {
    showToast('删除失败，请检查网络', 'error');
  }
}

onMounted(() => {
  loadFiles();
});
</script>

<style scoped>
/* Drive页面样式已在main.css中定义 */

/* 粒子背景 */
.drive-page {
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

/* 文件项样式 */
.file-item {
  transition: all 0.2s ease;
}

.file-item:hover {
  background: rgba(236, 72, 153, 0.1);
  transform: translateX(4px);
}

/* 文件操作按钮 */
.file-action-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s ease;
  font-size: 14px;
}

.file-action-btn:hover {
  background: rgba(236, 72, 153, 0.1);
  transform: scale(1.1);
}

.file-action-btn.delete:hover {
  background: rgba(239, 68, 68, 0.1);
}

/* 加载骨架屏 */
.loading-state {
  padding: 10px 0;
}

.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* 按钮禁用状态 */
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
