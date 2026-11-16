import api from "@/api"
import { Chapter, ChapterMark } from "@/components/global/Chapter"
import { EngagementList, formatRange } from "@/components/global/EngagementList"
import convertNewLinesToHTML from "@/lib/convertNewLinesToHTML"
import toKebabCase from "@/lib/toKebabCase"
import type { Experience as ExperienceType, Role } from "@/lib/types"

function roleFacts(role: Role) {
  return [
    role.location,
    role.remote === undefined ? undefined : role.remote ? "Remote" : "On-site",
    role.showType ? role.type : undefined,
  ].filter(Boolean)
}

function RoleEntry({ role }: { role: Role }) {
  const facts = roleFacts(role)
  const skills = (role.skills ?? []).filter(Boolean)

  return (
    <li className="flex flex-wrap gap-x-6 gap-y-2 border-t border-line py-6">
      <p className="flex-[0_0_170px] whitespace-nowrap pt-1 font-mono text-[13px] text-dim">
        {formatRange(role.date)}
      </p>
      <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-5">
        <div className="flex flex-col gap-1">
          <h4 className="text-[19px] font-semibold">{role.title}</h4>
          {facts.length > 0 && (
            <p className="text-sm text-dim">{facts.join(" · ")}</p>
          )}
        </div>
        {role.description && (
          <div
            className="rich max-w-[70ch]"
            dangerouslySetInnerHTML={{
              __html: convertNewLinesToHTML(role.description),
            }}
          />
        )}
        {role.engagements && role.engagements.length > 0 && (
          <EngagementList
            engagements={role.engagements}
            className="max-w-[70ch]"
          />
        )}
        {skills.length > 0 && (
          <ul
            aria-label="Skills"
            className="flex max-w-[70ch] flex-wrap gap-1.5 font-mono text-xs text-dim"
          >
            {skills.map((skill) => (
              <li key={skill} className="border border-line px-2 py-1">
                {skill}
              </li>
            ))}
          </ul>
        )}
      </div>
    </li>
  )
}

function CompanyEntry({ item }: { item: ExperienceType }) {
  return (
    <li
      id={toKebabCase(item.company)}
      className="flex scroll-mt-6 flex-col gap-5 border-b border-line pt-8"
    >
      <h3 className="display text-[clamp(24px,2.6vw,32px)] leading-[1.1]">
        {item.url ? (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-4 transition-colors hover:text-brand hover:underline"
          >
            {item.company}
          </a>
        ) : (
          item.company
        )}
      </h3>
      <ul className="flex flex-col">
        {item.roles
          .filter((role) => role.disabled !== true)
          .map((role) => (
            <RoleEntry key={`${role.title}-${role.date.start}`} role={role} />
          ))}
      </ul>
    </li>
  )
}

const year = (value: string) => new Date(value).getUTCFullYear()

export default async function Experience() {
  const data = await api()
  const { title, subtitle } = data.experience.attributes
  const experience: ExperienceType[] =
    data.experience.attributes.experience.filter(
      (item: ExperienceType) => item.disabled !== true,
    )
  const recent = experience.filter((item) => !item.hidden)
  const earlier = experience.filter((item) => item.hidden)
  const earlierRoles = earlier.flatMap((item) => item.roles)
  const earlierFrom = Math.min(
    ...earlierRoles.map((role) => year(role.date.start)),
  )
  const earlierTo = Math.max(
    ...earlierRoles.map((role) => year(role.date.end ?? role.date.start)),
  )

  return (
    <Chapter id="experience" labelledBy="experience-title">
      <div className="flex flex-wrap items-baseline justify-between gap-x-10 gap-y-2">
        <h2 id="experience-title">
          <ChapterMark number="01">{title}</ChapterMark>
        </h2>
        <p className="text-dim">{subtitle}</p>
      </div>
      <div>
        <ul className="flex flex-col border-t-2 border-ink">
          {recent.map((item) => (
            <CompanyEntry key={item.company} item={item} />
          ))}
        </ul>
        {earlier.length > 0 && (
          <details className="group">
            <summary className="flex cursor-pointer list-none flex-wrap items-baseline gap-x-6 gap-y-1 border-b border-line py-6 transition-colors hover:text-brand [&::-webkit-details-marker]:hidden">
              <span className="flex-[0_0_170px] font-mono text-[13px] text-dim">
                {earlierFrom} – {earlierTo}
              </span>
              <span className="flex-1 text-[19px] font-semibold">
                Earlier roles
                <span className="ml-3 font-normal text-dim">
                  {earlier.map((item) => item.company).join(", ")}
                </span>
              </span>
              <span
                aria-hidden="true"
                className="font-mono text-xl leading-none transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <ul className="flex flex-col">
              {earlier.map((item) => (
                <CompanyEntry key={item.company} item={item} />
              ))}
            </ul>
          </details>
        )}
      </div>
    </Chapter>
  )
}
