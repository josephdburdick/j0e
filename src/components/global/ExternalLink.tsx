import { triggerHaptic } from "@/lib/haptics"
import { cn } from "@/lib/utils"
import { PropsWithChildren } from "react"

import Icon from "./Icon"

type Props = PropsWithChildren & {
  href: string;
  className?: string;
};

export default function ExternalLink(props: Props) {
  const { href, children, className = "" } = props
  return (
    <a
      className={cn("inline-flex items-center gap-1 text-inherit", className)}
      href={href}
      onClick={() => triggerHaptic("selection")}
    >
      <span className="underline">{children}</span>

      <Icon.externalLink className="inline-block" size="16" />
    </a>
  )
}
