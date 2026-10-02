import { DestinationCard } from "@/components/destination-card"

import { getClonePickerItems } from "@/sites"

export function ClonePicker() {
  const items = getClonePickerItems()

  return (
    <main className="min-h-screen bg-[#101010] px-6 py-16 text-white sm:px-10 lg:px-16">
      <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-5xl flex-col justify-center">
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-white/45">
            AI Website Clone Lab
          </p>
          <h1 className="mt-5 text-4xl font-medium tracking-[-0.04em] sm:text-6xl">
            选择要查看的复刻网站
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/60 sm:text-lg">
            所有站点共享同一个 Next.js 开发服务器。打开不同路径即可独立开发和热更新。
          </p>
        </div>

        <nav aria-label="复刻网站" className="mt-12 grid gap-3 sm:grid-cols-3">
          {items.map((item) => (
            <DestinationCard href={item.href} title={item.label} key={item.id} />
          ))}
          <DestinationCard href="/components/evidence" title="Evidence 组件库" description="图表、表格与叙述交互 · 可切换数据和主题" />
        </nav>

        <p className="mt-8 text-sm text-white/35">
          开发命令：<code className="text-white/60">npm run dev</code>
        </p>
      </div>
    </main>
  )
}
