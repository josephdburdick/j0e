"use client"

import useWindowSize from "@/hooks/useWindowSize"
import toKebabCase from "@/lib/toKebabCase"
import { ContactLink } from "@/lib/types"
import { cn } from "@/lib/utils"
import { useEffect } from "react"

import LinkCard from "./LinkCard"

interface LinkTreeProps {
  links: ContactLink[]
  className?: string
}

export default function LinkTree({ links, className }: LinkTreeProps) {
  const { height: windowHeight } = useWindowSize()

  // Calculate the height each link should take
  // Account for header, footer, padding, and gaps between cards
  const headerFooterHeight = 240 // Increased to account for more spacing
  const gapHeight = (links.length - 1) * 16
  const availableHeight = Math.max(
    windowHeight - headerFooterHeight - gapHeight,
    400,
  )
  const linkHeight =
    links.length > 0 ? Math.floor(availableHeight / links.length) : 0

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash
      if (hash) {
        const element = document.querySelector(hash)
        if (element) {
          const headerOffset = 100 // Adjust this value based on your header's height
          const elementPosition = element.getBoundingClientRect().top
          const offsetPosition = elementPosition + window.scrollY - headerOffset

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          })
        }
      }
    }

    // Call the function on component mount
    handleHashChange()

    // Add event listener for hash changes
    window.addEventListener("hashchange", handleHashChange)

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("hashchange", handleHashChange)
    }
  }, [])

  return (
    <div className={cn("flex w-full flex-col gap-6", className)}>
      {links.map((link) => {
        // For links that don't start with http, treat them as internal links
        // that should scroll to an element with the corresponding ID
        const isInternalLink = !link.url.startsWith("http")
        const linkId = toKebabCase(link.label)

        return (
          <LinkCard
            key={link.url}
            link={isInternalLink ? { ...link, url: `#${linkId}` } : link}
            className="flex-grow"
          />
        )
      })}
    </div>
  )
}
