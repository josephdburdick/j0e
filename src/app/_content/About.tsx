import api from "@/api"
import { Chapter, ChapterMark } from "@/components/global/Chapter"
import Image from "next/image"
import Link from "next/link"

export default async function About() {
  const data = await api()
  const { title, lead, paragraphs } = data.about.attributes
  const { src, width, height } = data.profile.attributes.bg

  return (
    <Chapter
      id="about"
      labelledBy="about-title"
      className="flex-row flex-wrap gap-x-16"
    >
      <div className="flex min-w-0 flex-[1_1_260px] flex-col gap-[18px]">
        <h2 id="about-title">
          <ChapterMark number="06">{title}</ChapterMark>
        </h2>
        <Image
          src={src}
          alt="Joe with two friends at the beach, in black and white"
          width={width}
          height={height}
          sizes="(min-width: 1024px) 400px, 100vw"
          loading="lazy"
          className="cut h-[280px] w-full object-cover object-[80%_center]"
        />
      </div>
      <div className="flex min-w-0 max-w-[64ch] flex-[2_1_460px] flex-col gap-[18px]">
        <p className="text-[21px] leading-[1.4]">{lead}</p>
        {(paragraphs as string[]).map((paragraph) => (
          <p key={paragraph} className="text-dim">
            {paragraph}
          </p>
        ))}
        <Link href="/resume" className="text-link self-start">
          Full résumé
        </Link>
      </div>
    </Chapter>
  )
}
