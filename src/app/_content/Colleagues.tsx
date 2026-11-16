import api from "@/api"
import { Chapter, ChapterMark } from "@/components/global/Chapter"
import Link from "next/link"

type Recommendation = {
  name: string
  pull?: string
  pullCredit?: string
}

export default async function Colleagues() {
  const data = await api()
  const all: Recommendation[] = data.recommendations.attributes.recommendations
  const pulled = all.filter((recommendation) => recommendation.pull)

  return (
    <Chapter labelledBy="colleagues-title">
      <h2 id="colleagues-title">
        <ChapterMark number="04">What colleagues say</ChapterMark>
      </h2>
      <div className="flex flex-wrap gap-10">
        {pulled.map((recommendation) => (
          <figure
            key={recommendation.name}
            className="flex min-w-0 flex-[1_1_300px] flex-col gap-4"
          >
            <blockquote className="text-[21px] font-medium leading-[1.35]">
              {recommendation.pull}
            </blockquote>
            <figcaption className="text-sm text-dim">
              {recommendation.name}, {recommendation.pullCredit}
            </figcaption>
          </figure>
        ))}
      </div>
      <Link href="/resume#endorsements" className="text-link self-start">
        Read all {all.length}
      </Link>
    </Chapter>
  )
}
