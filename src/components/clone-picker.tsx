import { ArrowUpRight } from "lucide-react"
import Link from "next/link"

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
            <Link
              className="group flex min-h-44 flex-col justify-between rounded-2xl border border-white/12 bg-white/[0.045] p-5 transition-colors hover:border-white/30 hover:bg-white/[0.09] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              href={item.href}
              key={item.id}
            >
              <div className="flex items-start justify-between gap-4">
                <span className="text-xl font-medium tracking-[-0.02em]">{item.label}</span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-5 text-white/45 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white"
                />
              </div>
              <span className="text-sm text-white/45">{item.href}</span>
            </Link>
          ))}
        </nav>

        <p className="mt-8 text-sm text-white/35">
          开发命令：<code className="text-white/60">npm run dev</code>
        </p>
      </div>
    </main>
  )
}
