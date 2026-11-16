"use client"

import { createJ0eLogoSvgSlot } from "@/components/global/J0eLogoSvgSlot"
import { Logo } from "@/components/global/Logo"
import { ThemeToggle } from "@/components/global/ThemeToggle"
import { useApi } from "@/components/providers/DataProvider"
import { useLogoGif } from "@/hooks/useLogoGif"
import Link from "next/link"

const SECTIONS = [
  { id: "work", label: "Client work" },
  { id: "shipped", label: "Shipped" },
  { id: "open-source", label: "Open source" },
  { id: "about", label: "About" },
]

const EMPTY_GIFS: string[] = []

export function SiteHeader() {
  const { data } = useApi()
  const { name, logoSvgHoverGifs } = data.profile.attributes
  const { cta } = data.site.attributes.contact
  const gifs: string[] = logoSvgHoverGifs ?? EMPTY_GIFS
  const fill = useLogoGif(gifs)

  return (
    <div className="shell">
      <header className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3 border-b border-line py-7">
        <Logo
          logoSlot={createJ0eLogoSvgSlot({
            className: "h-7 w-auto",
            role: "img",
            "aria-hidden": true,
          })}
          name={name}
          svgFillUrl={fill}
          svgHoverFillUrls={gifs}
          svgHoverCycleMs={180}
          svgRandomizeOnLoad={gifs.length > 0 ? false : undefined}
        />
        <nav
          aria-label="Sections"
          className="flex items-center gap-7 text-[15px] font-medium"
        >
          {SECTIONS.map(({ id, label }) => (
            <Link
              key={id}
              href={`/#${id}`}
              className="hidden py-2.5 text-ink transition-colors hover:text-brand md:block"
            >
              {label}
            </Link>
          ))}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <a
              href={cta.url}
              className="bg-ink px-[18px] py-3 text-paper transition-colors hover:bg-brand hover:text-on-brand"
            >
              {cta.label}
            </a>
          </div>
        </nav>
      </header>
    </div>
  )
}
