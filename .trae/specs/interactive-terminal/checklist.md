# Checklist

## 后端 WebSocket 基础设施
- [x] websockets 依赖已安装
- [x] WebSocket 端点 `/ws/code/execute` 可访问
- [x] WebSocket 连接建立和断开正常工作
- [x] main.py 正确挂载了 WebSocket 路由

## 后端交互式执行引擎
- [x] Popen 子进程正确创建（stdout/stderr/stdin 全部 pipe）
- [x] stdout/stderr 输出能实时通过 WebSocket 推送到前端（Queue模式）
- [x] 前端通过 WebSocket 发送的输入能正确写入进程 stdin
- [x] 进程退出时能正确通知前端（exit code）
- [x] 超时后进程能被正确终止
- [x] 临时文件在进程结束后被清理
- [x] 编译错误能正确捕获并通过 WS 返回

## 前端 xterm.js 终端
- [x] xterm.js 组件正确加载和渲染（深色主题 #1e1e1e）
- [x] 终端大小随容器自适应（addon-fit）
- [x] 终端主题与整体 UI 风格一致（VS Code 风格配色）
- [x] 用户可以在终端中输入文字
- [x] 回车键能触发输入发送到后端
- [x] ANSI 颜色输出支持正常

## 前后端联调
- [x] 点击"运行"按钮能建立 WebSocket 连接
- [x] 代码能正确发送到后端并开始执行
- [x] 程序输出实时显示在终端中（逐行推送）
- [x] 当程序请求输入时，用户能在终端输入
- [x] 输入后程序能继续执行并显示后续输出
- [x] 程序正常结束时状态更新为"就绪"
- [x] 编译/运行错误能清晰显示在终端中

## 各语言交互式测试
- [x] Python: print() 无交互代码正常执行完毕（8行输出全部正确）
- [x] Python + sys.stdin.readline(): 输入 "TestUser" → 输出 "got: TestUser" ✅
- [x] JavaScript: 前端直接执行保留不变
- [x] TypeScript/ArkTS: 后端 tsx 执行已通过 API 测试
- [x] C 语言: gcc 编译+执行 已通过 API 测试
- [x] Java: javac+java 执行 已通过 API 测试
