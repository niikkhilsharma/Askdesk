import type { Metadata } from "next"

import { auth } from "@/auth"
import {
  SITE_DESCRIPTION,
  SITE_TITLE,
  faqJsonLd,
  softwareJsonLd,
} from "@/components/landing/content"
import { LandingAnalytics } from "@/components/landing/landing-analytics"
import { LandingAudiences } from "@/components/landing/landing-audiences"
import { LandingBranding } from "@/components/landing/landing-branding"
import { LandingContrast } from "@/components/landing/landing-contrast"
import { LandingCta } from "@/components/landing/landing-cta"
import { LandingFaq } from "@/components/landing/landing-faq"
import { LandingFeatures } from "@/components/landing/landing-features"
import { LandingFooter } from "@/components/landing/landing-footer"
import { LandingHeader } from "@/components/landing/landing-header"
import { LandingHero } from "@/components/landing/landing-hero"
import { LandingIntegrations } from "@/components/landing/landing-integrations"
import { LandingJsonLd } from "@/components/landing/landing-json-ld"
import { LandingPricing } from "@/components/landing/landing-pricing"
import { LandingSecurity } from "@/components/landing/landing-security"
import { LandingSocialProof } from "@/components/landing/landing-social-proof"
import { LandingSources } from "@/components/landing/landing-sources"
import { LandingSteps } from "@/components/landing/landing-steps"
import { siteUrl } from "@/lib/site-url"

const origin = siteUrl()

export const metadata: Metadata = {
  metadataBase: new URL(origin),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  keywords: [
    "AI chatbot",
    "website chatbot",
    "customer support",
    "knowledge base",
    "embeddable chat widget",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: "/",
    siteName: "AskDesk",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
}

/** Public AskDesk marketing homepage. */
export default async function Page() {
  const session = await auth()
  const isAuthenticated = Boolean(session?.user)

  return (
    <>
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-background focus:px-4 focus:py-2 focus:ring-3 focus:ring-ring"
      >
        Skip to content
      </a>
      <LandingHeader isAuthenticated={isAuthenticated} />
      <main id="content">
        <LandingHero isAuthenticated={isAuthenticated} />
        <LandingSocialProof />
        <LandingContrast />
        <LandingSteps />
        <LandingFeatures />
        <LandingSources />
        <LandingIntegrations />
        <LandingAudiences />
        <LandingBranding />
        <LandingAnalytics />
        <LandingSecurity />
        <LandingPricing isAuthenticated={isAuthenticated} />
        <LandingFaq />
        <LandingCta isAuthenticated={isAuthenticated} />
      </main>
      <LandingFooter />
      <LandingJsonLd data={softwareJsonLd(origin)} />
      <LandingJsonLd data={faqJsonLd()} />
    </>
  )
}
