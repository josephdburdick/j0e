import api from "@/api"
import type { TextLink } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Fragment } from "react"

type Stat = { value: string; label: string }

type NowItem = {
  lead?: string
  name: string
  tail?: string
  href?: string
  links?: TextLink[]
}

const nowLinkClassName =
  "font-semibold text-brand underline underline-offset-4 hover:text-ink"

const listSeparator = (index: number, count: number) =>
  index === 0 ? null : index === count - 1 ? " and " : ", "

export default async function Hero() {
  const data = await api()
  const { eyebrow, headline, lede, cta, secondary, stats } =
    data.hero.attributes
  const now: NowItem | undefined = data.now?.attributes.items?.[0]

  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="flex flex-col gap-11 pb-20 pt-16 md:pt-[88px]"
    >
      <p className="label text-dim">
        {(eyebrow as string[]).map((part, index) => (
          <Fragment key={part}>
            {index > 0 && (
              <span aria-hidden="true" className="text-brand">
                {" / "}
              </span>
            )}
            {part}
          </Fragment>
        ))}
      </p>
      <h1
        id="hero-title"
        className="display text-balance text-[clamp(46px,8.6vw,132px)] leading-[0.96] tracking-[-0.03em]"
      >
        {headline}
      </h1>
      <div className="flex flex-wrap items-start gap-x-16 gap-y-10">
        <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-7">
          <p className="max-w-[54ch] text-xl text-dim">{lede}</p>
          <div className="flex flex-wrap items-center gap-3.5">
            <a
              href={cta.url}
              className="bg-brand px-6 py-[15px] font-semibold text-on-brand transition-colors hover:bg-ink hover:text-paper"
            >
              {cta.label}
            </a>
            <a
              href={secondary.url}
              className="px-2 py-[15px] font-semibold text-ink underline underline-offset-4 transition-colors hover:text-brand"
            >
              {secondary.label}
            </a>
          </div>
        </div>
        <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-6">
          <dl className="flex flex-wrap border-t-2 border-ink">
            {(stats as Stat[]).map((stat) => (
              <div
                key={stat.label}
                className="flex flex-[1_1_130px] flex-col-reverse justify-end gap-1 pr-4 pt-4"
              >
                <dt className="text-sm text-dim">{stat.label}</dt>
                <dd className="display text-[40px] leading-[1.1]">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
          {now && (
            <p className="border-t border-line pt-4 text-[15px] text-dim">
              <span className="label mr-2 text-xs text-brand">Now</span>
              {now.lead && <>{now.lead} </>}
              {now.href ? (
                <a href={now.href} className={nowLinkClassName}>
                  {now.name}
                </a>
              ) : (
                <b className="font-semibold text-ink">{now.name}</b>
              )}
              {now.tail && <> {now.tail}</>}
              {now.links?.map((link, index, links) => (
                <Fragment key={link.href}>
                  {listSeparator(index, links.length) ?? " "}
                  <a
                    href={link.href}
                    className={cn(nowLinkClassName, "whitespace-nowrap")}
                  >
                    {link.label}
                  </a>
                </Fragment>
              ))}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
