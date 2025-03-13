"use client"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleItem,
  CollapsibleTrigger,
} from "@/components/global/Collapsible"
import DateSpan from "@/components/global/DateSpan"
import Icon from "@/components/global/Icon"
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
import { useEffect, useState } from "react"

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

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash
      if (hash) {
        const element = document.querySelector(hash)
        if (element) {
          const headerOffset = 100 // Adjust this value based on your header's height
          const elementPosition = element.getBoundingClientRect().top
          const offsetPosition =
            elementPosition + window.pageYOffset - headerOffset

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          })
        }
      }
    }

    // Call the function on component mount
    handleHashChange()

    // Add event listener for hash changes
    window.addEventListener("hashchange", handleHashChange)

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("hashchange", handleHashChange)
    }
  }, [])

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
              className="grid grid-cols-12 items-center gap-1.5 md:flex-1"
            >
              <div className="col-span-12 gap-1 text-xs text-muted-foreground md:col-span-3 md:col-start-1 xl:col-span-2 xl:text-sm">
                <DateSpan date={role.date} />
              </div>
              <div className="col-span-12 items-center md:col-start-4 md:pl-2">
                <div className="flex justify-between gap-4">
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-start font-normal">
                    <h6 className="font-semibold">{role.title}</h6>
                    {role.location !== undefined && (
                      <span className="hidden lg:inline">{role.location}</span>
                    )}
                    {role.remote !== undefined && (
                      <Badge variant="outline" size="sm">
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
              <div className="col-span-12 space-y-6 md:col-span-9 md:col-start-4">
                <div
                  className="prose-scale-sm dark:prose-invert md:prose"
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
      className="grid gap-2"
    >
      <div className="relative grid grid-cols-12">
        <div className="col-span-12 font-semibold md:col-span-8 md:col-start-4">
          <RuleHeader className="prose-scale-sm flex items-center gap-2">
            <h5>{experience.company}</h5>
          </RuleHeader>
        </div>
      </div>
      <Accordion type="single" collapsible key={`role-${key}`} asChild>
        <ul className="grid-auto-rows grid items-start">
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
    <ul className="grid-auto-rows container mx-auto grid gap-8 md:gap-16">
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
            <h3>{data.experience.attributes.title}</h3>
          </RuleHeader>
          <div className="prose-scale text-balance text-3xl font-bold">
            <h4>{data.experience.attributes.subtitle}</h4>
          </div>
        </header>
      </div>
      <div className="relative flex w-full flex-1">{renderExperiences}</div>
    </section>
  )
}
