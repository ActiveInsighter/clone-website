import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Card } from "@/components/ui/card"

export function DestinationCard({ href, title, description }: { href: string; title: string; description?: string }) {
  return (
    <Card className="rounded-2xl border border-white/12 bg-white/[0.045] p-0 text-white ring-0 transition-colors hover:border-white/30 hover:bg-white/[0.09]">
      <Link href={href} className="group flex min-h-44 flex-col justify-between gap-6 p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/70">
        <div className="flex items-start justify-between gap-4">
          <span className="text-xl font-medium tracking-[-0.02em]">{title}</span>
          <ArrowUpRight aria-hidden="true" className="size-5 shrink-0 text-white/45 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
        </div>
        <span className="text-sm text-white/45">{description || href}</span>
      </Link>
    </Card>
  )
}
