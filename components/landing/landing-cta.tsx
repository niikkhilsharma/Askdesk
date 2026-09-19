import { LandingPrimaryCta } from "@/components/landing/landing-primary-cta"
import { LandingSection } from "@/components/landing/landing-section"

/** Closing call-to-action repeating the primary signup or dashboard link. */
export function LandingCta({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <LandingSection>
      <div className="flex flex-col items-center gap-6 text-center">
        <h2 className="max-w-xl font-heading text-3xl font-semibold tracking-tight text-balance">
          A chatbot for your website. Your customers get answers.
        </h2>
        <LandingPrimaryCta isAuthenticated={isAuthenticated} size="lg" />
      </div>
    </LandingSection>
  )
}
