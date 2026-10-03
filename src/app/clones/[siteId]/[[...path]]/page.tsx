import { notFound } from "next/navigation"

import { getCloneRoute, getStaticCloneParams } from "@/sites"
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
  const { siteId, path } = await params
  const manifest = getCloneRoute(siteId, path)

  if (!manifest) notFound()

  const { default: SiteComponent } = await siteLoaders[manifest.id]()
  return <SiteComponent />
}
