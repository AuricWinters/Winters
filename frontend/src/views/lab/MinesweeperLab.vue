<template>
  <div
    class="minesweeper-page"
    :data-theme="themeName"
  >
    <canvas class="particles-background" />
    <div
      id="mainContainer"
      class="main-container"
    >
      <!-- 头部 -->
      <div class="header">
        <div class="title-group">
          <span class="game-title"><span class="icon">💣</span>{{ t('扫雷') }}</span>
        </div>
        <div class="header-actions">
          <button
            id="btnSound"
            class="sound-btn"
            :title="t('音效开关')"
          >
            🔊
          </button>
          <button
            id="btnSettings"
            class="sound-btn"
            :title="t('设置')"
          >
            ⚙️
          </button>
        </div>
      </div>

      <!-- 难度选择 -->
      <div
        id="difficultyBar"
        class="difficulty-bar"
      >
        <button
          class="diff-btn active"
          data-preset="beginner"
        >
          🌱 {{ t('初级') }}
        </button>
        <button
          class="diff-btn"
          data-preset="intermediate"
        >
          🌿 {{ t('中级') }}
        </button>
        <button
          class="diff-btn"
          data-preset="expert"
        >
          🔥 {{ t('高级') }}
        </button>
        <button
          id="btnCustomPreset"
          class="diff-btn"
          data-preset="custom"
        >
          ⚙️ {{ t('自定义') }}
        </button>
      </div>

      <!-- 自定义设置面板 -->
      <div
        id="settingsPanel"
        class="settings-panel hidden"
      >
        <div class="setting-group">
          <span class="setting-label">{{ t('行数') }}</span>
          <input
            id="rangeRows"
            type="range"
            min="8"
            max="50"
            value="16"
            step="1"
          >
          <span
            id="valRows"
            class="setting-value"
          >16</span>
        </div>
        <div class="setting-group">
          <span class="setting-label">{{ t('列数') }}</span>
          <input
            id="rangeCols"
            type="range"
            min="8"
            max="50"
            value="16"
            step="1"
          >
          <span
            id="valCols"
            class="setting-value"
          >16</span>
        </div>
        <div class="setting-group">
          <span class="setting-label">{{ t('雷数') }}</span>
          <input
            id="rangeMines"
            type="range"
            min="8"
            max="400"
            value="40"
            step="1"
          >
          <span
            id="valMines"
            class="setting-value"
          >40</span>
        </div>
        <button
          id="btnApplyCustom"
          class="btn-apply"
        >
          ✅ {{ t('应用设置') }}
        </button>
      </div>

      <!-- 游戏面板 -->
      <div
        id="boardWrapper"
        class="board-wrapper"
      >
        <div class="status-bar">
          <div
            id="mineCounter"
            class="counter-box"
          >
            000
          </div>
          <button
            id="faceBtn"
            class="face-btn"
          >
            🙂
          </button>
          <div
            id="timerDisplay"
            class="timer-box"
          >
            000
          </div>
        </div>
        <div
          id="gridContainer"
          class="grid-container"
        >
          <div
            id="mineGrid"
            class="mine-grid"
          />
          <canvas id="particleCanvas" />
        </div>
      </div>

      <!-- 统计 -->
      <div class="stats-row">
        <span class="stat-badge">🎮 {{ t('总局数') }} <span id="statTotal">0</span></span>
        <span class="stat-badge">🏆 {{ t('胜利') }} <span id="statWins">0</span></span>
        <span class="stat-badge">⏱ {{ t('最佳') }} <span id="statBestTime">--</span></span>
        <span class="stat-badge">📊 {{ t('胜率') }} <span id="statRate">--</span></span>
      </div>

      <!-- 设置弹窗 -->
      <div
        id="settingsModal"
        class="modal-overlay hidden"
      >
        <div class="modal-content">
          <div class="modal-header">
            <span class="modal-title">⚙️ {{ t('设置') }}</span>
            <button
              id="btnSettingsClose"
              class="modal-close"
            >
              ✕
            </button>
          </div>
          <div class="modal-body">
            <div class="modal-setting">
              <span class="modal-setting-label">🚀 {{ t('游戏速度') }}</span>
              <div class="modal-speed-row">
                <span class="speed-tag">{{ t('慢') }}</span>
                <input
                  id="rangeSpeed"
                  type="range"
                  min="0"
                  max="100"
                  value="60"
                  step="1"
                >
                <span class="speed-tag">{{ t('快') }}</span>
              </div>
              <span
                id="valSpeed"
                class="setting-value"
              >60%</span>
            </div>
            <div class="modal-divider" />
            <div class="modal-setting">
              <span class="modal-setting-label">🌓 {{ t('明暗模式') }}</span>
              <div
                id="baseToggle"
                class="theme-toggle base-row"
              >
                <span
                  class="theme-btn active"
                  data-base-val="dark"
                >🌙 {{ t('暗色') }}</span>
                <span
                  class="theme-btn"
                  data-base-val="light"
                >☀️ {{ t('亮色') }}</span>
              </div>
            </div>
            <div class="modal-divider" />
            <div class="modal-setting">
              <span class="modal-setting-label">🎨 {{ t('色彩主题') }}</span>
              <div
                id="accentToggle"
                class="theme-toggle"
              >
                <span
                  class="theme-btn active"
                  data-accent-val="default"
                >🎯 {{ t('默认') }}</span>
                <span
                  class="theme-btn"
                  data-accent-val="forest"
                >🌲 {{ t('森林') }}</span>
                <span
                  class="theme-btn"
                  data-accent-val="ocean"
                >🌊 {{ t('海洋') }}</span>
                <span
                  class="theme-btn"
                  data-accent-val="sunset"
                >🌅 {{ t('日落') }}</span>
                <span
                  class="theme-btn"
                  data-accent-val="neon"
                >💜 {{ t('霓虹') }}</span>
                <span
                  class="theme-btn"
                  data-accent-val="retro"
                >📜 {{ t('复古') }}</span>
                <span
                  class="theme-btn"
                  data-accent-val="lavender"
                >💐 {{ t('薰衣') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <button
      class="back-btn"
      @click="$router.push('/lab')"
    >
      {{ t('返回实验室') }}
    </button>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted, onUnmounted } from 'vue';
import { useI18n } from '../../composables/useI18n.ts';
import { useParticles } from '../../composables/useParticles.ts';

const { t } = useI18n();
useParticles('.particles-background');

// 获取 scopeId 用于动态创建的元素
const scopeId = getCurrentInstance()?.type.__scopeId;

// ==================== 响应式状态 ====================
const themeName = ref('dark');

// ==================== DOM 引用 ====================
let mineGrid = null;
let particleCanvas = null;
let gridContainer = null;
let mineCounter = null;
let timerDisplay = null;
let faceBtn = null;
let btnSound = null;
let settingsPanel = null;
let btnCustomPreset = null;
let btnApplyCustom = null;
let rangeRows = null;
let rangeCols = null;
let rangeMines = null;
let valRows = null;
let valCols = null;
let valMines = null;
let difficultyBar = null;
let statTotal = null;
let statWins = null;
let statBestTime = null;
let statRate = null;
let ctx = null;
let btnSettings = null;
let settingsModal = null;
let btnSettingsClose = null;
let rangeSpeed = null;
let valSpeed = null;
let baseToggle = null;
let accentToggle = null;

// ==================== 音效系统 ====================
let audioCtx = null;
let soundEnabled = true;

function initAudio() {
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      audioCtx = null;
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
}

function playBeep(freq, duration, type = 'sine', vol = 0.05, glideTo = null) {
  if (!soundEnabled || !audioCtx) return;
  try {
    const t = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (glideTo) osc.frequency.linearRampToValueAtTime(glideTo, t + duration);
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(t);
    osc.stop(t + duration);
  } catch (e) { /* 静默 */ }
}

function sfxReveal() { playBeep(600, 0.06, 'sine', 0.03); }
function sfxRevealNumber() { playBeep(450, 0.08, 'sine', 0.035); }
function sfxFlag() { playBeep(800, 0.07, 'triangle', 0.04, 1000); }
function sfxUnflag() { playBeep(300, 0.06, 'triangle', 0.03); }
function sfxChord() { playBeep(500, 0.05, 'sine', 0.04); playBeep(700, 0.06, 'sine', 0.03); }
function sfxExplosion() {
  playBeep(60, 0.35, 'sawtooth', 0.08, 20);
  setTimeout(() => playBeep(40, 0.4, 'square', 0.06, 15), 150);
}
function sfxVictory() {
  [500, 600, 700, 800, 900, 1000].forEach((f, i) => {
    setTimeout(() => playBeep(f, 0.18, 'triangle', 0.06), i * 70);
  });
}

// ==================== 游戏状态 ====================
const PRESETS = {
  beginner: { rows: 9, cols: 9, mines: 10, name: t('初级') },
  intermediate: { rows: 16, cols: 16, mines: 40, name: t('中级') },
  expert: { rows: 16, cols: 30, mines: 99, name: t('高级') },
  custom: { rows: 16, cols: 16, mines: 40, name: t('自定义') },
};
let currentPreset = 'beginner';
let config = { ...PRESETS.beginner };
let rows = config.rows;
let cols = config.cols;
let totalMines = config.mines;
let grid = [];
let gameState = 'idle';
let timerInterval = null;
let elapsedSeconds = 0;
let firstClickDone = false;
let cellsRemaining = 0;
let flagCount = 0;
let chordInProgress = false;
let _rightClickGuard = 0;

// 统计
let stats = { total: 0, wins: 0, bestTimes: {} };

// 设置状态
let gameSpeed = 2;
let currentBase = 'dark';
let currentAccent = 'default';

// 粒子
let particles = [];
let particleAnimId = null;

// ==================== 初始化 ====================
function loadStats() {
  try {
    const saved = localStorage.getItem('minesweeper_stats_v2');
    if (saved) stats = JSON.parse(saved);
    if (!stats.bestTimes) stats.bestTimes = {};
    if (!stats.total) stats.total = 0;
    if (!stats.wins) stats.wins = 0;
  } catch (e) { stats = { total: 0, wins: 0, bestTimes: {} }; }
}

function saveStats() {
  try { localStorage.setItem('minesweeper_stats_v2', JSON.stringify(stats)); } catch (e) { /* 静默 */ }
}

function saveDifficulty() {
  try {
    const data = { preset: currentPreset, config: config };
    localStorage.setItem('minesweeper_difficulty_v2', JSON.stringify(data));
  } catch (e) { /* 静默 */ }
}

function loadDifficulty() {
  try {
    const saved = localStorage.getItem('minesweeper_difficulty_v2');
    if (saved) {
      const data = JSON.parse(saved);
      if (data.preset && PRESETS[data.preset]) {
        currentPreset = data.preset;
        if (data.preset === 'custom' && data.config) {
          PRESETS.custom = { ...data.config, name: t('自定义') };
          config = { ...data.config };
        } else {
          config = { ...PRESETS[currentPreset] };
        }
        return true;
      }
    }
  } catch (e) { /* 静默 */ }
  return false;
}

function applySpeed(pct) {
  gameSpeed = 0.5 + (pct / 100) * 2.5;
  document.documentElement.style.setProperty('--speed', gameSpeed);
  valSpeed.textContent = pct + '%';
  saveSettings();
}

function getThemeName() {
  if (currentAccent === 'default') return currentBase;
  return currentBase + '-' + currentAccent;
}

function applyTheme(base, accent) {
  currentBase = base;
  currentAccent = accent || 'default';
  themeName.value = getThemeName();

  baseToggle.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
  const baseBtn = baseToggle.querySelector(`[data-base-val="${currentBase}"]`);
  if (baseBtn) baseBtn.classList.add('active');

  accentToggle.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
  const accentBtn = accentToggle.querySelector(`[data-accent-val="${currentAccent}"]`);
  if (accentBtn) accentBtn.classList.add('active');

  saveSettings();
}

function saveSettings() {
  try {
    localStorage.setItem('minesweeper_settings_v2', JSON.stringify({
      speedPct: parseInt(rangeSpeed.value),
      base: currentBase,
      accent: currentAccent
    }));
  } catch (e) { /* 静默 */ }
}

function loadSettings() {
  try {
    const saved = localStorage.getItem('minesweeper_settings_v2');
    let pct = 60;
    let loadedBase = 'dark';
    let loadedAccent = 'default';
    if (saved) {
      const data = JSON.parse(saved);
      if (data.speedPct !== undefined && data.speedPct >= 0 && data.speedPct <= 100) {
        pct = data.speedPct;
      } else if (data.speed >= 1 && data.speed <= 3) {
        pct = Math.round((data.speed - 0.5) / 2.5 * 100);
      }
      if (data.base) {
        loadedBase = data.base;
        if (data.accent) loadedAccent = data.accent;
      } else if (data.theme) {
        if (data.theme === 'light') { loadedBase = 'light'; loadedAccent = 'default'; }
        else if (data.theme === 'dark') { loadedBase = 'dark'; loadedAccent = 'default'; }
        else if (data.theme.startsWith('light-')) {
          loadedBase = 'light';
          loadedAccent = data.theme.replace('light-', '');
        } else if (data.theme.startsWith('dark-')) {
          loadedBase = 'dark';
          loadedAccent = data.theme.replace('dark-', '');
        } else {
          const validAccents = ['forest', 'ocean', 'sunset', 'neon', 'retro', 'lavender'];
          if (validAccents.includes(data.theme)) {
            loadedBase = 'dark';
            loadedAccent = data.theme;
          }
        }
      }
    }
    rangeSpeed.value = pct;
    applySpeed(pct);
    applyTheme(loadedBase, loadedAccent);
  } catch (e) { /* 静默 */ }
}

function updateStatsDisplay() {
  statTotal.textContent = stats.total;
  statWins.textContent = stats.wins;
  const presetKey = currentPreset === 'custom' ? 'custom' : currentPreset;
  const best = stats.bestTimes[presetKey];
  statBestTime.textContent = best ? formatTime(best) : '--';
  const rate = stats.total > 0 ? Math.round((stats.wins / stats.total) * 100) : 0;
  statRate.textContent = rate + '%';
}

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
}

function updateConfigFromPreset() {
  if (currentPreset === 'custom') {
    config = { ...PRESETS.custom };
  } else {
    config = { ...PRESETS[currentPreset] };
  }
  rows = config.rows;
  cols = config.cols;
  totalMines = config.mines;
  rangeRows.value = rows;
  rangeCols.value = cols;
  rangeMines.value = totalMines;
  valRows.textContent = rows;
  valCols.textContent = cols;
  valMines.textContent = totalMines;
  updateMineRangeMax();
}

function updateMineRangeMax() {
  const maxMines = Math.floor(rows * cols * 0.45);
  rangeMines.max = Math.max(8, maxMines);
  if (parseInt(rangeMines.value) > maxMines) {
    rangeMines.value = maxMines;
    valMines.textContent = maxMines;
  }
}

function createEmptyGrid() {
  grid = [];
  for (let r = 0; r < rows; r++) {
    grid[r] = [];
    for (let c = 0; c < cols; c++) {
      grid[r][c] = { mine: false, revealed: false, flagged: false, adjacentMines: 0 };
    }
  }
}

function placeMines(safeR, safeC) {
  const safeSet = new Set();
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      const nr = safeR + dr;
      const nc = safeC + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        safeSet.add(nr * cols + nc);
      }
    }
  }
  const candidates = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!safeSet.has(r * cols + c)) {
        candidates.push(r * cols + c);
      }
    }
  }
  let actualMines = totalMines;
  if (candidates.length < totalMines) {
    actualMines = Math.max(1, candidates.length);
    const allPositions = [];
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++)
        if (!(r === safeR && c === safeC)) allPositions.push(r * cols + c);
    const shuffled = [...allPositions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const picked = shuffled.slice(0, Math.min(totalMines, shuffled.length));
    for (const idx of picked) {
      const r = Math.floor(idx / cols);
      const c = idx % cols;
      grid[r][c].mine = true;
    }
    actualMines = picked.length;
  } else {
    const shuffled = [...candidates];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    for (let i = 0; i < actualMines; i++) {
      const idx = shuffled[i];
      const r = Math.floor(idx / cols);
      const c = idx % cols;
      grid[r][c].mine = true;
    }
  }
  totalMines = actualMines;
  config.mines = actualMines;
  rangeMines.value = actualMines;
  valMines.textContent = actualMines;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c].mine) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc].mine) count++;
        }
      }
      grid[r][c].adjacentMines = count;
    }
  }
}

function resetGame(preserveConfig = true) {
  if (!preserveConfig) {
    updateConfigFromPreset();
  }
  rows = config.rows;
  cols = config.cols;
  totalMines = config.mines;
  createEmptyGrid();
  gameState = 'idle';
  firstClickDone = false;
  cellsRemaining = rows * cols - totalMines;
  flagCount = 0;
  elapsedSeconds = 0;
  chordInProgress = false;
  clearTimer();
  updateMineCounter();
  updateTimerDisplay();
  faceBtn.textContent = '🙂';
  faceBtn.className = 'face-btn';
  mineCounter.className = 'counter-box';
  clearParticles();
  renderAllCells();
  updateStatsDisplay();
}

// ==================== 渲染 ====================
function renderAllCells() {
  mineGrid.innerHTML = '';
  mineGrid.style.gridTemplateColumns = `repeat(${cols}, 16px)`;
  mineGrid.style.gridTemplateRows = `repeat(${rows}, 16px)`;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = document.createElement('div');
      if (scopeId) cell.setAttribute(scopeId, '');
      cell.className = 'cell';
      cell.dataset.r = r;
      cell.dataset.c = c;
      cell.addEventListener('click', (e) => onCellClick(r, c, e));
      cell.addEventListener('mousedown', (e) => {
        if (e.button === 2) {
          e.preventDefault();
          onCellRightClick(r, c);
        }
      });
      cell.addEventListener('dblclick', (e) => { e.preventDefault(); onCellDoubleClick(r, c); });
      // 移动端长按
      let longPressTimer;
      cell.addEventListener('touchstart', (e) => {
        longPressTimer = setTimeout(() => {
          e.preventDefault();
          onCellRightClick(r, c);
          if (navigator.vibrate) navigator.vibrate(15);
        }, 400);
      }, { passive: false });
      cell.addEventListener('touchend', () => clearTimeout(longPressTimer));
      cell.addEventListener('touchmove', () => clearTimeout(longPressTimer));
      mineGrid.appendChild(cell);
    }
  }
  updateAllCellVisuals();
}

function getCellElement(r, c) {
  return mineGrid.querySelector(`[data-r="${r}"][data-c="${c}"]`);
}

function updateCellVisual(r, c) {
  const el = getCellElement(r, c);
  if (!el) return;
  const cell = grid[r][c];
  el.classList.remove('revealed', 'flagged', 'mine-hit', 'wrong-flag', 'ripple-reveal',
    'game-over-cell',
    'num-1', 'num-2', 'num-3', 'num-4', 'num-5', 'num-6', 'num-7', 'num-8', 'even');
  el.textContent = '';
  el.style.color = '';

  if (cell.revealed) {
    el.classList.add('revealed');
    if ((r + c) % 2 === 0) el.classList.add('even');
    if (cell.mine) {
      el.textContent = '💣';
      el.style.fontSize = '';
    } else if (cell.adjacentMines > 0) {
      el.textContent = cell.adjacentMines;
      el.classList.add('num-' + cell.adjacentMines);
    }
  } else if (cell.flagged) {
    el.textContent = '🚩';
    el.style.fontSize = '';
    el.classList.add('flagged');
  }
}

function updateAllCellVisuals() {
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      updateCellVisual(r, c);
}

function updateMineCounter() {
  const remaining = totalMines - flagCount;
  mineCounter.textContent = String(Math.max(0, remaining)).padStart(3, '0');
  if (remaining < 0) mineCounter.classList.add('warning');
  else mineCounter.classList.remove('warning');
}

function updateTimerDisplay() {
  timerDisplay.textContent = String(elapsedSeconds).padStart(3, '0');
}

// ==================== 计时器 ====================
function startTimer() {
  if (timerInterval) return;
  timerInterval = setInterval(() => {
    elapsedSeconds++;
    if (elapsedSeconds > 999) elapsedSeconds = 999;
    updateTimerDisplay();
  }, 1000);
}

function clearTimer() {
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
  elapsedSeconds = 0;
  updateTimerDisplay();
}

function stopTimer() {
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
}

// ==================== 游戏逻辑 ====================
function getNeighbors(r, c) {
  const neighbors = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) neighbors.push({ r: nr, c: nc });
    }
  }
  return neighbors;
}

function revealCell(r, c) {
  if (grid[r][c].revealed || grid[r][c].flagged) return;
  if (grid[r][c].mine) return;
  grid[r][c].revealed = true;
  cellsRemaining--;
  updateCellVisual(r, c);

  if (grid[r][c].adjacentMines === 0) {
    const neighbors = getNeighbors(r, c);
    const queue = neighbors.filter(n => !grid[n.r][n.c].revealed && !grid[n.r][n.c].flagged && !grid[n.r][n.c].mine);
    let delay = Math.round(15 * 2 / gameSpeed);
    const visited = new Set();
    const bfsQueue = [...queue];
    for (const n of queue) visited.add(n.r * cols + n.c);

    function processBFS() {
      if (bfsQueue.length === 0) {
        checkWin();
        return;
      }
      const batch = [];
      const batchSize = Math.min(bfsQueue.length, Math.round(16 * gameSpeed / 2));
      for (let i = 0; i < batchSize; i++) {
        const item = bfsQueue.shift();
        if (grid[item.r][item.c].revealed || grid[item.r][item.c].flagged) continue;
        grid[item.r][item.c].revealed = true;
        cellsRemaining--;
        batch.push(item);
        updateCellVisual(item.r, item.c);
        const el = getCellElement(item.r, item.c);
        if (el) el.classList.add('ripple-reveal');
        if (grid[item.r][item.c].adjacentMines === 0) {
          const nn = getNeighbors(item.r, item.c);
          for (const n of nn) {
            const key = n.r * cols + n.c;
            if (!visited.has(key) && !grid[n.r][n.c].revealed && !grid[n.r][n.c].flagged && !grid[n.r][n.c].mine) {
              visited.add(key);
              bfsQueue.push(n);
            }
          }
        }
      }
      delay += Math.round(12 * 2 / gameSpeed);
      if (bfsQueue.length > 0) {
        setTimeout(processBFS, delay);
      } else {
        checkWin();
      }
    }
    setTimeout(processBFS, delay);
  }
}

function onCellClick(r, c, event) {
  if (gameState === 'won' || gameState === 'lost') return;
  if (chordInProgress) return;
  if (event && event.button !== 0 && event.button !== undefined) return;
  initAudio();
  const cell = grid[r][c];
  if (cell.revealed) return;
  if (cell.flagged) return;

  if (!firstClickDone) {
    firstClickDone = true;
    gameState = 'playing';
    placeMines(r, c);
    cellsRemaining = rows * cols - totalMines;
    updateMineCounter();
    startTimer();
    faceBtn.textContent = '🙂';
    updateAllCellVisuals();
  }

  if (cell.mine) {
    triggerLoss(r, c);
    return;
  }

  sfxReveal();
  if (cell.adjacentMines > 0) sfxRevealNumber();
  faceBtn.classList.add('surprised');
  setTimeout(() => faceBtn.classList.remove('surprised'), Math.round(150 * 2 / gameSpeed));
  revealCell(r, c);
  checkWin();
}

function onCellRightClick(r, c) {
  const now = Date.now();
  if (now - _rightClickGuard < 50) return;
  _rightClickGuard = now;
  if (gameState === 'won' || gameState === 'lost') return;
  if (chordInProgress) return;
  initAudio();
  const cell = grid[r][c];
  if (cell.revealed) return;

  if (cell.flagged) {
    cell.flagged = false;
    flagCount--;
    sfxUnflag();
  } else {
    cell.flagged = true;
    flagCount++;
    sfxFlag();
  }
  updateCellVisual(r, c);
  updateMineCounter();
  const el = getCellElement(r, c);
  if (el && cell.flagged) {
    el.classList.remove('flagged');
    void el.offsetWidth;
    el.classList.add('flagged');
  }
}

function onCellDoubleClick(r, c) {
  if (gameState === 'won' || gameState === 'lost') return;
  if (!firstClickDone) return;
  initAudio();
  const cell = grid[r][c];
  if (!cell.revealed || cell.adjacentMines === 0) return;
  if (cell.mine) return;

  const neighbors = getNeighbors(r, c);
  const flaggedNeighbors = neighbors.filter(n => grid[n.r][n.c].flagged);
  if (flaggedNeighbors.length !== cell.adjacentMines) return;

  chordInProgress = true;
  sfxChord();
  let hitMine = false;
  let mineR = -1, mineC = -1;

  for (const n of neighbors) {
    if (grid[n.r][n.c].flagged) continue;
    if (grid[n.r][n.c].revealed) continue;
    if (grid[n.r][n.c].mine) {
      hitMine = true;
      mineR = n.r;
      mineC = n.c;
      break;
    }
    revealCell(n.r, n.c);
  }

  if (hitMine) {
    for (const n of neighbors) {
      if (grid[n.r][n.c].flagged && !grid[n.r][n.c].mine) {
        const el = getCellElement(n.r, n.c);
        if (el) el.classList.add('wrong-flag');
      }
    }
    triggerLoss(mineR, mineC);
  } else {
    checkWin();
  }
  setTimeout(() => { chordInProgress = false; }, Math.round(150 * 2 / gameSpeed));
}

function triggerLoss(mineR, mineC) {
  gameState = 'lost';
  stopTimer();
  faceBtn.textContent = '😵';
  faceBtn.className = 'face-btn lost';
  sfxExplosion();

  const hitEl = getCellElement(mineR, mineC);
  if (hitEl) {
    grid[mineR][mineC].revealed = true;
    hitEl.classList.add('mine-hit');
    hitEl.textContent = '💥';
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c].flagged && !grid[r][c].mine) {
        const el = getCellElement(r, c);
        if (el) el.classList.add('wrong-flag');
      }
    }
  }
  const unrevealedMines = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c].mine && !grid[r][c].revealed && !grid[r][c].flagged) {
        unrevealedMines.push({ r, c });
      }
    }
  }
  unrevealedMines.forEach((pos, i) => {
    setTimeout(() => {
      const el = getCellElement(pos.r, pos.c);
      if (el && !grid[pos.r][pos.c].revealed) {
        grid[pos.r][pos.c].revealed = true;
        el.classList.add('revealed');
        el.textContent = '💣';
      }
    }, Math.round(50 * 2 / gameSpeed) + i * Math.round(20 * 2 / gameSpeed));
  });
  spawnExplosionParticles(mineR, mineC);
  setTimeout(() => {
    mineGrid.querySelectorAll('.cell').forEach(c => c.classList.add('game-over-cell'));
  }, Math.round(200 * 2 / gameSpeed));
  stats.total++;
  saveStats();
  updateStatsDisplay();
}

function checkWin() {
  if (gameState !== 'playing') return;
  if (cellsRemaining <= 0) {
    gameState = 'won';
    stopTimer();
    faceBtn.textContent = '😎';
    faceBtn.className = 'face-btn won';
    sfxVictory();
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c].mine && !grid[r][c].flagged) {
          grid[r][c].flagged = true;
          flagCount++;
          updateCellVisual(r, c);
        }
      }
    }
    updateMineCounter();
    spawnVictoryFireworks();
    stats.total++;
    stats.wins++;
    const presetKey = currentPreset === 'custom' ? 'custom' : currentPreset;
    if (!stats.bestTimes[presetKey] || elapsedSeconds < stats.bestTimes[presetKey]) {
      stats.bestTimes[presetKey] = elapsedSeconds;
    }
    saveStats();
    updateStatsDisplay();
    setTimeout(() => {
      mineGrid.querySelectorAll('.cell').forEach(c => c.classList.add('game-over-cell'));
    }, Math.round(300 * 2 / gameSpeed));
  }
}

// ==================== 粒子系统 ====================
function resizeCanvas() {
  const rect = gridContainer.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  particleCanvas.width = rect.width * dpr;
  particleCanvas.height = rect.height * dpr;
  particleCanvas.style.width = rect.width + 'px';
  particleCanvas.style.height = rect.height + 'px';
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);
}

function clearParticles() {
  particles = [];
  if (particleAnimId) { cancelAnimationFrame(particleAnimId); particleAnimId = null; }
  const w = particleCanvas.width / Math.min(window.devicePixelRatio || 1, 2);
  const h = particleCanvas.height / Math.min(window.devicePixelRatio || 1, 2);
  ctx.clearRect(0, 0, w, h);
}

function spawnExplosionParticles(mineR, mineC) {
  resizeCanvas();
  const gridRect = mineGrid.getBoundingClientRect();
  const containerRect = gridContainer.getBoundingClientRect();
  const cellW = gridRect.width / cols;
  const cellH = gridRect.height / rows;
  const cx = (mineC + 0.5) * cellW + (gridRect.left - containerRect.left);
  const cy = (mineR + 0.5) * cellH + (gridRect.top - containerRect.top);
  for (let i = 0; i < 60; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 100 + Math.random() * 350;
    particles.push({
      x: cx,
      y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - Math.random() * 200,
      life: 0.4 + Math.random() * 0.9,
      maxLife: 0.4 + Math.random() * 0.9,
      size: 2 + Math.random() * 6,
      color: ['#ff4444', '#ff8844', '#ffaa00', '#ffcc33', '#ffffff'][Math.floor(Math.random() * 5)],
      gravity: 250 + Math.random() * 300,
    });
  }
  if (!particleAnimId) animateParticles();
}

function spawnVictoryFireworks() {
  resizeCanvas();
  const containerRect = gridContainer.getBoundingClientRect();
  const w = containerRect.width;
  const h = containerRect.height;
  const bursts = [
    { cx: w * 0.25, cy: h * 0.6 },
    { cx: w * 0.5, cy: h * 0.35 },
    { cx: w * 0.75, cy: h * 0.55 },
    { cx: w * 0.4, cy: h * 0.5 },
    { cx: w * 0.6, cy: h * 0.4 },
  ];
  bursts.forEach((burst, bi) => {
    setTimeout(() => {
      const colors = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff922b', '#cc5de8', '#20c997', '#ff6b9d'];
      for (let i = 0; i < 50; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 80 + Math.random() * 280;
        particles.push({
          x: burst.cx,
          y: burst.cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - Math.random() * 150,
          life: 0.7 + Math.random() * 1.3,
          maxLife: 0.7 + Math.random() * 1.3,
          size: 1.5 + Math.random() * 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          gravity: 180 + Math.random() * 200,
        });
      }
      if (!particleAnimId) animateParticles();
    }, bi * 250);
  });
}

function animateParticles(timestamp) {
  const containerRect = gridContainer.getBoundingClientRect();
  const w = containerRect.width;
  const h = containerRect.height;
  const dt = Math.min(0.05, 0.016);

  ctx.clearRect(0, 0, w, h);
  particles = particles.filter(p => {
    p.life -= dt;
    if (p.life <= 0) return false;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += p.gravity * dt;
    const alpha = Math.max(0, p.life / p.maxLife);
    const size = p.size * alpha;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = size * 3;
    ctx.beginPath();
    ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    return true;
  });
  if (particles.length > 0) {
    particleAnimId = requestAnimationFrame(animateParticles);
  } else {
    particleAnimId = null;
    ctx.clearRect(0, 0, w, h);
  }
}

// ==================== 事件处理 ====================
function setPreset(preset) {
  currentPreset = preset;
  updateConfigFromPreset();
  difficultyBar.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active', 'custom-active'));
  const btn = difficultyBar.querySelector(`[data-preset="${preset}"]`);
  if (btn) {
    btn.classList.add(preset === 'custom' ? 'custom-active' : 'active');
  }
  if (preset === 'custom') {
    settingsPanel.classList.remove('hidden');
    rangeRows.value = config.rows;
    rangeCols.value = config.cols;
    rangeMines.value = config.mines;
    valRows.textContent = config.rows;
    valCols.textContent = config.cols;
    valMines.textContent = config.mines;
    updateMineRangeMax();
  } else {
    settingsPanel.classList.add('hidden');
  }
  saveDifficulty();
  resetGame(false);
  resizeCanvas();
  clearParticles();
}

// ==================== 生命周期 ====================
let _contextHandler = null;
let _resizeTimeout = null;
let _keyHandler = null;

onMounted(() => {
  // 获取 DOM 引用
  mineGrid = document.getElementById('mineGrid');
  particleCanvas = document.getElementById('particleCanvas');
  gridContainer = document.getElementById('gridContainer');
  mineCounter = document.getElementById('mineCounter');
  timerDisplay = document.getElementById('timerDisplay');
  faceBtn = document.getElementById('faceBtn');
  btnSound = document.getElementById('btnSound');
  settingsPanel = document.getElementById('settingsPanel');
  btnCustomPreset = document.getElementById('btnCustomPreset');
  btnApplyCustom = document.getElementById('btnApplyCustom');
  rangeRows = document.getElementById('rangeRows');
  rangeCols = document.getElementById('rangeCols');
  rangeMines = document.getElementById('rangeMines');
  valRows = document.getElementById('valRows');
  valCols = document.getElementById('valCols');
  valMines = document.getElementById('valMines');
  difficultyBar = document.getElementById('difficultyBar');
  statTotal = document.getElementById('statTotal');
  statWins = document.getElementById('statWins');
  statBestTime = document.getElementById('statBestTime');
  statRate = document.getElementById('statRate');
  ctx = particleCanvas.getContext('2d');
  btnSettings = document.getElementById('btnSettings');
  settingsModal = document.getElementById('settingsModal');
  btnSettingsClose = document.getElementById('btnSettingsClose');
  rangeSpeed = document.getElementById('rangeSpeed');
  valSpeed = document.getElementById('valSpeed');
  baseToggle = document.getElementById('baseToggle');
  accentToggle = document.getElementById('accentToggle');

  // 全局阻止浏览器默认右键菜单
  document.addEventListener('contextmenu', (e) => e.preventDefault());

  // 难度选择
  difficultyBar.addEventListener('click', (e) => {
    const btn = e.target.closest('.diff-btn');
    if (!btn) return;
    const preset = btn.dataset.preset;
    if (preset === 'custom') {
      currentPreset = 'custom';
      updateConfigFromPreset();
      difficultyBar.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active', 'custom-active'));
      btn.classList.add('custom-active');
      settingsPanel.classList.remove('hidden');
      updateMineRangeMax();
      saveDifficulty();
      resetGame(false);
      resizeCanvas();
      clearParticles();
    } else if (preset) {
      setPreset(preset);
    }
  });

  // 应用自定义设置
  btnApplyCustom.addEventListener('click', () => {
    config.rows = parseInt(rangeRows.value);
    config.cols = parseInt(rangeCols.value);
    config.mines = parseInt(rangeMines.value);
    const maxMines = Math.floor(config.rows * config.cols * 0.45);
    if (config.mines > maxMines) config.mines = maxMines;
    if (config.mines < 1) config.mines = 1;
    if (config.mines >= config.rows * config.cols) config.mines = Math.floor(config.rows * config.cols * 0.4);
    rangeMines.value = config.mines;
    valMines.textContent = config.mines;
    PRESETS.custom = { ...config, name: t('自定义') };
    currentPreset = 'custom';
    saveDifficulty();
    resetGame(false);
    resizeCanvas();
    clearParticles();
    settingsPanel.classList.add('hidden');
    difficultyBar.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active', 'custom-active'));
    btnCustomPreset.classList.add('custom-active');
  });

  // 自定义面板滑块
  rangeRows.addEventListener('input', () => {
    valRows.textContent = rangeRows.value;
    updateMineRangeMax();
  });
  rangeCols.addEventListener('input', () => {
    valCols.textContent = rangeCols.value;
    updateMineRangeMax();
  });
  rangeMines.addEventListener('input', () => {
    valMines.textContent = rangeMines.value;
  });

  // 表情按钮（重置）
  faceBtn.addEventListener('click', () => {
    initAudio();
    resetGame(false);
    resizeCanvas();
    clearParticles();
    playBeep(500, 0.1, 'sine', 0.04);
  });

  // 音效开关
  btnSound.addEventListener('click', () => {
    initAudio();
    soundEnabled = !soundEnabled;
    btnSound.textContent = soundEnabled ? '🔊' : '🔇';
    if (soundEnabled) btnSound.classList.remove('muted');
    else btnSound.classList.add('muted');
    if (soundEnabled) playBeep(600, 0.08, 'sine', 0.04);
  });

  // 设置按钮
  btnSettings.addEventListener('click', () => {
    initAudio();
    settingsModal.classList.remove('hidden');
    rangeSpeed.value = Math.round((gameSpeed - 0.5) / 2.5 * 100);
    valSpeed.textContent = Math.round((gameSpeed - 0.5) / 2.5 * 100) + '%';
    baseToggle.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
    const baseBtn = baseToggle.querySelector(`[data-base-val="${currentBase}"]`);
    if (baseBtn) baseBtn.classList.add('active');
    accentToggle.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
    const accentBtn = accentToggle.querySelector(`[data-accent-val="${currentAccent}"]`);
    if (accentBtn) accentBtn.classList.add('active');
  });
  btnSettingsClose.addEventListener('click', () => {
    settingsModal.classList.add('hidden');
  });
  settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) settingsModal.classList.add('hidden');
  });
  rangeSpeed.addEventListener('input', () => {
    const pct = parseInt(rangeSpeed.value);
    applySpeed(pct);
    initAudio();
    playBeep(300 + pct * 3, 0.08, 'sine', 0.04);
  });
  baseToggle.addEventListener('click', (e) => {
    const btn = e.target.closest('.theme-btn');
    if (!btn) return;
    const base = btn.dataset.baseVal;
    applyTheme(base, currentAccent);
    initAudio();
    playBeep(600, 0.08, 'sine', 0.04);
  });
  accentToggle.addEventListener('click', (e) => {
    const btn = e.target.closest('.theme-btn');
    if (!btn) return;
    const accent = btn.dataset.accentVal;
    applyTheme(currentBase, accent);
    initAudio();
    playBeep(600, 0.08, 'sine', 0.04);
  });

  // 窗口大小变化
  window.addEventListener('resize', () => {
    clearTimeout(_resizeTimeout);
    _resizeTimeout = setTimeout(() => {
      resizeCanvas();
      updateAllCellVisuals();
    }, 250);
  });

  // 键盘快捷键
  _keyHandler = (e) => {
    if (e.key === 'r' || e.key === 'R') {
      if (e.target.tagName === 'INPUT') return;
      faceBtn.click();
    }
    if (e.key === 'm' || e.key === 'M') {
      if (e.target.tagName === 'INPUT') return;
      btnSound.click();
    }
  };
  document.addEventListener('keydown', _keyHandler);

  // ==================== 启动 ====================
  function boot() {
    loadStats();
    loadSettings();
    const hasSavedDifficulty = loadDifficulty();
    if (hasSavedDifficulty) {
      rows = config.rows;
      cols = config.cols;
      totalMines = config.mines;
      rangeRows.value = rows;
      rangeCols.value = cols;
      rangeMines.value = totalMines;
      valRows.textContent = rows;
      valCols.textContent = cols;
      valMines.textContent = totalMines;
      updateMineRangeMax();
      difficultyBar.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active', 'custom-active'));
      const btn = difficultyBar.querySelector(`[data-preset="${currentPreset}"]`);
      if (btn) {
        btn.classList.add(currentPreset === 'custom' ? 'custom-active' : 'active');
      }
      if (currentPreset === 'custom') {
        settingsPanel.classList.remove('hidden');
      }
    } else {
      updateConfigFromPreset();
      const btn = difficultyBar.querySelector('[data-preset="beginner"]');
      if (btn) btn.classList.add('active');
    }
    resetGame(false);
    resizeCanvas();
    updateStatsDisplay();
    document.addEventListener('click', initAudio, { once: true });
    document.addEventListener('touchstart', initAudio, { once: true });
    document.addEventListener('keydown', initAudio, { once: true });
  }

  boot();
});

onUnmounted(() => {
  // 清理定时器
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
  if (particleAnimId) { cancelAnimationFrame(particleAnimId); particleAnimId = null; }

  // 清理事件监听
  if (_keyHandler) document.removeEventListener('keydown', _keyHandler);
  if (_resizeTimeout) clearTimeout(_resizeTimeout);
  document.removeEventListener('contextmenu', _contextHandler);

  // 清理通过 { once: true } 添加的监听（自动清理）
});
</script>

<style scoped>
/* ==================== 所有12套主题 ==================== */

[data-theme="dark"] {
  --bg: #1a1d23;
  --surface: #252830;
  --surface2: #2d3039;
  --border: #3a3d45;
  --text: #e0e0e0;
  --text2: #a0a4ae;
  --accent: #f0a040;
  --danger: #e05555;
  --safe: #5cb878;
  --blue: #5b9bd5;
  --cell-bg: #3a3d47;
  --cell-hover: #4a4d58;
  --cell-revealed: #2a2d35;
  --cell-revealed2: #25282f;
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.45);
  --radius: 8px;
  --radius-sm: 5px;
  --radius-lg: 14px;
  --font: 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  --transition: 0.18s cubic-bezier(0.4, 0, 0.2, 1);
  --bounce: 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

[data-theme="light"] {
  --bg: #e8eaed;
  --surface: #ffffff;
  --surface2: #f0f2f5;
  --border: #dadce0;
  --text: #202124;
  --text2: #5f6368;
  --accent: #e8913a;
  --danger: #d93025;
  --safe: #34a853;
  --blue: #4285f4;
  --cell-bg: #c4c7cc;
  --cell-hover: #b8bbc0;
  --cell-revealed: #e8eaed;
  --cell-revealed2: #dfe1e5;
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.15);
  --radius: 8px;
  --radius-sm: 5px;
  --radius-lg: 14px;
  --font: 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  --transition: 0.18s cubic-bezier(0.4, 0, 0.2, 1);
  --bounce: 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

[data-theme="dark-forest"] {
  --bg: #1a2f1d;
  --surface: #243628;
  --surface2: #2d4231;
  --border: #3a553f;
  --text: #d4e8d0;
  --text2: #8fad8a;
  --accent: #7ecb76;
  --danger: #e05555;
  --safe: #5cb878;
  --blue: #6db3a0;
  --cell-bg: #3a5540;
  --cell-hover: #486b4e;
  --cell-revealed: #223526;
  --cell-revealed2: #1d2e20;
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.5);
  --radius: 8px;
  --radius-sm: 5px;
  --radius-lg: 14px;
  --font: 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  --transition: 0.18s cubic-bezier(0.4, 0, 0.2, 1);
  --bounce: 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

[data-theme="light-forest"] {
  --bg: #e6efe4;
  --surface: #f5faf3;
  --surface2: #e8f2e5;
  --border: #bdd4ba;
  --text: #1e2d1c;
  --text2: #5f7a5c;
  --accent: #4a9e3f;
  --danger: #d93025;
  --safe: #34a853;
  --blue: #3a7d8c;
  --cell-bg: #c5dcc2;
  --cell-hover: #b3cfaf;
  --cell-revealed: #e8f2e5;
  --cell-revealed2: #dce9d8;
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.15);
  --radius: 8px;
  --radius-sm: 5px;
  --radius-lg: 14px;
  --font: 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  --transition: 0.18s cubic-bezier(0.4, 0, 0.2, 1);
  --bounce: 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

[data-theme="dark-ocean"] {
  --bg: #0f1f2d;
  --surface: #162838;
  --surface2: #1d3447;
  --border: #2a4860;
  --text: #c8ddf0;
  --text2: #7da7c7;
  --accent: #5badd5;
  --danger: #e05555;
  --safe: #4db89e;
  --blue: #5b9bd5;
  --cell-bg: #233f55;
  --cell-hover: #2e5069;
  --cell-revealed: #142536;
  --cell-revealed2: #0f1e2c;
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.5);
  --radius: 8px;
  --radius-sm: 5px;
  --radius-lg: 14px;
  --font: 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  --transition: 0.18s cubic-bezier(0.4, 0, 0.2, 1);
  --bounce: 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

[data-theme="light-ocean"] {
  --bg: #dde9f3;
  --surface: #edf4fa;
  --surface2: #dce8f5;
  --border: #b8cedf;
  --text: #162838;
  --text2: #4f7a99;
  --accent: #3a8ec4;
  --danger: #d93025;
  --safe: #34a853;
  --blue: #4285f4;
  --cell-bg: #bed5e8;
  --cell-hover: #adc7dd;
  --cell-revealed: #dce8f5;
  --cell-revealed2: #cfddea;
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.15);
  --radius: 8px;
  --radius-sm: 5px;
  --radius-lg: 14px;
  --font: 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  --transition: 0.18s cubic-bezier(0.4, 0, 0.2, 1);
  --bounce: 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

[data-theme="dark-sunset"] {
  --bg: #2a1a1f;
  --surface: #352428;
  --surface2: #422e33;
  --border: #5a3e44;
  --text: #f0d8d0;
  --text2: #c49a90;
  --accent: #f0a050;
  --danger: #e05555;
  --safe: #7ba85a;
  --blue: #7b9fc0;
  --cell-bg: #4a3840;
  --cell-hover: #5c4650;
  --cell-revealed: #2d1e22;
  --cell-revealed2: #26181c;
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.5);
  --radius: 8px;
  --radius-sm: 5px;
  --radius-lg: 14px;
  --font: 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  --transition: 0.18s cubic-bezier(0.4, 0, 0.2, 1);
  --bounce: 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

[data-theme="light-sunset"] {
  --bg: #f5ece6;
  --surface: #fdf7f3;
  --surface2: #f5e8de;
  --border: #dcc8b8;
  --text: #3d2218;
  --text2: #8b6a55;
  --accent: #d4753a;
  --danger: #d93025;
  --safe: #5a8a45;
  --blue: #5b7da0;
  --cell-bg: #e2cfbc;
  --cell-hover: #d4bfaa;
  --cell-revealed: #f5e8de;
  --cell-revealed2: #ebdcd0;
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.15);
  --radius: 8px;
  --radius-sm: 5px;
  --radius-lg: 14px;
  --font: 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  --transition: 0.18s cubic-bezier(0.4, 0, 0.2, 1);
  --bounce: 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

[data-theme="dark-neon"] {
  --bg: #0d0d1a;
  --surface: #151528;
  --surface2: #1c1c35;
  --border: #2a2a4a;
  --text: #e0e0ff;
  --text2: #8a8ac0;
  --accent: #00ffcc;
  --danger: #ff4466;
  --safe: #00e676;
  --blue: #448aff;
  --cell-bg: #1e1e3a;
  --cell-hover: #2a2a50;
  --cell-revealed: #12122a;
  --cell-revealed2: #0d0d22;
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 8px 32px rgba(0, 255, 204, 0.15);
  --radius: 8px;
  --radius-sm: 5px;
  --radius-lg: 14px;
  --font: 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  --transition: 0.18s cubic-bezier(0.4, 0, 0.2, 1);
  --bounce: 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

[data-theme="light-neon"] {
  --bg: #e8eaf5;
  --surface: #f2f3fc;
  --surface2: #e6e8f8;
  --border: #c5c8e0;
  --text: #1a1a30;
  --text2: #5f6088;
  --accent: #00997a;
  --danger: #e03050;
  --safe: #1a9e4a;
  --blue: #3860cc;
  --cell-bg: #cbcee5;
  --cell-hover: #babdd8;
  --cell-revealed: #e6e8f8;
  --cell-revealed2: #daddf0;
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.15);
  --radius: 8px;
  --radius-sm: 5px;
  --radius-lg: 14px;
  --font: 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  --transition: 0.18s cubic-bezier(0.4, 0, 0.2, 1);
  --bounce: 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

[data-theme="dark-retro"] {
  --bg: #2c2418;
  --surface: #3a3022;
  --surface2: #463a2a;
  --border: #5f5040;
  --text: #e8dcc8;
  --text2: #a89878;
  --accent: #d4953a;
  --danger: #c04040;
  --safe: #6a9e4a;
  --blue: #5b8aaa;
  --cell-bg: #4e402e;
  --cell-hover: #5f503a;
  --cell-revealed: #30281c;
  --cell-revealed2: #282015;
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.5);
  --radius: 8px;
  --radius-sm: 5px;
  --radius-lg: 14px;
  --font: 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  --transition: 0.18s cubic-bezier(0.4, 0, 0.2, 1);
  --bounce: 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

[data-theme="light-retro"] {
  --bg: #f4ecd8;
  --surface: #faf5e8;
  --surface2: #efe6cf;
  --border: #c4b896;
  --text: #3d3226;
  --text2: #8b7d65;
  --accent: #c06014;
  --danger: #b03030;
  --safe: #4a8c3f;
  --blue: #3a6ba5;
  --cell-bg: #dbcfaa;
  --cell-hover: #cdbf94;
  --cell-revealed: #efe6cf;
  --cell-revealed2: #e6dcc3;
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.18);
  --radius: 8px;
  --radius-sm: 5px;
  --radius-lg: 14px;
  --font: 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  --transition: 0.18s cubic-bezier(0.4, 0, 0.2, 1);
  --bounce: 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

[data-theme="dark-lavender"] {
  --bg: #1c1a2e;
  --surface: #252238;
  --surface2: #2e2a44;
  --border: #3f3a5a;
  --text: #e0d8f0;
  --text2: #a098c4;
  --accent: #b39de0;
  --danger: #e05570;
  --safe: #68b878;
  --blue: #7b8fd0;
  --cell-bg: #363050;
  --cell-hover: #453e62;
  --cell-revealed: #222034;
  --cell-revealed2: #1c1a2c;
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.5);
  --radius: 8px;
  --radius-sm: 5px;
  --radius-lg: 14px;
  --font: 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  --transition: 0.18s cubic-bezier(0.4, 0, 0.2, 1);
  --bounce: 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

[data-theme="light-lavender"] {
  --bg: #ece8f5;
  --surface: #f6f3fc;
  --surface2: #eee8f8;
  --border: #d0c8e0;
  --text: #251e35;
  --text2: #6e6490;
  --accent: #7b5ec8;
  --danger: #d04060;
  --safe: #4a9840;
  --blue: #5b70b8;
  --cell-bg: #d4cbe5;
  --cell-hover: #c4bad8;
  --cell-revealed: #eee8f8;
  --cell-revealed2: #e2daf0;
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.15);
  --radius: 8px;
  --radius-sm: 5px;
  --radius-lg: 14px;
  --font: 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  --transition: 0.18s cubic-bezier(0.4, 0, 0.2, 1);
  --bounce: 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* ==================== 页面布局 ==================== */

.minesweeper-page {
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 16px 40px;
  -webkit-tap-highlight-color: transparent;
  -webkit-user-select: none;
  user-select: none;
  -webkit-touch-callout: none;
  touch-action: manipulation;
  overflow-y: auto;
  font-family: var(--font);
  background: var(--bg);
  background-attachment: fixed;
}

.particles-background {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.back-btn {
  position: fixed;
  top: 16px;
  left: 16px;
  z-index: 20;
  padding: 8px 18px;
  border-radius: 20px;
  border: 1.5px solid var(--border);
  background: var(--surface);
  color: var(--text);
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  font-family: var(--font);
  transition: all var(--transition);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
.back-btn:hover {
  background: var(--surface2);
  border-color: var(--accent);
  transform: translateY(-1px);
}

/* ==================== 通用重置 ==================== */

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* ==================== 主容器 ==================== */

.main-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  position: relative;
  z-index: 1;
}

/* ==================== 标题栏 ==================== */

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
}
.title-group {
  display: flex;
  align-items: center;
  gap: 10px;
}
.game-title {
  font-size: 2rem;
  font-weight: 900;
  letter-spacing: -1px;
  color: #fff;
  text-shadow: 0 0 20px var(--accent);
  display: flex;
  align-items: center;
  gap: 6px;
}
[data-theme="light"] .game-title {
  text-shadow: none;
  color: var(--text);
}
[data-theme^="light-"] .game-title {
  text-shadow: none;
  color: var(--text);
}
.game-title .icon {
  font-size: 1.8rem;
  animation: bombPulse 2s ease-in-out infinite;
  display: inline-block;
}
@keyframes bombPulse {
  0%, 100% { transform: scale(1) rotate(0deg); }
  25% { transform: scale(1.15) rotate(-3deg); }
  75% { transform: scale(1.08) rotate(2deg); }
}
.sound-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1.5px solid var(--border);
  background: var(--surface);
  color: var(--text);
  cursor: pointer;
  font-size: 1.1rem;
  transition: all var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
}
.sound-btn:hover {
  background: var(--surface2);
  border-color: #555;
}
.sound-btn.muted {
  opacity: 0.5;
  border-color: var(--danger);
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* ==================== 难度选择 ==================== */

.difficulty-bar {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  align-items: center;
}
.diff-btn {
  padding: 9px 16px;
  border-radius: 20px;
  border: 1.5px solid var(--border);
  background: var(--surface);
  color: var(--text2);
  cursor: pointer;
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all var(--transition);
  white-space: nowrap;
  font-family: var(--font);
}
.diff-btn:hover {
  background: var(--surface2);
  color: #fff;
  border-color: #555;
}
.diff-btn.active {
  background: var(--accent);
  border-color: var(--accent);
  color: #1a1d23;
  font-weight: 700;
  box-shadow: 0 0 16px var(--accent);
}
.diff-btn.custom-active {
  background: #6c5ce7;
  border-color: #6c5ce7;
  color: #fff;
  box-shadow: 0 0 16px rgba(108, 92, 231, 0.4);
}

/* ==================== 自定义设置面板 ==================== */

.settings-panel {
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 16px 18px;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: flex-end;
  animation: slideDown 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: var(--shadow-lg);
}
.settings-panel.hidden {
  display: none;
}
@keyframes slideDown {
  from { opacity: 0; transform: translateY(-18px); max-height: 0; }
  to { opacity: 1; transform: translateY(0); max-height: 300px; }
}
.setting-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex: 1;
  min-width: 100px;
}
.setting-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--text2);
  font-weight: 700;
}
.setting-value {
  font-size: 0.85rem;
  color: #fff;
  font-weight: 700;
  background: var(--surface2);
  padding: 3px 10px;
  border-radius: 10px;
  display: inline-block;
  align-self: flex-start;
}
.setting-group input[type="range"] {
  -webkit-appearance: none;
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: var(--border);
  outline: none;
  cursor: pointer;
}
.setting-group input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--accent);
  cursor: pointer;
  border: 3px solid #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: transform 0.15s;
}
.setting-group input[type="range"]::-webkit-slider-thumb:active {
  transform: scale(1.2);
}
.btn-apply {
  padding: 10px 22px;
  border-radius: 20px;
  border: none;
  background: #6c5ce7;
  color: #fff;
  cursor: pointer;
  font-weight: 700;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
  transition: all var(--transition);
  font-family: var(--font);
  white-space: nowrap;
}
.btn-apply:hover {
  background: #7d6ff0;
  box-shadow: 0 4px 20px rgba(108, 92, 231, 0.4);
  transform: translateY(-1px);
}

/* ==================== 游戏面板 ==================== */

.board-wrapper {
  background: var(--surface);
  border: 2px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 14px;
  box-shadow: var(--shadow-lg);
  position: relative;
  display: inline-block;
}

/* ==================== 状态栏 ==================== */

.status-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  gap: 10px;
  flex-wrap: wrap;
}
.counter-box {
  background: #1a1d23;
  border: 2px solid var(--border);
  border-radius: var(--radius);
  padding: 8px 14px;
  font-family: 'Courier New', 'SF Mono', monospace;
  font-size: 1.3rem;
  font-weight: 900;
  color: #f04040;
  letter-spacing: 2px;
  min-width: 55px;
  text-align: center;
  transition: all var(--transition);
}
.counter-box.warning {
  animation: counterBlink 0.5s ease-in-out 3;
  color: #ff6b6b;
}
@keyframes counterBlink {
  0%, 100% { background: #1a1d23; }
  50% { background: #3a1515; border-color: #f04040; }
}
.face-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid var(--border);
  background: var(--surface2);
  cursor: pointer;
  font-size: 1.6rem;
  transition: all var(--bounce);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow);
}
.face-btn:hover {
  transform: scale(1.08);
  border-color: #555;
}
.face-btn:active {
  transform: scale(0.9);
}
.face-btn.surprised {
  animation: faceShake 0.3s ease-in-out;
  border-color: #f0a040;
}
.face-btn.lost {
  border-color: #e05555;
  box-shadow: 0 0 20px rgba(224, 85, 85, 0.4);
  animation: faceFall 0.5s ease-in-out;
}
.face-btn.won {
  border-color: #5cb878;
  box-shadow: 0 0 20px rgba(92, 184, 120, 0.4);
  animation: faceWin 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes faceShake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}
@keyframes faceFall {
  0% { transform: translateY(0); }
  30% { transform: translateY(-10px); }
  60% { transform: translateY(4px); }
  100% { transform: translateY(0); }
}
@keyframes faceWin {
  0% { transform: scale(1); }
  40% { transform: scale(1.25) rotate(5deg); }
  70% { transform: scale(0.92) rotate(-2deg); }
  100% { transform: scale(1) rotate(0); }
}
.timer-box {
  background: #1a1d23;
  border: 2px solid var(--border);
  border-radius: var(--radius);
  padding: 8px 14px;
  font-family: 'Courier New', 'SF Mono', monospace;
  font-size: 1.3rem;
  font-weight: 900;
  color: #e0e0e0;
  letter-spacing: 2px;
  min-width: 65px;
  text-align: center;
}

/* ==================== 网格 ==================== */

.grid-container {
  position: relative;
  display: inline-block;
  border-radius: var(--radius);
  box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.3);
}
.mine-grid {
  display: inline-grid;
  gap: 2px;
  background: #1a1d23;
  padding: 3px;
  border-radius: var(--radius);
  user-select: none;
  -webkit-user-select: none;
}
.cell {
  width: 16px;
  height: 16px;
  background: var(--cell-bg);
  border-radius: 3px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: clamp(0.65rem, 1.4vw, 0.95rem);
  transition: background 0.08s, transform 0.1s;
  position: relative;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04), 0 1px 2px rgba(0, 0, 0, 0.2);
}
.cell:hover:not(.revealed):not(.game-over-cell) {
  background: var(--cell-hover);
  transform: translateY(-1px);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 3px 6px rgba(0, 0, 0, 0.3);
}
.cell:active:not(.revealed):not(.game-over-cell) {
  transform: scale(0.9);
  transition: transform 0.06s;
}
.cell.revealed {
  background: var(--cell-revealed);
  cursor: default;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
  animation: revealPop calc(0.12s / var(--speed, 2)) cubic-bezier(0.34, 1.2, 0.64, 1);
}
.cell.revealed.even {
  background: var(--cell-revealed2);
}
@keyframes revealPop {
  0% { transform: scale(0.7); opacity: 0.4; }
  60% { transform: scale(1.06); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}
.cell.flagged {
  animation: flagBounce calc(0.6s / var(--speed, 2)) cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes flagBounce {
  0% { transform: scale(0.5) rotate(-20deg); }
  60% { transform: scale(1.2) rotate(5deg); }
  100% { transform: scale(1) rotate(0); }
}
.cell.mine-hit {
  background: #e05555 !important;
  animation: mineExplode calc(1s / var(--speed, 2)) ease-out;
  z-index: 5;
  box-shadow: 0 0 30px rgba(224, 85, 85, 0.7) !important;
}
@keyframes mineExplode {
  0% { transform: scale(1); background: #ff4444; }
  25% { transform: scale(1.3); background: #ff6666; }
  50% { transform: scale(0.85); background: #cc3333; }
  100% { transform: scale(1); background: #e05555; }
}
.cell.wrong-flag {
  animation: wrongFlag calc(1s / var(--speed, 2)) ease-in-out;
  background: #ffcccc !important;
}
@keyframes wrongFlag {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-5px); }
  40% { transform: translateX(5px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(3px); }
}
.cell.ripple-reveal {
  animation: rippleReveal calc(0.36s / var(--speed, 2)) cubic-bezier(0.34, 1.3, 0.64, 1);
}
@keyframes rippleReveal {
  0% { transform: scale(0.6); opacity: 0.3; border-radius: 50%; }
  70% { transform: scale(1.05); opacity: 1; border-radius: 3px; }
  100% { transform: scale(1); opacity: 1; border-radius: 3px; }
}

/* 数字颜色 */
.cell.num-1 { color: #5b9bd5; }
.cell.num-2 { color: #5cb878; }
.cell.num-3 { color: #e05555; }
.cell.num-4 { color: #7b6fdf; }
.cell.num-5 { color: #c0504a; }
.cell.num-6 { color: #4aa0b5; }
.cell.num-7 { color: #555; }
.cell.num-8 { color: #888; }

/* ==================== Canvas粒子层 ==================== */

#particleCanvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
  border-radius: var(--radius);
}

/* ==================== 统计栏 ==================== */

.stats-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
  font-size: 0.75rem;
  color: var(--text2);
  letter-spacing: 0.5px;
}
.stat-badge {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 5px 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 5px;
}
.stat-badge span {
  color: #fff;
  font-weight: 700;
}

/* ==================== 设置弹窗 ==================== */

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  animation: fadeIn 0.2s ease-out;
}
.modal-overlay.hidden {
  display: none;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.modal-content {
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  width: 95%;
  max-width: 460px;
  animation: modalSlideIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes modalSlideIn {
  from { transform: translateY(30px) scale(0.95); opacity: 0; }
  to { transform: translateY(0) scale(1); opacity: 1; }
}
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px 0;
}
.modal-title {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--text);
}
.modal-close {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1.5px solid var(--border);
  background: var(--surface2);
  color: var(--text);
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition);
}
.modal-close:hover {
  background: var(--danger);
  border-color: var(--danger);
  color: #fff;
}
.modal-body {
  padding: 16px 20px 20px;
}
.modal-setting {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.modal-setting-label {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text);
}
.modal-speed-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.speed-tag {
  font-size: 0.7rem;
  color: var(--text2);
  font-weight: 600;
  min-width: 18px;
}
.modal-speed-row input[type="range"] {
  -webkit-appearance: none;
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: var(--border);
  outline: none;
  cursor: pointer;
  transition: background 0.2s;
}
.modal-speed-row input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--accent);
  cursor: pointer;
  border: 3px solid #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: transform 0.15s, box-shadow 0.15s;
}
.modal-speed-row input[type="range"]::-webkit-slider-thumb:active {
  transform: scale(1.15);
  box-shadow: 0 0 16px rgba(240, 160, 64, 0.5);
}
.modal-divider {
  height: 1px;
  background: var(--border);
  margin: 16px 0;
}
.theme-toggle {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
}
.theme-toggle.base-row {
  grid-template-columns: repeat(2, 1fr);
}
.theme-btn {
  padding: 10px 6px;
  border-radius: 10px;
  border: 1.5px solid var(--border);
  background: var(--surface2);
  color: var(--text2);
  cursor: pointer;
  font-size: 0.78rem;
  font-weight: 600;
  text-align: center;
  transition: all var(--transition);
  white-space: nowrap;
}
.theme-btn:hover {
  border-color: var(--accent);
  color: var(--text);
  transform: translateY(-2px);
}
.theme-btn.active {
  background: var(--accent);
  border-color: var(--accent);
  color: #1a1d23;
  box-shadow: 0 0 12px var(--accent);
  font-weight: 700;
}

/* ==================== 响应式 ==================== */

@media (max-width: 500px) {
  .game-title {
    font-size: 1.4rem;
  }
  .diff-btn {
    padding: 7px 11px;
    font-size: 0.7rem;
  }
  .settings-panel {
    padding: 10px 12px;
    gap: 10px;
  }
  .board-wrapper {
    padding: 8px;
  }
  .counter-box,
  .timer-box {
    font-size: 1rem;
    padding: 6px 10px;
    min-width: 40px;
  }
  .face-btn {
    width: 38px;
    height: 38px;
    font-size: 1.3rem;
  }
  .cell {
    width: 16px;
    height: 16px;
    font-size: clamp(0.45rem, 2vw, 0.7rem);
    border-radius: 1px;
  }
  .mine-grid {
    gap: 1px;
    padding: 2px;
  }
}
</style>
