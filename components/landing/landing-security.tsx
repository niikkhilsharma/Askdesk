import {
  AppWindow,
  Download,
  Gauge,
  KeyRound,
  Lock,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react"

import { SECURITY_POINTS } from "@/components/landing/content"
import {
  LandingHeading,
  LandingSection,
} from "@/components/landing/landing-section"

const SECURITY_ICONS: Record<
  (typeof SECURITY_POINTS)[number]["id"],
  LucideIcon
> = {
  iframe: AppWindow,
  domains: ShieldCheck,
  private: Lock,
  encryption: KeyRound,
  limits: Gauge,
  control: Download,
}

/** Six trust points about isolation, access, and data control. */
export function LandingSecurity() {
  return (
    <LandingSection titleId="security-title">
      <LandingHeading id="security-title" title="Your data stays yours" />
      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SECURITY_POINTS.map((point) => {
          const Icon = SECURITY_ICONS[point.id]
          return (
            <li
              key={point.id}
              className="flex flex-col gap-3 rounded-2xl border bg-card p-6 shadow-sm"
            >
              <Icon className="size-5" aria-hidden />
              <h3 className="font-heading text-lg font-semibold">
                {point.title}
              </h3>
              <p className="text-sm leading-relaxed text-pretty text-muted-foreground">
                {point.body}
              </p>
            </li>
          )
        })}
      </ul>
      {/* TODO: replace with real certification badges when AskDesk has them. */}
    </LandingSection>
  )
}
