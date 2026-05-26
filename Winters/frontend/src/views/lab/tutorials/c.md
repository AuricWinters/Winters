---
id: c
name: C语言
icon: C
version: ''
description: 系统编程的基础语言，适合学习编程思维
---

## Hello World <!-- tutorial-id: c-hello | icon: 👋 | difficulty: beginner -->
从最简单的程序开始，理解C语言的骨架

### 最简单的程序

```c
#include <stdio.h>

int main() {
    printf("Hello, World!\n");
    return 0;
}
```

> 每门语言的教程都从Hello World开始，C也不例外。这段代码虽然短，但已经包含了C程序的完整骨架：
>
> - **#include <stdio.h>**：引入标准输入输出头文件，printf函数就定义在这里。没有这行，编译器根本不认识printf是谁
> - **int main()**：程序入口函数。每个C程序有且仅有一个main，操作系统从这里开始执行你的代码
> - **printf()**：格式化输出函数，`\n`是换行符。C语言的I/O比很多现代语言都原始，但这也意味着你更清楚底层在干什么
> - **return 0**：告诉操作系统"我正常结束了"。返回非零值通常表示出错
>
> > 💡 说句实在话，C语言虽然古老（1972年就诞生了），但它依然是计算机科学的基石。操作系统、数据库引擎、浏览器内核、嵌入式系统——这些底层东西大部分都是C写的。学好C，你就能理解计算机到底是怎么跑起来的。

### 变量声明与格式化输出

```c
#include <stdio.h>

int main() {
    int age = 25;            // 整型变量
    float height = 1.75f;    // 单精度浮点数
    char name[] = "小明";    // 字符数组（字符串）
    
    printf("姓名: %s\n", name);       // %s 输出字符串
    printf("年龄: %d\n", age);         // %d 输出整数
    printf("身高: %.2f\n", height);   // %.2f 保留2位小数
    
    return 0;
}
```

> C语言的变量使用规则很严格：**必须先声明类型，再使用**。这点跟Python、JavaScript那种动态语言完全不同。
>
> 常用格式说明符记这几个就够了：
> - `%s` → 字符串
> - `%d` → 十进制整数
> - `%f` → 浮点数，`%.2f`保留两位小数
>
> 注意C语言里字符串本质就是字符数组（char[]），没有专门的String类型。这个设计简单粗暴，但也因此你需要自己管理内存——后面会讲到，这是把双刃剑。

## 变量与数据类型 <!-- tutorial-id: c-var | icon: 📦 | difficulty: beginner -->
C的类型系统：小巧但精确

### 基本数据类型

```c
#include <stdio.h>

int main() {
    // 整型家族
    int i = 100;              // 基本整型，通常4字节
    short s = 10;             // 短整型，2字节
    long l = 100000L;         // 长整型，4或8字节

    // 浮点型家族
    float f = 3.14f;          // 单精度，4字节，精度约7位
    double d = 3.1415926535;  // 双精度，8字节，精度约15位

    // 字符型
    char c = 'A';            // 字符，1字节，存储ASCII码值

    printf("int: %d, 大小: %zu 字节\n", i, sizeof(i));
    printf("short: %d, 大小: %zu 字节\n", s, sizeof(s));
    printf("long: %ld, 大小: %zu 字节\n", l, sizeof(l));
    printf("float: %f, 大小: %zu 字节\n", f, sizeof(f));
    printf("double: %.10lf, 大小: %zu 字节\n", d, sizeof(d));
    printf("char: %c (ASCII: %d), 大小: %zu 字节\n", c, c, sizeof(c));

    return 0;
}
```

> C的基本数据类型分三大类，每种都对应不同的内存大小和取值范围：
>
> | 类型 | 大小 | 范围 | 用途 |
> |------|------|------|------|
> | int | 4B | 约±21亿 | 最常用的整数 |
> | short | 2B | ±3万多 | 省内存时用 |
> | long | 4/8B | 很大 | 大数、时间戳 |
> | float | 4B | ~7位精度 | 对精度要求不高 |
> | double | 8B | ~15位精度 | **日常首选浮点类型** |
> | char | 1B | -128~127 | 单个字符/小整数 |
>
> `sizeof` 是C的运算符（不是函数！），能在编译期算出任何类型或变量占多少字节。`%zu` 是专门用来打印size_t类型的格式符。
>
> > ⚠️ 不同平台上同一种类型的大小可能不一样！比如long在32位系统上是4字节，64位上可能是8字节。写跨平台代码的时候要小心。

### 类型转换

```c
#include <stdio.h>

int main() {
    // 隐式类型转换（自动提升）
    int a = 10;
    double b = a;         // int 自动转为 double
    printf("隐式转换: int %d -> double %.2f\n", a, b);

    // 整数除法会截断小数
    int x = 7, y = 2;
    printf("整数除法: %d / %d = %d\n", x, y, x / y);   // 结果为3

    // 显式强制类型转换
    double result = (double)x / y;
    printf("强制转换后: (double)%d / %d = %.2f\n", x, y, result);

    // 混合运算中的类型提升
    int m = 5;
    float n = 2.5f;
    auto sum = m + n;     // m被提升为float后再相加
    printf("混合运算: %d + %.1f = %.1f\n", m, n, sum);

    return 0;
}
```

> C的类型转换分两种：
>
> **隐式转换（自动）**：小类型赋给大类型时编译器自动处理，比如int→double。但有个经典坑：**两个整数相除结果还是整数**，7/2=3不是3.5。想要小数结果？至少把其中一个操作数转成double。
>
> **显式转换（强制）**：用 `(目标类型)` 语法，比如 `(double)7/2` 得到3.5。但要注意——大范围转小范围时会**截断**或**溢出**，数据可能变得面目全非。
>
> > 💡 auto关键字（C11标准）可以让编译器自动推断类型。挺方便的，但别滥用——代码可读性很重要，让别人一眼看出变量类型是什么。

### 常量与宏定义

```c
#include <stdio.h>

// 宏定义：预处理器在编译前做文本替换
#define PI 3.14159
#define MAX_STUDENTS 50
#define SQUARE(x) ((x) * (x))

int main() {
    // const关键字定义只读变量（有类型检查）
    const int CLASS_SIZE = 30;
    const double GRADE_PASS = 60.0;

    // 使用宏常量
    printf("圆周率 PI = %f\n", PI);
    printf("最大学生数 = %d\n", MAX_STUDENTS);

    // 使用const常量
    printf("班级人数 = %d (不可修改)\n", CLASS_SIZE);
    // CLASS_SIZE = 40;  // 错误！const变量不能修改

    // 使用带参数的宏
    int num = 5;
    printf("%d 的平方 = %d\n", num, SQUARE(num));

    // sizeof查看各种类型大小
    printf("\n各类型占用内存:\n");
    printf("int: %zu 字节\n", sizeof(int));
    printf("double: %zu 字节\n", sizeof(double));
    printf("指针: %zu 字节\n", sizeof(void*));

    return 0;
}
```

> C语言定义常量有两种方式，各有各的适用场景：
>
> - **#define宏**：预处理器在做文本替换，没有类型检查。好处是简单直接，坏处是容易出奇怪的问题（尤其是带参宏，括号一定要加对）。`#define SQUARE(x) ((x)*(x))` 这里的多层括号不是多余的，是为了防止运算符优先级捣乱
> - **const变量**：有类型，编译器会做类型检查，调试器也能看到它。**新代码推荐用const**
>
> sizeof是运算符不是函数，结果在编译期就确定了，所以你可以拿它来定义数组大小。

## 控制语句 <!-- tutorial-id: c-control | icon: 🔀 | difficulty: beginner -->
if/for/while/switch——程序逻辑的骨架

### if-else 条件判断 — 成绩等级

```c
#include <stdio.h>

int main() {
    int score;

    printf("请输入成绩(0-100): ");
    scanf("%d", &score);

    if (score >= 90 && score <= 100) {
        printf("等级: A (优秀)\n");
    } else if (score >= 80) {
        printf("等级: B (良好)\n");
    } else if (score >= 70) {
        printf("等级: C (中等)\n");
    } else if (score >= 60) {
        printf("等级: D (及格)\n");
    } else if (score >= 0) {
        printf("等级: F (不及格)\n");
    } else {
        printf("输入无效!\n");
    }

    return 0;
}
```

> 几个C语言特有的细节值得注意：
>
> - **条件表达式**：C语言中非零即为真，零为假。所以你甚至可以写 `if(ptr)` 来判断指针是否为NULL（但不推荐，不够清晰）
> - **逻辑运算符**：`&&`（与）、`||`（或）、`!`（非），跟大多数语言一样。&&和||同样是短路求值的
> - **scanf("%d", &score)**：注意那个 `&` 取地址运算符！scanf需要知道变量的内存地址才能往里面写值。忘了加&是新手最常见的错误之一，会导致程序崩溃或者读到垃圾值
>
> > ⚠️ scanf是个历史遗留的函数，安全隐患不少（缓冲区溢出等）。学习阶段用它没问题，但实际项目中建议用更安全的替代方案如fgets+sscanf组合。

### for 循环 — 打印与求和

```c
#include <stdio.h>

int main() {
    // for循环打印1到10
    printf("打印1到10:\n");
    for (int i = 1; i <= 10; i++) {   // 初始化; 条件; 更新
        printf("%d ", i);
    }
    printf("\n");

    // for循环求1到100的和
    int sum = 0;
    for (int i = 1; i <= 100; i++) {
        sum += i;   // 等价于 sum = sum + i
    }
    printf("\n1到100的和 = %d\n", sum);

    // 嵌套for循环：打印九九乘法表
    printf("\n九九乘法表:\n");
    for (int i = 1; i <= 9; i++) {
        for (int j = 1; j <= i; j++) {
            printf("%dx%d=%-4d", i, j, i * j);
        }
        printf("\n");
    }

    return 0;
}
```

> for循环是C语言中最常用的循环结构，语法 `for(初始化; 条件; 更新)` 清晰明了。
>
> 执行顺序记住这个流程：
> 1. 执行初始化部分（只执行一次）
> 2. 判断条件，为假就退出
> 3. 执行循环体
> 4. 执行更新部分
> 5. 回到第2步
>
> `+=` 是复合赋值运算符，`sum += i` 就是 `sum = sum + i` 的简写。嵌套循环时外层每走一步，内层就要完整跑一圈——乘法表就是个经典例子。
>
> > 💡 C99标准支持在for循环的初始化部分声明变量（如 `for(int i=0; ...)`），这样变量的作用域就被限制在循环内部。如果你的编译器报错，可能是因为它默认用的是C89模式，加上 `-std=c99` 编译选项即可。

### while 与 switch — 简易计算器

```c
#include <stdio.h>

int main() {
    char op;
    double a, b;

    while (1) {   // while(1) 表示无限循环
        printf("\n====== 简易计算器 ======\n");
        printf("请输入表达式 (如: 3 + 5): ");
        scanf("%lf %c %lf", &a, &op, &b);

        switch (op) {
            case '+':
                printf("%.2lf + %.2lf = %.2lf\n", a, b, a + b);
                break;
            case '-':
                printf("%.2lf - %.2lf = %.2lf\n", a, b, a - b);
                break;
            case '*':
                printf("%.2lf * %.2lf = %.2lf\n", a, b, a * b);
                break;
            case '/':
                if (b != 0)
                    printf("%.2lf / %.2lf = %.2lf\n", a, b, a / b);
                else
                    printf("错误: 除数不能为零!\n");
                break;
            default:
                printf("不支持的运算符: %c\n", op);
        }

        // 询问是否继续
        printf("\n继续计算? (y/n): ");
        char choice;
        scanf(" %c", &choice);   // 注意空格，跳过空白字符
        if (choice != 'y' && choice != 'Y')
            break;   // 跳出while循环
    }

    printf("感谢使用!\n");
    return 0;
}
```

> 这个小程序综合了好几个知识点：
>
> - **while(1)** 创建无限循环，配合break跳出——这是C语言中"事件循环"的基本写法
> - **switch语句**做分支匹配，每个case后面**必须加break**，否则会发生"穿透"（fall-through）——代码继续往下执行下一个case的内容。这是C语言switch最著名的坑，没有之一
> - **scanf(" %c")** 里的空格很重要！它会跳过之前输入留下的换行符。不加这个空格的话，%c可能会读到一个换行符而不是你输入的字符
>
> > ⚠️ switch的default分支建议始终写上，即使你觉得所有case都覆盖到了。这是一种防御性编程习惯，能帮你捕获意外情况。

## 函数与指针 <!-- tutorial-id: c-func | icon: ⚡ | difficulty: beginner -->
函数让你复用代码，指针让你掌控内存——这是C的核心竞争力

### 函数定义与调用

```c
#include <stdio.h>

// 无返回值无参数的函数
void sayHello() {
    printf("你好！欢迎学习C语言！\n");
}

// 有返回值的函数：计算两个数的最大值
int max(int a, int b) {
    if (a > b)
        return a;
    else
        return b;
}

// 有多个参数的函数：判断是否为闰年
int isLeapYear(int year) {
    if ((year % 400 == 0) ||
        (year % 4 == 0 && year % 100 != 0)) {
        return 1;   // 是闰年
    }
    return 0;       // 不是闰年
}

// 函数原型声明（让main能调用后面定义的函数）
void printCountdown(int n);

int main() {
    // 调用无参函数
    sayHello();

    // 调用有返回值函数
    int result = max(15, 23);
    printf("max(15, 23) = %d\n", result);

    // 使用返回值作为条件
    int year = 2024;
    if (isLeapYear(year))
        printf("%d 是闰年\n", year);
    else
        printf("%d 不是闰年\n", year);

    // 调用递归函数
    printf("\n倒计时:\n");
    printCountdown(5);

    return 0;
}

// 函数定义可以在main之后（需提前声明原型）
void printCountdown(int n) {
    if (n > 0) {
        printf("%d...\n", n);
        printCountdown(n - 1);   // 递归调用自身
    } else {
        printf("发射! 🚀\n");
    }
}
```

> C函数的结构很清晰：**返回类型 + 函数名 + 参数列表 + 函数体**。
>
> 几个要点：
> - **void** 表示没有返回值
> - **return** 不仅返回值，还会立即结束函数执行
> - **函数必须先声明再使用**——如果函数定义在main后面，就得在前面写一个**函数原型**（就是带分号的函数签名）
> - **递归**就是函数调用自己，但必须有终止条件，否则就是无限递归→栈溢出→崩溃
>
> > 💡 C语言没有函数重载！同名函数不管参数列表多不一样，编译器都会报重复定义错误。这是跟C++/Java的一个重要区别。

### 指针基础

```c
#include <stdio.h>

int main() {
    int num = 42;

    // & 取地址运算符：获取变量在内存中的地址
    int *ptr = &num;   // ptr是指针变量，存储num的地址

    printf("num 的值: %d\n", num);
    printf("num 的地址: %p\n", &num);      // %p 以十六进制打印地址
    printf("ptr 存储的地址: %p\n", ptr);    // ptr和&num相同
    printf("ptr 自身的地址: %p\n", &ptr);

    // * 解引用运算符：通过地址访问其指向的值
    printf("*ptr (解引用): %d\n", *ptr);   // 结果为42

    // 通过指针修改原始变量的值
    *ptr = 100;
    printf("通过指针修改后, num = %d\n", num);  // num变为100

    // 指针的大小（64位系统上为8字节）
    printf("指针变量的大小: %zu 字节\n", sizeof(ptr));

    // 空指针
    int *nullPtr = NULL;   // NULL表示指针不指向任何有效地址
    if (nullPtr == NULL) {
        printf("nullPtr 是空指针\n");
    }

    return 0;
}
```

> **指针是C语言的灵魂，也是噩梦的开始。**
>
> 说它重要，因为不懂指针就不算真正学过C。说它是噩梦，因为指针相关的bug往往最难排查——段错误（Segmentation Fault）、野指针、内存泄漏……这些都是指针惹的祸。
>
> 核心概念就两个符号：
> - **&（取地址）**：获取变量在内存中的位置。`&num` 就是num的"门牌号"
> - ***（解引用）**：根据地址找到对应的值。`*ptr` 就是"去ptr存的那个地址看看里面放了什么"
>
> 理解指针的关键在于这个模型：**ptr存的是地址，*ptr就是那个地址上的值**。修改*ptr等于修改原始变量——这就是指针强大的地方。
>
> 在64位系统上，所有指针的大小都是8字节（因为地址总线是64位的），不管它指向什么类型的数据。
>
> > ⚠️ NULL是C语言中表示"无效指针"的特殊值。访问NULL指针会导致程序立即崩溃（段错误）。虽然崩溃听起来很糟，但总比拿着一个随机地址乱读写要好——后者产生的bug可能隐藏很久才暴露出来。

### 指针与函数 — 交换两个数（传址调用）

```c
#include <stdio.h>

// ❌ 错误示范：值传递无法交换原变量
void swapBad(int a, int b) {
    int temp = a;
    a = b;
    b = temp;
    // 这里改的是形参a,b的副本，不影响实参x,y
}

// ✅ 正确做法：通过指针实现地址传递
void swap(int *a, int *b) {
    int temp = *a;   // 解引用取出a指向的值
    *a = *b;         // 将b指向的值赋给a指向的位置
    *b = temp;       // 将temp存入b指向的位置
}

int main() {
    int x = 10, y = 20;

    printf("交换前: x=%d, y=%d\n", x, y);

    // 值传递 —— 无法真正交换
    swapBad(x, y);
    printf("swapBad后: x=%d, y=%d (没变!)\n", x, y);

    // 地址传递 —— 真正交换了
    swap(&x, &y);    // 传入x和y的地址
    printf("swap后: x=%d, y=%d (交换成功!)\n", x, y);

    return 0;
}
```

> 这个例子完美展示了C语言**值传递**和**地址传递**的区别——这也是理解指针最关键的一课。
>
> **值传递的问题**：swapBad函数接收的是x和y的**副本**。函数内部怎么折腾这两个副本，跟外面的x、y完全没有关系。就像我把你的照片涂改了，不会影响你本人一样。
>
> **指针传址的解法**：把x和y的**地址**（&x, &y）传给函数，函数通过指针直接操作原始内存位置。这时候改的就是真正的x和y了。
>
> 这是C语言中让函数"影响外部数据"的标准模式。以后你会频繁用到——比如一个函数需要修改多个值的时候，就必须用指针。
>
> > 💡 很多初学者不理解为什么C不直接支持引用传递（像C++那样）。原因是C追求简洁和透明——你想传地址就显式地传指针，一切都清清楚楚地写在代码里。这种"所见即所得"的设计哲学贯穿了整个C语言。

## 数组与字符串 <!-- tutorial-id: c-array | icon: 📚 | difficulty: intermediate -->
数组管理有序数据，字符串是C的软肋

### 一维数组 — 声明、初始化、遍历、求最大值

```c
#include <stdio.h>

int main() {
    // 方式1: 完全初始化
    int scores[5] = {90, 85, 78, 92, 88};

    // 方式2: 部分初始化（剩余元素自动补0）
    int arr[10] = {1, 2, 3};  // 后面7个都是0

    // 方式3: 省略长度（由初始值个数决定）
    int nums[] = {45, 12, 67, 34, 89, 23};

    // 遍历数组
    printf("所有成绩: ");
    int len = sizeof(scores) / sizeof(scores[0]);  // 计算数组长度
    for (int i = 0; i < len; i++) {
        printf("%d ", scores[i]);
    }
    printf("\n共 %d 个元素\n", len);

    // 求数组最大值及索引
    int maxVal = nums[0], maxIdx = 0;
    for (int i = 1; i < 6; i++) {
        if (nums[i] > maxVal) {
            maxVal = nums[i];
            maxIdx = i;
        }
    }
    printf("\nnums数组最大值: %d (索引: %d)\n", maxVal, maxIdx);

    // 数组求和与平均值
    int total = 0;
    for (int i = 0; i < len; i++) {
        total += scores[i];
    }
    printf("平均分: %.1f\n", (double)total / len);

    return 0;
}
```

> C数组的几个关键特点：
>
> - **内存连续**：数组元素在内存中紧挨着排列，这也是可以通过下标O(1)快速访问的原因
> - **大小固定**：声明时确定，运行时不能改变（想动态大小得用malloc，后面会说）
> - **索引从0开始**：第一个元素是arr[0]，最后一个元素是arr[n-1]
> - **没有内置length属性**：要用 `sizeof(arr)/sizeof(arr[0])` 手动计算长度
>
> > ⚠️ **数组越界是C语言最危险的操作之一！** 访问arr[10]但数组只有10个元素（索引0~9），这种行为在C语言中是**未定义行为**——可能读到垃圾值、可能崩溃、可能"看起来正常"但其实已经破坏了相邻内存。编译器通常不会报错，全靠你自己小心。

### 二维数组 — 矩阵初始化和遍历

```c
#include <stdio.h>

int main() {
    // 二维数组声明与初始化（3行4列的矩阵）
    int matrix[3][4] = {
        {1,  2,  3,  4},    // 第0行
        {5,  6,  7,  8},    // 第1行
        {9, 10, 11, 12}     // 第2行
    };

    // 按行列格式打印矩阵
    printf("3×4 矩阵:\n");
    int rows = sizeof(matrix) / sizeof(matrix[0]);           // 行数 = 3
    int cols = sizeof(matrix[0]) / sizeof(matrix[0][0]);     // 列数 = 4

    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < cols; j++) {
            printf("%3d ", matrix[i][j]);   // %3d 占3位右对齐
        }
        printf("\n");   // 每行结束后换行
    }

    // 计算每行的和
    printf("\n每行之和:\n");
    for (int i = 0; i < rows; i++) {
        int rowSum = 0;
        for (int j = 0; j < cols; j++) {
            rowSum += matrix[i][j];
        }
        printf("第%d行之和: %d\n", i, rowSum);
    }

    // 求整个矩阵的最大值
    int maxVal = matrix[0][0];
    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < cols; j++) {
            if (matrix[i][j] > maxVal)
                maxVal = matrix[i][j];
        }
    }
    printf("矩阵最大值: %d\n", maxVal);

    return 0;
}
```

> 二维数组可以理解为"数组的数组"——每个元素又是一个一维数组。
>
> 内存布局是**按行优先**的：先存完第0行的所有列，再存第1行……所以 `matrix[i][j]` 实际上是在找"第i行的第j个元素"。
>
> 用sizeof计算行列数的方法值得记住：
> - 行数 = `sizeof(二维数组) / sizeof(一维行)`
> - 列数 = `sizeof(一行) / sizeof(单个元素)`
>
> 这种方法不需要硬编码数字，改了数组声明之后自动适配。

### 字符串操作 — 常用字符串函数

```c
#include <stdio.h>
#include <string.h>   // 字符串函数头文件

int main() {
    // C语言字符串是以'\0'（空字符）结尾的字符数组
    char str1[50] = "Hello";
    char str2[] = "World";

    // strlen: 获取字符串长度（不含'\0'）
    printf("str1长度: %zu\n", strlen(str1));     // 5

    // strcpy: 复制字符串
    char dest[50];
    strcpy(dest, str1);
    printf("strcpy复制结果: %s\n", dest);       // Hello

    // strcat: 拼接字符串
    strcat(dest, " ");
    strcat(dest, str2);
    printf("strcat拼接结果: %s\n", dest);       // Hello World

    // strcmp: 比较字符串（返回0表示相等）
    char s1[] = "apple", s2[] = "banana";
    int cmp = strcmp(s1, s2);
    if (cmp < 0)
        printf("\"%s\" < \"%s\"\n", s1, s2);   // apple < banana
    else if (cmp > 0)
        printf("\"%s\" > \"%s\"\n", s1, s2);
    else
        printf("\"%s\" == \"%s\"\n", s1, s2);

    // 手动遍历字符串（利用'\0'作为结束标志）
    printf("\n逐字符输出 str1: ");
    for (int i = 0; str1[i] != '\0'; i++) {
        printf("[%c]", str1[i]);
    }
    printf("\n");

    return 0;
}
```

> C语言的字符串处理是出了名的"原始"。没有String类，就是一个以 `\0`（空字符，ASCII值为0）结尾的字符数组。
>
> `<string.h>` 提供了几十个字符串函数，最常用的这几个必须熟：
>
> | 函数 | 功能 | 注意事项 |
> |------|------|----------|
> | strlen(str) | 返回长度 | 不包含末尾的\0 |
> | strcpy(dst, src) | 复制 | **目标缓冲区要足够大！** |
> | strcat(dst, src) | 拼接到dst末尾 | 同样要注意缓冲区溢出 |
> | strcmp(s1, s2) | 比较 | 返回0表示相等，负数s1<s2，正数s1>s2 |
>
> > ⚠️ **strcpy和strcat是不安全的！** 它们不做边界检查，如果源字符串比目标缓冲区长，就会发生**缓冲区溢出**——轻则数据损坏，重则被黑客利用执行恶意代码。实际开发中请用 **strncpy** 和 **strncat** 替代，它们允许你指定最大复制长度。

## 结构体与内存管理 <!-- tutorial-id: c-struct | icon: 🏗️ | difficulty: intermediate -->
结构体组织复杂数据，malloc/free掌管动态内存

### 结构体基础

```c
#include <stdio.h>
#include <string.h>

// 定义Student结构体类型
struct Student {
    char name[20];    // 姓名
    int age;          // 年龄
    float score;      // 成绩
    char grade;       // 等级
};

int main() {
    // 方式1: 声明时直接初始化
    struct Student stu1 = {"张三", 20, 92.5f, 'A'};

    // 方式2: 先声明再逐字段赋值
    struct Student stu2;
    strcpy(stu2.name, "李四");   // 字符数组要用strcpy赋值
    stu2.age = 21;
    stu2.score = 85.0f;
    stu2.grade = 'B';

    // 方式3: C99指定成员初始化
    struct Student stu3 = {.name = "王五", .score = 78.5f, .age = 19};

    // 访问结构体成员: 使用点号 . 运算符
    printf("学生信息:\n");
    printf("姓名: %s, 年龄: %d, 成绩: %.1f, 等级: %c\n",
           stu1.name, stu1.age, stu1.score, stu1.grade);
    printf("姓名: %s, 年龄: %d, 成绩: %.1f, 等级: %c\n",
           stu2.name, stu2.age, stu2.score, stu2.grade);

    // 结构体可以整体赋值
    struct Student stu4 = stu1;   // stu4是stu1的完整拷贝
    printf("\nstu4 = stu1 拷贝结果: %s\n", stu4.name);

    // 结构体大小（包含内存对齐填充）
    printf("\nstruct Student 大小: %zu 字节\n", sizeof(struct Student));

    // 用typedef简化类型名
    typedef struct Student Stu;
    Stu stu5 = {"赵六", 22, 95.0f, 'A'};
    printf("typedef简化: %s 成绩 %.1f\n", stu5.name, stu5.score);

    return 0;
}
```

> 结构体（struct）是C语言组织复杂数据的唯一手段——它把不同类型的数据打包在一起。
>
> 几种初始化方式：
> - **顺序初始化**：按声明顺序 `{值1, 值2, ...}`，简单但依赖顺序不能错
> - **逐字段赋值**：先用 `.` 运算符一个个来，灵活但代码多点
> - **C99指定成员初始化**：`.成员名 = 值`，顺序随意，**推荐这种方式**，可读性最好
>
> 关于结构体大小：由于**内存对齐**（memory alignment）的原因，`sizeof(struct)` 通常**大于**所有成员大小之和。编译器会在成员之间插入填充字节，让每个成员的地址符合其对齐要求（比如int通常要求4字节对齐）。这牺牲了一点空间换取了访问速度。
>
> typedef可以为结构体创建别名，省得每次都写 `struct Student` 这么长。

### malloc 与 free — 动态内存分配

```c
#include <stdio.h>
#include <stdlib.h>   // malloc/free的头文件

int main() {
    int n;

    printf("请输入数组大小: ");
    scanf("%d", &n);

    // malloc: 在堆区动态分配内存
    // (int*) 将返回的void*指针转换为int*
    int *arr = (int*)malloc(n * sizeof(int));

    // 检查分配是否成功（失败返回NULL）
    if (arr == NULL) {
        printf("内存分配失败!\n");
        return 1;
    }

    printf("请输入 %d 个整数:\n", n);
    for (int i = 0; i < n; i++) {
        scanf("%d", &arr[i]);
    }

    // 输出数组内容
    printf("\n你输入的数组: ");
    for (int i = 0; i < n; i++) {
        printf("%d ", arr[i]);
    }
    printf("\n");

    // 计算平均值
    double sum = 0;
    for (int i = 0; i < n; i++) {
        sum += arr[i];
    }
    printf("平均值: %.2f\n", sum / n);

    // free: 释放动态分配的内存（防止内存泄漏）
    free(arr);
    arr = NULL;   // 释放后将指针置空，避免野指针

    printf("内存已释放\n");
    return 0;
}
```

> **动态内存分配是C语言最重要的技能之一，也是最容易出问题的地方。**
>
> 核心流程：
> 1. **malloc(size)**：向操作系统申请一块指定大小的内存，返回首地址（void*类型，通常需要强制转换）
> 2. **检查返回值**：malloc可能失败（内存不足），此时返回NULL。**不检查就直接用的话，解引用NULL指针程序直接崩**
> 3. **正常使用**：跟普通数组一样用
> 4. **free(ptr)**：**用完必须释放！** 否则这块内存就永远占着还回不去——这就叫**内存泄漏**（Memory Leak）
> 5. **置空指针**：free之后把指针设为NULL是好习惯，防止后续代码误用变成**野指针**（Dangling Pointer）
>
> > ⚠️ **内存泄漏是C/C++程序最常见的bug之一。** 短时间运行看不出问题，但如果程序是长期运行的服务端进程（比如Web服务器），内存泄漏最终会把内存耗尽导致程序崩溃。养成"谁申请谁释放"的好习惯，malloc和free一定要成对出现。
>
> > 💡 补充两个相关函数：**calloc(n, size)** 类似malloc但会把内存全部清零；**realloc(ptr, new_size)** 可以调整已分配内存块的大小（可能需要搬家的位置）。

### 结构体数组 — 存储多名学生信息

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct Student {
    char name[20];
    int age;
    float score;
};

int main() {
    int count;

    printf("请输入学生人数: ");
    scanf("%d", &count);

    // 动态分配结构体数组
    struct Student *students = (struct Student*)malloc(
        count * sizeof(struct Student)
    );

    if (students == NULL) {
        printf("内存分配失败!\n");
        return 1;
    }

    // 录入每个学生的信息
    for (int i = 0; i < count; i++) {
        printf("\n=== 第%d个学生 ===\n", i + 1);
        printf("姓名: ");
        scanf("%s", students[i].name);   // name是数组，不需要&
        printf("年龄: ");
        scanf("%d", &students[i].age);
        printf("成绩: ");
        scanf("%f", &students[i].score);
    }

    // 显示所有学生信息
    printf("\n========== 学生列表 ==========\n");
    printf("%-10s %-6s %-8s\n", "姓名", "年龄", "成绩");
    printf("--------------------------------\n");
    for (int i = 0; i < count; i++) {
        printf("%-10s %-6d %-8.1f\n",
               students[i].name,
               students[i].age,
               students[i].score);
    }

    // 计算平均成绩
    float total = 0;
    for (int i = 0; i < count; i++) {
        total += students[i].score;
    }
    printf("\n班级平均成绩: %.2f\n", total / count);

    // 释放动态分配的结构体数组
    free(students);
    students = NULL;

    return 0;
}
```

> 把结构体和动态内存结合起来，就是C语言管理批量数据的常规做法。
>
> 几个细节提醒：
> - `students[i].name` 本身已经是数组名（即地址），所以scanf不需要再加 `&`
> - `students[i].age` 和 `students[i].score` 是基本类型变量，scanf仍然需要 `&`
> - malloc的大小是 `count * sizeof(struct Student)`，一次性分配够存放所有学生的连续内存
> - free(students) 一次性释放整块内存——不用循环逐个free
>
> 这种"动态结构体数组"的模式在实际项目中非常常见：从文件或网络读取数据→malloc分配空间→填充数据→处理数据→free释放。整个生命周期你要时刻清楚每一块内存的状态。

## 文件操作 <!-- tutorial-id: c-file | icon: 📁 | difficulty: intermediate -->
读写文件——让程序和数据持久化

### 写入文件 — fopen/fprintf/fclose

```c
#include <stdio.h>

int main() {
    // fopen打开文件: "w"模式表示写入（会覆盖已有内容）
    FILE *fp = fopen("data.txt", "w");

    // 检查文件是否打开成功
    if (fp == NULL) {
        printf("无法打开文件!\n");
        return 1;
    }

    // fprintf: 格式化写入文件（用法同printf，多了文件指针参数）
    fprintf(fp, "学生成绩表\n");
    fprintf(fp, "--------------------------------\n");
    fprintf(fp, "%-10s %-6s %-8s\n", "姓名", "年龄", "成绩");

    // 写入多条记录
    fprintf(fp, "%-10s %-6d %-8.1f\n", "张三", 20, 92.5);
    fprintf(fp, "%-10s %-6d %-8.1f\n", "李四", 21, 85.0);
    fprintf(fp, "%-10s %-6d %-8.1f\n", "王五", 19, 78.5);

    // fclose: 关闭文件（保存缓冲区数据并释放资源）
    fclose(fp);
    printf("数据已写入 data.txt\n");

    // "a"模式: 追加写入（不覆盖原有内容）
    fp = fopen("data.txt", "a");
    if (fp != NULL) {
        fprintf(fp, "%-10s %-6d %-8.1f\n", "赵六", 22, 95.0);
        fclose(fp);
        printf("追加一条记录成功\n");
    }

    return 0;
}
```

> C语言的文件操作围绕三个核心函数展开：
>
> - **fopen(filename, mode)**：打开文件，返回FILE*指针。mode包括 `"r"` 只读、`"w"` 写入（**会清空原文件！**）、`"a"` 追加
> - **fprintf(fp, format, ...)**：跟printf用法一模一样，只是多了第一个文件指针参数
> - **fclose(fp)**：关闭文件——这一步**绝对不能忘**！不close的话缓冲区的数据可能没写进去，而且文件描述符资源也会泄漏
>
> > ⚠️ **每次调用fopen之后都要检查返回值是否为NULL！** 文件可能因为权限不足、路径不存在、磁盘满了等各种原因打不开。如果不检查就直接用fprintf，大概率会 segfault。

### 读取文件 — fopen/fgets/fscanf

```c
#include <stdio.h>

int main() {
    FILE *fp = fopen("data.txt", "r");   // "r"模式: 只读打开

    if (fp == NULL) {
        printf("无法打开文件! 请先运行写入示例。\n");
        return 1;
    }

    printf("===== 方式1: fgets逐行读取 =====\n");
    char line[256];

    // fgets读取一行（包含换行符），遇到EOF或读满返回NULL
    while (fgets(line, sizeof(line), fp) != NULL) {
        printf("%s", line);   // fgets保留换行符，无需额外加\n
    }

    // 文件指针已到达末尾，需要rewind回到开头才能重新读取
    rewind(fp);

    printf("\n===== 方式2: fscanf格式化读取 =====\n");
    char name[20];
    int age;
    float score;

    // fscanf按格式读取，返回成功读取的字段数量
    printf("%-10s %-6s %-8s\n", "姓名", "年龄", "成绩");
    while (fscanf(fp, "%s %d %f", name, &age, &score) == 3) {
        printf("%-10s %-6d %-8.1f\n", name, age, score);
    }

    fclose(fp);
    return 0;
}
```

> 读文件有两种主流方式：
>
> **fgets(line, size, fp)**：每次读一行，遇到换行或EOF停止。适合读文本文件，特别是每行格式不一致的情况。注意fgets会保留换行符，而且最多读size-1个字符（留一个位置放\0）。
>
> **fscanf(fp, format, ...)**：按格式解析，类似scanf但是从文件读。返回值是**成功读取的字段数量**，用 `== 期望数量` 来判断是否成功读了一条完整记录。适合读结构化数据（比如每行都是"名字 年龄 成绩"的格式）。
>
> **rewind(fp)** 把文件指针重新定位到开头——读完一遍之后想再读一遍就需要它。
>
> > 💡 如果文件同时需要读写操作，可以用 `"r+"` 模式打开。但要注意读写切换之间需要调用 `fseek()` 或 `fflush()` 定位/刷新缓冲区，否则可能会读到脏数据。

### 二进制读写 — fwrite/fread

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct Person {
    char name[20];
    int age;
    double height;
};

int main() {
    // --- 写入二进制文件 ---
    FILE *fp = fopen("people.dat", "wb");   // "wb": 二进制写入

    if (fp == NULL) {
        printf("无法创建文件!\n");
        return 1;
    }

    // 准备数据
    struct Person people[3] = {
        {"Alice", 25, 1.68},
        {"Bob",   30, 1.82},
        {"Carol", 28, 1.75}
    };

    // fwrite: 以二进制形式写入数据块
    // 参数: 数据指针, 单元大小, 单元数量, 文件指针
    size_t written = fwrite(people, sizeof(struct Person), 3, fp);
    printf("成功写入 %zu 条记录\n", written);

    fclose(fp);

    // --- 读取二进制文件 ---
    fp = fopen("people.dat", "rb");   // "rb": 二进制读取

    if (fp == NULL) {
        printf("无法打开文件!\n");
        return 1;
    }

    // 先获取文件总大小，计算有多少条记录
    fseek(fp, 0, SEEK_END);           // 移动到文件末尾
    long fileSize = ftell(fp);        // 获取当前位置（即文件大小）
    rewind(fp);                        // 回到文件开头
    size_t recordCount = fileSize / sizeof(struct Person);

    printf("文件大小: %ld 字节, 共 %zu 条记录\n\n",
           fileSize, recordCount);

    // fread: 以二进制形式读取数据块
    struct Person *buffer = (struct Person*)malloc(fileSize);
    size_t readCount = fread(buffer, sizeof(struct Person), recordCount, fp);

    printf("%-10s %-6s %-8s\n", "姓名", "年龄", "身高");
    for (size_t i = 0; i < readCount; i++) {
        printf("%-10s %-ld %-8.2fm\n",
               buffer[i].name,
               buffer[i].age,
               buffer[i].height);
    }

    free(buffer);
    fclose(fp);
    return 0;
}
```

> 二进制读写直接操作内存的原始字节，效率比文本方式高得多，而且不会有文本编码的问题。
>
> **fwrite(ptr, size, count, fp)**：把count个、每个size字节的 数据块写入文件。这里我们一次写入了3个Person结构体。
>
> **fread(ptr, size, count, fp)**：反过来，从文件读取。
>
> 一个实用技巧：想知道二进制文件里有多少条记录？
> 1. `fseek(fp, 0, SEEK_END)` —— 跳到文件末尾
> 2. `ftell(fp)` —— 当前位置就是文件总字节数
> 3. `rewind(fp)` —— 回到开头
> 4. 文件大小 ÷ 每条记录大小 = 记录数
>
> 文件模式加 `b` 后缀：`"wb"` 二进制写入、`"rb"` 二进制读取。在Windows上这一点特别重要，不加b的话换行符会被自动转换（\n → \r\n），搞坏二进制数据。

## 综合实战：学生成绩管理系统 <!-- tutorial-id: c-project | icon: 🎯 | difficulty: advanced -->
一个完整的C语言项目——CRUD全搞定

### 系统框架 — 主菜单与功能选择

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_STUDENTS 100

// 学生结构体
struct Student {
    int id;             // 学号
    char name[20];      // 姓名
    float score;        // 成绩
};

// 全局变量：学生数组和当前人数
struct Student students[MAX_STUDENTS];
int studentCount = 0;

// 函数声明
void showMenu();
void addStudent();
void showAllStudents();
void searchStudent();
void sortByScore();
void deleteStudent();

int main() {
    int choice;

    // 主菜单循环
    while (1) {
        showMenu();
        printf("请选择功能(0-5): ");
        scanf("%d", &choice);

        switch (choice) {
            case 1: addStudent();      break;
            case 2: showAllStudents(); break;
            case 3: searchStudent();   break;
            case 4: sortByScore();     break;
            case 5: deleteStudent();   break;
            case 0:
                printf("感谢使用，再见！\n");
                return 0;
            default:
                printf("无效选项，请重新选择!\n");
        }
        printf("\n按回车继续...");
        getchar(); getchar();   // 清除缓冲区并等待用户按键
    }
}

// 显示主菜单
void showMenu() {
    system("cls || clear");   // 清屏（兼容Windows/Linux）
    printf("==============================\n");
    printf("    学生成绩管理系统\n");
    printf("==============================\n");
    printf("  1. 添加学生\n");
    printf("  2. 显示所有学生\n");
    printf("  3. 查找学生\n");
    printf("  4. 按成绩排序\n");
    printf("  5. 删除学生\n");
    printf("  0. 退出系统\n");
    printf("==============================\n");
}
```

> 这是一个典型的C语言命令行项目框架。梳理一下设计要点：
>
> - **结构体设计**：Student封装了学号、姓名、成绩三个字段。注意name用了定长字符数组（char[20]），这是C语言处理字符串的标准做法
> - **全局数据**：使用固定大小的结构体数组 `students[MAX_STUDENTS]`，`studentCount` 跟踪当前有多少条记录。这种设计简单直接，缺点是上限固定（100条）
> - **主菜单循环**：`while(1) + switch` 是C语言做交互式菜单的经典模式。用户选0退出，否则一直转
> - **模块化设计**：每个功能封装成独立函数，通过前向声明解决定义顺序问题
>
> > 💡 `getchar(); getchar();` 连续两次是用来清除scanf留在缓冲区里的换行符。第一次吃掉前面的残留，第二次等待用户按键。这个小技巧在命令行程序中经常用到。

### 核心功能实现 — 增删改查与排序

```c
// ---- 接续上面的框架代码 ----

// 添加学生
void addStudent() {
    if (studentCount >= MAX_STUDENTS) {
        printf("学生列表已满，无法添加!\n");
        return;
    }

    printf("\n--- 添加学生 ---\n");
    printf("学号: ");
    scanf("%d", &students[studentCount].id);
    printf("姓名: ");
    scanf("%s", students[studentCount].name);
    printf("成绩: ");
    scanf("%f", &students[studentCount].score);

    studentCount++;
    printf("✓ 添加成功! 当前共 %d 名学生\n", studentCount);
}

// 显示所有学生
void showAllStudents() {
    if (studentCount == 0) {
        printf("暂无学生记录!\n");
        return;
    }

    printf("\n%-8s %-12s %-8s\n", "学号", "姓名", "成绩");
    printf("--------------------------------\n");
    for (int i = 0; i < studentCount; i++) {
        printf("%-8d %-12s %-8.1f\n",
               students[i].id,
               students[i].name,
               students[i].score);
    }
}

// 按学号查找学生
void searchStudent() {
    int targetId;
    printf("\n请输入要查找的学号: ");
    scanf("%d", &targetId);

    for (int i = 0; i < studentCount; i++) {
        if (students[i].id == targetId) {
            printf("找到学生: 学号=%d, 姓名=%s, 成绩=%.1f\n",
                   students[i].id, students[i].name, students[i].score);
            return;
        }
    }
    printf("未找到学号为 %d 的学生\n", targetId);
}

// 冒泡排序：按成绩降序排列
void sortByScore() {
    for (int i = 0; i < studentCount - 1; i++) {
        for (int j = 0; j < studentCount - 1 - i; j++) {
            if (students[j].score < students[j + 1].score) {
                // 交换两个学生记录
                struct Student temp = students[j];
                students[j] = students[j + 1];
                students[j + 1] = temp;
            }
        }
    }
    printf("✓ 已按成绩降序排序!\n");
    showAllStudents();
}

// 删除学生（通过学号）
void deleteStudent() {
    int targetId;
    printf("\n请输入要删除的学号: ");
    scanf("%d", &targetId);

    int found = -1;
    for (int i = 0; i < studentCount; i++) {
        if (students[i].id == targetId) {
            found = i;
            break;
        }
    }

    if (found == -1) {
        printf("未找到学号为 %d 的学生\n", targetId);
        return;
    }

    // 将后面的元素前移一位覆盖目标
    for (int i = found; i < studentCount - 1; i++) {
        students[i] = students[i + 1];
    }
    studentCount--;

    printf("✓ 已删除学号为 %d 的学生\n", targetId);
}
```

> 到这里，一个完整的CRUD（增删改查）系统就完成了。回顾一下各个操作的实现思路：
>
> | 操作 | 实现方式 | 要点 |
> |------|----------|------|
> | **添加** | 在数组末尾追加，count++ | 先检查数组是否已满 |
> | **查询** | 线性遍历数组，匹配id | 找到了直接return |
> | **排序** | 冒泡排序，按score降序 | 结构体整体赋值完成交换 |
> | **删除** | 找到目标后，后续元素全部前移一位 | count减1，不需要真的"删除"内存 |
>
> > 💡 这个项目虽然是基于固定大小数组的简单实现，但它展示的架构模式——**数据结构 + 操作函数 + 用户界面**——在任何规模的C语言项目中都是通用的。后续进阶方向：把固定数组换成动态链表、加入文件持久化（启动时加载、退出时保存）、增加更多字段和校验逻辑……
>
> > 学完这些内容，你对C语言应该有了相当扎实的理解。说实话，C语言入门曲线确实比Python陡——你得关心内存、关心指针、关心类型细节。但正是这种"什么都要自己管"的特性，让你真正理解了计算机是如何工作的。这门功夫，值得花时间练。
