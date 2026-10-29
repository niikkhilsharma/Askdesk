import { PLACEHOLDER_LOGOS, SOCIAL_PROOF } from "@/components/landing/content"
import { LandingSection } from "@/components/landing/landing-section"

/** Placeholder logo strip for customers the owner will add later. */
export function LandingSocialProof() {
  return (
    <LandingSection muted titleId="social-proof-title">
      <h2
        id="social-proof-title"
        className="mx-auto max-w-2xl text-center text-lg leading-relaxed text-pretty text-muted-foreground"
      >
        {SOCIAL_PROOF}
      </h2>
      <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {PLACEHOLDER_LOGOS.map((logo) => (
          <li
            key={logo.id}
            className="flex h-14 items-center justify-center rounded-xl border bg-card px-3 text-center text-xs font-medium tracking-wide text-muted-foreground uppercase"
          >
            {logo.label}
          </li>
        ))}
      </ul>
    </LandingSection>
  )
}
