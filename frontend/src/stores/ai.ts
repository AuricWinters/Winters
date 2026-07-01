import { defineStore } from 'pinia';
import { ref } from 'vue';

interface Message {
  role: string;
  content: string;
}

interface AISettings {
  provider: string;
  ollamaBaseUrl: string;
  openaiBaseUrl: string;
  openaiApiKey: string;
  model: string;
  [key: string]: any;
}

interface AIResponse {
  success: boolean;
  response?: string;
  error?: string;
}

export const useAIStore = defineStore('ai', () => {
  // AI 设置
  const settings = ref<AISettings>(
    JSON.parse(
      localStorage.getItem('winters_ai_settings') ||
        JSON.stringify({
          provider: 'ollama',
          ollamaBaseUrl: 'http://localhost:11434',
          openaiBaseUrl: 'https://api.openai.com/v1',
          openaiApiKey: '',
          model: 'llama2',
        })
    )
  );

  // 连接状态
  const isConnected = ref<boolean>(false);

  // 聊天历史
  const messages = ref<Message[]>(
    JSON.parse(localStorage.getItem('winters_chat_history') || '[]')
  );

  const isLoading = ref<boolean>(false);

  // 保存设置
  function saveSettings(newSettings: Partial<AISettings>): void {
    settings.value = { ...settings.value, ...newSettings };
    localStorage.setItem('winters_ai_settings', JSON.stringify(settings.value));
    checkConnection();
  }

  // 检查连接
  function checkConnection(): void {
    const saved = localStorage.getItem('winters_ai_settings');
    isConnected.value = !!saved;
  }

  // 保存聊天历史
  function saveChatHistory(): void {
    const history = messages.value.slice(-50);
    localStorage.setItem('winters_chat_history', JSON.stringify(history));
  }

  // 添加消息
  function addMessage(role: string, content: string): void {
    messages.value.push({ role, content });
    saveChatHistory();
  }

  // 清空聊天
  function clearChat(): void {
    messages.value = [];
    localStorage.removeItem('winters_chat_history');
  }

  // 发送消息到后端（使用 proxy 接口连接真实 AI）
  async function sendMessage(userMessage: string): Promise<AIResponse> {
    addMessage('user', userMessage);
    isLoading.value = true;

    try {
      // 构建 messages 数组，包含历史对话
      const chatMessages = messages.value.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await fetch('/api/ai/chat/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: settings.value.provider,
          api_base:
            settings.value.provider === 'ollama'
              ? settings.value.ollamaBaseUrl
              : settings.value.openaiBaseUrl,
          api_key: settings.value.openaiApiKey,
          model: settings.value.model,
          messages: chatMessages,
        }),
      });

      const data = await response.json();

      if (data.success && data.response) {
        addMessage('assistant', data.response);
        return { success: true, response: data.response };
      }

      // 处理错误
      let errorMessage: string = data.error || '未知错误';
      if (errorMessage.includes('ConnectError') || errorMessage.includes('无法连接')) {
        errorMessage = '无法连接到 AI 服务，请检查服务是否启动';
      } else if (errorMessage.includes('Timeout') || errorMessage.includes('超时')) {
        errorMessage = '请求超时，请稍后重试';
      }

      return { success: false, error: errorMessage };
    } catch (error: any) {
      let errorMessage: string = error.message;
      if (errorMessage.includes('fetch') || errorMessage.includes('Network')) {
        errorMessage = '无法连接到 AI 服务，请检查网络或后端服务';
      }
      return { success: false, error: errorMessage };
    } finally {
      isLoading.value = false;
    }
  }

  // 初始化
  checkConnection();

  return {
    settings,
    isConnected,
    messages,
    isLoading,
    saveSettings,
    checkConnection,
    saveChatHistory,
    addMessage,
    clearChat,
    sendMessage,
  };
});
