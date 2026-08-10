import { notFound } from "next/navigation"

import { getCloneSite, siteComponents, siteManifests } from "@/sites"

type ClonePageProps = {
  params: Promise<{
    siteId: string
    path?: string[]
  }>
}

export function generateStaticParams() {
  return Object.keys(siteManifests).map((siteId) => ({ siteId }))
}

export default async function ClonePage({ params }: ClonePageProps) {
  const { siteId } = await params
  const manifest = getCloneSite(siteId)

  if (!manifest) notFound()

  const SiteComponent = siteComponents[manifest.id]
  return <SiteComponent />
}
