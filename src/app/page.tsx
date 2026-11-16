import { SiteFooter } from "@/components/global/SiteFooter"
import { SiteHeader } from "@/components/global/SiteHeader"

import About from "./_content/About"
import ClientWork from "./_content/ClientWork"
import Colleagues from "./_content/Colleagues"
import Hero from "./_content/Hero"
import OpenSource from "./_content/OpenSource"
import Record from "./_content/Record"
import Shipped from "./_content/Shipped"

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="shell flex flex-col text-[17px] leading-[1.55]">
        <Hero />
        <ClientWork />
        <Shipped />
        <OpenSource />
        <Colleagues />
        <Record />
        <About />
      </main>
      <SiteFooter />
    </>
  )
}
