"use client"

import { Button, buttonVariants } from "@/components/ui/button"
import { getDarkModePreference, setDarkModePreference } from "@/lib/preferences"
import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"

import Icon from "./Icon"

export const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [showStatus, setShowStatus] = useState(false)
  const statusTimeoutRef = useRef<number | null>(null)

  const applyDarkModeClass = (enabled: boolean) => {
    document.documentElement.classList.toggle("dark", enabled)
  }

  useEffect(() => {
    const storedPreference = getDarkModePreference(false)
    setDarkMode(storedPreference)
    applyDarkModeClass(storedPreference)
    setIsInitialized(true)
  }, [])

  useEffect(() => {
    if (!isInitialized) return
    applyDarkModeClass(darkMode)
    setDarkModePreference(darkMode)
  }, [darkMode, isInitialized])

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

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev)
    showTemporaryStatus()
  }

  return (
    <div className="relative flex flex-col items-center">
      <Button
        className={cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "relative inline-flex min-h-11 min-w-11 items-center rounded-full border-0 p-0 focus:outline-none",
        )}
        onClick={toggleDarkMode}
        haptic="medium"
        aria-label="Toggle dark mode"
      >
        <div
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "rounded-full p-2.5",
          )}
        >
          {darkMode ? (
            <Icon.sun className="text-yellow-500" />
          ) : (
            <Icon.moon className="foreground text-foreground" />
          )}
        </div>
      </Button>
      <span
        className={cn(
          "pointer-events-none absolute top-full mt-2 whitespace-nowrap text-xs text-muted-foreground transition-all",
          showStatus ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0",
        )}
      >
        {darkMode ? "Dark mode on" : "Dark mode off"}
      </span>
    </div>
  )
}
