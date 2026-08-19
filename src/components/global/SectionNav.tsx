"use client"

import { triggerHaptic } from "@/lib/haptics"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

const SECTIONS = [
  { id: "intro", label: "Intro" },
  { id: "endorsements", label: "Endorsements" },
  { id: "experience", label: "Experience" },
  { id: "open-source", label: "Open Source" },
  { id: "about", label: "About" },
]

export function SectionNav() {
  const [activeId, setActiveId] = useState(SECTIONS[0].id)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const observer = new IntersectionObserver(
      (entries) => {
        // Of the sections currently crossing the middle band of the
        // viewport, activate the one closest to the top.
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length > 0) setActiveId(visible[0].target.id)
      },
      { rootMargin: "-40% 0px -45% 0px" },
    )

    for (const { id } of SECTIONS) {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    }
    return () => observer.disconnect()
  }, [])

  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    event.preventDefault()
    const element = document.getElementById(id)
    if (!element) return
    triggerHaptic("selection")
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches
    element.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    })
    window.history.replaceState(null, "", `#${id}`)
  }

  return (
    <nav
      aria-label="Section navigation"
      className={cn(
        "fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 transition-opacity duration-700 lg:block",
        mounted ? "opacity-100" : "opacity-0",
      )}
    >
      <ul className="flex flex-col items-end gap-4">
        {SECTIONS.map(({ id, label }) => {
          const isActive = id === activeId
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={(event) => handleClick(event, id)}
                aria-current={isActive ? "true" : undefined}
                className="group flex items-center justify-end gap-2 py-0.5"
              >
                <span
                  className={cn(
                    "translate-x-1 rounded-full border bg-background/80 px-2 py-0.5 text-xs text-foreground/90 opacity-0 shadow-sm backdrop-blur-sm transition-all duration-200",
                    "group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100",
                    "motion-reduce:transition-none",
                    isActive && "font-semibold text-foreground",
                  )}
                >
                  {label}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "block h-2.5 w-2.5 rounded-full border border-muted-foreground/60 transition-all duration-300 motion-reduce:transition-none",
                    isActive
                      ? "scale-125 border-lime-600 bg-lime-500 dark:border-lime-400"
                      : "bg-background/60 group-hover:border-foreground/80",
                  )}
                />
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
