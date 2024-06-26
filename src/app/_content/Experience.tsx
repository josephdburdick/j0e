"use client"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleItem,
  CollapsibleTrigger,
} from "@/components/global/Collapsible"
import DateSpan from "@/components/global/DateSpan"
import RuleHeader from "@/components/global/RuleHeader"
import { useApi } from "@/components/providers/DataProvider"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import convertNewLinesToHTML from "@/lib/convertNewLinesToHTML"
import toKebabCase from "@/lib/toKebabCase"
import { Experience as ExperienceType, Role } from "@/lib/types"
import { cn } from "@/lib/utils"
import { useState } from "react"

export default function Experience() {
  const { data } = useApi()
  const experience: ExperienceType[] = data.experience.attributes.experience
  const [viewAllToggle, setViewAllToggle] = useState(false)
  const renderSkill = (skill: string, key: number) =>
    !!skill ? (
      <li key={key}>
        <Badge variant="default">{skill}</Badge>
      </li>
    ) : null

  const renderRole = (
    role: Role & { company: ExperienceType["company"] },
    index: number,
  ) => {
    const key = `${toKebabCase(role.company)}-${index}`
    return (
      <li className="grid-auto-rows grid gap-4" id={key} key={key}>
        <AccordionItem value={key}>
          <AccordionTrigger>
            <a
              href={`#${toKebabCase(role.company)}`}
              className="grid grid-cols-12 items-center md:flex-1"
            >
              <div className="col-span-12 gap-1 text-xs text-muted-foreground md:col-span-3 md:col-start-1 xl:col-span-2 xl:text-sm">
                <DateSpan date={role.date} />
              </div>
              <div className="col-span-12 items-center md:col-start-4 md:pl-1">
                <div className="flex justify-between gap-4">
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-start text-base font-normal">
                    <span className="font-semibold">{role.title}</span>
                    {role.location !== undefined && (
                      <span className="hidden lg:inline">{role.location}</span>
                    )}
                    {role.remote !== undefined && (
                      <Badge variant="outline">
                        {role.remote ? "remote" : "on-site"}
                      </Badge>
                    )}{" "}
                  </div>
                </div>
              </div>
            </a>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-12">
              <div className="col-span-12 space-y-2 md:col-span-9 md:col-start-4">
                <div
                  className="prose dark:prose-invert"
                  dangerouslySetInnerHTML={{
                    __html: convertNewLinesToHTML(role.description),
                  }}
                ></div>
                <ul className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  {role?.skills?.sort().map(renderSkill)}
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </li>
    )
  }

  const renderExperience = (experience: ExperienceType, key: number) => (
    <li
      key={`experience-${toKebabCase(experience.company)}`}
      id={toKebabCase(experience.company)}
      className="grid gap-2 pt-16 md:pt-10"
    >
      <div className="grid grid-cols-12">
        <div className="col-span-12 font-semibold md:col-span-8 md:col-start-4">
          <RuleHeader>{experience.company}</RuleHeader>
        </div>
      </div>
      <Accordion
        type="single"
        collapsible
        key={`role-${key}`}
        defaultValue={`unqork-0`}
        asChild
      >
        <ul className="grid-auto-rows grid items-start gap-8">
          {experience.roles.map((role, key) =>
            renderRole(
              {
                ...role,
                company: experience.company,
              },
              key,
            ),
          )}
        </ul>
      </Accordion>
    </li>
  )

  const renderExperiences = (
    <div className="container">
      <ul className="grid-auto-rows mx-auto grid gap-16">
        {experience
          .filter((item) => item?.disabled !== true)
          .slice(0, 3)
          .map(renderExperience)}
        {experience.length > 3 && (
          <Collapsible
            type="single"
            collapsible
            onValueChange={(value: string) => setViewAllToggle(!!value)}
          >
            <CollapsibleItem value="expand">
              <CollapsibleContent>
                <ul className="grid-auto-rows grid gap-16">
                  {experience
                    .filter((item) => item?.disabled !== true)
                    .slice(3)
                    .map(renderExperience)}
                </ul>
              </CollapsibleContent>
              <CollapsibleTrigger>
                <RuleHeader side="both">
                  <span className="rounded-full border bg-primary px-4 py-2 text-xs text-primary-foreground">
                    {viewAllToggle ? "View Less" : "View More"} Experience
                  </span>
                </RuleHeader>
              </CollapsibleTrigger>
            </CollapsibleItem>
          </Collapsible>
        )}
      </ul>
    </div>
  )

  return (
    <section
      className={cn(
        "md:py16 min-h-[800px] items-center justify-center space-y-8 bg-secondary py-8 lg:py-24 xl:py-36",
      )}
    >
      <div className="container space-y-4">
        <header className="space-y-2 pb-12 text-center">
          <RuleHeader side="both" className="font-light">
            {data.experience.attributes.title}
          </RuleHeader>
          <h5 className="text-balance text-3xl font-bold">
            {data.experience.attributes.subtitle}
          </h5>
        </header>
      </div>
      <div className="flex w-full flex-1">
        <ul className="grid-auto-rows mx-auto grid gap-16">
          {renderExperiences}
        </ul>
      </div>
    </section>
  )
}
