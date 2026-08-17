export type SiteId = "openai" | "chatgpt" | "studio" | "gemini"

export type NavigationSurface =
  | "marketing-top-nav"
  | "chatgpt-compound-sidebar"
  | "studio-app-shell"
  | "gemini-sidebar"

export interface SiteManifest {
  readonly id: SiteId
  readonly label: string
  readonly defaultPath: string
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
} as const satisfies Record<SiteId, SiteManifest>

export function getSiteManifest(siteId: string): SiteManifest | undefined {
  if (!(siteId in siteManifests)) return undefined

  return siteManifests[siteId as SiteId]
}

export function getClonePickerItems(): readonly ClonePickerItem[] {
  return Object.values(siteManifests).map((manifest) => ({
    id: manifest.id,
    label: manifest.label,
    href: manifest.defaultPath,
  }))
}
