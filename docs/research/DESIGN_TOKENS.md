# Gemini Sidebar Design Tokens

These tokens were extracted from the signed-in Gemini page at `https://gemini.google.com/app?hl=zh` and translated into the reusable sidebar token API.

| Token | Live value | Local implementation |
| --- | --- | --- |
| expanded surface | `rgb(31, 31, 31)` | `#1f1f1f` |
| collapsed surface | `rgb(15, 15, 15)` | `#0f0f0f` |
| foreground | `rgb(227, 227, 227)` | `#e6e6e6` |
| muted section text | `rgba(255, 255, 255, 0.55)` | same |
| expanded width | `288px` | `--sidebar-width: 288px` |
| collapsed width | `52px` | `--sidebar-rail-width: 52px` |
| item height | `32px` | `--sidebar-item-height: 32px` |
| icon button | `36px` | `--sidebar-icon-button-size: 36px` |
| item radius | `9999px` | `--sidebar-item-radius: 9999px` |
| motion | `0.3s cubic-bezier(0.2, 0, 0, 1)` | same |

The main clone also uses the captured page background (`#0f0f0f`), Google-style blue upgrade action (`#004a77` / `#c2e7ff`), and a restrained blue radial glow behind the static composer to echo the live zero-state page.
