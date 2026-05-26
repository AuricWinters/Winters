export default {
  id: 'javascript',
  name: 'JavaScript',
  icon: 'JS',
  version: 'ES6+',
  description: '网页开发的脚本语言，前后端都能用',
  tutorials: [
      {
        id: 'js-hello',
        title: 'Hello World',
        icon: '👋',
        description: '编写第一个JavaScript程序，学习基本语法',
        difficulty: 'beginner',
        examples: [
          {
            title: '控制台输出',
            code: `console.log("Hello, World!");

// 变量声明
let name = "小明";
const age = 25;

console.log('姓名: \${name}, 年龄: \${age}');`,
            explanation: "console.log()是JS最常用的输出方法。let声明可变变量，const声明常量（不可重新赋值）。模板字符串使用反引号 ` ，内部用 \${} 插入变量。"
          },
          {
            title: 'let / const / var 区别',
            code: `// var - 函数作用域，可重复声明，存在变量提升（已不推荐）
var a = 1;
var a = 2;       // 不会报错

// let - 块作用域，不可重复声明（推荐用于变量）
let b = 1;
// let b = 2;   // 报错：已经声明过

// const - 块作用域，声明后不可修改（推荐用于常量）
const c = [1, 2, 3];
c.push(4);       // 可以修改数组内容
// c = [];       // 报错：不能重新赋值

console.log(a, b, c);`,
            explanation: 'var是旧语法，存在变量提升和重复声明问题。let和const是ES6新增，具有块级作用域{}。const保证引用不变但对象/数组内部仍可修改。'
          },
          {
            title: '模板字符串',
            code: `const name = "小明";
const score = 95;
const items = ["苹果", "香蕉"];

// 基本插值
console.log('\${name}的分数是\${score}');

// 表达式计算
console.log('总分: \${score * 10}');

// 多行字符串
const html = '
  <div class="card">
    <h1>\${name}<\/h1>
    <ul>\${items.map(i => '<li>\${i}<\/li>').join("")}<\/ul>
  <\/div>
';
console.log(html);`,
            explanation: '模板字符串支持多行文本、变量插值\${expr}和任意表达式。比传统的字符串拼接+号更清晰易读，特别适合构建HTML片段。'
          }
        ]
      },
      {
        id: 'js-func',
        title: '函数',
        icon: '⚙️',
        description: '学习多种函数定义方式',
        difficulty: 'beginner',
        examples: [
          {
            title: '函数声明与箭头函数',
            code: `// 1. 函数声明式（有hoisting提升）
function add(a, b) {
    return a + b;
}

// 2. 函数表达式（无hoisting）
const subtract = function(a, b) {
    return a - b;
};

// 3. 箭头函数（ES6，简洁且无this绑定）
const multiply = (a, b) => a * b;           // 单行省略return和大括号
const greet = name => '你好, \${name}!';     // 单参数省略括号
const log = () => console.log("无参数");     // 无参数必须写空括号

console.log(add(3, 5));         // 8
console.log(subtract(10, 3));   // 7
console.log(multiply(4, 6));    // 24
console.log(greet("小红"));     // 你好, 小红!
log();                          // 无参数`,
            explanation: '函数声明会被提升到作用域顶部，而函数表达式不会。箭头函数语法更简洁，并且不绑定自己的this（继承外层），在回调中非常常用。'
          },
          {
            title: '回调函数',
            code: `// 回调函数：作为参数传递给另一个函数的函数
const numbers = [1, 2, 3, 4, 5];

// forEach - 遍历数组
numbers.forEach((num, index) => {
    console.log('索引\${index}: \${num}');
});

// filter - 过滤满足条件的元素
const evens = numbers.filter(n => n % 2 === 0);
console.log("偶数:", evens);   // [2, 4]

// map - 转换每个元素生成新数组
const doubled = numbers.map(n => n * 2);
console.log("翻倍:", doubled); // [2, 4, 6, 8, 10]

// 自定义高阶函数（接收函数作为参数）
function calculate(a, b, operation) {
    return operation(a, b);
}
console.log(calculate(10, 3, (x, y) => x + y));  // 13
console.log(calculate(10, 3, (x, y) => x ** y)); // 1000`,
            explanation: '回调函数是JS异步编程的核心概念。forEach/map/filter都是接受回调的高阶函数。自定义calculate展示了"策略模式"——通过传入不同函数改变行为。'
          },
          {
            title: '默认参数与剩余参数',
            code: `// 默认参数 - 参数未传时使用默认值
function greet(name, greeting = "你好") {
    return '\${greeting}, \${name}!';
}
console.log(greet("小明"));             // 你好, 小明!
console.log(greet("小明", "早上好"));   // 早上好, 小明!

// 剩余参数 ...args - 收集多余参数为数组
function sum(...nums) {
    return nums.reduce((total, n) => total + n, 0);
}
console.log(sum(1, 2, 3));              // 6
console.log(sum(1, 2, 3, 4, 5));       // 15

// 展开运算符 ... - 将数组展开为独立参数
const arr = [10, 20, 30];
console.log(Math.max(...arr));          // 30
console.log([...arr, 40, 50]);         // [10,20,30,40,50]

// 合并对象
const defaults = { theme: "dark", lang: "zh" };
const userPrefs = { lang: "en", fontSize: 14 };
const merged = { ...defaults, ...userPrefs };
console.log(merged);  // { theme:"dark", lang:"en", fontSize:14 }`,
            explanation: '默认参数简化了函数调用，无需手动检查undefined。剩余参数...args将多个参数收集为数组，展开运算符...则相反——将数组拆散。两者都极大提升了灵活性。'
          }
        ]
      },
      {
        id: 'js-control',
        title: '控制语句与循环',
        icon: '🔀',
        description: '学习条件判断和高阶数组方法',
        difficulty: 'beginner',
        examples: [
          {
            title: 'if / else / 三元运算符',
            code: `const score = 78;

// if-else-if 链式判断
if (score >= 90) {
    console.log("优秀");
} else if (score >= 80) {
    console.log("良好");
} else if (score >= 60) {
    console.log("及格");
} else {
    console.log("不及格");
}

// 三元运算符 - 简单二选一的简写
const level = score >= 60 ? "通过" : "未通过";
console.log(level);  // 通过

// 嵌套三元（复杂时不推荐）
const grade = score >= 90 ? "A" : score >= 80 ? "B" : score >= 70 ? "C" : "D";
console.log(grade);  // C

// 可选链 ?. 和 空值合并 ?? （ES2020）
const user = null;
console.log(user?.name);          // undefined（安全访问）
console.log(user?.name ?? "访客"); // 访客（null/undefined时回退）`,
            explanation: 'if-else是最基础的条件控制。三元运算符?:适合简单判断，一行搞定。可选链?.防止null/undefined报错，??只在值为null或undefined时触发回退（不同于||）。'
          },
          {
            title: 'for 循环与 for...of',
            code: `const fruits = ["苹果", "香蕉", "橙子"];

// 传统 for 循环（需要索引时）
for (let i = 0; i < fruits.length; i++) {
    console.log('[\${i}] \${fruits[i]}');
}

// for...of 循环（遍历值，更简洁）
for (const fruit of fruits) {
    console.log(fruit);
}

// for...in 循环（遍历对象的键，一般不用来遍历数组）
const person = { name: "小明", age: 25, city: "北京" };
for (const key in person) {
    console.log('\${key}: \${person[key]}');
}

// while 循环
let count = 0;
while (count < 3) {
    console.log('计数: \${count++}');
}`,
            explanation: 'for循环经典三段式（初始化; 条件; 更新）功能完整但较繁琐。for...of专门用于迭代可迭代对象（数组、Map、Set等），代码更清晰。for...in用于遍历对象属性名。'
          },
          {
            title: 'forEach / map / filter / reduce',
            code: `const numbers = [5, 12, 8, 20, 3];

// forEach - 纯遍历，无返回值
numbers.forEach(n => console.log('数字: \${n}'));

// map - 映射转换，返回新数组
const doubled = numbers.map(n => n * 2);
console.log("翻倍:", doubled);  // [10,16,24,40,6]

// filter - 过滤筛选，返回符合条件的元素
const bigNums = numbers.filter(n => n >= 10);
console.log(">=10:", bigNums);  // [12,20]

// reduce - 归约聚合，将数组缩减为单个值
const sum = numbers.reduce((acc, cur) => acc + cur, 0);
const max = numbers.reduce((a, b) => Math.max(a, b));
console.log("求和:", sum);      // 48
console.log("最大值:", max);    // 20

// 链式调用 - 组合使用
const result = numbers
    .filter(n => n > 5)
    .map(n => n ** 2)
    .reduce((a, b) => a + b, 0);
console.log("链式结果:", result); // 12² + 8² + 20² = 608`,
            explanation: '这四个方法是数组操作的核心工具集。forEach只遍历；map做一对一转换；filter做筛选过滤；reduce做聚合计算。它们可以链式组合，实现强大的数据管道处理。'
          }
        ]
      },
      {
        id: 'js-object',
        title: '对象与数组',
        icon: '📦',
        description: '深入理解JS对象和数组操作',
        difficulty: 'beginner',
        examples: [
          {
            title: '对象字面量、属性访问与解构',
            code: `// 对象字面量创建
const student = {
    name: "小明",
    age: 18,
    scores: { math: 95, english: 88 },
    greet() {
        return '我是\${this.name}';
    }
};

// 属性访问方式
console.log(student.name);       // 点号法
console.log(student["age"]);     // 方括号法（动态键）
const key = "name";
console.log(student[key]);       // 小明

// 解构赋值 - 从对象中提取值到变量
const { name, age, scores } = student;
console.log(name, age, scores);

// 解构并重命名 + 默认值
const { name: myName, gender = "未知" } = student;
console.log(myName, gender);     // 小明 未知

// 嵌套解构
const { scores: { math } } = student;
console.log(math);               // 95`,
            explanation: '对象是JS的核心数据结构。点号法简洁，方括号法支持动态键名。解构赋值让提取对象属性变得极其方便，还支持重命名、默认值和嵌套解构。'
          },
          {
            title: '数组常用方法',
            code: `const arr = ["a", "b", "c", "d", "e"];

// 添加元素
arr.push("f");       // 尾部添加 -> ["a","b","c","d","e","f"]
arr.unshift("0");    // 头部添加 -> ["0","a","b","c","d","e","f"]

// 删除元素
const last = arr.pop();    // 删尾部，返回"f"
const first = arr.shift(); // 删头部，返回"0"

// splice - 在任意位置增删改
const colors = ["红", "绿", "蓝", "黄"];
colors.splice(1, 1);              // 删除索引1的1个元素 -> ["红","蓝","黄"]
colors.splice(1, 0, "紫");        // 在索引1处插入"紫" -> ["红","紫","蓝","黄"]
colors.splice(0, 2, "黑", "白");  // 替换前2个 -> ["黑","白","蓝","黄"]

// slice - 截取子数组（不修改原数组）
const nums = [0, 1, 2, 3, 4, 5];
const sub = nums.slice(1, 4);     // [1,2,3]（含头不含尾）
const copy = nums.slice();        // 浅拷贝整个数组

console.log(sub, copy);`,
            explanation: 'push/pop操作尾部、shift/unshift操作头部。splice是最灵活的方法——可以同时完成插入、删除、替换。slice则安全地截取子数组而不影响原数组，常用于浅拷贝。'
          },
          {
            title: '展开运算符与剩余参数',
            code: `// 数组展开 - 合并、复制、转参数
const a = [1, 2, 3];
const b = [4, 5, 6];

// 合并数组
const merged = [...a, ...b];          // [1,2,3,4,5,6]
// 浅拷贝
const copy = [...a];                  // [1,2,3]
// 作为函数参数
console.log(Math.max(...a));          // 3

// 对象展开 - 合并、覆盖
const base = { x: 1, y: 2, z: 3 };
const update = { y: 20, w: 4 };
const combined = { ...base, ...update }; // {x:1,y:20,z:3,w:4}

// 数组解构中的剩余元素
const [first, second, ...rest] = [10, 20, 30, 40, 50];
console.log(first, second, rest);   // 10 20 [30,40,50]

// 对象解构中的剩余属性
const { x, ...others } = { x: 1, y: 2, z: 3, w: 4 };
console.log(x, others);             // 1 {y:2,z:3,w:4}`,
            explanation: '展开运算符...在不同场景含义不同：在数组/对象字面量中是"展开"；在函数参数中是"收集"。对象展开时后面的会覆盖前面的同名属性，这个特性广泛用于状态管理中的state更新。'
          }
        ]
      },
      {
        id: 'js-dom',
        title: 'DOM操作',
        icon: '📚',
        description: '学习网页元素的选择、修改和事件处理',
        difficulty: 'intermediate',
        examples: [
          {
            title: 'querySelector 与 getElementById',
            code: `<!-- HTML结构 -->
<!--
<div id="app">
    <h1 class="title">标题<\/h1>
    <p class="text">段落一<\/p>
    <p class="text">段落二<\/p>
    <button id="btn">点击我<\/button>
<\/div>
-->

// getElementById - 通过ID获取唯一元素
const btn = document.getElementById("btn");

// getElementsByClassName - 通过类名获取集合（HTMLCollection）
const texts = document.getElementsByClassName("text");
console.log(texts.length);  // 2

// querySelector - 通过CSS选择器获取第一个匹配元素
const h1 = document.querySelector(".title");
const firstP = document.querySelector("p.text");

// querySelectorAll - 获取所有匹配元素（NodeList）
const allPs = document.querySelectorAll("p.text");
allPs.forEach(p => console.log(p.textContent));

// 推荐统一使用querySelector系列（更强大一致）
document.querySelector("#app > h1").style.color = "red";`,
            explanation: 'DOM选择器是操作网页的基础。getElementById速度快但只能按ID。querySelector/querySelectorAll支持任意CSS选择器（#id、.class、[attr]、>子代等），功能更强且API统一，是现代开发的首选。'
          },
          {
            title: '修改文本、样式与classList',
            code: `const box = document.getElementById("box");

// 修改文本内容
box.textContent = "纯文本内容";       // 设置纯文本（自动转义HTML）
box.innerHTML = "<b>富文本</b>内容";   // 设置HTML（可解析标签）

// 读取和设置样式（行内样式）
box.style.color = "#333";
box.style.fontSize = "18px";
box.style.padding = "16px";

// 使用classList操作CSS类（推荐）
box.classList.add("active");       // 添加类
box.classList.remove("hidden");    // 移除类
box.classList.toggle("visible");   // 切换类（有则删无则加）
console.log(box.classList.contains("active")); // true

// 操作属性
const link = document.querySelector("a");
link.setAttribute("href", "https://example.com");
console.log(link.getAttribute("href"));
link.removeAttribute("target");

// 创建新元素并添加到DOM
const newDiv = document.createElement("div");
newDiv.textContent = "动态创建的元素";
newDiv.className = "card";
document.body.appendChild(newDiv);`,
            explanation: 'textContent设置纯文本更安全（防XSS），innerHTML可解析HTML。style直接操作行内样式但不够优雅，推荐通过classList增删class配合CSS来管理样式。createElement+appendChild是动态构建DOM的标准方式。'
          },
          {
            title: 'addEventListener 事件监听',
            code: `<!-- HTML -->
<!--
<button id="clickBtn">点我试试<\/button>
<input type="text" id="inputField" placeholder="输入文字">
<div id="output">等待操作...<\/div>
-->

const btn = document.getElementById("clickBtn");
const input = document.getElementById("inputField");
const output = document.getElementById("output");

// 点击事件 - 点击按钮改变内容
btn.addEventListener("click", function() {
    output.textContent = "按钮被点击了！";
    output.style.color = "blue";
});

// 输入事件 - 实时监听用户输入
input.addEventListener("input", function(e) {
    output.textContent = '你正在输入: \${e.target.value}';
});

// 键盘事件 - 监听Enter键
input.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        output.textContent = '提交内容: \${input.value}';
        input.value = "";  // 清空输入框
    }
});

// 事件委托 - 利用冒泡机制优化性能
const list = document.getElementById("list");
list.addEventListener("click", function(e) {
    if (e.target.tagName === "LI") {
        console.log("点击了:", e.target.textContent);
        e.target.style.backgroundColor = "#eee";
    }
});`,
            explanation: 'addEventListener是现代事件绑定的标准方式，支持同一元素的多个监听器。事件对象e包含丰富信息：target指向实际触发的元素、key获取按键值等。事件委托利用冒泡机制，只需在父元素上绑定一次即可处理所有子元素的事件，大幅提升性能。'
          }
        ]
      },
      {
        id: 'js-async',
        title: '异步编程',
        icon: '🔄',
        description: '掌握Promise、async/await和fetch请求',
        difficulty: 'intermediate',
        examples: [
          {
            title: 'Promise 创建与链式调用',
            code: `// 创建Promise - 封装异步操作
function delay(ms) {
    return new Promise(resolve => {
        setTimeout(() => resolve('等待了\${ms}毫秒'), ms);
    });
}

function fetchUserData(userId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (userId > 0) {
                resolve({ id: userId, name: "用户" + userId });
            } else {
                reject(new Error("无效的用户ID"));
            }
        }, 500);
    });
}

// then/catch 链式调用
fetchUserData(1)
    .then(user => {
        console.log("获取到用户:", user);
        return delay(1000);           // 返回新的Promise继续链式调用
    })
    .then(msg => {
        console.log(msg);             // "等待了1000毫秒"
        return fetchUserData(-1);      // 故意触发错误
    })
    .catch(err => {
        console.error("出错啦:", err.message);  // "无效的用户ID"
    })
    .finally(() => {
        console.log("无论成功失败都会执行");
    });

// Promise.all - 并行执行多个Promise
Promise.all([
    delay(500),
    delay(300),
    delay(800)
]).then(results => console.log("全部完成", results));

// Promise.race - 返回最先完成的
Promise.race([delay(100), delay(50)]).then(r => console.log("最快:", r));`,
            explanation: 'Promise代表一个异步操作的最终结果（成功fulfilled/失败rejected/pending待定）。then注册成功回调，catch捕获错误，finally做清理工作。Promise.all并行执行全部完成才返回，race取最快的结果。链式调用避免了"回调地狱"。'
          },
          {
            title: 'async / await 语法糖',
            code: `// async/await - 让异步代码看起来像同步代码
async function getUserData() {
    try {
        console.log("开始获取...");
        const response = await fetch("https://jsonplaceholder.typicode.com/users/1");
        const data = await response.json();
        console.log("用户数据:", data.name, data.email);
        return data;
    } catch (error) {
        console.error("请求失败:", error);
        return null;
    }
}

// 调用async函数（返回Promise）
getUserData().then(user => {
    if (user) console.log("处理完毕");
});

// async函数中可以混用普通Promise
async function demo() {
    const [result1, result2] = await Promise.all([
        delay(500),
        delay(300)
    ]);
    console.log(result1, result2);

    // for...of + await 顺序处理
    const urls = ["/api/a", "/api/b", "/api/c"];
    for (const url of urls) {
        const res = await fetch(url);
        console.log(await res.json());
    }
}

// 注意：await只能在async函数内使用
// 顶层await（模块顶层）在现代浏览器/Node中已支持`,
            explanation: 'async/await是Promise的语法糖，让异步代码以同步的方式书写，彻底消灭嵌套回调。try/catch替代.catch()处理错误更符合直觉。注意await会阻塞当前async函数的执行直到Promise完成，但不会阻塞主线程。'
          },
          {
            title: 'fetch API 获取数据',
            code: `// GET请求 - 获取JSON数据
async function fetchPosts() {
    const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts?_limit=3"
    );

    // 检查HTTP状态
    if (!response.ok) {
        throw new Error('HTTP错误! 状态: \${response.status}');
    }

    const posts = await response.json();  // 解析JSON响应体
    posts.forEach(post => {
        console.log('[\${post.id}] \${post.title}');
    });

    return posts;
}

// POST请求 - 发送JSON数据
async function createPost(title, body) {
    const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title, body, userId: 1 }),
        }
    );

    const newPost = await response.json();
    console.log("创建成功:", newPost.id);
    return newPost;
}

// 带错误处理的完整示例
async function loadData() {
    try {
        const posts = await fetchPosts();
        console.log('加载了 \${posts.length} 篇文章');
        
        const created = await createPost("我的文章", "这是内容");
        console.log("新文章ID:", created.id);
    } catch (err) {
        console.error("网络请求出错:", err.message);
    }
}

loadData();`,
            explanation: 'fetch是浏览器原生提供的网络请求API，返回Promise。GET请求直接调用fetch(url)；POST需配置method、headers（Content-Type声明JSON）、body（JSON.stringify序列化）。务必检查response.ok和处理response.json()解析。搭配async/await使网络请求代码清晰易读。'
          }
        ]
      },
      {
        id: 'js-advanced',
        title: 'ES6+高级特性',
        icon: '🧩',
        description: '模块化、class、Proxy等现代JS特性',
        difficulty: 'intermediate',
        examples: [
          {
            title: 'import / export 模块化',
            code: `// ===== utils.js（导出模块）=====

// 命名导出（可以有多个）
export const PI = 3.14159;

export function add(a, b) {
    return a + b;
}

export function multiply(a, b) {
    return a * b;
}

export class Calculator {
    constructor(initialValue = 0) {
        this.value = initialValue;
    }
    add(n) { this.value += n; return this; }
    getResult() { return this.value; }
}

// 默认导出（每个模块只能有一个）
export default {
    version: "1.0.0",
    author: "小明"
};


// ===== main.js（导入模块）=====

// 导入默认导出
import config from "./utils.js";
console.log(config.version);  // "1.0.0"

// 导入命名导出
import { PI, add, multiply } from "./utils.js";
console.log(add(PI, 1));     // 4.14159

// 导入全部命名导出到对象
import * as utils from "./utils.js";
console.log(utils.multiply(3, 7));  // 21

// 重命名导入
import { add as sum } from "./utils.js";
console.log(sum(10, 20));   // 30

// 同时导入默认和命名
import pkg, { Calculator } from "./utils.js";
const calc = new Calculator(10).add(5);
console.log(calc.getResult());  // 15`,
            explanation: 'ES Modules是JavaScript官方的模块系统。export导出、import导入，支持命名导出（多个）和默认导出（一个）。模块化让代码组织更清晰、避免全局污染、支持tree-shaking优化打包体积。'
          },
          {
            title: 'class 类与继承',
            code: `// 定义基类
class Animal {
    // 构造函数 - 创建实例时自动调用
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    // 实例方法
    speak() {
        return '\${this.name}发出了声音';
    }

    // getter/setter - 属性访问拦截
    get info() {
        return '\${this.name}, \${this.age}岁';
    }

    set info(value) {
        const [name, age] = value.split(", ");
        this.name = name;
        this.age = parseInt(age);
    }

    // 静态方法 - 通过类名调用，不属于实例
    static compareAge(a1, a2) {
        return a1.age - a2.age;
    }
}

// 继承 - extends关键字
class Dog extends Animal {
    constructor(name, age, breed) {
        super(name, age);  // 必须先调用父类构造函数
        this.breed = breed;
    }

    // 方法重写（override）
    speak() {
        return '\${this.name}(一只\${this.breed})汪汪叫!';
    }

    // 新增方法
    fetch() {
        return '\${this.name}去捡球了!';
    }
}

// 使用
const dog = new Dog("旺财", 3, "金毛");
console.log(dog.speak());     // 旺财(一只金毛)汪汪叫!
console.log(dog.fetch());     // 旺财去捡球了!
console.log(dog.info);        // 旺财, 3岁
console.log(Dog.compareAge(dog, new Animal("猫", 5)));  // -2`,
            explanation: 'class是ES6引入的面向对象语法糖（底层仍是原型链）。constructor定义构造函数，extends实现继承，super调用父类方法。静态方法static属于类本身而非实例。getter/setter提供对属性读写的拦截能力。方法重写让子类可以定制父类行为。'
          },
          {
            title: 'Proxy 代理',
            code: `// Proxy - 拦截和自定义对象的基本操作
const target = {
    name: "小明",
    age: 25,
    _secret: "密码123"
};

// 创建代理 - get/set拦截
const handler = {
    // 读取属性时触发
    get(obj, prop) {
        console.log('读取属性: \${prop}');
        if (prop.startsWith("_")) {
            console.warn("⚠️ 禁止访问私有属性!");
            return "[受保护]";
        }
        return obj[prop];
    },

    // 设置属性时触发
    set(obj, prop, value) {
        console.log('设置 \${prop} = \${value}');
        if (prop === "age" && typeof value !== "number") {
            throw new TypeError("年龄必须是数字!");
        }
        obj[prop] = value;
        return true;  // 表示设置成功
    },

    // in 操作符拦截
    has(obj, prop) {
        if (prop.startsWith("_")) return false;  // 隐藏私有属性
        return prop in obj;
    },

    // delete 操作拦截
    deleteProperty(obj, prop) {
        console.log('尝试删除: \${prop}');
        if (prop === "name") {
            throw new Error("不允许删除name!");
        }
        delete obj[prop];
        return true;
    }
};

const proxy = new Proxy(target, handler);

// 测试代理
console.log(proxy.name);      // 触发get -> "小明"
console.log(proxy._secret);   // 触发get -> "[受保护]"
proxy.age = 26;              // 触发set
// proxy.age = "二十六";      // 抛出TypeError!
console.log("_secret" in proxy);  // false（被隐藏）

// 实际应用：数据校验/日志/虚拟DOM
function createValidator(rules) {
    return new Proxy({}, {
        set(obj, prop, value) {
            const rule = rules[prop];
            if (rule && !rule.validate(value)) {
                throw new Error(rule.message);
            }
            obj[prop] = value;
            return true;
        }
    });
}

const form = createValidator({
    email: { validate: v => v.includes("@"), message: "邮箱格式错误!" },
    age: { validate: v => v >= 0 && v <= 150, message: "年龄范围0-150!" }
});
form.email = "test@test.com";  // OK
// form.email = "invalid";      // Error: 邮箱格式错误!`,
            explanation: 'Proxy是元编程的核心API，可以拦截对象上的13种操作（get/set/has/deleteProperty等）。应用场景包括：数据验证（如表单校验）、属性保护（如私有属性隐藏）、观察者模式（Vue3的reactive底层就是Proxy）、日志记录等。相比Object.defineProperty，Proxy能检测属性的添加和删除。'
          }
        ]
      },
      {
        id: 'js-project',
        title: '综合实战：待办事项应用',
        icon: '🎯',
        description: '从零构建完整的Todo应用',
        difficulty: 'advanced',
        examples: [
          {
            title: 'HTML 结构',
            code: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Todo 待办事项<\/title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            padding-top: 60px;
        }
        .container {
            background: white;
            border-radius: 16px;
            padding: 32px;
            width: 480px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.2);
        }
        h1 { text-align: center; color: #333; margin-bottom: 24px; }
        .input-area {
            display: flex; gap: 12px; margin-bottom: 24px;
        }
        input[type="text"] {
            flex: 1; padding: 12px 16px;
            border: 2px solid #e2e8f0; border-radius: 8px;
            font-size: 15px; outline: none; transition: border-color 0.3s;
        }
        input:focus { border-color: #667eea; }
        button {
            padding: 12px 20px; border: none; border-radius: 8px;
            cursor: pointer; font-weight: 600; transition: transform 0.2s;
        }
        button:hover { transform: scale(1.05); }
        .add-btn { background: #667eea; color: white; }
        .todo-list { list-style: none; }
        .todo-item {
            display: flex; align-items: center;
            padding: 14px 16px; margin-bottom: 8px;
            background: #f8fafc; border-radius: 8px;
            animation: slideIn 0.3s ease;
        }
        @keyframes slideIn {
            from { opacity: 0; transform: translateX(-20px); }
            to { opacity: 1; transform: translateX(0); }
        }
        .todo-item.completed span { text-decoration: line-through; color: #94a3b8; }
        input[type="checkbox"] { width: 20px; height: 20px; margin-right: 12px; cursor: pointer; }
        .todo-text { flex: 1; font-size: 15px; }
        .delete-btn {
            background: #fee2e2; color: #dc2626; padding: 6px 12px; font-size: 13px;
        }
        .empty-state { text-align: center; color: #94a3b8; padding: 32px; }
        .stats { text-align: center; color: #64748b; font-size: 14px; margin-top: 16px; }
    <\/style>
<\/head>
<body>
    <div class="container">
        <h1>📝 我的待办事项<\/h1>
        <div class="input-area">
            <input type="text" id="todoInput" placeholder="输入新的待办事项..." />
            <button class="add-btn" onclick="addTodo()">添加<\/button>
        <\/div>
        <ul class="todo-list" id="todoList"><\/ul>
        <p class="stats" id="stats"><\/p>
    <\/div>
    <script src="app.js"><\/script>
<\/body>
<\/html>`,
            explanation: '完整的HTML骨架包含语义化结构和嵌入式CSS。使用了Flexbox布局、渐变背景、圆角阴影等现代CSS特性。input区域用于输入新任务，ul列表展示todo项，stats显示统计信息。动画@keyframes让新增项平滑滑入。'
          },
          {
            title: 'JS 核心逻辑',
            code: `// ===== app.js - Todo应用核心逻辑 =====

// 从localStorage读取数据（持久化存储）
let todos = JSON.parse(localStorage.getItem("todos")) || [];

// DOM元素引用
const input = document.getElementById("todoInput");
const list = document.getElementById("todoList");
const statsEl = document.getElementById("stats");

// 渲染整个列表
function render() {
    list.innerHTML = "";
    
    if (todos.length === 0) {
        list.innerHTML = '<li class="empty-state">暂无待办事项 ✨<\/li>';
    } else {
        todos.forEach((todo, index) => {
            const li = document.createElement("li");
            li.className = 'todo-item ' + (todo.done ? "completed" : "");
            
            li.innerHTML = '<input type="checkbox" ' + (todo.done ? "checked" : "") + ' onchange="toggleTodo(' + index + ')"><span class="todo-text">' + escapeHtml(todo.text) + '<\/span><button class="delete-btn" onclick="deleteTodo(' + index + ')">删除<\/button>';
            
            list.appendChild(li);
        });
    }
    
    updateStats();
    saveTodos();
}

// 添加新任务
function addTodo() {
    const text = input.value.trim();
    if (!text) {
        input.style.borderColor = "#dc2626";
        setTimeout(() => input.style.borderColor = "", 1000);
        return;
    }
    
    todos.unshift({ text, done: false });  // 添加到头部
    input.value = "";                      // 清空输入框
    render();
    input.focus();
}

// 切换完成状态
function toggleTodo(index) {
    todos[index].done = !todos[index].done;
    render();
}

// 删除任务
function deleteTodo(index) {
    todos.splice(index, 1);
    render();
}

// 更新统计信息
function updateStats() {
    const total = todos.length;
    const done = todos.filter(t => t.done).length;
    statsEl.textContent = total > 0 
        ? '共 ' + total + ' 项，已完成 ' + done + ' 项' 
        : "";
}

// 保存到localStorage（本地持久化）
function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
}

// XSS防护 - 转义HTML特殊字符
function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

// 支持回车键添加
input.addEventListener("keydown", e => {
    if (e.key === "Enter") addTodo();
});

// 初始渲染
render();`,
            explanation: '核心数据模型是todos数组，每项包含text和done字段。render()函数负责根据数据重新渲染整个UI——这是"数据驱动UI"的思想雏形。localStorage实现页面刷新后数据不丢失。XSS防护通过textContent转义防止恶意脚本注入。unshift让新任务出现在顶部。filter快速统计已完成数量。整体架构清晰：数据→渲染→事件→更新数据→重新渲染。'
          }
        ]
      }
    ]
  }
