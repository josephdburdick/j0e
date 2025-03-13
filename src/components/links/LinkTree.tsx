"use client"

import useWindowSize from "@/hooks/useWindowSize"
import toKebabCase from "@/lib/toKebabCase"
import { ContactLink } from "@/lib/types"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

import LinkCard from "./LinkCard"

interface LinkTreeProps {
  links: ContactLink[]
  className?: string
}

export default function LinkTree({ links, className }: LinkTreeProps) {
  const { height: windowHeight } = useWindowSize()
  const [openAccordionId, setOpenAccordionId] = useState<string | null>(null)

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

  // Function to scroll to an accordion trigger element by ID
  const scrollToElement = (id: string) => {
    // Try to find the trigger element first
    const triggerElement = document.querySelector(
      `[data-trigger-id="${id}-trigger"]`,
    )

    // If trigger element is not found, fall back to the accordion container
    const element = triggerElement || document.getElementById(id)

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

  // Handle accordion toggle
  const handleAccordionToggle = (id: string, isOpen: boolean) => {
    if (isOpen) {
      setOpenAccordionId(id)
      // Update URL hash without triggering a page reload
      window.history.pushState(null, "", `#${id}`)
      // Scroll to the element
      setTimeout(() => scrollToElement(id), 50) // Small delay to ensure DOM is updated
    } else {
      setOpenAccordionId(null)
      // Remove hash from URL
      window.history.pushState(null, "", window.location.pathname)
    }
  }

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash
      if (hash) {
        const id = hash.substring(1) // Remove the # character
        setOpenAccordionId(id)

        // Scroll to the element
        scrollToElement(id)
      } else {
        setOpenAccordionId(null)
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
    <div className={cn("flex w-full flex-col gap-4", className)}>
      {links.map((link) => {
        const linkId = toKebabCase(link.label)
        return (
          <LinkCard
            key={link.url}
            link={link}
            className="flex-grow"
            onAccordionToggle={handleAccordionToggle}
            isOpen={openAccordionId === linkId}
          />
        )
      })}
    </div>
  )
}
