"use client"

import Link from "next/link"

type CloneErrorProps = Readonly<{
  error: Error & { digest?: string }
  reset: () => void
}>

export default function CloneError({ reset }: CloneErrorProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#101010] px-6 text-center text-white">
      <div className="max-w-md">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/45">
          Clone route error
        </p>
        <h1 className="mt-4 text-3xl font-medium tracking-[-0.03em]">
          这个复刻网站暂时无法显示
        </h1>
        <p className="mt-4 text-sm leading-6 text-white/60">
          这次错误被限制在当前站点路径内。可以重试，或返回选择页打开其他站点。
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <button
            className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition-opacity hover:opacity-80"
            onClick={() => reset()}
            type="button"
          >
            重试
          </button>
          <Link
            className="rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-white/50"
            href="/clones"
          >
            返回选择页
          </Link>
        </div>
      </div>
    </main>
  )
}
