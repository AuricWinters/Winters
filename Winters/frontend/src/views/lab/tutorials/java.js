export default {
  id: 'java',
  name: 'Java',
  icon: 'J',
  version: '17+',
  description: '企业级开发主流语言，跨平台',
  tutorials: [
    {
      id: 'java-hello',
      title: 'Hello World',
      icon: '👋',
      description: '编写第一个Java程序，学习基本结构',
      difficulty: 'beginner',
      examples: [
        {
          title: '基本结构',
          code: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        
        // 变量
        String name = "小明";
        int age = 25;
        
        System.out.println("姓名: " + name);
        System.out.println("年龄: " + age);
    }
}`,
          explanation: 'Java是纯面向对象语言，所有代码必须放在类(class)中。public class Main定义了一个公开类，类名必须与文件名一致。public static void main(String[] args)是程序入口方法——JVM从这里开始执行代码。public表示可从任何地方访问，static表示属于类而非实例（无需创建对象就能调用），void表示无返回值。String[] args是命令行参数数组。System.out.println()用于向控制台输出文本并换行。'
        },
        {
          title: '变量与输出',
          code: `public class Main {
    public static void main(String[] args) {
        // 字符串类型
        String name = "张三";
        String school = "清华大学";
        
        // 整数类型
        int age = 20;
        long studentId = 202401001L;   // long字面量加L后缀
        
        // 浮点类型
        double score = 95.5;
        float gpa = 3.85f;              // float字面量加f后缀
        
        // 布尔类型
        boolean isExcellent = true;
        
        // 字符类型
        char grade = \'A\';
        
        // 输出：使用 + 拼接字符串和变量
        System.out.println("姓名: " + name + ", 年龄: " + age);
        System.out.println("学校: " + school);
        System.out.println("成绩: " + score + ", GPA: " + gpa);
        System.out.println("优秀生? " + isExcellent);
        System.out.println("等级: " + grade);
        
        // print 不换行, println 换行
        System.out.print("学号: ");
        System.out.println(studentId);
    }
}`,
          explanation: 'Java有8种基本数据类型(PrimitiveTypes)：byte/short/int/long(整数)、float/double(浮点)、char(字符)、boolean(布尔)，以及引用类型String(字符串)。变量声明格式：类型名变量名=初始值;。注意long字面量需要加L/f后缀，float加f/F后缀。System.out.print()输出不换行，println()输出后换行。+运算符可用于字符串拼接，Java会自动将非字符串类型转换为字符串再拼接。'
        }
      ]
    },
    {
      id: 'java-types',
      title: '变量与数据类型',
      icon: '📦',
      description: '学习Java的8种基本数据类型和String',
      difficulty: 'beginner',
      examples: [
        {
          title: '8种基本数据类型详解',
          code: `public class Main {
    public static void main(String[] args) {
        // ===== 整型 (4种) =====
        byte   b = 127;         // 1字节, 范围: -128 ~ 127
        short  s = 32767;       // 2字节, 范围: -32768 ~ 32767
        int    i = 2100000000;  // 4字节, 范围: 约±21亿
        long   l = 9000000000L; // 8字节, 范围: 极大 (字面量加L)
        
        System.out.println("byte: " + b + " (" + Byte.SIZE + "位)");
        System.out.println("short: " + s + " (" + Short.SIZE + "位)");
        System.out.println("int: " + i + " (" + Integer.SIZE + "位)");
        System.out.println("long: " + l + " (" + Long.SIZE + "位)");
        
        // ===== 浮点型 (2种) =====
        float  f = 3.14f;       // 4字节, 单精度, 约6-7位有效数字
        double d = 3.14159265358979;  // 8字节, 双精度, 约15位有效数字
        
        System.out.println("\\nfloat: " + f + " (" + Float.SIZE + "位)");
        System.out.println("double: " + d + " (" + Double.SIZE + "位)");
        
        // ===== 字符型 (1种) =====
        char c1 = \'A\';           // 单个字符, 用单引号
        char c2 = \'中\';          // Java支持Unicode, 可存中文!
        char c3 = 65;             // 可用ASCII码值赋值 -> \'A\'
        
        System.out.println("\\nchar: \'" + c1 + "\' \'" + c2 + "\' \'" + c3 + "\'");
        
        // ===== 布尔型 (1种) =====
        boolean flag1 = true;     // 只有两个值: true / false
        boolean flag2 = false;
        
        System.out.println("boolean: " + flag1 + ", " + flag2);
        
        // ===== 类型默认值 =====
        System.out.println("\\n--- 默认值 ---");
        System.out.println("int默认: " + new int[1][0]);  // 0
        System.out.println("double默认: " + new double[1][0]);  // 0.0
        System.out.println("boolean默认: " + new boolean[1][0]);  // false
        System.out.println("char默认: \'" + (char)0 + "\' (空字符)");
    }
}`,
          explanation: 'Java的8种基本数据类型(primitivetypes)分为四组：(1)**整型**：byte(1B,-128~127)、short(2B)、int(4B,最常用)、long(8B,超大数用)；(2)**浮点型**：float(4B,精度较低)、double(8B,默认浮点类型,精度高)；(3)**字符型**：char(2B,Unicode编码,支持中文)；(4)**布尔型**：boolean(true/false)。包装类的SIZE字段可以查看位数。基本类型的局部变量不会自动初始化(必须手动赋值),但数组元素/字段会有默认值(int→0,double→0.0,boolean→false,char→\'\\u0000\')。'
        },
        {
          title: 'String 常用操作',
          code: `public class Main {
    public static void main(String[] args) {
        // 创建字符串
        String s1 = "Hello";
        String s2 = "World";
        
        // 拼接: 使用 + 运算符
        String s3 = s1 + " " + s2;       // "Hello World"
        System.out.println("拼接: " + s3);
        
        // length(): 获取字符串长度
        System.out.println("长度: " + s3.length());  // 11
        
        // charAt(index): 获取指定位置的字符(索引从0开始)
        System.out.println("第0个字符: " + s3.charAt(0));  // H
        System.out.println("第6个字符: " + s3.charAt(6));  // W
        
        // substring(begin): 从begin位置截取到末尾
        // substring(begin, end): 截取 [begin, end) 区间
        System.out.println("截取(0~5): " + s3.substring(0, 5));  // Hello
        System.out.println("截取(6起): " + s3.substring(6));      // World
        
        // indexOf(): 查找子串位置, 找不到返回-1
        System.out.println("\\"o\\"首次出现位置: " + s3.indexOf(\'o\'));  // 4
        
        // toUpperCase() / toLowerCase(): 大小写转换
        System.out.println("大写: " + s3.toUpperCase());
        System.out.println("小写: " + s3.toLowerCase());
        
        // trim(): 去除首尾空白
        String spaced = "  你好世界  ";
        System.out.println("trim前[\\"" + spaced + "\\"]");
        System.out.println("trim后[\\"" + spaced.trim() + "\\"]");
        
        // equals(): 比较内容是否相等(==比较的是地址!)
        String a = new String("hello");
        String b = new String("hello");
        System.out.println("\\n== 比较: " + (a == b));        // false(不同对象)
        System.out.println("equals: " + a.equals(b));        // true(内容相同)
        
        // contains(): 是否包含子串
        System.out.println("包含World? " + s3.contains("World"));  // true
    }
}`,
          explanation: 'String是Java中最常用的引用类型(不可变对象)。常用方法：(1)**拼接**：+运算符或concat()方法；(2)**长度**：length()返回字符个数；(3)**访问字符**：charAt(index)，索引从0开始；(4)**截取**：substring(start,end)左闭右开区间[start,end)；(5)**查找**：indexOf()返回位置，找不到返回-1；(6)**大小写**：toUpperCase()/toLowerCase()；(7)**去空白**：trim()只去首尾空格；(8)**比较**：**务必用equals()比较内容**，==比较的是内存地址！(9)**contains()**判断是否包含子串。String是不可变的，每次"修改"实际都创建了新对象。'
        },
        {
          title: '类型转换 — 自动提升、强制转换与包装类',
          code: `public class Main {
    public static void main(String[] args) {
        // ===== 自动类型提升 (隐式转换) =====
        // 小范围 → 大范围自动安全转换
        int i = 100;
        long l = i;          // int → long 自动提升
        double d = i;        // int → double 自动提升
        System.out.println("int→long: " + l);
        System.out.println("int→double: " + d);
        
        // 表达式中自动提升: int运算结果为int, 有double则整体变double
        int a = 10, b = 3;
        System.out.println("10/3=" + (a/b));        // 3 (整数除法!)
        System.out.println("10.0/3=" + (a*1.0/b));  // 3.333... (浮点除法)
        
        // ===== 强制类型转换 (显式转换) =====
        // 大范围 → 小范围可能丢失数据, 需要显式声明
        double pi = 3.14159;
        int intPi = (int)pi;   // 强制转换, 截断小数部分
        System.out.println("(int)3.14159 = " + intPi);  // 3
        
        long bigNum = 9999999999L;
        int truncated = (int)bigNum;  // 溢出! 数据丢失
        System.out.println("(int)大long溢出: " + truncated);
        
        // ===== 包装类 (Wrapper Classes) =====
        // 每个基本类型都有对应的包装类, 提供实用方法
        
        // String ↔ 基本类型 转换
        String numStr = "42";
        int parsedInt = Integer.parseInt(numStr);     // String → int
        double parsedDouble = Double.parseDouble("3.14");  // String → double
        
        System.out.println("\\nparseInt(\\"42\\"): " + parsedInt);
        System.out.println("parseDouble(\\"3.14\\"): " + parsedDouble);
        
        // 基本类型 → String
        String fromInt = Integer.toString(123);       // int → String
        String fromDouble = String.valueOf(3.14);     // double → String
        String fromBool = Boolean.toString(true);     // boolean → String
        
        System.out.println("toString(123): " + fromInt);
        System.out.println("valueOf(3.14): " + fromDouble);
        
        // 自动装箱(Autoboxing) & 拆箱(Unboxing)
        Integer boxedInt = 100;        // int → Integer (自动装箱)
        int unboxed = boxedInt;        // Integer → int (自动拆箱)
        System.out.println("\\n自动装箱: " + boxedInt + ", 拆箱: " + unboxed);
    }
}`,
          explanation: 'Java类型转换分三种场景：(1)**自动类型提升**：小类型→大类型自动进行(byte→short→int→long→float→double)，如int赋给long或double无需额外操作。但**整数除法两个操作数都是int时结果仍是int**(10/3=3不是3.33)，需将其中一个转为double。(2)**强制类型转换**：大类型→小类型需用(目标类型)语法显式转换，可能丢失精度或溢出。(3)**包装类转换**：每个基本类型有对应包装类(Byte/Short/Integer/Long/Float/Double/Character/Boolean)。Integer.parseInt(str)将字符串转int；Integer.toString(n)将int转字符串。Java5+支持自动装箱(基本→包装)和拆箱(包装→基本)。'
        }
      ]
    },
    {
      id: 'java-control',
      title: '控制语句与循环',
      icon: '🔀',
      description: '学习if/for/while/switch等流程控制',
      difficulty: 'beginner',
      examples: [
        {
          title: 'if-else 与三元运算符',
          code: `public class Main {
    public static void main(String[] args) {
        int score = 85;

        // if-else if-else 多分支条件判断
        if (score >= 90) {
            System.out.println("等级: A (优秀)");
        } else if (score >= 80) {
            System.out.println("等级: B (良好)");   // ← 执行这个
        } else if (score >= 70) {
            System.out.println("等级: C (中等)");
        } else if (score >= 60) {
            System.out.println("等级: D (及格)");
        } else {
            System.out.println("等级: F (不及格)");
        }

        // 三元运算符: condition ? value_if_true : value_if_false
        String result = (score >= 60) ? "通过" : "未通过";
        System.out.println("判定: " + result);

        // 嵌套三元（不推荐太复杂）
        String grade = (score >= 90) ? "A" :
                       (score >= 80) ? "B" :
                       (score >= 70) ? "C" :
                       (score >= 60) ? "D" : "F";
        System.out.println("三元嵌套等级: " + grade);

        // 逻辑运算符组合条件
        int age = 22;
        boolean hasID = true;
        if (age >= 18 && hasID) {       // && 与（两边都为真才真）
            System.out.println("可以进入网吧");
        }
        if (age < 12 || age > 65) {     // 或（一边为真就真）
            System.out.println("优惠票价");
        }
        if (!hasID) {                   // ! 非（取反）
            System.out.println("请携带身份证");
        }
    }
}`,
          explanation: 'if-else语句根据布尔表达式的真假执行不同分支。if-else-if链从上到下判断，只执行第一个匹配的分支。**三元运算符**condition?val1:val2是if-else的简洁替代，适合简单二选一场景，结果可直接赋值给变量。逻辑运算符：&&短路与(左边为假则右边不执行)、||短路或(左边为真则右边不执行)、!逻辑非。Java中没有C风格的数字即布尔(不能用if(score))，条件必须是boolean类型。'
        },
        {
          title: 'for / while / do-while 循环',
          code: `public class Main {
    public static void main(String[] args) {
        // ===== for循环: 最常用的计数循环 =====
        System.out.println("=== for循环打印1~10 ===");
        for (int i = 1; i <= 10; i++) {    // 初始化; 条件; 更新
            System.out.print(i + " ");
        }
        System.out.println();

        // for循环求 1~100 的和
        int sum = 0;
        for (int i = 1; i <= 100; i++) {
            sum += i;   // 等价于 sum = sum + i
        }
        System.out.println("1~100的和: " + sum);   // 5050

        // 嵌套for循环: 九九乘法表
        System.out.println("\\n=== 九九乘法表 ===");
        for (int i = 1; i <= 9; i++) {
            for (int j = 1; j <= i; j++) {
                System.out.printf("%dx%d=%-4d", i, j, i * j);
            }
            System.out.println();
        }

        // ===== while循环: 先判断后执行 =====
        System.out.println("\\n=== while倒计时 ===");
        int count = 5;
        while (count > 0) {
            System.out.println(count + "...");
            count--;
        }
        System.out.println("发射!");

        // ===== do-while循环: 先执行后判断(至少执行一次) =====
        System.out.println("\\n=== do-while输入验证 ===");
        java.util.Scanner scanner = new java.util.Scanner(System.in);
        int input;
        do {
            System.out.print("请输入一个正整数: ");
            input = scanner.nextInt();
        } while (input <= 0);   // 条件为真时继续循环
        System.out.println("你输入了: " + input);

        // ===== break 和 continue =====
        System.out.println("\\n=== break(跳出循环) ===");
        for (int i = 1; i <= 10; i++) {
            if (i == 5) break;    // 当i=5时立即退出整个循环
            System.out.print(i + " ");
        }                          // 输出: 1 2 3 4

        System.out.println("\\n=== continue(跳过本次) ===");
        for (int i = 1; i <= 5; i++) {
            if (i == 3) continue; // 当i=3时跳过本轮剩余代码
            System.out.print(i + " ");
        }                          // 输出: 1 2 4 5

        scanner.close();
    }
}`,
          explanation: 'Java三种循环结构：(1)**for循环**：适合已知次数的场景，语法for(init;condition;update){body}。增强版for-each循环for(Typeitem:collection)遍历集合更方便。(2)**while循环**：先判断条件再执行，可能一次都不执行。(3)**do-while循环**：先执行一次再判断条件，**至少执行一次**，适合输入验证等场景。**break**立即终止整个循环；**continue**跳过当前迭代剩余代码，直接进入下一轮。System.out.printf()支持格式化输出(%d整数,%f浮点,%s字符串,%-4d左对齐占4位)。Scanner(System.in)用于从控制台读取用户输入。'
        },
        {
          title: 'switch 表达式 — Java 14+ 新语法',
          code: `public class Main {
    public static void main(String[] args) {
        // ===== 传统 switch 语句 (带 break) =====
        int dayOfWeek = 3;
        String dayName;

        switch (dayOfWeek) {
            case 1:
                dayName = "星期一";
                break;
            case 2:
                dayName = "星期二";
                break;
            case 3:
                dayName = "星期三";    // 匹配此case
                break;
            case 4:
                dayName = "星期四";
                break;
            case 5:
                dayName = "星期五";
                break;
            case 6:
            case 7:
                dayName = "周末";     // case穿透: 6和7共用
                break;
            default:
                dayName = "无效";     // 兜底情况
        }
        System.out.println("传统switch: " + dayName);

        // ===== Java 14+ 新 switch 表达式 (箭头形式) =====
        // 使用 -> 箭头, 不需要 break, 可作为表达式返回值!
        String result = switch (dayOfWeek) {
            case 1, 2, 3, 4, 5 -> "工作日";   // 多值合并
            case 6, 7 -> "周末";
            default -> "未知";
        };
        System.out.println("新switch: " + result);

        // ===== switch 支持 String (Java 7+) =====
        String season = "夏季";
        String activity = switch (season) {
            case "春季" -> "踏青赏花 🌸";
            case "夏季" -> "游泳避暑 🏊";    // 匹配
            case "秋季" -> "登高赏叶 🍁";
            case "冬季" -> "滑雪堆雪人 ⛄";
            default -> "在家休息 😴";
        };
        System.out.println(season + "活动: " + activity);

        // ===== switch 支持 yield 返回复杂值 =====
        String message = switch (dayOfWeek) {
            case 1 -> "周一综合征...";
            case 5 -> {
                System.out.println("终于周五了!");
                yield "TGIF! 感谢上帝今天是周五!";
            }   // yield 用于多行代码块中返回值
            default -> "普通的一天";
        };
        System.out.println(message);
    }
}`,
          explanation: 'switch在Java经历了重大进化：(1)**传统switch(Java7之前)**：使用case标签+break，忘记break会导致"穿透"(fall-through)执行后续case代码。(2)**Java7+新增String支持**：可以直接匹配字符串字面量。(3)**Java12预览/Java14正式**：引入**switch表达式**，使用->箭头语法，不需要break，多个case可用逗号合并，支持yield关键字在多行代码块中返回值。switch表达式本身有返回值，可直接赋给变量。新语法更简洁安全，推荐在新项目中使用。yield只能在switch表达式的代码块中使用，类似return但仅针对switch分支。'
        }
      ]
    },
    {
      id: 'java-oop',
      title: '面向对象基础',
      icon: '⚡',
      description: '学习类、对象、构造器和this关键字',
      difficulty: 'beginner',
      examples: [
        {
          title: '类的定义与对象创建',
          code: `// 定义一个 Person 类
class Person {
    // 属性(字段/成员变量)
    String name;
    int age;

    // 构造器: 创建对象时初始化属性
    Person(String name, int age) {
        this.name = name;   // this.name指对象的name, =右边的name是参数
        this.age = age;
    }

    // 方法: 定义对象的行为
    void greet() {
        System.out.println("你好! 我是 " + name + ", 今年 " + age + " 岁");
    }

    // 有参数有返回值的方法
    String getInfo() {
        return "Person[name=" + name + ", age=" + age + "]";
    }

    // 带参数的方法
    void birthday() {
        age++;               // 过生日年龄+1
        System.out.println(name + " 过生日啦! 现在 " + age + " 岁");
    }
}

// 主类(包含main方法)
public class Main {
    public static void main(String[] args) {
        // 使用 new 关键字创建对象(实例化)
        Person p1 = new Person("张三", 25);
        Person p2 = new Person("李四", 30);

        // 访问对象的属性
        System.out.println(p1.name + " - " + p1.age);

        // 调用对象的方法
        p1.greet();           // 输出: 你好! 我是 张三, 今年 25 岁
        p2.greet();           // 输出: 你好! 我是 李四, 今年 30 岁

        // 调用有返回值的方法
        System.out.println(p1.getInfo());  // Person[name=张三, age=25]

        // 方法可以修改对象的状态
        p1.birthday();        // 张三过生日, 变成26岁
        System.out.println("现在年龄: " + p1.age);  // 26

        // 同一类的不同对象互相独立
        System.out.println(p2.age);  // 李四仍然是30岁, 不受影响
    }
}`,
          explanation: '**类(Class)**是对象的蓝图/模板，定义了属性(数据)和方法(行为)。**对象(Object)**是类的实例，通过new关键字创建。核心概念：(1)**字段(属性)**：类中的变量，存储对象状态。(2)**构造器(Constructor)**：与类同名、无返回值类型的方法，在new对象时自动调用，用于初始化字段。若未定义编译器会生成默认无参构造器。(3)**this关键字**：指向当前对象的引用，用于区分同名的字段和参数(this.name=name)。(4)**方法**：定义对象的行为，可通过对象名.方法名()调用。每个对象都有自己独立的字段副本，互不影响。'
        },
        {
          title: '封装与访问修饰符',
          code: `// 使用 private 封装字段, 通过 getter/setter 控制访问
class BankAccount {
    // private: 只能在本类内部访问 (封装的核心)
    private String owner;
    private double balance;

    // 公共构造器
    public BankAccount(String owner, double initialBalance) {
        this.owner = owner;
        // 通过setter来设置, 可以加入校验逻辑
        setBalance(initialBalance);
    }

    // getter: 获取私有字段的值 (只读访问)
    public String getOwner() {
        return owner;
    }

    public double getBalance() {
        return balance;
    }

    // setter: 设置私有字段的值 (可添加校验)
    public void setBalance(double amount) {
        if (amount < 0) {
            System.out.println("错误: 余额不能为负数!");
            return;   // 非法值拒绝设置
        }
        this.balance = amount;
    }

    // 业务方法: 存款 (封装内部实现细节)
    public void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
            System.out.println(owner + " 存款 ¥" + amount + ", 余额: ¥" + balance);
        } else {
            System.out.println("存款金额必须大于0");
        }
    }

    // 业务方法: 取款
    public boolean withdraw(double amount) {
        if (amount <= 0) {
            System.out.println("取款金额必须大于0");
            return false;
        }
        if (amount > balance) {
            System.out.println("余额不足! 当前余额: ¥" + balance);
            return false;
        }
        balance -= amount;
        System.out.println(owner + " 取款 ¥" + amount + ", 余额: ¥" + balance);
        return true;
    }
}

public class Main {
    public static void main(String[] args) {
        // 创建账户对象
        BankAccount account = new BankAccount("王五", 1000.0);

        // ✅ 正确: 通过公共方法访问
        System.out.println("户主: " + account.getOwner());
        System.out.println("余额: " + account.getBalance());

        account.deposit(500);      // 存款500
        account.withdraw(200);     // 取款200

        // ❌ 编译错误! private字段无法在外部直接访问
        // account.balance = -999;   // 错误!

        // ❌ setter会拦截非法值
        account.setBalance(-100);  // 输出错误提示, 余额不变

        System.out.println("最终余额: ¥" + account.getBalance());
    }
}`,
          explanation: '**封装(Encapsulation)**是OOP四大特性之一，核心思想是将数据(private字段)隐藏在对象内部，只通过公共方法(getter/setter/业务方法)提供受控的访问。好处：(1)**数据保护**：防止外部随意修改内部状态（如余额不能为负）；(2)**灵活性**：可以在getter/setter中加入校验逻辑、日志、计算等而不影响调用方；(3)**解耦**：内部实现改变时不影响外部代码。Java四种访问级别：private(同类)<默认(同包)<protected(子类/同包)<public(任何地方)。命名规范：getXxx/setXxx称为JavaBean规范。业务方法(deposit/withdraw)封装了复杂的操作细节，对外暴露简单接口。'
        },
        {
          title: '方法重载与构造器重载',
          code: `class Student {
    private String name;
    private int age;
    private String major;

    // 构造器重载: 多个同名构造器, 参数列表不同
    public Student(String name) {
        this(name, 18, "未定专业");  // 用 this() 调用其他构造器
    }

    public Student(String name, int age) {
        this(name, age, "未定专业");
    }

    public Student(String name, int age, String major) {
        this.name = name;
        this.age = age;
        this.major = major;
    }

    // getter/setter
    public String getName() { return name; }
    public int getAge() { return age; }
    public String getMajor() { return major; }

    // 方法重载: 同名方法, 参数列表(类型/数量/顺序)不同
    public void study() {
        System.out.println(name + " 正在学习...");
    }

    public void study(String subject) {
        System.out.println(name + " 正在学习 " + subject);
    }

    public void study(String subject, int hours) {
        System.out.println(name + " 学习 " + subject + " " + hours + " 小时");
    }

    // toString方法: 返回对象的字符串表示
    @Override
    public String toString() {
        return "Student{name=\'" + name + "\', age=" + age +
               ", major=\'" + major + "\'}";
    }
}

public class Main {
    public static void main(String[] args) {
        // 使用不同的构造器创建对象
        Student s1 = new Student("Alice");                  // 只传名字
        Student s2 = new Student("Bob", 20);                 // 名字+年龄
        Student s3 = new Student("Carol", 21, "计算机科学");  // 全部

        System.out.println(s1);   // 自动调用toString()
        System.out.println(s2);
        System.out.println(s3);

        // 方法重载: 根据参数自动选择匹配的方法
        s1.study();                    // 无参版本
        s2.study("数学");              // 一个参数版本
        s3.study("算法", 3);           // 两个参数版本

        // 重载规则: 仅返回值不同不算重载!
        // 编译器通过参数列表区分重载方法
    }
}`,
          explanation: '**重载(Overloading)**指同一个类中可以有多个同名方法/构造器，只要它们的**参数列表**(参数个数、类型、顺序)不同即可。编译器根据调用时传入的实参类型和数量自动选择匹配的版本。(1)**构造器重载**：提供多种创建对象的方式，简化对象创建。this()可在构造器中调用同类的其他构造器(必须是第一条语句)。(2)**方法重载**：同一行为的不同实现方式，如study()/study(String)/study(String,int)。(3)**@Override注解**：标注toString()方法重写了Object类的方法，IDE会检查是否正确覆盖。toString()在打印对象时自动调用。**注意**：仅返回值类型不同不能构成重载，编译器无法区分。重载是编译时多态(静态绑定)。'
        }
      ]
    },
    {
      id: 'java-collection',
      title: '集合框架',
      icon: '📚',
      description: '学习ArrayList、HashMap等常用集合',
      difficulty: 'intermediate',
      examples: [
        {
          title: 'ArrayList — 动态数组',
          code: `import java.util.ArrayList;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        // 创建ArrayList (需要指定泛型类型)
        ArrayList<String> fruits = new ArrayList<>();

        // add(): 添加元素到末尾
        fruits.add("苹果");
        fruits.add("香蕉");
        fruits.add("橙子");
        fruits.add("葡萄");
        System.out.println("添加后: " + fruits);

        // add(index, element): 在指定位置插入
        fruits.add(1, "西瓜");   // 在索引1处插入西瓜
        System.out.println("插入西瓜: " + fruits);

        // get(index): 获取指定位置的元素
        System.out.println("第0个: " + fruits.get(0));
        System.out.println("第2个: " + fruits.get(2));

        // set(index, element): 替换指定位置的元素
        fruits.set(0, "红富士苹果");
        System.out.println("替换第0个: " + fruits);

        // size(): 获取元素个数
        System.out.println("元素数量: " + fruits.size());  // 5

        // remove(index): 按索引删除
        fruits.remove(3);
        System.out.println("删除索引3后: " + fruits);

        // remove(Object): 按值删除
        fruits.remove("香蕉");
        System.out.println("删除香蕉后: " + fruits);

        // contains(): 判断是否包含某元素
        System.out.println("包含橙子? " + fruits.contains("橙子"));

        // indexOf(): 查找元素的索引位置
        System.out.println("橙子的位置: " + fruits.indexOf("橙子"));

        // isEmpty(): 判断是否为空
        System.out.println("为空? " + fruits.isEmpty());

        // ===== for-each 循环遍历 =====
        System.out.println("\\n=== 遍历所有水果 ===");
        for (String fruit : fruits) {
            System.out.println("- " + fruit);
        }

        // 清空集合
        fruits.clear();
        System.out.println("清空后数量: " + fruits.size());
    }
}`,
          explanation: 'ArrayList是Java最常用的动态数组集合，位于java.util包。相比普通数组：(1)**大小可变**：自动扩容，无需预先确定大小；(2)**丰富的API**：add/get/set/remove/contains/indexOf等操作方便。(3)**泛型**：ArrayList<E>指定元素类型，编译期类型检查，避免运行时ClassCastException。**常用操作**：add()添加(末尾/指定位置)、get()按索引获取、set()替换、remove()按索引或值删除、size()获取大小、contains()判断包含、isEmpty()判空、clear()清空。**遍历方式**：推荐for-each循环(for(Eitem:list))简洁安全。底层基于数组实现，随机访问快(O(1))，中间插入/删除慢(O(n))需移动元素。'
        },
        {
          title: 'HashMap — 键值对映射',
          code: `import java.util.HashMap;
import java.util.Map;

public class Main {
    public static void main(String[] args) {
        // 创建 HashMap: 键-值 对 (Key-Value Pair)
        HashMap<String, Integer> scores = new HashMap<>();

        // put(key, value): 添加键值对
        scores.put("张三", 95);
        scores.put("李四", 88);
        scores.put("王五", 76);
        scores.put("赵六", 92);
        System.out.println("HashMap: " + scores);

        // get(key): 根据键获取值 (不存在返回null)
        System.out.println("张三的成绩: " + scores.get("张三"));
        System.out.println("未知键: " + scores.get("未知"));

        // getOrDefault(key, default): 键不存在时返回默认值
        System.out.println("孙七的成绩: " + scores.getOrDefault("孙七", 0));

        // containsKey() / containsValue(): 判断是否存在
        System.out.println("包含李四? " + scores.containsKey("李四"));
        System.out.println("有92分? " + scores.containsValue(92));

        // size(): 键值对数量
        System.out.println("人数: " + scores.size());

        // replace(key, newValue): 替换已有键的值
        scores.replace("王五", 82);
        System.out.println("王五补考后: " + scores.get("王五"));

        // remove(key): 移除键值对
        scores.remove("赵六");
        System.out.println("移除赵六后: " + scores.size());

        // ===== 遍历方式1: keySet() 遍历所有键 =====
        System.out.println("\\n=== 遍历键 ===");
        for (String name : scores.keySet()) {
            System.out.println(name + ": " + scores.get(name));
        }

        // ===== 遍历方式2: values() 遍历所有值 =====
        System.out.println("\\n=== 所有成绩 ===");
        for (int score : scores.values()) {
            System.out.print(score + " ");
        }
        System.out.println();

        // ===== 遍历方式3: entrySet() 遍历键值对 (推荐!) =====
        System.out.println("\\n=== 遍历键值对 ===");
        for (Map.Entry<String, Integer> entry : scores.entrySet()) {
            System.out.println(entry.getKey() + " → " + entry.getValue());
        }

        // forEach + Lambda (Java 8+, 最简洁)
        System.out.println("\\n=== Lambda遍历 ===");
        scores.forEach((name, score) ->
            System.out.println(name + " 得分: " + score));
    }
}`,
          explanation: 'HashMap基于哈希表实现的键值对映射集合，存储Key-Value对。特点：(1)**键唯一**：每个键只能对应一个值，重复put会覆盖旧值；(2)**快速查找**：平均O(1)时间复杂度的get/put操作；(3)**无序**：不保证元素顺序。**核心API**：put(K,V)添加/更新、get(K)获取值、getOrDefault(K,default)安全获取、remove(K)删除、replace(K,newV)替换值、containsKey(K)/containsValue(V)判断存在、size()大小。**三种遍历方式**：keySet()+get()需二次查找(效率稍低)；values()只能拿到值；entrySet()同时获取键值对(效率最高,推荐)。Java8+的forEach配合Lambda表达式最简洁。键必须正确实现hashCode()和equals()方法。'
        },
        {
          title: 'HashSet 与 LinkedList 特性对比',
          code: `import java.util.*;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        // ===== HashSet: 去重集合 =====
        HashSet<String> uniqueNames = new HashSet<>();

        uniqueNames.add("张三");
        uniqueNames.add("李四");
        uniqueNames.add("张三");   // 重复! 不会被添加
        uniqueNames.add("王五");
        uniqueNames.add("李四");   // 又重复!

        System.out.println("HashSet: " + uniqueNames);
        System.out.println("大小(已去重): " + uniqueNames.size());  // 3
        System.out.println("包含张三? " + uniqueNames.contains("张三"));

        // HashSet 无序: 不保证插入顺序
        System.out.println("\\nHashSet遍历(无序):");
        for (String name : uniqueNames) {
            System.out.println("  " + name);
        }

        // ===== LinkedList: 双向链表 =====
        LinkedList<String> tasks = new LinkedList<>();

        // 两端操作都很高效
        tasks.addFirst("起床");     // 头部添加
        tasks.addLast("睡觉");      // 尾部添加
        tasks.add("吃饭");          // 默认尾部添加
        tasks.addFirst("刷牙");

        System.out.println("\\nLinkedList: " + tasks);

        // getFirst() / getLast()
        System.out.println("第一件事: " + tasks.getFirst());
        System.out.println("最后一件事: " + tasks.getLast());

        // removeFirst() / removeLast()
        System.out.println("完成: " + tasks.removeFirst());
        System.out.println("完成后: " + tasks);

        // ===== 性能对比: ArrayList vs LinkedList =====
        System.out.println("\\n===== 性能特点对比 =====");
        System.out.println("ArrayList(动态数组):");
        System.out.println("  - 随机访问get(i): O(1) 快 ✓");
        System.out.println("  - 尾部add: O(1) 均 ✓");
        System.out.println("  - 中间插入/删除: O(n) 慢 ✗ (需移位)");

        System.out.println("\\nLinkedList(双向链表):");
        System.out.println("  - 首尾操作: O(1) 快 ✓");
        System.out.println("  - 中间插入/删除: O(1) 找到后快 ✓");
        System.out.println("  - 随机访问get(i): O(n) 慢 ✗ (需遍历)");

        System.out.println("\\nHashSet:");
        System.out.println("  - 添加/查找/删除: O(1) 均 ✓");
        System.out.println("  - 自动去重 ✓");
        System.out.println("  - 无序, 无索引访问");
    }
}`,
          explanation: '**HashSet**：基于哈希表的Set接口实现，核心特点是**自动去重**——重复元素不会被添加(依赖hashCode()和equals())。适用于需要唯一性保证的场景（如用户名去重）。无序且没有索引，不支持get(i)操作。**LinkedList**：双向链表实现的List和Deque接口，优势在于**首尾操作O(1)**和**中间插入/删除O(1)**(找到位置后)，但**随机访问慢O(n)**(需从头遍历)。提供了addFirst/removeFirst/addLast/removeLast等方法模拟队列/栈行为。**选择建议**：频繁随机查询用ArrayList；频繁首尾增删用LinkedList；需要去重用HashSet。三者都是泛型集合，支持for-each遍历。'
        }
      ]
    },
    {
      id: 'java-exception',
      title: '异常处理与接口',
      icon: '🔄',
      description: '学习try-catch异常处理和interface接口',
      difficulty: 'intermediate',
      examples: [
        {
          title: 'try-catch-finally 异常处理',
          code: `public class Main {
    public static void main(String[] args) {
        // ===== 基本异常捕获 =====
        try {
            int result = divide(10, 0);   // 会抛出 ArithmeticException
            System.out.println("结果: " + result);
        } catch (ArithmeticException e) {
            // 捕获特定类型的异常
            System.out.println("❌ 除零错误: " + e.getMessage());
        }

        // ===== 多异常捕获 =====
        try {
            String str = null;
            System.out.println(str.length());        // NullPointerException
            int[] arr = new int[3];
            arr[10] = 1;                              // ArrayIndexOutOfBoundsException
        } catch (NullPointerException e) {
            System.out.println("❌ 空指针异常: 对象为null");
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println("❌ 数组越界: " + e.getMessage());
        }

        // ===== finally: 无论是否异常都会执行 =====
        try {
            System.out.println("\\n--- 打开资源(如文件/连接) ---");
            int[] data = {1, 2, 3};
            System.out.println(data[5]);   // 触发异常
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println("❌ 发生了异常: " + e.getClass().getSimpleName());
        } finally {
            // finally通常用于清理资源(关闭文件/释放连接)
            System.out.println("--- finally: 资源已释放(总是执行) ---\\n");
        }

        // ===== throw: 主动抛出异常 =====
        try {
            setScore(-5);   // 分数为负, 抛出异常
        } catch (IllegalArgumentException e) {
            System.out.println("⚠️ 校验失败: " + e.getMessage());
        }

        // ===== try-with-resources (Java 7+, 自动关闭资源) =====
        try (java.util.Scanner sc = new java.util.Scanner("Hello World")) {
            System.out.println("读取: " + sc.nextLine());
        }   // Scanner自动关闭, 无需手动sc.close()

        System.out.println("程序继续正常执行...");
    }

    // 可能抛出异常的方法
    static int divide(int a, int b) {
        return a / b;   // b=0时JVM自动抛出ArithmeticException
    }

    // 使用throw主动抛出异常(参数校验)
    static void setScore(int score) {
        if (score < 0 || score > 100) {
            throw new IllegalArgumentException(
                "分数必须在0-100之间! 收到: " + score
            );
        }
        System.out.println("分数设置成功: " + score);
    }
}`,
          explanation: 'Java异常处理机制让程序能优雅地处理运行时错误而非崩溃。核心组件：(1)**try块**：包含可能抛出异常的代码。(2)**catch块**：捕获并处理特定类型的异常(按声明顺序匹配)。可catch多种异常(从具体到一般排序)。(3)**finally块**：无论是否发生异常都会执行的代码，常用于资源清理(关闭文件/数据库连接)。(4)**throw**：主动抛出异常，常用于参数校验等业务逻辑检查。异常层次：Throwable→Error(严重故障不应捕获)/Exception→CheckedException(必须处理)/RuntimeException(可选处理)。try-with-resources语法(Java7+)实现了AutoCloseable接口的对象在try结束后自动close()，避免资源泄漏。'
        },
        {
          title: '接口定义与实现',
          code: `// ===== 定义接口: 抽象行为的契约 =====
interface Drawable {
    // 接口中的方法默认是 public abstract (抽象方法)
    void draw();

    // Java 8+: 可以有默认实现 (default方法)
    default String getInfo() {
        return "这是一个可绘制的图形";
    }

    // Java 8+: 静态方法
    static String getCategory() {
        return "图形类别";
    }
}

// ===== 定义另一个接口: 可调整大小 =====
interface Resizable {
    void resize(double factor);
}

// ===== 实现接口: 使用 implements 关键 =====
// 一个类可以实现多个接口 (弥补Java单继承的限制)
class Circle implements Drawable, Resizable {
    private double radius;

    Circle(double radius) {
        this.radius = radius;
    }

    // 必须实现接口的所有抽象方法
    @Override
    public void draw() {
        System.out.println("🔴 绘制圆形, 半径: " + radius +
                           ", 面积: " + (Math.PI * radius * radius));
    }

    @Override
    public void resize(double factor) {
        radius *= factor;
        System.out.println("缩放 " + factor + "倍, 新半径: " + radius);
    }

    // Circle自己的方法
    public double getCircumference() {
        return 2 * Math.PI * radius;
    }
}

class Rectangle implements Drawable, Resizable {
    private double width, height;

    Rectangle(double width, double height) {
        this.width = width;
        this.height = height;
    }

    @Override
    public void draw() {
        System.out.println("🟨 绘制矩形, " + width + "×" + height +
                           ", 面积: " + (width * height));
    }

    @Override
    public void resize(double factor) {
        width *= factor;
        height *= factor;
        System.out.println("缩放 " + factor + "倍, 新尺寸: " +
                           width + "×" + height);
    }
}

public class Main {
    public static void main(String[] args) {
        // 创建具体对象
        Circle circle = new Circle(5.0);
        Rectangle rect = new Rectangle(4.0, 3.0);

        // 调用接口方法
        circle.draw();        // 实现的draw()
        rect.draw();
        System.out.println("圆形信息: " + circle.getInfo());  // default方法
        System.out.println("类别: " + Drawable.getCategory()); // static方法

        circle.resize(2.0);   // 缩放
        rect.resize(1.5);

        // 接口引用: 可以指向任何实现该接口的对象
        Drawable shape = circle;   // 向上转型
        shape.draw();              // 多态调用!

        shape = rect;
        shape.draw();              // 动态绑定, 调用Rectangle的draw()
    }
}`,
          explanation: '**接口(Interface)**定义了一组方法的规范(契约)，但不提供实现。使用interface关键字声明。规则：(1)接口中的方法默认是publicabstract(隐式)，实现类**必须**提供具体实现(@Override)。(2)Java8+接口可含default方法(有默认实现，实现类可不重写)和static方法。(3)一个类可用implements实现**多个接口**，这是Java弥补单继承限制的重要方式。(4)接口中的变量默认是publicstaticfinal(常量)。**实现(implements)**：类通过implements关键字声明实现某个接口，必须实现所有抽象方法(否则类必须是abstract)。@Override注解帮助编译器验证正确覆盖。接口代表"is-capable-of"(能做什么)的关系，比继承的"is-a"(是什么)更灵活。'
        },
        {
          title: '多态与接口编程',
          code: `// ===== 接口: 支付方式 =====
interface PaymentMethod {
    void pay(double amount);
    String getName();
}

// ===== 各种支付方式的实现 =====
class Alipay implements PaymentMethod {
    @Override
    public void pay(double amount) {
        System.out.printf("💳 支付宝支付 ¥%.2f 成功!\\n", amount);
    }
    @Override
    public String getName() { return "支付宝"; }
}

class WeChatPay implements PaymentMethod {
    @Override
    public void pay(double amount) {
        System.out.printf("💚 微信支付 ¥%.2f 成功!\\n", amount);
    }
    @Override
    public String getName() { return "微信支付"; }
}

class CreditCard implements PaymentMethod {
    @Override
    public void pay(double amount) {
        System.out.printf("💳 信用卡支付 ¥%.2f 成功!\\n", amount);
    }
    @Override
    public String getName() { return "信用卡"; }
}

// ===== 使用接口的多态性 =====
class PaymentProcessor {
    // 核心方法: 接收接口类型参数, 不关心具体实现
    public void processPayment(PaymentMethod method, double amount) {
        System.out.println("正在处理 " + method.getName() + " 支付...");
        method.pay(amount);   // 多态调用: 运行时决定调用哪个实现
        System.out.println("支付完成! ✓\\n");
    }

    // 接收一组支付方式
    public void showAvailableMethods(PaymentMethod[] methods) {
        System.out.println("可用支付方式:");
        for (PaymentMethod m : methods) {
            System.out.println("  - " + m.getName());
        }
    }
}

public class Main {
    public static void main(String[] args) {
        // 创建各种支付方式对象
        Alipay alipay = new Alipay();
        WeChatPay wechat = new WeChatPay();
        CreditCard card = new CreditCard();

        // 多态: 接口引用指向不同实现类对象
        PaymentMethod myPayment;

        // 场景1: 用户选择支付宝
        myPayment = alipay;
        myPayment.pay(99.9);   // 调用Alipay的实现

        // 场景2: 用户切换到微信
        myPayment = wechat;
        myPayment.pay(199.9);  // 调用WeChatPay的实现

        // ===== 面向接口编程: 解耦 =====
        PaymentProcessor processor = new PaymentProcessor();

        // processor不关心具体是哪种支付方式
        processor.processPayment(alipay, 299.0);
        processor.processPayment(wechat, 49.9);
        processor.processPayment(card, 1299.0);

        // 方便扩展: 新增支付方式只需新建类实现接口
        // 不需要修改PaymentProcessor的任何代码! (开闭原则)

        // 接口数组: 存储不同实现类对象
        PaymentMethod[] methods = {alipay, wechat, card};
        processor.showAvailableMethods(methods);

        // instanceof: 判断对象是否是某类型
        System.out.println();
        for (PaymentMethod m : methods) {
            if (m instanceof Alipay) {
                System.out.println(m.getName() + " → 是支付宝类型");
            }
        }
    }
}`,
          explanation: '**多态(Polymorphism)**是OOP核心特性之一，指"同一接口，不同实现"。在Java中主要通过接口实现：(1)**向上转型**：接口引用可以指向任何实现该接口的对象(PaymentMethodm=newAlipay())。(2)**动态绑定(DynamicDispatch)**：通过接口引用调用方法时，JVM在**运行时**根据对象的实际类型决定调用哪个实现类的方法——这就是多态的本质。(3)**面向接口编程**：方法参数/返回值使用接口类型而非具体类，使代码与具体实现解耦。如processPayment(PaymentMethodmethod,...)可以处理任何现有或将来的支付方式，无需修改代码——符合**开闭原则**(对扩展开放,对修改关闭)。(4)**instanceof**运算符在运行时检查对象类型，常用于向下转型前的安全检查。多态使系统更灵活、易扩展、易维护。'
        }
      ]
    },
    {
      id: 'java-project',
      title: '综合实战：简易图书管理系统',
      icon: '🎯',
      description: '运用OOP思想设计并实现图书管理系统',
      difficulty: 'advanced',
      examples: [
        {
          title: '类设计 — Book 类与 Library 类',
          code: `import java.util.ArrayList;
import java.util.List;

// ===== Book类: 表示一本书 =====
class Book {
    private String title;    // 书名
    private String author;   // 作者
    private String isbn;     // ISBN编号
    private boolean borrowed; // 是否借出

    // 构造器
    public Book(String title, String author, String isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.borrowed = false;
    }

    // Getter方法
    public String getTitle() { return title; }
    public String getAuthor() { return author; }
    public String getIsbn() { return isbn; }
    public boolean isBorrowed() { return borrowed; }

    // Setter方法
    public void setBorrowed(boolean borrowed) {
        this.borrowed = borrowed;
    }

    // 借书操作
    public void borrow() {
        if (borrowed) {
            System.out.println("  ⚠️ 《" + title + "》 已被借出!");
        } else {
            borrowed = true;
            System.out.println("  ✓ 成功借阅《" + title + "》");
        }
    }

    // 还书操作
    public void returnBook() {
        if (!borrowed) {
            System.out.println("  ⚠️ 《" + title + "》 未借出, 无法归还");
        } else {
            borrowed = false;
            System.out.println("  ✓ 成功归还《" + title + "》");
        }
    }

    // toString: 显示书籍信息
    @Override
    public String toString() {
        String status = borrowed ? "[已借出]" : "[可借]";
        return String.format("%-20s %-10s %-15s %s",
                title, author, isbn, status);
    }
}

// ===== Library类: 图书馆(管理多本书) =====
class Library {
    private String name;              // 图书馆名称
    private List<Book> books;         // 书籍列表

    public Library(String name) {
        this.name = name;
        this.books = new ArrayList<>();
    }

    // 添加新书
    public void addBook(Book book) {
        books.add(book);
        System.out.println("✓ 添加《" + book.getTitle() + "》成功");
    }

    // 显示所有图书
    public void displayAllBooks() {
        if (books.isEmpty()) {
            System.out.println("图书馆暂无图书");
            return;
        }
        System.out.println("\\n====== " + name + " 图书清单 ======");
        System.out.printf("%-20s %-10s %-15s %s\\n",
                "书名", "作者", "ISBN", "状态");
        System.out.println("----------------------------------------");
        for (Book book : books) {
            System.out.println(book);
        }
        System.out.println("共 " + books.size() + " 本图书\\n");
    }

    public String getName() { return name; }
    public List<Book> getBooks() { return books; }
}`,
          explanation: '本项目采用OOP思想设计图书管理系统，包含两个核心类：(1)**Book类(实体类)**：封装单本书的数据(title/author/isbn/borrowed)和行为(borrow/returnBook/toString)。使用private字段+publicgetter/setter实现封装，借还书方法内含业务逻辑校验(防止重复借/还)。toString()用String.format()格式化输出。(2)**Library类(管理类)**：聚合管理多本Book对象，使用List<Book>(接口类型)存储书籍集合——面向接口编程，方便未来替换为其他List实现。提供addBook/displayAllBooks等管理方法。这种"实体类+管理类"的设计模式在企业应用中非常常见(如User+UserService, Order+OrderService)。'
        },
        {
          title: '完整功能 — 搜索、借阅、归还与交互菜单',
          code: `// ---- 接续上面的Book和Library类定义 ----

// ===== 扩展Library类: 添加更多功能 =====
class Library {
    // ... 前面的字段和构造器保持不变 ...

    // 按书名搜索图书
    public List<Book> searchByTitle(String keyword) {
        List<Book> results = new ArrayList<>();
        for (Book book : books) {
            if (book.getTitle().contains(keyword)) {
                results.add(book);
            }
        }
        return results;
    }

    // 按作者搜索
    public List<Book> searchByAuthor(String author) {
        List<Book> results = new ArrayList<>();
        for (Book book : books) {
            if (book.getAuthor().equals(author)) {
                results.add(book);
            }
        }
        return results;
    }

    // 借书: 按书名查找并借阅
    public boolean borrowBook(String title) {
        for (Book book : books) {
            if (book.getTitle().equals(title)) {
                if (!book.isBorrowed()) {
                    book.borrow();
                    return true;
                } else {
                    System.out.println("  ⚠️ 该书已被借出");
                    return false;
                }
            }
        }
        System.out.println("  ⚠️ 未找到《" + title + "》");
        return false;
    }

    // 还书
    public boolean returnBook(String title) {
        for (Book book : books) {
            if (book.getTitle().equals(title)) {
                book.returnBook();
                return true;
            }
        }
        System.out.println("  ⚠️ 未找到《" + title + "》");
        return false;
    }
}

// ===== 主程序: 交互式菜单 =====
public class Main {
    private static Library library;
    private static java.util.Scanner scanner;

    public static void main(String[] args) {
        library = new Library("城市图书馆");
        scanner = new java.util.Scanner(System.in);

        // 初始化一些图书
        initBooks();

        // 主菜单循环
        while (true) {
            showMenu();
            System.out.print("请选择操作(0-6): ");
            int choice = readInt();

            switch (choice) {
                case 1: handleAddBook();    break;
                case 2: library.displayAllBooks();  break;
                case 3: handleSearch();     break;
                case 4: handleBorrow();     break;
                case 5: handleReturn();     break;
                case 0:
                    System.out.println("感谢使用图书管理系统! 👋");
                    scanner.close();
                    return;
                default:
                    System.out.println("无效选项, 请重新选择");
            }
        }
    }

    static void initBooks() {
        library.addBook(new Book("Java编程思想", "Bruce Eckel", "978-7-111-21382-6"));
        library.addBook(new Book("Effective Java", "Joshua Bloch", "978-7-115-44599-3"));
        library.addBook(new Book("设计模式", "GoF", "978-7-111-07575-2"));
        library.addBook(new Book("深入理解计算机系统", "Randal Bryant", "978-7-111-54493-7"));
        library.addBook(new Book("算法导论", "Thomas Cormen", "978-7-111-40701-0"));
    }

    static void showMenu() {
        System.out.println("\\n================================");
        System.out.println("    📚 " + library.getName());
        System.out.println("================================");
        System.out.println("  1. 添加图书");
        System.out.println("  2. 显示全部图书");
        System.out.println("  3. 搜索图书");
        System.out.println("  4. 借阅图书");
        System.out.println("  5. 归还图书");
        System.out.println("  0. 退出系统");
        System.out.println("================================");
    }

    static void handleAddBook() {
        System.out.print("书名: "); String t = scanner.nextLine();
        System.out.print("作者: "); String a = scanner.nextLine();
        System.out.print("ISBN: ");  String i = scanner.nextLine();
        library.addBook(new Book(t, a, i));
    }

    static void handleSearch() {
        System.out.print("搜索关键词(书名): ");
        String kw = scanner.nextLine();
        List<Book> results = library.searchByTitle(kw);
        if (results.isEmpty()) {
            System.out.println("未找到匹配图书");
        } else {
            System.out.println("找到 " + results.size() + " 本:");
            for (Book b : results) System.out.println("  " + b);
        }
    }

    static void handleBorrow() {
        System.out.print("要借阅的书名: ");
        library.borrowBook(scanner.nextLine());
    }

    static void handleReturn() {
        System.out.print("要归还的书名: ");
        library.returnBook(scanner.nextLine());
    }

    static int readInt() {
        try { return Integer.parseInt(scanner.nextLine()); }
        catch (NumberFormatException e) { return -1; }
    }
}`,
          explanation: '完整的图书管理系统综合运用了Java OOP核心知识：(1)**类设计**：Book实体类封装数据和借还行为，Library管理类负责聚合管理和业务协调。(2)**集合框架**：List<Book>存储图书，List<Book>作为搜索结果返回类型。(3)**封装**：所有字段private，通过public方法控制访问和修改。(4)**字符串操作**：equals()精确比较、contains()模糊搜索。(5)**异常处理**：readInt()用try-catch处理非数字输入。(6)**switch表达式**：菜单分发。(7)**Scanner**：nextLine()读取整行输入(避免next()的空格问题)。(8)**面向接口**：List<Book>而非ArrayList<Book>作为字段类型。项目展示了企业级Java应用的基本架构模式：实体类(Entity)+服务层(Service/Manager)+表现层(UI/Main)。可进一步扩展的功能：持久化(文件/数据库)、用户权限管理、借阅历史记录等。'
        }
      ]
    }
  ]
}
