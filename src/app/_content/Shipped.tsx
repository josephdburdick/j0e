"use client"

import { AppScreens, Screenshot } from "@/components/global/AppScreens"
import ExternalLink from "@/components/global/ExternalLink"
import RuleHeader from "@/components/global/RuleHeader"
import { ShotClockDemo } from "@/components/global/ShotClockDemo"
import { useApi } from "@/components/providers/DataProvider"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import Image from "next/image"

type AppLink = { url: string; label: string }

type StealthProject = { name: string; note?: string }

type App = {
  name: string
  featured?: boolean
  demo?: "shot-clock"
  icon: string
  tagline: string
  description: string
  status: string
  released?: string
  links: AppLink[]
  tags: string[]
  screenshots?: Screenshot[]
}

const formatReleased = (value: string) =>
  new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  })

function StatusPill({ app }: { app: App }) {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-lime-500/15 px-2 py-0.5 text-xs font-semibold text-lime-700 dark:text-lime-400">
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {app.status}
      {app.released && <> · {formatReleased(app.released)}</>}
    </span>
  )
}

function AppDetails({ app }: { app: App }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-3">
      <div className="flex items-center gap-3">
        <Image
          src={app.icon}
          alt=""
          width={48}
          height={48}
          className="size-12 shrink-0 rounded-xl"
        />
        <div className="grid gap-1">
          <h4 className="font-semibold text-foreground">{app.name}</h4>
          <div>
            <StatusPill app={app} />
          </div>
        </div>
      </div>
      <p className="text-sm text-foreground/90">
        <strong className="font-semibold text-foreground">{app.tagline}</strong>{" "}
        {app.description}
      </p>
      <ul className="flex flex-wrap gap-x-2 gap-y-1">
        {app.tags.map((tag) => (
          <li key={tag}>
            <Badge variant="outline" size="sm" className="text-foreground/90">
              {tag}
            </Badge>
          </li>
        ))}
      </ul>
      <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1">
        {app.links.map((link) => (
          <ExternalLink key={link.url} href={link.url} className="text-sm">
            {link.label}
          </ExternalLink>
        ))}
      </div>
    </div>
  )
}

export default function Shipped() {
  const { data } = useApi()
  if (!data.apps) return null
  const { title, subtitle } = data.apps.attributes
  const apps: App[] = data.apps.attributes.apps
  const featured = apps.filter((app) => app.featured)
  const rest = apps.filter((app) => !app.featured)
  const stealth: StealthProject[] = data.apps.attributes.stealth ?? []

  return (
    <section
      id="shipped"
      className="items-center justify-center space-y-8 py-8 lg:py-24 xl:py-36"
      aria-labelledby="shipped-title"
    >
      <div className="container space-y-4">
        <header className="space-y-2 pb-12 text-center">
          <RuleHeader side="both" className="font-light">
            <h2 id="shipped-title" className="text-foreground">
              {title}
            </h2>
          </RuleHeader>
          <div className="prose-scale text-balance text-3xl font-bold">
            <h3 className="text-foreground/90">{subtitle}</h3>
          </div>
        </header>
        <div className="mx-auto grid max-w-4xl gap-4">
          {featured.map((app) => (
            <Card
              key={app.name}
              className="grid items-center gap-6 bg-background/60 p-6 sm:grid-cols-[14rem_1fr] lg:grid-cols-[14rem_1fr_17rem]"
            >
              {app.demo === "shot-clock" && <ShotClockDemo />}
              <AppDetails app={app} />
              {app.screenshots && (
                <AppScreens
                  screenshots={app.screenshots}
                  className="sm:col-span-2 lg:col-span-1"
                />
              )}
            </Card>
          ))}
          <div
            className={cn(
              "grid gap-4",
              rest.length === 2 && "md:grid-cols-2",
              rest.length >= 3 && "md:grid-cols-3",
            )}
          >
            {rest.map((app) => (
              <Card
                key={app.name}
                className="flex flex-col gap-5 bg-background/60 p-6"
              >
                {app.screenshots && (
                  <AppScreens screenshots={app.screenshots} />
                )}
                <AppDetails app={app} />
              </Card>
            ))}
          </div>
          {stealth.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 rounded-xl border border-dashed border-border px-6 py-4 text-sm text-foreground/90">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-foreground/10 px-2 py-0.5 text-xs font-semibold text-foreground">
                <span
                  aria-hidden="true"
                  className="size-1.5 rounded-full bg-current"
                />
                In stealth
              </span>
              {stealth.map((project) => (
                <span key={project.name}>
                  <strong className="font-semibold text-foreground">
                    {project.name}
                  </strong>
                  {project.note && <> · {project.note}</>}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
