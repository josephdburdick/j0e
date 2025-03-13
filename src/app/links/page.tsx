import api from "@/api"
import MainHeader from "@/components/global/MainHeader"
import LinkTree from "@/components/links/LinkTree"
import { ContactLink } from "@/lib/types"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Links",
  description: "All my important links in one place",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
}

export default async function Links() {
  const data = await api()
  const links: ContactLink[] = Object.values(data.profile.attributes.links)
  const name = data.profile.attributes.name || "My Links"

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-background/80">
      <MainHeader className="flex shrink flex-col justify-center gap-3 p-8" />

      <div className="container relative z-20 mx-auto flex flex-1 flex-col px-4">
        <div className="flex flex-1 flex-col items-center justify-center">
          <LinkTree links={links} className="mx-auto w-full max-w-md" />
        </div>
      </div>

      <footer className="shrink py-8 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Present Day</p>
      </footer>
    </div>
  )
}
