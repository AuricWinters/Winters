# Winters 项目文档

全栈个人网站 — Vue 3 前端 + FastAPI 后端 + SQLite

## 技术栈

| 层 | 技术 |
|------|------|
| 前端 | Vue 3 (Composition API + `<script setup lang="ts">`), Vite 5, Pinia, Vue Router 4, TypeScript |
| 后端 | Python FastAPI, SQLite (原生 sqlite3), WebSocket |
| 样式 | CSS Custom Properties (8 套主题), Scoped CSS, 玻璃拟态 + React Bits 动效 |
| 测试 | Playwright (E2E / 浏览器截图) |

## 项目结构

```
Winters/
├── frontend/src/
│   ├── views/            # 30 个页面
│   │   └── lab/          # ParticleLab, PianoLab, CodeLab, Game2048Lab, MinesweeperLab, ShowcaseIndex/Text/Hover/Entry/Bg/Ui/3d
│   ├── components/       # 91 个全局组件（含 Header/Footer/SettingsPanel/Toast、React Bits 动效组件、Lab 组件、登录表单等）
│   ├── composables/      # 15 个 composable（useParticles/useToast/useScrollReveal/useBackToTop/useI18n/useSettings + React Bits: useSpotlight/useTilt/useMagnet/useClickSpark/useBlurReveal/useCountUp/useBounceEntry/useBorderGlow）
│   ├── stores/           # 6 个 Pinia store（user, settings, data, ai, community, effects）
│   ├── router/           # Vue Router，路由守卫 + 懒加载
│   ├── styles/modules/   # 9 个 CSS 模块（variables, base, layout, header, components, auth-forms, features, utilities, journal）
│   ├── utils/            # 工具函数（particles.ts, throttle.ts）
│   └── data/             # 静态数据（profile.json, projects.json, blogs.json, learning-plan.ts）
├── backend/
│   ├── main.py           # FastAPI 入口 + CORS + 路由挂载
│   ├── models.py         # Pydantic v2 数据模型
│   ├── database.py       # SQLite 连接管理
│   ├── crud.py           # 用户 CRUD
│   ├── executor.py       # 代码执行引擎
│   ├── utils.py          # 验证码 / 第三方登录
│   └── routes/           # auth, community, user, code, websocket
└── .trae/specs/          # 30+ 功能 spec（TRAE Agent 生成）
```

## 路由（30 条）

| 路径 | 页面 | 认证 |
|------|------|------|
| `/` | 首页 | 否 |
| `/blog` | 动态（社区帖子流） | 否 |
| `/community` `/community/new` `/community/:id` | AI 社区 / 发帖 / 详情 | 部分（发帖需登录） |
| `/projects` `/projects/:id` | 项目列表 / 详情 | 否 |
| `/care` | 暖心关怀 | 否 |
| `/learning` | AI 学习路线 | 否 |
| `/system` | 自驱工作站文档 | 否 |
| `/lab` `/lab/particles` `/lab/piano` `/lab/code` `/lab/2048` `/lab/minesweeper` `/lab/showcase` `/lab/showcase/text` `/lab/showcase/hover` `/lab/showcase/entry` `/lab/showcase/bg` `/lab/showcase/ui` `/lab/showcase/3d` | 实验室 / 粒子 / 钢琴 / 在线IDE / 2048 / 扫雷 / 组件实验室 / 文字特效 / 悬停交互 / 入场动画 / 背景装饰 / UI组件 / 3D工具 | 否 |
| `/ai` | AI 聊天 | 否 |
| `/drive` | 云盘 | 否 |
| `/contact` | 联系我 | 否 |
| `/login` `/register` `/reset-password` | 登录 / 注册 / 重置密码 | 否 |
| `/profile` | 个人中心 | **是** |

## 状态管理（Pinia，6 个 store）

| Store | 职责 |
|-------|------|
| `useUserStore` | 认证/用户信息（JWT + bcrypt，真 API，非 mock） |
| `useSettingsStore` | 主题/深色模式/字体/动画偏好（localStorage 持久化） |
| `useDataStore` | 静态数据（profile.json, projects.json, blogs.json） |
| `useAIStore` | AI 对话管理（Ollama / OpenAI 双后端） |
| `useCommunityStore` | 社区帖子/标签/分页/点赞（后端 API 驱动） |
| `useEffectStore` | 动效槽位管理（9 个槽位，localStorage 持久化） |

## CSS 约定

### 主题系统
- **所有颜色必须使用 CSS 变量，禁止硬编码 hex/rgb**
- 核心变量：`--primary`, `--primary-rgb`, `--primary-light`, `--primary-dark`, `--secondary`, `--accent`, `--gold`, `--bg-main`, `--bg-glass`, `--bg-card`, `--border-color`, `--text-main`, `--text-secondary`, `--text-light`
- 功能色变量：`--success`, `--success-light`, `--success-text`, `--danger`, `--danger-light`, `--danger-text`
- 8 个预设主题：手账(journal), 墨韵(ink), 极光(aurora), 樱吹雪(sakura), 森语(forest), 午夜(midnight), 暮光(twilight), 极简(minimal) + 自定义(custom)（单色/双拼/三色自由搭配）
- 主题通过 `data-color-theme` 属性 + `data-theme` 属性控制
- RGB 变量用于 `rgba(var(--primary-rgb), 0.5)` 透明度场景
- 圆角统一 `--radius: 16px`，阴影 `--shadow-sm/md/lg/pink`

### 命名规范
- 组件内：`<style scoped>` 语义化类名
- 全局样式：`src/styles/modules/*.css`
- 页面根类：`{page-name}-page`（如 `.home-page`, `.lab-page`）

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
import { useParticles } from '../composables/useParticles.ts';
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
- 与 `useSettingsStore` 共享数据源，同时接入 `useEffectStore` 管理动效槽位
- 三层导航：主页 → 主题子页 / 动效子页（9 个动效槽位，每槽位选项按钮 grid，实时响应）

### 路由守卫
- `/profile` 需认证：检查 `localStorage.getItem('isLoggedIn') === 'true'`
- 未登录重定向到 `/login`

## 后端

- FastAPI 运行在 `localhost:8000`
- Vite dev server 代理：`/api` → `http://localhost:8000`，`/ws` → `ws://localhost:8000`
- SQLite 数据库：`backend/data/winters.db`（6 表：users/posts/comments/likes/tags/verification_codes）
- 当前版本：v0.5.3
- 认证：JWT + bcrypt 真实现，`/api/auth/*` 9 端点（status/register/login/code/reset-password/change-password/social/login/social/callback）

## 开发命令

```bash
# 前端
cd frontend
npm run dev          # 开发服务器（localhost:3000）

# 后端
cd backend
python main.py       # FastAPI（localhost:8000）

## 当前状态

### 已完成
- 8 套设计师主题（手账/墨韵/极光/樱吹雪/森语/午夜/暮光/极简 + 自定义），每套亮暗双模式，默认樱吹雪(sakura)
- 手账/普通两种视觉风格，默认普通(standard)；圆角/直角独立切换，默认直角(sharp)
- SettingsPanel 三层导航（主页 → 主题子页 / 动效子页）
- 9 个动效槽位实时配置（标题/卡片/按钮/背景/文字/点击/页面/导航），Pinia + localStorage 持久化
- 全站 i18n（zh-CN/zh-TW/en-US），24 个文件接入，locale 在 `src/locales/`
- 主题持久化：刷新不丢设置（App.vue 初始化 store），旧主题名自动迁移

### 待做
- 第三方登录（微信/GitHub）—— spec 有，未实现
- i18n 动态文本（toast、care 消息数组）未完全覆盖

### 硬规则
- 所有颜色必须用 CSS 变量，禁止硬编码 hex/rgb
- 桌面优先响应式：1920px → 900px → 480px
- 粒子系统（useParticles）和 Backend 不要随意改动
- CLAUDE.md 每次功能变更后必须同步更新，不等提醒
```
