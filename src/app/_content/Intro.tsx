"use client"

import DarkModeToggle from "@/components/global/DarkModeToggle"
import HeaderAd from "@/components/global/HeaderAd"
import Icon from "@/components/global/Icon"
import LinkButton from "@/components/global/LinkButton"
import LocationComponent from "@/components/global/Location"
import LogoMarquee from "@/components/global/LogoMarquee"
import MainHeader from "@/components/global/MainHeader"
import MainNav from "@/components/global/MainNav"
import Weather from "@/components/global/Weather"
import { useApi } from "@/components/providers/DataProvider"
import { buttonVariants } from "@/components/ui/button"
import { ContactLink } from "@/lib/types"
import { cn } from "@/lib/utils"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"

import ScrollHint from "../../components/global/ScrollHint"

// Extract the client-side sticky header functionality into a separate component
const StickyHeader = () => {
  const [isSticky, setIsSticky] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Check if we've scrolled past the main content
      const scrollPosition = window.scrollY
      const triggerPoint = 100 // Adjust based on when you want the header to appear
      setIsSticky(scrollPosition > triggerPoint)
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return createPortal(
    <div
      className={cn(
        "fixed top-0 z-10 w-full transition-all duration-500",
        isSticky ? "opacity-100" : "opacity-0",
      )}
    >
      <div className="relative">
        <div className="absolute inset-0 w-full bg-gradient-to-b from-background transition-all duration-500" />
        <div className="absolute inset-0 backdrop-blur-sm transition-all duration-500 hover:opacity-0 hover:backdrop-blur-0" />
        <MainHeader className="container z-10 w-full py-4 md:py-8">
          <HeaderAd />
        </MainHeader>
      </div>
    </div>,
    document.body,
  )
}

// Extract the scroll hint functionality into a separate component
const ScrollHintWrapper = () => {
  const [scrollPosition, setScrollPosition] = useState(0)
  const scrollHintRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const scrollHintOpacity = Math.max(
    0,
    1 - scrollPosition / (window.innerHeight / 1.25),
  )

  return (
    <ScrollHint
      scrollHintOpacity={scrollHintOpacity}
      scrollHintRef={scrollHintRef}
    />
  )
}

const ClientStickyHeader = dynamic(() => Promise.resolve(StickyHeader), {
  ssr: false,
})

const ClientScrollHint = dynamic(() => Promise.resolve(ScrollHintWrapper), {
  ssr: false,
})

function Intro() {
  const { data } = useApi()
  const links: ContactLink[] = Object.values(data.profile.attributes.links)

  return (
    <>
      <section className="relative flex min-h-[95dvh] flex-col items-center justify-center sm:min-h-[85dvh] md:min-h-[95dvh]">
        <div className="flex w-full flex-1">
          <div className="grid w-full grid-rows-[auto_1fr_auto] items-center gap-4 lg:gap-6">
            <MainHeader className="pt-6 md:pt-16 lg:pt-24 xl:pt-36">
              <div className="flex items-center gap-3">
                <DarkModeToggle />
                <LinkButton />
              </div>
            </MainHeader>

            <main className="container w-full items-center space-y-8 md:space-y-16">
              <div className="prose prose-scale max-w-[65ch] text-pretty dark:prose-invert">
                <div dangerouslySetInnerHTML={{ __html: data.intro.html }} />
                <LogoMarquee />
              </div>
            </main>

            <ClientStickyHeader />

            <footer className="pb-8 md:pb-16 lg:pb-24 xl:pb-36">
              <div className="container">
                <div className="flex items-center justify-between gap-4">
                  <div className="hidden shrink-0 flex-col items-center gap-2 text-xs text-muted-foreground md:flex">
                    <div className="grid grid-cols-[auto_1fr] items-center gap-x-2 gap-y-1">
                      <Weather />
                      <LocationComponent />
                    </div>
                  </div>
                  <MainNav
                    title="Let's Connect"
                    description="Send a message via Email or Social Media"
                    links={links}
                  />
                </div>
              </div>

              <ClientScrollHint />
            </footer>
          </div>
        </div>
      </section>
    </>
  )
}

export default Intro
