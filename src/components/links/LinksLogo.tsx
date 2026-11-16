"use client"

import { createJ0eLogoSvgSlot } from "@/components/global/J0eLogoSvgSlot"
import { Logo } from "@/components/global/Logo"
import { useApi } from "@/components/providers/DataProvider"

// The SVG slot is created here, on the client side of the boundary: passed
// from a server component, dev SSR cannot inspect it and hydration mismatches.
export default function LinksLogo() {
  const { name, logoGifs } = useApi()
  return (
    <Logo
      logoSlot={createJ0eLogoSvgSlot({
        className: "h-7 w-auto md:h-8",
        role: "img",
        "aria-hidden": true,
      })}
      name={name}
      svgHoverFillUrls={logoGifs}
      svgHoverCycleMs={180}
    />
  )
}
