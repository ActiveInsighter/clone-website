import { notFound } from "next/navigation"

import { getCloneSite, getStaticCloneParams } from "@/sites"
import { siteLoaders } from "@/sites/loaders"

type ClonePageProps = {
  params: Promise<{
    siteId: string
    path?: string[]
  }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return getStaticCloneParams()
}

export default async function ClonePage({ params }: ClonePageProps) {
  const { siteId } = await params
  const manifest = getCloneSite(siteId)

  if (!manifest) notFound()

  const { default: SiteComponent } = await siteLoaders[manifest.id]()
  return <SiteComponent />
}
