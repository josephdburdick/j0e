import { SiteFooter } from "@/components/global/SiteFooter"
import { SiteHeader } from "@/components/global/SiteHeader"
import type { Metadata } from "next"

import Experience from "../_content/Experience"
import Recommendations from "../_content/Recommendations"

export const metadata: Metadata = {
  title: "Résumé",
  description:
    "Joe Burdick's full work history and what colleagues say about working with him.",
  alternates: { canonical: "https://j0e.me/resume" },
}

export default function Resume() {
  return (
    <>
      <SiteHeader />
      <main className="shell">
        <section
          aria-labelledby="resume-title"
          className="flex flex-col gap-8 pb-16 pt-16 md:pt-[88px]"
        >
          <h1
            id="resume-title"
            className="display text-[clamp(46px,8.6vw,132px)] leading-[0.96] tracking-[-0.03em]"
          >
            Résumé
          </h1>
          <div className="flex flex-wrap items-baseline justify-between gap-x-16 gap-y-4">
            <p className="max-w-[54ch] text-xl text-dim">
              Every role since 2006, and what the people I worked with wrote
              about the work.
            </p>
            <nav aria-label="On this page" className="label flex gap-6">
              <a href="#experience" className="hover:text-brand">
                Experience
              </a>
              <a href="#endorsements" className="hover:text-brand">
                Endorsements
              </a>
            </nav>
          </div>
        </section>
        <Experience />
        <Recommendations />
      </main>
      <SiteFooter />
    </>
  )
}
