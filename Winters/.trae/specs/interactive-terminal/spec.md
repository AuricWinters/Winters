# 交互式终端 Spec

## Why
当前代码执行是一次性的——用户必须预先填好所有 stdin 输入才能运行。这不符合真实的编程学习体验。用户希望点击运行后程序启动，看到输出提示（如 `请输入成绩(0-100):`），然后在终端中**实时输入**数据，就像在真实的命令行环境里一样。

## What Changes
- 后端新增 WebSocket 端点 `/ws/code/execute`，支持交互式代码执行
- 前端输出面板改为**交互式终端组件**（xterm.js），支持实时输入/输出
- 保留原有一次性 API 作为 fallback（无交互式输入的简单场景）
- 移除之前添加的 stdin 文本框

## Impact
- Affected specs: fastapi-backend-system（扩展）
- Affected code:
  - `d:\web\Winters\Backend\` — 新增 WebSocket 路由
  - `d:\web\Winters\frontend\src\views\lab\CodeLab.vue` — 集成交互式终端

## ADDED Requirements

### Requirement: 交互式代码执行 (WebSocket)
系统 SHALL 提供 WebSocket 端点实现交互式代码执行。

#### Scenario: 运行带 scanf/input 的代码
- **WHEN** 用户点击运行按钮，代码包含 `scanf()` 或 `input()` 等交互式输入
- **AND** 后端通过 WebSocket 启动进程并保持连接
- **THEN** 程序的标准输出实时流式推送到前端终端
- **AND** 用户可在终端中直接键入输入内容
- **AND** 输入内容通过 WebSocket 发送到后端进程的 stdin
- **AND** 程序继续执行并返回后续输出

#### Scenario: 运行无交互的代码
- **WHEN** 用户运行的代码不需要交互式输入
- **THEN** 程序正常执行完毕，所有输出一次性或分批显示
- **AND** 终端显示执行完成状态

#### Scenario: 终端操作
- **WHEN** 用户在终端中输入内容并按回车
- **THEN** 输入内容发送到后端进程 stdin
- **WHEN** 用户按 Ctrl+C
- **THEN** 向后端发送中断信号，终止正在执行的进程

### Requirement: 终端 UI 组件
前端 SHALL 使用 xterm.js 提供类真实终端的用户界面。

- 支持标准 ANSI 颜色和样式
- 支持光标定位、清屏等终端控制序列
- 输入区域可编辑（光标可移动）
- 显示欢迎信息和命令提示符风格
- 执行完成后自动滚动到最新输出

## 技术方案

### 后端架构
```
WebSocket 连接流程:
1. 前端 → WS: { action: "execute", code, language, timeout }
2. 后端 → 创建子进程(subprocess.Popen, pipe=True)
3. 后端 → WS: { type: "output", data: "请输入成绩(0-100): " }
4. 前端 → WS: { action: "input", data: "85\n" }
5. 后端 → 写入进程 stdin
6. 后端 → WS: { type: "output", data: "等级：B (良好)\n" }
7. 进程结束 → WS: { type: "exit", code: 0 }
```

### 技术栈
- **WebSocket**: FastAPI + websockets 库
- **前端终端**: xterm.js + xterm-addon-fit
- **进程管理**: subprocess.Popen (非阻塞, pipe=True)
- **线程**: 每个连接一个线程处理 I/O

## MODIFIED Requirements

### Requirement: 代码执行模式切换
- 默认使用 **交互式终端模式**（WebSocket）
- 保留 **快速模式**（HTTP API）作为备选
- 前端工具栏提供模式切换按钮
