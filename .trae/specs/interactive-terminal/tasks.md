# Tasks

## 阶段一：后端 WebSocket 基础设施
- [x] Task 1: 安装依赖并创建 WebSocket 路由
  - [x] 在 requirements.txt 添加 `websockets>=12.0`
  - [x] 创建 routes/websocket.py 实现 WebSocket 端点
  - [x] 在 main.py 中挂载 WebSocket 路由

## 阶段二：后端交互式执行引擎
- [x] Task 2: 实现基于 Popen 的交互式进程管理
  - [x] 使用 subprocess.Popen 创建非阻塞子进程
  - [x] 使用单独线程读取 stdout/stderr 并通过 WS 推送
  - [x] 接收 WS 消息写入进程 stdin
  - [x] 实现超时控制和进程终止（Ctrl+C / timeout）
  - [x] 临时文件清理机制

## 阶段三：前端集成 xterm.js 终端
- [x] Task 3: 安装 xterm.js 并创建终端组件
  - [x] 安装 @xterm/xterm 和 @xterm/addon-fit
  - [x] 在 CodeLab.vue 中引入 xterm 组件替换输出面板
  - [x] 实现终端初始化、尺寸自适应
  - [x] 实现终端主题配色（与整体 UI 一致）

## 阶段四：前后端 WebSocket 联调
- [x] Task 4: 实现交互式执行完整流程
  - [x] 点击运行 → 建立 WS 连接 → 发送 execute 消息
  - [x] 接收 output 消息 → 写入终端
  - [x] 终端键盘输入 → 发送 input 消息到后端
  - [x] 进程退出 → 显示退出码和耗时

## 阶段五：测试与优化
- [ ] Task 5: 测试各语言交互式执行
  - [ ] C 语言 scanf 交互测试
  - [ ] Python input() 交互测试
  - [ ] Java Scanner 交互测试
  - [ ] 无交互代码正常执行测试
  - [ ] Ctrl+C 中断测试
  - [ ] 超时终止测试

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] 无依赖（可与 Task 1/2 并行）
- [Task 4] depends on [Task 2, Task 3]
- [Task 5] depends on [Task 4]
