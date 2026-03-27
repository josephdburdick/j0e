import { cn } from "@/lib/utils"
import Link from "next/link"

import { Button, buttonVariants } from "../ui/button"
import Icon from "./Icon"

export function LinkButton() {
  return (
    <Button
      variant="outline"
      size="lg"
      asChild
      className="flex min-h-11 min-w-11 rounded-full p-2 text-foreground sm:hidden"
    >
      <Link href="/links" aria-label="View mobile-friendly links">
        <Icon.link size={24} />
      </Link>
    </Button>
  )
}
