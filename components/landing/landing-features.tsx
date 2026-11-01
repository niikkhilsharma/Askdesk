import {
  CalendarCheck,
  Headset,
  Languages,
  Library,
  ListChecks,
  PenLine,
  Quote,
  RefreshCw,
  Sparkles,
  UserPlus,
  type LucideIcon,
} from "lucide-react"

import { FEATURES } from "@/components/landing/content"
import {
  LandingHeading,
  LandingSection,
} from "@/components/landing/landing-section"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const FEATURE_ICONS: Record<(typeof FEATURES)[number]["id"], LucideIcon> = {
  sources: Quote,
  handoff: Headset,
  trained: Library,
  sync: RefreshCw,
  leads: UserPlus,
  actions: CalendarCheck,
  languages: Languages,
  corrections: PenLine,
  models: Sparkles,
  suggestions: ListChecks,
}

/** Bento of the product capabilities, with two larger product sketches. */
export function LandingFeatures() {
  return (
    <LandingSection id="features" titleId="features-title">
      <LandingHeading
        id="features-title"
        title="Everything your front desk does, without the wait"
        subtitle="One AI agent that answers, captures, books and escalates, trained only on what you give it."
      />
      <ul className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {FEATURES.map((feature) => {
          const Icon = FEATURE_ICONS[feature.id]
          return (
            <li
              key={feature.id}
              className={cn(
                "landing-rise flex flex-col gap-4 rounded-2xl border bg-card p-6 shadow-sm",
                feature.large && "md:col-span-2"
              )}
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                <Icon className="size-5" aria-hidden />
              </div>
              <h3 className="font-heading text-lg font-semibold">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-pretty text-muted-foreground">
                {feature.body}
              </p>
              {feature.id === "sources" ? <SourceVisual /> : null}
              {feature.id === "handoff" ? <HandoffVisual /> : null}
            </li>
          )
        })}
      </ul>
    </LandingSection>
  )
}

/** Chat reply with a source chip, drawn in code. */
function SourceVisual() {
  return (
    <div className="mt-auto rounded-xl border bg-background p-3" aria-hidden>
      <div className="flex items-start gap-2">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
          A
        </div>
        <div className="flex min-w-0 flex-col gap-2">
          <p className="text-sm">We’re open Monday to Friday, 8am to 6pm.</p>
          <Badge variant="outline">pricing.pdf · p.2</Badge>
        </div>
      </div>
    </div>
  )
}

/** Sketch of a chat moving from the agent to a teammate. */
function HandoffVisual() {
  return (
    <div
      className="mt-auto flex flex-col gap-2 rounded-xl border bg-background p-3"
      aria-hidden
    >
      <div className="flex items-center justify-between gap-2 rounded-lg bg-muted px-3 py-2 text-sm">
        <span>AskDesk</span>
        <span className="text-muted-foreground">Answered</span>
      </div>
      <p className="text-center text-xs text-muted-foreground">
        Hands the chat over
      </p>
      <div className="flex items-center justify-between gap-2 rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground">
        <span>Your team</span>
        <span>Joined</span>
      </div>
    </div>
  )
}
