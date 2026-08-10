import { ChatGptHome } from "@/sites/chatgpt/entry"
import { StudioDemo } from "@/sites/studio/entry"
import { getLegacySiteForPathname } from "@/sites/legacy-route-selection"

export default async function CatchAllPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  const pathname = `/${slug.join("/")}`

  if (getLegacySiteForPathname(pathname) === "chatgpt") {
    return <ChatGptHome initialDark />
  }

  return <StudioDemo />
}
