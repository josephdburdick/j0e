"use client"

import { type ReactNode, createContext, useContext } from "react"

/** The slice of content client components read; it is serialized into every page. */
export type SiteData = {
  name: string
  logoGifs: string[]
  cta: { label: string; url: string }
}

const DataContext = createContext<SiteData | undefined>(undefined)

export function DataProvider({
  data,
  children,
}: {
  data: SiteData
  children: ReactNode
}) {
  return <DataContext.Provider value={data}>{children}</DataContext.Provider>
}

export const useApi = () => {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useApi must be used within a DataProvider")
  }
  return context
}
