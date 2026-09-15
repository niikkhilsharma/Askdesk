"use client"

import { Monitor, Moon, Sun } from "lucide-react"
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

const THEMES = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const

/** Lets the user choose light, dark, or system theme. */
export function ThemeSelector() {
  const { theme, setTheme } = useTheme()
  const selectedTheme = useIsClient() ? theme : undefined

  return (
    <div role="radiogroup" aria-label="Theme" className="flex flex-wrap gap-2">
      {THEMES.map((option) => {
        const isSelected = selectedTheme === option.value
        const Icon = option.icon

        return (
          <Button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            variant={isSelected ? "secondary" : "outline"}
            onClick={() => setTheme(option.value)}
          >
            <Icon data-icon="inline-start" />
            {option.label}
          </Button>
        )
      })}
    </div>
  )
}
