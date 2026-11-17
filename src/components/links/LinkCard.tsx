"use client"

import { triggerHaptic } from "@/lib/haptics"
import { cn } from "@/lib/utils"
import { useState } from "react"
import QRCode from "react-qr-code"

import Icon from "../global/Icon"
import type { LinkItem } from "./LinkTree"

interface LinkCardProps {
  link: LinkItem
  isOpen: boolean
  onToggle: () => void
}

function displayUrl(url: string) {
  const { hostname, pathname } = new URL(url)
  const path = pathname.replace(/\/$/, "")
  return hostname.replace(/^www\./, "") + (path.length <= 24 ? path : "")
}

export default function LinkCard({ link, isOpen, onToggle }: LinkCardProps) {
  const [isCopied, setIsCopied] = useState(false)
  const { id, url, label, icon } = link
  const IconComponent = Icon[icon] as
    | React.FC<React.SVGProps<SVGSVGElement>>
    | undefined

  const handleToggle = () => {
    triggerHaptic("light")
    onToggle()
  }

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(url).then(
      () => {
        triggerHaptic("success")
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
      },
      (err) => {
        triggerHaptic("error")
        console.error("Failed to copy URL: ", err)
      },
    )
  }

  return (
    <li id={id} className="scroll-mt-6 border-b border-line">
      <h2>
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls={`${id}-panel`}
          onClick={handleToggle}
          className="flex w-full items-center gap-4 py-4 text-left transition-colors hover:text-brand"
        >
          {IconComponent && (
            <IconComponent aria-hidden="true" className="size-6 shrink-0" />
          )}
          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="text-[21px] font-semibold leading-tight">
              {label}
            </span>
            <span className="truncate font-mono text-[13px] text-dim">
              {displayUrl(url)}
            </span>
          </span>
          <span
            aria-hidden="true"
            className={cn(
              "shrink-0 font-mono text-xl leading-none transition-transform duration-300 motion-reduce:transition-none",
              isOpen && "rotate-45",
            )}
          >
            +
          </span>
        </button>
      </h2>
      <div
        id={`${id}-panel`}
        inert={!isOpen}
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            className={cn(
              "mb-5 flex w-full flex-col items-center gap-5 bg-sunk px-5 py-7 transition-opacity duration-300 motion-reduce:transition-none",
              isOpen ? "opacity-100" : "opacity-0",
            )}
          >
            <div className="w-full max-w-[240px] bg-white p-4">
              <QRCode
                value={url}
                size={208}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                viewBox="0 0 256 256"
              />
            </div>
            <p className="text-sm text-dim">Scan to open on another device</p>
            <div className="flex w-full max-w-[300px] flex-col gap-3">
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 bg-brand px-3 py-3.5 font-semibold text-on-brand transition-opacity hover:opacity-90"
              >
                <Icon.externalLink aria-hidden="true" className="size-4" />
                Open {label}
              </a>
              <button
                type="button"
                onClick={handleCopyUrl}
                className="flex items-center justify-center gap-2 border border-ink px-3 py-3.5 font-semibold transition-colors hover:border-brand hover:text-brand"
              >
                {isCopied ? (
                  <>
                    <Icon.check aria-hidden="true" className="size-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Icon.copy aria-hidden="true" className="size-4" />
                    Copy URL
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </li>
  )
}
