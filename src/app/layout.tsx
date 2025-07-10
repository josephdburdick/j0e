import { DataProvider } from "@/components/providers/DataProvider"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"

import api from "../api"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  userScalable: true,
  themeColor: "#000000",
}

export const metadata: Metadata = {
  title: "Joe Burdick",
  description: "Web Software Engineer",
  keywords: ["software engineer", "web development", "react", "typescript"],
  manifest: "/manifest.json",
  icons: {
    icon: "/icon-192x192.png",
    apple: "/icon-192x192.png",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://j0e.me",
    title: "Joe Burdick",
    description: "Web Software Engineer",
    siteName: "Joe Burdick",
    images: [
      {
        url: "/icon-512x512.png",
        width: 512,
        height: 512,
        alt: "Joe Burdick",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Joe Burdick",
    description: "Web Software Engineer",
    creator: "@josephdburdick",
    images: ["/icon-512x512.png"],
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
