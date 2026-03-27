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
}

export const MainHeader = forwardRef(
  (props: Props, ref: ForwardedRef<HTMLElement>): ReactNode => {
    const { logoSlot = null, className } = props
    const { data } = useApi()
    const { name } = data.profile

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
          // svgFillUrl="https://media.giphy.com/media/3o7aD2saalBwwftBIY/giphy.gif"
          svgHoverFillUrls={[
            // "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExdzE2MHJpZzNmaWQxdzVhdzBoYXh2M3M1bm45d3J3ajFzbzl0Yzl0cyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/4O7RWwD8zRF4BMyBHe/giphy.gif",
            "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExZGk1ZXhlZjJpeHR0MHhrZDZnNzl5eDBuNHJjOXFnZ255Z2J6a2w1cCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o84U78CXEB2opZd4I/giphy.gif",
            "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExcHRrcGM1aXpkeGF5cTdlcXNyYTRjZjVmb3ltdTNkdXE2bHR0bXk2YiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/elzCnIQAjQMWA/giphy.gif",
            "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3N2U2aDhtejVwanRjZmlxOWptaHFlYmdtOHEyczFqdHQwaDcyam9mayZlcD12MV9naWZzX3JlbGF0ZWQmY3Q9Zw/f6qMGmXuOdkwU/giphy.gif",
            "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExcWJsejF4cWg4Nzl1bmRoZno1cHZrZzVwbWIyN2FoMjhwa3FhcGY4OCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0MYtKkFdVsaRN4J2/giphy.gif",
            "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExYWVwejJyeTJnd2FlMHYzMDNyeHR6ODB3cTA2N3U0MzYzcXY4cHViZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xTiTngbPfNnMY1cZi0/giphy.gif",
            "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExMDVsOWZtc2J3bjR1bmRyYm82dTd0eDM5c3Vrb3NndG51c2ZiZmkyOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oEdv4GPCpHvDIzz5S/giphy.gif",
            "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExbjE5enAzbHY5bWlib2hqMjBtZ2QzMzc2NDc1cnY4ZWx6djF0cnpsayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Wy3Q0fuNIJmYn62Lcv/giphy.gif",
            "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExZXVrZnF1NmlkNWF2N3lzMXE0cTM5ZjFyem1tZDN3aGcwMGsyaTF3ayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/f5kBKQ6oDHE6cyLbVA/giphy.gif",
            "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExemg3ZzJxeWNiamF2cHA2Y3lvbGM2dHZqYnM5dTRubHBydXEwdXRmZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Jv3uIdgaWvB3fpAlU3/giphy.gif",
          ]}
          svgHoverCycleMs={180}
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

export default MainHeader
