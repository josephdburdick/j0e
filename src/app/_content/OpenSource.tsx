"use client"

import { ContributionGraph } from "@/components/global/ContributionGraph"
import ExternalLink from "@/components/global/ExternalLink"
import RuleHeader from "@/components/global/RuleHeader"
import { useApi } from "@/components/providers/DataProvider"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type ProjectLink = {
  url: string
  label: string
}

type Project = {
  name: string
  description: string
  links: ProjectLink[]
  tags: string[]
}

export default function OpenSource() {
  const { data } = useApi()
  const { title, subtitle, github, projects } = data.projects.attributes

  const renderProject = (project: Project) => (
    <Card
      key={project.name}
      className="flex flex-col justify-between bg-background/60"
    >
      <CardHeader className="pb-3">
        <CardTitle className="break-words text-base">{project.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between gap-4">
        <p className="text-sm text-foreground/90">{project.description}</p>
        <div className="space-y-3">
          <ul className="flex flex-wrap gap-x-2 gap-y-1">
            {project.tags.map((tag) => (
              <li key={tag}>
                <Badge variant="outline" size="sm" className="text-foreground/90">
                  {tag}
                </Badge>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {project.links.map((link) => (
              <ExternalLink key={link.url} href={link.url} className="text-sm">
                {link.label}
              </ExternalLink>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <section
      className="items-center justify-center space-y-8 py-8 lg:py-24 xl:py-36"
      aria-labelledby="open-source-title"
    >
      <div className="container space-y-4">
        <header className="space-y-2 pb-12 text-center">
          <RuleHeader side="both" className="font-light">
            <h2 id="open-source-title" className="text-foreground">
              {title}
            </h2>
          </RuleHeader>
          <div className="prose-scale text-balance text-3xl font-bold">
            <h3 className="text-foreground/90">{subtitle}</h3>
          </div>
        </header>
        <div className="mx-auto max-w-4xl space-y-12">
          <ContributionGraph />
          <div className="grid gap-4 md:grid-cols-2">
            {(projects as Project[]).map(renderProject)}
          </div>
          <RuleHeader side="both" className="flex-grow-0 justify-center">
            <ExternalLink href={github.url} className="text-sm">
              {github.label} on GitHub
            </ExternalLink>
          </RuleHeader>
        </div>
      </div>
    </section>
  )
}
