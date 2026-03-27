"use client"

import { createJ0eLogoSvgSlot } from "@/components/global/J0eLogoSvgSlot"
import { Logo } from "@/components/global/Logo"
import { useApi } from "@/components/providers/DataProvider"
import { cn } from "@/lib/utils"
import Link from "next/link"
import type { ForwardedRef, PropsWithChildren, ReactNode } from "react"
import { forwardRef } from "react"

type Props = PropsWithChildren & {
  className?: string
  logoSlot?: ReactNode
  /** When both hero and sticky headers mount, pass one URL so each Logo shows the same GIF. */
  svgFillUrl?: string
  svgRandomizeOnLoad?: boolean
}

export const MainHeader = forwardRef(
  (props: Props, ref: ForwardedRef<HTMLElement>): ReactNode => {
    const {
      logoSlot = null,
      className,
      svgFillUrl,
      svgRandomizeOnLoad,
    } = props
    const { data } = useApi()
    const { name, logoSvgHoverGifs } = data.profile.attributes

    return (
      <header
        className={cn(
          "container z-auto flex items-center justify-between",
          className,
        )}
        ref={ref}
      >
        <Logo
          logoSlot={
            logoSlot ??
            createJ0eLogoSvgSlot({
              className: "h-7 w-auto md:h-8",
              role: "img",
              "aria-hidden": true,
            })
          }
          name={name}
          svgFillUrl={svgFillUrl}
          svgHoverFillUrls={logoSvgHoverGifs ?? []}
          svgHoverCycleMs={180}
          svgRandomizeOnLoad={svgRandomizeOnLoad}
        />

        {props.children && (
          <div className="ml-auto flex items-center gap-2">
            <div className="flex items-end justify-between gap-4 md:items-center">
              {props.children}
            </div>
          </div>
        )}
      </header>
    )
  },
)

MainHeader.displayName = "MainHeader"
