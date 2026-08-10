# OpenAI 中文首页行为手册

## 页面状态

目标页面是黑底的 OpenAI 中文首页。顶部导航固定在视口顶部，主体正常纵向滚动，右侧保留浏览器滚动条。导航、搜索、登录下拉和移动菜单都是客户端交互；卡片主体是链接和 hover 状态；Hero prompt 是时间驱动。

## 三档响应式

| 宽度 | 状态 |
| --- | --- |
| 1200px 及以上 | 完整主导航和右侧 action group |
| 900–1199px | 隐藏主导航，保留搜索、登录、CTA、菜单 |
| 899px 及以下 | 隐藏主导航、登录、CTA，只保留搜索和菜单 |

桌面 header 为 72px 高、左右 36px 内边距；紧凑和手机 header 为 61px 高、左右 27px 内边距。

## 导航

- Logo、搜索、菜单的 hit area 稳定为 45px。
- 桌面五个带菜单的一级项使用 hover/focus 打开同一个共享 Mega Menu；打开新项会替换旧项。
- 面板关闭时高度为 0 且不可点击，打开时由 `ResizeObserver` 测量当前内容并以动态 height/opacity 过渡；切换一级项时共享 stage 中的面板内容交叉淡入淡出。
- 一个一级菜单打开时，其他一级项变为 60% 白色。
- Mega Menu 打开时会出现位于页面内容之上的固定 backdrop，使用 `backdrop-filter: blur(12px)`，菜单与 header 保持清晰。
- Escape 关闭面板并把焦点交还给最近一次触发控件。
- 中等宽度使用紧凑 action slot；移动宽度使用手机 action slot，二者不同时显示。

## 搜索

点击搜索后，Search 图标在原位置交叉淡入成 X，不改变按钮几何尺寸，也不产生 active 位移；header 下方常驻的黑色搜索面板用 clip-path 从上向下展开。面板内是大字号“咨询 OpenAI 研究相关问题”输入框、底部横线和圆形箭头提交按钮。输入提交只阻止默认跳转，不伪造后端结果。Escape 关闭搜索。

## 登录

登录按钮是深灰圆角 pill，点击出现同一导航层级内的暗色 popover，项目为 ChatGPT、API 平台、Codex；popover 的 z-index 高于 header 和 Mega Menu，不会被导航栏遮挡。打开菜单时不改变页面滚动位置。

## 移动菜单

点击菜单按钮打开 header 下方的黑色全宽 Sheet。一级菜单是大字号纵向链接；进入子菜单后通过双页 track 横向滑入，显示左箭头和“首页”返回行，随后是分组标题和子链接。底部行动区用横线分隔，显示试用 ChatGPT 和登录；不额外显示一个冗余的关闭行。

## Hero 与卡片

- 标题居中，prompt composer 固定 117px 高、16px 圆角、最大宽度 768px。
- prompt 以固定高度区域轮换，文本淡入，不引起 composer 或 pill 位置跳动。
- 桌面 featured grid 为约 3.17:1 的主卡/副卡列，紧凑和手机改为单列。
- 手机 pill 在 390px 宽度下换为两行居中，而不是横向裁切。
- 真实图片来自 public/images/openai-home；卡片 hover 只做轻微图片缩放和透明度变化。

## 动画降级

prefers-reduced-motion 下 prompt、导航 panel、Sheet 和按钮动画降为近似瞬时，内容仍保持可见和可操作。
