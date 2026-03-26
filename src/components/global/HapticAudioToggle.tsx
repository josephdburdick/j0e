"use client"

import { buttonVariants } from "@/components/ui/button"
import {
  getAudioEnabled,
  setAudioEnabled,
  triggerHaptic,
} from "@/lib/haptics"
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
    if (next) {
      triggerHaptic("medium")
    }
  }

  return (
    <button
      type="button"
      className={cn(buttonVariants({ variant: "outline", size: "icon" }), "rounded-full p-2")}
      onClick={toggle}
      aria-label={enabled ? "Disable haptic sound" : "Enable haptic sound"}
    >
      {enabled ? (
        <Icon.volume2 className="text-foreground" />
      ) : (
        <Icon.volumeX className="text-muted-foreground" />
      )}
    </button>
  )
}
