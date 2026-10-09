# Reading motion

两个可组合的 React 19 / shadcn 组件：`CursorHighlight` 模拟鼠标逐行选句；`MotionParagraph` 模拟鼠标将文字沿弧线放回原位。根据 OpenAI GPT-6 发布页的实际滚动动画独立实现。无需复制原页、图片或字体。

## 安装

在已初始化的 shadcn 项目中运行：

```bash
npx shadcn@latest add https://clone-website-lab.2212148739lbw.workers.dev/r/reading-motion.json
```

CLI 按 `components.json` 的组件别名安装到 `components/reading-motion/`，含 CSS Module 和辅助文件。也可下载 `reading-motion-kit.tar.gz`，复制 `src/components/reading-motion/` 到项目。依赖为 React 19、clsx、tailwind-merge，后两者通常已随 shadcn 安装。组件本身使用局部 CSS，无需新增全局样式或动画库。支持 Next.js、Vite 等有 CSS Modules 的 React 构建工具，不依赖 Next 的运行时。将文档示例中的 `@/` 替换为你的实际别名。

## 滚动驱动

```tsx
import { CursorHighlight, MotionParagraph } from "@/components/reading-motion"

<p>
  普通正文。
  <CursorHighlight>滚动到这里，鼠标会逐行选中关键句。</CursorHighlight>
  后面的正文继续正常排版。
</p>
<MotionParagraph>
  <p>这段文字从右下方轻微倾斜的位置，被鼠标拉回正文。</p>
</MotionParagraph>
```

`trigger="scroll"` 默认：在组件进入视口底部至抵达视口中部之间跟随滚动进度，上下滚动可逆。选句动作在进度 .2–.8，段落动作 .12–.78。完成后选句保持高亮，段落回到原位，鼠标消失。

## 阅读解析：按钮定位 + 动态选句

```tsx
"use client"
import { useRef } from "react"
import { CursorHighlight, type ReadingMotionHandle } from "@/components/reading-motion"

export function ReadingAnswer() {
  const evidence = useRef<ReadingMotionHandle>(null)
  return <>
    <p>The study found that <CursorHighlight ref={evidence} trigger="manual" active={false}>
      attention mattered more than location.
    </CursorHighlight></p>
    <button onClick={() => evidence.current?.play({ scrollIntoView: true })}>查看解析</button>
  </>
}
```

`play()` 每次从头播放；目标在屏幕外时等待进入可阅读区域再播放。`play({scrollIntoView:true})` 先自动定位。`reset()` 清除并暂停；`finish()` 立即显示最终效果；`scrollIntoView()` 只定位。

也可声明式控制：`trigger="manual" active={isAnswerOpen} playKey={replayCount} autoScroll`。从 false 变为 true 时请求播放，改变 `playKey` 重播，active=false 清除选中。动画内部不通过 React 状态逐帧渲染，回调适合记录状态，避免每帧更新整个文章。

`trigger="visible"` 进入可阅读区域后播放一次；`once={false}` 在离开该区域后复位，下一次进入时重播。`once` 只用于 visible 模式，不锁定 scroll 进度。

## 属性

两组件共用：`trigger`、`active`、`playKey`、`duration=1800`、`delay=0`（毫秒）、`once=true`、`showCursor=true`、`autoScroll=false`、`scrollRoot?: HTMLElement | null`、`onProgress(progress)`、`onComplete()`、`ref`。duration/delay 用于 manual/visible，不影响 scroll。

CursorHighlight：`color="blue" | "green" | "orange"`。可用 `style={{"--reading-motion-highlight":"#abc"} as React.CSSProperties}` 或外部 className 覆盖颜色。完整 span 的 HTML 属性可传入；onProgress 是组件进度回调。

MotionParagraph：`as="div" | "span"`、`offset?:{x:number,y:number}`、`rotation=5`（度）。默认偏移 x=min(110,18vw)、y=24；RTL 方向镜像。div 可包段落，span 可用于标题片段。大段文本请使用 div，避免不合法的段落嵌套。

独立滚动容器：通过 callback ref/state 得到 HTMLElement 并传为 scrollRoot。null/undefined 为页面视口。组件可监听嵌套滚动容器，坐标按根容器的内容视口计算。

## 排版与可访问性

选句内容应为普通文本与内联节点（strong/em/a/br 等）。支持富文本和多行；按 Range.getClientRects 实测每一行，字体加载、内容变化、容器缩放后重新测量。高亮层与鼠标 aria-hidden、pointer-events:none，不改变浏览器的真实 Selection；读者能正常选择复制并操作链接。

段落移动使用 transform，不改变文档流。为偏移留出空间，或者在最外层阅读容器设置 `overflow-x:clip`。大段文字初始倾斜会扩大绘制范围，这是效果的一部分；组件不会给整个宿主网站设置全局 overflow。

系统开启 prefers-reduced-motion 时，滚动动画直接展示最终高亮/原位文字，visible/manual 在可见后立即完成，没有鼠标。聚焦内嵌链接时结束运动，避免交互目标移动。SSR 首屏保留完整正文，无 JS 仍可阅读。所有实例共享一个帧调度器与滚动/字体监听器，卸载会清理；后台标签页停止请求动画帧。

## 维护与导出

```bash
npm run export:reading-motion
node --experimental-strip-types --test tests/reading-motion*.test.ts
npm run test:e2e -- tests/browser/reading-motion.spec.ts
```

导出器生成可编辑源码、ESM、声明文件、文档、许可证、shadcn registry JSON 和 tar.gz。发布前在独立目录严格编译；下载包不是单文件 CDN widget，需要宿主构建工具处理 CSS Modules。

参考：[原效果](https://openai.com/zh-Hans-CN/index/gpt-6-for-everyone/)、[shadcn registry 文件与目标别名](https://ui.shadcn.com/docs/registry/registry-item-json)、[Range.getClientRects](https://developer.mozilla.org/en-US/docs/Web/API/Range/getClientRects)。
