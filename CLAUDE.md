# Winters 项目文档

全栈个人网站 — Vue 3 前端 + FastAPI 后端 + SQLite

## 技术栈

| 层 | 技术 |
|------|------|
| 前端 | Vue 3 (Composition API + `<script setup>`), Vite 5, Pinia, Vue Router 4 |
| 后端 | Python FastAPI, SQLite (原生 sqlite3), WebSocket |
| 样式 | CSS Custom Properties (7 套主题), Scoped CSS, 玻璃拟态, BEM 命名 |
| 测试 | Playwright (E2E / 浏览器截图) |

## 项目结构

```
Winters/
├── frontend/src/
│   ├── views/            # 15 个页面（Home, Blog, Drive, Lab, AI, Profile, Login...）
│   │   └── lab/          # ParticleLab, PianoLab, CodeLab + tutorials/
│   ├── components/       # 10 个全局组件（Header, Footer, SettingsPanel, Toast...）
│   ├── composables/      # 5 个 composable（useParticles, useToast, useScrollReveal...）
│   ├── stores/           # 4 个 Pinia store（user, settings, data, ai）
│   ├── router/           # Vue Router，路由守卫 + 懒加载
│   ├── styles/modules/   # CSS 模块（variables, base, header, components, auth-forms...）
│   ├── utils/            # 工具函数（particles.js, throttle.js）
│   └── data/             # 静态 JSON（profile, projects, blogs, learning-plan）
├── backend/
│   ├── main.py           # FastAPI 入口 + CORS + 路由挂载
│   ├── models.py         # Pydantic v2 数据模型
│   ├── database.py       # SQLite 连接管理
│   ├── crud.py           # 用户 CRUD
│   ├── utils.py          # 验证码 / 第三方登录
│   └── routes/           # auth, user, code, websocket
└── .trae/specs/          # 30+ 功能 spec（TRAE Agent 生成）
```

## 路由（14 条）

| 路径 | 页面 | 认证 |
|------|------|------|
| `/` | 首页 | 否 |
| `/blog` | 动态 | 否 |
| `/projects` `/projects/:id` | 项目 | 否 |
| `/lab` `/lab/particles` `/lab/piano` `/lab/code` | 实验室 | 否 |
| `/ai` | AI 聊天 | 否 |
| `/drive` | 云盘 | 否 |
| `/care` | 暖心关怀 | 否 |
| `/learning` | AI 学习路线 | 否 |
| `/login` `/register` `/reset-password` | 认证 | 否 |
| `/profile` | 个人中心 | **是** |

## 状态管理（Pinia）

| Store | 职责 |
|-------|------|
| `useUserStore` | 认证、用户信息（localStorage 持久化，mock 后端） |
| `useSettingsStore` | 主题/语言/字体/动画偏好（localStorage 持久化） |
| `useDataStore` | 静态数据（profile.json, projects.json, blogs.json） |
| `useAIStore` | AI 对话管理 |

## CSS 约定

### 主题系统
- **所有颜色必须使用 CSS 变量，禁止硬编码 hex/rgb**
- 核心变量：`--primary`, `--primary-rgb`, `--primary-light`, `--primary-dark`, `--secondary`, `--accent`, `--gold`, `--bg-main`, `--bg-glass`, `--bg-card`, `--border-color`, `--text-main`, `--text-secondary`, `--text-light`
- 功能色变量：`--success`, `--success-light`, `--success-text`, `--danger`, `--danger-light`, `--danger-text`
- 7 个预设主题：default, dark, pink-gold, blue-purple, green-teal, orange-red, purple-pink + 自定义
- 主题通过 `data-color-theme` 属性 + `data-theme` 属性控制
- RGB 变量用于 `rgba(var(--primary-rgb), 0.5)` 透明度场景
- 圆角统一 `--radius: 16px`，阴影 `--shadow-sm/md/lg/pink`

### 命名规范
- 组件内：`<style scoped>` 语义化类名
- 全局样式：`src/styles/modules/*.css`，BEM 风格
- 页面根类：`{page-name}-page`（如 `.journal-page`, `.lab-page`）

### 动画
- 标准过渡：`0.3s cubic-bezier(0.4, 0, 0.2, 1)`
- 入场动画：`fadeUp` / `slideUp` + `scroll-reveal`
- `prefers-reduced-motion` 已全局支持

## 响应式：桌面优先

**永远先为桌面 1920×1080 设计，然后向下适配。**

| 断点 | 目标 | 最大内容宽度 |
|------|------|-------------|
| 基准 (~1920px) | 1080p 桌面 | 900px (个人中心) / 1200px (Lab) / 1420px (首页) |
| ≤900px | 平板 | 600px，双栏折叠单栏 |
| ≤480px | 手机 | 100%，全单栏紧凑 |

- 桌面端用双栏/多栏 grid 布局
- 不要先写手机再用 `min-width` 修改 — **基准样式就是桌面端**

## 关键模式

### 页面通用结构
```vue
<template>
  <div class="xxx-page">
    <canvas class="particles-background" />
    <div class="xxx-container">
      <!-- 页面内容 -->
    </div>
  </div>
</template>
<script setup>
import { useParticles } from '../composables/useParticles.js';
useParticles('.particles-background');
</script>
```

### 粒子背景
- 每个页面通过 `useParticles('.particles-background')` 引入
- Canvas 元素需 `.particles-background` 类 + `position: fixed; z-index: 1`
- 主题切换时自动重建（MutationObserver 监听 `data-color-theme`）

### Toast 通知
- `useToast()` composable 提供 `showToast(msg, type, duration)`
- 类型：`success`, `error`, `info`, `warning`
- 全局渲染 `<ToastNotification />` 组件（App.vue 中）

### 设置面板
- `SettingsPanel.vue` 右侧抽屉面板（`v-if` + `<Transition>` 控制显隐）
- 通过 `window.openSettingsPanel()` 或 `new Event('openSettings')` 打开
- 与 `useSettingsStore` 共享数据源

### 路由守卫
- `/profile` 需认证：检查 `localStorage.getItem('isLoggedIn') === 'true'`
- 未登录重定向到 `/login`

## 后端

- FastAPI 运行在 `localhost:8000`
- Vite dev server 代理：`/api` → `http://localhost:8000`，`/ws` → `ws://localhost:8000`
- SQLite 数据库：`backend/data/winters.db`
- 认证：mock 实现（本地模拟登录），API 端点完整

## 开发命令

```bash
# 前端
cd frontend
npm run dev          # 开发服务器（localhost:3000）

# 后端
cd backend
python main.py       # FastAPI（localhost:8000）
```
