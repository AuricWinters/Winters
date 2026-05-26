export default {
  id: 'c',
  name: 'C语言',
  icon: 'C',
  version: '',
  description: '系统编程的基础语言，适合学习编程思维',
  tutorials: [
    {
      id: 'c-hello',
      title: 'Hello World',
      icon: '👋',
      description: '编写第一个C程序，学习基本语法结构',
      difficulty: 'beginner',
      examples: [
        {
          title: '最简单的程序',
          code: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`,
          explanation: '#include <stdio.h> 引入标准输入输出库，提供printf函数。int main() 是程序入口函数，每个C程序必须有且仅有一个main函数。printf() 用于向控制台输出文本，\\n表示换行。return 0 表示程序正常结束。'
        },
        {
          title: '变量声明与格式化输出',
          code: `#include <stdio.h>

int main() {
    int age = 25;            // 整型变量
    float height = 1.75f;    // 单精度浮点数
    char name[] = "小明";    // 字符数组（字符串）
    
    printf("姓名: %s\\n", name);       // %s 输出字符串
    printf("年龄: %d\\n", age);         // %d 输出整数
    printf("身高: %.2f\\n", height);   // %.2f 保留2位小数
    
    return 0;
}`,
          explanation: 'C语言中变量必须先声明类型再使用：int整型、float单精度浮点、char字符/字符串。printf使用格式说明符输出不同类型：%s字符串、%d十进制整数、%f浮点数。%.2f表示保留两位小数。char[]用于存储字符串，本质是字符数组。'
        }
      ]
    },
    {
      id: 'c-var',
      title: '变量与数据类型',
      icon: '📦',
      description: '学习C语言的基本数据类型和变量操作',
      difficulty: 'beginner',
      examples: [
        {
          title: '基本数据类型',
          code: `#include <stdio.h>

int main() {
    // 整型家族
    int i = 100;              // 基本整型，通常4字节
    short s = 10;             // 短整型，2字节
    long l = 100000L;         // 长整型，4或8字节

    // 浮点型家族
    float f = 3.14f;          // 单精度，4字节，精度约7位
    double d = 3.1415926535;  // 双精度，8字节，精度约15位

    // 字符型
    char c = \'A\';            // 字符，1字节，存储ASCII码值

    printf("int: %d, 大小: %zu 字节\\n", i, sizeof(i));
    printf("short: %d, 大小: %zu 字节\\n", s, sizeof(s));
    printf("long: %ld, 大小: %zu 字节\\n", l, sizeof(l));
    printf("float: %f, 大小: %zu 字节\\n", f, sizeof(f));
    printf("double: %.10lf, 大小: %zu 字节\\n", d, sizeof(d));
    printf("char: %c (ASCII: %d), 大小: %zu 字节\\n", c, c, sizeof(c));

    return 0;
}`,
          explanation: 'C语言的基本数据类型分为三大类：(1) 整型：int(4B)、short(2B)、long(4-8B)；(2) 浮点型：float(4B, ~7位精度)、double(8B, ~15位精度)；(3) 字符型：char(1B)。sizeof运算符可以获取任何数据类型或变量占用的字节数，%zu是size_t类型的格式说明符。'
        },
        {
          title: '类型转换',
          code: `#include <stdio.h>

int main() {
    // 隐式类型转换（自动提升）
    int a = 10;
    double b = a;         // int 自动转为 double
    printf("隐式转换: int %d -> double %.2f\\n", a, b);

    // 整数除法会截断小数
    int x = 7, y = 2;
    printf("整数除法: %d / %d = %d\\n", x, y, x / y);   // 结果为3

    // 显式强制类型转换
    double result = (double)x / y;
    printf("强制转换后: (double)%d / %d = %.2f\\n", x, y, result);

    // 混合运算中的类型提升
    int m = 5;
    float n = 2.5f;
    auto sum = m + n;     // m被提升为float后再相加
    printf("混合运算: %d + %.1f = %.1f\\n", m, n, sum);

    return 0;
}`,
          explanation: 'C语言中类型转换有两种方式：(1) 隐式转换：编译器自动将"较小"类型转换为"较大"类型（如int→double），但整数除法不会自动转浮点，7/2=3而非3.5；(2) 显式转换：使用(目标类型)表达式语法强制转换，如(double)7/2得到3.5。注意转换时可能丢失精度（如double→int会截断小数部分）。'
        },
        {
          title: '常量与宏定义',
          code: `#include <stdio.h>

// 宏定义：预处理器在编译前做文本替换
#define PI 3.14159
#define MAX_STUDENTS 50
#define SQUARE(x) ((x) * (x))

int main() {
    // const关键字定义只读变量（有类型检查）
    const int CLASS_SIZE = 30;
    const double GRADE_PASS = 60.0;

    // 使用宏常量
    printf("圆周率 PI = %f\\n", PI);
    printf("最大学生数 = %d\\n", MAX_STUDENTS);

    // 使用const常量
    printf("班级人数 = %d (不可修改)\\n", CLASS_SIZE);
    // CLASS_SIZE = 40;  // 错误！const变量不能修改

    // 使用带参数的宏
    int num = 5;
    printf("%d 的平方 = %d\\n", num, SQUARE(num));

    // sizeof查看各种类型大小
    printf("\\n各类型占用内存:\\n");
    printf("int: %zu 字节\\n", sizeof(int));
    printf("double: %zu 字节\\n", sizeof(double));
    printf("指针: %zu 字节\\n", sizeof(void*));

    return 0;
}`,
          explanation: 'C语言中定义常量有两种主要方式：(1) #define宏定义：预处理器指令，在编译前进行纯文本替换，没有类型检查，如#define PI 3.14159。带参宏如#define SQUARE(x)((x)*(x))也要注意括号。(2) const修饰符：定义具有类型的只读变量，编译器会进行类型检查，更安全。sizeof是运算符（不是函数），返回类型或变量的字节大小，在编译时确定。'
        }
      ]
    },
    {
      id: 'c-control',
      title: '控制语句',
      icon: '🔀',
      description: '学习if、switch、循环等控制结构',
      difficulty: 'beginner',
      examples: [
        {
          title: 'if-else 条件判断 — 成绩等级',
          code: `#include <stdio.h>

int main() {
    int score;

    printf("请输入成绩(0-100): ");
    scanf("%d", &score);

    if (score >= 90 && score <= 100) {
        printf("等级: A (优秀)\\n");
    } else if (score >= 80) {
        printf("等级: B (良好)\\n");
    } else if (score >= 70) {
        printf("等级: C (中等)\\n");
    } else if (score >= 60) {
        printf("等级: D (及格)\\n");
    } else if (score >= 0) {
        printf("等级: F (不及格)\\n");
    } else {
        printf("输入无效!\\n");
    }

    return 0;
}`,
          explanation: 'if-else语句根据条件表达式的真假执行不同的代码块。条件表达式结果为非零即为真，零为假。逻辑运算符：&&（与，两边都真才真）、||（或，一边真就真）、!（非，取反）。scanf("%d",&score)从键盘读取整数，&是取地址运算符，必须传变量地址给scanf。if-else if链从上到下依次判断，只执行第一个匹配的条件块。'
        },
        {
          title: 'for 循环 — 打印与求和',
          code: `#include <stdio.h>

int main() {
    // for循环打印1到10
    printf("打印1到10:\\n");
    for (int i = 1; i <= 10; i++) {   // 初始化; 条件; 更新
        printf("%d ", i);
    }
    printf("\\n");

    // for循环求1到100的和
    int sum = 0;
    for (int i = 1; i <= 100; i++) {
        sum += i;   // 等价于 sum = sum + i
    }
    printf("\\n1到100的和 = %d\\n", sum);

    // 嵌套for循环：打印九九乘法表
    printf("\\n九九乘法表:\\n");
    for (int i = 1; i <= 9; i++) {
        for (int j = 1; j <= i; j++) {
            printf("%dx%d=%-4d", i, j, i * j);
        }
        printf("\\n");
    }

    return 0;
}`,
          explanation: 'for循环语法：for(初始化语句; 循环条件; 更新语句){循环体}。执行顺序：(1) 执行初始化（只执行一次）；(2) 判断条件，若为假则退出循环；(3) 执行循环体；(4) 执行更新语句；(5) 回到第2步。+=是复合赋值运算符，sum += i等价于sum = sum + i。嵌套循环时外层每执行一次，内层完整执行一轮。%-4d表示左对齐占4位宽度输出。'
        },
        {
          title: 'while 与 switch — 简易计算器',
          code: `#include <stdio.h>

int main() {
    char op;
    double a, b;

    while (1) {   // while(1) 表示无限循环
        printf("\\n====== 简易计算器 ======\\n");
        printf("请输入表达式 (如: 3 + 5): ");
        scanf("%lf %c %lf", &a, &op, &b);

        switch (op) {
            case \'+\':
                printf("%.2lf + %.2lf = %.2lf\\n", a, b, a + b);
                break;
            case \'-\':
                printf("%.2lf - %.2lf = %.2lf\\n", a, b, a - b);
                break;
            case \'*\':
                printf("%.2lf * %.2lf = %.2lf\\n", a, b, a * b);
                break;
            case \'/\':
                if (b != 0)
                    printf("%.2lf / %.2lf = %.2lf\\n", a, b, a / b);
                else
                    printf("错误: 除数不能为零!\\n");
                break;
            default:
                printf("不支持的运算符: %c\\n", op);
        }

        // 询问是否继续
        printf("\\n继续计算? (y/n): ");
        char choice;
        scanf(" %c", &choice);   // 注意空格，跳过空白字符
        if (choice != \'y\' && choice != \'Y\')
            break;   // 跳出while循环
    }

    printf("感谢使用!\\n");
    return 0;
}`,
          explanation: 'while循环在每次迭代前检查条件，while(1)创建无限循环，需用break跳出。switch语句用于多分支选择：将变量与case标签逐一匹配，匹配成功后执行对应代码。**重要：每个case末尾要加break**，否则会"穿透"继续执行后续case代码。default处理所有未匹配的情况。do-while则先执行一次再判断条件。scanf中的空格" %c"用于跳过之前的换行符。'
        }
      ]
    },
    {
      id: 'c-func',
      title: '函数与指针',
      icon: '⚡',
      description: '学习函数定义、参数传递和指针入门',
      difficulty: 'beginner',
      examples: [
        {
          title: '函数定义与调用',
          code: `#include <stdio.h>

// 无返回值无参数的函数
void sayHello() {
    printf("你好！欢迎学习C语言！\\n");
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
    printf("max(15, 23) = %d\\n", result);

    // 使用返回值作为条件
    int year = 2024;
    if (isLeapYear(year))
        printf("%d 是闰年\\n", year);
    else
        printf("%d 不是闰年\\n", year);

    // 调用递归函数
    printf("\\n倒计时:\\n");
    printCountdown(5);

    return 0;
}

// 函数定义可以在main之后（需提前声明原型）
void printCountdown(int n) {
    if (n > 0) {
        printf("%d...\\n", n);
        printCountdown(n - 1);   // 递归调用自身
    } else {
        printf("发射! 🚀\\n");
    }
}`,
          explanation: 'C函数由四部分组成：返回类型、函数名、参数列表、函数体。void表示无返回值。return语句将值返回给调用者并结束函数执行。函数必须先声明或定义才能使用——如果在main之后定义，需要在之前写函数原型（声明）。递归是函数调用自身的技巧，必须有终止条件防止无限递归。%是取模运算符（求余数），用于判断整除关系。'
        },
        {
          title: '指针基础',
          code: `#include <stdio.h>

int main() {
    int num = 42;

    // & 取地址运算符：获取变量在内存中的地址
    int *ptr = &num;   // ptr是指针变量，存储num的地址

    printf("num 的值: %d\\n", num);
    printf("num 的地址: %p\\n", &num);      // %p 以十六进制打印地址
    printf("ptr 存储的地址: %p\\n", ptr);    // ptr和&num相同
    printf("ptr 自身的地址: %p\\n", &ptr);

    // * 解引用运算符：通过地址访问其指向的值
    printf("*ptr (解引用): %d\\n", *ptr);   // 结果为42

    // 通过指针修改原始变量的值
    *ptr = 100;
    printf("通过指针修改后, num = %d\\n", num);  // num变为100

    // 指针的大小（64位系统上为8字节）
    printf("指针变量的大小: %zu 字节\\n", sizeof(ptr));

    // 空指针
    int *nullPtr = NULL;   // NULL表示指针不指向任何有效地址
    if (nullPtr == NULL) {
        printf("nullPtr 是空指针\\n");
    }

    return 0;
}`,
          explanation: '指针是C语言的核心概念，它存储的是变量的**内存地址**而不是值本身。两个关键运算符：&(取地址)获取变量的地址，*(解引用)通过地址访问/修改该地址处存储的值。声明指针时用type*ptr，如int*ptr表示"指向int的指针"。指针本身也占用内存空间（64位系统上8字节），NULL是表示"无有效地址"的特殊值。理解指针的关键：ptr存储地址，*ptr就是那个地址上的值。'
        },
        {
          title: '指针与函数 — 交换两个数（传址调用）',
          code: `#include <stdio.h>

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

    printf("交换前: x=%d, y=%d\\n", x, y);

    // 值传递 —— 无法真正交换
    swapBad(x, y);
    printf("swapBad后: x=%d, y=%d (没变!)\\n", x, y);

    // 地址传递 —— 真正交换了
    swap(&x, &y);    // 传入x和y的地址
    printf("swap后: x=%d, y=%d (交换成功!)\\n", x, y);

    return 0;
}`,
          explanation: 'C函数默认采用**值传递**——将实参的副本传给形参，函数内部修改形参不会影响外部实参。swapBad虽然内部完成了交换，但操作的是副本，原x,y不变。解决方案是用**指针传址**：将变量的地址(&x,&y)传给接收指针参数(int*a,int*b)的函数，通过解引用(*a,*b)直接操作原始内存位置，从而真正修改外部变量。这是C语言中"让函数影响外部数据"的标准模式。'
        }
      ]
    },
    {
      id: 'c-array',
      title: '数组与字符串',
      icon: '📚',
      description: '学习多维数组操作和字符串处理',
      difficulty: 'intermediate',
      examples: [
        {
          title: '一维数组 — 声明、初始化、遍历、求最大值',
          code: `#include <stdio.h>

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
    printf("\\n共 %d 个元素\\n", len);

    // 求数组最大值及索引
    int maxVal = nums[0], maxIdx = 0;
    for (int i = 1; i < 6; i++) {
        if (nums[i] > maxVal) {
            maxVal = nums[i];
            maxIdx = i;
        }
    }
    printf("\\nnums数组最大值: %d (索引: %d)\\n", maxVal, maxIdx);

    // 数组求和与平均值
    int total = 0;
    for (int i = 0; i < len; i++) {
        total += scores[i];
    }
    printf("平均分: %.1f\\n", (double)total / len);

    return 0;
}`,
          explanation: '数组是一组相同类型数据的集合，在内存中连续存放。声明方式：类型名数组名[大小]。初始化可用{}列表，部分初始化时剩余元素自动补0。数组索引从0开始到长度-1，访问越界会导致未定义行为（可能崩溃或产生错误数据）。sizeof(数组)/sizeof(数组[0])是计算数组长度的常用方法。注意C语言数组没有内置length属性，需要手动管理长度信息。'
        },
        {
          title: '二维数组 — 矩阵初始化和遍历',
          code: `#include <stdio.h>

int main() {
    // 二维数组声明与初始化（3行4列的矩阵）
    int matrix[3][4] = {
        {1,  2,  3,  4},    // 第0行
        {5,  6,  7,  8},    // 第1行
        {9, 10, 11, 12}     // 第2行
    };

    // 按行列格式打印矩阵
    printf("3×4 矩阵:\\n");
    int rows = sizeof(matrix) / sizeof(matrix[0]);           // 行数 = 3
    int cols = sizeof(matrix[0]) / sizeof(matrix[0][0]);     // 列数 = 4

    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < cols; j++) {
            printf("%3d ", matrix[i][j]);   // %3d 占3位右对齐
        }
        printf("\\n");   // 每行结束后换行
    }

    // 计算每行的和
    printf("\\n每行之和:\\n");
    for (int i = 0; i < rows; i++) {
        int rowSum = 0;
        for (int j = 0; j < cols; j++) {
            rowSum += matrix[i][j];
        }
        printf("第%d行之和: %d\\n", i, rowSum);
    }

    // 求整个矩阵的最大值
    int maxVal = matrix[0][0];
    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < cols; j++) {
            if (matrix[i][j] > maxVal)
                maxVal = matrix[i][j];
        }
    }
    printf("矩阵最大值: %d\\n", maxVal);

    return 0;
}`,
          explanation: '二维数组可理解为"数组的数组"，即每个元素又是一个一维数组。声明形式：类型名数组名[行数][列数]，在内存中按行优先顺序连续存储（先存完第0行所有列，再存第1行...）。访问元素用matrix[i][j]表示第i行第j列。嵌套for循环是遍历二维数组的标准方法：外层遍历行，内层遍历列。sizeof(matrix)/sizeof(matrix[0])得行数，sizeof(matrix[0])/sizeof(matrix[0][0])得列数。'
        },
        {
          title: '字符串操作 — 常用字符串函数',
          code: `#include <stdio.h>
#include <string.h>   // 字符串函数头文件

int main() {
    // C语言字符串是以\'\\0\'（空字符）结尾的字符数组
    char str1[50] = "Hello";
    char str2[] = "World";

    // strlen: 获取字符串长度（不含\'\\0\'）
    printf("str1长度: %zu\\n", strlen(str1));     // 5

    // strcpy: 复制字符串
    char dest[50];
    strcpy(dest, str1);
    printf("strcpy复制结果: %s\\n", dest);       // Hello

    // strcat: 拼接字符串
    strcat(dest, " ");
    strcat(dest, str2);
    printf("strcat拼接结果: %s\\n", dest);       // Hello World

    // strcmp: 比较字符串（返回0表示相等）
    char s1[] = "apple", s2[] = "banana";
    int cmp = strcmp(s1, s2);
    if (cmp < 0)
        printf("\\"%s\\" < \\"%s\\"\\n", s1, s2);   // apple < banana
    else if (cmp > 0)
        printf("\\"%s\\" > \\"%s\\"\\n", s1, s2);
    else
        printf("\\"%s\\" == \\"%s\\"\\n", s1, s2);

    // 手动遍历字符串（利用\'\\0\'作为结束标志）
    printf("\\n逐字符输出 str1: ");
    for (int i = 0; str1[i] != \'\\0\'; i++) {
        printf("[%c]", str1[i]);
    }
    printf("\\n");

    return 0;
}`,
          explanation: 'C语言中没有专门的字符串类型，字符串实际是以空字符(\'\\0\',ASCII值为0)结尾的字符数组。<string.h>提供了常用字符串函数：strlen(str)返回长度（不含\\0）；strcpy(dest,src)将src复制到dest；strcat(dest,src)将src追加到dest末尾；strcmp(s1,s2)比较两字符串字典序，返回负数(s1<s2)、0(相等)或正数(s1>s2)。**安全提示：** strcpy/strcat可能导致缓冲区溢出，建议使用strncpy/strncat等限制长度的版本替代。'
        }
      ]
    },
    {
      id: 'c-struct',
      title: '结构体与内存管理',
      icon: '🏗️',
      description: '学习struct定义和动态内存分配',
      difficulty: 'intermediate',
      examples: [
        {
          title: '结构体基础',
          code: `#include <stdio.h>
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
    struct Student stu1 = {"张三", 20, 92.5f, \'A\'};

    // 方式2: 先声明再逐字段赋值
    struct Student stu2;
    strcpy(stu2.name, "李四");   // 字符数组要用strcpy赋值
    stu2.age = 21;
    stu2.score = 85.0f;
    stu2.grade = \'B\';

    // 方式3: C99指定成员初始化
    struct Student stu3 = {.name = "王五", .score = 78.5f, .age = 19};

    // 访问结构体成员: 使用点号 . 运算符
    printf("学生信息:\\n");
    printf("姓名: %s, 年龄: %d, 成绩: %.1f, 等级: %c\\n",
           stu1.name, stu1.age, stu1.score, stu1.grade);
    printf("姓名: %s, 年龄: %d, 成绩: %.1f, 等级: %c\\n",
           stu2.name, stu2.age, stu2.score, stu2.grade);

    // 结构体可以整体赋值
    struct Student stu4 = stu1;   // stu4是stu1的完整拷贝
    printf("\\nstu4 = stu1 拷贝结果: %s\\n", stu4.name);

    // 结构体大小（包含内存对齐填充）
    printf("\\nstruct Student 大小: %zu 字节\\n", sizeof(struct Student));

    // 用typedef简化类型名
    typedef struct Student Stu;
    Stu stu5 = {"赵六", 22, 95.0f, \'A\'};
    printf("typedef简化: %s 成绩 %.1f\\n", stu5.name, stu5.score);

    return 0;
}`,
          explanation: '结构体(struct)是将不同类型的数据组合成一个自定义类型的机制。定义方式：structTagName{成员声明;}。成员访问用点运算符(.)，如stu.name。可以用{}进行聚合初始化，支持顺序初始化和C99的指定成员初始化(.member=value)。结构体之间可以直接整体赋值（浅拷贝）。由于内存对齐原因，sizeof(结构体)通常大于各成员大小之和。typedef可以为结构体创建别名，省去每次写struct关键字的麻烦。字符数组成员需要用strcpy赋值，不能直接用=。'
        },
        {
          title: 'malloc 与 free — 动态内存分配',
          code: `#include <stdio.h>
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
        printf("内存分配失败!\\n");
        return 1;
    }

    printf("请输入 %d 个整数:\\n", n);
    for (int i = 0; i < n; i++) {
        scanf("%d", &arr[i]);
    }

    // 输出数组内容
    printf("\\n你输入的数组: ");
    for (int i = 0; i < n; i++) {
        printf("%d ", arr[i]);
    }
    printf("\\n");

    // 计算平均值
    double sum = 0;
    for (int i = 0; i < n; i++) {
        sum += arr[i];
    }
    printf("平均值: %.2f\\n", sum / n);

    // free: 释放动态分配的内存（防止内存泄漏）
    free(arr);
    arr = NULL;   // 释放后将指针置空，避免野指针

    printf("内存已释放\\n");
    return 0;
}`,
          explanation: '动态内存分配允许程序在运行时决定所需内存大小。malloc(size)在堆(heap)区分配指定字节的连续内存，返回void*指针（通用指针），需要强制转型为目标类型。分配可能失败（如内存不足），此时返回NULL，**务必检查返回值**。malloc分配的内存不会被自动释放，必须手动调用free(ptr)释放，否则会造成**内存泄漏**。free后建议将指针置为NULL以避免**野指针**(dangling pointer)问题。calloc(n,size)类似malloc但会将内存清零，realloc(ptr,new_size)可调整已分配内存块的大小。'
        },
        {
          title: '结构体数组 — 存储多名学生信息',
          code: `#include <stdio.h>
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
        printf("内存分配失败!\\n");
        return 1;
    }

    // 录入每个学生的信息
    for (int i = 0; i < count; i++) {
        printf("\\n=== 第%d个学生 ===\\n", i + 1);
        printf("姓名: ");
        scanf("%s", students[i].name);   // name是数组，不需要&
        printf("年龄: ");
        scanf("%d", &students[i].age);
        printf("成绩: ");
        scanf("%f", &students[i].score);
    }

    // 显示所有学生信息
    printf("\\n========== 学生列表 ==========\\n");
    printf("%-10s %-6s %-8s\\n", "姓名", "年龄", "成绩");
    printf("--------------------------------\\n");
    for (int i = 0; i < count; i++) {
        printf("%-10s %-6d %-8.1f\\n",
               students[i].name,
               students[i].age,
               students[i].score);
    }

    // 计算平均成绩
    float total = 0;
    for (int i = 0; i < count; i++) {
        total += students[i].score;
    }
    printf("\\n班级平均成绩: %.2f\\n", total / count);

    // 释放动态分配的结构体数组
    free(students);
    students = NULL;

    return 0;
}`,
          explanation: '结构体数组结合了结构和数组的优势，适合管理一组相关记录。动态分配结构体数组时，malloc的大小=count*sizeof(structStudent)，返回的是指向结构体的指针，可通过students[i]像普通数组一样索引访问，再用.运算符访问成员如students[i].name。注意students[i].name已经是数组地址，scanf不需要再加&；而students[i].age和score是基本类型变量，仍需要&取地址。最后一定要free()释放整个数组，避免内存泄漏。'
        }
      ]
    },
    {
      id: 'c-file',
      title: '文件操作',
      icon: '📁',
      description: '学习文件的读写操作',
      difficulty: 'intermediate',
      examples: [
        {
          title: '写入文件 — fopen/fprintf/fclose',
          code: `#include <stdio.h>

int main() {
    // fopen打开文件: "w"模式表示写入（会覆盖已有内容）
    FILE *fp = fopen("data.txt", "w");

    // 检查文件是否打开成功
    if (fp == NULL) {
        printf("无法打开文件!\\n");
        return 1;
    }

    // fprintf: 格式化写入文件（用法同printf，多了文件指针参数）
    fprintf(fp, "学生成绩表\\n");
    fprintf(fp, "--------------------------------\\n");
    fprintf(fp, "%-10s %-6s %-8s\\n", "姓名", "年龄", "成绩");

    // 写入多条记录
    fprintf(fp, "%-10s %-6d %-8.1f\\n", "张三", 20, 92.5);
    fprintf(fp, "%-10s %-6d %-8.1f\\n", "李四", 21, 85.0);
    fprintf(fp, "%-10s %-6d %-8.1f\\n", "王五", 19, 78.5);

    // fclose: 关闭文件（保存缓冲区数据并释放资源）
    fclose(fp);
    printf("数据已写入 data.txt\\n");

    // "a"模式: 追加写入（不覆盖原有内容）
    fp = fopen("data.txt", "a");
    if (fp != NULL) {
        fprintf(fp, "%-10s %-6d %-8.1f\\n", "赵六", 22, 95.0);
        fclose(fp);
        printf("追加一条记录成功\\n");
    }

    return 0;
}`,
          explanation: 'C语言通过FILE*指针和<stdio.h>库函数操作文件。核心流程：(1)fopen(filename,mode)打开文件并返回文件指针，mode包括："r"只读、"w"写入（覆盖）、"a"追加；(2)fprintf(fp,format,...)格式化写入文件，比printf多一个文件指针参数；(3)fclose(fp)关闭文件，确保数据从缓冲区写入磁盘并释放资源。**务必检查fopen返回值是否为NULL**（文件可能因权限、路径等问题打开失败）。"w"模式会清空已有文件内容，"a"模式则在文件末尾追加。'
        },
        {
          title: '读取文件 — fopen/fgets/fscanf',
          code: `#include <stdio.h>

int main() {
    FILE *fp = fopen("data.txt", "r");   // "r"模式: 只读打开

    if (fp == NULL) {
        printf("无法打开文件! 请先运行写入示例。\\n");
        return 1;
    }

    printf("===== 方式1: fgets逐行读取 =====\\n");
    char line[256];

    // fgets读取一行（包含换行符），遇到EOF或读满返回NULL
    while (fgets(line, sizeof(line), fp) != NULL) {
        printf("%s", line);   // fgets保留换行符，无需额外加\\n
    }

    // 文件指针已到达末尾，需要rewind回到开头才能重新读取
    rewind(fp);

    printf("\\n===== 方式2: fscanf格式化读取 =====\\n");
    char name[20];
    int age;
    float score;

    // fscanf按格式读取，返回成功读取的字段数量
    printf("%-10s %-6s %-8s\\n", "姓名", "年龄", "成绩");
    while (fscanf(fp, "%s %d %f", name, &age, &score) == 3) {
        printf("%-10s %-6d %-8.1f\\n", name, age, score);
    }

    fclose(fp);
    return 0;
}`,
          explanation: '读取文件的两种常用方式：(1)**fgets(line,size,fp)**：每次读取一行（含\\n）到line缓冲区，最多读size-1个字符，读到文件末尾(EOF)返回NULL，适合读取文本行。(2)**fscanf(fp,format,&args...)**：按格式说明符解析数据，返回成功读取的字段数，可用于读取结构化数据。当fgets/fscanf返回NULL时表示读取完毕。**rewind(fp)**可将文件指针重置到文件开头以便重新读取。fscanf配合==N（期望的字段数）可精确判断是否成功读取了一条完整记录。'
        },
        {
          title: '二进制读写 — fwrite/fread',
          code: `#include <stdio.h>
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
        printf("无法创建文件!\\n");
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
    printf("成功写入 %zu 条记录\\n", written);

    fclose(fp);

    // --- 读取二进制文件 ---
    fp = fopen("people.dat", "rb");   // "rb": 二进制读取

    if (fp == NULL) {
        printf("无法打开文件!\\n");
        return 1;
    }

    // 先获取文件总大小，计算有多少条记录
    fseek(fp, 0, SEEK_END);           // 移动到文件末尾
    long fileSize = ftell(fp);        // 获取当前位置（即文件大小）
    rewind(fp);                        // 回到文件开头
    size_t recordCount = fileSize / sizeof(struct Person);

    printf("文件大小: %ld 字节, 共 %zu 条记录\\n\\n",
           fileSize, recordCount);

    // fread: 以二进制形式读取数据块
    struct Person *buffer = (struct Person*)malloc(fileSize);
    size_t readCount = fread(buffer, sizeof(struct Person), recordCount, fp);

    printf("%-10s %-6s %-8s\\n", "姓名", "年龄", "身高");
    for (size_t i = 0; i < readCount; i++) {
        printf("%-10s %-6ld %-8.2fm\\n",
               buffer[i].name,
               buffer[i].age,
               buffer[i].height);
    }

    free(buffer);
    fclose(fp);
    return 0;
}`,
          explanation: '二进制读写直接操作内存数据的原始字节，效率更高且适合非文本数据。fwrite(ptr,size,count,fp)将count个size字节的数据块写入文件；fread(ptr,size,count,fp)从文件读取。文件模式加"b"后缀："wb"二进制写入、"rb"二进制读取。**ftell(fp)**返回当前文件指针位置的字节偏移量；**fseek(fp,offset,origin)**移动文件指针，origin可选SEEK_SET(文件头)、SEEK_CUR(当前位置)、SEEK_END(文件尾)。通过fseek到末尾+ftell可获取文件大小，进而计算出二进制文件中的记录数量。'
        }
      ]
    },
    {
      id: 'c-project',
      title: '综合实战：学生成绩管理系统',
      icon: '🎯',
      description: '综合运用所学知识，实现一个简易的学生成绩管理系统',
      difficulty: 'advanced',
      examples: [
        {
          title: '系统框架 — 主菜单与功能选择',
          code: `#include <stdio.h>
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
                printf("感谢使用，再见！\\n");
                return 0;
            default:
                printf("无效选项，请重新选择!\\n");
        }
        printf("\\n按回车继续...");
        getchar(); getchar();   // 清除缓冲区并等待用户按键
    }
}

// 显示主菜单
void showMenu() {
    system("cls || clear");   // 清屏（兼容Windows/Linux）
    printf("==============================\\n");
    printf("    学生成绩管理系统\\n");
    printf("==============================\\n");
    printf("  1. 添加学生\\n");
    printf("  2. 显示所有学生\\n");
    printf("  3. 查找学生\\n");
    printf("  4. 按成绩排序\\n");
    printf("  5. 删除学生\\n");
    printf("  0. 退出系统\\n");
    printf("==============================\\n");
}`,
          explanation: '这是一个完整的C语言综合项目框架。核心设计要点：(1) **结构体设计**：Student结构体封装学号、姓名、成绩三个字段，代表一条学生记录。(2) **全局数据**：使用固定大小的结构体数组students[MAX_STUDENTS]存储数据，studentCount跟踪当前学生数量。(3) **主菜单循环**：while(1)+switch实现持续运行的功能选择界面，用户输入数字选择操作，0退出。(4) **模块化设计**：每个功能封装为独立函数(addStudent/showAllStudents/searchStudent/sortByScore/deleteStudent)，通过函数声明实现前后引用。system("cls||clear")实现跨平台清屏。getchar()两次用于清除输入缓冲区的残留换行符。'
        },
        {
          title: '核心功能实现 — 增删改查与排序',
          code: `// ---- 接续上面的框架代码 ----

// 添加学生
void addStudent() {
    if (studentCount >= MAX_STUDENTS) {
        printf("学生列表已满，无法添加!\\n");
        return;
    }

    printf("\\n--- 添加学生 ---\\n");
    printf("学号: ");
    scanf("%d", &students[studentCount].id);
    printf("姓名: ");
    scanf("%s", students[studentCount].name);
    printf("成绩: ");
    scanf("%f", &students[studentCount].score);

    studentCount++;
    printf("✓ 添加成功! 当前共 %d 名学生\\n", studentCount);
}

// 显示所有学生
void showAllStudents() {
    if (studentCount == 0) {
        printf("暂无学生记录!\\n");
        return;
    }

    printf("\\n%-8s %-12s %-8s\\n", "学号", "姓名", "成绩");
    printf("--------------------------------\\n");
    for (int i = 0; i < studentCount; i++) {
        printf("%-8d %-12s %-8.1f\\n",
               students[i].id,
               students[i].name,
               students[i].score);
    }
}

// 按学号查找学生
void searchStudent() {
    int targetId;
    printf("\\n请输入要查找的学号: ");
    scanf("%d", &targetId);

    for (int i = 0; i < studentCount; i++) {
        if (students[i].id == targetId) {
            printf("找到学生: 学号=%d, 姓名=%s, 成绩=%.1f\\n",
                   students[i].id, students[i].name, students[i].score);
            return;
        }
    }
    printf("未找到学号为 %d 的学生\\n", targetId);
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
    printf("✓ 已按成绩降序排序!\\n");
    showAllStudents();
}

// 删除学生（通过学号）
void deleteStudent() {
    int targetId;
    printf("\\n请输入要删除的学号: ");
    scanf("%d", &targetId);

    int found = -1;
    for (int i = 0; i < studentCount; i++) {
        if (students[i].id == targetId) {
            found = i;
            break;
        }
    }

    if (found == -1) {
        printf("未找到学号为 %d 的学生\\n", targetId);
        return;
    }

    // 将后面的元素前移一位覆盖目标
    for (int i = found; i < studentCount - 1; i++) {
        students[i] = students[i + 1];
    }
    studentCount--;

    printf("✓ 已删除学号为 %d 的学生\\n", targetId);
}`,
          explanation: '本示例实现了学生成绩管理系统的全部CRUD功能：(1)**添加(Create)**：addStudent()在数组末尾追加新记录，先检查数组是否已满。(2)**读取(Retrieve)**：showAllStudents()遍历数组格式化输出所有记录；searchStudent()线性搜索匹配学号。(3)**更新/排序**：sortByScore()使用冒泡排序算法按成绩降序排列，通过结构体整体赋值实现交换。(4)**删除(Delete)**：deleteStudent()找到目标后，将其后的所有元素前移一位覆盖目标位置，然后计数减1（这是数组删除元素的标准做法）。这些功能综合运用了结构体、数组、循环、条件判断、函数等C语言核心知识点。'
        }
      ]
    }
  ]
}
