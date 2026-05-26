---
id: typescript
name: TypeScript
icon: TS
version: '5.x'
description: JavaScript的超集，增加类型检查
---

## 类型基础 <!-- tutorial-id: ts-basics | icon: 👋 | difficulty: beginner -->
TypeScript的核心类型系统

### 基础类型声明

```typescript
// 字符串类型
let name: string = "小明";
let greeting: string = '你好, ${name}!';

// 数字类型（整数和浮点数都是 number）
let age: number = 25;
let score: number = 95.5;
let hex: number = 0xf00d;   // 十六进制
let binary: number = 0b1010; // 二进制

// 布尔类型
let isStudent: boolean = true;
let isActive: boolean = false;

console.log(name, age, isStudent);
```

> TypeScript 的基础类型包括 string（字符串）、number（数字，包含整数和浮点数）和 boolean（布尔值）。使用冒号 : 进行类型注解，让编译器在编码阶段就能发现类型错误。

### 数组类型

```typescript
// 方式一：类型后加方括号 - 元素全是字符串
let fruits: string[] = ["苹果", "香蕉", "橙子"];

// 方式二：数组泛型 Array<元素类型>
let scores: Array<number> = [90, 85, 100];

// 二维数组
let matrix: number[][] = [[1, 2], [3, 4]];

// 添加和访问元素
fruits.push("葡萄");
console.log(fruits[0]); // "苹果"
console.log(scores.length); // 3
```

> TypeScript 中有两种方式定义数组类型：string[] 和 Array<number>，两者完全等价。数组中的所有元素必须是同一类型，这比 JavaScript 更安全。

### 特殊类型

```typescript
// 字面量类型 - 只能是特定值
let direction: "up" | "down" | "left" | "right" = "up";

// any 类型 - 跳过类型检查（不推荐）
let anything: anything = 42;
anything = "可以是任何类型";

// unknown 类型 - 安全的 any，必须收窄后才能用
let value: unknown = "hello";
if (typeof value === "string") {
    console.log(value.toUpperCase()); // 收窄后才可操作
}

// never 类型 - 永远不会返回的函数
function throwError(msg: string): never {
    throw new Error(msg);
}

// void 类型 - 没有返回值的函数
function log(msg: string): void {
    console.log(msg);
}

// null 和 undefined
let empty: null = null;
let notDefined: undefined = undefined;
```

> 字面量类型限制变量只能是特定的值；any 可以绕过所有类型检查但会丧失 TS 的优势；unknown 是更安全的 any；never 表示永远不会正常返回；void 用于无返回值的函数；null 和 undefined 是各自的独立类型。

## 高级类型 <!-- tutorial-id: ts-advanced-types | icon: 📦 | difficulty: beginner -->
interface/type/联合/交叉/泛型入门

### Interface 定义对象形状

```typescript
// 定义用户接口 - 描述对象的形状
interface User {
    name: string;
    age: number;
    email?: string;       // 可选属性，加 ?
    readonly id: number;  // 只读属性，不可修改
}

// 使用接口
const user: User = {
    id: 1,
    name: "小明",
    age: 25,
    // email 是可选的，可以不写
};

// user.id = 2; // 错误！readonly 属性不能修改

// 接口可以扩展
interface Admin extends User {
    permissions: string[];
}

const admin: Admin = {
    id: 1,
    name: "管理员",
    age: 30,
    permissions: ["read", "write", "delete"]
};
```

> interface 用于定义对象的结构（形状）。? 标记可选属性，readonly 标记只读属性。extends 关键字可以继承并扩展现有接口，实现代码复用。

### Type 别名与联合/交叉类型

```typescript
// Type 别名 - 给类型起名字
type ID = number | string;
type Name = string;

// 联合类型 - 值可以是多种类型之一
function printId(id: ID) {
    if (typeof id === "string") {
        console.log(id.toUpperCase());
    } else {
        console.log(id);
    }
}
printId("abc"); // ABC
printId(123);   // 123

// 交叉类型 - 合并多个类型的所有属性
type Colorful = { color: string };
type Circle = { radius: number };

type ColorfulCircle = Colorful & Circle;

const circle: ColorfulCircle = {
    color: "red",
    radius: 10
};

// 字面量联合类型 - 枚举替代方案
type Theme = "light" | "dark" | "auto";
let currentTheme: Theme = "dark";
```

> type 关键字用于创建类型别名，让复杂类型可复用。联合类型 | 表示"或"，值可以是列出的任一类型。交叉类型 & 表示"且"，合并多个类型的属性。联合字面量常用于模拟枚举。

### 泛型入门

```typescript
// 泛型函数 - <T> 是类型参数，像函数参数一样传入类型
function identity<T>(arg: T): T {
    return arg;
}

// 使用时指定类型或自动推断
let result1 = identity<string>("hello"); // 显式指定
let result2 = identity(42);              // 自动推断为 number

// 泛型接口
interface Box<T> {
    contents: T;
}

let stringBox: Box<string> = { contents: "文本" };
let numberBox: Box<number> = { contents: 123 };

// 多个泛型参数
function pair<K, V>(key: K, value: V): [K, V] {
    return [key, value];
}

let entry = pair("name", "小明"); // [string, string]
let idEntry = pair(1, "admin");   // [number, string]
```

> 泛型（Generics）让代码可以处理多种类型而不失类型安全。<T> 是类型变量，使用时才确定具体类型。泛型使函数、接口、类具备更好的复用性——一套代码适用于 string、number 等任意类型。

## 函数类型 <!-- tutorial-id: ts-functions | icon: ⚙️ | difficulty: beginner -->
参数类型、返回值类型和函数重载

### 参数与返回值类型注解

```typescript
// 完整的类型注解
function add(a: number, b: number): number {
    return a + b;
}

// 返回值类型可以省略（自动推断）
function multiply(x: number, y: number) {
    return x * y; // 自动推断为 number
}

// 无返回值用 void
function greet(name: string): void {
    console.log('你好, ${name}!');
}

// 箭头函数的类型注解
const double = (n: number): number => n * 2;

// 函数表达式类型
let myFunc: (x: number, y: number) => number = add;
```

> 每个参数都可以标注类型，返回值用 : 类型标注。void 表示没有返回值。箭头函数同样支持完整类型注解。函数变量的类型写成 (参数列表) => 返回值 的形式。

### 可选参数与默认参数

```typescript
// 可选参数 - 加 ?，必须放在必需参数后面
function buildName(firstName: string, lastName?: string): string {
    if (lastName) {
        return '${firstName} ${lastName}';
    }
    return firstName;
}
buildName("张");           // "张"
buildName("张", "三");     // "张 三"

// 默认参数 - 用 = 提供默认值
function createUser(name: string, role: string = "user") {
    return { name, role };
}
createUser("小明");         // { name: "小明", role: "user" }
createUser("Admin", "admin"); // { name: "Admin", role: "admin" }

// 剩余参数 ...rest
function sum(...numbers: number[]): number {
    return numbers.reduce((total, n) => total + n, 0);
}
sum(1, 2, 3, 4, 5); // 15
```

> 可选参数 ? 允许调用时不传该参数，且必须在必选参数之后。默认参数 = 在未传参时使用预设值。剩余参数 ...args 将多余参数收集为数组，常用于处理不定数量参数的场景。

### 函数重载

```typescript
// 重载签名 - 先声明多个函数签名
function process(value: string): string;       // 签名1
function process(value: number): number;       // 签名2
function process(value: string | number): string | number {
    // 实现
    if (typeof value === "string") {
        return value.toUpperCase();
    }
    return value * 2;
}

process("hello"); // "HELLO" - 返回 string
process(5);       // 10     - 返回 number

// 回调函数类型注解
function fetchData(
    url: string,
    callback: (data: string) => void
): void {
    // 模拟异步获取数据
    setTimeout(() => callback("数据已加载"), 1000);
}

fetchData("/api/users", (data) => {
    console.log(data); // data 自动推断为 string
});
```

> 函数重载允许同一函数名有不同参数/返回值类型组合。先写重载签名（只有类型），再写实现。回调函数的参数类型也要标注，这样在回调内就有完整的类型提示和检查。

## 类与修饰符 <!-- tutorial-id: ts-class | icon: 🔀 | difficulty: intermediate -->
class的访问控制和readonly

### 访问修饰符

```typescript
class Person {
    // public - 默认，anywhere 都可访问
    public name: string;

    // private - 只有类内部可访问
    private _age: number;

    // protected - 类及其子类可访问
    protected email: string;

    constructor(name: string, age: number, email: string) {
        this.name = name;
        this._age = age;
        this.email = email;
    }

    public introduce(): string {
        return '我是${this.name}, ${this._age}岁';
    }

    // 私有方法
    private calculateBirthYear(): number {
        return new Date().getFullYear() - this._age;
    }
}

const p = new Person("小明", 25, "xiaoming@test.com");
console.log(p.name);        // ✅ public
// console.log(p._age);     // ❌ Error! private
// console.log(p.email);    // ❌ Error! protected
```

> public（公开）、private（私有）、protected（受保护）是三种访问级别。public 默认可省略；private 仅限类内部使用；protected 允许子类访问。合理使用修饰符能封装内部细节，提高代码安全性。

### 抽象类与接口实现

```typescript
// 抽象类 - 不能直接实例化，必须被继承
abstract class Animal {
    abstract makeSound(): void;  // 抽象方法，子类必须实现

    move(): void {
        console.log("动物在移动");
    }
}

class Dog extends Animal {
    constructor(private name: string) {
        super();
    }

    // 必须实现抽象方法
    makeSound(): void {
        console.log('${this.name}: 汪汪!');
    }
}

const dog = new Dog("旺财");
dog.makeSound(); // 旺财: 汪汪!
dog.move();      // 动物在移动

// implements 实现接口
interface Drawable {
    draw(): void;
}

class Circle implements Drawable {
    constructor(private radius: number) {}

    draw(): void {
        console.log('绘制半径为 ${this.radius} 的圆');
    }
}
```

> abstract 抽象类定义通用模板，abstract 方法强制子类实现。implements 让类遵循接口契约，必须实现接口中声明的所有方法。抽象类适合"is-a"关系，接口适合"can-do"能力描述。

### 存取器 get/set 与 readonly

```typescript
class BankAccount {
    // readonly - 只能在构造函数中赋值
    public readonly accountNumber: string;
    private _balance: number = 0;

    constructor(accountNumber: string) {
        this.accountNumber = accountNumber;
    }

    // getter - 获取值时可添加逻辑
    get balance(): number {
        return this._balance;
    }

    // setter - 设置值时可做验证
    set balance(amount: number) {
        if (amount < 0) {
            throw new Error("余额不能为负数");
        }
        this._balance = amount;
    }

    deposit(amount: number): void {
        if (amount <= 0) throw new Error("存款金额须大于0");
        this._balance += amount;
    }
}

const account = new BankAccount("6222021234567");
account.deposit(1000);
console.log(account.balance); // 1000 - 通过 getter
account.balance = 2000;       // 通过 setter
// account.accountNumber = "xxx"; // ❌ readonly 不能修改
```

> get/set 存取器允许控制属性的读写行为，可在 getter 中计算派生值，在 setter 中加入验证逻辑。readonly 修饰符确保属性一旦初始化就不能被外部修改，常用于 ID 等不应变化的字段。

## 工具类型 <!-- tutorial-id: ts-utilities | icon: 📚 | difficulty: intermediate -->
Partial/Pick/Omit/Record等内置工具类型

### Partial / Required / Readonly

```typescript
interface Todo {
    id: number;
    title: string;
    completed: boolean;
    dueDate: Date;
}

// Partial<T> - 所有属性变为可选
type PartialTodo = Partial<Todo>;
// 等价于: { id?: number; title?: string; completed?: boolean; dueDate?: Date; }

function updateTodo(id: number, fields: PartialTodo>): void {
    // fields 中每个属性都是可选的，调用者只需传想更新的字段
    console.log('更新 ${id}:', fields);
}
updateTodo(1, { completed: true }); // 只传一个字段即可

// Required<T> - 所有属性变为必需
type RequiredTodo = Required<PartialTodo>;

// Readonly<T> - 所有属性变为只读
type ReadonlyTodo = Readonly<Todo>;
// const todo: ReadonlyTodo = { id: 1, title: "学习TS", completed: false, dueDate: new Date() };
// todo.title = "xxx"; // ❌ 无法赋值，因为 readonly
```

> Partial<T> 将所有属性变为可选，非常适合更新操作（PATCH）。Required<T> 则相反，将所有属性设为必需。Readonly<T> 让所有属性变成只读，防止意外修改。这些都是 TypeScript 内置的工具类型。

### Pick / Omit / Record

```typescript
interface User {
    id: number;
    name: string;
    email: string;
    age: number;
    role: string;
}

// Pick<T, K> - 只选取指定的属性
type UserPreview = Pick<User, "name" | "email">;
// 结果: { name: string; email: string; }

function showUserPreview(user: UserPreview): void {
    console.log('用户: ${user.name}, 邮箱: ${user.email}');
}

// Omit<T, K> - 排除指定的属性
type CreateUserInput = Omit<User, "id">;
// 结果: { name: string; email: string; age: number; role: string; }
// 创建用户时不需要传 id（由后端生成）

// Record<K, V> - 创建键值对映射类型
type RolePermissions = Record<string, string[]>;
const permissions: RolePermissions = {
    admin:    ["read", "write", "delete"],
    editor:   ["read", "write"],
    viewer:   ["read"]
};
```

> Pick 从类型中挑选部分属性组成新类型，适合 API 响应精简。Omit 排除不需要的字段，常用于表单输入类型。Record<K, V> 快速创建对象映射类型，键是 K 类型，值是 V 类型。

### Exclude / Extract / ReturnType / Parameters

```typescript
type Theme = "light" | "dark" | "auto" | "system";

// Exclude<T, U> - 从 T 中排除 U 中的类型
type WithoutSystem = Exclude<Theme, "system">;
// 结果: "light" | "dark" | "auto"

// Extract<T, U> - 从 T 中提取 U 中也有的类型
type StringThemes = Extract<Theme, string>;
// 结果: "light" | "dark" | "auto" | "system"

// ReturnType<T> - 获取函数返回值类型
function getUser() {
    return { id: 1, name: "小明", age: 25 };
}
type UserReturn = ReturnType<typeof getUser>;
// 结果: { id: number; name: string; age: number; }

// Parameters<T> - 获取函数参数类型元组
function fetchData(url: string, options: { cache?: boolean }): Promise<string> {
    return Promise.resolve("data");
}
type FetchParams = Parameters<typeof fetchData>;
// 结果: [url: string, options: { cache?: boolean }]
```

> Exclude 从联合类型中移除特定成员，Extract 则保留交集成员。ReturnType 和 Parameters 分别提取函数的返回值类型和参数类型元组，在编写高阶函数时非常有用。这些工具类型大大减少了手动重复定义的工作量。

## 泛型进阶 <!-- tutorial-id: ts-generics | icon: 🔄 | difficulty: intermediate -->
泛型约束、条件类型和infer

### 泛型约束 extends

```typescript
// extends 约束泛型必须具有某些属性/能力
function getLength<T extends { length: number }>(arg: T): number {
    return arg.length;
}

getLength("hello");      // 5 - string 有 .length
getLength([1, 2, 3]);   // 3 - array 有 .length
getLength({ length: 10 }); // 10 - 对象有 .length 属性
// getLength(123);       // ❌ number 没有 .length

// 约束为某个类的子类
class Animal { name: string = "" }
class Dog extends Animal { breed: string = "" }

class Kennel<T extends Animal> {
    animals: T[] = [];
    add(animal: T): void { this.animals.push(animal); }
}

const kennel = new Kennel<Dog>();
kennel.add(new Dog()); // ✅ Dog 是 Animal 子类
// kennel.add({ name: "猫" }); // ❌ 不是 Dog 类型
```

> extends 不仅用于类继承，还可约束泛型参数。T extends { length: number } 要求 T 必须拥有 length 属性（number 类型）。这样在函数体内就可以安全地访问 .length，编译器不会报错。

### 条件类型

```typescript
// 条件类型: T extends U ? X : Y （类似三元表达式）
type IsString<T> = T extends string ? true : false;

type A = IsString<"hello">;  // true
type B = IsString<42>;       // false
type C = IsString<string>;   // true

// 实用示例：提取数组元素类型
type ElementType<T> = T extends (infer E)[] ? E : T;

type ArrElement = ElementType<string[]>;  // string
type NotArray = ElementType<number>;      // number

// 嵌套条件类型
type TypeName<T> =
    T extends string ? "字符串" :
    T extends number ? "数字" :
    T extends boolean ? "布尔值" :
    T extends undefined ? "undefined" :
    T extends Function ? "函数" :
    "对象";

type T1 = TypeName<"hello">; // "字符串"
type T2 = TypeName<42>;      // "数字"
type T3 = TypeName<() => void>; // "函数"
```

> 条件类型根据类型关系选择不同结果，语法类似三元运算符。T extends U ? X : Y 判断 T 是否兼容 U。嵌套条件类型可实现复杂的类型判断分支，常用于类型工具库的实现。

### infer 关键字与映射类型

```typescript
// infer - 在条件类型中推断类型变量
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type Func = (x: string, y: number) => boolean;
type Result = ReturnType<Func>; // boolean

// 提取 Promise 内部类型
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

type Data = UnwrapPromise<Promise<string>>; // string
type Plain = UnwrapPromise<number>;          // number

// 映射类型 - in keyof 遍历属性
type Optional<T> = {
    [K in keyof T]?: T[K];  // 每个属性都变可选
};

interface Config {
    host: string;
    port: number;
    ssl: boolean;
}

type PartialConfig = Optional<Config>;
// { host?: string; port?: number; ssl?: boolean; }

// Readonly 映射 + 修改属性
type ReadonlyAndNullable<T> = {
    readonly [K in keyof T]: T[K] | null;
};
```

> infer 在条件类型中声明类型变量并自动推断其具体类型，常用于从复杂类型中提取内部结构。映射类型用 [K in keyof T] 遍历对象的所有键，配合 readonly、? 等修饰符可批量转换属性特征，这是许多内置工具类型的底层原理。

## 综合实战：类型安全的API请求封装 <!-- tutorial-id: ts-project | icon: 🎯 | difficulty: advanced -->
用泛型封装axios请求，实现完整类型安全

### 定义泛型响应接口

```typescript
// 统一的API响应格式 - 泛型T代表实际数据
interface ApiResponse<T> {
    code: number;        // 状态码，200表示成功
    message: string;     // 提示信息
    data: T;             // 实际业务数据，类型由使用者决定
    timestamp: number;   // 服务端时间戳
}

// 用户相关类型
interface UserInfo {
    id: number;
    name: string;
    email: string;
    avatar: string;
    createdAt: string;
}

interface UserListResponse {
    list: UserInfo[];
    total: number;
    page: number;
    pageSize: number;
}

// 文章相关类型
interface Article {
    id: number;
    title: string;
    content: string;
    author: UserInfo;
    tags: string[];
}

// 分页查询参数
interface PageParams {
    page: number;
    pageSize: number;
    keyword?: string;
}
```

> ApiResponse<T> 是核心泛型接口，code/message/timestamp 固定不变，而 data 的类型通过泛型 T 动态决定。这样无论是用户列表、文章详情还是其他业务数据，都能复用统一的响应结构并获得完整的类型推导。

### 封装类型安全的请求函数

```typescript
import axios from 'axios';

// 创建 axios 实例
const request = axios.create({
    baseURL: '/api/v1',
    timeout: 10000,
});

// 请求拦截器 - 自动附加 token
request.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = 'Bearer ${token}';
    }
    return config;
});

// 响应拦截器 - 统一错误处理
request.interceptors.response.use(
    response => response.data,
    error => {
        if (error.response?.status === 401) {
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// 泛型请求方法 - T 为期望的 data 类型
async function apiRequest<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    url: string,
    data?: unknown
): Promise<ApiResponse<T>> {
    const response = await request<ApiResponse<T>>({
        method,
        url,
        data,
    });
    return response as ApiResponse<T>;
}

// GET 便捷方法
async function get<T>(url: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> {
    return apiRequest<T>('GET', url, params);
}

// POST 便捷方法
async function post<T>(url: string, data: unknown): Promise<ApiResponse<T>> {
    return apiRequest<T>('POST', url, data);
}
```

> apiRequest<T> 是核心泛型函数，T 决定返回的 data 字段类型。get<T> 和 post<T> 进一步简化调用。axios 拦截器统一处理 token 注入和错误跳转。调用时只需指定 T，整个请求-响应链路都有完整的类型保护。

### 完整使用示例

```typescript
// ========== 获取用户列表 ==========
async function fetchUsers(params: PageParams) {
    // 返回值自动推断为 ApiResponse<UserListResponse>
    const res = await get<UserListResponse>('/users', params);

    if (res.code === 200) {
        // res.data.list 中每个元素都有完整的 UserInfo 类型提示
        console.log('共 ${res.data.total} 个用户');
        res.data.list.forEach(user => {
            console.log(user.name, user.email); // 完整类型提示 ✅
        });
    }
    return res;
}

// ========== 获取用户详情 ==========
async function fetchUserDetail(userId: number) {
    const res = await get<UserInfo>('/users/${userId}');

    if (res.code === 200) {
        // res.data 是 UserInfo 类型
        const { id, name, email, avatar } = res.data;
        renderUserProfile({ id, name, email, avatar }); // 参数类型完全匹配
    }
}

// ========== 创建文章 ==========
async function createArticle(article: Omit<Article, 'id' | 'author'>) {
    const res = await post<Article>('/articles', article);

    if (res.code === 200) {
        // res.data 是完整的 Article（包含服务端生成的 id 和 author）
        showSuccess("文章发布成功！");
        navigateTo('/articles/${res.data.id}');
    }
}

// ========== 调用示例 ==========
fetchUsers({ page: 1, pageSize: 10 });
fetchUserDetail(1);
createArticle({
    title: "学习TypeScript",
    content: "TS让JS开发更加安全...",
    tags: ["前端", "TypeScript"]
});
```

> 这就是泛型的威力所在：get<UserListResponse> 调用后，res.data 自动获得 UserListResponse 类型，res.data.list[i].name 有完整补全。post<Article> 同理。如果接口返回的数据结构与类型不符，TypeScript 会立即报错，将运行时 bug 消灭在编码阶段。Omit<Article, 'id' | 'author'> 确保创建文章时不会误传应由后端生成的字段。

