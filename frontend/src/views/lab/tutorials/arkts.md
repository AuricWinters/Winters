---
id: arkts
name: ArkTS
icon: A
version: '3.x'
description: 鸿蒙应用开发语言，基于TypeScript
---

## Hello World <!-- tutorial-id: arkts-hello | icon: 👋 | difficulty: beginner -->
ArkTS基础，学习声明式UI

### 基本组件结构

```typescript
// @Entry - 装饰器：标记页面入口组件
// @Component - 装饰器：标记自定义组件
// struct - 关键字：定义组件结构（类似 class）
@Entry
@Component
struct Index {
    // @State - 状态装饰器：组件内的响应式状态变量
    // 状态变化时 UI 自动重新渲染
    @State message: string = 'Hello World'

    // build() 方法：描述 UI 结构（必须实现）
    build() {
        // Row - 行容器：水平排列子组件
        Row() {
            // Column - 列容器：垂直排列子组件
            Column() {
                // Text - 文本组件
                Text(this.message)
                    .fontSize(50)           // 链式调用设置字号
                    .fontWeight(FontWeight.Bold) // 设置字重为粗体
                    .fontColor('#333333')   // 设置字体颜色
            }
            .width('100%')             // Column 占满父容器宽度
            .height('100%')            // Column 占满父容器高度
        }
        .height('100%')               // Row 占满屏幕高度
    }
}
```

> ArkTS 是 HarmonyOS 的声明式 UI 框架。@Entry 标记页面入口，@Component 标记自定义组件，struct 定义组件结构体。build() 方法内用声明式语法描述 UI 层级：Row(行)和Column(列)是基础布局容器，Text 显示文本。.fontSize()、.fontWeight() 是链式 API 设置样式属性。

### 常用基础组件

```typescript
@Entry
@Component
struct DemoPage {
    @State title: string = 'ArkTS 组件演示'
    @State count: number = 0
    @State isOn: boolean = false

    build() {
        Column() {
            // Text 文本组件
            Text(this.title)
                .fontSize(24)
                .fontWeight(FontWeight.Bold)
                .margin({ bottom: 20 })

            // Image 图片组件
            Image($r('app.media.icon'))
                .width(100)
                .height(100)
                .borderRadius(12)

            // Button 按钮组件
            Button('点击 +1')
                .type(ButtonType.Capsule)  // 胶囊按钮
                .onClick(() => {
                    this.count++           // 修改 @State 触发刷新
                })

            // Text 显示计数
            Text('计数: ${this.count}')
                .fontSize(18)
                .margin({ top: 10 })

            // Toggle 开关组件
            Toggle({ type: ToggleType.Switch, isOn: this.isOn })
                .onChange((isOn: boolean) => {
                    this.isOn = isOn       // 更新开关状态
                })
        }
        .width('100%')
        .padding(20)
    }
}
```

> ArkTS 提供丰富的内置组件：Text 文本、Image 图片、Button 按钮、Toggle 开关等。每个组件通过链式 API 设置属性（.width/.height/.fontSize/.margin 等）。Button 的 onClick 回调处理点击事件，Toggle 的 onChange 回调处理状态切换。@State 变量变化会自动驱动 UI 更新。

### 样式与布局属性

```typescript
@Entry
@Component
struct StyleDemo {
    build() {
        Column() {
            // 尺寸与间距
            Text('尺寸示例')
                .width(200)              // 宽度 200vp
                .height(60)              // 高度 60vp
                .padding({               // 内边距
                    left: 16,
                    right: 16,
                    top: 8,
                    bottom: 8
                })
                .margin({ top: 10 })     // 外边距

            // 边框与圆角
            Text('边框圆角')
                .border({
                    width: 2,            // 边框宽度
                    color: '#7C3AED',   // 边框颜色
                    style: BorderStyle.Solid // 实线边框
                })
                .borderRadius(12)        // 圆角半径
                .backgroundColor('#F3E8FF') // 背景色

            // 对齐方式
            Row() {
                Text('左对齐')
                Text('居中')
                Text('右对齐')
            }
            .justifyContent(FlexAlign.SpaceAround) // 主轴均匀分布
            .width('100%')

            // Flex 弹性布局
            Column() {
                Text('弹性项1').layoutWeight(1).backgroundColor('#ddd')
                Text('弹性项2').layoutWeight(2).backgroundColor('#ccc')
            }
            .width('100%')
            .height(150)
        }
        .width('100%')
        .padding(20)
    }
}
```

> ArkTS 中尺寸单位使用 vp（虚拟像素），自动适配不同屏幕密度。padding 控制内容区内边距，margin 控制外边距。border 设置边框样式，borderRadius 设圆角。Row/Column 通过 justifyContent/alignItems 控制子元素对齐方式。layoutWeight 实现弹性布局按比例分配空间。

## 状态管理 <!-- tutorial-id: arkts-state | icon: 📦 | difficulty: beginner -->
@State/@Prop/@Link/@Provide/@Consume等装饰器

### @State 组件内部状态

```typescript
@Entry
@Component
struct CounterPage {
    // @State - 组件内部的状态变量
    // 当值发生变化时，引用该变量的 UI 会自动更新
    @State count: number = 0
    @State message: string = ''

    build() {
        Column() {
            Text('计数器: ${this.count}')
                .fontSize(32)
                .fontWeight(FontWeight.Bold)

            // 按钮组
            Row() {
                Button('-1')
                    .type(ButtonType.Capsule)
                    .onClick(() => {
                        if (this.count > 0) {
                            this.count--
                            this.message = '减少了 1'
                        }
                    })

                Button('+1')
                    .type(ButtonType.Capsule)
                    .onClick(() => {
                        this.count++
                        this.message = '增加了 1, 当前值: ${this.count}'
                    })
            }
            .gap(10)                     // 子元素间距
            .margin({ top: 20 })

            // 显示操作消息
            if (this.message.length > 0) {
                Text(this.message)
                    .fontSize(14)
                    .fontColor('#666666')
                    .margin({ top: 10 })
            }

            Button('重置')
                .type(ButtonType.Normal)
                .onClick(() => {
                    this.count = 0
                    this.message = '已重置'
                })
                .margin({ top: 20 })
        }
        .width('100%')
        .padding(30)
    }
}
```

> @State 是最基础的状态装饰器，用于组件内部的响应式变量。当 @State 变量被修改时，所有依赖它的 UI 节点会自动重新渲染。这是 ArkTS 响应式系统的核心机制——数据驱动视图更新，无需手动操作 DOM。if 条件渲染根据状态值动态显示/隐藏组件。

### @Prop 父子单向数据传递

```typescript
// ========== 子组件 - 接收父组件传入的数据 ==========
@Component
struct UserCard {
    // @Prop - 单向数据传递（父→子）
    // 子组件可以读取但不能直接修改父组件的值
    @Prop userName: string = ''
    @Prop userAge: number = 0

    build() {
        Column() {
            Text('👤 ${this.userName}')
                .fontSize(20)
                .fontWeight(FontWeight.Bold)

            Text('年龄: ${this.userAge} 岁')
                .fontSize(14)
                .fontColor('#888888')
        }
        .padding(16)
        .backgroundColor('#F5F5F5')
        .borderRadius(12)
        .alignItems(HorizontalAlign.Start)
    }
}

// ========== 父组件 - 向子组件传递数据 ==========
@Entry
@Component
struct PropDemoPage {
    @State users: Array<{ name: string; age: number }> = [
        { name: '小明', age: 25 },
        { name: '小红', age: 23 },
        { name: '小刚', age: 28 }
    ]

    build() {
        Column() {
            Text('用户列表 (@Prop 单向传值)')
                .fontSize(22)
                .fontWeight(FontWeight.Bold)
                .margin({ bottom: 20 })

            // ForEach 循环渲染 UserCard 子组件
            // 通过属性传递数据给子组件
            ForEach(this.users, (user) => {
                UserCard({ userName: user.name, userAge: user.age })
            }, (user) => user.name)
        }
        .width('100%')
        .padding(20)
    }
}
```

> @Prop 实现父子组件间的单向数据流：父组件通过属性传递数据给子组件，子组件只能读取不能直接修改。这种单向数据流使数据流向清晰可追踪。ForEach 用于循环渲染列表，将数组中的每项数据传递给子组件实例。每个子组件接收独立的 prop 值副本。

### @Link 双向绑定 & @Provide/@Consume 跨层级

```typescript
// ========== @Link 双向绑定 ==========
@Component
struct ScoreEditor {
    // @Link - 双向数据绑定
    // 子组件修改该值会同步到父组件！
    @Link score: number

    build() {
        Row() {
            Button('-5').onClick(() => { this.score -= 5 })
            Text('${this.score}分')
                .fontSize(24)
                .width(80)
                .textAlign(TextAlign.Center)
            Button('+5').onClick(() => { this.score += 5 })
        }
        .justifyContent(FlexAlign.SpaceAround)
        .width('100%')
    }
}

// ========== @Provide/@Consume 跨层级传递 ==========
// 无需逐层传递，后代组件可直接访问
@Component
struct GrandChild {
    // @Consume - 消费祖先提供的 @Provide 数据
    @Consume themeColor: string

    build() {
        Text('孙组件')
            .fontSize(16)
            .fontColor(this.themeColor)
    }
}

@Component
struct Child {
    build() {
        Column() {
            Text('子组件')
            GrandChild()  // 孙组件自动获得 themeColor
        }
    }
}

// ========== 页面根组件 ==========
@Entry
@Component
struct StateAdvancedDemo {
    @State score: number = 75

    // @Provide - 向所有后代组件提供数据
    @Provide themeColor: string = '#7C3AED'

    build() {
        Column() {
            Text('@Link 双向绑定示例')
                .fontSize(20)
                .fontWeight(FontWeight.Bold)

            // 用 $ 语法创建双向绑定
            ScoreEditor({ score: $score })

            Text('当前分数: ${this.score}')
                .fontSize(18)
                .margin({ top: 15 })

            Divider().margin({ vertical: 20 })

            Text('@Provide/@Consume 跨层级示例')
                .fontSize(20)
                .fontWeight(FontWeight.Bold)

            Child()
        }
        .width('100%')
        .padding(20)
    }
}
```

> @Link 实现父子间双向绑定：用 $score 语法创建链接，子组件修改值会同步回父组件。@Provide/@Consume 解决跨层级数据共享问题：祖先组件用 @Provide 提供数据，任意层级的后代用 @Consume 直接消费，无需层层传递 props。这三种装饰器覆盖了 ArkTS 状态管理的核心场景。

## 条件与列表渲染 <!-- tutorial-id: arkts-render | icon: 🔀 | difficulty: beginner -->
If/ForEach实现动态UI

### If/Else 条件渲染

```typescript
@Entry
@Component
struct ConditionalRender {
    @State isLoggedIn: boolean = false
    @State username: string = ''
    @State userType: string = 'normal' // normal / vip

    build() {
        Column() {
            // If/Else 分支渲染 - 根据条件显示不同 UI
            if (this.isLoggedIn) {
                // 已登录状态
                Column() {
                    Text('欢迎回来, ${this.username}! 🎉')
                        .fontSize(22)
                        .fontWeight(FontWeight.Bold)

                    // 嵌套条件判断用户类型
                    if (this.userType === 'vip') {
                        Text('✨ VIP 尊享会员')
                            .fontColor('#D97706')
                            .fontSize(16)
                    } else {
                        Text('普通会员')
                            .fontColor('#666666')
                            .fontSize(16)
                    }

                    Button('退出登录')
                        .type(ButtonType.Normal)
                        .onClick(() => {
                            this.isLoggedIn = false
                        })
                        .margin({ top: 15 })
                }
            } else {
                // 未登录状态
                Column() {
                    Text('请先登录')
                        .fontSize(20)
                        .fontColor('#999999')

                    Button('立即登录')
                        .type(ButtonType.Capsule)
                        .onClick(() => {
                            this.isLoggedIn = true
                            this.username = '访客用户'
                        })
                        .margin({ top: 15 })
                }
            }
        }
        .width('100%')
        .padding(40)
        .alignItems(HorizontalAlign.Center)
    }
}
```

> If/Else 是 ArkTS 的条件渲染机制，根据状态值决定渲染哪个分支的 UI。与 show/hide 不同的是，If 为 false 时组件不会创建（节省资源），而 hide 只是隐藏但仍然占用空间。支持嵌套 If 判断复杂条件。条件变化时会销毁旧分支组件并创建新分支组件。

### ForEach 列表渲染

```typescript
interface TodoItem {
    id: number
    title: string
    completed: boolean
}

@Entry
@Component
struct ListRenderDemo {
    // 待办事项数据
    @State todos: TodoItem[] = [
        { id: 1, title: '学习 ArkTS 基础', completed: true },
        { id: 2, title: '掌握状态管理', completed: true },
        { id: 3, title: '练习自定义组件', completed: false },
        { id: 4, title: '完成综合项目', completed: false },
    ]

    build() {
        Column() {
            Text('待办事项列表')
                .fontSize(22)
                .fontWeight(FontWeight.Bold)
                .margin({ bottom: 16 })

            List({ space: 10 }) {
                // ForEach 三参数形式:
                // 1. 数据数组  2. 生成函数(item) => UI  3. key生成器
                ForEach(
                    this.todos,
                    (item: TodoItem) => {
                        ListItem() {
                            Row() {
                                // 完成状态图标
                                Text(item.completed ? '✅' : '⬜')
                                    .fontSize(20)

                                Text(item.title)
                                    .fontSize(16)
                                    .decoration(
                                        item.completed
                                            ? { type: TextDecorationType.LineThrough }
                                            : { type: TextDecorationType.None }
                                    )
                                    .fontColor(
                                        item.completed ? '#999999' : '#333333'
                                    )

                                Blank() // 占位符，将后续内容推到右侧

                                // 删除按钮
                                Text('删除')
                                    .fontColor('#EF4444')
                                    .fontSize(14)
                                    .onClick(() => {
                                        this.todos = this.todos.filter(
                                            t => t.id !== item.id
                                        )
                                    })
                            }
                            .width('100%')
                            .padding(12)
                            .backgroundColor('#FAFAFA')
                            .borderRadius(8)
                        }
                    },
                    // key 生成器 - 必须唯一且稳定
                    (item: TodoItem) => item.id.toString()
                )
            }
            .width('100%')
            .layoutWeight(1)

            Text('共 ${this.todos.length} 项, 已完成 ${this.todos.filter(t => t.completed).length} 项')
                .fontSize(14)
                .fontColor('#888888')
        }
        .width('100%')
        .padding(20)
    }
}
```

> ForEach 是 ArkTS 的列表渲染指令，三个参数分别是：数据源数组、item→UI 的生成函数、key 生成器函数。key 生成器必须返回稳定唯一的字符串，用于高效地追踪列表项变化（增删改排序）。ListItem 是 List 的专用子项容器。filter/map/reduce 等 JS 数组方法在 ArkTS 中同样可用。

### show/hide 与可见性控制

```typescript
@Entry
@Component
struct VisibilityDemo {
    @State showDetail: boolean = false
    @State isLoading: boolean = true

    aboutToAppear(): void {
        // 模拟异步加载
        setTimeout(() => {
            this.isLoading = false
        }, 2000)
    }

    build() {
        Column() {
            Text('显示/隐藏控制示例')
                .fontSize(20)
                .fontWeight(FontWeight.Bold)

            Button(this.showDetail ? '隐藏详情' : '显示详情')
                .type(ButtonType.Capsule)
                .onClick(() => {
                    this.showDetail = !this.showDetail
                })
                .margin({ top: 15, bottom: 15 })

            // 方式一：show/hide - 组件始终存在，仅控制可见性
            Column() {
                Text('这是详情内容区域')
                    .fontSize(16)
                Text('show/hide 控制的组件仍占据布局空间')
                    .fontSize(13)
                    .fontColor('#888888')
            }
            .width('100%')
            .padding(16)
            .backgroundColor('#EFF6FF')
            .borderRadius(8)
            .visibility(this.showDetail ? Visibility.Visible : Visibility.Hidden)

            Divider()

            // 方式二：If 条件渲染 - 不需要时不创建组件
            if (this.isLoading) {
                LoadingProgress()
                    .width(40)
                    .height(40)
                    .color('#7C3AED')
                Text('加载中...')
                    .fontSize(14)
                    .fontColor('#888888')
                    .margin({ top: 8 })
            } else {
                Text('✅ 内容加载完成!')
                    .fontSize(16)
                    .fontColor('#059669')
            }

            Text('提示: If 不需要时不创建组件；Hidden 仍占位')
                .fontSize(12)
                .fontColor('#AAAAAA')
                .margin({ top: 20 })
        }
        .width('100%')
        .padding(20)
    }
}
```

> 控制组件可见性有两种方式：① visibility(Visible/Hidden/None) — Hidden 时组件不可见但仍占布局空间，None 时不占空间；② If 条件渲染 — 条件为 false 时根本不创建组件节点，适合不需要的内容（如加载状态）。LoadingProgress 是系统内置的加载动画组件。aboutToAppear 是组件生命周期钩子，在组件即将出现时调用。

## 自定义组件 <!-- tutorial-id: arkts-component | icon: ⚙️ | difficulty: intermediate -->
@Builder/@Styles/@Extend复用UI代码

### @Builder 轻量复用函数

```typescript
@Entry
@Component
struct BuilderDemo {
    @State items: string[] = ['首页', '消息', '发现', '我的']

    // @Builder - 轻量级 UI 复用函数
    // 可在多个地方重复调用相同的 UI 片段
    @Builder
    TabBarItem(title: string, isActive: boolean) {
        Column() {
            Text(isActive ? '●' : '○')
                .fontSize(20)
                .fontColor(isActive ? '#7C3AED' : '#999999')
            Text(title)
                .fontSize(11)
                .fontColor(isActive ? '#7C3AED' : '#999999')
                .margin({ top: 2 })
        }
        .layoutWeight(1)
        .height(56)
        .justifyContent(FlexAlign.Center)
        .onClick(() => {
            console.log('点击了 ${title}')
        })
    }

    // @Builder 支持无参快捷写法
    @Builder
    SectionHeader(text: string) {
        Text(text)
            .fontSize(18)
            .fontWeight(FontWeight.Bold)
            .width('100%')
            .padding({ left: 16, right: 16, bottom: 8 })
    }

    build() {
        Column() {
            this.SectionHeader('底部导航栏示例')

            // 使用 @Builder 构建的导航栏
            Row() {
                ForEach(['首页', '消息', '发现', '我的'],
                    (item: string, index: number) => {
                        this.TabBarItem(item, index === 0)
                    }
                )
            }
            .width('100%')
            .backgroundColor('#FFFFFF')
            .shadow({ radius: 8, color: '#00000020' })

            Divider().margin({ vertical: 20 })

            this.SectionHeader('卡片列表')

            ForEach(['推荐', '热门', '最新'], (title: string) => {
                Column() {
                    Text('${title} 内容区域').fontSize(14)
                }
                .width('100%')
                .height(80)
                .backgroundColor('#F5F5F5')
                .borderRadius(8)
                .margin({ bottom: 10 })
            })
        }
        .width('100%')
        .height('100%')
        .padding(20)
    }
}
```

> @Builder 装饰器将一段 UI 代码封装成可复用的轻量函数。可以在同一组件内多次调用，传入不同参数生成略有差异的 UI。适合封装重复的小型 UI 片段（如列表项、卡片、标签）。注意 @Builder 仅限于当前组件内使用，如果需要在多个组件间复用应使用独立 struct 组件或 @Styles/@Extend。

### @Styles 抽取通用样式

```typescript
@Entry
@Component
struct StylesDemo {
    @State cards: Array<{
        title: string
        desc: string
        color: string
    }> = [
        { title: 'ArkTS 入门', desc: '学习声明式 UI 基础', color: '#EEF2FF' },
        { title: '状态管理', desc: '掌握 @State/@Link 等装饰器', color: '#F0FDF4' },
        { title: '网络请求', desc: '学会 HTTP 请求与数据处理', color: '#FEF2F2' },
    ]

    // @Styles - 抽取通用样式属性集合
    // 可在当前组件内任意位置通过 .styleName() 调用
    @Styles
    function cardStyle() {
        .width('100%')
        .padding(16)
        .borderRadius(12)
        .shadow({ radius: 4, color: '#00000010', offsetX: 0, offsetY: 2 })
    }

    @Styles
    function titleStyle() {
        .fontSize(17)
        .fontWeight(FontWeight.Bold)
        .fontColor('#1F2937')
    }

    @Styles
    function descStyle() {
        .fontSize(13)
        .fontColor('#6B7280')
        .margin({ top: 6 })
    }

    build() {
        Column() {
            Text('样式复用示例 (@Styles)')
                .fontSize(20)
                .fontWeight(FontWeight.Bold)
                .margin({ bottom: 20 })

            ForEach(this.cards, (card) => {
                Column() {
                    Text(card.title)
                        .titleStyle()     // 应用抽取的标题样式

                    Text(card.desc)
                        .descStyle()     // 应用抽取的描述样式
                }
                .cardStyle()           // 应用抽取的卡片样式
                .backgroundColor(card.color)
                .margin({ bottom: 12 })
            }, (card) => card.title)
        }
        .width('100%')
        .padding(20)
    }
}
```

> @Styles 将一组通用样式属性封装成可复用的样式函数。定义后可在当前组件中任何元素上通过 .styleName() 链式调用。好处是：统一管理样式确保一致性、减少重复代码、修改一处全局生效。@Styles 只能封装通用属性（不含事件回调）。如果需要扩展特定组件的独有属性，使用 @Extend。

### @Extend 扩展原生组件 & 自定义 struct 组件

```typescript
// ========== @Extend - 扩展特定组件类型的样式 ==========
// 只能作用于指定类型（这里是 Text）
@Extend(Text)
function fancyText() {
    .fontSize(16)
    .fontColor('#4B5563')
    .lineHeight(22)
}

@Extend(Button)
function primaryButton() {
    .type(ButtonType.Capsule)
    .backgroundColor('#7C3AED')
    .fontColor('#FFFFFF')
    .height(40)
    .padding({ left: 20, right: 20 })
}

// ========== 自定义 struct 组件 ==========
@Component
struct ProductCard {
    // 组件属性（非状态变量，由外部传入）
    private productName: string = ''
    private price: number = 0
    private imageUrl: string = ''

    build() {
        Column() {
            // 产品图片占位
            Column() {
                Text('📦')
                    .fontSize(36)
            }
            .width('100%')
            .height(120)
            .backgroundColor('#F3F4F6')
            .borderRadius({ topLeft: 8, topRight: 8 })

            Column() {
                Text(this.productName)
                    .fancyText()         // 使用 @Extend 扩展样式
                    .maxLines(1)
                    .textOverflow({ overflow: TextOverflow.Ellipsis })

                Text('¥${this.price.toFixed(2)}')
                    .fancyText()
                    .fontColor('#DC2626')
                    .fontWeight(FontWeight.Bold)
                    .margin({ top: 6 })
            }
            .width('100%')
            .padding(12)
            .alignItems(HorizontalAlign.Start)
        }
        .width('48%')
        .backgroundColor('#FFFFFF')
        .borderRadius(8)
        .shadow({ radius: 3, color: '#00000015' })
    }
}

// ========== 页面主组件 ==========
@Entry
@Component
struct ComponentDemo {
    build() {
        Column() {
            Text('产品展示')
                .fontSize(22)
                .fontWeight(FontWeight.Bold)
                .margin({ bottom: 20 })

            // 使用自定义 ProductCard 组件
            Row() {
                ProductCard({
                    productName: '无线蓝牙耳机',
                    price: 299.00,
                    imageUrl: ''
                })

                ProductCard({
                    productName: '智能手表 Pro',
                    price: 1599.00,
                    imageUrl: ''
                })
            }
            .justifyContent(FlexAlign.SpaceBetween)
            .width('100%')

            Button('立即购买')
                .primaryButton()        // 使用 @Extend 扩展样式
                .margin({ top: 25 })
                .width('100%')
        }
        .width('100%')
        .padding(20)
    }
}
```

> @Extend 扩展特定原生组件（如 Text/Button）的样式能力，可在全局任意位置使用，不受组件边界限制。自定义 struct + @Component 创建真正的独立可复用组件，有私有属性和完整生命周期。ProductCard 示例展示了如何构建带图片、名称、价格的电商卡片组件。组合使用 @Extend（细粒度样式）+ @Component（结构化组件）是 ArkTS 复用的最佳实践。

## 页面路由与导航 <!-- tutorial-id: arkts-router | icon: 📚 | difficulty: intermediate -->
router.push/router.back页面跳转

### 页面跳转 router.pushUrl

```typescript
import router from '@ohos.router'

@Entry
@Component
struct HomePage {
    @State userName: string = '小明'

    // 跳转到详情页并携带参数
    navigateToDetail(articleId: number): void {
        // pushUrl 导航到新页面（保留当前页面在栈中）
        router.pushUrl({
            url: 'pages/ArticleDetail',  // 目标页面路径
            params: {                   // 传递参数对象
                id: articleId,
                fromUser: this.userName
            }
        }).then(() => {
            console.log('跳转成功')
        }).catch((err: Error) => {
            console.error('跳转失败: ${err.message}')
        })
    }

    build() {
        Column() {
            Text('首页')
                .fontSize(24)
                .fontWeight(FontWeight.Bold)
                .margin({ bottom: 20 })

            // 文章列表
            ForEach([
                { id: 1, title: 'ArkTS 入门指南' },
                { id: 2, title: '状态管理详解' },
                { id: 3, title: '动画与过渡效果' }
            ], (article) => {
                Row() {
                    Text(article.title)
                        .fontSize(16)
                        .layoutWeight(1)
                    Text('>')
                        .fontColor('#CCCCCC')
                }
                .width('100%')
                .padding(16)
                .backgroundColor('#FAFAFA')
                .borderRadius(8)
                .margin({ bottom: 10 })
                .onClick(() => this.navigateToDetail(article.id))
            }, (article) => article.id.toString())
        }
        .width('100%')
        .padding(20)
    }
}
```

> router.pushUrl() 将新页面压入导航栈，保留当前页面以便返回。url 参数指向目标页面路径（需在 main_pages.json 中注册）。params 对象用于向目标页传递数据，可以是任意 JSON 兼容的对象。pushUrl 返回 Promise，可用 then/catch 处理成功和失败。这是 ArkTS 中最常用的页面导航方式。

### 返回上一页与参数获取

```typescript
import router from '@ohos.router'

@Entry
@Component
struct DetailPage {
    // 存储从上一个页面传来的参数
    private articleId: number = 0
    private fromUser: string = ''

    // 组件出现前获取路由参数
    aboutToAppear(): void {
        const params = router.getParams() as Record<string, Object> | null
        if (params) {
            this.articleId = params['id'] as number
            this.fromUser = params['fromUser'] as string
        }
        console.log('文章ID: ${this.articleId}, 来源: ${this.fromUser}')
    }

    // 返回上一页
    goBack(): void {
        // 可以携带返回数据
        router.back({
            url: 'pages/HomePage',
            params: {
                result: '已阅读完毕',
                readAt: new Date().toISOString()
            }
        })
    }

    // 替换当前页面（不保留当前页在栈中）
    replaceToHome(): void {
        router.replaceUrl({
            url: 'pages/HomePage'
        })
    }

    build() {
        Column() {
            // 返回按钮
            Row() {
                Text('← 返回')
                    .fontSize(16)
                    .fontColor('#7C3AED')
                    .onClick(() => this.goBack())
                Blank()
                Text('更多操作')
                    .fontSize(14)
                    .fontColor('#888888')
            }
            .width('100%')
            .margin({ bottom: 20 })

            // 文章详情内容
            Text('文章 #${this.articleId}')
                .fontSize(22)
                .fontWeight(FontWeight.Bold)

            Text("来自用户: ${this.fromUser || '匿名'}")
                .fontSize(14)
                .fontColor('#888888')
                .margin({ top: 8 })

            Divider().margin({ vertical: 20 })

            Text('这里显示文章正文内容...')
                .fontSize(15)
                .lineHeight(24)

            Button('返回首页')
                .type(ButtonType.Capsule)
                .margin({ top: 40 })
                .onClick(() => this.goBack())

            Button('替换当前页')
                .type(ButtonType.Normal)
                .margin({ top: 10 })
                .onClick(() => this.replaceToHome())
        }
        .width('100%')
        .padding(20)
    }
}
```

> router.getParams() 在目标页面获取来源页面传递的参数，通常在 aboutToAppear 生命周期中调用。router.back() 返回上一页（弹出栈顶页面），可选携带返回数据。router.replaceUrl() 替换当前页面而非压栈，适用于登录后跳转主页等不需要返回的场景。路由参数传递基于深拷贝，修改不会影响原页面数据。

### 路由配置 main_pages.json

```typescript
/* ========================================
 * main_pages.json - 路由配置文件
 * 位于 entry/src/main/resources/base/profile/
 * 所有需要导航到的页面都必须在此注册
 * ======================================== */

/*
{
    "src": [
        "pages/Index",           // 首页（默认入口）
        "pages/ArticleDetail",   // 文章详情页
        "pages/UserProfile",     // 用户中心页
        "pages/Login",           // 登录页
        "pages/Settings"         // 设置页
    ],

    "name": "main_pages.json"
}
*/

// ========== 路由模式配置 ==========
import router from '@ohos.router'

@Entry
@Component
struct RouterConfigDemo {

    // Standard 标准模式（默认）：多实例，每次 push 创建新页面
    openStandard(): void {
        router.pushUrl({
            url: 'pages/ArticleDetail',
            params: { id: 1 }
        }, router.RouterMode.Standard)
    }

    // Single 单例模式：如果目标页已在栈中则复用
    openSingle(): void {
        router.pushUrl({
            url: 'pages/UserProfile'
        }, router.RouterMode.Single)
    }

    // 获取当前路由栈信息
    getRouterInfo(): void {
        console.log('当前页面数: ${router.getLength()}')
        console.log('当前页面索引: ${router.getIndex()}')
    }

    // 清空路由栈并跳转（常用于登录成功后）
    clearAndGoHome(): void {
        router.clear()
        router.pushUrl({ url: 'pages/Index' })
    }

    build() {
        Column() {
            Text('路由配置与管理')
                .fontSize(22)
                .fontWeight(FontWeight.Bold)
                .margin({ bottom: 20 })

            Button('Standard 模式跳转')
                .margin({ bottom: 10 })
                .onClick(() => this.openStandard())

            Button('Single 模式跳转')
                .margin({ bottom: 10 })
                .onClick(() => this.openSingle())

            Button('查看路由栈信息')
                .margin({ bottom: 10 })
                .onClick(() => this.getRouterInfo())

            Button('清空栈并回到首页')
                .onClick(() => this.clearAndGoHome())
        }
        .width('100%')
        .padding(20)
    }
}
```

> main_pages.json 是路由注册表，所有可导航页面必须在 src 数组中声明路径。RouterMode.Standard（默认）每次 push 创建新页面实例；RouterMode.Single 则检查栈中是否已有同 URL 页面，有则复用（带回栈顶），避免重复创建。router.getLength() 获取栈深度，getIndex() 获取当前位置，clear() 清空整个栈。正确配置路由模式能有效管理内存和用户体验。

## 综合实战：待办事项App <!-- tutorial-id: arkts-project | icon: 🎯 | difficulty: advanced -->
完整HarmonyOS待办事项应用

### TodoItem 自定义组件

```typescript
// 定义待办事项数据接口
interface TodoData {
    id: number
    text: string
    completed: boolean
    createdAt: string
}

// ========== TodoItem 子组件 - 单个待办项 ==========
@Component
struct TodoItem {
    // Props - 从父组件接收数据
    private todo: TodoData
    private onToggle?: (id: number) => void
    private onDelete?: (id: number) => void

    build() {
        Row() {
            // 完成/未完成切换按钮
            Text(this.todo.completed ? '✅' : '⬜')
                .fontSize(22)
                .onClick(() => {
                    this.onToggle?.(this.todo.id)
                })

            Column() {
                // 待办文字（完成后加删除线）
                Text(this.todo.text)
                    .fontSize(16)
                    .decoration(
                        this.todo.completed
                            ? { type: TextDecorationType.LineThrough }
                            : { type: TextDecorationType.None }
                    )
                    .fontColor(
                        this.todo.completed ? '#9CA3AF' : '#1F2937'
                    )
                    .maxLines(2)
                    .textOverflow({ overflow: TextOverflow.Ellipsis })

                // 创建时间
                Text(this.todo.createdAt)
                    .fontSize(11)
                    .fontColor('#D1D5DB')
                    .margin({ top: 2 })
            }
            .layoutWeight(1)
            .alignItems(HorizontalAlign.Start)
            .margin({ left: 12 })

            // 删除按钮
            Text('🗑️')
                .fontSize(18)
                .onClick(() => {
                    this.onDelete?.(this.todo.id)
                })
        }
        .width('100%')
        .padding(14)
        .backgroundColor('#FFFFFF')
        .borderRadius(10)
        .margin({ bottom: 8 })
        .shadow({ radius: 2, color: '#00000008' })
    }
}
```

> TodoItem 是高度封装的自定义组件，展示单条待办事项。接收 todo 数据对象和两个回调函数（onToggle 切换完成状态、onDelete 删除）。UI 包含：左侧状态切换按钮（✅/⬜）、中间文本区（支持删除线效果和时间戳）、右侧删除按钮。使用 ?. 可选链安全调用可能未传入的回调。maxLines + textOverflow 实现文本溢出省略。

### TodoList 主页面完整实现

```typescript
import router from '@ohos.router'

@Entry
@Component
struct TodoListApp {
    // @StorageLink - 持久化状态，数据变更自动写入 AppStorage
    @StorageLink('todoList') todos: TodoData[] = []

    // 新待办的输入文字
    @State inputText: string = ''

    // 过滤模式: all / active / completed
    @State filterMode: string = 'all'

    // 统计属性（计算属性）
    get activeCount(): number {
        return this.todos.filter(t => !t.completed).length
    }

    get completedCount(): number {
        return this.todos.filter(t => t.completed).length
    }

    // 根据过滤模式筛选显示的待办列表
    get filteredTodos(): TodoData[] {
        switch (this.filterMode) {
            case 'active':
                return this.todos.filter(t => !t.completed)
            case 'completed':
                return this.todos.filter(t => t.completed)
            default:
                return this.todos
        }
    }

    // 添加新待办
    addTodo(): void {
        const text = this.inputText.trim()
        if (text === '') return

        const newTodo: TodoData = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: this.formatDate(new Date())
        }

        this.todos = [newTodo, ...this.todos]  // 新项插入到头部
        this.inputText = ''                      // 清空输入
    }

    // 切换完成状态
    toggleTodo(id: number): void {
        this.todos = this.todos.map(t =>
            t.id === id ? { ...t, completed: !t.completed } : t
        )
    }

    // 删除待办
    deleteTodo(id: number): void {
        this.todos = this.todos.filter(t => t.id !== id)
    }

    // 清除已完成项
    clearCompleted(): void {
        this.todos = this.todos.filter(t => !t.completed)
    }

    // 格式化日期
    formatDate(date: Date): string {
        const m = (date.getMonth() + 1).toString().padStart(2, '0')
        const d = date.getDate().toString().padStart(2, '0')
        const h = date.getHours().toString().padStart(2, '0')
        const min = date.getMinutes().toString().padStart(2, '0')
        return '${m}/${d} ${h}:${min}'
    }

    build() {
        Column() {
            // ====== 头部 ======
            Row() {
                Text('✅ 待办事项')
                    .fontSize(24)
                    .fontWeight(FontWeight.Bold)
                    .fontColor('#1F2937')

                Text('${this.activeCount} 项待完成')
                    .fontSize(13)
                    .fontColor('#7C3AED')
                    .margin({ left: 12 })
            }
            .width('100%')
            .justifyContent(FlexAlign.Start)
            .margin({ bottom: 16 })

            // ====== 输入区域 ======
            Row() {
                TextInput({ placeholder: '添加新的待办事项...', text: this.inputText })
                    .layoutWeight(1)
                    .height(44)
                    .borderRadius(22)
                    .backgroundColor('#F3F4F6')
                    .padding({ left: 16, right: 16 })
                    .onChange((value: string) => {
                        this.inputText = value
                    })
                    .onSubmit(() => this.addTodo())  // 回车提交

                Button('+')
                    .width(44)
                    .height(44)
                    .borderRadius(22)
                    .backgroundColor('#7C3AED')
                    .fontColor('#FFFFFF')
                    .fontSize(20)
                    .fontWeight(FontWeight.Bold)
                    .onClick(() => this.addTodo())
            }
            .width('100%')
            .margin({ bottom: 16 })

            // ====== 过滤标签栏 ======
            Row() {
                this.FilterTab('全部', 'all', this.todos.length)
                this.FilterTab('进行中', 'active', this.activeCount)
                this.FilterTab('已完成', 'completed', this.completedCount)
            }
            .width('100%')
            .margin({ bottom: 12 })

            // ====== 待办列表 ======
            if (this.filteredTodos.length > 0) {
                List({ space: 0 }) {
                    ForEach(this.filteredTodos, (todo: TodoData) => {
                        ListItem() {
                            TodoItem({
                                todo: todo,
                                onToggle: (id: number) => this.toggleTodo(id),
                                onDelete: (id: number) => this.deleteTodo(id)
                            })
                        }
                    }, (todo: TodoData) => todo.id.toString())
                }
                .width('100%')
                .layoutWeight(1)
                .divider({ strokeWidth: 1, color: '#F3F4F6' })
            } else {
                // 空状态提示
                Column() {
                    Text('📝')
                        .fontSize(48)
                    Text(this.filterMode === 'completed'
                        ? '还没有完成的待办哦'
                        : '暂无待办事项，添加一个吧！')
                        .fontSize(15)
                        .fontColor('#9CA3AF')
                        .margin({ top: 12 })
                }
                .layoutWeight(1)
                .justifyContent(FlexAlign.Center)
            }

            // ====== 底部工具栏 ======
            if (this.completedCount > 0) {
                Row() {
                    Text('清除已完成 (${this.completedCount})')
                        .fontSize(13)
                        .fontColor('#EF4444')
                        .onClick(() => this.clearCompleted())
                }
                .width('100%')
                .justifyContent(FlexAlign.Center)
                .padding({ top: 12, bottom: 8 })
            }
        }
        .width('100%')
        .height('100%')
        .padding({ top: 40, left: 20, right: 20, bottom: 20 })
        .backgroundColor('#F9FAFB')
    }

    // 过滤标签子 Builder
    @Builder
    FilterTab(label: string, mode: string, count: number) {
        Text('${label} (${count})')
            .fontSize(13)
            .fontColor(this.filterMode === mode ? '#7C3AED' : '#6B7280')
            .fontWeight(this.filterMode === mode ? FontWeight.Bold : FontWeight.Normal)
            .padding({ horizontal: 14, vertical: 6 })
            .backgroundColor(this.filterMode === mode ? '#EDE9FE' : 'transparent')
            .borderRadius(16)
            .onClick(() => { this.filterMode = mode })
    }
}
```

> 这是一个完整的待办事项应用主页面。核心功能包括：@StorageLink 实现数据持久化到 AppStorage（应用重启后数据仍在）；计算属性 filteredTodos 根据过滤模式动态筛选；addTodo/toggleTodo/deleteTodo/clearCompleted 四大操作方法；TextInput 输入框配合回车提交和按钮提交双触发；FilterTab @Builder 构建可复用的过滤标签；空状态友好提示；底部清除已完成项工具栏。整体展示了 ArkTS 状态管理、列表渲染、条件渲染、自定义组件、@Builder 复用的综合运用。

### 完整数据流与交互逻辑

```typescript
/* ==============================================
 * 待办事项App - 完整架构说明
 * ============================================== */

/*
【数据流架构】

AppStorage (持久化存储)
    │
    ▼
@StorageLink('todoList') todos  ← →  UI 渲染
    │                                  │
    ├── addTodo() ──→ 新增首部插入      │
    ├── toggleTodo() ──→ map 更新状态    │
    ├── deleteTodo() ──→ filter 删除     │
    └── clearCompleted() ──→ 过滤清除    │
                                       ▼
                              自动触发 UI 重绘
*/

// ========== 补充: 页面跳转到统计页 ==========
@Entry
@Component
struct StatsPage {
    @StorageLink('todoList') todos: TodoData[] = []

    build() {
        Column() {
            Row() {
                Text('← 返回')
                    .onClick(() => router.back())
                Blank()
                Text('📊 统计')
                    .fontSize(20)
                    .fontWeight(FontWeight.Bold)
            }
            .width('100%')
            .margin({ bottom: 24 })

            // 统计卡片
            Column() {
                Text('总待办: ${this.todos.length}')
                    .fontSize(28)
                    .fontWeight(FontWeight.Bold)
                    .fontColor('#1F2937')

                Row() {
                    this.StatCard('进行中', this.todos.filter(t => !t.completed).length, '#3B82F6')
                    this.StatCard('已完成', this.todos.filter(t => t.completed).length, '#10B981')
                }
                .width('100%')
                .margin({ top: 20 })

                // 完成率进度条
                Text('完成率')
                    .fontSize(14)
                    .fontColor('#6B7280')
                    .width('100%')
                    .margin({ top: 24, bottom: 8 })

                Row() {
                    Progress({
                        value: this.todos.length > 0
                            ? Math.round((this.todos.filter(t=>t.completed).length / this.todos.length) * 100)
                            : 0,
                        total: 100,
                        type: ProgressType.Ring
                    })
                        .width(120)
                        .height(120)
                        .color('#10B981')
                        .backgroundColor('#E5E7EB')

                    Column() {
                        Text('${this.todos.length > 0
                            ? Math.round((this.todos.filter(t=>t.completed).length / this.todos.length) * 100)
                            : 0}%')
                            .fontSize(28)
                            .fontWeight(FontWeight.Bold)
                        Text('完成率')
                            .fontSize(13)
                            .fontColor('#6B7280')
                    }
                }
                .width('100%')
                .justifyContent(FlexAlign.Center)
            }
            .width('100%')
            .padding(24)
            .backgroundColor('#FFFFFF')
            .borderRadius(16)
        }
        .width('100%')
        .height('100%')
        .padding(20)
        .backgroundColor('#F9FAFB')
    }

    @Builder
    StatCard(label: string, value: number, color: string) {
        Column() {
            Text('${value}')
                .fontSize(32)
                .fontWeight(FontWeight.Bold)
                .fontColor(color)
            Text(label)
                .fontSize(13)
                .fontColor('#6B7280')
                .margin({ top: 4 })
        }
        .layoutWeight(1)
        .padding(16)
        .backgroundColor('#F9FAFB')
        .borderRadius(12)
    }
}

/* 【关键要点总结】

1. @StorageLink vs @State：
   - @State: 组件内临时状态，页面销毁即丢失
   - @StorageLink: 持久化到 AppStorage，跨页面共享

2. 不可变更新原则：
   - this.todos = [newItem, ...this.todos]  ✅ 创建新数组
   - this.todos.push(newItem)               ❌ 直接修改（不触发更新）

3. 性能优化：
   - ForEach 的 key 生成器必须稳定唯一
   - 计算属性避免模板中的复杂逻辑
   - List + ListItem 比 Column + ForEach 更高效

4. 组件化设计：
   - TodoItem: 单一职责，只负责展示一条待办
   - FilterTab: @Builder 轻量复用 UI 片段
   - StatCard: @Builder 参数化统计卡片
*/
```

> 这个综合实战展示了完整的 ArkTS 应用开发流程。核心设计原则：① @StorageLink 实现数据持久化和跨页面共享；② 不可变更新（创建新数组赋值）确保响应式系统正常工作；③ 合理拆分组件（TodoItem 独立组件 + FilterTab/StatCard @Builder）；④ ForEach 配合稳定的 key 生成器保证列表渲染性能。StatsPage 展示了如何从同一个 @StorageLink 数据源读取并展示统计信息，体现了 ArkTS 单向数据流的优雅之处——数据改变自动传播到所有订阅者。

