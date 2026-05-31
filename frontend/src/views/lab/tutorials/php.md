---
id: php
name: PHP
icon: <?
version: '8.x'
description: Web后端开发语言，WordPress就是用它写的
---

## Hello World <!-- tutorial-id: php-hello | icon: 👋 | difficulty: beginner -->
PHP基础语法入门

### PHP 标签与基本输出

```php
<?php
// PHP 代码必须写在 <?php 标签内

// echo - 输出一个或多个字符串
echo "Hello, World!<br>";

// print - 只能输出一个字符串，返回值始终为1
print "这是 print 输出<br>";

// 变量以 $ 符号开头
$name = "小明";
$age = 25;

// 双引号字符串中变量会被解析（插值）
echo "姓名: $name <br>";
echo "年龄: $age 岁 <br>";
?>
```

> PHP 代码必须包含在 <?php ?> 标签中。echo 和 print 都用于输出，echo 更常用且可以输出多个值。PHP 变量都以 $ 开头，双引号字符串支持变量插值（解析变量），单引号则原样输出不解析变量。

### 注释与字符串

```php
<?php
// ========== 注释的三种方式 ==========

// 单行注释（C++ 风格）
# 单行注释（Shell 风格）

/*
 * 多行注释（C 风格）
 * 可以写多行
 */

// ========== 字符串的区别 ==========
$word = "PHP";

// 单引号 - 原样输出，不解析变量和转义字符
echo '你好 $word\n';     // 输出: 你好 $word


// 双引号 - 解析变量和转义字符
echo "你好 $word\n";      // 输出: 你好 PHP + 换行

// Heredoc - 类似双引号的多行字符串
$html = <<<HTML
<div class="card">
    <h1>$word 编程</h1>
    <p>欢迎学习</p>
</div>
HTML;
echo $html;

// Nowdoc - 类似单引号的多行字符串（不解析变量）
$text = <<<'TEXT'
原始文本 $word 不被解析
TEXT;
echo $text; // 输出: 原始文本 $word 不被解析
?>
```

> PHP 支持三种注释风格：//、#（单行）和 /* */（多行）。字符串有四种形式：单引号（不解析）、双引号（解析变量）、Heredoc（<<<，类似双引号多行）和 Nowdoc（<<<'，类似单引号多行）。选择合适的字符串形式能避免意外解析和安全问题。

## 数据类型与数组 <!-- tutorial-id: php-types | icon: 📦 | difficulty: beginner -->
PHP的类型系统和强大数组

### 类型查看与转换

```php
<?php
// ========== 基本数据类型 ==========
$int    = 42;           // 整型 integer
$float  = 3.14;         // 浮点型 float/double
$str    = "hello";      // 字符串 string
$bool   = true;         // 布尔型 boolean
$arr    = [1,2,3];      // 数组 array
$null   = null;         // 空值 NULL

// gettype() 获取变量的类型名称
echo gettype($int) . "<br>";   // integer
echo gettype($str) . "<br>";   // string

// var_dump() 详细输出变量的类型和值
var_dump($float);  // float(3.14)
var_dump($arr);    // array(3) { [0]=> int(1) ... }

// 类型转换（强制转换）
$num = "123";
$intVal = (int)$num;       // 转为整型: 123
$floatVal = (float)$num;   // 转为浮点: 123.0
$strVal = (string)456;     // 转为字符串: "456"
$boolVal = (bool)"";       // 转为布尔: false（空字符串为false）
?>
```

> PHP 是弱类型语言但仍有类型系统：标量类型（int/float/string/boolean）、复合类型（array/object）和特殊类型（NULL/resource/callable）。gettype() 返回类型名，var_dump() 显示详细信息。使用 (类型)$var 可强制转换类型，空字符串、0、null、空数组转为布尔都是 false。

### 索引数组与关联数组

```php
<?php
// ========== 索引数组（数字键）==========
$fruits = ["苹果", "香蕉", "橙子"];
echo $fruits[0];      // 苹果
echo $fruits[2];      // 橙子

// 追加元素
$fruits[] = "葡萄";   // 自动分配下一个索引

// ========== 关联数组（字符串键）==========
$user = [
    "name"   => "小明",
    "age"    => 25,
    "email"  => "xiaoming@test.com",
    "active" => true
];
echo $user["name"];   // 小明
echo $user["age"];    // 25

// 动态添加键值对
$user["city"] = "北京";

// ========== 混合数组 ==========
$mixed = [
    "first" => "a",
    10      => "b",
    "last"  => "c"
];
var_dump($mixed);
?>
```

> PHP 数组非常强大，实际上是有序映射（map）。索引数组用数字作为键（从0开始），关联数组用自定义字符串作为键。两者可以在同一数组中混合使用。=> 操作符将键映射到值。用 $arr[] = value 可自动追加元素。

### 数组函数与遍历

```php
<?php
$scores = [85, 92, 78, 96, 88];

// count() - 获取元素数量
echo count($scores);              // 5

// array_push() - 在末尾添加一个或多个元素
array_push($scores, 100, 75);

// array_merge() - 合并多个数组
$a = ["a", "b"];
$b = ["c", "d"];
$merged = array_merge($a, $b);    // ["a","b","c","d"]

// sort() - 升序排序（修改原数组）
sort($scores);
// rsort() - 降序排序

// in_array() - 检查值是否存在
echo in_array(92, $scores) ? "存在" : "不存在";

// ========== foreach 遍历 ==========
$user = ["name"=>"小明", "age"=>25, "city"=>"北京"];

// 遍历值
foreach ($user as $value) {
    echo "$value | ";
}

// 同时遍历键和值
foreach ($user as $key => $value) {
    echo "$key => $value <br>";
}
?>
```

> count() 获取长度；array_push() 尾部追加；array_merge() 合并数组；sort()/rsort() 排序；in_array() 判断成员。foreach 是最常用的遍历方式，可只取值 foreach($arr as $v) 或同时取键值 foreach($arr as $k=>$v)。这些数组函数是 PHP 开发的核心工具。

## 控制流与函数 <!-- tutorial-id: php-control | icon: 🔀 | difficulty: beginner -->
条件判断、循环和自定义函数

### 条件判断

```php
<?php
$score = 85;

// if / elseif / else
if ($score >= 90) {
    echo "优秀";
} elseif ($score >= 80) {
    echo "良好";
} elseif ($score >= 60) {
    echo "及格";
} else {
    echo "不及格";
}

// switch 语句
$day = "周三";
switch ($day) {
    case "周一":
    case "周二":
    case "周四":
    case "周五":
        echo "工作日"; break;
    case "周六":
    case "周日":
        echo "周末"; break;
    default:
        echo "未知";
}

// match 表达式（PHP 8+）- 返回值，更简洁
$result = match ($score) {
    90, 100 => "优秀",
    default  => "继续努力"
};
echo $result;
?>
```

> if-elseif-else 是最基本的条件结构。switch 用 break 防止穿透执行。match 是 PHP 8 引入的新特性，它是表达式（有返回值），不需要 break，语法更简洁，支持逗号分隔多个匹配值，default 处理默认情况。

### 循环语句

```php
<?php
// for 循环 - 已知次数的循环
for ($i = 1; $i <= 5; $i++) {
    echo "第 {$i} 次<br>";
}

// while 循环 - 先判断后执行
$count = 0;
while ($count < 3) {
    echo "计数: {$count}<br>";
    $count++;
}

// do-while 循环 - 先执行后判断（至少执行一次）
$num = 5;
do {
    echo "数字: {$num}<br>";
    $num--;
} while ($num > 0);

// foreach 遍历数组
$products = ["手机" => 2999, "电脑" => 5999, "耳机" => 399];
$total = 0;
foreach ($products as $name => $price) {
    echo "{$name}: ¥{$price}<br>";
    $total += $price;
}
echo "总计: ¥{$total}";
?>
```

> for 适合已知循环次数的场景；while 先判断再执行可能一次都不运行；do-while 至少执行一次再判断。foreach 专门用于遍历数组和对象，可同时获取键和值，是 PHP 中最常用的循环方式。

### 自定义函数

```php
<?php
// 基本函数定义
function greet($name) {
    return "你好, {$name}!";
}
echo greet("小明"); // 你好, 小明!

// 带默认参数值的函数
function createUser($name, $role = "用户") {
    return ["name" => $name, "role" => $role];
}
print_r(createUser("Admin", "管理员"));
print_r(createUser("访客")); // role 默认为 "用户"

// PHP 7+ 类型声明（参数和返回值）
function add(int $a, int $b): int {
    return $a + $b;
}
echo add(3, 5); // 8
// add("a", "b"); // 类型错误！

// 可变参数 ...
function sum(...$numbers): int {
    return array_sum($numbers);
}
echo sum(1, 2, 3, 4, 5); // 15

// 引用传递 - 修改原变量
function doubleValue(&$num): void {
    $num *= 2;
}
$val = 10;
doubleValue($val);
echo $val; // 20
?>
```

> function 关键字定义函数，return 返回值。参数可设默认值 =value。PHP 7+ 支持 : type 声明返回值类型和参数类型，增强代码安全性。...$args 收集剩余参数为数组。&$param 使用引用传递，函数内修改会影响外部变量。

## 表单与超全局变量 <!-- tutorial-id: php-form | icon: 🌐 | difficulty: beginner -->
处理HTTP请求和表单数据

### GET 与 POST 请求处理

```php
<?php
// ========== $_GET - 获取 URL 查询参数 ==========
// 访问: ?page=2&keyword=php
$page = $_GET["page"] ?? 1;       // ?? 空合并运算符
$keyword = $_GET["keyword"] ?? "";

echo "当前页: {$page}, 搜索: {$keyword}";

// ========== $_POST - 获取表单 POST 数据 ==========
// HTML表单: <form method="POST">
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $username = $_POST["username"] ?? "";
    $password = $_POST["password"] ?? "";

    // 验证非空
    if (empty($username) || empty($password)) {
        die("用户名和密码不能为空");
    }

    echo "接收到的用户名: " . htmlspecialchars($username);
}

// ========== $_REQUEST - 包含 GET/POST/COOKIE ==========
// 不推荐使用，安全隐患较大
$data = $_REQUEST["data"] ?? "";
?>
```

> $_GET 收集 URL 问号后的查询参数（?key=value）。$_POST 收集 HTTP POST 请求体中的表单数据。?? 是空合并运算符，当值为 null 或未定义时使用默认值。$_SERVER["REQUEST_METHOD"] 可区分 GET 和 POST 请求。$_REQUEST 合并了三者但不推荐使用。

### XSS 防护与 $_SERVER

```php
<?php
// ========== XSS 跨站脚本攻击防护 ==========
// ⚠️ 危险写法 - 直接输出用户输入
// echo $_GET["name"]; // 用户可注入 <script>alert('xss')</script>

// ✅ 安全写法 - htmlspecialchars 转义特殊字符
$name = $_GET["name"] ?? "匿名用户";
$safeName = htmlspecialchars($name, ENT_QUOTES, "UTF-8");
echo "欢迎, {$safeName}!";

// ========== $_SERVER 常用字段 ==========
echo "请求方法: " . $_SERVER["REQUEST_METHOD"] . "<br>";     // GET/POST
echo "请求URI: "  . $_SERVER["REQUEST_URI"] . "<br>";         // /path?a=b
echo "客户端IP: " . $_SERVER["REMOTE_ADDR"] . "<br>";         // 192.168.x.x
echo "用户代理: " . $_SERVER["HTTP_USER_AGENT"] . "<br>";     // 浏览器信息
echo "服务器名: " . $_SERVER["HTTP_HOST"] . "<br>";           // localhost
echo "脚本路径: " . $_SERVER["SCRIPT_NAME"] . "<br>";         // /index.php

// 判断是否 AJAX 请求
$isAjax = (
    isset($_SERVER["HTTP_X_REQUESTED_WITH"]) &&
    strtolower($_SERVER["HTTP_X_REQUESTED_WITH"]) === "xmlhttprequest"
);
echo $isAjax ? "AJAX请求" : "普通请求";
?>
```

> htmlspecialchars() 将 < > & ' " 等特殊字符转为 HTML 实体，防止 XSS 攻击。ENT_QUOTES 转换单双引号，UTF-8 指定编码。$_SERVER 提供服务器和请求环境信息：REQUEST_METHOD、REMOTE_ADDR（客户端IP）、HTTP_USER_AGENT（浏览器标识）、HTTP_X_REQUESTED_WITH（AJAX检测）等是开发中最常用的字段。

### 文件上传基础

```php
<?php
// HTML表单需要: enctype="multipart/form-data"
// <form method="POST" action="upload.php" enctype="multipart/form-data">

if ($_SERVER["REQUEST_METHOD"] === "POST" && !empty($_FILES)) {
    $file = $_FILES["avatar"]; // avatar 是 input[name]

    // 检查是否有错误
    if ($file["error"] !== UPLOAD_ERR_OK) {
        $errors = [
            UPLOAD_ERR_INI_SIZE   => "文件超过 php.ini 限制",
            UPLOAD_ERR_FORM_SIZE  => "文件超过表单 MAX_FILE_SIZE",
            UPLOAD_ERR_PARTIAL    => "文件只有部分上传",
            UPLOAD_ERR_NO_FILE    => "没有文件被上传",
        ];
        die("上传错误: " . ($errors[$file["error"]] ?? "未知错误"));
    }

    // 获取文件信息
    $tmpName  = $file["tmp_name"];  // 临时存储路径
    $fileName = $file["name"];      // 原始文件名
    $fileSize = $file["size"];      // 文件大小（字节）
    $fileType = $file["type"];      // MIME 类型

    // 验证文件类型（白名单）
    $allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!in_array($fileType, $allowedTypes)) {
        die("仅允许 JPG/PNG/GIF 格式");
    }

    // 验证文件大小（限制 2MB）
    if ($fileSize > 2 * 1024 * 1024) {
        die("文件不能超过 2MB");
    }

    // 移动到目标目录
    $uploadDir = __DIR__ . "/uploads/";
    if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

    $ext = pathinfo($fileName, PATHINFO_EXTENSION);
    $newName = uniqid() . "." . $ext; // 唯一文件名防冲突
    $destPath = $uploadDir . $newName;

    if (move_uploaded_file($tmpName, $destPath)) {
        echo "上传成功！文件: {$newName}";
    } else {
        echo "移动文件失败";
    }
}
?>
```

> $_FILES 超全局变量存储上传文件信息，是一个二维数组，每个文件包含 name（原名）、tmp_name（临时路径）、size（大小）、type（MIME类型）、error（错误码）。处理流程：检查错误码 → 验证类型白名单 → 验证大小 → 生成唯一文件名 → move_uploaded_file() 移动到目标目录。注意表单必须设置 enctype="multipart/form-data"。

## 面向对象 <!-- tutorial-id: php-oop | icon: 📚 | difficulty: intermediate -->
class、继承、命名空间

### 类定义与访问控制

```php
<?php
class User {
    // 属性必须有访问修饰符
    public string $name;        // 公开 - 外部可访问
    private int $age;           // 私有 - 仅类内部可访问
    protected string $email;    // 受保护 - 类及子类可访问

    // 构造方法 - 创建实例时自动调用
    public function __construct(string $name, int $age, string $email) {
        $this->name  = $name;
        $this->age   = $age;
        $this->email = $email;
    }

    // 公开方法
    public function introduce(): string {
        return "我是{$this->name}, {$this->age}岁";
    }

    // 私有方法 - 内部工具方法
    private function validateEmail(): bool {
        return filter_var($this->email, FILTER_VALIDATE_EMAIL) !== false;
    }

    // Getter 方法 - 安全地读取私有属性
    public function getAge(): int {
        return $this->age;
    }

    // Setter 方法 - 安全地修改私有属性
    public function setAge(int $age): void {
        if ($age < 0 || $age > 150) {
            throw new InvalidArgumentException("年龄无效");
        }
        $this->age = $age;
    }
}

// 使用类
$user = new User("小明", 25, "xiaoming@test.com");
echo $user->introduce();       // ✅ 公开方法
echo $user->name;             // ✅ 公开属性
// echo $user->age;           // ❌ 私有属性不可访问
echo $user->getAge();          // ✅ 通过 getter 访问
?>
```

> class 定义类，属性必须声明访问级别（public/private/protected）。__construct() 是构造方法，实例化时自动调用。$this-> 访问当前实例的属性和方法。private 属性通过 getter/setter 提供受控访问，可在 setter 中加入验证逻辑。PHP 7.4+ 支持属性类型声明如 public string $name。

### 继承与 parent::

```php
<?php
// 父类
class Animal {
    protected string $name;

    public function __construct(string $name) {
        $this->name = $name;
    }

    public function eat(): void {
        echo "{$this->name} 正在吃东西<br>";
    }

    public function sleep(): void {
        echo "{$this->name} 正在睡觉<br>";
    }
}

// 子类 extends 继承父类
class Dog extends Animal {
    private string $breed;

    public function __construct(string $name, string $breed) {
        // parent:: 调用父类的构造方法
        parent::__construct($name);
        $this->breed = $breed;
    }

    // 重写（覆盖）父类方法
    public function eat(): void {
        echo "{$this->name}({$this->breed}) 正在啃骨头<br>";
    }

    // 子类独有方法
    public function bark(): void {
        echo "{$this->name}: 汪汪!<br>";
    }
}

// 使用继承
$dog = new Dog("旺财", "柴犬");
$dog->eat();    // 旺财(柴犬) 正在啃骨头（子类重写版）
$dog->sleep();  // 旺财 正在睡觉（继承自父类）
$dog->bark();   // 旺财: 汪汪!（子类独有）
?>
```

> extends 让子类继承父类的所有公有和受保护的属性与方法。parent::__construct() 调用父类构造器完成初始化。子类可以重写（override）父类同名方法来改变行为。protected 成员对子类可见。继承实现了代码复用和多态——同一接口不同实现。

### 命名空间与 use

```php
<?php
// ========== 命名空间 - 防止类名冲突 ==========
namespace App\Models;

class User {
    public function __construct(
        public string $name,
        public string $email
    ) {}
    public function getInfo(): array {
        return ["name" => $this->name, "email" => $this->email];
    }
}

namespace App\Controllers;

// use 导入其他命名空间的类
use App\Models\User;

class UserController {
    private User $user;

    public function __construct() {
        // 使用导入的类
        $this->user = new User("管理员", "admin@test.com");
    }

    public function showProfile(): void {
        $info = $this->user->getInfo();
        print_r($info);
    }
}

// use 别名 - 解决同类名冲突
use App\Models\User as UserModel;
use App\Services\User as UserService;

namespace App\Services;

class User {
    public function sendEmail(): void {
        echo "发送邮件服务...<br>";
    }
}

// 在全局命名空间中使用
$controller = new App\Controllers\UserController();
$controller->showProfile();
?>
```

> namespace 声明命名空间，组织代码避免类名冲突。命名空间用反斜杠 \ 分隔层级（App\Models）。use 关键字导入外部命名空间的类，可用 as 设置别名解决冲突。PHP 推荐遵循 PSR-4 自动加载规范：命名空间路径对应目录结构。大型项目必须使用命名空间管理代码。

## 数据库操作 <!-- tutorial-id: php-database | icon: 🗄️ | difficulty: intermediate -->
PDO连接MySQL执行CRUD

### PDO 连接数据库

```php
<?php
// 数据库配置
$host = "localhost";
$dbname   = "myapp";
$username = "root";
$password = "";

try {
    // 创建 PDO 实例 - DSN (Data Source Name) 连接字符串
    $dsn = "mysql:host={$host};dbname={$dbname};charset=utf8mb4";

    // PDO 连接选项
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,  // 抛出异常
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,        // 关联数组
        PDO::ATTR_EMULATE_PREPARES   => false,                  // 禁用模拟预处理
    ];

    $pdo = new PDO($dsn, $username, $password, $options);
    echo "数据库连接成功!<br>";

} catch (PDOException $e) {
    // 捕获连接异常
    die("连接失败: " . $e->getMessage());
}

// 使用完毕后关闭连接（可选，脚本结束会自动关闭）
$pdo = null;
?>
```

> PDO（PHP Data Objects）是 PHP 访问数据库的标准扩展，支持 MySQL、PostgreSQL、SQLite 等多种数据库。DSN 字符串指定数据库类型、主机、库名和字符集。推荐选项：ERRMODE_EXCEPTION 让错误抛异常而非静默失败；FETCH_ASSOC 返回关联数组（列名为键）；禁用模拟预处理使用真正的数据库预处理功能。

### 预处理查询（SELECT）

```php
<?php
$pdo = /* 上例的 PDO 实例 */;

// ========== prepare 预处理 + execute 执行 ==========
// :name 是命名占位符（也可用 ? 占位符）
$sql = "SELECT id, name, email, created_at FROM users WHERE status = :status LIMIT :limit";

$stmt = $pdo->prepare($sql);

// bindValue 绑定参数值（更安全的方式）
$stmt->bindValue(":status", 1, PDO::PARAM_INT);
$stmt->bindValue(":limit", 10, PDO::PARAM_INT);

$stmt->execute();

// fetchAll 获取所有结果行
$users = $stmt->fetchAll();

// fetch 逐行获取（适合大数据量）
// while ($row = $stmt->fetch()) { ... }

// 输出结果
foreach ($users as $user) {
    echo "ID: {$user['id']}, ";
    echo "姓名: {$user['name']}, ";
    echo "邮箱: {$user['email']}<br>";
}

// ========== 带搜索条件的查询 ==========
$keyword = $_GET["q"] ?? "";

$searchSql = "SELECT * FROM articles WHERE title LIKE :keyword ORDER BY id DESC";
$searchStmt = $pdo->prepare($searchSql);
$searchStmt->bindValue(":keyword", "%{$keyword}%"); // LIKE 通配符
$searchStmt->execute();

$articles = $searchStmt->fetchAll();
echo "找到 " . count($articles) . " 条结果";
?>
```

> prepare() 编译 SQL 模板（带占位符），execute() 时才传入实际参数。这种预处理机制有效防止 SQL 注入攻击——参数始终被视为纯数据而非 SQL 代码。命名占位符 :name 比 ? 占位符更清晰。bindValue() 绑定时指定 PDO::PARAM_INT/PARAM_STR 类型。fetchAll() 一次性返回所有行，fetch() 逐行返回节省内存。

### 完整 CRUD 操作

```php
<?php
$pdo = /* PDO 实例 */;

// ========== CREATE - 插入数据 ==========
$insertSQL = "INSERT INTO users (name, email, age, created_at) VALUES (:name, :email, :age, NOW())";
$stmt = $pdo->prepare($insertSQL);
$stmt->execute([
    ":name"  => "新用户",
    ":email" => "new@test.com",
    ":age"   => 22,
]);
$lastInsertId = $pdo->lastInsertId(); // 获取自增ID
echo "插入成功, ID: {$lastInsertId}";

// ========== READ - 单条查询 ==========
$id = 1;
$selectSQL = "SELECT * FROM users WHERE id = :id";
$stmt = $pdo->prepare($selectSQL);
$stmt->execute([":id" => $id]);
$user = $stmt->fetch(); // 单条数据

if ($user) {
    echo "用户: {$user['name']}";
} else {
    echo "用户不存在";
}

// ========== UPDATE - 更新数据 ==========
$updateSQL = "UPDATE users SET name = :name, age = :age, updated_at = NOW() WHERE id = :id";
$stmt = $pdo->prepare($updateSQL);
$stmt->execute([
    ":name" => "已更新",
    ":age"  => 26,
    ":id"   => 1,
]);
$count = $stmt->rowCount(); // 受影响的行数
echo "更新了 {$count} 行";

// ========== DELETE - 删除数据 ==========
$deleteSQL = "DELETE FROM users WHERE id = :id AND status = 0";
$stmt = $pdo->prepare($deleteSQL);
$stmt->execute([":id" => 99]);
$deleted = $stmt->rowCount();
echo "删除了 {$deleted} 行";

// ========== 事务处理 - 保证数据一致性 ==========
try {
    $pdo->beginTransaction();

    // 扣减余额
    $pdo->prepare("UPDATE accounts SET balance = balance - 100 WHERE id = 1")->execute();
    // 增加对方余额
    $pdo->prepare("UPDATE accounts SET balance = balance + 100 WHERE id = 2")->execute();

    $pdo->commit();   // 提交事务
    echo "转账成功!";
} catch (Exception $e) {
    $pdo->rollBack(); // 出错回滚
    echo "转账失败: " . $e->getMessage();
}
?>
```

> 四大 CRUD 操作全部使用预处理语句保证安全：INSERT 插入后用 lastInsertId() 获取自增主ID；UPDATE/DELETE 后用 rowCount() 获取影响行数；事务（beginTransaction/commit/rollBack）确保多条 SQL 要么全成功要么全回滚，常用于金融转账等场景。所有参数都通过占位符绑定，杜绝 SQL 注入。

## 综合实战：简易博客后端API <!-- tutorial-id: php-project | icon: 🎯 | difficulty: advanced -->
RESTful风格的博客API实现

### 路由设计与分发

```php
<?php
// blog_api.php - 博客 API 入口文件
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");

// CORS 预检请求处理
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

// 数据库连接
require_once "config/database.php";
$pdo = connectDB();

// 路由设计 - RESTful 风格
$uri    = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);
$method = $_SERVER["REQUEST_METHOD"];

// 解析 URI: /api/articles 或 /api/articles/{id}
$pathParts = explode("/", trim($uri, "/"));
$resource = $pathParts[1] ?? "";     // articles
$id       = $pathParts[2] ?? null;   // 可选的文章ID

// 路由分发
if ($resource === "articles") {
    switch ($method) {
        case "GET":
            // GET /api/articles     - 获取文章列表
            // GET /api/articles/123 - 获取文章详情
            echo $id ? getArticle($pdo, (int)$id) : getArticles($pdo);
            break;

        case "POST":
            // POST /api/articles - 创建新文章
            echo createArticle($pdo);
            break;

        case "PUT":
            // PUT /api/articles/123 - 更新文章
            if (!$id) jsonError("缺少文章ID", 400);
            echo updateArticle($pdo, (int)$id);
            break;

        case "DELETE":
            // DELETE /api/articles/123 - 删除文章
            if (!$id) jsonError("缺少文章ID", 400);
            echo deleteArticle($pdo, (int)$id);
            break;

        default:
            jsonError("不支持的请求方法", 405);
    }
} else {
    jsonError("资源不存在", 404);
}

// JSON 错误响应辅助函数
function jsonError(string $message, int $code = 400): void {
    http_response_code($code);
    echo json_encode(["code" => $code, "message" => $message], JSON_UNESCAPED_UNICODE);
    exit;
}
?>
```

> RESTful API 路由设计原则：资源用名词（articles），操作用 HTTP 方法（GET查询/POST创建/PUT更新/DELETE删除）。入口文件统一设置 JSON 响应头和 CORS 头。parse_url 分解 URI 路径提取资源和 ID。switch($method) 分发到对应的处理函数。jsonError() 统一返回错误格式。这是现代 PHP API 的标准架构模式。

### 文章 CRUD 接口实现

```php
<?php
// api/functions.php - 业务逻辑函数

// ========== 获取文章列表（分页+搜索）==========
function getArticles(PDO $pdo): string {
    $page     = (int)($_GET["page"] ?? 1);
    $pageSize = min((int)($_GET["pageSize"] ?? 10), 50); // 最大50条
    $keyword  = $_GET["keyword"] ?? "";
    $offset   = ($page - 1) * $pageSize;

    // 构建 WHERE 条件
    $where = "WHERE status = 1";
    $params = [];

    if ($keyword !== "") {
        $where .= " AND (title LIKE :kw OR content LIKE :kw)";
        $params[":kw"] = "%{$keyword}%";
    }

    // 查询总数
    $countSql = "SELECT COUNT(*) as total FROM articles {$where}";
    $total = $pdo->prepare($countSql)->execute($params)
        ? $pdo->prepare($countSql)->execute($params) && ($pdo->query($countSql)->fetch()["total"] ?? 0)
        : 0;

    // 查询数据列表
    $sql = "SELECT id, title, summary, author_name, view_count, created_at 
            FROM articles {$where} ORDER BY id DESC LIMIT :offset :limit";
    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(":offset", $offset, PDO::PARAM_INT);
    $stmt->bindValue(":limit", $pageSize, PDO::PARAM_INT);
    foreach ($params as $k => $v) $stmt->bindValue($k, $v);
    $stmt->execute();
    $list = $stmt->fetchAll();

    // 返回 JSON 响应
    return json_encode([
        "code"  => 200,
        "data"  => [
            "list"     => $list,
            "total"    => (int)$total,
            "page"     => $page,
            "pageSize" => $pageSize,
        ],
        "message" => "ok"
    ], JSON_UNESCAPED_UNICODE);
}

// ========== 获取单篇文章详情 ==========
function getArticle(PDO $pdo, int $id): string {
    $stmt = $pdo->prepare("SELECT * FROM articles WHERE id = :id AND status = 1");
    $stmt->execute([":id" => $id]);
    $article = $stmt->fetch();

    if (!$article) {
        http_response_code(404);
        return json_encode(["code" => 404, "message" => "文章不存在"], JSON_UNESCAPED_UNICODE);
    }

    // 浏览量 +1
    $pdo->prepare("UPDATE articles SET view_count = view_count + 1 WHERE id = :id")
        ->execute([":id" => $id]);

    return json_encode(["code" => 200, "data" => $article, "message" => "ok"], JSON_UNESCAPED_UNICODE);
}

// ========== 创建新文章 ==========
function createArticle(PDO $pdo): string {
    // 获取 POST body 中的 JSON 数据
    $input = json_decode(file_get_contents("php://input"), true);

    // 验证必填字段
    $title   = trim($input["title"] ?? "");
    $content = trim($input["content"] ?? "");

    if ($title === "" || $content === "") {
        http_response_code(400);
        return json_encode(["code" => 400, "message" => "标题和内容不能为空"], JSON_UNESCAPED_UNICODE);
    }

    // 生成摘要（截取前100字）
    $summary = mb_substr(strip_tags($content), 0, 100, "utf-8");

    $sql = "INSERT INTO articles (title, content, summary, author_id, status, created_at) 
            VALUES (:title, :content, :summary, :author_id, 1, NOW())";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ":title"    => $title,
        ":content"  => $content,
        ":summary"  => $summary,
        ":author_id" => $input["authorId"] ?? 1,
    ]);

    $newId = $pdo->lastInsertId();

    http_response_code(201);
    return json_encode([
        "code"    => 201,
        "data"    => ["id" => (int)$newId],
        "message" => "创建成功"
    ], JSON_UNESCAPED_UNICODE);
}

// ========== 更新文章 ==========
function updateArticle(PDO $pdo, int $id): string {
    $input = json_decode(file_get_contents("php://input"), true);

    // 检查文章是否存在
    $check = $pdo->prepare("SELECT id FROM articles WHERE id = :id");
    $check->execute([":id" => $id]);
    if (!$check->fetch()) {
        http_response_code(404);
        return json_encode(["code" => 404, "message" => "文章不存在"], JSON_UNESCAPED_UNICODE);
    }

    // 动态构建 SET 子句（只更新传入的字段）
    $fields = [];
    $params = [":id" => $id];

    foreach (["title", "content", "status"] as $field) {
        if (isset($input[$field])) {
            $fields[] = "{$field} = :{$field}";
            $params[":{$field}"] = $input[$field];
        }
    }
    $fields[] = "updated_at = NOW()";

    $sql = "UPDATE articles SET " . implode(", ", $fields) . " WHERE id = :id";
    $pdo->prepare($sql)->execute($params);

    return json_encode(["code" => 200, "message" => "更新成功"], JSON_UNESCAPED_UNICODE);
}

// ========== 删除文章（软删除）==========
function deleteArticle(PDO $pdo, int $id): string {
    // 软删除：将 status 设为 0 而非物理删除
    $stmt = $pdo->prepare("UPDATE articles SET status = 0, deleted_at = NOW() WHERE id = :id");
    $stmt->execute([":id" => $id]);

    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        return json_encode(["code" => 404, "message" => "文章不存在"], JSON_UNESCAPED_UNICODE);
    }

    return json_encode(["code" => 200, "message" => "删除成功"], JSON_UNESCAPED_UNICODE);
}
?>
```

> 完整的 RESTful CRUD 实现：getArticles 支持分页（LIMIT/OFFSET）和关键词搜索（LIKE）；getArticle 返回详情并递增浏览量；createArticle 从 php://input 读取 JSON body，验证必填字段后插入；updateArticle 动态构建 SET 子句只更新传入字段；deleteArticle 采用软删除（status=0）保留数据。所有响应都用 json_encode 配合 JSON_UNESCAPED_UNICODE 保持中文正常显示。http_response_code() 设置正确的 HTTP 状态码（201创建/404不存在/400参数错误）。

