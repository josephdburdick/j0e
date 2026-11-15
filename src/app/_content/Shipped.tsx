"use client"

import { AppScreens } from "@/components/global/AppScreens"
import ExternalLink from "@/components/global/ExternalLink"
import RuleHeader from "@/components/global/RuleHeader"
import { useApi } from "@/components/providers/DataProvider"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import type { Screenshot } from "@/lib/screenshots"
import { cn } from "@/lib/utils"
import Image from "next/image"

type AppLink = {
  url: string
  label: string
  badge?: { light: string; dark: string }
}

type StealthProject = { name: string; note?: string }

type App = {
  name: string
  featured?: boolean
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

// Store guidelines require the stores' own badge artwork for this wording.
function StoreBadge({
  link,
  badge,
}: {
  link: AppLink
  badge: NonNullable<AppLink["badge"]>
}) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <Image
        src={badge.light}
        alt={link.label}
        width={120}
        height={40}
        className="h-10 w-auto dark:hidden"
      />
      <Image
        src={badge.dark}
        alt={link.label}
        width={120}
        height={40}
        className="hidden h-10 w-auto dark:block"
      />
    </a>
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
        <div className="flex min-w-0 flex-col items-start gap-1">
          <h4 className="text-base font-semibold leading-tight text-foreground">
            {app.name}
          </h4>
          <StatusPill app={app} />
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
      <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1">
        {app.links.map((link) =>
          link.badge ? (
            <StoreBadge key={link.url} link={link} badge={link.badge} />
          ) : (
            <ExternalLink key={link.url} href={link.url} className="text-sm">
              {link.label}
            </ExternalLink>
          ),
        )}
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
              className="grid items-center gap-6 bg-background/60 p-6 sm:grid-cols-2 sm:gap-8"
            >
              {app.screenshots && (
                <AppScreens title={app.name} screenshots={app.screenshots} />
              )}
              <AppDetails app={app} />
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
                  <AppScreens title={app.name} screenshots={app.screenshots} />
                )}
                <AppDetails app={app} />
              </Card>
            ))}
          </div>
          {stealth.length > 0 && (
            <div className="flex flex-col items-start gap-3 rounded-xl border border-dashed border-border px-5 py-4 text-sm text-foreground/90 sm:flex-row sm:items-center sm:justify-center sm:gap-6">
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-foreground/10 px-2 py-0.5 text-xs font-semibold text-foreground">
                <span
                  aria-hidden="true"
                  className="size-1.5 rounded-full bg-current"
                />
                In stealth
              </span>
              <ul className="grid gap-1.5 sm:flex sm:flex-wrap sm:gap-x-6">
                {stealth.map((project) => (
                  <li key={project.name}>
                    <strong className="font-semibold text-foreground">
                      {project.name}
                    </strong>
                    {project.note && (
                      <span className="text-muted-foreground">
                        {" "}
                        · {project.note}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
