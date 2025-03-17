"use client"

import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

import Icon from "./Icon"

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const storedPreference = localStorage.getItem("darkMode") === "true"
    setDarkMode(storedPreference)
  }, [])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("darkMode", "true")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("darkMode", "false")
    }
  }, [darkMode])

  return (
    <Button
      variant="secondary"
      className="group relative inline-flex items-center rounded-full border-0 p-0 focus:outline-none"
      onClick={() => setDarkMode(!darkMode)}
      aria-label="Toggle dark mode"
    >
      <div
        className={cn(
          buttonVariants({ variant: "default", size: "lg" }),
          "pointer-events-none absolute right-full z-0 mr-2 translate-x-1/4 whitespace-nowrap rounded-full px-4 py-2 opacity-0 transition-all duration-300 group-hover:-translate-x-0 group-hover:opacity-100",
        )}
      >
        Toggle theme
      </div>
      <div
        className={cn(
          buttonVariants({ variant: "outline", size: "lg" }),
          "rounded-full p-2",
        )}
      >
        {darkMode ? (
          <Icon.sun className="text-yellow-500" />
        ) : (
          <Icon.moon className="foreground text-foreground" />
        )}
      </div>
    </Button>
  )
}

export default DarkModeToggle
