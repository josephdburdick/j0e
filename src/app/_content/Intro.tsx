"use client"

import DarkModeToggle from "@/components/global/DarkModeToggle"
import HeaderAd from "@/components/global/HeaderAd"
import Icon from "@/components/global/Icon"
import LogoMarquee from "@/components/global/LogoMarquee"
import MainHeader from "@/components/global/MainHeader"
import MainNav from "@/components/global/MainNav"
import WeatherComponent from "@/components/global/Weather"
import { useApi } from "@/components/providers/DataProvider"
import { ContactLink } from "@/lib/types"
import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"

import ScrollHint from "../../components/global/ScrollHint"

function Intro() {
  const headerRef = useRef<HTMLDivElement | null>(null)
  const { data } = useApi()
  const links: ContactLink[] = Object.values(data.profile.attributes.links)
  const [isSticky, setIsSticky] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)
  const scrollHintRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!headerRef.current) return
      const { bottom } = headerRef.current?.getBoundingClientRect() || {}
      setIsSticky(bottom < 0)
      setScrollPosition(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const scrollHintOpacity = Math.max(
    0,
    1 - scrollPosition / (window ? window.innerHeight / 1.25 : 1),
  )

  return (
    <>
      <section className="relative flex min-h-[600px] flex-col items-center justify-center sm:min-h-[85dvh] md:min-h-[95dvh]">
        <div className="flex w-full flex-1">
          <div className="grid w-full grid-rows-[auto_1fr_auto] items-center gap-4 lg:gap-6">
            <MainHeader className="pt-6 md:pt-16 lg:pt-24 xl:pt-36">
              <DarkModeToggle />
            </MainHeader>

            <main
              className="container w-full items-center space-y-8 md:space-y-16"
              ref={headerRef}
            >
              <div className="prose prose-scale max-w-[65ch] text-pretty dark:prose-invert">
                <div
                  // className="[&>h3:first-child]:pt-0"
                  dangerouslySetInnerHTML={{ __html: data.intro.html }}
                />
                <LogoMarquee />
              </div>
            </main>
            <footer className="pb-8 md:pb-16 lg:pb-24 xl:pb-36">
              <div className="container">
                <div className="flex items-center justify-between gap-4">
                  <div className="hidden shrink-0 items-center gap-2 text-xs text-muted-foreground md:flex xl:text-sm">
                    <Icon.mapPin className="text-lime-500" />
                    <WeatherComponent />
                  </div>
                  <MainNav
                    title="Let's Connect"
                    description="Send a message via Email or Social Media"
                    links={links}
                  />
                </div>
              </div>

              <ScrollHint
                scrollHintOpacity={scrollHintOpacity}
                scrollHintRef={scrollHintRef}
              />
            </footer>
          </div>
        </div>
      </section>
      {typeof window !== "undefined" &&
        createPortal(
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
        )}
    </>
  )
}

export default Intro
