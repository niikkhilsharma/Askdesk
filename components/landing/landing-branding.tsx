"use client"

import { useState } from "react"

import {
  BRANDING_POINTS,
  BRANDING_SWATCHES,
} from "@/components/landing/content"
import {
  LandingHeading,
  LandingSection,
} from "@/components/landing/landing-section"
import { cn } from "@/lib/utils"

const SWATCH_CLASS: Record<(typeof BRANDING_SWATCHES)[number]["id"], string> = {
  ink: "bg-primary",
  blue: "bg-chart-2",
  deep: "bg-chart-4",
  stone: "bg-foreground",
}

/** Live colour preview of a widget that follows the chosen swatch. */
export function LandingBranding() {
  const [accent, setAccent] =
    useState<(typeof BRANDING_SWATCHES)[number]["id"]>("ink")

  return (
    <LandingSection titleId="branding-title">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <LandingHeading
            id="branding-title"
            align="start"
            title="Your brand, not ours"
            subtitle="Match your colours, logo, launcher icon, greeting and tone of voice. Remove AskDesk branding and run it on your own domain."
          />
          <ul className="flex flex-col gap-2">
            {BRANDING_POINTS.map((point) => (
              <li key={point} className="text-sm leading-relaxed">
                {point}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-4 rounded-2xl border bg-card p-6 shadow-sm">
          <div className="flex gap-3" role="group" aria-label="Widget colour">
            {BRANDING_SWATCHES.map((swatch) => (
              <button
                key={swatch.id}
                type="button"
                aria-pressed={accent === swatch.id}
                aria-label={swatch.label}
                onClick={() => setAccent(swatch.id)}
                className={cn(
                  "size-8 rounded-full ring-offset-2 ring-offset-background outline-none focus-visible:ring-3 focus-visible:ring-ring",
                  SWATCH_CLASS[swatch.id],
                  accent === swatch.id && "ring-2 ring-ring"
                )}
              />
            ))}
          </div>
          <div className="overflow-hidden rounded-xl border bg-background">
            <div className={cn("h-2", SWATCH_CLASS[accent])} />
            <div className="flex flex-col gap-3 p-4">
              <div className="flex items-center gap-2">
                <span
                  className={cn("size-8 rounded-full", SWATCH_CLASS[accent])}
                  aria-hidden
                />
                <p className="text-sm font-medium">Northside Dental</p>
              </div>
              <p className="max-w-prose rounded-lg bg-muted px-3 py-2 text-sm">
                Hi — welcome in. Ask about hours, insurance, or a visit.
              </p>
            </div>
          </div>
        </div>
      </div>
    </LandingSection>
  )
}
