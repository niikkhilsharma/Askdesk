"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useSyncExternalStore } from "react"

import { Button } from "@/components/ui/button"

/** Returns true after the component has hydrated on the client. */
function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
}

/** Switches the site between light and dark. */
export function LandingThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useIsClient()
  const isDark = mounted && resolvedTheme === "dark"

  /** Flips the resolved theme. */
  function toggleTheme() {
    setTheme(isDark ? "light" : "dark")
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={toggleTheme}
    >
      {isDark ? <Sun /> : <Moon />}
    </Button>
  )
}
