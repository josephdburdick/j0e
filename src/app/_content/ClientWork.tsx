import api from "@/api"
import { Chapter, ChapterIntro, ChapterMark } from "@/components/global/Chapter"
import Link from "next/link"

type WorkProject = {
  client: string
  years: string
  name: string
  summary: string
}

export default async function ClientWork() {
  const data = await api()
  const { title, headline, intro, projects } = data.work.attributes

  return (
    <Chapter id="work" labelledBy="work-title">
      <ChapterMark number="01">{title}</ChapterMark>
      <ChapterIntro id="work-title" headline={headline} intro={intro} />
      <ul className="flex flex-col border-t-2 border-ink">
        {(projects as WorkProject[]).map((project) => (
          <li
            key={project.name}
            className="flex flex-wrap gap-x-6 gap-y-1.5 border-b border-line py-5"
          >
            <span className="flex-[0_0_170px] whitespace-nowrap pt-1 font-mono text-[13px] text-dim">
              {project.client}, {project.years}
            </span>
            <h3 className="flex-[1_1_220px] text-[19px] font-semibold">
              {project.name}
            </h3>
            <p className="flex-[2_1_340px] text-base text-dim">
              {project.summary}
            </p>
          </li>
        ))}
      </ul>
      <Link href="/resume" className="text-link self-start">
        Full résumé
      </Link>
    </Chapter>
  )
}
