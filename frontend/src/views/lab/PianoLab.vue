<template>
  <div class="piano-lab-page">
    <!-- 粒子背景 -->
    <canvas class="particles-background" />

    <div class="piano-container">
      <h2>{{ t('Web Audio 钢琴') }}</h2>
      <p class="subtitle">
        {{ t('使用键盘 A-L 演奏白键，W/E/T/Y/U 演奏黑键') }}
      </p>

      <!-- 可视化效果 -->
      <canvas
        ref="visualizerRef"
        class="visualizer"
      />

      <!-- 钢琴键盘 -->
      <div class="piano-keyboard">
        <!-- 黑键 -->
        <div class="black-keys">
          <div
            v-for="key in blackKeys"
            :key="key.note"
            class="black-key"
            :class="{ active: activeKeys.has(key.note) }"
            :data-note="key.note"
            :data-key="key.keyboard"
            @mousedown="playNote(key.freq, key.note)"
            @mouseup="stopNote(key.note)"
            @mouseleave="stopNote(key.note)"
          >
            <span class="key-label">{{ key.keyboard }}</span>
          </div>
        </div>

        <!-- 白键 -->
        <div class="white-keys">
          <div
            v-for="key in whiteKeys"
            :key="key.note"
            class="white-key"
            :class="{ active: activeKeys.has(key.note) }"
            :data-note="key.note"
            :data-key="key.keyboard"
            @mousedown="playNote(key.freq, key.note)"
            @mouseup="stopNote(key.note)"
            @mouseleave="stopNote(key.note)"
          >
            <span class="key-label">{{ key.keyboard }}</span>
            <span class="note-label">{{ key.note }}</span>
          </div>
        </div>
      </div>

      <!-- 控制面板 -->
      <div class="control-panel">
        <div class="control-group">
          <label>{{ t('波形') }}</label>
          <select
            v-model="waveform"
            @change="updateWaveform"
          >
            <option value="sine">
              {{ t('正弦波 (Sine)') }}
            </option>
            <option value="square">
              {{ t('方波 (Square)') }}
            </option>
            <option value="sawtooth">
              {{ t('锯齿波 (Sawtooth)') }}
            </option>
            <option value="triangle">
              {{ t('三角波 (Triangle)') }}
            </option>
          </select>
        </div>

        <div class="control-group">
          <label>{{ t('音量') }}: {{ Math.round(volume * 100) }}%</label>
          <input
            v-model.number="volume"
            type="range"
            min="0"
            max="1"
            step="0.1"
          >
        </div>

        <div class="control-group">
          <label>{{ t('混响') }}: {{ Math.round(reverb * 100) }}%</label>
          <input
            v-model.number="reverb"
            type="range"
            min="0"
            max="0.8"
            step="0.1"
          >
        </div>
      </div>
    </div>

    <!-- 返回按钮 -->
    <button
      class="back-btn"
      @click="$router.push('/lab')"
    >
      {{ t('← 返回实验室') }}
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useI18n } from '../../composables/useI18n.ts';
import { useParticles } from '../../composables/useParticles.ts';

const { t } = useI18n();

useParticles();

const visualizerRef = ref(null);
const activeKeys = ref(new Set());
const waveform = ref('triangle');
const volume = ref(0.3);
const reverb = ref(0.3);

let audioContext = null;
let masterGain = null;
let reverbNode = null;
let analyser = null;
let oscillators = {};
let animationId = null;

// 音符频率映射 (C4 - B5)
const noteFrequencies = {
  'C': 261.63,
  'C#': 277.18,
  'D': 293.66,
  'D#': 311.13,
  'E': 329.63,
  'F': 349.23,
  'F#': 369.99,
  'G': 392.00,
  'G#': 415.30,
  'A': 440.00,
  'A#': 466.16,
  'B': 493.88,
  'C5': 523.25,
  'C#5': 554.37,
  'D5': 587.33,
  'D#5': 622.25,
  'E5': 659.25,
  'F5': 698.46,
  'F#5': 739.99,
  'G5': 783.99,
  'G#5': 830.61,
  'A5': 880.00,
  'A#5': 932.33,
  'B5': 987.77
};

// 键盘映射
const keyboardMap = {
  'a': 'C', 'w': 'C#', 's': 'D', 'e': 'D#', 'd': 'E',
  'f': 'F', 't': 'F#', 'g': 'G', 'y': 'G#', 'h': 'A',
  'u': 'A#', 'j': 'B', 'k': 'C5', 'o': 'C#5', 'l': 'D5',
  'p': 'D#5', ';': 'E5'
};

// 白键数据
const whiteKeys = [
  { note: 'C', freq: noteFrequencies['C'], keyboard: 'A' },
  { note: 'D', freq: noteFrequencies['D'], keyboard: 'S' },
  { note: 'E', freq: noteFrequencies['E'], keyboard: 'D' },
  { note: 'F', freq: noteFrequencies['F'], keyboard: 'F' },
  { note: 'G', freq: noteFrequencies['G'], keyboard: 'G' },
  { note: 'A', freq: noteFrequencies['A'], keyboard: 'H' },
  { note: 'B', freq: noteFrequencies['B'], keyboard: 'J' },
  { note: 'C5', freq: noteFrequencies['C5'], keyboard: 'K' },
  { note: 'D5', freq: noteFrequencies['D5'], keyboard: 'L' },
  { note: 'E5', freq: noteFrequencies['E5'], keyboard: ';' }
];

// 黑键数据
const blackKeys = [
  { note: 'C#', freq: noteFrequencies['C#'], keyboard: 'W' },
  { note: 'D#', freq: noteFrequencies['D#'], keyboard: 'E' },
  { note: 'F#', freq: noteFrequencies['F#'], keyboard: 'T' },
  { note: 'G#', freq: noteFrequencies['G#'], keyboard: 'Y' },
  { note: 'A#', freq: noteFrequencies['A#'], keyboard: 'U' },
  { note: 'C#5', freq: noteFrequencies['C#5'], keyboard: 'O' },
  { note: 'D#5', freq: noteFrequencies['D#5'], keyboard: 'P' }
];

function initAudio() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioContext.createGain();
    masterGain.gain.value = volume.value;
    masterGain.connect(audioContext.destination);

    // 创建分析器用于可视化
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    masterGain.connect(analyser);

    createReverb();
    startVisualizer();
  }
}

function createReverb() {
  // 创建简单的混响效果
  const convolver = audioContext.createConvolver();
  const rate = audioContext.sampleRate;
  const length = rate * 2; // 2秒混响
  const impulse = audioContext.createBuffer(2, length, rate);

  for (let channel = 0; channel < 2; channel++) {
    const channelData = impulse.getChannelData(channel);
    for (let i = 0; i < length; i++) {
      channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
    }
  }

  convolver.buffer = impulse;
  reverbNode = convolver;
}

function playNote(freq, note) {
  initAudio();
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }

  // 停止之前的同音符
  stopNote(note);

  // 创建振荡器
  const osc = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  osc.type = waveform.value;
  osc.frequency.value = freq;

  // 包络
  const now = audioContext.currentTime;
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(volume.value, now + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(volume.value * 0.7, now + 0.1);

  // 连接节点
  osc.connect(gainNode);

  // 混响
  if (reverb.value > 0) {
    const reverbGain = audioContext.createGain();
    reverbGain.gain.value = reverb.value;
    gainNode.connect(reverbGain);
    reverbGain.connect(reverbNode);
    reverbNode.connect(masterGain);
  }

  gainNode.connect(masterGain);

  osc.start(now);

  // 保存引用
  oscillators[note] = { osc, gainNode };
  activeKeys.value.add(note);
}

function stopNote(note) {
  if (oscillators[note]) {
    const { osc, gainNode } = oscillators[note];
    const now = audioContext.currentTime;

    // 释放包络
    gainNode.gain.cancelScheduledValues(now);
    gainNode.gain.setValueAtTime(gainNode.gain.value, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.stop(now + 0.3);

    // 清理
    setTimeout(() => {
      if (oscillators[note] && oscillators[note].osc === osc) {
        delete oscillators[note];
      }
    }, 350);

    activeKeys.value.delete(note);
  }
}

function updateWaveform() {
  // 更新所有正在播放的音符的波形
  Object.values(oscillators).forEach(({ osc }) => {
    osc.type = waveform.value;
  });
}

function startVisualizer() {
  const canvas = visualizerRef.value;
  if (!canvas || !analyser) return;

  const ctx = canvas.getContext('2d');
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  function draw() {
    animationId = requestAnimationFrame(draw);

    analyser.getByteFrequencyData(dataArray);

    ctx.fillStyle = 'rgba(245, 243, 255, 0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / bufferLength) * 2.5;
    let barHeight;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      barHeight = (dataArray[i] / 255) * canvas.height * 0.8;

      const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
      gradient.addColorStop(0, '#EC4899');
      gradient.addColorStop(1, '#F9A8D4');

      ctx.fillStyle = gradient;
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

      x += barWidth + 1;
    }
  }

  draw();
}

function handleKeyDown(e) {
  const key = e.key.toLowerCase();
  if (keyboardMap[key] && !e.repeat) {
    const note = keyboardMap[key];
    const freq = noteFrequencies[note];
    playNote(freq, note);
  }
}

function handleKeyUp(e) {
  const key = e.key.toLowerCase();
  if (keyboardMap[key]) {
    stopNote(keyboardMap[key]);
  }
}

onMounted(() => {
  const canvas = visualizerRef.value;
  if (canvas) {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
});

onUnmounted(() => {
  cancelAnimationFrame(animationId);
  window.removeEventListener('keydown', handleKeyDown);
  window.removeEventListener('keyup', handleKeyUp);

  // 停止所有音符
  Object.keys(oscillators).forEach(note => stopNote(note));

  if (audioContext) {
    audioContext.close();
  }
});
</script>

<style scoped>
.piano-lab-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
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

.piano-container {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(236, 72, 153, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.5);
  max-width: 900px;
  width: 100%;
}

h2 {
  text-align: center;
  margin: 0 0 8px 0;
  font-size: 28px;
  color: var(--text-primary);
}

.subtitle {
  text-align: center;
  color: var(--text-secondary);
  font-size: 14px;
  margin-bottom: 30px;
}

.visualizer {
  width: 100%;
  height: 100px;
  background: rgba(236, 72, 153, 0.05);
  border-radius: 12px;
  margin-bottom: 30px;
}

.piano-keyboard {
  position: relative;
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}

.white-keys {
  display: flex;
  gap: 4px;
}

.white-key {
  width: 60px;
  height: 200px;
  background: linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%);
  border: 1px solid #cbd5e1;
  border-radius: 0 0 8px 8px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  padding-bottom: 15px;
  cursor: pointer;
  transition: all 0.1s ease;
  position: relative;
}

.white-key:hover {
  background: linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%);
}

.white-key.active {
  background: linear-gradient(180deg, #e0e7ff 0%, #c7d2fe 100%);
  transform: translateY(2px);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.black-keys {
  position: absolute;
  top: 0;
  display: flex;
  gap: 4px;
  padding-left: 44px;
}

.black-key {
  width: 36px;
  height: 120px;
  background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
  border-radius: 0 0 6px 6px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding-bottom: 10px;
  cursor: pointer;
  transition: all 0.1s ease;
  margin-right: 28px;
}

.black-key:hover {
  background: linear-gradient(180deg, #334155 0%, #1e293b 100%);
}

.black-key.active {
  background: linear-gradient(180deg, #4c1d95 0%, #5b21b6 100%);
  transform: translateY(2px);
  height: 118px;
}

/* 黑键位置调整 */
.black-key:nth-child(2) {
  margin-right: 64px;
}

.black-key:nth-child(5) {
  margin-right: 64px;
}

.key-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
}

.black-key .key-label {
  color: rgba(255, 255, 255, 0.7);
}

.note-label {
  font-size: 10px;
  color: var(--text-light);
  margin-top: 4px;
}

.control-panel {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
}

.control-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.control-group label {
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 500;
}

.control-group select {
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  font-size: 13px;
  cursor: pointer;
  min-width: 150px;
}

.control-group input[type="range"] {
  width: 120px;
  height: 6px;
  border-radius: 3px;
  background: #e2e8f0;
  outline: none;
  -webkit-appearance: none;
}

.control-group input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--primary);
  cursor: pointer;
}

.back-btn {
  position: fixed;
  top: 100px;
  left: 20px;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  color: var(--text-primary);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.back-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

@media (max-width: 768px) {
  .piano-container {
    padding: 20px;
  }

  .white-key {
    width: 40px;
    height: 150px;
  }

  .black-key {
    width: 28px;
    height: 90px;
    margin-right: 16px;
  }

  .black-key:nth-child(2),
  .black-key:nth-child(5) {
    margin-right: 44px;
  }

  .black-keys {
    padding-left: 28px;
  }
}
</style>
