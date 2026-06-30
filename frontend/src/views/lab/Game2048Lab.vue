<template>
  <canvas class="particles-background" />
  <div class="game2048-page">
    <div
      id="gameWrapper"
      class="game-wrapper"
    >
      <div class="header">
        <div class="title-block">
          <span class="game-title">2048</span>
          <span class="title-badge">PRO</span>
        </div>
        <div class="scores-row">
          <div
            id="scoreBox"
            class="score-box"
          >
            <div class="score-label">
              {{ t('分数') }}
            </div>
            <div
              id="scoreDisplay"
              class="score-value"
            >
              0
            </div>
          </div>
          <div
            id="bestScoreBox"
            class="score-box best-score"
          >
            <div class="score-label">
              {{ t('最佳') }}
            </div>
            <div
              id="bestScoreDisplay"
              class="score-value"
            >
              0
            </div>
          </div>
        </div>
      </div>

      <div
        id="boardContainer"
        class="board-container"
      >
        <div
          id="gameGrid"
          class="game-grid"
        />
        <div
          id="tilesLayer"
          class="tiles-layer"
        />
        <canvas id="particleCanvas" />
      </div>

      <div class="stats-row">
        <span class="stat-item">{{ t('移动') }} <span
          id="moveCount"
          class="stat-value"
        >0</span></span>
        <span class="stat-item">{{ t('合并') }} <span
          id="mergeCount"
          class="stat-value"
        >0</span></span>
        <span class="stat-item">{{ t('最大') }} <span
          id="maxTile"
          class="stat-value"
        >0</span></span>
        <span class="stat-item">{{ t('连击') }} <span
          id="comboCount"
          class="stat-value"
        >0</span></span>
      </div>

      <div class="controls-row">
        <button
          id="btnUndo"
          class="btn"
          disabled
          :title="t('撤销上一步')"
        >
          <span class="icon">&#x21A9;</span> {{ t('撤销') }}
        </button>
        <button
          id="btnRestart"
          class="btn accent"
        >
          <span class="icon">&#x21BB;</span> {{ t('新游戏') }}
        </button>
      </div>

      <div style="text-align:center;margin-top:4px;">
        <span style="font-size:0.7rem;color:rgba(255,255,255,0.35);letter-spacing:1px;">
          {{ t('↑↓←→ 或滑动操作') }}
        </span>
      </div>
    </div>
    <button
      class="back-btn"
      @click="$router.push('/lab')"
    >
      &#x2190; {{ t('返回实验室') }}
    </button>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { useI18n } from '../../composables/useI18n.js';
import { useParticles } from '../../composables/useParticles.js';

const { t } = useI18n();
useParticles('.particles-background');

// ==================== 音效系统 ====================
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      audioCtx = null;
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playBeep(freq, duration, type = 'sine', vol = 0.06, glideTo = null) {
  if (!audioCtx) return;
  try {
    const t0 = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (glideTo) {
      osc.frequency.linearRampToValueAtTime(glideTo, t0 + duration);
    }
    gain.gain.setValueAtTime(vol, t0);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(t0);
    osc.stop(t0 + duration);
  } catch (e) { /* ignore */ }
}

function sfxMove() {
  playBeep(280, 0.08, 'sine', 0.04);
}

function sfxMerge(value) {
  const baseFreq = 300 + Math.log2(value) * 60;
  playBeep(baseFreq, 0.15, 'triangle', 0.08, baseFreq * 1.6);
  if (value >= 128) {
    setTimeout(() => playBeep(baseFreq * 1.5, 0.12, 'triangle', 0.06), 60);
  }
  if (value >= 1024) {
    setTimeout(() => playBeep(baseFreq * 2, 0.1, 'sine', 0.05), 100);
  }
}

function sfxVictory() {
  [400, 500, 600, 800, 1000].forEach((f, i) => {
    setTimeout(() => playBeep(f, 0.2, 'triangle', 0.1), i * 80);
  });
}

function sfxGameOver() {
  [300, 200, 150, 100].forEach((f, i) => {
    setTimeout(() => playBeep(f, 0.25, 'sawtooth', 0.05), i * 100);
  });
}

// ==================== 游戏状态 ====================
const SIZE = 4;
let tileIdCounter = 0;
let grid = [];
let score = 0;
let bestScore = 0;
let moveCount = 0;
let mergeCount = 0;
let maxTile = 0;
let comboCount = 0;
let maxCombo = 0;
let gameOver = false;
let gameWon = false;
let keepPlaying = false;
let previousState = null;

// 动画数据
let slideMoves = [];
let consumedMerges = [];
let mergedPositions = [];
let newTilePosition = null;
let maxMergeValueThisRound = 0;
let oldGridSnapshot = null;

// 粒子系统
let particles = [];
let particleAnimationId = null;

// DOM 元素引用
let gameGrid, tilesLayer, particleCanvas, boardContainer;
let scoreDisplay, bestScoreDisplay, scoreBox, bestScoreBox;
let moveCountEl, mergeCountEl, maxTileEl, comboCountEl;
let btnUndo, btnRestart;
let ctx;

// ==================== 初始化 ====================
function createGridCells() {
  gameGrid.innerHTML = '';
  tilesLayer.innerHTML = '';
  for (let i = 0; i < SIZE * SIZE; i++) {
    const cell = document.createElement('div');
    cell.className = 'grid-cell';
    cell.dataset.index = i;
    gameGrid.appendChild(cell);

    const slot = document.createElement('div');
    slot.className = 'tile-slot';
    slot.dataset.index = i;
    slot.dataset.row = Math.floor(i / SIZE);
    slot.dataset.col = i % SIZE;
    tilesLayer.appendChild(slot);
  }
}

function nextTileId() {
  return ++tileIdCounter;
}

function createTile(value) {
  return { id: nextTileId(), value };
}

function cloneTile(tile) {
  if (!tile) return null;
  return { id: tile.id, value: tile.value };
}

function cloneGrid(g) {
  return g.map(row => row.map(cell => cloneTile(cell)));
}

function initGame() {
  grid = Array.from({ length: SIZE }, () => Array(SIZE).fill(null));
  tileIdCounter = 0;
  score = 0;
  moveCount = 0;
  mergeCount = 0;
  maxTile = 0;
  comboCount = 0;
  maxCombo = 0;
  gameOver = false;
  gameWon = false;
  keepPlaying = false;
  previousState = null;
  slideMoves = [];
  consumedMerges = [];
  mergedPositions = [];
  newTilePosition = null;
  maxMergeValueThisRound = 0;
  oldGridSnapshot = null;
  loadBestScore();
  updateScoreDisplay();
  updateStatsDisplay();
  btnUndo.disabled = true;
  removeOverlay();
  spawnTile(true);
  spawnTile(true);
  renderTilesInstant();
  clearParticles();
}

// ==================== localStorage ====================
function loadBestScore() {
  try {
    const saved = localStorage.getItem('2048_bestScore_v3');
    bestScore = saved ? parseInt(saved, 10) : 0;
    if (isNaN(bestScore)) bestScore = 0;
  } catch (e) {
    bestScore = 0;
  }
  bestScoreDisplay.textContent = bestScore;
}

function saveBestScore() {
  if (score > bestScore) {
    bestScore = score;
    bestScoreDisplay.textContent = bestScore;
    try {
      localStorage.setItem('2048_bestScore_v3', bestScore.toString());
    } catch (e) { /* ignore */ }
  }
}

// ==================== 显示更新 ====================
function updateScoreDisplay() {
  scoreDisplay.textContent = score;
  if (score > bestScore) {
    saveBestScore();
  }
}

function updateStatsDisplay() {
  moveCountEl.textContent = moveCount;
  mergeCountEl.textContent = mergeCount;
  maxTileEl.textContent = maxTile;
  comboCountEl.textContent = maxCombo;
}

function bumpScoreBox() {
  scoreBox.classList.add('bump');
  setTimeout(() => scoreBox.classList.remove('bump'), 250);
}

// ==================== 方块生成 ====================
function getEmptyCells() {
  const empty = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c] === null) empty.push({ r, c });
    }
  }
  return empty;
}

function spawnTile(isInitial = false) {
  const empty = getEmptyCells();
  if (empty.length === 0) return null;
  const idx = Math.floor(Math.random() * empty.length);
  const { r, c } = empty[idx];
  const value = Math.random() < 0.9 ? 2 : 4;
  const tile = createTile(value);
  grid[r][c] = tile;
  if (!isInitial) {
    newTilePosition = { r, c };
  }
  if (value > maxTile) {
    maxTile = value;
  }
  return { r, c, tile };
}

// ==================== 移动逻辑 ====================
function compressRow(row) {
  const filtered = row.filter(t => t !== null);
  while (filtered.length < SIZE) filtered.push(null);
  return filtered;
}

function mergeRow(row) {
  const merged = [];
  const mergeFlags = [];
  const sourceMap = [];
  let scoreGain = 0;
  let mergesInRow = 0;
  let i = 0;
  while (i < row.length) {
    if (i < row.length - 1 && row[i] !== null && row[i + 1] !== null && row[i].value === row[i + 1].value) {
      const newTile = createTile(row[i].value * 2);
      merged.push(newTile);
      mergeFlags.push(true);
      sourceMap.push([i, i + 1]);
      scoreGain += newTile.value;
      mergesInRow++;
      if (newTile.value > maxTile) maxTile = newTile.value;
      if (newTile.value > maxMergeValueThisRound) maxMergeValueThisRound = newTile.value;
      i += 2;
    } else {
      merged.push(row[i]);
      mergeFlags.push(false);
      sourceMap.push(row[i] !== null ? [i] : null);
      i += 1;
    }
  }
  while (merged.length < SIZE) {
    merged.push(null);
    mergeFlags.push(false);
    sourceMap.push(null);
  }
  return { merged, mergeFlags, sourceMap, scoreGain, mergesInRow };
}

function processLine(row) {
  const compressed = compressRow(row);
  const result = mergeRow(compressed);
  const finalRow = compressRow(result.merged);

  const finalSourceMap = [];
  const tempMerged = result.merged;
  const tempSourceMap = result.sourceMap;
  const tempMergeFlags = result.mergeFlags;

  const tempToFinalIndex = [];
  let fi = 0;
  for (let ti = 0; ti < tempMerged.length; ti++) {
    if (tempMerged[ti] !== null) {
      while (fi < finalRow.length && finalRow[fi] === null) fi++;
      if (fi < finalRow.length) {
        tempToFinalIndex[ti] = fi;
        fi++;
      } else {
        tempToFinalIndex[ti] = -1;
      }
    } else {
      tempToFinalIndex[ti] = -1;
    }
  }

  for (let i = 0; i < finalRow.length; i++) {
    finalSourceMap.push(null);
  }

  for (let ti = 0; ti < tempMerged.length; ti++) {
    if (tempMerged[ti] !== null && tempToFinalIndex[ti] >= 0) {
      finalSourceMap[tempToFinalIndex[ti]] = tempSourceMap[ti];
    }
  }

  const finalMergeFlags = Array(SIZE).fill(false);
  for (let ti = 0; ti < tempMerged.length; ti++) {
    if (tempMerged[ti] !== null && tempToFinalIndex[ti] >= 0 && tempMergeFlags[ti]) {
      finalMergeFlags[tempToFinalIndex[ti]] = true;
    }
  }

  return {
    row: finalRow,
    mergeFlags: finalMergeFlags,
    sourceMap: finalSourceMap,
    scoreGain: result.scoreGain,
    mergesInRow: result.mergesInRow,
  };
}

function rotateGridCW(g) {
  const n = g.length;
  const rotated = Array.from({ length: n }, () => Array(n).fill(null));
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      rotated[c][n - 1 - r] = g[r][c];
    }
  }
  return rotated;
}

function rotateGridCCW(g) {
  const n = g.length;
  const rotated = Array.from({ length: n }, () => Array(n).fill(null));
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      rotated[n - 1 - c][r] = g[r][c];
    }
  }
  return rotated;
}

function moveGrid(direction) {
  let workingGrid = grid.map(row => [...row]);
  let rotations = 0;
  let reverseRows = false;

  switch (direction) {
    case 'left':
      rotations = 0;
      reverseRows = false;
      break;
    case 'right':
      rotations = 0;
      reverseRows = true;
      break;
    case 'up':
      rotations = 1;
      reverseRows = false;
      break;
    case 'down':
      rotations = 1;
      reverseRows = true;
      break;
  }

  if (rotations === 1) {
    workingGrid = rotateGridCCW(workingGrid);
  }
  if (reverseRows) {
    workingGrid = workingGrid.map(row => [...row].reverse());
  }

  const newRows = [];
  const allMergeFlags = [];
  const allSourceMaps = [];
  let totalScoreGain = 0;
  let totalMerges = 0;

  for (let r = 0; r < SIZE; r++) {
    const result = processLine(workingGrid[r]);
    newRows.push(result.row);
    allMergeFlags.push(result.mergeFlags);
    allSourceMaps.push(result.sourceMap);
    totalScoreGain += result.scoreGain;
    totalMerges += result.mergesInRow;
  }

  workingGrid = newRows;

  if (reverseRows) {
    workingGrid = workingGrid.map(row => [...row].reverse());
    for (let r = 0; r < SIZE; r++) {
      allMergeFlags[r] = allMergeFlags[r].reverse();
      allSourceMaps[r] = allSourceMaps[r].reverse();
    }
  }

  if (rotations === 1) {
    workingGrid = rotateGridCW(workingGrid);
    const rotatedFlags = Array.from({ length: SIZE }, () => Array(SIZE).fill(false));
    const rotatedSourceMaps = Array.from({ length: SIZE }, () => Array(SIZE).fill(null));
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        const [nr, nc] = [c, SIZE - 1 - r];
        rotatedFlags[nr][nc] = allMergeFlags[r][c];
        rotatedSourceMaps[nr][nc] = allSourceMaps[r][c];
      }
    }
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        allMergeFlags[r][c] = rotatedFlags[r][c];
        allSourceMaps[r][c] = rotatedSourceMaps[r][c];
      }
    }
  }

  return {
    newGrid: workingGrid,
    mergeFlags: allMergeFlags,
    sourceMaps: allSourceMaps,
    scoreGain: totalScoreGain,
    mergeCount: totalMerges,
  };
}

function gridsEqual(g1, g2) {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const id1 = g1[r][c]?.id ?? null;
      const id2 = g2[r][c]?.id ?? null;
      if (id1 !== id2) return false;
    }
  }
  return true;
}

function executeMove(direction) {
  if (gameOver) return;
  if (gameWon && !keepPlaying) return;

  oldGridSnapshot = cloneGrid(grid);

  previousState = {
    grid: cloneGrid(grid),
    score,
    moveCount,
    mergeCount,
    maxTile,
    comboCount,
    maxCombo,
    tileIdCounter,
  };

  const result = moveGrid(direction);
  const { newGrid, mergeFlags, sourceMaps, scoreGain, mergeCount: mergesThisRound } = result;

  if (gridsEqual(grid, newGrid)) {
    previousState = null;
    oldGridSnapshot = null;
    return;
  }

  slideMoves = [];
  consumedMerges = [];
  mergedPositions = [];
  maxMergeValueThisRound = 0;

  // 通过 tile ID 比较新旧 grid 构建动画数据
  const oldPosMap = {};
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const t = oldGridSnapshot[r][c];
      if (t) {
        oldPosMap[t.id] = { r, c, tile: t };
      }
    }
  }

  const newPosMap = {};
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const t = newGrid[r][c];
      if (t) {
        newPosMap[t.id] = { r, c, tile: t };
        // Check if this position has a merge flag — track merged values
        if (mergeFlags[r][c]) {
          mergedPositions.push({ r, c, value: t.value });
          if (t.value > maxMergeValueThisRound) {
            maxMergeValueThisRound = t.value;
          }
        }
      }
    }
  }

  // 找出移动的 tile
  for (const id in newPosMap) {
    const newPos = newPosMap[id];
    const oldPos = oldPosMap[id];
    if (oldPos && (oldPos.r !== newPos.r || oldPos.c !== newPos.c)) {
      slideMoves.push({
        fromR: oldPos.r,
        fromC: oldPos.c,
        toR: newPos.r,
        toC: newPos.c,
        tile: newPos.tile,
      });
    }
  }

  // 找出被消耗的 tile
  for (const id in oldPosMap) {
    if (!(id in newPosMap)) {
      const oldPos = oldPosMap[id];
      let bestTarget = null;
      let bestDist = Infinity;
      for (const mp of mergedPositions) {
        const dist = Math.abs(mp.r - oldPos.r) + Math.abs(mp.c - oldPos.c);
        if (dist < bestDist) {
          bestDist = dist;
          bestTarget = { r: mp.r, c: mp.c };
        }
      }
      if (bestTarget && bestDist <= 3) {
        consumedMerges.push({
          fromR: oldPos.r,
          fromC: oldPos.c,
          toR: bestTarget.r,
          toC: bestTarget.c,
          tile: oldPos.tile,
        });
      }
    }
  }

  grid = newGrid;
  newTilePosition = null;
  oldGridSnapshot = null;

  // 连击计算
  if (mergesThisRound >= 2) {
    comboCount++;
    if (comboCount > maxCombo) maxCombo = comboCount;
  } else {
    comboCount = 0;
  }

  // 计分（连击加成）
  let finalScoreGain = scoreGain;
  if (mergesThisRound >= 3) {
    finalScoreGain = Math.floor(scoreGain * 2);
  } else if (mergesThisRound >= 2) {
    finalScoreGain = Math.floor(scoreGain * 1.5);
  }
  score += finalScoreGain;
  mergeCount += mergesThisRound;
  moveCount++;

  spawnTile();

  updateScoreDisplay();
  updateStatsDisplay();
  bumpScoreBox();
  btnUndo.disabled = false;

  renderTilesAnimated();

  // 粒子特效
  if (mergedPositions.length > 0) {
    spawnMergeParticles();
  }
  if (maxMergeValueThisRound >= 128) {
    spawnBurstParticles(maxMergeValueThisRound);
  }

  // 音效
  if (mergesThisRound > 0) {
    sfxMerge(Math.max(...mergedPositions.map(p => p.value), 2));
  } else {
    sfxMove();
  }

  // 检测胜利
  if (!gameWon && !keepPlaying) {
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (grid[r][c] && grid[r][c].value >= 2048) {
          gameWon = true;
          showVictoryOverlay();
          sfxVictory();
          return;
        }
      }
    }
  }

  // 检测游戏结束
  if (isGameOver()) {
    gameOver = true;
    setTimeout(() => {
      showGameOverOverlay();
      sfxGameOver();
    }, 400);
  }

  saveBestScore();
}

function isGameOver() {
  if (getEmptyCells().length > 0) return false;
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const val = grid[r][c]?.value || 0;
      if (c < SIZE - 1 && (grid[r][c + 1]?.value || 0) === val) return false;
      if (r < SIZE - 1 && (grid[r + 1][c]?.value || 0) === val) return false;
    }
  }
  return true;
}

// ==================== 撤销 ====================
function undo() {
  if (!previousState || gameOver) return;
  grid = previousState.grid.map(row => row.map(cell => cloneTile(cell)));
  score = previousState.score;
  moveCount = previousState.moveCount;
  mergeCount = previousState.mergeCount;
  maxTile = previousState.maxTile;
  comboCount = previousState.comboCount;
  maxCombo = previousState.maxCombo;
  tileIdCounter = previousState.tileIdCounter;
  previousState = null;
  slideMoves = [];
  consumedMerges = [];
  mergedPositions = [];
  newTilePosition = null;
  maxMergeValueThisRound = 0;
  oldGridSnapshot = null;
  gameOver = false;
  gameWon = false;
  keepPlaying = false;
  updateScoreDisplay();
  updateStatsDisplay();
  btnUndo.disabled = true;
  removeOverlay();
  renderTilesInstant();
  clearParticles();
  saveBestScore();
  playBeep(220, 0.1, 'sine', 0.04);
}

// ==================== 渲染 ====================
function getTileColor(value) {
  const colors = {
    0: { bg: 'transparent', text: 'transparent', shadow: 'none', fontSize: '1.6rem' },
    2: { bg: '#eee4da', text: '#776e65', shadow: '0 2px 8px rgba(0,0,0,0.08)', fontSize: '1.6rem' },
    4: { bg: '#ede0c8', text: '#776e65', shadow: '0 2px 8px rgba(0,0,0,0.08)', fontSize: '1.6rem' },
    8: { bg: '#f2b179', text: '#f9f6f2', shadow: '0 3px 10px rgba(242,177,121,0.35)', fontSize: '1.6rem' },
    16: { bg: '#f59563', text: '#f9f6f2', shadow: '0 3px 12px rgba(245,149,99,0.4)', fontSize: '1.5rem' },
    32: { bg: '#f67c5f', text: '#f9f6f2', shadow: '0 4px 14px rgba(246,124,95,0.45)', fontSize: '1.5rem' },
    64: { bg: '#f65e3b', text: '#f9f6f2', shadow: '0 4px 16px rgba(246,94,59,0.5)', fontSize: '1.5rem' },
    128: { bg: '#edcf72', text: '#f9f6f2', shadow: '0 5px 18px rgba(237,207,114,0.55), 0 0 30px rgba(237,207,114,0.2)', fontSize: '1.35rem' },
    256: { bg: '#edcc61', text: '#f9f6f2', shadow: '0 5px 20px rgba(237,204,97,0.6), 0 0 35px rgba(237,204,97,0.25)', fontSize: '1.35rem' },
    512: { bg: '#edc850', text: '#f9f6f2', shadow: '0 6px 22px rgba(237,200,80,0.65), 0 0 40px rgba(237,200,80,0.3)', fontSize: '1.35rem' },
    1024: { bg: '#edc53f', text: '#f9f6f2', shadow: '0 6px 24px rgba(237,197,63,0.7), 0 0 50px rgba(237,197,63,0.35)', fontSize: '1.1rem' },
    2048: { bg: '#edc22e', text: '#f9f6f2', shadow: '0 7px 28px rgba(237,194,46,0.75), 0 0 60px rgba(237,194,46,0.4)', fontSize: '1.1rem' },
    4096: { bg: '#a67cbf', text: '#f9f6f2', shadow: '0 7px 30px rgba(166,124,191,0.7), 0 0 55px rgba(166,124,191,0.35)', fontSize: '1rem' },
    8192: { bg: '#7c5cbf', text: '#f9f6f2', shadow: '0 8px 32px rgba(124,92,191,0.75), 0 0 65px rgba(124,92,191,0.4)', fontSize: '1rem' },
    16384: { bg: '#5c3caf', text: '#f9f6f2', shadow: '0 8px 34px rgba(92,60,175,0.8), 0 0 70px rgba(92,60,175,0.45)', fontSize: '0.85rem' },
  };
  return colors[value] || {
    bg: '#3c1a8f',
    text: '#f9f6f2',
    shadow: '0 8px 36px rgba(60,26,143,0.85), 0 0 75px rgba(60,26,143,0.5)',
    fontSize: '0.8rem',
  };
}

function getSlotElement(r, c) {
  const index = r * SIZE + c;
  return tilesLayer.querySelectorAll('.tile-slot')[index];
}

function clearAllTiles() {
  const slots = tilesLayer.querySelectorAll('.tile-slot');
  slots.forEach(slot => {
    slot.innerHTML = '';
  });
}

function createTileElement(tile, extraClasses = []) {
  const el = document.createElement('div');
  el.className = 'tile';
  extraClasses.forEach(cls => el.classList.add(cls));
  const colorInfo = getTileColor(tile.value);
  el.style.background = colorInfo.bg;
  el.style.color = colorInfo.text;
  el.style.boxShadow = colorInfo.shadow;
  el.style.fontSize = colorInfo.fontSize;
  el.textContent = tile.value;
  el.dataset.tileId = tile.id;
  el.dataset.tileValue = tile.value;
  return el;
}

function renderTilesInstant() {
  clearAllTiles();
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const tile = grid[r][c];
      if (!tile) continue;
      const slot = getSlotElement(r, c);
      const el = createTileElement(tile);
      el.style.transition = 'none';
      el.style.transform = 'translate(0, 0)';
      slot.appendChild(el);
    }
  }
  slideMoves = [];
  consumedMerges = [];
  newTilePosition = null;
}

function renderTilesAnimated() {
  clearAllTiles();

  const tileRenderInfo = [];

  const mergePosSet = new Set();
  for (const mp of mergedPositions) {
    mergePosSet.add(`${mp.r},${mp.c}`);
  }

  const newPosKey = newTilePosition ? `${newTilePosition.r},${newTilePosition.c}` : null;

  const slideTargetSet = new Set();
  for (const sm of slideMoves) {
    slideTargetSet.add(`${sm.toR},${sm.toC}`);
  }

  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const tile = grid[r][c];
      if (!tile) continue;
      const posKey = `${r},${c}`;

      let type = 'static';
      let fromR = r;
      let fromC = c;

      if (mergePosSet.has(posKey)) {
        type = 'merge';
      } else if (newPosKey === posKey) {
        type = 'new';
      } else if (slideTargetSet.has(posKey)) {
        const sm = slideMoves.find(s => s.toR === r && s.toC === c && s.tile.id === tile.id);
        if (sm) {
          type = 'slide';
          fromR = sm.fromR;
          fromC = sm.fromC;
        }
      }

      tileRenderInfo.push({ r, c, tile, type, fromR, fromC });
    }
  }

  const tileElMap = {};
  for (const info of tileRenderInfo) {
    const slot = getSlotElement(info.r, info.c);
    const extraClasses = [];
    if (info.type === 'merge') {
      extraClasses.push('merge-pop');
      if (info.tile.value >= 128) extraClasses.push('merge-glow');
      if (info.tile.value >= 2048) extraClasses.push('mega-glow');
    } else if (info.type === 'new') {
      extraClasses.push('pop-in');
    }
    const el = createTileElement(info.tile, extraClasses);
    el.style.transition = 'none';
    el.style.transform = 'translate(0, 0)';
    slot.appendChild(el);
    tileElMap[`${info.r},${info.c}`] = el;
  }

  // 渲染被消耗的 tile（临时动画元素）
  const consumedEls = [];
  for (const cm of consumedMerges) {
    const fromSlot = getSlotElement(cm.fromR, cm.fromC);
    const toSlot = getSlotElement(cm.toR, cm.toC);
    if (!fromSlot || !toSlot) continue;

    const el = createTileElement(cm.tile, ['consumed-slide']);
    el.style.transition = 'none';
    el.style.transform = 'translate(0, 0)';
    el.style.opacity = '1';
    el.style.zIndex = '6';
    fromSlot.appendChild(el);
    consumedEls.push({
      el,
      fromSlot,
      toSlot,
      fromR: cm.fromR,
      fromC: cm.fromC,
      toR: cm.toR,
      toC: cm.toC,
    });
  }

  const slotRects = {};
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const slot = getSlotElement(r, c);
      slotRects[`${r},${c}`] = slot.getBoundingClientRect();
    }
  }

  const slideEls = [];
  for (const info of tileRenderInfo) {
    if (info.type === 'slide') {
      const el = tileElMap[`${info.r},${info.c}`];
      if (!el) continue;
      const targetRect = slotRects[`${info.r},${info.c}`];
      const fromRect = slotRects[`${info.fromR},${info.fromC}`];
      if (!targetRect || !fromRect) continue;
      const offsetX = fromRect.left - targetRect.left;
      const offsetY = fromRect.top - targetRect.top;
      el.style.transition = 'none';
      el.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      el.style.zIndex = '8';
      el.classList.add('sliding');
      slideEls.push({ el, info });
    }
  }

  for (const ce of consumedEls) {
    const fromRect = slotRects[`${ce.fromR},${ce.fromC}`];
    const toRect = slotRects[`${ce.toR},${ce.toC}`];
    if (!fromRect || !toRect) continue;
    ce.el.style.transition = 'none';
    ce.el.style.transform = 'translate(0, 0)';
    ce.el.style.opacity = '1';
    ce.targetOffsetX = toRect.left - fromRect.left;
    ce.targetOffsetY = toRect.top - fromRect.top;
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      for (const se of slideEls) {
        se.el.style.transition =
          'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)';
        se.el.style.transform = 'translate(0, 0)';
      }

      for (const ce of consumedEls) {
        ce.el.style.transition =
          'transform 0.18s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.18s ease-in';
        ce.el.style.transform =
          `translate(${ce.targetOffsetX}px, ${ce.targetOffsetY}px)`;
        ce.el.style.opacity = '0';
      }

      setTimeout(() => {
        for (const se of slideEls) {
          se.el.style.transition = 'none';
          se.el.style.transform = 'translate(0, 0)';
          se.el.style.zIndex = '';
          se.el.classList.remove('sliding');
        }
        for (const info of tileRenderInfo) {
          if (info.type === 'merge') {
            const el = tileElMap[`${info.r},${info.c}`];
            if (el && info.tile.value < 2048) {
              setTimeout(() => {
                el.classList.remove('merge-glow');
              }, 500);
            }
          }
        }
      }, 160);

      setTimeout(() => {
        for (const ce of consumedEls) {
          if (ce.el.parentNode) {
            ce.el.parentNode.removeChild(ce.el);
          }
        }
      }, 200);

      setTimeout(() => {
        newTilePosition = null;
        slideMoves = [];
        consumedMerges = [];
      }, 350);
    });
  });
}

function renderTiles() {
  if (slideMoves.length > 0 || consumedMerges.length > 0 || mergedPositions.length > 0 || newTilePosition) {
    renderTilesAnimated();
  } else {
    renderTilesInstant();
  }
}

// ==================== 粒子系统（棋盘内） ====================
function resizeCanvas() {
  const rect = boardContainer.getBoundingClientRect();
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
  if (particleAnimationId) {
    cancelAnimationFrame(particleAnimationId);
    particleAnimationId = null;
  }
  const rect = boardContainer.getBoundingClientRect();
  ctx.clearRect(0, 0, rect.width, rect.height);
}

function spawnMergeParticles() {
  resizeCanvas();
  const boardRect = boardContainer.getBoundingClientRect();
  const boardW = boardRect.width;
  const padding = 14;
  const gap = 10;
  const cellSize = (boardW - padding * 2 - gap * 3) / 4;

  mergedPositions.forEach(({ r, c, value }) => {
    const cx = padding + c * (cellSize + gap) + cellSize / 2;
    const cy = padding + r * (cellSize + gap) + cellSize / 2;
    const count = Math.min(Math.floor(Math.log2(value)) * 6, 50);
    const colorInfo = getTileColor(value);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 80 + Math.random() * 200;
      const size = 2 + Math.random() * 5;
      particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0.5 + Math.random() * 0.7,
        maxLife: 0.5 + Math.random() * 0.7,
        size,
        color: colorInfo.bg,
        gravity: 120 + Math.random() * 80,
      });
    }
  });

  if (!particleAnimationId) {
    animateParticles();
  }
}

function spawnBurstParticles(value) {
  resizeCanvas();
  const boardRect = boardContainer.getBoundingClientRect();
  const boardW = boardRect.width;
  const boardH = boardRect.height;
  const cx = boardW / 2;
  const cy = boardH / 2;
  const count = Math.min(Math.floor(Math.log2(value)) * 15, 80);
  const colorInfo = getTileColor(value);
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 150 + Math.random() * 350;
    const size = 1.5 + Math.random() * 3;
    particles.push({
      x: cx,
      y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0.6 + Math.random() * 0.8,
      maxLife: 0.6 + Math.random() * 0.8,
      size,
      color: colorInfo.bg,
      gravity: 200 + Math.random() * 150,
    });
  }
  if (!particleAnimationId) {
    animateParticles();
  }
}

function animateParticles() {
  const boardRect = boardContainer.getBoundingClientRect();
  const boardW = boardRect.width;
  const boardH = boardRect.height;
  const dt = Math.min(0.05, 0.016);

  ctx.clearRect(0, 0, boardW, boardH);

  particles = particles.filter(p => {
    p.life -= dt;
    if (p.life <= 0) return false;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += p.gravity * dt;
    const alpha = p.life / p.maxLife;
    const size = p.size * alpha;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = size * 2;
    ctx.beginPath();
    ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    return true;
  });

  if (particles.length > 0) {
    particleAnimationId = requestAnimationFrame(animateParticles);
  } else {
    particleAnimationId = null;
    ctx.clearRect(0, 0, boardW, boardH);
  }
}

// ==================== 覆盖层 ====================
function removeOverlay() {
  const existing = boardContainer.querySelector('.overlay');
  if (existing) existing.remove();
}

function showVictoryOverlay() {
  removeOverlay();
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  overlay.innerHTML = `
    <div class="overlay-title win">${t('恭喜！')}</div>
    <div class="overlay-subtitle">${t('你达到了')} <strong>2048</strong>!</div>
    <button class="btn accent" id="btnKeepPlaying" style="flex:0 0 auto;padding:12px 28px;">
      ${t('继续挑战')}
    </button>
  `;
  boardContainer.appendChild(overlay);
  document.getElementById('btnKeepPlaying').addEventListener('click', () => {
    keepPlaying = true;
    gameWon = false;
    removeOverlay();
    playBeep(500, 0.15, 'sine', 0.06);
  });
}

function showGameOverOverlay() {
  removeOverlay();
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  overlay.innerHTML = `
    <div class="overlay-title">${t('游戏结束')}</div>
    <div class="overlay-subtitle">${t('最终得分：')}<strong>${score}</strong></div>
    <button class="btn accent" id="btnTryAgain" style="flex:0 0 auto;padding:12px 28px;">
      ${t('再来一局')}
    </button>
  `;
  boardContainer.appendChild(overlay);
  document.getElementById('btnTryAgain').addEventListener('click', () => {
    removeOverlay();
    initGame();
    playBeep(400, 0.15, 'sine', 0.06);
  });
}

// ==================== 输入处理 ====================
function handleDirection(direction) {
  initAudio();
  if (gameOver) return;
  if (gameWon && !keepPlaying) return;
  executeMove(direction);
}

function handleKeydown(e) {
  const keyMap = {
    'ArrowLeft': 'left',
    'ArrowRight': 'right',
    'ArrowUp': 'up',
    'ArrowDown': 'down',
    'a': 'left',
    'd': 'right',
    'w': 'up',
    's': 'down',
    'A': 'left',
    'D': 'right',
    'W': 'up',
    'S': 'down',
  };
  const dir = keyMap[e.key];
  if (dir) {
    e.preventDefault();
    handleDirection(dir);
  }
  if (e.key === 'z' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    undo();
  }
}

let touchStartX = 0;
let touchStartY = 0;
let touchStartTime = 0;
const SWIPE_THRESHOLD = 35;

function handleTouchStart(e) {
  if (e.target.closest('.overlay')) return;
  initAudio();
  const touch = e.touches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
  touchStartTime = Date.now();
}

function handleTouchEnd(e) {
  if (e.target.closest('.overlay')) return;
  const touch = e.changedTouches[0];
  const dx = touch.clientX - touchStartX;
  const dy = touch.clientY - touchStartY;
  const dt = Date.now() - touchStartTime;
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);

  if (Math.max(absDx, absDy) < SWIPE_THRESHOLD) return;
  if (dt > 800) return;

  if (absDx > absDy) {
    handleDirection(dx > 0 ? 'right' : 'left');
  } else {
    handleDirection(dy > 0 ? 'down' : 'up');
  }
}

let mouseDown = false;
let mouseStartX = 0;
let mouseStartY = 0;

function handleMouseDown(e) {
  if (e.target.closest('.overlay')) return;
  initAudio();
  mouseDown = true;
  mouseStartX = e.clientX;
  mouseStartY = e.clientY;
}

function handleMouseUp(e) {
  if (!mouseDown) return;
  mouseDown = false;
  const dx = e.clientX - mouseStartX;
  const dy = e.clientY - mouseStartY;
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);
  if (Math.max(absDx, absDy) < 25) return;
  if (absDx > absDy) {
    handleDirection(dx > 0 ? 'right' : 'left');
  } else {
    handleDirection(dy > 0 ? 'down' : 'up');
  }
}

function handleVisibilityChange() {
  if (document.visibilityState === 'visible' && audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

let resizeTimeout;

function handleResize() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    resizeCanvas();
    renderTilesInstant();
  }, 200);
}

function handleClickUndo() {
  initAudio();
  undo();
}

function handleClickRestart() {
  initAudio();
  if (score > 0 && !gameOver) {
    if (confirm(t('确定要开始新游戏吗？当前进度将会丢失。'))) {
      initGame();
      playBeep(350, 0.12, 'sine', 0.05);
    }
  } else {
    initGame();
    playBeep(350, 0.12, 'sine', 0.05);
  }
}

// ==================== 启动 ====================
function boot() {
  createGridCells();
  loadBestScore();
  initGame();
  resizeCanvas();
  clearParticles();
}

onMounted(() => {
  // 获取 DOM 引用
  gameGrid = document.getElementById('gameGrid');
  tilesLayer = document.getElementById('tilesLayer');
  particleCanvas = document.getElementById('particleCanvas');
  boardContainer = document.getElementById('boardContainer');
  scoreDisplay = document.getElementById('scoreDisplay');
  bestScoreDisplay = document.getElementById('bestScoreDisplay');
  scoreBox = document.getElementById('scoreBox');
  bestScoreBox = document.getElementById('bestScoreBox');
  moveCountEl = document.getElementById('moveCount');
  mergeCountEl = document.getElementById('mergeCount');
  maxTileEl = document.getElementById('maxTile');
  comboCountEl = document.getElementById('comboCount');
  btnUndo = document.getElementById('btnUndo');
  btnRestart = document.getElementById('btnRestart');
  ctx = particleCanvas.getContext('2d');

  // 注册事件
  document.addEventListener('keydown', handleKeydown);
  boardContainer.addEventListener('touchstart', handleTouchStart, { passive: false });
  boardContainer.addEventListener('touchend', handleTouchEnd);
  boardContainer.addEventListener('mousedown', handleMouseDown);
  document.addEventListener('mouseup', handleMouseUp);
  document.addEventListener('visibilitychange', handleVisibilityChange);
  window.addEventListener('resize', handleResize);
  btnUndo.addEventListener('click', handleClickUndo);
  btnRestart.addEventListener('click', handleClickRestart);

  document.addEventListener('click', initAudio, { once: true });
  document.addEventListener('touchstart', initAudio, { once: true });
  document.addEventListener('keydown', initAudio, { once: true });

  boot();
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
  if (boardContainer) {
    boardContainer.removeEventListener('touchstart', handleTouchStart);
    boardContainer.removeEventListener('touchend', handleTouchEnd);
    boardContainer.removeEventListener('mousedown', handleMouseDown);
  }
  document.removeEventListener('mouseup', handleMouseUp);
  document.removeEventListener('visibilitychange', handleVisibilityChange);
  window.removeEventListener('resize', handleResize);
  if (btnUndo) btnUndo.removeEventListener('click', handleClickUndo);
  if (btnRestart) btnRestart.removeEventListener('click', handleClickRestart);

  if (particleAnimationId) {
    cancelAnimationFrame(particleAnimationId);
    particleAnimationId = null;
  }
  particles = [];
});
</script>

<style scoped>
.game2048-page {
  --bg-start: #1a1a2e;
  --bg-mid: #16213e;
  --bg-end: #0f3460;
  --panel-bg: rgba(30, 30, 60, 0.75);
  --panel-border: rgba(255, 255, 255, 0.15);
  --text-primary: #e0e0e0;
  --text-secondary: #b0b0b0;
  --gold: #f0c060;
  --accent: #e94560;
  --cell-bg: rgba(255, 255, 255, 0.06);
  --cell-empty: rgba(255, 255, 255, 0.03);
  --shadow-strong: 0 8px 32px rgba(0, 0, 0, 0.4);
  --shadow-card: 0 4px 20px rgba(0, 0, 0, 0.3);
  --radius-lg: 20px;
  --radius-md: 14px;
  --radius-sm: 10px;
  --font-display: 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', 'Helvetica Neue', sans-serif;
  --transition-fast: 0.12s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-smooth: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-bounce: 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  --slide-duration: 0.15s;
  --slide-easing: cubic-bezier(0.4, 0, 0.2, 1);

  position: relative;
  z-index: 1;
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 16px;
  font-family: var(--font-display);
  background: linear-gradient(135deg, #0a0a1a 0%, #111133 25%, #0d1b3e 50%, #0a1028 75%, #0a0a1a 100%);
  background-attachment: fixed;
  overflow-x: hidden;
  -webkit-tap-highlight-color: transparent;
  -webkit-user-select: none;
  user-select: none;
  -webkit-touch-callout: none;
  touch-action: manipulation;
}

.game2048-page::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background:
    radial-gradient(1px 1px at 10% 15%, rgba(255, 255, 255, 0.5), transparent),
    radial-gradient(1px 1px at 25% 35%, rgba(255, 255, 255, 0.4), transparent),
    radial-gradient(1.5px 1.5px at 40% 20%, rgba(255, 255, 255, 0.6), transparent),
    radial-gradient(1px 1px at 55% 45%, rgba(255, 255, 255, 0.35), transparent),
    radial-gradient(1.5px 1.5px at 70% 30%, rgba(255, 255, 255, 0.5), transparent),
    radial-gradient(1px 1px at 85% 50%, rgba(255, 255, 255, 0.4), transparent),
    radial-gradient(1px 1px at 15% 65%, rgba(255, 255, 255, 0.35), transparent),
    radial-gradient(1.5px 1.5px at 30% 75%, rgba(255, 255, 255, 0.45), transparent),
    radial-gradient(1px 1px at 50% 60%, rgba(255, 255, 255, 0.3), transparent),
    radial-gradient(1px 1px at 65% 70%, rgba(255, 255, 255, 0.4), transparent),
    radial-gradient(1.5px 1.5px at 80% 65%, rgba(255, 255, 255, 0.5), transparent),
    radial-gradient(1px 1px at 20% 85%, rgba(255, 255, 255, 0.35), transparent),
    radial-gradient(1px 1px at 45% 80%, rgba(255, 255, 255, 0.4), transparent),
    radial-gradient(1.5px 1.5px at 60% 90%, rgba(255, 255, 255, 0.45), transparent),
    radial-gradient(1px 1px at 75% 15%, rgba(255, 255, 255, 0.3), transparent),
    radial-gradient(2px 2px at 90% 80%, rgba(255, 255, 255, 0.55), transparent),
    radial-gradient(2px 2px at 5% 50%, rgba(255, 255, 255, 0.5), transparent),
    radial-gradient(2px 2px at 50% 10%, rgba(255, 255, 255, 0.55), transparent);
  animation: twinkle 8s ease-in-out infinite alternate;
}

@keyframes twinkle {
  0% { opacity: 0.6; }
  50% { opacity: 0.9; }
  100% { opacity: 0.6; }
}

.particles-background {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.game-wrapper {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 460px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.title-block {
  display: flex;
  align-items: center;
  gap: 10px;
}

.game-title {
  font-size: clamp(2rem, 5vw, 2.6rem);
  font-weight: 900;
  letter-spacing: -1px;
  background: linear-gradient(135deg, #f9d56e 0%, #f8b042 30%, #f7a030 60%, #f9d56e 100%);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 3s ease-in-out infinite;
  text-shadow: none;
  filter: drop-shadow(0 2px 6px rgba(248, 176, 66, 0.4));
}

@keyframes shimmer {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.title-badge {
  display: inline-block;
  background: var(--accent);
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 20px;
  letter-spacing: 1px;
  animation: badgePulse 2s ease-in-out infinite;
}

@keyframes badgePulse {
  0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(233, 68, 96, 0.5); }
  50% { transform: scale(1.08); box-shadow: 0 0 0 10px rgba(233, 68, 96, 0); }
}

.scores-row {
  display: flex;
  gap: 10px;
}

.score-box {
  background: var(--panel-bg);
  border: 1px solid var(--panel-border);
  border-radius: var(--radius-md);
  padding: 10px 16px;
  text-align: center;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: var(--shadow-card);
  min-width: 75px;
  transition: transform var(--transition-bounce);
}

.score-box.bump {
  transform: scale(1.08);
}

.score-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--text-secondary);
  font-weight: 600;
  margin-bottom: 2px;
}

.score-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.5px;
}

.best-score .score-value {
  color: var(--gold);
}

.board-container {
  position: relative;
  background: var(--panel-bg);
  border: 1.5px solid var(--panel-border);
  border-radius: var(--radius-lg);
  padding: 14px;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: var(--shadow-strong);
  aspect-ratio: 1;
  width: 100%;
}

.game-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 10px;
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 1;
}

.grid-cell {
  background: var(--cell-empty);
  border-radius: var(--radius-sm);
  transition: background var(--transition-fast);
}

.tiles-layer {
  position: absolute;
  top: 14px;
  left: 14px;
  right: 14px;
  bottom: 14px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 10px;
  pointer-events: none;
  z-index: 2;
}

.tile-slot {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
}

.tile {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  font-weight: 800;
  transform-origin: center center;
  will-change: transform, opacity;
  cursor: default;
  transition: none;
}

.tile.sliding {
  z-index: 8;
}

.tile.consumed-slide {
  z-index: 6;
  pointer-events: none;
}

.tile.pop-in {
  animation: popIn 0.28s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  z-index: 3;
}

.tile.merge-pop {
  animation: mergePop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  z-index: 10;
}

.tile.merge-glow {
  animation: mergeGlow 0.5s ease-out forwards;
}

.tile.mega-glow {
  animation: megaGlow 2s ease-in-out infinite;
}

@keyframes popIn {
  0% { transform: scale(0); opacity: 0; }
  60% { transform: scale(1.12); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes mergePop {
  0% { transform: scale(1); }
  35% { transform: scale(1.25); }
  65% { transform: scale(0.92); }
  100% { transform: scale(1); }
}

@keyframes mergeGlow {
  0% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.8); }
  100% { box-shadow: 0 0 0 40px rgba(255, 255, 255, 0); }
}

@keyframes megaGlow {
  0%, 100% { box-shadow: 0 0 20px rgba(255, 215, 80, 0.5), 0 0 50px rgba(255, 180, 50, 0.3); }
  50% { box-shadow: 0 0 35px rgba(255, 215, 80, 0.8), 0 0 70px rgba(255, 180, 50, 0.5); }
}

#particleCanvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 3;
  border-radius: var(--radius-lg);
}

.overlay {
  position: absolute;
  inset: 0;
  background: rgba(10, 10, 30, 0.82);
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  z-index: 10;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.overlay-title {
  font-size: 2.2rem;
  font-weight: 900;
  letter-spacing: -1px;
  color: #fff;
  text-align: center;
  animation: bounceIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes bounceIn {
  0% { transform: scale(0.3); opacity: 0; }
  60% { transform: scale(1.08); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}

.overlay-title.win {
  background: linear-gradient(135deg, #f9d56e, #f7a030);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.overlay-subtitle {
  font-size: 1rem;
  color: #ccc;
  font-weight: 500;
}

.controls-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn {
  flex: 1;
  min-width: 70px;
  padding: 13px 18px;
  border: 1.5px solid var(--panel-border);
  border-radius: var(--radius-md);
  font-family: var(--font-display);
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  letter-spacing: 0.5px;
  transition: all var(--transition-fast);
  background: var(--panel-bg);
  color: #fff;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  text-align: center;
  white-space: nowrap;
  position: relative;
  overflow: hidden;
}

.btn::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.06);
  opacity: 0;
  transition: opacity 0.2s;
  border-radius: inherit;
}

.btn:hover::after {
  opacity: 1;
}

.btn:active {
  transform: scale(0.96);
}

.btn.accent {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
  font-weight: 800;
  box-shadow: 0 4px 16px rgba(233, 68, 96, 0.35);
}

.btn.accent:hover {
  box-shadow: 0 6px 24px rgba(233, 68, 96, 0.5);
}

.btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  pointer-events: none;
}

.btn .icon {
  display: inline-block;
  margin-right: 4px;
}

.stats-row {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
}

.stat-item {
  font-size: 0.75rem;
  color: var(--text-secondary);
  letter-spacing: 0.5px;
  font-weight: 500;
  background: var(--panel-bg);
  padding: 6px 12px;
  border-radius: 20px;
  border: 1px solid var(--panel-border);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.stat-value {
  color: #fff;
  font-weight: 700;
}

.back-btn {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 16px;
  padding: 10px 24px;
  background: var(--panel-bg);
  border: 1.5px solid var(--panel-border);
  border-radius: var(--radius-md);
  font-family: var(--font-display);
  font-size: 0.85rem;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: background var(--transition-fast), transform var(--transition-fast);
  letter-spacing: 0.5px;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.back-btn:active {
  transform: scale(0.96);
}

@media (max-width: 400px) {
  .game-wrapper {
    max-width: 100%;
    gap: 10px;
  }

  .board-container {
    padding: 8px;
    border-radius: var(--radius-md);
  }

  .game-grid,
  .tiles-layer {
    gap: 6px;
  }

  .tiles-layer {
    top: 8px;
    left: 8px;
    right: 8px;
    bottom: 8px;
  }

  .tile {
    border-radius: 7px;
  }

  .grid-cell {
    border-radius: 7px;
  }

  .score-box {
    padding: 8px 12px;
    min-width: 60px;
  }

  .score-value {
    font-size: 1.2rem;
  }

  .game-title {
    font-size: 1.6rem;
  }

  .btn {
    padding: 10px 12px;
    font-size: 0.8rem;
  }

  .overlay-title {
    font-size: 1.6rem;
  }
}
</style>
