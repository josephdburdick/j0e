import api from "@/api"
import { Chapter, ChapterMark } from "@/components/global/Chapter"
import { formatMonth } from "@/components/global/EngagementList"
import convertNewLinesToHTML from "@/lib/convertNewLinesToHTML"
import type { Recommendation } from "@/lib/types"
import Image from "next/image"

export default async function Recommendations() {
  const data = await api()
  const { title, subtitle } = data.recommendations.attributes
  const recommendations: Recommendation[] =
    data.recommendations.attributes.recommendations

  return (
    <Chapter id="endorsements" labelledBy="endorsements-title">
      <div className="flex flex-wrap items-baseline justify-between gap-x-10 gap-y-2">
        <h2 id="endorsements-title">
          <ChapterMark number="02">{title}</ChapterMark>
        </h2>
        <p className="text-dim">{subtitle}</p>
      </div>
      <div className="gap-x-12 border-t-2 border-ink pt-8 md:columns-2">
        {recommendations.map((recommendation) => (
          <figure
            key={recommendation.name}
            className="mb-8 flex break-inside-avoid flex-col gap-5 border-b border-line pb-8"
          >
            <figcaption className="flex items-center gap-4">
              <Image
                width={52}
                height={52}
                src={recommendation.avatar}
                alt=""
                className="size-[52px] shrink-0 rounded-full object-cover"
              />
              <div className="flex min-w-0 flex-col">
                <span className="text-[17px] font-semibold">
                  {recommendation.name}
                </span>
                <span className="text-sm text-dim">{recommendation.title}</span>
              </div>
            </figcaption>
            <blockquote
              className="rich"
              dangerouslySetInnerHTML={{
                __html: convertNewLinesToHTML(recommendation.body),
              }}
            />
            <p className="font-mono text-xs text-dim">
              {recommendation.relationship} · {formatMonth(recommendation.date)}
            </p>
          </figure>
        ))}
      </div>
    </Chapter>
  )
}
