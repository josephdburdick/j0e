"use client"

import { useEffect } from "react"

// The theme is a class set from localStorage, not the OS preference, so the
// browser chrome color has to follow the class rather than a media query.
export function ThemeColorSync() {
  useEffect(() => {
    const root = document.documentElement
    const sync = () => {
      const paper = getComputedStyle(root).getPropertyValue("--paper").trim()
      if (!paper) return
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute("content", paper)
    }
    sync()
    const observer = new MutationObserver(sync)
    observer.observe(root, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [])

  return null
}
