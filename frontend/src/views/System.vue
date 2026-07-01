<template>
  <div class="sys-page">
    <canvas class="particles-background" />

    <div class="sys-container">
      <!-- ===== Hero ===== -->
      <header class="sys-hero scroll-reveal">
        <div class="hero-badge">
          🧠 {{ t('内部文档') }}
        </div>
        <h1 class="hero-title">
          Claude Code<br><span class="hero-accent">{{ t('自驱工作站') }}</span>
        </h1>
        <p class="hero-sub">
          {{ t('一套让 AI 理解项目、自动干活、记住偏好的完整体系。从开机扫描市场到写完代码推送 GitHub，每一步背后都有配置在驱动。') }}
        </p>
      </header>

      <!-- ===== 全景图 ===== -->
      <section class="sys-block scroll-reveal">
        <h2 class="block-title">
          <span class="block-num">01</span> {{ t('全景架构') }}
        </h2>
        <p class="block-desc">
          {{ t('整个工作站由「全局大脑」+「项目躯体」+「外部手臂」三部分组成。') }}
        </p>

        <div class="arch-diagram">
          <pre class="arch-code"><code>┌─────────────────────────────────────────────────────────┐
│                  <em>~/.claude/</em>  全局「大脑」               │
│                                                         │
│  settings.json    → 模型/密钥/Hooks/市场/插件              │
│  CLAUDE.md        → 7步工作流 + 指令速查 + 文档同步规则     │
│  memory/          → 跨项目持久记忆                         │
│     └─ projects/D--project/ → Winters 专属记忆            │
└─────────────────────────────────────────────────────────┘
        │          │
        ▼          ▼
┌───────────────────┐  ┌───────────────────┐
│  <em>Winters/</em>       │  │  MCP 服务 (手臂)    │
│  项目「躯体」        │  │                   │
│                   │  │  GitHub API       │
│  CLAUDE.md        │  │  ├─ 查 PR/文件     │
│  README.md        │  │  └─ 搜代码         │
│  CHANGELOG.md     │  │                   │
│  .claude/         │  │  SQLite           │
│  frontend/        │  │  └─ 数据库直连      │
│  backend/         │  │                   │
└───────────────────┘  └───────────────────┘</code></pre>
        </div>
      </section>

      <!-- ===== 启动流程 ===== -->
      <section class="sys-block scroll-reveal">
        <h2 class="block-title">
          <span class="block-num">02</span> {{ t('启动流程') }}
        </h2>
        <p class="block-desc">
          {{ t('每次打开 Claude Code，背后都在自动做这些事：') }}
        </p>

        <div class="flow-cards">
          <div
            v-for="(step, i) in bootSteps"
            :key="i"
            class="flow-card"
          >
            <div class="flow-num">
              {{ i + 1 }}
            </div>
            <div class="flow-icon">
              {{ step.icon }}
            </div>
            <div class="flow-info">
              <h4>{{ t(step.title) }}</h4>
              <p>{{ t(step.desc) }}</p>
              <code v-if="step.code">{{ t(step.code) }}</code>
            </div>
          </div>
        </div>
      </section>

      <!-- ===== 六层加载 ===== -->
      <section class="sys-block scroll-reveal">
        <h2 class="block-title">
          <span class="block-num">03</span> {{ t('上下文加载') }}
        </h2>
        <p class="block-desc">
          {{ t('开发时，每一条对话背后，AI 已经读了这 6 层上下文：') }}
        </p>

        <div class="layer-stack">
          <div
            v-for="layer in layers"
            :key="layer.level"
            class="layer"
            :style="{ '--layer-opacity': 0.4 + layer.level * 0.1 }"
          >
            <div class="layer-head">
              <span class="layer-lv">L{{ layer.level }}</span>
              <span class="layer-name">{{ t(layer.name) }}</span>
              <span class="layer-file">{{ t(layer.file) }}</span>
            </div>
            <p class="layer-what">
              {{ t(layer.what) }}
            </p>
          </div>
        </div>
      </section>

      <!-- ===== 双模型 ===== -->
      <section class="sys-block scroll-reveal">
        <h2 class="block-title">
          <span class="block-num">04</span> {{ t('双模型调度') }}
        </h2>
        <p class="block-desc">
          {{ t('一个快一个强，各干各的活：') }}
        </p>

        <div class="dual-grid">
          <div class="dual-card primary-model">
            <div class="dual-badge">
              {{ t('主力') }}
            </div>
            <h3>deepseek-v4-pro</h3>
            <ul>
              <li>{{ t('跟你直接对话') }}</li>
              <li>{{ t('Plan 模式出方案') }}</li>
              <li>{{ t('写代码 / 改代码') }}</li>
              <li>{{ t('复杂决策判断') }}</li>
            </ul>
          </div>
          <div class="dual-card secondary-model">
            <div class="dual-badge">
              {{ t('副手') }}
            </div>
            <h3>deepseek-v4-flash</h3>
            <ul>
              <li>{{ t('SessionStart 扫描市场') }}</li>
              <li>{{ t('子 Agent（审查/搜索）') }}</li>
              <li>{{ t('Workflow 分发的工人') }}</li>
              <li>{{ t('轻量重复任务') }}</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- ===== 权限系统 ===== -->
      <section class="sys-block scroll-reveal">
        <h2 class="block-title">
          <span class="block-num">05</span> {{ t('权限系统') }}
        </h2>
        <p class="block-desc">
          {{ t('Plan ↔ Auto 双模式 + 白名单机制，安全不碍事。') }}
        </p>

        <div class="perm-grid">
          <div class="perm-card">
            <h4>{{ t('🧠 Plan 模式') }}</h4>
            <p>{{ t('所有操作都要你确认。用来出方案、讨论架构。用完一次即切回 Auto。') }}</p>
          </div>
          <div class="perm-card">
            <h4>{{ t('⚡ Auto 模式') }}</h4>
            <p>{{ t('白名单里的命令直接跑。写代码、删文件、启动服务 —— 不打断你。') }}</p>
          </div>
        </div>

        <div class="perm-example">
          <h4>{{ t('📋 当前白名单') }}</h4>
          <div class="perm-tags">
            <span class="perm-tag">git *</span>
            <span class="perm-tag">npx vite *</span>
            <span class="perm-tag">node *</span>
            <span class="perm-tag">npx playwright *</span>
            <span class="perm-tag">curl localhost</span>
            <span class="perm-tag">Read project/**</span>
          </div>
        </div>
      </section>

      <!-- ===== MCP ===== -->
      <section class="sys-block scroll-reveal">
        <h2 class="block-title">
          <span class="block-num">06</span> {{ t('MCP 外部手臂') }}
        </h2>
        <p class="block-desc">
          {{ t('Model Context Protocol —— 让 AI 能伸手操作外部系统。') }}
        </p>

        <div class="mcp-cards">
          <div class="mcp-card">
            <div class="mcp-icon">
              🐙
            </div>
            <h3>GitHub MCP</h3>
            <p>{{ t('读仓库文件、搜代码、查 PR、管理 Issues —— 不需要你给 token，配置在 settings.json 里。') }}</p>
            <code>$env:GITHUB_TOKEN</code>
          </div>
          <div class="mcp-card">
            <div class="mcp-icon">
              🗄️
            </div>
            <h3>SQLite MCP</h3>
            <p>{{ t('直连 winters.db，查用户数据、验证注册结果，不需要你导出 CSV。') }}</p>
            <code>backend/data/winters.db</code>
          </div>
          <div class="mcp-card">
            <div class="mcp-icon">
              💻
            </div>
            <h3>IDE MCP</h3>
            <p>{{ t('VS Code 集成 —— 获取诊断信息、在 Jupyter Notebook 里执行代码。') }}</p>
            <code>{{ t('内置连接') }}</code>
          </div>
        </div>
      </section>

      <!-- ===== CLAUDE.md 链 ===== -->
      <section class="sys-block scroll-reveal">
        <h2 class="block-title">
          <span class="block-num">07</span> {{ t('CLAUDE.md 文档链') }}
        </h2>
        <p class="block-desc">
          {{ t('一份文件，三个人看：') }}
        </p>

        <div class="doc-chain">
          <div class="chain-step">
            <div class="chain-icon">
              🤖
            </div>
            <h4>Claude Code（AI Agent）</h4>
            <p>{{ t('读 CLAUDE.md → 了解技术栈和约定 → 写出符合项目规范的代码') }}</p>
          </div>
          <div class="chain-arrow">
            →
          </div>
          <div class="chain-step">
            <div class="chain-icon">
              🧠
            </div>
            <h4>Claude Code</h4>
            <p>{{ t('读 CLAUDE.md → 知道架构约定 → 写出符合项目规范的代码') }}</p>
          </div>
          <div class="chain-arrow">
            →
          </div>
          <div class="chain-step">
            <div class="chain-icon">
              👤
            </div>
            <h4>{{ t('你（人类）') }}</h4>
            <p>{{ t('读 README.md → 了解项目功能 → 快速上手启动') }}</p>
          </div>
        </div>
      </section>

      <!-- ===== 记忆系统 ===== -->
      <section class="sys-block scroll-reveal">
        <h2 class="block-title">
          <span class="block-num">08</span> {{ t('记忆系统') }}
        </h2>
        <p class="block-desc">
          {{ t('跨会话持久化。区分「什么项目都要遵守」vs「只对这个项目有意义」。') }}
        </p>

        <div class="mem-grid">
          <div class="mem-card global-mem">
            <h4>{{ t('🌐 全局规则') }}</h4>
            <code>~/.claude/CLAUDE.md</code>
            <ul>
              <li>{{ t('永远用中文对话') }}</li>
              <li>{{ t('6 步开发闭环 + 文档同步') }}</li>
              <li>{{ t('4 项自动化（Agent/commit/文档/指令推荐）') }}</li>
              <li>{{ t('双模型调度（pro 主控 + flash 子Agent）') }}</li>
            </ul>
          </div>
          <div class="mem-card local-mem">
            <h4>{{ t('📁 项目记忆 + 备份') }}</h4>
            <code>~/.claude/memory/about-auricwinters.md</code>
            <ul>
              <li>{{ t('用户身份、个性、编程习惯') }}</li>
              <li>{{ t('默认外观偏好：sakura + standard + sharp') }}</li>
              <li>{{ t('定期备份到 D:\\.claude') }}</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- ===== 完整开发流 ===== -->
      <section class="sys-block scroll-reveal">
        <h2 class="block-title">
          <span class="block-num">09</span> {{ t('完整开发闭环') }}
        </h2>
        <p class="block-desc">
          {{ t('从想法到上线的 7 步流水线，每步谁做什么，清清楚楚。') }}
        </p>

        <div class="pipeline">
          <div
            v-for="s in pipeline"
            :key="s.step"
            class="pipe-step"
          >
            <div class="pipe-num">
              {{ s.step }}
            </div>
            <div class="pipe-who">
              {{ t(s.who) }}
            </div>
            <div class="pipe-what">
              {{ t(s.what) }}
            </div>
          </div>
        </div>
      </section>

      <!-- ===== 关键文件速查 ===== -->
      <section class="sys-block scroll-reveal">
        <h2 class="block-title">
          <span class="block-num">10</span> {{ t('关键文件速查') }}
        </h2>

        <div class="file-table-wrap">
          <table class="file-table">
            <thead>
              <tr><th>{{ t('文件') }}</th><th>{{ t('作用') }}</th><th>{{ t('修改频率') }}</th></tr>
            </thead>
            <tbody>
              <tr><td><code>~/.claude/settings.json</code></td><td>{{ t('全局配置（模型、密钥、Hook、市场）') }}</td><td>{{ t('几乎不改') }}</td></tr>
              <tr><td><code>~/.claude/CLAUDE.md</code></td><td>{{ t('全局规则（工作流、指令、习惯）') }}</td><td>{{ t('偶尔补充') }}</td></tr>
              <tr><td><code>Winters/CLAUDE.md</code></td><td>{{ t('AI 项目手册') }}</td><td>{{ t('每次加功能同步') }}</td></tr>
              <tr><td><code>Winters/README.md</code></td><td>{{ t('人类项目介绍（GitHub 首页）') }}</td><td>{{ t('每次加功能同步') }}</td></tr>
              <tr><td><code>Winters/.claude/settings.local.json</code></td><td>{{ t('项目权限白名单') }}</td><td>{{ t('遇到新命令时加') }}</td></tr>
              <tr><td><code>Winters/.mcp.json</code></td><td>{{ t('外部工具连接配置') }}</td><td>{{ t('几乎不改') }}</td></tr>
              <tr><td><code>~/.claude/projects/D--project/memory/</code></td><td>{{ t('项目专属持久记忆') }}</td><td>{{ t('发现新约定时写') }}</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <footer class="sys-footer">
        <p>{{ t('Made with ❤️ by Claude Code · 驱动 Winters 项目的自驱工作站') }}</p>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '../composables/useI18n.ts';
import { useParticles } from '../composables/useParticles.ts';
import { useScrollReveal } from '../composables/useScrollReveal.ts';

const { t } = useI18n();

useParticles('.particles-background');
useScrollReveal();

const bootSteps = [
  { icon: '📂', title: '加载全局 CLAUDE.md', desc: '读到你的语言偏好、工作流、自动化规则', code: '~/.claude/CLAUDE.md' },
  { icon: '⚙️', title: '加载全局 settings.json', desc: '连哪个模型、用什么密钥、开什么插件、Stop hook 自动检查', code: 'ANTHROPIC_MODEL=deepseek-v4-pro' },
  { icon: '🔍', title: 'SessionStart Hook 触发', desc: '后台 Agent 扫描 Claudest + Antigravity 两个市场，有新插件自动装', code: '扫描社区 Skills…' },
  { icon: '📖', title: '加载项目 CLAUDE.md', desc: '知道你是 Vue 3 项目、30 条路由、6 个 Store、CSS 变量约定', code: 'Winters/CLAUDE.md' },
  { icon: '🔐', title: '加载权限白名单', desc: 'Auto 模式下哪些命令可以直接跑，不用问你', code: '.claude/settings.local.json' },
  { icon: '🔗', title: '连接 MCP 服务', desc: '接上 GitHub API 和 SQLite 数据库', code: '.mcp.json' },
  { icon: '🛑', title: 'Stop Hook 待命', desc: '会话结束自动检查未提交改动 + 文档同步状态', code: 'git status --short + 文档检查' },
];

const layers = [
  { level: 1, name: '全局规则', file: '~/.claude/CLAUDE.md', what: '怎么说话、什么流程、何时用哪个指令' },
  { level: 2, name: '全局配置', file: '~/.claude/settings.json', what: '模型/api密钥/市场/Hook/插件' },
  { level: 3, name: '项目文档', file: 'Winters/CLAUDE.md', what: '技术栈、30条路由、6个Store、CSS变量体系、v0.5.3' },
  { level: 4, name: '项目权限', file: 'Winters/.claude/settings.local.json', what: '哪些命令 Auto 模式直接跑' },
  { level: 5, name: '项目记忆', file: 'memory/projects/D--project/', what: '编码约定、项目状态、经验教训' },
  { level: 6, name: '外部工具', file: '.mcp.json', what: 'GitHub API 操作、SQLite 数据库读写' },
];

const pipeline = [
  { step: '①', who: 'Claude (Plan)', what: '理解需求 → 出方案 → 用户审批' },
  { step: '②', who: 'Claude (Auto)', what: '写代码，重活/重复活自动 Workflow 多 Agent 并行' },
  { step: '③', who: '用户 /code-review', what: '多角度审查 → 出报告' },
  { step: '④', who: 'Claude (Auto)', what: '有问题才修，没问题跳过' },
  { step: '⑤', who: '用户 /simplify', what: '去冗余、抽重复、优化结构' },
  { step: '⑥', who: '用户 /verify', what: '启动应用验证功能 → 收工' },
  { step: '⑦', who: 'Claude (Auto)', what: '同步更新 CLAUDE.md + README.md + commit + push' },
];
</script>

<style scoped>
.sys-page { position: relative; min-height: 100vh; }

.sys-container {
  position: relative; z-index: 10;
  max-width: 860px; margin: 0 auto;
  padding: 60px 24px 40px;
}

/* ===== Hero ===== */
.sys-hero { text-align: center; margin-bottom: 56px; }
.hero-badge {
  display: inline-block; padding: 6px 18px;
  background: rgba(var(--primary-rgb), 0.1);
  color: var(--primary); border-radius: 20px;
  font-size: 13px; font-weight: 600; margin-bottom: 20px;
}
.hero-title {
  font-size: 52px; font-weight: 900; line-height: 1.2; margin: 0 0 20px;
  color: var(--text-main);
}
.hero-accent {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
.hero-sub { font-size: 17px; color: var(--text-secondary); line-height: 1.7; max-width: 640px; margin: 0 auto; }

/* ===== Section blocks ===== */
.sys-block { margin-bottom: 56px; }
.block-title {
  font-size: 26px; font-weight: 800; color: var(--text-main);
  display: flex; align-items: center; gap: 12px; margin: 0 0 8px;
}
.block-num {
  font-size: 14px; color: var(--primary); background: rgba(var(--primary-rgb), 0.08);
  padding: 4px 12px; border-radius: 8px; font-weight: 700;
}
.block-desc { color: var(--text-secondary); font-size: 15px; margin: 0 0 24px; }

/* ===== Architecture diagram ===== */
.arch-diagram {
  background: var(--bg-card); border-radius: var(--radius);
  padding: 28px; box-shadow: var(--shadow-md);
  overflow-x: auto;
}
.arch-code {
  margin: 0; font-size: 13px; line-height: 1.8; color: var(--text-secondary);
  font-family: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;
}
.arch-code em { color: var(--primary); font-style: normal; font-weight: 700; }

/* ===== Flow cards ===== */
.flow-cards { display: flex; flex-direction: column; gap: 14px; }
.flow-card {
  display: flex; align-items: flex-start; gap: 16px;
  background: var(--bg-card); border-radius: 14px; padding: 20px 24px;
  box-shadow: var(--shadow-sm); border-left: 4px solid var(--primary);
  transition: all 0.2s;
}
.flow-card:hover { transform: translateX(4px); box-shadow: var(--shadow-md); }
.flow-num {
  width: 30px; height: 30px; border-radius: 50%;
  background: var(--primary); color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; font-weight: 700; flex-shrink: 0;
}
.flow-icon { font-size: 24px; flex-shrink: 0; }
.flow-info h4 { margin: 0 0 4px; font-size: 15px; color: var(--text-main); }
.flow-info p { margin: 0 0 6px; font-size: 13px; color: var(--text-secondary); }
.flow-info code {
  display: inline-block; padding: 3px 10px; background: rgba(var(--primary-rgb), 0.06);
  border-radius: 6px; font-size: 12px; color: var(--primary);
  font-family: 'JetBrains Mono', monospace;
}

/* ===== Layer stack ===== */
.layer-stack { display: flex; flex-direction: column; gap: 10px; }
.layer {
  background: var(--bg-card); border-radius: 12px; padding: 16px 22px;
  box-shadow: var(--shadow-sm);
  border-left: 4px solid rgba(var(--primary-rgb), var(--layer-opacity, 0.5));
}
.layer-head { display: flex; align-items: center; gap: 12px; margin-bottom: 4px; }
.layer-lv {
  font-size: 11px; font-weight: 800; padding: 2px 8px; border-radius: 6px;
  background: rgba(var(--primary-rgb), 0.1); color: var(--primary);
}
.layer-name { font-weight: 700; font-size: 15px; color: var(--text-main); }
.layer-file { font-size: 12px; color: var(--text-secondary); font-family: monospace; margin-left: auto; }
.layer-what { font-size: 13px; color: var(--text-secondary); margin: 0; padding-left: 44px; }

/* ===== Dual model ===== */
.dual-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.dual-card {
  background: var(--bg-card); border-radius: var(--radius);
  padding: 28px; box-shadow: var(--shadow-sm);
}
.primary-model { border-top: 3px solid var(--primary); }
.secondary-model { border-top: 3px solid var(--secondary); }
.dual-badge {
  display: inline-block; padding: 3px 12px; border-radius: 10px;
  font-size: 11px; font-weight: 700; margin-bottom: 12px;
}
.primary-model .dual-badge { background: rgba(var(--primary-rgb), 0.1); color: var(--primary); }
.secondary-model .dual-badge { background: rgba(var(--secondary-rgb), 0.1); color: var(--secondary); }
.dual-card h3 { margin: 0 0 14px; font-size: 20px; color: var(--text-main); }
.dual-card ul { margin: 0; padding-left: 20px; font-size: 14px; color: var(--text-secondary); line-height: 1.8; }

/* ===== Permissions ===== */
.perm-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }
.perm-card {
  background: var(--bg-card); border-radius: 14px; padding: 24px;
  box-shadow: var(--shadow-sm);
}
.perm-card h4 { margin: 0 0 8px; font-size: 18px; color: var(--text-main); }
.perm-card p { margin: 0; font-size: 14px; color: var(--text-secondary); }
.perm-example { background: var(--bg-card); border-radius: 14px; padding: 20px 24px; box-shadow: var(--shadow-sm); }
.perm-example h4 { margin: 0 0 14px; font-size: 15px; color: var(--text-main); }
.perm-tags { display: flex; flex-wrap: wrap; gap: 8px; }
.perm-tag {
  padding: 5px 14px; background: rgba(var(--primary-rgb), 0.06);
  border-radius: 20px; font-size: 13px; color: var(--primary);
  font-family: monospace; font-weight: 500;
}

/* ===== MCP ===== */
.mcp-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.mcp-card {
  background: var(--bg-card); border-radius: var(--radius);
  padding: 28px; box-shadow: var(--shadow-sm);
  text-align: center; transition: all 0.2s;
}
.mcp-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); }
.mcp-icon { font-size: 40px; margin-bottom: 14px; }
.mcp-card h3 { margin: 0 0 8px; font-size: 17px; color: var(--text-main); }
.mcp-card p { margin: 0 0 14px; font-size: 13px; color: var(--text-secondary); line-height: 1.6; }
.mcp-card code {
  font-size: 11px; padding: 4px 10px; background: rgba(var(--primary-rgb), 0.06);
  border-radius: 6px; color: var(--primary); font-family: monospace;
}

/* ===== CLAUDE.md chain ===== */
.doc-chain { display: flex; align-items: flex-start; gap: 0; justify-content: center; flex-wrap: wrap; }
.chain-step {
  flex: 1; min-width: 180px; max-width: 220px;
  text-align: center; padding: 24px 16px;
  background: var(--bg-card); border-radius: 14px; box-shadow: var(--shadow-sm);
}
.chain-icon { font-size: 36px; margin-bottom: 10px; }
.chain-step h4 { margin: 0 0 6px; font-size: 15px; color: var(--text-main); }
.chain-step p { margin: 0; font-size: 12px; color: var(--text-secondary); line-height: 1.5; }
.chain-arrow {
  display: flex; align-items: center; font-size: 28px; color: var(--primary);
  padding: 0 8px; flex-shrink: 0; margin-top: 36px;
}

/* ===== Memory ===== */
.mem-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.mem-card {
  background: var(--bg-card); border-radius: var(--radius);
  padding: 28px; box-shadow: var(--shadow-sm);
}
.mem-card h4 { margin: 0 0 6px; font-size: 17px; color: var(--text-main); }
.mem-card > code {
  display: inline-block; margin-bottom: 14px; padding: 4px 10px;
  background: rgba(var(--primary-rgb), 0.06); border-radius: 6px;
  font-size: 11px; color: var(--primary); font-family: monospace;
}
.mem-card ul { margin: 0; padding-left: 18px; font-size: 13px; color: var(--text-secondary); line-height: 1.8; }
.global-mem { border-top: 3px solid var(--primary); }
.local-mem { border-top: 3px solid var(--secondary); }

/* ===== Pipeline ===== */
.pipeline { display: flex; flex-direction: column; gap: 10px; }
.pipe-step {
  display: flex; align-items: center; gap: 16px;
  padding: 16px 22px; background: var(--bg-card);
  border-radius: 12px; box-shadow: var(--shadow-sm);
  transition: all 0.2s;
}
.pipe-step:hover { transform: translateX(4px); }
.pipe-num {
  width: 34px; height: 34px; border-radius: 50%;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: #fff; display: flex; align-items: center; justify-content: center;
  font-weight: 800; font-size: 14px; flex-shrink: 0;
}
.pipe-who {
  width: 140px; font-size: 13px; font-weight: 700; color: var(--primary);
  flex-shrink: 0;
}
.pipe-what { font-size: 14px; color: var(--text-secondary); }

/* ===== File table ===== */
.file-table-wrap { overflow-x: auto; }
.file-table { width: 100%; border-collapse: collapse; font-size: 14px; }
.file-table th {
  text-align: left; padding: 12px 16px; background: rgba(var(--primary-rgb), 0.06);
  color: var(--text-main); font-weight: 700; border-radius: 8px 8px 0 0;
}
.file-table td { padding: 12px 16px; border-bottom: 1px solid var(--border-color); color: var(--text-secondary); }
.file-table tr:last-child td { border-bottom: none; }
.file-table code { color: var(--primary); font-family: monospace; font-size: 12px; }
.file-table tr:hover td { background: rgba(var(--primary-rgb), 0.02); }

/* ===== Footer ===== */
.sys-footer { text-align: center; padding: 40px 0 20px; color: var(--text-secondary); font-size: 13px; opacity: 0.6; }

/* ===== Responsive ===== */
@media (max-width: 900px) {
  .hero-title { font-size: 36px; }
  .dual-grid, .perm-grid, .mcp-cards, .mem-grid { grid-template-columns: 1fr; }
  .doc-chain { flex-direction: column; align-items: center; }
  .chain-arrow { transform: rotate(90deg); margin-top: 4px; }
  .pipe-who { width: 100px; }
}
@media (max-width: 480px) {
  .sys-container { padding: 40px 16px 30px; }
  .hero-title { font-size: 28px; }
  .arch-code { font-size: 10px; }
  .pipe-who { width: 80px; font-size: 11px; }
  .pipe-what { font-size: 12px; }
}
</style>
