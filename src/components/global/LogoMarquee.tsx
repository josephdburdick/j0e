import { useApi } from "@/components/providers/DataProvider"
import { Job } from "@/lib/types"
import Image from "next/image"

import { Card, CardContent } from "../ui/card"

type MarqueeProps = {
  itemWidth?: string
}

export default function LogoMarquee(props: MarqueeProps) {
  const { itemWidth = "200px" } = props
  const { data } = useApi()
  const jobs: Job[] = data.experience.attributes.experience.filter(
    (job: Job) => !!job.logo,
  )

  return (
    <div className="marquee-wrapper pointer-events-none relative z-10 mx-auto h-36 w-11/12 max-w-screen-xl overflow-hidden">
      {jobs.map(
        (job, index) =>
          job.logo && (
            <Card
              className="absolute my-4 h-24 w-52 rounded-lg bg-background shadow-xl"
              key={index}
              style={{
                animationDelay: `calc(30s / ${jobs.length} * (${jobs.length} - ${index + 1}) * -1)`,
                animationName: "scrollLeft",
                animationDuration: "30s",
                animationTimingFunction: "linear",
                animationIterationCount: "infinite",
                left: `max(calc(${itemWidth} * ${jobs.length}), 100%)`,
              }}
            >
              <CardContent className="flex h-full w-full items-center justify-center p-8 text-muted">
                <Image
                  src={job.logo}
                  alt={`${job.company} logo`}
                  className="selection-none pointer-events-none max-h-20 max-w-28 grayscale dark:invert"
                  loading="lazy"
                />
              </CardContent>
            </Card>
          ),
      )}
    </div>
  )
}
