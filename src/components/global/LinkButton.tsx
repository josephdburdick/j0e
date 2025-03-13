import { cn } from "@/lib/utils"
import Link from "next/link"

import { buttonVariants } from "../ui/button"
import Icon from "./Icon"

export default function LinkButton() {
  return (
    <Link
      href="/links"
      className={cn(
        buttonVariants({
          variant: "outline",
          size: "lg",
        }),
        "flex rounded-full p-2 sm:hidden",
      )}
    >
      <Icon.link size={24} />
    </Link>
  )
}
