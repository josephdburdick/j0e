import api from "@/api"
import { Chapter, ChapterIntro, ChapterMark } from "@/components/global/Chapter"
import downloads from "@/data/npm-downloads.json"

type Project = {
  name: string
  npm: string
  demo: string
  summary: string
}

const monthlyDownloads = (npm: string) =>
  downloads.packages.find((entry) => entry.name === npm)?.lastMonth

export default async function OpenSource() {
  const data = await api()
  const { title, headline, intro, github } = data.projects.attributes
  const projects: Project[] = data.projects.attributes.projects

  return (
    <Chapter id="open-source" labelledBy="open-source-title">
      <ChapterMark number="03">{title}</ChapterMark>
      <ChapterIntro id="open-source-title" headline={headline} intro={intro} />
      <div role="table" className="flex flex-col border-t-2 border-ink">
        <div
          role="row"
          className="hidden gap-6 border-b border-line py-2.5 font-mono text-xs uppercase tracking-[0.06em] text-dim md:flex"
        >
          <span role="columnheader" className="flex-[1_1_160px]">
            Package
          </span>
          <span role="columnheader" className="flex-[3_1_320px]">
            What it does
          </span>
          <span role="columnheader" className="flex-[2_1_240px]">
            Install
          </span>
          <span role="columnheader" className="flex-[0_0_90px] text-right">
            Downloads
          </span>
        </div>
        {projects.map((project) => {
          const count = monthlyDownloads(project.npm)
          return (
            <div
              key={project.name}
              role="row"
              className="flex flex-wrap items-baseline gap-x-6 gap-y-1.5 border-b border-line py-[18px]"
            >
              <span role="cell" className="flex-[1_1_160px]">
                <a
                  href={project.demo}
                  className="text-[19px] font-semibold text-brand underline underline-offset-4 hover:text-ink"
                >
                  {project.name}
                </a>
              </span>
              <span role="cell" className="flex-[3_1_320px] text-base text-dim">
                {project.summary}
              </span>
              <code
                role="cell"
                className="flex-[2_1_240px] font-mono text-[13px] text-dim"
              >
                npm i {project.npm}
              </code>
              <span
                role="cell"
                className="flex-[0_0_90px] font-mono text-sm tabular-nums md:text-right"
              >
                {count === undefined ? (
                  <span className="text-dim">n/a</span>
                ) : (
                  <>
                    {count.toLocaleString("en-US")}
                    <span className="text-dim md:hidden"> downloads</span>
                  </>
                )}
              </span>
            </div>
          )
        })}
      </div>
      <a href={github.url} className="text-link self-start">
        {github.label} on GitHub
      </a>
    </Chapter>
  )
}
