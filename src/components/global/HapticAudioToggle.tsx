"use client"

import { Button, buttonVariants } from "@/components/ui/button"
import { getAudioEnabled, setAudioEnabled, triggerHaptic } from "@/lib/haptics"
import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"

import Icon from "./Icon"

export default function HapticAudioToggle() {
  const [enabled, setEnabled] = useState(true)
  const [showStatus, setShowStatus] = useState(false)
  const [isMobileDevice, setIsMobileDevice] = useState(false)
  const statusTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    setEnabled(getAudioEnabled())
    const hasTouch =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(pointer: coarse)").matches
    setIsMobileDevice(hasTouch)
  }, [])

  const showTemporaryStatus = () => {
    setShowStatus(true)
    if (statusTimeoutRef.current !== null) {
      window.clearTimeout(statusTimeoutRef.current)
    }
    statusTimeoutRef.current = window.setTimeout(() => {
      setShowStatus(false)
    }, 2500)
  }

  useEffect(() => {
    return () => {
      if (statusTimeoutRef.current !== null) {
        window.clearTimeout(statusTimeoutRef.current)
      }
    }
  }, [])

  const toggle = () => {
    const next = !enabled
    setEnabled(next)
    setAudioEnabled(next)
    if (next) {
      // Ensure iOS audio is unlocked/played from this same tap.
      triggerHaptic("selection")
    }
    showTemporaryStatus()
  }

  const label = enabled ? "Disable haptic feedback" : "Enable haptic feedback"

  return (
    <div className="relative flex flex-col items-center">
      <Button
        type="button"
        className={cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "relative inline-flex items-center rounded-full border-0 p-0 focus:outline-none",
        )}
        onClick={toggle}
        haptic="medium"
        aria-label={label}
      >
        <div
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "rounded-full p-2",
          )}
        >
          {isMobileDevice ? (
            enabled ? (
              <Icon.vibrate className="text-foreground" />
            ) : (
              <Icon.vibrateOff className="text-muted-foreground" />
            )
          ) : enabled ? (
            <Icon.volume2 className="text-foreground" />
          ) : (
            <Icon.volumeX className="text-muted-foreground" />
          )}
        </div>
      </Button>
      <span
        className={cn(
          "pointer-events-none absolute top-full mt-2 whitespace-nowrap text-xs text-muted-foreground transition-all duration-300",
          showStatus ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0",
        )}
      >
        {isMobileDevice ? "Haptics" : "Audio"} {enabled ? "on" : "off"}
      </span>
    </div>
  )
}
