---
id: python
name: Python
icon: Py
version: '3.x'
description: 简洁优雅的编程语言，适合快速开发
---

## Hello World <!-- tutorial-id: py-hello | icon: 👋 | difficulty: beginner -->
编写第一个Python程序，学习基本语法

### print 输出与变量

```python
# 最简单的输出
print("Hello, World!")

# Python是动态类型语言 - 不需要声明变量类型
name = "小明"       # 字符串 str
age = 25            # 整数 int
height = 1.75       # 浮点数 float
is_student = True   # 布尔值 bool

# f-string 格式化字符串（Python 3.6+ 推荐）
print(f"姓名: {name}")
print(f"年龄: {age}")
print(f"身高: {height}米")
print(f"是学生: {is_student}")

# f-string 支持表达式
print(f"明年年龄: {age + 1}")
print(f"身高保留1位小数: {height:.1f}")
```

> Python的变量无需声明类型——解释器会自动推断。print()是最常用的输出函数。f-string（格式化字符串字面量）用f前缀+大括号{}插入变量和表达式，比旧的%格式化和.format()更简洁直观。

### input 用户输入

```python
# input() 获取用户输入（始终返回字符串）
user_name = input("请输入你的名字: ")
print(f"你好, {user_name}!")

# 输入数字需要类型转换
age_str = input("请输入你的年龄: ")
age = int(age_str)           # 转换为整数
birth_year = 2026 - age      # 计算
print(f"你大约出生于 {birth_year} 年")

# 浮点数输入
score = float(input("请输入分数: "))
if score >= 60:
    print(f"恭喜! 你的成绩: {score:.1f}")
else:
    print(f"继续努力! 分数: {score:.1f}")

# 多个输入一行获取（split分割）
data = input("输入姓名和年龄(空格分隔): ").split()
if len(data) >= 2:
    n, a = data[0], int(data[1])
    print(f"{n}, 今年{a}岁")
```

> input()函数暂停程序等待用户键盘输入，返回值永远是字符串str类型。需要数字时必须用int()或float()显式转换。split()方法可将一行输入按空白符拆分为列表。注意input中的提示文字要清晰友好。

### 基本运算与类型查看

```python
# 算术运算
a, b = 10, 3
print(f"加法: {a + b}")     # 13
print(f"减法: {a - b}")     # 7
print(f"乘法: {a * b}")     # 30
print(f"除法: {a / b}")     # 3.333... (真除法，返回float)
print(f"整除: {a // b}")    # 3 (地板除)
print(f"取余: {a % b}")     # 1
print(f"幂运算: {a ** b}")  # 1000

# 查看变量类型
x = 42
y = "hello"
z = [1, 2, 3]
print(type(x))   # <class 'int'>
print(type(y))   # <class 'str'>
print(type(z))   # <class 'list'>

# 类型转换
num_str = "123"
print(int(num_str) + 1)      # 124
print(float(num_str) + 0.5)  # 123.5
print(str(100) + "分")       # "100分"
print(bool(0), bool(""))     # False False ( falsy值 )
print(bool(1), bool("hi"))   # True True
```

> Python中//是整除（向下取整），%取余，**幂运算。type()可查看任意变量的类型。int()/float()/str()/bool()是常用的类型转换函数。注意0、空字符串""、空列表[]等在bool()转换时为False（称为falsy值）。

## 数据类型与容器 <!-- tutorial-id: py-data | icon: 📦 | difficulty: beginner -->
Python丰富的内置数据结构

### List 列表 - 有序可变序列

```python
# 创建列表
fruits = ["苹果", "香蕉", "橙子"]
numbers = list(range(1, 6))   # [1,2,3,4,5]
empty = []

# 常用操作
fruits.append("葡萄")         # 尾部添加 -> ["苹果","香蕉","橙子","葡萄"]
fruits.insert(1, "芒果")      # 指定位置插入 -> ["苹果","芒果","香蕉","橙子","葡萄"]
removed = fruits.pop()        # 删除并返回最后一个元素 "葡萄"
fruits.remove("香蕉")         # 按值删除第一个匹配项
first = fruits.pop(0)         # 删除并返回索引0的元素

# 索引与切片
nums = [0, 1, 2, 3, 4, 5]
print(nums[0])                # 第一个元素: 0
print(nums[-1])               # 最后一个元素: 5
print(nums[1:4])              # 切片 [1,2,3] (含头不含尾)
print(nums[::2])              # 步长2 [0,2,4]
print(nums[::-1])             # 反转 [5,4,3,2,1,0]

# 常用方法
print(len(nums))              # 长度: 6
print(nums.index(3))          # 查找值的索引: 3
print(3 in nums)              # 成员判断: True
nums.extend([6, 7])           # 批量添加
nums.sort(reverse=True)       # 原地排序反转
print(nums)                   # [7,6,5,4,3,2,1,0]
```

> List是Python最常用的数据结构——有序、可变、允许重复元素。append/pop操作尾部O(1)，insert/remove中间操作O(n)。切片[start:end:step]极其强大，支持负索引从末尾计数。sort()原地排序不返回新列表，sorted()则返回新列表。

### Dict 字典 - 键值对映射

```python
# 创建字典
person = {"name": "小明", "age": 25, "city": "北京"}
student = dict(name="小红", score=95)

# 访问值（推荐用get避免KeyError）
print(person["name"])             # 小明
print(person.get("email"))        # None（键不存在时不报错）
print(person.get("email", "未填写"))  # 默认值回退

# 添加/修改
person["email"] = "xm@test.com"  # 添加新键值对
person["age"] = 26               # 修改已有键

# 删除
del person["city"]               # 删除指定键
val = person.pop("age")          # 删除并返回值

# 遍历字典
scores = {"数学": 95, "英语": 88, "物理": 92}
for key in scores:
    print(f"{key}: {scores[key]}")

for subject, score in scores.items():
    print(f"{subject}: {score}分")

for k in scores.keys():   pass   # 只遍历键
for v in scores.values(): pass   # 只遍历值

# 合并字典 (Python 3.9+)
defaults = {"theme": "dark"}
user = {"theme": "light", "lang": "zh"}
merged = defaults | user         # {"theme":"light","lang":"zh"} (后者覆盖前者)

# 字典推导式
squares = {x: x**2 for x in range(1, 6)}
print(squares)  # {1:1, 4:9, 9:16, 16:25, 25:36}
```

> Dict通过键快速查找值（平均O(1)），是Python最核心的数据结构之一。get()方法安全访问不存在的键。items()同时遍历键值对。Python 3.9+可用|运算符合并字典。字典推导式{key_expr: val_expr for ...}简洁地创建字典。

### Set 集合 与 Tuple 元组

```python
# ===== Set 集合 - 无序不重复 =====
# 创建集合
colors = {"红", "绿", "蓝", "红"}  # 自动去重 -> {"红","绿","蓝"}
nums_set = set([1, 2, 2, 3, 3])  # 从列表创建 -> {1,2,3}

# 基本操作
colors.add("黄")
colors.discard("紫")     # 安全删除（不存在也不报错）
print(len(colors))       # 元素个数
print("红" in colors)    # 成员判断 O(1)

# 集合运算
A = {1, 2, 3, 4}
B = {3, 4, 5, 6}
print(A | B)             # 并集: {1,2,3,4,5,6}
print(A & B)             # 交集: {3,4}
print(A - B)             # 差集: {1,2}
print(A ^ B)             # 对称差集: {1,2,5,6}
print(A <= B)            # 子集判断: False


# ===== Tuple 元组 - 有序不可变 =====
# 创建元组
point = (3, 4)                    # 二维坐标
rgb = (255, 128, 0)               # RGB颜色
single = (42,)                    # 单元素元组（注意逗号！）
coords = tuple([10, 20, 30])      # 从列表创建

# 解包赋值
x, y = point                      # x=3, y=4
r, g, b = rgb                     # r=255, g=128, b=0
first, *rest = (1, 2, 3, 4)      # first=1, rest=[2,3,4]

# 元组不可变（但内部可变对象仍可修改）
t = (1, [2, 3])
# t[0] = 10      # TypeError! 不能修改
t[1].append(4)   # OK，列表本身可以变
print(t)         # (1, [2,3,4])

# 应用场景：函数多返回值、字典键、不变的数据记录
def get_stats(data):
    return min(data), max(data), sum(data)/len(data)

mn, mx, avg = get_stats([85, 92, 78, 96])
print(f"最小:{mn} 最大:{mx} 平均:{avg:.1f}")
```

> Set用于去重和集合运算（交/并/差），成员判断O(1)极快。Tuple是不可变的有序序列，用圆括号创建（单元素需加逗号）。元组解包赋值是Python特色语法，广泛用于函数多返回值交换变量等场景。不可变性使元组可作为字典的键。

## 控制流 <!-- tutorial-id: py-control | icon: 🔀 | difficulty: beginner -->
条件判断、循环和推导式

### if / elif / else 条件判断

```python
score = 78

# if-elif-else 链式条件（注意缩进！）
if score >= 90:
    grade = "优秀"
    print("太棒了!")
elif score >= 80:
    grade = "良好"
    print("不错哦!")
elif score >= 60:
    grade = "及格"
    print("继续加油!")
else:
    grade = "不及格"
    print("需要努力!")

print(f"等级: {grade}")

# 三元表达式（条件表达式）
status = "成年" if age >= 18 else "未成年"

# 复合条件
temp = 28
if 20 <= temp <= 30:
    print("温度适宜")
elif temp > 35 or temp < 0:
    print("极端天气!")

# 成员检测 in / not in
fruit = "苹果"
if fruit in ["苹果", "香蕉", "橙子"]:
    print("这是常见水果")

# 身份判断 is / is not
x = None
if x is None:
    print("x为空")  # 推荐用is判断None，而非==
```

> Python用缩进（通常4个空格）代替花括号来划分代码块——这是Python最显著的特征。elif相当于其他语言的else if。三元表达式value_if_true if condition else value_if_false。链式比较20<=temp<=30等价于20<=temp and temp<=30。判断None推荐用is而非==。

### for / while 循环

```python
# for 循环 - 遍历可迭代对象
fruits = ["苹果", "香蕉", "橙子"]

# 基本遍历
for fruit in fruits:
    print(fruit)

# enumerate 获取索引和值
for index, fruit in enumerate(fruits):
    print(f"[{index}] {fruit}")

# range 生成数字序列
for i in range(5):           # 0,1,2,3,4
    print(i)
for i in range(1, 10, 2):    # 1,3,5,7,9 (起止步长)
    print(i)

# zip 同时遍历多个序列
names = ["小明", "小红", "小刚"]
ages = [25, 23, 26]
for name, age in zip(names, ages):
    print(f"{name}: {age}岁")


# while 循环 - 条件为真时反复执行
count = 0
while count < 5:
    print(f"计数: {count}")
    count += 1

# break 和 continue
for i in range(10):
    if i == 3:
        continue    # 跳过本次，进入下一次
    if i == 8:
        break       # 直接退出整个循环
    print(i)        # 打印 0,1,2,4,5,6,7

# while-else: 循环正常结束（非break）时执行else
n = 0
while n < 5:
    n += 1
    if n == 3:
        break
else:
    print("循环正常结束")  # 不会执行（因为break了）

# for-else 同理
for i in range(3):
    if i > 10:
        break
else:
    print("没有触发break")  # 会执行
```

> for-in是Python最主要的循环结构，配合range/enumerate/zip使用非常强大。while适合不确定次数的循环。break跳出整个循环，continue跳过当前迭代。Python独有的for/while-else结构：循环正常完成（未被break中断）时执行else块，常用于搜索失败处理。

### 列表推导式

```python
# 基本语法: [expression for item in iterable if condition]

# 传统写法 vs 推导式
# 传统方式
squares = []
for x in range(1, 6):
    squares.append(x ** 2)

# 推导式（一行搞定）
squares = [x ** 2 for x in range(1, 6)]
print(squares)  # [1, 4, 9, 16, 25]

# 带条件的推导式
evens = [x for x in range(1, 11) if x % 2 == 0]
print(evens)   # [2, 4, 6, 8, 10]

# 嵌套推导式（扁平化矩阵）
matrix = [[1,2,3], [4,5,6], [7,8,9]]
flat = [num for row in matrix for num in row]
print(flat)    # [1,2,3,4,5,6,7,8,9]

# 带条件表达式的推导式
result = ["偶数" if x % 2 == 0 else "奇数" for x in range(5)]
print(result)  # ['奇数','偶数','奇数','偶数','奇数']

# 字典推导式
word_lengths = {word: len(word) for word in ["apple", "banana", "cherry"]}
print(word_lengths)  # {'apple':5,'banana':6,'cherry':6}

# 集合推导式
unique_squares = {x**2 for x in [-2, -1, 0, 1, 2]}
print(unique_squares)  # {0, 1, 4} (自动去重!)

# 生成器表达式（省内存，惰性求值）
gen = (x**2 for x in range(1000000))  # 不立即生成所有元素
print(sum(gen))  # 按需计算并求和
```

> 列表推导式是Python最具特色的语法糖之一，将map/filter/lambda组合成极简的可读形式。[expr for x in iter if cond]中expr是生成每个元素的公式，if可选用于过滤。还支持字典推导式{key:val for...}和集合推导式{expr for...}。生成器表达式用()代替[]，按需惰性计算节省大量内存。

## 函数与模块 <!-- tutorial-id: py-func | icon: ⚡ | difficulty: beginner -->
函数定义、lambda和模块导入

### def 函数定义与参数

```python
# 基本函数定义
def greet(name):
    return f"你好, {name}!"

print(greet("小明"))  # 你好, 小明!

# 多个返回值（实际返回元组）
def get_circle(r):
    area = 3.14159 * r ** 2
    circum = 2 * 3.14159 * r
    return area, circum

a, c = get_circle(5)
print(f"面积: {a:.2f}, 周长: {c:.2f}")

# 默认参数
def power(base, exp=2):
    return base ** exp

print(power(3))      # 9 (使用默认exp=2)
print(power(2, 10))  # 1024

# *args 可变位置参数（收集为元组）
def summarize(*args):
    total = sum(args)
    count = len(args)
    avg = total / count if count > 0 else 0
    return f"总和={total}, 个数={count}, 平均={avg:.1f}"

print(summarize(80, 90, 70, 95))

# **kwargs 可变关键字参数（收集为字典）
def create_profile(**kwargs):
    info = []
    for key, value in kwargs.items():
        info.append(f"{key}: {value}")
    return "\n".join(info)

print(create_profile(name="小明", age=25, city="北京"))

# 参数顺序规则: 位置参数 -> *args -> 默认参数 -> **kwargs
def complex_func(a, b, *args, default=10, **kwargs):
    print(f"a={a}, b={b}, args={args}, default={default}, kwargs={kwargs}")
```

> def定义函数，return返回结果（无return时隐式返回None）。Python函数天然支持多返回值——实际上是返回元组并用解包接收。默认参数在调用时可不传。*args收集多余位置参数为元组，**kwargs收集多余关键字参数为字典。两者常一起使用实现灵活的函数接口。

### Lambda 匿名函数

```python
# lambda语法: lambda 参数: 表达式
add = lambda a, b: a + b
print(add(3, 5))  # 8

# 配合 sorted 的 key 参数
students = [
    ("小明", 85),
    ("小红", 92),
    ("小刚", 78),
]

# 按分数降序排列
by_score = sorted(students, key=lambda s: s[1], reverse=True)
print(by_score)  # [('小红',92),('小明',85),('小刚',78)]

# 配合 map 和 filter
numbers = [1, 2, 3, 4, 5, 6]

squared = list(map(lambda x: x**2, numbers))
print(squared)   # [1,4,9,16,25,36]

evens = list(filter(lambda x: x % 2 == 0, numbers))
print(evens)     # [2,4,6]

# max/min 的 key 参数
words = ["banana", "apple", "cherry", "date"]
longest = max(words, key=len)  # 取最长单词
print(longest)    # banana

# sorted 对字典列表排序
people = [
    {"name": "张三", "age": 25},
    {"name": "李四", "age": 30},
    {"name": "王五", "age": 22},
]
sorted_people = sorted(people, key=lambda p: p["age"])
print([(p["name"], p["age"]) for p in sorted_people])

# 注意: lambda只能包含单个表达式，不能有语句（如if/for/赋值）
# 复杂逻辑请用 def 定义具名函数
```

> lambda创建匿名函数，语法简洁但功能受限（单表达式）。最适合作为key=参数传给sorted/max/min等高阶函数，或配合map/filter做简单转换/过滤。对于复杂逻辑应优先使用def定义具名函数——更易读易调试。

### 模块导入 import

```python
# 导入整个模块
import math
print(math.pi)                # 3.14159...
print(math.sqrt(16))          # 4.0
print(math.ceil(3.2))         # 4 (向上取整)
print(math.floor(3.8))        # 3 (向下取整)

# 导入特定名称
from random import randint, choice
print(randint(1, 100))        # 1-100随机整数
print(choice(["红", "绿", "蓝"]))  # 随机选一个

# 导入并重命名
import os as operating_system
print(operating_system.getcwd())  # 当前工作目录路径

# from ... import * （不推荐，可能造成命名冲突）
from time import *
sleep(1)  # 等待1秒
print(time())  # Unix时间戳

# 常用标准库示例
import json
data = {"name": "小明", "scores": [95, 88, 92]}
json_str = json.dumps(data, ensure_ascii=False, indent=2)
print(json_str)
parsed = json.loads(json_str)
print(parsed["name"])

# os 模块 - 文件和系统操作
import os
print(os.listdir("."))         # 列出当前目录文件
print(os.path.exists("test.txt"))  # 文件是否存在
print(os.path.join("folder", "file.txt"))  # 路径拼接

# pathlib - 现代路径操作（推荐）
from pathlib import Path
p = Path(".")
print(list(p.glob("*.py")))   # 查找所有.py文件
print(p.resolve())            # 绝对路径
```

> import导入模块，Python拥有丰富的标准库（batteries included哲学）。math提供数学函数，random用于随机数，os/os/pathlib处理文件系统，json处理JSON数据。from X import Y只导入需要的名称减少内存占用。as给模块起别名避免命名冲突。应避免from X import *以免污染命名空间。

## 面向对象 <!-- tutorial-id: py-oop | icon: 📚 | difficulty: intermediate -->
class类、继承和多态

### class 定义与 __init__

```python
# 定义类
class Dog:
    # 类属性（所有实例共享）
    species = "犬科动物"
    
    # 构造方法 __init__ - 创建实例时自动调用
    def __init__(self, name, age, breed="中华田园犬"):
        self.name = name      # 实例属性（每个实例独立）
        self.age = age
        self.breed = breed
    
    # 实例方法（第一个参数必须是self，代表实例自身）
    def bark(self):
        return f"{self.name}汪汪叫!"
    
    def introduce(self):
        return (f"我是{self.breed}，名叫{self.name}，"
                f"{self.age}岁了，属于{Dog.species}")
    
    def birthday(self):
        self.age += 1
        return f"{self.name}过生日啦! 现在{self.age}岁"


# 创建实例（自动调用__init__）
dog1 = Dog("旺财", 3, "金毛")
dog2 = Dog("大黄", 5)

# 调用方法和访问属性
print(dog1.bark())           # 旺财汪汪叫!
print(dog2.introduce())      # 我是中华田园犬，名叫大黄...
print(dog1.birthday())       # 旺财过生日啦! 现在4岁
print(dog1.age)              # 4 (已被birthday修改)

# 类属性 vs 实例属性
print(dog1.species)          # 犬科动物（继承自类）
print(Dog.species)           # 犬科动物（直接从类访问）

# 动态添加属性和方法（Python灵活但不推荐滥用）
dog1.color = "黄色"
print(dog1.color)            # 黄色
```

> class定义类，__init__是构造方法（不是构造函数），在实例创建时自动初始化属性。self指向当前实例（类似this），所有实例方法的第一个参数都是self。类属性属于类本身被所有实例共享，实例属性在__init__中通过self.xxx定义，每个实例独立拥有。Python允许运行时动态添加属性，体现了其动态语言的灵活性。

### 继承 super() 与方法重写

```python
# 基类（父类）
class Animal:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def speak(self):
        return f"{self.name}发出了声音"
    
    def info(self):
        return f"{self.name}, {self.age}岁"


# 子类继承父类
class Cat(Animal):
    def __init__(self, name, age, color):
        # 调用父类的__init__初始化共有属性
        super().__init__(name, age)
        self.color = color  # 子类特有属性
    
    # 方法重写（override）
    def speak(self):
        return f"{self.name}(一只{self.color}猫)喵喵叫~"
    
    # 新增子类独有方法
    def climb(self):
        return f"{self.name}爬上了树!"


class Bird(Animal):
    def __init__(self, name, age, wingspan):
        super().__init__(name, age)
        self.wingspan = wingspan
    
    def speak(self):
        return f"{self.name}叽叽喳喳!"
    
    def fly(self):
        return f"{self.name}展翅{self.wingspan}cm飞翔~"


# 使用继承体系
cat = Cat("咪咪", 2, "橘色")
bird = Bird("小鸟", 1, 15)

print(cat.speak())     # 咪咪(一只橘色猫)喵喵叫~
print(cat.climb())     # 咪咪爬上了树!
print(cat.info())      # 咪咪, 2岁（继承自Animal的方法）
print(bird.speak())    # 小鸟叽叽喳喳!
print(bird.fly())      # 小鸟展翅15cm飞翔~

# isinstance 类型检查（支持继承关系）
print(isinstance(cat, Animal))   # True (Cat是Animal的子类)
print(isinstance(cat, Cat))      # True
print(type(cat) == Animal)       # False (精确类型匹配)

# 多继承（Python支持，MRO方法解析顺序）
class Flyable:
    def fly(self): return "会飞!"
class Swimmable:
    def swim(self): return "会游泳!"

class Duck(Animal, Flyable, Swimmable):
    def speak(self): return "嘎嘎嘎!"

duck = Duck("唐老鸭", 3)
print(duck.fly(), duck.swim(), duck.speak())
print(Duck.__mro__)  # 方法解析顺序链
```

> class Child(Parent)实现继承，子类自动获得父类的所有属性和方法。super().__init__()调用父类构造函数确保正确初始化。子类可以重写override父类方法以定制行为。isinstance()检查对象是否是某类（或其子类）的实例。Python支持多继承，MRO(Method Resolution Order)决定方法查找顺序。继承遵循LSP原则——子类应能替换父类使用。

### @property 装饰器与特殊方法

```python
class Student:
    def __init__(self, name, scores):
        self.name = name
        self._scores = scores  # 下划线约定表示"内部使用"
    
    # @property - 将方法变成属性访问
    @property
    def average(self):
        """计算平均分"""
        if not self._scores:
            return 0
        return sum(self._scores) / len(self._scores)
    
    @property
    def grade(self):
        """根据平均分判定等级"""
        avg = self.average
        if avg >= 90: return "优秀"
        elif avg >= 80: return "良好"
        elif avg >= 60: return "及格"
        else: return "不及格"
    
    @average.setter
    def average(self, value):
        """设置平均分的setter（示例：反向推算总分）"""
        if len(self._scores) > 0:
            total = value * len(self._scores)
            self._scores = [total / len(self._scores)] * len(self._scores)


# 特殊方法（魔术方法/dunder方法）
class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y
    
    # __str__ - str()和print()时调用（面向用户的友好表示）
    def __str__(self):
        return f"Vector({self.x}, {self.y})"
    
    # __repr__ - repr()和调试时调用（面向开发者的精确表示）
    def __repr__(self):
        return f"Vector(x={self.x}, y={self.y})"
    
    # __add__ - 支持 + 运算符
    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y)
    
    # __len__ - 支持 len() 函数
    def __len__(self):
        return int((self.x**2 + self.y**2) ** 0.5)
    
    # __getitem__ - 支持索引访问 v[0], v[1]
    def __getitem__(self, index):
        return (self.x, self.y)[index]


# 使用 @property
s = Student("小明", [95, 88, 92, 79])
print(s.average)    # 88.5 (像属性一样访问!)
print(s.grade)      # 良好

# 使用特殊方法
v1 = Vector(3, 4)
v2 = Vector(1, 2)
print(v1)            # Vector(3, 4)  (__str__)
print(repr(v1))      # Vector(x=3, y=4)  (__repr__)
print(v1 + v2)       # Vector(4, 6)  (__add__)
print(len(v1))       # 5  (__len__)
print(v1[0], v1[1])  # 3 4  (__getitem__)
```

> @property装饰器将方法转化为"计算属性"，访问时不用加括号，还可以定义setter实现赋值拦截。特殊方法（双下划线包围的__xxx__）让自定义类能像内置类型一样工作：__str__/__repr__控制字符串表示，__add__等实现运算符重载，__len__/__getitem__支持内置函数和索引操作。这些魔术方法是Python数据模型的核心。

## Pythonic 写法 <!-- tutorial-id: py-pythonic | icon: 🐍 | difficulty: intermediate -->
装饰器、上下文管理器和生成器

### @ 装饰器

```python
# 装饰器本质是一个函数，它接收一个函数作为参数，
# 返回一个新函数（通常是包装原函数的增强版）

# ===== 计时装饰器 =====
import time

def timer(func):
    """测量函数执行时间的装饰器"""
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)  # 调用原函数
        end = time.perf_counter()
        elapsed = (end - start) * 1000  # 毫秒
        print(f"[计时] {func.__name__} 耗时 {elapsed:.2f}ms")
        return result
    return wrapper

# 使用装饰器（语法糖 @）
@timer
def slow_function(n):
    total = 0
    for i in range(n):
        total += i ** 2
    return total

print(slow_function(100000))


# ===== 日志装饰器 =====
def logger(log_level="INFO"):
    """带参数的装饰器工厂"""
    def decorator(func):
        def wrapper(*args, **kwargs):
            print(f"[{log_level}] 调用 {func.__name__}({args}, {kwargs})")
            result = func(*args, **kwargs)
            print(f"[{log_level}] {func.__name__} 返回: {result}")
            return result
        return wrapper
    return decorator

@logger("DEBUG")
def add(a, b):
    return a + b

add(3, 5)


# ===== 缓存装饰器（简易版）=====
def cache(func):
    _cache = {}
    def wrapper(*args):
        if args not in _cache:
            _cache[args] = func(args)
            print(f"  -> 计算并存入缓存: {args}")
        else:
            print(f"  -> 命中缓存: {args}")
        return _cache[args]
    return wrapper

@cache
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(10))  # 第二次调用相同参数时会命中缓存
```

> 装饰器是Python的高级特性，@语法糖等价于func = decorator(func)。它能在不修改原函数代码的前提下增强功能——计时、日志、缓存、权限验证、重试等。带参数的装饰器需要多一层嵌套（工厂模式）：先调用外层函数返回真正的装饰器。functools.wraps可保留原函数的元信息（名称、文档字符串等）。

### with 上下文管理器

```python
# with语句 - 自动管理资源（自动清理/关闭）
# 原理: 对象实现了 __enter__ 和 __exit__ 方法

# ===== 文件操作的经典用法 =====
# 不用with（容易忘记关闭文件）
f = open("example.txt", "w")
try:
    f.write("Hello!")
finally:
    f.close()

# 用with（推荐! 自动关闭，即使发生异常）
with open("example.txt", "w", encoding="utf-8") as f:
    f.write("第一行\n")
    f.write("第二行\n")
# 离开with块后文件自动关闭

# 读取文件
with open("example.txt", "r", encoding="utf-8") as f:
    content = f.read()       # 全部读取为一个字符串
    print(content)

with open("example.txt", "r", encoding="utf-8") as f:
    lines = f.readlines()    # 读取所有行到列表
    for line in lines:
        print(line.strip())

# ===== 自定义上下文管理器 =====
class TimerContext:
    def __enter__(self):
        self.start = time.perf_counter()
        print(">>> 开始计时")
        return self  # 返回值赋给as后面的变量
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        elapsed = time.perf_counter() - self.start
        print(f"<<< 结束计时: {elapsed:.4f}秒")
        return False  # 返回True可抑制异常

with TimerContext() as t:
    sum(range(10000000))
    # 即使这里抛异常，__exit__仍会被调用!

# ===== contextlib 简化写法 =====
from contextlib import contextmanager

@contextmanager
def tag(name):
    print(f"<{name}>")
    yield           # 分割enter和exit两部分
    print(f"</{name}>")

with tag("div"):
    print("内容")   # 输出: <div> 内容 </div>
```

> with语句确保资源在使用后被正确释放——文件关闭、锁释放、数据库连接归还等。底层协议要求对象实现__enter__（进入时调用，返回资源）和__exit__（离开时调用，负责清理）。即使with块内抛出异常，__exit__也会被执行。contextlib.contextmanager装饰器可以用yield简化上下文管理器的编写，yield之前是__enter__的逻辑，之后是__exit__的逻辑。

### yield 生成器

```python
# 生成器 - 惰性计算的迭代器（节省内存）
# 用 yield 关键字替代 return，函数变为生成器函数

# ===== 斐波那契数列生成器 =====
def fibonacci(n):
    """生成前n个斐波那契数"""
    a, b = 0, 1
    for _ in range(n):
        yield a    # 暂停并返回当前值，下次从这继续
        a, b = b, a + b

# 生成器返回的是迭代器对象，不会一次性生成所有值
fib_gen = fibonacci(10)
print(type(fib_gen))  # <class 'generator'>

# 用 for 遍历（每次next()才计算下一个值）
for num in fibonacci(10):
    print(num, end=" ")  # 0 1 1 2 3 5 8 13 21 34
print()


# ===== 无限序列（普通函数无法做到）=====
def count_from(start=0):
    """从start开始无限递增"""
    n = start
    while True:
        yield n
        n += 1

counter = count_from(10)
print(next(counter))  # 10
print(next(counter))  # 11
print(next(counter))  # 12
# 可以永远next下去...


# ===== 生成器表达式 =====
# 语法类似列表推导式，但用()代替[]
squares_gen = (x**2 for x in range(1, 1000001))
# 不会立即占用内存存储100万个数！

print(sum(squares_gen))  # 按需计算求和
# print(sum(squares_gen))  # 再次sum得到0（生成器已耗尽）


# ===== yield from 委托生成器 =====
def chain(*iterables):
    """连接多个可迭代对象"""
    for it in iterables:
        yield from it  # 将迭代委托给子生成器

for val in chain("ABC", [1, 2, 3], range(3)):
    print(val, end=" ")  # A B C 1 2 3 0 1 2


# ===== 实际应用：逐行读取大文件 =====
def read_large_file(filepath):
    """逐行读取大文件（不会把整个文件加载到内存）"""
    with open(filepath, "r", encoding="utf-8") as f:
        for line in f:
            yield line.strip()

# 用法
# for line in read_large_file("huge_log.txt"):
#     process(line)
```

> 生成器是Python处理大数据流的利器。yield让函数变成生成器——每次调用next()执行到yield暂停返回值，下次调用从暂停处继续。优势：惰性计算（按需生成）、内存高效（一次只保存一个状态）、可表示无限序列。生成器表达式(x**2 for x in...)是列表推导式的惰性版本。yield from用于委托子生成器，简化嵌套yield。典型场景：读取大文件、流式数据处理、管道式处理链。

## 文件与异常 <!-- tutorial-id: py-file | icon: 📁 | difficulty: intermediate -->
文件读写和错误处理

### open 文件读写

```python
# ===== 写入文件 =====
# "w" 模式 - 覆盖写入（文件存在则清空重建）
with open("notes.txt", "w", encoding="utf-8") as f:
    f.write("第一行内容\n")
    f.write("第二行内容\n")
    
    # writelines 写入多行（不会自动加换行）
    lines = ["第三行\n", "第四行\n", "第五行\n"]
    f.writelines(lines)

# "a" 模式 - 追加写入（在文件末尾添加）
with open("notes.txt", "a", encoding="utf-8") as f:
    f.write("追加的内容\n")


# ===== 读取文件 =====
# read() - 全部读取为一个字符串
with open("notes.txt", "r", encoding="utf-8") as f:
    content = f.read()
    print(f"共 {len(content)} 个字符")

# readline() - 逐行读取（每次读一行）
with open("notes.txt", "r", encoding="utf-8") as f:
    first_line = f.readline().strip()
    second_line = f.readline().strip()
    print(f"前两行: {first_line} | {second_line}")

# readlines() - 读取所有行到列表
with open("notes.txt", "r", encoding="utf-8") as f:
    all_lines = f.readlines()
    print(f"共 {len(all_lines)} 行")

# 推荐方式 - 直接迭代文件对象（内存效率最高）
with open("notes.txt", "r", encoding="utf-8") as f:
    for line_num, line in enumerate(f, 1):
        print(f"[第{line_num}行] {line.rstrip()}")

# ===== 其他模式 =====
# "rb"/"wb" - 二进制读写（图片、视频等非文本文件）
# "r+" - 读写模式
# "x" - 排他性创建（文件已存在则报错）
```

> open()打开文件返回文件对象，encoding="utf-8"指定编码避免中文乱码。"w"覆盖写入、"a"追加写入、"r"读取（默认）。强烈推荐搭配with语句使用——确保文件在任何情况下都会被正确关闭。read()全部读入内存适合小文件；直接迭代文件对象逐行处理适合大文件（内存高效）。二进制模式"rb"/"wb"用于图片音频等非文本文件。

### try / except 异常处理

```python
# ===== 基本异常捕获 =====
try:
    number = int(input("输入一个数字: "))
    result = 100 / number
    print(f"100 ÷ {number} = {result}")
except ValueError:
    print("错误: 请输入有效的数字!")
except ZeroDivisionError:
    print("错误: 不能除以零!")
except Exception as e:
    print(f"未知错误: {type(e).__name__}: {e}")


# ===== finally 和 else =====
try:
    file = open("data.txt", "r")
    content = file.read()
except FileNotFoundError:
    print("文件不存在!")
else:
    # try块没有抛异常时执行
    print(f"成功读取 {len(content)} 个字符")
    file.close()
finally:
    # 无论是否异常都会执行（清理资源）
    print("清理工作完成")


# ===== raise 抛出自定义异常 =====
class InvalidScoreError(Exception):
    """自定义异常 - 分数无效"""
    pass

def set_score(score):
    if not isinstance(score, (int, float)):
        raise TypeError("分数必须是数字!")
    if score < 0 or score > 100:
        raise InvalidScoreError(f"分数必须在0-100之间! 收到: {score}")
    print(f"分数已设置为: {score}")

# 捕获自定义异常
try:
    set_score(150)
except InvalidScoreError as e:
    print(f"分数错误: {e}")
except TypeError as e:
    print(f"类型错误: {e}")


# ===== 断言 assert（调试用）=====
def calculate_discount(price, discount):
    assert price > 0, "价格必须大于0"
    assert 0 <= discount <= 1, "折扣必须在0-1之间"
    return price * (1 - discount)

# assert 在优化模式(-O)下会被跳过，不要用它处理业务逻辑!


# ===== 常见内置异常类型 =====
# ValueError - 值不合法（如int("abc")）
# TypeError - 类型不正确（如"1"+1）
# KeyError - 字典键不存在
# IndexError - 列表索引越界
# FileNotFoundError - 文件不存在
# PermissionError - 权限不足
# RuntimeError - 通用运行时错误
```

> try-except捕获和处理异常，避免程序崩溃。except后可跟具体异常类型进行精准捕获，Exception基类兜底所有异常。else块在无异常时执行，finally块无论如何都执行（适合资源清理）。raise主动抛出异常，可自定义异常类继承Exception。assert用于调试时的前置条件检查（生产环境-O标志会禁用）。好的异常处理策略：精确捕获预期异常、记录日志、优雅降级或提示用户。

### json 模块处理 JSON

```python
import json

# ===== JSON 序列化（Python -> JSON字符串）=====

# 基本数据类型
data = {
    "name": "小明",
    "age": 25,
    "is_student": False,
    "courses": ["数学", "物理", "编程"],
    "address": {
        "city": "北京",
        "district": "海淀"
    }
}

# dumps - 序列化为字符串（indent美化输出）
json_str = json.dumps(data, ensure_ascii=False, indent=2)
print(json_str)
print(f"类型: {type(json_str)}")  # <class 'str'>

# dump - 直接写入文件
with open("data.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)


# ===== JSON 反序列化（JSON字符串 -> Python）=====

# loads - 从字符串解析
parsed = json.loads(json_str)
print(f"姓名: {parsed['name']}")
print(f"课程: {parsed['courses']}")

# load - 从文件读取
with open("data.json", "r", encoding="utf-8") as f:
    loaded_data = json.load(f)
print(loaded_data)


# ===== JSON与Python类型对应关系 =====
# JSON object  -> Python dict
# JSON array   -> Python list
# JSON string  -> Python str
# JSON number  -> Python int/float
# JSON true/false -> Python True/False
# JSON null     -> Python None


# ===== 处理自定义对象的序列化 =====
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

p = Person("小红", 23)

# 自定义encoder
def person_encoder(obj):
    if isinstance(obj, Person):
        return {"__type__": "Person", "name": obj.name, "age": obj.age}
    raise TypeError(f"Object of type {type(obj).__name__} is not JSON serializable")

json_str = json.dumps(p, default=person_encoder, ensure_ascii=False)
print(json_str)  # {"__type__": "Person", "name": "小红", "age": 23}
```

> json模块是Python处理JSON数据的标配工具。dumps/dump负责序列化（Python→JSON），loads/load负责反序列化（JSON→Python）。ensure_ascii=False确保中文字符正常显示不被转义为\uXXXX。indent参数美化输出便于阅读。JSON只支持有限的基本类型（dict/list/str/int/float/bool/None），自定义对象需要通过default参数提供转换函数或使用第三方库如orjson/pymarshal。

## 综合实战：命令行天气查询工具 <!-- tutorial-id: py-project | icon: 🎯 | difficulty: advanced -->
用requests+json实现天气查询CLI工具

### requests.get 获取 API 数据

```python
import requests
import json

# ===== 基础 GET 请求 =====
# 使用免费的 wttr.in 天气服务（无需API Key）
url = "https://wttr.in/Beijing?format=j1"

try:
    response = requests.get(url, timeout=10)
    
    # 检查HTTP状态码
    response.raise_for_status()  # 非200则抛HTTPError
    
    # 解析JSON响应体
    data = response.json()
    print(f"请求成功! 数据类型: {type(data)}")
    
    # 查看返回数据的顶层结构
    print(f"顶层键: {list(data.keys())}")
    
except requests.exceptions.RequestException as e:
    print(f"网络请求失败: {e}")
except json.JSONDecodeError as e:
    print(f"JSON解析失败: {e}")


# ===== 带参数的请求 =====
# 查询不同城市
cities = ["Beijing", "Shanghai", "Tokyo", "New York"]

for city in cities:
    resp = requests.get(
        f"https://wttr.in/{city}?format=j1",
        headers={"User-Agent": "WeatherApp/1.0"},  # 设置请求头
        timeout=5
    )
    weather = resp.json()
    current = weather.get("current_condition", [{}])[0]
    temp_c = current.get("temp_C", "N/A")
    desc = current.get("weatherDesc", [{}])[0].get("value", "N/A")
    humidity = current.get("humidity", "N/A")
    print(f"{city:>12}: {temp_c}°C | {desc} | 湿度:{humidity}%")
```

> requests是Python最流行的HTTP库，API设计人性化。get(url)发送GET请求返回Response对象。response.json()自动将JSON响应体解析为Python字典/列表。raise_for_status()检查HTTP状态码，非2xx时抛异常。headers参数设置User-Agent等请求头（某些API要求）。timeout防止请求永久挂起。wttr.in是免费免注册的天气API，format=j1返回结构化JSON数据。

### 解析 JSON 提取天气信息

```python
import requests
import json

def fetch_weather(city):
    """获取指定城市的完整天气数据"""
    url = f"https://wttr.in/{city}?format=j1&lang=zh"
    try:
        resp = requests.get(url, timeout=10)
        resp.raise_for_status()
        return resp.json()
    except Exception as e:
        print(f"获取{city}天气失败: {e}")
        return None


def parse_weather(data):
    """解析并提取关键天气信息"""
    if not data:
        return None
    
    # 当前天气
    curr = data.get("current_condition", [{}])[0]
    current_weather = {
        "temperature": f"{curr.get('temp_C', '?')}°C",
        "feels_like": f"{curr.get('FeelsLikeC', '?')}°C",
        "description": curr.get("weatherDesc", [{}])[0].get("value", "未知"),
        "humidity": f"{curr.get('humidity', '?')}%",
        "wind_speed": f"{curr.get('windspeedKmph', '?')}km/h",
        "wind_dir": curr.get("winddir16Point", "?"),
        "visibility": f"{curr.get('visibility', '?')}km",
        "uv_index": curr.get("uvIndex", "?"),
    }
    
    # 今日天气预报
    today = data.get("weather", [{}])[0]
    today_forecast = {
        "date": today.get("date", ""),
        "max_temp": f"{today.get('maxtempC', '?')}°C",
        "min_temp": f"{today.get('mintempC', '?')}°C",
        "sunrise": today.get("astronomy", [{}])[0].get("sunrise", ""),
        "sunset": today.get("astronomy", [{}])[0].get("sunset", ""),
    }
    
    return {"current": current_weather, "forecast": today_forecast}


def display_weather(city, parsed):
    """格式化显示天气信息"""
    if not parsed:
        return
    
    c = parsed["current"]
    f = parsed["forecast"]
    
    print("\n" + "="*50)
    print(f"  📍 {city} 天气实况")
    print("="*50)
    print(f"  🌡️  温度: {c['temperature']} (体感 {c['feels_like']})")
    print(f"  ☁️  天气: {c['description']}")
    print(f"  💧 湿度: {c['humidity']}")
    print(f"  🌬️  风: {c['wind_speed']} {c['wind_dir']}")
    print(f"  👁️  能见度: {c['visibility']}")
    print(f"  ☀️ UV指数: {c['uv_index']}")
    print("-"*50)
    print(f"  📅 今日 ({f['date']})")
    print(f"  🔺 最高: {f['max_temp']}  🔻 最低: {f['min_temp']}")
    print(f"  🌅 日出: {f['sunrise']}  🌇 日落: {f['sunset']}")
    print("="*50 + "\n")


# 使用示例
data = fetch_weather("Beijing")
parsed = parse_weather(data)
display_weather("北京", parsed)
```

> 这段代码展示了完整的API数据提取流程：fetch_weather()负责网络请求和错误处理，parse_weather()负责从复杂的嵌套JSON结构中提取所需字段（使用get()方法配合默认值防KeyError），display_weather()负责格式化输出。JSON数据通常有多层嵌套结构，用get("key",[{}])[0]的模式安全地深入访问嵌套字段。将职责分离为三个函数使代码清晰易维护。

### argparse 命令行参数与交互菜单

```python
import argparse
import sys
import requests

# ===== argparse 命令行参数解析 =====
parser = argparse.ArgumentParser(
    description="命令行天气查询工具",
    formatter_class=argparse.RawDescriptionHelpFormatter,
    epilog="示例: python weather.py Beijing --days 3"
)

# 位置参数（必填）
parser.add_argument(
    "city", 
    help="要查询的城市名称（英文）"
)

# 可选参数
parser.add_argument(
    "-d", "--days", 
    type=int, 
    default=1,
    help="预报天数 (默认1)"
)
parser.add_argument(
    "-u", "--unit",
    choices=["C", "F"],
    default="C",
    help="温度单位 (默认C)"
)
parser.add_argument(
    "-j", "--json",
    action="store_true",
    help="输出原始JSON"
)

args = parser.parse_args()
# 命令行用法: python weather.py Beijing -d 3 -u C


# ===== 交互式菜单模式 =====
def show_menu():
    """显示主菜单"""
    print("\n" + "╔" + "═"*40 + "╗")
    print("║" + "  🌤️  Python 天气查询工具".center(38) + "║")
    print("╠" + "═"*40 + "╣")
    print("║  1. 查询天气（输入城市名）".ljust(41) + "║")
    print("║  2. 常用城市快捷查询".ljust(41) + "║")
    print("║  3. 显示帮助".ljust(41) + "║")
    print("║  0. 退出程序".ljust(41) + "║")
    print("╚" + "═"*40 + "╝")

QUICK_CITIES = {
    "1": "Beijing",
    "2": "Shanghai",
    "3": "Guangzhou",
    "4": "Shenzhen",
    "5": "Tokyo",
}

def query_weather(city):
    """查询并展示天气"""
    url = f"https://wttr.in/{city}?format=j1&lang=zh"
    try:
        data = requests.get(url, timeout=8).json()
        curr = data["current_condition"][0]
        print(f"\n📍 {city}")
        print(f"  温度: {curr['temp_C']}°C | 体感: {curr['FeelsLikeC']}°C")
        print(f"  天气: {curr['weatherDesc'][0]['value']}")
        print(f"  湿度: {curr['humidity']}% | 风: {curr['windspeedKmph']}km/h")
    except Exception as e:
        print(f"❌ 查询失败: {e}")

def interactive_mode():
    """交互式主循环"""
    while True:
        show_menu()
        choice = input("请选择 [0-3]: ").strip()
        
        if choice == "0":
            print("👋 再见!")
            break
        elif choice == "1":
            city = input("输入城市名: ").strip()
            if city:
                query_weather(city)
        elif choice == "2":
            print("\n快捷城市:")
            for k, v in QUICK_CITIES.items():
                print(f"  {k}. {v}")
            sub = input("选择编号: ").strip()
            if sub in QUICK_CITIES:
                query_weather(QUICK_CITIES[sub])
        elif choice == "3":
            parser.print_help()
        else:
            print("❓ 无效选择，请重新输入")

# 启动交互模式
if __name__ == "__main__":
    # 如果提供了命令行参数则用参数模式
    if len(sys.argv) > 1:
        query_weather(args.city)
    else:
        # 否则进入交互菜单
        interactive_mode()
```

> argparse是Python标准库的命令行解析神器。ArgumentParser定义参数说明，add_argument()添加位置参数（必填）和可选参数（--flag）。choices限制取值范围，action="store_true"定义布尔开关。sys.argv获取原始命令行参数列表。交互模式用while True循环+input()构建菜单系统，每轮show_menu()展示选项，根据用户输入分支处理。if __name__ == "__main__"是Python惯用法——确保脚本被直接运行时才执行入口代码，被import时不会触发。两种模式共存：有命令行参数走参数模式，否则进交互菜单。

