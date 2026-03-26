"use client"

import { Button } from "@/components/ui/button"
import {
  getAudioEnabled,
  setAudioEnabled,
  triggerHaptic,
} from "@/lib/haptics"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

import Icon from "./Icon"

export default function HapticAudioToggle() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    setEnabled(getAudioEnabled())
  }, [])

  const toggle = () => {
    const next = !enabled
    setEnabled(next)
    setAudioEnabled(next)
    // Play a sample sound so the user hears the toggle
    if (next) {
      triggerHaptic("medium")
    }
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className={cn("rounded-full p-2")}
      onClick={toggle}
      haptic={false}
      aria-label={enabled ? "Disable haptic sound" : "Enable haptic sound"}
    >
      {enabled ? (
        <Icon.volume2 className="text-foreground" />
      ) : (
        <Icon.volumeX className="text-muted-foreground" />
      )}
    </Button>
  )
}
