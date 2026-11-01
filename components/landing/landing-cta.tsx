import Link from "next/link"

import { FINAL_CTA } from "@/components/landing/content"
import { LandingPrimaryCta } from "@/components/landing/landing-primary-cta"
import { LandingSection } from "@/components/landing/landing-section"
import { Button } from "@/components/ui/button"

/** Closing signup card. */
export function LandingCta({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <LandingSection>
      <div className="relative overflow-hidden rounded-3xl border bg-card px-6 py-16 text-center shadow-sm">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--muted),transparent_70%)]"
        />
        <div className="relative mx-auto flex max-w-xl flex-col items-center gap-6">
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-balance md:text-4xl">
            {FINAL_CTA.title}
          </h2>
          <p className="text-lg text-muted-foreground">{FINAL_CTA.subtitle}</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <LandingPrimaryCta
              isAuthenticated={isAuthenticated}
              size="lg"
              loggedOutLabel="Build your chatbot free"
            />
            {isAuthenticated ? null : (
              <Button variant="outline" size="lg" asChild>
                <Link href="/login">Log in</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </LandingSection>
  )
}
