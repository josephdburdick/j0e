"use client"

import { useApi } from "@/components/providers/DataProvider"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { type CarouselApi } from "@/components/ui/carousel"
import { ContactLink } from "@/lib/types"
import { useEffect, useRef, useState } from "react"

import { Button } from "../ui/button"
import Icon from "./Icon"
import MainNav from "./MainNav"
import WorkAvailability from "./WorkAvailability"

export default function HeaderAd() {
  const [api, setApi] = useState<CarouselApi | null>(null)
  const { data } = useApi()
  const links: ContactLink[] = Object.values(data.profile.attributes.links)

  const intervalRef = useRef<number | null>(null)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    const updateAutoplay = (currentSlide: number) => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current)
      }

      const delay = currentSlide === 0 ? 6000 : 2000

      intervalRef.current = window.setInterval(() => {
        if (api && !isPaused) {
          api.scrollNext()
        }
      }, delay)
    }
    if (!api) {
      return
    }

    const handleSelect = () => {
      const currentSlide = api.selectedScrollSnap()
      updateAutoplay(currentSlide)
    }

    api.on("select", handleSelect)
    updateAutoplay(api.selectedScrollSnap())

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current)
      }
      api.off("select", handleSelect)
    }
  }, [api, isPaused])

  const handleMouseEnter = () => {
    if (api?.selectedScrollSnap() === 0) {
      setIsPaused(true)
    }
  }

  const handleMouseLeave = () => {
    if (api?.selectedScrollSnap() === 0) {
      setIsPaused(false)
    }
  }

  return (
    <Carousel
      setApi={setApi}
      opts={{
        loop: true,
        align: "end",
      }}
      orientation="vertical"
      className="w-full max-w-xs"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <CarouselContent className="h-12">
        <CarouselItem className="pt-3">
          <MainNav
            links={links}
            className="mr-auto"
            title="Let's Connect"
            description="Send a message via Email or Social Media"
          >
            <Button
              variant="outline"
              size="sm"
              className="ml-auto mt-1 flex items-center gap-2"
            >
              <Icon.ellipsis />
              <div>Menu</div>
            </Button>
          </MainNav>
        </CarouselItem>
        <CarouselItem className="flex items-center justify-end pl-1">
          <WorkAvailability />
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  )
}
