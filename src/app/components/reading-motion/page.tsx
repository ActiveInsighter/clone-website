import type { Metadata } from "next"
import { ReadingMotionGallery } from "./gallery"

export const metadata: Metadata = {
  title: "Reading motion · 让文字动起来",
  description: "可复用的鼠标选句与段落移动组件。体验英语阅读解析、博客滚动动画，一键安装到 shadcn 项目。",
}

export default function ReadingMotionPage() { return <ReadingMotionGallery /> }
