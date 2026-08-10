import type { Metadata } from "next"
import { notFound } from "next/navigation"

import "../../../components/navigation/responsive-navigation.css"
import "../../../components/openai-site/openai-navigation.css"
import { getCloneSite } from "@/sites"

type CloneLayoutProps = Readonly<{
  children: React.ReactNode
  params: Promise<Record<string, string | string[] | undefined>>
}>

function getSiteId(params: Record<string, string | string[] | undefined>) {
  return typeof params.siteId === "string" ? params.siteId : ""
}

export async function generateMetadata({ params }: CloneLayoutProps): Promise<Metadata> {
  const siteId = getSiteId(await params)
  const manifest = getCloneSite(siteId)

  if (!manifest) notFound()

  return {
    title: `${manifest.label} Clone`,
    description: `${manifest.label} website replica`,
  }
}

export default async function CloneLayout({ children, params }: CloneLayoutProps) {
  const siteId = getSiteId(await params)
  const manifest = getCloneSite(siteId)

  if (!manifest) notFound()

  return (
    <div className="min-h-full" data-clone-site={manifest.id}>
      {children}
    </div>
  )
}
