import { DataProvider } from "@/components/providers/DataProvider"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

import api from "../api"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await api()
  const {
    url,
    title,
    keywords,
    description,
    viewport,
    robots,
    openGraph,
    twitter,
  } = meta.attributes
  return {
    title,
    description,
    keywords,
    viewport,
    robots,
    openGraph: {
      ...openGraph,
      url,
      title,
    },
    twitter: {
      ...twitter,
      title,
    },
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const data = await api()

  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <DataProvider initialData={data}>{children}</DataProvider>
      </body>
    </html>
  )
}
