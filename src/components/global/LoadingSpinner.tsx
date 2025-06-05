import { cn } from "@/lib/utils"
import { type LucideProps } from "lucide-react"
import React from "react"

import Icon from "./Icon"

interface LoadingSpinnerProps extends LucideProps {
  className?: string
}

export default function LoadingSpinner({
  className,
  ...props
}: LoadingSpinnerProps) {
  return (
    <Icon.spinner
      className={cn("animate-spin text-current", className)}
      aria-label="Loading"
      {...props}
    />
  )
}
