export type SiteId = "openai" | "chatgpt" | "studio" | "gemini" | "anthropic"

export type NavigationSurface =
  | "marketing-top-nav"
  | "chatgpt-compound-sidebar"
  | "studio-app-shell"
  | "gemini-sidebar"
  | "editorial-top-nav"

export interface SiteManifest {
  readonly id: SiteId
  readonly label: string
  readonly defaultPath: string
  readonly metadata?: {
    readonly title: string
    readonly description: string
  }
  readonly navigation: {
    readonly surface: NavigationSurface
    readonly owner: string
  }
}

export interface ClonePickerItem {
  readonly id: SiteId
  readonly label: string
  readonly href: string
}

export const siteManifests = {
  openai: {
    id: "openai",
    label: "OpenAI",
    defaultPath: "/clones/openai",
    navigation: {
      surface: "marketing-top-nav",
      owner: "src/components/openai-navigation/responsive-navigation.tsx",
    },
  },
  chatgpt: {
    id: "chatgpt",
    label: "ChatGPT",
    defaultPath: "/clones/chatgpt",
    navigation: {
      surface: "chatgpt-compound-sidebar",
      owner: "src/components/sidebar/",
    },
  },
  studio: {
    id: "studio",
    label: "Studio",
    defaultPath: "/clones/studio",
    navigation: {
      surface: "studio-app-shell",
      owner: "src/components/studio-app-shell/",
    },
  },
  gemini: {
    id: "gemini",
    label: "Gemini",
    defaultPath: "/clones/gemini",
    navigation: {
      surface: "gemini-sidebar",
      owner: "src/components/sidebar/configured-sidebar.tsx",
    },
  },
  anthropic: {
    id: "anthropic",
    label: "Anthropic · Opus 5.5",
    defaultPath: "/clones/anthropic/claude-opus-5-5",
    metadata: {
      title: "Introducing Claude Opus 5.5 · Anthropic Clone",
      description: "A faithful Opus 5.5 page with reusable benchmark tables, interactive cost-performance charts, and editorial components.",
    },
    navigation: {
      surface: "editorial-top-nav",
      owner: "src/components/sites/www-anthropic-com-b19f62ae/claude-opus-5-5-ad96d446/",
    },
  },
} as const satisfies Record<SiteId, SiteManifest>

export function getSiteManifest(siteId: string): SiteManifest | undefined {
  if (!Object.hasOwn(siteManifests, siteId)) return undefined

  return siteManifests[siteId as SiteId]
}

export function getStaticCloneParams(): { siteId: SiteId; path: string[] }[] {
  return Object.values(siteManifests).map(({ id, defaultPath }) => {
    const prefix = `/clones/${id}`
    if (defaultPath !== prefix && !defaultPath.startsWith(`${prefix}/`)) {
      throw new Error(`Clone route must belong to its site: ${defaultPath}`)
    }
    return { siteId: id, path: defaultPath.slice(prefix.length).split("/").filter(Boolean) }
  })
}

export function getClonePickerItems(): readonly ClonePickerItem[] {
  return Object.values(siteManifests).map((manifest) => ({
    id: manifest.id,
    label: manifest.label,
    href: manifest.defaultPath,
  }))
}
