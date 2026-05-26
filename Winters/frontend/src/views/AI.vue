<template>
  <div class="ai-page">
    <!-- 粒子背景 -->
    <canvas class="particles-background" />

    <div
      class="hero-section"
      style="grid-template-columns: 1fr"
    >
      <div class="content-container">
        <div
          class="section-card chat-container scroll-reveal"
          style="padding: 0"
        >
          <div class="chat-header">
            <div class="chat-status-area">
              <span
                class="chat-status"
                :class="{ connected: isConnected }"
              />
              <span>{{ isConnected ? '已连接' : '未连接' }}</span>
            </div>
            <button
              class="settings-btn"
              title="AI设置"
              @click="showSettings = true"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="3"
                />
                <path
                  d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
                />
              </svg>
            </button>
          </div>

          <div
            ref="chatMessages"
            class="chat-messages"
            role="log"
            aria-live="polite"
            aria-label="聊天消息"
          >
            <div
              v-if="uiMessages.length === 0"
              class="chat-welcome"
            >
              <h3>👋 欢迎使用 AI 聊天</h3>
              <p>请先在设置中配置 AI 提供商，然后开始聊天</p>
            </div>
            <div
              v-for="(msg, index) in uiMessages"
              :key="index"
              class="chat-message"
              :class="msg.type"
            >
              <span
                v-if="msg.type === 'loading'"
                class="loading-dots"
              >
                <span /><span /><span />
              </span>
              <span v-else>{{ msg.content }}</span>
            </div>
          </div>

          <div class="chat-input-area">
            <input
              ref="chatInput"
              v-model="inputMessage"
              type="text"
              class="chat-input"
              placeholder="输入消息..."
              aria-label="消息输入框"
              :disabled="!isConnected || isLoading"
              @keyup.enter="sendMessage"
            >
            <button
              class="chat-send-btn"
              aria-label="发送消息"
              :disabled="!isConnected || isLoading || !inputMessage.trim()"
              @click="sendMessage"
            >
              {{ isLoading ? '发送中...' : '发送' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 设置弹窗 -->
    <div
      v-if="showSettings"
      class="settings-overlay"
      @click.self="showSettings = false"
    >
      <div class="settings-modal">
        <div class="settings-header">
          <h3>⚙️ AI 设置</h3>
          <button
            class="close-btn"
            @click="showSettings = false"
          >
            &times;
          </button>
        </div>

        <div class="settings-content">
          <!-- 提供商选择 -->
          <div class="setting-group">
            <label>AI 提供商</label>
            <div class="provider-tabs">
              <button
                :class="{ active: settings.provider === 'ollama' }"
                @click="settings.provider = 'ollama'"
              >
                🦙 Ollama (本地)
              </button>
              <button
                :class="{ active: settings.provider === 'openai' }"
                @click="settings.provider = 'openai'"
              >
                🤖 OpenAI API
              </button>
            </div>
          </div>

          <!-- Ollama 配置 -->
          <div
            v-if="settings.provider === 'ollama'"
            class="setting-group"
          >
            <label>服务器地址</label>
            <input
              v-model="settings.ollamaBaseUrl"
              type="text"
              placeholder="http://localhost:11434"
            >
            <small>本地 Ollama 服务地址</small>
          </div>

          <!-- OpenAI 配置 -->
          <div
            v-if="settings.provider === 'openai'"
            class="setting-group"
          >
            <label>API 地址</label>
            <input
              v-model="settings.openaiBaseUrl"
              type="text"
              placeholder="https://api.openai.com/v1"
            >
            <small>OpenAI 兼容 API 地址</small>
          </div>

          <div
            v-if="settings.provider === 'openai'"
            class="setting-group"
          >
            <label>API Key</label>
            <input
              v-model="settings.openaiApiKey"
              type="password"
              placeholder="sk-..."
            >
            <small>你的 API 密钥</small>
          </div>

          <!-- 模型选择 -->
          <div class="setting-group">
            <label>模型</label>
            <div class="model-input">
              <input
                v-model="settings.model"
                type="text"
                :placeholder="settings.provider === 'ollama' ? 'llama2' : 'gpt-3.5-turbo'"
              >
              <button
                :disabled="isLoadingModels"
                @click="loadModels"
              >
                {{ isLoadingModels ? '加载中...' : '🔄' }}
              </button>
            </div>
            <small v-if="availableModels.length > 0">
              可用模型: {{ availableModels.join(', ') }}
            </small>
          </div>

          <!-- 测试连接 -->
          <div class="setting-group">
            <button
              class="test-btn"
              :disabled="isTesting"
              @click="testConnection"
            >
              {{ isTesting ? '测试中...' : '🧪 测试连接' }}
            </button>
            <div
              v-if="testResult"
              :class="['test-result', { success: testResult.success, error: !testResult.success }]"
            >
              {{ testResult.message }}
            </div>
          </div>
        </div>

        <div class="settings-footer">
          <button
            class="cancel-btn"
            @click="showSettings = false"
          >
            取消
          </button>
          <button
            class="save-btn"
            @click="saveSettings"
          >
            💾 保存设置
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { useAIStore } from '../stores/ai.js';
import { useParticles } from '../composables/useParticles.js';
import { useScrollReveal } from '../composables/useScrollReveal.js';
import { storeToRefs } from 'pinia';

const aiStore = useAIStore();
useParticles();
useScrollReveal();

// 使用 storeToRefs 正确解构 store 的响应式属性
const { settings, isConnected, isLoading, messages } = storeToRefs(aiStore);

const chatMessages = ref(null);
const chatInput = ref(null);
const showSettings = ref(false);
const isTesting = ref(false);
const isLoadingModels = ref(false);
const testResult = ref(null);
const availableModels = ref([]);
const inputMessage = ref('');

// UI 消息列表 - 用于 Vue 响应式渲染
const uiMessages = ref([]);

// 保存设置
const saveSettings = () => {
  aiStore.saveSettings(settings.value);
  showSettings.value = false;
  uiMessages.value.push({ type: 'system', content: '设置已保存' });
  scrollToBottom();
};

// 加载可用模型
const loadModels = async () => {
  isLoadingModels.value = true;
  try {
    const baseUrl =
      settings.value.provider === 'ollama'
        ? settings.value.ollamaBaseUrl
        : settings.value.openaiBaseUrl;

    const response = await fetch(
      `/api/ai/models?provider=${settings.value.provider}&base_url=${baseUrl}`
    );
    const data = await response.json();

    if (data.success) {
      availableModels.value = data.models;
      if (data.models.length > 0 && !settings.value.model) {
        settings.value.model = data.models[0];
      }
    }
  } catch (e) {
    console.error('加载模型列表失败:', e);
    uiMessages.value.push({ type: 'error', content: '无法获取模型列表' });
    scrollToBottom();
  }
  isLoadingModels.value = false;
};

// 测试连接
const testConnection = async () => {
  isTesting.value = true;
  testResult.value = null;

  try {
    const response = await fetch('/api/ai/test');

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.status === 'ok') {
      testResult.value = {
        success: true,
        message: `✅ AI 服务正常运行`,
      };
      aiStore.checkConnection();
    } else {
      testResult.value = { success: false, message: `❌ 服务异常` };
    }
  } catch (e) {
    console.error('测试连接失败:', e);
    testResult.value = {
      success: false,
      message: `❌ 连接失败: ${e.message}`,
    };
  }

  isTesting.value = false;
};

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    if (chatMessages.value) {
      chatMessages.value.scrollTop = chatMessages.value.scrollHeight;
    }
  });
};

// 发送消息
const sendMessage = async () => {
  if (!inputMessage.value.trim() || isLoading.value || !isConnected.value) return;

  const userMessage = inputMessage.value.trim();
  inputMessage.value = '';

  // 添加用户消息到 UI
  uiMessages.value.push({ type: 'user', content: userMessage });
  scrollToBottom();

  // 显示加载状态
  isLoading.value = true;
  uiMessages.value.push({ type: 'loading', content: '' });
  scrollToBottom();

  // 通过 store 发送
  const result = await aiStore.sendMessage(userMessage);

  // 移除加载状态
  const loadingIndex = uiMessages.value.findIndex((m) => m.type === 'loading');
  if (loadingIndex > -1) {
    uiMessages.value.splice(loadingIndex, 1);
  }

  if (result.success) {
    uiMessages.value.push({ type: 'ai', content: result.response });
  } else {
    uiMessages.value.push({ type: 'error', content: `错误: ${result.error}` });
  }
  scrollToBottom();
};

// 加载聊天历史到 UI
const loadChatHistory = () => {
  if (messages.value.length === 0) {
    uiMessages.value.push({
      type: 'system',
      content: '👋 欢迎！请先点击右上角 ⚙️ 设置 AI 提供商',
    });
  } else {
    messages.value.forEach((msg) => {
      uiMessages.value.push({
        type: msg.role === 'user' ? 'user' : 'ai',
        content: msg.content,
      });
    });
  }
  scrollToBottom();
};

onMounted(() => {
  aiStore.checkConnection();
  loadChatHistory();
});
</script>

<style scoped>
/* AI页面样式已在main.css中定义 */

/* 粒子背景 */
.ai-page {
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

/* 聊天状态区域 */
.chat-status-area {
  display: flex;
  align-items: center;
  gap: 8px;
}

.chat-status {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ef4444;
}

.chat-status.connected {
  background: #22c55e;
}

/* 设置按钮 */
.settings-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  color: #EC4899;
  transition: all 0.3s ease;
}

.settings-btn:hover {
  background: rgba(236, 72, 153, 0.2);
}

/* 设置弹窗 */
.settings-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.settings-modal {
  background: #1e1e2e;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.settings-header h3 {
  margin: 0;
  font-size: 18px;
  color: #fff;
}

.close-btn {
  background: none;
  border: none;
  color: #EC4899;
  font-size: 32px;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.settings-content {
  padding: 24px;
  overflow-y: auto;
  max-height: 60vh;
}

.setting-group {
  margin-bottom: 20px;
}

.setting-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #a1a1aa;
  font-weight: 500;
}

.setting-group input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  font-size: 14px;
  box-sizing: border-box;
}

.setting-group input:focus {
  outline: none;
  border-color: #EC4899;
}

.setting-group small {
  display: block;
  margin-top: 6px;
  font-size: 12px;
  color: #71717a;
}

/* 提供商标签 */
.provider-tabs {
  display: flex;
  gap: 8px;
}

.provider-tabs button {
  flex: 1;
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: #a1a1aa;
  cursor: pointer;
  transition: all 0.3s ease;
}

.provider-tabs button.active {
  background: rgba(236, 72, 153, 0.2);
  border-color: #EC4899;
  color: #fff;
}

.provider-tabs button:hover:not(.active) {
  background: rgba(255, 255, 255, 0.1);
}

/* 模型输入 */
.model-input {
  display: flex;
  gap: 8px;
}

.model-input input {
  flex: 1;
}

.model-input button {
  padding: 12px 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: #EC4899;
  cursor: pointer;
}

.model-input button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 测试按钮 */
.test-btn {
  width: 100%;
  padding: 12px;
  border: 1px solid #EC4899;
  border-radius: 8px;
  background: rgba(236, 72, 153, 0.2);
  color: #EC4899;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.test-btn:hover:not(:disabled) {
  background: rgba(236, 72, 153, 0.3);
}

.test-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.test-result {
  margin-top: 12px;
  padding: 12px;
  border-radius: 8px;
  font-size: 13px;
}

.test-result.success {
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  color: #22c55e;
}

.test-result.error {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
}

/* 页脚按钮 */
.settings-footer {
  display: flex;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.cancel-btn,
.save-btn {
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #a1a1aa;
}

.cancel-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.save-btn {
  background: #EC4899;
  border: none;
  color: #fff;
}

.save-btn:hover {
  background: #7c3aed;
}

/* 欢迎消息 */
.chat-welcome {
  text-align: center;
  padding: 40px;
  color: #a1a1aa;
}

.chat-welcome h3 {
  margin: 0 0 12px;
  color: #fff;
  font-size: 20px;
}

.chat-welcome p {
  margin: 0;
  font-size: 14px;
}

/* 加载动画 */
.loading-dots {
  display: inline-flex;
  gap: 4px;
}

.loading-dots span {
  width: 6px;
  height: 6px;
  background: #EC4899;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out both;
}

.loading-dots span:nth-child(1) {
  animation-delay: -0.32s;
}
.loading-dots span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%,
  80%,
  100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}
</style>
