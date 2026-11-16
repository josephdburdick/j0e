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
      <main>
        <h1 className="sr-only">Résumé</h1>
        <Experience />
        <Recommendations />
      </main>
      <SiteFooter />
    </>
  )
}
