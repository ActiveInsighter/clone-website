"use client"

import * as React from "react"

const PortalContainerContext = React.createContext<React.RefObject<HTMLDivElement | null> | undefined>(undefined)

/** Keep overlays in the same DOM subtree as their owning theme and CSS scope. */
export function PortalScope({ children, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const container = React.useRef<HTMLDivElement>(null)
  return (
    <PortalContainerContext.Provider value={container}>
      <div ref={container} {...props}>{children}</div>
    </PortalContainerContext.Provider>
  )
}

// Base UI accepts a ref as Portal.container; outside a scope it retains its default.
// https://base-ui.com/react/components/dialog#portal
export function usePortalContainer() {
  return React.useContext(PortalContainerContext)
}
