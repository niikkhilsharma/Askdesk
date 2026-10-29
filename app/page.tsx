import type { Metadata } from "next"

import { auth } from "@/auth"
import { LandingAnalytics } from "@/components/landing/landing-analytics"
import { LandingAudiences } from "@/components/landing/landing-audiences"
import { LandingCta } from "@/components/landing/landing-cta"
import { LandingFaq } from "@/components/landing/landing-faq"
import { LandingFeatures } from "@/components/landing/landing-features"
import { LandingFooter } from "@/components/landing/landing-footer"
import { LandingHeader } from "@/components/landing/landing-header"
import { LandingHero } from "@/components/landing/landing-hero"
import { LandingSecurity } from "@/components/landing/landing-security"
import { LandingSources } from "@/components/landing/landing-sources"
import { LandingSteps } from "@/components/landing/landing-steps"

export const metadata: Metadata = {
  title: "Askdesk — A bot for your website",
  description:
    "Askdesk answers visitors on your site from your website, files, and connected tools. It cites the source, runs only on the sites you name, and can hand the thread to a person.",
}

/** Public Askdesk marketing homepage with a scripted clinic-site preview. */
export default async function Page() {
  const session = await auth()
  const isAuthenticated = Boolean(session?.user)

  return (
    <div className="min-h-svh bg-background">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <LandingHeader isAuthenticated={isAuthenticated} />
      <div id="content">
        <LandingHero isAuthenticated={isAuthenticated} />
        <LandingSteps />
        <LandingFeatures />
        <LandingSources />
        <LandingAudiences />
        <LandingSecurity />
        <LandingAnalytics />
        <LandingFaq />
        <LandingCta isAuthenticated={isAuthenticated} />
      </div>
      <LandingFooter isAuthenticated={isAuthenticated} />
    </div>
  )
}
