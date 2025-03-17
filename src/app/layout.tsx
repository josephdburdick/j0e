import { DataProvider } from "@/components/providers/DataProvider"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"

import api from "../api"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  title: "Joe",
  description: "Lead Software Engineer",
  keywords: ["software engineer", "web development", "react", "typescript"],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://j0e.me",
    title: "Joe",
    description: "Lead Software Engineer",
    siteName: "Joe",
  },
  twitter: {
    card: "summary_large_image",
    title: "Joe",
    description: "Lead Software Engineer",
    creator: "@josephdburdick",
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const data = await api()

  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <DataProvider initialData={data}>{children}</DataProvider>
      </body>
    </html>
  )
}
