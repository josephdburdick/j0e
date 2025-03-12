"use client"

import { useApi } from "@/components/providers/DataProvider"
import { cn } from "@/lib/utils"
import Image from "next/image"
import type { ForwardedRef, PropsWithChildren, ReactNode } from "react"
import { forwardRef } from "react"

type Props = PropsWithChildren & {
  className?: string
  logoSlot?: ReactNode
}

export const MainHeader = forwardRef(
  (props: Props, ref: ForwardedRef<HTMLElement>): ReactNode => {
    const { logoSlot = null, className } = props
    const { data } = useApi()
    const { name } = data.profile
    const { logo } = data.site.attributes

    return (
      <header
        className={cn(
          "container z-50 flex items-center justify-between",
          className,
        )}
        ref={ref}
      >
        <h1 className="dark:invert">
          {logoSlot || (
            <Image
              src={logo.url}
              width={logo.width}
              height={logo.height}
              alt={logo.alt}
            />
          )}
          <span className="sr-only">{name}</span>
        </h1>
        <div className="flex items-center gap-2">
          <div className="flex items-end justify-between gap-4 md:items-center">
            {props.children}
          </div>
        </div>
      </header>
    )
  },
)

MainHeader.displayName = "MainHeader"

export default MainHeader
