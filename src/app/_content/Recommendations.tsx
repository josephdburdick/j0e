"use client"

import Icon from "@/components/global/Icon"
import RuleHeader from "@/components/global/RuleHeader"
import { useApi } from "@/components/providers/DataProvider"
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import convertNewLinesToHTML from "@/lib/convertNewLinesToHTML"
import { Recommendation as RecommendationType } from "@/lib/types"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useEffect, useState } from "react"

export default function Recommendations() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const { data } = useApi()
  const recommendations: RecommendationType[] =
    data.recommendations.attributes.recommendations

  useEffect(() => {
    if (!api) return

    api.scrollTo(current)
  }, [api, current])
  const carouselButtonClassName =
    "relative top-0 left-0 right-0 translate-x-0 translate-y-0"

  const renderRecommendation = (
    recommendation: RecommendationType,
    index: number,
  ) => (
    <CarouselItem key={`recommendation-${index}`}>
      <div className="grid grid-cols-4 items-start gap-4 lg:gap-8">
        <div className="col-start-2 hidden grid-cols-3 xl:grid">
          <svg
            className="hidden h-8 w-8 text-gray-400 dark:text-gray-600 lg:block"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 18 14"
          >
            <path d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z" />
          </svg>
        </div>
        <div className="col-span-12 flex flex-col justify-between gap-4 text-pretty xl:col-span-1 xl:col-start-1 xl:h-full xl:min-h-60 xl:pt-1">
          <div className="flex w-full flex-col-reverse items-start justify-center gap-4 sm:flex-row xl:justify-start xl:gap-4">
            <div className="shrink-0 overflow-hidden rounded-full">
              <Image
                width={64}
                height={64}
                src={recommendation.avatar}
                alt={`${recommendation.name} avatar image`}
              />
            </div>
            <div className="flex grow flex-col">
              <RuleHeader className="text-sm font-semibold lg:text-base">
                {recommendation.name}
              </RuleHeader>
              <small className="text-xs text-muted-foreground lg:text-sm">
                {recommendation.title}
              </small>
              <div className="text-bold flex items-start gap-1 pt-2 text-xs text-muted-foreground">
                <Icon.badgeInfo className="shrink-0 text-lime-500" size={16} />
                {recommendation.relationship}
              </div>
            </div>
            <div className="hidden items-center gap-2 sm:flex md:gap-4 lg:hidden">
              <CarouselPrevious className={carouselButtonClassName} />
              <CarouselNext className={carouselButtonClassName} />
            </div>
          </div>
        </div>
        <div className="col-span-12 xl:col-span-3 xl:col-start-2">
          <div
            className="prose-scale text-pretty"
            dangerouslySetInnerHTML={{
              __html: convertNewLinesToHTML(recommendation.body),
            }}
          />
        </div>
      </div>
    </CarouselItem>
  )

  const renderAvatarButtons = (
    recommendation: RecommendationType,
    key: number,
  ) => {
    return (
      <button
        key={key}
        onClick={() => setCurrent(key)}
        className="relative flex lg:flex-col"
      >
        <div
          className={cn(
            "pointer-events-none shrink-0 overflow-hidden rounded-full shadow-none transition-all",
            key !== current && "grayscale",
            key === current && "shadow-2xl ring-2 ring-primary ring-offset-2",
          )}
        >
          <Image
            width={64}
            height={64}
            src={recommendation.avatar}
            alt={`${recommendation.name} avatar image`}
          />
        </div>
        <div
          className={cn(
            "absolute left-1/2 hidden -translate-x-1/2 flex-col whitespace-nowrap rounded-lg p-2 text-xs shadow-none transition-all duration-200 lg:flex",
            key === current &&
              "top-full translate-y-2 bg-primary text-center text-primary-foreground shadow-2xl",
            key !== current &&
              "top-1/2 -z-20 -translate-y-1/2 rotate-45 bg-secondary text-start blur-[2px]",
          )}
        >
          <span className="font-bold">{recommendation.name}</span>
          <span>{recommendation.shortTitle}</span>
        </div>
      </button>
    )
  }

  const renderAvatars = (
    <div className="mt-12 hidden min-h-40 flex-wrap items-start justify-center gap-10 lg:flex">
      {recommendations.map(renderAvatarButtons)}
    </div>
  )

  const renderRecommendations = (
    <Carousel setApi={setApi}>
      <div className="flex items-center justify-center gap-2 pb-8 sm:hidden md:gap-4 lg:hidden">
        <CarouselPrevious className={carouselButtonClassName} />
        <CarouselNext className={carouselButtonClassName} />
      </div>
      {renderAvatars}
      <CarouselContent>
        {recommendations.map(renderRecommendation)}
      </CarouselContent>
    </Carousel>
  )

  return (
    <div
      className={cn(
        "md:py16 items-center justify-center space-y-8 bg-gradient-to-b from-secondary py-8 lg:py-24 xl:py-36",
      )}
    >
      <div className="container space-y-4">
        <header className="space-y-2 pb-12 text-center lg:pb-0">
          <RuleHeader side="both" className="font-light">
            {data.recommendations.attributes.title}
          </RuleHeader>
          <h5 className="text-balance text-3xl font-semibold">
            {data.recommendations.attributes.subtitle}
          </h5>
        </header>
        {renderRecommendations}
      </div>
    </div>
  )
}
