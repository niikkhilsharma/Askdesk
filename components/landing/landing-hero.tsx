import { LandingMockChat } from "@/components/landing/landing-mock-chat"
import { LandingPrimaryCta } from "@/components/landing/landing-primary-cta"
import { LandingSection } from "@/components/landing/landing-section"

/** Hero with locked sales copy and the scripted clinic-site mock chat. */
export function LandingHero({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <LandingSection className="pt-12 md:pt-20">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col gap-6">
          <h1 className="font-heading text-4xl font-semibold tracking-tight text-balance md:text-5xl">
            A chatbot for your website. Your customers get answers.
          </h1>
          <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">
            Add it in minutes. Visitors ask the same questions they email you —
            hours, pricing, policies — and the bot answers on your site, so your
            team does not have to.
          </p>
          <div>
            <LandingPrimaryCta isAuthenticated={isAuthenticated} size="lg" />
          </div>
        </div>
        <div className="flex justify-center lg:justify-end">
          <LandingMockChat />
        </div>
      </div>
    </LandingSection>
  )
}
