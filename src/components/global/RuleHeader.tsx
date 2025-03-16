import { cn } from "@/lib/utils"
import type { PropsWithChildren } from "react"

export default function RuleHeader(
  props: PropsWithChildren & {
    className?: string
    side?: "left" | "right" | "both"
  },
) {
  const { side = "right", className } = props

  return (
    <div className="flex w-full items-center gap-4">
      {["left", "both"].includes(side) && (
        <div className="h-px w-full flex-1 bg-gradient-to-l from-border to-transparent" />
      )}
      <span className={cn("flex-shrink", className)}>{props.children}</span>
      {["right", "both"].includes(side) && (
        <div className="h-px w-full flex-1 bg-gradient-to-r from-border to-transparent" />
      )}
    </div>
  )
}
