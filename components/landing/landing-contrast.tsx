import { Check, Minus } from "lucide-react"

import { CONTRAST } from "@/components/landing/content"
import {
  LandingHeading,
  LandingSection,
} from "@/components/landing/landing-section"

/** Side-by-side of the inbox problem and the on-site outcome. */
export function LandingContrast() {
  return (
    <LandingSection titleId="contrast-title">
      <LandingHeading
        id="contrast-title"
        title={CONTRAST.title}
        subtitle={CONTRAST.subtitle}
      />
      <div className="mt-12 grid gap-4 md:grid-cols-2">
        <article className="flex flex-col gap-4 rounded-2xl border bg-card p-6 shadow-sm">
          <h3 className="font-heading text-xl font-semibold">
            {CONTRAST.without.title}
          </h3>
          <ul className="flex flex-col gap-3">
            {CONTRAST.without.items.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-sm leading-relaxed"
              >
                <Minus
                  className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                  aria-hidden
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>
        <article className="flex flex-col gap-4 rounded-2xl border bg-card p-6 shadow-sm">
          <h3 className="font-heading text-xl font-semibold">
            {CONTRAST.with.title}
          </h3>
          <ul className="flex flex-col gap-3">
            {CONTRAST.with.items.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-sm leading-relaxed"
              >
                <Check className="mt-0.5 size-4 shrink-0" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </LandingSection>
  )
}
