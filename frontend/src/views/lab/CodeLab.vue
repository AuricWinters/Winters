<template>
  <div class="code-lab-page">
    <div class="code-lab-container">
      <!-- 侧边栏语言选择 -->
      <aside
        class="sidebar"
        :class="{ 'sidebar-collapsed': isSidebarCollapsed }"
      >
        <div class="sidebar-header">
          <h3>{{ t('编程语言') }}</h3>
          <button
            class="toggle-btn"
            @click="toggleSidebar"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <path
                d="M15 18l-6-6 6-6"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
        <nav class="language-nav">
          <div
            class="radio-container"
            :style="{ '--total-radio': languages.length }"
          >
            <template
              v-for="lang in languages"
              :key="lang.id"
            >
              <input 
                :id="`lang-${lang.id}`" 
                type="radio" 
                name="language" 
                :checked="selectedLang === lang.id"
                @change="selectLanguage(lang.id)"
              >
              <label
                :for="`lang-${lang.id}`"
                class="language-item"
              >
                <span class="lang-icon">{{ lang.icon }}</span>
                <span class="lang-name">{{ t(lang.name) }}</span>
              </label>
            </template>
            <div class="glider-container">
              <div class="glider" />
            </div>
          </div>
        </nav>
      </aside>

      <!-- 主内容区域 -->
      <main class="main-content">
        <!-- 返回按钮 -->
        <button
          class="back-btn"
          @click="$router.push('/lab')"
        >
          ← {{ t('返回实验室') }}
        </button>

        <!-- 头部 -->
        <header class="code-lab-header">
          <h1 v-if="currentLanguage">
            {{ t(currentLanguage.name) }} {{ t(currentLanguage.version) }}
          </h1>
          <p
            v-if="currentLanguage"
            class="lang-desc"
          >
            {{ t(currentLanguage.description) }}
          </p>
        </header>

        <!-- 学习任务 -->
        <section
          v-if="currentLanguage"
          class="tasks-section"
        >
          <h2>{{ t('学习任务') }}</h2>
          <div class="tasks-grid">
            <div
              v-for="task in currentLanguage.tutorials"
              :key="task.id"
              class="task-card"
              @click="showTutorial(task)"
            >
              <div class="task-icon">
                {{ task.icon }}
              </div>
              <h3>{{ t(task.title) }}</h3>
              <p>{{ t(task.description) }}</p>
              <span
                class="difficulty"
                :class="task.difficulty"
              >
                {{ getDifficultyText(task.difficulty) }}
              </span>
            </div>
          </div>
        </section>
      </main>
    </div>

    <!-- 教程弹窗 -->
    <Transition name="modal-transition">
      <div
        v-if="showModal"
        class="tutorial-modal"
        @click.self="closeModal"
      >
        <div class="modal-content">
          <button
            class="close-btn"
            @click="closeModal"
          >
            ×
          </button>
          <!-- 左右分栏容器 -->
          <div class="split-container">
            <!-- 左侧：教程内容区 (55%) -->
            <div class="tutorial-panel">
              <Transition
                :name="'slide-' + transitionDirection"
                mode="out-in"
              >
                <article
                  :key="currentTutorial.id"
                  class="md-document"
                >
                  <!-- 文档标题区 -->
                  <header class="doc-header">
                    <h1 class="doc-title">
                      {{ t(currentTutorial.title) }}
                    </h1>
                    <p class="doc-meta">
                      <span
                        class="difficulty-badge"
                        :class="currentTutorial.difficulty"
                      >{{ getDifficultyText(currentTutorial.difficulty) }}</span>
                      {{ t(currentTutorial.description) }}
                    </p>
                  </header>

                  <!-- 正文内容：像MD文档一样的自然流 -->
                  <div
                    v-for="(example, index) in currentTutorial.examples"
                    :key="index"
                    class="doc-content"
                  >
                    <!-- 章节标题 (对应 ### ) -->
                    <h3 class="section-title">
                      {{ t(example.title) }}
                    </h3>

                    <!-- 代码块 (对应 ``` ) -->
                    <figure class="code-figure">
                      <!-- 顶部工具栏：语言标签 + 复制按钮 -->
                      <div class="code-header">
                        <span class="code-language">{{ detectLanguage(example) }}</span>
                        <button
                          class="copy-btn"
                          :title="t('复制代码')"
                          @click="copyCode(example.code)"
                        >
                          <svg
                            v-if="copiedCode !== example.code"
                            viewBox="0 0 24 24"
                            width="14"
                            height="14"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                          >
                            <rect
                              x="9"
                              y="9"
                              width="13"
                              height="13"
                              rx="2"
                              ry="2"
                            />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                          </svg>
                          <svg
                            v-else
                            viewBox="0 0 24 24"
                            width="14"
                            height="14"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </button>
                      </div>

                      <!-- 代码内容：带行号 + 语法高亮 -->
                      <pre class="code-block"><code
class="hljs"
                                                    v-html="getLineNumberedCode(highlightCode(example.code, detectLanguage(example)))"
                      /></pre>
                    </figure>

                    <!-- 说明文字 (对应普通段落或 > 引用块) -->
                    <div
                      class="explanation"
                      v-html="formatExplanation(example.explanation)"
                    />
                  </div>
                </article>
              </Transition>

              <!-- 底部导航按钮 -->
              <div class="tutorial-nav">
                <div class="tutorial-nav-left">
                  <button
                    v-if="hasPrevTutorial && !isAnimating"
                    class="nav-btn"
                    @click="prevTutorial"
                  >
                    ← {{ t(getPrevTutorialTitle()) }}
                  </button>
                </div>
                <div class="tutorial-nav-right">
                  <button
                    v-if="hasNextTutorial && !isAnimating"
                    class="nav-btn"
                    @click="nextTutorial"
                  >
                    {{ t(getNextTutorialTitle()) }} →
                  </button>
                </div>
              </div>
            </div>

            <!-- 分隔线 -->
            <div class="split-divider" />

            <!-- 右侧：代码编辑器区 (45%) -->
            <div class="editor-panel">
              <!-- 编辑器工具栏 -->
              <div class="editor-toolbar">
                <div class="toolbar-left">
                  <span class="editor-language">{{ detectLanguage(currentTutorial.examples[0]) }}</span>
                </div>
                <div class="toolbar-right">
                  <button
                    class="tool-btn run-btn"
                    :disabled="isRunning"
                    @click="runCode"
                  >
                    <span v-if="!isRunning">{{ t('▶ 运行') }}</span>
                    <span v-else-if="executionMode === 'backend'">{{ t('⏳ 连接后端...') }}</span>
                    <span v-else>{{ t('⏳ 运行中...') }}</span>
                  </button>
                  <button
                    class="tool-btn"
                    :title="t('重置为示例代码')"
                    @click="resetEditor"
                  >
                    ↺ {{ t('重置') }}
                  </button>
                  <button
                    class="tool-btn"
                    :title="t('清空编辑器')"
                    @click="clearEditor"
                  >
                    🗑 {{ t('清空') }}
                  </button>
                </div>
              </div>

              <!-- Monaco Editor 编辑器区域 -->
              <div class="editor-wrapper">
                <MonacoEditor
                  v-model:value="editorCode"
                  :language="monacoLanguage"
                  :options="editorOptions"
                  theme="vs-light"
                  :height="'100%'"
                  @mount="handleEditorMount"
                />
              </div>

              <!-- 交互式终端区域 -->
              <div
                ref="terminalContainer"
                class="terminal-container"
              >
                <div class="terminal-header">
                  <span class="terminal-title">🖥️ {{ t('终端') }}</span>
                  <span
                    class="terminal-status"
                    :class="terminalStatusClass"
                  >
                    {{ terminalStatusText }}
                  </span>
                </div>
                <div
                  ref="terminalElement"
                  class="terminal-body"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from '../../composables/useI18n.ts';
const { t } = useI18n();
import { languages as languagesData } from './tutorials/index.ts';
import hljs from 'highlight.js/lib/core'
import c from 'highlight.js/lib/languages/c'
import cpp from 'highlight.js/lib/languages/cpp'
import java from 'highlight.js/lib/languages/java'
import javascript from 'highlight.js/lib/languages/javascript'
import python from 'highlight.js/lib/languages/python'
import php from 'highlight.js/lib/languages/php'
import typescript from 'highlight.js/lib/languages/typescript'
import 'highlight.js/styles/github.css'  // GitHub 浅色主题
import MonacoEditor from '@guolao/vue-monaco-editor'
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { API_BASE, WS_BASE } from '../../config.ts';

// 注册语言
hljs.registerLanguage('c', c)
hljs.registerLanguage('cpp', cpp)
hljs.registerLanguage('java', java)
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('python', python)
hljs.registerLanguage('php', php)
hljs.registerLanguage('typescript', typescript)

const router = useRouter();
const selectedLang = ref('c');
const showModal = ref(false);
const currentTutorial = ref(null);
const copiedCode = ref(null);
const isSidebarCollapsed = ref(false);
const isAnimating = ref(false);
const transitionDirection = ref('right');

// ========== Monaco Editor 相关状态 ==========
const editorCode = ref('');
const monacoLanguage = ref('javascript');
const isRunning = ref(false);
const output = ref('');
const error = ref('');
const executionMode = ref(''); // 执行方式标识：'frontend' 或 'backend'
const stdinInput = ref(''); // 标准输入内容

// ========== xterm.js 终端相关状态 ==========
const terminalContainer = ref(null);
const terminalElement = ref(null);
let terminal = null;
let fitAddon = null;
let wsConnection = null;
const terminalStatus = ref('idle'); // idle | running | disconnected

// Monaco Editor 配置
const editorOptions = {
  fontSize: 14,
  lineNumbers: 'on',
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  automaticLayout: true,
  tabSize: 4,
  wordWrap: 'on',
  padding: { top: 16, bottom: 16 },
  readOnly: false
};

// 编辑器挂载回调
const handleEditorMount = (editor) => {
  // 可以在这里添加额外的编辑器配置
}

// ========== xterm.js 终端初始化与交互 ==========
const initTerminal = () => {
  terminal = new Terminal({
    cursorBlink: true,
    fontSize: 13,
    fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace",
    theme: {
      background: '#1e1e1e',
      foreground: '#d4d4d4',
      cursor: '#ffffff',
      selectionBackground: '#264f78',
      black: '#000000',
      red: '#cd3131',
      green: '#0dbc79',
      yellow: '#e5e510',
      blue: '#2472c8',
      magenta: '#bc3fbc',
      cyan: '#30aeb6',
      white: '#e5e5e5',
      brightBlack: '#666666',
      brightRed: '#f14c4c',
      brightGreen: '#23d18b',
      brightYellow: '#f5f543',
      brightBlue: '#3b8eea',
      brightMagenta: '#d670d6',
      brightCyan: '#29b8db',
      brightWhite: '#e5e5e5',
    },
    scrollback: 1000,
    convertEol: true,
  });

  fitAddon = new FitAddon();
  terminal.loadAddon(fitAddon);
  terminal.open(terminalElement.value);
  fitAddon.fit();

  // 欢迎信息
  terminal.writeln('\x1b[1;36m╔═════════════════════════════════════╗\x1b[0m');
  terminal.writeln('\x1b[1;36m║     Winters 交互式终端 v1.0          ║\x1b[0m');
  terminal.writeln('\x1b[1;36m╚═════════════════════════════════════╝\x1b[0m');
  terminal.writeln('');
  terminal.writeln('\x1b[90m点击 "▶ 运行" 按钮开始执行代码...\x1b[0m');
  terminal.writeln('');

  // 终端输入事件：将用户输入发送到 WebSocket
  terminal.onData((data) => {
    if (wsConnection && wsConnection.readyState === WebSocket.OPEN) {
      wsConnection.send(JSON.stringify({ action: 'input', data }));
    }
  });
};

// 窗口 resize 时适配终端大小
const handleResize = () => {
  if (fitAddon && terminalContainer.value) {
    fitAddon.fit();
  }
};

const languages = ref(languagesData);

const currentLanguage = computed(() => {
  return languages.value.find(l => l.id === selectedLang.value) || languages.value[0];
});

const currentTutorialIndex = computed(() => {
  if (!currentTutorial.value) return -1;
  return currentLanguage.value.tutorials.findIndex(t => t.id === currentTutorial.value.id);
});

const hasPrevTutorial = computed(() => {
  return currentTutorialIndex.value > 0;
});

const hasNextTutorial = computed(() => {
  return currentTutorialIndex.value < currentLanguage.value.tutorials.length - 1;
});

const selectLanguage = (langId) => {
  selectedLang.value = langId;
};

const showTutorial = (tutorial) => {
  currentTutorial.value = tutorial;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  currentTutorial.value = null;
};

const getDifficultyText = (difficulty) => {
  const map = {
    'beginner': t('入门'),
    'intermediate': t('进阶'),
    'advanced': t('高级')
  };
  return map[difficulty] || difficulty;
};

const getPrevTutorialTitle = () => {
  if (!hasPrevTutorial.value) return '';
  return currentLanguage.value.tutorials[currentTutorialIndex.value - 1].title;
};

const getNextTutorialTitle = () => {
  if (!hasNextTutorial.value) return '';
  return currentLanguage.value.tutorials[currentTutorialIndex.value + 1].title;
};

const prevTutorial = () => {
  if (hasPrevTutorial.value && !isAnimating.value) {
    isAnimating.value = true;
    transitionDirection.value = 'left';
    setTimeout(() => {
      currentTutorial.value = currentLanguage.value.tutorials[currentTutorialIndex.value - 1];
      setTimeout(() => {
        isAnimating.value = false;
      }, 250);
    }, 50);
  }
};

const nextTutorial = () => {
  if (hasNextTutorial.value && !isAnimating.value) {
    isAnimating.value = true;
    transitionDirection.value = 'right';
    setTimeout(() => {
      currentTutorial.value = currentLanguage.value.tutorials[currentTutorialIndex.value + 1];
      setTimeout(() => {
        isAnimating.value = false;
      }, 250);
    }, 50);
  }
};

const copyCode = (code) => {
  navigator.clipboard.writeText(code);
  copiedCode.value = code;
  setTimeout(() => {
    copiedCode.value = null;
  }, 2000);
};

const highlightCode = (code, language) => {
  try {
    return hljs.highlight(code, { language }).value
  } catch {
    return code // 如果高亮失败，返回原始代码
  }
}

const getLineNumberedCode = (code) => {
  return code.split('\n').map((line, index) =>
    `<div class="code-line"><span class="line-number">${index + 1}</span><span class="line-content">${line || ' '}</span></div>`
  ).join('')
}

const detectLanguage = (example) => {
  // 从当前教程的语言ID推断代码语言
  const langMap = {
    'c': 'c',
    'java': 'java',
    'javascript': 'javascript',
    'python': 'python',
    'php': 'php',
    'typescript': 'typescript',
    'arkts': 'typescript'  // ArkTS使用TypeScript高亮
  }
  return langMap[currentLanguage.value?.id] || 'plaintext'
}

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
};

const formatExplanation = (text) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.*?)`/g, '<code class="inline-code">$1</code>')
    .replace(/\n/g, '<br>')
};

// ========== 监听教程变化，更新编辑器 ==========
watch(currentTutorial, (newTutorial) => {
  if (newTutorial && newTutorial.examples && newTutorial.examples.length > 0) {
    // 设置编辑器语言
    const langMap = {
      'c': 'c',
      'java': 'java',
      'javascript': 'javascript',
      'python': 'python',
      'php': 'php',
      'typescript': 'typescript',
      'arkts': 'typescript'
    };
    monacoLanguage.value = langMap[newTutorial.id] || 'plaintext';

    // 预填充第一个示例的代码
    editorCode.value = newTutorial.examples[0].code;

    // 清空之前的输出
    output.value = '';
    error.value = '';
  }
}, { immediate: true });

// ========== 编辑器操作方法 ==========

/**
 * 运行代码功能 - 支持多语言执行
 * JavaScript/TypeScript：前端直接执行
 * 其他语言（Python/Java/C等）：通过 WebSocket 交互式执行
 */
const runCode = async () => {
  const lang = currentLanguage.value?.id;

  // JavaScript: 前端直接执行（保持不变）
  if (lang === 'javascript') {
    executionMode.value = 'frontend';
    isRunning.value = true;
    output.value = '';
    error.value = '';

    const logs = [];
    const originalLog = console.log;
    console.log = (...args) => logs.push(args.join(' '));

    try {
      // 使用 Function 构造函数执行代码
      const fn = new Function(editorCode.value);
      const result = fn();
      if (result !== undefined) logs.push(String(result));
      output.value = logs.join('\n') || t('无输出');
    } catch (e) {
      error.value = e.message;
    } finally {
      console.log = originalLog;
      isRunning.value = false;
    }
    return;
  }

  // 其他语言: WebSocket 交互式模式
  executionMode.value = 'backend';
  isRunning.value = true;
  terminalStatus.value = 'running';
  output.value = '';
  error.value = '';

  // 清空终端并显示启动信息
  terminal.clear();
  terminal.writeln(`\x1b[1;33m${t('>>> 执行 ') + lang.toUpperCase() + t(' 代码...')}\x1b[0m`);
  terminal.writeln('');

  try {
    // 建立 WebSocket 连接
    const wsUrl = `${WS_BASE}/ws/code/execute`;
    wsConnection = new WebSocket(wsUrl);

    wsConnection.onopen = () => {
      // 发送执行指令
      wsConnection.send(JSON.stringify({
        action: 'execute',
        code: editorCode.value,
        language: lang,
        timeout: 15
      }));
    };

    wsConnection.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      if (msg.type === 'output') {
        terminal.write(msg.data);
      } else if (msg.type === 'error') {
        terminal.write('\x1b[31m' + msg.data + '\x1b[0m');
      } else if (msg.type === 'exit') {
        terminal.write('\x1b[90m' + (msg.data || '') + '\x1b[0m');
        terminalStatus.value = 'idle';
        isRunning.value = false;
        wsConnection.close();
      }
    };

    wsConnection.onerror = () => {
      terminal.write('\x1b[31m[' + t('错误') + '] ' + t('无法连接到后端服务') + '\x1b[0m\r\n');
            terminal.write(`\x1b[90m${t('请确保后端已启动')} (${API_BASE || window.location.origin})\x1b[0m\r\n`);
      terminalStatus.value = 'disconnected';
      isRunning.value = false;
    };

    wsConnection.onclose = () => {
      if (isRunning.value) {
        terminalStatus.value = 'idle';
        isRunning.value = false;
      }
      wsConnection = null;
    };

  } catch (err) {
    terminal.write('\x1b[31m[' + t('错误') + '] ' + err.message + '\x1b[0m\r\n');
    terminalStatus.value = 'disconnected';
    isRunning.value = false;
  }
};

// 清空编辑器
const clearEditor = () => {
  editorCode.value = '';
  output.value = '';
  error.value = '';
};

// 重置为示例代码
const resetEditor = () => {
  if (currentTutorial.value && currentTutorial.value.examples && currentTutorial.value.examples.length > 0) {
    editorCode.value = currentTutorial.value.examples[0].code;
    output.value = '';
    error.value = '';
  }
};

// ========== 终端状态计算属性 ==========
const terminalStatusClass = computed(() => ({
  'status-idle': terminalStatus.value === 'idle',
  'status-running': terminalStatus.value === 'running',
  'status-disconnected': terminalStatus.value === 'disconnected',
}));

const terminalStatusText = computed(() => ({
  'idle': t('● 就绪'),
  'running': t('● 运行中...'),
  'disconnected': t('✕ 断开')
})[terminalStatus.value] || '');

// ========== 生命周期钩子 ==========
onMounted(() => {
  // 监听窗口变化，适配终端大小
  window.addEventListener('resize', handleResize);
});

// 弹窗打开时初始化终端（确保 DOM 已渲染）
watch(showModal, (newVal) => {
  if (newVal) {
    nextTick(() => {
      if (!terminal && terminalElement.value) {
        initTerminal();
      } else if (terminal && fitAddon) {
        fitAddon.fit();
      }
    });
  }
});

onUnmounted(() => {
  // 清理资源
  window.removeEventListener('resize', handleResize);
  if (wsConnection) {
    wsConnection.close();
  }
  if (terminal) {
    terminal.dispose();
  }
});
</script>

<style scoped>
.code-lab-page {
  min-height: 100vh;
  color: var(--text-main);
}

.code-lab-container {
  display: flex;
  min-height: 100vh;
}

/* 侧边栏 */
.sidebar {
  width: 280px;
  background: var(--bg-glass);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  padding: 24px;
  transition: all 0.3s ease;
  position: fixed;
  height: fit-content;
  max-height: calc(100vh - 120px);
  top: 90px;
  z-index: 10;
  margin: 20px 0 20px 20px;
  box-shadow: var(--shadow-lg);
}

.sidebar.sidebar-collapsed {
  width: 72px;
  padding: 12px 10px 12px 0;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  transition: all 0.3s ease;
}

.sidebar.sidebar-collapsed .sidebar-header {
  justify-content: center;
  margin-bottom: 8px;
}

.sidebar-header h3 {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-main);
  transition: opacity 0.3s ease;
}

.sidebar.sidebar-collapsed .sidebar-header h3 {
  opacity: 0;
  width: 0;
  overflow: hidden;
}

.toggle-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--primary);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
  box-shadow: var(--shadow-purple);
}

.toggle-btn:hover {
  background: var(--primary-dark);
  transform: translateX(-3px);
  box-shadow: 0 6px 16px rgba(124, 58, 237, 0.4);
}

.toggle-btn svg {
  width: 14px;
  height: 14px;
  transition: transform 0.3s ease;
}

.language-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.radio-container {
  --main-color: var(--primary);
  --main-color-opacity: rgba(124, 58, 237, 0.15);
  display: flex;
  flex-direction: column;
  position: relative;
  padding-left: 0.5rem;
}

.radio-container input {
  cursor: pointer;
  appearance: none;
}

.radio-container .glider-container {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  background: linear-gradient(
    0deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(27, 27, 27, 1) 50%,
    rgba(0, 0, 0, 0) 100%
  );
  width: 1px;
}

.radio-container .glider-container .glider {
  position: relative;
  height: calc(100% / var(--total-radio));
  width: 100%;
  background: linear-gradient(
    0deg,
    rgba(0, 0, 0, 0) 0%,
    var(--main-color) 50%,
    rgba(0, 0, 0, 0) 100%
  );
  transition: transform 0.5s cubic-bezier(0.37, 1.95, 0.66, 0.56);
}

.radio-container .glider-container .glider::before {
  content: "";
  position: absolute;
  height: 60%;
  width: 300%;
  top: 50%;
  transform: translateY(-50%);
  background: var(--main-color);
  filter: blur(10px);
}

.radio-container .glider-container .glider::after {
  content: "";
  position: absolute;
  left: 0;
  height: 100%;
  width: 150px;
  background: linear-gradient(
    90deg,
    var(--main-color-opacity) 0%,
    rgba(0, 0, 0, 0) 100%
  );
}

.language-item {
  cursor: pointer;
  padding: 1rem;
  position: relative;
  color: var(--text-secondary);
  transition: all 0.3s ease-in-out;
  display: flex;
  align-items: center;
  border-radius: 8px;
  margin-bottom: 4px;
}

.sidebar.sidebar-collapsed .language-item {
  height: 36px;
  padding: 0;
  justify-content: center;
  margin-bottom: 0;
  border-radius: 0;
}

.sidebar.sidebar-collapsed .radio-container input:checked + .language-item {
  background: transparent;
}

.language-item:hover {
  color: var(--text-main);
  background: var(--bg-hover);
}

.radio-container input:checked + .language-item {
  color: var(--main-color);
  background: var(--bg-primary-light);
}

/* 动态生成的选择器，对应不同语言的位置 */
.radio-container input:nth-of-type(1):checked ~ .glider-container .glider {
  transform: translateY(0);
}

.radio-container input:nth-of-type(2):checked ~ .glider-container .glider {
  transform: translateY(100%);
}

.radio-container input:nth-of-type(3):checked ~ .glider-container .glider {
  transform: translateY(200%);
}

.radio-container input:nth-of-type(4):checked ~ .glider-container .glider {
  transform: translateY(300%);
}

.radio-container input:nth-of-type(5):checked ~ .glider-container .glider {
  transform: translateY(400%);
}

.radio-container input:nth-of-type(6):checked ~ .glider-container .glider {
  transform: translateY(500%);
}

.radio-container input:nth-of-type(7):checked ~ .glider-container .glider {
  transform: translateY(600%);
}

.lang-icon {
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: var(--text-secondary);
  background: #f1f5f9;
  border-radius: 10px;
  letter-spacing: -0.5px;
  transition: all 0.2s ease;
}

.radio-container input:checked + .language-item .lang-icon {
  color: white;
  background: var(--primary);
  box-shadow: 0 3px 10px rgba(124, 58, 237, 0.35);
}

.language-item:hover .lang-icon {
  background: #e8ecf1;
}

.sidebar.sidebar-collapsed .lang-icon {
  width: 36px;
  height: 36px;
  font-size: 14px;
  font-weight: 800;
  background: transparent;
  border-radius: 0;
  color: var(--text-tertiary);
  letter-spacing: -0.3px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar.sidebar-collapsed .radio-container input:checked + .language-item .lang-icon {
  color: var(--primary);
  font-weight: 900;
  background: transparent;
  box-shadow: none;
}

.sidebar.sidebar-collapsed .language-item:hover .lang-icon {
  color: var(--text-main);
  background: transparent;
}

.sidebar.sidebar-collapsed .radio-container .glider-container {
  display: block;
  left: 0;
}

.sidebar.sidebar-collapsed .radio-container .glider-container .glider {
  width: 3px;
  background: var(--primary);
}

.sidebar.sidebar-collapsed .radio-container .glider-container .glider::before,
.sidebar.sidebar-collapsed .radio-container .glider-container .glider::after {
  display: none;
}

.lang-name {
  font-size: 14px;
  font-weight: 500;
  margin-left: 12px;
  transition: opacity 0.3s ease;
}

.sidebar.sidebar-collapsed .lang-name {
  opacity: 0;
  width: 0;
  overflow: hidden;
}

/* 主内容 */
.main-content {
  flex: 1;
  margin-left: 300px;
  padding: 60px 40px;
  transition: margin-left 0.3s ease;
}

.sidebar.sidebar-collapsed + .main-content {
  margin-left: 92px;
}

.back-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  background: var(--bg-card);
  color: var(--text-main);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-sm);
  margin-bottom: 40px;
}

.back-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.code-lab-header {
  margin-bottom: 48px;
}

.code-lab-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 12px;
}

.lang-desc {
  font-size: 16px;
  color: var(--text-secondary);
  max-width: 800px;
  line-height: 1.6;
}

.tasks-section h2 {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-main);
  margin-bottom: 24px;
}

.tasks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.task-card {
  background: var(--bg-card);
  border: none;
  border-radius: 16px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-sm);
}

.task-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.task-icon {
  font-size: 32px;
  margin-bottom: 16px;
}

.task-card h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-main);
  margin-bottom: 8px;
}

.task-card p {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 16px;
  line-height: 1.5;
}

.difficulty {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.difficulty.beginner {
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
}

.difficulty.intermediate {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
}

.difficulty.advanced {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

/* 模态框 */
.tutorial-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  z-index: 1000;
  padding: 100px 20px 20px;
  overflow-y: auto;
  will-change: opacity;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.tutorial-modal::-webkit-scrollbar {
  display: none;
}

/* 弹窗过渡动画 */
.modal-transition-enter-active {
  transition: opacity 0.3s ease-out;
}

.modal-transition-leave-active {
  transition: opacity 0.2s ease-out;
}

.modal-transition-enter-from,
.modal-transition-leave-to {
  opacity: 0;
}

.modal-transition-enter-active .modal-content,
.modal-transition-leave-active .modal-content {
  transition: all 0.3s ease-out;
}

.modal-transition-leave-active .modal-content {
  transition-duration: 0.2s;
}

.modal-transition-enter-from .modal-content {
  transform: scale(0.95);
  opacity: 0;
}

.modal-transition-leave-to .modal-content {
  transform: scale(0.95);
  opacity: 0;
}

/* 教程滑动过渡动画 - 向右（下一个） */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.25s ease-out;
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* 教程滑动过渡动画 - 向左（上一个） */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.25s ease-out;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* ========== MD 文档流风格 - 教程内容区域 ========== */
.md-document {
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.8;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* 文档头部 */
.doc-header {
  padding-bottom: 24px;
  margin-bottom: 32px;
  border-bottom: 1px solid #e2e8f0;
}

.doc-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 12px;
  line-height: 1.3;
}

.doc-meta {
  font-size: 15px;
  color: #666;
  line-height: 1.6;
}

/* 难度标签 - inline badge */
.difficulty-badge {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  margin-right: 12px;
  vertical-align: middle;
}

.difficulty-badge.beginner {
  background: rgba(16, 185, 129, 0.12);
  color: #059669;
}

.difficulty-badge.intermediate {
  background: rgba(245, 158, 11, 0.12);
  color: #d97706;
}

.difficulty-badge.advanced {
  background: rgba(239, 68, 68, 0.12);
  color: #dc2626;
}

/* 章节标题 (H3) */
.section-title {
  font-size: 20px;
  font-weight: 600;
  margin-top: 36px;
  margin-bottom: 16px;
  color: #2d3748;
  border-left: 3px solid var(--primary);
  padding-left: 12px;
  line-height: 1.4;
}

.doc-content:first-child .section-title {
  margin-top: 0;
}

/* ========== 专业代码块样式（GitHub Light风格）========== */

.code-figure {
  position: relative;
  margin: 20px 0;
  border: 1px solid #d0d7de;
  border-radius: 6px;
  background: #f6f8fa;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

/* 代码块头部 */
.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: #f1f3f5;
  border-bottom: 1px solid #d0d7de;
  font-size: 12px;
}

.code-language {
  color: #57606a;
  font-weight: 600;
  text-transform: lowercase;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
}

/* 复制按钮 */
.copy-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: #57606a;
  cursor: pointer;
  transition: all 0.2s ease;
}

.copy-btn:hover {
  background: rgba(0, 0, 0, 0.08);
  color: #1f2328;
}

/* 代码块主体 */
.code-figure .code-block {
  margin: 0;
  padding: 16px 0;
  overflow-x: auto;
  background: #f6f8fa;
  scrollbar-width: thin;
  scrollbar-color: #d0d7de transparent;
}

.code-figure .code-block::-webkit-scrollbar {
  height: 8px;
}

.code-figure .code-block::-webkit-scrollbar-thumb {
  background-color: #d0d7de;
  border-radius: 4px;
}

/* 代码块主体 - 改为 block 布局 */
.code-figure .code-block {
  margin: 0;
  padding: 16px 0;
  overflow-x: auto;
  background: #f6f8fa;
}

.code-figure .code-block :deep(code) {
  display: block !important;
  font-family: "SF Mono", SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace;
  font-size: 13px;
  line-height: 1.6;
  color: #1f2328;
  tab-size: 4;
  padding: 0 16px;
}

/* 每一行代码 - 需要穿透 v-html */
.code-figure .code-block :deep(.code-line) {
  display: flex;
  align-items: center;
  min-height: 21px;
}

/* 行号样式 - 需要穿透 v-html */
.code-figure .code-block :deep(.line-number) {
  display: inline-block;
  width: 40px;
  text-align: right;
  padding-right: 16px;
  margin-right: 16px;
  color: #8c959f;
  user-select: none;
  flex-shrink: 0;
  opacity: 0.6;
}

/* 代码内容 - 需要穿透 v-html */
.code-figure .code-block :deep(.line-content) {
  display: inline-block;
  flex: 1;
  white-space: pre;
  min-width: 0;
}

/* highlight.js GitHub Light主题覆盖 - 需要穿透 v-html */
.code-figure .code-block :deep(.hljs) {
  background: transparent !important;
  color: #1f2328 !important;
}

.code-figure .code-block :deep(.hljs-comment),
.code-figure .code-block :deep(.hljs-quote) {
  color: #6a737d !important;
  font-style: italic;
}

.code-figure .code-block :deep(.hljs-keyword),
.code-figure .code-block :deep(.hljs-selector-tag),
.code-figure .code-block :deep(.hljs-subst) {
  color: #cf222e !important;
  font-weight: 600;
}

.code-figure .code-block :deep(.hljs-string),
.code-figure .code-block :deep(.hljs-title),
.code-figure .code-block :deep(.hljs-name),
.code-figure .code-block :deep(.hljs-type),
.code-figure .code-block :deep(.hljs-attribute),
.code-figure .code-block :deep(.hljs-symbol),
.code-figure .code-block :deep(.hljs-bullet),
.code-figure .code-block :deep(.hljs-addition),
.code-figure .code-block :deep(.hljs-variable),
.code-figure .code-block :deep(.hljs-template-tag),
.code-figure .code-block :deep(.hljs-template-variable) {
  color: #0a3069 !important;
}

.code-figure .code-block :deep(.hljs-regexp),
.code-figure .code-block :deep(.hljs-link) {
  color: #0550ae !important;
}

.code-figure .code-block :deep(.hljs-number),
.code-figure .code-block :deep(.hljs-built_in),
.code-figure .code-block :deep(.hljs-builtin-name) {
  color: #0550ae !important;
}

.code-figure .code-block :deep(.hljs-meta) {
  color: #8250df !important;
}

.code-figure .code-block :deep(.hljs-deletion) {
  color: #82071e !important;
  background-color: #ffebe9 !important;
}

.code-figure .code-block :deep(.hljs-addition) {
  color: #116329 !important;
  background-color: #dafbe1 !important;
}

.code-figure .code-block :deep(.hljs-emphasis) {
  font-style: italic;
}

.code-figure .code-block :deep(.hljs-strong) {
  font-weight: bold;
}

/* 说明文字（替代原来的紫色框）- 自然段落/引用样式 */
.explanation {
  background: transparent;
  padding: 16px 20px;
  border-left: 3px solid #94a3b8;
  border-radius: 0 8px 8px 0;
  color: #4a5568;
  font-size: 15px;
  line-height: 1.8;
  margin-top: 16px;
}

.explanation :deep(strong) {
  color: #2d3748;
  font-weight: 600;
}

.explanation :deep(.inline-code) {
  background: #f1f5f9;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Fira Code', Consolas, monospace;
  font-size: 13px;
  color: #c7254e;
}

.modal-content {
  background: linear-gradient(135deg, var(--bg-card) 0%, #f8fafc 100%);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  padding: 48px;
  max-width: 1400px;
  width: 95vw;
  max-height: calc(100vh - 120px);
  overflow: hidden;
  position: relative;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  margin: auto;
  will-change: transform, opacity;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 24px;
  cursor: pointer;
  transition: color 0.3s ease;
}

.close-btn:hover {
  color: var(--text-main);
}

/* 以下旧样式已替换为 MD 文档流风格，保留此注释作为标记 */
/* .modal-content h2, .tutorial-desc, .code-examples, .code-block(旧),
   .code-wrapper, .copy-btn(全局), .example-explanation 均已移除 */

.tutorial-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 40px;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
}

/* 导航按钮容器 */
.tutorial-nav-left {
  display: flex;
  align-items: center;
}

.tutorial-nav-right {
  display: flex;
  align-items: center;
  margin-left: auto;
}

.nav-btn {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  border: none;
  color: white;
  padding: 14px 28px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
  position: relative;
  overflow: hidden;
}

.nav-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.6s ease;
}

.nav-btn:hover::before {
  left: 100%;
}

.nav-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4);
}

.nav-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(124, 58, 237, 0.3);
}

/* ========== 左右分栏容器 ========== */
.split-container {
  display: flex;
  gap: 0;
  flex: 1;
  overflow: hidden;
}

/* 左侧：教程面板 */
.tutorial-panel {
  flex: 0 0 55%;
  overflow-y: auto;
  padding-right: 24px;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
}

.tutorial-panel::-webkit-scrollbar {
  width: 6px;
}

.tutorial-panel::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 3px;
}

/* 分隔线 */
.split-divider {
  width: 1px;
  background: linear-gradient(180deg, transparent, #d1d5db 20%, #d1d5db 80%, transparent);
  flex-shrink: 0;
}

/* 右侧：编辑器面板 */
.editor-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding-left: 20px;
  overflow: hidden;
}

/* 编辑器工具栏 */
.editor-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-bottom: none;
  border-radius: 8px 8px 0 0;
  flex-shrink: 0;
}

.toolbar-left .editor-language {
  font-size: 13px;
  font-weight: 600;
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.toolbar-right {
  display: flex;
  gap: 8px;
}

.tool-btn {
  padding: 6px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: white;
  color: #4a5568;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tool-btn:hover:not(:disabled) {
  background: #f1f5f9;
  border-color: var(--primary);
  color: var(--primary);
}

.tool-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.run-btn {
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: white;
  border: none;
}

.run-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
}

/* 编辑器包装器 */
.editor-wrapper {
  flex: 1;
  min-height: 300px;
  border: 1px solid #e2e8f0;
  border-top: none;
  border-radius: 0 0 8px 8px;
  overflow: hidden;
}

/* ========== 交互式终端容器样式 ========== */
.terminal-container {
  margin-top: 12px;
  border: 1px solid #333;
  border-radius: 8px;
  overflow: hidden;
  background: #1e1e1e;
  display: flex;
  flex-direction: column;
  height: 220px;
  min-height: 150px;
}

.terminal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 12px;
  background: #2d2d2d;
  border-bottom: 1px solid #333;
}

.terminal-title {
  font-size: 12px;
  font-weight: 600;
  color: #888;
}

.terminal-status {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
}

.status-idle { color: #0dbc79; }
.status-running { color: #e5e510; animation: pulse 1s infinite; }
.status-disconnected { color: #cd3131; }

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.terminal-body {
  flex: 1;
  padding: 8px;
  overflow: hidden;
}

.terminal-body .xterm {
  height: 100%;
}

.terminal-body .xterm-viewport {
  overflow-y: auto !important;
}

/* 标准输入面板 */
.stdin-panel {
  margin-top: 10px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #fafafa;
  overflow: hidden;
}

.stdin-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 12px;
  background: #f0f0f0;
  border-bottom: 1px solid #e5e7eb;
}

.stdin-title {
  font-size: 12px;
  font-weight: 600;
  color: #374151;
}

.stdin-hint {
  font-size: 11px;
  color: #9ca3af;
}

.stdin-textarea {
  width: 100%;
  border: none;
  padding: 8px 12px;
  font-size: 13px;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  background: transparent;
  resize: vertical;
  min-height: 40px;
  max-height: 100px;
  outline: none;
  color: #1f2937;
  line-height: 1.5;
  box-sizing: border-box;
}

.stdin-textarea::placeholder {
  color: #b0b6bf;
}

/* 输出面板 */
.output-panel {
  margin-top: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.output-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

/* 输出标题区域（包含执行方式标识） */
.output-title-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* 执行方式标识徽章 */
.execution-mode-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
  letter-spacing: 0.3px;
}

.execution-mode-badge.frontend {
  background: #dbeafe;
  color: #1e40af;
}

.execution-mode-badge.backend {
  background: #fef3c7;
  color: #92400e;
}

.output-title {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
}

.output-status {
  font-size: 12px;
  font-weight: 600;
  padding: 2px 10px;
  border-radius: 12px;
}

.output-status.success {
  background: #dcfce7;
  color: #166534;
}

.output-status.error {
  background: #fee2e2;
  color: #991b1b;
}

.output-content {
  margin: 0;
  padding: 16px;
  background: #1e293b;
  color: #e2e8f0;
  font-family: "SF Mono", Consolas, monospace;
  font-size: 13px;
  line-height: 1.6;
  min-height: 80px;
  max-height: 200px;
  overflow-y: auto;
  white-space: pre-wrap;
  word-break: break-all;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .split-container {
    flex-direction: column;
  }

  .tutorial-panel {
    flex: none;
    max-height: 50vh;
    padding-right: 0;
    border-right: none;
    border-bottom: 1px solid #e2e8f0;
  }

  .split-divider {
    width: 100%;
    height: 1px;
    background: #e2e8f0;
  }

  .editor-panel {
    padding-left: 0;
    padding-top: 16px;
    flex: 1;
    min-height: 400px;
  }
}

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    width: 280px;
  }

  .sidebar.sidebar-collapsed {
    transform: translateX(0);
    width: 280px;
    padding: 24px;
  }

  .sidebar.sidebar-collapsed .sidebar-header {
    justify-content: space-between;
    margin-bottom: 32px;
  }

  .sidebar.sidebar-collapsed .sidebar-header h3,
  .sidebar.sidebar-collapsed .lang-name {
    opacity: 1;
    width: auto;
  }

  .sidebar.sidebar-collapsed .lang-icon {
    width: 26px;
    height: 26px;
    font-size: 11px;
    font-weight: 700;
    background: rgba(124, 58, 237, 0.1);
    border-radius: 6px;
    color: var(--primary);
  }

  .sidebar.sidebar-collapsed .language-item {
    padding: 1rem;
    justify-content: flex-start;
  }

  .sidebar.sidebar-collapsed .radio-container .glider-container {
    display: block;
  }

  .sidebar.sidebar-collapsed .radio-container {
    padding-left: 0.5rem;
  }

  .main-content {
    margin-left: 0;
    padding: 40px 24px;
  }

  .sidebar.sidebar-collapsed + .main-content {
    margin-left: 0;
  }

  .tasks-grid {
    grid-template-columns: 1fr;
  }

  .modal-content {
    padding: 24px;
    max-height: calc(100vh - 140px);
    width: 96vw;
  }

  .tutorial-modal {
    padding: 60px 16px 16px;
  }

  .code-lab-header h1 {
    font-size: 24px;
  }
}
</style>
