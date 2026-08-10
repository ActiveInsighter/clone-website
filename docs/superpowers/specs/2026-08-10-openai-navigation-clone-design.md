# OpenAI 中文官网导航与首页复刻设计

## 目标

在不破坏现有 ChatGPT、Studio 和站点注册边界的前提下，重构通用响应式导航，让它表达真实官网的三档布局，并把 OpenAI 中文首页首屏、搜索态、登录菜单和移动导航调整到浏览器取证的结构与节奏。

验收以真实页面行为为准：

- 1200px 及以上：Logo、完整主导航、搜索、登录、试用 ChatGPT；主导航位于左侧，搜索紧随主导航，行动按钮靠最右。
- 900–1199px：Logo、搜索、登录、试用 ChatGPT、菜单按钮；主导航隐藏但行动按钮仍保留。
- 小于 900px：Logo、搜索、菜单按钮；登录和 CTA 进入移动菜单。
- 搜索、桌面 Mega Menu、登录下拉、移动 Sheet 互斥且 Escape 可关闭当前浮层。
- Hero prompt 轮换不改变容器尺寸，文本使用淡出/淡入过渡。
- 首页首屏在桌面、中等宽度和手机宽度均保持官网的纵向节奏与卡片比例。

## 方案

采用“通用状态 + 通用插槽 + 站点主题 CSS”的方案：

1. ResponsiveNavigation 继续拥有桌面菜单、移动 Sheet、Escape 和焦点恢复等通用交互。
2. 在通用组件增加 compactContent 插槽和 onEscape 回调；现有 endContent 行为保持兼容。
3. 新增纯函数 getNavigationViewportMode，把三档阈值集中在可测试的 TypeScript 契约中；CSS 负责实际显示，不在 React 中读取 window.innerWidth。
4. OpenAiTopNav 用同一组可复用 action 节点生成完整桌面、紧凑中等宽度和手机三种 bar，避免重复登录/CTA 结构漂移。
5. 搜索仍是 OpenAI 站点适配层的状态，但由通用导航的 Escape 回调关闭；打开搜索时关闭菜单，打开菜单时关闭搜索。
6. 首页主体继续使用现有真实本地图片和数据驱动卡片，只修正首屏的最大宽度、纵向间距、四分之三与四分之一的 featured grid、三档断点和 prompt 动画。

## 组件边界

### ResponsiveNavigation

- 输入：Logo、导航项、完整桌面 action、紧凑 action、移动 bar action、移动 Sheet 内容、可选 Escape 回调。
- 输出：固定 header、桌面 hover/focus Mega Menu、紧凑 action bar、移动 Sheet。
- 不知道 OpenAI 的文案、颜色或具体链接。
- desktopBreakpoint 表示完整主导航的下限；compactBreakpoint 表示紧凑档与移动档的边界。

### OpenAiTopNav

- 提供 OpenAI Logo、五组真实菜单数据、基金会外链、搜索按钮、登录菜单和试用 CTA。
- 提供官网搜索面板，使用“咨询 OpenAI 研究相关问题”占位文本、底部横线与右侧箭头按钮。
- 提供 OpenAI 移动一级菜单、二级菜单和两个移动行动按钮。

### OpenAiHome

- 只负责页面内容编排和 prompt 轮换状态。
- prompt 文本使用固定高度的 span 层，通过 keyframe 在旧/新文案间切换。
- featured 区域使用 3.17fr 1fr，窄屏改为单列。

## 动画与状态

- Desktop Mega Menu：高度从 0 到内容高度，200ms cubic-bezier(0.4, 0, 0.2, 1)；切换菜单时保持一个共享 panel，不并排挂载多个 panel。
- Search panel：在 header 下方做 opacity/translate 过渡，关闭时不抢焦点；搜索按钮在同一几何位置切换 Search/X。
- Login menu：保留 dropdown 的内容状态，补齐 ChatGPT、API 平台、Codex 三项。
- Mobile Sheet：OpenAI 黑底全宽，从 header 下方出现；一级菜单使用大字号，进入二级菜单显示“首页”返回行，不显示冗余底部关闭行。
- prefers-reduced-motion 下所有过渡降为近似瞬时。

## 兼容性与风险控制

- 不移除 endContent、mobileBarContent 或现有 menuBehavior，旧站点仍可用。
- CSS 使用 data breakpoint 类别，不用 nth-child 决定通用组件布局；OpenAI 菜单宽度仍由站点主题 token 提供。
- 不调整 ChatGPT/Studio 路由和已有 sidebar 代码；本次只改通用导航契约、OpenAI 适配器、OpenAI 首页样式和对应研究/测试文档。
- 真实官网的内容可能随时间更新，本次以 2026-08-10 浏览器采集的结构、尺寸和现有本地资产为准。

## 测试策略

- 纯函数测试三档宽度边界：1199/1200、899/900。
- reducer 继续测试菜单与移动 Sheet 互斥。
- OpenAI 导航契约测试数据：登录包含三项，OpenAI theme 使用三档断点，首页 prompt 列表非空且 featured 数据为 3.17:1 设计。
- 完成后使用同一浏览器在 1440×900、1024×900、768×900、390×844 截图和点击验证，再运行 npm run check。
