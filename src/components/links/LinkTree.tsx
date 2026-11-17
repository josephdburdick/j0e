"use client"

import { ContactLink } from "@/lib/types"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

import LinkCard from "./LinkCard"

export type LinkItem = ContactLink & { id: string }

interface LinkTreeProps {
  links: LinkItem[]
  className?: string
}

const EXPAND_MS = 300

function revealOnceExpanded(id: string) {
  window.setTimeout(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    document
      .getElementById(id)
      ?.scrollIntoView({
        block: "nearest",
        behavior: reduce ? "auto" : "smooth",
      })
  }, EXPAND_MS)
}

export default function LinkTree({ links, className }: LinkTreeProps) {
  const [openId, setOpenId] = useState<string | null>(null)

  const handleToggle = (id: string) => {
    const next = openId === id ? null : id
    setOpenId(next)
    window.history.pushState(
      null,
      "",
      next ? `#${next}` : window.location.pathname,
    )
    if (next) revealOnceExpanded(next)
  }

  useEffect(() => {
    const syncFromHash = () => {
      const id = window.location.hash.slice(1)
      setOpenId(id || null)
      if (id) revealOnceExpanded(id)
    }

    syncFromHash()
    window.addEventListener("hashchange", syncFromHash)
    return () => window.removeEventListener("hashchange", syncFromHash)
  }, [])

  return (
    <ul className={cn("flex flex-col border-t-2 border-ink", className)}>
      {links.map((link) => (
        <LinkCard
          key={link.id}
          link={link}
          isOpen={openId === link.id}
          onToggle={() => handleToggle(link.id)}
        />
      ))}
    </ul>
  )
}
