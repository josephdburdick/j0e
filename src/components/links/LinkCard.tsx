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
import { Button } from "../ui/button"

interface LinkCardProps {
  link: ContactLink
  className?: string
  style?: CSSProperties
  onAccordionToggle?: (id: string, isOpen: boolean) => void
  isOpen?: boolean
}

export default function LinkCard({
  link,
  className,
  style,
  onAccordionToggle,
  isOpen,
}: LinkCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const { url, label, icon } = link

  // Generate an ID for the link based on the label
  const linkId = toKebabCase(label)

  const IconComponent = icon
    ? (Icon[icon as string] as React.FC<React.SVGProps<SVGSVGElement>>)
    : null

  // Generate a gradient based on the link type
  const getGradient = () => {
    // Map specific gradients to each platform
    const gradientMap: Record<string, string> = {
      linkedin: "from-blue-600 to-blue-400",
      github: "from-purple-700 to-purple-400",
      instagram: "from-pink-500 via-purple-500 to-orange-500",
      readcv: "from-orange-500 to-lime-400",
      website: "from-green-500 to-teal-400",
      mapPin: "from-[#1A936F] to-[#31B88A]",
    }

    // Convert icon name to lowercase for matching
    const iconKey = icon.toLowerCase()

    // Return the mapped gradient or a default one
    return gradientMap[iconKey] || "from-gray-600 to-gray-400"
  }

  const handleAccordionChange = (value: string) => {
    const isNowOpen = !!value
    if (onAccordionToggle) {
      onAccordionToggle(linkId, isNowOpen)
    }
  }

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(url).then(
      () => {
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
      },
      (err) => {
        console.error("Failed to copy URL: ", err)
      },
    )
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
        value={isOpen ? "qr-code" : ""}
        onValueChange={handleAccordionChange}
      >
        <AccordionItem value="qr-code" className="h-full border-none">
          <div className="flex h-full flex-col">
            <AccordionTrigger
              className={cn(
                "flex h-full items-center justify-between rounded-xl px-6 py-6",
                "bg-opacity-90 bg-gradient-to-r text-white",
                getGradient(),
                isOpen ? "rounded-b-none" : "",
              )}
              data-trigger-id={`${linkId}-trigger`}
            >
              <div className="flex w-full items-center justify-start gap-2 text-xl font-medium md:text-2xl">
                {IconComponent && (
                  <span className="flex size-8 items-center justify-center text-white">
                    <IconComponent />
                  </span>
                )}
                <span>{label}</span>
              </div>
            </AccordionTrigger>

            <AccordionContent
              className={cn(
                "flex flex-col items-center justify-center rounded-b-xl px-4 py-6",
                "bg-card/90 backdrop-blur-sm",
              )}
            >
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
              <div className="row-wrap mt-4 flex w-full flex-col-reverse gap-2">
                <Button asChild>
                  <a href={url} target="_blank" rel="noreferrer">
                    <Icon.externalLink className="size-4" />
                    Open {label}
                  </a>
                </Button>
                <Button
                  onClick={handleCopyUrl}
                  variant={isCopied ? "info" : "outline-info"}
                >
                  {isCopied ? (
                    <>
                      <Icon.check className="size-4" /> Copied!
                    </>
                  ) : (
                    <>
                      <Icon.copy className="size-4" /> Copy URL
                    </>
                  )}
                </Button>
              </div>
            </AccordionContent>
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
