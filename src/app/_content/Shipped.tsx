import api from "@/api"
import { Chapter, ChapterIntro, ChapterMark } from "@/components/global/Chapter"
import { ShotPanel } from "@/components/global/ShotPanel"
import type { Screenshot } from "@/lib/screenshots"
import { cn } from "@/lib/utils"
import Image from "next/image"

type AppLink = {
  url: string
  label: string
  badge?: { light: string; dark: string; width?: number; height?: number }
}

type StoreLink = AppLink & Required<Pick<AppLink, "badge">>

type Modes = {
  title: string
  items: { name: string; note: string }[]
  link?: AppLink
}

type App = {
  name: string
  featured?: boolean
  tagline: string
  description: string
  status: string
  released?: string
  links: AppLink[]
  tags: string[]
  screenshots: Screenshot[]
  modes?: Modes
}

type Upcoming = { stage: string; name: string; note: string }

const formatReleased = (value: string) =>
  new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  })

// Store guidelines require the stores' own badge artwork for this wording.
function StoreBadge({ link }: { link: StoreLink }) {
  const { badge } = link
  const { width = 120, height = 40 } = badge
  return (
    <a href={link.url} className="inline-block py-1">
      <Image
        src={badge.light}
        alt={link.label}
        width={width}
        height={height}
        className="h-11 w-auto dark:hidden"
      />
      <Image
        src={badge.dark}
        alt={link.label}
        width={width}
        height={height}
        className="hidden h-11 w-auto dark:block"
      />
    </a>
  )
}

function AppDetails({ app }: { app: App }) {
  const storeLinks = app.links.filter(
    (link): link is StoreLink => link.badge !== undefined,
  )
  const textLinks = app.links.filter((link) => !link.badge)
  return (
    <div className="flex min-w-0 flex-[2_1_340px] flex-col gap-3.5">
      <p
        className={cn(
          "label text-xs",
          app.released ? "text-brand" : "text-dim",
        )}
      >
        {app.status}
        {app.released && <> · {formatReleased(app.released)}</>}
      </p>
      <h3 className="display text-[32px] leading-[1.08]">{app.name}</h3>
      <p className="text-[19px] font-medium">{app.tagline}</p>
      <p className="text-dim">{app.description}</p>
      <p className="font-mono text-[13px] text-dim">{app.tags.join(", ")}</p>
      {storeLinks.length > 0 && (
        <div className="flex flex-wrap items-center gap-x-3">
          {storeLinks.map((link) => (
            <StoreBadge key={link.url} link={link} />
          ))}
        </div>
      )}
      {textLinks.map((link) => (
        <a key={link.url} href={link.url} className="text-link self-start">
          {link.label}
        </a>
      ))}
    </div>
  )
}

function AppModes({ modes }: { modes: Modes }) {
  return (
    <div className="flex min-w-0 flex-[2_1_340px] flex-col gap-3.5">
      <h4 className="label text-xs text-dim">{modes.title}</h4>
      <dl className="flex flex-col border-t-2 border-ink">
        {modes.items.map((item) => (
          <div
            key={item.name}
            className="flex flex-wrap gap-x-5 gap-y-1 border-b border-line py-3.5"
          >
            <dt className="flex-[0_0_170px] font-semibold">{item.name}</dt>
            <dd className="flex-[1_1_200px] text-dim">{item.note}</dd>
          </div>
        ))}
      </dl>
      {modes.link && (
        <a href={modes.link.url} className="text-link self-start">
          {modes.link.label}
        </a>
      )}
    </div>
  )
}

export default async function Shipped() {
  const data = await api()
  const { title, headline, intro } = data.apps.attributes
  const apps: App[] = data.apps.attributes.apps
  const upcoming: Upcoming[] = data.apps.attributes.upcoming ?? []
  const featured = apps.filter((app) => app.featured)
  const rest = apps.filter((app) => !app.featured)

  return (
    <Chapter id="shipped" labelledBy="shipped-title" className="gap-14">
      <div className="flex flex-col gap-6">
        <ChapterMark number="02">{title}</ChapterMark>
        <ChapterIntro id="shipped-title" headline={headline} intro={intro} />
      </div>

      {featured.map((app) => (
        <article
          key={app.name}
          className="flex flex-wrap items-start gap-x-14 gap-y-8"
        >
          <ShotPanel
            title={app.name}
            screenshots={app.screenshots}
            className="flex-[1_1_100%] py-10"
          />
          <AppDetails app={app} />
          {app.modes && <AppModes modes={app.modes} />}
        </article>
      ))}

      {rest.map((app, index) => (
        <article
          key={app.name}
          className={cn(
            "flex items-center gap-x-14 gap-y-8",
            index % 2 === 0 ? "flex-wrap-reverse" : "flex-wrap",
          )}
        >
          {index % 2 === 0 && <AppDetails app={app} />}
          <ShotPanel
            title={app.name}
            screenshots={app.screenshots}
            className="flex-[3_1_460px]"
          />
          {index % 2 === 1 && <AppDetails app={app} />}
        </article>
      ))}

      {upcoming.length > 0 && (
        <ul className="flex flex-col border-t-2 border-ink">
          {upcoming.map((project) => (
            <li
              key={project.name}
              className="flex flex-wrap gap-x-6 gap-y-1.5 border-b border-line py-4"
            >
              <span className="flex-[0_0_170px] pt-[3px] font-mono text-[13px] text-dim">
                {project.stage}
              </span>
              <span className="flex-[1_1_200px] font-semibold">
                {project.name}
              </span>
              <span className="flex-[2_1_340px] text-dim">{project.note}</span>
            </li>
          ))}
        </ul>
      )}
    </Chapter>
  )
}
