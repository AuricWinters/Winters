# Checklist

- [x] 卡片采用玻璃态设计（blur 24px+, 半透明白色背景 rgba(255,255,255,0.75)）
- [x] 圆角升级至 24px
- [x] 多层柔和阴影（基础阴影 + inset顶部高光 + inset底部阴影 + hover时紫色光晕）
- [x] 边框高光效果（border: 1px solid rgba(255,255,255,0.8)）
- [x] 渐变背景装饰（mesh-gradient伪元素系统）
- [x] 不同项目不同配色方案（5套差异化方案通过nth-child实现）
- [x] 标题字号 >= 1.5rem（实际1.75rem），字重 >= 700（实际800），带letter-spacing
- [x] 描述文字行高 >= 1.6（实际1.7），使用次要色变量
- [x] 技术标签美观紧凑（100px圆角胶囊、半透明背景、backdrop-filter、hover效果）
- [x] 状态标签位置合理（absolute top/right）、样式清晰（100px圆角、backdrop-filter）
- [x] 主按钮具有视觉吸引力（linear-gradient渐变、白字、12px圆角、彩色box-shadow）
- [x] 次按钮风格协调（玻璃态rgba(255,255,255,0.6)、细边框、backdrop-filter）
- [x] hover效果流畅（上浮6px+缩放1.01+多层阴影+顶部3px渐变条+背景缩放1.05）
- [x] 入场动画自然（fadeUp 0.8s + staggered delay 0.1s递增）
- [x] 过渡曲线统一（cubic-bezier 0.16, 1, 0.3, 1）
- [x] 响应式布局正常（桌面auto-fill / 平板2列 / 移动端<768px单列+纵向按钮）
- [x] 整体风格与Lab页面协调一致（统一的设计语言：玻璃态、mesh-gradient、动画曲线）
