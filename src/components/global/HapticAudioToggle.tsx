"use client"

import { Button, buttonVariants } from "@/components/ui/button"
import { getAudioEnabled, setAudioEnabled } from "@/lib/haptics"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

import Icon from "./Icon"

export default function HapticAudioToggle() {
  const [enabled, setEnabled] = useState(true)

  useEffect(() => {
    setEnabled(getAudioEnabled())
  }, [])

  const toggle = () => {
    const next = !enabled
    setEnabled(next)
    setAudioEnabled(next)
  }

  const label = enabled ? "Disable haptic sound" : "Enable haptic sound"

  return (
    <div className="flex items-center gap-2">
      <span className="hidden shrink-0 text-xs text-muted-foreground [@media(hover:none)]:block">
        Sound
      </span>
      <Button
        type="button"
        className={cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "group relative inline-flex items-center rounded-full border-0 p-0 focus:outline-none",
        )}
        onClick={toggle}
        haptic="medium"
        aria-label={label}
      >
        <div
          className={cn(
            buttonVariants({ variant: "default", size: "lg" }),
            "pointer-events-none absolute right-full z-0 mr-2 translate-x-1/4 whitespace-nowrap rounded-full px-4 py-2 opacity-0 transition-all duration-300",
            "[@media(hover:hover)]:group-hover:-translate-x-0 [@media(hover:hover)]:group-hover:opacity-100",
          )}
        >
          Haptic sound
        </div>
        <div
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "rounded-full p-2",
          )}
        >
          {enabled ? (
            <Icon.volume2 className="text-foreground" />
          ) : (
            <Icon.volumeX className="text-muted-foreground" />
          )}
        </div>
      </Button>
    </div>
  )
}
