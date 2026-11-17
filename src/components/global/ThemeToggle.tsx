"use client"

import { triggerHaptic } from "@/lib/haptics"
import { setDarkModePreference } from "@/lib/preferences"
import { useEffect, useState } from "react"

import Icon from "./Icon"

export function ThemeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"))
  }, [])

  const toggle = () => {
    const next = !dark
    document.documentElement.classList.toggle("dark", next)
    setDarkModePreference(next)
    setDark(next)
    triggerHaptic("medium")
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={dark}
      aria-label="Dark mode"
      className="grid size-11 place-items-center text-ink transition-colors hover:text-brand"
    >
      {dark ? <Icon.sun size={20} /> : <Icon.moon size={20} />}
    </button>
  )
}
