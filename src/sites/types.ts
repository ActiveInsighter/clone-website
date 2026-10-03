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
  readonly paths: readonly string[]
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
