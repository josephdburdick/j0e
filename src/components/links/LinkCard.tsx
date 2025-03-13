"use client"

import toKebabCase from "@/lib/toKebabCase"
import { ContactLink } from "@/lib/types"
import { cn } from "@/lib/utils"
import { CSSProperties, useState } from "react"
import QRCode from "react-qr-code"

import Icon from "../global/Icon"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion"

interface LinkCardProps {
  link: ContactLink
  className?: string
  style?: CSSProperties
}

export default function LinkCard({ link, className, style }: LinkCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const { url, label, icon } = link

  // Generate an ID for the link based on the label
  const linkId = toKebabCase(label)

  // Check if the link is external (starts with http or https)
  const isExternalLink = url.startsWith("http")

  const IconComponent = icon
    ? (Icon[icon as string] as React.FC<React.SVGProps<SVGSVGElement>>)
    : null

  // Generate a unique gradient based on the icon name
  const getGradient = () => {
    const colors = [
      "from-blue-500 to-purple-500",
      "from-green-400 to-cyan-500",
      "from-pink-500 to-rose-500",
      "from-amber-400 to-orange-500",
      "from-indigo-500 to-blue-500",
      "from-emerald-400 to-teal-500",
    ]

    // Use the icon name to deterministically select a gradient
    const index = icon.charCodeAt(0) % colors.length
    return colors[index]
  }

  return (
    <div
      id={linkId}
      className={cn(
        "w-full transform overflow-hidden rounded-xl transition-all duration-300",
        isHovered ? "scale-[1.02] shadow-lg" : "shadow-md",
        className,
      )}
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Accordion
        type="single"
        collapsible
        className="h-full w-full"
        onValueChange={(value) => setIsExpanded(!!value)}
      >
        <AccordionItem value="qr-code" className="h-full border-none">
          <div className="flex h-full flex-col">
            <AccordionTrigger
              className={cn(
                "flex h-full items-center justify-between rounded-xl px-6 py-6",
                "bg-opacity-90 bg-gradient-to-r text-white",
                getGradient(),
                isExpanded ? "rounded-b-none" : "",
              )}
            >
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center justify-start gap-2 text-xl font-medium md:text-2xl">
                  {IconComponent && (
                    <span className="flex size-8 items-center justify-center text-white">
                      <IconComponent />
                    </span>
                  )}
                  <span>{label}</span>
                </div>

                {/* External link button */}
                <a
                  href={url}
                  target={isExternalLink ? "_blank" : "_self"}
                  rel={isExternalLink ? "noreferrer" : undefined}
                  className="ml-2 mr-4 rounded-full bg-white/20 p-2 text-white hover:bg-white/30"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Icon.externalLink className="size-5" />
                </a>
              </div>
            </AccordionTrigger>

            <AccordionContent
              className={cn(
                "flex items-center justify-center rounded-b-xl px-4 py-6",
                "bg-card/90 backdrop-blur-sm",
              )}
            >
              {isExternalLink && (
                <div className="rounded-lg bg-white p-4 shadow-sm">
                  <div className="mb-2 text-center text-sm text-muted-foreground">
                    Scan to open on another device
                  </div>
                  <QRCode
                    value={url}
                    size={200}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    viewBox="0 0 256 256"
                  />
                </div>
              )}
              {!isExternalLink && (
                <div className="text-center text-sm text-muted-foreground">
                  This is an internal link that will scroll to the corresponding
                  section.
                </div>
              )}
            </AccordionContent>
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
