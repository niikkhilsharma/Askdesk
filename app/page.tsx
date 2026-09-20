import type { Metadata } from "next"

import { auth } from "@/auth"
import { LandingAudiences } from "@/components/landing/landing-audiences"
import { LandingContrast } from "@/components/landing/landing-contrast"
import { LandingCta } from "@/components/landing/landing-cta"
import { LandingFooter } from "@/components/landing/landing-footer"
import { LandingHeader } from "@/components/landing/landing-header"
import { LandingHero } from "@/components/landing/landing-hero"
import { LandingPricing } from "@/components/landing/landing-pricing"
import { LandingSteps } from "@/components/landing/landing-steps"

export const metadata: Metadata = {
  title: "Emerald AI — A chatbot for your website",
  description:
    "Add it in minutes. Visitors ask the same questions they email you — hours, pricing, policies — and the bot answers on your site, so your team does not have to.",
}

/** Public Emerald AI marketing homepage with a scripted clinic-site preview. */
export default async function Page() {
  const session = await auth()
  const isAuthenticated = Boolean(session?.user)

  return (
    <div className="min-h-svh bg-background">
      <LandingHeader isAuthenticated={isAuthenticated} />
      <LandingHero isAuthenticated={isAuthenticated} />
      <LandingSteps />
      <LandingAudiences />
      <LandingContrast />
      <LandingPricing isAuthenticated={isAuthenticated} />
      <LandingCta isAuthenticated={isAuthenticated} />
      <LandingFooter />
    </div>
  )
}
