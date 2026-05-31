# CodeLab 详细教程内容扩展 Spec

## Why
当前每种语言只有1-3个入门级教程，每个教程仅1-2个代码示例，内容过于单薄，无法支撑完整的学习体验。需要为所有7种语言（ArkTS、C、Java、JavaScript、PHP、Python、TypeScript）补充丰富的、分层次的教程内容。

## What Changes
- 为每种语言扩充至 **6-8 个教程**，覆盖入门→进阶→高级三个难度
- 每个教程包含 **2-4 个代码示例**，每个示例有详细的中文解释
- 教程主题涵盖：基础语法 → 数据结构 → 函数/面向对象 → 实用模块/框架 → 项目实战
- 数据仍内嵌在 `CodeLab.vue` 的 `languages` ref 中

## Impact
- Affected code: `d:\web\Winters\frontend\src\views\lab\CodeLab.vue`（languages 数据部分，约第134-367行）

## ADDED Requirements
### Requirement: 每种语言完整的教程体系
每种语言 SHALL 包含以下层次的学习任务：

#### 入门级（beginner）：3-4个
- Hello World / 基本语法入门
- 变量与数据类型
- 控制语句（if/for/while）
- 函数基础 / 字符串操作

#### 进阶级（intermediate）：2-3个
- 数组/集合/数据结构
- 面向对象 / 类与对象
- 文件操作 / 异常处理 / 模块化

#### 高级（advanced）：1-2个
- 实战项目或综合案例
- 高级特性（并发、泛型、装饰器等）

### Requirement: 代码示例质量
每个示例 SHALL：
- 代码可运行、符合最佳实践
- 有清晰的注释
- explanation 用通俗中文解释核心概念和关键代码行

## 语言具体教程规划

### C语言（8个教程）
1. 👋 Hello World — 程序结构与printf（beginner）
2. 📦 变量与数据类型 — int/float/char/数组（beginner）
3. 🔀 控制语句 — if/switch/for/while（beginner）
4. ⚡ 函数与指针 — 函数定义、指针入门（beginner）
5. 📚 数组与字符串 — 多维数组、字符串处理（intermediate）
6. 🏗️ 结构体与内存管理 — struct、malloc/free（intermediate）
7. 📁 文件操作 — fopen/fread/fwrite（intermediate）
8. 🎯 综合实战：学生成绩管理系统（advanced）

### Java（7个教程）
1. 👋 Hello World — 类结构、main方法（beginner）
2. 📦 变量与数据类型 — 基本类型、String、类型转换（beginner）
3. 🔀 控制语句与循环 — if/for/while/switch（beginner）
4. ⚡ 面向对象基础 — 类、对象、构造器、this（beginner）
5. 📚 集合框架 — ArrayList、HashMap、遍历（intermediate）
6. 🔄 异常处理与接口 — try-catch、interface（intermediate）
7. 🎯 综合实战：简易图书管理系统（advanced）

### JavaScript（8个教程）
1. 👋 Hello World — console.log、变量声明（beginner）
2. ⚙️ 函数 — 声明式/箭头函数/回调（beginner）
3. 🔀 控制语句与循环 — if/for/forEach/map/filter（beginner）
4. 📦 对象与数组 — 解构、展开运算符、方法（beginner）
5. 📚 DOM操作 — 选择元素、事件监听、修改样式（intermediate）
6. 🔄 异步编程 — Promise、async/await、fetch（intermediate）
7. 🧩 ES6+高级特性 — 模块化、class、Proxy（intermediate）
8. 🎯 综合实战：待办事项应用（advanced）

### Python（8个教程）
1. 👋 Hello World — print、变量、f-string（beginner）
2. 📦 数据类型与容器 — list/dict/set/tuple（beginner）
3. 🔀 控制流 — if/for/while/推导式（beginner）
4. ⚡ 函数与模块 — def/lambda/import（beginner）
5. 📚 面向对象 — class/继承/多态（intermediate）
6. 🐍 Pythonic写法 — 装饰器/上下文管理器/生成器（intermediate）
7. 📁 文件与异常 — with/open/try-except（intermediate）
8. 🎯 综合实战：命令行天气查询工具（advanced）

### TypeScript（7个教程）
1. 👋 类型基础 — string/number/boolean/字面量类型（beginner）
2. 📦 高级类型 — interface/type/联合/交叉/泛型（beginner）
3. ⚙️ 函数类型 — 参数类型/返回值类型/重载（beginner）
4. 🔀 类与修饰符 — class/public/private/readonly（intermediate）
5. 📚 工具类型 — Partial/Pick/Omit/Record（intermediate）
6. 🔄 泛型进阶 — 约束/条件类型/infer（intermediate）
7. 🎯 综合实战：类型安全的API请求封装（advanced）

### PHP（7个教程）
1. 👋 Hello World — echo/变量/基本语法（beginner）
2. 📦 数据类型与数组 — 类型判断/索引/关联数组（beginner）
3. 🔀 控制流与函数 — if/foreach/function（beginner）
4. 🌐 表单与超全局变量 — $_GET/$_POST/$_REQUEST（beginner）
5. 📚 面向对象 — class/继承/命名空间（intermediate）
6. 🗄️ 数据库操作 — PDO连接MySQL/CRUD（intermediate）
7. 🎯 综合实战：简易博客后端API（advanced）

### ArkTS（6个教程）
1. 👋 Hello World — @Entry/@Component/声明式UI（beginner）
2. 📦 状态管理 — @State/@Prop/@Link/@Provide（beginner）
3. 🔀 条件与列表渲染 — If/ForEach（beginner）
4. ⚙️ 自定义组件 — @Builder/@Styles/@Extend（intermediate）
5. 📚 页面路由与导航 — router.push/参数传递（intermediate）
6. 🎯 综合实战：待办事项App（advanced）
